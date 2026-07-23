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
      localStorage.setItem('kidslab.sound.muted', 'true');
      localStorage.removeItem('kidslab.grid-tower');
      localStorage.removeItem('kidslab.progress.grid-tower');
    });
    await page.goto('/courseware/grid-tower/');
  });

  test('recovers from a wrong partial product and completes all three blueprints', async ({ page }) => {
    // 热身楼：答错给方向性提示，答对窗户点亮
    await page.getByRole('button', { name: '10 × 6 = ?', exact: true }).click();
    await page.getByRole('button', { name: '50', exact: true }).click();
    await expect(page.locator('#feedback')).toContainText('数小了');
    await expect(page.getByRole('button', { name: '60', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: '60', exact: true }).click();
    await expect(page.locator('.zone.is-built .windows i').first()).toBeVisible();
    await solveZone(page, '3 × 6 = ?', 18);
    await page.getByRole('button', { name: '78', exact: true }).click();
    await expect(page.getByRole('heading', { name: '第一栋楼封顶！' })).toBeVisible();
    await expect(page.locator('#modalXray')).toContainText('竖式 X 光');

    // 摩天楼：四块施工区 + 总数
    await page.getByRole('button', { name: '下一张施工图' }).click();
    await solveZone(page, '20 × 10 = ?', 200);
    await solveZone(page, '3 × 10 = ?', 30);
    await solveZone(page, '20 × 4 = ?', 80);
    await solveZone(page, '3 × 4 = ?', 12);
    await page.getByRole('button', { name: '322', exact: true }).click();
    await expect(page.getByRole('heading', { name: '摩天楼全部亮灯！' })).toBeVisible();

    // 拆迁队：逐层拆 = 重复减法，随时抢答层数
    await page.getByRole('button', { name: '下一张施工图' }).click();
    const demolish = page.getByRole('button', { name: '🧨 拆一层', exact: true });
    await demolish.click();
    await expect(page.locator('#equation')).toContainText('还剩 288 间');
    await demolish.click();
    await expect(page.locator('#equation')).toContainText('还剩 264 间');
    await page.getByRole('button', { name: '24', exact: true }).click();
    await expect(page.locator('#feedback')).toContainText('太多了');
    await page.getByRole('button', { name: '13', exact: true }).click();
    await expect(page.getByRole('heading', { name: '拆迁规划完成！' })).toBeVisible();
    await expect(page.locator('#equation')).toContainText('312 ÷ 24 = 13');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.grid-tower') || 'null')?.status)).toBe('completed');
  });

  test('keeps the core play area inside viewports and toggles sound', async ({ page }) => {
    await expect(page.locator('#tower')).toBeVisible();
    await expect(page.locator('#hintBtn')).toBeVisible();
    await expectFitsViewport(page);

    // 拆迁关(控制卡最高)也要一屏放下
    await page.addInitScript(() => localStorage.setItem('kidslab.grid-tower', JSON.stringify({ level: 2, unlocked: 2 })));
    await page.reload();
    await expect(page.locator('#demolishBtn')).toBeVisible();
    await expectFitsViewport(page);

    const sound = page.locator('#soundBtn');
    await expect(sound).toHaveAttribute('aria-pressed', 'true');
    await sound.click();
    await expect(sound).toHaveAttribute('aria-pressed', 'false');
    await sound.click();
    await expect(sound).toHaveAttribute('aria-pressed', 'true');
  });
});
