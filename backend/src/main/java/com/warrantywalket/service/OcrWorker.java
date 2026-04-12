package com.warrantywalket.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.warrantywalket.dto.WarrantyResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.*;

@Component
public class OcrWorker {

    @Autowired
    private OcrJobService ocrJobService;

    @Autowired
    private WarrantyService warrantyService;

    @Autowired
    private ObjectMapper objectMapper;

    // Declared as field — created once, not every 3 seconds
    private final ExecutorService jobExecutor = Executors.newFixedThreadPool(2);
    private final Semaphore geminiSlots = new Semaphore(2); // caps concurrent Gemini calls

    @Scheduled(fixedDelay = 3000)
    public void processNextJob() {
        // Don't pop a job if both Gemini slots are already in use
        if (!geminiSlots.tryAcquire()) return;

        Map<String, String> job = null;
        String jobId = null;

        try {
            job = ocrJobService.popJob();
            if (job == null) {
                geminiSlots.release(); // no job found, free the slot immediately
                return;
            }

            jobId = job.get("jobId");
            final String finalJobId = jobId;
            final String finalUserId = job.get("userId");
            final String finalImageUrl = job.get("imageUrl");

            System.out.println("Processing job: " + finalJobId);

            Future<WarrantyResponse> future = jobExecutor.submit(() ->
                warrantyService.scanFromImageUrl(finalImageUrl, finalUserId)
            );

            // Hard ceiling — entire job must finish within 45s
            WarrantyResponse result = future.get(45, TimeUnit.SECONDS);
            ocrJobService.markDone(finalJobId, objectMapper.writeValueAsString(result));
            System.out.println("Job done: " + finalJobId);

        } catch (TimeoutException e) {
            System.err.println("Job " + jobId + " timed out after 45s");
            if (jobId != null) ocrJobService.markFailed(jobId, "job_timeout");

        } catch (ExecutionException e) {
            System.err.println("Job " + jobId + " failed: " + e.getCause().getMessage());
            if (jobId != null) ocrJobService.markFailed(jobId, e.getCause().getMessage());

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            if (jobId != null) ocrJobService.markFailed(jobId, "worker_interrupted");

        } catch (Exception e) {
            System.err.println("Worker error: " + e.getMessage());
            if (jobId != null) ocrJobService.markFailed(jobId, e.getMessage());

        } finally {
            geminiSlots.release(); // always release, no matter what happened
        }
    }
}