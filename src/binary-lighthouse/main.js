(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '🗼 二进制灯塔 · KidsLab',
      back: '返回平台',
      title: '二进制灯塔',
      eyebrow: '今晚的灯塔值班',
      rangeLabel: '5 盏灯',
      placeValues: '每盏灯的位值',
      controlLabel: '港务控制台',
      litSum: '亮灯合计',
      watchPassed: '值班任务完成',
      soundOn: '关闭音效',
      soundOff: '开启音效',
      theme: '切换主题',
      reset: '重新开始',
      hint: '提示',
      levels: ['发数字', '读灯语', '秘密信'],
      watchLabels: ['第一班 · 发出航标', '第二班 · 接收来船', '第三班 · 秘密频道'],
      missions: ['用灯光发送数字 19', '读懂三艘船的灯语', '把 SOS 编成三组灯语'],
      controlTitles: ['把位值加起来', '哪一个十进制数？', '按 A=1…Z=26 编码'],
      tips: [
        '点灯凑出港口要的数字。亮灯记作 1，灭灯记作 0。',
        '从左到右看 16、8、4、2、1，只把亮灯的位值相加。',
        '先把字母换成数字，再用同样的五盏灯发出去。',
      ],
      starts: [
        '先点亮 16，再想想还差几。',
        '来船发来 10110。只加亮着的位值。',
        '第一封秘密信是 S，它在字母表里排第 19。',
      ],
      hints: [
        '19 可以拆成 16 + 2 + 1。',
        '忽略写着 0 的灯，只加写着 1 的灯。',
        'S=19，O=15。每发完一个字母，灯会自动归零。',
      ],
      targetLabel: '港口命令',
      makeNumber: (n) => `请发送数字 ${n}`,
      targetHelp: '每盏灯最多点一次，亮起的数字相加就是信号值。',
      incomingLabel: (round, total) => `第 ${round} / ${total} 艘船`,
      chooseDecimal: '选择这组灯语表示的数字',
      letterLabel: '当前要发送',
      letterCode: (letter, value) => `${letter} = ${value}`,
      codeRule: '本课件约定：A=1，B=2，…，Z=26。它是一张自定义码表。',
      transmit: '发送灯语',
      chooseAnswer: '先选择一个答案',
      currentZero: '0',
      equation: (parts, value) => `${parts.length ? parts.join(' + ') : '0'} = ${value}`,
      bitLabel: (value, on) => `位值 ${value}，当前为 ${on ? '1，亮灯' : '0，灭灯'}`,
      wrongNumber: (current, target) => `现在是 ${current}，不是 ${target}。检查亮灯的位值，再发送一次。`,
      numberSuccess: '16 + 2 + 1 = 19。五盏灯把数字安全送到了海上！',
      numberTitle: '货船收到 19！',
      numberModal: '10011 中亮起的三位分别值 16、2、1。二进制的数值，就是所有亮灯位值的和。',
      next: '下一班',
      wrongDecode: (answer) => `${answer} 还不是这组灯语的值。只加标着 1 的位置，再选一次。`,
      decodeSuccess: (value) => `读对了：亮灯位值相加等于 ${value}。下一艘船正在靠岸。`,
      decodeAll: '三组灯语全部读对。你已经能在二进制和十进制之间来回翻译了。',
      decodeTitle: '来船全部识别！',
      decodeModal: '同一排灯既能发出十进制任务，也能接收二进制灯语；关键始终是 16、8、4、2、1 的位值。',
      wrongLetter: (letter, target, current) => `${letter} 要发 ${target}，现在是 ${current}。先把字母编号拆成位值。`,
      letterSent: (letter, binary) => `${letter} 已发送：${binary}。灯已归零，准备下一个字母。`,
      allSent: '19、15、19 变成三组五位灯语，SOS 已完整送达。',
      completeTitle: '秘密信穿过暴风雨！',
      completeModal: '你把字母先换成编号，再把编号换成二进制灯语。只要双方使用同一张码表，0 和 1 就能传递文字。',
      replay: '再值一晚班',
      locked: '先完成前一班。',
    },
    en: {
      doc: '🗼 Binary Lighthouse · KidsLab',
      back: 'Back to platform',
      title: 'Binary Lighthouse',
      eyebrow: "Tonight's lighthouse watch",
      rangeLabel: '5 lamps',
      placeValues: 'Place value of each lamp',
      controlLabel: 'Harbor console',
      litSum: 'Lit lamps total',
      watchPassed: 'Watch complete',
      soundOn: 'Mute sound',
      soundOff: 'Turn sound on',
      theme: 'Switch theme',
      reset: 'Restart',
      hint: 'Hint',
      levels: ['Send a Number', 'Read Signals', 'Secret Message'],
      watchLabels: ['Watch 1 · Harbor beacon', 'Watch 2 · Incoming ships', 'Watch 3 · Secret channel'],
      missions: ['Send the number 19 with light', 'Read three ships’ signals', 'Encode SOS as three signals'],
      controlTitles: ['Add the place values', 'Which decimal number?', 'Encode with A=1…Z=26'],
      tips: [
        'Turn on lamps to make the harbor number. On is 1; off is 0.',
        'Read 16, 8, 4, 2, 1 from left to right. Add only the lit places.',
        'Turn each letter into a number, then send it with the same five lamps.',
      ],
      starts: [
        'Turn on 16 first, then work out what is still missing.',
        'The ship sent 10110. Add only the lit place values.',
        'The first secret letter is S, number 19 in the alphabet.',
      ],
      hints: [
        'You can split 19 into 16 + 2 + 1.',
        'Ignore lamps marked 0. Add only the places marked 1.',
        'S=19 and O=15. The lamps reset after each letter.',
      ],
      targetLabel: 'Harbor order',
      makeNumber: (n) => `Send the number ${n}`,
      targetHelp: 'Tap each lamp at most once. The lit place values add up to the signal.',
      incomingLabel: (round, total) => `Ship ${round} of ${total}`,
      chooseDecimal: 'Choose the number represented by this signal',
      letterLabel: 'Send this letter',
      letterCode: (letter, value) => `${letter} = ${value}`,
      codeRule: 'Course codebook: A=1, B=2, …, Z=26. This is a custom codebook.',
      transmit: 'Transmit signal',
      chooseAnswer: 'Choose an answer first',
      currentZero: '0',
      equation: (parts, value) => `${parts.length ? parts.join(' + ') : '0'} = ${value}`,
      bitLabel: (value, on) => `Place value ${value}, currently ${on ? '1, lamp on' : '0, lamp off'}`,
      wrongNumber: (current, target) => `This signal is ${current}, not ${target}. Check the lit place values and try again.`,
      numberSuccess: '16 + 2 + 1 = 19. Five lamps carried the number out to sea!',
      numberTitle: 'The cargo ship received 19!',
      numberModal: 'In 10011, the three lit places are worth 16, 2, and 1. A binary number is the sum of its lit place values.',
      next: 'Next watch',
      wrongDecode: (answer) => `${answer} is not this signal yet. Add only the places marked 1, then choose again.`,
      decodeSuccess: (value) => `Correct: the lit place values add up to ${value}. The next ship is approaching.`,
      decodeAll: 'All three signals decoded. You can now translate between binary and decimal.',
      decodeTitle: 'Every ship identified!',
      decodeModal: 'The same row of lamps can send decimal tasks and receive binary signals. The key is always the place values 16, 8, 4, 2, and 1.',
      wrongLetter: (letter, target, current) => `${letter} needs ${target}, but the lamps show ${current}. Split the letter number into place values.`,
      letterSent: (letter, binary) => `${letter} sent as ${binary}. Lamps reset for the next letter.`,
      allSent: '19, 15, and 19 became three five-bit signals. SOS is complete.',
      completeTitle: 'The secret crossed the storm!',
      completeModal: 'You changed letters into numbers, then numbers into binary signals. When both sides share a codebook, 0 and 1 can carry text.',
      replay: 'Take another watch',
      locked: 'Finish the previous watch first.',
    },
  };

  const BITS = [16, 8, 4, 2, 1];
  const NUMBER_TARGET = 19;
  const DECODE_ROUNDS = [
    { value: 22, options: [18, 22, 26] },
    { value: 7, options: [6, 7, 14] },
    { value: 25, options: [21, 25, 29] },
  ];
  const MESSAGE = [
    { letter: 'S', value: 19 },
    { letter: 'O', value: 15 },
    { letter: 'S', value: 19 },
  ];
  const SAVE_KEY = 'kidslab.binary-lighthouse';
  const MUTE_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    lang: $('#langBtn'),
    theme: $('#themeBtn'),
    sound: $('#soundBtn'),
    tip: $('#tip'),
    levels: $('#levelStrip'),
    watch: $('#watchLabel'),
    mission: $('#missionTitle'),
    controlTitle: $('#controlTitle'),
    hint: $('#hintBtn'),
    reset: $('#resetBtn'),
    lampBank: $('#lampBank'),
    binary: $('#binaryReadout'),
    feedback: $('#feedback'),
    workspace: $('#controlWorkspace'),
    sum: $('#sumReadout'),
    equation: $('#equation'),
    action: $('#actionBtn'),
    actionLabel: $('#actionLabel'),
    beam: $('#beam'),
    ship: $('#ship'),
    modal: $('#modal'),
    modalMagic: $('#modalMagic'),
    modalTitle: $('#modalTitle'),
    modalText: $('#modalText'),
    next: $('#nextBtn'),
  };

  let t = (key) => key;
  let lang = window.cool.preferences.lang;
  let stage = 0;
  let unlocked = 0;
  let activeBits = new Set();
  let decodeRound = 0;
  let encodedLetters = 0;
  let selectedAnswer = null;
  let feedbackType = '';
  let hintTimer = 0;
  let audioContext = null;
  let muted = false;

  try {
    muted = localStorage.getItem(MUTE_KEY) === 'true';
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (saved && Number.isInteger(saved.stage) && Number.isInteger(saved.unlocked)) {
      stage = Math.max(0, Math.min(2, saved.stage));
      unlocked = Math.max(stage, Math.min(2, saved.unlocked));
    }
  } catch {
    // Storage is optional; the game remains playable in this tab.
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ stage, unlocked }));
    } catch {
      // Storage is optional.
    }
  }

  function ensureAudio() {
    if (muted) return null;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      audioContext ||= new AudioCtor();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      return audioContext;
    } catch {
      return null;
    }
  }

  function tone(kind) {
    const context = ensureAudio();
    if (!context) return;
    const patterns = {
      toggle: [[280, 0, .06, .045]],
      transmit: [[330, 0, .08, .05], [440, .08, .1, .055]],
      wrong: [[190, 0, .13, .055], [135, .11, .16, .05]],
      correct: [[440, 0, .08, .05], [590, .08, .13, .06]],
      complete: [[392, 0, .1, .05], [523, .1, .12, .06], [659, .21, .18, .07]],
    };
    const now = context.currentTime;
    for (const [frequency, offset, duration, volume] of patterns[kind] || patterns.toggle) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === 'wrong' ? 'square' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(volume, now + offset + .015);
      gain.gain.exponentialRampToValueAtTime(.0001, now + offset + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration + .025);
    }
  }

  function currentValue() {
    return [...activeBits].reduce((sum, bit) => sum + bit, 0);
  }

  function binaryFor(value) {
    return value.toString(2).padStart(5, '0');
  }

  function setBitsForValue(value) {
    activeBits = new Set(BITS.filter((bit) => (value & bit) === bit));
  }

  function setFeedback(message, type = '') {
    el.feedback.textContent = message;
    feedbackType = type;
    el.feedback.classList.toggle('is-error', type === 'error');
    el.feedback.classList.toggle('is-success', type === 'success');
  }

  function scheduleHint() {
    clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      if (el.modal.hidden) setFeedback(t('hints')[stage]);
    }, 30000);
  }

  function renderLevels() {
    el.levels.innerHTML = t('levels').map((name, index) =>
      `<button class="level-button ${index === stage ? 'is-active' : ''} ${index < unlocked ? 'is-done' : ''}" type="button" data-level="${index}" ${index > unlocked ? 'disabled' : ''}>${index + 1}. ${name}</button>`).join('');
    el.levels.querySelectorAll('[data-level]').forEach((button) => {
      button.addEventListener('click', () => setStage(Number(button.dataset.level)));
    });
  }

  function renderLamps() {
    const disabled = stage === 1;
    el.lampBank.innerHTML = BITS.map((bit) => {
      const on = activeBits.has(bit);
      return `<button class="lamp ${on ? 'is-on' : ''}" type="button" data-bit="${bit}" aria-label="${t('bitLabel', bit, on)}" aria-pressed="${on}" ${disabled ? 'disabled' : ''}>
        <span class="lamp__lens" aria-hidden="true"></span>
        <b>${bit}</b>
        <small>${on ? '1' : '0'}</small>
      </button>`;
    }).join('');
    el.lampBank.querySelectorAll('[data-bit]').forEach((button) => {
      button.addEventListener('click', () => toggleBit(Number(button.dataset.bit)));
    });
  }

  function renderStageZero() {
    el.workspace.innerHTML = `<div class="target-card">
      <span>${t('targetLabel')}</span>
      <strong>${NUMBER_TARGET}</strong>
      <p>${t('targetHelp')}</p>
    </div>
    <p class="lesson-note"><strong>10011</strong> = 16 + 2 + 1</p>`;
  }

  function renderStageOne() {
    const round = DECODE_ROUNDS[decodeRound];
    el.workspace.innerHTML = `<div class="incoming-card">
      <span>${t('incomingLabel', decodeRound + 1, DECODE_ROUNDS.length)}</span>
      <code>${binaryFor(round.value)}</code>
    </div>
    <p class="lesson-note">${t('chooseDecimal')}</p>
    <div class="answer-grid">${round.options.map((option) =>
      `<button class="answer-button ${selectedAnswer === option ? 'is-wrong' : ''}" type="button" data-answer="${option}">${option}</button>`).join('')}</div>`;
    el.workspace.querySelectorAll('[data-answer]').forEach((button) => {
      button.addEventListener('click', () => chooseAnswer(Number(button.dataset.answer)));
    });
  }

  function renderStageTwo() {
    const target = MESSAGE[encodedLetters];
    el.workspace.innerHTML = `<div class="letter-card">
      <span>${t('letterLabel')}</span>
      <div class="letter-target"><strong>${target.letter}</strong><code>${t('letterCode', target.letter, target.value)}</code></div>
    </div>
    <div class="letter-progress">${MESSAGE.map((item, index) =>
      `<i class="${index < encodedLetters ? 'is-done' : ''} ${index === encodedLetters ? 'is-current' : ''}">${item.letter}</i>`).join('')}</div>
    <p class="lesson-note">${t('codeRule')}</p>`;
  }

  function render() {
    document.body.dataset.stage = String(stage);
    el.tip.textContent = t('tips')[stage];
    el.watch.textContent = t('watchLabels')[stage];
    el.mission.textContent = t('missions')[stage];
    el.controlTitle.textContent = t('controlTitles')[stage];
    el.sound.textContent = muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-label', muted ? t('soundOff') : t('soundOn'));
    el.sound.setAttribute('aria-pressed', String(muted));
    el.theme.setAttribute('aria-label', t('theme'));
    el.reset.setAttribute('aria-label', t('reset'));
    el.hint.setAttribute('aria-label', t('hint'));
    el.actionLabel.textContent = stage === 1 ? t('chooseAnswer') : t('transmit');
    el.action.disabled = stage === 1;
    const value = currentValue();
    const parts = BITS.filter((bit) => activeBits.has(bit));
    el.binary.textContent = binaryFor(value);
    el.sum.textContent = String(value);
    el.equation.textContent = t('equation', parts, value);
    el.beam.classList.toggle('is-active', value > 0);
    renderLevels();
    renderLamps();
    if (stage === 0) renderStageZero();
    else if (stage === 1) renderStageOne();
    else renderStageTwo();
  }

  function toggleBit(bit) {
    if (stage === 1) return;
    if (activeBits.has(bit)) activeBits.delete(bit);
    else activeBits.add(bit);
    setFeedback(t('starts')[stage]);
    tone('toggle');
    window.cool.track('toggle_signal_lamp');
    render();
    scheduleHint();
  }

  function flashSignal() {
    el.beam.classList.remove('is-sending');
    requestAnimationFrame(() => el.beam.classList.add('is-sending'));
    el.ship.classList.add('is-received');
    window.setTimeout(() => el.ship.classList.remove('is-received'), 750);
  }

  function showCompletion(title, text, magic) {
    if (stage < 2) {
      unlocked = Math.max(unlocked, stage + 1);
      persist();
    }
    el.modalMagic.textContent = magic;
    el.modalTitle.textContent = title;
    el.modalText.textContent = text;
    el.next.textContent = stage === 2 ? t('replay') : t('next');
    el.modal.hidden = false;
    renderLevels();
  }

  function transmitNumber() {
    const value = currentValue();
    if (value !== NUMBER_TARGET) {
      setFeedback(t('wrongNumber', value, NUMBER_TARGET), 'error');
      tone('wrong');
      window.cool.track('retry_number_signal');
      scheduleHint();
      return;
    }
    flashSignal();
    setFeedback(t('numberSuccess'), 'success');
    tone('correct');
    window.cool.track('send_number_signal');
    showCompletion(t('numberTitle'), t('numberModal'), '10011 ✨');
  }

  function chooseAnswer(answer) {
    const round = DECODE_ROUNDS[decodeRound];
    if (answer !== round.value) {
      selectedAnswer = answer;
      setFeedback(t('wrongDecode', answer), 'error');
      tone('wrong');
      window.cool.track('retry_decode_signal');
      render();
      scheduleHint();
      return;
    }
    selectedAnswer = null;
    flashSignal();
    tone('correct');
    window.cool.track('decode_ship_signal');
    decodeRound += 1;
    if (decodeRound === DECODE_ROUNDS.length) {
      setFeedback(t('decodeAll'), 'success');
      showCompletion(t('decodeTitle'), t('decodeModal'), '10110 · 00111 · 11001');
      return;
    }
    setBitsForValue(DECODE_ROUNDS[decodeRound].value);
    setFeedback(t('decodeSuccess', answer), 'success');
    render();
    scheduleHint();
  }

  function transmitLetter() {
    const target = MESSAGE[encodedLetters];
    const value = currentValue();
    if (value !== target.value) {
      setFeedback(t('wrongLetter', target.letter, target.value, value), 'error');
      tone('wrong');
      window.cool.track('retry_letter_signal');
      scheduleHint();
      return;
    }
    const sentBinary = binaryFor(value);
    flashSignal();
    tone('transmit');
    window.cool.track('send_letter_signal');
    encodedLetters += 1;
    if (encodedLetters === MESSAGE.length) {
      setFeedback(t('allSent'), 'success');
      window.cool.complete?.();
      tone('complete');
      showCompletion(t('completeTitle'), t('completeModal'), 'S · O · S');
      return;
    }
    activeBits.clear();
    setFeedback(t('letterSent', target.letter, sentBinary), 'success');
    render();
    scheduleHint();
  }

  function runAction() {
    if (stage === 0) transmitNumber();
    else if (stage === 2) transmitLetter();
  }

  function resetStage() {
    clearTimeout(hintTimer);
    activeBits.clear();
    selectedAnswer = null;
    decodeRound = 0;
    encodedLetters = 0;
    el.modal.hidden = true;
    el.beam.classList.remove('is-sending');
    el.ship.classList.remove('is-received');
    if (stage === 1) setBitsForValue(DECODE_ROUNDS[0].value);
    setFeedback(t('starts')[stage]);
    window.cool.stage(`watch-${stage + 1}`);
    render();
    scheduleHint();
  }

  function setStage(nextStage) {
    if (nextStage > unlocked) {
      setFeedback(t('locked'), 'error');
      tone('wrong');
      return;
    }
    stage = nextStage;
    persist();
    resetStage();
  }

  function nextStage() {
    el.modal.hidden = true;
    setStage(stage === 2 ? 0 : stage + 1);
  }

  function showHint() {
    setFeedback(t('hints')[stage]);
    tone('toggle');
    window.cool.track('open_binary_hint');
    scheduleHint();
  }

  function toggleSound() {
    muted = !muted;
    try {
      localStorage.setItem(MUTE_KEY, String(muted));
    } catch {
      // Sound preference persistence is optional.
    }
    if (muted && audioContext?.state === 'running') audioContext.suspend().catch(() => {});
    render();
    if (!muted) tone('toggle');
  }

  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.sound.addEventListener('click', toggleSound);
  el.hint.addEventListener('click', showHint);
  el.reset.addEventListener('click', resetStage);
  el.action.addEventListener('click', runAction);
  el.next.addEventListener('click', nextStage);

  window.cool.bindI18n(I18N, {
    onChange(context) {
      t = context.t;
      lang = context.lang;
      document.title = t('doc');
      el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      el.theme.textContent = context.theme === 'light' ? '🌙' : '☀️';
      setFeedback(t('starts')[stage], feedbackType);
      render();
    },
  });

  resetStage();
})();
