/* 数独动物园 Sudoku Zoo — 给孩子的阶梯式数独 */
(() => {
  'use strict';

  /* ================= 关卡配置 ================= */
  const LEVELS = [
    {
      id: 'l1', size: 4, holes: 7, icon: '🏡', color: '#06d6a0',
      theme: ['🐶', '🐱', '🐰', '🐹'],
      name: { zh: '宠物新手村', en: 'Pet Village' },
      sub: { zh: '4×4 · 热身', en: '4×4 · warm-up' },
    },
    {
      id: 'l2', size: 6, holes: 16, icon: '🚜', color: '#ffb703',
      theme: ['🐮', '🐷', '🐔', '🐑', '🐴', '🦆'],
      name: { zh: '快乐农场', en: 'Happy Farm' },
      sub: { zh: '6×6 · 简单', en: '6×6 · easy' },
    },
    {
      id: 'l3', size: 6, holes: 23, icon: '🌴', color: '#43aa8b',
      theme: ['🐵', '🦜', '🐸', '🦋', '🐯', '🐍'],
      name: { zh: '奇妙丛林', en: 'Wild Jungle' },
      sub: { zh: '6×6 · 进阶', en: '6×6 · tricky' },
    },
    {
      id: 'l4', size: 9, holes: 42, icon: '🦁', color: '#f8961e',
      theme: ['🦁', '🦒', '🦓', '🐘', '🦏', '🦛', '🐆', '🦩', '🐊'],
      name: { zh: '草原大冒险', en: 'Savanna Trek' },
      sub: { zh: '9×9 · 勇士', en: '9×9 · brave' },
    },
    {
      id: 'l5', size: 9, holes: 52, icon: '🏔️', color: '#577590',
      theme: ['🐧', '🐻‍❄️', '🦭', '🦊', '🦉', '🐺', '🦌', '🐋', '🐲'],
      name: { zh: '传奇冰雪峰', en: 'Legendary Peak' },
      sub: { zh: '9×9 · 传奇', en: '9×9 · legend' },
    },
  ];

  /* ================= 文案 ================= */
  const I18N = {
    zh: {
      back: '返回平台', title: '数独动物园', doc: '数独动物园 · KidsLab', langBtn: 'EN',
      pickLevel: '选一座动物园开始冒险', numberMode: '用数字代替小动物（高手模式）',
      levels: '选关', erase: '擦掉', hint: '魔法提示', check: '侦探眼', newGame: '换一题',
      menuHi: '你好呀！我是园长胖达。小动物们排队等着住进笼舍啦，你来当管理员好不好？',
      lockTip: '先通关上一座动物园哦',
      rule: (n) => `每行、每列、每个粗线园区，${n} 种小动物都要各出现一次，不能重复！`,
      start: ['新一批小动物到啦，点空笼舍安排它们入住吧！', '管理员上岗！先从最有把握的笼舍开始～', '仔细看看每一行每一列，哪个笼舍只有一种可能？'],
      good: { 3: '连对 3 个，手感来了！🔥', 5: '连对 5 个，你是天生的管理员！⚡', 8: '连对 8 个！小动物们都在为你欢呼！🎉', 12: '连对 12 个！！园长帽子借你戴一天！👒' },
      unitRow: '这一行的小动物住满啦，一个不重复！✨',
      unitCol: '这一列也整整齐齐，漂亮！✨',
      unitBox: '这个园区满员啦，动物们很满意！🏡',
      err: ['哎呀，它在这一行/列/园区已经有同伴了，再想想～', '这个笼舍不合适哦，看看有没有重复的？', '别急别急，观察一下同一行和同一列～'],
      hintMsg: '叮——魔法帮你安排了一位小动物！剩下的交给你啦 🪄',
      noHints: '魔法棒没电啦！相信自己，你可以的 💪',
      hintNeedSel: '先点一个空笼舍，再用魔法提示哦',
      detectiveOne: '侦探眼发现：闪光的笼舍只有一种动物能住，想想是谁？🔍',
      detectiveFew: (k) => `闪光的笼舍最好猜，只剩 ${k} 种可能，去排除一下！🔍`,
      detectiveNone: '每个笼舍都填好啦，不需要侦探眼～',
      eraseTip: '先点一个你放过动物的笼舍，再按擦掉',
      winTitle: ['动物园开园啦！', '所有动物入住成功！', '你太厉害了！'],
      winDesc: (time, err, hint) => `用时 ${time} · 放错 ${err} 次 · 用了 ${hint} 次魔法`,
      nextLevel: '下一座动物园 →', replay: '再玩一局',
      newPuzzle: '换了一批新动物，重新排排看！',
      remain: '待入住',
    },
    en: {
      back: 'Back to platform', title: 'Sudoku Zoo', doc: 'Sudoku Zoo · KidsLab', langBtn: '中',
      pickLevel: 'Pick a zoo to start your adventure', numberMode: 'Use numbers instead of animals (pro mode)',
      levels: 'Levels', erase: 'Erase', hint: 'Magic hint', check: 'Detective', newGame: 'New puzzle',
      menuHi: "Hi! I'm Director Panda. The animals are lining up for their pens — will you be our keeper?",
      lockTip: 'Finish the previous zoo first',
      rule: (n) => `Every row, column and bold pen must contain each of the ${n} animals exactly once!`,
      start: ['New animals have arrived — tap an empty pen to house them!', 'Keeper on duty! Start with the pen you are most sure about.', 'Scan each row and column: which pen has only one possibility?'],
      good: { 3: '3 in a row — you are warming up! 🔥', 5: '5 straight — a natural keeper! ⚡', 8: '8 in a row! The animals are cheering! 🎉', 12: '12 straight!! You may borrow my director hat! 👒' },
      unitRow: 'This row is full — no repeats. Sparkling! ✨',
      unitCol: 'This column is complete too. Beautiful! ✨',
      unitBox: 'This pen block is full — happy animals! 🏡',
      err: ['Oops, it already has a twin in that row / column / pen. Look again!', "That pen doesn't fit. Any duplicates nearby?", 'No rush — check the same row and column first.'],
      hintMsg: 'Ding! Magic housed one animal for you. The rest is yours 🪄',
      noHints: 'The wand is out of power! Trust yourself — you got this 💪',
      hintNeedSel: 'Tap an empty pen first, then use the magic hint',
      detectiveOne: 'Detective eye: the glowing pen fits exactly ONE animal. Who is it? 🔍',
      detectiveFew: (k) => `The glowing pen is the easiest — only ${k} possibilities left! 🔍`,
      detectiveNone: 'Every pen is filled — no detective needed!',
      eraseTip: 'Tap one of your own animals first, then press erase',
      winTitle: ['The zoo is open!', 'Every animal is home!', 'You are amazing!'],
      winDesc: (time, err, hint) => `Time ${time} · ${err} misses · ${hint} magic hints`,
      nextLevel: 'Next zoo →', replay: 'Play again',
      newPuzzle: 'A fresh batch of animals — arrange them again!',
      remain: 'waiting',
    },
  };

  let lang = localStorage.getItem('kidslab.lang') || 'zh';
  if (!I18N[lang]) lang = 'zh';
  const t = () => I18N[lang];
  const $ = (s) => document.querySelector(s);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  /* ================= 存档 ================= */
  const SAVE_KEY = 'kidslab.sudokuzoo';
  const save = (() => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } })();
  save.stars = save.stars || {};
  const persist = () => localStorage.setItem(SAVE_KEY, JSON.stringify(save));

  /* ================= 音效 ================= */
  let actx = null;
  let soundOn = save.sound !== false;
  function tone(freq, dur = 0.12, type = 'sine', gain = 0.16, delay = 0) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = actx.currentTime + delay;
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(gain, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      o.connect(g).connect(actx.destination);
      o.start(t0); o.stop(t0 + dur + 0.02);
    } catch { /* ignore */ }
  }
  const sfx = {
    place: () => { tone(620, 0.09, 'triangle'); tone(930, 0.12, 'triangle', 0.12, 0.05); },
    err: () => tone(160, 0.22, 'sawtooth', 0.1),
    pickup: () => tone(500, 0.06, 'triangle', 0.1),
    unit: () => [660, 830, 990].forEach((f, i) => tone(f, 0.14, 'triangle', 0.14, i * 0.07)),
    hint: () => [520, 780, 1040, 1300].forEach((f, i) => tone(f, 0.1, 'sine', 0.12, i * 0.05)),
    win: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.18, 'triangle', 0.16, i * 0.11)),
  };

  /* ================= 数独引擎 ================= */
  const boxDims = (n) => (n === 4 ? [2, 2] : n === 6 ? [2, 3] : [3, 3]);
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function candidates(g, n, i) {
    const [br, bc] = boxDims(n);
    const r = (i / n) | 0, c = i % n;
    const used = new Set();
    for (let k = 0; k < n; k++) { used.add(g[r * n + k]); used.add(g[k * n + c]); }
    const r0 = r - (r % br), c0 = c - (c % bc);
    for (let rr = 0; rr < br; rr++) for (let cc = 0; cc < bc; cc++) used.add(g[(r0 + rr) * n + c0 + cc]);
    const out = [];
    for (let v = 1; v <= n; v++) if (!used.has(v)) out.push(v);
    return out;
  }

  function makeSolution(n) {
    const g = new Array(n * n).fill(0);
    function fill(i) {
      if (i === n * n) return true;
      for (const v of shuffle(candidates(g, n, i))) {
        g[i] = v;
        if (fill(i + 1)) return true;
        g[i] = 0;
      }
      return false;
    }
    fill(0);
    return g;
  }

  function countSolutions(p, n, limit = 2) {
    const g = [...p];
    function bt() {
      let best = -1, bestC = null;
      for (let i = 0; i < n * n; i++) {
        if (g[i]) continue;
        const cs = candidates(g, n, i);
        if (!cs.length) return 0;
        if (!bestC || cs.length < bestC.length) { best = i; bestC = cs; if (cs.length === 1) break; }
      }
      if (best === -1) return 1;
      let total = 0;
      for (const v of bestC) {
        g[best] = v;
        total += bt();
        g[best] = 0;
        if (total >= limit) return total;
      }
      return total;
    }
    return bt();
  }

  function makePuzzle(n, holes) {
    const sol = makeSolution(n);
    const p = [...sol];
    let removed = 0;
    for (const i of shuffle([...Array(n * n).keys()])) {
      if (removed >= holes) break;
      const j = n * n - 1 - i;                    // 中心对称成对挖洞，盘面更好看
      const cells = i === j ? [i] : [i, j];
      if (cells.some((c) => p[c] === 0)) continue;
      const bak = cells.map((c) => p[c]);
      cells.forEach((c) => { p[c] = 0; });
      if (countSolutions(p, n) === 1) removed += cells.length;
      else cells.forEach((c, k) => { p[c] = bak[k]; });
    }
    return { puzzle: p, solution: sol };
  }

  /* ================= 状态 ================= */
  const state = {
    level: null, n: 4, puzzle: [], solution: [], grid: [], given: [],
    sel: -1, brush: 0, hints: 3, hintsUsed: 0, errors: 0, streak: 0,
    startAt: 0, timerId: 0, done: false, busy: false,
  };
  let numberMode = !!save.numbers;

  /* ================= 通用 UI ================= */
  function face(v) { return numberMode ? String(v) : state.level.theme[v - 1]; }
  function setCoach(msg, mood = '🐼') {
    $('#coachFace').textContent = mood;
    const b = $('#coachBubble');
    b.textContent = msg;
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  }
  function fmtTime(ms) {
    const s = Math.round(ms / 1000);
    return `${(s / 60) | 0}:${String(s % 60).padStart(2, '0')}`;
  }
  function applyLang() {
    document.title = t().doc;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    $('#langBtn').textContent = t().langBtn;
    document.querySelectorAll('[data-t]').forEach((el) => {
      const v = t()[el.dataset.t];
      if (typeof v === 'string') el.textContent = v;
    });
    renderMenu();
    if (state.level && !$('#game').hidden) {
      $('#levelBadge').textContent = `${state.level.icon} ${state.level.name[lang]}`;
      renderTray();
      setCoach(t().rule(state.n));
    }
  }

  /* ================= 关卡菜单 ================= */
  const unlocked = (idx) => idx === 0 || !!save.stars[LEVELS[idx - 1].id];

  function renderMenu() {
    const grid = $('#levelGrid');
    grid.innerHTML = '';
    LEVELS.forEach((lv, idx) => {
      const open = unlocked(idx);
      const stars = save.stars[lv.id] || 0;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'lv' + (open ? '' : ' lv--lock');
      card.style.setProperty('--lv', lv.color);
      card.innerHTML = `
        <span class="lv__icon">${open ? lv.icon : '🔒'}</span>
        <span class="lv__name">${lv.name[lang]}</span>
        <span class="lv__sub">${lv.sub[lang]}</span>
        <span class="lv__stars">${open ? '★'.repeat(stars) + '<i>' + '★'.repeat(3 - stars) + '</i>' : ''}</span>
        <span class="lv__pets">${lv.theme.slice(0, 4).join('')}</span>`;
      card.addEventListener('click', () => {
        if (!open) { setMenuBubble(t().lockTip); sfx.err(); card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 450); return; }
        sfx.pickup();
        startLevel(idx);
      });
      grid.appendChild(card);
    });
    $('#numberMode').checked = numberMode;
  }
  function setMenuBubble(msg) {
    const b = $('#menuBubble');
    b.textContent = msg;
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  }

  /* ================= 开局 ================= */
  function startLevel(idx, fresh = true) {
    const lv = LEVELS[idx];
    state.level = lv;
    state.n = lv.size;
    const { puzzle, solution } = makePuzzle(lv.size, lv.holes);
    state.puzzle = puzzle;
    state.solution = solution;
    state.grid = [...puzzle];
    state.given = puzzle.map((v) => v !== 0);
    state.sel = -1; state.brush = 0;
    state.hints = 3; state.hintsUsed = 0; state.errors = 0; state.streak = 0;
    state.done = false; state.busy = false;
    clearInterval(state.timerId);
    state.startAt = Date.now();
    state.timerId = setInterval(() => { $('#timer').textContent = fmtTime(Date.now() - state.startAt); }, 500);
    $('#timer').textContent = '0:00';
    $('#streak').textContent = '0';
    $('#hintCount').textContent = state.hints;
    $('#levelBadge').textContent = `${lv.icon} ${lv.name[lang]}`;
    $('#levelBadge').style.setProperty('--lv', lv.color);
    $('#menu').hidden = true;
    $('#game').hidden = false;
    $('#winBox').hidden = true;
    buildBoard();
    renderTray();
    renderBoard();
    setCoach(fresh ? pick(t().start) : t().newPuzzle);
  }

  /* ================= 棋盘 ================= */
  function buildBoard() {
    const n = state.n;
    const [br, bc] = boxDims(n);
    const board = $('#board');
    board.dataset.n = n;
    board.style.setProperty('--n', n);
    board.innerHTML = '';
    for (let i = 0; i < n * n; i++) {
      const r = (i / n) | 0, c = i % n;
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      if ((c + 1) % bc === 0 && c !== n - 1) cell.classList.add('bR');
      if ((r + 1) % br === 0 && r !== n - 1) cell.classList.add('bB');
      if (((((r / br) | 0) + ((c / bc) | 0)) & 1) === 0) cell.classList.add('alt');
      cell.dataset.i = i;
      cell.style.animationDelay = `${(r + c) * 26}ms`;
      cell.addEventListener('click', () => onCell(i));
      board.appendChild(cell);
    }
  }

  function renderBoard() {
    const n = state.n;
    const cells = $('#board').children;
    const selR = state.sel >= 0 ? (state.sel / n) | 0 : -1;
    const selC = state.sel >= 0 ? state.sel % n : -1;
    const [br, bc] = boxDims(n);
    const selB = state.sel >= 0 ? [selR - (selR % br), selC - (selC % bc)] : null;
    const focusV = state.brush || (state.sel >= 0 ? state.grid[state.sel] : 0);
    for (let i = 0; i < n * n; i++) {
      const el = cells[i];
      const v = state.grid[i];
      const r = (i / n) | 0, c = i % n;
      el.textContent = v ? face(v) : '';
      el.classList.toggle('given', state.given[i]);
      el.classList.toggle('own', !state.given[i] && v !== 0);
      el.classList.toggle('sel', i === state.sel);
      const inUnit = state.sel >= 0 && (r === selR || c === selC ||
        (selB && r >= selB[0] && r < selB[0] + br && c >= selB[1] && c < selB[1] + bc));
      el.classList.toggle('unit', inUnit && i !== state.sel);
      el.classList.toggle('same', focusV !== 0 && v === focusV && i !== state.sel);
    }
  }

  /* ================= 托盘 ================= */
  function renderTray() {
    const n = state.n;
    const tray = $('#tray');
    tray.innerHTML = '';
    for (let v = 1; v <= n; v++) {
      const used = state.grid.filter((x) => x === v).length;
      const left = n - used;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pet' + (state.brush === v ? ' on' : '') + (left === 0 ? ' done' : '');
      b.innerHTML = `<span class="pet__face">${face(v)}</span><b class="pet__n">${left === 0 ? '✓' : left}</b>`;
      b.title = `${t().remain}: ${left}`;
      b.addEventListener('click', () => onTray(v));
      tray.appendChild(b);
    }
  }

  /* ================= 交互 ================= */
  function onTray(v) {
    if (state.done) return;
    if (state.sel >= 0 && !state.given[state.sel] && state.grid[state.sel] === 0) {
      state.brush = v;
      tryPlace(state.sel, v);
      renderTray();
      return;
    }
    state.brush = state.brush === v ? 0 : v;
    state.sel = -1;
    sfx.pickup();
    renderTray();
    renderBoard();
  }

  function onCell(i) {
    if (state.done || state.busy) return;
    const empty = !state.given[i] && state.grid[i] === 0;
    if (empty && state.brush) { tryPlace(i, state.brush); return; }
    state.sel = state.sel === i ? -1 : i;
    if (state.grid[i]) state.brush = 0;
    sfx.pickup();
    renderTray();
    renderBoard();
  }

  function tryPlace(i, v) {
    const cell = $('#board').children[i];
    if (v === state.solution[i]) {
      state.grid[i] = v;
      state.sel = -1;
      state.streak++;
      $('#streak').textContent = state.streak;
      $('#streak').parentElement.classList.remove('pulse'); void cell.offsetWidth;
      $('#streak').parentElement.classList.add('pulse');
      sfx.place();
      renderBoard();
      renderTray();
      cell.classList.add('drop'); setTimeout(() => cell.classList.remove('drop'), 400);
      if (state.grid.filter((x) => x === v).length === state.n && state.brush === v) state.brush = 0;
      const praise = t().good[state.streak];
      const unitMsg = checkUnits(i);
      if (checkWin()) return;
      if (unitMsg) setCoach(unitMsg, '🥳');
      else if (praise) setCoach(praise, '🤩');
    } else {
      state.errors++;
      state.streak = 0;
      $('#streak').textContent = '0';
      state.busy = true;
      cell.textContent = face(v);
      cell.classList.add('bad');
      sfx.err();
      setCoach(pick(t().err), '🙈');
      setTimeout(() => {
        cell.classList.remove('bad');
        state.busy = false;
        renderBoard();
      }, 620);
    }
  }

  /* 行/列/宫 完成检测 + 闪光 */
  function checkUnits(i) {
    const n = state.n;
    const [br, bc] = boxDims(n);
    const r = (i / n) | 0, c = i % n;
    const g = state.grid;
    const cells = $('#board').children;
    let msg = '';
    const glow = (idxs) => idxs.forEach((k, j) => {
      const el = cells[k];
      setTimeout(() => { el.classList.add('glow'); setTimeout(() => el.classList.remove('glow'), 700); }, j * 45);
    });
    const rowIdx = [...Array(n)].map((_, k) => r * n + k);
    const colIdx = [...Array(n)].map((_, k) => k * n + c);
    const r0 = r - (r % br), c0 = c - (c % bc);
    const boxIdx = [];
    for (let rr = 0; rr < br; rr++) for (let cc = 0; cc < bc; cc++) boxIdx.push((r0 + rr) * n + c0 + cc);
    if (rowIdx.every((k) => g[k])) { glow(rowIdx); msg = t().unitRow; }
    if (colIdx.every((k) => g[k])) { glow(colIdx); msg = msg || t().unitCol; }
    if (boxIdx.every((k) => g[k])) { glow(boxIdx); msg = msg || t().unitBox; }
    if (msg) sfx.unit();
    return msg;
  }

  /* ================= 工具按钮 ================= */
  function doErase() {
    if (state.done) return;
    if (state.sel >= 0 && !state.given[state.sel] && state.grid[state.sel]) {
      state.grid[state.sel] = 0;
      sfx.pickup();
      renderBoard(); renderTray();
    } else if (state.brush) {
      state.brush = 0;
      renderTray(); renderBoard();
    } else {
      setCoach(t().eraseTip, '🤔');
    }
  }

  function doHint() {
    if (state.done) return;
    if (state.hints <= 0) { setCoach(t().noHints, '🙈'); sfx.err(); return; }
    let i = state.sel;
    if (i < 0 || state.given[i] || state.grid[i]) {
      // 自动挑一个候选最少的空格
      let best = -1, bestLen = 99;
      for (let k = 0; k < state.n * state.n; k++) {
        if (state.grid[k]) continue;
        const len = candidates(state.grid, state.n, k).length;
        if (len < bestLen) { bestLen = len; best = k; }
      }
      i = best;
    }
    if (i < 0) return;
    state.hints--;
    state.hintsUsed++;
    $('#hintCount').textContent = state.hints;
    sfx.hint();
    const cell = $('#board').children[i];
    cell.classList.add('magic');
    sparkle(cell);
    setTimeout(() => {
      cell.classList.remove('magic');
      state.grid[i] = state.solution[i];
      state.sel = -1;
      renderBoard(); renderTray();
      cell.classList.add('drop'); setTimeout(() => cell.classList.remove('drop'), 400);
      const unitMsg = checkUnits(i);
      if (!checkWin()) setCoach(unitMsg || t().hintMsg, '🪄');
    }, 650);
  }

  function doDetective() {
    if (state.done) return;
    let bestI = -1, bestLen = 99;
    for (let i = 0; i < state.n * state.n; i++) {
      if (state.grid[i]) continue;
      const len = candidates(state.grid, state.n, i).length;
      if (len < bestLen) { bestLen = len; bestI = i; }
    }
    if (bestI < 0) { setCoach(t().detectiveNone); return; }
    const cell = $('#board').children[bestI];
    state.sel = bestI; state.brush = 0;
    renderBoard(); renderTray();
    cell.classList.add('spot');
    setTimeout(() => cell.classList.remove('spot'), 1800);
    sfx.hint();
    setCoach(bestLen === 1 ? t().detectiveOne : t().detectiveFew(bestLen), '🧐');
  }

  function sparkle(el) {
    const rect = el.getBoundingClientRect();
    for (let k = 0; k < 6; k++) {
      const s = document.createElement('span');
      s.className = 'spark';
      s.textContent = pick(['✨', '⭐', '💫']);
      s.style.left = rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width + 'px';
      s.style.top = rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height + 'px';
      s.style.animationDelay = `${k * 60}ms`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  /* ================= 胜利 ================= */
  function checkWin() {
    if (state.grid.some((v, i) => v !== state.solution[i])) return false;
    state.done = true;
    clearInterval(state.timerId);
    const time = fmtTime(Date.now() - state.startAt);
    const stars = state.errors === 0 && state.hintsUsed === 0 ? 3
      : state.errors <= 3 && state.hintsUsed <= 2 ? 2 : 1;
    const lv = state.level;
    if (stars > (save.stars[lv.id] || 0)) save.stars[lv.id] = stars;
    persist();
    sfx.win();
    confetti();
    const idx = LEVELS.indexOf(lv);
    const hasNext = idx < LEVELS.length - 1;
    $('#winStars').innerHTML = '★'.repeat(stars) + '<i>' + '★'.repeat(3 - stars) + '</i>';
    $('#winTitle').textContent = pick(t().winTitle);
    $('#winDesc').textContent = t().winDesc(time, state.errors, state.hintsUsed);
    $('#winNextBtn').textContent = hasNext ? t().nextLevel : t().replay;
    $('#winNextBtn').onclick = () => { startLevel(hasNext ? idx + 1 : idx); };
    const parade = $('#parade');
    parade.innerHTML = '';
    lv.theme.forEach((a, k) => {
      const s = document.createElement('span');
      s.textContent = a;
      s.style.animationDelay = `${k * 0.35}s`;
      parade.appendChild(s);
    });
    setTimeout(() => { $('#winBox').hidden = false; }, 750);
    return true;
  }

  function confetti() {
    const colors = ['#ef476f', '#ffd166', '#06d6a0', '#4cc9f0', '#9b5de5', '#ff9f1c'];
    for (let k = 0; k < 70; k++) {
      const c = document.createElement('i');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = pick(colors);
      c.style.animationDuration = 2.2 + Math.random() * 1.8 + 's';
      c.style.animationDelay = Math.random() * 0.8 + 's';
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }
  }

  /* ================= 键盘 ================= */
  document.addEventListener('keydown', (e) => {
    if ($('#game').hidden || state.done) return;
    const n = state.n;
    if (e.key >= '1' && e.key <= String(n)) {
      const v = +e.key;
      if (state.sel >= 0 && !state.given[state.sel] && !state.grid[state.sel]) tryPlace(state.sel, v);
      else { state.brush = state.brush === v ? 0 : v; renderTray(); renderBoard(); }
      e.preventDefault();
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      doErase(); e.preventDefault();
    } else if (e.key.startsWith('Arrow')) {
      let i = state.sel < 0 ? 0 : state.sel;
      if (state.sel >= 0) {
        if (e.key === 'ArrowUp') i = Math.max(0, i - n);
        if (e.key === 'ArrowDown') i = Math.min(n * n - 1, i + n);
        if (e.key === 'ArrowLeft') i = Math.max(0, i - 1);
        if (e.key === 'ArrowRight') i = Math.min(n * n - 1, i + 1);
      }
      state.sel = i;
      renderBoard();
      e.preventDefault();
    }
  });

  /* ================= 事件绑定 ================= */
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('kidslab.lang', lang);
    applyLang();
  });
  $('#soundBtn').addEventListener('click', () => {
    soundOn = !soundOn;
    save.sound = soundOn;
    persist();
    $('#soundBtn').textContent = soundOn ? '🔊' : '🔇';
    if (soundOn) sfx.pickup();
  });
  $('#numberMode').addEventListener('change', (e) => {
    numberMode = e.target.checked;
    save.numbers = numberMode;
    persist();
  });
  $('#backBtn').addEventListener('click', () => {
    clearInterval(state.timerId);
    $('#game').hidden = true;
    $('#winBox').hidden = true;
    $('#menu').hidden = false;
    renderMenu();
    setMenuBubble(t().menuHi);
  });
  $('#winMenuBtn').addEventListener('click', () => {
    $('#winBox').hidden = true;
    $('#game').hidden = true;
    $('#menu').hidden = false;
    renderMenu();
    setMenuBubble(t().menuHi);
  });
  $('#eraseBtn').addEventListener('click', doErase);
  $('#hintBtn').addEventListener('click', doHint);
  $('#checkBtn').addEventListener('click', doDetective);
  $('#newBtn').addEventListener('click', () => startLevel(LEVELS.indexOf(state.level), false));

  /* ================= 启动 ================= */
  $('#soundBtn').textContent = soundOn ? '🔊' : '🔇';
  applyLang();
  setMenuBubble(t().menuHi);
  // 深链接: #l1 ~ #l5 直接打开已解锁的关卡
  const deep = LEVELS.findIndex((lv) => '#' + lv.id === location.hash);
  if (deep >= 0 && unlocked(deep)) startLevel(deep);
})();
