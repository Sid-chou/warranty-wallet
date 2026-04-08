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

        // Try loading from current directory
        try {
            Dotenv localDotenv = Dotenv.configure().ignoreIfMissing().load();
            localDotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        } catch (Exception ignored) {}

        SpringApplication.run(WarrantyWalletApplication.class, args);
    }
}
