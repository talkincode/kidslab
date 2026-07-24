import { test, expect } from '@playwright/test';

async function setSignal(page, values) {
  for (const value of values) {
    await page.locator(`[data-bit="${value}"]`).click();
  }
}

async function transmit(page) {
  await page.locator('#actionBtn').click();
}

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    actionBottom: document.querySelector('#actionBtn').getBoundingClientRect().bottom,
  }));
  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.actionBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
}

test.describe('binary lighthouse', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.binary-lighthouse');
      localStorage.removeItem('kidslab.progress.binary-lighthouse');
    });
    await page.goto('/courseware/binary-lighthouse/');
  });

  test('recovers from wrong signals, decodes ships, and sends SOS', async ({ page }) => {
    await setSignal(page, [16]);
    await transmit(page);
    await expect(page.locator('#feedback')).toContainText('现在是 16，不是 19');

    await setSignal(page, [2, 1]);
    await transmit(page);
    await expect(page.getByRole('heading', { name: '货船收到 19！' })).toBeVisible();
    await page.getByRole('button', { name: '下一班' }).click();

    await page.locator('[data-answer="18"]').click();
    await expect(page.locator('#feedback')).toContainText('18 还不是');
    await page.locator('[data-answer="22"]').click();
    await page.locator('[data-answer="7"]').click();
    await page.locator('[data-answer="25"]').click();
    await expect(page.getByRole('heading', { name: '来船全部识别！' })).toBeVisible();
    await page.getByRole('button', { name: '下一班' }).click();

    await setSignal(page, [16, 2, 1]);
    await transmit(page);
    await setSignal(page, [8, 4, 2, 1]);
    await transmit(page);
    await setSignal(page, [16, 2, 1]);
    await transmit(page);

    await expect(page.getByRole('heading', { name: '秘密信穿过暴风雨！' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.binary-lighthouse') || 'null')?.status)).toBe('completed');
  });

  test('switches language, theme, and sound while fitting the viewport', async ({ page }) => {
    await page.getByRole('button', { name: 'EN' }).click();
    await expect(page).toHaveTitle('🗼 Binary Lighthouse · KidsLab');
    await expect(page.getByRole('heading', { name: 'Send the number 19 with light' })).toBeVisible();
    await page.getByRole('button', { name: 'Switch theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'Mute sound' }).click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page);
  });
});
