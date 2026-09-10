import {
  DT,
  MAX_MARKS,
  accelerationFromMarks,
  classifyMotion,
  createLab,
  intervalVelocities,
  markAt,
  markNow,
  resetLab,
  setAngle,
  setKind,
  setPlaying,
  speedFromMarks,
  stepLab,
} from './motion-model.js';
import { createLabAudio } from './audio.js';
import { createMotionScene } from './scene3d.js';

const I18N = {
  zh: {
    doc: '运动追踪实验室 · KidsLab',
    back: '返回平台',
    title: '运动追踪实验室',
    coachTitle: '小车是匀速，还是越跑越快？',
    tip0: '按播放看它跑，或打点让图自己长出来',
    panelTitle: '观测台',
    footTip: '点橙色小车打点 · 拖空白转视角',
    play: '播放',
    pause: '暂停',
    mark: '给这一帧打点',
    reset: '重新实验',
    trackTitle: '这一次怎么跑',
    kindUniform: '水平匀速',
    kindAccel: '斜面加速',
    angleTitle: '斜面有多陡',
    dataTitle: '点变成图',
    graphEmpty: '打出两个点，图就会开始长出来。',
    speedWords: '速度，就是这一小段里小车走了多远、用了多久。',
    accelWords: '加速度，就是速度变快或变慢的快慢。',
    hudTime: '时间 t',
    hudS: '路程 s',
    hudV: '速度 v',
    viewStage: '斜视',
    viewSide: '侧面',
    viewTop: '俯视',
    noglTitle: '这台设备暂时不能显示 3D 轨道',
    noglText: '可以继续用面板打点看图；换一个支持 WebGL 的浏览器会更清楚。',
    musicOn: '关闭音乐',
    musicOff: '打开音乐',
    soundOn: '关闭音效',
    soundOff: '打开音效',
    theme: '切换主题',
    lang: 'Switch to English',
    marked: '打上了。图上又多了一个点。',
    missed: '没点到小车上。对准橙色车身再试。',
    duplicate: '这一帧已经有点了。播放或再等一小下。',
    full: '点打满了。看看图，或重新实验。',
    switchedUniform: '水平轨道：速度应该几乎不变。',
    switchedAccel: '斜面：小车会越跑越快。',
    resetDone: '这一段清掉了，可以重新看。',
    finished: '小车到头了。对比一下两张图。',
    slopeSpeed: (v) => `s-t 斜率 ≈ ${v} m/s，也就是这段的速度。`,
    slopeAccel: (a) => `v-t 斜率 ≈ ${a} m/s²。坡度越大，这条线爬得越陡。`,
    uniformNote: 'v-t 几乎是平的：速度差不多没变，这叫匀速。',
    accelNote: 'v-t 往上爬：速度在变大。无摩擦斜面上，a = g sinθ。',
  },
  en: {
    doc: 'Motion Tracker Lab · KidsLab',
    back: 'Back to platform',
    title: 'Motion Tracker Lab',
    coachTitle: 'Is the cart steady, or speeding up?',
    tip0: 'Press play to watch, or mark frames and grow the graphs',
    panelTitle: 'Observation deck',
    footTip: 'Tap the orange cart · drag empty space to orbit',
    play: 'Play',
    pause: 'Pause',
    mark: 'Mark this frame',
    reset: 'Reset run',
    trackTitle: 'How should it move?',
    kindUniform: 'Level, uniform',
    kindAccel: 'Ramp, speeding up',
    angleTitle: 'How steep is the ramp?',
    dataTitle: 'Dots become graphs',
    graphEmpty: 'Mark two points and the graphs start to grow.',
    speedWords: 'Speed is how far the cart goes in a little bit of time.',
    accelWords: 'Acceleration is how quickly that speed changes.',
    hudTime: 'Time t',
    hudS: 'Distance s',
    hudV: 'Speed v',
    viewStage: 'Stage',
    viewSide: 'Side',
    viewTop: 'Top',
    noglTitle: 'This device cannot show the 3D track yet',
    noglText: 'You can still mark points in the panel. A browser with WebGL will look clearer.',
    musicOn: 'Mute music',
    musicOff: 'Turn music on',
    soundOn: 'Mute sound effects',
    soundOff: 'Turn sound effects on',
    theme: 'Toggle theme',
    lang: '切换到中文',
    marked: 'Marked. Another point grew on the graphs.',
    missed: 'That tap missed the cart. Aim at the orange body.',
    duplicate: 'This frame already has a point. Play or wait a moment.',
    full: 'The tape is full. Read the graphs, or reset.',
    switchedUniform: 'Level track: the speed should stay almost the same.',
    switchedAccel: 'Ramp: the cart should go faster and faster.',
    resetDone: 'This run is cleared. Watch it again.',
    finished: 'The cart reached the end. Compare the two graphs.',
    slopeSpeed: (v) => `s–t slope ≈ ${v} m/s — that is the speed.`,
    slopeAccel: (a) => `v–t slope ≈ ${a} m/s². A steeper ramp climbs faster.`,
    uniformNote: 'v–t is almost flat: speed barely changes. That is uniform motion.',
    accelNote: 'v–t climbs: speed is increasing. On a frictionless ramp, a = g sinθ.',
  },
};

const SVG_NS = 'http://www.w3.org/2000/svg';
const $ = (selector) => document.querySelector(selector);

const elements = {
  app: $('#app'),
  nogl: $('#nogl'),
  langBtn: $('#langBtn'),
  themeBtn: $('#themeBtn'),
  musicBtn: $('#musicBtn'),
  soundBtn: $('#soundBtn'),
  stage: $('#stage'),
  tip: $('#tip'),
  filmTitle: $('#filmTitle'),
  timeReadout: $('#timeReadout'),
  sReadout: $('#sReadout'),
  vReadout: $('#vReadout'),
  playBtn: $('#playBtn'),
  markBtn: $('#markBtn'),
  resetBtn: $('#resetBtn'),
  filmFeedback: $('#filmFeedback'),
  markCount: $('#markCount'),
  graphHint: $('#graphHint'),
  recordBody: $('#recordBody'),
  stFit: $('#stFit'),
  vtFit: $('#vtFit'),
  stPoints: $('#stPoints'),
  vtPoints: $('#vtPoints'),
  slopeLine: $('#slopeLine'),
  observeNote: $('#observeNote'),
  angleRow: $('#angleRow'),
};

const labAudio = createLabAudio({
  bgmUrl: new URL('./audio/bgm-hope-01.ogg', import.meta.url),
});
const motion3d = createMotionScene(elements.stage);
const ctx = motion3d ? null : elements.stage.getContext('2d');
if (!motion3d) elements.nogl.hidden = false;

let lab = createLab({ kind: 'uniform' });
let lang = window.cool?.preferences?.lang || 'zh';
let t = (key, ...args) => {
  const value = I18N[lang]?.[key];
  return typeof value === 'function' ? value(...args) : (value ?? key);
};
let panelOpen = true;
let notice = { key: '', kind: '' };
let compared = { uniform: false, accelerated: false };
let completed = false;
let viewName = 'stage';
let lastMarkCount = 0;

document.addEventListener('pointerdown', () => { labAudio.unlock(); }, { once: true });

function applyPanel() {
  const panel = $('#panel');
  if (!panel) return;
  panel.classList.toggle('is-collapsed', !panelOpen);
  $('#panelBody').hidden = !panelOpen;
  $('#panelHandle')?.setAttribute('aria-expanded', String(panelOpen));
  const arrow = $('#panelArrow');
  if (arrow) arrow.textContent = panelOpen ? '▾' : '▸';
}
$('#panelHandle')?.addEventListener('click', () => { panelOpen = !panelOpen; applyPanel(); });

function decimal(value, digits = 2) {
  return Number(value).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
}

function setNotice(key, kind = '') {
  notice = { key, kind };
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function renderSound() {
  elements.musicBtn.textContent = labAudio.musicOn ? '♫' : '♫︎';
  elements.musicBtn.setAttribute('aria-pressed', String(!labAudio.musicOn));
  elements.musicBtn.setAttribute('aria-label', t(labAudio.musicOn ? 'musicOn' : 'musicOff'));
  elements.soundBtn.textContent = labAudio.sfxOn ? '🔊' : '🔇';
  elements.soundBtn.setAttribute('aria-pressed', String(!labAudio.sfxOn));
  elements.soundBtn.setAttribute('aria-label', t(labAudio.sfxOn ? 'soundOn' : 'soundOff'));
}

function maybeComplete() {
  if (lab.marks.length >= 2) compared[lab.kind] = true;
  if (!completed && compared.uniform && compared.accelerated) {
    completed = true;
    window.cool?.complete?.();
    labAudio.beep('complete');
  }
}

function graphPoint(value, max, y0 = 112, span = 90) {
  return y0 - (Math.max(0, value) / max) * span;
}

function renderGraph(group, fit, points, xMax, yMax) {
  const fragment = document.createDocumentFragment();
  points.forEach((point) => {
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('class', 'graph-point');
    circle.setAttribute('cx', (36 + (point.x / xMax) * 168).toFixed(1));
    circle.setAttribute('cy', graphPoint(point.y, yMax).toFixed(1));
    circle.setAttribute('r', '4.5');
    fragment.append(circle);
  });
  group.replaceChildren(fragment);
  if (points.length >= 2) {
    const first = points[0];
    const last = points.at(-1);
    fit.setAttribute('d', `M${(36 + (first.x / xMax) * 168).toFixed(1)} ${graphPoint(first.y, yMax).toFixed(1)} L${(36 + (last.x / xMax) * 168).toFixed(1)} ${graphPoint(last.y, yMax).toFixed(1)}`);
  } else {
    fit.setAttribute('d', '');
  }
}

function renderTableAndGraphs() {
  const marks = lab.marks;
  const velocities = intervalVelocities(marks);
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < MAX_MARKS; i += 1) {
    const row = document.createElement('tr');
    const mark = marks[i];
    const velocity = i === 0 ? '—' : (velocities[i - 1] ? decimal(velocities[i - 1].v) : '—');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${mark ? decimal(mark.t) : '—'}</td>
      <td>${mark ? decimal(mark.s) : '—'}</td>
      <td>${velocity}</td>`;
    fragment.append(row);
  }
  elements.recordBody.replaceChildren(fragment);
  elements.markCount.textContent = `${marks.length} / ${MAX_MARKS}`;

  renderGraph(elements.stPoints, elements.stFit, marks.map((mark) => ({ x: mark.t, y: mark.s })), 0.8, 1.2);
  renderGraph(elements.vtPoints, elements.vtFit, velocities.map((row) => ({ x: row.tMid, y: row.v })), 0.8, 3.2);

  const speed = speedFromMarks(marks);
  const accel = accelerationFromMarks(marks);
  const motion = classifyMotion(marks);
  if (marks.length >= 2 && speed !== null && motion === 'uniform') {
    elements.slopeLine.textContent = t('slopeSpeed', decimal(speed));
    elements.observeNote.textContent = t('uniformNote');
  } else if (velocities.length >= 2 && accel !== null) {
    elements.slopeLine.textContent = t('slopeAccel', decimal(accel));
    elements.observeNote.textContent = t('accelNote');
  } else {
    elements.slopeLine.textContent = '';
    elements.observeNote.textContent = t(lab.kind === 'accelerated' ? 'accelWords' : 'speedWords');
  }
  elements.graphHint.hidden = marks.length >= 2;
}

function drawFallback() {
  if (!ctx) return;
  const width = elements.stage.clientWidth;
  const height = elements.stage.clientHeight;
  if (!width || !height) return;
  const angle = (lab.angleDeg * Math.PI) / 180;
  const trackLen = Math.min(width - 56, 560);
  const x0 = 32;
  const y0 = height * 0.62;
  const x1 = x0 + trackLen * Math.cos(angle);
  const y1 = y0 + trackLen * Math.sin(angle);
  ctx.clearRect(0, 0, width, height);
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, cssVar('--scene-a'));
  sky.addColorStop(1, cssVar('--scene-c'));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#b7c0cc';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  const along = lab.s / 1.2;
  const cartX = x0 + (x1 - x0) * along;
  const cartY = y0 + (y1 - y0) * along;
  lab.marks.forEach((mark) => {
    const k = mark.s / 1.2;
    ctx.beginPath();
    ctx.fillStyle = '#14b8a6';
    ctx.arc(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k - 16, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.save();
  ctx.translate(cartX, cartY);
  ctx.rotate(angle);
  ctx.fillStyle = cssVar('--accent');
  ctx.beginPath();
  ctx.roundRect(-28, -22, 56, 24, 6);
  ctx.fill();
  ctx.restore();
}

function render() {
  document.title = t('doc');
  renderSound();
  elements.themeBtn.setAttribute('aria-label', t('theme'));
  elements.langBtn.setAttribute('aria-label', t('lang'));
  elements.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
  elements.themeBtn.textContent = window.cool?.preferences?.theme === 'light' ? '🌙' : '☀️';
  elements.filmTitle.textContent = t('coachTitle');
  elements.tip.textContent = t('tip0');
  elements.timeReadout.textContent = `${decimal(lab.t)} s`;
  elements.sReadout.textContent = `${decimal(lab.s)} m`;
  elements.vReadout.textContent = `${decimal(lab.v)} m/s`;
  elements.playBtn.textContent = t(lab.playing ? 'pause' : 'play');
  elements.angleRow.hidden = lab.kind !== 'accelerated';
  document.querySelectorAll('[data-kind]').forEach((button) => {
    button.classList.toggle('is-on', button.dataset.kind === lab.kind);
  });
  document.querySelectorAll('[data-angle]').forEach((button) => {
    button.classList.toggle('is-on', Number(button.dataset.angle) === lab.angleDeg);
  });
  document.querySelectorAll('[data-view]').forEach((button) => {
    const active = button.dataset.view === viewName;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  elements.filmFeedback.textContent = notice.key ? t(notice.key) : '';
  elements.filmFeedback.className = `panel__hint${notice.kind ? ` is-${notice.kind}` : ''}`;
  renderTableAndGraphs();
  if (motion3d) {
    motion3d.update({ angle: lab.angleDeg, s: lab.s, markList: lab.marks });
  } else {
    drawFallback();
  }
}

function onMarkResult(result, { fromCanvas = false } = {}) {
  if (!result.ok) {
    const key = result.reason === 'miss' ? 'missed' : result.reason === 'duplicate' ? 'duplicate' : result.reason === 'full' ? 'full' : 'missed';
    setNotice(key, 'error');
    if (result.reason === 'miss') window.cool?.track?.('missed_cart', { kind: lab.kind });
    labAudio.beep('bad');
    render();
    return;
  }
  setNotice('marked', 'success');
  window.cool?.track?.('marked_motion_frame', { kind: lab.kind, n: lab.marks.length });
  window.cool?.stage?.('marking');
  labAudio.beep(lab.marks.length >= 2 ? 'good' : 'mark');
  maybeComplete();
  if (!lab.playing && !lab.finished && !fromCanvas) stepLab(lab, DT);
  lastMarkCount = lab.marks.length;
  render();
}

function markFromButton() {
  onMarkResult(markNow(lab));
}

function markFromCanvas(hit) {
  if (hit === 'cart') onMarkResult(markAt(lab, lab.s), { fromCanvas: true });
  else onMarkResult(markAt(lab, lab.s + 0.2), { fromCanvas: true });
}

elements.playBtn.addEventListener('click', () => {
  if (lab.finished) resetLab(lab);
  setPlaying(lab, !lab.playing);
  if (lab.playing && lab.marks.length === 0) markNow(lab);
  labAudio.beep('switch');
  window.cool?.track?.(lab.playing ? 'played_cart' : 'paused_cart', { kind: lab.kind });
  render();
});
elements.markBtn.addEventListener('click', markFromButton);
elements.resetBtn.addEventListener('click', () => {
  resetLab(lab);
  setNotice('resetDone', 'success');
  labAudio.beep('switch');
  window.cool?.track?.('reset_clip', { kind: lab.kind });
  render();
});
elements.musicBtn.addEventListener('click', () => {
  labAudio.setMusic(!labAudio.musicOn);
  renderSound();
});
elements.soundBtn.addEventListener('click', () => {
  labAudio.setSfx(!labAudio.sfxOn);
  renderSound();
});
elements.themeBtn.addEventListener('click', () => window.cool?.preferences?.toggleTheme?.());
elements.langBtn.addEventListener('click', () => window.cool?.preferences?.toggleLang?.());

document.querySelectorAll('[data-kind]').forEach((button) => {
  button.addEventListener('click', () => {
    const result = setKind(lab, button.dataset.kind);
    if (!result.ok) return;
    setNotice(lab.kind === 'uniform' ? 'switchedUniform' : 'switchedAccel', 'success');
    labAudio.beep('switch');
    window.cool?.track?.('switched_motion', { kind: lab.kind });
    render();
  });
});
document.querySelectorAll('[data-angle]').forEach((button) => {
  button.addEventListener('click', () => {
    const result = setAngle(lab, Number(button.dataset.angle));
    if (!result.ok) return;
    setNotice('switchedAccel', 'success');
    labAudio.beep('switch');
    window.cool?.track?.('chose_incline_angle', { angle: lab.angleDeg });
    render();
  });
});
document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    viewName = button.dataset.view;
    motion3d?.setView(viewName);
    labAudio.beep('tap');
    render();
  });
});

let pointer = null;
elements.stage.addEventListener('pointerdown', (event) => {
  pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, dragged: false };
  elements.stage.setPointerCapture(event.pointerId);
});
elements.stage.addEventListener('pointermove', (event) => {
  if (!pointer || event.pointerId !== pointer.id) return;
  const dx = event.clientX - pointer.x;
  const dy = event.clientY - pointer.y;
  if (!pointer.dragged && (dx * dx + dy * dy) < 36) return;
  pointer.dragged = true;
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  motion3d?.orbit(dx, dy);
});
function endPointer(event) {
  if (!pointer || event.pointerId !== pointer.id) return;
  if (!pointer.dragged) {
    const hit = motion3d ? motion3d.pick(event.clientX, event.clientY).hit : 'empty';
    if (!motion3d) {
      const rect = elements.stage.getBoundingClientRect();
      markFromCanvas(event.clientX - rect.left > 40 && event.clientY - rect.top > 40 ? 'cart' : 'empty');
    } else {
      markFromCanvas(hit);
    }
  }
  pointer = null;
}
elements.stage.addEventListener('pointerup', endPointer);
elements.stage.addEventListener('pointercancel', () => { pointer = null; });

let lastTime = 0;
let acc = 0;
function tick(now) {
  requestAnimationFrame(tick);
  const dt = Math.min(0.05, (now - lastTime) / 1000 || 0);
  lastTime = now;
  if (!lab.playing || document.hidden) return;
  acc += dt;
  let moved = false;
  while (acc >= DT && lab.playing) {
    acc -= DT;
    const stepped = stepLab(lab, DT);
    if (!stepped.ok) break;
    markNow(lab);
    moved = true;
    if (stepped.finished) {
      setNotice('finished', 'success');
      labAudio.beep('complete');
      window.cool?.track?.('cart_finished', { kind: lab.kind });
      maybeComplete();
    }
  }
  if (moved) {
    if (lab.marks.length !== lastMarkCount && lab.marks.length >= 2) {
      lastMarkCount = lab.marks.length;
      window.cool?.stage?.('observing');
    }
    render();
  }
}
requestAnimationFrame(tick);

window.addEventListener('resize', () => {
  if (!motion3d) drawFallback();
});

window.cool?.bindI18n?.(I18N, {
  onChange({ t: translate, lang: nextLang }) {
    lang = nextLang;
    t = (key, ...args) => {
      const value = I18N[lang]?.[key];
      if (typeof value === 'function') return value(...args);
      return translate(key, ...args);
    };
    render();
  },
});

window.cool?.stage?.('playing');
applyPanel();
render();
