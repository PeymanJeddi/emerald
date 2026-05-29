from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import admin, auth, certificates, cms, contact, events, files, users
from app.routers.certificates import public_router as cert_public
from app.routers.cms import public_router as cms_public
from app.routers.contact import public_router as contact_public
from app.routers.hero_carousel import public_router as hero_public
from app.routers.testimonials import public_router as testimonials_public
from app.routers.events import public_router as events_public

app = FastAPI(
    title="Emerald Scholars Congress API",
    description="Academic events, submissions, certificates, and CMS",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(events_public)
app.include_router(cert_public)
app.include_router(cms_public)
app.include_router(contact_public)
app.include_router(hero_public)
app.include_router(testimonials_public)
app.include_router(files.router)
app.include_router(admin.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Emerald Scholars Congress API"}
