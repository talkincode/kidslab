import { test, expect } from '@playwright/test';

async function openSidebarIfNeeded(page) {
  if (await page.locator('#menuBtn').isVisible()) {
    await page.locator('#menuBtn').click();
  }
}

test.describe('stage strategy', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('kidslab.lang', 'zh');
    });
  });

  test('primary keeps playground language and hides physics chemistry', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#heroTitle')).toContainText('小小探索家');
    await openSidebarIfNeeded(page);
    await expect(page.locator('#levelSeg button', { hasText: '初中' })).toBeEnabled();
    await expect(page.locator('#levelSeg button', { hasText: '高中' })).toBeEnabled();
    await expect(page.locator('#catList button[data-cat="physics"]')).toHaveCount(0);
    await expect(page.locator('#catList button[data-cat="chemistry"]')).toHaveCount(0);
  });

  test('junior uses lab language and keeps the three secondary labs on the shelf', async ({ page }) => {
    await page.goto('/?level=junior');
    await expect(page.locator('#heroTitle')).toContainText('来实验室');
    await expect(page.locator('#crumb')).toContainText('初中');
    await expect(page.locator('#grid a.card[href="courseware/function-grapher/index.html"]')).toBeVisible();
    await expect(page.locator('#grid a.card[href="courseware/pendulum-lab/index.html"]')).toBeVisible();
    await expect(page.locator('#grid a.card[href="courseware/ph-lab/index.html"]')).toBeVisible();
    await openSidebarIfNeeded(page);
    await expect(page.locator('#catList button[data-cat="physics"]')).toBeVisible();
    await expect(page.locator('#catList button[data-cat="chemistry"]')).toBeVisible();
    await expect(page.locator('#levelSeg button[aria-checked="true"]')).toHaveText('初中');
  });

  test('senior uses lab language and does not mark the stage as under construction', async ({ page }) => {
    await page.goto('/?level=senior');
    await expect(page.locator('#heroTitle')).toContainText('调参数');
    await expect(page.locator('#crumb')).toContainText('高中');
    await expect(page.locator('#grid a.card[href="courseware/function-grapher/index.html"]')).toBeVisible();
    await expect(page.locator('#grid a.card[href="courseware/pendulum-lab/index.html"]')).toBeVisible();
    await expect(page.locator('#grid a.card[href="courseware/ph-lab/index.html"]')).toBeVisible();
    await expect(page.locator('body')).not.toContainText('建设中');
  });
});
