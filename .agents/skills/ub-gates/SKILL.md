---
name: ub-gates
description: Use after changing logic in src/domain or scripts, before declaring done. Runs the ub-mode quality tools crapper (CRAP<10), dryer (duplication<0.8) and mutator (kill survivors).
---

# ub-mode quality gates

Tools live outside the repo in `$UB_TOOLS` (default `~/tools/ub`, siblings `crapper dryer mutator`; mutator needs `../crapper`). They are Python 3.12 tools by unclebob, not npm packages.

## Install once

```sh
mkdir -p ~/tools/ub && cd ~/tools/ub
for t in crapper dryer mutator; do
  git clone --depth 1 https://github.com/unclebob/$t.git
  (cd $t && uv venv --python 3.12 .venv && uv pip install -p .venv/bin/python -e .)
done
```

The tools' own bootstrap uses the system Python (3.9 here) and fails; the `uv venv` step is required.

## Run (from repo root, Node 24)

| Check     | Command          | Pass when                               |
| --------- | ---------------- | --------------------------------------- |
| CRAP      | `pnpm ub:crap`   | every function < 10                     |
| Duplicate | `pnpm ub:dry`    | "No duplicate candidates" (score < 0.8) |
| Mutation  | `pnpm ub:mutate` | 0 survivors on files you changed        |

## Handling results

- High CRAP: split the function or test it. Not a reason to add abstractions.
- Survivor: first ask if it is an _equivalent mutant_ (e.g. `??` → `||` on always-truthy strings). If so, restructure the code so the mutation is meaningless; otherwise add a behavior test that kills it. Never write a test that only mirrors the implementation.
- Known equivalent survivors (accepted): `themes.ts` `toLinear` `<=` and `fromLinear` `<=` at the sRGB thresholds. The two branches agree at the boundary and no 8-bit channel or oklab result lands on it, so no input can tell `<=` from `<`.
- Uncovered code you cannot honestly test: delete it or leave it uncovered; do not write a fake test.
- Outputs go to `.metrics/` and `target/` (gitignored). Not run in CI: they need local tools.

Baseline (2026-10-28): max CRAP 6.0, no duplicates, mutation score 98.8% (158/160) over `src/domain` and `scripts/github.ts`; the 2 survivors are the accepted `themes.ts` ones above.
