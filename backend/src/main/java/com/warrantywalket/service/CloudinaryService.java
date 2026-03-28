package com.warrantywalket.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Value("${cloudinary.url}")
    private String cloudinaryUrl;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        if (cloudinaryUrl != null && !cloudinaryUrl.isEmpty() && !cloudinaryUrl.equals("${CLOUDINARY_URL}")) {
            cloudinary = new Cloudinary(cloudinaryUrl);
        } else {
            throw new RuntimeException("CLOUDINARY_URL environment variable is not set.");
        }
    }

    public String uploadImage(MultipartFile file) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return uploadResult.get("secure_url").toString();
    }

    public void deleteImage(String imageUrl) {
        try {
            // Extract publicId from the secure_url
            // Example URL: https://res.cloudinary.com/demo/image/upload/v1612345/public_id_here.jpg
            String[] parts = imageUrl.split("/");
            String filename = parts[parts.length - 1];
            String publicId = filename.substring(0, filename.lastIndexOf('.'));
            
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
        }
    }
}
