# Scholara Student Productivity Hub — Backend API

RESTful API backend for the Scholara Student Productivity Hub. Built with **Node.js** and **Express**, featuring a zero-dependency, thread-safe JSON file database that persists state across restarts.

## Features

- **Tasks API**: Full CRUD, toggling completion, priority and status filtering, and search.
- **Assignments API**: Assignment tracking, deadline countdowns, progress updates, and submission handling.
- **Routines & Habits API**: Habit checklists with toggling, scheduled daily time blocks, and Pomodoro focus session logging.
- **Timetable API**: Weekly class schedules mapped across days (Mon–Fri) with room, timing, and instructor metadata.
- **Goals & Milestones API**: Goal progress tracking, percentage updates, and achievement badge status.
- **Dashboard & Profile API**: Aggregated productivity metrics (completion percentages, streaks, upcoming classes).
- **Persistent Storage**: Atomic file-backed JSON database (`backend/src/data/db.json`) pre-populated with realistic university coursework seed data.
- **CORS & Proxy Ready**: Seamlessly integrates with the Vite frontend development server via proxy or direct CORS requests.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended; tested on v22+)
- npm

### Installation
From the `backend` folder:
```bash
npm install
```

### Running the Server

#### Development (auto-restarts on file changes)
```bash
npm run dev
```

#### Production
```bash
npm start
```

The server will start at `http://localhost:5000`.

---

## API Endpoints Reference

### 1. System Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and timestamp |
| `GET` | `/` | API directory and service metadata |

### 2. Tasks (`/api/tasks`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get tasks (Supports `?priority=`, `?completed=`, `?search=`, `?tag=`) |
| `GET` | `/api/tasks/:id` | Get single task by ID |
| `POST` | `/api/tasks` | Create a new task (`title`, `subject`, `due`, `priority`, `tag`) |
| `PUT` | `/api/tasks/:id` | Update task details |
| `PATCH`| `/api/tasks/:id/toggle` | Toggle task completion status |
| `DELETE`| `/api/tasks/:id` | Delete a task |

### 3. Assignments (`/api/assignments`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assignments` | Get assignments (Supports `?status=pending\|submitted`, `?course=`, `?search=`) |
| `GET` | `/api/assignments/:id` | Get assignment by ID |
| `POST` | `/api/assignments` | Register a new assignment |
| `PUT` | `/api/assignments/:id` | Update assignment details |
| `PATCH`| `/api/assignments/:id/submit` | Mark assignment as submitted |
| `DELETE`| `/api/assignments/:id` | Delete an assignment |

### 4. Routines & Habits (`/api/routines`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/routines/habits` | Get all habits |
| `POST` | `/api/routines/habits` | Add a new habit |
| `PATCH`| `/api/routines/habits/:id/toggle` | Toggle habit completed status |
| `DELETE`| `/api/routines/habits/:id` | Delete a habit |
| `GET` | `/api/routines/timeblocks` | Get scheduled daily time blocks |
| `POST` | `/api/routines/timeblocks` | Add a time block |
| `DELETE`| `/api/routines/timeblocks/:id` | Delete a time block |
| `GET` | `/api/routines/focus-sessions` | Get focus sprint history |
| `POST` | `/api/routines/focus-sessions` | Log completed focus session |

### 5. Timetable (`/api/timetable`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/timetable` | Get weekly schedule (optional `?day=Mon\|Tue\|Wed\|Thu\|Fri`) |
| `POST` | `/api/timetable` | Add a class to a specific day |
| `PUT` | `/api/timetable/:id` | Update class session details |
| `DELETE`| `/api/timetable/:id` | Delete a class session |

### 6. Goals & Milestones (`/api/goals`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/goals/milestones` | Get all active milestones |
| `POST` | `/api/goals/milestones` | Add a milestone goal |
| `PATCH`| `/api/goals/milestones/:id` | Update milestone progress |
| `DELETE`| `/api/goals/milestones/:id` | Delete a milestone |
| `GET` | `/api/goals/badges` | Get achievement badges |

### 7. Dashboard Analytics (`/api/dashboard`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated metrics (completion %, streak, today's schedule) |
| `GET` | `/api/dashboard/profile` | Student profile info |
| `PUT` | `/api/dashboard/profile` | Update profile info |

---

## Directory Structure

```
backend/
├── package.json
├── server.js
├── .env
├── .env.example
├── .gitignore
└── src/
    ├── config/
    │   └── index.js
    ├── data/
    │   ├── seedData.js
    │   ├── db.js
    │   └── db.json (generated on first run)
    ├── controllers/
    │   ├── tasksController.js
    │   ├── assignmentsController.js
    │   ├── routineController.js
    │   ├── timetableController.js
    │   ├── goalsController.js
    │   └── dashboardController.js
    ├── routes/
    │   ├── index.js
    │   ├── tasksRoutes.js
    │   ├── assignmentsRoutes.js
    │   ├── routineRoutes.js
    │   ├── timetableRoutes.js
    │   ├── goalsRoutes.js
    │   └── dashboardRoutes.js
    └── middleware/
        └── errorHandler.js
```
