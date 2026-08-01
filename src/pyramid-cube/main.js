/* ============================================================
   金属金字塔魔方 · KidsLab
   玩法胶水：双语/主题 + 状态机 + 提示/演示/小课堂
   ============================================================ */
import { createPyraminxApp } from './pyraminx3d.js';
import { createAudio } from './audio.js';
import { solvePyraminx } from './solver.js';

const I18N = {
  zh: {
    doc: '🔺 金属金字塔魔方 · KidsLab',
    back: '返回平台',
    title: '金属金字塔魔方',
    hudTime: '时间', hudMoves: '步数', hudBest: '最佳',
    panelTitle: '⚙️ 参数面板',
    labDiff: '打乱难度', labSpeed: '转动速度', labSkin: '金属配色',
    diff0: '轻松', diff1: '进阶', diff2: '大师',
    skin0: '阳极金属', skin1: '经典亮面', skin2: '霓虹',
    btnScramble: '打乱，开始挑战！', btnUndo: '撤销', btnHint: '帮我一步',
    btnSolve: '还原演示', btnReset: '复原', btnAgain: '再来一局', btnClose: '先歇会儿',
    lessonTitle: '小课堂：怎么转',
    lessonIntro: '金字塔有 4 个尖角顶点，每个顶点可以转 120°。大写转深层，小写只转尖角：',
    faceU: '上顶点', faceL: '左顶点', faceR: '右顶点', faceB: '后顶点',
    lessonTip: '💡 还原口诀：先尖角，再中心色，最后送棱块回家。四面都变成纯色就成功！',
    tipIdle: '拖零件转一层 · 拖空白转视角',
    tipScrambling: '正在打乱……看好咯 👀',
    tipPlay: '把四个面都转回纯色：蓝、红、黄、绿！',
    tipSolving: '初级公式还原中……跟着横幅一步步看 🪄',
    tipSolvedIdle: '已经复原啦，点「🎲 打乱」开始新挑战！',
    tipStuck: '卡住了？点「💡 帮我一步」，看看下一步该转哪！',
    stages: {
      tips: ['摆正尖角', '尖角只转自己，把颜色拧到和面一致'],
      centers: ['摆正中心色', '转深层，让每个顶点中心块颜色对齐'],
      edges: ['棱块回家', '把六条棱转到正确位置'],
      rewind: ['原路倒带回家', '金字塔记得来时的路，一步步倒回去'],
    },
    guide1: '按住尖角或棱块拖一拖 —— 金字塔会绕顶点转 120°！',
    guide2: '拖空白处可以转着看；滚轮缩放。',
    guide3: '点「🎲 打乱」开始，把四个面都转回纯色：蓝、红、黄、绿。',
    guideSecret: '先看金字塔的秘密（1 分钟）',
    guideGo: '我知道啦，开转！',
    btnSecret: '金字塔的秘密',
    lessonPrev: '← 上一步',
    lessonNext: '下一步 →',
    lessonDone: '明白了，去挑战！',
    secret: [
      {
        title: '🤫 它不是方的，是四面体',
        text: '金字塔魔方外形是正四面体：4 个三角形面、4 个尖角、6 条棱。还原目标很简单——每个面只剩一种颜色：蓝、红、黄、绿。',
      },
      {
        title: '📌 三种零件',
        text: '亮起来的是尖角、中心块和棱块。尖角转来转去只影响自己；真正改变局面的，是绕顶点的深层转动——它会带走中心块和三条棱。',
      },
      {
        title: '🔄 顶点才是“轴”',
        text: '立方体魔方绕面转，金字塔绕尖角顶点转，一次 120° 或 240°。拖尖角=只拧尖；拖棱或中心=拧深层。',
      },
      {
        title: '🔦 盯住一条棱',
        text: '看这条发光的棱：两张贴纸焊在一起，永远同进同退。别问“这块黄去哪了”，要问“这条黄绿棱的家在哪”。',
      },
      {
        title: '🗝️ 初级还原口诀',
        text: '三步走：① 拧好 4 个尖角 → ② 摆正 4 个中心色 → ③ 送 6 条棱回家。卡住了就点「帮我一步」，或看还原演示！',
      },
    ],
    winTitle: '太棒了，四面纯色！',
    winTitleDemo: '还原演示完成！',
    winStats: (tm, m) => `用时 ${tm} · 转了 ${m} 步`,
    winNewBest: '🏆 新纪录！',
    winWithHint: (n) => `这局用了 ${n} 次小提示，下次试试全靠自己！`,
    winDemoNote: '看懂了吗？点「再来一局」自己拧拧看！',
    nogl: '你的浏览器暂不支持 WebGL，金字塔转不起来啦，换个新浏览器试试 ✨',
    notName: { U: '上顶点', L: '左顶点', R: '右顶点', B: '后顶点' },
    notTip: '尖角',
    notDeep: '深层',
    notPrime: '（反转）',
  },
  en: {
    doc: '🔺 Metal Pyraminx · KidsLab',
    back: 'Back to platform',
    title: 'Metal Pyraminx',
    hudTime: 'Time', hudMoves: 'Moves', hudBest: 'Best',
    panelTitle: '⚙️ Control Panel',
    labDiff: 'Scramble level', labSpeed: 'Turn speed', labSkin: 'Metal finish',
    diff0: 'Easy', diff1: 'Medium', diff2: 'Master',
    skin0: 'Anodized', skin1: 'Classic gloss', skin2: 'Neon',
    btnScramble: 'Scramble & play!', btnUndo: 'Undo', btnHint: 'Help me',
    btnSolve: 'Auto-solve', btnReset: 'Reset', btnAgain: 'Play again', btnClose: 'Take a break',
    lessonTitle: 'Mini lesson: turns',
    lessonIntro: 'A Pyraminx has 4 tips. Each turns by 120°. Uppercase = deep layer, lowercase = tip only:',
    faceU: 'Up tip', faceL: 'Left tip', faceR: 'Right tip', faceB: 'Back tip',
    lessonTip: '💡 Solver tip: tips first, then centers, then edges home. Four solid faces = win!',
    tipIdle: 'Drag a piece to twist · drag space to orbit',
    tipScrambling: 'Scrambling… watch closely 👀',
    tipPlay: 'Make four solid faces: blue, red, yellow, green!',
    tipSolving: 'Solving with beginner steps — follow the banner 🪄',
    tipSolvedIdle: 'Solved! Hit 🎲 Scramble for a new challenge!',
    tipStuck: 'Stuck? Tap "💡 Help me" to see the next turn!',
    stages: {
      tips: ['Orient the tips', 'Tips only twist themselves — line up the colors'],
      centers: ['Orient the centers', 'Deep turns align each axial center'],
      edges: ['Edges go home', 'Seat all six edges in the right places'],
      rewind: ['Rewind back home', 'The pyramid retraces its path, step by step'],
    },
    guide1: 'Drag a tip or edge — the pyramid turns 120° around a vertex!',
    guide2: 'Drag empty space to orbit; scroll to zoom.',
    guide3: 'Tap "🎲 Scramble" and restore four solid faces: blue, red, yellow, green.',
    guideSecret: 'See the pyramid secret first (1 min)',
    guideGo: 'Got it, let\u2019s spin!',
    btnSecret: 'The secret',
    lessonPrev: '← Back',
    lessonNext: 'Next →',
    lessonDone: 'Got it — let\u2019s play!',
    secret: [
      {
        title: '🤫 Not a cube — a tetrahedron',
        text: 'A Pyraminx is a regular tetrahedron: 4 triangular faces, 4 tips, 6 edges. Goal: each face one color — blue, red, yellow, green.',
      },
      {
        title: '📌 Three piece types',
        text: 'Tips, centers, and edges. Tip twists only move themselves. Deep turns around a vertex move the center and three edges — that\u2019s the real game.',
      },
      {
        title: '🔄 Vertices are the axes',
        text: 'A cube turns around faces; a Pyraminx turns around tips, 120° or 240°. Drag a tip = tip only; drag an edge/center = deep layer.',
      },
      {
        title: '🔦 Track one edge',
        text: 'Watch the glowing edge: two stickers welded together. Don\u2019t ask where a color went — ask where this yellow-green edge belongs.',
      },
      {
        title: '🗝️ Beginner method',
        text: 'Three steps: ① orient 4 tips → ② orient 4 centers → ③ send 6 edges home. Stuck? Use Help me or Auto-solve!',
      },
    ],
    winTitle: 'Awesome — four solid faces!',
    winTitleDemo: 'Auto-solve complete!',
    winStats: (tm, m) => `${tm} · ${m} moves`,
    winNewBest: '🏆 New record!',
    winWithHint: (n) => `You used ${n} hint${n > 1 ? 's' : ''} — try a solo run next time!`,
    winDemoNote: 'Got it? Hit Play again and try yourself!',
    nogl: 'WebGL isn\u2019t available here — try a newer browser ✨',
    notName: { U: 'Up tip', L: 'Left tip', R: 'Right tip', B: 'Back tip' },
    notTip: 'tip',
    notDeep: 'deep',
    notPrime: ' (prime)',
  },
};

const LS = {
  best: 'kidslab.pyramid-cube.best', guided: 'kidslab.pyramid-cube.guided', mute: 'kidslab.pyramid-cube.mute',
};
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

const preferences = window.cool?.preferences;
let lang = preferences?.lang || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
if (!I18N[lang]) lang = 'zh';
let theme = preferences?.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
if (theme !== 'light' && theme !== 'dark') theme = 'light';

const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const $ = (id) => document.getElementById(id);
const langBtn = $('langBtn'); const themeBtn = $('themeBtn'); const soundBtn = $('soundBtn');

let render = () => {};

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
  render();
  dispatchEvent(new CustomEvent('themechange'));
}
langBtn?.addEventListener('click', () => preferences?.toggleLang());
themeBtn?.addEventListener('click', () => preferences?.toggleTheme());
preferences?.subscribe(({ kind }) => {
  lang = preferences.lang;
  theme = preferences.theme;
  if (kind === 'lang') applyLang();
  if (kind === 'theme') applyTheme();
});

const audio = createAudio();
if (store.get(LS.mute) === '1') {
  audio.setMuted(true);
  if (soundBtn) {
    soundBtn.textContent = '🔇';
    soundBtn.setAttribute('aria-pressed', 'true');
  }
}

let onUserTwistRef = () => {};
const cube = createPyraminxApp({
  canvas: $('scene'),
  cssVar,
  onUserTwist: (mv) => onUserTwistRef(mv),
  onFirstInteract: () => audio.ensure(),
});

if (!cube) {
  $('nogl').hidden = false;
  $('panel').hidden = true;
  $('hud').hidden = true;
  $('footTip').hidden = true;
  applyTheme();
  applyLang();
} else {
  boot();
}

function boot() {
  const S = {
    diff: 0, speed: 1, skin: 'mirror',
    phase: 'idle',
    gen: 0,
    history: [],
    userStack: [],
    moves: 0, hints: 0,
    startAt: 0, elapsed: 0,
    lastMoveAt: 0, stuckShown: false,
  };
  /* 三档难度：打乱步数 */
  const SCRAMBLE = [4, 9, 18];
  const baseDur = () => 0.32 / S.speed;

  const timeVal = $('timeVal'); const moveVal = $('moveVal'); const bestVal = $('bestVal');
  const footTip = $('footTip');
  const notation = $('notation'); const notationMove = $('notationMove'); const notationName = $('notationName');
  const btns = {
    scramble: $('scrambleBtn'), undo: $('undoBtn'), hint: $('hintBtn'),
    solve: $('solveBtn'), reset: $('resetBtn'),
  };

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const bestKey = () => String(S.diff);
  const bests = (() => { try { return JSON.parse(store.get(LS.best) || '{}') || {}; } catch { return {}; } })();

  let notationTimer = 0;
  function showNotation(mv) {
    const info = cube.notation(mv);
    notationMove.textContent = info.text;
    const nm = t('notName')[info.face] || '';
    notationName.textContent = `${info.tip ? t('notTip') : t('notDeep')} · ${nm}${info.text.includes('′') ? t('notPrime') : ''}`;
    notation.hidden = false;
    notation.classList.remove('pop');
    void notation.offsetWidth;
    notation.classList.add('pop');
    clearTimeout(notationTimer);
    notationTimer = setTimeout(() => { notation.hidden = true; }, 1600);
  }

  function setTip(key) { footTip.dataset.t = key; footTip.textContent = t(key); }
  function setPhase(p) {
    S.phase = p;
    cube.setLocked(p === 'scrambling' || p === 'solving' || p === 'lesson');
    render();
  }
  function markMoved() { S.lastMoveAt = performance.now(); S.stuckShown = false; }

  const stageBanner = $('stageBanner');
  let stageTimer = 0; let curStage = '';
  function stageShow(key, order, sticky = false) {
    const info = t('stages')[key];
    if (!info) return;
    if (curStage !== key) {
      curStage = key;
      stageBanner.classList.remove('pop');
      void stageBanner.offsetWidth;
      stageBanner.classList.add('pop');
      audio.click(1.4);
    }
    $('stageBadge').textContent = order ? `${order.indexOf(key) + 1}/${order.length}` : '💡';
    $('stageName').textContent = info[0];
    $('stageFormula').textContent = info[1];
    stageBanner.hidden = false;
    clearTimeout(stageTimer);
    if (!sticky) stageTimer = setTimeout(stageHide, 2600);
  }
  function stageHide() { clearTimeout(stageTimer); stageBanner.hidden = true; curStage = ''; }

  function pushHistory(mv) {
    const last = S.history[S.history.length - 1];
    if (last && last.vertex === mv.vertex && last.layer === mv.layer) {
      const merged = (last.turns + mv.turns) % 3;
      if (merged === 0) S.history.pop();
      else last.turns = merged;
    } else {
      S.history.push({ vertex: mv.vertex, layer: mv.layer, turns: mv.turns });
    }
  }

  onUserTwistRef = (mv) => {
    audio.click(0.9 + Math.random() * 0.25);
    invalidateHint();
    pushHistory(mv);
    showNotation(mv);
    markMoved();
    window.cool?.track?.('twist');
    if (S.phase === 'playing') {
      if (!S.startAt) S.startAt = performance.now();
      S.userStack.push(mv);
      S.moves += 1;
      if (cube.isSolved()) { onWin(false); return; }
    } else if (S.phase === 'idle') {
      S.userStack.push(mv);
      if (cube.isSolved()) { S.history = []; S.userStack = []; }
    }
    render();
  };

  async function scramble() {
    if (cube.isBusy() || S.phase === 'scrambling' || S.phase === 'solving') return;
    audio.ensure();
    cube.setIdleSpin(false);
    cube.build();
    cube.setSkin(S.skin);
    stageHide();
    invalidateHint();
    const gen = ++S.gen;
    S.history = []; S.userStack = [];
    S.moves = 0; S.hints = 0; S.startAt = 0; S.elapsed = 0;
    setPhase('scrambling');
    setTip('tipScrambling');
    window.cool?.stage?.(`diff${S.diff}`);
    const useTips = S.diff > 0;
    for (const mv of cube.randomScramble(SCRAMBLE[S.diff], { tips: useTips })) {
      pushHistory(mv);
      await cube.animateMove(mv, 0.09);
      if (S.gen !== gen) return;
      audio.whoosh();
    }
    S.startAt = 0;
    markMoved();
    setPhase('playing');
    setTip('tipPlay');
  }

  async function undo() {
    if (cube.isBusy() || !S.userStack.length || (S.phase !== 'playing' && S.phase !== 'idle')) return;
    invalidateHint();
    const gen = S.gen;
    const mv = S.userStack.pop();
    const inv = cube.invert(mv);
    render();
    await cube.animateMove(inv, baseDur());
    if (S.gen !== gen) return;
    audio.click(0.75);
    pushHistory(inv);
    if (S.phase === 'playing') S.moves = Math.max(0, S.moves - 1);
    markMoved();
    if (cube.isSolved()) {
      if (S.phase === 'playing') { onWin(false); return; }
      S.history = []; S.userStack = [];
    }
    render();
  }

  let hinting = false;
  let hintPlan = null;
  const stateSig = () => JSON.stringify(cube.getState());
  const invalidateHint = () => { hintPlan = null; };

  async function hint() {
    if (hinting || cube.isBusy() || S.phase !== 'playing' || !S.history.length) return;
    const gen = S.gen;
    let step; let stageKey;
    if (!hintPlan || hintPlan.idx >= hintPlan.steps.length || hintPlan.nextSig !== stateSig()) {
      let sol = solvePyraminx(cube.getState());
      if (!sol || !sol.length) {
        /* 倒带兜底 */
        sol = S.history.slice().reverse().map((mv) => ({ ...cube.invert(mv), stage: 'rewind' }));
      }
      if (!sol.length) return;
      hintPlan = { steps: sol, idx: 0, nextSig: stateSig() };
    }
    step = hintPlan.steps[hintPlan.idx];
    stageKey = step.stage || 'rewind';
    hinting = true;
    cube.setLocked(true);
    S.hints += 1;
    S.moves += 1;
    if (!S.startAt) S.startAt = performance.now();
    S.userStack = [];
    render();
    try {
      stageShow(stageKey);
      const turnDur = baseDur() * 1.45;
      cube.flashMove(step, 0.55 + turnDur + 0.55);
      audio.click(1.3);
      await sleep(550);
      if (S.gen !== gen || S.phase !== 'playing') return;
      showNotation(step);
      await cube.animateMove(step, turnDur);
      if (S.gen !== gen) return;
      audio.click(1.15);
      pushHistory(step);
      hintPlan.idx += 1;
      hintPlan.nextSig = stateSig();
      markMoved();
      window.cool?.track?.('hint');
      if (cube.isSolved()) { onWin(false); return; }
    } finally {
      hinting = false;
      setPhase(S.phase);
    }
  }

  async function autoSolve() {
    if (cube.isBusy() || !S.history.length || S.phase === 'scrambling' || S.phase === 'solving') return;
    const gen = S.gen;
    invalidateHint();
    setPhase('solving');
    S.userStack = [];
    setTip('tipSolving');
    let sol = solvePyraminx(cube.getState());
    if (!sol || !sol.length) {
      sol = S.history.slice().reverse().map((mv) => ({ ...cube.invert(mv), stage: 'rewind' }));
    }
    const order = [...new Set(sol.map((s) => s.stage || 'rewind'))];
    for (const step of sol) {
      if (S.phase !== 'solving') break;
      stageShow(step.stage || 'rewind', order, true);
      showNotation(step);
      await cube.animateMove(step, Math.max(0.14, baseDur() * 0.75));
      if (S.gen !== gen) { stageHide(); return; }
      audio.whoosh();
      pushHistory(step);
    }
    stageHide();
    if (S.phase === 'solving') onWin(true);
  }

  function reset() {
    cube.build();
    cube.setSkin(S.skin);
    S.gen += 1;
    stageHide();
    invalidateHint();
    S.history = []; S.userStack = [];
    S.moves = 0; S.hints = 0; S.startAt = 0; S.elapsed = 0;
    $('win').hidden = true;
    setPhase('idle');
    setTip('tipSolvedIdle');
  }

  function onWin(isDemo) {
    S.elapsed = S.startAt ? (performance.now() - S.startAt) / 1000 : 0;
    S.history = []; S.userStack = [];
    stageHide();
    setPhase('idle');
    $('winEmoji').textContent = isDemo ? '🪄' : '🎉';
    $('winTitle').textContent = isDemo ? t('winTitleDemo') : t('winTitle');
    if (isDemo) {
      $('winStats').textContent = '';
      $('winNote').textContent = t('winDemoNote');
    } else {
      cube.celebrate();
      audio.win();
      window.cool?.complete?.();
      window.cool?.track?.('solve');
      $('winStats').textContent = t('winStats')(fmtTime(S.elapsed), S.moves);
      let note = '';
      if (S.hints > 0) note = t('winWithHint')(S.hints);
      else {
        const k = bestKey();
        if (!bests[k] || S.elapsed < bests[k]) {
          bests[k] = Math.round(S.elapsed * 10) / 10;
          store.set(LS.best, JSON.stringify(bests));
          note = t('winNewBest');
        }
      }
      $('winNote').textContent = note;
    }
    setTip('tipSolvedIdle');
    setTimeout(() => { $('win').hidden = false; }, isDemo ? 250 : 850);
    render();
  }

  /* 秘密课 */
  const lesson3d = $('lesson3d');
  let lessonOn = false; let lessonStep = 0; let lessonGen = 0;
  const demoHist = [];
  const LESSON_SCENES = [
    { explode: 0.9, spin: true },
    { explode: 0.45, focus: 'tip', spin: true },
    { explode: 0, demo: 'deepTurns' },
    { explode: 0, track: 'edge', demo: 'deepTurns' },
    { explode: 0, track: 'edge', spin: true, demo: 'home' },
  ];

  function lessonRender() {
    const steps = t('secret');
    const st = steps[lessonStep];
    $('lessonStepBadge').textContent = `${lessonStep + 1}/${steps.length}`;
    $('lessonTitle3d').textContent = st.title;
    $('lessonText3d').textContent = st.text;
    $('lessonPrevBtn').disabled = lessonStep === 0;
    $('lessonNextBtn').textContent = lessonStep === steps.length - 1 ? t('lessonDone') : t('lessonNext');
  }

  async function enterStep(i) {
    lessonStep = i;
    const gen = ++lessonGen;
    lessonRender();
    while (cube.isBusy()) { await sleep(50); if (lessonGen !== gen) return; }
    const sc = LESSON_SCENES[i];
    cube.setTracked(false);
    cube.setFocus(sc.focus || null);
    cube.setExplode(sc.explode || 0);
    cube.setIdleSpin(!!sc.spin);

    if (sc.demo === 'deepTurns') {
      if (sc.track) cube.setTracked(true, 'edge');
      await sleep(600);
      if (lessonGen !== gen) return;
      const seq = [
        { vertex: 0, layer: 1, turns: 1 },
        { vertex: 1, layer: 1, turns: 1 },
        { vertex: 0, layer: 1, turns: 2 },
        { vertex: 1, layer: 1, turns: 2 },
        { vertex: 2, layer: 1, turns: 1 },
        { vertex: 3, layer: 0, turns: 1 },
        { vertex: 2, layer: 1, turns: 2 },
        { vertex: 3, layer: 0, turns: 2 },
      ];
      let k = 0;
      while (lessonGen === gen && k < 16) {
        const mv = seq[k % seq.length]; k += 1;
        demoHist.push(mv);
        audio.whoosh();
        await cube.animateMove(mv, 0.48);
        if (lessonGen !== gen) return;
        await sleep(380);
      }
    } else if (sc.demo === 'home') {
      if (sc.track) cube.setTracked(true, 'edge');
      while (demoHist.length) {
        const mv = demoHist.pop();
        await cube.animateMove(cube.invert(mv), 0.16);
        if (lessonGen !== gen) return;
      }
    } else if (sc.track) {
      cube.setTracked(true, sc.track);
    }
  }

  async function startLesson() {
    if (lessonOn) return;
    guide.hidden = true;
    store.set(LS.guided, '1');
    audio.ensure();
    ++lessonGen;
    S.gen += 1;
    while (cube.isBusy()) await sleep(50);
    cube.build();
    cube.setSkin(S.skin);
    S.history = []; S.userStack = [];
    S.moves = 0; S.hints = 0; S.startAt = 0; S.elapsed = 0;
    demoHist.length = 0;
    $('win').hidden = true;
    stageHide();
    lessonOn = true;
    document.body.classList.add('lesson-mode');
    cube.setLessonView(true);
    setPhase('lesson');
    lesson3d.hidden = false;
    enterStep(0);
  }

  async function exitLesson() {
    if (!lessonOn) return;
    ++lessonGen;
    lessonOn = false;
    lesson3d.hidden = true;
    document.body.classList.remove('lesson-mode');
    cube.setLessonView(false);
    while (cube.isBusy()) await sleep(50);
    reset();
    cube.setIdleSpin(false);
    setTip('tipIdle');
  }

  $('guideSecretBtn').addEventListener('click', startLesson);
  $('secretBtn').addEventListener('click', startLesson);
  $('lessonExitBtn').addEventListener('click', exitLesson);
  $('lessonPrevBtn').addEventListener('click', () => { if (lessonStep > 0) enterStep(lessonStep - 1); });
  $('lessonNextBtn').addEventListener('click', () => {
    if (lessonStep < t('secret').length - 1) enterStep(lessonStep + 1);
    else exitLesson();
  });

  function segWire(segId, attr, cb) {
    $(segId).addEventListener('click', (e) => {
      const b = e.target.closest('.seg__btn');
      if (!b || b.classList.contains('is-on')) return;
      [...$(segId).querySelectorAll('.seg__btn')].forEach((x) => x.classList.toggle('is-on', x === b));
      cb(b.dataset[attr]);
    });
  }
  segWire('diffSeg', 'diff', (v) => { S.diff = +v; render(); });
  segWire('skinSeg', 'skin', (v) => { S.skin = v; cube.setSkin(v); });
  $('speedRange').addEventListener('input', (e) => {
    S.speed = +e.target.value;
    $('speedVal').textContent = `${S.speed}×`;
  });

  btns.scramble.addEventListener('click', scramble);
  btns.undo.addEventListener('click', undo);
  btns.hint.addEventListener('click', hint);
  btns.solve.addEventListener('click', autoSolve);
  btns.reset.addEventListener('click', reset);
  $('winAgainBtn').addEventListener('click', () => { $('win').hidden = true; scramble(); });
  $('winCloseBtn').addEventListener('click', () => { $('win').hidden = true; });

  const panelBody = $('panelBody'); const panelHandle = $('panelHandle'); const panelArrow = $('panelArrow');
  let panelOpen = matchMedia('(min-width: 761px)').matches;
  function applyPanel() {
    panelBody.hidden = !panelOpen;
    panelArrow.textContent = panelOpen ? '▾' : '▸';
    panelHandle.setAttribute('aria-expanded', String(panelOpen));
  }
  panelHandle.addEventListener('click', () => { panelOpen = !panelOpen; applyPanel(); });
  applyPanel();

  const lessonBody = $('lessonBody'); const lessonArrow = $('lessonArrow');
  $('lessonBtn').addEventListener('click', () => {
    lessonBody.hidden = !lessonBody.hidden;
    lessonArrow.textContent = lessonBody.hidden ? '▸' : '▾';
  });

  soundBtn.addEventListener('click', () => {
    audio.setMuted(!audio.muted);
    soundBtn.textContent = audio.muted ? '🔇' : '🔊';
    soundBtn.setAttribute('aria-pressed', audio.muted ? 'true' : 'false');
    store.set(LS.mute, audio.muted ? '1' : '0');
  });

  const guide = $('guide');
  if (!store.get(LS.guided)) guide.hidden = false;
  $('guideBtn').addEventListener('click', () => {
    guide.hidden = true;
    store.set(LS.guided, '1');
    audio.ensure();
  });

  setInterval(() => {
    if (S.phase === 'playing' && S.startAt) {
      timeVal.textContent = fmtTime((performance.now() - S.startAt) / 1000);
      if (!S.stuckShown && performance.now() - S.lastMoveAt > 30000) {
        S.stuckShown = true;
        setTip('tipStuck');
      }
    }
  }, 250);

  render = () => {
    moveVal.textContent = String(S.moves);
    if (S.phase !== 'playing' || !S.startAt) timeVal.textContent = fmtTime(S.elapsed);
    const b = bests[bestKey()];
    bestVal.textContent = b ? fmtTime(b) : '--';
    const busy = S.phase === 'scrambling' || S.phase === 'solving' || S.phase === 'lesson' || hinting;
    btns.scramble.disabled = busy;
    btns.reset.disabled = busy;
    btns.undo.disabled = busy || !S.userStack.length;
    btns.hint.disabled = busy || S.phase !== 'playing' || !S.history.length;
    btns.solve.disabled = busy || !S.history.length;
    footTip.textContent = t(footTip.dataset.t || 'tipIdle');
    if (!stageBanner.hidden && curStage) {
      const info = t('stages')[curStage];
      if (info) { $('stageName').textContent = info[0]; $('stageFormula').textContent = info[1]; }
    }
    if (lessonOn) lessonRender();
    soundBtn.setAttribute('aria-label', lang === 'zh' ? (audio.muted ? '打开声音' : '静音') : (audio.muted ? 'Unmute' : 'Mute'));
  };

  addEventListener('themechange', () => cube.refreshTheme());

  applyTheme();
  applyLang();
  cube.setSkin(S.skin);
  setTip('tipIdle');
  render();
}
