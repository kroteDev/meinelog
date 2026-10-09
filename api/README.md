# Meinelog AI — API

Rails 8.1 API-only backend. Ruby 3.4 (`ruby:3.4-slim` Docker image),
PostgreSQL 17, authentication via Devise + JWT (`devise-jwt`,
JTIMatcher revocation, 30-minute token expiry), JSON serialization
with `jsonapi-serializer`.

## Models

- **User** (`bigint` id) — Devise fields plus `first_name` (required),
  `last_name` (required), `sex` (enum: `male`, `female`, `other`),
  `active` (boolean, default `false`), `jti` (required, unique —
  powers JWT revocation). `has_many :projects, dependent: :destroy`.
- **Project** (`uuid` id, `gen_random_uuid()`) — `name` (required),
  `description` (required), `belongs_to :user`.

## Running (from repo root)

```bash
cp .env.example .env   # once, then fill in real values
docker compose up -d --build
docker compose exec api bundle exec rails db:prepare
```

Base URL (dev defaults): `http://localhost:5000`

## Auth flow

1. Sign up (or log in) to receive a token in the **`Authorization`
   response header**: `Authorization: Bearer <jwt>`.
2. Send it back on every authenticated request:
   `Authorization: Bearer <jwt>`.
3. Log out (`DELETE /api/v1/logout`) revokes the token — reusing it
   returns `401`.

## Endpoint examples (Postman-ready)

### Sign up — `POST /api/v1/signup`

```http
POST http://localhost:5000/api/v1/signup
Content-Type: application/json
```

```json
{
  "user": {
    "email": "maria@example.com",
    "password": "SenhaSegura123",
    "password_confirmation": "SenhaSegura123",
    "first_name": "Maria",
    "last_name": "Silva",
    "sex": "female"
  }
}
```

Success `200`:

```json
{
  "status": { "code": 200, "message": "Signed up successfully." },
  "data": {
    "id": "1",
    "email": "maria@example.com",
    "first_name": "Maria",
    "last_name": "Silva",
    "sex": "female",
    "active": false
  }
}
```

### Log in — `POST /api/v1/login`

```http
POST http://localhost:5000/api/v1/login
Content-Type: application/json
```

```json
{
  "user": {
    "email": "maria@example.com",
    "password": "SenhaSegura123"
  }
}
```

Success `200` — same shape as sign up, plus the
`Authorization: Bearer <jwt>` response header.
In Postman, save it as a collection variable (e.g. `{{jwt}}`)
and use `Authorization: Bearer {{jwt}}` on the next requests.

### Log out — `DELETE /api/v1/logout`

```http
DELETE http://localhost:5000/api/v1/logout
Authorization: Bearer {{jwt}}
```

Success `200`: `{ "status": { "code": 200, "message": "Logged out successfully." } }`

### Projects (all require `Authorization: Bearer {{jwt}}`)

```http
POST http://localhost:5000/api/v1/projects
Content-Type: application/json
Authorization: Bearer {{jwt}}
```

```json
{
  "project": {
    "name": "Meu primeiro projeto",
    "description": "Criado via API com token JWT"
  }
}
```

```http
GET http://localhost:5000/api/v1/projects
GET http://localhost:5000/api/v1/projects?sort=name
GET http://localhost:5000/api/v1/projects?sort=-created_at
GET http://localhost:5000/api/v1/projects/:id
PATCH http://localhost:5000/api/v1/projects/:id
DELETE http://localhost:5000/api/v1/projects/:id
```

Sortable fields: `name`, `created_at`, `updated_at` (`-` prefix =
descending, default `created_at` descending). Projects are always
scoped to the logged-in user (`user_id` is never accepted from params).
`DELETE` returns `204 No Content`. Missing/invalid/revoked token
returns `401`.

## Useful commands

```bash
docker compose exec api bundle exec rails routes
docker compose exec api bundle exec rails console
docker compose exec api bundle exec rails db:migrate
docker compose exec postgres psql -U ${DATABASE_USER} -d ${DATABASE_NAME}_development
```
