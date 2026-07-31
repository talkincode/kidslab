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
    containers: ['.schoolyard', '.trainer'].map((selector) => {
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

async function finishBasicTraining(page) {
  const answers = ['ball', 'notBall', 'notBall', 'notBall'];
  for (const answer of answers) await page.locator(answer === 'ball' ? '#ballBtn' : '#notBallBtn').click();
}

async function finishCorrections(page) {
  await page.locator('#biasTestBtn').click();
  await expect(page.locator('#status')).toContainText('误判');
  await page.locator('#ballBtn').click();
  await page.locator('#notBallBtn').click();
  await page.locator('#notBallBtn').click();
  await page.locator('#retrainBtn').click();
}

test.describe('robo-pet school', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.robo-pet-school');
      localStorage.removeItem('kidslab.progress.robo-pet-school');
      localStorage.removeItem('kidslab.sound.muted');
    });
    await page.goto('/courseware/robo-pet-school/');
  });

  test('recovers from bad labels, fixes biased data, and passes the park test', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '机器狗不会猜，要用例子教' })).toBeVisible();
    await page.locator('#notBallBtn').click();
    await expect(page.locator('#status')).toContainText('标签错了');
    await expect(page.locator('#exampleCount')).toHaveText('0');

    await finishBasicTraining(page);
    await expect(page.locator('#exampleCount')).toHaveText('4');
    await page.locator('#nextLessonBtn').click();
    await expect(page.getByRole('heading', { name: '只见过红球，豆豆漏掉了绿球' })).toBeVisible();

    await page.locator('#biasTestBtn').click();
    await expect(page.locator('#confidenceText')).toContainText('42%');
    await page.locator('#notBallBtn').click();
    await expect(page.locator('#status')).toContainText('教糊涂');
    await expect(page.locator('#exampleCount')).toHaveText('4');
    await page.locator('#ballBtn').click();
    await page.locator('#notBallBtn').click();
    await page.locator('#notBallBtn').click();
    await page.locator('#retrainBtn').click();
    await expect(page.locator('#confidenceText')).toContainText('96%');

    await page.locator('#nextLessonBtn').click();
    await expect(page.getByRole('heading', { name: '用没见过的新物品检验是否学会' })).toBeVisible();
    for (let index = 0; index < 6; index += 1) {
      await page.locator('#decideBtn').click();
      await expect(page.locator('#status')).toContainText('判断正确');
      await page.locator('#nextObjectBtn').click();
    }

    await expect(page.getByRole('heading', { name: '豆豆毕业啦！' })).toBeVisible();
    await expect(page.locator('#playAgainBtn')).toBeFocused();
    await expect(page.locator('.course')).toHaveJSProperty('inert', true);
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.robo-pet-school') || 'null')?.status)).toBe('completed');
  });

  test('supports sound, language, theme, persistence, and target viewports', async ({ page }) => {
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#langBtn').click();
    await expect(page.getByRole('heading', { name: 'A Robo-Dog Needs Examples, Not Guesses' })).toBeVisible();
    await expect(page.locator('#missionNav')).toHaveAttribute('aria-label', 'Training lessons');
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-label', 'Turn sound on');
    await expectFitsViewport(page);

    await finishBasicTraining(page);
    await page.locator('#nextLessonBtn').click();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Seeing Only Red Balls Made Doudou Miss Green' })).toBeVisible();
    await expect(page.locator('#exampleCount')).toHaveText('4');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expectFitsViewport(page);
  });

  test('restores completed training and can start over', async ({ page }) => {
    await finishBasicTraining(page);
    await page.locator('#nextLessonBtn').click();
    await finishCorrections(page);
    await page.locator('#nextLessonBtn').click();
    for (let index = 0; index < 6; index += 1) {
      await page.locator('#decideBtn').click();
      await page.locator('#nextObjectBtn').click();
    }
    await page.reload();
    await expect(page.getByRole('heading', { name: '豆豆毕业啦！' })).toBeVisible();
    await page.locator('#playAgainBtn').click();
    await expect(page.getByRole('heading', { name: '机器狗不会猜，要用例子教' })).toBeVisible();
    await expect(page.locator('#exampleCount')).toHaveText('0');
  });
});
