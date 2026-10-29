# Scholara Deployment Guide 🚀

This repository is fully configured, secured, and ready for deployment across both **frontend** and **backend**. You can deploy it using either a **unified single-service deployment** (recommended for simplicity) or a **decoupled deployment** (frontend on Vercel/Netlify, backend on Render/Railway).

---

## Architecture Overview

- **Frontend**: React 19 + Vite 8 + TailwindCSS with React Router and Material Symbols.
- **Backend**: Node.js + Express 4.21 with security headers, CORS protection, REST API, and resilient data persistence.
- **Unified Mode**: When `frontend/dist` is built, Express automatically serves the frontend Single Page Application (SPA) with full client-side route fallback alongside the `/api` endpoints on a single port.

---

## Option 1: Unified Single-Service Deployment (Recommended)

Host both Frontend & Backend together on platforms like **Render**, **Railway**, **Fly.io**, or any VPS.

### Render / Railway Configuration:
- **Root Directory**: `stitch_scholara_student_productivity_hub` (repository root)
- **Environment**: Node
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
  PORT=10000
  HOST=0.0.0.0
  CLIENT_ORIGIN=*
  ```

---

## Option 2: Decoupled Deployment

### 1. Deploy Backend (Render / Railway / Fly.io / Heroku)
- **Root Directory**: `backend`
- **Build Command**:
  ```bash
  npm install
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
  CLIENT_ORIGIN=https://your-frontend-app.vercel.app
  ```
- **Verify Health**:
  Visit `https://your-backend-app.onrender.com/api/health`

### 2. Deploy Frontend (Vercel / Netlify / Cloudflare Pages)
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**:
  ```bash
  npm run build
  ```
- **Output Directory**: `dist`
- **Environment Variables**:
  ```env
  VITE_API_URL=https://your-backend-app.onrender.com/api
  ```
- **SPA Routing**: `vercel.json` is already included to ensure direct routes (`/dashboard`, `/todo`, `/assignments`, etc.) do not 404 on page reload.

---

## Option 3: Docker Deployment

Create a `Dockerfile` in the root:
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
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t scholara .
docker run -p 5000:5000 scholara
```

---

## Environment Variables Reference

### Backend (`backend/.env`):
| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port for the Express server to listen on |
| `HOST` | `0.0.0.0` | Host IP binding (use `0.0.0.0` for containers/cloud) |
| `NODE_ENV` | `production` | Environment mode (`development` or `production`) |
| `CLIENT_ORIGIN` | `*` | Allowed CORS origins (e.g. `https://my-app.vercel.app` or `*`) |

### Frontend (`frontend/.env`):
| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api` | Base URL for API requests. Leave unset if deploying unified or set to your backend URL if decoupled. |

---

## Verification & Testing Checklist

- [x] Frontend builds with zero errors: `npm run build --prefix frontend`
- [x] Linter passes with 0 errors: `npm run lint --prefix frontend`
- [x] Security headers enabled: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `x-powered-by` disabled
- [x] Endpoints test suite passes: `node backend/test-endpoints.js`
- [x] SPA client-side fallback works seamlessly across all routes
- [x] Null-safe error handling and parameter protection applied across all API controllers
