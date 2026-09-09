import { createAudio } from './audio.js';
import {
  createLab,
  launch,
  parseLab,
  recordTrial,
  resetLab,
  serializeLab,
  setAngle,
  setG,
  setHeight,
  setPaused,
  setSpeed,
  snapshot,
  stepLab,
} from './lab-model.js';
import { createLabScene } from './scene.js';

const STORE_KEY = 'kidslab.projectile-motion-lab';
const I18N = {
  zh: {
    doc: '🎯 抛体运动实验室 · KidsLab',
    back: '返回平台',
    title: '抛体运动实验室',
    nogl: '浏览器暂时跑不了 3D 实验室，换一个新一点的浏览器再来观测吧。',
    hudTime: '时间',
    hudX: '水平 x',
    hudY: '高度 y',
    hudStatus: '状态',
    hudVx: '水平 vx',
    hudVy: '竖直 vy',
    hudHoop: '离铁环',
    tip0: '按「一起发射」，看红球和黄球谁先落地',
    panelTitle: '大炮面板',
    btnCompare: '一起发射',
    btnLaunch: '只发射红球',
    btnPause: '暂停',
    btnResume: '继续',
    btnRecord: '记下这次',
    btnReset: '重新实验',
    feedbackIdle: '先看同时落地，再抬炮口瞄准铁环。',
    labH: '抛出高度',
    labV: '初速度',
    labA: '仰角',
    labG: '重力 g',
    labComp: '此刻分量',
    logTitle: '观测记录',
    colMode: '方式',
    colT: '时间',
    colR: '射程',
    lessonTitle: '小课堂：为什么两个球一起落地？',
    lessonText: '水平方向匀速，竖直方向才被重力拉。平抛的竖直部分就是自由落体，所以从同一高度出发，落地时间只看高度和 g，跟水平速度无关。',
    footTip: '拖空白转视角 · 右侧拧大炮，左侧看轨迹',
    musicOn: '关闭背景音乐',
    musicOff: '打开背景音乐',
    sfxOn: '关闭音效',
    sfxOff: '打开音效',
    theme: '切换主题',
    ready: '就绪',
    flying: '飞行',
    landed: '落地',
    compare: '对照',
    single: '单发',
    complete: '平抛和自由落体同一时刻落地；抬高炮口，红球穿过了铁环。',
    stillFlying: '还在飞，落地后再记。',
    noFlight: '还没发射，先把球打出去。',
    inFlight: '飞行中不能改参数，等落地或再发射。',
    duplicate: '这一组已经记录过了。',
    recorded: '记下了。改一个旋钮，再打一发比一比。',
    landedTip: '落地了。看看两个时间是不是一样。',
    hoopTip: '穿过铁环了！把这次记进表里。',
    sameClock: '两个球同一时刻落地。水平速度没有帮忙往下掉。',
    outOfRange: '这个旋钮拧过头了，先回到刻度里。',
  },
  en: {
    doc: '🎯 Projectile Motion Lab · KidsLab',
    back: 'Back to platform',
    title: 'Projectile Motion Lab',
    nogl: 'WebGL is unavailable, so the 3D lab cannot start. Try a newer browser.',
    hudTime: 'Time',
    hudX: 'x',
    hudY: 'y',
    hudStatus: 'Status',
    hudVx: 'vx',
    hudVy: 'vy',
    hudHoop: 'To hoop',
    tip0: 'Tap Fire together and watch which ball lands first',
    panelTitle: 'Cannon',
    btnCompare: 'Fire together',
    btnLaunch: 'Red ball only',
    btnPause: 'Pause',
    btnResume: 'Resume',
    btnRecord: 'Record this',
    btnReset: 'Start over',
    feedbackIdle: 'Watch them land together, then tilt the barrel at the hoop.',
    labH: 'Launch height',
    labV: 'Speed',
    labA: 'Angle',
    labG: 'Gravity g',
    labComp: 'Components now',
    logTitle: 'Lab notes',
    colMode: 'Mode',
    colT: 'Time',
    colR: 'Range',
    lessonTitle: 'Why do both balls land together?',
    lessonText: 'Horizontal motion is uniform; only the vertical part feels gravity. A horizontal projectile’s vertical motion is free fall, so hang time depends on height and g, not on horizontal speed.',
    footTip: 'Drag to orbit · tune the cannon on the right, watch the path on the left',
    musicOn: 'Mute music',
    musicOff: 'Unmute music',
    sfxOn: 'Mute sound effects',
    sfxOff: 'Unmute sound effects',
    theme: 'Toggle theme',
    ready: 'Ready',
    flying: 'In flight',
    landed: 'Landed',
    compare: 'compare',
    single: 'single',
    complete: 'The flat shot and the drop share a clock; tilt the barrel and the red ball threads the hoop.',
    stillFlying: 'Still flying — record after it lands.',
    noFlight: 'Nothing has been fired yet.',
    inFlight: 'Don’t change knobs in flight. Wait for landing or fire again.',
    duplicate: 'That shot is already in the table.',
    recorded: 'Saved. Change one knob and fire again to compare.',
    landedTip: 'Landed. Check whether the two clocks match.',
    hoopTip: 'Through the hoop! Record this shot.',
    sameClock: 'Same landing time. Horizontal speed did not help them fall.',
    outOfRange: 'That knob went past its scale. Bring it back.',
  },
};

const REASON_KEY = {
  'still-flying': 'stillFlying',
  'no-flight': 'noFlight',
  'in-flight': 'inFlight',
  'duplicate-trial': 'duplicate',
  'out-of-range-height': 'outOfRange',
  'out-of-range-speed': 'outOfRange',
  'out-of-range-angle': 'outOfRange',
  'out-of-range-g': 'outOfRange',
  'invalid-height': 'outOfRange',
  'invalid-speed': 'outOfRange',
  'invalid-angle': 'outOfRange',
  'invalid-g': 'outOfRange',
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
const pauseBtn = $('pauseBtn');
const coach = $('coach');
const feedback = $('feedback');

const audio = createAudio(STORE_KEY);
let lab = loadLab();
let scene = null;
let unlocked = false;
let last = performance.now();
let hoopAnnounced = false;

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

function fmt(value, digits, unit) {
  return `${value.toFixed(digits)} ${unit}`;
}

function statusText(view) {
  if (view.landed) return t('landed');
  if (view.flying) return t('flying');
  return t('ready');
}

function paint() {
  const view = snapshot(lab);
  $('timeVal').textContent = fmt(view.t, 2, 's');
  $('xVal').textContent = fmt(view.x, 2, 'm');
  $('yVal').textContent = fmt(view.y, 2, 'm');
  $('statusVal').textContent = statusText(view);
  $('heightVal').textContent = fmt(lab.height, 2, 'm');
  $('speedVal').textContent = fmt(lab.speed, 1, 'm/s');
  $('angleVal').textContent = `${lab.angleDeg.toFixed(0)}°`;
  $('gVal').textContent = `${lab.g.toFixed(2)} m/s²`;
  $('vxVal').textContent = fmt(view.vx, 2, 'm/s');
  $('vyVal').textContent = fmt(view.vy, 2, 'm/s');
  $('hoopVal').textContent = view.ready ? '—' : fmt(view.hoopMinDist, 2, 'm');
  $('heightRange').value = String(lab.height);
  $('speedRange').value = String(lab.speed);
  $('angleRange').value = String(lab.angleDeg);
  $('gRange').value = String(lab.g);
  pauseBtn.textContent = t(lab.paused ? 'btnResume' : 'btnPause');

  const rows = lab.trials.map((trial) => {
    const mode = trial.mode === 'compare' ? t('compare') : t('single');
    const time = trial.dropTime == null
      ? `${trial.flightTime.toFixed(2)} s`
      : `${trial.flightTime.toFixed(2)}/${trial.dropTime.toFixed(2)} s`;
    return `<tr><td>${mode}</td><td>${time}</td><td>${trial.range.toFixed(2)} m</td></tr>`;
  }).join('');
  $('trialRows').innerHTML = rows;
  $('completeCard').hidden = lab.phase !== 'complete';
  if (lab.phase === 'complete') $('conclusionStatus').textContent = t('complete');
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
  $('heightRange').setAttribute('aria-label', t('labH'));
  $('speedRange').setAttribute('aria-label', t('labV'));
  $('angleRange').setAttribute('aria-label', t('labA'));
  $('gRange').setAttribute('aria-label', t('labG'));
  paint();
}

function applyResult(result, { okMessage } = {}) {
  lab = result.lab;
  persist();
  if (result.ok) {
    if (okMessage) {
      feedback.textContent = t(okMessage);
      coach.textContent = t(okMessage);
    }
  } else {
    const key = REASON_KEY[result.reason];
    const message = key ? t(key) : t('feedbackIdle');
    feedback.textContent = message;
    coach.textContent = message;
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

function fire(withDrop) {
  hoopAnnounced = false;
  const result = launch(lab, { withDrop });
  if (result.ok) {
    audio.launch();
    window.cool?.track?.(withDrop ? 'compare-launch' : 'launch', {
      speed: result.lab.speed,
      angle: result.lab.angleDeg,
    });
  }
  applyResult(result, { okMessage: 'tip0' });
}

$('compareBtn').addEventListener('click', async () => {
  await unlockAll();
  fire(true);
});
$('launchBtn').addEventListener('click', async () => {
  await unlockAll();
  fire(false);
});

pauseBtn.addEventListener('click', async () => {
  await unlockAll();
  audio.click();
  applyResult(setPaused(lab, !lab.paused));
});

function bindRange(id, setter) {
  $(id).addEventListener('input', async () => {
    await unlockAll();
    applyResult(setter(lab, Number($(id).value)));
  });
}
bindRange('heightRange', setHeight);
bindRange('speedRange', setSpeed);
bindRange('angleRange', setAngle);
bindRange('gRange', setG);

$('recordBtn').addEventListener('click', async () => {
  await unlockAll();
  const result = recordTrial(lab);
  if (result.ok) {
    audio.record();
    window.cool?.track?.('record', {
      mode: result.lab.trials.at(-1).mode,
      hoop: result.lab.trials.at(-1).hoopHit,
    });
  }
  applyResult(result, { okMessage: 'recorded' });
});

$('resetBtn').addEventListener('click', async () => {
  await unlockAll();
  audio.click();
  applyResult(resetLab(lab));
  feedback.textContent = t('feedbackIdle');
  coach.textContent = t('tip0');
  hoopAnnounced = false;
  try {
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem('kidslab.progress.projectile-motion-lab');
  } catch { /* private mode */ }
  paint();
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
  scene = createLabScene({
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
      if (event.type === 'land') {
        audio.land();
        persist();
        const view = snapshot(lab);
        if (lab.drop && Math.abs((lab.flight?.landTime ?? 0) - (lab.drop.landTime ?? 0)) <= 0.02) {
          coach.textContent = t('sameClock');
          feedback.textContent = t('sameClock');
        } else {
          coach.textContent = t('landedTip');
          feedback.textContent = t('landedTip');
        }
        if (view.hoopHit && !hoopAnnounced) {
          hoopAnnounced = true;
          audio.success();
          coach.textContent = t('hoopTip');
          feedback.textContent = t('hoopTip');
          window.cool?.track?.('hoop');
        }
      }
    }
    scene?.setLab(lab);
    if ((now / 80 | 0) !== ((now - dt * 1000) / 80 | 0)) {
      const view = snapshot(lab);
      $('timeVal').textContent = fmt(view.t, 2, 's');
      $('xVal').textContent = fmt(view.x, 2, 'm');
      $('yVal').textContent = fmt(view.y, 2, 'm');
      $('statusVal').textContent = statusText(view);
      $('vxVal').textContent = fmt(view.vx, 2, 'm/s');
      $('vyVal').textContent = fmt(view.vy, 2, 'm/s');
      $('hoopVal').textContent = view.ready ? '—' : fmt(view.hoopMinDist, 2, 'm');
    }
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

window.cool.bindI18n(I18N, {
  onChange({ t: translate }) {
    t = translate;
    renderChrome();
  },
});
