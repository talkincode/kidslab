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
    lessonFont: Number.parseFloat(getComputedStyle(document.querySelector('#lessonText')).fontSize),
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width }) => width < 44)).toEqual([]);
  expect(layout.controls.filter(({ height }) => height < 44)).toEqual([]);
  expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.lessonFont).toBeGreaterThanOrEqual(16);
}

test.describe('wave band', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
    });
    await page.goto('/courseware/wave-band/');
  });

  test('recovers from wrong settings and completes all three sound experiments', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '把琴弦调成高音' })).toBeVisible();

    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('先拨一下');
    await page.locator('#tensionSlider').fill('2');
    await page.locator('#pluckBtn').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('还不是高音');
    await page.locator('#tensionSlider').fill('3');
    await page.locator('#pluckBtn').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('510 Hz');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '只让声音变响' })).toBeVisible();
    await page.locator('#loudPluckBtn').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('振幅还不够大');
    await page.locator('#strengthSlider').fill('3');
    await page.locator('#loudPluckBtn').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('音高没变');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '让闹钟无声地响' })).toBeVisible();
    await page.locator('#alarmBtn').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('空气还在');
    await page.locator('#pumpBtn').click({ clickCount: 4 });
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('再敲一次');
    await page.locator('#alarmBtn').click();
    await page.locator('#checkBtn').click();

    await expect(page.getByRole('heading', { name: '首席声波指挥！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.wave-band') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, and the required viewport', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Tune a High Note' })).toBeVisible();
    await expect(page.locator('#missionNav')).toHaveAttribute('aria-label', 'Lab missions');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('keeps all three labs readable in Chinese and English', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.wave-band', JSON.stringify({ unlocked: 2, completed: [0, 1] }));
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
