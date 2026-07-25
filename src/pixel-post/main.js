(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '🖼️ 像素邮局 · KidsLab',
      back: '返回平台',
      title: '像素邮局',
      eyebrow: '今日特快：寄出一张图',
      meterLabel: '电报码',
      workbench: '你的发报台',
      shiftPassed: '分拣任务完成',
      soundOn: '关闭音效',
      soundOff: '开启音效',
      theme: '切换主题',
      reset: '重新开始',
      hint: '提示',
      levels: ['装箱', '收报', '压缩'],
      shiftLabels: ['第一站 · 画面装箱', '第二站 · 数字收报', '第三站 · 省字挑战'],
      missions: ['复制爱心邮票', '把 0 和 1 还原成图', '用短报码寄得更省'],
      tips: [
        '照着邮票点亮格子。每个小格就是一个像素。',
        '数字 1 代表深色像素，0 代表空白像素。',
        '把连续相同的像素写成“几个 × 哪一种”，这就是行程长度编码。',
      ],
      sceneLabels: ['原图邮票', '电报机收到', '待压缩的一行'],
      workTitles: ['点亮同样的格子', '按数字还原这一行', '选出正确的短报码'],
      actionLabels: ['交给邮差', '核对这一行', '等待选择'],
      counters: ['格', '行', '题'],
      starts: [
        '可以点，也可以按住手指划过格子。',
        '从左到右读八码：1 涂深色，0 留空白。',
        '先数连续的 0，再数连续的 1；颜色一变就另起一段。',
      ],
      hints: [
        '淡红格是定位纸，不是答案。对照左边邮票，亮错了再点一次即可擦掉。',
        '每个数字正好对应下面一个格子。看到 1 就把同位置点亮。',
        '例如 00001111 可以写成 4×0 · 4×1。交替越多，段数越多。',
      ],
      sampleAria: '爱心邮票原图',
      paintGridAria: '可编辑的八乘八像素格',
      pixelLabel: (row, column, on) => `第 ${row} 行第 ${column} 格，当前${on ? '深色' : '空白'}`,
      rawBits: '8 个原始数字',
      rowRound: (round, total) => `第 ${round} / ${total} 行`,
      rleRound: (round, total) => `第 ${round} / ${total} 题`,
      wrongStamp: (missing, extra) => `还有 ${missing} 格没点亮，${extra} 格点多了。对照原图继续改，不会清空。`,
      stampSuccess: '完全一致！不管图案是什么，电脑看到的都是 64 个有位置的小格。',
      stampTitle: '邮票装进了 64 个格子！',
      stampModal: '这张图由 8×8=64 个像素组成。像素像小方砖，每个位置记录自己的颜色，合起来才变成完整图案。',
      wrongRow: '这一行还没有对上。按数字逐格检查：1 是深色，0 是空白。',
      rowSuccess: (bits) => `${bits} 已还原。数字没有画笔，也能把一行图传到远方。`,
      rowsDone: '三行都收对了！只要双方约定好格子顺序，0 和 1 就能重新拼回图像。',
      rowsTitle: '小猫从电报里出现了！',
      rowsModal: '发件人按从左到右的顺序发送每个像素，收件人照同样顺序还原。图像因此可以变成数字，再从数字变回图像。',
      wrongRle: '这段报码不匹配。每当数字从 0 变 1 或从 1 变 0，就要开始一个新段。',
      rleSuccess: (raw, runs) => `${raw} 被写成 ${runs} 段。连续得越整齐，通常省得越多。`,
      noSaving: '这一行不断交替，压缩后有 8 段，反而不比原来的 8 个数字短。',
      completeTitle: '电报费砍半，包裹发车！',
      completeModal: '行程长度编码（RLE）记录“连续几个相同值”。大片相同颜色很省字；像 01010101 这样不断变化的图，压缩可能没有优势。',
      next: '下一站',
      replay: '再开一班',
      locked: '先完成前一站。',
      postalComplete: '像素 → 数字 → 短报码，一张图已经穿过电报线。',
    },
    en: {
      doc: '🖼️ Pixel Post Office · KidsLab',
      back: 'Back to platform',
      title: 'Pixel Post Office',
      eyebrow: "Today's express: mail a picture",
      meterLabel: 'Telegram',
      workbench: 'Your telegraph desk',
      shiftPassed: 'Sorting task complete',
      soundOn: 'Mute sound',
      soundOff: 'Turn sound on',
      theme: 'Switch theme',
      reset: 'Restart',
      hint: 'Hint',
      levels: ['Pack', 'Receive', 'Compress'],
      shiftLabels: ['Stop 1 · Pack the picture', 'Stop 2 · Receive the digits', 'Stop 3 · Save symbols'],
      missions: ['Copy the heart stamp', 'Turn 0s and 1s back into art', 'Send a shorter telegram'],
      tips: [
        'Light the same squares as the stamp. Each little square is one pixel.',
        'A 1 means a dark pixel. A 0 means an empty pixel.',
        'Write a run of matching pixels as “how many × which value.” This is run-length encoding.',
      ],
      sceneLabels: ['Original stamp', 'Telegraph received', 'Row to compress'],
      workTitles: ['Light the matching squares', 'Rebuild this row from digits', 'Choose the correct short code'],
      actionLabels: ['Give to postie', 'Check this row', 'Choose an answer'],
      counters: ['cells', 'rows', 'tasks'],
      starts: [
        'Tap cells, or hold and sweep your finger across them.',
        'Read the eight digits from left to right: fill 1 and leave 0 empty.',
        'Count the run of 0s, then the run of 1s. Start a new run whenever the value changes.',
      ],
      hints: [
        'The pale red cells are guide paper, not answers. Compare with the stamp and tap again to erase mistakes.',
        'Each digit lines up with one cell below. Fill the cell wherever you see a 1.',
        'For example, 00001111 becomes 4×0 · 4×1. More switching means more runs.',
      ],
      sampleAria: 'Original heart stamp',
      paintGridAria: 'Editable eight by eight pixel grid',
      pixelLabel: (row, column, on) => `Row ${row}, column ${column}, currently ${on ? 'dark' : 'empty'}`,
      rawBits: '8 raw digits',
      rowRound: (round, total) => `Row ${round} of ${total}`,
      rleRound: (round, total) => `Task ${round} of ${total}`,
      wrongStamp: (missing, extra) => `${missing} cells are still missing and ${extra} extra cells are lit. Keep editing; your work stays put.`,
      stampSuccess: 'Perfect match! Whatever the picture shows, a computer sees 64 positioned little cells.',
      stampTitle: 'The stamp fits into 64 cells!',
      stampModal: 'This picture contains 8×8=64 pixels. Pixels are tiny tiles: each position stores a color, and together they form the whole image.',
      wrongRow: 'This row does not match yet. Check one digit at a time: 1 is dark and 0 is empty.',
      rowSuccess: (bits) => `${bits} rebuilt. Digits can carry a line of art without a paintbrush.`,
      rowsDone: 'All three rows received! When both ends use the same cell order, 0s and 1s can rebuild a picture.',
      rowsTitle: 'A cat appeared from the telegram!',
      rowsModal: 'The sender transmits each pixel from left to right, and the receiver restores them in the same order. A picture becomes digits, then becomes a picture again.',
      wrongRle: 'That code does not match. Start a new run every time the value switches from 0 to 1 or 1 to 0.',
      rleSuccess: (raw, runs) => `${raw} became ${runs} runs. Long, tidy runs usually save more space.`,
      noSaving: 'This row alternates constantly, so the code has 8 runs and is no shorter than the original 8 digits.',
      completeTitle: 'Half the telegram cost—parcel away!',
      completeModal: 'Run-length encoding (RLE) records “how many matching values in a row.” Large solid areas compress well; a row like 01010101 may not get any shorter.',
      next: 'Next stop',
      replay: 'Open another shift',
      locked: 'Finish the previous stop first.',
      postalComplete: 'Pixels → digits → short code. One picture crossed the telegraph wire.',
    },
  };

  const STAMP = [
    '00000000',
    '01100110',
    '11111111',
    '11111111',
    '01111110',
    '00111100',
    '00011000',
    '00000000',
  ];
  const STAMP_BITS = STAMP.join('');
  const RECEIVE_ROWS = ['00111100', '01000010', '10100101'];
  const RLE_TASKS = [
    {
      bits: '00001111',
      correct: '4×0 · 4×1',
      options: ['4×0 · 4×1', '1×0 · 1×1', '4×1 · 4×0'],
    },
    {
      bits: '00111000',
      correct: '2×0 · 3×1 · 3×0',
      options: ['2×0 · 3×1 · 3×0', '2×0 · 3×1 · 2×0', '3×0 · 2×1 · 3×0'],
    },
    {
      bits: '01010101',
      correct: '1×0 · 1×1 · 1×0 · 1×1 · 1×0 · 1×1 · 1×0 · 1×1',
      options: [
        '4×0 · 4×1',
        '1×0 · 1×1 · 1×0 · 1×1 · 1×0 · 1×1 · 1×0 · 1×1',
        '8×(01)',
      ],
    },
  ];
  const SAVE_KEY = 'kidslab.pixel-post';
  const MUTE_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    lang: $('#langBtn'),
    theme: $('#themeBtn'),
    sound: $('#soundBtn'),
    tip: $('#tip'),
    levels: $('#levelStrip'),
    shift: $('#shiftLabel'),
    mission: $('#missionTitle'),
    sceneLabel: $('#sceneLabel'),
    sceneContent: $('#sceneContent'),
    workTitle: $('#workTitle'),
    workspace: $('#workspace'),
    counter: $('#counter'),
    feedback: $('#feedback'),
    hint: $('#hintBtn'),
    reset: $('#resetBtn'),
    action: $('#actionBtn'),
    actionLabel: $('#actionLabel'),
    meter: $('#meterValue'),
    meterUnit: $('#meterUnit'),
    modal: $('#modal'),
    modalMagic: $('#modalMagic'),
    modalTitle: $('#modalTitle'),
    modalText: $('#modalText'),
    next: $('#nextBtn'),
  };

  let t = (key) => key;
  let lang = window.cool.preferences.lang;
  let stage = 0;
  let unlocked = 0;
  let painted = new Set();
  let receiveRound = 0;
  let rowBits = new Set();
  let rleRound = 0;
  let wrongRle = '';
  let feedbackType = '';
  let hintTimer = 0;
  let audioContext = null;
  let muted = false;
  let dragActive = false;
  let dragValue = true;
  let dragVisited = new Set();

  try {
    muted = localStorage.getItem(MUTE_KEY) === 'true';
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (saved && Number.isInteger(saved.stage) && Number.isInteger(saved.unlocked)) {
      stage = Math.max(0, Math.min(2, saved.stage));
      unlocked = Math.max(stage, Math.min(2, saved.unlocked));
    }
  } catch {
    // Storage is optional; the activity remains playable in this tab.
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ stage, unlocked }));
    } catch {
      // Storage is optional.
    }
  }

  function ensureAudio() {
    if (muted) return null;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      audioContext ||= new AudioCtor();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      return audioContext;
    } catch {
      return null;
    }
  }

  function tone(kind) {
    const context = ensureAudio();
    if (!context) return;
    const patterns = {
      pixel: [[300, 0, .045, .035]],
      stamp: [[330, 0, .07, .045], [460, .07, .1, .05]],
      wrong: [[180, 0, .12, .045], [130, .1, .16, .04]],
      correct: [[420, 0, .08, .045], [560, .08, .13, .055]],
      complete: [[392, 0, .1, .045], [523, .1, .12, .055], [659, .21, .18, .065]],
    };
    const now = context.currentTime;
    for (const [frequency, offset, duration, volume] of patterns[kind] || patterns.pixel) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === 'wrong' ? 'square' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(volume, now + offset + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, now + offset + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration + .025);
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

  function renderLevels() {
    el.levels.innerHTML = t('levels').map((name, index) =>
      `<button class="level-button ${index === stage ? 'is-active' : ''} ${index < unlocked ? 'is-done' : ''}" type="button" data-level="${index}" ${index > unlocked ? 'disabled' : ''}>${index + 1}. ${name}</button>`).join('');
    el.levels.querySelectorAll('[data-level]').forEach((button) => {
      button.addEventListener('click', () => setStage(Number(button.dataset.level)));
    });
  }

  function pixelGrid(bits, options = {}) {
    const { editable = false, guide = false, sample = false } = options;
    const selected = editable ? painted : new Set([...bits].map((bit, index) => bit === '1' ? index : -1).filter((index) => index >= 0));
    const cells = Array.from({ length: 64 }, (_, index) => {
      const on = selected.has(index);
      const guided = guide && STAMP_BITS[index] === '1' && !on;
      if (!editable) return `<i class="pixel ${on ? 'is-on' : ''}" aria-hidden="true"></i>`;
      const row = Math.floor(index / 8) + 1;
      const column = (index % 8) + 1;
      return `<button class="pixel ${on ? 'is-on' : ''} ${guided ? 'is-guide' : ''}" type="button" data-pixel="${index}" aria-label="${t('pixelLabel', row, column, on)}" aria-pressed="${on}"></button>`;
    }).join('');
    return `<div class="pixel-grid ${sample ? 'pixel-grid--sample' : ''}" ${editable ? `id="paintGrid" aria-label="${t('paintGridAria')}"` : `role="img" aria-label="${t('sampleAria')}"`}>${cells}</div>`;
  }

  function renderStageZero() {
    el.sceneContent.innerHTML = pixelGrid(STAMP_BITS, { sample: true });
    el.workspace.innerHTML = pixelGrid(STAMP_BITS, { editable: true, guide: true });
    bindPaintGrid();
  }

  function renderStageOne() {
    const bits = RECEIVE_ROWS[receiveRound];
    el.sceneContent.innerHTML = `<div class="code-ticket">
      <span>${t('rowRound', receiveRound + 1, RECEIVE_ROWS.length)}</span>
      <code>${bits}</code>
      <small>${t('rawBits')}</small>
    </div>`;
    el.workspace.innerHTML = `<div class="row-editor">
      <div class="bit-row">${Array.from({ length: 8 }, (_, index) => {
        const on = rowBits.has(index);
        return `<button class="bit-cell ${on ? 'is-on' : ''}" type="button" data-bit-cell="${index}" aria-pressed="${on}">${on ? '1' : '0'}</button>`;
      }).join('')}</div>
      <div class="row-progress">${RECEIVE_ROWS.map((_, index) =>
        `<i class="${index < receiveRound ? 'is-done' : ''} ${index === receiveRound ? 'is-current' : ''}" aria-hidden="true"></i>`).join('')}</div>
    </div>`;
    el.workspace.querySelectorAll('[data-bit-cell]').forEach((button) => {
      button.addEventListener('click', () => toggleRowBit(Number(button.dataset.bitCell)));
    });
  }

  function renderStageTwo() {
    const task = RLE_TASKS[rleRound];
    el.sceneContent.innerHTML = `<div class="rle-strip">
      <div class="rle-strip__pixels">${[...task.bits].map((bit) => `<i class="${bit === '1' ? 'is-on' : ''}" aria-hidden="true"></i>`).join('')}</div>
      <code>${task.bits}</code>
    </div>`;
    el.workspace.innerHTML = `<div class="rle-options">${task.options.map((option) =>
      `<button class="rle-option ${wrongRle === option ? 'is-wrong' : ''}" type="button" data-rle="${option}">${option}</button>`).join('')}</div>`;
    el.workspace.querySelectorAll('[data-rle]').forEach((button) => {
      button.addEventListener('click', () => chooseRle(button.dataset.rle));
    });
  }

  function render() {
    el.tip.textContent = t('tips')[stage];
    el.shift.textContent = t('shiftLabels')[stage];
    el.mission.textContent = t('missions')[stage];
    el.sceneLabel.textContent = t('sceneLabels')[stage];
    el.workTitle.textContent = t('workTitles')[stage];
    el.actionLabel.textContent = t('actionLabels')[stage];
    el.sound.textContent = muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-label', muted ? t('soundOff') : t('soundOn'));
    el.sound.setAttribute('aria-pressed', String(muted));
    el.theme.setAttribute('aria-label', t('theme'));
    el.reset.setAttribute('aria-label', t('reset'));
    el.hint.setAttribute('aria-label', t('hint'));
    el.action.disabled = stage === 2;
    if (stage === 0) {
      el.counter.textContent = `${painted.size} / ${[...STAMP_BITS].filter((bit) => bit === '1').length}`;
      el.meter.textContent = '64';
      el.meterUnit.textContent = t('counters')[0];
      renderStageZero();
    } else if (stage === 1) {
      el.counter.textContent = `${receiveRound + 1} / ${RECEIVE_ROWS.length}`;
      el.meter.textContent = '8';
      el.meterUnit.textContent = t('counters')[1];
      renderStageOne();
    } else {
      el.counter.textContent = `${rleRound + 1} / ${RLE_TASKS.length}`;
      el.meter.textContent = String(countRuns(RLE_TASKS[rleRound].bits));
      el.meterUnit.textContent = t('counters')[2];
      renderStageTwo();
    }
    renderLevels();
  }

  function updatePaintCell(index, on) {
    if (on) painted.add(index);
    else painted.delete(index);
    const button = el.workspace.querySelector(`[data-pixel="${index}"]`);
    if (!button) return;
    button.classList.toggle('is-on', on);
    button.classList.toggle('is-guide', !on && STAMP_BITS[index] === '1');
    button.setAttribute('aria-pressed', String(on));
    const row = Math.floor(index / 8) + 1;
    const column = (index % 8) + 1;
    button.setAttribute('aria-label', t('pixelLabel', row, column, on));
    el.counter.textContent = `${painted.size} / ${[...STAMP_BITS].filter((bit) => bit === '1').length}`;
  }

  function bindPaintGrid() {
    const grid = $('#paintGrid');
    if (!grid) return;
    grid.addEventListener('pointerdown', (event) => {
      const cell = event.target.closest('[data-pixel]');
      if (!cell) return;
      event.preventDefault();
      const index = Number(cell.dataset.pixel);
      dragActive = true;
      dragValue = !painted.has(index);
      dragVisited = new Set([index]);
      grid.setPointerCapture(event.pointerId);
      updatePaintCell(index, dragValue);
      tone('pixel');
      scheduleHint();
    });
    grid.addEventListener('pointermove', (event) => {
      if (!dragActive) return;
      const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-pixel]');
      if (!cell || !grid.contains(cell)) return;
      const index = Number(cell.dataset.pixel);
      if (dragVisited.has(index)) return;
      dragVisited.add(index);
      updatePaintCell(index, dragValue);
    });
    const stopDrag = () => {
      if (!dragActive) return;
      dragActive = false;
      window.cool.track('paint_stamp_pixels');
    };
    grid.addEventListener('pointerup', stopDrag);
    grid.addEventListener('pointercancel', stopDrag);
  }

  function checkStamp() {
    const target = new Set([...STAMP_BITS].map((bit, index) => bit === '1' ? index : -1).filter((index) => index >= 0));
    const missing = [...target].filter((index) => !painted.has(index)).length;
    const extra = [...painted].filter((index) => !target.has(index)).length;
    const grid = $('#paintGrid');
    if (missing || extra) {
      setFeedback(t('wrongStamp', missing, extra), 'error');
      grid.classList.remove('is-error');
      requestAnimationFrame(() => grid.classList.add('is-error'));
      tone('wrong');
      window.cool.track('retry_pixel_stamp');
      scheduleHint();
      return;
    }
    grid.classList.add('is-success');
    setFeedback(t('stampSuccess'), 'success');
    tone('stamp');
    window.cool.track('send_pixel_stamp');
    showCompletion(t('stampTitle'), t('stampModal'), '8 × 8 = 64');
  }

  function toggleRowBit(index) {
    if (rowBits.has(index)) rowBits.delete(index);
    else rowBits.add(index);
    tone('pixel');
    setFeedback(t('starts')[1]);
    window.cool.track('restore_pixel_row');
    render();
    scheduleHint();
  }

  function checkRow() {
    const expected = RECEIVE_ROWS[receiveRound];
    const actual = Array.from({ length: 8 }, (_, index) => rowBits.has(index) ? '1' : '0').join('');
    if (actual !== expected) {
      setFeedback(t('wrongRow'), 'error');
      tone('wrong');
      window.cool.track('retry_pixel_row');
      scheduleHint();
      return;
    }
    tone('correct');
    window.cool.track('decode_pixel_row');
    receiveRound += 1;
    if (receiveRound === RECEIVE_ROWS.length) {
      setFeedback(t('rowsDone'), 'success');
      showCompletion(t('rowsTitle'), t('rowsModal'), '00111100 → 🐱');
      return;
    }
    rowBits.clear();
    setFeedback(t('rowSuccess', expected), 'success');
    render();
    scheduleHint();
  }

  function countRuns(bits) {
    return [...bits].reduce((runs, bit, index) => runs + (index === 0 || bit !== bits[index - 1] ? 1 : 0), 0);
  }

  function chooseRle(answer) {
    const task = RLE_TASKS[rleRound];
    if (answer !== task.correct) {
      wrongRle = answer;
      setFeedback(t('wrongRle'), 'error');
      tone('wrong');
      window.cool.track('retry_rle_code');
      render();
      scheduleHint();
      return;
    }
    wrongRle = '';
    const runs = countRuns(task.bits);
    tone(rleRound === RLE_TASKS.length - 1 ? 'complete' : 'correct');
    window.cool.track('compress_pixel_row');
    rleRound += 1;
    if (rleRound === RLE_TASKS.length) {
      setFeedback(t('postalComplete'), 'success');
      window.cool.complete?.();
      showCompletion(t('completeTitle'), t('completeModal'), '8 → 2 ✨');
      return;
    }
    setFeedback(runs === 8 ? t('noSaving') : t('rleSuccess', task.bits, runs), 'success');
    render();
    scheduleHint();
  }

  function showCompletion(title, text, magic) {
    if (stage < 2) {
      unlocked = Math.max(unlocked, stage + 1);
      persist();
    }
    el.modalMagic.textContent = magic;
    el.modalTitle.textContent = title;
    el.modalText.textContent = text;
    el.next.textContent = stage === 2 ? t('replay') : t('next');
    el.modal.hidden = false;
    renderLevels();
  }

  function runAction() {
    if (stage === 0) checkStamp();
    else if (stage === 1) checkRow();
  }

  function resetStage() {
    clearTimeout(hintTimer);
    painted.clear();
    receiveRound = 0;
    rowBits.clear();
    rleRound = 0;
    wrongRle = '';
    el.modal.hidden = true;
    setFeedback(t('starts')[stage]);
    window.cool.stage(`stop-${stage + 1}`);
    render();
    scheduleHint();
  }

  function setStage(nextStage) {
    if (nextStage > unlocked) {
      setFeedback(t('locked'), 'error');
      tone('wrong');
      return;
    }
    stage = nextStage;
    persist();
    resetStage();
  }

  function nextStage() {
    el.modal.hidden = true;
    setStage(stage === 2 ? 0 : stage + 1);
  }

  function showHint() {
    setFeedback(t('hints')[stage]);
    tone('pixel');
    window.cool.track('open_pixel_hint');
    scheduleHint();
  }

  function toggleSound() {
    muted = !muted;
    try {
      localStorage.setItem(MUTE_KEY, String(muted));
    } catch {
      // Sound preference persistence is optional.
    }
    if (muted && audioContext?.state === 'running') audioContext.suspend().catch(() => {});
    render();
    if (!muted) tone('pixel');
  }

  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.sound.addEventListener('click', toggleSound);
  el.hint.addEventListener('click', showHint);
  el.reset.addEventListener('click', resetStage);
  el.action.addEventListener('click', runAction);
  el.next.addEventListener('click', nextStage);

  window.cool.bindI18n(I18N, {
    onChange(context) {
      t = context.t;
      lang = context.lang;
      document.title = t('doc');
      el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      el.theme.textContent = context.theme === 'light' ? '🌙' : '☀️';
      setFeedback(t('starts')[stage], feedbackType);
      render();
    },
  });

  resetStage();
})();
