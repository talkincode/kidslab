import { test, expect } from '@playwright/test';

test.describe('microscope cell lab', () => {
  test.describe.configure({ timeout: 90000 });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const key = 'kidslab.e2e.microscope-cell-lab.initialized';
      if (sessionStorage.getItem(key)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.microscope-cell-lab.music', '0');
      localStorage.setItem('kidslab.microscope-cell-lab.sfx', '0');
      localStorage.removeItem('kidslab.microscope-cell-lab');
      localStorage.removeItem('kidslab.progress.microscope-cell-lab');
      sessionStorage.setItem(key, 'true');
    });
    await page.goto('/courseware/microscope-cell-lab/');
    await expect(page.locator('#magVal')).toHaveText('40×');
  });

  test('focuses on low power, records shrinking fields, then compares plant and animal cells', async ({ page }) => {
    await expect(page.locator('#fovVal')).toHaveText('4.50 mm');
    await expect(page.locator('#sharpVal')).toHaveText('模糊');

    await page.locator('#coarseRange').fill('0');
    await page.locator('#coarseRange').dispatchEvent('input');
    await expect(page.locator('#sharpVal')).toHaveText('清晰');
    await expect(page.locator('#coach')).toContainText('细胞世界');

    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows')).toContainText('洋葱');
    await expect(page.locator('#trialRows')).toContainText('4.50 mm');

    await page.locator('#obj10').click();
    await expect(page.locator('#magVal')).toHaveText('100×');
    await expect(page.locator('#fovVal')).toHaveText('1.80 mm');
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(2);

    await page.locator('#slideCheek').click();
    await page.locator('#recordBtn').click();
    await expect(page.locator('#completeCard')).toBeVisible();
    await expect(page.locator('#conclusionStatus')).toContainText('视野变小');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.microscope-cell-lab') || 'null')?.phase)).toBe('complete');
  });

  test('refuses coarse focus on 40× and keeps the stage where it was', async ({ page }) => {
    await page.locator('#coarseRange').fill('0');
    await page.locator('#coarseRange').dispatchEvent('input');
    await expect(page.locator('#sharpVal')).toHaveText('清晰');
    await page.locator('#obj10').click();
    await page.locator('#obj40').click();
    await expect(page.locator('#magVal')).toHaveText('400×');
    await expect(page.locator('#fovVal')).toHaveText('0.45 mm');

    await page.locator('#coarseRange').fill('120');
    await page.locator('#coarseRange').dispatchEvent('input');
    await expect(page.locator('#feedback')).toContainText('高倍镜只能用细准焦');
    await expect(page.locator('#coarseVal')).toHaveText('0 μm');
    await expect(page.locator('#trialRows tr')).toHaveCount(0);

    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await expect(page.locator('#trialRows')).toContainText('400×');
  });

  test('restores an in-progress notebook, resets it, and stays readable after preferences change', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.locator('#coarseRange').fill('0');
    await page.locator('#coarseRange').dispatchEvent('input');
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await page.reload();
    await expect(page.locator('#magVal')).toHaveText('40×');
    await expect(page.locator('#trialRows tr')).toHaveCount(1);

    await page.locator('#langBtn').click();
    await expect(page.locator('#coach')).toContainText('Turn up the lamp');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('#resetBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(0);
    await expect(page.locator('#sharpVal')).toHaveText('Blurry');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('kidslab.microscope-cell-lab'))).toBeNull();

    await page.locator('#panelHandle').click();
    await expect(page.locator('#panelHandle')).toHaveAttribute('aria-expanded', 'false');
    await page.locator('#panelHandle').click();
    await expect(page.locator('#panelHandle')).toHaveAttribute('aria-expanded', 'true');

    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      controls: [...document.querySelectorAll('button:not([hidden])')].map((element) => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height, font: Number.parseFloat(getComputedStyle(element).fontSize) };
      }).filter(({ width, height }) => width > 0 && height > 0),
    }));
    expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
    expect(layout.controls.filter(({ width }) => width < 40)).toEqual([]);
    expect(layout.controls.filter(({ height }) => height < 40)).toEqual([]);
    expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(14);
    expect(errors).toEqual([]);
  });
});
