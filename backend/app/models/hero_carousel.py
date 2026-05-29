from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.utils.dates import utc_now
from app.utils.ids import generate_id


class HeroCarouselSlide(Base):
    __tablename__ = "hero_carousel_slides"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("hcs_"))
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    subtitle: Mapped[str | None] = mapped_column(String(500))
    description: Mapped[str | None] = mapped_column(Text)
    background_image_url: Mapped[str | None] = mapped_column(String(500))
    cta_label: Mapped[str | None] = mapped_column(String(120))
    cta_url: Mapped[str | None] = mapped_column(String(500))
    cta_type: Mapped[str] = mapped_column(String(20), default="internal")
    display_priority: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    publish_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
