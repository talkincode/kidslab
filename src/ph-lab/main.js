import {
  SAMPLES,
  classifyPh,
  createLab,
  dropIndicator,
  formatHydronium,
  liquidColor,
  observationComplete,
  selectSample,
  setIndicator,
  setPh,
} from './ph-model.js';
import { createLabAudio } from './audio.js';
import { createPhScene } from './scene3d.js';

const I18N = {
  zh: {
    back: '返回平台', title: '酸碱魔法水', nogl: '浏览器暂不支持 WebGL，请用右侧读数继续观察。',
    doc: '酸碱魔法水 · KidsLab', langBtn: 'EN',
    soundOn: '关闭声音', soundOff: '打开声音', theme: '切换主题',
    hudPh: 'pH', hudGrade: '教学分级', hudSample: '样品',
    invite: '换一杯水，看看颜色怎么变',
    afterSample: '这是一杯新样品，没有和上一杯混合。',
    afterPh: '拧滑杆也能改 pH，颜色会跟着指示剂走。',
    afterInd: '点烧杯或按下滴入，看液滴落下去。',
    afterDrop: '液滴落下了。对照颜色，再换一杯试试。',
    completeLine: '你看完了换样品、换指示剂和变色。还可以继续玩。',
    drop: '滴入指示剂', panelTitle: '观测台',
    secSub: '换一杯新样品', subHint: '每次都是新的一杯，不会和上一杯混合。',
    secPh: '拧一拧 pH', acid: '← 酸性', base: '碱性 →',
    secInd: '换一种指示剂',
    foldNotes: '指示剂怎么变色', foldFormula: '稀溶液估算',
    foldScope: '这是什么模型', foldSafety: '安全提示',
    formulaHint: '这是示意估算，不是精确活度。',
    scopeNote: '约 25 °C 的常见稀水溶液教学模型；样品 pH 与颜色都是示意。',
    safety: '仅为虚拟模拟。现实中切勿混合漂白水与氨水、食醋、柠檬汁或其他清洁剂。',
    footTip: '拖空白转视角 · 滚轮缩放 · 点瓶子换样品 · 点烧杯滴指示剂',
    sampleCustom: '自调 pH',
    hIon: (value) => `估算 [H₃O⁺] ≈ ${value} mol/L`,
    gradeNeutral: '中性', gradeAcidic: '酸性', gradeBasic: '碱性',
    gradeMoreAcidic: '酸性较强', gradeMoreBasic: '碱性较强',
    inds: { universal: '通用指示剂', litmus: '石蕊', phenol: '酚酞' },
    indNotes: {
      universal: '这是一种示意色卡；通用指示剂的实际颜色会随配方和产品而变。',
      litmus: '石蕊约在 pH 5 以下偏红、pH 8 以上偏蓝，中间呈过渡色。',
      phenol: '酚酞通常在约 pH 8–10 由无色逐渐变粉；强碱中还可能随时间褪色。',
    },
    subs: {
      lemon: '柠檬汁', cola: '可乐', vinegar: '食醋', coffee: '咖啡', milk: '牛奶',
      water: '纯水', seawater: '海水', soda: '小苏打水', soap: '肥皂水', ammonia: '氨水', bleach: '漂白水',
    },
    icons: {
      lemon: '🍋', cola: '🥤', vinegar: '🫙', coffee: '☕', milk: '🥛',
      water: '💧', seawater: '🌊', soda: '🧁', soap: '🧼', ammonia: '🧴', bleach: '🫧',
    },
  },
  en: {
    back: 'Back to platform', title: 'Acid-Base Magic Water', nogl: 'WebGL is unavailable. Keep going with the readings.',
    doc: 'Acid-Base Magic Water · KidsLab', langBtn: '中',
    soundOn: 'Mute sound', soundOff: 'Turn sound on', theme: 'Switch theme',
    hudPh: 'pH', hudGrade: 'Teaching band', hudSample: 'Sample',
    invite: 'Swap in a cup of water and watch the colour change.',
    afterSample: 'This is a fresh cup. Nothing mixed with the last one.',
    afterPh: 'Twist the slider to change pH. Colour still follows the indicator.',
    afterInd: 'Tap the beaker or drip to watch a drop fall in.',
    afterDrop: 'The drop landed. Compare the colour, then try another cup.',
    completeLine: 'You swapped a sample, switched indicator, and saw the colour change. Keep exploring.',
    drop: 'Drip indicator', panelTitle: 'Observation deck',
    secSub: 'Swap in a fresh sample', subHint: 'Each choice is a new cup. Nothing is mixed.',
    secPh: 'Twist the pH', acid: '← Acidic', base: 'Basic →',
    secInd: 'Switch the indicator',
    foldNotes: 'How the indicator changes', foldFormula: 'Dilute estimate',
    foldScope: 'What this model is', foldSafety: 'Safety note',
    formulaHint: 'This is an illustrative estimate, not exact activity.',
    scopeNote: 'A teaching model for common dilute aqueous solutions near 25 °C; sample pH and colours are illustrative.',
    safety: 'Virtual simulation only. Never mix bleach with ammonia, vinegar, lemon juice, or other cleaners.',
    footTip: 'Drag empty space to orbit · scroll to zoom · tap a bottle to swap · tap the beaker to drip',
    sampleCustom: 'Custom pH',
    hIon: (value) => `Estimated [H₃O⁺] ≈ ${value} mol/L`,
    gradeNeutral: 'Neutral', gradeAcidic: 'Acidic', gradeBasic: 'Basic',
    gradeMoreAcidic: 'More acidic', gradeMoreBasic: 'More basic',
    inds: { universal: 'Universal', litmus: 'Litmus', phenol: 'Phenolphthalein' },
    indNotes: {
      universal: 'This is an illustrative colour chart; real universal-indicator colours vary by formula and product.',
      litmus: 'Litmus is reddish below about pH 5 and blue above about pH 8, with transition colours in between.',
      phenol: 'Phenolphthalein usually changes gradually from colourless to pink around pH 8–10 and may fade in strong base.',
    },
    subs: {
      lemon: 'Lemon juice', cola: 'Cola', vinegar: 'Vinegar', coffee: 'Coffee', milk: 'Milk',
      water: 'Pure water', seawater: 'Sea water', soda: 'Baking soda', soap: 'Soapy water', ammonia: 'Ammonia', bleach: 'Bleach',
    },
    icons: {
      lemon: '🍋', cola: '🥤', vinegar: '🫙', coffee: '☕', milk: '🥛',
      water: '💧', seawater: '🌊', soda: '🧁', soap: '🧼', ammonia: '🧴', bleach: '🫧',
    },
  },
};

const GRADE_KEY = {
  'more-acidic': 'gradeMoreAcidic',
  acidic: 'gradeAcidic',
  neutral: 'gradeNeutral',
  basic: 'gradeBasic',
  'more-basic': 'gradeMoreBasic',
};

const $ = (s) => document.querySelector(s);
const SOUND = 'kidslab.ph-lab';
const INDICATORS = ['universal', 'litmus', 'phenol'];

const els = {
  phVal: $('#phVal'),
  phTag: $('#phTag'),
  sampleName: $('#sampleName'),
  coach: $('#coachLine'),
  sound: $('#soundBtn'),
  panel: $('#panel'),
  panelBody: $('#panelBody'),
  panelHandle: $('#panelHandle'),
  panelArrow: $('#panelArrow'),
  phRange: $('#phRange'),
  hIon: $('#hIon'),
  indNote: $('#indNote'),
  subs: $('#subs'),
  inds: $('#inds'),
};

let lang = window.cool?.preferences?.lang || 'zh';
let lab = createLab();
let muted = localStorage.getItem(SOUND) === 'off';
let panelOpen = true;
let coachKey = 'invite';
let completedOnce = false;
let lastGrade = classifyPh(lab.ph);
const audio = createLabAudio({ bgmUrl: new URL('./audio/bgm-lab.ogg', import.meta.url), muted });
const lab3d = createPhScene($('#scene'), {
  onSample: (id) => applySample(id, true),
  onBeaker: () => applyDrop(),
});
if (!lab3d) $('#nogl')?.removeAttribute('hidden');
window.cool?.stage?.('observe');
document.addEventListener('pointerdown', () => { if (!muted) audio.unlock(); }, { once: true });

const dict = () => I18N[lang] || I18N.zh;
const t = (key, ...args) => {
  const value = dict()[key];
  if (typeof value === 'function') return value(...args);
  return value ?? I18N.zh[key] ?? key;
};

function superscript(exp) {
  return String(exp).replace(/-/g, '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
}

function hIonLabel() {
  const packed = formatHydronium(lab.ph);
  if (!packed) return '';
  return t('hIon', `${packed.mantissa}×10${superscript(packed.exponent)}`);
}

function applyPanel() {
  els.panel.classList.toggle('is-collapsed', !panelOpen);
  els.panelBody.hidden = !panelOpen;
  els.panelHandle.setAttribute('aria-expanded', String(panelOpen));
  els.panelArrow.textContent = panelOpen ? '▾' : '▸';
}

function renderSubs() {
  els.subs.innerHTML = '';
  for (const sample of SAMPLES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.id = sample.id;
    button.classList.toggle('is-on', lab.sampleId === sample.id);
    button.innerHTML = `<span>${dict().icons[sample.id]}</span>${dict().subs[sample.id]}<small>≈ pH ${sample.ph}</small>`;
    button.addEventListener('click', () => applySample(sample.id, true));
    els.subs.appendChild(button);
  }
}

function renderInds() {
  els.inds.innerHTML = '';
  for (const key of INDICATORS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = dict().inds[key];
    button.classList.toggle('is-on', lab.indicator === key);
    button.addEventListener('click', () => applyIndicator(key));
    els.inds.appendChild(button);
  }
}

function syncView({ rebuild = false } = {}) {
  document.title = t('doc');
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  els.phVal.textContent = lab.ph.toFixed(1);
  els.phTag.textContent = t(GRADE_KEY[classifyPh(lab.ph)] || 'gradeNeutral');
  els.sampleName.textContent = lab.sampleId ? dict().subs[lab.sampleId] : t('sampleCustom');
  els.coach.textContent = t(coachKey);
  els.phRange.value = String(lab.ph);
  els.hIon.textContent = hIonLabel();
  els.indNote.textContent = dict().indNotes[lab.indicator];
  els.sound.textContent = muted ? '🔇' : '🔊';
  els.sound.setAttribute('aria-pressed', String(muted));
  els.sound.setAttribute('aria-label', t(muted ? 'soundOff' : 'soundOn'));
  $('#langBtn').textContent = t('langBtn');
  $('#themeBtn').textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
  $('#themeBtn').setAttribute('aria-label', t('theme'));
  syncScene();
  if (rebuild || !els.subs.childElementCount) {
    renderSubs();
    renderInds();
  } else {
    els.subs.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('is-on', button.dataset.id === lab.sampleId);
    });
    els.inds.querySelectorAll('button').forEach((button, index) => {
      button.classList.toggle('is-on', INDICATORS[index] === lab.indicator);
    });
  }
}

function syncScene() {
  lab3d?.setPh(lab.ph);
  lab3d?.setLiquidColor(liquidColor(lab));
  lab3d?.setSelectedSample(lab.sampleId);
}

function render() {
  syncView({ rebuild: true });
}

function maybeComplete() {
  if (completedOnce || !observationComplete(lab)) return;
  completedOnce = true;
  coachKey = 'completeLine';
  window.cool?.complete?.();
  window.cool?.track?.('complete-observe');
  audio.beep('win');
}

function noteGrade() {
  const grade = classifyPh(lab.ph);
  if (grade && grade !== lastGrade) {
    lastGrade = grade;
    window.cool?.track?.('watch-color');
    audio.beep('bound');
  }
}

function applySample(id, animate) {
  const result = selectSample(lab, id);
  if (!result.ok) {
    audio.beep('bad');
    return;
  }
  lab = result.lab;
  coachKey = 'afterSample';
  window.cool?.track?.('pick-sample');
  syncScene();
  if (animate) {
    window.cool?.track?.('pour-sample');
    audio.beep('pour');
    lab3d?.playPour(id);
  } else {
    audio.beep('tap');
  }
  noteGrade();
  maybeComplete();
  render();
}

function applyIndicator(id) {
  const result = setIndicator(lab, id);
  if (!result.ok) {
    audio.beep('bad');
    return;
  }
  lab = result.lab;
  coachKey = 'afterInd';
  window.cool?.track?.('switch-indicator');
  audio.beep('tap');
  maybeComplete();
  render();
}

function applyDrop() {
  const result = dropIndicator(lab);
  if (!result.ok) {
    audio.beep('bad');
    return;
  }
  lab = result.lab;
  coachKey = observationComplete(lab) ? 'completeLine' : 'afterDrop';
  window.cool?.track?.('drop-indicator');
  audio.beep('drop');
  syncScene();
  lab3d?.playDrop();
  maybeComplete();
  render();
}

function applyPh(value, track) {
  const result = setPh(lab, value);
  if (!result.ok) {
    audio.beep('bad');
    return;
  }
  lab = result.lab;
  coachKey = 'afterPh';
  if (track) window.cool?.track?.('tune-ph');
  noteGrade();
  maybeComplete();
  syncView();
}

els.panelHandle.addEventListener('click', () => { panelOpen = !panelOpen; applyPanel(); });
els.phRange.addEventListener('input', (event) => applyPh(Number(event.target.value), false));
els.phRange.addEventListener('change', (event) => applyPh(Number(event.target.value), true));
$('#dropBtn').addEventListener('click', applyDrop);
$('#safetyFold').addEventListener('toggle', () => {
  if ($('#safetyFold').open) window.cool?.track?.('open-safety');
});
els.sound.addEventListener('click', () => {
  muted = !muted;
  audio.setMuted(muted);
  try { localStorage.setItem(SOUND, muted ? 'off' : 'on'); } catch { /* privacy mode */ }
  if (!muted) audio.unlock();
  render();
});

window.cool.bindI18n(I18N, {
  onChange({ kind, lang: nextLang, theme }) {
    if (kind !== 'theme') lang = nextLang || window.cool.preferences.lang;
    void theme;
    lab3d?.applyTheme?.();
    render();
  },
});
$('#langBtn').addEventListener('click', () => window.cool.preferences.toggleLang());
$('#themeBtn').addEventListener('click', () => window.cool.preferences.toggleTheme());
applyPanel();
render();
