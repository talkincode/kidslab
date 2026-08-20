import { test, expect } from '@playwright/test';

async function selectMobilePanel(page, panel) {
  const viewport = page.viewportSize();
  if (!viewport || viewport.width > 900) return;
  const button = page.locator(`.mobile-nav__button[data-mobile-panel="${panel}"]`);
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
}

async function logTrial(page, specimenId, mass, volume) {
  await selectMobilePanel(page, 'case');
  await page.locator(`[data-specimen="${specimenId}"]`).click();
  await expect(page.locator('#weighBtn')).toBeVisible();
  await page.locator('#weighBtn').click();
  await page.locator('#submergeBtn').click();
  await selectMobilePanel(page, 'evidence');
  await page.locator('#massEntry').fill(String(mass));
  await page.locator('#volumeEntry').fill(String(volume));
  await page.locator('#recordBtn').click();
}

test.describe('density detective lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const initializedKey = 'kidslab.e2e.density-detective-lab.initialized';
      if (sessionStorage.getItem(initializedKey)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.density-detective-lab.sound', 'off');
      localStorage.removeItem('kidslab.progress.density-detective-lab');
      sessionStorage.setItem(initializedKey, 'true');
    });
    await page.goto('/courseware/density-detective-lab/');
  });

  test('measures three specimens, graphs their density, and identifies aluminum', async ({ page }) => {
    await page.getByRole('button', { name: '密度', exact: true }).click();

    await logTrial(page, 'specimen-a', 27, 10);
    await expect(page.locator('#recordBody tr').first()).toContainText('2.70');

    await logTrial(page, 'specimen-b', 54, 20);
    await logTrial(page, 'specimen-c', 81, 30);

    await expect(page.locator('#densityEstimate')).toHaveText('ρ = 2.70 g/cm³');
    await expect(page.locator('#graphPoints circle')).toHaveCount(3);
    await expect(page.locator('#material-aluminum')).toBeEnabled();
    await page.locator('#material-aluminum').click();
    await expect(page.locator('#conclusionStatus')).toContainText('案件结案');
    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.density-detective-lab') || 'null')?.status)).toBe('completed');
  });

  test('rejects a mismatched reading and lets the student correct it in place', async ({ page }) => {
    await selectMobilePanel(page, 'case');
    await page.locator('[data-specimen="specimen-a"]').click();
    await page.locator('#weighBtn').click();
    await page.locator('#submergeBtn').click();
    await selectMobilePanel(page, 'evidence');

    await page.locator('#massEntry').fill('26');
    await page.locator('#volumeEntry').fill('10');
    await page.locator('#recordBtn').click();
    await expect(page.locator('#entryFeedback')).toContainText('对不上');
    await expect(page.locator('#recordBody tr').first()).toContainText('—');

    await page.locator('#massEntry').fill('27');
    await page.locator('#recordBtn').click();
    await expect(page.locator('#recordBody tr').first()).toContainText('2.70');
    await expect(page.locator('#entryFeedback')).toContainText('已入档');
  });

  test('uses semantic sound feedback and keeps mute selected after reload', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('kidslab.density-detective-lab.sound', 'on'));
    await page.addInitScript(() => {
      window.__densityToneStarts = 0;
      class AudioParam {
        setValueAtTime() {}
        exponentialRampToValueAtTime() {}
      }
      class AudioNode {
        connect() {
          return this;
        }
      }
      class Oscillator extends AudioNode {
        frequency = new AudioParam();
        start() {
          window.__densityToneStarts += 1;
        }
        stop() {}
      }
      class Gain extends AudioNode {
        gain = new AudioParam();
      }
      class FakeAudioContext {
        state = 'running';
        currentTime = 0;
        destination = {};
        createGain() {
          return new Gain();
        }
        createOscillator() {
          return new Oscillator();
        }
        resume() {
          this.state = 'running';
          return Promise.resolve();
        }
        suspend() {
          this.state = 'suspended';
          return Promise.resolve();
        }
      }
      window.AudioContext = FakeAudioContext;
      if (!sessionStorage.getItem('kidslab.e2e.density-tone-ready')) {
        localStorage.setItem('kidslab.density-detective-lab.sound', 'on');
        sessionStorage.setItem('kidslab.e2e.density-tone-ready', 'true');
      }
    });
    await page.reload();

    await selectMobilePanel(page, 'bench');
    await page.locator('#weighBtn').click();
    await expect.poll(() => page.evaluate(() => window.__densityToneStarts)).toBeGreaterThan(0);
    const startsBeforeMute = await page.evaluate(() => window.__densityToneStarts);
    await page.locator('#soundBtn').click();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#submergeBtn').click();
    expect(await page.evaluate(() => window.__densityToneStarts)).toBe(startsBeforeMute);

    await page.reload();
    await expect(page.locator('#soundBtn')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: '打开声音' })).toBeVisible();
  });

  test('keeps the active lab panel inside desktop and phone viewports', async ({ page }) => {
    await selectMobilePanel(page, 'bench');
    await expect(page.locator('#weighBtn')).toBeVisible();
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
});
