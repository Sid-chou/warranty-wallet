# Project Update Log

## 2026-03-28 22:45 - Phase 2: Power Features Implementation
**New Features:**
- **PDF Export Engine**: Integrated `jsPDF` in frontend. Users can now download a professional 2-page "Warranty Passport" with OCR data and bill imagery.
- **Email Expiry System**: Added `AlertService` with daily cron jobs (9AM). Sends branded HTML alerts at 30, 7, and 1-day intervals.
- **Functional Settings**: Enabled users to toggle notification preferences and set alert emails in the UI.

**Technical Changes:**
- Added `spring-boot-starter-mail` dependency.
- Updated `User` model with `notificationsEnabled` and `notificationEmail` fields.
- Created `UserController` and `pdfService.js`.
- Configured SMTP placeholders in `.env`.

---

# Project Updates Tracker

This document tracks all major architectural changes, bug fixes, model replacements, and design decisions made to the Warranty Wallet app over time.

---

## 📅 March 28, 2026 - Phase 1: Cloud-Native Migration & OCR Model Replacement

**Major Architectural Changes:**
*   **Database Cloud Migration:** Configured the `application.properties` to force connections via the `MONGODB_URI` environment variable, setting up the application to strictly run against MongoDB Atlas instead of local instances.
*   **Image Storage Migration:** Added `Cloudinary SDK` for image hosting. Prevented the app from modifying the local server filesystem (`/uploads`) to support stateless deployment (like Render/Vercel). Replaced all local `MultipartFile` handlers in `WarrantyService` with `CloudinaryService.uploadImage()`.
*   **Docker Optimization:** Overhauled the `Dockerfile` to strip out all Python, `pip`, and `tesseract-ocr` system dependencies. The container is now a highly optimized, lightweight standard Java 17 JRE image.

**Model / Feature Replacements:**
*   **Replaced OCR Model:** Deprecated the local Python `pytesseract` and ImageFilter engine. The OCR service now uses the **Gemini 2.5 Flash API** via a direct REST call (`RestTemplate`). 
*   **Extraction Improvements:** The new Gemini prompting strictly enforces valid JSON extraction without relying on brittle regex pattern matching, guaranteeing significantly higher accuracy on unstructured or poorly formatted invoices.

**Bug Fixes & Refactors:**
*   Refactored `WarrantyService.deleteWarranty` to permanently delete orphaned images directly from Cloudinary using `CloudinaryService.deleteImage()`.
*   Cleaned up unused `java.io`, `java.nio`, and `java.util.UUID` imports and suppressed generic `Map` warnings resulting from the Cloudinary API response.

## ?? March 28, 2026 - Security Fixes
**Bug Fixes & Refactors:**
*   **Rotated Leaked Secrets:** Removed sensitive DB/API credentials from .env file since they were visible in source control. Replaced with placeholders to enforce key rotation.
*   **Added Environment Example:** Created .env.example as a safe template.
*   **Cleared Port 8080:** Ensured no stale process is holding port 8080, preventing Web server failed to start errors.
