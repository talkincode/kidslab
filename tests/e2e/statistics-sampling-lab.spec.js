import { test, expect } from '@playwright/test';

async function ensurePanelOpen(page) {
  if (await page.locator('#panelHandle').getAttribute('aria-expanded') === 'true') return;
  await page.locator('#panelHandle').click();
  await expect(page.locator('#panelHandle')).toHaveAttribute('aria-expanded', 'true');
}

test.describe('sampling statistics lab', () => {
  test.describe.configure({ timeout: 90000 });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const key = 'kidslab.e2e.statistics-sampling-lab.initialized';
      if (sessionStorage.getItem(key)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.statistics-sampling-lab.music', '0');
      localStorage.setItem('kidslab.statistics-sampling-lab.sfx', '0');
      localStorage.removeItem('kidslab.statistics-sampling-lab');
      localStorage.removeItem('kidslab.progress.statistics-sampling-lab');
      sessionStorage.setItem(key, 'true');
    });
    await page.goto('/courseware/statistics-sampling-lab/');
    await expect(page.locator('#meanVal')).toHaveText('—');
  });

  test('records convenience then stratified samples and completes after census', async ({ page }) => {
    await ensurePanelOpen(page);
    await page.locator('#methodConvenience').click();
    await expect(page.locator('#methodVal')).toHaveText('便利');
    await page.locator('#drawBtn').click();
    await expect(page.locator('#meanVal')).not.toHaveText('—');
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await expect(page.locator('#trialRows')).toContainText('便利');

    await ensurePanelOpen(page);
    await page.locator('#methodStratified').click();
    await expect(page.locator('#methodVal')).toHaveText('分层');
    await page.locator('#drawBtn').click();
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(2);

    await page.locator('#censusBtn').click();
    await expect(page.locator('#completeCard')).toBeVisible();
    await expect(page.locator('#conclusionStatus')).toContainText('30');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.statistics-sampling-lab') || 'null')?.phase)).toBe('complete');
  });

  test('refuses to record before a draw and keeps the notebook empty', async ({ page }) => {
    await page.locator('#recordBtn').click();
    await expect(page.locator('#feedback')).toContainText('还没抽样');
    await expect(page.locator('#trialRows tr')).toHaveCount(0);
    await expect(page.locator('#meanVal')).toHaveText('—');

    await page.locator('#drawBtn').click();
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);

    await page.locator('#recordBtn').click();
    await expect(page.locator('#feedback')).toContainText('已经记过');
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
  });

  test('restores an in-progress notebook, resets it, and stays readable after preferences change', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await ensurePanelOpen(page);
    await page.locator('#methodConvenience').click();
    await page.locator('#drawBtn').click();
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await page.reload();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await expect(page.locator('#methodVal')).toHaveText('便利');

    await page.locator('#langBtn').click();
    await expect(page.locator('#drawBtn')).toContainText('Draw sample');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('#resetBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(0);
    await expect(page.locator('#meanVal')).toHaveText('—');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('kidslab.statistics-sampling-lab'))).toBeNull();

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
