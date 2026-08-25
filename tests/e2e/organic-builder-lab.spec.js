import { test, expect } from '@playwright/test';

const REAGENTS = ['bromineWater', 'sodium', 'litmus', 'esterify'];

async function selectMobilePanel(page, panel) {
  const viewport = page.viewportSize();
  if (!viewport || viewport.width > 900) return;
  const button = page.locator(`.mobile-nav__button[data-mobile-panel="${panel}"]`);
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
}

async function pickElement(page, element) {
  await selectMobilePanel(page, 'stage');
  await page.locator(`[data-element="${element}"]`).click();
  await expect(page.locator(`[data-element="${element}"]`)).toHaveAttribute('aria-pressed', 'true');
}

/** 每个原子只暴露一个键位，所以「点第一个键位」就是确定性地接到下一个空方向上 */
async function fillSlot(page, host) {
  await selectMobilePanel(page, 'stage');
  const slot = (host === undefined
    ? page.locator('.scene-marker--slot')
    : page.locator(`.scene-marker--slot[data-slot-host="${host}"]`))
    .filter({ visible: true })
    .first();
  await expect(slot).toBeVisible();
  /* 放上原子后场景标记会整批重建，等分子式真的变了再进行下一步 */
  const before = await page.locator('#readFormula').textContent();
  await slot.click();
  await expect(page.locator('#readFormula')).not.toHaveText(before);
}

async function clearBench(page) {
  await selectMobilePanel(page, 'stage');
  await page.locator('#clearBtn').click();
  await expect(page.locator('#readFormula')).toHaveText('—');
}

async function raiseBond(page, kind) {
  await selectMobilePanel(page, 'stage');
  const bond = page.locator(`.scene-marker--bond[data-bond-kind="${kind}"]`).first();
  await expect(bond).toBeVisible();
  const before = await page.locator('#readFree').textContent();
  /* 小屏上键位和空键标记会叠在一起，force 点到键本身，避免被空键位拦住 */
  await bond.click({ force: true });
  await expect(page.locator('#readFree')).not.toHaveText(before);
}

async function testReagent(page, reagent) {
  await selectMobilePanel(page, 'task');
  await page.locator('[data-station="react"]').click();
  await page.locator(`[data-reagent="${reagent}"]`).click();
  const guess = page.locator('[data-guess="yes"]');
  await expect(guess).toBeEnabled();
  await guess.click();
  await expect(page.locator('#testBtn')).toBeEnabled();
  await page.locator('#testBtn').click();
  await expect(page.locator('#reactFeedback')).not.toHaveText('');
}

async function measureAngle(page) {
  await selectMobilePanel(page, 'stage');
  await page.locator('#measureBtn').click();
  await expect(page.locator('#measureBtn')).toHaveAttribute('aria-pressed', 'true');
  /* 先点中间的原子，再点两侧；每选中一个都会从「可点」变成「已选」 */
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
  /* 一个氧升成双键，羧基才成形 */
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
  /* 第二个碳必须接在氧上，接回第一个碳就变成乙醇了 */
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
      localStorage.removeItem('kidslab.progress.organic-builder-lab');
      sessionStorage.setItem(initializedKey, 'true');
    });
    await page.goto('/courseware/organic-builder-lab/');
    await expect(page.locator('#readFormula')).toHaveText('—');
    await expect(page.locator('.scene-marker--slot')).toHaveCount(1);
  });

  test('builds methane, measures 109.5 degrees, and logs the shape and group', async ({ page }) => {
    await selectMobilePanel(page, 'task');
    await page.locator('[data-prediction="tetra"]').click();
    await expect(page.locator('#predictionFeedback')).toHaveClass(/is-success/);

    await buildMethane(page);
    await expect(page.locator('#readFree')).toHaveText('0');
    await expect(page.locator('#labState')).toHaveText('完整分子');

    await measureAngle(page);
    await expect(page.locator('#readAngle')).toHaveText('109.5°');
    await selectMobilePanel(page, 'log');
    await expect(page.locator('#archiveBody tr').first()).toContainText('正四面体');
    await expect(page.locator('#archiveBody tr').first()).toContainText('109.5°');
    await expect(page.locator('#archiveBody tr').first()).toContainText('只有 C—H');

    await selectMobilePanel(page, 'task');
    await expect(page.locator('#predictionVerdict')).toContainText('109.5');
    await expect(page.locator('#buildCount')).toHaveText('1 / 4');
  });

  test('a double bond flattens the carbons and ethene decolourises bromine water', async ({ page }) => {
    await buildEthene(page);
    await selectMobilePanel(page, 'log');
    await expect(page.locator('#archiveBody tr').first()).toContainText('平面三角');

    await selectMobilePanel(page, 'task');
    await page.locator('[data-station="react"]').click();
    await expect(page.locator('#reactSample')).toContainText('乙烯');
    await page.locator('[data-reagent="bromineWater"]').click();
    await page.locator('[data-guess="yes"]').click();
    await page.locator('#testBtn').click();
    await expect(page.locator('#reactFeedback')).toContainText('橙色褪掉了');
    await expect(page.locator('#reactFeedback')).toHaveClass(/is-success/);

    await selectMobilePanel(page, 'log');
    await expect(page.locator('#matrixCount')).toHaveText('1 / 16');
    await expect(page.locator('#matrixBody .matrix-cell.is-yes')).toHaveCount(1);
  });

  test('a wrong reagent prediction is corrected in place and the matrix still records the truth', async ({ page }) => {
    await buildMethane(page);
    await selectMobilePanel(page, 'task');
    await page.locator('[data-station="react"]').click();
    await page.locator('[data-reagent="bromineWater"]').click();
    /* 甲烷不与溴水反应，故意押「会反应」走一次失败路径 */
    await page.locator('[data-guess="yes"]').click();
    await page.locator('#testBtn').click();
    await expect(page.locator('#reactFeedback')).toContainText('和你猜的不一样');
    await expect(page.locator('#reactFeedback')).toHaveClass(/is-error/);
    await expect(page.locator('#testBtn')).toBeDisabled();

    /* 同一瓶试剂不能重复计入，但换一瓶可以原地继续 */
    await page.locator('[data-reagent="bromineWater"]').click();
    await page.locator('[data-guess="no"]').click();
    await page.locator('#testBtn').click();
    await expect(page.locator('#reactFeedback')).toContainText('已经在这个分子上试过');

    await page.locator('[data-reagent="sodium"]').click();
    await page.locator('[data-guess="no"]').click();
    await page.locator('#testBtn').click();
    await expect(page.locator('#reactFeedback')).toContainText('猜对了');
    await selectMobilePanel(page, 'log');
    await expect(page.locator('#matrixCount')).toHaveText('2 / 16');
    await expect(page.locator('#matrixBody .matrix-cell.is-no')).toHaveCount(2);
  });

  test('a blocked double bond and a full atom are refused without breaking the bench', async ({ page }) => {
    await buildMethane(page);
    await selectMobilePanel(page, 'stage');
    /* 甲烷的每根 C—H 都无法升级成双键，键位标记因此根本不出现 */
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
    await selectMobilePanel(page, 'task');
    await page.locator('[data-station="isomer"]').click();
    await expect(page.locator('#isomerFormula')).toHaveText('C₂H₆O');

    await buildMethane(page);
    await selectMobilePanel(page, 'task');
    await expect(page.locator('#isomerFeedback')).toContainText('这一关要 C₂H₆O');
    await expect(page.locator('#isomerFeedback')).toHaveClass(/is-error/);

    await buildEthanol(page);
    await selectMobilePanel(page, 'task');
    await expect(page.locator('.isomer-slot.is-found')).toHaveCount(1);
    await expect(page.locator('#isomerProgress')).toContainText('乙醇');

    await buildEthanol(page);
    await selectMobilePanel(page, 'task');
    await expect(page.locator('#isomerFeedback')).toContainText('连法完全一样');

    await buildDimethylEther(page);
    await selectMobilePanel(page, 'task');
    await expect(page.locator('#isomerProgress')).toContainText('甲醚');
    await expect(page.locator('.isomer-slot.is-found')).toHaveCount(2);
    await expect(page.locator('#isomerFeedback')).toContainText('都找到了');

    await page.locator('#isomerNextBtn').click();
    await expect(page.locator('#isomerFormula')).toHaveText('C₄H₁₀');
    await expect(page.locator('.isomer-slot.is-found')).toHaveCount(0);
  });

  test('completing every station marks the courseware finished', async ({ page }) => {
    /* 四个分子的拼装 + 量角 + 16 格试剂在 CI 软件 WebGL 下会超过默认 60s */
    test.setTimeout(180000);
    await selectMobilePanel(page, 'task');
    await page.locator('[data-prediction="tetra"]').click();

    /* 拼好一个就地测试剂，避免再整桌重拼一遍 */
    for (const build of [buildMethane, buildEthene, buildEthanol, buildAceticAcid]) {
      await build(page);
      await measureAngle(page);
      for (const reagent of REAGENTS) await testReagent(page, reagent);
    }
    await selectMobilePanel(page, 'log');
    await expect(page.locator('#archiveBody tr')).toHaveCount(4);
    await expect(page.locator('#matrixCount')).toHaveText('16 / 16');

    await selectMobilePanel(page, 'task');
    await page.locator('[data-station="isomer"]').click();
    await buildEthanol(page);
    await buildDimethylEther(page);

    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.organic-builder-lab') || 'null')?.status)).toBe('completed');
    await selectMobilePanel(page, 'log');
    await expect(page.locator('#conclusion')).toHaveClass(/is-success/);
  });

  test('language, theme and layout hold up on both viewports', async ({ page }) => {
    await buildMethane(page);
    await selectMobilePanel(page, 'stage');
    await page.locator('#langBtn').click();
    await expect(page.locator('#stageTitle')).toHaveText('Ball-and-stick bench');
    await expect(page.locator('#readFormula')).toHaveText('CH₄');
    await page.locator('#langBtn').click();
    await expect(page.locator('#stageTitle')).toHaveText('球棍拼装台');

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
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'true');
    await soundBtn.click();
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'false');
    const box = await soundBtn.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });
});
