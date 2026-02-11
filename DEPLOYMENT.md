# 🚀 Quick Deployment Guide - Warranty Wallet

Follow these steps to deploy to **Render** (backend) and **Vercel** (frontend).

---

## 📋 Prerequisites Checklist

- [x] Code pushed to GitHub
- [ ] MongoDB Atlas account and connection string ready
- [ ] Render account (free signup at render.com)
- [ ] Vercel account (free signup at vercel.com)

---

## Step 1: Deploy Backend to Render (15 minutes)

### 1.1 Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select your `warranty-wallet` repository

> ✨ **Good News**: The repository includes `render.yaml` which automatically configures everything!  
> Render will detect this file and use Java runtime instead of Python.

### 1.2 Configure Service Settings (if needed)

If Render doesn't auto-configure from `render.yaml`, manually set:

```
Name: warranty-wallet-backend
Region: Singapore (or closest)
Branch: main
Root Directory: backend
Runtime: Java
Build Command: mvn clean install -DskipTests
Start Command: java -Dspring.profiles.active=prod -jar target/backend-1.0.0.jar
Instance Type: Free
```

⚠️ **CRITICAL**: Must set **Root Directory** to `backend`!

### 1.3 Add Environment Variables

Click "Advanced" → "Add Environment Variable":

```
SPRING_DATA_MONGODB_URI
Value: mongodb+srv://Louisdb1:Louis%402021@cluster0.hzyptba.mongodb.net/warranty_wallet?appName=Cluster0

JWT_SECRET
Value: 5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437

SPRING_PROFILES_ACTIVE  
Value: prod

ALLOWED_ORIGINS
Value: http://localhost:5173
```

### 1.4 Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for build
3. Copy your backend URL: `https://warranty-wallet-backend-xxxx.onrender.com`

✅ **Save this URL** - you'll need it for frontend!

---

## Step 2: Deploy Frontend to Vercel (5 minutes)

### 2.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub `warranty-wallet` repository

### 2.2 Configure Build Settings

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.3 Add Environment Variable

Click "Environment Variables":

```
Name: VITE_API_URL
Value: [YOUR RENDER BACKEND URL from Step 1.4]
```

Example: `https://warranty-wallet-backend-xxxx.onrender.com/api`

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Copy your frontend URL: `https://warranty-wallet-xxxx.vercel.app`

---

## Step 3: Update Backend CORS (2 minutes)

Your backend needs to allow requests from Vercel:

1. Go back to **Render Dashboard**
2. Select your backend service
3. Go to **"Environment"** tab
4. Edit `ALLOWED_ORIGINS`:
   ```
   Value: https://warranty-wallet-xxxx.vercel.app,http://localhost:5173
   ```
   (Use YOUR actual Vercel URL!)
5. Click **"Save Changes"** (auto-redeploys)

---

## Step 4: Test Your Deployment ✅

1. Open your Vercel URL
2. Create a new account (signup)
3. Login
4. Upload a bill/warranty image
5. Verify OCR extraction works

---

## ⚠️ Important Notes

**Render Free Tier:**
- Backend sleeps after 15 min inactivity
- First request takes 30-60 seconds (cold start)

**MongoDB Atlas:**
- Make sure IP whitelist includes `0.0.0.0/0`
- Verify connection string is correct

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Build fails on Render | Check "Root Directory" is set to `backend` |
| CORS error | Verify `ALLOWED_ORIGINS` includes your Vercel URL |
| Can't connect to DB | Check MongoDB connection string encoding |
| Frontend can't reach API | Verify `VITE_API_URL` is correct |

---

## 🎉 You're Live!

Your URLs:
- **Frontend**: `https://warranty-wallet-xxxx.vercel.app`
- **Backend**: `https://warranty-wallet-backend-xxxx.onrender.com`

---

## 📊 Architecture

```
Users → Vercel (React) → Render (Spring Boot) → MongoDB Atlas
```

All running on **FREE tiers**! 🎉
