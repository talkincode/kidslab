import { createAudio } from './audio.js';
import { createBoard3D } from './game3d.js';
import {
  PIECES,
  applyMove,
  createClassicState,
  invertMove,
  isSolved,
  legalMoves,
  moveLabel,
  solvePuzzle,
} from './puzzle.js';

const I18N = {
  zh: {
    doc: '华容道 · 木关智局 · KidsLab',
    back: '返回平台',
    title: '华容道 · 木关智局',
    subtitle: '腾出两格路，让曹操从南门离开',
    moves: '格步',
    time: '时间',
    best: '最佳',
    panelTitle: '机关台',
    chooseLevel: '选择棋局',
    levelPractice: '开门练习',
    levelClassic: '横刀立马',
    watchDemo: '观看解法演示',
    selected: '当前棋块',
    undo: '撤销',
    hint: '给我提示',
    restart: '重新摆阵',
    lesson: '三分钟小课堂',
    ruleTitle: '两格空位，就是整局的钥匙',
    ruleText: '棋块不能旋转，也不能跨过别人。',
    footTip: '拖棋块滑动 · 拖空白转视角 · 滚轮或双指缩放',
    demoProgress: '解法演示',
    exitDemo: '退出演示',
    speed: '速度',
    lessonEyebrow: '木关小课堂',
    previous: '上一步',
    next: '下一步',
    guideEyebrow: '第一次来到木关',
    guideTitle: '把路“借”给曹操',
    guide1: '找空位旁边的棋块',
    guide2: '沿着棋盘拖动一格',
    guide3: '让曹操走到下方金色出口',
    guideDemo: '先看开门练习',
    guidePlay: '我自己试试',
    winEyebrow: '南门已开',
    winTitle: '你把曹操送出去了！',
    again: '再摆一局',
    reviewDemo: '回看解法',
    nogl: '浏览器暂不支持 WebGL，木机关没法转起来。请换一个新浏览器试试。',
    modePractice: '开门练习',
    modeClassic: '横刀立马',
    noSelection: '还没选中',
    selectTip: '点一块棋，再按方向；也可以直接拖动。',
    legalCount: (count) => count ? `有 ${count} 个方向可以滑动。` : '这块被挡住了，先动别的棋块。',
    bestMoves: (moves) => `${moves}步`,
    coachIdleTitle: '先找空位',
    coachIdleText: '拖动空位旁边的棋块，给曹操慢慢让出一条路。',
    coachPracticeTitle: '最后十二步',
    coachPracticeText: '这局离出口很近，先练会“传递空位”。',
    coachSelectedTitle: (name) => `已选中：${name}`,
    coachSelectedText: (count) => count ? '绿色箭头就是能走的方向。' : '它现在被卡住了，换一块试试。',
    coachMoveTitle: '咔哒，空位换家了',
    coachMoveText: '每滑一步，都看看两格空位跑到了哪里。',
    coachInvalidTitle: '这边被挡住了',
    coachInvalidText: '棋块不能穿过别人，也不能离开木框。',
    coachUndoTitle: '退回一步',
    coachUndoText: '走错没关系，华容道就是边试边想。',
    coachHintThinkingTitle: '正在找路',
    coachHintThinkingText: '我在棋盘里试走许多条路线……',
    coachHintTitle: '看绿色箭头',
    coachHintText: (label) => `${label}。先只走这一步，再看看空位。`,
    coachNoHintTitle: '这局暂时算不出',
    coachNoHintText: '可以撤销几步，或重新摆阵再试。',
    coachDemoStartTitle: '跟着空位走',
    coachDemoStartText: '可以暂停、单步前进，或拖动进度条回看。',
    coachDemoMoveTitle: (current, total) => `演示 ${current} / ${total}`,
    coachDemoMoveText: (label) => `${label}。留意空位怎样换到另一侧。`,
    coachDemoDoneTitle: '南门打开了',
    coachDemoDoneText: '演示完成。退出后，轮到你自己走一遍。',
    coachWinTitle: '机关解开！',
    coachWinText: '空位一路传递，终于为曹操拼出了一扇门。',
    demoPlay: '继续演示',
    demoPause: '暂停演示',
    demoReplay: '重新播放',
    musicOn: '关闭背景音乐',
    musicOff: '开启背景音乐',
    soundOn: '关闭音效',
    soundOff: '开启音效',
    themeAria: '切换深浅主题',
    panelExpand: '展开机关台',
    panelCollapse: '收起机关台',
    moveAria: { up: '向上移动', left: '向左移动', right: '向右移动', down: '向下移动' },
    lessonDone: '去练十二步',
    lessonSteps: [
      {
        focus: 'empty',
        title: '先看两格空位',
        text: '棋盘总会留下两格空位。所有移动，都是把空位“传”到新的地方。',
      },
      {
        focus: 'guan',
        title: '只能平移，不能旋转',
        text: '每块木牌都要保持方向，只能沿格线滑动。被别的棋块挡住，就要先给它让路。',
      },
      {
        focus: 'cao',
        title: '先清脚下，再开中路',
        text: '曹操占四格，出口也正好宽两格。想让他向下，必须把下方连续两格一起腾空。',
      },
      {
        focus: 'exit',
        title: '目标不是搬完所有棋',
        text: '只要曹操来到最下方金色出口就成功。每一步都问：这会让中间的路更通吗？',
      },
    ],
    winStats: (moves, time) => `用了 ${moves} 格步 · ${time}`,
    winNewBest: '新纪录！你把路走得更短了。',
    winNote: '空位会走，路就会出现。',
  },
  en: {
    doc: 'Huarong Dao · The Wooden Pass · KidsLab',
    back: 'Back',
    title: 'Huarong Dao · The Wooden Pass',
    subtitle: 'Open a two-cell lane and guide Cao Cao through the south gate',
    moves: 'Steps',
    time: 'Time',
    best: 'Best',
    panelTitle: 'Puzzle Desk',
    chooseLevel: 'Choose a layout',
    levelPractice: 'Gate Practice',
    levelClassic: 'Classic Formation',
    watchDemo: 'Watch the solution',
    selected: 'Selected piece',
    undo: 'Undo',
    hint: 'Give a hint',
    restart: 'Reset layout',
    lesson: '3-min lesson',
    ruleTitle: 'The two empty cells are your key',
    ruleText: 'Pieces may not rotate, overlap, or jump.',
    footTip: 'Drag pieces to slide · drag empty space to orbit · wheel or pinch to zoom',
    demoProgress: 'Solution demo',
    exitDemo: 'Exit demo',
    speed: 'Speed',
    lessonEyebrow: 'WOODEN PASS LESSON',
    previous: 'Previous',
    next: 'Next',
    guideEyebrow: 'YOUR FIRST VISIT',
    guideTitle: 'Lend Cao Cao a road',
    guide1: 'Find a piece next to an empty cell',
    guide2: 'Drag it one grid step',
    guide3: 'Guide Cao Cao to the golden gate',
    guideDemo: 'Watch gate practice',
    guidePlay: 'Let me try',
    winEyebrow: 'THE SOUTH GATE IS OPEN',
    winTitle: 'You guided Cao Cao out!',
    again: 'Play again',
    reviewDemo: 'Review solution',
    nogl: 'This browser cannot run WebGL, so the wooden puzzle cannot open. Try a newer browser.',
    modePractice: 'Gate Practice',
    modeClassic: 'Classic Formation',
    noSelection: 'None yet',
    selectTip: 'Tap a piece, then use an arrow — or simply drag it.',
    legalCount: (count) => count ? `${count} direction${count > 1 ? 's are' : ' is'} open.` : 'This piece is blocked. Try another one.',
    bestMoves: (moves) => `${moves} steps`,
    coachIdleTitle: 'Find the empty cells',
    coachIdleText: 'Slide a neighboring piece and slowly build a lane for Cao Cao.',
    coachPracticeTitle: 'The final twelve steps',
    coachPracticeText: 'The gate is close. Practice passing the empty cells around.',
    coachSelectedTitle: (name) => `Selected: ${name}`,
    coachSelectedText: (count) => count ? 'The green arrows show every legal direction.' : 'It is blocked right now. Try another piece.',
    coachMoveTitle: 'Click — the gap moved',
    coachMoveText: 'After every slide, notice where the two empty cells went.',
    coachInvalidTitle: 'That way is blocked',
    coachInvalidText: 'Pieces cannot pass through each other or leave the frame.',
    coachUndoTitle: 'One step back',
    coachUndoText: 'A wrong turn is fine. This puzzle rewards trying and revising.',
    coachHintThinkingTitle: 'Searching for a path',
    coachHintThinkingText: 'I am testing many routes through the board…',
    coachHintTitle: 'Follow the green arrow',
    coachHintText: (label) => `${label}. Take just this step, then inspect the gaps again.`,
    coachNoHintTitle: 'No route found yet',
    coachNoHintText: 'Undo a few steps or reset the formation and try again.',
    coachDemoStartTitle: 'Follow the empty cells',
    coachDemoStartText: 'Pause, step through, or drag the timeline to inspect any move.',
    coachDemoMoveTitle: (current, total) => `Demo ${current} / ${total}`,
    coachDemoMoveText: (label) => `${label}. Watch the empty cells change sides.`,
    coachDemoDoneTitle: 'The south gate is open',
    coachDemoDoneText: 'Demo complete. Exit and try the route yourself.',
    coachWinTitle: 'The mechanism is open!',
    coachWinText: 'Passing the gaps around finally built Cao Cao a doorway.',
    demoPlay: 'Resume demo',
    demoPause: 'Pause demo',
    demoReplay: 'Replay demo',
    musicOn: 'Turn background music off',
    musicOff: 'Turn background music on',
    soundOn: 'Turn sound effects off',
    soundOff: 'Turn sound effects on',
    themeAria: 'Switch light or dark theme',
    panelExpand: 'Open puzzle desk',
    panelCollapse: 'Collapse puzzle desk',
    moveAria: { up: 'Move up', left: 'Move left', right: 'Move right', down: 'Move down' },
    lessonDone: 'Try the final twelve',
    lessonSteps: [
      {
        focus: 'empty',
        title: 'Start with the two empty cells',
        text: 'The board always keeps two cells empty. Every move simply passes those gaps to a new place.',
      },
      {
        focus: 'guan',
        title: 'Slide only — never rotate',
        text: 'Each wooden tile keeps its direction and follows the grid. If another piece blocks it, make room first.',
      },
      {
        focus: 'cao',
        title: 'Clear below, then open the middle',
        text: 'Cao Cao covers four cells and the gate is exactly two cells wide. Both cells below him must open together.',
      },
      {
        focus: 'exit',
        title: 'You do not need to move everyone out',
        text: 'The puzzle ends when Cao Cao reaches the golden gate. Ask: does this move make the middle lane clearer?',
      },
    ],
    winStats: (moves, time) => `${moves} grid steps · ${time}`,
    winNewBest: 'New best — you found a shorter route!',
    winNote: 'Move the gaps, and a road appears.',
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionSeconds = (seconds) => reducedMotion ? 0.015 : seconds;
const motionMs = (milliseconds) => reducedMotion ? 20 : milliseconds;
const store = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { /* no-op */ }
  },
};

let lang = window.cool?.preferences?.lang
  || store.get('kidslab.lang')
  || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
if (!I18N[lang]) lang = 'zh';
const t = () => I18N[lang];

const classicStart = createClassicState();
const classicSolution = solvePuzzle(classicStart, { maxNodes: 120000 }) || [];

function stateAt(start, path, count = path.length) {
  let current = start.slice();
  for (let index = 0; index < count; index += 1) {
    const next = applyMove(current, path[index]);
    if (!next) break;
    current = next;
  }
  return current;
}

const practiceLength = Math.min(12, classicSolution.length);
const practiceOffset = Math.max(0, classicSolution.length - practiceLength);
const LEVELS = {
  practice: {
    start: stateAt(classicStart, classicSolution, practiceOffset),
    solution: classicSolution.slice(practiceOffset),
  },
  classic: {
    start: classicStart,
    solution: classicSolution,
  },
};

const audio = createAudio();
let game = null;
let levelId = 'classic';
let state = LEVELS[levelId].start.slice();
let history = [];
let moveCount = 0;
let selectedPiece = -1;
let startedAt = 0;
let finishedAt = 0;
let busy = false;
let mode = 'play';
let lessonIndex = 0;
let demoIndex = 0;
let demoPlaying = false;
let demoToken = 0;
let hintTimer = 0;
let activeHint = null;

function formatTime(seconds) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

function elapsedSeconds() {
  if (!startedAt) return 0;
  const end = finishedAt || Date.now();
  return Math.round((end - startedAt) / 1000);
}

function bestKey() {
  return `kidslab.huarong-dao.best.${levelId}`;
}

function readBest() {
  try {
    const value = JSON.parse(store.get(bestKey()) || 'null');
    return value && Number.isFinite(value.moves) ? value : null;
  } catch {
    return null;
  }
}

function writeBest(result) {
  const previous = readBest();
  const improved = !previous
    || result.moves < previous.moves
    || (result.moves === previous.moves && result.seconds < previous.seconds);
  if (improved) store.set(bestKey(), JSON.stringify(result));
  return improved;
}

function updateHud() {
  $('#moveValue').textContent = moveCount;
  $('#timeValue').textContent = formatTime(elapsedSeconds());
  $('#modeBadge').textContent = levelId === 'practice' ? t().modePractice : t().modeClassic;
  const best = readBest();
  $('#bestValue').textContent = best ? t().bestMoves(best.moves) : '—';
}

function setCoach(title, text, icon = '◎') {
  $('#coachTitle').textContent = title;
  $('#coachText').textContent = text;
  $('#coachIcon').textContent = icon;
  const coach = $('#coach');
  coach.classList.remove('pop');
  void coach.offsetWidth;
  coach.classList.add('pop');
}

function currentIdleCoach() {
  if (levelId === 'practice') {
    setCoach(t().coachPracticeTitle, t().coachPracticeText, '十二');
  } else {
    setCoach(t().coachIdleTitle, t().coachIdleText, '◎');
  }
}

function updateMovePad(moves = selectedPiece >= 0 ? legalMoves(state, selectedPiece) : []) {
  $$('#movePad button').forEach((button) => {
    const dx = Number(button.dataset.dx);
    const dy = Number(button.dataset.dy);
    button.classList.toggle(
      'is-hint',
      Boolean(activeHint && activeHint.piece === selectedPiece && activeHint.dx === dx && activeHint.dy === dy),
    );
    button.disabled = mode !== 'play'
      || busy
      || selectedPiece < 0
      || !moves.some((move) => move.dx === dx && move.dy === dy);
  });
}

function updateSelected(index = selectedPiece, moves = index >= 0 ? legalMoves(state, index) : []) {
  selectedPiece = index;
  $('#selectedName').textContent = index >= 0
    ? (lang === 'zh' ? PIECES[index].zh : PIECES[index].en)
    : t().noSelection;
  $('#selectedTip').textContent = index >= 0 ? t().legalCount(moves.length) : t().selectTip;
  updateMovePad(moves);
}

function refreshControls() {
  $$('#levelSeg button').forEach((button) => {
    button.classList.toggle('is-on', button.dataset.level === levelId);
  });
  $('#undoBtn').disabled = mode !== 'play' || busy || history.length === 0;
  $('#hintBtn').disabled = mode !== 'play' || busy || isSolved(state);
  $('#restartBtn').disabled = busy;
  $('#demoBtn').disabled = busy || LEVELS[levelId].solution.length === 0;
  updateMovePad();
  updateHud();
}

function track(name, data) {
  window.cool?.track?.(name, data);
}

async function performUserMove(move) {
  if (mode !== 'play' || busy || isSolved(state)) return;
  const next = applyMove(state, move);
  if (!next) {
    game?.nudgeInvalid(move.piece);
    audio.invalid();
    setCoach(t().coachInvalidTitle, t().coachInvalidText, '×');
    return;
  }

  if (!startedAt) {
    startedAt = Date.now();
    window.cool?.stage?.('playing');
  }
  clearTimeout(hintTimer);
  activeHint = null;
  game?.setHint(null);
  history.push({ state: state.slice(), move: { ...move } });
  state = next;
  moveCount += 1;
  busy = true;
  audio.slide();
  setCoach(t().coachMoveTitle, t().coachMoveText, '空');
  refreshControls();
  track('slide_piece', { piece: PIECES[move.piece].id, dx: move.dx, dy: move.dy });

  await game?.animateMove(move, state, motionSeconds(0.25));
  busy = false;
  updateSelected(selectedPiece);
  refreshControls();
  if (isSolved(state)) finishGame();
}

async function undo() {
  if (mode !== 'play' || busy || history.length === 0) return;
  const previous = history.pop();
  activeHint = null;
  game?.setHint(null);
  const reverse = invertMove(previous.move);
  state = previous.state;
  moveCount = Math.max(0, moveCount - 1);
  busy = true;
  audio.slide();
  setCoach(t().coachUndoTitle, t().coachUndoText, '↩');
  refreshControls();
  track('undo_move');
  await game?.animateMove(reverse, state, motionSeconds(0.22));
  busy = false;
  activeHint = null;
  updateSelected(selectedPiece);
  refreshControls();
}

function resetLevel(nextLevel = levelId, { announce = true } = {}) {
  demoToken += 1;
  demoPlaying = false;
  levelId = nextLevel;
  state = LEVELS[levelId].start.slice();
  history = [];
  moveCount = 0;
  selectedPiece = -1;
  startedAt = 0;
  finishedAt = 0;
  busy = false;
  activeHint = null;
  mode = 'play';
  $('#win').hidden = true;
  $('#demoBar').hidden = true;
  document.body.classList.remove('is-demo', 'is-lesson');
  game?.setLessonFocus(null);
  game?.setState(state);
  game?.setInteractive(true);
  updateSelected(-1);
  refreshControls();
  if (announce) currentIdleCoach();
}

async function requestHint() {
  if (mode !== 'play' || busy || isSolved(state)) return;
  activeHint = null;
  game?.setHint(null);
  busy = true;
  game?.setInteractive(false);
  setCoach(t().coachHintThinkingTitle, t().coachHintThinkingText, '…');
  refreshControls();
  await sleep(40);
  const path = solvePuzzle(state, { maxNodes: 120000 });
  busy = false;
  game?.setInteractive(true);
  if (!path?.length) {
    audio.invalid();
    setCoach(t().coachNoHintTitle, t().coachNoHintText, '?');
    refreshControls();
    return;
  }
  const move = path[0];
  activeHint = move;
  game?.setHint(move);
  updateSelected(move.piece, legalMoves(state, move.piece));
  audio.hint();
  setCoach(t().coachHintTitle, t().coachHintText(moveLabel(move, lang)), '灯');
  track('request_hint', { remaining: path.length });
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => {
    if (mode === 'play' && !busy) {
      activeHint = null;
      game?.setHint(null);
      updateMovePad();
    }
  }, 6500);
  refreshControls();
}

function launchConfetti() {
  const layer = $('#confettiLayer');
  layer.replaceChildren();
  const colors = ['#b31f28', '#e3b34f', '#2d7658', '#f3dfad', '#6c2e1d'];
  for (let index = 0; index < 56; index += 1) {
    const piece = document.createElement('i');
    piece.className = 'confetti';
    piece.style.left = `${(index * 37) % 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDuration = `${1.8 + (index % 9) * 0.14}s`;
    piece.style.animationDelay = `${(index % 8) * 0.045}s`;
    piece.style.setProperty('--drift', `${((index * 53) % 180) - 90}px`);
    layer.appendChild(piece);
  }
  setTimeout(() => layer.replaceChildren(), 4300);
}

function finishGame() {
  finishedAt = Date.now();
  mode = 'win';
  const result = { moves: moveCount, seconds: elapsedSeconds() };
  const isBest = writeBest(result);
  game?.setInteractive(false);
  game?.celebrate();
  audio.win();
  launchConfetti();
  setCoach(t().coachWinTitle, t().coachWinText, '通');
  $('#winStats').textContent = t().winStats(result.moves, formatTime(result.seconds));
  $('#winNote').textContent = isBest ? t().winNewBest : t().winNote;
  setTimeout(() => { $('#win').hidden = false; }, motionMs(520));
  window.cool?.complete?.();
  track('solve_puzzle', { level: levelId, moves: result.moves, seconds: result.seconds });
  updateHud();
}

function demoStateAt(index) {
  return stateAt(LEVELS[levelId].start, LEVELS[levelId].solution, index);
}

function updateDemoUi() {
  const total = LEVELS[levelId].solution.length;
  $('#demoCount').textContent = `${demoIndex} / ${total}`;
  $('#demoRange').max = String(Math.max(1, total));
  $('#demoRange').value = String(demoIndex);
  $('#demoPrevBtn').disabled = demoIndex <= 0 || busy;
  $('#demoNextBtn').disabled = demoIndex >= total || busy;
  const replay = demoIndex >= total;
  $('#demoPlayBtn').textContent = replay ? '↻' : demoPlaying ? 'Ⅱ' : '▶';
  $('#demoPlayBtn').setAttribute('aria-label', replay ? t().demoReplay : demoPlaying ? t().demoPause : t().demoPlay);
  updateHud();
}

function pauseDemo() {
  demoPlaying = false;
  demoToken += 1;
  updateDemoUi();
}

async function playDemo() {
  if (mode !== 'demo') return;
  const path = LEVELS[levelId].solution;
  if (demoIndex >= path.length) {
    jumpDemo(0);
  }
  demoPlaying = true;
  const token = ++demoToken;
  updateDemoUi();
  while (mode === 'demo' && demoPlaying && token === demoToken && demoIndex < path.length) {
    const move = path[demoIndex];
    const next = applyMove(state, move);
    if (!next) break;
    const speed = Number($('#demoSpeed').value) || 1;
    state = next;
    demoIndex += 1;
    moveCount = demoIndex;
    selectedPiece = move.piece;
    setCoach(
      t().coachDemoMoveTitle(demoIndex, path.length),
      t().coachDemoMoveText(moveLabel(move, lang)),
      '演',
    );
    audio.slide();
    updateDemoUi();
    await game?.animateMove(move, state, motionSeconds(0.27 / speed));
    if (token !== demoToken || !demoPlaying) break;
    await sleep(motionMs(48 / speed));
  }
  if (mode === 'demo' && demoIndex >= path.length && token === demoToken) {
    demoPlaying = false;
    game?.celebrate();
    audio.win();
    setCoach(t().coachDemoDoneTitle, t().coachDemoDoneText, '通');
  }
  updateDemoUi();
}

function jumpDemo(index) {
  if (mode !== 'demo') return;
  pauseDemo();
  const total = LEVELS[levelId].solution.length;
  demoIndex = Math.max(0, Math.min(total, Number(index) || 0));
  state = demoStateAt(demoIndex);
  moveCount = demoIndex;
  selectedPiece = demoIndex ? LEVELS[levelId].solution[demoIndex - 1].piece : -1;
  game?.setState(state);
  game?.setInteractive(false);
  if (demoIndex === 0) {
    setCoach(t().coachDemoStartTitle, t().coachDemoStartText, '演');
  } else if (demoIndex < total) {
    const move = LEVELS[levelId].solution[demoIndex - 1];
    setCoach(
      t().coachDemoMoveTitle(demoIndex, total),
      t().coachDemoMoveText(moveLabel(move, lang)),
      '演',
    );
  } else {
    setCoach(t().coachDemoDoneTitle, t().coachDemoDoneText, '通');
  }
  updateDemoUi();
}

function startDemo(nextLevel = levelId) {
  resetLevel(nextLevel, { announce: false });
  mode = 'demo';
  history = [];
  demoIndex = 0;
  demoPlaying = false;
  document.body.classList.add('is-demo');
  $('#demoBar').hidden = false;
  $('#guide').hidden = true;
  $('#win').hidden = true;
  game?.setInteractive(false);
  setCoach(t().coachDemoStartTitle, t().coachDemoStartText, '演');
  updateDemoUi();
  track('start_solution_demo', { level: levelId });
  playDemo();
}

function exitDemo() {
  pauseDemo();
  document.body.classList.remove('is-demo');
  $('#demoBar').hidden = true;
  resetLevel(levelId);
}

function renderLesson() {
  const steps = t().lessonSteps;
  const step = steps[lessonIndex];
  $('#lessonBadge').textContent = `${lessonIndex + 1} / ${steps.length}`;
  $('#lessonTitle').textContent = step.title;
  $('#lessonText').textContent = step.text;
  $('#lessonPrevBtn').disabled = lessonIndex === 0;
  $('#lessonNextBtn').textContent = lessonIndex === steps.length - 1 ? t().lessonDone : t().next;
  game?.setLessonFocus(step.focus);
}

function openLesson() {
  if (busy) return;
  if (mode === 'demo') pauseDemo();
  mode = 'lesson';
  lessonIndex = 0;
  $('#lessonCard').hidden = false;
  $('#guide').hidden = true;
  $('#win').hidden = true;
  document.body.classList.add('is-lesson');
  game?.setInteractive(false);
  renderLesson();
  track('open_lesson');
}

function closeLesson(startPractice = false) {
  $('#lessonCard').hidden = true;
  document.body.classList.remove('is-lesson');
  game?.setLessonFocus(null);
  if (startPractice) {
    resetLevel('practice');
  } else {
    mode = 'play';
    game?.setInteractive(true);
    currentIdleCoach();
    refreshControls();
  }
}

function updateAudioButtons() {
  $('#musicBtn').setAttribute('aria-pressed', String(audio.musicOn));
  $('#musicBtn').setAttribute('aria-label', audio.musicOn ? t().musicOn : t().musicOff);
  $('#musicBtn').title = audio.musicOn ? t().musicOn : t().musicOff;
  $('#musicBtn').textContent = audio.musicOn ? '♫' : '♩';
  $('#soundBtn').setAttribute('aria-pressed', String(audio.sfxOn));
  $('#soundBtn').setAttribute('aria-label', audio.sfxOn ? t().soundOn : t().soundOff);
  $('#soundBtn').title = audio.sfxOn ? t().soundOn : t().soundOff;
  $('#soundBtn').textContent = audio.sfxOn ? '🔊' : '🔇';
}

function applyLanguage() {
  const strings = t();
  $$('[data-t]').forEach((element) => {
    const value = strings[element.dataset.t];
    if (typeof value === 'string') element.textContent = value;
  });
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = strings.doc;
  $('#langBtn').textContent = lang === 'zh' ? 'EN' : '中';
  $('#themeBtn').setAttribute('aria-label', strings.themeAria);
  $('#panelHandle').setAttribute(
    'aria-label',
    $('#panel').classList.contains('is-collapsed') ? strings.panelExpand : strings.panelCollapse,
  );
  const directionButtons = $$('#movePad button');
  const aria = [strings.moveAria.up, strings.moveAria.left, strings.moveAria.right, strings.moveAria.down];
  directionButtons.forEach((button, index) => button.setAttribute('aria-label', aria[index]));
  game?.setLanguage(lang);
  updateAudioButtons();
  updateSelected(selectedPiece);
  refreshControls();
  if (mode === 'lesson') renderLesson();
  else if (mode === 'demo') jumpDemo(demoIndex);
  else if (mode === 'play') currentIdleCoach();
  if (!$('#win').hidden) {
    $('#winStats').textContent = strings.winStats(moveCount, formatTime(elapsedSeconds()));
  }
}

function applyTheme() {
  const theme = document.documentElement.dataset.theme || 'light';
  $('#themeBtn').textContent = theme === 'light' ? '🌙' : '☀️';
  game?.applyTheme();
}

function initPreferences() {
  if (window.cool?.preferences) {
    $('#themeBtn').addEventListener('click', () => window.cool.preferences.toggleTheme());
    $('#langBtn').addEventListener('click', () => window.cool.preferences.toggleLang());
    window.cool.preferences.subscribe(({ kind }) => {
      document.documentElement.dataset.theme = window.cool.preferences.theme;
      if (kind === 'lang') {
        lang = window.cool.preferences.lang;
        applyLanguage();
      }
      applyTheme();
    });
    return;
  }
  $('#themeBtn').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    store.set('kidslab.theme', next);
    applyTheme();
  });
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    store.set('kidslab.lang', lang);
    applyLanguage();
  });
}

function bindUi() {
  $$('#levelSeg button').forEach((button) => {
    button.addEventListener('click', () => {
      audio.unlock();
      resetLevel(button.dataset.level);
      track('choose_layout', { level: levelId });
    });
  });
  $$('#movePad button').forEach((button) => {
    button.addEventListener('click', () => {
      audio.unlock();
      game?.moveSelected(Number(button.dataset.dx), Number(button.dataset.dy));
    });
  });
  $('#undoBtn').addEventListener('click', () => { audio.unlock(); undo(); });
  $('#hintBtn').addEventListener('click', () => { audio.unlock(); requestHint(); });
  $('#restartBtn').addEventListener('click', () => { audio.unlock(); resetLevel(levelId); track('reset_layout'); });
  $('#demoBtn').addEventListener('click', () => { audio.unlock(); startDemo(levelId); });
  $('#lessonBtn').addEventListener('click', () => { audio.unlock(); openLesson(); });

  $('#demoPlayBtn').addEventListener('click', () => {
    audio.unlock();
    if (demoPlaying) pauseDemo();
    else playDemo();
  });
  $('#demoPrevBtn').addEventListener('click', () => jumpDemo(demoIndex - 1));
  $('#demoNextBtn').addEventListener('click', () => jumpDemo(demoIndex + 1));
  $('#demoExitBtn').addEventListener('click', exitDemo);
  $('#demoRange').addEventListener('input', (event) => jumpDemo(Number(event.target.value)));

  $('#lessonPrevBtn').addEventListener('click', () => {
    lessonIndex = Math.max(0, lessonIndex - 1);
    renderLesson();
  });
  $('#lessonNextBtn').addEventListener('click', () => {
    if (lessonIndex >= t().lessonSteps.length - 1) closeLesson(true);
    else {
      lessonIndex += 1;
      renderLesson();
    }
  });
  $('#lessonExitBtn').addEventListener('click', () => closeLesson(false));

  $('#guideDemoBtn').addEventListener('click', () => {
    audio.unlock();
    store.set('kidslab.huarong-dao.guided', '1');
    startDemo('practice');
  });
  $('#guidePlayBtn').addEventListener('click', () => {
    audio.unlock();
    store.set('kidslab.huarong-dao.guided', '1');
    $('#guide').hidden = true;
    currentIdleCoach();
  });
  $('#winAgainBtn').addEventListener('click', () => resetLevel(levelId));
  $('#winDemoBtn').addEventListener('click', () => startDemo(levelId));

  $('#musicBtn').addEventListener('click', async () => {
    await audio.unlock();
    audio.setMusic(!audio.musicOn);
    updateAudioButtons();
  });
  $('#soundBtn').addEventListener('click', async () => {
    await audio.unlock();
    audio.setSfx(!audio.sfxOn);
    updateAudioButtons();
  });

  $('#panelHandle').addEventListener('click', () => {
    const collapsed = $('#panel').classList.toggle('is-collapsed');
    $('#panelHandle').setAttribute('aria-expanded', String(!collapsed));
    $('#panelHandle').setAttribute('aria-label', collapsed ? t().panelExpand : t().panelCollapse);
  });

  addEventListener('keydown', (event) => {
    if (event.target.matches('input, select, button')) return;
    if (mode === 'demo' && event.code === 'Space') {
      event.preventDefault();
      if (demoPlaying) pauseDemo();
      else playDemo();
      return;
    }
    if (mode !== 'play') return;
    const directions = {
      ArrowUp: [0, -1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowDown: [0, 1],
    };
    if (directions[event.key]) {
      event.preventDefault();
      audio.unlock();
      game?.moveSelected(...directions[event.key]);
    } else if (event.key.toLowerCase() === 'h') {
      requestHint();
    }
  });
}

function init() {
  game = createBoard3D({
    canvas: $('#scene'),
    cssVar,
    onInteract: () => audio.unlock(),
    onSelect: (index, moves) => {
      updateSelected(index, moves);
      if (index >= 0 && mode === 'play') {
        audio.pick();
        const name = lang === 'zh' ? PIECES[index].zh : PIECES[index].en;
        setCoach(t().coachSelectedTitle(name), t().coachSelectedText(moves.length), '选');
        track('select_piece', { piece: PIECES[index].id });
      }
    },
    onMoveRequest: performUserMove,
    onInvalid: () => {
      if (mode !== 'play') return;
      audio.invalid();
      setCoach(t().coachInvalidTitle, t().coachInvalidText, '×');
    },
  });

  if (!game) {
    $('#nogl').hidden = false;
    return;
  }

  game.setState(state);
  game.setLanguage(lang);
  bindUi();
  initPreferences();
  applyLanguage();
  applyTheme();
  updateAudioButtons();
  refreshControls();

  if (!store.get('kidslab.huarong-dao.guided')) {
    setTimeout(() => { $('#guide').hidden = false; }, 520);
  } else {
    currentIdleCoach();
    setTimeout(() => {
      if (mode === 'play' && selectedPiece < 0 && !busy) {
        const first = legalMoves(state)[0];
        if (first) game.setHint(first);
      }
    }, 1300);
  }

  setInterval(() => {
    if (mode === 'play' && startedAt && !finishedAt) updateHud();
  }, 250);
}

init();
