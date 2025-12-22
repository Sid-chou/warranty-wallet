package com.warrantywalket.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "warranties")
public class Warranty {

    @Id
    private String id;

    private String userId;

    // Extracted Bill Details
    private String invoiceNumber;
    private LocalDate invoiceDate;
    private String serialNumber;
    private String modelNumber;
    private String assetPrice;
    private String warrantyPeriod; // e.g., "1 year", "6 months"
    private String paymentMethod;
    private String merchantName;
    private String productName;

    // Calculated Fields
    private LocalDate expiryDate;
    private Long daysRemaining;
    private String status; // "ACTIVE", "EXPIRING_SOON", "EXPIRED"

    // Image Storage
    private String imagePath;

    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Warranty(String userId) {
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
