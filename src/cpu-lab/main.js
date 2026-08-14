(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '🖥️ 电脑原理实验室 · KidsLab',
      back: '返回平台',
      title: '电脑原理实验室',
      watchPassed: '太棒了',
      soundOn: '关闭音效',
      soundOff: '开启音效',
      theme: '切换主题',
      reset: '重新开始',
      levels: ['找零件', '看它算', '当 CPU'],
      watchLabels: ['第 1 关', '第 2 关', '第 3 关'],
      missions: [
        '数字和命令放在哪里？',
        '看看 CPU 怎么算出 7 + 5',
        '你现在就是 CPU',
      ],
      cues: ['点正确的零件', '点「下一步」', '选下一步动作'],
      starts: [
        '👉 点零件回答',
        '👉 点「下一步」',
        '👉 下一步做什么？',
      ],
      hints: [
        '💡 记东西的是内存',
        '💡 CPU 先去内存拿命令',
        '💡 还没命令就不能算',
      ],
      partNames: {
        mem: '内存',
        cpu: 'CPU',
        input: '输入',
        output: '输出',
      },
      partIcons: {
        mem: '🗄️',
        cpu: '🧠',
        input: '⌨️',
        output: '🖥️',
      },
      quizAsks: [
        '数字和命令放在哪里？',
        '谁负责算？',
        '数字从哪进来？',
        '结果在哪显示？',
      ],
      quizOk: {
        mem: '✓ 内存负责记东西',
        cpu: '✓ CPU 负责算',
        input: '✓ 输入送进电脑',
        output: '✓ 输出给人看',
      },
      quizBad: '🤔 再想想',
      quizDoneTitle: '零件都认识啦！',
      quizDoneText: '输入 → CPU ↔ 内存 → 输出',
      phaseFetch: '取命令',
      phaseDecode: '看命令',
      phaseExecute: '做命令',
      stepNext: '下一步',
      regPc: '下一条',
      regIr: '正在做',
      regA: '小本本',
      decodeMap: {
        'LOAD 4': '去第 4 格拿数字',
        'ADD 5': '把第 5 格加进来',
        'STORE 6': '把答案存回第 6 格',
        HALT: '做完了，停下',
      },
      opKid: {
        'LOAD 4': '取 4',
        'ADD 5': '加 5',
        'STORE 6': '存 6',
        HALT: '停下',
      },
      fdePrompt: {
        idle: '👉 点「下一步」开始',
        fetch: '命令飞进 CPU',
        decode: 'CPU 看懂命令',
        execute: 'CPU 正在做事',
        done: '算完啦！',
      },
      fdeDoneTitle: '你看见它怎么算了！',
      fdeDoneText: '取命令 → 看命令 → 做命令',
      playYou: '你就是 CPU',
      playAsk: '下一步做什么？',
      actFetch: '取指令',
      actLoad: '拿数字',
      actCalc: '计算',
      playBad: {
        fetch: '🤔 CPU 还没拿到命令',
        load: '🤔 还没拿到数字',
        calc: '🤔 该算一算了',
      },
      playOk: {
        fetch: '拿到命令了',
        load: '数字到手了',
        calc: '算好了',
      },
      playDoneTitle: '你会当 CPU 啦！',
      playDoneLine: '电脑就是这样一步一步工作的。',
      summaryKids: ['取命令', '看命令', '做命令'],
      summaryFormal: ['Fetch', 'Decode', 'Execute'],
      summaryFlow: ['输入', '内存', 'CPU', '输出'],
      next: '下一关',
      replay: '再玩一遍',
      locked: '先过前面一关哦',
      outDash: '—',
      inDemo: '7 + 5',
    },
    en: {
      doc: '🖥️ Computer Principles Lab · KidsLab',
      back: 'Back to platform',
      title: 'Computer Principles Lab',
      watchPassed: 'Nice work',
      soundOn: 'Mute sound',
      soundOff: 'Turn sound on',
      theme: 'Switch theme',
      reset: 'Restart',
      levels: ['Find parts', 'Watch it', 'Be the CPU'],
      watchLabels: ['Level 1', 'Level 2', 'Level 3'],
      missions: [
        'Where do numbers and orders live?',
        'Watch the CPU make 7 + 5',
        'You are the CPU now',
      ],
      cues: ['Tap the right part', 'Tap Next', 'Pick the next action'],
      starts: [
        '👉 Tap a part',
        '👉 Tap Next',
        '👉 What next?',
      ],
      hints: [
        '💡 Memory keeps things',
        '💡 CPU gets an order first',
        '💡 No order yet — cannot compute',
      ],
      partNames: {
        mem: 'Memory',
        cpu: 'CPU',
        input: 'Input',
        output: 'Output',
      },
      partIcons: {
        mem: '🗄️',
        cpu: '🧠',
        input: '⌨️',
        output: '🖥️',
      },
      quizAsks: [
        'Where do numbers and orders live?',
        'Who does the math?',
        'Where do numbers come in?',
        'Where is the answer shown?',
      ],
      quizOk: {
        mem: '✓ Memory remembers',
        cpu: '✓ CPU calculates',
        input: '✓ Input sends in',
        output: '✓ Output shows it',
      },
      quizBad: '🤔 Try again',
      quizDoneTitle: 'You know the parts!',
      quizDoneText: 'Input → CPU ↔ Memory → Output',
      phaseFetch: 'Get order',
      phaseDecode: 'Read order',
      phaseExecute: 'Do order',
      stepNext: 'Next',
      regPc: 'Next line',
      regIr: 'Doing',
      regA: 'Notebook',
      decodeMap: {
        'LOAD 4': 'Get the number in box 4',
        'ADD 5': 'Add the number in box 5',
        'STORE 6': 'Save the answer in box 6',
        HALT: 'Done — stop',
      },
      opKid: {
        'LOAD 4': 'get 4',
        'ADD 5': 'add 5',
        'STORE 6': 'save 6',
        HALT: 'stop',
      },
      fdePrompt: {
        idle: '👉 Tap Next to start',
        fetch: 'Order flies to CPU',
        decode: 'CPU reads the order',
        execute: 'CPU is working',
        done: 'Finished!',
      },
      fdeDoneTitle: 'You saw it work!',
      fdeDoneText: 'Get → Read → Do',
      playYou: 'You are the CPU',
      playAsk: 'What should you do next?',
      actFetch: 'Fetch',
      actLoad: 'Get number',
      actCalc: 'Compute',
      playBad: {
        fetch: '🤔 CPU has no order yet',
        load: '🤔 Number not grabbed yet',
        calc: '🤔 Time to compute',
      },
      playOk: {
        fetch: 'Got the order',
        load: 'Got the number',
        calc: 'Computed',
      },
      playDoneTitle: 'You can be the CPU!',
      playDoneLine: 'A computer works step by step like this.',
      summaryKids: ['Get order', 'Read order', 'Do order'],
      summaryFormal: ['Fetch', 'Decode', 'Execute'],
      summaryFlow: ['Input', 'Memory', 'CPU', 'Output'],
      next: 'Next level',
      replay: 'Play again',
      locked: 'Finish the earlier level first',
      outDash: '—',
      inDemo: '7 + 5',
    },
  };

  const QUIZ = ['mem', 'cpu', 'input', 'output'];
  const DEMO_PROGRAM = ['LOAD 4', 'ADD 5', 'STORE 6', 'HALT'];
  const DEMO_DATA = { 4: 7, 5: 5, 6: 0 };
  const SAVE_KEY = 'kidslab.cpu-lab';
  const MUTE_KEY = 'kidslab.sound.muted';

  // Stage 3: guided action sequence for 7 + 5 = 12
  const PLAY_STEPS = [
    { expect: 'fetch', op: 'LOAD 4' },
    { expect: 'load', addr: 4, value: 7 },
    { expect: 'fetch', op: 'ADD 5' },
    { expect: 'load', addr: 5, value: 5 },
    { expect: 'calc', mode: 'add', value: 5 },
    { expect: 'fetch', op: 'STORE 6' },
    { expect: 'calc', mode: 'store', addr: 6 },
    { expect: 'fetch', op: 'HALT' },
    { expect: 'calc', mode: 'halt' },
  ];

  const $ = (sel) => document.querySelector(sel);
  const el = {
    lang: $('#langBtn'),
    theme: $('#themeBtn'),
    sound: $('#soundBtn'),
    reset: $('#resetBtn'),
    phaseChip: $('#phaseChip'),
    dots: $('#levelDots'),
    watch: $('#watchLabel'),
    mission: $('#missionTitle'),
    cue: $('#missionCue'),
    arena: $('#arena'),
    prompt: $('#prompt'),
    action: $('#actionBtn'),
    actionLabel: $('#actionLabel'),
    choiceRow: $('#choiceRow'),
    hintBubble: $('#hintBubble'),
    fx: $('#fxLayer'),
    modal: $('#modal'),
    modalMagic: $('#modalMagic'),
    modalTitle: $('#modalTitle'),
    modalBody: $('#modalBody'),
    next: $('#nextBtn'),
  };

  let t = (key) => key;
  let stage = 0;
  let unlocked = 0;
  let quizIndex = 0;
  let promptType = '';
  let hintTimer = 0;
  let bubbleTimer = 0;
  let audioContext = null;
  let muted = false;
  let busy = false;
  let animToken = 0;

  let machine = freshMachine();
  let fdePhase = 'idle';
  let fdeInstrIndex = 0;
  let decodeText = '';
  let playStep = 0;
  let focusParts = null; // null | Set of part ids

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

  function freshMachine() {
    const mem = Array.from({ length: 7 }, () => ({ kind: 'empty', text: '?', value: 0 }));
    DEMO_PROGRAM.forEach((text, i) => {
      mem[i] = { kind: 'code', text, value: 0 };
    });
    Object.entries(DEMO_DATA).forEach(([addr, value]) => {
      mem[Number(addr)] = { kind: 'data', text: String(value), value };
    });
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
      linkHot: false,
      outLit: false,
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

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function kidOp(text) {
    return t('opKid')[text] || text;
  }

  function setPrompt(message, type = '') {
    el.prompt.textContent = message;
    promptType = type;
    el.prompt.classList.toggle('is-error', type === 'error');
    el.prompt.classList.toggle('is-success', type === 'success');
  }

  function showToast(message) {
    const old = el.arena.querySelector('.toast');
    if (old) old.remove();
    const node = document.createElement('div');
    node.className = 'toast';
    node.textContent = message;
    el.arena.appendChild(node);
    window.setTimeout(() => node.remove(), 1200);
  }

  function showBubble(message) {
    el.hintBubble.hidden = false;
    el.hintBubble.textContent = message;
    clearTimeout(bubbleTimer);
    bubbleTimer = window.setTimeout(() => {
      el.hintBubble.hidden = true;
    }, 2800);
  }

  function scheduleHint() {
    clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      if (!el.modal.hidden || busy) return;
      showBubble(t('hints')[stage]);
    }, 5000);
  }

  function centerOf(node) {
    if (!node) {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
    const r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function flyPacket(label, fromNode, toNode, ms = 420) {
    return new Promise((resolve) => {
      const from = centerOf(fromNode);
      const to = centerOf(toNode);
      const packet = document.createElement('div');
      packet.className = 'packet';
      packet.textContent = label;
      packet.style.left = `${from.x}px`;
      packet.style.top = `${from.y}px`;
      el.fx.appendChild(packet);
      tone('bus');
      requestAnimationFrame(() => {
        packet.style.left = `${to.x}px`;
        packet.style.top = `${to.y}px`;
      });
      window.setTimeout(() => {
        packet.classList.add('is-gone');
        window.setTimeout(() => {
          packet.remove();
          resolve();
        }, 180);
      }, ms);
    });
  }

  function displayCell(cell) {
    if (!cell || cell.kind === 'empty') return '?';
    if (cell.kind === 'data') return String(cell.value);
    return kidOp(cell.text);
  }

  function applyOp(state, text) {
    const parts = String(text).trim().split(/\s+/);
    const op = (parts[0] || '').toUpperCase();
    const arg = parts[1] !== undefined ? Number(parts[1]) : null;
    const next = {
      ...state,
      mem: state.mem.map((cell) => ({ ...cell })),
      hotPart: 'cpu',
      hotReg: 'a',
      touchAddr: -1,
      linkHot: false,
    };

    if (op === 'LOAD' && Number.isFinite(arg)) {
      const val = next.mem[arg]?.value ?? 0;
      next.a = val;
      next.touchAddr = arg;
      next.hotPart = 'mem';
      next.linkHot = true;
      return { state: next, kind: 'load', addr: arg, value: val };
    }
    if (op === 'ADD' && Number.isFinite(arg)) {
      const val = next.mem[arg]?.value ?? 0;
      next.a += val;
      next.touchAddr = arg;
      next.hotPart = 'mem';
      next.linkHot = true;
      return { state: next, kind: 'add', addr: arg, value: val, result: next.a };
    }
    if (op === 'STORE' && Number.isFinite(arg)) {
      next.mem[arg] = { kind: 'data', text: String(next.a), value: next.a };
      next.touchAddr = arg;
      next.hotPart = 'mem';
      next.linkHot = true;
      return { state: next, kind: 'store', addr: arg, value: next.a };
    }
    if (op === 'HALT') {
      next.halted = true;
      next.hotReg = '';
      next.out = next.a;
      next.outLit = true;
      next.hotPart = 'output';
      return { state: next, kind: 'halt', value: next.a };
    }
    return { state: next, kind: 'noop' };
  }

  function renderDots() {
    el.dots.innerHTML = [0, 1, 2].map((index) =>
      `<button class="dot ${index === stage ? 'is-active' : ''} ${index < unlocked ? 'is-done' : ''}" type="button" data-level="${index}" aria-label="${t('levels')[index]}" ${index > unlocked ? 'disabled' : ''}></button>`).join('');
    el.dots.querySelectorAll('[data-level]').forEach((btn) => {
      btn.addEventListener('click', () => setStage(Number(btn.dataset.level)));
    });
  }

  function deviceClass(id, extra = '') {
    const dim = focusParts && !focusParts.has(id) ? 'is-dim' : '';
    const hot = machine.hotPart === id ? 'is-hot' : '';
    const target = stage === 0 && QUIZ[quizIndex] === id ? 'is-target' : '';
    return `device device--${id === 'input' ? 'in' : id === 'output' ? 'out' : id} ${dim} ${hot} ${target} ${extra}`.trim();
  }

  function renderMemGrid() {
    return `<div class="mem-grid">${machine.mem.map((cell, addr) => {
      const cls = [
        'cell',
        cell.kind === 'code' ? 'is-code' : '',
        cell.kind === 'data' ? 'is-data' : '',
        addr === machine.pc ? 'is-pc' : '',
        addr === machine.touchAddr ? 'is-touch' : '',
      ].filter(Boolean).join(' ');
      return `<div class="${cls}" data-cell="${addr}"><b>${addr}</b><code>${displayCell(cell)}</code></div>`;
    }).join('')}</div>`;
  }

  function renderCpuBody() {
    const irShow = !machine.ir || machine.ir === '—' ? t('outDash') : kidOp(machine.ir);
    return `
      <div class="regs">
        <div class="reg ${machine.hotReg === 'pc' ? 'is-hot' : ''}" data-reg="pc"><span>${t('regPc')}</span><strong>${machine.pc}</strong></div>
        <div class="reg ${machine.hotReg === 'ir' ? 'is-hot' : ''}" data-reg="ir"><span>${t('regIr')}</span><code>${irShow}</code></div>
        <div class="reg ${machine.hotReg === 'a' ? 'is-hot' : ''}" data-reg="a"><span>${t('regA')}</span><strong data-notebook>${machine.a}</strong></div>
      </div>
      <div class="decode-flash ${decodeText ? 'is-on' : ''}" data-decode>${decodeText || ''}</div>`;
  }

  function renderFullComputer(interactiveParts = false) {
    const names = t('partNames');
    const icons = t('partIcons');
    const tag = (id) => interactiveParts ? '' : `<span class="device__tag">${names[id]}</span>`;
    const wrap = (id, body) => interactiveParts
      ? `<button class="${deviceClass(id)}" type="button" data-part="${id}" aria-label="${names[id]}">
          <span class="device__icon" aria-hidden="true">${icons[id]}</span>
          <span class="device__name">${names[id]}</span>
          ${body}
        </button>`
      : `<div class="${deviceClass(id)}" data-part="${id}">
          <span class="device__icon" aria-hidden="true">${icons[id]}</span>
          <span class="device__name">${names[id]}</span>
          ${tag(id)}
          ${body}
        </div>`;

    const inBody = `<div class="io-value" data-io="in">${t('inDemo')}</div>`;
    const outVal = machine.out === null || machine.out === undefined ? t('outDash') : machine.out;
    const outBody = `<div class="io-value ${machine.outLit ? 'is-lit' : ''}" data-io="out">${outVal}</div>`;
    const cpuBody = `<div class="device__body">${renderCpuBody()}</div>`;
    const memBody = `<div class="device__body">${renderMemGrid()}</div>`;
    const linkHot = machine.linkHot ? 'is-hot' : '';

    return `
      <div class="stage">
        <div class="stage-grid">
          <div class="slot-mem">${wrap('mem', memBody)}</div>
          <div class="slot-link-v"><span class="flow-arrow ${linkHot}" aria-hidden="true">↕</span></div>
          <div class="slot-in">${wrap('input', inBody)}</div>
          <div class="slot-arr-l"><span class="flow-arrow" aria-hidden="true">→</span></div>
          <div class="slot-cpu">${wrap('cpu', cpuBody)}</div>
          <div class="slot-arr-r"><span class="flow-arrow" aria-hidden="true">→</span></div>
          <div class="slot-out">${wrap('output', outBody)}</div>
        </div>
      </div>`;
  }

  function renderPlayComputer() {
    const names = t('partNames');
    const icons = t('partIcons');
    const phase = fdePhase === 'idle' ? 'idle' : fdePhase;
    const linkHot = machine.linkHot ? 'is-hot' : '';
    const outVal = machine.out === null || machine.out === undefined ? t('outDash') : machine.out;
    return `
      <div class="stage">
        <div class="phase-bar" aria-hidden="true">
          <span class="phase-pill ${phase === 'fetch' ? 'is-active' : ''} ${['decode', 'execute', 'done'].includes(phase) || fdeInstrIndex > 0 ? 'is-done' : ''}">${t('phaseFetch')}</span>
          <span class="phase-pill ${phase === 'decode' ? 'is-active' : ''} ${['execute', 'done'].includes(phase) ? 'is-done' : ''}">${t('phaseDecode')}</span>
          <span class="phase-pill ${phase === 'execute' ? 'is-active' : ''} ${phase === 'done' ? 'is-done' : ''}">${t('phaseExecute')}</span>
        </div>
        <div class="play-grid">
          <div class="${deviceClass('mem')}" data-part="mem">
            <span class="device__icon" aria-hidden="true">${icons.mem}</span>
            <span class="device__name">${names.mem}</span>
            <div class="device__body">${renderMemGrid()}</div>
          </div>
          <div class="play-link ${linkHot}" aria-hidden="true">↔</div>
          <div class="${deviceClass('cpu')}" data-part="cpu">
            <span class="device__icon" aria-hidden="true">${icons.cpu}</span>
            <span class="device__name">${names.cpu}</span>
            <div class="device__body">${renderCpuBody()}</div>
          </div>
        </div>
        <div class="${deviceClass('output')}" data-part="output" style="width:min(220px,100%);margin-top:4px">
          <span class="device__icon" aria-hidden="true">${icons.output}</span>
          <span class="device__name">${names.output}</span>
          <div class="io-value ${machine.outLit ? 'is-lit' : ''}" data-io="out">${outVal}</div>
        </div>
      </div>`;
  }

  function renderQuiz() {
    const names = t('partNames');
    const icons = t('partIcons');
    const done = new Set(QUIZ.slice(0, quizIndex));
    const order = ['input', 'cpu', 'mem', 'output'];
    el.arena.innerHTML = `
      <div class="stage">
        <div class="quiz-grid">
          ${order.map((id) => `
            <button class="quiz-tile quiz-tile--${id === 'input' ? 'in' : id === 'output' ? 'out' : id} ${QUIZ[quizIndex] === id ? 'is-target' : ''} ${done.has(id) ? 'is-done' : ''}" type="button" data-part="${id}" aria-label="${names[id]}">
              <span class="device__icon" aria-hidden="true">${icons[id]}</span>
              <span class="device__name">${names[id]}</span>
            </button>`).join('')}
        </div>
      </div>`;
    el.arena.querySelectorAll('[data-part]').forEach((btn) => {
      btn.addEventListener('click', () => onPartTap(btn.dataset.part, btn));
    });
  }

  function renderArena() {
    if (stage === 0) {
      renderQuiz();
      return;
    }
    if (stage === 1) {
      el.arena.innerHTML = renderPlayComputer();
      return;
    }
    // stage 2 — full computer, you are CPU
    focusParts = null;
    const names = t('partNames');
    const icons = t('partIcons');
    const outVal = machine.out === null || machine.out === undefined ? t('outDash') : machine.out;
    const linkHot = machine.linkHot ? 'is-hot' : '';
    el.arena.innerHTML = `
      <div class="stage">
        <div class="you-badge">🧠 ${t('playYou')}</div>
        <div class="stage-grid">
          <div class="slot-mem">
            <div class="${deviceClass('mem')}" data-part="mem">
              <span class="device__icon" aria-hidden="true">${icons.mem}</span>
              <span class="device__name">${names.mem}</span>
              <div class="device__body">${renderMemGrid()}</div>
            </div>
          </div>
          <div class="slot-link-v"><span class="flow-arrow ${linkHot}" aria-hidden="true">↕</span></div>
          <div class="slot-in">
            <div class="${deviceClass('input')}" data-part="input">
              <span class="device__icon" aria-hidden="true">${icons.input}</span>
              <span class="device__name">${names.input}</span>
              <div class="io-value" data-io="in">${t('inDemo')}</div>
            </div>
          </div>
          <div class="slot-arr-l"><span class="flow-arrow" aria-hidden="true">→</span></div>
          <div class="slot-cpu">
            <div class="${deviceClass('cpu')}" data-part="cpu">
              <span class="device__icon" aria-hidden="true">${icons.cpu}</span>
              <span class="device__name">${names.cpu}</span>
              <div class="device__body">${renderCpuBody()}</div>
            </div>
          </div>
          <div class="slot-arr-r"><span class="flow-arrow" aria-hidden="true">→</span></div>
          <div class="slot-out">
            <div class="${deviceClass('output')}" data-part="output">
              <span class="device__icon" aria-hidden="true">${icons.output}</span>
              <span class="device__name">${names.output}</span>
              <div class="io-value ${machine.outLit ? 'is-lit' : ''}" data-io="out">${outVal}</div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderActions() {
    if (stage === 0) {
      el.action.hidden = true;
      el.choiceRow.hidden = true;
      el.choiceRow.innerHTML = '';
      return;
    }
    if (stage === 1) {
      el.choiceRow.hidden = true;
      el.choiceRow.innerHTML = '';
      el.action.hidden = false;
      el.action.disabled = busy || fdePhase === 'done';
      el.actionLabel.textContent = t('stepNext');
      return;
    }
    el.action.hidden = true;
    el.choiceRow.hidden = false;
    const disabled = busy || playStep >= PLAY_STEPS.length ? 'disabled' : '';
    el.choiceRow.innerHTML = `
      <button class="choice" type="button" data-act="fetch" ${disabled}>${t('actFetch')}</button>
      <button class="choice" type="button" data-act="load" ${disabled}>${t('actLoad')}</button>
      <button class="choice" type="button" data-act="calc" ${disabled}>${t('actCalc')}</button>`;
    el.choiceRow.querySelectorAll('[data-act]').forEach((btn) => {
      btn.addEventListener('click', () => onPlayChoice(btn.dataset.act, btn));
    });
  }

  function render() {
    document.body.dataset.stage = String(stage);
    el.watch.textContent = t('watchLabels')[stage];
    el.mission.textContent = stage === 0 ? t('quizAsks')[quizIndex] : t('missions')[stage];
    el.cue.textContent = t('cues')[stage];
    el.phaseChip.textContent = `${stage + 1} / 3`;
    el.sound.textContent = muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-label', muted ? t('soundOff') : t('soundOn'));
    el.sound.setAttribute('aria-pressed', String(muted));
    el.theme.setAttribute('aria-label', t('theme'));
    el.reset.setAttribute('aria-label', t('reset'));
    el.prompt.classList.toggle('is-error', promptType === 'error');
    el.prompt.classList.toggle('is-success', promptType === 'success');

    renderDots();
    renderArena();
    renderActions();
  }

  async function onPartTap(part, btn) {
    if (stage !== 0 || !el.modal.hidden || busy) return;
    const expect = QUIZ[quizIndex];
    if (part === expect) {
      busy = true;
      tone('correct');
      btn.classList.add('is-correct');
      window.cool?.track?.('identify_part', { value: quizIndex + 1 });
      showToast(t('quizOk')[part]);
      setPrompt(t('quizOk')[part], 'success');
      await wait(700);
      quizIndex += 1;
      busy = false;
      if (quizIndex >= QUIZ.length) {
        completeStage(t('quizDoneTitle'), simpleBody(t('quizDoneText')), '🖥️✨', false);
      } else {
        promptType = '';
        setPrompt(t('starts')[0]);
        render();
        scheduleHint();
      }
      return;
    }
    tone('wrong');
    btn.classList.add('is-wrong');
    window.setTimeout(() => btn.classList.remove('is-wrong'), 350);
    setPrompt(t('quizBad'), 'error');
    window.cool?.track?.('wrong_part');
    scheduleHint();
  }

  function simpleBody(text) {
    return `<p>${text}</p>`;
  }

  function summaryBody() {
    const flow = t('summaryFlow');
    const kids = t('summaryKids');
    const formal = t('summaryFormal');
    return `
      <div class="summary-flow">
        ${flow.map((item, i) => `<span style="animation-delay:${i * 0.12}s">${item}${i < flow.length - 1 ? ' ↓' : ''}</span>`).join('')}
      </div>
      <p>${t('playDoneLine')}</p>
      <div class="summary-terms">
        ${kids.map((item, i) => `<span class="term" style="animation-delay:${0.5 + i * 0.15}s">${item}</span>`).join('')}
      </div>
      <div class="summary-terms">
        ${formal.map((item, i) => `<span class="term term--formal" style="animation-delay:${1.1 + i * 0.15}s">${item}</span>`).join('')}
      </div>`;
  }

  async function stepFde() {
    if (stage !== 1 || fdePhase === 'done' || busy) return;
    const token = ++animToken;
    busy = true;
    el.action.disabled = true;

    try {
      if (fdePhase === 'idle' || fdePhase === 'execute') {
        if (machine.halted || fdeInstrIndex >= DEMO_PROGRAM.length) {
          fdePhase = 'done';
          setPrompt(t('fdePrompt').done, 'success');
          completeStage(t('fdeDoneTitle'), simpleBody(t('fdeDoneText')), '⚙️✨', false);
          return;
        }

        // ① fetch
        fdePhase = 'fetch';
        decodeText = '';
        machine.hotPart = 'mem';
        machine.hotReg = 'pc';
        machine.touchAddr = machine.pc;
        machine.linkHot = true;
        const ir = machine.mem[machine.pc]?.text || '???';
        setPrompt(t('fdePrompt').fetch);
        render();
        const cell = el.arena.querySelector(`[data-cell="${machine.pc}"]`);
        const cpu = el.arena.querySelector('[data-part="cpu"]');
        await flyPacket(kidOp(ir), cell, cpu);
        if (token !== animToken) return;

        machine.ir = ir;
        machine.hotPart = 'cpu';
        machine.hotReg = 'ir';
        machine.touchAddr = -1;
        machine.linkHot = false;
        render();
        tone('correct');
        window.cool?.track?.('fde_fetch');
        busy = false;
        renderActions();
        scheduleHint();
        return;
      }

      if (fdePhase === 'fetch') {
        // ② decode
        fdePhase = 'decode';
        machine.hotPart = 'cpu';
        machine.hotReg = 'ir';
        machine.linkHot = false;
        decodeText = t('decodeMap')[machine.ir] || '';
        setPrompt(t('fdePrompt').decode);
        render();
        tone('tap');
        window.cool?.track?.('fde_decode');
        await wait(650);
        if (token !== animToken) return;
        busy = false;
        renderActions();
        scheduleHint();
        return;
      }

      if (fdePhase === 'decode') {
        // ③ execute
        fdePhase = 'execute';
        decodeText = '';
        const before = machine;
        const { state, kind, addr, value } = applyOp(machine, machine.ir);
        setPrompt(t('fdePrompt').execute);

        if (kind === 'load' || kind === 'add') {
          machine = {
            ...before,
            ir: before.ir,
            hotPart: 'mem',
            hotReg: 'a',
            touchAddr: addr,
            linkHot: true,
          };
          render();
          const cell = el.arena.querySelector(`[data-cell="${addr}"]`);
          const note = el.arena.querySelector('[data-notebook]') || el.arena.querySelector('[data-part="cpu"]');
          await flyPacket(String(value), cell, note);
          if (token !== animToken) return;
          machine = state;
          machine.hotReg = 'a';
          machine.hotPart = 'cpu';
          machine.linkHot = false;
          if (kind === 'add') {
            decodeText = `${state.a - value} + ${value} = ${state.a}`;
          }
          render();
          tone('correct');
        } else if (kind === 'store') {
          machine = {
            ...before,
            ir: before.ir,
            a: before.a,
            hotPart: 'cpu',
            hotReg: 'a',
            linkHot: true,
          };
          render();
          const note = el.arena.querySelector('[data-notebook]') || el.arena.querySelector('[data-part="cpu"]');
          const cell = el.arena.querySelector(`[data-cell="${addr}"]`);
          await flyPacket(String(before.a), note, cell);
          if (token !== animToken) return;
          machine = state;
          machine.hotPart = 'mem';
          machine.linkHot = false;
          render();
          tone('correct');
        } else if (kind === 'halt') {
          machine = {
            ...before,
            ir: before.ir,
            a: before.a,
            hotPart: 'cpu',
            hotReg: 'a',
            linkHot: true,
          };
          render();
          const cpu = el.arena.querySelector('[data-part="cpu"]');
          const out = el.arena.querySelector('[data-io="out"]') || el.arena.querySelector('[data-part="output"]');
          await flyPacket(String(before.a), cpu, out);
          if (token !== animToken) return;
          machine = state;
          machine.hotPart = 'output';
          machine.outLit = true;
          machine.out = before.a;
          render();
          showToast(String(before.a));
          tone('complete');
        } else {
          machine = state;
          render();
          tone('tap');
        }

        if (!machine.halted) {
          machine.pc += 1;
          machine.hotReg = 'pc';
        }
        fdeInstrIndex += 1;
        window.cool?.track?.('fde_execute');
        render();

        if (machine.halted) {
          fdePhase = 'done';
          setPrompt(t('fdePrompt').done, 'success');
          await wait(500);
          if (token !== animToken) return;
          completeStage(t('fdeDoneTitle'), simpleBody(t('fdeDoneText')), '⚙️✨', false);
        }
      }
    } finally {
      if (token === animToken) {
        busy = false;
        renderActions();
        scheduleHint();
      }
    }
  }

  async function onPlayChoice(act, btn) {
    if (stage !== 2 || busy || playStep >= PLAY_STEPS.length) return;
    const step = PLAY_STEPS[playStep];
    if (act !== step.expect) {
      tone('wrong');
      btn.classList.add('is-wrong');
      window.setTimeout(() => btn.classList.remove('is-wrong'), 350);
      setPrompt(t('playBad')[step.expect], 'error');
      window.cool?.track?.('wrong_cpu_action');
      scheduleHint();
      return;
    }

    const token = ++animToken;
    busy = true;
    renderActions();
    tone('correct');
    setPrompt(t('playOk')[act], 'success');

    try {
      if (step.expect === 'fetch') {
        machine.hotPart = 'mem';
        machine.hotReg = 'pc';
        machine.touchAddr = machine.pc;
        machine.linkHot = true;
        machine.ir = step.op;
        render();
        const cell = el.arena.querySelector(`[data-cell="${machine.pc}"]`);
        const cpu = el.arena.querySelector('[data-part="cpu"]');
        await flyPacket(kidOp(step.op), cell, cpu);
        if (token !== animToken) return;
        machine.hotPart = 'cpu';
        machine.hotReg = 'ir';
        machine.touchAddr = -1;
        machine.linkHot = false;
        decodeText = t('decodeMap')[step.op] || '';
        render();
        await wait(500);
        decodeText = '';
      } else if (step.expect === 'load') {
        machine.hotPart = 'mem';
        machine.touchAddr = step.addr;
        machine.linkHot = true;
        render();
        const cell = el.arena.querySelector(`[data-cell="${step.addr}"]`);
        const note = el.arena.querySelector('[data-notebook]') || el.arena.querySelector('[data-part="cpu"]');
        await flyPacket(String(step.value), cell, note);
        if (token !== animToken) return;
        if (machine.ir === 'LOAD 4') machine.a = step.value;
        // for ADD path, keep a until calc
        machine.hotPart = 'cpu';
        machine.hotReg = 'a';
        machine.touchAddr = -1;
        machine.linkHot = false;
        render();
      } else if (step.expect === 'calc') {
        if (step.mode === 'add') {
          const before = machine.a;
          decodeText = `${before} + ${step.value}`;
          machine.hotPart = 'cpu';
          machine.hotReg = 'a';
          render();
          await wait(450);
          if (token !== animToken) return;
          machine.a = before + step.value;
          decodeText = `${before} + ${step.value} = ${machine.a}`;
          render();
          await wait(500);
          decodeText = '';
        } else if (step.mode === 'store') {
          machine.hotPart = 'cpu';
          machine.hotReg = 'a';
          machine.linkHot = true;
          render();
          const note = el.arena.querySelector('[data-notebook]') || el.arena.querySelector('[data-part="cpu"]');
          const cell = el.arena.querySelector(`[data-cell="${step.addr}"]`);
          await flyPacket(String(machine.a), note, cell);
          if (token !== animToken) return;
          machine.mem[step.addr] = { kind: 'data', text: String(machine.a), value: machine.a };
          machine.touchAddr = step.addr;
          machine.hotPart = 'mem';
          machine.linkHot = false;
          render();
        } else if (step.mode === 'halt') {
          machine.halted = true;
          machine.out = machine.a;
          machine.outLit = true;
          machine.hotPart = 'output';
          render();
          const cpu = el.arena.querySelector('[data-part="cpu"]');
          const out = el.arena.querySelector('[data-io="out"]') || el.arena.querySelector('[data-part="output"]');
          await flyPacket(String(machine.a), cpu, out);
          if (token !== animToken) return;
          render();
        }
        if (!machine.halted && (step.mode === 'add' || step.mode === 'store' || machine.ir.startsWith('LOAD'))) {
          // advance PC after finishing an instruction's last action
        }
      }

      // advance PC after completing an instruction
      const finishedInstruction =
        (step.expect === 'load' && machine.ir.startsWith('LOAD'))
        || (step.expect === 'calc' && (step.mode === 'add' || step.mode === 'store' || step.mode === 'halt'));
      if (finishedInstruction && !machine.halted) {
        machine.pc += 1;
        machine.hotReg = 'pc';
        render();
      } else if (step.expect === 'load' && machine.ir.startsWith('ADD')) {
        // number staged for add; wait for calc
        render();
      }

      playStep += 1;
      window.cool?.track?.('cpu_action', { value: playStep });

      if (playStep >= PLAY_STEPS.length || machine.halted && step.mode === 'halt') {
        setPrompt(t('fdePrompt').done, 'success');
        await wait(400);
        completeStage(t('playDoneTitle'), summaryBody(), '🎉🖥️', true);
      } else {
        promptType = '';
        setPrompt(t('playAsk'));
        render();
      }
    } finally {
      if (token === animToken) {
        busy = false;
        renderActions();
        scheduleHint();
      }
    }
  }

  function completeStage(title, bodyHtml, magic, finalSummary) {
    if (stage < 2) {
      unlocked = Math.max(unlocked, stage + 1);
      persist();
    } else {
      window.cool?.complete?.();
    }
    window.cool?.stage?.(stage === 0 ? 'parts' : stage === 1 ? 'fde' : 'program');
    el.modalMagic.textContent = magic;
    el.modalTitle.textContent = title;
    el.modalBody.innerHTML = bodyHtml;
    el.next.textContent = stage === 2 ? t('replay') : t('next');
    el.modal.hidden = false;
    tone('complete');
    renderDots();
    if (finalSummary) {
      // already animated via CSS delays in summaryBody
    }
  }

  function resetStageState() {
    animToken += 1;
    busy = false;
    quizIndex = 0;
    fdePhase = 'idle';
    fdeInstrIndex = 0;
    decodeText = '';
    playStep = 0;
    focusParts = stage === 1 ? new Set(['cpu', 'mem']) : null;
    machine = freshMachine();
    promptType = '';
    el.hintBubble.hidden = true;
    el.fx.innerHTML = '';
    setPrompt(stage === 2 ? t('playAsk') : t('starts')[stage]);
  }

  function setStage(next) {
    if (next > unlocked) {
      setPrompt(t('locked'), 'error');
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

  el.lang?.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme?.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.sound?.addEventListener('click', () => {
    muted = !muted;
    try { localStorage.setItem(MUTE_KEY, String(muted)); } catch { /* optional */ }
    render();
  });
  el.reset?.addEventListener('click', () => {
    resetStageState();
    render();
    tone('tap');
    scheduleHint();
  });
  el.action?.addEventListener('click', () => { stepFde(); });
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
      if (!promptType) setPrompt(stage === 2 ? t('playAsk') : t('starts')[stage]);
      render();
    },
  });

  resetStageState();
  scheduleHint();
})();
