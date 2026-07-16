/* 海龟画室 Turtle Studio — 双语迷你 Logo 语言 */
(() => {
  'use strict';

  const I18N = {
    zh: {
      back: '返回平台', title: '海龟画室', langBtn: 'EN', doc: '海龟画室 · KidsLab',
      run: '运行', clear: '清空画布', docsTitle: '指令小抄',
      errNum: (w) => `「${w}」后面需要一个数字`,
      errUnknown: (w) => `看不懂的指令：「${w}」`,
      errBracket: '「重复」需要用 [ ] 包住要重复的指令',
      errTooMuch: '指令太多啦，海龟画不动了（上限 20000 步）',
      docs: [
        ['前进 100', '向前爬 100 步'],
        ['后退 50', '向后退 50 步'],
        ['右转 90', '顺时针转 90 度'],
        ['左转 45', '逆时针转 45 度'],
        ['颜色 红', '换画笔颜色（红/橙/黄/绿/青/蓝/紫/粉/白/彩虹）'],
        ['粗细 5', '画笔粗细 1~20'],
        ['抬笔 / 落笔', '移动时不画 / 继续画'],
        ['重复 4 [ … ]', '把 [ ] 里的指令重复 4 次，可以嵌套'],
      ],
      examples: {
        square: ['正方形', '颜色 青\n重复 4 [ 前进 140 右转 90 ]'],
        star: ['五角星', '颜色 黄\n粗细 4\n重复 5 [ 前进 220 右转 144 ]'],
        spiral: ['彩虹螺旋', '颜色 彩虹\n重复 60 [ 前进 160 右转 100 ]'],
        sun: ['小太阳', '颜色 橙\n重复 12 [ 前进 120 后退 120 右转 30 ]'],
        flower: ['旋转花', '颜色 彩虹\n粗细 2\n重复 24 [ 重复 4 [ 前进 90 右转 90 ] 右转 15 ]'],
      },
    },
    en: {
      back: 'Back to platform', title: 'Turtle Studio', langBtn: '中', doc: 'Turtle Studio · KidsLab',
      run: 'Run', clear: 'Clear canvas', docsTitle: 'Cheat sheet',
      errNum: (w) => `“${w}” needs a number after it`,
      errUnknown: (w) => `Unknown command: “${w}”`,
      errBracket: '“repeat” needs [ ] around the commands to repeat',
      errTooMuch: 'Too many steps — the turtle is exhausted (limit 20000)',
      docs: [
        ['fd 100', 'crawl forward 100 steps'],
        ['bk 50', 'step back 50'],
        ['rt 90', 'turn right 90°'],
        ['lt 45', 'turn left 45°'],
        ['color red', 'pen colour (red/orange/yellow/green/cyan/blue/purple/pink/white/rainbow)'],
        ['width 5', 'pen width 1–20'],
        ['pu / pd', 'pen up (move only) / pen down'],
        ['repeat 4 [ … ]', 'repeat the block 4 times, nestable'],
      ],
      examples: {
        square: ['Square', 'color cyan\nrepeat 4 [ fd 140 rt 90 ]'],
        star: ['Star', 'color yellow\nwidth 4\nrepeat 5 [ fd 220 rt 144 ]'],
        spiral: ['Rainbow spiral', 'color rainbow\nrepeat 60 [ fd 160 rt 100 ]'],
        sun: ['Little sun', 'color orange\nrepeat 12 [ fd 120 bk 120 rt 30 ]'],
        flower: ['Spin flower', 'color rainbow\nwidth 2\nrepeat 24 [ repeat 4 [ fd 90 rt 90 ] rt 15 ]'],
      },
    },
  };
  let lang = localStorage.getItem('kidslab.lang') || 'zh';
  if (!I18N[lang]) lang = 'zh';

  const ALIASES = {
    fd: ['前进', 'fd', 'forward', 'qj'],
    bk: ['后退', 'bk', 'back', 'backward'],
    rt: ['右转', 'rt', 'right'],
    lt: ['左转', 'lt', 'left'],
    color: ['颜色', 'color', 'pc'],
    width: ['粗细', 'width', 'pw'],
    pu: ['抬笔', 'pu', 'penup'],
    pd: ['落笔', 'pd', 'pendown'],
    repeat: ['重复', 'repeat', 'rp'],
  };
  const CMD = {};
  for (const [key, words] of Object.entries(ALIASES)) words.forEach((w) => (CMD[w] = key));

  const COLORS = {
    '红': '#ff5d5d', red: '#ff5d5d',
    '橙': '#ff9e3d', orange: '#ff9e3d',
    '黄': '#ffd166', yellow: '#ffd166',
    '绿': '#3ddc84', green: '#3ddc84',
    '青': '#4cc9f0', cyan: '#4cc9f0',
    '蓝': '#5a8dff', blue: '#5a8dff',
    '紫': '#b388ff', purple: '#b388ff',
    '粉': '#ff8fc0', pink: '#ff8fc0',
    '白': '#f5f7ff', white: '#f5f7ff',
    '彩虹': 'rainbow', rainbow: 'rainbow',
  };

  const $ = (s) => document.querySelector(s);
  const canvas = $('#paper');
  const ctx = canvas.getContext('2d');

  /* ---------- 解析 ---------- */
  function tokenize(src) {
    return src
      .replace(/[［]/g, '[').replace(/[］]/g, ']')
      .replace(/([\[\]])/g, ' $1 ')
      .split(/[\s,，、]+/)
      .filter(Boolean);
  }

  function parse(tokens) {
    const t = I18N[lang];
    let i = 0;
    function block(depth) {
      const out = [];
      while (i < tokens.length) {
        const w = tokens[i];
        if (w === ']') {
          if (depth === 0) throw new Error(t.errBracket);
          i++;
          return out;
        }
        i++;
        const key = CMD[w.toLowerCase()] ?? CMD[w];
        if (!key) throw new Error(t.errUnknown(w));
        if (key === 'pu' || key === 'pd') { out.push({ op: key }); continue; }
        if (key === 'color') {
          const cw = tokens[i++];
          const c = COLORS[cw?.toLowerCase?.()] ?? COLORS[cw] ?? (/^#[0-9a-f]{3,8}$/i.test(cw || '') ? cw : null);
          if (!c) throw new Error(t.errUnknown(cw ?? w));
          out.push({ op: 'color', v: c });
          continue;
        }
        if (key === 'repeat') {
          const n = parseFloat(tokens[i++]);
          if (!isFinite(n)) throw new Error(t.errNum(w));
          if (tokens[i++] !== '[') throw new Error(t.errBracket);
          const body = block(depth + 1);
          out.push({ op: 'repeat', n: Math.min(Math.max(1, Math.round(n)), 500), body });
          continue;
        }
        const v = parseFloat(tokens[i++]);
        if (!isFinite(v)) throw new Error(t.errNum(w));
        out.push({ op: key, v });
      }
      if (depth !== 0) throw new Error(t.errBracket);
      return out;
    }
    return block(0);
  }

  /* ---------- 执行 → 线段列表 ---------- */
  function trace(prog) {
    const t = I18N[lang];
    const segs = [];
    const st = { x: 0, y: 0, a: -90, pen: true, color: '#4cc9f0', width: 3, hue: 0 };
    let steps = 0;
    function exec(list) {
      for (const c of list) {
        if (++steps > 20000) throw new Error(t.errTooMuch);
        switch (c.op) {
          case 'fd': case 'bk': {
            const d = c.op === 'fd' ? c.v : -c.v;
            const rad = (st.a * Math.PI) / 180;
            const nx = st.x + Math.cos(rad) * d;
            const ny = st.y + Math.sin(rad) * d;
            let col = st.color;
            if (col === 'rainbow') { col = `hsl(${st.hue % 360}, 90%, 62%)`; st.hue += 11; }
            if (st.pen) segs.push({ x0: st.x, y0: st.y, x1: nx, y1: ny, color: col, width: st.width });
            st.x = nx; st.y = ny;
            break;
          }
          case 'rt': st.a += c.v; break;
          case 'lt': st.a -= c.v; break;
          case 'color': st.color = c.v; break;
          case 'width': st.width = Math.min(20, Math.max(1, c.v)); break;
          case 'pu': st.pen = false; break;
          case 'pd': st.pen = true; break;
          case 'repeat': for (let k = 0; k < c.n; k++) exec(c.body); break;
        }
      }
    }
    exec(prog);
    return { segs, end: st };
  }

  /* ---------- 动画绘制 ---------- */
  let anim = null;
  function play(segs, endState) {
    cancelAnimationFrame(anim);
    const total = segs.reduce((s, g) => s + Math.hypot(g.x1 - g.x0, g.y1 - g.y0), 0);
    const speed = Math.max(240, total / 6); /* px per second，最长约 6 秒 */
    let dist = 0, last = performance.now();

    function frame(now) {
      dist += ((now - last) / 1000) * speed;
      last = now;
      let remain = dist, done = true, turtle = null;
      drawBase();
      for (const g of segs) {
        const len = Math.hypot(g.x1 - g.x0, g.y1 - g.y0);
        if (remain >= len) {
          drawSeg(g, 1);
          remain -= len;
        } else {
          const k = len ? remain / len : 1;
          drawSeg(g, k);
          turtle = { x: g.x0 + (g.x1 - g.x0) * k, y: g.y0 + (g.y1 - g.y0) * k, a: Math.atan2(g.y1 - g.y0, g.x1 - g.x0) };
          done = false;
          break;
        }
      }
      if (!turtle) turtle = { x: endState.x, y: endState.y, a: (endState.a * Math.PI) / 180 };
      drawTurtle(turtle);
      if (!done) anim = requestAnimationFrame(frame);
    }
    anim = requestAnimationFrame(frame);
  }

  const view = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    return { w: canvas.width, h: canvas.height, cx: canvas.width / 2, cy: canvas.height / 2, s: dpr * 0.72 };
  };

  function drawBase() {
    const { w, h } = view();
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#081410';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(6, 214, 160, 0.07)';
    ctx.lineWidth = 1;
    const g = 40 * (w / 900 + 0.5);
    for (let x = (w / 2) % g; x < w; x += g) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = (h / 2) % g; y < h; y += g) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  }

  function drawSeg(gseg, k) {
    const { cx, cy, s } = view();
    ctx.strokeStyle = gseg.color;
    ctx.lineWidth = gseg.width * s;
    ctx.lineCap = 'round';
    ctx.shadowColor = gseg.color;
    ctx.shadowBlur = 6 * s;
    ctx.beginPath();
    ctx.moveTo(cx + gseg.x0 * s, cy + gseg.y0 * s);
    ctx.lineTo(cx + (gseg.x0 + (gseg.x1 - gseg.x0) * k) * s, cy + (gseg.y0 + (gseg.y1 - gseg.y0) * k) * s);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function drawTurtle(tt) {
    const { cx, cy, s } = view();
    ctx.save();
    ctx.translate(cx + tt.x * s, cy + tt.y * s);
    ctx.rotate(tt.a + Math.PI / 2);
    ctx.font = `${26 * s}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐢', 0, 0);
    ctx.restore();
  }

  /* ---------- UI ---------- */
  function run() {
    const t = I18N[lang];
    const err = $('#errBox');
    err.hidden = true;
    try {
      const prog = parse(tokenize($('#code').value));
      const { segs, end } = trace(prog);
      play(segs, end);
    } catch (e) {
      err.textContent = `🐢💦 ${e.message}`;
      err.hidden = false;
    }
  }

  function renderExamples() {
    const t = I18N[lang];
    const box = $('#examples');
    box.innerHTML = '';
    for (const [name, code] of Object.values(t.examples)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = name;
      b.addEventListener('click', () => { $('#code').value = code; run(); });
      box.appendChild(b);
    }
  }

  function renderDocs() {
    $('#docsTable').innerHTML = I18N[lang].docs
      .map(([c, d]) => `<tr><td>${c}</td><td>${d}</td></tr>`)
      .join('');
  }

  function applyLang() {
    const t = I18N[lang];
    document.querySelectorAll('[data-t]').forEach((n) => { n.textContent = t[n.dataset.t]; });
    $('#langBtn').textContent = t.langBtn;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t.doc;
    renderExamples();
    renderDocs();
  }

  $('#runBtn').addEventListener('click', run);
  $('#clearBtn').addEventListener('click', () => { cancelAnimationFrame(anim); drawBase(); drawTurtle({ x: 0, y: 0, a: -Math.PI / 2 }); });
  $('#code').addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); }
  });
  $('#langBtn').addEventListener('click', () => {
    const prev = I18N[lang];
    const wasExample = Object.values(prev.examples).some(([, code]) => code === $('#code').value);
    lang = lang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('kidslab.lang', lang);
    applyLang();
    if (wasExample || !$('#code').value.trim()) $('#code').value = Object.values(I18N[lang].examples)[2][1];
  });

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    drawBase();
    drawTurtle({ x: 0, y: 0, a: -Math.PI / 2 });
  }
  addEventListener('resize', resize);

  applyLang();
  $('#code').value = I18N[lang].examples.spiral[1];
  resize();
  run();
})();
