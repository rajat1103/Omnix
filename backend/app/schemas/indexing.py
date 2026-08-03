"""Schemas for folder registration and listing."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class FolderCreateRequest(BaseModel):
    path: str = Field(..., min_length=1)

    @field_validator("path")
    @classmethod
    def strip_path(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Folder path cannot be empty")
        return normalized


class FolderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    folder_name: str
    folder_path: str
    is_active: bool
    created_at: datetime
    last_scan_at: datetime | None = None


class FolderRegistrationResponse(BaseModel):
    id: str
    folder_name: str
    folder_path: str
    status: str = "registered"


class FolderListResponse(BaseModel):
    folders: list[FolderResponse]
