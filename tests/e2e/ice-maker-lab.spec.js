import { test, expect } from '@playwright/test';

test.describe('ice maker lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const key = 'kidslab.e2e.ice-maker-lab.initialized';
      if (sessionStorage.getItem(key)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.ice-maker-lab.sound', 'off');
      localStorage.removeItem('kidslab.ice-maker-lab');
      localStorage.removeItem('kidslab.progress.ice-maker-lab');
      sessionStorage.setItem(key, 'true');
    });
    await page.goto('/courseware/ice-maker-lab/');
  });

  test('fills, freezes, harvests, and shows heat moved into the room', async ({ page }) => {
    test.setTimeout(45000);
    await page.locator('[data-speed="3"]').click();
    await page.locator('#fillBtn').click();
    await expect(page.locator('#feedback')).toContainText('灌满');
    await page.locator('#powerBtn').click();
    await expect(page.locator('#powerBtn')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#harvestBtn')).toBeEnabled({ timeout: 25000 });
    await expect(page.locator('#iceReading')).toContainText('100%');
    await page.locator('#harvestBtn').click();
    await expect(page.locator('#cubeReading')).toHaveText('6');
    await expect(page.locator('#foundCard')).toBeVisible();
    await expect(page.locator('#foundCard')).toContainText('搬走');
    const room = await page.locator('#roomReading').innerText();
    expect(Number.parseFloat(room)).toBeGreaterThan(5);
  });

  test('rejects running empty or harvesting too soon, then recovers by filling', async ({ page }) => {
    await page.locator('#powerBtn').click();
    await expect(page.locator('#feedback')).toContainText('先灌水');
    await expect(page.locator('#powerBtn')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#harvestBtn')).toBeDisabled();
    await page.locator('#fillBtn').click();
    await expect(page.locator('#feedback')).toContainText('灌满');
    await page.locator('#resetBtn').click();
    await expect(page.locator('#feedback')).toContainText('清空');
    await expect(page.locator('#moldReading')).toContainText('22.0');
    await expect(page.locator('#cubeReading')).toHaveText('0');
    await page.locator('#fillBtn').click();
    await expect(page.locator('#feedback')).toContainText('灌满');
  });

  test('switches language and theme, and the panel can collapse then reopen', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.locator('#langBtn').click();
    await expect(page.locator('#coachTitle')).toContainText('Fill water');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#panelHandle').click();
    await expect(page.locator('#panelHandle')).toHaveAttribute('aria-expanded', 'false');
    await page.locator('#panelHandle').click();
    await expect(page.locator('#panelHandle')).toHaveAttribute('aria-expanded', 'true');

    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      canvas: (() => {
        const scene = document.querySelector('#scene');
        const rect = scene.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      })(),
    }));
    expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.canvas.width).toBeGreaterThan(300);
    expect(layout.canvas.height).toBeGreaterThan(300);
    expect(errors).toEqual([]);
  });
});
