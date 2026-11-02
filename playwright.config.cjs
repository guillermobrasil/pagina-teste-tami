const {defineConfig} = require('@playwright/test');
module.exports = defineConfig({
  testDir: './browser-tests', timeout: 30000, workers: 1,
  use: {baseURL: 'http://127.0.0.1:3100', browserName: 'chromium', headless: true, screenshot: 'only-on-failure'},
  webServer: {command: 'node server.js', url: 'http://127.0.0.1:3100', env: {PORT:'3100'}, reuseExistingServer: true}
});
