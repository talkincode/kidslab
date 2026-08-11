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
    canvasHeight: document.querySelector('#worldCanvas').getBoundingClientRect().height,
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);
  expect(layout.controls.filter(({ font }) => font < 16)).toEqual([]);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.canvasHeight).toBeGreaterThanOrEqual(105);
}

async function finishFirstMission(page) {
  await page.locator('[data-step="5"]').click();
  await page.locator('[data-step="1"]').click({ clickCount: 3 });
  await page.locator('#checkBtn').click();
  await expect(page.locator('#status')).toContainText('上升 8 格');
  await page.locator('#nextBtn').click();
}

async function finishSecondMission(page) {
  await page.locator('[data-answer="0"]').click();
  await page.locator('#checkBtn').click();
  await expect(page.locator('#status')).toContainText('−2 > −7');
  await page.locator('#nextBtn').click();
}

test.describe('up-down world', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.updown-world');
      localStorage.removeItem('kidslab.progress.updown-world');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/updown-world/');
  });

  test('recovers from wrong stops and completes all three number-line missions', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '从章鱼家升到鸟巢' })).toBeVisible();
    await page.locator('[data-step="5"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('现在是 +2');
    await expect(page.locator('#shaft')).toHaveAttribute('data-result', 'wrong');

    await page.locator('[data-step="1"]').click({ clickCount: 3 });
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('5 − (−3) = 8');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '−2°C 和 −7°C，哪里更暖？' })).toBeVisible();
    await page.locator('[data-answer="1"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('−7 在 −2 的下面');
    await page.locator('[data-answer="0"]').click();
    await page.locator('#checkBtn').click();
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '有 7 元，支出 12 元' })).toBeVisible();
    await page.locator('[data-answer="1"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('支出会让余额向下走');
    await page.locator('[data-answer="0"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('7 + (−12) = −5');
    await page.locator('#nextBtn').click();

    await expect(page.locator('#deepFlash')).toBeVisible();
    await expect(page.getByRole('heading', { name: '你拿到了“零点领航员”徽章！' })).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('#course')).toHaveJSProperty('inert', true);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.updown-world') || 'null')?.status)).toBe('completed');
  });

  test('persists progress and supports language, theme, sound, and target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await finishFirstMission(page);
    await page.locator('[data-answer="0"]').click();
    await page.locator('#checkBtn').click();
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Which is warmer: −2°C or −7°C?' })).toBeVisible();
    await expect(page.locator('#status')).toContainText('−2 > −7');
    await expectFitsViewport(page);

    await page.reload();
    await expect(page.locator('[data-answer="0"]')).toHaveClass(/is-right/);
    await expect(page.locator('#nextBtn')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page);
  });

  test('restores completion and can start a fresh voyage', async ({ page }) => {
    await finishFirstMission(page);
    await finishSecondMission(page);
    await page.locator('[data-answer="0"]').click();
    await page.locator('#checkBtn').click();
    await page.locator('#nextBtn').click();
    await expect(page.getByRole('heading', { name: '你拿到了“零点领航员”徽章！' })).toBeVisible({ timeout: 3000 });
    await page.reload();

    await expect(page.getByRole('heading', { name: '你拿到了“零点领航员”徽章！' })).toBeVisible({ timeout: 3000 });
    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '从章鱼家升到鸟巢' })).toBeVisible();
    await expect(page.locator('#currentValue')).toHaveText('−3');
  });
});
