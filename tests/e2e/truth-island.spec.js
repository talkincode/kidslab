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
    tipFont: Number.parseFloat(getComputedStyle(document.querySelector('#tip')).fontSize),
    statusFont: Number.parseFloat(getComputedStyle(document.querySelector('#status')).fontSize),
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(Math.min(...layout.buttonHeights)).toBeGreaterThanOrEqual(40);
  expect(layout.tipFont).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
}

test.describe('truth island', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.truth-island');
      localStorage.removeItem('kidslab.progress.truth-island');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/truth-island/');
  });

  test('recovers from wrong deductions and solves all three cases', async ({ page }) => {
    await page.locator('[data-person="mia"][data-role="liar"]').click();
    await page.locator('[data-person="noah"][data-role="truth"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('至少一句话');

    await page.locator('[data-person="mia"][data-role="truth"]').click();
    await page.locator('[data-person="noah"][data-role="liar"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.getByRole('heading', { name: '徽章严丝合缝！' })).toBeVisible();
    await page.getByRole('button', { name: '打开下一案' }).click();

    await page.locator('[data-road="right"]').click();
    await expect(page.locator('#status')).toContainText('整句话都变成假话');
    await page.locator('[data-road="left"]').click();
    await expect(page.getByRole('heading', { name: '月门线索破解！' })).toBeVisible();
    await page.getByRole('button', { name: '打开下一案' }).click();

    await page.locator('[data-question="0"]').click();
    await expect(page.locator('#status')).toContainText('你还不知道回答者');
    await page.locator('[data-question="2"]').click();
    await expect(page.locator('#islandScene')).toHaveClass(/is-pointing/);
    await page.locator('[data-final-road="right"]').click();
    await expect(page.locator('#status')).toContainText('把答案反过来');
    await page.locator('[data-final-road="left"]').click();

    await expect(page.getByRole('heading', { name: '真话岛宝藏找到！' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.truth-island') || 'null')?.status)).toBe('completed');
  });

  test('supports hints, sound, language, theme, and target viewport layout', async ({ page }) => {
    await page.locator('#hintBtn').click();
    await expect(page.locator('#status')).toContainText('先假设米娅说真话');

    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.locator('#tip')).toHaveText('Listen to each claim, then make every identity and clue agree.');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');

    await expectFitsViewport(page);
  });
});
