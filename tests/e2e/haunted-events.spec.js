import { test, expect } from '@playwright/test';

async function connect(page, trigger, action) {
  await page.locator(`[data-trigger="${trigger}"]`).click();
  await page.locator(`[data-action="${action}"]`).click();
}

async function runAndContinue(page, title, nextLabel = '下一间鬼屋') {
  await page.getByRole('button', { name: '🎟️ 开门营业' }).click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await page.getByRole('button', { name: nextLabel }).click();
}

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    boardBottom: document.querySelector('#wiringBoard').getBoundingClientRect().bottom,
  }));
  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.boardBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
}

test.describe('surprise haunted house event wiring', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.haunted-events');
      localStorage.removeItem('kidslab.progress.haunted-events');
    });
    await page.goto('/courseware/haunted-events/');
  });

  test('recovers from a wrong handler and completes the three event shows', async ({ page }) => {
    await connect(page, 'door', 'confetti');
    await connect(page, 'tile', 'skeleton');
    await connect(page, 'portrait', 'bats');
    await page.getByRole('button', { name: '🎟️ 开门营业' }).click();
    await expect(page.locator('#feedback')).toContainText('机关接错啦');

    await page.getByRole('button', { name: '重新开始' }).click();
    await connect(page, 'door', 'bats');
    await connect(page, 'tile', 'skeleton');
    await connect(page, 'portrait', 'confetti');
    await runAndContinue(page, '第一批游客笑着跑出来啦！');

    await connect(page, 'window', 'owl');
    await connect(page, 'closet', 'ghost');
    await connect(page, 'clock', 'pumpkin');
    await runAndContinue(page, '乱序来客全都接住啦！');

    await connect(page, 'door', 'bats');
    await connect(page, 'batsDone', 'bell');
    await connect(page, 'bellRang', 'ghost');
    await connect(page, 'ghostBumped', 'pumpkin');
    await page.getByRole('button', { name: '🎟️ 开门营业' }).click();
    await expect(page.getByRole('heading', { name: '多米诺鬼屋大成功！' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.haunted-events') || 'null')?.status)).toBe('completed');
  });

  test('switches language and theme while keeping the play area in the viewport', async ({ page }) => {
    await expect(page.locator('#wiringBoard')).toBeVisible();
    await page.getByRole('button', { name: 'EN' }).click();
    await expect(page).toHaveTitle('Surprise Haunted House · KidsLab');
    await expect(page.getByRole('heading', { name: 'Three surprises at the entrance' })).toBeVisible();
    await page.getByRole('button', { name: 'theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expectFitsViewport(page);
  });
});
