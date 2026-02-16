package com.warrantywalket.controller;

import com.warrantywalket.dto.JwtResponse;
import com.warrantywalket.dto.LoginRequest;
import com.warrantywalket.dto.SignupRequest;
import com.warrantywalket.model.User;
import com.warrantywalket.repository.UserRepository;
import com.warrantywalket.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/test")
    public ResponseEntity<?> testAuth() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Auth endpoint is reachable");
        response.put("timestamp", java.time.Instant.now().toString());
        return ResponseEntity.ok(response);
    }

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @GetMapping("/dbtest")
    public ResponseEntity<?> testDb() {
        Map<String, Object> response = new HashMap<>();
        try {
            long count = userRepository.count();
            response.put("status", "MongoDB connected");
            response.put("userCount", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "MongoDB connection FAILED");
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Username is already taken");
                return ResponseEntity.badRequest().body(error);
            }

            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email is already in use");
                return ResponseEntity.badRequest().body(error);
            }

            // Create new user
            User user = new User(
                    signUpRequest.getUsername(),
                    signUpRequest.getEmail(),
                    passwordEncoder.encode(signUpRequest.getPassword()));

            userRepository.save(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Signup failed: " + e.getMessage());
            error.put("type", e.getClass().getSimpleName());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail()));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed: " + e.getMessage());
            error.put("type", e.getClass().getSimpleName());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
