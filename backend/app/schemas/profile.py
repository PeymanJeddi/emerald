from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field


class ProfileSectionUpdate(BaseModel):
    personal: dict[str, Any] | None = None
    contact: dict[str, Any] | None = None
    academic: dict[str, Any] | None = None
    affiliation: dict[str, Any] | None = None
    researcher: dict[str, Any] | None = None
    identity: dict[str, Any] | None = None
    consents: dict[str, Any] | None = None
    research_interests: list[str] | None = None


class ProfileCompletionState(BaseModel):
    percent: int
    status: str
    can_submit_applications: bool
    missing_fields: list[dict[str, str]]
    sections: dict[str, dict[str, Any]]
    identity_verification_status: str


class ApplicantProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    display_name: str | None
    first_name: str | None
    last_name: str | None
    middle_name: str | None
    profile_photo_url: str | None
    country: str | None
    city: str | None
    affiliation: str | None
    department: str | None
    professional_role: str | None
    bio: str | None
    is_verified: bool
    created_at: datetime
    profile: dict[str, Any]
    completion: ProfileCompletionState


class DashboardResponse(BaseModel):
    user: ApplicantProfileResponse
    recent_submissions: list[dict[str, Any]]
    unread_messages_count: int
    document_status: str
