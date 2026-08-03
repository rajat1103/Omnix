"""Folder registration service for the file intelligence engine."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.indexing import IndexedFile, IndexedFolder


class FolderNotFoundError(ValueError):
    pass


class DuplicateFolderError(ValueError):
    pass


class FolderRegistrationError(ValueError):
    pass


@dataclass(slots=True)
class FolderRegistrationResult:
    folder: IndexedFolder


class FileIndexerService:
    """Database-backed folder registration and cleanup operations."""

    def __init__(self, session: Session):
        self.session = session

    def register_folder(self, raw_path: str) -> FolderRegistrationResult:
        path = self._normalize_path(raw_path)
        if not path:
            raise FolderRegistrationError("Folder path cannot be empty")

        folder_path = Path(path)
        if not folder_path.exists() or not folder_path.is_dir():
            raise FolderNotFoundError("Folder does not exist")

        normalized_path = str(folder_path.resolve())
        existing = self.session.scalar(
            select(IndexedFolder).where(IndexedFolder.folder_path == normalized_path)
        )
        if existing is not None:
            raise DuplicateFolderError("Folder is already registered")

        folder = IndexedFolder(
            folder_name=folder_path.name or normalized_path,
            folder_path=normalized_path,
            is_active=True,
        )
        self.session.add(folder)
        try:
            self.session.commit()
        except IntegrityError as exc:
            self.session.rollback()
            raise DuplicateFolderError("Folder is already registered") from exc

        self.session.refresh(folder)
        return FolderRegistrationResult(folder=folder)

    def list_folders(self) -> list[IndexedFolder]:
        statement = select(IndexedFolder).order_by(IndexedFolder.folder_name.asc())
        return list(self.session.scalars(statement).all())

    def delete_folder(self, folder_id: str) -> bool:
        folder = self.session.get(IndexedFolder, folder_id)
        if folder is None:
            return False

        self.session.delete(folder)
        self.session.commit()
        return True

    def folder_exists(self, raw_path: str) -> bool:
        path = self._normalize_path(raw_path)
        if not path:
            return False

        normalized_path = str(Path(path).resolve())
        return (
            self.session.scalar(
                select(IndexedFolder.id).where(IndexedFolder.folder_path == normalized_path)
            )
            is not None
        )

    def clear_indexed_files_for_folder(self, folder_id: str) -> int:
        result = self.session.execute(delete(IndexedFile).where(IndexedFile.folder_id == folder_id))
        self.session.commit()
        return result.rowcount or 0

    @staticmethod
    def _normalize_path(raw_path: str) -> str:
        return raw_path.strip() if raw_path else ""
