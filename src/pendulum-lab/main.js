/* 单摆实验室 Pendulum Lab 3D
   θ'' = -(g/L)·sinθ - (b/m)·θ'（线性阻力的简化模型）
   同方向过零计时测周期；能量条 KE=½m(Lω)²、PE=mgL(1-cosθ)。 */
import * as THREE from './vendor/three.module.min.js';

const I18N = {
  zh: {
    doc: '单摆实验室 · KidsLab',
    back: '返回平台',
    title: '单摆实验室',
    subtitle: '拽起摆球，去四个星球测一测时间的节拍',
    loading: '正在架起摆架…',
    noglTitle: '这台设备暂时不能显示 3D 摆架',
    noglText: '请换用支持 WebGL 的现代浏览器。',
    sceneHint: '🖐 拖住摆球拉开松手 · 拖空白处环视',
    angleBadge: (deg) => `摆角 ${deg}°`,
    viewStage: '舞台',
    viewFront: '正视',
    viewSide: '侧视',
    autoOrbit: '自动环绕',
    pause: '暂停',
    play: '继续',
    reset: '重置',
    parameters: '实验参数',
    planetEarth: '地球',
    planetMoon: '月球',
    planetMars: '火星',
    planetJupiter: '木星',
    modelNote: '参考重力下的理想摆：公式适用于约 15° 以内的小摆角；阻力是简化的线性模型。',
    length: '摆长 L',
    mass: '摆球质量 m',
    angle: '初始摆角 θ₀',
    drag: '空气阻力',
    dragNone: '无',
    dragWeak: '轻微',
    dragStrong: '很大',
    theory: '小角近似周期 2π√(L/g)',
    measured: '仿真测得周期',
    deviation: '与公式的偏差',
    swings: '已完成摆动',
    swingUnit: '次',
    kinetic: '动能',
    potential: '势能',
    energyIdeal: '没有阻力时，动能和势能只会互相变身，总量不变。',
    energyDrag: '阻力在悄悄把摆的能量变成热，摆动越来越小。',
    bigAngle: '💡 摆角超过约 15°，真实周期会比公式算出的更长——试试看偏差有多大！',
    firstPeriod: '⏱ 测到第一个完整周期！换个星球或改摆长再比比看。',
    nudge: '试试拖住金色摆球，拉到一边再松手 🖐',
    muted: '打开声音',
    unmuted: '关闭声音',
    theme: '切换主题',
    viewGroup: '观察视角',
    motionGroup: '播放控制',
    speedGroup: '时间流速',
    planetGroup: '选择星球',
    dragGroup: '空气阻力',
  },
  en: {
    doc: 'Pendulum Lab · KidsLab',
    back: 'Back',
    title: 'Pendulum Lab',
    subtitle: 'Pull the bob and time the beat on four planets',
    loading: 'Setting up the rig…',
    noglTitle: 'This device cannot show the 3D rig',
    noglText: 'Please use a modern browser with WebGL support.',
    sceneHint: '🖐 Drag the bob and let go · drag empty space to orbit',
    angleBadge: (deg) => `Angle ${deg}°`,
    viewStage: 'Stage',
    viewFront: 'Front',
    viewSide: 'Side',
    autoOrbit: 'Auto orbit',
    pause: 'Pause',
    play: 'Play',
    reset: 'Reset',
    parameters: 'Parameters',
    planetEarth: 'Earth',
    planetMoon: 'Moon',
    planetMars: 'Mars',
    planetJupiter: 'Jupiter',
    modelNote: 'An ideal pendulum under reference gravity: the formula fits swings within about 15°; drag is a simplified linear model.',
    length: 'Length L',
    mass: 'Bob mass m',
    angle: 'Start angle θ₀',
    drag: 'Air drag',
    dragNone: 'None',
    dragWeak: 'Gentle',
    dragStrong: 'Heavy',
    theory: 'Small-angle period 2π√(L/g)',
    measured: 'Simulated period',
    deviation: 'Deviation from formula',
    swings: 'Full swings',
    swingUnit: '',
    kinetic: 'Kinetic',
    potential: 'Potential',
    energyIdeal: 'With no drag, energy only shape-shifts between the two bars — the total stays put.',
    energyDrag: 'Drag is quietly turning the swing energy into heat, so each swing gets smaller.',
    bigAngle: '💡 Beyond about 15°, the real period is longer than the formula predicts — check the deviation!',
    firstPeriod: '⏱ First full period measured! Try another planet or length and compare.',
    nudge: 'Try dragging the golden bob to one side, then let go 🖐',
    muted: 'Turn sound on',
    unmuted: 'Turn sound off',
    theme: 'Toggle theme',
    viewGroup: 'Camera views',
    motionGroup: 'Playback',
    speedGroup: 'Time speed',
    planetGroup: 'Pick a planet',
    dragGroup: 'Air drag',
  },
};

const PLANETS = {
  earth: { g: 9.81 },
  moon: { g: 1.62 },
  mars: { g: 3.71 },
  jupiter: { g: 24.79 },
};

/* 每个星球两套（深/浅主题）环境配色 */
const ENV = {
  earth: {
    dark: { top: 0x17222e, bottom: 0x0d1117, floorA: '#2d3238', floorB: '#191d21', hemiSky: 0xbcd6ea, hemiGround: 0x232a2f, stars: 0 },
    light: { top: 0xbcdcf0, bottom: 0xf0e7d2, floorA: '#cdbfa0', floorB: '#a8946e', hemiSky: 0xffffff, hemiGround: 0x9a8a68, stars: 0 },
  },
  moon: {
    /* 月球没有大气，天空始终是黑的 */
    dark: { top: 0x05070c, bottom: 0x0b0d13, floorA: '#585a60', floorB: '#2c2e34', hemiSky: 0x8d99ad, hemiGround: 0x1f2126, stars: 170 },
    light: { top: 0x0a0d14, bottom: 0x141821, floorA: '#8f939c', floorB: '#5a5e66', hemiSky: 0xcdd6e4, hemiGround: 0x3c4046, stars: 170 },
  },
  mars: {
    dark: { top: 0x2a160d, bottom: 0x1a0d07, floorA: '#6e3a20', floorB: '#3c1f10', hemiSky: 0xe8b48c, hemiGround: 0x33190c, stars: 0 },
    light: { top: 0xe8b083, bottom: 0xd88f5c, floorA: '#c07948', floorB: '#8d4f27', hemiSky: 0xffe0c0, hemiGround: 0x8a4d24, stars: 0 },
  },
  jupiter: {
    dark: { top: 0x241108, bottom: 0x160b05, floorA: '#59331a', floorB: '#2e1a0c', hemiSky: 0xf0c090, hemiGround: 0x2a150a, stars: 0, bands: true },
    light: { top: 0xf2c896, bottom: 0xdd9a5e, floorA: '#cf9450', floorB: '#9c632c', hemiSky: 0xfff0d8, hemiGround: 0x99622c, stars: 0, bands: true },
  },
};

const MAX_ANGLE = (80 * Math.PI) / 180;
const SMALL_ANGLE = (15 * Math.PI) / 180;
const BRASS_DENSITY = 8500; /* kg/m³，黄铜 */
const BOB_VISUAL_SCALE = 2.3; /* 摆球体积按密度换算后放大绘制，物理仍视为质点 */
const DRAG_B1 = { none: 0, weak: 0.06, strong: 0.6 }; /* 1 kg 摆球的 b 值（kg/s） */
const PIVOT = new THREE.Vector3(0, 3.02, 0);

const state = {
  planet: 'earth',
  g: 9.81,
  L: 1.2,
  mass: 1,
  angle0: (12 * Math.PI) / 180,
  drag: 'none',
  speed: 1,
  theta: (12 * Math.PI) / 180,
  omega: 0,
  releaseAngle: (12 * Math.PI) / 180,
  running: true,
  holding: false,
  draggingBob: false,
  simTime: 0,
  lastCross: null,
  period: null,
  swings: 0,
  everMeasured: false,
};

let lang = window.cool?.preferences?.lang || 'zh';
let theme = window.cool?.preferences?.theme || 'dark';
let translate = (key, ...args) => {
  const value = I18N.zh[key];
  return typeof value === 'function' ? value(...args) : value ?? key;
};
let hasInteracted = false;
let hasReleased = false;
let toastTimer = 0;
let nudgeTimer = 0;

const $ = (selector) => document.querySelector(selector);
const elements = {
  canvas: $('#scene'),
  loading: $('#loading'),
  nogl: $('#nogl'),
  toast: $('#toast'),
  angleBadge: $('#angleBadge'),
  soundBtn: $('#soundBtn'),
  themeBtn: $('#themeBtn'),
  langBtn: $('#langBtn'),
  playBtn: $('#playBtn'),
  resetBtn: $('#resetBtn'),
  autoOrbitBtn: $('#autoOrbitBtn'),
  sheetHandle: $('#sheetHandle'),
  console: $('#console'),
  length: $('#length'),
  mass: $('#mass'),
  angle: $('#angle'),
  lengthValue: $('#lengthValue'),
  massValue: $('#massValue'),
  angleValue: $('#angleValue'),
  theoryValue: $('#theoryValue'),
  measuredValue: $('#measuredValue'),
  deviationValue: $('#deviationValue'),
  swingCount: $('#swingCount'),
  keBar: $('#keBar'),
  peBar: $('#peBar'),
  energyNote: $('#energyNote'),
  bigAngleNote: $('#bigAngleNote'),
};

/* ---------------- 音效（WebAudio 合成，静音可持久化） ---------------- */
const storage = window.cool?.storage || {
  get: (key, fallback = null) => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
  set: (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } },
};
const SOUND_KEY = 'kidslab.pendulum-lab.sound';
let soundMuted = storage.get(SOUND_KEY, 'on') === 'off';
let audioContext = null;
let audioAvailable = true;
let lastTickAt = 0;

function tone(frequency, duration = 0.1, type = 'sine', gain = 0.045, delay = 0) {
  if (soundMuted || !audioAvailable) return;
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) { audioAvailable = false; return; }
    audioContext ||= new AudioCtor();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    const start = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(gain, start);
    envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(envelope).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  } catch { audioAvailable = false; }
}

function whoosh() {
  if (soundMuted || !audioAvailable || !audioContext) return;
  try {
    const now = audioContext.currentTime;
    const length = 0.16;
    const buffer = audioContext.createBuffer(1, Math.floor(audioContext.sampleRate * length), audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index++) data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 750;
    filter.Q.value = 1.2;
    const envelope = audioContext.createGain();
    envelope.gain.setValueAtTime(0.05, now);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + length);
    source.connect(filter).connect(envelope).connect(audioContext.destination);
    source.start(now);
  } catch { /* 静默降级 */ }
}

const sound = {
  grab: () => tone(320, 0.06, 'triangle', 0.05),
  release: () => { tone(440, 0.05, 'triangle', 0.03); whoosh(); },
  /* 摆到最高点的轻微滴答；只在角速度过零边界发声并加冷却 */
  tick: () => {
    const now = performance.now();
    if (now - lastTickAt < 140) return;
    lastTickAt = now;
    tone(210, 0.045, 'sine', 0.022);
  },
  select: () => [500, 680].forEach((frequency, index) => tone(frequency, 0.07, 'sine', 0.034, index * 0.05)),
  adjust: () => tone(540, 0.05, 'triangle', 0.028),
  success: () => [523, 659, 784, 1047].forEach((frequency, index) => tone(frequency, 0.15, 'triangle', 0.055, index * 0.08)),
};

/* ---------------- 物理 ---------------- */
const bobRadius = (mass) => Math.cbrt((3 * mass) / (4 * Math.PI * BRASS_DENSITY));
const dragOverMass = () => (DRAG_B1[state.drag] * (bobRadius(state.mass) / bobRadius(1))) / state.mass;
const theoryPeriod = () => 2 * Math.PI * Math.sqrt(state.L / state.g);

function step(dt) {
  const sub = 16;
  const h = dt / sub;
  const damping = dragOverMass();
  for (let index = 0; index < sub; index++) {
    const prevTheta = state.theta;
    const prevOmega = state.omega;
    const prevTime = state.simTime;
    state.omega += (-(state.g / state.L) * Math.sin(state.theta) - damping * state.omega) * h;
    state.theta += state.omega * h;
    state.simTime += h;
    /* 最高点（角速度变号）→ 轻滴答 */
    if (prevOmega !== 0 && Math.sign(prevOmega) !== Math.sign(state.omega) && Math.abs(state.theta) > 0.02) sound.tick();
    /* 正向过零 → 记录一个完整周期 */
    if (prevTheta <= 0 && state.theta > 0 && state.omega > 0) {
      const fraction = -prevTheta / (state.theta - prevTheta);
      const crossTime = prevTime + fraction * h;
      if (state.lastCross != null) {
        state.period = crossTime - state.lastCross;
        state.swings += 1;
        onPeriodMeasured();
      }
      state.lastCross = crossTime;
    }
  }
}

function resetMeasure() {
  state.lastCross = null;
  state.period = null;
  state.simTime = 0;
  state.swings = 0;
  trailCount = 0;
}

function onPeriodMeasured() {
  /* 页面加载后的自动演示不计成果，须由孩子亲手操作 */
  if (!hasInteracted) return;
  if (!state.everMeasured) {
    state.everMeasured = true;
    sound.success();
    showToast(translate('firstPeriod'));
    window.cool?.complete?.();
  }
  window.cool?.track?.('measured_period', {
    planet: state.planet,
    length: state.L,
    period: Number(state.period.toFixed(3)),
  });
}

function markInteraction() {
  if (hasInteracted) return;
  hasInteracted = true;
  clearTimeout(nudgeTimer);
  window.cool?.stage?.('experimenting');
}

function showToast(text) {
  clearTimeout(toastTimer);
  elements.toast.textContent = text;
  elements.toast.hidden = false;
  toastTimer = window.setTimeout(() => { elements.toast.hidden = true; }, 3200);
}

/* ---------------- three.js 场景 ---------------- */
let renderer = null;
let scene = null;
let camera = null;
let backdropTexture = null;
let backdropMesh = null;
let floorTexture = null;
let floorMesh = null;
let hemiLight = null;
let keyLight = null;
let fillLight = null;
let swingGroup = null;
let stringMesh = null;
let bobMesh = null;
let bobHitMesh = null;
let ghostGroup = null;
let ghostBob = null;
let protractorGroup = null;
let trailLine = null;
let trailCount = 0;
const TRAIL_MAX = 110;

const materials = {};
const labelSprites = [];

const orbit = {
  theta: 0.95,
  phi: 1.28,
  distance: 6.4,
  target: new THREE.Vector3(0, 1.55, 0),
  auto: false,
};
const pointers = new Map();
let dragPointerId = null;
let lastPointer = { x: 0, y: 0 };
let pinchDistance = 0;
const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();
const swingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

function setupRenderer() {
  try {
    renderer = new THREE.WebGLRenderer({ canvas: elements.canvas, antialias: true, alpha: false });
  } catch {
    elements.loading.hidden = true;
    elements.nogl.hidden = false;
    return false;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return true;
}

function paintBackdrop() {
  const env = ENV[state.planet][theme];
  const canvas = backdropTexture.image;
  const context = canvas.getContext('2d');
  const { width, height } = canvas;
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, `#${env.top.toString(16).padStart(6, '0')}`);
  gradient.addColorStop(1, `#${env.bottom.toString(16).padStart(6, '0')}`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  if (env.bands) {
    /* 木星云带 */
    context.globalAlpha = theme === 'dark' ? 0.28 : 0.34;
    const bandColors = ['#e8b075', '#a86038', '#f0cfa0', '#b87244', '#dda368'];
    let y = height * 0.05;
    let bandIndex = 0;
    while (y < height * 0.92) {
      const bandHeight = height * (0.05 + (bandIndex % 3) * 0.03);
      context.fillStyle = bandColors[bandIndex % bandColors.length];
      context.beginPath();
      context.ellipse(width / 2, y + bandHeight / 2, width * 0.75, bandHeight / 2, 0, 0, Math.PI * 2);
      context.fill();
      y += bandHeight * 1.28;
      bandIndex += 1;
    }
    context.globalAlpha = 1;
  }

  if (env.stars) {
    /* 月球黑色天空的星星（可复现的伪随机） */
    let seed = 42;
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let index = 0; index < env.stars; index++) {
      const x = random() * width;
      const y = random() * height * 0.82;
      const size = 0.6 + random() * 1.6;
      context.globalAlpha = 0.35 + random() * 0.6;
      context.fillStyle = '#f4f6ff';
      context.fillRect(x, y, size, size);
    }
    context.globalAlpha = 1;
  }

  /* 底部暗角让地面衔接自然 */
  const vignette = context.createLinearGradient(0, height * 0.66, 0, height);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.36)');
  context.fillStyle = vignette;
  context.fillRect(0, height * 0.66, width, height * 0.34);
  backdropTexture.needsUpdate = true;
}

function paintFloor() {
  const env = ENV[state.planet][theme];
  const canvas = floorTexture.image;
  const context = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  const gradient = context.createRadialGradient(center, center, size * 0.04, center, center, center);
  gradient.addColorStop(0, env.floorA);
  gradient.addColorStop(1, env.floorB);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  /* 同心刻度环，像老实验室的标定台 */
  context.strokeStyle = 'rgba(255, 244, 214, 0.13)';
  for (let ring = 1; ring <= 7; ring++) {
    context.lineWidth = ring % 2 ? 1.6 : 3;
    context.beginPath();
    context.arc(center, center, (size / 2) * (ring / 7.6), 0, Math.PI * 2);
    context.stroke();
  }
  context.strokeStyle = 'rgba(255, 244, 214, 0.1)';
  context.lineWidth = 2;
  for (let spoke = 0; spoke < 12; spoke++) {
    const angle = (spoke / 12) * Math.PI * 2;
    context.beginPath();
    context.moveTo(center + Math.cos(angle) * size * 0.055, center + Math.sin(angle) * size * 0.055);
    context.lineTo(center + Math.cos(angle) * center, center + Math.sin(angle) * center);
    context.stroke();
  }
  floorTexture.needsUpdate = true;
}

function makeLabelSprite() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.34, 0.17, 1);
  sprite.userData = { canvas, texture };
  return sprite;
}

function drawLabelSprite(sprite, text) {
  const { canvas, texture } = sprite.userData;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = theme === 'dark' ? 'rgba(243, 234, 216, 0.78)' : 'rgba(61, 48, 18, 0.8)';
  context.font = '700 30px "Avenir Next", "PingFang SC", sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 64, 34);
  texture.needsUpdate = true;
}

function createEnvironment() {
  const backdropCanvas = document.createElement('canvas');
  backdropCanvas.width = 1024;
  backdropCanvas.height = 512;
  backdropTexture = new THREE.CanvasTexture(backdropCanvas);
  backdropTexture.colorSpace = THREE.SRGBColorSpace;
  backdropMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(46, 22),
    new THREE.MeshBasicMaterial({ map: backdropTexture, depthWrite: false }),
  );
  backdropMesh.position.set(0, 6.5, -9);
  scene.add(backdropMesh);

  const floorCanvas = document.createElement('canvas');
  floorCanvas.width = 1024;
  floorCanvas.height = 1024;
  floorTexture = new THREE.CanvasTexture(floorCanvas);
  floorTexture.colorSpace = THREE.SRGBColorSpace;
  floorMesh = new THREE.Mesh(
    new THREE.CircleGeometry(13, 72),
    new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.94, metalness: 0 }),
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);
}

function createStand() {
  const walnut = new THREE.MeshStandardMaterial({ color: 0x4a331f, roughness: 0.62, metalness: 0.08 });
  const walnutDark = new THREE.MeshStandardMaterial({ color: 0x33210f, roughness: 0.7, metalness: 0.05 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9973f, roughness: 0.32, metalness: 0.85 });
  materials.walnut = walnut;
  materials.brass = brass;

  const stand = new THREE.Group();

  const baseTop = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.14, 1.1), walnut);
  baseTop.position.set(0, 0.23, -0.62);
  const basePlinth = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 1.3), walnutDark);
  basePlinth.position.set(0, 0.1, -0.62);
  stand.add(baseTop, basePlinth);
  [[-0.8, -1.16], [0.8, -1.16], [-0.8, -0.08], [0.8, -0.08]].forEach(([x, z]) => {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.075, 0.08, 20), brass);
    foot.position.set(x, 0.04, z);
    stand.add(foot);
  });

  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 2.95, 28), brass);
  column.position.set(0, 0.3 + 2.95 / 2, -0.62);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.1, 24), walnutDark);
  collar.position.set(0, 0.36, -0.62);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 18), brass);
  cap.position.set(0, 3.3, -0.62);
  stand.add(column, collar, cap);

  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.78, 20), brass);
  arm.rotation.x = Math.PI / 2;
  arm.position.set(0, PIVOT.y + 0.13, -0.62 + 0.39);
  const brace = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.62, 14), brass);
  brace.position.set(0, PIVOT.y - 0.11, -0.36);
  brace.rotation.x = Math.PI / 4.2;
  const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.16, 0.13), walnutDark);
  clamp.position.set(0, PIVOT.y + 0.08, 0);
  const pivotPin = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 20), brass);
  pivotPin.rotation.x = Math.PI / 2;
  pivotPin.position.copy(PIVOT);
  stand.add(arm, brace, clamp, pivotPin);

  stand.traverse((node) => {
    if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; }
  });
  scene.add(stand);
}

function createPendulum() {
  materials.string = new THREE.MeshStandardMaterial({ color: 0xd8cdb4, roughness: 0.8, metalness: 0.1 });
  materials.bob = new THREE.MeshStandardMaterial({ color: 0xe0aa4e, roughness: 0.26, metalness: 0.9 });

  swingGroup = new THREE.Group();
  swingGroup.position.copy(PIVOT);
  scene.add(swingGroup);

  stringMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1, 10), materials.string);
  stringMesh.castShadow = true;
  swingGroup.add(stringMesh);

  bobMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), materials.bob);
  bobMesh.castShadow = true;
  swingGroup.add(bobMesh);

  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.011, 10, 20), materials.brass);
  hook.name = 'hook';
  swingGroup.add(hook);

  /* 摆球的放大拾取热区（不可见），保证手机上也好抓 */
  bobHitMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), new THREE.MeshBasicMaterial({ visible: false }));
  swingGroup.add(bobHitMesh);

  ghostGroup = new THREE.Group();
  ghostGroup.position.copy(PIVOT);
  scene.add(ghostGroup);
  materials.ghost = new THREE.MeshStandardMaterial({ color: 0xe0aa4e, transparent: true, opacity: 0.2, roughness: 0.4, metalness: 0.6, depthWrite: false });
  ghostBob = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), materials.ghost);
  ghostGroup.add(ghostBob);

  updatePendulumGeometry();
}

/* 摆长/质量变化时更新绳长、球径与量角器 */
function updatePendulumGeometry() {
  const radius = bobRadius(state.mass) * BOB_VISUAL_SCALE;
  const stringLength = Math.max(state.L - radius, 0.05);
  stringMesh.scale.y = stringLength;
  stringMesh.position.y = -stringLength / 2;
  bobMesh.scale.setScalar(radius);
  bobMesh.position.y = -state.L;
  bobHitMesh.scale.setScalar(Math.max(radius * 1.7, 0.24));
  bobHitMesh.position.y = -state.L;
  const hook = swingGroup.getObjectByName('hook');
  hook.position.y = -stringLength;
  hook.scale.setScalar(Math.max(radius / 0.07, 0.7));
  ghostBob.scale.setScalar(radius);
  ghostBob.position.y = -state.L;
  rebuildProtractor();
}

function disposeProtractor() {
  if (!protractorGroup) return;
  protractorGroup.traverse((node) => {
    node.geometry?.dispose?.();
    if (node.material) {
      node.material.map?.dispose?.();
      node.material.dispose?.();
    }
  });
  scene.remove(protractorGroup);
  protractorGroup = null;
  labelSprites.length = 0;
}

function rebuildProtractor() {
  disposeProtractor();
  protractorGroup = new THREE.Group();
  protractorGroup.position.set(PIVOT.x, PIVOT.y, -0.07);
  const radius = state.L;
  const guideColor = theme === 'dark' ? 0xf3ead8 : 0x3d3012;
  const guide = new THREE.MeshBasicMaterial({ color: guideColor, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false });
  const guideFaint = new THREE.MeshBasicMaterial({ color: guideColor, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false });

  /* 弧线：以竖直向下为 0°，左右各 80° */
  const arcStart = -Math.PI / 2 - MAX_ANGLE;
  const arc = new THREE.Mesh(new THREE.RingGeometry(radius - 0.008, radius + 0.008, 96, 1, arcStart, MAX_ANGLE * 2), guideFaint);
  protractorGroup.add(arc);

  for (let degrees = -75; degrees <= 75; degrees += 15) {
    const major = degrees % 30 === 0;
    const tick = new THREE.Mesh(new THREE.PlaneGeometry(0.012, major ? 0.11 : 0.055), guide);
    const angle = (degrees * Math.PI) / 180;
    const tickRadius = radius + (major ? 0.075 : 0.05);
    tick.position.set(Math.sin(angle) * tickRadius, -Math.cos(angle) * tickRadius, 0);
    tick.rotation.z = angle;
    protractorGroup.add(tick);
  }

  /* 中垂参考线 */
  const plumb = new THREE.Mesh(new THREE.PlaneGeometry(0.008, radius * 0.98), guideFaint);
  plumb.position.set(0, -radius * 0.49, 0);
  protractorGroup.add(plumb);

  while (labelSprites.length) labelSprites.pop();
  [-60, -30, 0, 30, 60].forEach((degrees) => {
    const sprite = makeLabelSprite();
    const angle = (degrees * Math.PI) / 180;
    sprite.position.set(Math.sin(angle) * (radius + 0.24), -Math.cos(angle) * (radius + 0.24), 0);
    sprite.userData.degrees = degrees;
    drawLabelSprite(sprite, `${Math.abs(degrees)}°`);
    protractorGroup.add(sprite);
    labelSprites.push(sprite);
  });

  scene.add(protractorGroup);
}

function createTrail() {
  const positions = new Float32Array(TRAIL_MAX * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setDrawRange(0, 0);
  materials.trail = new THREE.LineBasicMaterial({ color: 0x63d8b2, transparent: true, opacity: 0.5 });
  trailLine = new THREE.Line(geometry, materials.trail);
  trailLine.frustumCulled = false;
  scene.add(trailLine);
}

function pushTrailPoint() {
  const positions = trailLine.geometry.attributes.position;
  const x = PIVOT.x + Math.sin(state.theta) * state.L;
  const y = PIVOT.y - Math.cos(state.theta) * state.L;
  if (trailCount < TRAIL_MAX) {
    positions.setXYZ(trailCount, x, y, 0.02);
    trailCount += 1;
  } else {
    /* 环形前移：整体左移一格，最新点放最后 */
    positions.array.copyWithin(0, 3);
    positions.setXYZ(TRAIL_MAX - 1, x, y, 0.02);
  }
  positions.needsUpdate = true;
  trailLine.geometry.setDrawRange(0, trailCount);
}

function createLights() {
  hemiLight = new THREE.HemisphereLight(0xbcd6ea, 0x232a2f, 0.85);
  keyLight = new THREE.DirectionalLight(0xfff0d8, 1.5);
  keyLight.position.set(3.4, 6.2, 3.6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -3.4;
  keyLight.shadow.camera.right = 3.4;
  keyLight.shadow.camera.top = 4.6;
  keyLight.shadow.camera.bottom = -0.6;
  keyLight.shadow.camera.far = 16;
  keyLight.shadow.bias = -0.0008;
  fillLight = new THREE.DirectionalLight(0x8fb6d8, 0.35);
  fillLight.position.set(-4, 2.4, -2.2);
  scene.add(hemiLight, keyLight, fillLight);
}

function applyEnvironment() {
  const env = ENV[state.planet][theme];
  paintBackdrop();
  paintFloor();
  hemiLight.color.setHex(env.hemiSky);
  hemiLight.groundColor.setHex(env.hemiGround);
  hemiLight.intensity = theme === 'dark' ? 0.8 : 1.05;
  keyLight.intensity = theme === 'dark' ? 1.5 : 1.7;
  scene.fog.color.setHex(env.bottom);
  renderer.setClearColor(env.bottom, 1);
}

function updateCamera() {
  const sinPhi = Math.sin(orbit.phi);
  camera.position.set(
    orbit.target.x + orbit.distance * sinPhi * Math.cos(orbit.theta),
    orbit.target.y + orbit.distance * Math.cos(orbit.phi),
    orbit.target.z + orbit.distance * sinPhi * Math.sin(orbit.theta),
  );
  camera.lookAt(orbit.target);
}

const VIEWS = {
  stage: { theta: 0.95, phi: 1.28, distance: 6.4 },
  front: { theta: Math.PI / 2, phi: 1.32, distance: 5.9 },
  side: { theta: 0.06, phi: 1.38, distance: 5.4 },
};
let viewAnimation = null;

function setAutoOrbit(on) {
  orbit.auto = on;
  elements.autoOrbitBtn.classList.toggle('is-active', on);
  elements.autoOrbitBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
}

function goToView(name, options = {}) {
  const target = VIEWS[name];
  if (!target) return;
  setAutoOrbit(false);
  const from = { theta: orbit.theta, phi: orbit.phi, distance: orbit.distance };
  const start = performance.now();
  const duration = 620;
  cancelAnimationFrame(viewAnimation);
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const animate = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const k = ease(t);
    orbit.theta = from.theta + (target.theta - from.theta) * k;
    orbit.phi = from.phi + (target.phi - from.phi) * k;
    orbit.distance = from.distance + (target.distance - from.distance) * k;
    if (t < 1) viewAnimation = requestAnimationFrame(animate);
  };
  viewAnimation = requestAnimationFrame(animate);
  document.querySelectorAll('.view-btn[data-view]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.view === name);
    button.setAttribute('aria-pressed', button.dataset.view === name ? 'true' : 'false');
  });
  if (!options.silent) window.cool?.track?.('changed_view', { view: name });
}

/* ---------------- 指针交互：抓摆球 / 环视 / 双指缩放 ---------------- */
function pointerToNdc(event) {
  const rect = elements.canvas.getBoundingClientRect();
  pointerNdc.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  );
}

function angleFromPointer(event) {
  pointerToNdc(event);
  raycaster.setFromCamera(pointerNdc, camera);
  const hit = new THREE.Vector3();
  if (!raycaster.ray.intersectPlane(swingPlane, hit)) return null;
  const angle = Math.atan2(hit.x - PIVOT.x, PIVOT.y - hit.y);
  return THREE.MathUtils.clamp(angle, -MAX_ANGLE, MAX_ANGLE);
}

function onPointerDown(event) {
  markInteraction();
  elements.canvas.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
    dragPointerId = null;
    state.draggingBob = false;
    return;
  }
  lastPointer = { x: event.clientX, y: event.clientY };
  pointerToNdc(event);
  raycaster.setFromCamera(pointerNdc, camera);
  const hits = raycaster.intersectObject(bobHitMesh, false);
  if (hits.length) {
    dragPointerId = event.pointerId;
    state.draggingBob = true;
    state.running = true;
    state.omega = 0;
    resetMeasure();
    ghostGroup.visible = false;
    sound.grab();
    updatePlayButton();
  } else {
    dragPointerId = null;
  }
}

function onPointerMove(event) {
  const entry = pointers.get(event.pointerId);
  if (!entry) return;
  if (pointers.size === 2) {
    entry.x = event.clientX;
    entry.y = event.clientY;
    const [a, b] = [...pointers.values()];
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    if (pinchDistance > 0) {
      orbit.distance = THREE.MathUtils.clamp(orbit.distance * (pinchDistance / distance), 3.2, 11);
    }
    pinchDistance = distance;
    return;
  }
  if (state.draggingBob && event.pointerId === dragPointerId) {
    const angle = angleFromPointer(event);
    if (angle != null) {
      state.theta = angle;
      state.omega = 0;
      syncAngleSlider();
    }
  } else {
    const dx = event.clientX - lastPointer.x;
    const dy = event.clientY - lastPointer.y;
    lastPointer = { x: event.clientX, y: event.clientY };
    setAutoOrbit(false);
    orbit.theta += dx * 0.0052;
    orbit.phi = THREE.MathUtils.clamp(orbit.phi - dy * 0.0042, 0.35, 1.52);
  }
  entry.x = event.clientX;
  entry.y = event.clientY;
}

function onPointerUp(event) {
  pointers.delete(event.pointerId);
  if (pointers.size < 2) pinchDistance = 0;
  if (state.draggingBob && event.pointerId === dragPointerId) {
    releaseBob();
  }
  if (event.pointerId === dragPointerId) dragPointerId = null;
}

function releaseBob() {
  state.draggingBob = false;
  state.releaseAngle = state.theta;
  state.omega = 0;
  state.running = true;
  resetMeasure();
  ghostGroup.visible = Math.abs(state.releaseAngle) > 0.02;
  ghostGroup.rotation.z = state.releaseAngle;
  hasReleased = true;
  sound.release();
  syncAngleSlider();
  updatePlayButton();
  updateBigAngleNote();
  window.cool?.track?.('released_bob', { angleDeg: Math.round((state.releaseAngle * 180) / Math.PI) });
}

/* ---------------- 控件绑定与读数 ---------------- */
function updateRangeFill(input) {
  const min = Number(input.min);
  const max = Number(input.max);
  const percent = ((Number(input.value) - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${percent}%`);
}

function syncAngleSlider() {
  const degrees = Math.round(Math.abs(state.theta) * (180 / Math.PI));
  const clamped = Math.max(3, Math.min(80, degrees));
  elements.angle.value = String(clamped);
  elements.angleValue.textContent = `${clamped}°`;
  updateRangeFill(elements.angle);
}

function updatePlayButton() {
  elements.playBtn.querySelector('.motion-label').textContent = translate(state.running ? 'pause' : 'play');
  elements.playBtn.querySelector('.motion-icon').textContent = state.running ? '⏸' : '▶';
}

function updateBigAngleNote() {
  elements.bigAngleNote.hidden = Math.abs(state.releaseAngle) <= SMALL_ANGLE;
}

function updateEnergyNote() {
  elements.energyNote.textContent = translate(state.drag === 'none' ? 'energyIdeal' : 'energyDrag');
}

let lastBadgeDegrees = null;
let readoutTimer = 0;

function updateReadouts(force = false) {
  const degrees = Math.round((state.theta * 180) / Math.PI);
  if (degrees !== lastBadgeDegrees) {
    lastBadgeDegrees = degrees;
    elements.angleBadge.textContent = translate('angleBadge', Math.abs(degrees));
  }

  /* 能量条每帧更新（transform 便宜），文本读数节流 */
  const kinetic = 0.5 * state.mass * (state.L * state.omega) ** 2;
  const potential = state.mass * state.g * state.L * (1 - Math.cos(state.theta));
  const total = state.mass * state.g * state.L * (1 - Math.cos(state.releaseAngle)) || 1e-6;
  elements.keBar.style.transform = `scaleX(${Math.min(kinetic / total, 1)})`;
  elements.peBar.style.transform = `scaleX(${Math.min(potential / total, 1)})`;

  const now = performance.now();
  if (!force && now - readoutTimer < 150) return;
  readoutTimer = now;

  const theory = theoryPeriod();
  elements.theoryValue.textContent = `${theory.toFixed(2)} s`;
  if (state.period != null) {
    elements.measuredValue.textContent = `${state.period.toFixed(2)} s`;
    const deviation = ((state.period - theory) / theory) * 100;
    elements.deviationValue.textContent = `${deviation >= 0 ? '+' : ''}${deviation.toFixed(1)}%`;
  } else {
    elements.measuredValue.textContent = '—';
    elements.deviationValue.textContent = '—';
  }
  elements.swingCount.textContent = String(state.swings);
}

function bindControls() {
  /* 摆长 */
  elements.length.addEventListener('input', () => {
    markInteraction();
    state.L = Number(elements.length.value);
    elements.lengthValue.textContent = `${state.L.toFixed(2)} m`;
    updateRangeFill(elements.length);
    updatePendulumGeometry();
    resetMeasure();
    ghostGroup.visible = false;
  });
  elements.length.addEventListener('change', () => {
    sound.adjust();
    window.cool?.track?.('adjusted_parameter', { parameter: 'length', value: state.L });
  });

  /* 质量 */
  elements.mass.addEventListener('input', () => {
    markInteraction();
    state.mass = Number(elements.mass.value);
    elements.massValue.textContent = `${state.mass.toFixed(1)} kg`;
    updateRangeFill(elements.mass);
    updatePendulumGeometry();
    resetMeasure();
  });
  elements.mass.addEventListener('change', () => {
    sound.adjust();
    window.cool?.track?.('adjusted_parameter', { parameter: 'mass', value: state.mass });
  });

  /* 初始角：拖动时摆球跟随停住，松开后从该角起摆 */
  elements.angle.addEventListener('input', () => {
    markInteraction();
    state.holding = true;
    const radians = (Number(elements.angle.value) * Math.PI) / 180;
    state.theta = radians;
    state.omega = 0;
    elements.angleValue.textContent = `${elements.angle.value}°`;
    updateRangeFill(elements.angle);
  });
  elements.angle.addEventListener('change', () => {
    state.holding = false;
    state.angle0 = (Number(elements.angle.value) * Math.PI) / 180;
    state.theta = state.angle0;
    releaseBob();
    window.cool?.track?.('adjusted_parameter', { parameter: 'angle', value: Number(elements.angle.value) });
  });

  /* 星球 */
  document.querySelectorAll('.planet[data-planet]').forEach((button) => {
    button.addEventListener('click', () => {
      markInteraction();
      if (state.planet === button.dataset.planet) return;
      state.planet = button.dataset.planet;
      state.g = PLANETS[state.planet].g;
      document.querySelectorAll('.planet[data-planet]').forEach((other) => {
        other.classList.toggle('is-active', other === button);
        other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
      });
      applyEnvironment();
      resetMeasure();
      sound.select();
      updateReadouts(true);
      window.cool?.track?.('selected_planet', { planet: state.planet });
    });
  });

  /* 空气阻力 */
  document.querySelectorAll('.chip[data-drag]').forEach((button) => {
    button.addEventListener('click', () => {
      markInteraction();
      state.drag = button.dataset.drag;
      document.querySelectorAll('.chip[data-drag]').forEach((other) => {
        other.classList.toggle('is-active', other === button);
        other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
      });
      resetMeasure();
      updateEnergyNote();
      sound.adjust();
      window.cool?.track?.('toggled_drag', { level: state.drag });
    });
  });

  /* 时间流速 */
  document.querySelectorAll('.speed-chip[data-speed]').forEach((button) => {
    button.addEventListener('click', () => {
      markInteraction();
      state.speed = Number(button.dataset.speed);
      document.querySelectorAll('.speed-chip[data-speed]').forEach((other) => {
        other.classList.toggle('is-active', other === button);
        other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
      });
      sound.adjust();
    });
  });

  /* 播放 / 重置 */
  elements.playBtn.addEventListener('click', () => {
    markInteraction();
    state.running = !state.running;
    updatePlayButton();
    sound.adjust();
  });
  elements.resetBtn.addEventListener('click', () => {
    markInteraction();
    state.draggingBob = false;
    state.theta = state.angle0;
    state.omega = 0;
    state.releaseAngle = state.angle0;
    state.running = true;
    resetMeasure();
    ghostGroup.visible = true;
    ghostGroup.rotation.z = state.releaseAngle;
    syncAngleSlider();
    updatePlayButton();
    updateBigAngleNote();
    updateReadouts(true);
    sound.adjust();
  });

  /* 视角 */
  document.querySelectorAll('.view-btn[data-view]').forEach((button) => {
    button.addEventListener('click', () => { markInteraction(); goToView(button.dataset.view); sound.adjust(); });
  });
  elements.autoOrbitBtn.addEventListener('click', () => {
    markInteraction();
    setAutoOrbit(!orbit.auto);
    if (orbit.auto) {
      document.querySelectorAll('.view-btn[data-view]').forEach((other) => {
        other.classList.remove('is-active');
        other.setAttribute('aria-pressed', 'false');
      });
    }
    sound.adjust();
    window.cool?.track?.('changed_view', { view: orbit.auto ? 'auto-orbit' : 'manual' });
  });

  /* 场景指针 */
  elements.canvas.addEventListener('pointerdown', onPointerDown);
  elements.canvas.addEventListener('pointermove', onPointerMove);
  elements.canvas.addEventListener('pointerup', onPointerUp);
  elements.canvas.addEventListener('pointercancel', onPointerUp);
  elements.canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    orbit.distance = THREE.MathUtils.clamp(orbit.distance * (1 + Math.sign(event.deltaY) * 0.08), 3.2, 11);
  }, { passive: false });

  /* 声音开关 */
  elements.soundBtn.addEventListener('click', () => {
    soundMuted = !soundMuted;
    storage.set(SOUND_KEY, soundMuted ? 'off' : 'on');
    updateSoundButton();
    if (!soundMuted) tone(660, 0.08, 'sine', 0.04);
  });

  /* 主题 / 语言 */
  elements.themeBtn.addEventListener('click', () => window.cool?.preferences?.toggleTheme?.());
  elements.langBtn.addEventListener('click', () => window.cool?.preferences?.toggleLang?.());

  /* 手机端底部抽屉 */
  elements.sheetHandle.addEventListener('click', () => {
    elements.console.classList.toggle('is-collapsed');
    elements.sheetHandle.setAttribute('aria-expanded', elements.console.classList.contains('is-collapsed') ? 'false' : 'true');
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audioContext?.suspend?.().catch(() => {});
    else if (!soundMuted) audioContext?.resume?.().catch(() => {});
  });
}

function updateSoundButton() {
  elements.soundBtn.textContent = soundMuted ? '🔇' : '🔊';
  elements.soundBtn.setAttribute('aria-label', translate(soundMuted ? 'muted' : 'unmuted'));
  elements.soundBtn.setAttribute('aria-pressed', soundMuted ? 'false' : 'true');
}

/* ---------------- 主题 / 语言 ---------------- */
function applyTheme() {
  applyEnvironment();
  rebuildProtractor();
  elements.themeBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
  elements.themeBtn.setAttribute('aria-label', translate('theme'));
}

function applyLanguage() {
  document.title = translate('doc');
  elements.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
  lastBadgeDegrees = null;
  updatePlayButton();
  updateEnergyNote();
  updateSoundButton();
  updateReadouts(true);
}

/* ---------------- 尺寸与主循环 ---------------- */
function resize() {
  const { clientWidth, clientHeight } = elements.canvas.parentElement;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / Math.max(clientHeight, 1);
  /* 竖屏视角更广，摆架完整入镜 */
  camera.fov = camera.aspect < 0.85 ? 58 : 46;
  camera.updateProjectionMatrix();
}

let lastFrame = performance.now();

function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;

  if (state.running && !state.draggingBob && !state.holding) {
    step(dt * state.speed);
    pushTrailPoint();
  }
  if (orbit.auto) orbit.theta += dt * 0.22;

  swingGroup.rotation.z = state.theta;
  updateCamera();
  updateReadouts();
  renderer.render(scene, camera);
}

/* ---------------- 启动 ---------------- */
function init() {
  if (!setupRenderer()) return;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0d1117, 12, 30);
  camera = new THREE.PerspectiveCamera(46, 1, 0.1, 60);

  createEnvironment();
  createLights();
  createStand();
  createPendulum();
  createTrail();

  ghostGroup.visible = true;
  ghostGroup.rotation.z = state.releaseAngle;

  const binding = window.cool?.bindI18n?.(I18N, {
    onChange: ({ lang: nextLang, theme: nextTheme, t }) => {
      lang = nextLang;
      theme = nextTheme;
      if (t) translate = t;
      applyTheme();
      applyLanguage();
    },
  });
  if (binding?.t) translate = binding.t;
  lang = window.cool?.preferences?.lang || lang;
  theme = window.cool?.preferences?.theme || theme;

  bindControls();
  [elements.length, elements.mass, elements.angle].forEach(updateRangeFill);
  /* 手机上默认收起参数抽屉，让摆架先亮相 */
  if (window.matchMedia('(max-width: 880px)').matches) {
    elements.console.classList.add('is-collapsed');
    elements.sheetHandle.setAttribute('aria-expanded', 'false');
  }
  applyTheme();
  applyLanguage();
  goToView('stage', { silent: true });
  resize();
  window.addEventListener('resize', resize);

  elements.loading.hidden = true;

  /* 35 秒还没松手过 → 轻提示 */
  nudgeTimer = window.setTimeout(() => {
    if (!hasReleased) showToast(translate('nudge'));
  }, 35000);

  requestAnimationFrame((now) => { lastFrame = now; requestAnimationFrame(frame); });
}

init();




