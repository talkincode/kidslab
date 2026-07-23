import { test, expect } from '@playwright/test';

async function setAngle(page, angle) {
  const input = page.locator('#angleInput');
  await input.fill(String(angle));
  await input.blur();
}

async function shootAndWait(page) {
  await page.locator('#shootBtn').click();
  await expect(page.locator('#shootBtn')).toBeEnabled({ timeout: 3000 });
}

async function expectMissionFits(page) {
  const mission = await page.locator('#holeMission').evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(mission.scrollHeight).toBeLessThanOrEqual(mission.clientHeight + 1);
}

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    interactiveHeights: [...document.querySelectorAll('button:not([hidden]), input:not([hidden]), a:not([hidden])')]
      .map((element) => element.getBoundingClientRect().height)
      .filter((height) => height > 0),
    interactiveWidths: [...document.querySelectorAll('button:not([hidden]), input:not([hidden]), a:not([hidden])')]
      .map((element) => element.getBoundingClientRect().width)
      .filter((width) => width > 0),
    interactiveFonts: [...document.querySelectorAll('button:not([hidden]), input:not([hidden]), a:not([hidden])')]
      .map((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    statusFont: Number.parseFloat(getComputedStyle(document.querySelector('#status')).fontSize),
    missionFont: Number.parseFloat(getComputedStyle(document.querySelector('#holeMission')).fontSize),
    inputFont: Number.parseFloat(getComputedStyle(document.querySelector('#angleInput')).fontSize),
    missionClientHeight: document.querySelector('#holeMission').clientHeight,
    missionScrollHeight: document.querySelector('#holeMission').scrollHeight,
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(Math.min(...layout.interactiveHeights)).toBeGreaterThanOrEqual(44);
  expect(Math.min(...layout.interactiveWidths)).toBeGreaterThanOrEqual(44);
  expect(Math.min(...layout.interactiveFonts)).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.missionFont).toBeGreaterThanOrEqual(16);
  expect(layout.inputFont).toBeGreaterThanOrEqual(16);
  expect(layout.missionScrollHeight).toBeLessThanOrEqual(layout.missionClientHeight + 1);
}

test.describe('angle golf', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.angle-golf');
      localStorage.removeItem('kidslab.progress.angle-golf');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/angle-golf/');
  });

  test('recovers from a miss and completes all three holes', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '0° 直推' })).toBeVisible();

    await setAngle(page, 18);
    await shootAndWait(page);
    await expect(page.locator('#status')).toContainText('角度大了约 18°');

    await setAngle(page, -1);
    await page.locator('#shootBtn').click();
    await expect(page.locator('#status')).toContainText('请输入 0° 到 180°');

    await setAngle(page, 0);
    await shootAndWait(page);
    await expect(page.locator('#status')).toContainText('漂亮的 0° 直推');
    await expect(page.locator('#shootLabel')).toHaveText('下一洞');
    await page.locator('#langBtn').click();
    await expect(page.locator('#resultBurst')).toContainText('Perfect 0° putt');
    await page.locator('#langBtn').click();
    await page.locator('#shootBtn').click();

    await expect(page.getByRole('heading', { name: '锐角穿门' })).toBeVisible();
    await setAngle(page, 27);
    await shootAndWait(page);
    await expect(page.locator('#status')).toContainText('27° 是一个锐角');
    await page.locator('#shootBtn').click();

    await expect(page.getByRole('heading', { name: '三墙反弹' })).toBeVisible();
    await setAngle(page, 0);
    await shootAndWait(page);
    await expect(page.locator('#status')).toContainText('角度小了约 60°');

    await setAngle(page, 59);
    await shootAndWait(page);
    await expect(page.locator('#status')).toContainText('角度小了约 1°');

    await setAngle(page, 60);
    await page.locator('#shootBtn').click();
    await expect(page.getByRole('heading', { name: '三墙神仙球！' })).toBeVisible({ timeout: 3500 });
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('.course')).toHaveJSProperty('inert', true);
    await expect(page.locator('#status')).toContainText('30° 入射、30° 反射');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.angle-golf') || 'null')?.status)).toBe('completed');
    await page.locator('#playAgainBtn').click();
    await expect(page.locator('#completeModal')).toBeHidden();
    await expect(page.locator('.course')).toHaveJSProperty('inert', false);
    await expect(page.locator('#shootBtn')).toBeFocused();
  });

  test('supports hints, angle classification, sound, language, and theme controls', async ({ page }) => {
    await setAngle(page, 120);
    await expect(page.getByRole('spinbutton', { name: '角度' })).toBeVisible();
    await expect(page.locator('#angleType')).toHaveText('120° · 钝角');
    await page.locator('#hintBtn').click();
    await expect(page.locator('#status')).toContainText('水平虚线');

    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'The 0° Putt' })).toBeVisible();
    await expect(page.locator('#angleType')).toHaveText('120° · Obtuse angle');
    await expect(page.locator('#holeNav')).toHaveAttribute('aria-label', 'Holes');
    await expect(page.locator('.quick-angles')).toHaveAttribute('aria-label', 'Quick angles');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
  });

  test('keeps the course readable inside both target viewports', async ({ page }) => {
    await expectFitsViewport(page);
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.angle-golf', JSON.stringify({ unlocked: 2, completed: [0, 1] }));
    });
    await page.reload();
    for (let index = 0; index < 3; index += 1) {
      await page.locator('#holeNav button').nth(index).click();
      await expectMissionFits(page);
    }
    await page.locator('#langBtn').click();
    for (let index = 0; index < 3; index += 1) {
      await page.locator('#holeNav button').nth(index).click();
      await expectMissionFits(page);
    }
  });
});
