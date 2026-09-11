import { defineConfig } from '@playwright/test';
const apiPort = process.env.EHR_FOUNDATION_API_PORT ?? '4188';
const webPort = process.env.EHR_FOUNDATION_WEB_PORT ?? '5188';
const apiTarget = `http://127.0.0.1:${apiPort}`;
export default defineConfig({
  testDir: './tests/web', use: { baseURL: `http://127.0.0.1:${webPort}`, headless: true },
  webServer: [
    { command: 'pnpm dev:api', env: {HOST:'127.0.0.1',PORT:apiPort}, url: `${apiTarget}/health/live`, reuseExistingServer: false },
    { command: `pnpm --filter @ehr/clinical-app exec vite --host 127.0.0.1 --port ${webPort} --strictPort`, env: {EHR_API_TARGET:apiTarget}, url: `http://127.0.0.1:${webPort}`, reuseExistingServer: false },
  ],
});
