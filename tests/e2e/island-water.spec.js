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
    lessonFont: Number.parseFloat(getComputedStyle(document.querySelector('#lessonText')).fontSize),
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width }) => width < 44)).toEqual([]);
  expect(layout.controls.filter(({ height }) => height < 44)).toEqual([]);
  expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.lessonFont).toBeGreaterThanOrEqual(14);
}

async function useTool(page, id) {
  await page.locator(`[data-tool="${id}"]`).click();
}

test.describe('island water', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.island-water');
    });
    await page.goto('/courseware/island-water/');
  });

  test('recovers from muddy sips, incomplete filters, and lost steam, then finishes the line', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '这桶浑汤能喝吗？先让泥沙沉下去' })).toBeVisible();
    await expect(page.locator('#turbidityValue')).toHaveText('92');
    await expect(page.locator('#salinityValue')).toHaveText('78');

    await useTool(page, 'taste');
    await expect(page.locator('#status')).toContainText('满嘴泥沙');
    await expect(page.locator('#drinkText')).toHaveText('还不能喝');

    await useTool(page, 'scoop');
    await expect(page.locator('#status')).toContainText('先静置');

    await useTool(page, 'settle');
    await expect(page.locator('#status')).toContainText('泥沙沉到底了');
    await expect(page.locator('#turbidityValue')).toHaveText('40');

    await useTool(page, 'scoop');
    await expect(page.locator('#status')).toContainText('下一步试试过滤');

    await page.locator('#campNav button').nth(1).click();
    await expect(page.getByRole('heading', { name: '把泥沙拦住，再尝一口' })).toBeVisible();

    await useTool(page, 'pour');
    await expect(page.locator('#status')).toContainText('滤瓶还缺材料');

    await useTool(page, 'gravel');
    await useTool(page, 'sand');
    await useTool(page, 'charcoal');
    await useTool(page, 'pour');
    await expect(page.locator('#status')).toContainText('含盐却没动');
    await expect(page.locator('#turbidityValue')).toHaveText('6');
    await expect(page.locator('#salinityValue')).toHaveText('78');
    await expect(page.locator('#drinkText')).toHaveText('清澈但仍咸');

    await useTool(page, 'taste');
    await expect(page.locator('#status')).toContainText('居然是咸的');
    await expect(page.getByRole('heading', { name: '清水还是咸的！用蒸汽收淡水' })).toBeVisible();

    await useTool(page, 'heat');
    await expect(page.locator('#status')).toContainText('蒸汽全跑了');
    await expect(page.locator('#salinityValue')).toHaveText('78');

    await useTool(page, 'collector');
    await useTool(page, 'heat');
    await expect(page.locator('#status')).toContainText('含盐掉下去了');
    await expect(page.locator('#salinityValue')).toHaveText('1');

    await useTool(page, 'taste');
    await expect(page.getByRole('heading', { name: '荒岛亮起可饮用绿灯！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('#drinkText')).toHaveText('可以喝啦');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.island-water') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, and both target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Can you drink this soup? Let the mud sink first' })).toBeVisible();
    await expect(page.locator('#campNav')).toHaveAttribute('aria-label', 'Water camps');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('restores progress after reload and stays readable across camps', async ({ page }) => {
    await useTool(page, 'settle');
    await useTool(page, 'scoop');
    await expect(page.locator('#status')).toContainText('下一步试试过滤');

    const saved = await page.evaluate(() => localStorage.getItem('kidslab.island-water'));
    expect(saved).toBeTruthy();

    await page.addInitScript((payload) => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.island-water', payload);
    }, saved);

    await page.reload();
    await expect(page.locator('#turbidityValue')).toHaveText('40');
    await expect(page.locator('#campNav button').nth(1)).toBeEnabled();

    await page.locator('#campNav button').nth(1).click();
    await expectFitsViewport(page);
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Trap the grit, then take a sip' })).toBeVisible();
    await expectFitsViewport(page);
  });
});
