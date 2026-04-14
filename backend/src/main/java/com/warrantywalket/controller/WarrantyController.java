package com.warrantywalket.controller;

import com.warrantywalket.dto.WarrantyResponse;
import com.warrantywalket.service.CloudinaryService;
import com.warrantywalket.service.OcrJobService;
import com.warrantywalket.service.WarrantyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warranties")
public class WarrantyController {

    @Autowired
    private WarrantyService warrantyService;

    @Autowired
    private OcrJobService ocrJobService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/scan")
    public ResponseEntity<?> scanBill(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();

            WarrantyResponse warranty = warrantyService.scanAndSaveBill(file, username);
            return ResponseEntity.ok(warranty);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to scan bill: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @PostMapping("/scan/async")
    public ResponseEntity<?> scanBillAsync(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();

            // Upload to Cloudinary first — fast, worker needs the URL
            String imageUrl = cloudinaryService.uploadImage(file);

            // Generate unique job ID
            String jobId = UUID.randomUUID().toString();

            // Push to Redis queue — returns instantly
            ocrJobService.pushJob(jobId, username, imageUrl);

            Map<String, String> response = new HashMap<>();
            response.put("jobId", jobId);
            response.put("status", "processing");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to queue scan: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/scan/status/{jobId}")
    public ResponseEntity<?> getScanStatus(@PathVariable String jobId) {
        try {
            return ResponseEntity.ok(ocrJobService.getStatus(jobId));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<WarrantyResponse>> getAllWarranties(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        List<WarrantyResponse> warranties = warrantyService.getUserWarranties(username);
        return ResponseEntity.ok(warranties);
    }

    @GetMapping("/active")
    public ResponseEntity<List<WarrantyResponse>> getActiveWarranties(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        List<WarrantyResponse> warranties = warrantyService.getActiveWarranties(username);
        return ResponseEntity.ok(warranties);
    }

    @GetMapping("/expired")
    public ResponseEntity<List<WarrantyResponse>> getExpiredWarranties(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        List<WarrantyResponse> warranties = warrantyService.getExpiredWarranties(username);
        return ResponseEntity.ok(warranties);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWarranty(
            @PathVariable String id,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();

            warrantyService.deleteWarranty(id, username);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Warranty deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategoryStats(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        List<Map<String, Object>> stats = warrantyService.getCategoryStats(username);
        return ResponseEntity.ok(stats);
    }
}
