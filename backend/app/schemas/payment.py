from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class PaymentCreate(BaseModel):
    submission_id: str | None = None
    amount: Decimal = Field(gt=0)
    currency: str = "USD"
    method: str | None = None
    payment_reference: str | None = None


class PaymentResponse(BaseModel):
    id: str
    user_id: str
    submission_id: str | None
    amount: Decimal
    currency: str
    method: str | None
    status: str
    payment_reference: str | None
    receipt_file_url: str | None
    admin_note: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PaymentAdminNote(BaseModel):
    admin_note: str
