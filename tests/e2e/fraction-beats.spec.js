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
  expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(14);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.missionFont).toBeGreaterThanOrEqual(16);
}

test.describe('fraction beat house', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.fraction-beats');
      localStorage.removeItem('kidslab.progress.fraction-beats');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/fraction-beats/');
  });

  test('recovers from an overfull bar and completes all three rhythm missions', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '把一小节拼满' })).toBeVisible();

    await page.getByRole('button', { name: '加入二分之一拍' }).click({ clickCount: 2 });
    await page.getByRole('button', { name: '加入四分之一拍' }).click();
    await expect(page.locator('#status')).toContainText('放不下');
    await expect(page.locator('#fractionTotal')).toHaveText('1');

    await page.locator('#undoBtn').click();
    await page.getByRole('button', { name: '加入四分之一拍' }).click({ clickCount: 2 });
    await expect(page.locator('#fractionTotal')).toHaveText('1');
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('一整小节');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '让两条节奏一样长' })).toBeVisible();
    await page.getByRole('button', { name: '加入八分之一拍' }).click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('还不一样长');
    await page.getByRole('button', { name: '加入八分之一拍' }).click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#equation')).toHaveText('1/4 = 2/8');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '点亮蹦迪房' })).toBeVisible();
    await page.getByRole('button', { name: '加入四分之一拍' }).click();
    await page.getByRole('button', { name: '加入八分之一拍' }).click({ clickCount: 2 });
    await page.getByRole('button', { name: '加入二分之一拍' }).click();
    await page.locator('#playBtn').click();
    await expect(page.locator('#status')).toContainText('节奏开演');
    await page.locator('#checkBtn').click();

    await expect(page.getByRole('heading', { name: '全场节拍制作人！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.fraction-beats') || 'null')?.status)).toBe('completed');
  });

  test('supports clearing, sound, language, theme, and target viewports', async ({ page }) => {
    await page.getByRole('button', { name: '加入四分之一拍' }).click();
    await page.locator('#clearBtn').click();
    await expect(page.locator('#fractionTotal')).toHaveText('0');

    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Fill One Measure' })).toBeVisible();
    await expect(page.locator('#missionNav')).toHaveAttribute('aria-label', 'Missions');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('keeps every mission readable inside both target viewports', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.fraction-beats', JSON.stringify({ unlocked: 2, completed: [0, 1] }));
    });
    await page.reload();
    for (let index = 0; index < 3; index += 1) {
      await page.locator('#missionNav button').nth(index).click();
      await expectFitsViewport(page);
    }
    await page.locator('#langBtn').click();
    for (let index = 0; index < 3; index += 1) {
      await page.locator('#missionNav button').nth(index).click();
      await expectFitsViewport(page);
    }
  });
});
