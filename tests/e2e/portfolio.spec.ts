import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { LOCALES, localizedPath, type Locale } from '../../src/domain/locale';
import { THEMES } from '../../src/domain/themes';
import { t } from '../../src/i18n';
import { expect, hexToRgb, SITE, test } from './fixtures';

const TITLES: Record<Locale, RegExp> = {
  en: /Vladyslav Herasymenko — Frontend engineer/,
  uk: /Владислав Герасименко — Фронтенд-інженер/,
};
const CLOSED_LABEL: Record<Locale, RegExp> = { en: /not merged/i, uk: /без мерджу/i };
const DEMO = 'https://effector-vite-template.surge.sh';

const themeRadio = (page: Page, label: string) => page.getByRole('radio', { name: label });

for (const locale of LOCALES) {
  const copy = t(locale);

  test.describe(locale, () => {
    test.use({ site: locale });

    test(
      'has title, description, canonical, alternates and Open Graph metadata',
      { tag: '@smoke' },
      async ({ home }) => {
        await expect(home).toHaveTitle(TITLES[locale]);
        await expect(home.locator('html')).toHaveAttribute('lang', locale);
        await expect(home.locator('meta[name="description"]')).toHaveAttribute(
          'content',
          copy.meta.description,
        );
        await expect(home.locator('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `${SITE}${localizedPath(locale)}`,
        );
        for (const [hreflang, path] of [
          ['en', '/'],
          ['uk', '/uk/'],
          ['x-default', '/'],
        ] as const) {
          await expect(
            home.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
          ).toHaveAttribute('href', `${SITE}${path}`);
        }
        await expect(home.locator('meta[property="og:image"]')).toHaveAttribute(
          'content',
          `${SITE}${copy.meta.ogImage}`,
        );
        await expect(home.locator('meta[property="og:locale"]')).toHaveAttribute(
          'content',
          copy.meta.ogLocale,
        );
        const jsonLd = home.locator('script[type="application/ld+json"]');
        await expect(jsonLd).toHaveCount(1);
        expect(JSON.parse((await jsonLd.textContent()) ?? '')).toMatchObject({
          '@type': 'Person',
          name: 'Vladyslav Herasymenko',
          jobTitle: 'Frontend engineer',
        });
      },
    );

    test(
      'every pull request links to a GitHub pull page and the diffstat adds up',
      { tag: '@smoke' },
      async ({ home }) => {
        const rows = home.locator('a.pr');
        await expect(rows.first()).toBeVisible();
        const links = await rows.evaluateAll((els) =>
          els.map((el) => (el instanceof HTMLAnchorElement ? el.href : '')),
        );
        expect(links.length).toBeGreaterThan(0);
        for (const href of links) {
          expect(href).toMatch(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+$/);
        }
        const stat = (await home.locator('.stat-text').textContent()) ?? '';
        const total = [...stat.matchAll(/\d+/g)].reduce((sum, m) => sum + Number(m[0]), 0);
        expect(total).toBe(links.length);
      },
    );

    test('closed pull requests are labelled in words, not colour alone', async ({ home }) => {
      const closed = home.locator('a.pr[data-s="closed"]');
      await expect(closed.first()).toBeVisible();
      await expect(closed.filter({ hasNotText: CLOSED_LABEL[locale] })).toHaveCount(0);
    });

    test('the share image of this edition is served', async ({ request }) => {
      const response = await request.get(copy.meta.ogImage);
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('image/png');
    });

    test('the CV link serves a PDF', { tag: '@smoke' }, async ({ home, request }) => {
      const href = await home.getByRole('link', { name: copy.hero.cv }).getAttribute('href');
      expect(href).toBeTruthy();
      const response = await request.get(href ?? '');
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('application/pdf');
    });

    test('the featured repo comes first and carries the live demo', async ({ home }) => {
      const featured = home.locator('.inventory > li[data-featured]');
      await expect(featured).toHaveCount(1);
      await expect(home.locator('.inventory > li').first()).toHaveAttribute('data-featured', '');
      await expect(featured.locator(`a[href^="${DEMO}"]`)).toHaveCount(1);
      await expect(home.locator(`a[href^="${DEMO}"]`)).toHaveCount(1);
    });

    test('offers a contact action first and states availability', async ({ home }) => {
      const first = home.locator('.hero .actions a').first();
      await expect(first).toHaveText(copy.hero.contact);
      await expect(first).toHaveAttribute('href', /^mailto:[^@\s]+@[^@\s]+$/);
      await expect(home.getByText(copy.hero.spec.status.value, { exact: true })).toBeVisible();
    });

    test('the contact section is a labelled landmark with a heading', async ({ home }) => {
      const footer = home.getByRole('contentinfo');
      await expect(footer.getByRole('heading', { level: 2 })).toContainText(copy.contact.title);
      await expect(footer.getByRole('link', { name: copy.contact.linkedin })).toBeVisible();
    });

    test('skip link is the first tab stop, shows focus and jumps to the content', async ({
      home,
    }) => {
      await home.keyboard.press('Tab');
      const skip = home.getByRole('link', { name: copy.skip });
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();
      await expect(skip).not.toHaveCSS('outline-style', 'none');
      await home.keyboard.press('Enter');
      await expect(home).toHaveURL(/#main$/);
      await expect(home.locator('#main')).toBeInViewport();
    });

    test('no horizontal scroll at the current viewport', async ({ home }) => {
      await home.evaluate(() => document.fonts.ready);
      await expect
        .poll(() => home.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
        .toBeLessThanOrEqual(0);
    });

    test('each filter shows only its pull requests and no empty repo blocks', async ({ home }) => {
      const rows = home.locator('a.pr');
      const all = await rows.count();
      expect(all).toBeGreaterThan(0);

      for (const status of ['merged', 'open', 'closed'] as const) {
        const expected = await home.locator(`a.pr[data-s="${status}"]`).count();
        await home.getByRole('radio', { name: copy.ledger.filters[status] }).check({ force: true });
        await expect(rows.locator('visible=true')).toHaveCount(expected);
        await expect(
          home.locator(`a.pr:not([data-s="${status}"])`).locator('visible=true'),
        ).toHaveCount(0);
        await expect(
          home
            .locator('.hunk')
            .locator('visible=true')
            .filter({ hasNot: home.locator('a.pr:visible') }),
        ).toHaveCount(0);
      }

      await home.getByRole('radio', { name: copy.ledger.filters.all }).check({ force: true });
      await expect(rows.locator('visible=true')).toHaveCount(all);
    });

    test('the section links scroll to their sections', async ({ home, isMobile }) => {
      test.skip(isMobile, 'the section links live in the desktop toolbar');
      const nav = home.getByRole('navigation', { name: copy.nav.label });
      for (const [label, id] of [
        [copy.nav.changeset, 'open-source'],
        [copy.nav.history, 'experience'],
        [copy.nav.spec, 'stack'],
        [copy.nav.inventory, 'repos'],
      ] as const) {
        await nav.getByRole('link', { name: label }).click();
        await expect(home).toHaveURL(new RegExp(`#${id}$`));
        await expect(home.locator(`#${id}`)).toBeInViewport();
      }
    });

    for (const theme of THEMES) {
      test(`passes axe WCAG 2.2 AA checks in the ${theme.id} theme`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript((id) => localStorage.setItem('vh-theme', id), theme.id);
        await page.goto(localizedPath(locale));
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme.id);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(
          results.violations.map(
            (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
          ),
        ).toEqual([]);
      });
    }
  });
}

test(
  'the language switch changes route and keeps the chosen theme',
  { tag: '@smoke' },
  async ({ home }) => {
    await themeRadio(home, 'Blueprint').check({ force: true });
    await home.getByRole('link', { name: 'Українська' }).click();
    await expect(home).toHaveURL(/\/uk\/$/);
    await expect(home.locator('html')).toHaveAttribute('lang', 'uk');
    await expect(home.locator('html')).toHaveAttribute('data-theme', 'blueprint');
    await home.getByRole('link', { name: 'English' }).click();
    await expect(home).toHaveURL(/\/$/);
    await expect(home.locator('html')).toHaveAttribute('lang', 'en');
  },
);

test('a chosen theme is applied, persisted and set before first paint', async ({ home }) => {
  const lab = THEMES.find((theme) => theme.id === 'lab');
  expect(lab).toBeDefined();
  await themeRadio(home, 'Lab').check({ force: true });
  await expect(home.locator('html')).toHaveAttribute('data-theme', 'lab');
  await expect.poll(() => home.evaluate(() => localStorage.getItem('vh-theme'))).toBe('lab');

  await home.reload();
  await expect(themeRadio(home, 'Lab')).toBeChecked();
  await expect(home.locator('body')).toHaveCSS('background-color', hexToRgb(lab?.bg ?? ''));
});

test.describe('without a stored theme', () => {
  for (const [scheme, id] of [
    ['light', 'paper'],
    ['dark', 'graphite'],
  ] as const) {
    test(`follows the ${scheme} OS colour scheme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', id);
      await expect(
        themeRadio(page, THEMES.find((theme) => theme.id === id)?.label ?? ''),
      ).toBeChecked();
    });
  }

  test('survives storage that throws', async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new Error('storage blocked');
      };
    });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper');
  });
});

test.describe('with an unknown stored theme', () => {
  test.use({ storedTheme: 'nope' });

  test('falls back to the OS default', async ({ home }) => {
    await expect(home.locator('html')).toHaveAttribute('data-theme', 'paper');
  });
});

test.describe('unknown address', () => {
  test.use({ expectedErrors: [/status of 404/] });

  test('gets a bilingual 404 that is kept out of search', async ({ page }) => {
    const response = await page.goto('/definitely-not-here');
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/404/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.getByRole('link', { name: t('en').notFound.home })).toHaveAttribute(
      'href',
      '/',
    );
    await expect(page.getByRole('link', { name: t('uk').notFound.home })).toHaveAttribute(
      'href',
      '/uk/',
    );
  });
});

test.describe('forced colors', () => {
  test.use({ colorScheme: 'light' });

  test('theme swatches keep their colours and the selected one is outlined', async ({ home }) => {
    await home.emulateMedia({ forcedColors: 'active' });
    const swatches = home.locator('.swatch');
    await expect(swatches).toHaveCount(THEMES.length);
    for (const swatch of await swatches.all()) {
      await expect(swatch).not.toHaveCSS('background-image', 'none');
    }
    await themeRadio(home, 'Lab').check({ force: true });
    await expect(home.locator('#t-lab + .swatch')).toHaveCSS('outline-style', 'solid');
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('a clicked theme still restyles the page through CSS alone', async ({ home }) => {
    const blueprint = THEMES.find((theme) => theme.id === 'blueprint');
    await home.getByTitle('Blueprint').click({ force: true });
    await expect(home.locator('body')).toHaveCSS('background-color', hexToRgb(blueprint?.bg ?? ''));
  });
});

test('production sends the security headers', { tag: '@smoke' }, async ({ request }) => {
  test.skip(
    !process.env.BASE_URL,
    'headers come from vercel.json; astro preview does not apply them',
  );
  const headers = (await request.get('/')).headers();
  expect(headers['content-security-policy']).toContain("default-src 'none'");
  expect(headers['content-security-policy']).toMatch(/script-src ('sha256-[\w+/=]+' ?)+;/);
  expect(headers['permissions-policy']).toContain('camera=()');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['cross-origin-opener-policy']).toBe('same-origin');
});
