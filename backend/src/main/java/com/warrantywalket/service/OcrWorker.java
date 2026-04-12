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
    private final ExecutorService jobExecutor = Executors.newSingleThreadExecutor();

    @Scheduled(fixedDelay = 3000)
    public void processNextJob() {
        Map<String, String> job = null;
        String jobId = null;

        try {
            job = ocrJobService.popJob();
            if (job == null) return;

            jobId = job.get("jobId");
            String userId = job.get("userId");
            String imageUrl = job.get("imageUrl");

            System.out.println("Processing job: " + jobId);

            // Capture for lambda
            final String finalJobId = jobId;
            final String finalUserId = userId;
            final String finalImageUrl = imageUrl;

            Future<WarrantyResponse> future = jobExecutor.submit(() ->
                warrantyService.scanFromImageUrl(finalImageUrl, finalUserId)
            );

            // Hard ceiling — entire job must finish within 45s
            WarrantyResponse result = future.get(45, TimeUnit.SECONDS);
            ocrJobService.markDone(jobId, objectMapper.writeValueAsString(result));
            System.out.println("Job done: " + jobId);

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
        }
    }
}