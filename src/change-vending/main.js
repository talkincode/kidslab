(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '找零售货机 · KidsLab',
      back: '返回平台',
      title: '找零售货机',
      eyebrow: '叮当街自动售货站',
      tip: '先算应找多少钱，再点硬币把零钱送进托盘。',
      mission: '本次订单',
      paidLabel: '顾客投入',
      trayLabel: '托盘里',
      clear: '清空托盘',
      dispense: '叮！弹出找零',
      inventory: '机器肚子里的零钱',
      exchange: '把 1 元换成 10 个 1 角',
      hint: '💡 给我一点提示',
      orderDone: '找零成功',
      reset: '重新开始',
      themeDark: '切换深色主题',
      themeLight: '切换浅色主题',
      levels: ['果汁站', '换钱关', '午餐铃'],
      missions: ['给兔兔找回果汁零钱', '零钱不够，先换钱再找零', '为熊猫配出刚好的零钱'],
      products: ['来一瓶果汁！', '我要一袋星星饼！', '午餐要一份饭团！'],
      start: (amount) => `应找 ${amount}。点硬币放进托盘，凑好再弹出去！`,
      exact: '刚刚好！可以把零钱弹给顾客啦。',
      short: (amount) => `还差 ${amount}，再看看哪种硬币最合适。`,
      over: (amount) => `多放了 ${amount}。点减号拿回几枚，再试一次。`,
      unavailable: '这个零钱筒空啦！可以换钱，或者改用别的面额。',
      wrong: (current, target) => `托盘里是 ${current}，应找 ${target}。零钱还在托盘里，改好就能再试！`,
      exchangeReady: '1 元纸币可以换成 10 个 1 角，总金额不会变。',
      exchanged: '哗啦！1 元变成了 10 个 1 角，现在够找零啦。',
      cannotExchange: '没有空闲的 1 元纸币可以换啦。',
      hints: [
        '先算 5 元减 3 元 5 角。可以先放 1 元，再想还差多少。',
        '机器只有 3 个 1 角，不够找 8 角。先把一张 1 元换开。',
        '2 元 7 角可以拆成 2 个 1 元、1 个 5 角和 2 个 1 角。',
      ],
      stockUnlimited: '零钱充足',
      stockLimited: '数量有限',
      coinNames: { 100: '1 元', 50: '5 角', 10: '1 角' },
      addCoin: (name) => `添加 ${name}`,
      removeCoin: (name) => `拿回一个${name}`,
      selected: (count) => `已放 ${count} 个`,
      stock: (count) => `剩 ${count} 个`,
      unlimited: '充足',
      equation: (paid, price, change) => `${paid} − ${price} = 应找 ${change}`,
      completeTitles: ['果汁零钱准确弹出！', '换开纸币，饼干零钱也找对了！', '三位顾客都拿到了正确零钱！'],
      completeTexts: [
        '5 元减 3 元 5 角等于 1 元 5 角。把金额都看成“角”，就是 50 − 35 = 15。',
        '1 元换成 10 个 1 角后，总金额没变，但小面额够用了。',
        '找零就是“付款金额 − 商品价格”。不同硬币组合，也能凑出同一个金额。',
      ],
      next: '下一位顾客',
      replay: '重新开店',
      locked: '先服务好前一位顾客',
      moneyRainLabel: '1 元等于 2 个 5 角，也等于 10 个 1 角',
    },
    en: {
      doc: 'Change Machine · KidsLab',
      back: 'Back to platform',
      title: 'Change Machine',
      eyebrow: 'Ding-Dong Street Vending Stop',
      tip: 'Work out the change, then tap coins to fill the tray.',
      mission: 'Current order',
      paidLabel: 'Customer paid',
      trayLabel: 'In tray',
      clear: 'Clear tray',
      dispense: 'Ding! Dispense change',
      inventory: 'Coins inside the machine',
      exchange: 'Exchange ¥1 for ten 10-jiao coins',
      hint: '💡 Give me a hint',
      orderDone: 'Change delivered',
      reset: 'Restart',
      themeDark: 'Switch to dark theme',
      themeLight: 'Switch to light theme',
      levels: ['Juice Stop', 'Exchange', 'Lunch Bell'],
      missions: ['Return the rabbit’s juice change', 'Exchange money before making change', 'Make exact change for the panda'],
      products: ['One juice, please!', 'A bag of star cookies!', 'One rice ball for lunch!'],
      start: (amount) => `The change is ${amount}. Tap coins into the tray, then dispense it!`,
      exact: 'Exactly right! The change is ready to dispense.',
      short: (amount) => `${amount} to go. Which coin fits best?`,
      over: (amount) => `${amount} too much. Use minus to take coins back.`,
      unavailable: 'That tube is empty. Exchange money or use another coin.',
      wrong: (current, target) => `The tray has ${current}, but the change is ${target}. Fix the tray and try again!`,
      exchangeReady: 'A ¥1 note can become ten 10-jiao coins without changing its value.',
      exchanged: 'Clatter! ¥1 became ten 10-jiao coins. Now there is enough small change.',
      cannotExchange: 'There is no spare ¥1 note left to exchange.',
      hints: [
        'Start with ¥5.00 minus ¥3.50. Add ¥1.00 first, then find what remains.',
        'Three 10-jiao coins cannot make 8 jiao. Exchange a ¥1 note first.',
        '¥2.70 can be two ¥1 notes, one 5-jiao coin, and two 1-jiao coins.',
      ],
      stockUnlimited: 'Plenty',
      stockLimited: 'Limited stock',
      coinNames: { 100: '¥1', 50: '5 jiao', 10: '1 jiao' },
      addCoin: (name) => `Add ${name}`,
      removeCoin: (name) => `Remove one ${name}`,
      selected: (count) => `${count} selected`,
      stock: (count) => `${count} left`,
      unlimited: 'Plenty',
      equation: (paid, price, change) => `${paid} − ${price} = ${change} change`,
      completeTitles: ['The juice change popped out exactly!', 'The note was exchanged and the cookie change is right!', 'All three customers received exact change!'],
      completeTexts: [
        '¥5.00 minus ¥3.50 is ¥1.50. In jiao, the same calculation is 50 − 35 = 15.',
        'Exchanging ¥1 for ten 10-jiao coins keeps the total value the same and provides useful small change.',
        'Change equals the amount paid minus the price. Different coin combinations can represent the same amount.',
      ],
      next: 'Next customer',
      replay: 'Open the shop again',
      locked: 'Serve the previous customer first',
      moneyRainLabel: '¥1 equals two 5-jiao coins and ten 1-jiao coins',
    },
  };

  const DENOMS = [100, 50, 10];
  const LEVELS = [
    {
      price: 350,
      paid: 500,
      icon: '🧃',
      customer: '🐰',
      inventory: null,
    },
    {
      price: 320,
      paid: 500,
      icon: '🍪',
      customer: '🦊',
      inventory: { 100: 2, 50: 0, 10: 3 },
      exchange: true,
    },
    {
      price: 730,
      paid: 1000,
      icon: '🍙',
      customer: '🐼',
      inventory: { 100: 2, 50: 1, 10: 2 },
    },
  ];

  const $ = (selector) => document.querySelector(selector);
  const SAVE_KEY = 'kidslab.change-vending';
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
    progress: $('#progress'),
    levels: $('#levelStrip'),
    mission: $('#missionTitle'),
    reset: $('#resetBtn'),
    customer: $('.customer'),
    customerFace: $('#customerFace'),
    customerBubble: $('#customerBubble'),
    product: $('#productIcon'),
    price: $('#priceTag'),
    paid: $('#paidAmount'),
    equation: $('#equation'),
    tray: $('#trayAmount'),
    coinBank: $('#coinBank'),
    clear: $('#clearBtn'),
    dispense: $('#dispenseBtn'),
    feedback: $('#feedback'),
    clerk: $('#clerkFace'),
    stockMode: $('#stockMode'),
    inventory: $('#inventoryGrid'),
    exchangeBox: $('#exchangeBox'),
    exchange: $('#exchangeBtn'),
    hint: $('#hintBtn'),
    modal: $('#modal'),
    modalTitle: $('#modalTitle'),
    modalText: $('#modalText'),
    celebration: $('#celebration'),
    coinRain: $('#coinRain'),
    next: $('#nextBtn'),
  };

  let t = (key) => key;
  let lang = window.cool.preferences.lang;
  let theme = window.cool.preferences.theme;
  let levelIndex = Math.min(LEVELS.length - 1, Math.max(0, Number(saved.level) || 0));
  let unlocked = Math.min(LEVELS.length - 1, Math.max(levelIndex, Number(saved.unlocked) || 0));
  let selected = { 100: 0, 50: 0, 10: 0 };
  let inventory = null;
  let completed = false;
  let idleTimer = 0;

  function level() {
    return LEVELS[levelIndex];
  }

  function target() {
    return level().paid - level().price;
  }

  function trayTotal() {
    return DENOMS.reduce((sum, value) => sum + selected[value] * value, 0);
  }

  function money(cents) {
    if (lang === 'en') return `¥${(cents / 100).toFixed(2)}`;
    const yuan = Math.floor(cents / 100);
    const jiao = Math.floor((cents % 100) / 10);
    if (yuan && jiao) return `${yuan} 元 ${jiao} 角`;
    if (yuan) return `${yuan} 元`;
    return `${jiao} 角`;
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ level: levelIndex, unlocked }));
    } catch {
      // Progress persistence is optional; the current session remains playable.
    }
  }

  function setFeedback(message, face = '🤖') {
    el.feedback.textContent = message;
    el.clerk.textContent = face;
  }

  function animateCustomer(className) {
    el.customer.classList.remove('is-happy', 'is-upset');
    void el.customer.offsetWidth;
    el.customer.classList.add(className);
  }

  function scheduleIdleHint() {
    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      if (!completed && el.modal.hidden) setFeedback(t('hints')[levelIndex], '💡');
    }, 30000);
  }

  function remaining(value) {
    if (!inventory) return Infinity;
    return inventory[value] - selected[value];
  }

  function addCoin(value) {
    if (completed) return;
    if (remaining(value) <= 0) {
      setFeedback(t('unavailable'), '🪙');
      animateCustomer('is-upset');
      window.cool.track('try_empty_coin_tube');
      scheduleIdleHint();
      return;
    }
    selected[value] += 1;
    window.cool.track('add_change_coin');
    updateAmountFeedback();
    render();
    const control = el.coinBank.querySelector(`[data-control="${value}"]`);
    control?.classList.add('is-added');
    window.setTimeout(() => control?.classList.remove('is-added'), 300);
  }

  function removeCoin(value) {
    if (completed || selected[value] <= 0) return;
    selected[value] -= 1;
    window.cool.track('remove_change_coin');
    updateAmountFeedback();
    render();
  }

  function updateAmountFeedback() {
    const current = trayTotal();
    if (current === target()) setFeedback(t('exact'), '✨');
    else if (current < target()) setFeedback(t('short', money(target() - current)), '🤖');
    else setFeedback(t('over', money(current - target())), '🙈');
    scheduleIdleHint();
  }

  function clearTray() {
    if (completed) return;
    selected = { 100: 0, 50: 0, 10: 0 };
    setFeedback(t('start', money(target())));
    window.cool.track('clear_change_tray');
    scheduleIdleHint();
    render();
  }

  function exchangeMoney() {
    if (completed || !level().exchange || !inventory) return;
    if (remaining(100) <= 0) {
      setFeedback(t('cannotExchange'), '🫙');
      return;
    }
    inventory[100] -= 1;
    inventory[10] += 10;
    setFeedback(t('exchanged'), '🌧️');
    el.exchangeBox.classList.remove('is-raining');
    void el.exchangeBox.offsetWidth;
    el.exchangeBox.classList.add('is-raining');
    window.cool.track('exchange_one_yuan');
    scheduleIdleHint();
    render();
  }

  function dispense() {
    if (completed) return;
    const current = trayTotal();
    if (current !== target()) {
      setFeedback(t('wrong', money(current), money(target())), '😵');
      animateCustomer('is-upset');
      window.cool.track('retry_wrong_change');
      scheduleIdleHint();
      return;
    }
    completed = true;
    clearTimeout(idleTimer);
    setFeedback(t('exact'), '🎉');
    animateCustomer('is-happy');
    window.cool.track('dispense_exact_change');
    window.setTimeout(showCompletion, 430);
    render();
  }

  function showCompletion() {
    if (levelIndex < LEVELS.length - 1) {
      unlocked = Math.max(unlocked, levelIndex + 1);
      persist();
    } else {
      window.cool.complete?.();
    }
    el.celebration.textContent = levelIndex === 2 ? '🌧️🪙✨' : levelIndex === 1 ? '🪙🦊🍪' : '🧃🐰✨';
    el.modalTitle.textContent = t('completeTitles')[levelIndex];
    el.modalText.textContent = t('completeTexts')[levelIndex];
    el.coinRain.hidden = levelIndex !== LEVELS.length - 1;
    el.coinRain.setAttribute('aria-label', t('moneyRainLabel'));
    el.next.textContent = levelIndex === LEVELS.length - 1 ? t('replay') : t('next');
    el.modal.hidden = false;
    renderLevels();
  }

  function resetLevel() {
    selected = { 100: 0, 50: 0, 10: 0 };
    inventory = level().inventory ? { ...level().inventory } : null;
    completed = false;
    el.modal.hidden = true;
    el.customer.classList.remove('is-happy', 'is-upset');
    setFeedback(level().exchange ? t('exchangeReady') : t('start', money(target())));
    window.cool.stage(`customer-${levelIndex + 1}`);
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

  function renderCoinBank() {
    el.coinBank.innerHTML = DENOMS.map((value) => {
      const name = t('coinNames')[value];
      const isNote = value === 100;
      return `
        <div class="coin-control" data-control="${value}">
          <button class="coin-add ${isNote ? 'note' : ''}" type="button" data-add="${value}" aria-label="${t('addCoin', name)}" ${remaining(value) <= 0 || completed ? 'disabled' : ''}>${name}</button>
          <div class="coin-count"><b>× ${selected[value]}</b><span>${t('selected', selected[value])}</span></div>
          <button class="coin-remove" type="button" data-remove="${value}" aria-label="${t('removeCoin', name)}" ${selected[value] <= 0 || completed ? 'disabled' : ''}>−</button>
        </div>`;
    }).join('');
    el.coinBank.querySelectorAll('[data-add]').forEach((button) => {
      button.addEventListener('click', () => addCoin(Number(button.dataset.add)));
    });
    el.coinBank.querySelectorAll('[data-remove]').forEach((button) => {
      button.addEventListener('click', () => removeCoin(Number(button.dataset.remove)));
    });
  }

  function renderInventory() {
    el.stockMode.textContent = t(inventory ? 'stockLimited' : 'stockUnlimited');
    el.inventory.innerHTML = DENOMS.map((value) => {
      const available = inventory ? Math.max(0, remaining(value)) : null;
      return `<div class="inventory-item"><span>${t('coinNames')[value]}</span><b>${available === null ? '∞' : available}</b><span>${available === null ? t('unlimited') : t('stock', available)}</span></div>`;
    }).join('');
    const canExchange = Boolean(level().exchange && inventory && remaining(100) > 0 && !completed);
    el.exchangeBox.classList.toggle('is-hidden', !level().exchange);
    el.exchange.disabled = !canExchange;
  }

  function render() {
    const current = level();
    el.progress.textContent = `${levelIndex + 1} / ${LEVELS.length}`;
    el.mission.textContent = t('missions')[levelIndex];
    el.reset.setAttribute('aria-label', t('reset'));
    el.customerFace.textContent = current.customer;
    el.customerBubble.textContent = t('products')[levelIndex];
    el.product.textContent = current.icon;
    el.price.textContent = money(current.price);
    el.paid.textContent = money(current.paid);
    el.equation.textContent = t('equation', money(current.paid), money(current.price), money(target()));
    el.tray.textContent = money(trayTotal());
    el.dispense.disabled = completed;
    renderCoinBank();
    renderInventory();
    renderLevels();
  }

  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.clear.addEventListener('click', clearTray);
  el.dispense.addEventListener('click', dispense);
  el.exchange.addEventListener('click', exchangeMoney);
  el.hint.addEventListener('click', () => {
    setFeedback(t('hints')[levelIndex], '💡');
    window.cool.track('open_change_hint');
    scheduleIdleHint();
  });
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
