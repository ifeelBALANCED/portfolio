import { expect, test as base, type Page } from '@playwright/test';
import { readEnv } from '../../src/domain/env';
import { localizedPath, type Locale } from '../../src/domain/locale';

/** Same source as `site` in astro.config.mjs, so a build with another SITE_URL is tested against it. */
export const SITE = readEnv(process.env).siteUrl;

interface Options {
  /** Which language edition `home` opens. */
  site: Locale;
  /** Value planted in `vh-theme` before the first navigation, as a returning visitor would have. */
  storedTheme: string | null;
  /** Console errors a test knowingly provokes, e.g. the 404 status of a deliberate bad address. */
  expectedErrors: RegExp[];
}

interface Fixtures {
  /** Page and console errors; asserted empty after every test. */
  errors: string[];
  /** The page, already on the home route of `site`. */
  home: Page;
}

export const test = base.extend<Options & Fixtures>({
  site: ['en', { option: true }],
  storedTheme: [null, { option: true }],
  expectedErrors: [[], { option: true }],

  page: async ({ page, storedTheme }, use) => {
    if (storedTheme !== null) {
      await page.addInitScript((id) => localStorage.setItem('vh-theme', id), storedTheme);
    }
    await use(page);
  },

  errors: [
    async ({ page, expectedErrors }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(`console: ${message.text()}`);
      });
      await use(errors);
      const unexpected = errors.filter(
        (error) => !expectedErrors.some((known) => known.test(error)),
      );
      expect(unexpected, 'the page must not log errors').toEqual([]);
    },
    { auto: true },
  ],

  home: async ({ page, site }, use) => {
    await page.goto(localizedPath(site));
    await use(page);
  },
});

export { expect };

export const hexToRgb = (hex: string): string => {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
};
