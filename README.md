# User Management Frontend

A Next.js frontend for the [User Management Microservice](https://github.com/neodoomer/user-management-microservice), featuring authentication flows and an admin dashboard.

## Tech Stack

- **Next.js 16** (App Router, Server Components, Route Handlers)
- **TypeScript**
- **Tailwind CSS** with [shadcn/ui](https://ui.shadcn.com/) components
- **Sonner** for toast notifications

## Features

- **Sign In** / **Sign Up** with client-side validation
- **Forgot Password** / **Reset Password** flow
- **Admin Dashboard** with paginated users table
- **Route protection** via middleware (unauthenticated users redirected to sign-in)
- **HttpOnly JWT cookies** managed by server-side Route Handlers (token never exposed to client JS)
- **Standalone Docker build** for production deployment

## Pages

| Route | Auth | Description |
|-------|------|-------------|
| `/signin` | Public | Sign in form |
| `/signup` | Public | Registration form |
| `/forgot-password` | Public | Request password reset |
| `/reset-password` | Public | Reset password with token |
| `/dashboard` | Protected | Users table (admin: full list, user: access denied) |

## Quick Start

### With Docker (recommended)

The frontend is included in the backend's `docker-compose.yml`. Clone both repos as siblings:

```
Go Projects/
├── user-management-microservice/
└── user-management-frontend/       # this repo
```

Then from the **backend** directory:

```bash
docker compose up --build -d
```

Open **http://localhost** — HAProxy routes everything through port 80.

### Local development

```bash
npm install
```

Create `.env.local`:

```
API_URL=http://localhost
```

Start the dev server:

```bash
npm run dev
```

Open **http://localhost:3000**.

> The Go backend must be running (either via Docker or locally on port 8080 behind HAProxy on port 80).

## Architecture

```
Browser
  │
  ├── /signin, /signup, /dashboard ... (React pages)
  │
  └── /api/auth/* (Next.js Route Handlers)
        │
        └── Go API at $API_URL/api/v1/*
```

- **Client components** (sign-in/sign-up forms) call Next.js Route Handlers at `/api/auth/*`.
- **Route Handlers** proxy requests to the Go backend, set/clear HttpOnly JWT cookies.
- **Server Components** (dashboard) fetch data directly from the Go API using the JWT cookie.
- **Middleware** checks for the `token` cookie and redirects unauthenticated users.

## Project Structure

```
app/
  (auth)/
    signin/page.tsx             # Sign in form
    signup/page.tsx             # Sign up form
    forgot-password/page.tsx    # Forgot password form
    reset-password/page.tsx     # Reset password form
    layout.tsx                  # Centered card layout for auth pages
  api/auth/
    signin/route.ts             # Proxy sign-in, set cookie
    signup/route.ts             # Proxy sign-up, set cookie
    signout/route.ts            # Clear cookie
    forgot-password/route.ts    # Proxy forgot password
    reset-password/route.ts     # Proxy reset password
  dashboard/
    page.tsx                    # Users table (server component)
    layout.tsx                  # Dashboard layout with header
  layout.tsx                    # Root layout (Geist font, Sonner)
  page.tsx                      # Redirects to /signin
components/
  ui/                           # shadcn/ui components
  users-table.tsx               # Users data table
  pagination.tsx                # Pagination controls
  sign-out-button.tsx           # Sign out button
lib/
  api-client.ts                 # Typed fetch wrapper + ApiError
  auth.ts                       # Server-side JWT cookie helpers
  types.ts                      # TypeScript interfaces
middleware.ts                   # Route protection middleware
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_URL` | `http://localhost` | Backend API base URL (server-side) |
| `COOKIE_SECURE` | `false` | Set to `true` when serving over HTTPS |

## License

MIT
