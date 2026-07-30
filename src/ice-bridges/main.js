(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '七桥滑冰 · KidsLab',
      back: '返回平台',
      title: '七桥滑冰',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      missionsLabel: '滑冰任务',
      lockedMission: '先完成上一块冰场',
      missionLabel: (n, title) => `任务 ${n}：${title}`,
      bridges: '冰桥',
      hint: '轻提示',
      next: '去下一块冰场',
      wearGoggles: '戴上奇偶眼镜',
      gogglesOn: '奇偶眼镜已开启',
      judgeQuestion: '七桥地图能一笔滑完吗？',
      possible: '能，继续试',
      impossible: '不能，奇点太多',
      routeGuide: '点击一块陆地出发，再逐块选择下一站。',
      route: '路线',
      undo: '退一步',
      resetRoute: '重铺冰面',
      repairGuide: '选一张施工单，再检查奇点有没有降到 0 或 2。',
      repairDouble: '同时封两座北桥',
      repairClose: '封掉城堡东桥',
      repairAdd: '新建南北直桥',
      testRepair: '让巡逻员试滑',
      finalKicker: '三张冰图全部破解',
      finalTitle: '你拿到了欧拉巡冰章！',
      finalText: '你会先数奇点判断能不能一笔画，也能改一座桥，让无解的小镇重新通车。',
      playAgain: '重新巡查三块冰场',
      odd: '奇',
      even: '偶',
      degree: '度',
      unknown: '待观察',
      north: '北岸',
      south: '南岸',
      castle: '城堡岛',
      east: '东岸',
      aurora: '极光台',
      pine: '松林',
      harbor: '冰港',
      market: '冬市',
      mill: '风车坡',
      act1Kicker: '旧城谜案 · 先判断',
      act1Title: '七座桥，真的能每座只滑一次吗？',
      act1Text: '桥滑过就会碎。先别急着出发，看看每块陆地接了几座桥。',
      act1Desk: '数一数，哪些陆地亮红灯',
      act1Lesson: '奇数点超过 2 个，不管从哪里出发都会被困住。',
      act1Ready: '戴上奇偶眼镜，让每块陆地说出自己的桥数。',
      act1NeedGoggles: '先看度数再判断。奇偶眼镜会把接桥数量标出来。',
      act1Glasses: '四块陆地全亮红灯：度数 3、3、5、3，都是奇数。',
      act1Wrong: '继续试也不会成功。四个奇点都想当路线的起点或终点，名额不够。',
      act1Done: '判断正确！四个奇点超过了上限 2，所以七桥地图无解。',
      act1Hint: '一条路线只有一个起点和一个终点；数数这里有几个奇数点。',
      act2Kicker: '月光冰环 · 亲手滑',
      act2Title: '这张地图没有奇点，把五座桥一笔滑完',
      act2Text: '每块陆地都接两座桥。选任意起点，沿还没碎的桥继续滑。',
      act2Desk: '把每座冰桥恰好滑一次',
      act2Lesson: '0 个奇点会形成回路：从哪里出发，最后就回到哪里。',
      act2Ready: '点一块陆地作为起点。走过的桥会裂开，不能再走第二次。',
      act2Start: '出发！现在点击与这里直接相连的下一块陆地。',
      act2NoBridge: '两块陆地之间没有桥。选一个真正相邻的下一站。',
      act2UsedBridge: '这座桥已经碎了，不能走第二次。换一条还亮着的桥。',
      act2Progress: (used, total) => `滑过 ${used}/${total} 座桥，路线还连着，继续！`,
      act2Done: '漂亮的冰环！每座桥恰好一次，而且你回到了起点。',
      act2Hint: '沿着外圈一直走，不要跳过陆地；最后一座桥会把你送回起点。',
      act3Kicker: '市政抢修 · 改图',
      act3Title: '只改一笔，让无解的七桥小镇重新通车',
      act3Text: '施工会改变两端陆地的奇偶性。目标是把奇点数降到 0 或 2。',
      act3Desk: '挑施工单，再用奇偶眼镜验收',
      act3Lesson: '增减一座桥，会让它两端的度数同时变奇或变偶。',
      act3Ready: '三张施工单里有两张可行。先选一张，再让巡逻员试滑。',
      act3Selected: '施工预览完成。看看度数，再让巡逻员试滑。',
      act3Wrong: '同时封两座相同方向的桥，奇偶性翻了两次又回到原样，仍有 4 个奇点。',
      act3DoneClose: '抢修成功！封一座桥后只剩 2 个奇点，路线从一个奇点滑到另一个。',
      act3DoneAdd: '新桥通车！新增一座桥后只剩 2 个奇点，小镇有了一笔路线。',
      act3Hint: '只增减一座桥，会同时翻转两个端点的奇偶性；一次改一座最有用。',
    },
    en: {
      doc: 'Seven Bridges on Ice · KidsLab',
      back: 'Back to platform',
      title: 'Seven Bridges on Ice',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      missionsLabel: 'Skating missions',
      lockedMission: 'Finish the previous rink first',
      missionLabel: (n, title) => `Mission ${n}: ${title}`,
      bridges: 'Bridges',
      hint: 'Small hint',
      next: 'Next rink',
      wearGoggles: 'Wear the odd-even goggles',
      gogglesOn: 'Odd-even goggles are on',
      judgeQuestion: 'Can the seven-bridge map be skated in one stroke?',
      possible: 'Yes, keep trying',
      impossible: 'No, too many odd points',
      routeGuide: 'Tap one land to start, then choose each next stop.',
      route: 'Route',
      undo: 'Undo one',
      resetRoute: 'Refreeze',
      repairGuide: 'Choose a work order, then check whether odd points fall to 0 or 2.',
      repairDouble: 'Close both north bridges',
      repairClose: 'Close the castle-east bridge',
      repairAdd: 'Build a north-south bridge',
      testRepair: 'Send the patrol skater',
      finalKicker: 'ALL THREE ICE MAPS SOLVED',
      finalTitle: 'You earned the Euler Ice Patrol badge!',
      finalText: 'You can count odd points before attempting a one-stroke route, then change one bridge to rescue an impossible town.',
      playAgain: 'Patrol all three rinks again',
      odd: 'Odd',
      even: 'Even',
      degree: 'degree',
      unknown: 'Hidden',
      north: 'North',
      south: 'South',
      castle: 'Castle',
      east: 'East',
      aurora: 'Aurora',
      pine: 'Pines',
      harbor: 'Ice Harbor',
      market: 'Winter Market',
      mill: 'Windmill',
      act1Kicker: 'OLD TOWN CASE · JUDGE FIRST',
      act1Title: 'Can You Skate All Seven Bridges Once?',
      act1Text: 'A bridge cracks after one crossing. Before starting, count how many bridges touch each land.',
      act1Desk: 'Find which lands light up red',
      act1Lesson: 'More than 2 odd points makes a one-stroke route impossible.',
      act1Ready: 'Wear the odd-even goggles so every land reveals its bridge count.',
      act1NeedGoggles: 'Check the degrees first. The goggles reveal how many bridges touch each land.',
      act1Glasses: 'All four lands glow red: degrees 3, 3, 5, and 3 are all odd.',
      act1Wrong: 'More attempts cannot fix it. Four odd points all demand start-or-finish jobs, but a route has only two.',
      act1Done: 'Correct! Four odd points exceed the limit of 2, so the seven-bridge map is impossible.',
      act1Hint: 'One route has one start and one finish. Count how many odd points want those two jobs.',
      act2Kicker: 'MOONLIT RING · SKATE IT',
      act2Title: 'Skate All Five Bridges in One Stroke',
      act2Text: 'Every land touches two bridges. Choose any start and keep taking unbroken bridges.',
      act2Desk: 'Cross every ice bridge exactly once',
      act2Lesson: 'Zero odd points makes a circuit: wherever you start, you finish there.',
      act2Ready: 'Tap any land to start. A crossed bridge cracks and cannot be used twice.',
      act2Start: 'Go! Now tap a directly connected next land.',
      act2NoBridge: 'Those lands have no bridge between them. Choose a truly adjacent stop.',
      act2UsedBridge: 'That bridge is already cracked. Choose one that is still bright.',
      act2Progress: (used, total) => `${used}/${total} bridges crossed and the route is still connected. Keep going!`,
      act2Done: 'A perfect ice circuit! Every bridge exactly once, and you returned to your start.',
      act2Hint: 'Keep following the outer ring without skipping a land. The last bridge returns you to the start.',
      act3Kicker: 'PUBLIC WORKS · CHANGE THE GRAPH',
      act3Title: 'Change One Bridge to Reopen the Town',
      act3Text: 'Construction flips the parity at both ends. Reduce the odd-point count to 0 or 2.',
      act3Desk: 'Choose a work order and inspect it',
      act3Lesson: 'Adding or removing one bridge flips both endpoint degrees between odd and even.',
      act3Ready: 'Two of the three work orders succeed. Pick one, then send the patrol skater.',
      act3Selected: 'Construction preview ready. Check the degrees, then send the patrol skater.',
      act3Wrong: 'Closing two parallel bridges flips parity twice, returning it to where it began: still 4 odd points.',
      act3DoneClose: 'Repair complete! Closing one bridge leaves 2 odd points, so a route runs from one odd point to the other.',
      act3DoneAdd: 'New bridge open! Adding one bridge leaves 2 odd points, so the town now has a one-stroke route.',
      act3Hint: 'Changing one bridge flips two endpoints once. A one-bridge change is more useful than changing the same pair twice.',
    },
  };

  const SAVE_KEY = 'kidslab.ice-bridges';
  const SOUND_KEY = 'kidslab.sound.muted';
  const MISSIONS = [
    { kicker: 'act1Kicker', title: 'act1Title', text: 'act1Text', desk: 'act1Desk', lesson: 'act1Lesson', icon: '4' },
    { kicker: 'act2Kicker', title: 'act2Title', text: 'act2Text', desk: 'act2Desk', lesson: 'act2Lesson', icon: '0' },
    { kicker: 'act3Kicker', title: 'act3Title', text: 'act3Text', desk: 'act3Desk', lesson: 'act3Lesson', icon: '±1' },
  ];

  const OLD_TOWN_NODES = [
    { id: 'north', x: 31, y: 18, tilt: '-4deg' },
    { id: 'south', x: 30, y: 82, tilt: '3deg' },
    { id: 'castle', x: 48, y: 50, tilt: '-2deg' },
    { id: 'east', x: 79, y: 50, tilt: '4deg' },
  ];
  const OLD_TOWN_EDGES = [
    { id: 'nc1', a: 'north', b: 'castle', curve: -13 },
    { id: 'nc2', a: 'north', b: 'castle', curve: 13 },
    { id: 'sc1', a: 'south', b: 'castle', curve: -13 },
    { id: 'sc2', a: 'south', b: 'castle', curve: 13 },
    { id: 'ne', a: 'north', b: 'east', curve: -9 },
    { id: 'se', a: 'south', b: 'east', curve: 9 },
    { id: 'ce', a: 'castle', b: 'east', curve: 0 },
  ];
  const RING_NODES = [
    { id: 'aurora', x: 50, y: 14, tilt: '-2deg' },
    { id: 'pine', x: 82, y: 38, tilt: '4deg' },
    { id: 'harbor', x: 70, y: 80, tilt: '-4deg' },
    { id: 'market', x: 30, y: 80, tilt: '3deg' },
    { id: 'mill', x: 18, y: 38, tilt: '-4deg' },
  ];
  const RING_EDGES = [
    { id: 'ap', a: 'aurora', b: 'pine', curve: 6 },
    { id: 'ph', a: 'pine', b: 'harbor', curve: 5 },
    { id: 'hm', a: 'harbor', b: 'market', curve: 5 },
    { id: 'mw', a: 'market', b: 'mill', curve: 5 },
    { id: 'wa', a: 'mill', b: 'aurora', curve: 6 },
  ];

  const $ = (selector) => document.querySelector(selector);
  const el = {
    course: $('.course'),
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    missionNav: $('#missionNav'),
    status: $('#status'),
    riverMap: $('#riverMap'),
    nodes: $('#nodesLayer'),
    skater: $('#skater'),
    degreeStrip: $('#degreeStrip'),
    usedCount: $('#usedCount'),
    edgeCount: $('#edgeCount'),
    deskKicker: $('#deskKicker'),
    deskTitle: $('#deskTitle'),
    judgePanel: $('#judgePanel'),
    routePanel: $('#routePanel'),
    repairPanel: $('#repairPanel'),
    goggles: $('#gogglesBtn'),
    routeText: $('#routeText'),
    undo: $('#undoBtn'),
    resetRoute: $('#resetRouteBtn'),
    testRepair: $('#testRepairBtn'),
    lessonIcon: $('#lessonIcon'),
    lessonText: $('#lessonText'),
    hint: $('#hintBtn'),
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
  let gogglesOn = false;
  let routeNodes = [];
  let usedEdges = [];
  let repairChoice = '';
  let statusMessage = { key: 'act1Ready', tone: '', args: [] };

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
  let restoreCompletion = completed.has(2);
  if (restoreCompletion) {
    missionIndex = 2;
    repairChoice = 'close-one';
    statusMessage = { key: 'act3DoneClose', tone: 'good', args: [] };
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

    reveal() {
      [260, 330, 410, 520].forEach((frequency, index) =>
        this.tone(frequency, 0.15, 0.018, 'triangle', index * 0.045));
    }

    skate() {
      this.tone(260, 0.09, 0.018, 'sine');
      this.tone(390, 0.11, 0.014, 'triangle', 0.04);
    }

    correct() {
      [392, 523, 659].forEach((frequency, index) =>
        this.tone(frequency, 0.2, 0.024, 'triangle', index * 0.055));
    }

    error() {
      this.tone(155, 0.15, 0.027, 'sawtooth');
      this.tone(108, 0.2, 0.021, 'sawtooth', 0.07);
    }

    finale() {
      [330, 440, 554, 659, 880].forEach((frequency, index) =>
        this.tone(frequency, 0.32, 0.026, 'triangle', index * 0.07));
    }

    setMuted(value) {
      this.muted = value;
      try { localStorage.setItem(SOUND_KEY, value ? '1' : '0'); } catch {}
      if (value && this.context) {
        this.sources.forEach((source) => {
          try { source.stop(); } catch {}
        });
        this.sources.clear();
      }
    }
  }

  const sound = new SoundEngine();

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked, completed: [...completed] }));
    } catch {}
  }

  function text(key, ...args) {
    const value = t(key);
    return typeof value === 'function' ? value(...args) : value;
  }

  function setStatus(key, tone = '', ...args) {
    statusMessage = { key, tone, args };
    el.status.textContent = text(key, ...args);
    el.status.className = tone || '';
  }

  function currentGraph() {
    if (missionIndex === 1) return { nodes: RING_NODES, edges: RING_EDGES };
    let edges = OLD_TOWN_EDGES.map((edge) => ({ ...edge }));
    if (missionIndex === 2) {
      if (repairChoice === 'close-one') {
        edges = edges.map((edge) => edge.id === 'ce' ? { ...edge, closed: true } : edge);
      } else if (repairChoice === 'double') {
        edges = edges.map((edge) => ['nc1', 'nc2'].includes(edge.id) ? { ...edge, closed: true } : edge);
      } else if (repairChoice === 'add-one') {
        edges.push({ id: 'ns-new', a: 'north', b: 'south', curve: 30, added: true });
      }
    }
    return { nodes: OLD_TOWN_NODES, edges };
  }

  function activeEdges(graph = currentGraph()) {
    return graph.edges.filter((edge) => !edge.closed);
  }

  function degrees(graph = currentGraph()) {
    const counts = Object.fromEntries(graph.nodes.map((node) => [node.id, 0]));
    activeEdges(graph).forEach((edge) => {
      counts[edge.a] += 1;
      counts[edge.b] += 1;
    });
    return counts;
  }

  function pathFor(edge, nodes) {
    const a = nodes.find((node) => node.id === edge.a);
    const b = nodes.find((node) => node.id === edge.b);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy) || 1;
    const mx = (a.x + b.x) / 2 + (-dy / length) * edge.curve;
    const my = (a.y + b.y) / 2 + (dx / length) * edge.curve;
    return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
  }

  function nodeName(id) {
    return text(id);
  }

  function renderGraph() {
    const graph = currentGraph();
    const nodeDegrees = degrees(graph);
    const showDegrees = missionIndex !== 0 || gogglesOn;
    el.riverMap.replaceChildren();
    graph.edges.forEach((edge) => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.classList.add('bridge-group');
      if (usedEdges.includes(edge.id)) group.classList.add('used');
      if (edge.closed) group.classList.add('closed');
      if (edge.added) group.classList.add('added');
      group.dataset.edge = edge.id;
      ['bridge-shadow', 'bridge-line'].forEach((className) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathFor(edge, graph.nodes));
        path.setAttribute('class', className);
        group.append(path);
      });
      el.riverMap.append(group);
    });

    el.nodes.replaceChildren();
    graph.nodes.forEach((node) => {
      const interactive = missionIndex === 1 && !completed.has(1);
      const element = document.createElement(interactive ? 'button' : 'div');
      if (interactive) element.type = 'button';
      element.className = 'node';
      element.dataset.node = node.id;
      element.style.setProperty('--x', node.x);
      element.style.setProperty('--y', node.y);
      element.style.setProperty('--tilt', node.tilt);
      const degree = nodeDegrees[node.id];
      if (showDegrees) element.classList.add(degree % 2 ? 'odd' : 'even');
      if (routeNodes.at(-1) === node.id) element.classList.add('current');
      const parity = degree % 2 ? text('odd') : text('even');
      element.innerHTML = `<span class="node__name">${nodeName(node.id)}</span><span class="node__degree">${showDegrees ? degree : '?'}</span>`;
      element.setAttribute('aria-label', showDegrees
        ? `${nodeName(node.id)}, ${text('degree')} ${degree}, ${parity}`
        : `${nodeName(node.id)}, ${text('unknown')}`);
      if (interactive) element.addEventListener('click', () => visitNode(node.id));
      el.nodes.append(element);
    });

    el.degreeStrip.replaceChildren();
    graph.nodes.forEach((node) => {
      const degree = nodeDegrees[node.id];
      const chip = document.createElement('span');
      chip.className = `degree-chip${showDegrees ? degree % 2 ? ' odd' : ' even' : ''}`;
      chip.innerHTML = `<span>${nodeName(node.id)}</span><b>${showDegrees ? degree : '?'}</b>`;
      el.degreeStrip.append(chip);
    });

    const currentNode = graph.nodes.find((node) => node.id === routeNodes.at(-1));
    if (currentNode) {
      el.skater.style.setProperty('--x', currentNode.x);
      el.skater.style.setProperty('--y', currentNode.y);
      el.skater.classList.add('visible');
    } else {
      el.skater.classList.remove('visible');
    }
    el.usedCount.textContent = usedEdges.length;
    el.edgeCount.textContent = activeEdges(graph).length;
  }

  function renderNav() {
    el.missionNav.replaceChildren();
    MISSIONS.forEach((mission, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `mission-btn${index === missionIndex ? ' current' : ''}${completed.has(index) ? ' done' : ''}`;
      button.textContent = String(index + 1).padStart(2, '0');
      button.disabled = index > unlocked;
      button.title = button.disabled ? text('lockedMission') : text('missionLabel', index + 1, text(mission.title));
      button.setAttribute('aria-label', button.title);
      button.addEventListener('click', () => switchMission(index));
      el.missionNav.append(button);
    });
    el.missionNav.setAttribute('aria-label', text('missionsLabel'));
  }

  function renderRoute() {
    el.routeText.textContent = routeNodes.length
      ? routeNodes.map(nodeName).join(' → ')
      : '—';
    el.undo.disabled = usedEdges.length === 0;
    el.resetRoute.disabled = routeNodes.length === 0;
  }

  function renderControls() {
    el.sound.textContent = sound.muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-label', text(sound.muted ? 'soundOn' : 'soundOff'));
    el.sound.setAttribute('aria-pressed', String(sound.muted));
    el.theme.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
    el.theme.setAttribute('aria-label', text('themeLabel'));
    el.lang.textContent = language === 'zh' ? 'EN' : '中';
    el.goggles.classList.toggle('active', gogglesOn);
    el.goggles.querySelector('[data-t]').textContent = text(gogglesOn ? 'gogglesOn' : 'wearGoggles');
    document.querySelectorAll('[data-repair]').forEach((button) => {
      button.classList.toggle('selected', button.dataset.repair === repairChoice);
      button.setAttribute('aria-pressed', String(button.dataset.repair === repairChoice));
    });
    el.testRepair.disabled = !repairChoice || completed.has(2);
  }

  function render() {
    const mission = MISSIONS[missionIndex];
    document.title = text('doc');
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-t]').forEach((node) => {
      node.textContent = text(node.dataset.t);
    });
    el.missionNumber.textContent = String(missionIndex + 1).padStart(2, '0');
    el.missionKicker.textContent = text(mission.kicker);
    el.missionTitle.textContent = text(mission.title);
    el.missionText.textContent = text(mission.text);
    el.deskTitle.textContent = text(mission.desk);
    el.lessonIcon.textContent = mission.icon;
    el.lessonText.textContent = text(mission.lesson);
    el.judgePanel.hidden = missionIndex !== 0;
    el.routePanel.hidden = missionIndex !== 1;
    el.repairPanel.hidden = missionIndex !== 2;
    el.next.hidden = !completed.has(missionIndex) || missionIndex === 2;
    setStatus(statusMessage.key, statusMessage.tone, ...statusMessage.args);
    renderNav();
    renderGraph();
    renderRoute();
    renderControls();
  }

  function resetMissionState() {
    gogglesOn = false;
    routeNodes = [];
    usedEdges = [];
    repairChoice = '';
  }

  function switchMission(index) {
    if (index > unlocked) return;
    missionIndex = index;
    resetMissionState();
    statusMessage = { key: `act${index + 1}Ready`, tone: '', args: [] };
    window.cool?.stage?.(`ice-bridges-${index + 1}`);
    sound.skate();
    render();
  }

  function completeMission() {
    completed.add(missionIndex);
    unlocked = Math.max(unlocked, Math.min(2, missionIndex + 1));
    save();
    if (missionIndex === 2) {
      sound.finale();
      window.cool?.complete?.();
      setTimeout(showCompletion, 300);
    } else {
      sound.correct();
    }
    render();
  }

  function showCompletion() {
    el.course.inert = true;
    el.modal.hidden = false;
    el.playAgain.focus();
  }

  function revealDegrees() {
    if (missionIndex !== 0 || completed.has(0)) return;
    gogglesOn = true;
    sound.reveal();
    setStatus('act1Glasses', 'good');
    window.cool?.track?.('reveal-odd-degree-lands', { oddCount: 4 });
    render();
  }

  function judgeMap(answer) {
    if (missionIndex !== 0 || completed.has(0)) return;
    if (!gogglesOn) {
      sound.error();
      setStatus('act1NeedGoggles', 'bad');
      return;
    }
    if (answer !== 'impossible') {
      sound.error();
      setStatus('act1Wrong', 'bad');
      window.cool?.track?.('misjudge-seven-bridge-map', { answer });
      return;
    }
    setStatus('act1Done', 'good');
    window.cool?.track?.('identify-impossible-euler-map', { oddCount: 4 });
    completeMission();
  }

  function visitNode(nodeId) {
    if (missionIndex !== 1 || completed.has(1)) return;
    if (routeNodes.length === 0) {
      routeNodes.push(nodeId);
      sound.skate();
      setStatus('act2Start');
      window.cool?.track?.('start-euler-route', { node: nodeId });
      render();
      return;
    }
    const current = routeNodes.at(-1);
    const connected = RING_EDGES.filter((edge) =>
      (edge.a === current && edge.b === nodeId) || (edge.b === current && edge.a === nodeId));
    const available = connected.find((edge) => !usedEdges.includes(edge.id));
    if (!available) {
      sound.error();
      setStatus(connected.length ? 'act2UsedBridge' : 'act2NoBridge', 'bad');
      return;
    }
    usedEdges.push(available.id);
    routeNodes.push(nodeId);
    sound.skate();
    if (usedEdges.length === RING_EDGES.length) {
      setStatus('act2Done', 'good');
      window.cool?.track?.('complete-euler-circuit', { bridges: usedEdges.length });
      completeMission();
      return;
    }
    setStatus('act2Progress', '', usedEdges.length, RING_EDGES.length);
    render();
  }

  function undoRoute() {
    if (missionIndex !== 1 || usedEdges.length === 0 || completed.has(1)) return;
    usedEdges.pop();
    routeNodes.pop();
    sound.skate();
    setStatus(routeNodes.length > 1 ? 'act2Progress' : 'act2Start', '', usedEdges.length, RING_EDGES.length);
    render();
  }

  function resetRoute() {
    if (missionIndex !== 1 || routeNodes.length === 0 || completed.has(1)) return;
    routeNodes = [];
    usedEdges = [];
    sound.reveal();
    setStatus('act2Ready');
    window.cool?.track?.('refreeze-euler-route');
    render();
  }

  function chooseRepair(choice) {
    if (missionIndex !== 2 || completed.has(2)) return;
    repairChoice = choice;
    sound.reveal();
    setStatus('act3Selected');
    window.cool?.track?.('preview-bridge-repair', { choice });
    render();
  }

  function testRepair() {
    if (missionIndex !== 2 || !repairChoice || completed.has(2)) return;
    const oddCount = Object.values(degrees()).filter((degree) => degree % 2).length;
    if (oddCount > 2) {
      sound.error();
      setStatus('act3Wrong', 'bad');
      window.cool?.track?.('test-invalid-bridge-repair', { choice: repairChoice, oddCount });
      return;
    }
    setStatus(repairChoice === 'add-one' ? 'act3DoneAdd' : 'act3DoneClose', 'good');
    window.cool?.track?.('repair-euler-map', { choice: repairChoice, oddCount });
    completeMission();
  }

  el.goggles.addEventListener('click', revealDegrees);
  document.querySelectorAll('[data-judge]').forEach((button) =>
    button.addEventListener('click', () => judgeMap(button.dataset.judge)));
  el.undo.addEventListener('click', undoRoute);
  el.resetRoute.addEventListener('click', resetRoute);
  document.querySelectorAll('[data-repair]').forEach((button) =>
    button.addEventListener('click', () => chooseRepair(button.dataset.repair)));
  el.testRepair.addEventListener('click', testRepair);
  el.hint.addEventListener('click', () => {
    sound.reveal();
    setStatus(MISSIONS[missionIndex].hint);
  });
  el.next.addEventListener('click', () => switchMission(Math.min(2, missionIndex + 1)));
  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    renderControls();
    if (!sound.muted) sound.skate();
  });
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.playAgain.addEventListener('click', () => {
    el.modal.hidden = true;
    el.course.inert = false;
    missionIndex = 0;
    unlocked = 0;
    completed.clear();
    resetMissionState();
    save();
    statusMessage = { key: 'act1Ready', tone: '', args: [] };
    window.cool?.stage?.('ice-bridges-1');
    render();
    el.goggles.focus();
  });

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang }) {
      t = translate;
      language = lang;
      render();
      if (restoreCompletion) {
        restoreCompletion = false;
        showCompletion();
      }
    },
  });
})();
