/* ============================================================
   🦁 如果动物园 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '🦁 如果动物园 · KidsLab',
      back: '返回平台', title: '如果动物园', tip0: '先读动物徽章，再让规则从上往下排队检查。',
      level: '关卡', fed: '已喂饱', fast: '快速营业', rules: '规则机', addRule: '加规则', queue: '巡游队伍', openZoo: '▶️ 营业', reset: '重来', next: '下一关 →', replay: '再巡游一次',
      if: '如果', then: '→ 投', else: '否则 → 投', and: '且', or: '或', ruleLimit: (n) => `最多 ${n} 条规则`,
      cond_herbivore: '🌿 食草的', cond_carnivore: '🥩 食肉的', cond_striped: '🦓 有条纹', cond_flies: '🪶 会飞', cond_nocturnal: '🌙 夜行', cond_huge: '🐘 很大', cond_panda: '🐼 是熊猫', cond_hungry: '😋 饿了', cond_swims: '💦 会游泳', cond_bird: '🐦 是鸟',
      food_grass: '🌿 草', food_meat: '🥩 肉', food_bamboo: '🎋 竹子', food_fish: '🐟 鱼', food_nuts: '🥜 坚果', food_fruit: '🍌 水果',
      checking: (r) => `第 ${r} 条规则正在打量：`, matched: (r, f) => `命中第 ${r} 条，投出 ${f}！`, elseHit: (f) => `都没命中，走“否则”，投出 ${f}。`,
      good: (name) => `${name} 开心吃完，点头盖章 ✅`, bad: (name, got, want, facts) => `${name} 把 ${got} 吐成小喷泉：我其实 ${facts}，想吃 ${want}！`,
      pauseFix: '营业暂停：改改规则，再从这只动物继续。', winTitle: '全员吃饱！', winText: (n) => `${n} 只动物一只不错。规则机像小海关一样自动分流！`, pandaTip: '熊猫是边界情况：特例要放在大规则前面。', andTip: '解锁“且/或”！“且”要两个条件都满足才命中。', orTip: '卡槽不够用？“或”能让一条规则同时接住两种动物。',
      l1: '草和肉', l1g: '食草的给草，其他的给肉——先看看“否则”投的对不对。', l2: '条纹朋友', l2g: '有条纹就吃草吗？想想真正决定午餐的是什么。', l3: '熊猫插队', l3g: '熊猫也是食草的，可它只吃竹子——特例要排到前面去。', l4: '水边午餐', l4g: '会游泳的新朋友来了，给它们加一条吃鱼的规则。', l5: '果蝠专场', l5g: '会飞的不都吃水果！用“且”精准认出果蝠。', l6: '水果车来了', l6g: '果蝠会飞，猴子喊饿——用“或”让一条规则接住两位。', l7: '三个卡槽', l7g: '只有 3 个卡槽：想清楚谁必须插队，用好“否则”。', l8: '30 只大巡游', l8g: '15 种动物混排巡游，5 个卡槽加一个“否则”，一只不错就放彩带。',
      up: '上移', down: '下移', del: '删除', duplicate: '复制',
    },
    en: {
      doc: '🦁 The If-Zoo · KidsLab',
      back: 'Back to platform', title: 'The If-Zoo', tip0: 'Read the badges, then let rules check from top to bottom.',
      level: 'Level', fed: 'Fed', fast: 'Fast run', rules: 'Rule machine', addRule: 'Add rule', queue: 'Parade queue', openZoo: '▶️ Open', reset: 'Reset', next: 'Next level →', replay: 'Parade again',
      if: 'IF', then: '→ feed', else: 'ELSE → feed', and: 'AND', or: 'OR', ruleLimit: (n) => `max ${n} rules`,
      cond_herbivore: '🌿 herbivore', cond_carnivore: '🥩 carnivore', cond_striped: '🦓 striped', cond_flies: '🪶 flies', cond_nocturnal: '🌙 nocturnal', cond_huge: '🐘 huge', cond_panda: '🐼 panda', cond_hungry: '😋 hungry', cond_swims: '💦 swims', cond_bird: '🐦 bird',
      food_grass: '🌿 grass', food_meat: '🥩 meat', food_bamboo: '🎋 bamboo', food_fish: '🐟 fish', food_nuts: '🥜 nuts', food_fruit: '🍌 fruit',
      checking: (r) => `Rule ${r} is inspecting:`, matched: (r, f) => `Rule ${r} matched: drop ${f}!`, elseHit: (f) => `No rule matched. ELSE drops ${f}.`,
      good: (name) => `${name} munches happily and stamps ✅`, bad: (name, got, want, facts) => `${name} spits ${got} like a fountain: I am ${facts}, I wanted ${want}!`,
      pauseFix: 'Shop paused: tweak the rules, then continue from this animal.', winTitle: 'Everyone is fed!', winText: (n) => `${n} animals, zero mix-ups. Your rule machine sorts like a tiny customs gate!`, pandaTip: 'Panda is an edge case: put the special rule before the general rule.', andTip: 'AND/OR unlocked! AND matches only when both conditions are true.', orTip: 'Out of slots? OR lets one rule catch two kinds of animals.',
      l1: 'Grass and meat', l1g: 'Herbivores get grass, the rest get meat — check what ELSE drops first.', l2: 'Striped friends', l2g: 'Do stripes mean grass? Think about what really decides lunch.', l3: 'Panda cuts in', l3g: 'A panda is a herbivore too, but it only eats bamboo — specials go first.', l4: 'Waterside lunch', l4g: 'Swimming friends arrived — add a fish rule for them.', l5: 'Fruit bat night', l5g: 'Not every flyer eats fruit! Use AND to spot the fruit bat.', l6: 'Fruit cart day', l6g: 'The bat flies, the monkey is hungry — catch both with one OR rule.', l7: 'Three slots only', l7g: 'Just 3 slots: decide who must cut in line, and use ELSE well.', l8: '30-animal parade', l8g: '15 species, 5 slots plus ELSE. A perfect run wins confetti.',
      up: 'Up', down: 'Down', del: 'Delete', duplicate: 'Copy',
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
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const uid = () => Math.random().toString(36).slice(2, 9);

  const CONDITIONS = ['herbivore', 'carnivore', 'striped', 'flies', 'nocturnal', 'huge', 'panda', 'hungry', 'swims', 'bird'];
  const FOODS = ['grass', 'meat', 'bamboo', 'fish', 'nuts', 'fruit'];
  const FOOD_EMOJI = { grass: '🌿', meat: '🥩', bamboo: '🎋', fish: '🐟', nuts: '🥜', fruit: '🍌' };

  const ZOO = {
    cow: { emoji: '🐮', zh: '奶牛', en: 'Cow', food: 'grass', a: ['herbivore', 'huge'] },
    rabbit: { emoji: '🐰', zh: '兔子', en: 'Rabbit', food: 'grass', a: ['herbivore'] },
    lion: { emoji: '🦁', zh: '狮子', en: 'Lion', food: 'meat', a: ['carnivore', 'huge'] },
    tiger: { emoji: '🐯', zh: '老虎', en: 'Tiger', food: 'meat', a: ['carnivore', 'striped', 'huge'] },
    zebra: { emoji: '🦓', zh: '斑马', en: 'Zebra', food: 'grass', a: ['herbivore', 'striped'] },
    panda: { emoji: '🐼', zh: '熊猫', en: 'Panda', food: 'bamboo', a: ['panda', 'herbivore', 'huge'] },
    duck: { emoji: '🦆', zh: '鸭子', en: 'Duck', food: 'fish', a: ['bird', 'flies', 'swims'] },
    penguin: { emoji: '🐧', zh: '企鹅', en: 'Penguin', food: 'fish', a: ['bird', 'swims'] },
    bat: { emoji: '🦇', zh: '果蝠', en: 'Fruit bat', food: 'fruit', a: ['flies', 'nocturnal', 'herbivore'] },
    owl: { emoji: '🦉', zh: '猫头鹰', en: 'Owl', food: 'meat', a: ['bird', 'flies', 'nocturnal', 'carnivore'] },
    elephant: { emoji: '🐘', zh: '大象', en: 'Elephant', food: 'grass', a: ['herbivore', 'huge', 'hungry'] },
    hippo: { emoji: '🦛', zh: '河马', en: 'Hippo', food: 'grass', a: ['herbivore', 'huge', 'swims'] },
    fox: { emoji: '🦊', zh: '狐狸', en: 'Fox', food: 'meat', a: ['carnivore', 'nocturnal'] },
    monkey: { emoji: '🐵', zh: '猴子', en: 'Monkey', food: 'fruit', a: ['herbivore', 'hungry'] },
    parrot: { emoji: '🦜', zh: '鹦鹉', en: 'Parrot', food: 'nuts', a: ['bird', 'flies'] },
    whale: { emoji: '🐋', zh: '鲸鱼', en: 'Whale', food: 'fish', a: ['swims', 'huge'] },
  };

  /* 每关初始规则都藏着一个教学 bug：营业中途必然翻车，孩子修好它才算学会本关知识点 */
  const A = (id) => ZOO[id];
  const LEVELS = [
    { key: 'l1', goal: 'l1g', animals: ['cow', 'rabbit', 'lion', 'tiger'], maxRules: 2, conds: ['herbivore', 'carnivore'], foods: ['grass', 'meat'], start: [{ c1: 'herbivore', food: 'grass' }], elseFood: 'grass' },
    { key: 'l2', goal: 'l2g', animals: ['zebra', 'tiger', 'rabbit', 'lion', 'cow'], maxRules: 2, conds: ['herbivore', 'carnivore', 'striped'], foods: ['grass', 'meat'], start: [{ c1: 'striped', food: 'grass' }], elseFood: 'meat' },
    { key: 'l3', goal: 'l3g', animals: ['tiger', 'zebra', 'panda', 'lion', 'panda', 'cow'], maxRules: 3, conds: ['panda', 'herbivore', 'carnivore', 'striped'], foods: ['grass', 'meat', 'bamboo'], start: [{ c1: 'herbivore', food: 'grass' }, { c1: 'panda', food: 'bamboo' }], elseFood: 'meat', note: 'pandaTip' },
    { key: 'l4', goal: 'l4g', animals: ['rabbit', 'lion', 'duck', 'penguin', 'whale', 'tiger'], maxRules: 3, conds: ['swims', 'herbivore', 'carnivore', 'bird'], foods: ['grass', 'meat', 'fish'], start: [{ c1: 'herbivore', food: 'grass' }], elseFood: 'meat' },
    { key: 'l5', goal: 'l5g', animals: ['penguin', 'duck', 'owl', 'bat', 'rabbit', 'fox'], maxRules: 3, combo: true, conds: ['flies', 'herbivore', 'nocturnal', 'swims', 'bird'], foods: ['grass', 'meat', 'fish', 'fruit'], start: [{ c1: 'flies', food: 'fruit' }, { c1: 'swims', food: 'fish' }, { c1: 'herbivore', food: 'grass' }], elseFood: 'meat', note: 'andTip' },
    { key: 'l6', goal: 'l6g', animals: ['bat', 'monkey', 'cow', 'penguin', 'lion', 'zebra'], maxRules: 3, combo: true, conds: ['flies', 'hungry', 'herbivore', 'swims', 'carnivore', 'huge'], foods: ['grass', 'meat', 'fish', 'fruit'], start: [{ c1: 'flies', food: 'fruit' }, { c1: 'swims', food: 'fish' }, { c1: 'herbivore', food: 'grass' }], elseFood: 'meat', note: 'orTip' },
    { key: 'l7', goal: 'l7g', animals: ['zebra', 'duck', 'panda', 'tiger', 'penguin', 'lion', 'rabbit'], maxRules: 3, combo: true, conds: ['panda', 'swims', 'herbivore', 'carnivore', 'striped'], foods: ['grass', 'meat', 'bamboo', 'fish'], start: [{ c1: 'herbivore', food: 'grass' }, { c1: 'swims', food: 'fish' }], elseFood: 'meat' },
    { key: 'l8', goal: 'l8g', animals: ['cow', 'lion', 'panda', 'duck', 'zebra', 'bat', 'owl', 'rabbit', 'whale', 'tiger', 'parrot', 'penguin', 'elephant', 'fox', 'hippo', 'panda', 'bat', 'duck', 'cow', 'owl', 'tiger', 'penguin', 'rabbit', 'lion', 'zebra', 'fox', 'whale', 'elephant', 'hippo', 'parrot'], maxRules: 5, combo: true, conds: CONDITIONS, foods: FOODS, start: [{ c1: 'panda', food: 'bamboo' }, { c1: 'herbivore', food: 'grass' }, { c1: 'swims', food: 'fish' }], elseFood: 'meat' },
  ];

  const state = { level: 0, rules: [], elseFood: 'meat', current: 0, running: false, checkRule: -1, hitRule: -2, dragId: null };
  const els = { rules: $('#rules'), queue: $('#queue'), levelName: $('#levelName'), levelGoal: $('#levelGoal'), fed: $('#fedCount'), left: $('#queueLeft'), tip: $('#tip'), animal: $('#animalCard'), animalName: $('#animalName'), badges: $('#badges'), drop: $('#foodDrop'), scanner: $('#scanner'), keeper: $('#keeper'), walker: $('#walker'), gate: $('#gate'), win: $('#win'), winTitle: $('#winTitle'), winText: $('#winText'), again: $('#againBtn') };

  let actx = null;
  function tone(freq = 520, dur = 0.08, delay = 0) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const o = actx.createOscillator(); const g = actx.createGain(); const now = actx.currentTime + delay;
      o.type = 'square'; o.frequency.value = freq; g.gain.setValueAtTime(0.08, now); g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      o.connect(g).connect(actx.destination); o.start(now); o.stop(now + dur + 0.03);
    } catch { /* ignore */ }
  }
  const sfx = { scan: () => tone(520), ok: () => [620, 820, 1040].forEach((f, i) => tone(f, 0.1, i * 0.06)), bad: () => tone(140, 0.24), win: () => [523, 659, 784, 1047, 1318].forEach((f, i) => tone(f, 0.16, i * 0.08)) };

  function animalName(a) { return lang === 'zh' ? a.zh : a.en; }
  function foodLabel(f) { return t(`food_${f}`); }
  function condLabel(c) { return t(`cond_${c}`); }
  function setTip(x) { els.tip.textContent = x; }

  function initLevel() {
    const l = LEVELS[state.level];
    state.rules = l.start.map((r) => ({ id: uid(), c1: r.c1, op: r.op || '', c2: r.c2 || l.conds[0], food: r.food }));
    state.elseFood = l.elseFood;
    state.current = 0; state.running = false; state.checkRule = -1; state.hitRule = -2;
    els.win.hidden = true; setTip(l.note ? t(l.note) : t('tip0')); render(); showAnimal();
  }

  function optionList(values, current, prefix) {
    return values.map((v) => `<option value="${v}" ${v === current ? 'selected' : ''}>${prefix === 'cond' ? condLabel(v) : foodLabel(v)}</option>`).join('');
  }

  function renderRule(rule, i, level) {
    const combo = level.combo;
    const dis = state.running ? 'disabled' : '';
    const div = document.createElement('div');
    div.className = `rule-card ${state.checkRule === i ? 'checking' : ''} ${state.hitRule === i ? 'hit' : ''}`;
    div.dataset.id = rule.id; div.draggable = false;
    div.innerHTML = `<div class="rule-line"><span>${t('if')}</span>
      <select data-field="c1" ${dis}>${optionList(level.conds, rule.c1, 'cond')}</select>
      ${combo ? `<select data-field="op" ${dis}><option value=""></option><option value="and" ${rule.op === 'and' ? 'selected' : ''}>${t('and')}</option><option value="or" ${rule.op === 'or' ? 'selected' : ''}>${t('or')}</option></select><select data-field="c2" ${dis}>${optionList(level.conds, rule.c2, 'cond')}</select>` : ''}
      <span>${t('then')}</span><select data-field="food" ${dis}>${optionList(level.foods, rule.food, 'food')}</select></div>
      <div class="rule-tools"><button class="tiny" data-act="up" title="${t('up')}" ${dis}>↑</button><button class="tiny" data-act="down" title="${t('down')}" ${dis}>↓</button><button class="tiny" data-act="copy" title="${t('duplicate')}" ${dis}>⧉</button><button class="tiny" data-act="del" title="${t('del')}" ${dis}>×</button></div>`;
    return div;
  }

  function renderElse(level) {
    const div = document.createElement('div');
    div.className = `rule-card else-card ${state.hitRule === -1 ? 'hit' : ''}`;
    div.innerHTML = `<div class="rule-line"><span>${t('else')}</span><select data-else="food" ${state.running ? 'disabled' : ''}>${optionList(level.foods, state.elseFood, 'food')}</select></div>`;
    return div;
  }

  function render() {
    const level = LEVELS[state.level];
    els.levelName.textContent = t(level.key); els.levelGoal.textContent = `${t(level.goal)} · ${t('ruleLimit')(level.maxRules)}`;
    els.fed.textContent = `${Math.min(state.current, level.animals.length)}/${level.animals.length}`; els.left.textContent = String(Math.max(0, level.animals.length - state.current));
    els.rules.innerHTML = ''; state.rules.forEach((r, i) => els.rules.append(renderRule(r, i, level))); els.rules.append(renderElse(level));
    els.queue.innerHTML = ''; level.animals.forEach((id, i) => {
      const a = A(id); const row = document.createElement('div'); row.className = `queue-animal ${i < state.current ? 'done' : ''} ${i === state.current ? 'current' : ''}`;
      row.innerHTML = `<span class="qemoji">${a.emoji}</span><span>${animalName(a)}</span>`; els.queue.append(row);
    });
    $('#addRuleBtn').disabled = state.running || state.rules.length >= level.maxRules;
    $('#runBtn').disabled = state.running;
    $('#prevBtn').disabled = state.running || state.level === 0;
    $('#nextBtn').disabled = state.running || state.level === LEVELS.length - 1;
    els.gate.classList.toggle('running', state.running);
    els.again.textContent = state.level === LEVELS.length - 1 ? t('replay') : t('next');
  }

  function showAnimal(status = '') {
    const level = LEVELS[state.level];
    const id = level.animals[Math.min(state.current, level.animals.length - 1)];
    const a = A(id);
    els.animal.className = `animal-card ${status}`;
    els.animal.querySelector('.animal-emoji').textContent = a.emoji;
    els.animalName.textContent = animalName(a);
    els.badges.innerHTML = a.a.map((x) => `<span class="badge">${condLabel(x)}</span>`).join('');
    els.walker.textContent = a.emoji;
    els.walker.className = 'walker'; void els.walker.offsetWidth; // 重置动画再触发
    els.walker.classList.add(status === 'happy' ? 'leave' : status === 'bad' ? 'sad' : 'enter');
    if (!status) { els.drop.textContent = '❔'; els.drop.classList.remove('drop'); }
    els.scanner.classList.remove('scan'); els.keeper.classList.remove('splat');
  }

  function evalCond(a, c) { return a.a.includes(c); }
  function evalRule(rule, a) {
    const one = evalCond(a, rule.c1);
    if (!rule.op) return one;
    const two = evalCond(a, rule.c2);
    return rule.op === 'and' ? one && two : one || two;
  }
  function facts(a) { return a.a.slice(0, 3).map((x) => condLabel(x).replace(/^\S+\s*/, '')).join(lang === 'zh' ? '、' : ', '); }

  async function inspectAnimal() {
    const level = LEVELS[state.level];
    const a = A(level.animals[state.current]);
    const speed = $('#fastToggle').checked ? 170 : 470;
    showAnimal();
    await wait(Math.max(140, speed * 0.8)); // 等动物走进检查口
    for (let i = 0; i < state.rules.length; i++) {
      state.checkRule = i; state.hitRule = -2; render(); els.scanner.classList.add('scan'); sfx.scan();
      setTip(t('checking')(i + 1)); await wait(speed);
      if (evalRule(state.rules[i], a)) {
        state.hitRule = i; state.checkRule = -1; render();
        return { food: state.rules[i].food, rule: i };
      }
    }
    state.checkRule = -1; state.hitRule = -1; render(); await wait(Math.max(120, speed * 0.7));
    return { food: state.elseFood, rule: -1 };
  }

  async function dropFood(food) {
    els.drop.textContent = FOOD_EMOJI[food];
    els.drop.classList.add('drop');
    await wait($('#fastToggle').checked ? 130 : 300);
    els.drop.classList.remove('drop');
  }

  async function runZoo() {
    if (state.running) return;
    state.running = true; els.win.hidden = true; render();
    const level = LEVELS[state.level];
    while (state.current < level.animals.length) {
      const a = A(level.animals[state.current]);
      const result = await inspectAnimal();
      setTip(result.rule < 0 ? t('elseHit')(foodLabel(result.food)) : t('matched')(result.rule + 1, foodLabel(result.food)));
      await dropFood(result.food);
      if (result.food !== a.food) {
        showAnimal('bad'); els.keeper.classList.add('splat'); state.running = false; state.hitRule = -2; render(); sfx.bad();
        setTip(`${t('bad')(animalName(a), foodLabel(result.food), foodLabel(a.food), facts(a))} ${t('pauseFix')}`);
        return;
      }
      showAnimal('happy'); sfx.ok(); setTip(t('good')(animalName(a)));
      state.current += 1; state.hitRule = -2; render();
      await wait($('#fastToggle').checked ? 160 : 430);
    }
    state.running = false; render(); win();
  }

  function win() {
    const level = LEVELS[state.level];
    els.winTitle.textContent = t('winTitle'); els.winText.textContent = t('winText')(level.animals.length);
    $('#winEmoji').textContent = state.level === LEVELS.length - 1 ? '🎊' : '🎉';
    els.win.hidden = false; sfx.win(); confetti(state.level === LEVELS.length - 1 ? 90 : 28);
  }

  function confetti(n) {
    for (let i = 0; i < n; i++) {
      const c = document.createElement('i'); c.className = 'confetti';
      c.style.left = `${Math.random() * 100}%`; c.style.background = [cssVar('--accent'), cssVar('--accent-2'), cssVar('--grass'), cssVar('--water')][i % 4];
      c.style.animationDuration = `${1.5 + Math.random() * 1.8}s`; c.style.animationDelay = `${Math.random() * 0.5}s`;
      document.body.append(c); setTimeout(() => c.remove(), 3800);
    }
  }

  function addRule() {
    const l = LEVELS[state.level];
    if (state.rules.length >= l.maxRules) return;
    state.rules.push({ id: uid(), c1: l.conds[0], op: '', c2: l.conds[1] || l.conds[0], food: l.foods[0] }); render();
  }
  function moveRule(i, d) {
    const j = i + d; if (j < 0 || j >= state.rules.length) return;
    [state.rules[i], state.rules[j]] = [state.rules[j], state.rules[i]]; render();
  }
  function copyRule(i) {
    const l = LEVELS[state.level]; if (state.rules.length >= l.maxRules) return;
    state.rules.splice(i + 1, 0, { ...state.rules[i], id: uid() }); render();
  }
  function deleteRule(i) { state.rules.splice(i, 1); render(); }

  els.rules.addEventListener('change', (e) => {
    if (state.running) { render(); return; } // 营业中不许改规则
    const level = LEVELS[state.level];
    if (e.target.dataset.else === 'food') { state.elseFood = e.target.value; render(); return; }
    const card = e.target.closest('.rule-card'); if (!card) return;
    const i = state.rules.findIndex((r) => r.id === card.dataset.id); if (i < 0) return;
    state.rules[i][e.target.dataset.field] = e.target.value;
    if (!level.combo) state.rules[i].op = '';
    render();
  });
  els.rules.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]'); if (!btn || state.running) return;
    const card = btn.closest('.rule-card'); const i = state.rules.findIndex((r) => r.id === card.dataset.id);
    if (btn.dataset.act === 'up') moveRule(i, -1);
    if (btn.dataset.act === 'down') moveRule(i, 1);
    if (btn.dataset.act === 'copy') copyRule(i);
    if (btn.dataset.act === 'del') deleteRule(i);
  });

  els.rules.addEventListener('pointerdown', (e) => {
    const card = e.target.closest('.rule-card:not(.else-card)');
    if (!card || e.target.closest('select,button') || state.running) return;
    card.setPointerCapture(e.pointerId); state.dragId = card.dataset.id; card.classList.add('dragging');
  });
  els.rules.addEventListener('pointermove', (e) => {
    if (!state.dragId) return;
    els.rules.querySelectorAll('.drop-target').forEach((n) => n.classList.remove('drop-target'));
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('.rule-card:not(.else-card)');
    if (target && target.dataset.id !== state.dragId) target.classList.add('drop-target');
  });
  els.rules.addEventListener('pointerup', (e) => {
    if (!state.dragId) return;
    const from = state.rules.findIndex((r) => r.id === state.dragId);
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('.rule-card:not(.else-card)');
    const to = target ? state.rules.findIndex((r) => r.id === target.dataset.id) : -1;
    if (from >= 0 && to >= 0 && from !== to) {
      const [r] = state.rules.splice(from, 1); state.rules.splice(to, 0, r);
    }
    state.dragId = null; render();
  });
  els.rules.addEventListener('pointercancel', () => {
    if (!state.dragId) return;
    state.dragId = null; render();
  });

  $('#addRuleBtn').addEventListener('click', addRule);
  $('#runBtn').addEventListener('click', runZoo);
  $('#resetBtn').addEventListener('click', initLevel);
  $('#prevBtn').addEventListener('click', () => { if (!state.running) { state.level = Math.max(0, state.level - 1); initLevel(); } });
  $('#nextBtn').addEventListener('click', () => { if (!state.running) { state.level = Math.min(LEVELS.length - 1, state.level + 1); initLevel(); } });
  els.again.addEventListener('click', () => { state.level = state.level === LEVELS.length - 1 ? 0 : state.level + 1; initLevel(); });
  addEventListener('themechange', () => showAnimal());
  addEventListener('resize', render);

  /* ============================ 启动 ============================ */
  initLevel();
  applyTheme();
  applyLang();
})();
