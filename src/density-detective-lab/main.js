import {
  DENSITY_CASE,
  REFERENCE_MATERIALS,
  calculateMassVolumeSlope,
  createMeasurement,
  getSpecimen,
  identifyMaterial,
  isMeasurementEntryAccurate,
} from './density-model.js';

const I18N = {
  zh: {
    doc: '密度侦探实验室 · KidsLab',
    back: '返回平台',
    title: '密度侦探实验室',
    caseNav: '案件',
    benchNav: '实验台',
    evidenceNav: '证据',
    caseCode: '未知合金案',
    caseTitle: '三块银色金属，是同一种材料吗？',
    caseIntro: '不要凭大小或重量猜。用数据找出不随样本大小改变的证据。',
    predictionTitle: '先留下预测',
    predictionPrompt: '如果三块金属来自同一种材料，哪一个量最可能保持相同？',
    predictionMass: '质量',
    predictionVolume: '体积',
    predictionDensity: '密度',
    specimenTitle: '挑选证物',
    specimenHint: '每块只测一次；改变体积，材料保持不变。',
    specimenA: '证物 A',
    specimenB: '证物 B',
    specimenC: '证物 C',
    smallPiece: '小块',
    middlePiece: '中块',
    largePiece: '大块',
    controlLabel: '控制变量：',
    controlText: '同种材料、同一量筒、同样的初始水位。',
    benchTitle: '让仪器说话',
    selectedLabel: '当前证物',
    balanceTitle: '电子天平',
    cylinderTitle: '量筒',
    massReadout: '质量读数',
    initialLevel: '初液面',
    finalLevel: '末液面',
    weigh: '放上天平',
    submerge: '浸没入水',
    methodVolume: '体积 = 末液面 − 初液面',
    methodUnit: '1 mL = 1 cm³',
    evidenceTitle: '记录，再下结论',
    reset: '重开案件',
    entryTitle: '抄下仪器读数',
    entryHint: '先量，再算。输入质量和排开水的体积。',
    entryMass: '质量 m (g)',
    entryVolume: '排水体积 V (cm³)',
    record: '写入证据',
    tableSpecimen: '证物',
    tableMass: 'm / g',
    tableVolume: 'V / cm³',
    tableDensity: 'ρ / g·cm⁻³',
    graphTitle: '质量—体积图',
    graphEmpty: '记录第一组数据，图上就会出现一个坐标点。',
    identifyTitle: '锁定材料',
    identifyHint: '三组证据齐全后，用图像斜率和参考卡比对。',
    aluminum: '铝',
    iron: '铁',
    copper: '铜',
    soundOn: '关闭声音',
    soundOff: '打开声音',
    theme: '切换主题',
    lang: 'Switch to English',
    predictionSaved: '预测已留下。现在让三组测量来检验它。',
    predictionExplore: '先别急着改答案。带着这个预测去收集证据。',
    waiting: '等待测量',
    weighing: '已读天平',
    readyToRecord: '读数待记录',
    evidenceReady: '证据齐全',
    startMeasure: '选好证物后，先放上天平，再把它完全浸没。',
    weighed: (mass) => `天平稳定在 ${decimal(mass)} g。下一步：让它完全浸没。`,
    weighFirst: '先把证物放上天平，质量和体积都要测。',
    submerged: (before, after) => `液面从 ${decimal(before)} mL 上升到 ${decimal(after)} mL。现在算出排水体积。`,
    sampleAlreadyRecorded: '这块证物已经写入证据；请选择下一块。',
    needBothReadings: '先完成天平和量筒两次读数，才能写入证据。',
    entryReady: '把看到的质量和“末液面−初液面”填进来。',
    entryWrong: '这组数和仪器读数对不上。核对天平和两个液面后再写。',
    recordSaved: (specimen, density) => `${specimen} 已入档：密度 ${decimal(density, 2)} g/cm³。`,
    allRecorded: '三组证据已经齐全。观察图像斜率，再选择参考材料。',
    identifyNeedRecords: '先收集三组证据；单次测量还不足以确认材料。',
    identifyWrong: '这个参考密度与图像斜率不符。再比较一次三个数。',
    caseClosed: (material, density) => `案件结案：三块样本都是${material}，因为 m-V 图像斜率约为 ${decimal(density, 2)} g/cm³。`,
    resetDone: '案件已重置。重新留下预测，再收集一组新证据。',
    recordedMark: '已记录',
  },
  en: {
    doc: 'Density Detective Lab · KidsLab',
    back: 'Back to platform',
    title: 'Density Detective Lab',
    caseNav: 'Case',
    benchNav: 'Bench',
    evidenceNav: 'Evidence',
    caseCode: 'Mystery Alloy',
    caseTitle: 'Are these three silver pieces the same material?',
    caseIntro: 'Do not guess from size or weight. Use data to find the evidence that stays unchanged.',
    predictionTitle: 'Make a prediction',
    predictionPrompt: 'If all three pieces are the same material, which quantity is most likely to stay the same?',
    predictionMass: 'Mass',
    predictionVolume: 'Volume',
    predictionDensity: 'Density',
    specimenTitle: 'Choose evidence',
    specimenHint: 'Measure each piece once. Change its volume; keep its material the same.',
    specimenA: 'Specimen A',
    specimenB: 'Specimen B',
    specimenC: 'Specimen C',
    smallPiece: 'Small piece',
    middlePiece: 'Middle piece',
    largePiece: 'Large piece',
    controlLabel: 'Controls:',
    controlText: 'Same material, same cylinder, and the same starting water level.',
    benchTitle: 'Let the instruments speak',
    selectedLabel: 'Current specimen',
    balanceTitle: 'Digital balance',
    cylinderTitle: 'Graduated cylinder',
    massReadout: 'Mass reading',
    initialLevel: 'Start level',
    finalLevel: 'End level',
    weigh: 'Use balance',
    submerge: 'Submerge it',
    methodVolume: 'volume = end level − start level',
    methodUnit: '1 mL = 1 cm³',
    evidenceTitle: 'Record, then conclude',
    reset: 'Restart case',
    entryTitle: 'Copy the readings',
    entryHint: 'Measure first, then calculate. Enter mass and displaced-water volume.',
    entryMass: 'Mass m (g)',
    entryVolume: 'Displaced volume V (cm³)',
    record: 'Log evidence',
    tableSpecimen: 'Piece',
    tableMass: 'm / g',
    tableVolume: 'V / cm³',
    tableDensity: 'ρ / g·cm⁻³',
    graphTitle: 'Mass–volume graph',
    graphEmpty: 'Log the first trial and a point will appear on the graph.',
    identifyTitle: 'Identify the material',
    identifyHint: 'After all three trials, compare the graph slope with the reference cards.',
    aluminum: 'Aluminum',
    iron: 'Iron',
    copper: 'Copper',
    soundOn: 'Mute sound',
    soundOff: 'Turn sound on',
    theme: 'Toggle theme',
    lang: '切换到中文',
    predictionSaved: 'Prediction saved. Now let three measurements test it.',
    predictionExplore: 'Do not change your answer yet. Carry that prediction into the evidence.',
    waiting: 'Ready to measure',
    weighing: 'Balance read',
    readyToRecord: 'Readings ready',
    evidenceReady: 'Evidence complete',
    startMeasure: 'Choose a specimen, then use the balance before submerging it fully.',
    weighed: (mass) => `The balance settles at ${decimal(mass)} g. Next: submerge it fully.`,
    weighFirst: 'Use the balance first. You need both mass and volume.',
    submerged: (before, after) => `The water rises from ${decimal(before)} mL to ${decimal(after)} mL. Now calculate displaced volume.`,
    sampleAlreadyRecorded: 'This specimen is already logged. Choose the next one.',
    needBothReadings: 'Complete both balance and cylinder readings before logging evidence.',
    entryReady: 'Enter the mass you saw and “end level − start level.”',
    entryWrong: 'Those values do not match the instrument readings. Check the balance and both levels, then try again.',
    recordSaved: (specimen, density) => `${specimen} logged: density ${decimal(density, 2)} g/cm³.`,
    allRecorded: 'All three trials are logged. Read the graph slope, then choose a reference material.',
    identifyNeedRecords: 'Collect all three trials first. One measurement is not enough to identify a material.',
    identifyWrong: 'That reference density does not match the graph slope. Compare all three values again.',
    caseClosed: (material, density) => `Case closed: all three pieces are ${material}, because the m–V slope is about ${decimal(density, 2)} g/cm³.`,
    resetDone: 'Case reset. Make a new prediction, then collect fresh evidence.',
    recordedMark: 'Logged',
  },
};

const SOUND_KEY = 'kidslab.density-detective-lab.sound';
const SVG_NS = 'http://www.w3.org/2000/svg';
const $ = (selector) => document.querySelector(selector);

const elements = {
  app: $('#app'),
  langBtn: $('#langBtn'),
  themeBtn: $('#themeBtn'),
  soundBtn: $('#soundBtn'),
  predictionFeedback: $('#predictionFeedback'),
  recordCount: $('#recordCount'),
  selectedSpecimen: $('#selectedSpecimen'),
  labState: $('#labState'),
  balanceReading: $('#balanceReading'),
  balanceSpecimen: $('#balanceSpecimen'),
  massReadout: $('#massReadout'),
  waterFill: $('#waterFill'),
  waterSpecimen: $('#waterSpecimen'),
  initialReading: $('#initialReading'),
  finalReading: $('#finalReading'),
  weighBtn: $('#weighBtn'),
  submergeBtn: $('#submergeBtn'),
  benchFeedback: $('#benchFeedback'),
  massEntry: $('#massEntry'),
  volumeEntry: $('#volumeEntry'),
  recordBtn: $('#recordBtn'),
  entryFeedback: $('#entryFeedback'),
  recordBody: $('#recordBody'),
  graphFit: $('#graphFit'),
  graphPoints: $('#graphPoints'),
  graphEmpty: $('#graphEmpty'),
  densityEstimate: $('#densityEstimate'),
  formulaStrip: $('#formulaStrip'),
  conclusionStatus: $('#conclusionStatus'),
};

function makeState() {
  return {
    prediction: null,
    selectedSpecimenId: 'specimen-a',
    observation: { weighed: false, submerged: false },
    records: [],
    materialAttempt: null,
    identified: false,
    mobilePanel: 'case',
    notices: {
      prediction: null,
      bench: { key: 'startMeasure', kind: '', args: [] },
      entry: null,
      conclusion: null,
    },
  };
}

let state = makeState();
let lang = window.cool?.preferences?.lang || 'zh';
let t = (key) => key;
let muted = safeGet(SOUND_KEY) === 'off';
let audioContext = null;

function decimal(value, digits = 1) {
  return Number(value).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
}

function text(key, ...args) {
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
  state.notices[area] = { key, kind, args };
}

function renderNotice(element, notice) {
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
  return getSpecimen(state.selectedSpecimenId) || DENSITY_CASE.samples[0];
}

function recordFor(specimenId) {
  return state.records.find((record) => record.specimenId === specimenId) || null;
}

function nextUnrecordedSpecimen() {
  return DENSITY_CASE.samples.find((sample) => !recordFor(sample.id)) || null;
}

function observationForSelected() {
  const record = recordFor(state.selectedSpecimenId);
  return {
    weighed: Boolean(record || state.observation.weighed),
    submerged: Boolean(record || state.observation.submerged),
  };
}

function sampleTone(sample) {
  return `tone-${sample.tone}`;
}

function isCompactLayout() {
  return window.matchMedia('(max-width: 900px)').matches;
}

function switchMobilePanel(panel) {
  state.mobilePanel = panel;
  render();
}

function setMuted(nextMuted) {
  muted = nextMuted;
  safeSet(SOUND_KEY, muted ? 'off' : 'on');
  if (muted && audioContext?.state === 'running') audioContext.suspend().catch(() => {});
  renderSoundButton();
}

function renderSoundButton() {
  elements.soundBtn.textContent = muted ? '🔇' : '🔊';
  elements.soundBtn.setAttribute('aria-pressed', String(muted));
  elements.soundBtn.setAttribute('aria-label', text(muted ? 'soundOff' : 'soundOn'));
}

function tone(kind) {
  if (muted) return;
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    audioContext ||= new AudioCtor();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    const settings = {
      measure: { notes: [349], duration: 0.2, gain: 0.05, type: 'sine' },
      success: { notes: [523, 659], duration: 0.28, gain: 0.055, type: 'sine' },
      error: { notes: [180, 145], duration: 0.24, gain: 0.04, type: 'sawtooth' },
      complete: { notes: [440, 554, 659], duration: 0.54, gain: 0.065, type: 'sine' },
    }[kind] || { notes: [349], duration: 0.2, gain: 0.05, type: 'sine' };
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(settings.gain, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + settings.duration);
    gain.connect(audioContext.destination);
    settings.notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = settings.type;
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.1);
      oscillator.connect(gain);
      oscillator.start(now + index * 0.1);
      oscillator.stop(now + index * 0.1 + settings.duration * 0.56);
    });
  } catch {
    // Sound is optional; an unavailable audio implementation must not block the lab.
  }
}

function selectPrediction(prediction) {
  state.prediction = prediction;
  setNotice('prediction', prediction === 'density' ? 'predictionSaved' : 'predictionExplore', prediction === 'density' ? 'success' : '');
  window.cool?.stage('prediction');
  window.cool?.track?.('made_density_prediction', { prediction });
  tone(prediction === 'density' ? 'success' : 'measure');
  render();
}

function chooseSpecimen(specimenId) {
  if (recordFor(specimenId)) {
    setNotice('bench', 'sampleAlreadyRecorded', 'error');
    tone('error');
    render();
    return;
  }
  state.selectedSpecimenId = specimenId;
  state.observation = { weighed: false, submerged: false };
  state.notices.entry = null;
  setNotice('bench', 'startMeasure');
  elements.massEntry.value = '';
  elements.volumeEntry.value = '';
  if (isCompactLayout()) state.mobilePanel = 'bench';
  window.cool?.track?.('selected_density_specimen', { specimen: specimenId });
  tone('measure');
  render();
}

function weighSpecimen() {
  if (recordFor(state.selectedSpecimenId)) {
    setNotice('bench', 'sampleAlreadyRecorded', 'error');
    tone('error');
    render();
    return;
  }
  const measurement = createMeasurement(selectedSpecimen());
  state.observation.weighed = true;
  setNotice('bench', 'weighed', 'success', [measurement.massG]);
  state.notices.entry = null;
  window.cool?.stage('measure_mass');
  window.cool?.track?.('measured_mass', { specimen: measurement.specimenId, massG: measurement.massG });
  tone('measure');
  render();
}

function submergeSpecimen() {
  if (recordFor(state.selectedSpecimenId)) {
    setNotice('bench', 'sampleAlreadyRecorded', 'error');
    tone('error');
    render();
    return;
  }
  if (!state.observation.weighed) {
    setNotice('bench', 'weighFirst', 'error');
    tone('error');
    render();
    return;
  }
  const measurement = createMeasurement(selectedSpecimen());
  state.observation.submerged = true;
  setNotice('bench', 'submerged', 'success', [measurement.initialWaterMl, measurement.finalWaterMl]);
  setNotice('entry', 'entryReady');
  window.cool?.stage('measure_volume');
  window.cool?.track?.('measured_displacement', {
    specimen: measurement.specimenId,
    displacedVolumeMl: measurement.displacedVolumeMl,
  });
  tone('measure');
  render();
}

function numericInput(input) {
  if (input.value.trim() === '') return null;
  const value = Number(input.value);
  return Number.isFinite(value) ? value : null;
}

function recordMeasurement() {
  const specimen = selectedSpecimen();
  const measurement = createMeasurement(specimen);
  if (!state.observation.weighed || !state.observation.submerged) {
    setNotice('entry', 'needBothReadings', 'error');
    tone('error');
    render();
    return;
  }
  const enteredMass = numericInput(elements.massEntry);
  const enteredVolume = numericInput(elements.volumeEntry);
  const accurate = isMeasurementEntryAccurate(measurement, enteredMass, enteredVolume);
  elements.massEntry.classList.toggle('is-invalid', !accurate);
  elements.volumeEntry.classList.toggle('is-invalid', !accurate);
  if (!accurate) {
    setNotice('entry', 'entryWrong', 'error');
    window.cool?.track?.('corrected_density_reading', { specimen: specimen.id });
    tone('error');
    render();
    return;
  }

  state.records.push(measurement);
  state.observation = { weighed: false, submerged: false };
  elements.massEntry.value = '';
  elements.volumeEntry.value = '';
  elements.massEntry.classList.remove('is-invalid');
  elements.volumeEntry.classList.remove('is-invalid');
  setNotice('entry', 'recordSaved', 'success', [specimenLabel(specimen), measurement.densityGPerCm3]);
  window.cool?.track?.('logged_density_trial', { specimen: specimen.id });

  const next = nextUnrecordedSpecimen();
  if (next) {
    state.selectedSpecimenId = next.id;
    setNotice('bench', 'startMeasure');
  } else {
    const slope = calculateMassVolumeSlope(state.records);
    setNotice('bench', 'allRecorded', 'success');
    setNotice('conclusion', 'allRecorded', '');
    window.cool?.stage('evidence_complete');
    if (isCompactLayout()) state.mobilePanel = 'evidence';
    window.cool?.track?.('completed_density_trials', { slope });
  }
  tone(next ? 'success' : 'complete');
  render();
}

function identifySelectedMaterial(materialId) {
  if (state.records.length !== DENSITY_CASE.samples.length) {
    setNotice('conclusion', 'identifyNeedRecords', 'error');
    tone('error');
    render();
    return;
  }
  const slope = calculateMassVolumeSlope(state.records);
  const identified = identifyMaterial(slope);
  state.materialAttempt = materialId;
  if (identified?.id !== materialId) {
    setNotice('conclusion', 'identifyWrong', 'error');
    window.cool?.track?.('incorrect_density_identification', { material: materialId });
    tone('error');
    render();
    return;
  }
  state.identified = true;
  setNotice('conclusion', 'caseClosed', 'success', [materialLabel(materialId), slope]);
  window.cool?.complete?.();
  window.cool?.track?.('identified_density_material', { material: materialId, densityGPerCm3: slope });
  tone('complete');
  render();
}

function resetCase() {
  state = makeState();
  setNotice('bench', 'resetDone', 'success');
  state.mobilePanel = isCompactLayout() ? 'case' : state.mobilePanel;
  elements.massEntry.value = '';
  elements.volumeEntry.value = '';
  elements.massEntry.classList.remove('is-invalid');
  elements.volumeEntry.classList.remove('is-invalid');
  window.cool?.track?.('reset_density_case');
  tone('measure');
  render();
}

function renderPrediction() {
  document.querySelectorAll('[data-prediction]').forEach((button) => {
    button.classList.toggle('is-selected', button.dataset.prediction === state.prediction);
    button.setAttribute('aria-pressed', String(button.dataset.prediction === state.prediction));
  });
  renderNotice(elements.predictionFeedback, state.notices.prediction);
}

function renderSpecimenShelf() {
  const completeCount = state.records.length;
  elements.recordCount.textContent = `${completeCount} / ${DENSITY_CASE.samples.length}`;
  document.querySelectorAll('[data-specimen]').forEach((button) => {
    const recorded = Boolean(recordFor(button.dataset.specimen));
    button.disabled = recorded;
    button.classList.toggle('is-selected', button.dataset.specimen === state.selectedSpecimenId && !recorded);
    button.classList.toggle('is-complete', recorded);
    if (recorded) button.setAttribute('aria-label', `${button.textContent.trim()} · ${text('recordedMark')}`);
    else button.removeAttribute('aria-label');
  });
}

function renderInstruments() {
  const specimen = selectedSpecimen();
  const measurement = createMeasurement(specimen);
  const observation = observationForSelected();
  const alreadyRecorded = Boolean(recordFor(specimen.id));
  const waterLevel = observation.submerged ? measurement.finalWaterMl : measurement.initialWaterMl;
  const waterScale = Math.min(0.94, Math.max(0.12, waterLevel / 75));

  elements.selectedSpecimen.textContent = specimenLabel(specimen);
  elements.balanceReading.textContent = observation.weighed ? decimal(measurement.massG) : '—';
  elements.massReadout.textContent = observation.weighed ? `${decimal(measurement.massG)} g` : '—';
  elements.initialReading.textContent = `${decimal(measurement.initialWaterMl)} mL`;
  elements.finalReading.textContent = observation.submerged ? `${decimal(measurement.finalWaterMl)} mL` : '—';
  elements.waterFill.style.setProperty('--water-level', String(waterScale));
  elements.balanceSpecimen.className = `bench-specimen ${sampleTone(specimen)}${observation.weighed ? ' is-visible' : ''}`;
  elements.waterSpecimen.className = `water-specimen ${sampleTone(specimen)}${observation.submerged ? ' is-visible' : ''}`;
  elements.weighBtn.disabled = alreadyRecorded || observation.weighed;
  elements.submergeBtn.disabled = alreadyRecorded || !observation.weighed || observation.submerged;

  let stateKey = 'waiting';
  if (state.records.length === DENSITY_CASE.samples.length) stateKey = 'evidenceReady';
  else if (observation.submerged) stateKey = 'readyToRecord';
  else if (observation.weighed) stateKey = 'weighing';
  elements.labState.textContent = text(stateKey);
  elements.labState.classList.toggle('is-active', stateKey !== 'waiting');
  renderNotice(elements.benchFeedback, state.notices.bench);
}

function renderEntry() {
  const specimen = selectedSpecimen();
  const ready = state.observation.weighed && state.observation.submerged && !recordFor(specimen.id);
  elements.massEntry.disabled = !ready;
  elements.volumeEntry.disabled = !ready;
  elements.recordBtn.disabled = !ready;
  renderNotice(elements.entryFeedback, state.notices.entry);
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
  state.records.forEach((record) => {
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

  const slope = calculateMassVolumeSlope(state.records);
  if (state.records.length > 1 && slope !== null) {
    const end = graphPoint({ volumeCm3: 30, massG: slope * 30 });
    elements.graphFit.setAttribute('d', `M34 150 L${end.x.toFixed(2)} ${end.y.toFixed(2)}`);
  } else {
    elements.graphFit.setAttribute('d', '');
  }
  const complete = state.records.length === DENSITY_CASE.samples.length;
  elements.densityEstimate.textContent = complete && slope !== null ? `ρ = ${decimal(slope, 2)} g/cm³` : 'ρ = —';
  elements.graphEmpty.hidden = state.records.length > 0;
  elements.formulaStrip.hidden = state.records.length === 0;
}

function renderMaterialCheck() {
  const ready = state.records.length === DENSITY_CASE.samples.length;
  document.querySelectorAll('[data-material]').forEach((button) => {
    const id = button.dataset.material;
    button.disabled = !ready || state.identified;
    button.classList.toggle('is-correct', state.identified && id === state.materialAttempt);
    button.classList.toggle('is-wrong', !state.identified && id === state.materialAttempt);
  });
  renderNotice(elements.conclusionStatus, state.notices.conclusion);
}

function renderMobileNavigation() {
  elements.app.dataset.mobilePanel = state.mobilePanel;
  document.querySelectorAll('[data-mobile-panel]').forEach((button) => {
    if (!button.classList.contains('mobile-nav__button')) return;
    const active = button.dataset.mobilePanel === state.mobilePanel;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function render() {
  document.title = text('doc');
  renderSoundButton();
  elements.themeBtn.setAttribute('aria-label', text('theme'));
  elements.langBtn.setAttribute('aria-label', text('lang'));
  elements.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
  elements.themeBtn.textContent = window.cool?.preferences?.theme === 'light' ? '🌙' : '☀️';
  renderPrediction();
  renderSpecimenShelf();
  renderInstruments();
  renderEntry();
  renderRecordTable();
  renderGraph();
  renderMaterialCheck();
  renderMobileNavigation();
}

document.querySelectorAll('[data-prediction]').forEach((button) => {
  button.addEventListener('click', () => selectPrediction(button.dataset.prediction));
});

document.querySelectorAll('[data-specimen]').forEach((button) => {
  button.addEventListener('click', () => chooseSpecimen(button.dataset.specimen));
});

document.querySelectorAll('[data-material]').forEach((button) => {
  button.addEventListener('click', () => identifySelectedMaterial(button.dataset.material));
});

document.querySelectorAll('.mobile-nav__button').forEach((button) => {
  button.addEventListener('click', () => switchMobilePanel(button.dataset.mobilePanel));
});

elements.weighBtn.addEventListener('click', weighSpecimen);
elements.submergeBtn.addEventListener('click', submergeSpecimen);
elements.recordBtn.addEventListener('click', recordMeasurement);
$('#resetBtn').addEventListener('click', resetCase);
elements.soundBtn.addEventListener('click', () => setMuted(!muted));
elements.themeBtn.addEventListener('click', () => window.cool?.preferences?.toggleTheme?.());
elements.langBtn.addEventListener('click', () => window.cool?.preferences?.toggleLang?.());
elements.massEntry.addEventListener('input', () => elements.massEntry.classList.remove('is-invalid'));
elements.volumeEntry.addEventListener('input', () => elements.volumeEntry.classList.remove('is-invalid'));

window.cool?.bindI18n?.(I18N, {
  onChange({ t: translate, lang: nextLang }) {
    t = translate;
    lang = nextLang;
    render();
  },
});
