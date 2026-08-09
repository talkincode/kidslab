(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '数据包骑士 · KidsLab',
      back: '返回平台',
      title: '数据包骑士',
      mission: '任务',
      sender: '晨星堡',
      receiver: '月桂城',
      packetTeam: '骑士小队',
      desk: '皇家调度台',
      wholeLetter: '整封送出',
      tooWide: '最快？',
      splitLetter: '拆成 4 包',
      numbered: '自动编号',
      hint: '问信鸮',
      dispatch: '吹号出发',
      redispatch: '改道出发',
      next: '下一项任务',
      finish: '领取骑士勋章',
      reset: '重置本次调度',
      playAgain: '再巡一次王国',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      theme: '切换主题',
      navLabel: '任务进度',
      mapLabel: '王国路由地图',
      bridgeDown: '主桥坍塌！',
      finalKicker: '三封王国急件全部送达',
      finalTitle: '授予你“网络守护骑士”勋章！',
      finalText: '数据被拆开后可以分路前进；编号负责重组，路由负责找路，断线时只需改道或重发没到的包。',
      finalRule1: '编号 → 乱序也能拼回',
      finalRule2: '断线 → 未到包改道',
      states: ['驿道畅通', '河谷拥塞', '主桥已断'],
      deskTitles: ['准备数据包', '计算最短驿道', '断线立即改道'],
      routePrompts: [
        '先点一个数据包，再为它选择驿道。4 个包要分走两条路。',
        '比较每条路线的总时间，选一条最快且不拥塞的路。',
        '先走主桥；桥塌后，只给还没送达的 3、4 号包改走备用路。',
      ],
      missions: [
        {
          kicker: '骑士入队 · 分头送信',
          title: '把长信拆成 4 个编号包',
          prompt: '城门太窄，整封信过不去。拆开、编号，再让小队走两条驿道。',
          lesson: '编号不是装饰：即使 3 号先到、1 号后到，收信城也能按 1→4 拼回原文。',
          icon: '✉',
          start: '先试试整封送出，或直接把信拆成 4 个小包。',
          hint: '拆包后，逐个点骑士，再让奇数包走北路、偶数包走南路。',
        },
        {
          kicker: '路由试炼 · 避开拥塞',
          title: '找出总时间最短的驿道',
          prompt: '每段路都有时间，堵车还会额外等待。把沿途数字相加再决定。',
          lesson: '路由器像驿站调度官：比较下一站和整条路线的代价，把包转发给更合适的下一跳。',
          icon: '⌁',
          start: '河谷驿站堵住了。三条路分别要 9、7、11 个时辰，选出最短的一条。',
          hint: '不要只看第一段。把每条路线的两段时间相加，最小的是 3+4。',
        },
        {
          kicker: '风暴试炼 · 断线改道',
          title: '主桥塌了，救回未到的数据包',
          prompt: '先派队伍走 6 时辰主路；断桥后，不用重送全部，只改道没到的包。',
          lesson: '网络可以在链路失效后换一条仍可达的路。编号和确认让我们知道究竟缺哪几个包。',
          icon: '⚡',
          start: '先选择主桥路线送出。风暴正在逼近，但前两个包也许来得及通过。',
          hint: '桥塌后，1、2 号已经送达。不要重送它们，也不要再点红色断桥，改走松林备用路。',
        },
      ],
      routes: [
        [
          { name: '北塔驿道', meta: '6 时辰', icon: '🏰' },
          { name: '南湖驿道', meta: '8 时辰', icon: '⛵' },
        ],
        [
          { name: '山门大道', meta: '4 + 5 = 9', icon: '⛰' },
          { name: '风车小径', meta: '3 + 4 = 7', icon: '🌬' },
          { name: '河谷驿道', meta: '2 + 3 + 堵 6 = 11', icon: '🌊' },
        ],
        [
          { name: '银桥主路', meta: '2 + 4 = 6', icon: '🌉' },
          { name: '河谷旧路', meta: '拥塞中', icon: '🌊' },
          { name: '松林备用路', meta: '4 + 5 = 9', icon: '🌲' },
        ],
      ],
      splitDone: '咔嚓！信件变成 1、2、3、4 号数据包。现在给每位骑士安排路线。',
      wholeFailed: '整封信卡在窄城门了！内容没有丢，拆成小包就能继续。',
      selectPacketFirst: '先点亮一位数据包骑士，再选择他的驿道。',
      selectRouteFirst: '先选择一条驿道，再吹号让数据包出发。',
      packetSelected: (n) => `${n} 号骑士待命。选择一条驿道。`,
      routeAssigned: (packet, route) => `${packet} 号骑士记住了“${route}”。继续安排其他骑士。`,
      needAllPackets: '还有骑士没拿到路线。4 个包都要安排后才能出发。',
      needTwoRoutes: '小队挤在同一条路上了。让两条驿道都分担数据包，网络会更有韧性。',
      level1Correct: '4、2、1、3 号先后到达，但编号让收信城按 1→4 拼回了“守护星光”！',
      routeChosen: (route) => `已选择“${route}”。确认总时间后吹号出发。`,
      shortestWrong: '这条路不是最快：要把所有路段和拥塞等待都算进去。路线还在，可以原地换路。',
      shortestCorrect: '选对了！3 + 4 = 7 个时辰，比 9 和 11 都短。数据包沿风车小径飞驰抵达。',
      mainWrong: '这条路现在拥塞或绕得太远。任务要求先走 6 时辰的银桥主路。',
      stormStarts: '1、2 号刚过桥，轰隆！银桥坍塌。3、4 号还在晨星堡，请改走仍可达的备用路。',
      collapsedWrong: '银桥已经断了，骑士安全退回。只需给 3、4 号换一条仍可达的路。',
      backupWrong: '河谷正在拥塞，不能及时送达。松林备用路仍然畅通。',
      rerouteCorrect: '改道成功！3、4 号穿过松林到达，接收端按编号补齐了整封信。',
      restored: '已恢复上次的骑士调度进度。',
    },
    en: {
      doc: 'Packet Knights · KidsLab',
      back: 'Back to platform',
      title: 'Packet Knights',
      mission: 'MISSION',
      sender: 'Dawnstar Keep',
      receiver: 'Laurel City',
      packetTeam: 'KNIGHT SQUAD',
      desk: 'ROYAL DISPATCH DESK',
      wholeLetter: 'Send it whole',
      tooWide: 'Fastest?',
      splitLetter: 'Split into 4',
      numbered: 'Auto-number',
      hint: 'Ask the signal owl',
      dispatch: 'Sound the horn',
      redispatch: 'Reroute now',
      next: 'Next mission',
      finish: 'Claim knight medal',
      reset: 'Reset this dispatch',
      playAgain: 'Patrol the kingdom again',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      theme: 'Switch theme',
      navLabel: 'Mission progress',
      mapLabel: 'Kingdom routing map',
      bridgeDown: 'MAIN BRIDGE DOWN!',
      finalKicker: 'ALL THREE ROYAL MESSAGES DELIVERED',
      finalTitle: 'You are a Guardian Knight of the Network!',
      finalText: 'Split data can travel along different paths. Numbers restore the order, routing finds a path, and only missing packets need rerouting or resending.',
      finalRule1: 'Numbers → rebuild out of order',
      finalRule2: 'Broken link → reroute missing packets',
      states: ['ROADS CLEAR', 'VALLEY CONGESTED', 'MAIN BRIDGE DOWN'],
      deskTitles: ['Prepare packets', 'Find the shortest route', 'Reroute around failure'],
      routePrompts: [
        'Tap a packet, then give it a relay route. Use both routes across the four packets.',
        'Add every segment and delay. Choose the fastest uncongested route.',
        'Start on the main bridge. After it falls, reroute only packets 3 and 4.',
      ],
      missions: [
        {
          kicker: 'SQUAD TRIAL · SPLIT THE MESSAGE',
          title: 'Turn One Long Letter into 4 Numbered Packets',
          prompt: 'The gate is too narrow for the whole letter. Split, number, and send the squad along two roads.',
          lesson: 'Numbers matter: even if packet 3 arrives before packet 1, Laurel City can rebuild the message in order from 1 to 4.',
          icon: '✉',
          start: 'Try sending the whole letter, or split it straight into four small packets.',
          hint: 'After splitting, tap each knight. Send odd packets north and even packets south.',
        },
        {
          kicker: 'ROUTING TRIAL · DODGE CONGESTION',
          title: 'Find the Relay Route with the Lowest Total Time',
          prompt: 'Every road takes time, and traffic adds a wait. Add the full route before choosing.',
          lesson: 'A router is like a relay dispatcher: it compares path costs and forwards each packet toward a useful next hop.',
          icon: '⌁',
          start: 'The valley relay is jammed. The three routes take 9, 7, and 11 hours. Choose the shortest.',
          hint: 'Do not inspect only the first road. Add both segments; the smallest total is 3+4.',
        },
        {
          kicker: 'STORM TRIAL · REROUTE',
          title: 'The Bridge Fell—Rescue the Undelivered Packets',
          prompt: 'Start on the 6-hour main road. After the break, reroute only what has not arrived.',
          lesson: 'A network can choose another reachable route after a link fails. Numbers and acknowledgements reveal exactly which packets are missing.',
          icon: '⚡',
          start: 'Choose the main bridge first. A storm is closing in, but two packets may cross in time.',
          hint: 'Packets 1 and 2 already arrived. Do not resend them or use the red bridge; take the Pinewood backup.',
        },
      ],
      routes: [
        [
          { name: 'North Tower Road', meta: '6 hours', icon: '🏰' },
          { name: 'South Lake Road', meta: '8 hours', icon: '⛵' },
        ],
        [
          { name: 'Mountain Gate', meta: '4 + 5 = 9', icon: '⛰' },
          { name: 'Windmill Path', meta: '3 + 4 = 7', icon: '🌬' },
          { name: 'River Valley', meta: '2 + 3 + jam 6 = 11', icon: '🌊' },
        ],
        [
          { name: 'Silver Bridge', meta: '2 + 4 = 6', icon: '🌉' },
          { name: 'Old Valley Road', meta: 'congested', icon: '🌊' },
          { name: 'Pinewood Backup', meta: '4 + 5 = 9', icon: '🌲' },
        ],
      ],
      splitDone: 'Snip! The letter is now packets 1, 2, 3, and 4. Give every knight a route.',
      wholeFailed: 'The whole letter is stuck in the narrow gate! Nothing was lost—split it to continue.',
      selectPacketFirst: 'Choose a packet knight first, then assign a relay route.',
      selectRouteFirst: 'Choose a relay route before sounding the departure horn.',
      packetSelected: (n) => `Knight ${n} is ready. Choose a route.`,
      routeAssigned: (packet, route) => `Knight ${packet} memorized “${route}.” Keep assigning the squad.`,
      needAllPackets: 'Some knights still need routes. Assign all four before departure.',
      needTwoRoutes: 'The whole squad is crowding one road. Share the packets across both roads for resilience.',
      level1Correct: 'Packets 4, 2, 1, and 3 arrived in that order, but their numbers rebuilt “Guard the Starlight” from 1 to 4!',
      routeChosen: (route) => `“${route}” selected. Check the total time, then sound the horn.`,
      shortestWrong: 'That is not the fastest path. Add every road segment and congestion delay, then switch routes here.',
      shortestCorrect: 'Correct! 3 + 4 = 7 hours, less than 9 or 11. The packets race down Windmill Path.',
      mainWrong: 'That route is congested or too long. This mission starts on the 6-hour Silver Bridge.',
      stormStarts: 'Packets 1 and 2 crossed—BOOM! The bridge fell. Packets 3 and 4 remain at Dawnstar; reroute them.',
      collapsedWrong: 'The Silver Bridge is down, so the knights returned safely. Give packets 3 and 4 a reachable route.',
      backupWrong: 'The valley is congested and cannot deliver in time. Pinewood remains open.',
      rerouteCorrect: 'Reroute complete! Packets 3 and 4 crossed Pinewood, and the receiver filled the numbered gaps.',
      restored: 'Your previous knight dispatch was restored.',
    },
  };

  const STORAGE_KEY = 'kidslab.packet-knights';
  const SOUND_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const elements = {
    course: $('#course'),
    topbar: $('#topbar'),
    kingdom: $('.kingdom'),
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionPrompt: $('#missionPrompt'),
    missionNav: $('#missionNav'),
    status: $('#status'),
    networkState: $('#networkState'),
    bridgeAlert: $('#bridgeAlert'),
    deliveryCount: $('#deliveryCount'),
    packets: [...document.querySelectorAll('.packet')],
    messageParts: [...document.querySelectorAll('#messageStrip span')],
    deskTitle: $('#deskTitle'),
    lessonIcon: $('#lessonIcon'),
    lessonText: $('#lessonText'),
    starterActions: $('#starterActions'),
    wholeLetterBtn: $('#wholeLetterBtn'),
    splitBtn: $('#splitBtn'),
    routePanel: $('#routePanel'),
    routePrompt: $('#routePrompt'),
    routeList: $('#routeList'),
    hintBtn: $('#hintBtn'),
    dispatchBtn: $('#dispatchBtn'),
    nextBtn: $('#nextBtn'),
    resetBtn: $('#resetBtn'),
    soundBtn: $('#soundBtn'),
    themeBtn: $('#themeBtn'),
    langBtn: $('#langBtn'),
    finale: $('#finale'),
    playAgainBtn: $('#playAgainBtn'),
    canvas: $('#mapCanvas'),
  };

  let t = (key) => key;
  let lang = 'zh';
  let muted = false;
  let audioContext = null;
  let state = loadState();
  let animationStart = 0;
  let animationKind = '';
  let frameId = 0;

  function freshState() {
    return {
      level: 0,
      phase: 'start',
      selectedPacket: null,
      assignments: [null, null, null, null],
      selectedRoute: null,
      delivered: 0,
      solved: false,
      completed: false,
      feedback: 'start',
    };
  }

  function loadState() {
    const fallback = freshState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || !Number.isInteger(saved.level) || saved.level < 0 || saved.level > 2) return fallback;
      const assignments = Array.isArray(saved.assignments) && saved.assignments.length === 4
        ? saved.assignments.map((value) => value === 0 || value === 1 ? value : null)
        : [null, null, null, null];
      const validPhases = ['start', 'split', 'bridge-down', 'solved'];
      const phase = validPhases.includes(saved.phase) ? saved.phase : 'start';
      return {
        level: saved.level,
        phase,
        selectedPacket: Number.isInteger(saved.selectedPacket) && saved.selectedPacket >= 0 && saved.selectedPacket < 4
          ? saved.selectedPacket
          : null,
        assignments,
        selectedRoute: Number.isInteger(saved.selectedRoute) && saved.selectedRoute >= 0 && saved.selectedRoute < 3
          ? saved.selectedRoute
          : null,
        delivered: [0, 2, 4].includes(saved.delivered) ? saved.delivered : 0,
        solved: Boolean(saved.solved),
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
      // Play continues if storage is unavailable.
    }
  }

  function mission() {
    return t('missions')[state.level];
  }

  function routes() {
    return t('routes')[state.level];
  }

  function feedbackText() {
    if (state.feedback === 'start') return mission().start;
    if (state.feedback === 'hint') return mission().hint;
    if (state.feedback === 'packet' && state.selectedPacket !== null) return t('packetSelected', state.selectedPacket + 1);
    if (state.feedback === 'assigned') return t('routePrompts')[state.level];
    if (state.feedback === 'route' && state.selectedRoute !== null) return t('routeChosen', routes()[state.selectedRoute].name);
    const value = t(state.feedback);
    return typeof value === 'string' ? value : mission().start;
  }

  function splitLetter() {
    if (state.level !== 0 || state.phase !== 'start') return;
    ensureAudio();
    state.phase = 'split';
    state.feedback = 'splitDone';
    playSound('split');
    window.cool?.track?.('split_message_into_packets');
    saveState();
    render();
  }

  function tryWholeLetter() {
    if (state.level !== 0 || state.phase !== 'start') return;
    ensureAudio();
    state.feedback = 'wholeFailed';
    playSound('error');
    window.cool?.track?.('try_whole_message');
    saveState();
    render();
  }

  function selectPacket(index) {
    if (state.level !== 0 || state.phase !== 'split' || state.solved) return;
    ensureAudio();
    state.selectedPacket = index;
    state.feedback = 'packet';
    playSound('select');
    saveState();
    render();
    elements.status.textContent = t('packetSelected', index + 1);
  }

  function selectRoute(index) {
    if (state.solved) return;
    ensureAudio();
    if (state.level === 0) {
      if (state.selectedPacket === null) {
        state.feedback = 'selectPacketFirst';
        playSound('error');
        render();
        return;
      }
      state.assignments[state.selectedPacket] = index;
      state.feedback = 'assigned';
      playSound('select');
      window.cool?.track?.('assign_packet_route', { packet: state.selectedPacket + 1, route: index + 1 });
      const assignedPacket = state.selectedPacket;
      state.selectedPacket = null;
      saveState();
      render();
      elements.status.textContent = t('routeAssigned', assignedPacket + 1, routes()[index].name);
      return;
    }

    state.selectedRoute = index;
    state.feedback = 'route';
    playSound('select');
    window.cool?.track?.('choose_network_route', { mission: state.level + 1, route: index + 1 });
    saveState();
    render();
    elements.status.textContent = t('routeChosen', routes()[index].name);
  }

  function dispatch() {
    ensureAudio();
    if (state.level === 0) {
      if (state.assignments.some((route) => route === null)) {
        state.feedback = 'needAllPackets';
        playSound('error');
        saveState();
        render();
        return;
      }
      if (new Set(state.assignments).size < 2) {
        state.feedback = 'needTwoRoutes';
        playSound('error');
        saveState();
        render();
        return;
      }
      solveMission('level1Correct', 'multipath');
      return;
    }

    if (state.selectedRoute === null) {
      state.feedback = 'selectRouteFirst';
      playSound('error');
      render();
      return;
    }

    if (state.level === 1) {
      if (state.selectedRoute !== 1) {
        state.feedback = 'shortestWrong';
        playSound('error');
        saveState();
        render();
        return;
      }
      solveMission('shortestCorrect', 'shortest');
      return;
    }

    if (state.phase === 'start') {
      if (state.selectedRoute !== 0) {
        state.feedback = 'mainWrong';
        playSound('error');
        saveState();
        render();
        return;
      }
      state.phase = 'bridge-down';
      state.delivered = 2;
      state.selectedRoute = null;
      state.feedback = 'stormStarts';
      playSound('collapse');
      window.cool?.stage?.('mission3-reroute');
      window.cool?.track?.('bridge_failure_detected');
      startAnimation('collapse');
      saveState();
      render();
      return;
    }

    if (state.selectedRoute === 0) {
      state.feedback = 'collapsedWrong';
      playSound('error');
      saveState();
      render();
      return;
    }
    if (state.selectedRoute === 1) {
      state.feedback = 'backupWrong';
      playSound('error');
      saveState();
      render();
      return;
    }
    solveMission('rerouteCorrect', 'reroute');
  }

  function solveMission(feedback, animation) {
    state.solved = true;
    state.phase = 'solved';
    state.delivered = 4;
    state.feedback = feedback;
    playSound('success');
    window.cool?.stage?.(`mission${state.level + 1}`);
    window.cool?.track?.('deliver_all_packets', { mission: state.level + 1 });
    startAnimation(animation);
    saveState();
    render();
  }

  function nextMission() {
    if (!state.solved) return;
    ensureAudio();
    if (state.level < 2) {
      const nextLevel = state.level + 1;
      state = freshState();
      state.level = nextLevel;
      playSound('page');
      window.cool?.track?.('open_next_network_mission', { mission: state.level + 1 });
      saveState();
      render();
      return;
    }
    state.completed = true;
    saveState();
    playSound('complete');
    window.cool?.complete?.();
    window.cool?.track?.('earn_network_knight_medal');
    render();
  }

  function resetMission() {
    ensureAudio();
    const level = state.level;
    state = freshState();
    state.level = level;
    playSound('page');
    window.cool?.track?.('reset_packet_dispatch', { mission: level + 1 });
    saveState();
    render();
  }

  function showHint() {
    ensureAudio();
    state.feedback = 'hint';
    playSound('hint');
    window.cool?.track?.('ask_routing_hint', { mission: state.level + 1 });
    saveState();
    render();
  }

  function playAgain() {
    state = freshState();
    saveState();
    playSound('page');
    render();
  }

  function trapFinaleFocus(event) {
    if (state.completed && event.key === 'Tab') {
      event.preventDefault();
      elements.playAgainBtn.focus();
    }
  }

  function renderRoutes() {
    elements.routeList.replaceChildren();
    routes().forEach((route, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'route-btn';
      button.dataset.route = String(index);
      if (state.selectedRoute === index) button.classList.add('is-selected');
      if (state.level === 2 && state.phase === 'bridge-down' && index === 0) button.classList.add('is-collapsed');
      if (state.solved && ((state.level === 1 && index === 1) || (state.level === 2 && index === 2))) {
        button.classList.add('is-right');
      }
      if (!state.solved && ['shortestWrong', 'mainWrong', 'collapsedWrong', 'backupWrong'].includes(state.feedback) && state.selectedRoute === index) {
        button.classList.add('is-wrong');
      }
      button.disabled = state.solved;
      button.innerHTML = `<span aria-hidden="true">${route.icon}</span><strong>${route.name}</strong><small>${route.meta}</small>`;
      button.addEventListener('click', () => selectRoute(index));
      elements.routeList.append(button);
    });
  }

  function renderPackets() {
    elements.packets.forEach((packet, index) => {
      const assigned = state.assignments[index];
      packet.disabled = state.level !== 0 || state.phase === 'start' || state.solved;
      packet.className = 'packet';
      if (state.selectedPacket === index) packet.classList.add('is-selected');
      if (assigned !== null || state.level > 0) packet.classList.add('is-assigned');
      if (index < state.delivered) packet.classList.add('is-delivered');
      packet.querySelector('small').textContent = assigned === null
        ? '—'
        : assigned === 0 ? (lang === 'zh' ? '北' : 'N') : (lang === 'zh' ? '南' : 'S');
    });
    elements.messageParts.forEach((part, index) => {
      part.classList.toggle('is-restored', index < state.delivered);
      part.textContent = lang === 'zh' ? ['守', '护', '星', '光'][index] : ['G', 'U', 'A', 'R'][index];
    });
  }

  function render() {
    const current = mission();
    elements.missionNumber.textContent = String(state.level + 1);
    elements.missionKicker.textContent = current.kicker;
    elements.missionTitle.textContent = current.title;
    elements.missionPrompt.textContent = current.prompt;
    elements.deskTitle.textContent = t('deskTitles')[state.level];
    elements.lessonIcon.textContent = current.icon;
    elements.lessonText.textContent = current.lesson;
    elements.routePrompt.textContent = t('routePrompts')[state.level];
    elements.status.textContent = feedbackText();
    elements.networkState.textContent = t('states')[state.level];
    elements.kingdom.dataset.phase = state.phase;
    elements.kingdom.dataset.result = state.solved ? 'right' : state.feedback.includes('Wrong') || state.feedback.includes('Failed') ? 'wrong' : 'idle';
    elements.bridgeAlert.hidden = !(state.level === 2 && state.phase === 'bridge-down');
    elements.deliveryCount.textContent = `${state.delivered} / 4`;

    elements.missionNav.replaceChildren();
    for (let index = 0; index < 3; index += 1) {
      const dot = document.createElement('span');
      dot.textContent = index < state.level ? '✓' : String(index + 1);
      if (index < state.level) dot.className = 'is-done';
      if (index === state.level) dot.className = 'is-current';
      elements.missionNav.append(dot);
    }
    elements.missionNav.setAttribute('aria-label', t('navLabel'));
    elements.canvas.setAttribute('aria-label', t('mapLabel'));

    elements.starterActions.hidden = state.level !== 0 || state.phase !== 'start';
    elements.routePanel.hidden = state.level === 0 && state.phase === 'start';
    elements.dispatchBtn.hidden = state.solved || (state.level === 0 && state.phase === 'start');
    elements.dispatchBtn.querySelector('[data-t]').textContent = state.level === 2 && state.phase === 'bridge-down'
      ? t('redispatch')
      : t('dispatch');
    elements.nextBtn.hidden = !state.solved;
    elements.nextBtn.querySelector('[data-t]').textContent = state.level === 2 ? t('finish') : t('next');

    renderRoutes();
    renderPackets();
    elements.course.inert = state.completed;
    elements.topbar.inert = state.completed;
    elements.finale.hidden = !state.completed;
    if (state.completed) requestAnimationFrame(() => elements.playAgainBtn.focus());

    elements.soundBtn.textContent = muted ? '🔇' : '🔊';
    elements.soundBtn.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
    elements.soundBtn.setAttribute('aria-pressed', String(muted));
    elements.themeBtn.setAttribute('aria-label', t('theme'));
    drawMap();
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function routeGeometry(level, index) {
    const geometries = [
      [
        [[0.13, 0.55], [0.36, 0.24], [0.65, 0.27], [0.87, 0.5]],
        [[0.13, 0.55], [0.38, 0.79], [0.67, 0.75], [0.87, 0.5]],
      ],
      [
        [[0.13, 0.55], [0.34, 0.2], [0.67, 0.24], [0.87, 0.5]],
        [[0.13, 0.55], [0.43, 0.46], [0.68, 0.44], [0.87, 0.5]],
        [[0.13, 0.55], [0.34, 0.82], [0.61, 0.75], [0.87, 0.5]],
      ],
      [
        [[0.13, 0.55], [0.42, 0.4], [0.68, 0.42], [0.87, 0.5]],
        [[0.13, 0.55], [0.34, 0.8], [0.66, 0.78], [0.87, 0.5]],
        [[0.13, 0.55], [0.35, 0.2], [0.66, 0.22], [0.87, 0.5]],
      ],
    ];
    return geometries[level][index];
  }

  function drawMap(timestamp = performance.now()) {
    const canvas = elements.canvas;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(rect.width * ratio);
    const height = Math.round(rect.height * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const context = canvas.getContext('2d');
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, rect.width, rect.height);

    const routeColor = cssVar('--route');
    const selectedColor = cssVar('--gold');
    const openColor = cssVar('--cyan');
    const dangerColor = cssVar('--red');
    const ink = '#fff4d6';
    const routeCount = state.level === 0 ? 2 : 3;
    for (let index = 0; index < routeCount; index += 1) {
      const points = routeGeometry(state.level, index).map(([x, y]) => [x * rect.width, y * rect.height]);
      const selected = state.selectedRoute === index || (state.level === 0 && state.assignments.includes(index));
      context.beginPath();
      context.moveTo(...points[0]);
      points.slice(1).forEach((point) => context.lineTo(...point));
      context.strokeStyle = state.level === 2 && state.phase === 'bridge-down' && index === 0
        ? dangerColor
        : selected ? selectedColor : routeColor;
      context.lineWidth = selected ? 5 : 3;
      context.setLineDash(state.level === 2 && state.phase === 'bridge-down' && index === 0 ? [8, 9] : [3, 8]);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.stroke();
      context.setLineDash([]);

      points.slice(1, -1).forEach(([x, y], pointIndex) => {
        context.beginPath();
        context.arc(x, y, 12, 0, Math.PI * 2);
        context.fillStyle = '#173641';
        context.fill();
        context.strokeStyle = selected ? selectedColor : openColor;
        context.lineWidth = 3;
        context.stroke();
        context.fillStyle = ink;
        context.font = '900 12px sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(String(pointIndex + 1), x, y);
      });
    }

    drawCastle(context, rect.width * 0.11, rect.height * 0.56, selectedColor, 'A');
    drawCastle(context, rect.width * 0.89, rect.height * 0.51, openColor, 'B');

    if (state.level === 2 && state.phase === 'bridge-down') {
      context.save();
      context.translate(rect.width * 0.55, rect.height * 0.41);
      context.rotate(-0.12);
      context.strokeStyle = dangerColor;
      context.lineWidth = 6;
      context.beginPath();
      context.moveTo(-22, -8);
      context.lineTo(-4, 8);
      context.lineTo(7, -9);
      context.lineTo(24, 8);
      context.stroke();
      context.restore();
    }

    if (animationKind) {
      const elapsed = Math.min((timestamp - animationStart) / 800, 1);
      drawAnimatedPackets(context, rect, elapsed);
      if (elapsed < 1) {
        frameId = requestAnimationFrame(drawMap);
      } else {
        animationKind = '';
      }
    }
  }

  function drawCastle(context, x, y, color, label) {
    context.save();
    context.translate(x, y);
    context.fillStyle = '#091b21';
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(-25, -22, 50, 43, 5);
    context.fill();
    context.stroke();
    [-18, 0, 18].forEach((offset) => {
      context.fillRect(offset - 6, -31, 12, 12);
      context.strokeRect(offset - 6, -31, 12, 12);
    });
    context.fillStyle = color;
    context.font = '900 16px sans-serif';
    context.textAlign = 'center';
    context.fillText(label, 0, 8);
    context.restore();
  }

  function drawAnimatedPackets(context, rect, progress) {
    const routesToUse = animationKind === 'multipath'
      ? state.assignments
      : animationKind === 'reroute' ? [2, 2] : [state.level === 1 ? 1 : 0, state.level === 1 ? 1 : 0];
    routesToUse.forEach((routeIndex, index) => {
      const delayed = Math.max(0, Math.min(1, progress * 1.3 - index * 0.11));
      const points = routeGeometry(state.level, routeIndex);
      const segmentProgress = delayed * (points.length - 1);
      const segment = Math.min(Math.floor(segmentProgress), points.length - 2);
      const local = segmentProgress - segment;
      const start = points[segment];
      const end = points[segment + 1];
      const x = (start[0] + (end[0] - start[0]) * local) * rect.width;
      const y = (start[1] + (end[1] - start[1]) * local) * rect.height;
      context.beginPath();
      context.arc(x, y, 11, 0, Math.PI * 2);
      context.fillStyle = cssVar('--gold');
      context.fill();
      context.strokeStyle = '#2b1910';
      context.lineWidth = 2;
      context.stroke();
      context.fillStyle = '#271a12';
      context.font = '900 12px sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(String(animationKind === 'reroute' ? index + 3 : index + 1), x, y);
    });
  }

  function startAnimation(kind) {
    cancelAnimationFrame(frameId);
    animationKind = kind;
    animationStart = performance.now();
    frameId = requestAnimationFrame(drawMap);
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

  function playSound(kind) {
    const context = ensureAudio();
    if (!context || muted) return;
    const sounds = {
      select: { notes: [330], duration: 0.08, type: 'triangle', gain: 0.045 },
      split: { notes: [680, 520, 760], duration: 0.07, type: 'square', gain: 0.025 },
      hint: { notes: [523, 659], duration: 0.1, type: 'sine', gain: 0.04 },
      error: { notes: [180, 135], duration: 0.14, type: 'sawtooth', gain: 0.035 },
      collapse: { notes: [220, 150, 95], duration: 0.18, type: 'sawtooth', gain: 0.045 },
      success: { notes: [392, 523, 659], duration: 0.12, type: 'triangle', gain: 0.055 },
      page: { notes: [294, 392], duration: 0.1, type: 'sine', gain: 0.04 },
      complete: { notes: [392, 494, 587, 784], duration: 0.15, type: 'triangle', gain: 0.06 },
    };
    const sound = sounds[kind] || sounds.select;
    sound.notes.forEach((frequency, index) => {
      const start = context.currentTime + index * sound.duration * 0.72;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = sound.type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(sound.gain, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + sound.duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + sound.duration + 0.02);
    });
  }

  function toggleSound() {
    muted = !muted;
    try {
      localStorage.setItem(SOUND_KEY, muted ? '1' : '0');
    } catch {
      // Sound preference remains in memory if storage is unavailable.
    }
    if (!muted) playSound('select');
    render();
  }

  elements.wholeLetterBtn.addEventListener('click', tryWholeLetter);
  elements.splitBtn.addEventListener('click', splitLetter);
  elements.packets.forEach((packet, index) => packet.addEventListener('click', () => selectPacket(index)));
  elements.dispatchBtn.addEventListener('click', dispatch);
  elements.nextBtn.addEventListener('click', nextMission);
  elements.resetBtn.addEventListener('click', resetMission);
  elements.hintBtn.addEventListener('click', showHint);
  elements.playAgainBtn.addEventListener('click', playAgain);
  elements.finale.addEventListener('keydown', trapFinaleFocus);
  elements.soundBtn.addEventListener('click', toggleSound);
  elements.langBtn.addEventListener('click', () => window.cool.preferences.toggleLang());
  elements.themeBtn.addEventListener('click', () => window.cool.preferences.toggleTheme());
  addEventListener('resize', () => drawMap());
  addEventListener('themechange', () => drawMap());

  try {
    muted = localStorage.getItem(SOUND_KEY) === '1';
  } catch {
    muted = false;
  }

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang: nextLang, theme }) {
      t = translate;
      lang = nextLang;
      document.title = t('doc');
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
      elements.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
      elements.themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
      render();
    },
  });
})();
