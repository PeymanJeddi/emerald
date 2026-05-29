from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.cms import AboutResponse, CMSPageResponse, ContactResponse, HomepageResponse
from app.services import cms_service

public_router = APIRouter(prefix="/api/public/cms", tags=["public-cms"])


@public_router.get("/homepage", response_model=HomepageResponse)
def homepage(db: Session = Depends(get_db)):
    return cms_service.get_homepage(db)


@public_router.get("/about", response_model=AboutResponse)
def about_page(db: Session = Depends(get_db)):
    return cms_service.get_about(db)


@public_router.get("/contact", response_model=ContactResponse)
def contact_page(db: Session = Depends(get_db)):
    return cms_service.get_contact(db)


@public_router.get("/page/{slug}", response_model=CMSPageResponse)
def get_page(slug: str, db: Session = Depends(get_db)):
    page = cms_service.get_page_by_slug(db, slug)
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")
    return page


@public_router.get("/navigation")
def navigation(db: Session = Depends(get_db)):
    return {"items": cms_service.get_navigation(db)}


@public_router.get("/footer")
def footer(db: Session = Depends(get_db)):
    return cms_service.get_footer(db)
