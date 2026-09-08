import { createAudio } from './audio.js';
import {
  createSim,
  dropAgain,
  energies,
  patchSetup,
  predictedPeakHeight,
  recordObservation,
  setPaused,
  snapshot,
  stepSim,
} from './lab-model.js';
import { createLabScene } from './scene.js';

const I18N = {
  zh: {
    doc: '✏️ 课件名 · KidsLab',
    back: '返回平台',
    title: '✏️ 课件名',
    nogl: '浏览器暂时跑不了 3D 实验室，换一个新一点的浏览器再来观测吧。',
    hudHeight: '高度',
    hudSpeed: '速率',
    hudEnergy: '机械能',
    tip0: '拖空白转视角 · 点「再落一次」开始观测',
    panelTitle: '参数面板',
    btnDrop: '再落一次',
    btnPause: '暂停',
    btnResume: '继续',
    btnRecord: '记下这一刻',
    labG: '重力 g',
    labE: '回弹 e',
    labH: '释放高度',
    labM: '质量',
    logTitle: '观测记录',
    logEmpty: '还没有记录。调参数、看弹跳，再按「记下这一刻」。',
    lessonTitle: '小课堂：为什么越弹越矮',
    lessonText: 'e 是回弹快慢的比例。e=1 会回到原高度；e 越小，动能在落地时丢得越多，最高点大约是 h×e×e。',
    footTip: '拖空白转视角 · 滚轮缩放 · 右侧调参数，左侧看变化',
    musicOn: '关闭背景音乐',
    musicOff: '打开背景音乐',
    sfxOn: '关闭音效',
    sfxOff: '打开音效',
    theme: '切换主题',
    predict: (h) => `下一次最高点约 ${h.toFixed(2)} m`,
    logLine: (item) => `${item.y.toFixed(2)} m · ${Math.abs(item.v).toFixed(2)} m/s`,
    bounceTip: '看！落地之后它还能爬多高？',
    restTip: '它停住了。把 e 调大，再落一次。',
  },
  en: {
    doc: '✏️ Course Title · KidsLab',
    back: 'Back to platform',
    title: '✏️ Course Title',
    nogl: 'WebGL is unavailable, so the 3D lab cannot start. Try a newer browser.',
    hudHeight: 'Height',
    hudSpeed: 'Speed',
    hudEnergy: 'Energy',
    tip0: 'Drag empty space to orbit · tap Drop to observe',
    panelTitle: 'Controls',
    btnDrop: 'Drop again',
    btnPause: 'Pause',
    btnResume: 'Resume',
    btnRecord: 'Record this',
    labG: 'Gravity g',
    labE: 'Bounce e',
    labH: 'Drop height',
    labM: 'Mass',
    logTitle: 'Lab notes',
    logEmpty: 'No notes yet. Tune, watch, then record a moment.',
    lessonTitle: 'Why does it bounce lower?',
    lessonText: 'e is the rebound speed ratio. e=1 returns to the same height; smaller e dumps kinetic energy, so the peak is about h×e×e.',
    footTip: 'Drag to orbit · scroll to zoom · tune on the right, watch on the left',
    musicOn: 'Mute music',
    musicOff: 'Unmute music',
    sfxOn: 'Mute sound effects',
    sfxOff: 'Unmute sound effects',
    theme: 'Toggle theme',
    predict: (h) => `Next peak ≈ ${h.toFixed(2)} m`,
    logLine: (item) => `${item.y.toFixed(2)} m · ${Math.abs(item.v).toFixed(2)} m/s`,
    bounceTip: 'Watch how high it climbs after the bounce.',
    restTip: 'It stopped. Raise e, then drop again.',
  },
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
const pauseBtn = $('pauseBtn');
const logList = $('logList');
const coach = $('coach');

const audio = createAudio('kidslab.my-course');
let sim = createSim();
let history = [];
let lab = null;
let unlocked = false;
let sawBounce = false;
let last = performance.now();

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

function fmt(value, digits, unit) {
  return `${value.toFixed(digits)} ${unit}`;
}

function paint() {
  const snap = snapshot(sim);
  const energy = energies(sim);
  $('heightVal').textContent = fmt(snap.y, 2, 'm');
  $('speedVal').textContent = fmt(Math.abs(snap.v), 2, 'm/s');
  $('energyVal').textContent = fmt(energy.mechanical, 2, 'J');
  $('gVal').textContent = sim.g.toFixed(1);
  $('eVal').textContent = sim.restitution.toFixed(2);
  $('hVal').textContent = fmt(sim.dropHeight, 2, 'm');
  $('mVal').textContent = fmt(sim.mass, 2, 'kg');
  $('predictNote').hidden = !sawBounce;
  if (sawBounce) $('predictNote').textContent = t('predict', predictedPeakHeight(sim));
  pauseBtn.textContent = t(sim.paused ? 'btnResume' : 'btnPause');
  lab?.setSim(sim);

  if (!history.length) {
    logList.innerHTML = `<li>${t('logEmpty')}</li>`;
  } else {
    logList.innerHTML = history.slice(-4).reverse().map((item) => `<li>${t('logLine', item)}</li>`).join('');
  }
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
  $('gRange').setAttribute('aria-label', t('labG'));
  $('eRange').setAttribute('aria-label', t('labE'));
  $('hRange').setAttribute('aria-label', t('labH'));
  $('mRange').setAttribute('aria-label', t('labM'));
  paint();
}

async function unlockAll() {
  if (unlocked) return;
  unlocked = true;
  await audio.unlock();
  window.cool?.stage?.('observe');
}

function bindRange(id, key, reset) {
  const el = $(id);
  el.addEventListener('input', () => {
    const value = Number(el.value);
    const result = patchSetup(sim, { [key]: value }, { reset });
    if (result.ok) sim = result.sim;
    audio.click();
    paint();
  });
}
bindRange('gRange', 'g', false);
bindRange('eRange', 'restitution', false);
bindRange('hRange', 'dropHeight', false);
bindRange('mRange', 'mass', false);

$('dropBtn').addEventListener('click', async () => {
  await unlockAll();
  sim = dropAgain(sim).sim;
  audio.drop();
  coach.textContent = t('tip0');
  paint();
});

pauseBtn.addEventListener('click', async () => {
  await unlockAll();
  sim = setPaused(sim, !sim.paused).sim;
  paint();
});

$('recordBtn').addEventListener('click', async () => {
  await unlockAll();
  const result = recordObservation(history, sim);
  if (!result.ok) return;
  history = result.history;
  audio.record();
  window.cool?.track?.('record', { y: sim.y, e: sim.restitution });
  if (history.length === 1) window.cool?.complete?.();
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
  lab = createLabScene({
    canvas: $('scene'),
    cssVar,
    onFirstInteract: unlockAll,
  });
} catch {
  lab = null;
}
if (!lab) {
  $('nogl').hidden = false;
  $('scene').hidden = true;
}

addEventListener('themechange', () => lab?.applyTheme());

function tick(now) {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  const result = stepSim(sim, dt);
  if (result.ok) {
    sim = result.sim;
    for (const event of result.events) {
      if (event.type === 'bounce') {
        audio.bounce(event.speed);
        lab?.flash();
        coach.textContent = t('bounceTip');
        if (!sawBounce) {
          sawBounce = true;
          window.cool?.track?.('first-bounce');
        }
      }
      if (event.type === 'rest') coach.textContent = t('restTip');
    }
    lab?.setSim(sim);
    if ((now / 80 | 0) !== ((now - dt * 1000) / 80 | 0)) {
      $('heightVal').textContent = fmt(sim.y, 2, 'm');
      $('speedVal').textContent = fmt(Math.abs(sim.v), 2, 'm/s');
      $('energyVal').textContent = fmt(energies(sim).mechanical, 2, 'J');
    }
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

window.cool.bindI18n(I18N, {
  onChange({ t: translate }) {
    t = translate;
    renderChrome();
  },
});
