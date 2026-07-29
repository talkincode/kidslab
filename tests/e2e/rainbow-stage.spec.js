import { test, expect } from '@playwright/test';

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    controls: [...document.querySelectorAll('button:not([hidden]), a:not([hidden]), input:not([hidden])')]
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
    lessonFont: Number.parseFloat(getComputedStyle(document.querySelector('#lessonText')).fontSize),
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width }) => width < 44)).toEqual([]);
  expect(layout.controls.filter(({ height }) => height < 44)).toEqual([]);
  expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.lessonFont).toBeGreaterThanOrEqual(16);
}

test.describe('rainbow stage', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.rainbow-stage');
    });
    await page.goto('/courseware/rainbow-stage/');
  });

  test('recovers from wrong mixes and completes all three color experiments', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '把三束色光叠成白色' })).toBeVisible();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('还没有灯亮');
    await page.locator('[data-light="red"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('还不是白色');
    await page.locator('[data-light="green"]').click();
    await page.locator('[data-light="blue"]').click();
    await expect(page.locator('#resultName')).toHaveText('白光');
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('白光出现了');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '从颜料里留下绿色' })).toBeVisible();
    await page.locator('[data-pigment="magenta"]').click();
    await page.locator('[data-pigment="yellow"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('没有留下绿色');
    await page.locator('#clearPaintBtn').click();
    await page.locator('[data-pigment="cyan"]').click();
    await page.locator('[data-pigment="yellow"]').click();
    await expect(page.locator('#resultName')).toHaveText('绿色');
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('绿色调好了');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '把白光里的彩虹展开' })).toBeVisible();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('白光还没打开');
    await page.locator('#shineBtn').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('彩带还没落进');
    await page.locator('#prismSlider').fill('3');
    await page.locator('#shineBtn').click();
    await page.locator('#checkBtn').click();

    await expect(page.getByRole('heading', { name: '青蛙音乐节亮起来了！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.rainbow-stage') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, and both target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Overlap Three Beams into White' })).toBeVisible();
    await expect(page.locator('#missionNav')).toHaveAttribute('aria-label', 'Stage missions');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('keeps every act readable in Chinese and English', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.rainbow-stage', JSON.stringify({ unlocked: 2, completed: [0, 1] }));
    });
    await page.reload();

    for (let index = 0; index < 3; index += 1) {
      await page.locator('#missionNav button').nth(index).click();
      await expectFitsViewport(page);
    }

    await page.locator('#langBtn').click();
    for (let index = 0; index < 3; index += 1) {
      await page.locator('#missionNav button').nth(index).click();
      await expectFitsViewport(page);
    }
  });
});
