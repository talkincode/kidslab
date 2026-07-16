/* ============================================================
   仓鼠围栏 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '仓鼠围栏 · KidsLab',
      back: '返回平台', title: '仓鼠围栏',
      tip0: '拖动大手柄改变长和宽；周长刚好用完、面积达到目标，仓鼠才会开心开园。',
      level: '关卡', budget: '栅栏预算', used: '已用', area: '面积', happy: '幸福度', open: '开园！',
      widthMinus: '宽 −', widthPlus: '宽 +', heightMinus: '高 −', heightPlus: '高 +', retry: '重来本关', next: '下一关 →', again: '再玩一次',
      meters: (n) => `${n}m`, sqm: (n) => `${n}㎡`, levelOf: (a, b) => `${a}/${b}`,
      names: ['新手菜园', '同周长大不同', '正方形秘密', '瘦长挤挤巷', '靠墙派对', '大草坪设计', 'L 形转角乐园', '省栅栏大师'],
      goals: { normal: (b, g) => `用 ${b}m 栅栏，面积至少 ${g} 格`, wall: (b, g) => `上边有现成墙，只围三边：${b}m 至少 ${g} 格`, l: (b, g) => `两个长方形拼 L 形：${b}m 至少 ${g} 格`, reverse: (a, p) => `面积固定 ${a} 格，栅栏不超过 ${p}m` },
      formulaNormal: (w, h) => `周长 = 2×(${w}+${h}) = ${2 * (w + h)}m；面积 = ${w}×${h} = ${w * h}㎡`,
      formulaWall: (w, h, p) => `靠墙只围三边：${w}+2×${h} = ${p}m；面积 = ${w}×${h} = ${w * h}㎡`,
      formulaL: (a, p) => `L 形组合：数外边栅栏 = ${p}m；高亮草地 = ${a}㎡`,
      formulaReverse: (w, h, p, a) => `面积 = ${w}×${h} = ${a}㎡；要用更少栅栏：${p}m`,
      tooShort: (u, b) => `才用了 ${u}m，仓鼠从缺口探头：还剩栅栏没装呢！`,
      tooLong: (u, b) => `用了 ${u}m，超过 ${b}m 啦，一角啪嗒倒下。`,
      notHappy: (a, g) => `面积 ${a} 格，幸福目标是 ${g} 格。试试更接近正方形？`,
      reverseBad: (a, need, p, goal) => `现在面积 ${a}/${need} 格、栅栏 ${p}m。目标：面积刚好且不超过 ${goal}m。`,
      lHint: '拖右下大手柄改主草坪，拖转角小手柄改 L 形伸出去的草坪。',
      wallMagic: '靠墙魔法！同样 16m，8×4 围出 32 格，仓鼠开派对放烟花 🎆',
      success: (name, a, p) => `${name} 开园！${p}m 栅栏围出 ${a} 格草地。`,
      allTitle: '仓鼠建筑师毕业！', allDesc: '你分清了周长和面积，还发现接近正方形、靠墙、L 形都能改变结果。',
      winTitle: '仓鼠开园啦！', winDesc: (stars) => `幸福度 ${stars} 星，仓鼠开始打滚撒花。`,
      labels: { width: '长', height: '宽', wall: '现成墙', goal: '目标', drag: '拖我', party: '派对！', fixed: '固定面积' },
    },
    en: {
      doc: 'Hamster Fence · KidsLab',
      back: 'Back to platform', title: 'Hamster Fence',
      tip0: 'Drag the big handles to change length and width. Use exactly the fence and hit the area goal to open.',
      level: 'Level', budget: 'Fence budget', used: 'Used', area: 'Area', happy: 'Happiness', open: 'Open park!',
      widthMinus: 'Width −', widthPlus: 'Width +', heightMinus: 'Height −', heightPlus: 'Height +', retry: 'Retry level', next: 'Next level →', again: 'Play again',
      meters: (n) => `${n}m`, sqm: (n) => `${n}㎡`, levelOf: (a, b) => `${a}/${b}`,
      names: ['Starter Patch', 'Same Perimeter?', 'Square Secret', 'Skinny Squeeze', 'Wall Party', 'Big Lawn Design', 'L-Corner Park', 'Fence Saver'],
      goals: { normal: (b, g) => `Use ${b}m fence and make at least ${g} squares`, wall: (b, g) => `A wall covers the top: ${b}m fence, at least ${g} squares`, l: (b, g) => `Join two rectangles into an L: ${b}m fence, at least ${g} squares`, reverse: (a, p) => `Fixed area ${a} squares, use no more than ${p}m fence` },
      formulaNormal: (w, h) => `Perimeter = 2×(${w}+${h}) = ${2 * (w + h)}m; area = ${w}×${h} = ${w * h}㎡`,
      formulaWall: (w, h, p) => `Against a wall: ${w}+2×${h} = ${p}m; area = ${w}×${h} = ${w * h}㎡`,
      formulaL: (a, p) => `L shape: count outside fence = ${p}m; highlighted lawn = ${a}㎡`,
      formulaReverse: (w, h, p, a) => `Area = ${w}×${h} = ${a}㎡; try less fence: ${p}m`,
      tooShort: (u, b) => `Only ${u}m used. A hamster peeks from the gap: more fence please!`,
      tooLong: (u, b) => `${u}m used, over ${b}m. One corner flops down.`,
      notHappy: (a, g) => `Area is ${a}; happiness goal is ${g}. Try closer to a square?`,
      reverseBad: (a, need, p, goal) => `Area ${a}/${need}, fence ${p}m. Need exact area and at most ${goal}m.`,
      lHint: 'Drag the main lower-right handle for the big rectangle; drag the corner handle for the L extension.',
      wallMagic: 'Wall magic! With the same 16m, 8×4 makes 32 squares — hamster fireworks 🎆',
      success: (name, a, p) => `${name} opens! ${p}m fence surrounds ${a} lawn squares.`,
      allTitle: 'Hamster architect graduate!', allDesc: 'You separated perimeter from area and used squares, walls, and L-shapes cleverly.',
      winTitle: 'The hamster park is open!', winDesc: (stars) => `${stars}-star happiness. Hamsters roll and toss flowers.`,
      labels: { width: 'length', height: 'width', wall: 'free wall', goal: 'goal', drag: 'drag', party: 'party!', fixed: 'fixed area' },
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
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const tip = document.getElementById('tip');
  const formulaText = document.getElementById('formulaText');
  const levelText = document.getElementById('levelText');
  const budgetText = document.getElementById('budgetText');
  const usedText = document.getElementById('usedText');
  const areaText = document.getElementById('areaText');
  const happyText = document.getElementById('happyText');
  const openBtn = document.getElementById('openBtn');
  const retryBtn = document.getElementById('retryBtn');
  const win = document.getElementById('win');
  const winEmoji = document.getElementById('winEmoji');
  const winTitle = document.getElementById('winTitle');
  const winDesc = document.getElementById('winDesc');
  const nextBtn = document.getElementById('nextBtn');
  const againBtn = document.getElementById('againBtn');

  const LEVELS = [
    { kind: 'normal', budget: 14, goal: 12, start: { w: 3, h: 4 } },
    { kind: 'normal', budget: 16, goal: 15, start: { w: 1, h: 7 } },
    { kind: 'normal', budget: 16, goal: 16, start: { w: 2, h: 6 } },
    { kind: 'normal', budget: 20, goal: 24, start: { w: 1, h: 9 } },
    { kind: 'wall', budget: 16, goal: 32, start: { w: 6, h: 5 }, magic: true },
    { kind: 'normal', budget: 24, goal: 35, start: { w: 2, h: 10 } },
    { kind: 'l', budget: 22, goal: 25, start: { w: 3, h: 3, ew: 2, eh: 2 } },
    { kind: 'reverse', area: 24, goalPerimeter: 20, start: { w: 3, h: 8 } },
  ];

  const state = {
    level: 0, width: 1, height: 1, dpr: 1, grid: { cols: 12, rows: 9, size: 42, x: 0, y: 0 },
    shape: { w: 3, h: 4, ew: 2, eh: 3 }, drag: null, message: '', hamsters: [], particles: [], shake: 0, opened: false, stars: 1,
  };

  let actx = null;
  function ensureAudio() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
    } catch { /* audio unavailable */ }
  }
  function tone(freq, dur = 0.12, type = 'sine', gain = 0.12, delay = 0) {
    if (!actx) return;
    const t0 = actx.currentTime + delay;
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g).connect(actx.destination);
    o.start(t0); o.stop(t0 + dur + 0.03);
  }
  const plink = () => tone(440, 0.08, 'triangle', 0.08);
  const flop = () => [180, 130].forEach((f, i) => tone(f, 0.12, 'sawtooth', 0.06, i * 0.05));
  const cheer = () => [392, 523, 659, 784].forEach((f, i) => tone(f, 0.14, 'sine', 0.11, i * 0.05));

  function currentLevel() { return LEVELS[state.level]; }
  function levelName() { return t('names')[state.level]; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function rand(min, max) { return min + Math.random() * (max - min); }

  function resetLevel() {
    const lv = currentLevel();
    state.shape = { w: lv.start.w, h: lv.start.h, ew: lv.start.ew || 2, eh: lv.start.eh || 3 };
    state.message = goalText(lv);
    state.hamsters = makeHamsters(10);
    state.particles = [];
    state.opened = false;
    state.drag = null;
    state.shake = 0;
    win.hidden = true;
    render();
  }

  function goalText(lv) {
    if (lv.kind === 'wall') return t('goals').wall(lv.budget, lv.goal);
    if (lv.kind === 'l') return t('goals').l(lv.budget, lv.goal);
    if (lv.kind === 'reverse') return t('goals').reverse(lv.area, lv.goalPerimeter);
    return t('goals').normal(lv.budget, lv.goal);
  }

  function occupiedCells() {
    const lv = currentLevel();
    const cells = new Set();
    const addRect = (x0, y0, w, h) => {
      for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (x >= 0 && y >= 0) cells.add(`${x},${y}`);
    };
    addRect(0, 0, state.shape.w, state.shape.h);
    if (lv.kind === 'l') addRect(state.shape.w, Math.max(0, state.shape.h - state.shape.eh), state.shape.ew, state.shape.eh);
    return cells;
  }
  function metrics() {
    const lv = currentLevel();
    const cells = occupiedCells();
    let perimeter = 0;
    cells.forEach((key) => {
      const [x, y] = key.split(',').map(Number);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const nx = x + dx, ny = y + dy;
        if (!cells.has(`${nx},${ny}`)) {
          if (lv.kind === 'wall' && dy === -1 && y === 0) return;
          perimeter += 1;
        }
      });
    });
    return { area: cells.size, perimeter, cells };
  }

  function happiness() {
    const lv = currentLevel();
    const m = metrics();
    let ratio;
    if (lv.kind === 'reverse') ratio = m.area === lv.area ? clamp(lv.goalPerimeter / Math.max(1, m.perimeter), 0, 1.35) : clamp(m.area / lv.area, 0, 0.8);
    else ratio = (m.perimeter === lv.budget ? 0.45 : 0) + clamp(m.area / lv.goal, 0, 1) * 0.55;
    const stars = ratio >= 1 ? 5 : ratio > 0.82 ? 4 : ratio > 0.62 ? 3 : ratio > 0.38 ? 2 : 1;
    state.stars = stars;
    return '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
  }

  function isSuccess() {
    const lv = currentLevel();
    const m = metrics();
    if (lv.kind === 'reverse') return m.area === lv.area && m.perimeter <= lv.goalPerimeter;
    return m.perimeter === lv.budget && m.area >= lv.goal;
  }

  function openPark() {
    ensureAudio();
    const lv = currentLevel();
    const m = metrics();
    if (!isSuccess()) {
      state.shake = 0.55;
      if (lv.kind === 'reverse') state.message = t('reverseBad')(m.area, lv.area, m.perimeter, lv.goalPerimeter);
      else if (m.perimeter < lv.budget) state.message = t('tooShort')(m.perimeter, lv.budget);
      else if (m.perimeter > lv.budget) state.message = t('tooLong')(m.perimeter, lv.budget);
      else state.message = t('notHappy')(m.area, lv.goal);
      flop(); render(); return;
    }
    state.opened = true;
    state.message = lv.kind === 'wall' && lv.magic ? t('wallMagic') : t('success')(levelName(), m.area, m.perimeter);
    cheer(); fireworks(lv.kind === 'wall' ? 110 : 65);
    setTimeout(() => showWin(), 650);
  }

  function showWin() {
    const last = state.level === LEVELS.length - 1;
    win.hidden = false;
    winEmoji.textContent = last ? '🏆' : state.opened ? '🐹' : '🌿';
    winTitle.textContent = last ? t('allTitle') : t('winTitle');
    winDesc.textContent = last ? t('allDesc') : t('winDesc')(state.stars);
    nextBtn.textContent = last ? t('again') : t('next');
  }
  function advance() { state.level = (state.level + 1) % LEVELS.length; resetLevel(); }

  function makeHamsters(n) {
    return Array.from({ length: n }, (_, i) => ({ x: rand(0.1, 0.8), y: rand(0.1, 0.8), vx: rand(-0.18, 0.18), vy: rand(-0.15, 0.15), roll: rand(0, 6), emoji: ['🐹', '🐭', '🐹', '🐰'][i % 4] }));
  }
  function fireworks(n) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2), sp = rand(35, 220);
      state.particles.push({ x: rand(state.width * 0.2, state.width * 0.8), y: rand(50, state.height * 0.45), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rand(0.6, 1.4), max: 1.4, size: rand(3, 7) });
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    state.width = Math.max(320, rect.width);
    state.height = Math.max(380, rect.height);
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    layoutGrid(); render();
  }
  function layoutGrid() {
    const cols = 13, rows = 9;
    const size = Math.floor(Math.min((state.width - 70) / cols, (state.height - 100) / rows));
    state.grid = { cols, rows, size, x: (state.width - cols * size) / 2, y: 62 };
  }

  function pointerPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (state.width / r.width), y: (e.clientY - r.top) * (state.height / r.height) };
  }
  function cellFromPoint(p) {
    const g = state.grid;
    return { x: Math.round((p.x - g.x) / g.size), y: Math.round((p.y - g.y) / g.size) };
  }
  function handles() {
    const g = state.grid, s = state.shape, lv = currentLevel();
    const list = [{ name: 'main', x: g.x + s.w * g.size, y: g.y + s.h * g.size }];
    if (lv.kind === 'l') list.push({ name: 'elbow', x: g.x + (s.w + s.ew) * g.size, y: g.y + (s.h - s.eh) * g.size });
    return list;
  }
  canvas.addEventListener('pointerdown', (e) => {
    ensureAudio();
    const p = pointerPos(e);
    const hit = handles().find((h) => Math.hypot(p.x - h.x, p.y - h.y) < 34);
    if (hit) { state.drag = hit.name; canvas.setPointerCapture(e.pointerId); plink(); }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!state.drag) return;
    const c = cellFromPoint(pointerPos(e));
    const lv = currentLevel();
    if (state.drag === 'main') {
      state.shape.w = clamp(c.x, 1, lv.kind === 'l' ? 9 : 12);
      state.shape.h = clamp(c.y, 1, 8);
      if (lv.kind === 'l') state.shape.eh = clamp(state.shape.eh, 1, state.shape.h);
    } else if (state.drag === 'elbow') {
      state.shape.ew = clamp(c.x - state.shape.w, 1, 5);
      state.shape.eh = clamp(state.shape.h - c.y, 1, state.shape.h);
    }
    state.message = lv.kind === 'l' ? t('lHint') : goalText(lv);
    render();
  });
  ['pointerup', 'pointercancel'].forEach((ev) => canvas.addEventListener(ev, (e) => {
    state.drag = null;
    try { canvas.releasePointerCapture(e.pointerId); } catch { /* already released */ }
  }));

  document.querySelectorAll('[data-act]').forEach((btn) => btn.addEventListener('click', () => {
    ensureAudio();
    const act = btn.dataset.act;
    if (act === 'w-') state.shape.w -= 1;
    if (act === 'w+') state.shape.w += 1;
    if (act === 'h-') state.shape.h -= 1;
    if (act === 'h+') state.shape.h += 1;
    state.shape.w = clamp(state.shape.w, 1, currentLevel().kind === 'l' ? 9 : 12);
    state.shape.h = clamp(state.shape.h, 1, 8);
    state.shape.eh = clamp(state.shape.eh, 1, state.shape.h);
    state.message = goalText(currentLevel());
    plink(); render();
  }));

  function update(dt) {
    if (state.shake > 0) state.shake -= dt;
    state.hamsters.forEach((h) => {
      h.x += h.vx * dt; h.y += h.vy * dt; h.roll += dt * (state.opened ? 7 : 2);
      if (h.x < 0.08 || h.x > 0.92) h.vx *= -1;
      if (h.y < 0.08 || h.y > 0.92) h.vy *= -1;
      h.x = clamp(h.x, 0.08, 0.92); h.y = clamp(h.y, 0.08, 0.92);
    });
    state.particles = state.particles.filter((p) => { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 70 * dt; return p.life > 0; });
  }

  function drawBackground() {
    const g = state.grid;
    ctx.fillStyle = cssVar('--grass-2'); ctx.fillRect(0, 0, state.width, state.height);
    ctx.fillStyle = cssVar('--water');
    ctx.globalAlpha = 0.22; ctx.beginPath(); ctx.ellipse(state.width - 90, 42, 86, 28, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    for (let y = 0; y <= g.rows; y++) for (let x = 0; x <= g.cols; x++) {
      ctx.fillStyle = (x + y) % 2 ? cssVar('--grass-2') : cssVar('--card');
      ctx.globalAlpha = 0.18; ctx.fillRect(g.x + x * g.size, g.y + y * g.size, g.size, g.size); ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = cssVar('--line'); ctx.lineWidth = 1;
    for (let x = 0; x <= g.cols; x++) { line(g.x + x * g.size, g.y, g.x + x * g.size, g.y + g.rows * g.size); }
    for (let y = 0; y <= g.rows; y++) { line(g.x, g.y + y * g.size, g.x + g.cols * g.size, g.y + y * g.size); }
  }

  function drawCells() {
    const g = state.grid;
    ctx.save();
    ctx.translate(state.shake > 0 ? Math.sin(state.shake * 60) * 6 : 0, 0);
    metrics().cells.forEach((key) => {
      const [x, y] = key.split(',').map(Number);
      ctx.fillStyle = cssVar('--grass'); ctx.globalAlpha = 0.62;
      roundRect(g.x + x * g.size + 3, g.y + y * g.size + 3, g.size - 6, g.size - 6, 8); ctx.fill();
    });
    ctx.globalAlpha = 1; drawFenceEdges(); drawHandles(); drawLabels(); drawHamsters();
    ctx.restore();
  }

  function drawFenceEdges() {
    const g = state.grid, lv = currentLevel(), cells = metrics().cells;
    ctx.strokeStyle = cssVar('--fence'); ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    cells.forEach((key) => {
      const [x, y] = key.split(',').map(Number), sx = g.x + x * g.size, sy = g.y + y * g.size;
      const edge = (dx, dy) => !cells.has(`${x + dx},${y + dy}`);
      if (edge(0, -1) && !(lv.kind === 'wall' && y === 0)) rail(sx, sy, sx + g.size, sy);
      if (edge(1, 0)) rail(sx + g.size, sy, sx + g.size, sy + g.size);
      if (edge(0, 1)) rail(sx, sy + g.size, sx + g.size, sy + g.size);
      if (edge(-1, 0)) rail(sx, sy, sx, sy + g.size);
    });
    if (lv.kind === 'wall') {
      ctx.strokeStyle = cssVar('--wall'); ctx.lineWidth = 16;
      rail(g.x - 10, g.y - 4, g.x + state.shape.w * g.size + 10, g.y - 4);
      ctx.fillStyle = cssVar('--ink'); ctx.font = '900 13px ui-rounded, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(t('labels').wall, g.x + state.shape.w * g.size / 2, g.y - 20);
    }
  }
  function rail(x1, y1, x2, y2) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 2.5; ctx.stroke();
    ctx.strokeStyle = cssVar('--fence'); ctx.lineWidth = 7;
  }

  function drawHandles() {
    handles().forEach((h) => {
      const active = h.name === state.drag;
      ctx.fillStyle = active ? cssVar('--party') : cssVar('--card'); ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(h.x, h.y, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = active ? cssVar('--ink-on-accent') : cssVar('--ink'); ctx.font = '900 18px ui-rounded, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('↘', h.x, h.y);
    });
  }
  function drawLabels() {
    const g = state.grid, s = state.shape, lbl = t('labels');
    ctx.fillStyle = cssVar('--ink'); ctx.font = '900 14px ui-rounded, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`${lbl.width} ${s.w}m`, g.x + s.w * g.size / 2, g.y + s.h * g.size + 28);
    ctx.save(); ctx.translate(g.x - 30, g.y + s.h * g.size / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(`${lbl.height} ${s.h}m`, 0, 0); ctx.restore();
    if (currentLevel().kind === 'reverse') ctx.fillText(`${lbl.fixed}: ${currentLevel().area}㎡`, state.width - 105, 30);
  }
  function drawHamsters() {
    const m = metrics(), cells = Array.from(m.cells).map((k) => k.split(',').map(Number));
    if (!cells.length || !state.hamsters.length) return;
    const count = clamp(Math.ceil(m.area / (state.opened ? 4 : 8)), 2, state.opened ? 18 : 8);
    const g = state.grid;
    for (let i = 0; i < count; i++) {
      const cell = cells[i % cells.length], h = state.hamsters[i % state.hamsters.length];
      const x = g.x + (cell[0] + h.x) * g.size, y = g.y + (cell[1] + h.y) * g.size;
      ctx.save(); ctx.translate(x, y); ctx.rotate(state.opened ? Math.sin(h.roll) * 0.7 : Math.sin(h.roll) * 0.1);
      ctx.font = `${Math.max(20, g.size * 0.45)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(h.emoji, 0, 0); ctx.restore();
    }
    if (m.area <= 8) { ctx.font = '900 22px serif'; ctx.fillText('😵‍💫', g.x + (state.shape.w + 0.6) * g.size, g.y + g.size); }
  }
  function drawParticles() {
    state.particles.forEach((p, i) => {
      ctx.save(); ctx.globalAlpha = clamp(p.life / p.max, 0, 1); ctx.fillStyle = i % 2 ? cssVar('--party') : cssVar('--danger');
      ctx.translate(p.x, p.y); ctx.rotate(p.life * 6); roundRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.45, 2); ctx.fill(); ctx.restore();
    });
  }
  function line(x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  /** 每帧/每次状态变化的统一渲染入口（语言、主题切换都会调用） */
  function render() {
    const lv = currentLevel();
    const m = metrics();
    levelText.textContent = t('levelOf')(state.level + 1, LEVELS.length);
    budgetText.textContent = lv.kind === 'reverse' ? t('sqm')(lv.area) : t('meters')(lv.budget);
    usedText.textContent = t('meters')(m.perimeter);
    areaText.textContent = t('sqm')(m.area);
    happyText.textContent = happiness();
    tip.textContent = state.message || goalText(lv);
    if (lv.kind === 'wall') formulaText.textContent = t('formulaWall')(state.shape.w, state.shape.h, m.perimeter);
    else if (lv.kind === 'l') formulaText.textContent = t('formulaL')(m.area, m.perimeter);
    else if (lv.kind === 'reverse') formulaText.textContent = t('formulaReverse')(state.shape.w, state.shape.h, m.perimeter, m.area);
    else formulaText.textContent = t('formulaNormal')(state.shape.w, state.shape.h);
    openBtn.disabled = false;
    if (!ctx) return;
    drawBackground(); drawCells(); drawParticles();
  }

  function loop(now) {
    const dt = Math.min(0.05, (now - (loop.last || now)) / 1000); loop.last = now;
    update(dt); render(); requestAnimationFrame(loop);
  }

  openBtn.addEventListener('click', openPark);
  retryBtn.addEventListener('click', () => { ensureAudio(); resetLevel(); });
  nextBtn.addEventListener('click', () => { ensureAudio(); win.hidden = true; advance(); });
  againBtn.addEventListener('click', () => { ensureAudio(); win.hidden = true; resetLevel(); });
  addEventListener('resize', resize);
  addEventListener('themechange', render);

  /* ============================ 启动 ============================ */
  applyTheme();
  applyLang();
  resize();
  resetLevel();
  requestAnimationFrame(loop);
})();
