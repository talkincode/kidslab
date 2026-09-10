import {
  DENSITY_CASE,
  calculateMassVolumeSlope,
  createLab,
  getSpecimen,
  liveReadings,
  logLiveTrial,
  resetLab,
  selectSpecimen,
  submergeSpecimen,
  weighSpecimen,
} from './density-model.js';
import { createLabAudio } from './audio.js';
import { createDensityScene } from './scene3d.js';

const I18N = {
  zh: {
    doc: '密度侦探实验室 · KidsLab',
    back: '返回平台',
    title: '密度侦探实验室',
    nogl: '浏览器暂不支持 WebGL，请用右侧读数继续观察。',
    specimenTitle: '桌上的金属',
    specimenHint: '三块看起来一样亮，只是大小不同。',
    specimenA: '小块',
    specimenB: '中块',
    specimenC: '大块',
    massReadout: '有多重',
    initialLevel: '开始水面',
    finalLevel: '升高后',
    weigh: '放上天平',
    submerge: '浸没入水',
    reset: '重新实验',
    liveTitle: '刚才看到的读数',
    record: '记入数据表',
    tableSpecimen: '金属',
    tableMass: '多重 / g',
    tableVolume: '多大 / cm³',
    tableDensity: '挤得有多紧',
    graphTitle: '质量对着体积',
    aluminum: '铝',
    iron: '铁',
    copper: '铜',
    soundOn: '关闭声音',
    soundOff: '打开声音',
    theme: '切换主题',
    lang: 'Switch to English',
    startMeasure: '选一块金属，先放上天平称一称。',
    weighed: (mass) => `天平停在 ${decimal(mass)} g。下一步：把它完全浸没。`,
    weighFirst: '先称一称有多重，再放进水里。',
    submerged: (before, after) => `水面从 ${decimal(before)} mL 升到 ${decimal(after)} mL。升高的那一截就是它的体积。`,
    sampleAlreadyRecorded: '这块已经记过了，换下一块。',
    needBothReadings: '质量和水面都看过了，才能记进表里。',
    liveWaiting: '质量 — · 排水体积 —',
    liveReady: (mass, volume) => `质量 ${decimal(mass)} g · 排水体积 ${decimal(volume)} cm³`,
    recordSaved: (specimen, density) => `${specimen} 记好了：同样大小大约 ${decimal(density, 2)} g。`,
    panelTitle: '观测台',
    footTip: '拖空白转视角 · 先称重再浸没 · 点会自己连成线',
    densityPlain: '同样大的东西，有的轻有的重。这条线有多陡，就是密度。',
    modelNote: '教学示意：水面升高的那一截就是金属的体积。1 mL = 1 cm³。',
    caseClosed: (material, density) => `三个点排成一条直线，斜率和${material}对得上，大约 ${decimal(density, 2)} g/cm³。`,
    resetDone: '桌子清空了。再称一块，看点会不会落在同一条线上。',
    recordedMark: '已记录',
  },
  en: {
    doc: 'Density Detective Lab · KidsLab',
    back: 'Back to platform',
    title: 'Density Detective Lab',
    nogl: 'WebGL is unavailable. Keep going with the readings on the right.',
    specimenTitle: 'Metals on the bench',
    specimenHint: 'They look equally shiny. Only the sizes are different.',
    specimenA: 'Small',
    specimenB: 'Medium',
    specimenC: 'Large',
    massReadout: 'How heavy',
    initialLevel: 'Start level',
    finalLevel: 'After dunking',
    weigh: 'Use the balance',
    submerge: 'Dunk it',
    reset: 'Restart experiment',
    liveTitle: 'Readings you just saw',
    record: 'Log the table',
    tableSpecimen: 'Piece',
    tableMass: 'Mass / g',
    tableVolume: 'Size / cm³',
    tableDensity: 'How packed',
    graphTitle: 'Mass against volume',
    aluminum: 'aluminum',
    iron: 'iron',
    copper: 'copper',
    soundOn: 'Mute sound',
    soundOff: 'Turn sound on',
    theme: 'Toggle theme',
    lang: '切换到中文',
    startMeasure: 'Pick a piece, then weigh it on the balance.',
    weighed: (mass) => `The balance settles at ${decimal(mass)} g. Next: dunk it fully.`,
    weighFirst: 'Weigh it first, then put it in the water.',
    submerged: (before, after) => `The water rises from ${decimal(before)} mL to ${decimal(after)} mL. That extra slice is its volume.`,
    sampleAlreadyRecorded: 'This piece is already logged. Try the next one.',
    needBothReadings: 'Read both the balance and the water line before logging.',
    liveWaiting: 'mass — · displaced volume —',
    liveReady: (mass, volume) => `mass ${decimal(mass)} g · displaced volume ${decimal(volume)} cm³`,
    recordSaved: (specimen, density) => `${specimen} logged: about ${decimal(density, 2)} g for the same size.`,
    panelTitle: 'Observation deck',
    footTip: 'Drag empty space to orbit · weigh then dunk · points draw the line',
    densityPlain: 'Same size can feel light or heavy. How steep this line is — that is density.',
    modelNote: 'Teaching model: the water rise is the metal’s volume. 1 mL = 1 cm³.',
    caseClosed: (material, density) => `Three points make one line. The slope matches ${material}, about ${decimal(density, 2)} g/cm³.`,
    resetDone: 'Bench cleared. Weigh again and see if the points still share a line.',
    recordedMark: 'Logged',
  },
};

const SOUND_KEY = 'kidslab.density-detective-lab.sound';
const SVG_NS = 'http://www.w3.org/2000/svg';
const $ = (selector) => document.querySelector(selector);

const elements = {
  langBtn: $('#langBtn'),
  themeBtn: $('#themeBtn'),
  soundBtn: $('#soundBtn'),
  recordCount: $('#recordCount'),
  selectedSpecimen: $('#selectedSpecimen'),
  massReadout: $('#massReadout'),
  initialReading: $('#initialReading'),
  finalReading: $('#finalReading'),
  weighBtn: $('#weighBtn'),
  submergeBtn: $('#submergeBtn'),
  benchFeedback: $('#benchFeedback'),
  liveReadout: $('#liveReadout'),
  recordBtn: $('#recordBtn'),
  entryFeedback: $('#entryFeedback'),
  recordBody: $('#recordBody'),
  graphFit: $('#graphFit'),
  graphPoints: $('#graphPoints'),
  densityEstimate: $('#densityEstimate'),
  completeCard: $('#completeCard'),
  conclusionStatus: $('#conclusionStatus'),
};

let lab = createLab();
let notice = { bench: { key: 'startMeasure', kind: '', args: [] }, entry: null };
let lang = window.cool?.preferences?.lang || 'zh';
let t = (key) => key;
let muted = safeGet(SOUND_KEY) === 'off';
const labAudio = createLabAudio({
  bgmUrl: new URL('./audio/bgm-mystery-thinking-01.ogg', import.meta.url),
  muted,
});
const lab3d = createDensityScene($('#scene'));
if (!lab3d) $('#nogl')?.removeAttribute('hidden');
let panelOpen = true;
function applyPanel() {
  const panel = $('#panel');
  if (!panel) return;
  panel.classList.toggle('is-collapsed', !panelOpen);
  $('#panelBody').hidden = !panelOpen;
  $('#panelHandle')?.setAttribute('aria-expanded', String(panelOpen));
  const arrow = $('#panelArrow');
  if (arrow) arrow.textContent = panelOpen ? '▾' : '▸';
}
$('#panelHandle')?.addEventListener('click', () => { panelOpen = !panelOpen; applyPanel(); });
document.addEventListener('pointerdown', () => { if (!muted) labAudio.unlock(); }, { once: true });

function decimal(value, digits = 1) {
  return Number(value).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
}

function text(key, ...args) {
  const value = I18N[lang]?.[key];
  if (typeof value === 'function') return value(...args);
  if (typeof value === 'string') return value;
  return t(key, ...args);
}

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

function setNotice(area, key, kind = '', args = []) {
  notice[area] = key ? { key, kind, args } : null;
}

function renderNotice(element, notice) {
  if (!element) return;
  if (!notice) {
    element.textContent = '';
    element.className = element.className.replace(/\bis-(?:success|error)\b/g, '').trim();
    return;
  }
  element.textContent = text(notice.key, ...(notice.args ?? []));
  element.className = element.className.replace(/\bis-(?:success|error)\b/g, '').trim();
  if (notice.kind) element.classList.add(`is-${notice.kind}`);
}

function specimenLabel(sample) {
  return text({
    'specimen-a': 'specimenA',
    'specimen-b': 'specimenB',
    'specimen-c': 'specimenC',
  }[sample.id]);
}

function materialLabel(id) {
  return text(id);
}

function selectedSpecimen() {
  return getSpecimen(lab.selectedSpecimenId) || DENSITY_CASE.samples[0];
}

function recordFor(specimenId) {
  return lab.records.find((record) => record.specimenId === specimenId) || null;
}

function setMuted(nextMuted) {
  muted = nextMuted;
  safeSet(SOUND_KEY, muted ? 'off' : 'on');
  labAudio.setMuted(muted);
  if (!muted) labAudio.unlock();
  renderSoundButton();
}

function renderSoundButton() {
  elements.soundBtn.textContent = muted ? '🔇' : '🔊';
  elements.soundBtn.setAttribute('aria-pressed', String(muted));
  elements.soundBtn.setAttribute('aria-label', text(muted ? 'soundOff' : 'soundOn'));
}

function tone(kind) {
  const mapped = {
    weigh: 'weigh',
    read: 'read',
    measure: 'tap',
    success: 'good',
    error: 'bad',
    complete: 'win',
  }[kind] || 'tap';
  labAudio.beep(mapped);
}

function applyAction(result, { okKey, okKind = 'success', okArgs = [], sound = 'success', track, stage } = {}) {
  lab = result.lab;
  if (!result.ok) {
    const reasonKey = {
      'unknown-specimen': 'startMeasure',
      'weigh-first': 'weighFirst',
      'need-both-readings': 'needBothReadings',
      'already-recorded': 'sampleAlreadyRecorded',
    }[result.reason] || 'startMeasure';
    setNotice('bench', reasonKey, 'error');
    if (result.reason === 'need-both-readings') setNotice('entry', 'needBothReadings', 'error');
    tone('error');
    render();
    return false;
  }
  if (okKey) setNotice('bench', okKey, okKind, okArgs);
  if (track) window.cool?.track?.(track.name, track.data);
  if (stage) window.cool?.stage(stage);
  tone(sound);
  render();
  return true;
}

function chooseSpecimen(specimenId) {
  const result = selectSpecimen(lab, specimenId);
  if (!result.ok) {
    applyAction(result);
    return;
  }
  lab = result.lab;
  setNotice('entry', null);
  setNotice('bench', recordFor(specimenId) ? 'sampleAlreadyRecorded' : 'startMeasure', recordFor(specimenId) ? 'error' : '');
  window.cool?.track?.('selected_density_specimen', { specimen: specimenId });
  tone(recordFor(specimenId) ? 'error' : 'measure');
  render();
}

function onWeigh() {
  const result = weighSpecimen(lab);
  const sample = selectedSpecimen();
  applyAction(result, {
    okKey: 'weighed',
    okArgs: [sample.massG],
    sound: 'weigh',
    stage: 'measure_mass',
    track: { name: 'measured_mass', data: { specimen: sample.id, massG: sample.massG } },
  });
}

function onSubmerge() {
  const result = submergeSpecimen(lab);
  const sample = selectedSpecimen();
  if (applyAction(result, {
    okKey: 'submerged',
    okArgs: [40, 40 + sample.volumeCm3],
    sound: 'read',
    stage: 'measure_volume',
    track: { name: 'measured_displacement', data: { specimen: sample.id, displacedVolumeMl: sample.volumeCm3 } },
  })) {
    setNotice('entry', null);
    render();
  }
}

function onRecord() {
  const specimen = selectedSpecimen();
  const result = logLiveTrial(lab);
  if (!applyAction(result, {
    okKey: result.ok && result.lab.complete ? 'caseClosed' : 'recordSaved',
    okArgs: result.ok && result.lab.complete
      ? [materialLabel(result.lab.identifiedMaterialId), calculateMassVolumeSlope(result.lab.records)]
      : [specimenLabel(specimen), result.trial?.densityGPerCm3],
    sound: result.ok && result.lab.complete ? 'complete' : 'success',
    stage: result.ok && result.lab.complete ? 'evidence_complete' : 'measure_volume',
    track: { name: 'logged_density_trial', data: { specimen: specimen.id } },
  })) return;
  if (result.lab.complete) {
    window.cool?.complete?.();
    window.cool?.track?.('identified_density_material', {
      material: result.lab.identifiedMaterialId,
      densityGPerCm3: calculateMassVolumeSlope(result.lab.records),
    });
  }
}

function resetCase() {
  lab = resetLab();
  notice = { bench: { key: 'resetDone', kind: 'success', args: [] }, entry: null };
  window.cool?.track?.('reset_density_case');
  tone('measure');
  render();
}

function renderSpecimenShelf() {
  elements.recordCount.textContent = `${lab.records.length} / ${DENSITY_CASE.samples.length}`;
  document.querySelectorAll('[data-specimen]').forEach((button) => {
    const recorded = Boolean(recordFor(button.dataset.specimen));
    button.classList.toggle('is-on', button.dataset.specimen === lab.selectedSpecimenId);
    button.classList.toggle('is-complete', recorded);
    if (recorded) button.setAttribute('aria-label', `${button.textContent.trim()} · ${text('recordedMark')}`);
    else button.removeAttribute('aria-label');
  });
}

function renderInstruments() {
  const specimen = selectedSpecimen();
  const live = liveReadings(lab);
  const alreadyRecorded = Boolean(recordFor(specimen.id));
  const waterLevel = live.finalWaterMl ?? live.initialWaterMl ?? DENSITY_CASE.initialWaterMl;
  elements.selectedSpecimen.textContent = specimenLabel(specimen);
  elements.massReadout.textContent = live.massG == null ? '—' : `${decimal(live.massG)} g`;
  elements.initialReading.textContent = `${decimal(live.initialWaterMl)} mL`;
  elements.finalReading.textContent = live.finalWaterMl == null ? '—' : `${decimal(live.finalWaterMl)} mL`;
  const massText = live.massG == null ? '—  g' : `${decimal(live.massG)} g`;
  lab3d?.setSpecimen({ tone: specimen.tone, volumeCm3: specimen.volumeCm3, massText });
  lab3d?.setState({
    isWeighed: live.massG != null,
    isSubmerged: live.volumeCm3 != null,
    massText,
    waterLevelMl: waterLevel,
  });
  elements.weighBtn.disabled = alreadyRecorded || live.massG != null;
  elements.submergeBtn.disabled = alreadyRecorded;
  renderNotice(elements.benchFeedback, notice.bench);
}

function renderEntry() {
  const live = liveReadings(lab);
  const ready = live.massG != null && live.volumeCm3 != null && !recordFor(lab.selectedSpecimenId);
  elements.liveReadout.textContent = ready
    ? text('liveReady', live.massG, live.volumeCm3)
    : text('liveWaiting');
  elements.recordBtn.disabled = Boolean(recordFor(lab.selectedSpecimenId));
  renderNotice(elements.entryFeedback, notice.entry);
}

function appendCell(row, value, extraClass = '') {
  const cell = document.createElement('td');
  cell.textContent = value;
  if (extraClass) cell.className = extraClass;
  row.append(cell);
}

function renderRecordTable() {
  const fragment = document.createDocumentFragment();
  DENSITY_CASE.samples.forEach((sample) => {
    const row = document.createElement('tr');
    const record = recordFor(sample.id);
    appendCell(row, specimenLabel(sample));
    appendCell(row, record ? decimal(record.massG) : '—', record ? '' : 'table-empty');
    appendCell(row, record ? decimal(record.volumeCm3) : '—', record ? '' : 'table-empty');
    appendCell(row, record ? decimal(record.densityGPerCm3, 2) : '—', record ? '' : 'table-empty');
    fragment.append(row);
  });
  elements.recordBody.replaceChildren(fragment);
}

function graphPoint(record) {
  return {
    x: 34 + (record.volumeCm3 / 30) * 226,
    y: 150 - (record.massG / 90) * 132,
  };
}

function renderGraph() {
  const fragment = document.createDocumentFragment();
  lab.records.forEach((record) => {
    const point = graphPoint(record);
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('class', 'graph-point');
    circle.setAttribute('cx', point.x.toFixed(2));
    circle.setAttribute('cy', point.y.toFixed(2));
    circle.setAttribute('r', '5');
    const label = document.createElementNS(SVG_NS, 'text');
    label.setAttribute('class', 'point-label');
    label.setAttribute('x', (point.x + 7).toFixed(2));
    label.setAttribute('y', (point.y - 7).toFixed(2));
    label.textContent = specimenLabel(getSpecimen(record.specimenId));
    fragment.append(circle, label);
  });
  elements.graphPoints.replaceChildren(fragment);

  const slope = calculateMassVolumeSlope(lab.records);
  if (lab.records.length > 1 && slope !== null) {
    const end = graphPoint({ volumeCm3: 30, massG: slope * 30 });
    elements.graphFit.setAttribute('d', `M34 150 L${end.x.toFixed(2)} ${end.y.toFixed(2)}`);
  } else {
    elements.graphFit.setAttribute('d', '');
  }
  elements.densityEstimate.textContent = lab.complete && slope !== null ? `ρ = ${decimal(slope, 2)} g/cm³` : 'ρ = —';
}

function renderConclusion() {
  const show = lab.complete;
  elements.completeCard.hidden = !show;
  if (show) {
    const slope = calculateMassVolumeSlope(lab.records);
    elements.conclusionStatus.textContent = text('caseClosed', materialLabel(lab.identifiedMaterialId), slope);
  } else {
    elements.conclusionStatus.textContent = '';
  }
}

function render() {
  document.title = text('doc');
  renderSoundButton();
  elements.themeBtn.setAttribute('aria-label', text('theme'));
  elements.langBtn.setAttribute('aria-label', text('lang'));
  elements.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
  elements.themeBtn.textContent = window.cool?.preferences?.theme === 'light' ? '🌙' : '☀️';
  renderSpecimenShelf();
  renderInstruments();
  renderEntry();
  renderRecordTable();
  renderGraph();
  renderConclusion();
}

document.querySelectorAll('[data-specimen]').forEach((button) => {
  button.addEventListener('click', () => chooseSpecimen(button.dataset.specimen));
});

elements.weighBtn.addEventListener('click', onWeigh);
elements.submergeBtn.addEventListener('click', onSubmerge);
elements.recordBtn.addEventListener('click', onRecord);
$('#resetBtn').addEventListener('click', resetCase);
elements.soundBtn.addEventListener('click', () => setMuted(!muted));
elements.themeBtn.addEventListener('click', () => window.cool?.preferences?.toggleTheme?.());
elements.langBtn.addEventListener('click', () => window.cool?.preferences?.toggleLang?.());

window.cool?.bindI18n?.(I18N, {
  onChange({ t: translate, lang: nextLang }) {
    t = translate;
    lang = nextLang;
    render();
  },
});
window.cool?.stage?.('level2');
if (!window.cool?.bindI18n) render();
