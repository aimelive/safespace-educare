<div align="center">

<img src="frontend/public/icon.svg" alt="SafeSpace Educare Logo" width="120" height="120" />

# SafeSpace Educare

**A digital mental health & wellness support platform for students and educational institutions**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2010-red?logo=nestjs)](https://nestjs.com)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)](https://postgresql.org)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6?logo=typescript)](https://typescriptlang.org)

</div>

---

## What is SafeSpace Educare?

SafeSpace Educare is a full-stack web platform that connects students with mental health support in a safe, confidential environment. Students can chat anonymously with counselors, book one-on-one sessions, track their mood, access wellness resources, log victories, and share experiences with peers — all from a single dashboard.

Counselors manage their sessions, respond to anonymous chats, and view session notes. Administrators get a platform-wide analytics view to monitor engagement and counselor activity.

---

## Production

- **Frontend:** [https://safespace.aimelive.com](https://safespace.aimelive.com)
- **Backend API docs (Swagger):** [https://api-safespace.aimelive.com/api/docs#/](https://api-safespace.aimelive.com/api/docs#/)

---

## Table of Contents

- [Production](#production)
- [Features](#features)
- [Architecture](#architecture)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Authentication Flow](#authentication-flow)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

---

## Features

### For Students
| Feature | Description |
|---|---|
| **Anonymous Chat** | Start a confidential chat session with a counselor. Identity is never revealed. |
| **Session Booking** | Browse counselors and book a one-on-one counseling session. |
| **Mood Check-in** | Log daily mood entries and track emotional trends over time. |
| **Exercises** | Access guided mental wellness exercises and activities. |
| **Resources** | Browse and save curated mental health articles and guides. |
| **Victories** | Record and celebrate personal achievements and milestones. |
| **Testimonies** | Share and read community stories of growth and resilience. |

### For Counselors
| Feature | Description |
|---|---|
| **Sessions Dashboard** | View all booked sessions with student details, date, time, and topic. |
| **Session Notes** | Add private notes and update session status (scheduled / completed / cancelled). |
| **Anonymous Chats** | View and respond to student chat sessions — student identity stays hidden. |
| **Analytics** | See session statistics and common topic trends for their caseload. |

### For Administrators
| Feature | Description |
|---|---|
| **Platform Overview** | Live counts of students, counselors, sessions, open chats, and resources. |
| **Session Breakdown** | Scheduled vs completed vs cancelled counts with visual breakdown. |
| **Common Topics** | Most frequent session topics across the whole platform. |
| **Counselor Activity** | Per-counselor session totals and completion rates. |
| **Analytics Page** | Dedicated full-detail analytics with charts and progress indicators. |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│              Next.js 16 (App Router, React 19)          │
│         Tailwind CSS · shadcn/ui · Lucide Icons         │
└───────────────────────┬─────────────────────────────────┘
                        │  HTTP / REST (JSON)
                        │  Bearer JWT
                        ▼
┌─────────────────────────────────────────────────────────┐
│               NestJS 10 REST API  (:5001)               │
│         Global prefix: /api  ·  Swagger: /api/docs      │
│                                                         │
│  Auth · Sessions · Chat · Moods · Resources · Posts     │
│  Victories · Analytics · Health                         │
│                                                         │
│  Guards: JwtAuthGuard · RolesGuard · ThrottlerGuard     │
│  Filters: HttpExceptionFilter                           │
│  Cache: in-memory (or Redis)                            │
└───────────────────────┬─────────────────────────────────┘
                        │  pg driver / connection pool
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    PostgreSQL                           │
│  users · sessions · chat_sessions · chat_messages       │
│  moods · resources · saved_resources · posts · victories│
└─────────────────────────────────────────────────────────┘
```

**Key design decisions:**
- Stateless JWT authentication — no sessions stored server-side
- All SQL via parameterised queries (no ORM, using Kysely type definitions)
- Anonymous chat implemented via `is_anonymous` flag — counselors see `"Anonymous Student"` only
- Auto-migration runs on server start — no separate migration runner needed
- Rate limiting: 100 requests / 60 s per IP across all endpoints
- Analytics results cached (60 s) to reduce database load

---

## User Roles

```
student    → full wellness dashboard, anonymous chat, session booking
counselor  → sessions management, chat responses, analytics view
admin      → platform-wide analytics, counselor activity overview
```

Each role has a dedicated sidebar navigation and role-appropriate dashboard. The JWT payload carries `{ id, email, role }` — the backend enforces access with `RolesGuard`.

---

## Project Structure

```
safespace-educare/
├── frontend/                  # Next.js application
│   ├── app/
│   │   ├── auth/              # Login & register pages
│   │   └── dashboard/         # Protected dashboard routes
│   │       ├── page.tsx       # Role-aware home (student/counselor/admin)
│   │       ├── layout.tsx     # Sidebar layout (all roles)
│   │       ├── chat/          # Anonymous chat page
│   │       ├── sessions/      # Counselor sessions page
│   │       ├── analytics/     # Admin analytics page
│   │       ├── book-session/
│   │       ├── mood/
│   │       ├── exercises/
│   │       ├── resources/
│   │       ├── victories/
│   │       └── testimonies/
│   ├── components/
│   │   ├── features/
│   │   │   └── anonymous-chat.tsx
│   │   ├── student-dashboard.tsx
│   │   ├── counselor-dashboard.tsx
│   │   ├── admin-dashboard.tsx
│   │   └── ui/                # shadcn/ui components
│   └── lib/
│       ├── api.ts             # Centralised fetch wrapper
│       └── services/          # Per-feature API service modules
│
└── backend/                   # NestJS application
    └── src/
        ├── main.ts            # Bootstrap, Swagger, CORS, global pipes
        ├── app.module.ts      # Root module
        ├── auth/              # Register, login, JWT strategy
        ├── chat/              # Anonymous chat sessions & messages
        ├── sessions/          # Counseling session booking & management
        ├── moods/             # Mood check-in tracking
        ├── resources/         # Resource library
        ├── posts/             # Community posts
        ├── victories/         # Personal victories
        ├── analytics/         # Dashboard & admin analytics
        ├── database/          # PostgreSQL pool, Kysely types, migrations
        ├── cache/             # Cache module (memory or Redis)
        ├── health/            # Health check endpoint
        └── common/            # Guards, decorators, filters, types
```

---

## Quick Start

### Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| PostgreSQL | 14+ |

> You can use a hosted PostgreSQL service such as [Neon](https://neon.tech) or [Supabase](https://supabase.com) instead of a local instance.

### 1 — Clone the repository

```bash
git clone https://github.com/aimelive/safespace-educare.git
cd safespace-educare
```

### 2 — Set up the backend

```bash
cd backend
cp .env.example .env          # copy the template
# edit .env — fill in DATABASE_URL and JWT_SECRET at minimum
npm install
npm run start:dev             # runs on http://localhost:5001
```

The server auto-creates all required tables on first boot. No separate migration step.

### 3 — Set up the frontend

```bash
cd frontend
cp .env.local.example .env.local   # or create manually
# set NEXT_PUBLIC_API_URL=http://localhost:5001
npm install
npm run dev                        # runs on http://localhost:3000
```

### 4 — Open in browser

| URL | Description |
|---|---|
| `http://localhost:3000` | Main application |
| `http://localhost:5001/api/docs` | Swagger / OpenAPI explorer |
| `http://localhost:5001/api/health` | API health check |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_SECRET` | Yes | — | Secret key for signing JWTs — use a long random string in production |
| `JWT_EXPIRES_IN` | No | `24h` | Token lifetime (`ms` format: `24h`, `7d`) |
| `PORT` | No | `5001` | Port the API server listens on |
| `NODE_ENV` | No | `development` | `development` / `production` / `test` |
| `CORS_ORIGIN` | No | `*` | Allowed frontend origin — set to your frontend URL in production |
| `CACHE_STORE` | No | `memory` | `memory` or `redis` |
| `CACHE_REDIS_URL` | No | — | Redis URL (required when `CACHE_STORE=redis`) |
| `DB_POOL_MAX` | No | `20` | Max PostgreSQL connection pool size |

### Frontend (`frontend/.env.local`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:5001` | Base URL of the backend API |

---

## API Overview

All API routes are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header.

| Module | Endpoint | Auth | Description |
|---|---|---|---|
| **Auth** | `POST /api/auth/register` | Public | Create account |
| | `POST /api/auth/login` | Public | Obtain JWT |
| | `GET /api/auth/me` | JWT | Current user profile |
| **Sessions** | `GET /api/sessions/counselors` | Public | List available counselors |
| | `POST /api/sessions/book` | JWT | Book a session |
| | `GET /api/sessions/my-sessions` | JWT | Student's own sessions |
| | `GET /api/sessions/counselor-sessions` | JWT | Counselor's assigned sessions |
| | `PATCH /api/sessions/:id` | JWT | Update session status / notes |
| **Chat** | `POST /api/chat/start` | JWT | Start anonymous chat session |
| | `POST /api/chat/message` | JWT | Send a message |
| | `GET /api/chat/sessions` | JWT | List sessions (role-aware) |
| | `GET /api/chat/:chatId` | JWT | Get messages for a session |
| **Moods** | `POST /api/moods` | JWT | Log mood entry |
| | `GET /api/moods` | JWT | Mood history |
| **Resources** | `GET /api/resources` | JWT | Browse resources |
| | `POST /api/resources/:id/save` | JWT | Save a resource |
| **Posts** | `GET /api/posts` | JWT | Community posts |
| | `POST /api/posts` | JWT | Create a post |
| **Victories** | `GET /api/victories` | JWT | List victories |
| | `POST /api/victories` | JWT | Log a victory |
| **Analytics** | `GET /api/analytics/dashboard` | Counselor/Admin | Counselor session stats |
| | `GET /api/analytics/admin` | Admin | Platform-wide stats |
| **Health** | `GET /api/health` | Public | Server health check |

Full interactive documentation is available at `/api/docs` (Swagger UI).

---

## Authentication Flow

```
1. User registers or logs in → backend returns { user, token }
2. Frontend stores token in localStorage
3. Every protected API call sends: Authorization: Bearer <token>
4. Backend validates the JWT and extracts { id, email, role }
5. RolesGuard checks role against the required @Roles() decorator
6. Token expires after JWT_EXPIRES_IN (default 24 hours)
```

**Passwords** are hashed with bcrypt (10 salt rounds) before storage. The plain-text password is never returned or logged.

---

## Database Schema

All tables are auto-created on first server start. No manual SQL required.

```
users
  id UUID PK · email · password (bcrypt) · name · age · role
  school · specialization · available_hours · created_at

sessions
  id UUID PK · student_id FK · counselor_id FK
  scheduled_date · scheduled_time · topic · status · notes
  created_at · updated_at

chat_sessions
  id UUID PK · student_id FK · counselor_id FK (nullable)
  is_anonymous BOOL · status · created_at

chat_messages
  id UUID PK · chat_id FK · sender_id FK · message · created_at

moods
  id · user_id FK · mood_score · note · created_at

resources
  id UUID PK · title · description · url · category · is_active · created_at

saved_resources
  user_id FK · resource_id FK · saved_at

posts
  id · user_id FK · content · likes · created_at

victories
  id · user_id FK · title · description · created_at
```

---

## Deployment

### Backend

```bash
cd backend
npm run build          # compiles TypeScript → dist/
npm run start:prod     # runs node dist/main
```

Set `NODE_ENV=production`, a strong `JWT_SECRET`, and restrict `CORS_ORIGIN` to your frontend domain.

### Frontend

```bash
cd frontend
npm run build          # Next.js production build
npm run start          # serves the built app
```

Or deploy to [Vercel](https://vercel.com) — import the `frontend/` directory and set `NEXT_PUBLIC_API_URL` to your live backend URL.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes following conventional commit style
4. Open a pull request with a clear description of the change
