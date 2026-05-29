"""Applicant academic profile completion and validation."""

from __future__ import annotations

from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User

# (section_key, field_key, human label)
REQUIRED_CHECKS: list[tuple[str, str, str]] = [
    ("personal", "first_name", "First name"),
    ("personal", "last_name", "Last name"),
    ("contact", "backup_email", "Backup email"),
    ("personal", "country_of_residence", "Country of residence"),
    ("academic", "university_name", "University / institution"),
    ("academic", "highest_degree", "Highest degree"),
    ("academic", "field_of_study", "Field of study"),
    ("identity", "document_type", "Identity document type"),
    ("identity", "document_number", "Identity document number"),
    ("identity", "front_image_url", "Identity document upload"),
    ("identity", "issuing_country", "Issuing country"),
    ("consents", "terms_accepted", "Terms & Conditions"),
    ("consents", "verification_consent", "Verification consent"),
]

SECTION_KEYS = [
    "personal",
    "contact",
    "academic",
    "affiliation",
    "researcher",
    "identity",
    "consents",
]


def _get_nested(data: dict, section: str, field: str) -> Any:
    block = data.get(section) or {}
    return block.get(field)


def _is_filled(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, bool):
        return value is True
    if isinstance(value, str):
        return bool(value.strip())
    return True


def _sync_user_columns(user: User, profile: dict) -> None:
    personal = profile.get("personal") or {}
    academic = profile.get("academic") or {}
    affiliation = profile.get("affiliation") or {}
    contact = profile.get("contact") or {}

    if personal.get("first_name"):
        user.first_name = personal["first_name"].strip()
    if personal.get("last_name"):
        user.last_name = personal["last_name"].strip()
    if personal.get("middle_name") is not None:
        user.middle_name = personal.get("middle_name") or None

    first = (user.first_name or "").strip()
    last = (user.last_name or "").strip()
    if first or last:
        user.full_name = " ".join(p for p in [first, (user.middle_name or "").strip(), last] if p).strip()
        if not user.display_name:
            user.display_name = user.full_name

    country = personal.get("country_of_residence") or affiliation.get("organization_country")
    if country:
        user.country = country.strip()
    if personal.get("city"):
        user.city = personal["city"].strip()

    uni = academic.get("university_name") or affiliation.get("organization_name")
    if uni:
        user.affiliation = uni.strip()
    if academic.get("department"):
        user.department = academic["department"].strip()
    if academic.get("current_academic_status"):
        user.professional_role = academic["current_academic_status"].strip()

    if contact.get("backup_email"):
        user.backup_email = contact["backup_email"].strip().lower()
    if contact.get("phone_number"):
        user.phone_number = contact["phone_number"].strip()
    if contact.get("whatsapp_number"):
        user.whatsapp_number = contact["whatsapp_number"].strip()
    if contact.get("preferred_language"):
        user.preferred_language = contact["preferred_language"].strip()


def compute_profile_state(user: User) -> dict:
    profile = user.profile_json or {}
    # Mirror top-level columns into profile for checks
    if user.email and not _get_nested(profile, "contact", "primary_email"):
        profile.setdefault("contact", {})["primary_email"] = user.email
    if user.country and not _get_nested(profile, "personal", "country_of_residence"):
        profile.setdefault("personal", {})["country_of_residence"] = user.country
    if user.affiliation and not _get_nested(profile, "academic", "university_name"):
        profile.setdefault("academic", {})["university_name"] = user.affiliation
    if user.first_name and not _get_nested(profile, "personal", "first_name"):
        profile.setdefault("personal", {})["first_name"] = user.first_name
    if user.last_name and not _get_nested(profile, "personal", "last_name"):
        profile.setdefault("personal", {})["last_name"] = user.last_name
    if user.backup_email and not _get_nested(profile, "contact", "backup_email"):
        profile.setdefault("contact", {})["backup_email"] = user.backup_email

    missing: list[dict[str, str]] = []
    for section, field, label in REQUIRED_CHECKS:
        val = _get_nested(profile, section, field)
        if section == "personal" and field == "country_of_residence" and not val:
            val = user.country
        if section == "academic" and field == "university_name" and not val:
            val = user.affiliation
        if not _is_filled(val):
            missing.append({"section": section, "field": field, "label": label})

    total = len(REQUIRED_CHECKS)
    done = total - len(missing)
    percent = int(round(100 * done / total)) if total else 0
    can_submit = len(missing) == 0

    sections: dict[str, dict] = {}
    for key in SECTION_KEYS:
        block = profile.get(key) or {}
        section_fields = [(s, f, l) for s, f, l in REQUIRED_CHECKS if s == key]
        if not section_fields:
            sections[key] = {"complete": bool(block), "percent": 100 if block else 0}
            continue
        missing_keys = {(m["section"], m["field"]) for m in missing}
        section_done = sum(1 for s, f, _ in section_fields if (s, f) not in missing_keys)
        sections[key] = {
            "complete": section_done == len(section_fields),
            "percent": int(round(100 * section_done / len(section_fields))),
        }

    identity_status = (profile.get("identity") or {}).get("status") or "not_submitted"
    if _is_filled(_get_nested(profile, "identity", "front_image_url")):
        identity_status = identity_status if identity_status != "not_submitted" else "submitted"

    return {
        "percent": percent,
        "status": "complete" if can_submit else "incomplete",
        "can_submit_applications": can_submit,
        "missing_fields": missing,
        "sections": sections,
        "identity_verification_status": identity_status,
    }


def merge_profile_update(user: User, payload: dict) -> dict:
    current = dict(user.profile_json or {})
    for section, data in payload.items():
        if section not in SECTION_KEYS and section != "research_interests":
            continue
        if section == "research_interests":
            current["research_interests"] = data
            continue
        if not isinstance(data, dict):
            continue
        block = dict(current.get(section) or {})
        block.update({k: v for k, v in data.items() if v is not None or isinstance(v, bool)})
        current[section] = block
    return current


def update_profile(db: Session, user: User, payload: dict) -> User:
    user.profile_json = merge_profile_update(user, payload)
    _sync_user_columns(user, user.profile_json)
    state = compute_profile_state(user)
    user.profile_completion_percent = state["percent"]
    user.profile_status = state["status"]
    db.commit()
    db.refresh(user)
    return user


def set_identity_document(
    db: Session,
    user: User,
    *,
    front_url: str | None = None,
    back_url: str | None = None,
    document_type: str | None = None,
    document_number: str | None = None,
    issuing_country: str | None = None,
    expiry_date: str | None = None,
) -> User:
    profile = dict(user.profile_json or {})
    identity = dict(profile.get("identity") or {})
    if document_type:
        identity["document_type"] = document_type
    if document_number:
        identity["document_number"] = document_number
    if issuing_country:
        identity["issuing_country"] = issuing_country
    if expiry_date:
        identity["expiry_date"] = expiry_date
    if front_url:
        identity["front_image_url"] = front_url
    if back_url:
        identity["back_image_url"] = back_url
    if front_url or back_url:
        identity["status"] = "submitted"
    profile["identity"] = identity
    user.profile_json = profile
    _sync_user_columns(user, profile)
    state = compute_profile_state(user)
    user.profile_completion_percent = state["percent"]
    user.profile_status = state["status"]
    db.commit()
    db.refresh(user)
    return user


def assert_can_submit(user: User) -> None:
    state = compute_profile_state(user)
    if not state["can_submit_applications"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Complete your applicant profile before submitting a conference application.",
        )


def profile_to_response(user: User) -> dict:
    state = compute_profile_state(user)
    profile = user.profile_json or {}
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "display_name": user.display_name,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "middle_name": user.middle_name,
        "profile_photo_url": user.profile_photo_url,
        "country": user.country,
        "city": user.city,
        "affiliation": user.affiliation,
        "department": user.department,
        "professional_role": user.professional_role,
        "bio": user.bio,
        "is_verified": user.is_verified,
        "created_at": user.created_at,
        "profile": profile,
        "completion": state,
    }
