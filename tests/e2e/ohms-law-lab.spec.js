import { test, expect } from '@playwright/test';

test.setTimeout(45000);

async function slide(page, id, value) {
  await page.locator(`#${id}`).fill(String(value));
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('initialized')) {
      localStorage.clear();
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.ohms-law-lab.sound', 'true');
      sessionStorage.setItem('initialized', '1');
    }
  });
  await page.goto('/courseware/ohms-law-lab/');
});

test('freely adjusts sliders and records without a quiz, then restores observations', async ({ page }) => {
  await expect(page.locator('#recordBtn')).toBeEnabled();
  await expect(page.locator('#faultExamples, [data-wire], #repairBtn')).toHaveCount(0);
  await slide(page, 'voltageSelect', 3.6);
  await slide(page, 'resistanceSelect', 30);
  await expect(page.locator('#ampReadout')).toHaveText('0.12 A');
  await expect(page.locator('#calculation')).toContainText('3.6 V / 30 Ω = 0.12 A');
  await expect(page.locator('[data-live-point]')).toHaveCount(1);
  await page.locator('#recordBtn').click();
  await slide(page, 'resistanceSelect', 15);
  await expect(page.locator('#ampReadout')).toHaveText('0.24 A');
  await page.locator('#recordBtn').click();
  await expect(page.locator('#trialRows tr')).toHaveCount(2);
  await page.reload();
  await expect(page.locator('#trialRows tr')).toHaveCount(2);
  await expect(page.locator('#resistanceSelect')).toHaveValue('15');
  await page.locator('#resetBtn').click();
  await expect(page.locator('#trialRows tr')).toHaveCount(0);
  await expect(page.locator('#resistanceSelect')).toHaveValue('15');
});

test('distinguishes theoretical calculation from protected readings and accepts zero voltage', async ({ page }) => {
  await slide(page, 'voltageSelect', 6);
  await slide(page, 'resistanceSelect', 5);
  await expect(page.locator('#ampReadout')).toHaveText('1.2 A');
  await page.locator('#ammeterRange').selectOption('0.3');
  await expect(page.locator('#instrumentNote')).toContainText('电流表超量程');
  await expect(page.locator('#recordBtn')).toBeDisabled();
  await page.locator('#ammeterRange').selectOption('3');
  await expect(page.locator('#ampReadout')).toHaveText('1.2 A');
  await expect(page.locator('#recordBtn')).toBeEnabled();
  await slide(page, 'voltageSelect', 0);
  await expect(page.locator('#ampReadout')).toHaveText('0 A');
  await expect(page.locator('#recordBtn')).toBeEnabled();
});

test('keeps zoom, translations, mute controls and mobile layout working', async ({ page }) => {
  await expect(page.locator('#circuitScene')).toHaveAttribute('data-zoom', '1.00');
  await page.locator('#zoomInBtn').click();
  await expect(page.locator('#circuitScene')).toHaveAttribute('data-zoom', '1.25');
  await page.locator('#topViewBtn').click();
  await expect(page.locator('#circuitScene')).toHaveAttribute('data-zoom', '1.00');
  await page.locator('#langBtn').click();
  await expect(page.locator('#missionTitle')).toHaveText('Twist voltage and resistance. Watch the spark.');
  await page.locator('#themeBtn').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('#musicBtn')).toHaveAttribute('aria-pressed', /.+/);
  await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', /.+/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('shares one current state across meters, graph and fault recovery while preserving history', async ({ page }) => {
  await slide(page, 'voltageSelect', 2.9);
  await slide(page, 'resistanceSelect', 36);
  await expect(page.locator('#supplySetting')).toContainText('2.9 V');
  await expect(page.locator('#theoryCurrent')).toContainText('0.081 A');
  await expect(page.locator('#ampReadout')).toHaveText('0.081 A');
  const point = page.locator('[data-live-point]');
  expect(Number(await point.getAttribute('cx'))).toBeCloseTo(38 + 2.9 / 6 * 264);
  await page.locator('#recordBtn').click();
  const oldSlope = await page.locator('[data-theory-line]').getAttribute('y2');
  await slide(page, 'resistanceSelect', 18);
  expect(await page.locator('[data-theory-line]').getAttribute('y2')).not.toBe(oldSlope);
  await expect(page.locator('#ampReadout')).toHaveText('0.161 A');
  await expect(page.locator('[data-history-point]')).toHaveCount(1);
  await page.locator('#recordBtn').click();
  await slide(page, 'voltageSelect', 4);
  await page.locator('#recordBtn').click();
  await expect(page.locator('#trialRows tr')).toHaveCount(3);
  await expect(page.locator('[data-history-point]')).toHaveCount(3);
  expect(await page.locator('.information-column').evaluate((e) => getComputedStyle(e).overflowY)).toBe('auto');
  expect(await page.locator('.information-column').evaluate((e) => [...e.querySelectorAll('*')].filter((n) => ['auto', 'scroll'].includes(getComputedStyle(n).overflowY)).length)).toBe(0);
});

test('type scale matches the optics-lab hierarchy while staying above child floors', async ({ page }) => {
  const sizes = await page.evaluate(() => {
    const px = (sel) => Number.parseFloat(getComputedStyle(document.querySelector(sel)).fontSize);
    return {
      body: px('body'),
      title: px('.bar__title'),
      hudLabel: px('.hud__label'),
      hudNum: px('.hud__chip b'),
      coach: px('#missionTitle'),
      button: px('#recordBtn'),
      hint: px('.panel__hint, .meter-line'),
    };
  });
  expect(sizes.body).toBeGreaterThanOrEqual(16);
  expect(sizes.title).toBeGreaterThanOrEqual(16);
  expect(sizes.title).toBeLessThanOrEqual(22);
  expect(sizes.hudLabel).toBeGreaterThanOrEqual(14);
  expect(sizes.hudNum).toBe(16);
  expect(sizes.coach).toBeGreaterThanOrEqual(16);
  expect(sizes.button).toBeGreaterThanOrEqual(16);
  expect(sizes.hint).toBeGreaterThanOrEqual(14);
});

test('has no wiring fault demonstrations and migrates old faulty saves to normal wiring', async ({ page }) => {
  await expect(page.locator('#faultExamples, [data-wire], #repairBtn')).toHaveCount(0);
  await page.locator('#recordBtn').click();
  await expect(page.locator('#trialCount')).toHaveText('1');
  await page.evaluate(() => {
    const key = 'kidslab.ohms-law-lab';
    const raw = localStorage.getItem(key);
    if (!raw) throw new Error('lab save missing after record');
    const saved = JSON.parse(raw);
    saved.setup.wiring = 'ammeter-parallel';
    localStorage.setItem(key, JSON.stringify(saved));
  });
  await page.reload();
  await expect(page.locator('#app')).toHaveAttribute('data-status', 'live');
  await expect(page.locator('#ampReadout')).toHaveText('0.15 A');
  await expect(page.locator('#trialRows tr')).toHaveCount(1);
});
