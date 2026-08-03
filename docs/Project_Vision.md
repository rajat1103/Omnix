# Project Vision — Omnix

> **Your Computer. One Intelligent Mind.**

---

## Document Purpose

This document is the foundational vision document for Omnix. It defines *why* the project exists, *what* it intends to become, and *who* it is built for. Every technical decision, design choice, and sprint priority should be traceable back to this document.

Read this before reading any other document in `docs/`.

---

## Problem Statement

Modern knowledge workers interact with hundreds of files, applications, browser tabs, and communication threads every day. Despite this explosion of personal data, computers remain fundamentally stateless from the perspective of AI. Every AI assistant starts from a blank slate. Every search engine returns generic results. Nothing remembers the context of your work.

The result: you spend hours searching for files you've already opened, re-explaining context to AI tools that have no memory of you, and manually connecting dots between your documents, code, and notes.

**The computer knows everything about your work. Yet it understands nothing.**

---

## Vision Statement

Omnix is a **Local-First AI Operating Layer** — a persistent, intelligent middleware between the user and their operating system.

Omnix continuously builds a semantic understanding of your digital workspace: your files, your projects, your communication patterns, your workflows. It gives you a single, natural-language interface to access, search, summarize, and act on everything — privately, on your own machine.

**The long-term vision:** Omnix becomes the operating layer that makes your computer feel like it genuinely understands you.

---

## Core Philosophy

```
Understand → Remember → Reason → Act
```

| Phase | Meaning |
|---|---|
| **Understand** | Parse and semantically index all local content — files, code, documents, screens |
| **Remember** | Build a persistent, evolving knowledge store that survives session restarts |
| **Reason** | Use LLMs to connect context, surface insights, and answer questions accurately |
| **Act** | Take actions on the OS — open files, run commands, automate workflows — safely |

---

## Target User

Omnix is designed primarily for **knowledge workers and developers** who:

- Work with large volumes of files, notes, and code daily
- Want AI assistance that respects their privacy and works offline
- Are comfortable with technical tools but demand polished UX
- Need persistent context across long-running projects
- Are frustrated by the statelessness of current AI tools

Secondary users: researchers, writers, students — anyone who accumulates digital knowledge and needs help making sense of it.

---

## Design Principles

### 1. Local-First
All data is stored and processed on the user's machine by default. Cloud AI providers are opt-in, not required. Privacy is a feature, not an afterthought.

### 2. Persistent Understanding
Omnix builds knowledge that survives across sessions, updates as files change, and grows more useful over time. It is not a chatbot — it is an operating layer.

### 3. Speed Over Completeness
A fast, partial answer is almost always more useful than a slow, complete one. Omnix should feel instant. RAG results should appear in milliseconds, not seconds.

### 4. One Interface
Users should not have to navigate a complex application. The primary interaction is a single, clean command palette / chat interface. Depth is available but never forced.

### 5. Extensible by Design
The plugin architecture allows developers to add new indexers, AI providers, automations, and UI panels without modifying the core. Omnix is a platform, not just a product.

### 6. Never Surprising
Automation and AI actions must be auditable, reversible where possible, and always ask for confirmation before performing destructive operations. Trust is the product.

---

## Non-Goals

Omnix is **not**:

- A cloud storage service or file sync tool
- A replacement for Notion, Obsidian, or other note-taking apps
- A general-purpose chatbot (though it has chat capabilities)
- An enterprise productivity suite
- A browser extension or web application
- A surveillance tool — Omnix indexes only what users explicitly allow

---

## Success Criteria

Omnix is successful when:

1. A user can ask "find that contract I worked on last month" and get the correct file in under 2 seconds.
2. A user can open Omnix after a week away and immediately get a summary of where they left off.
3. A user can say "rename all the screenshots on my Desktop from this week" and Omnix does it correctly, with confirmation.
4. A developer can query their entire codebase in natural language without sending any code to a cloud service.
5. A non-technical user can set up Omnix using a local model with no API keys and find it genuinely useful.

---

## Competitive Landscape

| Product | Comparison |
|---|---|
| Spotlight / Windows Search | Keyword-only. No semantic understanding. No memory. |
| Notion AI | Cloud-only. Tied to Notion workspace. No OS-level access. |
| Microsoft Copilot | Requires Microsoft 365. Cloud-only. No file-level privacy control. |
| Rewind AI | Cloud-based screen recording. Privacy concerns. No local model support. |
| Obsidian + AI plugins | Note-taking focused. Manual linking. No OS-level automation. |
| **Omnix** | Local-first. Persistent memory. Full OS access. Multi-model. Open. |

---

## Relationship to Other Documents

| Document | Purpose |
|---|---|
| [Architecture.md](Architecture.md) | Technical system design |
| [AI_Architecture.md](AI_Architecture.md) | AI subsystem design |
| [Software_Requirements.md](Software_Requirements.md) | Formal requirements |
| [Roadmap.md](Roadmap.md) | Sprint-by-sprint delivery plan |
| [Privacy.md](Privacy.md) | Privacy model and user data controls |
