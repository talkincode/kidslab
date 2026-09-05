import { test, expect } from '@playwright/test';

const CRITICAL_CONTROL_SELECTORS = ['#soundBtn', '#themeBtn', '#langBtn'];

async function expectFitsViewport(page) {
  const layout = await page.evaluate((controlSelectors) => {
    const getFontSize = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return 0;
      return Number.parseFloat(getComputedStyle(element).fontSize);
    };

    return {
      width: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      controls: controlSelectors.map((selector) => {
        const element = document.querySelector(selector);
        if (!element) {
          return { selector, exists: false, visible: false, width: 0, height: 0, font: 0 };
        }

        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const visible = !element.hidden
          && style.display !== 'none'
          && style.visibility !== 'hidden'
          && rect.width > 0
          && rect.height > 0;
        const width = visible ? rect.width : 0;
        const height = visible ? rect.height : 0;
        return {
          selector,
          exists: true,
          visible,
          width,
          height,
          font: Number.parseFloat(getComputedStyle(element).fontSize),
        };
      }),
      statusFont: getFontSize('#status'),
      lessonFont: getFontSize('#lessonText'),
    };
  }, CRITICAL_CONTROL_SELECTORS);

  const visibleControls = layout.controls.filter(({ visible }) => visible);
  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  for (const selector of CRITICAL_CONTROL_SELECTORS) {
    expect(layout.controls.find((control) => control.selector === selector)?.visible).toBe(true);
  }
  expect(visibleControls.filter(({ width }) => width < 44)).toEqual([]);
  expect(visibleControls.filter(({ height }) => height < 44)).toEqual([]);
  expect(Math.min(...visibleControls.map(({ font }) => font))).toBeGreaterThanOrEqual(16);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.lessonFont).toBeGreaterThanOrEqual(14);
}

async function addSpecies(page, key, times = 1) {
  const card = page.locator(`.species-card[data-species="${key}"]`);
  for (let i = 0; i < times; i += 1) await card.getByRole('button', { name: '+' }).click();
}

test.describe('eco island', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.eco-island');
    });
    await page.goto('/courseware/eco-island/');
  });

  test('a barren island cannot recover, but planting grass brings it alive', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '这座岛怎么没有草？' })).toBeVisible();
    await expect(page.locator('#mGrass')).toHaveText('0');
    await expect(page.locator('#mRabbit')).toHaveText('0');

    // 什么都不做会一直荒芜，无法通关
    await page.waitForTimeout(2500);
    await expect(page.locator('#completeModal')).toBeHidden();

    // 种下草 + 放点兔子 → 草长出来、兔子回归
    await addSpecies(page, 'grass', 4);
    await addSpecies(page, 'rabbit', 2);
    await expect(page.locator('#mGrass')).not.toHaveText('0', { timeout: 15000 });
    await expect(page.locator('#mRabbit')).not.toHaveText('0', { timeout: 15000 });

    // 保持到所需稳定帧数即通关
    await expect(page.locator('#completeModal')).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('heading', { name: '小岛绿了，动物回来了！' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.eco-island') || 'null')?.status)).toBe('completed');
    await expect(page.locator('#nextBtn')).toBeFocused();
  });

  test('missing decomposers keeps the island stuck in crisis until they show up', async ({ page }) => {
    // 第二岛：尸横遍地
    await page.locator('[data-mission="decomposer"]').click();
    await expect(page.getByRole('heading', { name: '满地的尸体怎么变回土？' })).toBeVisible();
    await expect(page.locator('#mCarcass')).not.toHaveText('0');
    await page.waitForTimeout(2500);
    await expect(page.locator('#completeModal')).toBeHidden();

    await addSpecies(page, 'mushroom', 4);
    await expect(page.locator('#completeModal')).toBeVisible({ timeout: 30000 });
  });

  test('supports sound, language, theme, and both target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Why is this island bare?' })).toBeVisible();
    await expect(page.locator('#campNav')).toHaveAttribute('aria-label', 'Island levels');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('restores mission after reload and navigates across islands', async ({ page }) => {
    await page.locator('[data-mission="balance"]').click();
    await expect(page.getByRole('heading', { name: '兔子太多，草会被吃光！' })).toBeVisible();

    const saved = await page.evaluate(() => localStorage.getItem('kidslab.eco-island'));
    expect(saved).toBeTruthy();

    await page.addInitScript((payload) => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.eco-island', payload);
    }, saved);

    await page.reload();
    await expect(page.getByRole('heading', { name: '兔子太多，草会被吃光！' })).toBeVisible();
    await expect(page.locator('[data-mission="balance"]')).toHaveAttribute('aria-current', 'true');

    await page.locator('[data-mission="web"]').click();
    await expect(page.getByRole('heading', { name: '建一座完整的生态网！' })).toBeVisible();
    await expectFitsViewport(page);
  });
});