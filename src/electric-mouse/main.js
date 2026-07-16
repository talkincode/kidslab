/* ============================================================
   🐭 电工鼠小镇 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '🐭 电工鼠小镇 · KidsLab',
      back: '返回平台',
      title: '电工鼠小镇',
      eyebrow: '科学课件 · 电路侦探任务',
      tip0: '拖元件、点端子接线，让小镇重新亮起来。',
      toolbox: '工具箱', toolHint: '点工具再点板上放置；点空心端子○再点另一个端子接线。按住元件中间可拖动，点一下开关切换，双击灯泡拧下/装回。',
      notebook: '电工鼠笔记', conductors: '会导电', insulators: '不导电',
      legendOn: '通路', legendGap: '断路', legendShort: '短路',
      test: '通电测试 ⚡', reset: '重置', delete: '删除选中', next: '下一关 →',
      statusOpen: '断电中', statusOn: '灯亮了！', statusDim: '有点暗', statusShort: '短路警报', statusWon: '任务完成',
      onTag: '合', offTag: '断', dimTag: '偏暗', gapHere: '缺口在这里', gapMany: '把亮圈圈用导线连起来',
      fixedWire: '这条教学线固定，不能剪。', fixedPart: '这个教学元件固定，留着观察吧。',
      levelKicker: (a, b) => `任务 ${a} / ${b}`,
      sandboxKicker: '自由沙盒',
      coachStart: '欢迎来到老鼠小镇！先放电池和灯泡，再把端子连成一个圈。',
      coachWire: '端子变成星星啦！再点另一个端子，导线就会啪嗒接上。',
      coachDelete: '已剪掉。现实里剪线前要先断电，电工鼠给你点赞。',
      coachOpen: '这里像小桥断开，电流跑不过去。找找没接上的端子。',
      coachOn: '看！金色电流粒子沿着闭合回路奔跑。',
      coachDim: '串联灯泡要分享同一份能量，所以每盏都会变暗。',
      coachShort: '呲啦！电流走了捷径，绕开灯泡就是短路。剪掉红色捷径线！',
      coachShortWire: '这根新线让电流抄了近路！已帮你选中，点「删除选中」剪掉，再找灯泡两头的空心端子○重新接。',
      coachParallel: '并联像每户有自己的小路，一户坏了也不挡别人回家。',
      coachBroken: '灯泡被拧下了：它所在的路断开。再双击可装回。',
      coachSpdt: '双控开关像岔路，两个开关拨到同一条线，楼道灯就亮。',
      coachOnMiss: (hint) => `灯亮啦，但任务还差一步：${hint}`,
      toastTool: (name) => `已选中：${name}。去接线板点一下放置。`,
      toastSameComp: '导线的两头要接在两个不同的零件上哦。',
      toastNeedBattery: '先放一节电池，电工鼠才有能量源。',
      toastWin: '电工鼠盖章通过！',
      toastMagic: '魔法时刻：全镇灯火通明！镇长鼠颁发并联奖章！',
      toastNoWire: '点一个端子开始拉线，或选择元件放置。',
      winTitle: '电工鼠盖章通过！',
      winDesc: (n) => `第 ${n} 个委托完成，小镇更亮了一点。`,
      finalWin: '沙盒已解锁：你是真正的电路设计师！',
      dexEmpty: '还没记录',
      compBattery: '电池', compLamp: '灯泡', compSwitch: '开关', compWire: '导线', compSpoon: '铁勺', compWood: '木棍', compDuck: '橡皮鸭', compPencil: '铅笔芯', compKey: '钥匙', compYarn: '毛线', compSpdt: '双控开关',
      levelNames: [
        '点亮第一盏灯', '加开关控制', '找断点', '导体实验室', '短路事故现场',
        '两灯串联', '串改并：老鼠街抗议', '开关逻辑', '楼道双控开关之谜', '自由沙盒',
      ],
      levelBriefs: [
        '把电池和灯泡接成完整回路，让第一户鼠屋亮灯。',
        '点一下开关试试：合上才亮，打开就灭。',
        '这户人家的线少了一段，找到缺口并补上。',
        '把杂物接进断口：铁勺会亮，橡皮鸭不会，铅笔芯微亮；记录图鉴。',
        '红色捷径线造成短路，点它再按删除剪掉，让灯泡正常发光。',
        '补上中间缺的导线，把两盏灯串成一串，看它们一起变暗；双击灯泡可拧下。',
        '四户串联太脆弱！剪掉旧线改成并联，让每户独立全亮。',
        '点一下总开关，同时点亮两盏灯，体会干路与支路。',
        '两个双控开关控制一盏楼道灯，点任意一个都能改变通断。',
        '无限元件自由搭建，实时判定通路、断路和短路。',
      ],
      passHints: [
        '目标：至少一盏灯全亮。', '目标：开关闭合后灯亮。', '目标：补好缺口。', '目标：图鉴里同时有导体和绝缘体，并让灯亮。', '目标：没有短路且灯亮。',
        '目标：两盏灯都亮但偏暗。', '目标：四盏灯都全亮。', '目标：一个总开关点亮两盏灯。', '目标：楼道双控灯亮。', '目标：搭出任意安全亮灯电路。',
      ],
      /* ✏️ 静态文案 key…；动态文案用函数：score: (n) => `得分 ${n}` */
    },
    en: {
      doc: '🐭 Electric Mouse Town · KidsLab',
      back: 'Back to platform',
      title: 'Electric Mouse Town',
      eyebrow: 'Science courseware · Circuit detective missions',
      tip0: 'Drag parts, tap terminals, and bring Mouse Town back to light.',
      toolbox: 'Toolbox', toolHint: 'Pick a tool, then tap the board. Tap a hollow terminal ○, then another, to wire. Drag parts by the middle; tap switches to flip; double-tap bulbs to unscrew.',
      notebook: 'Mouse electrician notes', conductors: 'Conducts', insulators: 'Insulates',
      legendOn: 'closed', legendGap: 'open', legendShort: 'short',
      test: 'Power test ⚡', reset: 'Reset', delete: 'Delete selected', next: 'Next →',
      statusOpen: 'open circuit', statusOn: 'lights on!', statusDim: 'a little dim', statusShort: 'short alert', statusWon: 'mission done',
      onTag: 'ON', offTag: 'OFF', dimTag: 'dim', gapHere: 'gap here', gapMany: 'wire up the glowing rings',
      fixedWire: 'This teaching wire is fixed.', fixedPart: 'This teaching part is fixed for the mission.',
      levelKicker: (a, b) => `Mission ${a} / ${b}`,
      sandboxKicker: 'Free sandbox',
      coachStart: 'Welcome to Mouse Town! Place a battery and bulb, then wire the terminals into a loop.',
      coachWire: 'The terminal is sparkling! Tap another terminal to snap a wire in place.',
      coachDelete: 'Snipped. In real life: power off first — Electric Mouse approves.',
      coachOpen: 'There is a broken bridge here. Current cannot cross until the gap is connected.',
      coachOn: 'Look! Golden current particles are racing around the closed circuit.',
      coachDim: 'Series bulbs share one energy path, so each bulb gets dimmer.',
      coachShort: 'Bzzzt! Current took a shortcut around the bulbs. Cut the red bypass wire!',
      coachShortWire: "That new wire made a shortcut! It's selected now — press Delete, then use the bulb's hollow terminals ○.",
      coachParallel: 'Parallel branches give every house its own path; one failure will not block the rest.',
      coachBroken: 'The bulb was removed: that branch is open. Double-tap to restore it.',
      coachSpdt: 'Two-way switches are little forks. Match both switches to the same traveler and the hall light turns on.',
      coachOnMiss: (hint) => `The lamp is on, but the mission needs one more step: ${hint}`,
      toastTool: (name) => `Selected: ${name}. Tap the board to place it.`,
      toastSameComp: 'A wire needs two different parts, one for each end.',
      toastNeedBattery: 'Place a battery first: Mouse Town needs a source.',
      toastWin: 'Electric Mouse approved!',
      toastMagic: 'Magic moment: the whole town lights up! Mayor Mouse awards the Parallel Medal!',
      toastNoWire: 'Tap a terminal to start a wire, or pick a part to place.',
      winTitle: 'Electric Mouse approved!',
      winDesc: (n) => `Mission ${n} complete. Mouse Town is brighter.`,
      finalWin: 'Sandbox unlocked: you are a real circuit designer!',
      dexEmpty: 'No notes yet',
      compBattery: 'Battery', compLamp: 'Bulb', compSwitch: 'Switch', compWire: 'Wire', compSpoon: 'Spoon', compWood: 'Wood stick', compDuck: 'Rubber duck', compPencil: 'Pencil lead', compKey: 'Key', compYarn: 'Yarn', compSpdt: 'Two-way switch',
      levelNames: [
        'Light the first bulb', 'Add a control switch', 'Find the gap', 'Conductor lab', 'Short-circuit scene',
        'Two bulbs in series', 'Series to parallel: Mouse Street protest', 'Switch logic', 'Two-way hallway switch', 'Free sandbox',
      ],
      levelBriefs: [
        'Wire a battery and bulb into a complete loop.',
        'Tap the switch and see: closed is on, open is off.',
        'This home is missing one wire. Find and bridge the gap.',
        'Test objects in the gap: spoon lights, duck does not, pencil lead glows weakly; record the notebook.',
        'The red shortcut is a short. Tap it, press delete, then power the bulb normally.',
        'Add the missing middle wire to chain two bulbs in series and watch both dim; double-tap a bulb to remove it.',
        'Four homes in series are fragile! Cut old wires and rewire in parallel so all shine independently.',
        'Tap the main switch to power two bulbs at once — trunk and branches.',
        'Two two-way switches control one hall light. Tapping either one flips it.',
        'Unlimited parts. Build freely while the simulator checks open, closed and short circuits.',
      ],
      passHints: [
        'Goal: at least one bright bulb.', 'Goal: bulb lights when the switch is closed.', 'Goal: repair the gap.', 'Goal: log both a conductor and an insulator, then light the bulb.', 'Goal: no short, and the bulb lights.', 'Goal: two bulbs are on but dim.',
        'Goal: four bulbs glow bright.', 'Goal: one main switch lights two bulbs.', 'Goal: the two-way hall lamp is on.', 'Goal: make any safe lit circuit.',
      ],
    },
  };

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* 忽略 */ } },
  };

  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme)
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme !== 'light' && theme !== 'dark') theme = 'light';

  /** 取当前语言文案；函数型 key 直接返回函数供调用方传参 */
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  /* 主题色缓存：每帧读 getComputedStyle 太贵，只在主题切换时刷新一次 */
  const PALETTE_KEYS = [
    '--font', '--sky-top', '--sky-bottom', '--paper', '--paper-2', '--card',
    '--ink', '--ink-on-accent', '--ink-soft', '--ink-faint', '--line', '--line-strong',
    '--accent', '--accent-2', '--ok', '--danger', '--spark', '--smoke', '--town', '--window-off',
    '--c-physics', '--c-chemistry',
  ];
  const palette = {};
  function refreshPalette() {
    const cs = getComputedStyle(document.documentElement);
    for (const k of PALETTE_KEYS) palette[k] = cs.getPropertyValue(k).trim();
  }
  /** 读取 CSS 主题变量（Canvas/three.js 取色必须走这里，勿硬编码） */
  const cssVar = (name) => palette[name] || getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const langBtn = document.getElementById('langBtn');
  const themeBtn = document.getElementById('themeBtn');

  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((n) => {
      const v = I18N[lang][n.dataset.t];
      if (typeof v === 'string') n.textContent = v;
    });
    if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    buildToolbox();
    updateUi();
    render(); // 语言切换后重绘动态文案
  }

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    refreshPalette();
    /* Canvas / three.js 课件监听该事件重取 cssVar 配色 */
    dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    render();
  }

  langBtn?.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    store.set(LS.lang, lang);
    applyLang();
  });
  themeBtn?.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set(LS.theme, theme);
    applyTheme();
  });

  /* ======================= 🐭 游戏区 · Game ======================= */
  const $ = (s) => document.querySelector(s);
  const canvas = $('#stage');
  const ctx = canvas.getContext('2d');
  const toolbox = $('#toolbox');
  const toastEl = $('#toast');
  const coachBubble = $('#coachBubble');
  const statusText = $('#statusText');
  const mouseMood = $('#mouseMood');
  const levelKicker = $('#levelKicker');
  const levelTitle = $('#levelTitle');
  const levelBrief = $('#levelBrief');
  const nextBtn = $('#nextBtn');
  const win = $('#win');
  const winTitle = $('#winTitle');
  const winDesc = $('#winDesc');
  const winEmoji = $('#winEmoji');
  const goodDex = $('#goodDex');
  const badDex = $('#badDex');
  const testBtn = $('#testBtn');
  const resetBtn = $('#resetBtn');
  const deleteBtn = $('#deleteBtn');
  const winNext = $('#winNext');

  const GRID = 34;
  const HIT_R = 22;
  /* 元件本体内：离端子小圆点这么近才算“点端子”，其余是拖动/开关（防止端子吞掉整个元件） */
  const TERM_GRAB = 24;
  /* 固定逻辑坐标系：所有关卡布局都按这个尺寸设计，渲染时等比缩放适配画布 */
  const BOARD = { w: 880, h: 560 };
  const SKY_H = 176;
  const TYPES = {
    battery: { key: 'compBattery', icon: '🔋', w: 92, h: 54 },
    lamp: { key: 'compLamp', icon: '💡', w: 84, h: 66 },
    switch: { key: 'compSwitch', icon: '🔘', w: 92, h: 58 },
    wire: { key: 'compWire', icon: '〰️', isWire: true },
    spoon: { key: 'compSpoon', icon: '🥄', w: 86, h: 50, conductivity: 1, item: true },
    wood: { key: 'compWood', icon: '🪵', w: 86, h: 50, conductivity: 0, item: true },
    duck: { key: 'compDuck', icon: '🦆', w: 86, h: 50, conductivity: 0, item: true },
    pencil: { key: 'compPencil', icon: '✏️', w: 86, h: 50, conductivity: 0.36, item: true },
    key: { key: 'compKey', icon: '🔑', w: 86, h: 50, conductivity: 1, item: true },
    yarn: { key: 'compYarn', icon: '🧶', w: 86, h: 50, conductivity: 0, item: true },
    spdt: { key: 'compSpdt', icon: '↔️', w: 96, h: 70, spdt: true },
  };

  const TOOL_ORDER = ['battery', 'lamp', 'switch', 'wire', 'spoon', 'wood', 'duck', 'pencil', 'key', 'yarn', 'spdt'];
  const state = {
    level: 0,
    comps: [],
    wires: [],
    selectedTool: 'wire',
    selected: null,
    wireStart: null,
    drag: null,
    pointer: null,
    lastTap: { id: '', at: 0 },
    idSeq: 1,
    solved: null,
    passed: false,
    celebrated: false,
    magicDone: false,
    dex: { good: {}, bad: {} },
    fireworks: [],
    smoke: [],
    lastTime: 0,
    tick: 0,
    audio: null,
    soundReady: false,
    view: { scale: 1, ox: 0, oy: 0, dpr: 1, cssW: BOARD.w, cssH: BOARD.h, ui: 1 },
  };

  const LEVELS = [
    { tools: ['battery', 'lamp', 'wire'], setup: levelOne, goal: goalBrightOne },
    { tools: ['battery', 'lamp', 'switch', 'wire'], setup: levelTwo, goal: goalSwitch },
    { tools: ['wire'], setup: levelThree, goal: goalBrightOne },
    { tools: ['wire', 'spoon', 'wood', 'duck', 'pencil', 'key', 'yarn'], setup: levelFour, goal: goalLab },
    { tools: ['wire'], setup: levelFive, goal: goalNoShortBright },
    { tools: ['battery', 'lamp', 'wire'], setup: levelSix, goal: goalSeriesDim },
    { tools: ['wire'], setup: levelSeven, goal: goalParallelStreet, magic: true },
    { tools: ['battery', 'lamp', 'switch', 'wire'], setup: levelEight, goal: goalMainSwitch },
    { tools: ['wire', 'spdt'], setup: levelNine, goal: goalSpdt },
    { tools: TOOL_ORDER, setup: levelTen, goal: goalSandbox },
  ];

  function tr(arrKey, i) { return t(arrKey)[i]; }
  function nameOf(type) { return t(TYPES[type].key); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function dist(a, b, c, d) { return Math.hypot(a - c, b - d); }
  function snap(v) { return Math.round(v / GRID) * GRID; }
  function now() { return performance.now(); }

  function makeId(prefix) {
    const id = `${prefix}${state.idSeq}`;
    state.idSeq += 1;
    return id;
  }

  function clampToBoard(c) {
    c.x = clamp(c.x, c.w / 2 + 6, BOARD.w - c.w / 2 - 6);
    c.y = clamp(c.y, SKY_H + c.h / 2 + 8, BOARD.h - c.h / 2 - 8);
  }

  function addComp(type, x, y, opts = {}) {
    const spec = TYPES[type];
    const c = {
      id: opts.id || makeId(type[0]),
      type,
      x: snap(x), y: snap(y),
      w: spec.w || 80, h: spec.h || 50,
      closed: opts.closed ?? false,
      broken: opts.broken ?? false,
      throwTo: opts.throwTo ?? 1,
      fixed: !!opts.fixed,
      label: opts.label || '',
    };
    clampToBoard(c);
    state.comps.push(c);
    return c;
  }

  function termCount(c) { return c.type === 'spdt' ? 3 : 2; }
  function termId(c, i) { return `${c.id}:${i}`; }
  function compById(id) { return state.comps.find((c) => c.id === id); }
  function parseTerm(id) {
    const [cid, idx] = id.split(':');
    return { comp: compById(cid), idx: Number(idx) };
  }

  function termPos(c, i) {
    if (c.type === 'spdt') {
      if (i === 0) return { x: c.x - c.w / 2 + 4, y: c.y };
      if (i === 1) return { x: c.x + c.w / 2 - 4, y: c.y - c.h / 4 };
      return { x: c.x + c.w / 2 - 4, y: c.y + c.h / 4 };
    }
    return i === 0
      ? { x: c.x - c.w / 2 + 2, y: c.y }
      : { x: c.x + c.w / 2 - 2, y: c.y };
  }

  function addWire(a, b, opts = {}) {
    if (!a || !b || a === b) return null;
    /* 同一个零件的两端不许互连：那是给自己“短接”，不是电路 */
    if (a.split(':')[0] === b.split(':')[0]) return null;
    const existing = state.wires.find((w) => (w.a === a && w.b === b) || (w.a === b && w.b === a));
    if (existing) return existing;
    const w = { id: opts.id || makeId('w'), a, b, fixed: !!opts.fixed, cut: false };
    state.wires.push(w);
    return w;
  }

  function wireBetween(c1, i1, c2, i2, opts = {}) {
    return addWire(termId(c1, i1), termId(c2, i2), opts);
  }

  function clearBoard() {
    state.comps = [];
    state.wires = [];
    state.selected = null;
    state.wireStart = null;
    state.drag = null;
    state.idSeq = 1;
    state.passed = false;
    state.celebrated = false;
    state.magicDone = false;
    state.fireworks = [];
    state.smoke = [];
    state.dex = state.level === 3 ? state.dex : { good: {}, bad: {} };
  }

  function loadLevel(i) {
    state.level = clamp(i, 0, LEVELS.length - 1);
    clearBoard();
    LEVELS[state.level].setup();
    state.selectedTool = LEVELS[state.level].tools.includes('wire') ? 'wire' : LEVELS[state.level].tools[0];
    win.hidden = true;
    setCoach(state.level === 0 ? t('coachStart') : `${tr('levelBriefs', state.level)} ${tr('passHints', state.level)}`);
    buildToolbox();
    evaluate(true);
    render();
  }

  function buildToolbox() {
    toolbox.innerHTML = '';
    const allowed = LEVELS[state.level].tools;
    for (const type of TOOL_ORDER) {
      if (!allowed.includes(type)) continue;
      const spec = TYPES[type];
      const btn = document.createElement('button');
      btn.className = `tool${state.selectedTool === type ? ' is-on' : ''}`;
      btn.type = 'button';
      btn.dataset.type = type;
      btn.innerHTML = `<i>${spec.icon}</i>${nameOf(type)}`;
      btn.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        resumeAudio();
        state.selectedTool = type;
        state.wireStart = null;
        state.selected = null;
        toast(t('toastTool')(nameOf(type)));
        buildToolbox();
        render();
      });
      toolbox.appendChild(btn);
    }
  }

  function levelOne() {
    addComp('battery', 250, 400, { fixed: true });
    addComp('lamp', 560, 400);
  }

  function levelTwo() {
    const b = addComp('battery', 230, 400, { fixed: true });
    const s = addComp('switch', 420, 325, { closed: false });
    const l = addComp('lamp', 620, 400);
    wireBetween(b, 1, s, 0, { fixed: true });
    wireBetween(s, 1, l, 1, { fixed: true });
    wireBetween(l, 0, b, 0, { fixed: true });
  }

  function levelThree() {
    const b = addComp('battery', 230, 395, { fixed: true });
    const l = addComp('lamp', 590, 395, { fixed: true });
    wireBetween(b, 1, l, 1, { fixed: true });
  }

  function levelFour() {
    const b = addComp('battery', 210, 400, { fixed: true });
    const l = addComp('lamp', 630, 400, { fixed: true });
    wireBetween(b, 1, l, 1, { fixed: true });
    state.wireStart = termId(b, 0);
  }

  function levelFive() {
    const b = addComp('battery', 220, 440, { fixed: true });
    const l = addComp('lamp', 590, 360, { fixed: true });
    wireBetween(b, 1, l, 1, { fixed: true });
    wireBetween(l, 0, b, 0, { fixed: true });
    /* 红色捷径：从电池+直通灯泡另一端，绕开灯丝 → 短路 */
    wireBetween(b, 1, l, 0, { id: 'short-wire' });
  }

  function levelSix() {
    const b = addComp('battery', 210, 405, { fixed: true });
    const l1 = addComp('lamp', 445, 335);
    const l2 = addComp('lamp', 625, 445);
    wireBetween(b, 1, l1, 1, { fixed: true });
    wireBetween(l2, 0, b, 0, { fixed: true });
  }

  function levelSeven() {
    const b = addComp('battery', 160, 440, { fixed: true });
    const lamps = [290, 420, 550, 680].map((x, i) => addComp('lamp', x, 360 + (i % 2) * 92, { fixed: true, label: `${i + 1}` }));
    wireBetween(b, 1, lamps[0], 1);
    wireBetween(lamps[0], 0, lamps[1], 1);
    wireBetween(lamps[1], 0, lamps[2], 1);
    wireBetween(lamps[2], 0, lamps[3], 1);
    wireBetween(lamps[3], 0, b, 0);
  }

  function levelEight() {
    const b = addComp('battery', 180, 430, { fixed: true });
    const s = addComp('switch', 355, 430, { closed: false });
    const l1 = addComp('lamp', 570, 345);
    const l2 = addComp('lamp', 570, 500);
    wireBetween(b, 1, s, 0, { fixed: true });
    wireBetween(s, 1, l1, 1, { fixed: true });
    wireBetween(s, 1, l2, 1, { fixed: true });
    wireBetween(l1, 0, b, 0, { fixed: true });
    wireBetween(l2, 0, b, 0, { fixed: true });
  }

  function levelNine() {
    const b = addComp('battery', 160, 430, { fixed: true });
    const a = addComp('spdt', 340, 430, { throwTo: 1 });
    const d = addComp('spdt', 570, 430, { throwTo: 2 });
    const l = addComp('lamp', 750, 360, { fixed: true });
    wireBetween(b, 1, a, 0, { fixed: true });
    wireBetween(a, 1, d, 1, { fixed: true });
    wireBetween(a, 2, d, 2, { fixed: true });
    wireBetween(d, 0, l, 1, { fixed: true });
    wireBetween(l, 0, b, 0, { fixed: true });
  }

  function levelTen() {
    addComp('battery', 190, 420, { fixed: true });
    addComp('lamp', 520, 420);
  }

  function componentEdges(c) {
    const edges = [];
    if (c.type === 'lamp') {
      if (!c.broken) edges.push({ a: termId(c, 0), b: termId(c, 1), kind: 'lamp', comp: c, lamp: c.id, conductivity: 1 });
    } else if (c.type === 'switch') {
      if (c.closed) edges.push({ a: termId(c, 0), b: termId(c, 1), kind: 'switch', comp: c, conductivity: 1 });
    } else if (TYPES[c.type].item) {
      const conductivity = TYPES[c.type].conductivity;
      if (conductivity > 0) edges.push({ a: termId(c, 0), b: termId(c, 1), kind: 'item', comp: c, item: c.type, conductivity });
    } else if (c.type === 'spdt') {
      edges.push({ a: termId(c, 0), b: termId(c, c.throwTo), kind: 'spdt', comp: c, conductivity: 1 });
    }
    return edges;
  }

  function battery() { return state.comps.find((c) => c.type === 'battery'); }

  function buildGraph() {
    const edges = [];
    for (const w of state.wires) {
      if (!w.cut) edges.push({ a: w.a, b: w.b, kind: 'wire', wire: w, conductivity: 1 });
    }
    for (const c of state.comps) edges.push(...componentEdges(c));
    const adj = new Map();
    for (const e of edges) {
      if (!adj.has(e.a)) adj.set(e.a, []);
      if (!adj.has(e.b)) adj.set(e.b, []);
      adj.get(e.a).push({ to: e.b, edge: e });
      adj.get(e.b).push({ to: e.a, edge: e });
    }
    return { edges, adj };
  }

  function enumeratePaths(adj, start, end, maxDepth = 28) {
    const paths = [];
    const seenKey = new Set();
    function dfs(node, visited, edgePath) {
      if (edgePath.length > maxDepth || paths.length > 80) return;
      if (node === end) {
        const key = edgePath.map((e) => e.kind + (e.wire?.id || e.comp?.id || '')).sort().join('|');
        if (!seenKey.has(key)) {
          seenKey.add(key);
          paths.push([...edgePath]);
        }
        return;
      }
      const list = adj.get(node) || [];
      for (const { to, edge } of list) {
        if (visited.has(to)) continue;
        visited.add(to);
        edgePath.push(edge);
        dfs(to, visited, edgePath);
        edgePath.pop();
        visited.delete(to);
      }
    }
    dfs(start, new Set([start]), []);
    return paths;
  }

  function openTerms(adj) {
    const terms = [];
    for (const c of state.comps) {
      for (let i = 0; i < termCount(c); i++) {
        const id = termId(c, i);
        if ((adj.get(id) || []).length === 0) terms.push(id);
      }
    }
    return terms;
  }

  function evaluate(silent = false) {
    const b = battery();
    if (!b) {
      state.solved = { status: 'open', paths: [], short: false, lamps: {}, activeWires: new Set(), shortWires: new Set(), activeComps: new Set(), gap: null, gaps: [], itemEdges: [] };
      if (!silent) setCoach(t('toastNeedBattery'));
      return state.solved;
    }
    const { adj } = buildGraph();
    for (const c of state.comps) {
      if (!TYPES[c.type]?.item) continue;
      /* 接线只观察得出“不导电”（接上灯也不亮）；“会导电”要等电流真的流过才记入图鉴 */
      const linked = (tid) => (adj.get(tid) || []).some((n) => n.edge.comp !== c);
      if (TYPES[c.type].conductivity === 0 && linked(termId(c, 0)) && linked(termId(c, 1))) {
        noteItem(c.type, false);
      }
    }
    const paths = enumeratePaths(adj, termId(b, 1), termId(b, 0));
    const shortPaths = paths.filter((p) => p.every((e) => e.kind !== 'lamp'));
    const lampPaths = paths.filter((p) => p.some((e) => e.kind === 'lamp'));
    const short = shortPaths.length > 0;
    const lamps = {};
    const activeWires = new Set();
    const shortWires = new Set();
    const activeComps = new Set();
    const itemEdges = [];
    for (const c of state.comps) if (c.type === 'lamp') lamps[c.id] = 0;
    const chosen = short ? shortPaths : lampPaths;
    for (const p of chosen) {
      let lampCount = 0;
      let conductivity = 1;
      for (const e of p) {
        if (e.comp && !short) activeComps.add(e.comp.id);
        if (e.kind === 'lamp') lampCount += 1;
        if (e.kind === 'item') {
          conductivity = Math.min(conductivity, e.conductivity);
          itemEdges.push(e);
        }
      }
      for (const e of p) {
        if (e.kind === 'wire') (short ? shortWires : activeWires).add(e.wire.id);
        if (!short && e.kind === 'lamp') lamps[e.lamp] = Math.max(lamps[e.lamp] || 0, conductivity / Math.max(1, lampCount));
      }
    }
    for (const e of itemEdges) noteItem(e.item, e.conductivity > 0);
    const lit = Object.values(lamps).filter((v) => v > 0.08);
    const status = short ? 'short' : lit.length ? (lit.some((v) => v < 0.75) ? 'dim' : 'on') : 'open';
    const gaps = status === 'open' ? openTerms(adj) : [];
    state.solved = { status, paths, short, lamps, activeWires, shortWires, activeComps, gap: gaps[0] || null, gaps, itemEdges };
    state.passed = LEVELS[state.level].goal(state.solved);
    if (!state.passed) state.celebrated = false;
    if (state.passed && LEVELS[state.level].magic && !state.magicDone) magicMoment();
    if (!silent) reactToStatus(status);
    /* 玩家操作后刚达成目标 → 稍等片刻让孩子看到电流，再自动庆祝 */
    if (!silent && state.passed && !state.celebrated) {
      state.celebrated = true;
      const lvl = state.level;
      setTimeout(() => { if (state.passed && state.level === lvl) passLevel(); }, 800);
    }
    updateUi();
    return state.solved;
  }

  function noteItem(type, good) {
    if (!TYPES[type]?.item) return;
    const bucket = good ? state.dex.good : state.dex.bad;
    bucket[type] = true;
  }

  function reactToStatus(status) {
    if (status === 'short') { setCoach(t('coachShort')); sfx.short(); burstSmoke(); }
    else if (status === 'on') {
      if (!state.passed) setCoach(t('coachOnMiss')(tr('passHints', state.level)));
      else setCoach(state.level === 6 ? t('coachParallel') : t('coachOn'));
      sfx.light();
    }
    else if (status === 'dim') { setCoach(t('coachDim')); sfx.tick(); }
    else { setCoach(t('coachOpen')); }
  }

  function goalBrightOne(sol) { return !sol.short && Object.values(sol.lamps).some((v) => v > 0.72); }
  /* 开关要真的“管着”亮灯回路（在通电路径上且闭合），绕过开关直连不算完成任务 */
  function inCircuitSwitchClosed(sol) {
    return state.comps.some((c) => c.type === 'switch' && c.closed && sol.activeComps?.has(c.id));
  }
  function goalSwitch(sol) { return goalBrightOne(sol) && inCircuitSwitchClosed(sol); }
  function goalLab(sol) {
    /* 点亮回路里要有会导电的实验材料，并且至少验证过一种不导电的材料 */
    return goalBrightOne(sol)
      && sol.itemEdges?.some((e) => e.conductivity > 0)
      && Object.keys(state.dex.bad).length > 0;
  }
  function goalNoShortBright(sol) { return !sol.short && Object.values(sol.lamps).some((v) => v > 0.72); }
  function goalSeriesDim(sol) {
    const lit = Object.values(sol.lamps).filter((v) => v > 0.25 && v < 0.72);
    return !sol.short && lit.length >= 2;
  }
  function goalParallelStreet(sol) {
    const bright = Object.values(sol.lamps).filter((v) => v >= 0.75);
    return !sol.short && bright.length >= 4;
  }
  function goalMainSwitch(sol) {
    const lit = Object.values(sol.lamps).filter((v) => v > 0.72);
    return !sol.short && lit.length >= 2 && inCircuitSwitchClosed(sol);
  }
  function goalSpdt(sol) {
    const spdts = state.comps.filter((c) => c.type === 'spdt');
    return !sol.short && Object.values(sol.lamps).some((v) => v > 0.72)
      && spdts.length >= 2 && spdts.every((c) => sol.activeComps?.has(c.id));
  }
  function goalSandbox(sol) { return goalBrightOne(sol); }

  function updateUi() {
    levelKicker.textContent = state.level === 9 ? t('sandboxKicker') : t('levelKicker')(state.level + 1, LEVELS.length);
    levelTitle.textContent = tr('levelNames', state.level);
    levelBrief.textContent = `${tr('levelBriefs', state.level)} ${tr('passHints', state.level)}`;
    const sol = state.solved;
    const key = state.passed ? 'statusWon' : sol?.status === 'short' ? 'statusShort' : sol?.status === 'on' ? 'statusOn' : sol?.status === 'dim' ? 'statusDim' : 'statusOpen';
    statusText.textContent = t(key);
    mouseMood.textContent = sol?.status === 'short' ? '🐭⚡' : state.passed ? '🐭🏅' : sol?.status === 'on' ? '🐭💡' : sol?.status === 'dim' ? '🐭🔎' : '🐭🌑';
    nextBtn.disabled = !state.passed || state.level >= LEVELS.length - 1;
    renderDex();
  }

  function renderDex() {
    const fill = (el, obj) => {
      el.innerHTML = '';
      const keys = Object.keys(obj);
      if (!keys.length) {
        const li = document.createElement('li');
        li.textContent = t('dexEmpty');
        el.appendChild(li);
        return;
      }
      keys.forEach((k) => {
        const li = document.createElement('li');
        li.textContent = `${TYPES[k].icon} ${nameOf(k)}`;
        el.appendChild(li);
      });
    };
    fill(goodDex, state.dex.good);
    fill(badDex, state.dex.bad);
  }

  function setCoach(msg) {
    coachBubble.textContent = msg;
    coachBubble.classList.remove('pop');
    void coachBubble.offsetWidth;
    coachBubble.classList.add('pop');
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    toastEl.classList.remove('show');
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => { toastEl.hidden = true; }, 2300);
  }

  function passLevel(showModal = true) {
    if (!state.passed) return;
    if (showModal) {
      win.hidden = false;
      winTitle.textContent = state.level === LEVELS.length - 1 ? t('finalWin') : t('winTitle');
      winDesc.textContent = t('winDesc')(state.level + 1);
      winEmoji.textContent = state.level === 6 ? '🏅🎆' : state.level === 9 ? '🧰✨' : '🐭🏅';
      confetti(28);
      sfx.win();
    }
  }

  function magicMoment() {
    state.magicDone = true;
    toast(t('toastMagic'));
    setCoach(t('coachParallel'));
    confetti(70);
    for (let i = 0; i < 36; i++) {
      state.fireworks.push({ x: Math.random(), y: Math.random() * 0.36, r: 0, life: 1, hue: Math.random() });
    }
    sfx.win();
  }

  function confetti(n) {
    const colors = ['var(--accent)', 'var(--accent-2)', 'var(--ok)', 'var(--c-physics)', 'var(--c-chemistry)'];
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.className = 'confetti';
      p.style.left = `${Math.random() * 100}vw`;
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = `${1.5 + Math.random() * 1.8}s`;
      p.style.transform = `rotate(${Math.random() * 180}deg)`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 3600);
    }
  }

  function resumeAudio() {
    if (state.soundReady) return;
    try {
      state.audio = state.audio || new (window.AudioContext || window.webkitAudioContext)();
      state.audio.resume?.();
      state.soundReady = true;
    } catch { /* sound unavailable */ }
  }

  function tone(freq, dur = 0.12, type = 'sine', gain = 0.08, delay = 0) {
    if (!state.soundReady || !state.audio) return;
    try {
      const a = state.audio;
      const at = a.currentTime + delay;
      const osc = a.createOscillator();
      const g = a.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(gain, at);
      g.gain.exponentialRampToValueAtTime(0.001, at + dur);
      osc.connect(g).connect(a.destination);
      osc.start(at);
      osc.stop(at + dur + 0.03);
    } catch { /* ignore */ }
  }

  const sfx = {
    tick: () => tone(420, 0.05, 'square', 0.045),
    click: () => { tone(220, 0.05, 'square', 0.05); tone(440, 0.04, 'triangle', 0.035, 0.04); },
    light: () => [660, 990, 1320].forEach((f, i) => tone(f, 0.1, 'triangle', 0.08, i * 0.055)),
    short: () => { tone(90, 0.22, 'sawtooth', 0.08); tone(63, 0.18, 'square', 0.04, 0.05); },
    win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.16, 'triangle', 0.08, i * 0.08)),
  };

  /* 指针 → 逻辑坐标：先转 CSS 像素，再去掉居中偏移、除以缩放（修复 retina 错位） */
  function eventPoint(ev) {
    const r = canvas.getBoundingClientRect();
    const { scale, ox, oy } = state.view;
    return { x: (ev.clientX - r.left - ox) / scale, y: (ev.clientY - r.top - oy) / scale };
  }

  /* 缩放后仍保证手指命中区：容差按 1/scale 放大，但设下限防止小屏端子命中圈吞掉整个元件 */
  function hitTol(base) { return base / Math.max(0.55, Math.min(1, state.view.scale)); }

  function hitTerminal(p) {
    const r = hitTol(HIT_R);
    for (let ci = state.comps.length - 1; ci >= 0; ci--) {
      const c = state.comps[ci];
      for (let i = 0; i < termCount(c); i++) {
        const q = termPos(c, i);
        if (dist(p.x, p.y, q.x, q.y) <= r) return { comp: c, idx: i, id: termId(c, i), p: q };
      }
    }
    return null;
  }

  function nearestTerm(c, p) {
    let best = null;
    for (let i = 0; i < termCount(c); i++) {
      const q = termPos(c, i);
      const d = dist(p.x, p.y, q.x, q.y);
      if (!best || d < best.d) best = { comp: c, idx: i, id: termId(c, i), p: q, d };
    }
    return best;
  }

  function hitComp(p) {
    for (let i = state.comps.length - 1; i >= 0; i--) {
      const c = state.comps[i];
      if (Math.abs(p.x - c.x) <= c.w / 2 + 8 && Math.abs(p.y - c.y) <= c.h / 2 + 10) return c;
    }
    return null;
  }

  function pointToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    const len = dx * dx + dy * dy || 1;
    const u = clamp(((px - ax) * dx + (py - ay) * dy) / len, 0, 1);
    const x = ax + u * dx, y = ay + u * dy;
    return Math.hypot(px - x, py - y);
  }

  /* 导线画成自然下垂的弧线（二次贝塞尔），不再横穿元件本体 */
  function wireCtrl(a, b) {
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const sag = Math.min(46, 10 + len * 0.12);
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + sag * 2 };
  }

  function wirePoint(a, b, u) {
    const cp = wireCtrl(a, b);
    const v = 1 - u;
    return { x: v * v * a.x + 2 * v * u * cp.x + u * u * b.x, y: v * v * a.y + 2 * v * u * cp.y + u * u * b.y };
  }

  function hitWire(p) {
    const tol = hitTol(13);
    let best = null;
    for (let i = 0; i < state.wires.length; i++) {
      const w = state.wires[i];
      const a = termPoint(w.a), b = termPoint(w.b);
      if (!a || !b) continue;
      let prev = a;
      for (let s = 1; s <= 14; s++) {
        const q = wirePoint(a, b, s / 14);
        const d = pointToSegment(p.x, p.y, prev.x, prev.y, q.x, q.y);
        if (d <= tol && (!best || d < best.d)) best = { wire: w, d };
        prev = q;
      }
    }
    return best;
  }

  function termPoint(id) {
    const { comp, idx } = parseTerm(id);
    return comp ? termPos(comp, idx) : null;
  }

  function placeSelected(p) {
    const type = state.selectedTool;
    if (type === 'wire') {
      toast(t('toastNoWire'));
      return;
    }
    const c = addComp(type, p.x, p.y, { closed: type === 'switch' ? false : undefined });
    state.selected = { kind: 'comp', id: c.id };
    sfx.click();
    evaluate(true);
  }

  function connectTerminal(hit) {
    if (!state.wireStart) {
      state.wireStart = hit.id;
      setCoach(t('coachWire'));
      sfx.tick();
    } else if (state.wireStart !== hit.id) {
      if (state.wireStart.split(':')[0] === hit.id.split(':')[0]) {
        toast(t('toastSameComp'));
        sfx.tick();
        state.wireStart = null;
        return;
      }
      const w = addWire(state.wireStart, hit.id);
      state.wireStart = null;
      sfx.click();
      const sol = evaluate();
      /* 新接的线直接造成短路 → 自动选中并教孩子删掉重接 */
      if (w && sol?.short && sol.shortWires?.has(w.id)) {
        state.selected = { kind: 'wire', id: w.id };
        setCoach(t('coachShortWire'));
      }
    } else {
      state.wireStart = null;
    }
  }

  function toggleComp(c) {
    if (c.type === 'switch') {
      c.closed = !c.closed;
      sfx.click();
      evaluate();
    } else if (c.type === 'spdt') {
      c.throwTo = c.throwTo === 1 ? 2 : 1;
      setCoach(t('coachSpdt'));
      sfx.click();
      evaluate();
    } else if (c.type === 'lamp') {
      c.broken = !c.broken;
      setCoach(t('coachBroken'));
      sfx.click();
      evaluate();
    }
  }

  function onPointerDown(ev) {
    resumeAudio();
    canvas.setPointerCapture(ev.pointerId);
    const p = eventPoint(ev);
    state.pointer = p;
    const c = hitComp(p);
    const inCore = c && Math.abs(p.x - c.x) <= c.w / 2 && Math.abs(p.y - c.y) <= c.h / 2;
    /* 拉线中：点元件本体 = 接它最近的端子（孩子瞄准灯泡即可，不必点中小圆点） */
    if (state.wireStart) {
      const term = c ? nearestTerm(c, p) : hitTerminal(p);
      if (term) {
        state.selected = { kind: 'term', id: term.id };
        connectTerminal(term);
        render();
        return;
      }
      state.wireStart = null; /* 点空白处取消拉线 */
    }
    /* 命中仲裁：本体内离端子圆点很近才算接线，其余是拖动/开关；空地上按 端子→导线→元件→放置 */
    if (inCore) {
      const term = nearestTerm(c, p);
      if (term && term.d <= TERM_GRAB) {
        state.selected = { kind: 'term', id: term.id };
        connectTerminal(term);
        render();
        return;
      }
      state.selected = { kind: 'comp', id: c.id };
      state.drag = { id: c.id, ox: p.x - c.x, oy: p.y - c.y, moved: false, warned: false };
      render();
      return;
    }
    /* 空地仲裁：端子和导线都在附近时，选离手指更近的（端子有 8px 偏心，接线优先） */
    const term = hitTerminal(p);
    const wireHit = hitWire(p);
    if (term && (!wireHit || dist(p.x, p.y, term.p.x, term.p.y) <= wireHit.d + 8)) {
      state.selected = { kind: 'term', id: term.id };
      connectTerminal(term);
      render();
      return;
    }
    if (wireHit) {
      state.selected = { kind: 'wire', id: wireHit.wire.id };
      render();
      return;
    }
    if (c) {
      state.selected = { kind: 'comp', id: c.id };
      state.drag = { id: c.id, ox: p.x - c.x, oy: p.y - c.y, moved: false, warned: false };
      render();
      return;
    }
    state.selected = null;
    state.wireStart = null;
    placeSelected(p);
    render();
  }

  function onPointerMove(ev) {
    const p = eventPoint(ev);
    state.pointer = p;
    if (!state.drag) return;
    const c = compById(state.drag.id);
    if (!c) return;
    if (c.fixed) {
      /* 教学元件拖不动：位移明显时提示一次，孩子不再以为拖动坏了 */
      const pull = Math.hypot(p.x - c.x - state.drag.ox, p.y - c.y - state.drag.oy);
      if (pull > 14 && !state.drag.warned) {
        state.drag.warned = true;
        toast(t('fixedPart'));
      }
      return;
    }
    const before = { x: c.x, y: c.y };
    c.x = snap(p.x - state.drag.ox);
    c.y = snap(p.y - state.drag.oy);
    clampToBoard(c);
    if (c.x !== before.x || c.y !== before.y) {
      state.drag.moved = true;
      evaluate(true);
    }
  }

  function onPointerUp(ev) {
    try { canvas.releasePointerCapture(ev.pointerId); } catch { /* ignore */ }
    const d = state.drag;
    state.drag = null;
    if (d && !d.moved) {
      /* 原地轻点：开关/双控单击即切换；灯泡双击拧下（防误触） */
      const c = compById(d.id);
      if (c) {
        if (c.type === 'switch' || c.type === 'spdt') {
          toggleComp(c);
        } else if (c.type === 'lamp') {
          if (state.lastTap.id === c.id && now() - state.lastTap.at < 360) {
            toggleComp(c);
            state.lastTap = { id: '', at: 0 };
          } else {
            state.lastTap = { id: c.id, at: now() };
          }
        }
      }
    } else if (d?.moved) {
      evaluate(true);
    }
    render();
  }

  function deleteSelected() {
    const sel = state.selected;
    if (!sel) return;
    if (sel.kind === 'wire') {
      state.wires = state.wires.filter((w) => w.id !== sel.id || w.fixed);
      if (state.wires.some((w) => w.id === sel.id && w.fixed)) toast(t('fixedWire'));
      else setCoach(t('coachDelete'));
    } else if (sel.kind === 'comp') {
      const c = compById(sel.id);
      if (c?.fixed) toast(t('fixedPart'));
      else {
        state.comps = state.comps.filter((x) => x.id !== sel.id);
        state.wires = state.wires.filter((w) => !w.a.startsWith(`${sel.id}:`) && !w.b.startsWith(`${sel.id}:`));
      }
    }
    state.selected = null;
    evaluate();
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  testBtn.addEventListener('click', () => { resumeAudio(); evaluate(); if (state.passed) passLevel(); render(); });
  resetBtn.addEventListener('click', () => loadLevel(state.level));
  deleteBtn.addEventListener('click', deleteSelected);
  nextBtn.addEventListener('click', () => { if (state.passed) loadLevel(state.level + 1); });
  winNext.addEventListener('click', () => { if (state.level < LEVELS.length - 1) loadLevel(state.level + 1); else win.hidden = true; });
  win.addEventListener('click', (ev) => { if (ev.target === win) win.hidden = true; });
  addEventListener('keydown', (ev) => {
    if (ev.key === 'Delete' || ev.key === 'Backspace') deleteSelected();
    if (ev.key === 'Escape') {
      if (!win.hidden) { win.hidden = true; return; }
      state.selected = null; state.wireStart = null; render();
    }
  });

  function resize() {
    const r = canvas.getBoundingClientRect();
    const cssW = Math.max(280, r.width || BOARD.w);
    const cssH = Math.max(200, r.height || BOARD.h);
    const dpr = Math.max(1, Math.min(2.5, devicePixelRatio || 1));
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    const scale = Math.min(cssW / BOARD.w, cssH / BOARD.h);
    const ox = (cssW - BOARD.w * scale) / 2;
    const oy = (cssH - BOARD.h * scale) / 2;
    /* ui：小屏时线宽/端子按比例加粗，保证可见可点 */
    const ui = clamp(1 / scale, 1, 1.9);
    state.view = { scale, ox, oy, dpr, cssW, cssH, ui };
    render();
  }

  function drawRoundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function fillTextCenter(txt, x, y, size = 22, weight = 900) {
    ctx.font = `${weight} ${size}px ${cssVar('--font')}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, x, y);
  }

  function drawStageBg(b) {
    const bw = b.x1 - b.x0;
    const grd = ctx.createLinearGradient(0, b.y0, 0, SKY_H);
    grd.addColorStop(0, cssVar('--sky-top'));
    grd.addColorStop(1, cssVar('--sky-bottom'));
    ctx.fillStyle = grd;
    ctx.fillRect(b.x0, b.y0, bw, SKY_H - b.y0);
    drawStars(b, SKY_H);
    drawTown(b, SKY_H);
    ctx.fillStyle = cssVar('--paper-2');
    ctx.fillRect(b.x0, SKY_H - 6, bw, b.y1 - SKY_H + 6);
    ctx.strokeStyle = cssVar('--line');
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = Math.floor(b.x0 / GRID) * GRID; x < b.x1; x += GRID) {
      ctx.moveTo(x, SKY_H); ctx.lineTo(x, b.y1);
    }
    for (let y = SKY_H; y < b.y1; y += GRID) {
      ctx.moveTo(b.x0, y); ctx.lineTo(b.x1, y);
    }
    ctx.stroke();
  }

  function drawStars(b, skyH) {
    const bw = Math.max(200, b.x1 - b.x0);
    ctx.fillStyle = cssVar('--spark');
    for (let i = 0; i < 34; i++) {
      const x = b.x0 + ((i * 97 + 31) % bw);
      const y = b.y0 + 18 + ((i * 41) % Math.max(70, skyH - b.y0 - 45));
      const r = i % 5 === 0 ? 2.2 : 1.2;
      ctx.globalAlpha = 0.3 + ((i % 7) / 10);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.font = '28px serif';
    ctx.fillText('🌙', b.x1 - 62, b.y0 + 44);
  }

  function drawTown(b, skyH) {
    const lamps = state.comps.filter((c) => c.type === 'lamp');
    const brightness = lamps.map((c) => state.solved?.lamps?.[c.id] || 0);
    const houses = state.level === 6 ? 7 : 5;
    const baseY = skyH - 8;
    const span = b.x1 - b.x0 - 80;
    for (let i = 0; i < houses; i++) {
      const x = b.x0 + 34 + i * (span / houses);
      const bw = Math.min(92, (span - 40) / houses);
      const bh = 45 + (i % 2) * 16;
      const lit = brightness[i % Math.max(1, brightness.length)] || (state.magicDone ? 1 : 0);
      ctx.fillStyle = cssVar('--town');
      ctx.strokeStyle = cssVar('--line-strong');
      ctx.lineWidth = 2.5;
      drawRoundRect(x, baseY - bh, bw, bh, 9);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 5, baseY - bh + 5); ctx.lineTo(x + bw / 2, baseY - bh - 27); ctx.lineTo(x + bw + 5, baseY - bh + 5); ctx.closePath();
      ctx.fillStyle = cssVar('--accent'); ctx.fill(); ctx.stroke();
      ctx.fillStyle = lit > 0 ? cssVar('--spark') : cssVar('--window-off');
      ctx.globalAlpha = lit > 0 ? 0.45 + lit * 0.55 : 1;
      drawRoundRect(x + 14, baseY - bh + 17, 19, 20, 4); ctx.fill(); ctx.stroke();
      drawRoundRect(x + bw - 34, baseY - bh + 17, 19, 20, 4); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = 1;
      if (state.level === 6 && !state.magicDone && i > 1) {
        ctx.font = '18px serif';
        ctx.fillText('😾', x + bw / 2 - 9, baseY - bh - 35);
      }
    }
    ctx.font = '24px serif';
    ctx.fillText(state.solved?.status === 'short' ? '🐭⚡' : state.passed ? '🐭🏅' : '🐭🔦', b.x0 + 16, baseY - 18);
  }

  function drawWires() {
    const ui = state.view.ui;
    for (const w of state.wires) {
      const a = termPoint(w.a), b = termPoint(w.b);
      if (!a || !b) continue;
      const active = state.solved?.activeWires?.has(w.id);
      const short = state.solved?.shortWires?.has(w.id);
      const sel = isSelected('wire', w.id);
      const cp = wireCtrl(a, b);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = short ? cssVar('--danger') : active ? cssVar('--spark') : cssVar('--ink');
      ctx.lineWidth = ((short ? 9 : active ? 7 : 5) + (sel ? 2 : 0)) * ui;
      ctx.globalAlpha = w.fixed && !active && !short ? 0.72 : 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(cp.x, cp.y, b.x, b.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = sel ? cssVar('--accent') : cssVar('--line-strong');
      ctx.lineWidth = (sel ? 3 : 2) * ui;
      if (sel) ctx.setLineDash([7, 7]);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo(cp.x, cp.y, b.x, b.y); ctx.stroke();
      ctx.setLineDash([]);
      if (short) drawSmokeAlong(a, b);
      if (active) drawParticles(a, b, 5);
    }
  }

  function drawParticles(a, b, count) {
    for (let i = 0; i < count; i++) {
      const u = ((state.tick * 0.0018 + i / count) % 1);
      const q = wirePoint(a, b, u);
      ctx.fillStyle = cssVar('--spark');
      ctx.strokeStyle = cssVar('--line-strong');
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(q.x, q.y, 5.5 * state.view.ui, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
  }

  function drawSmokeAlong(a, b) {
    for (let i = 0; i < 3; i++) {
      const u = ((state.tick * 0.0007 + i * 0.31) % 1);
      const q = wirePoint(a, b, u);
      const y = q.y - 10 - Math.sin(state.tick * 0.006 + i) * 8;
      ctx.fillStyle = cssVar('--smoke');
      ctx.globalAlpha = 0.35;
      ctx.beginPath(); ctx.arc(q.x, y, 9 + i * 2, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function drawComponents() {
    const used = new Set();
    for (const w of state.wires) { used.add(w.a); used.add(w.b); }
    for (const c of state.comps) drawComponent(c);
    for (const c of state.comps) drawTerminals(c, used);
    if (state.wireStart) {
      const p = termPoint(state.wireStart);
      if (p && state.pointer) {
        ctx.setLineDash([8, 8]);
        ctx.strokeStyle = cssVar('--accent');
        ctx.lineWidth = 4 * state.view.ui;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(state.pointer.x, state.pointer.y); ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  function isSelected(kind, id) { return state.selected?.kind === kind && state.selected.id === id; }

  function drawComponent(c) {
    const spec = TYPES[c.type];
    const x = c.x - c.w / 2, y = c.y - c.h / 2;
    const lit = c.type === 'lamp' ? (state.solved?.lamps?.[c.id] || 0) : 0;
    ctx.save();
    if (isSelected('comp', c.id)) {
      ctx.translate(0, -3);
      ctx.shadowColor = cssVar('--accent');
      ctx.shadowBlur = 15;
    }
    ctx.fillStyle = c.type === 'battery' ? cssVar('--accent-2') : c.type === 'lamp' && lit > 0 ? cssVar('--spark') : cssVar('--card');
    ctx.strokeStyle = cssVar('--line-strong');
    ctx.lineWidth = 3;
    drawRoundRect(x, y, c.w, c.h, 16);
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    if (c.type === 'lamp') drawLamp(c, lit);
    else if (c.type === 'battery') drawBattery(c);
    else if (c.type === 'switch') drawSwitch(c);
    else if (c.type === 'spdt') drawSpdt(c);
    else drawItem(c, spec);
    if (c.label) {
      ctx.fillStyle = cssVar('--ink');
      fillTextCenter(c.label, c.x, y - 12, 13, 900);
    }
    ctx.restore();
  }

  function drawBattery(c) {
    ctx.fillStyle = cssVar('--ink-on-accent');
    fillTextCenter('−', c.x - 24, c.y, 22, 900);
    fillTextCenter('+', c.x + 24, c.y, 22, 900);
    ctx.fillStyle = cssVar('--card');
    drawRoundRect(c.x - 9, c.y - 20, 18, 40, 5); ctx.fill(); ctx.stroke();
    fillTextCenter('🔋', c.x, c.y - 2, 25, 900);
  }

  function drawLamp(c, lit) {
    const pulse = lit > 0 ? 1 + Math.sin(state.tick * 0.008) * 0.08 : 1;
    ctx.save();
    ctx.translate(c.x, c.y - 2);
    ctx.scale(pulse, pulse);
    if (lit > 0) {
      ctx.globalAlpha = 0.25 + lit * 0.3;
      ctx.fillStyle = cssVar('--spark');
      ctx.beginPath(); ctx.arc(0, 0, 35 + lit * 18, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    fillTextCenter(c.broken ? '💔' : '💡', 0, 0, 31, 900);
    ctx.restore();
    if (lit > 0 && lit < 0.75) {
      ctx.fillStyle = cssVar('--ink-soft');
      fillTextCenter(t('dimTag'), c.x, c.y + c.h / 2 - 8, 11 * state.view.ui, 900);
    }
  }

  function drawSwitch(c) {
    ctx.strokeStyle = cssVar('--line-strong');
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(c.x - 26, c.y + 12);
    ctx.lineTo(c.x + (c.closed ? 24 : 10), c.y + (c.closed ? 12 : -14));
    ctx.stroke();
    ctx.fillStyle = c.closed ? cssVar('--ok') : cssVar('--danger');
    ctx.beginPath(); ctx.arc(c.x - 26, c.y + 12, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(c.x + 26, c.y + 12, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    fillTextCenter(c.closed ? t('onTag') : t('offTag'), c.x, c.y - 15, 12 * state.view.ui, 900);
  }

  function drawSpdt(c) {
    ctx.strokeStyle = cssVar('--line-strong');
    ctx.lineWidth = 4;
    const p0 = termPos(c, 0), p1 = termPos(c, 1), p2 = termPos(c, 2);
    const target = c.throwTo === 1 ? p1 : p2;
    ctx.beginPath(); ctx.moveTo(p0.x + 12, p0.y); ctx.lineTo(target.x - 12, target.y); ctx.stroke();
    ctx.fillStyle = cssVar('--accent-2');
    fillTextCenter('↔️', c.x, c.y, 25, 900);
  }

  function drawItem(c, spec) {
    fillTextCenter(spec.icon, c.x, c.y - 3, 28, 900);
    const cond = spec.conductivity;
    ctx.fillStyle = cond > 0.7 ? cssVar('--ok') : cond > 0 ? cssVar('--accent-2') : cssVar('--ink-faint');
    drawRoundRect(c.x - 25, c.y + c.h / 2 - 14, 50, 10, 5);
    ctx.fill(); ctx.stroke();
  }

  function drawTerminals(c, used) {
    const ui = state.view.ui;
    for (let i = 0; i < termCount(c); i++) {
      const id = termId(c, i);
      const p = termPos(c, i);
      const selected = state.wireStart === id || isSelected('term', id);
      const plugged = used?.has(id);
      /* 空端子=空心（可接线），已接端子=实心；拉线时空端子轻轻呼吸引导孩子 */
      const wiring = !!state.wireStart && !selected && !plugged;
      ctx.fillStyle = selected ? cssVar('--accent') : plugged ? cssVar('--line-strong') : cssVar('--card');
      ctx.strokeStyle = selected ? cssVar('--line-strong') : plugged ? cssVar('--line-strong') : cssVar('--accent-2');
      ctx.lineWidth = (selected ? 4 : 3) * ui;
      const r = (selected ? 12 : wiring ? 10.5 + Math.sin(state.tick * 0.008 + p.x) * 1.5 : 9) * ui;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (selected) {
        ctx.fillStyle = cssVar('--spark');
        fillTextCenter('✦', p.x, p.y - 24 * ui, 16 * ui, 900);
      }
    }
  }

  function drawGapHint() {
    const sol = state.solved;
    const gaps = sol?.gaps?.length ? sol.gaps : sol?.gap ? [sol.gap] : [];
    if (!gaps.length) return;
    const ui = state.view.ui;
    ctx.save();
    ctx.setLineDash([7, 7]);
    ctx.strokeStyle = cssVar('--danger');
    ctx.lineWidth = 4 * ui;
    const r = (26 + Math.sin(state.tick * 0.006) * 4) * ui;
    const pts = [];
    for (const id of gaps.slice(0, 6)) {
      const p = termPoint(id);
      if (!p) continue;
      pts.push(p);
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.setLineDash([]);
    if (pts.length) {
      const p = pts[0];
      ctx.fillStyle = cssVar('--danger');
      const labelX = clamp(p.x + 58, 70, BOARD.w - 70);
      fillTextCenter(t(pts.length > 1 ? 'gapMany' : 'gapHere'), labelX, p.y - 28 - 6 * ui, 13 * ui, 900);
    }
    ctx.restore();
  }

  function drawFireworks(b) {
    state.fireworks = state.fireworks.filter((f) => f.life > 0);
    const bw = b.x1 - b.x0, bh = b.y1 - b.y0;
    for (const f of state.fireworks) {
      f.r += 1.8;
      f.life -= 0.012;
      const x = b.x0 + f.x * bw, y = b.y0 + f.y * bh;
      ctx.globalAlpha = Math.max(0, f.life);
      ctx.strokeStyle = f.hue < 0.33 ? cssVar('--accent') : f.hue < 0.66 ? cssVar('--accent-2') : cssVar('--ok');
      ctx.lineWidth = 3;
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI * 2 * i) / 10;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * f.r * 0.4, y + Math.sin(a) * f.r * 0.4);
        ctx.lineTo(x + Math.cos(a) * f.r, y + Math.sin(a) * f.r);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }

  function burstSmoke() {
    const sol = state.solved;
    if (!sol) return;
    for (const id of sol.shortWires || []) {
      const w = state.wires.find((wire) => wire.id === id);
      if (!w) continue;
      const a = termPoint(w.a), b = termPoint(w.b);
      if (a && b) {
        const m = wirePoint(a, b, 0.5);
        state.smoke.push({ x: m.x, y: m.y, life: 1 });
      }
    }
  }

  function drawLooseSmoke() {
    state.smoke = state.smoke.filter((s) => s.life > 0);
    for (const s of state.smoke) {
      s.life -= 0.02;
      s.y -= 0.6;
      ctx.globalAlpha = Math.max(0, s.life * 0.45);
      ctx.fillStyle = cssVar('--smoke');
      ctx.beginPath(); ctx.arc(s.x, s.y, 28 * (1 - s.life) + 8, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  /** 每帧/每次状态变化的统一渲染入口（语言、主题切换都会调用） */
  function render() {
    if (!ctx || !canvas) return;
    const { scale, ox, oy, dpr, cssW, cssH } = state.view;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    /* 逻辑坐标系：等比缩放 + 居中 */
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
    const b = {
      x0: -ox / scale, y0: -oy / scale,
      x1: (cssW - ox) / scale, y1: (cssH - oy) / scale,
    };
    drawStageBg(b);
    drawWires();
    drawComponents();
    drawGapHint();
    drawLooseSmoke();
    drawFireworks(b);
  }

  function animate(ts) {
    state.tick = ts;
    if (!state.lastTime || ts - state.lastTime > 33) {
      state.lastTime = ts;
      render();
    }
    requestAnimationFrame(animate);
  }

  addEventListener('resize', resize);
  addEventListener('themechange', () => { refreshPalette(); render(); });
  /* 布局尺寸变化（含首帧、字体加载、容器折行）随时重算视口 */
  if (typeof ResizeObserver !== 'undefined') {
    try { new ResizeObserver(() => resize()).observe(canvas); } catch { /* 老浏览器降级到 window resize */ }
  }

  /* ============================ 启动 ============================ */
  applyTheme();
  applyLang();
  loadLevel(0);
  resize();
  requestAnimationFrame(animate);
})();
