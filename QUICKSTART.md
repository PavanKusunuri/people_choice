# CineVault - Quick Start Guide

## 30 Second Setup

### Prerequisites: Make sure you have installed:
- **Node.js 20+** → https://nodejs.org/
- **MongoDB 7+** → https://www.mongodb.com/try/download/community (or use MongoDB Atlas)
- **Redis 7+** → https://redis.io/download (or use Redis Cloud)

### Step 1: Start MongoDB & Redis
```bash
# macOS
brew services start mongodb-community
brew services start redis

# Windows/Other: Follow official installation guides
# Or use cloud: MongoDB Atlas + Redis Cloud
```

### Step 2: Backend Setup (Terminal 1)
```bash
cd backend
npm install
cp ../env.local .env
npm run dev
```
✅ Backend running on http://localhost:5000

### Step 3: Frontend Setup (Terminal 2)
```bash
cd frontend/people_choice_frontend
npm install
npm run dev
```
✅ Frontend running on http://localhost:5173

### Step 4: Test It Out
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Create account
4. See your access token in browser DevTools → Application → Cookies

---

## Commands Reference

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server with auto-reload |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run lint` | Check code style |
| `npm run type-check` | Check TypeScript types |

---

## Need Help?

See [SETUP.md](./SETUP.md) for detailed troubleshooting and configuration options.

---

## API Endpoints Ready Now

```bash
# Register
POST http://localhost:5000/api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

# Login
POST http://localhost:5000/api/v1/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

# Logout
POST http://localhost:5000/api/v1/auth/logout

# Health Check
GET http://localhost:5000/health
```

---

## Next: Building Features

See [SETUP.md](./SETUP.md) for roadmap and next steps.
