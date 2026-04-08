package com.warrantywalket;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WarrantyWalletApplication {
    
    public static void main(String[] args) {
        // Try loading from root directory (if running from backend/)
        try {
            Dotenv rootDotenv = Dotenv.configure().directory("..").ignoreIfMissing().load();
            rootDotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        } catch (Exception ignored) {}

        try {
            Dotenv localDotenv = Dotenv.configure().ignoreIfMissing().load();
            localDotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
            System.out.println("✅ .env loaded successfully");
        } catch (Exception ignored) {
            System.err.println("❌ .env failed to load");
        }

        SpringApplication.run(WarrantyWalletApplication.class, args);
    }
}
