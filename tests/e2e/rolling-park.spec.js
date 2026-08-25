import { test, expect } from '@playwright/test';

async function setRadius(page, value) {
  await page.locator('#radius').evaluate((range, next) => {
    range.value = String(next);
    range.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

/** 滚满一圈，并等这组直径落进记录表（expectedRows 含表头行） */
async function rollOnce(page, radius, expectedRows) {
  await setRadius(page, radius);
  await page.locator('#autoRoll').click();
  await expect(page.locator('#recordTable .row')).toHaveCount(expectedRows, { timeout: 8000 });
}

test.describe('rolling park', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
    });
    await page.goto('/courseware/rolling-park/');
  });

  /* 探究合同 M3 的两条判据：实测并排留存，且课件不抢在孩子之前说出规律 */
  test('π 只在孩子自己报出数值之后才出现', async ({ page }) => {
    await expect(page.locator('#guessCard')).toBeHidden();

    await rollOnce(page, 40, 2);
    await expect(page.locator('#guessCard')).toBeVisible();
    await expect(page.locator('#guessRow')).toBeHidden();
    await expect(page.locator('#guessAsk')).toContainText('再换 2 种');

    await rollOnce(page, 65, 3);
    await expect(page.locator('#guessRow')).toBeHidden();

    await rollOnce(page, 92, 4);

    const ratios = await page.locator('#recordTable .row span:nth-child(3)').allTextContents();
    expect(ratios).toHaveLength(3);
    for (const ratio of ratios) expect(Number(ratio)).toBeCloseTo(3.142, 2);

    await expect(page.locator('#guessRow')).toBeVisible();
    await expect(page.locator('#tip')).not.toContainText('π');
    await expect(page.locator('#guessAsk')).not.toContainText('π');
    await expect(page.locator('#guessOut')).toBeHidden();
    await expect(page.locator('#piBadge')).not.toHaveClass(/awake/);

    await page.locator('#guessInput').fill('10');
    await page.locator('#guessBtn').click();
    await expect(page.locator('#guessOut')).toBeVisible();
    await expect(page.locator('#guessOut')).not.toContainText('π');
    await expect(page.locator('#guessOut')).not.toContainText('3.14');
    await expect(page.locator('#piBadge')).not.toHaveClass(/awake/);

    await page.locator('#guessInput').fill('3.14');
    await page.locator('#guessBtn').click();
    await expect(page.locator('#guessOut')).toContainText('π');
    await expect(page.locator('#guessAsk')).toContainText('周长 ÷ 直径');
    await expect(page.locator('#guessRow')).toBeHidden();
    await expect(page.locator('#piBadge')).toHaveClass(/awake/);
  });

  test('深链直达猜想态，粗略估计也算数，切换语言保留记录', async ({ page }) => {
    await page.goto('/courseware/rolling-park/?state=guess');
    await expect(page.locator('#recordTable .row')).toHaveCount(4);
    await expect(page.locator('#guessRow')).toBeVisible();
    await expect(page.locator('#piBadge')).not.toHaveClass(/awake/);

    await page.locator('#langBtn').click();
    await expect(page.locator('#guessAsk')).toContainText('last column');
    await expect(page.locator('#recordTable .row')).toHaveCount(4);

    await page.locator('#guessInput').fill('3');
    await page.locator('#guessBtn').click();
    await expect(page.locator('#guessOut')).toContainText('π');
    await expect(page.locator('#piBadge')).toHaveClass(/awake/);

    await page.locator('#langBtn').click();
    await expect(page.locator('#guessAsk')).toContainText('周长 ÷ 直径');
    await expect(page.locator('#guessOut')).toContainText('派');
  });

  test('方轮只做平稳性对比，不混进实测记录', async ({ page }) => {
    await rollOnce(page, 50, 2);
    await page.locator('#squareRoll').click();
    await expect(page.locator('#tip')).toContainText('一颠一颠');
    await expect(page.locator('#tip')).not.toContainText('π');
    await expect(page.locator('#recordTable .row')).toHaveCount(2);
  });
});
