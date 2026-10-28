import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: process.env.BASE_URL ?? 'http://localhost:4321' },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'pnpm preview --port 4321 --ignore-lock',
        url: 'http://localhost:4321',
        reuseExistingServer: false,
      },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
