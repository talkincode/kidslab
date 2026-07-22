(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '🧁 函数厨房 · KidsLab',
      back: '返回平台',
      title: '函数厨房',
      eyebrow: '今日甜点训练',
      workbenchLabel: '程序工作台',
      orders: '订单',
      undo: '撤回一步',
      shiftPassed: '本班通关',
      soundOn: '关闭音效',
      soundOff: '开启音效',
      theme: '切换主题',
      reset: '重新开始',
      hint: '提示',
      levels: ['小单试做', '封装配方', '参数高峰'],
      shiftLabels: ['第一班 · 小单试做', '第二班 · 爆单警报', '第三班 · 午间高峰'],
      missions: ['按顺序做一只纸杯蛋糕', '别再复制十八个步骤', '用参数完成四张订单'],
      workbenchTitles: ['今天先手工做', '选择扛住爆单的办法', '调用 做蛋糕(口味, 大小)'],
      tips: [
        '先亲手做一份，再把重复步骤收进一张配方卡。',
        '六张订单同时来了。找出比复制粘贴更聪明的办法。',
        '配方不变，只把每张订单的口味和大小传进去。',
      ],
      starts: [
        '点三张步骤卡，排好制作顺序。',
        '每份蛋糕都要重复 3 步。六份就是 18 个步骤！',
        '读最前面的订单，选对两个参数，再调用函数。',
      ],
      hints: [
        '先打发蛋糊，再拌入口味，最后进烤箱。',
        '重复步骤只写一次，给它取名“做蛋糕”，以后直接调用。',
        '参数像订单上的两个空格：第一个填口味，第二个填大小。',
      ],
      stepNames: { whisk: '🥣 打发蛋糊', flavor: '🍓 拌入口味', bake: '♨️ 放进烤箱', frost: '🎀 先挤奶油' },
      emptySlot: (n) => `${n} · 等待步骤`,
      runLabels: ['开始制作', '执行这个方案', '调用函数'],
      running: '厨房正在执行…',
      incomplete: '还差步骤。把三格制作台填满再开工。',
      wrongSequence: '顺序乱啦！蛋糊要先打发，拌入口味后才能烤。点“撤回一步”再试。',
      firstSuccess: '一份蛋糕要重复这 3 步。现在高峰来了，看看一直复制会发生什么。',
      firstTitle: '第一份甜点出炉！',
      firstModal: '你写出了一次完整流程：打发 → 调味 → 烘烤。下一班会把同样的订单放大六倍。',
      next: '下一班',
      manualTitle: '逐单复制',
      manualSmall: '把 3 步复制 6 遍',
      recipeTitle: '封装配方',
      recipeSmall: '只写一次，以后调用',
      chooseStrategy: '先选择一种办法，再执行。',
      manualFail: '爆单啦！18 个步骤挤满工作台，后面的订单已经等不及。换成一张配方卡吧。',
      recipeReady: '把共同步骤装进 做蛋糕(口味, 大小)，六份订单都能复用。',
      recipeCode: '函数 做蛋糕(口味, 大小)',
      recipeSteps: ['打发蛋糊', '拌入“口味”', '按“大小”烘烤'],
      packageSuccess: '配方只定义一次。下一班每张订单只要一行函数调用。',
      packageTitle: '配方卡封装成功！',
      packageModal: '重复的 18 个步骤缩成了 1 张配方卡。修改这张卡，之后的每次调用都会使用新配方。',
      parameterFlavor: '口味',
      parameterSize: '大小',
      flavors: { strawberry: '🍓 草莓', chocolate: '🍫 巧克力', vanilla: '🌼 香草' },
      sizes: { mini: '迷你', tall: '高杯' },
      selectParameter: '先给“口味”和“大小”各选一个值。',
      callPreview: (flavor, size) => `做蛋糕(${flavor || '口味 ?'}, ${size || '大小 ?'})`,
      wrongParameters: (flavor, size) => `订单要 ${flavor} · ${size}。参数传错不会猜心思，改好后再调用！`,
      orderDone: (flavor, size) => `${flavor} · ${size} 已出餐！同一张配方换参数，就做出了不同蛋糕。`,
      allDone: '四张订单只用了四行调用。配方负责“怎么做”，参数负责“这次做什么”。',
      completeTitle: '午高峰全部出餐！',
      completeModal: '你用 1 张函数配方 + 4 次带参数的调用完成了整队订单，不再复制粘贴。',
      replay: '再开一家店',
      locked: '先完成前一班。',
      orderTicket: (flavor, size) => `${flavor}<br>${size}`,
    },
    en: {
      doc: '🧁 Function Kitchen · KidsLab',
      back: 'Back to platform',
      title: 'Function Kitchen',
      eyebrow: "Today's dessert training",
      workbenchLabel: 'Program workbench',
      orders: 'Orders',
      undo: 'Undo a step',
      shiftPassed: 'Shift complete',
      soundOn: 'Mute sound',
      soundOff: 'Turn sound on',
      theme: 'Switch theme',
      reset: 'Restart',
      hint: 'Hint',
      levels: ['First Order', 'Recipe Function', 'Parameter Rush'],
      shiftLabels: ['Shift 1 · First order', 'Shift 2 · Rush alert', 'Shift 3 · Lunch rush'],
      missions: ['Build one cupcake in order', 'Stop copying eighteen steps', 'Serve four parameterized orders'],
      workbenchTitles: ['Make this one by hand', 'Choose a rush-hour strategy', 'Call makeCake(flavor, size)'],
      tips: [
        'Make one by hand, then package repeated steps into a recipe card.',
        'Six orders arrived together. Find a smarter plan than copy and paste.',
        'Keep the recipe and pass each order’s flavor and size into it.',
      ],
      starts: [
        'Tap three step cards to build the cooking sequence.',
        'Every cake repeats 3 steps. Six cakes would need 18 copied steps!',
        'Read the first ticket, choose two matching parameters, then call the function.',
      ],
      hints: [
        'Whisk the batter, mix in flavor, then put it in the oven.',
        'Write repeated steps once, name them “makeCake,” and call that name later.',
        'Parameters are two blanks on the ticket: flavor first, size second.',
      ],
      stepNames: { whisk: '🥣 Whisk batter', flavor: '🍓 Mix in flavor', bake: '♨️ Put in oven', frost: '🎀 Frost it first' },
      emptySlot: (n) => `${n} · Waiting for step`,
      runLabels: ['Start baking', 'Run this plan', 'Call function'],
      running: 'The kitchen is running your program…',
      incomplete: 'Some steps are missing. Fill all three workbench slots first.',
      wrongSequence: 'That order got scrambled! Whisk first, add flavor, then bake. Undo and try again.',
      firstSuccess: 'One cake repeats these 3 steps. Now the rush is coming—see what endless copying does.',
      firstTitle: 'The first dessert is ready!',
      firstModal: 'You built one complete sequence: whisk → flavor → bake. The next shift multiplies that order by six.',
      next: 'Next shift',
      manualTitle: 'Copy each order',
      manualSmall: 'Copy 3 steps six times',
      recipeTitle: 'Package a recipe',
      recipeSmall: 'Write once, then call it',
      chooseStrategy: 'Choose a strategy before running it.',
      manualFail: 'Order jam! Eighteen steps filled the bench and the later customers cannot wait. Try one recipe card.',
      recipeReady: 'Put shared steps inside makeCake(flavor, size), then reuse them for all six orders.',
      recipeCode: 'function makeCake(flavor, size)',
      recipeSteps: ['Whisk batter', 'Mix in “flavor”', 'Bake for “size”'],
      packageSuccess: 'Define the recipe once. Next shift, every order needs only one function call.',
      packageTitle: 'Recipe function packaged!',
      packageModal: 'Eighteen repeated steps became one recipe card. Change the card and every later call uses the new recipe.',
      parameterFlavor: 'Flavor',
      parameterSize: 'Size',
      flavors: { strawberry: '🍓 Strawberry', chocolate: '🍫 Chocolate', vanilla: '🌼 Vanilla' },
      sizes: { mini: 'Mini', tall: 'Tall' },
      selectParameter: 'Choose one value for both “flavor” and “size.”',
      callPreview: (flavor, size) => `makeCake(${flavor || 'flavor ?'}, ${size || 'size ?'})`,
      wrongParameters: (flavor, size) => `This ticket says ${flavor} · ${size}. A function does not guess missing intent—fix the parameters and call again!`,
      orderDone: (flavor, size) => `${flavor} · ${size} served! One recipe made a different cake by receiving new parameters.`,
      allDone: 'Four tickets took only four calls. The recipe holds “how”; parameters say “what this time.”',
      completeTitle: 'Lunch rush fully served!',
      completeModal: 'You completed the queue with 1 function recipe + 4 parameterized calls—no copy and paste.',
      replay: 'Open another shop',
      locked: 'Finish the previous shift first.',
      orderTicket: (flavor, size) => `${flavor}<br>${size}`,
    },
  };

  const STEPS = ['whisk', 'flavor', 'bake'];
  const STEP_OPTIONS = ['flavor', 'whisk', 'frost', 'bake'];
  const ORDERS = [
    { flavor: 'strawberry', size: 'mini', emoji: '🧁' },
    { flavor: 'chocolate', size: 'tall', emoji: '🍰' },
    { flavor: 'vanilla', size: 'mini', emoji: '🧁' },
    { flavor: 'strawberry', size: 'tall', emoji: '🍰' },
  ];
  const SAVE_KEY = 'kidslab.function-kitchen';
  const MUTE_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    lang: $('#langBtn'),
    theme: $('#themeBtn'),
    sound: $('#soundBtn'),
    tip: $('#tip'),
    orderCount: $('#orderCount'),
    rushLight: $('#rushLight'),
    levels: $('#levelStrip'),
    shiftLabel: $('#shiftLabel'),
    mission: $('#missionTitle'),
    workbenchTitle: $('#workbenchTitle'),
    reset: $('#resetBtn'),
    hint: $('#hintBtn'),
    workspace: $('#workspace'),
    undo: $('#undoBtn'),
    run: $('#runBtn'),
    feedback: $('#feedback'),
    chef: $('#chef'),
    mixer: $('#mixer'),
    oven: $('#oven'),
    cake: $('#cakeWindow'),
    tickets: $('#ticketRail'),
    steam: $('.steam'),
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
  let sequence = [];
  let strategy = '';
  let selectedFlavor = '';
  let selectedSize = '';
  let served = 0;
  let running = false;
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
    // Storage is optional; the complete game remains available in this tab.
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ stage, unlocked }));
    } catch {
      // Storage is optional; avoid interrupting the game when unavailable.
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
      tap: [[330, 0, 0.06, 0.045]],
      mix: [[260, 0, 0.08, 0.05], [310, 0.07, 0.08, 0.04]],
      wrong: [[205, 0, 0.13, 0.06], [145, 0.11, 0.17, 0.05]],
      correct: [[440, 0, 0.09, 0.055], [587, 0.09, 0.13, 0.065]],
      complete: [[392, 0, 0.1, 0.05], [523, 0.1, 0.12, 0.06], [659, 0.21, 0.18, 0.07]],
    };
    const now = context.currentTime;
    for (const [frequency, offset, duration, volume] of patterns[kind] || patterns.tap) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === 'wrong' ? 'square' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(volume, now + offset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration + 0.025);
    }
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
      if (!running && el.modal.hidden) setFeedback(t('hints')[stage]);
    }, 30000);
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function renderLevels() {
    el.levels.innerHTML = t('levels').map((name, index) =>
      `<button class="level-button ${index === stage ? 'is-active' : ''} ${index < unlocked ? 'is-done' : ''}" type="button" data-level="${index}" ${index > unlocked ? 'disabled' : ''}>${index + 1}. ${name}</button>`).join('');
    el.levels.querySelectorAll('[data-level]').forEach((button) => {
      button.addEventListener('click', () => setStage(Number(button.dataset.level)));
    });
  }

  function renderStageZero() {
    const slots = Array.from({ length: 3 }, (_, index) => {
      const id = sequence[index];
      return `<div class="step-slot ${id ? 'is-filled' : ''}">${id ? t('stepNames')[id] : t('emptySlot', index + 1)}</div>`;
    }).join('');
    const cards = STEP_OPTIONS.map((id) =>
      `<button class="step-card" type="button" data-step="${id}" ${sequence.length >= 3 || running ? 'disabled' : ''}>${t('stepNames')[id]}</button>`).join('');
    el.workspace.innerHTML = `<div class="step-slots">${slots}</div>
      <div class="step-palette">${cards}</div>
      <p class="code-note"><code>程序 = ${sequence.length ? sequence.map((id) => t('stepNames')[id].replace(/^.\s/, '')).join(' → ') : '…'}</code></p>`;
    el.workspace.querySelectorAll('[data-step]').forEach((button) => {
      button.addEventListener('click', () => {
        if (sequence.length >= 3 || running) return;
        sequence.push(button.dataset.step);
        setFeedback(t('starts')[0]);
        tone('tap');
        window.cool.track('add_kitchen_step');
        scheduleHint();
        render();
      });
    });
  }

  function recipeCard(saved = false) {
    return `<div class="recipe-card ${saved ? 'is-saved' : ''}">
      <code>${t('recipeCode')}</code>
      <ol>${t('recipeSteps').map((step) => `<li>${step}</li>`).join('')}</ol>
    </div>`;
  }

  function renderStageOne() {
    el.workspace.innerHTML = `<div class="strategy-grid">
        <button class="strategy-card strategy-card--manual ${strategy === 'manual' ? 'is-selected' : ''}" type="button" data-strategy="manual">
          <b>📋×6</b><span>${t('manualTitle')}</span><small>${t('manualSmall')}</small>
        </button>
        <button class="strategy-card strategy-card--recipe ${strategy === 'recipe' ? 'is-selected' : ''}" type="button" data-strategy="recipe">
          <b>🗂️✨</b><span>${t('recipeTitle')}</span><small>${t('recipeSmall')}</small>
        </button>
      </div>
      ${strategy === 'recipe' ? recipeCard(false) : `<p class="code-note"><code>${strategy === 'manual' ? '3 × 6 = 18 steps' : '3 steps × 6 orders = ?'}</code></p>`}`;
    el.workspace.querySelectorAll('[data-strategy]').forEach((button) => {
      button.addEventListener('click', () => {
        if (running) return;
        strategy = button.dataset.strategy;
        setFeedback(strategy === 'recipe' ? t('recipeReady') : t('starts')[1]);
        tone('tap');
        window.cool.track('choose_recipe_strategy');
        scheduleHint();
        render();
      });
    });
  }

  function renderStageTwo() {
    const flavorButtons = Object.entries(t('flavors')).map(([id, label]) =>
      `<button class="option-button ${selectedFlavor === id ? 'is-selected' : ''}" type="button" data-flavor="${id}" ${running ? 'disabled' : ''}>${label}</button>`).join('');
    const sizeButtons = Object.entries(t('sizes')).map(([id, label]) =>
      `<button class="option-button ${selectedSize === id ? 'is-selected' : ''}" type="button" data-size="${id}" ${running ? 'disabled' : ''}>${label}</button>`).join('');
    const flavorLabel = selectedFlavor ? t('flavors')[selectedFlavor] : '';
    const sizeLabel = selectedSize ? t('sizes')[selectedSize] : '';
    el.workspace.innerHTML = `${recipeCard(false)}
      <div class="parameter-group"><p class="parameter-label">${t('parameterFlavor')}</p><div class="parameter-options">${flavorButtons}</div></div>
      <div class="parameter-group"><p class="parameter-label">${t('parameterSize')}</p><div class="parameter-options">${sizeButtons}</div></div>
      <div class="call-preview"><code>${t('callPreview', flavorLabel, sizeLabel)}</code></div>
      <div class="progress-dots">${ORDERS.map((_, index) => `<i class="${index < served ? 'is-done' : ''}"></i>`).join('')}</div>`;
    el.workspace.querySelectorAll('[data-flavor]').forEach((button) => {
      button.addEventListener('click', () => {
        selectedFlavor = button.dataset.flavor;
        tone('tap');
        render();
      });
    });
    el.workspace.querySelectorAll('[data-size]').forEach((button) => {
      button.addEventListener('click', () => {
        selectedSize = button.dataset.size;
        tone('tap');
        render();
      });
    });
  }

  function renderTickets() {
    const count = stage === 0 ? 1 : stage === 1 ? 6 : ORDERS.length;
    if (stage < 2) {
      el.tickets.innerHTML = Array.from({ length: Math.min(count, 6) }, (_, index) =>
        `<span class="ticket" style="--tilt:${index % 2 ? '-2deg' : '2deg'}">#${index + 1}<br>🧁</span>`).join('');
      return;
    }
    el.tickets.innerHTML = ORDERS.map((order, index) =>
      `<span class="ticket ${index < served ? 'is-done' : ''}" style="--tilt:${index % 2 ? '-2deg' : '2deg'}">#${index + 1}<br>${t('orderTicket', t('flavors')[order.flavor], t('sizes')[order.size])}</span>`).join('');
  }

  function render() {
    document.body.dataset.stage = String(stage);
    el.tip.textContent = t('tips')[stage];
    el.shiftLabel.textContent = t('shiftLabels')[stage];
    el.mission.textContent = t('missions')[stage];
    el.workbenchTitle.textContent = t('workbenchTitles')[stage];
    el.orderCount.textContent = stage === 0 ? '1' : stage === 1 ? '6' : String(ORDERS.length - served);
    el.rushLight.classList.toggle('is-rush', stage > 0 && served < ORDERS.length);
    el.sound.textContent = muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-label', muted ? t('soundOff') : t('soundOn'));
    el.sound.setAttribute('aria-pressed', String(muted));
    el.theme.setAttribute('aria-label', t('theme'));
    el.reset.setAttribute('aria-label', t('reset'));
    el.hint.setAttribute('aria-label', t('hint'));
    el.run.querySelector('span').textContent = t('runLabels')[stage];
    el.undo.hidden = stage !== 0;
    el.undo.disabled = running || sequence.length === 0;
    el.run.disabled = running || (stage === 0 && sequence.length < 3);
    renderLevels();
    renderTickets();
    if (stage === 0) renderStageZero();
    if (stage === 1) renderStageOne();
    if (stage === 2) renderStageTwo();
  }

  function animateMachine(step) {
    el.mixer.classList.toggle('is-active', step === 'whisk' || step === 'flavor');
    el.oven.classList.toggle('is-active', step === 'bake');
    el.steam.classList.toggle('is-active', step === 'bake');
  }

  function clearMachine() {
    el.chef.classList.remove('is-working');
    el.mixer.classList.remove('is-active');
    el.oven.classList.remove('is-active');
    el.steam.classList.remove('is-active');
  }

  async function runFirstShift() {
    if (sequence.length < 3) {
      setFeedback(t('incomplete'), 'error');
      tone('wrong');
      return;
    }
    running = true;
    el.chef.classList.add('is-working');
    setFeedback(t('running'));
    render();
    for (const step of sequence) {
      animateMachine(step);
      tone('mix');
      await wait(260);
    }
    clearMachine();
    running = false;
    const correct = sequence.every((step, index) => step === STEPS[index]);
    if (!correct) {
      setFeedback(t('wrongSequence'), 'error');
      tone('wrong');
      window.cool.track('retry_kitchen_sequence');
      render();
      scheduleHint();
      return;
    }
    el.cake.textContent = '🧁';
    el.cake.classList.remove('is-pop');
    requestAnimationFrame(() => el.cake.classList.add('is-pop'));
    setFeedback(t('firstSuccess'), 'success');
    tone('correct');
    window.cool.track('finish_manual_cake');
    await wait(260);
    showCompletion(t('firstTitle'), t('firstModal'), '🧁✨');
  }

  async function runSecondShift() {
    if (!strategy) {
      setFeedback(t('chooseStrategy'), 'error');
      tone('wrong');
      return;
    }
    if (strategy === 'manual') {
      setFeedback(t('manualFail'), 'error');
      el.orderCount.textContent = '6!';
      tone('wrong');
      window.cool.track('overflow_manual_orders');
      scheduleHint();
      return;
    }
    running = true;
    setFeedback(t('running'));
    el.chef.classList.add('is-working');
    render();
    await wait(460);
    running = false;
    clearMachine();
    el.workspace.innerHTML = recipeCard(true);
    setFeedback(t('packageSuccess'), 'success');
    tone('correct');
    window.cool.track('package_recipe_function');
    await wait(320);
    showCompletion(t('packageTitle'), t('packageModal'), '18 ➜ 1 🗂️');
  }

  async function runThirdShift() {
    if (!selectedFlavor || !selectedSize) {
      setFeedback(t('selectParameter'), 'error');
      tone('wrong');
      return;
    }
    const order = ORDERS[served];
    if (selectedFlavor !== order.flavor || selectedSize !== order.size) {
      setFeedback(t('wrongParameters', t('flavors')[order.flavor], t('sizes')[order.size]), 'error');
      tone('wrong');
      window.cool.track('retry_function_parameters');
      scheduleHint();
      return;
    }
    running = true;
    setFeedback(t('running'));
    el.chef.classList.add('is-working');
    animateMachine('bake');
    render();
    await wait(310);
    served += 1;
    running = false;
    clearMachine();
    el.cake.textContent = order.emoji;
    el.cake.classList.remove('is-pop');
    requestAnimationFrame(() => el.cake.classList.add('is-pop'));
    setFeedback(t('orderDone', t('flavors')[order.flavor], t('sizes')[order.size]), 'success');
    tone('correct');
    window.cool.track('call_cake_function');
    selectedFlavor = '';
    selectedSize = '';
    render();
    if (served === ORDERS.length) {
      setFeedback(t('allDone'), 'success');
      await wait(320);
      window.cool.complete?.();
      tone('complete');
      showCompletion(t('completeTitle'), t('completeModal'), '🧁🍰🧁🍰');
    } else {
      scheduleHint();
    }
  }

  async function run() {
    if (running) return;
    if (stage === 0) await runFirstShift();
    else if (stage === 1) await runSecondShift();
    else await runThirdShift();
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

  function resetStage() {
    clearTimeout(hintTimer);
    sequence = [];
    strategy = '';
    selectedFlavor = '';
    selectedSize = '';
    served = 0;
    running = false;
    feedbackType = '';
    el.modal.hidden = true;
    el.cake.textContent = '';
    clearMachine();
    setFeedback(t('starts')[stage]);
    window.cool.stage(`shift-${stage + 1}`);
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

  function undo() {
    if (running || stage !== 0 || sequence.length === 0) return;
    sequence.pop();
    setFeedback(t('starts')[0]);
    tone('tap');
    window.cool.track('undo_kitchen_step');
    render();
  }

  function showHint() {
    setFeedback(t('hints')[stage]);
    tone('tap');
    window.cool.track('open_function_hint');
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
    if (!muted) tone('tap');
  }

  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.sound.addEventListener('click', toggleSound);
  el.reset.addEventListener('click', resetStage);
  el.hint.addEventListener('click', showHint);
  el.undo.addEventListener('click', undo);
  el.run.addEventListener('click', run);
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
