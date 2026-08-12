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
    noteFont: Number.parseFloat(getComputedStyle(document.querySelector('#brainNote')).fontSize),
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width }) => width < 44)).toEqual([]);
  expect(layout.controls.filter(({ height }) => height < 44)).toEqual([]);
  expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.noteFont).toBeGreaterThanOrEqual(16);
}

async function runStrategy(page, strategy) {
  await expect(page.locator('body')).toHaveAttribute('data-running', 'false', { timeout: 15000 });
  await page.locator(`[data-strategy="${strategy}"]`).click();
  await expect(page.locator(`[data-strategy="${strategy}"]`)).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#runBtn').click();
  /* 以结果文案为准：比 data-running 更稳，覆盖动画收尾与状态写入 */
  await expect(page.locator('#status')).not.toContainText(/正在执行|is running/i, { timeout: 15000 });
  await expect(page.locator('body')).toHaveAttribute('data-running', 'false');
}

test.describe('robo-vacuum lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      if (!localStorage.getItem('kidslab.lang')) localStorage.setItem('kidslab.lang', 'zh');
      if (!localStorage.getItem('kidslab.theme')) localStorage.setItem('kidslab.theme', 'light');
    });
    await page.goto('/courseware/vacuum-lab/');
  });

  test('recovers from wrong strategies and completes all three rooms', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '谁能少走冤枉路？' })).toBeVisible();
    await page.locator('#runBtn').click();
    await expect(page.locator('#status')).toContainText('芯片舱还是空的');

    await runStrategy(page, 'random');
    await expect(page.locator('#status')).toContainText('覆盖不够整齐');
    await expect(page.locator('#coverageValue')).toContainText('72');
    await runStrategy(page, 'sweep');
    await expect(page.locator('#status')).toContainText('弓字清扫赢了');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '直来直去会被困住吗？' })).toBeVisible();
    await runStrategy(page, 'sweep');
    await expect(page.locator('#status')).toContainText('障碍间反复绕路');
    await runStrategy(page, 'random');
    await expect(page.locator('#status')).toContainText('随机转向逆袭');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '灰尘全躲在墙边' })).toBeVisible();
    await runStrategy(page, 'random');
    await expect(page.locator('#status')).toContainText('离墙边的灰尘太远');
    await runStrategy(page, 'wall');

    await expect(page.getByRole('heading', { name: '首席机器人策略师！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.vacuum-lab') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, persistence, and required viewport', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Who Wastes the Fewest Steps?' })).toBeVisible();
    await expect(page.locator('#missionNav')).toHaveAttribute('aria-label', 'Test rooms');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);

    await runStrategy(page, 'sweep');
    await expect(page.locator('#nextBtn')).toBeVisible();
    await page.reload();
    await expect(page.locator('#nextBtn')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('heading', { name: 'Who Wastes the Fewest Steps?' })).toBeVisible();
  });
});
