# server/AGENTS.md

Guidance for AI coding agents working in `server/`. Read the root `AGENTS.md` first — this file only covers things specific to the server.

## What this is

`server/` is the **Goal Finch Backend (GFB)** — the optional self-hosted API referenced from the frontend architecture docs (`python/docs/architecture/deployment-patterns.md`). Most Goal Finch users run the app purely in-browser against `localStorage`; the GFB is the "self-hosted" deployment path that unlocks cross-device sync, automated stat ingestion via API, and long-term history.

It is intentionally minimal. The whole app is one file (`index.js`) plus docs. There is no ORM, no router module, no controller/service layering, no build step. Keep it that way unless there is a real reason to grow it.

## Stack and tooling

- **Runtime:** Node.js + Express 4.
- **Package manager:** `npm` (not pnpm — pnpm is only for `ui/`). Use `npm install`, commit `package-lock.json`.
- **Scripts:**
  - `npm start` — `node index.js`
  - `npm run dev` — `nodemon index.js`
  - `npm test` — runs `test.js` (see caveats below)
- **Language:** Plain JavaScript (CommonJS `require`). No TypeScript, no transpile.
- **Key deps:** `express`, `mongodb` (official driver, not Mongoose), `jsonwebtoken`, `bcryptjs`, `json2csv`, `dotenv`, `body-parser`.

## Required configuration

The server refuses to start without these env vars (each triggers `process.exit(1)`):

- `MONGODB_URI` — full MongoDB connection string.
- `JWT_SECRET` — secret for signing/verifying JWTs.

Optional:

- `PORT` — defaults to `3003`.

`.env.example` only lists `MONGODB_URI`; `JWT_SECRET` is required too. If you edit configuration, update `.env.example` to match.

## Data model

Two MongoDB collections in database `niblingsDb` (legacy name from before the Goal Finch rename — see "Known inconsistencies"):

### `users`
```
{ username: string, password: string (bcrypt hash, 10 salt rounds), created_at: ISO string }
```

### `events`
```
{
  id: string (UUID, server-generated via crypto.randomUUID),
  event_type: string,          // required, a slug like "family_dinner"
  title: string | null,
  start_ts: string | null,     // ISO 8601
  end_ts: string,              // required, ISO 8601
  created_at_ts: string,       // see bug note below
  payload: object              // free-form per event_type
}
```

The `events` schema is deliberately generic: `event_type` is just a string and `payload` is an arbitrary JSON blob. The server does not know anything about specific event types — that contract lives with the clients (UI + `python/scripts/`). Do not add `event_type`-specific validation or endpoints to the server; keep it a dumb generic event store.

## API surface

See `API.md` for request/response shapes. Endpoints:

- `POST /api/register` — public; creates user, returns JWT.
- `POST /api/login` — public; returns JWT.
- `POST /api/events` — **auth required**; insert one event.
- `GET /api/events` — **auth required**; returns every event.
- `GET /api/events/:eventType` — **auth required**; returns events of that type, filtered by `year`+`month` query params (defaults to the last month window). If `csv=true`, returns CSV with `payload_*`-prefixed columns instead of JSON.

Auth is a Bearer JWT in `Authorization: Bearer <token>`, verified by the `authenticateToken` middleware. Tokens expire in 24h and carry only `{ username }` — no roles, no refresh flow.

## Architectural decisions worth knowing

- **One-file app, on purpose.** Route handlers, middleware, and Mongo access all live in `index.js`. Don't split it into `routes/`, `controllers/`, etc. unless the file has grown past what one person can hold in their head.
- **Mongo via the official driver, not Mongoose.** There is no schema enforcement at the DB layer — validation is ad-hoc in each handler. If validation grows, reach for Zod (already used in `ui/`) before adding Mongoose.
- **Schemaless `payload`.** Event-type-specific structure is a client concern. Resist pressure to move that knowledge server-side.
- **No per-user scoping on events.** All authenticated users can read and write all events in the collection. This is a real limitation (effectively single-tenant-per-deployment), not an oversight in the docs — the GFB is currently designed to be self-hosted by one user/household. If we ever need multi-tenant, `events` needs a `username`/`user_id` field and every query has to be scoped. Flag this before building features that assume isolation.
- **Single `MongoClient` per process, lazy getters.** `getEventsCollection()` / `getUsersCollection()` are called per request to always resolve against the live client. Preserve this pattern — don't cache collection handles at module load.
- **Graceful shutdown on SIGINT** closes the Mongo client. If you add long-lived resources, hook them into the same handler.
- **Security posture is minimal.** No rate limiting, no CORS config, no helmet, no refresh tokens, no password strength checks, no account lockout. Acceptable for a self-hosted single-user deployment; do not assume it's production-hardened for a public multi-user service.
- **CSV is opt-in per request.** `?csv=true` flattens `payload` into `payload_<key>` columns. Keep that prefix convention if you extend it — downstream scripts in `python/scripts/` likely rely on it.

## Known inconsistencies (do not "fix" silently)

These are documented here so agents recognize them as known rather than rediscovering them each time. Flag them to the user before changing:

1. **`niblings*` naming** (`niblingsDb`, `niblings-server`, `Niblings App API Documentation`) predates the Goal Finch rename. Renaming the Mongo database is a data-migration task, not a find/replace.
2. **`created_at_ts` is hard-coded** to the literal string `'2024-12-29T22:19:47-07:00'` on every new event. Almost certainly a bug — it should be `new Date().toISOString()`. Existing documents in production may have this stamp.
3. **`API.md` is out of date:**
   - Claims events are stored in memory and cleared on restart. They aren't — they're in MongoDB.
   - Omits `/api/register` and `/api/login` entirely.
   - Doesn't mention that event endpoints require a Bearer token.
4. **`test.js` is stale.** It points at `http://localhost:3001` (server defaults to `3003`) and sends no `Authorization` header, so it will fail against the current server. Treat it as a sketch, not a test suite. There is no real automated test coverage for the server.

## Working rules specific to `server/`

- Follow the root `AGENTS.md` ground rules — especially "ask before adding tests or docs." The server has ~zero tests today; don't spin up a test framework on a whim. Propose first.
- When you touch an endpoint's contract, update `API.md` in the same change.
- Don't introduce a second package manager, a build step, or TypeScript here without explicit agreement.
- Never commit `.env`. `.gitignore` already covers it.
