from datetime import datetime, timezone

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.hero_carousel import HeroCarouselSlide
from app.schemas.hero_carousel import HeroCarouselReorderRequest, HeroCarouselSlideCreate, HeroCarouselSlideUpdate
from app.services.file_service import ensure_upload_dir, file_url
import uuid
from pathlib import Path


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def list_public_slides(db: Session) -> list[HeroCarouselSlide]:
    now = _utc_now()
    slides = list(
        db.scalars(
            select(HeroCarouselSlide)
            .where(HeroCarouselSlide.is_active == True)  # noqa: E712
            .order_by(HeroCarouselSlide.display_priority.asc(), HeroCarouselSlide.created_at.asc())
        ).all()
    )
    visible: list[HeroCarouselSlide] = []
    for slide in slides:
        if slide.publish_at and slide.publish_at > now:
            continue
        if slide.expires_at and slide.expires_at <= now:
            continue
        visible.append(slide)
    return visible


def list_all_slides(db: Session) -> list[HeroCarouselSlide]:
    return list(
        db.scalars(
            select(HeroCarouselSlide).order_by(
                HeroCarouselSlide.display_priority.asc(),
                HeroCarouselSlide.created_at.asc(),
            )
        ).all()
    )


def get_slide(db: Session, slide_id: str) -> HeroCarouselSlide:
    slide = db.get(HeroCarouselSlide, slide_id)
    if not slide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slide not found")
    return slide


def create_slide(db: Session, data: HeroCarouselSlideCreate) -> HeroCarouselSlide:
    slide = HeroCarouselSlide(**data.model_dump())
    db.add(slide)
    db.commit()
    db.refresh(slide)
    return slide


def update_slide(db: Session, slide: HeroCarouselSlide, data: HeroCarouselSlideUpdate) -> HeroCarouselSlide:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(slide, field, value)
    db.commit()
    db.refresh(slide)
    return slide


def delete_slide(db: Session, slide: HeroCarouselSlide) -> None:
    db.delete(slide)
    db.commit()


def reorder_slides(db: Session, payload: HeroCarouselReorderRequest) -> list[HeroCarouselSlide]:
    for item in payload.slides:
        slide = db.get(HeroCarouselSlide, item.id)
        if slide:
            slide.display_priority = item.display_priority
    db.commit()
    return list_all_slides(db)


def save_slide_image(db: Session, slide: HeroCarouselSlide, file: UploadFile) -> HeroCarouselSlide:
    upload_dir = ensure_upload_dir()
    ext = Path(file.filename or "image.jpg").suffix or ".jpg"
    stored_name = f"hero_{slide.id}_{uuid.uuid4().hex}{ext}"
    storage_path = upload_dir / stored_name
    content = file.file.read()
    with open(storage_path, "wb") as f:
        f.write(content)
    slide.background_image_url = file_url(str(storage_path))
    db.commit()
    db.refresh(slide)
    return slide
