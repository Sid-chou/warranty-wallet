package com.warrantywalket.service;

import com.warrantywalket.dto.WarrantyResponse;
import com.warrantywalket.model.Warranty;
import com.warrantywalket.repository.WarrantyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.client.RestTemplate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WarrantyService {

    @Autowired
    private WarrantyRepository warrantyRepository;

    @Autowired
    private OcrService ocrService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private CategoryService categoryService;

    public WarrantyResponse scanAndSaveBill(MultipartFile file, String userId) throws IOException {
        // Extract bill details using Gemini OCR
        Map<String, String> extractedData = ocrService.extractBillDetails(file);

        // Upload to Cloudinary
        String imageUrl = cloudinaryService.uploadImage(file);

        // Create warranty entity
        Warranty warranty = new Warranty(userId);
        warranty.setInvoiceNumber(extractedData.get("invoice_number"));
        warranty.setSerialNumber(extractedData.get("serial_number"));
        warranty.setModelNumber(extractedData.get("model_number"));
        warranty.setAssetPrice(extractedData.get("asset_price"));
        warranty.setWarrantyPeriod(extractedData.get("warranty_period"));
        warranty.setPaymentMethod(extractedData.get("payment_method"));
        warranty.setMerchantName(extractedData.get("merchant_name"));
        warranty.setProductName(extractedData.get("product_name"));
        warranty.setCategory(categoryService.categorize(warranty.getProductName(), warranty.getMerchantName()));
        warranty.setImagePath(imageUrl);

        // Parse and set invoice date
        String invoiceDateStr = extractedData.get("invoice_date");
        if (invoiceDateStr != null && !invoiceDateStr.isEmpty()) {
            warranty.setInvoiceDate(parseDate(invoiceDateStr));
        }

        // Calculate expiry date and status
        calculateWarrantyExpiry(warranty);

        // Save to database
        warranty = warrantyRepository.save(warranty);

        return mapToResponse(warranty);
    }

    public WarrantyResponse scanFromImageUrl(String imageUrl, String userId) throws IOException {
        // Download image from Cloudinary as bytes
        RestTemplate restTemplate = new RestTemplate();
        byte[] imageBytes = restTemplate.getForObject(imageUrl, byte[].class);

        if (imageBytes == null) {
            throw new RuntimeException("Failed to download image from: " + imageUrl);
        }

        // Convert bytes to MultipartFile so OcrService can process it
        MultipartFile multipartFile = new MockMultipartFile(
            "file",
            "warranty.jpg",
            "image/jpeg",
            imageBytes
        );

        // Reuse existing OCR logic
        Map<String, String> extractedData = this.ocrService.extractBillDetails(multipartFile);

        // Everything below is same as scanAndSaveBill()
        Warranty warranty = new Warranty(userId);
        warranty.setInvoiceNumber(extractedData.get("invoice_number"));
        warranty.setSerialNumber(extractedData.get("serial_number"));
        warranty.setModelNumber(extractedData.get("model_number"));
        warranty.setAssetPrice(extractedData.get("asset_price"));
        warranty.setWarrantyPeriod(extractedData.get("warranty_period"));
        warranty.setPaymentMethod(extractedData.get("payment_method"));
        warranty.setMerchantName(extractedData.get("merchant_name"));
        warranty.setProductName(extractedData.get("product_name"));
        warranty.setCategory(this.categoryService.categorize(
            warranty.getProductName(), 
            warranty.getMerchantName()
        ));
        warranty.setImagePath(imageUrl);

        String invoiceDateStr = extractedData.get("invoice_date");
        if (invoiceDateStr != null && !invoiceDateStr.isEmpty()) {
            warranty.setInvoiceDate(this.parseDate(invoiceDateStr));
        }

        this.calculateWarrantyExpiry(warranty);
        warranty = this.warrantyRepository.save(warranty);
        return this.mapToResponse(warranty);
    }

    public List<WarrantyResponse> getUserWarranties(String userId) {
        List<Warranty> warranties = warrantyRepository.findByUserIdOrderByExpiryDateAsc(userId);

        // Update status and backfill category for all warranties
        warranties.forEach(w -> {
            calculateWarrantyExpiry(w);
            if (w.getCategory() == null || w.getCategory().isEmpty()) {
                w.setCategory(categoryService.categorize(w.getProductName(), w.getMerchantName()));
            }
        });
        warrantyRepository.saveAll(warranties);

        return warranties.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<WarrantyResponse> getActiveWarranties(String userId) {
        return getUserWarranties(userId).stream()
                .filter(w -> "ACTIVE".equals(w.getStatus()) || "EXPIRING_SOON".equals(w.getStatus()))
                .collect(Collectors.toList());
    }

    public List<WarrantyResponse> getExpiredWarranties(String userId) {
        return getUserWarranties(userId).stream()
                .filter(w -> "EXPIRED".equals(w.getStatus()))
                .collect(Collectors.toList());
    }

    public void deleteWarranty(String warrantyId, String userId) {
        Warranty warranty = warrantyRepository.findById(warrantyId)
                .orElseThrow(() -> new RuntimeException("Warranty not found"));

        if (!warranty.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this warranty");
        }

        // Delete image from Cloudinary
        try {
            if (warranty.getImagePath() != null && warranty.getImagePath().startsWith("http")) {
                cloudinaryService.deleteImage(warranty.getImagePath());
            } else if (warranty.getImagePath() != null) {
                // Fallback for old local files if any exist
                Files.deleteIfExists(Paths.get(warranty.getImagePath()));
            }
        } catch (Exception e) {
            System.err.println("Failed to delete image: " + e.getMessage());
        }

        warrantyRepository.delete(warranty);
    }

    private void calculateWarrantyExpiry(Warranty warranty) {
        if (warranty.getInvoiceDate() == null || warranty.getWarrantyPeriod() == null) {
            warranty.setStatus("UNKNOWN");
            return;
        }

        LocalDate invoiceDate = warranty.getInvoiceDate();
        String warrantyPeriod = warranty.getWarrantyPeriod().toLowerCase();

        LocalDate expiryDate = calculateExpiryDate(invoiceDate, warrantyPeriod);
        warranty.setExpiryDate(expiryDate);

        LocalDate today = LocalDate.now();
        long daysRemaining = ChronoUnit.DAYS.between(today, expiryDate);
        warranty.setDaysRemaining(daysRemaining);

        if (daysRemaining < 0) {
            warranty.setStatus("EXPIRED");
        } else if (daysRemaining <= 7) {
            warranty.setStatus("EXPIRING_SOON");
        } else {
            warranty.setStatus("ACTIVE");
        }

        warranty.setUpdatedAt(LocalDateTime.now());
    }

    private LocalDate calculateExpiryDate(LocalDate invoiceDate, String warrantyPeriod) {
        // Parse warranty period like "1 year", "6 months", "2 years"
        String[] parts = warrantyPeriod.trim().split("\\s+");
        if (parts.length >= 2) {
            try {
                int amount = Integer.parseInt(parts[0]);
                String unit = parts[1].toLowerCase();

                if (unit.startsWith("year")) {
                    return invoiceDate.plusYears(amount);
                } else if (unit.startsWith("month")) {
                    return invoiceDate.plusMonths(amount);
                } else if (unit.startsWith("day")) {
                    return invoiceDate.plusDays(amount);
                }
            } catch (NumberFormatException e) {
                // If parsing fails, default to 1 year
            }
        }

        // Default: 1 year warranty
        return invoiceDate.plusYears(1);
    }

    private LocalDate parseDate(String dateStr) {
        // Try multiple date formats
        String[] formats = {
                "dd/MM/yyyy", "dd-MM-yyyy", "dd.MM.yyyy",
                "yyyy/MM/dd", "yyyy-MM-dd", "yyyy.MM.dd",
                "dd/MM/yy", "dd-MM-yy"
        };

        for (String format : formats) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
                LocalDate date = LocalDate.parse(dateStr, formatter);

                // If year is parsed as 2-digit, adjust
                if (date.getYear() < 100) {
                    date = date.plusYears(2000);
                }

                return date;
            } catch (Exception e) {
                // Try next format
            }
        }

        // If all formats fail, return today's date
        return LocalDate.now();
    }

    private WarrantyResponse mapToResponse(Warranty warranty) {
        WarrantyResponse response = new WarrantyResponse();
        response.setId(warranty.getId());
        response.setInvoiceNumber(warranty.getInvoiceNumber());
        response.setInvoiceDate(warranty.getInvoiceDate());
        response.setSerialNumber(warranty.getSerialNumber());
        response.setModelNumber(warranty.getModelNumber());
        response.setAssetPrice(warranty.getAssetPrice());
        response.setWarrantyPeriod(warranty.getWarrantyPeriod());
        response.setPaymentMethod(warranty.getPaymentMethod());
        response.setMerchantName(warranty.getMerchantName());
        response.setProductName(warranty.getProductName());
        response.setExpiryDate(warranty.getExpiryDate());
        response.setDaysRemaining(warranty.getDaysRemaining());
        response.setStatus(warranty.getStatus());
        response.setCategory(warranty.getCategory());
        response.setImagePath(warranty.getImagePath());
        return response;
    }

    public List<Map<String, Object>> getCategoryStats(String userId) {
        List<WarrantyResponse> warranties = getUserWarranties(userId);
        Map<String, Long> counts = warranties.stream()
                .collect(Collectors.groupingBy(
                        w -> (w.getCategory() != null && !w.getCategory().isEmpty()) ? w.getCategory() : "Other",
                        Collectors.counting()
                ));
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("name", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());
    }
}
