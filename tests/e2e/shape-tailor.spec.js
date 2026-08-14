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
    canvasHeight: document.querySelector('#sceneCanvas').getBoundingClientRect().height,
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  if (layout.viewportWidth >= 900) {
    expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  }
  expect(layout.controls.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);
  expect(layout.controls.filter(({ font }) => font < 16)).toEqual([]);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.canvasHeight).toBeGreaterThanOrEqual(105);
}

async function setGuess(page, value) {
  await expect(page.locator('#quoteCard')).toBeVisible();
  const current = Number(await page.locator('#guessValue').textContent());
  const delta = value - current;
  if (delta === 0) return;
  const button = delta > 0 ? page.locator('#plusBtn') : page.locator('#minusBtn');
  for (let i = 0; i < Math.abs(delta); i += 1) {
    await button.click({ force: true });
  }
  await expect(page.locator('#guessValue')).toHaveText(String(value));
}

async function clearOrder(page, answer) {
  await expect(page.locator('#cutBtn')).toBeVisible();
  await page.locator('#cutBtn').click({ force: true });
  await expect(page.locator('#stage')).toHaveAttribute('data-phase', 'cut', { timeout: 10000 });
  await expect(page.locator('#slideBtn')).toBeVisible({ timeout: 10000 });
  await page.locator('#slideBtn').click({ force: true });
  await expect(page.locator('#stage')).toHaveAttribute('data-phase', /snapped|quote/, { timeout: 10000 });
  await expect(page.locator('#quoteBtn')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#status')).toContainText(/长方形|rectangle|拼|join|平均|average/i);
  await setGuess(page, answer);
  await page.locator('#quoteBtn').click({ force: true });
  await expect(page.locator('#nextBtn')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#status')).toContainText(String(answer));
  await page.locator('#nextBtn').click({ force: true });
}

test.describe('shape tailor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/courseware/shape-tailor/');
    await page.evaluate(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.shape-tailor');
      localStorage.removeItem('kidslab.progress.shape-tailor');
    });
    await page.reload();
  });

  test('desktop and touch complete three cut-and-quote orders with retry', async ({ page }, testInfo) => {
    await expect(page.getByRole('heading', { name: '只会给长方形报价' })).toBeVisible();
    await expectFitsViewport(page);

    // wrong quote then correct on parallelogram
    await expect(page.locator('#cutBtn')).toBeVisible();
    await page.locator('#cutBtn').click({ force: true });
    await expect(page.locator('#stage')).toHaveAttribute('data-phase', 'cut');
    await page.locator('#slideBtn').click({ force: true });
    await expect(page.locator('#quoteBtn')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#formulaText')).toContainText('8 × 5');
    await setGuess(page, 30);
    await page.locator('#quoteBtn').click({ force: true });
    await expect(page.locator('#status')).toContainText('30');
    await expect(page.locator('#stage')).toHaveAttribute('data-result', 'wrong');
    await setGuess(page, 40);
    await page.locator('#quoteBtn').click({ force: true });
    await expect(page.locator('#status')).toContainText('8 × 5 = 40');
    await page.locator('#nextBtn').click({ force: true });

    await expect(page.getByRole('heading', { name: '两块一样的才能拼' })).toBeVisible();
    await clearOrder(page, 24);

    await expect(page.getByRole('heading', { name: '上下底一加就好算' })).toBeVisible();
    await expect(page.locator('#cutBtn')).toBeVisible();
    await page.locator('#cutBtn').click({ force: true });
    await expect(page.locator('#stage')).toHaveAttribute('data-phase', 'cut');
    await page.locator('#slideBtn').click({ force: true });
    await expect(page.locator('#quoteBtn')).toBeVisible({ timeout: 10000 });
    await setGuess(page, 32);
    await page.locator('#quoteBtn').click({ force: true });
    await expect(page.locator('#status')).toContainText('32');
    await page.locator('#nextBtn').click({ force: true });

    await expect(page.getByRole('heading', { name: '你剪出了面积公式墙！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('#course')).toHaveJSProperty('inert', true);
    await expect(page.locator('#finaleGrid article')).toHaveCount(3);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.shape-tailor') || 'null')?.status)).toBe('completed');

    // touch path is same controls; assert project name for mobile project
    if (testInfo.project.name.includes('mobile') || testInfo.project.name.includes('phone')) {
      await expectFitsViewport(page);
    }
  });

  test('persists progress and supports language, theme, sound, and target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('#cutBtn').click({ force: true });
    await expect(page.locator('#stage')).toHaveAttribute('data-phase', 'cut');
    await page.locator('#slideBtn').click({ force: true });
    await expect(page.locator('#quoteBtn')).toBeVisible({ timeout: 10000 });
    await setGuess(page, 40);
    await page.locator('#quoteBtn').click({ force: true });
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'We only price rectangles' })).toBeVisible();
    await expect(page.locator('#status')).toContainText('40');
    await expectFitsViewport(page);

    await page.reload();
    await expect(page.locator('#nextBtn')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#guessValue')).toHaveText('40');
    await expectFitsViewport(page);
  });

  test('restores completion and can reopen the shop', async ({ page }) => {
    await clearOrder(page, 40);
    await clearOrder(page, 24);
    await clearOrder(page, 32);
    await expect(page.locator('#finale')).toBeVisible();

    await page.reload();
    await expect(page.locator('#finale')).toBeVisible();
    await expect(page.getByRole('heading', { name: '你剪出了面积公式墙！' })).toBeVisible();

    await page.locator('#playAgainBtn').click();
    await expect(page.locator('#finale')).toBeHidden();
    await expect(page.getByRole('heading', { name: '只会给长方形报价' })).toBeVisible();
    await expect(page.locator('#cutBtn')).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      localStorage.getItem('kidslab.progress.shape-tailor'))).toBeNull();
  });
});
