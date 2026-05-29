from datetime import date, datetime, timezone


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def format_date(d: date | datetime | None) -> str | None:
    if d is None:
        return None
    if isinstance(d, datetime):
        return d.date().isoformat()
    return d.isoformat()
