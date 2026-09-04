import {
  MARK_COUNT,
  accelerationFromMarks,
  compactPanelAfter,
  concludeMotion,
  intervalVelocities,
  markFrame,
  predictedAcceleration,
  resetMission,
  speedFromMarks,
  startMission,
  withinRelative,
} from './motion-model.js';

const I18N = {
  zh: {
    doc: '运动追踪实验室 · KidsLab',
    back: '返回平台',
    title: '运动追踪实验室',
    filmNav: '片场',
    dataNav: '图表',
    labNav: '结论',
    filmTitle: '这段录像里，小车速度在变吗？',
    filmTitleAccel: '斜面上的小车，速度怎么变？',
    filmTitleDesign: '换一个坡度，斜率还会准吗？',
    tip0: '点小车，给这一帧打点',
    mark: '给这一帧打点',
    reset: '重拍这一段',
    predictionTitle: '先猜一下',
    predSteady: '速度不变',
    predChanging: '速度在变',
    dataTitle: '点变成图',
    graphEmpty: '打出两个点，图就会开始长出来。',
    labTitle: '用图像下结论',
    kindUniform: '匀速',
    kindAccel: '匀加速',
    designTitle: '自己选坡度',
    lawPrompt: '测出的斜率更接近哪一条？',
    soundOn: '关闭声音',
    soundOff: '打开声音',
    theme: '切换主题',
    lang: 'Switch to English',
    clipUniform: '水平匀速',
    clipAccel: '30° 斜面',
    clipDesign: '自选坡度',
    marked: '打上了。下一帧，小车又往前挪了一点。',
    missed: '没点到小车上。对准橙色车身再试。',
    needMarks: '先打满 6 个点，图才站得住。',
    needPrediction: '先留下预测，再下结论。',
    wrongKind: '图像不像这种运动。再看看 s-t 和 v-t。',
    uniformDone: 'v-t 几乎水平，这段是匀速。',
    accelDone: 'v-t 往上爬，这段是匀加速。',
    wrongLaw: '这条式子对不上斜率。换一条再比。',
    needAccelFirst: '先判断这是匀加速，再选公式。',
    designDone: (angle, measured, predicted) => `${angle}° 斜面上，v-t 斜率约 ${measured} m/s²，接近 g sinθ = ${predicted} m/s²。`,
    allDone: '三卷录像都读完了。点变成了两张会说话的图。',
    resetDone: '这一段清掉了，可以重新打点。',
    predSaved: '预测留下了。打点看它站不站得住。',
    slopeSpeed: (v) => `s-t 斜率 ≈ ${v} m/s`,
    slopeAccel: (a) => `v-t 斜率 ≈ ${a} m/s²`,
    formulaUniform: '匀速：s-t 是直线，v-t 是平的',
    formulaAccel: '匀加速：v = v₀ + at，v-t 的斜率就是 a',
    formulaDesign: '无摩擦斜面：a = g sinθ',
  },
  en: {
    doc: 'Motion Tracker Lab · KidsLab',
    back: 'Back to platform',
    title: 'Motion Tracker Lab',
    filmNav: 'Clip',
    dataNav: 'Graphs',
    labNav: 'Conclude',
    filmTitle: 'In this clip, is the cart changing speed?',
    filmTitleAccel: 'On the ramp, how does the speed change?',
    filmTitleDesign: 'Change the slope. Does the graph still match?',
    tip0: 'Tap the cart to mark this frame',
    mark: 'Mark this frame',
    reset: 'Reshoot this clip',
    predictionTitle: 'Guess first',
    predSteady: 'Speed stays the same',
    predChanging: 'Speed is changing',
    dataTitle: 'Dots become graphs',
    graphEmpty: 'Mark two points and the graphs start to grow.',
    labTitle: 'Read the graphs',
    kindUniform: 'Uniform',
    kindAccel: 'Uniformly accelerated',
    designTitle: 'Pick the incline',
    lawPrompt: 'Which rule is closest to the measured slope?',
    soundOn: 'Mute sound',
    soundOff: 'Turn sound on',
    theme: 'Toggle theme',
    lang: '切换到中文',
    clipUniform: 'Level track',
    clipAccel: '30° ramp',
    clipDesign: 'Choose a ramp',
    marked: 'Marked. The next frame, the cart has moved on.',
    missed: 'That tap missed the cart. Aim at the orange body.',
    needMarks: 'Mark all 6 frames before the graphs can decide.',
    needPrediction: 'Leave a prediction before you conclude.',
    wrongKind: 'The graphs do not look like that motion. Check s–t and v–t again.',
    uniformDone: 'The v–t graph is nearly flat. This clip is uniform motion.',
    accelDone: 'The v–t graph climbs. This clip is uniformly accelerated.',
    wrongLaw: 'That equation does not match the slope. Try another.',
    needAccelFirst: 'Decide this is uniformly accelerated before choosing a formula.',
    designDone: (angle, measured, predicted) => `On the ${angle}° ramp, the v–t slope is about ${measured} m/s², close to g sinθ = ${predicted} m/s².`,
    allDone: 'All three clips are read. The dots turned into two talking graphs.',
    resetDone: 'This clip is cleared. Mark it again.',
    predSaved: 'Prediction saved. Mark the frames and test it.',
    slopeSpeed: (v) => `s–t slope ≈ ${v} m/s`,
    slopeAccel: (a) => `v–t slope ≈ ${a} m/s²`,
    formulaUniform: 'Uniform motion: s–t is a line, v–t is flat',
    formulaAccel: 'Constant a: v = v₀ + at. The v–t slope is a',
    formulaDesign: 'Frictionless ramp: a = g sinθ',
  },
};

const SOUND_KEY = 'kidslab.motion-tracker-lab.sound';
const SVG_NS = 'http://www.w3.org/2000/svg';
const MISSIONS = ['uniform', 'accel', 'design'];
const $ = (selector) => document.querySelector(selector);

const elements = {
  app: $('#app'),
  langBtn: $('#langBtn'),
  themeBtn: $('#themeBtn'),
  soundBtn: $('#soundBtn'),
  stage: $('#stage'),
  tip: $('#tip'),
  filmTitle: $('#filmTitle'),
  missionCode: $('#missionCode'),
  frameReadout: $('#frameReadout'),
  timeReadout: $('#timeReadout'),
  angleReadout: $('#angleReadout'),
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
  designCard: $('#designCard'),
  formulaStrip: $('#formulaStrip'),
  labFeedback: $('#labFeedback'),
  conclusionStatus: $('#conclusionStatus'),
};

const scene = { cart: { x: 80, y: 140, r: 36 } };

function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* privacy mode */ }
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function decimal(value, digits = 2) {
  return Number(value).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
}

function makeGame() {
  return {
    missionId: 'uniform',
    lab: startMission('uniform'),
    prediction: null,
    designAngle: 20,
    done: { uniform: false, accel: false, design: false },
    lawChoice: null,
    mobilePanel: 'film',
    filmNotice: { key: 'tip0', kind: '' },
    labNotice: null,
  };
}

let game = makeGame();
let lang = window.cool?.preferences?.lang || 'zh';
let t = (key) => key;
let muted = safeGet(SOUND_KEY) === 'off';
let audioContext = null;
const ctx = elements.stage.getContext('2d');

function text(key, ...args) {
  return t(key, ...args);
}

function setFilmNotice(key, kind = '') {
  game.filmNotice = { key, kind };
}

function setLabNotice(key, kind = '', args = []) {
  game.labNotice = key ? { key, kind, args } : null;
}

function isCompact() {
  return window.matchMedia('(max-width: 900px)').matches;
}

function maybeSwitchPanel(event) {
  const next = compactPanelAfter(event);
  if (!isCompact() || !next) return;
  game.mobilePanel = next;
}

function currentFrame() {
  return game.lab.frames[game.lab.frameIndex] || game.lab.frames.at(-1);
}

function renderNotice(el, notice) {
  if (!notice) {
    el.textContent = '';
    el.className = el.className.replace(/\bis-(?:success|error)\b/g, '').trim();
    return;
  }
  el.textContent = text(notice.key, ...(notice.args ?? []));
  el.className = el.className.replace(/\bis-(?:success|error)\b/g, '').trim();
  if (notice.kind) el.classList.add(`is-${notice.kind}`);
}

function setMuted(next) {
  muted = next;
  safeSet(SOUND_KEY, muted ? 'off' : 'on');
  if (muted && audioContext?.state === 'running') audioContext.suspend().catch(() => {});
  renderSound();
}

function renderSound() {
  elements.soundBtn.textContent = muted ? '🔇' : '🔊';
  elements.soundBtn.setAttribute('aria-pressed', String(muted));
  elements.soundBtn.setAttribute('aria-label', text(muted ? 'soundOff' : 'soundOn'));
}

function tone(kind) {
  if (muted) return;
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    audioContext ||= new AudioCtor();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    const settings = {
      mark: { notes: [392], duration: 0.16, gain: 0.05, type: 'sine' },
      success: { notes: [523, 659], duration: 0.28, gain: 0.055, type: 'sine' },
      error: { notes: [180, 145], duration: 0.22, gain: 0.04, type: 'sawtooth' },
      complete: { notes: [440, 554, 659], duration: 0.5, gain: 0.06, type: 'sine' },
    }[kind] || { notes: [349], duration: 0.16, gain: 0.05, type: 'sine' };
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(settings.gain, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + settings.duration);
    gain.connect(audioContext.destination);
    settings.notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = settings.type;
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.09);
      oscillator.connect(gain);
      oscillator.start(now + index * 0.09);
      oscillator.stop(now + index * 0.09 + settings.duration * 0.55);
    });
  } catch {
    // Audio is optional.
  }
}

function resizeStage() {
  const canvas = elements.stage;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(280, canvas.clientWidth);
  const height = Math.max(160, canvas.clientHeight);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawStage();
}

function drawRoundRect(context, x, y, w, h, r) {
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.closePath();
}

function drawStage() {
  const width = elements.stage.clientWidth;
  const height = elements.stage.clientHeight;
  if (!width || !height) return;
  const clip = game.lab.clip;
  const angle = (clip.angleDeg * Math.PI) / 180;
  const trackLen = Math.min(width - 56, 560);
  const x0 = 32;
  const y0 = height * 0.78;
  const x1 = x0 + trackLen * Math.cos(angle);
  const y1 = y0 - trackLen * Math.sin(angle);

  ctx.clearRect(0, 0, width, height);
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, cssVar('--film'));
  sky.addColorStop(1, cssVar('--paper-2'));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = cssVar('--accent-2');
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.strokeStyle = cssVar('--line-strong');
  ctx.lineWidth = 3;
  ctx.stroke();

  const frame = currentFrame();
  const along = frame ? frame.s / 1.2 : 0;
  const cartX = x0 + (x1 - x0) * along;
  const cartY = y0 + (y1 - y0) * along;
  scene.cart = { x: cartX, y: cartY, r: 36 };

  game.lab.marks.forEach((mark) => {
    const k = mark.s / 1.2;
    const mx = x0 + (x1 - x0) * k;
    const my = y0 + (y1 - y0) * k;
    ctx.beginPath();
    ctx.fillStyle = cssVar('--teal');
    ctx.arc(mx, my - 18, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = cssVar('--line-strong');
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  ctx.save();
  ctx.translate(cartX, cartY);
  ctx.rotate(-angle);
  ctx.fillStyle = cssVar('--accent');
  drawRoundRect(ctx, -28, -22, 56, 24, 6);
  ctx.fill();
  ctx.strokeStyle = cssVar('--line-strong');
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#f8fbff';
  drawRoundRect(ctx, 2, -18, 16, 12, 3);
  ctx.fill();
  ctx.fillStyle = cssVar('--line-strong');
  ctx.beginPath();
  ctx.arc(-14, 6, 7, 0, Math.PI * 2);
  ctx.arc(16, 6, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function graphPoint(value, max, y0 = 112, span = 90) {
  return y0 - (Math.max(0, value) / max) * span;
}

function renderGraph(group, fit, points, xMax, yMax, mapX, mapY) {
  const fragment = document.createDocumentFragment();
  points.forEach((point) => {
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('class', 'graph-point');
    circle.setAttribute('cx', mapX(point.x).toFixed(1));
    circle.setAttribute('cy', mapY(point.y).toFixed(1));
    circle.setAttribute('r', '4.5');
    fragment.append(circle);
  });
  group.replaceChildren(fragment);
  if (points.length >= 2) {
    const first = points[0];
    const last = points.at(-1);
    fit.setAttribute('d', `M${mapX(first.x).toFixed(1)} ${mapY(first.y).toFixed(1)} L${mapX(last.x).toFixed(1)} ${mapY(last.y).toFixed(1)}`);
  } else {
    fit.setAttribute('d', '');
  }
}

function renderTableAndGraphs() {
  const marks = game.lab.marks;
  const velocities = intervalVelocities(marks);
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < MARK_COUNT; i += 1) {
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
  elements.markCount.textContent = `${marks.length} / ${MARK_COUNT}`;

  const stPoints = marks.map((mark) => ({ x: mark.t, y: mark.s }));
  renderGraph(
    elements.stPoints,
    elements.stFit,
    stPoints,
    0.5,
    0.7,
    (tValue) => 36 + (tValue / 0.5) * 168,
    (sValue) => graphPoint(sValue, 0.7),
  );
  const vtPoints = velocities.map((row) => ({ x: row.tMid, y: row.v }));
  renderGraph(
    elements.vtPoints,
    elements.vtFit,
    vtPoints,
    0.5,
    2.6,
    (tValue) => 36 + (tValue / 0.5) * 168,
    (vValue) => graphPoint(vValue, 2.6),
  );

  const speed = speedFromMarks(marks);
  const accel = accelerationFromMarks(marks);
  if (marks.length >= 2 && speed !== null && game.lab.clip.kind === 'uniform') {
    elements.slopeLine.textContent = text('slopeSpeed', decimal(speed));
  } else if (velocities.length >= 2 && accel !== null) {
    elements.slopeLine.textContent = text('slopeAccel', decimal(accel));
  } else {
    elements.slopeLine.textContent = '';
  }
  elements.graphHint.hidden = marks.length >= 2;
}

function missionTitle() {
  return {
    uniform: 'filmTitle',
    accel: 'filmTitleAccel',
    design: 'filmTitleDesign',
  }[game.missionId];
}

function formulaKey() {
  return {
    uniform: 'formulaUniform',
    accel: 'formulaAccel',
    design: 'formulaDesign',
  }[game.missionId];
}

function allDone() {
  return MISSIONS.every((id) => game.done[id]);
}

function render() {
  document.title = text('doc');
  renderSound();
  elements.themeBtn.setAttribute('aria-label', text('theme'));
  elements.langBtn.setAttribute('aria-label', text('lang'));
  elements.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
  elements.themeBtn.textContent = window.cool?.preferences?.theme === 'light' ? '🌙' : '☀️';
  elements.filmTitle.textContent = text(missionTitle());
  elements.missionCode.textContent = `CLIP 0${MISSIONS.indexOf(game.missionId) + 1} · ${text({
    uniform: 'clipUniform',
    accel: 'clipAccel',
    design: 'clipDesign',
  }[game.missionId])}`;
  const frame = currentFrame();
  elements.frameReadout.textContent = `${Math.min(game.lab.frameIndex + 1, MARK_COUNT)} / ${MARK_COUNT}`;
  elements.timeReadout.textContent = `t = ${decimal(frame?.t ?? 0)} s`;
  elements.angleReadout.textContent = `${game.lab.clip.angleDeg}°`;
  elements.markBtn.disabled = game.lab.marks.length >= MARK_COUNT || game.lab.concluded;
  elements.designCard.hidden = game.missionId !== 'design';
  elements.formulaStrip.hidden = game.lab.marks.length < 2;
  elements.formulaStrip.textContent = game.lab.marks.length >= 2 ? text(formulaKey()) : '';
  document.querySelectorAll('[data-prediction]').forEach((button) => {
    button.classList.toggle('is-selected', button.dataset.prediction === game.prediction);
  });
  document.querySelectorAll('[data-angle]').forEach((button) => {
    button.classList.toggle('is-selected', Number(button.dataset.angle) === game.designAngle);
  });
  document.querySelectorAll('[data-law]').forEach((button) => {
    button.classList.toggle('is-selected', button.dataset.law === game.lawChoice);
  });
  renderNotice(elements.filmFeedback, game.filmNotice.key === 'tip0' ? null : game.filmNotice);
  elements.tip.textContent = text('tip0');
  renderNotice(elements.labFeedback, game.labNotice);
  elements.conclusionStatus.textContent = allDone() ? text('allDone') : '';
  elements.conclusionStatus.classList.toggle('is-success', allDone());
  elements.app.dataset.mobilePanel = game.mobilePanel;
  document.querySelectorAll('.mobile-nav__button').forEach((button) => {
    const active = button.dataset.mobilePanel === game.mobilePanel;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderTableAndGraphs();
  drawStage();
}

function advanceIfReady() {
  if (!game.lab.concluded) return;
  const index = MISSIONS.indexOf(game.missionId);
  if (index < MISSIONS.length - 1) {
    game.missionId = MISSIONS[index + 1];
    game.lab = startMission(game.missionId, { angleDeg: game.designAngle });
    game.prediction = null;
    game.lawChoice = null;
    setFilmNotice('tip0');
    window.cool?.stage?.(game.missionId);
    maybeSwitchPanel(game.missionId === 'design' ? 'advance-design' : 'advance');
  } else if (allDone()) {
    window.cool?.complete?.();
    tone('complete');
  }
}

function markCurrent(fromCanvas = false) {
  const frame = currentFrame();
  if (!frame) return;
  const markedS = fromCanvas ? frame.s : frame.s;
  const result = markFrame(game.lab, markedS);
  if (!result.ok) {
    setFilmNotice(result.reason === 'miss' ? 'missed' : 'needMarks', 'error');
    if (result.reason === 'miss') window.cool?.track?.('missed_cart', { mission: game.missionId });
    tone('error');
    render();
    return;
  }
  setFilmNotice('marked', 'success');
  window.cool?.track?.('marked_motion_frame', { mission: game.missionId, n: game.lab.marks.length });
  window.cool?.stage?.('marking');
  tone('mark');
  if (game.lab.marks.length >= MARK_COUNT) maybeSwitchPanel('marked-complete');
  render();
}

function missMark() {
  const result = markFrame(game.lab, (currentFrame()?.s ?? 0) + 0.2);
  if (!result.ok) {
    setFilmNotice('missed', 'error');
    window.cool?.track?.('missed_cart', { mission: game.missionId });
    tone('error');
    render();
  }
}

function choosePrediction(prediction) {
  game.prediction = prediction;
  setFilmNotice('predSaved', 'success');
  window.cool?.track?.('predicted_motion', { prediction });
  tone('success');
  render();
}

function chooseKind(kind) {
  if (!game.prediction) {
    setLabNotice('needPrediction', 'error');
    tone('error');
    render();
    return;
  }
  const result = concludeMotion(game.lab, kind);
  if (!result.ok) {
    setLabNotice(result.reason === 'incomplete' ? 'needMarks' : 'wrongKind', 'error');
    if (result.reason === 'incomplete') maybeSwitchPanel('need-marks');
    tone('error');
    render();
    return;
  }
  game.done[game.missionId] = game.missionId !== 'design';
  setLabNotice(kind === 'uniform' ? 'uniformDone' : 'accelDone', 'success');
  window.cool?.track?.('concluded_motion', { mission: game.missionId, kind });
  tone('success');
  if (game.missionId !== 'design') advanceIfReady();
  render();
}

function chooseAngle(angleDeg) {
  game.designAngle = angleDeg;
  game.lab = startMission('design', { angleDeg });
  game.lawChoice = null;
  game.done.design = false;
  setFilmNotice('resetDone', 'success');
  window.cool?.track?.('chose_incline_angle', { angle: angleDeg });
  maybeSwitchPanel('choose-angle');
  tone('mark');
  render();
}

function chooseLaw(law) {
  if (!game.lab.concluded || game.lab.conclusion !== 'accelerated') {
    setLabNotice('needAccelFirst', 'error');
    tone('error');
    render();
    return;
  }
  const measured = accelerationFromMarks(game.lab.marks);
  const predicted = predictedAcceleration(game.lab.clip.angleDeg);
  const matches = law === 'sin' && withinRelative(measured, predicted, 0.08);
  game.lawChoice = law;
  if (!matches) {
    setLabNotice('wrongLaw', 'error');
    tone('error');
    render();
    return;
  }
  game.done.design = true;
  setLabNotice('designDone', 'success', [String(game.lab.clip.angleDeg), decimal(measured), decimal(predicted)]);
  window.cool?.track?.('matched_incline_law', { angle: game.lab.clip.angleDeg });
  tone('complete');
  window.cool?.complete?.();
  render();
}

function resetClip() {
  resetMission(game.lab, game.missionId, { angleDeg: game.designAngle });
  game.prediction = null;
  game.lawChoice = null;
  game.done[game.missionId] = false;
  setFilmNotice('resetDone', 'success');
  setLabNotice(null);
  window.cool?.track?.('reset_clip', { mission: game.missionId });
  maybeSwitchPanel('reset');
  tone('mark');
  render();
}

elements.markBtn.addEventListener('click', () => markCurrent(false));
elements.resetBtn.addEventListener('click', resetClip);
elements.soundBtn.addEventListener('click', () => setMuted(!muted));
elements.themeBtn.addEventListener('click', () => window.cool?.preferences?.toggleTheme?.());
elements.langBtn.addEventListener('click', () => window.cool?.preferences?.toggleLang?.());
elements.stage.addEventListener('pointerdown', (event) => {
  const rect = elements.stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const dx = x - scene.cart.x;
  const dy = y - scene.cart.y;
  if (dx * dx + dy * dy <= scene.cart.r * scene.cart.r) markCurrent(true);
  else missMark();
});

document.querySelectorAll('[data-prediction]').forEach((button) => {
  button.addEventListener('click', () => choosePrediction(button.dataset.prediction));
});
document.querySelectorAll('[data-kind]').forEach((button) => {
  button.addEventListener('click', () => chooseKind(button.dataset.kind));
});
document.querySelectorAll('[data-angle]').forEach((button) => {
  button.addEventListener('click', () => chooseAngle(Number(button.dataset.angle)));
});
document.querySelectorAll('[data-law]').forEach((button) => {
  button.addEventListener('click', () => chooseLaw(button.dataset.law));
});
document.querySelectorAll('.mobile-nav__button').forEach((button) => {
  button.addEventListener('click', () => {
    game.mobilePanel = button.dataset.mobilePanel;
    render();
  });
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && audioContext?.state === 'running') audioContext.suspend().catch(() => {});
});
window.addEventListener('resize', resizeStage);

window.cool?.bindI18n?.(I18N, {
  onChange({ t: translate, lang: nextLang }) {
    t = translate;
    lang = nextLang;
    render();
    resizeStage();
  },
});

window.cool?.stage?.('playing');
resizeStage();
