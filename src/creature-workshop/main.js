import {
  HABITATS,
  SLOTS,
  choosePart,
  createWorkshop,
  habitatOf,
  isDesignComplete,
  release,
  resetWorkshop,
  restoreWorkshop,
  selectCamp,
} from './creature-model.js';

const SOUND_KEY = 'kidslab.sound.muted';
const SAVE_KEY = 'kidslab.creature-workshop';
const RUN_MS = 720;

const PART_META = {
  ears: {
    big: { icon: '👂' },
    small: { icon: '🔹' },
    hidden: { icon: '🫧' },
  },
  coat: {
    thin: { icon: '☀️' },
    thick: { icon: '🧥' },
    oily: { icon: '💧' },
  },
  feet: {
    pads: { icon: '🐾' },
    snow: { icon: '❄️' },
    web: { icon: '🦆' },
  },
  extra: {
    hump: { icon: '🐪' },
    blubber: { icon: '🧈' },
    tongue: { icon: '👅' },
  },
};

const I18N = {
  zh: {
    doc: '造兽工坊 · KidsLab',
    back: '返回平台',
    title: '造兽工坊',
    soundOff: '关闭声音',
    soundOn: '打开声音',
    themeLabel: '切换主题',
    campLabel: '委托',
    hourLabel: '小时',
    yardLabel: '放生场',
    yardTitle: '看看它怎么过活',
    hint: '轻提示',
    partsLabel: '零件库',
    partsTitle: '给它换装',
    restart: '重新开坊',
    release: '放生 48 小时',
    campNav: '栖息地',
    lockedCamp: '先让上一站活下来',
    liveIdle: '待放生',
    liveRun: '熬过去',
    liveWin: '活下来',
    liveFail: '没撑住',
    finalKicker: '三站放生完成',
    finalTitle: '没有最好的身体，只有最合适的身体！',
    finalText: '大耳朵在沙漠是空调，到了暴风雪里就成了漏风窗。同一零件，换个地方命运就反转。',
    playAgain: '再造一窝',
    lesson: '没有最好的身体，只有最合适的身体。',
    fameKicker: '生存名人堂',
    camps: [
      {
        kicker: '第一站 · 沙漠',
        title: '拼一只能在热沙子上活两天的动物',
        ready: '先给它选耳朵、皮毛、脚和一件装备。',
        hint: '热地方要想办法把热气送走，还得走得动沙子。',
        done: '它熬过了沙漠！同一身行头，去暴风雪里试试？',
      },
      {
        kicker: '第二站 · 暴风雪',
        title: '换一身能扛住寒风的装备',
        ready: '沙漠神器到这儿可能变成累赘。改零件再放生。',
        hint: '冷的地方要把热气留住，脚也别陷进雪里。',
        done: '暴风雪过关！湿地还在等它。',
      },
      {
        kicker: '第三站 · 湿地',
        title: '让它在水边也能吃饭走路',
        ready: '水多、虫子多。想想谁能划水、谁能够着吃的。',
        hint: '潜水少进水，脚要会划，舌头要够得着虫子。',
        done: '三站都活下来了！名人堂收下这只四不像。',
      },
    ],
    slots: {
      ears: '耳朵',
      coat: '皮毛',
      feet: '脚',
      extra: '装备',
    },
    parts: {
      ears: {
        big: { name: '大耳朵', hint: '热气容易溜走' },
        small: { name: '小耳朵', hint: '风不太吹走热气' },
        hidden: { name: '藏起来', hint: '潜水少进水' },
      },
      coat: {
        thin: { name: '薄皮毛', hint: '散热快' },
        thick: { name: '厚羽绒服', hint: '把热气锁住' },
        oily: { name: '防水油毛', hint: '水珠会滚走' },
      },
      feet: {
        pads: { name: '沙垫脚', hint: '走沙不陷' },
        snow: { name: '宽雪掌', hint: '踩雪像穿鞋' },
        web: { name: '蹼足', hint: '划水很方便' },
      },
      extra: {
        hump: { name: '小驼峰', hint: '备用粮在背上' },
        blubber: { name: '厚脂肪', hint: '像一件内胆' },
        tongue: { name: '长舌头', hint: '够得着水边虫子' },
      },
    },
    prototypes: {
      fennec: { name: '耳廓狐', text: '原来大耳朵是沙漠里的空调。' },
      arcticFox: { name: '北极狐', text: '小耳朵加厚毛，寒风就偷不走热气。' },
      platypus: { name: '鸭嘴兽', text: '蹼足和油毛，正是水边的活法。' },
    },
    say: {
      picked: (part) => `换上了${part}。`,
      incomplete: '四个部位都选好，才能放生。',
      running: '放生了！看它能不能熬过 48 小时。',
      survived: '它活下来了！旁边站着真实世界的亲戚。',
      perfect: '四件都对上了，名人堂闪了一下。',
      failEars: '耳朵先扛不住。热气要么跑太快，要么跑不掉。',
      failCoat: '这身皮毛跟天气对着干，它先不舒服了。',
      failFeet: '脚在这儿使不上劲：沙子里扑腾，或者雪里、水里打滑。',
      failExtra: '背上的装备帮不上忙，两天后它没劲了。',
      locked: '先让这一站活下来，再去下一站。',
    },
  },
  en: {
    doc: 'Creature Workshop · KidsLab',
    back: 'Back to platform',
    title: 'Creature Workshop',
    soundOff: 'Turn sound off',
    soundOn: 'Turn sound on',
    themeLabel: 'Switch theme',
    campLabel: 'Job',
    hourLabel: 'Hours',
    yardLabel: 'Release yard',
    yardTitle: 'Watch it live',
    hint: 'Hint',
    partsLabel: 'Parts bin',
    partsTitle: 'Dress it up',
    restart: 'New workshop',
    release: 'Release for 48 hours',
    campNav: 'Habitats',
    lockedCamp: 'Survive the last habitat first',
    liveIdle: 'Not out yet',
    liveRun: 'Hanging on',
    liveWin: 'It lived',
    liveFail: 'Didn’t last',
    finalKicker: 'All three habitats done',
    finalTitle: 'No best body. Only the right body!',
    finalText: 'Big ears are desert air-con. In a blizzard they leak heat. Same part, new place, new fate.',
    playAgain: 'Build another crew',
    lesson: 'There is no best body. Only the body that fits.',
    fameKicker: 'Hall of Survivors',
    camps: [
      {
        kicker: 'Stop 1 · Desert',
        title: 'Build a creature that can last two days on hot sand',
        ready: 'Pick ears, coat, feet, and one extra first.',
        hint: 'Hot places need a way to dump heat, and feet that can walk on sand.',
        done: 'It made it through the desert! Try the same look in a blizzard?',
      },
      {
        kicker: 'Stop 2 · Blizzard',
        title: 'Swap in gear that can hold onto warmth',
        ready: 'A desert gift may become trouble here. Change parts, then release.',
        hint: 'Cold places need to keep heat in. Feet should not sink in snow.',
        done: 'Blizzard cleared! The wetland is waiting.',
      },
      {
        kicker: 'Stop 3 · Wetland',
        title: 'Help it walk and eat by the water',
        ready: 'Lots of water. Lots of bugs. Who can paddle and reach lunch?',
        hint: 'Keep water out of the ears, paddle with the feet, reach bugs with a long tongue.',
        done: 'It lived all three stops! The hall keeps this mash-up.',
      },
    ],
    slots: {
      ears: 'Ears',
      coat: 'Coat',
      feet: 'Feet',
      extra: 'Extra',
    },
    parts: {
      ears: {
        big: { name: 'Big ears', hint: 'Heat slips away' },
        small: { name: 'Small ears', hint: 'Wind steals less heat' },
        hidden: { name: 'Tucked away', hint: 'Less water gets in' },
      },
      coat: {
        thin: { name: 'Thin coat', hint: 'Cools down fast' },
        thick: { name: 'Thick parka', hint: 'Locks warmth in' },
        oily: { name: 'Oily fur', hint: 'Water rolls off' },
      },
      feet: {
        pads: { name: 'Sand pads', hint: 'Won’t sink in dunes' },
        snow: { name: 'Snow paws', hint: 'Like snowshoes' },
        web: { name: 'Webbed feet', hint: 'Great for paddling' },
      },
      extra: {
        hump: { name: 'Little hump', hint: 'Snack pack on the back' },
        blubber: { name: 'Blubber', hint: 'A built-in vest' },
        tongue: { name: 'Long tongue', hint: 'Reaches shoreline bugs' },
      },
    },
    prototypes: {
      fennec: { name: 'Fennec fox', text: 'Those giant ears are desert air-con.' },
      arcticFox: { name: 'Arctic fox', text: 'Small ears and thick fur keep the heat.' },
      platypus: { name: 'Platypus', text: 'Webbed feet and oily fur belong by water.' },
    },
    say: {
      picked: (part) => `On goes the ${part}.`,
      incomplete: 'Pick all four parts before you release it.',
      running: 'It’s out! Can it last 48 hours?',
      survived: 'It lived! A real-world cousin just showed up.',
      perfect: 'All four parts fit. The hall sparkled.',
      failEars: 'The ears failed first. Heat left too fast, or not at all.',
      failCoat: 'This coat fights the weather. The creature feels it first.',
      failFeet: 'These feet don’t work here: flailing in sand, snow, or water.',
      failExtra: 'The extra gear didn’t help. After two days, it ran out of steam.',
      locked: 'Let it survive this stop before the next one.',
    },
  },
};

const els = {
  soundBtn: document.getElementById('soundBtn'),
  themeBtn: document.getElementById('themeBtn'),
  langBtn: document.getElementById('langBtn'),
  campNumber: document.getElementById('campNumber'),
  campKicker: document.getElementById('campKicker'),
  campTitle: document.getElementById('campTitle'),
  status: document.getElementById('status'),
  hourValue: document.getElementById('hourValue'),
  liveLamp: document.getElementById('liveLamp'),
  liveText: document.getElementById('liveText'),
  campNav: document.getElementById('campNav'),
  hintBtn: document.getElementById('hintBtn'),
  stage: document.getElementById('stage'),
  beast: document.getElementById('beast'),
  fameCard: document.getElementById('fameCard'),
  fameKicker: document.getElementById('fameKicker'),
  fameTitle: document.getElementById('fameTitle'),
  fameText: document.getElementById('fameText'),
  lessonText: document.getElementById('lessonText'),
  slotNav: document.getElementById('slotNav'),
  partGrid: document.getElementById('partGrid'),
  restartBtn: document.getElementById('restartBtn'),
  releaseBtn: document.getElementById('releaseBtn'),
  completeModal: document.getElementById('completeModal'),
  playAgainBtn: document.getElementById('playAgainBtn'),
};

let t = (key) => key;
let audioContext = null;
let muted = false;
let idleTimer = 0;
let runTimer = 0;
let hourTimer = 0;

const state = {
  shop: createWorkshop(),
  slot: 'ears',
  hour: 0,
  running: false,
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
  } else if (kind === 'run') {
    tone(392, 0.1, 'sine', 0.03);
    tone(494, 0.12, 'triangle', 0.026, 0.08);
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
      ...state.shop,
      slot: state.slot,
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
    state.shop = restoreWorkshop(data);
    if (SLOTS.includes(data.slot)) state.slot = data.slot;
    state.showLesson = Boolean(data.showLesson);
  } catch {
    /* ignore */
  }
}

function campCopy() {
  return t('camps')[state.shop.camp];
}

function setStatus(text) {
  els.status.textContent = text;
}

function bumpIdle() {
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => {
    if (!state.showLesson && !state.shop.finished && !state.running) {
      state.showLesson = true;
      setStatus(campCopy().hint);
      render();
    }
  }, 30000);
}

function runState() {
  if (state.running) return 'run';
  const result = state.shop.lastRun;
  if (!result || result.error) return 'idle';
  return result.survived ? 'win' : 'fail';
}

function lampText() {
  const kind = runState();
  if (kind === 'run') return t('liveRun');
  if (kind === 'win') return t('liveWin');
  if (kind === 'fail') return t('liveFail');
  return t('liveIdle');
}

function failSay(result) {
  const say = t('say');
  if (result.failSlot === 'ears') return say.failEars;
  if (result.failSlot === 'coat') return say.failCoat;
  if (result.failSlot === 'feet') return say.failFeet;
  return say.failExtra;
}

function renderNav() {
  els.campNav.innerHTML = '';
  t('camps').forEach((camp, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.camp = String(index);
    btn.textContent = camp.kicker;
    btn.disabled = index > state.shop.unlocked;
    if (index === state.shop.camp) btn.setAttribute('aria-current', 'true');
    if (btn.disabled) btn.title = t('lockedCamp');
    btn.addEventListener('click', () => goCamp(index));
    els.campNav.append(btn);
  });
  els.campNav.setAttribute('aria-label', t('campNav'));
}

function renderSlots() {
  els.slotNav.innerHTML = '';
  SLOTS.forEach((slot) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'slot';
    btn.dataset.slot = slot;
    btn.textContent = t('slots')[slot];
    if (slot === state.slot) btn.setAttribute('aria-current', 'true');
    if (state.shop.design[slot]) btn.dataset.filled = 'true';
    btn.addEventListener('click', () => {
      state.slot = slot;
      playSound('tap');
      render();
    });
    els.slotNav.append(btn);
  });
}

function renderParts() {
  els.partGrid.innerHTML = '';
  Object.keys(PART_META[state.slot]).forEach((part) => {
    const copy = t('parts')[state.slot][part];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'part';
    btn.dataset.part = part;
    btn.setAttribute('aria-pressed', String(state.shop.design[state.slot] === part));
    btn.innerHTML = `<span class="part__icon" aria-hidden="true">${PART_META[state.slot][part].icon}</span><span class="part__copy"><strong>${copy.name}</strong><small>${copy.hint}</small></span>`;
    btn.addEventListener('click', () => pickPart(part));
    els.partGrid.append(btn);
  });
}

function renderBeast() {
  const design = state.shop.design;
  els.beast.dataset.ears = design.ears || '';
  els.beast.dataset.coat = design.coat || '';
  els.beast.dataset.feet = design.feet || '';
  els.beast.dataset.extra = design.extra || '';
}

function renderFame() {
  const result = state.shop.lastRun;
  const show = Boolean(result?.survived && result.prototype && !state.running);
  els.fameCard.hidden = !show;
  if (!show) return;
  const proto = t('prototypes')[result.prototype];
  els.fameKicker.textContent = t('fameKicker');
  els.fameTitle.textContent = proto.name;
  els.fameText.textContent = proto.text;
}

function render() {
  const copy = campCopy();
  const habitat = habitatOf(state.shop.camp);
  els.campNumber.textContent = String(state.shop.camp + 1).padStart(2, '0');
  els.campKicker.textContent = copy.kicker;
  els.campTitle.textContent = copy.title;
  els.hourValue.textContent = String(state.hour);
  els.liveLamp.dataset.state = runState();
  els.liveText.textContent = lampText();
  els.stage.dataset.habitat = habitat;
  els.stage.dataset.run = runState();
  els.lessonText.hidden = !state.showLesson;
  els.lessonText.textContent = t('lesson');
  els.completeModal.hidden = !state.shop.finished;
  els.releaseBtn.disabled = state.running;
  renderNav();
  renderSlots();
  renderParts();
  renderBeast();
  renderFame();
  syncSoundButton();
  if (els.themeBtn) els.themeBtn.setAttribute('aria-label', t('themeLabel'));
}

function afterChange() {
  save();
  render();
  bumpIdle();
}

function pickPart(part) {
  if (state.running) return;
  const next = choosePart(state.shop, state.slot, part);
  state.shop = next;
  playSound('tap');
  track('fit-part');
  setStatus(t('say').picked(t('parts')[state.slot][part].name));
  afterChange();
}

function finishIfNeeded() {
  if (!state.shop.finished) return;
  playSound('win');
  try {
    window.cool?.complete?.();
  } catch {
    /* ignore */
  }
  track('hall-complete');
  els.playAgainBtn?.focus();
}

function settleRun() {
  state.running = false;
  state.hour = 48;
  const result = state.shop.lastRun;
  if (!result || result.error) {
    setStatus(t('say').incomplete);
    playSound('bad');
    afterChange();
    return;
  }
  if (result.survived) {
    playSound(result.perfect ? 'win' : 'good');
    stageMark(habitatOf(state.shop.camp));
    if (state.shop.finished) {
      setStatus(t('say').perfect);
      finishIfNeeded();
    } else {
      setStatus(`${result.perfect ? t('say').perfect : t('say').survived} ${campCopy().done}`);
    }
  } else {
    playSound('bad');
    setStatus(failSay(result));
  }
  afterChange();
}

function startRelease() {
  if (state.running) return;
  const next = release(state.shop);
  state.shop = next;
  if (next.lastRun?.error === 'incomplete') {
    playSound('bad');
    setStatus(t('say').incomplete);
    afterChange();
    return;
  }

  state.running = true;
  state.hour = 0;
  state.shop.lastRun = next.lastRun;
  playSound('run');
  track('release');
  setStatus(t('say').running);
  render();

  window.clearInterval(hourTimer);
  window.clearTimeout(runTimer);
  hourTimer = window.setInterval(() => {
    state.hour = Math.min(48, state.hour + 8);
    els.hourValue.textContent = String(state.hour);
    if (state.hour >= 48) window.clearInterval(hourTimer);
  }, 120);
  runTimer = window.setTimeout(settleRun, RUN_MS);
}

function goCamp(index) {
  if (state.running) return;
  const next = selectCamp(state.shop, index);
  if (next.error === 'locked') {
    playSound('bad');
    setStatus(t('say').locked);
    return;
  }
  state.shop = next;
  state.hour = 0;
  playSound('tap');
  setStatus(campCopy().ready);
  afterChange();
}

function restart() {
  window.clearInterval(hourTimer);
  window.clearTimeout(runTimer);
  state.shop = resetWorkshop();
  state.slot = 'ears';
  state.hour = 0;
  state.running = false;
  state.showLesson = false;
  playSound('tap');
  setStatus(campCopy().ready);
  afterChange();
}

els.soundBtn?.addEventListener('click', () => setMuted(!muted));
els.themeBtn?.addEventListener('click', () => window.cool.preferences.toggleTheme());
els.langBtn?.addEventListener('click', () => window.cool.preferences.toggleLang());
els.hintBtn?.addEventListener('click', () => {
  state.showLesson = true;
  playSound('tap');
  setStatus(campCopy().hint);
  render();
});
els.restartBtn?.addEventListener('click', restart);
els.releaseBtn?.addEventListener('click', startRelease);
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
    if (els.langBtn) els.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    if (els.themeBtn) els.themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    if (!els.status.textContent || els.status.textContent === '先给它选耳朵、皮毛、脚和一件装备。') {
      setStatus(campCopy().ready);
    }
    render();
    void theme;
  },
});
bumpIdle();
if (state.shop.finished) {
  try {
    window.cool?.complete?.();
  } catch {
    /* ignore */
  }
}
