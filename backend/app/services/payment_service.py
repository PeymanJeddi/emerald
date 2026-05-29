from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.user import User
from app.schemas.payment import PaymentCreate


def list_user_payments(db: Session, user_id: str) -> list[Payment]:
    return list(db.scalars(select(Payment).where(Payment.user_id == user_id).order_by(Payment.created_at.desc())).all())


def create_payment(db: Session, user: User, data: PaymentCreate) -> Payment:
    payment = Payment(user_id=user.id, status="submitted", **data.model_dump())
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def approve_payment(db: Session, payment: Payment, note: str | None = None) -> Payment:
    if payment.status not in ("submitted", "under_review", "pending"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot approve this payment")
    payment.status = "approved"
    if note:
        payment.admin_note = note
    db.commit()
    db.refresh(payment)
    return payment


def reject_payment(db: Session, payment: Payment, note: str | None = None) -> Payment:
    payment.status = "rejected"
    if note:
        payment.admin_note = note
    db.commit()
    db.refresh(payment)
    return payment
