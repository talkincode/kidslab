import { test, expect } from '@playwright/test';

async function selectMobilePanel(page, panel) {
  const viewport = page.viewportSize();
  if (!viewport || viewport.width > 900) return;
  const button = page.locator(`.mobile-nav__button[data-mobile-panel="${panel}"]`);
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
}

async function markFrames(page, count = 6) {
  await selectMobilePanel(page, 'film');
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
      localStorage.setItem('kidslab.motion-tracker-lab.sound', 'off');
      localStorage.removeItem('kidslab.progress.motion-tracker-lab');
      sessionStorage.setItem(initializedKey, 'true');
    });
    await page.goto('/courseware/motion-tracker-lab/');
  });

  test('marks three clips, grows s-t and v-t graphs, and matches g sinθ', async ({ page }) => {
    await selectMobilePanel(page, 'film');
    await page.getByRole('button', { name: '速度不变' }).click();
    await markFrames(page);
    await expect(page.locator('#markCount')).toHaveText('6 / 6');
    await expect(page.locator('#stPoints circle')).toHaveCount(6);

    await selectMobilePanel(page, 'lab');
    await page.locator('#uniformBtn').click();
    await expect(page.locator('#labFeedback')).toContainText('匀速');

    await selectMobilePanel(page, 'film');
    await expect(page.locator('#filmTitle')).toContainText('斜面');
    await page.getByRole('button', { name: '速度在变' }).click();
    await markFrames(page);
    await selectMobilePanel(page, 'lab');
    await page.locator('#accelBtn').click();
    await expect(page.locator('#labFeedback')).toContainText('匀加速');

    await selectMobilePanel(page, 'lab');
    await expect(page.locator('#designCard')).toBeVisible();
    await page.locator('[data-angle="20"]').click();
    await selectMobilePanel(page, 'film');
    await expect(page.locator('#filmTitle')).toContainText('坡度');
    await page.getByRole('button', { name: '速度在变' }).click();
    await markFrames(page);
    await selectMobilePanel(page, 'lab');
    await page.locator('#accelBtn').click();
    await page.locator('[data-law="sin"]').click();
    await expect(page.locator('#labFeedback')).toContainText('g sinθ');
    await expect(page.locator('#conclusionStatus')).toContainText('三卷录像都读完了');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.motion-tracker-lab') || 'null')?.status)).toBe('completed');
  });

  test('rejects a miss and a wrong conclusion, then lets the student continue', async ({ page }) => {
    await selectMobilePanel(page, 'film');
    await page.locator('#stage').click({ position: { x: 8, y: 8 } });
    await expect(page.locator('#filmFeedback')).toContainText('没点到小车上');
    await expect(page.locator('#markCount')).toHaveText('0 / 6');

    await page.getByRole('button', { name: '速度不变' }).click();
    await markFrames(page);
    await selectMobilePanel(page, 'lab');
    await page.locator('#accelBtn').click();
    await expect(page.locator('#labFeedback')).toContainText('图像不像这种运动');
    await expect(page.locator('#markCount')).toHaveText('6 / 6');

    await page.locator('#uniformBtn').click();
    await expect(page.locator('#labFeedback')).toContainText('匀速');
  });

  test('switches language and theme without console errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.locator('#langBtn').click();
    await expect(page.locator('#filmTitle')).toContainText('changing speed');
    await expect(page.locator('#markBtn')).toHaveText('Mark this frame');

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('#langBtn').click();
    await expect(page.locator('#filmTitle')).toContainText('速度');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(errors).toEqual([]);
  });

  test('auto-switches mobile panels after marking and picking a ramp', async ({ page }) => {
    const viewport = page.viewportSize();
    test.skip(!viewport || viewport.width > 900, 'desktop keeps all three panels visible');

    await expect(page.locator('#app')).toHaveAttribute('data-mobile-panel', 'film');
    await page.getByRole('button', { name: '速度不变' }).click();
    await markFrames(page);
    await expect(page.locator('#app')).toHaveAttribute('data-mobile-panel', 'data');
    await expect(page.locator('.mobile-nav__button[data-mobile-panel="data"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#stPoints circle')).toHaveCount(6);

    await selectMobilePanel(page, 'lab');
    await page.locator('#uniformBtn').click();
    await expect(page.locator('#app')).toHaveAttribute('data-mobile-panel', 'film');
    await expect(page.locator('#filmTitle')).toContainText('斜面');

    await page.getByRole('button', { name: '速度在变' }).click();
    await markFrames(page);
    await selectMobilePanel(page, 'lab');
    await page.locator('#accelBtn').click();
    await expect(page.locator('#app')).toHaveAttribute('data-mobile-panel', 'lab');
    await expect(page.locator('#designCard')).toBeVisible();
    await page.locator('[data-angle="20"]').click();
    await expect(page.locator('#app')).toHaveAttribute('data-mobile-panel', 'film');
    await expect(page.locator('#filmTitle')).toContainText('坡度');
  });

  test('keeps the active lab panel inside desktop and phone viewports', async ({ page }) => {
    await selectMobilePanel(page, 'film');
    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      appBottom: document.querySelector('#app').getBoundingClientRect().bottom,
    }));
    expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
    expect(layout.appBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
  });

  test('keeps mute selected after reload', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('kidslab.motion-tracker-lab.sound', 'on'));
    await page.reload();
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', '打开声音');
  });
});
