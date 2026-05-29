from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.utils.dates import utc_now
from app.utils.ids import generate_id

PAYMENT_STATUSES = ("pending", "submitted", "under_review", "approved", "rejected", "refunded")


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: generate_id("pay_"))
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), nullable=False)
    submission_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("submissions.id"))
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    method: Mapped[str | None] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(30), default="pending")
    payment_reference: Mapped[str | None] = mapped_column(String(200))
    receipt_file_url: Mapped[str | None] = mapped_column(String(500))
    admin_note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="payments")
    submission = relationship("Submission", back_populates="payments")
