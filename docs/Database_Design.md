# Database Design — Omnix

---

## Document Purpose

This document defines the **database schema, data model, and migration strategy** for Omnix. Omnix uses **SQLite** as its primary structured data store, managed through SQLAlchemy ORM and Alembic migrations.

This document should be updated whenever a new table, column, or relationship is added.

---

## Design Principles

1. **Local-first** — All data lives in a single SQLite file on the user's machine
2. **Schema migrations are non-destructive** — Never drop columns; mark them deprecated first
3. **Soft deletes preferred** — Add `deleted_at` timestamps instead of hard deletes where user data is involved
4. **Timestamps everywhere** — Every table has `created_at` and `updated_at`
5. **UUIDs for primary keys** — Avoids ID collision issues if data is ever exported or merged

---

## Database File Location

```
Default: {APP_DATA_DIR}/data/omnix.db
Custom:  Configurable via DATABASE_URL in .env
```

On Windows: `%APPDATA%\Omnix\data\omnix.db`
On macOS: `~/Library/Application Support/Omnix/data/omnix.db`

---

## Tables

### `indexed_files`

Stores metadata for every file that has been indexed by Omnix.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique file record ID |
| `path` | TEXT | UNIQUE, NOT NULL | Absolute file path |
| `filename` | TEXT | NOT NULL | File basename |
| `extension` | TEXT | | File extension (`.pdf`, `.py`, etc.) |
| `mime_type` | TEXT | | MIME type string |
| `size_bytes` | INTEGER | | File size in bytes |
| `content_hash` | TEXT | | SHA-256 hash of file content |
| `last_indexed_at` | DATETIME | | When this file was last successfully indexed |
| `file_modified_at` | DATETIME | | OS-reported last modification time |
| `is_indexed` | BOOLEAN | DEFAULT true | Whether indexing succeeded |
| `index_error` | TEXT | | Error message if indexing failed |
| `created_at` | DATETIME | NOT NULL | Row creation timestamp |
| `updated_at` | DATETIME | NOT NULL | Row last-updated timestamp |
| `deleted_at` | DATETIME | | Soft delete timestamp |

### `file_chunks`

Stores individual text chunks extracted from indexed files. Each chunk maps to a FAISS vector.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique chunk ID |
| `file_id` | UUID | FK → `indexed_files.id` | Parent file |
| `chunk_index` | INTEGER | NOT NULL | Position of chunk within file |
| `content` | TEXT | NOT NULL | Raw text content of the chunk |
| `token_count` | INTEGER | | Approximate token count |
| `embedding_id` | TEXT | | Reference to FAISS vector ID |
| `created_at` | DATETIME | NOT NULL | |
| `updated_at` | DATETIME | NOT NULL | |

### `conversations`

Stores AI conversation sessions.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `title` | TEXT | | Auto-generated or user-set title |
| `summary` | TEXT | | AI-generated summary for memory |
| `ai_provider` | TEXT | | Provider used (`openai`, `ollama`, etc.) |
| `model_name` | TEXT | | Specific model used |
| `message_count` | INTEGER | DEFAULT 0 | Denormalized count |
| `created_at` | DATETIME | NOT NULL | |
| `updated_at` | DATETIME | NOT NULL | |
| `deleted_at` | DATETIME | | Soft delete |

### `messages`

Stores individual messages within a conversation.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `conversation_id` | UUID | FK → `conversations.id` | Parent conversation |
| `role` | TEXT | NOT NULL | `user` \| `assistant` \| `system` |
| `content` | TEXT | NOT NULL | Message text content |
| `sources` | TEXT | | JSON array of source file chunks used |
| `tokens_used` | INTEGER | | Token count for this message |
| `created_at` | DATETIME | NOT NULL | |

### `memory_items`

Stores persistent knowledge facts extracted from conversations and files.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `content` | TEXT | NOT NULL | The fact or memory statement |
| `source_type` | TEXT | | `conversation` \| `file` \| `manual` |
| `source_id` | UUID | | ID of the conversation or file |
| `confidence` | FLOAT | DEFAULT 1.0 | Confidence score (0–1) |
| `embedding_id` | TEXT | | FAISS vector reference |
| `is_active` | BOOLEAN | DEFAULT true | Whether this memory is active |
| `created_at` | DATETIME | NOT NULL | |
| `updated_at` | DATETIME | NOT NULL | |
| `deleted_at` | DATETIME | | Soft delete |

### `user_settings`

Stores user preferences and application configuration. Single-row table.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PK DEFAULT 1 | Always 1 |
| `theme` | TEXT | DEFAULT 'system' | `light` \| `dark` \| `system` |
| `accent_color` | TEXT | DEFAULT 'blue' | `blue` \| `teal` |
| `ai_provider` | TEXT | DEFAULT 'ollama' | Active AI provider |
| `ai_model` | TEXT | | Active model name |
| `index_paths` | TEXT | | JSON array of indexed directory paths |
| `index_extensions` | TEXT | | JSON array of included extensions |
| `index_exclude` | TEXT | | JSON array of excluded dirs |
| `index_interval` | INTEGER | DEFAULT 300 | Indexing interval in seconds |
| `updated_at` | DATETIME | NOT NULL | |

### `automation_log`

Audit trail for all automation actions performed.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `action_type` | TEXT | NOT NULL | e.g. `file.move`, `file.delete`, `app.launch` |
| `description` | TEXT | | Human-readable description |
| `parameters` | TEXT | | JSON object of action parameters |
| `status` | TEXT | NOT NULL | `pending` \| `confirmed` \| `executed` \| `failed` \| `cancelled` |
| `error` | TEXT | | Error message if failed |
| `executed_at` | DATETIME | | When the action was executed |
| `created_at` | DATETIME | NOT NULL | |

---

## Entity Relationships

```
indexed_files ──< file_chunks
conversations ──< messages
memory_items ──── (optional FK to conversations or indexed_files)
automation_log   (standalone audit table)
user_settings    (singleton configuration table)
```

---

## Migration Strategy

- All schema changes are managed by **Alembic**
- Migration files live in `backend/app/database/migrations/versions/`
- Migrations are run automatically on application startup in development
- In production, migrations must be run manually with `alembic upgrade head`
- **Never modify existing migration files** — always create new ones

### Commands

```bash
# Create a new migration
alembic revision --autogenerate -m "add source_id to memory_items"

# Apply all pending migrations
alembic upgrade head

# Roll back one migration
alembic downgrade -1

# View migration history
alembic history
```

---

## Indexes

Performance indexes to be added as load testing informs bottlenecks:

| Table | Column(s) | Type | Rationale |
|---|---|---|---|
| `indexed_files` | `path` | UNIQUE | Lookup by path is the most common operation |
| `indexed_files` | `content_hash` | INDEX | Deduplication checks |
| `file_chunks` | `file_id` | INDEX | Fetch all chunks for a file |
| `messages` | `conversation_id` | INDEX | Load conversation history |
| `memory_items` | `is_active, created_at` | INDEX | Filter active memories |

---

## FAISS Index Management

The FAISS index is stored separately from SQLite in binary `.faiss` files.

```
data/faiss_indexes/
├── files.faiss          # Embeddings for file_chunks
├── files.faiss.meta     # JSON metadata mapping FAISS IDs → chunk UUIDs
├── memory.faiss         # Embeddings for memory_items
└── memory.faiss.meta
```

The `.meta` file bridges the FAISS integer IDs back to UUID records in SQLite.
