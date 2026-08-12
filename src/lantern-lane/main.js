(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '灯笼街 · KidsLab',
      back: '返回平台',
      title: '灯笼街',
      mission: '关卡',
      stock: '货架',
      length: '长度',
      gap: '间距',
      intervals: '间隔',
      rule: '规则',
      console: '布景台账',
      think: '先想一想',
      hint: '给我一点提示',
      place: '挂上现场',
      next: '下一处布景',
      finish: '点亮终章',
      reset: '收回本关灯笼',
      playAgain: '再布一次元宵夜',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      theme: '切换主题',
      navLabel: '关卡进度',
      canvasLabel: '灯笼街场景',
      seal: '全街点亮',
      finalKicker: '五种皮囊，同一道间隔题',
      finalTitle: '你点亮了整条灯笼街！',
      finalText: '两端都挂、桥头不挂、环形湖边、锯木头、爬楼梯——先数间隔，再决定端点算不算。',
      stageLabels: ['灯笼街现场', '石桥立柱现场', '环形湖边', '木工锯台', '灯笼塔楼梯'],
      controlTitles: ['先报数，再挂灯', '桥上要立几根柱？', '湖边围一圈', '锯成几段要几刀？', '从这层爬到那层'],
      stepperLabels: ['领货数量', '立柱数量', '灯笼数量', '下刀次数', '要爬几层'],
      units: ['盏灯笼', '根柱子', '盏灯笼', '刀', '层'],
      rules: ['两端都挂', '两端不挂', '环形布置', '段数 − 1', '终点 − 起点'],
      formulas: [
        '间隔数 = 总长 ÷ 间距；两端都挂 → 灯数 = 间隔 + 1',
        '间隔数 = 总长 ÷ 间距；两端不挂 → 柱数 = 间隔 − 1',
        '环形没有端点：灯数 = 间隔数 = 周长 ÷ 间距',
        '段与段之间才有锯口：刀数 = 段数 − 1',
        '楼层号码中间的台阶：层数 = 终点楼 − 起点楼',
      ],
      lessons: [
        '先数清楚有几段间隔，再问两端要不要算进去。',
        '桥两头已经连着岸，柱子只立在桥面上的间隔点。',
        '首尾是同一点，不能把“起点”再算第二次。',
        '最后一段木头右边没有下一刀，别多数一刀。',
        '爬楼梯数的是层与层之间的台阶，不是楼牌号码。',
      ],
      kickers: [
        '元宵夜 · 两端都挂',
        '石拱桥 · 两端不挂',
        '月湖边 · 环形布置',
        '木工坊 · 锯木头',
        '灯笼塔 · 爬楼梯',
      ],
      titles: [
        '100 米长街，每 10 米一盏',
        '50 米石桥，每 10 米一根柱',
        '周长 60 米的湖，每 10 米一盏',
        '把圆木锯成 5 段',
        '从 3 楼爬到 8 楼',
      ],
      prompts: [
        '先报数领货，再把灯笼挂上街。多了尴尬，少了发黑。',
        '桥两头不立柱。先报数，再把柱子立到桥面上。',
        '绕湖一圈首尾相接。先报数，再把灯笼挂满一圈。',
        '每次只锯一刀。先报刀数，再在圆木上落锯。',
        '数的是层与层之间。先报层数，再点亮楼梯。',
      ],
      starts: [
        '100 米街道，每隔 10 米挂一盏，两端都要挂。你先领几盏？',
        '50 米石桥，每隔 10 米立一根柱，桥两头不立。你先备几根？',
        '湖边一圈 60 米，每隔 10 米挂一盏，首尾是同一点。你先领几盏？',
        '要把圆木锯成 5 段，每次只锯一刀。你准备下几刀？',
        '从 3 楼爬到 8 楼，要经过几层台阶？先报一个数。',
      ],
      lengthTexts: ['100 m', '50 m', '60 m', '1 根圆木', '3 → 8 楼'],
      gapTexts: ['10 m', '10 m', '10 m', '等长段', '1 层'],
      intervalTexts: ['10', '5', '6', '4', '5'],
      placed: [
        (n) => `货架上备了 ${n} 盏。点“挂上现场”，看看缺口还是剩货。`,
        (n) => `台账写着 ${n} 根柱。点“挂上现场”，把柱子立到桥上。`,
        (n) => `货架上备了 ${n} 盏。点“挂上现场”，绕湖挂一圈。`,
        (n) => `锯台上准备了 ${n} 刀。点“挂上现场”，在圆木上试锯。`,
        (n) => `你报了 ${n} 层。点“挂上现场”，点亮楼梯检查。`,
      ],
      short: [
        (n, need) => `少了！你挂了 ${n} 盏，街上还剩黑缺口。两端都挂时要 ${need} 盏，可以继续加货。`,
        (n, need) => `柱子不够：桥上只立了 ${n} 根，内部点位还空着。两端不挂时要 ${need} 根。`,
        (n, need) => `湖边还缺灯：你挂了 ${n} 盏，环形一圈需要 ${need} 盏。`,
        (n, need) => `刀数不够：只锯了 ${n} 刀，还拼不出 5 段。正确是 ${need} 刀。`,
        (n, need) => `层数少了：你报了 ${n} 层，从 3 到 8 实际要爬 ${need} 层。`,
      ],
      extra: [
        (n, need) => `多了！货架还剩灯笼，街上已经摆不下。两端都挂只要 ${need} 盏，不是 ${n}。`,
        (n, need) => `柱子多了：桥面装不下 ${n} 根。两端不挂时只要 ${need} 根。`,
        (n, need) => `灯多了：环形一圈首尾重合，只要 ${need} 盏，不是 ${n}。`,
        (n, need) => `刀数多了：锯 ${n} 刀会多出碎段。锯成 5 段只要 ${need} 刀。`,
        (n, need) => `层数多了：你报了 ${n} 层，但 8 − 3 = ${need}。`,
      ],
      correct: [
        '全街点亮！100 ÷ 10 = 10 个间隔，两端都挂 → 10 + 1 = 11 盏。',
        '桥柱立稳！50 ÷ 10 = 5 个间隔，两端不挂 → 5 − 1 = 4 根。',
        '湖圈亮了！环形没有端点，灯数 = 间隔数 = 60 ÷ 10 = 6。',
        '锯口刚好！5 段木头之间只有 4 个切口，刀数 = 段数 − 1。',
        '楼梯点亮！从 3 到 8，层间隔 = 8 − 3 = 5。',
      ],
      hints: [
        '先算间隔：100 ÷ 10 = 10。两端都要挂，还要再加 1 盏。',
        '先算间隔：50 ÷ 10 = 5。桥两头不立柱，所以要比间隔少 1。',
        '环形首尾是同一点：灯数等于间隔数，60 ÷ 10 = 6。',
        '想象 5 段排成一排，段与段之间的缝有几条？',
        '不要数楼牌。从 3 走到 4 是第 1 层，一直走到 8。',
      ],
      insightTitles: ['两端都挂', '两端不挂', '环形', '锯木头', '爬楼梯'],
      insightSubs: [
        '间隔 + 1 = 11',
        '间隔 − 1 = 4',
        '间隔 = 6',
        '段数 − 1 = 4',
        '终点 − 起点 = 5',
      ],
      insightIcons: ['🏮', '🌉', '🌕', '🪵', '🪜'],
    },
    en: {
      doc: 'Lantern Lane · KidsLab',
      back: 'Back to platform',
      title: 'Lantern Lane',
      mission: 'STAGE',
      stock: 'STOCK',
      length: 'LENGTH',
      gap: 'GAP',
      intervals: 'GAPS',
      rule: 'RULE',
      console: 'PROP DESK',
      think: 'THINK FIRST',
      hint: 'Give me a hint',
      place: 'Place on scene',
      next: 'Next scene',
      finish: 'Light the finale',
      reset: 'Pack this stage away',
      playAgain: 'Decorate again',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      theme: 'Switch theme',
      navLabel: 'Stage progress',
      canvasLabel: 'Lantern lane scene',
      seal: 'Street lit up',
      finalKicker: 'FIVE SKINS, ONE INTERVAL IDEA',
      finalTitle: 'You lit the whole lantern lane!',
      finalText: 'Both ends, open ends, rings, saw cuts, and stairs—count the gaps first, then decide whether endpoints count.',
      stageLabels: ['Lantern street', 'Bridge posts', 'Lakeside ring', 'Saw bench', 'Tower stairs'],
      controlTitles: ['Order first, hang next', 'How many bridge posts?', 'Ring the lake', 'How many cuts?', 'How many floors up?'],
      stepperLabels: ['Order count', 'Post count', 'Lantern count', 'Cut count', 'Floor count'],
      units: ['lanterns', 'posts', 'lanterns', 'cuts', 'floors'],
      rules: ['Both ends', 'No ends', 'Ring', 'Pieces − 1', 'End − start'],
      formulas: [
        'Gaps = length ÷ spacing; both ends → count = gaps + 1',
        'Gaps = length ÷ spacing; no ends → count = gaps − 1',
        'A ring has no extra ends: count = gaps = perimeter ÷ spacing',
        'Cuts sit between pieces: cuts = pieces − 1',
        'Stairs count the steps between floors: floors = end − start',
      ],
      lessons: [
        'Count the gaps first, then ask whether both ends are included.',
        'The bridge ends already meet the banks—posts only stand on interior marks.',
        'Start and finish are the same point, so do not count it twice.',
        'The last piece has no cut after it—do not add an extra saw stroke.',
        'Climbing counts the steps between floors, not the floor numbers themselves.',
      ],
      kickers: [
        'FESTIVAL NIGHT · BOTH ENDS',
        'STONE BRIDGE · NO END POSTS',
        'MOON LAKE · RING LAYOUT',
        'WOOD SHOP · SAW CUTS',
        'LANTERN TOWER · STAIRS',
      ],
      titles: [
        '100 m street, one lantern every 10 m',
        '50 m bridge, one post every 10 m',
        '60 m lakeside loop, one lantern every 10 m',
        'Saw one log into 5 pieces',
        'Climb from floor 3 to floor 8',
      ],
      prompts: [
        'Order the stock first, then hang it. Too few leaves dark gaps; too many leaves leftovers.',
        'No posts on the bridge ends. Order first, then stand the posts on the deck.',
        'The loop joins head to tail. Order first, then hang a full ring.',
        'One cut at a time. Choose the cut count, then try the saw.',
        'Count the floors between. Choose a number, then light the stairs.',
      ],
      starts: [
        'A 100 m street gets one lantern every 10 m, including both ends. How many do you order?',
        'A 50 m bridge gets one post every 10 m, with no posts on either end. How many do you prepare?',
        'A 60 m lakeside loop gets one lantern every 10 m, and the start is the finish. How many do you order?',
        'You want 5 equal pieces from one log, one cut at a time. How many cuts?',
        'From floor 3 to floor 8, how many floors do you climb?',
      ],
      lengthTexts: ['100 m', '50 m', '60 m', '1 log', '3 → 8'],
      gapTexts: ['10 m', '10 m', '10 m', 'equal parts', '1 floor'],
      intervalTexts: ['10', '5', '6', '4', '5'],
      placed: [
        (n) => `Stock ready: ${n}. Tap “Place on scene” to test gaps or leftovers.`,
        (n) => `Ledger says ${n} posts. Tap “Place on scene” to stand them on the bridge.`,
        (n) => `Stock ready: ${n}. Tap “Place on scene” to hang the lake ring.`,
        (n) => `Saw bench set for ${n} cuts. Tap “Place on scene” to try the log.`,
        (n) => `You chose ${n} floors. Tap “Place on scene” to light the stairs.`,
      ],
      short: [
        (n, need) => `Too few! You hung ${n}, and dark gaps remain. Both ends need ${need}. Add more stock.`,
        (n, need) => `Not enough posts: only ${n} on the deck. With no end posts you need ${need}.`,
        (n, need) => `The lake is incomplete: ${n} hung, but a ring needs ${need}.`,
        (n, need) => `Not enough cuts: ${n} cuts cannot make 5 pieces. The answer is ${need}.`,
        (n, need) => `Too low: you chose ${n}, but 3 to 8 is ${need} floors.`,
      ],
      extra: [
        (n, need) => `Too many! Leftover lanterns remain. Both ends need only ${need}, not ${n}.`,
        (n, need) => `Too many posts: the deck cannot take ${n}. No-end posts need only ${need}.`,
        (n, need) => `Too many lanterns: a ring joins ends, so only ${need} are needed, not ${n}.`,
        (n, need) => `Too many cuts: ${n} cuts oversplit the log. 5 pieces need only ${need} cuts.`,
        (n, need) => `Too high: you chose ${n}, but 8 − 3 = ${need}.`,
      ],
      correct: [
        'Street lit! 100 ÷ 10 = 10 gaps, both ends → 10 + 1 = 11 lanterns.',
        'Bridge set! 50 ÷ 10 = 5 gaps, no ends → 5 − 1 = 4 posts.',
        'Lake ring glowing! No extra ends, so count = gaps = 60 ÷ 10 = 6.',
        'Perfect cuts! 5 pieces have only 4 joints, so cuts = pieces − 1.',
        'Stairs lit! From 3 to 8, floor gaps = 8 − 3 = 5.',
      ],
      hints: [
        'Count gaps first: 100 ÷ 10 = 10. Both ends count, so add 1 more.',
        'Count gaps first: 50 ÷ 10 = 5. No end posts means one fewer than the gaps.',
        'On a ring, start equals finish: count equals gaps, 60 ÷ 10 = 6.',
        'Line up 5 pieces. How many seams sit between them?',
        'Do not count doorplates. Walking 3→4 is the first floor up.',
      ],
      insightTitles: ['Both ends', 'No ends', 'Ring', 'Saw cuts', 'Stairs'],
      insightSubs: [
        'gaps + 1 = 11',
        'gaps − 1 = 4',
        'gaps = 6',
        'pieces − 1 = 4',
        'end − start = 5',
      ],
      insightIcons: ['🏮', '🌉', '🌕', '🪵', '🪜'],
    },
  };

  const MISSIONS = [
    {
      id: 'street',
      skin: 'street',
      length: 100,
      gap: 10,
      intervals: 10,
      answer: 11,
      min: 1,
      max: 20,
      defaultGuess: 10,
      mode: 'both',
    },
    {
      id: 'bridge',
      skin: 'bridge',
      length: 50,
      gap: 10,
      intervals: 5,
      answer: 4,
      min: 1,
      max: 12,
      defaultGuess: 5,
      mode: 'neither',
    },
    {
      id: 'ring',
      skin: 'ring',
      length: 60,
      gap: 10,
      intervals: 6,
      answer: 6,
      min: 1,
      max: 14,
      defaultGuess: 7,
      mode: 'ring',
    },
    {
      id: 'saw',
      skin: 'saw',
      length: 5,
      gap: 1,
      intervals: 4,
      answer: 4,
      min: 1,
      max: 10,
      defaultGuess: 5,
      mode: 'cut',
    },
    {
      id: 'stairs',
      skin: 'stairs',
      length: 5,
      gap: 1,
      intervals: 5,
      answer: 5,
      min: 1,
      max: 12,
      defaultGuess: 6,
      mode: 'stairs',
      startFloor: 3,
      endFloor: 8,
    },
  ];

  const STORAGE_KEY = 'kidslab.lantern-lane';
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
    stockValue: $('#stockValue'),
    lengthReadout: $('#lengthReadout'),
    gapReadout: $('#gapReadout'),
    intervalReadout: $('#intervalReadout'),
    ruleReadout: $('#ruleReadout'),
    glowSeal: $('#glowSeal'),
    sealText: $('#sealText'),
    status: $('#status'),
    formulaText: $('#formulaText'),
    stepperLabel: $('#stepperLabel'),
    guessValue: $('#guessValue'),
    unitLabel: $('#unitLabel'),
    lessonText: $('#lessonText'),
    controlTitle: $('#controlTitle'),
    hintBtn: $('#hintBtn'),
    placeBtn: $('#placeBtn'),
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
  let state = loadState();

  function freshState() {
    return {
      mission: 0,
      guess: MISSIONS[0].defaultGuess,
      placed: false,
      result: 'idle',
      solved: false,
      completed: false,
      feedback: 'start',
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
      const guess = Number.isInteger(saved.guess)
        ? Math.min(mission.max, Math.max(mission.min, saved.guess))
        : mission.defaultGuess;
      return {
        mission: saved.mission,
        guess,
        placed: Boolean(saved.placed),
        result: ['idle', 'short', 'extra', 'correct'].includes(saved.result) ? saved.result : 'idle',
        solved: Boolean(saved.solved) && saved.result === 'correct',
        completed: Boolean(saved.completed),
        feedback: typeof saved.feedback === 'string' ? saved.feedback : 'start',
      };
    } catch {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota */
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
    else if (kind === 'place') {
      tone(360, 0.1, 'sine', 0.04);
      tone(540, 0.12, 'triangle', 0.03, 0.05);
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
        'kidslab.progress.lantern-lane',
        JSON.stringify({ status: 'completed', at: Date.now() }),
      );
    } catch {
      /* ignore */
    }
  }

  function statusMessage() {
    const m = mission();
    if (state.feedback === 'hint') return t('hints')[state.mission];
    if (state.feedback === 'placed') return t('placed')[state.mission](state.guess);
    if (state.feedback === 'short') return t('short')[state.mission](state.guess, m.answer);
    if (state.feedback === 'extra') return t('extra')[state.mission](state.guess, m.answer);
    if (state.feedback === 'correct') return t('correct')[state.mission];
    return t('starts')[state.mission];
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
      card.innerHTML = `<span aria-hidden="true">${t('insightIcons')[index]}</span><strong>${title}<br><span>${t('insightSubs')[index]}</span></strong><b>${MISSIONS[index].answer}</b>`;
      elements.finaleGrid.appendChild(card);
    });
  }

  function updateChrome() {
    const m = mission();
    elements.missionNumber.textContent = String(state.mission + 1);
    elements.missionKicker.textContent = t('kickers')[state.mission];
    elements.missionTitle.textContent = t('titles')[state.mission];
    elements.missionPrompt.textContent = t('prompts')[state.mission];
    elements.stageLabel.textContent = t('stageLabels')[state.mission];
    elements.controlTitle.textContent = t('controlTitles')[state.mission];
    elements.stepperLabel.textContent = t('stepperLabels')[state.mission];
    elements.unitLabel.textContent = t('units')[state.mission];
    elements.formulaText.textContent = t('formulas')[state.mission];
    elements.lessonText.textContent = t('lessons')[state.mission];
    elements.lengthReadout.textContent = t('lengthTexts')[state.mission];
    elements.gapReadout.textContent = t('gapTexts')[state.mission];
    elements.intervalReadout.textContent = t('intervalTexts')[state.mission];
    elements.ruleReadout.textContent = t('rules')[state.mission];
    elements.guessValue.textContent = String(state.guess);
    elements.stockValue.textContent = String(state.placed ? state.guess : 0);
    elements.status.textContent = statusMessage();
    elements.status.classList.toggle('is-good', state.result === 'correct');
    elements.status.classList.toggle('is-bad', state.result === 'short' || state.result === 'extra');
    elements.stage.dataset.skin = m.skin;
    elements.stage.dataset.result = state.result;
    elements.canvas.setAttribute('aria-label', t('canvasLabel'));
    elements.sealText.textContent = t('seal');
    elements.glowSeal.hidden = state.result !== 'correct';

    const locked = state.solved;
    elements.minusBtn.disabled = locked || state.guess <= m.min;
    elements.plusBtn.disabled = locked || state.guess >= m.max;
    elements.placeBtn.hidden = locked;
    elements.placeBtn.disabled = false;
    elements.nextBtn.hidden = !locked;
    elements.nextBtn.textContent = state.mission >= MISSIONS.length - 1 ? t('finish') : t('next');
    elements.hintBtn.disabled = locked;

    renderNav();
    drawScene();
  }

  function drawLantern(ctx, x, y, lit, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.strokeStyle = cssVar('--line');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(0, -30);
    ctx.stroke();
    ctx.fillStyle = lit ? cssVar('--lantern') : colorMix(cssVar('--muted'), cssVar('--panel'), 0.45);
    ctx.beginPath();
    ctx.ellipse(0, -8, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (lit) {
      ctx.fillStyle = cssVar('--gold');
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(0, -8, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function colorMix(a, b, ratio) {
    // simple fallback: prefer a when lit styling fails
    return a || b || '#888';
  }

  function resizeCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width: rect.width, height: rect.height };
  }

  function drawScene() {
    const { ctx, width, height } = resizeCanvas(elements.canvas);
    const m = mission();
    ctx.clearRect(0, 0, width, height);

    const ink = cssVar('--ink');
    const line = cssVar('--line');
    const panel = cssVar('--panel');
    const gold = cssVar('--gold');
    const teal = cssVar('--teal');
    const road = cssVar('--road');
    const good = cssVar('--good');
    const bad = cssVar('--bad');

    if (m.skin === 'street' || m.skin === 'bridge') {
      const y = height * 0.62;
      const left = width * 0.08;
      const right = width * 0.92;
      const span = right - left;

      // ground / water
      if (m.skin === 'bridge') {
        ctx.fillStyle = colorMix(cssVar('--sky-2'), teal, 0.5);
        ctx.fillRect(0, y + 18, width, height - y);
        ctx.fillStyle = road;
        ctx.beginPath();
        ctx.moveTo(left - 20, y + 8);
        ctx.quadraticCurveTo(width / 2, y - 40, right + 20, y + 8);
        ctx.lineTo(right + 20, y + 28);
        ctx.quadraticCurveTo(width / 2, y - 10, left - 20, y + 28);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.strokeStyle = line;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
        ctx.fillStyle = road;
        ctx.fillRect(left, y, span, 16);
      }

      const marks = m.intervals + 1;
      const placedCount = state.placed ? state.guess : 0;
      for (let i = 0; i < marks; i += 1) {
        const x = left + (span * i) / m.intervals;
        const isEnd = i === 0 || i === marks - 1;
        const shouldPlace = m.mode === 'both' ? true : m.mode === 'neither' ? !isEnd : true;
        if (!shouldPlace) {
          ctx.fillStyle = cssVar('--muted');
          ctx.font = '700 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(lang === 'zh' ? '岸' : 'bank', x, y + 36);
          continue;
        }

        // tick
        ctx.strokeStyle = line;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - 8);
        ctx.lineTo(x, y + 8);
        ctx.stroke();

        const interiorIndex = m.mode === 'neither' ? i - 1 : i;
        const lit = state.placed && interiorIndex < placedCount && state.result === 'correct';
        const filled = state.placed && interiorIndex < placedCount;
        const missing = state.placed && interiorIndex >= placedCount && shouldPlace;

        if (m.skin === 'bridge') {
          ctx.fillStyle = filled ? (state.result === 'correct' ? teal : gold) : panel;
          ctx.strokeStyle = missing ? bad : line;
          ctx.lineWidth = 2;
          ctx.fillRect(x - 7, y - 46, 14, 46);
          ctx.strokeRect(x - 7, y - 46, 14, 46);
          if (missing) {
            ctx.fillStyle = bad;
            ctx.globalAlpha = 0.25;
            ctx.fillRect(x - 12, y - 54, 24, 16);
            ctx.globalAlpha = 1;
          }
        } else {
          drawLantern(ctx, x, y - 10, filled && (state.result !== 'short' || interiorIndex < placedCount), 1);
          if (missing) {
            ctx.fillStyle = bad;
            ctx.globalAlpha = 0.35;
            ctx.beginPath();
            ctx.arc(x, y - 18, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      }

      // leftovers
      if (state.placed && state.guess > m.answer) {
        const extra = state.guess - m.answer;
        for (let i = 0; i < Math.min(extra, 6); i += 1) {
          drawLantern(ctx, width * 0.12 + i * 28, height * 0.28, false, 0.85);
        }
        ctx.fillStyle = ink;
        ctx.font = '800 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(lang === 'zh' ? `剩 ${extra}` : `+${extra} left`, width * 0.12, height * 0.18);
      }

      // labels
      ctx.fillStyle = ink;
      ctx.font = '800 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('0 m', left, y + 42);
      ctx.fillText(`${m.length} m`, right, y + 42);
    } else if (m.skin === 'ring') {
      const cx = width / 2;
      const cy = height * 0.52;
      const radius = Math.min(width, height) * 0.28;
      ctx.strokeStyle = line;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = colorMix(cssVar('--sky-2'), teal, 0.4);
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      const placedCount = state.placed ? state.guess : 0;
      for (let i = 0; i < m.intervals; i += 1) {
        const angle = -Math.PI / 2 + (Math.PI * 2 * i) / m.intervals;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        const filled = state.placed && i < placedCount;
        const missing = state.placed && i >= placedCount;
        drawLantern(ctx, x, y + 18, filled, 0.95);
        if (missing) {
          ctx.fillStyle = bad;
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      if (state.placed && state.guess > m.answer) {
        ctx.fillStyle = ink;
        ctx.font = '800 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(lang === 'zh' ? `多领 ${state.guess - m.answer} 盏` : `${state.guess - m.answer} extra`, cx, height * 0.14);
      }
    } else if (m.skin === 'saw') {
      const left = width * 0.12;
      const right = width * 0.88;
      const y = height * 0.55;
      const pieces = 5;
      const pieceW = (right - left) / pieces;

      ctx.fillStyle = '#c48a4a';
      ctx.strokeStyle = line;
      ctx.lineWidth = 3;
      ctx.beginPath();
      roundRect(ctx, left, y - 28, right - left, 56, 16);
      ctx.fill();
      ctx.stroke();

      const cuts = state.placed ? Math.min(state.guess, pieces - 1 + 3) : 0;
      for (let i = 1; i < pieces; i += 1) {
        const x = left + pieceW * i;
        const cutHere = state.placed && i <= Math.min(state.guess, pieces - 1);
        ctx.strokeStyle = cutHere ? good : line;
        ctx.setLineDash(cutHere ? [] : [6, 6]);
        ctx.lineWidth = cutHere ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(x, y - 34);
        ctx.lineTo(x, y + 34);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // extra cuts beyond needed
      if (state.placed && state.guess > m.answer) {
        for (let i = 0; i < Math.min(state.guess - m.answer, 3); i += 1) {
          const x = left + pieceW * (0.35 + i * 0.2);
          ctx.strokeStyle = bad;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, y - 40);
          ctx.lineTo(x + 10, y + 40);
          ctx.stroke();
        }
      }

      ctx.fillStyle = ink;
      ctx.font = '800 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lang === 'zh' ? `目标 ${pieces} 段 · 已下 ${cuts} 刀` : `Goal ${pieces} pcs · ${cuts} cuts`, width / 2, height * 0.22);
    } else if (m.skin === 'stairs') {
      const start = m.startFloor;
      const end = m.endFloor;
      const steps = end - start;
      const baseY = height * 0.78;
      const stepW = Math.min(70, (width * 0.7) / steps);
      const stepH = Math.min(36, (height * 0.45) / steps);
      const originX = (width - stepW * steps) / 2;

      const litSteps = state.placed ? Math.min(state.guess, steps + 3) : 0;
      for (let i = 0; i < steps; i += 1) {
        const x = originX + i * stepW;
        const y = baseY - (i + 1) * stepH;
        const on = state.placed && i < litSteps;
        ctx.fillStyle = on ? (state.result === 'correct' ? gold : teal) : panel;
        ctx.strokeStyle = state.placed && i >= litSteps ? bad : line;
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, stepW * (steps - i) + 8, stepH);
        ctx.strokeRect(x, y, stepW * (steps - i) + 8, stepH);
        ctx.fillStyle = ink;
        ctx.font = '800 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(String(start + i + 1), x + 8, y + stepH - 10);
      }

      ctx.fillStyle = ink;
      ctx.font = '800 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        lang === 'zh' ? `${start} 楼 → ${end} 楼` : `Floor ${start} → ${end}`,
        width / 2,
        height * 0.16,
      );

      if (state.placed && state.guess > m.answer) {
        ctx.fillStyle = bad;
        ctx.font = '800 14px sans-serif';
        ctx.fillText(lang === 'zh' ? `多报了 ${state.guess - m.answer} 层` : `${state.guess - m.answer} too many`, width / 2, height * 0.28);
      }
    }

    // success sparkles
    if (state.result === 'correct') {
      sparkles.forEach((s) => {
        ctx.globalAlpha = s.a;
        ctx.fillStyle = gold;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function spawnSparkles() {
    const rect = elements.canvas.getBoundingClientRect();
    sparkles = Array.from({ length: 18 }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height * 0.7,
      r: 1.5 + Math.random() * 2.5,
      a: 0.4 + Math.random() * 0.6,
      vy: 0.2 + Math.random() * 0.6,
    }));
  }

  function tickSparkles() {
    if (state.result === 'correct' && sparkles.length) {
      sparkles.forEach((s) => {
        s.y -= s.vy;
        s.a *= 0.992;
        if (s.a < 0.08) {
          s.y = elements.canvas.getBoundingClientRect().height * 0.7;
          s.a = 0.6;
        }
      });
      drawScene();
    }
    animFrame = requestAnimationFrame(tickSparkles);
  }

  function drawFinaleBurst() {
    if (!elements.finaleCanvas || elements.finale.hidden) return;
    const { ctx, width, height } = resizeCanvas(elements.finaleCanvas);
    ctx.clearRect(0, 0, width, height);
    const tNow = performance.now() / 1000;
    for (let i = 0; i < 24; i += 1) {
      const ang = (Math.PI * 2 * i) / 24 + tNow;
      const rad = 40 + (i % 5) * 18 + Math.sin(tNow * 2 + i) * 8;
      const x = width / 2 + Math.cos(ang) * rad;
      const y = height / 2 + Math.sin(ang) * rad * 0.55;
      ctx.fillStyle = i % 2 ? cssVar('--gold') : cssVar('--lantern');
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function adjustGuess(delta) {
    if (state.solved) return;
    const m = mission();
    const next = Math.min(m.max, Math.max(m.min, state.guess + delta));
    if (next === state.guess) return;
    state.guess = next;
    state.placed = false;
    state.result = 'idle';
    state.feedback = 'start';
    playSound('tap');
    track('adjust_count');
    saveState();
    updateChrome();
  }

  function placeGuess() {
    if (state.solved) return;
    const m = mission();
    state.placed = true;
    if (state.guess === m.answer) {
      state.result = 'correct';
      state.solved = true;
      state.feedback = 'correct';
      spawnSparkles();
      playSound('good');
      track('stage_clear');
      stageProgress();
    } else if (state.guess < m.answer) {
      state.result = 'short';
      state.feedback = 'short';
      playSound('bad');
      track('too_few');
    } else {
      state.result = 'extra';
      state.feedback = 'extra';
      playSound('bad');
      track('too_many');
    }
    saveState();
    updateChrome();
  }

  function showHint() {
    if (state.solved) return;
    state.feedback = 'hint';
    playSound('tap');
    track('hint');
    saveState();
    updateChrome();
  }

  function resetMission() {
    const m = mission();
    state.guess = m.defaultGuess;
    state.placed = false;
    state.result = 'idle';
    state.solved = false;
    state.feedback = 'start';
    sparkles = [];
    playSound('tap');
    track('reset_stage');
    saveState();
    updateChrome();
  }

  function goNext() {
    if (!state.solved) return;
    if (state.mission >= MISSIONS.length - 1) {
      state.completed = true;
      saveState();
      markComplete();
      playSound('win');
      openFinale();
      return;
    }
    state.mission += 1;
    state.guess = mission().defaultGuess;
    state.placed = false;
    state.result = 'idle';
    state.solved = false;
    state.feedback = 'start';
    sparkles = [];
    playSound('place');
    track('next_stage');
    saveState();
    updateChrome();
  }

  function openFinale() {
    renderFinaleGrid();
    elements.finale.hidden = false;
    elements.course.inert = true;
    drawFinaleBurst();
    elements.playAgainBtn.focus();
  }

  function closeFinale() {
    elements.finale.hidden = true;
    elements.course.inert = false;
  }

  function playAgain() {
    state = freshState();
    sparkles = [];
    try {
      localStorage.removeItem('kidslab.progress.lantern-lane');
    } catch {
      /* ignore */
    }
    saveState();
    closeFinale();
    playSound('place');
    track('replay');
    updateChrome();
  }

  function bind() {
    elements.minusBtn.addEventListener('click', () => adjustGuess(-1));
    elements.plusBtn.addEventListener('click', () => adjustGuess(1));
    elements.placeBtn.addEventListener('click', placeGuess);
    elements.nextBtn.addEventListener('click', goNext);
    elements.hintBtn.addEventListener('click', showHint);
    elements.resetBtn.addEventListener('click', resetMission);
    elements.playAgainBtn.addEventListener('click', playAgain);
    elements.soundBtn.addEventListener('click', () => {
      setMuted(!muted);
      if (!muted) playSound('tap');
    });
    elements.langBtn?.addEventListener('click', () => window.cool.preferences.toggleLang());
    elements.themeBtn?.addEventListener('click', () => window.cool.preferences.toggleTheme());
    window.addEventListener('resize', () => {
      drawScene();
      drawFinaleBurst();
    });
    window.addEventListener('themechange', () => {
      drawScene();
      drawFinaleBurst();
    });
  }

  function boot() {
    try {
      muted = localStorage.getItem(SOUND_KEY) === '1';
    } catch {
      muted = false;
    }

    bind();
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
        syncSoundButton();
        if (state.completed) {
          renderFinaleGrid();
          openFinale();
        }
        updateChrome();
      },
    });

    if (state.completed) {
      openFinale();
    }
    tickSparkles();
    setInterval(drawFinaleBurst, 80);
  }

  boot();
})();
