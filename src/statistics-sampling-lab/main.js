import { createAudio } from './audio.js';
import {
  createLab,
  drawSample,
  parseLab,
  recordTrial,
  resetLab,
  runCensus,
  serializeLab,
  setMethod,
  setN,
  snapshot,
} from './lab-model.js';
import { createLabScene } from './scene.js';

const STORE_KEY = 'kidslab.statistics-sampling-lab';
const I18N = {
  zh: {
    doc: '📊 抽样统计实验室 · KidsLab',
    back: '返回平台',
    title: '抽样统计实验室',
    nogl: '浏览器暂时跑不了 3D 实验室，换一个新一点的浏览器再来观测吧。',
    hudMethod: '方法',
    hudN: '人数 n',
    hudMean: '样本均数',
    hudSe: '标准误',
    tip0: '先抽一份「便利样本」，看均值会不会总往一边歪',
    panelTitle: '抽样面板',
    btnDraw: '抽这一份',
    btnRecord: '记下这次',
    btnCensus: '全市普查',
    btnReset: '重新实验',
    feedbackIdle: '换方法再抽几份，把点点记到表里。',
    labMethod: '抽样方法',
    labN: '样本人数',
    chartTitle: '样本均数图',
    logTitle: '观测记录',
    colMethod: '方法',
    colN: 'n',
    colMean: '均数',
    lessonTitle: '小课堂：为什么便利样本看起来很稳？',
    lessonText: '市中心的人通勤都差不多，所以便利样本的点挤成一团。挤得紧只说明波动小，不说明它打中全市均值。分层会从四个街区都抓人，均值才会靠近普查线。',
    footTip: '拖空白转视角 · 右侧换抽样方法，左侧看谁被点亮',
    musicOn: '关闭背景音乐',
    musicOff: '打开背景音乐',
    sfxOn: '关闭音效',
    sfxOff: '打开音效',
    theme: '切换主题',
    simple: '简单随机',
    stratified: '分层',
    cluster: '整群',
    convenience: '便利',
    complete: '便利抽样挤在市中心的短通勤里；分层抽样才靠近全市 30 分钟。',
    noSample: '还没抽样，先抽一份再记。',
    duplicate: '这一份已经记过了，再抽一份吧。',
    outOfRange: '人数要在 8 到 80 之间，而且是 4 的倍数。',
    notStratifiable: '分层需要人数是 4 的倍数，才能四个街区平分。',
    invalidMethod: '这种抽法这台仪器没有。',
    tooLarge: '这个街区没有那么多人。',
    recorded: '记下了。换一种抽法再比一比。',
    drawn: '点亮的人进样本了。看看均数落在哪。',
    censusTip: '普查线是 30 分钟。便利样本还在市中心附近打转吗？',
    dash: '—',
  },
  en: {
    doc: '📊 Sampling Statistics Lab · KidsLab',
    back: 'Back to platform',
    title: 'Sampling Statistics Lab',
    nogl: 'WebGL is unavailable, so the 3D lab cannot start. Try a newer browser.',
    hudMethod: 'Method',
    hudN: 'n',
    hudMean: 'Sample mean',
    hudSe: 'Std. error',
    tip0: 'Draw a convenience sample and watch the mean lean the same way',
    panelTitle: 'Sampling',
    btnDraw: 'Draw sample',
    btnRecord: 'Record this',
    btnCensus: 'City census',
    btnReset: 'Start over',
    feedbackIdle: 'Switch methods, draw again, and plot the dots.',
    labMethod: 'Sampling method',
    labN: 'Sample size',
    chartTitle: 'Sample means',
    logTitle: 'Lab notes',
    colMethod: 'Method',
    colN: 'n',
    colMean: 'Mean',
    lessonTitle: 'Why does convenience look so stable?',
    lessonText: 'Downtown commutes are alike, so convenience dots huddle. A tight cluster is low spread, not a hit on the city mean. Stratified draws from every district, so the mean moves toward the census line.',
    footTip: 'Drag to orbit · change the method on the right, watch who lights up',
    musicOn: 'Mute music',
    musicOff: 'Unmute music',
    sfxOn: 'Mute sound effects',
    sfxOff: 'Unmute sound effects',
    theme: 'Toggle theme',
    simple: 'Simple random',
    stratified: 'Stratified',
    cluster: 'Cluster',
    convenience: 'Convenience',
    complete: 'Convenience hugs the short downtown commute; stratified sits near the city-wide 30 minutes.',
    noSample: 'Nothing sampled yet — draw a sample first.',
    duplicate: 'That draw is already in the notebook.',
    outOfRange: 'n must be between 8 and 80 and a multiple of 4.',
    notStratifiable: 'Stratified draws need n to be a multiple of 4.',
    invalidMethod: 'This bench does not have that method.',
    tooLarge: 'That district does not have that many people.',
    recorded: 'Saved. Switch methods and compare.',
    drawn: 'The lit people are in the sample. Watch the mean.',
    censusTip: 'The census line is 30 minutes. Is convenience still circling downtown?',
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

function fmtMin(value) {
  if (value == null || !Number.isFinite(value)) return t('dash');
  return `${value.toFixed(1)} min`;
}

function methodLabel(method) {
  return t(method);
}

function renderChart(current) {
  const w = 280;
  const h = 120;
  const pad = 18;
  const min = 0;
  const max = 60;
  const yOf = (value) => pad + (1 - (value - min) / (max - min)) * (h - 2 * pad);
  const ink = cssVar('--ink') || '#2b2440';
  const faint = cssVar('--ink-faint') || '#a49cb8';
  const marks = [12, 24, 30, 36, 48].map((value) => {
    const y = yOf(value);
    return `<line x1="${pad}" x2="${w - pad}" y1="${y}" y2="${y}" stroke="${faint}" stroke-width="1" />`
      + `<text x="4" y="${y + 4}" font-size="10" fill="${faint}">${value}</text>`;
  }).join('');
  const census = current.census
    ? `<line x1="${pad}" x2="${w - pad}" y1="${yOf(current.census.mean)}" y2="${yOf(current.census.mean)}" stroke="${ink}" stroke-width="2" stroke-dasharray="5 4" />`
    : '';
  const count = Math.max(current.trials.length, 1);
  const dots = current.trials.map((trial, index) => {
    const x = pad + ((index + 0.5) / count) * (w - 2 * pad);
    const color = METHOD_COLOR[trial.method] || ink;
    return `<circle cx="${x}" cy="${yOf(trial.mean)}" r="6" fill="${color}" stroke="${ink}" stroke-width="1.5" />`;
  }).join('');
  $('meanChart').innerHTML = `<svg viewBox="0 0 ${w} ${h}" role="img">${marks}${census}${dots}</svg>`;
}

function paint() {
  const view = snapshot(lab);
  $('methodVal').textContent = methodLabel(lab.method);
  $('nVal').textContent = String(lab.n);
  $('nPanelVal').textContent = String(lab.n);
  $('nRange').value = String(lab.n);
  $('meanVal').textContent = fmtMin(view.mean);
  $('seVal').textContent = fmtMin(view.se);
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
  renderChart(lab);
  scene?.setLab(lab);
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

$('drawBtn').addEventListener('click', async () => {
  await unlockAll();
  const result = drawSample(lab);
  if (result.ok) {
    audio.sample();
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
renderChrome();
