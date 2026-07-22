import { test, expect } from '@playwright/test';

async function remainingStones(page) {
  const text = await page.locator('#remaining').textContent();
  const value = Number(text.match(/\d+/)?.[0]);
  expect(Number.isFinite(value)).toBeTruthy();
  return value;
}

async function waitForFoxAndBack(page) {
  await expect(page.locator('#turnBadge')).toContainText('狐狸的回合', { timeout: 3000 });
  await expect(page.locator('#turnBadge')).toContainText('你的回合', { timeout: 3000 });
}

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    buttonHeights: [...document.querySelectorAll('button:not([hidden])')]
      .map((button) => button.getBoundingClientRect().height)
      .filter((height) => height > 0),
    coachFontSize: Number.parseFloat(getComputedStyle(document.querySelector('#coach')).fontSize),
    ruleFontSizes: [...document.querySelectorAll('#quickRules span, #quickRules strong')].map((node) =>
      Number.parseFloat(getComputedStyle(node).fontSize)),
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(Math.min(...layout.buttonHeights)).toBeGreaterThanOrEqual(44);
  expect(layout.coachFontSize).toBeGreaterThanOrEqual(16);
  expect(Math.min(...layout.ruleFontSizes)).toBeGreaterThanOrEqual(16);
}

test.describe("the fox's stones", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.foxstones');
      localStorage.removeItem('kidslab.progress.fox-stones');
    });
    await page.goto('/courseware/fox-stones/');
  });

  test('teaches the turn order and completes a winning classic round', async ({ page }) => {
    await expect(page.locator('#quickRules')).toBeVisible();
    await expect(page.locator('#quickRules')).toContainText('① 你先拿');
    await expect(page.locator('#quickRules')).toContainText('② 狐狸再拿');
    await expect(page.locator('#quickRules')).toContainText('③ 最后一颗赢');
    await expect(page.locator('#coach')).toContainText('先试一次');
    await expect(page.locator('#remaining')).toHaveText('还剩 9 颗');

    for (const count of [1, 2, 3]) {
      await expect(page.getByRole('button', { name: `拿 ${count} 颗`, exact: true })).toBeVisible();
    }

    await page.getByRole('button', { name: '拿 1 颗', exact: true }).click();
    await expect(page.locator('#turnBadge')).toContainText('狐狸的回合');
    await expect(page.locator('#remaining')).toHaveText('还剩 8 颗');
    await expect(page.locator('#moveLog')).toContainText('你拿走 1 颗');
    await expect(page.locator('#turnBadge')).toContainText('你的回合');
    await expect(page.locator('#moveLog')).toContainText('狐狸拿走');

    for (let turn = 0; turn < 3; turn += 1) {
      const left = await remainingStones(page);
      const take = left <= 3 ? left : left % 4;
      expect(take).toBeGreaterThanOrEqual(1);
      await page.getByRole('button', { name: `拿 ${take} 颗`, exact: true }).click();
      if (left <= 3) break;
      await waitForFoxAndBack(page);
    }

    await expect(page.getByRole('heading', { name: '这一局发生了什么？' })).toBeVisible();
    await expect(page.locator('#resultText')).toContainText('你拿到了最后一颗');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.fox-stones') || 'null')?.status)).toBe('completed');
  });

  test('keeps the instructions readable in both languages and themes', async ({ page }) => {
    await expectFitsViewport(page);
    await page.locator('#modePicker summary').click();
    await page.getByRole('tab', { name: /反转局/ }).click();
    await expect(page.locator('#tip')).toContainText('拿到最后一颗的人输');
    await expect(page.locator('#quickRules')).toContainText('③ 最后一颗输');

    await page.locator('#langBtn').click();
    await expect(page.getByRole('button', { name: 'Take 1', exact: true })).toBeVisible();
    await expect(page.locator('#quickRules')).toContainText('Last stone loses');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expectFitsViewport(page);
  });
});
