import { test, expect } from '@playwright/test';

async function chooseSpell(page, code) {
  await page.getByRole('button', { name: new RegExp(`^${code.replace(/[+]/g, '\\+')}`) }).click();
}

async function castAndContinue(page, title, nextLabel = '下一本咒语书') {
  await page.getByRole('button', { name: '✨ 开始施法' }).click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await page.getByRole('button', { name: nextLabel }).click();
}

async function expectFitsViewport(page) {
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    actionsBottom: document.querySelector('.actions').getBoundingClientRect().bottom,
  }));
  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.actionsBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
}

test.describe("wizard's jars variables", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.wizard-jars');
      localStorage.removeItem('kidslab.progress.wizard-jars');
    });
    await page.goto('/courseware/wizard-jars/');
  });

  test('recovers from replacement and completes all three spellbooks', async ({ page }) => {
    await chooseSpell(page, '金币 = 5');
    await page.getByRole('button', { name: '✨ 开始施法' }).click();
    await expect(page.locator('#feedback')).toContainText('罐子停在 5');

    await page.locator('[data-slot="0"]').click();
    await chooseSpell(page, '金币 = 金币 + 5');
    await castAndContinue(page, '金币罐补满啦！');

    await chooseSpell(page, '怒气 = 怒气 - 3');
    await chooseSpell(page, '怒气 = 怒气 + 怒气');
    await castAndContinue(page, '龙安静地喷出爱心火！');

    await chooseSpell(page, '暂存 = 红罐');
    await chooseSpell(page, '红罐 = 蓝罐');
    await chooseSpell(page, '蓝罐 = 暂存');
    await page.getByRole('button', { name: '✨ 开始施法' }).click();
    await expect(page.getByRole('heading', { name: '交换魔法完成！' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.wizard-jars') || 'null')?.status)).toBe('completed');
  });

  test('keeps the core play area inside desktop and phone viewports', async ({ page }) => {
    await expect(page.locator('#jarRack')).toBeVisible();
    await expect(page.locator('#castBtn')).toBeVisible();
    await expectFitsViewport(page);
  });
});
