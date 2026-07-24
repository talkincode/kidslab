import { test, expect } from '@playwright/test';

async function openFreshLab(page, isMobile) {
  await page.addInitScript(() => {
    localStorage.removeItem('kidslab.electricLab.autosave');
    localStorage.removeItem('kidslab.electricLab.saved');
    localStorage.removeItem('kidslab.electricLab.settings');
    localStorage.setItem('kidslab.lang', 'zh');
    localStorage.setItem('kidslab.theme', 'dark');
  });
  await page.goto('/courseware/electric-mouse/index.html');
  if (!isMobile) {
    await expect(page.locator('#zoomValue')).toHaveText('72%');
  } else {
    await expect(page.locator('#zoomValue')).toHaveText('48%');
  }
  await expect(page.locator('#liveState span')).toHaveText('等待接线');
}

async function worldScreenPoint(page, x, y, touch) {
  const box = await page.locator('#stage').boundingBox();
  const percent = Number.parseInt(await page.locator('#zoomValue').textContent(), 10);
  const zoom = percent / 100;
  const view = touch ? { x: 730, y: 535 } : { x: 800, y: 540 };
  return {
    x: box.x + box.width / 2 + (x - view.x) * zoom,
    y: box.y + box.height / 2 + (y - view.y) * zoom,
  };
}

async function tapWorld(page, x, y, touch) {
  const point = await worldScreenPoint(page, x, y, touch);
  if (touch) await page.touchscreen.tap(point.x, point.y);
  else await page.mouse.click(point.x, point.y);
}

async function connect(page, from, to, touch = false) {
  await tapWorld(page, from[0], from[1], touch);
  await tapWorld(page, to[0], to[1], touch);
}

async function lightStarterCircuit(page, touch = false) {
  await connect(page, [482, 540], [642, 540], touch);
  await connect(page, [738, 540], [932, 440], touch);
  await connect(page, [1028, 440], [378, 540], touch);
  await tapWorld(page, 690, 540, touch);
  await expect(page.locator('#liveState span')).toHaveText('电路工作中');
  await expect(page.locator('#totalCurrent')).not.toHaveText('0.00 A');
}

test.beforeEach(async ({ page, isMobile }) => {
  await openFreshLab(page, isMobile);
});

test('自由电路可点亮、制造短路、撤销恢复并保存加载', async ({ page, isMobile }) => {
  test.skip(isMobile, '桌面用鼠标路径覆盖故障恢复和持久化');

  await lightStarterCircuit(page);
  await expect(page.locator('#liveSummary')).toHaveText('4 个元件 · 3 条导线');

  await page.locator('#saveBtn').click();
  await expect(page.locator('#toast')).toContainText('作品已保存');

  await connect(page, [482, 540], [378, 540]);
  await expect(page.locator('#liveState span')).toHaveText('短路警报');
  await expect(page.locator('#faultCount')).not.toHaveText('0');

  await page.locator('#undoBtn').click();
  await expect(page.locator('#liveState span')).toHaveText('电路工作中');

  await page.locator('#clearBtn').click();
  await page.locator('#confirmClearBtn').click();
  await expect(page.locator('#liveSummary')).toHaveText('0 个元件 · 0 条导线');

  await page.locator('#loadBtn').click();
  await expect(page.locator('#liveSummary')).toHaveText('4 个元件 · 3 条导线');
  await expect(page.locator('#liveState span')).toHaveText('电路工作中');
});

test('触屏可接线、打开抽屉并放置新元件', async ({ page, isMobile }) => {
  test.skip(!isMobile, '移动项目覆盖触摸路径');

  await lightStarterCircuit(page, true);

  await page.locator('#toolboxToggle').tap();
  await expect(page.locator('#toolboxPanel')).toHaveClass(/is-open/);
  await page.locator('[data-component-type="motor"]').tap();
  await page.locator('[data-close-panel="toolboxPanel"]').tap();
  await tapWorld(page, 550, 800, true);
  await expect(page.locator('#liveSummary')).toContainText('5 个元件');

  await page.locator('#inspectorToggle').tap();
  await expect(page.locator('#inspectorPanel')).toHaveClass(/is-open/);
  await page.locator('[data-close-panel="inspectorPanel"]').tap();

  await page.locator('#muteBtn').click();
  await expect(page.locator('#muteBtn')).toHaveAttribute('aria-pressed', 'true');
});

test('触屏可用明确的拖动画布工具平移视图', async ({ page, isMobile }) => {
  test.skip(!isMobile, '移动项目覆盖单指画布平移');

  const panButton = page.locator('#panBtn');
  await expect(panButton).toBeVisible();
  await panButton.tap();
  await expect(panButton).toHaveAttribute('aria-pressed', 'true');

  await page.locator('#resetViewBtn').click();
  await expect.poll(() => page.evaluate(() =>
    localStorage.getItem('kidslab.electricLab.autosave'))).not.toBeNull();
  const before = await page.evaluate(() => JSON.parse(
    localStorage.getItem('kidslab.electricLab.autosave'),
  ).viewport.x);
  const box = await page.locator('#stage').boundingBox();
  const start = { x: box.x + box.width * .55, y: box.y + box.height * .72 };
  const end = { x: start.x + 72, y: start.y - 24 };
  await page.locator('#stage').dispatchEvent('pointerdown', {
    pointerId: 7,
    pointerType: 'touch',
    button: 0,
    buttons: 1,
    clientX: start.x,
    clientY: start.y,
  });
  await page.locator('#stage').dispatchEvent('pointermove', {
    pointerId: 7,
    pointerType: 'touch',
    button: 0,
    buttons: 1,
    clientX: end.x,
    clientY: end.y,
  });
  await page.locator('#stage').dispatchEvent('pointerup', {
    pointerId: 7,
    pointerType: 'touch',
    button: 0,
    buttons: 0,
    clientX: end.x,
    clientY: end.y,
  });

  await expect.poll(() => page.evaluate(() => JSON.parse(
    localStorage.getItem('kidslab.electricLab.autosave'),
  ).viewport.x)).toBeLessThan(before - 100);
  await panButton.tap();
  await expect(panButton).toHaveAttribute('aria-pressed', 'false');
});

test('长按菜单和多选编辑可恢复', async ({ page, isMobile }) => {
  test.skip(isMobile, '桌面覆盖长按菜单、框外多选和编辑历史');

  await page.locator('#dismissGuide').click();
  const lamp = await worldScreenPoint(page, 980, 440, false);
  await page.mouse.move(lamp.x, lamp.y);
  await page.mouse.down();
  await page.waitForTimeout(620);
  await expect(page.locator('#contextMenu')).toBeVisible();
  await page.mouse.up();
  await page.keyboard.press('Escape');

  const battery = await worldScreenPoint(page, 430, 540, false);
  await page.mouse.click(battery.x, battery.y);
  await page.keyboard.down('Shift');
  await page.mouse.click(lamp.x, lamp.y);
  await page.keyboard.up('Shift');
  await expect(page.locator('#selectionCount')).toHaveText('已选 2 项');

  await page.keyboard.press('r');
  await page.locator('#copyBtn').click();
  await expect(page.locator('#liveSummary')).toContainText('6 个元件');
  await page.locator('#deleteBtn').click();
  await expect(page.locator('#liveSummary')).toContainText('4 个元件');
  await page.locator('#undoBtn').click();
  await expect(page.locator('#liveSummary')).toContainText('6 个元件');
});
