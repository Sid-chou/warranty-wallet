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
