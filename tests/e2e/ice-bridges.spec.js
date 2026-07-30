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
    containers: ['.rink', '.fieldbook'].map((selector) => {
      const element = document.querySelector(selector);
      return { selector, clientHeight: element.clientHeight, scrollHeight: element.scrollHeight };
    }),
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width }) => width < 44)).toEqual([]);
  expect(layout.controls.filter(({ height }) => height < 44)).toEqual([]);
  expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.lessonFont).toBeGreaterThanOrEqual(13);
  expect(layout.containers.filter(({ clientHeight, scrollHeight }) => scrollHeight > clientHeight + 1)).toEqual([]);
}

test.describe('seven bridges on ice', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.ice-bridges');
      localStorage.removeItem('kidslab.progress.ice-bridges');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/ice-bridges/');
  });

  test('recovers from wrong choices and completes all three graph missions', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '七座桥，真的能每座只滑一次吗？' })).toBeVisible();
    await page.locator('[data-judge="impossible"]').click();
    await expect(page.locator('#status')).toContainText('先看度数');
    await page.locator('#gogglesBtn').click();
    await expect(page.locator('.degree-chip.odd')).toHaveCount(4);
    await page.locator('[data-judge="possible"]').click();
    await expect(page.locator('#status')).toContainText('继续试也不会成功');
    await page.locator('[data-judge="impossible"]').click();
    await expect(page.locator('#status')).toContainText('四个奇点超过了上限 2');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '这张地图没有奇点，把五座桥一笔滑完' })).toBeVisible();
    await page.locator('[data-node="aurora"]').click();
    await page.locator('[data-node="harbor"]').click();
    await expect(page.locator('#status')).toContainText('没有桥');
    for (const node of ['pine', 'harbor', 'market', 'mill', 'aurora']) {
      await page.locator(`[data-node="${node}"]`).click();
    }
    await expect(page.locator('#status')).toContainText('每座桥恰好一次');
    await expect(page.locator('.bridge-group.used')).toHaveCount(5);
    await page.locator('#nextBtn').click();

    await page.locator('[data-repair="double"]').click();
    await page.locator('#testRepairBtn').click();
    await expect(page.locator('#status')).toContainText('仍有 4 个奇点');
    await page.locator('[data-repair="close-one"]').click();
    await expect(page.locator('.degree-chip.odd')).toHaveCount(2);
    await page.locator('#testRepairBtn').click();

    await expect(page.getByRole('heading', { name: '你拿到了欧拉巡冰章！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('.course')).toHaveJSProperty('inert', true);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.ice-bridges') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, and target viewport layout', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Can You Skate All Seven Bridges Once?' })).toBeVisible();
    await expect(page.locator('#missionNav')).toHaveAttribute('aria-label', 'Skating missions');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('keeps every unlocked mission readable in Chinese and English', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.ice-bridges', JSON.stringify({ unlocked: 2, completed: [0, 1] }));
    });
    await page.reload();
    for (let index = 0; index < 3; index += 1) {
      await page.locator('#missionNav button').nth(index).click();
      await expectFitsViewport(page);
    }
    await page.locator('#langBtn').click();
    for (let index = 0; index < 3; index += 1) {
      await page.locator('#missionNav button').nth(index).click();
      await expectFitsViewport(page);
    }
  });

  test('restores completion and can restart from the first mission', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.ice-bridges', JSON.stringify({ unlocked: 2, completed: [0, 1, 2] }));
    });
    await page.reload();
    await expect(page.getByRole('heading', { name: '你拿到了欧拉巡冰章！' })).toBeVisible();
    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '七座桥，真的能每座只滑一次吗？' })).toBeVisible();
    await expect(page.locator('.node__degree').first()).toHaveText('?');
  });
});
