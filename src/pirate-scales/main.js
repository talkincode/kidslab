(() => {
  'use strict';

  const SAVE_KEY = 'kidslab.pirate-scales';
  const SOUND_KEY = 'kidslab.sound.muted';
  const DEBUG_KEY = 'kidslab.pirate-scales.debug';

  const I18N = {
    zh: {
      doc: '海盗验金室 · KidsLab',
      back: '返回平台',
      title: '海盗验金室',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      suspects: '嫌疑',
      weighings: '称量',
      fee: '佣金',
      leftPan: '左盘',
      rightPan: '右盘',
      toLeft: '放左盘',
      toRight: '放右盘',
      hint: '轻提示',
      clearPans: '清空托盘',
      weigh: '称量一次',
      accuseMode: '指认假币',
      accuseOn: '点一枚币指认',
      resetJob: '重开本关',
      next: '下一票货',
      finalKicker: '海盗名人堂 · 验金大师',
      finalTitle: '天平会说三种话！',
      finalText: '每次称量都能把嫌疑砍成三份。最好的问题，一次排除三分之二。',
      playAgain: '再当一回验金官',
      missionsLabel: '验金任务',
      trayLabel: '金币箱',
      trayTitle: '金币箱',
      trayHint: '先点“放左盘/放右盘”，再点金币放上去。',
      trayHintAccuse: '指认模式：直接点你认定的假币。',
      deskTitlePlay: '放币 · 称量 · 指认',
      deskTitleDone: '本票货已结案',
      feeCoins: (n) => `🪙 ${n}`,
      suspectCount: (n) => `${n}`,
      coinAria: (n, state) => {
        if (state === 'genuine') return `第 ${n} 号金币，已确认是真币`;
        if (state === 'selected') return `第 ${n} 号金币，已选中`;
        return `第 ${n} 号金币，仍是嫌疑`;
      },
      m1Kicker: '新手船舱 · 9 枚金币',
      m1Title: '找出那枚轻一点的假币',
      m1Text: '把金币放到左右托盘，按下称量。天平会说：左沉、右沉，还是平衡。',
      m1Rule: '假币比真币轻一点点。天平有三种话：左沉、右沉、平衡。',
      m1Lesson: '最好的称法：左右放一样多，剩下的先看着。一次就能砍掉三分之二嫌疑！',
      m1Ready: '点一枚金币，再点左盘或右盘。试试左右各放 3 枚。',
      m1Hint: '先别 4 对 4。试 1·2·3 对 4·5·6，剩下 7·8·9 先旁观——天平三种结果，正好对应三组。',
      m2Kicker: '赏金合约 · 两次内破案',
      m2Title: '9 枚币，最多称 2 次',
      m2Text: '佣金很贵。用三分法，两次就够抓住假币。',
      m2Rule: '假币更轻。称量上限 2 次；超次未指认就亏本。',
      m2Lesson: '3³？不对——每次 3 种结果，2 次最多分出 9 种可能，刚好够 9 枚币。',
      m2Ready: '目标：两次称量内指认假币。先把嫌疑均分成三组。',
      m2Hint: '第一称左右各 3 枚。看结果只留一组 3 枚嫌疑；第二称在这 3 枚里再 1 对 1。',
      m3Kicker: '宝库夜班 · 27 枚金币',
      m3Title: '27 枚币，三次传奇',
      m3Text: '箱子更大了。仍然假币更轻——三次称量的战绩会刻上名人堂。',
      m3Rule: '假币更轻。称量上限 3 次。每次尽量把嫌疑分成三等份。',
      m3Lesson: '3×3×3 = 27。三次三分，就能在 27 枚里锁定那一枚。',
      m3Ready: '27 枚金币登场。第一次左右各放 9 枚试试。',
      m3Hint: '每次把当前嫌疑大致分成三组：左盘、右盘、不称。平衡就查未称的那组。',
      m4Kicker: '风暴谜题 · 不知轻重',
      m4Title: '12 枚币，假币或轻或重',
      m4Text: '这一票更刁：假币可能更轻，也可能更重。三次内找出它，并判断轻重。',
      m4Rule: '只有一枚假币，可能轻也可能重。称量上限 3 次。',
      m4Lesson: '12 枚 × 2 种 = 24 种可能；3 次称量有 27 种结果，刚好罩得住。',
      m4Ready: '先按 4 对 4 称一次。记住：沉下去的那边，也可能是真币被假的“轻”托起来了。',
      m4Hint: '第一次左右各 4 枚。平衡则假币在未称的 4 枚；不平衡则假币在已称的 8 枚，并记下哪边沉。',
      selected: (n) => `已选中第 ${n} 号。点左盘或右盘放上去，或再点取消。`,
      placed: (n, side) => `第 ${n} 号放进了${side === 'left' ? '左' : '右'}盘。`,
      removed: (n) => `第 ${n} 号拿回箱子。`,
      cleared: '托盘清空了，金币都回箱子。',
      needBoth: '左右托盘都要放币，而且两边枚数要一样。',
      needEqual: (a, b) => `左盘 ${a} 枚、右盘 ${b} 枚，枚数不同没法公平称。`,
      emptyPan: '托盘是空的。先放上金币。',
      weighing: '天平晃起来了…',
      resultLeft: '左盘沉下去了——左边更重（右边更轻）。',
      resultRight: '右盘沉下去了——右边更重（左边更轻）。',
      resultBalance: '两边一样重！假币不在这次上称的币里。',
      markedLight: (kept, gone) => `嫌疑还剩 ${kept} 枚，排除了 ${gone} 枚真币。`,
      markedUnknown: (n) => `仍有 ${n} 种“谁×轻重”可能。继续缩小！`,
      overWeigh: '称量次数用完了。先指认，或重开本关。',
      wrongAccuse: (n) => `第 ${n} 号是真的！假币还在偷笑。再观察观察。`,
      correctAccuse: (n, w, kind) => {
        const k = kind === 'heavy' ? '偏重' : '偏轻';
        return `抓到了！第 ${n} 号是${k}假币。用了 ${w} 次称量。`;
      },
      failLimit: '次数用尽还没抓到。重开，试试三分法！',
      accuseHelp: '指认模式已打开：点你认定的那一枚。',
      accuseCancel: '已退出指认模式。',
      onlySuspects: '已确认的真币不用再称。点高亮的嫌疑币。',
      magicMoment: '看！一次称量说了三种话里的一句，嫌疑直接少了一大截。',
      lockedMission: '先完成前面的货单',
      wonNext: '结案！点“下一票货”继续。',
      allDone: '四票货全部结清。你已听懂天平的三种话！',
    },
    en: {
      doc: 'Pirate Weighing Room · KidsLab',
      back: 'Back to platform',
      title: 'Pirate Weighing Room',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      suspects: 'Suspects',
      weighings: 'Weighings',
      fee: 'Fee',
      leftPan: 'Left',
      rightPan: 'Right',
      toLeft: 'To left',
      toRight: 'To right',
      hint: 'Small hint',
      clearPans: 'Clear pans',
      weigh: 'Weigh once',
      accuseMode: 'Accuse a coin',
      accuseOn: 'Tap the fake',
      resetJob: 'Restart job',
      next: 'Next shipment',
      finalKicker: 'PIRATE HALL OF FAME',
      finalTitle: 'The Scale Speaks Three Ways!',
      finalText: 'Every weighing splits suspects into three piles. The best question removes two-thirds at once.',
      playAgain: 'Take another shift',
      missionsLabel: 'Weighing jobs',
      trayLabel: 'Coin chest',
      trayTitle: 'Coin chest',
      trayHint: 'Pick “To left/right”, then tap coins to load the pan.',
      trayHintAccuse: 'Accuse mode: tap the coin you think is fake.',
      deskTitlePlay: 'Place · Weigh · Accuse',
      deskTitleDone: 'Shipment closed',
      feeCoins: (n) => `🪙 ${n}`,
      suspectCount: (n) => `${n}`,
      coinAria: (n, state) => {
        if (state === 'genuine') return `Coin ${n}, confirmed genuine`;
        if (state === 'selected') return `Coin ${n}, selected`;
        return `Coin ${n}, still a suspect`;
      },
      m1Kicker: 'ROOKIE HOLD · 9 COINS',
      m1Title: 'Find the Lighter Fake',
      m1Text: 'Load both pans and weigh. The scale answers: left down, right down, or balance.',
      m1Rule: 'The fake is a bit lighter. A balance scale has three answers.',
      m1Lesson: 'Best move: put equal counts on both sides and leave some out. One weighing cuts suspects by about two-thirds!',
      m1Ready: 'Tap a coin, then a pan. Try 3 vs 3 first.',
      m1Hint: 'Skip 4 vs 4. Try 1·2·3 vs 4·5·6 and leave 7·8·9 out — three outcomes, three groups.',
      m2Kicker: 'BOUNTY CONTRACT · TWO WEIGHS',
      m2Title: '9 Coins, At Most 2 Weighings',
      m2Text: 'Fees are steep. With ternary splits, two weighings are enough.',
      m2Rule: 'Fake is lighter. Limit: 2 weighings.',
      m2Lesson: 'Each weighing has 3 results, so 2 weighings separate up to 9 cases — perfect for 9 coins.',
      m2Ready: 'Goal: accuse within two weighings. Split suspects into three groups.',
      m2Hint: 'First: 3 vs 3. Keep only one group of 3. Second: weigh 1 vs 1 inside that group.',
      m3Kicker: 'VAULT NIGHT · 27 COINS',
      m3Title: '27 Coins, Three-Weigh Legend',
      m3Text: 'Bigger chest, still a lighter fake — three perfect weighings earn hall-of-fame bragging rights.',
      m3Rule: 'Fake is lighter. Limit: 3 weighings. Trisect suspects each time.',
      m3Lesson: '3×3×3 = 27. Three ternary cuts pin one coin among twenty-seven.',
      m3Ready: '27 coins aboard. Start with 9 vs 9.',
      m3Hint: 'Each time split current suspects into left, right, and off-scale. Balance means the fake is off-scale.',
      m4Kicker: 'STORM RIDDLE · UNKNOWN BIAS',
      m4Title: '12 Coins, Fake May Be Light or Heavy',
      m4Text: 'Hard mode: the fake might be lighter or heavier. Find it and its bias in three weighs.',
      m4Rule: 'One fake coin, light or heavy. Limit: 3 weighings.',
      m4Lesson: '12 coins × 2 biases = 24 cases; 3 weighings give 27 outcomes — just enough.',
      m4Ready: 'Try 4 vs 4 first. A side can sink because it is heavy — or because the other side is light.',
      m4Hint: 'First: 4 vs 4. Balance → fake in the 4 left out. Tilt → fake among the 8 weighed; remember which side sank.',
      selected: (n) => `Coin ${n} selected. Tap a pan, or tap again to cancel.`,
      placed: (n, side) => `Coin ${n} placed on the ${side} pan.`,
      removed: (n) => `Coin ${n} returned to the chest.`,
      cleared: 'Pans cleared. Coins back in the chest.',
      needBoth: 'Both pans need coins, and both sides need the same count.',
      needEqual: (a, b) => `Left has ${a}, right has ${b}. Unequal counts are not a fair weigh.`,
      emptyPan: 'Pans are empty. Load some coins first.',
      weighing: 'The beam is swaying…',
      resultLeft: 'Left pan sank — left is heavier (right is lighter).',
      resultRight: 'Right pan sank — right is heavier (left is lighter).',
      resultBalance: 'Balance! The fake was not on the scale this time.',
      markedLight: (kept, gone) => `${kept} suspects remain; ${gone} coins cleared as genuine.`,
      markedUnknown: (n) => `${n} “who × bias” possibilities remain. Keep cutting!`,
      overWeigh: 'No weighings left. Accuse now, or restart the job.',
      wrongAccuse: (n) => `Coin ${n} is genuine! The fake is still grinning. Look again.`,
      correctAccuse: (n, w, kind) => {
        const k = kind === 'heavy' ? 'heavy' : 'light';
        return `Caught it! Coin ${n} is the ${k} fake after ${w} weighing(s).`;
      },
      failLimit: 'Out of weighings. Restart and try a ternary split!',
      accuseHelp: 'Accuse mode on: tap the coin you blame.',
      accuseCancel: 'Accuse mode off.',
      onlySuspects: 'Genuine coins stay off the scale. Tap highlighted suspects.',
      magicMoment: 'See that? One answer from three possible — and a big chunk of suspects vanished.',
      lockedMission: 'Finish the earlier jobs first',
      wonNext: 'Case closed! Tap “Next shipment”.',
      allDone: 'All four shipments cleared. You hear the scale’s three voices!',
    },
  };

  const MISSIONS = [
    { id: 'nine-free', coins: 9, maxWeigh: 6, unknownBias: false, strict: false, icon: '⅓' },
    { id: 'nine-two', coins: 9, maxWeigh: 2, unknownBias: false, strict: true, icon: '2×' },
    { id: 'twentyseven', coins: 27, maxWeigh: 3, unknownBias: false, strict: true, icon: '27' },
    { id: 'twelve-hard', coins: 12, maxWeigh: 3, unknownBias: true, strict: true, icon: '±' },
  ];

  class SoundEngine {
    constructor() {
      try { this.muted = ['true', '1'].includes(localStorage.getItem(SOUND_KEY)); }
      catch { this.muted = false; }
      this.context = null;
      this.sources = new Set();
    }

    ensure() {
      if (this.muted) return null;
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      try {
        this.context ||= new C();
        if (this.context.state === 'suspended') this.context.resume().catch(() => {});
        return this.context;
      } catch { return null; }
    }

    tone(freq, dur, vol, type = 'sine', delay = 0) {
      const ctx = this.ensure();
      if (!ctx) return;
      const start = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(vol, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain).connect(ctx.destination);
      this.sources.add(osc);
      osc.addEventListener('ended', () => this.sources.delete(osc), { once: true });
      osc.start(start);
      osc.stop(start + dur + 0.02);
    }

    pick() { this.tone(460, 0.06, 0.018, 'triangle'); }
    place() { this.tone(520, 0.08, 0.02, 'sine'); this.tone(640, 0.07, 0.012, 'triangle', 0.03); }
    weigh() { this.tone(180, 0.12, 0.02, 'sine'); this.tone(240, 0.14, 0.016, 'triangle', 0.05); }
    balance() { this.tone(392, 0.12, 0.02, 'sine'); this.tone(494, 0.12, 0.016, 'sine', 0.08); }
    tilt() { this.tone(300, 0.1, 0.02, 'triangle'); this.tone(220, 0.12, 0.016, 'sine', 0.06); }
    ok() { [392, 523, 659].forEach((f, i) => this.tone(f, 0.16, 0.022, 'triangle', i * 0.05)); }
    bad() { this.tone(160, 0.14, 0.026, 'sawtooth'); this.tone(110, 0.16, 0.018, 'sawtooth', 0.05); }
    finale() { [330, 440, 554, 659, 880].forEach((f, i) => this.tone(f, 0.28, 0.024, 'triangle', i * 0.06)); }
    setMuted(v) {
      this.muted = v;
      try { localStorage.setItem(SOUND_KEY, v ? '1' : '0'); } catch { /* ignore */ }
      if (v && this.context) {
        this.sources.forEach((s) => { try { s.stop(); } catch { /* ignore */ } });
        this.sources.clear();
      }
    }
  }

  const sound = new SoundEngine();
  let t = (key) => key;

  const el = {
    course: document.getElementById('course'),
    sound: document.getElementById('soundBtn'),
    theme: document.getElementById('themeBtn'),
    lang: document.getElementById('langBtn'),
    missionNumber: document.getElementById('missionNumber'),
    missionKicker: document.getElementById('missionKicker'),
    missionTitle: document.getElementById('missionTitle'),
    missionText: document.getElementById('missionText'),
    missionNav: document.getElementById('missionNav'),
    status: document.getElementById('status'),
    suspectText: document.getElementById('suspectText'),
    weighUsed: document.getElementById('weighUsed'),
    weighMax: document.getElementById('weighMax'),
    feeText: document.getElementById('feeText'),
    beamWrap: document.getElementById('beamWrap'),
    panLeft: document.getElementById('panLeft'),
    panRight: document.getElementById('panRight'),
    leftCoins: document.getElementById('leftCoins'),
    rightCoins: document.getElementById('rightCoins'),
    resultChip: document.getElementById('resultChip'),
    tray: document.getElementById('tray'),
    trayTitle: document.getElementById('trayTitle'),
    trayHint: document.getElementById('trayHint'),
    deskTitle: document.getElementById('deskTitle'),
    targetLeft: document.getElementById('targetLeft'),
    targetRight: document.getElementById('targetRight'),
    ruleText: document.getElementById('ruleText'),
    lessonIcon: document.getElementById('lessonIcon'),
    lessonText: document.getElementById('lessonText'),
    hintBtn: document.getElementById('hintBtn'),
    clearBtn: document.getElementById('clearBtn'),
    weighBtn: document.getElementById('weighBtn'),
    accuseBtn: document.getElementById('accuseBtn'),
    resetBtn: document.getElementById('resetBtn'),
    nextBtn: document.getElementById('nextBtn'),
    completeModal: document.getElementById('completeModal'),
    playAgainBtn: document.getElementById('playAgainBtn'),
  };

  let unlocked = 0;
  let completed = new Set();
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (raw && typeof raw === 'object') {
      unlocked = Math.max(0, Math.min(MISSIONS.length - 1, Number(raw.unlocked) || 0));
      completed = new Set((raw.completed || []).map(Number).filter((n) => n >= 0 && n < MISSIONS.length));
      if (completed.size) unlocked = Math.max(unlocked, Math.min(MISSIONS.length - 1, Math.max(...completed) + 1));
    }
  } catch { /* ignore */ }

  let missionIndex = completed.has(MISSIONS.length - 1) ? MISSIONS.length - 1 : Math.min(unlocked, MISSIONS.length - 1);
  let coinCount = 9;
  let fakeId = 1;
  let fakeKind = 'light';
  let left = new Set();
  let right = new Set();
  let genuine = new Set();
  /** @type {Array<{id:number, kind:'light'|'heavy'}>} */
  let possibilities = [];
  let selectedId = null;
  let targetSide = 'left';
  let accuseMode = false;
  let weighCount = 0;
  let busy = false;
  let won = false;
  let lost = false;
  let statusKey = { type: 'ready' };
  let sawTrim = false;
  let lastTilt = 'flat';

  function saveProgress() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked, completed: [...completed] }));
    } catch { /* ignore */ }
  }

  function mission() { return MISSIONS[missionIndex]; }

  function readDebug() {
    try {
      const raw = JSON.parse(localStorage.getItem(DEBUG_KEY) || 'null');
      if (!raw || typeof raw !== 'object') return null;
      return raw;
    } catch { return null; }
  }

  function pickFake(count, unknownBias) {
    const debug = readDebug();
    if (debug && debug.mission === missionIndex) {
      const id = Math.max(1, Math.min(count, Number(debug.fakeId) || 1));
      const kind = debug.fakeKind === 'heavy' ? 'heavy' : 'light';
      if (!unknownBias) return { id, kind: 'light' };
      return { id, kind };
    }
    const id = 1 + Math.floor(Math.random() * count);
    if (!unknownBias) return { id, kind: 'light' };
    return { id, kind: Math.random() < 0.5 ? 'light' : 'heavy' };
  }

  function rebuildPossibilities() {
    const m = mission();
    possibilities = [];
    if (m.unknownBias) {
      for (let id = 1; id <= coinCount; id += 1) {
        possibilities.push({ id, kind: 'light' }, { id, kind: 'heavy' });
      }
    } else {
      for (let id = 1; id <= coinCount; id += 1) possibilities.push({ id, kind: 'light' });
    }
  }

  function suspectIds() {
    if (mission().unknownBias) {
      return new Set(possibilities.map((p) => p.id));
    }
    const set = new Set();
    for (let id = 1; id <= coinCount; id += 1) {
      if (!genuine.has(id)) set.add(id);
    }
    return set;
  }

  function suspectCount() {
    if (mission().unknownBias) return new Set(possibilities.map((p) => p.id)).size;
    return coinCount - genuine.size;
  }

  function possibilityCount() {
    return possibilities.length;
  }

  function coinWeight(id) {
    if (id !== fakeId) return 0;
    return fakeKind === 'heavy' ? 1 : -1;
  }

  function sideWeight(ids) {
    let w = 0;
    ids.forEach((id) => { w += coinWeight(id); });
    return w;
  }

  /** @returns {'left'|'right'|'balance'} which side sinks (is heavier) */
  function weighResult(leftIds, rightIds) {
    const lw = sideWeight(leftIds);
    const rw = sideWeight(rightIds);
    if (lw > rw) return 'left';
    if (rw > lw) return 'right';
    return 'balance';
  }

  function simulateOutcome(leftIds, rightIds, hyp) {
    const weight = (id) => {
      if (id !== hyp.id) return 0;
      return hyp.kind === 'heavy' ? 1 : -1;
    };
    let lw = 0;
    let rw = 0;
    leftIds.forEach((id) => { lw += weight(id); });
    rightIds.forEach((id) => { rw += weight(id); });
    if (lw > rw) return 'left';
    if (rw > lw) return 'right';
    return 'balance';
  }

  function applyWeighLogic(leftIds, rightIds, outcome) {
    const m = mission();
    const before = possibilityCount();
    possibilities = possibilities.filter((hyp) => simulateOutcome(leftIds, rightIds, hyp) === outcome);

    if (!m.unknownBias) {
      genuine = new Set();
      const alive = new Set(possibilities.map((p) => p.id));
      for (let id = 1; id <= coinCount; id += 1) {
        if (!alive.has(id)) genuine.add(id);
      }
    } else {
      genuine = new Set();
      const alive = new Set(possibilities.map((p) => p.id));
      for (let id = 1; id <= coinCount; id += 1) {
        if (!alive.has(id)) genuine.add(id);
      }
    }

    const after = possibilityCount();
    if (before > after && after > 0) sawTrim = true;
    return { before, after, gone: before - after };
  }

  function startMission(index, opts = {}) {
    missionIndex = index;
    const m = mission();
    coinCount = m.coins;
    const picked = pickFake(coinCount, m.unknownBias);
    fakeId = picked.id;
    fakeKind = m.unknownBias ? picked.kind : 'light';
    left = new Set();
    right = new Set();
    genuine = new Set();
    rebuildPossibilities();
    selectedId = null;
    accuseMode = false;
    weighCount = 0;
    busy = false;
    won = false;
    lost = false;
    sawTrim = false;
    lastTilt = 'flat';
    el.beamWrap.dataset.tilt = 'flat';
    el.beamWrap.classList.remove('is-weighing');
    el.resultChip.hidden = true;
    statusKey = { type: 'ready' };
    el.nextBtn.hidden = true;
    el.completeModal.hidden = true;
    el.course.inert = false;
    if (!opts.silent) window.cool?.stage?.(`mission${index + 1}`);
    render();
  }

  function setStatus(type, payload = {}) {
    statusKey = { type, ...payload };
    renderStatus();
  }

  function renderStatus() {
    const s = statusKey;
    const map = {
      ready: () => t(`m${missionIndex + 1}Ready`),
      selected: () => t('selected', s.n),
      placed: () => t('placed', s.n, s.side),
      removed: () => t('removed', s.n),
      cleared: () => t('cleared'),
      needBoth: () => t('needBoth'),
      needEqual: () => t('needEqual', s.a, s.b),
      emptyPan: () => t('emptyPan'),
      weighing: () => t('weighing'),
      resultLeft: () => `${t('resultLeft')} ${s.extra || ''}`.trim(),
      resultRight: () => `${t('resultRight')} ${s.extra || ''}`.trim(),
      resultBalance: () => `${t('resultBalance')} ${s.extra || ''}`.trim(),
      overWeigh: () => t('overWeigh'),
      wrongAccuse: () => t('wrongAccuse', s.n),
      correctAccuse: () => t('correctAccuse', s.n, s.w, s.kind),
      failLimit: () => t('failLimit'),
      accuseHelp: () => t('accuseHelp'),
      accuseCancel: () => t('accuseCancel'),
      onlySuspects: () => t('onlySuspects'),
      magicMoment: () => t('magicMoment'),
      wonNext: () => t('wonNext'),
      allDone: () => t('allDone'),
      hint: () => t(`m${missionIndex + 1}Hint`),
    };
    el.status.textContent = (map[s.type] || map.ready)();
  }

  function isOnScale(id) {
    return left.has(id) || right.has(id);
  }

  function removeFromPans(id) {
    left.delete(id);
    right.delete(id);
  }

  function placeCoin(id, side) {
    if (won || lost || busy) return;
    if (genuine.has(id) && !mission().unknownBias) {
      setStatus('onlySuspects');
      return;
    }
    if (mission().unknownBias && genuine.has(id)) {
      setStatus('onlySuspects');
      return;
    }
    removeFromPans(id);
    if (side === 'left') left.add(id);
    else right.add(id);
    selectedId = null;
    sound.place();
    window.cool?.track?.('place_coin');
    setStatus('placed', { n: id, side });
    render();
  }

  function toggleSelect(id) {
    if (won || lost || busy) return;
    if (accuseMode) {
      doAccuse(id);
      return;
    }
    if (isOnScale(id)) {
      removeFromPans(id);
      selectedId = null;
      sound.pick();
      setStatus('removed', { n: id });
      render();
      return;
    }
    if (genuine.has(id)) {
      setStatus('onlySuspects');
      return;
    }
    // 已选目标盘时，单击金币直接放入（低门槛）
    placeCoin(id, targetSide);
  }

  function onPanClick(side) {
    if (won || lost || busy || accuseMode) return;
    targetSide = side;
    if (selectedId != null) {
      placeCoin(selectedId, side);
      return;
    }
    render();
  }

  function clearPans() {
    if (busy || won) return;
    left.clear();
    right.clear();
    selectedId = null;
    el.beamWrap.dataset.tilt = 'flat';
    lastTilt = 'flat';
    el.resultChip.hidden = true;
    sound.pick();
    setStatus('cleared');
    render();
  }

  function canWeigh() {
    if (won || lost || busy) return false;
    if (weighCount >= mission().maxWeigh) return false;
    if (!left.size || !right.size) return false;
    if (left.size !== right.size) return false;
    return true;
  }

  function doWeigh() {
    if (busy || won || lost) return;
    if (weighCount >= mission().maxWeigh) {
      setStatus('overWeigh');
      sound.bad();
      return;
    }
    if (!left.size || !right.size) {
      setStatus('emptyPan');
      sound.bad();
      return;
    }
    if (left.size !== right.size) {
      setStatus('needEqual', { a: left.size, b: right.size });
      sound.bad();
      return;
    }

    busy = true;
    accuseMode = false;
    selectedId = null;
    setStatus('weighing');
    el.beamWrap.classList.add('is-weighing');
    el.beamWrap.dataset.tilt = 'flat';
    sound.weigh();
    window.cool?.track?.('weigh');
    renderChrome();

    const leftIds = [...left];
    const rightIds = [...right];
    const outcome = weighResult(leftIds, rightIds);

    window.setTimeout(() => {
      el.beamWrap.classList.remove('is-weighing');
      lastTilt = outcome === 'balance' ? 'flat' : outcome;
      el.beamWrap.dataset.tilt = lastTilt;
      weighCount += 1;

      const trim = applyWeighLogic(leftIds, rightIds, outcome);
      if (outcome === 'balance') sound.balance();
      else sound.tilt();

      const kept = mission().unknownBias ? possibilityCount() : suspectCount();
      const extraText = mission().unknownBias
        ? t('markedUnknown', kept)
        : t('markedLight', suspectCount(), Math.max(0, trim.before - trim.after));

      if (sawTrim && weighCount === 1) {
        setStatus('magicMoment');
      } else if (outcome === 'left') {
        setStatus('resultLeft', { extra: extraText });
      } else if (outcome === 'right') {
        setStatus('resultRight', { extra: extraText });
      } else {
        setStatus('resultBalance', { extra: extraText });
      }

      // auto-return coins to tray after reading result, keep genuine dimmed
      left.clear();
      right.clear();

      if (mission().strict && weighCount >= mission().maxWeigh && suspectCount() > 1 && !won) {
        // still can accuse if one left
        if (suspectCount() === 1) {
          /* allow accuse */
        }
      }

      el.resultChip.hidden = false;
      busy = false;
      render();
    }, 650);
  }

  function doAccuse(id) {
    if (busy || won || lost) return;
    if (genuine.has(id)) {
      setStatus('onlySuspects');
      sound.bad();
      return;
    }

    window.cool?.track?.('accuse');
    if (id === fakeId) {
      won = true;
      accuseMode = false;
      sound.ok();
      setStatus('correctAccuse', { n: id, w: weighCount, kind: fakeKind });
      completed.add(missionIndex);
      unlocked = Math.max(unlocked, Math.min(MISSIONS.length - 1, missionIndex + 1));
      saveProgress();
      window.cool?.stage?.(`cleared${missionIndex + 1}`);

      if (missionIndex >= MISSIONS.length - 1) {
        window.cool?.complete?.();
        el.completeModal.hidden = false;
        el.course.inert = true;
        sound.finale();
        window.setTimeout(() => el.playAgainBtn?.focus(), 30);
      } else {
        el.nextBtn.hidden = false;
      }
      // 保留 correctAccuse 文案，通关弹窗自行展示总结
      render();
      return;
    }

    sound.bad();
    setStatus('wrongAccuse', { n: id });
    // mild penalty: mark nothing, stay
    if (mission().strict && weighCount >= mission().maxWeigh) {
      lost = true;
      setStatus('failLimit');
    }
    render();
  }

  function toggleAccuseMode() {
    if (busy || won || lost) return;
    accuseMode = !accuseMode;
    selectedId = null;
    sound.pick();
    setStatus(accuseMode ? 'accuseHelp' : 'accuseCancel');
    render();
  }

  function makeCoinButton(id, onPan) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'coin';
    btn.textContent = String(id);
    btn.dataset.coin = String(id);
    btn.setAttribute('role', 'listitem');
    if (onPan) btn.classList.add('is-on-pan');
    if (selectedId === id) btn.classList.add('is-selected');
    if (genuine.has(id)) btn.classList.add('is-genuine');
    if (accuseMode && !genuine.has(id)) btn.classList.add('is-hot');
    if (won && id === fakeId) btn.classList.add('is-hot');
    if ((won || lost || busy) && !(won && id === fakeId)) {
      /* still clickable only if not busy */
    }
    const state = genuine.has(id) ? 'genuine' : selectedId === id ? 'selected' : 'suspect';
    btn.setAttribute('aria-label', t('coinAria', id, state));
    btn.addEventListener('click', () => toggleSelect(id));
    return btn;
  }

  function renderCoins() {
    el.tray.replaceChildren();
    el.leftCoins.replaceChildren();
    el.rightCoins.replaceChildren();

    for (let id = 1; id <= coinCount; id += 1) {
      if (left.has(id)) el.leftCoins.appendChild(makeCoinButton(id, true));
      else if (right.has(id)) el.rightCoins.appendChild(makeCoinButton(id, true));
      else el.tray.appendChild(makeCoinButton(id, false));
    }
  }

  function renderNav() {
    el.missionNav.replaceChildren();
    el.missionNav.setAttribute('aria-label', t('missionsLabel'));
    MISSIONS.forEach((m, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = String(index + 1);
      btn.dataset.mission = String(index);
      if (index === missionIndex) btn.classList.add('is-active');
      if (completed.has(index)) btn.classList.add('is-done');
      const open = index <= unlocked || completed.has(index);
      btn.disabled = !open;
      btn.title = open ? '' : t('lockedMission');
      btn.addEventListener('click', () => {
        if (!open || busy) return;
        startMission(index);
      });
      el.missionNav.appendChild(btn);
    });
  }

  function renderChrome() {
    const m = mission();
    const n = missionIndex + 1;
    el.missionNumber.textContent = String(n).padStart(2, '0');
    el.missionKicker.textContent = t(`m${n}Kicker`);
    el.missionTitle.textContent = t(`m${n}Title`);
    el.missionText.textContent = t(`m${n}Text`);
    el.ruleText.textContent = t(`m${n}Rule`);
    el.lessonText.textContent = t(`m${n}Lesson`);
    el.lessonIcon.textContent = m.icon;
    el.suspectText.textContent = t('suspectCount', mission().unknownBias ? possibilityCount() : suspectCount());
    el.weighUsed.textContent = String(weighCount);
    el.weighMax.textContent = String(m.maxWeigh);
    el.feeText.textContent = t('feeCoins', weighCount);
    el.trayTitle.textContent = t('trayTitle');
    el.trayHint.textContent = accuseMode ? t('trayHintAccuse') : t('trayHint');
    el.deskTitle.textContent = won ? t('deskTitleDone') : t('deskTitlePlay');

    el.targetLeft.classList.toggle('is-active', targetSide === 'left' && !accuseMode);
    el.targetRight.classList.toggle('is-active', targetSide === 'right' && !accuseMode);
    el.panLeft.classList.toggle('is-target', targetSide === 'left' && !accuseMode);
    el.panRight.classList.toggle('is-target', targetSide === 'right' && !accuseMode);
    el.accuseBtn.classList.toggle('accuse-on', accuseMode);
    el.accuseBtn.textContent = accuseMode ? t('accuseOn') : t('accuseMode');

    el.weighBtn.disabled = busy || won || lost || weighCount >= m.maxWeigh;
    el.clearBtn.disabled = busy || won || (!left.size && !right.size);
    el.hintBtn.disabled = busy;
    el.accuseBtn.disabled = busy || won || lost;
    el.resetBtn.disabled = busy;
    el.nextBtn.hidden = !(won && missionIndex < MISSIONS.length - 1);
    el.targetLeft.disabled = busy || won || lost || accuseMode;
    el.targetRight.disabled = busy || won || lost || accuseMode;

    if (!el.resultChip.hidden) {
      if (lastTilt === 'left') el.resultChip.textContent = t('resultLeft');
      else if (lastTilt === 'right') el.resultChip.textContent = t('resultRight');
      else el.resultChip.textContent = t('resultBalance');
    }

    const muted = sound.muted;
    el.sound.textContent = muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', muted ? 'true' : 'false');
    el.sound.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
    el.theme.setAttribute('aria-label', t('themeLabel'));
  }

  function render() {
    renderNav();
    renderChrome();
    renderCoins();
    renderStatus();
  }

  el.targetLeft.addEventListener('click', () => {
    targetSide = 'left';
    if (selectedId != null) placeCoin(selectedId, 'left');
    else render();
  });
  el.targetRight.addEventListener('click', () => {
    targetSide = 'right';
    if (selectedId != null) placeCoin(selectedId, 'right');
    else render();
  });
  el.panLeft.addEventListener('click', () => onPanClick('left'));
  el.panRight.addEventListener('click', () => onPanClick('right'));
  el.panLeft.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPanClick('left'); }
  });
  el.panRight.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPanClick('right'); }
  });

  el.clearBtn.addEventListener('click', clearPans);
  el.weighBtn.addEventListener('click', doWeigh);
  el.accuseBtn.addEventListener('click', toggleAccuseMode);
  el.hintBtn.addEventListener('click', () => {
    sound.pick();
    setStatus('hint');
  });
  el.resetBtn.addEventListener('click', () => startMission(missionIndex));
  el.nextBtn.addEventListener('click', () => {
    if (missionIndex < MISSIONS.length - 1) startMission(missionIndex + 1);
  });
  el.playAgainBtn.addEventListener('click', () => {
    completed = new Set();
    unlocked = 0;
    saveProgress();
    el.completeModal.hidden = true;
    el.course.inert = false;
    startMission(0);
  });

  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    renderChrome();
    if (!sound.muted) sound.pick();
  });

  // test hook
  window.__PIRATE_SCALES__ = {
    getState: () => ({
      missionIndex,
      fakeId,
      fakeKind,
      weighCount,
      left: [...left],
      right: [...right],
      genuine: [...genuine],
      suspects: [...suspectIds()],
      possibilities: possibilities.map((p) => ({ ...p })),
      won,
      lost,
      busy,
    }),
    startMission: (i) => startMission(i),
    setDebug: (fake, kind = 'light', mission = missionIndex) => {
      try {
        localStorage.setItem(DEBUG_KEY, JSON.stringify({ fakeId: fake, fakeKind: kind, mission }));
      } catch { /* ignore */ }
    },
    clearDebug: () => {
      try { localStorage.removeItem(DEBUG_KEY); } catch { /* ignore */ }
    },
    weigh: doWeigh,
    accuse: doAccuse,
    place: placeCoin,
    clearPans,
  };

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang, theme }) {
      t = translate;
      document.title = t('doc');
      if (el.lang) el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      if (el.theme) el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
      render();
    },
  });

  el.lang?.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme?.addEventListener('click', () => window.cool.preferences.toggleTheme());

  startMission(missionIndex, { silent: true });
})();
