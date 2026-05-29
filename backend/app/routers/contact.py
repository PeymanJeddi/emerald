from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.contact import ContactInquiryCreate, ContactInquiryResponse
from app.services import contact_service

public_router = APIRouter(prefix="/api/public/contact", tags=["public-contact"])


@public_router.post("/inquiries", response_model=ContactInquiryResponse)
def submit_contact_inquiry(data: ContactInquiryCreate, db: Session = Depends(get_db)):
    inquiry = contact_service.submit_inquiry(db, data)
    return ContactInquiryResponse(
        id=inquiry.id,
        message="Thank you. Your inquiry has been received. Our team will respond as soon as possible.",
    )
