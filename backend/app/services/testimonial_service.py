import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreate, TestimonialReorderRequest, TestimonialUpdate
from app.services.file_service import ensure_upload_dir, file_url


def list_public_testimonials(db: Session) -> list[Testimonial]:
    return list(
        db.scalars(
            select(Testimonial)
            .where(Testimonial.is_active == True)  # noqa: E712
            .order_by(Testimonial.display_priority.asc(), Testimonial.created_at.asc())
        ).all()
    )


def list_all_testimonials(db: Session) -> list[Testimonial]:
    return list(
        db.scalars(
            select(Testimonial).order_by(
                Testimonial.display_priority.asc(),
                Testimonial.created_at.asc(),
            )
        ).all()
    )


def get_testimonial(db: Session, testimonial_id: str) -> Testimonial:
    item = db.get(Testimonial, testimonial_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    return item


def create_testimonial(db: Session, data: TestimonialCreate) -> Testimonial:
    item = Testimonial(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_testimonial(db: Session, item: Testimonial, data: TestimonialUpdate) -> Testimonial:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_testimonial(db: Session, item: Testimonial) -> None:
    db.delete(item)
    db.commit()


def reorder_testimonials(db: Session, payload: TestimonialReorderRequest) -> list[Testimonial]:
    for entry in payload.items:
        item = db.get(Testimonial, entry.id)
        if item:
            item.display_priority = entry.display_priority
    db.commit()
    return list_all_testimonials(db)


def save_profile_image(db: Session, item: Testimonial, file: UploadFile) -> Testimonial:
    upload_dir = ensure_upload_dir()
    ext = Path(file.filename or "image.jpg").suffix or ".jpg"
    stored_name = f"testimonial_{item.id}_{uuid.uuid4().hex}{ext}"
    storage_path = upload_dir / stored_name
    content = file.file.read()
    with open(storage_path, "wb") as f:
        f.write(content)
    item.profile_image_url = file_url(str(storage_path))
    db.commit()
    db.refresh(item)
    return item
