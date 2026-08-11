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
    lessonFont: Number.parseFloat(getComputedStyle(document.querySelector('#lessonText')).fontSize),
    canvasHeight: document.querySelector('#mapCanvas').getBoundingClientRect().height,
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);
  expect(layout.controls.filter(({ font, text }) => font < 14 && text)).toEqual([]);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.lessonFont).toBeGreaterThanOrEqual(16);
  expect(layout.canvasHeight).toBeGreaterThanOrEqual(98);
}

async function setCoordinate(page, x, y) {
  await page.locator('[data-axis="x"][data-delta="1"]').click({ clickCount: x });
  await page.locator('[data-axis="y"][data-delta="1"]').click({ clickCount: y });
}

async function solveFirstMission(page) {
  await setCoordinate(page, 4, 7);
  await page.locator('#dispatchBtn').click();
  await expect(page.locator('#status')).toContainText('(4, 7)');
  await page.locator('#nextBtn').click();
}

async function solveSecondMission(page) {
  await setCoordinate(page, 5, 5);
  await page.locator('#dispatchBtn').click();
  await expect(page.locator('#status')).toContainText('(5, 5) + (+1, −2) = (6, 3)');
  await page.locator('#nextBtn').click();
}

async function solveThirdMission(page) {
  await page.locator('[data-route="0"]').click();
  await page.locator('#dispatchBtn').click();
  for (let waypoint = 0; waypoint < 6; waypoint += 1) {
    await page.locator(`[data-waypoint="${waypoint}"]`).click();
  }
  await page.locator('#dispatchBtn').click();
  await expect(page.locator('#status')).toContainText('横街或纵街');
  await page.locator('#nextBtn').click();
}

test.describe('drone post office', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.drone-post');
      localStorage.removeItem('kidslab.progress.drone-post');
      localStorage.removeItem('kidslab.sound.muted');
      sessionStorage.setItem('kidslab.starmap', JSON.stringify({ open: true }));
    });
    await page.goto('/courseware/drone-post/');
  });

  test('recovers from navigation mistakes and completes three urgent deliveries', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '把图书送到 (4, 7)' })).toBeVisible();
    await setCoordinate(page, 7, 4);
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('横坐标在前');
    await page.locator('#resetBtn').click();
    await solveFirstMission(page);

    await expect(page.getByRole('heading', { name: '风会把无人机吹偏 (+1, −2)' })).toBeVisible();
    await setCoordinate(page, 6, 3);
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('(7, 1)');
    await page.locator('#resetBtn').click();
    await solveSecondMission(page);

    await expect(page.getByRole('heading', { name: '选出 3 km 的跨城航线' })).toBeVisible();
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('先选择一条航线');
    await page.locator('[data-route="1"]').click();
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('不是 3 km');
    await page.locator('[data-route="0"]').click();
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('依次选 6 个航点');
    await page.locator('[data-waypoint="2"]').click();
    await expect(page.locator('#status')).toContainText('斜穿楼群');
    for (let waypoint = 0; waypoint < 6; waypoint += 1) {
      await page.locator(`[data-waypoint="${waypoint}"]`).click();
    }
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('六段航线都沿横街或纵街飞行');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '你成为了“星光领航员”！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('#course')).toHaveJSProperty('inert', true);
    await expect(page.locator('#topbar')).toHaveJSProperty('inert', true);
    await expect(page.locator('.kidslab-starmap-back')).toBeHidden();
    await page.keyboard.press('Tab');
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.drone-post') || 'null')?.status)).toBe('completed');
  });

  test('persists progress and supports language, theme, sound, and target viewports', async ({ page }) => {
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await solveFirstMission(page);
    await setCoordinate(page, 5, 5);
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Wind will shift the drone by (+1, −2)' })).toBeVisible();
    await expect(page.locator('#status')).toContainText('Command (5, 5) entered');
    await expect(page.locator('#missionNav')).toHaveAttribute('aria-label', 'Flight progress');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expect(page.locator('[data-axis="x"][data-delta="-1"]')).toHaveAttribute('aria-label', 'Decrease x by 1');
    await expectFitsViewport(page);

    await page.reload();
    await expect(page.locator('#xValue')).toHaveText('5');
    await expect(page.locator('#yValue')).toHaveText('5');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page);
    await page.locator('#dispatchBtn').click();
    await page.locator('#nextBtn').click();
    await page.locator('[data-route="0"]').click();
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('[data-waypoint="0"]')).toBeVisible();
    await expectFitsViewport(page);
  });

  test('restores completion and starts a fresh night shift', async ({ page }) => {
    await solveFirstMission(page);
    await solveSecondMission(page);
    await solveThirdMission(page);
    await page.reload();

    await expect(page.getByRole('heading', { name: '你成为了“星光领航员”！' })).toBeVisible();
    await expect(page.locator('.kidslab-starmap-back')).toBeHidden();
    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '把图书送到 (4, 7)' })).toBeVisible();
    await expect(page.locator('#xValue')).toHaveText('0');
    await expect(page.locator('#yValue')).toHaveText('0');
  });
});
