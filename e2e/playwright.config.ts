import { defineConfig, devices } from '@playwright/test';

/**
 * E2E tests assume:
 * - Frontend running on http://localhost:5173 (npm run dev in frontend/)
 * - Backend running on http://localhost:3333 (npm run dev in backend/ or Docker)
 *
 * To run: cd e2e && npm install && npm run install:browsers && npm test
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
