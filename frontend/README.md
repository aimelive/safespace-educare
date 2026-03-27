<div align="center">

<img src="public/icon.svg" alt="SafeSpace Educare Logo" width="100" height="100" />

# SafeSpace Educare — Frontend

**Next.js 16 · React 19 · Tailwind CSS · TypeScript**

</div>

---

## Overview

This is the Next.js frontend for SafeSpace Educare. It provides role-aware dashboards for students, counselors, and administrators, communicating with the NestJS backend over a REST API using JWT authentication.

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19 + shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Language:** TypeScript
- **Auth:** JWT stored in `localStorage`, sent as `Authorization: Bearer` header
- **Production:** [https://safespace.aimelive.com](https://safespace.aimelive.com)

---

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Routing & Pages](#routing--pages)
- [Authentication](#authentication)
- [Role-Based UI](#role-based-ui)
- [Anonymous Chat](#anonymous-chat)
- [API Client](#api-client)
- [Component Architecture](#component-architecture)
- [Scripts](#scripts)

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.local.example .env.local
# or create it manually:
echo "NEXT_PUBLIC_API_URL=http://localhost:5001" > .env.local

# 3. Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

> The backend must be running at the URL set in `NEXT_PUBLIC_API_URL` before the app will function.

---

## Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the NestJS backend. No trailing slash. |

For production, replace the value with your deployed API URL (e.g. `https://api.safespace.edu`).

---

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root HTML layout
│   ├── page.tsx                  # Public landing page
│   ├── globals.css               # Global styles
│   │
│   ├── auth/
│   │   ├── login/page.tsx        # Login form
│   │   └── register/page.tsx     # Registration form
│   │
│   └── dashboard/                # Protected area (JWT required)
│       ├── layout.tsx            # Sidebar layout — all roles
│       ├── page.tsx              # Role-aware home page
│       ├── chat/page.tsx         # Anonymous chat
│       ├── sessions/page.tsx     # Counselor sessions management
│       ├── analytics/page.tsx    # Admin analytics
│       ├── book-session/page.tsx # Student session booking
│       ├── mood/page.tsx         # Mood check-in
│       ├── exercises/page.tsx    # Wellness exercises
│       ├── resources/page.tsx    # Resource library
│       ├── victories/page.tsx    # Personal victories
│       └── testimonies/page.tsx  # Community testimonies
│
├── components/
│   ├── student-dashboard.tsx     # Student home component
│   ├── counselor-dashboard.tsx   # Counselor home component
│   ├── admin-dashboard.tsx       # Admin home component
│   ├── features/
│   │   └── anonymous-chat.tsx    # Role-aware chat component
│   └── ui/                       # shadcn/ui base components
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── ... (40+ components)
│
└── lib/
    ├── api.ts                    # Centralised fetch wrapper + token helpers
    ├── utils.ts                  # Tailwind class merge utility
    └── services/                 # Per-feature API service modules
        ├── authService.ts
        ├── chatService.ts
        ├── sessionService.ts
        ├── moodService.ts
        ├── resourceService.ts
        ├── postService.ts
        ├── victoryService.ts
        └── analyticsService.ts
```

---

## Routing & Pages

### Public routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/auth/login` | Login form |
| `/auth/register` | Registration form |

### Protected routes (JWT required)

All routes under `/dashboard` are protected. The layout reads the stored user from `localStorage` and redirects to `/auth/login` if no valid session is found.

| Route | Who sees it | Description |
|---|---|---|
| `/dashboard` | All roles | Role-aware home — different content per role |
| `/dashboard/chat` | All roles | Anonymous chat (student starts; counselor responds) |
| `/dashboard/sessions` | Counselor | Sessions list with notes editor |
| `/dashboard/analytics` | Admin | Full platform analytics |
| `/dashboard/book-session` | Student | Browse counselors and book a session |
| `/dashboard/mood` | Student | Daily mood check-in |
| `/dashboard/exercises` | Student | Guided wellness exercises |
| `/dashboard/resources` | Student / Admin | Mental health resource library |
| `/dashboard/victories` | Student | Personal victories log |
| `/dashboard/testimonies` | Student | Community testimonies |

---

## Authentication

Authentication is entirely client-side via JWT.

### Login / Register flow
1. User submits credentials to `POST /api/auth/login` or `POST /api/auth/register`
2. Backend returns `{ user, token }`
3. Frontend stores:
   ```
   localStorage.setItem("token", token)
   localStorage.setItem("user",  JSON.stringify(user))   // { id, email, name, role }
   localStorage.setItem("role",  user.role)
   ```
4. Subsequent API calls include `Authorization: Bearer <token>`

### Logout
Removes all three keys from `localStorage` and redirects to `/`.

### Guard (layout-level)
`app/dashboard/layout.tsx` checks for `user` and `role` in `localStorage` on mount. Missing values trigger an immediate redirect to `/auth/login`.

### Accessing the current user in components
```typescript
const user = JSON.parse(localStorage.getItem("user") || "null")
const userId: string = user?.id ?? ""   // UUID string — never parseInt()
const role: string   = user?.role ?? ""
```

> **Important:** `user.id` is a UUID string (e.g. `"550e8400-e29b-41d4-a716-446655440000"`). Always compare it as a string. Using `parseInt()` on it will always return `NaN`.

---

## Role-Based UI

The dashboard layout (`app/dashboard/layout.tsx`) renders a different sidebar navigation per role.

### Student sidebar
```
Overview:   Home
Support:    Book Session · Anonymous Chat
Wellness:   Mood Check-in · Exercises · Resources
Growth:     Victories · Testimonies
```

### Counselor sidebar
```
Overview:   Dashboard
Work:       Sessions · Student Chats
```

### Admin sidebar
```
Overview:   Dashboard
Management: Student Chats · Resources
Insights:   Analytics
```

The home page (`/dashboard`) renders a different component per role:
- `student` → `<StudentHome />`
- `counselor` → `<CounselorDashboard />`
- `admin` → `<AdminDashboard />`

---

## Anonymous Chat

The chat feature is fully role-aware. Both students and counselors use the same component (`components/features/anonymous-chat.tsx`) which changes its behaviour based on the authenticated user's role.

### Student flow
1. Land on `/dashboard/chat`
2. Click **Start Chat Now** → `POST /api/chat/start` creates a session
3. Type and send messages → `POST /api/chat/message`
4. New messages from the counselor appear automatically (polled every 4 seconds)
5. Previous sessions are listed and can be re-opened to view the full history

### Counselor flow
1. Land on `/dashboard/chat` or click **Student Chats** in the sidebar
2. See all open student chat sessions — students are shown as `"Anonymous Student"` if `is_anonymous` is true
3. Click a session to open it and read the student's messages
4. Reply via the message input → `POST /api/chat/message`
5. New messages from the student appear automatically (polled every 4 seconds)

### Message alignment
Messages are aligned left/right based on `msg.sender_id === currentUser.id` (UUID string comparison). Your own messages appear on the right (dark background); the other party's messages appear on the left (white card).

### Polling
When a chat is open, the component calls `GET /api/chat/:chatId` every **4 seconds** using `setInterval`. The interval is cleared when the user navigates away or closes the chat.

---

## API Client

All HTTP calls go through the centralised client in `lib/api.ts`.

```typescript
// lib/api.ts
export async function apiCall(
  endpoint: string,
  method = "GET",
  body?: any,
  token?: string,
)
```

It automatically:
- Prepends `NEXT_PUBLIC_API_URL`
- Sets `Content-Type: application/json`
- Adds `Authorization: Bearer <token>` when a token is provided
- Throws on non-2xx responses with the parsed error message

**Helper functions:**
```typescript
getToken()   // reads token from localStorage (null on server)
getUser()    // reads and parses user JSON from localStorage
```

**Service modules** in `lib/services/` wrap `apiCall` for each feature domain. Some pages call `fetch` directly for more control (e.g. the chat component uses direct `fetch` to handle optimistic UI state).

---

## Component Architecture

### Dashboard home components
Each role has a dedicated component rendered by `/dashboard/page.tsx`:

| Component | Role | Data source |
|---|---|---|
| `student-dashboard.tsx` | student | Multiple endpoints (sessions, moods, etc.) |
| `counselor-dashboard.tsx` | counselor | `/api/sessions/counselor-sessions`, `/api/analytics/dashboard` |
| `admin-dashboard.tsx` | admin | `/api/analytics/admin` |

### Feature components
- **`anonymous-chat.tsx`** — Handles both student and counselor chat views. Manages sessions list, active chat, message history, polling, and message send state.

### UI components
All base UI components live in `components/ui/` and are built on **shadcn/ui** (Radix UI primitives styled with Tailwind). They include `Button`, `Input`, `Dialog`, `Select`, `Textarea`, `Badge`, `Card`, and more.

### Styling conventions
- Colour palette: `#152060` (navy primary), `#CC1A2E` (red accent)
- Background tint: `#f7f9ff`
- Border opacity pattern: `border-[#152060]/8` for subtle separators
- Rounded corners: `rounded-xl` (cards), `rounded-2xl` (panels)
- All interactive states use `transition-all duration-150`

---

## Scripts

```bash
npm run dev      # Start development server with hot reload (http://localhost:3000)
npm run build    # Production build (output to .next/)
npm run start    # Serve the production build
npm run lint     # ESLint check
```

### Production build

```bash
npm run build
npm run start
```

Or deploy to [Vercel](https://vercel.com) by importing the `frontend/` directory. Set `NEXT_PUBLIC_API_URL` as an environment variable in the Vercel project settings.
