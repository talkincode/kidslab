import { test, expect } from '@playwright/test';

async function choose(page, name) {
  await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
}

async function completeStage(page, room, nextStage) {
  await choose(page, room);
  if (nextStage) await expect(page.locator('#stageName')).toHaveText(nextStage);
}

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    actionsBottom: document.querySelector('.service__actions').getBoundingClientRect().bottom,
  }));
  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.actionsBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
}

test.describe('metamorphosis hotel life cycles', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.metamorph-hotel');
      localStorage.removeItem('kidslab.progress.metamorph-hotel');
    });
    await page.goto('/courseware/metamorph-hotel/');
  });

  test('recovers from a wrong room and completes all three guest files', async ({ page }) => {
    await choose(page, '静水育婴池');
    await expect(page.locator('#narrator')).toContainText('这里太干');

    await completeStage(page, '叶片育婴室', '幼虫');
    await completeStage(page, '嫩叶自助餐', '蛹');
    await completeStage(page, '安静枝头房', '成虫');
    await completeStage(page, '花蜜咖啡厅');
    await expect(page.getByRole('heading', { name: '蝴蝶展翅退房啦！' })).toBeVisible();
    await page.getByRole('button', { name: '接待下一位客人' }).click();

    await completeStage(page, '静水育婴池', '蝌蚪');
    await completeStage(page, '水下成长房', '幼蛙');
    await completeStage(page, '浅水岸边房', '成蛙');
    await completeStage(page, '湿地虫虫餐厅');
    await expect(page.getByRole('heading', { name: '青蛙跳进湿地啦！' })).toBeVisible();
    await page.getByRole('button', { name: '接待下一位客人' }).click();

    await completeStage(page, '土壤育婴房', '若虫');
    await completeStage(page, '阳光嫩草房', '成虫');
    await completeStage(page, '高草飞行套房');
    await expect(page.getByRole('heading', { name: '三本变形档案收齐！' })).toBeVisible();
    await expect(page.locator('#modalText')).toContainText('蝴蝶有蛹期，蝗虫没有');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.metamorph-hotel') || 'null')?.status)).toBe('completed');
  });

  test('keeps the play area readable in both themes and languages', async ({ page }) => {
    await expect(page.locator('#choiceGrid .choice-card')).toHaveCount(3);
    await expectFitsViewport(page);

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Butterfly guest' })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Leaf Nursery/ })).toBeVisible();
    await expectFitsViewport(page);
  });
});
