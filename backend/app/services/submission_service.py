from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.submission import Submission
from app.models.submission_author import SubmissionAuthor
from app.models.user import User
from app.schemas.submission import SubmissionCreate, SubmissionResponse, SubmissionUpdate
from app.services import submission_author_service
from app.services.profile_service import assert_can_submit
from app.utils.ids import generate_id


def _next_code(db: Session) -> str:
    count = db.query(Submission).count()
    return f"ESC-SUB-{datetime.now(timezone.utc).year}-{count + 1:03d}"


def list_user_submissions(db: Session, user_id: str) -> list[Submission]:
    return list(
        db.scalars(
            select(Submission)
            .where(Submission.user_id == user_id)
            .options(selectinload(Submission.files))
            .order_by(Submission.last_updated_at.desc())
        ).all()
    )


def _submission_options():
    return (
        selectinload(Submission.files),
        selectinload(Submission.authors).selectinload(SubmissionAuthor.user),
        selectinload(Submission.author_invitations),
    )


def enrich_submission_response(db: Session, submission: Submission) -> SubmissionResponse:
    from app.schemas.submission import SubmissionFileResponse
    from app.schemas.submission_author import AuthorInvitationResponse, SubmissionAuthorResponse

    authors = submission_author_service.list_authors(db, submission.id)
    invitations = submission_author_service.list_invitations(db, submission.id)

    return SubmissionResponse(
        id=submission.id,
        submission_code=submission.submission_code,
        user_id=submission.user_id,
        event_id=submission.event_id,
        title=submission.title,
        abstract=submission.abstract,
        keywords=submission.keywords,
        participation_type=submission.participation_type,
        attendance_format=submission.attendance_format,
        status=submission.status,
        certificate_name=submission.certificate_name,
        certificate_role=submission.certificate_role,
        notes=submission.notes,
        submitted_at=submission.submitted_at,
        last_updated_at=submission.last_updated_at,
        files=[SubmissionFileResponse.model_validate(f) for f in (submission.files or [])],
        authors=[SubmissionAuthorResponse.model_validate(a) for a in authors],
        author_invitations=[
            AuthorInvitationResponse.model_validate(i) for i in invitations
        ],
    )


def get_submission(db: Session, submission_id: str, user: User | None = None) -> Submission:
    q = select(Submission).where(Submission.id == submission_id).options(*_submission_options())
    submission = db.scalar(q)
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")
    if user and submission.user_id != user.id and user.role not in ("admin", "staff"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return submission


def create_submission(db: Session, user: User, data: SubmissionCreate) -> Submission:
    assert_can_submit(user)
    payload = data.model_dump()
    title = (payload.get("title") or "").strip()
    if not title:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is required to save a draft.",
        )
    if not payload.get("event_id"):
        payload["event_id"] = None
    submission = Submission(
        submission_code=_next_code(db),
        user_id=user.id,
        **payload,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    submission_author_service.ensure_primary_author(db, submission, user)
    return submission


def update_submission(db: Session, submission: Submission, data: SubmissionUpdate) -> Submission:
    if submission.status not in ("draft", "revision_requested"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Submission cannot be edited")
    updates = data.model_dump(exclude_unset=True)
    if "event_id" in updates and not updates["event_id"]:
        updates["event_id"] = None
    for field, value in updates.items():
        setattr(submission, field, value)
    db.commit()
    db.refresh(submission)
    return submission


def _validate_ready_to_submit(submission: Submission) -> None:
    missing: list[str] = []
    if not submission.event_id:
        missing.append("event")
    if not submission.title or len(submission.title.strip()) < 5:
        missing.append("title")
    if not submission.abstract or len(submission.abstract.strip()) < 50:
        missing.append("abstract")
    if not submission.keywords or len(submission.keywords.strip()) < 2:
        missing.append("keywords")
    if not submission.certificate_name:
        missing.append("certificate_name")
    if not submission.files:
        missing.append("manuscript file")
    if missing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Complete all required sections before submitting: {', '.join(missing)}",
        )


def submit_submission(db: Session, submission: Submission) -> Submission:
    if submission.status != "draft" and submission.status != "revision_requested":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already submitted")
    _validate_ready_to_submit(submission)
    submission.status = "submitted"
    submission.submitted_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(submission)
    return submission
