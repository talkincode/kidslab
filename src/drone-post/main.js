(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '无人机邮局 · KidsLab',
      back: '返回平台',
      title: '无人机邮局',
      mission: '航班',
      radar: '坐标雷达',
      command: '指令',
      wind: '风偏',
      arrival: '预计到达',
      delivered: '送达',
      tower: '夜航调度台',
      eastWest: '东西 / 横轴',
      northSouth: '南北 / 纵轴',
      hint: '航管提示',
      dispatch: '发射无人机',
      next: '下一封急件',
      finish: '点亮星光邮路',
      confirmRoute: '确认六点航线',
      reset: '重置本次指令',
      playAgain: '重新值夜班',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      theme: '切换主题',
      navLabel: '航班进度',
      waiting: '等待坐标',
      inFlight: '航线已锁定',
      scaleSignal: '核对比例尺',
      routeSignal: '编排星光邮路',
      waypointLabel: '候选航点',
      xMinus: '横坐标 x 减 1',
      xPlus: '横坐标 x 加 1',
      yMinus: '纵坐标 y 减 1',
      yPlus: '纵坐标 y 加 1',
      finalKicker: '三封夜航急件全部送达',
      finalTitle: '你成为了“星光领航员”！',
      finalText: '数对定位、向量修正、比例尺换算——六个航点已经在夜空连成你的专属邮路。',
      missions: [
        {
          kicker: '夜航急件 · 坐标城',
          title: '把图书送到 (4, 7)',
          prompt: '先报横坐标 x，再报纵坐标 y。调好坐标后发射。',
          instruction: '输入无人机指令坐标',
          target: [4, 7],
          wind: [0, 0],
          start: '邮局在 (1, 5)。图书馆向东 3 格、向北 2 格，它的坐标是多少？',
          lesson: '向东让 x 增大，向北让 y 增大：相对方向也能算出新门牌。',
          hintText: '从 (1, 5) 向东 3 格、向北 2 格：1 + 3 = 4，5 + 2 = 7。',
          wrong: (x, y) => `无人机停在 (${x}, ${y})。检查一下：横坐标在前，纵坐标在后。`,
          correct: '精准送达！(4, 7) 就是横街 4、纵街 7，数对次序不能交换。',
        },
        {
          kicker: '强风急件 · 修正航道',
          title: '风会把无人机吹偏 (+1, −2)',
          prompt: '学校在 (6, 3)。先反向修正指令，让风把无人机正好推到学校。',
          instruction: '发送能抵消风偏的坐标',
          target: [6, 3],
          wind: [1, -2],
          start: '目标是 (6, 3)，但风会让 x 加 1、y 减 2。不要直接发送目标坐标。',
          lesson: '先倒着想：指令 + 风偏 = 目标，所以指令 = 目标 − 风偏。',
          hintText: 'x 要少报 1，y 要多报 2：6 − 1 = 5，3 − (−2) = 5。',
          wrong: (x, y) => `风把无人机推到了 (${x}, ${y})。请从误差反推下一条指令。`,
          correct: '修正成功！(5, 5) + (+1, −2) = (6, 3)，风把无人机推到正确位置。',
        },
        {
          kicker: '跨城急件 · 比例尺航图',
          title: '选出 3 km 的跨城航线',
          prompt: '航图比例尺不同。算出每条路线的实际距离，选择正好 3 km 的航线。',
          instruction: '用图上距离 × 每厘米实际距离',
          target: [9, 9],
          wind: [0, 0],
          start: '别只比图上厘米数。每张航图的“1 cm 代表多少米”不同。',
          lesson: '实际距离 = 图上距离 × 每厘米代表的实际距离；1000 m = 1 km。',
          hintText: 'A 线：6 × 500 = 3000 m = 3 km。',
          wrong: () => '这条航线不是 3 km。把图上厘米数乘每厘米代表的米数，再换成千米。',
          correct: '星光邮路起飞！六段航线都沿横街或纵街飞行，每次转弯都形成直角。',
          routeInstruction: '连续报告 6 个航点',
          routeStart: '比例尺核对完成。依次选 6 个航点：每一段只能沿平行于 x 轴或 y 轴的街道飞行。',
          routeHint: '下一点要和上一点共享 x 或 y；横街与纵街相交成直角。',
          options: [
            ['A', '6 cm × 500 m/cm', '= 3 km'],
            ['B', '4 cm × 600 m/cm', '= 2.4 km'],
            ['C', '5 cm × 800 m/cm', '= 4 km'],
          ],
        },
      ],
    },
    en: {
      doc: 'Drone Post Office · KidsLab',
      back: 'Back to platform',
      title: 'Drone Post Office',
      mission: 'FLIGHT',
      radar: 'COORDINATE RADAR',
      command: 'COMMAND',
      wind: 'WIND',
      arrival: 'ARRIVAL',
      delivered: 'DELIVERED',
      tower: 'NIGHT CONTROL',
      eastWest: 'EAST–WEST / X',
      northSouth: 'NORTH–SOUTH / Y',
      hint: 'Tower hint',
      dispatch: 'Launch drone',
      next: 'Next urgent parcel',
      finish: 'Light the star route',
      confirmRoute: 'Confirm 6 stops',
      reset: 'Reset this command',
      playAgain: 'Take another night shift',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      theme: 'Switch theme',
      navLabel: 'Flight progress',
      waiting: 'AWAITING COORDINATES',
      inFlight: 'ROUTE LOCKED',
      scaleSignal: 'CHECK MAP SCALE',
      routeSignal: 'DESIGN STAR ROUTE',
      waypointLabel: 'Candidate waypoints',
      xMinus: 'Decrease x by 1',
      xPlus: 'Increase x by 1',
      yMinus: 'Decrease y by 1',
      yPlus: 'Increase y by 1',
      finalKicker: 'ALL THREE NIGHT PARCELS DELIVERED',
      finalTitle: 'You are a Starlight Navigator!',
      finalText: 'Ordered pairs, vector corrections, and map scales—six waypoints now form your own glowing postal route.',
      missions: [
        {
          kicker: 'NIGHT PARCEL · COORDINATE CITY',
          title: 'Deliver the books to (4, 7)',
          prompt: 'Call x first, then y. Set the coordinate and launch.',
          instruction: 'Enter the drone command coordinate',
          target: [4, 7],
          wind: [0, 0],
          start: 'The post office is at (1, 5). The library is 3 blocks east and 2 north. Where is it?',
          lesson: 'Moving east increases x; moving north increases y. Relative directions reveal a new address.',
          hintText: 'From (1, 5), go 3 east and 2 north: 1 + 3 = 4 and 5 + 2 = 7.',
          wrong: (x, y) => `The drone stopped at (${x}, ${y}). Check the order: x first, y second.`,
          correct: 'Delivered! (4, 7) means horizontal street 4 and vertical street 7. Order matters.',
        },
        {
          kicker: 'HIGH-WIND PARCEL · COURSE CORRECTION',
          title: 'Wind will shift the drone by (+1, −2)',
          prompt: 'The school is at (6, 3). Correct the command so the wind pushes the drone onto target.',
          instruction: 'Send a coordinate that cancels the wind',
          target: [6, 3],
          wind: [1, -2],
          start: 'Target (6, 3), but wind adds 1 to x and subtracts 2 from y. Do not send the target directly.',
          lesson: 'Think backward: command + wind = target, so command = target − wind.',
          hintText: 'Call x one lower and y two higher: 6 − 1 = 5 and 3 − (−2) = 5.',
          wrong: (x, y) => `The wind pushed the drone to (${x}, ${y}). Use that miss to correct the command.`,
          correct: 'Course corrected! (5, 5) + (+1, −2) = (6, 3), exactly at the school.',
        },
        {
          kicker: 'CROSS-CITY PARCEL · SCALE CHART',
          title: 'Choose the 3 km cross-city route',
          prompt: 'The charts use different scales. Find each real distance and choose exactly 3 km.',
          instruction: 'Map distance × metres per centimetre',
          target: [9, 9],
          wind: [0, 0],
          start: 'Do not compare centimetres alone. Each chart gives a different distance per centimetre.',
          lesson: 'Real distance = map distance × real distance represented per centimetre, and 1000 m = 1 km.',
          hintText: 'Route A: 6 × 500 = 3000 m = 3 km.',
          wrong: () => 'That route is not 3 km. Multiply map centimetres by metres per centimetre, then convert to kilometres.',
          correct: 'The star route is airborne! Every leg follows a horizontal or vertical street, and every turn is a right angle.',
          routeInstruction: 'Call 6 waypoints in order',
          routeStart: 'Scale confirmed. Pick 6 waypoints in order. Each leg must follow a street parallel to the x- or y-axis.',
          routeHint: 'The next point must share x or y with the last point. Horizontal and vertical streets meet at right angles.',
          options: [
            ['A', '6 cm × 500 m/cm', '= 3 km'],
            ['B', '4 cm × 600 m/cm', '= 2.4 km'],
            ['C', '5 cm × 800 m/cm', '= 4 km'],
          ],
        },
      ],
    },
  };

  const SAVE_KEY = 'kidslab.drone-post';
  const SOUND_KEY = 'kidslab.sound.muted';
  const WAYPOINTS = [[3, 0], [3, 4], [6, 4], [6, 7], [9, 7], [9, 9], [6, 0], [9, 4], [3, 7]];
  const $ = (selector) => document.querySelector(selector);
  const elements = {
    course: $('#course'),
    topbar: $('#topbar'),
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionPrompt: $('#missionPrompt'),
    missionNav: $('#missionNav'),
    radar: $('#radar'),
    signalText: $('#signalText'),
    canvas: $('#mapCanvas'),
    commandReadout: $('#commandReadout'),
    windReadout: $('#windReadout'),
    arrivalReadout: $('#arrivalReadout'),
    panelInstruction: $('#panelInstruction'),
    status: $('#status'),
    coordinateControls: $('#coordinateControls'),
    xValue: $('#xValue'),
    yValue: $('#yValue'),
    scaleOptions: $('#scaleOptions'),
    waypointOptions: $('#waypointOptions'),
    lessonText: $('#lessonText'),
    hintBtn: $('#hintBtn'),
    dispatchBtn: $('#dispatchBtn'),
    nextBtn: $('#nextBtn'),
    resetBtn: $('#resetBtn'),
    soundBtn: $('#soundBtn'),
    themeBtn: $('#themeBtn'),
    langBtn: $('#langBtn'),
    finale: $('#finale'),
    finaleCanvas: $('#finaleCanvas'),
    playAgainBtn: $('#playAgainBtn'),
  };

  let t = (key) => key;
  let lang = 'zh';
  let muted = false;
  let audioContext = null;
  let idleTimer = null;
  let animationFrame = null;
  let state = loadState();

  function freshState() {
    return {
      missionIndex: 0,
      x: 0,
      y: 0,
      selectedRoute: null,
      routeReady: false,
      waypoints: [],
      solved: false,
      completed: false,
      feedback: 'start',
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      if (!saved || !Number.isInteger(saved.missionIndex)) return freshState();
      return {
        missionIndex: Math.max(0, Math.min(2, saved.missionIndex)),
        x: Number.isInteger(saved.x) ? Math.max(0, Math.min(9, saved.x)) : 0,
        y: Number.isInteger(saved.y) ? Math.max(0, Math.min(9, saved.y)) : 0,
        selectedRoute: Number.isInteger(saved.selectedRoute) ? Math.max(0, Math.min(2, saved.selectedRoute)) : null,
        routeReady: Boolean(saved.routeReady),
        waypoints: Array.isArray(saved.waypoints)
          ? saved.waypoints.filter((index) => Number.isInteger(index) && index >= 0 && index < WAYPOINTS.length).slice(0, 6)
          : [],
        solved: Boolean(saved.solved),
        completed: Boolean(saved.completed),
        feedback: typeof saved.feedback === 'string' ? saved.feedback : 'start',
      };
    } catch {
      return freshState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch {
      // Progress remains session-local when storage is unavailable.
    }
  }

  function mission() {
    return t('missions')[state.missionIndex];
  }

  function arrival() {
    const current = mission();
    return [state.x + current.wind[0], state.y + current.wind[1]];
  }

  function formatPair(pair) {
    const signed = (value) => value > 0 ? `+${value}` : String(value).replace('-', '−');
    return `(${signed(pair[0])}, ${signed(pair[1])})`;
  }

  function adjust(axis, delta) {
    if (state.solved || state.missionIndex === 2) return;
    state[axis] = Math.max(0, Math.min(9, state[axis] + delta));
    state.feedback = 'ready';
    saveState();
    playSound('tick');
    window.cool?.track?.('adjust_coordinate', { mission: state.missionIndex + 1, axis, value: state[axis] });
    render();
    scheduleIdleHint();
  }

  function chooseRoute(index) {
    if (state.solved || state.missionIndex !== 2 || state.routeReady) return;
    state.selectedRoute = index;
    state.feedback = 'ready';
    saveState();
    playSound('tick');
    window.cool?.track?.('select_scaled_route', { route: index });
    render();
    scheduleIdleHint();
  }

  function chooseWaypoint(index) {
    if (state.solved || state.missionIndex !== 2 || !state.routeReady || state.waypoints.length >= 6) return;
    if (state.waypoints.includes(index)) {
      if (state.waypoints.at(-1) === index) {
        state.waypoints.pop();
        state.feedback = 'routeProgress';
        saveState();
        playSound('page');
        render();
      }
      return;
    }
    const previous = state.waypoints.length ? WAYPOINTS[state.waypoints.at(-1)] : [0, 0];
    const next = WAYPOINTS[index];
    if (previous[0] !== next[0] && previous[1] !== next[1]) {
      state.feedback = 'wrongTurn';
      playSound('error');
      window.cool?.track?.('reject_diagonal_leg', { from: previous, to: next });
      render();
      return;
    }
    state.waypoints.push(index);
    state.feedback = 'routeProgress';
    saveState();
    playSound('tick');
    window.cool?.track?.('add_waypoint', { index, count: state.waypoints.length });
    render();
    scheduleIdleHint();
  }

  function dispatch() {
    if (state.solved) return;
    const current = mission();
    if (state.missionIndex === 2) {
      if (state.selectedRoute === null) {
        state.feedback = 'missing';
        playSound('error');
        render();
        return;
      }
      if (state.selectedRoute !== 0) {
        state.feedback = 'wrong';
        playSound('error');
        window.cool?.track?.('miss_delivery', { mission: 3, route: state.selectedRoute });
        render();
        return;
      }
      if (!state.routeReady) {
        state.routeReady = true;
        state.feedback = 'routeReady';
        saveState();
        playSound('success');
        window.cool?.track?.('confirm_scaled_route', { route: state.selectedRoute });
        render();
        scheduleIdleHint();
        return;
      }
      if (state.waypoints.length < 6) {
        state.feedback = 'missingWaypoints';
        playSound('error');
        render();
        return;
      }
    } else {
      const [actualX, actualY] = arrival();
      if (actualX !== current.target[0] || actualY !== current.target[1]) {
        state.feedback = 'wrong';
        playSound('error');
        window.cool?.track?.('miss_delivery', { mission: state.missionIndex + 1, x: actualX, y: actualY });
        render();
        return;
      }
    }

    state.solved = true;
    state.feedback = 'correct';
    saveState();
    playSound('success');
    window.cool?.stage?.(`flight-${state.missionIndex + 1}`);
    window.cool?.track?.('deliver_parcel', { mission: state.missionIndex + 1 });
    render();
    clearTimeout(idleTimer);
  }

  function nextMission() {
    if (!state.solved) return;
    if (state.missionIndex === 2) {
      state.completed = true;
      saveState();
      window.cool?.complete?.();
      window.cool?.track?.('complete_night_shift', { flights: 3 });
      playSound('complete');
      render();
      return;
    }
    state = { ...freshState(), missionIndex: state.missionIndex + 1 };
    saveState();
    playSound('page');
    window.cool?.stage?.(`flight-${state.missionIndex + 1}`);
    render();
    scheduleIdleHint();
  }

  function resetMission() {
    if (state.solved) return;
    state.x = 0;
    state.y = 0;
    state.selectedRoute = null;
    state.routeReady = false;
    state.waypoints = [];
    state.feedback = 'start';
    saveState();
    playSound('page');
    render();
    scheduleIdleHint();
  }

  function showHint() {
    if (state.solved) return;
    state.feedback = 'hint';
    playSound('hint');
    window.cool?.track?.('request_tower_hint', { mission: state.missionIndex + 1 });
    render();
    scheduleIdleHint();
  }

  function playAgain() {
    state = freshState();
    saveState();
    elements.finale.hidden = true;
    elements.course.inert = false;
    elements.topbar.inert = false;
    cancelAnimationFrame(animationFrame);
    playSound('page');
    window.cool?.stage?.('flight-1');
    render();
    scheduleIdleHint();
  }

  function scheduleIdleHint() {
    clearTimeout(idleTimer);
    if (state.solved || state.completed) return;
    idleTimer = setTimeout(() => {
      state.feedback = 'hint';
      render();
    }, 30000);
  }

  function feedbackText() {
    const current = mission();
    if (state.feedback === 'hint') return state.routeReady ? current.routeHint : current.hintText;
    if (state.feedback === 'correct') return current.correct;
    if (state.feedback === 'missing') return lang === 'zh' ? '先选择一条航线，调度台才能发射。' : 'Choose a route before launch.';
    if (state.feedback === 'routeReady') return current.routeStart;
    if (state.feedback === 'routeProgress') {
      const count = state.waypoints.length;
      return lang === 'zh'
        ? `已报告 ${count}/6 个航点。每一段都要保持横飞或竖飞。`
        : `${count}/6 waypoints called. Keep every leg horizontal or vertical.`;
    }
    if (state.feedback === 'wrongTurn') return lang === 'zh'
      ? '这会斜穿楼群！下一点必须和上一点共享 x 或 y，只沿横街或纵街飞。'
      : 'That cuts diagonally through buildings! The next point must share x or y with the last point.';
    if (state.feedback === 'missingWaypoints') return lang === 'zh'
      ? `还差 ${6 - state.waypoints.length} 个航点。连续报满 6 个数对再起飞。`
      : `${6 - state.waypoints.length} waypoint(s) left. Call all 6 ordered pairs before launch.`;
    if (state.feedback === 'wrong') {
      const [actualX, actualY] = arrival();
      return current.wrong(actualX, actualY);
    }
    if (state.feedback === 'ready') {
      if (state.missionIndex === 2) return lang === 'zh' ? '航线已选好。发射前再核对一次实际距离。' : 'Route selected. Check the real distance before launch.';
      return lang === 'zh' ? `已输入 (${state.x}, ${state.y})。发射后，风偏会决定实际落点。` : `Command (${state.x}, ${state.y}) entered. Wind will determine the actual arrival.`;
    }
    return current.start;
  }

  function renderRouteOptions() {
    const current = mission();
    elements.scaleOptions.replaceChildren();
    if (state.missionIndex !== 2) return;
    current.options.forEach(([code, equation, result], index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'scale-option';
      button.dataset.route = String(index);
      button.setAttribute('aria-pressed', String(state.selectedRoute === index));
      const badge = document.createElement('b');
      const label = document.createElement('span');
      const detail = document.createElement('small');
      badge.textContent = code;
      label.textContent = equation;
      detail.textContent = result;
      button.append(badge, label, detail);
      if (state.selectedRoute === index) button.classList.add('is-selected');
      if (!state.solved && state.feedback === 'wrong' && state.selectedRoute === index) button.classList.add('is-wrong');
      if (state.solved && index === 0) button.classList.add('is-right');
      button.disabled = state.solved;
      elements.scaleOptions.append(button);
    });
  }

  function renderWaypointOptions() {
    elements.waypointOptions.replaceChildren();
    if (state.missionIndex !== 2 || !state.routeReady) return;
    WAYPOINTS.forEach((coordinate, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'waypoint-option';
      button.dataset.waypoint = String(index);
      button.textContent = `(${coordinate[0]}, ${coordinate[1]})`;
      button.setAttribute('aria-pressed', String(state.waypoints.includes(index)));
      if (state.waypoints.includes(index)) button.classList.add('is-selected');
      if (state.waypoints.at(-1) === index) button.classList.add('is-last');
      button.disabled = state.solved || (state.waypoints.includes(index) && state.waypoints.at(-1) !== index);
      elements.waypointOptions.append(button);
    });
    elements.waypointOptions.setAttribute('aria-label', t('waypointLabel'));
  }

  function render() {
    const current = mission();
    const actual = arrival();
    elements.missionNumber.textContent = String(state.missionIndex + 1).padStart(2, '0');
    elements.missionKicker.textContent = current.kicker;
    elements.missionTitle.textContent = current.title;
    elements.missionPrompt.textContent = current.prompt;
    elements.panelInstruction.textContent = state.routeReady ? current.routeInstruction : current.instruction;
    elements.status.textContent = feedbackText();
    elements.status.className = `status${state.solved ? ' is-correct' : state.feedback === 'wrong' || state.feedback === 'missing' ? ' is-wrong' : ''}`;
    elements.lessonText.textContent = state.feedback === 'hint'
      ? state.routeReady
        ? current.routeHint
        : current.hintText
      : state.routeReady
        ? current.routeHint
        : current.lesson;
    elements.xValue.textContent = String(state.x);
    elements.yValue.textContent = String(state.y);
    elements.commandReadout.textContent = state.missionIndex === 2 ? '—' : formatPair([state.x, state.y]);
    elements.windReadout.textContent = state.missionIndex === 2 ? '—' : formatPair(current.wind);
    elements.arrivalReadout.textContent = state.missionIndex === 2 ? (state.selectedRoute === null ? '—' : current.options[state.selectedRoute][2].replace('= ', '')) : formatPair(actual);
    elements.signalText.textContent = state.solved
      ? t('inFlight')
      : state.routeReady
        ? t('routeSignal')
        : state.missionIndex === 2
          ? t('scaleSignal')
          : t('waiting');
    elements.radar.dataset.result = state.solved ? 'correct' : state.feedback === 'wrong' ? 'wrong' : 'idle';
    elements.coordinateControls.hidden = state.missionIndex === 2;
    elements.scaleOptions.hidden = state.missionIndex !== 2 || state.routeReady;
    elements.waypointOptions.hidden = state.missionIndex !== 2 || !state.routeReady;
    renderRouteOptions();
    renderWaypointOptions();

    elements.missionNav.replaceChildren();
    for (let index = 0; index < 3; index += 1) {
      const marker = document.createElement('span');
      marker.textContent = index < state.missionIndex || (index === state.missionIndex && state.solved) ? '✓' : String(index + 1);
      if (index < state.missionIndex || (index === state.missionIndex && state.solved)) marker.className = 'is-done';
      else if (index === state.missionIndex) marker.className = 'is-current';
      elements.missionNav.append(marker);
    }
    elements.missionNav.setAttribute('aria-label', t('navLabel'));
    elements.dispatchBtn.hidden = state.solved;
    elements.nextBtn.hidden = !state.solved;
    elements.nextBtn.querySelector('span').textContent = state.missionIndex === 2 ? t('finish') : t('next');
    elements.dispatchBtn.querySelector('span').textContent = state.routeReady ? t('confirmRoute') : t('dispatch');
    elements.hintBtn.disabled = state.solved;
    elements.resetBtn.disabled = state.solved;
    elements.soundBtn.textContent = muted ? '🔇' : '🔊';
    elements.soundBtn.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
    elements.soundBtn.setAttribute('aria-pressed', String(muted));
    elements.themeBtn.setAttribute('aria-label', t('theme'));
    const axisLabels = {
      'x:-1': t('xMinus'),
      'x:1': t('xPlus'),
      'y:-1': t('yMinus'),
      'y:1': t('yPlus'),
    };
    elements.coordinateControls.querySelectorAll('[data-axis]').forEach((button) => {
      button.setAttribute('aria-label', axisLabels[`${button.dataset.axis}:${button.dataset.delta}`]);
    });
    elements.course.inert = state.completed;
    elements.topbar.inert = state.completed;
    document.body.classList.toggle('course-complete', state.completed);
    syncStarMapBack();
    elements.finale.hidden = !state.completed;
    drawMap();
    if (state.completed) {
      drawFinale();
      requestAnimationFrame(() => elements.playAgainBtn.focus());
    }
  }

  function color(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function setupCanvas(canvas) {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
    }
    const context = canvas.getContext('2d');
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { context, width, height };
  }

  function drawMap() {
    const { context: ctx, width, height } = setupCanvas(elements.canvas);
    const current = mission();
    ctx.clearRect(0, 0, width, height);
    const margin = Math.max(22, Math.min(width, height) * .09);
    const gridSize = Math.min((width - margin * 2) / 9, (height - margin * 1.55) / 9);
    const originX = (width - gridSize * 9) / 2;
    const originY = height - margin * .62;
    const point = ([x, y]) => [originX + x * gridSize, originY - y * gridSize];

    ctx.strokeStyle = 'rgba(88, 217, 210, .21)';
    ctx.lineWidth = 1;
    for (let index = 0; index <= 9; index += 1) {
      const x = originX + index * gridSize;
      const y = originY - index * gridSize;
      ctx.beginPath(); ctx.moveTo(x, originY); ctx.lineTo(x, originY - gridSize * 9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(originX, y); ctx.lineTo(originX + gridSize * 9, y); ctx.stroke();
    }
    ctx.strokeStyle = color('--cyan');
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + gridSize * 9, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, originY - gridSize * 9); ctx.stroke();

    ctx.fillStyle = 'rgba(233,255,237,.74)';
    ctx.font = `700 ${Math.max(10, Math.min(13, gridSize * .34))}px ${color('--font') || 'sans-serif'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let index = 0; index <= 9; index += 1) {
      ctx.fillText(String(index), originX + index * gridSize, Math.min(height - 7, originY + 15));
      if (index > 0) ctx.fillText(String(index), originX - 14, originY - index * gridSize);
    }

    if (!state.routeReady) {
      const [targetX, targetY] = point(current.target);
      ctx.fillStyle = color('--yellow');
      ctx.beginPath(); ctx.arc(targetX, targetY, Math.max(7, gridSize * .23), 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#102634';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#102634';
      ctx.font = `900 ${Math.max(11, gridSize * .32)}px sans-serif`;
      ctx.fillText(state.missionIndex === 2 ? '✉' : state.missionIndex === 1 ? 'S' : 'L', targetX, targetY + 1);
    }

    if (state.missionIndex < 2) {
      const commandPoint = point([state.x, state.y]);
      const actualPoint = point(arrival());
      ctx.setLineDash([7, 6]);
      ctx.strokeStyle = color('--orange');
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(commandPoint[0], commandPoint[1]); ctx.stroke();
      if (current.wind[0] || current.wind[1]) {
        ctx.strokeStyle = color('--cyan');
        ctx.beginPath(); ctx.moveTo(commandPoint[0], commandPoint[1]); ctx.lineTo(actualPoint[0], actualPoint[1]); ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.fillStyle = state.solved ? color('--green') : color('--orange');
      ctx.beginPath(); ctx.arc(actualPoint[0], actualPoint[1], Math.max(6, gridSize * .19), 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff8e3';
      ctx.font = `${Math.max(13, gridSize * .42)}px sans-serif`;
      ctx.fillText('✦', actualPoint[0], actualPoint[1]);
    } else if (!state.routeReady) {
      const routes = [
        [[0, 0], [2, 1], [4, 3], [6, 6], [9, 9]],
        [[0, 0], [2, 3], [5, 4], [9, 9]],
        [[0, 0], [1, 4], [5, 7], [9, 9]],
      ];
      routes.forEach((route, index) => {
        ctx.strokeStyle = index === state.selectedRoute ? color('--yellow') : 'rgba(233,255,237,.25)';
        ctx.lineWidth = index === state.selectedRoute ? 4 : 2;
        ctx.setLineDash(index === state.selectedRoute ? [] : [5, 6]);
        ctx.beginPath();
        route.forEach((coordinate, pointIndex) => {
          const [x, y] = point(coordinate);
          if (pointIndex === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });
      ctx.setLineDash([]);
    } else {
      const selected = [[0, 0], ...state.waypoints.map((index) => WAYPOINTS[index])];
      ctx.strokeStyle = color('--cyan');
      ctx.lineWidth = 4;
      ctx.beginPath();
      selected.forEach((coordinate, index) => {
        const [x, y] = point(coordinate);
        if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      WAYPOINTS.forEach((coordinate, index) => {
        const [x, y] = point(coordinate);
        ctx.fillStyle = state.waypoints.includes(index) ? color('--yellow') : 'rgba(233,255,237,.45)';
        ctx.beginPath(); ctx.arc(x, y, Math.max(5, gridSize * .16), 0, Math.PI * 2); ctx.fill();
      });
    }
  }

  function drawFinale() {
    cancelAnimationFrame(animationFrame);
    const start = performance.now();
    const routePoints = state.waypoints.length === 6
      ? [[0, 0], ...state.waypoints.map((index) => WAYPOINTS[index])]
      : [[0, 0], [3, 0], [3, 4], [6, 4], [6, 7], [9, 7], [9, 9]];
    const points = routePoints.map(([x, y]) => [.1 + x / 9 * .8, .86 - y / 9 * .72]);
    const animate = (now) => {
      if (!state.completed) return;
      const { context: ctx, width, height } = setupCanvas(elements.finaleCanvas);
      ctx.clearRect(0, 0, width, height);
      const progress = Math.min(1, (now - start) / 1400);
      for (let i = 0; i < 70; i += 1) {
        const x = (i * 79 % 101) / 101 * width;
        const y = (i * 47 % 97) / 97 * height;
        ctx.fillStyle = `rgba(255,241,180,${.16 + (i % 4) * .08})`;
        ctx.fillRect(x, y, i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1);
      }
      ctx.strokeStyle = color('--cyan');
      ctx.shadowColor = color('--cyan');
      ctx.shadowBlur = 18;
      ctx.lineWidth = 4;
      ctx.beginPath();
      const segmentProgress = progress * (points.length - 1);
      points.forEach(([px, py], index) => {
        if (index > Math.ceil(segmentProgress)) return;
        const x = px * width;
        const y = py * height;
        if (index === 0) ctx.moveTo(x, y);
        else if (index <= Math.floor(segmentProgress)) ctx.lineTo(x, y);
        else {
          const previous = points[index - 1];
          const local = segmentProgress - Math.floor(segmentProgress);
          ctx.lineTo((previous[0] + (px - previous[0]) * local) * width, (previous[1] + (py - previous[1]) * local) * height);
        }
      });
      ctx.stroke();
      points.slice(0, Math.floor(segmentProgress) + 1).forEach(([px, py]) => {
        ctx.fillStyle = color('--yellow');
        ctx.beginPath(); ctx.arc(px * width, py * height, 6, 0, Math.PI * 2); ctx.fill();
      });
      ctx.shadowBlur = 0;
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
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

  function syncStarMapBack() {
    const starMapBack = document.querySelector('.kidslab-starmap-back');
    if (!starMapBack) return;
    starMapBack.inert = state.completed;
    starMapBack.hidden = state.completed;
  }

  function playSound(kind) {
    const context = ensureAudio();
    if (!context || muted) return;
    const sounds = {
      tick: { notes: [440], duration: .06, type: 'square', gain: .025 },
      hint: { notes: [523, 659], duration: .1, type: 'sine', gain: .035 },
      error: { notes: [190, 145], duration: .14, type: 'sawtooth', gain: .025 },
      success: { notes: [392, 523, 659], duration: .12, type: 'triangle', gain: .045 },
      page: { notes: [294, 392], duration: .1, type: 'sine', gain: .035 },
      complete: { notes: [392, 494, 587, 784], duration: .17, type: 'triangle', gain: .05 },
    };
    const sound = sounds[kind] || sounds.tick;
    sound.notes.forEach((frequency, index) => {
      const at = context.currentTime + index * sound.duration * .72;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = sound.type;
      oscillator.frequency.setValueAtTime(frequency, at);
      gain.gain.setValueAtTime(.0001, at);
      gain.gain.exponentialRampToValueAtTime(sound.gain, at + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, at + sound.duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(at);
      oscillator.stop(at + sound.duration + .02);
    });
  }

  function toggleSound() {
    muted = !muted;
    try {
      localStorage.setItem(SOUND_KEY, String(muted));
    } catch {
      // Sound preference remains session-local if storage is unavailable.
    }
    if (muted && audioContext?.state === 'running') audioContext.suspend().catch(() => {});
    if (!muted) playSound('tick');
    render();
  }

  elements.coordinateControls.addEventListener('click', (event) => {
    const button = event.target.closest('[data-axis]');
    if (button) adjust(button.dataset.axis, Number(button.dataset.delta));
  });
  elements.scaleOptions.addEventListener('click', (event) => {
    const button = event.target.closest('[data-route]');
    if (button) chooseRoute(Number(button.dataset.route));
  });
  elements.waypointOptions.addEventListener('click', (event) => {
    const button = event.target.closest('[data-waypoint]');
    if (button) chooseWaypoint(Number(button.dataset.waypoint));
  });
  elements.dispatchBtn.addEventListener('click', dispatch);
  elements.nextBtn.addEventListener('click', nextMission);
  elements.hintBtn.addEventListener('click', showHint);
  elements.resetBtn.addEventListener('click', resetMission);
  elements.playAgainBtn.addEventListener('click', playAgain);
  elements.soundBtn.addEventListener('click', toggleSound);
  elements.langBtn.addEventListener('click', () => window.cool.preferences.toggleLang());
  elements.themeBtn.addEventListener('click', () => window.cool.preferences.toggleTheme());
  document.addEventListener('keydown', (event) => {
    if (state.completed && event.key === 'Tab') {
      event.preventDefault();
      elements.playAgainBtn.focus();
    }
  });
  addEventListener('DOMContentLoaded', syncStarMapBack);
  addEventListener('resize', drawMap);

  try {
    const storedMute = localStorage.getItem(SOUND_KEY);
    muted = storedMute === 'true' || storedMute === '1';
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
  window.cool?.stage?.(`flight-${state.missionIndex + 1}`);
  scheduleIdleHint();
})();
