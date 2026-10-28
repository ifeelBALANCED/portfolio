import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => {
    throw error;
  });
});

test('has unique title, description, canonical and Open Graph metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Vladyslav Herasymenko — Senior Frontend Engineer/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\/.+\/$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og\.png$/);
  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(jsonLd ?? '{}')).toMatchObject({
    '@type': 'Person',
    name: 'Vladyslav Herasymenko',
  });
});

test('anchor navigation scrolls to each section', async ({ page, isMobile }) => {
  await page.goto('/');
  for (const [name, id] of [
    ['Open source', 'open-source'],
    ['Experience', 'experience'],
    ['Stack', 'stack'],
  ] as const) {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name }).click();
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
  expect(isMobile !== undefined).toBe(true);
});

test('every pull request links to a GitHub pull page and statuses add up', async ({ page }) => {
  await page.goto('/');
  const links = await page
    .locator('.pr a.t')
    .evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).href));
  expect(links.length).toBeGreaterThanOrEqual(10);
  for (const href of links)
    expect(href).toMatch(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+$/);
  const chips = await page.locator('.pr .chip').count();
  const totals = await page.locator('.tally dd').allTextContents();
  expect(totals.map(Number).reduce((a, b) => a + b, 0)).toBe(chips);
});

test('CV download and live demo links resolve', async ({ page, request }) => {
  await page.goto('/');
  const cv = await page.getByRole('link', { name: /Download CV/ }).getAttribute('href');
  expect((await request.get(cv ?? '/')).headers()['content-type']).toContain('application/pdf');
  await expect(page.getByRole('link', { name: 'live demo' })).toHaveAttribute(
    'href',
    /^https:\/\//,
  );
});

test('skip link is the first tab stop and focus is visible', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});

test('no horizontal scroll at the current viewport', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

for (const scheme of ['light', 'dark'] as const) {
  test(`passes axe WCAG 2.2 AA checks in ${scheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto('/');
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
