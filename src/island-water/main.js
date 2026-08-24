import {
  addLayer,
  campComplete,
  canPour,
  createBucket,
  heat,
  isDrinkable,
  pourFilter,
  scoopLeaves,
  setCollector,
  settle,
  shake,
  taste,
  waterLook,
} from './water-model.js';

const SOUND_KEY = 'kidslab.sound.muted';
const SAVE_KEY = 'kidslab.island-water';

const I18N = {
  zh: {
    doc: '荒岛净水师 · KidsLab',
    back: '返回平台',
    title: '荒岛净水师',
    soundOff: '关闭声音',
    soundOn: '打开声音',
    themeLabel: '切换主题',
    campLabel: '营地',
    turbidity: '浊度',
    salinity: '含盐',
    bucketLabel: '荒岛水桶',
    bucketTitle: '眼前这桶浑汤',
    hint: '轻提示',
    filterLabel: '沙炭滤瓶',
    toolsLabel: '岛上材料',
    toolsTitle: '动手净水',
    restart: '重开一桶',
    campNav: '净水营地',
    lockedCamp: '先完成前一营',
    coconut: '冷凝壳',
    drinkNo: '还不能喝',
    drinkWarn: '清澈但仍咸',
    drinkYes: '可以喝啦',
    finalKicker: '三营净水完成',
    finalTitle: '荒岛亮起可饮用绿灯！',
    finalText: '泥沙能沉、能滤；盐溶解后只能靠蒸汽带走淡水。清澈不等于能喝。',
    playAgain: '再救一桶水',
    lesson: '泥沙会沉，落叶会浮。溶解的盐藏在水里，眼睛看不见。',
    camps: [
      {
        kicker: '第一营 · 沉淀',
        title: '这桶浑汤能喝吗？先让泥沙沉下去',
        ready: '点「静置」，看沙子自己往下掉。',
        hint: '先别摇。静置一会儿，重的泥沙会沉到底。',
        done: '泥沙沉下去了，落叶也捞干净了。下一步试试过滤。',
      },
      {
        kicker: '第二营 · 过滤',
        title: '把泥沙拦住，再尝一口',
        ready: '砾石、沙子、木炭都放进滤瓶，再倒水。',
        hint: '三层滤材都放好才能倒水。滤完一定要尝一口。',
        done: '水变清了，可舌头说它还是咸的！盐滤不掉。',
      },
      {
        kicker: '第三营 · 蒸馏',
        title: '清水还是咸的！用蒸汽收淡水',
        ready: '先扣上椰子壳，再点火加热。',
        hint: '没有椰子壳接着，蒸汽会跑掉。扣壳再加热。',
        done: '蒸汽变成淡水了。再尝一口，绿灯该亮了。',
      },
    ],
    tools: {
      settle: { name: '静置', hint: '让泥沙自己沉' },
      scoop: { name: '捞叶子', hint: '只捞浮上来的' },
      shake: { name: '摇一摇', hint: '再搅浑看看' },
      gravel: { name: '砾石', hint: '粗颗粒垫底' },
      sand: { name: '沙子', hint: '拦住细泥' },
      charcoal: { name: '木炭', hint: '吸附杂质' },
      pour: { name: '倒进滤瓶', hint: '三层齐了再倒' },
      collector: { name: '扣椰子壳', hint: '接着冷却蒸汽' },
      heat: { name: '点火加热', hint: '让水变成蒸汽' },
      taste: { name: '尝一口', hint: '舌头也是仪器' },
    },
    layers: {
      gravel: '砾石层',
      sand: '细沙层',
      charcoal: '木炭层',
    },
    say: {
      settled: '泥沙沉到底了，叶子浮上来。',
      scooped: '浮叶捞走了。这水还是有点浑。',
      notSettled: '叶子还搅在泥汤里，先静置。',
      shaken: '咕嘟咕嘟，又搅成一锅浑汤！',
      processed: '这桶已经滤过或蒸过，不用再摇了。',
      layerIn: (name) => `${name}放进滤瓶了。`,
      layerDup: '这一层已经在瓶子里。',
      pourNeed: '滤瓶还缺材料。砾石、沙子、木炭都要有。',
      poured: '水变清了！浊度降下去，含盐却没动。',
      collectorOn: '椰子壳扣好了，准备接蒸汽。',
      collectorOff: '椰子壳拿开了。',
      steamLost: '蒸汽全跑了！没有壳接着，淡水收不到。',
      distilled: '蒸汽在壳里凝成水珠。含盐掉下去了！',
      muddy: '噗——满嘴泥沙！还不能喝。',
      salty: '清澈见底……居然是咸的！盐藏在水里。',
      fresh: '甜丝丝的淡水！可饮用灯亮了。',
    },
  },
  en: {
    doc: 'Island Water Master · KidsLab',
    back: 'Back to platform',
    title: 'Island Water Master',
    soundOff: 'Turn sound off',
    soundOn: 'Turn sound on',
    themeLabel: 'Switch theme',
    campLabel: 'Camp',
    turbidity: 'Cloudiness',
    salinity: 'Salt',
    bucketLabel: 'Island bucket',
    bucketTitle: 'This muddy soup',
    hint: 'Hint',
    filterLabel: 'Sand-charcoal filter',
    toolsLabel: 'Island kit',
    toolsTitle: 'Clean the water',
    restart: 'New bucket',
    campNav: 'Water camps',
    lockedCamp: 'Finish the previous camp first',
    coconut: 'Coconut condenser',
    drinkNo: 'Not drinkable',
    drinkWarn: 'Clear but salty',
    drinkYes: 'Drinkable',
    finalKicker: 'All three camps done',
    finalTitle: 'The drinkable light is green!',
    finalText: 'Mud can settle and be filtered. Dissolved salt only leaves when steam carries fresh water away. Clear is not the same as safe to drink.',
    playAgain: 'Save another bucket',
    lesson: 'Mud sinks and leaves float. Dissolved salt hides in the water, invisible.',
    camps: [
      {
        kicker: 'Camp 1 · Settle',
        title: 'Can you drink this soup? Let the mud sink first',
        ready: 'Tap Settle and watch the grit drop.',
        hint: 'Don’t shake. Wait, and the heavy grit will sink.',
        done: 'The grit sank and the leaves are gone. Next: filter.',
      },
      {
        kicker: 'Camp 2 · Filter',
        title: 'Trap the grit, then take a sip',
        ready: 'Load gravel, sand, and charcoal, then pour.',
        hint: 'All three layers must be in before you pour. Then taste.',
        done: 'It looks clear, but your tongue says salty! Salt won’t filter out.',
      },
      {
        kicker: 'Camp 3 · Distill',
        title: 'Clear water is still salty! Catch steam',
        ready: 'Cover with the coconut shell, then heat.',
        hint: 'With no shell, the steam escapes. Cover, then heat.',
        done: 'Steam turned into fresh water. Taste it — the green light should come on.',
      },
    ],
    tools: {
      settle: { name: 'Settle', hint: 'Let grit sink' },
      scoop: { name: 'Scoop leaves', hint: 'Only floating ones' },
      shake: { name: 'Shake', hint: 'Muddy it again' },
      gravel: { name: 'Gravel', hint: 'Coarse base' },
      sand: { name: 'Sand', hint: 'Trap fine silt' },
      charcoal: { name: 'Charcoal', hint: 'Grab leftover bits' },
      pour: { name: 'Pour through', hint: 'All three layers first' },
      collector: { name: 'Coconut lid', hint: 'Catch cooling steam' },
      heat: { name: 'Light a fire', hint: 'Turn water to steam' },
      taste: { name: 'Take a sip', hint: 'Your tongue is a meter' },
    },
    layers: {
      gravel: 'Gravel',
      sand: 'Sand',
      charcoal: 'Charcoal',
    },
    say: {
      settled: 'Grit sank. Leaves floated up.',
      scooped: 'Leaves scooped. The water is still a bit cloudy.',
      notSettled: 'The leaves are still mixed in. Settle first.',
      shaken: 'Glug-glug — back to muddy soup!',
      processed: 'This bucket is already filtered or distilled.',
      layerIn: (name) => `${name} is in the bottle.`,
      layerDup: 'That layer is already in the bottle.',
      pourNeed: 'The filter is missing layers. Need gravel, sand, and charcoal.',
      poured: 'It turned clear! Cloudiness dropped. Salt did not.',
      collectorOn: 'Coconut shell is on, ready for steam.',
      collectorOff: 'Coconut shell taken off.',
      steamLost: 'The steam escaped! No shell, no fresh water.',
      distilled: 'Steam beaded into water. The salt reading dropped!',
      muddy: 'Ptooey — a mouthful of grit! Not drinkable.',
      salty: 'Crystal clear… and salty! The salt was hiding in the water.',
      fresh: 'Sweet fresh water! The drinkable light is on.',
    },
  },
};

const CAMP_TOOLS = [
  ['settle', 'scoop', 'shake', 'taste'],
  ['gravel', 'sand', 'charcoal', 'pour', 'taste'],
  ['collector', 'heat', 'taste'],
];

const TOOL_META = {
  settle: { icon: '⏳', camp: 0 },
  scoop: { icon: '🍃', camp: 0 },
  shake: { icon: '🫨', camp: 0 },
  gravel: { icon: '🪨', camp: 1 },
  sand: { icon: '🏜️', camp: 1 },
  charcoal: { icon: '🪵', camp: 1 },
  pour: { icon: '🫗', camp: 1 },
  collector: { icon: '🥥', camp: 2 },
  heat: { icon: '🔥', camp: 2 },
  taste: { icon: '👅', camp: 'all' },
};

const els = {
  soundBtn: document.getElementById('soundBtn'),
  themeBtn: document.getElementById('themeBtn'),
  langBtn: document.getElementById('langBtn'),
  campNumber: document.getElementById('campNumber'),
  campKicker: document.getElementById('campKicker'),
  campTitle: document.getElementById('campTitle'),
  status: document.getElementById('status'),
  turbidityValue: document.getElementById('turbidityValue'),
  salinityValue: document.getElementById('salinityValue'),
  drinkLamp: document.getElementById('drinkLamp'),
  drinkText: document.getElementById('drinkText'),
  campNav: document.getElementById('campNav'),
  hintBtn: document.getElementById('hintBtn'),
  bucket: document.getElementById('bucket'),
  steam: document.getElementById('steam'),
  coconut: document.getElementById('coconut'),
  coconutLabel: document.getElementById('coconutLabel'),
  filter: document.getElementById('filter'),
  filterStack: document.getElementById('filterStack'),
  lessonText: document.getElementById('lessonText'),
  toolGrid: document.getElementById('toolGrid'),
  restartBtn: document.getElementById('restartBtn'),
  completeModal: document.getElementById('completeModal'),
  playAgainBtn: document.getElementById('playAgainBtn'),
};

let t = (key) => key;
let audioContext = null;
let muted = false;
let idleTimer = 0;
let steamTimer = 0;

const state = {
  camp: 0,
  unlocked: 0,
  completed: [],
  bucket: createBucket(),
  finished: false,
  showLesson: false,
};

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
    tone(210, 0.14, 'sawtooth', 0.03);
    tone(160, 0.16, 'triangle', 0.025, 0.05);
  } else if (kind === 'pour') {
    tone(380, 0.16, 'sine', 0.03);
    tone(260, 0.2, 'triangle', 0.025, 0.08);
  } else if (kind === 'steam') {
    tone(880, 0.18, 'triangle', 0.02);
    tone(720, 0.22, 'sine', 0.018, 0.08);
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
      camp: state.camp,
      unlocked: state.unlocked,
      completed: state.completed,
      bucket: state.bucket,
      finished: state.finished,
      showLesson: state.showLesson,
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
    if (Number.isInteger(data.camp)) state.camp = Math.max(0, Math.min(2, data.camp));
    if (Number.isInteger(data.unlocked)) state.unlocked = Math.max(0, Math.min(2, data.unlocked));
    if (Array.isArray(data.completed)) {
      state.completed = data.completed.filter((n) => n >= 0 && n <= 2);
    }
    if (data.bucket && typeof data.bucket === 'object') {
      state.bucket = { ...createBucket(), ...data.bucket, layers: Array.isArray(data.bucket.layers) ? data.bucket.layers : [] };
    }
    state.finished = Boolean(data.finished);
    state.showLesson = Boolean(data.showLesson);
  } catch {
    /* ignore */
  }
}

function setStatus(text) {
  els.status.textContent = text;
}

function campCopy() {
  return t('camps')[state.camp];
}

function applyBucket(next, okSound = 'good') {
  const error = next.error;
  delete next.error;
  delete next.sip;
  state.bucket = next;
  if (error) playSound('bad');
  else playSound(okSound);
  afterChange();
  return error;
}

function unlockIfNeeded() {
  for (let camp = 0; camp <= 2; camp += 1) {
    if (campComplete(state.bucket, camp) && !state.completed.includes(camp)) {
      state.completed.push(camp);
      if (camp < 2) state.unlocked = Math.max(state.unlocked, camp + 1);
      stage(camp === 0 ? 'settle' : camp === 1 ? 'filter' : 'distill');
    }
  }
}

function finishIfNeeded() {
  if (!state.bucket.tastedFresh || state.finished) return;
  state.finished = true;
  state.completed = [0, 1, 2];
  state.unlocked = 2;
  playSound('win');
  try {
    window.cool?.complete?.();
  } catch {
    /* ignore */
  }
  track('drinkable');
}

function afterChange() {
  unlockIfNeeded();
  finishIfNeeded();
  save();
  render();
  bumpIdle();
}

function bumpIdle() {
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => {
    if (!state.showLesson && !state.finished) {
      state.showLesson = true;
      setStatus(campCopy().hint);
      render();
    }
  }, 30000);
}

function drinkState() {
  if (isDrinkable(state.bucket)) return 'on';
  if (waterLook(state.bucket) === 'clear') return 'warn';
  return 'off';
}

function renderNav() {
  els.campNav.innerHTML = '';
  t('camps').forEach((camp, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = camp.kicker;
    btn.disabled = index > state.unlocked;
    if (index === state.camp) btn.setAttribute('aria-current', 'true');
    if (btn.disabled) btn.title = t('lockedCamp');
    btn.addEventListener('click', () => {
      if (index > state.unlocked) return;
      state.camp = index;
      playSound('tap');
      setStatus(campCopy().ready);
      save();
      render();
    });
    els.campNav.append(btn);
  });
  els.campNav.setAttribute('aria-label', t('campNav'));
}

function renderTools() {
  els.toolGrid.innerHTML = '';
  CAMP_TOOLS[state.camp].forEach((id) => {
    const meta = TOOL_META[id];
    const copy = t('tools')[id];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = id === 'taste' ? 'tool tool--taste' : 'tool';
    btn.dataset.tool = id;
    if (id === 'collector') btn.setAttribute('aria-pressed', String(state.bucket.collectorOn));
    if (id === 'gravel' || id === 'sand' || id === 'charcoal') {
      btn.setAttribute('aria-pressed', String(state.bucket.layers.includes(id)));
    }
    btn.innerHTML = `<span class="tool__icon" aria-hidden="true">${meta.icon}</span><span class="tool__copy"><strong>${copy.name}</strong><small>${copy.hint}</small></span>`;
    btn.addEventListener('click', () => useTool(id));
    els.toolGrid.append(btn);
  });
}

function renderFilter() {
  els.filterStack.innerHTML = '';
  state.bucket.layers.forEach((id) => {
    const row = document.createElement('div');
    row.className = 'filter-layer';
    row.dataset.id = id;
    row.textContent = t('layers')[id];
    els.filterStack.append(row);
  });
  els.filter.dataset.ready = String(canPour(state.bucket));
}

function render() {
  const copy = campCopy();
  const look = waterLook(state.bucket);
  const lamp = drinkState();
  els.campNumber.textContent = String(state.camp + 1).padStart(2, '0');
  els.campKicker.textContent = copy.kicker;
  els.campTitle.textContent = copy.title;
  els.turbidityValue.textContent = String(state.bucket.turbidity);
  els.salinityValue.textContent = String(state.bucket.salinity);
  els.drinkLamp.dataset.state = lamp;
  els.drinkText.textContent = lamp === 'on' ? t('drinkYes') : lamp === 'warn' ? t('drinkWarn') : t('drinkNo');
  els.bucket.dataset.look = look;
  els.bucket.dataset.leaves = String(state.bucket.leaves);
  els.coconut.hidden = !state.bucket.collectorOn;
  els.coconutLabel.textContent = t('coconut');
  els.steam.hidden = !state.bucket.heated || Boolean(steamTimer === 0 && !state.bucket.distilled && !state.bucket.collectorOn && !state.bucket.heated);
  if (!state.bucket.heated) els.steam.hidden = true;
  els.lessonText.hidden = !state.showLesson;
  els.lessonText.textContent = t('lesson');
  els.completeModal.hidden = !state.finished;
  renderNav();
  renderTools();
  renderFilter();
  syncSoundButton();
  if (els.themeBtn) els.themeBtn.setAttribute('aria-label', t('themeLabel'));
}

function useTool(id) {
  const say = t('say');
  track(id);
  if (id === 'settle') {
    applyBucket(settle(state.bucket));
    setStatus(say.settled);
    state.showLesson = true;
    return;
  }
  if (id === 'scoop') {
    const error = applyBucket(scoopLeaves(state.bucket), 'tap');
    setStatus(error === 'not-settled' ? say.notSettled : say.scooped);
    if (!error && campComplete(state.bucket, 0)) setStatus(campCopy().done);
    return;
  }
  if (id === 'shake') {
    const error = applyBucket(shake(state.bucket), 'bad');
    setStatus(error === 'already-processed' ? say.processed : say.shaken);
    return;
  }
  if (id === 'gravel' || id === 'sand' || id === 'charcoal') {
    const error = applyBucket(addLayer(state.bucket, id), 'tap');
    setStatus(error === 'dup-layer' ? say.layerDup : say.layerIn(t('layers')[id]));
    return;
  }
  if (id === 'pour') {
    const error = applyBucket(pourFilter(state.bucket), 'pour');
    setStatus(error === 'incomplete-filter' ? say.pourNeed : say.poured);
    return;
  }
  if (id === 'collector') {
    const nextOn = !state.bucket.collectorOn;
    applyBucket(setCollector(state.bucket, nextOn), 'tap');
    setStatus(nextOn ? say.collectorOn : say.collectorOff);
    return;
  }
  if (id === 'heat') {
    window.clearTimeout(steamTimer);
    els.steam.hidden = false;
    const next = heat(state.bucket);
    const error = next.error;
    steamTimer = window.setTimeout(() => {
      steamTimer = 0;
      applyBucket(next, error ? 'bad' : 'steam');
      setStatus(error === 'no-collector' ? say.steamLost : say.distilled);
    }, 280);
    playSound(error ? 'bad' : 'steam');
    return;
  }
  if (id === 'taste') {
    const next = taste(state.bucket);
    const sip = next.sip;
    applyBucket(next, sip === 'fresh' ? 'win' : 'bad');
    setStatus(say[sip]);
    if (sip === 'salty' && campComplete(state.bucket, 1) && state.camp < 2) {
      state.camp = 2;
      save();
      render();
    }
    if (sip === 'fresh') {
      els.playAgainBtn?.focus();
    }
  }
}

function restart() {
  state.camp = 0;
  state.unlocked = 0;
  state.completed = [];
  state.bucket = createBucket();
  state.finished = false;
  state.showLesson = false;
  playSound('tap');
  setStatus(campCopy().ready);
  save();
  render();
  bumpIdle();
}

els.soundBtn?.addEventListener('click', () => setMuted(!muted));
els.themeBtn?.addEventListener('click', () => window.cool.preferences.toggleTheme());
els.langBtn?.addEventListener('click', () => window.cool.preferences.toggleLang());
els.hintBtn?.addEventListener('click', () => {
  state.showLesson = true;
  playSound('tap');
  setStatus(campCopy().hint);
  save();
  render();
});
els.restartBtn?.addEventListener('click', restart);
els.playAgainBtn?.addEventListener('click', restart);

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
window.cool.bindI18n(I18N, {
  onChange({ t: translate, lang, theme }) {
    t = translate;
    document.title = t('doc');
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    if (els.langBtn) els.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    if (els.themeBtn) els.themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    if (!els.status.textContent) setStatus(campCopy().ready);
    render();
  },
});

if (!state.finished) setStatus(campCopy().ready);
render();
bumpIdle();
stage('play');
