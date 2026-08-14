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
  // mobile may allow vertical scroll for this denser party UI
  if (layout.viewportWidth >= 800) {
    expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  }
  expect(layout.controls.filter(({ width }) => width < 44)).toEqual([]);
  expect(layout.controls.filter(({ height }) => height < 44)).toEqual([]);
  expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.lessonFont).toBeGreaterThanOrEqual(14);
}

test.describe('bet party', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.bet-party');
      localStorage.removeItem('kidslab.progress.bet-party');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/bet-party/');
    await expect.poll(() => page.evaluate(() => !!window.__BET_PARTY__)).toBe(true);
  });

  test('constructs worst-case months, recovers from wrong sock bet, then proves sure line', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /13 位客人/ })).toBeVisible();

    // Place one guest in each of 12 months
    for (let i = 0; i < 12; i += 1) {
      await page.locator('#inviteBtn').click();
      await page.locator(`[data-drawer="${i}"]`).click();
    }
    await expect.poll(() => page.evaluate(() => window.__BET_PARTY__.getState().total)).toBe(12);
    await expect(page.locator('#status')).toContainText('各 1');

    // 13th forces collision
    await page.locator('#inviteBtn').click();
    await page.locator('[data-drawer="0"]').click();
    await expect.poll(() => page.evaluate(() => window.__BET_PARTY__.getState().phase)).toBe('won');
    await expect(page.locator('#status')).toContainText(/撞上|魔法时刻/);
    await expect(page.locator('#nextBtn')).toBeVisible();

    // Mission 2 socks: wrong bet recovers, right bet demos
    await page.locator('#nextBtn').click();
    await expect(page.getByRole('heading', { name: /袜子/ })).toBeVisible();
    await expect(page.locator('#betForm')).toBeVisible();

    await page.evaluate(() => window.__BET_PARTY__.openBet(3, 2, 3));
    await expect(page.locator('#status')).toContainText('还不够稳');

    await page.evaluate(() => window.__BET_PARTY__.openBet(3, 2, 4));
    await expect.poll(async () => page.evaluate(() => window.__BET_PARTY__.getState().busy)).toBe(false);
    await expect.poll(() => page.evaluate(() => window.__BET_PARTY__.getState().phase)).toBe('won');
    await expect.poll(() => page.evaluate(() => window.__BET_PARTY__.getState().total)).toBe(4);
    await expect(page.locator('#status')).toContainText(/最坏|稳赢|看/);
  });

  test('supports bilingual theme toggle and fits desktop/mobile viewports', async ({ page }) => {
    await expectFitsViewport(page);

    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: /Seat 13 guests/i })).toBeVisible();
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.setViewportSize({ width: 375, height: 667 });
    await expectFitsViewport(page);
  });
});
