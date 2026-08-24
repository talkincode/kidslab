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

async function useTool(page, id) {
  await page.locator(`[data-tool="${id}"]`).click();
}

async function matchBeds(page, left, right) {
  await page.locator(`.band[data-side="left"][data-id="${left}"]`).click();
  await page.locator(`.band[data-side="right"][data-id="${right}"]`).click();
}

test.describe('strata dig', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.strata-dig');
    });
    await page.goto('/courseware/strata-dig/');
  });

  test('recovers from buried grabs, smashed pots, wrong bones and a bad fault, then finishes', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '一层层往下刷，越深越古老' })).toBeVisible();
    await expect(page.locator('#findsValue')).toHaveText('0/4');

    await useTool(page, 'collect');
    await expect(page.locator('#status')).toContainText('还埋在土里');

    await useTool(page, 'brush');
    await useTool(page, 'collect');
    await expect(page.locator('#findsValue')).toHaveText('1/4');
    await expect(page.locator('#depthValue')).toHaveText('1');

    await useTool(page, 'hammer');
    await expect(page.locator('#status')).toContainText('陶罐裂了');
    await useTool(page, 'collect');
    await expect(page.locator('#findsValue')).toHaveText('2/4');

    await useTool(page, 'brush');
    await expect(page.locator('#status')).toContainText('太硬');
    await useTool(page, 'hammer');
    await useTool(page, 'collect');
    await useTool(page, 'hammer');
    await useTool(page, 'collect');
    await expect(page.locator('#findsValue')).toHaveText('4/4');
    await expect(page.getByRole('heading', { name: '把散架的骨头拼回一只恐龙' })).toBeVisible();

    await page.locator('[data-bone="skull"]').click();
    await page.locator('[data-slot="tail"]').click();
    await expect(page.locator('#status')).toContainText('对不上');

    for (const id of ['skull', 'ribs', 'hips', 'legs', 'tail']) {
      await page.locator(`[data-bone="${id}"]`).click();
      await page.locator(`[data-slot="${id}"]`).click();
    }
    await expect(page.getByRole('heading', { name: '两口坑错位了，找出同一时代' })).toBeVisible();

    await matchBeds(page, 'pottery', 'dino');
    await expect(page.locator('#status')).toContainText('不是同一时代');

    await matchBeds(page, 'pottery', 'pottery');
    await matchBeds(page, 'ash', 'ash');
    await matchBeds(page, 'tusk', 'tusk');
    await page.locator('[data-older="pottery"]').click();
    await expect(page.locator('#status')).toContainText('更年轻');

    await page.locator('[data-older="dino"]').click();
    await expect(page.getByRole('heading', { name: '化石站起来跑了两步！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.strata-dig') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, and both target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Brush down layer by layer. Deeper is older' })).toBeVisible();
    await expect(page.locator('#campNav')).toHaveAttribute('aria-label', 'Dig camps');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('restores progress after reload and stays readable across camps', async ({ page }) => {
    await useTool(page, 'brush');
    await useTool(page, 'collect');
    await expect(page.locator('#findsValue')).toHaveText('1/4');

    const saved = await page.evaluate(() => localStorage.getItem('kidslab.strata-dig'));
    expect(saved).toBeTruthy();

    await page.addInitScript((payload) => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.strata-dig', payload);
    }, saved);

    await page.reload();
    await expect(page.locator('#findsValue')).toHaveText('1/4');
    await expect(page.locator('#depthValue')).toHaveText('1');
    await expectFitsViewport(page);
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Brush down layer by layer. Deeper is older' })).toBeVisible();
    await expectFitsViewport(page);
  });
});
