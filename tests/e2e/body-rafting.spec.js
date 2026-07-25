import { test, expect } from '@playwright/test';

function observeFailures(page) {
  const failures = [];
  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => failures.push(`page: ${error.message}`));
  page.on('requestfailed', (request) => {
    failures.push(`request: ${request.url()} (${request.failure()?.errorText || 'failed'})`);
  });
  return failures;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('kidslab.lang', 'zh');
    localStorage.setItem('kidslab.theme', 'dark');
    localStorage.setItem('kidslab.bodyRafting.sound', 'off');
  });
});

test('选择食物、启航并完成口腔任务', async ({ page }) => {
  test.slow();
  const failures = observeFailures(page);
  await page.goto('/courseware/body-rafting/');

  await expect(page.locator('#launch')).toBeVisible();
  await expect(page.locator('#foodInsight')).toContainText('唾液淀粉酶');

  const candy = page.locator('button.food[data-food="candy"]');
  await candy.click();
  await expect(candy).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#foodInsight')).toContainText('主要到小肠');

  await page.locator('#startBtn').click();
  await expect(page.locator('#launch')).toBeHidden();
  await expect(page.locator('#playCard')).toHaveAttribute('data-started', 'true');
  await expect(page.locator('#playCard')).toHaveAttribute('data-section', 'mouth');
  await expect(page.locator('#missionBadge')).toHaveText('牙齿 + 唾液');
  await expect(page.locator('#chapterCount')).toHaveText('01 / 06');
  await expect(page.locator('#chapterClue')).toHaveText('牙齿切碎，唾液接力');

  const action = page.locator('#actionBtn');
  await action.click();
  for (let tap = 1; tap < 10; tap += 1) {
    await action.evaluate((button) => button.click());
  }
  await expect(page.locator('#missionValue')).toHaveText('10/10');
  await expect(page.locator('#missionStatus')).toHaveText('已完成');
  await expect(page.locator('#playCard')).toHaveAttribute('data-mission', 'complete');
  await expect(page.locator('#starCount')).toHaveText('3');
  await expect(page.locator('#codexCount')).toHaveText('1/6');

  await page.locator('#codexBtn').click();
  await expect(page.locator('#drawerLayer')).toBeVisible();
  await expect(page.locator('.codex-card.is-unlocked')).toHaveCount(1);
  await expect(page.locator('.codex-card.is-unlocked')).toContainText('口腔');
  await page.locator('#codexClose').click();
  await expect(page.locator('#drawerLayer')).toBeHidden();

  expect(failures).toEqual([]);
});

test('声音、语言、主题和手机首屏保持可用', async ({ page, isMobile }) => {
  test.slow();
  const failures = observeFailures(page);
  await page.goto('/courseware/body-rafting/');

  if (isMobile) {
    const viewport = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      launchBottom: document.querySelector('#launch').getBoundingClientRect().bottom,
    }));
    expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.innerHeight);
    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.innerWidth);
    expect(viewport.launchBottom).toBeLessThanOrEqual(viewport.innerHeight);
  }

  await page.locator('#startBtn').click();
  await expect(page.locator('#launch')).toBeHidden();
  await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#soundBtn').click();
  await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');

  await page.locator('#themeBtn').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator('#langBtn').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.brand__copy strong')).toHaveText('Digestive Rafting');

  expect(failures).toEqual([]);
});
