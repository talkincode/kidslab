import * as THREE from './vendor/three.module.min.js';

const I18N = {
  zh: {
    doc: '光学实验室 · KidsLab',
    back: '返回平台',
    title: '光学实验室',
    subtitle: '把看不见的成像规律，变成一条条看得见的光线',
    loading: '正在点亮光具座…',
    noglTitle: '这台设备暂时不能显示 3D 光路',
    noglText: '请换用支持 WebGL 的现代浏览器。',
    sceneHint: '拖动环视 · 滚轮或双指缩放',
    viewPath: '光路',
    viewTop: '俯视',
    viewLens: '看透镜',
    autoOrbit: '自动环绕',
    parameters: '实验参数',
    presetClear: '清晰倒像',
    presetProjector: '放大投影',
    presetMagnifier: '放大镜',
    scaleNote: '现实比例：1.5 m 光具座 · Ø 5 cm 透镜 · 12 × 12 cm 光屏（微雾用于显现光路）',
    objectDistance: '物距 u',
    focalLength: '焦距 f',
    screenDistance: '屏距 s',
    objectHeight: '物高 h',
    rayCount: '示踪光束',
    hazeTitle: '微雾显光',
    hazeHint: '模拟实验箱中的少量散射介质',
    hazeOn: '关闭微雾显光',
    hazeOff: '开启微雾显光',
    autoFocus: '让屏幕自动对焦',
    autoFocusHint: '把屏幕移到理论像距',
    imageDistance: '像距 v',
    magnification: '放大率 m',
    imageType: '像的性质',
    screenError: '屏幕偏差',
    real: '实像',
    virtual: '虚像',
    parallel: '平行光',
    invertedSmall: '倒立 · 缩小',
    invertedSame: '倒立 · 等大',
    invertedLarge: '倒立 · 放大',
    uprightLarge: '正立 · 放大',
    atInfinity: '像在无穷远',
    focused: '屏幕接住了清晰倒像',
    nearFocus: '快清晰了，再微调屏幕',
    blurred: '屏幕不在像面上，画面模糊',
    virtualStatus: '这是虚像，右侧屏幕接不到',
    parallelStatus: '出射光近似平行，有限屏幕无法对焦',
    screenOut: '理论像距超出光具座范围',
    focusSuccess: '对焦成功！光线在屏幕处会聚。',
    noRealFocus: '当前是虚像，屏幕无法接住它。',
    focusOut: '像面太远，已把屏幕移到光具座最远端。',
    objectLabel: '发光物',
    lensLabel: '凸透镜 · Ø 5 cm',
    screenLabel: '光屏 · 12 cm',
    virtualImage: '虚像',
    noImageOnScreen: '没有实像',
    muted: '打开声音',
    unmuted: '关闭声音',
    theme: '切换主题',
    collapse: '收起参数面板',
    expand: '展开参数面板',
    viewGroup: '观察视角',
  },
  en: {
    doc: 'Optics Lab · KidsLab',
    back: 'Back',
    title: 'Optics Lab',
    subtitle: 'Turn invisible image formation into visible rays',
    loading: 'Powering the optical bench…',
    noglTitle: 'This device cannot display the 3D ray model',
    noglText: 'Please use a modern browser with WebGL support.',
    sceneHint: 'Drag to orbit · wheel or pinch to zoom',
    viewPath: 'Ray path',
    viewTop: 'Top',
    viewLens: 'Lens',
    autoOrbit: 'Auto orbit',
    parameters: 'Parameters',
    presetClear: 'Sharp image',
    presetProjector: 'Projector',
    presetMagnifier: 'Magnifier',
    scaleNote: 'True scale: 1.5 m bench · Ø 5 cm lens · 12 × 12 cm screen (light haze reveals the path)',
    objectDistance: 'Object u',
    focalLength: 'Focal f',
    screenDistance: 'Screen s',
    objectHeight: 'Height h',
    rayCount: 'Tracer beams',
    hazeTitle: 'Haze tracer',
    hazeHint: 'Simulates a small amount of scattering medium',
    hazeOn: 'Turn haze tracer off',
    hazeOff: 'Turn haze tracer on',
    autoFocus: 'Move screen into focus',
    autoFocusHint: 'Set the screen to the predicted image distance',
    imageDistance: 'Image v',
    magnification: 'Magnification m',
    imageType: 'Image type',
    screenError: 'Screen error',
    real: 'REAL IMAGE',
    virtual: 'VIRTUAL IMAGE',
    parallel: 'PARALLEL RAYS',
    invertedSmall: 'Inverted · smaller',
    invertedSame: 'Inverted · same size',
    invertedLarge: 'Inverted · larger',
    uprightLarge: 'Upright · larger',
    atInfinity: 'Image at infinity',
    focused: 'The screen catches a sharp inverted image',
    nearFocus: 'Almost sharp — fine-tune the screen',
    blurred: 'The screen is away from the image plane',
    virtualStatus: 'This is virtual; the screen cannot catch it',
    parallelStatus: 'Emerging rays are parallel; a finite screen cannot focus them',
    screenOut: 'The predicted image is beyond the bench',
    focusSuccess: 'Focused! The rays converge at the screen.',
    noRealFocus: 'This is a virtual image, so the screen cannot catch it.',
    focusOut: 'The image is too far away; the screen moved to the bench limit.',
    objectLabel: 'OBJECT',
    lensLabel: 'LENS · Ø 5 cm',
    screenLabel: 'SCREEN · 12 cm',
    virtualImage: 'VIRTUAL IMAGE',
    noImageOnScreen: 'NO REAL IMAGE',
    muted: 'Turn sound on',
    unmuted: 'Mute sound',
    theme: 'Toggle theme',
    collapse: 'Collapse parameter panel',
    expand: 'Expand parameter panel',
    viewGroup: 'Observation views',
  },
};

const SCALE = 0.1;
const X_MIN = -6.5;
const X_MAX = 8.5;
const state = {
  objectDistance: 40,
  focalLength: 12,
  screenDistance: 17,
  objectHeight: 5,
  rayCount: 9,
  haze: true,
};

const elements = {
  canvas: document.getElementById('scene'),
  loading: document.getElementById('loading'),
  nogl: document.getElementById('nogl'),
  modeBadge: document.getElementById('modeBadge'),
  toast: document.getElementById('focusToast'),
  console: document.getElementById('console'),
  sheetHandle: document.getElementById('sheetHandle'),
  soundBtn: document.getElementById('soundBtn'),
  themeBtn: document.getElementById('themeBtn'),
  langBtn: document.getElementById('langBtn'),
  focusBtn: document.getElementById('focusBtn'),
  autoOrbitBtn: document.getElementById('autoOrbitBtn'),
  hazeBtn: document.getElementById('hazeBtn'),
  imageDistance: document.getElementById('imageDistanceValue'),
  magnification: document.getElementById('magnificationValue'),
  imageType: document.getElementById('imageTypeValue'),
  screenError: document.getElementById('screenErrorValue'),
  focusStatus: document.getElementById('focusStatus'),
};

const inputIds = ['objectDistance', 'focalLength', 'screenDistance', 'objectHeight', 'rayCount'];
for (const id of inputIds) {
  elements[id] = document.getElementById(id);
  elements[`${id}Value`] = document.getElementById(`${id}Value`);
}

let lang = window.cool?.preferences?.lang || 'zh';
let theme = window.cool?.preferences?.theme || 'dark';
let translate = (key) => I18N[lang]?.[key] ?? I18N.zh[key] ?? key;
let renderer;
let scene;
let camera;
let objectRig;
let lensRig;
let screenRig;
let imageRig;
let raysRig;
let virtualRig;
let focusRings;
let screenTexture;
let screenMaterial;
let benchMaterial;
let tableMaterial;
let floorMaterial;
let lensMaterial;
let lensMesh;
let objectMaterial;
let imageMaterial;
let labelSprites = {};
let lastFocusState = false;
let hasInteracted = false;
let toastTimer = 0;
let frameHandle = 0;
let lastFrameTime = performance.now();

const orbit = {
  theta: 1.05,
  phi: 1.24,
  distance: 11.5,
  targetTheta: 1.05,
  targetPhi: 1.24,
  targetDistance: 11.5,
  auto: false,
  target: new THREE.Vector3(-1, -0.55, 0),
};

const pointers = new Map();
let dragPointer = null;
let lastPointer = { x: 0, y: 0 };
let pinchDistance = 0;

const storage = window.cool?.storage || {
  get: (key, fallback = null) => {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  },
};
const SOUND_KEY = 'kidslab.optics-lab.sound';
let soundMuted = storage.get(SOUND_KEY, 'on') === 'off';
let audioContext = null;
let audioAvailable = true;

function tone(frequency, duration = 0.1, type = 'sine', gain = 0.045, delay = 0) {
  if (soundMuted || !audioAvailable) return;
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) {
      audioAvailable = false;
      return;
    }
    audioContext ||= new AudioCtor();
    if (audioContext.state === 'suspended') audioContext.resume();
    const start = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(gain, start);
    envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(envelope).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.025);
  } catch {
    audioAvailable = false;
  }
}

const sound = {
  adjust: () => tone(520, 0.055, 'triangle', 0.03),
  select: () => [440, 590].forEach((frequency, index) => tone(frequency, 0.075, 'sine', 0.035, index * 0.045)),
  success: () => [523, 659, 784, 1047].forEach((frequency, index) => tone(frequency, 0.14, 'triangle', 0.055, index * 0.075)),
  error: () => [180, 135].forEach((frequency, index) => tone(frequency, 0.14, 'sawtooth', 0.025, index * 0.07)),
};

function updateSoundButton() {
  elements.soundBtn.textContent = soundMuted ? '🔇' : '🔊';
  elements.soundBtn.setAttribute('aria-pressed', String(soundMuted));
  elements.soundBtn.setAttribute('aria-label', translate(soundMuted ? 'muted' : 'unmuted'));
  elements.soundBtn.title = translate(soundMuted ? 'muted' : 'unmuted');
}

function updateHazeButton() {
  elements.hazeBtn.classList.toggle('is-active', state.haze);
  elements.hazeBtn.setAttribute('aria-pressed', String(state.haze));
  elements.hazeBtn.setAttribute('aria-label', translate(state.haze ? 'hazeOn' : 'hazeOff'));
}

function calculation() {
  const { objectDistance: u, focalLength: f } = state;
  const delta = u - f;
  if (Math.abs(delta) < 0.001) return { mode: 'parallel', v: Infinity, m: -Infinity };
  const v = (f * u) / delta;
  return { mode: v > 0 ? 'real' : 'virtual', v, m: -v / u };
}

function formatNumber(value, digits = 1) {
  return Number.isFinite(value) ? value.toFixed(digits) : '∞';
}

function updateRangeFill(input) {
  const ratio = (Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min));
  input.style.setProperty('--fill', `${Math.max(0, Math.min(1, ratio)) * 100}%`);
}

function markInteraction(stage = 'experimenting') {
  if (!hasInteracted) {
    hasInteracted = true;
    window.cool?.stage?.(stage);
  }
}

function imageTypeText(model) {
  if (model.mode === 'parallel') return translate('atInfinity');
  if (model.mode === 'virtual') return translate('uprightLarge');
  const size = Math.abs(model.m);
  if (Math.abs(size - 1) < 0.08) return translate('invertedSame');
  return translate(size < 1 ? 'invertedSmall' : 'invertedLarge');
}

function screenState(model) {
  if (model.mode === 'virtual') return { key: 'virtualStatus', error: null, focused: false };
  if (model.mode === 'parallel') return { key: 'parallelStatus', error: null, focused: false };
  if (model.v > 80 || model.v < 8) return { key: 'screenOut', error: Math.abs(state.screenDistance - model.v), focused: false };
  const error = Math.abs(state.screenDistance - model.v);
  if (error <= 1.5) return { key: 'focused', error, focused: true };
  if (error <= 8) return { key: 'nearFocus', error, focused: false };
  return { key: 'blurred', error, focused: false };
}

function showToast(key, kind = '') {
  clearTimeout(toastTimer);
  elements.toast.textContent = translate(key);
  elements.toast.className = `focus-toast${kind ? ` is-${kind}` : ''}`;
  elements.toast.hidden = false;
  toastTimer = window.setTimeout(() => { elements.toast.hidden = true; }, 2300);
}

function updateReadouts({ announceFocus = false } = {}) {
  const model = calculation();
  const status = screenState(model);
  elements.objectDistanceValue.textContent = `${formatNumber(state.objectDistance)} cm`;
  elements.focalLengthValue.textContent = `${formatNumber(state.focalLength)} cm`;
  elements.screenDistanceValue.textContent = `${formatNumber(state.screenDistance)} cm`;
  elements.objectHeightValue.textContent = `${formatNumber(state.objectHeight)} cm`;
  elements.rayCountValue.textContent = String(state.rayCount);
  elements.imageDistance.textContent = model.mode === 'parallel' ? '∞' : `${formatNumber(model.v).replace('-', '−')} cm`;
  elements.magnification.textContent = model.mode === 'parallel'
    ? '∞'
    : `${model.m < 0 ? '−' : '+'}${Math.abs(model.m).toFixed(2)}×`;
  elements.imageType.textContent = imageTypeText(model);
  elements.screenError.textContent = status.error === null ? '—' : `${formatNumber(status.error)} cm`;
  elements.focusStatus.textContent = translate(status.key);
  elements.modeBadge.textContent = translate(model.mode);
  elements.modeBadge.dataset.mode = model.mode;

  if (announceFocus && status.focused && !lastFocusState) {
    sound.success();
    showToast('focusSuccess', 'success');
    window.cool?.complete?.();
    window.cool?.track?.('focused_image', {
      objectDistance: state.objectDistance,
      focalLength: state.focalLength,
      screenDistance: state.screenDistance,
    });
  }
  lastFocusState = status.focused;
  return { model, status };
}

function createArrow(material) {
  const group = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 1, 18), material);
  shaft.position.y = 0.5;
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.48, 24), material);
  head.position.y = 1.18;
  group.add(shaft, head);
  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return group;
}

function makeLabelSprite(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(3.2, 0.8, 1);
  sprite.userData = { canvas, texture, text };
  drawLabelSprite(sprite, text);
  return sprite;
}

function drawLabelSprite(sprite, text) {
  const { canvas, texture } = sprite.userData;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = theme === 'dark' ? 'rgba(7,16,15,.78)' : 'rgba(247,250,246,.88)';
  context.strokeStyle = theme === 'dark' ? 'rgba(119,242,221,.5)' : 'rgba(8,126,117,.5)';
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(4, 12, 504, 104, 22);
  context.fill();
  context.stroke();
  context.fillStyle = theme === 'dark' ? '#f1f7f6' : '#10211f';
  context.font = '700 42px "Avenir Next", sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 256, 65);
  texture.needsUpdate = true;
}

function createBench() {
  const group = new THREE.Group();
  floorMaterial = new THREE.MeshStandardMaterial({ color: 0x0d1412, roughness: 0.92, metalness: 0 });
  tableMaterial = new THREE.MeshStandardMaterial({ color: 0x172622, roughness: 0.72, metalness: 0.3 });
  benchMaterial = new THREE.MeshStandardMaterial({ color: 0x82928e, roughness: 0.34, metalness: 0.78 });
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x18211f, roughness: 0.28, metalness: 0.72 });
  const accentMaterial = new THREE.MeshStandardMaterial({ color: 0xffca67, roughness: 0.38, metalness: 0.54, emissive: 0x2a1600 });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(1, -1.55, 0);
  floor.receiveShadow = true;
  group.add(floor);

  const table = new THREE.Mesh(new THREE.BoxGeometry(16, 0.24, 1.8), tableMaterial);
  table.position.set(1, -1.42, 0);
  table.receiveShadow = true;
  group.add(table);

  for (const z of [-0.18, 0.18]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.08, 0.07), benchMaterial);
    rail.position.set(1, -1.15, z);
    rail.castShadow = true;
    group.add(rail);
  }

  const tickGeometry = new THREE.BoxGeometry(0.012, 0.012, 0.24);
  const ticks = new THREE.InstancedMesh(tickGeometry, edgeMaterial, 151);
  const dummy = new THREE.Object3D();
  for (let index = 0; index < 151; index += 1) {
    const x = X_MIN + index * 0.1;
    const major = index % 10 === 0;
    dummy.position.set(x, -1.085, 0);
    dummy.scale.set(major ? 2.2 : 1, 1, major ? 1.5 : 1);
    dummy.updateMatrix();
    ticks.setMatrixAt(index, dummy.matrix);
  }
  ticks.instanceMatrix.needsUpdate = true;
  group.add(ticks);

  const axisGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(X_MIN, 0, 0),
    new THREE.Vector3(X_MAX, 0, 0),
  ]);
  const axis = new THREE.Line(
    axisGeometry,
    new THREE.LineDashedMaterial({ color: 0xffca67, dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0.45 }),
  );
  axis.computeLineDistances();
  group.add(axis);

  for (const x of [-6.72, 8.72]) {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.25, 0.72), accentMaterial);
    cap.position.set(x, -1.15, 0);
    cap.castShadow = true;
    group.add(cap);
  }
  scene.add(group);
}

function createInstrumentRigs() {
  objectMaterial = new THREE.MeshStandardMaterial({
    color: 0x67f5df,
    emissive: 0x126b61,
    emissiveIntensity: 1.1,
    roughness: 0.24,
    metalness: 0.08,
  });
  imageMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa64d,
    emissive: 0x6f2500,
    emissiveIntensity: 0.72,
    transparent: true,
    opacity: 0.7,
    roughness: 0.3,
  });
  const clampMaterial = new THREE.MeshStandardMaterial({ color: 0xb8c2bf, metalness: 0.82, roughness: 0.24 });

  function addClampKnob(group) {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.1, 16), clampMaterial);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(0.08, -1.02, 0.36);
    group.add(knob);
  }

  objectRig = new THREE.Group();
  const objectArrow = createArrow(objectMaterial);
  objectArrow.name = 'arrow';
  const objectPost = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.035, 0.96, 18),
    new THREE.MeshStandardMaterial({ color: 0x566864, metalness: 0.74, roughness: 0.34 }),
  );
  objectPost.position.y = -0.55;
  const objectCarriage = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.12, 0.62),
    new THREE.MeshStandardMaterial({ color: 0x23312e, metalness: 0.6, roughness: 0.38 }),
  );
  objectCarriage.position.y = -1.06;
  objectRig.add(objectArrow, objectPost, objectCarriage);
  addClampKnob(objectRig);
  scene.add(objectRig);

  lensRig = new THREE.Group();
  const profile = [];
  const aperture = 0.25;
  const thickness = 0.035;
  for (let index = 0; index <= 20; index += 1) {
    const radius = aperture * (index / 20);
    profile.push(new THREE.Vector2(radius, thickness * (1 - (radius / aperture) ** 2)));
  }
  for (let index = 20; index >= 0; index -= 1) {
    const radius = aperture * (index / 20);
    profile.push(new THREE.Vector2(radius, -thickness * (1 - (radius / aperture) ** 2)));
  }
  lensMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8eeeff,
    transparent: true,
    opacity: 0.36,
    roughness: 0.12,
    metalness: 0,
    clearcoat: 1,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  lensMesh = new THREE.Mesh(new THREE.LatheGeometry(profile, 32), lensMaterial);
  lensMesh.rotation.z = Math.PI / 2;
  lensMesh.castShadow = true;
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(aperture + 0.025, 0.018, 12, 48),
    new THREE.MeshStandardMaterial({ color: 0x93a5a0, metalness: 0.86, roughness: 0.22 }),
  );
  rim.rotation.y = Math.PI / 2;
  const lensPost = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.032, 0.72, 18),
    new THREE.MeshStandardMaterial({ color: 0x647773, metalness: 0.78, roughness: 0.3 }),
  );
  lensPost.position.y = -0.64;
  const lensCarriage = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.12, 0.66),
    new THREE.MeshStandardMaterial({ color: 0x263633, metalness: 0.64, roughness: 0.35 }),
  );
  lensCarriage.position.y = -1.06;
  lensRig.add(lensMesh, rim, lensPost, lensCarriage);
  addClampKnob(lensRig);
  scene.add(lensRig);

  screenTexture = new THREE.CanvasTexture(Object.assign(document.createElement('canvas'), { width: 512, height: 512 }));
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  screenMaterial = new THREE.MeshStandardMaterial({
    map: screenTexture,
    emissiveMap: screenTexture,
    emissive: 0xffffff,
    emissiveIntensity: 0.22,
    roughness: 0.72,
    side: THREE.DoubleSide,
  });
  screenRig = new THREE.Group();
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), screenMaterial);
  screen.rotation.y = Math.PI / 2;
  screen.name = 'screen';
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x273431, metalness: 0.72, roughness: 0.3 });
  const frame = new THREE.Group();
  for (const y of [-0.625, 0.625]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.05, 1.3), frameMaterial);
    bar.position.set(0.03, y, 0);
    frame.add(bar);
  }
  for (const z of [-0.625, 0.625]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.055, 1.2, 0.05), frameMaterial);
    bar.position.set(0.03, 0, z);
    frame.add(bar);
  }
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.032, 0.4, 18),
    new THREE.MeshStandardMaterial({ color: 0x657975, metalness: 0.78, roughness: 0.3 }),
  );
  post.position.y = -0.82;
  const carriage = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.12, 0.66),
    new THREE.MeshStandardMaterial({ color: 0x263633, metalness: 0.64, roughness: 0.35 }),
  );
  carriage.position.y = -1.06;
  screenRig.add(frame, screen, post, carriage);
  addClampKnob(screenRig);
  scene.add(screenRig);

  imageRig = createArrow(imageMaterial);
  imageRig.visible = false;
  scene.add(imageRig);

  raysRig = new THREE.Group();
  virtualRig = new THREE.Group();
  scene.add(raysRig, virtualRig);

  focusRings = new THREE.Group();
  for (let index = 0; index < 3; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.065 + index * 0.04, 0.007, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0x71e89e, transparent: true, opacity: 0.45 - index * 0.1 }),
    );
    ring.rotation.y = Math.PI / 2;
    ring.userData.phase = index / 3;
    focusRings.add(ring);
  }
  focusRings.visible = false;
  scene.add(focusRings);

  labelSprites.object = makeLabelSprite(translate('objectLabel'));
  labelSprites.lens = makeLabelSprite(translate('lensLabel'));
  labelSprites.screen = makeLabelSprite(translate('screenLabel'));
  scene.add(labelSprites.object, labelSprites.lens, labelSprites.screen);
}

function clearGroup(group) {
  while (group.children.length) {
    const child = group.children.pop();
    child.geometry?.dispose();
    child.material?.dispose();
  }
}

function addLineSegments(group, positions, color, opacity = 0.86, dashed = false) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = dashed
    ? new THREE.LineDashedMaterial({ color, dashSize: 0.16, gapSize: 0.1, transparent: true, opacity })
    : new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const lines = new THREE.LineSegments(geometry, material);
  if (dashed) lines.computeLineDistances();
  group.add(lines);
}

function addBeamSegment(start, end, intensity = 1) {
  const delta = end.clone().sub(start);
  const length = delta.length();
  if (length < 0.001) return;
  const dark = theme === 'dark';
  const direction = delta.normalize();
  const midpoint = start.clone().add(end).multiplyScalar(0.5);
  const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  function beam(radius, color, opacity, blending) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, length, 6, 1, true),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        blending,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    );
    mesh.position.copy(midpoint);
    mesh.quaternion.copy(rotation);
    mesh.renderOrder = 3;
    raysRig.add(mesh);
  }

  if (state.haze) {
    beam(
      0.009,
      dark ? 0xffaa4d : 0xd88a34,
      (dark ? 0.045 : 0.035) * intensity,
      dark ? THREE.AdditiveBlending : THREE.NormalBlending,
    );
  }
  beam(
    0.002,
    dark ? 0xffdda1 : 0xa85a13,
    (state.haze ? (dark ? 0.42 : 0.36) : (dark ? 0.035 : 0.06)) * intensity,
    dark ? THREE.AdditiveBlending : THREE.NormalBlending,
  );
}

function updateRays(model) {
  clearGroup(raysRig);
  clearGroup(virtualRig);
  const virtualPositions = [];
  const aperture = 0.22;
  const sourceHeights = [0.18, 0.56, 1];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < state.rayCount; index += 1) {
    const band = index % sourceHeights.length;
    const bandIndex = Math.floor(index / sourceHeights.length);
    const raysInBand = Math.ceil((state.rayCount - band) / sourceHeights.length);
    const fraction = (bandIndex + 0.5) / Math.max(1, raysInBand);
    const angle = (bandIndex + band * 0.41) * goldenAngle;
    const radius = aperture * 0.94 * Math.sqrt(fraction);
    const origin = new THREE.Vector3(
      -state.objectDistance * SCALE,
      state.objectHeight * sourceHeights[band] * SCALE,
      0,
    );
    const lensPoint = new THREE.Vector3(
      0,
      Math.sin(angle) * radius,
      Math.cos(angle) * radius,
    );
    const intensity = 1 - (radius / aperture) * 0.28;
    addBeamSegment(origin, lensPoint, intensity);

    let direction;
    if (model.mode === 'parallel') {
      direction = new THREE.Vector3(
        1,
        -(state.objectHeight * sourceHeights[band]) / state.objectDistance,
        0,
      ).normalize();
    } else {
      const imagePoint = new THREE.Vector3(
        model.v * SCALE,
        -state.objectHeight * sourceHeights[band] * model.v / state.objectDistance * SCALE,
        0,
      );
      direction = model.mode === 'real'
        ? imagePoint.clone().sub(lensPoint).normalize()
        : lensPoint.clone().sub(imagePoint).normalize();
      if (model.mode === 'virtual') {
        // 反向延长虚线收敛于虚像点；虚像太远时截断在导轨左端。
        const dashEnd = imagePoint.x < X_MIN
          ? lensPoint.clone().lerp(imagePoint, (X_MIN - lensPoint.x) / (imagePoint.x - lensPoint.x))
          : imagePoint;
        virtualPositions.push(
          lensPoint.x, lensPoint.y, lensPoint.z,
          dashEnd.x, dashEnd.y, dashEnd.z,
        );
      }
    }
    const end = clipOutgoingRay(lensPoint, direction);
    addBeamSegment(lensPoint, end, intensity * 0.88);
  }

  if (virtualPositions.length) {
    addLineSegments(virtualRig, virtualPositions, theme === 'dark' ? 0xffbd82 : 0xb66a31, 0.34, true);
  }
}

function clipOutgoingRay(startPoint, direction) {
  const dirX = Math.max(0.001, direction.x);
  let travel = (X_MAX - startPoint.x) / dirX;
  const screenX = state.screenDistance * SCALE - 0.012;
  const toScreen = (screenX - startPoint.x) / dirX;
  if (toScreen > 0 && toScreen < travel) {
    const hitY = startPoint.y + direction.y * toScreen;
    const hitZ = startPoint.z + direction.z * toScreen;
    // 只有真正落在 12×12 cm 屏面内才被光屏挡住，否则从屏旁掠过。
    if (Math.abs(hitY) <= 0.62 && Math.abs(hitZ) <= 0.62) travel = toScreen;
  }
  if (direction.y < -0.0001) {
    const toTable = (-1.28 - startPoint.y) / direction.y;
    if (toTable > 0 && toTable < travel) travel = toTable;
  }
  return startPoint.clone().add(direction.clone().multiplyScalar(travel));
}

function drawScreen(model, status) {
  const canvas = screenTexture.image;
  const context = canvas.getContext('2d');
  const dark = theme === 'dark';
  const background = context.createRadialGradient(256, 236, 20, 256, 256, 330);
  background.addColorStop(0, dark ? '#eaf4e9' : '#ffffff');
  background.addColorStop(1, dark ? '#aabbb1' : '#ced9d1');
  context.fillStyle = background;
  context.fillRect(0, 0, 512, 512);

  context.strokeStyle = dark ? 'rgba(22,48,43,.15)' : 'rgba(16,33,31,.12)';
  context.lineWidth = 1;
  for (let index = 32; index < 512; index += 32) {
    context.beginPath();
    context.moveTo(index, 0);
    context.lineTo(index, 512);
    context.stroke();
    context.beginPath();
    context.moveTo(0, index);
    context.lineTo(512, index);
    context.stroke();
  }
  context.strokeStyle = 'rgba(8,126,117,.38)';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(256, 0);
  context.lineTo(256, 512);
  context.moveTo(0, 256);
  context.lineTo(512, 256);
  context.stroke();

  if (model.mode !== 'real') {
    context.fillStyle = '#17322d';
    context.textAlign = 'center';
    context.font = '800 26px "Avenir Next", sans-serif';
    context.fillText(translate('noImageOnScreen'), 256, 250);
    context.font = '700 70px "Avenir Next", sans-serif';
    context.fillStyle = 'rgba(8,126,117,.32)';
    context.fillText('∥', 256, 340);
    screenTexture.needsUpdate = true;
    return;
  }

  const error = status.error || 0;
  // 物尖主光线过透镜中心后沿直线传播，在距透镜 s 处的高度是 -h·s/u：
  // 透镜后的（模糊）像永远倒立，尺寸随屏距按 s/u 变化，对焦时恰为 h·v/u。
  const imageHeightCm = state.objectHeight * state.screenDistance / state.objectDistance;
  const pixelsPerCm = 42;
  const arrowHeight = Math.max(28, Math.min(246, imageHeightCm * pixelsPerCm));
  const blurRadiusCm = model.v > 0 ? 2.5 * error / model.v : 6;
  const blur = Math.min(30, blurRadiusCm * pixelsPerCm * 0.72);
  const alpha = Math.max(0.18, Math.exp(-blurRadiusCm / 2.4));

  function arrowPath(offsetX = 0, offsetY = 0) {
    context.beginPath();
    const baseY = 256 + offsetY;
    const tipY = baseY + arrowHeight;
    context.moveTo(256 + offsetX, baseY);
    context.lineTo(256 + offsetX, tipY);
    context.moveTo(256 + offsetX, tipY);
    context.lineTo(236 + offsetX, tipY - 30);
    context.moveTo(256 + offsetX, tipY);
    context.lineTo(276 + offsetX, tipY - 30);
  }

  context.save();
  context.globalAlpha = alpha;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  if ('filter' in context) context.filter = `blur(${blur}px)`;
  context.strokeStyle = '#f47a39';
  context.lineWidth = 16 + Math.min(18, blur);
  arrowPath();
  context.stroke();
  context.restore();

  if (error <= 1.5) {
    context.strokeStyle = '#e84f2d';
    context.lineWidth = 10;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    arrowPath();
    context.stroke();
  }
  screenTexture.needsUpdate = true;
}

function renderFromModel(options = {}) {
  if (!scene) return;
  const { model, status } = updateReadouts(options);
  const objectX = -state.objectDistance * SCALE;
  const screenX = state.screenDistance * SCALE;
  objectRig.position.x = objectX;
  objectRig.getObjectByName('arrow').scale.setScalar(state.objectHeight * SCALE / 1.42);
  lensMesh.scale.x = THREE.MathUtils.mapLinear(state.focalLength, 8, 20, 1.35, 0.7);
  screenRig.position.x = screenX;
  updateLabels();
  updateLabelLayout(objectX, screenX);

  imageRig.visible = model.mode === 'virtual' && Math.abs(model.v * SCALE) <= 9;
  if (imageRig.visible) {
    imageRig.position.set(model.v * SCALE, 0, 0);
    const visualHeight = Math.min(2.5, Math.max(0.12, Math.abs(state.objectHeight * model.m * SCALE)));
    const scale = visualHeight / 1.42;
    imageRig.scale.set(scale, model.m < 0 ? -scale : scale, scale);
    imageMaterial.opacity = model.mode === 'virtual' ? 0.38 : 0.72;
  }

  focusRings.visible = status.focused;
  focusRings.position.set(screenX - 0.05, 0, 0);
  updateRays(model);
  drawScreen(model, status);
  requestRender();
}

function updateLabelLayout(objectX = objectRig?.position.x || 0, screenX = screenRig?.position.x || 0) {
  if (!labelSprites.object) return;
  const compact = elements.canvas.clientWidth < 620;
  const scale = compact ? [1.2, 0.31] : [1.75, 0.44];
  for (const sprite of Object.values(labelSprites)) sprite.scale.set(scale[0], scale[1], 1);
  labelSprites.object.position.set(objectX, compact ? 0.85 : 0.9, 0);
  labelSprites.lens.position.set(0, compact ? 0.72 : 0.76, 0);
  labelSprites.screen.position.set(screenX, compact ? 1.08 : 1.15, 0);
}

function updateLabels() {
  drawLabelSprite(labelSprites.object, `${translate('objectLabel')} · h ${formatNumber(state.objectHeight)} cm`);
  drawLabelSprite(labelSprites.lens, `${translate('lensLabel')} · f ${formatNumber(state.focalLength)} cm`);
  drawLabelSprite(labelSprites.screen, `${translate('screenLabel')} · s ${formatNumber(state.screenDistance)} cm`);
}

function updateTheme() {
  if (!renderer) return;
  const dark = theme === 'dark';
  renderer.setClearColor(dark ? 0x07100f : 0xe9f0eb, 1);
  renderer.toneMappingExposure = dark ? 1.08 : 0.92;
  floorMaterial.color.setHex(dark ? 0x0d1412 : 0xd6ddd7);
  tableMaterial.color.setHex(dark ? 0x172622 : 0xaab8ae);
  benchMaterial.color.setHex(dark ? 0x82928e : 0x67736f);
  lensMaterial.color.setHex(dark ? 0x8eeeff : 0x45b9c9);
  objectMaterial.emissiveIntensity = dark ? 1.1 : 0.48;
  updateLabels();
  renderFromModel();
}

function applyLanguage() {
  lang = window.cool?.preferences?.lang || lang;
  translate = (key) => I18N[lang]?.[key] ?? I18N.zh[key] ?? key;
  document.title = translate('doc');
  elements.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
  elements.themeBtn.setAttribute('aria-label', translate('theme'));
  elements.sheetHandle.setAttribute(
    'aria-label',
    translate(elements.console.classList.contains('is-collapsed') ? 'expand' : 'collapse'),
  );
  document.querySelector('.view-dock').setAttribute('aria-label', translate('viewGroup'));
  updateSoundButton();
  updateHazeButton();
  if (scene) {
    updateLabels();
    renderFromModel();
  }
}

const i18n = window.cool?.bindI18n?.(I18N, {
  onChange: ({ kind, lang: nextLang, theme: nextTheme, t }) => {
    lang = nextLang;
    theme = nextTheme;
    translate = t;
    if (kind === 'theme') updateTheme();
    applyLanguage();
  },
});
if (i18n) translate = i18n.t;

function setupRenderer() {
  try {
    renderer = new THREE.WebGLRenderer({ canvas: elements.canvas, antialias: true, alpha: false });
  } catch {
    elements.loading.hidden = true;
    elements.nogl.hidden = false;
    return false;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return true;
}

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);

  const hemisphere = new THREE.HemisphereLight(0xdffdf6, 0x17302b, 1.45);
  scene.add(hemisphere);
  const key = new THREE.DirectionalLight(0xfff2d5, 3.1);
  key.position.set(-4, 11, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -13;
  key.shadow.camera.right = 13;
  key.shadow.camera.top = 9;
  key.shadow.camera.bottom = -7;
  key.shadow.bias = -0.0004;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x65d9e6, 1.05);
  fill.position.set(8, 4, -7);
  scene.add(fill);

  createBench();
  createInstrumentRigs();
  updateTheme();
  resize();
  renderFromModel();
  requestRender();
  window.requestAnimationFrame(() => { elements.loading.hidden = true; });
}

function resize() {
  if (!renderer || !camera) return;
  const rect = elements.canvas.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  orbit.target.y = width < 620 ? -1.25 : -0.55;
  updateLabelLayout();
  requestRender();
}

function setCameraFromOrbit() {
  const sinPhi = Math.sin(orbit.phi);
  camera.position.set(
    orbit.target.x + orbit.distance * sinPhi * Math.cos(orbit.theta),
    orbit.target.y + orbit.distance * Math.cos(orbit.phi),
    orbit.target.z + orbit.distance * sinPhi * Math.sin(orbit.theta),
  );
  camera.lookAt(orbit.target);
}

function setView(name) {
  const views = {
    path: { theta: 1.05, phi: 1.24, distance: 11.5 },
    top: { theta: Math.PI / 2, phi: 0.12, distance: 12.5 },
    lens: { theta: 0.05, phi: 1.28, distance: 5.5 },
  };
  const view = views[name];
  if (!view) return;
  orbit.targetTheta = view.theta;
  orbit.targetPhi = view.phi;
  orbit.targetDistance = view.distance;
  orbit.theta = view.theta;
  orbit.phi = view.phi;
  orbit.distance = view.distance;
  orbit.auto = false;
  updateViewButtons(name);
  requestRender();
}

function updateViewButtons(active = '') {
  document.querySelectorAll('[data-view]').forEach((button) => {
    const selected = button.dataset.view === active;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  elements.autoOrbitBtn.classList.toggle('is-active', orbit.auto);
  elements.autoOrbitBtn.setAttribute('aria-pressed', String(orbit.auto));
}

function requestRender() {
  if (!frameHandle) frameHandle = requestAnimationFrame(loop);
}

function loop(now) {
  frameHandle = 0;
  const dt = Math.min(Math.max((now - lastFrameTime) / 1000, 0), 1 / 20);
  lastFrameTime = now;
  if (orbit.auto) {
    orbit.targetTheta += dt * 0.23;
    orbit.theta = orbit.targetTheta;
  }
  setCameraFromOrbit();
  renderer.render(scene, camera);
  if (orbit.auto) frameHandle = requestAnimationFrame(loop);
}

function pointerDistance() {
  const points = [...pointers.values()];
  if (points.length < 2) return 0;
  return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
}

elements.canvas.addEventListener('pointerdown', (event) => {
  elements.canvas.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  dragPointer = event.pointerId;
  lastPointer = { x: event.clientX, y: event.clientY };
  pinchDistance = pointerDistance();
  orbit.auto = false;
  updateViewButtons();
  markInteraction('orbiting');
  requestRender();
});

elements.canvas.addEventListener('pointermove', (event) => {
  if (!pointers.has(event.pointerId)) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size >= 2) {
    const nextDistance = pointerDistance();
    if (pinchDistance > 0) {
      orbit.targetDistance = THREE.MathUtils.clamp(
        orbit.targetDistance + (pinchDistance - nextDistance) * 0.018,
        3.5,
        30,
      );
      orbit.distance = orbit.targetDistance;
    }
    pinchDistance = nextDistance;
    requestRender();
    return;
  }
  if (dragPointer !== event.pointerId) return;
  const dx = event.clientX - lastPointer.x;
  const dy = event.clientY - lastPointer.y;
  orbit.targetTheta -= dx * 0.006;
  orbit.targetPhi = THREE.MathUtils.clamp(orbit.targetPhi + dy * 0.005, 0.09, Math.PI - 0.09);
  orbit.theta = orbit.targetTheta;
  orbit.phi = orbit.targetPhi;
  lastPointer = { x: event.clientX, y: event.clientY };
  requestRender();
});

function endPointer(event) {
  pointers.delete(event.pointerId);
  if (elements.canvas.hasPointerCapture(event.pointerId)) elements.canvas.releasePointerCapture(event.pointerId);
  if (dragPointer === event.pointerId) dragPointer = null;
  pinchDistance = pointerDistance();
}
elements.canvas.addEventListener('pointerup', endPointer);
elements.canvas.addEventListener('pointercancel', endPointer);
elements.canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  orbit.targetDistance = THREE.MathUtils.clamp(orbit.targetDistance + event.deltaY * 0.012, 3.5, 30);
  orbit.distance = orbit.targetDistance;
  orbit.auto = false;
  updateViewButtons();
  markInteraction('orbiting');
  requestRender();
}, { passive: false });

const presets = {
  clear: { objectDistance: 40, focalLength: 12, screenDistance: 17, objectHeight: 5, rayCount: 9 },
  projector: { objectDistance: 18, focalLength: 12, screenDistance: 36, objectHeight: 4, rayCount: 11 },
  magnifier: { objectDistance: 9, focalLength: 12, screenDistance: 38, objectHeight: 3.5, rayCount: 9 },
};

function setState(next, options = {}) {
  Object.assign(state, next);
  for (const id of inputIds) {
    elements[id].value = String(state[id]);
    updateRangeFill(elements[id]);
  }
  renderFromModel(options);
}

for (const id of inputIds) {
  const input = elements[id];
  updateRangeFill(input);
  input.addEventListener('input', () => {
    state[id] = Number(input.value);
    updateRangeFill(input);
    document.querySelectorAll('.preset').forEach((button) => button.classList.remove('is-active'));
    markInteraction();
    renderFromModel({ announceFocus: true });
  });
  input.addEventListener('change', () => {
    sound.adjust();
    window.cool?.track?.('adjusted_optics_parameter', { parameter: id, value: state[id] });
  });
}

document.querySelectorAll('.preset').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.preset').forEach((item) => item.classList.toggle('is-active', item === button));
    markInteraction('preset');
    setState(presets[button.dataset.preset], { announceFocus: true });
    sound.select();
    window.cool?.track?.('selected_optics_preset', { preset: button.dataset.preset });
  });
});

elements.focusBtn.addEventListener('click', () => {
  markInteraction('focusing');
  const model = calculation();
  if (model.mode !== 'real') {
    sound.error();
    showToast('noRealFocus', 'error');
    return;
  }
  if (model.v < 8 || model.v > 80) {
    state.screenDistance = THREE.MathUtils.clamp(model.v, 8, 80);
    elements.screenDistance.value = String(state.screenDistance);
    updateRangeFill(elements.screenDistance);
    renderFromModel({ announceFocus: true });
    sound.error();
    showToast('focusOut', 'error');
    return;
  }
  state.screenDistance = Math.round(model.v * 2) / 2;
  elements.screenDistance.value = String(state.screenDistance);
  updateRangeFill(elements.screenDistance);
  renderFromModel({ announceFocus: true });
  window.cool?.track?.('used_auto_focus');
});

document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    setView(button.dataset.view);
    sound.select();
    markInteraction('viewing');
    window.cool?.track?.('changed_optics_view', { view: button.dataset.view });
  });
});

elements.autoOrbitBtn.addEventListener('click', () => {
  orbit.auto = !orbit.auto;
  updateViewButtons();
  sound.select();
  markInteraction('viewing');
  requestRender();
});

elements.soundBtn.addEventListener('click', () => {
  soundMuted = !soundMuted;
  storage.set(SOUND_KEY, soundMuted ? 'off' : 'on');
  updateSoundButton();
  if (!soundMuted) sound.select();
});

elements.hazeBtn.addEventListener('click', () => {
  state.haze = !state.haze;
  updateHazeButton();
  renderFromModel();
  sound.select();
  markInteraction('tracing');
  window.cool?.track?.('toggled_haze_tracer', { enabled: state.haze });
});

elements.themeBtn.addEventListener('click', () => {
  window.cool?.preferences?.toggleTheme?.();
});
elements.langBtn.addEventListener('click', () => {
  window.cool?.preferences?.toggleLang?.();
});

elements.sheetHandle.addEventListener('click', () => {
  const collapsed = elements.console.classList.toggle('is-collapsed');
  elements.sheetHandle.setAttribute('aria-expanded', String(!collapsed));
  elements.sheetHandle.setAttribute('aria-label', translate(collapsed ? 'expand' : 'collapse'));
});

window.addEventListener('resize', resize);
document.addEventListener('visibilitychange', () => {
  if (document.hidden && audioContext?.state === 'running') audioContext.suspend();
  if (!document.hidden) requestRender();
});

if (setupRenderer()) initScene();
applyLanguage();
updateSoundButton();
updateHazeButton();
setState(state);
