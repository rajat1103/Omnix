"""Folder registration endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.indexing import (
    FolderCreateRequest,
    FolderListResponse,
    FolderRegistrationResponse,
    FolderResponse,
)
from app.services.file_indexer import (
    DuplicateFolderError,
    FileIndexerService,
    FolderRegistrationError,
    FolderNotFoundError,
)

router = APIRouter(prefix="/index", tags=["indexing"])


def get_file_indexer_service(db: Session = Depends(get_db)) -> FileIndexerService:
    return FileIndexerService(db)


@router.post("/folder", response_model=FolderRegistrationResponse, status_code=status.HTTP_201_CREATED)
def register_folder(
    request: FolderCreateRequest,
    service: FileIndexerService = Depends(get_file_indexer_service),
) -> FolderRegistrationResponse:
    try:
        result = service.register_folder(request.path)
    except FolderRegistrationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except FolderNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except DuplicateFolderError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc

    folder = result.folder
    return FolderRegistrationResponse(
        id=folder.id,
        folder_name=folder.folder_name,
        folder_path=folder.folder_path,
    )


@router.get("/folders", response_model=FolderListResponse)
def list_folders(
    service: FileIndexerService = Depends(get_file_indexer_service),
) -> FolderListResponse:
    folders = service.list_folders()
    return FolderListResponse(
        folders=[FolderResponse.model_validate(folder) for folder in folders],
    )


@router.delete("/folder/{folder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_folder(
    folder_id: str,
    service: FileIndexerService = Depends(get_file_indexer_service),
) -> None:
    deleted = service.delete_folder(folder_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")
