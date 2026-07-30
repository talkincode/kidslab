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
    containers: ['.cipher-stage', '.control-desk'].map((selector) => {
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

async function expectEvidenceVisible(page) {
  const clipping = await page.evaluate(() => {
    const evidence = document.querySelector('.evidence').getBoundingClientRect();
    const activeScene = [...document.querySelectorAll('.evidence > section')]
      .find((element) => !element.hidden);
    return [...activeScene.children].map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        className: element.className,
        clipped: rect.top < evidence.top - 1
          || rect.left < evidence.left - 1
          || rect.bottom > evidence.bottom + 1
          || rect.right > evidence.right + 1,
      };
    }).filter(({ clipped }) => clipped);
  });
  expect(clipping).toEqual([]);
}

test.describe('cipher club', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.cipher-club');
      localStorage.removeItem('kidslab.progress.cipher-club');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/cipher-club/');
  });

  test('recovers from wrong keys and cracks all three secret notes', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '把转盘调到钥匙 3，封好第一张纸条' })).toBeVisible();
    await page.locator('#sealBtn').click();
    await expect(page.locator('#status')).toContainText('钥匙还没对上');
    await page.locator('#keyUpBtn').click({ clickCount: 3 });
    await expect(page.locator('#keyValue')).toHaveText('3');
    await page.locator('#sealBtn').click();
    await expect(page.locator('#status')).toContainText('PHHW DW WUHH');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '倒转钥匙 5，找回集合地点' })).toBeVisible();
    await page.locator('[data-answer="CODE ROOM"]').click();
    await expect(page.locator('#status')).toContainText('没有还原');
    await page.locator('[data-answer="CLUB ROOM"]').click();
    await expect(page.locator('#status')).toContainText('CLUB ROOM');
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '没有钥匙，也能从字母频率破译密文' })).toBeVisible();
    await page.locator('[data-letter="K"]').click();
    await expect(page.locator('#status')).toContainText('不是最高');
    await page.locator('[data-letter="H"]').click();
    await page.locator('[data-map="T"]').click();
    await expect(page.locator('#status')).toContainText('先试最常见的 E');
    await page.locator('[data-map="E"]').click();
    await page.locator('#crackBtn').click();

    await expect(page.getByRole('heading', { name: '欢迎加入密码社！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('.course')).toHaveJSProperty('inert', true);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.cipher-club') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, and both target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Set the Wheel to Key 3 and Seal Your First Note' })).toBeVisible();
    await expect(page.locator('#missionNav')).toHaveAttribute('aria-label', 'Cipher missions');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);
  });

  test('keeps all missions readable in Chinese and English', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.cipher-club', JSON.stringify({ unlocked: 2, completed: [0, 1] }));
    });
    await page.reload();
    for (let index = 0; index < 3; index += 1) {
      await page.locator('#missionNav button').nth(index).click();
      await expectFitsViewport(page);
      await expectEvidenceVisible(page);
    }
    await page.locator('#langBtn').click();
    for (let index = 0; index < 3; index += 1) {
      await page.locator('#missionNav button').nth(index).click();
      await expectFitsViewport(page);
      await expectEvidenceVisible(page);
    }
  });

  test('restores the completion dialog after a completed course reload', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.cipher-club', JSON.stringify({ unlocked: 2, completed: [0, 1, 2] }));
    });
    await page.reload();
    await expect(page.getByRole('heading', { name: '欢迎加入密码社！' })).toBeVisible();
    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '把转盘调到钥匙 3，封好第一张纸条' })).toBeVisible();
    await expect(page.locator('#keyValue')).toHaveText('0');
  });
});
