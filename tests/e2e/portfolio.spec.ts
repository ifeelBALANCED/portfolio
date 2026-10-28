import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { THEMES } from '../../src/domain/themes';

const LOCALES = [
  { id: 'en', path: '/', lang: 'en', title: /Vladyslav Herasymenko — Frontend engineer/ },
  { id: 'uk', path: '/uk/', lang: 'uk', title: /Владислав Герасименко — Фронтенд-інженер/ },
] as const;

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => {
    throw error;
  });
});

const pickTheme = async (page: Page, label: string) => {
  await page.locator(`label.theme-pick[title="${label}"]`).click();
};

for (const locale of LOCALES) {
  test.describe(locale.id, () => {
    test('has title, description, canonical, alternates and Open Graph metadata', async ({
      page,
    }) => {
      await page.goto(locale.path);
      await expect(page).toHaveTitle(locale.title);
      await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        new RegExp(`^https://[^/]+${locale.path}$`),
      );
      for (const hreflang of ['en', 'uk', 'x-default']) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveCount(1);
      }
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        'content',
        locale.id === 'en' ? 'en_US' : 'uk_UA',
      );
      const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
      expect(JSON.parse(jsonLd ?? '{}')).toMatchObject({
        '@type': 'Person',
        name: 'Vladyslav Herasymenko',
        jobTitle: 'Frontend engineer',
      });
    });

    test('every pull request links to a GitHub pull page and the diffstat adds up', async ({
      page,
    }) => {
      await page.goto(locale.path);
      const links = await page
        .locator('a.pr')
        .evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).href));
      expect(links.length).toBeGreaterThanOrEqual(10);
      for (const href of links) {
        expect(href).toMatch(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+$/);
      }
      const stat = (await page.locator('.stat-text').textContent()) ?? '';
      const total = [...stat.matchAll(/\d+/g)].reduce((sum, m) => sum + Number(m[0]), 0);
      expect(total).toBe(links.length);
    });

    test('closed pull requests are labelled in words, not colour alone', async ({ page }) => {
      await page.goto(locale.path);
      const tags = await page.locator('.pr[data-s="closed"] .pr-tag').allTextContents();
      expect(tags.length).toBeGreaterThan(0);
      for (const tag of tags) expect(tag).toMatch(locale.id === 'en' ? /not merged/i : /не влито/i);
    });

    test('CV download and live demo links resolve', async ({ page, request }) => {
      await page.goto(locale.path);
      const cv = await page.locator('a[href$=".pdf"]').getAttribute('href');
      expect((await request.get(cv ?? '/')).headers()['content-type']).toContain('application/pdf');
      await expect(page.locator('a[href^="https://effector-vite-template.surge.sh"]')).toHaveCount(
        1,
      );
    });

    test('the featured repo comes first and carries the live demo', async ({ page }) => {
      await page.goto(locale.path);
      const first = page.locator('.inventory > li').first();
      await expect(first).toHaveAttribute('data-featured', '');
      await expect(first.locator('a[href^="https://effector-vite-template.surge.sh"]')).toHaveCount(
        1,
      );
      await expect(page.locator('.inventory > li[data-featured]')).toHaveCount(1);
    });

    test('skip link is the first tab stop and focus is visible', async ({ page }) => {
      await page.goto(locale.path);
      await page.keyboard.press('Tab');
      const skip = page.locator('a.skip');
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();
    });

    test('no horizontal scroll at the current viewport', async ({ page }) => {
      await page.goto(locale.path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('filter hides non-matching rows and their empty hunks', async ({ page }) => {
      await page.goto(locale.path);
      const all = await page.locator('a.pr:visible').count();
      await page.locator('label', { has: page.locator('#f-merged') }).click();
      await expect(page.locator('a.pr:visible')).toHaveCount(2);
      await expect(page.locator('a.pr[data-s="merged"]:visible')).toHaveCount(2);
      await expect(page.locator('.hunk:visible')).toHaveCount(2);
      await page.locator('label', { has: page.locator('#f-all') }).click();
      await expect(page.locator('a.pr:visible')).toHaveCount(all);
    });

    for (const theme of THEMES) {
      test(`passes axe WCAG 2.2 AA checks in the ${theme.id} theme`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript((id) => localStorage.setItem('vh-theme', id), theme.id);
        await page.goto(locale.path);
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

test('anchor navigation scrolls to each section', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the section links live in the desktop toolbar');
  await page.goto('/');
  for (const [name, id] of [
    ['Open source', 'open-source'],
    ['Experience', 'experience'],
    ['Stack', 'stack'],
    ['Repos', 'repos'],
  ] as const) {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name }).click();
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
});

test('the language switch changes route and keeps the chosen theme', async ({ page }) => {
  await page.goto('/');
  await pickTheme(page, 'Blueprint');
  await page.getByRole('link', { name: 'Українська' }).click();
  await expect(page).toHaveURL(/\/uk\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'blueprint');
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('a chosen theme is applied, persisted and set before first paint', async ({ page }) => {
  await page.goto('/');
  await pickTheme(page, 'Lab');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'lab');
  expect(await page.evaluate(() => localStorage.getItem('vh-theme'))).toBe('lab');
  await page.reload();
  await expect(page.locator('input#t-lab')).toBeChecked();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('lab');
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
    'rgb(232, 239, 236)',
  );
});

test('follows the OS colour scheme until a theme is chosen', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'graphite');
  await expect(page.locator('input#t-graphite')).toBeChecked();
});

test('an unknown stored theme falls back to the OS default', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('vh-theme', 'nope'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', /^(paper|graphite)$/);
});
