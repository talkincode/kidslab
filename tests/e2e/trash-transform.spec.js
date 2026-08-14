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
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width }) => width < 44)).toEqual([]);
  expect(layout.controls.filter(({ height }) => height < 44)).toEqual([]);
  expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.lessonFont).toBeGreaterThanOrEqual(14);
}

async function sortCurrent(page, material) {
  await page.locator(`.pod[data-material="${material}"]`).click();
}

test.describe('trash transform', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.trash-transform');
    });
    await page.goto('/courseware/trash-transform/');
  });

  test('recovers from wrong sorts and completes all three recycling shifts', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '按材料把废品送进变形舱' })).toBeVisible();
    await expect(page.locator('#scrapName')).toHaveText('塑料瓶');

    // wrong pod keeps item and allows retry
    await sortCurrent(page, 'metal');
    await expect(page.locator('#status')).toContainText('不是金属');
    await expect(page.locator('#scrapName')).toHaveText('塑料瓶');
    await expect(page.locator('#progressText')).toHaveText('0/4');

    await sortCurrent(page, 'plastic');
    await expect(page.locator('#transformText')).toContainText('抓绒外套');
    await expect(page.locator('#scrapName')).toHaveText('易拉罐');
    await expect(page.locator('#progressText')).toHaveText('1/4');

    await sortCurrent(page, 'metal');
    await expect(page.locator('#scrapName')).toHaveText('旧报纸');
    await sortCurrent(page, 'paper');
    await expect(page.locator('#scrapName')).toHaveText('塑料瓶盖');
    await sortCurrent(page, 'plastic');

    await expect(page.locator('#status')).toContainText('第一班完成');
    await expect(page.locator('#beltEmpty')).toBeVisible();

    // shift 2
    await page.locator('#shiftNav button').nth(1).click();
    await expect(page.getByRole('heading', { name: '别把玻璃瓶扔进塑料舱' })).toBeVisible();
    await expect(page.locator('#scrapName')).toHaveText('玻璃罐');

    await sortCurrent(page, 'plastic');
    await expect(page.locator('#status')).toContainText('不是塑料');
    await sortCurrent(page, 'glass');
    await expect(page.locator('#transformText')).toContainText('新瓶子');

    await sortCurrent(page, 'metal'); // foil
    await sortCurrent(page, 'paper'); // carton
    await sortCurrent(page, 'glass'); // glass bottle
    await sortCurrent(page, 'plastic'); // bottle

    await expect(page.locator('#status')).toContainText('第二班完成');

    // shift 3
    await page.locator('#shiftNav button').nth(2).click();
    await expect(page.getByRole('heading', { name: '厨余也能变形' })).toBeVisible();
    await expect(page.locator('#scrapName')).toHaveText('香蕉皮');

    await sortCurrent(page, 'paper');
    await expect(page.locator('#status')).toContainText('不是纸');
    await sortCurrent(page, 'organic');
    await sortCurrent(page, 'metal');
    await sortCurrent(page, 'organic');
    await sortCurrent(page, 'paper');
    await sortCurrent(page, 'glass');
    await sortCurrent(page, 'plastic');

    await expect(page.getByRole('heading', { name: '变形工厂开足马力！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.trash-transform') || 'null')?.status)).toBe('completed');
    await expect(page.locator('#codexCount')).toHaveText('5/5');
  });

  test('supports sound, language, theme, and both target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Send each scrap into the right material pod' })).toBeVisible();
    await expect(page.locator('#shiftNav')).toHaveAttribute('aria-label', 'Recycling shifts');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('restores progress after reload and stays readable across shifts', async ({ page }) => {
    await sortCurrent(page, 'plastic');
    await sortCurrent(page, 'metal');
    await expect(page.locator('#progressText')).toHaveText('2/4');

    const saved = await page.evaluate(() => localStorage.getItem('kidslab.trash-transform'));
    expect(saved).toBeTruthy();

    await page.addInitScript((payload) => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.trash-transform', payload);
    }, saved);

    await page.reload();
    await expect(page.locator('#progressText')).toHaveText('2/4');
    await expect(page.locator('#scrapName')).toHaveText('旧报纸');

    for (let index = 0; index < 3; index += 1) {
      const btn = page.locator('#shiftNav button').nth(index);
      if (await btn.isEnabled()) {
        await btn.click();
        await expectFitsViewport(page);
      }
    }

    await page.locator('#langBtn').click();
    await expect(page.locator('#scrapName')).toHaveText('Newspaper');
    await expectFitsViewport(page);
  });
});
