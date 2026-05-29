from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.utils.dates import utc_now
from app.utils.ids import generate_id

CERTIFICATE_STATUSES = ("verified", "revoked", "draft")


class Certificate(Base):
    __tablename__ = "certificates"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("cert_"))
    certificate_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), nullable=False)
    submission_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("submissions.id"))
    event_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("events.id"))
    holder_name: Mapped[str] = mapped_column(String(255), nullable=False)
    event_title_snapshot: Mapped[str | None] = mapped_column(String(500))
    event_date_snapshot: Mapped[str | None] = mapped_column(String(100))
    location_snapshot: Mapped[str | None] = mapped_column(String(255))
    role: Mapped[str | None] = mapped_column(String(100))
    record_type: Mapped[str | None] = mapped_column(String(200))
    presentation_title: Mapped[str | None] = mapped_column(String(500))
    issue_date: Mapped[date | None] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(20), default="draft")
    verification_message: Mapped[str | None] = mapped_column(Text)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    revoke_reason: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="certificates")
    submission = relationship("Submission", back_populates="certificates")
    event = relationship("Event", back_populates="certificates")
