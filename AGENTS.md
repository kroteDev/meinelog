# AGENTS.md — meinelog_ai

> Orientation file for AI agents (and humans) starting a new session on
> this project. Read this + `api/README.md` before doing anything.

## What this is

Full-stack template turned real app: Rails 8.1 API-only backend +
Next.js frontend + PostgreSQL 17, fully containerized for deployment
on a DigitalOcean droplet. Scaffolding used isolated Docker containers
(no host Ruby/Node dependency).

## Layout

```
.
├── api/                    # Rails 8.1 --api, PostgreSQL (ruby:3.4-slim)
│   ├── app/models/         # user.rb, project.rb, task.rb (+ ApplicationRecord)
│   ├── app/controllers/api/v1/   # users/{sessions,registrations}, projects, tasks
│   ├── app/controllers/concerns/ # rack_sessions_fix.rb, ownable.rb
│   ├── app/serializers/    # user/project/task_serializer.rb (jsonapi-serializer)
│   ├── config/initializers/  devise.rb (JWT block), cors.rb (exposes Authorization)
│   ├── config/database.yml # ENV-driven (DATABASE_*); base name + _development/_test
│   └── db/migrate/         # users (devise+jti) -> projects (uuid) -> tasks (uuid)
├── web/                    # Next.js (node:22-alpine), create-next-app default
├── docker-compose.yml      # web + api + postgres (MinIO dropped, see below)
├── .env.example            # copy to .env (never commit .env)
└── .opencode/skills/rails-api-resource/  # local skill: full resource workflow
```

## Services & ports (dev defaults via `.env`)

| Service | Host port | Container | Notes |
|---|---|---|---|
| web | `WEB_PORT` (5001) | 3000 | `npm run dev` |
| api | `API_PORT` (5000) | 3000 | `rails s -b 0.0.0.0`, `user: UID:GID` |
| postgres | `DATABASE_PORT` (5432) | 5432 | `postgres:17`, healthcheck, named volume |

Health: `GET localhost:5000/up` → 200, `GET localhost:5001/` → 200.

## First-session checklist

```bash
cp .env.example .env   # once; fill DATABASE_*, API_PORT, WEB_PORT
docker compose up -d --build
docker compose exec api bundle exec rails db:prepare
```

All Rails work runs via `docker compose exec api …` (or `run --rm`
when the service is stopped). Never run `rails g` on the host.

## Auth (Devise + JWT, all under `/api/v1`)

- `POST /api/v1/signup` → 200 + `Authorization: Bearer <jwt>` header.
- `POST /api/v1/signin` → 200 + fresh token header (30-min expiry).
- `DELETE /api/v1/signout` → 200, token revoked (JTIMatcher `jti` rotation).
- Every resource request needs `Authorization: Bearer <jwt>`; else 401.
- Ownership rule: resources belong to the token owner. Controllers
  `include Ownable` (`app/controllers/concerns/ownable.rb`) — JWT auth,
  `current_user.<resources>` scoping, cross-user access → 404.
  `user_id` is never permitted from params (spoof-proof).
- Postman warning: the "Bearer Token" auth helper already prepends
  `Bearer ` — paste only the `eyJ…` part or you get `Bearer Bearer` → 401.

## Branch & commit conventions (enforced history)

- Branches: `feat/<thing>` from `main`, merged fast-forward.
  (`feat/projects`, `feat/tasks` merged; remote `origin` = GitHub.)
- Commits: Conventional Commits, **PT-BR imperative**, title ≤72 bytes,
  no scope unless module-scoped (`fix(api): …`, `docs(api): …` exist).
- Stage explicitly (`git add -- <paths>`); never `add -A`/`.`/`-a`.
- Never stage `.env*` (except `.env.example`), `*.key`,
  `api/config/master.key`, secrets, or build output; grep staged diff
  for secret patterns before committing. No `--amend`, no push unless asked.
- Migrations: show the file and ask explicitly before running
  `db:migrate`. FK order: `users` before anything referencing it.

## Key files

- `api/app/controllers/concerns/ownable.rb` — ownership/concern contract.
- `api/app/controllers/concerns/rack_sessions_fix.rb` — fake session for API mode.
- `api/config/initializers/devise.rb` — `navigational_formats = []` + JWT block
  (secret in Rails credentials as `devise_jwt_secret_key`).
- `api/config/initializers/cors.rb` — `origins "*"`, exposes `Authorization`.
- `api/README.md` — Postman-ready payloads for auth + projects (verified live).

## Known history / do-not-rediscover

- `devise_for` inside `namespace :api :v1` needs `singular: :user`,
  otherwise mapping/sanitizer/helpers scope to `:api_v1_user`. After
  changing it you must **restart the api container** (warden config runs
  once at boot; routes reload is not enough — symptom: signin 401, 0 queries).
- Devise 5 `respond_to_on_destroy` takes kwarg
  `non_navigational_status:` — overrides must accept it.
- `minio/minio` is gone from Docker Hub (404) and disabled on quay.io;
  MinIO was removed from compose. Don't re-add without a verified image.
- Resource recipe: `rails g resource` (never `scaffold` — API-only),
  UUID pk + `pgcrypto` guard for new tables, `belongs_to :user`,
  serializer, routes inside `api/v1`, `?sort=` allowlist pattern.
  Full recipe lives in the `rails-api-resource` skill.
