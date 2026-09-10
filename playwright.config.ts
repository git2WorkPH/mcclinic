import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/web', use: { baseURL: 'http://127.0.0.1:5173', headless: true },
  webServer: [
    { command: 'pnpm dev:api', url: 'http://127.0.0.1:4000/health/live', reuseExistingServer: false },
    { command: 'pnpm dev:web', url: 'http://127.0.0.1:5173', reuseExistingServer: false },
  ],
});
