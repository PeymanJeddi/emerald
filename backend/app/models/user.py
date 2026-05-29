from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.utils.dates import utc_now
from app.utils.ids import generate_id


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("usr_"))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str | None] = mapped_column(String(100))
    last_name: Mapped[str | None] = mapped_column(String(100))
    middle_name: Mapped[str | None] = mapped_column(String(100))
    display_name: Mapped[str | None] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="user", nullable=False)
    backup_email: Mapped[str | None] = mapped_column(String(255))
    phone_number: Mapped[str | None] = mapped_column(String(50))
    whatsapp_number: Mapped[str | None] = mapped_column(String(50))
    preferred_language: Mapped[str | None] = mapped_column(String(20))
    profile_json: Mapped[dict | None] = mapped_column(JSONB)
    profile_completion_percent: Mapped[int] = mapped_column(Integer, default=0)
    profile_status: Mapped[str] = mapped_column(String(30), default="incomplete")
    country: Mapped[str | None] = mapped_column(String(100))
    city: Mapped[str | None] = mapped_column(String(100))
    affiliation: Mapped[str | None] = mapped_column(String(255))
    department: Mapped[str | None] = mapped_column(String(255))
    professional_role: Mapped[str | None] = mapped_column(String(100))
    bio: Mapped[str | None] = mapped_column(Text)
    profile_photo_url: Mapped[str | None] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    submissions = relationship("Submission", back_populates="user")
    certificates = relationship("Certificate", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    messages = relationship("Message", back_populates="user")
