/**
 * PWA 壳与离线缓存验收：
 *   1. manifest 合法（fullscreen、图标可达）——「添加到主屏幕」前提
 *   2. Service Worker 激活并预缓存主站壳
 *   3. cache-on-visit：玩过的课件进入运行时缓存，主站显示「可离线」角标
 *   4. 失败路径（离线回放）：专用服务器被杀死后，已玩课件仍可重新打开
 *
 * 离线回放用独立子进程服务器而非 context.setOffline()：SW 自身的 fetch
 * 不一定被 Playwright 的离线仿真覆盖，杀死服务器是真实且确定的断网。
 */
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'courseware', 'index.json'), 'utf8'));
/* 默认筛选为小学学段，选一个小学课件保证卡片出现在首屏网格 */
const course = manifest.courses.find((c) => c.levels.includes('primary'));

async function waitServiceWorkerReady(page) {
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) throw new Error('no active service worker');
  });
}

async function reserveFreePort() {
  const probe = createServer();
  await new Promise((resolve, reject) => {
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', resolve);
  });
  const { port } = probe.address();
  await new Promise((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
  return port;
}

test.describe('PWA 壳', () => {
  test('manifest 合法：fullscreen + 图标可达', async ({ page, request }) => {
    const res = await request.get('manifest.webmanifest');
    expect(res.ok(), 'manifest.webmanifest 必须可达').toBeTruthy();
    const webmanifest = JSON.parse(await res.text());
    expect(webmanifest.display).toBe('fullscreen');
    expect(webmanifest.start_url).toBe('./');
    expect(webmanifest.scope).toBe('./');
    expect(webmanifest.name).toBeTruthy();
    expect(webmanifest.icons.length).toBeGreaterThanOrEqual(2);
    const sizes = webmanifest.icons.map((i) => i.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
    expect(webmanifest.icons.some((i) => i.purpose === 'maskable')).toBeTruthy();
    for (const icon of webmanifest.icons) {
      const iconRes = await request.get(icon.src);
      expect(iconRes.ok(), `图标 ${icon.src} 必须可达`).toBeTruthy();
      expect(iconRes.headers()['content-type']).toContain('image/png');
    }

    await page.goto('/');
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', 'manifest.webmanifest');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', /#[0-9a-fA-F]{6}/);
  });

  test('Service Worker 激活并预缓存主站壳', async ({ page }) => {
    await page.goto('/');
    await waitServiceWorkerReady(page);
    const shell = await page.evaluate(async () => {
      const names = await caches.keys();
      const shellName = names.find((n) => n.startsWith('kidslab-shell-'));
      if (!shellName) return { shellName: null, urls: [] };
      const keys = await (await caches.open(shellName)).keys();
      return { shellName, urls: keys.map((k) => new URL(k.url).pathname + new URL(k.url).search) };
    });
    expect(shell.shellName, '必须存在版本化的壳缓存').toBeTruthy();
    expect(shell.urls.length).toBeGreaterThanOrEqual(10);
    expect(shell.urls.some((u) => u.endsWith('/'))).toBeTruthy();
    expect(shell.urls.some((u) => u.includes('assets/css/app.css?v='))).toBeTruthy();
    expect(shell.urls.some((u) => u.includes('courseware/index.json'))).toBeTruthy();
  });
});

test.describe('课件离线（cache-on-visit + 离线回放）', () => {
  let server;
  let serverError = '';
  let origin;

  async function stopServer() {
    const child = server;
    server = undefined;
    if (!child || child.exitCode !== null || child.signalCode !== null) return;

    const exited = once(child, 'exit');
    child.kill('SIGKILL');
    const stopped = await Promise.race([
      exited.then(() => true),
      new Promise((resolve) => setTimeout(() => resolve(false), 5_000)),
    ]);
    if (!stopped) throw new Error(`preview server ${child.pid} did not exit`);
  }

  test.beforeAll(async ({}, testInfo) => {
    await stopServer();
    const port = await reserveFreePort();
    origin = `http://127.0.0.1:${port}`;
    serverError = '';
    server = spawn(process.execPath, ['scripts/serve.mjs', String(port)], {
      cwd: ROOT,
      env: { ...process.env, KIDSLAB_PREVIEW_HOST: '127.0.0.1' },
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    server.stderr.setEncoding('utf8');
    server.stderr.on('data', (chunk) => { serverError += chunk; });
    await expect(async () => {
      const res = await fetch(`${origin}/index.html`, { signal: AbortSignal.timeout(1_000) });
      expect(res.ok, serverError || `preview server exited with ${server.exitCode}`).toBeTruthy();
    }).toPass({ timeout: 15_000 });
  });

  test.afterAll(async () => stopServer());

  test('玩过的课件断网可重玩，主站显示可离线角标', async ({ page }) => {
    test.setTimeout(60_000);
    expect(course, '清单中必须存在小学学段课件').toBeTruthy();

    /* 1. 主站装好 SW */
    await page.goto(`${origin}/`);
    await waitServiceWorkerReady(page);

    /* 2. 在线玩课件 → cache-on-visit 进入运行时缓存 */
    await page.goto(`${origin}/${course.path}`);
    await expect(page.locator('body')).toBeVisible();
    await page.waitForFunction(async (coursePath) => {
      const cache = await caches.open('kidslab-courseware');
      return Boolean(await cache.match(new URL(coursePath, location.origin).href));
    }, `/${course.path}`);

    /* 3. 回主站：卡片出现「可离线」角标 */
    await page.goto(`${origin}/`);
    const badge = page.locator(`.card[href="${course.path}"] .card__offline`);
    await expect(badge).toBeVisible();

    /* 4. 杀死服务器 = 真实断网 */
    await stopServer();
    await expect(async () => {
      await expect(fetch(`${origin}/index.html`, {
        signal: AbortSignal.timeout(1_000),
      })).rejects.toThrow();
    }).toPass({ timeout: 15_000 });

    /* 5. 断网重开该课件：SW 缓存兜底，页面正常加载且无脚本错误 */
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(`${origin}/${course.path}`);
    await expect(page.locator('body')).toBeVisible();
    const rendered = await page.evaluate(() => ({
      ready: document.readyState,
      elements: document.body.querySelectorAll('*').length,
    }));
    expect(rendered.ready).toBe('complete');
    expect(rendered.elements, '离线页面必须渲染出实际内容').toBeGreaterThan(3);
    expect(pageErrors, '离线回放不得出现脚本错误').toEqual([]);

    /* 6. 断网打开主站壳也可用（预缓存兜底） */
    await page.goto(`${origin}/`);
    await expect(page.locator('#grid .card').first()).toBeVisible();
  });
});
