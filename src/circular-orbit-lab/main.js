import * as THREE from './vendor/three.module.min.js';
import {
  EARTH_RADIUS,
  LAUNCH_ALTITUDES,
  MISSIONS,
  SYNC_PERIOD_SECONDS,
  altitudeFromRadius,
  circularSpeed,
  classifyLaunch,
  crashSpeed,
  createFlight,
  describeOrbit,
  escapeSpeed,
  gravityAtRadius,
  isSyncOrbit,
  radiusAtAngle,
  radiusForPeriod,
  radiusFromAltitude,
  simulationStep,
  stepFlight,
} from './orbit-model.js';

/* ================================ i18n ================================ */

const I18N = {
  zh: {
    doc: '圆周与卫星实验室 · KidsLab',
    back: '返回平台',
    title: '圆周与卫星实验室',
    navTask: '任务',
    navStage: '发射台',
    navLog: '数据',
    tabLaunch: '发射',
    tabAnalyse: '分析',
    tabDesign: '挑战',
    stationLaunchTitle: '同一个高度，速度决定命运',
    stationAnalyseTitle: '三种结局的分界线',
    stationDesignTitle: '让卫星停在天上不动',
    predictionTitle: '先猜一猜',
    predictionPrompt: '卫星正好圆着转的时候，把速度再加大一点点，会发生什么？',
    predictionFall: '掉得更快',
    predictionHigher: '跑得更远更慢',
    predictionAway: '立刻飞走',
    predictionSavedRight: '记住这个猜想。发射一次就能验证。',
    predictionSavedOther: '先别改。让轨道自己给答案。',
    predictionVerdict: (guess, period) => `你猜「${guess}」。实测：轨道变成椭圆，跑得更远，一圈要 ${period}，比圆轨更久。`,
    missionTitle: '三种结局都做一次',
    missionHintDefault: '只改速度，高度先别动。',
    missionHintCircle: '把速度对准「环绕」那个数，误差小于 0.5% 才算圆。',
    missionHintFall: '速度太小，椭圆的最低点会掉进大气。',
    missionHintLeave: '速度到达「逃逸」那个数，它就再也不回来了。',
    missionHintDone: '三种都做出来了。去分析站看它们的分界线。',
    missionCircle: '让它刚好圆着转',
    missionFall: '让它掉回地球',
    missionLeave: '让它彻底飞走',
    controlLabel: '控制变量：',
    controlLaunch: '同一个高度、同一个地球、发射方向始终水平。',
    bandTitle: '速度带',
    bandIntro: '把每次发射按「高度—速度」点上去，看它掉进哪一条带子。',
    bandChartTitle: '高度与速度的轨道分区图',
    bandNote: '两条线分别是环绕速度和逃逸速度。它们都随高度升高而变小。',
    axisSpeed: 'v / km·s⁻¹',
    axisAltitude: '高度 / 千 km',
    legendCrash: '坠回',
    legendEllipse: '椭圆',
    legendEscape: '逃逸',
    designTitle: '挂在同一个地方不动',
    designPrompt: '通信卫星要一直停在同一片天空上方，所以它绕一圈的时间必须正好等于地球自转一圈。',
    designTargetLabel: '目标周期',
    designHow: '自己选高度，再把速度对准环绕速度，然后发射验证。',
    designHintFormula: '线索：周期只跟轨道半径有关，半径越大，一圈越久。',
    designWaiting: '还没有符合的圆轨。调高度，再对准环绕速度。',
    designNotCircular: '这次不是圆轨。同步卫星必须走圆轨，不然它会在天上来回晃。',
    designTooFast: (period) => `一圈只要 ${period}，比一天短。要往更高的轨道去。`,
    designTooSlow: (period) => `一圈要 ${period}，比一天长了。高度再降一些。`,
    designDone: (altitude) => `成功！高度约 ${altitude} 的圆轨，一圈正好一天，卫星始终停在地面站上方。`,
    stageTitle: '发射控制台',
    readAltitude: '高度',
    readSpeed: '速度',
    readClock: '任务时钟',
    hintOrbit: '拖动可以转动视角',
    nogl: '这台设备暂时打不开 3D，换个浏览器就能看轨道了。',
    altitudeLabel: '发射高度',
    speedLabel: '水平速度',
    markCircular: '环绕',
    markEscape: '逃逸',
    launch: '发射',
    vectors: '受力箭头',
    abort: '收回',
    stateReady: '待发射',
    stateFlying: '飞行中',
    stateOrbiting: '已入轨',
    stateCrashed: '坠入大气',
    stateEscaped: '飞离地球',
    logTitle: '飞行记录',
    reset: '重开实验',
    entryTitle: '抄下这次的读数',
    entryWaiting: '发射一次，这里就会出现待记录的读数。',
    entryFlying: '让它飞完一圈，周期才有读数。',
    entryReady: '读数齐了，记进数据表。',
    logTrial: '记入数据表',
    colTrial: '#',
    colAltitude: '高度',
    colSpeed: '速度',
    colKind: '轨道',
    colPeriod: '周期',
    colPerigee: '近地点',
    kindCircular: '圆轨',
    kindEllipse: '椭圆',
    kindCrash: '坠回',
    kindEscape: '逃逸',
    trialEmpty: '还没有记录',
    belowGround: '地面以下',
    launched: (speed) => `点火！水平速度 ${speed} km/s。`,
    crashed: '它擦进大气，任务失败 —— 速度不够，引力赢了。',
    escaped: '它挣脱了引力，再也不回来了。',
    orbited: (period) => `绕完一圈：${period}。`,
    circularHit: '正圆！引力刚好只用来拐弯，不多不少。',
    needLaunch: '先发射一次。',
    aborted: '卫星收回了。改个参数再来。',
    logged: (index) => `第 ${index} 次记录写好了。`,
    resetDone: '实验重置了。数据表已清空。',
    missionDone: (name) => `任务达成：${name}`,
    allMissions: '三种结局都做到了。',
    conclusionStart: '发射一次，记录里就会多一行。',
    conclusionBand: '看数据表：同一个高度，速度小了坠回、大了飞走，中间那一档才留得住。',
    conclusionKepler: '再比周期：轨道越高，一圈越久 —— 圆轨的速度和周期只由半径决定。',
    conclusionFinal: '结论：卫星不是被「推着走」，是引力刚好把它拐弯。速度配不上高度，它就掉下来或者飞出去。',
    soundOn: '关闭声音',
    soundOff: '打开声音',
    theme: '切换主题',
    lang: 'Switch to English',
    allDone: '通关：三种结局都做过，同步轨道也算出来了。',
    hours: (h, m) => `${h} h ${m} min`,
    minutes: (m) => `${m} min`,
  },
  en: {
    doc: 'Circular Orbit Lab · KidsLab',
    back: 'Back to platform',
    title: 'Circular Orbit Lab',
    navTask: 'Task',
    navStage: 'Launch',
    navLog: 'Data',
    tabLaunch: 'Launch',
    tabAnalyse: 'Analyse',
    tabDesign: 'Design',
    stationLaunchTitle: 'Same altitude, speed decides everything',
    stationAnalyseTitle: 'Where the three endings split',
    stationDesignTitle: 'Park a satellite in the sky',
    predictionTitle: 'Predict first',
    predictionPrompt: 'The satellite is circling perfectly. You nudge the speed up a little. What happens?',
    predictionFall: 'Falls faster',
    predictionHigher: 'Swings out wider and slower',
    predictionAway: 'Flies off at once',
    predictionSavedRight: 'Hold that guess. One launch will test it.',
    predictionSavedOther: 'Keep it for now. Let the orbit answer.',
    predictionVerdict: (guess, period) => `You guessed "${guess}". Measured: the orbit turns into an ellipse, swings out wider, and one lap takes ${period} — longer than the circle.`,
    missionTitle: 'Produce all three endings',
    missionHintDefault: 'Change only the speed; leave the altitude alone for now.',
    missionHintCircle: 'Match the “orbit” number within 0.5% to count as circular.',
    missionHintFall: 'Too slow, and the low point of the ellipse dips into the air.',
    missionHintLeave: 'Reach the “escape” number and it never comes back.',
    missionHintDone: 'All three done. Head to Analyse and find the dividing lines.',
    missionCircle: 'Make it circle exactly',
    missionFall: 'Make it fall back to Earth',
    missionLeave: 'Make it leave for good',
    controlLabel: 'Controls:',
    controlLaunch: 'Same altitude, same planet, always launched horizontally.',
    bandTitle: 'Speed bands',
    bandIntro: 'Plot every launch by altitude and speed, then see which band it lands in.',
    bandChartTitle: 'Orbit regions by altitude and speed',
    bandNote: 'The two lines are orbital speed and escape speed. Both drop as you go higher.',
    axisSpeed: 'v / km·s⁻¹',
    axisAltitude: 'Altitude / 1000 km',
    legendCrash: 'Falls back',
    legendEllipse: 'Ellipse',
    legendEscape: 'Escapes',
    designTitle: 'Hold still over one spot',
    designPrompt: 'A communications satellite has to stay above the same patch of sky, so one lap must take exactly as long as one spin of the Earth.',
    designTargetLabel: 'Target period',
    designHow: 'Choose the altitude yourself, match the orbital speed, then launch to check.',
    designHintFormula: 'Clue: the period depends only on the orbit radius. Bigger radius, longer lap.',
    designWaiting: 'No matching circular orbit yet. Change the altitude, then match the orbital speed.',
    designNotCircular: 'That was not a circle. A parked satellite needs a circular orbit, or it drifts back and forth.',
    designTooFast: (period) => `One lap took only ${period}, shorter than a day. Go higher.`,
    designTooSlow: (period) => `One lap took ${period}, longer than a day. Come down a bit.`,
    designDone: (altitude) => `Success! A circular orbit near ${altitude} takes exactly one day, so the satellite stays right above the ground station.`,
    stageTitle: 'Launch console',
    readAltitude: 'Altitude',
    readSpeed: 'Speed',
    readClock: 'Mission clock',
    hintOrbit: 'Drag to turn the view',
    nogl: '3D is unavailable on this device. Another browser will show the orbits.',
    altitudeLabel: 'Launch altitude',
    speedLabel: 'Horizontal speed',
    markCircular: 'Orbit',
    markEscape: 'Escape',
    launch: 'Launch',
    vectors: 'Force arrows',
    abort: 'Recall',
    stateReady: 'Ready',
    stateFlying: 'In flight',
    stateOrbiting: 'In orbit',
    stateCrashed: 'Re-entered',
    stateEscaped: 'Left Earth',
    logTitle: 'Flight log',
    reset: 'Restart lab',
    entryTitle: 'Copy this run',
    entryWaiting: 'Launch once and the readings show up here.',
    entryFlying: 'Let it finish a lap to get a period reading.',
    entryReady: 'Readings complete. Write them into the table.',
    logTrial: 'Log this run',
    colTrial: '#',
    colAltitude: 'Altitude',
    colSpeed: 'Speed',
    colKind: 'Orbit',
    colPeriod: 'Period',
    colPerigee: 'Low point',
    kindCircular: 'Circle',
    kindEllipse: 'Ellipse',
    kindCrash: 'Falls back',
    kindEscape: 'Escapes',
    trialEmpty: 'Nothing logged yet',
    belowGround: 'below ground',
    launched: (speed) => `Ignition! Horizontal speed ${speed} km/s.`,
    crashed: 'It grazed the atmosphere and the mission failed — too slow, gravity won.',
    escaped: 'It broke free of gravity and will not return.',
    orbited: (period) => `One full lap: ${period}.`,
    circularHit: 'A true circle! Gravity is spent entirely on turning — no more, no less.',
    needLaunch: 'Launch once first.',
    aborted: 'Satellite recalled. Change something and try again.',
    logged: (index) => `Run ${index} is in the table.`,
    resetDone: 'Lab reset. The table is cleared.',
    missionDone: (name) => `Mission complete: ${name}`,
    allMissions: 'All three endings produced.',
    conclusionStart: 'Launch once and a row appears in the log.',
    conclusionBand: 'Read the table: at one altitude, too slow falls back, too fast flies off, and only the middle band stays.',
    conclusionKepler: 'Compare the periods: the higher the orbit, the longer the lap — for a circle, speed and period follow from the radius alone.',
    conclusionFinal: 'Conclusion: a satellite is not pushed along. Gravity is exactly what bends it into a curve. Mismatch the speed to the altitude and it either falls or flies away.',
    soundOn: 'Mute sound',
    soundOff: 'Turn sound on',
    theme: 'Toggle theme',
    lang: '切换到中文',
    allDone: 'Complete: all three endings produced and the synchronous orbit worked out.',
    hours: (h, m) => `${h} h ${m} min`,
    minutes: (m) => `${m} min`,
  },
};

const SOUND_KEY = 'kidslab.circular-orbit-lab.sound';
const SCENE_UNIT = 1e6; // 1 场景单位 = 1000 km
const EARTH_SCENE_RADIUS = EARTH_RADIUS / SCENE_UNIT;
const SIDEREAL_DAY = 86164;
const LAP_TARGET_SECONDS = 9; // 一圈的观感时长，用来定倍速
const MISSION_KEYS = Object.freeze({ circle: 'missionCircle', fall: 'missionFall', leave: 'missionLeave' });
const KIND_KEYS = Object.freeze({
  circular: 'kindCircular',
  ellipse: 'kindEllipse',
  crash: 'kindCrash',
  escape: 'kindEscape',
});

const $ = (selector) => document.querySelector(selector);

const elements = {
  app: $('#app'),
  langBtn: $('#langBtn'),
  themeBtn: $('#themeBtn'),
  soundBtn: $('#soundBtn'),
  stationCode: $('#stationCode'),
  taskTitle: $('#taskTitle'),
  predictionPrompt: $('#predictionPrompt'),
  predictionGrid: $('#predictionGrid'),
  predictionVerdict: $('#predictionVerdict'),
  predictionFeedback: $('#predictionFeedback'),
  missionCount: $('#missionCount'),
  missionHint: $('#missionHint'),
  missionGrid: $('#missionGrid'),
  bandFills: $('#bandFills'),
  circularCurve: $('#circularCurve'),
  escapeCurve: $('#escapeCurve'),
  bandPoints: $('#bandPoints'),
  designTarget: $('#designTarget'),
  designFeedback: $('#designFeedback'),
  labState: $('#labState'),
  readAltitude: $('#readAltitude'),
  readSpeed: $('#readSpeed'),
  readClock: $('#readClock'),
  canvas: $('#scene'),
  sceneWrap: $('.scene-wrap'),
  sceneHint: $('#sceneHint'),
  nogl: $('#nogl'),
  toast: $('#toast'),
  rateChip: $('#rateChip'),
  altitudeRange: $('#altitudeRange'),
  altitudeValue: $('#altitudeValue'),
  presetRow: $('#presetRow'),
  speedRange: $('#speedRange'),
  speedValue: $('#speedValue'),
  speedDown: $('#speedDown'),
  speedUp: $('#speedUp'),
  markCircular: $('#markCircular'),
  markEscape: $('#markEscape'),
  launchBtn: $('#launchBtn'),
  vectorBtn: $('#vectorBtn'),
  abortBtn: $('#abortBtn'),
  stageFeedback: $('#stageFeedback'),
  entryHint: $('#entryHint'),
  entryReadout: $('#entryReadout'),
  entryAltitude: $('#entryAltitude'),
  entrySpeed: $('#entrySpeed'),
  entryKind: $('#entryKind'),
  entryPeriod: $('#entryPeriod'),
  logBtn: $('#logBtn'),
  trialBody: $('#trialBody'),
  conclusion: $('#conclusion'),
};

/* ================================ 状态 ================================ */

function makeState() {
  return {
    station: 'launch',
    mobilePanel: 'task',
    altitudeKm: 400,
    speedRatio: 1,
    prediction: null,
    predictionNotice: null,
    showVectors: true,
    launched: false,
    orbit: null,
    flight: null,
    measuredPeriod: null,
    outcome: null,
    pending: null,
    trials: [],
    missions: {},
    syncSolved: false,
    designNotice: { key: 'designWaiting', kind: '' },
    stageNotice: null,
    completed: false,
  };
}

let state = makeState();
let lang = window.cool?.preferences?.lang || 'zh';
let t = (key) => key;
let muted = safeGet(SOUND_KEY) === 'off';
let audioContext = null;

function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* 隐私模式下静默降级 */ }
}

const text = (key, ...args) => t(key, ...args);

const launchRadius = () => radiusFromAltitude(state.altitudeKm * 1000);
const launchSpeed = () => circularSpeed(launchRadius()) * state.speedRatio;

function formatDuration(seconds) {
  if (seconds === null || !Number.isFinite(seconds)) return '—';
  const minutes = seconds / 60;
  if (minutes < 120) return text('minutes', minutes.toFixed(1));
  const hours = Math.floor(minutes / 60);
  return text('hours', hours, Math.round(minutes - hours * 60));
}

const kmString = (meters) => `${Math.round(meters / 1000).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')} km`;
const kmsString = (metersPerSecond) => `${(metersPerSecond / 1000).toFixed(2)} km/s`;

/* ================================ 声音 ================================ */

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

const TONES = Object.freeze({
  tune: { notes: [392], duration: 0.12, gain: 0.035, type: 'sine' },
  launch: { notes: [196, 262, 330], duration: 0.5, gain: 0.055, type: 'triangle' },
  lap: { notes: [523, 659], duration: 0.3, gain: 0.05, type: 'sine' },
  crash: { notes: [150, 110], duration: 0.42, gain: 0.05, type: 'sawtooth' },
  escape: { notes: [440, 330, 247], duration: 0.5, gain: 0.045, type: 'triangle' },
  error: { notes: [175, 140], duration: 0.22, gain: 0.04, type: 'sawtooth' },
  success: { notes: [523, 659, 784], duration: 0.4, gain: 0.055, type: 'sine' },
  complete: { notes: [440, 554, 659, 880], duration: 0.62, gain: 0.06, type: 'sine' },
});

function tone(kind) {
  if (muted) return;
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    audioContext ||= new AudioCtor();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    const settings = TONES[kind] || TONES.tune;
    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
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
      oscillator.stop(now + index * 0.1 + settings.duration * 0.6);
    });
  } catch {
    // 音频不可用时静默降级
  }
}

/* 滑杆是连续操作，用冷却避免每一步都堆音源 */
let lastTuneAt = 0;

function tuneTone() {
  const now = performance.now();
  if (now - lastTuneAt < 90) return;
  lastTuneAt = now;
  tone('tune');
}

/* ================================ 提示条 ================================ */

let toastTimer = 0;

function toast(message, kind = '') {
  elements.toast.textContent = message;
  elements.toast.className = `toast${kind ? ` is-${kind}` : ''}`;
  elements.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { elements.toast.hidden = true; }, kind === 'error' ? 3600 : 2900);
}

/* ================================ three.js 场景 ================================ */

let renderer = null;
let scene = null;
let camera = null;
let sunLight = null;
let ambientLight = null;
let earthMesh = null;
let earthSpin = null;
let cloudMesh = null;
let atmosphereMesh = null;
let stationMarker = null;
let satellite = null;
let orbitPath = null;
let referenceRing = null;
let velocityArrow = null;
let gravityArrow = null;
const trailGroup = new THREE.Group();
const burstGroup = new THREE.Group();
const disposables = [];
const bursts = [];

const orbitCam = { yaw: 0.6, pitch: 0.62, dist: 26, targetYaw: 0.6, targetPitch: 0.62, targetDist: 26 };
const UP = new THREE.Vector3(0, 1, 0);
let arrowScale = 1.7;

/**
 * 自绘矢量箭头：ArrowHelper 用的是 1px 线，在低轨这种贴着地表的场景里看不见。
 * 关掉深度测试并抬高 renderOrder，让箭头像示意图那样始终画在最上层。
 */
function makeArrow(color) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.7,
    roughness: 0.4,
    depthTest: false,
    transparent: true,
    opacity: 0.96,
  });
  const shaftGeometry = new THREE.CylinderGeometry(1, 1, 1, 12);
  const headGeometry = new THREE.ConeGeometry(1, 1, 16);
  const shaft = new THREE.Mesh(shaftGeometry, material);
  const head = new THREE.Mesh(headGeometry, material);
  group.add(shaft, head);
  group.renderOrder = 12;
  disposables.push(shaftGeometry, headGeometry, material);
  return { group, shaft, head };
}

function aimArrow(arrow, origin, direction, length, thickness) {
  const headLength = Math.min(length * 0.36, thickness * 3.4);
  const shaftLength = Math.max(0.001, length - headLength);
  arrow.group.position.copy(origin);
  arrow.group.quaternion.setFromUnitVectors(UP, direction);
  arrow.shaft.scale.set(thickness, shaftLength, thickness);
  arrow.shaft.position.set(0, shaftLength / 2, 0);
  arrow.head.scale.set(thickness * 2.5, headLength, thickness * 2.5);
  arrow.head.position.set(0, shaftLength + headLength / 2, 0);
}
const pointers = new Map();
let dragging = false;
let dragMoved = 0;
let pinchStart = 0;

function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  disposables.push(texture);
  return texture;
}

/* 程序化生成的写意地球贴图：只求可信好看，不追求地理准确 */
const LAND_PATCHES = Object.freeze([
  [0.14, 0.30, 0.10], [0.17, 0.42, 0.07], [0.20, 0.58, 0.09], [0.23, 0.70, 0.06],
  [0.44, 0.26, 0.07], [0.50, 0.40, 0.11], [0.53, 0.58, 0.10], [0.49, 0.72, 0.05],
  [0.68, 0.34, 0.12], [0.74, 0.50, 0.09], [0.80, 0.30, 0.07], [0.86, 0.66, 0.06],
  [0.33, 0.20, 0.05], [0.62, 0.20, 0.06], [0.92, 0.44, 0.05], [0.05, 0.52, 0.05],
]);

function buildEarthTexture() {
  return canvasTexture(1024, 512, (ctx, w, h) => {
    const ocean = ctx.createLinearGradient(0, 0, 0, h);
    ocean.addColorStop(0, '#123b63');
    ocean.addColorStop(0.32, '#14588c');
    ocean.addColorStop(0.5, '#1a72ad');
    ocean.addColorStop(0.68, '#14588c');
    ocean.addColorStop(1, '#123b63');
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, w, h);

    for (const [u, v, size] of LAND_PATCHES) {
      const cx = u * w;
      const cy = v * h;
      const radius = size * w;
      const land = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
      land.addColorStop(0, '#4f8a3f');
      land.addColorStop(0.62, '#3d7135');
      land.addColorStop(1, 'rgba(61, 113, 53, 0)');
      ctx.fillStyle = land;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.72, u * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(150, 138, 92, 0.42)';
      ctx.beginPath();
      ctx.ellipse(cx + radius * 0.3, cy + radius * 0.1, radius * 0.42, radius * 0.28, u * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const [y0, y1] of [[0, h * 0.09], [h * 0.91, h]]) {
      const cap = ctx.createLinearGradient(0, y0, 0, y1);
      const top = y0 === 0;
      cap.addColorStop(top ? 0 : 1, 'rgba(245, 250, 255, 0.95)');
      cap.addColorStop(top ? 1 : 0, 'rgba(245, 250, 255, 0)');
      ctx.fillStyle = cap;
      ctx.fillRect(0, y0, w, y1 - y0);
    }

    /* 赤道亮带：轨道就在这个平面上，给学生一个参照 */
    ctx.fillStyle = 'rgba(255, 232, 180, 0.22)';
    ctx.fillRect(0, h / 2 - 2, w, 4);
  });
}

function buildCloudTexture() {
  return canvasTexture(1024, 512, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    let seed = 20260825;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let i = 0; i < 130; i += 1) {
      const cx = random() * w;
      const cy = h * 0.12 + random() * h * 0.76;
      const radius = 14 + random() * 46;
      const puff = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      puff.addColorStop(0, 'rgba(255, 255, 255, 0.62)');
      puff.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = puff;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.55, random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function buildStars() {
  const count = 900;
  const positions = new Float32Array(count * 3);
  let seed = 77771;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < count; i += 1) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const radius = 260 + random() * 80;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 1.4, sizeAttenuation: false, transparent: true, opacity: 0.7 });
  disposables.push(geometry, material);
  return new THREE.Points(geometry, material);
}

function buildSatellite() {
  const group = new THREE.Group();
  const bodyGeometry = new THREE.BoxGeometry(0.62, 0.5, 0.5);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xe6e9ef, roughness: 0.34, metalness: 0.62 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  group.add(body);
  const panelGeometry = new THREE.BoxGeometry(1.15, 0.05, 0.42);
  const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x2b4c9b, roughness: 0.2, metalness: 0.55, emissive: 0x101f45 });
  for (const side of [-1, 1]) {
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.x = side * 0.92;
    group.add(panel);
  }
  const dishGeometry = new THREE.ConeGeometry(0.24, 0.3, 18, 1, true);
  const dishMaterial = new THREE.MeshStandardMaterial({ color: 0xf3c35c, roughness: 0.3, metalness: 0.5, side: THREE.DoubleSide });
  const dish = new THREE.Mesh(dishGeometry, dishMaterial);
  dish.rotation.x = Math.PI;
  dish.position.y = 0.34;
  group.add(dish);
  disposables.push(bodyGeometry, bodyMaterial, panelGeometry, panelMaterial, dishGeometry, dishMaterial);
  return group;
}

function initScene() {
  try {
    renderer = new THREE.WebGLRenderer({ canvas: elements.canvas, antialias: true, alpha: true });
  } catch {
    elements.nogl.hidden = false;
    elements.canvas.remove();
    return false;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 1, 0.5, 500);

  ambientLight = new THREE.HemisphereLight(0xdfeaff, 0x101828, 0.85);
  scene.add(ambientLight);
  sunLight = new THREE.DirectionalLight(0xfff4e0, 2.5);
  sunLight.position.set(30, 14, 22);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  scene.add(sunLight);

  scene.add(buildStars());

  earthSpin = new THREE.Group();
  const earthGeometry = new THREE.SphereGeometry(EARTH_SCENE_RADIUS, 72, 48);
  const earthMaterial = new THREE.MeshStandardMaterial({ map: buildEarthTexture(), roughness: 0.82, metalness: 0.05 });
  earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  earthMesh.receiveShadow = true;
  earthSpin.add(earthMesh);
  disposables.push(earthGeometry, earthMaterial);

  const cloudGeometry = new THREE.SphereGeometry(EARTH_SCENE_RADIUS * 1.012, 64, 40);
  const cloudMaterial = new THREE.MeshStandardMaterial({
    map: buildCloudTexture(), transparent: true, opacity: 0.55, roughness: 1, depthWrite: false,
  });
  cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  earthSpin.add(cloudMesh);
  disposables.push(cloudGeometry, cloudMaterial);

  /* 地面站：同步轨道成功时，卫星会一直停在它上方 */
  const markerGeometry = new THREE.ConeGeometry(0.16, 0.62, 14);
  const markerMaterial = new THREE.MeshStandardMaterial({ color: 0xf08a3c, emissive: 0x8a3d09, roughness: 0.4 });
  stationMarker = new THREE.Mesh(markerGeometry, markerMaterial);
  stationMarker.position.set(EARTH_SCENE_RADIUS + 0.24, 0, 0);
  stationMarker.rotation.z = -Math.PI / 2;
  earthSpin.add(stationMarker);
  disposables.push(markerGeometry, markerMaterial);
  scene.add(earthSpin);

  const atmosphereGeometry = new THREE.SphereGeometry(EARTH_SCENE_RADIUS * 1.028, 48, 32);
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x7fc4ff, transparent: true, opacity: 0.2, side: THREE.BackSide, depthWrite: false,
  });
  atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  scene.add(atmosphereMesh);
  disposables.push(atmosphereGeometry, atmosphereMaterial);

  satellite = buildSatellite();
  satellite.visible = false;
  scene.add(satellite);

  velocityArrow = makeArrow(0x35d3f5);
  gravityArrow = makeArrow(0xff5b57);
  velocityArrow.group.visible = false;
  gravityArrow.group.visible = false;
  scene.add(velocityArrow.group, gravityArrow.group);

  scene.add(trailGroup, burstGroup);

  applySceneTheme();
  resizeRenderer();
  new ResizeObserver(resizeRenderer).observe(elements.sceneWrap);
  requestAnimationFrame(animate);
  return true;
}

function applySceneTheme() {
  if (!renderer) return;
  const dark = (window.cool?.preferences?.theme || 'light') === 'dark';
  ambientLight.intensity = dark ? 0.42 : 0.95;
  sunLight.intensity = dark ? 2.7 : 2.4;
  atmosphereMesh.material.opacity = dark ? 0.26 : 0.2;
  cloudMesh.material.opacity = dark ? 0.4 : 0.58;
}

function resizeRenderer() {
  if (!renderer) return;
  const width = Math.max(1, elements.sceneWrap.clientWidth);
  const height = Math.max(1, elements.sceneWrap.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function disposeGroup(group) {
  for (const child of [...group.children]) {
    group.remove(child);
    child.geometry?.dispose();
    if (child.material && child.material !== undefined && !Array.isArray(child.material)) child.material.dispose?.();
  }
}

const scenePoint = (orbit, angle) => {
  const radius = radiusAtAngle(orbit, angle) / SCENE_UNIT;
  return new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle));
};

/** 把当前参数的轨道画出来。发射前是预览，拖滑杆时实时变形 */
function rebuildOrbitPath() {
  if (!renderer) return;
  if (orbitPath) {
    scene.remove(orbitPath);
    orbitPath.geometry.dispose();
    orbitPath.material.dispose();
    orbitPath = null;
  }
  if (referenceRing) {
    scene.remove(referenceRing);
    referenceRing.geometry.dispose();
    referenceRing.material.dispose();
    referenceRing = null;
  }
  const orbit = describeOrbit(launchRadius(), launchSpeed());
  if (!orbit) return;

  /* 视距要同时装下地球和整条轨道：垂直半视角 tan(19°)≈0.344 */
  const reach = orbit.apsides ? orbit.apsides.apogee : launchRadius() * 3;
  const viewRadius = Math.max(reach / SCENE_UNIT, EARTH_SCENE_RADIUS * 1.08);
  orbitCam.targetDist = Math.min(240, Math.max(22, (viewRadius / 0.344) * 1.3));
  arrowScale = Math.max(1.4, viewRadius * 0.3);
  /* 轨道线按视距放粗：真实低轨紧贴地表，线太细就看不见了 */
  const tubeRadius = Math.min(0.36, Math.max(0.075, orbitCam.targetDist * 0.0075));

  const span = orbit.eccentricity > 1 ? orbit.maxAngle * 0.97 : Math.PI;
  const points = [];
  const steps = 260;
  for (let i = 0; i <= steps; i += 1) {
    const angle = orbit.startAngle - span + ((2 * span) * i) / steps;
    const point = scenePoint(orbit, angle);
    if (!Number.isFinite(point.x) || point.length() > 220) continue;
    points.push(point);
  }
  if (points.length > 3) {
    const closed = orbit.eccentricity <= 1;
    const curve = new THREE.CatmullRomCurve3(points, closed);
    const geometry = new THREE.TubeGeometry(curve, 240, tubeRadius, 8, closed);
    const color = { circular: 0x3fb6d8, ellipse: 0xf0b13c, crash: 0xd9634f, escape: 0x9d7bea }[orbit.kind] || 0xf0b13c;
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.75,
      roughness: 0.4,
      transparent: true,
      opacity: state.launched ? 1 : 0.72,
    });
    orbitPath = new THREE.Mesh(geometry, material);
    scene.add(orbitPath);
  }

  /* 同高度的圆轨参照环：只在非圆轨时画，一眼看出椭圆偏了多少 */
  if (orbit.kind !== 'circular') {
    const ringGeometry = new THREE.TorusGeometry(launchRadius() / SCENE_UNIT, tubeRadius * 0.4, 6, 140);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.34 });
    referenceRing = new THREE.Mesh(ringGeometry, ringMaterial);
    referenceRing.rotation.x = Math.PI / 2;
    scene.add(referenceRing);
  }
}

function spawnBurst(position, color, count) {
  for (let i = 0; i < count; i += 1) {
    const geometry = new THREE.SphereGeometry(0.16, 8, 6);
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    const direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    burstGroup.add(mesh);
    bursts.push({ mesh, material, geometry, life: 0, span: 0.9, velocity: direction.multiplyScalar(2.4 + Math.random() * 2) });
  }
}

function stepBursts(delta) {
  for (let i = bursts.length - 1; i >= 0; i -= 1) {
    const burst = bursts[i];
    burst.life += delta;
    const ratio = burst.life / burst.span;
    burst.mesh.position.addScaledVector(burst.velocity, delta);
    burst.material.opacity = Math.max(0, 0.9 * (1 - ratio));
    if (ratio >= 1) {
      burstGroup.remove(burst.mesh);
      burst.geometry.dispose();
      burst.material.dispose();
      bursts.splice(i, 1);
    }
  }
}

const TWO_PI = Math.PI * 2;
/* 指数补间永远逼近而不到达；足够接近时直接落定，画面不再有亚像素抖动 */
const SETTLE = 0.0008;

function approach(current, target, factor) {
  const next = current + (target - current) * Math.min(1, factor);
  return Math.abs(target - next) < SETTLE ? target : next;
}

let lastFrame = 0;
let simulationDebt = 0;

function advanceFlight(realDelta) {
  if (!state.launched || !state.flight || !state.orbit) return;
  if (state.flight.status === 'crashed' || state.flight.status === 'escaped') return;
  const reference = state.referencePeriod;
  const missionPerSecond = reference / LAP_TARGET_SECONDS;
  const step = simulationStep(launchRadius());
  simulationDebt += realDelta * missionPerSecond;
  let guard = 0;
  while (simulationDebt >= step && guard < 400) {
    let next = stepFlight(state.orbit, state.flight, step);
    simulationDebt -= step;
    guard += 1;
    if (next.status === 'lap') {
      if (state.measuredPeriod === null) {
        state.measuredPeriod = next.lapSeconds;
        state.outcome = state.orbit.kind;
        onLapMeasured();
      }
      next = { ...next, status: 'flying', travelled: next.travelled - TWO_PI };
    }
    state.flight = next;
    if (next.status === 'crashed') { onCrashed(); break; }
    if (next.status === 'escaped') { onEscaped(); break; }
  }
}

function animate(now) {
  requestAnimationFrame(animate);
  if (!renderer) return;
  const delta = Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0.016);
  lastFrame = now;

  advanceFlight(delta);

  if (state.launched && state.flight && state.orbit) {
    const point = scenePoint(state.orbit, state.flight.angle);
    if (Number.isFinite(point.x) && point.length() < 220) {
      satellite.visible = state.flight.status !== 'crashed';
      satellite.position.copy(point);
      satellite.scale.setScalar(Math.min(3.4, Math.max(0.55, orbitCam.dist * 0.055)));
      const ahead = scenePoint(state.orbit, state.flight.angle + 0.02);
      const behind = scenePoint(state.orbit, state.flight.angle - 0.02);
      const heading = ahead.clone().sub(behind).normalize();
      satellite.lookAt(point.clone().add(heading));
      if (state.showVectors) {
        const referenceGravity = gravityAtRadius(launchRadius());
        const currentGravity = gravityAtRadius(state.flight.radius);
        const currentSpeed = state.orbit.angularMomentum / state.flight.radius;
        const thickness = arrowScale * 0.09;
        velocityArrow.group.visible = true;
        gravityArrow.group.visible = true;
        aimArrow(
          velocityArrow,
          point,
          heading,
          Math.min(arrowScale * 2.6, Math.max(arrowScale * 0.35, arrowScale * (currentSpeed / state.orbit.circularSpeed))),
          thickness,
        );
        aimArrow(
          gravityArrow,
          point,
          point.clone().multiplyScalar(-1).normalize(),
          Math.min(arrowScale * 2.6, Math.max(arrowScale * 0.28, arrowScale * (currentGravity / referenceGravity))),
          thickness,
        );
      } else {
        velocityArrow.group.visible = false;
        gravityArrow.group.visible = false;
      }
    }
    earthSpin.rotation.y = (state.flight.elapsed / SIDEREAL_DAY) * TWO_PI;
  } else {
    satellite.visible = false;
    velocityArrow.group.visible = false;
    gravityArrow.group.visible = false;
    earthSpin.rotation.y += delta * 0.03;
  }

  stepBursts(delta);

  orbitCam.yaw = approach(orbitCam.yaw, orbitCam.targetYaw, delta * 8);
  orbitCam.pitch = approach(orbitCam.pitch, orbitCam.targetPitch, delta * 8);
  orbitCam.dist = approach(orbitCam.dist, orbitCam.targetDist, delta * 4);
  camera.position.set(
    Math.cos(orbitCam.pitch) * Math.sin(orbitCam.yaw) * orbitCam.dist,
    Math.sin(orbitCam.pitch) * orbitCam.dist,
    Math.cos(orbitCam.pitch) * Math.cos(orbitCam.yaw) * orbitCam.dist,
  );
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);

  if (state.launched) renderClock();
}

function bindPointer() {
  if (!renderer) return;
  const surface = elements.sceneWrap;
  surface.addEventListener('pointerdown', (event) => {
    surface.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) { dragging = true; dragMoved = 0; }
    else if (pointers.size === 2) {
      const [first, second] = [...pointers.values()];
      pinchStart = Math.hypot(first.x - second.x, first.y - second.y);
    }
  });
  surface.addEventListener('pointermove', (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size >= 2) {
      const [first, second] = [...pointers.values()];
      const spread = Math.hypot(first.x - second.x, first.y - second.y);
      if (pinchStart > 0) {
        orbitCam.targetDist = Math.min(320, Math.max(11, orbitCam.targetDist * (pinchStart / Math.max(1, spread))));
        pinchStart = spread;
      }
      return;
    }
    dragMoved += Math.abs(dx) + Math.abs(dy);
    if (!dragging || dragMoved < 5) return;
    orbitCam.targetYaw -= dx * 0.008;
    orbitCam.targetPitch = Math.max(-1.35, Math.min(1.35, orbitCam.targetPitch + dy * 0.006));
  });
  const release = (event) => {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = 0;
    if (!pointers.size) dragging = false;
  };
  surface.addEventListener('pointerup', release);
  surface.addEventListener('pointercancel', release);
  surface.addEventListener('wheel', (event) => {
    event.preventDefault();
    orbitCam.targetDist = Math.min(320, Math.max(11, orbitCam.targetDist * (event.deltaY > 0 ? 1.12 : 0.89)));
  }, { passive: false });
}

/* ================================ 实验流程 ================================ */

function resetFlight() {
  state.launched = false;
  state.orbit = null;
  state.flight = null;
  state.measuredPeriod = null;
  state.outcome = null;
  state.pending = null;
  simulationDebt = 0;
  disposeGroup(trailGroup);
}

function launch() {
  const radius = launchRadius();
  const speed = launchSpeed();
  const orbit = describeOrbit(radius, speed);
  if (!orbit) {
    tone('error');
    return;
  }
  resetFlight();
  state.orbit = orbit;
  state.flight = createFlight(orbit);
  state.referencePeriod = Math.max(600, orbit.period ?? simulationStep(radius) * 1440);
  state.launched = true;
  state.stageNotice = null;
  tone('launch');
  toast(text('launched', (speed / 1000).toFixed(2)));
  window.cool?.stage('launch');
  window.cool?.track?.('launched_satellite', {
    altitudeKm: state.altitudeKm,
    speedRatio: Number(state.speedRatio.toFixed(3)),
    kind: orbit.kind,
  });
  rebuildOrbitPath();
  render();
}

function onLapMeasured() {
  tone(state.orbit.kind === 'circular' ? 'success' : 'lap');
  toast(state.orbit.kind === 'circular'
    ? text('circularHit')
    : text('orbited', formatDuration(state.measuredPeriod)), 'success');
  setPending();
  checkDesign();
  render();
}

function onCrashed() {
  state.outcome = 'crash';
  state.measuredPeriod = null;
  tone('crash');
  toast(text('crashed'), 'error');
  if (renderer) spawnBurst(satellite.position.clone(), 0xd9634f, 16);
  setPending();
  render();
}

function onEscaped() {
  state.outcome = 'escape';
  state.measuredPeriod = null;
  tone('escape');
  toast(text('escaped'));
  setPending();
  render();
}

function setPending() {
  const radius = launchRadius();
  const speed = launchSpeed();
  state.pending = {
    altitudeKm: state.altitudeKm,
    speed,
    kind: state.outcome || classifyLaunch(radius, speed),
    period: state.measuredPeriod,
    perigee: state.orbit?.apsides?.perigee ?? null,
  };
}

function logTrial() {
  if (!state.pending) {
    tone('error');
    state.stageNotice = { key: 'needLaunch', kind: 'error' };
    render();
    return;
  }
  const trial = { index: state.trials.length + 1, ...state.pending };
  state.trials.push(trial);
  state.pending = null;
  const mission = MISSIONS.find((item) => item.outcome === trial.kind);
  if (mission && !state.missions[mission.id]) {
    state.missions[mission.id] = true;
    tone('success');
    toast(text('missionDone', text(MISSION_KEYS[mission.id])), 'success');
    window.cool?.stage(`mission_${mission.id}`);
  } else {
    tone('lap');
    toast(text('logged', trial.index));
  }
  window.cool?.track?.('logged_orbit_trial', { kind: trial.kind, altitudeKm: trial.altitudeKm });
  checkCompletion();
  render();
}

function checkDesign() {
  if (!state.measuredPeriod || !state.orbit) return;
  if (state.orbit.kind !== 'circular') {
    state.designNotice = { key: 'designNotCircular', kind: 'error' };
    return;
  }
  if (isSyncOrbit(state.measuredPeriod, state.orbit.kind)) {
    if (!state.syncSolved) {
      state.syncSolved = true;
      window.cool?.stage('sync_orbit');
      window.cool?.track?.('solved_sync_orbit', { altitudeKm: state.altitudeKm });
      tone('complete');
    }
    state.designNotice = {
      key: 'designDone',
      kind: 'success',
      args: [kmString(state.altitudeKm * 1000)],
    };
    return;
  }
  state.designNotice = {
    key: state.measuredPeriod < SYNC_PERIOD_SECONDS ? 'designTooFast' : 'designTooSlow',
    kind: '',
    args: [formatDuration(state.measuredPeriod)],
  };
}

function checkCompletion() {
  if (state.completed) return;
  const missionsDone = MISSIONS.every((mission) => state.missions[mission.id]);
  if (missionsDone && state.prediction && state.syncSolved) {
    state.completed = true;
    window.cool?.complete?.();
    window.cool?.track?.('completed_orbit_lab');
    tone('complete');
    toast(text('allDone'), 'success');
  }
}

function resetLab() {
  const station = state.station;
  const mobilePanel = state.mobilePanel;
  resetFlight();
  state = makeState();
  state.station = station;
  state.mobilePanel = mobilePanel;
  elements.altitudeRange.value = String(state.altitudeKm);
  elements.speedRange.value = '1000';
  rebuildOrbitPath();
  tone('tune');
  toast(text('resetDone'));
  render();
}

function setAltitude(km) {
  state.altitudeKm = Math.min(40000, Math.max(200, Math.round(km)));
  elements.altitudeRange.value = String(state.altitudeKm);
  resetFlight();
  rebuildOrbitPath();
  render();
}

function setSpeedRatio(ratio) {
  state.speedRatio = Math.min(1.6, Math.max(0.6, Math.round(ratio * 500) / 500));
  elements.speedRange.value = String(Math.round(state.speedRatio * 1000));
  resetFlight();
  rebuildOrbitPath();
  render();
}

/* ================================ 界面渲染 ================================ */

function renderNotice(element, notice) {
  if (!notice) {
    element.textContent = '';
    element.className = element.className.replace(/\s*\bis-(?:success|error)\b/g, '');
    return;
  }
  element.textContent = text(notice.key, ...(notice.args || []));
  element.className = element.className.replace(/\s*\bis-(?:success|error)\b/g, '');
  if (notice.kind) element.classList.add(`is-${notice.kind}`);
}

function renderStations() {
  const codes = { launch: 'STATION 01', analyse: 'STATION 02', design: 'STATION 03 · L4' };
  const titles = { launch: 'stationLaunchTitle', analyse: 'stationAnalyseTitle', design: 'stationDesignTitle' };
  elements.stationCode.textContent = codes[state.station];
  elements.taskTitle.textContent = text(titles[state.station]);
  document.querySelectorAll('[data-station]').forEach((button) => {
    const active = button.dataset.station === state.station;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $('#stationLaunch').hidden = state.station !== 'launch';
  $('#stationAnalyse').hidden = state.station !== 'analyse';
  $('#stationDesign').hidden = state.station !== 'design';
}

function renderLaunchStation() {
  document.querySelectorAll('[data-prediction]').forEach((button) => {
    const active = button.dataset.prediction === state.prediction;
    button.classList.toggle('is-selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const ellipseTrial = state.trials.find((trial) => trial.kind === 'ellipse' && trial.period);
  const verified = Boolean(state.prediction && ellipseTrial);
  elements.predictionGrid.hidden = verified;
  elements.predictionPrompt.hidden = verified;
  elements.predictionVerdict.hidden = !verified;
  if (verified) {
    elements.predictionVerdict.textContent = text(
      'predictionVerdict',
      text(`prediction${state.prediction[0].toUpperCase()}${state.prediction.slice(1)}`),
      formatDuration(ellipseTrial.period),
    );
  }
  renderNotice(elements.predictionFeedback, verified ? null : state.predictionNotice);

  const done = MISSIONS.filter((mission) => state.missions[mission.id]).length;
  elements.missionCount.textContent = `${done} / ${MISSIONS.length}`;
  const next = MISSIONS.find((mission) => !state.missions[mission.id]);
  const hints = { circle: 'missionHintCircle', fall: 'missionHintFall', leave: 'missionHintLeave' };
  elements.missionHint.textContent = text(next ? hints[next.id] : 'missionHintDone');

  const fragment = document.createDocumentFragment();
  MISSIONS.forEach((mission) => {
    const chip = document.createElement('div');
    const isDone = Boolean(state.missions[mission.id]);
    chip.className = `mission-chip${isDone ? ' is-done' : ''}${!isDone && mission === next ? ' is-active' : ''}`;
    chip.setAttribute('role', 'listitem');
    const mark = document.createElement('span');
    mark.className = 'mission-chip__mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = isDone ? '✓' : '○';
    const label = document.createElement('span');
    label.textContent = text(MISSION_KEYS[mission.id]);
    chip.append(mark, label);
    fragment.append(chip);
  });
  elements.missionGrid.replaceChildren(fragment);
}

const BAND_X0 = 40;
const BAND_X1 = 288;
const BAND_Y0 = 168;
const BAND_Y1 = 12;
const BAND_MAX_ALTITUDE = 40000;
const BAND_MAX_SPEED = 12;

const bandX = (altitudeKm) => BAND_X0 + (altitudeKm / BAND_MAX_ALTITUDE) * (BAND_X1 - BAND_X0);
const bandY = (speedKms) => BAND_Y0 + (speedKms / BAND_MAX_SPEED) * (BAND_Y1 - BAND_Y0);

function bandCurve(speedOf) {
  const points = [];
  for (let i = 0; i <= 60; i += 1) {
    const altitudeKm = (BAND_MAX_ALTITUDE * i) / 60;
    const speed = speedOf(radiusFromAltitude(altitudeKm * 1000));
    if (speed === null) continue;
    points.push([bandX(altitudeKm), bandY(speed / 1000)]);
  }
  return points;
}

function pathFrom(points) {
  return points.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}

function renderBandChart() {
  const crash = bandCurve(crashSpeed);
  const circular = bandCurve(circularSpeed);
  const escape = bandCurve(escapeSpeed);
  elements.circularCurve.setAttribute('d', pathFrom(circular));
  elements.escapeCurve.setAttribute('d', pathFrom(escape));

  const svgNs = 'http://www.w3.org/2000/svg';
  const fills = document.createDocumentFragment();
  const region = (points, baseline, className) => {
    const shape = document.createElementNS(svgNs, 'path');
    const forward = pathFrom(points);
    const back = baseline.slice().reverse().map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    shape.setAttribute('class', `band-fill ${className}`);
    shape.setAttribute('d', `${forward} ${back} Z`);
    fills.append(shape);
  };
  const bottom = crash.map(([x]) => [x, BAND_Y0]);
  const top = escape.map(([x]) => [x, BAND_Y1]);
  region(crash, bottom, 'band-fill--crash');
  region(escape, crash, 'band-fill--ellipse');
  region(top, escape, 'band-fill--escape');
  elements.bandFills.replaceChildren(fills);

  const points = document.createDocumentFragment();
  state.trials.forEach((trial) => {
    const dot = document.createElementNS(svgNs, 'circle');
    dot.setAttribute('class', `band-point band-point--${trial.kind}`);
    dot.setAttribute('cx', bandX(trial.altitudeKm).toFixed(1));
    dot.setAttribute('cy', bandY(trial.speed / 1000).toFixed(1));
    dot.setAttribute('r', '4.4');
    points.append(dot);
  });
  elements.bandPoints.replaceChildren(points);
}

function renderDesignStation() {
  const hours = Math.floor(SYNC_PERIOD_SECONDS / 3600);
  const minutes = Math.round((SYNC_PERIOD_SECONDS - hours * 3600) / 60);
  elements.designTarget.textContent = text('hours', hours, minutes);
  renderNotice(elements.designFeedback, state.designNotice);
}

function renderClock() {
  elements.readClock.textContent = state.flight
    ? formatDuration(state.flight.elapsed)
    : formatDuration(0);
}

function renderConsole() {
  const radius = launchRadius();
  const circular = circularSpeed(radius);
  const escape = escapeSpeed(radius);
  const speed = launchSpeed();
  elements.altitudeValue.textContent = kmString(state.altitudeKm * 1000);
  elements.speedValue.textContent = kmsString(speed);
  elements.readAltitude.textContent = kmString(state.altitudeKm * 1000);
  elements.readSpeed.textContent = kmsString(speed);
  elements.markCircular.textContent = (circular / 1000).toFixed(2);
  elements.markEscape.textContent = (escape / 1000).toFixed(2);
  elements.vectorBtn.setAttribute('aria-pressed', String(state.showVectors));
  elements.abortBtn.disabled = !state.launched;
  elements.sceneHint.textContent = text('hintOrbit');

  const rate = state.launched ? Math.round(state.referencePeriod / LAP_TARGET_SECONDS) : 1;
  elements.rateChip.textContent = `×${rate.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}`;

  const presets = document.createDocumentFragment();
  LAUNCH_ALTITUDES.forEach((preset) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `preset-btn${state.altitudeKm === preset.altitudeKm ? ' is-selected' : ''}`;
    button.dataset.altitude = String(preset.altitudeKm);
    button.textContent = `${preset.altitudeKm.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')} km`;
    presets.append(button);
  });
  elements.presetRow.replaceChildren(presets);

  let stateKey = 'stateReady';
  let alert = false;
  if (state.flight?.status === 'crashed') { stateKey = 'stateCrashed'; alert = true; }
  else if (state.flight?.status === 'escaped') stateKey = 'stateEscaped';
  else if (state.measuredPeriod !== null) stateKey = 'stateOrbiting';
  else if (state.launched) stateKey = 'stateFlying';
  elements.labState.textContent = text(stateKey);
  elements.labState.classList.toggle('is-active', stateKey === 'stateOrbiting');
  elements.labState.classList.toggle('is-alert', alert);
  renderNotice(elements.stageFeedback, state.stageNotice);
  renderClock();
}

function renderEntry() {
  const pending = state.pending;
  elements.entryReadout.hidden = !pending;
  elements.logBtn.disabled = !pending;
  if (!pending) {
    elements.entryHint.textContent = text(state.launched ? 'entryFlying' : 'entryWaiting');
    /* 上一次的读数必须清掉：过期数据不能被当成这一次的测量结果 */
    elements.entryAltitude.textContent = '—';
    elements.entrySpeed.textContent = '—';
    elements.entryKind.textContent = '—';
    elements.entryPeriod.textContent = '—';
    return;
  }
  elements.entryHint.textContent = text('entryReady');
  elements.entryAltitude.textContent = kmString(pending.altitudeKm * 1000);
  elements.entrySpeed.textContent = kmsString(pending.speed);
  elements.entryKind.textContent = text(KIND_KEYS[pending.kind] || 'kindEllipse');
  elements.entryPeriod.textContent = formatDuration(pending.period);
}

function perigeeLabel(trial) {
  if (trial.perigee === null) return '—';
  const altitude = trial.perigee - EARTH_RADIUS;
  return altitude <= 0 ? text('belowGround') : kmString(altitude);
}

function renderTrials() {
  const fragment = document.createDocumentFragment();
  if (!state.trials.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.className = 'table-empty';
    cell.textContent = text('trialEmpty');
    row.append(cell);
    fragment.append(row);
  }
  state.trials.forEach((trial) => {
    const row = document.createElement('tr');
    const cells = [
      String(trial.index),
      `${trial.altitudeKm.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')} km`,
      (trial.speed / 1000).toFixed(2),
      text(KIND_KEYS[trial.kind] || 'kindEllipse'),
      formatDuration(trial.period),
      perigeeLabel(trial),
    ];
    cells.forEach((value, index) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (index === 3) cell.className = `is-${trial.kind}`;
      if ((index === 4 || index === 5) && value === '—') cell.className = 'table-empty';
      row.append(cell);
    });
    fragment.append(row);
  });
  elements.trialBody.replaceChildren(fragment);
}

function renderConclusion() {
  let key = 'conclusionStart';
  if (state.completed) key = 'conclusionFinal';
  else if (new Set(state.trials.map((trial) => trial.altitudeKm)).size > 1) key = 'conclusionKepler';
  else if (state.trials.length >= 2) key = 'conclusionBand';
  elements.conclusion.textContent = text(key);
  elements.conclusion.classList.toggle('is-success', state.completed);
}

function renderMobileNavigation() {
  elements.app.dataset.mobilePanel = state.mobilePanel;
  document.querySelectorAll('.mobile-nav__button').forEach((button) => {
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
  elements.themeBtn.textContent = (window.cool?.preferences?.theme || 'light') === 'light' ? '🌙' : '☀️';
  renderStations();
  renderLaunchStation();
  renderBandChart();
  renderDesignStation();
  renderConsole();
  renderEntry();
  renderTrials();
  renderConclusion();
  renderMobileNavigation();
}

/* ================================ 事件绑定 ================================ */

const isCompact = () => window.matchMedia('(max-width: 900px)').matches;

document.querySelectorAll('[data-station]').forEach((button) => {
  button.addEventListener('click', () => {
    state.station = button.dataset.station;
    render();
  });
});

document.querySelectorAll('[data-prediction]').forEach((button) => {
  button.addEventListener('click', () => {
    state.prediction = button.dataset.prediction;
    state.predictionNotice = {
      key: state.prediction === 'higher' ? 'predictionSavedRight' : 'predictionSavedOther',
      kind: state.prediction === 'higher' ? 'success' : '',
    };
    window.cool?.stage('prediction');
    window.cool?.track?.('predicted_orbit_change', { prediction: state.prediction });
    tone('tune');
    render();
  });
});

elements.altitudeRange.addEventListener('input', () => {
  setAltitude(Number(elements.altitudeRange.value));
  tuneTone();
});

elements.speedRange.addEventListener('input', () => {
  setSpeedRatio(Number(elements.speedRange.value) / 1000);
  tuneTone();
});

elements.presetRow.addEventListener('click', (event) => {
  const button = event.target.closest('[data-altitude]');
  if (!button) return;
  setAltitude(Number(button.dataset.altitude));
  tone('tune');
});

elements.speedDown.addEventListener('click', () => { setSpeedRatio(state.speedRatio - 0.002); tone('tune'); });
elements.speedUp.addEventListener('click', () => { setSpeedRatio(state.speedRatio + 0.002); tone('tune'); });

elements.launchBtn.addEventListener('click', launch);
elements.abortBtn.addEventListener('click', () => {
  resetFlight();
  rebuildOrbitPath();
  tone('tune');
  toast(text('aborted'));
  render();
});
elements.vectorBtn.addEventListener('click', () => {
  state.showVectors = !state.showVectors;
  tone('tune');
  render();
});
elements.logBtn.addEventListener('click', logTrial);
$('#resetBtn').addEventListener('click', resetLab);

document.querySelectorAll('.mobile-nav__button').forEach((button) => {
  button.addEventListener('click', () => {
    state.mobilePanel = button.dataset.mobilePanel;
    renderMobileNavigation();
    if (state.mobilePanel === 'stage') resizeRenderer();
  });
});

elements.soundBtn.addEventListener('click', () => setMuted(!muted));
elements.themeBtn.addEventListener('click', () => window.cool?.preferences?.toggleTheme?.());
elements.langBtn.addEventListener('click', () => window.cool?.preferences?.toggleLang?.());

document.addEventListener('visibilitychange', () => {
  if (document.hidden && audioContext?.state === 'running') audioContext.suspend().catch(() => {});
});

window.cool?.bindI18n?.(I18N, {
  onChange({ t: translate, lang: nextLang, kind }) {
    t = translate;
    lang = nextLang;
    if (kind === 'theme') applySceneTheme();
    render();
  },
});

if (initScene()) {
  bindPointer();
  rebuildOrbitPath();
}
/* 同步轨道的解析半径供挑战站提示使用，也保证模型被真实调用一次 */
window.cool?.track?.('sync_reference', {
  altitudeKm: Math.round(altitudeFromRadius(radiusForPeriod(SYNC_PERIOD_SECONDS)) / 1000),
});
render();
if (isCompact()) renderMobileNavigation();
