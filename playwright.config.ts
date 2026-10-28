import { defineConfig, devices } from '@playwright/test';

const ci = Boolean(process.env.CI);
const remote = process.env.BASE_URL;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: ci,
  // One retry in CI absorbs infrastructure noise only; a test that needs it shows as flaky.
  retries: ci ? 1 : 0,
  workers: ci ? 2 : undefined,
  reporter: ci ? [['list'], ['html', { open: 'never' }]] : 'list',
  expect: { timeout: 5_000 },
  use: {
    baseURL: remote ?? 'http://localhost:4321',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // The site is static: serve the existing `dist`. `pnpm build` must run first (verify and CI do).
  webServer: remote
    ? undefined
    : {
        command: 'pnpm preview --port 4321 --ignore-lock',
        url: 'http://localhost:4321',
        reuseExistingServer: false,
        timeout: 30_000,
      },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
