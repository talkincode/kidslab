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
    canvasHeight: document.querySelector('#circusCanvas').getBoundingClientRect().height,
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);
  expect(layout.controls.filter(({ font }) => font < 16)).toEqual([]);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.canvasHeight).toBeGreaterThanOrEqual(150);
}

async function finishFirstAct(page) {
  await page.locator('[data-operation="0"]').click();
  await expect(page.locator('#equation')).toHaveText('x + 10 = 28');
  await page.locator('[data-operation="0"]').click();
  await expect(page.locator('#status')).toContainText('x 重 18 kg');
  await page.locator('#nextBtn').click();
}

async function finishSecondAct(page) {
  await page.locator('[data-operation="0"]').click();
  await expect(page.locator('#equation')).toHaveText('x + 3 = 8');
  await page.locator('[data-operation="1"]').click();
  await expect(page.locator('#status')).toContainText('x 重 5 kg');
  await page.locator('#nextBtn').click();
}

test.describe('balance circus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.balance-circus');
      localStorage.removeItem('kidslab.progress.balance-circus');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/balance-circus/');
  });

  test('recovers from a one-sided tumble and solves all three acts', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '让 x 独自站稳' })).toBeVisible();
    await page.locator('[data-side="left"]').click();
    await expect(page.locator('#status')).toContainText('演员全滚下来了');
    await expect(page.locator('#equation')).toHaveText('x + 20 = 38');
    await page.waitForTimeout(1100);

    await finishFirstAct(page);
    await expect(page.getByRole('heading', { name: 'x 出现在跷跷板两边' })).toBeVisible();
    await finishSecondAct(page);

    await expect(page.getByRole('heading', { name: '把 3 个 x 平均拆开' })).toBeVisible();
    await page.locator('[data-operation="1"]').click();
    await expect(page.locator('#equation')).toHaveText('x + 2 = 10');
    await expect(page.locator('[data-operation="0"]')).toContainText('两边都撤 2');
    await page.locator('[data-operation="0"]').click();
    await expect(page.locator('#status')).toContainText('x 重 8 kg');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '蒙面演员揭面了！' })).toBeVisible();
    await expect(page.locator('#revealWeight')).toHaveText('8 kg');
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('.course')).toHaveJSProperty('inert', true);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.balance-circus') || 'null')?.status)).toBe('completed');
  });

  test('persists a legal move and supports preferences and target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('[data-operation="0"]').click();
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Leave x standing alone' })).toBeVisible();
    await expect(page.locator('#historyList')).toContainText('Remove 10 from both');
    await expectFitsViewport(page);

    await page.reload();
    await expect(page.locator('#equation')).toHaveText('x + 10 = 28');
    await expect(page.locator('#historyList')).toContainText('Remove 10 from both');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page);
  });

  test('restores completion and starts a fresh performance', async ({ page }) => {
    await finishFirstAct(page);
    await finishSecondAct(page);
    await page.locator('[data-operation="0"]').click();
    await page.locator('[data-operation="1"]').click();
    await page.locator('#nextBtn').click();
    await page.reload();

    await expect(page.getByRole('heading', { name: '蒙面演员揭面了！' })).toBeVisible();
    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '让 x 独自站稳' })).toBeVisible();
    await expect(page.locator('#equation')).toHaveText('x + 20 = 38');
  });
});
