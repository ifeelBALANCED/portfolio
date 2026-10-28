# Architecture

Read when touching `src/`, `scripts/`, build config or toolchain versions.

## Layers

- `src/data/*.json|ts`: content only. JSON is parsed at the boundary (`src/data/ledger.ts` calls `parseLedger`), so malformed data fails the build. Why: illegal states cannot reach the page.
- `src/domain/`: pure functions and types, no I/O, no Astro imports. All logic worth testing lives here.
- `src/pages/index.astro`: single page; presentation only, no business logic.
- `scripts/`: I/O shells (GitHub API, file writes). Inject `fetch` so they stay testable; keep the entry file as thin wiring.

## Toolchain constraints (each one broke a build once)

- Node **24** (`.nvmrc`, `engines`). Astro 7 needs Node ≥22.23.4 and Vercel does not offer that on 22.x.
- TypeScript **6**, not 7: `astro check` rejects TS 7.
- `pnpm` version is pinned by `packageManager`; CI's `pnpm/action-setup` fails without it.
- Playwright starts `astro preview --ignore-lock`: Astro 7 preview uses a lockfile and refuses a second instance.
- Fonts are CSS `@import`s, invisible to knip; they are listed in `knip.json` `ignoreDependencies`. Keep that list in sync if fonts change.
- Scripts import `.ts` extensions directly (Node type stripping); `tsconfig` sets `allowImportingTsExtensions`.

## Domain vocabulary

Ledger = the list of PRs shown in "Open source". Status ∈ `merged | open | closed` (closed = closed unmerged). Snapshot = date the statuses were last read from GitHub.
