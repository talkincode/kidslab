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

test.describe('plant x-ray', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.plant-xray');
    });
    await page.goto('/courseware/plant-xray/');
  });

  test('recovers from a dry wait and a flood, then finishes three gardens', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '把豆子埋下去，看谁先往下钻' })).toBeVisible();
    await expect(page.locator('#growText')).toHaveText('还在睡');

    await useTool(page, 'wait0');
    await expect(page.locator('#status')).toContainText('先下种');

    await useTool(page, 'plant');
    await useTool(page, 'wait0');
    await expect(page.locator('#status')).toContainText('土太干');
    await expect(page.locator('#plotA')).toHaveAttribute('data-look', 'buried');

    await useTool(page, 'flood');
    await useTool(page, 'wait0');
    await expect(page.locator('#status')).toContainText('泡坏了');
    await expect(page.locator('#growText')).toHaveText('泡坏了');

    await useTool(page, 'plant');
    await useTool(page, 'water');
    await useTool(page, 'wait0');
    await expect(page.locator('#status')).toContainText('往下钻');
    await expect(page.locator('#plotA')).toHaveAttribute('data-look', 'radicle');

    await useTool(page, 'wait0');
    await expect(page.locator('#status')).toContainText('胚根先向下');
    await expect(page.getByRole('heading', { name: '一边好好养，一边自己作妖' })).toBeVisible();

    await useTool(page, 'wait1');
    await expect(page.locator('#status')).toContainText('先把 A 床照顾好');

    await useTool(page, 'careA');
    await useTool(page, 'wait1');
    await expect(page.locator('#status')).toContainText('还没作妖');

    await useTool(page, 'dryB');
    await useTool(page, 'wait1');
    await expect(page.locator('#plotA')).toHaveAttribute('data-look', 'healthy');
    await expect(page.locator('#plotB')).toHaveAttribute('data-look', 'wilted');

    await useTool(page, 'guessDark');
    await expect(page.locator('#status')).toContainText('不对');

    await useTool(page, 'guessDry');
    await expect(page.locator('#status')).toContainText('缺水会蔫');
    await expect(page.getByRole('heading', { name: '点亮根茎叶花果，再找谁喝水' })).toBeVisible();

    await useTool(page, 'root');
    await expect(page.locator('#status')).toContainText('根点亮了');
    await useTool(page, 'stem');
    await useTool(page, 'leaf');
    await useTool(page, 'flower');
    await useTool(page, 'fruit');
    await expect(page.locator('#status')).toContainText('谁从土里喝水');

    await useTool(page, 'stem');
    await expect(page.locator('#status')).toContainText('不是它');

    await useTool(page, 'root');
    await expect(page.getByRole('heading', { name: '胚根先向下，整株植物站起来了！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('#growText')).toHaveText('图鉴齐了');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.plant-xray') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, and both target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Bury the bean. Who drills down first?' })).toBeVisible();
    await expect(page.locator('#campNav')).toHaveAttribute('aria-label', 'X-ray gardens');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('restores progress after reload and stays readable across gardens', async ({ page }) => {
    await useTool(page, 'plant');
    await useTool(page, 'water');
    await useTool(page, 'wait0');
    await expect(page.locator('#status')).toContainText('往下钻');

    const saved = await page.evaluate(() => localStorage.getItem('kidslab.plant-xray'));
    expect(saved).toBeTruthy();

    await page.addInitScript((payload) => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.plant-xray', payload);
    }, saved);

    await page.reload();
    await expect(page.locator('#plotA')).toHaveAttribute('data-look', 'radicle');
    await expect(page.locator('#growText')).toHaveText('根先钻');

    await useTool(page, 'wait0');
    await expect(page.locator('#campNav button').nth(1)).toBeEnabled();
    await page.locator('#campNav button').nth(1).click();
    await expectFitsViewport(page);
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Care for one. Mischief the other.' })).toBeVisible();
    await expectFitsViewport(page);
  });
});
