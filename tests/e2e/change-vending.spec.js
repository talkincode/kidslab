import { test, expect } from '@playwright/test';

async function addCoins(page, name, count = 1) {
  for (let index = 0; index < count; index += 1) {
    await page.getByRole('button', { name: `添加 ${name}`, exact: true }).click();
  }
}

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    hintBottom: document.querySelector('#hintBtn').getBoundingClientRect().bottom,
    dispenseBottom: document.querySelector('#dispenseBtn').getBoundingClientRect().bottom,
  }));
  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.hintBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.dispenseBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
}

test.describe('change vending money and subtraction', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.change-vending');
      localStorage.removeItem('kidslab.progress.change-vending');
    });
    await page.goto('/courseware/change-vending/');
  });

  test('recovers from wrong change, exchanges money, and serves all customers', async ({ page }) => {
    await addCoins(page, '1 元');
    await page.getByRole('button', { name: '叮！弹出找零', exact: true }).click();
    await expect(page.locator('#feedback')).toContainText('托盘里是 1 元，应找 1 元 5 角');
    await addCoins(page, '5 角');
    await page.getByRole('button', { name: '叮！弹出找零', exact: true }).click();
    await expect(page.getByRole('heading', { name: '果汁零钱准确弹出！' })).toBeVisible();

    await page.getByRole('button', { name: '下一位顾客', exact: true }).click();
    await expectFitsViewport(page);
    await page.getByRole('button', { name: '把 1 元换成 10 个 1 角', exact: true }).click();
    await expect(page.locator('#feedback')).toContainText('1 元变成了 10 个 1 角');
    await addCoins(page, '1 元');
    await addCoins(page, '1 角', 8);
    await page.getByRole('button', { name: '叮！弹出找零', exact: true }).click();
    await expect(page.getByRole('heading', { name: '换开纸币，饼干零钱也找对了！' })).toBeVisible();

    await page.getByRole('button', { name: '下一位顾客', exact: true }).click();
    await addCoins(page, '1 元', 2);
    await addCoins(page, '5 角');
    await addCoins(page, '1 角', 2);
    await page.getByRole('button', { name: '叮！弹出找零', exact: true }).click();

    await expect(page.getByRole('heading', { name: '三位顾客都拿到了正确零钱！' })).toBeVisible();
    await expect(page.locator('#coinRain')).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.change-vending') || 'null')?.status)).toBe('completed');
  });

  test('switches language and theme while keeping controls in the viewport', async ({ page }) => {
    await expect(page.locator('#coinBank')).toBeVisible();
    await expectFitsViewport(page);

    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Ding! Dispense change', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expectFitsViewport(page);
  });
});
