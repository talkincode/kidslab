(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '巫师的罐子 · KidsLab',
      back: '返回平台',
      title: '巫师的罐子',
      eyebrow: '变量魔法课',
      tip: '按顺序放入咒语，再点“施法”。透明罐会告诉你每一步发生了什么。',
      missionLabel: '本节魔法任务',
      spellbookLabel: '你的咒语脚本',
      spellbookTitle: '从上到下执行',
      chooseSpell: '选择咒语卡',
      hint: '💡 递一条线索',
      cast: '✨ 开始施法',
      casting: '施法中…',
      reset: '重新开始',
      lessonPassed: '魔法生效',
      levels: ['金币补货', '驯龙时刻', '双罐交换'],
      missions: ['给金币罐补货', '先安抚，再让怒气翻倍', '交换红蓝两罐的内容'],
      goals: ['目标：金币 13', '目标：怒气先到 7，再到 14', '目标：红罐 8，蓝罐 3'],
      starts: [
        '金币现在是 8。选一句咒语，让它变成 13。',
        '怒气现在是 10。先减 3，再把当时的怒气翻倍。',
        '红罐是 3，蓝罐是 8。借空罐保存一个旧值，再交换它们。',
      ],
      slot: (n) => `第 ${n} 行：点下方咒语卡`,
      emptyScript: '咒语书还是空的，先放入咒语卡。',
      scriptFull: '咒语行已经写满了。点某一行可以擦掉重写。',
      runningLine: (n, code) => `正在执行第 ${n} 行：${code}`,
      wrong: [
        '罐子停在 5，不是 13。“金币 = 5”会把旧金币整个换掉。擦掉这行再试！',
        '顺序不对：右边总会先读取“此刻”的怒气。擦掉咒语，先安抚龙。',
        '交换失败：旧值被盖住就找不回来了。先把红罐暂存在空罐里。',
      ],
      success: [
        '8 + 5 = 13！右边先读出旧金币 8，算完以后，左边的金币罐接住 13。',
        '怒气从 10 变成 7，再读取 7 + 7 得到 14。同一个变量会随脚本一步步变化。',
        '空罐先保存红罐的 3，所以红罐被改成 8 后，仍能把旧的 3 倒进蓝罐。',
      ],
      completeTitles: ['金币罐补满啦！', '龙安静地喷出爱心火！', '交换魔法完成！'],
      next: '下一本咒语书',
      replay: '从头再玩',
      locked: '先完成前一本咒语书。',
      hints: [
        '找一张会“读出旧金币，再多放 5 枚”的卡。',
        '顺序很重要：第一行先减 3，第二行再让右边出现两次“怒气”。',
        '空罐叫“暂存”。第一行先让它记住红罐还没被覆盖时的值。',
      ],
      jarNames: { coins: '金币', anger: '怒气', red: '红罐', blue: '蓝罐', temp: '暂存' },
      empty: '空',
      cardMeanings: {
        add5: '在旧金币上增加 5',
        set5: '把金币直接换成 5',
        sub5: '从旧金币减去 5',
        calm3: '让怒气减少 3',
        doubleAnger: '读取两次旧怒气并相加',
        add3: '让怒气增加 3',
        set2: '把怒气直接换成 2',
        tempRed: '先保存红罐的旧值',
        redBlue: '把蓝罐的值倒进红罐',
        blueTemp: '把暂存值倒进蓝罐',
        blueRed: '把红罐的值倒进蓝罐',
      },
      codes: {
        add5: '金币 = 金币 + 5',
        set5: '金币 = 5',
        sub5: '金币 = 金币 - 5',
        calm3: '怒气 = 怒气 - 3',
        doubleAnger: '怒气 = 怒气 + 怒气',
        add3: '怒气 = 怒气 + 3',
        set2: '怒气 = 2',
        tempRed: '暂存 = 红罐',
        redBlue: '红罐 = 蓝罐',
        blueTemp: '蓝罐 = 暂存',
        blueRed: '蓝罐 = 红罐',
      },
    },
    en: {
      doc: "The Wizard's Jars · KidsLab",
      back: 'Back to platform',
      title: "The Wizard's Jars",
      eyebrow: 'Variable Magic Class',
      tip: 'Place spells in order, then tap Cast. The clear jars show what every line changes.',
      missionLabel: 'Magic mission',
      spellbookLabel: 'Your spell script',
      spellbookTitle: 'Runs from top to bottom',
      chooseSpell: 'Choose a spell card',
      hint: '💡 Ask for a clue',
      cast: '✨ Cast the spell',
      casting: 'Casting…',
      reset: 'Restart',
      lessonPassed: 'Spell worked',
      levels: ['Coin Refill', 'Dragon Taming', 'Jar Swap'],
      missions: ['Refill the coin jar', 'Calm, then double the anger', 'Swap the red and blue jars'],
      goals: ['Goal: coins 13', 'Goal: anger goes to 7, then 14', 'Goal: red 8, blue 3'],
      starts: [
        'Coins are 8. Choose one spell that changes them to 13.',
        'Anger is 10. Subtract 3 first, then double the anger at that moment.',
        'Red is 3 and blue is 8. Save an old value in the empty jar, then swap them.',
      ],
      slot: (n) => `Line ${n}: tap a spell card below`,
      emptyScript: 'The spellbook is empty. Add a spell card first.',
      scriptFull: 'Every line is full. Tap a line to erase it and rewrite.',
      runningLine: (n, code) => `Running line ${n}: ${code}`,
      wrong: [
        'The jar stopped at 5, not 13. “coins = 5” replaces all the old coins. Erase it and try again!',
        'The order is wrong. The right side always reads the anger at that moment. Erase and calm the dragon first.',
        'The swap failed. Once an old value is covered, it is gone. Save red in the empty jar first.',
      ],
      success: [
        '8 + 5 = 13! The right side reads the old 8 and calculates first; then the coin jar on the left receives 13.',
        'Anger changes from 10 to 7, then reads 7 + 7 to make 14. One variable can change line by line.',
        'The empty jar saves red’s old 3. After red becomes 8, that saved 3 can still be poured into blue.',
      ],
      completeTitles: ['Coin jar refilled!', 'The dragon breathes heart-shaped fire!', 'Swap spell complete!'],
      next: 'Next spellbook',
      replay: 'Play from the start',
      locked: 'Finish the previous spellbook first.',
      hints: [
        'Find the card that reads the old coins and adds 5.',
        'Order matters: subtract 3 on line one, then use “anger” twice on the right.',
        'The empty jar is called “temp.” First, let it remember red before red is overwritten.',
      ],
      jarNames: { coins: 'coins', anger: 'anger', red: 'red', blue: 'blue', temp: 'temp' },
      empty: 'empty',
      cardMeanings: {
        add5: 'add 5 to the old coins',
        set5: 'replace all coins with 5',
        sub5: 'subtract 5 from old coins',
        calm3: 'reduce anger by 3',
        doubleAnger: 'read old anger twice and add',
        add3: 'increase anger by 3',
        set2: 'replace anger with 2',
        tempRed: 'save red’s old value first',
        redBlue: 'pour blue’s value into red',
        blueTemp: 'pour the saved value into blue',
        blueRed: 'pour red’s value into blue',
      },
      codes: {
        add5: 'coins = coins + 5',
        set5: 'coins = 5',
        sub5: 'coins = coins - 5',
        calm3: 'anger = anger - 3',
        doubleAnger: 'anger = anger + anger',
        add3: 'anger = anger + 3',
        set2: 'anger = 2',
        tempRed: 'temp = red',
        redBlue: 'red = blue',
        blueTemp: 'blue = temp',
        blueRed: 'blue = red',
      },
    },
  };

  const CARD_ACTIONS = {
    add5: (state) => { state.coins += 5; },
    set5: (state) => { state.coins = 5; },
    sub5: (state) => { state.coins -= 5; },
    calm3: (state) => { state.anger -= 3; },
    doubleAnger: (state) => { state.anger += state.anger; },
    add3: (state) => { state.anger += 3; },
    set2: (state) => { state.anger = 2; },
    tempRed: (state) => { state.temp = state.red; },
    redBlue: (state) => { state.red = state.blue; },
    blueTemp: (state) => { state.blue = state.temp; },
    blueRed: (state) => { state.blue = state.red; },
  };

  const LEVELS = [
    {
      initial: { coins: 8 },
      jars: ['coins'],
      slots: 1,
      cards: ['add5', 'set5', 'sub5'],
      answer: ['add5'],
      magic: '🪙✨',
    },
    {
      initial: { anger: 10 },
      jars: ['anger'],
      slots: 2,
      cards: ['calm3', 'doubleAnger', 'add3', 'set2'],
      answer: ['calm3', 'doubleAnger'],
      magic: '🐉💗',
    },
    {
      initial: { red: 3, blue: 8, temp: null },
      jars: ['red', 'temp', 'blue'],
      slots: 3,
      cards: ['tempRed', 'redBlue', 'blueTemp', 'blueRed'],
      answer: ['tempRed', 'redBlue', 'blueTemp'],
      magic: '🔴⇄🔵',
    },
  ];

  const SAVE_KEY = 'kidslab.wizard-jars';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    lang: $('#langBtn'),
    theme: $('#themeBtn'),
    goal: $('#goalChip'),
    levels: $('#levelStrip'),
    mission: $('#missionTitle'),
    feedback: $('#feedback'),
    jars: $('#jarRack'),
    slots: $('#scriptSlots'),
    palette: $('#spellPalette'),
    hint: $('#hintBtn'),
    cast: $('#castBtn'),
    reset: $('#resetBtn'),
    modal: $('#modal'),
    modalMagic: $('#modalMagic'),
    modalTitle: $('#modalTitle'),
    modalText: $('#modalText'),
    next: $('#nextBtn'),
  };

  const saved = (() => {
    try {
      const value = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  })();

  let t = (key) => key;
  let lang = window.cool.preferences.lang;
  let levelIndex = Math.min(2, Math.max(0, Number(saved.level) || 0));
  let unlocked = Math.min(2, Math.max(levelIndex, Number(saved.unlocked) || 0));
  let values = {};
  let script = [];
  let activeLine = -1;
  let running = false;
  let hintTimer = 0;

  function level() {
    return LEVELS[levelIndex];
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ level: levelIndex, unlocked }));
    } catch {
      // Progress persistence is optional; play remains available in this tab.
    }
  }

  function setFeedback(message) {
    el.feedback.textContent = message;
  }

  function scheduleHint() {
    clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      if (!running && !el.modal.hidden) return;
      if (!running) setFeedback(t('hints')[levelIndex]);
    }, 30000);
  }

  function addCard(id) {
    if (running) return;
    if (script.length >= level().slots) {
      setFeedback(t('scriptFull'));
      return;
    }
    if (script.includes(id)) return;
    script.push(id);
    setFeedback(t('starts')[levelIndex]);
    window.cool.track('add_variable_spell');
    scheduleHint();
    render();
  }

  function removeCard(index) {
    if (running || index >= script.length) return;
    script.splice(index, 1);
    setFeedback(t('starts')[levelIndex]);
    window.cool.track('rewrite_variable_spell');
    scheduleHint();
    render();
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function castScript() {
    if (running) return;
    if (script.length !== level().slots) {
      setFeedback(t('emptyScript'));
      return;
    }

    running = true;
    values = { ...level().initial };
    el.cast.textContent = t('casting');
    render();
    window.cool.track('run_variable_script');

    for (let index = 0; index < script.length; index += 1) {
      activeLine = index;
      setFeedback(t('runningLine', index + 1, t('codes')[script[index]]));
      render();
      await wait(320);
      CARD_ACTIONS[script[index]](values);
      render();
      await wait(360);
    }

    activeLine = -1;
    running = false;
    const correct = script.every((id, index) => id === level().answer[index]);
    if (!correct) {
      setFeedback(t('wrong')[levelIndex]);
      window.cool.track('retry_variable_script');
      render();
      scheduleHint();
      return;
    }

    setFeedback(t('success')[levelIndex]);
    window.cool.track('solve_variable_spell');
    await wait(300);
    showCompletion();
  }

  function showCompletion() {
    if (levelIndex < LEVELS.length - 1) {
      unlocked = Math.max(unlocked, levelIndex + 1);
      persist();
    } else {
      window.cool.complete?.();
    }
    el.modalMagic.textContent = level().magic;
    el.modalTitle.textContent = t('completeTitles')[levelIndex];
    el.modalText.textContent = t('success')[levelIndex];
    el.next.textContent = levelIndex === LEVELS.length - 1 ? t('replay') : t('next');
    el.modal.hidden = false;
    renderLevels();
  }

  function resetLevel() {
    clearTimeout(hintTimer);
    values = { ...level().initial };
    script = [];
    activeLine = -1;
    running = false;
    el.modal.hidden = true;
    setFeedback(t('starts')[levelIndex]);
    window.cool.stage(`spellbook-${levelIndex + 1}`);
    scheduleHint();
    render();
  }

  function setLevel(index) {
    if (index > unlocked) {
      setFeedback(t('locked'));
      return;
    }
    levelIndex = index;
    persist();
    resetLevel();
  }

  function nextLevel() {
    el.modal.hidden = true;
    setLevel(levelIndex === LEVELS.length - 1 ? 0 : levelIndex + 1);
  }

  function showHint() {
    setFeedback(t('hints')[levelIndex]);
    window.cool.track('open_variable_hint');
    scheduleHint();
  }

  function renderLevels() {
    el.levels.innerHTML = t('levels').map((name, index) => {
      const disabled = index > unlocked;
      return `<button class="level-button ${index === levelIndex ? 'is-active' : ''} ${index < unlocked ? 'is-done' : ''}" type="button" data-level="${index}" ${disabled ? 'disabled' : ''}>${index + 1}. ${name}</button>`;
    }).join('');
    el.levels.querySelectorAll('[data-level]').forEach((button) => {
      button.addEventListener('click', () => setLevel(Number(button.dataset.level)));
    });
  }

  function jarFill(value) {
    if (value == null) return 0;
    return Math.max(0.14, Math.min(0.88, (18 + value * 4.5) / 100));
  }

  function renderJars() {
    el.jars.innerHTML = level().jars.map((key) => {
      const value = values[key];
      const className = key === 'temp' ? 'jar--temp' : `jar--${key}`;
      const displayValue = value == null ? t('empty') : value;
      return `<div class="jar-wrap">
        <div class="jar ${className}">
          <div class="jar__cork"></div>
          <div class="jar__glass">
            <div class="jar__liquid" style="--fill:${jarFill(value)}"></div>
            <strong>${displayValue}</strong>
            <i aria-hidden="true"></i>
          </div>
        </div>
        <span>${t('jarNames')[key]}</span>
      </div>`;
    }).join('');
  }

  function renderScript() {
    el.slots.innerHTML = Array.from({ length: level().slots }, (_, index) => {
      const id = script[index];
      const active = index === activeLine;
      if (!id) {
        return `<button class="script-line is-empty" type="button" disabled><span>${index + 1}</span>${t('slot', index + 1)}</button>`;
      }
      return `<button class="script-line ${active ? 'is-running' : ''}" type="button" data-slot="${index}" ${running ? 'disabled' : ''}><span>${index + 1}</span><code>${t('codes')[id]}</code><b aria-hidden="true">×</b></button>`;
    }).join('');
    el.slots.querySelectorAll('[data-slot]').forEach((button) => {
      button.addEventListener('click', () => removeCard(Number(button.dataset.slot)));
    });
  }

  function renderPalette() {
    el.palette.innerHTML = level().cards.map((id) => {
      const used = script.includes(id);
      return `<button class="spell-card" type="button" data-card="${id}" ${used || running ? 'disabled' : ''}>
        <code>${t('codes')[id]}</code>
        <span>${t('cardMeanings')[id]}</span>
      </button>`;
    }).join('');
    el.palette.querySelectorAll('[data-card]').forEach((button) => {
      button.addEventListener('click', () => addCard(button.dataset.card));
    });
  }

  function render() {
    el.goal.textContent = t('goals')[levelIndex];
    el.mission.textContent = t('missions')[levelIndex];
    el.reset.setAttribute('aria-label', t('reset'));
    el.cast.textContent = running ? t('casting') : t('cast');
    el.cast.disabled = running || script.length !== level().slots;
    renderLevels();
    renderJars();
    renderScript();
    renderPalette();
  }

  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.hint.addEventListener('click', showHint);
  el.cast.addEventListener('click', castScript);
  el.reset.addEventListener('click', resetLevel);
  el.next.addEventListener('click', nextLevel);

  window.cool.bindI18n(I18N, {
    onChange(context) {
      t = context.t;
      lang = context.lang;
      document.title = t('doc');
      el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      el.theme.textContent = context.theme === 'light' ? '🌙' : '☀️';
      setFeedback(t('starts')[levelIndex]);
      render();
    },
  });

  resetLevel();
})();
