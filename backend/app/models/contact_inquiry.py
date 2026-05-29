from datetime import datetime

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.utils.dates import utc_now
from app.utils.ids import generate_id


class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("inq_"))
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    institution: Mapped[str | None] = mapped_column(String(255))
    country: Mapped[str | None] = mapped_column(String(100))
    inquiry_type: Mapped[str] = mapped_column(String(80), nullable=False)
    subject: Mapped[str] = mapped_column(String(500), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="new")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
