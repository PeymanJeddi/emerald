from pydantic import BaseModel, EmailStr, Field


INQUIRY_TYPES = (
    "General Inquiry",
    "Conference Support",
    "Submission Assistance",
    "Publication Support",
    "Verification Inquiry",
    "Technical Support",
    "Partnership Request",
    "Sponsorship Inquiry",
    "Media Inquiry",
)


class ContactInquiryCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    institution: str | None = Field(None, max_length=255)
    country: str | None = Field(None, max_length=100)
    inquiry_type: str = Field(..., max_length=80)
    subject: str = Field(..., min_length=3, max_length=500)
    message: str = Field(..., min_length=10, max_length=10000)
    consent: bool = Field(..., description="Privacy policy consent")


class ContactInquiryResponse(BaseModel):
    id: str
    message: str
