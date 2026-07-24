import {
  COMPONENT_CATALOG,
  addComponent,
  cloneCircuitDocument,
  componentById,
  connectPorts,
  createCircuitDocument,
  removeComponents,
  removeWires,
  touchDocument,
} from './circuit-model.js';
import { simulateCircuit } from './circuit-simulator.js';
import {
  AUTOSAVE_KEY,
  SAVED_CIRCUIT_KEY,
  loadCircuit,
  saveCircuit,
} from './circuit-storage.js';

const WORLD = { width: 1600, height: 1000, townHeight: 190 };
const GRID = 20;
const MAX_HISTORY = 80;
const TOOL_ORDER = [
  'battery',
  'batteryBox',
  'lamp',
  'motor',
  'buzzer',
  'switch',
  'spdt',
  'button',
  'breaker',
  'fuse',
  'junction',
];

const I18N = {
  zh: {
    back: '返回平台',
    title: '电工鼠实验室',
    projectName: '作品名称',
    theme: '切换主题',
    run: '运行',
    pause: '暂停',
    power: '总电源',
    undo: '撤销',
    redo: '重做',
    copy: '复制',
    delete: '删除',
    clear: '清空',
    save: '保存',
    load: '加载',
    resetView: '复位视图',
    current: '电流',
    data: '数据',
    sound: '声音',
    toolbox: '元件工具箱',
    toolboxHint: '拖进画布，或点元件后再点画布。数量不限。',
    freeTip: '没有标准答案。先大胆接，再观察发生了什么。',
    observe: '观察面板',
    openCircuit: '等待接线',
    activeCircuit: '电路工作中',
    shortCircuit: '短路警报',
    powerOff: '总电源已断开',
    paused: '仿真已暂停',
    guideTitle: '三步点亮小镇',
    guideSteps: '放元件 → 连端口 → 合开关',
    operate: '操作',
    rotate: '旋转',
    multiSelect: '多选',
    drag: '拖动',
    pan: '平移',
    longPress: '长按有菜单',
    autosaved: '已自动保存',
    saving: '正在保存…',
    circuitState: '电路状态',
    sourceVoltage: '电源电压',
    totalCurrent: '总电流',
    activeLoads: '工作负载',
    faultCount: '故障',
    diagnosis: '电工鼠诊断',
    diagnosisIdle: '接线后，这里会解释通路、断路和保护动作。',
    selectedPart: '选中的元件',
    selectHint: '点一个元件查看电压、电流和可调属性。',
    freeMode: '自由实验模式',
    clearTitle: '清空整张实验台？',
    clearText: '元件和导线都会移走，但你可以马上撤销。',
    cancel: '取消',
    partsSummary: (components, wires) => `${components} 个元件 · ${wires} 条导线`,
    selectedCount: (count) => `已选 ${count} 项`,
    placed: (name) => `${name} 已放好，端口上的亮圈可以接线。`,
    wired: '啪嗒！导线接好了。',
    duplicateWire: '这两个端口已经连过了。',
    selfWire: '导线不能接回同一个端口。',
    wireCancelled: '接线已取消。',
    selectedTool: (name) => `已拿起 ${name}，点实验台放置；再点工具可收回。`,
    saved: '作品已保存到这台设备。',
    loaded: '作品已加载，可以继续编辑。',
    noSave: '还没有手动保存的作品。',
    saveFailed: '保存失败：浏览器没有提供可用空间。',
    loadFailed: '加载失败：存档格式无法读取。',
    cleared: '实验台已清空，可以撤销。',
    copied: '已复制选中元件和它们之间的导线。',
    nothingSelected: '先选一个或多个元件。',
    breakerReset: '总开关已复位。',
    fuseReplaced: '换上了新的保险丝。',
    batteryReset: '电池保护已复位。',
    lampRemoved: '灯泡被拧下，这条支路断开了。',
    lampInstalled: '灯泡重新装好了。',
    shortCoach: '短路！电流走了几乎没有阻力的近路。先断电，再找红色线路。',
    activeCoach: '金色粒子正在跑。点元件查看每一处的电压、电流和功率。',
    openCoach: '电路还没有形成完整回路。找找没有接上的端口或打开的开关。',
    offCoach: '总电源断开后，整张实验台都安全地停下了。',
    pausedCoach: '时间暂停了；继续运行后，保险丝和保护器才会继续升温。',
    shortDiagnosis: '电流过大，电池正在过载。红色线路是需要检查的近路。',
    overloadDiagnosis: '电流超过额定值，保护器件正在积累热量。',
    openDiagnosis: '没有持续电流：可能是断口、打开的开关，或被拧下的灯泡。',
    activeDiagnosis: '这是通路。不同支路会按电阻分配电流，灯泡亮度随功率连续变化。',
    offDiagnosis: '总电源关闭，所有支路电流为零。',
    protectedDiagnosis: '电池进入保护状态。排除短路后，选中电池并点“操作”复位。',
    fuseDiagnosis: '保险丝已经熔断并变成开路。选中它后可以换新。',
    breakerDiagnosis: '总开关因过流跳闸。排除故障后可以手动复位。',
    firstLight: '小镇亮起来了！这不是通关，只是你的第一个可工作的设计。',
    invalidNumber: '请输入范围内的数字。',
    status: {
      normal: '正常',
      overload: '过载',
      protected: '保护',
      off: '关闭',
      bright: '明亮',
      dim: '偏暗',
      overvoltage: '过压',
      damaged: '损坏',
      removed: '已拧下',
      running: '转动',
      slow: '低速',
      stopped: '停止',
      sounding: '发声',
      silent: '安静',
      open: '断开',
      closed: '闭合',
      throwA: '通路 1',
      throwB: '通路 2',
      pressed: '按下',
      heating: '发热',
      tripped: '跳闸',
      blown: '熔断',
      idle: '待机',
    },
    props: {
      voltage: '电压',
      internalResistance: '内阻',
      maxCurrent: '最大电流',
      capacity: '剩余电量',
      cells: '电池节数',
      ratedVoltage: '额定电压',
      resistance: '等效电阻',
      ratedCurrent: '额定电流',
      tripHeat: '动作热量',
    },
    actions: {
      close: '合上',
      open: '断开',
      changePath: '切换线路',
      removeLamp: '拧下灯泡',
      installLamp: '装回灯泡',
      press: '按一下',
      reset: '复位',
      replace: '换新',
      inspect: '检查',
    },
  },
  en: {
    back: 'Back to platform',
    title: 'Electric Mouse Lab',
    projectName: 'Project name',
    theme: 'Switch theme',
    run: 'Run',
    pause: 'Pause',
    power: 'Main power',
    undo: 'Undo',
    redo: 'Redo',
    copy: 'Copy',
    delete: 'Delete',
    clear: 'Clear',
    save: 'Save',
    load: 'Load',
    resetView: 'Reset view',
    current: 'Current',
    data: 'Data',
    sound: 'Sound',
    toolbox: 'Parts toolbox',
    toolboxHint: 'Drag a part in, or pick one and tap the board. No quantity limit.',
    freeTip: 'There is no single answer. Build boldly, then watch what happens.',
    observe: 'Observation panel',
    openCircuit: 'Waiting for a circuit',
    activeCircuit: 'Circuit running',
    shortCircuit: 'Short-circuit alert',
    powerOff: 'Main power off',
    paused: 'Simulation paused',
    guideTitle: 'Light the town in three moves',
    guideSteps: 'Place parts → wire ports → close a switch',
    operate: 'Operate',
    rotate: 'Rotate',
    multiSelect: 'multi-select',
    drag: 'drag',
    pan: 'pan',
    longPress: 'long-press for menu',
    autosaved: 'Autosaved',
    saving: 'Saving…',
    circuitState: 'Circuit state',
    sourceVoltage: 'Source voltage',
    totalCurrent: 'Total current',
    activeLoads: 'Active loads',
    faultCount: 'Faults',
    diagnosis: 'Mouse diagnosis',
    diagnosisIdle: 'Wire something up and this panel will explain paths, gaps, and protection.',
    selectedPart: 'Selected part',
    selectHint: 'Tap a part to inspect its voltage, current, and adjustable properties.',
    freeMode: 'Free experiment mode',
    clearTitle: 'Clear the whole workbench?',
    clearText: 'Every part and wire will move away, but Undo can bring them back.',
    cancel: 'Cancel',
    partsSummary: (components, wires) => `${components} parts · ${wires} wires`,
    selectedCount: (count) => `${count} selected`,
    placed: (name) => `${name} is ready. Wire the glowing port rings.`,
    wired: 'Snap! The wire is connected.',
    duplicateWire: 'Those two ports are already connected.',
    selfWire: 'A wire cannot return to the exact same port.',
    wireCancelled: 'Wiring cancelled.',
    selectedTool: (name) => `${name} picked up. Tap the board to place it; tap the tool again to put it back.`,
    saved: 'Project saved on this device.',
    loaded: 'Project loaded. Keep building!',
    noSave: 'There is no manually saved project yet.',
    saveFailed: 'Save failed: the browser did not provide usable storage.',
    loadFailed: 'Load failed: the saved document could not be read.',
    cleared: 'Workbench cleared. You can undo this.',
    copied: 'Copied the selected parts and the wires between them.',
    nothingSelected: 'Select one or more parts first.',
    breakerReset: 'Breaker reset.',
    fuseReplaced: 'A fresh fuse is installed.',
    batteryReset: 'Battery protection reset.',
    lampRemoved: 'The bulb is unscrewed, so this branch is open.',
    lampInstalled: 'The bulb is installed again.',
    shortCoach: 'Short circuit! Current found an almost resistance-free shortcut. Power off and inspect red wires.',
    activeCoach: 'Golden particles are moving. Tap a part to inspect voltage, current, and power.',
    openCoach: 'The path is not complete yet. Look for free ports, open switches, or a removed bulb.',
    offCoach: 'Main power is off, so the whole bench is safely still.',
    pausedCoach: 'Time is paused. Fuses and protectors will continue heating only after Run.',
    shortDiagnosis: 'Current is too high and the battery is overloaded. Inspect the red shortcut.',
    overloadDiagnosis: 'Current is above a rating, so a protection device is accumulating heat.',
    openDiagnosis: 'No sustained current: there may be a gap, an open switch, or a removed bulb.',
    activeDiagnosis: 'This is a closed path. Branch current follows resistance, and bulb brightness changes continuously with power.',
    offDiagnosis: 'Main power is off, so every branch current is zero.',
    protectedDiagnosis: 'Battery protection is active. Remove the short, select the battery, then press Operate to reset.',
    fuseDiagnosis: 'The fuse has melted into an open circuit. Select it to install a fresh one.',
    breakerDiagnosis: 'The breaker tripped on excess current. Remove the fault, then reset it manually.',
    firstLight: 'The town is glowing! This is not a finish line—just your first working design.',
    invalidNumber: 'Enter a number inside the allowed range.',
    status: {
      normal: 'normal',
      overload: 'overload',
      protected: 'protected',
      off: 'off',
      bright: 'bright',
      dim: 'dim',
      overvoltage: 'overvoltage',
      damaged: 'damaged',
      removed: 'removed',
      running: 'running',
      slow: 'slow',
      stopped: 'stopped',
      sounding: 'sounding',
      silent: 'silent',
      open: 'open',
      closed: 'closed',
      throwA: 'path 1',
      throwB: 'path 2',
      pressed: 'pressed',
      heating: 'heating',
      tripped: 'tripped',
      blown: 'blown',
      idle: 'idle',
    },
    props: {
      voltage: 'Voltage',
      internalResistance: 'Internal resistance',
      maxCurrent: 'Maximum current',
      capacity: 'Charge remaining',
      cells: 'Cell count',
      ratedVoltage: 'Rated voltage',
      resistance: 'Resistance',
      ratedCurrent: 'Rated current',
      tripHeat: 'Trip heat',
    },
    actions: {
      close: 'Close',
      open: 'Open',
      changePath: 'Change path',
      removeLamp: 'Unscrew bulb',
      installLamp: 'Install bulb',
      press: 'Press',
      reset: 'Reset',
      replace: 'Replace',
      inspect: 'Inspect',
    },
  },
};

const PROPERTY_FIELDS = {
  battery: [
    ['voltage', 'V', 1.5, 24, 0.5],
    ['internalResistance', 'Ω', 0.05, 5, 0.05],
    ['maxCurrent', 'A', 0.5, 20, 0.5],
    ['capacity', '%', 0, 100, 1],
  ],
  batteryBox: [
    ['voltage', 'V', 1.5, 24, 0.5],
    ['cells', '', 1, 12, 1],
    ['internalResistance', 'Ω', 0.05, 5, 0.05],
    ['maxCurrent', 'A', 0.5, 20, 0.5],
  ],
  lamp: [['ratedVoltage', 'V', 1.5, 24, 0.5], ['resistance', 'Ω', 1, 100, 1]],
  motor: [['ratedVoltage', 'V', 1.5, 24, 0.5], ['resistance', 'Ω', 1, 100, 1]],
  buzzer: [['ratedVoltage', 'V', 1.5, 24, 0.5], ['resistance', 'Ω', 1, 100, 1]],
  breaker: [['ratedCurrent', 'A', 0.2, 20, 0.1], ['tripHeat', '', 0.2, 5, 0.1]],
  fuse: [['ratedCurrent', 'A', 0.1, 20, 0.1], ['tripHeat', '', 0.2, 5, 0.1]],
};

const $ = (selector) => document.querySelector(selector);
const dom = {
  stage: $('#stage'),
  canvasWrap: $('#canvasWrap'),
  componentList: $('#componentList'),
  projectName: $('#projectName'),
  liveState: $('#liveState'),
  liveSummary: $('#liveSummary'),
  meterIcon: $('#meterIcon'),
  meterState: $('#meterState'),
  sourceVoltage: $('#sourceVoltage'),
  totalCurrent: $('#totalCurrent'),
  activeLoads: $('#activeLoads'),
  faultCount: $('#faultCount'),
  faultCard: $('#faultCard'),
  faultText: $('#faultText'),
  emptySelection: $('#emptySelection'),
  selectionInspector: $('#selectionInspector'),
  selectedIcon: $('#selectedIcon'),
  selectedName: $('#selectedName'),
  selectedStatus: $('#selectedStatus'),
  selectedVoltage: $('#selectedVoltage'),
  selectedCurrent: $('#selectedCurrent'),
  selectedPower: $('#selectedPower'),
  propertyFields: $('#propertyFields'),
  componentActionBtn: $('#componentActionBtn'),
  selectionCount: $('#selectionCount'),
  contextMenu: $('#contextMenu'),
  toast: $('#toast'),
  zoomValue: $('#zoomValue'),
  autosaveState: $('#autosaveState'),
  mouseCoach: $('#mouseCoach'),
  clearDialog: $('#clearDialog'),
  panelScrim: $('#panelScrim'),
};
const ctx = dom.stage.getContext('2d');

let lang = readPreference('kidslab.lang')
  || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
if (!I18N[lang]) lang = 'zh';
let theme = readPreference('kidslab.theme')
  || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
if (!['light', 'dark'].includes(theme)) theme = 'dark';

let settings = {
  running: true,
  powered: true,
  showCurrent: true,
  showData: true,
  muted: false,
  guideDismissed: false,
  ...readJsonPreference('kidslab.electricLab.settings'),
};

const autosavedCircuit = loadAutosave();
let circuit = autosavedCircuit || createStarterCircuit();
let analysis = simulateCircuit(circuit, { deltaMs: 0 }).analysis;
let selectedTool = null;
let selectedComponents = new Set();
let selectedWires = new Set();
let interaction = null;
let pendingWire = null;
let hoverWorld = null;
let hoverPort = null;
let history = [];
let future = [];
let activePointers = new Map();
let pinch = null;
let spaceDown = false;
let clipboard = null;
let autosaveTimer = 0;
let toastTimer = 0;
let longPressTimer = 0;
let lastFrame = 0;
let previousSummary = '';
let previousProtection = protectionSignature(circuit);
let audioContext = null;
let lastBuzzerAt = 0;
let firstLightCelebrated = false;
let canvasSize = { width: 1, height: 1, dpr: 1 };
let initialCanvasSized = false;

function t(key) {
  return I18N[lang][key] ?? I18N.zh[key] ?? key;
}

function readPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readJsonPreference(key) {
  const value = readPreference(key);
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writePreference(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function loadAutosave() {
  try {
    return loadCircuit(localStorage, AUTOSAVE_KEY);
  } catch {
    return null;
  }
}

function createStarterCircuit() {
  const document = createCircuitDocument({ name: lang === 'zh' ? '我的夜光小镇' : 'My glowing town' });
  document.viewport = { x: 800, y: 540, zoom: 0.72 };
  addComponent(document, 'battery', { position: { x: 430, y: 540 } });
  addComponent(document, 'switch', { position: { x: 690, y: 540 } });
  addComponent(document, 'lamp', { position: { x: 980, y: 440 } });
  addComponent(document, 'junction', { position: { x: 980, y: 660 } });
  return document;
}

function persistSettings() {
  writePreference('kidslab.electricLab.settings', JSON.stringify(settings));
}

function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  dom.autosaveState.textContent = t('saving');
  autosaveTimer = setTimeout(() => {
    try {
      saveCircuit(localStorage, circuit, AUTOSAVE_KEY);
      dom.autosaveState.textContent = t('autosaved');
    } catch {
      dom.autosaveState.textContent = t('saveFailed');
    }
  }, 240);
}

function commitSnapshot(before) {
  history.push(before);
  if (history.length > MAX_HISTORY) history.shift();
  future = [];
  touchDocument(circuit);
  scheduleAutosave();
  updateToolbar();
}

function mutate(mutator, message) {
  const before = cloneCircuitDocument(circuit);
  mutator(circuit);
  commitSnapshot(before);
  simulateNow(0);
  if (message) showToast(message);
}

function undo() {
  const previous = history.pop();
  if (!previous) return;
  future.push(cloneCircuitDocument(circuit));
  circuit = previous;
  clearSelection();
  pendingWire = null;
  simulateNow(0);
  scheduleAutosave();
  updateToolbar();
}

function redo() {
  const next = future.pop();
  if (!next) return;
  history.push(cloneCircuitDocument(circuit));
  circuit = next;
  clearSelection();
  pendingWire = null;
  simulateNow(0);
  scheduleAutosave();
  updateToolbar();
}

function showToast(message) {
  clearTimeout(toastTimer);
  dom.toast.textContent = message;
  dom.toast.hidden = false;
  dom.toast.style.animation = 'none';
  void dom.toast.offsetWidth;
  dom.toast.style.animation = '';
  toastTimer = setTimeout(() => {
    dom.toast.hidden = true;
  }, 2550);
}

function componentName(component) {
  return COMPONENT_CATALOG[component.type].label[lang];
}

function statusName(status) {
  return t('status')[status] || status || t('status').idle;
}

function buildToolbox() {
  dom.componentList.innerHTML = '';
  for (const type of TOOL_ORDER) {
    const definition = COMPONENT_CATALOG[type];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `component-tool${selectedTool === type ? ' is-selected' : ''}`;
    button.draggable = true;
    button.dataset.componentType = type;
    button.setAttribute('aria-pressed', String(selectedTool === type));
    button.innerHTML = `<span aria-hidden="true">${definition.icon}</span><b>${definition.label[lang]}</b><small>${type.toUpperCase()}</small>`;
    button.addEventListener('click', () => {
      ensureAudio();
      selectedTool = selectedTool === type ? null : type;
      pendingWire = null;
      if (selectedTool) showToast(t('selectedTool')(definition.label[lang]));
      buildToolbox();
      updateCanvasCursor();
    });
    button.addEventListener('dragstart', (event) => {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('application/x-electric-component', type);
      selectedTool = type;
      buildToolbox();
    });
    dom.componentList.appendChild(button);
  }
}

function applyLanguage() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = `${t('title')} · KidsLab`;
  document.querySelectorAll('[data-t]').forEach((element) => {
    const value = t(element.dataset.t);
    if (typeof value === 'string') element.textContent = value;
  });
  document.querySelectorAll('[data-t-title]').forEach((element) => {
    const value = t(element.dataset.tTitle);
    if (typeof value === 'string') {
      element.title = value;
      element.setAttribute('aria-label', value);
    }
  });
  $('#langBtn').textContent = lang === 'zh' ? 'EN' : '中';
  delete dom.propertyFields.dataset.componentId;
  delete dom.propertyFields.dataset.lang;
  buildToolbox();
  updateAllUi();
}

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  $('#themeBtn').firstElementChild.textContent = theme === 'dark' ? '☀️' : '🌙';
  writePreference('kidslab.theme', theme);
}

function setToggle(button, active) {
  button.classList.toggle('is-active', active);
  button.setAttribute('aria-pressed', String(active));
}

function updateToolbar() {
  $('#undoBtn').disabled = history.length === 0;
  $('#redoBtn').disabled = future.length === 0;
  setToggle($('#runBtn'), settings.running);
  $('#runBtn').querySelector('span').textContent = settings.running ? '▶' : 'Ⅱ';
  $('#runBtn').querySelector('b').textContent = settings.running ? t('run') : t('pause');
  setToggle($('#powerBtn'), settings.powered);
  setToggle($('#currentBtn'), settings.showCurrent);
  setToggle($('#dataBtn'), settings.showData);
  setToggle($('#muteBtn'), settings.muted);
  $('#muteBtn').querySelector('span').textContent = settings.muted ? '🔇' : '🔊';
}

function protectionSignature(document) {
  return document.components
    .filter((component) => ['battery', 'batteryBox', 'fuse', 'breaker'].includes(component.type))
    .map((component) => `${component.id}:${component.state.status}:${component.state.blown || false}:${component.state.tripped || false}`)
    .join('|');
}

function findProtectionState(document) {
  return {
    protectedPart: document.components.find((component) => component.state.status === 'protected'),
    blownFuse: document.components.find((component) => component.type === 'fuse' && component.state.blown),
    trippedBreaker: document.components.find((component) => component.type === 'breaker' && component.state.tripped),
    heating: document.components.find((component) => (
      component.state.status === 'heating' || component.state.status === 'overload'
    )),
  };
}

function simulateNow(deltaMs) {
  const previousDocument = circuit;
  const result = simulateCircuit(circuit, {
    deltaMs: settings.running ? deltaMs : 0,
    powered: settings.powered && settings.running,
  });
  circuit = result.document;
  analysis = result.analysis;

  const nextProtection = protectionSignature(circuit);
  if (nextProtection !== previousProtection) {
    previousProtection = nextProtection;
    scheduleAutosave();
    const { protectedPart, blownFuse, trippedBreaker } = findProtectionState(circuit);
    if (protectedPart) showToast(t('protectedDiagnosis'));
    else if (blownFuse) showToast(t('fuseDiagnosis'));
    else if (trippedBreaker) showToast(t('breakerDiagnosis'));
  }

  if (analysis.summary.status !== previousSummary) {
    if (analysis.summary.status === 'short') {
      showToast(t('shortCoach'));
      playTone(92, .18, 'sawtooth', .055);
      window.cool?.track?.('short_circuit');
    } else if (analysis.summary.status === 'active' && previousSummary) {
      playSuccess();
      if (!firstLightCelebrated) {
        firstLightCelebrated = true;
        showToast(t('firstLight'));
        window.cool?.complete?.();
      }
    }
    previousSummary = analysis.summary.status;
  }

  if (settings.running && settings.powered && !settings.muted) {
    const sounding = circuit.components.find((component) => (
      component.type === 'buzzer' && analysis.components[component.id]?.status === 'sounding'
    ));
    if (sounding && performance.now() - lastBuzzerAt > 850) {
      lastBuzzerAt = performance.now();
      playTone(720, .08, 'square', .025);
    }
  }

  if (previousDocument !== circuit) updateAllUi();
}

function updateAllUi() {
  dom.projectName.value = circuit.name;
  updateToolbar();
  updateStatus();
  updateSelectionUi();
  dom.zoomValue.textContent = `${Math.round(circuit.viewport.zoom * 100)}%`;
}

function updateStatus() {
  let key = 'openCircuit';
  let icon = '🌙';
  let coach = t('openCoach');
  let diagnosis = t('openDiagnosis');
  let status = analysis.summary.status;
  if (!settings.powered) {
    key = 'powerOff';
    icon = '🔌';
    coach = t('offCoach');
    diagnosis = t('offDiagnosis');
    status = 'off';
  } else if (!settings.running) {
    key = 'paused';
    icon = '⏸️';
    coach = t('pausedCoach');
    diagnosis = t('pausedCoach');
    status = 'off';
  } else if (analysis.summary.status === 'short') {
    key = 'shortCircuit';
    icon = '⚡';
    coach = t('shortCoach');
    diagnosis = t('shortDiagnosis');
  } else if (analysis.summary.status === 'active') {
    key = 'activeCircuit';
    icon = '💡';
    coach = t('activeCoach');
    diagnosis = t('activeDiagnosis');
  }

  const {
    protectedPart,
    blownFuse,
    trippedBreaker,
    heating,
  } = findProtectionState(circuit);
  if (protectedPart) diagnosis = t('protectedDiagnosis');
  else if (blownFuse) diagnosis = t('fuseDiagnosis');
  else if (trippedBreaker) diagnosis = t('breakerDiagnosis');
  else if (heating) diagnosis = t('overloadDiagnosis');

  dom.liveState.dataset.status = status;
  dom.liveState.querySelector('span').textContent = t(key);
  dom.liveSummary.textContent = t('partsSummary')(circuit.components.length, circuit.wires.length);
  dom.meterIcon.textContent = icon;
  dom.meterState.textContent = t(key);
  dom.sourceVoltage.textContent = formatValue(analysis.summary.sourceVoltage, 'V');
  dom.totalCurrent.textContent = formatValue(analysis.summary.totalCurrent, 'A');
  dom.activeLoads.textContent = String(analysis.summary.activeLoads);
  const faultCount = analysis.summary.faults.length
    + circuit.components.filter((component) => ['protected', 'blown', 'tripped'].includes(component.state.status)).length;
  dom.faultCount.textContent = String(faultCount);
  dom.faultCard.classList.toggle('has-fault', faultCount > 0);
  dom.faultText.textContent = diagnosis;
  dom.mouseCoach.textContent = `🐭 ${coach}`;
}

function formatValue(value, unit) {
  const safe = Number.isFinite(value) ? value : 0;
  const digits = Math.abs(safe) >= 10 ? 1 : 2;
  return `${safe.toFixed(digits)} ${unit}`;
}

function updateSelectionUi() {
  const count = selectedComponents.size + selectedWires.size;
  dom.selectionCount.hidden = count < 2;
  if (count >= 2) dom.selectionCount.textContent = t('selectedCount')(count);
  const onlyComponent = selectedComponents.size === 1 && selectedWires.size === 0
    ? componentById(circuit, [...selectedComponents][0])
    : null;
  dom.emptySelection.hidden = Boolean(onlyComponent);
  dom.selectionInspector.hidden = !onlyComponent;
  if (!onlyComponent) return;

  const definition = COMPONENT_CATALOG[onlyComponent.type];
  const meter = analysis.components[onlyComponent.id] || {};
  dom.selectedIcon.textContent = definition.icon;
  dom.selectedName.textContent = definition.label[lang];
  dom.selectedStatus.textContent = statusName(meter.status || onlyComponent.state.status);
  dom.selectedVoltage.textContent = formatValue(meter.voltage, 'V');
  dom.selectedCurrent.textContent = formatValue(meter.current, 'A');
  dom.selectedPower.textContent = formatValue(meter.power, 'W');
  if (dom.propertyFields.dataset.componentId !== onlyComponent.id
    || dom.propertyFields.dataset.lang !== lang) {
    buildPropertyFields(onlyComponent);
  }
  updateComponentAction(onlyComponent);
}

function buildPropertyFields(component) {
  dom.propertyFields.innerHTML = '';
  dom.propertyFields.dataset.componentId = component.id;
  dom.propertyFields.dataset.lang = lang;
  for (const [property, unit, min, max, step] of PROPERTY_FIELDS[component.type] || []) {
    const row = document.createElement('div');
    row.className = 'property-field';
    const label = document.createElement('label');
    label.htmlFor = `prop-${property}`;
    label.textContent = `${t('props')[property]}${unit ? ` (${unit})` : ''}`;
    const input = document.createElement('input');
    input.id = `prop-${property}`;
    input.type = 'number';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(component.properties[property]);
    input.addEventListener('change', () => {
      const value = Number(input.value);
      if (!Number.isFinite(value) || value < min || value > max) {
        input.value = String(component.properties[property]);
        showToast(t('invalidNumber'));
        return;
      }
      mutate((document) => {
        componentById(document, component.id).properties[property] = value;
      });
    });
    row.append(label, input);
    dom.propertyFields.appendChild(row);
  }
}

function actionForComponent(component) {
  switch (component.type) {
    case 'switch':
      return { label: component.state.closed ? t('actions').open : t('actions').close, run: () => {
        component.state.closed = !component.state.closed;
      } };
    case 'spdt':
      return { label: t('actions').changePath, run: () => {
        component.state.throw = component.state.throw === 'b' ? 'a' : 'b';
      } };
    case 'button':
      return { label: t('actions').press, asyncRun: () => pressButton(component.id) };
    case 'breaker':
      if (component.state.tripped) {
        return { label: t('actions').reset, message: t('breakerReset'), run: () => {
          component.state.tripped = false;
          component.state.closed = true;
          component.state.overloadHeat = 0;
          component.state.status = 'normal';
        } };
      }
      return { label: component.state.closed ? t('actions').open : t('actions').close, run: () => {
        component.state.closed = !component.state.closed;
      } };
    case 'fuse':
      return { label: component.state.blown ? t('actions').replace : t('actions').inspect, message: component.state.blown ? t('fuseReplaced') : null, run: () => {
        if (component.state.blown) {
          component.state.blown = false;
          component.state.heat = 0;
          component.state.status = 'normal';
        }
      } };
    case 'battery':
    case 'batteryBox':
      return { label: component.state.status === 'protected' ? t('actions').reset : t('actions').inspect, message: component.state.status === 'protected' ? t('batteryReset') : null, run: () => {
        if (component.state.status === 'protected') {
          component.state.status = 'normal';
          component.state.overloadHeat = 0;
        }
      } };
    case 'lamp':
      return { label: component.state.removed ? t('actions').installLamp : t('actions').removeLamp, message: component.state.removed ? t('lampInstalled') : t('lampRemoved'), run: () => {
        component.state.removed = !component.state.removed;
      } };
    default:
      return { label: t('actions').inspect, run: () => {} };
  }
}

function updateComponentAction(component) {
  const action = actionForComponent(component);
  dom.componentActionBtn.querySelector('b').textContent = action.label;
}

function operateSelectedComponent() {
  if (selectedComponents.size !== 1 || selectedWires.size) {
    showToast(t('nothingSelected'));
    return;
  }
  const id = [...selectedComponents][0];
  const component = componentById(circuit, id);
  const action = actionForComponent(component);
  if (action.asyncRun) {
    action.asyncRun();
    return;
  }
  mutate((document) => {
    actionForComponent(componentById(document, id)).run();
  }, action.message);
  playClick();
}

function pressButton(id) {
  const component = componentById(circuit, id);
  if (!component || component.type !== 'button') return;
  component.state.pressed = true;
  simulateNow(0);
  playClick();
  setTimeout(() => {
    const current = componentById(circuit, id);
    if (!current) return;
    current.state.pressed = false;
    simulateNow(0);
  }, 420);
}

function clearSelection() {
  selectedComponents.clear();
  selectedWires.clear();
  updateSelectionUi();
}

function selectOnlyComponent(id) {
  selectedComponents = new Set([id]);
  selectedWires.clear();
  updateSelectionUi();
}

function selectOnlyWire(id) {
  selectedComponents.clear();
  selectedWires = new Set([id]);
  updateSelectionUi();
}

function deleteSelection() {
  if (!selectedComponents.size && !selectedWires.size) {
    showToast(t('nothingSelected'));
    return;
  }
  const componentIds = [...selectedComponents];
  const wireIds = [...selectedWires];
  mutate((document) => {
    removeComponents(document, componentIds);
    removeWires(document, wireIds);
  });
  clearSelection();
  playTone(150, .06, 'square', .035);
}

function rotateSelection() {
  if (!selectedComponents.size) {
    showToast(t('nothingSelected'));
    return;
  }
  mutate((document) => {
    for (const id of selectedComponents) {
      const component = componentById(document, id);
      if (component) component.rotation = (component.rotation + 90) % 360;
    }
  });
  playClick();
}

function copySelection() {
  if (!selectedComponents.size) {
    showToast(t('nothingSelected'));
    return;
  }
  clipboard = {
    components: circuit.components
      .filter((component) => selectedComponents.has(component.id))
      .map((component) => cloneCircuitDocument(component)),
    wires: circuit.wires
      .filter((wire) => selectedComponents.has(wire.from.componentId) && selectedComponents.has(wire.to.componentId))
      .map((wire) => cloneCircuitDocument(wire)),
  };
  pasteClipboard();
}

function pasteClipboard() {
  if (!clipboard?.components.length) {
    showToast(t('nothingSelected'));
    return;
  }
  const newIds = new Set();
  mutate((document) => {
    const mapping = new Map();
    for (const source of clipboard.components) {
      const copy = addComponent(document, source.type, {
        position: { x: source.position.x + 56, y: source.position.y + 56 },
        rotation: source.rotation,
        properties: cloneCircuitDocument(source.properties),
        state: cloneCircuitDocument(source.state),
      });
      mapping.set(source.id, copy.id);
      newIds.add(copy.id);
    }
    for (const wire of clipboard.wires) {
      connectPorts(
        document,
        { componentId: mapping.get(wire.from.componentId), portId: wire.from.portId },
        { componentId: mapping.get(wire.to.componentId), portId: wire.to.portId },
      );
    }
  }, t('copied'));
  selectedComponents = newIds;
  selectedWires.clear();
  updateSelectionUi();
  playClick();
}

function addPart(type, point) {
  const snapped = snapPoint(point);
  let createdId = '';
  mutate((document) => {
    const component = addComponent(document, type, {
      position: clampComponentPosition(type, snapped),
    });
    createdId = component.id;
  }, t('placed')(COMPONENT_CATALOG[type].label[lang]));
  selectOnlyComponent(createdId);
  playClick();
  window.cool?.track?.('place_component', { type });
}

function connectEndpoints(from, to) {
  if (from.componentId === to.componentId && from.portId === to.portId) {
    showToast(t('selfWire'));
    return;
  }
  const count = circuit.wires.length;
  mutate((document) => {
    connectPorts(document, from, to);
  });
  showToast(circuit.wires.length === count ? t('duplicateWire') : t('wired'));
  if (circuit.wires.length !== count) {
    playClick();
    window.cool?.track?.('connect_wire');
  }
}

function snapPoint(point) {
  return {
    x: Math.round(point.x / GRID) * GRID,
    y: Math.round(point.y / GRID) * GRID,
  };
}

function clampComponentPosition(type, point) {
  const size = COMPONENT_CATALOG[type].size;
  return {
    x: clamp(point.x, size.width / 2 + 30, WORLD.width - size.width / 2 - 30),
    y: clamp(point.y, WORLD.townHeight + size.height / 2 + 30, WORLD.height - size.height / 2 - 30),
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rotatePoint(point, angleDegrees) {
  const angle = angleDegrees * Math.PI / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: point.x * cos - point.y * sin, y: point.x * sin + point.y * cos };
}

function portPosition(component, portId) {
  const port = component.ports.find((item) => item.id === portId);
  if (!port) return null;
  const rotated = rotatePoint(port.localPosition, component.rotation);
  return { x: component.position.x + rotated.x, y: component.position.y + rotated.y };
}

function endpointPosition(endpoint) {
  const component = componentById(circuit, endpoint.componentId);
  return component ? portPosition(component, endpoint.portId) : null;
}

function screenPoint(event) {
  const rect = dom.stage.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function worldPointFromScreen(point) {
  return {
    x: (point.x - canvasSize.width / 2) / circuit.viewport.zoom + circuit.viewport.x,
    y: (point.y - canvasSize.height / 2) / circuit.viewport.zoom + circuit.viewport.y,
  };
}

function worldPoint(event) {
  return worldPointFromScreen(screenPoint(event));
}

function worldToScreen(point) {
  return {
    x: (point.x - circuit.viewport.x) * circuit.viewport.zoom + canvasSize.width / 2,
    y: (point.y - circuit.viewport.y) * circuit.viewport.zoom + canvasSize.height / 2,
  };
}

function hitPort(point, excludeEndpoint = null) {
  const radius = 24 / circuit.viewport.zoom;
  let best = null;
  for (let componentIndex = circuit.components.length - 1; componentIndex >= 0; componentIndex -= 1) {
    const component = circuit.components[componentIndex];
    for (const port of component.ports) {
      const endpoint = { componentId: component.id, portId: port.id };
      if (excludeEndpoint && endpoint.componentId === excludeEndpoint.componentId && endpoint.portId === excludeEndpoint.portId) continue;
      const position = portPosition(component, port.id);
      const distance = Math.hypot(point.x - position.x, point.y - position.y);
      if (distance <= radius && (!best || distance < best.distance)) {
        best = { component, port, endpoint, position, distance };
      }
    }
  }
  return best;
}

function hitComponent(point) {
  for (let index = circuit.components.length - 1; index >= 0; index -= 1) {
    const component = circuit.components[index];
    const size = COMPONENT_CATALOG[component.type].size;
    const local = rotatePoint({
      x: point.x - component.position.x,
      y: point.y - component.position.y,
    }, -component.rotation);
    if (Math.abs(local.x) <= size.width / 2 + 8 && Math.abs(local.y) <= size.height / 2 + 8) {
      return component;
    }
  }
  return null;
}

function shouldUsePort(point, portHit, componentHit) {
  if (!portHit) return false;
  if (!componentHit || componentHit.id !== portHit.component.id) return true;
  const local = rotatePoint({
    x: point.x - componentHit.position.x,
    y: point.y - componentHit.position.y,
  }, -componentHit.rotation);
  const port = portHit.port.localPosition;
  const lengthSquared = port.x * port.x + port.y * port.y || 1;
  const projection = (local.x * port.x + local.y * port.y) / lengthSquared;
  return projection > .42;
}

function wireCurve(wire) {
  const start = endpointPosition(wire.from);
  const end = endpointPosition(wire.to);
  if (!start || !end) return null;
  const direction = end.x >= start.x ? 1 : -1;
  const bend = Math.max(60, Math.min(240, Math.abs(end.x - start.x) * .48 + Math.abs(end.y - start.y) * .16));
  return {
    start,
    controlA: { x: start.x + bend * direction, y: start.y },
    controlB: { x: end.x - bend * direction, y: end.y },
    end,
  };
}

function bezierPoint(curve, amount) {
  const remaining = 1 - amount;
  return {
    x: remaining ** 3 * curve.start.x
      + 3 * remaining ** 2 * amount * curve.controlA.x
      + 3 * remaining * amount ** 2 * curve.controlB.x
      + amount ** 3 * curve.end.x,
    y: remaining ** 3 * curve.start.y
      + 3 * remaining ** 2 * amount * curve.controlA.y
      + 3 * remaining * amount ** 2 * curve.controlB.y
      + amount ** 3 * curve.end.y,
  };
}

function distanceToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = dx * dx + dy * dy || 1;
  const amount = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / length, 0, 1);
  return Math.hypot(point.x - (start.x + amount * dx), point.y - (start.y + amount * dy));
}

function hitWire(point) {
  const tolerance = 14 / circuit.viewport.zoom;
  let best = null;
  for (const wire of circuit.wires) {
    const curve = wireCurve(wire);
    if (!curve) continue;
    let previous = curve.start;
    for (let index = 1; index <= 24; index += 1) {
      const next = bezierPoint(curve, index / 24);
      const distance = distanceToSegment(point, previous, next);
      if (distance < tolerance && (!best || distance < best.distance)) best = { wire, distance };
      previous = next;
    }
  }
  return best;
}

function resizeCanvas() {
  const rect = dom.stage.getBoundingClientRect();
  const dpr = clamp(devicePixelRatio || 1, 1, 2);
  canvasSize = { width: Math.max(1, rect.width), height: Math.max(1, rect.height), dpr };
  dom.stage.width = Math.round(canvasSize.width * dpr);
  dom.stage.height = Math.round(canvasSize.height * dpr);
  if (!circuit.viewport.zoom || circuit.viewport.zoom <= 0) {
    resetView();
  } else if (!initialCanvasSized && !autosavedCircuit && canvasSize.width < 620) {
    circuit.viewport = { x: 730, y: 535, zoom: .48 };
  }
  initialCanvasSized = true;
}

function resetView() {
  const fit = Math.min(canvasSize.width / WORLD.width, canvasSize.height / (WORLD.height - 80));
  circuit.viewport = { x: WORLD.width / 2, y: WORLD.height / 2 + 35, zoom: clamp(fit * .96, .25, 1.4) };
  dom.zoomValue.textContent = `${Math.round(circuit.viewport.zoom * 100)}%`;
  scheduleAutosave();
}

function setZoom(nextZoom, anchor = { x: canvasSize.width / 2, y: canvasSize.height / 2 }) {
  const before = worldPointFromScreen(anchor);
  const zoom = clamp(nextZoom, .25, 2.5);
  circuit.viewport.zoom = zoom;
  circuit.viewport.x = before.x - (anchor.x - canvasSize.width / 2) / zoom;
  circuit.viewport.y = before.y - (anchor.y - canvasSize.height / 2) / zoom;
  dom.zoomValue.textContent = `${Math.round(zoom * 100)}%`;
  scheduleAutosave();
}

function updateCanvasCursor() {
  dom.stage.classList.toggle('is-panning', interaction?.kind === 'pan' || Boolean(pinch));
  dom.stage.classList.toggle('is-wiring', interaction?.kind === 'wire' || Boolean(pendingWire));
  dom.stage.classList.toggle('is-dragging', interaction?.kind === 'component' && interaction.moved);
}

function beginPinch() {
  if (activePointers.size < 2) return;
  const [first, second] = [...activePointers.values()];
  const midpoint = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
  pinch = {
    distance: Math.hypot(second.x - first.x, second.y - first.y),
    zoom: circuit.viewport.zoom,
    world: worldPointFromScreen(midpoint),
  };
  clearTimeout(longPressTimer);
  if (interaction?.kind === 'button') releaseMomentaryButton(interaction.componentId);
  interaction = null;
  pendingWire = null;
  updateCanvasCursor();
}

function updatePinch() {
  if (!pinch || activePointers.size < 2) return;
  const [first, second] = [...activePointers.values()];
  const midpoint = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
  const distance = Math.hypot(second.x - first.x, second.y - first.y);
  const zoom = clamp(pinch.zoom * distance / Math.max(1, pinch.distance), .25, 2.5);
  circuit.viewport.zoom = zoom;
  circuit.viewport.x = pinch.world.x - (midpoint.x - canvasSize.width / 2) / zoom;
  circuit.viewport.y = pinch.world.y - (midpoint.y - canvasSize.height / 2) / zoom;
  dom.zoomValue.textContent = `${Math.round(zoom * 100)}%`;
}

function onPointerDown(event) {
  ensureAudio();
  hideContextMenu();
  dom.stage.focus({ preventScroll: true });
  const screen = screenPoint(event);
  const point = worldPointFromScreen(screen);
  activePointers.set(event.pointerId, screen);
  try {
    dom.stage.setPointerCapture(event.pointerId);
  } catch {
    // Pointer capture may be unavailable for synthetic accessibility events.
  }
  if (activePointers.size === 2) {
    beginPinch();
    return;
  }
  if (activePointers.size > 1) return;

  hoverWorld = point;
  const panGesture = event.button === 1 || event.button === 2 || event.altKey || spaceDown;
  if (panGesture) {
    interaction = {
      kind: 'pan',
      startScreen: screen,
      viewport: { ...circuit.viewport },
    };
    updateCanvasCursor();
    return;
  }

  const portHit = hitPort(point);
  const component = hitComponent(point);
  if (shouldUsePort(point, portHit, component)) {
    if (pendingWire) {
      connectEndpoints(pendingWire.from, portHit.endpoint);
      pendingWire = null;
      hoverPort = null;
      updateCanvasCursor();
      return;
    }
    interaction = {
      kind: 'wire',
      from: portHit.endpoint,
      startScreen: screen,
      current: point,
      moved: false,
    };
    hoverPort = portHit;
    updateCanvasCursor();
    return;
  }

  if (component) {
    if (event.shiftKey) {
      if (selectedComponents.has(component.id)) selectedComponents.delete(component.id);
      else selectedComponents.add(component.id);
      selectedWires.clear();
    } else if (!selectedComponents.has(component.id)) {
      selectOnlyComponent(component.id);
    }
    const positions = new Map([...selectedComponents].map((id) => {
      const item = componentById(circuit, id);
      return [id, { ...item.position }];
    }));
    const before = cloneCircuitDocument(circuit);
    interaction = {
      kind: 'component',
      componentId: component.id,
      startWorld: point,
      startScreen: screen,
      positions,
      before,
      moved: false,
      longPressed: false,
      momentary: component.type === 'button',
    };
    if (component.type === 'button') {
      component.state.pressed = true;
      simulateNow(0);
    }
    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(() => {
      if (!interaction || interaction.kind !== 'component' || interaction.moved) return;
      interaction.longPressed = true;
      showContextMenu(screen, component.id);
      if (interaction.momentary) releaseMomentaryButton(component.id);
      navigator.vibrate?.(18);
    }, 560);
    updateSelectionUi();
    return;
  }

  const wireHit = hitWire(point);
  if (wireHit) {
    if (event.shiftKey) {
      if (selectedWires.has(wireHit.wire.id)) selectedWires.delete(wireHit.wire.id);
      else selectedWires.add(wireHit.wire.id);
    } else {
      selectOnlyWire(wireHit.wire.id);
    }
    updateSelectionUi();
    return;
  }

  if (pendingWire) {
    pendingWire = null;
    hoverPort = null;
    showToast(t('wireCancelled'));
    updateCanvasCursor();
    return;
  }

  if (selectedTool) {
    addPart(selectedTool, point);
    return;
  }

  interaction = {
    kind: 'marquee',
    startWorld: point,
    current: point,
    append: event.shiftKey,
  };
  if (!event.shiftKey) clearSelection();
}

function onPointerMove(event) {
  const screen = screenPoint(event);
  const point = worldPointFromScreen(screen);
  hoverWorld = point;
  if (activePointers.has(event.pointerId)) activePointers.set(event.pointerId, screen);
  if (pinch) {
    updatePinch();
    return;
  }
  hoverPort = (interaction?.kind === 'wire' || pendingWire)
    ? hitPort(point, interaction?.from || pendingWire?.from)
    : null;
  if (!interaction) return;

  const movedDistance = Math.hypot(
    screen.x - (interaction.startScreen?.x ?? screen.x),
    screen.y - (interaction.startScreen?.y ?? screen.y),
  );
  if (movedDistance > 7) clearTimeout(longPressTimer);

  if (interaction.kind === 'wire') {
    interaction.current = point;
    interaction.moved ||= movedDistance > 6;
  } else if (interaction.kind === 'component') {
    if (movedDistance <= 5 && !interaction.moved) return;
    if (!interaction.moved && interaction.momentary) releaseMomentaryButton(interaction.componentId);
    interaction.moved = true;
    const delta = {
      x: point.x - interaction.startWorld.x,
      y: point.y - interaction.startWorld.y,
    };
    for (const [id, start] of interaction.positions) {
      const component = componentById(circuit, id);
      if (!component) continue;
      component.position = clampComponentPosition(component.type, snapPoint({
        x: start.x + delta.x,
        y: start.y + delta.y,
      }));
    }
    updateCanvasCursor();
  } else if (interaction.kind === 'pan') {
    circuit.viewport.x = interaction.viewport.x - (screen.x - interaction.startScreen.x) / circuit.viewport.zoom;
    circuit.viewport.y = interaction.viewport.y - (screen.y - interaction.startScreen.y) / circuit.viewport.zoom;
  } else if (interaction.kind === 'marquee') {
    interaction.current = point;
  }
}

function onPointerUp(event) {
  const screen = screenPoint(event);
  const point = worldPointFromScreen(screen);
  activePointers.delete(event.pointerId);
  try {
    dom.stage.releasePointerCapture(event.pointerId);
  } catch {
    // Release can fail after the browser has already cancelled capture.
  }
  if (pinch) {
    if (activePointers.size < 2) {
      pinch = null;
      scheduleAutosave();
      updateCanvasCursor();
    }
    return;
  }

  clearTimeout(longPressTimer);
  const currentInteraction = interaction;
  interaction = null;
  if (!currentInteraction) {
    updateCanvasCursor();
    return;
  }

  if (currentInteraction.kind === 'wire') {
    const target = hitPort(point, currentInteraction.from);
    if (target) {
      connectEndpoints(currentInteraction.from, target.endpoint);
      pendingWire = null;
    } else if (!currentInteraction.moved) {
      pendingWire = { from: currentInteraction.from };
    } else {
      pendingWire = null;
      showToast(t('wireCancelled'));
    }
    hoverPort = null;
  } else if (currentInteraction.kind === 'component') {
    const component = componentById(circuit, currentInteraction.componentId);
    if (currentInteraction.momentary) releaseMomentaryButton(currentInteraction.componentId);
    if (currentInteraction.longPressed) {
      updateCanvasCursor();
      return;
    }
    if (currentInteraction.moved) {
      commitSnapshot(currentInteraction.before);
      simulateNow(0);
    } else if (component && ['switch', 'spdt', 'breaker'].includes(component.type)) {
      const action = actionForComponent(component);
      mutate((document) => actionForComponent(componentById(document, component.id)).run(), action.message);
      playClick();
    }
  } else if (currentInteraction.kind === 'marquee') {
    const minX = Math.min(currentInteraction.startWorld.x, currentInteraction.current.x);
    const maxX = Math.max(currentInteraction.startWorld.x, currentInteraction.current.x);
    const minY = Math.min(currentInteraction.startWorld.y, currentInteraction.current.y);
    const maxY = Math.max(currentInteraction.startWorld.y, currentInteraction.current.y);
    if (!currentInteraction.append) clearSelection();
    for (const component of circuit.components) {
      if (component.position.x >= minX && component.position.x <= maxX
        && component.position.y >= minY && component.position.y <= maxY) {
        selectedComponents.add(component.id);
      }
    }
    updateSelectionUi();
  } else if (currentInteraction.kind === 'pan') {
    scheduleAutosave();
  }
  updateCanvasCursor();
}

function onPointerCancel(event) {
  activePointers.delete(event.pointerId);
  clearTimeout(longPressTimer);
  if (interaction?.kind === 'button' || interaction?.momentary) {
    releaseMomentaryButton(interaction.componentId);
  }
  interaction = null;
  pinch = null;
  updateCanvasCursor();
}

function releaseMomentaryButton(id) {
  const component = componentById(circuit, id);
  if (component?.type === 'button' && component.state.pressed) {
    component.state.pressed = false;
    simulateNow(0);
  }
}

function onWheel(event) {
  event.preventDefault();
  const anchor = screenPoint(event);
  setZoom(circuit.viewport.zoom * Math.exp(-event.deltaY * .0012), anchor);
}

function showContextMenu(screen, componentId) {
  selectOnlyComponent(componentId);
  dom.contextMenu.dataset.componentId = componentId;
  dom.contextMenu.hidden = false;
  const maxX = dom.canvasWrap.clientWidth - 200;
  const maxY = dom.canvasWrap.clientHeight - 210;
  dom.contextMenu.style.left = `${clamp(screen.x, 8, Math.max(8, maxX))}px`;
  dom.contextMenu.style.top = `${clamp(screen.y, 8, Math.max(8, maxY))}px`;
}

function hideContextMenu() {
  dom.contextMenu.hidden = true;
  delete dom.contextMenu.dataset.componentId;
}

function openPanel(id) {
  for (const panel of [$('#toolboxPanel'), $('#inspectorPanel')]) {
    panel.classList.toggle('is-open', panel.id === id);
  }
  $('#toolboxToggle').setAttribute('aria-expanded', String(id === 'toolboxPanel'));
  $('#inspectorToggle').setAttribute('aria-expanded', String(id === 'inspectorPanel'));
  dom.panelScrim.hidden = false;
}

function closePanels() {
  $('#toolboxPanel').classList.remove('is-open');
  $('#inspectorPanel').classList.remove('is-open');
  $('#toolboxToggle').setAttribute('aria-expanded', 'false');
  $('#inspectorToggle').setAttribute('aria-expanded', 'false');
  dom.panelScrim.hidden = true;
}

function ensureAudio() {
  if (settings.muted || audioContext) return;
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume?.();
  } catch {
    audioContext = null;
  }
}

function playTone(frequency, duration = .08, type = 'triangle', gain = .035, delay = 0) {
  if (settings.muted || !audioContext) return;
  try {
    const at = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, at);
    envelope.gain.setValueAtTime(.001, at);
    envelope.gain.exponentialRampToValueAtTime(gain, at + .012);
    envelope.gain.exponentialRampToValueAtTime(.001, at + duration);
    oscillator.connect(envelope).connect(audioContext.destination);
    oscillator.start(at);
    oscillator.stop(at + duration + .03);
  } catch {
    audioContext = null;
  }
}

function playClick() {
  playTone(260, .045, 'square', .025);
  playTone(520, .05, 'triangle', .022, .035);
}

function playSuccess() {
  [523, 659, 784].forEach((frequency, index) => playTone(frequency, .11, 'triangle', .035, index * .055));
}

function roundRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function draw(timestamp) {
  const { width, height, dpr } = canvasSize;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  const background = ctx.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, '#071633');
  background.addColorStop(1, '#040b1c');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(circuit.viewport.zoom, circuit.viewport.zoom);
  ctx.translate(-circuit.viewport.x, -circuit.viewport.y);
  drawWorkbench(timestamp);
  drawWires(timestamp);
  drawComponents(timestamp);
  drawWireDraft();
  drawMarquee();
  ctx.restore();
}

function drawWorkbench(timestamp) {
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD.townHeight + 30);
  sky.addColorStop(0, '#081431');
  sky.addColorStop(.62, '#172d5d');
  sky.addColorStop(1, '#3b386d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD.width, WORLD.townHeight + 30);

  for (let index = 0; index < 48; index += 1) {
    const x = (index * 137 + 41) % WORLD.width;
    const y = 18 + (index * 47) % 108;
    const pulse = .48 + Math.sin(timestamp * .0014 + index) * .18;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = index % 7 === 0 ? '#ffd64d' : '#c8dcff';
    ctx.beginPath();
    ctx.arc(x, y, index % 7 === 0 ? 2.2 : 1.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  drawTown();
  const bench = ctx.createLinearGradient(0, WORLD.townHeight, 0, WORLD.height);
  bench.addColorStop(0, '#0d2857');
  bench.addColorStop(1, '#081a3d');
  ctx.fillStyle = bench;
  ctx.fillRect(0, WORLD.townHeight, WORLD.width, WORLD.height - WORLD.townHeight);

  ctx.strokeStyle = 'rgba(107, 154, 221, .13)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= WORLD.width; x += 40) {
    ctx.moveTo(x, WORLD.townHeight);
    ctx.lineTo(x, WORLD.height);
  }
  for (let y = WORLD.townHeight; y <= WORLD.height; y += 40) {
    ctx.moveTo(0, y);
    ctx.lineTo(WORLD.width, y);
  }
  ctx.stroke();

  ctx.strokeStyle = 'rgba(101, 217, 237, .22)';
  ctx.lineWidth = 2;
  roundRect(ctx, 18, WORLD.townHeight + 16, WORLD.width - 36, WORLD.height - WORLD.townHeight - 34, 28);
  ctx.stroke();
  ctx.fillStyle = 'rgba(101, 217, 237, .45)';
  ctx.font = '800 13px "Baloo Lab", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('MOUSE TOWN POWER BENCH · OPEN CIRCUIT AREA', 48, WORLD.townHeight + 48);
}

function drawTown() {
  const lamps = circuit.components.filter((component) => component.type === 'lamp');
  for (let index = 0; index < 11; index += 1) {
    const width = 112;
    const x = 35 + index * 142;
    const height = 58 + (index % 3) * 13;
    const y = WORLD.townHeight - height;
    const lamp = lamps[index % Math.max(1, lamps.length)];
    const brightness = lamp ? analysis.components[lamp.id]?.brightness || 0 : 0;
    ctx.fillStyle = '#263f6f';
    ctx.strokeStyle = '#061126';
    ctx.lineWidth = 4;
    roundRect(ctx, x, y, width, height + 8, 11);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 7, y + 7);
    ctx.lineTo(x + width / 2, y - 34);
    ctx.lineTo(x + width + 7, y + 7);
    ctx.closePath();
    ctx.fillStyle = index % 2 ? '#d33f76' : '#f15b88';
    ctx.fill();
    ctx.stroke();
    for (let windowIndex = 0; windowIndex < 2; windowIndex += 1) {
      ctx.fillStyle = brightness > .02 ? '#ffe36c' : '#172748';
      ctx.globalAlpha = brightness > .02 ? .42 + brightness * .58 : 1;
      roundRect(ctx, x + 18 + windowIndex * 54, y + 22, 25, 24, 5);
      ctx.fill();
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = '#ffd64d';
  ctx.font = '34px serif';
  ctx.fillText(analysis.summary.status === 'short' ? '🐭⚡' : analysis.summary.status === 'active' ? '🐭💡' : '🐭🔦', 60, 72);
}

function drawWires(timestamp) {
  for (const wire of circuit.wires) {
    const curve = wireCurve(wire);
    if (!curve) continue;
    const meter = analysis.wires[wire.id] || { active: false, current: 0, potential: 0 };
    const selected = selectedWires.has(wire.id);
    const short = analysis.summary.status === 'short' && meter.active;
    const source = Math.max(.1, analysis.summary.sourceVoltage);
    let color = '#4b6187';
    if (short) color = '#ff525d';
    else if (meter.active && meter.potential > source * .48) color = '#ffd64d';
    else if (meter.active) color = '#65d9ed';

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selected ? '#ff5d8f' : '#030817';
    ctx.lineWidth = selected ? 13 : 11;
    ctx.beginPath();
    ctx.moveTo(curve.start.x, curve.start.y);
    ctx.bezierCurveTo(curve.controlA.x, curve.controlA.y, curve.controlB.x, curve.controlB.y, curve.end.x, curve.end.y);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = short ? 7 : meter.active ? 6 : 5;
    if (!meter.active) ctx.setLineDash([12, 7]);
    ctx.beginPath();
    ctx.moveTo(curve.start.x, curve.start.y);
    ctx.bezierCurveTo(curve.controlA.x, curve.controlA.y, curve.controlB.x, curve.controlB.y, curve.end.x, curve.end.y);
    ctx.stroke();
    ctx.setLineDash([]);

    if (short) drawWireSmoke(curve, timestamp);
    if (settings.showCurrent && settings.running && settings.powered && meter.active) {
      const count = clamp(Math.ceil(meter.current * 1.5), 2, 7);
      for (let index = 0; index < count; index += 1) {
        const progress = (timestamp * (.00015 + Math.min(meter.current, 8) * .000035) + index / count) % 1;
        const amount = meter.direction < 0 ? 1 - progress : progress;
        const point = bezierPoint(curve, amount);
        ctx.fillStyle = short ? '#fff2f0' : '#fff3a8';
        ctx.strokeStyle = short ? '#ff303a' : '#8f6411';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
  }
}

function drawWireSmoke(curve, timestamp) {
  for (let index = 0; index < 4; index += 1) {
    const amount = .22 + index * .17;
    const point = bezierPoint(curve, amount);
    const float = ((timestamp * .025 + index * 13) % 34);
    ctx.globalAlpha = .34 * (1 - float / 42);
    ctx.fillStyle = '#b7b4c4';
    ctx.beginPath();
    ctx.arc(point.x + Math.sin(index + timestamp * .003) * 8, point.y - 10 - float, 7 + float * .28, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawComponents(timestamp) {
  const connectedPorts = new Set(circuit.wires.flatMap((wire) => [
    `${wire.from.componentId}:${wire.from.portId}`,
    `${wire.to.componentId}:${wire.to.portId}`,
  ]));
  for (const component of circuit.components) drawComponent(component, timestamp);
  for (const component of circuit.components) drawPorts(component, connectedPorts, timestamp);
}

function drawComponent(component, timestamp) {
  const definition = COMPONENT_CATALOG[component.type];
  const size = definition.size;
  const meter = analysis.components[component.id] || {};
  const selected = selectedComponents.has(component.id);
  const fault = ['overload', 'protected', 'overvoltage', 'heating', 'tripped', 'blown'].includes(meter.status || component.state.status);
  if (component.type === 'lamp' && meter.brightness > .01) {
    const glow = ctx.createRadialGradient(component.position.x, component.position.y, 12, component.position.x, component.position.y, 90);
    glow.addColorStop(0, `rgba(255, 224, 91, ${.34 + meter.brightness * .28})`);
    glow.addColorStop(1, 'rgba(255, 214, 77, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(component.position.x, component.position.y, 90, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(component.position.x, component.position.y);
  ctx.rotate(component.rotation * Math.PI / 180);
  if (selected) {
    ctx.shadowColor = '#65d9ed';
    ctx.shadowBlur = 22;
  } else if (fault) {
    ctx.shadowColor = '#ff5b5f';
    ctx.shadowBlur = 20;
  }
  ctx.fillStyle = component.type === 'battery' || component.type === 'batteryBox'
    ? '#ffd64d'
    : component.type === 'lamp' && meter.brightness > .02 ? '#fff0a6' : '#fff3c4';
  ctx.strokeStyle = fault ? '#ff4c58' : selected ? '#65d9ed' : '#09152e';
  ctx.lineWidth = selected || fault ? 5 : 4;
  roundRect(ctx, -size.width / 2, -size.height / 2, size.width, size.height, 18);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  drawComponentFace(component, meter, timestamp, size);
  ctx.restore();

  if (settings.showData && (meter.current > .0005 || selected)) {
    drawDataTag(component, meter);
  }
}

function drawComponentFace(component, meter, timestamp, size) {
  ctx.fillStyle = '#132348';
  ctx.strokeStyle = '#132348';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (component.type === 'battery' || component.type === 'batteryBox') {
    ctx.font = '900 22px "Baloo Lab", sans-serif';
    ctx.fillText('−', -34, 2);
    ctx.fillText('+', 34, 2);
    ctx.fillStyle = '#fff7d8';
    roundRect(ctx, -14, -25, 28, 50, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#132348';
    ctx.font = '20px serif';
    ctx.fillText(component.type === 'batteryBox' ? '▥' : '🔋', 0, 0);
  } else if (component.type === 'lamp') {
    const pulse = meter.brightness > .02 ? 1 + Math.sin(timestamp * .008) * .035 : 1;
    ctx.save();
    ctx.scale(pulse, pulse);
    ctx.font = '35px serif';
    ctx.fillText(component.state.removed ? '◌' : component.state.damaged ? '💔' : '💡', 0, -4);
    ctx.restore();
  } else if (component.type === 'motor') {
    ctx.save();
    ctx.rotate(timestamp * .004 * (meter.speed || 0));
    ctx.lineWidth = 5;
    for (let index = 0; index < 6; index += 1) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(25, 0);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#ff5d8f';
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  } else if (component.type === 'buzzer') {
    ctx.font = '32px serif';
    ctx.fillText('📣', -4, 0);
    if (meter.status === 'sounding') {
      ctx.strokeStyle = '#ff5d8f';
      ctx.lineWidth = 3;
      for (let index = 0; index < 2; index += 1) {
        ctx.beginPath();
        ctx.arc(25, 0, 10 + index * 10, -.75, .75);
        ctx.stroke();
      }
    }
  } else if (component.type === 'switch') {
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(-28, 14, 7, 0, Math.PI * 2);
    ctx.moveTo(-22, 10);
    ctx.lineTo(27, component.state.closed ? 14 : -17);
    ctx.stroke();
    ctx.fillStyle = component.state.closed ? '#0c9f73' : '#d73d63';
    ctx.font = '900 13px "Baloo Lab", sans-serif';
    ctx.fillText(component.state.closed ? 'ON' : 'OFF', 0, -20);
  } else if (component.type === 'spdt') {
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-34, 0);
    ctx.lineTo(29, component.state.throw === 'b' ? 23 : -23);
    ctx.stroke();
    ctx.fillStyle = '#d93771';
    ctx.font = '900 15px "Baloo Lab", sans-serif';
    ctx.fillText(component.state.throw === 'b' ? '2' : '1', 0, 0);
  } else if (component.type === 'button') {
    ctx.fillStyle = component.state.pressed ? '#b62652' : '#ff5d8f';
    ctx.strokeStyle = '#132348';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, component.state.pressed ? 6 : -5, 25, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#132348';
    ctx.fillRect(-5, component.state.pressed ? 16 : 8, 10, 12);
  } else if (component.type === 'breaker') {
    ctx.fillStyle = component.state.tripped ? '#ff5b5f' : component.state.closed ? '#4de2a8' : '#c6cad4';
    roundRect(ctx, -29, -22, 58, 44, 10);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#132348';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-15, component.state.closed ? 11 : -12);
    ctx.lineTo(17, component.state.closed ? -11 : 12);
    ctx.stroke();
  } else if (component.type === 'fuse') {
    ctx.fillStyle = '#d9f4f6';
    roundRect(ctx, -34, -17, 68, 34, 15);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = component.state.blown ? '#ff5b5f' : component.state.status === 'heating' ? '#ff9d48' : '#d93771';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-24, 0);
    if (component.state.blown) {
      ctx.lineTo(-6, 0);
      ctx.moveTo(7, 0);
      ctx.lineTo(24, 0);
    } else {
      ctx.bezierCurveTo(-12, -12, 12, 12, 24, 0);
    }
    ctx.stroke();
  } else if (component.type === 'junction') {
    ctx.fillStyle = '#ff5d8f';
    ctx.beginPath();
    ctx.arc(0, 0, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff3c4';
    ctx.font = '900 24px "Baloo Lab", sans-serif';
    ctx.fillText('✣', 0, 0);
  }

  if (!['junction', 'lamp'].includes(component.type)) {
    ctx.fillStyle = '#132348';
    ctx.font = '800 11px "Baloo Lab", "PingFang SC", sans-serif';
    const label = COMPONENT_CATALOG[component.type].label[lang];
    ctx.fillText(label, 0, size.height / 2 - 10);
  }
}

function drawPorts(component, connectedPorts, timestamp) {
  for (const port of component.ports) {
    const position = portPosition(component, port.id);
    const key = `${component.id}:${port.id}`;
    const connected = connectedPorts.has(key);
    const selected = pendingWire?.from.componentId === component.id && pendingWire?.from.portId === port.id
      || interaction?.kind === 'wire'
        && interaction.from.componentId === component.id
        && interaction.from.portId === port.id;
    const hovered = hoverPort?.endpoint.componentId === component.id && hoverPort?.endpoint.portId === port.id;
    const wiring = Boolean(pendingWire || interaction?.kind === 'wire');
    const pulse = wiring && !connected ? Math.sin(timestamp * .008 + position.x) * 1.8 : 0;
    ctx.fillStyle = selected ? '#ff5d8f' : hovered ? '#65d9ed' : connected ? '#132348' : '#fff3c4';
    ctx.strokeStyle = selected ? '#fff3c4' : hovered ? '#07142f' : connected ? '#65d9ed' : '#ffd64d';
    ctx.lineWidth = hovered || selected ? 5 : 4;
    ctx.beginPath();
    ctx.arc(position.x, position.y, (hovered ? 13 : 10) + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (wiring && !selected && !connected) {
      ctx.globalAlpha = .24;
      ctx.strokeStyle = '#65d9ed';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(position.x, position.y, 19 + pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}

function drawDataTag(component, meter) {
  const width = 112;
  const x = component.position.x - width / 2;
  const y = component.position.y - COMPONENT_CATALOG[component.type].size.height / 2 - 39;
  ctx.fillStyle = 'rgba(5, 16, 39, .9)';
  ctx.strokeStyle = selectedComponents.has(component.id) ? '#65d9ed' : 'rgba(101, 217, 237, .36)';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, width, 28, 9);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#eef5ff';
  ctx.font = '800 12px "Baloo Lab", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${Number(meter.voltage || 0).toFixed(1)}V · ${Number(meter.current || 0).toFixed(2)}A`, component.position.x, y + 14);
}

function drawWireDraft() {
  const draft = interaction?.kind === 'wire' ? interaction : pendingWire;
  if (!draft) return;
  const start = endpointPosition(draft.from);
  const end = hoverPort?.position || interaction?.current || hoverWorld;
  if (!start || !end) return;
  ctx.strokeStyle = hoverPort ? '#65d9ed' : '#ff5d8f';
  ctx.lineWidth = 5;
  ctx.setLineDash([11, 8]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  const direction = end.x >= start.x ? 1 : -1;
  const bend = Math.max(55, Math.abs(end.x - start.x) * .45);
  ctx.bezierCurveTo(start.x + bend * direction, start.y, end.x - bend * direction, end.y, end.x, end.y);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawMarquee() {
  if (interaction?.kind !== 'marquee') return;
  const x = Math.min(interaction.startWorld.x, interaction.current.x);
  const y = Math.min(interaction.startWorld.y, interaction.current.y);
  const width = Math.abs(interaction.current.x - interaction.startWorld.x);
  const height = Math.abs(interaction.current.y - interaction.startWorld.y);
  ctx.fillStyle = 'rgba(101, 217, 237, .1)';
  ctx.strokeStyle = '#65d9ed';
  ctx.lineWidth = 2 / circuit.viewport.zoom;
  ctx.setLineDash([8 / circuit.viewport.zoom, 6 / circuit.viewport.zoom]);
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
  ctx.setLineDash([]);
}

function bindControls() {
  dom.stage.addEventListener('pointerdown', onPointerDown);
  dom.stage.addEventListener('pointermove', onPointerMove);
  dom.stage.addEventListener('pointerup', onPointerUp);
  dom.stage.addEventListener('pointercancel', onPointerCancel);
  dom.stage.addEventListener('wheel', onWheel, { passive: false });
  dom.stage.addEventListener('contextmenu', (event) => event.preventDefault());
  dom.stage.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  });
  dom.stage.addEventListener('drop', (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/x-electric-component');
    if (COMPONENT_CATALOG[type]) addPart(type, worldPoint(event));
  });

  $('#runBtn').addEventListener('click', () => {
    settings.running = !settings.running;
    persistSettings();
    simulateNow(0);
    updateToolbar();
  });
  $('#powerBtn').addEventListener('click', () => {
    ensureAudio();
    settings.powered = !settings.powered;
    persistSettings();
    simulateNow(0);
    playClick();
  });
  $('#undoBtn').addEventListener('click', undo);
  $('#redoBtn').addEventListener('click', redo);
  $('#copyBtn').addEventListener('click', copySelection);
  $('#deleteBtn').addEventListener('click', deleteSelection);
  $('#rotateBtn').addEventListener('click', rotateSelection);
  $('#duplicateBtn').addEventListener('click', copySelection);
  $('#removeBtn').addEventListener('click', deleteSelection);
  dom.componentActionBtn.addEventListener('click', operateSelectedComponent);
  $('#clearBtn').addEventListener('click', () => {
    dom.clearDialog.hidden = false;
    $('#cancelClearBtn').focus();
  });
  $('#cancelClearBtn').addEventListener('click', () => {
    dom.clearDialog.hidden = true;
  });
  $('#confirmClearBtn').addEventListener('click', () => {
    dom.clearDialog.hidden = true;
    mutate((document) => {
      document.components = [];
      document.wires = [];
    }, t('cleared'));
    clearSelection();
  });
  dom.clearDialog.addEventListener('click', (event) => {
    if (event.target === dom.clearDialog) dom.clearDialog.hidden = true;
  });

  $('#saveBtn').addEventListener('click', () => {
    try {
      saveCircuit(localStorage, circuit, SAVED_CIRCUIT_KEY);
      showToast(t('saved'));
      window.cool?.track?.('save_circuit');
      playSuccess();
    } catch {
      showToast(t('saveFailed'));
    }
  });
  $('#loadBtn').addEventListener('click', () => {
    try {
      const loaded = loadCircuit(localStorage, SAVED_CIRCUIT_KEY);
      if (!loaded) {
        showToast(t('noSave'));
        return;
      }
      history.push(cloneCircuitDocument(circuit));
      future = [];
      circuit = loaded;
      clearSelection();
      simulateNow(0);
      scheduleAutosave();
      showToast(t('loaded'));
      window.cool?.track?.('load_circuit');
    } catch {
      showToast(t('loadFailed'));
    }
  });
  $('#resetViewBtn').addEventListener('click', resetView);
  $('#zoomInBtn').addEventListener('click', () => setZoom(circuit.viewport.zoom * 1.15));
  $('#zoomOutBtn').addEventListener('click', () => setZoom(circuit.viewport.zoom / 1.15));
  $('#currentBtn').addEventListener('click', () => {
    settings.showCurrent = !settings.showCurrent;
    persistSettings();
    updateToolbar();
  });
  $('#dataBtn').addEventListener('click', () => {
    settings.showData = !settings.showData;
    persistSettings();
    updateToolbar();
  });
  $('#muteBtn').addEventListener('click', () => {
    settings.muted = !settings.muted;
    if (!settings.muted) {
      ensureAudio();
      playClick();
    }
    persistSettings();
    updateToolbar();
  });
  $('#themeBtn').addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme();
  });
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    writePreference('kidslab.lang', lang);
    applyLanguage();
  });
  dom.projectName.addEventListener('change', () => {
    const name = dom.projectName.value.trim();
    if (!name || name === circuit.name) {
      dom.projectName.value = circuit.name;
      return;
    }
    mutate((document) => {
      document.name = name;
    });
  });
  $('#dismissGuide').addEventListener('click', () => {
    settings.guideDismissed = true;
    $('#firstGuide').hidden = true;
    persistSettings();
  });

  $('#toolboxToggle').addEventListener('click', () => openPanel('toolboxPanel'));
  $('#inspectorToggle').addEventListener('click', () => openPanel('inspectorPanel'));
  dom.panelScrim.addEventListener('click', closePanels);
  document.querySelectorAll('[data-close-panel]').forEach((button) => {
    button.addEventListener('click', closePanels);
  });

  dom.contextMenu.addEventListener('click', (event) => {
    const button = event.target.closest('[data-context-action]');
    if (!button) return;
    const action = button.dataset.contextAction;
    hideContextMenu();
    if (action === 'toggle') operateSelectedComponent();
    else if (action === 'rotate') rotateSelection();
    else if (action === 'copy') copySelection();
    else if (action === 'delete') deleteSelection();
  });

  addEventListener('keydown', (event) => {
    if (event.target.matches('input')) return;
    if (event.code === 'Space') {
      spaceDown = true;
      event.preventDefault();
    }
    const command = event.metaKey || event.ctrlKey;
    if (command && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    } else if (command && event.key.toLowerCase() === 'y') {
      event.preventDefault();
      redo();
    } else if (command && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      copySelection();
    } else if (command && event.key.toLowerCase() === 'v') {
      event.preventDefault();
      pasteClipboard();
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      deleteSelection();
    } else if (event.key.toLowerCase() === 'r') {
      rotateSelection();
    } else if (event.key === 'Escape') {
      pendingWire = null;
      selectedTool = null;
      hideContextMenu();
      closePanels();
      buildToolbox();
      updateCanvasCursor();
    }
  });
  addEventListener('keyup', (event) => {
    if (event.code === 'Space') spaceDown = false;
  });
  addEventListener('blur', () => {
    spaceDown = false;
    for (const component of circuit.components) {
      if (component.type === 'button') component.state.pressed = false;
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && audioContext?.state === 'running') audioContext.suspend?.();
  });
}

function animate(timestamp) {
  if (!lastFrame || timestamp - lastFrame >= 1000 / 60) {
    lastFrame = timestamp;
    draw(timestamp);
  }
  requestAnimationFrame(animate);
}

function startSimulationClock() {
  setInterval(() => {
    if (settings.running) simulateNow(100);
  }, 100);
}

function initialize() {
  document.documentElement.dataset.theme = theme;
  $('#firstGuide').hidden = settings.guideDismissed;
  applyTheme();
  buildToolbox();
  bindControls();
  resizeCanvas();
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(resizeCanvas).observe(dom.canvasWrap);
  } else {
    addEventListener('resize', resizeCanvas);
  }
  applyLanguage();
  simulateNow(0);
  startSimulationClock();
  requestAnimationFrame(animate);
  window.cool?.stage?.('free-lab');
}

initialize();
