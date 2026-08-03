# Privacy — Omnix

---

## Document Purpose

This document defines the **privacy model and user data controls** for Omnix. Privacy is a core product principle, not a compliance checkbox. This document must remain current and honest.

---

## Privacy Philosophy

Omnix is built on a simple promise: **your data stays on your machine by default, and you control everything**.

- No accounts required to use Omnix
- No telemetry without explicit opt-in
- No data transmitted to cloud services unless you configure a cloud AI provider
- You can delete all Omnix data at any time with a single action
- You can see exactly what Omnix has indexed at any time

---

## Data Inventory

### Data Stored Locally

| Data | Where Stored | User Can Delete? |
|---|---|---|
| File metadata (paths, sizes, hashes) | SQLite | ✅ Yes |
| File text content (chunks) | SQLite | ✅ Yes |
| File embeddings (vectors) | FAISS index | ✅ Yes |
| Conversation history | SQLite | ✅ Yes |
| AI memory / extracted facts | SQLite + FAISS | ✅ Yes |
| User settings | SQLite | ✅ Yes |
| Automation logs | SQLite | ✅ Yes |
| API keys | OS Keychain | ✅ Yes |

### Data Never Collected

- Usage analytics (unless explicitly opted in)
- Crash reports (unless explicitly opted in)
- Keystroke or mouse data
- Microphone recordings (voice features opt-in only)
- Camera data
- Network traffic beyond declared API endpoints

---

## User Data Controls

All of the following are accessible from the Settings → Privacy screen:

1. **Index Management** — View all indexed files; remove specific files or directories from the index
2. **Memory Browser** — View, search, and delete any stored memory item
3. **Conversation History** — Delete individual conversations or all history
4. **Export My Data** — Export all stored data as JSON/CSV
5. **Delete Everything** — One-click wipe of all Omnix data (SQLite + FAISS + settings)
6. **Cloud Provider Audit** — View exactly which conversations used cloud AI providers

---

## What Happens When Cloud AI Is Active

When the user configures a cloud AI provider (OpenAI, Gemini, Claude):

1. The conversation message is sent to the provider's API over HTTPS
2. Retrieved file chunks used for RAG context are also sent as part of the prompt
3. The user is shown a clear indicator in the UI whenever a cloud provider is active
4. The user can switch to a local provider (Ollama) at any time

**What is NOT sent:**
- File paths
- Files not relevant to the current query
- Memory items (only the relevant summary is sent, never raw file content unless it appears as a RAG chunk)

---

## Opt-In Telemetry

Omnix may offer optional, anonymous crash reporting and usage analytics in a future sprint. This will:

- Be clearly opt-in during first launch (default: OFF)
- Collect only crash stack traces (no user data, no file names, no content)
- Be toggleable at any time in Settings → Privacy
- Be fully transparent about what is sent

No telemetry will be implemented before this privacy document is updated with exact details of what is collected.

---

## Local AI Recommended for Sensitive Work

For users handling sensitive or confidential information, Omnix strongly recommends using a local AI model via Ollama. When configured this way:

- No data leaves the machine under any circumstances
- The application functions fully offline
- Performance depends on local hardware (GPU recommended for acceptable speed)

---

## Sections To Be Filled In

- **Sprint 2**: API key storage implementation and keychain integration details
- **Sprint 7**: Detailed breakdown of what is sent per AI provider during chat
- **Sprint 8**: Screen intelligence privacy considerations (opt-in, session-scoped only)
- **Sprint 12**: Voice data handling — recorded audio, STT processing, retention policy
