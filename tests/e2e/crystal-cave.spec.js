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
    canvasHeight: document.querySelector('#caveCanvas').getBoundingClientRect().height,
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);
  expect(layout.controls.filter(({ font }) => font < 16)).toEqual([]);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.canvasHeight).toBeGreaterThanOrEqual(165);
}

async function finishTwelve(page) {
  await page.locator('[data-a="3"][data-b="4"]').click();
  await page.locator('[data-a="2"][data-b="2"]').click();
  await expect(page.locator('#status')).toContainText('12 已全部变成质数原石');
  await page.locator('#nextBtn').click();
}

async function finishEighteen(page) {
  await page.locator('[data-a="3"][data-b="6"]').click();
  await page.locator('[data-a="2"][data-b="3"]').click();
  await expect(page.locator('#status')).toContainText('独一无二的宇宙配方');
  await page.locator('#nextBtn').click();
}

async function selectMultiplesOfThree(page) {
  for (const value of [12, 15, 18, 21, 24, 27, 30]) {
    await page.locator(`[data-number="${value}"]`).click();
  }
}

test.describe('factor crystal cave', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.crystal-cave');
      localStorage.removeItem('kidslab.progress.crystal-cave');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/crystal-cave/');
  });

  test('recovers from wrong factors and completes all three chambers', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '把 12 敲成质数原石' })).toBeVisible();
    await page.locator('[data-a="2"][data-b="5"]').click();
    await expect(page.locator('#status')).toContainText('2 × 5 不等于 12');
    await expect(page.locator('#selectedValue')).toHaveText('12');

    await finishTwelve(page);
    await expect(page.getByRole('heading', { name: '追踪 18 的秘密配方' })).toBeVisible();
    await finishEighteen(page);

    await expect(page.getByRole('heading', { name: '让 3 的倍数一起发光' })).toBeVisible();
    await page.locator('#forkBtn').click();
    await expect(page.locator('#status')).toContainText('3 × 某个正整数');
    await page.locator('[data-number="10"]').click();
    await selectMultiplesOfThree(page);
    await page.locator('#checkWallBtn').click();
    await expect(page.locator('#status')).toContainText('错误选择已标红');
    await expect(page.locator('[data-number="10"]')).toHaveClass(/is-wrong/);

    await page.locator('[data-number="10"]').click();
    await page.locator('#checkWallBtn').click();
    await expect(page.locator('#status')).toContainText('整面矿墙共振成功');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '宇宙配方证书' })).toBeVisible();
    await expect(page.locator('.recipes')).toContainText('12 = 2 × 2 × 3');
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('#course')).toHaveJSProperty('inert', true);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.crystal-cave') || 'null')?.status)).toBe('completed');
  });

  test('persists progress and supports preferences and target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('[data-a="3"][data-b="4"]').click();
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Crack 12 into prime stones' })).toBeVisible();
    await expect(page.locator('#historyList')).toContainText('12 cracked into 3 × 4');
    await expectFitsViewport(page);

    await page.reload();
    await expect(page.locator('#selectedValue')).toHaveText('4');
    await expect(page.locator('#historyList')).toContainText('12 cracked into 3 × 4');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page);
  });

  test('restores completion and starts a fresh expedition', async ({ page }) => {
    await finishTwelve(page);
    await finishEighteen(page);
    await selectMultiplesOfThree(page);
    await page.locator('#checkWallBtn').click();
    await page.locator('#nextBtn').click();
    await page.reload();

    await expect(page.getByRole('heading', { name: '宇宙配方证书' })).toBeVisible();
    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '把 12 敲成质数原石' })).toBeVisible();
    await expect(page.locator('#selectedValue')).toHaveText('12');
  });
});
