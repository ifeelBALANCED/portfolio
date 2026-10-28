import { statusFromGitHub, type PullRequestStatus } from '../src/domain/contributions.ts';

interface Options {
  readonly fetch: typeof fetch;
  readonly token?: string | undefined;
}

interface PullState {
  readonly state: string;
  readonly merged: boolean;
}

const isPullState = (value: unknown): value is PullState =>
  typeof value === 'object' &&
  value !== null &&
  'state' in value &&
  typeof value.state === 'string' &&
  'merged' in value &&
  typeof value.merged === 'boolean';

const messageOf = (cause: unknown): string =>
  cause instanceof Error ? cause.message : String(cause);

const attempt = async <T>(
  repo: string,
  number: number,
  run: () => Promise<T>,
  describe: (cause: unknown) => string = messageOf,
): Promise<T> => {
  try {
    return await run();
  } catch (cause) {
    throw new Error(`${repo}#${number}: ${describe(cause)}`, { cause });
  }
};

export const fetchStatus = async (
  repo: string,
  number: number,
  { fetch: fetchImpl, token }: Options,
): Promise<PullRequestStatus> => {
  const headers: Record<string, string> = { accept: 'application/vnd.github+json' };
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await attempt(repo, number, () =>
    fetchImpl(`https://api.github.com/repos/${repo}/pulls/${number}`, { headers }),
  );
  if (!response.ok) throw new Error(`${repo}#${number}: GitHub answered ${response.status}`);
  const body: unknown = await attempt(
    repo,
    number,
    () => response.json(),
    () => 'body is not JSON',
  );
  if (!isPullState(body)) throw new Error(`${repo}#${number}: GitHub sent an unexpected body`);
  return statusFromGitHub(body);
};
