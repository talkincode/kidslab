import { createAudio } from './audio.js';
import {
  EARTH_RADIUS,
  LAUNCH_ALTITUDES,
  crashSpeed,
  circularSpeed,
  escapeSpeed,
  radiusFromAltitude,
} from './orbit-model.js';
import {
  LAP_TARGET_SECONDS,
  abort,
  createLab,
  launch,
  parseLab,
  recordTrial,
  resetLab,
  serializeLab,
  setAltitudeKm,
  setShowVectors,
  setSpeedRatio,
  snapshot,
  stepLab,
} from './lab-model.js';
import { createOrbitScene } from './scene.js';

const STORE_KEY = 'kidslab.circular-orbit-lab';
const KIND_KEYS = Object.freeze({
  circular: 'kindCircular',
  ellipse: 'kindEllipse',
  crash: 'kindCrash',
  escape: 'kindEscape',
});
const STATUS_KEYS = Object.freeze({
  ready: 'ready',
  flying: 'flying',
  orbiting: 'orbiting',
  crashed: 'crashed',
  escaped: 'escaped',
});
const REASON_KEY = Object.freeze({
  'no-flight': 'noFlight',
  'still-flying': 'stillFlying',
  'duplicate-trial': 'duplicate',
  'out-of-range-altitude': 'outOfRange',
  'out-of-range-speed': 'outOfRange',
  'invalid-altitude': 'outOfRange',
  'invalid-speed': 'outOfRange',
});

const I18N = {
  zh: {
    doc: '🛰️ 圆周与卫星实验室 · KidsLab',
    back: '返回平台',
    title: '圆周与卫星实验室',
    nogl: '浏览器暂时跑不了 3D 实验室，换一个新一点的浏览器再来观测吧。',
    hudAlt: '高度',
    hudSpeed: '速度',
    hudTime: '时钟',
    hudStatus: '状态',
    tip0: '拧速度再发射，看它掉回来、绕圈还是飞走',
    panelTitle: '发射台',
    btnLaunch: '发射',
    btnAbort: '收回',
    btnVectors: '受力箭头',
    btnRecord: '记下这次',
    btnReset: '重新实验',
    feedbackIdle: '先对准「环绕」那个数，看卫星画圆。',
    labH: '发射高度',
    labV: '水平速度',
    labNow: '这一次读数',
    markCircular: '环绕',
    markEscape: '逃逸',
    bandTitle: '速度带',
    bandChartTitle: '高度与速度的轨道分区图',
    bandNote: '上边那条是逃逸，中间是环绕。越高，两条线都往下走。',
    axisSpeed: 'v / km·s⁻¹',
    axisAltitude: '高度 / 千 km',
    logTitle: '观测记录',
    colAltitude: '高度',
    colSpeed: '速度',
    colKind: '轨道',
    colPeriod: '周期',
    colPerigee: '近地点',
    lessonTitle: '小课堂：卫星为什么不掉下来？',
    lessonText: '引力把它往地球拉，速度让它往旁边冲。两个刚好抵上，就画圆。慢了最低点会擦进大气，快了变成椭圆，再快就一去不回。一圈的时间和地球自转一样时，它会停在同一片天空上方。',
    footTip: '拖空白转视角 · 右侧拧旋钮，左侧看轨道',
    musicOn: '关闭背景音乐',
    musicOff: '打开背景音乐',
    sfxOn: '关闭音效',
    sfxOff: '打开音效',
    theme: '切换主题',
    ready: '待发射',
    flying: '飞行中',
    orbiting: '已入轨',
    crashed: '坠入大气',
    escaped: '飞离地球',
    kindCircular: '圆轨',
    kindEllipse: '椭圆',
    kindCrash: '坠回',
    kindEscape: '逃逸',
    belowGround: '地面以下',
    complete: '同一个高度：慢了坠回，快了飞走，中间那一档才留得住。',
    stillFlying: '还在飞，等它画完一圈或有结局再记。',
    noFlight: '还没发射，先把卫星送出去。',
    duplicate: '这一组已经记录过了。',
    recorded: '记下了。改一个旋钮，再发射比一比。',
    launched: '点火了。看它往哪走。',
    aborted: '卫星收回了。改个参数再来。',
    circularHit: '正圆！引力刚好只用来拐弯。',
    orbited: '绕完一圈了。把读数记进表里。',
    crashTip: '它擦进大气了 —— 速度不够，引力赢了。',
    escapeTip: '它挣脱了引力，再也不回来了。',
    syncTip: '一圈差不多一天，它会停在同一片天空上方。',
    outOfRange: '这个旋钮拧过头了，先回到刻度里。',
  },
  en: {
    doc: '🛰️ Circular Orbit Lab · KidsLab',
    back: 'Back to platform',
    title: 'Circular Orbit Lab',
    nogl: 'WebGL is unavailable, so the 3D lab cannot start. Try a newer browser.',
    hudAlt: 'Altitude',
    hudSpeed: 'Speed',
    hudTime: 'Clock',
    hudStatus: 'Status',
    tip0: 'Dial the speed, launch, and watch it fall, circle, or leave',
    panelTitle: 'Launch desk',
    btnLaunch: 'Launch',
    btnAbort: 'Recall',
    btnVectors: 'Force arrows',
    btnRecord: 'Record this',
    btnReset: 'Start over',
    feedbackIdle: 'Match the circular mark first and watch it draw a circle.',
    labH: 'Launch altitude',
    labV: 'Horizontal speed',
    labNow: 'This run',
    markCircular: 'Circular',
    markEscape: 'Escape',
    bandTitle: 'Speed bands',
    bandChartTitle: 'Altitude–speed orbit map',
    bandNote: 'The upper curve is escape, the middle is circular. Both drop as height rises.',
    axisSpeed: 'v / km·s⁻¹',
    axisAltitude: 'altitude / 10³ km',
    logTitle: 'Lab notes',
    colAltitude: 'Alt.',
    colSpeed: 'Speed',
    colKind: 'Orbit',
    colPeriod: 'Period',
    colPerigee: 'Low point',
    lessonTitle: 'Why doesn’t the satellite fall?',
    lessonText: 'Gravity pulls it toward Earth; speed sends it sideways. When they match, you get a circle. Too slow and the low point grazes the air; too fast and it becomes an ellipse, then leaves. When one lap lasts as long as Earth’s spin, it hangs over the same patch of sky.',
    footTip: 'Drag to orbit · tune knobs on the right, watch the path on the left',
    musicOn: 'Mute music',
    musicOff: 'Unmute music',
    sfxOn: 'Mute sound effects',
    sfxOff: 'Unmute sound effects',
    theme: 'Toggle theme',
    ready: 'Ready',
    flying: 'In flight',
    orbiting: 'In orbit',
    crashed: 'Re-entered',
    escaped: 'Left Earth',
    kindCircular: 'Circle',
    kindEllipse: 'Ellipse',
    kindCrash: 'Falls back',
    kindEscape: 'Escapes',
    belowGround: 'below ground',
    complete: 'At one altitude: too slow falls back, too fast flies off, and only the middle band stays.',
    stillFlying: 'Still flying — record after a lap or an ending.',
    noFlight: 'Nothing has been launched yet.',
    duplicate: 'That run is already in the table.',
    recorded: 'Saved. Change one knob and launch again to compare.',
    launched: 'Ignition. Watch where it goes.',
    aborted: 'Satellite recalled. Change something and try again.',
    circularHit: 'A true circle! Gravity is spent entirely on turning.',
    orbited: 'One full lap. Copy the readings into the table.',
    crashTip: 'It grazed the atmosphere — too slow, gravity won.',
    escapeTip: 'It broke free of gravity and will not return.',
    syncTip: 'One lap is about a day, so it hangs over the same patch of sky.',
    outOfRange: 'That knob went past its scale. Bring it back.',
  },
};

let t = (key) => I18N.zh[key] ?? key;
const $ = (id) => document.getElementById(id);
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const langBtn = $('langBtn');
const themeBtn = $('themeBtn');
const musicBtn = $('musicBtn');
const soundBtn = $('soundBtn');
const panel = $('panel');
const panelBody = $('panelBody');
const panelHandle = $('panelHandle');
const panelArrow = $('panelArrow');
const coach = $('coach');
const feedback = $('feedback');

const audio = createAudio(STORE_KEY);
let lab = loadLab();
let scene = null;
let unlocked = false;
let last = performance.now();
let lang = 'zh';

let panelOpen = matchMedia('(min-width: 761px)').matches;
function applyPanel() {
  panel.classList.toggle('is-collapsed', !panelOpen);
  panelBody.hidden = !panelOpen;
  panelArrow.textContent = panelOpen ? '▾' : '▸';
  panelHandle.setAttribute('aria-expanded', String(panelOpen));
}
panelHandle.addEventListener('click', () => {
  panelOpen = !panelOpen;
  applyPanel();
});
applyPanel();

$('lessonBtn').addEventListener('click', () => {
  $('lessonBody').hidden = !$('lessonBody').hidden;
  $('lessonArrow').textContent = $('lessonBody').hidden ? '▸' : '▾';
});

function loadLab() {
  try {
    const restored = parseLab(localStorage.getItem(STORE_KEY));
    if (restored.ok) return restored.lab;
  } catch { /* private mode */ }
  return createLab();
}

function persist() {
  try {
    localStorage.setItem(STORE_KEY, serializeLab(lab));
  } catch { /* private mode */ }
}

function formatDuration(seconds) {
  if (seconds === null || !Number.isFinite(seconds)) return '—';
  const minutes = seconds / 60;
  if (minutes < 120) return `${minutes.toFixed(1)} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours} h ${Math.round(minutes - hours * 60)} min`;
}

function kmString(meters) {
  return `${Math.round(meters / 1000).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')} km`;
}

function kmsString(metersPerSecond) {
  return `${(metersPerSecond / 1000).toFixed(2)} km/s`;
}

function perigeeLabel(meters) {
  if (meters === null || !Number.isFinite(meters)) return '—';
  const altitude = meters - EARTH_RADIUS;
  return altitude <= 0 ? t('belowGround') : kmString(altitude);
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
  $('circularCurve').setAttribute('d', pathFrom(circular));
  $('escapeCurve').setAttribute('d', pathFrom(escape));
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
  $('bandFills').replaceChildren(fills);

  const points = document.createDocumentFragment();
  lab.trials.forEach((trial) => {
    const dot = document.createElementNS(svgNs, 'circle');
    dot.setAttribute('class', `band-point band-point--${trial.kind}`);
    dot.setAttribute('cx', bandX(trial.altitudeKm).toFixed(1));
    dot.setAttribute('cy', bandY(trial.speed / 1000).toFixed(1));
    dot.setAttribute('r', '4.4');
    points.append(dot);
  });
  $('bandPoints').replaceChildren(points);
}

function paint() {
  const view = snapshot(lab);
  $('altHud').textContent = kmString(view.altitudeKm * 1000);
  $('speedHud').textContent = kmsString(view.speed);
  $('timeVal').textContent = formatDuration(view.clock);
  $('statusVal').textContent = t(STATUS_KEYS[view.status]);
  $('altitudeVal').textContent = kmString(view.altitudeKm * 1000);
  $('speedVal').textContent = kmsString(view.speed);
  $('altitudeRange').value = String(view.altitudeKm);
  $('speedRange').value = String(Math.round(view.speedRatio * 1000));
  $('markCircular').textContent = (view.circularSpeed / 1000).toFixed(2);
  $('markEscape').textContent = (view.escapeSpeed / 1000).toFixed(2);
  $('kindVal').textContent = lab.pending ? t(KIND_KEYS[lab.pending.kind] || 'kindEllipse') : '—';
  $('periodVal').textContent = lab.pending ? formatDuration(lab.pending.period) : '—';
  $('perigeeVal').textContent = lab.pending ? perigeeLabel(lab.pending.perigee) : '—';
  $('vectorBtn').setAttribute('aria-pressed', String(lab.showVectors));
  $('abortBtn').disabled = !lab.launched;
  const rate = lab.launched && lab.referencePeriod
    ? Math.round(lab.referencePeriod / LAP_TARGET_SECONDS)
    : 1;
  $('rateChip').textContent = `×${rate.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}`;

  document.querySelectorAll('[data-altitude]').forEach((button) => {
    button.classList.toggle('is-on', Number(button.dataset.altitude) === view.altitudeKm);
  });

  const rows = lab.trials.map((trial) => {
    const alt = `${trial.altitudeKm.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')} km`;
    return `<tr><td>${alt}</td><td>${(trial.speed / 1000).toFixed(2)}</td><td>${t(KIND_KEYS[trial.kind] || 'kindEllipse')}</td><td>${formatDuration(trial.period)}</td></tr>`;
  }).join('');
  $('trialRows').innerHTML = rows;
  $('completeCard').hidden = lab.phase !== 'complete';
  if (lab.phase === 'complete') $('conclusionStatus').textContent = t('complete');
  renderBandChart();
  scene?.setLab(lab);
}

function renderChrome() {
  document.title = t('doc');
  langBtn.textContent = document.documentElement.lang.startsWith('zh') ? 'EN' : '中';
  themeBtn.textContent = document.documentElement.dataset.theme === 'light' ? '🌙' : '☀️';
  themeBtn.setAttribute('aria-label', t('theme'));
  musicBtn.textContent = audio.musicOn ? '♫' : '♪';
  musicBtn.setAttribute('aria-pressed', String(audio.musicOn));
  musicBtn.setAttribute('aria-label', t(audio.musicOn ? 'musicOn' : 'musicOff'));
  soundBtn.textContent = audio.sfxOn ? '🔊' : '🔇';
  soundBtn.setAttribute('aria-pressed', String(audio.sfxOn));
  soundBtn.setAttribute('aria-label', t(audio.sfxOn ? 'sfxOn' : 'sfxOff'));
  $('altitudeRange').setAttribute('aria-label', t('labH'));
  $('speedRange').setAttribute('aria-label', t('labV'));
  LAUNCH_ALTITUDES.forEach((preset, index) => {
    const button = document.querySelectorAll('[data-altitude]')[index];
    if (button) {
      button.textContent = `${preset.altitudeKm.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')} km`;
    }
  });
  paint();
}

function setMessage(key) {
  const message = t(key);
  feedback.textContent = message;
  coach.textContent = message;
}

function applyResult(result, { okMessage } = {}) {
  lab = result.lab;
  persist();
  if (result.ok) {
    if (okMessage) setMessage(okMessage);
  } else {
    const key = REASON_KEY[result.reason];
    setMessage(key ? key : 'feedbackIdle');
    audio.error();
  }
  paint();
  if (lab.phase === 'complete') window.cool?.complete?.();
}

async function unlockAll() {
  if (unlocked) return;
  unlocked = true;
  await audio.unlock();
  window.cool?.stage?.('observe');
}

$('launchBtn').addEventListener('click', async () => {
  await unlockAll();
  const result = launch(lab);
  if (result.ok) {
    audio.launch();
    window.cool?.track?.('launch', {
      altitudeKm: result.lab.altitudeKm,
      speedRatio: result.lab.speedRatio,
    });
  }
  applyResult(result, { okMessage: 'launched' });
});

$('abortBtn').addEventListener('click', async () => {
  await unlockAll();
  audio.click();
  applyResult(abort(lab), { okMessage: 'aborted' });
});

$('vectorBtn').addEventListener('click', async () => {
  await unlockAll();
  audio.click();
  applyResult(setShowVectors(lab, !lab.showVectors));
});

$('altitudeRange').addEventListener('input', async () => {
  await unlockAll();
  applyResult(setAltitudeKm(lab, Number($('altitudeRange').value)));
});

$('speedRange').addEventListener('input', async () => {
  await unlockAll();
  applyResult(setSpeedRatio(lab, Number($('speedRange').value) / 1000));
});

$('presetRow').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-altitude]');
  if (!button) return;
  await unlockAll();
  audio.click();
  applyResult(setAltitudeKm(lab, Number(button.dataset.altitude)));
});

$('recordBtn').addEventListener('click', async () => {
  await unlockAll();
  const result = recordTrial(lab);
  if (result.ok) {
    audio.record();
    window.cool?.track?.('record', { kind: result.lab.trials.at(-1).kind });
  }
  applyResult(result, { okMessage: 'recorded' });
});

$('resetBtn').addEventListener('click', async () => {
  await unlockAll();
  audio.click();
  applyResult(resetLab(lab), { okMessage: 'feedbackIdle' });
  try {
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem('kidslab.progress.circular-orbit-lab');
  } catch { /* private mode */ }
});

musicBtn.addEventListener('click', async () => {
  await unlockAll();
  audio.setMusic(!audio.musicOn);
  renderChrome();
});
soundBtn.addEventListener('click', async () => {
  await unlockAll();
  audio.setSfx(!audio.sfxOn);
  renderChrome();
});
langBtn.addEventListener('click', () => window.cool.preferences.toggleLang());
themeBtn.addEventListener('click', () => window.cool.preferences.toggleTheme());

try {
  scene = createOrbitScene({
    canvas: $('scene'),
    cssVar,
    onFirstInteract: unlockAll,
  });
} catch {
  scene = null;
}
if (!scene) {
  $('nogl').hidden = false;
  $('scene').hidden = true;
}

addEventListener('themechange', () => scene?.applyTheme());

function tick(now) {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  const result = stepLab(lab, dt);
  if (result.ok) {
    lab = result.lab;
    for (const event of result.events) {
      if (event.type === 'lap') {
        persist();
        if (event.kind === 'circular') {
          audio.success();
          setMessage(snapshot(lab).syncKind === 'sync' ? 'syncTip' : 'circularHit');
        } else {
          audio.lap();
          setMessage('orbited');
        }
        window.cool?.track?.('lap', { kind: event.kind });
      }
      if (event.type === 'crashed') {
        persist();
        audio.crash();
        scene?.flashCrash();
        setMessage('crashTip');
        window.cool?.track?.('crash');
      }
      if (event.type === 'escaped') {
        persist();
        audio.escape();
        setMessage('escapeTip');
        window.cool?.track?.('escape');
      }
    }
    scene?.setLab(lab);
    if ((now / 80 | 0) !== ((now - dt * 1000) / 80 | 0)) {
      const view = snapshot(lab);
      $('timeVal').textContent = formatDuration(view.clock);
      $('statusVal').textContent = t(STATUS_KEYS[view.status]);
      $('kindVal').textContent = lab.pending ? t(KIND_KEYS[lab.pending.kind] || 'kindEllipse') : '—';
      $('periodVal').textContent = lab.pending ? formatDuration(lab.pending.period) : '—';
      $('perigeeVal').textContent = lab.pending ? perigeeLabel(lab.pending.perigee) : '—';
    }
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

window.cool.bindI18n(I18N, {
  onChange({ t: translate, lang: nextLang }) {
    t = translate;
    lang = nextLang;
    renderChrome();
  },
});
