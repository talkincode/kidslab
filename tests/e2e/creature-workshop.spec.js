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

async function pickSlot(page, slot, part) {
  await page.locator(`[data-slot="${slot}"]`).click();
  await page.locator(`[data-part="${part}"]`).click();
}

async function dress(page, ears, coat, feet, extra) {
  await pickSlot(page, 'ears', ears);
  await pickSlot(page, 'coat', coat);
  await pickSlot(page, 'feet', feet);
  await pickSlot(page, 'extra', extra);
}

async function releaseAndWait(page, text) {
  await page.locator('#releaseBtn').click();
  await expect(page.locator('#status')).toContainText(text, { timeout: 4000 });
}

test.describe('creature workshop', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.creature-workshop');
    });
    await page.goto('/courseware/creature-workshop/');
  });

  test('recovers from a desert flop, then finishes three habitats', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '拼一只能在热沙子上活两天的动物' })).toBeVisible();
    await expect(page.locator('#liveText')).toHaveText('待放生');

    await page.locator('#releaseBtn').click();
    await expect(page.locator('#status')).toContainText('四个部位都选好');

    await dress(page, 'hidden', 'oily', 'web', 'tongue');
    await releaseAndWait(page, '耳朵先扛不住');
    await expect(page.locator('#stage')).toHaveAttribute('data-run', 'fail');
    await expect(page.locator('#beast')).toHaveAttribute('data-feet', 'web');

    await dress(page, 'big', 'thin', 'pads', 'hump');
    await releaseAndWait(page, '沙漠');
    await expect(page.locator('#fameTitle')).toHaveText('耳廓狐');
    await expect(page.locator('#campNav button').nth(1)).toBeEnabled();

    await page.locator('#campNav button').nth(1).click();
    await expect(page.getByRole('heading', { name: '换一身能扛住寒风的装备' })).toBeVisible();
    await releaseAndWait(page, '耳朵先扛不住');

    await dress(page, 'small', 'thick', 'snow', 'blubber');
    await releaseAndWait(page, '暴风雪');
    await expect(page.locator('#fameTitle')).toHaveText('北极狐');

    await page.locator('#campNav button').nth(2).click();
    await dress(page, 'hidden', 'oily', 'web', 'tongue');
    await releaseAndWait(page, '四件都对上了');
    await expect(page.getByRole('heading', { name: '没有最好的身体，只有最合适的身体！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.creature-workshop') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, and both target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Build a creature that can last two days on hot sand' })).toBeVisible();
    await expect(page.locator('#campNav')).toHaveAttribute('aria-label', 'Habitats');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('restores progress after reload and stays readable across habitats', async ({ page }) => {
    await dress(page, 'big', 'thin', 'pads', 'hump');
    await releaseAndWait(page, '沙漠');

    const saved = await page.evaluate(() => localStorage.getItem('kidslab.creature-workshop'));
    expect(saved).toBeTruthy();

    await page.addInitScript((payload) => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.creature-workshop', payload);
    }, saved);

    await page.reload();
    await expect(page.locator('#beast')).toHaveAttribute('data-ears', 'big');
    await expect(page.locator('#campNav button').nth(1)).toBeEnabled();

    await page.locator('#campNav button').nth(1).click();
    await expectFitsViewport(page);
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Swap in gear that can hold onto warmth' })).toBeVisible();
    await expectFitsViewport(page);
  });
});
