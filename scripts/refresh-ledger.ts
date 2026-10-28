import { readFileSync, writeFileSync } from 'node:fs';
import { applyStatuses, parseLedger, type PullRequestStatus } from '../src/domain/contributions.ts';
import { readEnv } from '../src/domain/env.ts';
import { fetchStatus } from './github.ts';

const LEDGER_PATH = new URL('../src/data/ledger.json', import.meta.url);
const options = { fetch, token: readEnv(process.env).githubToken };

const ledger = parseLedger(JSON.parse(readFileSync(LEDGER_PATH, 'utf8')));
const states = new Map<string, PullRequestStatus>();
for (const { repo, pullRequests } of ledger.repos) {
  for (const { number } of pullRequests) {
    states.set(`${repo}#${number}`, await fetchStatus(repo, number, options));
  }
}

const next = applyStatuses(ledger, states, new Date().toISOString().slice(0, 10));
if (next === ledger) {
  console.info('Ledger already up to date.');
} else {
  writeFileSync(LEDGER_PATH, `${JSON.stringify(next, null, 2)}\n`);
  console.info(`Ledger updated, snapshot ${next.snapshot}.`);
}
