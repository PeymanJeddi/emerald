from datetime import datetime

from pydantic import BaseModel, Field


class TestimonialBase(BaseModel):
    full_name: str
    position_title: str | None = None
    institution: str | None = None
    country: str | None = None
    profile_image_url: str | None = None
    testimonial_text: str
    rating: int | None = Field(default=None, ge=1, le=5)
    display_priority: int = 0
    is_active: bool = True


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    full_name: str | None = None
    position_title: str | None = None
    institution: str | None = None
    country: str | None = None
    profile_image_url: str | None = None
    testimonial_text: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    display_priority: int | None = None
    is_active: bool | None = None


class TestimonialResponse(TestimonialBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TestimonialReorderItem(BaseModel):
    id: str
    display_priority: int


class TestimonialReorderRequest(BaseModel):
    items: list[TestimonialReorderItem] = Field(min_length=1)
