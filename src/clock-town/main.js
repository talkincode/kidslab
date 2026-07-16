(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '🕰️ 时钟小镇 · KidsLab',
      back: '返回平台',
      title: '时钟小镇',
      order: '居民订单',
      round: '订单',
      townSign: '滴答小镇',
      bakery: '面包房',
      school: '学校',
      home: '小屋',
      target: '把钟拨到',
      now: '钟楼现在',
      minutes: '分钟',
      tip0: '拖动长长的分针。它走一圈，短短的时针会走一格！',
      hint: '给点提示',
      check: '敲钟报时',
      reset: '重新拨',
      fastDay: '让小镇快过一天',
      drag: '抓住指针转一转',
      next: '下一张订单 →',
      spinning: '小镇的一天正在飞快转动……看太阳和月亮换班！',
      dayDone: '一天转完啦！分针走两圈，就是 24 小时。',
      exact: '正好！钟楼“当”地响起来，全镇都准时了。',
      close: (direction) => `就差一点！把分针再往${direction}挪一小格。`,
      wrongHour: (direction) => `分钟对啦！短短的时针还要往${direction}走。`,
      far: '时间还没到。先看短针是几点，再看长针是多少分。',
      resetTip: '回到订单开始前。慢慢拨，指针不会跑掉。',
      hints: {
        hour: (hour) => `先找短针：它应该靠近 ${hour}。`,
        minute: (mark, minute) => `再看长针：指向 ${mark}，就是 ${minute} 分。`,
        exact: '两根针都到位啦，现在敲钟报时！',
      },
      clueHour: (hour) => `短针刚过 ${hour}，先读“${hour} 点”。`,
      clueMinute: (mark, minute) => `分针指向 ${mark}，就是 ${minute} 分。`,
      period: { dawn: '清晨', day: '白天', noon: '中午', evening: '傍晚', night: '夜晚' },
      periods: { morning: '早上', noon: '中午', afternoon: '下午', evening: '晚上', night: '晚上' },
      mission: (period, time, action) => `${period} ${time}，${action}！`,
      winRuleHour: (hour) => `长针指向 12，短针指向 ${hour}，就是整点。`,
      winRuleHalf: (hour) => `长针指向 6，是 30 分；短针已经走过 ${hour} 一半。`,
      winRuleMinute: (hour, mark, minute) => `短针刚过 ${hour}，长针指向 ${mark}，就是 ${minute} 分。`,
      finalTitle: '全镇都准时！',
      finalText: '你会读整时、半时和几时几分，还发现了两根指针会一起走。',
      orders: [
        { action: '叫醒面包房', activity: '面包出炉', win: '准时开门！' },
        { action: '让校车出发', activity: '校车发车', win: '校车出发！' },
        { action: '让猫咪午睡', activity: '猫咪午睡', win: '午睡时间到！' },
        { action: '提醒小米去钓鱼', activity: '池塘开钓', win: '鱼竿甩起来！' },
        { action: '点亮晚餐小屋', activity: '全家吃晚餐', win: '热腾腾开饭！' },
        { action: '关灯说晚安', activity: '小镇入睡', win: '晚安，小镇！' },
      ],
    },
    en: {
      doc: '🕰️ Clock Town · KidsLab',
      back: 'Back',
      title: 'Clock Town',
      order: 'Town order',
      round: 'Order',
      townSign: 'Tick-Tock Town',
      bakery: 'Bakery',
      school: 'School',
      home: 'Home',
      target: 'Set the clock to',
      now: 'Clock tower now',
      minutes: 'min',
      tip0: 'Drag the long minute hand. One full turn moves the short hour hand to the next hour!',
      hint: 'Give a hint',
      check: 'Ring the bell',
      reset: 'Reset time',
      fastDay: 'Fast-forward one day',
      drag: 'Grab a hand and turn',
      next: 'Next order →',
      spinning: 'The town is racing through a whole day. Watch the sun and moon swap shifts!',
      dayDone: 'A whole day! Two trips around the dial make 24 hours.',
      exact: 'Exactly right! The bell rings and everyone is on time.',
      close: (direction) => `So close! Move the minute hand one small step ${direction}.`,
      wrongHour: (direction) => `Minutes are right! Move the short hour hand ${direction}.`,
      far: 'Not yet. Read the short hour hand first, then the long minute hand.',
      resetTip: 'Back to the starting time. Turn slowly — the hands will stay together.',
      hints: {
        hour: (hour) => `Find the short hand first. It should be near ${hour}.`,
        minute: (mark, minute) => `Now the long hand: point it at ${mark} for ${minute} minutes.`,
        exact: 'Both hands are ready. Ring the bell!',
      },
      clueHour: (hour) => `The short hand just passed ${hour}, so read “${hour} o'clock” first.`,
      clueMinute: (mark, minute) => `The minute hand points to ${mark}, which means ${minute} minutes.`,
      period: { dawn: 'Dawn', day: 'Daytime', noon: 'Noon', evening: 'Evening', night: 'Night' },
      periods: { morning: 'AM', noon: 'PM', afternoon: 'PM', evening: 'PM', night: 'PM' },
      mission: (period, time, action) => `${period} ${time}: ${action}!`,
      winRuleHour: (hour) => `Long hand at 12 and short hand at ${hour} means an exact hour.`,
      winRuleHalf: (hour) => `Long hand at 6 means 30 minutes; the short hand is halfway past ${hour}.`,
      winRuleMinute: (hour, mark, minute) => `Short hand just past ${hour}, long hand at ${mark}: ${minute} minutes.`,
      finalTitle: 'The whole town is on time!',
      finalText: 'You can read hours, half-hours, and minutes — and you saw both clock hands move together.',
      orders: [
        { action: 'wake the bakery', activity: 'Bread comes out', win: 'Open right on time!' },
        { action: 'send the school bus', activity: 'Bus departure', win: 'The bus is rolling!' },
        { action: 'start the cat nap', activity: 'Cat nap', win: 'Perfect nap time!' },
        { action: 'send Mia fishing', activity: 'Fishing time', win: 'Cast the line!' },
        { action: 'light the dinner house', activity: 'Family dinner', win: 'Dinner is served!' },
        { action: 'turn out the lights', activity: 'Town bedtime', win: 'Good night, town!' },
      ],
    },
  };

  const ORDERS = [
    { target: 420, start: 380, period: 'morning', scene: 'dawn', face: '👩‍🍳', emoji: '🥐✨', activity: 'bakery' },
    { target: 480, start: 445, period: 'morning', scene: 'day', face: '🧒', emoji: '🚌💨', activity: 'school' },
    { target: 750, start: 700, period: 'noon', scene: 'noon', face: '🐈', emoji: '🐈💤', activity: 'nap' },
    { target: 915, start: 875, period: 'afternoon', scene: 'day', face: '🧒', emoji: '🎣🐟', activity: 'fishing' },
    { target: 1125, start: 1090, period: 'evening', scene: 'evening', face: '👨‍👩‍👧', emoji: '🍲✨', activity: 'dinner' },
    { target: 1260, start: 1215, period: 'night', scene: 'night', face: '👵', emoji: '🌙💤', activity: 'bedtime' },
  ];

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const store = {
    get: (key) => { try { return localStorage.getItem(key); } catch { return null; } },
    set: (key, value) => { try { localStorage.setItem(key, value); } catch {} },
  };

  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (!['light', 'dark'].includes(theme)) theme = 'light';

  const state = {
    level: 0,
    time: ORDERS[0].start,
    stars: 3,
    hintStep: 0,
    muted: false,
    dragging: null,
    previousStep: 0,
    spinning: false,
    idleTimer: 0,
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  const order = () => ORDERS[state.level];
  const copy = () => t('orders')[state.level];
  const wrapDay = (value) => ((value % 1440) + 1440) % 1440;
  const dialMinutes = (value) => wrapDay(value) % 720;
  const hour12 = (value) => {
    const hour = Math.floor(wrapDay(value) / 60) % 12;
    return hour || 12;
  };
  const minute = (value) => wrapDay(value) % 60;

  const els = {
    town: $('#town'),
    period: $('#periodText'),
    resident: $('#residentFace'),
    mission: $('#missionText'),
    level: $('#levelText'),
    stars: $('#stars'),
    target: $('#targetText'),
    activity: $('#activityText'),
    time: $('#timeText'),
    clue: $('#handClue'),
    tip: $('#tip'),
    hourHand: $('#hourHand'),
    minuteHand: $('#minuteHand'),
    svg: $('#clockSvg'),
    win: $('#win'),
    winClock: $('#winClock'),
    winEmoji: $('#winEmoji'),
    winTitle: $('#winTitle'),
    winText: $('#winText'),
    next: $('#nextBtn'),
    day: $('#dayBtn'),
    celebrate: $('#celebrate'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
  };

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
      gain.gain.setValueAtTime(0.09, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.03);
    } catch {}
  }
  const bell = () => [523, 659, 784, 1047].forEach((frequency, index) => tone(frequency, 0.18, index * 0.08));
  const buzz = () => [220, 180].forEach((frequency, index) => tone(frequency, 0.12, index * 0.07));

  function timeLabel(value, includePeriod = true) {
    const normalized = wrapDay(value);
    const hours = hour12(normalized);
    const mins = String(minute(normalized)).padStart(2, '0');
    if (!includePeriod) return `${hours}:${mins}`;
    const periodKey = normalized < 720 ? 'morning' : normalized < 780 ? 'noon' : normalized < 1080 ? 'afternoon' : normalized < 1200 ? 'evening' : 'night';
    return lang === 'zh'
      ? `${t('periods')[periodKey]} ${hours}:${mins}`
      : `${hours}:${mins} ${t('periods')[periodKey]}`;
  }

  function scenePeriod(value) {
    const normalized = wrapDay(value);
    if (normalized < 330 || normalized >= 1200) return 'night';
    if (normalized < 450) return 'dawn';
    if (normalized < 690) return 'day';
    if (normalized < 810) return 'noon';
    if (normalized < 1050) return 'day';
    if (normalized < 1200) return 'evening';
    return 'night';
  }

  function setTip(message, kind = '') {
    els.tip.textContent = message;
    els.tip.className = `tip${kind ? ` is-${kind}` : ''}`;
    resetIdleHint();
  }

  function buildTicks() {
    const namespace = 'http://www.w3.org/2000/svg';
    for (let index = 0; index < 60; index += 1) {
      const major = index % 5 === 0;
      const line = document.createElementNS(namespace, 'line');
      line.setAttribute('x1', '150');
      line.setAttribute('y1', major ? '30' : '36');
      line.setAttribute('x2', '150');
      line.setAttribute('y2', major ? '46' : '43');
      line.setAttribute('stroke-width', major ? '5' : '2');
      line.setAttribute('transform', `rotate(${index * 6} 150 150)`);
      $('#tickMarks').append(line);
    }
  }

  function handClue() {
    const currentMinute = minute(state.time);
    const mark = currentMinute === 0 ? 12 : currentMinute / 5;
    if (currentMinute === 0) return t('clueHour')(hour12(state.time));
    return t('clueMinute')(mark, currentMinute);
  }

  function render() {
    const current = order();
    const angleMinutes = minute(state.time) * 6;
    const angleHours = dialMinutes(state.time) * 0.5;
    const currentPeriod = scenePeriod(state.time);

    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.dataset.theme = theme;
    document.title = t('doc');
    $$('[data-t]').forEach((node) => {
      const value = I18N[lang][node.dataset.t];
      if (typeof value === 'string') node.textContent = value;
    });
    els.lang.textContent = lang === 'zh' ? 'EN' : '中';
    els.theme.textContent = theme === 'light' ? '🌙' : '☀️';
    els.sound.textContent = state.muted ? '🔇' : '🔊';
    els.resident.textContent = current.face;
    els.level.textContent = `${state.level + 1}/${ORDERS.length}`;
    els.stars.textContent = '★'.repeat(state.stars) + '☆'.repeat(3 - state.stars);
    els.mission.textContent = t('mission')(t('periods')[current.period], timeLabel(current.target, false), copy().action);
    els.target.textContent = timeLabel(current.target);
    els.activity.textContent = copy().activity;
    els.time.textContent = timeLabel(state.time);
    els.clue.textContent = handClue();
    els.period.textContent = t('period')[currentPeriod];
    els.town.dataset.period = currentPeriod;
    els.hourHand.setAttribute('transform', `rotate(${angleHours} 150 150)`);
    els.minuteHand.setAttribute('transform', `rotate(${angleMinutes} 150 150)`);
  }

  function setTime(value, feedback = true) {
    state.time = Math.round(wrapDay(value) / 5) * 5;
    if (state.time >= 1440) state.time = 0;
    els.town.removeAttribute('data-activity');
    els.town.classList.remove('is-chaos');
    if (feedback) tone(280 + minute(state.time) * 3, 0.035);
    render();
    resetIdleHint();
  }

  function resetLevel() {
    state.time = order().start;
    state.stars = 3;
    state.hintStep = 0;
    state.spinning = false;
    els.day.disabled = false;
    els.win.hidden = true;
    els.town.removeAttribute('data-activity');
    els.town.classList.remove('is-chaos');
    setTip(t('tip0'));
    render();
  }

  function difference() {
    return order().target - state.time;
  }

  function directionFor(delta) {
    if (lang === 'zh') return delta > 0 ? '前' : '后';
    return delta > 0 ? 'clockwise' : 'counterclockwise';
  }

  function checkTime() {
    if (state.spinning) return;
    const delta = difference();
    if (delta === 0) {
      bell();
      els.town.dataset.activity = order().activity;
      setTip(t('exact'), 'good');
      confetti();
      setTimeout(showWin, 780);
      window.cool?.stage(`clock-town-${state.level + 1}`);
      return;
    }

    state.stars = Math.max(1, state.stars - 1);
    els.town.classList.remove('is-chaos');
    requestAnimationFrame(() => els.town.classList.add('is-chaos'));
    setTimeout(() => els.town.classList.remove('is-chaos'), 900);
    buzz();
    const minuteRight = minute(state.time) === minute(order().target);
    if (Math.abs(delta) === 5) setTip(t('close')(directionFor(delta)), 'bad');
    else if (minuteRight) setTip(t('wrongHour')(directionFor(delta)), 'bad');
    else setTip(t('far'), 'bad');
    render();
    window.cool?.track('wrong-time');
  }

  function hint() {
    const current = order();
    const targetMinute = minute(current.target);
    const mark = targetMinute === 0 ? 12 : targetMinute / 5;
    const targetHour = hour12(current.target);
    const delta = difference();
    let message;
    if (delta === 0) message = t('hints').exact;
    else if (state.hintStep % 2 === 0) message = t('hints').hour(targetHour);
    else message = t('hints').minute(mark, targetMinute);
    state.hintStep += 1;
    setTip(message);
    tone(660, 0.1);
    window.cool?.track('clock-hint');
  }

  function successRule() {
    const target = order().target;
    const targetMinute = minute(target);
    const targetHour = hour12(target);
    const mark = targetMinute === 0 ? 12 : targetMinute / 5;
    if (targetMinute === 0) return t('winRuleHour')(targetHour);
    if (targetMinute === 30) return t('winRuleHalf')(targetHour);
    return t('winRuleMinute')(targetHour, mark, targetMinute);
  }

  function showWin() {
    const last = state.level === ORDERS.length - 1;
    els.winClock.textContent = timeLabel(order().target, false);
    els.winEmoji.textContent = last ? '🕰️🌟' : order().emoji;
    els.winTitle.textContent = last ? t('finalTitle') : copy().win;
    els.winText.textContent = last ? t('finalText') : successRule();
    els.next.textContent = last ? (lang === 'zh' ? '再过一天' : 'Play another day') : t('next');
    els.win.hidden = false;
  }

  function advance() {
    state.level = (state.level + 1) % ORDERS.length;
    resetLevel();
  }

  function confetti() {
    els.celebrate.textContent = '';
    const colors = ['#ffc94a', '#f2634c', '#2f9c95', '#4a78c2', '#fff4d8'];
    for (let index = 0; index < 42; index += 1) {
      const piece = document.createElement('i');
      piece.className = 'confetti';
      piece.style.left = `${(index * 37) % 100}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.setProperty('--drift', `${(index % 2 ? 1 : -1) * (20 + index % 50)}px`);
      piece.style.animationDelay = `${(index % 9) * 0.035}s`;
      els.celebrate.append(piece);
    }
    setTimeout(() => { els.celebrate.textContent = ''; }, 2200);
  }

  function pointerAngle(event) {
    const point = els.svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(els.svg.getScreenCTM().inverse());
    return (Math.atan2(local.y - 150, local.x - 150) * 180 / Math.PI + 90 + 360) % 360;
  }

  function startDrag(event, hand) {
    if (state.spinning) return;
    event.preventDefault();
    hand.setPointerCapture(event.pointerId);
    state.dragging = hand.dataset.hand;
    state.previousStep = Math.round(pointerAngle(event) / 30) % 12;
    hand.classList.add('is-dragging');
    window.cool?.track(`drag-${state.dragging}-hand`);
  }

  function moveDrag(event) {
    if (!state.dragging) return;
    event.preventDefault();
    if (state.dragging === 'minute') {
      const step = Math.round(pointerAngle(event) / 30) % 12;
      let delta = step - state.previousStep;
      if (delta > 6) delta -= 12;
      if (delta < -6) delta += 12;
      if (delta) {
        state.previousStep = step;
        setTime(state.time + delta * 5, false);
        if (Math.abs(delta) <= 3) tone(250 + step * 2, 0.025);
      }
      return;
    }

    const dial = Math.round((pointerAngle(event) * 2) / 5) * 5;
    const halfDay = state.time < 720 ? 0 : 720;
    setTime(halfDay + (dial === 720 ? 0 : dial), false);
  }

  function endDrag(event) {
    if (!state.dragging) return;
    const hand = state.dragging === 'minute' ? els.minuteHand : els.hourHand;
    try { hand.releasePointerCapture(event.pointerId); } catch {}
    hand.classList.remove('is-dragging');
    state.dragging = null;
    render();
  }

  function fastDay() {
    if (state.spinning) return;
    state.spinning = true;
    els.day.disabled = true;
    const start = state.time;
    let elapsed = 0;
    setTip(t('spinning'));
    window.cool?.track('fast-forward-day');
    const timer = setInterval(() => {
      elapsed += 20;
      setTime(start + elapsed, false);
      if (elapsed % 60 === 0) tone(320 + (elapsed % 240), 0.04);
      if (elapsed >= 1440) {
        clearInterval(timer);
        state.spinning = false;
        els.day.disabled = false;
        setTime(start, false);
        setTip(t('dayDone'), 'good');
        bell();
      }
    }, 24);
  }

  function resetIdleHint() {
    clearTimeout(state.idleTimer);
    state.idleTimer = setTimeout(() => {
      if (!els.win.hidden || state.spinning || state.dragging) return;
      const targetMinute = minute(order().target);
      const mark = targetMinute === 0 ? 12 : targetMinute / 5;
      setTip(t('hints').minute(mark, targetMinute));
    }, 30000);
  }

  [els.hourHand, els.minuteHand].forEach((hand) => {
    hand.addEventListener('pointerdown', (event) => startDrag(event, hand));
    hand.addEventListener('pointermove', moveDrag);
    hand.addEventListener('pointerup', endDrag);
    hand.addEventListener('pointercancel', endDrag);
  });
  $$('.stepper button').forEach((button) => button.addEventListener('click', () => setTime(state.time + Number(button.dataset.step))));
  $('#checkBtn').addEventListener('click', checkTime);
  $('#hintBtn').addEventListener('click', hint);
  $('#resetBtn').addEventListener('click', () => {
    setTime(order().start);
    state.stars = 3;
    state.hintStep = 0;
    setTip(t('resetTip'));
    render();
  });
  els.next.addEventListener('click', advance);
  els.day.addEventListener('click', fastDay);
  els.sound.addEventListener('click', () => { state.muted = !state.muted; render(); if (!state.muted) tone(520, 0.08); });
  els.lang.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    store.set(LS.lang, lang);
    render();
    setTip(t('tip0'));
  });
  els.theme.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set(LS.theme, theme);
    render();
  });
  addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') setTime(state.time + 5);
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') setTime(state.time - 5);
    if (event.key === 'Enter') checkTime();
  });

  buildTicks();
  resetLevel();
})();
