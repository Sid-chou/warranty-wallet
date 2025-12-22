# Warranty Wallet - Bill OCR & Warranty Management System

A full-stack web application that scans bills using OCR technology and automatically extracts warranty information, tracking expiry dates with real-time countdown timers.

## 🌟 Features

- **📸 Bill Scanning**: Upload bill images and automatically extract warranty details using OCR
- **⏱️ Real-time Countdown**: Live countdown timers showing time remaining until warranty expiry
- **📊 Smart Dashboard**: View all warranties with filtering by status (Active, Expiring Soon, Expired)
- **🔐 User Authentication**: Secure JWT-based authentication system
- **💾 MongoDB Storage**: Store and manage all warranty data in MongoDB
- **🎨 Modern UI**: Clean, professional interface built with Material-UI
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite
- **Material-UI (MUI)** for professional components
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Spring Boot 3.2.0** (Java 17)
- **Spring Security** with JWT authentication
- **Spring Data MongoDB** for database operations
- **Maven** for dependency management

### OCR Service
- **Python 3.x**
- **Tesseract OCR** for text extraction
- **Pillow (PIL)** for image processing

### Database
- **MongoDB** for storing user and warranty data

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17+** (OpenJDK or Oracle JDK)
- **Maven 3.6+**
- **Node.js 18+** and npm
- **Python 3.8+**
- **MongoDB 5.0+** (running locally or remotely)
- **Tesseract OCR** (Download from: https://github.com/tesseract-ocr/tesseract)

### Installing Tesseract OCR

**Windows:**
1. Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Run installer and note the installation path
3. Add Tesseract to your PATH environment variable

**macOS:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd c:\Users\LENOVO\Desktop\mongo\warranty-wallet
```

### 2. Set Up Python OCR Service

```bash
# Install Python dependencies
pip install -r requirements.txt

# Test OCR service (optional)
python ocr_service.py path/to/test/image.png
```

### 3. Set Up Backend (Spring Boot)

```bash
cd backend

# Install dependencies and build
mvn clean install

# Configure MongoDB connection
# Edit src/main/resources/application.properties if needed
```

**Default Configuration:**
- Server Port: `8080`
- MongoDB URI: `mongodb://localhost:27017/warranty_wallet`
- Python Path: `python` (adjust if needed)

### 4. Set Up Frontend (React)

```bash
cd ../frontend

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

The frontend will run on: `http://localhost:5173`

### 5. Start MongoDB

Make sure MongoDB is running:

```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or start manually
mongod
```

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 📖 Usage Guide

### 1. Create an Account
- Navigate to `http://localhost:5173`
- Click "Sign Up" and create your account
- Login with your credentials

### 2. Scan Your First Bill
- Click the "Scan Bill" button in the dashboard
- Drag and drop a bill image or click to browse
- The system will automatically extract warranty details
- View the countdown timer and expiry date

### 3. Manage Warranties
- Filter warranties by status using the tabs
- Expand cards to view full details
- Delete warranties you no longer need
- Watch real-time countdown timers

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/warranty_wallet

# File Upload
spring.servlet.multipart.max-file-size=10MB

# Python OCR
ocr.python.path=python
ocr.script.path=../ocr_service.py

# JWT Secret (change in production!)
jwt.secret=your-secret-key-here
jwt.expiration=86400000
```

### Frontend Configuration

Edit `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 📁 Project Structure

```
warranty-wallet/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/warrantywalket/
│   │   ├── config/            # Security & CORS config
│   │   ├── controller/        # REST controllers
│   │   ├── dto/               # Data transfer objects
│   │   ├── model/             # MongoDB entities
│   │   ├── repository/        # MongoDB repositories
│   │   ├── security/          # JWT & authentication
│   │   └── service/           # Business logic
│   └── pom.xml                # Maven dependencies
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── App.jsx            # Main app component
│   └── package.json           # npm dependencies
├── ocr_service.py             # Python OCR script
├── ocring.py                  # Original OCR script
└── requirements.txt           # Python dependencies
```

## 🎨 Features Showcase

### Warranty Expiry Countdown
- **Green (Active)**: More than 30 days remaining
- **Yellow (Expiring Soon)**: 7-30 days remaining  
- **Red (Expired)**: Less than 7 days or expired

### OCR Extraction
The system automatically extracts:
- Invoice/Bill Number
- Invoice Date
- Product Name
- Serial Number
- Model Number
- Price/Amount
- Warranty Period
- Merchant/Store Name
- Payment Method

## 🐛 Troubleshooting

### OCR Not Working
- Ensure Tesseract is installed and in PATH
- Check Python path in `application.properties`
- Verify Python dependencies are installed

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check connection URI in `application.properties`
- Create database manually if needed

### CORS Errors
- Check CORS configuration in `SecurityConfig.java`
- Verify frontend URL matches allowed origins

### JWT Token Errors
- Clear browser localStorage
- Re-login to get a new token

## 📝 API Documentation

### Authentication Endpoints

**POST** `/api/auth/signup`
- Register new user
- Body: `{ username, email, password }`

**POST** `/api/auth/login`
- Login and get JWT token
- Body: `{ username, password }`

### Warranty Endpoints (Authenticated)

**POST** `/api/warranties/scan`
- Upload and scan bill
- Body: FormData with `file`

**GET** `/api/warranties`
- Get all user warranties

**GET** `/api/warranties/active`
- Get active warranties only

**GET** `/api/warranties/expired`
- Get expired warranties only

**DELETE** `/api/warranties/{id}`
- Delete a warranty

## 🔒 Security

- Passwords are encrypted using BCrypt
- JWT tokens for stateless authentication
- CORS enabled for frontend origin only
- File upload size limits enforced
- Input validation on all endpoints

## 🚀 Future Enhancements

- [ ] Email notifications for expiring warranties
- [ ] Export warranties to PDF
- [ ] Multiple image formats support
- [ ] OCR accuracy improvements
- [ ] Mobile app version
- [ ] Cloud deployment guide

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Created with ❤️ for warranty management

## 🙏 Acknowledgments

- Tesseract OCR for text extraction
- Spring Boot for robust backend framework
- Material-UI for beautiful components
- MongoDB for flexible data storage
