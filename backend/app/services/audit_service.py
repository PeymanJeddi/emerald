from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def log_action(
    db: Session,
    *,
    actor_user_id: str | None,
    action: str,
    entity_type: str | None = None,
    entity_id: str | None = None,
    metadata: dict | None = None,
) -> AuditLog:
    entry = AuditLog(
        actor_user_id=actor_user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        metadata_json=metadata,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry
