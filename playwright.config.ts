import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  globalTeardown: "e2e/global-teardown.ts",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command: "npm run build && npm run preview",
    port: 4173,
    reuseExistingServer: !process.env.CI
  }
});
