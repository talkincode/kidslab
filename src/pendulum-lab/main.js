/* 单摆实验室 Pendulum Lab */
(() => {
  'use strict';

  const I18N = {
    zh: {
      back: '返回平台', title: '单摆实验室', langBtn: 'EN', doc: '单摆实验室 · KidsLab',
      planet: '选择星球', length: '摆长 L', theory: '理论周期 2π√(L/g)', measured: '实测周期',
      pause: '暂停', play: '继续', reset: '重置', dragHint: '🖐 拖动摆球，松手开始摆动',
      bigAngle: '💡 摆角很大时，实测周期会比公式略长 —— 公式只在小角度下准确！',
      planets: { earth: '地球', moon: '月球', mars: '火星', jupiter: '木星' },
    },
    en: {
      back: 'Back to platform', title: 'Pendulum Lab', langBtn: '中', doc: 'Pendulum Lab · KidsLab',
      planet: 'Pick a planet', length: 'Length L', theory: 'Theory 2π√(L/g)', measured: 'Measured period',
      pause: 'Pause', play: 'Play', reset: 'Reset', dragHint: '🖐 Drag the bob, release to swing',
      bigAngle: '💡 At large angles the measured period runs longer than the formula — it only holds for small swings!',
      planets: { earth: 'Earth', moon: 'Moon', mars: 'Mars', jupiter: 'Jupiter' },
    },
  };
  let lang = localStorage.getItem('kidslab.lang') || 'zh';
  if (!I18N[lang]) lang = 'zh';

  const PLANETS = [
    { id: 'earth', icon: '🌍', g: 9.81 },
    { id: 'moon', icon: '🌙', g: 1.62 },
    { id: 'mars', icon: '🔴', g: 3.71 },
    { id: 'jupiter', icon: '🟠', g: 24.79 },
  ];

  const state = {
    planet: 'earth',
    g: 9.81,
    L: 1.5,
    theta: 0.6,
    omega: 0,
    running: true,
    dragging: false,
    trail: [],
    /* 周期测量：记录同方向过零时刻 */
    lastCross: null,
    period: null,
    releaseAngle: 0.6,
  };

  const $ = (s) => document.querySelector(s);
  const canvas = $('#stage');
  const ctx = canvas.getContext('2d');

  /* ---------- 物理 ---------- */
  function step(dt) {
    /* 半隐式欧拉 + 子步，θ'' = -(g/L)·sinθ */
    const sub = 8;
    const h = dt / sub;
    for (let i = 0; i < sub; i++) {
      const prevTheta = state.theta;
      state.omega += (-(state.g / state.L) * Math.sin(state.theta)) * h;
      state.theta += state.omega * h;
      /* 正向过零 → 记录周期 */
      if (prevTheta <= 0 && state.theta > 0 && state.omega > 0) {
        const now = performance.now() / 1000;
        if (state.lastCross != null) state.period = now - state.lastCross;
        state.lastCross = now;
      }
    }
  }

  /* ---------- 布局换算 ---------- */
  function metrics() {
    const w = canvas.width, h = canvas.height;
    const px = { x: w / 2, y: h * 0.09 };
    const scale = (h * 0.78) / 3.1; /* 3m 摆长恰好放下 */
    return { w, h, px, scale, len: state.L * scale };
  }
  const bobPos = (m) => ({
    x: m.px.x + Math.sin(state.theta) * m.len,
    y: m.px.y + Math.cos(state.theta) * m.len,
  });

  /* ---------- 绘制 ---------- */
  function draw() {
    const m = metrics();
    const { w, h } = m;
    ctx.clearRect(0, 0, w, h);

    /* 背景刻度弧（量角器）*/
    ctx.save();
    ctx.translate(m.px.x, m.px.y);
    ctx.strokeStyle = 'rgba(212,160,60,0.22)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 7]);
    ctx.beginPath();
    ctx.arc(0, 0, m.len, Math.PI / 2 - 1.35, Math.PI / 2 + 1.35);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(217,201,163,0.6)';
    ctx.font = `600 ${Math.max(10, w / 70)}px ui-rounded, sans-serif`;
    ctx.textAlign = 'center';
    for (const deg of [-60, -30, 0, 30, 60]) {
      const a = (deg * Math.PI) / 180;
      const r = m.len + 20;
      ctx.fillText(`${Math.abs(deg)}°`, Math.sin(a) * r, Math.cos(a) * r);
    }
    ctx.restore();

    /* 顶部支架 */
    ctx.fillStyle = '#4c4028';
    ctx.fillRect(m.px.x - 70, m.px.y - 14, 140, 10);
    ctx.fillStyle = '#d4a03c';
    ctx.beginPath(); ctx.arc(m.px.x, m.px.y, 7, 0, 7); ctx.fill();

    /* 轨迹 */
    const b = bobPos(m);
    state.trail.push([b.x, b.y]);
    if (state.trail.length > 40) state.trail.shift();
    ctx.strokeStyle = 'rgba(123,220,181,0.5)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    state.trail.forEach(([tx, ty], i) => (i ? ctx.lineTo(tx, ty) : ctx.moveTo(tx, ty)));
    ctx.stroke();

    /* 摆线 */
    ctx.strokeStyle = '#d9c9a3';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(m.px.x, m.px.y); ctx.lineTo(b.x, b.y); ctx.stroke();

    /* 摆球（黄铜球）*/
    const R = Math.max(16, w / 42);
    const grad = ctx.createRadialGradient(b.x - R * 0.35, b.y - R * 0.4, R * 0.15, b.x, b.y, R);
    grad.addColorStop(0, '#ffe9b8');
    grad.addColorStop(0.55, '#d4a03c');
    grad.addColorStop(1, '#8a6420');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#2c2618';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(b.x, b.y, R, 0, 7); ctx.fill(); ctx.stroke();
    /* 高光 */
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.beginPath(); ctx.ellipse(b.x - R * 0.32, b.y - R * 0.42, R * 0.2, R * 0.13, -0.6, 0, 7); ctx.fill();

    /* 当前角度 */
    ctx.fillStyle = '#ffd166';
    ctx.font = `800 ${Math.max(13, w / 52)}px ui-rounded, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round((state.theta * 180) / Math.PI)}°`, b.x, b.y - R - 12);
  }

  /* ---------- 读数 ---------- */
  function updateReadouts() {
    const T = 2 * Math.PI * Math.sqrt(state.L / state.g);
    $('#tTheory').textContent = T.toFixed(2);
    $('#tMeasured').textContent = state.period ? state.period.toFixed(2) : '—';
    $('#lenVal').textContent = `${state.L.toFixed(2)} m`;
    $('#bigAngleNote').hidden = Math.abs(state.releaseAngle) < 0.7;
  }

  /* ---------- 主循环 ---------- */
  let last = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, 0.04);
    last = now;
    if (state.running && !state.dragging) step(dt);
    draw();
    updateReadouts();
  }

  function resetMeasure() {
    state.lastCross = null;
    state.period = null;
    state.trail = [];
  }

  /* ---------- 交互 ---------- */
  function pointerAngle(e) {
    const r = canvas.getBoundingClientRect();
    const m = metrics();
    const x = ((e.clientX - r.left) / r.width) * m.w - m.px.x;
    const y = ((e.clientY - r.top) / r.height) * m.h - m.px.y;
    return Math.atan2(x, y);
  }
  canvas.addEventListener('pointerdown', (e) => {
    state.dragging = true;
    canvas.classList.add('dragging');
    canvas.setPointerCapture(e.pointerId);
    state.theta = pointerAngle(e);
    state.omega = 0;
    resetMeasure();
    $('#dragHint').style.opacity = '0';
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!state.dragging) return;
    state.theta = Math.max(-1.45, Math.min(1.45, pointerAngle(e)));
  });
  addEventListener('pointerup', () => {
    if (!state.dragging) return;
    state.dragging = false;
    canvas.classList.remove('dragging');
    state.releaseAngle = state.theta;
    state.running = true;
    syncPlayBtn();
  });

  $('#lenRange').addEventListener('input', (e) => {
    state.L = +e.target.value;
    resetMeasure();
  });

  function renderPlanets() {
    const t = I18N[lang];
    const box = $('#planets');
    box.innerHTML = '';
    for (const p of PLANETS) {
      const b = document.createElement('button');
      b.type = 'button';
      b.classList.toggle('on', state.planet === p.id);
      b.innerHTML = `<span>${p.icon}</span>${t.planets[p.id]}<small>${p.g} m/s²</small>`;
      b.addEventListener('click', () => {
        state.planet = p.id;
        state.g = p.g;
        resetMeasure();
        renderPlanets();
      });
      box.appendChild(b);
    }
  }

  function syncPlayBtn() {
    const t = I18N[lang];
    $('#playBtn').innerHTML = state.running ? `⏸ <span>${t.pause}</span>` : `▶ <span>${t.play}</span>`;
  }
  $('#playBtn').addEventListener('click', () => { state.running = !state.running; syncPlayBtn(); });
  $('#resetBtn').addEventListener('click', () => {
    state.theta = 0.6; state.omega = 0; state.releaseAngle = 0.6;
    state.running = true;
    resetMeasure();
    syncPlayBtn();
  });

  function applyLang() {
    const t = I18N[lang];
    document.querySelectorAll('[data-t]').forEach((n) => { n.textContent = t[n.dataset.t]; });
    $('#langBtn').textContent = t.langBtn;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t.doc;
    renderPlanets();
    syncPlayBtn();
  }
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('kidslab.lang', lang);
    applyLang();
  });

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
  }
  addEventListener('resize', resize);

  applyLang();
  resize();
  requestAnimationFrame(loop);
})();
