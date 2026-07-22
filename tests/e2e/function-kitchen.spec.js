import { test, expect } from '@playwright/test';

async function chooseStep(page, id) {
  await page.locator(`[data-step="${id}"]`).click();
}

async function chooseParameters(page, flavor, size) {
  await page.locator(`[data-flavor="${flavor}"]`).click();
  await page.locator(`[data-size="${size}"]`).click();
}

async function run(page) {
  await page.locator('#runBtn').click();
}

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    actionsBottom: document.querySelector('.action-row').getBoundingClientRect().bottom,
  }));
  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.actionsBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
}

test.describe('function kitchen', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.function-kitchen');
      localStorage.removeItem('kidslab.progress.function-kitchen');
    });
    await page.goto('/courseware/function-kitchen/');
  });

  test('recovers from copied steps and wrong parameters, then completes the rush', async ({ page }) => {
    await chooseStep(page, 'flavor');
    await chooseStep(page, 'whisk');
    await chooseStep(page, 'bake');
    await run(page);
    await expect(page.locator('#feedback')).toContainText('顺序乱啦');

    await page.getByRole('button', { name: '重新开始' }).click();
    await chooseStep(page, 'whisk');
    await chooseStep(page, 'flavor');
    await chooseStep(page, 'bake');
    await run(page);
    await expect(page.getByRole('heading', { name: '第一份甜点出炉！' })).toBeVisible();
    await page.getByRole('button', { name: '下一班' }).click();

    await page.locator('[data-strategy="manual"]').click();
    await run(page);
    await expect(page.locator('#feedback')).toContainText('爆单啦');
    await page.locator('[data-strategy="recipe"]').click();
    await run(page);
    await expect(page.getByRole('heading', { name: '配方卡封装成功！' })).toBeVisible();
    await page.getByRole('button', { name: '下一班' }).click();

    await chooseParameters(page, 'chocolate', 'tall');
    await run(page);
    await expect(page.locator('#feedback')).toContainText('参数传错');

    await chooseParameters(page, 'strawberry', 'mini');
    await run(page);
    await chooseParameters(page, 'chocolate', 'tall');
    await run(page);
    await chooseParameters(page, 'vanilla', 'mini');
    await run(page);
    await chooseParameters(page, 'strawberry', 'tall');
    await run(page);

    await expect(page.getByRole('heading', { name: '午高峰全部出餐！' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.function-kitchen') || 'null')?.status)).toBe('completed');
  });

  test('switches language, theme, and sound while fitting the viewport', async ({ page }) => {
    await page.getByRole('button', { name: 'EN' }).click();
    await expect(page).toHaveTitle('🧁 Function Kitchen · KidsLab');
    await expect(page.getByRole('heading', { name: 'Build one cupcake in order' })).toBeVisible();
    await page.getByRole('button', { name: 'Switch theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'Mute sound' }).click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page);
  });
});
