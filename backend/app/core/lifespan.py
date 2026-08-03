"""FastAPI lifespan management."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from loguru import logger

from app.config.settings import settings
from app.database.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    logger.info(
        "Starting {} | environment={} | version={}",
        settings.app_name,
        settings.environment,
        settings.app_version,
    )
    try:
        yield
    finally:
        logger.info("Shutting down {}", settings.app_name)
        engine.dispose()
        logger.info("Application shutdown complete")
