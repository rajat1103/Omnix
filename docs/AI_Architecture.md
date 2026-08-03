# AI Architecture — Omnix

---

## Document Purpose

This document describes the **design and implementation plan for the Omnix AI subsystem** — the most complex part of the application. It covers provider abstraction, embedding strategy, the indexing pipeline, and how all AI modules interoperate.

See [RAG_Architecture.md](RAG_Architecture.md) for the detailed RAG pipeline design.

---

## AI Subsystem Map

```
backend/app/ai/
│
├── providers/          ← Unified interface over all LLMs
├── embeddings/         ← Text embedding generation and FAISS management
├── rag/                ← Retrieval-Augmented Generation pipeline
├── memory/             ← Persistent long-term knowledge store
└── indexing/           ← File watching, extraction, and embedding pipeline
```

---

## Provider Abstraction

### Design Goal

All LLM calls in Omnix go through a single unified interface. Switching from OpenAI to Ollama — or adding a new provider — requires zero changes to calling code.

### Base Interface

```python
# Conceptual — not implementation code
class LLMProvider:
    def complete(prompt: str, ...) -> str
    def stream(prompt: str, ...) -> Iterator[str]
    def embed(texts: list[str]) -> list[list[float]]
```

### Supported Providers

| Provider | Type | Model Examples | Notes |
|---|---|---|---|
| OpenAI | Cloud | `gpt-4o`, `gpt-4o-mini` | Requires `OPENAI_API_KEY` |
| Google Gemini | Cloud | `gemini-1.5-pro`, `gemini-flash` | Requires `GEMINI_API_KEY` |
| Anthropic Claude | Cloud | `claude-3-5-sonnet` | Requires `ANTHROPIC_API_KEY` |
| Ollama | Local | `llama3.2`, `qwen2.5`, `mistral` | Requires Ollama running locally |

### Provider Selection

The active provider is determined by the `AI_PROVIDER` environment variable and can be changed at runtime through the settings UI. The `providers/factory.py` module returns the correct adapter instance.

---

## Embedding Strategy

### Embedding Models

| Provider | Model | Dimension | Notes |
|---|---|---|---|
| OpenAI | `text-embedding-3-small` | 1536 | Best quality, requires API key |
| OpenAI | `text-embedding-3-large` | 3072 | Highest quality, higher cost |
| Ollama | `nomic-embed-text` | 768 | Excellent local model, free |
| Ollama | `mxbai-embed-large` | 1024 | Higher quality local option |

### Chunking Strategy

Content is split into chunks before embedding. The default strategy:

| Parameter | Default Value | Rationale |
|---|---|---|
| Chunk size | 512 tokens | Balances context retention vs. retrieval precision |
| Chunk overlap | 64 tokens | Prevents losing context at chunk boundaries |
| Strategy | Recursive character splitter | Respects paragraph and sentence boundaries |

Special strategies for specific file types:
- **Code files** — Split at function/class boundaries
- **Markdown** — Split at heading boundaries
- **PDFs** — Split at page boundaries first, then by tokens

---

## Indexing Pipeline

The indexing pipeline runs as a background process.

```
File System Watch (file_watcher.py)
         │
         ▼ (new or modified file detected)
File Queue
         │
         ▼
Content Extraction (extractors/)
├── PDF → pdfminer / pymupdf
├── DOCX → python-docx
├── Code → raw text + tree-sitter for structure
├── Markdown → raw text
└── TXT → raw text
         │
         ▼
Text Cleaning & Normalization (utils/)
         │
         ▼
Chunking (embeddings/chunker.py)
         │
         ▼
Embedding Generation (embeddings/encoder.py)
         │
         ├──► SQLite: store chunk record (file_chunks table)
         └──► FAISS: add embedding to index
```

### Deduplication

Before indexing a file, the pipeline computes a SHA-256 hash of its content. If the hash matches the stored `content_hash` in `indexed_files`, the file is skipped. This prevents unnecessary re-embedding.

---

## Memory Architecture

### Types of Memory

| Type | Description | Storage |
|---|---|---|
| **Working memory** | Current conversation context | In-memory (Python dict) |
| **Episodic memory** | Past conversations (compressed summaries) | SQLite `memory_items` + FAISS |
| **Semantic memory** | Extracted facts and entities | SQLite `memory_items` + FAISS |
| **File knowledge** | Indexed content from files | SQLite `file_chunks` + FAISS |

### Memory Lifecycle

1. **Extraction** — After each conversation turn, `memory/extractor.py` extracts notable facts
2. **Storage** — Facts are embedded and stored in SQLite + FAISS
3. **Retrieval** — Before each AI response, relevant memories are retrieved from FAISS
4. **Decay** — Low-confidence or very old memories can be archived or pruned
5. **Deletion** — Users can view and manually delete any memory item

---

## AI Safety Considerations

- **Prompt injection protection** — User content is always separated from system instructions with clear delimiters
- **Output validation** — AI responses for automation actions are parsed and validated before execution
- **Confirmation gates** — Any automation action suggested by AI must be confirmed by the user
- **Rate limiting** — Cloud API calls are rate-limited to prevent unexpected costs
- **Cost tracking** — Token usage is logged per conversation and surfaced in the UI

---

## Sections To Be Filled In

- **Sprint 6**: Complete RAG pipeline implementation details → see [RAG_Architecture.md](RAG_Architecture.md)
- **Sprint 8**: Screen intelligence vision pipeline (model selection, OCR vs. VLM decision)
- **Sprint 9**: Code intelligence — AST parsing, call graph analysis
- **Sprint 12**: Voice pipeline — STT model selection, wake word detection
