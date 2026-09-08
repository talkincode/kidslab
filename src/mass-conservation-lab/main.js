import { createLab, recordTrial } from './mass-model.js';
import { createLabAudio } from './audio.js';
import { createMassScene } from './scene3d.js';

const I18N = {
  zh: {
    back: '返回平台', title: '质量守恒实验室', nogl: '浏览器暂不支持 WebGL，请用右侧读数继续观察。',
    before: '反应前', after: '反应后', escaped: '逸出 CO₂',
    coachTitle: '先看天平，再对照两杯', benchReady: '选敞口或密闭罩，倒入醋，看气泡和读数一起变。',
    run: '倒入醋，开始称量', hint: '给我一点提示', reset: '重新实验', panelTitle: '观测台',
    vesselTitle: '装置', open: '敞口烧杯', sealed: '密闭罩',
    vesselHint: '先敞口看气泡飞走，再给第二杯盖上罩。',
    notebookTitle: '对照记录', tableVessel: '装置', tableBefore: '前 / g', tableAfter: '后 / g', tableGas: '逸出',
    empty: '先做第一杯。', complete: '密闭罩把“跑掉的”质量找回来了。',
    rightConclusion: '敞口变轻是因为 CO₂ 离开了天平；密闭系统里反应前后总质量不变。',
    hintText: '天平只称到放在它上面的东西。看气泡有没有离开系统。',
    modelNote: '教学示意：气泡代表二氧化碳。真实实验请在教师指导下进行。',
    footTip: '拖空白转视角 · 滚轮缩放 · 倒醋看读数',
    soundOn: '关闭声音', soundOff: '打开声音',
    duplicate: '这杯已经记录过了。换另一个装置来做对照。',
    openDone: '敞口杯变轻了：4.0 g 的气泡飞出了天平。把密闭罩也做一次。',
    sealedDone: '密闭罩还是 100.0 g：气泡没有离开称量系统。',
    resetDone: '实验已清空。再倒一次，对照两杯读数。',
    reacting: '正在起泡…',
  },
  en: {
    back: 'Back to platform', title: 'Mass Conservation Lab', nogl: 'WebGL is unavailable. Keep going with the readings.',
    before: 'Before', after: 'After', escaped: 'Escaped CO₂',
    coachTitle: 'Watch the balance, then compare both cups', benchReady: 'Choose open or sealed, pour vinegar, and watch bubbles with the reading.',
    run: 'Pour vinegar and weigh', hint: 'Give me a hint', reset: 'Restart experiment', panelTitle: 'Observation deck',
    vesselTitle: 'Vessel', open: 'Open beaker', sealed: 'Sealed dome',
    vesselHint: 'Start open so gas can leave, then cover the second cup.',
    notebookTitle: 'Comparison log', tableVessel: 'Vessel', tableBefore: 'Before / g', tableAfter: 'After / g', tableGas: 'Escaped',
    empty: 'Run the first cup first.', complete: 'The sealed dome found the “escaped” mass.',
    rightConclusion: 'The open cup gets lighter because CO₂ leaves the balance. In a sealed system, total mass stays the same.',
    hintText: 'A balance only weighs what sits on it. Watch whether bubbles leave the system.',
    modelNote: 'Teaching model: bubbles stand for carbon dioxide. Do real experiments with a teacher.',
    footTip: 'Drag empty space to orbit · scroll to zoom · pour to read',
    soundOn: 'Mute sound', soundOff: 'Turn sound on',
    duplicate: 'This cup is already logged. Use the other vessel.',
    openDone: 'The open cup got lighter: 4.0 g of bubbles left the balance. Try the sealed dome.',
    sealedDone: 'The sealed dome is still 100.0 g: the bubbles stayed in the weighed system.',
    resetDone: 'Experiment cleared. Pour again and compare both cups.',
    reacting: 'Fizzing…',
  },
};

const $ = (s) => document.querySelector(s);
const STORE = 'kidslab.mass-conservation-lab';
const SOUND = 'kidslab.mass-conservation-lab.sound';
const els = {
  feedback: $('#feedback'),
  scale: $('#scaleReading'),
  after: $('#afterReading'),
  escaped: $('#escapedReading'),
  rows: $('#trialRows'),
  count: $('#trialCount'),
  complete: $('#completeCard'),
  hint: $('#hintText'),
  sound: $('#soundBtn'),
  panel: $('#panel'),
  panelBody: $('#panelBody'),
  panelHandle: $('#panelHandle'),
  panelArrow: $('#panelArrow'),
};

let lang = window.cool?.preferences?.lang || 'zh';
let lab = load() || createLab();
let selected = 'open';
let muted = localStorage.getItem(SOUND) === 'off';
let running = false;
let panelOpen = true;
let notice = 'benchReady';
const audio = createLabAudio({ bgmUrl: new URL('./audio/bgm-process-flow-01.ogg', import.meta.url), muted });
const lab3d = createMassScene($('#scene'));
if (!lab3d) $('#nogl')?.removeAttribute('hidden');
document.addEventListener('pointerdown', () => { if (!muted) audio.unlock(); }, { once: true });

const t = (key) => I18N[lang][key] || key;
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    return saved?.trials ? saved : null;
  } catch {
    return null;
  }
}
function save() {
  try { localStorage.setItem(STORE, JSON.stringify(lab)); } catch { /* privacy mode */ }
}
function format(v) { return `${Number(v).toFixed(1)} g`; }
function lastTrial() { return lab.trials.at(-1) || null; }

function applyPanel() {
  els.panel.classList.toggle('is-collapsed', !panelOpen);
  els.panelBody.hidden = !panelOpen;
  els.panelHandle.setAttribute('aria-expanded', String(panelOpen));
  els.panelArrow.textContent = panelOpen ? '▾' : '▸';
}

function render() {
  document.title = `⚗️ ${t('title')} · KidsLab`;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-t]').forEach((node) => { node.textContent = t(node.dataset.t); });
  document.querySelectorAll('[data-vessel]').forEach((button) => {
    button.classList.toggle('is-on', selected === button.dataset.vessel);
  });
  lab3d?.setVessel(selected);
  els.sound.textContent = muted ? '🔇' : '🔊';
  els.sound.setAttribute('aria-pressed', String(muted));
  els.sound.setAttribute('aria-label', t(muted ? 'soundOff' : 'soundOn'));
  $('#langBtn').textContent = lang === 'zh' ? 'EN' : '中';
  $('#themeBtn').textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
  els.count.textContent = `${lab.trials.length} / 2`;
  els.rows.innerHTML = lab.trials.length
    ? lab.trials.map((row) => `<tr><td>${t(row.vessel)}</td><td>${format(row.massBeforeG)}</td><td>${format(row.massAfterG)}</td><td>${row.escapedGasG ? format(row.escapedGasG) : '—'}</td></tr>`).join('')
    : `<tr><td colspan="4">${t('empty')}</td></tr>`;
  const trial = lastTrial();
  els.scale.textContent = trial ? Number(trial.massAfterG).toFixed(1) : '100.0';
  els.after.textContent = trial ? format(trial.massAfterG) : '—';
  els.escaped.textContent = trial ? format(trial.escapedGasG) : '—';
  $('#runBtn').disabled = running;
  const done = lab.trials.some((row) => row.vessel === 'open') && lab.trials.some((row) => row.vessel === 'sealed');
  els.complete.hidden = !done;
  $('#coachTitle').textContent = t(done ? 'complete' : 'coachTitle');
  els.feedback.textContent = t(done ? 'rightConclusion' : notice);
  if (els.complete.querySelector('#conclusionStatus')) {
    els.complete.querySelector('#conclusionStatus').textContent = t('rightConclusion');
  }
  if (done && lab.phase !== 'complete') {
    lab = { ...lab, phase: 'complete', conclusion: 'mass-conserved' };
    save();
    window.cool?.stage('level2');
    window.cool?.complete?.();
    window.cool?.track('compare-systems');
    audio.beep('win');
  }
}

function run() {
  if (running) return;
  const result = recordTrial(lab, selected);
  if (!result.ok) {
    notice = result.reason === 'duplicate-trial' ? 'duplicate' : 'benchReady';
    els.feedback.textContent = t(notice);
    audio.beep('bad');
    return;
  }
  running = true;
  const trial = result.lab.trials.at(-1);
  $('#coachTitle').textContent = t('reacting');
  lab3d?.playReaction({ massAfterG: trial.massAfterG });
  setTimeout(() => {
    lab = result.lab;
    running = false;
    save();
    notice = selected === 'open' ? 'openDone' : 'sealedDone';
    els.feedback.textContent = t(notice);
    audio.beep('good');
    render();
  }, 560);
}

els.panelHandle.addEventListener('click', () => { panelOpen = !panelOpen; applyPanel(); });
document.querySelectorAll('[data-vessel]').forEach((button) => {
  button.addEventListener('click', () => {
    selected = button.dataset.vessel;
    lab3d?.setMass(100);
    lab3d?.setVessel(selected);
    audio.beep('tap');
    render();
  });
});
$('#runBtn').addEventListener('click', run);
$('#resetBtn').addEventListener('click', () => {
  lab = createLab();
  selected = 'open';
  running = false;
  try {
    localStorage.removeItem(STORE);
    localStorage.removeItem('kidslab.progress.mass-conservation-lab');
  } catch { /* privacy mode */ }
  lab3d?.setMass(100);
  lab3d?.setVessel('open');
  notice = 'resetDone';
  els.feedback.textContent = t(notice);
  audio.beep('tap');
  render();
});
$('#hintBtn').addEventListener('click', () => {
  const show = els.hint.hidden;
  els.hint.hidden = !show;
  $('#hintBtn').setAttribute('aria-expanded', String(show));
});
els.sound.addEventListener('click', () => {
  muted = !muted;
  audio.setMuted(muted);
  try { localStorage.setItem(SOUND, muted ? 'off' : 'on'); } catch { /* privacy mode */ }
  render();
});
$('#langBtn').addEventListener('click', () => window.cool?.preferences?.setLang?.(lang === 'zh' ? 'en' : 'zh'));
$('#themeBtn').addEventListener('click', () => window.cool?.preferences?.toggleTheme?.());
addEventListener('langchange', (event) => {
  lang = event.detail?.lang || window.cool?.preferences?.lang || lang;
  render();
});
addEventListener('themechange', () => { lab3d?.applyTheme?.(); render(); });
applyPanel();
render();
