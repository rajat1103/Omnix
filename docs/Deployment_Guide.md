# Deployment Guide — Omnix

---

## Document Purpose

This document defines the **build, packaging, and distribution process** for Omnix. Because Omnix is a local desktop application, "deployment" primarily means building a distributable installer for end users.

---

## Build Targets

| Platform | Format | Tool |
|---|---|---|
| Windows | `.exe` installer (NSIS) | Tauri |
| macOS | `.dmg` / `.app` | Tauri |
| Linux | `.AppImage` / `.deb` | Tauri |

---

## Build Prerequisites

Before building a production release:

| Tool | Version |
|---|---|
| Node.js | 20+ |
| pnpm | 8+ |
| Rust (stable) | 1.75+ |
| Python | 3.11+ |

Platform-specific:
- **Windows**: Microsoft Visual C++ Build Tools
- **macOS**: Xcode Command Line Tools
- **Linux**: `libwebkit2gtk-4.0-dev`, `libssl-dev`, `libgtk-3-dev`

---

## Environment Configuration

Production builds use environment variables baked at build time for frontend constants. Sensitive values (API keys) are never baked in — they are entered by the user at runtime.

```bash
# Build-time frontend variables (non-secret)
VITE_APP_VERSION=0.1.0
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

## Build Process

### Step 1: Run tests

```bash
# Backend
pytest tests/ --cov=app --cov-fail-under=75

# Frontend
pnpm test:coverage
```

Never release with failing tests.

### Step 2: Backend — Bundle Python

The backend Python environment is bundled using **PyInstaller** to create a standalone executable that ships with the Tauri app:

```bash
cd backend
pip install pyinstaller
pyinstaller main.py --onefile --name omnix-backend
```

The resulting binary is placed in `frontend/src-tauri/binaries/`.

### Step 3: Frontend + Tauri Build

```bash
cd frontend
pnpm tauri build
```

This produces signed, platform-specific installers in `frontend/src-tauri/target/release/bundle/`.

---

## Release Checklist

Before tagging a release:

- [ ] All tests pass
- [ ] Coverage meets threshold
- [ ] `CHANGELOG.md` entry written for this version
- [ ] Version bumped in `package.json`, `Cargo.toml`, and `pyproject.toml`
- [ ] README roadmap table updated
- [ ] Build tested on the target platform
- [ ] Installer tested from a clean machine (no dev environment)

---

## Versioning

Omnix follows **Semantic Versioning**:

```
vMAJOR.MINOR.PATCH
```

| Increment | When |
|---|---|
| MAJOR | Breaking changes to the user-facing behavior or data format |
| MINOR | Each sprint completion / new significant feature |
| PATCH | Bug fixes and small improvements |

Current version is tracked in:
- `frontend/package.json` → `version` field
- `backend/pyproject.toml` → `[project] version`
- `frontend/src-tauri/Cargo.toml` → `version`

All three must match for every release.

---

## Auto-Update

> To be implemented in a future sprint.

Tauri supports auto-update via a GitHub Releases endpoint. Configuration will be added to `tauri.conf.json` once the release pipeline is established.

---

## Docker (Development Environment)

The `docker-compose.yml` at the root is provided for development environment consistency — it is not the production deployment mechanism. The desktop app is always distributed as a native installer.

```bash
# Start backend in Docker (development only)
docker compose up omnix-backend
```

---

## Sections To Be Filled In

- **Sprint 1**: Tauri configuration details (`tauri.conf.json` settings)
- **Sprint 2**: PyInstaller bundle configuration for the backend
- **Sprint 2**: GitHub Actions CI/CD workflow for automated builds
- **Post v1.0**: Code signing certificates for Windows and macOS
- **Post v1.0**: Auto-update server configuration
