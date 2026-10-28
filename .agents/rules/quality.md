# Quality

Read before committing, and when adding tests, CI or dependencies.

## Gates (`pnpm verify` runs all)

`check` (astro check) → `lint` (oxlint) → `format:check` (oxfmt) → `knip` → `test` (vitest) → `build` → `test:e2e` (playwright + axe, desktop + mobile projects). CI (`.github/workflows/ci.yml`) runs the same.

## Testing

- Unit tests target `src/domain` and `scripts/github.ts` through their public functions. E2E asserts what a visitor sees (metadata, nav, links, a11y), not markup details.
- Fix a bug by first adding a test that reproduces it.
- Test code runs `pageerror` as failure; do not swallow console errors.
- Oxlint forbids `no-console` except in `scripts/`; `any` and ts-comments are errors. Do not suppress, fix the cause.

## Dependencies

Add one only with a justification here or in `DECISIONS.md`. Current justified set: Astro; two font packages; oxlint, oxfmt, knip; vitest + `@vitest/coverage-v8` (crapper needs coverage); Playwright + `@axe-core/playwright` (WCAG gate).

## Delivery

- Push to `main` → Vercel deploys → `production-smoke.yml` reruns e2e against the live URL.
- `refresh-ledger.yml` (weekly) commits `src/data/ledger.json` itself; never hand-edit the `snapshot` date, use `pnpm ledger:refresh`.
- Dependabot PRs must pass CI before merge.
