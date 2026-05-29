from datetime import date, datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.certificate import Certificate
from app.models.event import Event
from app.models.submission import Submission
from app.models.user import User
from app.schemas.certificate import CertificateCreate, CertificateUpdate
from app.utils.ids import generate_id


def _format_event_dates(event: Event) -> str | None:
    if not event.start_date:
        return None
    if event.end_date and event.end_date != event.start_date:
        return f"{event.start_date.strftime('%B %d')}-{event.end_date.strftime('%d, %Y')}"
    return event.start_date.strftime("%B %d, %Y")


def _holder_name(submission: Submission, user: User | None) -> str:
    if submission.certificate_name:
        return submission.certificate_name
    if user:
        return user.display_name or user.full_name
    return "Unknown"


def issue_certificate_for_submission(db: Session, submission: Submission) -> Certificate:
    """Create or update a verified certificate when a submission is marked certificate_issued."""
    cert = db.scalar(select(Certificate).where(Certificate.submission_id == submission.id))
    event = submission.event
    if not event and submission.event_id:
        event = db.get(Event, submission.event_id)
    user = submission.user
    if not user and submission.user_id:
        user = db.get(User, submission.user_id)

    holder = _holder_name(submission, user)
    role = submission.certificate_role or submission.participation_type or "Participant"
    event_date_snapshot = _format_event_dates(event) if event else None
    today = date.today()

    if cert:
        cert.status = "verified"
        cert.holder_name = holder
        cert.role = role
        cert.presentation_title = submission.title or cert.presentation_title
        cert.record_type = cert.record_type or "Conference Participation Certificate"
        if event:
            cert.event_id = event.id
            cert.event_title_snapshot = event.title
            cert.event_date_snapshot = event_date_snapshot
            cert.location_snapshot = event.location
        if not cert.issue_date:
            cert.issue_date = today
        if not cert.verification_message:
            cert.verification_message = (
                "This certificate has been verified by Emerald Scholars Congress."
            )
        db.commit()
        db.refresh(cert)
        return cert

    certificate_code = submission.submission_code
    existing_code = db.scalar(
        select(Certificate).where(Certificate.certificate_code == certificate_code)
    )
    if existing_code:
        count = db.query(Certificate).count()
        certificate_code = f"ESC-CERT-{datetime.now(timezone.utc).year}-{count + 1:03d}"

    cert = Certificate(
        id=generate_id("cert_"),
        certificate_code=certificate_code,
        user_id=submission.user_id,
        submission_id=submission.id,
        event_id=submission.event_id,
        holder_name=holder,
        event_title_snapshot=event.title if event else None,
        event_date_snapshot=event_date_snapshot,
        location_snapshot=event.location if event else None,
        role=role,
        record_type="Conference Participation Certificate",
        presentation_title=submission.title,
        issue_date=today,
        status="verified",
        verification_message="This certificate has been verified by Emerald Scholars Congress.",
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


def _assert_publicly_verifiable(cert: Certificate) -> Certificate:
    if cert.status == "revoked":
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail=cert.verification_message or "This certificate has been revoked",
        )
    if cert.status != "verified":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate is not yet available for public verification",
        )
    return cert


def verify_certificate(db: Session, code: str) -> Certificate:
    normalized = code.strip().upper()

    cert = db.scalar(select(Certificate).where(Certificate.certificate_code == normalized))
    if cert:
        return _assert_publicly_verifiable(cert)

    submission = db.scalar(
        select(Submission).where(Submission.submission_code == normalized)
    )
    if submission:
        if submission.status != "certificate_issued":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="A certificate has not been issued for this submission yet",
            )
        cert = issue_certificate_for_submission(db, submission)
        return _assert_publicly_verifiable(cert)

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")


def create_certificate(db: Session, data: CertificateCreate) -> Certificate:
    existing = db.scalar(select(Certificate).where(Certificate.certificate_code == data.certificate_code))
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Certificate code already exists")
    cert = Certificate(**data.model_dump())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


def revoke_certificate(db: Session, cert: Certificate, reason: str) -> Certificate:
    cert.status = "revoked"
    cert.revoked_at = datetime.now(timezone.utc)
    cert.revoke_reason = reason
    db.commit()
    db.refresh(cert)
    return cert


def update_certificate(db: Session, cert: Certificate, data: CertificateUpdate) -> Certificate:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(cert, field, value)
    db.commit()
    db.refresh(cert)
    return cert
