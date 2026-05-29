from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.utils.dates import utc_now
from app.utils.ids import generate_id


class SubmissionFile(Base):
    __tablename__ = "submission_files"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("fil_"))
    submission_id: Mapped[str] = mapped_column(String(32), ForeignKey("submissions.id"), nullable=False)
    file_type: Mapped[str] = mapped_column(String(50), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(500), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(1000), nullable=False)
    mime_type: Mapped[str | None] = mapped_column(String(100))
    size_bytes: Mapped[int | None] = mapped_column(BigInteger)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    submission = relationship("Submission", back_populates="files")
