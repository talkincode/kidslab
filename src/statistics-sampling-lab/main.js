import { createAudio } from './audio.js';
import {
  DISTRICT_IDS,
  DISTRICT_MEANS,
  compareMethods,
  createLab,
  drawSample,
  parseLab,
  recordTrial,
  resetLab,
  runBatch,
  runCensus,
  serializeLab,
  setMethod,
  setN,
  snapshot,
} from './lab-model.js';
import { createLabScene } from './scene.js';

const STORE_KEY = 'kidslab.statistics-sampling-lab';
const WELCOME_KEY = `${STORE_KEY}.welcome`;
const DISTRICT_I18N = Object.freeze({
  downtown: 'districtDowntown',
  riverside: 'districtRiverside',
  factory: 'districtFactory',
  hill: 'districtHill',
});
const I18N = {
  zh: {
    doc: '📊 抽样统计实验室 · KidsLab',
    back: '返回平台',
    title: '抽样统计实验室',
    nogl: '浏览器暂时跑不了 3D 实验室，换一个新一点的浏览器再来观测吧。',
    hudMethod: '方法',
    hudN: 'n',
    hudMean: '样本均数 x̄ · 通勤用时',
    hudSe: 'SE',
    taskKicker: '这次在估',
    estimand: '平均通勤用时',
    estimandUnit: '单位：min',
    censusMuLabel: 'μ 通勤用时',
    censusSigmaLabel: 'σ 通勤用时',
    districtDowntown: '近郊浅蓝区：通勤 {mean} min',
    districtRiverside: '河岸区：通勤 {mean} min',
    districtFactory: '远郊红砖区：通勤 {mean} min',
    districtHill: '山坡绿顶区：通勤 {mean} min',
    welcome: '欢迎来到通勤调查局，请点击「抽取样本」选出居民，看看你的调查结果准不准。',
    welcomeSkip: '知道了',
    tip0: '抽一份便利样本，读出 x̄ 落在哪',
    panelTitle: '抽样面板',
    btnDraw: '抽取样本',
    btnRecord: '记下这次',
    btnCensus: '全市普查',
    btnReset: '重新实验',
    btnBatch50: '重复 50 次',
    btnBatch100: '重复 100 次',
    btnCompare: '四种对照',
    feedbackIdle: '换方法再抽，或重复 50 次看抽样分布。',
    labMethod: '抽样方法',
    labN: '样本人数 n',
    chartTitle: '抽样分布',
    censusTitle: '普查 · 平均通勤用时',
    biasTitle: 'Bias(x̄)',
    logTitle: '观测记录',
    colMethod: '方法',
    colN: 'n',
    colMean: 'x̄',
    lessonTitle: '公式与四种方法',
    lessonText: 'SE = (s/√n)·√[(N−n)/(N−1)]。Bias(x̄)=E(x̄)−μ，不是某一次的 x̄−μ。分层按区比例抽人；整群抽 1–2 栋楼做普查；便利样本挤在调查点，所以稳定偏 −18 min。',
    footTip: '拖动旋转视角 · 换方法看谁被抽中',
    musicOn: '关闭背景音乐',
    musicOff: '打开背景音乐',
    sfxOn: '关闭音效',
    sfxOff: '打开音效',
    theme: '切换主题',
    simple: '简单随机',
    stratified: '分层',
    cluster: '整群',
    convenience: '便利',
    complete: '便利抽样的 Bias 稳定为 −18 min；分层抽样的点堆在 μ = 30 附近。',
    noSample: '还没抽样，先抽一份再记。',
    duplicate: '这一份已经记过了，再抽一份吧。',
    outOfRange: 'n 要在 8 到 80 之间，而且是 4 的倍数。',
    notStratifiable: '分层需要 n 是 4 的倍数，四个区才能按比例平分。',
    invalidMethod: '这种抽法这台仪器没有。',
    tooLarge: '调查点附近没有那么多人。',
    invalidK: '只能重复 50 或 100 次。',
    recorded: '记下了。换一种方法，或重复 50 次看分布。',
    drawn: '样本已抽出。看 x̄ 和误差棒。',
    batched: '抽样分布已更新，三维场景保持这一份样本。',
    compared: '四种方法的 x̄ 已画在同一张图上。',
    censusTip: 'μ = 30 min。现在可以读 Bias，单次 x̄−μ 只是这一次差多远。',
    biasLine: '该方法 Bias(x̄) = {bias}（理论）。',
    mcBiasLine: '蒙特卡洛 Bias ≈ {bias}（k 次均值）。',
    thisDraw: '这一次 x̄ − μ = {err}。',
    dash: '—',
  },
  en: {
    doc: '📊 Sampling Statistics Lab · KidsLab',
    back: 'Back to platform',
    title: 'Sampling Statistics Lab',
    nogl: 'WebGL is unavailable, so the 3D lab cannot start. Try a newer browser.',
    hudMethod: 'Method',
    hudN: 'n',
    hudMean: 'Sample mean x̄ · commute time',
    hudSe: 'SE',
    taskKicker: 'Estimating',
    estimand: 'Mean commute time',
    estimandUnit: 'unit: min',
    censusMuLabel: 'μ commute time',
    censusSigmaLabel: 'σ commute time',
    districtDowntown: 'Near-city cyan: commute {mean} min',
    districtRiverside: 'Riverside: commute {mean} min',
    districtFactory: 'Far-suburb red brick: commute {mean} min',
    districtHill: 'Hillside green roof: commute {mean} min',
    welcome: 'Welcome to the commute survey. Click Draw sample to pick residents and see if your result is close.',
    welcomeSkip: 'Got it',
    tip0: 'Draw a convenience sample and read where x̄ lands',
    panelTitle: 'Sampling',
    btnDraw: 'Draw sample',
    btnRecord: 'Record this',
    btnCensus: 'City census',
    btnReset: 'Start over',
    btnBatch50: 'Repeat 50×',
    btnBatch100: 'Repeat 100×',
    btnCompare: 'Compare 4',
    feedbackIdle: 'Switch methods, or repeat 50× to see the sampling distribution.',
    labMethod: 'Sampling method',
    labN: 'Sample size n',
    chartTitle: 'Sampling distribution',
    censusTitle: 'Census · mean commute time',
    biasTitle: 'Bias(x̄)',
    logTitle: 'Lab notes',
    colMethod: 'Method',
    colN: 'n',
    colMean: 'x̄',
    lessonTitle: 'Formulas and the four methods',
    lessonText: 'SE = (s/√n)·√[(N−n)/(N−1)]. Bias(x̄)=E(x̄)−μ, not a single x̄−μ. Stratified draws by district; cluster censuses 1–2 buildings; convenience stays at the survey point, so Bias stays −18 min.',
    footTip: 'Drag to orbit · change the method and watch who is sampled',
    musicOn: 'Mute music',
    musicOff: 'Unmute music',
    sfxOn: 'Mute sound effects',
    sfxOff: 'Unmute sound effects',
    theme: 'Toggle theme',
    simple: 'Simple random',
    stratified: 'Stratified',
    cluster: 'Cluster',
    convenience: 'Convenience',
    complete: 'Convenience Bias stays −18 min; stratified dots pile up near μ = 30.',
    noSample: 'Nothing sampled yet — draw a sample first.',
    duplicate: 'That draw is already in the notebook.',
    outOfRange: 'n must be between 8 and 80 and a multiple of 4.',
    notStratifiable: 'Stratified draws need n to be a multiple of 4.',
    invalidMethod: 'This bench does not have that method.',
    tooLarge: 'The survey point does not have that many people.',
    invalidK: 'Batch size must be 50 or 100.',
    recorded: 'Saved. Switch methods, or repeat 50× to see the distribution.',
    drawn: 'Sample drawn. Read x̄ and the error bar.',
    batched: 'Sampling distribution updated. The 3D city still shows this one draw.',
    compared: 'All four methods are on the same plot.',
    censusTip: 'μ = 30 min. Bias is now readable; a single x̄−μ is just this draw.',
    biasLine: 'Bias(x̄) = {bias} (theoretical) for this method.',
    mcBiasLine: 'Monte Carlo Bias ≈ {bias} (mean of k draws).',
    thisDraw: 'This draw: x̄ − μ = {err}.',
    dash: '—',
  },
};

const REASON_KEY = {
  'no-sample': 'noSample',
  duplicate: 'duplicate',
  'out-of-range-n': 'outOfRange',
  'invalid-n': 'outOfRange',
  'n-not-stratifiable': 'notStratifiable',
  'invalid-method': 'invalidMethod',
  'n-too-large': 'tooLarge',
  'invalid-k': 'invalidK',
};

const METHOD_COLOR = {
  simple: '#4cc9f0',
  stratified: '#80ed99',
  cluster: '#ffd166',
  convenience: '#ff5d8f',
};

let t = (key) => I18N.zh[key] ?? key;
const $ = (id) => document.getElementById(id);
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const langBtn = $('langBtn');
const themeBtn = $('themeBtn');
const musicBtn = $('musicBtn');
const soundBtn = $('soundBtn');
const panel = $('panel');
const panelBody = $('panelBody');
const panelHandle = $('panelHandle');
const panelArrow = $('panelArrow');
const coach = $('coach');
const feedback = $('feedback');

const audio = createAudio(STORE_KEY);
let lab = createLab();
let scene = null;
let unlocked = false;

try {
  const saved = localStorage.getItem(STORE_KEY);
  if (saved) lab = parseLab(saved);
} catch { /* private mode */ }

let panelOpen = matchMedia('(min-width: 761px)').matches;
function applyPanel() {
  panel.classList.toggle('is-collapsed', !panelOpen);
  document.body.classList.toggle('panel-open', panelOpen);
  panelBody.hidden = !panelOpen;
  panelArrow.textContent = panelOpen ? '▾' : '▸';
  panelHandle.setAttribute('aria-expanded', String(panelOpen));
}
panelHandle.addEventListener('click', () => {
  panelOpen = !panelOpen;
  applyPanel();
});
applyPanel();

$('lessonBtn').addEventListener('click', () => {
  $('lessonBody').hidden = !$('lessonBody').hidden;
  $('lessonArrow').textContent = $('lessonBody').hidden ? '▸' : '▾';
});

function persist() {
  try { localStorage.setItem(STORE_KEY, serializeLab(lab)); } catch { /* private mode */ }
}

function welcomeDismissed() {
  try { return sessionStorage.getItem(WELCOME_KEY) === '1'; } catch { return false; }
}

function setWelcome(open) {
  $('welcome').hidden = !open;
  document.body.classList.toggle('welcome-on', open);
}

function dismissWelcome() {
  try { sessionStorage.setItem(WELCOME_KEY, '1'); } catch { /* private mode */ }
  setWelcome(false);
}

function syncWelcome() {
  setWelcome(!welcomeDismissed() && !lab.sample);
}

function paintDistrictCopy() {
  for (const id of DISTRICT_IDS) {
    const node = document.querySelector(`[data-district="${id}"]`);
    if (!node) continue;
    node.textContent = t(DISTRICT_I18N[id]).replace('{mean}', String(DISTRICT_MEANS[id]));
  }
}

function placeDistrictLabels(points) {
  const panelRect = $('panel').getBoundingClientRect();
  const hudRect = $('hud').getBoundingClientRect();
  const mobile = innerWidth <= 760;
  const minX = 18;
  const maxX = mobile ? innerWidth - 18 : Math.max(minX + 40, panelRect.left - 12);
  const minY = Math.max(18, hudRect.bottom + 6);
  const maxY = mobile ? Math.max(minY + 20, panelRect.top - 8) : innerHeight - 20;
  for (const point of points) {
    const node = document.querySelector(`[data-district="${point.id}"]`);
    if (!node) continue;
    if (point.behind) {
      node.classList.remove('is-on');
      continue;
    }
    const x = Math.min(maxX, Math.max(minX, point.x));
    const y = Math.min(maxY, Math.max(minY, point.y));
    node.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) translate(-50%, -30%)`;
    node.classList.add('is-on');
  }
}

function fmtMin(value) {
  if (value == null || !Number.isFinite(value)) return t('dash');
  return `${value.toFixed(1)} min`;
}

function methodLabel(method) {
  return t(method);
}

function fmtSigned(value) {
  if (value == null || !Number.isFinite(value)) return t('dash');
  const abs = Math.abs(value).toFixed(1);
  return `${value < 0 ? '−' : value > 0 ? '+' : ''}${abs} min`;
}

function renderErrorBar(view) {
  const svg = $('errorBar');
  if (view.mean == null || view.lo == null || view.hi == null) {
    svg.setAttribute('hidden', '');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '';
    return;
  }
  svg.removeAttribute('hidden');
  svg.setAttribute('aria-hidden', 'false');
  const min = 0;
  const max = 60;
  const xOf = (value) => 8 + ((value - min) / (max - min)) * 104;
  const ink = cssVar('--ink') || '#2b2440';
  const x = xOf(view.mean);
  const lo = xOf(view.lo);
  const hi = xOf(view.hi);
  const mu = view.censusMean == null ? '' : `<line x1="${xOf(view.censusMean)}" x2="${xOf(view.censusMean)}" y1="2" y2="14" stroke="${ink}" stroke-width="2" stroke-dasharray="2 2" />`;
  svg.innerHTML = `${mu}<line x1="${lo}" x2="${hi}" y1="8" y2="8" stroke="${ink}" stroke-width="3" />`
    + `<line x1="${lo}" x2="${lo}" y1="4" y2="12" stroke="${ink}" stroke-width="2" />`
    + `<line x1="${hi}" x2="${hi}" y1="4" y2="12" stroke="${ink}" stroke-width="2" />`
    + `<circle cx="${x}" cy="8" r="3.2" fill="${METHOD_COLOR[lab.method] || ink}" stroke="${ink}" stroke-width="1" />`;
}

function renderChart(current) {
  const w = 280;
  const h = 148;
  const padL = 22;
  const padR = 10;
  const padT = 10;
  const padB = 24;
  const min = 0;
  const max = 60;
  const xOf = (value) => padL + ((value - min) / (max - min)) * (w - padL - padR);
  const ink = cssVar('--ink') || '#2b2440';
  const faint = cssVar('--ink-faint') || '#a49cb8';
  const series = [];
  for (const method of ['simple', 'stratified', 'cluster', 'convenience']) {
    const means = current.distributions?.[method]?.means;
    if (means?.length) series.push({ method, means });
  }
  if (!series.length && current.batch?.means?.length) {
    series.push({ method: current.batch.method, means: current.batch.means });
  }
  if (!series.length && current.trials.length) {
    const byMethod = {};
    for (const trial of current.trials) {
      (byMethod[trial.method] ??= []).push(trial.mean);
    }
    for (const [method, means] of Object.entries(byMethod)) series.push({ method, means });
  }

  const axis = [0, 12, 24, 30, 36, 48, 60].map((value) => {
    const x = xOf(value);
    return `<line x1="${x}" x2="${x}" y1="${padT}" y2="${h - padB}" stroke="${faint}" stroke-width="1" />`
      + `<text x="${x}" y="${h - 8}" text-anchor="middle" font-size="10" fill="${faint}">${value}</text>`;
  }).join('');
  const census = current.census
    ? `<line x1="${xOf(current.census.mean)}" x2="${xOf(current.census.mean)}" y1="${padT}" y2="${h - padB}" stroke="${ink}" stroke-width="2" stroke-dasharray="4 3" />`
    : '';

  const bins = 30;
  const binW = (w - padL - padR) / bins;
  const counts = {};
  let maxCount = 1;
  for (const { method, means } of series) {
    counts[method] = Array(bins).fill(0);
    for (const mean of means) {
      const index = Math.min(bins - 1, Math.max(0, Math.floor((mean - min) / (max - min) * bins)));
      counts[method][index] += 1;
      maxCount = Math.max(maxCount, counts[method][index]);
    }
  }
  const dots = [];
  for (const { method, means } of series) {
    const color = METHOD_COLOR[method] || ink;
    const stacked = Array(bins).fill(0);
    for (const mean of means) {
      const index = Math.min(bins - 1, Math.max(0, Math.floor((mean - min) / (max - min) * bins)));
      stacked[index] += 1;
      const x = padL + (index + 0.5) * binW;
      const y = h - padB - stacked[index] * Math.min(4.2, (h - padT - padB - 4) / Math.max(8, maxCount));
      dots.push(`<circle class="dot" data-method="${method}" cx="${x}" cy="${y}" r="2.4" fill="${color}" stroke="${ink}" stroke-width="0.6" />`);
    }
  }
  $('meanChart').innerHTML = `<svg viewBox="0 0 ${w} ${h}" role="img">${axis}${census}${dots.join('')}</svg>`;
  $('chartLegend').textContent = series.map(({ method, means }) => `${methodLabel(method)} k=${means.length}`).join(' · ');
}

function paint() {
  const view = snapshot(lab);
  $('methodVal').textContent = methodLabel(lab.method);
  $('nVal').textContent = String(lab.n);
  $('nPanelVal').textContent = String(lab.n);
  $('nRange').value = String(lab.n);
  $('meanVal').textContent = fmtMin(view.mean);
  $('sVal').textContent = fmtMin(view.sd);
  $('seVal').textContent = fmtMin(view.se);
  $('intervalVal').textContent = view.lo == null ? t('dash') : `${view.lo.toFixed(1)}–${view.hi.toFixed(1)}`;
  renderErrorBar(view);
  for (const button of document.querySelectorAll('[data-method]')) {
    button.setAttribute('aria-pressed', String(button.dataset.method === lab.method));
  }
  $('methodSimple').textContent = t('simple');
  $('methodStratified').textContent = t('stratified');
  $('methodCluster').textContent = t('cluster');
  $('methodConvenience').textContent = t('convenience');

  $('trialRows').innerHTML = lab.trials.map((trial) => (
    `<tr><td>${methodLabel(trial.method)}</td><td>${trial.n}</td><td>${trial.mean.toFixed(1)} min</td></tr>`
  )).join('');
  $('completeCard').hidden = lab.phase !== 'complete';
  if (lab.phase === 'complete') $('conclusionStatus').textContent = t('complete');

  const censusOn = Boolean(lab.census);
  $('censusCard').hidden = !censusOn;
  if (censusOn) {
    $('censusNVal').textContent = String(view.censusN);
    $('muVal').textContent = fmtMin(view.censusMean);
    $('sigmaVal').textContent = fmtMin(view.censusSd);
    $('biasVal').textContent = fmtSigned(view.biasTheoretical);
    $('biasNote').textContent = t('biasLine').replace('{bias}', fmtSigned(view.biasTheoretical));
    if (view.biasMonteCarlo != null) {
      $('biasNote').textContent += ` ${t('mcBiasLine').replace('{bias}', fmtSigned(view.biasMonteCarlo))}`;
    }
    $('deviationNote').hidden = view.deviationFromMu == null;
    if (view.deviationFromMu != null) {
      $('deviationNote').textContent = t('thisDraw').replace('{err}', fmtSigned(view.deviationFromMu));
    }
  }

  const sampled = (lab.sample?.ids ?? []).map((id) => lab.population.find((person) => person.id === id)).filter(Boolean);
  if (sampled.length) {
    const xs = sampled.map((person) => person.x);
    const zs = sampled.map((person) => person.z);
    document.body.dataset.sampleSpread = String(Math.max(
      Math.max(...xs) - Math.min(...xs),
      Math.max(...zs) - Math.min(...zs),
    ));
  } else {
    delete document.body.dataset.sampleSpread;
  }
  document.body.dataset.method = lab.method;
  document.body.dataset.survey = lab.method === 'convenience' && lab.sample ? 'lit' : '';
  $('surveyPoint').classList.toggle('is-lit', lab.method === 'convenience' && Boolean(lab.sample));

  renderChart(lab);
  paintDistrictCopy();
  scene?.setLab(lab);
  scene?.setLang?.(document.documentElement.lang.startsWith('zh') ? 'zh' : 'en');
}

function renderChrome() {
  document.title = t('doc');
  langBtn.textContent = document.documentElement.lang.startsWith('zh') ? 'EN' : '中';
  themeBtn.textContent = document.documentElement.dataset.theme === 'light' ? '🌙' : '☀️';
  themeBtn.setAttribute('aria-label', t('theme'));
  musicBtn.textContent = audio.musicOn ? '♫' : '♪';
  musicBtn.setAttribute('aria-pressed', String(audio.musicOn));
  musicBtn.setAttribute('aria-label', t(audio.musicOn ? 'musicOn' : 'musicOff'));
  soundBtn.textContent = audio.sfxOn ? '🔊' : '🔇';
  soundBtn.setAttribute('aria-pressed', String(audio.sfxOn));
  soundBtn.setAttribute('aria-label', t(audio.sfxOn ? 'sfxOn' : 'sfxOff'));
  $('nRange').setAttribute('aria-label', t('labN'));
  paint();
}

function applyResult(result, { okMessage } = {}) {
  const wasComplete = lab.phase === 'complete';
  lab = result.lab;
  persist();
  if (result.ok) {
    if (okMessage) {
      feedback.textContent = t(okMessage);
      coach.textContent = t(okMessage);
    }
  } else {
    const key = REASON_KEY[result.reason];
    const message = key ? t(key) : t('feedbackIdle');
    feedback.textContent = message;
    coach.textContent = message;
    audio.error();
  }
  paint();
  if (lab.phase === 'complete') {
    window.cool?.complete?.();
    if (!wasComplete) audio.success();
  }
}

async function unlockAll() {
  if (unlocked) return;
  unlocked = true;
  await audio.unlock();
  window.cool?.stage?.('observe');
}

for (const button of document.querySelectorAll('[data-method]')) {
  button.addEventListener('click', async () => {
    await unlockAll();
    audio.click();
    const result = setMethod(lab, button.dataset.method);
    if (result.ok) window.cool?.track?.('method', { method: result.lab.method });
    applyResult(result);
  });
}

$('nRange').addEventListener('input', async () => {
  await unlockAll();
  applyResult(setN(lab, Number($('nRange').value)));
});

$('welcomeSkip').addEventListener('click', async () => {
  await unlockAll();
  audio.click();
  dismissWelcome();
});

$('drawBtn').addEventListener('click', async () => {
  await unlockAll();
  const result = drawSample(lab);
  if (result.ok) {
    audio.sample();
    dismissWelcome();
    window.cool?.track?.('draw', { method: result.lab.method, n: result.lab.n, mean: result.lab.sample.mean });
  }
  applyResult(result, { okMessage: 'drawn' });
});

$('recordBtn').addEventListener('click', async () => {
  await unlockAll();
  const result = recordTrial(lab);
  if (result.ok) {
    audio.record();
    window.cool?.track?.('record', { method: result.lab.trials.at(-1).method, mean: result.lab.trials.at(-1).mean });
  }
  applyResult(result, { okMessage: 'recorded' });
});

function runRepeat(k, okMessage) {
  const result = k === 'compare' ? compareMethods(lab, 50) : runBatch(lab, k);
  if (result.ok) {
    audio.record();
    window.cool?.track?.('batch', { method: result.lab.method, k: result.lab.batch?.k, compare: k === 'compare' });
  }
  applyResult(result, { okMessage });
}

$('batch50Btn').addEventListener('click', async () => {
  await unlockAll();
  runRepeat(50, 'batched');
});
$('batch100Btn').addEventListener('click', async () => {
  await unlockAll();
  runRepeat(100, 'batched');
});
$('compareBtn').addEventListener('click', async () => {
  await unlockAll();
  runRepeat('compare', 'compared');
});

$('censusBtn').addEventListener('click', async () => {
  await unlockAll();
  const result = runCensus(lab);
  if (result.ok) {
    audio.census();
    window.cool?.track?.('census', { mean: result.lab.census.mean });
  }
  applyResult(result, { okMessage: 'censusTip' });
});

$('resetBtn').addEventListener('click', async () => {
  await unlockAll();
  audio.click();
  window.cool?.track?.('reset');
  applyResult(resetLab(lab));
  feedback.textContent = t('feedbackIdle');
  coach.textContent = t('tip0');
  try {
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem('kidslab.progress.statistics-sampling-lab');
  } catch { /* private mode */ }
  paint();
});

musicBtn.addEventListener('click', async () => {
  await unlockAll();
  audio.setMusic(!audio.musicOn);
  renderChrome();
});
soundBtn.addEventListener('click', async () => {
  await unlockAll();
  audio.setSfx(!audio.sfxOn);
  renderChrome();
});
langBtn.addEventListener('click', () => window.cool.preferences.toggleLang());
themeBtn.addEventListener('click', () => window.cool.preferences.toggleTheme());

try {
  scene = createLabScene({
    canvas: $('scene'),
    cssVar,
    onFirstInteract: unlockAll,
    onDistricts: placeDistrictLabels,
  });
} catch {
  scene = null;
}
if (!scene) {
  $('nogl').hidden = false;
  $('scene').hidden = true;
}

addEventListener('themechange', () => {
  scene?.applyTheme();
  paint();
});

window.cool.bindI18n(I18N, {
  onChange({ t: translate }) {
    t = translate;
    renderChrome();
  },
});
syncWelcome();
renderChrome();
