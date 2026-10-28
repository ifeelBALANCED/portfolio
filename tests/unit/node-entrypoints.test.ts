import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

// Vitest resolves extensionless imports, plain Node does not. `pnpm ledger:refresh` runs the
// scripts under Node's type stripping, so every module they reach must load there.
describe('modules reached by scripts/refresh-ledger.ts', () => {
  it.each(['./scripts/github.ts', './src/domain/contributions.ts'])(
    'load under plain Node: %s',
    (entry) => {
      const run = () =>
        execFileSync(process.execPath, ['--input-type=module', '-e', `await import('${entry}')`], {
          cwd: process.cwd(),
          stdio: 'pipe',
        });
      expect(run).not.toThrow();
    },
  );
});
