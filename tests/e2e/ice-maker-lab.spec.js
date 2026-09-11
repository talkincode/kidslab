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

  test('keeps the 3D canvas fitted after shrinking the viewport and does not bounce back', async ({ page }) => {
    test.setTimeout(45000);
    const measure = () => page.evaluate(() => {
      const scene = document.querySelector('#scene');
      const rect = scene.getBoundingClientRect();
      return {
        cssWidth: rect.width,
        cssHeight: rect.height,
        bufferWidth: scene.width,
        bufferHeight: scene.height,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      };
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(200);
    const wide = await measure();
    expect(wide.cssWidth).toBeGreaterThan(1000);
    expect(Math.abs(wide.cssWidth - wide.innerWidth)).toBeLessThan(2);
    expect(Math.abs(wide.cssHeight - wide.innerHeight)).toBeLessThan(2);

    await page.setViewportSize({ width: 720, height: 640 });
    await page.waitForTimeout(250);
    const shrunk = await measure();
    expect(Math.abs(shrunk.cssWidth - 720)).toBeLessThan(2);
    expect(Math.abs(shrunk.cssHeight - 640)).toBeLessThan(2);
    expect(shrunk.cssWidth).toBeLessThan(wide.cssWidth - 100);
    expect(shrunk.bufferWidth).toBeLessThan(wide.bufferWidth);

    await page.waitForTimeout(500);
    const later = await measure();
    expect(Math.abs(later.cssWidth - shrunk.cssWidth)).toBeLessThan(2);
    expect(Math.abs(later.cssHeight - shrunk.cssHeight)).toBeLessThan(2);
    expect(later.cssWidth).toBeLessThanOrEqual(721);
    expect(later.cssHeight).toBeLessThanOrEqual(641);

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(250);
    const phone = await measure();
    expect(Math.abs(phone.cssWidth - 375)).toBeLessThan(2);
    expect(Math.abs(phone.cssHeight - 667)).toBeLessThan(2);
    await page.waitForTimeout(400);
    const phoneLater = await measure();
    expect(Math.abs(phoneLater.cssWidth - phone.cssWidth)).toBeLessThan(2);
    expect(Math.abs(phoneLater.cssHeight - phone.cssHeight)).toBeLessThan(2);
  });

  test('type scale matches the optics-lab hierarchy while staying above child floors', async ({ page }) => {
    const sizes = await page.evaluate(() => {
      const px = (sel) => Number.parseFloat(getComputedStyle(document.querySelector(sel)).fontSize);
      return {
        body: px('body'),
        title: px('.bar__title'),
        hudLabel: px('.hud__label'),
        hudNum: px('.hud__chip b'),
        coach: px('#coachTitle'),
        coachAux: px('#feedback'),
        button: px('#fillBtn'),
        hint: px('.model-note'),
      };
    });
    expect(sizes.body).toBeGreaterThanOrEqual(16);
    expect(sizes.title).toBeGreaterThanOrEqual(18);
    expect(sizes.title).toBeLessThanOrEqual(22);
    expect(sizes.hudLabel).toBeGreaterThanOrEqual(14);
    expect(sizes.hudNum).toBeGreaterThanOrEqual(16);
    expect(sizes.hudNum).toBeLessThanOrEqual(16);
    expect(sizes.coach).toBeGreaterThanOrEqual(16);
    expect(sizes.coachAux).toBeGreaterThanOrEqual(14);
    expect(sizes.button).toBeGreaterThanOrEqual(16);
    expect(sizes.hint).toBeGreaterThanOrEqual(14);
  });
});
