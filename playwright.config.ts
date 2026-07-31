import { defineConfig, devices } from '@playwright/test'

const host = '127.0.0.1'
const appPort = 3100
const apiPort = 4100
const appUrl = `http://${host}:${appPort}`
const apiUrl = `http://${host}:${apiPort}`

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [['line'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results',
  snapshotPathTemplate:
    '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.015,
    },
  },
  use: {
    baseURL: appUrl,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    colorScheme: 'light',
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `node tests/support/mock-api.mjs --port ${apiPort}`,
      url: `${apiUrl}/__test/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: `pnpm dev --hostname ${host} --port ${appPort}`,
      url: appUrl,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        API_BASE_URL: apiUrl,
        NEXT_PUBLIC_API_BASE_URL: apiUrl,
        CMS_DELIVERY_BASE_URL: '',
        NEXT_DIST_DIR: '.next-e2e',
      },
    },
  ],
})
