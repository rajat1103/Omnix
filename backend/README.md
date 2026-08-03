# Omnix Backend

Production-ready FastAPI backend for Omnix.

## Setup

1. Create a virtual environment.
2. Install dependencies.
3. Copy [`.env.example`](.env.example) to [`.env`](.env) if needed.

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Local Execution

Start the API server with Uvicorn:

```bash
uvicorn app.main:app --reload
```

Or use the helper scripts:

```powershell
.\scripts\start.ps1
```

```bash
sh scripts/start.sh
```

## Docker Execution

Build and start the backend from the repository root:

```bash
docker compose up --build
```

The API is available at `http://localhost:8000`.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `APP_NAME` | Application display name | `Omnix Backend` |
| `APP_VERSION` | Backend version | `2.1.0` |
| `ENVIRONMENT` | Runtime environment | `development` |
| `DEBUG` | Enable FastAPI debug mode | `true` |
| `API_PREFIX` | Optional API prefix | `` |
| `DATABASE_URL` | SQLAlchemy database URL | `sqlite:///./omnix.db` |
| `LOG_LEVEL` | Application log level | `INFO` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:1420` |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/version` | Application version |
| `GET` | `/info` | Application metadata |

Swagger UI is available at `http://localhost:8000/docs`.

## Troubleshooting

- If the server fails to start, confirm the virtual environment is active and dependencies are installed.
- If Docker reports a bad health check, verify the container can reach `http://127.0.0.1:8000/health`.
- If CORS requests fail, update `ALLOWED_ORIGINS` in `.env` to include the frontend origin.
- If the port is in use, stop the process using port `8000` or change the host port mapping in `docker-compose.yml`.