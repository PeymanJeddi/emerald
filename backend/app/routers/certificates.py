from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.event import Event
from app.schemas.certificate import CertificatePublicResponse
from app.services import certificate_service

public_router = APIRouter(prefix="/api/public/certificates", tags=["public-certificates"])


def _to_public_response(db: Session, cert) -> CertificatePublicResponse:
    event_slug = None
    event_format = None
    if cert.event_id:
        event = db.get(Event, cert.event_id)
        if event:
            event_slug = event.slug
            event_format = event.format
    return CertificatePublicResponse(
        certificate_code=cert.certificate_code,
        holder_name=cert.holder_name,
        event_title_snapshot=cert.event_title_snapshot,
        event_date_snapshot=cert.event_date_snapshot,
        location_snapshot=cert.location_snapshot,
        event_slug=event_slug,
        event_format=event_format,
        role=cert.role,
        record_type=cert.record_type,
        presentation_title=cert.presentation_title,
        issue_date=cert.issue_date,
        status=cert.status,
        verification_message=cert.verification_message,
    )


@public_router.get("/verify/{certificate_code}", response_model=CertificatePublicResponse)
def verify_certificate(certificate_code: str, db: Session = Depends(get_db)):
    cert = certificate_service.verify_certificate(db, certificate_code)
    return _to_public_response(db, cert)
