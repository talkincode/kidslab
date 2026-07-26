import { defineConfig } from '@playwright/test';

const e2ePort = Number(process.env.KIDSLAB_E2E_PORT || 4173);
const e2eBaseURL = `http://127.0.0.1:${e2ePort}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // 大型 Three.js 页面和 PWA 离线服务器并发时会争抢软件渲染/端口资源，
  // 表现为无关的 localStorage 轮询或临时服务器恢复超时。CI 串行换稳定性。
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
      ]
    : 'list',
  // CI runner 无 GPU，WebGL 课件（three.js）软件渲染更慢，放宽超时
  timeout: process.env.CI ? 60000 : 30000,
  use: {
    baseURL: e2eBaseURL,
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
    command: `npm run preview -- ${e2ePort}`,
    url: e2eBaseURL,
    // 复用同端口的任意静态服务器可能让测试误连到其他工作区。
    reuseExistingServer: false,
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
