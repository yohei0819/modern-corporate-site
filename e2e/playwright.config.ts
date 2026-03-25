import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'public-site',
      use: {
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'admin',
      use: {
        baseURL: 'http://localhost:5173',
      },
    },
  ],
});
