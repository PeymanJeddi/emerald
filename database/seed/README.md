# Database Seed

Development seed data is applied automatically by the backend on startup when `RUN_SEED=true` (default in Docker Compose).

Seed script: `backend/app/seed.py`

Includes:
- Admin user (`admin@emeraldscholars.org`)
- Demo user (`daniel.morgan@example.com`)
- Demo event, submission, and certificate (`ESC-2026-AI-001`)
- CMS homepage sections and pages
