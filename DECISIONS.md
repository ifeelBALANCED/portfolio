# Decisions

Newest first. Rules in `.agents/rules/` hold current truth; this file holds why, including rejected options.

## 2026-10-28 Agent infrastructure

- Chose: `AGENTS.md` index + 4 rules + 2 project skills; `CLAUDE.md` symlink; `.claude/skills` symlink to `.agents/skills`.
- Rejected: third-party skills from AutoSkills dry-run (astro, typescript-advanced-types, playwright-best-practices, vitest, oxlint, deploy-to-vercel, frontend-design, accessibility, seo, nodejs-*). Installed `astrolicious/astro`, read it, removed it: generic, inferable, and recommends SSR adapters this static site must not use. Others restate docs or cover tech this repo barely uses (no backend; axe already enforces a11y; 27 small tests).
- Rejected: `.agents/references/`. No material is large enough to justify a separate load tier.
- Could not read the Conar `tamery` branch (404); structure follows the task brief.

## 2026-10-28 Ledger as validated data

- Statuses live in JSON parsed at build time; a weekly workflow refreshes them. Rejected: build-time GitHub fetch (rate limits, flaky builds) and hand-maintained TS data (drifts).

## 2026-10-28 Deploy via Vercel Git integration

- Rejected: GitHub Action deploy with `VERCEL_TOKEN` (would copy a personal session token into repo secrets). CI gates PRs; a smoke workflow tests production after deploy.

## 2026-10-28 Node 24, TypeScript 6

- Astro 7 requires Node ≥22.23.4 (Vercel's 22.x is older); `astro check` rejects TypeScript 7.
