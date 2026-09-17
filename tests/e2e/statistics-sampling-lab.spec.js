import { test, expect } from '@playwright/test';

async function ensurePanelOpen(page) {
  if (await page.locator('#panelHandle').getAttribute('aria-expanded') === 'true') return;
  await page.locator('#panelHandle').click();
  await expect(page.locator('#panelHandle')).toHaveAttribute('aria-expanded', 'true');
}

test.describe('sampling statistics lab', () => {
  test.describe.configure({ timeout: 90000 });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const key = 'kidslab.e2e.statistics-sampling-lab.initialized';
      if (sessionStorage.getItem(key)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.statistics-sampling-lab.music', '0');
      localStorage.setItem('kidslab.statistics-sampling-lab.sfx', '0');
      localStorage.removeItem('kidslab.statistics-sampling-lab');
      localStorage.removeItem('kidslab.progress.statistics-sampling-lab');
      sessionStorage.setItem(key, 'true');
    });
    await page.goto('/courseware/statistics-sampling-lab/');
    await expect(page.locator('#meanVal')).toHaveText('—');
  });

  test('shows commute estimand, district names, and a skippable welcome', async ({ page }) => {
    await expect(page.locator('#estimandName')).toBeVisible();
    await expect(page.locator('#estimandName')).toContainText('平均通勤用时');
    await expect(page.locator('#estimandUnit')).toContainText('min');
    await expect(page.locator('#hudMeanLabel')).toContainText('通勤');

    const districts = [
      ['downtown', '12'],
      ['riverside', '24'],
      ['factory', '36'],
      ['hill', '48'],
    ];
    for (const [id, mean] of districts) {
      const label = page.locator(`[data-district="${id}"]`);
      await expect(label).toBeVisible();
      await expect(label).toContainText(mean);
      await expect(label).toContainText('min');
      await expect(label).toContainText('通勤');
    }
    await expect(page.locator('[data-district="downtown"]')).toContainText('近郊');
    await expect(page.locator('[data-district="downtown"]')).toContainText('浅蓝');
    await expect(page.locator('[data-district="factory"]')).toContainText('远郊');
    await expect(page.locator('[data-district="factory"]')).toContainText('红砖');

    await expect(page.locator('#welcome')).toBeVisible();
    await expect(page.locator('#welcomeText')).toContainText('通勤调查局');
    await expect(page.locator('#welcomeText')).toContainText('请点击');
    await expect(page.locator('#welcomeText')).toContainText('抽取样本');
    await expect(page.locator('#welcomeText')).toContainText('调查结果');
    await expect(page.locator('#welcomeText')).not.toContainText('80');
    await expect(page.locator('#coach')).toBeHidden();
    await expect(page.locator('#drawBtn')).toBeVisible();

    await page.locator('#langBtn').click();
    await expect(page.locator('#estimandName')).toContainText('Mean commute time');
    await expect(page.locator('#estimandUnit')).toContainText('min');
    await expect(page.locator('[data-district="downtown"]')).toContainText('Near-city');
    await expect(page.locator('[data-district="downtown"]')).toContainText('cyan');
    await expect(page.locator('[data-district="factory"]')).toContainText('Far-suburb');
    await expect(page.locator('[data-district="factory"]')).toContainText('brick');
    await expect(page.locator('#welcomeText')).toContainText('commute');
    await expect(page.locator('#welcomeText')).toContainText('Draw sample');
    await page.locator('#langBtn').click();

    await page.locator('#welcomeSkip').click();
    await expect(page.locator('#welcome')).toBeHidden();
    await expect(page.locator('#drawBtn')).toBeVisible();
  });

  test('welcome disappears after a draw and census names commute time', async ({ page }) => {
    await expect(page.locator('#welcome')).toBeVisible();
    await page.locator('#drawBtn').click();
    await expect(page.locator('#welcome')).toBeHidden();
    await expect(page.locator('#meanVal')).toContainText('min');
    await expect(page.locator('#estimandName')).toContainText('平均通勤用时');

    await ensurePanelOpen(page);
    await page.locator('#censusBtn').click();
    await expect(page.locator('#censusCard')).toBeVisible();
    await expect(page.locator('#censusTitle')).toContainText('通勤');
    await expect(page.locator('#muVal')).toContainText('min');
    await expect(page.locator('#sigmaVal')).toContainText('min');
    await expect(page.locator('#censusMuLabel')).toContainText('通勤');
    await expect(page.locator('#censusSigmaLabel')).toContainText('通勤');
  });

  test('one draw shows error bars and batch plotting does not hide HUD', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.locator('#drawBtn').click();
    await expect(page.locator('#meanVal')).not.toHaveText('—');
    await expect(page.locator('#intervalVal')).not.toHaveText('—');
    await expect(page.locator('#errorBar')).toBeVisible();

    await ensurePanelOpen(page);
    await page.locator('#batch50Btn').click();
    await expect.poll(() => page.locator('#meanChart .dot').count()).toBeGreaterThanOrEqual(50);
    await expect(page.locator('#nVal')).toBeVisible();
    await expect(page.locator('#meanVal')).toBeVisible();

    const expanded = await page.locator('#panelHandle').getAttribute('aria-expanded');
    await page.locator('#panelHandle').click();
    await expect(page.locator('#panelHandle')).toHaveAttribute(
      'aria-expanded',
      expanded === 'true' ? 'false' : 'true',
    );
    await expect(page.locator('#nVal')).toBeVisible();
    await expect(page.locator('#seVal')).toBeVisible();
    await page.locator('#panelHandle').click();
    await expect(page.locator('#panelHandle')).toHaveAttribute('aria-expanded', expanded);
    expect(errors).toEqual([]);
  });

  test('convenience clusters at the survey point and Bias appears after census', async ({ page }) => {
    await ensurePanelOpen(page);
    await page.locator('#methodConvenience').click();
    await page.locator('#drawBtn').click();
    await expect(page.locator('#surveyPoint')).toHaveClass(/is-lit/);
    const spread = Number(await page.locator('body').getAttribute('data-sample-spread'));
    expect(spread).toBeGreaterThan(0);
    expect(spread).toBeLessThan(6);
    await expect(page.locator('#censusCard')).toBeHidden();

    await page.locator('#censusBtn').click();
    await expect(page.locator('#censusCard')).toBeVisible();
    await expect(page.locator('#biasVal')).toContainText('−18');
    await expect(page.locator('#muVal')).toContainText('30');
  });

  test('records convenience then stratified samples and completes after census', async ({ page }) => {
    await ensurePanelOpen(page);
    await page.locator('#methodConvenience').click();
    await expect(page.locator('#methodVal')).toHaveText('便利');
    await page.locator('#drawBtn').click();
    await expect(page.locator('#meanVal')).not.toHaveText('—');
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await expect(page.locator('#trialRows')).toContainText('便利');

    await ensurePanelOpen(page);
    await page.locator('#methodStratified').click();
    await expect(page.locator('#methodVal')).toHaveText('分层');
    await page.locator('#drawBtn').click();
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(2);

    await page.locator('#censusBtn').click();
    await expect(page.locator('#completeCard')).toBeVisible();
    await expect(page.locator('#conclusionStatus')).toContainText('30');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.statistics-sampling-lab') || 'null')?.phase)).toBe('complete');
  });

  test('refuses to record before a draw and keeps the notebook empty', async ({ page }) => {
    await page.locator('#recordBtn').click();
    await expect(page.locator('#feedback')).toContainText('还没抽样');
    await expect(page.locator('#trialRows tr')).toHaveCount(0);
    await expect(page.locator('#meanVal')).toHaveText('—');

    await page.locator('#drawBtn').click();
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);

    await page.locator('#recordBtn').click();
    await expect(page.locator('#feedback')).toContainText('已经记过');
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
  });

  test('restores an in-progress notebook, resets it, and stays readable after preferences change', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await ensurePanelOpen(page);
    await page.locator('#methodConvenience').click();
    await page.locator('#drawBtn').click();
    await page.locator('#recordBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await page.reload();
    await expect(page.locator('#trialRows tr')).toHaveCount(1);
    await expect(page.locator('#methodVal')).toHaveText('便利');

    await page.locator('#langBtn').click();
    await expect(page.locator('#drawBtn')).toContainText('Draw sample');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('#resetBtn').click();
    await expect(page.locator('#trialRows tr')).toHaveCount(0);
    await expect(page.locator('#meanVal')).toHaveText('—');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('kidslab.statistics-sampling-lab'))).toBeNull();

    const expanded = await page.locator('#panelHandle').getAttribute('aria-expanded');
    await page.locator('#panelHandle').click();
    await expect(page.locator('#panelHandle')).toHaveAttribute(
      'aria-expanded',
      expanded === 'true' ? 'false' : 'true',
    );
    await page.locator('#panelHandle').click();
    await expect(page.locator('#panelHandle')).toHaveAttribute('aria-expanded', expanded);

    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      controls: [...document.querySelectorAll('button:not([hidden])')].map((element) => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height, font: Number.parseFloat(getComputedStyle(element).fontSize) };
      }).filter(({ width, height }) => width > 0 && height > 0),
    }));
    expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
    expect(layout.controls.filter(({ width }) => width < 40)).toEqual([]);
    expect(layout.controls.filter(({ height }) => height < 40)).toEqual([]);
    expect(Math.min(...layout.controls.map(({ font }) => font))).toBeGreaterThanOrEqual(14);
    expect(errors).toEqual([]);
  });
});
