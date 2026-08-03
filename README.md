# Omnix

> **Your Computer. One Intelligent Mind.**

Omnix is a **Local-First AI Operating Layer** — a persistent, intelligent layer between you and your operating system that helps you understand, search, remember, and interact with everything on your computer using natural language.

Unlike cloud AI tools that start fresh every conversation, Omnix builds a continuously updated semantic understanding of your digital workspace — your files, projects, code, and history — and gives you a single, calm interface to access all of it. Privately. Locally.

**Core Philosophy:** `Understand → Remember → Reason → Act`

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Documentation](#documentation)
- [Development Workflow](#development-workflow)
- [Getting Started](#getting-started)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## Overview

Omnix sits between the user and their OS. It indexes your files, understands their content semantically, remembers context across sessions, and gives you a conversational interface to access it all.

**Key principles:**

| Principle | What it means |
|---|---|
| **Local-first** | Your data stays on your machine. Cloud AI is opt-in. |
| **Persistent memory** | Omnix remembers across sessions. It learns your context over time. |
| **Multi-model** | Works with cloud AI (OpenAI, Gemini, Claude) and local models (Ollama). |
| **Privacy-conscious** | You control exactly what is indexed and what is shared. |
| **Extensible** | Plugin architecture for adding new capabilities without modifying core code. |

---

## Features

> Features are delivered sprint-by-sprint. See [docs/Roadmap.md](docs/Roadmap.md) for the full delivery plan.

| Feature | Description | Sprint |
|---|---|---|
| 🖥️ Desktop Shell | Native Tauri app — fast, minimal, keyboard-driven | 1 |
| ⚙️ Backend API | FastAPI local server, SQLite, Alembic migrations | 2 |
| 📂 File Intelligence | Index and understand files on disk (PDF, DOCX, MD, code) | 3 |
| 🔍 Semantic Search | FAISS-powered natural language search across all content | 4 |
| 🧠 Knowledge Engine | Persistent memory and knowledge graph | 5 |
| 🔗 RAG Pipeline | Retrieval-Augmented Generation grounded in your local data | 6 |
| 💬 AI Chat | Context-aware, multi-turn conversation with source citations | 7 |
| 👁️ Screen Intelligence | Understand and query what's on your screen | 8 |
| 👨‍💻 Developer Assistant | Code-aware search, project understanding, AST indexing | 9 |
| 🤖 System Automation | Natural language OS actions with confirmation and audit trail | 10 |
| 🔄 Workflow Memory | Record, save, and replay repeated workflows | 11 |
| 🎙️ Voice Assistant | Voice-driven interface — wake word, STT, TTS, all local | 12 |

---

## Technology Stack

### Frontend

| Technology | Role |
|---|---|
| [React](https://react.dev/) | UI component framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling system |
| [Tauri](https://tauri.app/) | Native desktop shell (Rust-based, replaces Electron) |

### Backend

| Technology | Role |
|---|---|
| [Python 3.11+](https://python.org/) | Core backend language |
| [FastAPI](https://fastapi.tiangolo.com/) | Async REST API framework |
| [SQLAlchemy](https://sqlalchemy.org/) | ORM for SQLite |
| [Alembic](https://alembic.sqlalchemy.org/) | Database migrations |
| [FAISS](https://github.com/facebookresearch/faiss) | Local vector similarity search |

### AI Providers

| Type | Options |
|---|---|
| ☁️ Cloud | OpenAI (GPT-4o), Google Gemini, Anthropic Claude |
| 🏠 Local | Ollama · Llama · Qwen · Mistral |

---

## Repository Structure

```
Omnix/
│
├── .github/
│   ├── ISSUE_TEMPLATE/          # Bug, feature, docs, and chore templates
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   ├── documentation.md
│   │   └── chore.md
│   ├── workflows/
│   │   └── ci.yml               # CI: lint, type-check, test on every PR
│   └── PULL_REQUEST_TEMPLATE.md
│
├── frontend/                    # React + TypeScript + Tailwind + Tauri
│   ├── src/
│   │   ├── components/          # Reusable UI primitives
│   │   ├── pages/               # Route-level page components
│   │   ├── layouts/             # Application layout wrappers
│   │   ├── features/            # Self-contained feature modules (FSD)
│   │   ├── hooks/               # Shared custom React hooks
│   │   ├── services/            # API client functions
│   │   ├── store/               # Global state management
│   │   ├── assets/              # Icons, fonts, images
│   │   ├── styles/              # Global CSS, design tokens
│   │   ├── types/               # Shared TypeScript types
│   │   └── utils/               # Pure utility functions
│   └── STRUCTURE.md             # Detailed frontend folder guide
│
├── backend/                     # Python FastAPI backend
│   ├── app/
│   │   ├── api/v1/              # HTTP route handlers (thin layer)
│   │   ├── core/                # Config, settings, startup, middleware
│   │   ├── database/            # SQLAlchemy engine, sessions, migrations
│   │   ├── models/              # ORM table definitions
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── services/            # Business logic layer
│   │   ├── repositories/        # Data access layer (DB queries)
│   │   ├── ai/
│   │   │   ├── providers/       # LLM provider adapters (OpenAI, Ollama, etc.)
│   │   │   ├── embeddings/      # Text embedding + FAISS index management
│   │   │   ├── rag/             # Retrieval-Augmented Generation pipeline
│   │   │   ├── memory/          # Persistent knowledge and memory
│   │   │   └── indexing/        # File watching, extraction, chunking
│   │   ├── automation/          # OS automation actions
│   │   ├── vision/              # Screen capture and understanding
│   │   ├── plugins/             # Plugin loader and interfaces
│   │   └── utils/               # Shared backend utilities
│   ├── tests/                   # pytest test suite
│   └── STRUCTURE.md             # Detailed backend folder guide
│
├── docs/                        # Project documentation (see below)
│
├── .editorconfig                # Universal editor formatting rules
├── .env.example                 # Environment variable template
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── SECURITY.md
```

---

## Documentation

All documentation lives in [`docs/`](docs/). Start here:

| Document | Purpose |
|---|---|
| [Project_Vision.md](docs/Project_Vision.md) | Why Omnix exists, who it's for, what success looks like |
| [Architecture.md](docs/Architecture.md) | System design, component diagram, architectural decisions |
| [Software_Requirements.md](docs/Software_Requirements.md) | Formal functional and non-functional requirements |
| [UI_Guidelines.md](docs/UI_Guidelines.md) | Design language, color system, typography, motion rules |
| [Database_Design.md](docs/Database_Design.md) | Schema, table definitions, migration strategy |
| [AI_Architecture.md](docs/AI_Architecture.md) | AI subsystem: providers, embeddings, indexing, memory |
| [RAG_Architecture.md](docs/RAG_Architecture.md) | RAG pipeline: retrieval, context assembly, generation |
| [API_Design.md](docs/API_Design.md) | API conventions, response envelopes, endpoint inventory |
| [Security.md](docs/Security.md) | Threat model, safety architecture, API key handling |
| [Privacy.md](docs/Privacy.md) | Data inventory, user controls, cloud AI policy |
| [Development_Guide.md](docs/Development_Guide.md) | Setup, coding standards, naming conventions, commands |
| [Testing_Guide.md](docs/Testing_Guide.md) | Test strategy, frameworks, coverage requirements |
| [Deployment_Guide.md](docs/Deployment_Guide.md) | Build process, packaging, release checklist |
| [Roadmap.md](docs/Roadmap.md) | Sprint-by-sprint delivery plan |
| [Changelog.md](docs/Changelog.md) | Version history |

---

## Development Workflow

### Branch Strategy

```
main          →  Production-ready tagged releases only
  └─ develop  →  Integration branch — all features merge here first
       ├─ feature/<name>   →  New feature work
       ├─ fix/<name>       →  Bug fixes
       └─ chore/<name>     →  Maintenance, tooling, deps
```

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

| Type | When |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change with no behavior change |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `chore` | Tooling, CI, dependencies |
| `perf` | Performance improvement |

**Examples:**
```
feat(search): add FAISS vector index for file chunks
fix(api): handle empty query string gracefully
docs(architecture): add RAG data flow diagram
chore(deps): upgrade FastAPI to 0.115.0
```

---

## Getting Started

> Full setup instructions will be finalized in Sprint 2. Preliminary steps:

**Prerequisites:**
- Node.js 20+ and pnpm 8+
- Python 3.11+
- Rust (stable, for Tauri)
- [Ollama](https://ollama.ai/) (optional — for local AI)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/omnix.git
cd omnix

# 2. Configure environment
cp .env.example backend/.env
# Edit backend/.env with your values

# 3. Backend
cd backend
python -m venv .venv
.venv\Scripts\activate     # Windows
pip install -r requirements.txt
alembic upgrade head
python main.py

# 4. Frontend (new terminal)
cd frontend
pnpm install
pnpm tauri dev
```

---

## Roadmap

| Sprint | Focus | Status |
|---|---|---|
| Sprint 0 | Project Initialization | ✅ Complete |
| Sprint 1 | Desktop Foundation | 🔜 Next |
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

See [docs/Roadmap.md](docs/Roadmap.md) for full sprint details.

---

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR. The short version:

1. Open an issue before starting work
2. Branch off `develop`
3. Follow the [coding standards](docs/Development_Guide.md)
4. Write tests — all new functionality must be tested
5. Open a PR against `develop` with the PR template filled out

---

## Security

For security vulnerabilities, do **not** open a public issue. See [SECURITY.md](SECURITY.md) for responsible disclosure instructions.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <sub>Built with intention. Runs locally. Owned by you.</sub>
</p>
