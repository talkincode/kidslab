import { test, expect } from '@playwright/test';

async function wear(page, hat, top) {
  await page.getByRole('button', { name: hat, exact: true }).click();
  await page.getByRole('button', { name: top, exact: true }).click();
  await page.getByRole('button', { name: '✨ 穿上这套', exact: true }).click();
}

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    hintBottom: document.querySelector('#hintBtn').getBoundingClientRect().bottom,
  }));
  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.hintBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
}

test.describe('combo closet multiplication principle', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.combo-closet');
      localStorage.removeItem('kidslab.progress.combo-closet');
    });
    await page.goto('/courseware/combo-closet/');
  });

  test('recovers from a duplicate and completes collecting and reverse design', async ({ page }) => {
    await wear(page, '草帽', '星星上衣');
    await wear(page, '草帽', '星星上衣');
    await expect(page.locator('#feedback')).toContainText('已经走过秀');

    await wear(page, '草帽', '彩虹上衣');
    await wear(page, '贝雷帽', '星星上衣');
    await wear(page, '贝雷帽', '彩虹上衣');
    await expect(page.getByRole('heading', { name: '四套搭配都开花啦！' })).toBeVisible();

    await page.getByRole('button', { name: '下一张造型单' }).click();
    for (const hat of ['派对帽', '小礼帽', '云朵帽']) {
      for (const top of ['花朵上衣', '波点上衣']) await wear(page, hat, top);
    }
    await expect(page.getByRole('heading', { name: '六套花园造型全部登场！' })).toBeVisible();

    await page.getByRole('button', { name: '下一张造型单' }).click();
    await page.getByRole('button', { name: '📦 提交进货单', exact: true }).click();
    await expect(page.locator('#feedback')).toContainText('还不是 12 套');
    await page.getByRole('button', { name: '3 顶帽子', exact: true }).click();
    await page.getByRole('button', { name: '4 件上衣', exact: true }).click();
    await page.getByRole('button', { name: '📦 提交进货单', exact: true }).click();

    await expect(page.getByRole('heading', { name: '12 套时装秀进货完成！' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.combo-closet') || 'null')?.status)).toBe('completed');
  });

  test('switches language and theme while keeping the core play area in view', async ({ page }) => {
    await expect(page.locator('#comboTree')).toBeVisible();
    await expectFitsViewport(page);

    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Wear this outfit', exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expectFitsViewport(page);
  });
});
