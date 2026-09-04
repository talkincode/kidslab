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
    missionFont: Number.parseFloat(getComputedStyle(document.querySelector('#missionText')).fontSize),
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width }) => width < 44)).toEqual([]);
  expect(layout.controls.filter(({ height }) => height < 44)).toEqual([]);
  expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.missionFont).toBeGreaterThanOrEqual(16);
}

test.describe('mini pyramid', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.mini-pyramid');
      localStorage.removeItem('kidslab.progress.mini-pyramid');
    });
    await page.goto('/courseware/mini-pyramid/');
  });

  test('a bad machine plan leaves the stone ready for retry, then three sound plans finish the pyramid', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '让巨石走上斜坡' })).toBeVisible();
    await page.locator('#moveBtn').click();
    await expect(page.locator('#status')).toContainText('太重了');
    await expect(page.getByRole('heading', { name: '让巨石走上斜坡' })).toBeVisible();

    await page.locator('[data-choice="6"]').click();
    await page.locator('#moveBtn').click();
    await expect(page.getByRole('heading', { name: '把支点挪近巨石' })).toBeVisible();
    await expect(page.locator('#forceValue')).toContainText('10');

    await page.locator('#leverArm').fill('3');
    await page.locator('#moveBtn').click();
    await expect(page.getByRole('heading', { name: '给吊车多挂几轮' })).toBeVisible();
    await expect(page.locator('#forceValue')).toContainText('6');

    await page.locator('[data-choice="4"]').click();
    await page.locator('#moveBtn').click();
    await expect(page.getByRole('heading', { name: '金字塔竣工啦！' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.mini-pyramid') || 'null')?.status)).toBe('completed');
    await expect(page.locator('#againBtn')).toBeFocused();
  });

  test('restores a partially completed worksite and can reset it safely', async ({ page }) => {
    await page.locator('[data-choice="6"]').click();
    await page.locator('#moveBtn').click();
    await expect(page.getByRole('heading', { name: '把支点挪近巨石' })).toBeVisible();

    const saved = await page.evaluate(() => localStorage.getItem('kidslab.mini-pyramid'));
    expect(saved).toBeTruthy();
    await page.addInitScript((payload) => {
      localStorage.setItem('kidslab.mini-pyramid', payload);
    }, saved);
    await page.reload();
    await expect(page.getByRole('heading', { name: '把支点挪近巨石' })).toBeVisible();
    await expect(page.locator('[data-route="0"]')).toHaveClass(/is-cleared/);

    await page.evaluate(() => {
      localStorage.setItem('kidslab.progress.mini-pyramid', JSON.stringify({ status: 'played' }));
    });
    await page.locator('#resetBtn').click();
    await expect(page.getByRole('heading', { name: '让巨石走上斜坡' })).toBeVisible();
    await expect(page.locator('[data-route="0"]')).not.toHaveClass(/is-cleared/);
    await expect(page.locator('#celebration')).toBeHidden();
    await expect.poll(() => page.evaluate(() =>
      localStorage.getItem('kidslab.progress.mini-pyramid'))).toBeNull();
  });

  test('supports sound, language, theme, and both target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Walk the stone up a ramp' })).toBeVisible();
    await expect(page.locator('#route')).toHaveAttribute('aria-label', 'Build missions');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expect(page.locator('#backBtn')).toHaveAttribute('aria-label', 'Back to platform');
    await expect(page.locator('#pyramidCanvas')).toHaveAttribute('aria-label', 'Pyramid building animation');
    await expect(page.locator('#readout')).toHaveAttribute('aria-label', 'Machine readings');
    await expectFitsViewport(page);
  });
});
