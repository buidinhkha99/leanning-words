import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Setup project: authenticate and save state
    {
      name: 'setup',
      testMatch: /global-setup\.ts/,
    },
    // Desktop Chrome (authenticated)
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: /visual|share\.spec/,
    },
    // Mobile Safari (authenticated)
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 14'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: /visual|share\.spec/,
    },
    // Public pages (no auth) - share pages
    {
      name: 'public',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: /share\.spec/,
      dependencies: ['setup'],
    },
    // Visual regression tests
    {
      name: 'visual-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: /visual/,
      grep: /@visual/,
    },
    {
      name: 'visual-mobile',
      use: {
        ...devices['iPhone 14'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: /visual/,
      grep: /@visual/,
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
