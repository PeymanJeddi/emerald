from datetime import date, datetime

from pydantic import BaseModel


class EventBase(BaseModel):
    title: str
    slug: str
    event_code: str
    subtitle: str | None = None
    event_type: str | None = None
    category: str | None = None
    location: str | None = None
    country: str | None = None
    format: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    submission_deadline: date | None = None
    registration_deadline: date | None = None
    status: str = "Upcoming"
    overview: str | None = None
    short_description: str | None = None
    cover_image_url: str | None = None
    hero_image_url: str | None = None
    hero_video_url: str | None = None
    video_thumbnail_url: str | None = None
    content_json: dict | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    og_image_url: str | None = None
    is_featured: bool = False
    display_priority: int = 0
    is_public: bool = True


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    event_code: str | None = None
    subtitle: str | None = None
    event_type: str | None = None
    category: str | None = None
    location: str | None = None
    country: str | None = None
    format: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    submission_deadline: date | None = None
    registration_deadline: date | None = None
    status: str | None = None
    overview: str | None = None
    short_description: str | None = None
    cover_image_url: str | None = None
    hero_image_url: str | None = None
    hero_video_url: str | None = None
    video_thumbnail_url: str | None = None
    content_json: dict | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    og_image_url: str | None = None
    is_featured: bool | None = None
    display_priority: int | None = None
    is_public: bool | None = None


class EventResponse(EventBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class EventListItem(BaseModel):
    id: str
    title: str
    slug: str
    event_code: str
    subtitle: str | None = None
    event_type: str | None = None
    category: str | None
    location: str | None
    country: str | None = None
    format: str | None
    start_date: date | None
    end_date: date | None
    submission_deadline: date | None = None
    registration_deadline: date | None = None
    status: str
    overview: str | None = None
    short_description: str | None = None
    cover_image_url: str | None = None
    hero_image_url: str | None = None

    model_config = {"from_attributes": True}


class EventListResponse(BaseModel):
    items: list[EventListItem]
    total: int
    limit: int
    offset: int
