import { test, expect } from '@playwright/test';

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    controls: [...document.querySelectorAll('button:not([hidden]), a:not([hidden]), input:not([hidden])')]
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
    containers: ['.farm', '.console'].map((selector) => {
      const element = document.querySelector(selector);
      return { selector, clientHeight: element.clientHeight, scrollHeight: element.scrollHeight };
    }),
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width }) => width < 44)).toEqual([]);
  expect(layout.controls.filter(({ height }) => height < 44)).toEqual([]);
  expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.lessonFont).toBeGreaterThanOrEqual(16);
  expect(layout.containers.filter(({ clientHeight, scrollHeight }) => scrollHeight > clientHeight + 1)).toEqual([]);
}

async function setRange(page, value) {
  await page.locator('#mixRange').evaluate((range, nextValue) => {
    range.value = String(nextValue);
    range.dispatchEvent(new Event('input', { bubbles: true }));
    range.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function finishFirstNight(page) {
  await setRange(page, 7);
  await page.locator('#checkTrialBtn').click();
  await expect(page.locator('#status')).toContainText('5 只三脚兽 + 7 只四脚兽');
  await page.locator('#nextBtn').click();
}

async function finishSecondNight(page) {
  await page.locator('#assumeBtn').click();
  await expect(page.locator('#status')).toContainText('42 条腿');
  await page.locator('#exchangeBtn').click();
  await expect(page.locator('#status')).toContainText('你没用试的');
  await page.locator('#nextBtn').click();
}

test.describe('alien farm', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.alien-farm');
      localStorage.removeItem('kidslab.progress.alien-farm');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/alien-farm/');
  });

  test('recovers from sensor mismatches and completes all three night shifts', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '保持 12 只，调到 43 条腿' })).toBeVisible();
    await page.locator('#checkTrialBtn').click();
    await expect(page.locator('#status')).toContainText('36 条腿');
    await expect(page.locator('#mixRange')).toHaveValue('0');
    await finishFirstNight(page);

    await expect(page.getByRole('heading', { name: '不用挨个试，一步找出 48 条腿' })).toBeVisible();
    await finishSecondNight(page);

    await expect(page.getByRole('heading', { name: '只看 20 只眼、48 条腿' })).toBeVisible();
    await page.locator('#checkSensorsBtn').click();
    await expect(page.locator('#status')).toContainText('12 只眼、28 条腿');
    await expect(page.locator('#sensorTriCount')).toHaveText('4');
    await expect(page.locator('#sensorQuadCount')).toHaveText('4');

    for (let index = 0; index < 4; index += 1) {
      await page.locator('[data-species="tri"][data-delta="1"]').click();
    }
    for (let index = 0; index < 2; index += 1) {
      await page.locator('[data-species="quad"][data-delta="1"]').click();
    }
    await expect(page.locator('#eyeCount')).toHaveText('20');
    await expect(page.locator('#legCount')).toHaveText('48');
    await page.locator('#checkSensorsBtn').click();

    await expect(page.getByRole('heading', { name: '天亮了，农场全貌出现！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('.course')).toHaveJSProperty('inert', true);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.alien-farm') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, persistence, and target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Keep 12 Creatures and Reach 43 Legs' })).toBeVisible();
    await expect(page.locator('#missionNav')).toHaveAttribute('aria-label', 'Farm missions');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);

    await setRange(page, 7);
    await page.locator('#checkTrialBtn').click();
    await page.locator('#nextBtn').click();
    await page.locator('#assumeBtn').click();
    await page.reload();

    await expect(page.getByRole('heading', { name: 'Reach 48 Legs without Guessing' })).toBeVisible();
    await expect(page.locator('#assumptionFormula')).toContainText('48 − 42 = 6');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expectFitsViewport(page);
  });

  test('restores completion and can start a fresh night shift', async ({ page }) => {
    await finishFirstNight(page);
    await finishSecondNight(page);
    for (let index = 0; index < 4; index += 1) {
      await page.locator('[data-species="tri"][data-delta="-1"]').click();
    }
    await page.reload();
    await expect(page.locator('#sensorTriCount')).toHaveText('0');
    for (let index = 0; index < 8; index += 1) {
      await page.locator('[data-species="tri"][data-delta="1"]').click();
    }
    for (let index = 0; index < 2; index += 1) {
      await page.locator('[data-species="quad"][data-delta="1"]').click();
    }
    await page.locator('#checkSensorsBtn').click();
    await page.reload();
    await expect(page.getByRole('heading', { name: '天亮了，农场全貌出现！' })).toBeVisible();

    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '保持 12 只，调到 43 条腿' })).toBeVisible();
    await expect(page.locator('#mixRange')).toHaveValue('0');
    await expect(page.locator('#legCount')).toHaveText('36');
  });
});
