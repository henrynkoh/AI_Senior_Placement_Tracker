const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  timeout: 20000,
  retries: 1,
  use: { browserName: 'chromium', headless: true, acceptDownloads: true },
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: false,
    timeout: 20000
  }
});