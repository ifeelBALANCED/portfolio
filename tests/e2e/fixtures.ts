import { expect, test as base, type Page } from '@playwright/test';
import { localizedPath, type Locale } from '../../src/domain/locale';

/** Mirrors `site` in astro.config.mjs on purpose: a changed origin should fail the metadata tests. */
export const SITE = 'https://vladyslav-herasymenko.vercel.app';

interface Options {
  /** Which language edition `home` opens. */
  site: Locale;
  /** Value planted in `vh-theme` before the first navigation, as a returning visitor would have. */
  storedTheme: string | null;
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

  page: async ({ page, storedTheme }, use) => {
    if (storedTheme !== null) {
      await page.addInitScript((id) => localStorage.setItem('vh-theme', id), storedTheme);
    }
    await use(page);
  },

  errors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(`console: ${message.text()}`);
      });
      await use(errors);
      expect(errors, 'the page must not log errors').toEqual([]);
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
