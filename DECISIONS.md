# Decisions

Newest first. Rules in `.agents/rules/` hold current truth; this file holds why, including rejected options.

## 2026-10-28 "Changeset" redesign, i18n, themes

- Chose: three independent art directions (Broadsheet, Changeset, Strata) judged on wow, recruiter credibility, WCAG feasibility, Tailwind fit and Cyrillic. Changeset won: the real PRs are the hero, drawn as diff hunks, above the fold. Grafted from the others: the `@property` colour crossfade, `:has()` filtering, press feedback.
- Chose: five themes (Paper, Graphite, Blueprint, Meter, Lab) from one typed source, contrast-tested including status colours on row tints (oklab mix, same as `color-mix`). Axe runs for every theme × locale × viewport.
- Chose: `/` English, `/uk/` Ukrainian (default locale unprefixed). Rejected: a `/` that redirects on `navigator.language` (second hop, flash, harder to link).
- Chose: Onest + JetBrains Mono. Rejected for lacking Cyrillic in their Fontsource builds: Instrument Serif, Fraunces, Newsreader, Space Grotesk, Bricolage Grotesque; Playfair rejected as a heavy third family. Fallback `size-adjust` values were computed from the real font files with capsize.
- Rejected: dimming filtered rows with opacity (text fell to 1.84:1), fading text in the scroll sweep, `startViewTransition` for themes (blocks input, not interruptible), 3D "Strata" plates, `backdrop-filter`.
- Rejected after trying: cross-document view transitions for language switch (`InvalidStateError` in Chromium; Firefox lacks them anyway).
- Title changed from "Senior Frontend Engineer" to "Frontend engineer" everywhere (copy, JSON-LD, OG image, rules).

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
