import {
  emptyState,
  snapshot,
  step,
  progress,
  SPECIES,
  MISSIONS,
  missionStart,
} from './eco-model.js';

const SOUND_KEY = 'kidslab.sound.muted';
const SAVE_KEY = 'kidslab.eco-island';

/* 提升在稳定区间内停留的时间占比，鼓励孩子维持而非一次性达成 */
const TICK_MS = 100;
const IDLE_HINT_MS = 30000;

const I18N = {
  zh: {
    doc: '生态小岛 · KidsLab',
    back: '返回平台',
    title: '生态小岛',
    soundOff: '关闭声音',
    soundOn: '打开声音',
    themeLabel: '切换主题',
    islandLabel: '岛',
    sceneLabel: '小岛',
    sceneTitle: '上帝视角',
    hint: '轻提示',
    grass: '草',
    rabbit: '兔',
    fox: '狐',
    carcass: '尸体',
    mushroom: '蘑菇',
    worm: '蚯蚓',
    toolsLabel: '投放台',
    toolsTitle: '放谁上岛',
    campNav: '小岛关卡',
    restart: '重新放',
    nutrient: '土壤养分',
    goallbl: { goal: '目标', band: '达标' },
    statusRolling: '小岛正在慢慢变化…试着让绿色多起来。',
    m1Kicker: '第一岛 · 光秃秃',
    m1Title: '这座岛怎么没有草？',
    m1Ready: '从台子上把草种到岛上，看看会发生什么。',
    m1Hint1: '岛上连一棵草都没有。先种下草，再看兔子会不会来。',
    m1Hint2: '兔子是吃草的。草长起来、兔子来了，这座岛才算活了。',
    m1Desc: '生产者 · 从草开始',
    m2Kicker: '第二岛 · 尸横遍地',
    m2Title: '满地的尸体怎么变回土？',
    m2Ready: '没有分解者，尸体越堆越多，土越来越贫。补上蘑菇或蚯蚓。',
    m2Hint1: '别忘了还有真菌和蚯蚓——它们负责把尸体分解回土壤。',
    m2Hint2: '分解者一上班，尸体就会化掉，土壤重新肥沃。',
    m2Desc: '分解者 · 让土活回来',
    m3Kicker: '第三岛 · 兔满为患',
    m3Title: '兔子太多，草会被吃光！',
    m3Ready: '兔子泛滥成灾。放进一只狐，让它控制兔子的数量。',
    m3Hint1: '兔子的天敌是谁？一只狐就能让它们收敛。',
    m3Hint2: '狐吃兔，兔才不会多到把草啃光。这就是反馈。',
    m3Desc: '消费者 · 平衡一下',
    m4Kicker: '终极岛 · 一片荒芜',
    m4Title: '建一座完整的生态网！',
    m4Ready: '从零开始：生产者、消费者、分解者都放上，让整张网转起来。',
    m4Hint1: '草→兔→狐、蘑菇/蚯蚓分解尸体，缺一环都转不圆。',
    m4Hint2: '每样都来一点，看看整座岛怎么一起活过来。',
    m4Desc: '完整食物网 · 缺一不可',
    finalKicker: '全岛复苏完成',
    finalTitle: '小岛绿了，动物回来了！',
    finalText: '生产者、消费者、分解者各司其职，食物链一环不缺，整座岛才站得稳。',
    nextIsland: '下一座岛',
    playAgain: '再救一座岛',
    lockedCamp: '这一关还不能投放',
    addedMsg: '放上岛了',
    zeroMsg: '已经清空',
  },
  en: {
    doc: 'Eco Island · KidsLab',
    back: 'Back to platform',
    title: 'Eco Island',
    soundOff: 'Turn sound off',
    soundOn: 'Turn sound on',
    themeLabel: 'Switch theme',
    islandLabel: 'Island',
    sceneLabel: 'Island',
    sceneTitle: 'Bird’s-eye view',
    hint: 'Hint',
    grass: 'Grass',
    rabbit: 'Rabbits',
    fox: 'Fox',
    carcass: 'Bones',
    mushroom: 'Mushrooms',
    worm: 'Earthworms',
    toolsLabel: 'Dock',
    toolsTitle: 'Who joins the island?',
    campNav: 'Island levels',
    restart: 'Reset',
    nutrient: 'Soil nutrients',
    goallbl: { goal: 'Goal', band: 'met' },
    statusRolling: 'The island is slowly changing… try to make more green.',
    m1Kicker: 'Island 1 · Barren',
    m1Title: 'Why is this island bare?',
    m1Ready: 'Dock some grass from the tray and watch what happens.',
    m1Hint1: 'There’s not a blade of grass. Plant some, then see if rabbits come.',
    m1Hint2: 'Rabbits eat grass. When grass grows and rabbits arrive, the island is alive.',
    m1Desc: 'Producers · Start with grass',
    m2Kicker: 'Island 2 · Bone yard',
    m2Title: 'How do all these bones turn back into soil?',
    m2Ready: 'With no decomposers, bodies pile up and the soil gets poor. Add moss or worms.',
    m2Hint1: 'Don’t forget mushrooms and worms — they break bodies back into soil.',
    m2Hint2: 'When decomposers get to work, carcasses dissolve and the soil turns fertile.',
    m2Desc: 'Decomposers · Revive the soil',
    m3Kicker: 'Island 3 · Rabbit boom',
    m3Title: 'Too many rabbits — the grass will be eaten bare!',
    m3Ready: 'Rabbits are flooding the island. Bring in a fox to control them.',
    m3Hint1: 'Who preys on rabbits? One fox can rein them in.',
    m3Hint2: 'Foxes eat rabbits, so rabbits can’t eat all the grass. That’s feedback.',
    m3Desc: 'Consumers · Find balance',
    m4Kicker: 'Final island · Barren',
    m4Title: 'Build a complete web!',
    m4Ready: 'From scratch: add producers, consumers, and decomposers so the whole web spins.',
    m4Hint1: 'Grass→rabbits→fox; decay carcasses with mushrooms/worms. Miss one and it breaks.',
    m4Hint2: 'Add a bit of everything and watch the whole island come alive.',
    m4Desc: 'A full web · Every piece matters',
    finalKicker: 'The island is revived',
    finalTitle: 'The island is green and the animals are back!',
    finalText: 'Producers, consumers, and decomposers each do their job. Miss one link and the island can’t stand.',
    nextIsland: 'Next island',
    playAgain: 'Save another island',
    lockedCamp: 'Not allowed on this island',
    addedMsg: 'added to the island',
    zeroMsg: 'all cleared',
  },
};

const SPECIES_META = {
  grass: { icon: '🌱', nameKey: 'grass' },
  rabbit: { icon: '🐇', nameKey: 'rabbit' },
  fox: { icon: '🦊', nameKey: 'fox' },
  mushroom: { icon: '🍄', nameKey: 'mushroom' },
  worm: { icon: '🪱', nameKey: 'worm' },
};

const MISSION_KEYS = ['m1', 'm2', 'm3', 'm4'];

const els = {
  soundBtn: document.getElementById('soundBtn'),
  themeBtn: document.getElementById('themeBtn'),
  langBtn: document.getElementById('langBtn'),
  islandNumber: document.getElementById('islandNumber'),
  islandKicker: document.getElementById('islandKicker'),
  islandTitle: document.getElementById('islandTitle'),
  status: document.getElementById('status'),
  healthRing: document.getElementById('healthRing'),
  healthValue: document.getElementById('healthValue'),
  goalList: document.getElementById('goalList'),
  campNav: document.getElementById('campNav'),
  sceneTitle: document.getElementById('sceneTitle'),
  hintBtn: document.getElementById('hintBtn'),
  stage: document.getElementById('stage'),
  island: document.getElementById('island'),
  legend: document.getElementById('legend'),
  lessonText: document.getElementById('lessonText'),
  mGrass: document.getElementById('mGrass'),
  mRabbit: document.getElementById('mRabbit'),
  mFox: document.getElementById('mFox'),
  mCarcass: document.getElementById('mCarcass'),
  speciesGrid: document.getElementById('speciesGrid'),
  nutrientBar: document.getElementById('nutrientBar'),
  nutrientLabel: document.getElementById('nutrientLabel'),
  restartBtn: document.getElementById('restartBtn'),
  completeModal: document.getElementById('completeModal'),
  nextBtn: document.getElementById('nextBtn'),
};

let t = (key) => key;
let audioContext = null;
let muted = false;
let idleTimer = 0;
let raf = 0;
let lastTick = 0;
let completing = false;

const state = {
  mission: 0,
  sim: emptyState(),
  stable: 0,
  finished: false,
  showHint: false,
  nextReady: false,
};

/* window（画布）逻辑分辨率 */
const VIEW = { w: 640, h: 400 };

const entities = [];

function seedEntities() {
  entities.length = 0;
  const meta = MISSIONS[state.mission];
  for (const key of Object.keys(SPECIES)) {
    const count = meta.start[key] || 0;
    for (let i = 0; i < count && i < 60; i += 1) {
      entities.push(entityFor(key));
    }
  }
}

function entityFor(key) {
  return {
    key,
    x: VIEW.w * 0.1 + Math.random() * VIEW.w * 0.8,
    y: VIEW.h * 0.4 + Math.random() * VIEW.h * 0.5,
  };
}

function syncEntitiesToSim() {
  // 让实体数量尽量贴近 sim 数值（视觉近似，无需一一对应）
  const snap = snapshot(state.sim);
  for (const key of Object.keys(SPECIES)) {
    const want = Math.min(60, snap[key]);
    const have = entities.filter((e) => e.key === key).length;
    if (have < want) {
      for (let i = have; i < want; i += 1) entities.push(entityFor(key));
    } else if (have > want) {
      let count = have - want;
      for (let i = entities.length - 1; i >= 0 && count > 0; i -= 1) {
        if (entities[i].key === key) {
          entities.splice(i, 1);
          count -= 1;
        }
      }
    }
  }
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function drawBackdrop(ctx) {
  const sea = cssVar('--sea') || '#3aa0c4';
  const grass = cssVar('--accent') || '#2ea86b';
  const paper = cssVar('--paper-2') || '#e2efdc';
  // 海
  ctx.fillStyle = sea;
  ctx.globalAlpha = 0.6;
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  ctx.globalAlpha = 1;
  // 岛（沙岸 + 草坡）
  const land = new Path2D();
  land.moveTo(0, VIEW.h);
  land.lineTo(0, VIEW.h * 0.78);
  land.quadraticCurveTo(VIEW.w * 0.2, VIEW.h * 0.5, VIEW.w * 0.5, VIEW.h * 0.62);
  land.quadraticCurveTo(VIEW.w * 0.82, VIEW.h * 0.74, VIEW.w, VIEW.h * 0.56);
  land.lineTo(VIEW.w, VIEW.h);
  land.closePath();
  ctx.fillStyle = cssVar('--accent-2') || '#ffd166';
  ctx.globalAlpha = 0.5;
  ctx.fill(land);
  ctx.globalAlpha = 1;
  ctx.save();
  ctx.clip(land);
  const cover = snapshot(state.sim).grass / 300;
  const grassShade = grass;
  ctx.fillStyle = grassShade;
  ctx.globalAlpha = 0.25 + 0.6 * cover;
  ctx.fillRect(0, VIEW.h * 0.42, VIEW.w, VIEW.h * 0.58);
  ctx.restore();
  // 底纹点
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = paper;
  for (let x = 10; x < VIEW.w; x += 22) {
    for (let y = VIEW.h * 0.5; y < VIEW.h; y += 22) {
      ctx.beginPath();
      ctx.arc(x + (x % 11), y + (y % 9), 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawEntities(ctx) {
  ctx.textBaseline = 'middle';
  for (const e of entities) {
    ctx.globalAlpha = 0.9;
    ctx.font = '18px serif';
    ctx.textAlign = 'center';
    ctx.fillText(iconOf(e.key), e.x, e.y);
  }
  ctx.globalAlpha = 1;
}

function iconOf(key) {
  const spec = SPECIES[key];
  return spec ? spec.icon : '•';
}

function drawCarcass(ctx) {
  const carcasses = snapshot(state.sim).carcasses;
  const n = Math.min(20, Math.round(carcasses / 6));
  ctx.font = '14px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i += 1) {
    const x = (i * 137) % VIEW.w;
    const y = VIEW.h * 0.6 + ((i * 53) % (VIEW.h * 0.28));
    ctx.globalAlpha = 0.85;
    ctx.fillText('🦴', x, y);
  }
  ctx.globalAlpha = 1;
}

function draw(ctx) {
  const w = VIEW.w;
  const h = VIEW.h;
  ctx.clearRect(0, 0, w, h);
  drawBackdrop(ctx);
  drawCarcass(ctx);
  drawEntities(ctx);
}

const canvas = els.island;
const ctx2d = canvas.getContext('2d');

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  // 记录逻辑坐标下的 canvas 尺寸（保留边界 32px）
  VIEW.w = Math.max(320, rect.width - 32);
  VIEW.h = Math.max(220, rect.height - 32);
}

function tickAnimation(timestamp) {
  raf = requestAnimationFrame(tickAnimation);
  if (completing) return;
  if (timestamp - lastTick < TICK_MS) return;
  lastTick = timestamp;
  simulate();
  render();
}

function simulate() {
  step(state.sim);
  updateEntities();
  const p = progress(state.sim, MISSIONS[state.mission]);
  state.stable = p.stable;
  let pct = Math.round((state.stable / p.needed) * 100);
  if (pct > 100) pct = 100;
  if (p.done && !state.finished) {
    completeMission();
  }
  return { pct, done: p.done };
}

function updateEntities() {
  syncEntitiesToSim();
}

function ensureAudio() {
  if (muted) return null;
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    if (!audioContext) audioContext = new AudioCtor();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    return audioContext;
  } catch {
    return null;
  }
}

function tone(freq, duration, type, gainValue, delay = 0) {
  const ctx = ensureAudio();
  if (!ctx || muted) return;
  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playSound(kind) {
  if (muted) return;
  if (kind === 'tap') tone(520, 0.08, 'triangle', 0.03);
  else if (kind === 'good') {
    tone(523, 0.1, 'sine', 0.045);
    tone(659, 0.12, 'sine', 0.04, 0.07);
  } else if (kind === 'bad') {
    tone(220, 0.14, 'sawtooth', 0.03);
    tone(160, 0.16, 'triangle', 0.025, 0.05);
  } else if (kind === 'win') {
    [523, 659, 784, 1046].forEach((freq, index) => tone(freq, 0.18, 'sine', 0.045, index * 0.09));
  }
}

function setMuted(next) {
  muted = next;
  try {
    localStorage.setItem(SOUND_KEY, muted ? '1' : '0');
  } catch {
    /* ignore */
  }
  syncSoundButton();
}

function syncSoundButton() {
  if (!els.soundBtn) return;
  els.soundBtn.textContent = muted ? '🔇' : '🔊';
  els.soundBtn.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
  els.soundBtn.setAttribute('aria-pressed', String(muted));
}

function track(name) {
  try {
    window.cool?.track?.(name);
  } catch {
    /* ignore */
  }
}

function stage(name) {
  try {
    window.cool?.stage?.(name);
  } catch {
    /* ignore */
  }
}

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      mission: state.mission,
      finished: state.finished,
      nextReady: state.nextReady,
    }));
  } catch {
    /* ignore */
  }
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return;
    if (Number.isInteger(data.mission)) state.mission = Math.max(0, Math.min(3, data.mission));
    state.finished = Boolean(data.finished);
    state.nextReady = Boolean(data.nextReady);
  } catch {
    /* ignore */
  }
}

function setStatus(text) {
  els.status.textContent = text;
}

function missionCopy() {
  const key = MISSION_KEYS[state.mission];
  return {
    kicker: t(`${key}Kicker`),
    title: t(`${key}Title`),
    ready: t(`${key}Ready`),
    desc: t(`${key}Desc`),
    hint1: t(`${key}Hint1`),
    hint2: t(`${key}Hint2`),
  };
}

function goalCopy(m) {
  const order = [
    ['grass', t('grass')],
    ['rabbit', t('rabbit')],
    ['fox', t('fox')],
    ['carcasses', t('carcass')],
  ];
  return order.filter(([key]) => key in m.goal);
}

function goalBandText(band) {
  const lo = band[0] ?? 0;
  const hi = band[1] ?? '∞';
  return lo === 0 && hi === '∞' ? '∞' : `${lo}~${hi}`;
}

function isGoalMet(key, band) {
  const value = snapshot(state.sim)[key];
  return value >= (band[0] ?? -Infinity) && value <= (band[1] ?? Infinity);
}

function renderNav() {
  els.campNav.innerHTML = '';
  MISSIONS.forEach((m, index) => {
    const key = MISSION_KEYS[index];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'camp-btn';
    btn.dataset.mission = m.id;
    btn.textContent = t(`${key}Kicker`);
    btn.setAttribute('aria-label', t(`${key}Title`));
    if (index === state.mission) btn.setAttribute('aria-current', 'true');
    btn.addEventListener('click', () => {
      if (index >= 0 && index < 4) selectMission(index);
    });
    els.campNav.append(btn);
  });
  els.campNav.setAttribute('aria-label', t('campNav'));
}

function renderGoals() {
  const m = MISSIONS[state.mission];
  els.goalList.innerHTML = '';
  for (const [key, name] of goalCopy(m)) {
    const row = document.createElement('div');
    row.className = 'goal';
    const band = m.goal[key];
    const met = isGoalMet(key, band);
    row.dataset.done = String(met);
    const mark = document.createElement('span');
    mark.className = 'goal__mark';
    mark.textContent = met ? '✅' : '🌱';
    const text = document.createElement('span');
    text.textContent = `${name} ${goalBandText(band)}`;
    row.append(mark, text);
    els.goalList.append(row);
  }
}

function renderTools() {
  const available = MISSIONS[state.mission].available;
  els.speciesGrid.innerHTML = '';
  for (const key of available) {
    const meta = SPECIES_META[key] || {};
    const card = document.createElement('div');
    card.className = 'species-card';
    card.dataset.species = key;

    const name = document.createElement('div');
    name.className = 'species-card__name';
    name.innerHTML = `<span aria-hidden="true">${meta.icon || '•'}</span><span>${t(meta.nameKey)}</span><span class="count" data-count>0</span>`;
    const ctrl = document.createElement('div');
    ctrl.className = 'species-card__ctrl';
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.className = 'minus';
    minus.textContent = '−';
    minus.dataset.dir = 'down';
    minus.setAttribute('aria-label', `- ${t(meta.nameKey)}`);
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.textContent = '+';
    plus.dataset.dir = 'up';
    plus.setAttribute('aria-label', `+ ${t(meta.nameKey)}`);
    ctrl.append(minus, plus);
    card.append(name, ctrl);
    card.querySelector('.count').textContent = String(roundCount(state.sim[key]));

    minus.addEventListener('click', () => adjust(key, -1));
    plus.addEventListener('click', () => adjust(key, 1));
    plus.addEventListener('click', playSoundTap);
    els.speciesGrid.append(card);
    card.dataset.count = String(roundCount(state.sim[key]));
  }
}

function playSoundTap() {
  playSound('tap');
}

function roundCount(v) {
  return Math.max(0, Math.round(v));
}

function adjust(key, delta) {
  const sim = state.sim;
  const m = MISSIONS[state.mission];
  if (!m.available.includes(key)) {
    playSound('bad');
    setStatus(missMsg(key));
    return;
  }
  const next = Math.max(0, roundCount(sim[key]) + delta);
  sim[key] = next;
  // 观众反馈：叠加到对应实体池
  seedEntities();
  setStatus(adjustMsg(key, next));
  playSound(delta > 0 ? 'good' : 'tap');
  save();
  render();
}

function missMsg(key) {
  return `${t('toolsTitle')}：${t(SPECIES_META[key]?.nameKey || key)} ${t('lockedCamp')}`;
}

function adjustMsg(key, next) {
  const name = t(SPECIES_META[key]?.nameKey || key);
  return `${name} → ${next}。${next === 0 ? t('zeroMsg') : t('addedMsg')}`;
}

function renderMeters() {
  const snap = snapshot(state.sim);
  els.mGrass.textContent = String(snap.grass);
  els.mRabbit.textContent = String(snap.rabbit);
  els.mFox.textContent = String(snap.fox);
  els.mCarcass.textContent = String(snap.carcasses);
  const nutrientPct = Math.min(100, Math.round((snap.nutrients / 120) * 100));
  els.nutrientBar.style.setProperty('width', `${nutrientPct}%`);
  els.nutrientBar.classList.toggle('bar--fertile', snap.nutrients > 60);
}

function completeMission() {
  state.finished = true;
  state.nextReady = state.mission < 3;
  playSound('win');
  setStatus(t('finalKicker'));
  try {
    window.cool?.complete?.();
  } catch {
    /* ignore */
  }
  track(`eco-${MISSIONS[state.mission].id}-done`);
  save();
  render();
  if (state.nextReady) els.nextBtn?.focus();
}

function selectMission(index) {
  state.mission = Math.max(0, Math.min(3, index));
  state.sim = missionStart(MISSIONS[state.mission]);
  state.stable = 0;
  state.finished = false;
  state.nextReady = false;
  seedEntities();
  stage(MISSIONS[state.mission].id);
  playSound('tap');
  syncCanvas();
  save();
  render();
}

function syncCanvas() {
  resizeCanvas();
  updateEntities();
  draw(ctx2d);
}

function renderHealth() {
  const p = state.finished
    ? 100
    : Math.min(100, Math.round((state.stable / (MISSIONS[state.mission].needed || 50)) * 100));
  els.healthRing.setAttribute('data-pct', String(p));
  els.healthRing.style.background = `conic-gradient(var(--bar-fill) ${p * 3.6}deg, var(--bar-bg) 0deg)`;
  els.healthValue.textContent = `${p}%`;
}

function render() {
  renderMeters();
  renderNav();
  renderGoals();
  renderTools();
  renderHealth();
  const copy = missionCopy();
  els.islandNumber.textContent = String(state.mission + 1).padStart(2, '0');
  els.islandKicker.textContent = copy.kicker;
  els.islandTitle.textContent = copy.title;
  els.sceneTitle.textContent = copy.desc;
  els.lessonText.textContent = t('statusRolling');
  els.lessonText.hidden = !state.showHint;
  els.completeModal.hidden = !state.finished;
  if (els.nextBtn) els.nextBtn.textContent = state.mission === 3 ? t('playAgain') : t('nextIsland');
  syncSoundButton();
  if (els.themeBtn) els.themeBtn.setAttribute('aria-label', t('themeLabel'));
  draw(ctx2d);
}

function restart() {
  selectMission(state.mission);
  state.showHint = false;
  setStatus(missionCopy().ready);
  playSound('tap');
}

function hint() {
  state.showHint = true;
  const copy = missionCopy();
  setStatus(state.stable > 0 ? copy.hint2 : copy.hint1);
  playSound('tap');
  save();
  render();
  bumpIdle();
}

function bumpIdle() {
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => {
    if (!state.finished && !state.showHint) {
      state.showHint = true;
      setStatus(missionCopy().hint1);
      render();
    }
  }, IDLE_HINT_MS);
}

els.soundBtn?.addEventListener('click', () => setMuted(!muted));
els.themeBtn?.addEventListener('click', () => window.cool.preferences.toggleTheme());
els.langBtn?.addEventListener('click', () => window.cool.preferences.toggleLang());
els.hintBtn?.addEventListener('click', hint);
els.restartBtn?.addEventListener('click', restart);
els.nextBtn?.addEventListener('click', () => {
  if (state.mission === 3) {
    restart();
  } else {
    selectMission(state.mission + 1);
  }
});

els.stage.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  // 简单的点击：不落地，仅作反馈
  void x; void y;
});

window.addEventListener('resize', syncCanvas);
document.addEventListener('visibilitychange', () => {
  if (document.hidden && audioContext && audioContext.state === 'running') {
    audioContext.suspend().catch(() => {});
  }
});

try {
  muted = localStorage.getItem(SOUND_KEY) === '1';
} catch {
  muted = false;
}

load();
state.sim = missionStart(MISSIONS[state.mission]);
state.stable = 0;
seedEntities();

window.cool.bindI18n(I18N, {
  onChange({ t: translate, lang, theme }) {
    t = translate;
    document.title = t('doc');
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    if (els.langBtn) els.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    if (els.themeBtn) els.themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    render();
    draw(ctx2d);
  },
});

if (!state.finished) setStatus(missionCopy().ready);
render();
bumpIdle();
resizeCanvas();
updateEntities();
draw(ctx2d);
stage(MISSIONS[state.mission].id);
raf = requestAnimationFrame(tickAnimation);