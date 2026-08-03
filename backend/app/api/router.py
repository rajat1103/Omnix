"""Central API router composition."""

from fastapi import APIRouter

from app.api.health import router as health_router
from app.api.indexing import router as indexing_router
from app.api.info import router as info_router
from app.api.version import router as version_router


api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(version_router)
api_router.include_router(info_router)
api_router.include_router(indexing_router)
