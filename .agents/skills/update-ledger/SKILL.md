---
name: update-ledger
description: Use when an open-source PR was opened, merged or closed, or a new repo should appear in the portfolio's Open source ledger.
---

# Update the open-source ledger

Data: `src/data/ledger.json` (validated by `parseLedger` in `src/domain/contributions.ts`).

## Status changed

1. `GITHUB_TOKEN=$(gh auth token) pnpm ledger:refresh` — reads every PR from GitHub, rewrites statuses and `snapshot`.
2. `pnpm verify`.
3. Commit: `chore: refresh pull request ledger`.

## New PR or repo

1. Fetch real facts first: `gh pr view <n> -R <owner/repo> --json title,state,mergedAt,body`.
2. Add the row (`number`, short `title`, `status`, one-sentence `note` as `{ "en": ..., "uk": ... }` using only claims from the PR; the build fails without both). New repo: add `{ repo: "owner/name", stack, pullRequests: [...] }`.
3. Run `pnpm test` — a malformed row fails with `Invalid ledger: …`.
4. `pnpm ledger:refresh` to sync statuses, then `pnpm verify`.
5. Commit: `feat: add <repo> PR #<n> to ledger`.

Rules: closed-unmerged PRs stay listed as `closed`. Never state an outcome the PR did not achieve. See `.agents/rules/content.md`.
