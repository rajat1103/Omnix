# Roadmap — Omnix

> **Status as of Sprint 0 — Project Initialization**

This document defines the full sprint-by-sprint delivery plan for Omnix. Each sprint represents a focused, self-contained unit of work with clear deliverables, dependencies, and expected outcomes.

---

## Sprint Overview

| Sprint | Focus | Status |
|---|---|---|
| Sprint 0 | Project Initialization | ✅ Complete |
| Sprint 1 | Desktop Foundation | 🔜 Planned |
| Sprint 2 | Backend Foundation | 🔜 Planned |
| Sprint 3 | File Intelligence | 🔜 Planned |
| Sprint 4 | Semantic Search | 🔜 Planned |
| Sprint 5 | Knowledge Engine | 🔜 Planned |
| Sprint 6 | RAG Pipeline | 🔜 Planned |
| Sprint 7 | AI Chat | 🔜 Planned |
| Sprint 8 | Screen Intelligence | 🔜 Planned |
| Sprint 9 | Developer Assistant | 🔜 Planned |
| Sprint 10 | System Automation | 🔜 Planned |
| Sprint 11 | Workflow Memory | 🔜 Planned |
| Sprint 12 | Voice Assistant | 🔜 Planned |

---

## Sprint 0 — Project Initialization ✅

**Goal:** Establish the professional foundation that all future development will build on.

**Deliverables:**
- Repository structure scaffolded
- All documentation files created and structured
- `.github/` folder with issue and PR templates
- `.editorconfig` and `.env.example`
- Comprehensive `README.md`
- Git workflow defined
- Coding standards defined

**Dependencies:** None

**Expected Outcome:** A developer can clone the repository and immediately understand the project, its architecture, its conventions, and where to start.

---

## Sprint 1 — Desktop Foundation

**Goal:** Build the native desktop shell and the foundational React UI architecture.

**Deliverables:**
- Tauri application configured and building on Windows + macOS
- React + TypeScript + Tailwind CSS frontend initialized
- Design system implemented: color tokens, typography, spacing
- Application shell: sidebar, main content area, title bar
- Command palette scaffold (`Cmd+K`)
- Light and dark mode toggle
- Settings page skeleton
- Frontend routing setup

**Dependencies:** None (can start in parallel with Sprint 0)

**Expected Outcome:** A developer can launch the Tauri app and see a clean, polished empty shell — the correct visual foundation for all future features.

---

## Sprint 2 — Backend Foundation

**Goal:** Build the core FastAPI backend with database setup, API skeleton, and configuration system.

**Deliverables:**
- FastAPI application with all routers registered
- SQLite database + SQLAlchemy ORM setup
- Alembic migrations for all core tables (see `Database_Design.md`)
- Settings management (Pydantic Settings + `.env`)
- API key storage via OS keychain
- Health check and version endpoints
- CORS configuration for Tauri frontend
- Basic logging setup
- `requirements.txt` and `pyproject.toml` configured
- GitHub Actions CI: run tests + lint on every push

**Dependencies:** Sprint 0

**Expected Outcome:** A running local API server with database initialized, all tables created, and basic CRUD endpoints working. The frontend can communicate with the backend.

---

## Sprint 3 — File Intelligence

**Goal:** Index files on the user's filesystem and make their content searchable.

**Deliverables:**
- File indexing pipeline: extract text from PDF, DOCX, MD, TXT, and code files
- Background file watcher (detect new and modified files)
- Indexing status API and UI progress indicator
- SQLite records for all indexed files and chunks
- User configurable: which paths to index, which to exclude
- Deduplication via content hashing
- File browser UI: view all indexed files, remove individual files

**Dependencies:** Sprint 2

**Expected Outcome:** A user can point Omnix at their Documents folder and Omnix will index all files in the background. They can see a list of indexed files in the UI.

---

## Sprint 4 — Semantic Search

**Goal:** Enable natural language search across all indexed content.

**Deliverables:**
- FAISS vector index for all file chunks
- Embedding generation pipeline (Ollama `nomic-embed-text` default)
- Hybrid search: semantic (FAISS) + keyword (SQLite FTS5)
- Reciprocal Rank Fusion result merging
- Search results UI: ranked list with file name, excerpt, relevance
- Click-to-open source file from search results
- Search response time < 500ms for 100k chunks

**Dependencies:** Sprint 3

**Expected Outcome:** A user can type "find my notes about the Q3 project kickoff" and see the correct files ranked at the top — without the exact words being in the query.

---

## Sprint 5 — Knowledge Engine

**Goal:** Build persistent memory that survives across sessions and grows over time.

**Deliverables:**
- Memory extraction: auto-extract facts from conversations and files
- Memory storage: SQLite + FAISS embeddings for memory items
- Memory browser UI: view, search, edit, delete memory items
- Manual memory entry: users can add memory items directly
- Memory injection into AI context (preparation for Sprint 6)
- Knowledge graph skeleton (entity + relationship storage)

**Dependencies:** Sprint 3, Sprint 4

**Expected Outcome:** Omnix remembers that the user told it they work on a Python project called Beacon. Next session, it refers to this without being told again.

---

## Sprint 6 — RAG Pipeline

**Goal:** Connect the knowledge base to the AI, enabling grounded, accurate responses.

**Deliverables:**
- Full RAG pipeline (see `RAG_Architecture.md`)
- Dual retrieval: FAISS semantic + SQLite FTS5 keyword
- Context assembly with token budget management
- Source citation in every response
- Prompt template system
- Configurable RAG parameters (top-k, threshold)
- RAG quality metrics logging

**Dependencies:** Sprint 4, Sprint 5

**Expected Outcome:** Ask Omnix "What was in the contract from last April?" and it retrieves the correct file, quotes the relevant section, and cites the source.

---

## Sprint 7 — AI Chat

**Goal:** Build the full conversational AI interface, powered by the RAG pipeline.

**Deliverables:**
- Conversation management (create, view, delete, search)
- Multi-turn conversation with context window management
- Streaming responses (token-by-token display)
- AI provider switcher in the UI (OpenAI / Gemini / Claude / Ollama)
- Token usage and cost display per message
- Conversation persistence across restarts
- Conversation search

**Dependencies:** Sprint 6

**Expected Outcome:** A user can have a multi-turn conversation with Omnix that is grounded in their local files, remembers past context, and streams responses in real time.

---

## Sprint 8 — Screen Intelligence

**Goal:** Allow Omnix to understand what is currently on the user's screen.

**Deliverables:**
- Screen capture API (Tauri OS permission)
- OCR text extraction from screenshots
- Vision LLM integration for screen understanding
- "What am I looking at?" command
- Screen context injection into AI chat
- Privacy controls: screen capture is always opt-in, session-scoped

**Dependencies:** Sprint 7

**Expected Outcome:** A user can press a hotkey and ask "explain what's happening in this error" — Omnix captures the screen, reads the error, and provides a relevant explanation.

---

## Sprint 9 — Developer Assistant

**Goal:** Add code-aware capabilities for developers using Omnix on their projects.

**Deliverables:**
- Code file indexing with AST structure awareness
- Code search: search by function name, class, variable
- Project context: understand the current working project
- "Explain this code" command with file context
- Diff and git log awareness

**Dependencies:** Sprint 7

**Expected Outcome:** A developer can ask "how does the authentication flow work in this project?" and Omnix traces through the relevant code files and gives an accurate walkthrough.

---

## Sprint 10 — System Automation

**Goal:** Enable Omnix to perform OS-level actions in response to natural language.

**Deliverables:**
- File operations: move, copy, rename, bulk rename
- Application launching
- Clipboard operations
- Automation confirmation UI (explicit user approval required)
- Audit log UI: view all past automation actions
- Undo support for reversible operations
- Safety allowlist: hard-blocked dangerous operations

**Dependencies:** Sprint 7

**Expected Outcome:** A user can say "rename all the screenshots on my Desktop from this week to include today's date" and Omnix presents a preview of the changes, asks for confirmation, then executes.

---

## Sprint 11 — Workflow Memory

**Goal:** Allow Omnix to learn and replay repeated user workflows.

**Deliverables:**
- Workflow recording: detect and record multi-step action sequences
- Workflow library: browse, name, and manage saved workflows
- Workflow replay with natural language trigger
- Workflow sharing (export/import as JSON)

**Dependencies:** Sprint 10

**Expected Outcome:** A user can say "every morning I open Slack, check my email, and review my tasks — remember this as Morning Routine" and trigger it with "start my morning routine."

---

## Sprint 12 — Voice Assistant

**Goal:** Add voice-driven interaction as a primary interface layer.

**Deliverables:**
- Wake word detection (offline, local)
- Speech-to-text (local via Whisper)
- Text-to-speech for AI responses (system TTS or local model)
- Voice UI: indicator when listening, transcription display
- Voice-triggered command palette
- Privacy controls: voice processing is always local, opt-in

**Dependencies:** Sprint 7

**Expected Outcome:** A user can say "Hey Omnix, where is the invoice from last month?" without touching the keyboard and hear the answer spoken back.

---

## Post-v1.0 Backlog

> Ideas for after the core product is complete.

- Mobile companion app (view and search from phone)
- Plugin marketplace
- Multi-user / team workspace support
- Integration with external services (Notion, Linear, GitHub)
- Fine-tuned local model for Omnix-specific tasks
