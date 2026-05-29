from pydantic import BaseModel


class FileUploadResponse(BaseModel):
    id: str
    file_type: str
    original_filename: str
    url: str
