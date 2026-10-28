import type { Localized } from './locale.ts';

const STATUSES = ['merged', 'open', 'closed'] as const;
export type PullRequestStatus = (typeof STATUSES)[number];

interface PullRequest {
  readonly number: number;
  readonly title: string;
  readonly status: PullRequestStatus;
  readonly note: Localized<string>;
}

export interface RepoContributions {
  readonly repo: string;
  readonly stack: string;
  readonly pullRequests: readonly PullRequest[];
}

export interface Ledger {
  readonly snapshot: string;
  readonly repos: readonly RepoContributions[];
}

const REPO_SLUG = /^[\w.-]+\/[\w.-]+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const fail = (message: string): never => {
  throw new Error(`Invalid ledger: ${message}`);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const text = (value: unknown, field: string): string =>
  typeof value === 'string' && value.length > 0
    ? value
    : fail(`${field} must be a non-empty string`);

const localizedText = (value: unknown, field: string): Localized<string> => {
  if (!isRecord(value)) return fail(`${field} must be an object with a text per locale`);
  return { en: text(value.en, `${field}.en`), uk: text(value.uk, `${field}.uk`) };
};

const isStatus = (value: unknown): value is PullRequestStatus =>
  STATUSES.some((status) => status === value);

const parseStatus = (value: unknown): PullRequestStatus =>
  isStatus(value) ? value : fail(`status must be one of ${STATUSES.join(', ')}`);

const parsePullRequest = (value: unknown): PullRequest => {
  if (!isRecord(value)) return fail('pull request must be an object');
  const { number } = value;
  if (typeof number !== 'number' || !Number.isInteger(number) || number < 1) {
    return fail('pull request number must be a positive integer');
  }
  return {
    number,
    title: text(value.title, 'title'),
    status: parseStatus(value.status),
    note: localizedText(value.note, 'note'),
  };
};

const parseRepo = (value: unknown): RepoContributions => {
  if (!isRecord(value)) return fail('repo entry must be an object');
  const repo = text(value.repo, 'repo');
  if (!REPO_SLUG.test(repo)) return fail(`repo "${repo}" must look like owner/name`);
  if (!Array.isArray(value.pullRequests) || value.pullRequests.length === 0) {
    return fail(`${repo} needs at least one pull request`);
  }
  const pullRequests = value.pullRequests.map(parsePullRequest);
  const numbers = pullRequests.map((pr) => pr.number);
  if (new Set(numbers).size !== numbers.length)
    return fail(`duplicate pull request number in ${repo}`);
  return { repo, stack: text(value.stack, 'stack'), pullRequests };
};

export const parseLedger = (raw: unknown): Ledger => {
  if (!isRecord(raw)) return fail('expected an object');
  const snapshot = text(raw.snapshot, 'snapshot');
  if (!ISO_DATE.test(snapshot)) return fail('snapshot must be an ISO date (YYYY-MM-DD)');
  if (!Array.isArray(raw.repos)) return fail('repos must be an array');
  return { snapshot, repos: raw.repos.map(parseRepo) };
};

export const pullRequestUrl = (repo: string, number: number): string =>
  `https://github.com/${repo}/pull/${number}`;

export const tally = (repos: readonly RepoContributions[]): Record<PullRequestStatus, number> => {
  const counts: Record<PullRequestStatus, number> = { merged: 0, open: 0, closed: 0 };
  for (const { pullRequests } of repos) {
    for (const { status } of pullRequests) counts[status] += 1;
  }
  return counts;
};

export const statusFromGitHub = (pr: {
  readonly state: string;
  readonly merged: boolean;
}): PullRequestStatus => {
  if (pr.merged) return 'merged';
  return pr.state === 'open' ? 'open' : 'closed';
};

/** Keys are `owner/name#number`. Returns a new ledger; the input is untouched. */
export const applyStatuses = (
  ledger: Ledger,
  states: ReadonlyMap<string, PullRequestStatus>,
  snapshot: string,
): Ledger => {
  let changed = false;
  const repos = ledger.repos.map((repo) => ({
    ...repo,
    pullRequests: repo.pullRequests.map((pr) => {
      const status = states.get(`${repo.repo}#${pr.number}`);
      if (status === undefined || status === pr.status) return pr;
      changed = true;
      return { ...pr, status };
    }),
  }));
  return changed ? { snapshot, repos } : ledger;
};

const STATUS_RANK: Record<PullRequestStatus, number> = { merged: 0, open: 1, closed: 2 };

const countOf = (repo: RepoContributions, status: PullRequestStatus): number =>
  repo.pullRequests.filter((pr) => pr.status === status).length;

/** Strongest proof first: repos with merged work, then more open work. */
export const orderLedger = (repos: readonly RepoContributions[]): readonly RepoContributions[] =>
  repos
    .map((repo) => ({
      ...repo,
      pullRequests: repo.pullRequests.toSorted(
        (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status],
      ),
    }))
    // Array#toSorted is stable, so ties keep their input order.
    .toSorted(
      (a, b) =>
        countOf(b, 'merged') - countOf(a, 'merged') || countOf(b, 'open') - countOf(a, 'open'),
    );
