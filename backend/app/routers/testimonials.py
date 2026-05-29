from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.testimonial import TestimonialResponse
from app.services import testimonial_service

public_router = APIRouter(prefix="/api/public/cms", tags=["public-cms"])


@public_router.get("/testimonials", response_model=list[TestimonialResponse])
def list_testimonials(db: Session = Depends(get_db)):
    return testimonial_service.list_public_testimonials(db)
