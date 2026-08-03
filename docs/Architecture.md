# Architecture — Omnix

---

## Document Purpose

This document describes the **high-level technical architecture** of Omnix. It defines the major system components, how they communicate, and the principles that guide architectural decisions. It is a living document — updated as the architecture evolves across sprints.

---

## Architectural Style

Omnix follows a **layered, modular monolith** architecture for the backend, combined with a **feature-sliced** frontend architecture. This is intentionally chosen over microservices because:

- The project is built and maintained by a single developer
- A monolith is significantly simpler to develop, debug, and deploy
- The clean internal layering still allows splitting into services later if needed

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        DESKTOP SHELL (Tauri)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  React Frontend (TypeScript)               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │  Search  │  │   Chat   │  │  Files   │  │ Settings │  │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │  │
│  └───────┼─────────────┼─────────────┼─────────────┼─────────┘  │
│          │   HTTP / Tauri IPC         │             │            │
└──────────┼─────────────┼─────────────┼─────────────┼────────────┘
           │             │             │             │
┌──────────▼─────────────▼─────────────▼─────────────▼────────────┐
│                    FastAPI Backend (Python)                       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                       API Layer                           │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                         │                                        │
│  ┌──────────────────────▼───────────────────────────────────┐   │
│  │                    Services Layer                         │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                         │                                        │
│  ┌──────────────────────▼───────────────────────────────────┐   │
│  │                  Repositories Layer                       │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                         │                                        │
│  ┌──────────────────────▼───────────────────────────────────┐   │
│  │         SQLite (structured data) + FAISS (vectors)        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      AI Subsystem                        │    │
│  │  providers/  embeddings/  rag/  memory/  indexing/       │    │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
                         │
           ┌─────────────┴─────────────┐
           ▼                           ▼
   Cloud AI Providers           Local AI (Ollama)
   (OpenAI / Gemini / Claude)   (Llama / Qwen / Mistral)
```

---

## Component Descriptions

### Tauri Shell
The native desktop application shell. Written in Rust, it provides:
- OS-level window management and system tray integration
- Secure IPC bridge between the React frontend and native OS APIs
- File system access permissions management
- Application packaging and auto-update support

Tauri is preferred over Electron because it produces smaller binaries, uses less memory, and has a smaller attack surface.

### React Frontend
A TypeScript React application running inside the Tauri shell. Communicates with the backend via HTTP REST calls to the local FastAPI server. Uses Tauri IPC for OS-specific actions (file dialogs, notifications, etc.).

Architecture style: **Feature-Sliced Design (FSD)** — features are self-contained vertical slices.

### FastAPI Backend
The core application server. Runs as a local process alongside the desktop app. Exposes a versioned REST API (`/api/v1/`). Responsible for:
- Request routing and validation
- Business logic orchestration
- AI pipeline coordination
- Background job scheduling (indexing, watching)

### SQLite Database
The local relational store for structured data:
- File metadata and indexing records
- Conversation history
- Memory/knowledge items
- User settings and preferences
- Plugin configurations

Managed via **SQLAlchemy** ORM and **Alembic** migrations.

### FAISS Vector Store
The local vector database for semantic search:
- Stores embeddings for all indexed content chunks
- Enables sub-second similarity search
- Persisted to disk as binary index files
- Managed entirely through the `ai/embeddings/` module

### AI Subsystem
See [AI_Architecture.md](AI_Architecture.md) for full details. Summary:
- **Providers** — Unified adapter layer over all LLMs
- **Embeddings** — Text-to-vector conversion and FAISS management
- **RAG** — Context retrieval and augmented generation pipeline
- **Memory** — Long-term knowledge storage and recall
- **Indexing** — File watching, extraction, chunking, and embedding pipelines

---

## Key Architectural Decisions

### ADR-001: FastAPI over Django
**Decision:** FastAPI  
**Rationale:** FastAPI is async-first, significantly faster, has automatic OpenAPI documentation, and pairs naturally with Pydantic for data validation. Django's ORM and admin are unnecessary overhead for this use case.

### ADR-002: SQLite over PostgreSQL
**Decision:** SQLite  
**Rationale:** Omnix is a local desktop application. A serverless, file-based database is ideal — no installation, no service management, and it performs excellently for single-user workloads up to millions of records.

### ADR-003: FAISS over Chroma/Qdrant/Weaviate
**Decision:** FAISS  
**Rationale:** FAISS is a battle-tested, high-performance library from Meta. It runs entirely in-process with no server required, which aligns with the local-first philosophy. For the expected data volumes (< 1M chunks), FAISS is more than sufficient.

### ADR-004: Tauri over Electron
**Decision:** Tauri  
**Rationale:** Tauri produces native binaries with 10-20x smaller bundle sizes, significantly lower memory usage, and better security through its permission model. The trade-off is requiring Rust for the shell layer, which is manageable for the current scope.

### ADR-005: Monolith over Microservices
**Decision:** Monolith  
**Rationale:** A single developer building a local desktop tool has no need for the operational complexity of microservices. The clean internal layering (api → services → repositories) provides the same architectural benefits without the overhead.

---

## Data Flow: Semantic Search

```
User types query
       │
       ▼
Frontend SearchBar
       │  HTTP POST /api/v1/search
       ▼
api/v1/search.py (route handler)
       │
       ▼
services/search_service.py
       │
       ├─► ai/embeddings/encoder.py  ← encode query to vector
       │
       ├─► ai/embeddings/faiss_store.py  ← search FAISS for top-k chunks
       │
       ├─► repositories/file_repository.py  ← fetch file metadata for results
       │
       └─► return SearchResult[]
       │
       ▼
Frontend displays ranked results with excerpts
```

---

## Data Flow: AI Chat with RAG

```
User sends message
       │
       ▼
api/v1/chat.py
       │
       ▼
services/chat_service.py
       │
       ├─► ai/rag/retriever.py  ← retrieve relevant chunks from FAISS
       │
       ├─► ai/memory/store.py   ← inject persistent memory context
       │
       ├─► ai/rag/generator.py  ← assemble prompt + context
       │
       ├─► ai/providers/factory.py  ← call active LLM provider
       │
       ├─► repositories/conversation_repository.py  ← persist message + response
       │
       └─► return AssistantMessage
       │
       ▼
Frontend streams or displays response
```

---

## Scalability Considerations

Omnix is designed for a single user on a single machine. However, these design choices ensure it scales gracefully:

- **FAISS indexes** can handle millions of vectors on consumer hardware
- **SQLite** handles millions of rows comfortably in single-user workloads
- **Background indexing** runs in a separate thread/process to avoid blocking the UI
- **Chunking strategies** can be tuned to balance index size vs. retrieval quality
- **Plugin architecture** allows extending capabilities without modifying core code

---

## Sections To Be Filled In

The following sections will be added as sprints are completed:

- **Sprint 1**: Frontend component architecture diagram
- **Sprint 2**: Full API endpoint inventory
- **Sprint 3**: File extraction pipeline details
- **Sprint 8**: Screen vision pipeline architecture
- **Sprint 10**: Automation safety architecture
