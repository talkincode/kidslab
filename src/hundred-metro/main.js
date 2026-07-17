(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '🚇 百数地铁 · KidsLab',
      back: '返回平台',
      title: '百数地铁',
      passenger: '乘客任务',
      mission: '路线',
      moves: '已走',
      best: '最短',
      tip0: '先坐竖着的 ±10 快车，再坐横着的 ±1 慢车。',
      express: '快车 ±10',
      local: '慢车 ±1',
      now: '现在',
      destination: '终点',
      drive: '开哪班车？',
      undo: '退一站',
      hint: '提示',
      reset: '重新出发',
      routeLog: '列车记录',
      secret: '你发现了数位秘密！',
      next: '下一位乘客 →',
      again: '从第一位乘客再玩',
      place: (n) => `${Math.floor(n / 10)} 个十 · ${n % 10} 个一`,
      missionText: (target, place) => `去 ${target} 站${place}！`,
      edge: '轨道到头啦！换个方向，列车马上就能继续。',
      moved: (delta, current) => `${delta > 0 ? '+' : '−'}${Math.abs(delta)} 列车到达 ${current} 站。`,
      undoTip: (current) => `倒回 ${current} 站，路线可以重新选。`,
      resetTip: (start) => `回到 ${start} 站，重新规划最短路线！`,
      verticalHint: (delta) => `先看十位：试试 ${delta > 0 ? '+' : '−'}10 快车。`,
      horizontalHint: (delta) => `十位到位啦！再用 ${delta > 0 ? '+' : '−'}1 慢车。`,
      arrived: (target) => `叮咚！${target} 站到了。`,
      winPerfect: (steps) => `正好 ${steps} 站，满星到达！`,
      winGood: (steps) => `${steps} 站到达，路线很聪明！`,
      winExplore: (steps) => `${steps} 站到达，下次试试少绕一点！`,
      winPerfectText: '竖着跳十位，横着走个位。整张百数表都变成了地铁图！',
      winText: '成功送到终点！点击“重新出发”，还能挑战更短的路线。',
      stationLabel: (n) => `${n} 站`,
    },
    en: {
      doc: '🚇 Hundred-Chart Metro · KidsLab',
      back: 'Back',
      title: 'Hundred Metro',
      passenger: 'Passenger mission',
      mission: 'Trip',
      moves: 'Moves',
      best: 'Best',
      tip0: 'Ride the vertical ±10 express, then the horizontal ±1 local.',
      express: 'Express ±10',
      local: 'Local ±1',
      now: 'Now',
      destination: 'Goal',
      drive: 'Which train?',
      undo: 'Back 1 stop',
      hint: 'Hint',
      reset: 'Restart',
      routeLog: 'Train log',
      secret: 'You found the place-value secret!',
      next: 'Next passenger →',
      again: 'Play from passenger one',
      place: (n) => `${Math.floor(n / 10)} tens · ${n % 10} ones`,
      missionText: (target, place) => `Take me to ${target} ${place}!`,
      edge: 'End of the track! Pick another direction and keep rolling.',
      moved: (delta, current) => `${delta > 0 ? '+' : '−'}${Math.abs(delta)} train reached stop ${current}.`,
      undoTip: (current) => `Back at ${current}. You can choose a new route.`,
      resetTip: (start) => `Back to ${start}. Plan the shortest route!`,
      verticalHint: (delta) => `Look at the tens first: try the ${delta > 0 ? '+' : '−'}10 express.`,
      horizontalHint: (delta) => `Tens are ready! Try the ${delta > 0 ? '+' : '−'}1 local.`,
      arrived: (target) => `Ding ding! Welcome to stop ${target}.`,
      winPerfect: (steps) => `Exactly ${steps} stops — three-star trip!`,
      winGood: (steps) => `${steps} stops — smart route!`,
      winExplore: (steps) => `${steps} stops. Can you make it even shorter?`,
      winPerfectText: 'Jump tens vertically and ones horizontally. The whole hundred chart is now a metro map!',
      winText: 'Passenger delivered! Restart this trip to find an even shorter route.',
      stationLabel: (n) => `Stop ${n}`,
    },
  };

  const MISSIONS = [
    { start: 23, target: 67, rider: '🧒', zh: '看恐龙', en: 'to see dinosaurs' },
    { start: 84, target: 31, rider: '👧', zh: '参加画展', en: 'for the art show' },
    { start: 16, target: 52, rider: '🧑', zh: '买草莓', en: 'to buy strawberries' },
    { start: 45, target: 79, rider: '👦', zh: '找机器人', en: 'to find a robot' },
    { start: 92, target: 38, rider: '👩', zh: '去天文台', en: 'for the observatory' },
    { start: 11, target: 99, rider: '🧓', zh: '参加百站庆典', en: 'for the 100-stop party' },
  ];

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme', progress: 'kidslab.hundredmetro' };
  const store = {
    get: (key) => { try { return localStorage.getItem(key); } catch { return null; } },
    set: (key, value) => { try { localStorage.setItem(key, value); } catch {} },
  };

  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (!['light', 'dark'].includes(theme)) theme = 'light';

  const saved = (() => {
    try { return JSON.parse(store.get(LS.progress)) || {}; } catch { return {}; }
  })();
  const state = {
    level: 0,
    path: [],
    deltas: [],
    stars: saved.stars || {},
    muted: false,
    complete: false,
    idleTimer: 0,
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  const mission = () => MISSIONS[state.level];
  const row = (n) => Math.floor((n - 1) / 10);
  const col = (n) => (n - 1) % 10;
  const minSteps = (a, b) => Math.abs(row(a) - row(b)) + Math.abs(col(a) - col(b));
  const current = () => state.path[state.path.length - 1];

  const els = {
    grid: $('#stationGrid'),
    tip: $('#tip'),
    rider: $('#rider'),
    missionText: $('#missionText'),
    start: $('#startText'),
    target: $('#targetText'),
    sideTarget: $('#sideTargetText'),
    level: $('#levelText'),
    moves: $('#movesText'),
    best: $('#bestText'),
    stars: $('#stars'),
    current: $('#currentText'),
    place: $('#placeText'),
    targetPlace: $('#targetPlaceText'),
    routeLog: $('#routeLog'),
    win: $('#win'),
    winTitle: $('#winTitle'),
    winText: $('#winText'),
    secretEquation: $('#secretEquation'),
    next: $('#nextBtn'),
    undo: $('#undoBtn'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
  };

  for (let n = 1; n <= 100; n += 1) {
    const station = document.createElement('div');
    station.className = 'station';
    station.dataset.station = String(n);
    station.setAttribute('role', 'gridcell');
    station.textContent = String(n);
    els.grid.append(station);
  }

  let audio = null;
  function tone(frequency = 440, duration = 0.08, delay = 0) {
    if (state.muted) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const start = audio.currentTime + delay;
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    } catch {}
  }

  function playArrival() {
    [523, 659, 784, 1047].forEach((frequency, index) => tone(frequency, 0.14, index * 0.08));
  }

  function setTip(message) {
    els.tip.textContent = message;
    resetIdleHint();
  }

  function routeStars() {
    return state.stars[state.level] || 0;
  }

  function validMove(from, delta) {
    if (delta === -10) return from > 10;
    if (delta === 10) return from <= 90;
    if (delta === -1) return col(from) > 0;
    if (delta === 1) return col(from) < 9;
    return false;
  }

  function missionLabel(item) {
    return t('missionText')(item.target, lang === 'zh' ? item.zh : item.en);
  }

  function equation(item) {
    const vertical = row(item.target) - row(item.start);
    const horizontal = col(item.target) - col(item.start);
    const parts = [String(item.start)];
    if (vertical) parts.push(`${vertical > 0 ? '+' : '−'} ${Math.abs(vertical)}×10`);
    if (horizontal) parts.push(`${horizontal > 0 ? '+' : '−'} ${Math.abs(horizontal)}×1`);
    return `${parts.join(' ')} = ${item.target}`;
  }

  function render() {
    const item = mission();
    const here = current();
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((node) => {
      const value = I18N[lang][node.dataset.t];
      if (typeof value === 'string') node.textContent = value;
    });
    els.lang.textContent = lang === 'zh' ? 'EN' : '中';
    els.theme.textContent = theme === 'light' ? '🌙' : '☀️';
    els.sound.textContent = state.muted ? '🔇' : '🔊';
    els.rider.textContent = item.rider;
    els.missionText.textContent = missionLabel(item);
    els.start.textContent = item.start;
    els.target.textContent = item.target;
    els.sideTarget.textContent = item.target;
    els.level.textContent = `${state.level + 1}/${MISSIONS.length}`;
    els.moves.textContent = state.deltas.length;
    els.best.textContent = minSteps(item.start, item.target);
    els.stars.textContent = '⭐'.repeat(routeStars()) + '☆'.repeat(3 - routeStars());
    els.current.textContent = here;
    els.place.textContent = t('place')(here);
    els.targetPlace.textContent = t('place')(item.target);
    els.next.textContent = state.level === MISSIONS.length - 1 ? t('again') : t('next');

    $$('.station').forEach((station) => {
      const n = Number(station.dataset.station);
      station.className = 'station';
      station.setAttribute('aria-label', t('stationLabel')(n));
      if (state.path.includes(n)) station.classList.add('visited');
      if (n === item.start) station.classList.add('start');
      if (n === item.target) station.classList.add('goal');
      station.textContent = String(n);
      if (n === here) {
        const train = document.createElement('span');
        train.className = 'train';
        train.textContent = '🚇';
        train.setAttribute('aria-hidden', 'true');
        station.append(train);
      }
    });

    els.routeLog.innerHTML = `<span class="route-empty">${item.start}</span>`;
    state.deltas.slice(-7).forEach((delta) => {
      const step = document.createElement('span');
      step.className = `route-step ${Math.abs(delta) === 10 ? 'express' : 'local'}`;
      step.textContent = `${delta > 0 ? '+' : '−'}${Math.abs(delta)}`;
      els.routeLog.append(step);
    });

    $$('.move').forEach((button) => {
      button.disabled = state.complete || !validMove(here, Number(button.dataset.delta));
    });
    els.undo.disabled = state.complete || state.path.length <= 1;
  }

  function resetIdleHint() {
    clearTimeout(state.idleTimer);
    if (!state.complete) state.idleTimer = setTimeout(showHint, 18000);
  }

  function suggestedDelta() {
    const item = mission();
    const here = current();
    if (row(here) !== row(item.target)) return row(here) < row(item.target) ? 10 : -10;
    if (col(here) !== col(item.target)) return col(here) < col(item.target) ? 1 : -1;
    return 0;
  }

  function showHint() {
    if (state.complete) return;
    const delta = suggestedDelta();
    if (!delta) return;
    $$('.move').forEach((button) => button.classList.toggle('suggest', Number(button.dataset.delta) === delta));
    const nextStation = current() + delta;
    document.querySelector(`[data-station="${nextStation}"]`)?.classList.add('hint');
    setTip(Math.abs(delta) === 10 ? t('verticalHint')(delta) : t('horizontalHint')(delta));
    setTimeout(() => {
      $$('.move').forEach((button) => button.classList.remove('suggest'));
      document.querySelector(`[data-station="${nextStation}"]`)?.classList.remove('hint');
    }, 1600);
    window.cool?.track('hint_route');
  }

  function move(delta) {
    if (state.complete) return;
    const here = current();
    if (!validMove(here, delta)) {
      tone(150, 0.18);
      setTip(t('edge'));
      return;
    }
    const next = here + delta;
    state.path.push(next);
    state.deltas.push(delta);
    tone(Math.abs(delta) === 10 ? 380 : 620);
    setTip(t('moved')(delta, next));
    window.cool?.track(Math.abs(delta) === 10 ? 'ride_express' : 'ride_local');
    render();
    if (next === mission().target) completeTrip();
  }

  function completeTrip() {
    state.complete = true;
    clearTimeout(state.idleTimer);
    const item = mission();
    const shortest = minSteps(item.start, item.target);
    const steps = state.deltas.length;
    const stars = steps === shortest ? 3 : steps <= shortest + 2 ? 2 : 1;
    state.stars[state.level] = Math.max(routeStars(), stars);
    store.set(LS.progress, JSON.stringify({ stars: state.stars }));
    els.secretEquation.textContent = equation(item);
    els.winTitle.textContent = stars === 3 ? t('winPerfect')(steps) : stars === 2 ? t('winGood')(steps) : t('winExplore')(steps);
    els.winText.textContent = stars === 3 ? t('winPerfectText') : t('winText');
    setTip(t('arrived')(item.target));
    render();
    playArrival();
    confetti(stars === 3 ? 34 : 18);
    setTimeout(() => { els.win.hidden = false; }, 380);
    window.cool?.stage(`route_${state.level + 1}_complete`);
    if (state.level === MISSIONS.length - 1) window.cool?.complete?.();
  }

  function confetti(count) {
    for (let index = 0; index < count; index += 1) {
      const piece = document.createElement('i');
      piece.className = 'confetti';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.animationDuration = `${1.7 + Math.random() * 1.7}s`;
      piece.style.animationDelay = `${Math.random() * 0.45}s`;
      piece.style.background = index % 3 === 0 ? 'var(--express)' : index % 3 === 1 ? 'var(--local)' : 'var(--accent)';
      document.body.append(piece);
      setTimeout(() => piece.remove(), 3900);
    }
  }

  function startMission(level = state.level) {
    state.level = level;
    const item = mission();
    state.path = [item.start];
    state.deltas = [];
    state.complete = false;
    els.win.hidden = true;
    setTip(t('tip0'));
    render();
    window.cool?.stage(`route_${state.level + 1}`);
  }

  $$('.move').forEach((button) => button.addEventListener('click', () => move(Number(button.dataset.delta))));
  $('#hintBtn').addEventListener('click', showHint);
  $('#resetBtn').addEventListener('click', () => {
    const start = mission().start;
    startMission();
    setTip(t('resetTip')(start));
    window.cool?.track('restart_route');
  });
  els.undo.addEventListener('click', () => {
    if (state.path.length <= 1 || state.complete) return;
    state.path.pop();
    state.deltas.pop();
    tone(260);
    setTip(t('undoTip')(current()));
    render();
    window.cool?.track('undo_stop');
  });
  els.next.addEventListener('click', () => startMission((state.level + 1) % MISSIONS.length));
  els.lang.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    store.set(LS.lang, lang);
    setTip(t('tip0'));
    render();
  });
  els.theme.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    store.set(LS.theme, theme);
    dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    render();
  });
  els.sound.addEventListener('click', () => {
    state.muted = !state.muted;
    render();
    if (!state.muted) tone(640);
  });

  addEventListener('keydown', (event) => {
    if (els.win.hidden === false) return;
    const deltas = { ArrowUp: -10, ArrowDown: 10, ArrowLeft: -1, ArrowRight: 1 };
    if (deltas[event.key]) {
      event.preventDefault();
      move(deltas[event.key]);
    }
  });

  document.documentElement.dataset.theme = theme;
  startMission();
})();
