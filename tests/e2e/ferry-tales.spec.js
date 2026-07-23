import { test, expect } from '@playwright/test';

async function sailWith(page, passenger) {
  if (passenger) {
    await page.getByRole('button', { name: new RegExp(`^${passenger}在`) }).click();
  }
  await page.locator('#sailBtn').click();
  await expect(page.locator('#boat')).not.toHaveClass(/sailing/, { timeout: 3000 });
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
    missionFont: Number.parseFloat(getComputedStyle(document.querySelector('#missionText')).fontSize),
    statusFont: Number.parseFloat(getComputedStyle(document.querySelector('#status')).fontSize),
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(Math.min(...layout.buttonHeights)).toBeGreaterThanOrEqual(44);
  expect(layout.missionFont).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
}

test.describe('ferry tales', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.ferry-tales');
      localStorage.removeItem('kidslab.progress.ferry-tales');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/ferry-tales/');
  });

  test('rewinds an unsafe crossing and completes all three chapters', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '狼、羊和白菜' })).toBeVisible();
    await expect(page.locator('#ruleList')).toContainText('狼 会欺负 羊');
    await expect(page.locator('#ruleList')).toContainText('羊 会欺负 白菜');

    await page.getByRole('button', { name: /^狼在故事岸/ }).click();
    await page.locator('#sailBtn').click();
    await expect(page.locator('#status')).toContainText('羊和白菜被单独留下了');
    await expect(page.locator('#sceneReaction')).toContainText('快倒带');
    await expect(page.locator('#status')).toContainText('时光倒流', { timeout: 3000 });
    await expect(page.getByRole('button', { name: /^狼在故事岸/ })).toBeVisible();

    for (const passenger of ['羊', null, '狼', '羊', '白菜', null, '羊']) {
      await sailWith(page, passenger);
    }
    await expect(page.getByRole('heading', { name: '所有乘客都安全抵达！' })).toBeVisible();
    await page.getByRole('button', { name: '翻到下一章' }).click();

    await expect(page.getByRole('heading', { name: '鹦鹉停战日' })).toBeVisible();
    for (const passenger of ['红鹦鹉', null, '大狗', null, '蓝鹦鹉']) {
      await sailWith(page, passenger);
    }
    await page.getByRole('button', { name: '翻到下一章' }).click();

    await expect(page.getByRole('heading', { name: '森林庆典队' })).toBeVisible();
    for (const passenger of ['猫', null, '种子', null, '大狗', null, '小鸟']) {
      await sailWith(page, passenger);
    }

    await expect(page.getByRole('heading', { name: '金色摆渡人' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.ferry-tales') || 'null')?.status)).toBe('completed');
  });

  test('offers state-aware hints, undo, sound, language, and theme controls', async ({ page }) => {
    await page.getByRole('button', { name: /轻提示/ }).click();
    await expect(page.locator('#status')).toContainText('试试带上羊');
    await expect(page.getByRole('button', { name: /^羊在故事岸/ })).toBeVisible();

    await sailWith(page, '羊');
    await page.getByRole('button', { name: /退一步/ }).click();
    await expect(page.locator('#status')).toContainText('退回上一步');
    await expect(page.getByRole('button', { name: /^羊在故事岸/ })).toBeVisible();

    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'The Wolf, Goat & Cabbage' })).toBeVisible();
    await expect(page.locator('#sailBtn')).toHaveText('Sail to festival bank');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
  });

  test('keeps the story readable inside both target viewports', async ({ page }) => {
    await expectFitsViewport(page);
  });
});
