(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '上下世界 · KidsLab',
      back: '返回平台',
      title: '上下世界',
      mission: '航程',
      seaLevel: '海平面',
      current: '现在位置',
      journey: '本次变化',
      console: '升降艇控制台',
      target: '目标',
      hint: '给我一点提示',
      arrive: '确认停靠',
      check: '确认答案',
      next: '下一层世界',
      finish: '潜入终点',
      reset: '回到本关起点',
      playAgain: '再航行一次',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      theme: '切换主题',
      navLabel: '航程进度',
      canvasLabel: '从负数到正数的竖直数轴世界',
      deepMoment: '海平面变成头顶的一线光',
      skinLabels: ['海空连通', '寒潮观测', '云端账房'],
      controlTitles: ['每次移动几格？', '哪一处温度更高？', '结账后停在哪里？'],
      rules: [
        '0 是海平面。向上数会变大，向下数会变小。',
        '温度计也是数轴：位置越高，温度越高。',
        '收入是向上，支出是向下。支出 12 元就是加上 −12。',
      ],
      positions: [
        { start: '章鱼家', target: '鸟巢' },
        { start: '冰洞', target: '较暖的观测站' },
        { start: '现有余额', target: '结账余额' },
      ],
      lessons: [
        {
          kicker: '跨海接送 · 先找到零',
          title: '从章鱼家升到鸟巢',
          prompt: '章鱼住在 −3，鸟巢在 +5。驾驶升降艇准确停靠。',
          start: '先向上越过 0 海平面，再停在 +5。',
        },
        {
          kicker: '寒潮巡检 · 负数也能比',
          title: '−2°C 和 −7°C，哪里更暖？',
          prompt: '温度计越往上越暖。选出位置更高的观测站。',
          start: '两个温度都在 0 以下，但离 0 更近的那个位置更高。',
        },
        {
          kicker: '云端账房 · 收支会跨零',
          title: '有 7 元，支出 12 元',
          prompt: '账本从 +7 出发，向下走 12 格。最后余额是多少？',
          start: '支出 12 元就是从 +7 向下 12 格，可能会越过 0。',
        },
      ],
      targetValues: ['+5', '较暖', '7 + (−12)'],
      answerLabels: [
        ['−2°C', '−7°C'],
        ['−5 元', '+5 元', '+19 元'],
      ],
      answerSubs: [
        ['离 0 更近', '离 0 更远'],
        ['欠 5 元', '还剩 5 元', '收入变多'],
      ],
      chooseFirst: ['先移动升降艇，再确认是否停准。', '先选一个观测站。', '先选一个结账结果。'],
      selected: [
        (value) => `升降艇现在停在 ${value}。目标是 +5，再看一眼数轴。`,
        (value) => `你选择了 ${value}。想想它在温度计的上面还是下面。`,
        (value) => `账房机显示 ${value}。检查从 +7 向下 12 格会不会停在这里。`,
      ],
      wrong: [
        (value) => `还差一点：现在是 ${value}，鸟巢在 +5。升降艇没有重置，可以继续移动。`,
        '−7 在 −2 的下面，所以更冷。保留题目，换一个观测站就好。',
        '支出会让余额向下走，不会向上增加。题目还在，可以重新选择。',
      ],
      correct: [
        '精准停靠！从 −3 到 +5 共上升 8 格，因为 5 − (−3) = 8。',
        '找到了！−2 在 −7 上方，所以 −2 > −7，也更暖。',
        '账本结清！7 + (−12) = −5，表示还欠 5 元。',
      ],
      hints: [
        '先到 0 要上升 3 格，再从 0 到 +5 要上升 5 格。',
        '把两个温度放在数轴上：越靠近 0、越在上面的数越大。',
        '先用 7 元抵掉 7 元支出，还剩 5 元支出没有付。',
      ],
      finalKicker: '海拔、温度、账本全部贯通',
      finalTitle: '你拿到了“零点领航员”徽章！',
      finalText: '负数不是奇怪的暗号：它只是 0 的另一边。沿着数轴向上变大、向下变小，跨过 0 也照样能计算。',
    },
    en: {
      doc: 'The Up-Down World · KidsLab',
      back: 'Back to platform',
      title: 'The Up-Down World',
      mission: 'TRIP',
      seaLevel: 'SEA LEVEL',
      current: 'CURRENT STOP',
      journey: 'CHANGE',
      console: 'LIFT-CRAFT CONSOLE',
      target: 'TARGET',
      hint: 'Give me a hint',
      arrive: 'Confirm stop',
      check: 'Check answer',
      next: 'Next world',
      finish: 'Dive to the finish',
      reset: 'Back to this start',
      playAgain: 'Sail again',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      theme: 'Switch theme',
      navLabel: 'Trip progress',
      canvasLabel: 'A vertical number-line world from negative to positive numbers',
      deepMoment: 'Sea level becomes a thin line of light far above',
      skinLabels: ['SKY–SEA LINK', 'COLD WATCH', 'CLOUD LEDGER'],
      controlTitles: ['How far each move?', 'Which station is warmer?', 'Where does the balance land?'],
      rules: [
        'Sea level is 0. Moving up makes numbers larger; moving down makes them smaller.',
        'A thermometer is a number line too: higher positions mean higher temperatures.',
        'Income moves up and spending moves down. Spending 12 means adding −12.',
      ],
      positions: [
        { start: 'Octopus home', target: 'Bird nest' },
        { start: 'Ice cave', target: 'Warmer station' },
        { start: 'Starting balance', target: 'Closing balance' },
      ],
      lessons: [
        {
          kicker: 'CROSS-SEA DELIVERY · FIND ZERO',
          title: 'Rise from the octopus to the nest',
          prompt: 'The octopus lives at −3 and the nest is at +5. Dock the lift-craft exactly.',
          start: 'Cross sea level at 0, then stop at +5.',
        },
        {
          kicker: 'COLD WATCH · COMPARE NEGATIVES',
          title: 'Which is warmer: −2°C or −7°C?',
          prompt: 'Higher on a thermometer means warmer. Choose the higher station.',
          start: 'Both are below zero, but the value closer to 0 sits higher.',
        },
        {
          kicker: 'CLOUD LEDGER · CROSS ZERO',
          title: 'You have 7 coins and spend 12',
          prompt: 'Start at +7 and travel 12 steps down. What is the new balance?',
          start: 'Spending 12 moves 12 steps down from +7, crossing 0.',
        },
      ],
      targetValues: ['+5', 'WARMER', '7 + (−12)'],
      answerLabels: [
        ['−2°C', '−7°C'],
        ['−5 coins', '+5 coins', '+19 coins'],
      ],
      answerSubs: [
        ['Closer to 0', 'Farther from 0'],
        ['Owe 5', 'Keep 5', 'Balance grows'],
      ],
      chooseFirst: ['Move the lift-craft before confirming the stop.', 'Choose a weather station first.', 'Choose a closing balance first.'],
      selected: [
        (value) => `The lift-craft is at ${value}. The target is +5—check the number line.`,
        (value) => `You chose ${value}. Is it higher or lower on the thermometer?`,
        (value) => `The ledger shows ${value}. Check where 12 steps down from +7 should land.`,
      ],
      wrong: [
        (value) => `Not there yet: you are at ${value} and the nest is at +5. The craft stays put so you can adjust.`,
        '−7 sits below −2, so it is colder. The question stays in place—choose again.',
        'Spending moves the balance down, not up. The question stays in place—choose again.',
      ],
      correct: [
        'Perfect dock! From −3 to +5 is 8 steps because 5 − (−3) = 8.',
        'Found it! −2 is above −7, so −2 > −7 and it is warmer.',
        'Ledger balanced! 7 + (−12) = −5, meaning you owe 5.',
      ],
      hints: [
        'It takes 3 steps to reach 0, then 5 more steps to reach +5.',
        'Place both temperatures on a number line: the one closer to 0 is higher and larger.',
        'Use 7 coins against 7 of the spending. There are still 5 coins left to pay.',
      ],
      finalKicker: 'ALTITUDE, TEMPERATURE, AND LEDGERS CONNECTED',
      finalTitle: 'You earned the Zero-Point Navigator badge!',
      finalText: 'Negative numbers are simply on the other side of 0. Up is larger, down is smaller, and calculations still work when you cross zero.',
    },
  };

  const MISSIONS = [
    { mode: 'move', skin: 'world', start: -3, target: 5, min: -10, max: 10 },
    { mode: 'answer', skin: 'temperature', start: -7, target: -2, options: [-2, -7], correct: 0, min: -10, max: 10 },
    { mode: 'answer', skin: 'ledger', start: 7, target: -5, options: [-5, 5, 19], correct: 0, min: -10, max: 10 },
  ];

  const STORAGE_KEY = 'kidslab.updown-world';
  const SOUND_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);

  const elements = {
    course: $('#course'),
    shaft: $('#shaft'),
    canvas: $('#worldCanvas'),
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionPrompt: $('#missionPrompt'),
    missionNav: $('#missionNav'),
    status: $('#status'),
    skinLabel: $('#skinLabel'),
    currentValue: $('#currentValue'),
    positionName: $('#positionName'),
    journeyValue: $('#journeyValue'),
    equation: $('#equation'),
    numberStrip: $('#numberStrip'),
    deepFlash: $('#deepFlash'),
    controlTitle: $('#controlTitle'),
    ruleIcon: $('#ruleIcon'),
    ruleText: $('#ruleText'),
    moveControls: $('#moveControls'),
    answerControls: $('#answerControls'),
    targetValue: $('#targetValue'),
    targetLabel: $('#targetLabel'),
    hintBtn: $('#hintBtn'),
    checkBtn: $('#checkBtn'),
    nextBtn: $('#nextBtn'),
    resetBtn: $('#resetBtn'),
    soundBtn: $('#soundBtn'),
    themeBtn: $('#themeBtn'),
    langBtn: $('#langBtn'),
    finale: $('#finale'),
    playAgainBtn: $('#playAgainBtn'),
  };

  let t = (key) => key;
  let lang = 'zh';
  let muted = false;
  let audioContext = null;
  let animationFrame = 0;
  let visualValue = -3;
  let deepTimer = null;
  let state = loadState();

  function freshState() {
    return { mission: 0, value: MISSIONS[0].start, selected: null, solved: false, completed: false, feedback: 'start' };
  }

  function loadState() {
    const fallback = freshState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || !Number.isInteger(saved.mission) || saved.mission < 0 || saved.mission >= MISSIONS.length) return fallback;
      const mission = MISSIONS[saved.mission];
      const value = Number.isInteger(saved.value) && saved.value >= mission.min && saved.value <= mission.max
        ? saved.value
        : mission.start;
      const selected = Number.isInteger(saved.selected) && mission.options?.[saved.selected] !== undefined
        ? saved.selected
        : null;
      const solved = mission.mode === 'move'
        ? Boolean(saved.solved) && value === mission.target
        : Boolean(saved.solved) && selected === mission.correct;
      return {
        mission: saved.mission,
        value,
        selected,
        solved,
        completed: Boolean(saved.completed),
        feedback: solved ? 'correct' : ['start', 'selected', 'wrong', 'hint'].includes(saved.feedback) ? saved.feedback : 'start',
      };
    } catch {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage may be unavailable without blocking play.
    }
  }

  function mission() {
    return MISSIONS[state.mission];
  }

  function formatNumber(value) {
    if (value > 0) return `+${value}`;
    if (value < 0) return `−${Math.abs(value)}`;
    return '0';
  }

  function selectedValue() {
    return state.selected === null ? null : mission().options[state.selected];
  }

  function feedbackText() {
    if (state.feedback === 'wrong') {
      return state.mission === 0 ? t('wrong')[0](formatNumber(state.value)) : t('wrong')[state.mission];
    }
    if (state.feedback === 'correct') return t('correct')[state.mission];
    if (state.feedback === 'hint') return t('hints')[state.mission];
    if (state.feedback === 'selected') {
      const value = state.mission === 0 ? state.value : selectedValue();
      const label = state.mission === 1 ? `${formatNumber(value)}°C` : state.mission === 2 ? formatNumber(value) : formatNumber(value);
      return t('selected')[state.mission](label);
    }
    return t('lessons')[state.mission].start;
  }

  function move(step) {
    if (state.solved || mission().mode !== 'move') return;
    ensureAudio();
    const next = Math.max(mission().min, Math.min(mission().max, state.value + step));
    if (next === state.value) {
      playSound('error');
      return;
    }
    state.value = next;
    state.feedback = 'selected';
    playSound(next === 0 ? 'zero' : 'move');
    window.cool?.track?.('move_lift_craft', { mission: state.mission + 1, step, value: next });
    saveState();
    render();
  }

  function selectAnswer(index) {
    if (state.solved || mission().mode !== 'answer') return;
    ensureAudio();
    state.selected = index;
    state.value = mission().options[index];
    state.feedback = 'selected';
    playSound('select');
    window.cool?.track?.('choose_number_stop', { mission: state.mission + 1, option: index + 1, value: state.value });
    saveState();
    render();
  }

  function checkAnswer() {
    ensureAudio();
    const correct = mission().mode === 'move'
      ? state.value === mission().target
      : state.selected === mission().correct;
    if (mission().mode === 'answer' && state.selected === null) {
      elements.status.textContent = t('chooseFirst')[state.mission];
      playSound('error');
      return;
    }
    if (!correct) {
      state.feedback = 'wrong';
      playSound('error');
      window.cool?.track?.('miss_number_stop', { mission: state.mission + 1, value: state.value });
      saveState();
      render();
      return;
    }
    state.solved = true;
    state.feedback = 'correct';
    playSound('success');
    window.cool?.stage?.(`mission${state.mission + 1}`);
    window.cool?.track?.('solve_integer_mission', { mission: state.mission + 1 });
    saveState();
    render();
  }

  function nextMission() {
    ensureAudio();
    if (!state.solved) return;
    if (state.mission < MISSIONS.length - 1) {
      const nextIndex = state.mission + 1;
      state = {
        mission: nextIndex,
        value: MISSIONS[nextIndex].start,
        selected: null,
        solved: false,
        completed: false,
        feedback: 'start',
      };
      visualValue = state.value;
      playSound('page');
      window.cool?.track?.('open_next_world', { mission: nextIndex + 1 });
      saveState();
      render();
      return;
    }
    completeCourse();
  }

  function completeCourse() {
    state.completed = true;
    saveState();
    elements.deepFlash.hidden = false;
    playSound('deep');
    window.cool?.complete?.();
    window.cool?.track?.('earn_zero_navigator');
    clearTimeout(deepTimer);
    deepTimer = setTimeout(() => {
      elements.deepFlash.hidden = true;
      playSound('complete');
      render();
    }, 900);
  }

  function resetMission() {
    ensureAudio();
    state.value = mission().start;
    state.selected = null;
    state.solved = false;
    state.feedback = 'start';
    visualValue = state.value;
    playSound('page');
    window.cool?.track?.('reset_integer_mission', { mission: state.mission + 1 });
    saveState();
    render();
  }

  function showHint() {
    ensureAudio();
    state.feedback = 'hint';
    playSound('hint');
    window.cool?.track?.('ask_integer_hint', { mission: state.mission + 1 });
    saveState();
    render();
  }

  function playAgain() {
    clearTimeout(deepTimer);
    state = freshState();
    visualValue = state.value;
    elements.deepFlash.hidden = true;
    saveState();
    playSound('page');
    render();
  }

  function renderAnswers() {
    elements.answerControls.replaceChildren();
    const current = mission();
    if (current.mode !== 'answer') return;
    elements.answerControls.classList.toggle('answer-controls--three', current.options.length === 3);
    current.options.forEach((value, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.answer = String(index);
      button.disabled = state.solved;
      if (state.selected === index) button.classList.add('is-selected');
      if (state.feedback === 'wrong' && state.selected === index) button.classList.add('is-wrong');
      if (state.solved && index === current.correct) button.classList.add('is-right');
      const strong = document.createElement('strong');
      strong.textContent = t('answerLabels')[state.mission - 1][index];
      const small = document.createElement('small');
      small.textContent = t('answerSubs')[state.mission - 1][index];
      button.append(strong, small);
      button.addEventListener('click', () => selectAnswer(index));
      elements.answerControls.append(button);
    });
  }

  function renderNumberStrip() {
    elements.numberStrip.replaceChildren();
    for (let value = -4; value <= 4; value += 1) {
      const tick = document.createElement('span');
      tick.textContent = formatNumber(value);
      if (value === 0) tick.classList.add('is-zero');
      if (value === state.value) tick.classList.add('is-current');
      elements.numberStrip.append(tick);
    }
  }

  function render() {
    const current = mission();
    const lesson = t('lessons')[state.mission];
    const positions = t('positions')[state.mission];
    const isMove = current.mode === 'move';
    const result = state.solved ? 'right' : state.feedback === 'wrong' ? 'wrong' : 'idle';

    elements.missionNumber.textContent = String(state.mission + 1);
    elements.missionKicker.textContent = lesson.kicker;
    elements.missionTitle.textContent = lesson.title;
    elements.missionPrompt.textContent = lesson.prompt;
    elements.status.textContent = feedbackText();
    elements.skinLabel.textContent = t('skinLabels')[state.mission];
    elements.controlTitle.textContent = t('controlTitles')[state.mission];
    elements.ruleText.textContent = t('rules')[state.mission];
    elements.ruleIcon.textContent = ['🌊', '🌡️', '🧾'][state.mission];
    elements.shaft.dataset.skin = current.skin;
    elements.shaft.dataset.result = result;
    elements.currentValue.textContent = formatNumber(state.value);
    elements.positionName.textContent = state.solved ? positions.target : positions.start;
    const change = state.value - current.start;
    elements.journeyValue.textContent = formatNumber(change);
    elements.equation.textContent = `${formatNumber(current.start)} ${change < 0 ? '−' : '+'} ${Math.abs(change)} = ${formatNumber(state.value)}`;
    elements.targetValue.textContent = t('targetValues')[state.mission];
    elements.targetLabel.textContent = positions.target;
    elements.moveControls.hidden = !isMove;
    elements.answerControls.hidden = isMove;
    elements.checkBtn.querySelector('[data-t]').textContent = isMove ? t('arrive') : t('check');
    elements.checkBtn.disabled = !isMove && state.selected === null;
    elements.checkBtn.hidden = state.solved;
    elements.nextBtn.hidden = !state.solved;
    elements.nextBtn.querySelector('[data-t]').textContent = state.mission === MISSIONS.length - 1 ? t('finish') : t('next');

    elements.missionNav.replaceChildren();
    for (let index = 0; index < MISSIONS.length; index += 1) {
      const dot = document.createElement('span');
      dot.textContent = index < state.mission ? '✓' : String(index + 1);
      if (index < state.mission) dot.className = 'is-done';
      if (index === state.mission) dot.className = 'is-current';
      elements.missionNav.append(dot);
    }
    elements.missionNav.setAttribute('aria-label', t('navLabel'));

    [...elements.moveControls.querySelectorAll('button')].forEach((button) => {
      button.disabled = state.solved;
    });
    renderAnswers();
    renderNumberStrip();
    drawWorld();

    const showFinale = state.completed && elements.deepFlash.hidden;
    elements.course.inert = showFinale;
    elements.finale.hidden = !showFinale;
    if (showFinale) requestAnimationFrame(() => elements.playAgainBtn.focus());

    elements.soundBtn.textContent = muted ? '🔇' : '🔊';
    elements.soundBtn.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
    elements.soundBtn.setAttribute('aria-pressed', String(muted));
    elements.themeBtn.setAttribute('aria-label', t('theme'));
    elements.canvas.setAttribute('aria-label', t('canvasLabel'));
  }

  function canvasPalette() {
    const style = getComputedStyle(document.documentElement);
    return {
      line: style.getPropertyValue('--line').trim(),
      sun: style.getPropertyValue('--sun').trim(),
      coral: style.getPropertyValue('--coral').trim(),
      aqua: style.getPropertyValue('--aqua').trim(),
    };
  }

  function drawWorld() {
    cancelAnimationFrame(animationFrame);
    const canvas = elements.canvas;
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * scale));
    canvas.height = Math.max(1, Math.round(rect.height * scale));
    const context = canvas.getContext('2d');
    context.scale(scale, scale);
    const width = rect.width;
    const height = rect.height;
    const palette = canvasPalette();
    const axisX = width * 0.42;
    const top = 34;
    const bottom = height - 26;
    const yFor = (value) => bottom - ((value + 10) / 20) * (bottom - top);

    function paint(value) {
      context.clearRect(0, 0, width, height);
      context.save();
      context.strokeStyle = 'rgba(255,255,255,.86)';
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(axisX, top);
      context.lineTo(axisX, bottom);
      context.stroke();

      for (let tick = -10; tick <= 10; tick += 1) {
        const y = yFor(tick);
        const major = tick % 5 === 0;
        context.strokeStyle = tick === 0 ? palette.sun : 'rgba(255,255,255,.72)';
        context.lineWidth = major ? 3 : 1.5;
        context.beginPath();
        context.moveTo(axisX - (major ? 16 : 8), y);
        context.lineTo(axisX + (major ? 16 : 8), y);
        context.stroke();
        if (major) {
          context.fillStyle = tick === 0 ? palette.sun : '#ffffff';
          context.font = `900 14px ${getComputedStyle(document.documentElement).getPropertyValue('--display')}`;
          context.textAlign = 'right';
          context.textBaseline = 'middle';
          context.fillText(formatNumber(tick), axisX - 23, y);
        }
      }

      const targetY = yFor(mission().target);
      context.setLineDash([6, 6]);
      context.strokeStyle = palette.sun;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(axisX + 22, targetY);
      context.lineTo(width - 20, targetY);
      context.stroke();
      context.setLineDash([]);

      drawDestination(context, width - 72, targetY, mission().skin, palette);
      drawCraft(context, axisX + 54, yFor(value), palette, mission().skin);
      context.restore();
    }

    const start = visualValue;
    const end = state.value;
    const startedAt = performance.now();
    const duration = Math.min(560, 180 + Math.abs(end - start) * 48);
    function animate(now) {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      visualValue = start + (end - start) * eased;
      paint(visualValue);
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
      else visualValue = end;
    }
    animationFrame = requestAnimationFrame(animate);
  }

  function drawCraft(context, x, y, palette, skin) {
    context.save();
    context.translate(x, y);
    context.shadowColor = 'rgba(0,0,0,.38)';
    context.shadowBlur = 12;
    context.shadowOffsetY = 6;
    context.fillStyle = skin === 'ledger' ? palette.sun : palette.coral;
    context.strokeStyle = '#14334c';
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(-30, -19, 60, 38, 15);
    context.fill();
    context.stroke();
    context.shadowColor = 'transparent';
    context.fillStyle = '#dffbff';
    context.beginPath();
    context.roundRect(-15, -11, 30, 20, 8);
    context.fill();
    context.fillStyle = '#14334c';
    context.font = '900 15px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(skin === 'temperature' ? '°C' : skin === 'ledger' ? '¥' : '↕', 0, 0);
    context.fillStyle = palette.aqua;
    context.beginPath();
    context.arc(-25, 20, 6, 0, Math.PI * 2);
    context.arc(25, 20, 6, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  function drawDestination(context, x, y, skin, palette) {
    context.save();
    context.translate(x, y);
    context.fillStyle = '#f4ffff';
    context.strokeStyle = '#12364f';
    context.lineWidth = 3;
    if (skin === 'temperature') {
      context.beginPath();
      context.arc(0, 8, 13, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = palette.coral;
      context.fillRect(-5, -25, 10, 32);
      context.beginPath();
      context.arc(0, 8, 7, 0, Math.PI * 2);
      context.fill();
    } else if (skin === 'ledger') {
      context.beginPath();
      context.roundRect(-25, -22, 50, 44, 7);
      context.fill();
      context.stroke();
      context.fillStyle = palette.coral;
      context.font = '900 23px serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('−5', 0, 1);
    } else {
      context.fillStyle = palette.sun;
      context.beginPath();
      context.arc(0, 0, 22, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = '#12364f';
      context.font = '24px serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('⌂', 0, 0);
    }
    context.restore();
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

  function playSound(kind) {
    const context = ensureAudio();
    if (!context || muted) return;
    const sounds = {
      move: { notes: [300], duration: 0.07, type: 'sine', gain: 0.035 },
      zero: { notes: [392, 523], duration: 0.1, type: 'triangle', gain: 0.04 },
      select: { notes: [350], duration: 0.08, type: 'triangle', gain: 0.04 },
      hint: { notes: [523, 659], duration: 0.1, type: 'sine', gain: 0.04 },
      error: { notes: [190, 145], duration: 0.14, type: 'sawtooth', gain: 0.03 },
      success: { notes: [392, 523, 659], duration: 0.12, type: 'triangle', gain: 0.05 },
      page: { notes: [294, 392], duration: 0.1, type: 'sine', gain: 0.04 },
      deep: { notes: [196, 147, 110], duration: 0.2, type: 'sine', gain: 0.045 },
      complete: { notes: [392, 494, 587, 784], duration: 0.15, type: 'triangle', gain: 0.055 },
    };
    const sound = sounds[kind] || sounds.select;
    sound.notes.forEach((frequency, index) => {
      const start = context.currentTime + index * sound.duration * 0.72;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = sound.type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(sound.gain, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + sound.duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + sound.duration + 0.02);
    });
  }

  function toggleSound() {
    muted = !muted;
    try {
      localStorage.setItem(SOUND_KEY, muted ? '1' : '0');
    } catch {
      // Sound preference remains session-local if storage is unavailable.
    }
    if (!muted) playSound('select');
    render();
  }

  elements.moveControls.addEventListener('click', (event) => {
    const button = event.target.closest('[data-step]');
    if (button) move(Number(button.dataset.step));
  });
  elements.checkBtn.addEventListener('click', checkAnswer);
  elements.nextBtn.addEventListener('click', nextMission);
  elements.resetBtn.addEventListener('click', resetMission);
  elements.hintBtn.addEventListener('click', showHint);
  elements.playAgainBtn.addEventListener('click', playAgain);
  elements.soundBtn.addEventListener('click', toggleSound);
  elements.langBtn.addEventListener('click', () => window.cool.preferences.toggleLang());
  elements.themeBtn.addEventListener('click', () => window.cool.preferences.toggleTheme());
  window.addEventListener('resize', drawWorld);

  try {
    muted = localStorage.getItem(SOUND_KEY) === '1';
  } catch {
    muted = false;
  }
  visualValue = state.value;

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang: nextLang, theme }) {
      t = translate;
      lang = nextLang;
      document.title = t('doc');
      elements.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
      elements.themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
      render();
    },
  });
})();
