"""Application version endpoint."""

from fastapi import APIRouter
from pydantic import BaseModel

from app.config.settings import settings


router = APIRouter(tags=["metadata"])


class VersionResponse(BaseModel):
    version: str


@router.get("/version", response_model=VersionResponse, summary="Application version")
async def version() -> VersionResponse:
    return VersionResponse(version=settings.app_version)