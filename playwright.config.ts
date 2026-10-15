import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4322',
    channel: 'chrome',
  },
  projects: [
    { name: 'unit', testMatch: /(hours|booking|build|intro)\.spec\.ts/ },
    { name: 'desktop', testIgnore: /(hours|booking|build|intro)\.spec\.ts/, use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', testIgnore: /(hours|booking|build|intro)\.spec\.ts/, use: { ...devices['Pixel 7'], channel: 'chrome', viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: 'npx astro preview --force --port 4322',
    url: 'http://localhost:4322',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
