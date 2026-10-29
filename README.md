# 🎓 Scholara OS — Executive Student Productivity Hub

> **A futuristic, ultra-minimalist, glassmorphic student platform built with React 19, Vite, Tailwind CSS, Framer Motion, Node.js Express, and a Real-time SQLite3 (WAL) database layer.**

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?logo=framer)](https://www.framer.com/motion/)
[![SQLite](https://img.shields.io/badge/SQLite3-WAL_Mode-003B57?logo=sqlite)](https://www.sqlite.org/)
[![WebSockets](https://img.shields.io/badge/WebSockets-Live_Sync-2563EB)](https://github.com/websockets/ws)
[![MCP](https://img.shields.io/badge/MCP-SQLite_Compatible-EF4444)](https://modelcontextprotocol.io/)

---

## ✨ Features & Capabilities

- **100x Glassmorphic Aesthetic**: VisionOS and Linear-inspired frosted glass panels (`backdrop-blur-3xl`), ambient refractive mesh glows in Cobalt Blue and Crimson Red, and sleek micro-interactions.
- **Persistent SQLite3 Real-time Database**: Normalized relational database with Write-Ahead Logging (WAL mode) for high-concurrency zero-lock performance.
- **Live Bidirectional WebSockets & SSE**: Zero-page-reload synchronization across tasks, deliverables, routines, and profile data over `ws://localhost:5000/ws` with SSE fallback.
- **Model Context Protocol (MCP) Ready**: Plugs directly into Antigravity IDE, Claude Desktop, and Cursor via `@modelcontextprotocol/server-sqlite`.
- **Sprint Task Terminal**: Fast task prioritization (High, In Progress, Done) with keyboard shortcuts and instant celebration kinetics.
- **Coursework & Deliverables Radar**: Submission timelines, Gantt sprints, weight breakdowns, and 1-click submission workflows.
- **Circadian Routines & Pomodoro Arena**: Time-block scheduling, custom sprint durations (25m / 5m / 50m), and habit streak matrices.
- **Academic Timetable Matrix**: Day-by-day class scheduler with room locations, instructor info, and active session badges.
- **Honors, GPA Simulator & Exam Forecaster**: Interactive GPA projections, final exam required score forecaster, and unlocked achievement trophies.
- **Deep Study Toolkit**: Compact HUD dock with Study Vault (`⌘I`), Soundscape Studio (`⌘U`), Daily Standup (`⌘M`), and Digest Export (`⌘E`).
- **Strict Color Philosophy**: Engineered in **Cobalt Blue (`#2563eb`)**, **Crimson Red (`#ef4444`)**, **Void Obsidian Black (`#09090b`)**, and **Titanium Crisp White (`#ffffff`)**.

---

## 🛠️ Tech Stack & Architecture

### Frontend

- **Framework**: React 19 (Hooks, Context API, Suspense)
- **Tooling**: Vite 8 with Rolldown compilation
- **Styling**: Tailwind CSS with custom Glassmorphism & Aurora animations
- **Motion**: Framer Motion for spring transitions & layout morphs
- **Icons**: Google Material Symbols & Lucide React
- **Celebration**: Canvas-Confetti & Web Audio API synthesis

### Backend

- **Runtime**: Node.js (ESM modules)
- **API Framework**: Express.js with CORS, Morgan logging & Security headers
- **Database**: SQLite3 in Write-Ahead Logging (WAL) mode
- **Real-time Engine**: WebSocket server (`ws`) + Server-Sent Events (`/api/realtime/stream`)

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** v18+ installed
- **Git** installed

### 2. Installation

Clone the repository and install dependencies for both frontend and backend:

```bash
git clone https://github.com/karanak1513-debug/STUDENTHUB.git
cd STUDENTHUB
npm run install:all
```

### 3. Running in Development

In two separate terminals:

```bash
# Terminal 1: Start Backend (Port 5000)
npm run dev:backend

# Terminal 2: Start Frontend (Port 5173)
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔌 Model Context Protocol (MCP) Configuration

To attach this project's live database directly to **Antigravity IDE** or an MCP client, add the following to your MCP configuration:

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "--db-path",
        "c:\\Users\\karan\\Downloads\\student dashboad\\student\\backend\\src\\data\\database.sqlite"
      ]
    }
  }
}
```

---

## 📦 Project Structure

```
STUDENTHUB/
├── backend/
│   ├── src/
│   │   ├── config/             # Environment & server settings
│   │   ├── data/               # SQLite database & initial seeders
│   │   ├── middleware/         # Error handling & validation
│   │   ├── realtime/           # WebSocket server & SSE broadcast
│   │   └── routes/             # REST API controllers
│   ├── package.json
│   └── server.js               # Express & Realtime WS entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/         # Glassy UI components & modals
│   │   ├── context/            # AppContext with Realtime Client
│   │   ├── pages/              # Dashboard, ToDo, Assignments, Routines, Goals
│   │   ├── services/           # REST API & WebSocket Realtime Client
│   │   ├── index.css           # Custom Glassmorphic & Aurora system
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── DEPLOYMENT.md               # Production deployment manual
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 📄 License

ISC License — Created for students aiming for academic mastery with zero excuses.
