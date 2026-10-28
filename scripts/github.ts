import { statusFromGitHub, type PullRequestStatus } from '../src/domain/contributions.ts';

interface Options {
  readonly fetch: typeof fetch;
  readonly token?: string | undefined;
}

export const fetchStatus = async (
  repo: string,
  number: number,
  { fetch: fetchImpl, token }: Options,
): Promise<PullRequestStatus> => {
  const headers: Record<string, string> = { accept: 'application/vnd.github+json' };
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetchImpl(`https://api.github.com/repos/${repo}/pulls/${number}`, {
    headers,
  });
  if (!response.ok) throw new Error(`${repo}#${number}: GitHub answered ${response.status}`);
  return statusFromGitHub((await response.json()) as { state: string; merged: boolean });
};
