(() => {
  'use strict';

  const SAVE_KEY = 'kidslab.four-color-kingdom';
  const SOUND_KEY = 'kidslab.sound.muted';

  const COLORS = [
    { id: 'rose', css: 'var(--rose)', hex: '#ef476f' },
    { id: 'sun', css: 'var(--sun)', hex: '#ffd166' },
    { id: 'mint', css: 'var(--mint)', hex: '#06d6a0' },
    { id: 'sky', css: 'var(--sky)', hex: '#118ab2' },
    { id: 'grape', css: 'var(--grape)', hex: '#9b5de5' },
  ];

  const I18N = {
    zh: {
      doc: '四色王国 · KidsLab',
      back: '返回平台',
      title: '四色王国',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      painted: '已上色',
      buckets: '颜料桶',
      treasury: '国库',
      paletteGuide: '点领地，再点颜料桶。预算内越少越好。',
      hint: '轻提示',
      clear: '清空重画',
      check: '呈上地图',
      next: '下一张地图',
      finalKicker: '四张王国地图全部上色',
      finalTitle: '你摸到了四色定理的手感！',
      finalText: '相邻不同色、预算能压到 3 或 4，再刁钻的平面地图也不会逼你拿出第五桶颜料。',
      playAgain: '再巡一遍王国',
      missionsLabel: '王国地图任务',
      mapLabel: '王国地图',
      paletteLabel: '颜料桶',
      lockedMission: '先完成前一张地图',
      coins: (n) => `🪙 ${n}`,
      colorNames: {
        rose: '玫瑰红',
        sun: '阳光黄',
        mint: '薄荷绿',
        sky: '天空蓝',
        grape: '葡萄紫',
      },
      colorHint: {
        rose: '第 1 桶',
        sun: '第 2 桶',
        mint: '第 3 桶',
        sky: '第 4 桶',
        grape: '超额桶',
      },
      regionNames: {
        crown: '王城',
        north: '北境',
        east: '东湾',
        south: '南原',
        west: '西岭',
        lake: '镜湖',
        harbor: '港湾',
        orchard: '果园',
        mine: '矿脉',
        marsh: '湿地',
        peak: '雪峰',
        fort: '边堡',
        delta: '河口',
        grove: '密林',
        lord: '领主城',
        plain: '麦田',
        coast: '海岸',
        ridge: '山脊',
        isle: '小岛',
        core: '中枢',
        a: '赤原',
        b: '青丘',
        c: '白沙',
        d: '紫谷',
        e: '金岸',
        f: '翠湾',
        g: '墨林',
      },
      m1Kicker: '迎宾图 · 先会分邻居',
      m1Title: '相邻领地，不能同色',
      m1Text: '点一块领地，再点颜料桶。共享边界的邻居必须换颜色。',
      m1Lesson: '四个领地两两相邻时，正好需要四种颜色。',
      m1Hint: '中间王城先上色；东、西、南三块外环彼此也相邻，必须再各用一色。',
      m1Rule: '共享边界的领地不能同色；只碰角点的可以同色。',
      m1Ready: '先点王城或任意空白领地，再选一种颜料。',
      m2Kicker: '紧预算 · 三桶够不够？',
      m2Title: '国库只批了三桶颜料',
      m2Text: '这张图看起来花，其实三色就能涂满。超预算交不了卷。',
      m2Lesson: '不是每张图都要四色——有的图三色就够。',
      m2Hint: '先涂中心镜湖，外圈四个领地隔一个涂同色——像棋盘，第三色留给和两边都挨着的冲突处。',
      m2Rule: '预算 3 桶：用到第 4 色就超支，呈卷会被退回。',
      m2Ready: '预算只有 3 桶。试试看，别急着开第四桶。',
      m3Kicker: '刁民领主 · 指定天空蓝',
      m3Title: '领主城必须是天空蓝',
      m3Text: '有一块领地被点名了。从固定色开始，把邻居全部排开。',
      m3Lesson: '固定一色等于加约束：先锁定它，再给邻居让路。',
      m3Hint: '领主城已是天空蓝。先把它的邻居涂成另外三种，再填远处。',
      m3Rule: '领主城已锁定天空蓝，不能改色，邻居也不能再用蓝。',
      m3Ready: '领主城已经刷成天空蓝。从它的邻居开始规划。',
      m4Kicker: '终极图 · 四色永远够',
      m4Title: '这张图逼你掏第五桶吗？',
      m4Text: '看起来很挤。先别开超额桶——重排之后，四色一定够。',
      m4Lesson: '平面地图最多四色就够：这是四色定理的手感。',
      m4Hint: '超额的葡萄紫先别碰。把地图分成「棋盘块」，冲突处再插入第 3、第 4 色。',
      m4Rule: '预算 4 桶。第五桶（葡萄紫）是诱饵——真正的解用不到它。',
      m4Ready: '魔鬼地图登场。四色一定够，别被第五桶骗走金币。',
      paintedRegion: (name, color) => `${name} 刷成了${color}。`,
      erasedRegion: (name) => `${name} 的颜色擦掉了。`,
      fixedBlock: '领主城被法令锁住了，不能改色。',
      budgetBlock: (n) => `预算只有 ${n} 桶。先改用已开的颜色，或重排邻居。`,
      overBudgetLive: (n) => `已开 ${n} 桶，超过预算啦。改掉一种颜色再呈卷。`,
      conflictLive: (a, b) => `${a} 和 ${b} 贴着边却同色，领主要吵翻了。`,
      incomplete: '还有空白领地。先把地图涂满。',
      conflictSubmit: '还有相邻同色。红圈标出的领地需要换色。',
      overBudgetSubmit: (n, b) => `用了 ${n} 桶，超过预算 ${b}。省一点再呈卷。`,
      fixedFail: '领主城必须保持天空蓝。',
      success: (used, budget, coins) => `过关！用了 ${used}/${budget} 桶，国库剩 🪙 ${coins}。`,
      cleared: '颜料全部收回，地图又变空白了。',
      deskTitlePaint: '选色 · 上色 · 交卷',
      deskTitleDone: '本图已盖章通过',
      conflictPair: (a, b) => `${a} ↔ ${b}`,
    },
    en: {
      doc: 'Four-Color Kingdom · KidsLab',
      back: 'Back to platform',
      title: 'Four-Color Kingdom',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      painted: 'Painted',
      buckets: 'Buckets',
      treasury: 'Treasury',
      paletteGuide: 'Tap a region, then a paint bucket. Fewer colors save more coins.',
      hint: 'Small hint',
      clear: 'Clear map',
      check: 'Present the map',
      next: 'Next map',
      finalKicker: 'ALL FOUR KINGDOM MAPS COLORED',
      finalTitle: 'You Felt the Four-Color Theorem!',
      finalText: 'Keep neighbors different, squeeze the budget to 3 or 4, and no planar map will force a fifth bucket.',
      playAgain: 'Tour the kingdom again',
      missionsLabel: 'Kingdom map missions',
      mapLabel: 'Kingdom map',
      paletteLabel: 'Paint buckets',
      lockedMission: 'Finish the previous map first',
      coins: (n) => `🪙 ${n}`,
      colorNames: {
        rose: 'Rose',
        sun: 'Sunshine',
        mint: 'Mint',
        sky: 'Sky',
        grape: 'Grape',
      },
      colorHint: {
        rose: 'Bucket 1',
        sun: 'Bucket 2',
        mint: 'Bucket 3',
        sky: 'Bucket 4',
        grape: 'Extra bucket',
      },
      regionNames: {
        crown: 'Crown City',
        north: 'North',
        east: 'East Bay',
        south: 'South Plain',
        west: 'West Ridge',
        lake: 'Mirror Lake',
        harbor: 'Harbor',
        orchard: 'Orchard',
        mine: 'Mines',
        marsh: 'Marsh',
        peak: 'Snow Peak',
        fort: 'Border Fort',
        delta: 'Delta',
        grove: 'Grove',
        lord: "Lord's Keep",
        plain: 'Wheat Field',
        coast: 'Coast',
        ridge: 'Ridge',
        isle: 'Isle',
        core: 'Core',
        a: 'Redland',
        b: 'Green Hill',
        c: 'White Sand',
        d: 'Purple Vale',
        e: 'Gold Shore',
        f: 'Jade Bay',
        g: 'Inkwood',
      },
      m1Kicker: 'WELCOME MAP · LEARN NEIGHBORS',
      m1Title: 'Neighbors Cannot Share a Color',
      m1Text: 'Tap a region, then a paint bucket. Regions that share a border need different colors.',
      m1Lesson: 'When four regions all touch each other, you need exactly four colors.',
      m1Hint: 'Color Crown City first. East, West, and South all touch each other too, so each needs its own color.',
      m1Rule: 'Shared borders need different colors. Touching only at a corner is fine.',
      m1Ready: 'Tap Crown City or any blank land, then pick a paint color.',
      m2Kicker: 'TIGHT BUDGET · ONLY THREE?',
      m2Title: 'The Treasury Approved Three Buckets',
      m2Text: 'This map looks busy, but three colors are enough. Over budget maps get rejected.',
      m2Lesson: 'Not every map needs four colors — some are happy with three.',
      m2Hint: 'Paint Mirror Lake first, then alternate the four outer lands like a checkerboard. Use the third color only where both neighbors block you.',
      m2Rule: 'Budget: 3 buckets. A fourth color overspends and fails the review.',
      m2Ready: 'Only three buckets. Try not to open a fourth.',
      m3Kicker: 'STUBBORN LORD · SKY BLUE ONLY',
      m3Title: "The Lord's Keep Must Stay Sky Blue",
      m3Text: 'One region is locked. Start from that fixed color and push neighbors apart.',
      m3Lesson: 'A fixed color is a constraint: lock it first, then free the neighbors.',
      m3Hint: "The keep is sky blue. Color its neighbors with the other three, then fill the far lands.",
      m3Rule: "The keep is locked sky blue. Neighbors cannot reuse blue.",
      m3Ready: "The keep is already sky blue. Plan outward from its neighbors.",
      m4Kicker: 'FINAL MAP · FOUR ALWAYS WORK',
      m4Title: 'Will This Map Force a Fifth Bucket?',
      m4Text: 'It looks cramped. Skip the extra bucket — with a better plan, four colors always work.',
      m4Lesson: 'Every planar map needs at most four colors. That is the four-color theorem feel.',
      m4Hint: 'Leave grape alone. Block the map into groups, then insert a 3rd and 4th color only at conflicts.',
      m4Rule: 'Budget: 4 buckets. The fifth grape bucket is bait — real solutions never need it.',
      m4Ready: 'Devil map time. Four colors are enough. Do not spend coins on a fifth bucket.',
      paintedRegion: (name, color) => `${name} is now ${color}.`,
      erasedRegion: (name) => `${name} is blank again.`,
      fixedBlock: "The lord's decree locks this keep. Color cannot change.",
      budgetBlock: (n) => `Budget is only ${n} buckets. Reuse an opened color or recolor neighbors.`,
      overBudgetLive: (n) => `${n} buckets are open — over budget. Recolor before presenting.`,
      conflictLive: (a, b) => `${a} and ${b} share a border in the same color. The lords will quarrel.`,
      incomplete: 'Blank lands remain. Finish the whole map first.',
      conflictSubmit: 'Neighbor conflicts remain. Recolor the lands marked in red.',
      overBudgetSubmit: (n, b) => `Used ${n} buckets, over the budget of ${b}. Save paint and try again.`,
      fixedFail: "The lord's keep must stay sky blue.",
      success: (used, budget, coins) => `Passed! Used ${used}/${budget} buckets. Treasury keeps 🪙 ${coins}.`,
      cleared: 'All paint returned. The map is blank again.',
      deskTitlePaint: 'Pick · Paint · Present',
      deskTitleDone: 'This map is sealed',
      conflictPair: (a, b) => `${a} ↔ ${b}`,
    },
  };

  /* ---------- Maps ----------
     adjacency is undirected; paths in viewBox 0..100
  */
  const MAPS = [
    {
      // K4: crown + three outer wedges (east/west/south) that all pairwise share a border
      id: 'welcome',
      budget: 4,
      showExtra: false,
      startCoins: 4,
      fixed: {},
      regions: [
        {
          id: 'crown',
          d: 'M50 44 L60 54 L50 62 L40 54 Z',
          label: [50, 53],
          neighbors: ['east', 'west', 'south'],
        },
        {
          // top-right wedge: outer N→SE plus crown top/right edges
          id: 'east',
          d: 'M50 8 L90 88 L60 54 L50 44 Z',
          label: [68, 42],
          neighbors: ['crown', 'west', 'south'],
        },
        {
          // top-left wedge: outer N→SW plus crown top/left edges
          id: 'west',
          d: 'M50 8 L50 44 L40 54 L10 88 Z',
          label: [32, 42],
          neighbors: ['crown', 'east', 'south'],
        },
        {
          // bottom wedge: outer SE→SW plus crown right/bottom/left edges
          id: 'south',
          d: 'M90 88 L10 88 L40 54 L50 62 L60 54 Z',
          label: [50, 80],
          neighbors: ['crown', 'east', 'west'],
        },
      ],
    },
    {
      // Wheel with 4 outer lands (even cycle) + center => χ = 3
      id: 'budget3',
      budget: 3,
      showExtra: false,
      startCoins: 3,
      fixed: {},
      regions: [
        {
          id: 'lake',
          d: 'M40 40 H60 V60 H40 Z',
          label: [50, 50],
          neighbors: ['harbor', 'orchard', 'mine', 'peak'],
        },
        {
          id: 'harbor',
          d: 'M18 10 H82 L60 40 H40 Z',
          label: [50, 24],
          neighbors: ['lake', 'orchard', 'peak'],
        },
        {
          id: 'orchard',
          d: 'M82 10 L92 50 L60 60 V40 Z',
          label: [76, 38],
          neighbors: ['lake', 'harbor', 'mine'],
        },
        {
          id: 'mine',
          d: 'M92 50 L82 90 H18 L40 60 H60 Z',
          label: [50, 76],
          neighbors: ['lake', 'orchard', 'peak'],
        },
        {
          id: 'peak',
          d: 'M18 10 L40 40 V60 L18 90 L8 50 Z',
          label: [22, 50],
          neighbors: ['lake', 'harbor', 'mine'],
        },
      ],
    },
    {
      // Lord keep fixed sky-blue at top-center; core touches every land
      id: 'lord',
      budget: 4,
      showExtra: false,
      startCoins: 4,
      fixed: { lord: 'sky' },
      regions: [
        {
          id: 'lord',
          d: 'M36 12 H64 V36 H36 Z',
          label: [50, 24],
          neighbors: ['plain', 'coast', 'core'],
          badge: '👑',
        },
        {
          id: 'plain',
          d: 'M10 12 H36 V36 L28 48 H10 Z',
          label: [22, 28],
          neighbors: ['lord', 'core', 'isle'],
        },
        {
          id: 'coast',
          d: 'M64 12 H90 V48 H72 L64 36 Z',
          label: [78, 28],
          neighbors: ['lord', 'core', 'ridge'],
        },
        {
          id: 'isle',
          d: 'M10 48 H28 L36 60 V88 H10 Z',
          label: [22, 68],
          neighbors: ['plain', 'core', 'ridge'],
        },
        {
          id: 'ridge',
          d: 'M72 48 H90 V88 H64 V60 L72 48 Z',
          label: [78, 68],
          neighbors: ['coast', 'core', 'isle'],
        },
        {
          // Plus-shaped heartland touching lord + four outer lands
          id: 'core',
          d: 'M36 36 H64 V48 H72 V60 H64 V88 H36 V60 H28 V48 H36 Z',
          label: [50, 58],
          neighbors: ['lord', 'plain', 'coast', 'isle', 'ridge'],
        },
      ],
    },
    {
      // Busy 7-region planar map, χ = 4. Grape bucket is bait.
      id: 'devil',
      budget: 4,
      showExtra: true,
      startCoins: 4,
      fixed: {},
      regions: [
        {
          id: 'a',
          d: 'M10 10 H42 L36 38 H14 Z',
          label: [26, 22],
          neighbors: ['b', 'd', 'g'],
        },
        {
          id: 'b',
          d: 'M42 10 H72 L66 32 L50 38 L36 38 Z',
          label: [54, 22],
          neighbors: ['a', 'c', 'd', 'e'],
        },
        {
          id: 'c',
          d: 'M72 10 H90 V42 L74 50 L66 32 Z',
          label: [80, 28],
          neighbors: ['b', 'e', 'f'],
        },
        {
          id: 'd',
          d: 'M14 38 H50 L46 60 H18 L14 50 Z',
          label: [32, 48],
          neighbors: ['a', 'b', 'e', 'g'],
        },
        {
          id: 'e',
          d: 'M50 38 L66 32 L74 50 L60 70 L46 60 Z',
          label: [60, 50],
          neighbors: ['b', 'c', 'd', 'f', 'g'],
        },
        {
          id: 'f',
          d: 'M74 50 L90 42 V88 H60 L60 70 Z',
          label: [78, 66],
          neighbors: ['c', 'e', 'g'],
        },
        {
          id: 'g',
          d: 'M10 50 L18 50 L18 60 L46 60 L60 70 L60 88 H10 Z',
          label: [30, 74],
          neighbors: ['a', 'd', 'e', 'f'],
        },
      ],
    },
  ];

  const MISSIONS = [
    {
      code: '01',
      kicker: 'm1Kicker',
      title: 'm1Title',
      text: 'm1Text',
      lesson: 'm1Lesson',
      hint: 'm1Hint',
      rule: 'm1Rule',
      ready: 'm1Ready',
      map: 0,
    },
    {
      code: '02',
      kicker: 'm2Kicker',
      title: 'm2Title',
      text: 'm2Text',
      lesson: 'm2Lesson',
      hint: 'm2Hint',
      rule: 'm2Rule',
      ready: 'm2Ready',
      map: 1,
    },
    {
      code: '03',
      kicker: 'm3Kicker',
      title: 'm3Title',
      text: 'm3Text',
      lesson: 'm3Lesson',
      hint: 'm3Hint',
      rule: 'm3Rule',
      ready: 'm3Ready',
      map: 2,
    },
    {
      code: '04',
      kicker: 'm4Kicker',
      title: 'm4Title',
      text: 'm4Text',
      lesson: 'm4Lesson',
      hint: 'm4Hint',
      rule: 'm4Rule',
      ready: 'm4Ready',
      map: 3,
    },
  ];

  const $ = (selector) => document.querySelector(selector);
  const el = {
    course: $('#course'),
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    missionNav: $('#missionNav'),
    status: $('#status'),
    paintedCount: $('#paintedCount'),
    regionCount: $('#regionCount'),
    usedColors: $('#usedColors'),
    budgetCount: $('#budgetCount'),
    coinText: $('#coinText'),
    kingdomMap: $('#kingdomMap'),
    conflictStrip: $('#conflictStrip'),
    deskKicker: $('#deskKicker'),
    deskTitle: $('#deskTitle'),
    palette: $('#palette'),
    ruleText: $('#ruleText'),
    lessonIcon: $('#lessonIcon'),
    lessonText: $('#lessonText'),
    hint: $('#hintBtn'),
    clear: $('#clearBtn'),
    check: $('#checkBtn'),
    next: $('#nextBtn'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
    modal: $('#completeModal'),
    playAgain: $('#playAgainBtn'),
  };

  let t = (key) => key;
  let language = 'zh';
  let missionIndex = 0;
  let unlocked = 0;
  let completed = new Set();
  let colors = {}; // regionId -> colorId
  let selectedRegion = null;
  let selectedColor = 'rose';
  let statusMessage = { key: 'm1Ready', tone: '', args: [] };
  let flashConflicts = new Set();

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(3, Math.max(0, Number(saved.unlocked) || 0));
    completed = new Set(Array.isArray(saved.completed)
      ? saved.completed.filter((value) => Number.isInteger(value) && value >= 0 && value <= 3)
      : []);
  } catch {
    unlocked = 0;
    completed = new Set();
  }

  let restoreCompletion = completed.has(3);
  if (restoreCompletion) {
    missionIndex = 3;
  }

  class SoundEngine {
    constructor() {
      try { this.muted = ['true', '1'].includes(localStorage.getItem(SOUND_KEY)); }
      catch { this.muted = false; }
      this.context = null;
      this.sources = new Set();
    }

    ensure() {
      if (this.muted) return null;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      try {
        this.context ||= new AudioContextClass();
        if (this.context.state === 'suspended') this.context.resume().catch(() => {});
        return this.context;
      } catch {
        return null;
      }
    }

    tone(frequency, duration, volume, type = 'sine', delay = 0) {
      const context = this.ensure();
      if (!context) return;
      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      this.sources.add(oscillator);
      oscillator.addEventListener('ended', () => this.sources.delete(oscillator), { once: true });
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    }

    pick() {
      this.tone(420, 0.07, 0.016, 'triangle');
    }

    paint() {
      this.tone(520, 0.09, 0.02, 'sine');
      this.tone(680, 0.1, 0.014, 'triangle', 0.04);
    }

    correct() {
      [392, 523, 659].forEach((frequency, index) =>
        this.tone(frequency, 0.18, 0.022, 'triangle', index * 0.05));
    }

    error() {
      this.tone(160, 0.14, 0.026, 'sawtooth');
      this.tone(110, 0.18, 0.02, 'sawtooth', 0.06);
    }

    finale() {
      [330, 440, 554, 659, 880].forEach((frequency, index) =>
        this.tone(frequency, 0.3, 0.024, 'triangle', index * 0.065));
    }

    setMuted(value) {
      this.muted = value;
      try { localStorage.setItem(SOUND_KEY, value ? '1' : '0'); } catch { /* ignore */ }
      if (value && this.context) {
        this.sources.forEach((source) => {
          try { source.stop(); } catch { /* ignore */ }
        });
        this.sources.clear();
      }
    }
  }

  const sound = new SoundEngine();

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked, completed: [...completed] }));
    } catch { /* ignore */ }
  }

  function currentMission() {
    return MISSIONS[missionIndex];
  }

  function currentMap() {
    return MAPS[currentMission().map];
  }

  function regionName(id) {
    return t('regionNames')[id] || id;
  }

  function colorName(id) {
    return t('colorNames')[id] || id;
  }

  function setStatus(key, tone = '', ...args) {
    statusMessage = { key, tone, args };
    paintStatus();
  }

  function paintStatus() {
    const { key, tone, args } = statusMessage;
    el.status.textContent = t(key, ...args);
    el.status.classList.toggle('is-good', tone === 'good');
    el.status.classList.toggle('is-bad', tone === 'bad');
  }

  function usedColorSet() {
    return new Set(Object.values(colors).filter(Boolean));
  }

  function coinsLeft() {
    const map = currentMap();
    return Math.max(0, map.startCoins - usedColorSet().size);
  }

  function conflicts() {
    const map = currentMap();
    const pairs = [];
    const seen = new Set();
    map.regions.forEach((region) => {
      const color = colors[region.id];
      if (!color) return;
      region.neighbors.forEach((neighborId) => {
        if (colors[neighborId] !== color) return;
        const key = [region.id, neighborId].sort().join('|');
        if (seen.has(key)) return;
        seen.add(key);
        pairs.push([region.id, neighborId]);
      });
    });
    return pairs;
  }

  function applyFixedColors() {
    const map = currentMap();
    colors = { ...map.fixed };
  }

  function resetMissionState(keepStatus = false) {
    applyFixedColors();
    selectedRegion = null;
    const available = availableColors();
    selectedColor = available[0]?.id || 'rose';
    flashConflicts = new Set();
    if (!keepStatus) {
      setStatus(currentMission().ready);
    }
  }

  function availableColors() {
    const map = currentMap();
    return COLORS.filter((color) => map.showExtra || color.id !== 'grape');
  }

  function selectRegion(regionId) {
    if (completed.has(missionIndex)) return;
    const map = currentMap();
    if (map.fixed[regionId]) {
      sound.error();
      setStatus('fixedBlock', 'bad');
      return;
    }
    selectedRegion = regionId;
    sound.pick();
    if (selectedColor) {
      paintSelected();
      return;
    }
    render();
  }

  function selectColor(colorId) {
    if (completed.has(missionIndex)) return;
    const allowed = availableColors().some((color) => color.id === colorId);
    if (!allowed) return;
    selectedColor = colorId;
    sound.pick();
    if (selectedRegion) {
      paintSelected();
      return;
    }
    render();
  }

  function paintSelected() {
    if (!selectedRegion || !selectedColor || completed.has(missionIndex)) return;
    const map = currentMap();
    if (map.fixed[selectedRegion]) {
      sound.error();
      setStatus('fixedBlock', 'bad');
      return;
    }

    const previous = colors[selectedRegion];
    const nextColors = { ...colors, [selectedRegion]: selectedColor };
    const nextUsed = new Set(Object.values(nextColors).filter(Boolean));

    if (nextUsed.size > map.budget && !usedColorSet().has(selectedColor)) {
      sound.error();
      setStatus('budgetBlock', 'bad', map.budget);
      render();
      return;
    }

    colors = nextColors;
    sound.paint();
    window.cool?.track?.('paint-region', {
      mission: missionIndex,
      region: selectedRegion,
      color: selectedColor,
      used: nextUsed.size,
    });

    const conflictPairs = conflicts().filter((pair) => pair.includes(selectedRegion));
    flashConflicts = new Set(conflictPairs.flat());
    if (conflictPairs.length) {
      const [a, b] = conflictPairs[0];
      setStatus('conflictLive', 'bad', regionName(a), regionName(b));
    } else if (nextUsed.size > map.budget) {
      setStatus('overBudgetLive', 'bad', nextUsed.size);
    } else if (previous === selectedColor) {
      setStatus('paintedRegion', '', regionName(selectedRegion), colorName(selectedColor));
    } else {
      setStatus('paintedRegion', '', regionName(selectedRegion), colorName(selectedColor));
    }
    render();
  }

  function clearMap() {
    if (completed.has(missionIndex)) return;
    resetMissionState(true);
    sound.pick();
    setStatus('cleared');
    window.cool?.track?.('clear-map', { mission: missionIndex });
    render();
  }

  function validateMap() {
    const map = currentMap();
    const missing = map.regions.some((region) => !colors[region.id]);
    if (missing) {
      sound.error();
      setStatus('incomplete', 'bad');
      return false;
    }

    for (const [regionId, colorId] of Object.entries(map.fixed)) {
      if (colors[regionId] !== colorId) {
        sound.error();
        setStatus('fixedFail', 'bad');
        return false;
      }
    }

    const used = usedColorSet().size;
    if (used > map.budget) {
      sound.error();
      setStatus('overBudgetSubmit', 'bad', used, map.budget);
      return false;
    }

    const pairs = conflicts();
    if (pairs.length) {
      flashConflicts = new Set(pairs.flat());
      sound.error();
      setStatus('conflictSubmit', 'bad');
      render();
      return false;
    }

    return true;
  }

  function completeMission() {
    completed.add(missionIndex);
    unlocked = Math.max(unlocked, Math.min(3, missionIndex + 1));
    save();
    const map = currentMap();
    const used = usedColorSet().size;
    const coins = Math.max(0, map.startCoins - used);
    setStatus('success', 'good', used, map.budget, coins);
    selectedRegion = null;
    flashConflicts = new Set();

    if (missionIndex === 3) {
      sound.finale();
      window.cool?.complete?.();
      window.cool?.track?.('complete-four-color-kingdom', { used });
      setTimeout(showCompletion, 280);
    } else {
      sound.correct();
      window.cool?.stage?.(`four-color-${missionIndex + 1}`);
      window.cool?.track?.('complete-map', { mission: missionIndex, used });
    }
    render();
  }

  function checkMap() {
    if (completed.has(missionIndex)) return;
    if (!validateMap()) return;
    completeMission();
  }

  function showCompletion() {
    el.course.inert = true;
    el.modal.hidden = false;
    el.playAgain.focus();
  }

  function switchMission(index) {
    if (index > unlocked && !completed.has(index)) return;
    missionIndex = index;
    resetMissionState();
    window.cool?.stage?.(`four-color-${missionIndex + 1}`);
    render();
  }

  function fillMap() {
    const map = currentMap();
    const svg = el.kingdomMap;
    svg.setAttribute('aria-label', t('mapLabel'));
    svg.innerHTML = '';

    const sea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    sea.setAttribute('x', '0');
    sea.setAttribute('y', '0');
    sea.setAttribute('width', '100');
    sea.setAttribute('height', '100');
    sea.setAttribute('fill', 'transparent');
    svg.appendChild(sea);

    map.regions.forEach((region) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', region.d);
      path.setAttribute('data-region', region.id);
      path.classList.add('region');
      if (selectedRegion === region.id) path.classList.add('is-selected');
      if (flashConflicts.has(region.id)) path.classList.add('is-conflict');
      if (map.fixed[region.id]) path.classList.add('is-fixed');

      const colorId = colors[region.id];
      if (colorId) {
        const color = COLORS.find((item) => item.id === colorId);
        path.setAttribute('fill', color?.hex || 'var(--map-land)');
      } else {
        path.setAttribute('fill', 'var(--map-land)');
      }

      path.setAttribute('tabindex', completed.has(missionIndex) ? '-1' : '0');
      path.setAttribute('role', 'button');
      path.setAttribute('aria-label', regionName(region.id));
      path.addEventListener('click', () => selectRegion(region.id));
      path.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectRegion(region.id);
        }
      });
      svg.appendChild(path);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', String(region.label[0]));
      label.setAttribute('y', String(region.label[1]));
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'middle');
      label.classList.add('region-label');
      label.textContent = regionName(region.id);
      svg.appendChild(label);

      if (region.badge) {
        const badge = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        badge.setAttribute('x', String(region.label[0]));
        badge.setAttribute('y', String(region.label[1] - 6));
        badge.setAttribute('text-anchor', 'middle');
        badge.classList.add('castle');
        badge.textContent = region.badge;
        svg.appendChild(badge);
      }
    });
  }

  function fillPalette() {
    const map = currentMap();
    const used = usedColorSet();
    el.palette.setAttribute('aria-label', t('paletteLabel'));
    el.palette.innerHTML = '';

    availableColors().forEach((color) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'swatch';
      button.dataset.color = color.id;
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', selectedColor === color.id ? 'true' : 'false');
      if (used.has(color.id)) button.classList.add('is-used');
      if (color.id === 'grape') button.classList.add('is-bait');

      const lockedNew = !used.has(color.id) && used.size >= map.budget && selectedColor !== color.id;
      // still allow selecting already-used or currently selected; block opening brand-new beyond budget via paintSelected
      button.innerHTML = `
        <span class="swatch__blob" style="background:${color.hex}"></span>
        <span class="swatch__meta">
          <span>${t('colorNames')[color.id]}</span>
          <small>${t('colorHint')[color.id]}</small>
        </span>
      `;
      button.addEventListener('click', () => selectColor(color.id));
      if (completed.has(missionIndex)) button.disabled = true;
      if (lockedNew && color.id === 'grape') {
        // grape remains clickable so kids can hear the budget block feedback
      }
      el.palette.appendChild(button);
    });
  }

  function fillNav() {
    el.missionNav.setAttribute('aria-label', t('missionsLabel'));
    el.missionNav.innerHTML = '';
    MISSIONS.forEach((mission, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = mission.code;
      button.setAttribute('aria-current', index === missionIndex ? 'true' : 'false');
      const isLocked = index > unlocked && !completed.has(index);
      button.disabled = isLocked;
      button.title = isLocked ? t('lockedMission') : t(mission.title);
      button.addEventListener('click', () => switchMission(index));
      el.missionNav.appendChild(button);
    });
  }

  function fillConflicts() {
    const pairs = conflicts();
    if (!pairs.length) {
      el.conflictStrip.hidden = true;
      el.conflictStrip.innerHTML = '';
      return;
    }
    el.conflictStrip.hidden = false;
    el.conflictStrip.innerHTML = pairs.map(([a, b]) =>
      `<span class="conflict-chip">${t('conflictPair', regionName(a), regionName(b))}</span>`).join('');
  }

  function renderControls() {
    const muted = sound.muted;
    el.sound.textContent = muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', muted ? 'true' : 'false');
    el.sound.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
    el.theme.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? '🌙' : '☀️';
    el.theme.setAttribute('aria-label', t('themeLabel'));
    el.lang.textContent = language === 'zh' ? 'EN' : '中';
  }

  function render() {
    const mission = currentMission();
    const map = currentMap();
    const used = usedColorSet().size;
    const painted = map.regions.filter((region) => colors[region.id]).length;
    const done = completed.has(missionIndex);

    el.missionNumber.textContent = mission.code;
    el.missionKicker.textContent = t(mission.kicker);
    el.missionTitle.textContent = t(mission.title);
    el.missionText.textContent = t(mission.text);
    el.ruleText.textContent = t(mission.rule);
    el.lessonText.textContent = t(mission.lesson);
    el.lessonIcon.textContent = String(map.budget);
    el.deskTitle.textContent = done ? t('deskTitleDone') : t('deskTitlePaint');

    el.paintedCount.textContent = String(painted);
    el.regionCount.textContent = String(map.regions.length);
    el.usedColors.textContent = String(used);
    el.budgetCount.textContent = String(map.budget);
    el.coinText.textContent = t('coins', coinsLeft());

    el.check.hidden = done;
    el.next.hidden = !done || missionIndex >= 3;
    el.clear.disabled = done;
    el.hint.disabled = false;
    el.check.disabled = done;

    fillNav();
    fillMap();
    fillPalette();
    fillConflicts();
    paintStatus();
    renderControls();
    document.title = t('doc');
  }

  el.hint.addEventListener('click', () => {
    sound.pick();
    setStatus(currentMission().hint);
  });
  el.clear.addEventListener('click', clearMap);
  el.check.addEventListener('click', checkMap);
  el.next.addEventListener('click', () => switchMission(Math.min(3, missionIndex + 1)));
  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    renderControls();
    if (!sound.muted) sound.pick();
  });
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.playAgain.addEventListener('click', () => {
    el.modal.hidden = true;
    el.course.inert = false;
    missionIndex = 0;
    unlocked = 0;
    completed.clear();
    save();
    resetMissionState();
    window.cool?.stage?.('four-color-1');
    render();
    el.check.focus();
  });

  resetMissionState();
  if (!restoreCompletion) {
    window.cool?.stage?.('four-color-1');
  }

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang }) {
      t = translate;
      language = lang;
      // Re-bind function-style nested dictionaries after language switch
      render();
      if (restoreCompletion) {
        restoreCompletion = false;
        // restore a valid finished map coloring so the board looks complete
        autoSolve(currentMap());
        setStatus('success', 'good', usedColorSet().size, currentMap().budget, coinsLeft());
        showCompletion();
      }
    },
  });

  /** Greedy solve for restore / sanity; not exposed to player */
  function autoSolve(map) {
    const order = [...map.regions].sort((a, b) => b.neighbors.length - a.neighbors.length);
    const palette = availableColors().map((color) => color.id).filter((id) => id !== 'grape' || map.showExtra);
    const limited = palette.slice(0, map.budget);
    colors = { ...map.fixed };
    for (const region of order) {
      if (colors[region.id]) continue;
      const forbidden = new Set(region.neighbors.map((id) => colors[id]).filter(Boolean));
      const choice = limited.find((id) => !forbidden.has(id));
      colors[region.id] = choice || limited[0];
    }
  }
})();
