import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const manifest = JSON.parse(
  readFileSync(new URL('../../courseware/index.json', import.meta.url), 'utf8'),
);

function observeFailures(page) {
  const failures = [];
  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => failures.push(`page: ${error.message}`));
  page.on('requestfailed', (request) => {
    failures.push(`request: ${request.url()} (${request.failure()?.errorText || 'failed'})`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) failures.push(`response: ${response.status()} ${response.url()}`);
  });
  return failures;
}

async function expectHealthyPage(page, failures) {
  await expect(page.locator('body')).toBeVisible();
  const overflow = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    return [...document.body.querySelectorAll('*')]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        if (rect.right <= viewportWidth + 1) return false;
        for (let parent = element.parentElement; parent; parent = parent.parentElement) {
          const style = getComputedStyle(parent);
          if (['auto', 'scroll', 'hidden', 'clip'].includes(style.overflowX)) return false;
        }
        return true;
      })
      .slice(0, 5)
      .map((element) => `${element.tagName.toLowerCase()}#${element.id}.${element.className}`);
  });
  expect(overflow, 'page must not contain visible horizontal overflow').toEqual([]);
  expect(failures, 'page must load without browser or resource errors').toEqual([]);
}

async function dragOrchardField(page, startIndex, endIndex) {
  await page.locator('#grid').evaluate((grid) => grid.scrollIntoView({ block: 'center' }));
  const start = await page.locator('.cell').nth(startIndex).boundingBox();
  const end = await page.locator('.cell').nth(endIndex).boundingBox();
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2);
  await page.mouse.up();
}

async function magnetPuckCenterX(page) {
  return page.locator('#rink').evaluate((canvas) => {
    const context = canvas.getContext('2d');
    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    const colors = ['--north', '--south'].map((name) => {
      const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
    });
    const y0 = Math.floor(canvas.height * 0.42);
    const y1 = Math.ceil(canvas.height * 0.58);
    const columns = [];
    for (let x = 0; x < canvas.width; x += 1) {
      let matches = 0;
      for (let y = y0; y < y1; y += 1) {
        const offset = (y * canvas.width + x) * 4;
        if (colors.some(([r, g, b]) =>
          Math.abs(image.data[offset] - r) < 4 &&
          Math.abs(image.data[offset + 1] - g) < 4 &&
          Math.abs(image.data[offset + 2] - b) < 4)) {
          matches += 1;
        }
      }
      if (matches > 3) columns.push(x);
    }
    const groups = [];
    for (const x of columns) {
      const group = groups.at(-1);
      if (!group || x - group.at(-1) > 5) groups.push([x]);
      else group.push(x);
    }
    const puck = groups.at(-1);
    return (puck[0] + puck.at(-1)) / 2 / (canvas.width / canvas.getBoundingClientRect().width);
  });
}

test.describe('main site', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
  });

  test('search and category filters update the visible courseware', async ({ page }) => {
    const failures = observeFailures(page);
    await page.goto('/');
    await expect(page.locator('#grid .card').first()).toBeVisible();

    const cards = page.locator('#grid .card');
    const initialCount = await cards.count();
    expect(initialCount).toBeGreaterThan(1);

    const searchable = manifest.courses.find((course) =>
      !course.pinned && course.levels.includes('primary'));
    await page.locator('#searchInput').fill(searchable.title.zh);
    await expect.poll(() => cards.count()).toBeLessThan(initialCount);
    await expect(cards.first()).toHaveAttribute('href', searchable.path);

    await page.locator('#searchInput').fill('');
    await expect.poll(() => cards.count()).toBe(initialCount);
    const mobileMenu = await page.locator('#menuBtn').isVisible();
    if (mobileMenu) await page.locator('#menuBtn').click();
    await page.locator('#catList li:nth-child(2) button').click();
    await expect.poll(() => cards.count()).toBeLessThan(initialCount);
    if (mobileMenu) {
      await expect.poll(() =>
        page.locator('#sidebar').evaluate((sidebar) =>
          Math.round(sidebar.getBoundingClientRect().right))).toBeLessThanOrEqual(0);
    }
    await expectHealthyPage(page, failures);
  });
});

test.describe('bug hospital onboarding', () => {
  test('a first-time doctor can diagnose and heal the first patient', async ({ page }) => {
    const failures = observeFailures(page);
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.removeItem('kidslab.bug-hospital.onboarded');
    });
    await page.goto('/courseware/bug-hospital/');

    await expect(page.getByRole('dialog', { name: '值班医生上岗' })).toBeVisible();
    await page.getByRole('button', { name: '开始问诊' }).click();
    await page.getByRole('button', { name: '显示（药片 + 1）' }).click();
    await page.getByRole('button', { name: '开始单步听诊' }).click();
    for (let step = 0; step < 7; step += 1) {
      await page.getByRole('button', { name: '执行下一步' }).click();
    }

    await expect(page.getByRole('heading', { name: '哪一针能让程序恢复正常？' })).toBeVisible();
    const evidenceVisible = await page.evaluate(() => ['.code-list', '.monitor'].map((selector) => {
      const element = document.querySelector(selector);
      const rect = element.getBoundingClientRect();
      const top = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return element.contains(top) || element === top;
    }));
    expect(evidenceVisible, 'repair choices must not cover code or variable evidence').toEqual([true, true]);
    await page.getByRole('button', { name: '显示（药片）', exact: true }).click();
    await expect(page.getByText('准确发出 4 颗药！')).toBeVisible();
    await expect(page.getByRole('button', { name: '下一位病人' })).toBeVisible();
    await expectHealthyPage(page, failures);
  });

  test('sound feedback can be muted and stays muted after reload', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.bug-hospital.onboarded', '1');
      if (!sessionStorage.getItem('kidslab.sound.seeded')) {
        sessionStorage.setItem('kidslab.sound.seeded', '1');
        localStorage.removeItem('kidslab.bug-hospital.sound');
      }
      window.__toneStarts = 0;
      class AudioParam {
        setValueAtTime() {}
        exponentialRampToValueAtTime() {}
      }
      class AudioNode {
        connect() { return this; }
      }
      class Oscillator extends AudioNode {
        frequency = new AudioParam();
        start() { window.__toneStarts += 1; }
        stop() {}
      }
      class Gain extends AudioNode {
        gain = new AudioParam();
      }
      class AudioContext {
        currentTime = 0;
        destination = {};
        createOscillator() { return new Oscillator(); }
        createGain() { return new Gain(); }
        resume() { return Promise.resolve(); }
      }
      window.AudioContext = AudioContext;
      window.webkitAudioContext = AudioContext;
    });
    await page.goto('/courseware/bug-hospital/');

    const sound = page.getByRole('button', { name: '声音开启' });
    await expect(sound).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: '显示（药片 + 1）' }).click();
    await expect.poll(() => page.evaluate(() => window.__toneStarts)).toBeGreaterThan(0);

    const tonesBeforeMute = await page.evaluate(() => window.__toneStarts);
    await sound.click();
    await expect(page.getByRole('button', { name: '声音关闭' })).toHaveAttribute('aria-pressed', 'false');
    await page.getByRole('button', { name: '药片 = 0' }).click();
    expect(await page.evaluate(() => window.__toneStarts)).toBe(tonesBeforeMute);

    await page.reload();
    await expect(page.getByRole('button', { name: '声音关闭' })).toHaveAttribute('aria-pressed', 'false');
  });
});

test.describe('orchard orders special challenge', () => {
  test('a wrong-sized field can be corrected without restarting', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('kidslab.lang', 'zh'));
    await page.goto('/courseware/orchard-orders/');

    await page.locator('.cell').first().click();
    await page.getByRole('button', { name: '播种' }).click();
    await expect(page.locator('#tip')).toContainText('现在是 1 个苹果，订单要 12 个');
    await expect(page.getByRole('button', { name: '播种' })).toBeEnabled();

    await dragOrchardField(page, 0, 27);
    await page.getByRole('button', { name: '播种' }).click();
    await page.getByRole('button', { name: '浇水交货' }).click();
    await expect(page.getByRole('button', { name: '下一张订单' })).toBeEnabled({ timeout: 5_000 });
  });

  test('the 23-apple order explains and completes the 24 minus 1 strategy', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'The full pointer journey is covered on desktop.');
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
    });
    await page.goto('/courseware/orchard-orders/');

    const orders = [[3, 4], [3, 6], [4, 5], [4, 6], [5, 6], [6, 6], [6, 7], [6, 8]];
    for (const [rows, cols] of orders) {
      await dragOrchardField(page, 0, (rows - 1) * 12 + cols - 1);
      await page.getByRole('button', { name: '播种' }).click();
      await page.getByRole('button', { name: '浇水交货' }).click();
      await expect(page.getByRole('button', { name: '下一张订单' })).toBeEnabled({ timeout: 5_000 });
      await page.getByRole('button', { name: '下一张订单' }).click();
    }

    await expect(page.getByText('23 = 24 − 1')).toBeVisible();
    await page.getByRole('button', { name: '帮我铺成 4×6' }).click();
    await expect(page.locator('#liveMath')).toHaveText('4 行 × 6 列 = 24 个');
    await page.getByRole('button', { name: '播种' }).click();
    await page.getByRole('button', { name: '浇水交货' }).click();
    await expect(page.locator('#tip')).toContainText('24 − 1 = 23', { timeout: 5_000 });

    await page.getByRole('button', { name: '下一张订单' }).click();
    await dragOrchardField(page, 0, 65);
    await page.getByRole('button', { name: '播种' }).click();
    await expect(page.locator('#tip')).toContainText('必须分成两块田');

    await dragOrchardField(page, 0, 41);
    await page.getByRole('button', { name: '播种' }).click();
    await dragOrchardField(page, 8, 46);
    await page.getByRole('button', { name: '播种' }).click();
    await expect(page.locator('#liveMath')).toHaveText('已经播种 36 / 36 个苹果');
    await page.getByRole('button', { name: '浇水交货' }).click();
    await expect(page.locator('#tip')).toContainText('4×6 + 4×3 = 36', { timeout: 5_000 });
  });
});

test.describe('magnet hockey polarity', () => {
  test('matching facing poles repel the puck', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
    });
    await page.goto('/courseware/magnet-hockey/');

    const canvas = page.locator('#rink');
    await canvas.scrollIntoViewIfNeeded();
    const box = await canvas.boundingBox();
    const before = await magnetPuckCenterX(page);
    await page.mouse.move(box.x + box.width * 0.08, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.waitForTimeout(700);
    await page.mouse.up();
    const after = await magnetPuckCenterX(page);

    expect(after, 'facing S poles should push the puck away from the hand magnet').toBeGreaterThan(before + 3);
  });
});

test.describe('SDK source-page pilots', () => {
  const pilots = [
    '/docs/courseware-template/index.html',
    '/src/function-grapher/index.html',
    '/src/hanoi-tower/index.html',
    '/src/pendulum-lab/index.html',
    '/src/ph-lab/index.html',
    '/src/solar-explorer/index.html',
    '/src/sudoku-zoo/index.html',
    '/src/turtle-studio/index.html',
    '/src/welcome/index.html',
  ];

  for (const path of pilots) {
    test(`${path} runs before build`, async ({ page }) => {
      const failures = observeFailures(page);
      await page.addInitScript(() => {
        localStorage.setItem('kidslab.lang', 'zh');
        localStorage.setItem('kidslab.theme', 'light');
      });
      await page.goto(path);
      await page.locator('#langBtn').click();
      await expect.poll(() => page.evaluate(() => localStorage.getItem('kidslab.lang'))).toBe('en');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await page.locator('#themeBtn').click();
      await expect.poll(() => page.evaluate(() => localStorage.getItem('kidslab.theme'))).toBe('dark');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expectHealthyPage(page, failures);
    });
  }
});

test.describe('courseware manifest', () => {
  test('platform SDK persists preferences without analytics', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
    });
    await page.goto(`/${manifest.courses[0].path}`);

    const result = await page.evaluate(() => {
      const changes = [];
      const stop = window.cool.preferences.subscribe((change) => changes.push(change));
      const marker = document.createElement('span');
      marker.dataset.t = 'greeting';
      document.body.appendChild(marker);
      const i18n = window.cool.bindI18n({
        zh: { greeting: '你好' },
        en: { greeting: 'Hello' },
      }, { root: marker });

      window.cool.preferences.setLang('en');
      window.cool.preferences.setTheme('dark');
      window.cool.track('sdk-smoke');
      window.cool.stage('ready');
      stop();

      const snapshot = {
        lang: window.cool.preferences.lang,
        theme: window.cool.preferences.theme,
        storedLang: localStorage.getItem('kidslab.lang'),
        storedTheme: localStorage.getItem('kidslab.theme'),
        documentLang: document.documentElement.lang,
        documentTheme: document.documentElement.dataset.theme,
        translation: marker.textContent,
        directTranslation: i18n.t('greeting'),
        changes,
      };
      i18n.destroy();
      marker.remove();
      return snapshot;
    });

    expect(result).toEqual({
      lang: 'en',
      theme: 'dark',
      storedLang: 'en',
      storedTheme: 'dark',
      documentLang: 'en',
      documentTheme: 'dark',
      translation: 'Hello',
      directTranslation: 'Hello',
      changes: [
        { kind: 'lang', value: 'en' },
        { kind: 'theme', value: 'dark' },
      ],
    });
  });

  test('analytics extends the platform SDK', async ({ page }) => {
    await page.goto(`/${manifest.courses[0].path}`);
    const result = await page.evaluate(async () => {
      const preferences = window.cool.preferences;
      const beacons = [];
      Object.defineProperty(navigator, 'sendBeacon', {
        configurable: true,
        value: (url) => {
          beacons.push(url);
          return true;
        },
      });
      const tracker = await fetch('/scripts/track.js').then((response) => response.text());
      const script = document.createElement('script');
      script.textContent = tracker
        .replaceAll('__ANALYTICS_ENDPOINT__', '/sdk-analytics')
        .replaceAll('__COURSE_ID__', 'sdk-test');
      document.head.appendChild(script);
      const duplicate = document.createElement('script');
      duplicate.textContent = script.textContent;
      document.head.appendChild(duplicate);
      window.cool.stage('ready');
      window.cool.track('tap');
      return {
        samePreferences: window.cool.preferences === preferences,
        track: typeof window.cool.track,
        stage: typeof window.cool.stage,
        beacon: beacons[0],
        beaconCount: beacons.length,
      };
    });

    expect(result).toEqual({
      samePreferences: true,
      track: 'function',
      stage: 'function',
      beacon: '/sdk-analytics',
      beaconCount: 1,
    });
  });

  for (const course of manifest.courses) {
    test(`${course.id} loads across preferences`, async ({ page }) => {
      const failures = observeFailures(page);
      await page.addInitScript(() => {
        if (sessionStorage.getItem('kidslab.smoke.seeded')) return;
        sessionStorage.setItem('kidslab.smoke.seeded', 'true');
        localStorage.setItem('kidslab.lang', 'en');
        localStorage.setItem('kidslab.theme', 'dark');
      });

      await page.goto(`/${course.path}`);
      await page.waitForTimeout(200);
      const externalSdkRequest = await page.evaluate(() =>
        performance.getEntriesByType('resource')
          .some((entry) => entry.name.includes('/scripts/sdk/core.js')));
      expect(externalSdkRequest).toBe(false);
      const sdk = await page.evaluate(() => ({
        preferences: typeof window.cool?.preferences?.subscribe,
        bindI18n: typeof window.cool?.bindI18n,
        track: typeof window.cool?.track,
        stage: typeof window.cool?.stage,
      }));
      expect(sdk).toEqual({
        preferences: 'function',
        bindI18n: 'function',
        track: 'function',
        stage: 'function',
      });
      const themeBtn = page.locator('#themeBtn');
      await expect(themeBtn).toBeVisible();
      await themeBtn.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
      await expect.poll(() =>
        page.evaluate(() => localStorage.getItem('kidslab.theme'))).toBe('light');
      await expectHealthyPage(page, failures);

      failures.length = 0;
      await page.evaluate(() => {
        localStorage.setItem('kidslab.lang', 'zh');
      });
      await page.reload();
      await page.waitForTimeout(200);
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
      await expectHealthyPage(page, failures);
    });
  }
});
