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
  const order = ['mem', 'cpu', 'input', 'output'];
  for (const part of order) {
    await tapPart(page, part);
    await expect(page.locator('#prompt')).toContainText('✓', { timeout: 3000 });
    await page.waitForTimeout(750);
  }
  await expect(page.getByRole('heading', { name: '零件都认识啦！' })).toBeVisible({ timeout: 10000 });
  await page.locator('#nextBtn').click({ force: true });
  await expect(page.locator('#modal')).toBeHidden();
  await expect(page.locator('#actionBtn')).toBeVisible();
}

async function finishFde(page) {
  const done = page.getByRole('heading', { name: '你看见它怎么算了！' });
  const action = page.locator('#actionBtn');
  for (let i = 0; i < 24; i += 1) {
    if (await done.isVisible().catch(() => false)) break;
    if (!(await page.locator('#modal').isHidden())) break;
    await expect(action).toBeEnabled({ timeout: 5000 });
    await action.click({ force: true });
    // allow fetch/decode/execute animation to settle before next enabled check
    await page.waitForTimeout(120);
    await expect(action).toBeEnabled({ timeout: 5000 }).catch(() => {});
  }
  await expect(done).toBeVisible({ timeout: 15000 });
  await page.locator('#nextBtn').click({ force: true });
  await expect(page.locator('#modal')).toBeHidden();
}

async function finishCpuGame(page) {
  const sequence = [
    'fetch', 'load',
    'fetch', 'load', 'calc',
    'fetch', 'calc',
    'fetch', 'calc',
  ];
  for (const act of sequence) {
    const btn = page.locator(`[data-act="${act}"]`);
    await expect(btn).toBeEnabled({ timeout: 10000 });
    await btn.click({ force: true });
    await page.waitForTimeout(200);
    await expect(btn).toBeEnabled({ timeout: 8000 }).catch(() => {});
  }
  await expect(page.getByRole('heading', { name: '你会当 CPU 啦！' })).toBeVisible({ timeout: 15000 });
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

  test('recovers from wrong parts and completes the three labs', async ({ page }) => {
    test.setTimeout(90000);
    await expect(page.locator('#missionTitle')).toContainText('放在哪里');

    await tapPart(page, 'cpu');
    await expect(page.locator('#prompt')).toContainText('再想想');

    await finishParts(page);
    await expect(page.locator('#missionTitle')).toContainText('7 + 5');

    await finishFde(page);
    await expect(page.locator('#missionTitle')).toContainText('CPU');

    await finishCpuGame(page);
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
    await expect(page.getByRole('heading', { name: /Where do numbers and orders live/i })).toBeVisible();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });
});
