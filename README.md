# Emerald Scholars Congress (ESC)

A full-stack monorepo for international academic events, scholarly submissions, certificate verification, user portal, admin panel, CMS, and payment tracking.

## Architecture

```
├── apps/
│   ├── public-web/      # Next.js public website (port 3000)
│   ├── user-portal/     # Next.js user dashboard (port 3001)
│   └── admin-panel/     # Next.js admin dashboard (port 3002)
├── backend/             # FastAPI + SQLAlchemy + Alembic (port 8000)
├── database/
│   ├── migrations/      # Reference migrations (Alembic lives in backend/)
│   └── seed/            # Seed documentation
├── packages/
│   ├── ui/              # Shared UI utilities
│   └── shared/          # Shared constants and types
├── docker-compose.yml
└── .env.example
```

| Service       | Technology        | Port |
|---------------|-------------------|------|
| Public Web    | Next.js 16        | 3000 |
| User Portal   | Next.js 16        | 3001 |
| Admin Panel   | Next.js 16        | 3002 |
| Backend API   | FastAPI           | 8000 |
| PostgreSQL    | Postgres 16       | 5432 |

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token lifetime in seconds (default 86400) |
| `CORS_ORIGINS` | Comma-separated frontend origins |
| `NEXT_PUBLIC_API_URL` | API URL for browser requests |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Database credentials |

## Quick Start — Development (recommended)

Hot reload for all apps. No rebuild after each code change.

```bash
cp .env.example .env
npm install
```

**Option A — one command (requires Docker):**

```bash
npm run dev
```

**Option B — separate terminals:**

```bash
# Terminal 1: Postgres + API (auto-reload on Python changes)
docker compose -f docker-compose.dev.yml up

# Terminal 2–4: frontends (auto-reload on save)
cd apps/public-web && npm run dev -- --port 3000
cd apps/user-portal && npm run dev -- --port 3001
cd apps/admin-panel && npm run dev -- --port 3002
```

**Windows:** run `.\scripts\dev.ps1` to open all services in separate windows.

| Service      | Dev URL                      |
|--------------|------------------------------|
| Public web   | http://localhost:3000        |
| User portal  | http://localhost:3001        |
| Admin panel  | http://localhost:3002        |
| API docs     | http://localhost:8000/docs   |

## Quick Start — Production Docker

Full production-like images (rebuild after frontend changes):

```bash
cp .env.example .env
docker compose up --build
```

On first run, the backend applies Alembic migrations and seeds development data.

## Default Accounts

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@emeraldscholars.org | ChangeMe123! |
| User  | daniel.morgan@example.com | ChangeMe123! |

## Public URLs

| App | URL |
|-----|-----|
| Public website | http://localhost:3000 |
| User portal | http://localhost:3001 |
| Admin panel | http://localhost:3002 |
| Backend API | http://localhost:8000 |
| API docs (Swagger) | http://localhost:8000/docs |

## Certificate Verification (Demo)

Test certificate code: **ESC-2026-AI-001**

- Public verify page: http://localhost:3000/verify/ESC-2026-AI-001
- API: `GET http://localhost:8000/api/public/certificates/verify/ESC-2026-AI-001`

## Features

### Public Website
- CMS-driven homepage, about, contact, navigation, footer
- Conference listing and detail pages
- Certificate verification by exact code only

### User Portal
- Registration, login, profile
- Multi-step submissions with file upload
- Certificates, payments, messages

### Admin Panel
- Dashboard metrics
- User, event, submission, certificate, payment management
- CMS section editing
- Audit logs for admin actions

### Backend API
- JWT authentication with role-based access (admin, staff, user)
- REST API with modular routers and services
- Local file uploads (abstracted for future S3 migration)
- bcrypt password hashing

## Local Development (without Docker)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
# Start PostgreSQL and set DATABASE_URL
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

**Frontends:**
```bash
cd apps/public-web   # or user-portal / admin-panel
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

## Branding

- **Platform:** Emerald Scholars Congress (ESC)
- **Colors:** Emerald `#0F3D36`, Ivory `#F7F4EE`, Gold `#B89B5E`
- **Tone:** Formal, international, academic, neutral

## License

Private / internal use.
