(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '魔药比例坊 · KidsLab',
      back: '返回平台',
      title: '魔药比例坊',
      lesson: '配方',
      open: '正在营业',
      moonUnit: '勺月光露',
      mushroomUnit: '勺蘑菇粉',
      dividend: '今日分红',
      coins: '枚金币',
      shares: '份',
      recipe: '古老配方',
      choose: '选择称量单',
      rule: '炼金铁律',
      hint: '问账房猫头鹰',
      brew: '开炉熬制',
      next: '下一张配方',
      finish: '领取黄金量杯',
      reset: '重配这一锅',
      playAgain: '再开一间比例坊',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      theme: '切换主题',
      navLabel: '配方进度',
      chooseFirst: '先选一张称量单，坩埚才知道该倒多少。',
      selected: (formula) => `称量单写着 ${formula}。检查总量和每一份的大小，再开炉。`,
      wrong: [
        '比例跑掉了！客人长出一只蛙蹼，但配方还在，换张称量单就能恢复。',
        '比例没变，可这锅还不到 500 勺。把 3:2 一起放大到 100 倍。',
        '金币总数对了，但没有按出资份数分。猫股东把金币退回来了，可以重分。',
      ],
      correct: [
        '药水亮得刚刚好！15 ÷ 5 = 3，每份 3 勺，所以是 9 勺和 6 勺。',
        '星光池灌满了！3 和 2 同时乘 100，颜色与小锅分毫不差。',
        '分红公平到账！每份是 10 枚，三只猫分别得到 20、30、50 枚。',
      ],
      hints: [
        '3:2 一共有 5 份。15 勺平均分成 5 份，每份是多少？',
        '目标是 500 勺，而基础配方一共 5 勺。500 是 5 的多少倍？',
        '先算 2+3+5=10 份。100 枚金币平均每份有多少枚？',
      ],
      rules: [
        '总量分成 5 份，月光露拿 3 份，蘑菇粉拿 2 份。',
        '等比放大时，两个量必须同时乘同一个数。',
        '按比分配先求总份数，再求一份，最后乘各自的份数。',
      ],
      choiceTitles: [
        '哪一锅保持 3:2？',
        '哪一档正好灌满 500 勺？',
        '哪一袋按 2:3:5 分红？',
      ],
      lessons: [
        {
          kicker: '学徒试炼 · 一锅不差',
          title: '熬出 15 勺月光药',
          prompt: '月光露 : 蘑菇粉 = 3 : 2。哪张称量单不会让客人长出蛙蹼？',
          start: '总共要 15 勺。先把 3:2 看成 5 份。',
        },
        {
          kicker: '大师试炼 · 星光泳池',
          title: '把小配方放大 100 倍',
          prompt: '两种材料一起乘同一个数，比例的“味道”才不会改变。',
          start: '星光池要 500 勺。选出能保持 3:2、又正好灌满的放大档。',
        },
        {
          kicker: '店长试炼 · 猫股东大会',
          title: '按 2:3:5 分 100 枚金币',
          prompt: '出资份数不同，先算一份值多少，再给每只猫装袋。',
          start: '三只猫一共出资 10 份。哪三袋金币既公平又正好是 100 枚？',
        },
      ],
      optionSub: [
        ['8 + 7 = 15', '9 + 6 = 15', '10 + 5 = 15'],
        ['总量 50', '总量 250', '总量 500'],
        ['总数 100', '总数 100', '总数 100'],
      ],
      total: (value, unit = '勺') => `${value} ${unit}`,
      finalKicker: '三张配方全部通过',
      finalTitle: '黄金量杯授予你！',
      finalText: '比就像配方的指纹：整锅一起放大或缩小，味道不变；分金币时，先数清一共有多少份。',
    },
    en: {
      doc: 'Potion Ratio Workshop · KidsLab',
      back: 'Back to platform',
      title: 'Potion Ratio Workshop',
      lesson: 'RECIPE',
      open: 'SHOP OPEN',
      moonUnit: 'spoons moon dew',
      mushroomUnit: 'spoons mushroom',
      dividend: 'TODAY’S DIVIDEND',
      coins: 'gold coins',
      shares: 'shares',
      recipe: 'ANCIENT RECIPE',
      choose: 'CHOOSE A MEASURE SLIP',
      rule: 'ALCHEMY RULE',
      hint: 'Ask the owl bookkeeper',
      brew: 'Brew this batch',
      next: 'Next recipe',
      finish: 'Claim golden cup',
      reset: 'Reset this batch',
      playAgain: 'Open another workshop',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      theme: 'Switch theme',
      navLabel: 'Recipe progress',
      chooseFirst: 'Choose a measure slip so the cauldron knows what to pour.',
      selected: (formula) => `The slip says ${formula}. Check the total and the size of each share before brewing.`,
      wrong: [
        'The ratio slipped! The customer grew one frog foot, but the recipe is safe—choose another slip to recover.',
        'The ratio is right, but this batch is not 500 spoons yet. Scale both parts of 3:2 by 100.',
        'The total is right, but the coins do not match the investment shares. The cats returned them, ready to split again.',
      ],
      correct: [
        'Perfect glow! 15 ÷ 5 = 3 per share, so the amounts are 9 spoons and 6 spoons.',
        'The starlight pool is full! Multiplying both 3 and 2 by 100 preserves the exact color.',
        'Fair dividend delivered! One share is 10 coins, so the cats receive 20, 30, and 50.',
      ],
      hints: [
        'The ratio 3:2 has 5 shares altogether. How large is one share when 15 spoons are split into 5?',
        'The base recipe totals 5 spoons. How many times larger is 500 than 5?',
        'First count 2+3+5=10 shares. How many coins are in one share of 100?',
      ],
      rules: [
        'Split the total into 5 shares: moon dew takes 3 and mushroom powder takes 2.',
        'To make an equivalent ratio, multiply both parts by the same number.',
        'For ratio sharing, find all shares, then one share, then each cat’s amount.',
      ],
      choiceTitles: [
        'Which batch keeps 3:2?',
        'Which setting fills 500 spoons?',
        'Which bags follow 2:3:5?',
      ],
      lessons: [
        {
          kicker: 'APPRENTICE TRIAL · EXACTLY ONE POT',
          title: 'Brew 15 spoons of moon potion',
          prompt: 'Moon dew : mushroom powder = 3 : 2. Which slip avoids a froggy side effect?',
          start: 'The batch needs 15 spoons. First see 3:2 as 5 equal shares.',
        },
        {
          kicker: 'MASTER TRIAL · STARLIGHT POOL',
          title: 'Scale the tiny recipe by 100',
          prompt: 'Multiply both ingredients by the same number to preserve the recipe’s “taste.”',
          start: 'The pool needs 500 spoons. Pick the scale that keeps 3:2 and fills it exactly.',
        },
        {
          kicker: 'SHOPKEEPER TRIAL · CAT BOARD MEETING',
          title: 'Share 100 coins in a 2:3:5 ratio',
          prompt: 'Their investments differ. Find one share, then pack each cat’s fair bag.',
          start: 'The cats invested 10 shares altogether. Which bags are fair and total 100 coins?',
        },
      ],
      optionSub: [
        ['8 + 7 = 15', '9 + 6 = 15', '10 + 5 = 15'],
        ['50 total', '250 total', '500 total'],
        ['100 total', '100 total', '100 total'],
      ],
      total: (value, unit = 'spoons') => `${value} ${unit}`,
      finalKicker: 'ALL THREE RECIPES PASSED',
      finalTitle: 'The Golden Measuring Cup is yours!',
      finalText: 'A ratio is a recipe’s fingerprint: scale the whole batch together and its taste stays true. To share, count the total number of shares first.',
    },
  };

  const LEVELS = [
    {
      ratio: '3 : 2',
      options: [[8, 7], [9, 6], [10, 5]],
      labels: ['8 : 7', '9 : 6', '10 : 5'],
      correct: 1,
      unit: 'spoons',
    },
    {
      ratio: '3 : 2',
      options: [[30, 20], [150, 100], [300, 200]],
      labels: ['× 10', '× 50', '× 100'],
      correct: 2,
      unit: 'spoons',
    },
    {
      ratio: '2 : 3 : 5',
      options: [[25, 25, 50], [20, 30, 50], [20, 40, 40]],
      labels: ['25 · 25 · 50', '20 · 30 · 50', '20 · 40 · 40'],
      correct: 1,
      unit: 'coins',
    },
  ];

  const STORAGE_KEY = 'kidslab.potion-ratio';
  const SOUND_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);

  const elements = {
    course: $('#course'),
    brewery: $('#brewery'),
    lessonNumber: $('#lessonNumber'),
    lessonKicker: $('#lessonKicker'),
    lessonTitle: $('#lessonTitle'),
    lessonPrompt: $('#lessonPrompt'),
    lessonNav: $('#lessonNav'),
    status: $('#status'),
    brewScene: $('#brewScene'),
    coinScene: $('#coinScene'),
    moonAmount: $('#moonAmount'),
    mushroomAmount: $('#mushroomAmount'),
    catOne: $('#catOne'),
    catTwo: $('#catTwo'),
    catThree: $('#catThree'),
    ratioEquation: $('#ratioEquation'),
    totalBadge: $('#totalBadge'),
    choiceTitle: $('#choiceTitle'),
    choices: $('#choices'),
    ruleText: $('#ruleText'),
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
  let state = loadState();

  function freshState() {
    return { level: 0, selected: null, solved: false, completed: false, feedback: 'start' };
  }

  function loadState() {
    const fallback = freshState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || !Number.isInteger(saved.level) || saved.level < 0 || saved.level >= LEVELS.length) return fallback;
      const selected = Number.isInteger(saved.selected) && saved.selected >= 0 && saved.selected < 3
        ? saved.selected
        : null;
      const solved = Boolean(saved.solved) && selected === LEVELS[saved.level].correct;
      const feedback = ['start', 'selected', 'wrong', 'correct', 'hint'].includes(saved.feedback)
        ? saved.feedback
        : 'start';
      return {
        level: saved.level,
        selected,
        solved,
        completed: Boolean(saved.completed),
        feedback: solved ? 'correct' : feedback,
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

  function currentLevel() {
    return LEVELS[state.level];
  }

  function selectedValues() {
    if (state.selected !== null) return currentLevel().options[state.selected];
    return state.level === 2 ? [2, 3, 5] : [3, 2];
  }

  function formulaFor(values) {
    return values.join(' : ');
  }

  function totalFor(values) {
    return values.reduce((sum, value) => sum + value, 0);
  }

  function feedbackText() {
    if (state.feedback === 'wrong') return t('wrong')[state.level];
    if (state.feedback === 'correct') return t('correct')[state.level];
    if (state.feedback === 'hint') return t('hints')[state.level];
    if (state.feedback === 'selected' && state.selected !== null) {
      return t('selected', formulaFor(currentLevel().options[state.selected]));
    }
    return t('lessons')[state.level].start;
  }

  function selectOption(index) {
    if (state.solved) return;
    ensureAudio();
    state.selected = index;
    state.feedback = 'selected';
    playSound('select');
    window.cool?.track?.('choose_measure_slip', { recipe: state.level + 1, option: index + 1 });
    saveState();
    render();
  }

  function checkRecipe() {
    ensureAudio();
    if (state.selected === null) {
      state.feedback = 'start';
      elements.status.textContent = t('chooseFirst');
      playSound('error');
      return;
    }

    if (state.selected !== currentLevel().correct) {
      state.feedback = 'wrong';
      playSound('error');
      window.cool?.track?.('brew_wrong_ratio', { recipe: state.level + 1, option: state.selected + 1 });
      saveState();
      render();
      return;
    }

    state.solved = true;
    state.feedback = 'correct';
    playSound('success');
    window.cool?.stage?.(`recipe${state.level + 1}`);
    window.cool?.track?.('brew_correct_ratio', { recipe: state.level + 1 });
    saveState();
    render();
  }

  function nextRecipe() {
    ensureAudio();
    if (!state.solved) return;
    if (state.level < LEVELS.length - 1) {
      state = { level: state.level + 1, selected: null, solved: false, completed: false, feedback: 'start' };
      playSound('page');
      window.cool?.track?.('open_next_recipe', { recipe: state.level + 1 });
      saveState();
      render();
      return;
    }

    state.completed = true;
    saveState();
    playSound('complete');
    window.cool?.complete?.();
    window.cool?.track?.('earn_golden_cup');
    render();
  }

  function resetRecipe() {
    ensureAudio();
    state.selected = null;
    state.solved = false;
    state.feedback = 'start';
    playSound('page');
    window.cool?.track?.('reset_recipe', { recipe: state.level + 1 });
    saveState();
    render();
  }

  function showHint() {
    ensureAudio();
    state.feedback = 'hint';
    playSound('hint');
    window.cool?.track?.('ask_ratio_hint', { recipe: state.level + 1 });
    saveState();
    render();
  }

  function playAgain() {
    state = freshState();
    saveState();
    playSound('page');
    render();
  }

  function renderChoices() {
    elements.choices.replaceChildren();
    currentLevel().options.forEach((values, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice';
      button.dataset.option = String(index);
      button.disabled = state.solved;
      if (state.selected === index) button.classList.add('is-selected');
      if (state.feedback === 'wrong' && state.selected === index) button.classList.add('is-wrong');
      if (state.solved && index === currentLevel().correct) button.classList.add('is-right');

      const strong = document.createElement('strong');
      strong.textContent = currentLevel().labels[index];
      const small = document.createElement('small');
      small.textContent = t('optionSub')[state.level][index];
      button.append(strong, small);
      button.addEventListener('click', () => selectOption(index));
      elements.choices.append(button);
    });
  }

  function render() {
    const lesson = t('lessons')[state.level];
    const values = selectedValues();
    const total = totalFor(values);
    const wrong = state.feedback === 'wrong';
    const result = state.solved ? 'right' : wrong ? 'wrong' : 'idle';

    elements.lessonNumber.textContent = String(state.level + 1);
    elements.lessonKicker.textContent = lesson.kicker;
    elements.lessonTitle.textContent = lesson.title;
    elements.lessonPrompt.textContent = lesson.prompt;
    elements.status.textContent = feedbackText();
    elements.choiceTitle.textContent = t('choiceTitles')[state.level];
    elements.ruleText.textContent = t('rules')[state.level];
    elements.brewery.dataset.stage = String(state.level);
    elements.brewery.dataset.result = result;

    elements.lessonNav.replaceChildren();
    for (let index = 0; index < LEVELS.length; index += 1) {
      const dot = document.createElement('span');
      dot.textContent = index < state.level ? '✓' : String(index + 1);
      if (index < state.level) dot.className = 'is-done';
      if (index === state.level) dot.className = 'is-current';
      elements.lessonNav.append(dot);
    }
    elements.lessonNav.setAttribute('aria-label', t('navLabel'));

    const coinStage = state.level === 2;
    elements.brewScene.hidden = coinStage;
    elements.coinScene.hidden = !coinStage;
    if (coinStage) {
      [elements.catOne, elements.catTwo, elements.catThree].forEach((element, index) => {
        element.textContent = String(values[index]);
      });
    } else {
      const moonShare = (values[0] / total) * 100;
      elements.brewScene.style.setProperty('--moon-share', `${moonShare}%`);
      elements.moonAmount.textContent = String(values[0]);
      elements.mushroomAmount.textContent = String(values[1]);
    }

    elements.ratioEquation.textContent = `${currentLevel().ratio} = ${formulaFor(values)}`;
    elements.totalBadge.textContent = t('total', total, currentLevel().unit === 'coins' ? (lang === 'zh' ? '枚' : 'coins') : (lang === 'zh' ? '勺' : 'spoons'));
    elements.checkBtn.disabled = state.selected === null;
    elements.checkBtn.hidden = state.solved;
    elements.nextBtn.hidden = !state.solved;
    elements.nextBtn.querySelector('[data-t]').textContent = state.level === LEVELS.length - 1 ? t('finish') : t('next');

    renderChoices();
    elements.course.inert = state.completed;
    elements.finale.hidden = !state.completed;
    if (state.completed) requestAnimationFrame(() => elements.playAgainBtn.focus());

    elements.soundBtn.textContent = muted ? '🔇' : '🔊';
    elements.soundBtn.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
    elements.soundBtn.setAttribute('aria-pressed', String(muted));
    elements.themeBtn.setAttribute('aria-label', t('theme'));
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
      select: { notes: [330], duration: 0.08, type: 'triangle', gain: 0.045 },
      hint: { notes: [523, 659], duration: 0.1, type: 'sine', gain: 0.04 },
      error: { notes: [180, 135], duration: 0.14, type: 'sawtooth', gain: 0.035 },
      success: { notes: [392, 523, 659], duration: 0.12, type: 'triangle', gain: 0.055 },
      page: { notes: [294, 392], duration: 0.1, type: 'sine', gain: 0.04 },
      complete: { notes: [392, 494, 587, 784], duration: 0.15, type: 'triangle', gain: 0.06 },
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

  elements.checkBtn.addEventListener('click', checkRecipe);
  elements.nextBtn.addEventListener('click', nextRecipe);
  elements.resetBtn.addEventListener('click', resetRecipe);
  elements.hintBtn.addEventListener('click', showHint);
  elements.playAgainBtn.addEventListener('click', playAgain);
  elements.soundBtn.addEventListener('click', toggleSound);
  elements.langBtn.addEventListener('click', () => window.cool.preferences.toggleLang());
  elements.themeBtn.addEventListener('click', () => window.cool.preferences.toggleTheme());

  try {
    muted = localStorage.getItem(SOUND_KEY) === '1';
  } catch {
    muted = false;
  }

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
