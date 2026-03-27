<div align="center">

<img src="../frontend/public/icon.svg" alt="SafeSpace Educare Logo" width="100" height="100" />

# SafeSpace Educare — Backend

**NestJS 10 · PostgreSQL · JWT · TypeScript**

</div>

---

## Overview

This is the REST API server for SafeSpace Educare. It exposes all data endpoints consumed by the Next.js frontend and is responsible for authentication, business logic, database access, caching, and rate limiting.

- **Runtime:** Node.js 18+
- **Framework:** NestJS 10
- **Database:** PostgreSQL 14+ (raw SQL via `pg`, type definitions via Kysely)
- **Auth:** JWT (Passport + `@nestjs/jwt`)
- **Cache:** In-memory (default) or Redis
- **API Docs:** Swagger UI at `/api/docs`
- **Production API docs:** [https://api-safespace.aimelive.com/api/docs#/](https://api-safespace.aimelive.com/api/docs#/)
- **Port:** `5001` (configurable)

---

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Modules](#modules)
- [API Endpoints](#api-endpoints)
- [Database & Migrations](#database--migrations)
- [Authentication & Guards](#authentication--guards)
- [Caching](#caching)
- [Rate Limiting](#rate-limiting)
- [Scripts](#scripts)

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
# Edit .env — at minimum set DATABASE_URL and JWT_SECRET

# 3. Start in development mode (with watch)
npm run start:dev
```

The server will:
1. Connect to PostgreSQL and validate the connection
2. Run auto-migrations (create missing tables, add missing columns, create indexes)
3. Start listening on `http://localhost:5001`
4. Expose Swagger UI at `http://localhost:5001/api/docs`

No separate migration runner or seed script is required.

---

## Environment Variables

Copy `.env.example` to `.env` and set the following:

```env
# ── Required ───────────────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# ── Optional (shown with defaults) ────────────────────────────────────
PORT=5001
NODE_ENV=development
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000

# ── Cache ──────────────────────────────────────────────────────────────
CACHE_STORE=memory          # memory | redis
# CACHE_REDIS_URL=redis://localhost:6379

# ── Database pool tuning ───────────────────────────────────────────────
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT_MS=30000
DB_POOL_CONNECTION_TIMEOUT_MS=5000
DB_QUERY_TIMEOUT_MS=10000
DB_SLOW_QUERY_MS=200        # queries slower than this are logged as warnings
```

> **Production checklist:** set a strong random `JWT_SECRET`, restrict `CORS_ORIGIN` to your frontend domain, and set `NODE_ENV=production`.

---

## Project Structure

```
backend/
└── src/
    ├── main.ts                     # Bootstrap: Swagger, CORS, pipes, guards, listen
    ├── app.module.ts               # Root module — imports all feature modules
    │
    ├── auth/                       # Authentication
    │   ├── auth.controller.ts      # POST /auth/register, /auth/login, GET /auth/me
    │   ├── auth.service.ts         # Register, login, JWT signing, bcrypt hashing
    │   ├── auth.module.ts
    │   ├── dto/
    │   │   ├── register.dto.ts
    │   │   └── login.dto.ts
    │   └── strategies/
    │       └── jwt.strategy.ts     # Passport JWT strategy
    │
    ├── chat/                       # Anonymous chat
    │   ├── chat.controller.ts      # POST /chat/start, /chat/message; GET /chat/sessions, /:id
    │   ├── chat.service.ts         # Role-aware session listing, message storage
    │   ├── chat.module.ts
    │   └── dto/
    │       ├── start-chat.dto.ts   # { is_anonymous?: boolean }
    │       └── send-message.dto.ts # { chat_id: string, message: string }
    │
    ├── sessions/                   # Counseling session booking
    │   ├── sessions.controller.ts
    │   ├── sessions.service.ts
    │   ├── sessions.module.ts
    │   └── dto/
    │       ├── book-session.dto.ts
    │       └── update-session.dto.ts
    │
    ├── moods/                      # Mood check-in tracking
    ├── resources/                  # Resource library
    ├── posts/                      # Community posts
    ├── victories/                  # Personal victories
    │
    ├── analytics/                  # Analytics
    │   ├── analytics.controller.ts # GET /analytics/dashboard, /analytics/admin
    │   ├── analytics.service.ts    # Aggregation queries with caching
    │   └── analytics.module.ts
    │
    ├── database/                   # Database layer
    │   ├── database.service.ts     # pg Pool, Kysely instance, auto-migrations, query()
    │   ├── database.module.ts
    │   └── db.types.ts             # Kysely TypeScript table interfaces
    │
    ├── cache/                      # Cache module (memory / Redis)
    │   └── cache.module.ts
    │
    ├── health/                     # Health check
    │   └── health.controller.ts    # GET /health
    │
    └── common/                     # Shared utilities
        ├── guards/
        │   ├── jwt-auth.guard.ts   # Validates Bearer JWT on protected routes
        │   └── roles.guard.ts      # Enforces @Roles() decorator
        ├── decorators/
        │   ├── current-user.decorator.ts  # @CurrentUser() → JwtPayload
        │   └── roles.decorator.ts         # @Roles('student', 'counselor', 'admin')
        ├── filters/
        │   └── http-exception.filter.ts   # Returns { error: "message" }
        ├── interceptors/
        │   └── response.interceptor.ts
        └── types/
            └── index.ts            # JwtPayload, UserRole
```

---

## Modules

### Auth
Handles registration, login, and current-user lookup.

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT payload: `{ id: string, email: string, role: UserRole }`
- Token lifetime configurable via `JWT_EXPIRES_IN`

### Chat
Anonymous real-time-style chat between students and counselors.

- Student starts a session with `is_anonymous: true` (default)
- **Counselors** calling `GET /api/chat/sessions` see all sessions with `student_name` replaced by `"Anonymous Student"` for anonymous sessions
- **Students** see only their own sessions
- Messages polled by the frontend every 4 seconds
- Both parties identify their own messages via `sender_id === currentUser.id`

### Sessions
One-on-one counseling session booking.

- Students book sessions by choosing a counselor, date, time, and topic
- Counselors retrieve their own assigned sessions
- Status lifecycle: `scheduled` → `completed` | `cancelled`
- Counselors can add private notes via `PATCH /api/sessions/:id`

### Analytics
- `GET /api/analytics/dashboard` — counselor's own session stats (role: counselor/admin)
- `GET /api/analytics/admin` — platform-wide stats (role: admin only)
  - Total students, counselors, sessions, open chats, resources
  - Session status breakdown
  - Common session topics (top 8)
  - Per-counselor activity with completion rates
  - Results cached for 60 seconds

### Database
All modules share a single `DatabaseService` which wraps a `pg.Pool`. Features:
- Connection pool (configurable max size)
- Query timeout with slow-query logging
- Kysely instance for type-safe query building (optional — services also use raw SQL via `query()`)
- **Auto-migrations** on startup — idempotent, safe to run repeatedly

---

## API Endpoints

All routes are prefixed `/api`. Swagger explorer: `http://localhost:5001/api/docs`

### Auth
```
POST   /api/auth/register          Public
POST   /api/auth/login             Public
GET    /api/auth/me                JWT required
```

### Sessions
```
GET    /api/sessions/counselors           Public — list counselor profiles
POST   /api/sessions/book                 JWT — book a session
GET    /api/sessions/my-sessions          JWT — student's sessions
GET    /api/sessions/counselor-sessions   JWT — counselor's sessions
PATCH  /api/sessions/:id                  JWT — update status / notes
```

### Chat
```
POST   /api/chat/start             JWT — create anonymous chat session
POST   /api/chat/message           JWT — send message
GET    /api/chat/sessions          JWT — list sessions (role-aware)
GET    /api/chat/:chatId           JWT — messages for a session
```

### Moods
```
POST   /api/moods                  JWT — log mood entry
GET    /api/moods                  JWT — mood history
```

### Resources
```
GET    /api/resources              JWT — browse resources
POST   /api/resources/:id/save     JWT — save a resource
```

### Posts
```
GET    /api/posts                  JWT — community posts
POST   /api/posts                  JWT — create post
```

### Victories
```
GET    /api/victories              JWT — list victories
POST   /api/victories              JWT — log a victory
```

### Analytics
```
GET    /api/analytics/dashboard    Role: counselor, admin
GET    /api/analytics/admin        Role: admin only
```

### Health
```
GET    /api/health                 Public — returns { status: "ok" }
```

---

## Database & Migrations

Tables are created automatically when the server starts using `CREATE TABLE IF NOT EXISTS`. You do **not** need to run any migration tool manually.

### Tables created automatically

| Table | Purpose |
|---|---|
| `users` | All user accounts (students, counselors, admins) |
| `sessions` | Counseling session bookings |
| `chat_sessions` | Anonymous chat sessions |
| `chat_messages` | Individual chat messages |
| `moods` | Daily mood check-in entries |
| `resources` | Mental health resource library |
| `saved_resources` | User–resource join table |
| `posts` | Community posts |
| `victories` | Personal victory entries |

### Indexes created automatically

```sql
idx_users_role
idx_sessions_student_scheduled
idx_sessions_counselor_scheduled
idx_chat_sessions_student
idx_chat_sessions_status
idx_chat_messages_chat
```

If you need to inspect or reset the schema manually, connect to your PostgreSQL instance with `psql` or any GUI tool (e.g. TablePlus, pgAdmin).

---

## Authentication & Guards

### JwtAuthGuard
Apply to any route that requires a valid token:
```typescript
@UseGuards(JwtAuthGuard)
```

### RolesGuard + @Roles()
Restrict a route to specific roles:
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
```

### @CurrentUser()
Inject the decoded JWT payload into a controller method:
```typescript
myRoute(@CurrentUser() user: JwtPayload) {
  // user.id, user.email, user.role
}
```

---

## Caching

Analytics responses are cached to reduce database load.

| Endpoint | Cache key | TTL |
|---|---|---|
| `GET /analytics/dashboard` | `analytics:dashboard:<userId>` | 45 s |
| `GET /analytics/admin` | `analytics:admin` | 60 s |

**Default store:** in-process memory (no external dependency).

**Switch to Redis:**
```env
CACHE_STORE=redis
CACHE_REDIS_URL=redis://localhost:6379
```

---

## Rate Limiting

Global rate limit applied to all routes:
- **100 requests per 60 seconds per IP**

Configured via `ThrottlerModule` in `app.module.ts`. Clients that exceed the limit receive `429 Too Many Requests`.

---

## Scripts

```bash
npm run start:dev      # Development server with hot reload (watch mode)
npm run start:debug    # Debug mode with watch
npm run build          # Compile TypeScript → dist/
npm run start:prod     # Run compiled production build
npm run lint           # ESLint with auto-fix
npm run format         # Prettier formatting
npm run test           # Unit tests (Jest)
npm run test:watch     # Tests in watch mode
npm run test:cov       # Tests with coverage report
npm run test:e2e       # End-to-end tests
```
