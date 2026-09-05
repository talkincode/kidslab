import { test, expect } from '@playwright/test';

async function showPanel(page, panel) {
  const viewport = page.viewportSize();
  if (!viewport || viewport.width > 700) return;
  const button = page.locator(`.mobile-nav__button[data-mobile-panel="${panel}"]`);
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
}

async function select(page, selector, value) {
  await showPanel(page, 'bench');
  await page.locator(selector).selectOption(value);
}

async function record(page) {
  await showPanel(page, 'bench');
  await page.locator('#recordBtn').click();
}

test.describe("Ohm's law lab", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const initializedKey = 'kidslab.e2e.ohms-law-lab.initialized';
      if (sessionStorage.getItem(initializedKey)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.ohms-law-lab.sound', 'true');
      localStorage.removeItem('kidslab.ohms-law-lab');
      localStorage.removeItem('kidslab.progress.ohms-law-lab');
      sessionStorage.setItem(initializedKey, 'true');
    });
    await page.goto('/courseware/ohms-law-lab/');
  });

  test('predicts, records controlled U-I data, compares slopes, and designs 0.30 A', async ({ page }) => {
    await showPanel(page, 'mission');
    await page.locator('#predictionUp').click();

    await record(page);
    await select(page, '#voltageSelect', '3');
    await record(page);
    await expect(page.locator('#trialRows tr')).toHaveCount(2);
    await expect(page.locator('#graphLines .plot-ten')).toHaveCount(1);

    await select(page, '#resistanceSelect', '20');
    await record(page);
    await select(page, '#voltageSelect', '6');
    await select(page, '#ammeterRange', '3');
    await select(page, '#voltmeterRange', '15');
    await record(page);
    await expect(page.locator('#trialRows tr')).toHaveCount(4);
    await expect(page.locator('#graphLines .plot-twenty')).toHaveCount(1);

    await showPanel(page, 'mission');
    await page.locator('#conclusionLower').click();
    await expect(page.locator('#designCard')).toBeVisible();
    await page.locator('#designBtn').click();
    await expect(page.locator('#completeCard')).toBeVisible();
    await expect(page.locator('#feedback')).toContainText('0.30 A');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.ohms-law-lab') || 'null')?.status)).toBe('completed');
  });

  test('protects a bad wiring and meter ranges, then keeps the evidence for retry', async ({ page }) => {
    await showPanel(page, 'mission');
    await page.locator('#predictionUp').click();
    await showPanel(page, 'bench');
    await page.locator('[data-wire="ammeter-parallel"]').click();
    await page.locator('#recordBtn').click();
    await expect(page.locator('#feedback')).toContainText('近似短路');
    await expect(page.locator('#trialRows tr')).toHaveCount(0);

    await page.locator('[data-wire="series-parallel"]').click();
    await record(page);
    await select(page, '#voltageSelect', '4.5');
    await record(page);
    await expect(page.locator('#feedback')).toContainText('电压表超量程');
    await expect(page.locator('#trialRows tr')).toHaveCount(1);

    await select(page, '#voltmeterRange', '15');
    await record(page);
    await expect(page.locator('#feedback')).toContainText('电流表超量程');
    await expect(page.locator('#trialRows tr')).toHaveCount(1);

    await select(page, '#ammeterRange', '3');
    await record(page);
    await expect(page.locator('#trialRows tr')).toHaveCount(2);
    await expect(page.locator('#feedback')).toContainText('记录成功');
  });

  test('restores a partial experiment and clears it safely when starting over', async ({ page }) => {
    await showPanel(page, 'mission');
    await page.locator('#predictionUp').click();
    await record(page);
    await expect(page.locator('#trialRows tr')).toHaveCount(1);

    await page.reload();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await expect(page.locator('#missionTitle')).toContainText('留两条 10 Ω 证据');
    await showPanel(page, 'mission');
    await page.locator('#resetBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(0);
    await expect(page.locator('#missionTitle')).toContainText('先做一个预测');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('kidslab.ohms-law-lab'))).toBeNull();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('kidslab.progress.ohms-law-lab'))).toBeNull();
  });

  test('keeps controls readable in both target viewports and changes language and theme without errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.locator('#langBtn').click();
    await expect(page.locator('#missionTitle')).toContainText('Make a prediction');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      controls: [...document.querySelectorAll('button:not([hidden]), select:not([hidden])')]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height,
            font: Number.parseFloat(getComputedStyle(element).fontSize),
          };
        })
        .filter(({ width, height }) => width > 0 && height > 0),
    }));
    expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
    expect(layout.controls.filter(({ width }) => width < 44)).toEqual([]);
    expect(layout.controls.filter(({ height }) => height < 40)).toEqual([]);
    expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
    expect(errors).toEqual([]);
  });
});
