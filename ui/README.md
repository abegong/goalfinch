# Goal Finch UI

The Goal Finch dashboard: a React + TypeScript single-page app built with
Vite, tested with Vitest, and routed with TanStack Router.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) (the repo pins a version via `packageManager` in
  `package.json`; Corepack will pick it up automatically)

## Setup

```bash
pnpm install
```

## Scripts

All scripts are run from this directory (`ui/`).

| Script              | What it does                                            |
| ------------------- | ------------------------------------------------------- |
| `pnpm dev`          | Start the Vite dev server on <http://localhost:3000>    |
| `pnpm build`        | Type-check (`tsc --noEmit`) then produce a prod bundle in `dist/` |
| `pnpm preview`      | Serve the built `dist/` output locally                  |
| `pnpm test`         | Run Vitest in watch mode                                |
| `pnpm test:ci`      | Run Vitest once (for CI)                                |
| `pnpm typecheck`    | `tsc --noEmit`                                          |
| `pnpm lint`         | ESLint flat config, type-aware                          |
| `pnpm lint:fix`     | ESLint with `--fix`                                     |

`pnpm start` is aliased to `pnpm dev` for muscle memory.

## Project layout

```
src/
  components/   React components (pages, slides, editors, etc.)
  context/      React contexts (config, notifications, layout)
  services/     Cross-cutting services (localStorage, validation)
  types/        Shared TypeScript types
  utils/        Pure helpers (chart data prep, etc.)
  router.tsx    TanStack Router route tree
  App.tsx       RouterProvider host
  index.tsx     Root mount
  setupTests.ts Vitest global setup (jest-dom matchers, mocks, polyfills)
```

## Testing

- Framework: [Vitest](https://vitest.dev/) with
  [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
  and `@testing-library/jest-dom` matchers.
- Environment: `jsdom`.
- See `docs/testing-standards.md` for conventions.

## Linting and type checking

- ESLint 9 flat config (`eslint.config.js`) with `typescript-eslint`
  `strictTypeChecked` + `stylisticTypeChecked`, plus `react`, `react-hooks`,
  `jsx-a11y`, `@vitest/eslint-plugin`, and `eslint-plugin-testing-library`.
- TypeScript is configured `strict` with `noUncheckedIndexedAccess` and
  `noImplicitOverride` enabled; see `tsconfig.json`.

## Deployment

Build output lives in `dist/`. Netlify settings are in `netlify.toml`.
