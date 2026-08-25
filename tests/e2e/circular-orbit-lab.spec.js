import { test, expect } from '@playwright/test';

async function selectMobilePanel(page, panel) {
  const viewport = page.viewportSize();
  if (!viewport || viewport.width > 900) return;
  const button = page.locator(`.mobile-nav__button[data-mobile-panel="${panel}"]`);
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
}

async function setSpeedRatio(page, ratio) {
  await selectMobilePanel(page, 'stage');
  await page.locator('#speedRange').fill(String(Math.round(ratio * 1000)));
  await page.dispatchEvent('#speedRange', 'input');
}

async function setAltitude(page, km) {
  await selectMobilePanel(page, 'stage');
  await page.locator('#altitudeRange').fill(String(km));
  await page.dispatchEvent('#altitudeRange', 'input');
  await expect(page.locator('#altitudeValue')).toContainText('km');
}

/** 发射后要等仿真跑完：闭合轨道约 9 秒一圈，坠回/逃逸更快 */
async function launchAndWait(page, expectedKind) {
  await selectMobilePanel(page, 'stage');
  await page.locator('#launchBtn').click();
  await expect(page.locator('#entryKind')).toHaveText(expectedKind, { timeout: 25000 });
  await expect(page.locator('#logBtn')).toBeEnabled();
}

async function logTrial(page) {
  await selectMobilePanel(page, 'log');
  await page.locator('#logBtn').click();
  await expect(page.locator('#logBtn')).toBeDisabled();
}

test.describe('circular orbit lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const initializedKey = 'kidslab.e2e.circular-orbit-lab.initialized';
      if (sessionStorage.getItem(initializedKey)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.circular-orbit-lab.sound', 'off');
      localStorage.removeItem('kidslab.progress.circular-orbit-lab');
      sessionStorage.setItem(initializedKey, 'true');
    });
    await page.goto('/courseware/circular-orbit-lab/');
    await expect(page.locator('#markCircular')).toHaveText('7.67');
  });

  test('the console reads out the orbital and escape speeds for the chosen altitude', async ({ page }) => {
    await selectMobilePanel(page, 'stage');
    await expect(page.locator('#readAltitude')).toHaveText('400 km');
    await expect(page.locator('#readSpeed')).toHaveText('7.67 km/s');
    await expect(page.locator('#markEscape')).toHaveText('10.85');

    /* 越高的轨道，环绕速度和逃逸速度都变小 */
    await setAltitude(page, 8000);
    await expect(page.locator('#readAltitude')).toHaveText('8,000 km');
    const orbital = Number(await page.locator('#markCircular').textContent());
    const escape = Number(await page.locator('#markEscape').textContent());
    expect(orbital).toBeLessThan(7.67);
    expect(escape / orbital).toBeCloseTo(Math.SQRT2, 2);
  });

  test('a matched speed produces a circular orbit and a measured period of 92 minutes', async ({ page }) => {
    test.setTimeout(90000);
    await selectMobilePanel(page, 'task');
    await page.locator('[data-prediction="higher"]').click();
    await expect(page.locator('#predictionFeedback')).toHaveClass(/is-success/);

    await launchAndWait(page, '圆轨');
    await expect(page.locator('#entryPeriod')).toHaveText('92.4 min');
    await expect(page.locator('#labState')).toHaveText('已入轨');

    await logTrial(page);
    await expect(page.locator('#trialBody tr').first()).toContainText('圆轨');
    await expect(page.locator('#trialBody tr').first()).toContainText('92.4 min');
    await selectMobilePanel(page, 'task');
    await expect(page.locator('#missionCount')).toHaveText('1 / 3');
  });

  test('too slow re-enters and too fast escapes, and the log keeps both failures', async ({ page }) => {
    test.setTimeout(90000);
    await setSpeedRatio(page, 0.9);
    await launchAndWait(page, '坠回');
    await expect(page.locator('#labState')).toHaveText('坠入大气');
    await expect(page.locator('#entryPeriod')).toHaveText('—');
    await logTrial(page);
    /* 近地点落到地面以下，正是它掉回来的原因 */
    await expect(page.locator('#trialBody tr').first()).toContainText('地面以下');

    await setSpeedRatio(page, 1.5);
    await launchAndWait(page, '逃逸');
    await expect(page.locator('#labState')).toHaveText('飞离地球');
    await logTrial(page);
    await selectMobilePanel(page, 'task');
    await expect(page.locator('#missionCount')).toHaveText('2 / 3');
  });

  test('a failed launch can be recalled and retried in place', async ({ page }) => {
    test.setTimeout(90000);
    await setSpeedRatio(page, 0.9);
    await launchAndWait(page, '坠回');

    /* 收回卫星后读数清空，参数可以原地改了再来 */
    await selectMobilePanel(page, 'stage');
    await page.locator('#abortBtn').click();
    await expect(page.locator('#labState')).toHaveText('待发射');
    await selectMobilePanel(page, 'log');
    await expect(page.locator('#logBtn')).toBeDisabled();
    await expect(page.locator('#entryHint')).toContainText('发射一次');
    await expect(page.locator('#trialBody tr').first()).toContainText('还没有记录');

    await setSpeedRatio(page, 1);
    await launchAndWait(page, '圆轨');
    await logTrial(page);
    await expect(page.locator('#trialBody tr').first()).toContainText('圆轨');
  });

  test('the speed band chart plots every logged launch in its own band', async ({ page }) => {
    test.setTimeout(90000);
    await setSpeedRatio(page, 0.9);
    await launchAndWait(page, '坠回');
    await logTrial(page);
    await setSpeedRatio(page, 1.12);
    await launchAndWait(page, '椭圆');
    await logTrial(page);

    await selectMobilePanel(page, 'task');
    await page.locator('[data-station="analyse"]').click();
    await expect(page.locator('#bandPoints circle')).toHaveCount(2);
    await expect(page.locator('.band-point--crash')).toHaveCount(1);
    await expect(page.locator('.band-point--ellipse')).toHaveCount(1);
    await expect(page.locator('#circularCurve')).toHaveAttribute('d', /^M40/);
    await expect(page.locator('#escapeCurve')).toHaveAttribute('d', /^M40/);
    await expect(page.locator('#predictionVerdict')).toBeHidden();

    await page.locator('[data-station="launch"]').click();
    await expect(page.locator('#conclusion')).toContainText('速度小了坠回');
  });

  test('the design challenge only accepts a circular orbit with a one-day period', async ({ page }) => {
    test.setTimeout(120000);
    await selectMobilePanel(page, 'task');
    await page.locator('[data-station="design"]').click();
    await expect(page.locator('#designTarget')).toHaveText('23 h 56 min');
    await expect(page.locator('#designFeedback')).toContainText('还没有符合的圆轨');

    /* 高度不够，一圈比一天短 */
    await setAltitude(page, 8000);
    await setSpeedRatio(page, 1);
    await launchAndWait(page, '圆轨');
    await selectMobilePanel(page, 'task');
    await expect(page.locator('#designFeedback')).toContainText('比一天短');

    /* 同步轨道高度约 35 800 km */
    await setAltitude(page, 35800);
    await setSpeedRatio(page, 1);
    await launchAndWait(page, '圆轨');
    await expect(page.locator('#entryPeriod')).toHaveText('23 h 56 min');
    await selectMobilePanel(page, 'task');
    await expect(page.locator('#designFeedback')).toContainText('成功');
    await expect(page.locator('#designFeedback')).toHaveClass(/is-success/);
  });

  test('a non-circular orbit is rejected by the synchronous-orbit check', async ({ page }) => {
    test.setTimeout(90000);
    await setAltitude(page, 35800);
    await setSpeedRatio(page, 1.06);
    await launchAndWait(page, '椭圆');
    await selectMobilePanel(page, 'task');
    await page.locator('[data-station="design"]').click();
    await expect(page.locator('#designFeedback')).toContainText('不是圆轨');
    await expect(page.locator('#designFeedback')).toHaveClass(/is-error/);
  });

  test('finishing all three endings plus the design challenge completes the lab', async ({ page }) => {
    test.setTimeout(180000);
    await selectMobilePanel(page, 'task');
    await page.locator('[data-prediction="higher"]').click();

    await setSpeedRatio(page, 1);
    await launchAndWait(page, '圆轨');
    await logTrial(page);
    await setSpeedRatio(page, 0.9);
    await launchAndWait(page, '坠回');
    await logTrial(page);
    await setSpeedRatio(page, 1.5);
    await launchAndWait(page, '逃逸');
    await logTrial(page);
    await selectMobilePanel(page, 'task');
    await expect(page.locator('#missionCount')).toHaveText('3 / 3');

    await setAltitude(page, 35800);
    await setSpeedRatio(page, 1);
    await launchAndWait(page, '圆轨');
    await logTrial(page);

    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.circular-orbit-lab') || 'null')?.status)).toBe('completed');
    await selectMobilePanel(page, 'log');
    await expect(page.locator('#conclusion')).toHaveClass(/is-success/);
    await expect(page.locator('#trialBody tr')).toHaveCount(4);
  });

  test('language, theme, mute and layout hold up on both viewports', async ({ page }) => {
    await page.locator('#langBtn').click();
    await expect(page.locator('#stageTitle')).toHaveText('Launch console');
    await expect(page.locator('#markCircular')).toHaveText('7.67');
    await page.locator('#langBtn').click();
    await expect(page.locator('#stageTitle')).toHaveText('发射控制台');

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await selectMobilePanel(page, 'stage');
    await expect(page.locator('#scene')).toBeVisible();

    const soundBtn = page.locator('#soundBtn');
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(soundBtn).toHaveAttribute('aria-label', '打开声音');
    await soundBtn.click();
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'false');
    const box = await soundBtn.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);

    const overflow = await page.evaluate(() => ({
      vertical: document.documentElement.scrollHeight > document.documentElement.clientHeight + 1,
      horizontal: document.body.scrollWidth > document.body.clientWidth + 1,
    }));
    expect(overflow.vertical).toBe(false);
    expect(overflow.horizontal).toBe(false);
  });
});
