from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.event import EventListItem, EventListResponse, EventResponse
from app.services import event_service

public_router = APIRouter(prefix="/api/public/events", tags=["public-events"])


@public_router.get("/filters")
def event_filters(db: Session = Depends(get_db)):
    return event_service.get_event_filter_options(db)


@public_router.get("", response_model=EventListResponse)
def list_events(
    db: Session = Depends(get_db),
    tab: str | None = Query(None, description="upcoming or past"),
    search: str | None = None,
    year: int | None = None,
    month: int | None = Query(None, ge=1, le=12),
    season: str | None = None,
    conference_type: str | None = None,
    country: str | None = None,
    status: str | None = None,
    upcoming_only: bool = False,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    sort: str = Query("date_asc", pattern="^(date_asc|date_desc)$"),
):
    result = event_service.list_public_events_query(
        db,
        tab=tab,
        search=search,
        year=year,
        month=month,
        season=season,
        conference_type=conference_type,
        country=country,
        status=status,
        upcoming_only=upcoming_only,
        limit=limit,
        offset=offset,
        sort=sort,
    )
    return EventListResponse(
        items=result.items,
        total=result.total,
        limit=limit,
        offset=offset,
    )


@public_router.get("/legacy", response_model=list[EventListItem], include_in_schema=False)
def list_events_legacy(db: Session = Depends(get_db)):
    return event_service.list_public_events(db)


@public_router.get("/{slug}", response_model=EventResponse)
def get_event(slug: str, db: Session = Depends(get_db)):
    return event_service.get_event_by_slug(db, slug)
