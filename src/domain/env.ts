/** Canonical origin; `SITE_URL` overrides it for forks and preview builds. */
export const DEFAULT_SITE_URL = 'https://vladyslav-herasymenko.vercel.app';

export interface Env {
  /** Origin with no path, used for canonical links, hreflang and the share image. */
  readonly siteUrl: string;
  /** Raises the GitHub API limit for `ledger:refresh`; optional, public data needs no scope. */
  readonly githubToken: string | undefined;
  /** When set, Playwright tests a deployed site instead of the local preview. */
  readonly baseUrl: string | undefined;
  readonly ci: boolean;
}

const blank = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed === '' ? undefined : trimmed;
};

const origin = (name: string, value: string): string => {
  const url = URL.canParse(value) ? new URL(value) : undefined;
  if (url === undefined || url.protocol !== 'https:' || url.pathname !== '/') {
    throw new Error(`${name} must be an https origin without a path, got "${value}"`);
  }
  return url.origin;
};

/** Reads and validates the process environment once; every consumer takes this, never `process.env`. */
export const readEnv = (source: Readonly<Record<string, string | undefined>>): Env => {
  const site = blank(source.SITE_URL);
  const base = blank(source.BASE_URL);
  return {
    siteUrl: site === undefined ? DEFAULT_SITE_URL : origin('SITE_URL', site),
    githubToken: blank(source.GITHUB_TOKEN),
    baseUrl: base === undefined ? undefined : origin('BASE_URL', base),
    ci: blank(source.CI) !== undefined,
  };
};
