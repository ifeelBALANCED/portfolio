import { describe, expect, it } from 'vitest';
import {
  applyStatuses,
  orderLedger,
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
        { number: 1745, title: 'Prevent ReDoS', status: 'merged', note: { en: 'n', uk: 'н' } },
        { number: 1746, title: 'Key index', status: 'closed', note: { en: 'n', uk: 'н' } },
      ],
    },
  ],
};

const pr = (override: Record<string, unknown>) => ({
  ...valid,
  repos: [
    {
      ...valid.repos[0],
      pullRequests: [
        { number: 1, title: 't', status: 'open', note: { en: 'n', uk: 'н' }, ...override },
      ],
    },
  ],
});

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

  it.each([
    [
      'a repo entry that is not an object',
      { ...valid, repos: ['x'] },
      /repo entry must be an object/,
    ],
    [
      'a repo without pull requests',
      { ...valid, repos: [{ ...valid.repos[0], pullRequests: [] }] },
      /needs at least one pull request/,
    ],
    ['repos that are not an array', { ...valid, repos: {} }, /repos must be an array/],
    [
      'a pull request that is not an object',
      { ...valid, repos: [{ ...valid.repos[0], pullRequests: [1] }] },
      /pull request must be an object/,
    ],
    ['a non-integer pull request number', pr({ number: 1.5 }), /positive integer/],
    ['a zero pull request number', pr({ number: 0 }), /positive integer/],
    ['an empty title', pr({ title: '' }), /title must be a non-empty string/],
    ['a missing note', pr({ note: undefined }), /note must be an object/],
    ['a note without a Ukrainian text', pr({ note: { en: 'n' } }), /note\.uk must be a non-empty/],
    ['an empty localized note', pr({ note: { en: 'n', uk: '' } }), /note\.uk must be a non-empty/],
  ])('rejects %s', (_label, input, message) => {
    expect(() => parseLedger(input)).toThrow(message);
  });

  it.each([[null], [[]], ['text'], [42]])('rejects %j as the whole ledger', (input) => {
    expect(() => parseLedger(input)).toThrow(/Invalid ledger: expected an object/);
  });

  it('accepts pull request number 1', () => {
    expect(parseLedger(pr({ number: 1 })).repos[0]?.pullRequests[0]?.number).toBe(1);
  });
});

describe('tally', () => {
  it('counts pull requests by status across repos', () => {
    const note = { en: 'n', uk: 'н' };
    const repos = [
      {
        repo: 'a/b',
        stack: 's',
        pullRequests: [
          { number: 1, title: 't', status: 'open' as const, note },
          { number: 2, title: 't', status: 'open' as const, note },
          { number: 3, title: 't', status: 'merged' as const, note },
        ],
      },
      {
        repo: 'c/d',
        stack: 's',
        pullRequests: [{ number: 1, title: 't', status: 'closed' as const, note }],
      },
    ];
    expect(tally(repos)).toEqual({ merged: 1, open: 2, closed: 1 });
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
    expect(next.repos[0]?.pullRequests.map((item) => item.status)).toEqual(['merged', 'merged']);
    expect(ledger.repos[0]?.pullRequests[1]?.status).toBe('closed');
  });

  // refresh-ledger.ts skips the write when it gets the very same object back.
  it.each([
    ['no answers', new Map<string, 'merged'>()],
    ['an answer equal to the current status', new Map([['TanStack/db#1745', 'merged' as const]])],
    [
      'an answer for a pull request that is not listed',
      new Map([['TanStack/db#9', 'open' as const]]),
    ],
  ])('returns the same ledger when given %s', (_label, answers) => {
    expect(applyStatuses(ledger, answers, '2026-11-01')).toBe(ledger);
  });
});

const mk = (number: number, status: 'merged' | 'open' | 'closed') => ({
  number,
  title: `t${number}`,
  status,
  note: { en: 'n', uk: 'н' },
});

describe('orderLedger', () => {
  const repos = [
    { repo: 'a/open', stack: 's', pullRequests: [mk(1, 'open'), mk(2, 'open')] },
    {
      repo: 'b/mixed',
      stack: 's',
      pullRequests: [mk(3, 'closed'), mk(4, 'merged'), mk(5, 'open')],
    },
    { repo: 'c/merged', stack: 's', pullRequests: [mk(6, 'merged')] },
    { repo: 'd/open', stack: 's', pullRequests: [mk(7, 'open')] },
    {
      repo: 'e/most-open',
      stack: 's',
      pullRequests: [mk(8, 'open'), mk(9, 'open'), mk(10, 'open')],
    },
    { repo: 'f/closed', stack: 's', pullRequests: [mk(11, 'closed')] },
    { repo: 'g/closed', stack: 's', pullRequests: [mk(12, 'closed')] },
  ];

  it('puts repos with merged work first, then by open count, keeping input order on ties', () => {
    expect(orderLedger(repos).map((r) => r.repo)).toEqual([
      'b/mixed',
      'c/merged',
      'e/most-open',
      'a/open',
      'd/open',
      'f/closed',
      'g/closed',
    ]);
  });

  it('lists merged, then open, then closed pull requests inside a repo', () => {
    const mixed = orderLedger(repos)[0];
    expect(mixed?.pullRequests.map((p) => p.number)).toEqual([4, 5, 3]);
  });

  it('does not mutate its input', () => {
    const before = JSON.stringify(repos);
    orderLedger(repos);
    expect(JSON.stringify(repos)).toBe(before);
  });
});
