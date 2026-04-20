# AGENTS.md

Guidance for AI coding agents (Cursor, Claude Code, Codex, etc.) working in this repo.

## What is this repo?

Goal Finch is a simple, flexible progress tracker for personal goals. This is a monorepo containing several loosely-coupled parts of the application. **Everything here is WIP.**

```
goalfinch/
├── ui/                     # React front-end (TypeScript, MUI v6, pnpm)
├── server/                 # API server (Node.js + Express, npm)
├── python/
│   ├── scripts/            # Python scripts that talk to the server
│   └── docs/               # Technical docs (mkdocs-material) — docs.goalfinch.com
├── img/                    # Static brand assets
└── README.md
```

Most development activity is in `ui/`. The `server/` is minimal and the Python side is scripts + docs.

## Ground rules

### Ask before adding tests or docs

Be conservative. We don't want exhaustive testing or sprawling documentation on this project.

- **Tests:** Think about whether a test is warranted. If yes, propose the gist of the test(s) first and wait for confirmation before implementing.
- **Docs:** Same deal — propose what you want to add/change, then wait for the go-ahead.

### Style: "Goal Finch" is two words

In any user-facing copy, docs, or UI text, always write **Goal Finch** — capitalized, with a space. Not "Goalfinch", "goalfinch", or "Goal finch".

### Explain architecture-driven choices

When a decision is informed by `python/docs/architecture/frontend.md` (or another architecture doc), explicitly say how in your response. If something in that doc looks wrong or inconsistent with the code, flag it rather than silently working around it — the docs describe the *direction*, not always the current reality.

## Working in `ui/` (the React app)

This is where most changes happen. Read this section carefully.

### Tooling

- **Package manager: `pnpm`** (version pinned via `packageManager` in `ui/package.json`). Never use `npm` or `yarn` here.
- React 19 + TypeScript 4.x, Create React App (`react-scripts`), MUI v6, Zod, react-router 6.
- ESLint config lives in `ui/eslint.config.js` and `ui/package.json`.

### Verification loop (run after every code change)

From the **repo root** (not inside `ui/`):

```bash
pnpm tsc                      # must compile cleanly
pnpm test --watchAll=false    # only after tsc passes
```

Do not `cd ui && pnpm tsc` — just `pnpm tsc` from the root works.

If `tsc` fails, fix it before running tests. If tests fail because of your change, fix them (or revert). If tests fail for reasons unrelated to your change, mention it rather than silently ignoring.

### Architecture overview

Authoritative (aspirational) doc: `python/docs/architecture/frontend.md`. Skim it before non-trivial work. Key points:

- The app is organized around a **Dashboard** made of **SlideGroups** (each containing **Slides** of a single type: `Picture`, `Chart`, `Bullets`, `Summary`).
- **Goals** are inferred from slide config (e.g. a Chart with a target, or a Bullets slide with checkboxes).
- **Connections** fetch external data/pictures. Special case: the **Goal Finch Backend (GFB)** enables extra features when configured.
- Top-level state is three singletons — `DashboardConfig`, `ConnectionsConfig`, `AppConfig` — managed by `ConfigContext` and persisted to `localStorage` (via `src/services/storage.ts`). When the GFB is enabled, state also syncs to the backend.
- Types are centralized in `src/types/` (`config.ts`, `connections.ts`, `slide_groups.ts`, `slides.ts`). Shared prop types live alongside the relevant domain type.

### Directory map for `ui/src/`

| Path | Purpose |
| --- | --- |
| `components/pages/` | Top-level route components (`Home`, `Dashboard`, `ConfigureSlides`, `ConfigureConnections`). See `pages.md`. |
| `components/slides/` | Slide view components, one per SlideType. See `slides.md`. |
| `components/editors/` | Slide/SlideGroup editor components. See `editors.md`. |
| `components/charts/` | Chart rendering (Vega / vega-lite via `react-vega`). |
| `components/__tests__/` | Shared test utilities. Component tests are generally co-located as `Component.test.tsx`. |
| `context/` | `ConfigContext`, `NotificationContext`. |
| `services/` | `storage.ts` (localStorage service), `validation.ts` (Zod schemas). |
| `schemas/` | Additional schemas for validation. |
| `types/` | Domain types. See `types.md`. |
| `theme/` | MUI theme. |

Each component subdirectory has a short markdown file (`pages.md`, `slides.md`, `editors.md`) that documents purpose, behavior, and shape of implementation. **Keep these in sync** when the components evolve meaningfully.

Design-decision records for non-obvious choices live in `ui/docs/` (e.g. `local-storage-design.md`, `testing-standards.md`).

### Testing standards (when tests are warranted)

Full details in `ui/docs/testing-standards.md`. Highlights:

- React Testing Library, user-centric queries (`getByRole`, `getByLabelText`). Avoid `getByTestId` unless needed.
- Prefer `userEvent` over `fireEvent`.
- Structure: `describe('Component', () => { describe('behavior group', () => { it('should …', …) }) })`.
- Test behavior, not implementation. Prioritize critical user flows, data mutations, error states, and navigation.
- Run with `pnpm test --watchAll=false`. Run a single file with `pnpm test ComponentName.test.tsx`.

## Working in `server/`

Minimal Express server (see `server/index.js`, `server/API.md`). Uses `npm`, not pnpm. There's no TS here; run it via `npm run dev` (nodemon) or `npm start`.

## Working in `python/`

- `python/scripts/` — Python utilities that interact with the server. Standard `requirements.txt` / `requirements-dev.txt`.
- `python/docs/` — mkdocs-material site published at docs.goalfinch.com. Architecture docs live under `python/docs/architecture/`.

## Miscellany

- Logos and brand art are in `img/`. The favicon is referenced from the React public dir.
- `netlify.toml` at the root and under `ui/` configures deployment — update both if build paths change.
- Don't commit secrets. `.gitignore` covers the usual suspects.
