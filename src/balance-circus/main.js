(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '平衡马戏团 · KidsLab',
      back: '返回平台',
      title: '平衡马戏团',
      act: '场次',
      live: '正在演出',
      sneakLeft: '只动左边',
      sneakRight: '只动右边',
      nowOnStage: '台上现在',
      oneRule: '唯一规则',
      bothSides: '两边做同一件事',
      yourMoves: '你的解题动作',
      resetAct: '重演本场',
      hint: '递个提示',
      nextAct: '下一场',
      finalKicker: '三场平衡绝技完成',
      finalTitle: '蒙面演员揭面了！',
      finalText: '你刚才不是在搬演员，而是在用等式性质解方程。每一步都能写成数学！',
      playAgain: '再演一次',
      canvasLabel: '显示等式两边重量的马戏团跷跷板',
      navLabel: '表演场次',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      theme: '切换主题',
      emptyHistory: '第一步还没上场……',
      operationConstant: (n) => `两边都撤 ${n}`,
      operationX: '两边都撤 1 个 x',
      operationDivide: (n) => `两边都分成 ${n} 份`,
      operationStep: (label, equation) => `${label} → ${equation}`,
      solved: (value) => `稳稳水平！蒙面演员 x 重 ${value} kg。`,
      invalid: '这一步现在搬不动。看看两边还有没有同样的演员。',
      sneakFail: '哎呀！只动一边，演员全滚下来了——原题还在，再试一次。',
      hintText: [
        '先把两位 10 kg 小丑同时从左右两边请下场。',
        '两边都有一个 x，先同时请走它；再处理 3 kg 道具。',
        '先撤走同样的常数道具，再把两边平均分成 3 份。顺序反过来也能保持平衡！',
      ],
      acts: [
        {
          kicker: '开场 · 蒙面新星',
          title: '让 x 独自站稳',
          prompt: '两边必须同时撤走一样重的演员。',
          status: '点击「两边都撤 10」，看看跷跷板会不会保持水平。',
        },
        {
          kicker: '加演 · 双胞胎谜局',
          title: 'x 出现在跷跷板两边',
          prompt: '同样的蒙面演员，也能从两边一起请走。',
          status: '先找两边都有的东西。等量撤走，平衡不会被破坏。',
        },
        {
          kicker: '压轴 · 三人飞台',
          title: '把 3 个 x 平均拆开',
          prompt: '撤道具或平均分组，都必须同时照顾两边。',
          status: '最后一场：让 3 个蒙面演员各自得到相同重量。',
        },
      ],
    },
    en: {
      doc: 'Balance Circus · KidsLab',
      back: 'Back to platform',
      title: 'Balance Circus',
      act: 'ACT',
      live: 'Live',
      sneakLeft: 'Touch left only',
      sneakRight: 'Touch right only',
      nowOnStage: 'On stage',
      oneRule: 'ONE RULE',
      bothSides: 'Do the same to both sides',
      yourMoves: 'Your equation moves',
      resetAct: 'Restart act',
      hint: 'Give me a hint',
      nextAct: 'Next act',
      finalKicker: 'ALL THREE BALANCE ACTS COMPLETE',
      finalTitle: 'The masked star is revealed!',
      finalText: 'You were not merely moving performers—you were solving equations with the properties of equality. Every move can be written as math!',
      playAgain: 'Perform again',
      canvasLabel: 'A circus seesaw showing the weight on both sides of an equation',
      navLabel: 'Circus acts',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      theme: 'Switch theme',
      emptyHistory: 'Your first move is waiting in the wings…',
      operationConstant: (n) => `Remove ${n} from both`,
      operationX: 'Remove 1 x from both',
      operationDivide: (n) => `Split both sides into ${n}`,
      operationStep: (label, equation) => `${label} → ${equation}`,
      solved: (value) => `Perfectly balanced! The masked x weighs ${value} kg.`,
      invalid: 'That move cannot happen now. Check whether both sides still share that performer.',
      sneakFail: 'Whoops! Touching one side sent everyone tumbling—the equation is safe, so try again.',
      hintText: [
        'Invite one 10 kg clown off each side, twice.',
        'Both sides have an x. Remove that pair first, then handle the 3 kg prop.',
        'Remove matching number props, then split both sides into 3 equal groups. Reversing that order also keeps the balance!',
      ],
      acts: [
        {
          kicker: 'OPENING · THE MASKED STAR',
          title: 'Leave x standing alone',
          prompt: 'Both sides must always lose the same weight.',
          status: 'Choose “Remove 10 from both” and watch whether the seesaw stays level.',
        },
        {
          kicker: 'ENCORE · THE TWIN RIDDLE',
          title: 'x appears on both sides',
          prompt: 'Matching masked performers can leave both sides together.',
          status: 'Find what both sides share. Removing equal amounts preserves the balance.',
        },
        {
          kicker: 'FINALE · THE TRIPLE FLYER',
          title: 'Split 3 x performers evenly',
          prompt: 'Removing props or making groups must happen equally on both sides.',
          status: 'Final act: find the equal share for each of the 3 masked performers.',
        },
      ],
    },
  };

  const LEVELS = [
    {
      left: { x: 1, c: 20 },
      right: { x: 0, c: 38 },
      operations: [{ type: 'constant', amount: 10 }],
      answer: 18,
    },
    {
      left: { x: 2, c: 3 },
      right: { x: 1, c: 8 },
      operations: [{ type: 'x' }, { type: 'constant', amount: 3 }],
      answer: 5,
    },
    {
      left: { x: 3, c: 6 },
      right: { x: 0, c: 30 },
      operations: [{ type: 'constant', amount: 'left' }, { type: 'divide', amount: 3 }],
      answer: 8,
    },
  ];

  const STORAGE_KEY = 'kidslab.balance-circus';
  const SOUND_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const cloneSide = (side) => ({ x: side.x, c: side.c });
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const elements = {
    course: $('.course'),
    canvas: $('#circusCanvas'),
    wrap: $('#canvasWrap'),
    actNumber: $('#actNumber'),
    actKicker: $('#actKicker'),
    actTitle: $('#actTitle'),
    actPrompt: $('#actPrompt'),
    actNav: $('#actNav'),
    status: $('#status'),
    equation: $('#equation'),
    operationList: $('#operationList'),
    historyList: $('#historyList'),
    hintBtn: $('#hintBtn'),
    resetBtn: $('#resetBtn'),
    nextBtn: $('#nextBtn'),
    soundBtn: $('#soundBtn'),
    themeBtn: $('#themeBtn'),
    langBtn: $('#langBtn'),
    finale: $('#finale'),
    finalEquations: $('#finalEquations'),
    revealWeight: $('#revealWeight'),
    playAgainBtn: $('#playAgainBtn'),
  };

  let t = (key) => key;
  let lang = 'zh';
  let audioContext = null;
  let muted = false;
  let frame = 0;
  let tilt = 0;
  let tumble = 0;
  let celebration = 0;
  let state = loadState();

  function freshLevel(index) {
    const level = LEVELS[index];
    return {
      level: index,
      left: cloneSide(level.left),
      right: cloneSide(level.right),
      steps: [],
      solved: false,
      completed: false,
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || !Number.isInteger(saved.level) || saved.level < 0 || saved.level >= LEVELS.length) {
        return freshLevel(0);
      }
      const validSide = (side) => side && Number.isFinite(side.x) && Number.isFinite(side.c);
      if (!validSide(saved.left) || !validSide(saved.right) || !Array.isArray(saved.steps)) return freshLevel(saved.level);
      return {
        level: saved.level,
        left: cloneSide(saved.left),
        right: cloneSide(saved.right),
        steps: saved.steps.filter((step) =>
          step && ['constant', 'x', 'divide'].includes(step.type) &&
          Number.isFinite(step.amount) && typeof step.equation === 'string').slice(0, 10),
        solved: Boolean(saved.solved),
        completed: Boolean(saved.completed),
      };
    } catch {
      return freshLevel(0);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage may be unavailable; the game remains fully playable.
    }
  }

  function expression(side, html = false) {
    const parts = [];
    if (side.x) {
      const coefficient = side.x === 1 ? '' : side.x;
      parts.push(html ? `<span class="x">${coefficient}x</span>` : `${coefficient}x`);
    }
    if (side.c || parts.length === 0) {
      const value = Math.abs(side.c);
      if (parts.length && side.c >= 0) parts.push(`+ ${value}`);
      else if (parts.length) parts.push(`− ${value}`);
      else parts.push(String(side.c));
    }
    return parts.join(' ');
  }

  function equationText(left = state.left, right = state.right, html = false) {
    const equals = html ? '<span class="equals">=</span>' : '=';
    return `${expression(left, html)} ${equals} ${expression(right, html)}`;
  }

  function currentConstantAmount(operation) {
    if (operation.amount !== 'left') return operation.amount;
    const amount = Math.abs(state.left.c);
    return amount || Math.abs(state.right.c);
  }

  function operationLabel(operation) {
    if (operation.type === 'x') return t('operationX');
    if (operation.type === 'divide') return t('operationDivide', operation.amount);
    return t('operationConstant', currentConstantAmount(operation));
  }

  function canApply(operation) {
    if (state.solved || tumble > 0) return false;
    if (operation.type === 'x') return state.left.x >= 1 && state.right.x >= 1;
    if (operation.type === 'constant') {
      const amount = currentConstantAmount(operation);
      return amount > 0 && state.left.c >= amount && state.right.c >= amount;
    }
    return [state.left.x, state.left.c, state.right.x, state.right.c]
      .every((value) => Number.isInteger(value / operation.amount));
  }

  function applyOperation(operation) {
    ensureAudio();
    if (!canApply(operation)) {
      elements.status.textContent = t('invalid');
      playSound('error');
      return;
    }

    const label = operationLabel(operation);
    const appliedAmount = operation.type === 'constant'
      ? currentConstantAmount(operation)
      : operation.amount || 1;
    if (operation.type === 'x') {
      state.left.x -= 1;
      state.right.x -= 1;
    } else if (operation.type === 'constant') {
      const amount = currentConstantAmount(operation);
      state.left.c -= amount;
      state.right.c -= amount;
    } else {
      state.left.x /= operation.amount;
      state.left.c /= operation.amount;
      state.right.x /= operation.amount;
      state.right.c /= operation.amount;
    }

    state.steps.push({
      type: operation.type,
      amount: appliedAmount,
      equation: equationText(),
    });
    playSound('move');
    window.cool?.track?.('balance_both_sides', {
      act: state.level + 1,
      operation: operation.type,
    });
    checkSolved();
    saveState();
    render();
  }

  function checkSolved() {
    const isolatedLeft = state.left.x === 1 && state.left.c === 0 && state.right.x === 0;
    const isolatedRight = state.right.x === 1 && state.right.c === 0 && state.left.x === 0;
    if (!isolatedLeft && !isolatedRight) return;
    const value = isolatedLeft ? state.right.c : state.left.c;
    if (value !== LEVELS[state.level].answer) return;
    state.solved = true;
    celebration = performance.now();
    elements.status.textContent = t('solved', value);
    playSound('success');
    window.cool?.stage?.(`act${state.level + 1}`);
  }

  function sneak(side) {
    if (tumble > 0 || state.solved) return;
    ensureAudio();
    tilt = side === 'left' ? -1 : 1;
    tumble = 1;
    elements.status.textContent = t('sneakFail');
    playSound('error');
    window.cool?.track?.('tip_one_side', { act: state.level + 1, side });
    setTimeout(() => {
      tilt = 0;
      tumble = 0;
      draw();
    }, 1050);
  }

  function resetLevel() {
    state = freshLevel(state.level);
    tilt = 0;
    tumble = 0;
    celebration = 0;
    saveState();
    render();
    playSound('reset');
  }

  function nextLevel() {
    if (!state.solved) return;
    if (state.level < LEVELS.length - 1) {
      state = freshLevel(state.level + 1);
      celebration = 0;
      saveState();
      render();
      playSound('move');
      return;
    }
    state.completed = true;
    saveState();
    window.cool?.complete?.();
    playSound('finale');
    showFinale();
  }

  function showFinale() {
    state.completed = true;
    elements.revealWeight.textContent = `${LEVELS.at(-1).answer} kg`;
    elements.finalEquations.innerHTML = LEVELS.map((level) =>
      `<span>${expression(level.left)} = ${expression(level.right)} → x = ${level.answer}</span>`).join('');
    elements.finale.hidden = false;
    elements.course.inert = true;
    requestAnimationFrame(() => elements.playAgainBtn.focus());
  }

  function hideFinale() {
    elements.finale.hidden = true;
    elements.course.inert = false;
  }

  function playAgain() {
    hideFinale();
    state = freshLevel(0);
    saveState();
    render();
  }

  function render() {
    const copy = t('acts')[state.level];
    document.title = t('doc');
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    elements.actNumber.textContent = state.level + 1;
    elements.actKicker.textContent = copy.kicker;
    elements.actTitle.textContent = copy.title;
    elements.actPrompt.textContent = copy.prompt;
    if (!state.solved && tumble === 0) elements.status.textContent = copy.status;
    if (state.solved) elements.status.textContent = t('solved', LEVELS[state.level].answer);
    elements.equation.innerHTML = equationText(state.left, state.right, true);
    elements.canvas.setAttribute('aria-label', t('canvasLabel'));
    elements.actNav.setAttribute('aria-label', t('navLabel'));
    elements.soundBtn.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
    elements.soundBtn.setAttribute('aria-pressed', String(muted));
    elements.soundBtn.textContent = muted ? '🔇' : '🔊';
    elements.themeBtn.setAttribute('aria-label', t('theme'));

    elements.actNav.innerHTML = LEVELS.map((_, index) => {
      const className = index < state.level || state.completed
        ? 'is-done'
        : index === state.level ? 'is-current' : '';
      return `<span class="${className}">${index < state.level || state.completed ? '✓' : index + 1}</span>`;
    }).join('');

    elements.operationList.innerHTML = LEVELS[state.level].operations.map((operation, index) =>
      `<button class="operation" type="button" data-operation="${index}" ${canApply(operation) ? '' : 'disabled'}>${operationLabel(operation)}</button>`).join('');

    elements.historyList.innerHTML = state.steps.length
      ? state.steps.map((step) =>
          `<li>${t('operationStep', operationLabel(step), step.equation)}</li>`).join('')
      : `<li class="empty">${t('emptyHistory')}</li>`;
    elements.nextBtn.hidden = !state.solved;
    elements.nextBtn.querySelector('[data-t]').textContent = state.level === LEVELS.length - 1
      ? t('finalTitle')
      : t('nextAct');
    elements.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    elements.themeBtn.textContent = document.documentElement.dataset.theme === 'light' ? '🌙' : '☀️';
    draw();
  }

  function ensureAudio() {
    if (muted) return null;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      return audioContext;
    } catch {
      return null;
    }
  }

  function tone(frequency, start, duration, type = 'sine', volume = 0.045) {
    const context = ensureAudio();
    if (!context || muted) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + start);
    gain.gain.setValueAtTime(0.0001, context.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(context.currentTime + start);
    oscillator.stop(context.currentTime + start + duration + 0.02);
  }

  function playSound(kind) {
    if (muted) return;
    const sounds = {
      move: [[330, 0, 0.1, 'triangle'], [440, 0.08, 0.12, 'triangle']],
      success: [[523, 0, 0.12, 'sine'], [659, 0.12, 0.12, 'sine'], [784, 0.24, 0.2, 'sine']],
      error: [[170, 0, 0.18, 'sawtooth'], [125, 0.12, 0.25, 'sawtooth']],
      reset: [[390, 0, 0.1, 'triangle']],
      finale: [[523, 0, 0.15, 'triangle'], [659, 0.13, 0.15, 'triangle'], [784, 0.26, 0.15, 'triangle'], [1047, 0.39, 0.35, 'sine']],
    };
    (sounds[kind] || []).forEach(([frequency, start, duration, type]) =>
      tone(frequency, start, duration, type));
  }

  function toggleSound() {
    muted = !muted;
    try {
      localStorage.setItem(SOUND_KEY, muted ? '1' : '0');
    } catch {
      // Preference persistence is optional when storage is unavailable.
    }
    if (muted && audioContext) audioContext.suspend().catch(() => {});
    else {
      ensureAudio();
      playSound('move');
    }
    render();
  }

  function resizeCanvas() {
    const rect = elements.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (elements.canvas.width !== width || elements.canvas.height !== height) {
      elements.canvas.width = width;
      elements.canvas.height = height;
    }
    draw();
  }

  function roundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
  }

  function drawPerformer(context, x, y, scale, masked, label, falling = 0) {
    context.save();
    context.translate(x, y + falling * 42);
    context.rotate(falling * (x % 2 ? 0.65 : -0.65));
    context.scale(scale, scale);
    context.shadowColor = '#0008';
    context.shadowBlur = 8;
    context.shadowOffsetY = 5;
    context.fillStyle = masked ? cssVar('--red') : cssVar('--gold');
    context.beginPath();
    context.arc(0, -23, 13, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = masked ? '#f5d047' : '#ef5b4c';
    context.fillRect(-12, -30, 24, 8);
    context.fillStyle = masked ? '#28162d' : '#305d78';
    context.beginPath();
    context.moveTo(-17, -10);
    context.lineTo(17, -10);
    context.lineTo(12, 22);
    context.lineTo(-12, 22);
    context.closePath();
    context.fill();
    context.strokeStyle = '#f7d5b1';
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(-10, 18);
    context.lineTo(-13, 35);
    context.moveTo(10, 18);
    context.lineTo(13, 35);
    context.stroke();
    context.shadowColor = 'transparent';
    context.fillStyle = '#fff9e9';
    context.font = '900 15px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, 0, masked ? -22 : -23);
    context.restore();
  }

  function drawSide(context, side, centerX, panY, panWidth, falling) {
    const performers = [];
    const shownX = Math.min(side.x, 3);
    for (let index = 0; index < shownX; index += 1) performers.push({ masked: true, label: 'x' });
    if (side.c !== 0 || performers.length === 0) performers.push({ masked: false, label: String(side.c) });
    const spacing = Math.min(62, panWidth / Math.max(performers.length, 1));
    performers.forEach((performer, index) => {
      const offset = (index - (performers.length - 1) / 2) * spacing;
      drawPerformer(context, centerX + offset, panY - 36, 0.82, performer.masked, performer.label, falling);
    });
  }

  function draw() {
    const context = elements.canvas.getContext('2d');
    if (!context) return;
    const width = elements.canvas.width;
    const height = elements.canvas.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = width / dpr;
    const h = height / dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, w, h);

    const gradient = context.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, cssVar('--stage'));
    gradient.addColorStop(1, cssVar('--stage-deep'));
    context.fillStyle = gradient;
    context.fillRect(0, 0, w, h);

    context.fillStyle = cssVar('--gold');
    for (let index = 0; index < 24; index += 1) {
      const x = (index * 97 + 31) % Math.max(w, 1);
      const y = (index * 53 + 17) % Math.max(h * 0.55, 1);
      context.globalAlpha = 0.14 + (index % 3) * 0.07;
      context.beginPath();
      context.arc(x, y, 1.2 + (index % 2), 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;

    const centerX = w / 2;
    const beamY = h * 0.64;
    const beamWidth = Math.min(w * 0.78, 610);
    const panWidth = beamWidth * 0.36;
    const angle = tilt * 0.17;
    const leftX = centerX - beamWidth * 0.33;
    const rightX = centerX + beamWidth * 0.33;
    const leftY = beamY + Math.sin(angle) * beamWidth * 0.33;
    const rightY = beamY - Math.sin(angle) * beamWidth * 0.33;

    context.save();
    context.translate(centerX, beamY);
    context.rotate(-angle);
    context.fillStyle = cssVar('--gold');
    context.shadowColor = '#0009';
    context.shadowBlur = 12;
    roundedRect(context, -beamWidth / 2, -9, beamWidth, 18, 8);
    context.fill();
    context.restore();

    context.fillStyle = cssVar('--blue');
    context.beginPath();
    context.moveTo(centerX, beamY - 4);
    context.lineTo(centerX - 42, h - 34);
    context.lineTo(centerX + 42, h - 34);
    context.closePath();
    context.fill();
    context.fillStyle = cssVar('--gold');
    context.beginPath();
    context.arc(centerX, beamY, 12, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = '#d9b887';
    context.lineWidth = 3;
    [[leftX, leftY], [rightX, rightY]].forEach(([x, y]) => {
      context.beginPath();
      context.moveTo(x - panWidth / 2, y - 6);
      context.lineTo(x - panWidth * 0.38, y + 25);
      context.moveTo(x + panWidth / 2, y - 6);
      context.lineTo(x + panWidth * 0.38, y + 25);
      context.stroke();
      context.fillStyle = cssVar('--curtain');
      roundedRect(context, x - panWidth / 2, y + 20, panWidth, 13, 7);
      context.fill();
    });

    const falling = tumble ? Math.min(1, tumble + ((performance.now() / 500) % 1)) : 0;
    drawSide(context, state.left, leftX, leftY + 18, panWidth, falling);
    drawSide(context, state.right, rightX, rightY + 18, panWidth, falling);

    context.fillStyle = '#fff7db';
    context.font = `900 ${Math.max(16, Math.min(22, w / 25))}px ${cssVar('--font')}`;
    context.textAlign = 'center';
    context.fillText(expression(state.left), leftX, Math.max(28, leftY - 82));
    context.fillText(expression(state.right), rightX, Math.max(28, rightY - 82));

    const celebrating = celebration > 0 && performance.now() - celebration < 2600;
    if (celebrating) {
      const time = performance.now() / 700;
      for (let index = 0; index < 34; index += 1) {
        const x = (index * 83 + time * (20 + index % 5)) % w;
        const y = (index * 41 + time * 35) % h;
        context.fillStyle = index % 2 ? cssVar('--gold') : cssVar('--red');
        context.fillRect(x, y, 5, 9);
      }
    }

    if (!celebrating && celebration > 0) celebration = 0;
    if (tumble > 0 || celebrating) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    }
  }

  elements.operationList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-operation]');
    if (!button) return;
    applyOperation(LEVELS[state.level].operations[Number(button.dataset.operation)]);
  });
  document.querySelectorAll('.sneak').forEach((button) =>
    button.addEventListener('click', () => sneak(button.dataset.side)));
  elements.resetBtn.addEventListener('click', resetLevel);
  elements.hintBtn.addEventListener('click', () => {
    elements.status.textContent = t('hintText')[state.level];
    playSound('move');
  });
  elements.nextBtn.addEventListener('click', nextLevel);
  elements.playAgainBtn.addEventListener('click', playAgain);
  elements.soundBtn.addEventListener('click', toggleSound);
  elements.langBtn.addEventListener('click', () => window.cool.preferences.toggleLang());
  elements.themeBtn.addEventListener('click', () => window.cool.preferences.toggleTheme());
  addEventListener('resize', resizeCanvas);
  addEventListener('themechange', resizeCanvas);

  try {
    muted = localStorage.getItem(SOUND_KEY) === '1';
  } catch {
    muted = false;
  }

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang: nextLang }) {
      t = translate;
      lang = nextLang;
      render();
      resizeCanvas();
      if (state.completed) showFinale();
    },
  });
})();
