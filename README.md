# Warranty Wallet

Warranty Wallet is a full-stack warranty management app that turns purchase bills into structured, searchable warranty records. Users upload a receipt image, the backend extracts warranty data with Gemini, stores the original bill in Cloudinary, calculates expiry dates, and surfaces everything in a React dashboard with reminders and PDF export.

## Highlights

- Scan bill images and extract invoice date, invoice number, product name, serial number, model number, merchant, payment method, price, and warranty period
- Calculate expiry dates automatically and classify records as `ACTIVE`, `EXPIRING_SOON`, or `EXPIRED`
- Store original bill images in Cloudinary instead of relying on local files
- Export a "Warranty Passport" PDF with structured data and the original bill image
- Send scheduled email reminders 30, 7, and 1 day before warranty expiry
- Support username/password login with optional Google and GitHub OAuth
- Keep user preferences for notifications in a dedicated settings flow

## How It Works

```text
React + Vite frontend
    ->
Spring Boot API
    -> Gemini 2.5 Flash for receipt extraction
    -> MongoDB for users and warranties
    -> Cloudinary for bill image storage
    -> SMTP for scheduled email alerts
```

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite 7, Material UI 7, React Router 7, Axios |
| Backend | Spring Boot 3.2, Java 17, Spring Security, JWT, OAuth2 Client |
| Data | MongoDB |
| AI and OCR | Gemini 2.5 Flash |
| Storage | Cloudinary |
| Documents | jsPDF, jspdf-autotable |
| Alerts | Spring Mail, scheduled jobs |
| Deployment | Docker, Render, Vercel |

## Repository Layout

```text
warranty-wallet/
|-- backend/                     Spring Boot API
|   |-- src/main/java/com/warrantywalket/
|   |   |-- config/              security and app configuration
|   |   |-- controller/          REST endpoints
|   |   |-- dto/                 request and response models
|   |   |-- model/               MongoDB entities
|   |   |-- repository/          data access
|   |   |-- security/            JWT and OAuth2 handling
|   |   `-- service/             OCR, alerts, Cloudinary, business logic
|   `-- src/main/resources/
|       `-- application.properties
|-- frontend/                    React application
|   |-- src/components/          layout, upload, and warranty cards
|   |-- src/pages/               login, dashboard, settings, reports, categories
|   `-- src/services/            API client and PDF export
|-- Dockerfile                   backend container build
|-- render.yaml                  backend deployment config
|-- vercel.json                  frontend SPA routing config
|-- ocr_service.py               legacy Tesseract prototype
|-- ocring.py                    earlier OCR experiment
`-- requirements.txt             Python dependencies for legacy OCR scripts
```

## Important Note About OCR

The active application flow does not use the root Python OCR script. The running backend uses [`backend/src/main/java/com/warrantywalket/service/OcrService.java`](backend/src/main/java/com/warrantywalket/service/OcrService.java) and sends receipt images to Gemini for structured extraction.

Files such as `ocr_service.py`, `ocring.py`, and `requirements.txt` are older prototype artifacts kept in the repository.

## Local Development

### Prerequisites

- Java 17+
- Maven 3.9+
- Node.js current LTS, with Node 20+ recommended for the Vite toolchain
- MongoDB instance, local or Atlas
- Cloudinary account
- Gemini API key
- SMTP credentials if you want email reminders
- Optional Google and GitHub OAuth app credentials

### Backend Environment Variables

Set these before starting the backend:

| Variable | Required | Purpose |
| --- | --- | --- |
| `SPRING_DATA_MONGODB_URI` | Yes | MongoDB connection string |
| `MONGODB_DATABASE` | No | Database name, defaults to `warranty_wallet` |
| `JWT_SECRET` | Yes | Secret used to sign JWTs |
| `JWT_EXPIRATION` | No | Token lifetime in milliseconds, defaults to `86400000` |
| `CLOUDINARY_URL` | Yes | Cloudinary connection URL |
| `GEMINI_API_KEY` | Yes | Gemini API key for receipt extraction |
| `ALLOWED_ORIGINS` | No | CORS origin list, defaults to `http://localhost:5173` |
| `FRONTEND_URL` | No | Frontend base URL, defaults to `http://localhost:5173` |
| `SMTP_EMAIL` | No | Sender email for alert notifications |
| `SMTP_PASSWORD` | No | Sender app password for SMTP |
| `GOOGLE_CLIENT_ID` | No | Enable Google OAuth |
| `GOOGLE_CLIENT_SECRET` | No | Enable Google OAuth |
| `GITHUB_CLIENT_ID` | No | Enable GitHub OAuth |
| `GITHUB_CLIENT_SECRET` | No | Enable GitHub OAuth |
| `PORT` | No | Backend port, defaults to `8080` |

Example PowerShell session:

```powershell
$env:SPRING_DATA_MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/<db>"
$env:JWT_SECRET="replace-this-with-a-long-random-secret"
$env:CLOUDINARY_URL="cloudinary://<key>:<secret>@<cloud-name>"
$env:GEMINI_API_KEY="<your-gemini-api-key>"
$env:ALLOWED_ORIGINS="http://localhost:5173"
$env:FRONTEND_URL="http://localhost:5173"
```

### Start The Backend

```powershell
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080` by default.

### Start The Frontend

Create `frontend/.env` if you want to point the UI at a custom backend:

```env
VITE_API_URL=http://localhost:8080/api
```

Then run:

```powershell
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

## Core API Routes

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT |
| `GET` | `/api/auth/oauth/providers` | List enabled OAuth providers |
| `POST` | `/api/warranties/scan` | Upload a bill image and create a warranty record |
| `GET` | `/api/warranties` | Fetch all warranties for the authenticated user |
| `GET` | `/api/warranties/active` | Fetch active and expiring warranties |
| `GET` | `/api/warranties/expired` | Fetch expired warranties |
| `DELETE` | `/api/warranties/{id}` | Delete a warranty and its stored bill image |
| `GET` | `/api/user/settings` | Load notification settings |
| `PUT` | `/api/user/settings` | Update notification preferences |

Protected routes require a bearer token except the public auth endpoints.

## Deployment Notes

- `Dockerfile` builds and runs the backend as a Spring Boot container.
- `render.yaml` is prepared for deploying the backend on Render.
- `vercel.json` rewrites all frontend routes to `index.html` so client-side routing works on Vercel.
- Production deployments must provide the same environment variables listed above.

## Current Scope

The end-to-end flow for authentication, bill upload, extraction, warranty storage, PDF export, and notification preferences is present in the codebase.

The `Reports` and `Categories` pages exist, but they are currently lightweight UI placeholders rather than full analytics modules.
