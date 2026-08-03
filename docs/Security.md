# Security — Omnix

---

## Document Purpose

This document defines the **security model, threat analysis, and implementation requirements** for Omnix. Because Omnix has deep access to user files, processes, and optionally screen content, security must be a first-class concern from Sprint 0.

---

## Threat Model

Omnix runs locally on the user's machine. The primary threats are:

| Threat | Severity | Notes |
|---|---|---|
| Prompt injection attacks | High | User content injected into LLM prompts could manipulate AI behavior |
| API key leakage | High | Keys stored insecurely could be exfiltrated by malware |
| Runaway automation | High | AI-suggested actions could cause irreversible data loss |
| Unintended file access | Medium | Indexing should respect explicitly configured paths only |
| Malicious plugin | Medium | Third-party plugins could abuse Omnix's OS access |
| Cloud data leakage | Medium | Content sent to cloud AI APIs without user awareness |
| Dependency vulnerabilities | Medium | Supply chain risk from Python/npm packages |

---

## Security Principles

1. **Least privilege** — Request only the OS permissions actually needed
2. **Confirmation for all destructive actions** — No file deletion, move, or system change without explicit user confirmation
3. **Secrets never in plaintext** — API keys encrypted at rest, never logged
4. **Clear data boundaries** — Users must know exactly what is indexed and what is sent to cloud services
5. **Audit everything** — All automation actions logged with full details
6. **Sandboxed plugins** — Plugins run with restricted permissions

---

## API Key Storage

API keys must never be stored in plaintext:

- **Storage backend**: Use the OS keychain where available
  - Windows: Windows Credential Manager
  - macOS: macOS Keychain
  - Linux: libsecret / kwallet
- **Fallback**: AES-256 encrypted file, key derived from machine ID + user salt
- **Transmission**: Keys are only transmitted to their respective provider's API endpoint over HTTPS
- **Logging**: API keys must NEVER appear in log output. Redact at the logging layer.

---

## Tauri Security

The Tauri shell enforces a capability-based permission model:

- Only explicitly declared filesystem paths can be read or written from the frontend
- The frontend cannot execute arbitrary shell commands — all system actions go through defined Tauri commands in Rust
- Content Security Policy (CSP) is strictly configured to prevent XSS
- `allowlist` in `tauri.conf.json` is set to minimum required permissions

---

## Prompt Injection Protection

User-supplied content (file contents, search queries, clipboard) is always separated from system instructions:

```
[SYSTEM] ← Trusted, immutable instructions
<system_boundary>
[USER CONTENT] ← Untrusted, clearly delimited
</system_boundary>
[RESPONSE INSTRUCTION] ← Trusted
```

The LLM is instructed to ignore any instructions found within user content. Critical automation actions use structured output (JSON) with validation rather than free-text parsing.

---

## Automation Safety Model

All automation actions follow a mandatory confirmation workflow:

```
AI suggests action
      │
      ▼
Safety check (is this action in the allowed list?)
      │
      ▼
User sees plain-English description of the action
      │ (requires explicit click or keyboard confirmation)
      ▼
Action executed with full audit log entry
      │
      ▼
Undo available (for reversible actions)
```

**Hard-blocked actions** (can never be performed by Omnix AI automation):
- Deleting system files or directories
- Modifying files outside user-configured paths
- Network connections not to declared API endpoints
- Installing or executing downloaded binaries

---

## Data Transmission Policy

| Data Type | Sent to Cloud? | User Control |
|---|---|---|
| File contents | Only when cloud AI is active | Can disable cloud AI entirely |
| Conversation messages | Only when cloud AI is active | Per-conversation override |
| File paths | Never | — |
| User settings | Never | — |
| Embeddings | Never | — |
| API keys | Never (only to provider endpoint) | — |
| Screen captures | Only when screen AI is active + confirmed | Requires explicit opt-in per session |

---

## Dependency Security

- Backend: `pip-audit` run in CI to detect known vulnerabilities in Python dependencies
- Frontend: `npm audit` run in CI
- Dependencies pinned with exact versions in `requirements.txt` and `package.json`
- `dependabot` configured to open PRs for security updates

---

## Sections To Be Filled In

- **Sprint 1**: Tauri capability configuration details
- **Sprint 2**: API key storage implementation (keychain integration)
- **Sprint 7**: Chat session isolation and data retention policy
- **Sprint 9**: Plugin sandboxing architecture
- **Sprint 10**: Automation action allowlist definition
