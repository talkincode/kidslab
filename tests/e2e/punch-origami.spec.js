import { test, expect } from '@playwright/test';

const LEVEL_PREDICTIONS = [
  ['0,1', '3,1'],
  ['0,0', '0,3', '3,0', '3,3'],
  [0, 1, 2, 3].flatMap((column) =>
    [0, 3].map((row) => `${column},${row}`)),
  [0, 1, 2, 3].flatMap((column) =>
    [0, 1, 2, 3].map((row) => `${column},${row}`)),
];

async function selectPrediction(page, cells) {
  for (const cell of cells) {
    await page.locator(`[data-cell="${cell}"]`).click();
  }
}

async function unfold(page) {
  await page.locator('#unfoldSlider').fill('100');
}

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
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width }) => width < 40)).toEqual([]);
  expect(layout.controls.filter(({ height }) => height < 40)).toEqual([]);
  expect(layout.controls
    .filter(({ width, height }) => width >= 44 && height >= 44)
    .filter(({ font }) => font < 16)).toEqual([]);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
}

test.describe('punch and fold house', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      if (!localStorage.getItem('kidslab.lang')) localStorage.setItem('kidslab.lang', 'zh');
      if (!localStorage.getItem('kidslab.theme')) localStorage.setItem('kidslab.theme', 'light');
    });
    await page.goto('/courseware/punch-origami/');
  });

  test('recovers from wrong predictions and completes all four folds', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '一折以后，孔会去哪？' })).toBeVisible();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('还没有预测');

    await page.locator('[data-cell="0,0"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('没有成镜像对');
    await expect(page.locator('[data-cell="0,0"]')).toHaveClass(/wrong/);
    await page.locator('#clearBtn').click();

    for (let level = 0; level < LEVEL_PREDICTIONS.length; level += 1) {
      await selectPrediction(page, LEVEL_PREDICTIONS[level]);
      await page.locator('#checkBtn').click();
      await expect(page.locator('#status')).toContainText('预测全对');
      await expect(page.locator('#unfoldSlider')).toBeVisible();
      await unfold(page);
      await expect(page.locator('#status')).toContainText('展开完成');
      if (level < LEVEL_PREDICTIONS.length - 1) {
        await page.locator('#nextBtn').click();
      }
    }

    await expect(page.getByRole('heading', { name: '纸上开出了十六朵花！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.punch-origami') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, persistence, and required viewport', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Where Does One Fold Send the Hole?' })).toBeVisible();
    await expect(page.locator('#levelNav')).toHaveAttribute('aria-label', 'Paper rooms');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);

    await selectPrediction(page, LEVEL_PREDICTIONS[0]);
    await page.locator('#checkBtn').click();
    await unfold(page);
    await page.locator('#nextBtn').click();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Which Holes Mirror Each Other?' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
