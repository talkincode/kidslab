import { test, expect } from '@playwright/test';

async function markFrames(page, count = 6) {
  for (let i = 0; i < count; i += 1) {
    await page.locator('#markBtn').click();
  }
}

test.describe('motion tracker lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const initializedKey = 'kidslab.e2e.motion-tracker-lab.initialized';
      if (sessionStorage.getItem(initializedKey)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.motion-tracker-lab.music', '0');
      localStorage.setItem('kidslab.motion-tracker-lab.sfx', '0');
      sessionStorage.setItem(initializedKey, 'true');
    });
    await page.goto('/courseware/motion-tracker-lab/');
  });

  test('grows s-t and v-t graphs by marking, then compares a 20° ramp', async ({ page }) => {
    await expect(page.locator('#playBtn')).toBeEnabled();
    await expect(page.getByRole('button', { name: '速度不变' })).toHaveCount(0);
    await expect(page.locator('[data-law]')).toHaveCount(0);

    await markFrames(page);
    await expect(page.locator('#markCount')).toHaveText('6 / 8');
    await expect(page.locator('#stPoints circle')).toHaveCount(6);
    await expect(page.locator('#slopeLine')).toContainText('m/s');
    await expect(page.locator('#observeNote')).toContainText('匀速');

    await page.locator('#accelBtn').click();
    await expect(page.locator('#angleRow')).toBeVisible();
    await page.locator('[data-angle="20"]').click();
    await markFrames(page);
    await expect(page.locator('#stPoints circle')).toHaveCount(6);
    await expect(page.locator('#slopeLine')).toContainText('m/s²');
    await expect(page.locator('#observeNote')).toContainText('sinθ');
  });

  test('rejects a miss then lets the student mark and continue', async ({ page }) => {
    await page.locator('#stage').click({ position: { x: 8, y: 8 } });
    await expect(page.locator('#filmFeedback')).toContainText('没点到小车上');
    await expect(page.locator('#markCount')).toHaveText('0 / 8');

    await page.locator('#markBtn').click();
    await expect(page.locator('#markCount')).toHaveText('1 / 8');
    await expect(page.locator('#stPoints circle')).toHaveCount(1);
  });

  test('playing the cart live grows the graphs without a quiz', async ({ page }) => {
    await page.locator('#playBtn').click();
    await expect.poll(async () => page.locator('#stPoints circle').count(), { timeout: 5000 }).toBeGreaterThan(1);
    await expect(page.locator('#playBtn')).toHaveText('暂停');
    await page.locator('#playBtn').click();
    await expect(page.locator('#playBtn')).toHaveText('播放');
  });

  test('switches language and theme without console errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.locator('#langBtn').click();
    await expect(page.locator('#filmTitle')).toContainText('speeding up');
    await expect(page.locator('#markBtn')).toHaveText('Mark this frame');

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('#langBtn').click();
    await expect(page.locator('#filmTitle')).toContainText('匀速');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(errors).toEqual([]);
  });

  test('keeps the lab inside desktop and phone viewports', async ({ page }) => {
    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    }));
    expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  });

  test('keeps sfx mute selected after reload', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('kidslab.motion-tracker-lab.sfx', '1'));
    await page.reload();
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', '打开音效');
  });
});
