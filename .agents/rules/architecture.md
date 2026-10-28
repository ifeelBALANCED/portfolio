# Architecture

Read when touching `src/`, `scripts/`, build config or toolchain versions.

## Layers

- `src/data/*.json|ts`: content only. JSON is parsed at the boundary (`src/data/ledger.ts` calls `parseLedger`), so malformed data fails the build. Why: illegal states cannot reach the page.
- `src/domain/`: pure functions and types, no I/O, no Astro imports. All logic worth testing lives here.
- `src/pages/index.astro` (English, `/`) and `src/pages/uk/index.astro` (`/uk/`) both render `src/components/Home.astro`; presentation only, no business logic. Astro `i18n` has `prefixDefaultLocale: false`.
- `src/i18n/{en,uk}.ts`: UI strings; `uk` is typed as `Dictionary` so a missing key fails `astro check`. Content that is prose (jobs, projects, ledger notes) carries `Localized<T>` = `{ en, uk }` and is validated or typed. Proper names (PR titles, repos, employers) stay English.
- `scripts/`: I/O shells (GitHub API, file writes). Inject `fetch` so they stay testable; keep the entry file as thin wiring.

## Toolchain constraints (each one broke a build once)

- Node **24** (`.nvmrc`, `engines`). Astro 7 needs Node ≥22.23.4 and Vercel does not offer that on 22.x.
- TypeScript **6**, not 7: `astro check` rejects TS 7.
- `pnpm` version is pinned by `packageManager`; CI's `pnpm/action-setup` fails without it.
- Playwright starts `astro preview --ignore-lock`: Astro 7 preview uses a lockfile and refuses a second instance.
- `tailwindcss` is only referenced from CSS, so knip lists it in `ignoreDependencies`. Font packages are picked up through the `?url` preload imports in `Base.astro`.
- Scripts import `.ts` extensions directly (Node type stripping); `tsconfig` sets `allowImportingTsExtensions`.
- Environment: read only through `readEnv` in `src/domain/env.ts` (validated, typed, blank means unset); no other `process.env`. Every variable is optional and listed in `.env.example`. Secrets exist for CI and scripts only (`GITHUB_TOKEN`, optional `LEDGER_TOKEN`); the static output carries none, and a new one needs a stated reason.

## Domain vocabulary

Ledger = the list of PRs shown in "Open source". Status ∈ `merged | open | closed` (closed = closed unmerged). Snapshot = date the statuses were last read from GitHub.
