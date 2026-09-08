import { createAudio } from './audio.js';
import {
  createLab,
  parseLab,
  recordTrial,
  resetLab,
  serializeLab,
  setCoarseUm,
  setFineUm,
  setLight,
  setObjective,
  setSlide,
  snapshotView,
} from './lab-model.js';
import { createLabScene } from './scene.js';

const STORE_KEY = 'kidslab.microscope-cell-lab';
const I18N = {
  zh: {
    doc: '🔬 显微细胞实验室 · KidsLab',
    back: '返回平台',
    title: '显微细胞实验室',
    nogl: '浏览器暂时跑不了 3D 实验室，换一个新一点的浏览器再来观测吧。',
    hudMag: '总放大',
    hudFov: '视野直径',
    hudSharp: '焦点',
    tip0: '先开灯，拧粗准焦，把光斑拧清楚',
    panelTitle: '显微镜面板',
    btnRecord: '记下这一视野',
    btnReset: '重新观察',
    feedbackIdle: '低倍看清再换高倍。高倍只能拧细准焦。',
    labSlide: '装片',
    slideOnion: '洋葱表皮',
    slideCheek: '口腔上皮',
    labObj: '物镜',
    labLight: '照明',
    labCoarse: '粗准焦',
    labFine: '细准焦',
    logTitle: '观测记录',
    colSlide: '装片',
    colMag: '放大',
    colFov: '视野',
    lessonTitle: '小课堂：放大了，为什么看得更少？',
    lessonText: '目镜 10× 不变时，视野直径 = 18 mm ÷ 物镜倍数。4× 能看见 4.50 mm 的圈子，40× 只剩 0.45 mm。高倍焦深很窄，所以只能轻轻拧细准焦。',
    footTip: '拖空白转视角 · 右侧拧螺旋，左侧看目镜',
    musicOn: '关闭背景音乐',
    musicOff: '打开背景音乐',
    sfxOn: '关闭音效',
    sfxOff: '打开音效',
    theme: '切换主题',
    sharpBlur: '模糊',
    sharpClear: '清晰',
    onion: '洋葱',
    cheek: '上皮',
    complete: '换更高倍，视野变小；洋葱有壁，口腔上皮没有。',
    focusFirst: '还是糊的。先用低倍把细胞拧清楚。',
    coarseHigh: '高倍镜只能用细准焦，粗准焦会压碎装片。',
    outOfFocus: '还看不清细胞，先对焦再记。',
    tooDark: '太暗了，把灯拧亮一点。',
    tooBright: '太亮了，把灯拧暗一点。',
    lightUnusable: '光线不合适，调到中间再看。',
    duplicate: '这一组已经记录过了。',
    recorded: '记下了。换个倍数或换张装片再比一比。',
    found: '哇！细胞世界突然清楚了。',
  },
  en: {
    doc: '🔬 Microscope Cell Lab · KidsLab',
    back: 'Back to platform',
    title: 'Microscope Cell Lab',
    nogl: 'WebGL is unavailable, so the 3D lab cannot start. Try a newer browser.',
    hudMag: 'Magnification',
    hudFov: 'Field diameter',
    hudSharp: 'Focus',
    tip0: 'Turn up the lamp, then coarse-focus until the blur snaps sharp',
    panelTitle: 'Microscope',
    btnRecord: 'Record this view',
    btnReset: 'Observe again',
    feedbackIdle: 'Get it sharp on low power first. High power uses fine focus only.',
    labSlide: 'Slide',
    slideOnion: 'Onion skin',
    slideCheek: 'Cheek cell',
    labObj: 'Objective',
    labLight: 'Lamp',
    labCoarse: 'Coarse focus',
    labFine: 'Fine focus',
    logTitle: 'Lab notes',
    colSlide: 'Slide',
    colMag: 'Mag',
    colFov: 'Field',
    lessonTitle: 'Why does zooming in show less?',
    lessonText: 'With a 10× eyepiece, field diameter = 18 mm ÷ objective. 4× shows a 4.50 mm circle; 40× leaves only 0.45 mm. High power is a thin slice, so only the fine knob is safe.',
    footTip: 'Drag to orbit · twist knobs on the right, watch the eyepiece on the left',
    musicOn: 'Mute music',
    musicOff: 'Unmute music',
    sfxOn: 'Mute sound effects',
    sfxOff: 'Unmute sound effects',
    theme: 'Toggle theme',
    sharpBlur: 'Blurry',
    sharpClear: 'Sharp',
    onion: 'onion',
    cheek: 'cheek',
    complete: 'Higher power, smaller field. Onion cells have walls; cheek cells do not.',
    focusFirst: 'Still blurry. Sharp it up on low power first.',
    coarseHigh: 'High power uses fine focus only — coarse focus can crush the slide.',
    outOfFocus: 'Cells are still blurry. Focus, then record.',
    tooDark: 'Too dark. Turn the lamp up.',
    tooBright: 'Too bright. Turn the lamp down.',
    lightUnusable: 'The lamp is outside the usable range.',
    duplicate: 'That combination is already in the table.',
    recorded: 'Saved. Change power or swap the slide to compare.',
    found: 'Whoa — the cell world just snapped into view.',
  },
};

const REASON_KEY = {
  'focus-first': 'focusFirst',
  'coarse-forbidden-on-high-power': 'coarseHigh',
  'out-of-focus': 'outOfFocus',
  'too-dark': 'tooDark',
  'too-bright': 'tooBright',
  'light-unusable': 'lightUnusable',
  'duplicate-trial': 'duplicate',
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
let lab = restore();
let scene = null;
let unlocked = false;
let wasFocused = snapshotView(lab).inFocus;

function restore() {
  try {
    const parsed = parseLab(localStorage.getItem(STORE_KEY));
    if (parsed.ok) return parsed.lab;
  } catch { /* private mode */ }
  return createLab();
}

function persist() {
  try {
    if (lab.trials.length) localStorage.setItem(STORE_KEY, serializeLab(lab));
    else localStorage.removeItem(STORE_KEY);
  } catch { /* private mode */ }
}

let panelOpen = true;
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

function umLabel(value) {
  const sign = value < 0 ? '−' : '';
  return `${sign}${Math.abs(value)} μm`;
}

function paint() {
  const view = snapshotView(lab);
  $('magVal').textContent = `${view.totalMag}×`;
  $('fovVal').textContent = `${view.fieldDiameterMm.toFixed(2)} mm`;
  $('sharpVal').textContent = view.inFocus ? t('sharpClear') : t('sharpBlur');
  $('lightVal').textContent = String(lab.light);
  $('coarseVal').textContent = umLabel(lab.coarseUm);
  $('fineVal').textContent = umLabel(lab.fineUm);
  $('lightRange').value = String(lab.light);
  $('coarseRange').value = String(lab.coarseUm);
  $('fineRange').value = String(lab.fineUm);

  for (const mag of [4, 10, 40]) {
    const btn = $(`obj${mag}`);
    const on = lab.objectiveMag === mag;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
  }
  $('slideOnion').classList.toggle('is-on', lab.slide === 'onion');
  $('slideCheek').classList.toggle('is-on', lab.slide === 'cheek');
  $('slideOnion').setAttribute('aria-pressed', String(lab.slide === 'onion'));
  $('slideCheek').setAttribute('aria-pressed', String(lab.slide === 'cheek'));

  const rows = lab.trials.map((trial) => {
    const name = trial.slide === 'onion' ? t('onion') : t('cheek');
    return `<tr><td>${name}</td><td>${trial.totalMag}×</td><td>${trial.fieldDiameterMm.toFixed(2)} mm</td></tr>`;
  }).join('');
  $('trialRows').innerHTML = rows;
  $('completeCard').hidden = lab.phase !== 'complete';
  if (lab.phase === 'complete') $('conclusionStatus').textContent = t('complete');

  scene?.setView(view);
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
  $('lightRange').setAttribute('aria-label', t('labLight'));
  $('coarseRange').setAttribute('aria-label', t('labCoarse'));
  $('fineRange').setAttribute('aria-label', t('labFine'));
  paint();
}

function applyResult(result, { okMessage } = {}) {
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
  const focused = snapshotView(lab).inFocus;
  if (focused && !wasFocused) {
    audio.focus();
    coach.textContent = t('found');
    feedback.textContent = t('found');
    window.cool?.track?.('focus');
  }
  wasFocused = focused;
  paint();
  if (lab.phase === 'complete') window.cool?.complete?.();
}

async function unlockAll() {
  if (unlocked) return;
  unlocked = true;
  await audio.unlock();
  window.cool?.stage?.('observe');
}

function bindObjective(id, mag) {
  $(id).addEventListener('click', async () => {
    await unlockAll();
    audio.click();
    applyResult(setObjective(lab, mag));
  });
}
bindObjective('obj4', 4);
bindObjective('obj10', 10);
bindObjective('obj40', 40);

$('slideOnion').addEventListener('click', async () => {
  await unlockAll();
  audio.click();
  applyResult(setSlide(lab, 'onion'));
});
$('slideCheek').addEventListener('click', async () => {
  await unlockAll();
  audio.click();
  applyResult(setSlide(lab, 'cheek'));
});

$('lightRange').addEventListener('input', async () => {
  await unlockAll();
  applyResult(setLight(lab, Number($('lightRange').value)));
});
$('coarseRange').addEventListener('input', async () => {
  await unlockAll();
  applyResult(setCoarseUm(lab, Number($('coarseRange').value)));
});
$('fineRange').addEventListener('input', async () => {
  await unlockAll();
  applyResult(setFineUm(lab, Number($('fineRange').value)));
});

$('recordBtn').addEventListener('click', async () => {
  await unlockAll();
  const result = recordTrial(lab);
  if (result.ok) audio.record();
  applyResult(result, { okMessage: 'recorded' });
  if (result.ok) window.cool?.track?.('record', { mag: result.lab.trials.at(-1).totalMag });
});

$('resetBtn').addEventListener('click', async () => {
  await unlockAll();
  audio.click();
  applyResult(resetLab(lab));
  feedback.textContent = t('feedbackIdle');
  coach.textContent = t('tip0');
  wasFocused = false;
  try {
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem(`kidslab.progress.microscope-cell-lab`);
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

addEventListener('themechange', () => scene?.applyTheme());

window.cool.bindI18n(I18N, {
  onChange({ t: translate }) {
    t = translate;
    renderChrome();
  },
});
