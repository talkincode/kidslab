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
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);
  expect(layout.controls.filter(({ font, text }) => font < 14 && text)).toEqual([]);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
}

async function solveCase(page, evidence, verdict) {
  await page.locator(`[data-evidence="${evidence}"]`).click();
  await page.locator(`[data-verdict="${verdict}"]`).click();
  await page.locator('#checkBtn').click();
}

test.describe('discount detective', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.sale-detective');
      localStorage.removeItem('kidslab.progress.sale-detective');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/sale-detective/');
  });

  test('recovers from false evidence and solves all three sale cases', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '提价 25% 再打八折，真的便宜了吗？' })).toBeVisible();

    await page.locator('[data-evidence="1"]').click();
    await page.locator('[data-verdict="1"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('每次百分数都作用在当时的价格上');
    await expect(page.locator('[data-evidence="1"]')).toHaveAttribute('aria-pressed', 'true');

    await solveCase(page, 0, 0);
    await expect(page.locator('#status')).toContainText('100 × 1.25 × 0.8 = 100');
    await expect(page.locator('#streetScene')).toHaveAttribute('data-result', 'correct');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '第二件半价，平均相当于几折？' })).toBeVisible();
    await solveCase(page, 0, 1);
    await expect(page.locator('#status')).toContainText('120 ÷ 160 = 75%');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '满 300 减 80 和七五折，哪个更省？' })).toBeVisible();
    await page.locator('[data-evidence="0"]').click();
    await page.locator('[data-verdict="1"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('280 元和 270 元');
    await page.locator('[data-verdict="2"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('七五折刚好多省 10 元');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '你成为了“百分数神探”！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('#course')).toHaveJSProperty('inert', true);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.sale-detective') || 'null')?.status)).toBe('completed');
  });

  test('persists progress and supports language, theme, sound, and target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await solveCase(page, 0, 0);
    await page.locator('#nextBtn').click();
    await page.locator('[data-evidence="0"]').click();
    await page.locator('[data-verdict="1"]').click();
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Second item half price—what is the average discount?' })).toBeVisible();
    await expect(page.locator('#status')).toContainText('Evidence and verdict selected');
    await expectFitsViewport(page);

    await page.reload();
    await expect(page.locator('[data-evidence="0"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-verdict="1"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page);
  });

  test('restores completion and starts a fresh patrol', async ({ page }) => {
    await solveCase(page, 0, 0);
    await page.locator('#nextBtn').click();
    await solveCase(page, 0, 1);
    await page.locator('#nextBtn').click();
    await solveCase(page, 0, 2);
    await page.locator('#nextBtn').click();
    await expect(page.getByRole('heading', { name: '你成为了“百分数神探”！' })).toBeVisible();
    await page.reload();

    await expect(page.getByRole('heading', { name: '你成为了“百分数神探”！' })).toBeVisible();
    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '提价 25% 再打八折，真的便宜了吗？' })).toBeVisible();
    await expect(page.locator('[data-evidence="0"]')).toHaveAttribute('aria-pressed', 'false');
  });
});
