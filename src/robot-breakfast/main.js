/* ============================================================
   🍳 机器人早餐 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '🍳 机器人早餐 · KidsLab',
      back: '返回平台',
      title: '机器人早餐',
      tip0: '点卡片，再点空槽；也可以拖进去。机器人会一张张照做！',
      wish: '今日订单', level: '关卡', pool: '指令卡池', program: '程序轨道',
      demo: '看前两步', clear: '重排', run: '▶️ 运行', next: '下一关 →', replay: '再玩自由厨房',
      empty: '空槽', steps: (n, m) => `${n}/${m} 步`, limit: (n) => `最多 ${n} 步`,
      selected: (x) => `已拿起 ${x}，点一个空槽放进去。`, placed: '咔哒！程序卡进轨道啦。', removed: '拿掉这一张，机器人忘记它了。',
      demoTip: '演示只偷偷做前两步，后面交给你！', running: '机器人开始逐字执行：',
      winTitle: '早餐完整上桌！', winText: (s) => `小主人比心：${s} 星早餐！机器人获得一枚锅铲勋章。`,
      freeWin: '自由厨房营业成功！拿给爸妈看你的程序吧。',
      tryAgain: '重排再试', successStars: (s) => '⭐'.repeat(s) + '☆'.repeat(3 - s),
      disasterBurn: '机器人忠实执行：抹了黄油再进烤箱——噗！黄油火山面包出炉。',
      disasterJam: '没有打开瓶盖就挤果酱！机器人脸都憋红了，瓶子说“不”。',
      disasterMilk: '还没准备杯/碗就倒牛奶，厨房地板喝饱了。',
      disasterCereal: '麦片找不到碗，像小石子一样噼里啪啦下雨。',
      disasterServe: '早餐没端上桌，小主人对着空盘子敲勺子：叮叮叮！',
      disasterOrder: '步骤顺序怪怪的，机器人照做后得到一份“问号早餐”。',
      disasterMissing: '少了一张关键指令，机器人站在厨房里认真发呆。',
      act_bread: '拿面包', act_toast: '放进烤箱', act_butter: '涂黄油', act_unlockJam: '打开瓶盖', act_jam: '涂果酱', act_cup: '拿杯子', act_milk: '倒牛奶', act_bowl: '拿碗', act_cereal: '倒麦片', act_serve: '端上桌', act_plate: '摆盘子',
      l1: '烤面包三步曲', l1g: '🍞🔥🍽️', l2: '果酱要先开盖', l2g: '🍞🔥🔓🍓🍽️',
      l3: '牛奶不许倒地上', l3g: '🥛 要进杯子', l4: '麦片游泳池', l4g: '🥣🥣 先碗后奶',
      l5: '双份早餐订单', l5g: '吐司 + 牛奶', l6: '少一格挑战', l6g: '不用摆盘也能上桌',
      l7: '豪华果酱吐司', l7g: '黄油和果酱都要对', l8: '自由厨房秀', l8g: '做一份能吃的早餐',
    },
    en: {
      doc: '🍳 Robot Breakfast · KidsLab',
      back: 'Back to platform',
      title: 'Robot Breakfast',
      tip0: 'Tap a card, then an empty slot. Dragging works too. The robot obeys every card!',
      wish: 'Today’s order', level: 'Level', pool: 'Card pantry', program: 'Program track',
      demo: 'Show 2 steps', clear: 'Reset', run: '▶️ Run', next: 'Next level →', replay: 'Play free kitchen again',
      empty: 'empty', steps: (n, m) => `${n}/${m} steps`, limit: (n) => `max ${n} steps`,
      selected: (x) => `${x} picked. Tap an empty slot to place it.`, placed: 'Click! The card joined the program.', removed: 'Card removed. Robot forgot that step.',
      demoTip: 'Demo only whispers the first two steps. You do the rest!', running: 'Robot executes literally:',
      winTitle: 'Breakfast survived!', winText: (s) => `The kid sends a heart: ${s}-star breakfast! Robot earns a spatula badge.`,
      freeWin: 'Free kitchen is open! Show your program to a grown-up.',
      tryAgain: 'Try again', successStars: (s) => '⭐'.repeat(s) + '☆'.repeat(3 - s),
      disasterBurn: 'Robot obeyed: butter first, toaster second — poof! Butter volcano toast.',
      disasterJam: 'Jam without opening the cap! Robot squeezes red-faced; bottle says nope.',
      disasterMilk: 'No cup or bowl before milk. The kitchen floor got breakfast.',
      disasterCereal: 'Cereal cannot find a bowl, so it rains pebbles everywhere.',
      disasterServe: 'Breakfast never reached the table. The kid drums an empty plate: ting ting!',
      disasterOrder: 'That order is strange. Robot produced a very serious question-mark breakfast.',
      disasterMissing: 'A key command is missing. Robot stands in the kitchen and thinks loudly.',
      act_bread: 'Get bread', act_toast: 'Toast it', act_butter: 'Butter', act_unlockJam: 'Open jar', act_jam: 'Spread jam', act_cup: 'Get cup', act_milk: 'Pour milk', act_bowl: 'Get bowl', act_cereal: 'Pour cereal', act_serve: 'Serve', act_plate: 'Set plate',
      l1: 'Toast in 3', l1g: '🍞🔥🍽️', l2: 'Jam needs a lid trick', l2g: '🍞🔥🔓🍓🍽️',
      l3: 'Milk belongs in a cup', l3g: '🥛 needs cup first', l4: 'Cereal swimming pool', l4g: 'Bowl before milk',
      l5: 'Two-part order', l5g: 'Toast + milk', l6: 'One slot short', l6g: 'Skip plate, still serve',
      l7: 'Deluxe jam toast', l7g: 'Butter and jam, in order', l8: 'Free kitchen show', l8g: 'Make any edible breakfast',
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
  /** 读取 CSS 主题变量（Canvas/three.js 取色必须走这里，勿硬编码） */
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

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
    render(); // 语言切换后重绘动态文案
  }

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
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

  /* ======================= ✏️ 游戏区 · Game ======================= */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const CARDS = {
    bread: { emoji: '🍞', key: 'act_bread' }, toast: { emoji: '🔥', key: 'act_toast' }, butter: { emoji: '🧈', key: 'act_butter' },
    unlockJam: { emoji: '🔓', key: 'act_unlockJam' }, jam: { emoji: '🍓', key: 'act_jam' }, cup: { emoji: '🥛', key: 'act_cup' },
    milk: { emoji: '💧', key: 'act_milk' }, bowl: { emoji: '🥣', key: 'act_bowl' }, cereal: { emoji: '🌾', key: 'act_cereal' },
    serve: { emoji: '🍽️', key: 'act_serve' }, plate: { emoji: '▫️', key: 'act_plate' },
  };

  const LEVELS = [
    { key: 'l1', goal: 'l1g', wish: '🍞🔥🍽️', slots: 3, best: 3, cards: ['bread', 'toast', 'serve'], solution: ['bread', 'toast', 'serve'] },
    { key: 'l2', goal: 'l2g', wish: '🍞🍓🍽️', slots: 5, best: 5, cards: ['bread', 'toast', 'jam', 'unlockJam', 'serve'], solution: ['bread', 'toast', 'unlockJam', 'jam', 'serve'] },
    { key: 'l3', goal: 'l3g', wish: '🥛🙂', slots: 3, best: 3, cards: ['milk', 'cup', 'serve'], solution: ['cup', 'milk', 'serve'] },
    { key: 'l4', goal: 'l4g', wish: '🥣🥛🌾', slots: 4, best: 4, cards: ['bowl', 'milk', 'cereal', 'serve'], solution: ['bowl', 'milk', 'cereal', 'serve'] },
    { key: 'l5', goal: 'l5g', wish: '🍞🥛🍽️', slots: 6, best: 6, cards: ['bread', 'toast', 'cup', 'milk', 'serve', 'plate'], solution: ['bread', 'toast', 'cup', 'milk', 'serve'] },
    { key: 'l6', goal: 'l6g', wish: '🍞🍓⚡', slots: 5, best: 5, cards: ['plate', 'bread', 'toast', 'unlockJam', 'jam', 'serve'], solution: ['bread', 'toast', 'unlockJam', 'jam', 'serve'] },
    { key: 'l7', goal: 'l7g', wish: '🍞🧈🍓', slots: 6, best: 6, cards: ['bread', 'butter', 'toast', 'unlockJam', 'jam', 'serve'], solution: ['bread', 'toast', 'butter', 'unlockJam', 'jam', 'serve'] },
    { key: 'l8', goal: 'l8g', wish: '👪✨', slots: 7, best: 5, free: true, cards: ['bread', 'toast', 'butter', 'unlockJam', 'jam', 'cup', 'milk', 'bowl', 'cereal', 'serve'], solution: ['bread', 'toast', 'serve'] },
  ];

  const state = { level: 0, program: [], selected: null, running: false, current: -1, demoing: false, stars: {}, drag: null };
  const saveKey = 'kidslab.robotbreakfast';
  try { state.stars = JSON.parse(localStorage.getItem(saveKey)) || {}; } catch { state.stars = {}; }

  const els = {
    pool: $('#cardPool'), slots: $('#slots'), levelName: $('#levelName'), levelGoal: $('#levelGoal'), wish: $('#wishIcons'),
    tip: $('#tip'), limit: $('#limitBadge'), stars: $('#stars'), runline: $('#runline'), kid: $('#kid'), robot: $('#robot'), oven: $('#oven'),
    smoke: $('#smoke'), toast: $('#toastLayer'), spread: $('#spreadLayer'), drink: $('#drinkLayer'), table: $('#table'), splatter: $('#splatter'),
    win: $('#win'), winEmoji: $('#winEmoji'), winTitle: $('#winTitle'), winText: $('#winText'), again: $('#againBtn'),
  };

  function cardLabel(id) { return t(CARDS[id].key); }
  function filledProgram() { return state.program.filter(Boolean); }
  function persistStars() { try { localStorage.setItem(saveKey, JSON.stringify(state.stars)); } catch { /* ignore */ } }
  function setTip(msg) { els.tip.textContent = msg; }

  let actx = null;
  function beep(freq = 520, dur = 0.08, delay = 0) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const o = actx.createOscillator();
      const g = actx.createGain();
      const now = actx.currentTime + delay;
      o.type = 'triangle'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.12, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      o.connect(g).connect(actx.destination); o.start(now); o.stop(now + dur + 0.03);
    } catch { /* silence */ }
  }
  const sfx = { tick: () => beep(620), bad: () => beep(150, 0.22), good: () => [660, 820, 990].forEach((f, i) => beep(f, 0.12, i * 0.07)) };

  function renderCard(id, cls = 'action-card') {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = cls; btn.dataset.id = id;
    btn.innerHTML = `<span class="emoji">${CARDS[id].emoji}</span><span class="label">${cardLabel(id)}</span>`;
    return btn;
  }

  function render() {
    const level = LEVELS[state.level];
    state.program.length = Math.min(state.program.length, level.slots);
    while (state.program.length < level.slots) state.program.push(null);
    els.levelName.textContent = t(level.key);
    els.levelGoal.textContent = t(level.goal);
    els.wish.textContent = level.wish;
    els.limit.textContent = t('limit')(level.slots);
    els.stars.textContent = t('successStars')(state.stars[level.key] || 0);
    els.pool.innerHTML = '';
    level.cards.forEach((id) => {
      const card = renderCard(id);
      if (state.selected === id) card.classList.add('selected');
      if (filledProgram()[state.current] === id && state.running) card.classList.add('current');
      els.pool.append(card);
    });
    els.slots.innerHTML = '';
    state.program.forEach((id, i) => {
      const slot = document.createElement('button');
      slot.type = 'button'; slot.className = `slot ${id ? '' : 'empty'}`; slot.dataset.index = i; slot.dataset.num = String(i + 1);
      if (i === state.current && state.running) slot.classList.add('current');
      slot.innerHTML = id ? `<span class="emoji">${CARDS[id].emoji}</span><span class="label">${cardLabel(id)}</span>` : `<span class="emoji">＋</span><span class="label">${t('empty')}</span>`;
      els.slots.append(slot);
    });
    if (!state.running && !state.demoing && !els.tip.textContent) setTip(t('tip0'));
    document.getElementById('prevBtn').disabled = state.running || state.level === 0;
    document.getElementById('nextBtn').disabled = state.running || state.level === LEVELS.length - 1;
    document.getElementById('runBtn').disabled = state.running;
    document.getElementById('demoBtn').disabled = state.running;
    document.getElementById('clearBtn').disabled = state.running;
    document.getElementById('againBtn').textContent = state.level === LEVELS.length - 1 ? t('replay') : t('next');
  }

  function resetStage() {
    els.kid.textContent = '🧒';
    els.robot.className = 'robot';
    els.oven.className = 'oven';
    els.smoke.className = '';
    els.toast.textContent = '⬜'; els.toast.className = 'toast-item';
    els.spread.className = 'spread-layer';
    els.drink.className = 'drink-item';
    els.table.className = 'table';
    els.splatter.className = 'splatter'; els.splatter.textContent = '';
    els.runline.textContent = '▶︎';
  }

  function selectCard(id) {
    if (state.running) return;
    state.selected = state.selected === id ? null : id;
    setTip(state.selected ? t('selected')(cardLabel(id)) : t('tip0'));
    sfx.tick(); render();
  }
  function placeInSlot(i, id = state.selected) {
    if (state.running || !id) return;
    state.program[i] = id;
    state.selected = null;
    setTip(t('placed'));
    sfx.tick(); render();
  }
  function slotClick(i) {
    if (state.running) return;
    if (state.selected) placeInSlot(i);
    else if (state.program[i]) { state.program[i] = null; setTip(t('removed')); sfx.tick(); render(); }
  }

  function firstBadExact(program, sol) {
    for (let i = 0; i < sol.length; i++) if (program[i] !== sol[i]) return i;
    return program.length < sol.length ? program.length : -1;
  }

  function judge(program) {
    const level = LEVELS[state.level];
    const st = { bread: false, toasted: false, butter: false, jamOpen: false, jam: false, cup: false, milk: false, bowl: false, cereal: false, served: false };
    for (let i = 0; i < program.length; i++) {
      const a = program[i];
      if (a === 'toast' && st.butter && !st.toasted) return { ok: false, index: i, key: 'disasterBurn' };
      if (a === 'jam' && !st.jamOpen) return { ok: false, index: i, key: 'disasterJam' };
      if (a === 'milk' && !st.cup && !st.bowl) return { ok: false, index: i, key: 'disasterMilk' };
      if (a === 'cereal' && !st.bowl) return { ok: false, index: i, key: 'disasterCereal' };
      if (a === 'bread') st.bread = true;
      if (a === 'toast') { if (!st.bread) return { ok: false, index: i, key: 'disasterMissing' }; st.toasted = true; }
      if (a === 'butter') { if (!st.toasted) st.butter = true; else st.butter = true; }
      if (a === 'unlockJam') st.jamOpen = true;
      if (a === 'jam') { if (!st.toasted) return { ok: false, index: i, key: 'disasterOrder' }; st.jam = true; }
      if (a === 'cup') st.cup = true;
      if (a === 'milk') st.milk = true;
      if (a === 'bowl') st.bowl = true;
      if (a === 'cereal') st.cereal = true;
      if (a === 'serve') st.served = true;
    }
    if (!st.served) return { ok: false, index: Math.max(0, program.length - 1), key: 'disasterServe' };
    if (level.free) {
      const edibleToast = st.bread && st.toasted;
      const edibleMilk = st.cup && st.milk;
      const edibleCereal = st.bowl && st.milk && st.cereal;
      return (edibleToast || edibleMilk || edibleCereal) ? { ok: true } : { ok: false, index: 0, key: 'disasterMissing' };
    }
    const bad = firstBadExact(program, level.solution);
    return bad < 0 && program.length === level.solution.length ? { ok: true } : { ok: false, index: Math.max(0, bad), key: 'disasterOrder' };
  }

  async function perform(action) {
    els.robot.classList.add('work');
    els.runline.textContent += ` ${CARDS[action].emoji}`;
    if (action === 'bread') { els.toast.textContent = '🍞'; els.toast.classList.add('pop'); }
    if (action === 'toast') { els.oven.classList.add('hot'); els.toast.textContent = '🍞'; await wait(250); els.toast.textContent = '🍞'; els.toast.style.filter = 'saturate(1.4) contrast(1.15)'; }
    if (action === 'butter') { els.spread.className = els.spread.classList.contains('jam') ? 'spread-layer both' : 'spread-layer butter'; }
    if (action === 'unlockJam') { els.splatter.textContent = '🔓'; els.splatter.className = 'splatter show'; await wait(230); els.splatter.className = 'splatter'; }
    if (action === 'jam') { els.spread.className = els.spread.classList.contains('butter') ? 'spread-layer both' : 'spread-layer jam'; }
    if (action === 'cup' || action === 'bowl') { els.drink.textContent = action === 'cup' ? '🥛' : '🥣'; els.drink.classList.add('ready'); }
    if (action === 'milk') { els.drink.textContent = '🥛'; els.drink.classList.add('ready'); }
    if (action === 'cereal') { els.splatter.textContent = '🌾'; els.splatter.className = 'splatter show'; await wait(250); els.splatter.className = 'splatter'; }
    if (action === 'serve') { els.table.classList.add('served'); els.kid.textContent = '😋'; }
    sfx.tick();
    await wait(460);
    els.robot.classList.remove('work');
    els.toast.classList.remove('pop');
  }

  async function runProgram() {
    if (state.running) return;
    const program = filledProgram();
    if (!program.length) { setTip(t('disasterMissing')); sfx.bad(); return; }
    state.running = true; state.current = -1; resetStage(); setTip(t('running')); render();
    const result = judge(program);
    const stopAt = result.ok ? program.length - 1 : Math.min(result.index, program.length - 1);
    for (let i = 0; i < program.length; i++) {
      state.current = i; render();
      await perform(program[i]);
      if (!result.ok && i >= stopAt) break;
    }
    state.current = -1; state.running = false;
    if (result.ok) win(program.length); else disaster(result.key);
    render();
  }

  function disaster(key) {
    els.robot.classList.add('panic'); els.kid.textContent = '😵';
    if (key === 'disasterBurn') { els.toast.textContent = '◼️'; els.smoke.className = 'on'; els.oven.classList.add('hot'); }
    if (key === 'disasterJam') { els.splatter.textContent = '🍓😳'; els.splatter.className = 'splatter show'; }
    if (key === 'disasterMilk') { els.splatter.textContent = '💧🥛'; els.splatter.className = 'splatter show'; }
    if (key === 'disasterCereal') { els.splatter.textContent = '🌾🌧️'; els.splatter.className = 'splatter show'; }
    setTip(t(key));
    els.runline.textContent = `💥 ${t(key)}`;
    sfx.bad();
  }

  function win(stepCount) {
    const level = LEVELS[state.level];
    const stars = Math.max(1, Math.min(3, 3 - Math.max(0, stepCount - level.best)));
    state.stars[level.key] = Math.max(state.stars[level.key] || 0, stars); persistStars();
    els.kid.textContent = '😍'; sfx.good(); confetti(level.free ? 42 : 26);
    els.winTitle.textContent = t('winTitle');
    els.winEmoji.textContent = stars === 3 ? '💖' : '👏';
    els.winText.textContent = level.free ? t('freeWin') : t('winText')(stars);
    els.win.hidden = false;
  }

  function confetti(n) {
    for (let i = 0; i < n; i++) {
      const c = document.createElement('i'); c.className = 'confetti';
      c.style.left = `${Math.random() * 100}%`; c.style.background = [cssVar('--accent'), cssVar('--accent-2'), cssVar('--good')][i % 3];
      c.style.animationDuration = `${1.6 + Math.random() * 1.4}s`; c.style.animationDelay = `${Math.random() * 0.35}s`;
      document.body.append(c); setTimeout(() => c.remove(), 3300);
    }
  }

  async function demo() {
    if (state.running) return;
    const level = LEVELS[state.level];
    state.demoing = true; state.program = Array(level.slots).fill(null); resetStage();
    setTip(t('demoTip'));
    for (let i = 0; i < Math.min(2, level.solution.length); i++) {
      state.program[i] = level.solution[i]; state.current = i; render(); await perform(level.solution[i]);
    }
    state.current = -1; state.demoing = false; render();
  }

  function changeLevel(delta) {
    if (state.running) return;
    state.level = Math.max(0, Math.min(LEVELS.length - 1, state.level + delta));
    state.program = Array(LEVELS[state.level].slots).fill(null); state.selected = null; state.current = -1;
    els.win.hidden = true; resetStage(); setTip(t('tip0')); render();
  }

  els.pool.addEventListener('click', (e) => { const card = e.target.closest('.action-card'); if (card) selectCard(card.dataset.id); });
  els.slots.addEventListener('click', (e) => { const slot = e.target.closest('.slot'); if (slot) slotClick(Number(slot.dataset.index)); });
  $('#runBtn').addEventListener('click', runProgram);
  $('#clearBtn').addEventListener('click', () => { if (!state.running) { state.program = Array(LEVELS[state.level].slots).fill(null); state.selected = null; resetStage(); setTip(t('tip0')); render(); } });
  $('#demoBtn').addEventListener('click', demo);
  $('#prevBtn').addEventListener('click', () => changeLevel(-1));
  $('#nextBtn').addEventListener('click', () => changeLevel(1));
  els.again.addEventListener('click', () => changeLevel(state.level === LEVELS.length - 1 ? 0 : 1));

  els.pool.addEventListener('pointerdown', (e) => {
    const card = e.target.closest('.action-card');
    if (!card || state.running) return;
    card.setPointerCapture(e.pointerId);
    const ghost = renderCard(card.dataset.id, 'action-card drag-ghost'); document.body.append(ghost);
    state.drag = { id: card.dataset.id, ghost };
    moveGhost(e);
  });
  function moveGhost(e) { if (state.drag) { state.drag.ghost.style.left = `${e.clientX}px`; state.drag.ghost.style.top = `${e.clientY}px`; } }
  addEventListener('pointermove', moveGhost);
  addEventListener('pointerup', (e) => {
    if (!state.drag) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const slot = el?.closest?.('.slot');
    if (slot) placeInSlot(Number(slot.dataset.index), state.drag.id);
    state.drag.ghost.remove(); state.drag = null;
  });

  addEventListener('themechange', resetStage);
  addEventListener('resize', () => render());
  state.program = Array(LEVELS[0].slots).fill(null);

  /* ============================ 启动 ============================ */
  applyTheme();
  applyLang();
})();
