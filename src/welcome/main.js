/* ============================================================
   欢迎来到KidsLab · 从一盏灯到宇宙
   —— 六幕宇宙拉远之旅：台灯 → 城市 → 地球 → 太阳系 → 银河 → 宇宙
   固定相机 + 分幕指数缩放模拟推拉镜头，3.2s 交叉溶解，74s 循环。
   ============================================================ */
import * as THREE from './vendor/three.module.min.js';
import { createMusic } from './music.js';
import { buildStages } from './stages.js';

/* ---------- 文案 ---------- */
const POEM = {
  zh: [
    '从一盏灯出发，路过整座城市的光',
    '地球转过身，把黎明借给我们',
    '太阳，是银河沙滩上的一粒沙',
    '而你的好奇心，比宇宙更辽阔',
  ],
  en: [
    'Set out from a lamp, past a whole city of light',
    'The Earth turns round, lending us the dawn',
    'The Sun — one grain of sand on the galaxy\u2019s shore',
    'And your curiosity is wider than the universe',
  ],
};

const STAGE_META = [
  { emoji: '💡', zh: ['眼前', '一盏灯'], en: ['Up close', 'one lamp'] },
  { emoji: '🌃', zh: ['城市', '10 千米'], en: ['City', '10 km'] },
  { emoji: '🌍', zh: ['地球', '12,742 千米'], en: ['Earth', '12,742 km'] },
  { emoji: '☀️', zh: ['太阳系', '90 亿千米'], en: ['Solar System', '9 bn km'] },
  { emoji: '🌌', zh: ['银河系', '10 万光年'], en: ['Milky Way', '100k light-years'] },
  { emoji: '✨', zh: ['可观测宇宙', '930 亿光年'], en: ['Universe', '93 bn light-years'] },
];

const I18N = {
  zh: {
    docTitle: '欢迎来到KidsLab · 从一盏灯到宇宙',
    back: '返回平台',
    kicker: 'K12 · 互动课件学习乐园',
    title: 'KidsLab',
    cta: '进入课程乐园 →',
    credit: '为 6–18 岁的好奇心而造',
    nogl: '你的浏览器暂不支持 WebGL，但学习的星辰依然为你闪耀 ✨',
    hintMusic: '点一下屏幕，让音乐响起',
    hintLook: '移动鼠标，环顾星海 · 点下方圆点跳转',
    musicOn: '开', musicOff: '关',
    musicAria: '背景音乐开关', langAria: '切换语言', langBtn: 'EN',
    journeyAria: '宇宙旅程', jumpTo: '前往：',
  },
  en: {
    docTitle: 'Welcome to KidsLab · From a Lamp to the Cosmos',
    back: 'Back to platform',
    kicker: 'K12 · Interactive Courseware Playground',
    title: 'KidsLab',
    cta: 'Enter the playground →',
    credit: 'Built for curious minds aged 6–18',
    nogl: 'Your browser lacks WebGL, but the stars of learning still shine for you ✨',
    hintMusic: 'Tap anywhere to start the music',
    hintLook: 'Move your mouse to look around · tap a dot below to jump',
    musicOn: 'On', musicOff: 'Off',
    musicAria: 'Toggle background music', langAria: 'Switch language', langBtn: '中文',
    journeyAria: 'Cosmic journey', jumpTo: 'Jump to: ',
  },
};

const POEM_MAP = [0, 0, 1, 2, 2, 3];        // 幕 → 高亮诗行
const MUSIC_LEVEL = [0.25, 0.4, 0.55, 0.7, 0.85, 1]; // 幕 → 音乐强度

/* ---------- DOM ---------- */
const $ = (id) => document.getElementById(id);
const canvas = $('scene');
const poemBox = $('poem');
const poemLines = [...poemBox.querySelectorAll('.poem__line')];
const capEl = $('journeyCaption');
const dotsBox = $('journeyDots');
const hintText = $('hintText');
const musicBtn = $('musicBtn');
const musicState = $('musicState');
const langBtn = $('langBtn');
const themeBtn = $('themeBtn');
const titleEl = $('title');

/* ---------- 状态 ---------- */
const LS_MUSIC = 'kidslab.welcome.music';
let lang = window.cool.preferences.lang;
let musicStarted = false;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const music = createMusic();
const langHooks = [];

/* ---------- WebGL 引导 ---------- */
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) {
  renderer = null;
}
if (!renderer) {
  canvas.remove();
  $('nogl').hidden = false;
}

/* ---------- 场景与时间轴 ---------- */
let stages = [], starts = [], TOTAL = 0;
const CF = 3.2;                              // 交叉溶解时长
let scene3, camera, rig;
let dominant = -1;
let tl = 0;                                  // 时间轴（秒）
let speed = reduced ? 0.45 : 1;
let running = true;
let curIntensity = 0.25;
const clock = new THREE.Clock();
const parallax = { tx: 0, ty: 0 };

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smooth = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function collectFadables(st) {
  const mats = [], lights = [];
  st.group.traverse((o) => {
    if (o.isLight) lights.push({ light: o, base: o.intensity });
    const m = o.material;
    if (!m) return;
    for (const mat of Array.isArray(m) ? m : [m]) {
      mats.push({
        mat,
        baseOpacity: mat.opacity,
        baseTransparent: mat.transparent,
        baseDepthWrite: mat.depthWrite,
      });
    }
  });
  st.fMats = mats;
  st.fLights = lights;
  st.lastAlpha = -1;
}

function setFade(st, a) {
  if (a === st.lastAlpha) return;
  st.lastAlpha = a;
  if (a <= 0.001) { st.group.visible = false; return; }
  st.group.visible = true;
  for (const L of st.fLights) L.light.intensity = L.base * a;
  if (a >= 0.999) {
    for (const f of st.fMats) {
      f.mat.opacity = f.baseOpacity;
      f.mat.transparent = f.baseTransparent;
      f.mat.depthWrite = f.baseDepthWrite;
    }
  } else {
    for (const f of st.fMats) {
      f.mat.opacity = f.baseOpacity * a;
      f.mat.transparent = true;
      if (f.baseDepthWrite) f.mat.depthWrite = false;
    }
  }
  if (st.onFade) for (const fn of st.onFade) fn(a);
}

function initGL() {
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene3 = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 400);
  camera.position.set(0, 0, 26);
  rig = new THREE.Group();
  rig.add(camera);
  scene3.add(rig);
  scene3.add(new THREE.AmbientLight(0x243a66, 0.2));

  stages = buildStages(THREE, (fn) => langHooks.push(fn));
  let acc = 0;
  for (const st of stages) {
    starts.push(acc);
    acc += st.dur;
    collectFadables(st);
    st.group.visible = false;
    scene3.add(st.group);
  }
  TOTAL = acc;
}

/* 时间轴推进：窗口 [S−CF, S+D]，首尾各 CF 溶解，组变换全窗插值 */
function applyTimeline(t, dt) {
  for (let i = 0; i < stages.length; i++) {
    const st = stages[i];
    const L = st.dur + CF;
    const dt0 = (t - (starts[i] - CF) + TOTAL) % TOTAL;
    if (dt0 >= L) { setFade(st, 0); continue; }
    const a = Math.min(smooth(dt0 / CF), smooth((L - dt0) / CF));
    setFade(st, a);
    const p = dt0 / L;
    const z = st.zoomFrom * Math.pow(st.zoomTo / st.zoomFrom, p);
    st.group.scale.setScalar(z);
    const e = easeInOut(p);
    st.group.position.set(
      lerp(st.posFrom[0], st.posTo[0], e) * z,
      lerp(st.posFrom[1], st.posTo[1], e) * z,
      lerp(st.posFrom[2], st.posTo[2], e) * z
    );
    st.group.rotation.set(
      lerp(st.rotFrom[0], st.rotTo[0], e),
      lerp(st.rotFrom[1], st.rotTo[1], e),
      lerp(st.rotFrom[2], st.rotTo[2], e)
    );
    st.update(dt, t);
  }
  let d = stages.length - 1;
  for (let i = 0; i < stages.length; i++) {
    if (t >= starts[i] && t < starts[i] + stages[i].dur) { d = i; break; }
  }
  if (d !== dominant) setDominant(d);
}

/* ---------- 幕切换 → UI/音乐联动 ---------- */
function captionText(i) {
  const m = STAGE_META[i];
  return `${m.emoji} ${m[lang][0]} · ${m[lang][1]}`;
}

function setDominant(i, { quiet = false } = {}) {
  const first = dominant === -1;
  dominant = i;
  poemLines.forEach((el, k) => el.classList.toggle('poem__line--on', k === POEM_MAP[i]));
  [...dotsBox.children].forEach((b, k) => {
    b.classList.toggle('jdot--on', k === i);
    b.setAttribute('aria-pressed', k === i ? 'true' : 'false');
  });
  capEl.textContent = captionText(i);
  if (!first) {
    capEl.style.animation = 'none';
    void capEl.offsetWidth;
    capEl.style.animation = '';
  }
  if (!first && !quiet) music.swell();
}

/* ---------- 旅程圆点 ---------- */
function buildJourney() {
  STAGE_META.forEach((m, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'jdot';
    b.textContent = m.emoji;
    b.addEventListener('click', () => jumpTo(i));
    dotsBox.appendChild(b);
  });
}

let jumping = false;
function jumpTo(i) {
  if (!renderer || jumping || i === dominant) return;
  jumping = true;
  canvas.classList.add('dim');
  setTimeout(() => {
    tl = (starts[i] + 0.02) % TOTAL;
    applyTimeline(tl, 0);
    canvas.classList.remove('dim');
    jumping = false;
  }, 300);
}

/* ---------- 音乐 ---------- */
function syncMusicUI() {
  const t = I18N[lang];
  musicState.textContent = music.on ? t.musicOn : t.musicOff;
  musicBtn.classList.toggle('pill--on', music.on);
  musicBtn.setAttribute('aria-pressed', music.on ? 'true' : 'false');
  hintText.textContent = musicStarted || localStorage.getItem(LS_MUSIC) === 'off'
    ? t.hintLook : t.hintMusic;
}

function startMusic() {
  music.start();
  music.setIntensity(curIntensity);
  musicStarted = true;
  localStorage.setItem(LS_MUSIC, 'on');
  syncMusicUI();
}

musicBtn.addEventListener('click', () => {
  if (music.on) {
    music.stop();
    localStorage.setItem(LS_MUSIC, 'off');
    musicStarted = true;
    syncMusicUI();
  } else {
    startMusic();
  }
});

function firstGesture(e) {
  if (musicStarted || music.on) return;
  if (e && e.target && musicBtn.contains(e.target)) return;
  if (localStorage.getItem(LS_MUSIC) === 'off') return;
  startMusic();
}
addEventListener('pointerdown', firstGesture);
addEventListener('keydown', firstGesture);

/* ---------- 语言 ---------- */
function applyLang() {
  const t = I18N[lang];
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t.docTitle;
  document.querySelectorAll('[data-t]').forEach((el) => {
    const k = el.getAttribute('data-t');
    if (t[k]) el.textContent = t[k];
  });
  titleEl.textContent = t.title;
  titleEl.classList.toggle('title--en', lang === 'en');
  poemBox.classList.toggle('poem--en', lang === 'en');
  poemLines.forEach((el, i) => { el.textContent = POEM[lang][i]; });
  langBtn.textContent = t.langBtn;
  langBtn.setAttribute('aria-label', t.langAria);
  musicBtn.setAttribute('aria-label', t.musicAria);
  $('journey').setAttribute('aria-label', t.journeyAria);
  [...dotsBox.children].forEach((b, i) => {
    b.setAttribute('aria-label', t.jumpTo + STAGE_META[i][lang][0]);
  });
  if (dominant >= 0) capEl.textContent = captionText(dominant);
  syncMusicUI();
  for (const fn of langHooks) fn(lang);
}

function applyTheme() {
  const dark = window.cool.preferences.theme === 'dark';
  themeBtn.textContent = dark ? '☀️' : '🌙';
  if (renderer) renderer.toneMappingExposure = dark ? 1.05 : 0.9;
}

langBtn.addEventListener('click', () => window.cool.preferences.toggleLang());
themeBtn.addEventListener('click', () => window.cool.preferences.toggleTheme());
window.cool.preferences.subscribe(({ kind }) => {
  if (kind === 'lang') {
    lang = window.cool.preferences.lang;
    applyLang();
  } else {
    applyTheme();
  }
});

/* ---------- 视差 ---------- */
addEventListener('pointermove', (e) => {
  const nx = e.clientX / innerWidth - 0.5;
  const ny = e.clientY / innerHeight - 0.5;
  parallax.ty = nx * -0.09;
  parallax.tx = ny * 0.055;
});
addEventListener('deviceorientation', (e) => {
  if (e.beta == null || e.gamma == null) return;
  parallax.ty = THREE.MathUtils.clamp(e.gamma / 90, -1, 1) * -0.08;
  parallax.tx = THREE.MathUtils.clamp((e.beta - 45) / 90, -1, 1) * 0.05;
});

/* ---------- 主循环 ---------- */
let rafId = 0;
function frame() {
  if (!running) return;
  rafId = requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05) * speed;
  if (!jumping) tl = (tl + dt) % TOTAL;
  applyTimeline(tl, dt);

  const target = MUSIC_LEVEL[dominant] ?? 0.25;
  curIntensity += (target - curIntensity) * Math.min(1, dt * 0.9);
  music.setIntensity(curIntensity);

  const k = reduced ? 0 : Math.min(1, dt * 3.2);
  rig.rotation.x += (parallax.tx - rig.rotation.x) * k;
  rig.rotation.y += (parallax.ty - rig.rotation.y) * k;

  renderer.render(scene3, camera);
}

addEventListener('resize', () => {
  if (!renderer) return;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});

document.addEventListener('visibilitychange', () => {
  if (!renderer) return;
  if (document.hidden) {
    running = false;
    cancelAnimationFrame(rafId);
    music.suspend();
  } else {
    running = true;
    cancelAnimationFrame(rafId);
    clock.getDelta();
    music.resume();
    frame();
  }
});

/* ---------- 启动 ---------- */
buildJourney();
applyTheme();
if (renderer) {
  initGL();
  applyLang();
  applyTimeline(0, 0);
  frame();
  window.__setTl = (t) => { tl = ((t % TOTAL) + TOTAL) % TOTAL; };
  Object.defineProperty(window, '__tl', { get: () => tl });
} else {
  applyLang();
}
