# CineVault - Complete Setup Guide

## Overview

CineVault is a production-grade IMDb-style entertainment database platform with a comprehensive tech stack:

**Backend:** Node.js + Express + MongoDB + Redis  
**Frontend:** React 18 + TypeScript + Tailwind CSS + TanStack Query  
**Infrastructure:** Docker Compose + Vite

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

- **Docker** and **Docker Compose** (recommended for full stack)
- **Node.js 20+** and **npm 10+** (for local development)
- **Git**

## Quick Start with Docker Compose

### 1. Configure Environment Variables

Edit `.env.local` and set your actual credentials:

```bash
cp .env.local .env.local
# Edit .env.local with your Cloudinary, Google OAuth, SendGrid keys
```

### 2. Start All Services

```bash
docker-compose up -d
```

This starts:
- **MongoDB** (port 27017)
- **Redis** (port 6379)
- **Backend API** (port 5000) - auto-reloads on code changes
- **Frontend** (port 5173) - Vite dev server with HMR

### 3. Access the Application

- **Frontend:** http://localhost:5173
- **API Health:** http://localhost:5000/health
- **API Docs:** http://localhost:5000/api/docs (coming soon)

### 4. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
docker-compose logs -f redis
```

### 5. Stop Services

```bash
docker-compose down
```

## Local Development (Without Docker)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Make sure MongoDB and Redis are running:
# Option 1: Use Docker for just DB services
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin123 mongo:7.0-alpine
docker run -d -p 6379:6379 redis:7-alpine

# Or use your local MongoDB/Redis instances and update .env

# Start backend dev server (with auto-reload)
npm run dev

# Backend runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend/people_choice_frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Frontend runs on http://localhost:5173
```

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

### Database Migrations

After adding a new Mongoose model or changing indexes:

```bash
# Re-run createIndexes on models (Mongoose does this automatically on model creation)
# For manual index management, add a migration script later
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
```

## Common Issues & Troubleshooting

### "Cannot GET /api/v1/auth/register"

**Cause:** Route not found  
**Fix:** Make sure all route files are imported in `app.js`

### "MongooseError: operation `users.insertOne()` buffering timed out"

**Cause:** MongoDB not connecting  
**Fix:** Check MONGO_URI, ensure MongoDB is running, check Docker network

### "CORS error when frontend calls API"

**Cause:** Frontend origin not in ALLOWED_ORIGINS  
**Fix:** Update ALLOWED_ORIGINS in .env and restart backend

### Tokens not persisting on page refresh

**By design!** Access tokens are stored only in React memory. On page refresh:
1. Token is lost (expected)
2. App makes automatic `/auth/refresh` call on mount
3. Refresh cookie is sent automatically → new access token issued
4. If refresh fails, user is logged out

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
9. **Deploy to production** (AWS, Heroku, DigitalOcean, etc.)

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
