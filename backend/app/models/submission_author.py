from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.utils.dates import utc_now
from app.utils.ids import generate_id

AUTHOR_ROLES = ("primary_author", "co_author")
AUTHOR_STATUSES = ("added", "pending_confirmation", "confirmed", "declined", "removed")

INVITATION_STATUSES = ("not_sent", "sent", "opened", "registered", "expired", "cancelled")


class SubmissionAuthor(Base):
    __tablename__ = "submission_authors"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("sau_"))
    submission_id: Mapped[str] = mapped_column(String(32), ForeignKey("submissions.id"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(30), default="co_author", nullable=False)
    author_order: Mapped[int] = mapped_column(Integer, default=2, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="added", nullable=False)
    added_by_user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), nullable=False)
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    submission = relationship("Submission", back_populates="authors")
    user = relationship("User", foreign_keys=[user_id])
    added_by = relationship("User", foreign_keys=[added_by_user_id])


class SubmissionAuthorInvitation(Base):
    __tablename__ = "submission_author_invitations"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("sai_"))
    submission_id: Mapped[str] = mapped_column(String(32), ForeignKey("submissions.id"), nullable=False, index=True)
    invited_email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    invited_by_user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="sent", nullable=False)
    token: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    registered_user_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("users.id"))

    submission = relationship("Submission", back_populates="author_invitations")
    invited_by = relationship("User", foreign_keys=[invited_by_user_id])
