import { defineConfig, devices } from '@playwright/test';
import { readEnv } from './src/domain/env.ts';

const { ci, baseUrl: remote } = readEnv(process.env);

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: ci,
  // One retry in CI absorbs infrastructure noise only; a test that needs it shows as flaky.
  retries: ci ? 1 : 0,
  ...(ci ? { workers: 2 } : {}),
  reporter: ci ? [['list'], ['html', { open: 'never' }]] : 'list',
  expect: { timeout: 5_000 },
  use: {
    baseURL: remote ?? 'http://localhost:4321',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // The site is static: serve the existing `dist`. `pnpm build` must run first (verify and CI do).
  ...(remote
    ? {}
    : {
        webServer: {
          command: 'pnpm preview --port 4321 --ignore-lock',
          url: 'http://localhost:4321',
          reuseExistingServer: false,
          timeout: 30_000,
        },
      }),
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
