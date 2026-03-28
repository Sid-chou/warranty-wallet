package com.warrantywalket.dto;

import lombok.Data;

@Data
public class UserSettingsRequest {
    private boolean notificationsEnabled;
    private String notificationEmail;
}
