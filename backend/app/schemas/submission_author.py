from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserLookupPreview(BaseModel):
    id: str
    full_name: str
    email: str
    institution: str | None = None
    country: str | None = None
    profile_photo_url: str | None = None
    email_verified: bool = False
    profile_status: str | None = None
    status: str = "active"


class UserLookupResponse(BaseModel):
    exists: bool
    message: str | None = None
    user: UserLookupPreview | None = None
    error_code: str | None = None


class SubmissionAuthorCreate(BaseModel):
    user_id: str
    role: str = Field(default="co_author")


class SubmissionAuthorResponse(BaseModel):
    id: str
    submission_id: str
    user_id: str
    email: str
    full_name: str
    institution: str | None = None
    country: str | None = None
    profile_photo_url: str | None = None
    role: str
    author_order: int
    status: str
    added_at: datetime

    model_config = {"from_attributes": True}


class AuthorInvitationCreate(BaseModel):
    email: EmailStr


class AuthorInvitationResponse(BaseModel):
    id: str
    submission_id: str
    invited_email: str
    status: str
    created_at: datetime
    sent_at: datetime | None = None
    expires_at: datetime

    model_config = {"from_attributes": True}
