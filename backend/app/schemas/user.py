from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserProfileUpdate(BaseModel):
    full_name: str | None = None
    display_name: str | None = None
    country: str | None = None
    city: str | None = None
    affiliation: str | None = None
    department: str | None = None
    professional_role: str | None = None
    bio: str | None = None


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    display_name: str | None
    role: str
    country: str | None
    city: str | None
    affiliation: str | None
    department: str | None
    professional_role: str | None
    bio: str | None
    profile_photo_url: str | None
    is_active: bool
    is_verified: bool
    created_at: datetime
    first_name: str | None = None
    last_name: str | None = None
    backup_email: str | None = None
    profile_completion_percent: int | None = None
    profile_status: str | None = None

    model_config = {"from_attributes": True}


class AdminUserUpdate(BaseModel):
    full_name: str | None = None
    display_name: str | None = None
    country: str | None = None
    affiliation: str | None = None
    is_verified: bool | None = None


class RoleUpdate(BaseModel):
    role: str


class StatusUpdate(BaseModel):
    is_active: bool
