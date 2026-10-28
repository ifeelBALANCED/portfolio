import { describe, expect, it } from 'vitest';
import { DEFAULT_SITE_URL, readEnv } from '../../src/domain/env.ts';

describe('readEnv', () => {
  it('falls back to the canonical origin with nothing set', () => {
    expect(readEnv({})).toEqual({
      siteUrl: DEFAULT_SITE_URL,
      githubToken: undefined,
      baseUrl: undefined,
      ci: false,
    });
  });

  it('treats blank values as unset', () => {
    const env = readEnv({ SITE_URL: ' ', GITHUB_TOKEN: '', BASE_URL: '  ', CI: '' });
    expect(env.siteUrl).toBe(DEFAULT_SITE_URL);
    expect(env.githubToken).toBeUndefined();
    expect(env.baseUrl).toBeUndefined();
    expect(env.ci).toBe(false);
  });

  it('accepts overrides and trims them', () => {
    const env = readEnv({
      SITE_URL: ' https://example.dev/ ',
      GITHUB_TOKEN: ' ghp_x ',
      BASE_URL: 'https://preview.example.dev',
      CI: 'true',
    });
    expect(env).toEqual({
      siteUrl: 'https://example.dev',
      githubToken: 'ghp_x',
      baseUrl: 'https://preview.example.dev',
      ci: true,
    });
  });

  it.each([
    ['SITE_URL', 'not a url'],
    ['SITE_URL', 'http://example.dev'],
    ['SITE_URL', 'https://example.dev/docs'],
    ['BASE_URL', 'ftp://example.dev'],
  ])('rejects %s=%s', (name, value) => {
    expect(() => readEnv({ [name]: value })).toThrow(new RegExp(`${name} must be an https origin`));
  });

  it('never echoes the token in an error', () => {
    expect(() => readEnv({ GITHUB_TOKEN: 'ghp_secret', SITE_URL: 'nope' })).not.toThrow(
      /ghp_secret/,
    );
  });
});
