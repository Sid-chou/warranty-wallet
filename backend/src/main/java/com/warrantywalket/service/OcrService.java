package com.warrantywalket.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class OcrService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.models:gemini-2.5-flash,gemini-2.5-flash-lite,gemini-2.0-flash}")
    private String geminiModels;

    @Value("${gemini.retry.max-attempts:3}")
    private int maxAttempts;

    @Value("${gemini.retry.initial-delay-ms:1000}")
    private long initialRetryDelayMs;

    private static final String GEMINI_API_URL_TEMPLATE =
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, String> extractBillDetails(MultipartFile file) {
        try {
            if (geminiApiKey == null || geminiApiKey.isEmpty() || geminiApiKey.equals("${GEMINI_API_KEY}")) {
                throw new RuntimeException("GEMINI_API_KEY environment variable is not set. Cannot run OCR.");
            }

            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            String mimeType = file.getContentType();
            if (mimeType == null || mimeType.isEmpty()) {
                mimeType = "image/jpeg"; // default if unknown
            }

            // Build request JSON safely using building logic in case of string formatting
            // issues
            Map<String, Object> inlineData = new HashMap<>();
            inlineData.put("mime_type", mimeType);
            inlineData.put("data", base64Image);

            Map<String, Object> part1 = new HashMap<>();
            part1.put("text",
                    "Extract warranty and bill information from this receipt/invoice image. Return strictly valid JSON with these exact keys: 'invoice_date' (format dd/MM/yyyy), 'invoice_number', 'serial_number', 'model_number', 'asset_price', 'warranty_period' (e.g. '1 year', '6 months'), 'payment_method', 'merchant_name', 'product_name'. If a value is not found, leave it as an empty string.");

            Map<String, Object> part2 = new HashMap<>();
            part2.put("inline_data", inlineData);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", new Object[] { part1, part2 });

            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("response_mime_type", "application/json");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", new Object[] { content });
            requestBody.put("generationConfig", generationConfig);

            String requestJson = objectMapper.writeValueAsString(requestBody);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> request = new HttpEntity<>(requestJson, headers);

            RuntimeException lastFailure = null;
            for (String model : getCandidateModels()) {
                try {
                    return callGeminiWithRetry(model, request);
                } catch (RuntimeException e) {
                    lastFailure = e;
                    System.err.println("Gemini OCR attempt failed for model " + model + ": " + e.getMessage());
                }
            }

            if (lastFailure != null) {
                throw lastFailure;
            }

            throw new RuntimeException("No Gemini OCR models are configured.");

        } catch (Exception e) {
            System.err.println("Gemini OCR Extraction Error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to extract bill details: " + e.getMessage(), e);
        }
    }

    private List<String> getCandidateModels() {
        return Stream.of(geminiModels.split(","))
                .map(String::trim)
                .filter(model -> !model.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }

    private Map<String, String> callGeminiWithRetry(String model, HttpEntity<String> request) {
        RuntimeException lastFailure = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                String url = String.format(GEMINI_API_URL_TEMPLATE, model, geminiApiKey);
                ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

                if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                    throw new RuntimeException("Gemini API call failed with status " + response.getStatusCode());
                }

                return parseGeminiResponse(response.getBody());
            } catch (HttpStatusCodeException e) {
                String message = "Gemini API call failed for model " + model + " with status "
                        + e.getStatusCode() + ": " + e.getResponseBodyAsString();

                if (!e.getStatusCode().is5xxServerError()) {
                    throw new RuntimeException(message, e);
                }

                lastFailure = new RuntimeException(message, e);
                if (attempt < maxAttempts) {
                    sleepBeforeRetry(attempt);
                }
            } catch (Exception e) {
                lastFailure = new RuntimeException(
                        "Gemini API call failed for model " + model + ": " + e.getMessage(), e);
                break;
            }
        }

        throw lastFailure != null
                ? lastFailure
                : new RuntimeException("Gemini API call failed for model " + model);
    }

    private Map<String, String> parseGeminiResponse(String responseBody) throws Exception {
        JsonNode rootNode = objectMapper.readTree(responseBody);
        JsonNode textNode = rootNode.path("candidates").path(0).path("content").path("parts").path(0).path("text");

        String jsonText = textNode.asText();
        if (jsonText == null || jsonText.trim().isEmpty()) {
            throw new RuntimeException("Gemini returned an empty OCR response.");
        }

        // Clean markdown JSON if present
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.substring(7);
            if (jsonText.endsWith("```")) {
                jsonText = jsonText.substring(0, jsonText.length() - 3);
            }
        }

        JsonNode finalJsonNode = objectMapper.readTree(jsonText.trim());
        Map<String, String> result = new HashMap<>();

        finalJsonNode.fields().forEachRemaining(entry -> {
            result.put(entry.getKey(), entry.getValue().asText());
        });

        return result;
    }

    private void sleepBeforeRetry(int attempt) {
        long delayMs = initialRetryDelayMs * (1L << (attempt - 1));
        try {
            Thread.sleep(delayMs);
        } catch (InterruptedException interruptedException) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Gemini OCR retry interrupted.", interruptedException);
        }
    }
}
