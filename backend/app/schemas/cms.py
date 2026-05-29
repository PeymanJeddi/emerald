from datetime import datetime

from pydantic import BaseModel


class CMSSectionResponse(BaseModel):
    id: str
    page_key: str
    section_key: str
    title: str | None
    subtitle: str | None
    body: str | None
    config_json: dict | None
    order_index: int
    is_active: bool

    model_config = {"from_attributes": True}


class CMSSectionCreate(BaseModel):
    page_key: str
    section_key: str
    title: str | None = None
    subtitle: str | None = None
    body: str | None = None
    config_json: dict | None = None
    order_index: int = 0
    is_active: bool = True


class CMSSectionUpdate(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    body: str | None = None
    config_json: dict | None = None
    order_index: int | None = None
    is_active: bool | None = None


class CMSPageResponse(BaseModel):
    id: str
    key: str
    title: str
    slug: str
    content_json: dict | None
    seo_title: str | None
    seo_description: str | None
    is_published: bool
    updated_at: datetime

    model_config = {"from_attributes": True}


class CMSPageCreate(BaseModel):
    key: str
    title: str
    slug: str
    content_json: dict | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    is_published: bool = True


class CMSPageUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    content_json: dict | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    is_published: bool | None = None


class HomepageResponse(BaseModel):
    hero: dict
    features: dict
    services: dict
    advantages: dict
    conferences: dict
    testimonials: dict
    apply_cta: dict
    events: dict
    seo: dict
    institutional: dict
    verification: dict


class ContactResponse(BaseModel):
    hero: dict
    introduction: dict
    contact_methods: dict
    form: dict
    departments: dict
    office: dict
    faq: dict
    partnerships: dict
    social: dict
    priority_notice: dict
    cta: dict
    seo: dict


class AboutResponse(BaseModel):
    hero: dict
    mission: dict
    vision: dict
    why_built: dict
    advantages: dict
    integrity: dict
    global_positioning: dict
    statistics: dict
    timeline: dict
    values: dict
    partners: dict
    gallery: dict
    testimonials: dict
    cta: dict
    seo: dict
