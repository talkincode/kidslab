/* ============================================================
   KidsLab — 星图模式 Star Map
   全屏知识星座：课程 × 知识点 二部图，canvas 力导向布局。
   自包含模块：自行加载 courseware/index.json，
   从 CSS 变量读取学科色，从 <html lang> 读取语言。
   ============================================================ */
(() => {
  'use strict';

  const btn = document.getElementById('starmapBtn');
  const overlay = document.getElementById('starmap');
  if (!btn || !overlay) return;

  const canvas = overlay.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const closeBtn = overlay.querySelector('.starmap__close');
  const layoutBtn = overlay.querySelector('.starmap__layout');
  const titleEl = overlay.querySelector('.starmap__title');
  const hintEl = overlay.querySelector('.starmap__hint');
  const legendEl = overlay.querySelector('.starmap__legend');
  const infoEl = overlay.querySelector('.starmap__info');

  const I18N = {
    zh: {
      title: '知识星图',
      hint: '拖动漫游 · 滚轮缩放 · 点亮星星探索课程',
      close: '返回列表 (Esc)',
      courses: (n) => `${n} 门课件`,
      linked: (n) => `关联 ${n} 门课件`,
      open: '点击进入课程 →',
      layouts: { nebula: '星云', constellation: '星座', solar: '太阳系', galaxy: '银河系', blackhole: '黑洞', knowledge: '知识网' },
      layoutTip: '切换宇宙布局',
      focus: '点击聚焦这颗知识点 →',
      unfocus: '再点一次返回全景',
      cats: { featured: '精选', math: '数学', physics: '物理', chemistry: '化学', programming: '编程', science: '科学', logic: '逻辑' },
    },
    en: {
      title: 'Knowledge Star Map',
      hint: 'Drag to roam · scroll to zoom · light up a star to explore',
      close: 'Back to list (Esc)',
      courses: (n) => `${n} courseware`,
      linked: (n) => `linked to ${n} courseware`,
      open: 'Click to open →',
      layouts: { nebula: 'Nebula', constellation: 'Constellation', solar: 'Solar System', galaxy: 'Galaxy', blackhole: 'Black Hole', knowledge: 'Knowledge Web' },
      layoutTip: 'Switch cosmic layout',
      focus: 'Click to focus this topic →',
      unfocus: 'Click again for overview',
      cats: { featured: 'Featured', math: 'Math', physics: 'Physics', chemistry: 'Chemistry', programming: 'Coding', science: 'Science', logic: 'Logic' },
    },
  };
  const lang = () => ((document.documentElement.lang || 'zh').startsWith('zh') ? 'zh' : 'en');
  const t = () => I18N[lang()];

  const CAT_ORDER = ['math', 'programming', 'logic', 'featured', 'chemistry', 'physics', 'science'];
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const catColor = (cat) => cssVar(`--c-${cat}`) || '#ffd166';

  const TAG_COLOR = '#7ce7ff';   // ice cyan — distinct from every subject color
  const TAG_FILL = '#eafcff';    // near-white star core
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 图数据 ---------- */
  let nodes = [], edges = [], adj = new Map(), catAnchors = new Map();
  let manifest = null;

  async function loadGraph() {
    if (manifest) return;
    const r = await fetch('courseware/index.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    manifest = await r.json();

    const tagMeta = manifest.tags || {};
    const courses = manifest.courses || [];
    const tagNodes = new Map();

    nodes = []; edges = []; adj = new Map();

    for (const c of courses) {
      const node = {
        type: 'course', id: `c:${c.id}`, course: c,
        cat: c.pinned ? 'featured' : c.category,
        x: 0, y: 0, vx: 0, vy: 0, phase: Math.random() * Math.PI * 2,
      };
      nodes.push(node);
      for (const tag of c.tags || []) {
        if ((tagMeta[tag]?.kind || 'knowledge') !== 'knowledge') continue; /* form 标签不做节点 */
        let tn = tagNodes.get(tag);
        if (!tn) {
          tn = {
            type: 'tag', id: `t:${tag}`, tag, en: tagMeta[tag]?.en || tag, degree: 0,
            x: 0, y: 0, vx: 0, vy: 0, phase: Math.random() * Math.PI * 2,
          };
          tagNodes.set(tag, tn);
          nodes.push(tn);
        }
        tn.degree++;
        edges.push({ a: node, b: tn });
      }
    }
    for (const e of edges) {
      if (!adj.has(e.a.id)) adj.set(e.a.id, new Set());
      if (!adj.has(e.b.id)) adj.set(e.b.id, new Set());
      adj.get(e.a.id).add(e.b);
      adj.get(e.b.id).add(e.a);
    }

    /* 学科锚点排成圆环，初始位置围绕锚点撒开 */
    const cats = CAT_ORDER.filter((c) => nodes.some((n) => n.cat === c));
    catAnchors = new Map(cats.map((c, i) => {
      const ang = (i / cats.length) * Math.PI * 2 - Math.PI / 2;
      return [c, { ang, x: Math.cos(ang), y: Math.sin(ang) }];
    }));
    const R = 300;
    for (const n of nodes) {
      if (n.type === 'course') {
        const a = catAnchors.get(n.cat) || { x: 0, y: 0 };
        n.x = a.x * R + (Math.random() - 0.5) * 160;
        n.y = a.y * R + (Math.random() - 0.5) * 160;
      }
    }
    for (const n of nodes) {
      if (n.type === 'tag') {
        const nb = [...(adj.get(n.id) || [])];
        n.x = nb.reduce((s, m) => s + m.x, 0) / (nb.length || 1) + (Math.random() - 0.5) * 60;
        n.y = nb.reduce((s, m) => s + m.y, 0) / (nb.length || 1) + (Math.random() - 0.5) * 60;
      }
    }
  }

  /* ---------- 视图状态 ---------- */
  let cam = { x: 0, y: 0, s: 1 };
  let alpha = 0, hovered = null, selected = null;
  let raf = 0, running = false, tick0 = 0;
  let bgStars = [];
  const activeCats = new Set(); /* 空 = 全部显示 */
  let showTags = true;

  /* ---------- 宇宙布局状态 ---------- */
  const LAYOUTS = ['nebula', 'constellation', 'solar', 'galaxy', 'blackhole', 'knowledge'];
  const LAYOUT_ICONS = { nebula: '🌌', constellation: '✨', solar: '🪐', galaxy: '🌠', blackhole: '🕳️', knowledge: '🧠' };
  let layout = 'nebula';
  let tagFocus = null;   /* 知识网布局：当前聚焦的知识点 */
  let warp = 0;          /* 跃迁转场强度 1→0 */
  let camGoal = null;    /* 跃迁后的相机目标 */
  const effects = [];    /* 节点随机特效 */
  const meteors = [];    /* 流星 */
  let nebulae = [];      /* 背景星云 */
  let nextFx = 0, nextMeteor = 0, nextUfo = 0;
  let ufo = null;

  const catVisible = (cat) => activeCats.size === 0 || activeCats.has(cat);
  function visible(n) {
    if (n.type === 'course') return catVisible(n.cat);
    if (!showTags && layout !== 'knowledge') return false; /* 知识网布局里知识点始终是主角 */
    for (const m of adj.get(n.id) || []) if (catVisible(m.cat)) return true;
    return false;
  }

  /* ---------- 状态持久化：进入课程后可原样返回 ---------- */
  const STORE = 'kidslab.starmap';
  function saveState() {
    try {
      sessionStorage.setItem(STORE, JSON.stringify({
        open: true,
        layout,
        tagF: tagFocus?.id || null,
        cats: [...activeCats],
        showTags,
        cam,
        sel: selected?.id || null,
        pos: Object.fromEntries(nodes.map((n) => [n.id, [Math.round(n.x), Math.round(n.y)]])),
      }));
    } catch { /* ignore */ }
  }
  function loadState() {
    try { return JSON.parse(sessionStorage.getItem(STORE) || 'null'); } catch { return null; }
  }
  function clearState() {
    try { sessionStorage.removeItem(STORE); } catch { /* ignore */ }
  }

  const toScreen = (n) => ({ x: (n.x - cam.x) * cam.s + canvas.width / dpr() / 2, y: (n.y - cam.y) * cam.s + canvas.height / dpr() / 2 });
  const dpr = () => Math.min(devicePixelRatio || 1, 1.5); /* 星图全是辉光，1.5 足够，省 ~44% 填充率 */

  function resize() {
    const w = overlay.clientWidth, h = overlay.clientHeight;
    canvas.width = w * dpr(); canvas.height = h * dpr();
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
    bgStars = Array.from({ length: Math.round((w * h) / 9000) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3, phase: Math.random() * Math.PI * 2, sp: 0.4 + Math.random() * 1.2,
      par: 0.06 + Math.random() * 0.22, /* 视差系数：制造纵深 */
    }));
    if (!nebulae.length) initNebulae();
  }

  /* ---------- 光晕精灵缓存：drawImage 替代逐节点 shadowBlur（贵 5-10×） ---------- */
  const glowCache = new Map();
  function glowSprite(color) {
    let s = glowCache.get(color);
    if (!s) {
      const S = 64;
      s = document.createElement('canvas');
      s.width = S; s.height = S;
      const g = s.getContext('2d');
      const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      const hex = /^#[0-9a-f]{6}$/i.test(color) ? color : '#ffd166';
      grad.addColorStop(0, hex + 'aa');
      grad.addColorStop(0.35, hex + '55');
      grad.addColorStop(1, hex + '00');
      g.fillStyle = grad;
      g.fillRect(0, 0, S, S);
      glowCache.set(color, s);
    }
    return s;
  }
  function drawGlow(x, y, color, radius) {
    const d = radius * 2.4;
    ctx.drawImage(glowSprite(color), x - d / 2, y - d / 2, d, d);
  }

  /* ---------- emoji 精灵缓存：色彩字形光栅化极贵（~0.25ms/次），缓存后 drawImage 免费 ---------- */
  const emojiCache = new Map();
  function emojiSprite(ch) {
    let s = emojiCache.get(ch);
    if (!s) {
      const S = 64;
      s = document.createElement('canvas');
      s.width = S; s.height = S;
      const g = s.getContext('2d');
      g.font = `${Math.round(S * 0.72)}px serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(ch, S / 2, S / 2 + 2);
      emojiCache.set(ch, s);
    }
    return s;
  }
  function drawEmoji(ch, x, y, fontPx) {
    const d = fontPx * 1.39; /* 与精灵内 0.72 字号比例互补，视觉尺寸等同原 fillText */
    ctx.drawImage(emojiSprite(ch), x - d / 2, y - d / 2, d, d);
  }

  /* ---------- 宇宙背景：星云 / 流星 / 跃迁 ---------- */
  function makeBlob(hue) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, `hsla(${hue}, 80%, 62%, 0.5)`);
    grad.addColorStop(0.5, `hsla(${hue}, 75%, 50%, 0.16)`);
    grad.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
    g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
    return c;
  }
  function initNebulae() {
    nebulae = [265, 205, 320, 165].map((hue, i) => ({
      img: makeBlob(hue),
      fx: 0.12 + Math.random() * 0.76, fy: 0.1 + Math.random() * 0.8,
      s: 1.5 + Math.random() * 1.7,
      par: 0.03 + i * 0.02,
      ph: Math.random() * Math.PI * 2, sp: 0.04 + Math.random() * 0.06,
    }));
  }

  function drawBackground(tSec, w, h) {
    /* 漂移星云 */
    ctx.globalCompositeOperation = 'lighter';
    for (const nb of nebulae) {
      const size = 256 * nb.s;
      const x = nb.fx * w + Math.sin(tSec * nb.sp + nb.ph) * 46 - cam.x * cam.s * nb.par - size / 2;
      const y = nb.fy * h + Math.cos(tSec * nb.sp * 0.8 + nb.ph) * 34 - cam.y * cam.s * nb.par - size / 2;
      ctx.globalAlpha = reducedMotion ? 0.5 : 0.42 + 0.18 * Math.sin(tSec * 0.3 + nb.ph);
      ctx.drawImage(nb.img, x, y, size, size);
    }
    ctx.globalCompositeOperation = 'source-over';

    /* 星尘（带视差；跃迁时拉成流光） */
    const cx0 = w / 2, cy0 = h / 2;
    for (const s of bgStars) {
      const sx = (((s.x - cam.x * cam.s * s.par) % w) + w) % w;
      const sy = (((s.y - cam.y * cam.s * s.par) % h) + h) % h;
      if (warp > 0.03) {
        const dx = sx - cx0, dy = sy - cy0;
        ctx.globalAlpha = 0.25 + 0.55 * warp;
        ctx.strokeStyle = '#bfe9ff'; ctx.lineWidth = s.r; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + dx * warp * 0.7, sy + dy * warp * 0.7); ctx.stroke();
      } else {
        ctx.globalAlpha = reducedMotion ? 0.55 : 0.35 + 0.35 * Math.sin(tSec * s.sp + s.phase);
        ctx.fillStyle = '#cdd6ff';
        ctx.beginPath(); ctx.arc(sx, sy, s.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    /* 流星 */
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.life -= m.decay;
      if (m.life <= 0 || m.y > h + 40 || m.x < -40 || m.x > w + 40) { meteors.splice(i, 1); continue; }
      const tx = m.x - m.vx * 9, ty = m.y - m.vy * 9;
      const g = ctx.createLinearGradient(tx, ty, m.x, m.y);
      g.addColorStop(0, 'rgba(124, 231, 255, 0)');
      g.addColorStop(1, `rgba(235, 248, 255, ${0.85 * m.life})`);
      ctx.strokeStyle = g; ctx.lineWidth = 1.7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(m.x, m.y); ctx.stroke();
    }

    /* 跃迁闪光 */
    if (warp > 0.03) {
      ctx.globalAlpha = warp * 0.16;
      ctx.fillStyle = '#cfe9ff';
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }
  }

  /* 布局中心天体：太阳 / 银心 / 黑洞 */
  function drawCenterpiece(tSec) {
    if (layout === 'nebula' || layout === 'constellation') return;
    const c = toScreen({ x: 0, y: 0 });
    if (layout === 'knowledge') {
      if (!tagFocus) return;
      /* 聚焦知识点身后的冰蓝光冕 + 关系环 */
      const r = 90 * cam.s;
      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r * 2);
      g.addColorStop(0, 'rgba(124, 231, 255, 0.35)');
      g.addColorStop(0.5, 'rgba(124, 231, 255, 0.10)');
      g.addColorStop(1, 'rgba(124, 231, 255, 0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(c.x, c.y, r * 2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(124, 231, 255, 0.14)'; ctx.lineWidth = 1;
      for (const rr of [185, 375]) {
        ctx.beginPath(); ctx.arc(c.x, c.y, rr * cam.s, 0, Math.PI * 2); ctx.stroke();
      }
      return;
    }
    if (layout === 'solar') {
      const r = 44 * cam.s;
      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r * 2.3);
      g.addColorStop(0, 'rgba(255, 247, 214, 1)');
      g.addColorStop(0.26, 'rgba(255, 183, 3, 0.92)');
      g.addColorStop(0.6, 'rgba(255, 120, 40, 0.22)');
      g.addColorStop(1, 'rgba(255, 120, 40, 0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(c.x, c.y, r * 2.3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(141, 150, 200, 0.16)'; ctx.lineWidth = 1;
      for (let i = 0; i < visCatCount; i++) {
        ctx.beginPath(); ctx.arc(c.x, c.y, (150 + i * 82) * cam.s, 0, Math.PI * 2); ctx.stroke();
      }
    } else if (layout === 'galaxy') {
      const r = 62 * cam.s;
      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r * 2);
      g.addColorStop(0, 'rgba(255, 244, 224, 0.95)');
      g.addColorStop(0.4, 'rgba(255, 214, 160, 0.32)');
      g.addColorStop(1, 'rgba(255, 214, 160, 0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(c.x, c.y, r * 2, 0, Math.PI * 2); ctx.fill();
    } else if (layout === 'blackhole') {
      const r = 50 * cam.s;
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI * 2); ctx.fill();
      const spin = reducedMotion ? 0 : tSec * 1.4;
      const rings = [
        { off: 2.5, width: 3, color: 'rgba(255, 214, 102, 0.9)', glow: '#ffd166' },
        { off: 8, width: 1.6, color: 'rgba(124, 231, 255, 0.8)', glow: '#7ce7ff' },
      ];
      rings.forEach((ring, i) => {
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.width * Math.max(0.6, cam.s);
        ctx.shadowColor = ring.glow; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(c.x, c.y, r + ring.off * cam.s, spin + i * 1.3, spin + i * 1.3 + 5.1); ctx.stroke();
      });
      ctx.shadowBlur = 0;
    }
  }

  /* ---------- 随机节点特效 ---------- */
  function spawnAmbient(now) {
    if (reducedMotion || warp > 0.05) return;
    const w = overlay.clientWidth, h = overlay.clientHeight;
    if (now >= nextFx && effects.length < 4) {
      nextFx = now + 2200 + Math.random() * 2600;
      const vis = nodes.filter((n) => {
        if (!visible(n)) return false;
        const p = toScreen(n);
        return p.x > 50 && p.y > 70 && p.x < w - 50 && p.y < h - 90;
      });
      if (vis.length) {
        const n = vis[(Math.random() * vis.length) | 0];
        const kinds = ['ring', 'sparkle', 'comet'];
        const nb = [...(adj.get(n.id) || [])].filter(visible);
        if (nb.length && n.type === 'course') kinds.push('ship', 'ship');
        const kind = kinds[(Math.random() * kinds.length) | 0];
        const fx = {
          kind, n, t0: now,
          dur: kind === 'ship' ? 2100 : kind === 'comet' ? 2500 : 1300,
          phase: Math.random() * Math.PI * 2,
        };
        if (kind === 'ship') fx.to = nb[(Math.random() * nb.length) | 0];
        if (kind === 'sparkle') {
          fx.parts = Array.from({ length: 7 }, () => ({
            a: Math.random() * Math.PI * 2, d: 24 + Math.random() * 28, r: Math.random(),
          }));
        }
        effects.push(fx);
      }
    }
    if (now >= nextMeteor) {
      nextMeteor = now + 3500 + Math.random() * 5500;
      meteors.push({
        x: w * (0.1 + Math.random() * 0.8), y: -20,
        vx: (Math.random() - 0.3) * 3.4, vy: 2.6 + Math.random() * 2.2,
        life: 1, decay: 0.009 + Math.random() * 0.007,
      });
    }
    if (now >= nextUfo) {
      nextUfo = now + 20000 + Math.random() * 18000;
      ufo = { y: h * (0.15 + Math.random() * 0.5), dir: Math.random() < 0.5 ? 1 : -1, t0: now, dur: 7500 };
    }
  }

  function drawEffects(now) {
    const colorOf = (n) => n.type === 'tag' ? TAG_COLOR : catColor(n.cat);
    for (let i = effects.length - 1; i >= 0; i--) {
      const fx = effects[i];
      const t = (now - fx.t0) / fx.dur;
      if (t >= 1 || !visible(fx.n) || (fx.to && !visible(fx.to))) { effects.splice(i, 1); continue; }
      const p = toScreen(fx.n);
      const col = colorOf(fx.n);

      if (fx.kind === 'ring') {
        for (const off of [0, 0.28]) {
          const tt = (t - off) / (1 - off);
          if (tt <= 0) continue;
          ctx.globalAlpha = (1 - tt) * 0.8;
          ctx.strokeStyle = col; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(p.x, p.y, nodeRadius(fx.n) + tt * 48 * cam.s, 0, Math.PI * 2); ctx.stroke();
        }
      } else if (fx.kind === 'sparkle') {
        const e = 1 - (1 - t) ** 3;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (const s of fx.parts) {
          ctx.globalAlpha = 1 - t;
          ctx.fillStyle = s.r > 0.5 ? '#ffffff' : col;
          ctx.font = `${Math.round(7 + s.r * 6)}px serif`;
          ctx.fillText('✦', p.x + Math.cos(s.a) * s.d * e * cam.s, p.y + Math.sin(s.a) * s.d * e * cam.s);
        }
        ctx.textBaseline = 'alphabetic';
      } else if (fx.kind === 'comet') {
        /* 彗焰尾：轨道节点沿切线反向，其余用随机固定方向 */
        const o = fx.n.orbit;
        const ang = o ? o.a + (o.sp >= 0 ? -Math.PI / 2 : Math.PI / 2) + Math.PI : fx.phase;
        const fade = Math.sin(Math.PI * Math.min(1, t * 1.05));
        const len = (26 + Math.sin(now / 55 + fx.phase) * 6) * cam.s;
        const spread = 0.42;
        const layers = [
          ['rgba(255, 120, 40, 0.55)', 1],
          ['rgba(255, 190, 60, 0.6)', 0.66],
          ['rgba(255, 244, 214, 0.75)', 0.36],
        ];
        for (const [color, k] of layers) {
          ctx.globalAlpha = fade;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(p.x + Math.cos(ang) * len * k, p.y + Math.sin(ang) * len * k);
          ctx.lineTo(p.x + Math.cos(ang + Math.PI - spread) * nodeRadius(fx.n), p.y + Math.sin(ang + Math.PI - spread) * nodeRadius(fx.n));
          ctx.lineTo(p.x + Math.cos(ang + Math.PI + spread) * nodeRadius(fx.n), p.y + Math.sin(ang + Math.PI + spread) * nodeRadius(fx.n));
          ctx.closePath(); ctx.fill();
        }
      } else if (fx.kind === 'ship') {
        const to = toScreen(fx.to);
        const e = t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
        const x = p.x + (to.x - p.x) * e, y = p.y + (to.y - p.y) * e;
        ctx.globalAlpha = Math.min(1, 4 * t, 4 * (1 - t)) * 0.4;
        ctx.strokeStyle = '#7ce7ff'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
        const trail = Math.max(0, e - 0.14);
        ctx.beginPath();
        ctx.moveTo(p.x + (to.x - p.x) * trail, p.y + (to.y - p.y) * trail);
        ctx.lineTo(x, y); ctx.stroke();
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.atan2(to.y - p.y, to.x - p.x) + Math.PI / 4); /* 🚀 朝向东北 */
        ctx.globalAlpha = Math.min(1, 4 * t, 4 * (1 - t));
        drawEmoji('🚀', 0, 0, 16);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    /* 神秘 UFO 掠过 */
    if (ufo) {
      const t = (now - ufo.t0) / ufo.dur;
      if (t >= 1) { ufo = null; } else {
        const w = overlay.clientWidth;
        const x = ufo.dir > 0 ? -40 + (w + 80) * t : w + 40 - (w + 80) * t;
        const y = ufo.y + Math.sin(t * 13) * 18;
        ctx.globalAlpha = 0.95;
        drawEmoji('🛸', x, y, 22);
        ctx.globalAlpha = 1;
      }
    }
  }

  function fitView() {
    if (!nodes.length) return;
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (const n of nodes) { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y); }
    cam.x = (minX + maxX) / 2; cam.y = (minY + maxY) / 2;
    const w = overlay.clientWidth, h = overlay.clientHeight;
    cam.s = Math.min(2, Math.max(0.35, 0.82 * Math.min(w / (maxX - minX + 200), h / (maxY - minY + 200))));
  }

  /* ---------- 宇宙布局算法（只排布当前可见的星星） ---------- */
  const courseNodes = () => nodes.filter((n) => n.type === 'course');
  let visCatCount = 1; /* 最近一次布局的可见学科数，用于估算取景半径 */
  let visTagCount = 1; /* 知识网布局的可见知识点数 */
  let egoSet = null;   /* 知识网聚焦模式：焦点关系网集合 */
  const GA = Math.PI * (3 - Math.sqrt(5)); /* 黄金角，向日葵螺旋 */

  /* 知识点变成卫星：绕关联度最高的可见课程公转 */
  function moonifyTags(speed = 1) {
    for (const n of nodes) {
      if (n.type !== 'tag') continue;
      const hosts = [...(adj.get(n.id) || [])].filter((m) => catVisible(m.cat));
      const host = hosts.sort((a, b) => (adj.get(b.id)?.size || 0) - (adj.get(a.id)?.size || 0))[0];
      n.orbit = null;
      n.moon = host ? {
        host, r: 30 + Math.random() * 22,
        a: Math.random() * Math.PI * 2,
        sp: reducedMotion ? 0 : (0.5 + Math.random() * 0.5) * speed * (Math.random() < 0.5 ? 1 : -1),
      } : null;
    }
  }

  function setLayoutTargets() {
    const cats = [...catAnchors.keys()].filter(catVisible);
    visCatCount = Math.max(1, cats.length);
    const byCat = new Map(cats.map((c) => [c, courseNodes().filter((n) => n.cat === c)]));
    for (const n of nodes) { n.orbit = null; n.moon = null; n.tx = undefined; n.ty = undefined; }

    if (layout === 'constellation') {
      /* 每个可见学科一片星座：课程沿随机折线连成星官 */
      const ringR = cats.length === 1 ? 0 : 360;
      cats.forEach((c, ci) => {
        const ang0 = (ci / cats.length) * Math.PI * 2 - Math.PI / 2;
        let px = Math.cos(ang0) * ringR, py = Math.sin(ang0) * ringR;
        let ang = cats.length === 1 ? Math.random() * Math.PI * 2 : Math.atan2(-py, -px) + (Math.random() - 0.5) * 2;
        for (const n of byCat.get(c)) {
          n.tx = px; n.ty = py;
          ang += (Math.random() - 0.5) * 1.9;
          px += Math.cos(ang) * 88; py += Math.sin(ang) * 88;
        }
      });
      /* 知识点静立在可见关联课程们的重心旁 */
      for (const n of nodes) {
        if (n.type !== 'tag') continue;
        const nb = [...(adj.get(n.id) || [])].filter((m) => catVisible(m.cat));
        if (!nb.length) continue;
        const gx = nb.reduce((s, m) => s + (m.tx ?? m.x), 0) / nb.length;
        const gy = nb.reduce((s, m) => s + (m.ty ?? m.y), 0) / nb.length;
        n.tx = gx + (Math.random() - 0.5) * 70;
        n.ty = gy + (Math.random() - 0.5) * 70;
      }
    } else if (layout === 'solar') {
      /* 可见学科 = 行星轨道环，课程公转；知识点 = 卫星 */
      cats.forEach((c, ci) => {
        const r = 150 + ci * 82;
        const list = byCat.get(c);
        list.forEach((n, i) => {
          n.orbit = {
            r, a: (i / list.length) * Math.PI * 2 + ci * 0.9,
            sp: reducedMotion ? 0 : 0.16 / Math.sqrt(r / 150),
          };
        });
      });
      moonifyTags(1);
    } else if (layout === 'galaxy') {
      /* 对数螺旋悬臂，缓慢自转 */
      const ordered = cats.flatMap((c) => byCat.get(c));
      const ARMS = Math.min(3, Math.max(1, Math.ceil(ordered.length / 8)));
      ordered.forEach((n, i) => {
        const tt = i / Math.max(1, ordered.length - 1);
        n.orbit = {
          r: 70 + 400 * tt,
          a: tt * 3.8 + (i % ARMS) * (Math.PI * 2 / ARMS),
          sp: reducedMotion ? 0 : 0.07 / (0.35 + tt),
        };
      });
      moonifyTags(0.8);
    } else if (layout === 'blackhole') {
      /* 吸积盘：越靠近视界转得越快 */
      const all = cats.flatMap((c) => byCat.get(c));
      all.forEach((n, i) => {
        const tt = i / Math.max(1, all.length - 1);
        n.orbit = {
          r: 118 + 330 * tt,
          a: Math.random() * Math.PI * 2,
          sp: reducedMotion ? 0 : 0.3 / (0.28 + tt),
        };
      });
      moonifyTags(1.6);
    } else if (layout === 'knowledge') {
      const tags = nodes.filter((n) => n.type === 'tag' && visible(n)).sort((a, b) => b.degree - a.degree);
      visTagCount = Math.max(1, tags.length);
      if (tagFocus && visible(tagFocus)) {
        /* 聚焦：知识点居中，关联课程内环公转，共现知识点外环，其余星星推向远处 */
        const nbCourses = [...(adj.get(tagFocus.id) || [])].filter((m) => catVisible(m.cat));
        const ring2 = new Set();
        for (const c of nbCourses) {
          for (const m of adj.get(c.id) || []) if (m !== tagFocus && m.type === 'tag' && visible(m)) ring2.add(m);
        }
        egoSet = new Set([tagFocus, ...nbCourses, ...ring2]);
        tagFocus.tx = 0; tagFocus.ty = 0;
        nbCourses.forEach((n, i) => {
          n.orbit = { r: 185, a: (i / nbCourses.length) * Math.PI * 2, sp: reducedMotion ? 0 : 0.06 };
        });
        [...ring2].forEach((n, i, arr) => {
          n.orbit = { r: 375, a: (i / arr.length) * Math.PI * 2 + 0.4, sp: reducedMotion ? 0 : -0.035 };
        });
        let k = 0;
        for (const n of nodes) {
          if (!visible(n) || egoSet.has(n)) continue;
          const a = k * GA, r = 620 + 34 * Math.sqrt(k); k++;
          n.tx = Math.cos(a) * r; n.ty = Math.sin(a) * r;
        }
      } else {
        /* 全景：知识点按关联度做向日葵螺旋（枢纽在中心），课程缩成绕知识点的卫星 */
        egoSet = null; tagFocus = null;
        tags.forEach((n, i) => {
          const r = 74 * Math.sqrt(i + 0.35), a = i * GA;
          n.tx = Math.cos(a) * r; n.ty = Math.sin(a) * r;
        });
        const orphans = [];
        for (const n of courseNodes()) {
          if (!catVisible(n.cat)) continue;
          const hubs = [...(adj.get(n.id) || [])].filter(visible).sort((a, b) => b.degree - a.degree);
          if (hubs[0]) {
            n.moon = {
              host: hubs[0], r: 34 + Math.random() * 20, a: Math.random() * Math.PI * 2,
              sp: reducedMotion ? 0 : (0.3 + Math.random() * 0.4) * (Math.random() < 0.5 ? 1 : -1),
            };
          } else orphans.push(n);
        }
        const edgeR = 74 * Math.sqrt(visTagCount) + 130;
        orphans.forEach((n, i) => {
          const a = (i / orphans.length) * Math.PI * 2;
          n.tx = Math.cos(a) * edgeR; n.ty = Math.sin(a) * edgeR;
        });
      }
    }
  }

  /* 恢复会话时：让轨道参数贴合已保存的星星位置，避免跳变 */
  function syncOrbitsToPositions() {
    for (const n of nodes) {
      if (n.orbit) {
        n.orbit.r = Math.hypot(n.x, n.y) || n.orbit.r;
        n.orbit.a = Math.atan2(n.y, n.x);
      } else if (n.moon?.host) {
        const dx = n.x - n.moon.host.x, dy = n.y - n.moon.host.y;
        n.moon.r = Math.hypot(dx, dy) || n.moon.r;
        n.moon.a = Math.atan2(dy, dx);
      } else if (layout !== 'nebula') {
        n.tx = n.x; n.ty = n.y;
      }
    }
  }

  function layoutMaxR() {
    const shrink = Math.sqrt(visCatCount / Math.max(1, catAnchors.size)); /* 学科少时收紧取景 */
    return {
      nebula: 0,
      constellation: visCatCount === 1 ? 380 : 520,
      solar: 150 + (visCatCount - 1) * 82 + 60,
      galaxy: 420 * shrink + 80,
      blackhole: 390 * shrink + 80,
      knowledge: tagFocus ? 430 : 74 * Math.sqrt(visTagCount) + 170,
    }[layout] || 480;
  }

  /* 重排当前可见星星：布局切换与分类过滤共用 */
  let anchorOff = { x: 0, y: 0 };
  function relayout(intensity) {
    if (layout === 'nebula') {
      const vis = [...catAnchors.entries()].filter(([c]) => catVisible(c)).map(([, a]) => a);
      anchorOff = vis.length
        ? { x: vis.reduce((s, a) => s + a.x, 0) / vis.length, y: vis.reduce((s, a) => s + a.y, 0) / vis.length }
        : { x: 0, y: 0 };
      alpha = Math.max(alpha, 0.9); /* 重新点燃力导向 */
    } else {
      setLayoutTargets();
    }
    const maxR = layoutMaxR() || 460;
    const w = overlay.clientWidth, h = overlay.clientHeight;
    if (layout !== 'nebula') {
      camGoal = { x: 0, y: 0, s: Math.min(2, Math.max(0.3, Math.min(w, h) / (maxR * 2 + 160))) };
    }
    warp = reducedMotion ? 0.001 : intensity;
    if (reducedMotion && camGoal) { cam = { ...camGoal }; camGoal = null; }
    effects.length = 0;
  }

  function switchLayout(next) {
    layout = next;
    tagFocus = null; egoSet = null;
    selected = null; hovered = null; renderInfo();
    relayout(1);
    renderChrome();
  }

  /* ---------- 布局步进 ---------- */
  function step() {
    if (layout !== 'nebula') { orbitStep(); return; }
    const R = Math.min(overlay.clientWidth, overlay.clientHeight) * 0.42;
    /* 斥力（只作用于可见星星） */
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (!visible(a)) continue;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        if (!visible(b)) continue;
        let dx = a.x - b.x, dy = a.y - b.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d2 = 1; }
        if (d2 > 260 * 260) continue;
        const f = (2400 / d2) * alpha;
        const d = Math.sqrt(d2);
        a.vx += (dx / d) * f; a.vy += (dy / d) * f;
        b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
      }
    }
    /* 弹簧 */
    for (const { a, b } of edges) {
      if (!visible(a) || !visible(b)) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = (d - 80) * 0.028 * alpha;
      a.vx += (dx / d) * f; a.vy += (dy / d) * f;
      b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
    }
    /* 学科锚点引力 + 向心力（锚点重心对齐画面中心） */
    for (const n of nodes) {
      if (!visible(n)) continue;
      if (n.type === 'course') {
        const anc = catAnchors.get(n.cat);
        if (anc) { n.vx += ((anc.x - anchorOff.x) * R - n.x) * 0.012 * alpha; n.vy += ((anc.y - anchorOff.y) * R - n.y) * 0.012 * alpha; }
      } else {
        n.vx -= n.x * 0.002 * alpha; n.vy -= n.y * 0.002 * alpha;
      }
      if (n === dragNode) { n.vx = 0; n.vy = 0; continue; }
      n.vx *= 0.86; n.vy *= 0.86;
      n.x += n.vx; n.y += n.vy;
    }
    alpha = Math.max(reducedMotion ? 0 : 0.02, alpha * 0.985);
  }

  /* 固定/轨道布局：星星弹性飞向目标位，轨道随时间公转 */
  function orbitStep() {
    const k = warp > 0.05 ? 0.16 : 0.07;
    for (const n of nodes) {
      if (n === dragNode) continue;
      let tx, ty;
      if (n.orbit) {
        n.orbit.a += n.orbit.sp * 0.016;
        tx = Math.cos(n.orbit.a) * n.orbit.r;
        ty = Math.sin(n.orbit.a) * n.orbit.r;
      } else if (n.moon?.host) {
        n.moon.a += n.moon.sp * 0.016;
        tx = n.moon.host.x + Math.cos(n.moon.a) * n.moon.r;
        ty = n.moon.host.y + Math.sin(n.moon.a) * n.moon.r;
      } else if (n.tx !== undefined) {
        tx = n.tx; ty = n.ty;
      } else continue;
      n.x += (tx - n.x) * k;
      n.y += (ty - n.y) * k;
    }
  }

  /* ---------- 渲染 ---------- */
  const nodeRadius = (n) => {
    if (layout === 'knowledge') {
      if (n.type === 'tag') return (n === tagFocus ? 6 : 0) + Math.min(7 + n.degree * 1.5, 18);
      return (tagFocus && egoSet?.has(n)) ? 11 : 7; /* 全景时课程收敛成小卫星 */
    }
    return n.type === 'course' ? 13 : Math.min(4 + n.degree * 1.4, 10);
  };

  function draw(now) {
    const w = overlay.clientWidth, h = overlay.clientHeight;
    ctx.clearRect(0, 0, w, h);
    const tSec = (now - tick0) / 1000;

    drawBackground(tSec, w, h);
    drawCenterpiece(tSec);

    const focus = selected || hovered;
    const focusSet = focus ? new Set([focus, ...(adj.get(focus.id) || [])]) : null;
    const ego = (layout === 'knowledge' && tagFocus) ? egoSet : null;
    const dimmed = (n) => ego ? !ego.has(n) : (focusSet && !focusSet.has(n));

    /* 带深色描边的标签文字，保证任意背景下可读 */
    const drawLabel = (text, x, y, color, weight) => {
      ctx.font = `${weight} 12px "Baloo 2", "PingFang SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(10, 12, 40, 0.9)';
      ctx.lineWidth = 3; ctx.lineJoin = 'round';
      ctx.strokeText(text, x, y);
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      ctx.lineWidth = 1;
    };

    /* 边 */
    ctx.lineWidth = 1;
    for (const e of edges) {
      if (!visible(e.a) || !visible(e.b)) continue;
      const pa = toScreen(e.a), pb = toScreen(e.b);
      const lit = focusSet && focusSet.has(e.a) && focusSet.has(e.b) && (focus === e.a || focus === e.b);
      ctx.strokeStyle = lit ? catColor(e.a.cat) : '#8d96c8';
      ctx.globalAlpha = ego
        ? (lit ? 0.9 : (ego.has(e.a) && ego.has(e.b) ? 0.3 : 0.03))
        : (lit ? 0.85 : (focusSet ? 0.05 : 0.16));
      ctx.lineWidth = lit ? 1.6 : 1;
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* 节点 */
    const showAllLabels = cam.s > 0.85;
    for (const n of nodes) {
      if (!visible(n)) continue;
      const p = toScreen(n);
      if (p.x < -60 || p.y < -60 || p.x > w + 60 || p.y > h + 60) continue;
      const r = nodeRadius(n) * (n === focus ? 1.25 : 1);
      const dim = dimmed(n);
      ctx.globalAlpha = dim ? (ego ? 0.08 : 0.14) : 1;

      if (n.type === 'tag') {
        const glow = reducedMotion ? 0.75 : 0.6 + 0.4 * Math.sin(tSec * 1.4 + n.phase);
        if (!dim) drawGlow(p.x, p.y, TAG_COLOR, r + (n === tagFocus ? 30 : 12 * glow));
        ctx.fillStyle = TAG_FILL;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        const wantLabel = layout === 'knowledge'
          ? (ego ? ego.has(n) : (showAllLabels || n.degree >= 2 || cam.s > 0.5))
          : (showAllLabels || n.degree >= 2 || focusSet?.has(n));
        if (!dim && wantLabel) {
          drawLabel(lang() === 'zh' ? n.tag : n.en, p.x, p.y + r + 14, TAG_COLOR, '600');
        }
      } else {
        const col = catColor(n.cat);
        /* 知识网全景：课程只是暗淡卫星，避免抢知识点的戏；悬停/选中/关系网内恢复亮度 */
        const muted = layout === 'knowledge' && !ego && !dim
          && n !== focus && !(focusSet?.has(n));
        if (muted) ctx.globalAlpha = 0.3;
        if (!dim && !muted) drawGlow(p.x, p.y, col, r + (n === focus ? 22 : 12));
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        if (!muted) {
          drawEmoji(n.course.icon || '📘', p.x, p.y + 1, Math.round(r * 1.25));
        }
        if (!dim && !muted && (showAllLabels || focusSet?.has(n))) {
          drawLabel(n.course.title?.[lang()] || n.course.id, p.x, p.y + r + 15, '#ffffff', '700');
        }
      }
    }
    ctx.globalAlpha = 1;
    drawEffects(now);
  }

  function loop(now) {
    if (!running) return;
    if (warp > 0) {
      warp = warp < 0.03 ? 0 : warp * 0.94;
      if (camGoal) {
        cam.x += (camGoal.x - cam.x) * 0.1;
        cam.y += (camGoal.y - cam.y) * 0.1;
        cam.s += (camGoal.s - cam.s) * 0.1;
        if (warp === 0) camGoal = null;
      }
    }
    spawnAmbient(now);
    /* 力导向休眠：星云布局静止后跳过 O(n²) 物理，交互/过滤会重新点燃 alpha */
    const asleep = layout === 'nebula' && alpha <= 0.021 && !dragNode && warp === 0;
    if (!asleep) step();
    draw(now);
    raf = requestAnimationFrame(loop);
  }

  /* ---------- 信息卡 ---------- */
  function renderInfo() {
    const n = selected || hovered;
    if (!n) { infoEl.hidden = true; return; }
    infoEl.hidden = false;
    if (n.type === 'course') {
      const c = n.course;
      infoEl.innerHTML = `<b>${c.icon || ''} ${esc(c.title?.[lang()] || c.id)}</b>
        <p>${esc(c.description?.[lang()] || '')}</p>
        <small>${t().open}</small>`;
    } else {
      const hint = layout === 'knowledge'
        ? `<small>${n === tagFocus ? t().unfocus : t().focus}</small>`
        : '';
      infoEl.innerHTML = `<b>✨ ${esc(lang() === 'zh' ? n.tag : n.en)}</b>
        <p>${t().linked(n.degree)}</p>${hint}`;
    }
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  function renderChrome() {
    titleEl.textContent = t().title;
    hintEl.textContent = t().hint;
    closeBtn.title = t().close;
    layoutBtn.textContent = `${LAYOUT_ICONS[layout]} ${t().layouts[layout]}`;
    layoutBtn.title = t().layoutTip;
    legendEl.innerHTML = '';
    const chip = (label, color, active, round, onClick) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'starmap__lg' + (active ? ' is-on' : '');
      b.innerHTML = `<i style="background:${color}${round ? ';border-radius:50%' : ''}"></i>${label}`;
      b.addEventListener('click', onClick);
      legendEl.appendChild(b);
    };
    for (const c of catAnchors.keys()) {
      chip(t().cats[c] || c, catColor(c), catVisible(c), false, () => {
        if (activeCats.has(c)) activeCats.delete(c);
        else activeCats.add(c);
        if (activeCats.size === catAnchors.size) activeCats.clear(); /* 全选 = 不过滤 */
        applyFilter();
      });
    }
    chip(lang() === 'zh' ? '知识点' : 'Topics', TAG_COLOR, showTags, true, () => {
      showTags = !showTags;
      applyFilter();
    });
  }

  function applyFilter() {
    if (tagFocus && !visible(tagFocus)) { tagFocus = null; egoSet = null; }
    if (selected && !visible(selected)) selected = null;
    if (hovered && !visible(hovered)) hovered = null;
    relayout(0.55); /* 过滤后剩余星星自动重排 */
    renderChrome();
    renderInfo();
  }

  /* ---------- 交互 ---------- */
  let dragNode = null, panning = false, moved = 0;
  let last = { x: 0, y: 0 };
  const pointers = new Map();
  let pinchD = 0;

  function hitTest(sx, sy) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (!visible(nodes[i])) continue;
      const p = toScreen(nodes[i]);
      const r = nodeRadius(nodes[i]) + 6;
      if ((p.x - sx) ** 2 + (p.y - sy) ** 2 <= r * r) return nodes[i];
    }
    return null;
  }
  const toWorld = (sx, sy) => ({ x: (sx - overlay.clientWidth / 2) / cam.s + cam.x, y: (sy - overlay.clientHeight / 2) / cam.s + cam.y });

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchD = Math.hypot(a.x - b.x, a.y - b.y);
      dragNode = null; panning = false;
      return;
    }
    moved = 0; last = { x: e.offsetX, y: e.offsetY };
    dragNode = hitTest(e.offsetX, e.offsetY);
    panning = !dragNode;
  });

  canvas.addEventListener('pointermove', (e) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchD > 0) zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, d / pinchD);
      pinchD = d;
      return;
    }
    const dx = e.offsetX - last.x, dy = e.offsetY - last.y;
    if (dragNode && pointers.size === 1) {
      const wpt = toWorld(e.offsetX, e.offsetY);
      dragNode.x = wpt.x; dragNode.y = wpt.y;
      alpha = Math.max(alpha, 0.25);
      moved += Math.abs(dx) + Math.abs(dy);
      last = { x: e.offsetX, y: e.offsetY };
      return;
    }
    if (panning && pointers.size === 1) {
      cam.x -= dx / cam.s; cam.y -= dy / cam.s;
      moved += Math.abs(dx) + Math.abs(dy);
      last = { x: e.offsetX, y: e.offsetY };
      return;
    }
    const h = hitTest(e.offsetX, e.offsetY);
    if (h !== hovered) { hovered = h; canvas.style.cursor = h ? 'pointer' : 'grab'; renderInfo(); }
  });

  canvas.addEventListener('pointerup', (e) => {
    pointers.delete(e.pointerId);
    pinchD = 0;
    const wasDrag = dragNode;
    if (moved < 6) {
      const n = hitTest(e.offsetX, e.offsetY);
      if (n?.type === 'course') { saveState(); location.href = n.course.path; return; }
      if (layout === 'knowledge') {
        /* 知识网：点知识点聚焦其关系，再点它或点空白返回全景 */
        const next = (n?.type === 'tag' && n !== tagFocus) ? n : null;
        if (next !== tagFocus) {
          tagFocus = next;
          selected = next;
          relayout(0.45);
          renderInfo();
          dragNode = null; panning = false;
          return;
        }
      }
      selected = (n && n !== selected) ? n : null;
      renderInfo();
    }
    dragNode = null; panning = false;
    if (wasDrag) alpha = Math.max(alpha, 0.2);
  });
  canvas.addEventListener('pointercancel', (e) => { pointers.delete(e.pointerId); dragNode = null; panning = false; pinchD = 0; });

  function zoomAt(sx, sy, factor) {
    const before = toWorld(sx, sy);
    cam.s = Math.min(3, Math.max(0.3, cam.s * factor));
    const after = toWorld(sx, sy);
    cam.x += before.x - after.x; cam.y += before.y - after.y;
  }
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomAt(e.offsetX, e.offsetY, e.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive: false });

  /* ---------- 开关 ---------- */
  async function open(restore) {
    try { await loadGraph(); } catch { return; }
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    resize();
    hovered = null; selected = null; tagFocus = null; egoSet = null;
    const s = restore ? loadState() : null;
    if (s) {
      activeCats.clear();
      for (const c of s.cats || []) if (catAnchors.has(c)) activeCats.add(c);
      showTags = s.showTags !== false;
      layout = LAYOUTS.includes(s.layout) ? s.layout : 'nebula';
      tagFocus = (layout === 'knowledge' && s.tagF) ? nodes.find((n) => n.id === s.tagF) || null : null;
      if (layout !== 'nebula') setLayoutTargets();
      for (const n of nodes) {
        const p = s.pos?.[n.id];
        if (p) { n.x = p[0]; n.y = p[1]; }
      }
      if (layout !== 'nebula') syncOrbitsToPositions();
      if (s.cam) cam = { x: +s.cam.x || 0, y: +s.cam.y || 0, s: Math.min(3, Math.max(0.3, +s.cam.s || 1)) };
      if (s.sel) selected = nodes.find((n) => n.id === s.sel && visible(n)) || null;
      alpha = 0.06; /* 布局已还原，仅轻微松弛 */
    } else {
      layout = 'nebula';
      fitView();
      alpha = 1;
    }
    warp = 0; camGoal = null;
    effects.length = 0; meteors.length = 0; ufo = null;
    nextFx = performance.now() + 1500;
    nextMeteor = performance.now() + 2500;
    nextUfo = performance.now() + 15000;
    renderChrome(); renderInfo();
    running = true; tick0 = performance.now();
    raf = requestAnimationFrame(loop);
    closeBtn.focus();
  }
  function close() {
    running = false;
    cancelAnimationFrame(raf);
    overlay.hidden = true;
    document.body.style.overflow = '';
    clearState();
    if (location.hash === '#starmap') history.replaceState(null, '', location.pathname + location.search);
    btn.focus();
  }

  btn.addEventListener('click', () => open(false));
  closeBtn.addEventListener('click', close);
  layoutBtn.addEventListener('click', () => {
    switchLayout(LAYOUTS[(LAYOUTS.indexOf(layout) + 1) % LAYOUTS.length]);
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) close(); });
  addEventListener('resize', () => { if (!overlay.hidden) resize(); });

  /* 从课件页返回：#starmap 锚点或会话内保存的打开状态 → 自动恢复星图 */
  if (location.hash === '#starmap' || loadState()?.open) open(true);
})();
