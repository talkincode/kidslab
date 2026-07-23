import { test, expect } from '@playwright/test';

async function tapItem(page, name) {
  await page.getByRole('button', { name, exact: true }).click();
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
      localStorage.setItem('kidslab.sound.muted', 'true');
      localStorage.removeItem('kidslab.combo-closet');
      localStorage.removeItem('kidslab.progress.combo-closet');
    });
    await page.goto('/courseware/combo-closet/');
  });

  test('recovers from a duplicate and completes collecting and both stock orders', async ({ page }) => {
    // 试衣间 2×2：穿戴即自动拍照，重穿已有搭配要能原地恢复
    await tapItem(page, '草帽');
    await tapItem(page, '星星上衣');
    await expect(page.locator('#orderStamp')).toHaveText('1 / 4');

    await tapItem(page, '贝雷帽');
    await expect(page.locator('#orderStamp')).toHaveText('2 / 4');

    await tapItem(page, '草帽');
    await expect(page.locator('#feedback')).toContainText('已经上墙');
    await expect(page.locator('#orderStamp')).toHaveText('2 / 4');

    await tapItem(page, '彩虹上衣');
    await tapItem(page, '贝雷帽');
    await expect(page.getByRole('heading', { name: '四套造型全部上墙！' })).toBeVisible();

    // 花园秀 3×2
    await page.getByRole('button', { name: '下一张造型单' }).click();
    await tapItem(page, '派对帽');
    await tapItem(page, '花朵上衣');
    await tapItem(page, '波点上衣');
    await tapItem(page, '小礼帽');
    await tapItem(page, '花朵上衣');
    await tapItem(page, '云朵帽');
    await tapItem(page, '波点上衣');
    await expect(page.getByRole('heading', { name: '六套造型全部上墙！' })).toBeVisible();

    // 大订单：错误订单给方向性反馈，需要两张不同的 12 套进货单
    await page.getByRole('button', { name: '下一张造型单' }).click();
    await page.getByRole('button', { name: '📦 提交进货单', exact: true }).click();
    await expect(page.locator('#feedback')).toContainText('还差 8 套');

    await page.getByRole('button', { name: '3 顶帽子', exact: true }).click();
    await page.getByRole('button', { name: '4 件上衣', exact: true }).click();
    await page.getByRole('button', { name: '📦 提交进货单', exact: true }).click();
    await expect(page.locator('#feedback')).toContainText('第一张进货单盖章');

    await page.getByRole('button', { name: '📦 提交进货单', exact: true }).click();
    await expect(page.locator('#feedback')).toContainText('已经盖过章');

    await page.getByRole('button', { name: '4 顶帽子', exact: true }).click();
    await page.getByRole('button', { name: '3 件上衣', exact: true }).click();
    await page.getByRole('button', { name: '📦 提交进货单', exact: true }).click();

    await expect(page.getByRole('heading', { name: '两张进货单都盖章啦！' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.combo-closet') || 'null')?.status)).toBe('completed');
  });

  test('switches language, theme and sound while keeping the core play area in view', async ({ page }) => {
    await expect(page.locator('#comboTree')).toBeVisible();
    await expectFitsViewport(page);

    const sound = page.locator('#soundBtn');
    await expect(sound).toHaveAttribute('aria-pressed', 'true');
    await sound.click();
    await expect(sound).toHaveAttribute('aria-pressed', 'false');
    await sound.click();
    await expect(sound).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page.getByText('Hat rack', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expectFitsViewport(page);
  });
});
