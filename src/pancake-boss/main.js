(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '煎饼老板 · KidsLab',
      back: '返回平台',
      title: '煎饼老板',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      missionsLabel: '订单',
      scheduleLabel: '铁板时间表',
      tokenTrayLabel: '待排饼面',
      order: '订单',
      totalTime: '总用时',
      minutes: '分钟',
      prepDesk: '备餐台',
      chooseSide: '先选饼面，再放进铁板',
      sideHint: '同一张饼的正反面不能在同一轮煎。',
      check: '检查排班',
      next: '下一单',
      undo: '撤回',
      clear: '清空',
      hint: '提示',
      ruleTitle: '铁板规则',
      ruleText: '一轮 3 分钟，同时最多煎 2 个面。',
      soyTitle: '豆浆机 · 需要 6 分钟',
      soyText: '让它和煎饼同时开工，就不用多等 6 分钟。',
      startSoy: '启动豆浆机',
      soyRunning: '豆浆制作中',
      clockQuestion: '7:52 开始，9 分钟后是几点？',
      finalKicker: '早餐赶上了 8:15 的公交',
      finalTitle: '早高峰统筹大师！',
      finalText: '三张饼最快 9 分钟。豆浆同时做，7:52 开始，8:01 全部出餐！',
      playAgain: '再开一摊',
      mission1Kicker: '开摊热身',
      mission1Title: '两张饼，铁板别空着',
      mission1Text: '每张饼两面各煎 3 分钟。把 4 个饼面排进 2 轮。',
      mission2Kicker: '早高峰挑战',
      mission2Title: '三张饼，9 分钟出餐',
      mission2Text: '6 个饼面、2 个铁板位。排满 3 轮就是最快方案。',
      mission3Kicker: '公交倒计时',
      mission3Title: '煎饼豆浆一起做',
      mission3Text: '排好 9 分钟铁板，启动豆浆机，再算出餐时刻。',
      missionLabel: (n, title) => `第 ${n} 单：${title}`,
      lockedMission: '先完成前一单',
      ready1: '先点一个饼面，再点铁板空位。',
      ready2: '三张饼要轮换：每一轮都别让铁板空着。',
      ready3: '排铁板、开豆浆机、选时间，三件事都要完成。',
      sideLabel: (pancake, side) => `${pancake} 号饼 · ${side}面`,
      sideShort: (pancake, side) => `${pancake} · ${side}面`,
      cellLabel: (round, spot) => `第 ${round} 轮，第 ${spot} 个铁板位`,
      cellEmpty: '空位',
      roundLabel: (start, end) => `${start}–${end}分`,
      selected: (label) => `拿起 ${label}，现在点一个铁板空位。`,
      placed: (label) => `${label} 放好了，继续排。`,
      replaced: (label) => `这个位置换成了 ${label}。`,
      empty: '铁板还是空的，先把所有饼面排进去。',
      incomplete: (count) => `还有 ${count} 个饼面没排，铁板不能空等。`,
      sameRound: (pancake) => `${pancake} 号饼的两面不能同时煎，换一面到别的轮次。`,
      done1: '两张饼 6 分钟完成，铁板每分钟都没浪费！',
      done2: '神操作！6 个面刚好占满 3 轮，三张饼最快 9 分钟。',
      needSoy: '铁板排好了，再启动豆浆机让两项任务并行。',
      needClock: '最后算时间：7:52 再过 9 分钟，跨过 8 点。',
      wrongClock: '不是这个时刻。7:52 到 8:00 是 8 分钟，再走 1 分钟。',
      done3: '8:01 全部出餐，比 8:15 的公交早 14 分钟！',
      cleared: '排班清空了，重新安排吧。',
      undone: '撤回最后一个饼面。',
      cannotUndo: '还没有可以撤回的饼面。',
      hint1: '第一轮放 A正、B正；第二轮放 A反、B反。',
      hint2: '试试：A正+B正，A反+C正，B反+C反。',
      hint3: '沿用三轮排法，豆浆机一开始就开；7:52 + 8 分钟到 8:00。',
      soyStarted: '豆浆机开工！它会在煎饼完成前做好。',
      missionCompleted: '这一单已经完成，可以再排一次。',
    },
    en: {
      doc: 'Pancake Boss · KidsLab',
      back: 'Back to platform',
      title: 'Pancake Boss',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      missionsLabel: 'Orders',
      scheduleLabel: 'Griddle schedule',
      tokenTrayLabel: 'Pancake sides to schedule',
      order: 'ORDER',
      totalTime: 'Total',
      minutes: 'min',
      prepDesk: 'PREP COUNTER',
      chooseSide: 'Pick a side, then choose a griddle slot',
      sideHint: 'Both sides of one pancake cannot cook in the same round.',
      check: 'Check schedule',
      next: 'Next order',
      undo: 'Undo',
      clear: 'Clear',
      hint: 'Hint',
      ruleTitle: 'Griddle rule',
      ruleText: 'Each round is 3 minutes, with room for 2 sides.',
      soyTitle: 'Soy maker · takes 6 minutes',
      soyText: 'Run it with the pancakes so it adds no waiting time.',
      startSoy: 'Start soy maker',
      soyRunning: 'Soy maker running',
      clockQuestion: 'Start at 7:52. What time is it 9 minutes later?',
      finalKicker: 'BREAKFAST CAUGHT THE 8:15 BUS',
      finalTitle: 'Breakfast Rush Master!',
      finalText: 'Three pancakes take 9 minutes at best. Make soy milk in parallel and everything is ready at 8:01!',
      playAgain: 'Open again',
      mission1Kicker: 'OPENING WARM-UP',
      mission1Title: 'Keep Both Griddle Spots Busy',
      mission1Text: 'Each side takes 3 minutes. Schedule 4 sides across 2 rounds.',
      mission2Kicker: 'BREAKFAST RUSH',
      mission2Title: 'Three Pancakes in 9 Minutes',
      mission2Text: 'Six sides, two spots. Fill three rounds for the fastest plan.',
      mission3Kicker: 'BUS COUNTDOWN',
      mission3Title: 'Pancakes and Soy Together',
      mission3Text: 'Build the 9-minute plan, start soy milk, then find serving time.',
      missionLabel: (n, title) => `Order ${n}: ${title}`,
      lockedMission: 'Finish the previous order first',
      ready1: 'Pick a pancake side, then tap an empty griddle spot.',
      ready2: 'Rotate three pancakes and keep both spots busy every round.',
      ready3: 'Schedule, start the soy maker, and choose the time.',
      sideLabel: (pancake, side) => `Pancake ${pancake} · side ${side}`,
      sideShort: (pancake, side) => `${pancake} · side ${side}`,
      cellLabel: (round, spot) => `Round ${round}, griddle spot ${spot}`,
      cellEmpty: 'Empty',
      roundLabel: (start, end) => `${start}–${end} min`,
      selected: (label) => `${label} picked up. Choose a griddle spot.`,
      placed: (label) => `${label} is on the griddle. Keep scheduling.`,
      replaced: (label) => `That spot now holds ${label}.`,
      empty: 'The griddle is empty. Schedule every side first.',
      incomplete: (count) => `${count} sides are still waiting. Do not leave griddle time empty.`,
      sameRound: (pancake) => `Both sides of pancake ${pancake} cannot cook together. Move one to another round.`,
      done1: 'Two pancakes in 6 minutes, with no griddle time wasted!',
      done2: 'Smart swap! Six sides fill three rounds, so 9 minutes is fastest.',
      needSoy: 'The griddle is ready. Start the soy maker to run both jobs together.',
      needClock: 'Now calculate: 9 minutes after 7:52 crosses 8 o’clock.',
      wrongClock: 'Not quite. It is 8 minutes from 7:52 to 8:00, then 1 more minute.',
      done3: 'Everything is ready at 8:01, 14 minutes before the 8:15 bus!',
      cleared: 'Schedule cleared. Build a fresh plan.',
      undone: 'Last pancake side removed.',
      cannotUndo: 'There is no pancake side to undo yet.',
      hint1: 'Round 1: A1 + B1. Round 2: A2 + B2.',
      hint2: 'Try A1+B1, then A2+C1, then B2+C2.',
      hint3: 'Use the three-round plan and start soy immediately. Eight minutes after 7:52 is 8:00.',
      soyStarted: 'Soy maker started! It will finish before the pancakes.',
      missionCompleted: 'This order is complete. You can schedule it again.',
    },
  };

  const MISSIONS = [
    { pancakes: ['A', 'B'], rounds: 2, kicker: 'mission1Kicker', title: 'mission1Title', text: 'mission1Text', ready: 'ready1' },
    { pancakes: ['A', 'B', 'C'], rounds: 3, kicker: 'mission2Kicker', title: 'mission2Title', text: 'mission2Text', ready: 'ready2' },
    { pancakes: ['A', 'B', 'C'], rounds: 3, kicker: 'mission3Kicker', title: 'mission3Title', text: 'mission3Text', ready: 'ready3' },
  ];
  const SAVE_KEY = 'kidslab.pancake-boss';
  const SOUND_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    nav: $('#missionNav'),
    status: $('#status'),
    totalTime: $('#totalTime'),
    ruler: $('#timeRuler'),
    schedule: $('#schedule'),
    tray: $('#tokenTray'),
    parallel: $('#parallelPanel'),
    soyMachine: $('#soyMachine'),
    soy: $('#soyBtn'),
    clock: $('#clockPanel'),
    check: $('#checkBtn'),
    next: $('#nextBtn'),
    undo: $('#undoBtn'),
    clear: $('#clearBtn'),
    hint: $('#hintBtn'),
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
  let schedules = [Array(4).fill(null), Array(6).fill(null), Array(6).fill(null)];
  let selectedToken = null;
  let history = [];
  let soyRunning = false;
  let statusMessage = { key: 'ready1', args: [], tone: '' };

  function text(key, ...args) {
    return t(key, ...args);
  }

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(2, Math.max(0, Number(saved.unlocked) || 0));
    completed = new Set(Array.isArray(saved.completed) ? saved.completed.filter((value) => value >= 0 && value <= 2) : []);
  } catch {
    unlocked = 0;
    completed = new Set();
  }

  class SoundEngine {
    constructor() {
      try { this.muted = localStorage.getItem(SOUND_KEY) === 'true'; } catch { this.muted = false; }
      this.context = null;
    }

    setMuted(value) {
      this.muted = value;
      try { localStorage.setItem(SOUND_KEY, String(value)); } catch {}
      if (value && this.context) this.context.suspend().catch(() => {});
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

    tone(frequency, duration, type = 'sine', volume = 0.05, delay = 0) {
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
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    }

    play(kind) {
      if (kind === 'pick') this.tone(420, 0.07, 'triangle', 0.035);
      if (kind === 'place') { this.tone(240, 0.08, 'sine', 0.045); this.tone(360, 0.09, 'sine', 0.035, 0.045); }
      if (kind === 'error') { this.tone(165, 0.15, 'sawtooth', 0.03); this.tone(125, 0.18, 'sawtooth', 0.025, 0.1); }
      if (kind === 'success') [440, 554, 659].forEach((note, index) => this.tone(note, 0.13, 'triangle', 0.045, index * 0.08));
      if (kind === 'complete') [392, 494, 587, 784].forEach((note, index) => this.tone(note, 0.2, 'triangle', 0.05, index * 0.1));
      if (kind === 'machine') { this.tone(110, 0.12, 'square', 0.025); this.tone(220, 0.1, 'triangle', 0.025, 0.08); }
    }
  }
  const sound = new SoundEngine();

  function tokensForMission(index) {
    return MISSIONS[index].pancakes.flatMap((pancake) => [`${pancake}1`, `${pancake}2`]);
  }

  function tokenParts(token) {
    return { pancake: token[0], side: token[1] };
  }

  function say(key, args = [], tone = '') {
    statusMessage = { key, args, tone };
    renderStatus();
  }

  function renderStatus() {
    el.status.textContent = text(statusMessage.key, ...statusMessage.args);
    el.status.className = `status${statusMessage.tone ? ` ${statusMessage.tone}` : ''}`;
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked, completed: [...completed] }));
    } catch {}
  }

  function renderNav() {
    el.nav.replaceChildren();
    MISSIONS.forEach((mission, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `mission-btn${index === missionIndex ? ' current' : ''}${completed.has(index) ? ' done' : ''}`;
      button.textContent = String(index + 1);
      button.disabled = index > unlocked;
      button.setAttribute('aria-label', index > unlocked
        ? `${text('missionLabel', index + 1, t(mission.title))} · ${t('lockedMission')}`
        : text('missionLabel', index + 1, t(mission.title)));
      button.addEventListener('click', () => switchMission(index));
      el.nav.append(button);
    });
  }

  function renderSchedule() {
    const mission = MISSIONS[missionIndex];
    const schedule = schedules[missionIndex];
    el.ruler.replaceChildren();
    el.schedule.replaceChildren();
    for (let round = 0; round < mission.rounds; round += 1) {
      const label = document.createElement('div');
      label.className = 'time-label';
      label.textContent = text('roundLabel', round * 3, (round + 1) * 3);
      el.ruler.append(label);

      const row = document.createElement('div');
      row.className = 'schedule-row';
      for (let spot = 0; spot < 2; spot += 1) {
        const index = round * 2 + spot;
        const token = schedule[index];
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `griddle-cell${token ? ' filled' : ''}${selectedToken && !token ? ' ready' : ''}`;
        button.dataset.cell = String(index);
        if (token) {
          const { pancake, side } = tokenParts(token);
          button.textContent = text('sideShort', pancake, side);
        } else {
          button.textContent = t('cellEmpty');
        }
        button.setAttribute('aria-label', `${text('cellLabel', round + 1, spot + 1)}${token ? `: ${text('sideLabel', token[0], token[1])}` : `: ${t('cellEmpty')}`}`);
        button.addEventListener('click', () => placeToken(index));
        row.append(button);
      }
      el.schedule.append(row);
    }
    el.totalTime.textContent = schedule.some(Boolean) ? String(mission.rounds * 3) : '0';
  }

  function renderTray() {
    const used = new Set(schedules[missionIndex].filter(Boolean));
    el.tray.replaceChildren();
    tokensForMission(missionIndex).forEach((token) => {
      const { pancake, side } = tokenParts(token);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `token${selectedToken === token ? ' selected' : ''}`;
      button.dataset.token = token;
      button.disabled = used.has(token);
      button.textContent = text('sideShort', pancake, side);
      button.setAttribute('aria-label', text('sideLabel', pancake, side));
      button.addEventListener('click', () => {
        selectedToken = selectedToken === token ? null : token;
        if (selectedToken) {
          sound.play('pick');
          say('selected', [text('sideLabel', pancake, side)]);
        }
        renderTray();
        renderSchedule();
      });
      el.tray.append(button);
    });
  }

  function renderMission() {
    const mission = MISSIONS[missionIndex];
    document.body.dataset.mission = String(missionIndex + 1);
    el.missionNumber.textContent = String(missionIndex + 1).padStart(2, '0');
    el.missionKicker.textContent = t(mission.kicker);
    el.missionTitle.textContent = t(mission.title);
    el.missionText.textContent = t(mission.text);
    el.parallel.hidden = missionIndex !== 2;
    el.clock.hidden = missionIndex !== 2;
    el.soy.textContent = soyRunning ? t('soyRunning') : t('startSoy');
    el.soy.setAttribute('aria-pressed', String(soyRunning));
    el.soyMachine.classList.toggle('running', soyRunning);
    el.next.hidden = !completed.has(missionIndex) || missionIndex === 2;
    el.check.hidden = completed.has(missionIndex) && missionIndex < 2;
    renderNav();
    renderTray();
    renderSchedule();
    renderStatus();
  }

  function placeToken(index) {
    const schedule = schedules[missionIndex];
    if (!selectedToken) {
      if (schedule[index]) {
        const removed = schedule[index];
        history.push({ index, previous: removed, token: null });
        schedule[index] = null;
        selectedToken = removed;
        sound.play('pick');
        say('selected', [text('sideLabel', removed[0], removed[1])]);
        renderTray();
        renderSchedule();
      }
      return;
    }
    const previous = schedule[index];
    const token = selectedToken;
    const existingIndex = schedule.indexOf(token);
    if (existingIndex >= 0) schedule[existingIndex] = null;
    schedule[index] = token;
    history.push({ index, previous, token, existingIndex });
    selectedToken = previous || null;
    sound.play('place');
    say(previous ? 'replaced' : 'placed', [text('sideLabel', token[0], token[1])]);
    window.cool?.track?.('schedule_side', { mission: missionIndex + 1, token });
    renderTray();
    renderSchedule();
  }

  function validateSchedule() {
    const schedule = schedules[missionIndex];
    const expected = tokensForMission(missionIndex);
    const filled = schedule.filter(Boolean);
    if (!filled.length) return { key: 'empty', tone: 'bad' };
    if (filled.length < expected.length) return { key: 'incomplete', args: [expected.length - filled.length], tone: 'bad' };
    for (let round = 0; round < MISSIONS[missionIndex].rounds; round += 1) {
      const pair = schedule.slice(round * 2, round * 2 + 2);
      if (pair[0][0] === pair[1][0]) return { key: 'sameRound', args: [pair[0][0]], tone: 'bad', round };
    }
    return { ok: true };
  }

  function checkMission() {
    const result = validateSchedule();
    el.schedule.querySelectorAll('.bad').forEach((cell) => cell.classList.remove('bad'));
    if (!result.ok) {
      sound.play('error');
      say(result.key, result.args || [], result.tone);
      if (Number.isInteger(result.round)) {
        [...el.schedule.querySelectorAll('.schedule-row')][result.round]
          ?.querySelectorAll('.griddle-cell')
          .forEach((cell) => cell.classList.add('bad'));
      }
      return;
    }

    if (missionIndex === 2) {
      if (!soyRunning) {
        sound.play('error');
        say('needSoy', [], 'bad');
        el.soy.focus();
        return;
      }
      const finishTime = document.querySelector('input[name="finish-time"]:checked')?.value;
      if (!finishTime) {
        sound.play('error');
        say('needClock', [], 'bad');
        return;
      }
      if (finishTime !== '8:01') {
        sound.play('error');
        say('wrongClock', [], 'bad');
        return;
      }
    }

    completed.add(missionIndex);
    unlocked = Math.max(unlocked, Math.min(2, missionIndex + 1));
    save();
    window.cool?.stage?.(`order${missionIndex + 1}`);
    window.cool?.track?.('complete_order', { mission: missionIndex + 1, minutes: MISSIONS[missionIndex].rounds * 3 });
    if (missionIndex === 2) {
      sound.play('complete');
      say('done3', [], 'good');
      window.cool?.complete?.();
      el.modal.hidden = false;
      requestAnimationFrame(() => el.playAgain.focus());
    } else {
      sound.play('success');
      say(missionIndex === 0 ? 'done1' : 'done2', [], 'good');
    }
    renderNav();
    el.next.hidden = missionIndex === 2;
    el.check.hidden = missionIndex < 2;
  }

  function switchMission(index) {
    if (index > unlocked) return;
    missionIndex = index;
    selectedToken = null;
    history = [];
    statusMessage = {
      key: completed.has(index) ? 'missionCompleted' : MISSIONS[index].ready,
      args: [],
      tone: completed.has(index) ? 'good' : '',
    };
    renderMission();
  }

  function clearSchedule() {
    schedules[missionIndex] = Array(MISSIONS[missionIndex].rounds * 2).fill(null);
    selectedToken = null;
    history = [];
    sound.play('pick');
    say('cleared');
    renderTray();
    renderSchedule();
  }

  el.check.addEventListener('click', checkMission);
  el.next.addEventListener('click', () => switchMission(Math.min(2, missionIndex + 1)));
  el.clear.addEventListener('click', clearSchedule);
  el.undo.addEventListener('click', () => {
    const last = history.pop();
    if (!last) {
      sound.play('error');
      say('cannotUndo', [], 'bad');
      return;
    }
    const schedule = schedules[missionIndex];
    schedule[last.index] = last.previous || null;
    if (last.existingIndex >= 0) schedule[last.existingIndex] = last.token;
    selectedToken = null;
    sound.play('pick');
    say('undone');
    renderTray();
    renderSchedule();
  });
  el.hint.addEventListener('click', () => {
    sound.play('pick');
    say(`hint${missionIndex + 1}`);
    window.cool?.track?.('request_hint', { mission: missionIndex + 1 });
  });
  el.soy.addEventListener('click', () => {
    soyRunning = !soyRunning;
    sound.play('machine');
    say(soyRunning ? 'soyStarted' : 'ready3');
    renderMission();
  });
  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    if (!sound.muted) sound.play('pick');
    renderChrome();
  });
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.playAgain.addEventListener('click', () => {
    el.modal.hidden = true;
    missionIndex = 0;
    unlocked = 0;
    completed = new Set();
    schedules = [Array(4).fill(null), Array(6).fill(null), Array(6).fill(null)];
    selectedToken = null;
    history = [];
    soyRunning = false;
    document.querySelectorAll('input[name="finish-time"]').forEach((input) => { input.checked = false; });
    save();
    say('ready1');
    renderMission();
  });

  function renderChrome(theme = document.documentElement.dataset.theme || 'light') {
    el.sound.textContent = sound.muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', String(sound.muted));
    el.sound.setAttribute('aria-label', t(sound.muted ? 'soundOn' : 'soundOff'));
    el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
    el.theme.setAttribute('aria-label', t('themeLabel'));
    el.lang.textContent = language === 'zh' ? 'EN' : '中';
    el.nav.setAttribute('aria-label', t('missionsLabel'));
    el.schedule.setAttribute('aria-label', t('scheduleLabel'));
    el.tray.setAttribute('aria-label', t('tokenTrayLabel'));
  }

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang, theme }) {
      t = translate;
      language = lang;
      document.title = t('doc');
      renderChrome(theme);
      renderMission();
    },
  });
})();
