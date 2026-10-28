# portfolio

Personal site for Vladyslav Herasymenko. Astro 7, Tailwind CSS v4, static output, English and Ukrainian, five themes, no framework JavaScript.
Live: https://vladyslav-herasymenko.vercel.app

## Develop

Requires Node 24 and pnpm.

```sh
pnpm install
pnpm dev            # http://localhost:4321
```

## Quality gates

| Command             | Checks                                         |
| ------------------- | ---------------------------------------------- |
| `pnpm check`        | `astro check` (strict TypeScript)              |
| `pnpm lint`         | Oxlint                                         |
| `pnpm format:check` | Oxfmt (`pnpm format` to fix)                   |
| `pnpm knip`         | Unused files, exports and dependencies         |
| `pnpm test`         | Vitest unit tests (domain logic)               |
| `pnpm test:e2e`     | Playwright + axe (WCAG 2.2 AA), desktop+mobile |
| `pnpm csp:check`    | `vercel.json` CSP matches the inline scripts   |
| `pnpm verify`       | All of the above plus the production build     |

## CI/CD

- **CI** (`.github/workflows/ci.yml`): every push and PR runs types, lint, format, knip, unit tests, build and e2e.
- **Deploy**: Vercel's Git integration builds and deploys every push to `main`.
- **Production smoke** (`production-smoke.yml`): after a production deploy succeeds, e2e runs against the live URL.
- **Ledger refresh** (`refresh-ledger.yml`): weekly, re-reads PR states from GitHub, verifies tests and build, commits `src/data/ledger.json`, which triggers a redeploy. Run locally with `pnpm ledger:refresh`.
- **Dependabot** keeps npm packages and Actions current (Actions are pinned by commit SHA; updates arrive grouped).

## Content

Experience comes from the CV; every visible string has an `en` and a `uk` value (`src/i18n`, `src/data/profile.ts`, ledger notes). Themes are defined once in `src/domain/themes.ts`, which generates the CSS and is contrast-tested. Open-source rows live in `src/data/ledger.json` and are validated at build time by `src/domain/contributions.ts`.

## Licence

Source code: MIT (`LICENSE`). The text, CV and profile data are not licensed for reuse.
