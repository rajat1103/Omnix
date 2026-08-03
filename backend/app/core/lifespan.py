"""FastAPI lifespan management."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from loguru import logger

from app.database.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    logger.info("Starting Omnix backend")
    try:
        yield
    finally:
        logger.info("Shutting down Omnix backend")
        engine.dispose()
