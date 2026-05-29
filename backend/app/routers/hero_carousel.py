from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.hero_carousel import (
    HeroCarouselReorderRequest,
    HeroCarouselSlideCreate,
    HeroCarouselSlideResponse,
    HeroCarouselSlideUpdate,
)
from app.services import hero_carousel_service

public_router = APIRouter(prefix="/api/public/cms", tags=["public-cms"])


@public_router.get("/hero-slides", response_model=list[HeroCarouselSlideResponse])
def list_hero_slides(db: Session = Depends(get_db)):
    return hero_carousel_service.list_public_slides(db)
