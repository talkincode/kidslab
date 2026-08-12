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
  const soundBtn = overlay.querySelector('.starmap__sound');
  const modeNav = overlay.querySelector('.starmap__modes');
  const modeBtns = [...modeNav.querySelectorAll('[data-layout]')];
  const searchInput = overlay.querySelector('#starmapSearch');
  const searchLabel = overlay.querySelector('.starmap__search-label');
  const resultsEl = overlay.querySelector('.starmap__results');
  const resultsHead = resultsEl.querySelector('strong');
  const resultsList = resultsEl.querySelector('.starmap__results-list');
  const searchClearBtn = resultsEl.querySelector('.starmap__search-clear');
  const titleEl = overlay.querySelector('.starmap__title');
  const hintEl = overlay.querySelector('.starmap__hint');
  const legendEl = overlay.querySelector('.starmap__legend');
  const infoEl = overlay.querySelector('.starmap__info');
  const statusEl = overlay.querySelector('.starmap__status');

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
      search: '搜索知识点或课程',
      searchPh: '搜索知识点或课程…',
      searchCount: (n) => `找到 ${n} 个结果`,
      searchEmpty: '没有匹配的星星，试试“分数”“轨道”或“逻辑”',
      clear: '清除',
      courseResult: '课程',
      topicResult: (n) => `知识点 · 关联 ${n} 门课程`,
      soundOn: '关闭星图音乐与音效',
      soundOff: '打开星图音乐与音效',
      status: (courses, topics) => `${courses} 门课程 · ${topics} 个知识点`,
      bhHint: '课件会穿梭黑洞 · 点击黑洞进入内部',
      bhInsideHint: '黑洞内部预览 · 点击中心回到外侧',
      bhEnter: '点击进入黑洞内部 →',
      bhExit: '点击中心离开黑洞 →',
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
      search: 'Search topics or courseware',
      searchPh: 'Search topics or courseware…',
      searchCount: (n) => `${n} result${n === 1 ? '' : 's'}`,
      searchEmpty: 'No matching stars. Try “fractions”, “orbit”, or “logic”.',
      clear: 'Clear',
      courseResult: 'Courseware',
      topicResult: (n) => `Topic · ${n} linked courseware`,
      soundOn: 'Mute star map music and sounds',
      soundOff: 'Turn on star map music and sounds',
      status: (courses, topics) => `${courses} courseware · ${topics} topics`,
      bhHint: 'Courseware tunnels the hole · click the hole to peek inside',
      bhInsideHint: 'Inside the black hole · click the center to return',
      bhEnter: 'Click to enter the black hole →',
      bhExit: 'Click the center to leave →',
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

  /* ---------- ScoreKit 音频：用户手势后启动，失败时静默降级 ---------- */
  /* Safari/iOS 不播 Ogg Vorbis，优先 m4a；相对站点根解析，避免深链/哈希页路径漂移 */
  const SOUND_STORE = 'kidslab.sound.muted';
  const audioExt = (() => {
    const probe = document.createElement('audio');
    if (probe.canPlayType('audio/mp4; codecs="mp4a.40.2"') || probe.canPlayType('audio/aac')) return 'm4a';
    if (probe.canPlayType('audio/ogg; codecs="vorbis"')) return 'ogg';
    return 'm4a';
  })();
  const audioUrl = (name) => {
    try {
      return new URL(`assets/audio/starmap/${name}.${audioExt}`, document.baseURI || location.href).href;
    } catch {
      return `assets/audio/starmap/${name}.${audioExt}`;
    }
  };
  const makeCue = (name, volume) => {
    const cue = new Audio(audioUrl(name));
    cue.preload = 'auto';
    cue.volume = volume;
    cue.setAttribute('playsinline', '');
    cue.load();
    return cue;
  };
  const audio = {
    muted: (() => {
      try { return localStorage.getItem(SOUND_STORE) === '1'; } catch { return false; }
    })(),
    unlocked: false,
    bgm: makeCue('orbital-library', 0.18),
    click: makeCue('star-confirm', 0.42),
    switch: makeCue('atlas-warp', 0.46),
  };
  audio.bgm.loop = true;

  function rewind(cue) {
    try {
      if (cue.readyState >= 1) cue.currentTime = 0;
    } catch { /* media may not be seekable yet */ }
  }
  function tryPlay(cue) {
    if (!cue) return Promise.resolve(false);
    return cue.play().then(() => true).catch(() => false);
  }
  async function unlockAudio() {
    if (audio.unlocked) return audio.unlocked;
    const cues = [audio.bgm, audio.click, audio.switch];
    await Promise.all(cues.map(async (cue) => {
      try {
        const prev = cue.volume;
        cue.volume = 0;
        const ok = await tryPlay(cue);
        cue.pause();
        rewind(cue);
        cue.volume = prev;
        return ok;
      } catch {
        try { cue.volume = cue === audio.bgm ? 0.18 : cue === audio.click ? 0.42 : 0.46; } catch { /* ignore */ }
        return false;
      }
    }));
    audio.unlocked = true;
    return true;
  }
  function startBgm(force = false) {
    if (audio.muted || (!force && overlay.hidden) || document.hidden) return;
    const kick = () => {
      if (audio.muted || document.hidden || (!force && overlay.hidden)) return;
      tryPlay(audio.bgm);
    };
    kick();
    /* 资源未就绪或自动播放被拒时，加载完成后在同一次用户会话里再试一次 */
    if (audio.bgm.readyState < 2) {
      audio.bgm.addEventListener('canplay', kick, { once: true });
    }
  }
  function pauseBgm(reset = false) {
    audio.bgm.pause();
    if (reset) rewind(audio.bgm);
  }
  function playSfx(kind = 'click') {
    if (audio.muted) return;
    const cue = audio[kind] || audio.click;
    try {
      cue.pause();
      rewind(cue);
      tryPlay(cue).then((ok) => {
        if (ok || cue.readyState >= 2) return;
        cue.addEventListener('canplay', () => {
          if (audio.muted) return;
          rewind(cue);
          tryPlay(cue);
        }, { once: true });
      });
    } catch { /* audio support is optional */ }
  }
  function renderSound() {
    soundBtn.setAttribute('aria-pressed', String(audio.muted));
    soundBtn.setAttribute('aria-label', audio.muted ? t().soundOff : t().soundOn);
    soundBtn.title = audio.muted ? t().soundOff : t().soundOn;
    soundBtn.querySelector('span').textContent = audio.muted ? '🔇' : '🔊';
  }

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
  let searchQuery = '';
  let searchMatches = [];
  let searchContext = null;

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
  /* 黑洞模式：内部预览 + 课件穿梭 */
  const BH_R = 84;       /* 事件视界世界半径 */
  const BH_BEAM = -0.55; /* 多普勒迎向轴（弧度，盘面坐标系） */
  let bhInside = false;
  let bhHover = false;
  const bhTransits = []; /* { n, t0, durIn, durOut, phase, fromR, fromA, toR, toA, spin } */
  let nextTransit = 0;
  let bhPlasma = null;   /* 吸积盘等离子体粒子缓存 */
  /* 进出视界过场：{ t0, dur, entering, flipped } */
  let bhCross = null;

  const catVisible = (cat) => activeCats.size === 0 || activeCats.has(cat);
  function visible(n) {
    if (searchContext && !searchContext.has(n)) return false;
    if (n.type === 'course') return catVisible(n.cat);
    if (!showTags && layout !== 'knowledge') return false; /* 知识网布局里知识点始终是主角 */
    for (const m of adj.get(n.id) || []) {
      if (catVisible(m.cat) && (!searchContext || searchContext.has(m) || searchMatches.includes(n))) return true;
    }
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
        bhIn: bhInside || false,
        cats: [...activeCats],
        showTags,
        q: searchQuery,
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

  /* 黑洞外侧：背景点的弱引力透镜（径向外推 + 近视界弧拉长） */
  function lensBgPoint(sx, sy, cx, cy, rH) {
    const dx = sx - cx, dy = sy - cy;
    const d = Math.hypot(dx, dy) || 0.001;
    if (d < rH * 0.92) return null; /* 落入视界，不画 */
    const u = rH / d;
    /* 近光子环处外推最强，远处迅速衰减 */
    const push = 1 + (u * u) * 1.15 * Math.exp(-Math.max(0, d / rH - 1.05) * 1.8);
    const ang = Math.atan2(dy, dx);
    /* 环向切向拉伸：越靠近视界，星点越被拉成弧 */
    const shear = Math.min(2.8, (u * u) * 3.4);
    return {
      x: cx + Math.cos(ang) * d * push,
      y: cy + Math.sin(ang) * d * push,
      ang,
      shear,
      near: u,
    };
  }

  function drawBackground(tSec, w, h) {
    const cx0 = w / 2, cy0 = h / 2;
    const holeC = (layout === 'blackhole' && !bhInside) ? toScreen({ x: 0, y: 0 }) : null;
    const rH = holeC ? BH_R * cam.s : 0;
    const crossK = bhCross ? Math.min(1, (performance.now() - bhCross.t0) / bhCross.dur) : 0;
    const lensBoost = 1 + (bhCross ? (crossK < 0.5 ? crossK * 2 : (1 - crossK) * 1.2) * 1.4 : 0);

    /* 漂移星云 */
    ctx.globalCompositeOperation = 'lighter';
    for (const nb of nebulae) {
      let size = 256 * nb.s;
      let x = nb.fx * w + Math.sin(tSec * nb.sp + nb.ph) * 46 - cam.x * cam.s * nb.par - size / 2;
      let y = nb.fy * h + Math.cos(tSec * nb.sp * 0.8 + nb.ph) * 34 - cam.y * cam.s * nb.par - size / 2;
      if (holeC && !reducedMotion) {
        const mx = x + size / 2, my = y + size / 2;
        const lp = lensBgPoint(mx, my, holeC.x, holeC.y, rH * lensBoost);
        if (!lp) continue;
        const sMul = 1 + lp.near * 0.35;
        size *= sMul;
        x = lp.x - size / 2;
        y = lp.y - size / 2;
      }
      ctx.globalAlpha = reducedMotion ? 0.5 : 0.42 + 0.18 * Math.sin(tSec * 0.3 + nb.ph);
      ctx.drawImage(nb.img, x, y, size, size);
    }
    ctx.globalCompositeOperation = 'source-over';

    /* 星尘（带视差；跃迁时拉成流光；黑洞外侧近视界透镜弧） */
    for (const s of bgStars) {
      let sx = (((s.x - cam.x * cam.s * s.par) % w) + w) % w;
      let sy = (((s.y - cam.y * cam.s * s.par) % h) + h) % h;
      if (warp > 0.03) {
        const dx = sx - cx0, dy = sy - cy0;
        ctx.globalAlpha = 0.25 + 0.55 * warp;
        ctx.strokeStyle = '#bfe9ff'; ctx.lineWidth = s.r; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + dx * warp * 0.7, sy + dy * warp * 0.7); ctx.stroke();
      } else if (holeC && !reducedMotion) {
        const lp = lensBgPoint(sx, sy, holeC.x, holeC.y, rH * lensBoost);
        if (!lp) continue;
        const a = reducedMotion ? 0.55 : 0.35 + 0.35 * Math.sin(tSec * s.sp + s.phase);
        if (lp.shear > 0.55) {
          /* 近视界：拉成沿切向的微弧（爱因斯坦环感） */
          const arc = Math.min(0.55, lp.shear * 0.16);
          const rr = Math.hypot(lp.x - holeC.x, lp.y - holeC.y);
          ctx.globalAlpha = a * (0.55 + lp.near * 0.55);
          ctx.strokeStyle = lp.near > 0.72 ? '#ffe6b0' : '#cdd6ff';
          ctx.lineWidth = Math.max(0.6, s.r * (0.8 + lp.shear * 0.25));
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(holeC.x, holeC.y, rr, lp.ang - arc, lp.ang + arc);
          ctx.stroke();
        } else {
          ctx.globalAlpha = a;
          ctx.fillStyle = '#cdd6ff';
          ctx.beginPath(); ctx.arc(lp.x, lp.y, s.r * (1 + lp.near * 0.4), 0, Math.PI * 2); ctx.fill();
        }
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
      drawBlackHole(tSec, c, 'under');
    }
  }

  function ensureBhPlasma() {
    if (bhPlasma) return bhPlasma;
    bhPlasma = Array.from({ length: 48 }, (_, i) => ({
      a: (i / 48) * Math.PI * 2 + Math.random() * 0.2,
      r: 1.15 + Math.random() * 1.55,
      sp: 0.55 + Math.random() * 1.1,
      size: 0.7 + Math.random() * 1.8,
      hot: Math.random(),
      ph: Math.random() * Math.PI * 2,
    }));
    return bhPlasma;
  }

  /* layer: 'under' 背景晕/喷流；'over' 吸积盘+视界（画在连线之上，避免被盖住） */
  function drawBlackHole(tSec, c, layer = 'over') {
    const s = cam.s;
    const spin = reducedMotion ? 0 : tSec;
    const pulse = reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(tSec * 1.7);
    const hoverBoost = bhHover ? 1.1 : 1;

    if (bhInside) {
      if (layer === 'over') drawBlackHoleInterior(tSec, c, spin, pulse);
      return;
    }

    const r = BH_R * s * hoverBoost;

    if (layer === 'under') {
      /* 引力透镜外晕 */
      const lens = ctx.createRadialGradient(c.x, c.y, r * 0.9, c.x, c.y, r * 5.2);
      lens.addColorStop(0, 'rgba(0,0,0,0)');
      lens.addColorStop(0.28, `rgba(60, 20, 90, ${0.18 + pulse * 0.06})`);
      lens.addColorStop(0.55, `rgba(255, 140, 40, ${0.16 + pulse * 0.06})`);
      lens.addColorStop(0.78, `rgba(124, 231, 255, ${0.08 + pulse * 0.04})`);
      lens.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = lens;
      ctx.beginPath(); ctx.arc(c.x, c.y, r * 5.2, 0, Math.PI * 2); ctx.fill();

      if (!reducedMotion) {
        ctx.globalCompositeOperation = 'lighter';
        const jetLen = r * (3.2 + pulse * 0.5);
        for (const dir of [-1, 1]) {
          const jg = ctx.createLinearGradient(c.x, c.y, c.x + dir * r * 0.12, c.y + dir * jetLen);
          jg.addColorStop(0, 'rgba(124, 231, 255, 0.4)');
          jg.addColorStop(0.45, 'rgba(180, 140, 255, 0.14)');
          jg.addColorStop(1, 'rgba(124, 231, 255, 0)');
          ctx.strokeStyle = jg;
          ctx.lineWidth = (3.5 + pulse * 2.2) * Math.max(0.5, s);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(c.x, c.y + dir * r * 0.25);
          ctx.quadraticCurveTo(
            c.x + dir * r * 0.28 * Math.sin(spin),
            c.y + dir * jetLen * 0.5,
            c.x + dir * r * 0.08,
            c.y + dir * jetLen,
          );
          ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      return;
    }

    /* —— over：吸积盘（多普勒不对称）+ 等离子体 + 光子环 + 视界 —— */
    const tilt = -0.32 + (reducedMotion ? 0 : Math.sin(spin * 0.12) * 0.04);
    const beamAxis = BH_BEAM + (reducedMotion ? 0 : spin * 0.08);
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(tilt);
    ctx.scale(1, 0.42);

    ctx.globalCompositeOperation = 'lighter';
    /* 底盘：双侧分色径向晕——迎向侧青白热，远离侧暗橙红 */
    for (let i = 0; i < 7; i++) {
      const rr = r * (1.18 + i * 0.36);
      const a0 = 0.78 - i * 0.07;
      /* 迎向（蓝移）热斑 */
      const gHot = ctx.createRadialGradient(
        Math.cos(beamAxis) * rr * 0.42, Math.sin(beamAxis) * rr * 0.18,
        rr * 0.04, 0, 0, rr,
      );
      gHot.addColorStop(0, `rgba(255, 252, 245, ${a0 * 0.95})`);
      gHot.addColorStop(0.22, `rgba(190, 235, 255, ${a0 * 0.72})`);
      gHot.addColorStop(0.48, `rgba(255, ${190 - i * 10}, ${70 + i * 8}, ${a0 * 0.4})`);
      gHot.addColorStop(1, 'rgba(40, 10, 0, 0)');
      ctx.globalAlpha = 0.7 + pulse * 0.25;
      ctx.fillStyle = gHot;
      ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.fill();

      /* 远离（红移）暗侧 */
      const gCool = ctx.createRadialGradient(
        Math.cos(beamAxis + Math.PI) * rr * 0.38, Math.sin(beamAxis + Math.PI) * rr * 0.16,
        rr * 0.05, 0, 0, rr,
      );
      gCool.addColorStop(0, `rgba(120, 30, 20, ${a0 * 0.55})`);
      gCool.addColorStop(0.35, `rgba(180, 55, 20, ${a0 * 0.32})`);
      gCool.addColorStop(1, 'rgba(20, 0, 0, 0)');
      ctx.globalAlpha = 0.55 + pulse * 0.12;
      ctx.fillStyle = gCool;
      ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.fill();
    }

    /* 螺旋臂弧：按局部 cos(θ−beam) 调制亮度与色温 */
    for (let k = 0; k < 6; k++) {
      const a0 = spin * (1.15 + k * 0.22) + k * 1.48;
      const a1 = a0 + 2.05 - k * 0.16;
      const steps = 10;
      const rr = r * (1.32 + k * 0.28);
      const lw = (6.4 - k * 0.7) * Math.max(0.75, s);
      for (let sIdx = 0; sIdx < steps; sIdx++) {
        const t0 = sIdx / steps;
        const t1 = (sIdx + 1) / steps;
        const mid = a0 + (a1 - a0) * ((t0 + t1) / 2);
        const dop = Math.cos(mid - beamAxis); /* +1 迎向, -1 远离 */
        const boost = 0.28 + 0.72 * Math.max(0, dop);
        const dim = 0.18 + 0.35 * Math.max(0, -dop);
        ctx.globalAlpha = (boost + dim) * (0.75 + pulse * 0.25);
        if (dop >= 0) {
          ctx.strokeStyle = `rgba(${210 + boost * 45 | 0}, ${230 + boost * 20 | 0}, ${255}, ${0.55 + boost * 0.45})`;
        } else {
          ctx.strokeStyle = `rgba(${200 + dim * 40 | 0}, ${70 + dim * 40 | 0}, ${30}, ${0.35 + dim * 0.45})`;
        }
        ctx.lineWidth = lw * (0.55 + boost * 0.75 + dim * 0.25);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, 0, rr, a0 + (a1 - a0) * t0, a0 + (a1 - a0) * t1);
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
    ctx.globalAlpha = 1;

    if (!reducedMotion) {
      const plasma = ensureBhPlasma();
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(tilt);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of plasma) {
        const ang = p.a + spin * p.sp;
        const pr = r * p.r;
        const x = Math.cos(ang) * pr;
        const y = Math.sin(ang) * pr * 0.42;
        const dop = Math.cos(ang - beamAxis);
        const beam = 0.22 + 0.78 * Math.max(0, dop);
        const red = 0.15 + 0.4 * Math.max(0, -dop);
        const tw = 0.55 + 0.45 * Math.sin(spin * 3.2 + p.ph);
        ctx.globalAlpha = (beam * 0.95 + red * 0.55) * tw;
        if (dop > 0.15) {
          ctx.fillStyle = p.hot > 0.4 ? '#f5fbff' : '#9af0ff';
        } else if (dop < -0.15) {
          ctx.fillStyle = p.hot > 0.5 ? '#ff7a3a' : '#c43a18';
        } else {
          ctx.fillStyle = p.hot > 0.55 ? '#fff8dc' : '#ffb14a';
        }
        ctx.beginPath();
        ctx.arc(x, y, p.size * Math.max(0.7, s) * (0.75 + beam * 0.85 + red * 0.2), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    /* 光子环：迎向侧更亮更青，远离侧偏琥珀 */
    const phR = r * 1.06;
    const phCx = c.x + Math.cos(tilt + beamAxis) * r * 0.08;
    const phCy = c.y + Math.sin(tilt + beamAxis) * r * 0.03;
    const ph = ctx.createRadialGradient(phCx, phCy, phR * 0.88, c.x, c.y, phR * 1.24);
    ph.addColorStop(0, 'rgba(0,0,0,0)');
    ph.addColorStop(0.4, `rgba(255, 244, 200, ${0.16 + pulse * 0.1})`);
    ph.addColorStop(0.52, 'rgba(255, 255, 255, 0.98)');
    ph.addColorStop(0.62, `rgba(160, 230, 255, ${0.55 + pulse * 0.2})`);
    ph.addColorStop(0.78, `rgba(255, 140, 60, ${0.22 + pulse * 0.1})`);
    ph.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ph;
    ctx.beginPath(); ctx.arc(c.x, c.y, phR * 1.24, 0, Math.PI * 2); ctx.fill();

    /* 事件视界 */
    const core = ctx.createRadialGradient(c.x - r * 0.18, c.y - r * 0.18, 0, c.x, c.y, r);
    core.addColorStop(0, '#0a0a12');
    core.addColorStop(0.65, '#000000');
    core.addColorStop(0.9, '#080414');
    core.addColorStop(1, '#1c0c30');
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = `rgba(200, 140, 255, ${0.35 + pulse * 0.25})`;
    ctx.lineWidth = 1.4 * Math.max(0.6, s);
    ctx.beginPath(); ctx.arc(c.x, c.y, r * 0.985, 0, Math.PI * 2); ctx.stroke();

    if (bhHover) {
      ctx.strokeStyle = 'rgba(255, 214, 102, 0.7)';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.arc(c.x, c.y, r * 1.32, spin * 0.8, spin * 0.8 + Math.PI * 1.5); ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  /* 内部视角：站在视界内侧向外望，光子环变成环绕天际线 */
  function drawBlackHoleInterior(tSec, c, spin, pulse) {
    const w = overlay.clientWidth, h = overlay.clientHeight;
    const R = Math.min(w, h) * 0.46;

    /* 深空穹顶 */
    const sky = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, R * 1.35);
    sky.addColorStop(0, 'rgba(12, 8, 28, 0.15)');
    sky.addColorStop(0.55, 'rgba(40, 12, 60, 0.35)');
    sky.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
    ctx.fillStyle = sky;
    ctx.beginPath(); ctx.arc(c.x, c.y, R * 1.35, 0, Math.PI * 2); ctx.fill();

    /* 旋转的时空网格 */
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.strokeStyle = 'rgba(124, 231, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + spin * 0.15;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * R * 1.2, Math.sin(a) * R * 1.2);
      ctx.stroke();
    }
    for (let k = 1; k <= 5; k++) {
      ctx.beginPath();
      ctx.arc(0, 0, (R * k) / 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    /* 外缘光子环天际线 */
    const rim = ctx.createRadialGradient(0, 0, R * 0.72, 0, 0, R * 1.05);
    rim.addColorStop(0, 'rgba(0,0,0,0)');
    rim.addColorStop(0.55, `rgba(255, 160, 40, ${0.15 + pulse * 0.08})`);
    rim.addColorStop(0.78, `rgba(255, 244, 200, ${0.75 + pulse * 0.15})`);
    rim.addColorStop(0.88, `rgba(124, 231, 255, ${0.45})`);
    rim.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rim;
    ctx.beginPath(); ctx.arc(0, 0, R * 1.05, 0, Math.PI * 2); ctx.fill();

    /* 旋转热斑弧 */
    ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 4; k++) {
      const a0 = spin * (0.6 + k * 0.2) + k * 1.4;
      ctx.strokeStyle = k % 2 ? 'rgba(255, 200, 100, 0.55)' : 'rgba(160, 120, 255, 0.4)';
      ctx.lineWidth = 3 - k * 0.4;
      ctx.beginPath();
      ctx.arc(0, 0, R * (0.82 + k * 0.04), a0, a0 + 1.2);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';

    /* 中心出口（可点击离开） */
    const exitR = Math.max(48, 54 * Math.max(0.85, cam.s));
    const eg = ctx.createRadialGradient(0, 0, 0, 0, 0, exitR * 2.1);
    eg.addColorStop(0, `rgba(255, 244, 220, ${0.42 + pulse * 0.22})`);
    eg.addColorStop(0.35, 'rgba(124, 231, 255, 0.3)');
    eg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = eg;
    ctx.beginPath(); ctx.arc(0, 0, exitR * 2.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#030308';
    ctx.beginPath(); ctx.arc(0, 0, exitR, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = bhHover ? 'rgba(255, 214, 102, 0.95)' : `rgba(124, 231, 255, ${0.5 + pulse * 0.28})`;
    ctx.lineWidth = bhHover ? 2.6 : 1.6;
    ctx.beginPath(); ctx.arc(0, 0, exitR * 1.08, 0, Math.PI * 2); ctx.stroke();
    if (!reducedMotion) {
      ctx.strokeStyle = `rgba(255, 214, 102, ${0.35 + pulse * 0.25})`;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, exitR * 1.28, spin * 0.7, spin * 0.7 + Math.PI * 1.4);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.fillStyle = bhHover ? 'rgba(255, 244, 220, 0.95)' : 'rgba(200, 230, 255, 0.75)';
    ctx.font = `700 ${Math.round(Math.max(11, 12 * cam.s))}px "Baloo 2", "PingFang SC", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(lang() === 'zh' ? '出口' : 'EXIT', 0, 0);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
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
      if (bhInside) {
        /* 内部预览：课件按黄金角分层漂浮，空出中心出口；知识点藏成远尘 */
        const courses = cats.flatMap((c) => byCat.get(c));
        const golden = Math.PI * (3 - Math.sqrt(5));
        courses.forEach((n, i) => {
          const tt = i / Math.max(1, courses.length);
          const ring = 1 + (i % 4);
          n.orbit = {
            r: 155 + ring * 88 + (i % 6) * 6,
            a: (i * golden) + ring * 0.35,
            sp: reducedMotion ? 0 : (0.06 + tt * 0.05) * (i % 2 ? 1 : -1),
          };
        });
        for (const n of nodes) {
          if (n.type !== 'tag') continue;
          n.moon = null;
          /* 知识点退到外缘作星尘，默认不抢戏 */
          n.orbit = {
            r: 520 + (n.degree % 5) * 18,
            a: (n.phase || 0) + n.degree * 0.7,
            sp: reducedMotion ? 0 : 0.03 * (n.degree % 2 ? 1 : -1),
          };
        }
      } else {
        /* 吸积盘：越靠近视界转得越快 */
        const all = cats.flatMap((c) => byCat.get(c));
        all.forEach((n, i) => {
          const tt = i / Math.max(1, all.length - 1);
          n.orbit = {
            r: 175 + 360 * tt, /* 让出吸积盘与光子环视觉空间 */
            a: Math.random() * Math.PI * 2,
            sp: reducedMotion ? 0 : 0.3 / (0.28 + tt),
          };
        });
        moonifyTags(1.6);
      }
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
      blackhole: bhInside ? 320 : 390 * shrink + 80,
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
    if (!LAYOUTS.includes(next) || next === layout || bhCross) return;
    layout = next;
    tagFocus = null; egoSet = null;
    bhInside = false; bhHover = false; bhTransits.length = 0; setBhCross(null);
    selected = null; hovered = null; renderInfo();
    relayout(1);
    renderChrome();
    playSfx('switch');
  }

  function setBhCross(next) {
    bhCross = next;
    if (bhCross) overlay.dataset.bhFx = 'cross';
    else delete overlay.dataset.bhFx;
  }

  function applyBlackHoleInside(next) {
    bhInside = !!next;
    bhTransits.length = 0;
    selected = null; hovered = null; bhHover = false;
    relayout(0.9);
    renderChrome();
    renderInfo();
  }

  function toggleBlackHoleInside() {
    if (layout !== 'blackhole' || bhCross) return;
    const entering = !bhInside;
    playSfx('switch');
    if (reducedMotion) {
      applyBlackHoleInside(entering);
      return;
    }
    /* 过场中段再切换内外布局，避免瞬间跳变 */
    setBhCross({
      t0: performance.now(),
      dur: entering ? 980 : 860,
      entering,
      flipped: false,
    });
    warp = Math.max(warp, 0.55);
  }

  function stepBhCross(now) {
    if (!bhCross) return;
    const t = (now - bhCross.t0) / bhCross.dur;
    if (!bhCross.flipped && t >= 0.48) {
      bhCross.flipped = true;
      applyBlackHoleInside(bhCross.entering);
      warp = Math.max(warp, 0.7);
    }
    if (t >= 1) setBhCross(null);
  }

  /* 穿越视界：径向流光 + 光子环收缩/扩张 + 中心闪白 */
  function drawBhCross(now, w, h) {
    if (!bhCross) return;
    const t = Math.min(1, (now - bhCross.t0) / bhCross.dur);
    const entering = bhCross.entering;
    const c = toScreen({ x: 0, y: 0 });
    /* 0→0.5 冲向视界；0.5→1 从内侧/外侧重生 */
    const phase = t < 0.5 ? t * 2 : (t - 0.5) * 2;
    const rush = t < 0.5
      ? phase * phase
      : 1 - (1 - phase) * (1 - phase);
    const ease = t < 0.5 ? rush : (1 - rush);

    /* 全屏暗角压向中心 */
    const vigR = Math.hypot(w, h) * (0.72 - rush * 0.38);
    const vig = ctx.createRadialGradient(c.x, c.y, vigR * 0.15, c.x, c.y, vigR);
    vig.addColorStop(0, `rgba(0,0,0,${0.05 + rush * 0.35})`);
    vig.addColorStop(0.55, `rgba(8, 4, 20, ${0.2 + rush * 0.45})`);
    vig.addColorStop(1, `rgba(0,0,0,${0.55 + rush * 0.4})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    /* 径向流光 */
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.globalCompositeOperation = 'lighter';
    const rays = 26;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2 + now * 0.0012 * (entering ? 1 : -1);
      const len = Math.min(w, h) * (0.2 + rush * 0.55 + (i % 3) * 0.04);
      const g = ctx.createLinearGradient(0, 0, Math.cos(a) * len, Math.sin(a) * len);
      const hot = i % 2 === 0;
      g.addColorStop(0, hot ? 'rgba(255,250,240,0.55)' : 'rgba(140,220,255,0.35)');
      g.addColorStop(0.45, hot ? 'rgba(255,170,60,0.2)' : 'rgba(160,120,255,0.16)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = (1.2 + rush * 2.2) * (hot ? 1.3 : 0.8);
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.35 + rush * 0.55;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (12 + ease * 20), Math.sin(a) * (12 + ease * 20));
      ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
      ctx.stroke();
    }

    /* 光子环脉动：进入时收缩，离开时扩张 */
    const ringR = BH_R * cam.s * (entering
      ? (1.8 - rush * 1.35)
      : (0.45 + rush * 1.5));
    const ring = ctx.createRadialGradient(0, 0, ringR * 0.82, 0, 0, ringR * 1.25);
    ring.addColorStop(0, 'rgba(0,0,0,0)');
    ring.addColorStop(0.45, `rgba(255, 220, 160, ${0.15 + rush * 0.25})`);
    ring.addColorStop(0.62, `rgba(255, 255, 255, ${0.55 + rush * 0.4})`);
    ring.addColorStop(0.78, `rgba(120, 220, 255, ${0.35 + rush * 0.3})`);
    ring.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ring;
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.arc(0, 0, ringR * 1.25, 0, Math.PI * 2); ctx.fill();

    /* 中段闪白（穿膜瞬间） */
    if (t > 0.42 && t < 0.62) {
      const flash = 1 - Math.abs(t - 0.52) / 0.1;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = flash * 0.75;
      const fg = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(w, h) * 0.55);
      fg.addColorStop(0, 'rgba(255, 252, 245, 1)');
      fg.addColorStop(0.35, 'rgba(180, 230, 255, 0.55)');
      fg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.arc(0, 0, Math.min(w, h) * 0.55, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  function transitOf(n) {
    return bhTransits.find((t) => t.n === n) || null;
  }

  /* 课件穿梭：螺旋吸入 → 短暂消失 → 从另一侧喷出 */
  function spawnTransit(now) {
    if (layout !== 'blackhole' || bhInside || bhCross || reducedMotion || warp > 0.05) return;
    if (now < nextTransit || bhTransits.length >= 2) return;
    nextTransit = now + 2800 + Math.random() * 4200;
    const busy = new Set(bhTransits.map((t) => t.n));
    const pool = nodes.filter((n) => n.type === 'course' && visible(n) && n.orbit && !busy.has(n) && n !== dragNode && n !== selected && n !== hovered);
    if (pool.length < 2) return;
    /* 优先吸积盘内圈，视觉更戏剧 */
    pool.sort((a, b) => a.orbit.r - b.orbit.r);
    const pick = pool[Math.floor(Math.random() * Math.min(6, pool.length))];
    const fromR = pick.orbit.r;
    const fromA = pick.orbit.a;
    const toA = fromA + Math.PI * (0.7 + Math.random() * 0.6) * (Math.random() < 0.5 ? 1 : -1);
    const toR = 130 + Math.random() * 280;
    bhTransits.push({
      n: pick,
      t0: now,
      durIn: 1400 + Math.random() * 500,
      durOut: 1200 + Math.random() * 400,
      phase: 'in',
      fromR, fromA, toR, toA,
      spin: (Math.random() < 0.5 ? 1 : -1) * (4 + Math.random() * 5),
      stretch: 1,
      scale: 1,
    });
  }

  function stepTransits(now) {
    for (let i = bhTransits.length - 1; i >= 0; i--) {
      const tr = bhTransits[i];
      const n = tr.n;
      if (!visible(n) || layout !== 'blackhole' || bhInside) {
        if (n.orbit) { n.orbit.r = tr.toR || tr.fromR; n.orbit.a = tr.toA ?? tr.fromA; }
        bhTransits.splice(i, 1);
        continue;
      }
      if (tr.phase === 'in') {
        const t = Math.min(1, (now - tr.t0) / tr.durIn);
        const e = t * t; /* ease-in：越吸越快 */
        const r = tr.fromR * (1 - e) + BH_R * 0.15 * e;
        const a = tr.fromA + tr.spin * e;
        n.x = Math.cos(a) * r;
        n.y = Math.sin(a) * r;
        tr.scale = 1 - e * 0.92;
        tr.stretch = 1 + e * 2.4; /* 面条化 */
        tr.a = a; tr.r = r;
        if (t >= 1) {
          tr.phase = 'out';
          tr.t0 = now;
          tr.scale = 0.08;
          tr.stretch = 2.2;
        }
      } else {
        const t = Math.min(1, (now - tr.t0) / tr.durOut);
        const e = 1 - (1 - t) ** 2; /* ease-out */
        const r = BH_R * 0.2 * (1 - e) + tr.toR * e;
        const a = tr.toA + tr.spin * 0.35 * (1 - e);
        n.x = Math.cos(a) * r;
        n.y = Math.sin(a) * r;
        tr.scale = 0.08 + e * 0.92;
        tr.stretch = 2.2 - e * 1.2;
        tr.a = a; tr.r = r;
        if (t >= 1) {
          if (n.orbit) { n.orbit.r = tr.toR; n.orbit.a = tr.toA; }
          n.x = Math.cos(tr.toA) * tr.toR;
          n.y = Math.sin(tr.toA) * tr.toR;
          bhTransits.splice(i, 1);
        }
      }
    }
  }

  function drawTransitTrail(tr) {
    if (!tr || tr.r == null) return;
    const steps = 8;
    for (let i = steps; i >= 1; i--) {
      const k = i / steps;
      const back = k * 0.55;
      const a = tr.a - tr.spin * 0.08 * back * (tr.phase === 'in' ? 1 : -0.5);
      const r = tr.r + (tr.phase === 'in' ? back * 28 : -back * 18);
      const p = toScreen({ x: Math.cos(a) * r, y: Math.sin(a) * r });
      ctx.globalAlpha = (1 - k) * 0.35 * tr.scale;
      ctx.fillStyle = catColor(tr.n.cat);
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.5, 4 * tr.scale * (1 - k * 0.5) * cam.s), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- 检索：课程与知识点都可命中，并保留一跳关系作为上下文 ---------- */
  const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
  function nodeSearchText(n) {
    if (n.type === 'tag') return `${n.tag} ${n.en}`;
    const c = n.course;
    return [
      c.title?.zh, c.title?.en, c.description?.zh, c.description?.en,
      ...(c.tags || []), c.id,
    ].filter(Boolean).join(' ');
  }
  function nodeLabel(n) {
    return n.type === 'tag'
      ? (lang() === 'zh' ? n.tag : n.en)
      : (n.course.title?.[lang()] || n.course.id);
  }
  function searchRank(n, query) {
    const label = normalize(nodeLabel(n));
    const text = normalize(nodeSearchText(n));
    if (label === query) return 0;
    if (label.startsWith(query)) return 1;
    if (label.includes(query)) return 2;
    if (text.includes(query)) return 3;
    return 99;
  }
  function renderSearch() {
    const open = Boolean(searchQuery);
    resultsEl.hidden = !open;
    searchInput.setAttribute('aria-expanded', String(open));
    if (!open) return;

    resultsHead.textContent = t().searchCount(searchMatches.length);
    searchClearBtn.textContent = t().clear;
    if (!searchMatches.length) {
      resultsList.innerHTML = `<p class="starmap__results-empty">${esc(t().searchEmpty)}</p>`;
      return;
    }

    resultsList.innerHTML = '';
    for (const n of searchMatches.slice(0, 12)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'starmap__result';
      b.dataset.nodeId = n.id;
      const subtitle = n.type === 'tag'
        ? t().topicResult(n.degree)
        : `${t().courseResult} · ${t().cats[n.cat] || n.cat}`;
      b.innerHTML = `
        <span class="starmap__result-icon">${n.type === 'tag' ? '✦' : esc(n.course.icon || '📘')}</span>
        <span class="starmap__result-copy"><b>${esc(nodeLabel(n))}</b><small>${esc(subtitle)}</small></span>
        <span class="starmap__result-arrow" aria-hidden="true">↗</span>`;
      b.addEventListener('click', () => focusSearchResult(n));
      resultsList.appendChild(b);
    }
  }
  function updateSearch(value, { quiet = false } = {}) {
    searchQuery = String(value || '').trim();
    searchInput.value = searchQuery;
    const q = normalize(searchQuery);
    if (!q) {
      searchMatches = [];
      searchContext = null;
    } else {
      searchMatches = nodes
        .map((n) => ({ n, rank: searchRank(n, q) }))
        .filter(({ n, rank }) => rank < 99 && (
          n.type === 'course'
            ? catVisible(n.cat)
            : [...(adj.get(n.id) || [])].some((course) => catVisible(course.cat))
        ))
        .sort((a, b) => a.rank - b.rank || nodeLabel(a.n).localeCompare(nodeLabel(b.n), lang()))
        .map(({ n }) => n);
      searchContext = new Set(searchMatches);
      for (const n of searchMatches) {
        for (const neighbor of adj.get(n.id) || []) searchContext.add(neighbor);
      }
    }
    if (selected && !visible(selected)) selected = null;
    if (hovered && !visible(hovered)) hovered = null;
    if (tagFocus && !visible(tagFocus)) { tagFocus = null; egoSet = null; }
    relayout(q ? 0.4 : 0.65);
    renderSearch();
    renderChrome();
    renderInfo();
    if (!quiet && q) playSfx('click');
  }
  function focusSearchResult(n) {
    playSfx('click');
    if (n.type === 'tag') {
      if (layout !== 'knowledge') {
        layout = 'knowledge';
        playSfx('switch');
      }
      tagFocus = n;
      egoSet = null;
      selected = n;
      relayout(0.8);
    } else {
      selected = n;
      tagFocus = null;
      egoSet = null;
      camGoal = { x: n.x, y: n.y, s: Math.max(cam.s, 1.25) };
      warp = reducedMotion ? 0.001 : 0.42;
      if (reducedMotion) { cam = { ...camGoal }; camGoal = null; }
    }
    renderChrome();
    renderInfo();
    resultsEl.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
    canvas.focus?.();
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
    const bhPull = layout === 'blackhole' && !bhInside && !reducedMotion;
    for (const n of nodes) {
      if (n === dragNode) continue;
      if (transitOf(n)) continue; /* 穿梭动画接管坐标 */
      let tx, ty;
      if (n.orbit) {
        n.orbit.a += n.orbit.sp * 0.016;
        /* 黑洞外侧：内圈缓慢被潮汐拉近一点，增强吸积感 */
        if (bhPull && n.type === 'course' && n.orbit.r > BH_R + 70) {
          n.orbit.r += (Math.sin(n.orbit.a * 3 + n.phase) * 0.04) - 0.012;
          if (n.orbit.r < BH_R + 70) n.orbit.r = BH_R + 70;
        }
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
    if (layout === 'blackhole' && bhInside) {
      return n.type === 'course' ? 13 : Math.min(2.2 + n.degree * 0.35, 5);
    }
    return n.type === 'course' ? 13 : Math.min(4 + n.degree * 1.4, 10);
  };

  function draw(now) {
    const w = overlay.clientWidth, h = overlay.clientHeight;
    ctx.clearRect(0, 0, w, h);
    const tSec = (now - tick0) / 1000;

    drawBackground(tSec, w, h);
    drawCenterpiece(tSec); /* 非黑洞布局的中心天体；黑洞 under 层也在此画 */

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
      /* 黑洞模式：外侧压暗留给吸积盘；内部几乎不画网，避免口袋宇宙变蜘蛛网 */
      const baseA = layout === 'blackhole' ? (bhInside ? 0.03 : 0.08) : 0.16;
      ctx.globalAlpha = ego
        ? (lit ? 0.9 : (ego.has(e.a) && ego.has(e.b) ? 0.3 : 0.03))
        : (lit ? 0.85 : (focusSet ? 0.05 : baseA));
      ctx.lineWidth = lit ? 1.6 : 1;
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* 黑洞主体画在连线之上、节点之下 */
    if (layout === 'blackhole') {
      drawBlackHole(tSec, toScreen({ x: 0, y: 0 }), 'over');
    }

    /* 节点 */
    /* 黑洞内部禁止“放大即全标”，只靠悬停/选中/检索出字 */
    const showAllLabels = cam.s > 0.85 && !(layout === 'blackhole' && bhInside);
    for (const n of nodes) {
      if (!visible(n)) continue;
      const p = toScreen(n);
      if (p.x < -60 || p.y < -60 || p.x > w + 60 || p.y > h + 60) continue;
      const r = nodeRadius(n) * (n === focus ? 1.25 : 1);
      const dim = dimmed(n);
      const directMatch = Boolean(searchQuery && searchMatches.includes(n));
      ctx.globalAlpha = dim ? (ego ? 0.08 : 0.14) : 1;

      if (n.type === 'tag') {
        const glow = reducedMotion ? 0.75 : 0.6 + 0.4 * Math.sin(tSec * 1.4 + n.phase);
        /* 黑洞内部：知识点只作远尘，不发光不贴标签 */
        if (layout === 'blackhole' && bhInside && !directMatch && n !== focus) {
          ctx.globalAlpha = 0.35;
          ctx.fillStyle = TAG_FILL;
          ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1.5, r * 0.55), 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
          continue;
        }
        if (!dim) drawGlow(p.x, p.y, TAG_COLOR, r + (n === tagFocus || directMatch ? 30 : 12 * glow));
        ctx.fillStyle = TAG_FILL;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        const wantLabel = layout === 'knowledge'
          ? (ego ? ego.has(n) : (showAllLabels || n.degree >= 2 || cam.s > 0.5 || directMatch))
          : (showAllLabels || n.degree >= 2 || focusSet?.has(n) || directMatch);
        if (!dim && wantLabel) {
          drawLabel(lang() === 'zh' ? n.tag : n.en, p.x, p.y + r + 14, TAG_COLOR, '600');
        }
      } else {
        const col = catColor(n.cat);
        const tr = transitOf(n);
        /* 知识网全景：课程只是暗淡卫星，避免抢知识点的戏；悬停/选中/关系网内恢复亮度 */
        const muted = layout === 'knowledge' && !ego && !dim
          && n !== focus && !(focusSet?.has(n)) && !directMatch;
        if (tr) {
          drawTransitTrail(tr);
          const sc = Math.max(0.06, tr.scale);
          const stretch = tr.stretch || 1;
          const ang = Math.atan2(n.y, n.x);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(ang);
          ctx.scale(stretch * sc, sc / Math.sqrt(stretch));
          ctx.globalAlpha = Math.min(1, sc * 1.4);
          if (!dim) drawGlow(0, 0, col, r + 16);
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
          drawEmoji(n.course.icon || '📘', 0, 1, Math.round(r * 1.25));
          ctx.restore();
          ctx.globalAlpha = 1;
          continue;
        }
        if (muted) ctx.globalAlpha = 0.3;
        if (!dim && !muted) drawGlow(p.x, p.y, col, r + (n === focus || directMatch ? 22 : 12));
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        if (!muted) {
          drawEmoji(n.course.icon || '📘', p.x, p.y + 1, Math.round(r * 1.25));
        }
        /* 内部也不常驻标题，避免口袋宇宙变字墙；悬停/选中/检索命中才显示 */
        if (!dim && !muted && (showAllLabels || focusSet?.has(n) || directMatch)) {
          drawLabel(n.course.title?.[lang()] || n.course.id, p.x, p.y + r + 15, '#ffffff', '700');
        }
      }
      if (directMatch && !dim) {
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = 0.8;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.arc(p.x, p.y, r + 7, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    ctx.globalAlpha = 1;

    /* 黑洞视界遮罩：盖住已落入视界的穿梭课件，形成真正的“被吞没” */
    if (layout === 'blackhole' && !bhInside && bhTransits.some((tr) => tr.phase === 'in' && tr.r < BH_R * 1.05)) {
      const c = toScreen({ x: 0, y: 0 });
      const hr = BH_R * cam.s;
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(c.x, c.y, hr * 0.98, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(180, 120, 255, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(c.x, c.y, hr * 0.98, 0, Math.PI * 2); ctx.stroke();
    }

    drawEffects(now);
    drawBhCross(now, w, h);
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
    stepBhCross(now);
    spawnAmbient(now);
    spawnTransit(now);
    stepTransits(now);
    /* 力导向休眠：星云布局静止后跳过 O(n²) 物理，交互/过滤会重新点燃 alpha */
    const asleep = layout === 'nebula' && alpha <= 0.021 && !dragNode && warp === 0 && !bhCross;
    if (!asleep) step();
    draw(now);
    raf = requestAnimationFrame(loop);
  }

  /* ---------- 信息卡 ---------- */
  function renderInfo() {
    if (bhHover && layout === 'blackhole' && !selected) {
      infoEl.hidden = false;
      infoEl.innerHTML = `<b>🕳️ ${t().layouts.blackhole}</b>
        <p>${bhInside ? t().bhInsideHint : t().bhHint}</p>
        <small>${bhInside ? t().bhExit : t().bhEnter}</small>`;
      return;
    }
    const n = selected || hovered;
    if (!n) { infoEl.hidden = true; return; }
    infoEl.hidden = false;
    if (n.type === 'course') {
      const c = n.course;
      infoEl.innerHTML = `<b>${c.icon || ''} ${esc(c.title?.[lang()] || c.id)}</b>
        <p>${esc(c.description?.[lang()] || '')}</p>
        <a href="${esc(c.path)}">${t().open}</a>`;
      infoEl.querySelector('a').addEventListener('click', () => {
        playSfx('click');
        saveState();
      });
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
    hintEl.textContent = layout === 'blackhole'
      ? (bhInside ? t().bhInsideHint : t().bhHint)
      : t().hint;
    closeBtn.title = t().close;
    closeBtn.setAttribute('aria-label', t().close);
    searchInput.placeholder = t().searchPh;
    searchInput.setAttribute('aria-label', t().search);
    searchLabel.textContent = t().search;
    modeNav.setAttribute('aria-label', t().layoutTip);
    for (const b of modeBtns) {
      const id = b.dataset.layout;
      b.querySelector('span').textContent = LAYOUT_ICONS[id];
      b.querySelector('b').textContent = t().layouts[id];
      b.setAttribute('aria-label', `${t().layoutTip}: ${t().layouts[id]}`);
      b.setAttribute('aria-pressed', String(layout === id));
      b.title = t().layouts[id];
    }
    renderSound();
    const visCourses = nodes.filter((n) => n.type === 'course' && visible(n)).length;
    const visTopics = nodes.filter((n) => n.type === 'tag' && visible(n)).length;
    statusEl.textContent = t().status(visCourses, visTopics);
    legendEl.innerHTML = '';
    const chip = (label, color, active, round, onClick) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'starmap__lg' + (active ? ' is-on' : '');
      b.innerHTML = `<i style="background:${color}${round ? ';border-radius:50%' : ''}"></i>${label}`;
      b.addEventListener('click', () => {
        playSfx('click');
        onClick();
      });
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
    renderSearch();
  }

  function applyFilter() {
    if (searchQuery) {
      updateSearch(searchQuery, { quiet: true });
      return;
    }
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
      if (transitOf(nodes[i])) continue; /* 穿梭中不可点 */
      const p = toScreen(nodes[i]);
      const r = nodeRadius(nodes[i]) + 6;
      if ((p.x - sx) ** 2 + (p.y - sy) ** 2 <= r * r) return nodes[i];
    }
    return null;
  }

  function hitBlackHole(sx, sy) {
    if (layout !== 'blackhole') return false;
    const c = toScreen({ x: 0, y: 0 });
    /* 内部出口略放大，保证跃迁过程中仍可点中 */
    const r = bhInside
      ? Math.max(52, 58 * Math.max(0.85, cam.s))
      : BH_R * cam.s * (bhHover ? 1.12 : 1);
    return (c.x - sx) ** 2 + (c.y - sy) ** 2 <= r * r;
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
    const onHole = hitBlackHole(e.offsetX, e.offsetY);
    const h = onHole ? null : hitTest(e.offsetX, e.offsetY);
    if (h !== hovered || onHole !== bhHover) {
      hovered = h;
      bhHover = onHole;
      canvas.style.cursor = (h || onHole) ? 'pointer' : 'grab';
      renderInfo();
    }
  });

  canvas.addEventListener('pointerup', (e) => {
    pointers.delete(e.pointerId);
    pinchD = 0;
    const wasDrag = dragNode;
    if (moved < 6) {
      /* 过场中忽略点击，避免连点打断穿膜 */
      if (bhCross) {
        dragNode = null; panning = false;
        return;
      }
      /* 视界/内部出口优先于课件节点，避免穿梭途中误进课 */
      if (hitBlackHole(e.offsetX, e.offsetY)) {
        toggleBlackHoleInside();
        dragNode = null; panning = false;
        return;
      }
      const n = hitTest(e.offsetX, e.offsetY);
      if (n?.type === 'course') {
        playSfx('click');
        saveState();
        location.href = n.course.path;
        return;
      }
      if (layout === 'knowledge') {
        /* 知识网：点知识点聚焦其关系，再点它或点空白返回全景 */
        const next = (n?.type === 'tag' && n !== tagFocus) ? n : null;
        if (next !== tagFocus) {
          playSfx('click');
          tagFocus = next;
          selected = next;
          relayout(0.45);
          renderInfo();
          dragNode = null; panning = false;
          return;
        }
      }
      if (n) playSfx('click');
      selected = (n && n !== selected) ? n : null;
      bhHover = false;
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
    try { await loadGraph(); } catch {
      pauseBgm(true);
      overlay.hidden = true;
      return;
    }
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    resize();
    hovered = null; selected = null; tagFocus = null; egoSet = null;
    bhInside = false; bhHover = false; bhTransits.length = 0; setBhCross(null);
    const s = restore ? loadState() : null;
    if (s) {
      activeCats.clear();
      for (const c of s.cats || []) if (catAnchors.has(c)) activeCats.add(c);
      showTags = s.showTags !== false;
      searchQuery = String(s.q || '');
      layout = LAYOUTS.includes(s.layout) ? s.layout : 'nebula';
      bhInside = layout === 'blackhole' && !!s.bhIn;
      updateSearch(searchQuery, { quiet: true });
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
      searchQuery = '';
      searchMatches = [];
      searchContext = null;
      searchInput.value = '';
      fitView();
      alpha = 1;
    }
    warp = 0; camGoal = null;
    effects.length = 0; meteors.length = 0; ufo = null; bhTransits.length = 0;
    nextFx = performance.now() + 1500;
    nextMeteor = performance.now() + 2500;
    nextUfo = performance.now() + 15000;
    nextTransit = performance.now() + 2200;
    renderChrome(); renderInfo();
    running = true; tick0 = performance.now();
    raf = requestAnimationFrame(loop);
    startBgm();
    if (matchMedia('(pointer: fine)').matches) searchInput.focus();
    else closeBtn.focus();
  }
  function close() {
    playSfx('click');
    running = false;
    cancelAnimationFrame(raf);
    pauseBgm(true);
    overlay.hidden = true;
    document.body.style.overflow = '';
    clearState();
    if (location.hash === '#starmap') history.replaceState(null, '', location.pathname + location.search);
    btn.focus();
  }

  btn.addEventListener('click', () => {
    unlockAudio().finally(() => {
      startBgm(true);
      open(false);
    });
  });
  closeBtn.addEventListener('click', close);
  modeBtns.forEach((b) => {
    b.addEventListener('click', () => switchLayout(b.dataset.layout));
  });
  soundBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    try { localStorage.setItem(SOUND_STORE, audio.muted ? '1' : '0'); } catch { /* ignore */ }
    if (audio.muted) pauseBgm();
    else {
      unlockAudio().finally(() => {
        startBgm(true);
        playSfx('click');
      });
    }
    renderSound();
  });
  let searchTimer = 0;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => updateSearch(searchInput.value, { quiet: true }), 90);
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchMatches[0]) {
      e.preventDefault();
      focusSearchResult(searchMatches[0]);
    }
  });
  searchClearBtn.addEventListener('click', () => {
    playSfx('click');
    updateSearch('', { quiet: true });
    searchInput.focus();
  });
  addEventListener('keydown', (e) => {
    if (overlay.hidden) return;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
      return;
    }
    if (e.key === 'Escape') close();
  });
  addEventListener('resize', () => { if (!overlay.hidden) resize(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseBgm();
    else if (running) startBgm();
  });
  /* 从课件返回 #starmap 时无点击手势，等第一次交互再解锁音频 */
  const resumeOnGesture = () => {
    if (overlay.hidden || audio.muted || audio.unlocked) return;
    unlockAudio().finally(() => { if (running && !audio.muted) startBgm(true); });
  };
  overlay.addEventListener('pointerdown', resumeOnGesture, { passive: true });
  overlay.addEventListener('keydown', resumeOnGesture);

  /* 从课件页返回：#starmap 锚点或会话内保存的打开状态 → 自动恢复星图 */
  if (location.hash === '#starmap' || loadState()?.open) open(true);
})();
