import { test, expect } from '@playwright/test';

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    buttonHeights: [...document.querySelectorAll('button:not([hidden])')]
      .map((button) => button.getBoundingClientRect().height)
      .filter((height) => height > 0),
    bodyFont: Number.parseFloat(getComputedStyle(document.querySelector('#missionText')).fontSize),
    feedbackFont: Number.parseFloat(getComputedStyle(document.querySelector('#feedback')).fontSize),
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(Math.min(...layout.buttonHeights)).toBeGreaterThanOrEqual(44);
  expect(layout.bodyFont).toBeGreaterThanOrEqual(16);
  expect(layout.feedbackFont).toBeGreaterThanOrEqual(16);
}

test.describe('tiny harbor buoyancy lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.tiny-harbor');
      localStorage.removeItem('kidslab.progress.tiny-harbor');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/tiny-harbor/');
  });

  test('recovers from an overloaded ferry and completes all three missions', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '给渡船装 4 箱货' })).toBeVisible();

    for (let crate = 0; crate < 6; crate += 1) {
      await page.getByRole('button', { name: '＋ 装一箱' }).click();
    }
    await expect(page.locator('#feedback')).toContainText('第 6 箱让水漫进船舱');
    await expect(page.locator('#waterlineValue')).toHaveText('进水');

    await page.getByRole('button', { name: '－ 卸一箱' }).click();
    await page.getByRole('button', { name: '－ 卸一箱' }).click();
    await expect(page.locator('#readout')).toContainText('4 / 4');
    await page.getByRole('button', { name: '鸣笛出港' }).click();

    await expect(page.getByRole('heading', { name: '把泥球变成小船' })).toBeVisible();
    await page.getByRole('button', { name: '放进水里' }).click();
    await expect(page.locator('#feedback')).toContainText('泥球沉底了');

    await page.getByRole('button', { name: '⏝ 捏成小碗' }).click();
    await page.getByRole('button', { name: '放进水里' }).click();
    await expect(page.locator('#feedback')).toContainText('小碗浮起来了');
    for (let bolt = 0; bolt < 3; bolt += 1) {
      await page.getByRole('button', { name: '＋ 放一颗螺丝帽' }).click();
    }

    await expect(page.getByRole('heading', { name: '先猜，再把材料扔下水' })).toBeVisible();
    await page.getByRole('button', { name: '我猜会沉' }).click();
    await page.getByRole('button', { name: '扑通！放进水' }).click();
    await expect(page.locator('#feedback')).toContainText('这次和猜想不同');
    await page.getByRole('button', { name: '试下一个' }).click();

    for (const prediction of ['我猜会沉', '我猜会沉', '我猜会浮']) {
      await page.getByRole('button', { name: prediction }).click();
      await page.getByRole('button', { name: '扑通！放进水' }).click();
      await page.getByRole('button', { name: '试下一个' }).click();
    }

    await expect(page.getByRole('heading', { name: '小小浮力工程师' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.tiny-harbor') || 'null')?.status)).toBe('completed');
  });

  test('keeps controls readable across themes, languages, and viewport sizes', async ({ page }) => {
    await expectFitsViewport(page);
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Load 4 crates on the ferry' })).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Load a crate' })).toBeVisible();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });
});
