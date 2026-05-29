from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.utils.dates import utc_now
from app.utils.ids import generate_id


class Testimonial(Base):
    __tablename__ = "testimonials"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("tst_"))
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    position_title: Mapped[str | None] = mapped_column(String(255))
    institution: Mapped[str | None] = mapped_column(String(255))
    country: Mapped[str | None] = mapped_column(String(100))
    profile_image_url: Mapped[str | None] = mapped_column(String(500))
    testimonial_text: Mapped[str] = mapped_column(Text, nullable=False)
    rating: Mapped[int | None] = mapped_column(Integer)
    display_priority: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
