import {
  ORGANS,
  answerJob,
  atlasComplete,
  campComplete,
  carePlotA,
  createGarden,
  floodSeed,
  guessCause,
  plant,
  revealOrgan,
  seedLook,
  setStressB,
  waitCompare,
  waitGerminate,
  waterSeed,
} from './plant-model.js';

const SOUND_KEY = 'kidslab.sound.muted';
const SAVE_KEY = 'kidslab.plant-xray';

const I18N = {
  zh: {
    doc: '植物透视园 · KidsLab',
    back: '返回平台',
    title: '植物透视园',
    soundOff: '关闭声音',
    soundOn: '打开声音',
    themeLabel: '切换主题',
    campLabel: '园地',
    dayLabel: '日子',
    waterLabel: '水分',
    bedLabel: 'X 光花床',
    bedTitle: '土里藏着什么',
    hint: '轻提示',
    toolsLabel: '园丁工具',
    toolsTitle: '动手照顾',
    restart: '再种一园',
    campNav: '透视园地',
    lockedCamp: '先完成前一园',
    waterDry: '干',
    waterOk: '刚好',
    waterFlood: '太湿',
    growSleep: '还在睡',
    growRoot: '根先钻',
    growUp: '芽出来了',
    growRot: '泡坏了',
    growDone: '图鉴齐了',
    plotA: 'A 对照',
    plotB: 'B 试验',
    plotSeed: '发芽床',
    plotAtlas: '结构床',
    finalKicker: '三园透视完成',
    finalTitle: '胚根先向下，整株植物站起来了！',
    finalText: '种子先往下扎根，再往上追光。缺水、不见光、泡太久，都会让对照田讲出不同的故事。',
    playAgain: '再种一园',
    lesson: '胚根先往下钻，嫩芽再往上顶。水和光都要刚刚好。',
    camps: [
      {
        kicker: '第一园 · 透视发芽',
        title: '把豆子埋下去，看谁先往下钻',
        ready: '点「下种」，再浇一小口水。',
        hint: '先埋进土里，浇一点，再过一天。根会先往下走。',
        done: '胚根先向下，嫩芽再向上！下一园去比对照田。',
      },
      {
        kicker: '第二园 · 对照田',
        title: '一边好好养，一边自己作妖',
        ready: '先照顾 A 床，再给 B 床选一种糟糕天气。',
        hint: 'A 要浇水晒太阳。B 只改一件事：不浇、关灯，或水淹。',
        done: '对照成功。缺水会蔫，不见光会黄瘦，水太多会沤坏。',
      },
      {
        kicker: '第三园 · 结构图鉴',
        title: '点亮根茎叶花果，再找谁喝水',
        ready: '点植物的五个部位，点亮图鉴。',
        hint: '五个都点亮后，再回答：谁从土里喝水？',
        done: '根从土里喝水。茎、叶、花、果各有各的活。',
      },
    ],
    tools: {
      plant: { name: '下种', hint: '把豆子埋进土' },
      water: { name: '浇一点', hint: '刚好湿润' },
      flood: { name: '猛浇', hint: '水淹试试看' },
      wait0: { name: '过一天', hint: '看土里变化' },
      careA: { name: '照顾 A', hint: '浇水加阳光' },
      dryB: { name: 'B 不浇', hint: '让它口渴' },
      darkB: { name: 'B 关灯', hint: '放进黑屋' },
      floodB: { name: 'B 水淹', hint: '泡在水里' },
      wait1: { name: '过几天', hint: '看两边差别' },
      guessDry: { name: '因为缺水', hint: 'B 渴坏了' },
      guessDark: { name: '因为没光', hint: 'B 在黑屋' },
      guessFlood: { name: '因为太湿', hint: 'B 被泡坏' },
      root: { name: '根', hint: '往下钻、喝水' },
      stem: { name: '茎', hint: '撑起来运水' },
      leaf: { name: '叶', hint: '接住阳光' },
      flower: { name: '花', hint: '变成果实' },
      fruit: { name: '果', hint: '里面有种子' },
    },
    organs: {
      root: '根',
      stem: '茎',
      leaf: '叶',
      flower: '花',
      fruit: '果',
    },
    say: {
      planted: '豆子埋进土里了。透视镜打开！',
      replanted: '坏豆子拿走，新豆子埋好了。',
      alreadyPlanted: '已经埋好了，浇一点水吧。',
      watered: '土润了。过一天，看谁先探头。',
      notPlanted: '豆子还在桌上。先下种。',
      flooded: '水漫过种子了……先过一天看看。',
      alreadyFlooded: '已经淹着了。',
      rottenNow: '咕嘟——种子泡坏了。再埋一颗吧。',
      thirsty: '土太干，种子还在睡觉。',
      radicle: '看！胚根执拗地往下钻。',
      shoot: '嫩芽顶出土了。根先走，芽后到。',
      alreadySprouted: '这颗已经发芽啦。',
      cared: 'A 床浇过水，也晒到太阳了。',
      stressDry: 'B 床决定不浇水。',
      stressDark: 'B 床关进黑屋了。',
      stressFlood: 'B 床泡在水里了。',
      alreadyCompared: '对照已经看过，别再改天气。',
      aNotCared: '先把 A 床照顾好，对照才公平。',
      bNoStress: 'B 床还没作妖。选一种糟糕天气。',
      comparedDry: '几天后：A 绿油油，B 蔫了。',
      comparedDark: '几天后：A 壮实，B 又黄又瘦。',
      comparedFlood: '几天后：A 挺拔，B 沤坏了。',
      noCompare: '还没过几天，看不出差别。',
      wrongCause: '不对。再看看 B 床变成什么样。',
      causeDry: '对！缺水让叶子发蔫。',
      causeDark: '对！不见光就长成豆芽菜。',
      causeFlood: '对！水太多，根会缺氧。',
      organIn: (name) => `${name}点亮了。`,
      organDup: '这一部分已经在图鉴里。',
      atlasNeed: '五个部位都点亮，再猜谁喝水。',
      wrongJob: '不是它。谁往下钻、从土里喝水？',
      jobRoot: '根从土里喝水！图鉴集齐了。',
    },
  },
  en: {
    doc: 'Plant X-Ray Garden · KidsLab',
    back: 'Back to platform',
    title: 'Plant X-Ray Garden',
    soundOff: 'Turn sound off',
    soundOn: 'Turn sound on',
    themeLabel: 'Switch theme',
    campLabel: 'Garden',
    dayLabel: 'Day',
    waterLabel: 'Water',
    bedLabel: 'X-ray bed',
    bedTitle: 'What’s under the soil',
    hint: 'Hint',
    toolsLabel: 'Garden kit',
    toolsTitle: 'Take care',
    restart: 'New garden',
    campNav: 'X-ray gardens',
    lockedCamp: 'Finish the previous garden first',
    waterDry: 'Dry',
    waterOk: 'Just right',
    waterFlood: 'Too wet',
    growSleep: 'Still asleep',
    growRoot: 'Root first',
    growUp: 'Sprout up',
    growRot: 'Soggy mess',
    growDone: 'Atlas full',
    plotA: 'Plot A',
    plotB: 'Plot B',
    plotSeed: 'Seed bed',
    plotAtlas: 'Atlas bed',
    finalKicker: 'All three gardens done',
    finalTitle: 'Radicle down, whole plant up!',
    finalText: 'Seeds root downward first, then chase the light. No water, no sun, or a flood — each plot tells a different story.',
    playAgain: 'Plant another garden',
    lesson: 'The radicle drills down first. The shoot comes up later. Water and light have to be just right.',
    camps: [
      {
        kicker: 'Garden 1 · X-ray sprout',
        title: 'Bury the bean. Who drills down first?',
        ready: 'Tap Plant, then give it a sip of water.',
        hint: 'Bury it, water a little, then wait a day. The root goes down first.',
        done: 'Radicle down, shoot up! Next: compare two plots.',
      },
      {
        kicker: 'Garden 2 · Compare',
        title: 'Care for one. Mischief the other.',
        ready: 'Care for plot A, then pick one bad weather for B.',
        hint: 'A needs water and sun. Change only one thing on B: dry, dark, or flood.',
        done: 'Nice contrast. Dry wilts, dark goes pale, flood rots.',
      },
      {
        kicker: 'Garden 3 · Atlas',
        title: 'Light up every part, then find who drinks',
        ready: 'Tap the five plant parts to fill the atlas.',
        hint: 'After all five light up, answer: who drinks from the soil?',
        done: 'Roots drink from the soil. Stem, leaf, flower, and fruit each have a job.',
      },
    ],
    tools: {
      plant: { name: 'Plant', hint: 'Bury the bean' },
      water: { name: 'Sip of water', hint: 'Just moist' },
      flood: { name: 'Flood', hint: 'Try too much' },
      wait0: { name: 'Wait a day', hint: 'Watch underground' },
      careA: { name: 'Care for A', hint: 'Water and sun' },
      dryB: { name: 'B stays dry', hint: 'No water' },
      darkB: { name: 'B in the dark', hint: 'No sunlight' },
      floodB: { name: 'B flooded', hint: 'Too much water' },
      wait1: { name: 'Wait days', hint: 'See the difference' },
      guessDry: { name: 'Because dry', hint: 'B got thirsty' },
      guessDark: { name: 'Because dark', hint: 'B had no sun' },
      guessFlood: { name: 'Because wet', hint: 'B sat in water' },
      root: { name: 'Root', hint: 'Drinks downward' },
      stem: { name: 'Stem', hint: 'Stands and carries' },
      leaf: { name: 'Leaf', hint: 'Catches sunlight' },
      flower: { name: 'Flower', hint: 'Becomes fruit' },
      fruit: { name: 'Fruit', hint: 'Holds seeds' },
    },
    organs: {
      root: 'Root',
      stem: 'Stem',
      leaf: 'Leaf',
      flower: 'Flower',
      fruit: 'Fruit',
    },
    say: {
      planted: 'The bean is underground. X-ray on!',
      replanted: 'Soggy bean out. Fresh bean buried.',
      alreadyPlanted: 'Already planted. Give it a sip.',
      watered: 'Soil is moist. Wait a day and watch.',
      notPlanted: 'The bean is still on the table. Plant first.',
      flooded: 'Water covered the seed… wait a day.',
      alreadyFlooded: 'It’s already flooded.',
      rottenNow: 'Blub — the seed rotted. Plant a new one.',
      thirsty: 'Too dry. The seed is still asleep.',
      radicle: 'Look! The radicle drills stubbornly down.',
      shoot: 'A sprout popped up. Root first, shoot second.',
      alreadySprouted: 'This one already sprouted.',
      cared: 'Plot A has water and sun.',
      stressDry: 'Plot B will get no water.',
      stressDark: 'Plot B is in a dark box.',
      stressFlood: 'Plot B is sitting in water.',
      alreadyCompared: 'The comparison already ran.',
      aNotCared: 'Care for plot A first, or it isn’t fair.',
      bNoStress: 'Plot B needs one bad weather first.',
      comparedDry: 'Days later: A is green. B wilted.',
      comparedDark: 'Days later: A is sturdy. B is pale and skinny.',
      comparedFlood: 'Days later: A stands tall. B rotted.',
      noCompare: 'No days have passed. No difference yet.',
      wrongCause: 'Not that. Look at what happened to B.',
      causeDry: 'Yes! No water made it wilt.',
      causeDark: 'Yes! No light made a bean-sprout kid.',
      causeFlood: 'Yes! Too much water starves the roots of air.',
      organIn: (name) => `${name} lit up.`,
      organDup: 'That part is already in the atlas.',
      atlasNeed: 'Light all five parts, then guess who drinks.',
      wrongJob: 'Not that one. Who drills down and drinks?',
      jobRoot: 'Roots drink from the soil! Atlas complete.',
    },
  },
};

const CAMP_TOOLS = [
  ['plant', 'water', 'flood', 'wait0'],
  ['careA', 'dryB', 'darkB', 'floodB', 'wait1', 'guessDry', 'guessDark', 'guessFlood'],
  ['root', 'stem', 'leaf', 'flower', 'fruit'],
];

const TOOL_META = {
  plant: { icon: '🫘' },
  water: { icon: '💧' },
  flood: { icon: '🌊' },
  wait0: { icon: '🌅' },
  careA: { icon: '☀️' },
  dryB: { icon: '🏜️' },
  darkB: { icon: '🌑' },
  floodB: { icon: '🪣' },
  wait1: { icon: '📅' },
  guessDry: { icon: '🤔' },
  guessDark: { icon: '🤔' },
  guessFlood: { icon: '🤔' },
  root: { icon: '🪵' },
  stem: { icon: '🌿' },
  leaf: { icon: '🍃' },
  flower: { icon: '🌸' },
  fruit: { icon: '🍓' },
};

const els = {
  soundBtn: document.getElementById('soundBtn'),
  themeBtn: document.getElementById('themeBtn'),
  langBtn: document.getElementById('langBtn'),
  campNumber: document.getElementById('campNumber'),
  campKicker: document.getElementById('campKicker'),
  campTitle: document.getElementById('campTitle'),
  status: document.getElementById('status'),
  dayValue: document.getElementById('dayValue'),
  waterValue: document.getElementById('waterValue'),
  growLamp: document.getElementById('growLamp'),
  growText: document.getElementById('growText'),
  campNav: document.getElementById('campNav'),
  hintBtn: document.getElementById('hintBtn'),
  stage: document.getElementById('stage'),
  plotA: document.getElementById('plotA'),
  plotB: document.getElementById('plotB'),
  plotATag: document.getElementById('plotATag'),
  plotBTag: document.getElementById('plotBTag'),
  atlas: document.getElementById('atlas'),
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

const state = {
  camp: 0,
  unlocked: 0,
  completed: [],
  day: 0,
  garden: createGarden(),
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
  } else if (kind === 'grow') {
    tone(392, 0.12, 'sine', 0.03);
    tone(523, 0.16, 'triangle', 0.028, 0.08);
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

function stageMark(name) {
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
      day: state.day,
      garden: state.garden,
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
    if (Number.isInteger(data.day)) state.day = Math.max(0, data.day);
    if (Array.isArray(data.completed)) {
      state.completed = data.completed.filter((n) => n >= 0 && n <= 2);
    }
    if (data.garden && typeof data.garden === 'object') {
      state.garden = {
        ...createGarden(),
        ...data.garden,
        plotA: { ...createGarden().plotA, ...(data.garden.plotA || {}) },
        plotB: { ...createGarden().plotB, ...(data.garden.plotB || {}) },
        organs: Array.isArray(data.garden.organs) ? data.garden.organs.filter((id) => ORGANS.includes(id)) : [],
      };
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

function applyGarden(next, okSound = 'good') {
  const error = next.error;
  delete next.error;
  state.garden = next;
  playSound(error ? 'bad' : okSound);
  afterChange();
  return error;
}

function unlockIfNeeded() {
  for (let camp = 0; camp <= 2; camp += 1) {
    if (campComplete(state.garden, camp) && !state.completed.includes(camp)) {
      state.completed.push(camp);
      if (camp < 2) state.unlocked = Math.max(state.unlocked, camp + 1);
      stageMark(camp === 0 ? 'germinate' : camp === 1 ? 'compare' : 'atlas');
    }
  }
}

function finishIfNeeded() {
  if (!campComplete(state.garden, 2) || state.finished) return;
  state.finished = true;
  state.completed = [0, 1, 2];
  state.unlocked = 2;
  playSound('win');
  try {
    window.cool?.complete?.();
  } catch {
    /* ignore */
  }
  track('atlas-complete');
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

function lampState() {
  if (state.garden.rotten) return 'off';
  if (campComplete(state.garden, 2)) return 'on';
  if (state.garden.shoot || state.garden.waitedCompare) return 'warn';
  if (state.garden.radicle) return 'warn';
  return 'off';
}

function lampText() {
  if (state.garden.rotten) return t('growRot');
  if (campComplete(state.garden, 2)) return t('growDone');
  if (state.garden.shoot) return t('growUp');
  if (state.garden.radicle) return t('growRoot');
  return t('growSleep');
}

function waterText() {
  if (state.camp === 0) {
    if (state.garden.moisture >= 2) return t('waterFlood');
    if (state.garden.moisture === 1) return t('waterOk');
    return t('waterDry');
  }
  if (state.garden.plotB.stress === 'flood') return t('waterFlood');
  if (state.garden.plotB.stress === 'dry') return t('waterDry');
  if (state.garden.plotA.cared) return t('waterOk');
  return t('waterDry');
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
    const copy = t('tools')[id];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tool';
    btn.dataset.tool = id;
    if (id === 'careA') btn.setAttribute('aria-pressed', String(state.garden.plotA.cared));
    if (id === 'dryB' || id === 'darkB' || id === 'floodB') {
      const stress = id === 'dryB' ? 'dry' : id === 'darkB' ? 'dark' : 'flood';
      btn.setAttribute('aria-pressed', String(state.garden.plotB.stress === stress));
    }
    if (ORGANS.includes(id)) {
      btn.setAttribute('aria-pressed', String(state.garden.organs.includes(id)));
    }
    btn.innerHTML = `<span class="tool__icon" aria-hidden="true">${TOOL_META[id].icon}</span><span class="tool__copy"><strong>${copy.name}</strong><small>${copy.hint}</small></span>`;
    btn.addEventListener('click', () => useTool(id));
    els.toolGrid.append(btn);
  });
}

function renderAtlas() {
  const show = state.camp === 2;
  els.atlas.hidden = !show;
  els.atlas.innerHTML = '';
  if (!show) return;
  ORGANS.forEach((id) => {
    const item = document.createElement('li');
    item.dataset.on = String(state.garden.organs.includes(id));
    item.textContent = t('organs')[id];
    els.atlas.append(item);
  });
}

function renderPlots() {
  const camp = state.camp;
  els.stage.dataset.camp = String(camp);
  els.plotB.hidden = camp !== 1;
  document.querySelectorAll('[data-organ]').forEach((node) => {
    node.hidden = camp !== 2;
    const organ = node.dataset.organ;
    node.setAttribute('aria-pressed', String(state.garden.organs.includes(organ)));
  });

  if (camp === 0) {
    els.plotA.dataset.look = seedLook(state.garden);
    els.plotATag.textContent = t('plotSeed');
  } else if (camp === 1) {
    els.plotA.dataset.look = state.garden.plotA.look;
    els.plotB.dataset.look = state.garden.plotB.look;
    els.plotATag.textContent = t('plotA');
    els.plotBTag.textContent = t('plotB');
  } else {
    els.plotA.dataset.look = 'atlas';
    els.plotATag.textContent = t('plotAtlas');
  }
}

function render() {
  const copy = campCopy();
  els.campNumber.textContent = String(state.camp + 1).padStart(2, '0');
  els.campKicker.textContent = copy.kicker;
  els.campTitle.textContent = copy.title;
  els.dayValue.textContent = String(state.day);
  els.waterValue.textContent = waterText();
  els.growLamp.dataset.state = lampState();
  els.growText.textContent = lampText();
  els.lessonText.hidden = !state.showLesson;
  els.lessonText.textContent = t('lesson');
  els.completeModal.hidden = !state.finished;
  renderNav();
  renderTools();
  renderPlots();
  renderAtlas();
  syncSoundButton();
  if (els.themeBtn) els.themeBtn.setAttribute('aria-label', t('themeLabel'));
}

function maybeAdvance(camp) {
  if (campComplete(state.garden, camp) && state.camp === camp && camp < 2) {
    state.camp = camp + 1;
    setStatus(t('camps')[camp].done);
    save();
    render();
  }
}

function useTool(id) {
  const say = t('say');
  track(id);

  if (id === 'plant') {
    const wasRotten = state.garden.rotten;
    const error = applyGarden(plant(state.garden), 'tap');
    setStatus(error === 'already-planted' ? say.alreadyPlanted : wasRotten ? say.replanted : say.planted);
    return;
  }
  if (id === 'water') {
    const error = applyGarden(waterSeed(state.garden), 'tap');
    setStatus(error === 'not-planted' ? say.notPlanted : error === 'already-flooded' ? say.alreadyFlooded : say.watered);
    return;
  }
  if (id === 'flood') {
    const error = applyGarden(floodSeed(state.garden), 'bad');
    setStatus(error === 'not-planted' ? say.notPlanted : say.flooded);
    return;
  }
  if (id === 'wait0') {
    const next = waitGerminate(state.garden);
    if (!next.error || next.error === 'rotted') state.day += 1;
    const error = applyGarden(next, next.radicle || next.shoot ? 'grow' : 'tap');
    if (error === 'not-planted') setStatus(say.notPlanted);
    else if (error === 'thirsty') setStatus(say.thirsty);
    else if (error === 'rotted' || error === 'rotten') setStatus(say.rottenNow);
    else if (error === 'already-sprouted') setStatus(say.alreadySprouted);
    else if (state.garden.shoot) {
      setStatus(say.shoot);
      maybeAdvance(0);
    } else setStatus(say.radicle);
    return;
  }
  if (id === 'careA') {
    applyGarden(carePlotA(state.garden), 'tap');
    setStatus(say.cared);
    return;
  }
  if (id === 'dryB' || id === 'darkB' || id === 'floodB') {
    const stress = id === 'dryB' ? 'dry' : id === 'darkB' ? 'dark' : 'flood';
    const error = applyGarden(setStressB(state.garden, stress), 'tap');
    setStatus(error === 'already-compared' ? say.alreadyCompared : say[`stress${stress[0].toUpperCase()}${stress.slice(1)}`]);
    return;
  }
  if (id === 'wait1') {
    const preview = waitCompare(state.garden);
    if (!preview.error) state.day += 3;
    const error = applyGarden(preview, 'grow');
    if (error === 'a-not-cared') setStatus(say.aNotCared);
    else if (error === 'b-no-stress') setStatus(say.bNoStress);
    else {
      const key = state.garden.plotB.stress === 'dry' ? 'comparedDry' : state.garden.plotB.stress === 'dark' ? 'comparedDark' : 'comparedFlood';
      setStatus(say[key]);
    }
    return;
  }
  if (id === 'guessDry' || id === 'guessDark' || id === 'guessFlood') {
    const cause = id === 'guessDry' ? 'dry' : id === 'guessDark' ? 'dark' : 'flood';
    const error = applyGarden(guessCause(state.garden, cause));
    if (error === 'no-compare') setStatus(say.noCompare);
    else if (error === 'wrong-cause') setStatus(say.wrongCause);
    else {
      setStatus(say[`cause${cause[0].toUpperCase()}${cause.slice(1)}`]);
      maybeAdvance(1);
    }
    return;
  }
  if (ORGANS.includes(id)) {
    tapOrgan(id);
  }
}

function tapOrgan(organ) {
  const say = t('say');
  if (atlasComplete(state.garden)) {
    const error = applyGarden(answerJob(state.garden, organ), organ === 'root' ? 'win' : 'bad');
    if (error === 'wrong-job') setStatus(say.wrongJob);
    else {
      setStatus(say.jobRoot);
      els.playAgainBtn?.focus();
    }
    return;
  }
  const error = applyGarden(revealOrgan(state.garden, organ), 'tap');
  if (error === 'dup-organ') setStatus(say.organDup);
  else {
    setStatus(say.organIn(t('organs')[organ]));
    if (atlasComplete(state.garden)) setStatus(campCopy().hint);
  }
}

function restart() {
  state.camp = 0;
  state.unlocked = 0;
  state.completed = [];
  state.day = 0;
  state.garden = createGarden();
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
document.querySelectorAll('[data-organ]').forEach((node) => {
  node.addEventListener('click', () => {
    if (state.camp !== 2) return;
    tapOrgan(node.dataset.organ);
  });
});

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
stageMark('play');
