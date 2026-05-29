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
| `JWT_SECRET` | Secret for signing JWT tokens (use a long random value in production) |
| `JWT_EXPIRES_IN` | Token lifetime in seconds (default 86400) |
| `CORS_ORIGINS` | Comma-separated frontend origins (must include your real domains in production) |
| `NEXT_PUBLIC_API_URL` | API URL the browser uses to reach the backend (must be a public URL in production) |
| `NEXT_PUBLIC_USER_PORTAL_URL` | Public URL of the user portal (used by the public site for sign-in / apply links) |
| `NEXT_PUBLIC_PUBLIC_WEB_URL` | Public URL of the public website |
| `UPLOAD_DIR` | Directory inside the backend container where uploaded files are stored |
| `RUN_SEED` | When `true`, the backend seeds demo data on startup. Set to `false` in production |
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

## Deploy on a Server

These steps run the full production stack on a Linux server (VPS, cloud VM, etc.) using Docker.

### 1. Prerequisites

- A server with Docker Engine and the Docker Compose plugin installed.
- A domain (or subdomains) pointing to the server, e.g.:
  - `emeraldscholars.org` → public website
  - `portal.emeraldscholars.org` → user portal
  - `admin.emeraldscholars.org` → admin panel
  - `api.emeraldscholars.org` → backend API

### 2. Clone and configure

```bash
git clone https://github.com/PeymanJeddi/emerald.git
cd emerald
cp .env.example .env
```

Edit `.env` and replace all localhost values with your real domains and strong secrets:

```env
# Use a long random secret (e.g. `openssl rand -hex 32`)
JWT_SECRET=<long-random-secret>

# Strong database credentials
POSTGRES_USER=esc
POSTGRES_PASSWORD=<strong-db-password>
POSTGRES_DB=emerald_scholars
DATABASE_URL=postgresql://esc:<strong-db-password>@postgres:5432/emerald_scholars

# Public URLs (what the browser uses)
NEXT_PUBLIC_API_URL=https://api.emeraldscholars.org
NEXT_PUBLIC_PUBLIC_WEB_URL=https://emeraldscholars.org
NEXT_PUBLIC_USER_PORTAL_URL=https://portal.emeraldscholars.org

# Allow your real frontends to call the API
CORS_ORIGINS=https://emeraldscholars.org,https://portal.emeraldscholars.org,https://admin.emeraldscholars.org

# Disable demo seeding in production
RUN_SEED=false
```

> `NEXT_PUBLIC_*` values are baked into the frontend at build time (they are passed as Docker build args), so you must rebuild the frontend images after changing them.

### 3. Build and start (detached)

```bash
docker compose up -d --build
```

The backend automatically applies Alembic migrations on startup. With `RUN_SEED=false`, no demo data is created — create your first admin user manually (see step 6).

Check status and logs:

```bash
docker compose ps
docker compose logs -f backend
```

### 4. Reverse proxy + HTTPS

The containers expose ports `3000`, `3001`, `3002`, and `8000` on the host. Put a reverse proxy (nginx, Caddy, or Traefik) in front to map your domains to those ports and terminate TLS.

Example nginx server block for the API (repeat per subdomain, changing `proxy_pass` to `3000` / `3001` / `3002`):

```nginx
server {
    listen 443 ssl;
    server_name api.emeraldscholars.org;

    # ssl_certificate / ssl_certificate_key managed by certbot or your CA

    client_max_body_size 25m;  # allow file uploads

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Use [Certbot](https://certbot.eff.org/) (`certbot --nginx`) to obtain and auto-renew Let's Encrypt certificates.

### 5. Updating after a new release

```bash
git pull
docker compose up -d --build
```

### 6. Create the first admin user (production)

With seeding disabled, register a user through the portal, then promote them to admin directly in the database:

```bash
docker compose exec postgres psql -U esc -d emerald_scholars \
  -c "UPDATE users SET role = 'admin' WHERE email = 'you@yourdomain.com';"
```

### 7. Backups

Persistent data lives in the `postgres_data` and `uploads_data` Docker volumes. Back them up regularly:

```bash
# Database dump
docker compose exec postgres pg_dump -U esc emerald_scholars > backup.sql

# Uploaded files
docker run --rm -v emerald_uploads_data:/data -v "$PWD":/backup alpine \
  tar czf /backup/uploads-backup.tar.gz -C /data .
```

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
