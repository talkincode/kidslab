import {
  MAX_FORCE,
  MISSION_ORDER,
  applyChoice,
  createSite,
  leverPlan,
  pulleyPlan,
  rampPlan,
} from './pyramid-model.js';

const SAVE_KEY = 'kidslab.mini-pyramid';
const SOUND_KEY = 'kidslab.sound.muted';

const I18N = {
  zh: {
    doc: '🏗️ 小小金字塔 · KidsLab',
    back: '返回平台',
    title: '小小金字塔',
    soundOff: '关闭声音',
    soundOn: '打开声音',
    themeLabel: '切换主题',
    routeLabel: '工程关卡',
    sceneCanvas: '金字塔工程动画',
    readoutLabel: '机械读数',
    eyebrow: '法老的工程订单',
    hint: '给我一点提示',
    reset: '重新规划',
    forceLabel: '需要的力量',
    distanceLabel: '要拉的距离',
    workLabel: '搬运工作量',
    forceUnit: '力量格',
    distanceUnit: '米',
    workUnit: '格·米',
    plan: '让巨石动起来',
    tryAgain: '石块还在原地，换个方案马上再试。',
    tooHeavy: (force) => `太重了：${force} 格 > 4 格，换方案。`,
    complete: '金字塔竣工啦！',
    certEyebrow: '工程总监认证',
    certTitle: '金字塔竣工啦！',
    certText: '你让石块变得省力，却没有把工作量变没：路和绳子替你变长了。',
    again: '再盖一座',
    missions: [
      {
        name: '斜面',
        label: '订单 1 / 3 · 斜面',
        title: '让巨石走上斜坡',
        text: '选长坡，工人别用超过 4 格力量。',
        select: '坡道要多长？',
        options: ['3 米', '4 米', '6 米'],
        hint: '坡越缓，推起来越轻；只是要走得更远。',
        stage: '巨石要升高 2 米',
        win: '坡道铺好了！石块省力地滑上第一层。',
      },
      {
        name: '杠杆',
        label: '订单 2 / 3 · 杠杆',
        title: '把支点挪近巨石',
        text: '拖动支点，工人力量别超过 4 格。',
        select: '工人离支点多远？',
        hint: '支点靠近石块，工人那一端就会更长、更省力。',
        stage: '撬棍正在找平衡',
        win: '支点找对了！巨石被稳稳撬起来。',
      },
      {
        name: '滑轮组',
        label: '订单 3 / 3 · 滑轮组',
        title: '给吊车多挂几轮',
        text: '多挂绳子，一起托起巨石。',
        select: '几股绳子托住巨石？',
        options: ['2 股绳', '3 股绳', '4 股绳'],
        hint: '一起托住石块的绳段越多，每一股分到的力越少。',
        stage: '巨石等着被吊到顶层',
        win: '四股绳一起发力，最后一块巨石升上顶层！',
      },
    ],
  },
  en: {
    doc: '🏗️ Mini Pyramid · KidsLab',
    back: 'Back to platform',
    title: 'Mini Pyramid',
    soundOff: 'Turn sound off',
    soundOn: 'Turn sound on',
    themeLabel: 'Switch theme',
    routeLabel: 'Build missions',
    sceneCanvas: 'Pyramid building animation',
    readoutLabel: 'Machine readings',
    eyebrow: 'The pharaoh’s work order',
    hint: 'Give me a hint',
    reset: 'Plan again',
    forceLabel: 'Force needed',
    distanceLabel: 'Pull distance',
    workLabel: 'Moving work',
    forceUnit: 'force tiles',
    distanceUnit: 'm',
    workUnit: 'tile·m',
    plan: 'Move the stone',
    tryAgain: 'The stone is still at the start. Swap the plan and try again.',
    tooHeavy: (force) => `Too heavy: ${force} > 4 tiles. Change the plan.`,
    complete: 'The pyramid is complete!',
    certEyebrow: 'Chief engineer certificate',
    certTitle: 'The pyramid is complete!',
    certText: 'You made the stone easier to move, but did not erase the work: the path and rope became longer for you.',
    again: 'Build another',
    missions: [
      {
        name: 'Ramp',
        label: 'Order 1 / 3 · Ramp',
        title: 'Walk the stone up a ramp',
        text: 'Choose a ramp. Keep force under 4 tiles.',
        select: 'How long is the ramp?',
        options: ['3 m', '4 m', '6 m'],
        hint: 'A gentler ramp feels lighter, but makes the trip longer.',
        stage: 'The stone must rise 2 m',
        win: 'Ramp laid! The stone glides onto the first level.',
      },
      {
        name: 'Lever',
        label: 'Order 2 / 3 · Lever',
        title: 'Move the fulcrum near the stone',
        text: 'Slide the fulcrum. Keep force under 4 tiles.',
        select: 'How far from the fulcrum do workers stand?',
        hint: 'Place the fulcrum near the stone to make the workers’ side longer and easier.',
        stage: 'The pry bar is finding balance',
        win: 'Fulcrum found! The stone lifts steadily.',
      },
      {
        name: 'Pulley',
        label: 'Order 3 / 3 · Pulley',
        title: 'Hang more wheels on the hoist',
        text: 'Add ropes to share the stone’s weight.',
        select: 'How many ropes support the stone?',
        options: ['2 ropes', '3 ropes', '4 ropes'],
        hint: 'More rope sections supporting the stone means each one pulls less.',
        stage: 'The stone waits for the top level',
        win: 'Four ropes pull together: the last stone reaches the top!',
      },
    ],
  },
};

const els = {
  backBtn: document.getElementById('backBtn'),
  soundBtn: document.getElementById('soundBtn'),
  themeBtn: document.getElementById('themeBtn'),
  langBtn: document.getElementById('langBtn'),
  route: document.getElementById('route'),
  tip: document.getElementById('tip'),
  stageLabel: document.getElementById('stageLabel'),
  sceneBadge: document.getElementById('sceneBadge'),
  canvas: document.getElementById('pyramidCanvas'),
  stepCount: document.getElementById('stepCount'),
  missionTitle: document.getElementById('missionTitle'),
  missionText: document.getElementById('missionText'),
  forceValue: document.getElementById('forceValue'),
  distanceValue: document.getElementById('distanceValue'),
  workValue: document.getElementById('workValue'),
  readout: document.getElementById('readout'),
  controlZone: document.getElementById('controlZone'),
  status: document.getElementById('status'),
  hintBtn: document.getElementById('hintBtn'),
  resetBtn: document.getElementById('resetBtn'),
  celebration: document.getElementById('celebration'),
  againBtn: document.getElementById('againBtn'),
};

let t = (key) => key;
let activeLang = 'zh';
let muted = localStorage.getItem(SOUND_KEY) === 'true';
let audioContext = null;
let site = createSite();
let choices = { ramp: 3, lever: 1, pulley: 2 };
let showHint = false;
let feedback = '';
let feedbackKind = '';

function restore() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    if (!saved || !saved.site || !Number.isInteger(saved.site.mission)
      || saved.site.mission < 0 || saved.site.mission > MISSION_ORDER.length
      || !Array.isArray(saved.site.cleared)) {
      throw new TypeError('invalid saved pyramid state');
    }
    site = {
      ...createSite(),
      ...saved.site,
      cleared: [...saved.site.cleared],
      attempts: Array.isArray(saved.site.attempts) ? saved.site.attempts : [],
    };
    choices = { ...choices, ...saved.choices };
    feedback = saved.feedback || '';
    feedbackKind = saved.feedbackKind || '';
  } catch (error) {
    localStorage.removeItem(SAVE_KEY);
    feedback = 'Saved plan was invalid and was reset.';
    feedbackKind = 'is-error';
  }
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ site, choices, feedback, feedbackKind }));
}

function currentMissionIndex() {
  return Math.min(site.mission, MISSION_ORDER.length - 1);
}

function currentPlan() {
  const kind = MISSION_ORDER[currentMissionIndex()];
  if (kind === 'ramp') return rampPlan({ length: choices.ramp });
  if (kind === 'lever') return leverPlan({ effortArm: choices.lever });
  return pulleyPlan({ supports: choices.pulley });
}

function format(value, unit) {
  if (!Number.isFinite(value)) return '—';
  const readable = Number.isInteger(value) ? String(value) : value.toFixed(2);
  return unit ? `${readable} ${unit}` : readable;
}

function missionFor(index = currentMissionIndex()) {
  return I18N[activeLang].missions[index];
}

function setFeedback(message, kind = '') {
  feedback = message;
  feedbackKind = kind;
}

function renderRoute() {
  const available = Math.min(site.mission, MISSION_ORDER.length - 1);
  els.route.innerHTML = MISSION_ORDER.map((kind, index) => {
    const cleared = site.cleared.includes(kind);
    const current = index === currentMissionIndex();
    const disabled = index > available ? 'disabled' : '';
    return `<li><button type="button" data-route="${index}" ${disabled} aria-current="${current ? 'step' : 'false'}" class="${cleared ? 'is-cleared' : ''}" aria-label="${missionFor(index).name}">${cleared ? '✓' : index + 1}</button></li>`;
  }).join('');
  els.route.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.route);
      if (index !== currentMissionIndex()) {
        site = { ...site, mission: index, complete: false };
        showHint = false;
        setFeedback('');
        save();
        render();
      }
    });
  });
}

function renderControls(mission) {
  const kind = MISSION_ORDER[currentMissionIndex()];
  if (kind === 'lever') {
    els.controlZone.innerHTML = `
      <label class="choice-label" for="leverArm">${mission.select}</label>
      <div class="slider-wrap">
        <div class="slider-line">
          <input id="leverArm" type="range" min="1" max="3" step="1" value="${choices.lever}" aria-label="${mission.select}" />
          <output id="leverOutput">${choices.lever} m</output>
        </div>
        <div class="range-labels"><span>1 m</span><span>2 m</span><span>3 m</span></div>
      </div>
      <button class="primary" id="moveBtn" type="button">${t('plan')}</button>`;
    els.controlZone.querySelector('#leverArm').addEventListener('input', (event) => {
      choices.lever = Number(event.target.value);
      setFeedback('');
      save();
      render();
    });
  } else {
    const values = kind === 'ramp' ? [3, 4, 6] : [2, 3, 4];
    const choiceValue = kind === 'ramp' ? choices.ramp : choices.pulley;
    els.controlZone.innerHTML = `
      <span class="choice-label">${mission.select}</span>
      <div class="choices">${values.map((value, index) => `<button class="choice" type="button" data-choice="${value}" aria-pressed="${value === choiceValue}">${mission.options[index]}</button>`).join('')}</div>
      <button class="primary" id="moveBtn" type="button">${t('plan')}</button>`;
    els.controlZone.querySelectorAll('[data-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        if (kind === 'ramp') choices.ramp = Number(button.dataset.choice);
        else choices.pulley = Number(button.dataset.choice);
        setFeedback('');
        save();
        render();
        playSound('select');
      });
    });
  }
  els.controlZone.querySelector('#moveBtn').addEventListener('click', runPlan);
}

function render() {
  const mission = missionFor();
  const plan = currentPlan();
  document.title = t('doc');
  els.backBtn.setAttribute('aria-label', t('back'));
  els.langBtn.textContent = activeLang === 'zh' ? 'EN' : '中';
  els.themeBtn.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
  els.themeBtn.setAttribute('aria-label', t('themeLabel'));
  els.soundBtn.textContent = muted ? '🔇' : '🔊';
  els.soundBtn.setAttribute('aria-pressed', String(muted));
  els.soundBtn.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
  els.route.setAttribute('aria-label', t('routeLabel'));
  els.canvas.setAttribute('aria-label', t('sceneCanvas'));
  els.readout.setAttribute('aria-label', t('readoutLabel'));
  els.tip.textContent = showHint ? mission.hint : mission.text;
  els.hintBtn.setAttribute('aria-expanded', String(showHint));
  els.stepCount.textContent = mission.label;
  els.missionTitle.textContent = mission.title;
  els.missionText.textContent = mission.text;
  els.stageLabel.textContent = mission.name;
  els.sceneBadge.textContent = mission.stage;
  els.forceValue.textContent = format(plan.effort, t('forceUnit'));
  els.distanceValue.textContent = format(plan.effortDistance ?? plan.distance, t('distanceUnit'));
  els.workValue.textContent = format(plan.work, t('workUnit'));
  els.status.textContent = feedback;
  els.status.className = `feedback ${feedbackKind}`;
  renderRoute();
  renderControls(mission);
  els.celebration.hidden = !site.complete;
  draw();
}

function choiceForCurrentMission() {
  const kind = MISSION_ORDER[currentMissionIndex()];
  if (kind === 'ramp') return { kind, length: choices.ramp };
  if (kind === 'lever') return { kind, effortArm: choices.lever };
  return { kind, supports: choices.pulley };
}

function runPlan() {
  const before = currentMissionIndex();
  const result = applyChoice(site, choiceForCurrentMission());
  site = result.site;
  showHint = false;
  window.cool?.stage('level2');
  window.cool?.track('plan-machine');

  if (result.error === 'too-heavy') {
    setFeedback(t('tooHeavy', format(result.plan.effort, '')), 'is-error');
    playSound('error');
  } else if (result.error) {
    setFeedback(t('tryAgain'), 'is-error');
    playSound('error');
  } else if (site.complete) {
    setFeedback(t('complete'), 'is-win');
    window.cool?.complete?.();
    playSound('complete');
  } else {
    setFeedback(I18N[activeLang].missions[before].win, 'is-win');
    playSound('success');
  }
  save();
  render();
  if (site.complete) requestAnimationFrame(() => els.againBtn.focus());
}

function reset() {
  site = createSite();
  choices = { ramp: 3, lever: 1, pulley: 2 };
  showHint = false;
  setFeedback('');
  window.cool?.progress?.clear();
  save();
  render();
  playSound('select');
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function draw() {
  const rect = els.canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  els.canvas.width = Math.round(rect.width * scale);
  els.canvas.height = Math.round(rect.height * scale);
  const ctx = els.canvas.getContext('2d');
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const { width: w, height: h } = rect;
  const kind = MISSION_ORDER[currentMissionIndex()];
  const cleared = site.cleared.length;

  ctx.fillStyle = cssVar('--sky');
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = cssVar('--sand');
  ctx.fillRect(0, h * .68, w, h * .32);
  ctx.fillStyle = cssVar('--accent-2');
  ctx.beginPath();
  ctx.arc(w * .8, h * .18, Math.min(w, h) * .09, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = cssVar('--stone');
  const baseY = h * .7;
  for (let row = 0; row < 4; row += 1) {
    const stones = 5 - row;
    const stoneW = Math.min(w * .13, 72);
    const stoneH = Math.min(h * .1, 40);
    const startX = w * .65 - (stones * stoneW) / 2;
    for (let i = 0; i < stones; i += 1) {
      if (row * 5 + i > cleared * 6 + 4) continue;
      ctx.fillRect(startX + i * stoneW + 2, baseY - row * stoneH, stoneW - 4, stoneH - 3);
    }
  }

  ctx.strokeStyle = cssVar('--line-strong');
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const stoneX = kind === 'ramp' ? w * .23 : w * .3;
  const stoneY = h * .62;
  if (kind === 'ramp') {
    ctx.beginPath();
    ctx.moveTo(w * .08, h * .68);
    ctx.lineTo(w * .52, h * .42);
    ctx.lineTo(w * .52, h * .68);
    ctx.closePath();
    ctx.fillStyle = cssVar('--accent');
    ctx.globalAlpha = .72;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();
  } else if (kind === 'lever') {
    ctx.beginPath();
    ctx.moveTo(w * .1, h * .61);
    ctx.lineTo(w * .55, h * .45);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * .34, h * .66);
    ctx.lineTo(w * .41, h * .57);
    ctx.lineTo(w * .48, h * .66);
    ctx.closePath();
    ctx.fillStyle = cssVar('--accent-2');
    ctx.fill();
    ctx.stroke();
  } else {
    for (let i = 0; i < choices.pulley; i += 1) {
      const x = w * (.18 + i * .09);
      ctx.beginPath();
      ctx.arc(x, h * .26, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, h * .27);
      ctx.lineTo(x, h * .55);
      ctx.stroke();
    }
  }
  ctx.fillStyle = cssVar('--stone');
  ctx.fillRect(stoneX, stoneY, Math.min(w * .18, 100), Math.min(h * .12, 52));
  ctx.strokeRect(stoneX, stoneY, Math.min(w * .18, 100), Math.min(h * .12, 52));
}

function playTone(context, kind) {
  const frequencies = { select: 460, error: 165, success: 660, complete: 780 };
  const osc = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  osc.type = kind === 'error' ? 'sawtooth' : 'sine';
  osc.frequency.setValueAtTime(frequencies[kind], now);
  if (kind === 'complete') osc.frequency.exponentialRampToValueAtTime(1040, now + .16);
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(.12, now + .018);
  gain.gain.exponentialRampToValueAtTime(.0001, now + (kind === 'complete' ? .35 : .18));
  osc.connect(gain).connect(context.destination);
  osc.start(now);
  osc.stop(now + (kind === 'complete' ? .37 : .2));
}

function playSound(kind) {
  if (muted) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioContext) audioContext = new AudioContextClass();
    if (audioContext.state === 'suspended') {
      audioContext.resume()
        .then(() => playTone(audioContext, kind))
        .catch(() => { audioContext = null; });
    } else {
      playTone(audioContext, kind);
    }
  } catch (error) {
    audioContext = null;
  }
}

els.soundBtn.addEventListener('click', () => {
  muted = !muted;
  localStorage.setItem(SOUND_KEY, String(muted));
  render();
  if (!muted) playSound('select');
});
els.langBtn.addEventListener('click', () => window.cool.preferences.toggleLang());
els.themeBtn.addEventListener('click', () => window.cool.preferences.toggleTheme());
els.hintBtn.addEventListener('click', () => {
  showHint = !showHint;
  render();
  playSound('select');
});
els.resetBtn.addEventListener('click', reset);
els.againBtn.addEventListener('click', reset);
window.addEventListener('resize', draw);
window.addEventListener('themechange', draw);

restore();
window.cool.bindI18n(I18N, {
  onChange({ t: translate, lang }) {
    t = translate;
    activeLang = lang;
    render();
  },
});
