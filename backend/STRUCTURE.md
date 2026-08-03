# Backend Structure — Omnix

This document explains the purpose of every folder inside `backend/app/`.

The backend is built with **Python 3.11+** and **FastAPI**. It follows a clean layered architecture that separates concerns clearly, making the codebase maintainable by a single developer over many sprints.

---

## Folder Map

```
backend/
├── app/
│   ├── api/
│   ├── core/
│   ├── database/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── ai/
│   │   ├── providers/
│   │   ├── embeddings/
│   │   ├── rag/
│   │   ├── memory/
│   │   └── indexing/
│   ├── automation/
│   ├── vision/
│   ├── plugins/
│   └── utils/
├── tests/
└── main.py
```

---

## Architecture Overview

The backend follows a **clean layered architecture**:

```
HTTP Request
     ↓
  [api/]           ← Route handlers (thin, no logic)
     ↓
  [services/]      ← Business logic
     ↓
  [repositories/]  ← Database access (SQLAlchemy queries)
     ↓
  [database/]      ← DB connection and session management
     ↓
  [models/]        ← ORM table definitions
```

For AI-specific flows, there is a parallel path:

```
[services/] → [ai/] → [providers/] → External LLM APIs or Ollama
                    → [embeddings/] → FAISS index
                    → [rag/]       → Retrieval pipeline
                    → [memory/]    → Persistent knowledge store
                    → [indexing/]  → File and content indexers
```

---

## Folder Explanations

### `api/`
**HTTP route handlers.**

Contains all FastAPI routers and endpoint definitions. This layer is intentionally thin — its only job is to receive requests, validate inputs (delegating to Pydantic schemas), call the appropriate service, and return a response.

```
api/
├── v1/
│   ├── search.py      # Search endpoints
│   ├── chat.py        # Chat/conversation endpoints
│   ├── files.py       # File indexing endpoints
│   ├── memory.py      # Knowledge/memory endpoints
│   ├── settings.py    # User settings endpoints
│   └── __init__.py
└── __init__.py
```

Rule: No database queries, no business logic, no LLM calls in this layer. Only request/response handling.

---

### `core/`
**Application configuration and startup logic.**

The foundational setup for the entire application. Contains settings management, environment variable loading, application initialization, middleware setup, and dependency injection containers.

```
core/
├── config.py       # Pydantic Settings class (reads from .env)
├── dependencies.py # FastAPI dependency injection functions
├── middleware.py   # CORS, logging, error-handling middleware
├── events.py       # App startup and shutdown lifecycle hooks
├── security.py     # Auth utilities (JWT, API key validation)
└── logging.py      # Logging configuration
```

Rule: Every other module in the application imports from `core/`. `core/` imports from nothing else in the app (only stdlib and third-party packages).

---

### `database/`
**Database connection and session management.**

Manages the SQLAlchemy engine, session factory, and database initialization. Also contains Alembic migration configuration.

```
database/
├── session.py      # Engine setup, SessionLocal factory
├── base.py         # Declarative base class for ORM models
├── init_db.py      # Script to create tables on first run
└── migrations/     # Alembic migration files
    ├── env.py
    ├── script.py.mako
    └── versions/
```

Rule: Database sessions are created here and injected into route handlers via FastAPI dependencies — never instantiated directly inside services or repositories.

---

### `models/`
**SQLAlchemy ORM models.**

Defines the database schema as Python classes. Each file typically corresponds to one domain entity.

```
models/
├── file.py         # IndexedFile, FileChunk models
├── conversation.py # Conversation, Message models
├── memory.py       # KnowledgeItem, Memory models
├── user.py         # UserSettings model
└── __init__.py     # Exports all models (for Alembic autodiscovery)
```

Rule: Models only define table structure. No business logic, no queries. All relationships are declared here using SQLAlchemy `relationship()`.

---

### `schemas/`
**Pydantic request and response schemas.**

Defines the shape of data flowing in and out of the API. Completely separate from ORM models to allow the database and API contract to evolve independently.

```
schemas/
├── file.py         # FileCreate, FileRead, FileUpdate
├── chat.py         # MessageCreate, ConversationRead
├── search.py       # SearchQuery, SearchResult
├── memory.py       # MemoryCreate, MemoryRead
└── common.py       # Pagination, ErrorResponse, etc.
```

Rule: Schema classes use Pydantic v2. `model_config = ConfigDict(from_attributes=True)` enables ORM-to-schema conversion.

---

### `services/`
**Business logic layer.**

The core of the application. Services orchestrate operations that involve multiple repositories, AI calls, or complex workflows. This is where the meaningful work happens.

```
services/
├── file_service.py      # File indexing orchestration
├── search_service.py    # Semantic + keyword search logic
├── chat_service.py      # Conversation management, LLM call orchestration
├── memory_service.py    # Knowledge storage and retrieval logic
└── settings_service.py  # User settings management
```

Rule: Services may call repositories and AI modules. They must NOT import from `api/` or access the database session directly (it's injected via dependency).

---

### `repositories/`
**Data access layer.**

Abstracts all raw database queries. Services call repository methods instead of writing raw SQLAlchemy queries inline. This makes testing easier (repositories can be mocked) and keeps query logic centralized.

```
repositories/
├── file_repository.py      # CRUD for file records
├── conversation_repository.py  # CRUD for conversations and messages
├── memory_repository.py    # CRUD for knowledge items
└── base_repository.py      # Generic CRUD base class
```

Rule: Repositories only interact with the database. No business logic, no LLM calls, no HTTP calls.

---

### `ai/`
**All AI-related functionality.**

This is the most complex subsystem in Omnix. It is structured into dedicated sub-modules, each with a single clear responsibility.

---

#### `ai/providers/`
**LLM provider adapters.**

Implements a unified interface over multiple AI backends. All LLM communication goes through a provider adapter, making it easy to swap models without changing the calling code.

```
providers/
├── base.py         # Abstract LLMProvider base class
├── openai.py       # OpenAI GPT-4o adapter
├── gemini.py       # Google Gemini adapter
├── claude.py       # Anthropic Claude adapter
├── ollama.py       # Ollama local model adapter
└── factory.py      # Provider factory (selects provider based on config)
```

---

#### `ai/embeddings/`
**Embedding generation and vector storage.**

Handles converting text (from files, messages, memories) into vector embeddings and storing/querying them in FAISS.

```
embeddings/
├── encoder.py      # Text-to-embedding using selected model
├── faiss_store.py  # FAISS index wrapper (add, search, persist, load)
├── chunker.py      # Text chunking strategies (fixed, semantic, sentence)
└── models.py       # Embedding model configuration and loading
```

---

#### `ai/rag/`
**Retrieval-Augmented Generation pipeline.**

The RAG pipeline retrieves relevant context from the vector store and injects it into LLM prompts. This is what gives Omnix its knowledge of your files and history.

```
rag/
├── retriever.py    # Query FAISS, rank and filter results
├── reranker.py     # Re-rank retrieved chunks (optional, cross-encoder)
├── generator.py    # Assemble prompt with context and generate response
├── pipeline.py     # End-to-end RAG orchestrator
└── prompts/        # Prompt templates
    ├── chat.txt
    └── search.txt
```

---

#### `ai/memory/`
**Persistent AI memory.**

Manages long-term memory for Omnix — storing facts, preferences, summaries, and user context across sessions.

```
memory/
├── store.py        # Memory read/write API
├── summarizer.py   # Summarize long conversations for storage
├── extractor.py    # Extract facts and entities from content
└── types.py        # Memory item types and schemas
```

---

#### `ai/indexing/`
**Content indexing pipelines.**

Handles reading files from disk, extracting text, chunking, embedding, and storing them in both SQLite and FAISS.

```
indexing/
├── pipeline.py         # Main indexing orchestrator
├── file_watcher.py     # Watch filesystem for changes
├── extractors/         # Content extractors per file type
│   ├── pdf.py
│   ├── docx.py
│   ├── code.py
│   ├── markdown.py
│   └── plaintext.py
└── scheduler.py        # Background indexing job scheduler
```

---

### `automation/`
**System automation actions.**

Enables Omnix to perform actions on the operating system in response to natural language commands. All actions must be clearly defined, auditable, and reversible where possible.

```
automation/
├── executor.py         # Parses intent and routes to action handlers
├── actions/            # Individual automation action implementations
│   ├── files.py        # File operations (move, copy, rename, delete)
│   ├── apps.py         # Application launching
│   ├── clipboard.py    # Clipboard read/write
│   └── shell.py        # Controlled shell command execution
└── safety.py           # Safety checks, confirmation requirements
```

---

### `vision/`
**Screen capture and visual understanding.**

Allows Omnix to "see" the screen, understand what applications are open, and extract information from the visual layer of the OS.

```
vision/
├── capture.py          # Screenshot and screen region capture
├── ocr.py              # Text extraction from screenshots (Tesseract/EasyOCR)
├── analyzer.py         # Analyze screen content using a vision LLM
└── context.py          # Build "current screen context" summary
```

---

### `plugins/`
**Plugin loader and plugin interfaces.**

Provides the extension system for Omnix. Developers can write plugins that add new commands, indexers, providers, or UI panels.

```
plugins/
├── base.py             # Plugin abstract base class and interface
├── loader.py           # Discovers and loads plugins from disk
├── registry.py         # Plugin registry (maps names to instances)
└── builtin/            # First-party built-in plugins
    ├── calculator.py
    └── notes.py
```

---

### `utils/`
**Shared backend utility functions.**

Pure helper functions and utilities shared across the backend.

```
utils/
├── file_utils.py       # File path helpers, MIME type detection
├── text_utils.py       # Text cleaning, normalization
├── hashing.py          # Content hashing (for deduplication)
├── timing.py           # Performance profiling decorators
└── validators.py       # Custom validation helpers
```

---

### `tests/`
**Automated test suite.**

All backend tests. Mirrors the `app/` structure.

```
tests/
├── conftest.py         # Shared fixtures, test DB setup
├── api/                # Tests for API route handlers
├── services/           # Tests for business logic
├── repositories/       # Tests for DB queries (against test DB)
└── ai/                 # Tests for AI modules (mocked LLM calls)
```

---

### `main.py`
**FastAPI application entry point.**

Creates the FastAPI app instance, registers all routers, configures middleware, and starts the Uvicorn server. Should be short and declarative.
