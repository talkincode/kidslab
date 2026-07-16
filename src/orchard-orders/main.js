/* ============================================================
   🍎 果园订单 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '🍎 果园订单 · KidsLab',
      back: '返回平台',
      title: '果园订单',
      tip0: '拖拽田地画一个长方形，看看几行几列正好装满订单。',
      orderLabel: '今日订单', level: '订单', coins: '果园币', found: '图鉴',
      plant: '播种', water: '浇水交货', rotate: '旋转魔法', bookTitle: '口诀图鉴',
      bookHint: '每找到一种新种法，就贴一张苹果贴纸。', next: '下一张订单 →', restart: '从头开园',
      order: (emoji, n) => `${emoji} 客人说：我要 ${n} 个苹果！`,
      splitOrder: (emoji, n) => `${emoji} 石头挡路！请拼两块田，凑 ${n} 个苹果。`,
      oddOrder: (emoji, n) => `${emoji} 小猪订单：种 24 个、吃掉 1 个，交货 ${n} 个！`,
      oddGuide: '23 不能正好排成长方形。先铺 4×6＝24 格，小猪会吃掉多出的 1 个。',
      oddHelp: '帮我铺成 4×6',
      oddTip: '特殊玩法：铺 4 行×6 列，点“播种”，再点“浇水交货”。',
      oddSelected: '已经铺好 4×6＝24 格。现在点“播种”！',
      live: (r, c, n) => `${r} 行 × ${c} 列 = ${n} 个`,
      liveSplit: (sum, n) => `已经播种 ${sum} / ${n} 个苹果`,
      empty: '从任意格按住拖动，画出苹果田。',
      badStone: '石头地不能种哦，换一块软软的泥土！🪨',
      badOverlap: '这块田已经种过啦，试试旁边的空地。',
      badSize: (got, need) => `现在是 ${got} 个苹果，订单要 ${need} 个。客人打了个哈欠：再调一下～`,
      planted: '种子排队躺好啦！点浇水壶让它们唰唰长大。',
      splitNeedTwo: '必须分成两块田！先画一块少于 36 格的田，再用第二块补足。',
      splitPlanted: (sum, rest) => `第一块有 ${sum} 个苹果，还差 ${rest} 个。现在画第二块田！`,
      splitSecondSize: (got, need) => `第二块要有 ${need} 个苹果，现在是 ${got} 个。再调一下～`,
      harvest: (fact) => `${fact}，装箱交货！`,
      chant: (r, c, n) => `${numZh(r)}${numZh(c)}${numZh(n)}！`,
      chantEn: () => '',
      comm: (a, b) => `${a}×${b} = ${b}×${a}！果园转个方向，苹果一个没少！`,
      oddWin: '24 − 1 = 23！小猪吃掉多出的 1 个，订单正好完成。这就是有余数。',
      splitWin: (r1, c1, r2, c2, n) => `${r1}×${c1} + ${r2}×${c2} = ${n}！两块田拼起来，就是大订单的秘密。`,
      wrongOdd: '如果非要整整齐齐，23 会剩 1 个洞。试试画 4×6 或 3×8，再让小猪帮忙。',
      firework: '七八五十六！最难口诀被你种成烟花啦！🎆',
      complete: '果园全通关！图鉴继续收集不同种法吧。',
    },
    en: {
      doc: '🍎 Orchard Orders · KidsLab',
      back: 'Back to platform', title: 'Orchard Orders',
      tip0: 'Drag a rectangle on the field. Rows times columns should match the order.',
      orderLabel: 'Today’s order', level: 'Order', coins: 'Orchard coins', found: 'Album',
      plant: 'Plant', water: 'Water & deliver', rotate: 'Rotate magic', bookTitle: 'Times-table album',
      bookHint: 'Every new array becomes an apple sticker.', next: 'Next order →', restart: 'Restart orchard',
      order: (emoji, n) => `${emoji} customer says: I want ${n} apples!`,
      splitOrder: (emoji, n) => `${emoji} Rocks in the way! Use two fields to make ${n} apples.`,
      oddOrder: (emoji, n) => `${emoji} Piggy order: grow 24, munch 1, and deliver ${n}!`,
      oddGuide: '23 cannot fill a rectangle. Make 4×6＝24 squares and Piggy will munch the extra one.',
      oddHelp: 'Show me 4×6',
      oddTip: 'Special rule: make 4 rows × 6 columns, Plant, then Water & deliver.',
      oddSelected: 'Your 4×6＝24 field is ready. Now tap Plant!',
      live: (r, c, n) => `${r} rows × ${c} columns = ${n} apples`,
      liveSplit: (sum, n) => `Planted ${sum} / ${n} apples`,
      empty: 'Press and drag from any square to draw an orchard.',
      badStone: 'No planting on rocks — pick soft soil! 🪨',
      badOverlap: 'That patch already has seeds. Try empty ground.',
      badSize: (got, need) => `That makes ${got} apples; the order needs ${need}. The customer yawns and waits.`,
      planted: 'Seeds are lined up! Tap the watering can and watch them grow.',
      splitNeedTwo: 'This order must use two fields! Make a first field smaller than 36, then fill the rest with a second.',
      splitPlanted: (sum, rest) => `The first field has ${sum} apples; ${rest} remain. Now draw the second field!`,
      splitSecondSize: (got, need) => `The second field needs ${need} apples, but this one has ${got}. Adjust it and try again.`,
      harvest: (fact) => `${fact}. Box them up!`,
      chant: () => '',
      chantEn: (r, c, n) => `${numberWord(r)} ${numberWord(c)}s are ${numberWord(n)}!`,
      comm: (a, b) => `${a}×${b} = ${b}×${a}! Rotate the orchard — not one apple is lost!`,
      oddWin: '24 − 1 = 23! Piggy munches the extra apple and the order is complete. That is a remainder!',
      splitWin: (r1, c1, r2, c2, n) => `${r1}×${c1} + ${r2}×${c2} = ${n}! Two fields join forces for one big order.`,
      wrongOdd: 'A perfect rectangle leaves 1 gap for 23. Try 4×6 or 3×8, then let the piggy help.',
      firework: 'Seven eights are fifty-six — the tricky fact became fireworks! 🎆',
      complete: 'All orchard orders delivered! Keep collecting more array stickers.',
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
  const ROWS = 8;
  const COLS = 12;
  const ORDERS = [
    { n: 12, emoji: '🐰' }, { n: 18, emoji: '🦊' }, { n: 20, emoji: '🐻' }, { n: 24, emoji: '🐼' },
    { n: 30, emoji: '🦝' }, { n: 36, emoji: '🐨' }, { n: 42, emoji: '🦁' }, { n: 48, emoji: '🐯' },
    { n: 23, emoji: '🐷', odd: true }, { n: 36, emoji: '🐵', split: true }, { n: 56, emoji: '🦉' },
  ];
  const $ = (id) => document.getElementById(id);
  const els = {
    grid: $('grid'), fx: $('fx'), tip: $('tip'), customerEmoji: $('customerEmoji'), orderText: $('orderText'),
    levelNum: $('levelNum'), coins: $('coins'), foundCount: $('foundCount'), patienceBar: $('patienceBar'),
    liveMath: $('liveMath'), plantBtn: $('plantBtn'), waterBtn: $('waterBtn'), rotateBtn: $('rotateBtn'),
    oddGuide: $('oddGuide'), oddHelpBtn: $('oddHelpBtn'),
    cards: $('cards'), nextBtn: $('nextBtn'), restartBtn: $('restartBtn'), toast: $('toast'),
  };
  const ctx = els.fx.getContext('2d');
  const cells = [];
  let actx = null;
  let orderIndex = 0;
  let coins = 0;
  let patience = 100;
  let timer = 0;
  let dragStart = null;
  let preview = null;
  let planted = [];
  let stage = 'draw';
  let lastFact = null;
  const facts = new Set();
  let sparkles = [];

  function numZh(n) { return '零一二三四五六七八九十'.split('')[n] || String(n); }
  function numberWord(n) {
    return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'thirty', 'thirty-six', 'forty-two', 'forty-eight', 'fifty-six'][n] || String(n);
  }
  function order() { return ORDERS[orderIndex]; }
  function keyOf(r, c) { return `${Math.min(r, c)}x${Math.max(r, c)}`; }
  function factText(r, c) { return `${r}×${c}=${r * c}`; }
  function isStone(i) { return order().split && [18, 19, 30, 31, 42, 43].includes(i); }
  function rectCells(rect) {
    const out = [];
    for (let r = rect.r0; r <= rect.r1; r++) for (let c = rect.c0; c <= rect.c1; c++) out.push(r * COLS + c);
    return out;
  }
  function rectFrom(a, b) {
    const ar = Math.floor(a / COLS), ac = a % COLS, br = Math.floor(b / COLS), bc = b % COLS;
    return { r0: Math.min(ar, br), r1: Math.max(ar, br), c0: Math.min(ac, bc), c1: Math.max(ac, bc) };
  }
  function rectSize(rect) { return { rows: rect.r1 - rect.r0 + 1, cols: rect.c1 - rect.c0 + 1, total: (rect.r1 - rect.r0 + 1) * (rect.c1 - rect.c0 + 1) }; }

  function buildGrid() {
    els.grid.innerHTML = '';
    cells.length = 0;
    for (let i = 0; i < ROWS * COLS; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.i = i;
      cell.addEventListener('pointerdown', onPointerDown);
      cells.push(cell);
      els.grid.append(cell);
    }
    els.grid.addEventListener('pointermove', onPointerMove);
    addEventListener('pointerup', onPointerUp);
  }

  function startAudio() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
    } catch { /* no audio */ }
  }
  function tone(freq, dur = 0.12, delay = 0, type = 'triangle') {
    if (!actx) return;
    const o = actx.createOscillator();
    const g = actx.createGain();
    const t0 = actx.currentTime + delay;
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.14, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + dur + 0.02);
  }
  const sfx = {
    plant: () => [392, 523].forEach((f, i) => tone(f, 0.11, i * 0.05)),
    grow: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.12, i * 0.08)),
    wrong: () => tone(150, 0.22, 0, 'sawtooth'),
    win: () => [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.15, i * 0.08)),
  };

  function onPointerDown(e) {
    if (stage !== 'draw') return;
    startAudio();
    const i = Number(e.currentTarget.dataset.i);
    if (isStone(i)) { show(t('badStone')); sfx.wrong(); return; }
    dragStart = i;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setPreview(i);
  }
  /* pointerdown 时用 setPointerCapture 锁定了指针，浏览器不会再对拖过的格子
     派发 pointerenter/pointerover，因此改用 pointermove + elementFromPoint 手动命中测试 */
  function onPointerMove(e) {
    if (dragStart === null || stage !== 'draw') return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    const cell = target?.closest?.('.cell');
    if (!cell) return;
    const i = Number(cell.dataset.i);
    if (Number.isNaN(i)) return;
    setPreview(i);
  }
  function onPointerUp() { dragStart = null; }
  function setPreview(i) {
    if (isStone(i)) return;
    preview = rectFrom(dragStart, i);
    const sz = rectSize(preview);
    els.liveMath.textContent = t('live')(sz.rows, sz.cols, sz.total);
    /* 拖拽中 preview 从 null 变为矩形，播种按钮的可用状态需要跟着刷新，
       否则会一直保持 resetOrder() 时算出的 disabled=true，点不动 */
    els.plantBtn.disabled = stage !== 'draw' || !preview;
    renderCells();
  }

  function resetOrder() {
    stage = 'draw';
    preview = null; planted = []; lastFact = null; patience = 100;
    clearInterval(timer);
    timer = setInterval(() => { patience = Math.max(14, patience - 0.7); els.patienceBar.style.width = `${patience}%`; }, 1000);
    /* 切换到下一张订单时，清掉上一单遗留的提示文案（如“六八48！”），恢复默认操作提示 */
    clearTimeout(show.timer);
    els.tip.textContent = order().odd ? t('oddTip') : t('tip0');
    els.toast.hidden = true;
    els.toast.classList.remove('magic');
    render(); renderCells();
  }
  function plant() {
    startAudio();
    if (!preview || stage !== 'draw') { show(t('empty')); return; }
    const pcs = rectCells(preview);
    if (pcs.some((i) => isStone(i))) { show(t('badStone')); sfx.wrong(); return; }
    if (pcs.some((i) => planted.some((p) => p.cells.includes(i)))) { show(t('badOverlap')); sfx.wrong(); return; }
    const sz = rectSize(preview);
    const current = planted.reduce((a, p) => a + p.total, 0);
    const o = order();
    if (o.split) {
      if (current === 0 && sz.total >= o.n) {
        show(sz.total === o.n ? t('splitNeedTwo') : t('badSize')(sz.total, o.n));
        sfx.wrong();
        return;
      }
      if (current > 0 && current + sz.total !== o.n) {
        show(t('splitSecondSize')(sz.total, o.n - current));
        sfx.wrong();
        return;
      }
      planted.push({ ...preview, ...sz, cells: pcs });
      preview = null;
      sfx.plant();
      if (planted.length === 2) {
        stage = 'planted';
        show(t('planted'));
      } else {
        show(t('splitPlanted')(sz.total, o.n - sz.total));
      }
    } else {
      if (o.odd && sz.total !== 24) { show(t('wrongOdd')); sfx.wrong(); return; }
      if (!o.odd && sz.total !== o.n) { show(t('badSize')(sz.total, o.n)); sfx.wrong(); return; }
      planted = [{ ...preview, ...sz, cells: pcs }]; preview = null; stage = 'planted'; sfx.plant(); show(t('planted'));
    }
    render(); renderCells();
  }

  function water() {
    startAudio();
    if (!planted.length) { show(t('empty')); return; }
    const o = order();
    const total = planted.reduce((a, p) => a + p.total, 0);
    const ok = o.split ? planted.length === 2 && total === o.n : o.odd ? total === 24 : total === o.n;
    if (!ok) { show(o.odd ? t('wrongOdd') : t('badSize')(total, o.n)); sfx.wrong(); return; }
    stage = 'growing';
    let all = planted.flatMap((p) => p.cells);
    if (o.odd && total === 24) all = all.slice(0, 23).concat(all[23]);
    all.forEach((i, k) => setTimeout(() => {
      cells[i].textContent = k === 23 && o.odd ? '🐷' : (k % 3 === 0 ? '🌱' : k % 3 === 1 ? '🌳' : '🍎');
      cells[i].classList.add('grow');
      if (k === all.length - 1) finishHarvest();
    }, k * 30));
    sfx.grow();
  }
  function finishHarvest() {
    const o = order();
    stage = 'done';
    coins += 10 + orderIndex;
    const p = planted[0];
    if (p) {
      lastFact = [p.rows, p.cols];
      const k = keyOf(p.rows, p.cols);
      facts.add(k);
    }
    planted.forEach((part) => facts.add(keyOf(part.rows, part.cols)));
    if (o.split) {
      const [a, b] = planted;
      show(t('splitWin')(a.rows, a.cols, b.rows, b.cols, o.n));
    } else if (o.odd) show(t('oddWin')); else {
      const chant = lang === 'zh' ? t('chant')(p.rows, p.cols, p.total) : t('chantEn')(p.rows, p.cols, p.total);
      show(t('harvest')(chant));
    }
    if (o.n === 56) { show(t('firework'), true); burst(90); }
    else burst(35);
    sfx.win(); render(); renderCells();
  }
  function rotateMagic() {
    startAudio();
    if (stage !== 'done' || !lastFact) return;
    const [a, b] = lastFact;
    show(t('comm')(a, b), true);
    facts.add(keyOf(a, b));
    els.grid.animate([
      { transform: 'rotate(0deg) scale(1)' }, { transform: 'rotate(90deg) scale(.92)' }, { transform: 'rotate(0deg) scale(1)' },
    ], { duration: 900, easing: 'cubic-bezier(.2,1.4,.5,1)' });
    burst(50); sfx.win(); render();
  }
  function showOddExample() {
    if (!order().odd || stage !== 'draw') return;
    preview = { r0: 0, r1: 3, c0: 0, c1: 5 };
    els.liveMath.textContent = t('live')(4, 6, 24);
    show(t('oddSelected'));
    render();
    renderCells();
  }
  function nextOrder() {
    orderIndex += 1;
    if (orderIndex >= ORDERS.length) { orderIndex = 0; show(t('complete'), true); }
    resetOrder();
  }
  function restart() { orderIndex = 0; coins = 0; facts.clear(); resetOrder(); }

  function renderCells() {
    const previewSet = new Set(preview ? rectCells(preview) : []);
    const plantedSet = new Set(planted.flatMap((p) => p.cells));
    cells.forEach((cell, i) => {
      cell.className = 'cell';
      cell.textContent = '';
      if (isStone(i)) { cell.classList.add('stone'); cell.textContent = '🪨'; }
      if (previewSet.has(i)) cell.classList.add('preview');
      if (plantedSet.has(i)) {
        cell.classList.add('planted');
        if (stage === 'done') {
          const plantedOrder = planted.flatMap((p) => p.cells);
          cell.textContent = order().odd && i === plantedOrder[23] ? '🐷' : '🍎';
          if (order().odd && i === plantedOrder[23]) cell.classList.add('extra');
        } else if (stage !== 'growing') cell.textContent = '🌰';
      }
    });
  }
  function renderCards() {
    els.cards.innerHTML = '';
    [...facts].sort((a, b) => Number(a.split('x')[0]) - Number(b.split('x')[0]) || Number(a.split('x')[1]) - Number(b.split('x')[1])).forEach((k) => {
      const [a, b] = k.split('x').map(Number);
      const card = document.createElement('div');
      card.className = 'fact';
      card.textContent = `🍎 ${a}×${b}=${a * b}`;
      els.cards.append(card);
    });
  }
  function render() {
    const o = order();
    els.customerEmoji.textContent = o.emoji;
    els.orderText.textContent = o.split ? t('splitOrder')(o.emoji, o.n) : o.odd ? t('oddOrder')(o.emoji, o.n) : t('order')(o.emoji, o.n);
    els.oddGuide.hidden = !o.odd;
    els.levelNum.textContent = `${orderIndex + 1}/${ORDERS.length}`;
    els.coins.textContent = coins;
    els.foundCount.textContent = facts.size;
    els.patienceBar.style.width = `${patience}%`;
    const sum = planted.reduce((a, p) => a + p.total, 0);
    els.liveMath.textContent = preview ? els.liveMath.textContent : (o.split ? t('liveSplit')(sum, o.n) : '—');
    els.plantBtn.disabled = stage !== 'draw' || !preview;
    els.waterBtn.disabled = !planted.length || stage === 'growing' || stage === 'done';
    els.rotateBtn.disabled = stage !== 'done' || !lastFact;
    els.nextBtn.disabled = stage !== 'done';
    renderCards();
  }

  function show(msg, magic = false) {
    els.tip.textContent = msg;
    els.toast.textContent = msg;
    els.toast.hidden = false;
    els.toast.classList.toggle('magic', magic);
    clearTimeout(show.timer);
    show.timer = setTimeout(() => { els.toast.hidden = true; els.toast.classList.remove('magic'); }, magic ? 2600 : 1800);
  }
  function resizeFx() {
    const dpr = Math.max(1, Math.min(2, devicePixelRatio || 1));
    const r = els.fx.getBoundingClientRect();
    els.fx.width = Math.max(1, Math.floor(r.width * dpr));
    els.fx.height = Math.max(1, Math.floor(r.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFx();
  }
  function burst(n) {
    const r = els.fx.getBoundingClientRect();
    for (let i = 0; i < n; i++) sparkles.push({
      x: r.width * (0.25 + Math.random() * 0.5), y: r.height * (0.2 + Math.random() * 0.5),
      vx: (Math.random() - 0.5) * 7, vy: -Math.random() * 6 - 2, life: 50 + Math.random() * 45, s: 6 + Math.random() * 8,
    });
    requestAnimationFrame(tickFx);
  }
  function drawFx() {
    const r = els.fx.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height);
    ctx.fillStyle = cssVar('--accent');
    ctx.strokeStyle = cssVar('--line-strong');
    sparkles.forEach((p, i) => {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(i + p.life / 10);
      ctx.fillStyle = i % 3 === 0 ? cssVar('--gold') : i % 3 === 1 ? cssVar('--leaf') : cssVar('--apple');
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.strokeRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore();
    });
  }
  function tickFx() {
    sparkles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= 1; });
    sparkles = sparkles.filter((p) => p.life > 0);
    drawFx();
    if (sparkles.length) requestAnimationFrame(tickFx);
  }

  els.plantBtn.addEventListener('click', plant);
  els.waterBtn.addEventListener('click', water);
  els.rotateBtn.addEventListener('click', rotateMagic);
  els.oddHelpBtn.addEventListener('click', showOddExample);
  els.nextBtn.addEventListener('click', nextOrder);
  els.restartBtn.addEventListener('click', restart);
  addEventListener('resize', resizeFx);
  addEventListener('themechange', resizeFx);

  /* ============================ 启动 ============================ */
  buildGrid();
  applyTheme();
  applyLang();
  resetOrder();
  resizeFx();
})();
