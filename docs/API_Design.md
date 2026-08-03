# API Design — Omnix

---

## Document Purpose

This document defines the **API design principles, conventions, and endpoint inventory** for the Omnix FastAPI backend. The API is a private, local API — it is consumed by the Tauri frontend and is not exposed to the internet.

---

## Design Principles

1. **Versioned from day one** — All endpoints are prefixed with `/api/v1/`
2. **RESTful where appropriate** — Use standard HTTP methods and status codes correctly
3. **Consistent response shapes** — Every response follows the same envelope structure
4. **Descriptive error messages** — Errors include a code, message, and optional detail
5. **Async-first** — All route handlers are `async def` to allow concurrent I/O
6. **Auto-documented** — FastAPI generates OpenAPI docs at `/docs` in development

---

## Base URL

```
http://127.0.0.1:8000/api/v1
```

---

## Response Envelope

All API responses follow this structure:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 42,
    "page": 1,
    "per_page": 20
  }
}
```

`meta` is only present for paginated responses.

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "The requested file could not be found.",
    "detail": "/Users/name/notes.md was not in the index."
  }
}
```

---

## HTTP Status Codes

| Code | Usage |
|---|---|
| `200 OK` | Successful GET, PUT, PATCH |
| `201 Created` | Successful POST that creates a resource |
| `204 No Content` | Successful DELETE |
| `400 Bad Request` | Invalid request body or query parameters |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Resource already exists (e.g., duplicate file path) |
| `422 Unprocessable Entity` | FastAPI validation error |
| `500 Internal Server Error` | Unexpected server error |

---

## Endpoint Inventory

> Status: `PLANNED` until implemented. Updated per sprint.

### Search

| Method | Path | Description | Status |
|---|---|---|---|
| `POST` | `/search` | Semantic + keyword search across indexed content | PLANNED |
| `GET` | `/search/history` | Retrieve recent search queries | PLANNED |

### Files

| Method | Path | Description | Status |
|---|---|---|---|
| `GET` | `/files` | List all indexed files | PLANNED |
| `GET` | `/files/{file_id}` | Get file metadata and chunks | PLANNED |
| `POST` | `/files/index` | Trigger indexing for a specific path | PLANNED |
| `DELETE` | `/files/{file_id}` | Remove a file from the index | PLANNED |
| `GET` | `/files/status` | Get overall indexing status and progress | PLANNED |

### Chat

| Method | Path | Description | Status |
|---|---|---|---|
| `GET` | `/conversations` | List all conversations | PLANNED |
| `POST` | `/conversations` | Create a new conversation | PLANNED |
| `GET` | `/conversations/{id}` | Get a conversation with its messages | PLANNED |
| `DELETE` | `/conversations/{id}` | Delete a conversation | PLANNED |
| `POST` | `/conversations/{id}/messages` | Send a message, receive AI response | PLANNED |

### Memory

| Method | Path | Description | Status |
|---|---|---|---|
| `GET` | `/memory` | List all memory items | PLANNED |
| `POST` | `/memory` | Create a manual memory item | PLANNED |
| `PATCH` | `/memory/{id}` | Update a memory item | PLANNED |
| `DELETE` | `/memory/{id}` | Delete a memory item | PLANNED |

### Settings

| Method | Path | Description | Status |
|---|---|---|---|
| `GET` | `/settings` | Get all user settings | PLANNED |
| `PATCH` | `/settings` | Update one or more settings | PLANNED |
| `GET` | `/settings/providers` | List available AI providers and their status | PLANNED |

### System

| Method | Path | Description | Status |
|---|---|---|---|
| `GET` | `/health` | Health check | PLANNED |
| `GET` | `/version` | Application version info | PLANNED |
| `POST` | `/system/reset` | Delete all Omnix data | PLANNED |

---

## Naming Conventions

| Convention | Rule | Example |
|---|---|---|
| URL paths | Lowercase, hyphen-separated | `/indexed-files`, `/memory-items` |
| Query params | snake_case | `?page=1&per_page=20&sort_by=created_at` |
| JSON keys | snake_case | `{ "file_path": "...", "created_at": "..." }` |
| Route files | `{resource}.py` | `search.py`, `conversations.py` |

---

## Pagination

All list endpoints support cursor-based or offset pagination:

```
GET /files?page=2&per_page=50
```

Response includes a `meta` object:

```json
{
  "meta": {
    "total": 1042,
    "page": 2,
    "per_page": 50,
    "total_pages": 21
  }
}
```

---

## API Versioning Strategy

- The current API version is `v1`
- Breaking changes require a new version (`v2`), not modification of `v1`
- Backward-compatible additions (new optional fields, new endpoints) do not require a version bump
- Old versions are deprecated with a `Deprecation` response header before removal
