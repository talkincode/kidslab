import { expect, test } from '@playwright/test';

test.describe('维恩太空港 3D 轨道海关', () => {
  test.describe.configure({ mode: 'serial', timeout: 90000 });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      if (sessionStorage.getItem('kidslab.venn-port.test-seeded') === '1') return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.venn-port.guided', '1');
      localStorage.setItem('kidslab.venn-port.music', '0');
      localStorage.setItem('kidslab.venn-port.sfx', '0');
      sessionStorage.setItem('kidslab.venn-port.test-seeded', '1');
    });
    await page.goto('/courseware/venn-port/');
  });

  test('loads the 3D deck with scanner truth code and four accessible bays', async ({ page }) => {
    await expect(page.locator('#scene')).toBeVisible();
    await expect(page.locator('#signalValue')).toHaveText('10');
    await expect(page.locator('[data-zone]')).toHaveCount(4);
    await expect(page.locator('#dockValue')).toHaveText('0 / 5');
    await expect(page.locator('#musicBtn')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
  });

  test('returns a ship after a wrong bay and clears the full mission', async ({ page }) => {
    await page.locator('[data-zone="both"]').click();
    await expect(page.locator('#coachTitle')).toContainText('飞船已返航');
    await expect(page.locator('#dockValue')).toHaveText('0 / 5');

    const zoneByCode = {
      10: 'left',
      11: 'both',
      '01': 'right',
      '00': 'neither',
    };

    for (let docked = 1; docked <= 5; docked += 1) {
      const code = (await page.locator('#signalValue').innerText()).trim();
      await page.locator(`[data-zone="${zoneByCode[code]}"]`).click();
      await expect(page.locator('#dockValue')).toHaveText(`${docked} / 5`);
    }

    await expect(page.locator('#win')).toBeVisible();
    await expect(page.locator('#winTitle')).toHaveText('交集停机坪点亮了！');

    await page.evaluate(() => {
      document.querySelector('#winDemoBtn').click();
      document.querySelector('#demoPlayBtn').click();
    });
    await expect(page.locator('#demoBar')).toBeVisible();
    await page.locator('#demoExitBtn').click();
    await expect(page.locator('#win')).toBeVisible();
    await expect(page.locator('#dockValue')).toHaveText('5 / 5');
  });

  test('pauses, steps, seeks, and exits the complete mission demo', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelector('#demoBtn').click();
      document.querySelector('#demoPlayBtn').click();
    });
    await expect(page.locator('#demoBar')).toBeVisible();
    await expect(page.locator('#demoCount')).toHaveText('0 / 5');

    await page.locator('#demoNextBtn').click();
    await expect(page.locator('#demoCount')).toHaveText('1 / 5');

    await page.locator('#demoRange').fill('3');
    await expect(page.locator('#demoCount')).toHaveText('3 / 5');

    const playbackStates = await page.evaluate(() => {
      const button = document.querySelector('#demoPlayBtn');
      button.click();
      const playing = button.getAttribute('aria-pressed');
      button.click();
      return { playing, paused: button.getAttribute('aria-pressed') };
    });
    expect(playbackStates).toEqual({ playing: 'true', paused: 'false' });

    await page.locator('#demoExitBtn').click();
    await expect(page.locator('#demoBar')).toBeHidden();
    await expect(page.locator('#dockValue')).toHaveText('0 / 5');
  });

  test('keeps the mobile console inside the viewport with 40px controls', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    const layout = await page.evaluate(() => {
      const visibleButtons = [...document.querySelectorAll('button')]
        .filter((button) => button.getClientRects().length > 0);
      const panel = document.querySelector('#panel').getBoundingClientRect();
      return {
        bodyWidth: document.documentElement.scrollWidth,
        bodyHeight: document.documentElement.scrollHeight,
        panelRight: panel.right,
        panelBottom: panel.bottom,
        minButtonHeight: Math.min(...visibleButtons.map((button) => button.getBoundingClientRect().height)),
      };
    });

    expect(layout.bodyWidth).toBeLessThanOrEqual(375);
    expect(layout.bodyHeight).toBeLessThanOrEqual(667);
    expect(layout.panelRight).toBeLessThanOrEqual(375);
    expect(layout.panelBottom).toBeLessThanOrEqual(667);
    expect(layout.minButtonHeight).toBeGreaterThanOrEqual(40);
  });

  test('persists language and theme preferences', async ({ page }) => {
    await page.locator('#langBtn').click();
    await expect(page.locator('#demoBtn')).toContainText('Watch mission demo');

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();

    await expect(page.locator('#demoBtn')).toContainText('Watch mission demo');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('offers a first-visit guide and a four-step intersection lesson', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('kidslab.venn-port.guided'));
    await page.reload();

    await expect(page.locator('#guide')).toBeVisible();
    await page.locator('#guidePlayBtn').click();
    await expect(page.locator('#guide')).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem('kidslab.venn-port.guided'))).toBe('1');

    await page.locator('#lessonBtn').click();
    await expect(page.locator('#lessonCard')).toBeVisible();
    await expect(page.locator('#lessonCount')).toHaveText('1 / 4');
    await page.locator('#lessonNextBtn').click();
    await expect(page.locator('#lessonCount')).toHaveText('2 / 4');
    await page.locator('#lessonExitBtn').click();
    await expect(page.locator('#lessonCard')).toBeHidden();
    await expect(page.locator('[data-zone="left"]')).toBeEnabled();
  });
});
