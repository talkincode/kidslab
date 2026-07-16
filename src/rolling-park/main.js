/* ============================================================
   🎡 滚轮乐园 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '🎡 滚轮乐园 · KidsLab', back: '返回平台', title: '滚轮乐园',
      eyebrow: '圆的周长与面积', hero: '把 π 亲手滚出来',
      tip0: '车轮蘸了颜料：拖动它或点「滚一圈」，看看滚一圈能画出多长的线。',
      tabRoll: 'A 滚出 π', tabArea: 'B 拼出面积', tabChallenge: 'C 算路程',
      rollTitle: '滚出 π', radius: '车轮大小', autoRoll: '滚一圈', squareRoll: '方轮试试',
      rollTip: '拖动车轮或点「滚一圈」。轮子转满一圈，地上的颜料线就正好是圆的周长。',
      ratio: (c, d, r) => `颜料线 ${c} ÷ 直径 ${d} = ${r}`,
      tableHead: '直径 / 颜料线 / 线÷直径',
      piHello: '换了 3 种轮子，颜料线总是直径的 3.14 倍左右——这个固定的倍数就是 π！',
      squareTip: '方轮子一颠一颠，小人都被甩飞了。圆轮子中心到地面永远一样高（都是半径），滚起来才平稳。',
      rollDone: '颜料线 ≈ 3.14 个直径，这个倍数就是 π',
      lblD: '直径 d', lblPaint: '蘸好颜料啦', lblUnit: '下面每格 = 1 个直径', lblClunk: '哐当！',
      areaTitle: '拼出面积', slices: '切几片', slice: '切开', rearrange: '拼成长方形', unarrange: '变回圆形',
      areaTip: '先点「切开」，再点「拼成长方形」。切的片数越多，拼出来越像长方形。',
      areaSliceTip: (n) => `切成了 ${n} 片！现在点「拼成长方形」。`,
      areaMagic: '一片朝上、一片朝下：长≈半个圆周=πr，宽=半径 r，所以圆面积 = πr × r = πr²！',
      areaBackTip: '拼回圆形了。换个片数再切一次试试！',
      pickSlice: '先点右边的「切开」', lblSlices: (n) => `${n} 片`,
      lblLen: '长 ≈ 半个圆周 = πr', lblWid: '宽 = r', lblR: '半径 r',
      formula: '面积 = πr²',
      challengeTitle: '算路程', verify: '看结果', nextQ: '下一题',
      chGo: '先自己算一算，再点「看结果」让轮子滚给你看。',
      qForward: (d, laps) => `车轮直径 ${d} 米，向前滚 ${laps} 圈，一共前进多少米？（保留 1 位小数）`,
      qReverse: (dist, laps) => `要正好滚 ${laps} 圈走完 ${dist} 米，该选直径多少米的轮子？`,
      ok: '答对了！轮子正好滚到你算的位置 ✅',
      close: (ans) => `很接近了！答案约是 ${ans} 米。`,
      miss: (ans) => `别急：路程 = 直径 × 3.14 × 圈数，答案约是 ${ans} 米。`,
      done: '6 题全部完成！你已经会用 π 算轮子走多远了。',
      chD: (d) => `直径 ${d} 米`, chLaps: (n) => `滚 ${n} 圈`,
      chDist: (x) => `一共 ≈ ${x} 米`, chFinish: (x) => `终点 ${x} 米`,
    },
    en: {
      doc: '🎡 Rolling Wheel Park · KidsLab', back: 'Back to platform', title: 'Rolling Wheel Park',
      eyebrow: 'Circumference & area of a circle', hero: 'Roll out π with your own hands',
      tip0: 'The wheel is dipped in paint: drag it or tap “Roll one turn” and see how long a line one turn draws.',
      tabRoll: 'A Roll out π', tabArea: 'B Build area', tabChallenge: 'C Distance quiz',
      rollTitle: 'Roll out π', radius: 'Wheel size', autoRoll: 'Roll one turn', squareRoll: 'Try a square wheel',
      rollTip: 'Drag the wheel or tap “Roll one turn”. One full turn paints a line exactly one circumference long.',
      ratio: (c, d, r) => `Paint line ${c} ÷ diameter ${d} = ${r}`,
      tableHead: 'Diameter / paint line / line÷diameter',
      piHello: '3 different wheels, and the line is always about 3.14 diameters long. That fixed number is π!',
      squareTip: 'The square wheel bumps along and launches the rider. A round wheel keeps its center at the same height (one radius), so it rolls smoothly.',
      rollDone: 'Paint line ≈ 3.14 diameters — that number is π',
      lblD: 'diameter d', lblPaint: 'Paint loaded!', lblUnit: 'each block below = 1 diameter', lblClunk: 'CLUNK!',
      areaTitle: 'Build area', slices: 'Slices', slice: 'Slice it', rearrange: 'Make a rectangle', unarrange: 'Back to circle',
      areaTip: 'Tap “Slice it”, then “Make a rectangle”. More slices make a neater rectangle.',
      areaSliceTip: (n) => `Sliced into ${n} pieces! Now tap “Make a rectangle”.`,
      areaMagic: 'One piece up, one piece down: length ≈ half the circumference = πr, width = radius r, so area = πr × r = πr²!',
      areaBackTip: 'Back to a circle. Try a different number of slices!',
      pickSlice: 'Tap “Slice it” to start', lblSlices: (n) => `${n} pieces`,
      lblLen: 'length ≈ half circumference = πr', lblWid: 'width = r', lblR: 'radius r',
      formula: 'Area = πr²',
      challengeTitle: 'Distance quiz', verify: 'Show result', nextQ: 'Next',
      chGo: 'Work it out first, then tap “Show result” to watch the wheel roll.',
      qForward: (d, laps) => `A wheel with diameter ${d} m rolls ${laps} turns. How many meters does it travel? (1 decimal)`,
      qReverse: (dist, laps) => `To cover ${dist} m in exactly ${laps} turns, which wheel diameter do you pick?`,
      ok: 'Correct! The wheel lands right where you predicted ✅',
      close: (ans) => `So close! The answer is about ${ans} m.`,
      miss: (ans) => `Remember: distance = diameter × 3.14 × turns. The answer is about ${ans} m.`,
      done: 'All 6 done! Now you can predict how far a wheel travels with π.',
      chD: (d) => `diameter ${d} m`, chLaps: (n) => `${n} turns`,
      chDist: (x) => `total ≈ ${x} m`, chFinish: (x) => `finish ${x} m`,
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
  const $ = (id) => document.getElementById(id);
  const els = {
    canvas: $('stage'), tip: $('tip'), piBadge: $('piBadge'), radius: $('radius'), autoRoll: $('autoRoll'), squareRoll: $('squareRoll'),
    ratioText: $('ratioText'), recordTable: $('recordTable'), rollPanel: $('rollPanel'), areaPanel: $('areaPanel'), challengePanel: $('challengePanel'),
    slices: $('slices'), sliceBtn: $('sliceBtn'), rearrangeBtn: $('rearrangeBtn'), formulaText: $('formulaText'),
    questionText: $('questionText'), answer: $('answer'), wheelChoice: $('wheelChoice'), verifyBtn: $('verifyBtn'), nextQBtn: $('nextQBtn'), scoreText: $('scoreText'),
  };
  const ctx = els.canvas.getContext('2d');
  let W = 900, H = 560, dpr = 1;
  let mode = 'roll';
  let radius = 60;
  let roll = 0;
  let rolling = false;
  let dragging = false;
  let square = { on: false, p: 0 };
  const records = [];
  let slices = 16;
  let areaAnim = 0;        // 0 = 圆形，1 = 拼成长方形
  let areaTarget = 0;
  let areaSliced = false;
  let areaRaf = 0;
  let actx = null;
  let score = 0;
  let qIndex = 0;
  const questions = [
    { type: 'forward', d: 2, laps: 3 }, { type: 'forward', d: 1.5, laps: 4 }, { type: 'forward', d: 0.8, laps: 10 },
    { type: 'reverse', dist: 31.4, laps: 5, choices: [1, 2, 3] }, { type: 'reverse', dist: 18.8, laps: 4, choices: [1.5, 2.5, 3] },
    { type: 'forward', d: 3, laps: 2 },
  ];

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

  function startAudio() {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch { /* ignore */ }
  }
  function tone(freq, dur = 0.12, delay = 0, type = 'sine') {
    if (!actx) return;
    const o = actx.createOscillator(); const g = actx.createGain(); const t0 = actx.currentTime + delay;
    o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0.13, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + dur + 0.03);
  }
  const sfx = {
    roll: () => [330, 392, 494, 659].forEach((f, i) => tone(f, 0.09, i * 0.08, 'triangle')),
    bonk: () => [90, 130, 80].forEach((f, i) => tone(f, 0.12, i * 0.1, 'sawtooth')),
    magic: () => [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.14, i * 0.07, 'triangle')),
  };

  function resize() {
    const rect = els.canvas.getBoundingClientRect();
    dpr = Math.max(1, Math.min(2, devicePixelRatio || 1));
    W = Math.max(320, Math.floor(rect.width)); H = Math.max(300, Math.floor(rect.height));
    els.canvas.width = Math.floor(W * dpr); els.canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); render();
  }
  function fmt(n) { return (Math.round(n * 10) / 10).toFixed(1); }
  function baseY() { return H * 0.68; }
  function recordCurrent() {
    const d = radius * 2;
    const c = Math.PI * d;
    const exists = records.some((r) => Math.abs(r.d - d) < 2);
    if (!exists) records.push({ d, c, ratio: c / d });
    if (records.length >= 3) { els.piBadge.classList.add('awake'); els.tip.textContent = t('piHello'); sfx.magic(); }
  }

  /* ---------- 通用画笔 ---------- */
  function roundRect(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function drawStickerText(text, x, y, bg, rot = 0, size = 15) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.font = `900 ${size}px ui-rounded, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const w = ctx.measureText(text).width + 22;
    ctx.fillStyle = bg; ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 2.5;
    roundRect(-w / 2, -16, w, 32, 12); ctx.fill(); ctx.stroke();
    const brightBg = [cssVar('--accent'), cssVar('--accent-2'), cssVar('--sun')].includes(bg);
    ctx.fillStyle = brightBg ? cssVar('--ink-on-accent') : cssVar('--ink'); ctx.fillText(text, 0, 1); ctx.restore();
  }
  /** 双箭头尺寸标注线 */
  function drawDimArrow(x1, y1, x2, y2) {
    const a = Math.atan2(y2 - y1, x2 - x1); const hl = 9;
    ctx.save(); ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    for (const [px, py, dir] of [[x1, y1, a], [x2, y2, a + Math.PI]]) {
      ctx.moveTo(px + Math.cos(dir + 0.5) * hl, py + Math.sin(dir + 0.5) * hl);
      ctx.lineTo(px, py);
      ctx.lineTo(px + Math.cos(dir - 0.5) * hl, py + Math.sin(dir - 0.5) * hl);
    }
    ctx.stroke(); ctx.restore();
  }
  function drawCloud(x, y, s) {
    ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = cssVar('--card');
    for (const [dx, dy, r] of [[0, 0, 15], [17, -9, 17], [37, -4, 14], [50, 3, 12], [24, 4, 15]]) {
      ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function drawBackground(withRoad = true) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = cssVar('--sky'); ctx.fillRect(0, 0, W, H);
    const sx = W - 74, sy = 64;
    ctx.save(); ctx.strokeStyle = cssVar('--sun'); ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 + 0.4;
      ctx.beginPath(); ctx.moveTo(sx + Math.cos(a) * 48, sy + Math.sin(a) * 48); ctx.lineTo(sx + Math.cos(a) * 60, sy + Math.sin(a) * 60); ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = cssVar('--sun'); ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(sx, sy, 38, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCloud(W * 0.14, 62, 1); drawCloud(W * 0.45, 42, 0.78);
    ctx.fillStyle = cssVar('--paper-2');
    for (let x = -30; x < W; x += 90) { ctx.beginPath(); ctx.arc(x, H * 0.72, 70, Math.PI, 0); ctx.fill(); }
    if (withRoad) {
      ctx.fillStyle = cssVar('--road'); roundRect(24, baseY(), W - 48, 58, 20); ctx.fill();
      ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 3; ctx.stroke();
    }
  }
  function drawStartFlag(x) {
    ctx.save(); ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, baseY() + 2); ctx.lineTo(x, baseY() - 30); ctx.stroke();
    ctx.fillStyle = cssVar('--accent');
    ctx.beginPath(); ctx.moveTo(x, baseY() - 30); ctx.lineTo(x + 20, baseY() - 24); ctx.lineTo(x, baseY() - 18); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  function drawWheel(x, y, r, angle) {
    ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.beginPath(); ctx.ellipse(x, baseY() + 5, r * 0.85, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    ctx.fillStyle = cssVar('--wheel'); ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = Math.max(3, r * 0.09);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.globalAlpha = 0.45; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, Math.max(2, r - Math.max(6, r * 0.16)), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    if (r > 14) {
      ctx.strokeStyle = cssVar('--paint-2'); ctx.lineWidth = Math.max(2, r * 0.05);
      for (let i = 0; i < 8; i++) { ctx.rotate(Math.PI / 4); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r * 0.82, 0); ctx.stroke(); }
    }
    ctx.fillStyle = cssVar('--accent-2'); ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, Math.max(3, r * 0.14), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    /* 起点标记：转满一圈刚好回到最低点 */
    ctx.fillStyle = cssVar('--accent');
    ctx.beginPath(); ctx.arc(0, Math.max(2, r * 0.8), Math.max(3, r * 0.11), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
    ctx.font = `${Math.max(20, r * 0.6)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('🧑‍🚀', x, y - r - 10);
  }

  /* ---------- A 滚出 π ---------- */
  /** 布局：整体缩放，保证「一整圈 + 车轮」永远画得进画布 */
  function rollLayout() {
    const startX = Math.max(46, W * 0.1);
    const cLog = Math.PI * 2 * radius;
    const s = Math.min(1, (W - startX - 46) / (cLog + radius));
    return { startX, s, rPx: radius * s, cPx: cLog * s };
  }
  function drawRoll() {
    drawBackground();
    const { startX, rPx, cPx } = rollLayout();
    const x = startX + cPx * roll, y = baseY() - rPx;
    drawStartFlag(startX);
    if (roll > 0.004) {
      ctx.fillStyle = cssVar('--paint'); roundRect(startX, baseY() + 13, Math.max(2, cPx * roll), 15, 7); ctx.fill();
      ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 2; ctx.stroke();
    }
    /* 直径量尺：颜料线下方一格一格摆直径，看看能摆几个 */
    const dPx = 2 * rPx; const by = baseY() + 74; const covered = cPx * roll;
    if (covered > 2) {
      ctx.font = '800 11.5px ui-rounded, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = cssVar('--ink-soft'); ctx.fillText(t('lblUnit'), startX + 2, by - 6);
    }
    for (let k = 0; k < 4; k++) {
      const bs = k * dPx; if (covered <= bs + 0.5) break;
      const full = k < 3 ? dPx : cPx - 3 * dPx;
      const w = Math.min(full, covered - bs);
      ctx.fillStyle = cssVar(k % 2 ? '--pizza' : '--pizza-2');
      roundRect(startX + bs, by, Math.max(2, w), 16, 5); ctx.fill();
      ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 2; ctx.stroke();
      if (k < 3 && w >= dPx - 1) {
        ctx.fillStyle = cssVar('--ink-on-accent'); ctx.font = '900 12px ui-rounded, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(k + 1), startX + bs + dPx / 2, by + 9);
      }
    }
    drawWheel(x, y, rPx, roll * Math.PI * 2);
    drawDimArrow(x, y - rPx + 4, x, y + rPx - 4);
    const lx = x + rPx + 44 > W - 20 ? x - rPx - 44 : x + rPx + 44;
    drawStickerText(t('lblD'), lx, y, cssVar('--card'), 0, 13);
    if (roll >= 0.99) drawStickerText(t('rollDone'), startX + (cPx - rPx) / 2, baseY() - 26, cssVar('--sun'), 0, 14);
    else if (roll < 0.02 && !square.on) drawStickerText(t('lblPaint'), x, y - rPx - 46, cssVar('--accent-2'), 0, 13);
    if (square.on) drawSquareGag(startX, rPx);
  }
  function drawSquareGag(startX, rPx) {
    const p = square.p; const size = Math.max(40, rPx * 1.5);
    const x = startX + (W * 0.55) * p;
    const bump = Math.abs(Math.sin(p * Math.PI * 8));
    const y = baseY() - size / 2 - bump * 26;
    ctx.save(); ctx.translate(x, y); ctx.rotate(p * Math.PI * 4);
    ctx.fillStyle = cssVar('--pizza-2'); ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 4;
    ctx.fillRect(-size / 2, -size / 2, size, size); ctx.strokeRect(-size / 2, -size / 2, size, size);
    ctx.restore();
    ctx.font = `${26 + p * 14}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('😵‍💫', x + 30, y - size / 2 - 24 - p * 70);
    if (bump > 0.92 && p < 0.97) drawStickerText(t('lblClunk'), x, y - size - 20, cssVar('--sun'), 0, 13);
  }

  /* ---------- B 拼出面积 ---------- */
  /** 每片扇形从圆里飞到「一片朝上一片朝下」的长方形队列，位置和角度都平滑插值 */
  function drawArea() {
    drawBackground(false);
    const n = slices, th = Math.PI * 2 / n;
    const r = Math.min(112, (H - 132) / 3.08, (W - 90) / 3.45);
    const cx = W / 2, cy = r + 46;
    const b = 2 * r * Math.sin(th / 2), h = r * Math.cos(th / 2);
    const rowW = (n + 1) * b / 2;
    const rowLeft = cx - rowW / 2;
    const x0 = rowLeft + b / 2;
    const rowY = cy + r + 42 + (r - h);
    if (!areaSliced) {
      ctx.fillStyle = cssVar('--pizza'); ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      const ra = -0.6;
      ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ra) * r, cy + Math.sin(ra) * r); ctx.stroke();
      drawStickerText(t('lblR'), cx + Math.cos(ra) * r * 0.62 + 8, cy + Math.sin(ra) * r * 0.62 - 16, cssVar('--card'), 0, 13);
      drawStickerText(t('pickSlice'), cx, cy + r + 36, cssVar('--accent-2'));
      return;
    }
    for (let i = 0; i < n; i++) {
      const a0 = -Math.PI / 2 + i * th; const mid = a0 + th / 2;
      const pe = ease(clamp01((areaAnim - (i / n) * 0.3) / 0.7));
      const sep = 6 * (1 - pe);
      const fromX = cx + Math.cos(mid) * sep, fromY = cy + Math.sin(mid) * sep;
      const toX = x0 + i * b / 2, toY = i % 2 ? rowY + h : rowY;
      const circRot = mid - Math.PI / 2, rowRot = i % 2 ? Math.PI : 0;
      let dR = rowRot - circRot; dR = Math.atan2(Math.sin(dR), Math.cos(dR));
      const px = lerp(fromX, toX, pe), py = lerp(fromY, toY, pe), rot = circRot + dR * pe;
      ctx.save(); ctx.translate(px, py); ctx.rotate(rot);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, Math.PI / 2 - th / 2, Math.PI / 2 + th / 2); ctx.closePath();
      ctx.fillStyle = cssVar(i % 2 ? '--pizza' : '--pizza-2'); ctx.fill();
      ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
    }
    if (areaAnim < 0.06) drawStickerText(t('lblSlices')(n), cx, Math.max(22, cy - r - 24), cssVar('--sun'), 0, 13);
    if (areaAnim > 0.92) {
      const yDim = rowY + r + 14;
      drawDimArrow(rowLeft, yDim, rowLeft + rowW, yDim);
      drawStickerText(t('lblLen'), cx, Math.min(H - 20, yDim + 26), cssVar('--accent-2'), 0, 14);
      const xDim = Math.max(20, rowLeft - 14);
      drawDimArrow(xDim, rowY, xDim, rowY + h);
      drawStickerText(t('lblWid'), Math.max(22, xDim - 22), rowY + h / 2, cssVar('--card'), -Math.PI / 2, 13);
    }
  }

  /* ---------- C 算路程 ---------- */
  /** 按「总米数」折算像素，轨道 + 车轮永远在画布内 */
  function drawChallenge() {
    drawBackground();
    const q = questions[qIndex];
    const isFwd = q.type === 'forward';
    const ans = answerFor(q);
    const d = isFwd ? q.d : Number(els.wheelChoice.value) || ans;
    const laps = q.laps;
    const startX = Math.max(46, W * 0.1);
    const cM = Math.PI * d;
    const totalM = Math.max(cM * laps, isFwd ? 0 : q.dist);
    const s = (W - startX - 44) / totalM;
    const rPx = Math.max(8, (d / 2) * s);
    const p = clamp01(roll);
    const distPx = cM * laps * s * p;
    drawStartFlag(startX);
    if (!isFwd) {
      const fx = startX + q.dist * s;
      ctx.save(); ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(fx, baseY() + 8); ctx.lineTo(fx, baseY() - 40); ctx.stroke();
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = i % 2 ? cssVar('--card') : cssVar('--line-strong');
        ctx.fillRect(fx + (i % 3) * 8, baseY() - 40 + Math.floor(i / 3) * 7, 8, 7);
      }
      ctx.strokeRect(fx, baseY() - 40, 24, 14); ctx.restore();
      drawStickerText(t('chFinish')(q.dist), Math.min(W - 70, Math.max(70, fx)), baseY() - 62, cssVar('--card'), 0, 13);
    }
    if (p > 0.004) {
      ctx.fillStyle = cssVar('--paint'); roundRect(startX, baseY() + 13, Math.max(2, distPx), 15, 7); ctx.fill();
      ctx.strokeStyle = cssVar('--line-strong'); ctx.lineWidth = 2; ctx.stroke();
    }
    const lapPx = cM * s;
    ctx.save(); ctx.strokeStyle = cssVar('--card'); ctx.globalAlpha = 0.95; ctx.lineWidth = 2.5;
    for (let k = 1; k <= laps; k++) {
      const tx = startX + k * lapPx;
      ctx.beginPath(); ctx.moveTo(tx, baseY() + 8); ctx.lineTo(tx, baseY() + 32); ctx.stroke();
      if (lapPx >= 34) {
        ctx.font = '900 11px ui-rounded, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = cssVar('--card'); ctx.fillText(String(k), tx, baseY() + 48);
      }
    }
    ctx.restore();
    drawWheel(startX + distPx, baseY() - rPx, rPx, p * Math.PI * 2 * laps);
    drawStickerText(t('chD')(d), startX + 64, 34, cssVar('--card'), 0, 13);
    drawStickerText(t('chLaps')(laps), startX + 64, 72, cssVar('--accent-2'), 0, 13);
    if (p >= 0.99) drawStickerText(t('chDist')(fmt(cM * laps)), Math.min(W - 100, Math.max(100, startX + distPx)), baseY() - 26, cssVar('--sun'));
  }
  function renderCanvas() { if (mode === 'roll') drawRoll(); else if (mode === 'area') drawArea(); else drawChallenge(); }

  /* ---------- 交互 ---------- */
  function autoRoll() {
    startAudio(); rolling = true; roll = 0; square.on = false; sfx.roll();
    const t0 = performance.now();
    const step = (now) => {
      const d = Math.min(1, (now - t0) / 1800); roll = ease(d); render();
      if (d < 1 && rolling) requestAnimationFrame(step); else { rolling = false; roll = 1; recordCurrent(); render(); }
    };
    requestAnimationFrame(step);
  }
  function squareRoll() {
    startAudio(); square.on = true; square.p = 0; roll = 0; els.tip.textContent = t('squareTip'); sfx.bonk();
    const t0 = performance.now();
    const step = (now) => { square.p = Math.min(1, (now - t0) / 1600); render(); if (square.p < 1 && square.on) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function animateAreaTo(target) {
    areaTarget = target;
    cancelAnimationFrame(areaRaf);
    const from = areaAnim; const dur = 1100; const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      areaAnim = lerp(from, target, p); render();
      if (p < 1) areaRaf = requestAnimationFrame(step);
      else if (target === 1 && slices >= 32) els.formulaText.classList.add('glow');
    };
    areaRaf = requestAnimationFrame(step);
  }
  function sliceCircle() {
    startAudio(); areaSliced = true; els.tip.textContent = t('areaSliceTip')(slices); sfx.roll(); animateAreaTo(0);
  }
  function rearrange() {
    startAudio(); areaSliced = true;
    const to = areaTarget >= 0.5 ? 0 : 1;
    els.tip.textContent = to === 1 ? t('areaMagic') : t('areaBackTip');
    if (to === 1) sfx.magic(); else sfx.roll();
    animateAreaTo(to);
  }

  function answerFor(q) { return q.type === 'forward' ? q.d * Math.PI * q.laps : q.dist / (Math.PI * q.laps); }
  function setupQuestion() {
    const q = questions[qIndex]; roll = 0;
    els.questionText.textContent = q.type === 'forward' ? t('qForward')(q.d, q.laps) : t('qReverse')(q.dist, q.laps);
    els.answer.hidden = q.type !== 'forward'; els.wheelChoice.hidden = q.type !== 'reverse';
    els.answer.value = '';
    if (q.type === 'reverse') {
      els.wheelChoice.innerHTML = q.choices.map((c) => `<option value="${c}">${c} m</option>`).join('');
    }
    els.scoreText.textContent = `${score}/${questions.length}`; render();
  }
  function verify() {
    startAudio(); const q = questions[qIndex]; const ans = answerFor(q); let ok = false;
    if (q.type === 'forward') ok = Math.abs(Number(els.answer.value) - ans) <= 0.35;
    else ok = Math.abs(Number(els.wheelChoice.value) - ans) <= 0.15;
    if (ok) { score += 1; els.tip.textContent = t('ok'); sfx.magic(); } else {
      const near = q.type === 'forward' && Math.abs(Number(els.answer.value) - ans) <= 1;
      els.tip.textContent = (near ? t('close') : t('miss'))(fmt(ans)); sfx.bonk();
    }
    roll = 0; const t0 = performance.now();
    const step = (now) => { const d = Math.min(1, (now - t0) / 1400); roll = ease(d); render(); if (d < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    els.scoreText.textContent = `${score}/${questions.length}`;
  }
  function nextQuestion() {
    qIndex += 1;
    if (qIndex >= questions.length) { qIndex = 0; els.tip.textContent = t('done'); score = 0; }
    else els.tip.textContent = t('chGo');
    setupQuestion();
  }

  function switchMode(next) {
    mode = next; document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
    els.rollPanel.hidden = mode !== 'roll'; els.areaPanel.hidden = mode !== 'area'; els.challengePanel.hidden = mode !== 'challenge';
    els.tip.textContent = mode === 'roll' ? t('rollTip') : mode === 'area' ? t('areaTip') : t('chGo');
    roll = 0; square.on = false; render();
  }
  function pointerPos(e) { const r = els.canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function pointerDown(e) {
    startAudio(); if (mode !== 'roll') return;
    dragging = true; els.canvas.setPointerCapture?.(e.pointerId); pointerMove(e);
  }
  function pointerMove(e) {
    if (!dragging || mode !== 'roll') return;
    const p = pointerPos(e); const { startX, cPx } = rollLayout();
    roll = clamp01((p.x - startX) / cPx); square.on = false; render();
  }
  function pointerUp() { if (!dragging) return; dragging = false; if (roll > 0.98) { roll = 1; recordCurrent(); } render(); }

  /** 每帧/每次状态变化的统一渲染入口（语言、主题切换都会调用） */
  function render() {
    radius = Number(els.radius?.value || radius); slices = Number(els.slices?.value || slices);
    renderCanvas();
    if (els.ratioText) {
      const d = radius * 2; const c = Math.PI * d;
      els.ratioText.textContent = roll >= 0.99 ? t('ratio')(fmt(c), fmt(d), (c / d).toFixed(3)) : t('rollTip');
    }
    if (els.recordTable) {
      els.recordTable.innerHTML = `<div class="row"><b>${t('tableHead').split(' / ')[0]}</b><b>${t('tableHead').split(' / ')[1]}</b><b>${t('tableHead').split(' / ')[2]}</b></div>`
        + records.slice(-5).map((r) => `<div class="row"><span>${fmt(r.d)}</span><span>${fmt(r.c)}</span><span>${r.ratio.toFixed(3)}</span></div>`).join('');
    }
    if (els.formulaText) els.formulaText.textContent = t('formula');
    if (els.rearrangeBtn) els.rearrangeBtn.textContent = areaTarget >= 0.5 ? t('unarrange') : t('rearrange');
    if (els.questionText && mode === 'challenge') {
      const q = questions[qIndex];
      els.questionText.textContent = q.type === 'forward' ? t('qForward')(q.d, q.laps) : t('qReverse')(q.dist, q.laps);
    }
  }

  els.radius.addEventListener('input', () => { roll = 0; square.on = false; render(); });
  els.slices.addEventListener('input', () => {
    slices = Number(els.slices.value); areaAnim = areaTarget; els.formulaText.classList.remove('glow'); render();
  });
  els.autoRoll.addEventListener('click', autoRoll);
  els.squareRoll.addEventListener('click', squareRoll);
  els.sliceBtn.addEventListener('click', sliceCircle);
  els.rearrangeBtn.addEventListener('click', rearrange);
  els.verifyBtn.addEventListener('click', verify);
  els.nextQBtn.addEventListener('click', nextQuestion);
  els.wheelChoice.addEventListener('change', () => { roll = 0; render(); });
  document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => switchMode(b.dataset.mode)));
  els.canvas.addEventListener('pointerdown', pointerDown);
  els.canvas.addEventListener('pointermove', pointerMove);
  addEventListener('pointerup', pointerUp);
  addEventListener('resize', resize);
  addEventListener('themechange', resize);

  /* ============================ 启动 ============================ */
  applyTheme();
  applyLang();
  setupQuestion();
  /* 深链：?mode=roll|area|challenge&state=done|rect，方便分享与教学演示 */
  const qp = new URLSearchParams(location.search);
  const m0 = qp.get('mode');
  if (m0 && ['roll', 'area', 'challenge'].includes(m0)) switchMode(m0);
  if (qp.get('state') === 'done' && mode === 'roll') roll = 1;
  if (qp.get('state') === 'rect' && mode === 'area') { areaSliced = true; areaAnim = 1; areaTarget = 1; }
  resize();
})();
