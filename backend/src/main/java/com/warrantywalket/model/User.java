package com.warrantywalket.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;

    private Set<String> roles = new HashSet<>();

    private boolean notificationsEnabled = true;

    private String notificationEmail;

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.notificationEmail = email; // Default to login email
        this.roles.add("ROLE_USER");
    }
}
