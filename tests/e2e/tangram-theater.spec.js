import { test, expect } from '@playwright/test';

async function placeActWithHints(page, count = 7) {
  const hint = page.getByRole('button', { name: '灯笼提示：帮我放一块' });
  for (let piece = 0; piece < count; piece += 1) await hint.click();
}

async function dragFirstPieceHome(page) {
  await page.getByRole('button', { name: '向左转' }).click({ clickCount: 3 });
  const box = await page.locator('#stage').boundingBox();
  const start = {
    x: box.x + box.width * 0.12 + Math.min(box.width, box.height) * 0.035,
    y: box.y + box.height * 0.84,
  };
  const target = { x: box.x + box.width * 0.35, y: box.y + box.height * 0.45 };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(target.x, target.y, { steps: 8 });
  await page.mouse.up();
}

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    theaterBottom: document.querySelector('.game-shell').getBoundingClientRect().bottom,
    canvasHeight: document.querySelector('#stage').getBoundingClientRect().height,
    hintBottom: document.querySelector('#hintBtn').getBoundingClientRect().bottom,
    controlHeights: [...document.querySelectorAll('.control')].map((control) =>
      control.getBoundingClientRect().height),
  }));
  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.theaterBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.canvasHeight).toBeGreaterThan(200);
  expect(layout.hintBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(Math.min(...layout.controlHeights)).toBeGreaterThanOrEqual(44);
}

test.describe('tangram shadow play', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.tangram-theater');
      localStorage.removeItem('kidslab.progress.tangram-theater');
    });
    await page.goto('/courseware/tangram-theater/');
  });

  test('recovers from a misplaced piece and completes all three acts', async ({ page }) => {
    await expect(page.locator('#pieceShelf .piece-button')).toHaveCount(7);
    await page.getByRole('option', { name: '大三角一' }).click();
    await page.locator('#stage').click({ position: { x: 18, y: 18 } });
    await expect(page.locator('#feedback')).toContainText('还没对上剪影');

    await dragFirstPieceHome(page);
    await expect(page.locator('#progressCount')).toHaveText('1/7');
    await expect(page.locator('#feedback')).toContainText('稳稳归位');

    await placeActWithHints(page, 6);
    await expect(page.getByRole('heading', { name: '桥架起来了！' })).toBeVisible();
    await page.getByRole('button', { name: '下一幕 →' }).click();

    await placeActWithHints(page);
    await expect(page.getByRole('heading', { name: '狐狸抖抖尾巴，活了！' })).toBeVisible();
    await page.getByRole('button', { name: '下一幕 →' }).click();

    await placeActWithHints(page);
    await expect(page.getByRole('heading', { name: '三幕皮影戏圆满收官！' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.tangram-theater') || 'null')?.status)).toBe('completed');
  });

  test('keeps the stage readable across theme, language, and viewport sizes', async ({ page }) => {
    await expect(page.locator('#stage')).toBeVisible();
    await expectFitsViewport(page);

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Tangram Shadow Play' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Act 1 · Bridge' })).toBeVisible();
    await expect(page.locator('#feedback')).toContainText('Drag a piece');
    await expectFitsViewport(page);
  });
});
