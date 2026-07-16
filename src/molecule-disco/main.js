/* ============================================================
   🪩 分子迪斯科 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '分子迪斯科 · KidsLab', back: '返回平台', title: '分子迪斯科',
      tip0: '拖动唱片滑杆：慢歌排方阵，快歌流动，拉满就飞成气体。',
      eyebrow: 'DJ 温度台 · 微观/宏观同步', heroTitle: '把分子舞客调成固、液、气',
      challenge: '当前挑战', energy: '平均动能', plateau: '相变平台', micro: '左：微观舞池', macro: '右：宏观观众席', sync: '同一个温度驱动两屏',
      dj: 'DJ 台', material: '物质', temperature: '🎚️ 温度', pressure: '🫧 按住加压包间', prev: '上一题', next: '下一题', again: '再挑战', scienceTitle: '观察提示',
      solid: '固态', liquid: '液态', gas: '气态', subliming: '升华', melting: '正在熔化…', boiling: '正在沸腾…', freezing: '正在凝固…', condensing: '正在液化…',
      water: '水', iron: '铁', chocolate: '巧克力', oxygen: '氧气', dryice: '干冰',
      meltMagic: '魔法时刻：0°C 熔点！冰块塌软，方阵同时散架。', boilMagic: '魔法时刻：100°C 沸点！分子成群起飞，宏观咕嘟冒泡。',
      pressureTip: '加压让飞舞分子靠近，气态也可能被挤回液态。', sublimationTip: '干冰彩蛋：方阵直接起飞，跳过液态，这叫升华。',
      done: '挑战完成！', winTitle: '分子舞厅全通关！', winDesc: '你已经用粒子模型同步解释固态、液态、气态和相变平台。',
      observeSolid: '低温时分子动能小，只能围着固定位置振动。', observeLiquid: '升温后分子挣脱方阵，仍然彼此靠近并能流动。', observeGas: '高温时分子运动很快，间距变大，到处飞。',
      c1: '排出固态方阵', c1d: '选择水，把温度调到 0°C 以下。',
      c2: '刚好开始熔化', c2d: '把水拖到 0°C，观察平台期和双屏闪光。',
      c3: '让水刚好沸腾', c3d: '把水拖到 100°C，舞客从液面起飞。',
      c4: '铁舞厅还是固态', c4d: '切换到铁，看看 120°C 对铁来说仍是慢歌。',
      c5: '巧克力融化派对', c5d: '切到巧克力，调到 35°C 附近让它软掉。',
      c6: '加压包间彩蛋', c6d: '在气态时按住加压，把舞客挤回液态。',
      c7: '干冰升华惊呼', c7d: '切到干冰，升温越过 -78°C，方阵直接起飞。',
    },
    en: {
      doc: 'Molecule Disco · KidsLab', back: 'Back to platform', title: 'Molecule Disco',
      tip0: 'Drag the record slider: slow song lattice, faster liquid, max speed gas.',
      eyebrow: 'DJ temperature deck · micro/macro sync', heroTitle: 'Mix molecules into solid, liquid and gas',
      challenge: 'Current challenge', energy: 'Average kinetic energy', plateau: 'Phase plateau', micro: 'Left: micro dance floor', macro: 'Right: macro audience', sync: 'One temperature drives both panels',
      dj: 'DJ deck', material: 'Material', temperature: '🎚️ Temperature', pressure: '🫧 Hold pressure room', prev: 'Previous', next: 'Next', again: 'Try again', scienceTitle: 'Watch for',
      solid: 'solid', liquid: 'liquid', gas: 'gas', subliming: 'subliming', melting: 'melting…', boiling: 'boiling…', freezing: 'freezing…', condensing: 'condensing…',
      water: 'water', iron: 'iron', chocolate: 'chocolate', oxygen: 'oxygen', dryice: 'dry ice',
      meltMagic: 'Magic moment: 0°C melting point! Ice slumps as the lattice breaks.', boilMagic: 'Magic moment: 100°C boiling point! Molecules launch as bubbles pop.',
      pressureTip: 'Pressure pushes flying molecules closer; gas can squeeze back to liquid.', sublimationTip: 'Dry ice surprise: lattice launches directly, skipping liquid. That is sublimation.',
      done: 'Challenge complete!', winTitle: 'Molecule dance floor cleared!', winDesc: 'You used a particle model to explain solids, liquids, gases and phase plateaus.',
      observeSolid: 'At low temperature, molecules have little kinetic energy and only vibrate around fixed spots.', observeLiquid: 'When warmer, molecules escape the lattice but stay close enough to flow.', observeGas: 'At high temperature, molecules move fast, spread out and fly everywhere.',
      c1: 'Make a solid lattice', c1d: 'Choose water and cool below 0°C.',
      c2: 'Start melting', c2d: 'Drag water to 0°C and watch the plateau flash.',
      c3: 'Just start boiling', c3d: 'Drag water to 100°C; dancers launch from the surface.',
      c4: 'Iron dance hall', c4d: 'Switch to iron: 120°C is still a slow song for iron.',
      c5: 'Chocolate melting party', c5d: 'Pick chocolate and warm near 35°C until it softens.',
      c6: 'Pressure-room surprise', c6d: 'While gas, hold pressure to squeeze dancers back into liquid.',
      c7: 'Dry ice sublimation gasp', c7d: 'Pick dry ice and warm past -78°C: the lattice launches directly.',
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
  // ✏️ 状态、Canvas 初始化、玩法逻辑写在这里。
  //    - 触屏：用 pointerdown/pointermove/pointerup
  //    - 画布：监听 resize 与 themechange
  //    - 音频：AudioContext 在首次用户手势里 resume()

  const $ = (s) => document.querySelector(s);
  const canvas = $('#disco');
  const ctx = canvas.getContext('2d');
  const ui = {
    temp: $('#temp'), material: $('#material'), rangeOut: $('#rangeOut'), tempRead: $('#tempRead'), stateBadge: $('#stateBadge'),
    energy: $('#energyMeter'), plateau: $('#plateauMeter'), challengeTitle: $('#challengeTitle'), challengeDesc: $('#challengeDesc'),
    science: $('#scienceText'), list: $('#challenges'), toast: $('#toast'), win: $('#win'), winTitle: $('#winTitle'), winDesc: $('#winDesc'),
    pressure: $('#pressureBtn'), prev: $('#prevBtn'), next: $('#nextBtn'), again: $('#againBtn'), stage: $('.stage-card'), tip: $('#tip'),
  };

  const MATERIALS = {
    water: { key: 'water', min: -20, max: 120, start: 20, melt: 0, boil: 100, hue: 200 },
    iron: { key: 'iron', min: 0, max: 1800, start: 120, melt: 1538, boil: 2862, hue: 20 },
    chocolate: { key: 'chocolate', min: -10, max: 80, start: 20, melt: 32, boil: 210, hue: 34 },
    oxygen: { key: 'oxygen', min: -230, max: -150, start: -190, melt: -219, boil: -183, hue: 190 },
    dryice: { key: 'dryice', min: -110, max: -20, start: -90, melt: -999, boil: -78, hue: 265, sublimates: true },
  };
  const CHALLENGES = [
    { title: 'c1', desc: 'c1d', test: () => state.material === 'water' && phase() === 'solid' },
    { title: 'c2', desc: 'c2d', test: () => state.material === 'water' && Math.abs(state.temp - 0) <= 1 && state.plateau.kind === 'melt' },
    { title: 'c3', desc: 'c3d', test: () => state.material === 'water' && Math.abs(state.temp - 100) <= 1 && state.plateau.kind === 'boil' },
    { title: 'c4', desc: 'c4d', test: () => state.material === 'iron' && state.temp < MATERIALS.iron.melt && phase() === 'solid' },
    { title: 'c5', desc: 'c5d', test: () => state.material === 'chocolate' && state.temp >= 31 && state.temp <= 45 && phase() === 'liquid' },
    { title: 'c6', desc: 'c6d', test: () => state.pressure && state.basePhase === 'gas' && phase() === 'liquid' },
    { title: 'c7', desc: 'c7d', test: () => state.material === 'dryice' && state.temp > -79 && phase() === 'gas' },
  ];

  const state = {
    w: 960, h: 540, dpr: 1, running: true, last: 0, material: 'water', temp: 20, targetTemp: 20,
    molecules: [], challenge: 0, done: new Set(), pressure: false, basePhase: 'liquid', discoSpin: 0,
    plateau: { kind: '', progress: 0, point: 0 }, crossed: {}, dragLast: 20, actx: null,
  };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function mat() { return MATERIALS[state.material]; }
  function normTemp() { const m = mat(); return clamp((state.temp - m.min) / (m.max - m.min), 0, 1); }
  function phase(ignorePressure = false) {
    const m = mat();
    let p;
    if (m.sublimates) p = state.temp < m.boil ? 'solid' : 'gas';
    else if (state.temp < m.melt) p = 'solid';
    else if (state.temp < m.boil) p = 'liquid';
    else p = 'gas';
    state.basePhase = p;
    if (!ignorePressure && state.pressure && p === 'gas') return 'liquid';
    return p;
  }
  function displayPhase() {
    if (state.plateau.kind === 'melt') return t('melting');
    if (state.plateau.kind === 'boil') return t('boiling');
    const p = phase();
    if (mat().sublimates && p === 'gas' && state.temp > mat().boil) return t('subliming');
    return t(p);
  }

  function resetMolecules() {
    state.molecules = [];
    const cols = 8, rows = 6;
    const left = state.w * 0.06, top = state.h * 0.23, cell = Math.min(state.w * 0.035, state.h * 0.062);
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const ax = left + x * cell * 1.18 + (y % 2) * cell * 0.18;
      const ay = top + y * cell * 1.12;
      state.molecules.push({ x: ax, y: ay, vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4), ax, ay, r: Math.max(9, cell * 0.34), face: Math.random() });
    }
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    state.dpr = Math.min(devicePixelRatio || 1, 2);
    state.w = Math.max(320, Math.floor(box.width)); state.h = Math.max(300, Math.floor(box.height));
    canvas.width = Math.floor(state.w * state.dpr); canvas.height = Math.floor(state.h * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    resetMolecules(); render();
  }

  function configureMaterial() {
    const m = mat();
    ui.temp.min = String(m.min); ui.temp.max = String(m.max); ui.temp.step = state.material === 'iron' ? '5' : '1';
    state.temp = m.start; state.targetTemp = m.start; ui.temp.value = String(m.start);
    ui.rangeOut.textContent = `${m.min}°C — ${m.max}°C`;
    state.plateau = { kind: '', progress: 0, point: 0 }; state.crossed = {};
    resetMolecules(); render();
  }

  function snapInput(raw) {
    const m = mat();
    let v = raw;
    const points = m.sublimates ? [{ p: m.boil, k: 'boil' }] : [{ p: m.melt, k: 'melt' }, { p: m.boil, k: 'boil' }];
    for (const point of points) {
      const radius = Math.max(2, (m.max - m.min) * 0.025);
      if (Math.abs(raw - point.p) <= radius && !state.crossed[point.k]) {
        v = point.p; state.plateau = { kind: point.k, progress: 0.01, point: point.p };
        if (point.k === 'melt' && state.material === 'water') magic(t('meltMagic'));
        if (point.k === 'boil' && state.material === 'water') magic(t('boilMagic'));
        state.crossed[point.k] = true;
        break;
      }
    }
    state.targetTemp = raw; state.temp = v; ui.temp.value = String(Math.round(v));
    scratch(raw - state.dragLast); state.dragLast = raw; render();
  }

  function update(dt) {
    const m = mat();
    if (state.plateau.kind) {
      state.plateau.progress = clamp(state.plateau.progress + dt / 1.7, 0, 1);
      state.temp = state.plateau.point;
      if (state.plateau.progress >= 1 && Math.abs(state.targetTemp - state.plateau.point) > 1) {
        state.temp = clamp(state.targetTemp, m.min, m.max); state.plateau = { kind: '', progress: 0, point: 0 };
      }
    }
    const p = phase();
    const speed = 0.25 + normTemp() * 5.5 + (p === 'gas' ? 2 : 0);
    const bounds = { l: state.w * 0.04, r: state.w * 0.48, t: state.h * 0.14, b: state.h * 0.82 };
    state.molecules.forEach((mo, i) => {
      if (p === 'solid') {
        const wobble = Math.sin(performance.now() / 180 + i) * (2 + speed);
        mo.x += (mo.ax + wobble - mo.x) * 0.18;
        mo.y += (mo.ay + Math.cos(performance.now() / 210 + i) * (2 + speed * 0.5) - mo.y) * 0.18;
        mo.vx *= 0.85; mo.vy *= 0.85;
      } else if (p === 'liquid') {
        mo.vy += 0.02 * speed; mo.vx += rand(-0.06, 0.06) * speed; mo.vy += rand(-0.08, 0.08) * speed;
        for (let j = i + 1; j < state.molecules.length; j++) {
          const other = state.molecules[j], dx = mo.x - other.x, dy = mo.y - other.y, d2 = dx * dx + dy * dy;
          if (d2 > 0 && d2 < 750) { const f = (750 - d2) / 750 * 0.035; mo.vx += dx * f; mo.vy += dy * f; other.vx -= dx * f; other.vy -= dy * f; }
        }
        mo.x += mo.vx; mo.y += mo.vy;
        if (mo.x < bounds.l || mo.x > bounds.r) mo.vx *= -0.75;
        if (mo.y < bounds.t + state.h * 0.20) mo.vy += 0.5;
        if (mo.y > bounds.b) { mo.y = bounds.b; mo.vy *= -0.55; }
        mo.x = clamp(mo.x, bounds.l, bounds.r);
      } else {
        mo.vx += rand(-0.08, 0.08) * speed; mo.vy += rand(-0.08, 0.08) * speed - 0.012 * speed;
        mo.x += mo.vx; mo.y += mo.vy;
        if (mo.x < bounds.l || mo.x > bounds.r) mo.vx *= -1;
        if (mo.y < bounds.t) { mo.y = bounds.b - rand(0, 25); mo.x = rand(bounds.l, bounds.r); }
        if (mo.y > bounds.b) mo.vy *= -1;
        mo.x = clamp(mo.x, bounds.l, bounds.r); mo.y = clamp(mo.y, bounds.t, bounds.b);
      }
      mo.vx = clamp(mo.vx, -7, 7); mo.vy = clamp(mo.vy, -7, 7);
    });
    state.discoSpin += dt * (0.8 + normTemp() * 7);
    checkChallenge();
  }

  function checkChallenge() {
    const ch = CHALLENGES[state.challenge];
    if (!state.done.has(state.challenge) && ch.test()) {
      state.done.add(state.challenge); toast(t('done'));
      if (state.done.size === CHALLENGES.length) setTimeout(showWin, 500);
      render();
    }
  }
  function showWin() { ui.winTitle.textContent = t('winTitle'); ui.winDesc.textContent = t('winDesc'); ui.win.hidden = false; }
  function magic(msg) { ui.stage.classList.add('flash'); setTimeout(() => ui.stage.classList.remove('flash'), 900); toast(msg, 3300); }
  function toast(msg, ms = 1500) { ui.toast.textContent = msg; ui.toast.hidden = false; clearTimeout(toast.id); toast.id = setTimeout(() => { ui.toast.hidden = true; }, ms); }

  function draw() {
    const w = state.w, h = state.h, ink = cssVar('--line-strong'), card = cssVar('--card'), paper = cssVar('--paper-2'), accent = cssVar('--accent'), accent2 = cssVar('--accent-2'), white = cssVar('--white-ink'), soft = cssVar('--ink-soft');
    const bg = ctx.createLinearGradient(0, 0, w, h); bg.addColorStop(0, cssVar('--sky-a')); bg.addColorStop(1, cssVar('--sky-b')); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = ink; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(w * 0.52, h * 0.08); ctx.lineTo(w * 0.52, h * 0.88); ctx.stroke(); ctx.setLineDash([]);
    drawPanel(18, h * 0.08, w * 0.48, h * 0.80, lang === 'zh' ? '微观舞池' : 'Micro dance floor');
    drawPanel(w * 0.55, h * 0.08, w * 0.40, h * 0.80, lang === 'zh' ? '宏观观众席' : 'Macro view');
    drawDiscoBall(w * 0.27, h * 0.13, accent, accent2, ink);
    drawMolecules(ink, accent, accent2, white);
    drawMacro(ink, card, paper, accent, accent2, white, soft);
  }
  function drawPanel(x, y, w, h, label) {
    ctx.fillStyle = cssVar('--card'); ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, w, h, 22); ctx.fill(); ctx.stroke();
    ctx.fillStyle = cssVar('--ink-soft'); ctx.font = `900 13px ${cssVar('--font')}`; ctx.fillText(label, x + 16, y + 26);
  }
  function drawDiscoBall(x, y, a, b, ink) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(state.discoSpin); ctx.fillStyle = a; ctx.strokeStyle = ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = b; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(-25, i * 9); ctx.lineTo(25, i * 9); ctx.stroke(); ctx.beginPath(); ctx.moveTo(i * 9, -25); ctx.lineTo(i * 9, 25); ctx.stroke(); } ctx.restore();
  }
  function drawMolecules(ink, accent, accent2, white) {
    const p = phase();
    state.molecules.forEach((mo, i) => {
      ctx.save(); ctx.translate(mo.x, mo.y); ctx.rotate(Math.sin(performance.now() / 240 + i) * 0.08);
      ctx.fillStyle = p === 'solid' ? accent2 : p === 'liquid' ? cssVar('--water') : accent;
      ctx.strokeStyle = ink; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(0, 0, mo.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = ink; const excited = normTemp() > 0.72;
      ctx.beginPath(); ctx.arc(-mo.r * 0.32, -mo.r * 0.18, 1.8, 0, Math.PI * 2); ctx.arc(mo.r * 0.32, -mo.r * 0.18, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = ink; ctx.lineWidth = 1.8; ctx.beginPath();
      if (p === 'solid') ctx.arc(0, mo.r * 0.26, mo.r * 0.28, Math.PI * 1.1, Math.PI * 1.9);
      else if (excited) ctx.arc(0, mo.r * 0.13, mo.r * 0.32, 0, Math.PI);
      else { ctx.moveTo(-mo.r * 0.28, mo.r * 0.25); ctx.quadraticCurveTo(0, mo.r * 0.40, mo.r * 0.28, mo.r * 0.25); }
      ctx.stroke();
      ctx.fillStyle = white; ctx.fillRect(-mo.r * 0.55, -mo.r * 0.35, mo.r * 0.42, mo.r * 0.18); ctx.fillRect(mo.r * 0.13, -mo.r * 0.35, mo.r * 0.42, mo.r * 0.18);
      ctx.restore();
    });
  }
  function drawMacro(ink, card, paper, accent, accent2, white, soft) {
    const x = state.w * 0.60, y = state.h * 0.25, w = state.w * 0.30, h = state.h * 0.42, p = phase();
    ctx.strokeStyle = ink; ctx.lineWidth = 3;
    ctx.fillStyle = paper; ctx.beginPath(); ctx.roundRect(x, y + h * 0.55, w, h * 0.28, 18); ctx.fill(); ctx.stroke();
    if (p === 'solid') {
      const slump = mat().sublimates ? 0 : clamp((state.temp - mat().melt + 8) / 14, 0, 1);
      ctx.fillStyle = state.material === 'chocolate' ? cssVar('--soil') : white;
      ctx.beginPath(); ctx.roundRect(x + w * 0.18, y + h * (0.22 + slump * 0.18), w * 0.64, h * (0.42 - slump * 0.08), 8 + slump * 28); ctx.fill(); ctx.stroke();
      ctx.fillStyle = accent2; ctx.font = `900 ${Math.max(24, state.w * 0.04)}px ${cssVar('--font')}`; ctx.fillText('🧊', x + w * 0.38, y + h * 0.47);
    } else if (p === 'liquid') {
      ctx.fillStyle = state.material === 'chocolate' ? cssVar('--soil') : cssVar('--water');
      ctx.beginPath(); ctx.moveTo(x + w * 0.12, y + h * 0.55); for (let i = 0; i <= 12; i++) ctx.lineTo(x + w * (0.12 + i * 0.064), y + h * (0.55 + Math.sin(performance.now() / 220 + i) * 0.025)); ctx.lineTo(x + w * 0.90, y + h * 0.78); ctx.lineTo(x + w * 0.12, y + h * 0.78); ctx.closePath(); ctx.fill(); ctx.stroke();
      for (let i = 0; i < 6; i++) { ctx.fillStyle = white; ctx.beginPath(); ctx.arc(x + w * (0.22 + i * 0.10), y + h * (0.48 - Math.sin(performance.now() / 300 + i) * 0.10), 5 + i % 2, 0, Math.PI * 2); ctx.fill(); }
    } else {
      for (let i = 0; i < 14; i++) { ctx.save(); ctx.globalAlpha = 0.35 + (i % 3) * 0.13; ctx.fillStyle = white; ctx.beginPath(); ctx.ellipse(x + w * (0.18 + (i % 5) * 0.15), y + h * (0.14 + ((performance.now() / 900 + i * 0.17) % 0.7)), 12, 22, Math.sin(i), 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      ctx.fillStyle = accent; ctx.font = `900 ${Math.max(24, state.w * 0.04)}px ${cssVar('--font')}`; ctx.fillText('💨', x + w * 0.35, y + h * 0.45);
    }
    if (state.plateau.kind) { ctx.fillStyle = accent; ctx.font = `900 18px ${cssVar('--font')}`; const label = state.plateau.kind === 'melt' ? `${mat().melt}°C` : `${mat().boil}°C`; ctx.fillText(label, x + w * 0.32, y + h * 0.08); }
    ctx.fillStyle = soft; ctx.font = `900 13px ${cssVar('--font')}`; ctx.fillText(`${t(mat().key)} · ${displayPhase()}`, x + 18, y + h * 0.94);
  }

  function loop(now) {
    if (!state.running) { state.last = now; requestAnimationFrame(loop); return; }
    const dt = Math.min(0.04, (now - state.last) / 1000 || 0.016); state.last = now;
    update(dt); updateLiveUi(); draw(); requestAnimationFrame(loop);
  }

  function render() {
    if (!ui.tempRead) return;
    updateLiveUi();
    ui.challengeTitle.textContent = t(CHALLENGES[state.challenge].title); ui.challengeDesc.textContent = t(CHALLENGES[state.challenge].desc);
    ui.list.innerHTML = CHALLENGES.map((c, i) => `<li class="${i === state.challenge ? 'on' : ''}${state.done.has(i) ? ' done' : ''}">${state.done.has(i) ? '✓ ' : ''}${t(c.title)}</li>`).join('');
    ui.material.innerHTML = Object.keys(MATERIALS).map((k) => `<option value="${k}" ${k === state.material ? 'selected' : ''}>${t(k)}</option>`).join('');
    draw();
  }

  function updateLiveUi() {
    const m = mat();
    ui.tempRead.textContent = `${Math.round(state.temp)}°C`; ui.stateBadge.textContent = displayPhase();
    ui.energy.value = Math.round(normTemp() * 100); ui.plateau.value = Math.round((state.plateau.progress || 0) * 100);
    const p = phase();
    ui.science.textContent = state.pressure ? t('pressureTip') : m.sublimates ? t('sublimationTip') : p === 'solid' ? t('observeSolid') : p === 'liquid' ? t('observeLiquid') : t('observeGas');
    ui.tip.textContent = state.plateau.kind ? displayPhase() : t('tip0');
    ui.rangeOut.textContent = `${m.min}°C — ${m.max}°C`;
    ui.pressure.classList.toggle('active', state.pressure);
  }

  function scratch(delta) {
    if (!delta) return;
    try {
      state.actx = state.actx || new (window.AudioContext || window.webkitAudioContext)();
      if (state.actx.state === 'suspended') state.actx.resume();
      const o = state.actx.createOscillator(); const g = state.actx.createGain();
      o.type = 'square'; o.frequency.value = 110 + Math.min(650, Math.abs(delta) * 18);
      g.gain.value = Math.min(0.035, Math.abs(delta) / 900); o.connect(g).connect(state.actx.destination); o.start(); o.stop(state.actx.currentTime + 0.035);
    } catch { /* audio optional */ }
  }

  ui.temp.addEventListener('input', () => snapInput(Number(ui.temp.value)));
  ui.material.addEventListener('change', () => { state.material = ui.material.value; configureMaterial(); });
  ui.pressure.addEventListener('pointerdown', (e) => { ui.pressure.setPointerCapture(e.pointerId); state.pressure = true; render(); });
  ui.pressure.addEventListener('pointerup', () => { state.pressure = false; render(); });
  ui.pressure.addEventListener('pointercancel', () => { state.pressure = false; render(); });
  ui.prev.addEventListener('click', () => { state.challenge = (state.challenge + CHALLENGES.length - 1) % CHALLENGES.length; render(); });
  ui.next.addEventListener('click', () => { state.challenge = (state.challenge + 1) % CHALLENGES.length; render(); });
  ui.again.addEventListener('click', () => { ui.win.hidden = true; state.done.clear(); state.challenge = 0; state.material = 'water'; configureMaterial(); });
  canvas.addEventListener('pointerdown', (e) => { canvas.setPointerCapture(e.pointerId); const r = canvas.getBoundingClientRect(); const ratio = clamp((e.clientX - r.left) / r.width, 0, 1); const m = mat(); snapInput(Math.round(m.min + ratio * (m.max - m.min))); });
  document.addEventListener('visibilitychange', () => { state.running = !document.hidden; });
  addEventListener('resize', resize);
  addEventListener('themechange', resize);

  /* ============================ 启动 ============================ */
  Object.keys(MATERIALS).forEach((k) => { const opt = document.createElement('option'); opt.value = k; opt.textContent = t(k); ui.material.appendChild(opt); });
  resize(); configureMaterial(); requestAnimationFrame(loop);
  applyTheme();
  applyLang();
})();
