package com.warrantywalket.service;

import com.warrantywalket.model.User;
import com.warrantywalket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;

@Service
public class OAuth2UserProvisioningService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User findOrCreateUser(String provider, OAuth2User oauthUser) {
        String email = extractEmail(provider, oauthUser);

        if (email != null && !email.isBlank()) {
            return userRepository.findByEmail(email)
                    .map(existingUser -> updateMissingEmailPreferences(existingUser, email))
                    .orElseGet(() -> createUser(provider, oauthUser, email));
        }

        return createUser(provider, oauthUser, buildFallbackEmail(provider, oauthUser));
    }

    private User updateMissingEmailPreferences(User user, String email) {
        if (user.getNotificationEmail() == null || user.getNotificationEmail().isBlank()) {
            user.setNotificationEmail(email);
            return userRepository.save(user);
        }
        return user;
    }

    private User createUser(String provider, OAuth2User oauthUser, String email) {
        String username = generateUniqueUsername(buildBaseUsername(provider, oauthUser, email));
        User user = new User(username, email, passwordEncoder.encode(UUID.randomUUID().toString()));

        if (email.endsWith("@oauth.local")) {
            user.setNotificationEmail("");
        }

        return userRepository.save(user);
    }

    private String extractEmail(String provider, OAuth2User oauthUser) {
        Object emailAttr = oauthUser.getAttribute("email");
        if (emailAttr instanceof String email && !email.isBlank()) {
            return email.trim().toLowerCase(Locale.ROOT);
        }

        if ("google".equals(provider)) {
            return null;
        }

        return null;
    }

    private String buildFallbackEmail(String provider, OAuth2User oauthUser) {
        String providerUserId = extractProviderUserId(provider, oauthUser);
        return provider + "_" + providerUserId + "@oauth.local";
    }

    private String buildBaseUsername(String provider, OAuth2User oauthUser, String email) {
        String preferred = oauthUser.getAttribute("login");
        if (preferred == null || preferred.isBlank()) {
            preferred = oauthUser.getAttribute("name");
        }
        if (preferred == null || preferred.isBlank()) {
            preferred = email != null ? email.split("@")[0] : provider + "_user";
        }

        String normalized = Normalizer.normalize(preferred, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[^A-Za-z0-9._-]", "")
                .toLowerCase(Locale.ROOT);

        if (normalized.isBlank()) {
            normalized = provider + "_user";
        }

        return normalized;
    }

    private String generateUniqueUsername(String baseUsername) {
        String candidate = baseUsername;
        int suffix = 1;

        while (userRepository.existsByUsername(candidate)) {
            candidate = baseUsername + suffix;
            suffix++;
        }

        return candidate;
    }

    private String extractProviderUserId(String provider, OAuth2User oauthUser) {
        Object providerId = "github".equals(provider)
                ? oauthUser.getAttribute("id")
                : oauthUser.getAttribute("sub");

        if (providerId == null) {
            providerId = oauthUser.getName();
        }

        return String.valueOf(providerId);
    }
}
