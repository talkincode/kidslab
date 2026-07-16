/* 函数变形记 Function Shapeshifter */
(() => {
  'use strict';

  const fmt = (v) => (+v.toFixed(2)).toString();
  const signed = (v, unit = '') => `${v >= 0 ? '+ ' : '− '}${fmt(Math.abs(v))}${unit}`;

  const I18N = {
    zh: {
      back: '返回平台', title: '函数变形记', langBtn: 'EN', doc: '函数变形记 · KidsLab',
      types: { linear: '一次函数', quadratic: '二次函数', inverse: '反比例', sine: '正弦函数' },
      params: { a: '旋钮 a', b: '旋钮 b', c: '旋钮 c', k: '旋钮 k' },
    },
    en: {
      back: 'Back to platform', title: 'Function Shapeshifter', langBtn: '中', doc: 'Function Shapeshifter · KidsLab',
      types: { linear: 'Linear', quadratic: 'Quadratic', inverse: 'Inverse', sine: 'Sine' },
      params: { a: 'Knob a', b: 'Knob b', c: 'Knob c', k: 'Knob k' },
    },
  };
  let lang = localStorage.getItem('kidslab.lang') || 'zh';
  if (!I18N[lang]) lang = 'zh';

  const PRESETS = {
    linear: {
      params: { a: [-5, 5, 0.1, 1], b: [-8, 8, 0.1, 2] },
      fn: (p, x) => p.a * x + p.b,
      eq: (p) => `y = ${fmt(p.a)}x ${signed(p.b)}`,
      info: (p) => lang === 'zh'
        ? [`斜率 <b>a = ${fmt(p.a)}</b>：${p.a > 0 ? '上坡 ↗' : p.a < 0 ? '下坡 ↘' : '水平线 →'}`,
           `与 y 轴交于 <b>(0, ${fmt(p.b)})</b>`,
           p.a !== 0 ? `与 x 轴交于 <b>(${fmt(-p.b / p.a)}, 0)</b>` : 'a = 0 时它只是一条水平线']
        : [`Slope <b>a = ${fmt(p.a)}</b>: ${p.a > 0 ? 'uphill ↗' : p.a < 0 ? 'downhill ↘' : 'flat →'}`,
           `Crosses the y-axis at <b>(0, ${fmt(p.b)})</b>`,
           p.a !== 0 ? `Crosses the x-axis at <b>(${fmt(-p.b / p.a)}, 0)</b>` : 'With a = 0 it is just a flat line'],
      marks: (p) => (p.a !== 0 ? [[0, p.b], [-p.b / p.a, 0]] : [[0, p.b]]),
    },
    quadratic: {
      params: { a: [-3, 3, 0.1, 1], b: [-6, 6, 0.1, 0], c: [-6, 6, 0.1, -3] },
      fn: (p, x) => p.a * x * x + p.b * x + p.c,
      eq: (p) => `y = ${fmt(p.a)}x² ${signed(p.b, 'x')} ${signed(p.c)}`,
      info: (p) => {
        if (Math.abs(p.a) < 0.05) return lang === 'zh' ? ['a ≈ 0，抛物线被压成了直线！'] : ['a ≈ 0 — the parabola collapses into a line!'];
        const vx = -p.b / (2 * p.a), vy = p.fnv ?? p.a * vx * vx + p.b * vx + p.c;
        return lang === 'zh'
          ? [`开口 <b>${p.a > 0 ? '向上 ∪' : '向下 ∩'}</b>，a 越大越“瘦”`,
             `顶点 <b>(${fmt(vx)}, ${fmt(vy)})</b>`,
             `对称轴 <b>x = ${fmt(vx)}</b>`]
          : [`Opens <b>${p.a > 0 ? 'upward ∪' : 'downward ∩'}</b>; bigger |a| = skinnier`,
             `Vertex at <b>(${fmt(vx)}, ${fmt(vy)})</b>`,
             `Axis of symmetry <b>x = ${fmt(vx)}</b>`];
      },
      marks: (p) => {
        if (Math.abs(p.a) < 0.05) return [];
        const vx = -p.b / (2 * p.a);
        return [[vx, p.a * vx * vx + p.b * vx + p.c]];
      },
    },
    inverse: {
      params: { k: [-8, 8, 0.1, 4] },
      fn: (p, x) => (Math.abs(x) < 1e-6 ? NaN : p.k / x),
      eq: (p) => `y = ${fmt(p.k)} / x`,
      info: (p) => lang === 'zh'
        ? [`k = <b>${fmt(p.k)}</b>，曲线在<b>第${p.k >= 0 ? '一、三' : '二、四'}象限</b>`,
           '两条渐近线：<b>x = 0</b> 和 <b>y = 0</b>，曲线永远碰不到它们',
           '|k| 越大，曲线离原点越远']
        : [`k = <b>${fmt(p.k)}</b>: branches live in <b>quadrants ${p.k >= 0 ? 'I & III' : 'II & IV'}</b>`,
           'Two asymptotes: <b>x = 0</b> and <b>y = 0</b> — never touched',
           'Bigger |k| pushes the curve away from the origin'],
      marks: () => [],
    },
    sine: {
      params: { a: [-4, 4, 0.1, 2], b: [0.2, 4, 0.1, 1], c: [-3.14, 3.14, 0.05, 0] },
      fn: (p, x) => p.a * Math.sin(p.b * x + p.c),
      eq: (p) => `y = ${fmt(p.a)}·sin(${fmt(p.b)}x ${signed(p.c)})`,
      info: (p) => lang === 'zh'
        ? [`振幅 <b>|a| = ${fmt(Math.abs(p.a))}</b>：波峰有多高`,
           `周期 <b>T = 2π/b ≈ ${fmt((2 * Math.PI) / p.b)}</b>：一次完整波动的长度`,
           `相位 c = ${fmt(p.c)}：整条波左右平移`]
        : [`Amplitude <b>|a| = ${fmt(Math.abs(p.a))}</b> — the wave height`,
           `Period <b>T = 2π/b ≈ ${fmt((2 * Math.PI) / p.b)}</b> — length of one full wave`,
           `Phase c = ${fmt(p.c)} shifts the whole wave sideways`],
      marks: () => [],
    },
  };

  let type = 'quadratic';
  const values = {};
  for (const [k, preset] of Object.entries(PRESETS)) {
    values[k] = Object.fromEntries(Object.entries(preset.params).map(([p, [, , , d]]) => [p, d]));
  }

  const $ = (s) => document.querySelector(s);
  const canvas = $('#plot');
  const ctx = canvas.getContext('2d');
  const VIEW = { x: 10.5, y: 10.5 }; /* 视野半径 */

  /* ---------- UI ---------- */
  function renderTabs() {
    const t = I18N[lang];
    const box = $('#tabs');
    box.innerHTML = '';
    for (const key of Object.keys(PRESETS)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.role = 'tab';
      b.textContent = t.types[key];
      b.classList.toggle('on', key === type);
      b.addEventListener('click', () => { type = key; renderTabs(); renderSliders(); draw(); });
      box.appendChild(b);
    }
  }

  function renderSliders() {
    const t = I18N[lang];
    const box = $('#sliders');
    box.innerHTML = '';
    for (const [p, [min, max, step]] of Object.entries(PRESETS[type].params)) {
      const div = document.createElement('div');
      div.className = 'sl';
      const label = document.createElement('label');
      label.innerHTML = `<span>${t.params[p]}</span><b id="v-${p}">${fmt(values[type][p])}</b>`;
      const input = document.createElement('input');
      Object.assign(input, { type: 'range', min, max, step, value: values[type][p] });
      input.addEventListener('input', () => {
        values[type][p] = +input.value;
        $(`#v-${p}`).textContent = fmt(+input.value);
        draw();
      });
      div.append(label, input);
      box.appendChild(div);
    }
  }

  /* ---------- 绘图 ---------- */
  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    draw();
  }

  const toPx = (x, y, w, h) => [((x + VIEW.x) / (VIEW.x * 2)) * w, h - ((y + VIEW.y) / (VIEW.y * 2)) * h];

  function draw() {
    const w = canvas.width, h = canvas.height;
    if (!w) return;
    const preset = PRESETS[type];
    const p = values[type];
    ctx.clearRect(0, 0, w, h);

    /* 绘图纸底 */
    ctx.fillStyle = '#0b1327';
    ctx.fillRect(0, 0, w, h);

    /* 网格 */
    ctx.lineWidth = 1;
    for (let gx = -10; gx <= 10; gx++) {
      const [px] = toPx(gx, 0, w, h);
      ctx.strokeStyle = gx === 0 ? '#41628f' : gx % 5 === 0 ? '#1e3155' : '#152544';
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
    }
    for (let gy = -10; gy <= 10; gy++) {
      const [, py] = toPx(0, gy, w, h);
      ctx.strokeStyle = gy === 0 ? '#41628f' : gy % 5 === 0 ? '#1e3155' : '#152544';
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
    }

    /* 坐标轴 */
    ctx.strokeStyle = '#7ea4d9';
    ctx.lineWidth = Math.max(2, w / 500);
    const [ox, oy] = toPx(0, 0, w, h);
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
    ctx.fillStyle = '#7ea4d9';
    ctx.font = `${Math.max(11, w / 70)}px ui-rounded, sans-serif`;
    for (let gx = -10; gx <= 10; gx += 5) {
      if (!gx) continue;
      const [px] = toPx(gx, 0, w, h);
      ctx.fillText(gx, px + 3, oy - 6);
    }
    for (let gy = -10; gy <= 10; gy += 5) {
      if (!gy) continue;
      const [, py] = toPx(0, gy, w, h);
      ctx.fillText(gy, ox + 6, py - 3);
    }

    /* 曲线（发光双描）*/
    for (const [width, color, alpha] of [[9, '#ffd166', 0.16], [3.2, '#ffd166', 1]]) {
      ctx.lineWidth = (width * w) / 900;
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      let pen = false;
      const steps = 700;
      for (let i = 0; i <= steps; i++) {
        const x = -VIEW.x + (i / steps) * VIEW.x * 2;
        const y = preset.fn(p, x);
        if (!isFinite(y) || Math.abs(y) > 60) { pen = false; continue; }
        const [px, py] = toPx(x, y, w, h);
        if (py < -h || py > h * 2) { pen = false; continue; }
        pen ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        pen = true;
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* 特征点 */
    for (const [mx, my] of preset.marks(p)) {
      if (!isFinite(mx) || !isFinite(my) || Math.abs(mx) > VIEW.x || Math.abs(my) > VIEW.y) continue;
      const [px, py] = toPx(mx, my, w, h);
      ctx.fillStyle = '#ff5d8f';
      ctx.strokeStyle = '#0b1327';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(px, py, Math.max(5, w / 160), 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffb3c9';
      ctx.fillText(`(${fmt(mx)}, ${fmt(my)})`, px + 10, py - 10);
    }

    $('#eq').textContent = preset.eq(p);
    $('#info').innerHTML = preset.info(p).map((s) => `<p>${s}</p>`).join('');
  }

  function applyLang() {
    const t = I18N[lang];
    document.querySelectorAll('[data-t]').forEach((n) => { n.textContent = t[n.dataset.t]; });
    $('#langBtn').textContent = t.langBtn;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t.doc;
  }

  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('kidslab.lang', lang);
    applyLang();
    renderTabs();
    renderSliders();
    draw();
  });
  addEventListener('resize', resize);

  applyLang();
  renderTabs();
  renderSliders();
  resize();
})();
