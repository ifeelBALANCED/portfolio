# portfolio

Static Astro 7 personal site for Vladyslav Herasymenko (Senior Frontend Engineer, Kyiv).
Live: https://vladyslav-herasymenko.vercel.app · deploys from `main` via Vercel Git integration.

AGENTS.md is an index: it says what to read, not everything to know. `CLAUDE.md` is a symlink to this file.

## Read before you change anything

| File                                                   | Read when                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------- |
| [rules/architecture.md](.agents/rules/architecture.md) | touching `src/`, `scripts/`, config, Node/Astro/TypeScript versions |
| [rules/content.md](.agents/rules/content.md)           | adding or editing any text, number, link, contact or PR status      |
| [rules/ui.md](.agents/rules/ui.md)                     | touching styles, markup, fonts, colors or motion                    |
| [rules/quality.md](.agents/rules/quality.md)           | before committing; adding tests, CI or dependencies                 |

| Skill                                                  | Use when                                              |
| ------------------------------------------------------ | ----------------------------------------------------- |
| [update-ledger](.agents/skills/update-ledger/SKILL.md) | a PR was opened, merged or closed; adding a repo row  |
| [ub-gates](.agents/skills/ub-gates/SKILL.md)           | finishing a code change (CRAP, duplication, mutation) |

## Non-negotiable

- Never invent experience, metrics, skills or PR outcomes. Source is the CV (`public/Vladyslav_Herasymenko_CV.pdf`) and live GitHub state. Missing input: flag it.
- Static output, zero client JavaScript unless a feature cannot work without it.
- Change behavior test-first. `pnpm verify` must pass before any push to `main`.
- Commits: Conventional Commits, one line, no body, no trailers.

## Workflow

1. Name the affected area; read only the matching rule rows above.
2. Read the existing code and copy its patterns (data in `src/data`, logic in `src/domain`, markup in `src/pages`).
3. Write the failing test, see it fail for the expected reason, then make the smallest change.
4. Run `pnpm verify`; for logic changes also run the `ub-gates` skill.
5. If the task taught something a future agent would get wrong, update the one rule file that owns it.

## Keeping this system current

Update a rule when architecture changes, a project-wide convention is set, an agent repeats a mistake, or a library has a non-obvious local constraint. Do not record one-off fixes, debugging notes or history (history lives in `DECISIONS.md`). A rule that became false is fixed or deleted in the same change. Each fact lives in exactly one file.
