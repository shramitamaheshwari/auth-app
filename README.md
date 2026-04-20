# 🚀 Vault — Full-Stack Authentication App

A secure, full-stack authentication system with user signup/login, JWT-based authorization, and a protected dashboard — deployed live on the cloud.

---

## 🌐 Live Demo

- 🔗 Frontend: https://your-app.netlify.app  
- ⚙️ Backend API: https://auth-app-y8l2.onrender.com  

---

## 🧩 Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript  
- Backend: Node.js, Express.js  
- Database: MongoDB Atlas  
- Authentication: JWT + bcrypt  
- Deployment: Netlify (frontend), Render (backend)

---

## 📁 Project Structure

/auth-app
├── /backend
│   ├── /middleware
│   │   └── auth.js
│   ├── /models
│   │   └── User.js
│   ├── /routes
│   │   ├── auth.js
│   │   └── user.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── /frontend
    ├── index.html
    ├── dashboard.html
    ├── style.css
    └── app.js

---

## ✨ Features

- Secure user authentication (Signup & Login)
- Password hashing using bcrypt
- JWT-based authorization
- Protected API routes
- MongoDB database integration
- Fully deployed (frontend + backend)
- Simple and responsive UI

---

## 📸 Screenshots

Login Page → images/image.png  
Dashboard → images/image2.png

---

## ⚙️ Setup Instructions

Backend:
cd backend  
npm install  

Create .env:
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
PORT=5000  

Run:
npm start  

Frontend:
Open frontend/index.html  
or  
npx serve frontend  

---

## 📡 API Endpoints

POST /api/auth/signup  
POST /api/auth/login  
GET /api/user/me  
GET /api/user/dashboard  
GET /api/health  

---

## 🔐 Authentication Flow

1. User signs up or logs in  
2. Server validates credentials  
3. JWT token is generated  
4. Token stored in browser  
5. Protected routes require token  

---

## 🚀 Deployment

Frontend → Netlify  
Backend → Render  
Database → MongoDB Atlas  

---

## 👩‍💻 Author

Shramita Maheshwari

