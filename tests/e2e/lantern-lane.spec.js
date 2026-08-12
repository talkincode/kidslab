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
          text: element.textContent.trim(),
          width: rect.width,
          height: rect.height,
          font: Number.parseFloat(getComputedStyle(element).fontSize),
        };
      })
      .filter(({ width, height }) => width > 0 && height > 0),
    statusFont: Number.parseFloat(getComputedStyle(document.querySelector('#status')).fontSize),
    canvasHeight: document.querySelector('#sceneCanvas').getBoundingClientRect().height,
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  // Mobile can scroll slightly; desktop should stay within one screen.
  if (layout.viewportWidth >= 900) {
    expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  }
  expect(layout.controls.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);
  expect(layout.controls.filter(({ font }) => font < 16)).toEqual([]);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.canvasHeight).toBeGreaterThanOrEqual(105);
}

async function setGuess(page, value) {
  const current = Number(await page.locator('#guessValue').textContent());
  const delta = value - current;
  const button = delta > 0 ? page.locator('#plusBtn') : page.locator('#minusBtn');
  for (let i = 0; i < Math.abs(delta); i += 1) {
    await button.click();
  }
  await expect(page.locator('#guessValue')).toHaveText(String(value));
}

async function clearStage(page) {
  await setGuess(page, 11);
  await page.locator('#placeBtn').click();
  await expect(page.locator('#status')).toContainText('10 + 1 = 11');
  await page.locator('#nextBtn').click();
}

async function clearBridge(page) {
  await setGuess(page, 4);
  await page.locator('#placeBtn').click();
  await expect(page.locator('#status')).toContainText('5 − 1 = 4');
  await page.locator('#nextBtn').click();
}

async function clearRing(page) {
  await setGuess(page, 6);
  await page.locator('#placeBtn').click();
  await expect(page.locator('#status')).toContainText('60 ÷ 10 = 6');
  await page.locator('#nextBtn').click();
}

async function clearSaw(page) {
  await setGuess(page, 4);
  await page.locator('#placeBtn').click();
  await expect(page.locator('#status')).toContainText('段数 − 1');
  await page.locator('#nextBtn').click();
}

test.describe('lantern lane', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.lantern-lane');
      localStorage.removeItem('kidslab.progress.lantern-lane');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/lantern-lane/');
  });

  test('recovers from wrong counts and completes all five interval stages', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '100 米长街，每 10 米一盏' })).toBeVisible();

    await setGuess(page, 10);
    await page.locator('#placeBtn').click();
    await expect(page.locator('#status')).toContainText('少了');
    await expect(page.locator('#stage')).toHaveAttribute('data-result', 'short');

    await setGuess(page, 12);
    await page.locator('#placeBtn').click();
    await expect(page.locator('#status')).toContainText('多了');
    await expect(page.locator('#stage')).toHaveAttribute('data-result', 'extra');

    await setGuess(page, 11);
    await page.locator('#placeBtn').click();
    await expect(page.locator('#status')).toContainText('10 + 1 = 11');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '50 米石桥，每 10 米一根柱' })).toBeVisible();
    await setGuess(page, 5);
    await page.locator('#placeBtn').click();
    await expect(page.locator('#status')).toContainText('柱子');
    await setGuess(page, 4);
    await page.locator('#placeBtn').click();
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '周长 60 米的湖，每 10 米一盏' })).toBeVisible();
    await setGuess(page, 6);
    await page.locator('#placeBtn').click();
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '把圆木锯成 5 段' })).toBeVisible();
    await setGuess(page, 4);
    await page.locator('#placeBtn').click();
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '从 3 楼爬到 8 楼' })).toBeVisible();
    await setGuess(page, 5);
    await page.locator('#placeBtn').click();
    await expect(page.locator('#status')).toContainText('8 − 3 = 5');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '你点亮了整条灯笼街！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('#course')).toHaveJSProperty('inert', true);
    await expect(page.locator('#finaleGrid article')).toHaveCount(5);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.lantern-lane') || 'null')?.status)).toBe('completed');
  });

  test('persists progress and supports language, theme, sound, and target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await clearStage(page);
    await setGuess(page, 4);
    await page.locator('#placeBtn').click();
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: '50 m bridge, one post every 10 m' })).toBeVisible();
    await expect(page.locator('#status')).toContainText('no ends');
    await expectFitsViewport(page);

    await page.reload();
    await expect(page.locator('#nextBtn')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#guessValue')).toHaveText('4');
    await expectFitsViewport(page);
  });

  test('restores completion and can start a fresh festival', async ({ page }) => {
    await clearStage(page);
    await clearBridge(page);
    await clearRing(page);
    await clearSaw(page);
    await setGuess(page, 5);
    await page.locator('#placeBtn').click();
    await page.locator('#nextBtn').click();
    await expect(page.locator('#finale')).toBeVisible();

    await page.reload();
    await expect(page.locator('#finale')).toBeVisible();
    await expect(page.getByRole('heading', { name: '你点亮了整条灯笼街！' })).toBeVisible();

    await page.locator('#playAgainBtn').click();
    await expect(page.locator('#finale')).toBeHidden();
    await expect(page.getByRole('heading', { name: '100 米长街，每 10 米一盏' })).toBeVisible();
    await expect(page.locator('#guessValue')).toHaveText('10');
    await expect.poll(() => page.evaluate(() =>
      localStorage.getItem('kidslab.progress.lantern-lane'))).toBeNull();
  });
});
