import { test, expect } from '@playwright/test';

test.describe('square root builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.progress.square-root-lab');
      if (!sessionStorage.getItem('kidslab.square-root-lab.sound-seeded')) {
        sessionStorage.setItem('kidslab.square-root-lab.sound-seeded', '1');
        localStorage.setItem('kidslab.square-root-lab.sound', 'off');
      }
    });
    await page.goto('/courseware/square-root-lab/');
  });

  test('calculates, simplifies, bounds, and recovers from invalid input', async ({ page }) => {
    await page.locator('#areaInput').fill('72');
    await page.getByRole('button', { name: '开始测量' }).click();
    await expect(page.locator('#resultValue')).toHaveText('√72 = 6√2 ≈ 8.4853');
    await expect(page.locator('#boundsText')).toHaveText('8² < 72 < 9²');

    await page.locator('#areaInput').fill('-4');
    await page.getByRole('button', { name: '开始测量' }).click();
    await expect(page.locator('#feedback')).toContainText('负数没有平方根');

    await page.locator('#areaInput').fill('49');
    await page.getByRole('button', { name: '开始测量' }).click();
    await expect(page.locator('#resultValue')).toHaveText('√49 = 7');
    await expect(page.locator('#sideEquation')).toHaveText('7 × 7 = 49');
  });

  test('allows a wrong answer retry and completes all five plans', async ({ page }) => {
    await page.getByRole('tab', { name: '闯关' }).click();

    await page.getByRole('button', { name: '6 cm', exact: true }).click();
    await expect(page.locator('#challengeFeedback')).toContainText('尺寸对不上');
    await expect(page.getByRole('button', { name: '7 cm', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: '7 cm', exact: true }).click();
    await page.getByRole('button', { name: '下一题' }).click();

    for (const answer of ['4 和 5', '6√2', '3.16']) {
      await page.getByRole('button', { name: answer, exact: true }).click();
      await page.getByRole('button', { name: '下一题' }).click();
    }
    await page.getByRole('button', { name: '144', exact: true }).click();
    await expect(page.locator('#challengeFeedback')).toContainText('五张蓝图全部通过');
    await expect(page.getByRole('button', { name: '再闯一轮' })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.square-root-lab') || 'null')?.status)).toBe('completed');
  });

  test('plays semantic feedback and keeps mute enabled after reload', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('kidslab.square-root-lab.sound', 'on'));
    await page.addInitScript(() => {
      window.__toneStarts = 0;
      class AudioParam {
        setValueAtTime() {}
        exponentialRampToValueAtTime() {}
      }
      class AudioNode { connect() { return this; } }
      class Oscillator extends AudioNode {
        frequency = new AudioParam();
        start() { window.__toneStarts += 1; }
        stop() {}
      }
      class Gain extends AudioNode { gain = new AudioParam(); }
      class FakeAudioContext {
        state = 'running';
        currentTime = 0;
        destination = {};
        createGain() { return new Gain(); }
        createOscillator() { return new Oscillator(); }
        resume() { this.state = 'running'; return Promise.resolve(); }
        suspend() { this.state = 'suspended'; return Promise.resolve(); }
      }
      window.AudioContext = FakeAudioContext;
    });
    await page.reload();

    await page.locator('#areaInput').fill('9');
    await page.getByRole('button', { name: '开始测量' }).click();
    await expect.poll(() => page.evaluate(() => window.__toneStarts)).toBeGreaterThan(0);
    const startsBeforeMute = await page.evaluate(() => window.__toneStarts);

    await page.getByRole('button', { name: '关闭声音' }).click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: '开始测量' }).click();
    expect(await page.evaluate(() => window.__toneStarts)).toBe(startsBeforeMute);

    await page.reload();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: '打开声音' })).toBeVisible();
  });

  test('keeps the core learning area inside desktop and phone viewports', async ({ page }) => {
    await expect(page.locator('#squareCanvas')).toBeVisible();
    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      appBottom: document.querySelector('.app').getBoundingClientRect().bottom,
    }));
    expect(layout.width).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.height).toBeLessThanOrEqual(layout.viewportHeight + 1);
    expect(layout.appBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
  });
});
