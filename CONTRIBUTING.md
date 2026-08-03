# Contributing to Omnix

Thank you for your interest in contributing to Omnix. This document explains how to participate effectively.

---

## Before You Start

Omnix is in active early development. Before writing any code:

1. **Check existing issues** — Your idea or bug may already be tracked
2. **Open an issue first** — Discuss your proposed change before starting work to avoid wasted effort
3. **Read the docs** — Familiarize yourself with [Architecture.md](docs/Architecture.md) and [Development_Guide.md](docs/Development_Guide.md)

---

## Development Setup

See [docs/Development_Guide.md](docs/Development_Guide.md) for the complete setup instructions.

---

## Workflow

1. Fork the repository and clone your fork
2. Branch off `develop`:
   ```bash
   git checkout develop
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the [coding standards](docs/Development_Guide.md#coding-standards)
4. Write tests for all new functionality
5. Run the full test suite and ensure it passes
6. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
7. Push and open a Pull Request against `develop` (not `main`)
8. Fill out the PR template completely

---

## Coding Standards

All contributions must follow the standards in [docs/Development_Guide.md](docs/Development_Guide.md):

- Python: formatted with `ruff`, typed with `mypy --strict`
- TypeScript: formatted with Prettier, linted with ESLint
- All public functions must have docstrings or JSDoc comments
- No secrets or API keys in any commit

---

## Reporting Bugs

Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) issue template.
Include reproduction steps, environment details, and relevant logs.

---

## Suggesting Features

Use the [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) issue template.
Reference the relevant sprint from [docs/Roadmap.md](docs/Roadmap.md) if applicable.

---

## Security Vulnerabilities

Do **not** open a public issue for security vulnerabilities.
See [SECURITY.md](SECURITY.md) for responsible disclosure instructions.

---

## License

By contributing to Omnix, you agree that your contributions will be licensed under the [MIT License](LICENSE).
