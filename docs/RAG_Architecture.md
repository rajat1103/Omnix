# RAG Architecture — Omnix

---

## Document Purpose

This document details the **Retrieval-Augmented Generation (RAG) pipeline** — the system that allows Omnix to answer questions accurately by grounding AI responses in the user's actual local data.

---

## What Is RAG?

Without RAG, an LLM answers from its training data only — it knows nothing about your specific files, projects, or knowledge. RAG solves this by:

1. **Retrieving** relevant chunks from a local vector index
2. **Augmenting** the LLM prompt with those chunks as context
3. **Generating** a response grounded in the retrieved information

The result: the AI answers questions about *your* data, not generic knowledge.

---

## RAG Pipeline Overview

```
User Query
    │
    ▼
┌──────────────────────────────────────┐
│         1. Query Processing           │
│   • Clean and normalize query         │
│   • Detect query intent/type          │
│   • Expand query if needed            │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│         2. Dual Retrieval             │
│   • Semantic search (FAISS)           │
│   • Keyword search (SQLite FTS5)      │
│   • Merge and deduplicate results     │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│         3. Context Assembly           │
│   • Rank retrieved chunks             │
│   • Apply relevance threshold         │
│   • Inject user memory items          │
│   • Trim to fit context window        │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│         4. Prompt Construction        │
│   • System instruction                │
│   • Conversation history              │
│   • Retrieved context (with sources)  │
│   • User query                        │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│         5. Generation                 │
│   • Call active LLM provider          │
│   • Stream response tokens            │
│   • Parse source citations            │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│         6. Post-Processing            │
│   • Store message + sources in DB     │
│   • Extract memory items              │
│   • Return response to frontend       │
└──────────────────────────────────────┘
```

---

## Retrieval: Dual-Mode Search

Omnix uses a **hybrid retrieval strategy** — combining semantic and keyword search — for higher accuracy than either approach alone.

### Semantic Search (FAISS)
- Converts query to embedding vector
- Searches FAISS index for nearest neighbor chunks
- Returns top-k results by cosine similarity
- Best for: conceptual questions, finding related content

### Keyword Search (SQLite FTS5)
- Full-text search over the `file_chunks.content` column
- Uses BM25 ranking
- Best for: exact name lookups, code symbol search, date references

### Fusion Strategy
Results from both methods are merged using **Reciprocal Rank Fusion (RRF)**:

```
RRF_score = Σ 1 / (k + rank_i)
```

Where `k = 60` (standard RRF constant) and `rank_i` is the position in each result list.

---

## Context Window Management

LLMs have a finite context window. Omnix manages this carefully:

| Component | Estimated Tokens | Notes |
|---|---|---|
| System prompt | ~500 | Fixed |
| Conversation history | 0–2,000 | Last N turns |
| Retrieved chunks | 1,000–4,000 | Top ranked, trimmed to fit |
| Memory items | 0–500 | Most relevant memories |
| User query | 10–200 | Current turn |
| **Total budget** | **~8,000** | Conservative; actual limit depends on model |

When context exceeds the budget, the priority is:
1. Keep system prompt (fixed)
2. Keep last 3 conversation turns (most relevant history)
3. Keep top-ranked retrieved chunks (trimmed to fit remaining space)
4. Keep top-3 memory items

---

## Prompt Template

The RAG prompt follows this structure:

```
[SYSTEM]
You are Omnix, a local AI assistant with access to the user's personal knowledge base.
Answer questions using the provided context. If the context doesn't contain the answer,
say so clearly. Always cite your sources.

[MEMORY]
Relevant facts about this user and their work:
{memory_context}

[CONTEXT]
Relevant documents retrieved from the user's files:
---
Source: {file_path} (last modified: {date})
{chunk_content}
---
(... more chunks ...)

[CONVERSATION]
{conversation_history}

[USER]
{current_query}
```

---

## Source Citations

Every RAG response includes a `sources` field — a list of file chunks that contributed to the answer. The frontend renders these as clickable references that open the source file.

```json
{
  "content": "Based on your notes...",
  "sources": [
    {
      "file_path": "/Users/name/Documents/project.md",
      "chunk_index": 3,
      "excerpt": "The first milestone is...",
      "relevance_score": 0.92
    }
  ]
}
```

---

## RAG Quality Metrics

To be tracked and improved across sprints:

| Metric | Target | Method |
|---|---|---|
| Retrieval precision | > 80% | Evaluate top-5 results for relevance |
| Answer faithfulness | > 90% | Response grounded in retrieved context |
| Retrieval latency | < 200ms | FAISS + SQLite FTS5 combined |
| Generation latency | Depends on model | Measured per provider |
| Context utilization | > 60% | Are retrieved chunks actually used? |

---

## Configuration Parameters

| Parameter | Default | Description |
|---|---|---|
| `rag.top_k` | 10 | Number of chunks to retrieve per search |
| `rag.relevance_threshold` | 0.65 | Minimum cosine similarity to include |
| `rag.max_context_tokens` | 4000 | Maximum tokens allocated to context |
| `rag.memory_top_k` | 5 | Number of memory items to inject |
| `rag.reranking_enabled` | false | Enable cross-encoder reranking (Sprint 6+) |

---

## Future Improvements

- **Cross-encoder reranking** — A second, slower but more accurate ranking pass after initial retrieval
- **HyDE (Hypothetical Document Embedding)** — Generate a hypothetical answer, embed it, and use that to retrieve better results
- **Multi-query retrieval** — Decompose complex queries into sub-queries, retrieve for each, then merge
- **Adaptive chunk sizing** — Dynamically adjust chunk size based on document type
- **Graph-based retrieval** — Use a knowledge graph for entity-hop retrieval (Sprint 5 dependency)
