(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '扫地机器人研究所 · KidsLab',
      back: '返回平台',
      title: '扫地机器人研究所',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      missionsLabel: '实验户型',
      strategiesLabel: '策略芯片',
      canvasLabel: '扫地机器人实验场地',
      metricsLabel: '实验实时数据',
      live: '实验待机',
      roomCamera: 'ROOM CAM',
      coverage: '覆盖率',
      time: '用时',
      bumps: '碰撞',
      bumpUnit: '次',
      brainBay: 'ROBO BRAIN / 芯片舱',
      chooseChip: '选择一种清扫规则',
      randomName: '随机转向',
      randomRule: '碰壁就换方向',
      sweepName: '弓字清扫',
      sweepRule: '一行接一行',
      wallName: '沿墙行走',
      wallRule: '贴住边界前进',
      hint: '提示',
      run: '启动测试',
      next: '下一户型',
      finalKicker: '三间房，三位冠军',
      finalTitle: '首席机器人策略师！',
      finalText: '你发现了：算法不是越复杂越好，适合环境的规则才跑得漂亮。',
      playAgain: '重新测试',
      missionLabel: (n, title) => `第 ${n} 间：${title}`,
      lockedMission: '先完成前一间实验',
      room1Kicker: '一号户型 · 空旷摄影棚',
      room1Title: '谁能少走冤枉路？',
      room1Text: '地面很开阔。挑一颗策略芯片，启动后只能观察。',
      room2Kicker: '二号户型 · 障碍迷宫',
      room2Title: '直来直去会被困住吗？',
      room2Text: '箱子把路切得七拐八弯。简单的随机规则可能带来惊喜。',
      room3Kicker: '三号户型 · 环形走廊',
      room3Title: '灰尘全躲在墙边',
      room3Text: '狭长走廊绕成一圈。哪条规则最懂这里的边界？',
      ready: '先给机器人装一颗策略芯片。',
      selectedRandom: '遇到墙就随机换方向，不提前规划整条路。',
      selectedSweep: '左右往返，一行扫完再进入下一行。',
      selectedWall: '始终把边界留在身旁，贴着轮廓前进。',
      needChip: '芯片舱还是空的。先选择一种清扫规则。',
      running: (name) => `${name}正在执行。现在不能遥控，只能观察……`,
      resultBadge: '本轮记录',
      successBadge: '户型冠军',
      wrong1: '覆盖不够整齐。换一种更会排队的规则再试。',
      wrong2: '它在障碍间反复绕路。试试不怕意外的规则。',
      wrong3: '它离墙边的灰尘太远。找一颗会贴边的芯片。',
      success1: '弓字清扫赢了！开阔地里，一行接一行很少重复。',
      success2: '随机转向逆袭！简单规则在障碍迷宫里没有被固定路线困住。',
      success3: '沿墙行走夺冠！环形走廊的边界正好成了导航线。',
      hint1: '看房间：几乎没有障碍，整齐排队也许最省路。',
      hint2: '固定路线总撞箱子时，谁能每次换个方向？',
      hint3: '灰尘沿着边界排成一圈，谁最舍不得离开墙？',
      lesson1: '同一片开阔地，规则越少重复，覆盖通常越快。',
      lesson2: '简单规则不等于没用；环境改变，算法排名也会改变。',
      lesson3: '没有万能芯片。先观察环境，再挑合适的规则。',
      replayReady: '记录保留好了。你可以重跑任意已解锁户型。',
    },
    en: {
      doc: 'Robo-Vacuum Lab · KidsLab',
      back: 'Back to platform',
      title: 'Robo-Vacuum Lab',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      missionsLabel: 'Test rooms',
      strategiesLabel: 'Strategy chips',
      canvasLabel: 'Robo-vacuum test room',
      metricsLabel: 'Live test data',
      live: 'LAB STANDBY',
      roomCamera: 'ROOM CAM',
      coverage: 'Coverage',
      time: 'Time',
      bumps: 'Bumps',
      bumpUnit: '',
      brainBay: 'ROBO BRAIN / CHIP BAY',
      chooseChip: 'Choose one cleaning rule',
      randomName: 'Random Turn',
      randomRule: 'Turn when blocked',
      sweepName: 'Lawnmower',
      sweepRule: 'Row after row',
      wallName: 'Wall Follow',
      wallRule: 'Keep to the edge',
      hint: 'Hint',
      run: 'Run test',
      next: 'Next room',
      finalKicker: 'THREE ROOMS, THREE CHAMPIONS',
      finalTitle: 'Chief Robot Strategist!',
      finalText: 'You found it: a fancier algorithm is not always better. The best rule is the one that fits the environment.',
      playAgain: 'Test again',
      missionLabel: (n, title) => `Room ${n}: ${title}`,
      lockedMission: 'Finish the previous room first',
      room1Kicker: 'ROOM ONE · OPEN STUDIO',
      room1Title: 'Who Wastes the Fewest Steps?',
      room1Text: 'The floor is wide open. Pick a strategy chip, then watch without steering.',
      room2Kicker: 'ROOM TWO · OBSTACLE MAZE',
      room2Title: 'Will Straight Lines Get Trapped?',
      room2Text: 'Crates twist the route. A simple random rule may surprise you.',
      room3Kicker: 'ROOM THREE · RING HALLWAY',
      room3Title: 'Dust Hugs Every Wall',
      room3Text: 'A narrow hallway loops around. Which rule understands its boundary?',
      ready: 'Fit the robot with a strategy chip first.',
      selectedRandom: 'When blocked, pick another direction without planning the whole route.',
      selectedSweep: 'Sweep left and right, finishing one row before the next.',
      selectedWall: 'Keep a boundary beside the robot and follow its outline.',
      needChip: 'The chip bay is empty. Choose a cleaning rule first.',
      running: (name) => `${name} is running. No steering now—just observe…`,
      resultBadge: 'TEST RECORD',
      successBadge: 'ROOM CHAMPION',
      wrong1: 'Coverage is patchy. Try a rule that lines up each pass.',
      wrong2: 'It keeps retracing around crates. Try a rule that can handle surprises.',
      wrong3: 'It keeps missing dust near the wall. Find a chip that loves edges.',
      success1: 'Lawnmower wins! Row-by-row passes avoid repeats in open space.',
      success2: 'Random Turn wins! Its simple rule escapes the obstacle maze without a rigid route.',
      success3: 'Wall Follow wins! The ring hallway turns its boundary into a guide.',
      hint1: 'Look at the room: almost no obstacles. Neat rows may save steps.',
      hint2: 'When a fixed route keeps hitting crates, who chooses a fresh direction?',
      hint3: 'Dust makes a loop beside the wall. Which chip stays closest to edges?',
      lesson1: 'On the same open floor, fewer repeated passes usually mean faster coverage.',
      lesson2: 'Simple does not mean useless. Change the environment and the ranking can change.',
      lesson3: 'There is no universal chip. Observe the environment, then choose a fitting rule.',
      replayReady: 'Records saved. You can rerun any unlocked room.',
    },
  };

  const STRATEGIES = {
    random: { name: 'randomName', note: 'selectedRandom', icon: '🎲' },
    sweep: { name: 'sweepName', note: 'selectedSweep', icon: '↔' },
    wall: { name: 'wallName', note: 'selectedWall', icon: '🧱' },
  };

  const ROOMS = [
    {
      code: 'OPEN-01',
      kicker: 'room1Kicker',
      title: 'room1Title',
      text: 'room1Text',
      winner: 'sweep',
      hint: 'hint1',
      success: 'success1',
      wrong: 'wrong1',
      lesson: 'lesson1',
      map: [
        '############',
        '#..........#',
        '#..........#',
        '#....##....#',
        '#....##....#',
        '#..........#',
        '#..........#',
        '############',
      ],
      results: {
        random: { coverage: 72, time: 58, bumps: 13 },
        sweep: { coverage: 96, time: 30, bumps: 1 },
        wall: { coverage: 61, time: 44, bumps: 3 },
      },
    },
    {
      code: 'MAZE-02',
      kicker: 'room2Kicker',
      title: 'room2Title',
      text: 'room2Text',
      winner: 'random',
      hint: 'hint2',
      success: 'success2',
      wrong: 'wrong2',
      lesson: 'lesson2',
      map: [
        '############',
        '#...#......#',
        '#...#..###.#',
        '#......#...#',
        '#.###..#...#',
        '#...#......#',
        '#...#..##..#',
        '############',
      ],
      results: {
        random: { coverage: 91, time: 54, bumps: 11 },
        sweep: { coverage: 58, time: 48, bumps: 9 },
        wall: { coverage: 76, time: 61, bumps: 7 },
      },
    },
    {
      code: 'RING-03',
      kicker: 'room3Kicker',
      title: 'room3Title',
      text: 'room3Text',
      winner: 'wall',
      hint: 'hint3',
      success: 'success3',
      wrong: 'wrong3',
      lesson: 'lesson3',
      map: [
        '############',
        '#..........#',
        '#..######..#',
        '#..######..#',
        '#..######..#',
        '#..######..#',
        '#..........#',
        '############',
      ],
      results: {
        random: { coverage: 80, time: 63, bumps: 14 },
        sweep: { coverage: 69, time: 49, bumps: 8 },
        wall: { coverage: 94, time: 37, bumps: 2 },
      },
    },
  ];

  const SAVE_KEY = 'kidslab.vacuum-lab';
  const SOUND_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    body: document.body,
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    missionNav: $('#missionNav'),
    status: $('#status'),
    canvas: $('#roomCanvas'),
    roomCode: $('#roomCode'),
    dustBar: $('#dustBar'),
    coverage: $('#coverageValue'),
    time: $('#timeValue'),
    bumps: $('#bumpsValue'),
    strategyGrid: $('#strategyGrid'),
    strategies: [...document.querySelectorAll('.strategy')],
    brainIcon: $('#brainIcon'),
    brainNote: $('#brainNote'),
    result: $('#result'),
    resultBadge: $('#resultBadge'),
    resultText: $('#resultText'),
    hint: $('#hintBtn'),
    run: $('#runBtn'),
    next: $('#nextBtn'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
    modal: $('#completeModal'),
    playAgain: $('#playAgainBtn'),
  };

  let t = (key) => key;
  let language = 'zh';
  let roomIndex = 0;
  let unlocked = 0;
  let completed = new Set();
  let selected = '';
  let running = false;
  let statusMessage = { key: 'ready', args: [], tone: '' };
  let lastResult = null;
  let displayMetrics = { coverage: 0, time: 0, bumps: 0 };
  let animationFrame = 0;
  let runStartedAt = 0;
  let route = [];

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(2, Math.max(0, Number(saved.unlocked) || 0));
    completed = new Set(Array.isArray(saved.completed)
      ? saved.completed.filter((value) => Number.isInteger(value) && value >= 0 && value <= 2)
      : []);
  } catch {
    unlocked = 0;
    completed = new Set();
  }

  class SoundEngine {
    constructor() {
      try {
        this.muted = ['true', '1'].includes(localStorage.getItem(SOUND_KEY));
      } catch {
        this.muted = false;
      }
      this.context = null;
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

    setMuted(value) {
      this.muted = value;
      try { localStorage.setItem(SOUND_KEY, String(value)); } catch {}
      if (value && this.context) this.context.suspend().catch(() => {});
    }

    tone(frequency, duration, volume, type = 'triangle', delay = 0) {
      const context = this.ensure();
      if (!context || volume <= 0) return;
      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    }

    chip() {
      this.tone(320, 0.09, 0.022, 'square');
      this.tone(500, 0.1, 0.018, 'triangle', 0.06);
    }

    start() {
      [220, 330, 440].forEach((frequency, index) => this.tone(frequency, 0.12, 0.025, 'square', index * 0.07));
    }

    success(final = false) {
      [440, 554, 659, final ? 880 : 740].forEach((frequency, index) =>
        this.tone(frequency, final ? 0.34 : 0.2, 0.034, 'sine', index * 0.08));
    }

    error() {
      this.tone(175, 0.15, 0.038, 'sawtooth');
      this.tone(125, 0.19, 0.03, 'sawtooth', 0.08);
    }

    click() {
      this.tone(360, 0.06, 0.018, 'triangle');
    }
  }

  const sound = new SoundEngine();

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        unlocked,
        completed: [...completed],
      }));
    } catch {}
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function setStatus(key, tone = '', ...args) {
    statusMessage = { key, args, tone };
    el.status.textContent = t(key, ...args);
    el.status.className = `status${tone ? ` ${tone}` : ''}`;
  }

  function buildRoute(room, strategy) {
    const directions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ];
    const canMove = ({ x, y }) => room.map[y]?.[x] === '.';
    const path = [{ x: 1, y: 1 }];
    let seed = 1237 + roomIndex * 97;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    let heading = 1;
    for (let step = 0; step < 110; step += 1) {
      const current = path.at(-1);
      let next = null;
      if (strategy === 'random') {
        const options = directions
          .map((direction, index) => ({
            x: current.x + direction.x,
            y: current.y + direction.y,
            heading: index,
          }))
          .filter(canMove);
        next = options[Math.floor(random() * options.length)];
      } else if (strategy === 'wall') {
        const preference = [(heading + 3) % 4, heading, (heading + 1) % 4, (heading + 2) % 4];
        const chosen = preference.find((index) => canMove({
          x: current.x + directions[index].x,
          y: current.y + directions[index].y,
        }));
        heading = chosen ?? heading;
        next = {
          x: current.x + directions[heading].x,
          y: current.y + directions[heading].y,
        };
      } else {
        const forward = {
          x: current.x + directions[heading].x,
          y: current.y + directions[heading].y,
        };
        if (canMove(forward)) {
          next = forward;
        } else {
          const down = { x: current.x, y: current.y + 1 };
          heading = heading === 1 ? 3 : 1;
          next = canMove(down)
            ? down
            : {
                x: current.x + directions[heading].x,
                y: current.y + directions[heading].y,
              };
        }
      }
      if (!next || !canMove(next)) break;
      path.push({ x: next.x, y: next.y });
    }
    return path;
  }

  function fitCanvas() {
    const rect = el.canvas.getBoundingClientRect();
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (el.canvas.width !== width || el.canvas.height !== height) {
      el.canvas.width = width;
      el.canvas.height = height;
    }
    return ratio;
  }

  function roundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.roundRect(x, y, width, height, r);
  }

  function drawRoom(progress = 0) {
    fitCanvas();
    const context = el.canvas.getContext('2d');
    const width = el.canvas.width;
    const height = el.canvas.height;
    const ratio = Math.min(width / 12, height / 8);
    const boardWidth = ratio * 12;
    const boardHeight = ratio * 8;
    const ox = (width - boardWidth) / 2;
    const oy = (height - boardHeight) / 2;
    const room = ROOMS[roomIndex];
    const floor = cssVar('--floor');
    const floorAlt = cssVar('--floor-alt');
    const wall = cssVar('--wall');
    const line = cssVar('--line');
    const clean = cssVar('--clean');
    const dust = cssVar('--dust');
    const trail = cssVar('--trail');
    context.clearRect(0, 0, width, height);

    room.map.forEach((row, y) => {
      [...row].forEach((value, x) => {
        const px = ox + x * ratio;
        const py = oy + y * ratio;
        context.fillStyle = value === '#' ? wall : ((x + y) % 2 ? floorAlt : floor);
        context.fillRect(px, py, ratio + 0.5, ratio + 0.5);
        if (value === '#') {
          context.fillStyle = 'rgba(255,255,255,0.12)';
          context.fillRect(px + ratio * 0.1, py + ratio * 0.1, ratio * 0.8, ratio * 0.14);
        } else {
          context.strokeStyle = 'rgba(25,35,42,0.12)';
          context.lineWidth = Math.max(1, ratio * 0.025);
          context.strokeRect(px, py, ratio, ratio);
          const dustSeed = (x * 17 + y * 31 + roomIndex * 7) % 5;
          if (dustSeed < 2) {
            context.fillStyle = dust;
            context.beginPath();
            context.arc(px + ratio * (0.3 + dustSeed * 0.3), py + ratio * 0.58, Math.max(1.2, ratio * 0.045), 0, Math.PI * 2);
            context.fill();
          }
        }
      });
    });

    const shown = running ? Math.max(1, Math.floor(route.length * progress)) : 0;
    if (shown && route.length) {
      context.strokeStyle = trail;
      context.lineWidth = ratio * 0.5;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.beginPath();
      route.slice(0, shown).forEach((point, index) => {
        const x = ox + (point.x + 0.5) * ratio;
        const y = oy + (point.y + 0.5) * ratio;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.stroke();
    }

    if (lastResult && !running) {
      const cleanCount = Math.floor(route.length * (lastResult.coverage / 100));
      route.slice(0, cleanCount).forEach((point) => {
        context.fillStyle = clean;
        context.globalAlpha = 0.22;
        context.fillRect(ox + point.x * ratio + 1, oy + point.y * ratio + 1, ratio - 2, ratio - 2);
      });
      context.globalAlpha = 1;
    }

    const robotPoint = route.length
      ? route[Math.min(route.length - 1, Math.floor((route.length - 1) * progress))]
      : { x: 1, y: 1 };
    const rx = ox + (robotPoint.x + 0.5) * ratio;
    const ry = oy + (robotPoint.y + 0.5) * ratio;
    context.save();
    context.translate(rx, ry);
    context.rotate(running ? progress * Math.PI * 4 : -0.2);
    context.shadowColor = 'rgba(0,0,0,0.35)';
    context.shadowBlur = ratio * 0.16;
    context.shadowOffsetY = ratio * 0.1;
    roundedRect(context, -ratio * 0.34, -ratio * 0.34, ratio * 0.68, ratio * 0.68, ratio * 0.25);
    context.fillStyle = cssVar('--yellow');
    context.fill();
    context.strokeStyle = line;
    context.lineWidth = Math.max(2, ratio * 0.07);
    context.stroke();
    context.shadowColor = 'transparent';
    context.fillStyle = line;
    context.beginPath();
    context.arc(0, 0, ratio * 0.11, 0, Math.PI * 2);
    context.fill();
    context.fillRect(-ratio * 0.05, -ratio * 0.45, ratio * 0.1, ratio * 0.18);
    context.restore();
  }

  function renderMetrics() {
    el.coverage.innerHTML = `${displayMetrics.coverage}<small>%</small>`;
    el.time.innerHTML = `${displayMetrics.time}<small>s</small>`;
    el.bumps.innerHTML = `${displayMetrics.bumps}<small>${t('bumpUnit')}</small>`;
    el.dustBar.style.transform = `scaleY(${Math.max(0.04, 1 - displayMetrics.coverage / 100)})`;
  }

  function renderNav() {
    el.missionNav.replaceChildren();
    ROOMS.forEach((room, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `mission-btn${index === roomIndex ? ' current' : ''}${completed.has(index) ? ' done' : ''}`;
      button.textContent = String(index + 1).padStart(2, '0');
      button.disabled = running || index > unlocked;
      button.setAttribute('aria-label', index > unlocked
        ? t('lockedMission')
        : t('missionLabel', index + 1, t(room.title)));
      button.addEventListener('click', () => switchRoom(index));
      el.missionNav.append(button);
    });
  }

  function renderControls() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    el.lang.textContent = language === 'zh' ? 'EN' : '中';
    el.theme.textContent = document.documentElement.dataset.theme === 'light' ? '🌙' : '☀️';
    el.theme.setAttribute('aria-label', t('themeLabel'));
    el.sound.textContent = sound.muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', String(sound.muted));
    el.sound.setAttribute('aria-label', sound.muted ? t('soundOn') : t('soundOff'));
    el.missionNav.setAttribute('aria-label', t('missionsLabel'));
    el.strategyGrid.setAttribute('aria-label', t('strategiesLabel'));
    el.canvas.setAttribute('aria-label', t('canvasLabel'));
    $('.metrics').setAttribute('aria-label', t('metricsLabel'));
  }

  function render() {
    const room = ROOMS[roomIndex];
    el.missionNumber.textContent = String(roomIndex + 1).padStart(2, '0');
    el.missionKicker.textContent = t(room.kicker);
    el.missionTitle.textContent = t(room.title);
    el.missionText.textContent = t(room.text);
    el.roomCode.textContent = room.code;
    el.strategies.forEach((button) => {
      const active = button.dataset.strategy === selected;
      button.setAttribute('aria-pressed', String(active));
      button.disabled = running;
    });
    el.brainIcon.textContent = selected ? STRATEGIES[selected].icon : '?';
    el.brainNote.textContent = selected ? t(STRATEGIES[selected].note) : t(completed.has(roomIndex) ? room.lesson : 'ready');
    el.run.disabled = running;
    el.hint.disabled = running;
    el.next.hidden = !completed.has(roomIndex) || roomIndex === 2;
    el.result.hidden = !lastResult;
    if (lastResult) {
      const won = selected === room.winner && completed.has(roomIndex);
      el.result.classList.toggle('good', won);
      el.resultBadge.textContent = t(won ? 'successBadge' : 'resultBadge');
      el.resultText.textContent = t(won ? room.success : room.wrong);
    }
    const message = statusMessage;
    setStatus(message.key, message.tone, ...message.args);
    renderMetrics();
    renderNav();
    renderControls();
    drawRoom(lastResult ? 1 : 0);
  }

  function selectStrategy(strategy) {
    if (running || !STRATEGIES[strategy]) return;
    selected = strategy;
    lastResult = null;
    displayMetrics = { coverage: 0, time: 0, bumps: 0 };
    route = buildRoute(ROOMS[roomIndex], strategy);
    setStatus('ready');
    sound.chip();
    window.cool?.track?.('install_strategy_chip', { room: roomIndex + 1, strategy });
    render();
  }

  function switchRoom(index) {
    if (running || index > unlocked) return;
    roomIndex = index;
    selected = '';
    lastResult = null;
    displayMetrics = { coverage: 0, time: 0, bumps: 0 };
    route = [];
    statusMessage = { key: completed.has(index) ? 'replayReady' : 'ready', args: [], tone: '' };
    window.cool?.stage?.(`room-${index + 1}`);
    sound.click();
    render();
  }

  function finishRun() {
    running = false;
    el.body.dataset.running = 'false';
    const room = ROOMS[roomIndex];
    lastResult = room.results[selected];
    displayMetrics = { ...lastResult };
    const won = selected === room.winner;
    if (won) {
      completed.add(roomIndex);
      unlocked = Math.max(unlocked, Math.min(2, roomIndex + 1));
      save();
      setStatus(room.success, 'good');
      sound.success(roomIndex === 2);
      if (roomIndex === 2) {
        window.cool?.complete?.();
        setTimeout(() => {
          el.modal.hidden = false;
          el.playAgain.focus();
        }, 250);
      }
    } else {
      setStatus(room.wrong, 'bad');
      sound.error();
    }
    window.cool?.track?.('finish_strategy_test', {
      room: roomIndex + 1,
      strategy: selected,
      won,
      coverage: lastResult.coverage,
    });
    render();
  }

  function animateRun(now) {
    if (!running) return;
    const room = ROOMS[roomIndex];
    const result = room.results[selected];
    const progress = Math.min(1, (now - runStartedAt) / 760);
    const eased = 1 - ((1 - progress) ** 3);
    displayMetrics = {
      coverage: Math.round(result.coverage * eased),
      time: Math.round(result.time * eased),
      bumps: Math.round(result.bumps * eased),
    };
    renderMetrics();
    drawRoom(eased);
    if (progress >= 1) {
      finishRun();
      return;
    }
    animationFrame = requestAnimationFrame(animateRun);
  }

  function runTest() {
    if (running) return;
    if (!selected) {
      setStatus('needChip', 'bad');
      sound.error();
      return;
    }
    running = true;
    lastResult = null;
    displayMetrics = { coverage: 0, time: 0, bumps: 0 };
    route = buildRoute(ROOMS[roomIndex], selected);
    el.body.dataset.running = 'true';
    setStatus('running', '', t(STRATEGIES[selected].name));
    sound.start();
    render();
    runStartedAt = performance.now();
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(animateRun);
  }

  el.strategies.forEach((button) => {
    button.addEventListener('click', () => selectStrategy(button.dataset.strategy));
  });
  el.run.addEventListener('click', runTest);
  el.hint.addEventListener('click', () => {
    sound.click();
    setStatus(ROOMS[roomIndex].hint);
  });
  el.next.addEventListener('click', () => switchRoom(Math.min(2, roomIndex + 1)));
  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    renderControls();
    if (!sound.muted) sound.click();
  });
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.playAgain.addEventListener('click', () => {
    el.modal.hidden = true;
    switchRoom(0);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && sound.context?.state === 'running') sound.context.suspend().catch(() => {});
  });
  window.addEventListener('resize', () => drawRoom(lastResult ? 1 : 0));
  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang }) {
      t = translate;
      language = lang;
      render();
    },
  });
  window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame), { once: true });
})();
