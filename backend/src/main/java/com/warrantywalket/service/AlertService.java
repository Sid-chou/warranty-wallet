package com.warrantywalket.service;

import com.warrantywalket.model.User;
import com.warrantywalket.model.Warranty;
import com.warrantywalket.repository.UserRepository;
import com.warrantywalket.repository.WarrantyRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@EnableScheduling
public class AlertService {

    @Autowired
    private WarrantyRepository warrantyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${alert.days.before}")
    private String alertDaysBefore;

    @Scheduled(cron = "0 0 9 * * *") // Run at 9:00 AM every day
    public void checkAndSendExpiryAlerts() {
        String[] daysArray = alertDaysBefore.split(",");
        for (String daysStr : daysArray) {
            int days = Integer.parseInt(daysStr.trim());
            LocalDate targetDate = LocalDate.now().plusDays(days);
            List<Warranty> expiringWarranties = warrantyRepository.findByExpiryDate(targetDate);

            for (Warranty warranty : expiringWarranties) {
                userRepository.findById(warranty.getUserId()).ifPresent(user -> {
                    if (user.isNotificationsEnabled()) {
                        try {
                            sendEmail(user, warranty, days);
                        } catch (MessagingException e) {
                            System.err.println("Failed to send expiry alert email: " + e.getMessage());
                        }
                    }
                });
            }
        }
    }

    private void sendEmail(User user, Warranty warranty, int daysRemaining) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String toEmail = user.getNotificationEmail() != null ? user.getNotificationEmail() : user.getEmail();
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("⚠️ Warranty Expiry Alert: " + warranty.getProductName());

        String content = "<html>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                "<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>" +
                "<h2 style='color: #C0392B;'>Warranty Expiry Alert</h2>" +
                "<p>Hello <strong>" + user.getUsername() + "</strong>,</p>" +
                "<p>This is a reminder that the warranty for your <strong>" + warranty.getProductName() + "</strong> is expiring soon.</p>" +
                "<div style='background-color: #F9F9F9; padding: 15px; border-radius: 5px; margin: 20px 0;'>" +
                "<p style='margin: 5px 0;'><strong>Product:</strong> " + warranty.getProductName() + "</p>" +
                "<p style='margin: 5px 0;'><strong>Expiry Date:</strong> " + warranty.getExpiryDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) + "</p>" +
                "<p style='margin: 5px 0; color: #E67E22;'><strong>Time Remaining:</strong> " + daysRemaining + " day(s)</p>" +
                "</div>" +
                "<p>Keep your digital documents handy! You can log in to <strong>Warranty Wallet</strong> to view more details or export your warranty passport as a PDF.</p>" +
                "<hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>" +
                "<p style='font-size: 12px; color: #888;'>This is an automated notification from Warranty Wallet. You can manage your alert preferences in the app settings.</p>" +
                "</div>" +
                "</body>" +
                "</html>";

        helper.setText(content, true);
        mailSender.send(message);
    }
}
