/**
 * 太阳系漫游 · 3D
 * 行星位置来自 JPL 近似历表（orbits.js），参考系可切换成「太阳也在动」，
 * 于是行星轨迹在屏幕上自然拉成螺旋。
 */
import * as THREE from './vendor/three.module.min.js';
import {
  AU_KM,
  DAYS_PER_YEAR,
  J2000_JD,
  PLANETS,
  SUN,
  DRIFT_MODES,
  GALACTIC_POLE_ECLIPTIC,
  kmsToAuPerYear,
  angleToEclipticDeg,
  julianDayFromDate,
  dateFromJulianDay,
  heliocentricState,
  heliocentricPosition,
  sunBarycentricOffset,
  orbitalPeriodYears,
} from './orbits.js';

/* ============================ 文案 ============================ */

const I18N = {
  zh: {
    back: '返回平台',
    title: '太阳系漫游',
    subtitle: '真实轨道 · 太阳带着我们在银河里画螺旋',
    loading: '正在点亮太阳…',
    noglTitle: '这台设备暂时显示不了 3D 星空',
    noglText: '请换用支持 WebGL 的现代浏览器再来一次。',
    panel: '控制台',
    reverse: '倒放',
    today: '今天',
    viewTop: '俯视',
    viewSide: '侧看',
    viewHelix: '螺旋',
    viewFollow: '跟随',
    fDiameter: '直径',
    fDist: '离太阳',
    fYear: '公转一圈',
    fDay: '自转一圈',
    fSpeed: '绕日速度',
    fTilt: '轨道倾角',
    compare: '真实大小（地球 = 1）',
    frameTitle: '太阳自己在动吗？',
    frameNone: '质心视角',
    frameNoneSub: '太阳摆动',
    frameLocal: '邻居之间',
    frameGalaxy: '绕银心',
    pitch: '螺距缩放',
    timeTitle: '时间流速',
    speed: '每秒走过',
    viewTitle: '看的方式',
    zoom: '视野范围',
    magnify: '行星放大',
    parallax: '星空视差',
    distance: '距离标尺',
    distReal: '真实比例',
    distComp: '压缩视图',
    trail: '运动轨迹',
    trailOff: '不画',
    trailShort: '短',
    trailLong: '长',
    layerOrbits: '轨道',
    layerGrid: '黄道面',
    layerLabels: '名字',
    readTitle: '仪表盘',
    rTravel: '太阳已飞过',
    rPitch: '真实螺距',
    rTilt: '前进方向与黄道面',
    rWobble: '太阳偏离质心',
    rFound: '已探索行星',
    mythNote: '⚠️ 网上有些“漩涡太阳系”动画把行星画成拖在太阳身后、轨道面垂直于前进方向。真实夹角约 60°，行星是斜着绕圈，没有被甩到后面。',

    pause: '暂停',
    play: '播放',
    themeToDark: '切换到夜间主题',
    themeToLight: '切换到白天主题',
    soundOn: '关闭音效',
    soundOff: '打开音效',
    sunRole: '太阳系的中心恒星',
    planetRole: (n) => `离太阳第 ${n} 颗行星`,
    frameTagNone: '质心参考系 · 太阳摆动',
    frameTagLocal: '邻居参考系 · 18 km/s',
    frameTagGalaxy: '银河参考系 · 230 km/s',
    noteNone: '去掉银河中的整体飞行后，太阳也没有静止。巨行星牵着它绕太阳系质心摆动，场上的 ✛ 才是这个参考系固定的原点。',
    noteLocal: '相对身边的恒星，太阳正以 18 km/s 朝武仙座方向飞，行星的轨迹被拉成了很扁的螺旋。',
    noteGalaxy: '太阳带着整个太阳系以约 230 km/s 绕银心转，约 2.4 亿年一圈；行星一边绕日一边被带着走，画出斜螺旋。',
    pitchHint: (real) => `真实螺距约 ${real}，比轨道大太多，压短了才看得见螺旋。`,
    pitchHintNone: '质心没有整体平移，因此没有长螺旋；太阳绕质心的摆动仍然保留。',
    parallaxHint: '近、中、远星层经过深度增强，用反向位移提示太阳系前进；真实恒星远得多，视差不会这么明显。',
    parallaxHintNone: '质心视角没有整体前进，星空不产生平移视差。',
    hintDefault: '🖐 拖动环视 · 点一颗行星看档案',
    hintFrame: '💡 试试切到「绕银心」，看看轨迹怎么变成螺旋',
    hintIdle: '💡 试试拖动画面换个角度，或者点一颗行星',
    toastFrame: (name) => `参考系：${name}`,
    toastFound: (name, n) => `发现 ${name}！已探索 ${n} / 8`,
    toastAll: '🎉 八颗行星全部探索完成！',
    toastFollow: (name) => `镜头跟住了 ${name}`,
    toastNeedPlanet: '先点一颗行星，再用「跟随」',
    helixNeedsFrame: '质心视角没有整体平移，先切到「邻居之间」或「绕银心」',
    toastLimitMax: '历表算到公元 3000 年就到头啦，先停一下',
    toastLimitMin: '历表最早算到公元前 3000 年，先停一下',
    dayUnit: (v) => `${v} 天`,
    hourUnit: (v) => `${v} 小时`,
    monthUnit: (v) => `${v} 个月`,
    yearUnit: (v) => `${v} 年`,
    yearsValue: (v) => `${v} 年`,
    daysValue: (v) => `${v} 天`,
    kmValue: (v) => `${v} km`,
    auValue: (v) => `${v} au`,
    retro: (v) => `${v}（逆向）`,
    tidal: '被潮汐锁定',
    earthTimes: (v) => `地球的 ${v} 倍`,
    sunTimes: (v) => `地球的 ${v} 倍（远超图上长度）`,
    travelWithKm: (au, km) => `${au} au ≈ ${km} 亿 km`,
    travelNone: '质心固定（0 au）',
    pitchNone: '没有整体螺旋',
    pitchValue: (au, name) => `${name}：约 ${au} au / 圈`,
    wobbleValue: (radii, km) => `${radii} 个太阳半径 · ${km} 万 km`,
    tiltValue: (deg) => `约 ${deg}°`,
    tiltNone: '—',
    sunName: '太阳',
  },
  en: {
    back: 'Back to KidsLab',
    title: 'Solar System Tour',
    subtitle: 'Real orbits · the Sun draws a helix across the galaxy',
    loading: 'Lighting up the Sun…',
    noglTitle: 'This device can’t show the 3D sky yet',
    noglText: 'Please try again in a modern browser with WebGL support.',
    panel: 'Console',
    reverse: 'Rewind',
    today: 'Today',
    viewTop: 'Top',
    viewSide: 'Edge',
    viewHelix: 'Helix',
    viewFollow: 'Follow',
    fDiameter: 'Diameter',
    fDist: 'From the Sun',
    fYear: 'One orbit',
    fDay: 'One spin',
    fSpeed: 'Orbital speed',
    fTilt: 'Orbit tilt',
    compare: 'True size (Earth = 1)',
    frameTitle: 'Is the Sun standing still?',
    frameNone: 'Barycenter',
    frameNoneSub: 'Sun wobbles',
    frameLocal: 'Neighbours',
    frameGalaxy: 'Galaxy',
    pitch: 'Helix pitch',
    timeTitle: 'Time speed',
    speed: 'Per second',
    viewTitle: 'How to look',
    zoom: 'Field of view',
    magnify: 'Planet zoom',
    parallax: 'Star parallax',
    distance: 'Distance scale',
    distReal: 'True scale',
    distComp: 'Squeezed',
    trail: 'Motion trails',
    trailOff: 'Off',
    trailShort: 'Short',
    trailLong: 'Long',
    layerOrbits: 'Orbits',
    layerGrid: 'Ecliptic',
    layerLabels: 'Names',
    readTitle: 'Readouts',
    rTravel: 'Sun has travelled',
    rPitch: 'True helix pitch',
    rTilt: 'Heading vs ecliptic',
    rWobble: 'Sun off the barycenter',
    rFound: 'Planets explored',
    mythNote: '⚠️ Those “vortex solar system” videos put the planets trailing behind the Sun with orbits at a right angle to its path. The real angle is about 60°, so the orbits lean — nothing gets left behind.',

    pause: 'Pause',
    play: 'Play',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
    soundOn: 'Mute sound',
    soundOff: 'Unmute sound',
    sunRole: 'The star at the centre',
    planetRole: (n) => `Planet #${n} from the Sun`,
    frameTagNone: 'Barycentric frame · Sun wobbles',
    frameTagLocal: 'Local frame · 18 km/s',
    frameTagGalaxy: 'Galactic frame · 230 km/s',
    noteNone: 'Remove the galaxy-wide drift and the Sun still does not stand still. The giant planets pull it around the solar-system barycenter, marked by the fixed ✛.',
    noteLocal: 'Against the nearby stars the Sun drifts at 18 km/s towards Hercules, stretching each orbit into a very long helix.',
    noteGalaxy: 'The Sun carries us around the galactic centre at about 230 km/s, one lap every ~240 million years. Orbiting plus drifting equals a slanted helix.',
    pitchHint: (real) => `One true turn is about ${real} long — far wider than the orbits, so we squeeze it to see the coil.`,
    pitchHintNone: 'The barycenter has no overall drift, so there is no long helix; the Sun’s wobble remains.',
    parallaxHint: 'Enhanced near, middle, and far star depths move backwards to reveal forward travel; real stars are much farther away, so true parallax is subtler.',
    parallaxHintNone: 'The barycentric frame has no overall travel, so the star field has no translation parallax.',
    hintDefault: '🖐 Drag to orbit · tap a planet for its file',
    hintFrame: '💡 Try the “Galaxy” frame and watch the trails coil up',
    hintIdle: '💡 Drag the sky for a new angle, or tap a planet',
    toastFrame: (name) => `Frame: ${name}`,
    toastFound: (name, n) => `${name} found! ${n} / 8 explored`,
    toastAll: '🎉 All eight planets explored!',
    toastFollow: (name) => `Camera is locked on ${name}`,
    toastNeedPlanet: 'Tap a planet first, then use Follow',
    helixNeedsFrame: 'The barycentric frame has no overall drift; try Neighbours or Galaxy',
    toastLimitMax: 'The ephemeris stops at year 3000 — pausing here',
    toastLimitMin: 'The ephemeris starts at 3000 BC — pausing here',
    dayUnit: (v) => `${v} days`,
    hourUnit: (v) => `${v} hours`,
    monthUnit: (v) => `${v} months`,
    yearUnit: (v) => `${v} years`,
    yearsValue: (v) => `${v} yr`,
    daysValue: (v) => `${v} d`,
    kmValue: (v) => `${v} km`,
    auValue: (v) => `${v} au`,
    retro: (v) => `${v} (retrograde)`,
    tidal: 'tidally locked',
    earthTimes: (v) => `${v}× Earth`,
    sunTimes: (v) => `${v}× Earth (off the chart)`,
    travelWithKm: (au, km) => `${au} au ≈ ${km} billion km`,
    travelNone: 'Barycenter fixed (0 au)',
    pitchNone: 'No overall helix',
    pitchValue: (au, name) => `${name}: ~${au} au per loop`,
    wobbleValue: (radii, km) => `${radii} solar radii · ${km}k km`,
    tiltValue: (deg) => `about ${deg}°`,
    tiltNone: '—',
    sunName: 'the Sun',
  },
};

/* ============================ 常量 ============================ */

const UNITS_PER_AU = 60;
/* 半径按 √r 映射：既保住“太阳最大、木星第二”的真实排序，又不会让太阳吞掉水星轨道 */
const SIZE_K = 0.0113;
const JD_MIN = 625673.5;    /* 公元前 3000 年 */
const JD_MAX = 2816787.5;   /* 公元 3000 年 */
const TRAIL_POINTS = 168;
const TRAIL_MAX_YEARS = 40;
const WOBBLE_SAMPLES = 64;
const BODIES = [SUN, ...PLANETS];
const BODY_BY_ID = new Map(BODIES.map((b) => [b.id, b]));
const REDUCED_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const state = {
  jd: clampJd(julianDayFromDate(new Date())),
  jdOrigin: clampJd(julianDayFromDate(new Date())),
  playing: !REDUCED_MOTION,
  reverse: false,
  speedExp: 1.48,
  frame: 'local',
  pitch: 0.06,
  distance: 'real',
  magnify: 1,
  parallax: REDUCED_MOTION ? 0 : 0.55,
  viewAu: Math.pow(10, 0.78),
  trail: 'short',
  layers: { orbits: true, grid: true, labels: true },
  view: 'top',
  selected: 'earth',
  visited: new Set(),
  completed: false,
};

const camState = { azimuth: 0.62, polar: 0.24, targetAzimuth: 0.62, targetPolar: 0.24, distance: 900, targetDistance: 900 };

/* ============================ 工具 ============================ */

function clampJd(jd) { return Math.min(JD_MAX, Math.max(JD_MIN, jd)); }
function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
function damp(current, target, lambda, dt) { return current + (target - current) * (1 - Math.exp(-lambda * dt)); }

const $ = (id) => document.getElementById(id);
const els = {};
for (const id of [
  'scene', 'loading', 'nogl', 'frameTag', 'dateBadge', 'sceneHint', 'toast',
  'reverseBtn', 'playBtn', 'playIcon', 'playLabel', 'todayBtn',
  'soundBtn', 'themeBtn', 'langBtn', 'console', 'sheetHandle', 'consoleBody',
  'bodyEmoji', 'bodyName', 'bodyRole', 'fDiameter', 'fDist', 'fYear', 'fDay', 'fSpeed', 'fTilt',
  'compareFill', 'compareText', 'bodyFact',
  'frameDock', 'frameNote', 'pitchControl', 'pitchRange', 'pitchValue', 'pitchHint',
  'speedRange', 'speedValue', 'zoomRange', 'zoomValue', 'magnifyRange', 'magnifyValue',
  'parallaxControl', 'parallaxRange', 'parallaxValue', 'parallaxHint',
  'distanceDock', 'trailDock', 'layerDock',
  'rTravel', 'rPitch', 'rTilt', 'rWobble', 'rFound',
]) els[id] = $(id);

let lang = window.cool?.preferences?.lang || 'zh';
let theme = window.cool?.preferences?.theme || 'dark';
const t = (key, ...args) => {
  const value = I18N[lang]?.[key] ?? I18N.zh[key];
  return typeof value === 'function' ? value(...args) : (value ?? key);
};
const bodyName = (body) => body.name[lang] || body.name.zh;
const nf = (value, digits = 1) => value.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
  minimumFractionDigits: digits, maximumFractionDigits: digits,
});
const nfInt = (value) => Math.round(value).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US');

function track(name, payload) { try { window.cool?.track?.(name, payload); } catch { /* noop */ } }

/* ============================ 音效 ============================ */

const SOUND_KEY = 'kidslab.solar-explorer.sound';
let muted = window.cool?.storage?.get(SOUND_KEY, '0') === '1';
let audioCtx = null;
let lastTick = 0;

function ctx() {
  if (muted) return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    try { audioCtx = new Ctor(); } catch { return null; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}

function tone(freq, duration = 0.16, { type = 'sine', gain = 0.06, delay = 0, sweep = 0 } = {}) {
  const ac = ctx();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (sweep) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + sweep), start + duration);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

function noise(duration = 0.5, gain = 0.05) {
  const ac = ctx();
  if (!ac) return;
  const frames = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 2;
  const src = ac.createBufferSource();
  const filter = ac.createBiquadFilter();
  const amp = ac.createGain();
  src.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(420, ac.currentTime);
  filter.frequency.exponentialRampToValueAtTime(1600, ac.currentTime + duration);
  amp.gain.setValueAtTime(gain, ac.currentTime);
  amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  src.connect(filter).connect(amp).connect(ac.destination);
  src.start();
}

const sound = {
  click() { tone(520, 0.07, { type: 'triangle', gain: 0.05 }); },
  select() { tone(392, 0.1, { type: 'triangle', gain: 0.05 }); tone(587, 0.14, { type: 'sine', gain: 0.05, delay: 0.06 }); },
  frame() { noise(0.55, 0.035); tone(196, 0.4, { type: 'sine', gain: 0.05, sweep: 120 }); },
  discover() { [523, 659, 784].forEach((f, i) => tone(f, 0.22, { type: 'sine', gain: 0.05, delay: i * 0.09 })); },
  finale() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.36, { type: 'triangle', gain: 0.055, delay: i * 0.13 })); },
  tick() {
    const now = performance.now();
    if (now - lastTick < 90) return;
    lastTick = now;
    tone(760, 0.04, { type: 'square', gain: 0.018 });
  },
};

function syncSoundBtn() {
  els.soundBtn.textContent = muted ? '🔇' : '🔊';
  els.soundBtn.setAttribute('aria-pressed', String(!muted));
  els.soundBtn.setAttribute('aria-label', t(muted ? 'soundOff' : 'soundOn'));
}

/* ============================ 尺度映射 ============================ */

function unitsToAu(units) {
  if (state.distance === 'compressed') return (units / UNITS_PER_AU) ** 2;
  return units / UNITS_PER_AU;
}

function radialUnits(rAu) {
  if (state.distance === 'compressed') return UNITS_PER_AU * Math.sqrt(Math.max(rAu, 0));
  return UNITS_PER_AU * rAu;
}

/** 日心黄道坐标(au) → three 场景坐标（Y 轴为黄道北极） */
function toScene(p, out = new THREE.Vector3()) {
  const r = Math.hypot(p[0], p[1], p[2]);
  const k = r > 1e-9 ? radialUnits(r) / r : 0;
  return out.set(p[0] * k, p[2] * k, -p[1] * k);
}

function driftInfo() {
  const mode = DRIFT_MODES[state.frame];
  const auPerYear = kmsToAuPerYear(mode.speedKmS);
  const d = mode.direction;
  return { mode, auPerYear, dir: new THREE.Vector3(d[0], d[2], -d[1]).normalize() };
}

const _sunPos = new THREE.Vector3();
const _baryPos = new THREE.Vector3();
const _wobble = new THREE.Vector3();

/** 质心在场景里的位置：只被太阳的整体漂移带着走 */
function barycenterScenePosition(jd, out = _baryPos) {
  const { auPerYear, dir } = driftInfo();
  const years = (jd - state.jdOrigin) / DAYS_PER_YEAR;
  return out.copy(dir).multiplyScalar(auPerYear * years * state.pitch * UNITS_PER_AU);
}

/**
 * 太阳被画大了约 34 倍（√r 映射），所以摆动也按同一倍数放大，
 * 这样「质心离太阳中心几个太阳半径」在屏幕上仍然是真的。
 */
function wobbleGain() {
  return displayRadius(SUN) / ((SUN.radiusKm / AU_KM) * UNITS_PER_AU);
}

/** 太阳绕质心的摆动（场景单位），黄道坐标 → three 坐标 */
function sunWobble(jd, out = _wobble) {
  const p = sunBarycentricOffset(jd);
  const k = UNITS_PER_AU * wobbleGain();
  return out.set(p[0] * k, p[2] * k, -p[1] * k);
}

function sunScenePosition(jd, out = _sunPos) {
  return out.copy(barycenterScenePosition(jd)).add(sunWobble(jd));
}

function displayRadius(body) {
  const base = SIZE_K * Math.sqrt(body.radiusKm);
  /* 「行星放大」只作用于行星；太阳保持不变，倍率效果才清楚。 */
  const boost = body.id === 'sun' ? 1 : state.magnify;
  return base * boost;
}

/* ============================ three.js 场景 ============================ */

let renderer;
let scene;
let camera;
const clock = new THREE.Clock();
const bodyMap = new Map();
let sunGroup;
let orbitGroup;
let gridGroup;
let labelGroup;
let trailGroup;
let sunLight;
let farStarField;
const parallaxFields = [];
let sunTrail;
let sunArrow;
let baryMarker;
let glowSprite;
let orbitsBuiltAt = -1e9;

let palette;
function themeColors() {
  return theme === 'light'
    ? { orbit: 0x7a86a8, grid: 0xa6b0cc, label: '#132039', labelBg: 'rgba(255,255,255,.82)', fade: new THREE.Color(0xf2f5fb), ambient: 0.55, arrow: 0xd2691e, bary: 0x007f9f }
    : { orbit: 0x5f6f9c, grid: 0x3f4a72, label: '#eaf1ff', labelBg: 'rgba(9,14,30,.62)', fade: new THREE.Color(0x05070f), ambient: 0.16, arrow: 0xffb703, bary: 0x7ce7ff };
}

/* --------- 程序化贴图 --------- */

function prng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function planetTexture(body) {
  const w = 256;
  const h = 128;
  const canvas = makeCanvas(w, h);
  const c = canvas.getContext('2d');
  const base = new THREE.Color(body.color);
  const rand = prng(body.id.length * 7919 + body.radiusKm);
  const hex = (col) => `#${col.getHexString()}`;
  const shade = (k) => hex(base.clone().offsetHSL(0, 0, k));

  c.fillStyle = shade(0);
  c.fillRect(0, 0, w, h);

  const gas = ['jupiter', 'saturn', 'uranus', 'neptune'].includes(body.id);
  if (gas) {
    for (let y = 0; y < h; y += 1) {
      const band = Math.sin(y * 0.42) * 0.5 + Math.sin(y * 0.13 + 1.7) * 0.5;
      c.fillStyle = shade(band * (body.id === 'jupiter' || body.id === 'saturn' ? 0.11 : 0.05));
      c.fillRect(0, y, w, 1);
    }
    for (let i = 0; i < 90; i += 1) {
      const y = rand() * h;
      const rw = 12 + rand() * 60;
      c.globalAlpha = 0.12 + rand() * 0.16;
      c.fillStyle = shade(rand() > 0.5 ? 0.14 : -0.12);
      c.beginPath();
      c.ellipse(rand() * w, y, rw, 1.6 + rand() * 3.4, 0, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
    if (body.id === 'jupiter') {
      c.fillStyle = '#c0553a';
      c.beginPath();
      c.ellipse(w * 0.66, h * 0.62, 17, 8, 0, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 0.4;
      c.fillStyle = '#e08a6d';
      c.beginPath();
      c.ellipse(w * 0.66, h * 0.62, 10, 4.5, 0, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
    }
  } else if (body.id === 'earth') {
    c.fillStyle = '#1f5fbd';
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i += 1) {
      c.fillStyle = rand() > 0.35 ? '#2f7a45' : '#8a7748';
      c.globalAlpha = 0.85;
      c.beginPath();
      c.ellipse(rand() * w, 18 + rand() * (h - 36), 8 + rand() * 26, 6 + rand() * 15, rand() * 3, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 0.9;
    c.fillStyle = '#f2f7ff';
    c.fillRect(0, 0, w, 7);
    c.fillRect(0, h - 7, w, 7);
    c.globalAlpha = 0.28;
    for (let i = 0; i < 22; i += 1) {
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.ellipse(rand() * w, rand() * h, 10 + rand() * 26, 3 + rand() * 6, 0, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
  } else {
    for (let i = 0; i < 260; i += 1) {
      c.globalAlpha = 0.1 + rand() * 0.22;
      c.fillStyle = shade(rand() > 0.5 ? 0.09 : -0.1);
      const r = 2 + rand() * 9;
      c.beginPath();
      c.arc(rand() * w, rand() * h, r, 0, Math.PI * 2);
      c.fill();
    }
    if (body.id === 'mars') {
      c.globalAlpha = 0.8;
      c.fillStyle = '#f0ece6';
      c.beginPath();
      c.ellipse(w * 0.5, 3, 26, 8, 0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.ellipse(w * 0.5, h - 3, 22, 7, 0, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function sunTexture() {
  const canvas = makeCanvas(256, 128);
  const c = canvas.getContext('2d');
  const rand = prng(4242);
  c.fillStyle = '#ffcf5c';
  c.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 420; i += 1) {
    c.globalAlpha = 0.08 + rand() * 0.2;
    c.fillStyle = rand() > 0.45 ? '#fff3c4' : '#f38b2b';
    c.beginPath();
    c.arc(rand() * 256, rand() * 128, 2 + rand() * 8, 0, Math.PI * 2);
    c.fill();
  }
  c.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function glowTexture() {
  const canvas = makeCanvas(128, 128);
  const c = canvas.getContext('2d');
  const grad = c.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,236,178,.75)');
  grad.addColorStop(0.18, 'rgba(255,196,64,.34)');
  grad.addColorStop(0.45, 'rgba(255,150,20,.1)');
  grad.addColorStop(1, 'rgba(255,120,0,0)');
  c.fillStyle = grad;
  c.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function markerTexture() {
  const canvas = makeCanvas(64, 64);
  const c = canvas.getContext('2d');
  const grad = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.18, 'rgba(255,255,255,.98)');
  grad.addColorStop(0.32, 'rgba(255,255,255,.34)');
  grad.addColorStop(0.62, 'rgba(255,255,255,.12)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = grad;
  c.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function crossTexture() {
  const canvas = makeCanvas(64, 64);
  const c = canvas.getContext('2d');
  c.strokeStyle = 'rgba(255,255,255,.95)';
  c.lineWidth = 4;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(32, 12); c.lineTo(32, 52);
  c.moveTo(12, 32); c.lineTo(52, 32);
  c.stroke();
  c.lineWidth = 3;
  c.strokeStyle = 'rgba(255,255,255,.55)';
  c.beginPath();
  c.arc(32, 32, 13, 0, Math.PI * 2);
  c.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function ringTexture(body) {
  const canvas = makeCanvas(128, 8);
  const c = canvas.getContext('2d');
  const rand = prng(body.id.length * 131);
  c.clearRect(0, 0, 128, 8);
  for (let x = 0; x < 128; x += 1) {
    const gap = Math.sin(x * 0.55) * 0.5 + 0.5;
    const alpha = body.id === 'saturn' ? 0.16 + gap * 0.62 : 0.12 + gap * 0.2;
    c.fillStyle = body.id === 'saturn'
      ? `rgba(238,220,180,${alpha * (0.7 + rand() * 0.3)})`
      : `rgba(180,220,235,${alpha * 0.6})`;
    c.fillRect(x, 0, 1, 8);
  }
  if (body.id === 'saturn') {
    c.clearRect(88, 0, 5, 8);
    c.clearRect(30, 0, 2, 8);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** 银河带：按真实银道面（与黄道约 60°）铺在天球上，只画弥漫光，星点交给 Points */
function skyTexture() {
  const w = 512;
  const h = 256;
  const canvas = makeCanvas(w, h);
  const c = canvas.getContext('2d');
  const light = theme === 'light';
  c.fillStyle = light ? '#dfe7f7' : '#04060e';
  c.fillRect(0, 0, w, h);

  const pole = GALACTIC_POLE_ECLIPTIC;
  const image = c.getImageData(0, 0, w, h);
  const data = image.data;
  for (let y = 0; y < h; y += 1) {
    const lat = (0.5 - (y + 0.5) / h) * Math.PI;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);
    for (let x = 0; x < w; x += 1) {
      const lon = ((x + 0.5) / w) * Math.PI * 2;
      const ex = cosLat * Math.cos(lon);
      const ez = cosLat * Math.sin(lon);
      const ey = sinLat;
      /* toScene 的换算：three(x, y, z) = 黄道(x, z, −y) */
      const dot = Math.abs(ex * pole[0] + ey * pole[2] - ez * pole[1]);
      const band = Math.exp(-((dot / 0.2) ** 2));
      if (band < 0.02) continue;
      const i = (y * w + x) * 4;
      if (light) {
        data[i] -= band * 14;
        data[i + 1] -= band * 10;
        data[i + 2] -= band * 2;
      } else {
        data[i] += band * 30;
        data[i + 1] += band * 32;
        data[i + 2] += band * 52;
      }
    }
  }
  c.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return texture;
}

/** 近似无限远的惯性天球：随相机平移但不随相机旋转，银道面附近更密。 */
function makeFarStarfield() {
  const count = 2400;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const rand = prng(9182736);
  const pole = new THREE.Vector3(GALACTIC_POLE_ECLIPTIC[0], GALACTIC_POLE_ECLIPTIC[2], -GALACTIC_POLE_ECLIPTIC[1]).normalize();
  const u = new THREE.Vector3(1, 0, 0).cross(pole);
  if (u.lengthSq() < 1e-6) u.set(0, 0, 1).cross(pole);
  u.normalize();
  const v = new THREE.Vector3().crossVectors(pole, u);
  const dir = new THREE.Vector3();

  for (let i = 0; i < count; i += 1) {
    const inBand = rand() < 0.42;
    if (inBand) {
      const b = (rand() + rand() + rand() - 1.5) * 0.34;
      const l = rand() * Math.PI * 2;
      dir.copy(u).multiplyScalar(Math.cos(b) * Math.cos(l))
        .addScaledVector(v, Math.cos(b) * Math.sin(l))
        .addScaledVector(pole, Math.sin(b));
    } else {
      const z = rand() * 2 - 1;
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(1 - z * z);
      dir.set(r * Math.cos(a), z, r * Math.sin(a));
    }
    positions[i * 3] = dir.x;
    positions[i * 3 + 1] = dir.y;
    positions[i * 3 + 2] = dir.z;
    const warm = rand();
    const bright = 0.35 + rand() ** 2 * 0.65;
    colors[i * 3] = bright * (warm > 0.8 ? 1 : 0.86);
    colors[i * 3 + 1] = bright * 0.9;
    colors[i * 3 + 2] = bright * (warm > 0.8 ? 0.78 : 1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({
    size: 1.7, sizeAttenuation: false, vertexColors: true,
    color: theme === 'light' ? 0x5a6a94 : 0xffffff,
    transparent: true, depthWrite: false, depthTest: false,
  }));
  points.renderOrder = -1;
  points.frustumCulled = false;
  return points;
}

/**
 * 有限深度的教学星层。base 保留每颗星的周期坐标，运行时只按太阳系
 * 平移量反向滚动并循环包裹，因而不会随着时间飞出可视范围。
 */
function makeParallaxField({ count, seed, spread, motion, size, opacity }) {
  const positions = new Float32Array(count * 3);
  const base = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const rand = prng(seed);

  for (let i = 0; i < count; i += 1) {
    let x = rand() - 0.5;
    let y = rand() - 0.5;
    let z = rand() - 0.5;
    const radius = Math.hypot(x, y, z);
    if (radius < 0.16) {
      const k = 0.16 / Math.max(radius, 1e-4);
      x *= k; y *= k; z *= k;
    }
    base[i * 3] = x;
    base[i * 3 + 1] = y;
    base[i * 3 + 2] = z;
    const warm = rand();
    const bright = 0.55 + rand() * 0.45;
    colors[i * 3] = bright * (warm > 0.82 ? 1 : 0.82);
    colors[i * 3 + 1] = bright * 0.9;
    colors[i * 3 + 2] = bright * (warm > 0.82 ? 0.72 : 1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({
    size,
    sizeAttenuation: false,
    vertexColors: true,
    color: theme === 'light' ? 0x536386 : 0xffffff,
    transparent: true,
    opacity: theme === 'light' ? opacity * 0.62 : opacity,
    depthWrite: false,
    depthTest: false,
  }));
  points.userData = { base, spread, motion, size, opacity };
  points.renderOrder = -1;
  points.frustumCulled = false;
  return points;
}

function labelSprite(text, color) {
  const canvas = makeCanvas(256, 64);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(canvas),
    depthTest: false,
    transparent: true,
  }));
  sprite.userData.canvas = canvas;
  sprite.userData.color = color;
  drawLabel(sprite, text);
  return sprite;
}

function drawLabel(sprite, text) {
  const canvas = sprite.userData.canvas;
  const c = canvas.getContext('2d');
  const colors = palette;
  c.clearRect(0, 0, 256, 64);
  c.font = '600 30px "PingFang SC","Hiragino Sans GB","Microsoft YaHei",system-ui,sans-serif';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  const width = Math.min(240, c.measureText(text).width + 30);
  c.fillStyle = colors.labelBg;
  const x = 128 - width / 2;
  c.beginPath();
  if (c.roundRect) c.roundRect(x, 12, width, 40, 12);
  else c.rect(x, 12, width, 40);
  c.fill();
  c.fillStyle = sprite.userData.color || colors.label;
  c.fillText(text, 128, 33);
  sprite.material.map.needsUpdate = true;
}

/* --------- 场景搭建 --------- */

function buildScene() {
  renderer = new THREE.WebGLRenderer({ canvas: els.scene, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  scene = new THREE.Scene();
  scene.background = skyTexture();

  camera = new THREE.PerspectiveCamera(45, 1, 0.05, 400000);
  farStarField = makeFarStarfield();
  parallaxFields.push(
    makeParallaxField({ count: 150, seed: 78123, spread: 3.2, motion: 1, size: 2.6, opacity: 0.72 }),
    makeParallaxField({ count: 380, seed: 456789, spread: 6.5, motion: 0.32, size: 1.55, opacity: 0.52 }),
  );
  scene.add(farStarField, ...parallaxFields);
  scene.add(camera);

  const colors = palette;
  scene.add(new THREE.AmbientLight(0xffffff, colors.ambient));
  sunLight = new THREE.PointLight(0xfff2d0, 2.4, 0, 0);
  scene.add(sunLight);

  sunGroup = new THREE.Group();
  scene.add(sunGroup);

  orbitGroup = new THREE.Group();
  gridGroup = new THREE.Group();
  sunGroup.add(orbitGroup, gridGroup);

  trailGroup = new THREE.Group();
  labelGroup = new THREE.Group();
  scene.add(trailGroup, labelGroup);

  /* 太阳 */
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 36, 24),
    new THREE.MeshBasicMaterial({ map: sunTexture() }),
  );
  sunGroup.add(sunMesh);
  glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  }));
  sunGroup.add(glowSprite);
  bodyMap.set('sun', { body: SUN, mesh: sunMesh, spin: sunMesh, group: sunGroup, position: new THREE.Vector3() });

  const marker = markerTexture();

  for (const planet of PLANETS) {
    const group = new THREE.Group();
    const tilt = new THREE.Group();
    tilt.rotation.x = THREE.MathUtils.degToRad(planet.tiltDeg);
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 22),
      new THREE.MeshStandardMaterial({ map: planetTexture(planet), roughness: 0.92, metalness: 0.02 }),
    );
    tilt.add(mesh);

    if (planet.ring) {
      const inner = planet.id === 'saturn' ? 1.28 : 1.6;
      const outer = planet.id === 'saturn' ? 2.32 : 1.95;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(inner, outer, 72),
        new THREE.MeshBasicMaterial({ map: ringTexture(planet), transparent: true, side: THREE.DoubleSide, depthWrite: false }),
      );
      const uv = ring.geometry.attributes.uv;
      const pos = ring.geometry.attributes.position;
      for (let i = 0; i < uv.count; i += 1) {
        const r = Math.hypot(pos.getX(i), pos.getY(i));
        uv.setXY(i, (r - inner) / (outer - inner), 0.5);
      }
      uv.needsUpdate = true;
      ring.rotation.x = -Math.PI / 2;
      tilt.add(ring);
    }

    group.add(tilt);
    const dot = new THREE.Sprite(new THREE.SpriteMaterial({
      map: marker, color: planet.color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, depthTest: false,
    }));
    group.add(dot);
    scene.add(group);

    const label = labelSprite(bodyName(planet), planet.accent);
    labelGroup.add(label);

    /* 轨道线：虚线 + 低透明度，只当参考底稿，实线留给真正走过的轨迹 */
    const orbit = new THREE.Line(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * 257), 3)),
      new THREE.LineDashedMaterial({ color: colors.orbit, dashSize: 6, gapSize: 5, transparent: true, opacity: 0.4 }),
    );
    orbitGroup.add(orbit);

    /* 拖尾 */
    const trailGeom = new THREE.BufferGeometry();
    trailGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * TRAIL_POINTS), 3));
    trailGeom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(3 * TRAIL_POINTS), 3));
    const trail = new THREE.Line(trailGeom, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 }));
    trail.frustumCulled = false;
    trailGroup.add(trail);

    bodyMap.set(planet.id, {
      body: planet, group, mesh, tilt, spin: mesh, dot, label, orbit, trail,
      position: new THREE.Vector3(),
      trailColor: new THREE.Color(planet.color),
      period: orbitalPeriodYears(planet.id),
    });
  }

  const sunLabel = labelSprite(bodyName(SUN), SUN.accent);
  labelGroup.add(sunLabel);
  bodyMap.get('sun').label = sunLabel;

  buildGrid();

  /* 太阳自己的航迹：绕质心的摆动 + 整体漂移，合起来就是它真实走过的路 */
  sunTrail = new THREE.Line(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * WOBBLE_SAMPLES), 3)),
    new THREE.LineDashedMaterial({ color: colors.arrow, dashSize: 26, gapSize: 16, transparent: true, opacity: 0.75 }),
  );
  sunTrail.frustumCulled = false;
  scene.add(sunTrail);

  /* 太阳系质心：太阳真正绕着转的那个点 */
  baryMarker = new THREE.Sprite(new THREE.SpriteMaterial({
    map: crossTexture(), color: colors.bary, transparent: true, opacity: 0.9, depthWrite: false, depthTest: false,
  }));
  baryMarker.frustumCulled = false;
  scene.add(baryMarker);

  sunArrow = new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 2.4, 16),
    new THREE.MeshBasicMaterial({ color: colors.arrow, transparent: true, opacity: 0.72, depthWrite: false }),
  );
  scene.add(sunArrow);

  buildOrbits();
}

function buildGrid() {
  const materials = new Set();
  for (const child of gridGroup.children) {
    child.geometry?.dispose();
    if (child.material) materials.add(child.material);
  }
  for (const material of materials) material.dispose();
  gridGroup.clear();
  const colors = palette;
  /* 只留同心的距离圈，去掉放射状辐条：那 12 条直线是画面最吵的来源 */
  const material = new THREE.LineDashedMaterial({
    color: colors.grid, dashSize: 5, gapSize: 7, transparent: true, opacity: 0.22,
  });
  const radii = [0.4, 1, 2, 5, 10, 20, 31];
  for (const rAu of radii) {
    const r = radialUnits(rAu);
    const points = [];
    for (let i = 0; i <= 128; i += 1) {
      const a = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
    const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
    ring.computeLineDistances();
    gridGroup.add(ring);
  }
}

function buildOrbits() {
  const tmp = new THREE.Vector3();
  for (const planet of PLANETS) {
    const entry = bodyMap.get(planet.id);
    const periodDays = entry.period * DAYS_PER_YEAR;
    const array = entry.orbit.geometry.attributes.position.array;
    for (let i = 0; i <= 256; i += 1) {
      toScene(heliocentricPosition(planet.id, state.jd + (i / 256) * periodDays), tmp);
      array[i * 3] = tmp.x;
      array[i * 3 + 1] = tmp.y;
      array[i * 3 + 2] = tmp.z;
    }
    entry.orbit.geometry.attributes.position.needsUpdate = true;
    entry.orbit.geometry.computeBoundingSphere();
    entry.orbit.computeLineDistances();
  }
  orbitsBuiltAt = state.jd;
}

/** 虚线段长跟着镜头远近走，无论缩放到哪一档都是同样疏密的点线 */
function updateDashScale() {
  const dash = camState.distance * 0.011;
  for (const entry of bodyMap.values()) {
    if (!entry.orbit) continue;
    entry.orbit.material.dashSize = dash;
    entry.orbit.material.gapSize = dash * 0.85;
  }
  const gridMaterial = gridGroup.children[0]?.material;
  if (gridMaterial) {
    gridMaterial.dashSize = dash * 0.8;
    gridMaterial.gapSize = dash * 1.15;
  }
  sunTrail.material.dashSize = dash * 1.4;
  sunTrail.material.gapSize = dash * 0.9;
}

function applyThemeToScene() {
  palette = themeColors();
  const colors = palette;
  scene.background?.dispose?.();
  scene.background = skyTexture();
  farStarField.material.color.setHex(theme === 'light' ? 0x5a6a94 : 0xffffff);
  farStarField.material.size = theme === 'light' ? 1.4 : 1.7;
  for (const field of parallaxFields) {
    field.material.color.setHex(theme === 'light' ? 0x536386 : 0xffffff);
    field.material.opacity = theme === 'light' ? field.userData.opacity * 0.62 : field.userData.opacity;
  }
  scene.children.find((c) => c.isAmbientLight).intensity = colors.ambient;
  for (const entry of bodyMap.values()) {
    if (entry.orbit) entry.orbit.material.color.setHex(colors.orbit);
    if (entry.label) drawLabel(entry.label, bodyName(entry.body));
  }
  for (const line of gridGroup.children) line.material.color.setHex(colors.grid);
  sunTrail.material.color.setHex(colors.arrow);
  sunArrow.material.color.setHex(colors.arrow);
  baryMarker.material.color.setHex(colors.bary);
  for (const planet of PLANETS) {
    const dot = bodyMap.get(planet.id).dot;
    dot.material.blending = theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending;
    dot.material.needsUpdate = true;
  }
}

/* ============================ 更新循环 ============================ */

const tmpVec = new THREE.Vector3();
const tmpVec2 = new THREE.Vector3();
const tmpColor = new THREE.Color();
const UP = new THREE.Vector3(0, 1, 0);

function trailSpanYears(entry) {
  const laps = state.trail === 'long' ? 3 : 1.05;
  return Math.min(entry.period * laps, TRAIL_MAX_YEARS);
}

/**
 * 太阳绕质心的摆动由木星、土星主导，十几年才走一圈，所以拖尾按 64 个采样点插值。
 * 否则每帧要为上千个拖尾点各解 8 次开普勒方程。
 */
const wobbleCache = { jd: NaN, spanDays: 0, samples: new Float64Array(WOBBLE_SAMPLES * 3) };

function refreshWobbleCache(spanDays) {
  wobbleCache.jd = state.jd;
  wobbleCache.spanDays = spanDays;
  for (let i = 0; i < WOBBLE_SAMPLES; i += 1) {
    const jd = state.jd - (i / (WOBBLE_SAMPLES - 1)) * spanDays;
    const p = sunBarycentricOffset(jd);
    wobbleCache.samples[i * 3] = p[0];
    wobbleCache.samples[i * 3 + 1] = p[2];
    wobbleCache.samples[i * 3 + 2] = -p[1];
  }
}

function sampleWobble(jd, out) {
  const { spanDays, samples } = wobbleCache;
  const k = UNITS_PER_AU * wobbleGain();
  const f = spanDays > 0
    ? clamp(((wobbleCache.jd - jd) / spanDays) * (WOBBLE_SAMPLES - 1), 0, WOBBLE_SAMPLES - 1)
    : 0;
  const i0 = Math.floor(f);
  const i1 = Math.min(i0 + 1, WOBBLE_SAMPLES - 1);
  const t = f - i0;
  return out.set(
    (samples[i0 * 3] + (samples[i1 * 3] - samples[i0 * 3]) * t) * k,
    (samples[i0 * 3 + 1] + (samples[i1 * 3 + 1] - samples[i0 * 3 + 1]) * t) * k,
    (samples[i0 * 3 + 2] + (samples[i1 * 3 + 2] - samples[i0 * 3 + 2]) * t) * k,
  );
}

function updateTrails() {
  const visible = state.trail !== 'off';
  trailGroup.visible = visible;
  sunTrail.visible = visible;
  if (!visible) return;
  const { auPerYear, dir } = driftInfo();
  const driftUnitsPerDay = (auPerYear / DAYS_PER_YEAR) * state.pitch * UNITS_PER_AU;

  let maxSpanDays = 0;
  for (const planet of PLANETS) {
    maxSpanDays = Math.max(maxSpanDays, trailSpanYears(bodyMap.get(planet.id)) * DAYS_PER_YEAR);
  }
  refreshWobbleCache(maxSpanDays);
  const sunSpanDays = (state.trail === 'long' ? 40 : 12) * DAYS_PER_YEAR;
  updateSunTrail(dir, driftUnitsPerDay, sunSpanDays);

  for (const planet of PLANETS) {
    const entry = bodyMap.get(planet.id);
    const spanDays = trailSpanYears(entry) * DAYS_PER_YEAR;
    const step = spanDays / (TRAIL_POINTS - 1);
    const pos = entry.trail.geometry.attributes.position.array;
    const col = entry.trail.geometry.attributes.color.array;
    const base = entry.trailColor;
    for (let i = 0; i < TRAIL_POINTS; i += 1) {
      const jd = state.jd - i * step;
      toScene(heliocentricPosition(planet.id, jd), tmpVec);
      sampleWobble(jd, tmpVec2);
      const drift = (jd - state.jdOrigin) * driftUnitsPerDay;
      pos[i * 3] = tmpVec.x + tmpVec2.x + dir.x * drift;
      pos[i * 3 + 1] = tmpVec.y + tmpVec2.y + dir.y * drift;
      pos[i * 3 + 2] = tmpVec.z + tmpVec2.z + dir.z * drift;
      const fade = 1 - i / (TRAIL_POINTS - 1);
      tmpColor.copy(palette.fade).lerp(base, fade ** 0.7);
      col[i * 3] = tmpColor.r;
      col[i * 3 + 1] = tmpColor.g;
      col[i * 3 + 2] = tmpColor.b;
    }
    entry.trail.geometry.attributes.position.needsUpdate = true;
    entry.trail.geometry.attributes.color.needsUpdate = true;
  }
}

/** 太阳走过的路：绕质心的小圈 + 整体漂移拉出来的长线 */
function updateSunTrail(dir, driftUnitsPerDay, spanDays) {
  const array = sunTrail.geometry.attributes.position.array;
  for (let i = 0; i < WOBBLE_SAMPLES; i += 1) {
    const jd = state.jd - (i / (WOBBLE_SAMPLES - 1)) * spanDays;
    sampleWobble(jd, tmpVec);
    const drift = (jd - state.jdOrigin) * driftUnitsPerDay;
    array[i * 3] = tmpVec.x + dir.x * drift;
    array[i * 3 + 1] = tmpVec.y + dir.y * drift;
    array[i * 3 + 2] = tmpVec.z + dir.z * drift;
  }
  sunTrail.geometry.attributes.position.needsUpdate = true;
  sunTrail.geometry.computeBoundingSphere();
  sunTrail.computeLineDistances();
}

function updateBodies() {
  const sunPos = sunScenePosition(state.jd);
  sunGroup.position.copy(sunPos);
  sunLight.position.copy(sunPos);

  const sunEntry = bodyMap.get('sun');
  const sunRadius = displayRadius(SUN);
  sunEntry.mesh.scale.setScalar(sunRadius);
  sunEntry.mesh.rotation.y = ((state.jd - J2000_JD) / SUN.rotationDays) * Math.PI * 2;
  glowSprite.scale.setScalar(sunRadius * 4.2);
  sunEntry.position.copy(sunPos);

  for (const planet of PLANETS) {
    const entry = bodyMap.get(planet.id);
    toScene(heliocentricPosition(planet.id, state.jd), tmpVec);
    entry.position.copy(tmpVec).add(sunPos);
    entry.group.position.copy(entry.position);
    entry.tilt.scale.setScalar(displayRadius(planet));
    entry.spin.rotation.y = ((state.jd - J2000_JD) / planet.rotationDays) * Math.PI * 2;
  }
}

function screenScale(worldPos, pixels) {
  const distance = camera.position.distanceTo(worldPos);
  const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
  return (pixels / renderer.domElement.clientHeight) * height;
}

const placedLabels = [];

function updateOverlays() {
  labelGroup.visible = state.layers.labels;
  orbitGroup.visible = state.layers.orbits;
  gridGroup.visible = state.layers.grid;

  const width = renderer.domElement.clientWidth;
  const height = renderer.domElement.clientHeight;
  placedLabels.length = 0;

  /* 先算屏幕位置：近的、选中的优先占位，其余重叠时让路 */
  const ordered = [...bodyMap.values()].sort((a, b) => {
    const pa = a.body.id === state.selected ? -1 : camera.position.distanceTo(a.position);
    const pb = b.body.id === state.selected ? -1 : camera.position.distanceTo(b.position);
    return pa - pb;
  });

  for (const entry of ordered) {
    if (entry.dot) {
      const selected = entry.body.id === state.selected;
      /* 行星在屏幕上够大时就让标记点淡出，否则「行星放大」永远被这颗光点盖住 */
      const pixels = displayRadius(entry.body) / screenScale(entry.position, 1);
      const fade = clamp((5.5 - pixels) / 3.5, 0, 1);
      entry.dot.scale.setScalar(screenScale(entry.position, selected ? 30 : 18));
      entry.dot.material.opacity = (selected ? 1 : 0.82) * fade;
      entry.dot.visible = fade > 0.02;
    }
    if (!entry.label) continue;
    if (!state.layers.labels) { entry.label.visible = false; continue; }

    tmpVec.copy(entry.position).project(camera);
    const sx = ((tmpVec.x + 1) / 2) * width;
    const sy = ((1 - tmpVec.y) / 2) * height;
    let blocked = tmpVec.z > 1;
    if (!blocked) {
      for (const placed of placedLabels) {
        if (Math.abs(placed.x - sx) < 62 && Math.abs(placed.y - sy) < 26) { blocked = true; break; }
      }
    }
    entry.label.visible = !blocked;
    if (blocked) continue;
    placedLabels.push({ x: sx, y: sy });
    const scale = screenScale(entry.position, 30);
    entry.label.scale.set(scale * 4, scale, 1);
    entry.label.position.copy(entry.position);
    entry.label.position.y += displayRadius(entry.body) + scale * 1.1;
  }

  /* 质心标记 + 前进箭头 */
  const { auPerYear, dir } = driftInfo();
  const sunPos = bodyMap.get('sun').position;
  const baryPos = barycenterScenePosition(state.jd);
  baryMarker.position.copy(baryPos);
  baryMarker.scale.setScalar(screenScale(baryPos, 22));

  const moving = auPerYear > 0;
  sunArrow.visible = moving;
  if (moving) {
    const arrowScale = screenScale(sunPos, 7);
    const ahead = tmpVec2.copy(dir)
      .multiplyScalar(Math.max(displayRadius(SUN) * 2.6, arrowScale * 11))
      .add(sunPos);
    sunArrow.position.copy(ahead);
    sunArrow.quaternion.setFromUnitVectors(UP, dir);
    sunArrow.scale.setScalar(arrowScale);
  }
  updateDashScale();
}

function cameraTargetPosition(out) {
  if (state.view === 'follow' && state.selected !== 'sun') {
    return out.copy(bodyMap.get(state.selected).position);
  }
  /* 对准质心而不是太阳，太阳绕质心的小圈才看得出来 */
  return out.copy(barycenterScenePosition(state.jd));
}

function updateCamera(dt) {
  camState.azimuth = damp(camState.azimuth, camState.targetAzimuth, 6, dt);
  camState.polar = damp(camState.polar, camState.targetPolar, 6, dt);
  camState.targetDistance = radialUnits(state.viewAu) / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  camState.distance = damp(camState.distance, camState.targetDistance, 5, dt);

  const target = cameraTargetPosition(tmpVec);
  const sinP = Math.sin(camState.polar);
  camera.position.set(
    target.x + camState.distance * sinP * Math.sin(camState.azimuth),
    target.y + camState.distance * Math.cos(camState.polar),
    target.z + camState.distance * sinP * Math.cos(camState.azimuth),
  );
  camera.near = Math.max(0.02, camState.distance / 4000);
  camera.far = camState.distance * 60 + 20000;
  camera.updateProjectionMatrix();
  camera.lookAt(target);
}

const tmpStarTravel = new THREE.Vector3();
function wrapCentered(value, span) {
  return ((value + span * 0.5) % span + span) % span - span * 0.5;
}

function updateStarfield() {
  /* 无限远天球只跟随相机平移，不跟随相机旋转，因此环视时能看到不同星区。 */
  farStarField.position.copy(camera.position);
  farStarField.scale.setScalar(camera.far * 0.35);

  const { mode, dir } = driftInfo();
  const moving = mode.speedKmS > 0 && state.parallax > 0.001;
  const speedCue = moving ? Math.sqrt(mode.speedKmS / 18.04) : 0;
  const gain = state.parallax * 7.8 * speedCue;
  const years = (state.jd - state.jdOrigin) / DAYS_PER_YEAR;
  /* 视差有独立强度，不跟随“螺距缩放”，避免两只滑杆相互放大。 */
  tmpStarTravel.copy(dir).multiplyScalar(years * UNITS_PER_AU);

  for (const field of parallaxFields) {
    field.visible = moving;
    if (!moving) continue;
    field.position.copy(camera.position);
    const span = Math.max(240, camState.distance * field.userData.spread);
    const shift = gain * field.userData.motion;
    const { base } = field.userData;
    const positions = field.geometry.attributes.position.array;
    for (let i = 0; i < base.length; i += 3) {
      positions[i] = wrapCentered(base[i] * span - tmpStarTravel.x * shift, span);
      positions[i + 1] = wrapCentered(base[i + 1] * span - tmpStarTravel.y * shift, span);
      positions[i + 2] = wrapCentered(base[i + 2] * span - tmpStarTravel.z * shift, span);
    }
    field.geometry.attributes.position.needsUpdate = true;
  }
}

function advanceTime(dt) {
  if (!state.playing) return;
  const daysPerSecond = Math.pow(10, state.speedExp) * (state.reverse ? -1 : 1);
  const next = state.jd + daysPerSecond * dt;
  if (next >= JD_MAX || next <= JD_MIN) {
    state.jd = clampJd(next);
    setPlaying(false);
    showToast(t(next >= JD_MAX ? 'toastLimitMax' : 'toastLimitMin'));
    return;
  }
  state.jd = next;
}

let hudAccumulator = 0;
let trailAccumulator = 1;

function frame() {
  const dt = Math.min(clock.getDelta(), 0.1);
  advanceTime(dt);
  if (Math.abs(state.jd - orbitsBuiltAt) > 3650) buildOrbits();
  updateBodies();
  trailAccumulator += dt;
  if (trailAccumulator > 0.033) {
    trailAccumulator = 0;
    updateTrails();
  }
  updateCamera(dt);
  updateStarfield();
  updateOverlays();
  renderer.render(scene, camera);

  hudAccumulator += dt;
  if (hudAccumulator > 0.12) {
    hudAccumulator = 0;
    updateHud();
  }
  requestAnimationFrame(frame);
}

/* ============================ 面板 ============================ */

function formatDate(jd) {
  const date = dateFromJulianDay(jd);
  const year = date.getUTCFullYear();
  if (year < 1000 || year > 4000) {
    const era = year <= 0 ? (lang === 'zh' ? '公元前 ' : 'BC ') : '';
    const shown = year <= 0 ? 1 - year : year;
    return `${era}${shown}${lang === 'zh' ? ' 年' : ''}`;
  }
  try {
    return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-GB', {
      year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function formatSpeed() {
  const dps = Math.pow(10, state.speedExp);
  if (dps < 1) return t('hourUnit', nf(dps * 24, 1));
  if (dps < 45) return t('dayUnit', nf(dps, dps < 10 ? 1 : 0));
  if (dps < 700) return t('monthUnit', nf(dps / 30.44, 1));
  return t('yearUnit', nf(dps / DAYS_PER_YEAR, 1));
}

function formatViewAu(au) {
  if (au >= 1) return t('auValue', nf(au, au >= 10 ? 0 : 1));
  const millionKm = (au * AU_KM) / 1e6;
  return lang === 'zh' ? `${nf(millionKm * 100, 0)} 万 km` : `${nf(millionKm, 1)}M km`;
}

function updateDossier() {
  const body = BODY_BY_ID.get(state.selected);
  const entry = bodyMap.get(state.selected);
  els.bodyEmoji.textContent = body.emoji;
  els.bodyName.textContent = bodyName(body);
  els.bodyFact.textContent = body.fact[lang] || body.fact.zh;
  els.fDiameter.textContent = t('kmValue', nfInt(body.radiusKm * 2));

  const spinDays = Math.abs(body.rotationDays);
  const spinText = spinDays < 1
    ? t('hourUnit', nf(spinDays * 24, 1))
    : t('daysValue', nf(spinDays, 1));
  els.fDay.textContent = body.rotationDays < 0 ? t('retro', spinText) : spinText;

  const earthRadius = PLANETS.find((p) => p.id === 'earth').radiusKm;
  const ratio = body.radiusKm / earthRadius;
  els.compareText.textContent = ratio > 20 ? t('sunTimes', nf(ratio, 1)) : t('earthTimes', nf(ratio, 2));
  els.compareFill.style.transform = `scaleX(${clamp(ratio / 12, 0.02, 1)})`;

  if (body.id === 'sun') {
    els.bodyRole.textContent = t('sunRole');
    els.fDist.textContent = '0 au';
    els.fYear.textContent = '—';
    els.fSpeed.textContent = state.frame === 'none' ? '0 km/s' : `${nf(DRIFT_MODES[state.frame].speedKmS, 1)} km/s`;
    els.fTilt.textContent = '—';
    return;
  }

  const index = PLANETS.findIndex((p) => p.id === body.id) + 1;
  els.bodyRole.textContent = t('planetRole', index);
  const st = heliocentricState(body.id, state.jd);
  els.fDist.textContent = t('auValue', nf(st.radiusAu, 2));
  els.fYear.textContent = entry.period < 1
    ? t('daysValue', nf(entry.period * DAYS_PER_YEAR, 0))
    : t('yearsValue', nf(entry.period, entry.period < 20 ? 1 : 0));
  els.fSpeed.textContent = `${nf(st.speedKmS, 1)} km/s`;
  els.fTilt.textContent = `${nf(Math.abs(st.elements.inclination), 2)}°`;
}

function updateHud() {
  els.dateBadge.textContent = formatDate(state.jd);
  els.frameTag.textContent = t(`frameTag${state.frame[0].toUpperCase()}${state.frame.slice(1)}`);

  const { auPerYear, mode } = driftInfo();
  const years = Math.abs(state.jd - state.jdOrigin) / DAYS_PER_YEAR;
  const travelAu = auPerYear * years;
  if (auPerYear === 0) {
    els.rTravel.textContent = t('travelNone');
    els.rPitch.textContent = t('pitchNone');
    els.rTilt.textContent = t('tiltNone');
  } else {
    const distanceUnitKm = lang === 'zh' ? 1e8 : 1e9;
    els.rTravel.textContent = travelAu < 0.05
      ? t('auValue', nf(travelAu, 3))
      : t('travelWithKm', nf(travelAu, travelAu < 10 ? 2 : 0), nf((travelAu * AU_KM) / distanceUnitKm, 2));
    const ref = state.selected === 'sun' ? BODY_BY_ID.get('earth') : BODY_BY_ID.get(state.selected);
    const period = bodyMap.get(ref.id).period;
    els.rPitch.textContent = t('pitchValue', nf(auPerYear * period, auPerYear * period < 100 ? 1 : 0), bodyName(ref));
    els.rTilt.textContent = t('tiltValue', nf(angleToEclipticDeg(mode.direction), 1));
  }

  const offsetAu = Math.hypot(...sunBarycentricOffset(state.jd));
  const offsetKm = offsetAu * AU_KM;
  els.rWobble.textContent = t(
    'wobbleValue',
    nf(offsetKm / SUN.radiusKm, 2),
    nf(offsetKm / (lang === 'zh' ? 1e4 : 1e3), 0),
  );
  els.rFound.textContent = String(state.visited.size);
  updateDossier();
}

function syncFrameUi() {
  for (const chip of els.frameDock.querySelectorAll('[data-frame]')) {
    const active = chip.dataset.frame === state.frame;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-pressed', String(active));
  }
  els.frameNote.textContent = t(`note${state.frame[0].toUpperCase()}${state.frame.slice(1)}`);
  const moving = state.frame !== 'none';
  els.pitchControl.hidden = !moving;
  if (moving) {
    const { auPerYear } = driftInfo();
    const ref = state.selected === 'sun' ? 'earth' : state.selected;
    const period = bodyMap.get(ref).period;
    els.pitchHint.textContent = t('pitchHint', t('auValue', nf(auPerYear * period, 0)));
  } else {
    els.pitchHint.textContent = t('pitchHintNone');
  }
  els.parallaxRange.disabled = !moving;
  els.parallaxHint.textContent = t(moving ? 'parallaxHint' : 'parallaxHintNone');
}

function syncDockUi(dock, key, value) {
  for (const chip of dock.querySelectorAll(`[data-${key}]`)) {
    const active = chip.dataset[key] === value;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-pressed', String(active));
  }
}

function syncViewUi() {
  for (const btn of document.querySelectorAll('[data-view]')) {
    const active = btn.dataset.view === state.view;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  }
}

function setPlaying(playing) {
  state.playing = playing;
  els.playIcon.textContent = playing ? '⏸' : '▶';
  els.playLabel.textContent = t(playing ? 'pause' : 'play');
  els.playBtn.setAttribute('aria-pressed', String(playing));
}

let toastTimer = 0;
function showToast(text) {
  els.toast.textContent = text;
  els.toast.hidden = false;
  els.toast.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toast.classList.remove('is-on');
    setTimeout(() => { els.toast.hidden = true; }, 300);
  }, 2600);
}

/* ============================ 交互 ============================ */

let interacted = false;
let idleTimer = 0;
let hintedFrame = false;

function markInteraction() {
  if (!interacted) {
    interacted = true;
    window.cool?.stage?.('explore');
  }
  scheduleIdleHint();
}

function scheduleIdleHint() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (state.visited.size < 8) els.sceneHint.textContent = t('hintIdle');
  }, 30000);
}

function selectBody(id, { silent = false } = {}) {
  if (!BODY_BY_ID.has(id)) return;
  const isNew = id !== 'sun' && !state.visited.has(id);
  state.selected = id;
  if (id !== 'sun') state.visited.add(id);
  updateDossier();
  syncFrameUi();
  if (!silent) {
    if (isNew) {
      sound.discover();
      showToast(t('toastFound', bodyName(BODY_BY_ID.get(id)), state.visited.size));
    } else {
      sound.select();
    }
  }
  if (isNew && !hintedFrame && state.visited.size === 1) {
    hintedFrame = true;
    els.sceneHint.textContent = t('hintFrame');
  }
  if (state.visited.size === 8 && !state.completed) {
    state.completed = true;
    window.cool?.complete?.();
    sound.finale();
    showToast(t('toastAll'));
    track('solar_all_planets');
  }
  track('solar_select', { body: id });
}

function pickBody(clientX, clientY) {
  const rect = els.scene.getBoundingClientRect();
  let best = null;
  let bestDist = 34;
  for (const entry of bodyMap.values()) {
    tmpVec.copy(entry.position).project(camera);
    if (tmpVec.z > 1) continue;
    const x = rect.left + ((tmpVec.x + 1) / 2) * rect.width;
    const y = rect.top + ((1 - tmpVec.y) / 2) * rect.height;
    const d = Math.hypot(x - clientX, y - clientY);
    if (d < bestDist) { bestDist = d; best = entry.body.id; }
  }
  return best;
}

let previousView = 'top';
let zoomBeforeFollow = Math.pow(10, 0.78);

function applyViewPreset(view, { silent = false } = {}) {
  state.view = view;
  syncViewUi();
  if (view === 'top') {
    camState.targetPolar = 0.18;
  } else if (view === 'side') {
    camState.targetPolar = 1.53;
  } else if (view === 'helix') {
    const { dir } = driftInfo();
    const perp = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0));
    if (perp.lengthSq() < 1e-6) perp.set(1, 0, 0);
    perp.normalize();
    camState.targetAzimuth = Math.atan2(perp.x, perp.z);
    camState.targetPolar = 1.32;
    if (state.frame === 'none') showToast(t('helixNeedsFrame'));
  } else if (view === 'follow') {
    if (state.selected === 'sun') {
      showToast(t('toastNeedPlanet'));
      state.view = previousView === 'follow' ? 'top' : previousView;
      if (previousView === 'follow') setViewAu(zoomBeforeFollow);
      previousView = state.view;
      syncViewUi();
      if (!silent) {
        sound.click();
        track('solar_view', { view: 'follow', rejected: true });
      }
      return;
    }
    camState.targetPolar = 1.1;
    if (previousView !== 'follow') zoomBeforeFollow = state.viewAu;
    setViewAu(unitsToAu(displayRadius(BODY_BY_ID.get(state.selected)) * 3.6));
    showToast(t('toastFollow', bodyName(BODY_BY_ID.get(state.selected))));
  }
  if (previousView === 'follow' && view !== 'follow') setViewAu(zoomBeforeFollow);
  previousView = state.view;
  if (!silent) {
    sound.click();
    track('solar_view', { view });
  }
}

function setViewAu(au, { sync = true } = {}) {
  state.viewAu = clamp(au, Math.pow(10, Number(els.zoomRange.min)), Math.pow(10, Number(els.zoomRange.max)));
  els.zoomValue.textContent = formatViewAu(state.viewAu);
  if (sync) els.zoomRange.value = String(Math.log10(state.viewAu));
}

function bindPointer() {
  const canvas = els.scene;
  const pointers = new Map();
  let dragging = false;
  let moved = 0;
  let last = { x: 0, y: 0 };
  let pinchStart = 0;
  let pinchAu = 0;
  let pinched = false;

  canvas.addEventListener('pointerdown', (event) => {
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) {
      dragging = true;
      moved = 0;
      pinched = false;
      last = { x: event.clientX, y: event.clientY };
    } else if (pointers.size === 2) {
      pinched = true;
      const [a, b] = [...pointers.values()];
      pinchStart = Math.hypot(a.x - b.x, a.y - b.y);
      pinchAu = state.viewAu;
    }
    markInteraction();
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) {
      canvas.classList.toggle('is-over-body', Boolean(pickBody(event.clientX, event.clientY)));
      return;
    }
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchStart > 8) setViewAu(pinchAu * (pinchStart / dist));
      return;
    }
    if (!dragging) return;
    const dx = event.clientX - last.x;
    const dy = event.clientY - last.y;
    last = { x: event.clientX, y: event.clientY };
    moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 6) canvas.classList.add('is-dragging');
    camState.targetAzimuth -= dx * 0.006;
    camState.targetPolar = clamp(camState.targetPolar - dy * 0.006, 0.06, Math.PI - 0.06);
    camState.azimuth = camState.targetAzimuth;
    camState.polar = camState.targetPolar;
  });

  const release = (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId);
    canvas.classList.remove('is-dragging');
    if (pointers.size === 0 && dragging) {
      dragging = false;
      if (!pinched && moved < 8) {
        const hit = pickBody(event.clientX, event.clientY);
        if (hit) selectBody(hit);
      } else {
        track('solar_orbit_camera');
      }
      pinched = false;
    }
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    markInteraction();
    setViewAu(state.viewAu * Math.exp(event.deltaY * 0.0012));
  }, { passive: false });
}

function bindUi() {
  els.playBtn.addEventListener('click', () => {
    setPlaying(!state.playing);
    sound.click();
    markInteraction();
    track('solar_play', { playing: state.playing });
  });

  els.reverseBtn.addEventListener('click', () => {
    state.reverse = !state.reverse;
    els.reverseBtn.classList.toggle('is-active', state.reverse);
    els.reverseBtn.setAttribute('aria-pressed', String(state.reverse));
    sound.click();
    markInteraction();
    track('solar_reverse', { reverse: state.reverse });
  });

  els.todayBtn.addEventListener('click', () => {
    state.jd = clampJd(julianDayFromDate(new Date()));
    state.jdOrigin = state.jd;
    buildOrbits();
    sound.click();
    markInteraction();
    updateHud();
    track('solar_today');
  });

  els.frameDock.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-frame]');
    if (!chip) return;
    state.frame = chip.dataset.frame;
    state.jdOrigin = state.jd;
    syncFrameUi();
    sound.frame();
    markInteraction();
    showToast(t('toastFrame', chip.querySelector('b').textContent));
    if (state.view === 'helix') applyViewPreset('helix', { silent: true });
    updateHud();
    track('solar_frame', { frame: state.frame });
  });

  els.distanceDock.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-distance]');
    if (!chip) return;
    state.distance = chip.dataset.distance;
    syncDockUi(els.distanceDock, 'distance', state.distance);
    buildGrid();
    buildOrbits();
    sound.click();
    markInteraction();
    track('solar_distance', { mode: state.distance });
  });

  els.trailDock.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-trail]');
    if (!chip) return;
    state.trail = chip.dataset.trail;
    syncDockUi(els.trailDock, 'trail', state.trail);
    sound.click();
    markInteraction();
    track('solar_trail', { mode: state.trail });
  });

  els.layerDock.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-layer]');
    if (!btn) return;
    const key = btn.dataset.layer;
    state.layers[key] = !state.layers[key];
    btn.classList.toggle('is-active', state.layers[key]);
    btn.setAttribute('aria-pressed', String(state.layers[key]));
    sound.click();
    markInteraction();
  });

  for (const btn of document.querySelectorAll('[data-view]')) {
    btn.addEventListener('click', () => {
      applyViewPreset(btn.dataset.view);
      markInteraction();
    });
  }

  els.pitchRange.addEventListener('input', () => {
    state.pitch = Number(els.pitchRange.value) / 100;
    els.pitchValue.textContent = `${els.pitchRange.value}%`;
    sound.tick();
    markInteraction();
  });
  els.pitchRange.addEventListener('change', () => track('solar_pitch', { pitch: state.pitch }));

  els.speedRange.addEventListener('input', () => {
    state.speedExp = Number(els.speedRange.value);
    els.speedValue.textContent = formatSpeed();
    sound.tick();
    markInteraction();
  });

  els.zoomRange.addEventListener('input', () => {
    setViewAu(Math.pow(10, Number(els.zoomRange.value)), { sync: false });
    sound.tick();
    markInteraction();
  });

  els.magnifyRange.addEventListener('input', () => {
    state.magnify = Number(els.magnifyRange.value);
    els.magnifyValue.textContent = `×${nf(state.magnify, 1)}`;
    sound.tick();
    markInteraction();
  });

  els.parallaxRange.addEventListener('input', () => {
    state.parallax = Number(els.parallaxRange.value) / 100;
    els.parallaxValue.textContent = `${els.parallaxRange.value}%`;
    sound.tick();
    markInteraction();
  });
  els.parallaxRange.addEventListener('change', () => track('solar_parallax', { amount: state.parallax }));

}

function bindChromeUi() {
  els.soundBtn.addEventListener('click', () => {
    muted = !muted;
    window.cool?.storage?.set(SOUND_KEY, muted ? '1' : '0');
    syncSoundBtn();
    if (!muted) sound.click();
  });

  els.themeBtn.addEventListener('click', () => {
    window.cool?.preferences?.toggleTheme();
    sound.click();
  });

  els.langBtn.addEventListener('click', () => {
    window.cool?.preferences?.toggleLang();
    sound.click();
  });

  els.sheetHandle.addEventListener('click', () => {
    const collapsed = els.console.classList.toggle('is-collapsed');
    els.sheetHandle.setAttribute('aria-expanded', String(!collapsed));
    sound.click();
  });

  window.addEventListener('keydown', (event) => {
    if (event.target.matches('input, button, a')) return;
    if (event.code === 'Space') {
      event.preventDefault();
      setPlaying(!state.playing);
      sound.click();
      markInteraction();
    }
  });
}

function resize() {
  const rect = els.scene.parentElement.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function syncChrome() {
  els.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
  els.themeBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
  els.themeBtn.setAttribute('aria-label', t(theme === 'dark' ? 'themeToLight' : 'themeToDark'));
  syncSoundBtn();
}

function syncLanguage() {
  syncChrome();
  setPlaying(state.playing);
  els.speedValue.textContent = formatSpeed();
  els.zoomValue.textContent = formatViewAu(state.viewAu);
  els.magnifyValue.textContent = `×${nf(state.magnify, 1)}`;
  els.parallaxRange.value = String(Math.round(state.parallax * 100));
  els.parallaxValue.textContent = `${Math.round(state.parallax * 100)}%`;
  els.pitchValue.textContent = `${Math.round(state.pitch * 100)}%`;
  if (!interacted || state.visited.size === 0) els.sceneHint.textContent = t('hintDefault');
  syncFrameUi();
  for (const entry of bodyMap.values()) {
    if (entry.label) drawLabel(entry.label, bodyName(entry.body));
  }
  updateHud();
}

/* ============================ 启动 ============================ */

function boot() {
  palette = themeColors();
  bindChromeUi();

  window.cool?.bindI18n?.(I18N, {
    onChange: ({ kind, lang: nextLang, theme: nextTheme }) => {
      lang = nextLang;
      const themeChanged = nextTheme !== theme;
      theme = nextTheme;
      if (scene && themeChanged) applyThemeToScene();
      if (scene) syncLanguage();
      else syncChrome();
    },
  });

  lang = window.cool?.preferences?.lang || lang;
  theme = window.cool?.preferences?.theme || theme;
  syncChrome();

  try {
    buildScene();
  } catch (error) {
    els.loading.hidden = true;
    els.nogl.hidden = false;
    console.warn('WebGL unavailable', error);
    return;
  }

  resize();
  bindPointer();
  bindUi();
  syncDockUi(els.distanceDock, 'distance', state.distance);
  syncDockUi(els.trailDock, 'trail', state.trail);
  syncViewUi();
  selectBody('earth', { silent: true });
  state.visited.clear();
  applyViewPreset('top', { silent: true });
  camState.targetAzimuth = 0.62;
  camState.azimuth = 0.62;
  camState.polar = camState.targetPolar;

  syncLanguage();
  scheduleIdleHint();

  window.addEventListener('resize', resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(els.scene.parentElement);

  els.loading.hidden = true;
  clock.getDelta();
  requestAnimationFrame(frame);
}

boot();
