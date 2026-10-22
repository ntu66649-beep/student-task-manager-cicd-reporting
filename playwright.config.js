// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Test Configuration for Student Task Manager - CI/CD & Reporting
 * Course: SWT301 - Software Testing
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  /* Run tests sequentially to prevent state collision in localStorage */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Single worker to guarantee clean state isolation between test cases */
  workers: 1,
  /* Reporter configuration: console list + HTML Report + Allure Report */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: true
    }]
  ],
  /* Shared settings for all test projects */
  use: {
    /* Base URL for relative page.goto() navigation */
    baseURL: 'http://localhost:3000',

    /* Collect traces, screenshots and videos for debugging failed tests */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  /* Test on Chromium */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  /* Run local dev web server automatically before starting tests */
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 15 * 1000
  }
});
