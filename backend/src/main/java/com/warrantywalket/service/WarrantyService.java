package com.warrantywalket.service;

import com.warrantywalket.dto.WarrantyResponse;
import com.warrantywalket.model.Warranty;
import com.warrantywalket.repository.WarrantyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WarrantyService {

    @Autowired
    private WarrantyRepository warrantyRepository;

    @Autowired
    private OcrService ocrService;

    private String getUploadDir() {
        // Use absolute path in user's warranty-wallet directory
        String projectDir = System.getProperty("user.dir");
        // Go up one level from backend to warranty-wallet root
        Path uploadPath = Paths.get(projectDir).getParent().resolve("uploads");
        return uploadPath.toString();
    }

    public WarrantyResponse scanAndSaveBill(MultipartFile file, String userId) throws IOException {
        // Save uploaded file
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        Path uploadPath = Paths.get(getUploadDir());
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(uniqueFilename);
        file.transferTo(filePath.toFile());

        // Extract bill details using OCR
        Map<String, String> extractedData = ocrService.extractBillDetails(filePath.toString());

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
        warranty.setImagePath(filePath.toString());

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

    public List<WarrantyResponse> getUserWarranties(String userId) {
        List<Warranty> warranties = warrantyRepository.findByUserIdOrderByExpiryDateAsc(userId);

        // Update status for all warranties
        warranties.forEach(this::calculateWarrantyExpiry);
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

        // Delete image file
        try {
            Files.deleteIfExists(Paths.get(warranty.getImagePath()));
        } catch (IOException e) {
            // Log error but continue with deletion
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
        response.setImagePath(warranty.getImagePath());
        return response;
    }
}
