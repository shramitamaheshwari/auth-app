# Vault — Full-Stack Auth App

```
/auth-app
├── /backend
│   ├── /middleware
│   │   └── auth.js          # JWT protect middleware
│   ├── /models
│   │   └── User.js          # Mongoose user model (bcrypt hashing)
│   ├── /routes
│   │   ├── auth.js          # POST /api/auth/signup, /api/auth/login
│   │   └── user.js          # GET /api/user/me, /api/user/dashboard (protected)
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── server.js            # Express entry point
│
└── /frontend
    ├── index.html           # Auth page (login + signup tabs)
    ├── dashboard.html       # Protected dashboard
    ├── style.css            # Full stylesheet
    └── app.js               # Frontend logic + fetch API calls
```

## Setup

### Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend
```bash
# Serve frontend/index.html via any static server
# e.g.: npx serve frontend
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/signup | No | Register new user |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/user/me | Bearer JWT | Get current user |
| GET | /api/user/dashboard | Bearer JWT | Dashboard data |
| GET | /api/health | No | Health check |
