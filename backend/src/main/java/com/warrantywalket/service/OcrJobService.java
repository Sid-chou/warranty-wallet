package com.warrantywalket.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.lettuce.core.api.sync.RedisCommands;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OcrJobService {

    private static final String QUEUE_KEY = "ocr:queue";
    private static final String STATUS_PREFIX = "ocr:status:";
    private static final String RESULT_PREFIX = "ocr:result:";
    private static final int AVG_JOB_SECONDS = 22;

    @Autowired
    private RedisCommands<String, String> redisCommands;

    @Autowired
    private ObjectMapper objectMapper;

    // Called by controller — pushes job to queue
    public String pushJob(String jobId, String userId, String imageUrl) throws Exception {
        Map<String, String> job = new HashMap<>();
        job.put("jobId", jobId);
        job.put("userId", userId);
        job.put("imageUrl", imageUrl);

        redisCommands.lpush(QUEUE_KEY, objectMapper.writeValueAsString(job));
        redisCommands.set(STATUS_PREFIX + jobId, "pending");
        return jobId;
    }

    // Called by controller for status polling — returns rich object for frontend
    public Map<String, Object> getStatus(String jobId) {
        String status = redisCommands.get(STATUS_PREFIX + jobId);
        long queueDepth = redisCommands.llen(QUEUE_KEY);

        Map<String, Object> response = new HashMap<>();
        response.put("status", status != null ? status : "not_found");
        response.put("queuePosition", queueDepth);
        response.put("estimatedWaitSeconds", queueDepth * AVG_JOB_SECONDS);

        if ("done".equals(status)) {
            response.put("data", redisCommands.get(RESULT_PREFIX + jobId));
        }

        return response;
    }

    // Called by worker to pick up next job
    public Map<String, String> popJob() throws Exception {
        String raw = redisCommands.rpop(QUEUE_KEY);
        if (raw == null) return null;
        return objectMapper.readValue(raw, Map.class);
    }

    // Called by worker when OCR succeeds
    public void markDone(String jobId, String resultJson) {
        redisCommands.set(STATUS_PREFIX + jobId, "done");
        redisCommands.set(RESULT_PREFIX + jobId, resultJson);
        redisCommands.expire(STATUS_PREFIX + jobId, 3600);
        redisCommands.expire(RESULT_PREFIX + jobId, 3600);
    }

    // Called by worker when OCR fails
    public void markFailed(String jobId, String reason) {
        redisCommands.setex(STATUS_PREFIX + jobId, 3600, "failed:" + reason);
        String deadEntry = jobId + "|" + reason + "|" + Instant.now();
        redisCommands.lpush("ocr:dead", deadEntry);
    }

    public long getQueueSize() {
        return redisCommands.llen(QUEUE_KEY);
    }
}