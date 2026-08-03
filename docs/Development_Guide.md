# Development Guide — Omnix

---

## Document Purpose

This is the **primary reference document for anyone developing Omnix**. It covers the development environment setup, coding standards, folder structure conventions, import rules, and day-to-day workflow.

Read this before writing any code.

---

## Development Environment Requirements

| Tool | Version | Purpose |
|---|---|---|
| Python | 3.11+ | Backend runtime |
| Node.js | 20+ (LTS) | Frontend build toolchain |
| pnpm | 8+ | Frontend package manager |
| Rust | stable | Tauri shell compilation |
| Ollama | Latest | Local AI model server |
| Git | 2.40+ | Version control |

---

## Setting Up Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-org/omnix.git
cd omnix
```

### 2. Set up environment variables

```bash
cp .env.example backend/.env
# Edit backend/.env with your values
```

### 3. Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head              # Initialize database
python main.py                    # Start API server
```

### 4. Frontend setup

```bash
cd frontend
pnpm install
pnpm tauri dev                    # Starts Vite + Tauri dev mode
```

---

## Coding Standards

### Python

- **Formatter**: `ruff format` (replaces Black)
- **Linter**: `ruff check`
- **Type checker**: `mypy --strict`
- **Docstrings**: Google style for all public functions, classes, and methods
- **Line length**: 88 characters
- **Imports**: grouped as stdlib → third-party → local; sorted by `ruff`

```python
# Good
def get_file_chunks(file_id: str, db: Session) -> list[FileChunk]:
    """Retrieve all text chunks for a given indexed file.

    Args:
        file_id: UUID of the file record.
        db: SQLAlchemy database session.

    Returns:
        List of FileChunk records ordered by chunk_index.

    Raises:
        FileNotFoundError: If no file with the given ID exists.
    """
    ...
```

### TypeScript / React

- **Formatter**: Prettier (via `.prettierrc`)
- **Linter**: ESLint with TypeScript and React rules
- **Naming**:
  - Components: `PascalCase` (`SearchBar.tsx`)
  - Hooks: `camelCase` with `use` prefix (`useDebounce.ts`)
  - Types/Interfaces: `PascalCase` (`FileRecord`, `SearchResult`)
  - Constants: `UPPER_SNAKE_CASE`
  - All other: `camelCase`
- **Props**: Always define a `Props` interface for every component
- **JSDoc**: Required on all public-facing hooks, service functions, and utility functions

```tsx
// Good
interface SearchBarProps {
  /** Initial query value */
  defaultQuery?: string;
  /** Callback fired when the user submits a search */
  onSearch: (query: string) => void;
}

export function SearchBar({ defaultQuery = '', onSearch }: SearchBarProps) {
  ...
}
```

---

## File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Python modules | `snake_case.py` | `file_service.py`, `faiss_store.py` |
| React components | `PascalCase.tsx` | `SearchBar.tsx`, `FileCard.tsx` |
| React hooks | `useCamelCase.ts` | `useDebounce.ts`, `useTheme.ts` |
| TypeScript types | `snake_case.ts` or `PascalCase.ts` | `models.ts`, `SearchResult.ts` |
| Test files | `{name}.test.{ext}` | `file_service.test.py`, `SearchBar.test.tsx` |
| Story files | `{name}.stories.tsx` | `SearchBar.stories.tsx` |

---

## Folder Naming Conventions

- All folder names: `lowercase` or `camelCase` for frontend features
- No abbreviations (use `repositories` not `repos`, `services` not `svc`)
- Feature folders in `frontend/src/features/`: `camelCase` (`fileIntelligence`, `aiChat`)

---

## Import Conventions

### Python

```python
# Order: stdlib → third-party → local app
import os
import uuid
from datetime import datetime

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.file import IndexedFile
from app.schemas.file import FileRead
```

### TypeScript

```typescript
// Order: React → third-party → local absolute → local relative
import { useState, useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { SearchResult } from '@/types/models';
import { searchService } from '@/services/search.service';

import { SearchResultCard } from './SearchResultCard';
```

Use `@/` path alias for all imports from `src/`. Avoid deep relative imports (`../../../`).

---

## Git Commit Standards

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

| Type | When to Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that isn't a fix or feature |
| `test` | Adding or fixing tests |
| `docs` | Documentation changes only |
| `chore` | Tooling, dependency updates, CI |
| `perf` | Performance improvement |
| `style` | Formatting only (no logic change) |

**Rules:**
- Subject line ≤ 72 characters
- Subject in imperative mood: "add file watcher" not "added file watcher"
- Reference issue numbers in the footer: `Closes #42`

---

## Branch Naming

```
feature/<short-description>     # New feature work
fix/<short-description>         # Bug fix
chore/<short-description>       # Maintenance
docs/<short-description>        # Documentation update
refactor/<short-description>    # Refactoring
```

Examples:
```
feature/faiss-semantic-search
fix/file-watcher-encoding-error
chore/upgrade-fastapi-0111
docs/update-rag-architecture
```

---

## Documentation Standards

- **All public Python functions**: Google-style docstring with Args, Returns, Raises
- **All React components**: JSDoc comment on the component and its props interface
- **All public hooks**: JSDoc comment describing behavior and return value
- **All services**: JSDoc on every exported function
- **Complex logic**: Inline comments explaining *why*, not *what*

---

## Useful Commands

### Backend

```bash
# Start development server
python main.py

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html

# Lint and format
ruff check app/ --fix
ruff format app/

# Type check
mypy app/

# Create a new database migration
alembic revision --autogenerate -m "your description"

# Apply migrations
alembic upgrade head
```

### Frontend

```bash
# Start dev server (Tauri + Vite)
pnpm tauri dev

# Run tests
pnpm test

# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm type-check

# Build production bundle
pnpm tauri build
```

---

## IDE Recommendations

**VS Code** is the recommended editor. Install these extensions:

- `ms-python.python` — Python language support
- `charliermarsh.ruff` — Ruff linter integration
- `ms-python.mypy-type-checker` — MyPy integration
- `dbaeumer.vscode-eslint` — ESLint integration
- `esbenp.prettier-vscode` — Prettier formatting
- `bradlc.vscode-tailwindcss` — Tailwind CSS IntelliSense
- `tauri-apps.tauri-vscode` — Tauri development tools
- `EditorConfig.EditorConfig` — EditorConfig support
