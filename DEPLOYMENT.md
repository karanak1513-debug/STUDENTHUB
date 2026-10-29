# Scholara OS — Production Deployment & Operations Guide 🚀

This repository is fully configured, secured, and ready for deployment across both **frontend** and **backend**.

---

## 1. Architecture Overview

- **Frontend**: React 19 + Vite 8 + Tailwind CSS 3.4 with React Router and Material Symbols. Built to `frontend/dist`.
- **Backend**: Node.js + Express 4.21 with security headers (nosniff, SAMEORIGIN, XSS filter), sliding-window rate limiting (600 req/min per IP), REST API, and SQLite 3 WAL mode with WebSockets (`/ws`) and Server-Sent Events (`/api/realtime/stream`).
- **Unified Mode**: When `frontend/dist` is built, Express automatically serves the frontend Single Page Application (SPA) with full client-side route fallback alongside `/api` endpoints on a single port.

---

## 2. Option 1: Unified Single-Service Deployment (Recommended)

Host both Frontend & Backend together on platforms that provide **persistent writable disk storage** (e.g. **Railway**, **Render with Persistent Disk**, **Fly.io with Volumes**, or a **VPS / EC2**).

> [!IMPORTANT]
> **Persistent Disk Requirement for SQLite**:
> SQLite stores data in `backend/src/data/database.sqlite`. Stateless serverless hosts (like standard Vercel serverless functions or ephemeral Heroku dynos) wipe disk state on dyno cycle. Ensure your deployment platform mounts a persistent volume to `backend/src/data` or use a VPS / Railway service with persistent volume attached.

### Railway / Render Configuration:
- **Build Command**:
  ```bash
  npm run install:all && npm run build
  ```
- **Start Command**:
  ```bash
  npm start
  ```
- **Environment Variables**:
  ```env
  NODE_ENV=production
  PORT=5000
  HOST=0.0.0.0
  CLIENT_ORIGIN=*
  ```

---

## 3. Option 2: Decoupled Deployment

### 1. Backend (Railway / Render / Fly.io with Persistent Volume)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```env
  NODE_ENV=production
  PORT=5000
  HOST=0.0.0.0
  CLIENT_ORIGIN=https://your-frontend-app.vercel.app
  ```
- **Health Verification**:
  Visit `https://your-backend-app/api/health`

### 2. Frontend (Vercel / Netlify / Cloudflare Pages)
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  ```env
  VITE_API_URL=https://your-backend-app/api
  ```

---

## 4. Option 3: Docker Deployment with Persistent Volume

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm run install:all && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app /app
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0
VOLUME ["/app/backend/src/data"]
EXPOSE 5000
CMD ["npm", "start"]
```

Run container with mounted persistent volume:
```bash
docker run -d \
  -p 5000:5000 \
  -v scholara_data:/app/backend/src/data \
  --name scholara-hub \
  scholara
```

---

## 5. Database Backup and Restore Procedures

### Safe Online Backup
SQLite Write-Ahead Logging (WAL) mode enables non-blocking online backups while the server is active:
```bash
# 1. Truncate WAL journal
sqlite3 backend/src/data/database.sqlite "PRAGMA wal_checkpoint(TRUNCATE);"

# 2. Generate point-in-time snapshot
sqlite3 backend/src/data/database.sqlite ".backup 'backend/src/data/backup-$(date +%Y%m%d_%H%M%S).sqlite'"
```

### Restore Procedure
```bash
# 1. Stop backend service
npm stop (or stop container/process)

# 2. Replace database file with verified backup
cp backend/src/data/backup-20261029.sqlite backend/src/data/database.sqlite

# 3. Clean up stale shm/wal cache files
rm -f backend/src/data/database.sqlite-shm backend/src/data/database.sqlite-wal

# 4. Restart server
npm start
```

---

## 6. Testing & Operational Verification

Run the automated endpoint and database verification test suite:
```bash
cd backend
npm test
```
**Test Coverage Includes**:
- Health endpoint & SQLite WAL mode validation
- Security headers (nosniff, SAMEORIGIN)
- Task CRUD (Create, Read by ID, Toggle completion, Update, Delete)
- Notifications CRUD (Create, List, Mark as Read, Mark All Read)
- Focus session logging & authentic study hour metrics calculation
- Timetable, routines, habits, and goals milestones endpoints
- Rate limiting sliding-window guard and 404 JSON fallback handling

---

## 7. Rollback Steps

If an unstable commit or configuration is pushed to production:
1. Revert to the last known stable commit:
   ```bash
   git revert HEAD --no-edit
   git push origin main
   ```
2. Re-run `npm run install:all && npm run build`.
3. Verify `/api/health` returns `{"status":"healthy"}` and SQLite WAL database file is mounted.
