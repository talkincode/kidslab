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
    packetLabelFonts: [...document.querySelectorAll('.packet small')]
      .map((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    statusFont: Number.parseFloat(getComputedStyle(document.querySelector('#status')).fontSize),
    lessonFont: Number.parseFloat(getComputedStyle(document.querySelector('#lessonText')).fontSize),
    canvasHeight: document.querySelector('#mapCanvas').getBoundingClientRect().height,
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);
  expect(layout.controls.filter(({ font }) => font < 16)).toEqual([]);
  expect(Math.min(...layout.packetLabelFonts)).toBeGreaterThanOrEqual(14);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.lessonFont).toBeGreaterThanOrEqual(16);
  expect(layout.canvasHeight).toBeGreaterThanOrEqual(90);
}

async function assignPacket(page, packet, route) {
  await page.locator(`[data-packet="${packet}"]`).click();
  await page.locator(`[data-route="${route}"]`).click();
}

async function solveSplitMission(page) {
  await page.locator('#splitBtn').click();
  await assignPacket(page, 0, 0);
  await assignPacket(page, 1, 1);
  await assignPacket(page, 2, 0);
  await assignPacket(page, 3, 1);
  await page.locator('#dispatchBtn').click();
  await expect(page.locator('#status')).toContainText('按 1→4 拼回');
  await page.locator('#nextBtn').click();
}

async function solveShortestMission(page) {
  await page.locator('[data-route="1"]').click();
  await page.locator('#dispatchBtn').click();
  await expect(page.locator('#status')).toContainText('3 + 4 = 7');
  await page.locator('#nextBtn').click();
}

test.describe('packet knights', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.packet-knights');
      localStorage.removeItem('kidslab.progress.packet-knights');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/packet-knights/');
  });

  test('recovers from routing mistakes and completes all three missions', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '把长信拆成 4 个编号包' })).toBeVisible();
    await page.locator('#wholeLetterBtn').click();
    await expect(page.locator('#status')).toContainText('卡在窄城门');

    await page.locator('#splitBtn').click();
    for (let packet = 0; packet < 4; packet += 1) await assignPacket(page, packet, 0);
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('挤在同一条路');
    await assignPacket(page, 1, 1);
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#deliveryCount')).toHaveText('4 / 4');
    await expect(page.locator('#status')).toContainText('4、2、1、3 号先后到达');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '找出总时间最短的驿道' })).toBeVisible();
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('先选择一条驿道');
    await page.locator('[data-route="0"]').click();
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('不是最快');
    await solveShortestMission(page);

    await expect(page.getByRole('heading', { name: '主桥塌了，救回未到的数据包' })).toBeVisible();
    await page.locator('[data-route="1"]').click();
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('拥塞或绕得太远');

    await page.locator('[data-route="0"]').click();
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#bridgeAlert')).toBeVisible();
    await expect(page.locator('#deliveryCount')).toHaveText('2 / 4');

    await page.locator('[data-route="0"]').click();
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('银桥已经断了');
    await page.locator('[data-route="1"]').click();
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('河谷正在拥塞');
    await page.locator('[data-route="2"]').click();
    await page.locator('#dispatchBtn').click();
    await expect(page.locator('#status')).toContainText('改道成功');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '授予你“网络守护骑士”勋章！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('#course')).toHaveJSProperty('inert', true);
    await expect(page.locator('#topbar')).toHaveJSProperty('inert', true);
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.packet-knights') || 'null')?.status)).toBe('completed');
  });

  test('supports preferences, persistence, and target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('#splitBtn').click();
    await assignPacket(page, 0, 0);
    await assignPacket(page, 1, 1);
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Turn One Long Letter into 4 Numbered Packets' })).toBeVisible();
    await expect(page.locator('#missionNav')).toHaveAttribute('aria-label', 'Mission progress');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);

    await page.reload();
    await expect(page.locator('[data-packet="0"]')).toContainText('N');
    await expect(page.locator('[data-packet="1"]')).toContainText('S');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page);
  });

  test('restores completion and can start a fresh patrol', async ({ page }) => {
    await solveSplitMission(page);
    await solveShortestMission(page);
    await page.locator('[data-route="0"]').click();
    await page.locator('#dispatchBtn').click();
    await page.locator('[data-route="2"]').click();
    await page.locator('#dispatchBtn').click();
    await page.locator('#nextBtn').click();
    await page.reload();

    await expect(page.getByRole('heading', { name: '授予你“网络守护骑士”勋章！' })).toBeVisible();
    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '把长信拆成 4 个编号包' })).toBeVisible();
    await expect(page.locator('#deliveryCount')).toHaveText('0 / 4');
  });
});
