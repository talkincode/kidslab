import { test, expect } from '@playwright/test';

const REAGENTS = ['bromineWater', 'sodium', 'litmus', 'esterify'];

async function openConsole(page) {
  const handle = page.locator('#sheetHandle');
  if (!(await handle.isVisible())) return;
  if (await handle.getAttribute('aria-expanded') === 'false') {
    await handle.click();
    await expect(handle).toHaveAttribute('aria-expanded', 'true');
  }
}

async function closeConsole(page) {
  const handle = page.locator('#sheetHandle');
  if (!(await handle.isVisible())) return;
  if (await handle.getAttribute('aria-expanded') === 'true') {
    await handle.click();
    await expect(handle).toHaveAttribute('aria-expanded', 'false');
  }
}

async function pickElement(page, element) {
  await page.locator(`[data-element="${element}"]`).click();
  await expect(page.locator(`[data-element="${element}"]`)).toHaveAttribute('aria-pressed', 'true');
}

/** 每个原子只暴露一个键位，所以「点第一个键位」就是确定性地接到下一个空方向上 */
async function fillSlot(page, host) {
  await closeConsole(page);
  const slot = (host === undefined
    ? page.locator('.scene-marker--slot')
    : page.locator(`.scene-marker--slot[data-slot-host="${host}"]`))
    .filter({ visible: true })
    .first();
  await expect(slot).toBeVisible();
  const before = await page.locator('#readFormula').textContent();
  await slot.click();
  await expect(page.locator('#readFormula')).not.toHaveText(before);
}

async function clearBench(page) {
  await closeConsole(page);
  await page.locator('#clearBtn').click();
  await expect(page.locator('#readFormula')).toHaveText('—');
}

async function raiseBond(page, kind) {
  await closeConsole(page);
  const bond = page.locator(`.scene-marker--bond[data-bond-kind="${kind}"]`).first();
  await expect(bond).toBeVisible();
  const before = await page.locator('#readFree').textContent();
  await bond.click({ force: true });
  await expect(page.locator('#readFree')).not.toHaveText(before);
}

async function dripReagent(page, reagent) {
  await openConsole(page);
  await page.locator('[data-station="react"]').click();
  await page.locator(`[data-reagent="${reagent}"]`).click();
  await expect(page.locator('#dripBtn')).toBeEnabled();
  await page.locator('#dripBtn').click();
  await expect(page.locator('#reactFeedback')).not.toHaveText('');
}

async function measureAngle(page) {
  await closeConsole(page);
  await page.locator('#measureBtn').click();
  await expect(page.locator('#measureBtn')).toHaveAttribute('aria-pressed', 'true');
  for (let i = 0; i < 3; i += 1) {
    const pick = page.locator('.scene-marker--atom.is-pickable').first();
    await expect(pick).toBeVisible();
    await pick.click();
    await expect(page.locator('.scene-marker--atom.is-picked')).toHaveCount(i + 1);
  }
  await expect(page.locator('#readAngle')).not.toHaveText('—');
  await page.locator('#measureBtn').click();
}

async function buildMethane(page) {
  await clearBench(page);
  await pickElement(page, 'C');
  await fillSlot(page);
  await pickElement(page, 'H');
  for (let i = 0; i < 4; i += 1) await fillSlot(page);
  await expect(page.locator('#readFormula')).toHaveText('CH₄');
}

async function buildEthene(page) {
  await clearBench(page);
  await pickElement(page, 'C');
  await fillSlot(page);
  await fillSlot(page);
  await raiseBond(page, 'CC');
  await pickElement(page, 'H');
  for (let i = 0; i < 4; i += 1) await fillSlot(page);
  await expect(page.locator('#readFormula')).toHaveText('C₂H₄');
}

async function buildEthanol(page) {
  await clearBench(page);
  await pickElement(page, 'C');
  await fillSlot(page);
  await fillSlot(page);
  await pickElement(page, 'O');
  await fillSlot(page);
  await pickElement(page, 'H');
  for (let i = 0; i < 6; i += 1) await fillSlot(page);
  await expect(page.locator('#readFormula')).toHaveText('C₂H₆O');
}

async function buildAceticAcid(page) {
  await clearBench(page);
  await pickElement(page, 'C');
  await fillSlot(page);
  await fillSlot(page);
  await pickElement(page, 'O');
  await fillSlot(page);
  await fillSlot(page);
  await raiseBond(page, 'CO');
  await expect(page.locator('#readFree')).toHaveText('4');
  await pickElement(page, 'H');
  for (let i = 0; i < 4; i += 1) await fillSlot(page);
  await expect(page.locator('#readFormula')).toHaveText('C₂H₄O₂');
}

async function buildDimethylEther(page) {
  await clearBench(page);
  await pickElement(page, 'C');
  await fillSlot(page);
  await pickElement(page, 'O');
  await fillSlot(page);
  await pickElement(page, 'C');
  await fillSlot(page, 2);
  await pickElement(page, 'H');
  for (let i = 0; i < 6; i += 1) await fillSlot(page);
  await expect(page.locator('#readFormula')).toHaveText('C₂H₆O');
}

test.describe('organic builder lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const initializedKey = 'kidslab.e2e.organic-builder-lab.initialized';
      if (sessionStorage.getItem(initializedKey)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.organic-builder-lab.sound', 'off');
      localStorage.setItem('kidslab.organic-builder-lab.music', 'off');
      localStorage.removeItem('kidslab.progress.organic-builder-lab');
      sessionStorage.setItem(initializedKey, 'true');
    });
    await page.goto('/courseware/organic-builder-lab/');
    await expect(page.locator('#readFormula')).toHaveText('—');
    await expect(page.locator('.scene-marker--slot')).toHaveCount(1);
  });

  test('happy path: fullscreen 3D, methane angle, reagent matrix, one isomer', async ({ page }) => {
    test.setTimeout(90000);
    await expect(page.locator('.mobile-nav')).toHaveCount(0);
    await expect(page.locator('[data-prediction]')).toHaveCount(0);
    await expect(page.locator('#testBtn')).toHaveCount(0);
    await expect(page.locator('#scene')).toBeVisible();
    await expect(page.locator('.view-dock')).toBeVisible();
    await expect(page.locator('#console')).toBeVisible();
    await expect(page.locator('#coach')).toBeVisible();

    const box = await page.locator('#scene').boundingBox();
    expect(box.width).toBeGreaterThan(360);
    expect(box.height).toBeGreaterThan(240);

    await pickElement(page, 'C');
    await fillSlot(page);
    await expect(page.locator('#readFormula')).toHaveText('C');
    await expect(page.locator('#readFree')).not.toHaveText('—');

    await buildMethane(page);
    await expect(page.locator('#readFree')).toHaveText('0');
    await measureAngle(page);
    await expect(page.locator('#readAngle')).toHaveText('109.5°');

    await dripReagent(page, 'bromineWater');
    await expect(page.locator('#reactFeedback')).toContainText('橙色一点没变');
    await expect(page.locator('#matrixCount')).toHaveText('1 / 16');
    await expect(page.locator('#matrixBody .matrix-cell.is-no')).toHaveCount(1);

    await openConsole(page);
    await page.locator('[data-station="isomer"]').click();
    await expect(page.locator('#isomerFormula')).toHaveText('C₂H₆O');
    await buildEthanol(page);
    await openConsole(page);
    await expect(page.locator('.isomer-slot.is-found')).toHaveCount(1);
    await expect(page.locator('#isomerProgress')).toContainText('乙醇');
  });

  test('builds methane, measures 109.5 degrees, and logs the shape and group', async ({ page }) => {
    await buildMethane(page);
    await expect(page.locator('#readFree')).toHaveText('0');
    await expect(page.locator('#labState')).toHaveText('完整分子');

    await measureAngle(page);
    await expect(page.locator('#readAngle')).toHaveText('109.5°');

    await openConsole(page);
    await expect(page.locator('#archiveBody tr').first()).toContainText('正四面体');
    await expect(page.locator('#archiveBody tr').first()).toContainText('109.5°');
    await expect(page.locator('#archiveBody tr').first()).toContainText('只有 C—H');
  });

  test('a double bond flattens the carbons and ethene decolourises bromine water', async ({ page }) => {
    await buildEthene(page);
    await openConsole(page);
    await expect(page.locator('#archiveBody tr').first()).toContainText('平面三角');

    await dripReagent(page, 'bromineWater');
    await expect(page.locator('#reactSample')).toContainText('乙烯');
    await expect(page.locator('#reactFeedback')).toContainText('橙色褪掉了');
    await expect(page.locator('#reactFeedback')).toHaveClass(/is-success/);
    await expect(page.locator('#matrixCount')).toHaveText('1 / 16');
    await expect(page.locator('#matrixBody .matrix-cell.is-yes')).toHaveCount(1);
  });

  test('dripping does not wait for a guess and refuses an empty or repeat pour', async ({ page }) => {
    await openConsole(page);
    await page.locator('[data-station="react"]').click();
    await page.locator('[data-reagent="bromineWater"]').click();
    await page.locator('#dripBtn').click();
    await expect(page.locator('#reactFeedback')).toContainText('完整分子');
    await expect(page.locator('#reactFeedback')).toHaveClass(/is-error/);

    await buildMethane(page);
    await dripReagent(page, 'bromineWater');
    await expect(page.locator('#reactFeedback')).toContainText('橙色一点没变');
    await expect(page.locator('#matrixBody .matrix-cell.is-no')).toHaveCount(1);

    await page.locator('[data-reagent="bromineWater"]').click();
    await page.locator('#dripBtn').click();
    await expect(page.locator('#reactFeedback')).toContainText('已经在这个分子上试过');

    await dripReagent(page, 'sodium');
    await expect(page.locator('#reactFeedback')).toContainText('没有气泡');
    await expect(page.locator('#matrixCount')).toHaveText('2 / 16');
    await expect(page.locator('#matrixBody .matrix-cell.is-no')).toHaveCount(2);
  });

  test('a blocked double bond and a full atom are refused without breaking the bench', async ({ page }) => {
    await buildMethane(page);
    await expect(page.locator('.scene-marker--bond')).toHaveCount(0);
    await expect(page.locator('.scene-marker--slot')).toHaveCount(0);

    await page.locator('#undoBtn').click();
    await expect(page.locator('#readFormula')).toHaveText('CH₃');
    await expect(page.locator('#readFree')).toHaveText('1');
    await pickElement(page, 'H');
    await fillSlot(page);
    await expect(page.locator('#readFormula')).toHaveText('CH₄');
    await expect(page.locator('#labState')).toHaveText('完整分子');
  });

  test('the isomer challenge separates ethanol from dimethyl ether by wiring alone', async ({ page }) => {
    test.setTimeout(90000);
    await openConsole(page);
    await page.locator('[data-station="isomer"]').click();
    await expect(page.locator('#isomerFormula')).toHaveText('C₂H₆O');

    await buildMethane(page);
    await openConsole(page);
    await expect(page.locator('#isomerFeedback')).toContainText('这一关要 C₂H₆O');
    await expect(page.locator('#isomerFeedback')).toHaveClass(/is-error/);

    await buildEthanol(page);
    await openConsole(page);
    await expect(page.locator('.isomer-slot.is-found')).toHaveCount(1);
    await expect(page.locator('#isomerProgress')).toContainText('乙醇');

    await buildEthanol(page);
    await openConsole(page);
    await expect(page.locator('#isomerFeedback')).toContainText('连法完全一样');

    await buildDimethylEther(page);
    await openConsole(page);
    await expect(page.locator('#isomerProgress')).toContainText('甲醚');
    await expect(page.locator('.isomer-slot.is-found')).toHaveCount(2);
    await expect(page.locator('#isomerFeedback')).toContainText('都找到了');

    await page.locator('#isomerNextBtn').click();
    await expect(page.locator('#isomerFormula')).toHaveText('C₄H₁₀');
    await expect(page.locator('.isomer-slot.is-found')).toHaveCount(0);
  });

  test('completing every station marks the courseware finished', async ({ page }) => {
    test.setTimeout(180000);
    for (const build of [buildMethane, buildEthene, buildEthanol, buildAceticAcid]) {
      await build(page);
      for (const reagent of REAGENTS) await dripReagent(page, reagent);
    }
    await openConsole(page);
    await expect(page.locator('#archiveBody tr')).toHaveCount(4);
    await expect(page.locator('#matrixCount')).toHaveText('16 / 16');

    await page.locator('[data-station="isomer"]').click();
    await buildEthanol(page);
    await buildDimethylEther(page);

    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.organic-builder-lab') || 'null')?.status)).toBe('completed');
    await openConsole(page);
    await expect(page.locator('#conclusion')).toHaveClass(/is-success/);
  });

  test('language, theme and layout hold up on both viewports', async ({ page }) => {
    await buildMethane(page);
    await page.locator('#langBtn').click();
    await expect(page.locator('.brand h1')).toHaveText('Organic Builder Lab');
    await expect(page.locator('#readFormula')).toHaveText('CH₄');
    await page.locator('#langBtn').click();
    await expect(page.locator('.brand h1')).toHaveText('有机分子工坊');

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#scene')).toBeVisible();

    const overflow = await page.evaluate(() => ({
      vertical: document.documentElement.scrollHeight > document.documentElement.clientHeight + 1,
      horizontal: document.body.scrollWidth > document.body.clientWidth + 1,
    }));
    expect(overflow.vertical).toBe(false);
    expect(overflow.horizontal).toBe(false);

    const soundBtn = page.locator('#soundBtn');
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'false');
    await soundBtn.click();
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'true');
    const box = await soundBtn.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });
});
