from datetime import datetime

from pydantic import BaseModel


class MessageResponse(BaseModel):
    id: str
    title: str
    body: str
    type: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
