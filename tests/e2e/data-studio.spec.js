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
    containers: ['.studio', '.console'].map((selector) => {
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
  expect(layout.lessonFont).toBeGreaterThanOrEqual(16);
  expect(layout.containers.filter(({ clientHeight, scrollHeight }) => scrollHeight > clientHeight + 1)).toEqual([]);
}

async function recordAllVotes(page) {
  for (let index = 0; index < 20; index += 1) {
    const song = await page.locator('#voterCard').getAttribute('data-vote');
    await page.locator(`[data-song="${song}"]`).click();
  }
}

test.describe('data studio', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.data-studio');
      localStorage.removeItem('kidslab.progress.data-studio');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/data-studio/');
  });

  test('recovers from wrong choices and completes the live data show', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '用“正”字接住 20 张选票' })).toBeVisible();
    await page.locator('[data-song="bubble"]').click();
    await expect(page.locator('#status')).toContainText('选的不是这首');
    await recordAllVotes(page);
    await expect(page.locator('#status')).toContainText('20 张票一张不少');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '让问题找到最会说话的图表' })).toBeVisible();
    await page.locator('[data-chart="line"]').click();
    await expect(page.locator('#status')).toContainText('不够贴合');
    await page.locator('[data-chart="bar"]').click();
    await page.locator('[data-chart="line"]').click();
    await page.locator('[data-chart="pie"]').click();
    await expect(page.locator('#status')).toContainText('三种图表');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '读懂图表，完成三句直播' })).toBeVisible();
    await page.locator('[data-answer="bubble"]').click();
    await expect(page.locator('#status')).toContainText('播错了');
    await page.locator('[data-answer="rocket"]').click();
    await page.locator('[data-answer="18"]').click();
    await expect(page.locator('#status')).toContainText('播错了');
    await page.locator('[data-answer="20"]').click();
    await page.locator('[data-answer="5"]').click();

    await expect(page.getByRole('heading', { name: '你把数据讲明白了！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('.course')).toHaveJSProperty('inert', true);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.data-studio') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, and both target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Catch 20 Votes with Tally Marks' })).toBeVisible();
    await expect(page.locator('#missionNav')).toHaveAttribute('aria-label', 'Live missions');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('keeps all three shows readable in Chinese and English', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.data-studio', JSON.stringify({ unlocked: 2, completed: [0, 1] }));
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
});
