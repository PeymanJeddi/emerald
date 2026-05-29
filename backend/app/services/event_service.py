import re
from datetime import date, datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate

PAST_STATUSES = frozenset({"Completed", "Archived", "Closed"})
UPCOMING_STATUSES = frozenset(
    {
        "Upcoming",
        "Submission Open",
        "Under Review",
        "Registration Open",
        "Ongoing",
        "Open for Registration",
    }
)

SEASON_MONTHS = {
    "spring": (3, 4, 5),
    "summer": (6, 7, 8),
    "fall": (9, 10, 11),
    "autumn": (9, 10, 11),
    "winter": (12, 1, 2),
}


def slugify(text: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[-\s]+", "-", slug).strip("-")


def _today() -> date:
    return datetime.now(timezone.utc).date()


def _is_upcoming_event(event: Event, today: date) -> bool:
    if event.status in PAST_STATUSES:
        return False
    if event.end_date and event.end_date >= today:
        return True
    if event.start_date and event.start_date >= today:
        return True
    return event.status in UPCOMING_STATUSES


def _is_past_event(event: Event, today: date) -> bool:
    if event.status in PAST_STATUSES:
        return True
    if event.end_date and event.end_date < today:
        return True
    if event.start_date and event.start_date < today and event.status == "Completed":
        return True
    return False


def list_public_events(db: Session) -> list[Event]:
    return list_public_events_query(db).items


class PublicEventListResult:
    def __init__(self, items: list[Event], total: int):
        self.items = items
        self.total = total


def list_public_events_query(
    db: Session,
    *,
    tab: str | None = None,
    search: str | None = None,
    year: int | None = None,
    month: int | None = None,
    season: str | None = None,
    conference_type: str | None = None,
    country: str | None = None,
    status: str | None = None,
    upcoming_only: bool = False,
    limit: int = 50,
    offset: int = 0,
    sort: str = "date_asc",
) -> PublicEventListResult:
    today = _today()
    q = select(Event).where(Event.is_public == True)  # noqa: E712

    if search:
        term = f"%{search.strip()}%"
        q = q.where(
            or_(
                Event.title.ilike(term),
                Event.overview.ilike(term),
                Event.short_description.ilike(term),
                Event.location.ilike(term),
                Event.country.ilike(term),
            )
        )
    if year:
        q = q.where(func.extract("year", Event.start_date) == year)
    if month:
        q = q.where(func.extract("month", Event.start_date) == month)
    if season:
        months = SEASON_MONTHS.get(season.lower())
        if months:
            q = q.where(func.extract("month", Event.start_date).in_(months))
    if conference_type:
        q = q.where(Event.category.ilike(conference_type))
    if country:
        q = q.where(or_(Event.country.ilike(country), Event.location.ilike(f"%{country}%")))
    if status:
        q = q.where(Event.status.ilike(status))

    events = list(db.scalars(q).all())

    if tab == "upcoming" or upcoming_only:
        events = [e for e in events if _is_upcoming_event(e, today)]
    elif tab == "past":
        events = [e for e in events if _is_past_event(e, today)]
    elif tab == "completed":
        events = [e for e in events if e.status == "Completed" or _is_past_event(e, today)]
    elif tab == "archived":
        events = [e for e in events if e.status in ("Archived", "Closed")]

    if sort == "date_desc":
        events.sort(key=lambda e: (e.start_date or date.min), reverse=True)
    else:
        events.sort(key=lambda e: (e.start_date or date.max))

    total = len(events)
    page_items = events[offset : offset + limit]
    return PublicEventListResult(items=page_items, total=total)


def get_event_filter_options(db: Session) -> dict:
    events = list(db.scalars(select(Event).where(Event.is_public == True)).all())  # noqa: E712
    years = sorted(
        {e.start_date.year for e in events if e.start_date},
        reverse=True,
    )
    countries = sorted({e.country for e in events if e.country})
    types = sorted({e.category for e in events if e.category})
    statuses = sorted({e.status for e in events if e.status})
    return {
        "years": years,
        "countries": countries,
        "conference_types": types,
        "statuses": statuses,
        "seasons": ["spring", "summer", "fall", "winter"],
        "months": list(range(1, 13)),
    }


def get_event_by_slug(db: Session, slug: str) -> Event:
    event = db.scalar(select(Event).where(Event.slug == slug, Event.is_public == True))  # noqa: E712
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return event


def create_event(db: Session, data: EventCreate) -> Event:
    event = Event(**data.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def update_event(db: Session, event: Event, data: EventUpdate) -> Event:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(event, field, value)
    db.commit()
    db.refresh(event)
    return event
