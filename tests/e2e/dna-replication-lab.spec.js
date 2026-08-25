import { test, expect } from '@playwright/test';

const TEMPLATE = 'TACCAAAGT';
const PARTNER = { A: 'T', T: 'A', G: 'C', C: 'G' };

async function selectMobilePanel(page, panel) {
  const viewport = page.viewportSize();
  if (!viewport || viewport.width > 900) return;
  const button = page.locator(`.mobile-nav__button[data-mobile-panel="${panel}"]`);
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
}

async function placeBase(page, base) {
  await selectMobilePanel(page, 'stage');
  await page.locator(`.base-chip[data-base="${base}"]`).click();
}

async function pairWholeStrand(page) {
  for (let i = 0; i < TEMPLATE.length; i += 1) {
    await placeBase(page, PARTNER[TEMPLATE[i]]);
    await expect(page.locator('#readFork')).toHaveText(`${i + 1} / ${TEMPLATE.length}`);
  }
}

async function mutate(page, site, base) {
  await selectMobilePanel(page, 'task');
  await page.locator('[data-station="mutate"]').click();
  await page.locator(`[data-spot="${site}"]`).click();
  await page.locator(`.swap-btn[data-base="${base}"]`).click();
  await page.locator('#mutateBtn').click();
}

test.describe('dna replication lab', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const initializedKey = 'kidslab.e2e.dna-replication-lab.initialized';
      if (sessionStorage.getItem(initializedKey)) return;
      localStorage.setItem('kidslab.lang', 'zh');
      localStorage.setItem('kidslab.theme', 'light');
      localStorage.setItem('kidslab.dna-replication-lab.sound', 'off');
      localStorage.removeItem('kidslab.progress.dna-replication-lab');
      sessionStorage.setItem(initializedKey, 'true');
    });
    await page.goto('/courseware/dna-replication-lab/');
    await expect(page.locator('#seqTemplate')).toHaveText(TEMPLATE);
  });

  test('pairs the whole template and reads out mRNA and the protein', async ({ page }) => {
    await selectMobilePanel(page, 'task');
    await page.locator('[data-prediction="two"]').click();
    await expect(page.locator('#predictionFeedback')).toHaveClass(/is-success/);

    await selectMobilePanel(page, 'stage');
    await expect(page.locator('#readExposed')).toHaveText('T');
    await expect(page.locator('.scene-marker')).toHaveText('T');

    await pairWholeStrand(page);
    await expect(page.locator('#readNew')).toHaveText('ATGGTTTCA');
    await expect(page.locator('#labState')).toHaveText('复制完成');

    await selectMobilePanel(page, 'log');
    await expect(page.locator('#seqCoding')).toHaveText('ATGGTTTCA');
    await expect(page.locator('#seqRna')).toHaveText('AUGGUUUCA');
    await expect(page.locator('.acid-card')).toHaveCount(3);
    await expect(page.locator('#proteinRow')).toContainText('Met');
    await expect(page.locator('#proteinRow')).toContainText('Val');
    await expect(page.locator('#proteinRow')).toContainText('Ser');

    await selectMobilePanel(page, 'task');
    await expect(page.locator('#predictionVerdict')).toContainText('一共 2 条');
  });

  test('a wrong base refuses to bond and the fork stays where it was', async ({ page }) => {
    await selectMobilePanel(page, 'stage');
    /* 露出的是 T，只认 A；先故意放 G */
    await placeBase(page, 'G');
    await expect(page.locator('#toast')).toContainText('G 搭不上 T');
    await expect(page.locator('#readFork')).toHaveText('0 / 9');
    await expect(page.locator('#readNew')).toHaveText('—');

    /* 原地换成正确的碱基即可继续，不惩罚手滑 */
    await placeBase(page, 'A');
    await expect(page.locator('#readFork')).toHaveText('1 / 9');
    await expect(page.locator('#readNew')).toHaveText('A');
  });

  test('taking a base off and restarting the strand both rewind the fork', async ({ page }) => {
    await selectMobilePanel(page, 'stage');
    await placeBase(page, 'A');
    await placeBase(page, 'T');
    await expect(page.locator('#readNew')).toHaveText('AT');

    await page.locator('#undoBtn').click();
    await expect(page.locator('#readNew')).toHaveText('A');
    await page.locator('#restartBtn').click();
    await expect(page.locator('#readFork')).toHaveText('0 / 9');
    await expect(page.locator('#readNew')).toHaveText('—');

    await page.locator('#undoBtn').click();
    await expect(page.locator('#toast')).toContainText('还没有配上去的碱基');
  });

  test('a missense mutation changes the amino acid and lands in the log', async ({ page }) => {
    await pairWholeStrand(page);
    await mutate(page, 4, 'G');
    await expect(page.locator('#mutateFeedback')).toContainText('错义突变');
    await expect(page.locator('#mutateFeedback')).toHaveClass(/is-error/);

    await selectMobilePanel(page, 'log');
    const row = page.locator('#mutationBody tr').first();
    await expect(row).toContainText('GUU→GCU');
    await expect(row).toContainText('Val→Ala');
    await expect(row).toContainText('错义');
    await expect(page.locator('.acid-card.is-changed')).toHaveCount(1);
  });

  test('a nonsense mutation is reported as an early stop codon', async ({ page }) => {
    await pairWholeStrand(page);
    await mutate(page, 7, 'T');
    await expect(page.locator('#mutateFeedback')).toContainText('终止密码子');
    await selectMobilePanel(page, 'log');
    await expect(page.locator('#mutationBody tr').first()).toContainText('无义');
    await expect(page.locator('#proteinRow')).toContainText('Stop');
  });

  test('the mutation station is locked until the strand is paired, then unlocks', async ({ page }) => {
    await selectMobilePanel(page, 'task');
    await page.locator('[data-station="mutate"]').click();
    await expect(page.locator('#mutateHint')).toContainText('先把上一站的链配完');
    await expect(page.locator('[data-spot="0"]')).toBeDisabled();
    await expect(page.locator('#mutateBtn')).toBeDisabled();

    await pairWholeStrand(page);
    await selectMobilePanel(page, 'task');
    await page.locator('[data-station="mutate"]').click();
    await expect(page.locator('#mutateHint')).toContainText('选一个位点');
    await expect(page.locator('[data-spot="0"]')).toBeEnabled();
  });

  test('the silent-mutation challenge completes the lab and the sequence can be restored', async ({ page }) => {
    await selectMobilePanel(page, 'task');
    await page.locator('[data-prediction="two"]').click();
    await pairWholeStrand(page);

    await selectMobilePanel(page, 'task');
    await page.locator('[data-station="silent"]').click();
    await expect(page.locator('#silentTarget')).toHaveText('Met-Val-Ser');
    await expect(page.locator('#silentProgress')).toContainText('还没找到');

    /* 第 6 位 A→T 让密码子从 GUU 变成 GUA，仍然是缬氨酸 */
    await mutate(page, 5, 'T');
    await expect(page.locator('#mutateFeedback')).toContainText('同义突变');
    await selectMobilePanel(page, 'task');
    await page.locator('[data-station="silent"]').click();
    await expect(page.locator('.silent-slot.is-found')).toHaveCount(1);
    await expect(page.locator('#silentFeedback')).toContainText('找到了');

    await expect.poll(() => page.evaluate(() =>
      JSON.parse(localStorage.getItem('kidslab.progress.dna-replication-lab') || 'null')?.status)).toBe('completed');
    await selectMobilePanel(page, 'log');
    await expect(page.locator('#conclusion')).toHaveClass(/is-success/);
    await expect(page.locator('#seqTemplate')).toHaveText('TACCATAGT');

    /* 突变累积后可以还原序列，记录仍留在本子上 */
    await selectMobilePanel(page, 'task');
    await page.locator('[data-station="mutate"]').click();
    await page.locator('#restoreBtn').click();
    await selectMobilePanel(page, 'log');
    await expect(page.locator('#seqTemplate')).toHaveText(TEMPLATE);
    await expect(page.locator('#mutationBody tr')).toHaveCount(1);
  });

  test('language, theme, mute and layout hold up on both viewports', async ({ page }) => {
    await pairWholeStrand(page);
    await page.locator('#langBtn').click();
    await expect(page.locator('#stageTitle')).toHaveText('Replication fork');
    await expect(page.locator('#seqRna')).toHaveText('AUGGUUUCA');
    await page.locator('#langBtn').click();
    await expect(page.locator('#stageTitle')).toHaveText('复制叉');

    await page.locator('#themeBtn').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await selectMobilePanel(page, 'stage');
    await expect(page.locator('#scene')).toBeVisible();

    const soundBtn = page.locator('#soundBtn');
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'true');
    await soundBtn.click();
    await expect(soundBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(soundBtn).toHaveAttribute('aria-label', '关闭声音');
    const box = await soundBtn.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);

    const overflow = await page.evaluate(() => ({
      vertical: document.documentElement.scrollHeight > document.documentElement.clientHeight + 1,
      horizontal: document.body.scrollWidth > document.body.clientWidth + 1,
    }));
    expect(overflow.vertical).toBe(false);
    expect(overflow.horizontal).toBe(false);
  });
});
