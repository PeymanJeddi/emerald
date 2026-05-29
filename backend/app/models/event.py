from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.utils.dates import utc_now
from app.utils.ids import generate_id


class Event(Base):
    __tablename__ = "events"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("evt_"))
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    event_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    subtitle: Mapped[str | None] = mapped_column(String(500))
    event_type: Mapped[str | None] = mapped_column(String(50))
    category: Mapped[str | None] = mapped_column(String(100))
    location: Mapped[str | None] = mapped_column(String(255))
    country: Mapped[str | None] = mapped_column(String(100))
    format: Mapped[str | None] = mapped_column(String(50))
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)
    submission_deadline: Mapped[date | None] = mapped_column(Date)
    registration_deadline: Mapped[date | None] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(50), default="Upcoming")
    overview: Mapped[str | None] = mapped_column(Text)
    short_description: Mapped[str | None] = mapped_column(Text)
    cover_image_url: Mapped[str | None] = mapped_column(String(500))
    hero_image_url: Mapped[str | None] = mapped_column(String(500))
    hero_video_url: Mapped[str | None] = mapped_column(String(500))
    video_thumbnail_url: Mapped[str | None] = mapped_column(String(500))
    content_json: Mapped[dict | None] = mapped_column(JSONB)
    seo_title: Mapped[str | None] = mapped_column(String(255))
    seo_description: Mapped[str | None] = mapped_column(String(500))
    og_image_url: Mapped[str | None] = mapped_column(String(500))
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    display_priority: Mapped[int] = mapped_column(Integer, default=0)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    submissions = relationship("Submission", back_populates="event")
    certificates = relationship("Certificate", back_populates="event")
