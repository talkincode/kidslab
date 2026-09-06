import { test, expect } from '@playwright/test';

async function showPanel(page, panel) {
  const viewport = page.viewportSize();
  if (!viewport || viewport.width > 700) return;
  const button = page.locator(`.mobile-nav button[data-panel="${panel}"]`);
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
}

test.describe('mass conservation lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const key = 'kidslab.e2e.mass-conservation-lab.initialized';
      if (sessionStorage.getItem(key)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.mass-conservation-lab.sound', 'off');
      localStorage.removeItem('kidslab.mass-conservation-lab');
      localStorage.removeItem('kidslab.progress.mass-conservation-lab');
      sessionStorage.setItem(key, 'true');
    });
    await page.goto('/courseware/mass-conservation-lab/');
  });

  test('compares open and sealed reactions, then concludes total mass is conserved', async ({ page }) => {
    await page.locator('#predictionLost').click();
    await page.locator('#openBtn').click();
    await page.locator('#runBtn').click();
    await expect(page.locator('#trialRows')).toContainText('96.0 g');

    await showPanel(page, 'mission');
    await page.locator('#sealedBtn').click();
    await page.locator('#runBtn').click();
    await expect(page.locator('#trialRows')).toContainText('100.0 g');

    await showPanel(page, 'notebook');
    await expect(page.locator('#trialRows tr')).toHaveCount(2);
    await page.locator('#conclusionConserved').click();
    await expect(page.locator('#completeCard')).toBeVisible();
    await expect(page.locator('#conclusionStatus')).toContainText('总质量不变');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.mass-conservation-lab') || 'null')?.phase)).toBe('complete');
  });

  test('rejects a premature or wrong conclusion and preserves the two comparison records', async ({ page }) => {
    await page.locator('#predictionKept').click();
    await page.locator('#openBtn').click();
    await page.locator('#runBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await showPanel(page, 'notebook');
    await expect(page.locator('#conclusionLost')).toBeDisabled();

    await showPanel(page, 'mission');
    await page.locator('#sealedBtn').click();
    await page.locator('#runBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(2);
    await showPanel(page, 'notebook');
    await page.locator('#conclusionLost').click();
    await expect(page.locator('#conclusionStatus')).toContainText('气泡没有消失');
    await expect(page.locator('#trialRows tr')).toHaveCount(2);
    await page.locator('#conclusionConserved').click();
    await expect(page.locator('#completeCard')).toBeVisible();
  });

  test('restores an in-progress experiment, resets it safely, and stays readable after preferences change', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.locator('#predictionKept').click();
    await page.locator('#openBtn').click();
    await page.locator('#runBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await page.reload();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await page.locator('#langBtn').click();
    await expect(page.locator('#missionTitle')).toContainText('bubbles');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#resetBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await expect(page.locator('#trialRows')).toContainText('Finish the first cup');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('kidslab.mass-conservation-lab'))).toBeNull();

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
