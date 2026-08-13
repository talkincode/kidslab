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
    containers: ['.atlas', '.desk'].map((selector) => {
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
  expect(layout.lessonFont).toBeGreaterThanOrEqual(14);
  expect(layout.containers.filter(({ clientHeight, scrollHeight }) => scrollHeight > clientHeight + 1)).toEqual([]);
}

async function paint(page, regionId, colorId) {
  await page.locator(`[data-region="${regionId}"]`).click();
  await page.locator(`[data-color="${colorId}"]`).click();
}

async function present(page) {
  await page.locator('#checkBtn').click();
}

test.describe('four-color kingdom', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.four-color-kingdom');
      localStorage.removeItem('kidslab.progress.four-color-kingdom');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/four-color-kingdom/');
  });

  test('recovers from conflicts and budget mistakes, then finishes all four maps', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '相邻领地，不能同色' })).toBeVisible();

    // Conflict: paint two neighbors the same color, then submit
    await paint(page, 'crown', 'rose');
    await paint(page, 'east', 'rose');
    await present(page);
    await expect(page.locator('#status')).toContainText('空白');

    await paint(page, 'west', 'mint');
    await paint(page, 'south', 'sky');
    await present(page);
    await expect(page.locator('#status')).toContainText('相邻同色');

    await paint(page, 'east', 'sun');
    await present(page);
    await expect(page.locator('#status')).toContainText('过关');
    await page.locator('#nextBtn').click();

    // Map 2 budget 3: opening a 4th color is blocked
    await paint(page, 'lake', 'rose');
    await paint(page, 'harbor', 'sun');
    await paint(page, 'orchard', 'mint');
    await page.locator('[data-region="mine"]').click();
    await page.locator('[data-color="sky"]').click();
    await expect(page.locator('#status')).toContainText('预算');

    await paint(page, 'mine', 'sun');
    await paint(page, 'peak', 'mint');
    await present(page);
    await expect(page.locator('#status')).toContainText('过关');
    await page.locator('#nextBtn').click();

    // Map 3: locked lord keep
    await page.locator('[data-region="lord"]').click();
    await expect(page.locator('#status')).toContainText('锁');
    await paint(page, 'plain', 'rose');
    await paint(page, 'coast', 'rose');
    await paint(page, 'isle', 'sun');
    await paint(page, 'ridge', 'sky');
    await paint(page, 'core', 'mint');
    await present(page);
    await expect(page.locator('#status')).toContainText('过关');
    await page.locator('#nextBtn').click();

    // Map 4 devil map with 4 colors, skip grape
    for (const [region, color] of [
      ['a', 'rose'],
      ['b', 'sun'],
      ['c', 'rose'],
      ['d', 'mint'],
      ['e', 'sky'],
      ['f', 'mint'],
      ['g', 'sun'],
    ]) {
      await paint(page, region, color);
    }
    await present(page);
    await expect(page.getByRole('heading', { name: '你摸到了四色定理的手感！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('#course')).toHaveJSProperty('inert', true);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.four-color-kingdom') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, and target viewport layout', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Neighbors Cannot Share a Color' })).toBeVisible();
    await expect(page.locator('#missionNav')).toHaveAttribute('aria-label', 'Kingdom map missions');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('keeps every unlocked mission readable in Chinese and English', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.four-color-kingdom', JSON.stringify({ unlocked: 3, completed: [0, 1, 2] }));
    });
    await page.reload();
    for (let index = 0; index < 4; index += 1) {
      await page.locator('#missionNav button').nth(index).click();
      await expectFitsViewport(page);
    }
    await page.locator('#langBtn').click();
    for (let index = 0; index < 4; index += 1) {
      await page.locator('#missionNav button').nth(index).click();
      await expectFitsViewport(page);
    }
  });

  test('restores completion and can restart from the first mission', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.four-color-kingdom', JSON.stringify({ unlocked: 3, completed: [0, 1, 2, 3] }));
    });
    await page.reload();
    await expect(page.getByRole('heading', { name: '你摸到了四色定理的手感！' })).toBeVisible();
    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '相邻领地，不能同色' })).toBeVisible();
    await expect(page.locator('#missionNumber')).toHaveText('01');
  });
});
