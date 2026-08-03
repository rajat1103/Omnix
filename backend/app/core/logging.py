"""Application logging configuration."""

from __future__ import annotations

import logging
import sys
from typing import Any

from loguru import logger


class InterceptHandler(logging.Handler):
    """Route standard logging records into Loguru."""

    def emit(self, record: logging.LogRecord) -> None:
        level: Any = record.levelname
        if record.levelno == logging.NOTSET:
            level = "INFO"

        frame = logging.currentframe()
        depth = 2
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


def configure_logging(level: str = "INFO") -> None:
    """Configure Loguru and intercept stdlib logging.

    The logger is intentionally opinionated so Uvicorn, SQLAlchemy, and app logs
    share one consistent format.
    """

    normalized_level = level.upper()
    logger.remove()
    logger.add(
        sys.stdout,
        level=normalized_level,
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level:<8} | {name}:{function}:{line} - {message}",
        enqueue=True,
        backtrace=False,
        diagnose=False,
    )

    logging.root.handlers = [InterceptHandler()]
    logging.root.setLevel(normalized_level)

    for name in ("uvicorn", "uvicorn.error", "uvicorn.access", "sqlalchemy"):
        stdlib_logger = logging.getLogger(name)
        stdlib_logger.handlers = [InterceptHandler()]
        stdlib_logger.propagate = False
        stdlib_logger.setLevel(normalized_level)
