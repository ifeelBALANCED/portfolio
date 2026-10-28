import { describe, expect, it } from 'vitest';
import { fetchStatus } from '../../scripts/github';

const respond =
  (body: unknown, status = 200) =>
  async () =>
    new Response(JSON.stringify(body), { status });

describe('fetchStatus', () => {
  it('reports a merged pull request as merged', async () => {
    const fetchImpl = respond({ state: 'closed', merged: true });
    expect(await fetchStatus('TanStack/db', 1745, { fetch: fetchImpl })).toBe('merged');
  });

  it('asks the GitHub pulls endpoint and sends the token when present', async () => {
    let seen: { url: string; headers: Record<string, string> } | undefined;
    const fetchImpl = async (url: string | URL | Request, init?: RequestInit) => {
      seen = { url: String(url), headers: init?.headers as Record<string, string> };
      return new Response(JSON.stringify({ state: 'open', merged: false }));
    };
    await fetchStatus('oxc-project/oxc', 25843, { fetch: fetchImpl, token: 'secret' });
    expect(seen?.url).toBe('https://api.github.com/repos/oxc-project/oxc/pulls/25843');
    expect(seen?.headers.authorization).toBe('Bearer secret');
  });

  it('omits the authorization header without a token', async () => {
    let headers: Record<string, string> | undefined;
    const fetchImpl = async (_url: string | URL | Request, init?: RequestInit) => {
      headers = init?.headers as Record<string, string>;
      return new Response(JSON.stringify({ state: 'open', merged: false }));
    };
    await fetchStatus('a/b', 1, { fetch: fetchImpl });
    expect(headers).not.toHaveProperty('authorization');
  });

  it('fails loudly when GitHub does not answer 200', async () => {
    await expect(fetchStatus('a/b', 9, { fetch: respond({}, 404) })).rejects.toThrow(/a\/b#9.*404/);
  });
});
