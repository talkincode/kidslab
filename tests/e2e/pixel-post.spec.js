import { test, expect } from '@playwright/test';

const STAMP_PIXELS = [
  9, 10, 13, 14,
  16, 17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30, 31,
  33, 34, 35, 36, 37, 38,
  42, 43, 44, 45,
  51, 52,
];

async function setCells(page, selector, indexes) {
  for (const index of indexes) {
    await page.locator(`${selector}[data-pixel="${index}"], ${selector}[data-bit-cell="${index}"]`).click();
  }
}

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    actionBottom: document.querySelector('#actionBtn').getBoundingClientRect().bottom,
  }));
  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.actionBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
}

test.describe('pixel post office', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.pixel-post');
      localStorage.removeItem('kidslab.progress.pixel-post');
    });
    await page.goto('/courseware/pixel-post/');
  });

  test('recovers from mistakes and completes pixel, binary, and RLE tasks', async ({ page }) => {
    await page.locator('#actionBtn').click();
    await expect(page.locator('#feedback')).toContainText('还有 32 格没点亮');

    await setCells(page, '', STAMP_PIXELS);
    await page.locator('#actionBtn').click();
    await expect(page.getByRole('heading', { name: '邮票装进了 64 个格子！' })).toBeVisible();
    await page.getByRole('button', { name: '下一站' }).click();
    await expectFitsViewport(page);

    await setCells(page, '', [0]);
    await page.locator('#actionBtn').click();
    await expect(page.locator('#feedback')).toContainText('这一行还没有对上');
    await setCells(page, '', [0, 2, 3, 4, 5]);
    await page.locator('#actionBtn').click();

    await setCells(page, '', [1, 6]);
    await page.locator('#actionBtn').click();
    await setCells(page, '', [0, 2, 5, 7]);
    await page.locator('#actionBtn').click();
    await expect(page.getByRole('heading', { name: '小猫从电报里出现了！' })).toBeVisible();
    await page.getByRole('button', { name: '下一站' }).click();
    await expectFitsViewport(page);

    await page.locator('[data-rle="1×0 · 1×1"]').click();
    await expect(page.locator('#feedback')).toContainText('这段报码不匹配');
    await page.locator('[data-rle="4×0 · 4×1"]').click();
    await page.locator('[data-rle="2×0 · 3×1 · 3×0"]').click();
    await page.locator('[data-rle="1×0 · 1×1 · 1×0 · 1×1 · 1×0 · 1×1 · 1×0 · 1×1"]').click();

    await expect(page.getByRole('heading', { name: '电报费砍半，包裹发车！' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.pixel-post') || 'null')?.status)).toBe('completed');
  });

  test('switches language, theme, and sound while fitting the viewport', async ({ page }) => {
    await page.getByRole('button', { name: 'EN' }).click();
    await expect(page).toHaveTitle('🖼️ Pixel Post Office · KidsLab');
    await expect(page.getByRole('heading', { name: 'Copy the heart stamp' })).toBeVisible();
    await page.getByRole('button', { name: 'Switch theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'Mute sound' }).click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page);
  });
});
