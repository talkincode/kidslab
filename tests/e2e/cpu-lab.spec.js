import { test, expect } from '@playwright/test';

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => {
    const controls = [...document.querySelectorAll('button:not([hidden]), a:not([hidden])')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          width: rect.width,
          height: rect.height,
          font: Number.parseFloat(style.fontSize),
          display: style.display,
        };
      })
      .filter(({ width, height, display }) => width > 0 && height > 0 && display !== 'none');
    return {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      controls,
    };
  });

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  const chrome = layout.controls.filter((item) => item.width >= 20 && item.height >= 20);
  expect(chrome.filter((item) => item.height < 44)).toEqual([]);
  expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
}

async function tapPart(page, part) {
  const locator = page.locator(`[data-part="${part}"]`);
  await locator.scrollIntoViewIfNeeded();
  await locator.click({ force: true });
}

async function finishParts(page) {
  const order = ['mem', 'cpu', 'bus', 'input', 'output'];
  for (const part of order) {
    await tapPart(page, part);
  }
  await expect(page.getByRole('heading', { name: '零件都找到啦！' })).toBeVisible();
  await page.locator('#nextBtn').click({ force: true });
  await expect(page.locator('#modal')).toBeHidden();
  await expect(page.locator('#actionBtn')).toBeVisible();
}

async function finishFde(page) {
  const done = page.getByRole('heading', { name: '你看见电脑怎么干活了！' });
  for (let i = 0; i < 30; i += 1) {
    if (await done.isVisible().catch(() => false)) break;
    if (!(await page.locator('#modal').isHidden())) break;
    const action = page.locator('#actionBtn');
    if (await action.isVisible() && await action.isEnabled()) {
      await action.click({ force: true });
    }
    await page.waitForTimeout(120);
  }
  await expect(done).toBeVisible({ timeout: 10000 });
  await page.locator('#nextBtn').click({ force: true });
  await expect(page.locator('#modal')).toBeHidden();
}

test.describe('cpu lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.cpu-lab');
      localStorage.removeItem('kidslab.progress.cpu-lab');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/cpu-lab/');
  });

  test('recovers from wrong parts and completes the chart lab', async ({ page }) => {
    await expect(page.locator('#missionTitle')).toContainText('货架');
    await expect(page.locator('.chart-caption')).toBeVisible();

    await tapPart(page, 'cpu');
    await expect(page.locator('#feedback')).toContainText('还不是这个');

    await finishParts(page);
    await expect(page.locator('#missionTitle')).toContainText('下一步');

    await finishFde(page);
    await expect(page.locator('#missionTitle')).toContainText('屏幕出现 9');

    await page.locator('[data-op="SET 4"]').click({ force: true });
    await page.locator('#actionBtn').click({ force: true });
    await expect(page.locator('#feedback')).toContainText('显示');

    await page.locator('#fillRecipeBtn').click({ force: true });
    await page.locator('#actionBtn').click({ force: true });
    await expect(page.getByRole('heading', { name: '你会给电脑下命令啦！' })).toBeVisible({ timeout: 15000 });
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.cpu-lab') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, and both target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: /Where is stuff stored/i })).toBeVisible();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });
});
