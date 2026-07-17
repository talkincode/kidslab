import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  // CI runner 无 GPU，WebGL 课件（three.js）软件渲染更慢，放宽超时
  timeout: process.env.CI ? 60000 : 30000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      args: process.env.CI
        ? [
            // Chromium 139+ 在无 GPU 环境默认禁用 SwiftShader 软件 WebGL，
            // 缺少该开关时 three.js 课件（plant-lab/magic-cube）初始化挂起导致超时
            '--enable-unsafe-swiftshader',
          ]
        : [],
    },
  },
  webServer: {
    command: 'npm run preview -- 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'desktop',
      use: { viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile',
      use: {
        viewport: { width: 375, height: 667 },
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
});
