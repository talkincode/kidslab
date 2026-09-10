import {
  CORRECT_WIRING,
  DEFAULT_SETUP,
  deriveExperiment,
  graphPoint,
  recordObservation,
  restoreExperiment,
  theoryLineEnd,
} from './ohms-model.js';
import { createAudio } from './audio.js';
import { createCircuitScene } from './scene.js';

const SAVE_KEY = 'kidslab.ohms-law-lab';
const $ = (id) => document.getElementById(id);

const I18N = {
  zh: {
    fallback: '这台设备暂时不能显示 3D 实验桌，仍可以用右侧旋钮看电压和电流。',
    back: '返回平台',
    title: '欧姆定律实验室',
    measuredU: '电压 · 推力',
    measuredI: '电流 · 流量',
    selectedR: '电阻 · 拥挤',
    observeTitle: '拧电压和电阻，看光点跑多快',
    zoomIn: '放大',
    zoomOut: '缩小',
    perspective: '立体',
    topView: '俯视',
    record: '记下这一组读数',
    panelTitle: '观测台',
    voltageLabel: '电源电压 U',
    resistanceLabel: '电阻 R',
    ammeterRange: '电流表量程',
    voltmeterRange: '电压表量程',
    supply: '电源设定',
    theoryI: '此刻电流',
    notebookTitle: 'U-I 观测图',
    legend: '虚线：当前电阻 · 空心点：记下的 · 实心点：现在',
    trial: '次数',
    reset: '清空记录',
    lessonTitle: '小课堂：电压、电流、电阻',
    lessonText: '电压是推电流的力气，电阻是小路有多挤，电流是走过去的流量。力气越大、小路越宽，流量越大。',
    sceneHelp: '拖空白转视角 · 滚轮缩放 · 光点从正极走向负极',
    ready: '慢慢拧旋钮。数字会跟着变。',
    recorded: '记下了。换一个电阻，看点子会不会排成另一条线。',
    cleared: '记录清空了，旋钮还留在原处。',
    restoredSafe: '已回到正确接线，上次的记录还在。',
    live: '电表正在读数。',
    protected: '保护断开',
    theory: '此刻',
    sound: '切换音效',
    musicOn: '关闭背景音乐',
    musicOff: '打开背景音乐',
    sfxOn: '关闭音效',
    sfxOff: '打开音效',
    theme: '切换主题',
    liveStatus: '通路接通',
    faultStatus: '保护断开',
    openStatus: '近似断路',
    'fault.short-circuit': '电流表被并到电源两端，保护断电。',
    'fault.open-circuit': '电压表串进回路，电流几乎为零。',
    'fault.voltmeter-overload': '电压表超量程。请改用 15 V 量程。',
    'fault.ammeter-overload': '电流表超量程。请改用 3 A 量程。',
    'fault.already-recorded': '这组已经记过了，换一组电压或电阻。',
    'fault.invalid-setup': '这个设定超出实验台范围。',
    'fault.invalid-wiring': '请回到正常接线。',
  },
  en: {
    fallback: 'This device cannot show the 3D bench. You can still turn the knobs and read the meters.',
    back: 'Back to platform',
    title: "Ohm’s Law Lab",
    measuredU: 'Voltage · push',
    measuredI: 'Current · flow',
    selectedR: 'Resistance · squeeze',
    observeTitle: 'Twist voltage and resistance. Watch the spark.',
    zoomIn: 'Zoom +',
    zoomOut: 'Zoom −',
    perspective: '3D',
    topView: 'Top',
    record: 'Save this reading',
    panelTitle: 'Observation deck',
    voltageLabel: 'Supply voltage U',
    resistanceLabel: 'Resistance R',
    ammeterRange: 'Ammeter range',
    voltmeterRange: 'Voltmeter range',
    supply: 'Supply setting',
    theoryI: 'Current now',
    notebookTitle: 'U-I plot',
    legend: 'Dashed: this R · Hollow: saved · Filled: live',
    trial: 'No.',
    reset: 'Clear records',
    lessonTitle: 'Mini lesson: voltage, current, resistance',
    lessonText: 'Voltage is the push, resistance is how tight the path is, current is the flow. More push or a wider path means more flow.',
    sceneHelp: 'Drag to orbit · scroll to zoom · sparks travel + to −',
    ready: 'Turn a knob. The numbers follow.',
    recorded: 'Saved. Change resistance and see if a new line appears.',
    cleared: 'Records cleared. The knobs stayed put.',
    restoredSafe: 'Wiring restored. Your notes are still here.',
    live: 'Meters are reading.',
    protected: 'Protection open',
    theory: 'Now',
    sound: 'Toggle sound',
    musicOn: 'Mute music',
    musicOff: 'Unmute music',
    sfxOn: 'Mute sound effects',
    sfxOff: 'Unmute sound effects',
    theme: 'Switch theme',
    liveStatus: 'Circuit live',
    faultStatus: 'Protection open',
    openStatus: 'Almost open circuit',
    'fault.short-circuit': 'The ammeter is across the supply. Protection opened.',
    'fault.open-circuit': 'The voltmeter is in series, so almost no current flows.',
    'fault.voltmeter-overload': 'Voltage is too high for this voltmeter. Choose the 15 V range.',
    'fault.ammeter-overload': 'Current is too high for this ammeter. Choose the 3 A range.',
    'fault.already-recorded': 'Already saved. Try another voltage or resistance.',
    'fault.invalid-setup': 'That setting is outside this bench.',
    'fault.invalid-wiring': 'Return to the working circuit.',
  },
};

let lang = 'zh';
let t = (key) => I18N[lang][key];
let scene = null;
let feedback = 'ready';
let unlocked = false;
let lastStatus = 'live';
let experiment = restoreExperiment(null);
const audio = createAudio(SAVE_KEY);

try {
  const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
  experiment = restoreExperiment(saved);
  if (saved?.setup?.wiring && saved.setup.wiring !== CORRECT_WIRING) {
    feedback = 'restoredSafe';
  }
} catch {
  experiment = restoreExperiment(null);
}

const save = () => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: 2,
      setup: experiment.setup,
      trials: experiment.history,
    }));
  } catch { /* private mode */ }
};

const fmt = (value) => Number(value.toFixed(3)).toString();

function faultText(reason) {
  return I18N[lang][`fault.${reason}`] || t(reason) || reason;
}

function svg(name, attrs) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

function drawGraph(snapshot) {
  const root = $('graphLines');
  root.replaceChildren();
  const end = theoryLineEnd(snapshot.setup.resistanceOhm);
  root.append(svg('line', {
    x1: graphPoint(0, 0).x,
    y1: graphPoint(0, 0).y,
    x2: end.x,
    y2: end.y,
    stroke: '#c47916',
    'stroke-width': 2,
    'stroke-dasharray': '5 4',
    'data-theory-line': '',
  }));
  for (const [u, i] of [[0, 0], [3, 0.6], [6, 1.2]]) {
    const xLabel = svg('text', {
      x: graphPoint(u, 0).x, y: 174, 'text-anchor': 'middle', 'font-size': 14, fill: 'currentColor',
    });
    xLabel.textContent = u;
    root.append(xLabel);
    const yLabel = svg('text', {
      x: 32, y: graphPoint(0, i).y + 4, 'text-anchor': 'end', 'font-size': 14, fill: 'currentColor',
    });
    yLabel.textContent = i;
    root.append(yLabel);
  }
  snapshot.history.forEach((trial) => {
    const point = graphPoint(trial.voltageV, trial.currentA);
    const dot = svg('circle', {
      cx: point.x, cy: point.y, r: 8, fill: 'none', stroke: '#2686bd', 'stroke-width': 2, 'data-history-point': '',
    });
    const title = svg('title', {});
    title.textContent = `${trial.voltageV} V / ${trial.resistanceOhm} Ω = ${fmt(trial.currentA)} A`;
    dot.append(title);
    root.append(dot);
  });
  if (snapshot.measurement.ok) {
    const live = graphPoint(snapshot.measurement.voltageV, snapshot.measurement.currentA);
    root.append(svg('circle', {
      cx: live.x, cy: live.y, r: 6, fill: '#c47916', stroke: 'white', 'stroke-width': 2, 'data-live-point': '',
    }));
  }
}

function paint() {
  const snapshot = deriveExperiment(experiment.setup, experiment.history);
  const { setup, history, measurement } = snapshot;
  scene?.update(snapshot);
  $('app').dataset.status = snapshot.status;
  $('sceneStatus').textContent = t(measurement.ok ? 'liveStatus' : snapshot.status === 'open-circuit' ? 'openStatus' : 'faultStatus');
  $('supplySetting').textContent = `${t('supply')}：${setup.voltageV.toFixed(1)} V`;
  $('theoryCurrent').textContent = `${t('theoryI')}：${fmt(snapshot.theoreticalCurrentA)} A`;
  $('voltageSelect').value = setup.voltageV;
  $('resistanceSelect').value = setup.resistanceOhm;
  $('ammeterRange').value = setup.ammeterRangeA;
  $('voltmeterRange').value = setup.voltmeterRangeV;
  $('voltageValue').textContent = `${setup.voltageV.toFixed(1)} V`;
  $('resistanceValue').textContent = `${setup.resistanceOhm} Ω`;
  $('voltReadout').textContent = measurement.ok ? `${setup.voltageV.toFixed(1)} V` : '— V';
  $('ampReadout').textContent = measurement.ok ? `${fmt(measurement.currentA)} A` : '— A';
  $('resistorReadout').textContent = `${setup.resistanceOhm} Ω`;
  $('calculation').textContent = `${t('theory')} · ${setup.voltageV.toFixed(1)} V / ${setup.resistanceOhm} Ω = ${fmt(snapshot.theoreticalCurrentA)} A`;
  $('instrumentNote').textContent = measurement.ok ? '' : `${t('protected')} · ${faultText(measurement.reason)}`;
  $('recordBtn').disabled = !measurement.ok;
  $('trialCount').textContent = history.length;
  $('trialRows').replaceChildren(...history.map((trial, index) => {
    const row = document.createElement('tr');
    [index + 1, trial.voltageV.toFixed(1), fmt(trial.currentA), trial.resistanceOhm].forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    });
    return row;
  }));
  drawGraph(snapshot);
  $('feedback').textContent = I18N[lang][`fault.${feedback}`] || t(feedback);
  if (['ammeter-overload', 'voltmeter-overload', 'short-circuit', 'open-circuit'].includes(snapshot.status)) {
    $('missionTitle').textContent = faultText(snapshot.status);
  } else if (feedback === 'recorded' || feedback === 'cleared' || feedback === 'restoredSafe') {
    $('missionTitle').textContent = t(feedback);
  } else {
    $('missionTitle').textContent = t('observeTitle');
  }
  document.title = `⚡ ${t('title')} · KidsLab`;
  $('langBtn').textContent = lang === 'zh' ? 'EN' : '中';
  $('themeBtn').textContent = document.documentElement.dataset.theme === 'light' ? '🌙' : '☀️';
  $('themeBtn').setAttribute('aria-label', t('theme'));
  $('musicBtn').textContent = audio.musicOn ? '♫' : '♪';
  $('musicBtn').setAttribute('aria-pressed', String(audio.musicOn));
  $('musicBtn').setAttribute('aria-label', t(audio.musicOn ? 'musicOn' : 'musicOff'));
  $('soundBtn').textContent = audio.sfxOn ? '🔊' : '🔇';
  $('soundBtn').setAttribute('aria-pressed', String(audio.sfxOn));
  $('soundBtn').setAttribute('aria-label', t(audio.sfxOn ? 'sfxOn' : 'sfxOff'));
  if (snapshot.status !== lastStatus) {
    if (snapshot.status !== 'live') audio.error();
    lastStatus = snapshot.status;
  }
}

function unlockAll() {
  if (unlocked) return;
  unlocked = true;
  audio.unlock();
  window.cool?.stage?.('observe');
}

function applyPanel() {
  const open = $('panelHandle').getAttribute('aria-expanded') === 'true';
  $('panel').classList.toggle('is-collapsed', !open);
  $('panelBody').hidden = !open;
  $('panelArrow').textContent = open ? '▾' : '▸';
}

$('panelHandle').addEventListener('click', () => {
  const next = $('panelHandle').getAttribute('aria-expanded') !== 'true';
  $('panelHandle').setAttribute('aria-expanded', String(next));
  applyPanel();
});

function bindSetup(id, key, parser) {
  const fire = () => {
    experiment = {
      ...experiment,
      setup: { ...experiment.setup, [key]: parser($(id).value) },
    };
    feedback = 'ready';
    save();
    paint();
  };
  $(id).addEventListener('pointerdown', () => { unlockAll(); audio.pickup(); });
  $(id).addEventListener(id.endsWith('Select') ? 'input' : 'change', () => {
    unlockAll();
    if (!id.endsWith('Select')) audio.click();
    fire();
  });
}

bindSetup('voltageSelect', 'voltageV', Number);
bindSetup('resistanceSelect', 'resistanceOhm', Number);
bindSetup('ammeterRange', 'ammeterRangeA', Number);
bindSetup('voltmeterRange', 'voltmeterRangeV', Number);

$('recordBtn').addEventListener('click', () => {
  unlockAll();
  const result = recordObservation(experiment.history, experiment.setup);
  if (result.ok) {
    experiment = { ...experiment, history: result.trials };
    feedback = 'recorded';
    audio.record();
    window.cool?.track?.('observe-circuit', {
      voltageV: experiment.setup.voltageV,
      resistanceOhm: experiment.setup.resistanceOhm,
    });
    if (result.trials.length === 1) window.cool?.complete?.();
    if (result.trials.length === 2) audio.success();
  } else {
    feedback = result.reason;
    audio.error();
  }
  save();
  paint();
});

$('resetBtn').addEventListener('click', () => {
  unlockAll();
  audio.click();
  experiment = { ...experiment, history: [] };
  feedback = 'cleared';
  save();
  paint();
});

$('zoomInBtn').addEventListener('click', () => { unlockAll(); audio.click(); scene?.zoom(0.8); });
$('zoomOutBtn').addEventListener('click', () => { unlockAll(); audio.click(); scene?.zoom(1.25); });
$('perspectiveBtn').addEventListener('click', () => { unlockAll(); audio.click(); scene?.view(false); });
$('topViewBtn').addEventListener('click', () => { unlockAll(); audio.click(); scene?.view(true); });
$('musicBtn').addEventListener('click', () => { unlockAll(); audio.setMusic(!audio.musicOn); paint(); });
$('soundBtn').addEventListener('click', () => { unlockAll(); audio.setSfx(!audio.sfxOn); paint(); });
$('themeBtn').addEventListener('click', () => window.cool.preferences.toggleTheme());
$('langBtn').addEventListener('click', () => window.cool.preferences.toggleLang());

try {
  scene = createCircuitScene($('circuitScene'));
} catch {
  scene = null;
}
if (!scene) {
  $('nogl').hidden = false;
  $('circuitScene').hidden = true;
}

addEventListener('themechange', () => scene?.applyTheme());
window.cool.bindI18n(I18N, {
  onChange({ lang: next, t: translate }) {
    lang = next;
    t = translate;
    paint();
  },
});
applyPanel();
paint();
