# Software Requirements — Omnix

---

## Document Purpose

This document defines the **formal functional and non-functional requirements** for Omnix. It bridges the high-level vision in `Project_Vision.md` and the technical design in `Architecture.md`. Requirements here are the source of truth for what the system must do.

Requirements are organized by sprint area and labeled with a unique ID (`REQ-XXX`) for traceability.

---

## Requirement Status Legend

| Status | Meaning |
|---|---|
| `PLANNED` | Requirement identified, not yet implemented |
| `IN PROGRESS` | Implementation started |
| `COMPLETE` | Implemented and tested |
| `DEFERRED` | Postponed to a future sprint |

---

## 1. Functional Requirements

### 1.1 File Intelligence (Sprint 3)

| ID | Requirement | Status |
|---|---|---|
| REQ-101 | The system shall index files in user-specified directories | PLANNED |
| REQ-102 | The system shall extract text from PDF, DOCX, TXT, MD, and code files | PLANNED |
| REQ-103 | The system shall detect and re-index files when they change on disk | PLANNED |
| REQ-104 | The system shall store file metadata (path, size, modified date, MIME type) in SQLite | PLANNED |
| REQ-105 | The system shall allow users to exclude specific directories from indexing | PLANNED |
| REQ-106 | The system shall provide indexing status and progress feedback | PLANNED |

### 1.2 Semantic Search (Sprint 4)

| ID | Requirement | Status |
|---|---|---|
| REQ-201 | The system shall generate vector embeddings for all indexed content | PLANNED |
| REQ-202 | The system shall store embeddings in a FAISS index on disk | PLANNED |
| REQ-203 | The system shall return semantically relevant results for natural language queries | PLANNED |
| REQ-204 | Search results shall include the source file path and a relevant excerpt | PLANNED |
| REQ-205 | The system shall support hybrid search (semantic + keyword) | PLANNED |
| REQ-206 | Search latency shall be under 500ms for indexes up to 100,000 chunks | PLANNED |

### 1.3 Knowledge Engine (Sprint 5)

| ID | Requirement | Status |
|---|---|---|
| REQ-301 | The system shall extract and store facts, entities, and relationships from content | PLANNED |
| REQ-302 | The system shall maintain a memory of past AI interactions | PLANNED |
| REQ-303 | The system shall summarize long conversations for persistent memory | PLANNED |
| REQ-304 | Users shall be able to view, edit, and delete memory items | PLANNED |

### 1.4 RAG Pipeline (Sprint 6)

| ID | Requirement | Status |
|---|---|---|
| REQ-401 | The system shall retrieve relevant document chunks for any user query | PLANNED |
| REQ-402 | Retrieved context shall be injected into LLM prompts | PLANNED |
| REQ-403 | The system shall cite the source documents used in each response | PLANNED |
| REQ-404 | The system shall support configurable retrieval parameters (top-k, threshold) | PLANNED |

### 1.5 AI Chat (Sprint 7)

| ID | Requirement | Status |
|---|---|---|
| REQ-501 | The system shall support multi-turn conversations with session history | PLANNED |
| REQ-502 | The system shall maintain conversation context across application restarts | PLANNED |
| REQ-503 | The system shall support switching AI providers mid-session | PLANNED |
| REQ-504 | The system shall display token usage and estimated cost per response | PLANNED |

### 1.6 System Automation (Sprint 10)

| ID | Requirement | Status |
|---|---|---|
| REQ-601 | The system shall execute file operations (move, copy, rename, delete) via natural language | PLANNED |
| REQ-602 | All destructive operations shall require explicit user confirmation | PLANNED |
| REQ-603 | All executed automations shall be logged in an audit trail | PLANNED |
| REQ-604 | The system shall support undo for reversible operations | PLANNED |

---

## 2. Non-Functional Requirements

### 2.1 Performance

| ID | Requirement |
|---|---|
| NFR-001 | Application startup time shall be under 3 seconds on a standard laptop |
| NFR-002 | Search results shall appear within 500ms for indexes up to 100k chunks |
| NFR-003 | The UI shall maintain 60fps during all standard interactions |
| NFR-004 | Background indexing shall not consume more than 25% CPU on a single core |
| NFR-005 | Memory usage shall not exceed 500MB during normal operation (excluding AI models) |

### 2.2 Privacy & Security

| ID | Requirement |
|---|---|
| NFR-101 | All user data shall be stored locally by default |
| NFR-102 | No data shall be sent to cloud providers without explicit user configuration |
| NFR-103 | API keys shall be stored encrypted at rest |
| NFR-104 | Users shall have a one-click option to delete all indexed data |
| NFR-105 | The application shall run fully offline when configured with a local AI model |

### 2.3 Reliability

| ID | Requirement |
|---|---|
| NFR-201 | The indexing pipeline shall recover gracefully from file read errors |
| NFR-202 | The application shall not crash on malformed AI provider responses |
| NFR-203 | Database migrations shall be non-destructive and reversible |

### 2.4 Usability

| ID | Requirement |
|---|---|
| NFR-301 | New users shall be able to perform a semantic search within 5 minutes of installation |
| NFR-302 | All primary actions shall be keyboard-accessible |
| NFR-303 | The application shall support light and dark modes |

### 2.5 Extensibility

| ID | Requirement |
|---|---|
| NFR-401 | The plugin system shall support third-party plugins without modifying core code |
| NFR-402 | Adding a new AI provider shall require only implementing a defined interface |
| NFR-403 | The API shall be versioned to allow non-breaking evolution |

---

## 3. Constraints

- The application must function on **Windows 11** and **macOS 14+**
- The desktop shell must use **Tauri** (not Electron) for performance and security
- The backend must be written in **Python 3.11+**
- The frontend must be written in **TypeScript** with **React**
- The primary local database must be **SQLite** (no external DB server)
- The vector store must be **FAISS** (no external vector DB server)

---

## 4. Assumptions

- The user has at least 8GB RAM for running local AI models
- The user has at least 2GB of available disk space for the FAISS indexes
- The user's OS filesystem is accessible by the application process
- Cloud AI provider API keys are user-supplied (not bundled with the application)
