import { test, expect } from '@playwright/test';

async function ensurePanelOpen(page) {
  if (await page.locator('#panelHandle').getAttribute('aria-expanded') === 'true') return;
  await page.locator('#panelHandle').click();
  await expect(page.locator('#panelHandle')).toHaveAttribute('aria-expanded', 'true');
}

test.describe('projectile motion lab', () => {
  test.describe.configure({ timeout: 90000 });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const key = 'kidslab.e2e.projectile-motion-lab.initialized';
      if (sessionStorage.getItem(key)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.projectile-motion-lab.music', '0');
      localStorage.setItem('kidslab.projectile-motion-lab.sfx', '0');
      localStorage.removeItem('kidslab.projectile-motion-lab');
      localStorage.removeItem('kidslab.progress.projectile-motion-lab');
      sessionStorage.setItem(key, 'true');
    });
    await page.goto('/courseware/projectile-motion-lab/');
    await expect(page.locator('#statusVal')).toHaveText('就绪');
  });

  test('fires a compare shot, then threads the hoop to complete the lab', async ({ page }) => {
    await expect(page.locator('#yVal')).toHaveText('5.00 m');
    await expect(page.locator('#angleVal')).toHaveText('0°');

    await page.locator('#compareBtn').click();
    await expect(page.locator('#statusVal')).toHaveText('落地', { timeout: 8000 });
    await expect(page.locator('#feedback')).toContainText('同一时刻落地');

    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await expect(page.locator('#trialRows')).toContainText('对照');

    await ensurePanelOpen(page);
    await page.locator('#angleRange').fill('30');
    await page.locator('#angleRange').dispatchEvent('input');
    await page.locator('#speedRange').fill('8');
    await page.locator('#speedRange').dispatchEvent('input');
    await expect(page.locator('#angleVal')).toHaveText('30°');
    await expect(page.locator('#speedVal')).toHaveText('8.0 m/s');

    await page.locator('#launchBtn').click();
    await expect(page.locator('#statusVal')).toHaveText('落地', { timeout: 8000 });
    await expect(page.locator('#feedback')).toContainText('铁环');
    await page.locator('#recordBtn').click();
    await expect(page.locator('#completeCard')).toBeVisible();
    await expect(page.locator('#conclusionStatus')).toContainText('铁环');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.projectile-motion-lab') || 'null')?.phase)).toBe('complete');
  });

  test('refuses to record before launch and keeps the notebook empty', async ({ page }) => {
    await page.locator('#recordBtn').click();
    await expect(page.locator('#feedback')).toContainText('还没发射');
    await expect(page.locator('#trialRows tr')).toHaveCount(0);
    await expect(page.locator('#statusVal')).toHaveText('就绪');

    await page.locator('#compareBtn').click();
    await page.locator('#recordBtn').click();
    await expect(page.locator('#feedback')).toContainText('还在飞');
    await expect(page.locator('#trialRows tr')).toHaveCount(0);

    await expect(page.locator('#statusVal')).toHaveText('落地', { timeout: 8000 });
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
  });

  test('restores an in-progress notebook, resets it, and stays readable after preferences change', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.locator('#compareBtn').click();
    await expect(page.locator('#statusVal')).toHaveText('落地', { timeout: 8000 });
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await page.reload();
    await expect(page.locator('#statusVal')).toHaveText('落地');
    await expect(page.locator('#trialRows tr')).toHaveCount(1);

    await page.locator('#langBtn').click();
    await expect(page.locator('#compareBtn')).toContainText('Fire together');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('#resetBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(0);
    await expect(page.locator('#statusVal')).toHaveText('Ready');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('kidslab.projectile-motion-lab'))).toBeNull();

    const expanded = await page.locator('#panelHandle').getAttribute('aria-expanded');
    await page.locator('#panelHandle').click();
    await expect(page.locator('#panelHandle')).toHaveAttribute(
      'aria-expanded',
      expanded === 'true' ? 'false' : 'true',
    );
    await page.locator('#panelHandle').click();
    await expect(page.locator('#panelHandle')).toHaveAttribute('aria-expanded', expanded);

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
