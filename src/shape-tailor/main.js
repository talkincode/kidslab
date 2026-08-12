(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '图形裁缝铺 · KidsLab',
      back: '返回平台',
      title: '图形裁缝铺',
      mission: '订单',
      priceTag: '报价',
      shapeLabel: '布料',
      baseLabel: '底',
      heightLabel: '高',
      areaLabel: '面积',
      console: '台账',
      think: '墙上公式',
      hint: '给我一点提示',
      cut: '剪刀开剪',
      slide: '平移拼合',
      quote: '确认报价',
      next: '下一位客人',
      finish: '挂上公式墙',
      reset: '收回这块布重裁',
      playAgain: '再开一铺',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      theme: '切换主题',
      navLabel: '订单进度',
      canvasLabel: '裁缝铺裁剪台',
      unit: '平方厘米',
      money: (n) => `${n} 枚金币`,
      seal: '拼好啦',
      finalKicker: '三种布料，一张转化族谱',
      finalTitle: '你剪出了面积公式墙！',
      finalText: '平行四边形变长方形，两块三角形拼平行四边形，梯形割补后也回到底×高——面积在剪刀下显形。',
      shapeNames: ['平行四边形', '三角形', '梯形'],
      baseTexts: ['a = 8', 'a = 8', 'a = 6，b = 10'],
      heightTexts: ['h = 5', 'h = 6', 'h = 4'],
      kickers: ['客人来了 · 平行四边形布', '第二位 · 三角形头巾', '压轴单 · 梯形桌布'],
      titles: ['只会给长方形报价', '两块一样的才能拼', '上下底一加就好算'],
      prompts: [
        '裁一刀，把斜角挪到另一头，变成好算的长方形。',
        '复制一块同样的三角形，拼成平行四边形，再除以 2。',
        '裁开梯形再拼合，面积变成「上下底平均 × 高」。',
      ],
      stageLabels: ['裁剪台 · 平行四边形', '裁剪台 · 三角形', '裁剪台 · 梯形'],
      controlTitles: ['先裁，再拼', '先配对，再折半', '先割补，再均底'],
      stepperLabels: ['这块布的面积是？', '三角形面积是？', '梯形面积是？'],
      lessons: [
        '割下来的角平移到另一头，面积一点不少。',
        '两块全等三角形拼成平行四边形，所以三角形是它的一半。',
        '上下底相加再除以 2，就是「平均底」，乘高得面积。',
      ],
      starts: [
        '客人拿来一块平行四边形布。裁缝铺只会算长方形价钱——动手裁一刀吧。',
        '三角形头巾来了。先变出一块同样的，拼成平行四边形再报价。',
        '梯形桌布最考验手艺：裁开拼合后，用上下底平均乘高。',
      ],
      afterCut: [
        '剪刀咔嚓！拖动粉色角片，或点「平移拼合」，把它挪到另一头。',
        '复制好了！点「平移拼合」，让两块三角形对边贴紧。',
        '裁好了！点「平移拼合」，把右边三角块挪过去补齐。',
      ],
      afterSnap: [
        '咔——变成长方形！底 8、高 5。报出面积就能开价。',
        '拼成平行四边形了！它的面积是 8 × 6 = 48，三角形是一半。',
        '拼好了！平均底 (6+10)÷2 = 8，再 × 高 4。',
      ],
      formulasLocked: ['先变成会算的图形', '先拼成平行四边形', '先割补成规则图形'],
      formulasOpen: [
        'S = a × h = 8 × 5',
        'S = ½ × a × h = ½ × 8 × 6',
        'S = (a + b) ÷ 2 × h = (6 + 10) ÷ 2 × 4',
      ],
      stepLabels: [
        ['沿高剪开', '平移斜角', '报出面积'],
        ['复制同款', '拼成平行四边形', '面积折半'],
        ['沿高裁开', '平移拼合', '均底乘高'],
      ],
      hints: [
        '沿着高剪下一个直角三角，再平移到对面，就变成长方形。面积 = 底 × 高。',
        '两块一样的三角形能拼成平行四边形。三角形面积 = 平行四边形面积 ÷ 2。',
        '梯形上下底相加除以 2 得到平均底，再乘高。也可以裁拼验证。',
      ],
      wrongLow: (n, need) => `报价低了：你报 ${n}，客人觉得布料更值。正确面积是 ${need}。`,
      wrongHigh: (n, need) => `报价高了：你报 ${n}，客人摇头。正确面积是 ${need}。`,
      correct: [
        '成交！平行四边形面积 = 底 × 高 = 8 × 5 = 40。',
        '成交！三角形面积 = ½ × 底 × 高 = ½ × 8 × 6 = 24。',
        '成交！梯形面积 = (上底+下底)÷2 × 高 = 8 × 4 = 32。',
      ],
      insightTitles: ['平行四边形', '三角形', '梯形'],
      insightSubs: ['S = a × h', 'S = ½ah', 'S = (a+b)/2 × h'],
      insightIcons: ['▱', '△', '⏢'],
      insightAreas: ['40', '24', '32'],
    },
    en: {
      doc: 'Shape Tailor Shop · KidsLab',
      back: 'Back to platform',
      title: 'Shape Tailor Shop',
      mission: 'ORDER',
      priceTag: 'PRICE',
      shapeLabel: 'CLOTH',
      baseLabel: 'BASE',
      heightLabel: 'HEIGHT',
      areaLabel: 'AREA',
      console: 'LEDGER',
      think: 'WALL FORMULA',
      hint: 'Give me a hint',
      cut: 'Snip with scissors',
      slide: 'Slide to join',
      quote: 'Confirm price',
      next: 'Next customer',
      finish: 'Hang the formula wall',
      reset: 'Reset this cloth',
      playAgain: 'Open shop again',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      theme: 'Switch theme',
      navLabel: 'Order progress',
      canvasLabel: 'Tailor cutting table',
      unit: 'sq cm',
      money: (n) => `${n} coins`,
      seal: 'Joined!',
      finalKicker: 'THREE CLOTHS, ONE FAMILY TREE',
      finalTitle: 'You cut out the area formula wall!',
      finalText: 'Parallelograms become rectangles, twin triangles make a parallelogram, and trapezoids return to base × height after a cut-and-slide.',
      shapeNames: ['Parallelogram', 'Triangle', 'Trapezoid'],
      baseTexts: ['a = 8', 'a = 8', 'a = 6, b = 10'],
      heightTexts: ['h = 5', 'h = 6', 'h = 4'],
      kickers: ['Customer · parallelogram cloth', 'Second · triangle scarf', 'Finale · trapezoid cloth'],
      titles: ['We only price rectangles', 'Need a matching twin', 'Add the bases first'],
      prompts: [
        'Cut once, slide the slanted corner across, and make a rectangle.',
        'Duplicate the triangle, join into a parallelogram, then halve it.',
        'Cut and reassemble the trapezoid into average-base × height.',
      ],
      stageLabels: ['Table · parallelogram', 'Table · triangle', 'Table · trapezoid'],
      controlTitles: ['Cut, then join', 'Pair, then halve', 'Cut, then average'],
      stepperLabels: ['Area of this cloth?', 'Triangle area?', 'Trapezoid area?'],
      lessons: [
        'Sliding the cut corner keeps the area exactly the same.',
        'Two congruent triangles make a parallelogram, so a triangle is half.',
        'Average the top and bottom bases, then multiply by height.',
      ],
      starts: [
        'A parallelogram arrives. This shop only prices rectangles—make the first cut.',
        'A triangle scarf is here. Make a twin, join a parallelogram, then quote.',
        'Trapezoid tablecloth time: cut, join, then use average base × height.',
      ],
      afterCut: [
        'Snip! Drag the pink piece, or tap “Slide to join”, to the other side.',
        'Twin ready! Tap “Slide to join” so the triangles meet edge to edge.',
        'Cut done! Tap “Slide to join” to move the right piece into place.',
      ],
      afterSnap: [
        'Click—rectangle! Base 8, height 5. Quote the area to price it.',
        'Parallelogram joined! Its area is 8 × 6 = 48; the triangle is half.',
        'Joined! Average base (6+10)÷2 = 8, then × height 4.',
      ],
      formulasLocked: ['Turn it into a known shape first', 'Build a parallelogram first', 'Rebuild a regular shape first'],
      formulasOpen: [
        'S = a × h = 8 × 5',
        'S = ½ × a × h = ½ × 8 × 6',
        'S = (a + b) ÷ 2 × h = (6 + 10) ÷ 2 × 4',
      ],
      stepLabels: [
        ['Cut on the height', 'Slide the corner', 'Quote the area'],
        ['Duplicate the twin', 'Join parallelogram', 'Halve the area'],
        ['Cut on a height', 'Slide to join', 'Average × height'],
      ],
      hints: [
        'Cut a right triangle along the height, slide it to the opposite side, and get a rectangle. Area = base × height.',
        'Two matching triangles make a parallelogram. Triangle area = parallelogram area ÷ 2.',
        'Add top and bottom bases, divide by 2 for the average base, then multiply by height.',
      ],
      wrongLow: (n, need) => `Too low: you quoted ${n}, but the true area is ${need}.`,
      wrongHigh: (n, need) => `Too high: you quoted ${n}, but the true area is ${need}.`,
      correct: [
        'Sold! Parallelogram area = base × height = 8 × 5 = 40.',
        'Sold! Triangle area = ½ × base × height = ½ × 8 × 6 = 24.',
        'Sold! Trapezoid area = (top+bottom)÷2 × height = 8 × 4 = 32.',
      ],
      insightTitles: ['Parallelogram', 'Triangle', 'Trapezoid'],
      insightSubs: ['S = a × h', 'S = ½ah', 'S = (a+b)/2 × h'],
      insightIcons: ['▱', '△', '⏢'],
      insightAreas: ['40', '24', '32'],
    },
  };

  const MISSIONS = [
    {
      id: 'parallelogram',
      kind: 'parallelogram',
      base: 8,
      height: 5,
      top: null,
      answer: 40,
      min: 10,
      max: 80,
      defaultGuess: 30,
      unitPrice: 2,
    },
    {
      id: 'triangle',
      kind: 'triangle',
      base: 8,
      height: 6,
      top: null,
      answer: 24,
      min: 8,
      max: 60,
      defaultGuess: 48,
      unitPrice: 2,
    },
    {
      id: 'trapezoid',
      kind: 'trapezoid',
      base: 10,
      top: 6,
      height: 4,
      answer: 32,
      min: 10,
      max: 70,
      defaultGuess: 40,
      unitPrice: 2,
    },
  ];

  const STORAGE_KEY = 'kidslab.shape-tailor';
  const SOUND_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);

  const elements = {
    course: $('#course'),
    stage: $('#stage'),
    canvas: $('#sceneCanvas'),
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionPrompt: $('#missionPrompt'),
    missionNav: $('#missionNav'),
    stageLabel: $('#stageLabel'),
    priceValue: $('#priceValue'),
    shapeReadout: $('#shapeReadout'),
    baseReadout: $('#baseReadout'),
    heightReadout: $('#heightReadout'),
    areaReadout: $('#areaReadout'),
    glowSeal: $('#glowSeal'),
    sealText: $('#sealText'),
    status: $('#status'),
    formulaText: $('#formulaText'),
    stepsList: $('#stepsList'),
    quoteCard: $('#quoteCard'),
    stepperLabel: $('#stepperLabel'),
    guessValue: $('#guessValue'),
    unitLabel: $('#unitLabel'),
    lessonText: $('#lessonText'),
    controlTitle: $('#controlTitle'),
    hintBtn: $('#hintBtn'),
    cutBtn: $('#cutBtn'),
    slideBtn: $('#slideBtn'),
    quoteBtn: $('#quoteBtn'),
    nextBtn: $('#nextBtn'),
    resetBtn: $('#resetBtn'),
    minusBtn: $('#minusBtn'),
    plusBtn: $('#plusBtn'),
    soundBtn: $('#soundBtn'),
    themeBtn: $('#themeBtn'),
    langBtn: $('#langBtn'),
    finale: $('#finale'),
    finaleCanvas: $('#finaleCanvas'),
    finaleGrid: $('#finaleGrid'),
    playAgainBtn: $('#playAgainBtn'),
  };

  let t = (key) => key;
  let lang = 'zh';
  let muted = false;
  let audioContext = null;
  let animFrame = 0;
  let sparkles = [];
  let drag = null;
  let pieceT = 0;
  let cutProgress = 1;
  let state = loadState();

  function freshState() {
    return {
      mission: 0,
      phase: 'ready',
      guess: MISSIONS[0].defaultGuess,
      result: 'idle',
      solved: false,
      completed: false,
      feedback: 'start',
      pieceT: 0,
    };
  }

  function loadState() {
    const fallback = freshState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || !Number.isInteger(saved.mission) || saved.mission < 0 || saved.mission >= MISSIONS.length) {
        return fallback;
      }
      const mission = MISSIONS[saved.mission];
      const phases = ['ready', 'cut', 'snapped', 'quote', 'solved'];
      const phase = phases.includes(saved.phase) ? saved.phase : 'ready';
      const guess = Number.isInteger(saved.guess)
        ? Math.min(mission.max, Math.max(mission.min, saved.guess))
        : mission.defaultGuess;
      return {
        mission: saved.mission,
        phase,
        guess,
        result: ['idle', 'wrong', 'correct'].includes(saved.result) ? saved.result : 'idle',
        solved: Boolean(saved.solved) && (phase === 'solved' || saved.result === 'correct'),
        completed: Boolean(saved.completed),
        feedback: typeof saved.feedback === 'string' ? saved.feedback : 'start',
        pieceT: typeof saved.pieceT === 'number' ? Math.min(1, Math.max(0, saved.pieceT)) : phase === 'ready' ? 0 : 1,
      };
    } catch {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          mission: state.mission,
          phase: state.phase,
          guess: state.guess,
          result: state.result,
          solved: state.solved,
          completed: state.completed,
          feedback: state.feedback,
          pieceT: state.pieceT,
        }),
      );
    } catch {
      /* ignore */
    }
  }

  function mission() {
    return MISSIONS[state.mission];
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function ensureAudio() {
    if (muted) return null;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      if (!audioContext) audioContext = new AudioCtor();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      return audioContext;
    } catch {
      return null;
    }
  }

  function tone(freq, duration, type, gainValue, delay = 0) {
    const ctx = ensureAudio();
    if (!ctx || muted) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playSound(kind) {
    if (muted) return;
    if (kind === 'tap') tone(520, 0.08, 'triangle', 0.03);
    else if (kind === 'cut') {
      tone(880, 0.05, 'square', 0.02);
      tone(640, 0.08, 'triangle', 0.03, 0.04);
      tone(420, 0.1, 'sine', 0.025, 0.08);
    } else if (kind === 'slide') {
      tone(360, 0.1, 'sine', 0.04);
      tone(540, 0.12, 'triangle', 0.03, 0.05);
    } else if (kind === 'snap') {
      tone(600, 0.08, 'sine', 0.04);
      tone(900, 0.12, 'triangle', 0.035, 0.06);
    } else if (kind === 'good') {
      tone(523, 0.12, 'sine', 0.05);
      tone(659, 0.14, 'sine', 0.045, 0.08);
      tone(784, 0.18, 'triangle', 0.04, 0.16);
    } else if (kind === 'bad') {
      tone(220, 0.16, 'sawtooth', 0.03);
      tone(180, 0.18, 'triangle', 0.025, 0.05);
    } else if (kind === 'win') {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, 'sine', 0.045, i * 0.09));
    }
  }

  function setMuted(next) {
    muted = next;
    try {
      localStorage.setItem(SOUND_KEY, muted ? '1' : '0');
    } catch {
      /* ignore */
    }
    syncSoundButton();
  }

  function syncSoundButton() {
    if (!elements.soundBtn) return;
    elements.soundBtn.textContent = muted ? '🔇' : '🔊';
    elements.soundBtn.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
    elements.soundBtn.setAttribute('aria-pressed', String(muted));
  }

  function track(name) {
    try {
      window.cool?.track?.(name);
    } catch {
      /* ignore */
    }
  }

  function stageProgress() {
    try {
      window.cool?.stage?.(`level${state.mission + 1}`);
    } catch {
      /* ignore */
    }
  }

  function markComplete() {
    try {
      window.cool?.complete?.();
    } catch {
      /* ignore */
    }
    try {
      localStorage.setItem(
        'kidslab.progress.shape-tailor',
        JSON.stringify({ status: 'completed', at: Date.now() }),
      );
    } catch {
      /* ignore */
    }
  }

  function clearProgress() {
    try {
      localStorage.removeItem('kidslab.progress.shape-tailor');
    } catch {
      /* ignore */
    }
  }

  function statusMessage() {
    if (state.feedback === 'hint') return t('hints')[state.mission];
    if (state.feedback === 'cut') return t('afterCut')[state.mission];
    if (state.feedback === 'snapped') return t('afterSnap')[state.mission];
    if (state.feedback === 'wrong-low') return t('wrongLow', state.guess, mission().answer);
    if (state.feedback === 'wrong-high') return t('wrongHigh', state.guess, mission().answer);
    if (state.feedback === 'correct') return t('correct')[state.mission];
    return t('starts')[state.mission];
  }

  function stepIndex() {
    if (state.phase === 'ready') return 0;
    if (state.phase === 'cut') return 1;
    if (state.phase === 'snapped' || state.phase === 'quote') return 2;
    return 3;
  }

  function renderSteps() {
    const labels = t('stepLabels')[state.mission];
    const current = stepIndex();
    elements.stepsList.innerHTML = '';
    labels.forEach((label, index) => {
      const li = document.createElement('li');
      li.dataset.n = String(index + 1);
      li.textContent = label;
      if (index < current || state.solved || state.completed) li.classList.add('is-done');
      else if (index === current) li.classList.add('is-current');
      elements.stepsList.appendChild(li);
    });
  }

  function renderNav() {
    elements.missionNav.innerHTML = '';
    elements.missionNav.setAttribute('aria-label', t('navLabel'));
    MISSIONS.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.textContent = String(index + 1);
      if (index < state.mission || (index === state.mission && state.solved) || state.completed) {
        dot.classList.add('is-done');
      }
      if (index === state.mission && !state.completed) dot.classList.add('is-current');
      elements.missionNav.appendChild(dot);
    });
  }

  function renderFinaleGrid() {
    elements.finaleGrid.innerHTML = '';
    t('insightTitles').forEach((title, index) => {
      const card = document.createElement('article');
      card.innerHTML = `<span aria-hidden="true">${t('insightIcons')[index]}</span><strong>${title}<br><span>${t('insightSubs')[index]}</span></strong><b>${t('insightAreas')[index]}</b>`;
      elements.finaleGrid.appendChild(card);
    });
  }

  function updateChrome() {
    const m = mission();
    const open = state.phase === 'snapped' || state.phase === 'quote' || state.phase === 'solved' || state.solved;
    elements.missionNumber.textContent = String(state.mission + 1);
    elements.missionKicker.textContent = t('kickers')[state.mission];
    elements.missionTitle.textContent = t('titles')[state.mission];
    elements.missionPrompt.textContent = t('prompts')[state.mission];
    elements.stageLabel.textContent = t('stageLabels')[state.mission];
    elements.controlTitle.textContent = t('controlTitles')[state.mission];
    elements.shapeReadout.textContent = t('shapeNames')[state.mission];
    elements.baseReadout.textContent = t('baseTexts')[state.mission];
    elements.heightReadout.textContent = t('heightTexts')[state.mission];
    elements.areaReadout.textContent = state.solved || state.phase === 'solved' ? String(m.answer) : '?';
    elements.priceValue.textContent =
      state.solved || state.phase === 'solved' ? t('money', m.answer * m.unitPrice) : '—';
    elements.formulaText.textContent = open || state.solved ? t('formulasOpen')[state.mission] : t('formulasLocked')[state.mission];
    elements.lessonText.textContent = t('lessons')[state.mission];
    elements.stepperLabel.textContent = t('stepperLabels')[state.mission];
    elements.unitLabel.textContent = t('unit');
    elements.guessValue.textContent = String(state.guess);
    elements.status.textContent = statusMessage();
    elements.sealText.textContent = t('seal');
    elements.canvas.setAttribute('aria-label', t('canvasLabel'));
    elements.stage.dataset.phase = state.phase;
    elements.stage.dataset.result = state.result;
    elements.glowSeal.hidden = !(state.phase === 'snapped' || state.phase === 'quote' || state.phase === 'solved' || state.solved);

    const showQuote = state.phase === 'snapped' || state.phase === 'quote' || state.phase === 'solved' || state.solved;
    elements.quoteCard.hidden = !showQuote;

    elements.cutBtn.hidden = !(state.phase === 'ready');
    elements.slideBtn.hidden = !(state.phase === 'cut');
    elements.quoteBtn.hidden = !(state.phase === 'snapped' || state.phase === 'quote');
    elements.nextBtn.hidden = !(state.phase === 'solved' || state.solved);
    const nextLabel = document.getElementById('nextLabel');
    if (nextLabel) {
      nextLabel.textContent = state.mission >= MISSIONS.length - 1 ? t('finish') : t('next');
    }

    const cutLabel = elements.cutBtn.querySelector('span:not([aria-hidden])');
    if (cutLabel) cutLabel.textContent = t('cut');
    const slideLabel = elements.slideBtn.querySelector('span:not([aria-hidden])');
    if (slideLabel) slideLabel.textContent = t('slide');
    const quoteLabel = elements.quoteBtn.querySelector('span:not([aria-hidden])');
    if (quoteLabel) quoteLabel.textContent = t('quote');
    const hintLabel = elements.hintBtn.querySelector('span:not([aria-hidden])');
    if (hintLabel) hintLabel.textContent = t('hint');
    elements.resetBtn.textContent = t('reset');

    renderSteps();
    renderNav();
    syncSoundButton();
  }

  function centroid(pts) {
    const s = pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    return { x: s.x / pts.length, y: s.y / pts.length };
  }

  function geometry(m, width, height) {
    const finish = (g) => {
      const pc = centroid(g.piece);
      const tc = centroid(g.target);
      g.slide = { x: tc.x - pc.x, y: tc.y - pc.y };
      return g;
    };
    const pad = 36;
    const tableW = width - pad * 2;
    const tableH = height - pad * 2;
    const scale = Math.min(tableW / 14, tableH / 10);
    const cx = width / 2;
    const cy = height / 2 + 8;
    const base = m.base * scale;
    const h = m.height * scale;
    const skew = scale * 2.4;

    if (m.kind === 'parallelogram') {
      const x0 = cx - base / 2 - skew / 2;
      const y0 = cy + h / 2;
      return finish({
        scale,
        cx,
        cy,
        body: [
          { x: x0 + skew, y: y0 - h },
          { x: x0 + skew + base, y: y0 - h },
          { x: x0 + base, y: y0 },
          { x: x0, y: y0 },
        ],
        piece: [
          { x: x0, y: y0 },
          { x: x0 + skew, y: y0 - h },
          { x: x0 + skew, y: y0 },
        ],
        remain: [
          { x: x0 + skew, y: y0 - h },
          { x: x0 + skew + base, y: y0 - h },
          { x: x0 + base, y: y0 },
          { x: x0 + skew, y: y0 },
        ],
        target: [
          { x: x0 + base, y: y0 },
          { x: x0 + base + skew, y: y0 - h },
          { x: x0 + base + skew, y: y0 },
        ],
        rect: [
          { x: x0 + skew, y: y0 - h },
          { x: x0 + skew + base, y: y0 - h },
          { x: x0 + skew + base, y: y0 },
          { x: x0 + skew, y: y0 },
        ],
        cutFrom: { x: x0 + skew, y: y0 - h },
        cutTo: { x: x0 + skew, y: y0 },
        labels: {
          base: { x: cx, y: y0 + 18 },
          height: { x: x0 + skew - 16, y: cy },
        },
        slide: { x: base, y: 0 },
      });
    }

    if (m.kind === 'triangle') {
      const x0 = cx - base / 2;
      const y0 = cy + h / 2;
      const apex = { x: cx - base * 0.1, y: y0 - h };
      return finish({
        scale,
        cx,
        cy,
        body: [
          { x: x0, y: y0 },
          { x: x0 + base, y: y0 },
          apex,
        ],
        piece: [
          { x: x0, y: y0 },
          { x: x0 + base, y: y0 },
          apex,
        ],
        remain: [
          { x: x0, y: y0 },
          { x: x0 + base, y: y0 },
          apex,
        ],
        target: [
          { x: x0 + base, y: y0 },
          { x: x0 + base * 2, y: y0 },
          { x: x0 + base + (apex.x - x0), y: apex.y },
        ],
        rect: [
          { x: x0, y: y0 },
          { x: x0 + base * 2, y: y0 },
          { x: x0 + base + (apex.x - x0), y: apex.y },
          apex,
        ],
        cutFrom: apex,
        cutTo: { x: x0 + base / 2, y: y0 },
        labels: {
          base: { x: cx, y: y0 + 18 },
          height: { x: apex.x - 18, y: cy },
        },
        slide: { x: base, y: 0 },
        twinOrigin: { x: x0, y: y0 },
      });
    }

    // trapezoid
    const top = m.top * scale;
    const bot = m.base * scale;
    const x0 = cx - bot / 2;
    const y0 = cy + h / 2;
    const leftOver = (bot - top) / 2;
    return finish({
      scale,
      cx,
      cy,
      body: [
        { x: x0 + leftOver, y: y0 - h },
        { x: x0 + leftOver + top, y: y0 - h },
        { x: x0 + bot, y: y0 },
        { x: x0, y: y0 },
      ],
      piece: [
        { x: x0 + leftOver + top, y: y0 - h },
        { x: x0 + bot, y: y0 },
        { x: x0 + leftOver + top, y: y0 },
      ],
      remain: [
        { x: x0 + leftOver, y: y0 - h },
        { x: x0 + leftOver + top, y: y0 - h },
        { x: x0 + leftOver + top, y: y0 },
        { x: x0, y: y0 },
      ],
      target: [
        { x: x0 + leftOver, y: y0 - h },
        { x: x0, y: y0 },
        { x: x0 + leftOver, y: y0 },
      ],
      rect: [
        { x: x0 + leftOver, y: y0 - h },
        { x: x0 + leftOver + top + leftOver, y: y0 - h },
        { x: x0 + leftOver + top + leftOver, y: y0 },
        { x: x0 + leftOver, y: y0 },
      ],
      cutFrom: { x: x0 + leftOver + top, y: y0 - h },
      cutTo: { x: x0 + leftOver + top, y: y0 },
      labels: {
        base: { x: cx, y: y0 + 18 },
        height: { x: x0 + leftOver - 16, y: cy },
        top: { x: cx, y: y0 - h - 14 },
      },
      slide: { x: -(top), y: 0 },
    });
  }

  function pathPoly(ctx, pts) {
    ctx.beginPath();
    pts.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
  }

  function drawDashLine(ctx, a, b, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([7, 6]);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }

  function lerp(a, b, tVal) {
    return a + (b - a) * tVal;
  }

  function translatePoly(pts, dx, dy) {
    return pts.map((p) => ({ x: p.x + dx, y: p.y + dy }));
  }

  function drawFabric(ctx, pts, fill, stroke, shadow = true) {
    ctx.save();
    if (shadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.18)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
    }
    pathPoly(ctx, pts);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 3;
    ctx.strokeStyle = stroke;
    ctx.stroke();
    // fabric grain
    ctx.clip();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    const minX = Math.min(...pts.map((p) => p.x));
    const maxX = Math.max(...pts.map((p) => p.x));
    const minY = Math.min(...pts.map((p) => p.y));
    const maxY = Math.max(...pts.map((p) => p.y));
    for (let x = minX; x < maxX; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, minY);
      ctx.lineTo(x + (maxY - minY) * 0.2, maxY);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawLabels(ctx, g, m) {
    const ink = cssVar('--ink');
    const muted = cssVar('--muted');
    ctx.save();
    ctx.fillStyle = ink;
    ctx.font = '800 15px ui-rounded, sans-serif';
    ctx.textAlign = 'center';
    if (m.kind === 'trapezoid') {
      ctx.fillText(`b=${m.base}`, g.labels.base.x, g.labels.base.y);
      ctx.fillText(`a=${m.top}`, g.labels.top.x, g.labels.top.y);
    } else {
      ctx.fillText(`a=${m.base}`, g.labels.base.x, g.labels.base.y);
    }
    ctx.fillStyle = muted;
    ctx.fillText(`h=${m.height}`, g.labels.height.x, g.labels.height.y);
    ctx.restore();
  }

  function drawScene() {
    const canvas = elements.canvas;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, rect.width);
    const height = Math.max(160, rect.height);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // table edge
    ctx.fillStyle = cssVar('--table-2');
    roundRect(ctx, 10, height - 22, width - 20, 14, 8);
    ctx.fill();

    const m = mission();
    const g = geometry(m, width, height);
    const stroke = cssVar('--line');
    const cloth = cssVar('--cloth');
    const cloth2 = cssVar('--cloth-2');
    const cloth3 = cssVar('--cloth-3');
    const good = cssVar('--good');

    const phase = state.phase;
    const pT = drag ? pieceT : state.pieceT;

    if (phase === 'ready') {
      drawFabric(ctx, g.body, cloth, stroke);
      drawDashLine(ctx, g.cutFrom, g.cutTo, cssVar('--rose') || '#ef476f');
      // scissors marker
      const sc = {
        x: lerp(g.cutFrom.x, g.cutTo.x, 0.35 + Math.sin(animFrame / 18) * 0.08),
        y: lerp(g.cutFrom.y, g.cutTo.y, 0.35 + Math.sin(animFrame / 18) * 0.08),
      };
      ctx.font = '22px serif';
      ctx.fillText('✂️', sc.x - 10, sc.y + 8);
      drawLabels(ctx, g, m);
    } else if (phase === 'cut') {
      drawFabric(ctx, g.remain, cloth, stroke);
      const dx = g.slide.x * pT + (drag ? drag.dx : 0);
      const dy = g.slide.y * pT + (drag ? drag.dy : 0);
      const moved = translatePoly(g.piece, dx, dy);
      drawFabric(ctx, moved, cloth2, stroke);
      // target ghost
      ctx.save();
      ctx.globalAlpha = 0.28;
      drawFabric(ctx, g.target, good, stroke, false);
      ctx.restore();
      drawLabels(ctx, g, m);
    } else {
      const fill = state.solved || phase === 'solved' ? cloth3 : cloth2;
      drawFabric(ctx, g.rect, fill, stroke);
      if (state.solved || phase === 'solved') {
        ctx.save();
        ctx.fillStyle = cssVar('--ink-on-accent');
        ctx.font = '900 18px ui-rounded, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const c = centroid(g.rect);
        ctx.fillText(`${m.answer}`, c.x, c.y);
        ctx.restore();
      }
      drawLabels(ctx, g, m);
    }

    // sparkles
    sparkles = sparkles.filter((s) => s.life > 0);
    sparkles.forEach((s) => {
      s.life -= 1;
      s.y -= 0.6;
      ctx.globalAlpha = Math.max(0, s.life / s.max);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function burst(x, y) {
    const colors = [cssVar('--gold'), cssVar('--rose'), cssVar('--teal'), '#fff'];
    for (let i = 0; i < 14; i += 1) {
      sparkles.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 20,
        r: 2 + Math.random() * 3,
        life: 28 + Math.random() * 18,
        max: 46,
        color: colors[i % colors.length],
      });
    }
  }

  function drawFinale() {
    const canvas = elements.finaleCanvas;
    if (!canvas || elements.finale.hidden) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < 24; i += 1) {
      const x = ((i * 97 + animFrame * 1.2) % (width + 40)) - 20;
      const y = (i * 53 + Math.sin((animFrame + i * 8) / 20) * 18) % height;
      ctx.globalAlpha = 0.35;
      ctx.font = `${18 + (i % 3) * 6}px serif`;
      ctx.fillText(i % 2 ? '✂️' : '🧵', x, y);
    }
    ctx.globalAlpha = 1;
  }

  function render() {
    updateChrome();
    drawScene();
    const showFinale = state.completed;
    elements.finale.hidden = !showFinale;
    elements.course.inert = showFinale;
    if (showFinale) {
      renderFinaleGrid();
      drawFinale();
      elements.playAgainBtn?.focus({ preventScroll: true });
    }
  }

  function doCut() {
    if (state.phase !== 'ready') return;
    playSound('cut');
    track('cut');
    state.phase = 'cut';
    state.pieceT = 0;
    pieceT = 0;
    state.feedback = 'cut';
    state.result = 'idle';
    cutProgress = 0;
    saveState();
    render();
  }

  function completeSlide() {
    if (state.phase !== 'cut') return;
    playSound('snap');
    track('slide');
    state.phase = 'snapped';
    state.pieceT = 1;
    pieceT = 1;
    state.feedback = 'snapped';
    state.result = 'idle';
    const canvas = elements.canvas.getBoundingClientRect();
    burst(canvas.width / 2, canvas.height / 2);
    saveState();
    render();
  }

  function doSlide() {
    if (state.phase !== 'cut') return;
    playSound('slide');
    const start = performance.now();
    const from = state.pieceT;
    const tick = (now) => {
      const u = Math.min(1, (now - start) / 420);
      state.pieceT = from + (1 - from) * (1 - (1 - u) ** 3);
      pieceT = state.pieceT;
      drawScene();
      if (u < 1) requestAnimationFrame(tick);
      else completeSlide();
    };
    requestAnimationFrame(tick);
  }

  function doQuote() {
    if (!(state.phase === 'snapped' || state.phase === 'quote')) return;
    state.phase = 'quote';
    const m = mission();
    if (Number(state.guess) === Number(m.answer)) {
      playSound('good');
      track('quote_ok');
      state.phase = 'solved';
      state.solved = true;
      state.result = 'correct';
      state.feedback = 'correct';
      stageProgress();
      const canvas = elements.canvas.getBoundingClientRect();
      burst(canvas.width / 2, canvas.height / 2);
    } else {
      playSound('bad');
      track('quote_bad');
      state.result = 'wrong';
      state.feedback = state.guess < m.answer ? 'wrong-low' : 'wrong-high';
    }
    saveState();
    render();
  }

  function doNext() {
    if (!(state.phase === 'solved' || state.solved)) return;
    playSound('tap');
    if (state.mission >= MISSIONS.length - 1) {
      state.completed = true;
      playSound('win');
      markComplete();
      track('complete');
      saveState();
      render();
      return;
    }
    state.mission += 1;
    state.phase = 'ready';
    state.guess = MISSIONS[state.mission].defaultGuess;
    state.result = 'idle';
    state.solved = false;
    state.feedback = 'start';
    state.pieceT = 0;
    pieceT = 0;
    stageProgress();
    saveState();
    render();
  }

  function doReset() {
    playSound('tap');
    track('reset');
    const m = mission();
    state.phase = 'ready';
    state.guess = m.defaultGuess;
    state.result = 'idle';
    state.solved = false;
    state.feedback = 'start';
    state.pieceT = 0;
    pieceT = 0;
    saveState();
    render();
  }

  function doHint() {
    playSound('tap');
    track('hint');
    state.feedback = 'hint';
    saveState();
    render();
  }

  function nudge(delta) {
    if (elements.quoteCard.hidden) return;
    const m = mission();
    state.guess = Math.min(m.max, Math.max(m.min, Number(state.guess) + delta));
    if (state.phase === 'snapped') state.phase = 'quote';
    if (state.result === 'wrong') {
      state.result = 'idle';
      state.feedback = 'snapped';
      elements.stage.dataset.result = 'idle';
      elements.status.textContent = statusMessage();
    }
    playSound('tap');
    elements.guessValue.textContent = String(state.guess);
    saveState();
  }

  function pointerPos(event) {
    const rect = elements.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function onPointerDown(event) {
    if (state.phase !== 'cut') return;
    const g = geometry(mission(), elements.canvas.clientWidth, elements.canvas.clientHeight);
    const pos = pointerPos(event);
    const dx = g.slide.x * state.pieceT;
    const dy = g.slide.y * state.pieceT;
    const moved = translatePoly(g.piece, dx, dy);
    const c = centroid(moved);
    const dist = Math.hypot(pos.x - c.x, pos.y - c.y);
    if (dist > 64) return;
    drag = {
      startX: pos.x,
      startY: pos.y,
      dx: 0,
      dy: 0,
      originT: state.pieceT,
    };
    pieceT = state.pieceT;
    elements.canvas.setPointerCapture(event.pointerId);
    playSound('tap');
  }

  function onPointerMove(event) {
    if (!drag) return;
    const g = geometry(mission(), elements.canvas.clientWidth, elements.canvas.clientHeight);
    const pos = pointerPos(event);
    drag.dx = pos.x - drag.startX;
    drag.dy = pos.y - drag.startY;
    // project progress along slide vector
    const sx = g.slide.x || 1;
    const sy = g.slide.y || 0;
    const len2 = sx * sx + sy * sy;
    const proj = ((drag.dx + sx * drag.originT) * sx + (drag.dy + sy * drag.originT) * sy) / len2;
    pieceT = Math.min(1, Math.max(0, proj));
    drawScene();
  }

  function onPointerUp(event) {
    if (!drag) return;
    try {
      elements.canvas.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    state.pieceT = pieceT;
    drag = null;
    if (state.pieceT > 0.82) completeSlide();
    else {
      saveState();
      drawScene();
    }
  }

  function loop() {
    animFrame += 1;
    if (state.phase === 'ready' || sparkles.length || !elements.finale.hidden) {
      drawScene();
      if (!elements.finale.hidden) drawFinale();
    }
    requestAnimationFrame(loop);
  }

  function bind() {
    elements.soundBtn?.addEventListener('click', () => setMuted(!muted));
    elements.themeBtn?.addEventListener('click', () => window.cool.preferences.toggleTheme());
    elements.langBtn?.addEventListener('click', () => window.cool.preferences.toggleLang());
    elements.cutBtn?.addEventListener('click', doCut);
    elements.slideBtn?.addEventListener('click', doSlide);
    elements.quoteBtn?.addEventListener('click', doQuote);
    elements.nextBtn?.addEventListener('click', doNext);
    elements.resetBtn?.addEventListener('click', doReset);
    elements.hintBtn?.addEventListener('click', doHint);
    elements.minusBtn?.addEventListener('click', () => nudge(-1));
    elements.plusBtn?.addEventListener('click', () => nudge(1));
    elements.playAgainBtn?.addEventListener('click', () => {
      playSound('tap');
      track('replay');
      state = freshState();
      sparkles = [];
      clearProgress();
      saveState();
      render();
    });
    elements.canvas?.addEventListener('pointerdown', onPointerDown);
    elements.canvas?.addEventListener('pointermove', onPointerMove);
    elements.canvas?.addEventListener('pointerup', onPointerUp);
    elements.canvas?.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('resize', () => drawScene());
    window.addEventListener('themechange', () => drawScene());
  }

  try {
    muted = localStorage.getItem(SOUND_KEY) === '1';
  } catch {
    muted = false;
  }

  bind();
  pieceT = state.pieceT || 0;

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang: nextLang, theme }) {
      t = translate;
      lang = nextLang;
      document.title = t('doc');
      if (elements.langBtn) elements.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
      if (elements.themeBtn) {
        elements.themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
        elements.themeBtn.setAttribute('aria-label', t('theme'));
      }
      render();
    },
  });

  stageProgress();
  requestAnimationFrame(loop);
})();
