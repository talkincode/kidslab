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

async function placeMany(page, ids, side) {
  await page.evaluate(({ ids: coinIds, side: pan }) => {
    for (const id of coinIds) window.__PIRATE_SCALES__.place(id, pan);
  }, { ids, side });
}

async function weigh(page) {
  await page.locator('#weighBtn').click();
  await expect.poll(async () => page.evaluate(() => window.__PIRATE_SCALES__.getState().busy)).toBe(false);
}

test.describe('pirate scales', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.pirate-scales');
      localStorage.removeItem('kidslab.progress.pirate-scales');
      localStorage.removeItem('kidslab.sound.muted');
      localStorage.setItem('kidslab.pirate-scales.debug', JSON.stringify({
        mission: 0,
        fakeId: 5,
        fakeKind: 'light',
      }));
    });
    await page.goto('/courseware/pirate-scales/');
  });

  test('recovers from unequal pans and wrong accuse, then solves with ternary splits', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '找出那枚轻一点的假币' })).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.__PIRATE_SCALES__.getState().fakeId)).toBe(5);

    // Unequal pans rejected via UI
    await placeMany(page, [1, 2, 3], 'left');
    await placeMany(page, [4, 5], 'right');
    await page.locator('#weighBtn').click();
    await expect(page.locator('#status')).toContainText('枚数');

    await page.locator('#clearBtn').click();
    await expect(page.locator('#status')).toContainText('清空');

    // Wrong accuse recovers
    await page.locator('#accuseBtn').click();
    await page.locator('.tray [data-coin="1"]').click();
    await expect(page.locator('#status')).toContainText('真的');

    // Optimal path: 123 vs 456 → left sinks (5 light on right)
    await page.locator('#accuseBtn').click(); // exit accuse mode
    await placeMany(page, [1, 2, 3], 'left');
    await placeMany(page, [4, 5, 6], 'right');
    await weigh(page);
    await expect(page.locator('#resultChip')).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.__PIRATE_SCALES__.getState().suspects.slice().sort((a, b) => a - b).join(','))).toBe('4,5,6');

    // 4 vs 5 → left sinks ⇒ 5 light
    await placeMany(page, [4], 'left');
    await placeMany(page, [5], 'right');
    await weigh(page);
    await expect.poll(() => page.evaluate(() => window.__PIRATE_SCALES__.getState().suspects.join(','))).toBe('5');

    await page.locator('#accuseBtn').click();
    await page.locator('[data-coin="5"]').first().click();
    await expect(page.locator('#status')).toContainText('抓到了');
    await expect(page.locator('#nextBtn')).toBeVisible();

    // Mission 2 with fake 8, must finish in 2 weighs
    await page.evaluate(() => {
      window.__PIRATE_SCALES__.setDebug(8, 'light', 1);
    });
    await page.locator('#nextBtn').click();
    await expect(page.getByRole('heading', { name: '9 枚币，最多称 2 次' })).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.__PIRATE_SCALES__.getState().fakeId)).toBe(8);

    await placeMany(page, [1, 2, 3], 'left');
    await placeMany(page, [4, 5, 6], 'right');
    await weigh(page); // balance → 7,8,9
    await placeMany(page, [7], 'left');
    await placeMany(page, [8], 'right');
    await weigh(page);
    await page.locator('#accuseBtn').click();
    await page.locator('[data-coin="8"]').first().click();
    await expect(page.locator('#status')).toContainText('抓到了');
  });

  test('supports bilingual theme toggle and fits desktop/mobile viewports', async ({ page }) => {
    await expectFitsViewport(page);

    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Find the Lighter Fake' })).toBeVisible();
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.setViewportSize({ width: 375, height: 667 });
    await expectFitsViewport(page);
  });
});
