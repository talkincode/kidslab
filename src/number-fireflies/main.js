/* ============================================================
   数字萤火虫 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '数字萤火虫 · KidsLab',
      back: '返回平台',
      title: '数字萤火虫',
      tip0: '用手指画圈套住萤火虫，数字加起来等于灯笼就会点亮森林！',
      lantern: '灯笼目标', modeAdd: '圈住相加正好等于它', modeSub: '圈住要放走的多余光点', modeRain: '萤火虫雨：连抓目标数',
      level: '关卡', forest: '森林亮度', timer: '时间', start: '开始发光', retry: '重来本关', next: '下一关 →', again: '再玩一次',
      infinite: '∞', seconds: (n) => `${n}秒`, levelOf: (a, b) => `${a}/${b}`, percent: (n) => `${n}%`,
      addTarget: (n) => `${n}`, subTarget: (a, b) => `${a}−?=${b}`, rainTarget: (n, c, total) => `${n} × ${c}/${total}`,
      startTip: '萤火虫醒啦！从最亮、最慢的开始圈。',
      miss: (sum, target) => `圈到 ${sum}，灯笼想要 ${target}。萤火虫做了个鬼脸：再试试！`,
      subMiss: (sum, target) => `放走 ${sum} 还不对，漏光需要放走 ${target}。`,
      rainMiss: (sum, target) => `雨里抓到 ${sum}，目标是 ${target}，马上再圈！`,
      success: (sum) => `正好 ${sum}！光飞进灯笼，森林亮了一段。`,
      makeTen: '7+3 变成小太阳！凑十法触发超级光爆 ✨',
      makeTenAny: '凑成 10！两只萤火虫跳了上扬光舞 ✨',
      rainNeed: (left) => `萤火虫雨还差 ${left} 次，稳稳圈住目标！`,
      winTitle: '森林亮起来啦！', winDesc: (name, stars) => `${name} 完成！获得 ${stars} 颗星。`,
      allTitle: '整片森林发光啦！', allDesc: '你掌握了凑十、分解和放走多余数的魔法。',
      levels: ['暖黄小路', '十的灯谜', '小太阳传说', '十二星洞', '漏光灯笼', '二十瀑布', '快手凑十', '萤火虫雨'],
      formulas: { add: '相加', sub: '放走', rain: '连抓' },
      sillyFace: '>:P',
    },
    en: {
      doc: 'Number Fireflies · KidsLab',
      back: 'Back to platform', title: 'Number Fireflies',
      tip0: 'Draw a loop around fireflies. If their numbers match the lantern, the forest lights up!',
      lantern: 'Lantern target', modeAdd: 'Lasso numbers that add to it', modeSub: 'Lasso the extra light to let go', modeRain: 'Firefly rain: catch target sets',
      level: 'Level', forest: 'Forest glow', timer: 'Time', start: 'Start glowing', retry: 'Retry level', next: 'Next level →', again: 'Play again',
      infinite: '∞', seconds: (n) => `${n}s`, levelOf: (a, b) => `${a}/${b}`, percent: (n) => `${n}%`,
      addTarget: (n) => `${n}`, subTarget: (a, b) => `${a}−?=${b}`, rainTarget: (n, c, total) => `${n} × ${c}/${total}`,
      startTip: 'The fireflies woke up! Start with the bright slow ones.',
      miss: (sum, target) => `You caught ${sum}; the lantern wants ${target}. Silly faces — try again!`,
      subMiss: (sum, target) => `Letting go ${sum} is not enough; the leak needs ${target}.`,
      rainMiss: (sum, target) => `Rain catch was ${sum}; target is ${target}. Loop again!`,
      success: (sum) => `Exactly ${sum}! Light flies into the lantern and brightens the forest.`,
      makeTen: '7+3 became a tiny sun! Make-ten super burst ✨',
      makeTenAny: 'Made 10! The pair danced an upward sparkle ✨',
      rainNeed: (left) => `${left} rain catches to go. Keep circling!`,
      winTitle: 'The forest is glowing!', winDesc: (name, stars) => `${name} complete! You earned ${stars} stars.`,
      allTitle: 'The whole forest shines!', allDesc: 'You mastered make-ten, number bonds, and letting extra numbers go.',
      levels: ['Amber Path', 'Ten Riddle', 'Tiny Sun Tale', 'Twelve Cave', 'Leaky Lantern', 'Twenty Falls', 'Speedy Tens', 'Firefly Rain'],
      formulas: { add: 'sum', sub: 'release', rain: 'streak' },
      sillyFace: '>:P',
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
  const targetText = document.getElementById('targetText');
  const modeText = document.getElementById('modeText');
  const levelText = document.getElementById('levelText');
  const lightText = document.getElementById('lightText');
  const timeText = document.getElementById('timeText');
  const startBtn = document.getElementById('startBtn');
  const retryBtn = document.getElementById('retryBtn');
  const win = document.getElementById('win');
  const winEmoji = document.getElementById('winEmoji');
  const winTitle = document.getElementById('winTitle');
  const winDesc = document.getElementById('winDesc');
  const nextBtn = document.getElementById('nextBtn');
  const againBtn = document.getElementById('againBtn');

  const LEVELS = [
    { type: 'add', target: 5, lights: 2, nums: [1, 2, 3, 4, 1, 2, 5] },
    { type: 'add', target: 10, lights: 2, nums: [6, 4, 8, 2, 5, 5, 1, 9] },
    { type: 'add', target: 10, lights: 3, nums: [7, 3, 6, 2, 4, 8, 1, 5], magic: true },
    { type: 'add', target: 12, lights: 3, nums: [9, 3, 7, 5, 8, 4, 6, 6, 2] },
    { type: 'sub', start: 12, result: 8, lights: 3, nums: [4, 3, 5, 2, 7, 1, 6, 8] },
    { type: 'add', target: 20, lights: 3, nums: [9, 8, 7, 6, 5, 4, 3, 2, 1, 9] },
    { type: 'add', target: 10, lights: 4, nums: [7, 3, 6, 4, 8, 2, 9, 1, 5, 5] },
    { type: 'rain', target: 10, need: 4, seconds: 32, lights: 4, nums: [7, 3, 6, 4, 8, 2, 9, 1, 5, 5, 1, 2] },
  ];

  const state = {
    level: 0, running: false, width: 1, height: 1, dpr: 1, fireflies: [], particles: [], bursts: [], lasso: [], drawing: false,
    progress: 0, catches: 0, startedAt: 0, now: 0, last: 0, shakeUntil: 0, magicSeen: false, message: '', stars: 3,
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
  const successSound = () => [523, 659, 784].forEach((f, i) => tone(f, 0.14, 'sine', 0.12, i * 0.055));
  const missSound = () => [220, 196].forEach((f, i) => tone(f, 0.11, 'triangle', 0.08, i * 0.06));
  const tenSound = () => [392, 494, 587, 784, 988].forEach((f, i) => tone(f, 0.17, 'sine', 0.14, i * 0.045));

  function currentLevel() { return LEVELS[state.level]; }
  function levelName() { return t('levels')[state.level]; }
  function neededSum(lv = currentLevel()) { return lv.type === 'sub' ? lv.start - lv.result : lv.target; }
  function rand(min, max) { return min + Math.random() * (max - min); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function resetLevel() {
    const lv = currentLevel();
    state.running = false;
    state.fireflies = [];
    state.particles = [];
    state.bursts = [];
    state.lasso = [];
    state.progress = 0;
    state.catches = 0;
    state.startedAt = performance.now();
    state.last = performance.now();
    state.message = t('tip0');
    state.stars = 3;
    makeFireflies(lv.nums);
    win.hidden = true;
    render();
  }

  function makeFireflies(nums) {
    const w = state.width || canvas.clientWidth;
    const h = state.height || canvas.clientHeight;
    state.fireflies = nums.map((n, i) => ({
      id: `${Date.now()}-${i}`, n, x: rand(70, Math.max(80, w - 70)), y: rand(105, Math.max(120, h - 125)),
      vx: rand(-24, 24), vy: rand(-18, 18), r: rand(21, 27), phase: rand(0, Math.PI * 2), flap: rand(0, 1),
      selected: false, happy: 0, shake: 0, ghost: false, spiral: null,
    }));
  }

  function startGame() {
    ensureAudio();
    state.running = true;
    state.startedAt = performance.now();
    state.last = state.startedAt;
    state.message = t('startTip');
    render();
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    state.width = Math.max(320, rect.width);
    state.height = Math.max(360, rect.height);
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    state.fireflies.forEach((f) => { f.x = clamp(f.x, 45, state.width - 45); f.y = clamp(f.y, 80, state.height - 95); });
    render();
  }

  function pointerPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (state.width / r.width), y: (e.clientY - r.top) * (state.height / r.height) };
  }
  canvas.addEventListener('pointerdown', (e) => {
    ensureAudio();
    if (!state.running) startGame();
    canvas.setPointerCapture(e.pointerId);
    state.drawing = true;
    state.lasso = [pointerPos(e)];
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!state.drawing) return;
    const p = pointerPos(e);
    const last = state.lasso[state.lasso.length - 1];
    if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 5) state.lasso.push(p);
  });
  ['pointerup', 'pointercancel'].forEach((ev) => canvas.addEventListener(ev, (e) => {
    if (!state.drawing) return;
    state.drawing = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    judgeLasso();
  }));

  function pointInPoly(p, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      const cross = ((a.y > p.y) !== (b.y > p.y)) && (p.x < (b.x - a.x) * (p.y - a.y) / ((b.y - a.y) || 1) + a.x);
      if (cross) inside = !inside;
    }
    return inside;
  }

  function judgeLasso() {
    if (state.lasso.length < 8) { state.lasso = []; return; }
    const chosen = state.fireflies.filter((f) => !f.ghost && pointInPoly(f, state.lasso));
    const sum = chosen.reduce((a, f) => a + f.n, 0);
    const target = neededSum();
    const lv = currentLevel();
    if (chosen.length && sum === target) {
      const tenPair = sum === 10 && chosen.length === 2;
      chosen.forEach((f, i) => launchFirefly(f, i, chosen.length, tenPair));
      state.progress += 1;
      state.catches += 1;
      state.message = tenPair ? makeTenText(chosen) : t('success')(sum);
      makeBurst(avg(chosen), tenPair ? 95 : 55, tenPair);
      if (tenPair) tenSound(); else successSound();
      setTimeout(() => refillIfNeeded(chosen), 450);
      const need = lv.type === 'rain' ? lv.need : lv.lights;
      if (state.progress >= need) setTimeout(completeLevel, 850);
      else if (lv.type === 'rain') state.message = t('rainNeed')(need - state.progress);
    } else {
      chosen.forEach((f) => { f.shake = 0.55; });
      state.shakeUntil = performance.now() + 450;
      state.stars = Math.max(1, state.stars - 1);
      state.message = lv.type === 'sub' ? t('subMiss')(sum, target) : lv.type === 'rain' ? t('rainMiss')(sum, target) : t('miss')(sum, target);
      missSound();
    }
    state.lasso = [];
    render();
  }

  function makeTenText(chosen) {
    const nums = chosen.map((f) => f.n).sort((a, b) => b - a).join('+');
    if (nums === '7+3' && !state.magicSeen) { state.magicSeen = true; return t('makeTen'); }
    return t('makeTenAny');
  }
  function avg(list) { return { x: list.reduce((s, f) => s + f.x, 0) / list.length, y: list.reduce((s, f) => s + f.y, 0) / list.length }; }

  function launchFirefly(f, idx, total, tenPair) {
    const center = { x: state.width * 0.5, y: 58 };
    f.ghost = true;
    f.spiral = { start: performance.now(), idx, total, sx: f.x, sy: f.y, tx: center.x + (idx - (total - 1) / 2) * 16, ty: center.y, tenPair };
    for (let i = 0; i < 12; i++) state.particles.push({ x: f.x, y: f.y, vx: rand(-60, 60), vy: rand(-70, 40), life: rand(0.35, 0.75), max: 0.75, size: rand(2, 5), hot: tenPair });
  }
  function makeBurst(p, count, hot) {
    state.bursts.push({ x: p.x, y: p.y, age: 0, hot });
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2), sp = rand(40, hot ? 240 : 150);
      state.particles.push({ x: p.x, y: p.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rand(0.5, hot ? 1.3 : 0.9), max: 1.3, size: rand(2, hot ? 7 : 5), hot });
    }
  }
  function refillIfNeeded(chosen) {
    const lv = currentLevel();
    chosen.forEach((f) => {
      if (lv.type === 'rain') {
        f.ghost = false; f.spiral = null; f.n = lv.nums[(Math.random() * lv.nums.length) | 0]; f.x = rand(55, state.width - 55); f.y = -30; f.vy = rand(24, 48);
      }
    });
  }

  function completeLevel() {
    state.running = false;
    const last = state.level === LEVELS.length - 1;
    win.hidden = false;
    winEmoji.textContent = last ? '🌌' : '🌟';
    winTitle.textContent = last ? t('allTitle') : t('winTitle');
    winDesc.textContent = last ? t('allDesc') : t('winDesc')(levelName(), state.stars);
    nextBtn.textContent = last ? t('again') : t('next');
    for (let i = 0; i < 80; i++) state.particles.push({ x: rand(0, state.width), y: rand(10, state.height * 0.45), vx: rand(-30, 30), vy: rand(-30, 80), life: rand(0.8, 1.8), max: 1.8, size: rand(2, 6), hot: true });
  }

  function advance() {
    state.level = (state.level + 1) % LEVELS.length;
    resetLevel();
    startGame();
  }

  function update(dt, now) {
    const lv = currentLevel();
    if (state.running && lv.type === 'rain') {
      const left = lv.seconds - Math.floor((now - state.startedAt) / 1000);
      if (left <= 0) { state.progress = 0; state.message = t('rainMiss')(0, lv.target); state.startedAt = now; state.stars = Math.max(1, state.stars - 1); }
    }
    state.fireflies.forEach((f) => {
      f.phase += dt * 2.2; f.flap += dt * 8;
      if (f.shake > 0) f.shake -= dt;
      if (f.spiral) {
        const p = clamp((now - f.spiral.start) / 760, 0, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const angle = p * Math.PI * 4 + f.spiral.idx * Math.PI;
        const rad = (1 - p) * (f.spiral.tenPair ? 72 : 45);
        f.x = f.spiral.sx + (f.spiral.tx - f.spiral.sx) * ease + Math.cos(angle) * rad;
        f.y = f.spiral.sy + (f.spiral.ty - f.spiral.sy) * ease + Math.sin(angle) * rad;
        if (p >= 1 && f.spiral) { f.spiral = null; }
        return;
      }
      if (f.ghost) return;
      f.x += f.vx * dt + Math.sin(f.phase) * 0.35;
      f.y += f.vy * dt + Math.cos(f.phase * 0.7) * 0.3;
      if (lv.type === 'rain') f.vy += dt * 4;
      if (f.x < 40 || f.x > state.width - 40) f.vx *= -1;
      if (f.y < 75 || f.y > state.height - 75) f.vy *= -1;
      if (lv.type === 'rain' && f.y > state.height + 40) { f.y = -30; f.x = rand(50, state.width - 50); f.vy = rand(28, 55); }
      f.x = clamp(f.x, 35, state.width - 35);
      if (lv.type !== 'rain') f.y = clamp(f.y, 85, state.height - 90);
    });
    state.particles = state.particles.filter((p) => {
      p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 50 * dt; return p.life > 0;
    });
    state.bursts = state.bursts.filter((b) => { b.age += dt; return b.age < 0.8; });
  }

  function drawBackground() {
    const w = state.width, h = state.height;
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, cssVar('--sky-top')); sky.addColorStop(1, cssVar('--sky-bottom'));
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    ctx.save(); ctx.globalAlpha = 0.75; ctx.fillStyle = cssVar('--glow');
    for (let i = 0; i < 32; i++) {
      const x = (i * 97 + 43) % w, y = 28 + ((i * 53) % Math.max(1, h * 0.45));
      ctx.beginPath(); ctx.arc(x, y, 1.2 + (i % 3), 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    drawLanternGlow();
    drawForest();
  }
  function drawLanternGlow() {
    const x = state.width * 0.5, y = 55;
    const g = ctx.createRadialGradient(x, y, 10, x, y, 150);
    g.addColorStop(0, cssVar('--glow')); g.addColorStop(1, cssVar('--clear'));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 150, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 2.5; ctx.fillStyle = cssVar('--accent');
    roundRect(x - 54, y - 26, 108, 72, 24); ctx.fill(); ctx.stroke();
    ctx.fillStyle = cssVar('--ink-on-accent'); ctx.font = '900 24px ui-rounded, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(targetText.textContent, x, y + 8);
  }
  function drawForest() {
    const w = state.width, h = state.height, base = h - 58;
    ctx.fillStyle = cssVar('--forest');
    ctx.beginPath(); ctx.moveTo(0, h);
    for (let x = 0; x <= w + 30; x += 30) {
      const peak = base - 28 - ((x * 17) % 36);
      ctx.lineTo(x, peak); ctx.lineTo(x + 18, h);
    }
    ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    const lv = currentLevel();
    const max = lv.type === 'rain' ? lv.need : lv.lights;
    const lit = clamp(state.progress / max, 0, 1) * w;
    ctx.save(); ctx.beginPath(); ctx.rect(0, base - 75, lit, 130); ctx.clip(); ctx.fillStyle = cssVar('--forest-lit'); ctx.globalAlpha = 0.85; ctx.fill(); ctx.restore();
    ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 2.5; ctx.strokeRect(14, h - 30, w - 28, 14);
    ctx.fillStyle = cssVar('--glow'); ctx.fillRect(17, h - 27, Math.max(0, w - 34) * clamp(state.progress / max, 0, 1), 8);
  }
  function drawFirefly(f) {
    const shake = f.shake > 0 ? Math.sin(f.shake * 70) * 5 : 0;
    const x = f.x + shake, y = f.y;
    ctx.save(); ctx.globalAlpha = f.ghost && !f.spiral ? 0.08 : 1;
    const halo = ctx.createRadialGradient(x, y, 4, x, y, f.r * 2.5);
    halo.addColorStop(0, cssVar('--glow')); halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x, y, f.r * 2.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = cssVar('--panel'); ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 2.2;
    const flap = Math.sin(f.flap) * 8;
    ctx.beginPath(); ctx.ellipse(x - 14, y - 8, 14, 8 + flap * 0.15, -0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x + 14, y - 8, 14, 8 - flap * 0.15, 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = cssVar('--glow'); ctx.beginPath(); ctx.arc(x, y, f.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = cssVar('--ink-on-accent'); ctx.font = `900 ${Math.max(18, f.r)}px ui-rounded, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(f.n), x, y + 1);
    if (f.shake > 0) { ctx.fillStyle = cssVar('--ink'); ctx.font = '900 20px ui-rounded, sans-serif'; ctx.fillText(t('sillyFace'), x, y - f.r - 13); }
    ctx.restore();
  }
  function drawLasso() {
    if (!state.lasso.length) return;
    ctx.save(); ctx.strokeStyle = cssVar('--lasso'); ctx.fillStyle = cssVar('--glow'); ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath(); state.lasso.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
    if (!state.drawing && state.lasso.length > 2) { ctx.globalAlpha = 0.12; ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  function drawParticles() {
    state.bursts.forEach((b) => {
      ctx.save(); ctx.globalAlpha = 1 - b.age / 0.8; ctx.strokeStyle = cssVar('--glow'); ctx.lineWidth = b.hot ? 8 : 4; ctx.beginPath(); ctx.arc(b.x, b.y, 25 + b.age * 180, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    });
    state.particles.forEach((p) => {
      ctx.save(); ctx.globalAlpha = clamp(p.life / p.max, 0, 1); ctx.fillStyle = p.hot ? cssVar('--accent') : cssVar('--glow'); ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    });
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  /** 每帧/每次状态变化的统一渲染入口（语言、主题切换都会调用） */
  function render() {
    const lv = currentLevel();
    levelText.textContent = t('levelOf')(state.level + 1, LEVELS.length);
    const max = lv.type === 'rain' ? lv.need : lv.lights;
    lightText.textContent = t('percent')(Math.round(clamp(state.progress / max, 0, 1) * 100));
    if (lv.type === 'sub') { targetText.textContent = t('subTarget')(lv.start, lv.result); modeText.textContent = t('modeSub'); }
    else if (lv.type === 'rain') { targetText.textContent = t('rainTarget')(lv.target, state.progress, lv.need); modeText.textContent = t('modeRain'); }
    else { targetText.textContent = t('addTarget')(lv.target); modeText.textContent = t('modeAdd'); }
    if (lv.type === 'rain' && state.running) timeText.textContent = t('seconds')(Math.max(0, lv.seconds - Math.floor((performance.now() - state.startedAt) / 1000)));
    else timeText.textContent = t('infinite');
    tip.textContent = state.message || t('tip0');
    if (!ctx) return;
    drawBackground();
    state.fireflies.forEach(drawFirefly);
    drawParticles();
    drawLasso();
  }

  function loop(now) {
    const dt = Math.min(0.05, (now - (state.last || now)) / 1000);
    state.last = now; state.now = now;
    update(dt, now); render();
    requestAnimationFrame(loop);
  }

  startBtn.addEventListener('click', startGame);
  retryBtn.addEventListener('click', () => { ensureAudio(); resetLevel(); startGame(); });
  nextBtn.addEventListener('click', () => { ensureAudio(); win.hidden = true; advance(); });
  againBtn.addEventListener('click', () => { ensureAudio(); win.hidden = true; resetLevel(); startGame(); });
  addEventListener('resize', resize);
  addEventListener('themechange', render);

  /* ============================ 启动 ============================ */
  applyTheme();
  applyLang();
  resize();
  resetLevel();
  requestAnimationFrame(loop);
})();
