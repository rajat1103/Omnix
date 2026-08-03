"""Application metadata endpoint."""

from fastapi import APIRouter
from pydantic import BaseModel

from app.config.settings import settings


router = APIRouter(tags=["metadata"])


class InfoResponse(BaseModel):
    name: str
    environment: str
    debug: bool


@router.get("/info", response_model=InfoResponse, summary="Application metadata")
async def info() -> InfoResponse:
    return InfoResponse(
        name=settings.app_name,
        environment=settings.environment,
        debug=settings.debug,
    )