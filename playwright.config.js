// @ts-check
const { defineConfig, devices } = require('@playwright/test');
process.loadEnvFile('.env');

if (!process.env.BASE_URL) {
  throw new Error('BASE_URL must be defined in .env');
}

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  workers: 3,
  timeout: 60000,

  expect: {
    timeout: 5000,
  },

  use: {
    baseURL: process.env.BASE_URL,
  },
  projects: [
    {
      name: 'chrome',

      use: {
        browserName: 'chromium',
        headless: false,

       

        ignoreHTTPSErrors: true,

        permissions: ['geolocation'],

        screenshot: 'on',
        trace: 'on',
        video: 'retain-on-failure',

        launchOptions: {
          slowMo: 1000,
        }
      }
    },
    /*{
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },*/
  ],
});
