from datetime import date, datetime

from pydantic import BaseModel


class CertificatePublicResponse(BaseModel):
    certificate_code: str
    holder_name: str
    event_title_snapshot: str | None
    event_date_snapshot: str | None
    location_snapshot: str | None
    event_slug: str | None = None
    event_format: str | None = None
    role: str | None
    record_type: str | None
    presentation_title: str | None
    issue_date: date | None
    status: str
    verification_message: str | None

    model_config = {"from_attributes": True}


class CertificateResponse(CertificatePublicResponse):
    id: str
    user_id: str
    submission_id: str | None
    event_id: str | None
    revoked_at: datetime | None
    revoke_reason: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class CertificateCreate(BaseModel):
    certificate_code: str
    user_id: str
    submission_id: str | None = None
    event_id: str | None = None
    holder_name: str
    event_title_snapshot: str | None = None
    event_date_snapshot: str | None = None
    location_snapshot: str | None = None
    role: str | None = None
    record_type: str | None = None
    presentation_title: str | None = None
    issue_date: date | None = None
    status: str = "verified"
    verification_message: str | None = None


class CertificateUpdate(BaseModel):
    holder_name: str | None = None
    role: str | None = None
    record_type: str | None = None
    presentation_title: str | None = None
    status: str | None = None
    verification_message: str | None = None


class CertificateRevoke(BaseModel):
    revoke_reason: str
