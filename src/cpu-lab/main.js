(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '🖥️ 电脑原理实验室 · KidsLab',
      back: '返回平台',
      title: '电脑原理实验室',
      eyebrow: '电脑小工厂',
      labLabel: '第几关',
      controlLabel: '怎么玩',
      pcLabel: '书签',
      irLabel: '正在做',
      aLabel: '草稿纸',
      outLabel: '屏幕',
      watchPassed: '太棒了',
      soundOn: '关闭音效',
      soundOff: '开启音效',
      theme: '切换主题',
      reset: '重新开始',
      hint: '提示',
      levels: ['找零件', '看电脑干活', '自己下命令'],
      watchLabels: ['第 1 关 · 找零件', '第 2 关 · 看电脑干活', '第 3 关 · 自己下命令'],
      missions: [
        '听问题，点正确的零件',
        '一直点“下一步”，看电脑怎么算',
        '点指令卡，让屏幕出现 9',
      ],
      controlTitles: ['听问题再点零件', '点大按钮看下一步', '点卡片拼命令'],
      tips: [
        '电脑像一座小工厂。听上面的问题，去点对的零件。',
        '电脑一次只做一件事。点“下一步”，跟着它走三小步。',
        '下面有现成配方。先照着点一遍，再点“跑起来”。',
      ],
      starts: [
        '问题：东西都放在哪？去点像货架的那个。',
        '准备好了！点绿色大按钮“下一步”。',
        '想让屏幕显示 9。可以先点：放进4 → 加上5 → 显示 → 停下。',
      ],
      hints: [
        '货架=放东西的地方；大脑=负责算；彩条=送信的路；键盘=送进去；屏幕=亮出来。',
        '三小步：①拿命令 ②看懂 ③去做。亮起来的地方就是正在忙的零件。',
        '照着配方点：放进4、加上5、显示、停下。然后点“跑起来”。',
      ],
      partNames: {
        mem: '货架（内存）',
        cpu: '大脑（CPU）',
        bus: '送信小路（总线）',
        input: '键盘（输入）',
        output: '屏幕（输出）',
      },
      partDescs: {
        mem: '命令和数字都住在带编号的格子里',
        cpu: '负责拿命令、看懂、再算一算',
        bus: '在零件之间跑来跑去送信',
        input: '把外面的数送进电脑',
        output: '把算好的结果亮出来',
      },
      quizAsks: [
        '东西都放在哪里？点那个像货架的。',
        '谁负责动脑筋算数？点大脑。',
        '数字从这里跑到那里，靠哪条路？点彩条小路。',
        '想把数字送进电脑，点哪里？',
        '算完要给人看，点哪里？',
      ],
      quizOk: (name) => `对啦！就是「${name}」。`,
      quizBad: '还不是这个。再看看上面的问题。',
      quizProgress: (n, total) => `找零件 ${n} / ${total}`,
      chartCaption: '迷你电脑结构图 · 点图上的方块答题',
      flowIn: '送进去',
      flowOut: '亮出来',
      flowBus: '送信',
      quizDoneTitle: '零件都找到啦！',
      quizDoneText: '记住就好：货架放东西，大脑会算，小路送信，键盘送进去，屏幕亮出来。',
      phaseFetch: '① 拿命令',
      phaseDecode: '② 看懂',
      phaseExecute: '③ 去做',
      phaseIdle: '还没开始',
      stepNext: '下一步',
      stepRun: '跑起来！',
      stepClear: '全部清空',
      fdeIntro: '这段小程序会做：7 + 5，再把答案 12 放回货架。',
      fdeFetch: (pc, text) => `① 拿命令：书签停在第 ${pc} 格，把「${text}」拿过来。`,
      fdeDecode: (plain) => `② 看懂：原来是要「${plain}」。`,
      fdeExecute: (detail) => `③ 去做：${detail}`,
      fdeHalt: '停下了。货架第 6 格现在是 12。7+5 算完啦！',
      fdeDoneTitle: '你看见电脑怎么干活了！',
      fdeDoneText: '电脑不会猜心思。它只是：拿命令 → 看懂 → 去做。一遍一遍，直到停下。',
      opLabel: {
        'LOAD 4': '取出4号',
        'ADD 5': '加上5号',
        'STORE 6': '存回6号',
        HALT: '停下',
        'SET 4': '放进4',
        'SET 6': '放进6',
        'ADD 3': '加上3',
        'ADD 5i': '加上5',
        'SUB 1': '减去1',
        OUT: '显示',
      },
      opPlain: {
        'LOAD 4': '把货架第4格的数放到草稿纸',
        'ADD 5@mem': '把货架第5格的数加到草稿纸',
        'STORE 6': '把草稿纸上的数放回第6格',
        HALT: '做完了，停下来',
        'SET 4': '在草稿纸上写下 4',
        'SET 6': '在草稿纸上写下 6',
        'ADD 3': '草稿纸上的数再加 3',
        'ADD 5': '草稿纸上的数再加 5',
        'SUB 1': '草稿纸上的数减 1',
        OUT: '把草稿纸上的数亮到屏幕',
      },
      opExec: {
        load: (addr, val) => `草稿纸上写下货架第${addr}格的 ${val}`,
        add: (addr, val, result) => `草稿纸 ${result - val} + 货架第${addr}格的 ${val} = ${result}`,
        store: (addr, val) => `把 ${val} 放回货架第${addr}格`,
        set: (val) => `草稿纸上写下 ${val}`,
        addImm: (val, result) => `草稿纸变成 ${result}（刚加了 ${val}）`,
        subImm: (val, result) => `草稿纸变成 ${result}（刚减了 ${val}）`,
        out: (val) => `屏幕亮起 ${val}`,
        halt: () => '停下，不拿新命令了',
      },
      buildGoal: '想让屏幕显示',
      buildGoalValue: '9',
      buildTray: '点这些命令卡',
      buildScript: '你的命令清单',
      buildRecipe: '推荐配方',
      buildRecipeSteps: '放进4 → 加上5 → 显示 → 停下',
      buildEmpty: '清单还是空的。先点下面的命令卡。',
      buildFull: '清单满了。点一条可以删掉。',
      buildNeedHalt: '最后要加一张「停下」，不然电脑不知道什么时候结束。',
      buildNeedOut: '还缺「显示」。不加这张，屏幕不会亮。',
      buildWrong: (got) => `屏幕是 ${got === null || got === undefined ? '空的' : got}，不是 9。清空后再试一次吧。`,
      buildOk: '屏幕是 9！电脑完全按你的清单做事。',
      buildDoneTitle: '你会给电脑下命令啦！',
      buildDoneText: '电脑很老实：你写什么，它就做什么。写错了也不会自己改。',
      next: '下一关',
      replay: '再玩一遍',
      locked: '先过前面一关哦。',
      inValue: '等你输入',
      outDash: '—',
      cycleLabel: '现在走到哪一步',
      demoLabel: '这段程序在算什么',
      pcHelp: '书签：下一格命令在哪里',
      aHelp: '草稿纸：临时写答案的地方',
      regPc: '书签',
      regIr: '正在做',
      regA: '草稿纸',
      regAlu: '计算器',
      showCode: '命令',
      showData: '数字',
    },
    en: {
      doc: '🖥️ Computer Principles Lab · KidsLab',
      back: 'Back to platform',
      title: 'Computer Principles Lab',
      eyebrow: 'Tiny computer factory',
      labLabel: 'Level',
      controlLabel: 'How to play',
      pcLabel: 'Bookmark',
      irLabel: 'Doing',
      aLabel: 'Scratch',
      outLabel: 'Screen',
      watchPassed: 'Nice work',
      soundOn: 'Mute sound',
      soundOff: 'Turn sound on',
      theme: 'Switch theme',
      reset: 'Restart',
      hint: 'Hint',
      levels: ['Find parts', 'Watch it work', 'Give orders'],
      watchLabels: ['Level 1 · Find parts', 'Level 2 · Watch it work', 'Level 3 · Give orders'],
      missions: [
        'Read the question, tap the right part',
        'Keep tapping Next to watch it compute',
        'Tap cards so the screen shows 9',
      ],
      controlTitles: ['Read, then tap a part', 'Tap the big Next button', 'Tap cards to build orders'],
      tips: [
        'A computer is a tiny factory. Read the question and tap the matching part.',
        'It does one little step at a time. Tap Next and follow three mini-steps.',
        'There is a ready recipe below. Tap those cards, then press Run.',
      ],
      starts: [
        'Question: where is stuff stored? Tap the shelves.',
        'Ready! Tap the green Next button.',
        'Make the screen show 9. Try: put 4 → add 5 → show → stop.',
      ],
      hints: [
        'Shelves store things; the brain calculates; the stripe is the path; keyboard sends in; screen shows out.',
        'Three mini-steps: ① get order ② understand ③ do it. The glowing part is busy.',
        'Recipe: put 4, add 5, show, stop. Then press Run.',
      ],
      partNames: {
        mem: 'Shelves (memory)',
        cpu: 'Brain (CPU)',
        bus: 'Message path (bus)',
        input: 'Keyboard (input)',
        output: 'Screen (output)',
      },
      partDescs: {
        mem: 'Orders and numbers live in numbered boxes',
        cpu: 'Gets an order, understands it, then calculates',
        bus: 'Carries messages between parts',
        input: 'Sends numbers into the computer',
        output: 'Shows the finished answer',
      },
      quizAsks: [
        'Where is stuff stored? Tap the shelves.',
        'Who does the thinking? Tap the brain.',
        'Which path carries numbers around? Tap the striped path.',
        'Want to send a number in? Tap here.',
        'Want people to see the answer? Tap here.',
      ],
      quizOk: (name) => `Yes! That is the ${name}.`,
      quizBad: 'Not that one. Read the question again.',
      quizProgress: (n, total) => `Find parts ${n} / ${total}`,
      chartCaption: 'Mini computer chart · tap a box to answer',
      flowIn: 'in',
      flowOut: 'out',
      flowBus: 'carry',
      quizDoneTitle: 'You found every part!',
      quizDoneText: 'Remember: shelves store, brain calculates, path carries messages, keyboard sends in, screen shows out.',
      phaseFetch: '① Get order',
      phaseDecode: '② Understand',
      phaseExecute: '③ Do it',
      phaseIdle: 'Not started',
      stepNext: 'Next',
      stepRun: 'Run!',
      stepClear: 'Clear all',
      fdeIntro: 'This tiny program does 7 + 5, then puts 12 back on the shelf.',
      fdeFetch: (pc, text) => `① Get order: bookmark is on box ${pc}, pick up “${text}”.`,
      fdeDecode: (plain) => `② Understand: it means “${plain}”.`,
      fdeExecute: (detail) => `③ Do it: ${detail}`,
      fdeHalt: 'Stopped. Shelf box 6 is now 12. 7+5 is done!',
      fdeDoneTitle: 'You watched the computer work!',
      fdeDoneText: 'It never guesses. It only: get order → understand → do it. Again and again, until stop.',
      opLabel: {
        'LOAD 4': 'get #4',
        'ADD 5': 'add #5',
        'STORE 6': 'save #6',
        HALT: 'stop',
        'SET 4': 'put 4',
        'SET 6': 'put 6',
        'ADD 3': 'add 3',
        'ADD 5i': 'add 5',
        'SUB 1': 'minus 1',
        OUT: 'show',
      },
      opPlain: {
        'LOAD 4': 'copy shelf box 4 onto the scratch paper',
        'ADD 5@mem': 'add shelf box 5 onto the scratch paper',
        'STORE 6': 'put the scratch number back into box 6',
        HALT: 'finished — stop',
        'SET 4': 'write 4 on the scratch paper',
        'SET 6': 'write 6 on the scratch paper',
        'ADD 3': 'add 3 on the scratch paper',
        'ADD 5': 'add 5 on the scratch paper',
        'SUB 1': 'subtract 1 on the scratch paper',
        OUT: 'light the scratch number on the screen',
      },
      opExec: {
        load: (addr, val) => `scratch paper gets ${val} from shelf box ${addr}`,
        add: (addr, val, result) => `scratch ${result - val} + shelf ${addr}'s ${val} = ${result}`,
        store: (addr, val) => `put ${val} back into shelf box ${addr}`,
        set: (val) => `write ${val} on scratch paper`,
        addImm: (val, result) => `scratch becomes ${result} (just added ${val})`,
        subImm: (val, result) => `scratch becomes ${result} (just subtracted ${val})`,
        out: (val) => `screen shows ${val}`,
        halt: () => 'stop — no more orders',
      },
      buildGoal: 'Make the screen show',
      buildGoalValue: '9',
      buildTray: 'Tap these order cards',
      buildScript: 'Your order list',
      buildRecipe: 'Suggested recipe',
      buildRecipeSteps: 'put 4 → add 5 → show → stop',
      buildEmpty: 'List is empty. Tap an order card first.',
      buildFull: 'List is full. Tap a line to remove it.',
      buildNeedHalt: 'Add a “stop” card at the end so it knows when to finish.',
      buildNeedOut: 'You still need “show”, or the screen stays blank.',
      buildWrong: (got) => `Screen is ${got === null || got === undefined ? 'blank' : got}, not 9. Clear and try again.`,
      buildOk: 'Screen is 9! The computer followed your list exactly.',
      buildDoneTitle: 'You can give computer orders!',
      buildDoneText: 'Computers are honest: they only do what you write. They will not fix your mistakes.',
      next: 'Next level',
      replay: 'Play again',
      locked: 'Finish the earlier level first.',
      inValue: 'waiting',
      outDash: '—',
      cycleLabel: 'Which mini-step now',
      demoLabel: 'What this program calculates',
      pcHelp: 'Bookmark: where the next order is',
      aHelp: 'Scratch paper: temporary answer space',
      regPc: 'Bookmark',
      regIr: 'Doing',
      regA: 'Scratch',
      regAlu: 'Calculator',
      showCode: 'order',
      showData: 'number',
    },
  };

  const QUIZ = ['mem', 'cpu', 'bus', 'input', 'output'];
  const DEMO_PROGRAM = ['LOAD 4', 'ADD 5', 'STORE 6', 'HALT'];
  const DEMO_DATA = { 4: 7, 5: 5, 6: 0 };
  // Internal opcodes stay English; kids see opLabel() text on cards.
  const BUILD_OPS = ['SET 4', 'SET 6', 'ADD 3', 'ADD 5', 'SUB 1', 'OUT', 'HALT'];
  const BUILD_RECIPE = ['SET 4', 'ADD 5', 'OUT', 'HALT'];
  const BUILD_TARGET = 9;
  const MAX_SCRIPT = 8;
  const SAVE_KEY = 'kidslab.cpu-lab';
  const MUTE_KEY = 'kidslab.sound.muted';

  const $ = (sel) => document.querySelector(sel);
  const el = {
    lang: $('#langBtn'),
    theme: $('#themeBtn'),
    sound: $('#soundBtn'),
    tip: $('#tip'),
    phaseChip: $('#phaseChip'),
    levels: $('#levelStrip'),
    watch: $('#watchLabel'),
    mission: $('#missionTitle'),
    controlTitle: $('#controlTitle'),
    hint: $('#hintBtn'),
    reset: $('#resetBtn'),
    machine: $('#machine'),
    feedback: $('#feedback'),
    workspace: $('#controlWorkspace'),
    pc: $('#pcReadout'),
    ir: $('#irReadout'),
    a: $('#aReadout'),
    out: $('#outReadout'),
    action: $('#actionBtn'),
    actionLabel: $('#actionLabel'),
    secondary: $('#secondaryBtn'),
    secondaryLabel: $('#secondaryLabel'),
    modal: $('#modal'),
    modalMagic: $('#modalMagic'),
    modalTitle: $('#modalTitle'),
    modalText: $('#modalText'),
    next: $('#nextBtn'),
  };

  let t = (key) => key;
  let stage = 0;
  let unlocked = 0;
  let quizIndex = 0;
  let feedbackType = '';
  let hintTimer = 0;
  let audioContext = null;
  let muted = false;
  let busTimer = 0;

  /** Shared machine snapshot for stages 1–2 */
  let machine = freshMachine();
  let fdePhase = 'idle'; // idle | fetch | decode | execute | done
  let fdeInstrIndex = 0;
  let lastDetail = '';
  let script = [];
  let running = false;

  try {
    muted = localStorage.getItem(MUTE_KEY) === 'true';
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (saved && Number.isInteger(saved.stage) && Number.isInteger(saved.unlocked)) {
      stage = Math.max(0, Math.min(2, saved.stage));
      unlocked = Math.max(stage, Math.min(2, saved.unlocked));
    }
  } catch {
    // optional storage
  }

  function freshMachine(mode = 'demo') {
    const mem = Array.from({ length: 8 }, () => ({ kind: 'empty', text: '0', value: 0 }));
    if (mode === 'demo') {
      DEMO_PROGRAM.forEach((text, i) => {
        mem[i] = { kind: 'code', text, value: 0 };
      });
      Object.entries(DEMO_DATA).forEach(([addr, value]) => {
        mem[Number(addr)] = { kind: 'data', text: String(value), value };
      });
    }
    return {
      pc: 0,
      ir: '—',
      a: 0,
      out: null,
      halted: false,
      mem,
      hotPart: '',
      hotReg: '',
      touchAddr: -1,
      busOn: false,
    };
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ stage, unlocked }));
    } catch {
      // optional
    }
  }

  function ensureAudio() {
    if (muted) return null;
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      audioContext ||= new Ctor();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      return audioContext;
    } catch {
      return null;
    }
  }

  function tone(kind) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const patterns = {
      tap: [[320, 0, 0.05, 0.04]],
      bus: [[260, 0, 0.06, 0.035], [390, 0.05, 0.07, 0.04]],
      wrong: [[180, 0, 0.12, 0.05], [130, 0.1, 0.14, 0.045]],
      correct: [[440, 0, 0.07, 0.045], [580, 0.07, 0.11, 0.055]],
      complete: [[392, 0, 0.09, 0.045], [523, 0.09, 0.11, 0.055], [659, 0.2, 0.16, 0.06]],
    };
    const now = ctx.currentTime;
    for (const [freq, offset, dur, vol] of patterns[kind] || patterns.tap) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = kind === 'wrong' ? 'square' : 'sine';
      o.frequency.setValueAtTime(freq, now + offset);
      g.gain.setValueAtTime(0.0001, now + offset);
      g.gain.exponentialRampToValueAtTime(vol, now + offset + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, now + offset + dur);
      o.connect(g).connect(ctx.destination);
      o.start(now + offset);
      o.stop(now + offset + dur + 0.02);
    }
  }

  function setFeedback(message, type = '') {
    el.feedback.textContent = message;
    feedbackType = type;
    el.feedback.classList.toggle('is-error', type === 'error');
    el.feedback.classList.toggle('is-success', type === 'success');
  }

  function scheduleHint() {
    clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      if (el.modal.hidden) setFeedback(t('hints')[stage]);
    }, 30000);
  }

  function parseOp(text) {
    const parts = String(text).trim().split(/\s+/);
    const op = (parts[0] || '').toUpperCase();
    const arg = parts[1] !== undefined ? Number(parts[1]) : null;
    return { op, arg, text: parts[1] !== undefined ? `${op} ${parts[1]}` : op };
  }

  function plainFor(text) {
    const table = t('opPlain');
    if (stage === 1 && text === 'ADD 5') return table['ADD 5@mem'] || table['ADD 5'] || text;
    return table[text] || text;
  }

  function labelFor(text) {
    const table = t('opLabel');
    if (stage === 2 && text === 'ADD 5') return table['ADD 5i'] || table['ADD 5'] || text;
    return table[text] || text;
  }

  function execDetail(detailKey, detailArgs) {
    const entry = t('opExec')[detailKey];
    if (typeof entry === 'function') return entry(...detailArgs);
    return entry || detailKey;
  }

  function displayCellText(cell) {
    if (!cell || cell.kind === 'empty') return '0';
    if (cell.kind === 'data') return String(cell.value);
    return labelFor(cell.text);
  }

  function applyOp(state, text) {
    const { op, arg } = parseOp(text);
    const next = {
      ...state,
      mem: state.mem.map((cell) => ({ ...cell })),
      hotPart: 'cpu',
      hotReg: 'a',
      touchAddr: -1,
      busOn: false,
    };
    let detailKey = 'halt';
    let detailArgs = [];

    if (op === 'LOAD' && Number.isFinite(arg)) {
      const val = next.mem[arg]?.value ?? 0;
      next.a = val;
      next.touchAddr = arg;
      next.hotPart = 'mem';
      next.busOn = true;
      detailKey = 'load';
      detailArgs = [arg, val];
    } else if (op === 'ADD' && Number.isFinite(arg) && stage === 1) {
      const val = next.mem[arg]?.value ?? 0;
      next.a += val;
      next.touchAddr = arg;
      next.hotPart = 'mem';
      next.busOn = true;
      detailKey = 'add';
      detailArgs = [arg, val, next.a];
    } else if (op === 'ADD' && Number.isFinite(arg)) {
      next.a += arg;
      detailKey = 'addImm';
      detailArgs = [arg, next.a];
    } else if (op === 'STORE' && Number.isFinite(arg)) {
      next.mem[arg] = { kind: 'data', text: String(next.a), value: next.a };
      next.touchAddr = arg;
      next.hotPart = 'mem';
      next.busOn = true;
      detailKey = 'store';
      detailArgs = [arg, next.a];
    } else if (op === 'SET' && Number.isFinite(arg)) {
      next.a = arg;
      detailKey = 'set';
      detailArgs = [arg];
    } else if (op === 'SUB' && Number.isFinite(arg)) {
      next.a -= arg;
      detailKey = 'subImm';
      detailArgs = [arg, next.a];
    } else if (op === 'OUT') {
      next.out = next.a;
      next.hotPart = 'output';
      next.busOn = true;
      detailKey = 'out';
      detailArgs = [next.a];
    } else if (op === 'HALT') {
      next.halted = true;
      next.hotReg = '';
      detailKey = 'halt';
      detailArgs = [];
    }
    return { state: next, detailKey, detailArgs };
  }

  function flashBus() {
    machine.busOn = true;
    clearTimeout(busTimer);
    busTimer = window.setTimeout(() => {
      machine.busOn = false;
      const packet = el.machine.querySelector('.bus-packet');
      if (packet) packet.classList.remove('is-moving');
      // keep hot marks briefly
      renderMachineOnly();
    }, 700);
    tone('bus');
  }

  function renderLevels() {
    el.levels.innerHTML = t('levels').map((name, index) =>
      `<button class="level-button ${index === stage ? 'is-active' : ''} ${index < unlocked ? 'is-done' : ''}" type="button" data-level="${index}" ${index > unlocked ? 'disabled' : ''}>${index + 1}. ${name}</button>`).join('');
    el.levels.querySelectorAll('[data-level]').forEach((btn) => {
      btn.addEventListener('click', () => setStage(Number(btn.dataset.level)));
    });
  }

  function renderMachineOnly() {
    const names = t('partNames');
    const descs = t('partDescs');
    const quizTarget = stage === 0 ? QUIZ[quizIndex] : '';
    const doneSet = stage === 0 ? new Set(QUIZ.slice(0, quizIndex)) : new Set();

    const detail = stage !== 0;
    const memCells = machine.mem.map((cell, addr) => {
      const cls = [
        'cell',
        addr === machine.pc && detail ? 'is-pc' : '',
        addr === machine.touchAddr ? 'is-touch' : '',
      ].filter(Boolean).join(' ');
      return `<div class="${cls}"><b>${addr}</b><code>${displayCellText(cell)}</code></div>`;
    }).join('');

    const partClass = (id) => [
      'part',
      `part--${id === 'input' ? 'in' : id === 'output' ? 'out' : id}`,
      quizTarget === id ? 'is-target' : '',
      machine.hotPart === id ? 'is-hot' : '',
      doneSet.has(id) ? 'is-done' : '',
      detail ? 'part--detail' : 'part--simple',
    ].filter(Boolean).join(' ');

    const irShow = !machine.ir || machine.ir === '—' ? t('outDash') : labelFor(machine.ir);
    const busMoving = machine.busOn ? 'is-moving' : '';

    el.machine.innerHTML = `
      <p class="chart-caption">${t('chartCaption')}</p>
      <div class="board ${detail ? 'board--detail' : 'board--simple'}" role="group" aria-label="${t('chartCaption')}">
        <div class="board-row board-row--top">
          <span class="flow-chip" aria-hidden="true">${t('flowIn')}</span>
          <button class="${partClass('input')}" type="button" data-part="input" aria-label="${names.input}. ${descs.input}">
            <span class="part__icon" aria-hidden="true">⌨️</span>
            <span class="part__name">${names.input}</span>
            <p class="part__desc">${descs.input}</p>
            ${detail ? `<div class="io-value">${t('inValue')}</div>` : ''}
          </button>
          <span class="flow-chevron" aria-hidden="true">→</span>
          <button class="${partClass('cpu')}" type="button" data-part="cpu" aria-label="${names.cpu}. ${descs.cpu}">
            <span class="part__icon" aria-hidden="true">🧠</span>
            <span class="part__name">${names.cpu}</span>
            <p class="part__desc">${descs.cpu}</p>
            ${detail ? `<div class="cpu-inner">
              <div class="reg ${machine.hotReg === 'pc' ? 'is-hot' : ''}"><span>${t('regPc')}</span><strong>${machine.pc}</strong></div>
              <div class="reg ${machine.hotReg === 'ir' ? 'is-hot' : ''}"><span>${t('regIr')}</span><code>${irShow}</code></div>
              <div class="reg ${machine.hotReg === 'a' ? 'is-hot' : ''}"><span>${t('regA')}</span><strong>${machine.a}</strong></div>
              <div class="reg"><span>${t('regAlu')}</span><code>+ −</code></div>
            </div>` : ''}
          </button>
          <span class="flow-chevron" aria-hidden="true">↔</span>
          <button class="${partClass('mem')}" type="button" data-part="mem" aria-label="${names.mem}. ${descs.mem}">
            <span class="part__icon" aria-hidden="true">🗄️</span>
            <span class="part__name">${names.mem}</span>
            <p class="part__desc">${descs.mem}</p>
            ${detail ? `<div class="mem-grid">${memCells}</div>` : ''}
          </button>
        </div>
        <div class="board-row board-row--bus">
          <button class="${partClass('bus')}" type="button" data-part="bus" aria-label="${names.bus}. ${descs.bus}">
            <div class="bus-head">
              <span class="part__icon" aria-hidden="true">🚌</span>
              <span class="part__name">${names.bus}</span>
              <span class="bus-tag" aria-hidden="true">${t('flowBus')}</span>
            </div>
            <p class="part__desc">${descs.bus}</p>
            <div class="bus-track">
              <div class="bus-lane">
                <span class="bus-packet ${busMoving}" aria-hidden="true">📦</span>
              </div>
            </div>
          </button>
        </div>
        <div class="board-row board-row--out">
          <span class="flow-chevron flow-chevron--down" aria-hidden="true">↓</span>
          <button class="${partClass('output')}" type="button" data-part="output" aria-label="${names.output}. ${descs.output}">
            <span class="part__icon" aria-hidden="true">📺</span>
            <span class="part__name">${names.output}</span>
            <p class="part__desc">${descs.output}</p>
            <div class="io-value">${machine.out === null || machine.out === undefined ? t('outDash') : machine.out}</div>
          </button>
          <span class="flow-chip" aria-hidden="true">${t('flowOut')}</span>
        </div>
      </div>`;

    el.machine.querySelectorAll('[data-part]').forEach((btn) => {
      btn.addEventListener('click', () => onPartTap(btn.dataset.part, btn));
    });
  }

  function renderWorkspace() {
    if (stage === 0) {
      const id = QUIZ[quizIndex];
      el.workspace.innerHTML = `
        <div class="quest-card quest-card--big">
          <h3>${t('quizProgress', quizIndex + 1, QUIZ.length)}</h3>
          <p class="ask-line">${t('quizAsks')[quizIndex]}</p>
          <div class="progress-dots">${QUIZ.map((_, i) =>
            `<i class="${i < quizIndex ? 'is-done' : ''} ${i === quizIndex ? 'is-current' : ''}"></i>`).join('')}</div>
        </div>
        <p class="help-text">${t('partDescs')[id]}</p>`;
      return;
    }

    if (stage === 1) {
      const phase = fdePhase === 'idle' ? 'idle' : fdePhase;
      el.workspace.innerHTML = `
        <div class="lesson-card">
          <h3>${t('demoLabel')}</h3>
          <p>${t('fdeIntro')}</p>
        </div>
        <div class="lesson-card">
          <h3>${t('cycleLabel')}</h3>
          <div class="phase-pills">
            <span class="phase-pill ${phase === 'fetch' ? 'is-active' : ''} ${['decode', 'execute', 'done'].includes(phase) || fdeInstrIndex > 0 ? 'is-done' : ''}">${t('phaseFetch')}</span>
            <span class="phase-pill ${phase === 'decode' ? 'is-active' : ''} ${['execute', 'done'].includes(phase) ? 'is-done' : ''}">${t('phaseDecode')}</span>
            <span class="phase-pill ${phase === 'execute' ? 'is-active' : ''} ${phase === 'done' ? 'is-done' : ''}">${t('phaseExecute')}</span>
          </div>
          <p class="ask-line" style="margin-top:8px">${lastDetail || t('starts')[1]}</p>
        </div>
        <p class="help-text">${t('pcHelp')}<br>${t('aHelp')}</p>`;
      return;
    }

    el.workspace.innerHTML = `
      <div class="quest-card quest-card--goal">
        <h3>${t('buildGoal')}</h3>
        <p class="goal-num">${t('buildGoalValue')}</p>
        <div class="recipe-box">
          <strong>${t('buildRecipe')}</strong>
          <span>${t('buildRecipeSteps')}</span>
          <button class="ghost-button recipe-btn" id="fillRecipeBtn" type="button" ${running ? 'disabled' : ''}>✨ ${t('buildRecipe')}</button>
        </div>
      </div>
      <div class="program-panel">
        <h3>${t('buildTray')}</h3>
        <div class="card-tray">${BUILD_OPS.map((op) =>
          `<button class="op-card" type="button" data-op="${op}" title="${plainFor(op)}"><b>${labelFor(op)}</b><small>${plainFor(op)}</small></button>`).join('')}</div>
      </div>
      <div class="program-panel">
        <h3>${t('buildScript')}</h3>
        <div class="script-list" id="scriptList">${script.length
          ? script.map((op, i) =>
            `<button class="script-chip" type="button" data-i="${i}" title="${plainFor(op)}"><small>${i + 1}</small>${labelFor(op)}</button>`).join('')
          : `<span class="script-empty">${t('buildEmpty')}</span>`}</div>
      </div>`;

    el.workspace.querySelectorAll('[data-op]').forEach((btn) => {
      btn.addEventListener('click', () => addOp(btn.dataset.op));
    });
    el.workspace.querySelectorAll('[data-i]').forEach((btn) => {
      btn.addEventListener('click', () => removeOp(Number(btn.dataset.i)));
    });
    el.workspace.querySelector('#fillRecipeBtn')?.addEventListener('click', fillRecipe);
  }

  function fillRecipe() {
    if (stage !== 2 || running) return;
    script = BUILD_RECIPE.slice();
    machine = freshMachine('build');
    setFeedback(t('starts')[2]);
    feedbackType = '';
    tone('tap');
    window.cool?.track?.('fill_recipe');
    render();
    scheduleHint();
  }

  function renderMeters() {
    el.pc.textContent = String(machine.pc);
    el.ir.textContent = !machine.ir || machine.ir === '—' ? t('outDash') : labelFor(machine.ir);
    el.a.textContent = String(machine.a);
    el.out.textContent = machine.out === null || machine.out === undefined ? t('outDash') : String(machine.out);
    const board = document.getElementById('meterBoard');
    if (board) board.hidden = stage === 0;
  }

  function renderActions() {
    el.secondary.hidden = stage !== 2;
    el.secondaryLabel.textContent = t('stepClear');
    if (stage === 0) {
      el.action.disabled = true;
      el.actionLabel.textContent = t('stepNext');
      el.action.hidden = true;
    } else if (stage === 1) {
      el.action.hidden = false;
      el.action.disabled = fdePhase === 'done' || running;
      el.actionLabel.textContent = t('stepNext');
    } else {
      el.action.hidden = false;
      el.action.disabled = running || script.length === 0;
      el.actionLabel.textContent = t('stepRun');
    }
  }

  function render() {
    document.body.dataset.stage = String(stage);
    el.tip.textContent = t('tips')[stage];
    el.watch.textContent = t('watchLabels')[stage];
    el.mission.textContent = stage === 0
      ? t('quizAsks')[quizIndex]
      : t('missions')[stage];
    el.controlTitle.textContent = t('controlTitles')[stage];
    el.phaseChip.textContent = `${stage + 1} / 3`;
    el.sound.textContent = muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-label', muted ? t('soundOff') : t('soundOn'));
    el.sound.setAttribute('aria-pressed', String(muted));
    el.theme.setAttribute('aria-label', t('theme'));
    el.reset.setAttribute('aria-label', t('reset'));
    el.hint.setAttribute('aria-label', t('hint'));
    el.feedback.classList.toggle('is-error', feedbackType === 'error');
    el.feedback.classList.toggle('is-success', feedbackType === 'success');

    renderLevels();
    renderMachineOnly();
    renderWorkspace();
    renderMeters();
    renderActions();
  }

  function onPartTap(part, btn) {
    if (stage !== 0 || !el.modal.hidden) return;
    const expect = QUIZ[quizIndex];
    if (part === expect) {
      tone('correct');
      window.cool?.track?.('identify_part', { value: quizIndex + 1 });
      setFeedback(t('quizOk', t('partNames')[part]), 'success');
      quizIndex += 1;
      if (quizIndex >= QUIZ.length) {
        completeStage(t('quizDoneTitle'), t('quizDoneText'), '🖥️✨');
      } else {
        machine.hotPart = part;
        render();
        scheduleHint();
      }
      return;
    }
    tone('wrong');
    btn.classList.add('is-wrong');
    window.setTimeout(() => btn.classList.remove('is-wrong'), 350);
    setFeedback(t('quizBad'), 'error');
    window.cool?.track?.('wrong_part');
    scheduleHint();
  }

  function stepFde() {
    if (stage !== 1 || fdePhase === 'done' || running) return;

    if (fdePhase === 'idle' || fdePhase === 'execute') {
      // start fetch of current pc
      if (machine.halted || fdeInstrIndex >= DEMO_PROGRAM.length) {
        fdePhase = 'done';
        setFeedback(t('fdeHalt'), 'success');
        completeStage(t('fdeDoneTitle'), t('fdeDoneText'), '⚙️✨');
        render();
        return;
      }
      fdePhase = 'fetch';
      machine.hotPart = 'mem';
      machine.hotReg = 'pc';
      machine.touchAddr = machine.pc;
      machine.ir = machine.mem[machine.pc]?.text || '???';
      machine.busOn = true;
      lastDetail = t('fdeFetch', machine.pc, labelFor(machine.ir));
      setFeedback(lastDetail);
      flashBus();
      window.cool?.track?.('fde_fetch');
      render();
      scheduleHint();
      return;
    }

    if (fdePhase === 'fetch') {
      fdePhase = 'decode';
      machine.hotPart = 'cpu';
      machine.hotReg = 'ir';
      machine.touchAddr = -1;
      machine.busOn = false;
      const plain = plainFor(machine.ir);
      lastDetail = t('fdeDecode', plain);
      setFeedback(lastDetail);
      tone('tap');
      window.cool?.track?.('fde_decode');
      render();
      return;
    }

    if (fdePhase === 'decode') {
      fdePhase = 'execute';
      const { state, detailKey, detailArgs } = applyOp(machine, machine.ir);
      machine = state;
      const detail = execDetail(detailKey, detailArgs);
      lastDetail = t('fdeExecute', detail);
      setFeedback(lastDetail, machine.halted ? 'success' : '');
      if (machine.busOn) flashBus();
      else tone('correct');
      // advance PC after execute unless halt
      if (!machine.halted) {
        machine.pc += 1;
        machine.hotReg = 'pc';
      }
      fdeInstrIndex += 1;
      window.cool?.track?.('fde_execute');
      render();

      if (machine.halted) {
        fdePhase = 'done';
        window.setTimeout(() => {
          setFeedback(t('fdeHalt'), 'success');
          completeStage(t('fdeDoneTitle'), t('fdeDoneText'), '⚙️✨');
        }, 450);
      }
    }
  }

  function addOp(op) {
    if (stage !== 2 || running) return;
    if (script.length >= MAX_SCRIPT) {
      setFeedback(t('buildFull'), 'error');
      tone('wrong');
      return;
    }
    script.push(op);
    tone('tap');
    window.cool?.track?.('add_instruction');
    setFeedback(t('starts')[2]);
    feedbackType = '';
    render();
    scheduleHint();
  }

  function removeOp(index) {
    if (stage !== 2 || running) return;
    script.splice(index, 1);
    tone('tap');
    render();
  }

  function clearScript() {
    if (stage !== 2 || running) return;
    script = [];
    machine = freshMachine('build');
    setFeedback(t('buildEmpty'));
    feedbackType = '';
    tone('tap');
    render();
  }

  function runBuiltProgram() {
    if (stage !== 2 || running || !script.length) return;
    if (!script.includes('OUT')) {
      setFeedback(t('buildNeedOut'), 'error');
      tone('wrong');
      return;
    }
    if (script[script.length - 1] !== 'HALT' && !script.includes('HALT')) {
      setFeedback(t('buildNeedHalt'), 'error');
      tone('wrong');
      return;
    }

    running = true;
    machine = freshMachine('build');
    // load script into memory for visualization
    script.forEach((text, i) => {
      if (i < machine.mem.length) machine.mem[i] = { kind: 'code', text, value: 0 };
    });
    render();
    window.cool?.track?.('run_program');

    let i = 0;
    const tick = () => {
      if (i >= script.length || machine.halted) {
        running = false;
        const got = machine.out;
        if (got === BUILD_TARGET) {
          setFeedback(t('buildOk'), 'success');
          tone('complete');
          completeStage(t('buildDoneTitle'), t('buildDoneText'), '🎉🖥️');
        } else {
          setFeedback(t('buildWrong', got), 'error');
          tone('wrong');
          window.cool?.track?.('wrong_output');
        }
        render();
        scheduleHint();
        return;
      }
      const text = script[i];
      machine.pc = i;
      machine.ir = text;
      machine.hotReg = 'ir';
      const { state } = applyOp(machine, text);
      machine = state;
      if (!machine.halted) machine.pc = i + 1;
      if (machine.busOn) flashBus();
      else tone('tap');
      i += 1;
      render();
      window.setTimeout(tick, 520);
    };
    window.setTimeout(tick, 280);
  }

  function completeStage(title, text, magic) {
    if (stage < 2) {
      unlocked = Math.max(unlocked, stage + 1);
      persist();
    } else {
      window.cool?.complete?.();
    }
    window.cool?.stage?.(stage === 0 ? 'parts' : stage === 1 ? 'fde' : 'program');
    el.modalMagic.textContent = magic;
    el.modalTitle.textContent = title;
    el.modalText.textContent = text;
    el.next.textContent = stage === 2 ? t('replay') : t('next');
    el.modal.hidden = false;
    tone('complete');
    renderLevels();
  }

  function resetStageState() {
    quizIndex = 0;
    fdePhase = 'idle';
    fdeInstrIndex = 0;
    lastDetail = '';
    script = [];
    running = false;
    machine = freshMachine(stage === 1 ? 'demo' : stage === 2 ? 'build' : 'demo');
    if (stage === 0) machine = freshMachine('demo');
    feedbackType = '';
    setFeedback(t('starts')[stage]);
  }

  function setStage(next) {
    if (next > unlocked) {
      setFeedback(t('locked'), 'error');
      return;
    }
    stage = next;
    el.modal.hidden = true;
    persist();
    resetStageState();
    window.cool?.stage?.(stage === 0 ? 'parts' : stage === 1 ? 'fde' : 'program');
    render();
    scheduleHint();
  }

  function onAction() {
    if (stage === 1) stepFde();
    else if (stage === 2) runBuiltProgram();
  }

  el.lang?.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme?.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.sound?.addEventListener('click', () => {
    muted = !muted;
    try { localStorage.setItem(MUTE_KEY, String(muted)); } catch { /* optional */ }
    render();
  });
  el.hint?.addEventListener('click', () => {
    setFeedback(t('hints')[stage]);
    tone('tap');
  });
  el.reset?.addEventListener('click', () => {
    resetStageState();
    render();
    tone('tap');
    scheduleHint();
  });
  el.action?.addEventListener('click', onAction);
  el.secondary?.addEventListener('click', clearScript);
  el.next?.addEventListener('click', () => {
    el.modal.hidden = true;
    if (stage >= 2) {
      unlocked = 2;
      setStage(0);
      return;
    }
    setStage(stage + 1);
  });

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang, theme }) {
      t = translate;
      document.title = t('doc');
      if (el.lang) el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      if (el.theme) el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
      // keep current feedback language-sensitive on switch
      if (!feedbackType) setFeedback(t('starts')[stage]);
      render();
    },
  });

  resetStageState();
  scheduleHint();
})();
