(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '搭配衣橱 · KidsLab',
      back: '返回平台',
      title: '搭配衣橱',
      eyebrow: '羊驼造型工作室',
      tip: '帽子选一顶，上衣选一件，找齐所有不重样的搭配。',
      mission: '今日造型单',
      chooseHat: '先选一顶帽子',
      chooseTop: '再选一件上衣',
      dress: '✨ 穿上这套',
      stockHats: '进几顶不同的帽子？',
      stockTops: '进几件不同的上衣？',
      order: '📦 提交进货单',
      hint: '💡 给我一点提示',
      reset: '重新开始',
      themeDark: '切换深色主题',
      themeLight: '切换浅色主题',
      showReady: '时装秀准备就绪',
      levels: ['试衣间', '花园秀', '进货单'],
      missions: ['让 2 × 2 棵搭配树开花', '找齐 3 × 2 套花园造型', '为 12 套时装秀设计进货单'],
      hats: {
        straw: '草帽',
        beret: '贝雷帽',
        party: '派对帽',
        top: '小礼帽',
        cloud: '云朵帽',
      },
      tops: {
        star: '星星上衣',
        rainbow: '彩虹上衣',
        flower: '花朵上衣',
        dot: '波点上衣',
      },
      start: '先从衣架上选一顶帽子和一件上衣吧！',
      ready: '选好啦！点“穿上这套”，看看是不是新搭配。',
      found: (count, total) => `新造型！搭配树开了一朵花，还差 ${total - count} 套。`,
      duplicate: '这套已经走过秀啦！换一顶帽子或一件上衣再试。',
      missing: '帽子和上衣都要选，才是一套完整搭配。',
      collectHint: (count, total) => count
        ? `已经找到 ${count} 套。固定一顶帽子，再把每件上衣轮流试一次。`
        : '先固定一顶帽子，把每件上衣都试一遍，再换下一顶帽子。',
      stockStart: '时装周要 12 套不同造型。选帽子数和上衣数，让它们相乘等于 12。',
      stockTry: (hats, tops, total) => `${hats} × ${tops} = ${total}，还不是 12 套。可以换一个因数继续试！`,
      stockReady: (hats, tops) => `${hats} × ${tops} = 12，进货单刚刚好！`,
      stockHint: '想一想：哪两个 2 到 6 之间的数相乘等于 12？',
      idleHint: '可以先固定一个选择，按顺序试另一个选择，不容易漏掉。',
      formula: (hats, tops, total) => `${hats} 顶帽子 × ${tops} 件上衣 = ${total} 套`,
      stockFormula: (hats, tops, total) => `${hats} × ${tops} = ${total} 套`,
      completeTitles: ['四套搭配都开花啦！', '六套花园造型全部登场！', '12 套时装秀进货完成！'],
      completeTexts: [
        '2 顶帽子，每顶都能配 2 件上衣：2 × 2 = 4 套。树的每一朵花就是一套不重复搭配。',
        '3 顶帽子，每顶都能配 2 件上衣：3 × 2 = 6 套。按树枝顺序找，就不会重复或漏掉。',
        '3 × 4 = 12，4 × 3 也等于 12。交换帽子数和上衣数，搭配总数不会变。',
      ],
      next: '下一张造型单',
      replay: '重新开秀',
      locked: '先完成前一张造型单',
      hatsCount: (count) => `${count} 顶帽子`,
      topsCount: (count) => `${count} 件上衣`,
      treeLabel: '搭配树',
      modelLabel: '小羊驼模特',
    },
    en: {
      doc: 'Combo Closet · KidsLab',
      back: 'Back to platform',
      title: 'Combo Closet',
      eyebrow: 'Alpaca Styling Studio',
      tip: 'Pick one hat and one top. Find every outfit without repeats.',
      mission: 'Today’s style card',
      chooseHat: 'Choose one hat',
      chooseTop: 'Choose one top',
      dress: '✨ Wear this outfit',
      stockHats: 'How many different hats?',
      stockTops: 'How many different tops?',
      order: '📦 Send the stock order',
      hint: '💡 Give me a hint',
      reset: 'Restart',
      themeDark: 'Switch to dark theme',
      themeLight: 'Switch to light theme',
      showReady: 'Ready for the runway',
      levels: ['Fitting Room', 'Garden Show', 'Stock Order'],
      missions: ['Bloom a 2 × 2 outfit tree', 'Find all 3 × 2 garden looks', 'Stock exactly 12 runway looks'],
      hats: {
        straw: 'Straw hat',
        beret: 'Beret',
        party: 'Party hat',
        top: 'Top hat',
        cloud: 'Cloud hat',
      },
      tops: {
        star: 'Star top',
        rainbow: 'Rainbow top',
        flower: 'Flower top',
        dot: 'Polka-dot top',
      },
      start: 'Choose one hat and one top from the racks!',
      ready: 'Great picks! Tap “Wear this outfit” to see if it is new.',
      found: (count, total) => `New look! The tree bloomed. ${total - count} outfit${total - count === 1 ? '' : 's'} to go.`,
      duplicate: 'That look has already walked the runway. Change the hat or the top!',
      missing: 'Choose both a hat and a top to make a complete outfit.',
      collectHint: (count) => count
        ? `You found ${count}. Keep one hat fixed and try every top with it.`
        : 'Keep one hat fixed, try every top, then move to the next hat.',
      stockStart: 'The show needs 12 unique looks. Pick hat and top counts whose product is 12.',
      stockTry: (hats, tops, total) => `${hats} × ${tops} = ${total}, not 12 yet. Change one factor and try again!`,
      stockReady: (hats, tops) => `${hats} × ${tops} = 12. The stock order is just right!`,
      stockHint: 'Which two numbers from 2 to 6 multiply to make 12?',
      idleHint: 'Fix one choice and try the other choices in order so none are missed.',
      formula: (hats, tops, total) => `${hats} hats × ${tops} tops = ${total} looks`,
      stockFormula: (hats, tops, total) => `${hats} × ${tops} = ${total} looks`,
      completeTitles: ['All four outfits are blooming!', 'All six garden looks hit the runway!', 'Stock ready for 12 runway looks!'],
      completeTexts: [
        'Each of 2 hats pairs with 2 tops: 2 × 2 = 4 outfits. Every flower at the end of the tree is one unique look.',
        'Each of 3 hats pairs with 2 tops: 3 × 2 = 6 outfits. Following the branches prevents repeats and gaps.',
        '3 × 4 = 12, and 4 × 3 = 12 too. Swapping the hat and top counts does not change the total.',
      ],
      next: 'Next style card',
      replay: 'Run the show again',
      locked: 'Finish the previous style card first',
      hatsCount: (count) => `${count} hats`,
      topsCount: (count) => `${count} tops`,
      treeLabel: 'Combination tree',
      modelLabel: 'Alpaca model',
    },
  };

  const LEVELS = [
    {
      mode: 'collect',
      hats: [
        { id: 'straw', icon: '👒' },
        { id: 'beret', icon: '🧢' },
      ],
      tops: [
        { id: 'star', icon: '★', color: '#79d8bd' },
        { id: 'rainbow', icon: '⌁', color: '#73b9e6' },
      ],
    },
    {
      mode: 'collect',
      hats: [
        { id: 'party', icon: '🥳' },
        { id: 'top', icon: '🎩' },
        { id: 'cloud', icon: '☁️' },
      ],
      tops: [
        { id: 'flower', icon: '✿', color: '#f3a4b6' },
        { id: 'dot', icon: '●', color: '#ffd966' },
      ],
    },
    {
      mode: 'stock',
      target: 12,
    },
  ];

  const $ = (selector) => document.querySelector(selector);
  const SAVE_KEY = 'kidslab.combo-closet';
  const saved = (() => {
    try {
      const value = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  })();

  const el = {
    lang: $('#langBtn'),
    theme: $('#themeBtn'),
    stamp: $('#orderStamp'),
    levels: $('#levelStrip'),
    mission: $('#missionTitle'),
    reset: $('#resetBtn'),
    collect: $('#collectGame'),
    stock: $('#stockGame'),
    hats: $('#hatChoices'),
    tops: $('#topChoices'),
    alpaca: $('.alpaca'),
    alpacaHat: $('#alpacaHat'),
    alpacaTop: $('#alpacaTop'),
    dress: $('#dressBtn'),
    hatStock: $('#hatStock'),
    topStock: $('#topStock'),
    hatBox: $('#hatBoxCount'),
    topBox: $('#topBoxCount'),
    order: $('#orderBtn'),
    feedback: $('#feedback'),
    stylist: $('#stylistFace'),
    tree: $('#comboTree'),
    formula: $('#formula'),
    hint: $('#hintBtn'),
    modal: $('#modal'),
    modalTitle: $('#modalTitle'),
    modalText: $('#modalText'),
    celebration: $('#celebration'),
    next: $('#nextBtn'),
  };

  let t = (key) => key;
  let lang = window.cool.preferences.lang;
  let theme = window.cool.preferences.theme;
  let levelIndex = Math.min(2, Math.max(0, Number(saved.level) || 0));
  let unlocked = Math.min(2, Math.max(levelIndex, Number(saved.unlocked) || 0));
  let selectedHat = null;
  let selectedTop = null;
  let discovered = new Set();
  let stockHats = 2;
  let stockTops = 2;
  let completed = false;
  let idleTimer = 0;

  function level() {
    return LEVELS[levelIndex];
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ level: levelIndex, unlocked }));
    } catch {
      // Progress persistence is optional; the current session remains playable.
    }
  }

  function setFeedback(message, face = '🦙') {
    el.feedback.textContent = message;
    el.stylist.textContent = face;
  }

  function scheduleIdleHint() {
    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      if (!completed && el.modal.hidden) setFeedback(t(level().mode === 'stock' ? 'stockHint' : 'idleHint'), '💡');
    }, 30000);
  }

  function outfitKey(hat, top) {
    return `${hat}:${top}`;
  }

  function totalLooks(current = level()) {
    return current.mode === 'collect' ? current.hats.length * current.tops.length : current.target;
  }

  function chooseItem(type, id) {
    if (completed || level().mode !== 'collect') return;
    if (type === 'hat') selectedHat = id;
    else selectedTop = id;
    if (selectedHat && selectedTop) setFeedback(t('ready'), '✨');
    window.cool.track(type === 'hat' ? 'choose_hat' : 'choose_top');
    scheduleIdleHint();
    render();
  }

  function wearOutfit() {
    if (completed || level().mode !== 'collect') return;
    if (!selectedHat || !selectedTop) {
      setFeedback(t('missing'), '🪞');
      window.cool.track('try_incomplete_outfit');
      scheduleIdleHint();
      return;
    }

    const key = outfitKey(selectedHat, selectedTop);
    if (discovered.has(key)) {
      setFeedback(t('duplicate'), '🙈');
      el.alpaca.classList.remove('is-dressed');
      void el.alpaca.offsetWidth;
      el.alpaca.classList.add('is-dressed');
      window.cool.track('retry_duplicate_outfit');
      scheduleIdleHint();
      return;
    }

    discovered.add(key);
    const total = totalLooks();
    setFeedback(t('found', discovered.size, total), '🌼');
    window.cool.track('discover_outfit');
    el.alpaca.classList.remove('is-dressed');
    void el.alpaca.offsetWidth;
    el.alpaca.classList.add('is-dressed');
    render();

    if (discovered.size === total) {
      completed = true;
      clearTimeout(idleTimer);
      window.setTimeout(showCompletion, 420);
    } else {
      scheduleIdleHint();
    }
  }

  function chooseStock(type, value) {
    if (completed || level().mode !== 'stock') return;
    if (type === 'hat') stockHats = value;
    else stockTops = value;
    setFeedback(t('stockStart'), '📋');
    window.cool.track(type === 'hat' ? 'choose_hat_stock' : 'choose_top_stock');
    scheduleIdleHint();
    render();
  }

  function submitOrder() {
    if (completed || level().mode !== 'stock') return;
    const product = stockHats * stockTops;
    if (product !== level().target) {
      setFeedback(t('stockTry', stockHats, stockTops, product), '🧮');
      window.cool.track('retry_stock_order');
      scheduleIdleHint();
      render();
      return;
    }
    completed = true;
    clearTimeout(idleTimer);
    setFeedback(t('stockReady', stockHats, stockTops), '🎉');
    window.cool.track('complete_stock_order');
    render();
    window.setTimeout(showCompletion, 420);
  }

  function showHint() {
    if (level().mode === 'stock') {
      setFeedback(t('stockHint'), '💡');
    } else {
      setFeedback(t('collectHint', discovered.size, totalLooks()), '💡');
    }
    window.cool.track('open_combo_hint');
    scheduleIdleHint();
  }

  function showCompletion() {
    if (levelIndex < LEVELS.length - 1) {
      unlocked = Math.max(unlocked, levelIndex + 1);
      persist();
    } else {
      window.cool.complete?.();
    }
    el.celebration.textContent = levelIndex === 2 ? '📦✨' : levelIndex === 1 ? '🌸🦙🌸' : '🌳';
    el.modalTitle.textContent = t('completeTitles')[levelIndex];
    el.modalText.textContent = t('completeTexts')[levelIndex];
    el.next.textContent = levelIndex === LEVELS.length - 1 ? t('replay') : t('next');
    el.modal.hidden = false;
    renderLevels();
  }

  function resetLevel() {
    selectedHat = level().mode === 'collect' ? level().hats[0].id : null;
    selectedTop = level().mode === 'collect' ? level().tops[0].id : null;
    discovered = new Set();
    stockHats = 2;
    stockTops = 2;
    completed = false;
    el.modal.hidden = true;
    setFeedback(t(level().mode === 'stock' ? 'stockStart' : 'start'));
    window.cool.stage(`style-card-${levelIndex + 1}`);
    scheduleIdleHint();
    render();
  }

  function setLevel(index) {
    if (index > unlocked) {
      setFeedback(t('locked'), '🔒');
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

  function renderLevels() {
    el.levels.innerHTML = t('levels').map((name, index) => {
      const disabled = index > unlocked;
      const done = index < unlocked || (index === levelIndex && completed);
      return `<button class="level-button ${index === levelIndex ? 'is-active' : ''} ${done ? 'is-done' : ''}" type="button" data-level="${index}" ${disabled ? 'disabled' : ''}>${index + 1}. ${name}</button>`;
    }).join('');
    el.levels.querySelectorAll('[data-level]').forEach((button) => {
      button.addEventListener('click', () => setLevel(Number(button.dataset.level)));
    });
  }

  function renderChoiceRows() {
    const current = level();
    el.hats.innerHTML = current.hats.map((hat) =>
      `<button class="choice ${selectedHat === hat.id ? 'is-selected' : ''}" type="button" data-hat="${hat.id}" aria-label="${t('hats')[hat.id]}">${hat.icon}</button>`).join('');
    el.tops.innerHTML = current.tops.map((top) =>
      `<button class="choice ${selectedTop === top.id ? 'is-selected' : ''}" type="button" data-top="${top.id}" aria-label="${t('tops')[top.id]}">${top.icon}</button>`).join('');
    el.hats.querySelectorAll('[data-hat]').forEach((button) => {
      button.addEventListener('click', () => chooseItem('hat', button.dataset.hat));
    });
    el.tops.querySelectorAll('[data-top]').forEach((button) => {
      button.addEventListener('click', () => chooseItem('top', button.dataset.top));
    });

    const hat = current.hats.find((item) => item.id === selectedHat) || current.hats[0];
    const top = current.tops.find((item) => item.id === selectedTop) || current.tops[0];
    el.alpacaHat.textContent = hat.icon;
    el.alpacaTop.textContent = top.icon;
    el.alpacaTop.style.background = top.color;
    el.alpaca.setAttribute('aria-label', `${t('modelLabel')}: ${t('hats')[hat.id]}, ${t('tops')[top.id]}`);
  }

  function renderTree() {
    const current = level();
    el.tree.setAttribute('aria-label', t('treeLabel'));
    if (current.mode === 'stock') {
      const product = stockHats * stockTops;
      el.tree.className = 'combo-tree stock-tree';
      el.tree.innerHTML = `<div><div class="stock-tree__flower">${product === current.target ? '🌳✨' : '🌱'}</div><strong>${t('stockFormula', stockHats, stockTops, product)}</strong></div>`;
      return;
    }

    el.tree.className = 'combo-tree';
    el.tree.innerHTML = current.hats.map((hat) => `
      <div class="tree-branch">
        <span class="branch-hat" title="${t('hats')[hat.id]}">${hat.icon}</span>
        <div class="branch-leaves">
          ${current.tops.map((top) => {
            const found = discovered.has(outfitKey(hat.id, top.id));
            return `<span class="leaf ${found ? 'is-found' : ''}" title="${t('hats')[hat.id]} + ${t('tops')[top.id]}">${found ? top.icon : '？'}</span>`;
          }).join('')}
        </div>
      </div>`).join('');
  }

  function renderStockChoices() {
    const values = [2, 3, 4, 5, 6];
    el.hatStock.innerHTML = values.map((value) =>
      `<button class="number-choice ${stockHats === value ? 'is-selected' : ''}" type="button" data-hat-stock="${value}" aria-label="${t('hatsCount', value)}">${value}</button>`).join('');
    el.topStock.innerHTML = values.map((value) =>
      `<button class="number-choice ${stockTops === value ? 'is-selected' : ''}" type="button" data-top-stock="${value}" aria-label="${t('topsCount', value)}">${value}</button>`).join('');
    el.hatStock.querySelectorAll('[data-hat-stock]').forEach((button) => {
      button.addEventListener('click', () => chooseStock('hat', Number(button.dataset.hatStock)));
    });
    el.topStock.querySelectorAll('[data-top-stock]').forEach((button) => {
      button.addEventListener('click', () => chooseStock('top', Number(button.dataset.topStock)));
    });
    el.hatBox.textContent = stockHats;
    el.topBox.textContent = stockTops;
  }

  function render() {
    const current = level();
    const isStock = current.mode === 'stock';
    el.collect.hidden = isStock;
    el.stock.hidden = !isStock;
    el.mission.textContent = t('missions')[levelIndex];
    el.reset.setAttribute('aria-label', t('reset'));

    if (isStock) {
      renderStockChoices();
      const product = stockHats * stockTops;
      el.stamp.textContent = `${product} / ${current.target}`;
      el.formula.textContent = t('stockFormula', stockHats, stockTops, product);
    } else {
      renderChoiceRows();
      el.stamp.textContent = `${discovered.size} / ${totalLooks()}`;
      el.formula.textContent = t('formula', current.hats.length, current.tops.length, totalLooks());
    }
    renderTree();
    renderLevels();
  }

  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.dress.addEventListener('click', wearOutfit);
  el.order.addEventListener('click', submitOrder);
  el.hint.addEventListener('click', showHint);
  el.reset.addEventListener('click', resetLevel);
  el.next.addEventListener('click', nextLevel);

  window.cool.bindI18n(I18N, {
    onChange(context) {
      t = context.t;
      lang = context.lang;
      theme = context.theme;
      document.title = t('doc');
      el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
      el.theme.setAttribute('aria-label', t(theme === 'light' ? 'themeDark' : 'themeLight'));
      render();
    },
  });

  resetLevel();
})();
