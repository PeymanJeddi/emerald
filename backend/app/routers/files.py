import os
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.core.config import settings

router = APIRouter(prefix="/api/files", tags=["files"])


@router.get("/{filename}")
def get_file(filename: str):
    path = Path(settings.upload_dir) / filename
    if not path.exists() or ".." in filename:
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path, filename=os.path.basename(filename))
