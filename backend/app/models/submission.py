from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.utils.dates import utc_now
from app.utils.ids import generate_id

SUBMISSION_STATUSES = (
    "draft",
    "submitted",
    "administrative_screening",
    "document_review",
    "academic_review",
    "revision_requested",
    "accepted",
    "certificate_issued",
    "archived",
    "rejected",
)


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("sub_"))
    submission_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), nullable=False)
    event_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("events.id"), nullable=True)
    title: Mapped[str | None] = mapped_column(String(500))
    abstract: Mapped[str | None] = mapped_column(Text)
    keywords: Mapped[str | None] = mapped_column(String(500))
    participation_type: Mapped[str | None] = mapped_column(String(100))
    attendance_format: Mapped[str | None] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(50), default="draft")
    certificate_name: Mapped[str | None] = mapped_column(String(255))
    certificate_role: Mapped[str | None] = mapped_column(String(100))
    notes: Mapped[str | None] = mapped_column(Text)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="submissions")
    event = relationship("Event", back_populates="submissions")
    files = relationship("SubmissionFile", back_populates="submission", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="submission")
    payments = relationship("Payment", back_populates="submission")
    authors = relationship(
        "SubmissionAuthor",
        back_populates="submission",
        cascade="all, delete-orphan",
        foreign_keys="SubmissionAuthor.submission_id",
    )
    author_invitations = relationship(
        "SubmissionAuthorInvitation",
        back_populates="submission",
        cascade="all, delete-orphan",
        foreign_keys="SubmissionAuthorInvitation.submission_id",
    )
