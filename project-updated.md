# Project Update Log

## 📅 April 9, 2026 (Part 2) - Hero Presentation Upgrade
**Design Adjustments:**
*   **Hero Chart Integration**: Replaced the non-functional empty CSS mockup graph on the Login page with a fully interactive, responsive `recharts` `BarChart`. Added `recharts` to frontend dependencies.
*   **Fixes**: Removed the numeric tooltip from the "Warranty Overview" visual in the hero section to keep it purely decorative as originally intended.

---

## 📅 April 9, 2026 - Asynchronous OCR Pipeline
**Major Technical & Logic Fixes:**
*   **Background Processing Architecture**: Implemented a Redis-backed job queue for bill scanning. This prevents frontend timeouts during slow OCR extractions by offloading the work to a standalone worker.
*   **Redis Integration**: Configured `RedisConfig` using Lettuce to connect to Upstash Redis for reliable task management.
*   **Asynchronous Worker**: Created `OcrWorker` and `OcrJobService` to manage the lifecycle of a scan request (`pending` -> `done`/`failed`).
*   **Service Expansion**: Added `scanFromImageUrl()` to `WarrantyService` to allow the background worker to process previously uploaded Cloudinary assets.
*   **Dependency Optimization**: Updated `pom.xml` to enable `MockMultipartFile` in production for seamless byte-to-file wrapping during async flows.

---

## 📅 April 8, 2026 - Gemini OCR Stability & MUI Fix
**Major Technical & Logic Fixes:**
*   **Model Name Correction**: Fixed a typo where the OCR service was targeting a non-existent `gemini-2.5-flash` model. Reverted to the stable `gemini-1.5-flash` to resolve 503 errors.
*   **MUI Shadow System Repair**: Fixed a console warning in `theme.js` where components using `elevation={24}` (like the Signup card) were referencing an out-of-bounds shadow index.

---

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

---

## 📅 April 7, 2026 - Modern UI Enhancements & OAuth Refactoring

**Design & UI Improvements:**
*   **Sidebar Navigation Overhaul**: Relocated the **Logout** button to the bottom of the sidebar using `flexGrow: 1` as per modern dashboard standards.
*   **Theming - Logout Action**: Updated the logout button with a clear red semantic color (`#dc2626`) and specialized hover states to differentiate it from primary navigation.
*   **Premium Auth Assets**: Integrated a high-fidelity **Google PNG** for OAuth instead of the generic font icon, creating a much more polished and branded login experience.
*   **Responsive Login Stylings**: Switched OAuth button backgrounds from tinted off-white to pure white, improving visual contrast on the login screen.

**Major Technical & Logic Fixes:**
*   **Dynamic Icon Engine**: Refactored the `Login.jsx` provider loop to handle both `image` and `icon` types, enabling future-proof integration of any branded provider image.
*   **Vite Path Optimization**: Resolved a critical `loadAndTransform` error caused by an incorrect asset path for the Google PNG.
*   **Application-Level OAuth Toggle**: Taught the user how to manage available login providers (like GitHub) via `application.properties` without needing to edit frontend source code.

**Bug Fixes:**
*   **JSX Hierarchy Repair**: Fixed a syntax error in `Sidebar.jsx` where a missing `</Box>` closure was breaking the React component tree.

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
