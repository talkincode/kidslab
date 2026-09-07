import { test, expect } from '@playwright/test';

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    controls: [...document.querySelectorAll('button:not([hidden]), a:not([hidden])')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          font: Number.parseFloat(getComputedStyle(element).fontSize),
        };
      })
      .filter(({ width, height }) => width > 0 && height > 0),
    statusFont: Number.parseFloat(getComputedStyle(document.querySelector('#status')).fontSize),
    missionFont: Number.parseFloat(getComputedStyle(document.querySelector('#missionText')).fontSize),
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width }) => width < 44)).toEqual([]);
  expect(layout.controls.filter(({ height }) => height < 44)).toEqual([]);
  expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.missionFont).toBeGreaterThanOrEqual(16);
}

test.describe('air garage', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.air-garage');
      localStorage.removeItem('kidslab.progress.air-garage');
    });
    await page.goto('/courseware/air-garage/');
  });

  test('recovers from a wet tissue, empty scale, and burst engine, then finishes the garage', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '把杯子竖直扣进水里' })).toBeVisible();

    await page.locator('#dipTiltBtn').click();
    await expect(page.locator('#status')).toContainText('空气从斜口跑光了');
    await expect(page.getByRole('heading', { name: '把杯子竖直扣进水里' })).toBeVisible();
    await expect(page.locator('#readValueA')).toHaveText('湿了');

    await page.locator('#dipStraightBtn').click();
    await expect(page.getByRole('heading', { name: '扎破一只气球' })).toBeVisible();
    await expect(page.locator('#status')).toContainText('纸巾还是干的');

    await page.locator('#weighBtn').click();
    await expect(page.locator('#status')).toContainText('天平还是平的');

    await page.locator('#popLeftBtn').click();
    await page.locator('#popRightBtn').click();
    await page.locator('#weighBtn').click();
    await expect(page.locator('#status')).toContainText('空气跑光');
    await expect(page.getByRole('heading', { name: '扎破一只气球' })).toBeVisible();

    await page.locator('#resetBtn').click();
    await page.locator('#popRightBtn').click();
    await page.locator('#weighBtn').click();
    await expect(page.getByRole('heading', { name: '给赛车打满气' })).toBeVisible();
    await expect(page.locator('#status')).toContainText('天平倾斜了');

    await page.locator('#launchBtn').click();
    await expect(page.locator('#status')).toContainText('气球是瘪的');

    await page.locator('#pumpBtn').click();
    await page.locator('#pumpBtn').click();
    await page.locator('#pumpBtn').click();
    await page.locator('#launchBtn').click();
    await expect(page.locator('#status')).toContainText('没跑到终点');

    await page.locator('#resetBtn').click();
    for (let i = 0; i < 7; i += 1) await page.locator('#pumpBtn').click();
    await expect(page.locator('#status')).toContainText('气球砰地炸了');

    await page.locator('#resetBtn').click();
    await page.locator('[data-nozzle="small"]').click();
    for (let i = 0; i < 6; i += 1) await page.locator('#pumpBtn').click();
    await page.locator('#launchBtn').click();
    await expect(page.locator('#certTitle')).toHaveText('空气车库通关啦！');
    await expect(page.locator('#celebration')).toBeVisible();
    await expect(page.locator('#againBtn')).toBeFocused();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.air-garage') || 'null')?.status)).toBe('completed');
  });

  test('restores a partially completed garage and can reset the current station', async ({ page }) => {
    await page.locator('#dipStraightBtn').click();
    await expect(page.getByRole('heading', { name: '扎破一只气球' })).toBeVisible();

    const saved = await page.evaluate(() => localStorage.getItem('kidslab.air-garage'));
    expect(saved).toBeTruthy();
    await page.addInitScript((payload) => {
      localStorage.setItem('kidslab.air-garage', payload);
    }, saved);
    await page.reload();
    await expect(page.getByRole('heading', { name: '扎破一只气球' })).toBeVisible();
    await expect(page.locator('[data-route="0"]')).toHaveClass(/is-cleared/);

    await page.evaluate(() => {
      localStorage.setItem('kidslab.progress.air-garage', JSON.stringify({ status: 'played' }));
    });
    await page.locator('#resetBtn').click();
    await expect(page.getByRole('heading', { name: '扎破一只气球' })).toBeVisible();
    await expect(page.locator('#readValueC')).toHaveText('平衡');
  });

  test('supports sound, language, theme, and both target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Dip the cup straight into the water' })).toBeVisible();
    await expect(page.locator('#route')).toHaveAttribute('aria-label', 'Lab stations');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expect(page.locator('#backBtn')).toHaveAttribute('aria-label', 'Back to platform');
    await expect(page.locator('#garageCanvas')).toHaveAttribute('aria-label', 'Air experiment animation');
    await expect(page.locator('#readout')).toHaveAttribute('aria-label', 'Experiment readings');
    await expectFitsViewport(page);
  });
});
