(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '惊喜鬼屋 · KidsLab',
      back: '返回平台',
      title: '惊喜鬼屋',
      eyebrow: '事件配线训练营',
      tip: '先点一个“当…”，再点一个“就…”，接好导线后开门营业。',
      roomLabel: '今晚的鬼屋任务',
      wiresLabel: '事件导线台',
      wiresTitle: '当发生 → 就启动',
      whenLabel: '当 WHEN',
      thenLabel: '就 THEN',
      waiting: '等待事件',
      fired: '已经触发',
      reset: '重新开始',
      hint: '提示',
      showPassed: '演出成功',
      open: '🎟️ 开门营业',
      testing: '游客正在参观…',
      levels: ['开门彩排', '乱序来客', '连锁之夜'],
      missions: ['大门口的三重惊喜', '谁先来，就先响应谁', '让整座鬼屋自己连起来'],
      starts: [
        '游客会开门、踩地板、看画像。把三个事件接到正确机关吧！',
        '今晚的事件没有固定顺序。每个事件一发生，对应机关就要立刻响应。',
        '只会发生“门打开”。让每个机关完成后发出下一个事件，接成一条链！',
      ],
      hints: [
        '门打开时放飞蝙蝠，踩地板时让骷髅唱歌，看画像时喷彩纸。',
        '窗户响配猫头鹰，衣柜动配幽灵，午夜钟声配南瓜笑脸。',
        '大门→蝙蝠；蝙蝠飞完→铃响；铃响→幽灵；幽灵撞到桶→南瓜。',
      ],
      selectTrigger: '先点左边一个“当…发生”的事件。',
      chooseAction: '现在点右边一个机关，把导线接过去。',
      wired: (trigger, action) => `接好了：当“${trigger}”，就“${action}”。`,
      incomplete: '还有事件没接导线。先把每个左侧事件都接好。',
      eventNow: (event) => `⚡ 事件发生：${event}`,
      actionNow: (action) => `机关响应：${action}`,
      wrong: (trigger, expected) => `机关接错啦：“${trigger}”发生时，应该“${expected}”。改一根线再试！`,
      success: [
        '三个事件各自叫醒了正确机关。事件处理器只在自己的事件发生时工作。',
        '游客乱序行动，机关仍然一一响应。事件程序没有必须先跑的“第一行”。',
        '门只触发第一步，后面的机关又发出新事件，整条事件链自己跑完了！',
      ],
      completeTitles: ['第一批游客笑着跑出来啦！', '乱序来客全都接住啦！', '多米诺鬼屋大成功！'],
      next: '下一间鬼屋',
      replay: '从头再玩',
      locked: '先完成前一间鬼屋。',
      score: (scare, laugh) => `惊吓 ${scare}，爆笑 ${laugh}`,
      triggers: {
        door: '大门打开',
        tile: '踩到第三块地板',
        portrait: '盯着画像看',
        window: '窗户咚咚响',
        closet: '衣柜门晃动',
        clock: '午夜钟声响',
        batsDone: '蝙蝠飞过铃铛',
        bellRang: '铃铛响起',
        ghostBumped: '幽灵撞到木桶',
      },
      triggerIcons: {
        door: '🚪', tile: '👣', portrait: '🖼️', window: '🪟', closet: '🗄️',
        clock: '🕛', batsDone: '🦇', bellRang: '🔔', ghostBumped: '👻',
      },
      actions: {
        bats: '蝙蝠群起飞',
        skeleton: '骷髅唱歌',
        confetti: '画像喷彩纸',
        cobweb: '蜘蛛网落下',
        owl: '猫头鹰报幕',
        ghost: '幽灵跳出来',
        pumpkin: '南瓜亮笑脸',
        bell: '撞响铃铛',
      },
      actionIcons: {
        bats: '🦇', skeleton: '💀', confetti: '🎊', cobweb: '🕸️',
        owl: '🦉', ghost: '👻', pumpkin: '🎃', bell: '🔔',
      },
    },
    en: {
      doc: 'Surprise Haunted House · KidsLab',
      back: 'Back to platform',
      title: 'Surprise Haunted House',
      eyebrow: 'Event Wiring Camp',
      tip: 'Tap a WHEN card, then a THEN card. Wire every event before opening night.',
      roomLabel: "Tonight's haunted mission",
      wiresLabel: 'Event wiring board',
      wiresTitle: 'When it happens → do this',
      whenLabel: 'WHEN',
      thenLabel: 'THEN',
      waiting: 'Waiting',
      fired: 'Triggered',
      reset: 'Restart',
      hint: 'Hint',
      showPassed: 'Show complete',
      open: '🎟️ Open the house',
      testing: 'Visitors are exploring…',
      levels: ['Door Rehearsal', 'Random Visitors', 'Chain Night'],
      missions: ['Three surprises at the entrance', 'Respond to whichever event comes first', 'Make the whole house trigger itself'],
      starts: [
        'Visitors open the door, step on a tile, and stare at a portrait. Wire each event to the right surprise!',
        'Events arrive in no fixed order tonight. Each matching mechanism must respond right away.',
        'Only “door opens” happens at first. Make each mechanism send the next event in a chain!',
      ],
      hints: [
        'Door opens → bats; floor tile → singing skeleton; portrait → confetti.',
        'Window noise → owl; moving closet → ghost; midnight clock → smiling pumpkin.',
        'Door → bats; bats pass bell → bell; bell rings → ghost; ghost bumps barrel → pumpkin.',
      ],
      selectTrigger: 'First tap a WHEN event on the left.',
      chooseAction: 'Now tap a mechanism on the right to connect the wire.',
      wired: (trigger, action) => `Connected: when “${trigger}”, then “${action}.”`,
      incomplete: 'Some events have no wire yet. Connect every event on the left.',
      eventNow: (event) => `⚡ Event: ${event}`,
      actionNow: (action) => `Response: ${action}`,
      wrong: (trigger, expected) => `That wire caused a mix-up. When “${trigger}” happens, it should “${expected}.” Change one wire and retry!`,
      success: [
        'Each event woke the correct mechanism. A handler runs only when its own event happens.',
        'Visitors moved in a random order, but every mechanism still responded. Event programs do not need a first line.',
        'The door started one response, then every mechanism created the next event. The whole event chain ran by itself!',
      ],
      completeTitles: ['The first visitors ran out laughing!', 'Every random event was handled!', 'Domino haunted house success!'],
      next: 'Next room',
      replay: 'Play from the start',
      locked: 'Finish the previous room first.',
      score: (scare, laugh) => `Scares ${scare}, laughs ${laugh}`,
      triggers: {
        door: 'front door opens',
        tile: 'third floor tile is stepped on',
        portrait: 'visitor stares at portrait',
        window: 'window goes knock-knock',
        closet: 'closet door wiggles',
        clock: 'midnight clock rings',
        batsDone: 'bats fly past the bell',
        bellRang: 'bell rings',
        ghostBumped: 'ghost bumps the barrel',
      },
      triggerIcons: {
        door: '🚪', tile: '👣', portrait: '🖼️', window: '🪟', closet: '🗄️',
        clock: '🕛', batsDone: '🦇', bellRang: '🔔', ghostBumped: '👻',
      },
      actions: {
        bats: 'release the bats',
        skeleton: 'make skeleton sing',
        confetti: 'portrait sprays confetti',
        cobweb: 'drop a cobweb',
        owl: 'owl announces the guest',
        ghost: 'ghost jumps out',
        pumpkin: 'pumpkin lights a smile',
        bell: 'ring the bell',
      },
      actionIcons: {
        bats: '🦇', skeleton: '💀', confetti: '🎊', cobweb: '🕸️',
        owl: '🦉', ghost: '👻', pumpkin: '🎃', bell: '🔔',
      },
    },
  };

  const LEVELS = [
    {
      triggers: ['door', 'tile', 'portrait'],
      actions: ['bats', 'skeleton', 'confetti', 'cobweb'],
      expected: { door: 'bats', tile: 'skeleton', portrait: 'confetti' },
      events: ['door', 'tile', 'portrait'],
      scores: { bats: [2, 1], skeleton: [1, 3], confetti: [0, 3], cobweb: [2, 0] },
      magic: '🚪🦇💀🎊',
    },
    {
      triggers: ['window', 'closet', 'clock'],
      actions: ['owl', 'ghost', 'pumpkin', 'bats'],
      expected: { window: 'owl', closet: 'ghost', clock: 'pumpkin' },
      events: ['closet', 'clock', 'window'],
      scores: { owl: [1, 2], ghost: [3, 2], pumpkin: [1, 3], bats: [2, 1] },
      magic: '🪟🦉👻🎃',
    },
    {
      triggers: ['door', 'batsDone', 'bellRang', 'ghostBumped'],
      actions: ['bats', 'bell', 'ghost', 'pumpkin'],
      expected: { door: 'bats', batsDone: 'bell', bellRang: 'ghost', ghostBumped: 'pumpkin' },
      events: ['door'],
      emits: { bats: 'batsDone', bell: 'bellRang', ghost: 'ghostBumped' },
      scores: { bats: [2, 1], bell: [1, 1], ghost: [3, 2], pumpkin: [1, 3] },
      magic: '🦇→🔔→👻→🎃',
    },
  ];

  const SAVE_KEY = 'kidslab.haunted-events';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    lang: $('#langBtn'),
    theme: $('#themeBtn'),
    levels: $('#levelStrip'),
    mission: $('#missionTitle'),
    reset: $('#resetBtn'),
    stage: $('#stage'),
    visitor: $('#visitor'),
    eventPop: $('#eventPop'),
    feedback: $('#feedback'),
    open: $('#openBtn'),
    feed: $('#eventFeed'),
    triggers: $('#triggerList'),
    actions: $('#actionList'),
    board: $('#wiringBoard'),
    wires: $('#wireLayer'),
    hint: $('#hintBtn'),
    scare: $('#scareScore'),
    laugh: $('#laughScore'),
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
  let levelIndex = Math.min(LEVELS.length - 1, Math.max(0, Number(saved.level) || 0));
  let unlocked = Math.min(LEVELS.length - 1, Math.max(levelIndex, Number(saved.unlocked) || 0));
  let selectedTrigger = null;
  let connections = {};
  let running = false;
  let firedEvents = [];
  let firingTrigger = null;
  let firingAction = null;
  let scare = 0;
  let laugh = 0;
  let hintTimer = 0;
  let popTimer = 0;

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
      if (!running && el.modal.hidden) setFeedback(t('hints')[levelIndex]);
    }, 30000);
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function connectTrigger(trigger) {
    if (running) return;
    selectedTrigger = trigger;
    setFeedback(t('chooseAction'));
    renderCards();
    scheduleHint();
  }

  function connectAction(action) {
    if (running) return;
    if (!selectedTrigger) {
      setFeedback(t('selectTrigger'));
      return;
    }

    Object.keys(connections).forEach((trigger) => {
      if (connections[trigger] === action) delete connections[trigger];
    });
    connections[selectedTrigger] = action;
    setFeedback(t('wired', t('triggers')[selectedTrigger], t('actions')[action]));
    selectedTrigger = null;
    window.cool.track('connect_event_wire');
    renderCards();
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

  function renderCards() {
    el.triggers.innerHTML = level().triggers.map((id) => {
      const connected = Boolean(connections[id]);
      return `<button class="wire-card ${selectedTrigger === id ? 'is-selected' : ''} ${connected ? 'is-connected' : ''} ${firingTrigger === id ? 'is-firing' : ''}" type="button" data-trigger="${id}" ${running ? 'disabled' : ''}>
        <b aria-hidden="true">${t('triggerIcons')[id]}</b><span>${t('triggers')[id]}</span>
      </button>`;
    }).join('');
    el.actions.innerHTML = level().actions.map((id) => {
      const connected = Object.values(connections).includes(id);
      return `<button class="wire-card ${connected ? 'is-connected' : ''} ${firingAction === id ? 'is-firing' : ''}" type="button" data-action="${id}" ${running ? 'disabled' : ''}>
        <b aria-hidden="true">${t('actionIcons')[id]}</b><span>${t('actions')[id]}</span>
      </button>`;
    }).join('');

    el.triggers.querySelectorAll('[data-trigger]').forEach((button) => {
      button.addEventListener('click', () => connectTrigger(button.dataset.trigger));
    });
    el.actions.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => connectAction(button.dataset.action));
    });
    requestAnimationFrame(drawWires);
  }

  function drawWires() {
    const boardRect = el.board.getBoundingClientRect();
    const svgTop = el.wires.getBoundingClientRect().top;
    const width = Math.max(1, boardRect.width);
    const height = Math.max(1, el.wires.getBoundingClientRect().height);
    el.wires.setAttribute('viewBox', `0 0 ${width} ${height}`);

    el.wires.innerHTML = Object.entries(connections).map(([trigger, action]) => {
      const from = el.triggers.querySelector(`[data-trigger="${trigger}"]`)?.getBoundingClientRect();
      const to = el.actions.querySelector(`[data-action="${action}"]`)?.getBoundingClientRect();
      if (!from || !to) return '';
      const x1 = from.right - boardRect.left - 3;
      const y1 = from.top + from.height / 2 - svgTop;
      const x2 = to.left - boardRect.left + 3;
      const y2 = to.top + to.height / 2 - svgTop;
      const bend = Math.max(18, (x2 - x1) * 0.58);
      return `<path class="wire-path" d="M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}"></path>
        <circle class="wire-plug" cx="${x1}" cy="${y1}" r="6"></circle>
        <circle class="wire-plug" cx="${x2}" cy="${y2}" r="6"></circle>`;
    }).join('');
  }

  function renderFeed() {
    el.feed.innerHTML = level().triggers.map((id) =>
      `<span class="feed-chip ${firedEvents.includes(id) ? 'is-fired' : ''}">${t('triggerIcons')[id]} ${t('triggers')[id]}</span>`).join('');
  }

  function renderScores() {
    el.scare.textContent = scare;
    el.laugh.textContent = laugh;
  }

  function clearStage() {
    el.stage.querySelectorAll('[data-prop]').forEach((prop) => prop.classList.remove('is-active'));
    el.visitor.classList.remove('is-walking', 'is-startled');
    el.eventPop.classList.remove('is-visible');
    clearTimeout(popTimer);
  }

  function showPop(message) {
    clearTimeout(popTimer);
    el.eventPop.textContent = message;
    el.eventPop.classList.add('is-visible');
    popTimer = window.setTimeout(() => el.eventPop.classList.remove('is-visible'), 900);
  }

  function activateProp(action) {
    const prop = el.stage.querySelector(`[data-prop="${action}"]`);
    prop?.classList.add('is-active');
    el.visitor.classList.add('is-startled');
    window.setTimeout(() => el.visitor.classList.remove('is-startled'), 330);
  }

  async function runShow() {
    if (running) return;
    const missing = level().triggers.some((id) => !connections[id]);
    if (missing) {
      setFeedback(t('incomplete'));
      return;
    }

    running = true;
    firedEvents = [];
    firingTrigger = null;
    firingAction = null;
    scare = 0;
    laugh = 0;
    clearStage();
    el.visitor.classList.add('is-walking');
    setFeedback(t('testing'));
    window.cool.track('run_event_show');
    render();

    const queue = [...level().events];
    while (queue.length) {
      const trigger = queue.shift();
      const action = connections[trigger];
      firingTrigger = trigger;
      firedEvents.push(trigger);
      showPop(t('eventNow', t('triggers')[trigger]));
      renderCards();
      renderFeed();
      await wait(430);

      firingAction = action;
      showPop(t('actionNow', t('actions')[action]));
      activateProp(action);
      const [scarePoints, laughPoints] = level().scores[action] || [0, 0];
      scare += scarePoints;
      laugh += laughPoints;
      renderCards();
      renderScores();
      await wait(470);

      if (level().expected[trigger] === action && level().emits?.[action]) {
        queue.push(level().emits[action]);
      }
    }

    firingTrigger = null;
    firingAction = null;
    running = false;
    const wrongTrigger = level().triggers.find((id) => connections[id] !== level().expected[id]);
    if (wrongTrigger) {
      setFeedback(t('wrong', t('triggers')[wrongTrigger], t('actions')[level().expected[wrongTrigger]]));
      window.cool.track('retry_event_wiring');
      render();
      scheduleHint();
      return;
    }

    setFeedback(t('success')[levelIndex]);
    window.cool.track('solve_event_show');
    render();
    await wait(260);
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
    el.modalText.textContent = `${t('success')[levelIndex]} ${t('score', scare, laugh)}`;
    el.next.textContent = levelIndex === LEVELS.length - 1 ? t('replay') : t('next');
    el.modal.hidden = false;
    renderLevels();
  }

  function resetLevel() {
    clearTimeout(hintTimer);
    selectedTrigger = null;
    connections = {};
    running = false;
    firedEvents = [];
    firingTrigger = null;
    firingAction = null;
    scare = 0;
    laugh = 0;
    el.modal.hidden = true;
    clearStage();
    setFeedback(t('starts')[levelIndex]);
    window.cool.stage(`room-${levelIndex + 1}`);
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

  function render() {
    el.mission.textContent = t('missions')[levelIndex];
    el.reset.setAttribute('aria-label', t('reset'));
    el.hint.setAttribute('aria-label', t('hint'));
    el.open.textContent = running ? t('testing') : t('open');
    el.open.disabled = running;
    renderLevels();
    renderCards();
    renderFeed();
    renderScores();
  }

  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.reset.addEventListener('click', resetLevel);
  el.hint.addEventListener('click', () => {
    setFeedback(t('hints')[levelIndex]);
    window.cool.track('open_event_hint');
    scheduleHint();
  });
  el.open.addEventListener('click', runShow);
  el.next.addEventListener('click', nextLevel);
  window.addEventListener('resize', () => requestAnimationFrame(drawWires));

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
