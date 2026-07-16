/* ============================================================
   KidsLab — 平台逻辑
   levels / categories / search / i18n / themes / collapse
   ============================================================ */
(() => {
  'use strict';

  /* ---------- 常量 ---------- */
  const LS = {
    lang: 'kidslab.lang',
    theme: 'kidslab.theme',
    accent: 'kidslab.accent',
    level: 'kidslab.level',
    grade: 'kidslab.grade',
    collapsed: 'kidslab.sidebar',
  };

  const LEVELS = ['primary', 'junior', 'senior'];
  const GRADES = [
    { id: 'g1', level: 'primary' },
    { id: 'g2', level: 'primary' },
    { id: 'g3', level: 'primary' },
    { id: 'g4', level: 'primary' },
    { id: 'g5', level: 'primary' },
    { id: 'g6', level: 'primary' },
    { id: 'g7', level: 'junior' },
    { id: 'g8', level: 'junior' },
    { id: 'g9', level: 'junior' },
    { id: 'g10', level: 'senior' },
    { id: 'g11', level: 'senior' },
    { id: 'g12', level: 'senior' },
  ];
  const GRADE_IDS = new Set(GRADES.map((g) => g.id));
  const LEVEL_GRADE_IDS = Object.fromEntries(LEVELS.map((lv) => [lv, new Set(GRADES.filter((g) => g.level === lv).map((g) => g.id))]));
  const CN_GRADES = new Map([
    ['一年级', 'g1'], ['二年级', 'g2'], ['三年级', 'g3'],
    ['四年级', 'g4'], ['五年级', 'g5'], ['六年级', 'g6'],
    ['七年级', 'g7'], ['八年级', 'g8'], ['九年级', 'g9'],
    ['十年级', 'g10'], ['十一年级', 'g11'], ['十二年级', 'g12'],
    ['高一', 'g10'], ['高二', 'g11'], ['高三', 'g12'],
  ]);

  const CATS = [
    { id: 'all',         icon: '✨', color: 'var(--accent)' },
    { id: 'math',        icon: '🧮', color: 'var(--c-math)' },
    { id: 'physics',     icon: '🧲', color: 'var(--c-physics)' },
    { id: 'chemistry',   icon: '⚗️', color: 'var(--c-chemistry)' },
    { id: 'programming', icon: '💻', color: 'var(--c-programming)' },
    { id: 'science',     icon: '🔬', color: 'var(--c-science)' },
    { id: 'logic',       icon: '🧩', color: 'var(--c-logic)' },
  ];
  /* 小学只显示这些分类 */
  const PRIMARY_CATS = new Set(['all', 'math', 'programming', 'science', 'logic']);

  const ACCENTS = [
    { id: 'candy', sw: '#ff5d8f' },
    { id: 'ocean', sw: '#2f9df4' },
    { id: 'forest', sw: '#2fbf71' },
    { id: 'tangerine', sw: '#ff8a00' },
  ];

  const CHIP_INK = { logic: '#4a3200' }; // 浅色底用深字

  /* ---------- 文案 ---------- */
  const I18N = {
    zh: {
      siteName: 'KidsLab',
      siteSub: 'K12 Playground',
      docTitle: 'KidsLab · 互动课件学习乐园',
      secLevel: '学段',
      secGrade: '年级',
      secCats: '分类',
      searchPh: '搜索课件：分数、单摆、编程……',
      heroTitle: '嗨，小小探索家！',
      tipTheme: '切换深浅主题',
      tipStarmap: '知识星图 · 换个方式探索',
      tipLang: 'Switch to English',
      tipCollapse: '收起 / 展开侧栏',
      emptyTitle: '没有找到匹配的课件',
      emptyDesc: '换个关键词，或者去别的分类逛逛吧～',
      emptyReset: '清除筛选',
      footMade: '用 ❤ 为好奇心而建',
      langBtn: 'EN',
      count: (n) => `共 ${n} 个课件`,
      total: (n) => `· ${n} 个课件`,
      pinned: '精选',
      gradeAll: '全部年级',
      loadErr: '课件清单加载失败，请先运行 npm run build 并通过 npm run preview 访问。',
      levels: { primary: '小学', junior: '初中', senior: '高中' },
      lvShort: { primary: '小', junior: '初', senior: '高' },
      grades: {
        g1: '一年级', g2: '二年级', g3: '三年级', g4: '四年级', g5: '五年级', g6: '六年级',
        g7: '七年级', g8: '八年级', g9: '九年级', g10: '高一', g11: '高二', g12: '高三',
      },
      cats: {
        all: '全部', math: '数学', physics: '物理', chemistry: '化学',
        programming: '编程', science: '科学', logic: '逻辑', featured: '精选',
      },
    },
    en: {
      siteName: 'KidsLab',
      siteSub: 'K12 Playground',
      docTitle: 'KidsLab · Interactive Courseware Playground',
      secLevel: 'Stage',
      secGrade: 'Grade',
      secCats: 'Subjects',
      searchPh: 'Search: fractions, pendulum, coding…',
      heroTitle: 'Hey, little explorer!',
      tipTheme: 'Toggle light / dark theme',
      tipStarmap: 'Knowledge star map · explore differently',
      tipLang: '切换到中文',
      tipCollapse: 'Collapse / expand sidebar',
      emptyTitle: 'No courseware found',
      emptyDesc: 'Try another keyword, or explore other subjects~',
      emptyReset: 'Clear filters',
      footMade: 'Built with ❤ for curiosity',
      langBtn: '中',
      count: (n) => `${n} courseware${n === 1 ? '' : 's'}`,
      total: (n) => `· ${n} items`,
      pinned: 'Featured',
      gradeAll: 'All grades',
      loadErr: 'Failed to load the manifest. Run `npm run build` then `npm run preview`.',
      levels: { primary: 'Primary', junior: 'Middle', senior: 'High' },
      lvShort: { primary: 'P', junior: 'M', senior: 'H' },
      grades: {
        g1: 'Grade 1', g2: 'Grade 2', g3: 'Grade 3', g4: 'Grade 4', g5: 'Grade 5', g6: 'Grade 6',
        g7: 'Grade 7', g8: 'Grade 8', g9: 'Grade 9', g10: 'Grade 10', g11: 'Grade 11', g12: 'Grade 12',
      },
      cats: {
        all: 'All', math: 'Math', physics: 'Physics', chemistry: 'Chemistry',
        programming: 'Coding', science: 'Science', logic: 'Logic', featured: 'Featured',
      },
    },
  };

  /* ---------- 状态 ---------- */
  const params = new URLSearchParams(location.search);
  const state = {
    lang: params.get('lang') || localStorage.getItem(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en'),
    theme: localStorage.getItem(LS.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    accent: localStorage.getItem(LS.accent) || 'candy',
    level: params.get('level') || localStorage.getItem(LS.level) || 'primary',
    grade: params.get('grade') || localStorage.getItem(LS.grade) || 'all',
    cat: params.get('cat') || sessionStorage.getItem('kidslab.cat') || 'all',
    q: params.get('q') ?? sessionStorage.getItem('kidslab.q') ?? '',
    courses: [],
  };
  if (!LEVELS.includes(state.level)) state.level = 'primary';
  if (state.grade !== 'all' && !GRADE_IDS.has(state.grade)) state.grade = 'all';
  if (state.grade !== 'all' && !LEVEL_GRADE_IDS[state.level]?.has(state.grade)) state.grade = 'all';
  if (!['zh', 'en'].includes(state.lang)) state.lang = 'zh';
  if (!CATS.some((c) => c.id === state.cat)) state.cat = 'all';
  if (!ACCENTS.some((a) => a.id === state.accent)) state.accent = 'candy';

  const t = () => I18N[state.lang];
  const $ = (s) => document.querySelector(s);

  const el = {
    app: $('#app'), sidebar: $('#sidebar'), backdrop: $('#backdrop'),
    levelSeg: $('#levelSeg'), catList: $('#catList'), accentRow: $('#accentRow'),
    gradeSec: $('#gradeSec'), gradeList: $('#gradeList'),
    grid: $('#grid'), empty: $('#emptyBox'), search: $('#searchInput'),
    heroTitle: $('#heroTitle'), crumb: $('#crumb'), countText: $('#countText'),
    courseTotal: $('#courseTotal'),
  };

  /* ---------- 主题 / 强调色 / 语言 ---------- */
  function applyChrome() {
    const root = document.documentElement;
    root.dataset.theme = state.theme;
    root.dataset.accent = state.accent;
    root.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t().docTitle;

    document.querySelectorAll('[data-i18n]').forEach((n) => { n.textContent = t()[n.dataset.i18n] ?? n.textContent; });
    document.querySelectorAll('[data-i18n-title]').forEach((n) => { n.title = t()[n.dataset.i18nTitle] ?? n.title; });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((n) => { n.placeholder = t()[n.dataset.i18nPlaceholder] ?? ''; });
    $('#langBtn').textContent = t().langBtn;
    el.heroTitle.innerHTML = `${t().heroTitle}<span class="hero__wave">👋</span>`;
  }

  function persist() {
    localStorage.setItem(LS.lang, state.lang);
    localStorage.setItem(LS.theme, state.theme);
    localStorage.setItem(LS.accent, state.accent);
    localStorage.setItem(LS.level, state.level);
    localStorage.setItem(LS.grade, state.grade);
    sessionStorage.setItem('kidslab.cat', state.cat);
    sessionStorage.setItem('kidslab.q', state.q);
    const p = new URLSearchParams();
    if (state.level !== 'primary') p.set('level', state.level);
    if (state.grade !== 'all') p.set('grade', state.grade);
    if (state.cat !== 'all') p.set('cat', state.cat);
    if (state.q) p.set('q', state.q);
    history.replaceState(null, '', p.size ? `?${p}` : location.pathname);
  }

  /* ---------- 侧栏渲染 ---------- */
  function renderLevels() {
    el.levelSeg.innerHTML = '';
    for (const lv of LEVELS) {
      const b = document.createElement('button');
      b.type = 'button';
      b.role = 'radio';
      b.textContent = t().levels[lv];
      b.setAttribute('aria-checked', String(state.level === lv));
      b.addEventListener('click', () => {
        state.level = lv;
        if (state.grade !== 'all' && !LEVEL_GRADE_IDS[lv]?.has(state.grade)) state.grade = 'all';
        if (lv === 'primary' && !PRIMARY_CATS.has(state.cat)) state.cat = 'all';
        update();
      });
      el.levelSeg.appendChild(b);
    }
  }

  const inLevel = (c) => c.levels?.includes(state.level);
  const gradeInLevel = (grade, level = state.level) => grade === 'all' || LEVEL_GRADE_IDS[level]?.has(grade);

  function normalizeGrade(value) {
    const raw = String(value ?? '').trim();
    const lower = raw.toLowerCase();
    if (GRADE_IDS.has(lower)) return lower;
    const compact = lower.replace(/\s+/g, '');
    const en = compact.match(/^(?:grade|g)([1-9]|1[0-2])$/);
    if (en) return `g${en[1]}`;
    const ordinal = lower.match(/\b([1-9]|1[0-2])(?:st|nd|rd|th)?\s*grade\b/);
    if (ordinal) return `g${ordinal[1]}`;
    return CN_GRADES.get(raw) || null;
  }

  function courseGrades(c) {
    if (c._gradeSet) return c._gradeSet;
    const grades = new Set();
    const scan = (value) => {
      const direct = normalizeGrade(value);
      if (direct) grades.add(direct);
      const text = String(value ?? '').trim();
      for (const [label, id] of CN_GRADES) {
        if (text.includes(label)) grades.add(id);
      }
      const lower = text.toLowerCase();
      const match = lower.match(/\b(?:grade|g)\s*[-:]?\s*([1-9]|1[0-2])\b/);
      if (match) grades.add(`g${match[1]}`);
    };
    (Array.isArray(c.grades) ? c.grades : []).forEach(scan);
    (Array.isArray(c.tags) ? c.tags : []).forEach(scan);
    c._gradeSet = grades;
    return grades;
  }

  const inGrade = (c) => state.grade === 'all' || courseGrades(c).has(state.grade);

  function availableGrades() {
    return GRADES.filter((g) =>
      g.level === state.level &&
      state.courses.some((c) => !c.pinned && inLevel(c) && courseGrades(c).has(g.id)));
  }

  function renderGrades() {
    const grades = availableGrades();
    if (!grades.length) {
      state.grade = 'all';
      el.gradeList.innerHTML = '';
      el.gradeSec.hidden = true;
      return;
    }
    if (!gradeInLevel(state.grade) || (state.grade !== 'all' && !grades.some((g) => g.id === state.grade))) state.grade = 'all';
    el.gradeSec.hidden = false;
    el.gradeList.innerHTML = '';

    const inCurrentScope = (c) => !c.pinned && inLevel(c) && (state.cat === 'all' || c.category === state.cat);
    const options = [
      { id: 'all', label: t().gradeAll, count: state.courses.filter(inCurrentScope).length },
      ...grades.map((g) => ({
        id: g.id,
        label: t().grades[g.id],
        count: state.courses.filter((c) => inCurrentScope(c) && courseGrades(c).has(g.id)).length,
      })),
    ];

    for (const opt of options) {
      const b = document.createElement('button');
      b.type = 'button';
      b.role = 'radio';
      b.setAttribute('aria-checked', String(state.grade === opt.id));
      b.innerHTML = '<span class="grade__name"></span><span class="grade__count"></span>';
      b.querySelector('.grade__name').textContent = opt.label;
      b.querySelector('.grade__count').textContent = opt.count;
      b.addEventListener('click', () => { state.grade = opt.id; closeDrawer(); update(); });
      el.gradeList.appendChild(b);
    }
  }

  function renderCats() {
    el.catList.innerHTML = '';
    const visible = state.level === 'primary' ? CATS.filter((c) => PRIMARY_CATS.has(c.id)) : CATS;
    for (const cat of visible) {
      const n = state.courses.filter((c) => !c.pinned && inLevel(c) && inGrade(c) && (cat.id === 'all' || c.category === cat.id)).length;
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.style.setProperty('--cat-c', cat.color);
      b.classList.toggle('is-active', state.cat === cat.id);
      b.innerHTML = `<span class="cat__dot">${cat.icon}</span><span class="cat__name"></span><span class="cat__count">${n}</span>`;
      b.querySelector('.cat__name').textContent = t().cats[cat.id];
      b.addEventListener('click', () => { state.cat = cat.id; closeDrawer(); update(); });
      li.appendChild(b);
      el.catList.appendChild(li);
    }
  }

  function renderAccents() {
    el.accentRow.innerHTML = '';
    for (const a of ACCENTS) {
      const b = document.createElement('button');
      b.type = 'button';
      b.style.setProperty('--sw', a.sw);
      b.title = a.id;
      b.classList.toggle('is-active', state.accent === a.id);
      b.addEventListener('click', () => { state.accent = a.id; update(); });
      el.accentRow.appendChild(b);
    }
  }

  /* ---------- 过滤 + 卡片 ---------- */
  function matchQuery(c, q) {
    if (!q) return true;
    const hay = [
      c.title?.zh, c.title?.en, c.description?.zh, c.description?.en,
      ...(c.tags || []), ...(c.keywords || []), t().cats[c.category] || c.category,
      ...Array.from(courseGrades(c)).flatMap((g) => [I18N.zh.grades[g], I18N.en.grades[g], g]),
    ].join(' ').toLowerCase();
    return q.toLowerCase().trim().split(/\s+/).every((w) => hay.includes(w));
  }

  function filtered() {
    const q = state.q;
    return state.courses.filter((c) => {
      if (!matchQuery(c, q)) return false;
      if (c.pinned) return true; /* 置顶课件跳过侧栏筛选 */
      if (!inLevel(c)) return false;
      if (!inGrade(c)) return false;
      if (state.cat !== 'all' && c.category !== state.cat) return false;
      return true;
    });
  }

  function catColor(id) {
    return (CATS.find((c) => c.id === id) || {}).color || 'var(--c-featured)';
  }

  function card(c, i) {
    const a = document.createElement('a');
    a.className = 'card';
    a.href = c.path;
    a.style.setProperty('--i', i);
    a.style.setProperty('--cat-c', c.pinned ? 'var(--c-featured)' : catColor(c.category));

    const cover = document.createElement('div');
    cover.className = 'card__cover';
    cover.innerHTML = `<span class="card__emoji">${c.icon || '📘'}</span>`;
    if (c.pinned) cover.insertAdjacentHTML('beforeend', `<span class="card__pin">⭐ ${t().pinned}</span>`);
    if (c.badge === 'new') cover.insertAdjacentHTML('beforeend', `<span class="card__new">✨</span>`);

    const body = document.createElement('div');
    body.className = 'card__body';
    const h = document.createElement('h3');
    h.className = 'card__title';
    h.textContent = c.title[state.lang];
    const p = document.createElement('p');
    p.className = 'card__desc';
    p.textContent = c.description[state.lang];
    body.append(h, p);

    const meta = document.createElement('div');
    meta.className = 'card__meta';
    const chip = document.createElement('span');
    chip.className = 'chip chip--cat';
    chip.textContent = t().cats[c.category] || c.category;
    if (CHIP_INK[c.category]) chip.style.color = CHIP_INK[c.category];
    const lvs = document.createElement('span');
    lvs.className = 'card__levels';
    for (const lv of LEVELS) {
      if (c.levels.includes(lv)) lvs.insertAdjacentHTML('beforeend', `<span class="lv" title="${t().levels[lv]}">${t().lvShort[lv]}</span>`);
    }
    meta.append(chip, lvs);

    a.append(cover, body, meta);
    return a;
  }

  function renderGrid() {
    const list = filtered();
    el.grid.innerHTML = '';
    list.forEach((c, i) => el.grid.appendChild(card(c, i)));
    el.empty.hidden = list.length > 0;
    el.countText.textContent = t().count(list.length);
    el.crumb.innerHTML = `<b>${t().levels[state.level]}</b>${state.grade !== 'all' ? ` · ${t().grades[state.grade]}` : ''} · ${t().cats[state.cat]}${state.q ? ` · “${esc(state.q)}”` : ''}`;
    el.courseTotal.textContent = t().total(state.courses.length);
  }

  const esc = (s) => s.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  function update() {
    applyChrome();
    renderLevels();
    renderGrades();
    renderCats();
    renderAccents();
    renderGrid();
    persist();
  }

  /* ---------- 侧栏收拢 / 移动抽屉 ---------- */
  const isMobile = () => matchMedia('(max-width: 860px)').matches;

  function closeDrawer() {
    if (!isMobile()) return;
    el.app.classList.remove('menu-open');
    el.backdrop.hidden = true;
  }

  $('#collapseBtn').addEventListener('click', () => {
    const on = el.app.classList.toggle('is-collapsed');
    localStorage.setItem(LS.collapsed, on ? '1' : '');
  });
  $('#menuBtn').addEventListener('click', () => {
    el.app.classList.add('menu-open');
    el.backdrop.hidden = false;
  });
  el.backdrop.addEventListener('click', closeDrawer);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
  if (localStorage.getItem(LS.collapsed) === '1') el.app.classList.add('is-collapsed');

  /* ---------- 顶栏交互 ---------- */
  $('#themeBtn').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    update();
  });
  $('#langBtn').addEventListener('click', () => {
    state.lang = state.lang === 'zh' ? 'en' : 'zh';
    update();
  });
  $('#resetBtn').addEventListener('click', () => {
    state.q = '';
    state.grade = 'all';
    state.cat = 'all';
    el.search.value = '';
    update();
    el.search.focus();
  });

  let debounce = 0;
  el.search.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { state.q = el.search.value; update(); }, 120);
  });
  addEventListener('keydown', (e) => {
    if (e.key === '/' && !/^(input|textarea)$/i.test(document.activeElement?.tagName || '')) {
      e.preventDefault();
      el.search.focus();
    }
  });

  /* ---------- 启动 ---------- */
  el.search.value = state.q;
  applyChrome();

  fetch('courseware/index.json', { cache: 'no-cache' })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((m) => { state.courses = m.courses || []; update(); })
    .catch(() => {
      el.grid.innerHTML = '';
      el.empty.hidden = false;
      el.empty.querySelector('.empty__scope').textContent = '⚠️';
      el.empty.querySelector('h3').removeAttribute('data-i18n');
      el.empty.querySelector('h3').textContent = t().loadErr;
      el.empty.querySelector('p').textContent = '';
      el.empty.querySelector('p').removeAttribute('data-i18n');
      $('#resetBtn').hidden = true;
    });
})();
