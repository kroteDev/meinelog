# meinelog_ai

Full-stack template: Rails API + Next.js Web + Postgres, fully containerized for DigitalOcean deployment.

## Stack

- **API:** Ruby on Rails (API-only, PostgreSQL) — `ruby:3.4-slim` — `./api`
  - `api/Dockerfile` installs `build-essential git curl nano libpq-dev libvips libjemalloc2`, runs `bundle install`, serves on `3000` via `rails server -b 0.0.0.0`.
  - `api/config/database.yml` reads all connection info from ENV (`DATABASE_HOST/PORT/NAME/USER/PASSWORD`).
- **Web:** Next.js (App Router, TypeScript, Tailwind) — `node:22-alpine` — `./web`
  - `web/Dockerfile` runs `npm install` and `npm run dev` on port `3000`.
- **DB:** `postgres:17` with healthcheck (`pg_isready`), persisted in `meinelog_ai_postgres_data`.
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
# Edit .env: DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, API_PORT, WEB_PORT

# 3. Build + start everything
docker compose up --build

# Services:
# - Web:   http://localhost:${WEB_PORT:-5001} -> container 3000
# - API:   http://localhost:${API_PORT:-5000} -> container 3000
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

> Object storage (MinIO/S3) was dropped: MinIO removed its official
> Docker Hub image and restricted quay.io pulls, and nothing in the
> app uses S3 yet (ActiveStorage is local). Re-add when needed.

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
```

## Deploy notes (DigitalOcean)

- Docker was chosen for server parity: same images locally and on Droplet.
- Push repo to server, `cp .env.example .env`, set strong `DATABASE_PASSWORD`, then `docker compose up -d --build`.
- Put a reverse proxy (Caddy/Nginx) or DO Load Balancer in front of `${WEB_PORT}` / `${API_PORT}` for TLS.

## Project layout

```
.
├── api/               # rails new api --api --database=postgresql
│   ├── Dockerfile     # ruby:3.4-slim dev image
│   └── config/database.yml  # ENV-driven
├── web/               # create-next-app web
│   └── Dockerfile     # node:22-alpine dev image
├── docker-compose.yml # web + api + postgres
├── .env.example       # copy to .env
└── .gitignore         # *.env
```
