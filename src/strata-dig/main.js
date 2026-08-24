import {
  BONE_IDS,
  FAULT_LEFT,
  FAULT_RIGHT,
  LAYERS,
  LAYER_IDS,
  bonesComplete,
  brush,
  campComplete,
  collect,
  confirmFault,
  createSite,
  currentDepth,
  hammer,
  pickOlder,
  placeBone,
  selectFault,
} from './dig-model.js';

const SOUND_KEY = 'kidslab.sound.muted';
const SAVE_KEY = 'kidslab.strata-dig';

const FIND_ICON = {
  surface: '🧸',
  pottery: '🏺',
  ice: '🦣',
  dino: '🦴',
};

const BONE_ICON = {
  skull: '💀',
  ribs: '🦴',
  hips: '🥩',
  legs: '🦵',
  tail: '🌀',
};

const ERA_STATE = {
  surface: 'now',
  pottery: 'ancient',
  ice: 'ice',
  dino: 'dino',
};

const I18N = {
  zh: {
    doc: '地层挖掘队 · KidsLab',
    back: '返回平台',
    title: '地层挖掘队',
    soundOff: '关闭声音',
    soundOn: '打开声音',
    themeLabel: '切换主题',
    campLabel: '营地',
    depth: '深度',
    finds: '出土',
    sceneLabel: '发掘现场',
    sceneTitle: '探方剖面',
    hint: '轻提示',
    toolsLabel: '工具箱',
    toolsTitle: '动手发掘',
    restart: '重新开坑',
    campNav: '挖掘营地',
    lockedCamp: '先完成前一营',
    west: '西坑',
    east: '东坑',
    lesson: '先沉下去的土层在下面。越深，通常越古老。',
    finalKicker: '三营发掘完成',
    finalTitle: '化石站起来跑了两步！',
    finalText: '越深越古老。同一层被断层错开后，对上颜色和化石，仍是同一个时代。',
    playAgain: '再挖一座坑',
    eras: {
      surface: '今天',
      pottery: '古代',
      ice: '冰期',
      dino: '恐龙',
    },
    ruler: ['今', '古', '冰', '龙'],
    layers: {
      surface: { name: '表土', hint: '现代垃圾' },
      pottery: { name: '陶土层', hint: '小心轻刷' },
      ice: { name: '冰碛层', hint: '先敲硬壳' },
      dino: { name: '砂岩层', hint: '最深最老' },
    },
    bands: {
      soil: '表土',
      pottery: '陶土',
      ash: '火山灰',
      tusk: '猛犸层',
      dino: '恐龙层',
    },
    bones: {
      skull: { name: '头骨', hint: '安到头顶' },
      ribs: { name: '肋骨', hint: '安到胸腔' },
      hips: { name: '髋骨', hint: '安到腰上' },
      legs: { name: '腿骨', hint: '安到脚下' },
      tail: { name: '尾椎', hint: '安到尾巴' },
    },
    older: {
      pottery: { name: '陶罐更老', hint: '它埋得浅' },
      dino: { name: '恐龙更老', hint: '它埋得深' },
    },
    camps: [
      {
        kicker: '第一营 · 下挖',
        title: '一层层往下刷，越深越古老',
        ready: '先用毛刷扫开表层土。',
        hint: '软土用刷，硬壳用锤。陶罐别直接砸。',
        done: '四件都出土了。越深越古老，去帐篷拼骨头。',
      },
      {
        kicker: '第二营 · 拼装',
        title: '把散架的骨头拼回一只恐龙',
        ready: '点一块骨头，再点它该去的位置。',
        hint: '头骨在上，尾巴在后。放错会弹回来。',
        done: '最后一块对上了！化石抖了抖，跑起来了。',
      },
      {
        kicker: '第三营 · 断层',
        title: '两口坑错位了，找出同一时代',
        ready: '先点西坑一层，再点东坑同一时代的那层。',
        hint: '颜色和化石对得上，就是同一层。对完再问谁更老。',
        done: '同一层对上了，更深的恐龙更古老。',
      },
    ],
    tools: {
      brush: { name: '毛刷', hint: '轻轻扫开浮土' },
      hammer: { name: '小锤', hint: '敲开硬壳' },
      collect: { name: '收进托盘', hint: '露出才能拿' },
    },
    say: {
      brushed: '土被刷开了，东西露出来了。',
      needHammer: '这层太硬，毛刷啃不动，先用小锤。',
      hammered: '硬壳裂开了！下面有东西。',
      cracked: '咔——陶罐裂了！下次先用毛刷。',
      alreadyOut: '这层已经清理过了。',
      buried: '还埋在土里，先刷开或敲开。',
      pickedSide: '一边选好了，再点另一边同一时代的层。',
      collected: (name) => `${name}收进托盘了。往下还有更老的层。`,
      allDug: '坑挖到底了。深度就是时光机。',
      wrongBone: '这块对不上这个位置，弹回来了。',
      boneIn: (name) => `${name}卡进骨架了。`,
      awake: '拼上最后一块，化石站起来跑了两步！',
      wrongPair: '这两层不是同一时代，再比比颜色。',
      pairOk: (name) => `${name}对上了，是同一层。`,
      needBoth: '左右各点一层再配对。',
      wrongOlder: '埋得浅的反而更年轻。再看看深度。',
      olderOk: '对！更深的恐龙层更古老。',
    },
  },
  en: {
    doc: 'Strata Dig Team · KidsLab',
    back: 'Back to platform',
    title: 'Strata Dig Team',
    soundOff: 'Turn sound off',
    soundOn: 'Turn sound on',
    themeLabel: 'Switch theme',
    campLabel: 'Camp',
    depth: 'Depth',
    finds: 'Finds',
    sceneLabel: 'Dig site',
    sceneTitle: 'Pit section',
    hint: 'Hint',
    toolsLabel: 'Toolkit',
    toolsTitle: 'Start digging',
    restart: 'New pit',
    campNav: 'Dig camps',
    lockedCamp: 'Finish the previous camp first',
    west: 'West pit',
    east: 'East pit',
    lesson: 'The first layers to settle sit below. Deeper usually means older.',
    finalKicker: 'All three camps done',
    finalTitle: 'The fossil stood up and ran!',
    finalText: 'Deeper is older. After a fault shifts a bed, matching color and fossils still marks the same time.',
    playAgain: 'Dig another pit',
    eras: {
      surface: 'Now',
      pottery: 'Ancient',
      ice: 'Ice age',
      dino: 'Dino',
    },
    ruler: ['Now', 'Old', 'Ice', 'Dino'],
    layers: {
      surface: { name: 'Topsoil', hint: 'Modern trash' },
      pottery: { name: 'Pottery bed', hint: 'Brush gently' },
      ice: { name: 'Till', hint: 'Crack the cap first' },
      dino: { name: 'Sandstone', hint: 'Deepest, oldest' },
    },
    bands: {
      soil: 'Soil',
      pottery: 'Pottery',
      ash: 'Ash',
      tusk: 'Mammoth',
      dino: 'Dinosaur',
    },
    bones: {
      skull: { name: 'Skull', hint: 'Fits the head' },
      ribs: { name: 'Ribs', hint: 'Fits the chest' },
      hips: { name: 'Hips', hint: 'Fits the waist' },
      legs: { name: 'Legs', hint: 'Fits the feet' },
      tail: { name: 'Tail', hint: 'Fits the back' },
    },
    older: {
      pottery: { name: 'Pottery is older', hint: 'It sits higher' },
      dino: { name: 'Dinosaur is older', hint: 'It sits deeper' },
    },
    camps: [
      {
        kicker: 'Camp 1 · Dig',
        title: 'Brush down layer by layer. Deeper is older',
        ready: 'Start by brushing the topsoil.',
        hint: 'Soft dirt takes a brush. Hard caps need a hammer. Don’t smash pottery.',
        done: 'All four finds are out. Deeper is older — go rebuild the bones.',
      },
      {
        kicker: 'Camp 2 · Assemble',
        title: 'Put the scattered bones back into a dinosaur',
        ready: 'Tap a bone, then tap the socket it belongs in.',
        hint: 'Skull on top, tail at the back. Wrong slots bounce back.',
        done: 'The last piece clicked. The fossil shook and started to run.',
      },
      {
        kicker: 'Camp 3 · Fault',
        title: 'Two pits shifted. Find the same-age beds',
        ready: 'Tap a west-pit bed, then the same-age east-pit bed.',
        hint: 'Matching color and fossils means the same layer. Then say who is older.',
        done: 'The beds match. The deeper dinosaur layer is older.',
      },
    ],
    tools: {
      brush: { name: 'Brush', hint: 'Sweep the loose dirt' },
      hammer: { name: 'Hammer', hint: 'Crack a hard cap' },
      collect: { name: 'Collect', hint: 'Only if it shows' },
    },
    say: {
      brushed: 'The dirt is gone. Something is showing.',
      needHammer: 'Too hard for a brush. Use the hammer first.',
      hammered: 'The hard cap split! Something is underneath.',
      cracked: 'Crack! The pot broke. Brush next time.',
      alreadyOut: 'This layer is already cleared.',
      buried: 'Still buried. Brush or hammer first.',
      pickedSide: 'One side is picked. Now tap the same-age bed on the other side.',
      collected: (name) => `${name} is on the tray. Older beds wait below.`,
      allDug: 'The pit is at the bottom. Depth is a time machine.',
      wrongBone: 'That piece does not fit here. It bounced back.',
      boneIn: (name) => `${name} locked into the skeleton.`,
      awake: 'Last piece in! The fossil stood up and ran.',
      wrongPair: 'Those beds are not the same age. Compare the colors.',
      pairOk: (name) => `${name} matches. Same layer.`,
      needBoth: 'Pick one bed on each side first.',
      wrongOlder: 'Shallower beds are younger. Check the depth.',
      olderOk: 'Yes! The deeper dinosaur bed is older.',
    },
  },
};

const DIG_TOOLS = ['brush', 'hammer', 'collect'];
const TOOL_ICON = { brush: '🧹', hammer: '🔨', collect: '🧺' };

const els = {
  soundBtn: document.getElementById('soundBtn'),
  themeBtn: document.getElementById('themeBtn'),
  langBtn: document.getElementById('langBtn'),
  campNumber: document.getElementById('campNumber'),
  campKicker: document.getElementById('campKicker'),
  campTitle: document.getElementById('campTitle'),
  status: document.getElementById('status'),
  depthValue: document.getElementById('depthValue'),
  findsValue: document.getElementById('findsValue'),
  eraLamp: document.getElementById('eraLamp'),
  eraText: document.getElementById('eraText'),
  campNav: document.getElementById('campNav'),
  hintBtn: document.getElementById('hintBtn'),
  stage: document.getElementById('stage'),
  digYard: document.getElementById('digYard'),
  assembleYard: document.getElementById('assembleYard'),
  faultYard: document.getElementById('faultYard'),
  ruler: document.getElementById('ruler'),
  pit: document.getElementById('pit'),
  dust: document.getElementById('dust'),
  silhouette: document.getElementById('silhouette'),
  dinoRun: document.getElementById('dinoRun'),
  westLabel: document.getElementById('westLabel'),
  eastLabel: document.getElementById('eastLabel'),
  westStack: document.getElementById('westStack'),
  eastStack: document.getElementById('eastStack'),
  lessonText: document.getElementById('lessonText'),
  toolGrid: document.getElementById('toolGrid'),
  tray: document.getElementById('tray'),
  restartBtn: document.getElementById('restartBtn'),
  completeModal: document.getElementById('completeModal'),
  playAgainBtn: document.getElementById('playAgainBtn'),
};

let t = (key) => key;
let audioContext = null;
let muted = false;
let idleTimer = 0;
let selectedBone = null;
let dragBone = null;

const state = {
  camp: 0,
  unlocked: 0,
  completed: [],
  site: createSite(),
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
  if (kind === 'tap') tone(480, 0.08, 'triangle', 0.03);
  else if (kind === 'brush') {
    tone(640, 0.1, 'sine', 0.025);
    tone(420, 0.12, 'triangle', 0.02, 0.05);
  } else if (kind === 'good') {
    tone(523, 0.1, 'sine', 0.045);
    tone(659, 0.12, 'sine', 0.04, 0.07);
  } else if (kind === 'bad') {
    tone(210, 0.14, 'sawtooth', 0.03);
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
  try { window.cool?.track?.(name); } catch { /* ignore */ }
}

function stageMark(name) {
  try { window.cool?.stage?.(name); } catch { /* ignore */ }
}

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      camp: state.camp,
      unlocked: state.unlocked,
      completed: state.completed,
      site: state.site,
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
    if (data.site && typeof data.site === 'object') {
      const fresh = createSite();
      state.site = {
        ...fresh,
        ...data.site,
        layers: Array.isArray(data.site.layers) ? data.site.layers.map((layer, i) => ({
          ...fresh.layers[i],
          ...layer,
        })) : fresh.layers,
        tray: Array.isArray(data.site.tray) ? data.site.tray : [],
        bones: data.site.bones && typeof data.site.bones === 'object' ? data.site.bones : {},
        fault: {
          ...fresh.fault,
          ...(data.site.fault || {}),
          matched: Array.isArray(data.site.fault?.matched) ? data.site.fault.matched : [],
        },
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

function applySite(next, okSound = 'good') {
  const error = next.error;
  delete next.error;
  state.site = next;
  playSound(error ? 'bad' : okSound);
  afterChange();
  return error;
}

function unlockIfNeeded() {
  for (let camp = 0; camp <= 2; camp += 1) {
    if (campComplete(state.site, camp) && !state.completed.includes(camp)) {
      state.completed.push(camp);
      if (camp < 2) state.unlocked = Math.max(state.unlocked, camp + 1);
      stageMark(camp === 0 ? 'dug' : camp === 1 ? 'assembled' : 'faulted');
    }
  }
}

function finishIfNeeded() {
  if (!campComplete(state.site, 2) || state.finished) return;
  state.finished = true;
  state.completed = [0, 1, 2];
  state.unlocked = 2;
  playSound('win');
  try { window.cool?.complete?.(); } catch { /* ignore */ }
  track('fossil-awake');
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

function puff() {
  els.dust.hidden = false;
  window.setTimeout(() => { els.dust.hidden = true; }, 420);
}

function goCamp(index) {
  if (index > state.unlocked) return;
  state.camp = index;
  selectedBone = null;
  playSound('tap');
  setStatus(campCopy().ready);
  save();
  render();
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
    btn.addEventListener('click', () => goCamp(index));
    els.campNav.append(btn);
  });
  els.campNav.setAttribute('aria-label', t('campNav'));
}

function renderPit() {
  els.ruler.innerHTML = '';
  t('ruler').forEach((label) => {
    const mark = document.createElement('span');
    mark.textContent = label;
    els.ruler.append(mark);
  });
  els.pit.innerHTML = '';
  state.site.layers.forEach((layer, index) => {
    const spec = LAYERS[index];
    const copy = t('layers')[layer.id];
    const row = document.createElement('div');
    row.className = 'stratum';
    row.dataset.id = layer.id;
    row.dataset.current = String(index === state.site.currentIndex && !layer.collected);
    row.dataset.collected = String(layer.collected);
    const find = layer.exposed && !layer.collected
      ? (layer.cracked ? '💔' : FIND_ICON[layer.id])
      : (layer.collected ? '✅' : (spec.hard ? '🪨' : '░'));
    row.innerHTML = `<span class="stratum__mark" aria-hidden="true">${index + 1}</span><span class="stratum__copy">${copy.name}<small>${copy.hint}</small></span><span class="stratum__find" aria-hidden="true">${find}</span>`;
    els.pit.append(row);
  });
}

function renderAssemble() {
  els.silhouette.dataset.awake = String(state.site.awoken);
  els.dinoRun.hidden = !state.site.awoken;
  els.assembleYard.querySelectorAll('.slot').forEach((slot) => {
    const id = slot.dataset.slot;
    const filled = Boolean(state.site.bones[id]);
    slot.dataset.filled = String(filled);
    slot.dataset.hot = String(selectedBone === id);
    slot.textContent = filled ? BONE_ICON[id] : '◌';
    slot.setAttribute('aria-label', t('bones')[id].name);
  });
}

function renderFault() {
  els.westLabel.textContent = t('west');
  els.eastLabel.textContent = t('east');
  const paint = (host, list, side) => {
    host.innerHTML = '';
    list.forEach((id) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'band';
      btn.dataset.side = side;
      btn.dataset.id = id;
      btn.textContent = t('bands')[id];
      btn.setAttribute('aria-pressed', String(state.site.fault[side] === id));
      btn.dataset.matched = String(state.site.fault.matched.includes(id) && (side === 'left' || FAULT_LEFT.includes(id)));
      if (side === 'right') {
        btn.dataset.matched = String(state.site.fault.matched.includes(id));
      }
      btn.addEventListener('click', () => onFault(side, id));
      host.append(btn);
    });
  };
  paint(els.westStack, FAULT_LEFT, 'left');
  paint(els.eastStack, FAULT_RIGHT, 'right');
}

function renderTools() {
  els.toolGrid.innerHTML = '';
  if (state.camp === 0) {
    DIG_TOOLS.forEach((id) => {
      const copy = t('tools')[id];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tool';
      btn.dataset.tool = id;
      btn.innerHTML = `<span class="tool__icon" aria-hidden="true">${TOOL_ICON[id]}</span><span class="tool__copy"><strong>${copy.name}</strong><small>${copy.hint}</small></span>`;
      btn.addEventListener('click', () => useTool(id));
      els.toolGrid.append(btn);
    });
    return;
  }
  if (state.camp === 1) {
    BONE_IDS.forEach((id) => {
      const copy = t('bones')[id];
      const placed = Boolean(state.site.bones[id]);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tool';
      btn.dataset.bone = id;
      btn.disabled = placed;
      btn.setAttribute('aria-pressed', String(selectedBone === id));
      btn.innerHTML = `<span class="tool__icon" aria-hidden="true">${BONE_ICON[id]}</span><span class="tool__copy"><strong>${copy.name}</strong><small>${copy.hint}</small></span>`;
      btn.addEventListener('click', () => selectBone(id));
      btn.addEventListener('pointerdown', (event) => startBoneDrag(event, id));
      els.toolGrid.append(btn);
    });
    return;
  }
  if (state.site.fault.matched.length < 3) {
    const note = document.createElement('p');
    note.className = 'lesson';
    note.style.display = 'block';
    note.textContent = campCopy().ready;
    els.toolGrid.append(note);
    return;
  }
  ['pottery', 'dino'].forEach((id) => {
    const copy = t('older')[id];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice';
    btn.dataset.older = id;
    btn.setAttribute('aria-pressed', String(state.site.olderPick === id));
    btn.innerHTML = `<span class="choice__icon" aria-hidden="true">${id === 'dino' ? '🦖' : '🏺'}</span><span class="choice__copy"><strong>${copy.name}</strong><small>${copy.hint}</small></span>`;
    btn.addEventListener('click', () => onOlder(id));
    els.toolGrid.append(btn);
  });
}

function renderTray() {
  els.tray.innerHTML = '';
  state.site.tray.forEach((id) => {
    const chip = document.createElement('span');
    chip.textContent = FIND_ICON[id];
    chip.title = t('layers')[id].name;
    els.tray.append(chip);
  });
}

function render() {
  const copy = campCopy();
  const eraId = LAYER_IDS[Math.min(state.site.currentIndex, LAYER_IDS.length - 1)];
  els.campNumber.textContent = String(state.camp + 1).padStart(2, '0');
  els.campKicker.textContent = copy.kicker;
  els.campTitle.textContent = copy.title;
  els.depthValue.textContent = String(currentDepth(state.site));
  els.findsValue.textContent = `${state.site.tray.length}/4`;
  els.eraLamp.dataset.state = ERA_STATE[eraId];
  els.eraText.textContent = t('eras')[eraId];
  els.stage.dataset.camp = String(state.camp);
  els.digYard.hidden = state.camp !== 0;
  els.assembleYard.hidden = state.camp !== 1;
  els.faultYard.hidden = state.camp !== 2;
  els.lessonText.hidden = !state.showLesson;
  els.lessonText.textContent = t('lesson');
  els.completeModal.hidden = !state.finished;
  renderNav();
  renderPit();
  renderAssemble();
  renderFault();
  renderTools();
  renderTray();
  syncSoundButton();
  if (els.themeBtn) els.themeBtn.setAttribute('aria-label', t('themeLabel'));
}

function useTool(id) {
  const say = t('say');
  track(id);
  if (id === 'brush') {
    puff();
    const error = applySite(brush(state.site), 'brush');
    if (error === 'need-hammer') setStatus(say.needHammer);
    else if (error) setStatus(say.alreadyOut);
    else setStatus(say.brushed);
    return;
  }
  if (id === 'hammer') {
    puff();
    const error = applySite(hammer(state.site));
    if (error === 'cracked') setStatus(say.cracked);
    else if (error) setStatus(say.alreadyOut);
    else setStatus(say.hammered);
    return;
  }
  if (id === 'collect') {
    const before = state.site.layers[state.site.currentIndex];
    const error = applySite(collect(state.site));
    if (error === 'still-buried') {
      setStatus(say.buried);
      return;
    }
    if (error) {
      setStatus(say.alreadyOut);
      return;
    }
    const name = t('layers')[before.id].name;
    if (campComplete(state.site, 0)) {
      setStatus(campCopy().done);
      state.camp = 1;
      save();
      render();
    } else {
      setStatus(say.collected(name));
    }
  }
}

function selectBone(id) {
  if (state.site.bones[id]) return;
  selectedBone = id;
  playSound('tap');
  track('pick-bone');
  render();
}

function tryPlace(slotId) {
  if (!selectedBone) return;
  const bone = selectedBone;
  const say = t('say');
  const error = applySite(placeBone(state.site, bone, slotId));
  selectedBone = error ? bone : null;
  if (error === 'wrong-slot') {
    setStatus(say.wrongBone);
    return;
  }
  if (state.site.awoken) {
    setStatus(say.awake);
    state.camp = 2;
    save();
    render();
    return;
  }
  setStatus(say.boneIn(t('bones')[bone].name));
}

function startBoneDrag(event, id) {
  if (state.site.bones[id] || event.button) return;
  selectedBone = id;
  dragBone = id;
  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function onFault(side, id) {
  track('match-layer');
  const say = t('say');
  let next = selectFault(state.site, side, id);
  if (next.fault.left && next.fault.right) {
    next = confirmFault(next);
    const error = applySite(next);
    if (error === 'wrong-pair') {
      setStatus(say.wrongPair);
      return;
    }
    setStatus(say.pairOk(t('bands')[id]));
    return;
  }
  applySite(next, 'tap');
  setStatus(say.pickedSide);
}

function onOlder(id) {
  const say = t('say');
  const error = applySite(pickOlder(state.site, id));
  if (error === 'wrong-older') {
    setStatus(say.wrongOlder);
    return;
  }
  setStatus(say.olderOk);
  if (state.finished) els.playAgainBtn?.focus();
}

function restart() {
  state.camp = 0;
  state.unlocked = 0;
  state.completed = [];
  state.site = createSite();
  state.finished = false;
  state.showLesson = false;
  selectedBone = null;
  playSound('tap');
  setStatus(campCopy().ready);
  save();
  render();
  bumpIdle();
}

els.assembleYard.addEventListener('click', (event) => {
  const slot = event.target.closest('[data-slot]');
  if (!slot) return;
  tryPlace(slot.dataset.slot);
});

els.assembleYard.addEventListener('pointerup', (event) => {
  if (!dragBone) return;
  const slot = document.elementFromPoint(event.clientX, event.clientY)?.closest?.('[data-slot]');
  const bone = dragBone;
  dragBone = null;
  if (!slot) return;
  selectedBone = bone;
  tryPlace(slot.dataset.slot);
});

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
stageMark('play');
