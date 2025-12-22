package com.warrantywalket.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class WarrantyResponse {

    private String id;
    private String invoiceNumber;
    private LocalDate invoiceDate;
    private String serialNumber;
    private String modelNumber;
    private String assetPrice;
    private String warrantyPeriod;
    private String paymentMethod;
    private String merchantName;
    private String productName;
    private LocalDate expiryDate;
    private Long daysRemaining;
    private String status;
    private String imagePath;
}
