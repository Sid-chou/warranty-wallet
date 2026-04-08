package com.warrantywalket.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.warrantywalket.dto.WarrantyResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class OcrWorker {

    @Autowired
    private OcrJobService ocrJobService;

    @Autowired
    private WarrantyService warrantyService;

    @Autowired
    private ObjectMapper objectMapper;

    @Scheduled(fixedDelay = 3000) // runs every 3 seconds
    public void processNextJob() {
        try {
            // Pick next job from Redis queue
            Map<String, String> job = ocrJobService.popJob();
            if (job == null) return; // queue empty, do nothing

            String jobId = job.get("jobId");
            String userId = job.get("userId");
            String imageUrl = job.get("imageUrl");

            System.out.println("Processing job: " + jobId);

            // Run OCR + save to MongoDB (the slow part)
            WarrantyResponse result = warrantyService.scanFromImageUrl(imageUrl, userId);

            // Mark done in Redis with result
            ocrJobService.markDone(jobId, objectMapper.writeValueAsString(result));

            System.out.println("Job done: " + jobId);

        } catch (Exception e) {
            System.err.println("Worker error: " + e.getMessage());
        }
    }
}