# CineVault - Local Development Setup

## Overview

CineVault is a production-grade IMDb-style entertainment database platform. This project is configured for **local development only** (no Docker).

**Backend:** Node.js + Express + MongoDB + Redis  
**Frontend:** React 18 + TypeScript + Tailwind CSS + TanStack Query

## Project Structure

```
people_choice/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Redis, Email, Passport config
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routes
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── services/        # Business logic (email, cache, ratings)
│   │   ├── validations/     # Request validation schemas
│   │   ├── utils/           # Helpers (tokens, logging, errors)
│   │   ├── jobs/            # Cron jobs (popularity calc, cache cleanup)
│   │   ├── app.js          # Express setup
│   │   └── server.js       # Entry point
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/people_choice_frontend/
│   ├── src/
│   │   ├── api/            # API service functions
│   │   ├── components/     # React components (ui, layout, shared)
│   │   ├── features/       # Feature-specific components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores (auth, ui)
│   │   ├── types/          # TypeScript types
│   │   ├── lib/            # Axios, query client, utils
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.tsx
│   ├── package.json
│   ├── Dockerfile
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── index.html
├── docker-compose.yml
└── .env.local
```

## Prerequisites

- **Node.js 20+** and **npm 10+**
- **MongoDB 7.0+** (local installation or MongoDB Atlas)
- **Redis 7+** (local installation)
- **Git**

## Quick Start (Local Development)

### 1. Install MongoDB & Redis

**Option A: Using Homebrew (macOS)**
```bash
# MongoDB
brew install mongodb-community
brew services start mongodb-community

# Redis
brew install redis
brew services start redis
```

**Option B: Using Windows**
- Download MongoDB: https://www.mongodb.com/try/download/community
- Download Redis from Windows Subsystem for Linux (WSL2) or use:
  ```powershell
  # If you have Chocolatey
  choco install mongodb redis
  ```

**Option C: Manual MongoDB & Redis**
```bash
# MongoDB - download and run from https://www.mongodb.com/try/download/community
# Redis - download and run from https://redis.io/download

# Or use managed services:
# - MongoDB Atlas: https://www.mongodb.com/cloud/atlas
# - Redis Cloud: https://redis.com/try-free/
```

### 2. Configure Environment Variables

```bash
# Copy .env.local to both backend and frontend
cp .env.local backend/.env
cp .env.local frontend/people_choice_frontend/.env
```

Edit `backend/.env` (critical settings):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/cinevault
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your_super_secret_access_key_12345
JWT_REFRESH_SECRET=your_super_secret_refresh_key_12345
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

If using **MongoDB Atlas** (cloud):
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cinevault
```

### 3. Start Backend Server

```bash
cd backend

# Install dependencies
npm install

# Start with auto-reload (uses nodemon)
npm run dev

# Backend runs on http://localhost:5000
# Health check: http://localhost:5000/health
```

### 4. Start Frontend Dev Server

In a **new terminal**:

```bash
cd frontend/people_choice_frontend

# Install dependencies
npm install

# Start with HMR
npm run dev

# Frontend runs on http://localhost:5173
```

### 5. Verify Everything Works

**Test Auth Flow:**
1. Go to http://localhost:5173/register
2. Create an account (check browser DevTools → Storage → Cookies for `refreshToken`)
3. Go to http://localhost:5173/login
4. Login with your account
5. Open Zustand DevTools to see auth store with access token

**Test API:**
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

## Prerequisites (Removed)

- ~~Docker~~ (not needed)
- ~~Docker Compose~~ (not needed)

## Authentication Flow

### JWT Token Management

1. **Registration / Login**
   - User sends email + password
   - Server validates, hashes password, creates user
   - Returns `accessToken` (15m) in response + `refreshToken` (7d) in httpOnly cookie
   - Frontend stores `accessToken` in React memory (lost on refresh)

2. **Authenticated Requests**
   - Frontend sends `Authorization: Bearer {accessToken}` header
   - Backend verifies token signature and expiry
   - Rejects if invalid → returns 401

3. **Token Refresh**
   - On 401, axios interceptor automatically calls `POST /api/v1/auth/refresh`
   - Cookie is auto-sent (httpOnly)
   - Server validates refresh token, issues new access token
   - Frontend retries original request with new token
   - If refresh fails → logout user → redirect to /login

4. **Logout**
   - Frontend calls `POST /api/v1/auth/logout`
   - Backend blacklists refresh token in Redis
   - Frontend clears access token from memory
   - Refresh cookie is cleared

## API Endpoints

### Auth Routes (`/api/v1/auth`)

```
POST   /register          — Register new user
POST   /login             — Login user
POST   /logout            — Logout (requires auth)
POST   /refresh           — Refresh access token
POST   /verify-email      — Verify email with token
POST   /forgot-password   — Request password reset
POST   /reset-password    — Reset password with token
```

### Other Routes (Coming Next)

- `/api/v1/titles` — Movie/TV catalog
- `/api/v1/people` — Actor/Director profiles
- `/api/v1/reviews` — Ratings & reviews
- `/api/v1/users` — User profiles & lists
- `/api/v1/search` — Full-text search
- `/api/v1/admin` — Admin panel

## Frontend Features (Implemented)

✅ **Authentication**
- Login/Register with form validation (React Hook Form + Zod)
- Protected routes with role-based access
- Auto token refresh on 401
- Persistent auth store (Zustand)

✅ **UI Framework**
- Tailwind CSS dark theme
- CineVault color scheme (gold #f5c518)
- Responsive layout
- Error boundaries

✅ **State Management**
- Auth store (user, access token, loading state)
- UI store (theme, sidebar)
- React Query for server state

## Frontend Features (Coming Next)

- Home page with hero carousel & trending titles
- Browse/Filter page with infinite scroll
- Title detail page with reviews, cast, episodes
- Person profile with filmography
- Search with autocomplete
- User dashboard & watchlist
- Review writing & moderation
- Admin panel with charts
- Image uploads to Cloudinary

## Backend Features (Implemented)

✅ **Core Infrastructure**
- Express app with CORS, helmet, rate limiting
- MongoDB connection with pooling
- Redis initialization for caching
- Winston logging (file + console)
- Global error handler
- Async handler wrapper

✅ **Authentication & Authorization**
- JWT (access + refresh tokens)
- bcryptjs password hashing (12 rounds)
- Rate limiting on auth endpoints (5/min)
- Email verification workflow
- Password reset with token expiry

✅ **User Model**
- Registration with local or Google OAuth
- Email verification & reset tokens
- Watchlist & watched titles
- Role-based access (user, critic, admin)

## Backend Features (Coming Next)

- Title model & CRUD endpoints
- Person (actor/director) model & endpoints
- Review system with aggregated scores
- Watchlist & list management
- Search with MongoDB $text indexes
- Image uploads to Cloudinary
- Cron jobs for trending calculation
- Admin dashboard endpoints
- Swagger API documentation

## Environment Variables

### Required

```env
# Server
PORT                      # Default: 5000
NODE_ENV                  # development/production
MONGO_URI                 # MongoDB connection string
REDIS_URL                # Redis connection string

# JWT
JWT_ACCESS_SECRET        # Asymmetric key (RS256 in production)
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRE        # Default: 15m
JWT_REFRESH_EXPIRE       # Default: 7d

# Frontend
CLIENT_URL               # http://localhost:5173
ALLOWED_ORIGINS          # Comma-separated CORS origins
```

### Optional (for features coming next)

```env
# Cloudinary (image CDN)
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

# Google OAuth
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL

# SendGrid (email)
SENDGRID_API_KEY
FROM_EMAIL
```

## Development Workflows

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend/people_choice_frontend
npm test
```

### Linting & Formatting

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend/people_choice_frontend
npm run lint
npm run type-check
```

### Building for Production

```bash
# Frontend build
cd frontend/people_choice_frontend
npm run build  # Creates dist/ folder

# Backend doesn't need build (Node runs .js directly)
# Just install dependencies in production: npm ci
```

## Environment Files

### Backend (.env)

```env
# Required
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/cinevault
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_secret_key_min_32_chars

# Optional (for features coming next)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
SENDGRID_API_KEY=your_api_key
FROM_EMAIL=noreply@cinevault.com

# Frontend
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Common Issues & Troubleshooting

### "Cannot connect to MongoDB"

**Cause:** MongoDB not running  
**Fix:**
```bash
# Check MongoDB status
mongosh  # If this works, MongoDB is running

# If not running:
# macOS: brew services start mongodb-community
# Windows: Start MongoDB service or run mongod.exe
# Cloud: Ensure MongoDB Atlas IP whitelist includes your IP
```

### "Cannot connect to Redis"

**Cause:** Redis not running  
**Fix:**
```bash
# Check Redis status
redis-cli ping  # Should return PONG

# If not running:
# macOS: brew services start redis
# Windows: redis-server.exe or use WSL
# Cloud: Ensure Redis Cloud firewall allows your IP
```

### "MongooseError: operation `users.insertOne()` buffering timed out"

**Cause:** MongoDB taking too long to respond or auth failure  
**Fix:**
```bash
# Verify connection string in .env
MONGO_URI=mongodb://localhost:27017/cinevault

# For MongoDB Atlas:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cinevault

# Test connection:
mongosh "mongodb://localhost:27017/cinevault"
```

### "CORS error when frontend calls API"

**Cause:** Frontend origin not in ALLOWED_ORIGINS  
**Fix:** Update `backend/.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Then restart backend: `npm run dev`

### "Port 5000 already in use"

**Cause:** Another process using the port  
**Fix:**
```bash
# macOS/Linux
lsof -i :5000  # Find process
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env:
PORT=5001
```

### "Port 5173 already in use"

**Cause:** Another Vite dev server running  
**Fix:** Vite will auto-increment to 5174 or 5175, or kill the process using 5173

### Tokens not persisting on page refresh

**By design!** This is the secure pattern:
1. Token is lost on refresh (expected)
2. App makes automatic `/auth/refresh` call on mount
3. Refresh cookie is sent automatically → new access token issued
4. If refresh fails, user is logged out (expected)

### "Module not found" errors

**Cause:** Dependencies not installed  
**Fix:**
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend/people_choice_frontend && npm install
```

### "Cannot find module 'dotenv'"

**Cause:** .env file not loaded or missing dependencies  
**Fix:**
```bash
cd backend
npm install
# Restart: npm run dev
```

### "Cannot GET /api/v1/auth/register"

**Cause:** Route not registered in app.js  
**Fix:** Check that authRoutes are imported in `app.js`:
```javascript
import authRoutes from './routes/authRoutes.js';
app.use('/api/v1/auth', authRoutes);
```

This is the secure pattern.

## Next Steps

1. **Build remaining models** (Title, Person, Review, List)
2. **Create corresponding routes & controllers**
3. **Implement search with MongoDB $text indexes**
4. **Add image upload endpoints** (Cloudinary)
5. **Build React pages** (Home, Browse, TitleDetail, etc.)
6. **Implement cron jobs** (trending scores, cache cleanup)
7. **Create admin panel**
8. **Write integration tests**
9. **Deploy to production**

## Production Deployment

For production, you'll need:

- **Node.js hosting:** Vercel, Heroku, Railway, AWS EC2, DigitalOcean
- **Database:** MongoDB Atlas or self-hosted MongoDB
- **Cache:** Redis Cloud or self-hosted Redis
- **Images:** Cloudinary CDN
- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront

Example deployment with Railway.app:
```bash
# Push to GitHub
# Connect repository to Railway
# Set environment variables in Railway dashboard
# Deploy with one click
```

## Contributing

Follow the working rules:

1. Schema → Validation → Controller → Route → Hook → Component
2. Always use async/await, wrap controllers in asyncHandler
3. Include .lean() & .select() on list queries
4. Document Redis cache keys and TTLs
5. Write TypeScript in React, define all prop types
6. Handle loading/error/empty states in UI components
7. Use React Hook Form + Zod for all forms
8. Add indexes to all Mongoose schemas

## Resources

- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [IMDb](https://www.imdb.com/) — Design reference

---

**Status:** ✅ Backend scaffolding complete | React setup complete | 🔄 Building features

**Last Updated:** May 1, 2026
