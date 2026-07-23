(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '摆渡奇遇 · KidsLab',
      back: '返回平台',
      title: '摆渡奇遇',
      chapter: '河上故事',
      trips: '航行',
      startBank: '故事岸',
      goalBank: '庆典岸',
      undo: '退一步',
      restart: '重开',
      hint: '轻提示',
      safetyCard: '河岸守则',
      guideTitle: '摆渡三步',
      guidePick: '点一位乘客',
      guideSail: '扬帆，空船也能回',
      guideSafe: '检查无人照看的岸',
      chapterLabel: (n) => `第 ${n} 章`,
      chapterNav: (n, title) => `第 ${n} 章：${title}`,
      level1Title: '狼、羊和白菜',
      level1Mission: '一次带一位；危险搭档不能独处。',
      level1RuleTitle: '谁不能单独相处？',
      level2Title: '鹦鹉停战日',
      level2Mission: '鹦鹉会吵架；大狗在场就能劝架。',
      level2RuleTitle: '谁能让争吵停下来？',
      level3Title: '森林庆典队',
      level3Mission: '两组危险搭档，共用一只守护狗。',
      level3RuleTitle: '一位守护者，两条规则',
      wolf: '狼',
      goat: '羊',
      cabbage: '白菜',
      redParrot: '红鹦鹉',
      blueParrot: '蓝鹦鹉',
      dog: '大狗',
      cat: '猫',
      bird: '小鸟',
      seeds: '种子',
      pairUnsafe: (a, b) => `${a} 会欺负 ${b}`,
      pairArgue: (a, b) => `${a} 和 ${b} 会吵架`,
      guardSafe: (guard) => `${guard}在场时，危险搭档会保持安全。`,
      pickFirst: '先点船这边的一位乘客，再扬帆。',
      selected: (name) => `${name}上船了。现在可以扬帆！`,
      unselected: (name) => `${name}又下船了。你也可以让空船出发。`,
      passengerButton: (name, bank, selected) => `${name}在${bank}${selected ? '，已上船' : '，点按让它上船'}`,
      sailToRight: '扬帆去庆典岸',
      sailToLeft: '扬帆回故事岸',
      sailing: (bank) => `小船正驶向${bank}…`,
      arrived: (bank) => `安全抵达${bank}。再看看哪一位该上船。`,
      emptyReturn: (bank) => `空船安全抵达${bank}。`,
      violation: (a, b) => `糟糕！${a}和${b}被单独留下了！`,
      rewind: '嗖——时光倒流！这一步已经撤回，请换个办法。',
      undoDone: '退回上一步。现在可以重新规划。',
      nothingToUndo: '还在故事开头，没有更早的一步啦。',
      restarted: '故事重新翻到这一章的开头。',
      hintPassenger: (name) => `先观察船这一边：试试带上${name}。`,
      hintEmpty: '这一趟先让空船返回，才能接下一位乘客。',
      alreadySolved: '大家已经到齐，庆典要开始啦！',
      completeKicker: (n) => `第 ${n} 章完成`,
      completeTitle: '所有乘客都安全抵达！',
      completeText: '有时候先返回一步，反而能把故事带向终点。',
      finalTitle: '金色摆渡人',
      finalText: '你会检查每一步的状态，也会为了最终目标勇敢返回。整本河上故事完成！',
      nextChapter: '翻到下一章',
      playAgain: '再玩一遍',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      lockedChapter: '先完成前一章',
      reactionEat: (a, b) => `${a}：啊呜！\n${b}：快倒带！`,
      reactionArgue: (a, b) => `${a} + ${b}\n吵成一团！`,
    },
    en: {
      doc: 'Ferry Tales · KidsLab',
      back: 'Back to platform',
      title: 'Ferry Tales',
      chapter: 'River tales',
      trips: 'Trips',
      startBank: 'Story bank',
      goalBank: 'Festival bank',
      undo: 'Undo',
      restart: 'Restart',
      hint: 'Small hint',
      safetyCard: 'River rules',
      guideTitle: 'Three ferry steps',
      guidePick: 'Pick one passenger',
      guideSail: 'Sail; the boat may return empty',
      guideSafe: 'Check the unattended bank',
      chapterLabel: (n) => `Chapter ${n}`,
      chapterNav: (n, title) => `Chapter ${n}: ${title}`,
      level1Title: 'The Wolf, Goat & Cabbage',
      level1Mission: 'Carry one. Dangerous pairs cannot be alone.',
      level1RuleTitle: 'Who cannot be left alone?',
      level2Title: 'Parrot Peace Day',
      level2Mission: 'The parrots quarrel; the big dog keeps the peace.',
      level2RuleTitle: 'Who can stop the squabble?',
      level3Title: 'Forest Festival Crew',
      level3Mission: 'Two dangerous pairs share one guard dog.',
      level3RuleTitle: 'One guardian, two rules',
      wolf: 'Wolf',
      goat: 'Goat',
      cabbage: 'Cabbage',
      redParrot: 'Red parrot',
      blueParrot: 'Blue parrot',
      dog: 'Big dog',
      cat: 'Cat',
      bird: 'Bird',
      seeds: 'Seeds',
      pairUnsafe: (a, b) => `${a} will bother ${b}`,
      pairArgue: (a, b) => `${a} and ${b} will squabble`,
      guardSafe: (guard) => `When ${guard} is present, dangerous pairs stay safe.`,
      pickFirst: 'Pick one passenger beside the boat, then sail.',
      selected: (name) => `${name} is aboard. Ready to sail!`,
      unselected: (name) => `${name} stepped off. The boat may also sail empty.`,
      passengerButton: (name, bank, selected) => `${name} on the ${bank}${selected ? ', aboard' : ', tap to board'}`,
      sailToRight: 'Sail to festival bank',
      sailToLeft: 'Sail to story bank',
      sailing: (bank) => `Sailing toward the ${bank}…`,
      arrived: (bank) => `Safe at the ${bank}. Who should board next?`,
      emptyReturn: (bank) => `The empty boat reached the ${bank} safely.`,
      violation: (a, b) => `Oh no! ${a} and ${b} were left alone!`,
      rewind: 'Whoosh — time rewound! That move is undone. Try another plan.',
      undoDone: 'One step back. You can plan again.',
      nothingToUndo: 'This is the beginning of the story. There is no earlier step.',
      restarted: 'This chapter has restarted from the beginning.',
      hintPassenger: (name) => `Look beside the boat: try taking ${name}.`,
      hintEmpty: 'Let the empty boat return this time so it can collect the next passenger.',
      alreadySolved: 'Everyone is here. The festival can begin!',
      completeKicker: (n) => `Chapter ${n} complete`,
      completeTitle: 'Every passenger arrived safely!',
      completeText: 'Sometimes going back one step is exactly how a plan moves forward.',
      finalTitle: 'Golden Ferryperson',
      finalText: 'You checked every new state and returned when the bigger plan needed it. The whole river tale is complete!',
      nextChapter: 'Turn to next chapter',
      playAgain: 'Play again',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      lockedChapter: 'Finish the previous chapter first',
      reactionEat: (a, b) => `${a}: Chomp!\n${b}: Rewind!`,
      reactionArgue: (a, b) => `${a} + ${b}\nWhat a squabble!`,
    },
  };

  const LEVELS = [
    {
      title: 'level1Title',
      mission: 'level1Mission',
      ruleTitle: 'level1RuleTitle',
      items: [
        { id: 'wolf', emoji: '🐺' },
        { id: 'goat', emoji: '🐐' },
        { id: 'cabbage', emoji: '🥬' },
      ],
      dangers: [
        ['wolf', 'goat', 'eat'],
        ['goat', 'cabbage', 'eat'],
      ],
      guard: null,
    },
    {
      title: 'level2Title',
      mission: 'level2Mission',
      ruleTitle: 'level2RuleTitle',
      items: [
        { id: 'redParrot', emoji: '🦜' },
        { id: 'blueParrot', emoji: '🦜' },
        { id: 'dog', emoji: '🐕' },
      ],
      dangers: [['redParrot', 'blueParrot', 'argue']],
      guard: 'dog',
    },
    {
      title: 'level3Title',
      mission: 'level3Mission',
      ruleTitle: 'level3RuleTitle',
      items: [
        { id: 'cat', emoji: '🐈' },
        { id: 'bird', emoji: '🐦' },
        { id: 'seeds', emoji: '🌻' },
        { id: 'dog', emoji: '🐕' },
      ],
      dangers: [
        ['cat', 'bird', 'eat'],
        ['bird', 'seeds', 'eat'],
      ],
      guard: 'dog',
    },
  ];

  const $ = (selector) => document.querySelector(selector);
  const el = {
    chapterNumber: $('#chapterNumber'),
    eyebrow: $('#eyebrow'),
    levelTitle: $('#levelTitle'),
    mission: $('#missionText'),
    chapterNav: $('#chapterNav'),
    status: $('#status'),
    trips: $('#tripCount'),
    scene: $('#riverScene'),
    left: $('#leftPassengers'),
    right: $('#rightPassengers'),
    boat: $('#boat'),
    cargo: $('#boatCargo'),
    reaction: $('#sceneReaction'),
    sail: $('#sailBtn'),
    undo: $('#undoBtn'),
    restart: $('#restartBtn'),
    hint: $('#hintBtn'),
    ruleTitle: $('#ruleTitle'),
    rules: $('#ruleList'),
    modal: $('#completeModal'),
    completeKicker: $('#completeKicker'),
    completeTitle: $('#completeTitle'),
    completeText: $('#completeText'),
    next: $('#nextBtn'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
  };

  const SAVE_KEY = 'kidslab.ferry-tales';
  const SOUND_KEY = 'kidslab.sound.muted';
  const loadSave = () => {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'); } catch { return {}; }
  };
  const save = loadSave();
  let t = (key) => key;
  let language = 'zh';
  let theme = 'light';
  let levelIndex = 0;
  let unlocked = Math.min(LEVELS.length - 1, Math.max(0, Number(save.unlocked) || 0));
  let completed = new Set(Array.isArray(save.completed) ? save.completed.filter((n) => Number.isInteger(n)) : []);
  let boatSide = 0;
  let positions = [];
  let selected = null;
  let trips = 0;
  let history = [];
  let busy = false;
  let won = false;
  let statusMessage = { key: 'pickFirst', args: [] };
  let reactionText = '';
  let hintId = null;
  let actionToken = 0;

  const persist = () => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        unlocked,
        completed: [...completed],
      }));
    } catch { /* localStorage may be unavailable */ }
  };

  class SoundEngine {
    constructor() {
      try { this.muted = localStorage.getItem(SOUND_KEY) === 'true'; } catch { this.muted = false; }
      this.context = null;
    }

    toggle() {
      this.muted = !this.muted;
      try { localStorage.setItem(SOUND_KEY, String(this.muted)); } catch { /* ignore */ }
      this.updateButton();
      if (!this.muted) this.play('select');
    }

    updateButton() {
      el.sound.textContent = this.muted ? '🔇' : '🔊';
      el.sound.setAttribute('aria-pressed', String(this.muted));
      el.sound.setAttribute('aria-label', t(this.muted ? 'soundOn' : 'soundOff'));
    }

    play(kind) {
      if (this.muted) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      try {
        this.context ||= new AudioContextClass();
        if (this.context.state === 'suspended') this.context.resume().catch(() => {});
        const patterns = {
          select: [[350, 0, 0.07]],
          sail: [[190, 0, 0.1], [245, 0.09, 0.12]],
          undo: [[290, 0, 0.08], [220, 0.07, 0.1]],
          error: [[185, 0, 0.13], [125, 0.12, 0.2]],
          success: [[523, 0, 0.12], [659, 0.1, 0.12], [784, 0.2, 0.22]],
          complete: [[392, 0, 0.12], [523, 0.1, 0.12], [659, 0.2, 0.12], [784, 0.3, 0.3]],
        };
        (patterns[kind] || patterns.select).forEach(([frequency, delay, duration]) => {
          const oscillator = this.context.createOscillator();
          const gain = this.context.createGain();
          const start = this.context.currentTime + delay;
          oscillator.type = kind === 'error' ? 'sawtooth' : 'sine';
          oscillator.frequency.setValueAtTime(frequency, start);
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(0.11, start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
          oscillator.connect(gain).connect(this.context.destination);
          oscillator.start(start);
          oscillator.stop(start + duration + 0.02);
        });
      } catch { /* sound is optional; gameplay remains available */ }
    }
  }

  const sound = new SoundEngine();

  function level() { return LEVELS[levelIndex]; }
  function itemById(id) { return level().items.find((item) => item.id === id); }
  function itemName(id) { return t(id); }
  function bankName(side) { return t(side === 0 ? 'startBank' : 'goalBank'); }
  function setStatus(key, ...args) { statusMessage = { key, args }; }
  function statusText() {
    return t(statusMessage.key, ...statusMessage.args);
  }
  function snapshot() {
    return { boatSide, positions: [...positions], trips };
  }
  function restore(state) {
    boatSide = state.boatSide;
    positions = [...state.positions];
    trips = state.trips;
    selected = null;
    hintId = null;
  }

  function findViolation(statePositions, stateBoatSide) {
    const unattendedSide = 1 - stateBoatSide;
    const unattended = new Set(level().items
      .filter((_, index) => statePositions[index] === unattendedSide)
      .map((item) => item.id));
    if (level().guard && unattended.has(level().guard)) return null;
    const danger = level().dangers.find(([a, b]) => unattended.has(a) && unattended.has(b));
    return danger || null;
  }

  function choosePassenger(id) {
    if (busy || won) return;
    const index = level().items.findIndex((item) => item.id === id);
    if (index < 0 || positions[index] !== boatSide) return;
    selected = selected === id ? null : id;
    hintId = null;
    if (selected) {
      setStatus('selected', itemName(selected));
      sound.play('select');
      window.cool?.track('board-ferry', { passenger: selected, chapter: levelIndex + 1 });
    } else {
      setStatus('unselected', itemName(id));
    }
    render();
  }

  function sail() {
    if (busy || won) return;
    const token = ++actionToken;
    const before = snapshot();
    const destination = 1 - boatSide;
    const passenger = selected;
    busy = true;
    reactionText = '';
    hintId = null;
    setStatus('sailing', bankName(destination));
    el.boat.classList.add('sailing');
    sound.play('sail');
    window.cool?.stage(`ferry-chapter-${levelIndex + 1}`);
    window.cool?.track('sail-ferry', {
      chapter: levelIndex + 1,
      passenger: passenger || 'empty',
      direction: destination === 1 ? 'outward' : 'return',
    });

    boatSide = destination;
    if (passenger) {
      const index = level().items.findIndex((item) => item.id === passenger);
      positions[index] = destination;
    }
    selected = null;
    render();

    setTimeout(() => {
      if (token !== actionToken) return;
      const violation = findViolation(positions, boatSide);
      if (violation) {
        const [a, b, kind] = violation;
        reactionText = t(kind === 'argue' ? 'reactionArgue' : 'reactionEat', itemName(a), itemName(b));
        setStatus('violation', itemName(a), itemName(b));
        el.boat.classList.add('rewinding');
        sound.play('error');
        render();
        window.cool?.track('rewind-unsafe-bank', { chapter: levelIndex + 1, pair: `${a}-${b}` });
        setTimeout(() => {
          if (token !== actionToken) return;
          restore(before);
          busy = false;
          reactionText = '';
          setStatus('rewind');
          el.boat.classList.remove('rewinding', 'sailing');
          render();
        }, 820);
        return;
      }

      history.push(before);
      trips += 1;
      busy = false;
      el.boat.classList.remove('sailing');
      if (positions.every((side) => side === 1)) {
        won = true;
        completed.add(levelIndex);
        if (levelIndex < LEVELS.length - 1) unlocked = Math.max(unlocked, levelIndex + 1);
        persist();
        setStatus('alreadySolved');
        sound.play(levelIndex === LEVELS.length - 1 ? 'complete' : 'success');
        render();
        setTimeout(() => {
          if (token === actionToken) showComplete();
        }, 420);
      } else {
        setStatus(passenger ? 'arrived' : 'emptyReturn', bankName(destination));
        render();
      }
    }, 520);
  }

  function undo() {
    if (busy || won) return;
    if (!history.length) {
      setStatus('nothingToUndo');
      render();
      return;
    }
    actionToken += 1;
    restore(history.pop());
    reactionText = '';
    setStatus('undoDone');
    sound.play('undo');
    window.cool?.track('undo-ferry-step', { chapter: levelIndex + 1 });
    render();
  }

  function restart() {
    if (busy) actionToken += 1;
    startLevel(levelIndex, 'restarted');
    window.cool?.track('restart-ferry-chapter', { chapter: levelIndex + 1 });
  }

  function stateKey(side, statePositions) {
    return `${side}:${statePositions.join('')}`;
  }

  function nextHintMove() {
    const queue = [{ side: boatSide, pos: [...positions], first: undefined }];
    const visited = new Set([stateKey(boatSide, positions)]);
    while (queue.length) {
      const current = queue.shift();
      if (current.pos.every((side) => side === 1)) return current.first ?? null;
      const choices = [null, ...level().items
        .filter((_, index) => current.pos[index] === current.side)
        .map((item) => item.id)];
      for (const passenger of choices) {
        const nextSide = 1 - current.side;
        const nextPos = [...current.pos];
        if (passenger) nextPos[level().items.findIndex((item) => item.id === passenger)] = nextSide;
        if (findViolation(nextPos, nextSide)) continue;
        const key = stateKey(nextSide, nextPos);
        if (visited.has(key)) continue;
        visited.add(key);
        queue.push({
          side: nextSide,
          pos: nextPos,
          first: current.first === undefined ? passenger : current.first,
        });
      }
    }
    return undefined;
  }

  function showHint() {
    if (busy || won) return;
    const move = nextHintMove();
    hintId = move || null;
    if (move === null) setStatus('hintEmpty');
    else if (move) setStatus('hintPassenger', itemName(move));
    else setStatus('pickFirst');
    sound.play('select');
    window.cool?.track('request-ferry-hint', { chapter: levelIndex + 1, move: move || 'empty' });
    render();
  }

  function startLevel(index, message = 'pickFirst') {
    actionToken += 1;
    levelIndex = index;
    boatSide = 0;
    positions = level().items.map(() => 0);
    selected = null;
    trips = 0;
    history = [];
    busy = false;
    won = false;
    reactionText = '';
    hintId = null;
    setStatus(message);
    el.modal.hidden = true;
    el.boat.classList.remove('sailing', 'rewinding');
    render();
  }

  function showComplete() {
    const final = levelIndex === LEVELS.length - 1;
    el.completeKicker.textContent = t('completeKicker', levelIndex + 1);
    el.completeTitle.textContent = t(final ? 'finalTitle' : 'completeTitle');
    el.completeText.textContent = t(final ? 'finalText' : 'completeText');
    el.next.textContent = t(final ? 'playAgain' : 'nextChapter');
    el.modal.hidden = false;
    if (final) window.cool?.complete?.();
  }

  function advance() {
    if (levelIndex < LEVELS.length - 1) startLevel(levelIndex + 1);
    else startLevel(0);
  }

  function renderChapterNav() {
    el.chapterNav.innerHTML = '';
    LEVELS.forEach((entry, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `chapter-btn${index === levelIndex ? ' current' : ''}${completed.has(index) ? ' done' : ''}`;
      button.textContent = String(index + 1).padStart(2, '0');
      button.disabled = index > unlocked || busy;
      button.title = button.disabled ? t('lockedChapter') : t('chapterNav', index + 1, t(entry.title));
      button.setAttribute('aria-label', button.title);
      button.addEventListener('click', () => startLevel(index));
      el.chapterNav.appendChild(button);
    });
  }

  function renderRules() {
    el.ruleTitle.textContent = t(level().ruleTitle);
    el.rules.innerHTML = '';
    level().dangers.forEach(([a, b, kind]) => {
      const chip = document.createElement('div');
      chip.className = 'rule-chip';
      const faces = document.createElement('span');
      faces.className = 'rule-chip__faces';
      faces.textContent = `${itemById(a).emoji} ${itemById(b).emoji}`;
      const text = document.createElement('b');
      text.textContent = t(kind === 'argue' ? 'pairArgue' : 'pairUnsafe', itemName(a), itemName(b));
      chip.append(faces, text);
      el.rules.appendChild(chip);
    });
    if (level().guard) {
      const note = document.createElement('p');
      note.className = 'guard-note';
      note.textContent = `🐕 ${t('guardSafe', itemName(level().guard))}`;
      el.rules.appendChild(note);
    }
  }

  function renderBank(container, side) {
    container.innerHTML = '';
    level().items.forEach((item, index) => {
      if (positions[index] !== side) return;
      const button = document.createElement('button');
      const isSelected = selected === item.id;
      button.type = 'button';
      button.className = 'passenger';
      button.dataset.passenger = item.id;
      button.disabled = busy || won || side !== boatSide;
      button.setAttribute('aria-pressed', String(isSelected));
      button.setAttribute('aria-label', t('passengerButton', itemName(item.id), bankName(side), isSelected));
      if (hintId === item.id) button.classList.add('hinted');
      const emoji = document.createElement('span');
      emoji.className = 'passenger__emoji';
      emoji.textContent = item.emoji;
      const name = document.createElement('span');
      name.className = 'passenger__name';
      name.textContent = itemName(item.id);
      button.append(emoji, name);
      button.addEventListener('click', () => choosePassenger(item.id));
      container.appendChild(button);
    });
  }

  function render() {
    if (!el.levelTitle) return;
    el.chapterNumber.textContent = String(levelIndex + 1).padStart(2, '0');
    el.eyebrow.textContent = t('chapterLabel', levelIndex + 1);
    el.levelTitle.textContent = t(level().title);
    el.mission.textContent = t(level().mission);
    el.status.textContent = statusText();
    el.trips.textContent = String(trips);
    el.boat.classList.toggle('at-right', boatSide === 1);
    el.boat.classList.toggle('sailing', busy);
    el.cargo.textContent = selected ? itemById(selected).emoji : '＋';
    el.reaction.textContent = reactionText;
    el.sail.textContent = t(boatSide === 0 ? 'sailToRight' : 'sailToLeft');
    el.undo.setAttribute('aria-label', t('undo'));
    el.restart.setAttribute('aria-label', t('restart'));
    el.hint.setAttribute('aria-label', t('hint'));
    el.sail.disabled = busy || won;
    el.undo.disabled = busy || won || history.length === 0;
    el.restart.disabled = busy;
    el.hint.disabled = busy || won;
    el.theme.setAttribute('aria-label', t('themeLabel'));
    sound.updateButton();
    renderChapterNav();
    renderRules();
    renderBank(el.left, 0);
    renderBank(el.right, 1);
  }

  el.sail.addEventListener('click', sail);
  el.undo.addEventListener('click', undo);
  el.restart.addEventListener('click', restart);
  el.hint.addEventListener('click', showHint);
  el.next.addEventListener('click', advance);
  el.sound.addEventListener('click', () => sound.toggle());
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang, theme: nextTheme }) {
      t = translate;
      language = lang;
      theme = nextTheme;
      document.title = t('doc');
      el.lang.textContent = language === 'zh' ? 'EN' : '中';
      el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
      render();
      if (!el.modal.hidden && won) showComplete();
    },
  });

  startLevel(0);
})();
