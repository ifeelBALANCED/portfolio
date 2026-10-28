import { describe, expect, it } from 'vitest';
import {
  applyStatuses,
  parseLedger,
  pullRequestUrl,
  statusFromGitHub,
  tally,
} from '../../src/domain/contributions';

const valid = {
  snapshot: '2026-10-28',
  repos: [
    {
      repo: 'TanStack/db',
      stack: 'TypeScript',
      pullRequests: [
        { number: 1745, title: 'Prevent ReDoS', status: 'merged', note: 'n' },
        { number: 1746, title: 'Key index', status: 'closed', note: 'n' },
      ],
    },
  ],
};

describe('pullRequestUrl', () => {
  it('links to the pull request on GitHub', () => {
    expect(pullRequestUrl('TanStack/db', 1745)).toBe('https://github.com/TanStack/db/pull/1745');
  });
});

describe('parseLedger', () => {
  it('accepts well-formed data', () => {
    const ledger = parseLedger(valid);
    expect(ledger.snapshot).toBe('2026-10-28');
    expect(ledger.repos[0]?.pullRequests).toHaveLength(2);
  });

  it('rejects an unknown status', () => {
    const bad = structuredClone(valid);
    bad.repos[0]!.pullRequests[0]!.status = 'approved';
    expect(() => parseLedger(bad)).toThrow(/status/);
  });

  it('rejects a repo that is not owner/name', () => {
    const bad = structuredClone(valid);
    bad.repos[0]!.repo = 'db';
    expect(() => parseLedger(bad)).toThrow(/repo/);
  });

  it('rejects duplicate pull request numbers within a repo', () => {
    const bad = structuredClone(valid);
    bad.repos[0]!.pullRequests[1]!.number = 1745;
    expect(() => parseLedger(bad)).toThrow(/duplicate/);
  });

  it('rejects a snapshot that is not an ISO date', () => {
    expect(() => parseLedger({ ...valid, snapshot: 'yesterday' })).toThrow(/snapshot/);
  });

  it('rejects non-object input', () => {
    expect(() => parseLedger(null)).toThrow();
  });
});

describe('tally', () => {
  it('counts pull requests by status across repos', () => {
    expect(tally(parseLedger(valid).repos)).toEqual({ merged: 1, open: 0, closed: 1 });
  });
});

describe('statusFromGitHub', () => {
  it('maps GitHub pull request state to a ledger status', () => {
    expect(statusFromGitHub({ state: 'open', merged: false })).toBe('open');
    expect(statusFromGitHub({ state: 'closed', merged: true })).toBe('merged');
    expect(statusFromGitHub({ state: 'closed', merged: false })).toBe('closed');
  });
});

describe('applyStatuses', () => {
  const ledger = parseLedger(valid);

  it('updates statuses and the snapshot date without mutating the input', () => {
    const next = applyStatuses(
      ledger,
      new Map([['TanStack/db#1746', 'merged' as const]]),
      '2026-11-01',
    );
    expect(next.snapshot).toBe('2026-11-01');
    expect(next.repos[0]?.pullRequests.map((pr) => pr.status)).toEqual(['merged', 'merged']);
    expect(ledger.repos[0]?.pullRequests[1]?.status).toBe('closed');
  });

  it('keeps the snapshot date when nothing changed', () => {
    const next = applyStatuses(ledger, new Map(), '2026-11-01');
    expect(next).toEqual(ledger);
  });
});
