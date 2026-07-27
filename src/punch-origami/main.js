(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '折纸打孔妙妙屋 · KidsLab',
      back: '返回平台',
      title: '折纸打孔妙妙屋',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      roomsLabel: '纸艺房间',
      gridLabel: '展开纸张孔位预测',
      canvasLabel: '折叠纸张示意图',
      foldStepsLabel: '折叠步骤',
      foldedView: '折后纸包',
      picked: '已选',
      foldPlan: 'FOLD PLAN / 折叠路线',
      clear: '清空',
      hint: '提示',
      check: '检查预测',
      next: '下一间',
      unfold: '拖住纸带，展开到底',
      finalKicker: '一孔，四次镜像',
      finalTitle: '纸上开出了十六朵花！',
      finalText: '你没有靠猜，而是在脑中把每一道折痕倒着展开。',
      playAgain: '再折一次',
      left: '向左',
      up: '向上',
      foldWord: '折',
      emptyFold: '待解锁',
      levelLabel: (n, title) => `第 ${n} 间：${title}`,
      lockedLevel: '先完成前一间',
      cellLabel: (column, row, selected) => `${column}${row}${selected ? '，已选' : ''}`,
      room1Kicker: '第一间 · 半折门廊',
      room1Title: '一折以后，孔会去哪？',
      room1Text: '纸的右半边向左合上，黑点是打孔位置。',
      room2Kicker: '第二间 · 四格窗',
      room2Title: '两道折痕，谁是谁的镜子？',
      room2Text: '先向左，再向上。展开时要把顺序倒过来。',
      room3Kicker: '第三间 · 八角阁楼',
      room3Title: '再折一次，会多出哪一排？',
      room3Text: '小纸包又向左折半，三次镜像会留下八个孔。',
      room4Kicker: '终极间 · 纸花穹顶',
      room4Title: '四折一孔，能开十六朵吗？',
      room4Text: '把四道折痕倒着展开，让孔位沿横竖方向连续绽放。',
      summary1: '向左折 1 次',
      summary2: '向左、向上，各折 1 次',
      summary3: '向左、向上、再向左',
      summary4: '左、上、左、上，共折 4 次',
      ready: '在展开图上点出你预测的孔。',
      needPick: '还没有预测。先点一个可能有孔的格子。',
      tooMany: (count) => `这一关展开后只有 ${count} 个孔。先收回一些预测。`,
      wrong: '有些孔没有成镜像对。红色位置要再想一想。',
      correct: '预测全对！现在拖动纸带，亲手把纸展开。',
      unfolding: '折痕正在打开，盯住每个孔的镜像位置。',
      unfolded: '展开完成！每一道折痕都复制了一组镜像孔。',
      replayReady: '这间已经解开了，还可以重新预测一次。',
      hint1: '折痕像一面镜子：找一个左右等距的位置。',
      hint2: '先把最后的横折展开，再处理竖折。',
      hint3: '三折会把一孔翻倍三次：1 → 2 → 4 → 8。',
      hint4: '看四个角落：横向四列、纵向四行会组成 16 个交点。',
      rule: '展开一折，就把已有的孔沿折痕镜像一次。',
      lessonTitle1: '第一面镜子',
      lesson1: '两个孔到竖折痕的距离一样远。',
      lessonTitle2: '倒着展开',
      lesson2: '最后折的纸要最先打开，孔位依次镜像。',
      lessonTitle3: '每折翻倍',
      lesson3: '孔不在折痕上时，三折一孔会展开成 8 孔。',
      lessonTitle4: '十六孔纸花',
      lesson4: '四次不重合的镜像让 1 个孔变成 2⁴ = 16 个。',
    },
    en: {
      doc: 'Punch & Fold House · KidsLab',
      back: 'Back to platform',
      title: 'Punch & Fold House',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      roomsLabel: 'Paper rooms',
      gridLabel: 'Open-sheet hole prediction',
      canvasLabel: 'Folded paper model',
      foldStepsLabel: 'Fold steps',
      foldedView: 'FOLDED PACK',
      picked: 'Picked',
      foldPlan: 'FOLD PLAN',
      clear: 'Clear',
      hint: 'Hint',
      check: 'Check prediction',
      next: 'Next room',
      unfold: 'Drag the paper strip fully open',
      finalKicker: 'ONE PUNCH, FOUR REFLECTIONS',
      finalTitle: 'Sixteen Paper Blooms!',
      finalText: 'You did not guess. You unfolded every crease backward in your mind.',
      playAgain: 'Fold again',
      left: 'Left',
      up: 'Up',
      foldWord: 'fold',
      emptyFold: 'Locked',
      levelLabel: (n, title) => `Room ${n}: ${title}`,
      lockedLevel: 'Finish the previous room first',
      cellLabel: (column, row, selected) => `${column}${row}${selected ? ', selected' : ''}`,
      room1Kicker: 'ROOM ONE · HALF-FOLD HALL',
      room1Title: 'Where Does One Fold Send the Hole?',
      room1Text: 'The right half folds left. The black dot is the punch.',
      room2Kicker: 'ROOM TWO · FOUR-PANE WINDOW',
      room2Title: 'Which Holes Mirror Each Other?',
      room2Text: 'Fold left, then up. Reverse that order when you open it.',
      room3Kicker: 'ROOM THREE · EIGHT-SIDED LOFT',
      room3Title: 'One More Fold—Which Row Appears?',
      room3Text: 'The small packet folds left again, making eight holes after three reflections.',
      room4Kicker: 'FINAL ROOM · PAPER-BLOOM DOME',
      room4Title: 'Can Four Folds Bloom into Sixteen?',
      room4Text: 'Reverse four creases and let holes bloom across rows and columns.',
      summary1: 'Fold left once',
      summary2: 'Fold left, then up',
      summary3: 'Fold left, up, then left',
      summary4: 'Left, up, left, up: four folds',
      ready: 'Tap every square where you predict a hole.',
      needPick: 'No prediction yet. Tap one square that may hold a hole.',
      tooMany: (count) => `This sheet opens to only ${count} holes. Take back a few picks.`,
      wrong: 'Some holes do not form mirror pairs. Rethink the red picks.',
      correct: 'Perfect prediction! Now drag the strip to unfold the paper.',
      unfolding: 'Creases are opening. Watch where every mirrored hole appears.',
      unfolded: 'Fully open! Every crease copied a reflected set of holes.',
      replayReady: 'You solved this room. You can still predict it again.',
      hint1: 'A crease acts like a mirror. Find a spot equally far across it.',
      hint2: 'Open the last horizontal fold first, then the vertical fold.',
      hint3: 'Three folds double one hole three times: 1 → 2 → 4 → 8.',
      hint4: 'Check the corners: four columns crossed with four rows make 16 spots.',
      rule: 'Opening one fold mirrors every existing hole across that crease.',
      lessonTitle1: 'The First Mirror',
      lesson1: 'Both holes sit the same distance from the vertical crease.',
      lessonTitle2: 'Unfold Backward',
      lesson2: 'The last fold opens first, reflecting the holes one step at a time.',
      lessonTitle3: 'Each Fold Doubles',
      lesson3: 'When no hole lies on a crease, three folds open one hole into eight.',
      lessonTitle4: 'Sixteen-Hole Bloom',
      lesson4: 'Four non-overlapping reflections turn 1 hole into 2⁴ = 16.',
    },
  };

  const LEVELS = [
    {
      code: 'F-01',
      kicker: 'room1Kicker',
      title: 'room1Title',
      text: 'room1Text',
      summary: 'summary1',
      hint: 'hint1',
      lessonTitle: 'lessonTitle1',
      lesson: 'lesson1',
      folds: ['v50'],
      punch: { c: 0, r: 1 },
    },
    {
      code: 'F-02',
      kicker: 'room2Kicker',
      title: 'room2Title',
      text: 'room2Text',
      summary: 'summary2',
      hint: 'hint2',
      lessonTitle: 'lessonTitle2',
      lesson: 'lesson2',
      folds: ['v50', 'h50'],
      punch: { c: 0, r: 0 },
    },
    {
      code: 'F-03',
      kicker: 'room3Kicker',
      title: 'room3Title',
      text: 'room3Text',
      summary: 'summary3',
      hint: 'hint3',
      lessonTitle: 'lessonTitle3',
      lesson: 'lesson3',
      folds: ['v50', 'h50', 'v25'],
      punch: { c: 0, r: 0 },
    },
    {
      code: 'F-04',
      kicker: 'room4Kicker',
      title: 'room4Title',
      text: 'room4Text',
      summary: 'summary4',
      hint: 'hint4',
      lessonTitle: 'lessonTitle4',
      lesson: 'lesson4',
      folds: ['v50', 'h50', 'v25', 'h25'],
      punch: { c: 0, r: 0 },
    },
  ];

  const SAVE_KEY = 'kidslab.punch-origami';
  const SOUND_KEY = 'kidslab.sound.muted';
  const COLUMNS = 'ABCD';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    body: document.body,
    levelNumber: $('#levelNumber'),
    levelKicker: $('#levelKicker'),
    levelTitle: $('#levelTitle'),
    levelText: $('#levelText'),
    levelNav: $('#levelNav'),
    status: $('#status'),
    pickedCount: $('#pickedCount'),
    targetCount: $('#targetCount'),
    canvas: $('#foldCanvas'),
    grid: $('#predictionGrid'),
    unfoldPanel: $('#unfoldPanel'),
    slider: $('#unfoldSlider'),
    unfoldPercent: $('#unfoldPercent'),
    foldSummary: $('#foldSummary'),
    roomCode: $('#roomCode'),
    foldStrip: $('#foldStrip'),
    ruleNote: $('#ruleNote'),
    lesson: $('#lesson'),
    lessonTitle: $('#lessonTitle'),
    lessonText: $('#lessonText'),
    clear: $('#clearBtn'),
    hint: $('#hintBtn'),
    check: $('#checkBtn'),
    next: $('#nextBtn'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
    modal: $('#completeModal'),
    playAgain: $('#playAgainBtn'),
  };

  let t = (key) => key;
  let language = 'zh';
  let levelIndex = 0;
  let unlocked = 0;
  let completed = new Set();
  let selected = new Set();
  let statusMessage = { key: 'ready', tone: '', args: [] };
  let phase = 'predict';
  let unfoldProgress = 0;
  let wrong = new Set();

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(3, Math.max(0, Number(saved.unlocked) || 0));
    completed = new Set(Array.isArray(saved.completed)
      ? saved.completed.filter((value) => Number.isInteger(value) && value >= 0 && value <= 3)
      : []);
    levelIndex = unlocked;
  } catch {
    unlocked = 0;
    completed = new Set();
  }

  class SoundEngine {
    constructor() {
      try {
        this.muted = ['true', '1'].includes(localStorage.getItem(SOUND_KEY));
      } catch {
        this.muted = false;
      }
      this.context = null;
    }

    ensure() {
      if (this.muted) return null;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      try {
        this.context ||= new AudioContextClass();
        if (this.context.state === 'suspended') this.context.resume().catch(() => {});
        return this.context;
      } catch {
        return null;
      }
    }

    setMuted(value) {
      this.muted = value;
      try { localStorage.setItem(SOUND_KEY, String(value)); } catch {}
      if (value && this.context) this.context.suspend().catch(() => {});
    }

    tone(frequency, duration, volume, type = 'triangle', delay = 0) {
      const context = this.ensure();
      if (!context || volume <= 0) return;
      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    }

    pick(on) {
      this.tone(on ? 430 : 280, 0.08, 0.022, on ? 'triangle' : 'sine');
    }

    error() {
      this.tone(180, 0.16, 0.034, 'sawtooth');
      this.tone(130, 0.18, 0.026, 'sawtooth', 0.08);
    }

    success(final = false) {
      [440, 554, 659, final ? 988 : 784].forEach((frequency, index) =>
        this.tone(frequency, final ? 0.32 : 0.2, 0.032, 'sine', index * 0.075));
    }

    paper() {
      this.tone(260, 0.07, 0.016, 'triangle');
      this.tone(340, 0.08, 0.014, 'triangle', 0.05);
    }
  }

  const sound = new SoundEngine();

  function keyOf(point) {
    return `${point.c},${point.r}`;
  }

  function reflect(point, fold) {
    if (fold === 'v50') return { c: 3 - point.c, r: point.r };
    if (fold === 'h50') return { c: point.c, r: 3 - point.r };
    if (fold === 'v25') return { c: 1 - point.c, r: point.r };
    return { c: point.c, r: 1 - point.r };
  }

  function expectedFor(level) {
    let points = [level.punch];
    [...level.folds].reverse().forEach((fold) => {
      points = [...points, ...points.map((point) => reflect(point, fold))];
    });
    return new Set(points.map(keyOf));
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        unlocked,
        completed: [...completed],
      }));
    } catch {}
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function setStatus(key, tone = '', ...args) {
    statusMessage = { key, tone, args };
    el.status.textContent = t(key, ...args);
    el.status.className = `status${tone ? ` ${tone}` : ''}`;
  }

  function buildGrid() {
    el.grid.replaceChildren();
    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        const key = `${column},${row}`;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cell';
        button.dataset.cell = key;
        button.setAttribute('role', 'gridcell');
        button.addEventListener('click', () => toggleCell(key));
        el.grid.append(button);
      }
    }
  }

  function renderGrid() {
    const expected = expectedFor(LEVELS[levelIndex]);
    const revealCount = Math.round(expected.size * (unfoldProgress / 100));
    const revealed = [...expected].sort().slice(0, revealCount);
    [...el.grid.children].forEach((button, index) => {
      const key = button.dataset.cell;
      const column = index % 4;
      const row = Math.floor(index / 4);
      button.classList.toggle('selected', selected.has(key) && phase === 'predict');
      button.classList.toggle('wrong', wrong.has(key) && phase === 'predict');
      button.classList.toggle('revealed', revealed.includes(key) && phase !== 'predict');
      button.disabled = phase !== 'predict';
      button.setAttribute('aria-pressed', String(selected.has(key)));
      button.setAttribute('aria-label', t('cellLabel', COLUMNS[column], row + 1, selected.has(key)));
    });
  }

  function renderNav() {
    el.levelNav.replaceChildren();
    LEVELS.forEach((level, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `level-btn${index === levelIndex ? ' current' : ''}${completed.has(index) ? ' done' : ''}`;
      button.textContent = String(index + 1).padStart(2, '0');
      button.disabled = index > unlocked;
      button.setAttribute('aria-label', index > unlocked
        ? t('lockedLevel')
        : t('levelLabel', index + 1, t(level.title)));
      button.addEventListener('click', () => switchLevel(index));
      el.levelNav.append(button);
    });
  }

  function renderFolds() {
    const level = LEVELS[levelIndex];
    el.foldStrip.replaceChildren();
    for (let index = 0; index < 4; index += 1) {
      const fold = level.folds[index];
      const item = document.createElement('div');
      item.className = `fold-step${fold ? '' : ' empty'}`;
      if (fold) {
        const vertical = fold.startsWith('v');
        item.innerHTML = `<span aria-hidden="true">${vertical ? '←' : '↑'}</span><b>${t(vertical ? 'left' : 'up')}</b>`;
      } else {
        item.innerHTML = `<span aria-hidden="true">·</span><b>${t('emptyFold')}</b>`;
      }
      el.foldStrip.append(item);
    }
  }

  function fitCanvas() {
    const rect = el.canvas.getBoundingClientRect();
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (el.canvas.width !== width || el.canvas.height !== height) {
      el.canvas.width = width;
      el.canvas.height = height;
    }
    return { width, height, ratio };
  }

  function drawPaper() {
    const { width, height, ratio } = fitCanvas();
    const context = el.canvas.getContext('2d');
    const level = LEVELS[levelIndex];
    const progress = unfoldProgress / 100;
    const foldedWidth = level.folds.some((fold) => fold === 'v25') ? 0.25
      : level.folds.some((fold) => fold === 'v50') ? 0.5 : 1;
    const foldedHeight = level.folds.some((fold) => fold === 'h25') ? 0.25
      : level.folds.some((fold) => fold === 'h50') ? 0.5 : 1;
    const openWidth = foldedWidth + (1 - foldedWidth) * progress;
    const openHeight = foldedHeight + (1 - foldedHeight) * progress;
    const size = Math.min(width * 0.82, height * 0.76);
    const paperWidth = size * openWidth;
    const paperHeight = size * openHeight;
    const x = (width - paperWidth) / 2;
    const y = (height - paperHeight) / 2;

    context.clearRect(0, 0, width, height);
    context.save();
    context.shadowColor = cssVar('--shadow');
    context.shadowBlur = 12 * ratio;
    context.shadowOffsetY = 7 * ratio;
    context.fillStyle = cssVar('--paper');
    context.strokeStyle = cssVar('--line');
    context.lineWidth = 2.5 * ratio;
    context.beginPath();
    context.roundRect(x, y, paperWidth, paperHeight, 9 * ratio);
    context.fill();
    context.stroke();
    context.restore();

    context.save();
    context.beginPath();
    context.roundRect(x, y, paperWidth, paperHeight, 9 * ratio);
    context.clip();
    context.strokeStyle = cssVar('--grid');
    context.lineWidth = ratio;
    context.setLineDash([4 * ratio, 4 * ratio]);
    for (let index = 1; index < 4; index += 1) {
      const gx = x + paperWidth * index / 4;
      const gy = y + paperHeight * index / 4;
      context.beginPath();
      context.moveTo(gx, y);
      context.lineTo(gx, y + paperHeight);
      context.stroke();
      context.beginPath();
      context.moveTo(x, gy);
      context.lineTo(x + paperWidth, gy);
      context.stroke();
    }
    context.restore();

    if (progress > 0.04) {
      const points = [...expectedFor(level)].map((key) => {
        const [c, r] = key.split(',').map(Number);
        return { c, r };
      });
      const visible = Math.ceil(points.length * progress);
      points.slice(0, visible).forEach((point, index) => {
        const delay = index / Math.max(1, points.length);
        const bloom = Math.min(1, Math.max(0, (progress - delay * 0.65) / 0.22));
        context.fillStyle = cssVar('--red');
        context.beginPath();
        context.arc(
          x + paperWidth * (point.c + 0.5) / 4,
          y + paperHeight * (point.r + 0.5) / 4,
          Math.max(2 * ratio, size * 0.027 * bloom),
          0,
          Math.PI * 2,
        );
        context.fill();
      });
    } else {
      const point = level.punch;
      context.fillStyle = cssVar('--red');
      context.beginPath();
      context.arc(
        x + paperWidth * (point.c + 0.5) / Math.max(1, 4 * foldedWidth),
        y + paperHeight * (point.r + 0.5) / Math.max(1, 4 * foldedHeight),
        Math.max(4 * ratio, size * 0.045),
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  }

  function renderControls() {
    const level = LEVELS[levelIndex];
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    el.lang.textContent = language === 'zh' ? 'EN' : '中';
    el.theme.textContent = document.documentElement.dataset.theme === 'light' ? '🌙' : '☀️';
    el.theme.setAttribute('aria-label', t('themeLabel'));
    el.sound.textContent = sound.muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', String(sound.muted));
    el.sound.setAttribute('aria-label', sound.muted ? t('soundOn') : t('soundOff'));
    el.levelNav.setAttribute('aria-label', t('roomsLabel'));
    el.grid.setAttribute('aria-label', t('gridLabel'));
    el.canvas.setAttribute('aria-label', t('canvasLabel'));
    el.foldStrip.setAttribute('aria-label', t('foldStepsLabel'));
    el.clear.disabled = phase !== 'predict';
    el.hint.disabled = phase !== 'predict';
    el.check.hidden = phase !== 'predict';
    el.next.hidden = phase !== 'done' || levelIndex === LEVELS.length - 1;
    el.unfoldPanel.hidden = phase === 'predict' || phase === 'done';
    el.lesson.hidden = phase !== 'done';
    el.targetCount.textContent = expectedFor(level).size;
    el.pickedCount.textContent = selected.size;
  }

  function render() {
    const level = LEVELS[levelIndex];
    el.body.dataset.state = phase;
    el.levelNumber.textContent = String(levelIndex + 1).padStart(2, '0');
    el.levelKicker.textContent = t(level.kicker);
    el.levelTitle.textContent = t(level.title);
    el.levelText.textContent = t(level.text);
    el.foldSummary.textContent = t(level.summary);
    el.roomCode.textContent = level.code;
    el.ruleNote.textContent = t('rule');
    el.lessonTitle.textContent = t(level.lessonTitle);
    el.lessonText.textContent = t(level.lesson);
    el.slider.value = String(unfoldProgress);
    el.unfoldPercent.textContent = `${unfoldProgress}%`;
    setStatus(statusMessage.key, statusMessage.tone, ...statusMessage.args);
    renderGrid();
    renderNav();
    renderFolds();
    renderControls();
    drawPaper();
  }

  function toggleCell(key) {
    if (phase !== 'predict') return;
    wrong.clear();
    if (selected.has(key)) selected.delete(key);
    else selected.add(key);
    setStatus(completed.has(levelIndex) ? 'replayReady' : 'ready');
    sound.pick(selected.has(key));
    window.cool?.track?.('predict_hole', { room: levelIndex + 1, selected: selected.has(key) });
    render();
  }

  function clearPrediction() {
    if (phase !== 'predict') return;
    selected.clear();
    wrong.clear();
    setStatus('ready');
    sound.paper();
    render();
  }

  function checkPrediction() {
    if (phase !== 'predict') return;
    const expected = expectedFor(LEVELS[levelIndex]);
    if (!selected.size) {
      setStatus('needPick', 'bad');
      sound.error();
      return;
    }
    if (selected.size > expected.size) {
      setStatus('tooMany', 'bad', expected.size);
      sound.error();
      return;
    }
    const correct = selected.size === expected.size && [...selected].every((key) => expected.has(key));
    if (!correct) {
      wrong = new Set([...selected].filter((key) => !expected.has(key)));
      if (!wrong.size) wrong = new Set(selected);
      setStatus('wrong', 'bad');
      sound.error();
      window.cool?.track?.('check_prediction', { room: levelIndex + 1, correct: false });
      render();
      return;
    }
    phase = 'unfold';
    wrong.clear();
    unfoldProgress = 0;
    setStatus('correct', 'good');
    sound.success();
    window.cool?.track?.('check_prediction', { room: levelIndex + 1, correct: true });
    render();
    el.slider.focus();
  }

  function finishLevel() {
    if (phase === 'done') return;
    phase = 'done';
    unfoldProgress = 100;
    completed.add(levelIndex);
    unlocked = Math.max(unlocked, Math.min(LEVELS.length - 1, levelIndex + 1));
    save();
    setStatus('unfolded', 'good');
    sound.success(levelIndex === LEVELS.length - 1);
    window.cool?.stage?.(`fold-room-${levelIndex + 1}`);
    window.cool?.track?.('unfold_paper', { room: levelIndex + 1, holes: expectedFor(LEVELS[levelIndex]).size });
    if (levelIndex === LEVELS.length - 1) {
      window.cool?.complete?.();
      setTimeout(() => {
        el.modal.hidden = false;
        el.playAgain.focus();
      }, 260);
    }
    render();
  }

  function switchLevel(index) {
    if (index > unlocked) return;
    levelIndex = index;
    selected = new Set();
    wrong = new Set();
    phase = 'predict';
    unfoldProgress = 0;
    statusMessage = { key: completed.has(index) ? 'replayReady' : 'ready', tone: '', args: [] };
    sound.paper();
    window.cool?.stage?.(`fold-room-${index + 1}`);
    render();
  }

  el.clear.addEventListener('click', clearPrediction);
  el.hint.addEventListener('click', () => {
    if (phase !== 'predict') return;
    sound.paper();
    setStatus(LEVELS[levelIndex].hint);
  });
  el.check.addEventListener('click', checkPrediction);
  el.next.addEventListener('click', () => switchLevel(Math.min(LEVELS.length - 1, levelIndex + 1)));
  el.slider.addEventListener('pointerdown', () => sound.paper());
  el.slider.addEventListener('input', () => {
    unfoldProgress = Number(el.slider.value);
    setStatus(unfoldProgress === 100 ? 'unfolded' : 'unfolding', unfoldProgress === 100 ? 'good' : '');
    renderGrid();
    drawPaper();
    el.unfoldPercent.textContent = `${unfoldProgress}%`;
    el.status.textContent = t(statusMessage.key, ...statusMessage.args);
    if (unfoldProgress === 100) finishLevel();
  });
  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    renderControls();
    if (!sound.muted) sound.pick(true);
  });
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.playAgain.addEventListener('click', () => {
    el.modal.hidden = true;
    switchLevel(0);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && sound.context?.state === 'running') sound.context.suspend().catch(() => {});
  });
  window.addEventListener('resize', drawPaper);
  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang }) {
      t = translate;
      language = lang;
      render();
    },
  });

  buildGrid();
  render();
})();
