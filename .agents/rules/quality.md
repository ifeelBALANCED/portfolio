# Quality

Read before committing, and when adding tests, CI or dependencies.

## Gates (`pnpm verify` runs all)

`check` (astro check) → `lint` (oxlint) → `format:check` (oxfmt) → `knip` → `test:coverage` (vitest, 100% floor) → `build` → `csp:check` → `test:e2e` (playwright + axe, desktop + mobile projects). CI (`.github/workflows/ci.yml`) runs the same.

## Headers and CSP

`vercel.json` carries the security headers, including a Content-Security-Policy whose `script-src` lists the SHA-256 of every inline script in `dist`. Change an inline script (theme script, toolbar script) and `pnpm csp:check` fails until `pnpm csp:sync` rewrites the policy; commit `vercel.json` with the change. `astro preview` does not apply these headers: a CSP mistake only shows on the live URL, where the `@smoke` header test and the `errors` fixture (CSP violations log `console.error`) catch it. Vite inlines small fonts as `data:` URIs, hence `font-src 'self' data:`.

## Testing

- Unit tests target `src/domain` and `scripts/github.ts` through their public functions; `vitest.config.ts` holds the coverage scope and a 100% floor on it. External boundaries are injected (`fetch`), never module-mocked; doubles live in `tests/support/`. `node-entrypoints.test.ts` loads the script modules under plain Node, because Vitest resolves extensionless imports and Node does not: relative imports in `src/domain` and `scripts` carry `.ts`.
- E2E asserts what a visitor sees (metadata, nav, links, a11y), not markup details. Import `test`/`expect` from `tests/e2e/fixtures.ts`: `site` (locale), `storedTheme` and `home` fixtures, plus an automatic `errors` fixture that fails any test on a page error or `console.error`. Counts that come from `ledger.json` are read from the page, never hard-coded: the weekly refresh changes them.
- Tests tagged `@smoke` are what `production-smoke.yml` runs against the live URL (desktop project only). The full suite runs in `ci.yml` and `refresh-ledger.yml` before a push.
- `playwright.config.ts`: CI gets `forbidOnly`, one retry, two workers and an HTML report; traces and screenshots are kept on failure. `test:e2e` serves the existing `dist`, so run `pnpm build` first (verify and CI do).
- Fix a bug by first adding a test that reproduces it.
- Oxlint forbids `no-console` except in `scripts/`; `any` and ts-comments are errors. Do not suppress, fix the cause.

## Dependencies

Add one only with a justification here or in `DECISIONS.md`. Current justified set: Astro; Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`); two font packages (Onest, JetBrains Mono, both with Cyrillic); oxlint, oxfmt, knip; vitest + `@vitest/coverage-v8` (crapper needs coverage); Playwright + `@axe-core/playwright` (WCAG gate).

## Delivery

- Push to `main` → Vercel deploys → `production-smoke.yml` reruns e2e against the live URL.
- `refresh-ledger.yml` (weekly) commits `src/data/ledger.json` itself; never hand-edit the `snapshot` date, use `pnpm ledger:refresh`.
- Dependabot PRs must pass CI before merge.
