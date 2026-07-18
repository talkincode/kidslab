import { test, expect } from '@playwright/test';

async function solveZone(page, label, answer) {
  await page.getByRole('button', { name: label, exact: true }).click();
  await page.getByRole('button', { name: String(answer), exact: true }).click();
}

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    answerBottom: document.querySelector('#hintBtn').getBoundingClientRect().bottom,
  }));
  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.answerBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
}

test.describe('grid tower area model', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.grid-tower');
      localStorage.removeItem('kidslab.progress.grid-tower');
    });
    await page.goto('/courseware/grid-tower/');
  });

  test('recovers from a wrong partial product and completes all three blueprints', async ({ page }) => {
    await page.getByRole('button', { name: '10 × 6 = ?', exact: true }).click();
    await page.getByRole('button', { name: '50', exact: true }).click();
    await expect(page.locator('#feedback')).toContainText('再算一次');
    await expect(page.getByRole('button', { name: '60', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: '60', exact: true }).click();
    await solveZone(page, '3 × 6 = ?', 18);
    await page.getByRole('button', { name: '78', exact: true }).click();
    await expect(page.getByRole('heading', { name: '第一栋楼封顶！' })).toBeVisible();

    await page.getByRole('button', { name: '下一张施工图' }).click();
    await solveZone(page, '20 × 10 = ?', 200);
    await solveZone(page, '3 × 10 = ?', 30);
    await solveZone(page, '20 × 4 = ?', 80);
    await solveZone(page, '3 × 4 = ?', 12);
    await page.getByRole('button', { name: '322', exact: true }).click();
    await expect(page.getByRole('heading', { name: '摩天楼全部亮灯！' })).toBeVisible();

    await page.getByRole('button', { name: '下一张施工图' }).click();
    await solveZone(page, '20 × 10 = ?', 200);
    await solveZone(page, '4 × 10 = ?', 40);
    await solveZone(page, '20 × 3 = ?', 60);
    await solveZone(page, '4 × 3 = ?', 12);
    await page.getByRole('button', { name: '13', exact: true }).click();
    await expect(page.getByRole('heading', { name: '拆迁规划完成！' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.grid-tower') || 'null')?.status)).toBe('completed');
  });

  test('keeps the core play area inside desktop and phone viewports', async ({ page }) => {
    await expect(page.locator('#tower')).toBeVisible();
    await expect(page.locator('#hintBtn')).toBeVisible();
    await expectFitsViewport(page);
  });
});
