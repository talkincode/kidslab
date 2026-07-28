(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '激光镜屋 · KidsLab',
      back: '返回平台',
      title: '激光镜屋',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      roomsLabel: '镜屋房间',
      gridLabel: '镜子摆放网格',
      toolsLabel: '镜子工具',
      mirrors: '镜子',
      mirrorRack: 'MIRROR RACK / 镜架',
      slashMirror: '右斜镜',
      backslashMirror: '左斜镜',
      source: '发射器',
      crystal: '水晶',
      fixed: '固定装置',
      clear: '收回镜子',
      hint: '轻提示',
      power: '通电看光路',
      next: '下一间',
      finalKicker: '四间镜屋恢复供电',
      finalTitle: '全屋水晶依次亮起来了！',
      finalText: '你先在脑中走完光路，再让每一面镜子把预测变成了亮光。',
      playAgain: '再巡一次镜屋',
      roomLabel: (n, title) => `第 ${n} 间：${title}`,
      lockedRoom: '先完成前一间',
      cellEmpty: (x, y) => `第 ${y + 1} 行第 ${x + 1} 列，空格`,
      cellMirror: (x, y, mirror) => `第 ${y + 1} 行第 ${x + 1} 列，${mirror}`,
      cellFixed: (x, y, item) => `第 ${y + 1} 行第 ${x + 1} 列，${item}`,
      slashName: '右斜镜',
      backslashName: '左斜镜',
      wallName: '墙',
      splitterName: '分光镜',
      redFilterName: '红色滤镜',
      blueFilterName: '蓝色滤镜',
      targetName: '水晶',
      room1Kicker: '入门廊 · 单镜转向',
      room1Title: '一面镜子，第一次转弯',
      room1Text: '先想好路线，再把斜镜放进格子。通电后才能看见光。',
      room2Kicker: '回音厅 · 绕墙折返',
      room2Title: '两次转弯，绕过高墙',
      room2Text: '光要先向下，再向右。两面同方向的镜子会做不同的转弯。',
      room3Kicker: '双光廊 · 一束变两束',
      room3Title: '分光以后，两路都要到达',
      room3Text: '紫色分光镜让一道光直行，并复制出一条转弯的支路。',
      room4Kicker: '终极厅 · 彩色双航线',
      room4Title: '红蓝分流，各找各的水晶',
      room4Text: '白光分开后穿过滤镜染色。红光和蓝光要去对应的水晶。',
      goal1: '点亮 1 颗水晶',
      goal2: '绕墙点亮水晶',
      goal3: '同时点亮 2 颗水晶',
      goal4: '点亮红蓝 2 颗水晶',
      lesson1: '45° 斜镜会让横向光转成竖向光。',
      lesson2: '同一面 `\\` 镜，会根据来光方向把光向下或向右转。',
      lesson3: '分光镜保留直行光，还会复制一条反射光。',
      lesson4: '滤镜给光染色；颜色相同的光才能点亮对应水晶。',
      ready: '选一面斜镜，再点格子摆放。',
      placed: '镜子摆好了。先在脑中走一遍，再通电验证。',
      rotated: '这面镜子转了 90°。再检查一下光会去哪。',
      removed: '镜子已收回，可以换个位置。',
      cleared: '镜架清空了，重新规划一条路线。',
      noMirrors: '还没有摆镜子。先选一种斜镜，再点一个空格。',
      limitReached: (n) => `这一间只有 ${n} 面镜子。点已有镜子可转向，或先收回它。`,
      firing: '电源接通——光路正在显现！',
      miss: '还没点亮全部水晶。看最后一段光停在哪里，再原地调整。',
      colorMiss: '光到达了水晶，但颜色不匹配。检查它经过了哪块滤镜。',
      success: '全部点亮！你的预测路线和真实光路完全一致。',
      hint1: '从水晶倒着想：光要向上走，哪种镜面能把向右的光折上去？',
      hint2: '第一面镜让光向下；到了最下面，还要把光转向右。',
      hint3: '右边支路要向下，上边支路要向左。先看光抵达镜子时的方向。',
      hint4: '红光在右边向上，蓝光在底部向左；两面都选 `/`。',
    },
    en: {
      doc: 'Laser Mirror House · KidsLab',
      back: 'Back to platform',
      title: 'Laser Mirror House',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      roomsLabel: 'Mirror-house rooms',
      gridLabel: 'Mirror placement grid',
      toolsLabel: 'Mirror tools',
      mirrors: 'Mirrors',
      mirrorRack: 'MIRROR RACK',
      slashMirror: 'Slash mirror',
      backslashMirror: 'Backslash mirror',
      source: 'Emitter',
      crystal: 'Crystal',
      fixed: 'Fixed device',
      clear: 'Return mirrors',
      hint: 'Small hint',
      power: 'Power the laser',
      next: 'Next room',
      finalKicker: 'ALL FOUR ROOMS POWERED',
      finalTitle: 'Every Crystal Lit in Sequence!',
      finalText: 'You walked each route in your mind, then let every mirror turn prediction into light.',
      playAgain: 'Tour the house again',
      roomLabel: (n, title) => `Room ${n}: ${title}`,
      lockedRoom: 'Finish the previous room first',
      cellEmpty: (x, y) => `Row ${y + 1}, column ${x + 1}, empty`,
      cellMirror: (x, y, mirror) => `Row ${y + 1}, column ${x + 1}, ${mirror}`,
      cellFixed: (x, y, item) => `Row ${y + 1}, column ${x + 1}, ${item}`,
      slashName: 'slash mirror',
      backslashName: 'backslash mirror',
      wallName: 'wall',
      splitterName: 'beam splitter',
      redFilterName: 'red filter',
      blueFilterName: 'blue filter',
      targetName: 'crystal',
      room1Kicker: 'ENTRY HALL · SINGLE TURN',
      room1Title: 'One Mirror, One First Turn',
      room1Text: 'Plan the route, then place a diagonal mirror. The beam appears only after power-up.',
      room2Kicker: 'ECHO HALL · AROUND THE WALL',
      room2Title: 'Two Turns Around the Wall',
      room2Text: 'The beam must travel down, then right. Matching mirrors can make different turns.',
      room3Kicker: 'TWIN HALL · ONE BECOMES TWO',
      room3Title: 'Split the Beam, Reach Both Sides',
      room3Text: 'The violet splitter keeps one beam straight and copies a reflected branch.',
      room4Kicker: 'FINAL HALL · COLOR ROUTES',
      room4Title: 'Send Red and Blue to Their Crystals',
      room4Text: 'The split white beams pick up color through filters. Match each beam to its crystal.',
      goal1: 'Light 1 crystal',
      goal2: 'Go around the wall',
      goal3: 'Light 2 crystals together',
      goal4: 'Light red and blue crystals',
      lesson1: 'A 45° mirror turns a horizontal beam into a vertical beam.',
      lesson2: 'The same `\\` mirror turns light down or right depending on arrival direction.',
      lesson3: 'A splitter keeps the straight beam and copies a reflected branch.',
      lesson4: 'Filters color the beam. A crystal lights only when its color matches.',
      ready: 'Pick a diagonal mirror, then tap a square.',
      placed: 'Mirror placed. Walk the route in your mind, then power up.',
      rotated: 'That mirror turned 90°. Check the beam direction again.',
      removed: 'Mirror returned. Try a new position.',
      cleared: 'The rack is clear. Plan another route.',
      noMirrors: 'No mirrors yet. Pick a mirror, then tap an empty square.',
      limitReached: (n) => `This room has only ${n} mirrors. Rotate one already placed or return it first.`,
      firing: 'Power on — the hidden route is appearing!',
      miss: 'Not all crystals are glowing yet. See where the last beam stopped, then adjust in place.',
      colorMiss: 'A beam reached a crystal in the wrong color. Check which filter it crossed.',
      success: 'All crystals are glowing! Your prediction matches the real route.',
      hint1: 'Work backward from the crystal: which mirror turns a rightward beam upward?',
      hint2: 'The first mirror sends light down. At the bottom, turn it right.',
      hint3: 'The right branch must go down; the upper branch must go left. Check arrival directions.',
      hint4: 'Red goes up on the right and blue goes left at the bottom. Both mirrors are `/`.',
    },
  };

  const ROOMS = [
    {
      code: 'L-01',
      kicker: 'room1Kicker',
      title: 'room1Title',
      text: 'room1Text',
      goal: 'goal1',
      lesson: 'lesson1',
      hint: 'hint1',
      limit: 1,
      source: { y: 4, color: 'white' },
      targets: [{ x: 3, y: 0, color: 'white' }],
      fixed: [],
    },
    {
      code: 'L-02',
      kicker: 'room2Kicker',
      title: 'room2Title',
      text: 'room2Text',
      goal: 'goal2',
      lesson: 'lesson2',
      hint: 'hint2',
      limit: 2,
      source: { y: 1, color: 'white' },
      targets: [{ x: 6, y: 5, color: 'white' }],
      fixed: [
        { x: 4, y: 1, type: 'wall' },
        { x: 4, y: 2, type: 'wall' },
        { x: 4, y: 3, type: 'wall' },
        { x: 4, y: 4, type: 'wall' },
      ],
    },
    {
      code: 'L-03',
      kicker: 'room3Kicker',
      title: 'room3Title',
      text: 'room3Text',
      goal: 'goal3',
      lesson: 'lesson3',
      hint: 'hint3',
      limit: 2,
      source: { y: 3, color: 'white' },
      targets: [
        { x: 6, y: 5, color: 'white' },
        { x: 0, y: 1, color: 'white' },
      ],
      fixed: [{ x: 3, y: 3, type: 'splitter', mirror: '/' }],
    },
    {
      code: 'L-04',
      kicker: 'room4Kicker',
      title: 'room4Title',
      text: 'room4Text',
      goal: 'goal4',
      lesson: 'lesson4',
      hint: 'hint4',
      limit: 2,
      source: { y: 2, color: 'white' },
      targets: [
        { x: 6, y: 0, color: 'red' },
        { x: 0, y: 5, color: 'blue' },
      ],
      fixed: [
        { x: 2, y: 2, type: 'splitter', mirror: '\\' },
        { x: 4, y: 2, type: 'filter', color: 'red' },
        { x: 2, y: 3, type: 'filter', color: 'blue' },
      ],
    },
  ];

  const SAVE_KEY = 'kidslab.laser-mirrors';
  const SOUND_KEY = 'kidslab.sound.muted';
  const WIDTH = 8;
  const HEIGHT = 6;
  const DIR = {
    R: { x: 1, y: 0 },
    D: { x: 0, y: 1 },
    L: { x: -1, y: 0 },
    U: { x: 0, y: -1 },
  };
  const REFLECT = {
    '/': { R: 'U', U: 'R', L: 'D', D: 'L' },
    '\\': { R: 'D', D: 'R', L: 'U', U: 'L' },
  };
  const $ = (selector) => document.querySelector(selector);
  const el = {
    roomNumber: $('#roomNumber'),
    roomKicker: $('#roomKicker'),
    roomTitle: $('#roomTitle'),
    roomText: $('#roomText'),
    roomNav: $('#roomNav'),
    status: $('#status'),
    placedCount: $('#placedCount'),
    mirrorLimit: $('#mirrorLimit'),
    canvas: $('#laserCanvas'),
    board: $('#gridBoard'),
    glow: $('#powerGlow'),
    goal: $('#roomGoal'),
    code: $('#roomCode'),
    tools: [...document.querySelectorAll('[data-tool]')],
    toolRack: $('.tool-rack'),
    lesson: $('#lessonText'),
    clear: $('#clearBtn'),
    hint: $('#hintBtn'),
    power: $('#powerBtn'),
    next: $('#nextBtn'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
    modal: $('#completeModal'),
    playAgain: $('#playAgainBtn'),
  };

  const ctx = el.canvas.getContext('2d');
  let t = (key) => key;
  let language = 'zh';
  let roomIndex = 0;
  let unlocked = 0;
  let completed = new Set();
  let selectedTool = 'slash';
  let mirrors = new Map();
  let beams = [];
  let litTargets = new Set();
  let wrongColor = false;
  let busy = false;
  let won = false;
  let statusMessage = { key: 'ready', args: [], tone: '' };
  let fireTimer = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(ROOMS.length - 1, Math.max(0, Number(saved.unlocked) || 0));
    completed = new Set(Array.isArray(saved.completed)
      ? saved.completed.filter((value) => Number.isInteger(value) && value >= 0 && value < ROOMS.length)
      : []);
    roomIndex = unlocked;
  } catch {
    unlocked = 0;
    completed = new Set();
  }

  class SoundEngine {
    constructor() {
      try { this.muted = ['true', '1'].includes(localStorage.getItem(SOUND_KEY)); } catch { this.muted = false; }
      this.context = null;
    }

    updateButton() {
      el.sound.textContent = this.muted ? '🔇' : '🔊';
      el.sound.setAttribute('aria-pressed', String(this.muted));
      el.sound.setAttribute('aria-label', t(this.muted ? 'soundOn' : 'soundOff'));
    }

    toggle() {
      this.muted = !this.muted;
      try { localStorage.setItem(SOUND_KEY, String(this.muted)); } catch { /* Storage is optional. */ }
      if (this.muted && this.context) this.context.suspend().catch(() => {});
      this.updateButton();
      if (!this.muted) this.play('place');
    }

    play(kind) {
      if (this.muted) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      try {
        this.context ||= new AudioContextClass();
        if (this.context.state === 'suspended') this.context.resume().catch(() => {});
        const patterns = {
          place: [[420, 0, 0.07]],
          rotate: [[330, 0, 0.06], [470, 0.05, 0.08]],
          remove: [[310, 0, 0.08], [220, 0.06, 0.1]],
          fire: [[145, 0, 0.12], [290, 0.09, 0.18]],
          bounce: [[620, 0, 0.05]],
          error: [[185, 0, 0.13], [135, 0.1, 0.18]],
          success: [[523, 0, 0.1], [659, 0.09, 0.12], [784, 0.19, 0.22]],
          complete: [[392, 0, 0.1], [523, 0.1, 0.1], [659, 0.2, 0.12], [988, 0.32, 0.3]],
        };
        (patterns[kind] || patterns.place).forEach(([frequency, delay, duration]) => {
          const oscillator = this.context.createOscillator();
          const gain = this.context.createGain();
          const start = this.context.currentTime + delay;
          oscillator.type = kind === 'error' ? 'triangle' : 'sine';
          oscillator.frequency.setValueAtTime(frequency, start);
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(0.055, start + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
          oscillator.connect(gain).connect(this.context.destination);
          oscillator.start(start);
          oscillator.stop(start + duration + 0.025);
        });
      } catch {
        // Audio is optional; visual and text feedback remain available.
      }
    }
  }

  const sound = new SoundEngine();
  const currentRoom = () => ROOMS[roomIndex];
  const cellKey = (x, y) => `${x},${y}`;
  const setStatus = (key, args = [], tone = '') => { statusMessage = { key, args, tone }; };
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked, completed: [...completed] }));
    } catch {
      // Progress still works for the current visit when storage is unavailable.
    }
  }

  function fixedAt(room, x, y) {
    return room.fixed.find((item) => item.x === x && item.y === y);
  }

  function targetAt(room, x, y) {
    return room.targets.findIndex((target) => target.x === x && target.y === y);
  }

  function itemName(item) {
    if (!item) return '';
    if (item.type === 'wall') return t('wallName');
    if (item.type === 'splitter') return t('splitterName');
    if (item.type === 'filter') return t(item.color === 'red' ? 'redFilterName' : 'blueFilterName');
    return t('targetName');
  }

  function renderGrid() {
    const room = currentRoom();
    el.board.innerHTML = '';
    for (let y = 0; y < HEIGHT; y += 1) {
      for (let x = 0; x < WIDTH; x += 1) {
        const button = document.createElement('button');
        const key = cellKey(x, y);
        const fixed = fixedAt(room, x, y);
        const targetIndex = targetAt(room, x, y);
        const mirror = mirrors.get(key);
        button.type = 'button';
        button.className = `grid-cell${mirror ? ' occupied' : ''}`;
        button.dataset.cell = key;
        button.setAttribute('role', 'gridcell');
        if (fixed || targetIndex >= 0) {
          button.disabled = true;
          button.setAttribute('aria-label', t('cellFixed', x, y, fixed ? itemName(fixed) : t('targetName')));
        } else if (mirror) {
          button.setAttribute('aria-label', t('cellMirror', x, y, t(mirror === '/' ? 'slashName' : 'backslashName')));
        } else {
          button.setAttribute('aria-label', t('cellEmpty', x, y));
        }
        el.board.append(button);
      }
    }
  }

  function roomNav() {
    el.roomNav.innerHTML = '';
    ROOMS.forEach((room, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `room-btn${index === roomIndex ? ' current' : ''}${completed.has(index) ? ' done' : ''}`;
      button.textContent = String(index + 1).padStart(2, '0');
      button.disabled = index > unlocked;
      button.setAttribute('aria-label', index > unlocked ? t('lockedRoom') : t('roomLabel', index + 1, t(room.title)));
      button.addEventListener('click', () => loadRoom(index));
      el.roomNav.append(button);
    });
  }

  function updateTools() {
    el.tools.forEach((button) => {
      const active = button.dataset.tool === selectedTool;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function updateStatus() {
    el.status.textContent = t(statusMessage.key, ...statusMessage.args);
    el.status.className = `status${statusMessage.tone ? ` ${statusMessage.tone}` : ''}`;
  }

  function render() {
    const room = currentRoom();
    el.roomNumber.textContent = String(roomIndex + 1).padStart(2, '0');
    el.roomKicker.textContent = t(room.kicker);
    el.roomTitle.textContent = t(room.title);
    el.roomText.textContent = t(room.text);
    el.goal.textContent = t(room.goal);
    el.code.textContent = room.code;
    el.lesson.textContent = t(room.lesson);
    el.placedCount.textContent = String(mirrors.size);
    el.mirrorLimit.textContent = String(room.limit);
    el.roomNav.setAttribute('aria-label', t('roomsLabel'));
    el.board.setAttribute('aria-label', t('gridLabel'));
    el.toolRack.setAttribute('aria-label', t('toolsLabel'));
    el.next.hidden = !won;
    el.power.hidden = won;
    el.lang.textContent = language === 'zh' ? 'EN' : '中';
    el.theme.textContent = document.documentElement.dataset.theme === 'light' ? '🌙' : '☀️';
    el.theme.setAttribute('aria-label', t('themeLabel'));
    sound.updateButton();
    updateTools();
    updateStatus();
    roomNav();
    renderGrid();
    draw();
  }

  function loadRoom(index) {
    if (index > unlocked || busy) return;
    window.clearTimeout(fireTimer);
    roomIndex = index;
    mirrors = new Map();
    beams = [];
    litTargets = new Set();
    wrongColor = false;
    won = completed.has(index);
    busy = false;
    setStatus(won ? 'success' : 'ready', [], won ? 'good' : '');
    render();
  }

  function placeMirror(x, y) {
    if (busy || won) return;
    const room = currentRoom();
    const key = cellKey(x, y);
    const existing = mirrors.get(key);
    if (existing) {
      mirrors.set(key, existing === '/' ? '\\' : '/');
      setStatus('rotated');
      sound.play('rotate');
    } else if (mirrors.size >= room.limit) {
      setStatus('limitReached', [room.limit], 'bad');
      sound.play('error');
    } else {
      mirrors.set(key, selectedTool === 'slash' ? '/' : '\\');
      setStatus('placed');
      sound.play('place');
    }
    beams = [];
    litTargets = new Set();
    wrongColor = false;
    render();
    window.cool?.track?.('place_mirror', { room: roomIndex + 1 });
  }

  function clearMirrors() {
    if (busy || won) return;
    if (mirrors.size === 0) {
      setStatus('ready');
    } else {
      mirrors.clear();
      beams = [];
      litTargets = new Set();
      wrongColor = false;
      setStatus('cleared');
      sound.play('remove');
      window.cool?.track?.('clear_route', { room: roomIndex + 1 });
    }
    render();
  }

  function traceRoom() {
    const room = currentRoom();
    const finishedBeams = [];
    const hits = new Set();
    let mismatch = false;
    const queue = [{
      x: -1,
      y: room.source.y,
      dir: 'R',
      color: room.source.color,
      points: [{ x: 0, y: room.source.y + 0.5 }],
    }];
    const visited = new Set();

    while (queue.length) {
      const beam = queue.shift();
      let { x, y, dir, color } = beam;
      const points = [...beam.points];
      for (let steps = 0; steps < 80; steps += 1) {
        const vector = DIR[dir];
        x += vector.x;
        y += vector.y;
        if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
          points.push({
            x: Math.min(WIDTH, Math.max(0, x + 0.5)),
            y: Math.min(HEIGHT, Math.max(0, y + 0.5)),
          });
          break;
        }

        points.push({ x: x + 0.5, y: y + 0.5 });
        const stateKey = `${x},${y},${dir},${color}`;
        if (visited.has(stateKey)) break;
        visited.add(stateKey);

        const targetIndex = targetAt(room, x, y);
        if (targetIndex >= 0) {
          const target = room.targets[targetIndex];
          if (target.color === 'white' || target.color === color || color === 'white') {
            hits.add(targetIndex);
          } else {
            mismatch = true;
          }
          break;
        }

        const fixed = fixedAt(room, x, y);
        if (fixed?.type === 'wall') break;
        if (fixed?.type === 'filter') color = fixed.color;
        if (fixed?.type === 'splitter') {
          const branchDirection = REFLECT[fixed.mirror][dir];
          queue.push({
            x,
            y,
            dir: branchDirection,
            color,
            points: [{ x: x + 0.5, y: y + 0.5 }],
          });
        }

        const mirror = mirrors.get(cellKey(x, y));
        if (mirror) dir = REFLECT[mirror][dir];
      }
      finishedBeams.push({ color, points });
    }

    return { beams: finishedBeams, hits, mismatch };
  }

  function fire() {
    if (busy || won) return;
    if (mirrors.size === 0) {
      setStatus('noMirrors', [], 'bad');
      sound.play('error');
      render();
      return;
    }

    busy = true;
    setStatus('firing');
    sound.play('fire');
    const result = traceRoom();
    beams = result.beams;
    litTargets = result.hits;
    wrongColor = result.mismatch;
    el.glow.classList.remove('on');
    void el.glow.offsetWidth;
    el.glow.classList.add('on');
    updateStatus();
    draw();
    window.cool?.track?.('test_route', { room: roomIndex + 1 });

    fireTimer = window.setTimeout(() => {
      busy = false;
      if (litTargets.size === currentRoom().targets.length) {
        completeRoom();
      } else {
        setStatus(wrongColor ? 'colorMiss' : 'miss', [], 'bad');
        sound.play('error');
        render();
      }
    }, 520);
  }

  function completeRoom() {
    won = true;
    completed.add(roomIndex);
    unlocked = Math.max(unlocked, Math.min(ROOMS.length - 1, roomIndex + 1));
    setStatus('success', [], 'good');
    persist();
    sound.play(roomIndex === ROOMS.length - 1 ? 'complete' : 'success');
    window.cool?.stage?.(`room${roomIndex + 1}`);
    render();

    if (roomIndex === ROOMS.length - 1) {
      window.cool?.complete?.();
      window.setTimeout(() => {
        el.modal.hidden = false;
        el.playAgain.focus();
      }, 250);
    }
  }

  function nextRoom() {
    if (!won || roomIndex >= ROOMS.length - 1) return;
    loadRoom(roomIndex + 1);
  }

  function drawRoundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.roundRect(x, y, width, height, r);
  }

  function drawMirror(x, y, mirror, fixed = false) {
    const cx = x + 50;
    const cy = y + 50;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(mirror === '/' ? Math.PI / 4 : -Math.PI / 4);
    ctx.shadowColor = fixed ? '#a991ff' : '#24d7e8';
    ctx.shadowBlur = 16;
    ctx.fillStyle = fixed ? '#7758da' : '#c7fbff';
    drawRoundedRect(ctx, -9, -38, 18, 76, 8);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(-3, -31, 4, 62);
    ctx.restore();
  }

  function drawCrystal(target, lit) {
    const x = target.x * 100 + 50;
    const y = target.y * 100 + 50;
    const color = target.color === 'red' ? '#ff665c' : target.color === 'blue' ? '#4fa9ff' : '#24d7e8';
    ctx.save();
    ctx.translate(x, y);
    ctx.shadowColor = color;
    ctx.shadowBlur = lit ? 34 : 10;
    ctx.fillStyle = lit ? color : '#45616b';
    ctx.strokeStyle = lit ? '#ffffff' : color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.lineTo(28, -5);
    ctx.lineTo(18, 31);
    ctx.lineTo(-18, 31);
    ctx.lineTo(-28, -5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -27);
    ctx.lineTo(0, 24);
    ctx.moveTo(-21, -3);
    ctx.lineTo(20, -3);
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function drawFixed(item) {
    const x = item.x * 100;
    const y = item.y * 100;
    if (item.type === 'wall') {
      ctx.fillStyle = '#394a51';
      ctx.strokeStyle = '#70838a';
      ctx.lineWidth = 4;
      drawRoundedRect(ctx, x + 13, y + 8, 74, 84, 9);
      ctx.fill();
      ctx.stroke();
      for (let row = 0; row < 3; row += 1) {
        ctx.strokeStyle = 'rgba(255,255,255,0.13)';
        ctx.beginPath();
        ctx.moveTo(x + 15, y + 29 + row * 23);
        ctx.lineTo(x + 85, y + 29 + row * 23);
        ctx.stroke();
      }
    } else if (item.type === 'splitter') {
      drawMirror(x, y, item.mirror, true);
      ctx.save();
      ctx.translate(x + 50, y + 50);
      ctx.fillStyle = '#e4dcff';
      ctx.font = '900 17px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('×2', 0, 7);
      ctx.restore();
    } else if (item.type === 'filter') {
      const color = item.color === 'red' ? '#ff665c' : '#4fa9ff';
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;
      ctx.fillStyle = `${color}99`;
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      drawRoundedRect(ctx, x + 34, y + 10, 32, 80, 8);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawEmitter(room) {
    const y = room.source.y * 100 + 50;
    ctx.save();
    ctx.shadowColor = '#ff6b5f';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ff6b5f';
    ctx.beginPath();
    ctx.arc(18, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff3cc';
    ctx.beginPath();
    ctx.moveTo(23, y - 9);
    ctx.lineTo(47, y);
    ctx.lineTo(23, y + 9);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawBeams() {
    beams.forEach((beam) => {
      if (beam.points.length < 2) return;
      const color = beam.color === 'red' ? '#ff665c' : beam.color === 'blue' ? '#4fa9ff' : '#f7fff0';
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 7;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = 22;
      ctx.beginPath();
      beam.points.forEach((point, index) => {
        const x = point.x * 100;
        const y = point.y * 100;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.restore();
    });
  }

  function draw() {
    const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    el.canvas.width = 800 * ratio;
    el.canvas.height = 600 * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, 800, 600);

    const boardGradient = ctx.createRadialGradient(400, 300, 10, 400, 300, 520);
    boardGradient.addColorStop(0, cssVar('--board'));
    boardGradient.addColorStop(1, cssVar('--board-2'));
    ctx.fillStyle = boardGradient;
    ctx.fillRect(0, 0, 800, 600);

    ctx.strokeStyle = cssVar('--grid');
    ctx.lineWidth = 1;
    for (let x = 1; x < WIDTH; x += 1) {
      ctx.beginPath();
      ctx.moveTo(x * 100, 0);
      ctx.lineTo(x * 100, 600);
      ctx.stroke();
    }
    for (let y = 1; y < HEIGHT; y += 1) {
      ctx.beginPath();
      ctx.moveTo(0, y * 100);
      ctx.lineTo(800, y * 100);
      ctx.stroke();
    }

    const room = currentRoom();
    room.fixed.forEach(drawFixed);
    room.targets.forEach((target, index) => drawCrystal(target, litTargets.has(index)));
    mirrors.forEach((mirror, key) => {
      const [x, y] = key.split(',').map(Number);
      drawMirror(x * 100, y * 100, mirror);
    });
    drawEmitter(room);
    drawBeams();
  }

  el.board.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cell]');
    if (!button || button.disabled) return;
    const [x, y] = button.dataset.cell.split(',').map(Number);
    placeMirror(x, y);
  });

  el.tools.forEach((button) => {
    button.addEventListener('click', () => {
      selectedTool = button.dataset.tool;
      updateTools();
      sound.play('place');
    });
  });

  el.clear.addEventListener('click', clearMirrors);
  el.hint.addEventListener('click', () => {
    if (busy) return;
    setStatus(currentRoom().hint);
    sound.play('place');
    updateStatus();
    window.cool?.track?.('request_hint', { room: roomIndex + 1 });
  });
  el.power.addEventListener('click', fire);
  el.next.addEventListener('click', nextRoom);
  el.sound.addEventListener('click', () => sound.toggle());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.playAgain.addEventListener('click', () => {
    el.modal.hidden = true;
    unlocked = 0;
    completed = new Set();
    persist();
    loadRoom(0);
  });

  window.addEventListener('resize', draw);

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang }) {
      t = translate;
      language = lang;
      document.title = t('doc');
      render();
    },
  });
})();
