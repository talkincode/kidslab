import {
  CORRECT_WIRING,
  curvesFor,
  createLab,
  measureCircuit,
  recordTrial,
  restoreLab,
  setConclusion,
  setPrediction,
  testDesign,
} from './ohms-model.js';

const SAVE_KEY = 'kidslab.ohms-law-lab';
const SOUND_KEY = 'kidslab.ohms-law-lab.sound';

const I18N = {
  zh: {
    doc: '⚡ 欧姆定律实验室 · KidsLab',
    back: '返回平台',
    title: '欧姆定律实验室',
    benchNav: '接线台',
    notebookNav: '数据册',
    missionNav: '任务',
    benchEyebrow: '安全接线台',
    benchTitle: '让电流穿过电阻',
    battery: '电源',
    wiringLabel: '把电表接在哪里？',
    wireRight: 'A 串联 · V 并联',
    wireShort: 'A 并联',
    wireOpen: 'V 串联',
    voltageLabel: '电源电压',
    resistanceLabel: '电阻',
    ammeterRange: '电流表量程',
    voltmeterRange: '电压表量程',
    record: '合上开关，记录读数',
    notebookEyebrow: '你的证据',
    notebookTitle: 'U-I 数据册',
    trial: '次数',
    dataNote: '同一电阻至少留下两组读数，再换另一个电阻。',
    reset: '重新实验',
    predictionUp: '电压变大，电流会变大',
    predictionDown: '电压变大，电流会变小',
    conclusionLower: '电阻更大，图线更平',
    conclusionSame: '两条图线一样陡',
    designTarget: '用 20 Ω 电阻做出 0.30 A',
    designPrompt: '选好电压和量程后，检验你的设计。',
    testDesign: '检验设计',
    complete: '两条线都亮起来了！',
    hint: '给我一点提示',
    hideHint: '收起提示',
    safety: '这是理想电阻的虚拟实验；真实电路请在教师指导下操作。',
    soundOff: '关闭声音',
    soundOn: '打开声音',
    theme: '切换主题',
    phase: {
      predict: ['先做一个预测', '先猜一猜：电压变大时，通过同一个电阻的电流会怎样？'],
      'measure-10': ['留两条 10 Ω 证据', '把电阻保持在 10 Ω，记录两种电压下的读数。'],
      'measure-20': ['换成 20 Ω 对照', '只换电阻为 20 Ω，再留下两种不同电压的读数。'],
      conclude: ['让图线说话', '看两条 U-I 图线：哪一条更平？选出你的结论。'],
      design: ['自己设计一次电流', '现在让 20 Ω 电阻中的电流恰好达到 0.30 A。'],
      complete: ['实验完成！', '你用两组对照数据和一次设计，点亮了欧姆定律。'],
    },
    feedback: {
      ready: '先选一个预测；你的数据册会替你保留每次正确读数。',
      prediction: '预测已写下。现在用 10 Ω 电阻留下两组读数。',
      recorded: (u, i) => `记录成功：${u.toFixed(1)} V 对应 ${i.toFixed(2)} A。`,
      'short-circuit': '保护器跳开：电流表并联会近似短路。把 A 改回串联，数据没有丢。',
      'open-circuit': '这里读不到正确电流：电压表应并联在电阻两端。接好后马上再试。',
      'voltmeter-overload': '电压表超量程了。先换到更大的量程，原有数据都保留。',
      'ammeter-overload': '电流表超量程了。先换到更大的量程，原有数据都保留。',
      'wrong-resistor': '这一步要先保持指定电阻不变。换回任务中的电阻再记录。',
      'already-recorded': '这一组 U 和 R 已经在数据册里了。换一个电压再试。',
      'wrong-conclusion': '再看一眼斜率：电阻更大的那条线应当更平。数据还在，随时重选。',
      conclusion: '结论写好了！最后，用 20 Ω 设计出 0.30 A 吧。',
      'target-missed': '还没到 0.30 A。保持 20 Ω，调整电压和量程后再检验。',
      designed: '命中 0.30 A！你让 U、I、R 三个量配合起来了。',
      reset: '实验台已清空，可以从一个新预测开始。',
      restored: '已恢复上一次的实验记录。',
      invalidSave: '上一次保存的数据不完整，已安全清空并从头开始。',
      'phase-not-ready': '先按任务顺序留下证据，再继续下一步。',
      'invalid-wiring': '先选择一种完整的接线方式。',
      'invalid-setup': '请选择实验台提供的电压、电阻和量程。',
    },
    hintText: {
      predict: '一次只改变一个量。先固定电阻，再看看电压变大时电流表怎么动。',
      'measure-10': '10 Ω 不动，选两种不同电压；每次都确认电表量程够大。',
      'measure-20': '换成 20 Ω 后，仍然只改变电压，才能和 10 Ω 那条线公平比较。',
      conclude: '图线的“陡”表示每增加同样的电压，电流增加得有多快。',
      design: '先想想：20 Ω × 0.30 A 需要多少伏？再检查两个表的量程。',
      complete: '温度不变时，欧姆性电阻满足 I = U / R；真实元件可能有误差。',
    },
  },
  en: {
    doc: "⚡ Ohm's Law Lab · KidsLab",
    back: 'Back to platform',
    title: "Ohm's Law Lab",
    benchNav: 'Bench',
    notebookNav: 'Data',
    missionNav: 'Mission',
    benchEyebrow: 'Safe wiring bench',
    benchTitle: 'Send current through a resistor',
    battery: 'supply',
    wiringLabel: 'Where do the meters go?',
    wireRight: 'A series · V parallel',
    wireShort: 'A parallel',
    wireOpen: 'V series',
    voltageLabel: 'Supply voltage',
    resistanceLabel: 'Resistance',
    ammeterRange: 'Ammeter range',
    voltmeterRange: 'Voltmeter range',
    record: 'Close switch & record',
    notebookEyebrow: 'Your evidence',
    notebookTitle: 'U-I notebook',
    trial: 'Trial',
    dataNote: 'Keep one resistor for two readings, then swap to the other resistor.',
    reset: 'Start over',
    predictionUp: 'More voltage makes more current',
    predictionDown: 'More voltage makes less current',
    conclusionLower: 'More resistance makes a flatter line',
    conclusionSame: 'Both lines are equally steep',
    designTarget: 'Make 0.30 A with a 20 Ω resistor',
    designPrompt: 'Choose a voltage and ranges, then test your design.',
    testDesign: 'Test my design',
    complete: 'Both lines are glowing!',
    hint: 'Give me a hint',
    hideHint: 'Hide hint',
    safety: 'This is an ideal-resistor simulation. Use real circuits only with a teacher.',
    soundOff: 'Turn sound off',
    soundOn: 'Turn sound on',
    theme: 'Switch theme',
    phase: {
      predict: ['Make a prediction', 'What do you think happens to current through one resistor when voltage rises?'],
      'measure-10': ['Leave two 10 Ω clues', 'Keep the resistor at 10 Ω and record readings at two voltages.'],
      'measure-20': ['Swap to 20 Ω', 'Change only the resistor to 20 Ω, then leave two readings at different voltages.'],
      conclude: ['Let the lines talk', 'Look at both U-I lines. Which one is flatter? Choose your conclusion.'],
      design: ['Design a current', 'Now make the current through 20 Ω exactly 0.30 A.'],
      complete: ['Experiment complete!', 'Two controlled data sets and one design have lit up Ohm’s law.'],
    },
    feedback: {
      ready: 'Make a prediction first. Your notebook will keep every correct reading.',
      prediction: 'Prediction saved. Now leave two readings with the 10 Ω resistor.',
      recorded: (u, i) => `Recorded: ${u.toFixed(1)} V gives ${i.toFixed(2)} A.`,
      'short-circuit': 'Protection opened: a parallel ammeter is almost a short circuit. Put A back in series; your data is safe.',
      'open-circuit': 'That cannot read the voltage correctly: put V in parallel across the resistor, then try again.',
      'voltmeter-overload': 'The voltmeter is over range. Choose the larger range; your earlier data stays.',
      'ammeter-overload': 'The ammeter is over range. Choose the larger range; your earlier data stays.',
      'wrong-resistor': 'Keep the task’s resistor fixed for this step, then record again.',
      'already-recorded': 'That U and R pair is already in your notebook. Try another voltage.',
      'wrong-conclusion': 'Look once more at the slopes: the larger resistor should have the flatter line. Your data is still here.',
      conclusion: 'Conclusion saved! Last challenge: design 0.30 A with 20 Ω.',
      'target-missed': 'Not 0.30 A yet. Keep 20 Ω, adjust voltage and ranges, then test again.',
      designed: 'Exactly 0.30 A! You made U, I, and R work together.',
      reset: 'The bench is clear. Start a fresh prediction whenever you are ready.',
      restored: 'Your last experiment was restored.',
      invalidSave: 'The saved experiment was incomplete, so it was safely cleared.',
      'phase-not-ready': 'Follow the mission order and leave evidence before the next step.',
      'invalid-wiring': 'Choose a complete wiring option first.',
      'invalid-setup': 'Choose a voltage, resistor, and meter ranges from this bench.',
    },
    hintText: {
      predict: 'Change just one thing at a time. Keep resistance fixed, then watch what the ammeter does as voltage rises.',
      'measure-10': 'Keep 10 Ω fixed, choose two voltages, and make sure each meter range is large enough.',
      'measure-20': 'After choosing 20 Ω, change only voltage. That makes a fair comparison with the 10 Ω line.',
      conclude: 'A line’s steepness shows how much current increases for the same voltage increase.',
      design: 'Think first: what voltage is 20 Ω × 0.30 A? Then check both meter ranges.',
      complete: 'At constant temperature, an ohmic resistor follows I = U / R. Real components can have error.',
    },
  },
};

const els = {
  app: document.getElementById('app'),
  backBtn: document.getElementById('backBtn'),
  soundBtn: document.getElementById('soundBtn'),
  themeBtn: document.getElementById('themeBtn'),
  langBtn: document.getElementById('langBtn'),
  mobileNav: [...document.querySelectorAll('.mobile-nav [data-mobile-panel]')],
  wiring: [...document.querySelectorAll('[data-wire]')],
  voltage: document.getElementById('voltageSelect'),
  resistance: document.getElementById('resistanceSelect'),
  ammeterRange: document.getElementById('ammeterRange'),
  voltmeterRange: document.getElementById('voltmeterRange'),
  ampReadout: document.getElementById('ampReadout'),
  voltReadout: document.getElementById('voltReadout'),
  resistorReadout: document.getElementById('resistorReadout'),
  instrumentNote: document.getElementById('instrumentNote'),
  recordBtn: document.getElementById('recordBtn'),
  trialCount: document.getElementById('trialCount'),
  trialRows: document.getElementById('trialRows'),
  graphLines: document.getElementById('graphLines'),
  phaseLabel: document.getElementById('phaseLabel'),
  missionTitle: document.getElementById('missionTitle'),
  missionText: document.getElementById('missionText'),
  predictionChoices: document.getElementById('predictionChoices'),
  conclusionChoices: document.getElementById('conclusionChoices'),
  predictionButtons: [...document.querySelectorAll('[data-prediction]')],
  conclusionButtons: [...document.querySelectorAll('[data-conclusion]')],
  designCard: document.getElementById('designCard'),
  designBtn: document.getElementById('designBtn'),
  completeCard: document.getElementById('completeCard'),
  feedback: document.getElementById('feedback'),
  hintBtn: document.getElementById('hintBtn'),
  hintText: document.getElementById('hintText'),
  resetBtn: document.getElementById('resetBtn'),
};

let t = (key) => key;
let activeLang = 'zh';
let lab = createLab();
let setup = {
  voltageV: 1.5,
  resistanceOhm: 10,
  ammeterRangeA: 0.3,
  voltmeterRangeV: 3,
  wiring: CORRECT_WIRING,
};
let feedbackKey = 'ready';
let feedbackArgs = [];
let feedbackKind = '';
let showHint = false;
let mobilePanel = 'bench';
let muted = localStorage.getItem(SOUND_KEY) === 'true';
let audioContext = null;

function message(key, ...args) {
  const template = I18N[activeLang].feedback[key] || I18N[activeLang].feedback['invalid-setup'];
  return typeof template === 'function' ? template(...args) : template;
}

function setFeedback(key, kind = '', ...args) {
  feedbackKey = key;
  feedbackArgs = args;
  feedbackKind = kind;
}

function parseSetup(saved) {
  if (!saved || typeof saved !== 'object') return null;
  const candidate = {
    voltageV: Number(saved.voltageV),
    resistanceOhm: Number(saved.resistanceOhm),
    ammeterRangeA: Number(saved.ammeterRangeA),
    voltmeterRangeV: Number(saved.voltmeterRangeV),
    wiring: saved.wiring,
  };
  return measureCircuit(candidate).reason === 'invalid-setup' ? null : candidate;
}

function restore() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    const restoredLab = restoreLab(saved.lab);
    const restoredSetup = parseSetup(saved.setup);
    if (!restoredLab || !restoredSetup) throw new TypeError('invalid saved Ohm lab state');
    lab = restoredLab;
    setup = restoredSetup;
    showHint = Boolean(saved.showHint);
    setFeedback('restored', 'is-success');
  } catch {
    localStorage.removeItem(SAVE_KEY);
    setFeedback('invalidSave', 'is-error');
  }
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ lab, setup, showHint }));
}

function updateSetupFromInputs() {
  setup = {
    voltageV: Number(els.voltage.value),
    resistanceOhm: Number(els.resistance.value),
    ammeterRangeA: Number(els.ammeterRange.value),
    voltmeterRangeV: Number(els.voltmeterRange.value),
    wiring: setup.wiring,
  };
}

function formatCurrent(currentA) {
  return Number.isFinite(currentA) ? `${currentA.toFixed(2)} A` : '— A';
}

function renderCircuit() {
  const reading = measureCircuit(setup);
  els.voltage.value = String(setup.voltageV);
  els.resistance.value = String(setup.resistanceOhm);
  els.ammeterRange.value = String(setup.ammeterRangeA);
  els.voltmeterRange.value = String(setup.voltmeterRangeV);
  els.wiring.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.wire === setup.wiring));
  });
  els.resistorReadout.textContent = `${setup.resistanceOhm} Ω`;
  els.voltReadout.textContent = reading.ok ? `${reading.voltageV.toFixed(1)} V` : '— V';
  els.ampReadout.textContent = reading.ok ? formatCurrent(reading.currentA) : '— A';
  els.instrumentNote.textContent = reading.ok
    ? `${setup.voltageV.toFixed(1)} V · ${setup.resistanceOhm} Ω · ${formatCurrent(reading.currentA)}`
    : message(reading.reason);
  els.recordBtn.disabled = !['measure-10', 'measure-20'].includes(lab.phase);
}

function renderRows() {
  els.trialRows.replaceChildren();
  lab.trials.forEach((trial, index) => {
    const row = document.createElement('tr');
    [index + 1, trial.voltageV.toFixed(1), trial.currentA.toFixed(2), trial.resistanceOhm]
      .forEach((value) => {
        const cell = document.createElement('td');
        cell.textContent = String(value);
        row.append(cell);
      });
    els.trialRows.append(row);
  });
  els.trialCount.textContent = String(lab.trials.length);
}

function svgNode(name, attributes) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function renderGraph() {
  els.graphLines.replaceChildren();
  curvesFor(lab).forEach((curve) => {
    const className = curve.resistanceOhm === 10 ? 'ten' : 'twenty';
    const point = (trial) => ({
      x: 38 + (trial.voltageV / 6) * 264,
      y: 156 - (trial.currentA / .6) * 138,
    });
    const positions = curve.points.map(point);
    if (positions.length > 1) {
      els.graphLines.append(svgNode('polyline', {
        class: `plot-${className}`,
        points: positions.map(({ x, y }) => `${x},${y}`).join(' '),
      }));
    }
    positions.forEach(({ x, y }) => {
      els.graphLines.append(svgNode('circle', { class: `point-${className}`, cx: x, cy: y, r: 5 }));
    });
  });
}

function renderMission() {
  const [title, copy] = I18N[activeLang].phase[lab.phase];
  els.phaseLabel.textContent = I18N[activeLang].missionNav;
  els.missionTitle.textContent = title;
  els.missionText.textContent = copy;
  els.predictionChoices.hidden = lab.phase !== 'predict';
  els.conclusionChoices.hidden = lab.phase !== 'conclude';
  els.designCard.hidden = lab.phase !== 'design';
  els.completeCard.hidden = lab.phase !== 'complete';
  els.predictionButtons.forEach((button) => {
    button.disabled = lab.phase !== 'predict';
    button.classList.toggle('is-selected', lab.prediction === button.dataset.prediction);
  });
  els.conclusionButtons.forEach((button) => {
    button.disabled = lab.phase !== 'conclude';
  });
  els.feedback.textContent = message(feedbackKey, ...feedbackArgs);
  els.feedback.className = `feedback ${feedbackKind}`;
  els.hintBtn.textContent = t(showHint ? 'hideHint' : 'hint');
  els.hintBtn.setAttribute('aria-expanded', String(showHint));
  els.hintText.hidden = !showHint;
  els.hintText.textContent = I18N[activeLang].hintText[lab.phase];
}

function renderChrome() {
  document.title = t('doc');
  els.backBtn.setAttribute('aria-label', t('back'));
  els.langBtn.textContent = activeLang === 'zh' ? 'EN' : '中';
  els.themeBtn.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
  els.themeBtn.setAttribute('aria-label', t('theme'));
  els.soundBtn.textContent = muted ? '🔇' : '🔊';
  els.soundBtn.setAttribute('aria-pressed', String(muted));
  els.soundBtn.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
  els.app.dataset.mobilePanel = mobilePanel;
  els.mobileNav.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.mobilePanel === mobilePanel));
  });
}

function render() {
  renderChrome();
  renderCircuit();
  renderRows();
  renderGraph();
  renderMission();
}

function playTone(kind) {
  const frequency = { select: 430, record: 600, error: 170, success: 760, complete: 920 }[kind];
  if (!frequency || muted) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioContext) audioContext = new AudioContextClass();
    const play = () => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;
      oscillator.type = kind === 'error' ? 'sawtooth' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      if (kind === 'complete') oscillator.frequency.exponentialRampToValueAtTime(1240, now + .22);
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(.1, now + .015);
      gain.gain.exponentialRampToValueAtTime(.0001, now + (kind === 'complete' ? .38 : .18));
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + (kind === 'complete' ? .4 : .2));
    };
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(play).catch(() => { audioContext = null; });
    } else {
      play();
    }
  } catch {
    audioContext = null;
  }
}

function record() {
  const result = recordTrial(lab, setup);
  if (!result.ok) {
    setFeedback(result.reason, 'is-error');
    window.cool?.track('circuit-fault', { reason: result.reason });
    playTone('error');
  } else {
    lab = result.lab;
    setFeedback('recorded', 'is-success', result.trial.voltageV, result.trial.currentA);
    window.cool?.stage('level2');
    window.cool?.track('measure-circuit', { resistanceOhm: result.trial.resistanceOhm });
    mobilePanel = 'notebook';
    playTone('record');
  }
  save();
  render();
}

function choosePrediction(prediction) {
  const result = setPrediction(lab, prediction);
  if (!result.ok) return;
  lab = result.lab;
  setFeedback('prediction', 'is-success');
  window.cool?.track('predict-current', { prediction });
  save();
  playTone('select');
  render();
}

function chooseConclusion(conclusion) {
  const result = setConclusion(lab, conclusion);
  if (!result.ok) {
    setFeedback(result.reason, 'is-error');
    window.cool?.track('write-conclusion', { correct: false });
    playTone('error');
  } else {
    lab = result.lab;
    setFeedback('conclusion', 'is-success');
    window.cool?.track('write-conclusion', { correct: true });
    playTone('success');
  }
  save();
  render();
}

function design() {
  const result = testDesign(lab, setup);
  if (!result.ok) {
    setFeedback(result.reason, 'is-error');
    window.cool?.track('design-current', { correct: false });
    playTone('error');
  } else {
    lab = result.lab;
    setFeedback('designed', 'is-success');
    window.cool?.track('design-current', { correct: true });
    window.cool?.complete?.();
    playTone('complete');
  }
  save();
  render();
}

function reset() {
  lab = createLab();
  setup = { voltageV: 1.5, resistanceOhm: 10, ammeterRangeA: 0.3, voltmeterRangeV: 3, wiring: CORRECT_WIRING };
  showHint = false;
  mobilePanel = 'bench';
  localStorage.removeItem(SAVE_KEY);
  window.cool?.progress?.clear();
  setFeedback('reset', 'is-success');
  playTone('select');
  render();
}

els.wiring.forEach((button) => {
  button.addEventListener('click', () => {
    setup.wiring = button.dataset.wire;
    setFeedback('ready');
    save();
    window.cool?.track('wire-meters', { wiring: setup.wiring });
    playTone('select');
    render();
  });
});
[
  els.voltage,
  els.resistance,
  els.ammeterRange,
  els.voltmeterRange,
].forEach((input) => {
  input.addEventListener('change', () => {
    updateSetupFromInputs();
    setFeedback('ready');
    save();
    window.cool?.track('change-meter-setting');
    playTone('select');
    render();
  });
});
els.recordBtn.addEventListener('click', record);
els.predictionButtons.forEach((button) => button.addEventListener('click', () => choosePrediction(button.dataset.prediction)));
els.conclusionButtons.forEach((button) => button.addEventListener('click', () => chooseConclusion(button.dataset.conclusion)));
els.designBtn.addEventListener('click', design);
els.resetBtn.addEventListener('click', reset);
els.hintBtn.addEventListener('click', () => {
  showHint = !showHint;
  save();
  playTone('select');
  render();
});
els.mobileNav.forEach((button) => button.addEventListener('click', () => {
  mobilePanel = button.dataset.mobilePanel;
  render();
}));
els.soundBtn.addEventListener('click', () => {
  muted = !muted;
  localStorage.setItem(SOUND_KEY, String(muted));
  render();
  if (!muted) playTone('select');
});
els.themeBtn.addEventListener('click', () => window.cool.preferences.toggleTheme());
els.langBtn.addEventListener('click', () => window.cool.preferences.toggleLang());

restore();
window.cool.bindI18n(I18N, {
  onChange({ t: translate, lang }) {
    t = translate;
    activeLang = lang;
    render();
  },
});
