/* ============================================================
   魔方小达人 · KidsLab
   —— 玩法胶水层：双语/主题（平台约定）+ 游戏状态机 + 参数面板
   ============================================================ */
import { createCubeApp } from './cube3d.js';
import { createAudio } from './audio.js';
import { solveLBL } from './solver.js';

/* ================= 语言 & 主题 · Language & Theme ================= */
const I18N = {
  zh: {
    doc: '🧊 魔方小达人 · KidsLab',
    back: '返回平台',
    title: '魔方小达人',
    hudTime: '时间', hudMoves: '步数', hudBest: '最佳',
    panelTitle: '⚙️ 参数面板',
    labSize: '魔方阶数', labDiff: '打乱难度', labSpeed: '转动速度', labSkin: '贴纸配色',
    diff0: '轻松', diff1: '进阶', diff2: '大师',
    skin0: '经典', skin1: '马卡龙', skin2: '霓虹',
    btnScramble: '打乱，开始挑战！', btnUndo: '撤销', btnHint: '帮我一步',
    btnSolve: '还原演示', btnReset: '复原', btnAgain: '再来一局', btnClose: '先歇会儿',
    lessonTitle: '小课堂：转动记号',
    lessonIntro: '魔方的每个面都有自己的字母名字，字母后面加 ′ 表示反着转：',
    faceU: '上层', faceD: '下层', faceL: '左层', faceR: '右层', faceF: '前层', faceB: '后层',
    lessonTip: '💡 还原小妙招：别盯着颜色！盯住一个「零件」，看它该回哪个家。',
    tipIdle: '拖方块转一层 · 拖空白转视角',
    tipScrambling: '正在打乱……看好咯 👀',
    tipPlay: '把每个面都转回同一种颜色！',
    tipSolving: '公式还原中……跟着横幅认公式 🪄',
    tipSolving4: '4×4 步数太多，先看它原路倒带回家；想学公式从 3×3 开始！',
    tipSolvedIdle: '魔方已经复原，点「🎲 打乱」开始新挑战！',
    tipStuck: '卡住了？点「💡 帮我一步」，看看现在该用哪个公式！',
    stages: {
      orient: ['摆正中心门牌', '转转中间层：白心朝上、黄心朝下'],
      cross: ['拼白色十字', '送白棱回家：白朝上，侧色对准门牌'],
      corners: ['装白色角', '右手公式 (R′ D′ R D) 重复几次就归位'],
      middle: ['中层棱回家', '对齐颜色再左插 / 右插'],
      yellowCross: ['底面拼黄十字', '公式：B R D R′ D′ B′'],
      yellowFace: ['小鱼公式翻黄面', '公式：R D R′ D R D2 R′'],
      permCorners: ['角块排座位', 'A 公式让三个角轮流换位'],
      permEdges: ['棱块排座位', '最后一步！棱块轮换到位'],
      firstFace: ['装好白色面', '选定锚角不动，右手公式装其余角'],
      rewind: ['原路倒带回家', '魔方记得来时的路，看它一步步倒回去'],
    },
    guide1: '按住魔方上的小方块，往上下左右拖 —— 就能转动一层！',
    guide2: '按住旁边的空白处拖动，可以绕着魔方看一圈。',
    guide3: '点「🎲 打乱」开始挑战，把每个面都转回同一种颜色！',
    guideSecret: '先看魔方的秘密（1 分钟）',
    guideGo: '我知道啦，开转！',
    btnSecret: '魔方的秘密',
    lessonPrev: '← 上一步',
    lessonNext: '下一步 →',
    lessonDone: '明白了，去挑战！',
    secret: {
      2: [
        {
          title: '🤫 拆开 2×2：只有 8 个角',
          text: '2×2 魔方拆开一看——只有 8 个角块，没有中心块，也没有棱块！每个角块焊着 3 张贴纸。零件这么少，秘密却一点不少。',
        },
        {
          title: '⚓ 没有门牌，就自己选一个锚',
          text: '3×3 靠中心块当门牌，2×2 没有！怎么办？把金色这个角当「锚」，就当它永远不动——你看，转来转去动的都是别人，其实是另外 7 个角在围着它找位置。',
        },
        {
          title: '🔦 盯住一个角看看',
          text: '现在追踪这个发光的金角：它的 3 张贴纸焊死在一起，永远同进同退。所以别问「这块黄色去哪了」，要问「这个白红蓝角块在哪」——零件不会散架，只会换座位。',
        },
        {
          title: '🗝️ 2×2 的还原思维',
          text: '只有两步大棋：① 挑一个颜色，把 4 个带它的角块凑成一个完整面；② 翻过来，把剩下 4 个角转到各自正确的位置。全程盯零件、认贴纸组合，颜色自然就齐了！',
        },
      ],
      3: [
        {
          title: '🤫 魔方的秘密，藏在里面',
          text: '大家都以为魔方是「拼颜色」的游戏——其实颜色是用来迷惑你的！我们把它拆开看看：3×3 魔方不是 27 个小方块，而是 26 个卡在一起的零件。',
        },
        {
          title: '📌 第一种零件：中心块',
          text: '亮着的这 6 个是中心块，每个只有 1 张贴纸。它们被轴心串着，永远不会搬家——白心永远对着黄心。中心块就是每个面的「门牌」：它是什么颜色，这面最后就是什么颜色。',
        },
        {
          title: '🧩 另外两种零件：棱块和角块',
          text: '2 张贴纸的叫棱块（12 个），3 张贴纸的叫角块（8 个）。记住关键一条：零件上的贴纸是焊死的，永远不会分开！你以为在移动颜色，其实是在搬运整个零件。',
        },
        {
          title: '🔦 盯住一个零件看看',
          text: '看这个发光的棱块——我转几下，你盯紧它。它的两张贴纸始终背靠背，一起旅行。所以魔方转来转去，零件永远不会「散架」，只是换了个座位。',
        },
        {
          title: '🗝️ 真正的解法思维',
          text: '所以别问「白色怎么拼到一起」，要问「这个白红棱块的家在哪」——它的家就在白心和红心中间！先送棱块回家，再送角块回家，一层一层，魔方自己就还原了。现在去试试吧！',
        },
      ],
      4: [
        {
          title: '🤫 拆开 4×4：整整 56 个零件',
          text: '4×4 拆开吓一跳：24 个中心块 + 24 个棱块 + 8 个角块，一共 56 个零件！而且它藏着一个 3×3 没有的大秘密……',
        },
        {
          title: '😱 大秘密：中心块会跑！',
          text: '看好这些发光的中心块——4×4 多了「内层」，内层一转，中心块就搬家了！门牌自己会跑，这就是 4×4 最捣蛋的地方：你连「哪面该是什么颜色」都得自己做主。',
        },
        {
          title: '🧱 第一步：自己拼门牌',
          text: '所以 4×4 的第一个任务，是把每 4 个同色中心块凑成一个 2×2 的「大门牌」。注意颜色方位要按老规矩：白对黄、红对橙、绿对蓝，别把门牌挂错墙！',
        },
        {
          title: '🤝 第二步：棱块手拉手',
          text: '亮着的棱块两两一对：把两条颜色相同的棱块转到一起「手拉手」，合并成一条大棱。24 条小棱变成 12 条大棱之后——4×4 就变身成一个大号 3×3 啦！',
        },
        {
          title: '🗝️ 4×4 的还原思维',
          text: '记住三步曲：① 拼中心（自己挂门牌）→ ② 并棱块（手拉手）→ ③ 按 3×3 的办法收尾。零件更多，道理不变：盯住零件找它的家，颜色只是零件的衣服！',
        },
      ],
    },
    winTitle: '太棒了，还原成功！',
    winTitleDemo: '还原演示完成！',
    winStats: (tm, m) => `用时 ${tm} · 转了 ${m} 步`,
    winNewBest: '🏆 新纪录！',
    winWithHint: (n) => `这局用了 ${n} 次小提示，下次试试全靠自己！`,
    winDemoNote: '看懂了吗？点「再来一局」自己试试！',
    nogl: '你的浏览器暂不支持 WebGL，魔方转不起来啦，换个新浏览器试试 ✨',
    notName: { U: '上层', D: '下层', L: '左层', R: '右层', F: '前层', B: '后层', M: '中层', E: '中层', S: '中层' },
    notInner: '第二层',
    notPrime: '（反转）',
  },
  en: {
    doc: '🧊 Cube Master · KidsLab',
    back: 'Back to platform',
    title: 'Cube Master',
    hudTime: 'Time', hudMoves: 'Moves', hudBest: 'Best',
    panelTitle: '⚙️ Control Panel',
    labSize: 'Cube size', labDiff: 'Scramble level', labSpeed: 'Turn speed', labSkin: 'Sticker colors',
    diff0: 'Easy', diff1: 'Medium', diff2: 'Master',
    skin0: 'Classic', skin1: 'Macaron', skin2: 'Neon',
    btnScramble: 'Scramble & play!', btnUndo: 'Undo', btnHint: 'Help me',
    btnSolve: 'Auto-solve', btnReset: 'Reset', btnAgain: 'Play again', btnClose: 'Take a break',
    lessonTitle: 'Mini lesson: move notation',
    lessonIntro: 'Each face has a letter name. Add ′ to turn it the other way:',
    faceU: 'Up', faceD: 'Down', faceL: 'Left', faceR: 'Right', faceF: 'Front', faceB: 'Back',
    lessonTip: '💡 Solver tip: don\u2019t chase colors! Track one piece and figure out where its home is.',
    tipIdle: 'Drag a cubie to twist · drag space to orbit',
    tipScrambling: 'Scrambling… watch closely 👀',
    tipPlay: 'Make every face one single color!',
    tipSolving: 'Solving with real formulas — follow the banner 🪄',
    tipSolving4: 'A 4×4 takes too many moves — watch it rewind home; learn the formulas on 3×3 first!',
    tipSolvedIdle: 'The cube is solved — hit 🎲 Scramble for a new challenge!',
    tipStuck: 'Stuck? Tap "💡 Help me" to see which formula comes next!',
    stages: {
      orient: ['Set the name tags', 'Turn middle layers: white up, yellow down'],
      cross: ['Build the white cross', 'Send white edges home, side colors matching'],
      corners: ['Insert white corners', 'Righty formula (R′ D′ R D), repeat till seated'],
      middle: ['Middle edges home', 'Line up the color, then insert left / right'],
      yellowCross: ['Yellow cross on bottom', 'Formula: B R D R′ D′ B′'],
      yellowFace: ['Fish formula for yellow', 'Formula: R D R′ D R D2 R′'],
      permCorners: ['Seat the corners', 'A-perm cycles three corners'],
      permEdges: ['Seat the edges', 'Last step! Cycle the edges home'],
      firstFace: ['Build the white face', 'Anchor one corner, righty-insert the rest'],
      rewind: ['Rewind back home', 'The cube retraces its own path, step by step'],
    },
    guide1: 'Press a cubie and drag up/down/left/right — that twists a layer!',
    guide2: 'Drag the empty space around the cube to orbit and look around.',
    guide3: 'Tap "🎲 Scramble" to start — turn every face back to one color!',
    guideSecret: 'See the cube\u2019s secret first (1 min)',
    guideGo: 'Got it, let\u2019s spin!',
    btnSecret: 'The secret',
    lessonPrev: '← Back',
    lessonNext: 'Next →',
    lessonDone: 'Got it — let\u2019s play!',
    secret: {
      2: [
        {
          title: '🤫 Inside a 2×2: just 8 corners',
          text: 'Pull a 2×2 apart and surprise — only 8 corner pieces! No centers, no edges. Each corner has 3 stickers welded on. Fewer pieces, but the secret is just as big.',
        },
        {
          title: '⚓ No name tags? Pick an anchor!',
          text: 'A 3×3 uses centers as name tags — a 2×2 has none! The trick: treat this golden corner as your anchor and pretend it never moves. See? Every turn, it\u2019s really the other 7 corners finding their seats around it.',
        },
        {
          title: '🔦 Track one corner',
          text: 'Watch the glowing golden corner: its 3 stickers are welded together and always travel as one. So don\u2019t ask "where did that yellow go" — ask "where is the white-red-blue corner?" Pieces never fall apart; they just change seats.',
        },
        {
          title: '🗝️ How to think in 2×2',
          text: 'Only two big moves: ① pick a color and gather its 4 corners into one solid face; ② flip over and steer the last 4 corners into their right seats. Track pieces, read sticker trios — the colors sort themselves out!',
        },
      ],
      3: [
        {
          title: '🤫 The secret hides inside',
          text: 'Everyone thinks a Rubik\u2019s cube is a "match-the-colors" game — but the colors are there to fool you! Let\u2019s pull it apart: a 3×3 cube isn\u2019t 27 little boxes. It\u2019s 26 pieces locked together.',
        },
        {
          title: '📌 Piece type 1: centers',
          text: 'The glowing ones are the 6 centers — just 1 sticker each. They\u2019re pinned to the core and NEVER move house: white always faces yellow. A center is the face\u2019s name tag: whatever color it is, that\u2019s what the face must become.',
        },
        {
          title: '🧩 The other two: edges & corners',
          text: 'Pieces with 2 stickers are edges (12 of them); 3 stickers make corners (8). Here\u2019s the key: the stickers on one piece are welded together — they can never split up! You think you\u2019re moving colors, but you\u2019re really moving whole pieces.',
        },
        {
          title: '🔦 Track one piece',
          text: 'Watch the glowing edge — I\u2019ll make some turns, keep your eyes on it. Its two stickers always travel back-to-back, as one. No matter how wild the turns get, pieces never fall apart — they just change seats.',
        },
        {
          title: '🗝️ How solvers really think',
          text: 'So don\u2019t ask "how do I group the white stickers" — ask "where is this white-red edge\u2019s home?" Its home is right between the white and red centers! Send edges home, then corners, layer by layer — the cube solves itself. Now go try!',
        },
      ],
      4: [
        {
          title: '🤫 Inside a 4×4: 56 pieces!',
          text: 'Open up a 4×4 and whoa: 24 centers + 24 edges + 8 corners = 56 pieces! And it hides a big secret that the 3×3 doesn\u2019t have…',
        },
        {
          title: '😱 Big secret: centers can run!',
          text: 'Watch the glowing centers — a 4×4 has inner layers, and one inner turn makes centers move house! The name tags run around by themselves. That\u2019s the 4×4\u2019s trickiest part: even "which face is which color" is up to you.',
        },
        {
          title: '🧱 Step 1: build your own name tags',
          text: 'So job one on a 4×4: gather each set of 4 same-color centers into a 2×2 "big name tag". Mind the layout rules — white opposite yellow, red opposite orange, green opposite blue. Don\u2019t hang a tag on the wrong wall!',
        },
        {
          title: '🤝 Step 2: edges hold hands',
          text: 'The glowing edges come in pairs: steer two same-color edges together so they "hold hands" and merge into one big edge. Turn 24 small edges into 12 big ones — and your 4×4 becomes a jumbo 3×3!',
        },
        {
          title: '🗝️ How to think in 4×4',
          text: 'Three-step plan: ① build centers (hang your tags) → ② pair the edges (hold hands) → ③ finish like a 3×3. More pieces, same truth: track each piece to its home — colors are just the clothes pieces wear!',
        },
      ],
    },
    winTitle: 'Awesome — cube solved!',
    winTitleDemo: 'Auto-solve complete!',
    winStats: (tm, m) => `Time ${tm} · ${m} moves`,
    winNewBest: '🏆 New record!',
    winWithHint: (n) => `You used ${n} hint${n > 1 ? 's' : ''} — try a solo run next time!`,
    winDemoNote: 'See how it works? Hit "Play again" and try it yourself!',
    nogl: 'Your browser doesn\u2019t support WebGL, so the cube can\u2019t spin. Try a newer browser ✨',
    notName: { U: 'Up', D: 'Down', L: 'Left', R: 'Right', F: 'Front', B: 'Back', M: 'Middle', E: 'Middle', S: 'Middle' },
    notInner: 'inner',
    notPrime: ' (reverse)',
  },
};

const LS = {
  lang: 'kidslab.lang', theme: 'kidslab.theme',
  best: 'kidslab.magic-cube.best', guided: 'kidslab.magic-cube.guided',
};
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* 忽略 */ } },
};

let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
if (!I18N[lang]) lang = 'zh';
let theme = store.get(LS.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
if (theme !== 'light' && theme !== 'dark') theme = 'light';

const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const $ = (id) => document.getElementById(id);
const langBtn = $('langBtn'), themeBtn = $('themeBtn'), soundBtn = $('soundBtn');

/** 语言/主题切换后统一刷新动态 UI（由游戏区实现，先占位） */
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
  dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  render();
}
langBtn?.addEventListener('click', () => { lang = lang === 'zh' ? 'en' : 'zh'; store.set(LS.lang, lang); applyLang(); });
themeBtn?.addEventListener('click', () => { theme = theme === 'light' ? 'dark' : 'light'; store.set(LS.theme, theme); applyTheme(); });

/* ======================= 游戏区 · Game ======================= */
const audio = createAudio();
let onUserTwistRef = () => {};
const cube = createCubeApp({
  canvas: $('scene'),
  cssVar,
  onUserTwist: (mv) => onUserTwistRef(mv),
  onFirstInteract: () => audio.ensure(),
});

if (!cube) {
  /* WebGL 不可用 → 降级文案 */
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
  /* ---------- 状态（数据为真，UI 是投影） ---------- */
  const S = {
    size: 3, diff: 0, speed: 1, skin: 'classic',
    phase: 'idle',            // idle | scrambling | playing | solving
    gen: 0,                   // 代际计数：每次重建+1，中止旧的异步动画循环
    history: [],              // 自复原态以来的全部转动（打乱+玩家，相邻同层自动合并抵消）
    userStack: [],            // 玩家可撤销的转动
    moves: 0, hints: 0,
    startAt: 0, elapsed: 0,
    lastMoveAt: 0, stuckShown: false,
  };
  /* 多难度：打乱步数 = 表[阶数][难度] */
  const SCRAMBLE = { 2: [3, 6, 12], 3: [4, 9, 20], 4: [6, 14, 28] };
  const baseDur = () => 0.3 / S.speed;

  const timeVal = $('timeVal'), moveVal = $('moveVal'), bestVal = $('bestVal');
  const footTip = $('footTip');
  const notation = $('notation'), notationMove = $('notationMove'), notationName = $('notationName');
  const btns = { scramble: $('scrambleBtn'), undo: $('undoBtn'), hint: $('hintBtn'), solve: $('solveBtn'), reset: $('resetBtn') };

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const bestKey = () => `${S.size}-${S.diff}`;
  const bests = (() => { try { return JSON.parse(store.get(LS.best) || '{}') || {}; } catch { return {}; } })();

  /* ---------- 转动记号提示 ---------- */
  let notationTimer = 0;
  function showNotation(mv) {
    const info = cube.notation(mv);
    notationMove.textContent = info.text;
    const nm = t('notName')[info.face] || '';
    notationName.textContent = (info.inner ? t('notInner') + ' · ' : '') + nm + (info.text.includes('′') ? t('notPrime') : '');
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

  /* ---------- 公式阶段横幅 ---------- */
  const stageBanner = $('stageBanner');
  let stageTimer = 0, curStage = '';
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

  /* ---------- 历史提交（相邻同层合并，抵消则弹出） ---------- */
  function pushHistory(mv) {
    const last = S.history[S.history.length - 1];
    if (last && last.axis === mv.axis && last.coord === mv.coord) {
      const merged = (last.turns + mv.turns) % 4;
      if (merged === 0) S.history.pop();
      else last.turns = merged;
    } else {
      S.history.push({ axis: mv.axis, coord: mv.coord, turns: mv.turns });
    }
  }

  /* ---------- 玩家拖拽转动一层（来自 3D 引擎回调） ---------- */
  onUserTwistRef = (mv) => {
    audio.click(0.9 + Math.random() * 0.25);
    invalidateHint();               // 玩家亲自动手 → 解题计划重新规划
    pushHistory(mv);
    showNotation(mv);
    markMoved();
    if (S.phase === 'playing') {
      if (!S.startAt) S.startAt = performance.now();  // 计时从玩家第一步开始
      S.userStack.push(mv);
      S.moves += 1;
      if (cube.isSolved()) { onWin(false); return; }
    } else if (S.phase === 'idle') {
      S.userStack.push(mv);
      if (cube.isSolved()) { S.history = []; S.userStack = []; }
    }
    render();
  };

  /* ---------- 打乱开局 ---------- */
  async function scramble() {
    if (cube.isBusy() || S.phase === 'scrambling' || S.phase === 'solving') return;
    audio.ensure();
    cube.setIdleSpin(false);
    cube.build(S.size);           // 重建即复位
    stageHide();
    invalidateHint();
    const gen = ++S.gen;
    S.history = []; S.userStack = [];
    S.moves = 0; S.hints = 0; S.startAt = 0; S.elapsed = 0;
    setPhase('scrambling');
    setTip('tipScrambling');
    for (const mv of cube.randomScramble(SCRAMBLE[S.size][S.diff])) {
      pushHistory(mv);
      await cube.animateMove(mv, 0.085);
      if (S.gen !== gen) return;  // 期间被重建（切阶数/复原）→ 放弃
      audio.whoosh();
    }
    S.startAt = 0;                // 计时等待玩家第一步
    markMoved();
    setPhase('playing');
    setTip('tipPlay');
  }

  /* ---------- 撤销玩家最后一步 ---------- */
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

  /* ---------- 帮我一步：层先法下一步（4×4 原路倒带），显示公式阶段 ----------
     解题计划缓存：连按提示沿同一条公式路线走，不会每步重算导致“拆东补西”震荡；
     玩家亲自转动/撤销/打乱后计划作废，从新状态重新规划。 */
  let hinting = false;
  let hintPlan = null;                // { steps, idx, nextSig }
  const stateSig = () => JSON.stringify(cube.getState());
  const invalidateHint = () => { hintPlan = null; };

  async function hint() {
    if (hinting || cube.isBusy() || S.phase !== 'playing' || !S.history.length) return;
    const gen = S.gen;
    /* 2×2/3×3：真求解器按公式给下一步；4×4：倒带一步 */
    let step, stageKey;
    if (S.size === 4) {
      step = cube.invert(S.history[S.history.length - 1]);
      stageKey = 'rewind';
    } else {
      if (!hintPlan || hintPlan.idx >= hintPlan.steps.length || hintPlan.nextSig !== stateSig()) {
        const sol = solveLBL(cube.getState(), S.size);
        if (!sol || !sol.length) return;
        hintPlan = { steps: sol, idx: 0, nextSig: stateSig() };
      }
      step = hintPlan.steps[hintPlan.idx];
      stageKey = step.stage;
    }
    hinting = true;
    cube.setLocked(true);        // 亮灯预告期间不许拖
    S.hints += 1;
    S.moves += 1;
    if (!S.startAt) S.startAt = performance.now();
    S.userStack = [];            // 提示之后不可再撤销更早的步
    render();
    try {
      /* 显示公式阶段 + 点亮要搬运的那层零件，看清楚了再转 */
      stageShow(stageKey);
      const turnDur = baseDur() * 1.5;
      cube.flashLayer(step.axis, step.coord, 0.55 + turnDur + 0.6);
      audio.click(1.3);
      await sleep(550);
      if (S.gen !== gen || S.phase !== 'playing') return;
      showNotation(step);
      await cube.animateMove(step, turnDur);
      if (S.gen !== gen) return;
      audio.click(1.15);
      pushHistory(step);
      if (S.size !== 4 && hintPlan) {   // 计划推进一步，记录预期状态
        hintPlan.idx += 1;
        hintPlan.nextSig = stateSig();
      }
      markMoved();
      if (cube.isSolved()) { onWin(false); return; }
    } finally {
      hinting = false;
      setPhase(S.phase);         // 按当前阶段重算锁定与按钮
    }
  }

  /* ---------- 还原演示：2×2/3×3 层先法公式逐阶段演示，4×4 原路倒带 ---------- */
  async function autoSolve() {
    if (cube.isBusy() || !S.history.length || S.phase === 'scrambling' || S.phase === 'solving') return;
    const gen = S.gen;
    invalidateHint();
    setPhase('solving');
    S.userStack = [];
    if (S.size === 4) {
      /* 4×4：原路倒带（讲清楚这是"记路回家"不是公式） */
      setTip('tipSolving4');
      stageShow('rewind', null, true);
      while (S.history.length && S.phase === 'solving') {
        const inv = cube.invert(S.history[S.history.length - 1]);
        showNotation(inv);
        await cube.animateMove(inv, Math.max(0.15, baseDur() * 0.8));
        if (S.gen !== gen) { stageHide(); return; }
        audio.whoosh();
        pushHistory(inv);
      }
    } else {
      /* 层先法：孩子学的公式，一个阶段一个阶段来 */
      setTip('tipSolving');
      const sol = solveLBL(cube.getState(), S.size);
      if (!sol) {   // 理论不发生；兜底倒带
        while (S.history.length && S.phase === 'solving') {
          const inv = cube.invert(S.history[S.history.length - 1]);
          await cube.animateMove(inv, 0.15);
          if (S.gen !== gen) return;
          pushHistory(inv);
        }
      } else {
        const order = [...new Set(sol.map((s) => s.stage))];
        for (const step of sol) {
          if (S.phase !== 'solving') break;
          stageShow(step.stage, order, true);
          showNotation(step);
          await cube.animateMove(step, Math.max(0.14, baseDur() * 0.7));
          if (S.gen !== gen) { stageHide(); return; }
          audio.whoosh();
          pushHistory(step);
        }
      }
    }
    stageHide();
    if (S.phase === 'solving') onWin(true);
  }

  /* ---------- 复原重置 ---------- */
  function reset() {
    cube.build(S.size);
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

  /* ---------- 胜利 / 演示完成 ---------- */
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
      $('winStats').textContent = t('winStats')(fmtTime(S.elapsed), S.moves);
      let note = '';
      if (S.hints > 0) {
        note = t('winWithHint')(S.hints);
      } else {
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

  /* ---------- 🔍 结构秘密课：按阶数分支的分步讲解 ---------- */
  const lesson3d = $('lesson3d');
  let lessonOn = false, lessonStep = 0, lessonGen = 0, lessonSize = 3;
  const demoHist = [];

  /* 每步场景：explode 炸开量 | focus 零件聚焦 | track 金块(edge/low) | spin 自转 | demo 演示动作 */
  const LESSON_SCENES = {
    2: [
      { explode: 0.95, spin: true },
      { explode: 0, track: 'edge', spin: true, demo: 'farTurns' },  // 金锚正对镜头不动，7 角围着转
      { explode: 0, track: 'edge', demo: 'outerTurns' },            // 同一金角自己动：3 贴纸同行
      { explode: 0, track: 'edge', spin: true, demo: 'home' },
    ],
    3: [
      { explode: 0.95, spin: true },
      { explode: 0.55, focus: 'center', spin: true },
      { explode: 0.55, spin: true, demo: 'alt' },             // 棱/角交替聚焦
      { explode: 0, track: 'edge', demo: 'outerTurns' },
      { explode: 0, track: 'edge', spin: true, demo: 'home' },
    ],
    4: [
      { explode: 0.9, spin: true },
      { explode: 0, focus: 'center', demo: 'innerTurns' },    // 转内层：中心搬家
      { explode: 0.55, focus: 'center', spin: true },
      { explode: 0.55, focus: 'edge', spin: true },
      { explode: 0, track: 'edge', spin: true, demo: 'home' },
    ],
  };

  function lessonRender() {
    const steps = t('secret')[lessonSize];
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
    const sc = LESSON_SCENES[lessonSize][i];
    cube.setTracked(false);
    cube.setFocus(sc.focus || null);
    cube.setExplode(sc.explode || 0);
    cube.setIdleSpin(!!sc.spin);
    const m = lessonSize - 1;

    if (sc.demo === 'alt') {
      /* 棱块 / 角块交替聚焦 */
      let which = 'edge';
      cube.setFocus(which);
      while (lessonGen === gen) {
        await sleep(1900);
        if (lessonGen !== gen) return;
        which = which === 'edge' ? 'corner' : 'edge';
        cube.setFocus(which);
      }
    } else if (sc.demo === 'outerTurns' || sc.demo === 'innerTurns' || sc.demo === 'farTurns') {
      /* 收拢后连续转层演示；outer 转最外层，inner 转 4×4 内层，far 转锚点对面的层（锚不动） */
      if (sc.explode === 0) await sleep(1200);
      if (lessonGen !== gen) return;
      if (sc.track) cube.setTracked(true, sc.track);
      const c = sc.demo === 'innerTurns' ? 1 : sc.demo === 'farTurns' ? -m : m;
      const seq = [
        { axis: 1, coord: c, turns: 1 }, { axis: 2, coord: c, turns: 1 },
        { axis: 1, coord: c, turns: 3 }, { axis: 2, coord: c, turns: 3 },
        { axis: 0, coord: c, turns: 1 }, { axis: 1, coord: c, turns: 1 },
        { axis: 0, coord: c, turns: 3 }, { axis: 1, coord: c, turns: 3 },
      ];
      let k = 0;
      await sleep(500);
      while (lessonGen === gen && k < 24) {   // 循环三轮后静静呼吸，等孩子看够
        const mv = seq[k % seq.length]; k += 1;
        demoHist.push(mv);
        audio.whoosh();
        await cube.animateMove(mv, 0.5);
        if (lessonGen !== gen) return;
        await sleep(420);
      }
    } else if (sc.demo === 'home') {
      /* 零件回家：回放演示历史归位 */
      if (sc.track) cube.setTracked(true, sc.track);
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
    S.gen += 1;                       // 中止打乱/演示等异步循环
    while (cube.isBusy()) await sleep(50);
    lessonSize = S.size;              // 讲解跟随当前阶数，各讲各的秘密
    cube.build(lessonSize);
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
    reset();                          // 回到所选阶数的复原态
    cube.setIdleSpin(false);
    setTip('tipIdle');
  }

  $('guideSecretBtn').addEventListener('click', startLesson);
  $('secretBtn').addEventListener('click', startLesson);
  $('lessonExitBtn').addEventListener('click', exitLesson);
  $('lessonPrevBtn').addEventListener('click', () => { if (lessonStep > 0) enterStep(lessonStep - 1); });
  $('lessonNextBtn').addEventListener('click', () => {
    if (lessonStep < t('secret')[lessonSize].length - 1) enterStep(lessonStep + 1);
    else exitLesson();
  });

  /* ---------- 参数面板接线 ---------- */
  function segWire(segId, attr, cb) {
    $(segId).addEventListener('click', (e) => {
      const b = e.target.closest('.seg__btn');
      if (!b || b.classList.contains('is-on')) return;
      [...$(segId).querySelectorAll('.seg__btn')].forEach((x) => x.classList.toggle('is-on', x === b));
      cb(b.dataset[attr]);
    });
  }
  segWire('sizeSeg', 'size', (v) => { S.size = +v; reset(); });
  segWire('diffSeg', 'diff', (v) => { S.diff = +v; render(); }); // 下一次打乱生效
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

  /* 面板收起/展开（手机默认收起，桌面默认展开） */
  const panelBody = $('panelBody'), panelHandle = $('panelHandle'), panelArrow = $('panelArrow');
  let panelOpen = matchMedia('(min-width: 761px)').matches;
  function applyPanel() {
    panelBody.hidden = !panelOpen;
    panelArrow.textContent = panelOpen ? '▾' : '▸';
    panelHandle.setAttribute('aria-expanded', String(panelOpen));
  }
  panelHandle.addEventListener('click', () => { panelOpen = !panelOpen; applyPanel(); });
  applyPanel();

  /* 小课堂折叠 */
  const lessonBody = $('lessonBody'), lessonArrow = $('lessonArrow');
  $('lessonBtn').addEventListener('click', () => {
    lessonBody.hidden = !lessonBody.hidden;
    lessonArrow.textContent = lessonBody.hidden ? '▸' : '▾';
  });

  /* 声音开关 */
  soundBtn.addEventListener('click', () => {
    audio.setMuted(!audio.muted);
    soundBtn.textContent = audio.muted ? '🔇' : '🔊';
  });

  /* 首次引导 */
  const guide = $('guide');
  if (!store.get(LS.guided)) guide.hidden = false;
  $('guideBtn').addEventListener('click', () => {
    guide.hidden = true;
    store.set(LS.guided, '1');
    audio.ensure();
  });

  /* ---------- HUD 计时 & 卡住轻提示（30s） ---------- */
  setInterval(() => {
    if (S.phase === 'playing' && S.startAt) {
      timeVal.textContent = fmtTime((performance.now() - S.startAt) / 1000);
      if (!S.stuckShown && performance.now() - S.lastMoveAt > 30000) {
        S.stuckShown = true;
        setTip('tipStuck');
      }
    }
  }, 250);

  /* ---------- 统一渲染（语言/主题/状态变化都走这里） ---------- */
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
    /* 语言切换时刷新横幅文字 */
    if (!stageBanner.hidden && curStage) {
      const info = t('stages')[curStage];
      if (info) { $('stageName').textContent = info[0]; $('stageFormula').textContent = info[1]; }
    }
    if (lessonOn) lessonRender();     // 语言切换时同步刷新讲解卡
  };

  addEventListener('themechange', () => cube.refreshTheme());

  /* ---------- 启动 ---------- */
  applyTheme();
  applyLang();
  setTip('tipIdle');
  render();
}
