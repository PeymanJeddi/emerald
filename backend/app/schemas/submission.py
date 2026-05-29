from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.submission_author import AuthorInvitationResponse, SubmissionAuthorResponse


class SubmissionCreate(BaseModel):
    event_id: str | None = None
    title: str | None = None
    abstract: str | None = None
    keywords: str | None = None
    participation_type: str | None = None
    attendance_format: str | None = None
    certificate_name: str | None = None
    certificate_role: str | None = None
    notes: str | None = Field(
        default=None,
        description="JSON-encoded extended application fields (draft only)",
    )


class SubmissionUpdate(BaseModel):
    event_id: str | None = None
    title: str | None = None
    abstract: str | None = None
    keywords: str | None = None
    participation_type: str | None = None
    attendance_format: str | None = None
    certificate_name: str | None = None
    certificate_role: str | None = None
    notes: str | None = Field(
        default=None,
        description="JSON-encoded extended application fields (draft only)",
    )


class SubmissionFileResponse(BaseModel):
    id: str
    file_type: str
    original_filename: str
    mime_type: str | None
    size_bytes: int | None
    uploaded_at: datetime

    model_config = {"from_attributes": True}


class SubmissionResponse(BaseModel):
    id: str
    submission_code: str
    user_id: str
    event_id: str | None
    title: str | None
    abstract: str | None
    keywords: str | None
    participation_type: str | None
    attendance_format: str | None
    status: str
    certificate_name: str | None
    certificate_role: str | None
    notes: str | None
    submitted_at: datetime | None
    last_updated_at: datetime
    files: list[SubmissionFileResponse] = []
    authors: list[SubmissionAuthorResponse] = []
    author_invitations: list[AuthorInvitationResponse] = []

    model_config = {"from_attributes": True}


class SubmissionStatusUpdate(BaseModel):
    status: str = Field(..., description="New submission status")


class SubmissionNotesUpdate(BaseModel):
    notes: str
