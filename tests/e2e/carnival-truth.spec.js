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
          text: element.textContent.trim(),
          width: rect.width,
          height: rect.height,
          font: Number.parseFloat(getComputedStyle(element).fontSize),
        };
      })
      .filter(({ width, height }) => width > 0 && height > 0),
    statusFont: Number.parseFloat(getComputedStyle(document.querySelector('#status')).fontSize),
    lessonFont: Number.parseFloat(getComputedStyle(document.querySelector('#lessonText')).fontSize),
    canvasHeight: document.querySelector('#evidenceCanvas').getBoundingClientRect().height,
  }));

  expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.controls.filter(({ width, height }) => width < 44 || height < 44)).toEqual([]);
  expect(layout.controls.filter(({ font, text }) => font < 14 && text)).toEqual([]);
  expect(layout.statusFont).toBeGreaterThanOrEqual(16);
  expect(layout.lessonFont).toBeGreaterThanOrEqual(16);
  expect(layout.canvasHeight).toBeGreaterThanOrEqual(98);
}

async function runTrial(page) {
  await page.locator('#trialBtn').click();
  await expect(page.locator('#machineState')).toContainText(/证据已生成|EVIDENCE READY/, { timeout: 5000 });
}

async function solveFirstCase(page) {
  await runTrial(page);
  await page.locator('[data-verdict="dishonest"]').click();
  await page.locator('#checkBtn').click();
  await expect(page.locator('#status')).toContainText('理论概率是 1/12');
  await page.locator('#nextBtn').click();
}

async function solveSecondCase(page) {
  await runTrial(page);
  await page.locator('[data-verdict="honest"]').click();
  await page.locator('#checkBtn').click();
  await expect(page.locator('#status')).toContainText('2/10 = 1/5');
  await page.locator('#nextBtn').click();
}

async function solveThirdCase(page) {
  await page.locator('#minusBtn').click({ clickCount: 2 });
  await runTrial(page);
  await page.locator('#checkBtn').click();
  await expect(page.locator('#status')).toContainText('2/12 = 1/6');
  await page.locator('#nextBtn').click();
}

test.describe('carnival truth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.carnival-truth');
      localStorage.removeItem('kidslab.progress.carnival-truth');
      localStorage.removeItem('kidslab.sound.muted');
      sessionStorage.setItem('kidslab.starmap', JSON.stringify({ open: true }));
    });
    await page.goto('/courseware/carnival-truth/');
  });

  test('recovers from unsupported verdicts and completes all three probability cases', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '“一半的人都能中大奖！”是真的吗？' })).toBeVisible();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('先启动 1000 次试验');
    await runTrial(page);
    await page.locator('[data-verdict="honest"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('承诺是 1/2');
    await page.locator('[data-verdict="dishonest"]').click();
    await page.locator('#checkBtn').click();
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '“每 5 次大约中 1 次”可信吗？' })).toBeVisible();
    await runTrial(page);
    await page.locator('[data-verdict="dishonest"]').click();
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('2/10 约分后');
    await page.locator('[data-verdict="honest"]').click();
    await page.locator('#checkBtn').click();
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '设计一个“诱人但不容易中”的转盘' })).toBeVisible();
    await runTrial(page);
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('调整到 2 个');
    await page.locator('#minusBtn').click({ clickCount: 2 });
    await page.locator('#checkBtn').click();
    await expect(page.locator('#status')).toContainText('旧数据不能证明新转盘');
    await runTrial(page);
    await page.locator('#checkBtn').click();
    await page.locator('#nextBtn').click();

    await expect(page.getByRole('heading', { name: '你成为了“游园会真相官”！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('#course')).toHaveJSProperty('inert', true);
    await expect(page.locator('#topbar')).toHaveJSProperty('inert', true);
    await expect(page.locator('.kidslab-starmap-back')).toBeHidden();
    await page.keyboard.press('Tab');
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.carnival-truth') || 'null')?.status)).toBe('completed');
  });

  test('persists progress and supports language, theme, sound, and target viewports', async ({ page }) => {
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await runTrial(page);
    await page.locator('[data-verdict="dishonest"]').click();
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'Can “half of all players win big” be true?' })).toBeVisible();
    await expect(page.locator('#status')).toContainText('experimental frequency');
    await expect(page.locator('#caseNav')).toHaveAttribute('aria-label', 'Case progress');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expect(page.locator('#minusBtn')).toHaveAttribute('aria-label', 'Remove a prize sector');
    await expectFitsViewport(page);

    await page.reload();
    await expect(page.locator('[data-verdict="dishonest"]')).toHaveClass(/is-selected/);
    await expect(page.locator('#experimentReadout')).not.toHaveText('—');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expectFitsViewport(page);
  });

  test('restores completion and starts a fresh investigation', async ({ page }) => {
    await solveFirstCase(page);
    await solveSecondCase(page);
    await solveThirdCase(page);
    await page.reload();

    await expect(page.getByRole('heading', { name: '你成为了“游园会真相官”！' })).toBeVisible();
    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '“一半的人都能中大奖！”是真的吗？' })).toBeVisible();
    await expect(page.locator('#experimentReadout')).toHaveText('—');
  });
});
