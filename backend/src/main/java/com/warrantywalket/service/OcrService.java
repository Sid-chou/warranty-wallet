package com.warrantywalket.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

@Service
public class OcrService {

    @Value("${ocr.python.path}")
    private String pythonPath;

    @Value("${ocr.script.path}")
    private String scriptPath;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, String> extractBillDetails(String imagePath) {
        try {
            // Execute Python script
            ProcessBuilder processBuilder = new ProcessBuilder(
                    pythonPath,
                    scriptPath,
                    imagePath);

            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            // Read output
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));

            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("OCR process failed with exit code: " + exitCode);
            }

            // Parse JSON output
            JsonNode jsonNode = objectMapper.readTree(output.toString());
            Map<String, String> result = new HashMap<>();

            jsonNode.fields().forEachRemaining(entry -> {
                result.put(entry.getKey(), entry.getValue().asText());
            });

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to extract bill details: " + e.getMessage(), e);
        }
    }
}
