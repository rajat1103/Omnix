# Testing Guide — Omnix

---

## Document Purpose

This document defines the **testing strategy, standards, and tooling** for Omnix. Good tests are what allow a solo developer to refactor confidently, add features without regression, and ship reliable software.

---

## Testing Philosophy

- **Test behavior, not implementation** — Tests should verify what the code does, not how it does it internally
- **Fast tests are run often** — Unit tests must complete in under 5 seconds total
- **Every bug gets a test** — When a bug is found and fixed, a regression test is added
- **Don't mock the database for integration tests** — Use a real test SQLite database
- **AI/LLM calls are always mocked** — Tests must not make real API calls

---

## Test Pyramid

```
        ┌──────────────┐
        │  E2E Tests   │   (Few — slow, test full user flows)
        ├──────────────┤
        │ Integration  │   (Some — test across layers with real DB)
        │    Tests     │
        ├──────────────┤
        │  Unit Tests  │   (Many — fast, isolated, no I/O)
        └──────────────┘
```

---

## Backend Testing (Python)

### Framework: pytest

All backend tests use **pytest** with the following plugins:
- `pytest-asyncio` — Async test support
- `pytest-cov` — Coverage reporting
- `httpx` — Async HTTP client for testing FastAPI routes

### Test Structure

```
backend/tests/
├── conftest.py              # Shared fixtures: test DB, client, mock providers
├── unit/
│   ├── api/                 # Route handler tests (mocked services)
│   ├── services/            # Service tests (mocked repositories + AI)
│   ├── repositories/        # Repository tests (real test SQLite)
│   └── ai/                  # AI module tests (mocked LLM/embeddings)
└── integration/             # Cross-layer tests (API → service → DB)
```

### Writing Tests

```python
# Unit test example — service layer
async def test_search_returns_empty_for_no_index(mock_faiss, mock_db):
    service = SearchService(db=mock_db, vector_store=mock_faiss)
    mock_faiss.search.return_value = []

    result = await service.search("quarterly review")

    assert result.items == []
    assert result.total == 0


# Integration test example
async def test_create_conversation_persists_to_db(client, test_db):
    response = await client.post("/api/v1/conversations", json={"title": "Test"})

    assert response.status_code == 201
    data = response.json()["data"]
    assert data["title"] == "Test"

    # Verify it's actually in the DB
    conv = test_db.get(Conversation, data["id"])
    assert conv is not None
```

### Coverage Requirements

| Layer | Minimum Coverage |
|---|---|
| `app/api/` | 80% |
| `app/services/` | 85% |
| `app/repositories/` | 80% |
| `app/ai/` | 70% |
| Overall | 75% |

### Running Tests

```bash
# All tests
pytest tests/ -v

# Unit tests only (fast)
pytest tests/unit/ -v

# Integration tests
pytest tests/integration/ -v

# With coverage
pytest tests/ --cov=app --cov-report=html --cov-fail-under=75

# Run specific test file
pytest tests/unit/services/test_search_service.py -v
```

---

## Frontend Testing (TypeScript)

### Framework: Vitest + React Testing Library

- **Vitest** — Fast unit test runner (Vite-native)
- **React Testing Library (RTL)** — Component testing with user-centric queries
- **MSW (Mock Service Worker)** — Mock HTTP requests in tests

### Test Structure

```
frontend/src/
├── components/__tests__/       # Component unit tests
├── hooks/__tests__/            # Hook tests
├── features/<name>/__tests__/  # Feature-level tests
└── utils/__tests__/            # Utility function tests
```

### Writing Tests

```tsx
// Component test example
test('SearchBar calls onSearch with the query when submitted', async () => {
  const onSearch = vi.fn();
  render(<SearchBar onSearch={onSearch} />);

  await userEvent.type(screen.getByRole('searchbox'), 'my documents');
  await userEvent.keyboard('{Enter}');

  expect(onSearch).toHaveBeenCalledWith('my documents');
});

// Hook test example
test('useDebounce delays value update', async () => {
  const { result } = renderHook(() => useDebounce('initial', 300));
  expect(result.current).toBe('initial');
});
```

### Running Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

---

## What Must Be Tested

### Required Coverage

| Code Type | Test Required |
|---|---|
| Service business logic | ✅ Always |
| Repository DB queries | ✅ Always |
| API route handlers | ✅ Happy path + error cases |
| AI provider adapters | ✅ Mocked responses |
| React components | ✅ User interactions |
| Custom hooks | ✅ Behavior verification |
| Utility functions | ✅ All cases |
| Plugin interfaces | ✅ Contract tests |

### Not Required

| Code Type | Reason |
|---|---|
| Database migration files | Schema correctness verified by running migrations |
| Configuration files | Not logic-bearing |
| `main.py` entrypoint | Covered by integration tests |
| Type-only files (`.d.ts`) | No logic |

---

## Mocking Standards

### Python

- Use `unittest.mock.AsyncMock` for async dependencies
- Use `pytest.fixture` for all shared setup (DB sessions, HTTP client)
- LLM provider calls: always mock via fixture returning pre-defined responses
- FAISS operations: mock the `FAISSStore` class entirely in unit tests

### TypeScript

- Use `vi.mock()` for module mocking
- Use `msw` for API call interception in component/integration tests
- Never test implementation details — test observable behavior only

---

## CI/CD Testing

All tests are run automatically on every PR via GitHub Actions:
- Lint and type checks run first (fast fail)
- Unit tests run in parallel
- Integration tests run after unit tests pass
- Coverage report generated and checked against minimum thresholds
- PR is blocked from merging if any test fails or coverage drops below threshold
