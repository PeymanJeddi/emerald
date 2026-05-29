"""Co-author lookup, addition, and invitation management."""

from __future__ import annotations

import secrets
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.event import Event
from app.models.submission import Submission
from app.models.submission_author import SubmissionAuthor, SubmissionAuthorInvitation
from app.models.user import User
from app.schemas.submission_author import UserLookupPreview

MAX_CO_AUTHORS = 2
INVITATION_DAYS = 14


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _user_institution(user: User) -> str | None:
    if user.affiliation:
        return user.affiliation
    profile = user.profile_json or {}
    academic = profile.get("academic") or {}
    return academic.get("university_name") or academic.get("institution")


def _user_preview(user: User) -> UserLookupPreview:
    return UserLookupPreview(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        institution=_user_institution(user),
        country=user.country,
        profile_photo_url=user.profile_photo_url,
        email_verified=user.is_verified,
        profile_status=user.profile_status,
        status="active" if user.is_active else "inactive",
    )


def assert_submission_editable(submission: Submission) -> None:
    if submission.status not in ("draft", "revision_requested"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authors cannot be changed after this application is submitted.",
        )


def count_co_authors(db: Session, submission_id: str) -> int:
    return (
        db.scalar(
            select(func.count())
            .select_from(SubmissionAuthor)
            .where(
                SubmissionAuthor.submission_id == submission_id,
                SubmissionAuthor.role == "co_author",
                SubmissionAuthor.status != "removed",
            )
        )
        or 0
    )


def _active_co_author_user_ids(db: Session, submission_id: str) -> set[str]:
    rows = db.scalars(
        select(SubmissionAuthor.user_id).where(
            SubmissionAuthor.submission_id == submission_id,
            SubmissionAuthor.role == "co_author",
            SubmissionAuthor.status != "removed",
        )
    ).all()
    return set(rows)


def ensure_primary_author(db: Session, submission: Submission, owner: User) -> SubmissionAuthor:
    existing = db.scalar(
        select(SubmissionAuthor).where(
            SubmissionAuthor.submission_id == submission.id,
            SubmissionAuthor.role == "primary_author",
            SubmissionAuthor.status != "removed",
        )
    )
    if existing:
        return existing

    author = SubmissionAuthor(
        submission_id=submission.id,
        user_id=owner.id,
        email=owner.email.lower(),
        role="primary_author",
        author_order=1,
        status="confirmed",
        added_by_user_id=owner.id,
        confirmed_at=datetime.now(timezone.utc),
    )
    db.add(author)
    db.commit()
    db.refresh(author)
    return author


def lookup_user_by_email(
    db: Session,
    email: str,
    current_user: User,
    submission_id: str | None = None,
) -> dict:
    normalized = _normalize_email(email)
    if not normalized:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is required.")

    if normalized == current_user.email.lower():
        return {
            "exists": False,
            "message": "You are already listed as the primary author for this application.",
            "error_code": "self_email",
        }

    co_ids: set[str] = set()
    if submission_id:
        co_ids = _active_co_author_user_ids(db, submission_id)
        existing_author = db.scalar(
            select(SubmissionAuthor).where(
                SubmissionAuthor.submission_id == submission_id,
                SubmissionAuthor.email == normalized,
                SubmissionAuthor.status != "removed",
            )
        )
        if existing_author:
            return {
                "exists": False,
                "message": "This user has already been added as a co-author.",
                "error_code": "already_added",
            }
        if count_co_authors(db, submission_id) >= MAX_CO_AUTHORS:
            return {
                "exists": False,
                "message": "You can add a maximum of 2 co-authors to this application.",
                "error_code": "limit_reached",
            }

    user = db.scalar(select(User).where(User.email == normalized))
    if not user:
        return {
            "exists": False,
            "message": "No registered user was found with this email address.",
        }

    if not user.is_active:
        return {
            "exists": False,
            "message": "This user account is not active and cannot be added as a co-author.",
            "error_code": "inactive_user",
        }

    if not user.is_verified:
        return {
            "exists": False,
            "message": "This user's email is not verified yet.",
            "error_code": "unverified_email",
        }

    if submission_id and user.id in co_ids:
        return {
            "exists": False,
            "message": "This user has already been added as a co-author.",
            "error_code": "already_added",
        }

    return {
        "exists": True,
        "message": "User found on the platform.",
        "user": _user_preview(user),
    }


def add_co_author(
    db: Session,
    submission: Submission,
    owner: User,
    target_user_id: str,
) -> SubmissionAuthor:
    assert_submission_editable(submission)
    if submission.user_id != owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    if count_co_authors(db, submission.id) >= MAX_CO_AUTHORS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can add a maximum of 2 co-authors to this application.",
        )

    target = db.get(User, target_user_id)
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if target.id == owner.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already listed as the primary author for this application.",
        )

    if not target.is_active or not target.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This user cannot be added as a co-author.",
        )

    existing = db.scalar(
        select(SubmissionAuthor).where(
            SubmissionAuthor.submission_id == submission.id,
            SubmissionAuthor.user_id == target.id,
            SubmissionAuthor.status != "removed",
        )
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This user has already been added as a co-author.",
        )

    order = 2 + count_co_authors(db, submission.id)
    author = SubmissionAuthor(
        submission_id=submission.id,
        user_id=target.id,
        email=target.email.lower(),
        role="co_author",
        author_order=order,
        status="added",
        added_by_user_id=owner.id,
    )
    db.add(author)
    db.commit()
    db.refresh(author)
    return author


def remove_co_author(
    db: Session,
    submission: Submission,
    owner: User,
    author_id: str,
) -> None:
    assert_submission_editable(submission)
    if submission.user_id != owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    author = db.get(SubmissionAuthor, author_id)
    if not author or author.submission_id != submission.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Author not found")

    if author.role == "primary_author":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The primary author cannot be removed.",
        )

    author.status = "removed"
    db.commit()


def send_invitation(
    db: Session,
    submission: Submission,
    owner: User,
    email: str,
) -> SubmissionAuthorInvitation:
    assert_submission_editable(submission)
    if submission.user_id != owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    normalized = _normalize_email(email)
    lookup = lookup_user_by_email(db, normalized, owner, submission.id)
    if lookup.get("exists"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This user is already registered. Add them directly as a co-author.",
        )
    if lookup.get("error_code") in ("already_added", "self_email", "limit_reached"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=lookup.get("message"))

    pending = db.scalar(
        select(SubmissionAuthorInvitation).where(
            SubmissionAuthorInvitation.submission_id == submission.id,
            SubmissionAuthorInvitation.invited_email == normalized,
            SubmissionAuthorInvitation.status.in_(("sent", "opened", "not_sent")),
        )
    )
    if pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An invitation has already been sent to this email.",
        )

    now = datetime.now(timezone.utc)
    token = secrets.token_urlsafe(32)
    invitation = SubmissionAuthorInvitation(
        submission_id=submission.id,
        invited_email=normalized,
        invited_by_user_id=owner.id,
        status="sent",
        token=token,
        expires_at=now + timedelta(days=INVITATION_DAYS),
        sent_at=now,
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)

    event = db.get(Event, submission.event_id)
    event_title = event.title if event else "your conference application"
    # Email delivery can be wired to SMTP later; invitation is persisted as sent.
    _ = (owner.full_name, event_title, token)

    return invitation


def cancel_invitation(
    db: Session,
    submission: Submission,
    owner: User,
    invitation_id: str,
) -> None:
    assert_submission_editable(submission)
    if submission.user_id != owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    inv = db.get(SubmissionAuthorInvitation, invitation_id)
    if not inv or inv.submission_id != submission.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation not found")

    inv.status = "cancelled"
    db.commit()


def resend_invitation(
    db: Session,
    submission: Submission,
    owner: User,
    invitation_id: str,
) -> SubmissionAuthorInvitation:
    assert_submission_editable(submission)
    if submission.user_id != owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    inv = db.get(SubmissionAuthorInvitation, invitation_id)
    if not inv or inv.submission_id != submission.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation not found")

    if inv.status in ("cancelled", "registered", "expired"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This invitation can no longer be resent.",
        )

    now = datetime.now(timezone.utc)
    inv.status = "sent"
    inv.sent_at = now
    inv.expires_at = now + timedelta(days=INVITATION_DAYS)
    inv.token = secrets.token_urlsafe(32)
    db.commit()
    db.refresh(inv)
    return inv


def author_to_response(author: SubmissionAuthor) -> dict:
    user = author.user
    return {
        "id": author.id,
        "submission_id": author.submission_id,
        "user_id": author.user_id,
        "email": author.email,
        "full_name": user.full_name if user else author.email,
        "institution": _user_institution(user) if user else None,
        "country": user.country if user else None,
        "profile_photo_url": user.profile_photo_url if user else None,
        "role": author.role,
        "author_order": author.author_order,
        "status": author.status,
        "added_at": author.added_at,
    }


def list_authors(db: Session, submission_id: str) -> list[dict]:
    authors = db.scalars(
        select(SubmissionAuthor)
        .where(
            SubmissionAuthor.submission_id == submission_id,
            SubmissionAuthor.status != "removed",
        )
        .options(selectinload(SubmissionAuthor.user))
        .order_by(SubmissionAuthor.author_order)
    ).all()
    return [author_to_response(a) for a in authors]


def list_invitations(db: Session, submission_id: str) -> list[SubmissionAuthorInvitation]:
    return list(
        db.scalars(
            select(SubmissionAuthorInvitation)
            .where(
                SubmissionAuthorInvitation.submission_id == submission_id,
                SubmissionAuthorInvitation.status.notin_(("cancelled", "registered")),
            )
            .order_by(SubmissionAuthorInvitation.created_at.desc())
        ).all()
    )
