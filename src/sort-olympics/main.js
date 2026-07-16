/* ============================================================
   排序运动会 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '排序运动会 · KidsLab', back: '返回平台', title: '排序运动会',
      eyebrow: 'G5-6 · 算法比较实验场', heroTitle: '企鹅排队，只准两两比高矮',
      tip0: '先徒手交换，再让三位算法教练同场赛跑。', modeManual: '徒手排', modeCoach: '教练演示', modeRace: '算法赛跑', modeMega: '100 只极限赛',
      compares: '比较', swaps: '交换', stars: '星星', coach: '教练', bubble: '冒泡', selection: '选择', insertion: '插入', startShape: '队伍', random: '乱序', reverse: '倒序', nearly: '几乎有序', predict: '预测冠军', speed: '速度',
      newRound: '换一队企鹅', doSwap: '交换', noSwap: '不换', singleStep: '单步', autoRun: '自动演示', pause: '暂停', again: '再玩一次', startRace: '开跑', judgeWhistle: '裁判吹哨！',
      manualReady: '点两只相邻企鹅比较高矮，再决定要不要交换。目标：从矮到高排队！', adjacentOnly: '只能比较相邻的两只企鹅哦。', compared: (a, b) => `裁判举牌：${a}cm 和 ${b}cm，比较 +1。高个在左边就交换。`, sorted: (c, s, star) => `哨声响起！全队从矮到高。比较 ${c} 次，交换 ${s} 次，获得 ${star}。`,
      bubbleLine: '冒泡教练：只看邻居，高个子像泡泡一样一轮轮浮到队尾。', selectionLine: '选择教练：每轮全场扫描，挑出最矮的站到前面。', insertionLine: '插入教练：左边保持整齐，新企鹅插进合适位置。',
      raceReady: '先押冠军，再开跑！三位教练拿到同一批企鹅，比较次数实时对决。', raceExplain: (w, p, ok) => `${w} 拿冠军！${ok ? '你押中了，奖杯给你！🏆' : `你押的是 ${p}。`} 算法有性格，场景定输赢。`, nearlyMagic: '魔法时刻：几乎有序时，插入排序少量挪动就完成，遥遥领先！', megaExplain: '100 只企鹅极限赛：都变成柱状图后，n² 的比较增长一下子能看见。',
      podium: '颁奖台', champ: '冠军', reset: '已换一队企鹅，裁判准备好了。', finished: '演示结束：观察比较次数，谁更省力？',
    },
    en: {
      doc: 'Sorting Olympics · KidsLab', back: 'Back to platform', title: 'Sorting Olympics',
      eyebrow: 'G5-6 · Algorithm comparison arena', heroTitle: 'Penguins line up by comparing two at a time',
      tip0: 'Sort by hand, then race three algorithm coaches.', modeManual: 'Manual sort', modeCoach: 'Coach demo', modeRace: 'Algorithm race', modeMega: '100 penguin sprint',
      compares: 'Compares', swaps: 'Swaps', stars: 'Stars', coach: 'Coach', bubble: 'Bubble', selection: 'Selection', insertion: 'Insertion', startShape: 'Line-up', random: 'Random', reverse: 'Reverse', nearly: 'Nearly sorted', predict: 'Predict winner', speed: 'Speed',
      newRound: 'New team', doSwap: 'Swap', noSwap: 'No swap', singleStep: 'Step', autoRun: 'Auto demo', pause: 'Pause', again: 'Play again', startRace: 'Race', judgeWhistle: 'Judge whistle!',
      manualReady: 'Tap two neighboring penguins to compare, then swap or keep. Goal: short to tall!', adjacentOnly: 'Only neighboring penguins can be compared.', compared: (a, b) => `Judge card: ${a}cm vs ${b}cm, compare +1. Swap if the taller one is on the left.`, sorted: (c, s, star) => `Whistle! Short to tall. ${c} compares, ${s} swaps, ${star}.`,
      bubbleLine: 'Bubble coach: only checks neighbors; tall penguins bubble to the end each pass.', selectionLine: 'Selection coach: scans the whole field and chooses the shortest for the front.', insertionLine: 'Insertion coach: keeps the left side tidy and inserts each newcomer.',
      raceReady: 'Pick a winner, then race! Same penguins, live comparison counters.', raceExplain: (w, p, ok) => `${w} wins! ${ok ? 'Your trophy prediction was right! 🏆' : `You picked ${p}.`} Algorithms have personalities; situations decide.`, nearlyMagic: 'Magic moment: when nearly sorted, insertion barely moves anything and zooms ahead!', megaExplain: '100 penguin sprint: with bars instead of penguins, quadratic growth becomes visible.',
      podium: 'Podium', champ: 'Champion', reset: 'A fresh penguin team is ready.', finished: 'Demo done: compare the counters — who worked less?',
    },
  };

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* 忽略 */ } } };
  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme !== 'light' && theme !== 'dark') theme = 'light';
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
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
    render();
  }
  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    render();
  }
  langBtn?.addEventListener('click', () => { lang = lang === 'zh' ? 'en' : 'zh'; store.set(LS.lang, lang); applyLang(); });
  themeBtn?.addEventListener('click', () => { theme = theme === 'light' ? 'dark' : 'light'; store.set(LS.theme, theme); applyTheme(); });

  /* ======================= 游戏区 · Game ======================= */
  const $ = (s) => document.querySelector(s);
  const canvas = $('#stage');
  const ctx = canvas.getContext('2d');
  const ui = {
    compare: $('#compareCount'), swap: $('#swapCount'), stars: $('#starCount'), narrator: $('#narrator'),
    swapBtn: $('#swapBtn'), noSwapBtn: $('#noSwapBtn'), stepBtn: $('#stepBtn'), autoBtn: $('#autoBtn'), newBtn: $('#newBtn'),
    algo: $('#algoSelect'), shape: $('#shapeSelect'), speed: $('#speedRange'), predict: $('#predictSelect'), modal: $('#winModal'), modalTitle: $('#modalTitle'), modalDesc: $('#modalDesc'), modalEmoji: $('#modalEmoji'), modalBtn: $('#modalBtn'),
  };
  const algos = ['bubble', 'selection', 'insertion'];
  let W = 1000, H = 520, dpr = 1, colors = {};
  let mode = 'manual', penguins = [], selected = [], pendingPair = null, compareCount = 0, swapCount = 0, autoTimer = 0, auto = false, last = 0;
  let coach = null, race = null, mega = null, seed = 42, fx = [];

  function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  const label = (k) => t(k);
  function setNarrator(msg) { ui.narrator.textContent = msg; }
  function resetCounters() { compareCount = 0; swapCount = 0; updateHud(); }
  function updateHud() { ui.compare.textContent = compareCount; ui.swap.textContent = swapCount; ui.stars.textContent = mode === 'manual' ? starText() : '—'; }
  function starText() { const inv = inversions(penguins.map((p) => p.h)); const score = compareCount <= Math.max(9, inv + 8) ? 3 : compareCount <= inv + 18 ? 2 : 1; return '★'.repeat(score) + '☆'.repeat(3 - score); }
  function inversions(a) { let n = 0; for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] > a[j]) n++; return n; }
  function isSorted(a = penguins.map((p) => p.h)) { return a.every((v, i) => !i || a[i - 1] <= v); }
  function makeHeights(n, shape = 'random') {
    let a = Array.from({ length: n }, (_, i) => 92 + i * Math.round(62 / Math.max(1, n - 1)));
    if (shape === 'reverse') return a.reverse();
    if (shape === 'nearly') { for (let k = 0; k < Math.max(2, n / 12); k++) { const i = 1 + Math.floor(rnd() * (n - 2)); [a[i], a[i + 1]] = [a[i + 1], a[i]]; } return a; }
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function makePenguins(n = 9, shape = 'random') {
    return makeHeights(n, shape).map((h, i) => ({ h, id: i + '-' + h, scarfIndex: i, x: 0, tx: 0, y: 0, glow: false, done: false }));
  }
  function layoutPenguins(arr = penguins, y = H * 0.66, x0 = W * 0.08, x1 = W * 0.92) { arr.forEach((p, i) => { p.tx = x0 + (x1 - x0) * (arr.length === 1 ? .5 : i / (arr.length - 1)); if (!p.x) p.x = p.tx; p.y = y; }); }
  function newRound() {
    stopAuto(); seed = Date.now() & 0xffff; selected = []; pendingPair = null; resetCounters();
    if (mode === 'manual') { penguins = makePenguins(9, 'random'); layoutPenguins(); setNarrator(t('manualReady')); }
    if (mode === 'coach') setupCoach();
    if (mode === 'race') setupRace();
    if (mode === 'mega') setupMega();
    updateControls(); render();
  }
  function updateControls() {
    ui.swapBtn.disabled = mode !== 'manual' || !pendingPair;
    ui.noSwapBtn.disabled = mode !== 'manual' || !pendingPair;
    ui.stepBtn.disabled = mode === 'manual' || mode === 'race' || mode === 'mega';
    ui.autoBtn.disabled = false;
    ui.autoBtn.textContent = auto ? t('pause') : (mode === 'race' || mode === 'mega' ? t('startRace') : t('autoRun'));
    document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
  }
  function pickAt(x, y) {
    let hit = -1;
    penguins.forEach((p, i) => { if (Math.abs(x - p.x) < 38 && y > p.y - p.h - 45 && y < p.y + 30) hit = i; });
    return hit;
  }
  function comparePair(i, j) {
    if (Math.abs(i - j) !== 1) { setNarrator(t('adjacentOnly')); return; }
    selected = [i, j].sort((a, b) => a - b); pendingPair = selected.slice(); compareCount++; penguins.forEach((p, k) => p.glow = selected.includes(k));
    setNarrator(t('compared')(penguins[selected[0]].h, penguins[selected[1]].h)); updateHud(); updateControls(); render();
  }
  function manualDecision(doSwap) {
    if (!pendingPair) return;
    const [i, j] = pendingPair;
    if (doSwap) { [penguins[i], penguins[j]] = [penguins[j], penguins[i]]; swapCount++; layoutPenguins(); popFx((penguins[i].tx + penguins[j].tx) / 2, H * .28, '↔'); }
    selected = []; pendingPair = null; penguins.forEach((p) => p.glow = false); updateHud(); updateControls();
    if (isSorted()) winManual(); else setNarrator(t('manualReady'));
  }
  function winManual() {
    const s = starText(); setNarrator(t('sorted')(compareCount, swapCount, s)); ui.modalEmoji.textContent = '🏅🐧'; ui.modalTitle.textContent = t('judgeWhistle'); ui.modalDesc.textContent = t('sorted')(compareCount, swapCount, s); ui.modal.hidden = false; burst();
  }

  function buildSteps(kind, arr) {
    const a = arr.slice(), steps = [];
    const push = (type, i, j, note, swap = false, doneFrom = -1) => steps.push({ type, i, j, note, swap, arr: a.slice(), doneFrom });
    if (kind === 'bubble') {
      for (let end = a.length - 1; end > 0; end--) { for (let i = 0; i < end; i++) { push('compare', i, i + 1, 'bubbleLine', false, end + 1); if (a[i] > a[i + 1]) { [a[i], a[i + 1]] = [a[i + 1], a[i]]; push('swap', i, i + 1, 'bubbleLine', true, end + 1); } } push('mark', end, end, 'bubbleLine', false, end); }
    } else if (kind === 'selection') {
      for (let start = 0; start < a.length - 1; start++) { let min = start; for (let j = start + 1; j < a.length; j++) { push('compare', min, j, 'selectionLine', false, start); if (a[j] < a[min]) min = j; } if (min !== start) { [a[start], a[min]] = [a[min], a[start]]; push('swap', start, min, 'selectionLine', true, start + 1); } push('mark', start, start, 'selectionLine', false, start + 1); }
    } else {
      for (let i = 1; i < a.length; i++) { let j = i; push('hold', i, i, 'insertionLine', false, i); while (j > 0) { push('compare', j - 1, j, 'insertionLine', false, i); if (a[j - 1] <= a[j]) break; [a[j - 1], a[j]] = [a[j], a[j - 1]]; push('swap', j - 1, j, 'insertionLine', true, i); j--; } }
    }
    return steps;
  }
  function setupCoach() { resetCounters(); const kind = ui.algo.value; penguins = makePenguins(10, ui.shape.value); layoutPenguins(); coach = { kind, steps: buildSteps(kind, penguins.map((p) => p.h)), idx: 0, doneFrom: -1 }; setNarrator(t(kind + 'Line')); }
  function coachStep() {
    if (!coach || coach.idx >= coach.steps.length) { stopAuto(); setNarrator(t('finished')); return; }
    const st = coach.steps[coach.idx++]; selected = [st.i, st.j]; penguins.forEach((p, k) => { p.glow = selected.includes(k); p.done = st.doneFrom >= 0 && (coach.kind === 'bubble' ? k >= st.doneFrom : k < st.doneFrom); });
    if (st.type === 'compare') compareCount++;
    if (st.swap) { [penguins[st.i], penguins[st.j]] = [penguins[st.j], penguins[st.i]]; swapCount++; popFx((penguins[st.i].tx + penguins[st.j].tx) / 2, H * .3, '↔'); }
    layoutPenguins(); setNarrator(t(st.note)); updateHud(); render();
  }

  function setupRace() {
    resetCounters(); const base = makeHeights(24, ui.shape.value); race = { lanes: algos.map((kind, lane) => ({ kind, arr: base.slice(), steps: buildSteps(kind, base), idx: 0, compares: 0, swaps: 0, done: false, lane })), over: false, tick: 0 };
    setNarrator(t('raceReady')); updateHud();
  }
  function raceStep(mult = 1) {
    if (!race || race.over) return;
    for (let m = 0; m < mult; m++) race.lanes.forEach((lane) => {
      if (lane.done) return;
      const st = lane.steps[lane.idx++];
      if (!st) { lane.done = true; return; }
      if (st.type === 'compare') lane.compares++;
      if (st.swap) lane.swaps++;
      lane.arr = st.arr.slice();
      if (lane.idx >= lane.steps.length) lane.done = true;
    });
    if (race.lanes.every((l) => l.done)) finishRace();
  }
  function finishRace() {
    race.over = true; stopAuto(); const winner = race.lanes.slice().sort((a, b) => a.compares - b.compares || a.swaps - b.swaps)[0];
    const p = ui.predict.value, msg = t('raceExplain')(t(winner.kind), t(p), winner.kind === p);
    setNarrator(ui.shape.value === 'nearly' && winner.kind === 'insertion' ? `${t('nearlyMagic')} ${msg}` : msg);
    ui.modalEmoji.textContent = winner.kind === p ? '🏆✨' : '🥈🐧'; ui.modalTitle.textContent = `${t('champ')}：${t(winner.kind)}`; ui.modalDesc.textContent = msg; ui.modal.hidden = false; burst();
  }
  function setupMega() {
    const base = makeHeights(100, ui.shape.value); mega = { lanes: algos.map((kind) => ({ kind, arr: base.slice(), steps: buildSteps(kind, base), idx: 0, compares: 0, done: false })), over: false };
    resetCounters(); setNarrator(t('megaExplain'));
  }
  function megaStep(mult = 18) {
    if (!mega || mega.over) return;
    for (let k = 0; k < mult; k++) mega.lanes.forEach((l) => { const st = l.steps[l.idx++]; if (!st) { l.done = true; return; } if (st.type === 'compare') l.compares++; l.arr = st.arr.slice(); });
    if (mega.lanes.every((l) => l.done)) { mega.over = true; stopAuto(); const w = mega.lanes.slice().sort((a, b) => a.compares - b.compares)[0]; setNarrator(`${t('champ')}：${t(w.kind)} · ${t('compares')} ${w.compares}`); burst(); }
  }

  function popFx(x, y, text) { fx.push({ x, y, text, life: 1 }); }
  function burst() { for (let i = 0; i < 38; i++) fx.push({ x: W / 2, y: H * .18, vx: (Math.random() - .5) * 7, vy: -Math.random() * 6, text: ['🎉','⭐','🏅','✨'][i % 4], life: 1.3 }); }
  function step(dt) {
    penguins.forEach((p) => { p.x += (p.tx - p.x) * Math.min(1, dt * 10); });
    fx.forEach((f) => { f.life -= dt; f.x += f.vx || 0; f.y += f.vy || -28 * dt; if (f.vy) f.vy += 7 * dt; }); fx = fx.filter((f) => f.life > 0);
    if (auto) { autoTimer += dt; const delay = Math.max(.04, .62 - Number(ui.speed.value) * .085); if (autoTimer > delay) { autoTimer = 0; if (mode === 'coach') coachStep(); else if (mode === 'race') raceStep(Number(ui.speed.value)); else if (mode === 'mega') megaStep(Number(ui.speed.value) * 12); } }
  }
  function resize() { dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1)); const r = canvas.getBoundingClientRect(); W = Math.max(640, Math.floor(r.width)); H = Math.max(360, Math.floor(r.height)); canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); colors = Object.fromEntries(['--ink','--ink-soft','--line-strong','--card','--paper-2','--accent','--gold','--mint','--sky','--ice','--track','--track-2'].map((k) => [k, cssVar(k)])); layoutPenguins(); render(); }
  function drawPenguin(p, i) {
    const scale = .62 + (p.h - 90) / 180, bodyH = p.h * .92, bodyW = 42 * scale;
    ctx.save(); ctx.translate(p.x, p.y); if (p.glow) { ctx.fillStyle = colors['--gold']; ctx.beginPath(); ctx.ellipse(0, -bodyH / 2, bodyW * 1.05, bodyH * .62, 0, 0, Math.PI * 2); ctx.fill(); }
    if (p.done) { ctx.fillStyle = colors['--gold']; ctx.fillRect(-bodyW, 18, bodyW * 2, 9); }
    ctx.lineWidth = 3; ctx.strokeStyle = colors['--line-strong']; ctx.fillStyle = colors['--ink']; ctx.beginPath(); ctx.ellipse(0, -bodyH / 2, bodyW, bodyH / 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = colors['--card']; ctx.beginPath(); ctx.ellipse(0, -bodyH / 2 + 10, bodyW * .58, bodyH * .35, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = [colors['--accent'], colors['--mint'], colors['--gold'], colors['--sky'], colors['--paper-2']][p.scarfIndex % 5]; ctx.fillRect(-bodyW * .75, -bodyH / 2 - 6, bodyW * 1.5, 12); ctx.strokeRect(-bodyW * .75, -bodyH / 2 - 6, bodyW * 1.5, 12);
    ctx.fillStyle = colors['--gold']; ctx.beginPath(); ctx.moveTo(0, -bodyH + 18); ctx.lineTo(13, -bodyH + 25); ctx.lineTo(0, -bodyH + 31); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = colors['--line-strong']; ctx.beginPath(); ctx.arc(-9, -bodyH + 15, 3, 0, 7); ctx.arc(9, -bodyH + 15, 3, 0, 7); ctx.fill();
    ctx.fillStyle = colors['--card']; ctx.strokeStyle = colors['--line-strong']; ctx.lineWidth = 2; roundRect(p.glow ? 16 : -26, -bodyH - 34, 52, 24, 8, true, true); ctx.fillStyle = colors['--ink']; ctx.font = '900 13px ui-rounded, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(`${p.h}`, p.glow ? 42 : 0, -bodyH - 17);
    ctx.fillStyle = colors['--ink-soft']; ctx.fillText(String(i + 1), 0, 28); ctx.restore();
  }
  function roundRect(x, y, w, h, r, fill, stroke) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); if (fill) ctx.fill(); if (stroke) ctx.stroke(); }
  function drawManualCoach() { ctx.fillStyle = colors['--track']; roundRect(W * .04, H * .76, W * .92, 28, 14, true, true); penguins.forEach(drawPenguin); }
  function drawRaceLike(obj) {
    const lanes = obj.lanes; ctx.font = '900 18px ui-rounded, sans-serif'; lanes.forEach((l, li) => { const y = H * (.22 + li * .25); ctx.fillStyle = li === 0 ? colors['--track'] : li === 1 ? colors['--track-2'] : colors['--paper-2']; roundRect(W * .04, y - 58, W * .92, 110, 20, true, true); ctx.fillStyle = colors['--ink']; ctx.textAlign = 'left'; ctx.fillText(`${['🫧','🔎','✍️'][li]} ${t(l.kind)}`, W * .06, y - 25); ctx.fillStyle = colors['--accent']; ctx.fillText(`${t('compares')}: ${l.compares}`, W * .06, y + 4); const arr = l.arr; const max = Math.max(...arr), min = Math.min(...arr); const bw = (W * .68) / arr.length; arr.forEach((v, i) => { const h = 18 + (v - min) / (max - min || 1) * 58; ctx.fillStyle = l.done ? colors['--gold'] : (i % 2 ? colors['--mint'] : colors['--sky']); ctx.fillRect(W * .27 + i * bw, y + 36 - h, Math.max(2, bw - 1), h); }); }); }
  function drawMega() { drawRaceLike(mega); }
  function drawBackground() { ctx.clearRect(0, 0, W, H); ctx.fillStyle = colors['--ice']; roundRect(8, 8, W - 16, H - 16, 24, true, true); ctx.globalAlpha = .35; ctx.strokeStyle = colors['--card']; for (let x = 40; x < W; x += 38) { ctx.beginPath(); ctx.moveTo(x, 22); ctx.lineTo(x - 90, H - 22); ctx.stroke(); } ctx.globalAlpha = 1; }
  function render() {
    if (!ctx || !colors['--ice']) return; updateHud(); drawBackground();
    if (mode === 'race' && race) drawRaceLike(race); else if (mode === 'mega' && mega) drawMega(); else drawManualCoach();
    fx.forEach((f) => { ctx.globalAlpha = Math.max(0, f.life); ctx.font = '900 28px ui-rounded, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = colors['--accent']; ctx.fillText(f.text, f.x, f.y); ctx.globalAlpha = 1; });
  }
  function loop(ts) { const dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts; step(dt); render(); requestAnimationFrame(loop); }
  function stopAuto() { auto = false; updateControls(); }
  canvas.addEventListener('pointerdown', (e) => { if (mode !== 'manual' || pendingPair) return; const r = canvas.getBoundingClientRect(); const i = pickAt((e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height); if (i < 0) return; selected.push(i); if (selected.length > 2) selected = [i]; penguins.forEach((p, k) => p.glow = selected.includes(k)); if (selected.length === 2) comparePair(selected[0], selected[1]); });
  ui.swapBtn.addEventListener('click', () => manualDecision(true)); ui.noSwapBtn.addEventListener('click', () => manualDecision(false)); ui.stepBtn.addEventListener('click', coachStep);
  ui.autoBtn.addEventListener('click', () => { if (mode === 'race' && (!race || race.over)) setupRace(); if (mode === 'mega' && (!mega || mega.over)) setupMega(); auto = !auto; updateControls(); });
  ui.newBtn.addEventListener('click', () => { newRound(); setNarrator(t('reset')); }); ui.modalBtn.addEventListener('click', () => { ui.modal.hidden = true; newRound(); });
  document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => { mode = b.dataset.mode; ui.modal.hidden = true; newRound(); }));
  ui.algo.addEventListener('change', () => { if (mode === 'coach') setupCoach(); }); ui.shape.addEventListener('change', newRound);
  addEventListener('resize', resize); addEventListener('themechange', resize);

  /* ============================ 启动 ============================ */
  applyTheme(); applyLang(); resize(); newRound(); requestAnimationFrame(loop);
})();
