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
          text: element.textContent.trim(),
          width: rect.width,
          height: rect.height,
          font: Number.parseFloat(getComputedStyle(element).fontSize),
        };
      })
      .filter(({ width, height }) => width > 0 && height > 0),
    statusFont: Number.parseFloat(getComputedStyle(document.querySelector('#status')).fontSize),
    sceneHeight: document.querySelector('#brewScene:not([hidden]), #coinScene:not([hidden])').getBoundingClientRect().height,
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);
  expect(layout.controls.filter(({ font }) => font < 16)).toEqual([]);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.sceneHeight).toBeGreaterThanOrEqual(120);
}

async function solveFirstRecipe(page) {
  await page.locator('[data-option="1"]').click();
  await page.locator('#checkBtn').click();
  await expect(page.locator('#status')).toContainText('15 ÷ 5 = 3');
  await page.locator('#nextBtn').click();
}

async function solveSecondRecipe(page) {
  await page.locator('[data-option="2"]').click();
  await page.locator('#checkBtn').click();
  await expect(page.locator('#status')).toContainText('同时乘 100');
  await page.locator('#nextBtn').click();
}

test.describe('potion ratio workshop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.potion-ratio');
      localStorage.removeItem('kidslab.progress.potion-ratio');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/potion-ratio/');
  });

  test('recovers from bad ratios and completes all three recipes', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '熬出 15 勺月光药' })).toBeVisible();
    await page.locator('[data-option="0"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('比例跑掉了');
    await expect(page.locator('#brewery')).toHaveAttribute('data-result', 'wrong');

    await solveFirstRecipe(page);
    await expect(page.getByRole('heading', { name: '把小配方放大 100 倍' })).toBeVisible();
    await page.locator('[data-option="1"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('还不到 500 勺');

    await solveSecondRecipe(page);
    await expect(page.getByRole('heading', { name: '按 2:3:5 分 100 枚金币' })).toBeVisible();
    await page.locator('[data-option="2"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('没有按出资份数分');

    await page.locator('[data-option="1"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('20、30、50');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '黄金量杯授予你！' })).toBeVisible();
    await expect(page.locator('.finale__formulas')).toContainText('3 : 2 = 300 : 200');
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('#course')).toHaveJSProperty('inert', true);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.potion-ratio') || 'null')?.status)).toBe('completed');
  });

  test('persists progress and supports preferences and target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('[data-option="1"]').click();
    await page.locator('#checkBtn').click();
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Brew 15 spoons of moon potion' })).toBeVisible();
    await expect(page.locator('#status')).toContainText('15 ÷ 5 = 3');
    await expectFitsViewport(page);

    await page.reload();
    await expect(page.locator('[data-option="1"]')).toHaveClass(/is-right/);
    await expect(page.locator('#nextBtn')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page);
  });

  test('restores completion and can open a fresh workshop', async ({ page }) => {
    await solveFirstRecipe(page);
    await solveSecondRecipe(page);
    await page.locator('[data-option="1"]').click();
    await page.locator('#checkBtn').click();
    await page.locator('#nextBtn').click();
    await page.reload();

    await expect(page.getByRole('heading', { name: '黄金量杯授予你！' })).toBeVisible();
    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '熬出 15 勺月光药' })).toBeVisible();
    await expect(page.locator('#checkBtn')).toBeDisabled();
  });
});
