# meinelog_ai

Full-stack template: Rails API + Next.js Web + Postgres + MinIO, fully containerized for DigitalOcean deployment.

## Stack

- **API:** Ruby on Rails (API-only, PostgreSQL) — `ruby:3.4-slim` — `./api`
  - `api/Dockerfile` installs `build-essential git curl nano libpq-dev libvips libjemalloc2`, runs `bundle install`, serves on `3000` via `rails server -b 0.0.0.0`.
  - `api/config/database.yml` reads all connection info from ENV (`DATABASE_HOST/PORT/NAME/USER/PASSWORD`).
- **Web:** Next.js (App Router, TypeScript, Tailwind) — `node:22-alpine` — `./web`
  - `web/Dockerfile` runs `npm install` and `npm run dev` on port `3000`.
- **DB:** `postgres:17` with healthcheck (`pg_isready`), persisted in `meinelog_ai_postgres_data`.
- **Storage:** MinIO (`minio/minio:latest`) — S3-compatible object storage, persisted in `meinelog_ai_minio_data`.
- **Orchestration:** Docker Compose with `user: "${UID:-1000}:${GID:-1000}"` to avoid root-owned files on Linux.

Scaffolded with isolated Docker containers (no global Ruby/Node version conflicts).

## Prerequisites

- Docker + Docker Compose v2
- No local Ruby/Node required

## Quickstart

```bash
# 1. Clone / enter project
cd meinelog_ai

# 2. Configure environment
cp .env.example .env
# Edit .env: DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, API_PORT, WEB_PORT, MINIO_*

# 3. Build + start everything
docker compose up --build

# Services:
# - Web:   http://localhost:${WEB_PORT:-5001} -> container 3000
# - API:   http://localhost:${API_PORT:-5000} -> container 3000
# - MinIO API:     http://localhost:9000
# - MinIO Console: http://localhost:9001
```

Detached mode:

```bash
docker compose up -d --build
docker compose logs -f
docker compose down
```

## Environment variables

Copy `.env.example` to `.env` (never commit `.env` — root `.gitignore` contains `*.env`).

| Var | Used by | Description |
|-----|---------|-------------|
| `DATABASE_HOST` | api, postgres | Docker DNS name, keep `postgres` |
| `DATABASE_PORT` | api, postgres | Host-mapped PG port, e.g. `5432` |
| `DATABASE_NAME` | api, postgres | Base name; Rails appends `_development/_test/_production` |
| `DATABASE_USER` | api, postgres | PG user |
| `DATABASE_PASSWORD` | api, postgres | PG password |
| `API_HOST` / `API_PORT` | web, api | API host + host port mapping (`${API_PORT}:3000`) |
| `WEB_HOST` / `WEB_PORT` | web, api | Web host + host port mapping (`${WEB_PORT}:3000`) |
| `MINIO_ROOT_USER` | minio | MinIO admin user |
| `MINIO_ROOT_PASSWORD` | minio | MinIO admin password (min 8 chars) |
| `MINIO_PORT` | minio | S3 API port (default `9000`) |
| `MINIO_CONSOLE_PORT` | minio | Console port (default `9001`) |
| `MINIO_ENDPOINT` | api/web | e.g. `http://localhost:9000` or `http://minio:9000` in-compose |
| `MINIO_BUCKET` | api | Default bucket, e.g. `meinelog_ai-bucket` (create via console or SDK) |

UID/GID mapping: Compose uses `user: "${UID:-1000}:${GID:-1000}"`. On Linux export `UID=$(id -u) GID=$(id -g)` or rely on defaults.

## Useful commands

```bash
# Rails console / migrate / routes
docker compose exec api rails console
docker compose exec api rails db:create db:migrate
docker compose exec api rails routes

# Bundle add
docker compose exec api bundle add <gem>

# Web shell / npm
docker compose exec web sh
docker compose exec web npm install <pkg>

# Postgres psql
docker compose exec postgres psql -U ${DATABASE_USER} -d ${DATABASE_NAME}_development

# MinIO: create bucket via console http://localhost:9001, or mc CLI
```

## Deploy notes (DigitalOcean)

- Docker was chosen for server parity: same images locally and on Droplet.
- Push repo to server, `cp .env.example .env`, set strong `DATABASE_PASSWORD` / `MINIO_ROOT_PASSWORD`, then `docker compose up -d --build`.
- Put a reverse proxy (Caddy/Nginx) or DO Load Balancer in front of `${WEB_PORT}` / `${API_PORT}` for TLS.

## Project layout

```
.
├── api/               # rails new api --api --database=postgresql
│   ├── Dockerfile     # ruby:3.4-slim dev image
│   └── config/database.yml  # ENV-driven
├── web/               # create-next-app web
│   └── Dockerfile     # node:22-alpine dev image
├── docker-compose.yml # web + api + postgres + minio
├── .env.example       # copy to .env
└── .gitignore         # *.env
```
