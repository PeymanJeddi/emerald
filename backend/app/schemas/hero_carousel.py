from datetime import datetime

from pydantic import BaseModel, Field


class HeroCarouselSlideBase(BaseModel):
    title: str
    subtitle: str | None = None
    description: str | None = None
    background_image_url: str | None = None
    cta_label: str | None = None
    cta_url: str | None = None
    cta_type: str = "internal"
    display_priority: int = 0
    is_active: bool = True
    publish_at: datetime | None = None
    expires_at: datetime | None = None


class HeroCarouselSlideCreate(HeroCarouselSlideBase):
    pass


class HeroCarouselSlideUpdate(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    description: str | None = None
    background_image_url: str | None = None
    cta_label: str | None = None
    cta_url: str | None = None
    cta_type: str | None = None
    display_priority: int | None = None
    is_active: bool | None = None
    publish_at: datetime | None = None
    expires_at: datetime | None = None


class HeroCarouselSlideResponse(HeroCarouselSlideBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class HeroCarouselReorderItem(BaseModel):
    id: str
    display_priority: int


class HeroCarouselReorderRequest(BaseModel):
    slides: list[HeroCarouselReorderItem] = Field(min_length=1)
