import { test, expect } from '@playwright/test';

test.describe.configure({ timeout: 90000 });

async function ensurePanelOpen(page) {
  if (await page.locator('#panelHandle').getAttribute('aria-expanded') === 'true') return;
  await page.locator('#panelHandle').click();
  await expect(page.locator('#panelHandle')).toHaveAttribute('aria-expanded', 'true');
}

async function setSpeedRatio(page, ratio) {
  await ensurePanelOpen(page);
  await page.locator('#speedRange').fill(String(Math.round(ratio * 1000)));
  await page.locator('#speedRange').dispatchEvent('input');
}

async function setAltitude(page, km) {
  await ensurePanelOpen(page);
  await page.locator('#altitudeRange').fill(String(km));
  await page.locator('#altitudeRange').dispatchEvent('input');
  await expect(page.locator('#altitudeVal')).toContainText('km');
}

async function launchAndWait(page, expectedKind) {
  await page.locator('#launchBtn').click();
  await expect(page.locator('#kindVal')).toHaveText(expectedKind, { timeout: 25000 });
}

test.describe('circular orbit lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const initializedKey = 'kidslab.e2e.circular-orbit-lab.initialized';
      if (sessionStorage.getItem(initializedKey)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.circular-orbit-lab.music', '0');
      localStorage.setItem('kidslab.circular-orbit-lab.sfx', '0');
      localStorage.removeItem('kidslab.circular-orbit-lab');
      localStorage.removeItem('kidslab.progress.circular-orbit-lab');
      sessionStorage.setItem(initializedKey, 'true');
    });
    await page.goto('/courseware/circular-orbit-lab/');
    await expect(page.locator('#markCircular')).toHaveText('7.67');
  });

  test('the console reads circular and escape speeds, and higher orbits are slower', async ({ page }) => {
    await expect(page.locator('#altHud')).toHaveText('400 km');
    await expect(page.locator('#speedHud')).toHaveText('7.67 km/s');
    await expect(page.locator('#markEscape')).toHaveText('10.85');
    await expect(page.locator('#predictionGrid, [data-prediction], .mobile-nav')).toHaveCount(0);

    await setAltitude(page, 8000);
    await expect(page.locator('#altHud')).toHaveText('8,000 km');
    const orbital = Number(await page.locator('#markCircular').textContent());
    const escape = Number(await page.locator('#markEscape').textContent());
    expect(orbital).toBeLessThan(7.67);
    expect(escape / orbital).toBeCloseTo(Math.SQRT2, 2);
  });

  test('a matched speed produces a circular orbit and a 92-minute period', async ({ page }) => {
    await launchAndWait(page, '圆轨');
    await expect(page.locator('#periodVal')).toHaveText('92.4 min');
    await expect(page.locator('#statusVal')).toHaveText('已入轨');

    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr').first()).toContainText('圆轨');
    await expect(page.locator('#trialRows tr').first()).toContainText('92.4 min');
  });

  test('too slow re-enters, too fast escapes, and abort recovers the console', async ({ page }) => {
    await setSpeedRatio(page, 0.9);
    await launchAndWait(page, '坠回');
    await expect(page.locator('#statusVal')).toHaveText('坠入大气');
    await expect(page.locator('#periodVal')).toHaveText('—');
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr').first()).toContainText('坠回');

    await page.locator('#abortBtn').click();
    await expect(page.locator('#statusVal')).toHaveText('待发射');
    await expect(page.locator('#kindVal')).toHaveText('—');

    await setSpeedRatio(page, 1.5);
    await launchAndWait(page, '逃逸');
    await expect(page.locator('#statusVal')).toHaveText('飞离地球');
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(2);
  });

  test('refuses to record before launch and keeps the notebook empty', async ({ page }) => {
    await page.locator('#recordBtn').click();
    await expect(page.locator('#feedback')).toContainText('还没发射');
    await expect(page.locator('#trialRows tr')).toHaveCount(0);
    await expect(page.locator('#statusVal')).toHaveText('待发射');

    await page.locator('#launchBtn').click();
    await page.locator('#recordBtn').click();
    await expect(page.locator('#feedback')).toContainText('还在飞');
    await expect(page.locator('#trialRows tr')).toHaveCount(0);

    await expect(page.locator('#kindVal')).toHaveText('圆轨', { timeout: 25000 });
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
  });

  test('logged launches appear on the speed-band chart', async ({ page }) => {
    await setSpeedRatio(page, 0.9);
    await launchAndWait(page, '坠回');
    await page.locator('#recordBtn').click();
    await setSpeedRatio(page, 1.12);
    await launchAndWait(page, '椭圆');
    await page.locator('#recordBtn').click();

    await ensurePanelOpen(page);
    await expect(page.locator('#bandPoints circle')).toHaveCount(2);
    await expect(page.locator('.band-point--crash')).toHaveCount(1);
    await expect(page.locator('.band-point--ellipse')).toHaveCount(1);
    await expect(page.locator('#circularCurve')).toHaveAttribute('d', /^M40/);
    await expect(page.locator('#escapeCurve')).toHaveAttribute('d', /^M40/);
  });

  test('a one-day circular orbit is visible without a design-challenge lock', async ({ page }) => {
    await setAltitude(page, 35800);
    await setSpeedRatio(page, 1);
    await launchAndWait(page, '圆轨');
    await expect(page.locator('#periodVal')).toHaveText('23 h 56 min');
    await expect(page.locator('#coach')).toContainText('一天');
    await expect(page.locator('[data-station="design"], #designFeedback, #missionCount')).toHaveCount(0);
  });

  test('logging the three endings completes the lab and restores after reload', async ({ page }) => {
    await launchAndWait(page, '圆轨');
    await page.locator('#recordBtn').click();
    await setSpeedRatio(page, 0.9);
    await launchAndWait(page, '坠回');
    await page.locator('#recordBtn').click();
    await setSpeedRatio(page, 1.5);
    await launchAndWait(page, '逃逸');
    await page.locator('#recordBtn').click();

    await ensurePanelOpen(page);
    await expect(page.locator('#completeCard')).toBeVisible();
    await expect(page.locator('#conclusionStatus')).toContainText('坠回');
    await expect(page.locator('#trialRows tr')).toHaveCount(3);
    await page.reload();
    await ensurePanelOpen(page);
    await expect(page.locator('#trialRows tr')).toHaveCount(3);
    await expect(page.locator('#completeCard')).toBeVisible();

    await page.locator('#resetBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(0);
    await expect(page.locator('#statusVal')).toHaveText('待发射');
  });

  test('language, theme, mute and layout hold up on both viewports', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.locator('#langBtn').click();
    await expect(page.locator('#launchBtn')).toContainText('Launch');
    await expect(page.locator('#markCircular')).toHaveText('7.67');
    await page.locator('#langBtn').click();
    await expect(page.locator('#launchBtn')).toContainText('发射');

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#scene')).toBeVisible();

    const soundBtn = page.locator('#soundBtn');
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(soundBtn).toHaveAttribute('aria-label', '打开音效');
    await soundBtn.click();
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'true');
    const box = await soundBtn.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);

    const expanded = await page.locator('#panelHandle').getAttribute('aria-expanded');
    await page.locator('#panelHandle').click();
    await expect(page.locator('#panelHandle')).toHaveAttribute(
      'aria-expanded',
      expanded === 'true' ? 'false' : 'true',
    );
    await page.locator('#panelHandle').click();
    await expect(page.locator('#panelHandle')).toHaveAttribute('aria-expanded', expanded);

    const overflow = await page.evaluate(() => ({
      vertical: document.documentElement.scrollHeight > document.documentElement.clientHeight + 1,
      horizontal: document.body.scrollWidth > document.body.clientWidth + 1,
    }));
    expect(overflow.vertical).toBe(false);
    expect(overflow.horizontal).toBe(false);
    expect(errors).toEqual([]);
  });
});
