(() => {
  'use strict';

  if (!window.cool?.preferences || !window.cool?.bindI18n) {
    const readPreference = (key, fallback) => {
      try {
        return localStorage.getItem(key) || fallback;
      } catch {
        return fallback;
      }
    };
    const writePreference = (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch {}
    };
    const listeners = new Set();
    let lang = readPreference(
      'kidslab.lang',
      navigator.language?.startsWith('zh') ? 'zh' : 'en',
    );
    let theme = readPreference(
      'kidslab.theme',
      matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    );
    const applyPreferences = () => {
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
      document.documentElement.dataset.theme = theme;
    };
    const notify = (kind, value) => {
      listeners.forEach((listener) => listener({ kind, value }));
    };
    const preferences = {
      get lang() { return lang; },
      get theme() { return theme; },
      toggleLang() {
        lang = lang === 'zh' ? 'en' : 'zh';
        writePreference('kidslab.lang', lang);
        applyPreferences();
        notify('lang', lang);
      },
      toggleTheme() {
        theme = theme === 'light' ? 'dark' : 'light';
        writePreference('kidslab.theme', theme);
        applyPreferences();
        notify('theme', theme);
      },
      subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    };
    window.cool = {
      preferences,
      bindI18n(messages, options = {}) {
        const translate = (key, ...args) => {
          const value = messages[lang]?.[key] ?? messages.zh?.[key] ?? messages.en?.[key];
          return typeof value === 'function' ? value(...args) : (value ?? key);
        };
        const render = (kind = 'lang') => {
          document.querySelectorAll('[data-t]').forEach((node) => {
            const value = translate(node.dataset.t);
            if (typeof value === 'string') node.textContent = value;
          });
          options.onChange?.({ kind, lang, theme, t: translate });
        };
        const unsubscribe = preferences.subscribe(({ kind }) => render(kind));
        render('init');
        return { t: translate, render, destroy: unsubscribe };
      },
      track() {},
      stage() {},
    };
    applyPreferences();
  }

  const I18N = {
    zh: {
      doc: '⚙️ 进位工厂 · KidsLab',
      back: '返回平台',
      title: '进位工厂',
      orderLabel: '今日订单',
      roundLabel: '订单',
      machineStatus: '机器状态',
      hint: '提示',
      reset: '重开',
      places: ['个位', '十位', '百位', '千位'],
      stories: {
        add: '把两批零件合在一起',
        subtract: '按订单取走指定零件',
      },
      status: {
        readyAdd: '待投料',
        readySub: '待读单',
        carrying: '等待压铸',
        borrowing: '等待拆件',
        inspect: '等待验收',
        complete: '验收合格',
      },
      actions: {
        load: (value) => `投放 +${value}`,
        read: (value) => `接下 −${value}`,
        inspect: '验收结果',
        ship: '出货并验收',
      },
      idle: '待机',
      bundle: '压 10→1',
      split: '拆 1→10',
      demand: (value) => `需 ${value}`,
      introAdd: '先把第二批零件倒进流水线。',
      introSub: '先接下出货单，看看每条线要取走几个。',
      loaded: '零件都进来了！哪条线攒够 10 个，就按下它的压铸杆。',
      loadedStable: '零件刚好不用进位，直接验收吧。',
      demandReady: '红牌是要取走的数量。不够时，从左边高一位拆 1 个。',
      canShip: '每条线的零件都够了，现在可以出货验收。',
      bundled: (place, next) => `哐当！10 个${place}压成 1 个${next}。`,
      splitDone: (place, lower) => `咔嚓！1 个${place}拆成 10 个${lower}。`,
      wrongAdd: (place) => `${place}还没有 10 个，先看看亮起来的压铸杆。`,
      wrongSub: '这根拆件杆现在帮不上忙，找亮起来的那一根。',
      actionEarlyAdd: '机器里还有一格超过 9，先完成进位。',
      actionEarlySub: '还有一格不够出货，先把高位零件拆开。',
      resultTitle: '验收合格！',
      finalTitle: '王牌厂长诞生！',
      next: '下一张订单',
      replay: '再跑一次工厂',
      resultAdd: (answer) => `每一位都不超过 9，机器读出的结果是 ${answer}。`,
      resultSub: (answer) => `取走订单需要的零件后，仓里正好剩下 ${answer}。`,
      finalText: '你完成了进位、退位和连环换位。记住：同一数位满 10 就向左换 1，不够减就从左边借 1 换 10。',
      hints: {
        load: '先按中间的大按钮，让第二个数进入机器。',
        read: '先按中间的大按钮，把每一位要取走的数量挂上红牌。',
        add: (place) => `看${place}：已经有 10 个或更多，按下它的黄色压铸杆。`,
        addDone: '每一位都在 0 到 9 之间，可以验收了。',
        subtract: (place, lower) => `从${place}拆 1 个，它会变成 10 个${lower}。`,
        subtractDone: '每条线都够出货了，按中间按钮验收。',
      },
    },
    en: {
      doc: '⚙️ Carry-Over Factory · KidsLab',
      back: 'Back',
      title: 'Carry-Over Factory',
      orderLabel: "Today's order",
      roundLabel: 'Order',
      machineStatus: 'Machine',
      hint: 'Hint',
      reset: 'Reset',
      places: ['ones', 'tens', 'hundreds', 'thousands'],
      stories: {
        add: 'Combine two batches of parts',
        subtract: 'Ship the requested parts',
      },
      status: {
        readyAdd: 'Load batch',
        readySub: 'Read order',
        carrying: 'Press parts',
        borrowing: 'Split parts',
        inspect: 'Inspect now',
        complete: 'Approved',
      },
      actions: {
        load: (value) => `Load +${value}`,
        read: (value) => `Take −${value}`,
        inspect: 'Inspect result',
        ship: 'Ship & inspect',
      },
      idle: 'Stand by',
      bundle: 'Press 10→1',
      split: 'Split 1→10',
      demand: (value) => `Need ${value}`,
      introAdd: 'Load the second batch into the place-value lines.',
      introSub: 'Read the shipping order to see how many parts each line needs.',
      loaded: 'Parts loaded! When a line has 10, pull its press lever.',
      loadedStable: 'No carrying needed. Inspect the result.',
      demandReady: 'Red tags show how many to ship. If short, split 1 part from the next place left.',
      canShip: 'Every line has enough parts. Ship and inspect.',
      bundled: (place, next) => `Clang! 10 ${place} became 1 ${next}.`,
      splitDone: (place, lower) => `Snip! 1 ${place} became 10 ${lower}.`,
      wrongAdd: (place) => `The ${place} line does not have 10 yet. Find the glowing lever.`,
      wrongSub: 'That splitter cannot help yet. Find the glowing lever.',
      actionEarlyAdd: 'One line is still above 9. Finish carrying first.',
      actionEarlySub: 'A line is still short. Split a higher-place part first.',
      resultTitle: 'Order approved!',
      finalTitle: 'Master Foreman!',
      next: 'Next order',
      replay: 'Run the factory again',
      resultAdd: (answer) => `Every place is now 0–9, so the machine reads ${answer}.`,
      resultSub: (answer) => `After shipping the requested parts, exactly ${answer} remains.`,
      finalText: 'You finished carrying, borrowing, and chain exchanges. Remember: trade 10 for 1 place left; when short, borrow 1 and trade it for 10.',
      hints: {
        load: 'Press the large middle button to load the second number.',
        read: 'Press the large middle button to hang demand tags on each place.',
        add: (place) => `Look at ${place}: it has at least 10. Pull its glowing press lever.`,
        addDone: 'Every place is between 0 and 9. Inspect the result.',
        subtract: (place, lower) => `Split 1 ${place}; it becomes 10 ${lower}.`,
        subtractDone: 'Every line can fill the order. Press the middle button.',
      },
    },
  };

  const ROUNDS = [
    { a: 47, b: 38, op: 'add', face: '👩‍🏭' },
    { a: 68, b: 57, op: 'add', face: '🧑‍🔧' },
    { a: 286, b: 175, op: 'add', face: '👨‍🏭' },
    { a: 999, b: 1, op: 'add', face: '🤖', magic: true },
    { a: 83, b: 47, op: 'subtract', face: '👩‍🔧' },
    { a: 302, b: 178, op: 'subtract', face: '🧑‍🏭' },
  ];

  let t = (key) => key;
  const state = {
    round: 0,
    phase: 'intro',
    counts: [0, 0, 0, 0],
    demand: [0, 0, 0, 0],
    bolts: 3,
    hintTimer: 0,
    muted: false,
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const els = {
    factory: $('#factory'),
    foreman: $('#foremanFace'),
    order: $('#orderText'),
    story: $('#orderStory'),
    round: $('#roundText'),
    bolts: $('#bolts'),
    formulaLeft: $('#formulaLeft'),
    resultValue: $('#formulaResult'),
    status: $('#machineStatus'),
    needle: $('#gaugeNeedle'),
    feedback: $('#feedback'),
    action: $('#actionBtn'),
    actionIcon: $('#actionIcon'),
    actionText: $('#actionText'),
    hint: $('#hintBtn'),
    reset: $('#resetBtn'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
    result: $('#result'),
    resultStamp: $('#resultStamp'),
    resultTitle: $('#resultTitle'),
    resultText: $('#resultText'),
    next: $('#nextBtn'),
    nextText: $('#nextText'),
    sparks: $('#sparks'),
  };
  const lines = $$('.place-line').map((line) => ({
    line,
    index: Number(line.dataset.index),
    label: line.querySelector('[data-place-label]'),
    parts: line.querySelector('[data-parts]'),
    count: line.querySelector('[data-count]'),
    demand: line.querySelector('[data-demand]'),
    lever: line.querySelector('[data-lever]'),
    leverLabel: line.querySelector('[data-lever-label]'),
  }));

  let audio = null;
  function tone(frequency = 440, duration = 0.08, delay = 0, type = 'triangle') {
    if (state.muted) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const start = audio.currentTime + delay;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.075, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.03);
    } catch {}
  }
  const clang = () => [180, 280].forEach((frequency, index) => tone(frequency, 0.13, index * 0.055, 'square'));
  const snip = () => [520, 360].forEach((frequency, index) => tone(frequency, 0.09, index * 0.05, 'triangle'));
  const successSound = () => [392, 523, 659, 784].forEach((frequency, index) => tone(frequency, 0.2, index * 0.075));
  const errorSound = () => [170, 135].forEach((frequency, index) => tone(frequency, 0.1, index * 0.07, 'sawtooth'));

  const digits = (value) => [
    value % 10,
    Math.floor(value / 10) % 10,
    Math.floor(value / 100) % 10,
    Math.floor(value / 1000) % 10,
  ];
  const round = () => ROUNDS[state.round];
  const operation = () => round().op;
  const answer = () => operation() === 'add' ? round().a + round().b : round().a - round().b;
  const formula = () => `${round().a} ${operation() === 'add' ? '+' : '−'} ${round().b}`;
  const valueFromCounts = () => state.counts.reduce((sum, count, index) => sum + count * (10 ** index), 0);
  const overflowIndex = () => state.counts.findIndex((count, index) => count >= 10 && index < 3);
  const canShip = () => state.counts.every((count, index) => count >= state.demand[index]);

  function borrowSource() {
    for (let index = 0; index < 4; index += 1) {
      if (state.counts[index] >= state.demand[index]) continue;
      for (let source = index + 1; source < 4; source += 1) {
        if (state.counts[source] > 0) return source;
      }
    }
    return -1;
  }

  function setFeedback(message, kind = '') {
    els.feedback.textContent = message;
    els.feedback.className = `feedback${kind ? ` is-${kind}` : ''}`;
    resetIdleHint();
  }

  function setMachineStatus(key, pressure) {
    els.status.textContent = t('status')[key];
    els.needle.style.transform = `rotate(${pressure}deg)`;
  }

  function renderParts(target, count) {
    target.replaceChildren();
    for (let index = 0; index < count; index += 1) {
      const part = document.createElement('i');
      part.className = 'part';
      part.style.animationDelay = `${Math.min(index * 0.018, 0.18)}s`;
      target.append(part);
    }
  }

  function render() {
    const current = round();
    const op = operation();
    const overflow = overflowIndex();
    const source = borrowSource();

    document.title = t('doc');
    els.lang.textContent = window.cool.preferences.lang === 'zh' ? 'EN' : '中';
    els.theme.textContent = window.cool.preferences.theme === 'light' ? '🌙' : '☀️';
    els.sound.textContent = state.muted ? '🔇' : '🔊';
    els.foreman.textContent = current.face;
    els.order.textContent = formula();
    els.story.textContent = t('stories')[op];
    els.round.textContent = `${state.round + 1}/${ROUNDS.length}`;
    els.bolts.textContent = '🔩'.repeat(state.bolts) + '·'.repeat(3 - state.bolts);
    els.formulaLeft.textContent = formula();
    els.resultValue.textContent = state.phase === 'done' ? answer() : '?';
    els.factory.dataset.mode = op;

    lines.forEach(({ line, index, label, parts, count, demand, lever, leverLabel }) => {
      const place = t('places')[index];
      label.textContent = place;
      count.textContent = state.counts[index];
      renderParts(parts, state.counts[index]);
      const showDemand = op === 'subtract' && state.phase !== 'intro';
      demand.hidden = !showDemand;
      demand.textContent = showDemand ? t('demand', state.demand[index]) : '';

      const ready = state.phase === 'work' && (
        (op === 'add' && overflow === index) ||
        (op === 'subtract' && source === index)
      );
      line.classList.toggle('is-ready', ready);
      lever.classList.toggle('is-ready', ready);
      lever.setAttribute('aria-disabled', String(!ready));
      leverLabel.textContent = state.phase === 'work' ? (op === 'add' ? t('bundle') : t('split')) : t('idle');
      lever.setAttribute('aria-label', `${place}: ${leverLabel.textContent}`);
    });

    if (state.phase === 'intro') {
      const isAdd = op === 'add';
      els.actionIcon.textContent = isAdd ? '⬇' : '📋';
      els.actionText.textContent = isAdd ? t('actions').load(current.b) : t('actions').read(current.b);
      setMachineStatus(isAdd ? 'readyAdd' : 'readySub', -45);
    } else if (state.phase === 'work') {
      const readyForAction = op === 'add' ? overflow < 0 : canShip();
      els.actionIcon.textContent = readyForAction ? '✓' : '⚙';
      els.actionText.textContent = op === 'add' ? t('actions').inspect : t('actions').ship;
      setMachineStatus(
        readyForAction ? 'inspect' : (op === 'add' ? 'carrying' : 'borrowing'),
        readyForAction ? -10 : 38,
      );
    } else {
      els.actionIcon.textContent = '✓';
      els.actionText.textContent = op === 'add' ? t('actions').inspect : t('actions').ship;
      setMachineStatus('complete', -20);
    }
  }

  function resetIdleHint() {
    clearTimeout(state.hintTimer);
    if (state.phase === 'done') return;
    state.hintTimer = setTimeout(showHint, 20000);
  }

  function resetRound() {
    const current = round();
    state.phase = 'intro';
    state.counts = digits(current.a);
    state.demand = digits(current.b);
    state.bolts = 3;
    els.result.hidden = true;
    els.factory.classList.remove('is-magic', 'is-error', 'is-working');
    setFeedback(current.op === 'add' ? t('introAdd') : t('introSub'));
    render();
    window.cool?.stage(`carry-factory-round-${state.round + 1}`);
  }

  function animateFactory(kind = 'is-working') {
    els.factory.classList.remove(kind);
    void els.factory.offsetWidth;
    els.factory.classList.add(kind);
    setTimeout(() => els.factory.classList.remove(kind), 500);
  }

  function makeSparks(index, count = 9) {
    const line = lines.find((item) => item.index === index)?.line;
    if (!line) return;
    const factoryRect = els.factory.getBoundingClientRect();
    const rect = line.getBoundingClientRect();
    for (let sparkIndex = 0; sparkIndex < count; sparkIndex += 1) {
      const spark = document.createElement('i');
      spark.className = 'spark';
      spark.style.left = `${rect.left - factoryRect.left + rect.width / 2}px`;
      spark.style.top = `${rect.top - factoryRect.top + rect.height * 0.62}px`;
      spark.style.setProperty('--spark-x', `${(sparkIndex - count / 2) * 13}px`);
      spark.style.setProperty('--spark-y', `${-38 - (sparkIndex % 3) * 22}px`);
      els.sparks.append(spark);
      setTimeout(() => spark.remove(), 850);
    }
  }

  function markMistake(message) {
    state.bolts = Math.max(1, state.bolts - 1);
    setFeedback(message, 'error');
    animateFactory('is-error');
    errorSound();
    render();
    window.cool?.track('wrong-lever');
  }

  function startWork() {
    const current = round();
    state.phase = 'work';
    if (current.op === 'add') {
      const added = digits(current.b);
      state.counts = state.counts.map((count, index) => count + added[index]);
      setFeedback(overflowIndex() >= 0 ? t('loaded') : t('loadedStable'), 'good');
      clang();
      window.cool?.track('load-addend');
    } else {
      setFeedback(canShip() ? t('canShip') : t('demandReady'), 'good');
      tone(440, 0.1);
      window.cool?.track('read-shipping-order');
    }
    animateFactory();
    render();
  }

  function useLever(index) {
    if (state.phase !== 'work') {
      markMistake(operation() === 'add' ? t('wrongAdd', t('places')[index]) : t('wrongSub'));
      return;
    }

    if (operation() === 'add') {
      const valid = overflowIndex();
      if (index !== valid) {
        markMistake(t('wrongAdd', t('places')[index]));
        return;
      }
      state.counts[index] -= 10;
      state.counts[index + 1] += 1;
      clang();
      makeSparks(index);
      setFeedback(t('bundled', t('places')[index], t('places')[index + 1]), 'good');
      window.cool?.track(`carry-${index}`);
      if (round().magic) els.factory.classList.add('is-magic');
    } else {
      const valid = borrowSource();
      if (index !== valid || index <= 0) {
        markMistake(t('wrongSub'));
        return;
      }
      state.counts[index] -= 1;
      state.counts[index - 1] += 10;
      snip();
      makeSparks(index);
      setFeedback(t('splitDone', t('places')[index], t('places')[index - 1]), 'good');
      window.cool?.track(`borrow-${index}`);
    }

    animateFactory();
    render();
    if (operation() === 'add' && overflowIndex() < 0) setFeedback(t('hints').addDone, 'good');
    if (operation() === 'subtract' && canShip()) setFeedback(t('canShip'), 'good');
  }

  function completeRound() {
    if (operation() === 'subtract') {
      state.counts = state.counts.map((count, index) => count - state.demand[index]);
    }
    state.phase = 'done';
    render();
    successSound();
    makeSparks(0, 15);
    const final = state.round === ROUNDS.length - 1;
    els.resultStamp.textContent = answer();
    els.resultTitle.textContent = final ? t('finalTitle') : t('resultTitle');
    els.resultText.textContent = final
      ? t('finalText')
      : (operation() === 'add' ? t('resultAdd', answer()) : t('resultSub', answer()));
    els.nextText.textContent = final ? t('replay') : t('next');
    els.result.hidden = false;
    els.next.focus();
    window.cool?.track('complete-order');
    if (final) window.cool?.stage('carry-factory-complete');
  }

  function handleAction() {
    if (state.phase === 'intro') {
      startWork();
      return;
    }
    if (state.phase !== 'work') return;
    if (operation() === 'add') {
      if (overflowIndex() >= 0) {
        markMistake(t('actionEarlyAdd'));
        return;
      }
    } else if (!canShip()) {
      markMistake(t('actionEarlySub'));
      return;
    }
    completeRound();
  }

  function showHint() {
    if (state.phase === 'intro') {
      setFeedback(operation() === 'add' ? t('hints').load : t('hints').read);
      return;
    }
    if (state.phase !== 'work') return;
    if (operation() === 'add') {
      const index = overflowIndex();
      setFeedback(index >= 0 ? t('hints').add(t('places')[index]) : t('hints').addDone);
    } else {
      const source = borrowSource();
      setFeedback(
        source >= 0
          ? t('hints').subtract(t('places')[source], t('places')[source - 1])
          : t('hints').subtractDone,
      );
    }
    window.cool?.track('request-hint');
  }

  lines.forEach(({ index, lever }) => lever.addEventListener('click', () => useLever(index)));
  els.action.addEventListener('click', handleAction);
  els.hint.addEventListener('click', showHint);
  els.reset.addEventListener('click', () => {
    resetRound();
    window.cool?.track('reset-order');
  });
  els.next.addEventListener('click', () => {
    if (state.round === ROUNDS.length - 1) state.round = 0;
    else state.round += 1;
    resetRound();
  });
  els.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  els.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  els.sound.addEventListener('click', () => {
    state.muted = !state.muted;
    render();
  });

  window.cool.bindI18n(I18N, {
    onChange({ t: translate }) {
      t = translate;
      if (state.phase === 'intro') {
        els.feedback.textContent = operation() === 'add' ? t('introAdd') : t('introSub');
      }
      render();
    },
  });
  resetRound();
})();
