import { describe, expect, it } from 'vitest';
import { fetchStatus } from '../../scripts/github';
import { brokenFetch, fakeFetch, textFetch } from '../support/fake-fetch';

describe('fetchStatus', () => {
  it.each([
    [{ state: 'closed', merged: true }, 'merged'],
    [{ state: 'open', merged: false }, 'open'],
    [{ state: 'closed', merged: false }, 'closed'],
  ] as const)('maps %j to %s', async (body, expected) => {
    const { fetch } = fakeFetch(body);
    expect(await fetchStatus('TanStack/db', 1745, { fetch })).toBe(expected);
  });

  it('asks the GitHub pulls endpoint and sends the token when present', async () => {
    const { fetch, requests } = fakeFetch({ state: 'open', merged: false });
    await fetchStatus('oxc-project/oxc', 25843, { fetch, token: 'secret' });
    expect(requests).toEqual([
      {
        url: 'https://api.github.com/repos/oxc-project/oxc/pulls/25843',
        headers: { accept: 'application/vnd.github+json', authorization: 'Bearer secret' },
      },
    ]);
  });

  it('omits the authorization header without a token', async () => {
    const { fetch, requests } = fakeFetch({ state: 'open', merged: false });
    await fetchStatus('a/b', 1, { fetch });
    expect(requests[0]?.headers).not.toHaveProperty('authorization');
  });

  it('fails loudly when GitHub does not answer 200', async () => {
    await expect(fetchStatus('a/b', 9, { fetch: fakeFetch({}, 404).fetch })).rejects.toThrow(
      /a\/b#9.*404/,
    );
  });

  // Regression: a 200 with an unexpected body used to be read as `closed`, which the weekly
  // refresh would then have committed to the ledger.
  it.each([
    ['an empty object', {}],
    ['a rate-limit style message', { message: 'API rate limit exceeded' }],
    ['a non-object body', null],
    ['a state of the wrong type', { state: 1, merged: false }],
    ['a missing merged flag', { state: 'open' }],
  ])('rejects %s instead of guessing a status', async (_label, body) => {
    await expect(fetchStatus('a/b', 7, { fetch: fakeFetch(body).fetch })).rejects.toThrow(
      /a\/b#7.*unexpected/i,
    );
  });

  // The weekly refresh loops over many pull requests; a failure must say which one.
  it('names the pull request when the body is not JSON', async () => {
    const fetch = textFetch('<html>proxy error</html>');
    await expect(fetchStatus('a/b', 5, { fetch })).rejects.toThrow(/a\/b#5.*not JSON/i);
  });

  it('names the pull request when the network fails', async () => {
    const fetch = brokenFetch(new TypeError('fetch failed'));
    await expect(fetchStatus('a/b', 6, { fetch })).rejects.toThrow(/a\/b#6.*fetch failed/);
  });

  it('still names the pull request when something other than an Error is thrown', async () => {
    const fetch = brokenFetch('socket closed');
    await expect(fetchStatus('a/b', 8, { fetch })).rejects.toThrow(/a\/b#8.*socket closed/);
  });
});
