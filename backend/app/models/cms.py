from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.utils.dates import utc_now
from app.utils.ids import generate_id


class CMSPage(Base):
    __tablename__ = "cms_pages"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("pg_"))
    key: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    content_json: Mapped[dict | None] = mapped_column(JSONB)
    seo_title: Mapped[str | None] = mapped_column(String(255))
    seo_description: Mapped[str | None] = mapped_column(String(500))
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class CMSSection(Base):
    __tablename__ = "cms_sections"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("sec_"))
    page_key: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    section_key: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str | None] = mapped_column(String(500))
    subtitle: Mapped[str | None] = mapped_column(String(500))
    body: Mapped[str | None] = mapped_column(Text)
    config_json: Mapped[dict | None] = mapped_column(JSONB)
    order_index: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
