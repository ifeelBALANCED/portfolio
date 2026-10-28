import { readFileSync, writeFileSync } from 'node:fs';
import {
  applyStatuses,
  parseLedger,
  statusFromGitHub,
  type PullRequestStatus,
} from '../src/domain/contributions.ts';

const LEDGER_PATH = new URL('../src/data/ledger.json', import.meta.url);
const token = process.env.GITHUB_TOKEN;

const fetchStatus = async (repo: string, number: number): Promise<PullRequestStatus> => {
  const response = await fetch(`https://api.github.com/repos/${repo}/pulls/${number}`, {
    headers: {
      accept: 'application/vnd.github+json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) throw new Error(`${repo}#${number}: GitHub answered ${response.status}`);
  const body = (await response.json()) as { state: string; merged: boolean };
  return statusFromGitHub(body);
};

const ledger = parseLedger(JSON.parse(readFileSync(LEDGER_PATH, 'utf8')));
const states = new Map<string, PullRequestStatus>();
for (const { repo, pullRequests } of ledger.repos) {
  for (const { number } of pullRequests)
    states.set(`${repo}#${number}`, await fetchStatus(repo, number));
}

const next = applyStatuses(ledger, states, new Date().toISOString().slice(0, 10));
if (next === ledger) {
  console.info('Ledger already up to date.');
} else {
  writeFileSync(LEDGER_PATH, `${JSON.stringify(next, null, 2)}\n`);
  console.info(`Ledger updated, snapshot ${next.snapshot}.`);
}
