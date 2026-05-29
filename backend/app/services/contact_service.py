from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.contact_inquiry import ContactInquiry
from app.schemas.contact import INQUIRY_TYPES, ContactInquiryCreate


def submit_inquiry(db: Session, data: ContactInquiryCreate) -> ContactInquiry:
    if not data.consent:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Consent is required")
    if data.inquiry_type not in INQUIRY_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid inquiry type")

    since = datetime.now(timezone.utc) - timedelta(minutes=5)
    recent = db.scalar(
        select(func.count())
        .select_from(ContactInquiry)
        .where(ContactInquiry.email == str(data.email).lower(), ContactInquiry.created_at >= since)
    )
    if recent and recent >= 3:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many inquiries from this email. Please try again later.",
        )

    inquiry = ContactInquiry(
        full_name=data.full_name.strip(),
        email=str(data.email).lower(),
        institution=data.institution.strip() if data.institution else None,
        country=data.country.strip() if data.country else None,
        inquiry_type=data.inquiry_type,
        subject=data.subject.strip(),
        message=data.message.strip(),
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry
