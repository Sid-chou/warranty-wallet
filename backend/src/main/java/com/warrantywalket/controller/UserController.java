package com.warrantywalket.controller;

import com.warrantywalket.dto.UserSettingsRequest;
import com.warrantywalket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/settings")
    public ResponseEntity<?> getSettings(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        return userRepository.findByUsername(username)
                .map(user -> {
                    Map<String, Object> settings = new HashMap<>();
                    settings.put("notificationsEnabled", user.isNotificationsEnabled());
                    settings.put("notificationEmail", user.getNotificationEmail());
                    settings.put("username", user.getUsername());
                    settings.put("email", user.getEmail());
                    return ResponseEntity.ok(settings);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/settings")
    public ResponseEntity<?> updateSettings(
            @RequestBody UserSettingsRequest settingsRequest,
            Authentication authentication) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        return userRepository.findByUsername(username)
                .map(user -> {
                    user.setNotificationsEnabled(settingsRequest.isNotificationsEnabled());
                    user.setNotificationEmail(settingsRequest.getNotificationEmail());
                    userRepository.save(user);
                    
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Settings updated successfully");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
