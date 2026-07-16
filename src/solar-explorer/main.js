/* 太阳系漫游 Solar System Cruise */
(() => {
  'use strict';

  const I18N = {
    zh: {
      back: '返回平台', title: '太阳系漫游', langBtn: 'EN', doc: '太阳系漫游 · KidsLab',
      speed: '时间流速', tapHint: '👆 点一颗行星看看它的秘密',
      fDiameter: '直径', fDist: '离太阳', fYear: '绕一圈',
      au: '天文单位', days: (d) => `${d} 天`, years: (y) => `${y} 地球年`,
      sunDist: '它就是中心！',
    },
    en: {
      back: 'Back to platform', title: 'Solar System Cruise', langBtn: '中', doc: 'Solar System Cruise · KidsLab',
      speed: 'Time speed', tapHint: '👆 Tap a planet to see its secrets',
      fDiameter: 'Diameter', fDist: 'From the Sun', fYear: 'One orbit',
      au: 'AU', days: (d) => `${d} days`, years: (y) => `${y} Earth years`,
      sunDist: 'It IS the center!',
    },
  };
  let lang = localStorage.getItem('kidslab.lang') || 'zh';
  if (!I18N[lang]) lang = 'zh';

  /* orbit: 相对轨道半径 / size: 相对大小 / period: 地球年 */
  const BODIES = [
    { id: 'sun', emoji: '☀️', color: '#ffb703', orbit: 0, size: 27, period: 0,
      name: { zh: '太阳', en: 'The Sun' }, diameter: '1,392,700 km', au: null,
      fact: { zh: '太阳占了整个太阳系 99.86% 的质量，是一颗燃烧了 46 亿年的大火球！', en: 'The Sun holds 99.86% of the solar system’s mass — a fireball burning for 4.6 billion years!' } },
    { id: 'mercury', emoji: '🪨', color: '#b9a99b', orbit: 62, size: 4.5, period: 0.24,
      name: { zh: '水星', en: 'Mercury' }, diameter: '4,879 km', au: 0.39,
      fact: { zh: '水星上一天比一年还长！它自转一圈要 59 个地球日。', en: 'A day on Mercury is longer than its year — one spin takes 59 Earth days!' } },
    { id: 'venus', emoji: '🌕', color: '#e8c47e', orbit: 88, size: 7, period: 0.62,
      name: { zh: '金星', en: 'Venus' }, diameter: '12,104 km', au: 0.72,
      fact: { zh: '金星是太阳系最热的行星（约 465°C），比离太阳更近的水星还要热！', en: 'Venus is the hottest planet (~465°C) — hotter than Mercury even though it is farther out!' } },
    { id: 'earth', emoji: '🌍', color: '#4d96ff', orbit: 118, size: 7.5, period: 1,
      name: { zh: '地球', en: 'Earth' }, diameter: '12,742 km', au: 1,
      fact: { zh: '目前已知唯一有生命的星球 —— 也是唯一名字不是神话人物的行星。', en: 'The only known world with life — and the only planet not named after a myth.' } },
    { id: 'mars', emoji: '🔴', color: '#e35b40', orbit: 150, size: 5.8, period: 1.88,
      name: { zh: '火星', en: 'Mars' }, diameter: '6,779 km', au: 1.52,
      fact: { zh: '火星上有太阳系最高的火山：奥林帕斯山，差不多是珠穆朗玛峰的 2.5 倍高！', en: 'Mars hosts Olympus Mons, the tallest volcano — about 2.5× the height of Mt. Everest!' } },
    { id: 'jupiter', emoji: '🟠', color: '#d9a066', orbit: 198, size: 16, period: 11.86,
      name: { zh: '木星', en: 'Jupiter' }, diameter: '139,820 km', au: 5.2,
      fact: { zh: '木星的大红斑是一场刮了 300 多年的巨型风暴，能塞下两三个地球！', en: 'Jupiter’s Great Red Spot is a storm raging for 300+ years — big enough to swallow 2–3 Earths!' } },
    { id: 'saturn', emoji: '🪐', color: '#e5c98e', orbit: 245, size: 13.5, period: 29.46, ring: true,
      name: { zh: '土星', en: 'Saturn' }, diameter: '116,460 km', au: 9.54,
      fact: { zh: '土星密度比水还小 —— 如果有足够大的浴缸，它会浮起来！', en: 'Saturn is less dense than water — with a big enough bathtub, it would float!' } },
    { id: 'uranus', emoji: '🩵', color: '#8fd6e8', orbit: 288, size: 10, period: 84,
      name: { zh: '天王星', en: 'Uranus' }, diameter: '50,724 km', au: 19.2,
      fact: { zh: '天王星是“躺着”自转的 —— 它的自转轴几乎平躺在轨道面上。', en: 'Uranus spins lying down — its axis is tilted almost flat on its side.' } },
    { id: 'neptune', emoji: '🔵', color: '#4664e0', orbit: 328, size: 9.5, period: 164.8,
      name: { zh: '海王星', en: 'Neptune' }, diameter: '49,244 km', au: 30.06,
      fact: { zh: '海王星的风速可达每小时 2100 公里，是太阳系里最猛的风！', en: 'Neptune’s winds hit 2,100 km/h — the fiercest in the solar system!' } },
  ];

  const $ = (s) => document.querySelector(s);
  const canvas = $('#space');
  const ctx = canvas.getContext('2d');

  let simTime = Math.random() * 200; /* 年 */
  let speedExp = 1.3; /* 10^x 地球日每秒 → slider 0..3 */
  let selected = null;
  let stars = [];

  const speedYearsPerSec = () => Math.pow(10, speedExp) / 365.25;

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.3,
      tw: Math.random() * Math.PI * 2,
    }));
  }

  function layout() {
    const { width: w, height: h } = canvas;
    const scale = Math.min(w, h) / (2 * 355);
    return { cx: w / 2, cy: h / 2, scale, pr: Math.max(1, Math.min(w, h) / 520) };
  }

  const bodyPos = (b, m) => {
    if (!b.orbit) return { x: m.cx, y: m.cy };
    const a = (simTime / b.period) * Math.PI * 2 + b.orbit; /* 各自相位 */
    return { x: m.cx + Math.cos(a) * b.orbit * m.scale, y: m.cy + Math.sin(a) * b.orbit * m.scale * 0.94 };
  };

  function draw(tm) {
    const m = layout();
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);

    /* 星星 */
    for (const s of stars) {
      ctx.globalAlpha = 0.4 + Math.sin(tm / 900 + s.tw) * 0.3;
      ctx.fillStyle = '#cfd8ff';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* 轨道 */
    ctx.strokeStyle = 'rgba(140, 155, 255, 0.16)';
    ctx.lineWidth = 1.2;
    for (const b of BODIES) {
      if (!b.orbit) continue;
      ctx.beginPath();
      ctx.ellipse(m.cx, m.cy, b.orbit * m.scale, b.orbit * m.scale * 0.94, 0, 0, 7);
      ctx.stroke();
    }

    /* 天体 */
    for (const b of BODIES) {
      const p = bodyPos(b, m);
      const R = b.size * m.pr * 1.6;

      if (b.id === 'sun') {
        const g = ctx.createRadialGradient(p.x, p.y, R * 0.2, p.x, p.y, R * 3);
        g.addColorStop(0, 'rgba(255, 183, 3, 0.5)');
        g.addColorStop(1, 'rgba(255, 183, 3, 0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, R * 3, 0, 7); ctx.fill();
      }

      if (b.ring) {
        ctx.strokeStyle = 'rgba(229, 201, 142, 0.75)';
        ctx.lineWidth = R * 0.34;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, R * 1.85, R * 0.62, -0.35, 0, 7);
        ctx.stroke();
      }

      const grad = ctx.createRadialGradient(p.x - R * 0.35, p.y - R * 0.35, R * 0.1, p.x, p.y, R);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.25, b.color);
      grad.addColorStop(1, shade(b.color, 0.45));
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, 7); ctx.fill();

      if (selected === b.id) {
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 5]);
        ctx.beginPath(); ctx.arc(p.x, p.y, R + 7, 0, 7); ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = 'rgba(220, 228, 255, 0.85)';
      ctx.font = `700 ${Math.max(10, 11 * m.pr)}px ui-rounded, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(b.name[lang], p.x, p.y + R + 15 * m.pr);
    }
  }

  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16);
    const f = (v) => Math.round(v * (1 - k));
    return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
  }

  /* ---------- 循环 ---------- */
  let last = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    simTime += dt * speedYearsPerSec();
    draw(now);
  }

  /* ---------- 交互 ---------- */
  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    const m = layout();
    const x = ((e.clientX - r.left) / r.width) * canvas.width;
    const y = ((e.clientY - r.top) / r.height) * canvas.height;
    let hit = null;
    for (const b of BODIES) {
      const p = bodyPos(b, m);
      const R = b.size * m.pr * 1.6 + 12;
      if (Math.hypot(x - p.x, y - p.y) < R) hit = b;
    }
    selected = hit?.id ?? null;
    renderInfo(hit);
  });

  function renderInfo(b) {
    const card = $('#infoCard');
    if (!b) { card.hidden = true; return; }
    const t = I18N[lang];
    $('#infoEmoji').textContent = b.emoji;
    $('#infoName').textContent = b.name[lang];
    $('#fDiameter').textContent = b.diameter;
    $('#fDist').textContent = b.au ? `${b.au} ${t.au}` : t.sunDist;
    $('#fYear').textContent = b.period === 0 ? '—' : b.period < 1 ? t.days(Math.round(b.period * 365.25)) : t.years(b.period);
    $('#infoFact').textContent = b.fact[lang];
    card.hidden = false;
  }
  $('#infoClose').addEventListener('click', () => { selected = null; $('#infoCard').hidden = true; });

  $('#speedRange').addEventListener('input', (e) => {
    speedExp = +e.target.value;
    syncSpeedLabel();
  });
  function syncSpeedLabel() {
    const dps = Math.pow(10, speedExp);
    $('#speedVal').textContent = dps >= 365 ? `×${(dps / 365.25).toFixed(1)}y/s` : `×${Math.round(dps)}d/s`;
  }

  function applyLang() {
    const t = I18N[lang];
    document.querySelectorAll('[data-t]').forEach((n) => { n.textContent = t[n.dataset.t]; });
    $('#langBtn').textContent = t.langBtn;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t.doc;
    if (selected) renderInfo(BODIES.find((b) => b.id === selected));
  }
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('kidslab.lang', lang);
    applyLang();
  });

  addEventListener('resize', resize);
  applyLang();
  syncSpeedLabel();
  resize();
  requestAnimationFrame(loop);
})();
