import os
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.file import SubmissionFile
from app.models.submission import Submission
from app.models.user import User


def ensure_upload_dir() -> Path:
    path = Path(settings.upload_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path


async def save_submission_file(
    db: Session,
    submission: Submission,
    user: User,
    file: UploadFile,
    file_type: str,
) -> SubmissionFile:
    if submission.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    if submission.status not in ("draft", "revision_requested"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot upload files")

    upload_dir = ensure_upload_dir()
    ext = Path(file.filename or "file").suffix
    stored_name = f"{submission.id}_{uuid.uuid4().hex}{ext}"
    storage_path = str(upload_dir / stored_name)

    content = await file.read()
    with open(storage_path, "wb") as f:
        f.write(content)

    record = SubmissionFile(
        submission_id=submission.id,
        file_type=file_type,
        original_filename=file.filename or stored_name,
        storage_path=storage_path,
        mime_type=file.content_type,
        size_bytes=len(content),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def file_url(storage_path: str) -> str:
    return f"/api/files/{os.path.basename(storage_path)}"
