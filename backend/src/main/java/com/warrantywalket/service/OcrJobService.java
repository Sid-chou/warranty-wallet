package com.warrantywalket.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.lettuce.core.api.sync.RedisCommands;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class OcrJobService {

    private static final String QUEUE_KEY = "ocr:queue";
    private static final String STATUS_PREFIX = "ocr:status:";
    private static final String RESULT_PREFIX = "ocr:result:";

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

    // Called by frontend polling
    public String getStatus(String jobId) {
        String status = redisCommands.get(STATUS_PREFIX + jobId);
        return status != null ? status : "not_found";
    }

    // Called by frontend when status is "done"
    public String getResult(String jobId) {
        return redisCommands.get(RESULT_PREFIX + jobId);
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
        redisCommands.set(STATUS_PREFIX + jobId, "failed:" + reason);
        redisCommands.expire(STATUS_PREFIX + jobId, 3600);
    }
}