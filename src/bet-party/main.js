(() => {
  'use strict';

  const SAVE_KEY = 'kidslab.bet-party';
  const SOUND_KEY = 'kidslab.sound.muted';
  const DEBUG_KEY = 'kidslab.bet-party.debug';

  const GUEST_EMOJI = ['🧒', '👧', '👦', '🧑', '👩', '👨', '🧓', '👶', '🧔', '👸', '🤴', '🦸', '🧑‍🎤'];
  const SOCK_EMOJI = ['🔴', '🔵', '🟢'];
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const I18N = {
    zh: {
      doc: '打赌派对 · KidsLab',
      back: '返回平台',
      title: '打赌派对',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      meterDrawers: '抽屉',
      meterPigeons: '鸽子',
      meterSure: '稳赢线',
      formulaLabel: '开赌口诀',
      fieldDrawers: '几个抽屉？',
      fieldNeed: '保证几个一样？',
      fieldPigeons: '要几只鸽子才稳？',
      openBet: '说出稳赢数 · 开赌',
      invite: '请来下一位',
      hint: '轻提示',
      resetJob: '重开本局',
      next: '下一场赌局',
      finalKicker: '派对名人堂 · 必然赌神',
      finalTitle: '数学的「必然」比运气硬！',
      finalText: '最坏情况排到尽头，多出的那一只鸽子无处可放——这就是抽屉原理。',
      playAgain: '再办一场派对',
      missionsLabel: '赌局进度',
      drawersLabel: '抽屉区',
      moodSmug: '稳赢脸',
      moodWow: '哇！必然！',
      moodSad: '你差点赢…',
      moodCheer: '你才是赌神',
      deskPlay: '安排座位 · 看清必然',
      deskBet: '说出抽屉与鸽子 · 开赌',
      deskDone: '本场已揭晓',
      pendingSeat: '下一位客人等你点一个抽屉',
      pendingSock: '下一只袜子等你丢进颜色抽屉',
      pendingLetter: '下一位嘉宾等你选首字母',
      needPending: '先点「请来下一位」，再点抽屉。',
      placed: (label, n) => `放进「${label}」。这个抽屉现在有 ${n} 只。`,
      collide: (label, n) => `撞上了！「${label}」已经有 ${n} 只——最坏情况也挡不住必然。`,
      fullSpread: (n) => `漂亮：${n} 个抽屉各 1 只，暂时没人成对。再来一位呢？`,
      inviteReady: '客人到门口了。点一个还空着的抽屉试试。',
      inviteBlocked: '本场已经揭晓，点「下一场赌局」继续。',
      wrongBet: (need, right) => `还不够稳！要保证至少 ${need} 个一样，稳赢数是 ${right}。再算一次。`,
      rightBet: (d, need, p) => `赌对了！${d} 个抽屉，保证 ≥${need}，稳赢线 = ${d}×${need - 1}+1 = ${p}。`,
      demoStart: '看最坏情况表演：先尽量每个抽屉少放，直到多一只被迫撞车。',
      demoDone: '看！最坏情况排满后，再多一只一定会挤进某个抽屉。',
      lockedMission: '先完成前面的赌局',
      allDone: '四场赌局全部揭晓。你已经摸到“必然”的墙！',
      monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      sockNames: ['红袜', '蓝袜', '绿袜'],
      m0Kicker: '挑战魔法师 · 生日月份',
      m0Title: '排开 13 位客人，想办法不让两人同月？',
      m0Text: '点「请来下一位」，再点月份抽屉。尽量每人不同月——魔法师赌第 13 位必撞车。',
      m0Rule: '一年 12 个月 = 12 个抽屉。最坏情况：12 人各占一月；第 13 人无处可藏。',
      m0Lesson: '抽屉原理：n 个抽屉放 n+1 只鸽子，至少有一格 ≥2。',
      m0Ready: '派对开始！先请来第一位客人，塞进一个月份。',
      m0Hint: '先把 12 个月都放满 1 人，再请第 13 位——无论点哪个抽屉都会成对。',
      m0Formula: '抽屉 12 · 目标成对 · 稳赢线 13',
      m0Win: '魔法时刻：你挖空心思排的最坏情况，还是挡不住第 13 位。必然比运气硬！',
      m1Kicker: '你来当魔法师 · 袜子抽屉',
      m1Title: '暗抽屉里有 3 种颜色袜子，摸几只保证一双同色？',
      m1Text: '先说出：几个抽屉、保证几个一样、要几只鸽子。开赌后看最坏情况表演。',
      m1Rule: '3 种颜色。最坏：先各摸 1 只仍无对；再摸 1 只必定成对。',
      m1Lesson: '稳赢数 = 抽屉 × (需要个数 − 1) + 1。这里 3×1+1=4。',
      m1Ready: '接过魔法棒：填好三个数，点「开赌」。正确答案是 4。',
      m1Hint: '抽屉=3，保证≥2。最坏先 3 只各一色，第 4 只必然配对 → 3×1+1=4。',
      m1Formula: '抽屉 ? · 保证成对 · 稳赢线 ?',
      m2Kicker: '升级赌注 · 三人同月',
      m2Title: '要保证至少 3 人同一个生日月，最少需要几人？',
      m2Text: '还是 12 个月份抽屉。先写出抽屉数、保证个数、稳赢鸽子数。',
      m2Rule: '每个月先放 2 人仍可“没有三人同月”；再多 1 人，必有某月 ≥3。',
      m2Lesson: '推广式：n 个抽屉保证至少 k 个一样，需要 n(k−1)+1。12×2+1=25。',
      m2Ready: '抽屉 12，保证 ≥3。算出稳赢线再开赌。',
      m2Hint: '最坏：12 个月各 2 人=24，无人达 3；第 25 人必让某月变成 3。',
      m2Formula: '抽屉 12 · 保证 ≥3 · 稳赢线 ?',
      m3Kicker: '终场巡演 · 同名首字母',
      m3Title: '按 26 个字母分首字母，多少人能保证两人同字母？',
      m3Text: '说出抽屉、保证个数与稳赢数。开赌后看最坏情况被第 27 人打破。',
      m3Rule: '26 个字母抽屉。26 人可各占一字母；第 27 人必撞车。',
      m3Lesson: '又是基本形式：抽屉 n=26，稳赢线 n+1=27。',
      m3Ready: '终场：26 个字母抽屉，保证两人同字母。',
      m3Hint: '和生日月同一逻辑：抽屉数 + 1。',
      m3Formula: '抽屉 26 · 保证成对 · 稳赢线 ?',
    },
    en: {
      doc: 'The Betting Party · KidsLab',
      back: 'Back to platform',
      title: 'The Betting Party',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      meterDrawers: 'Bins',
      meterPigeons: 'Pigeons',
      meterSure: 'Sure line',
      formulaLabel: 'Bet formula',
      fieldDrawers: 'How many bins?',
      fieldNeed: 'Guarantee how many alike?',
      fieldPigeons: 'How many pigeons to be sure?',
      openBet: 'State the sure number · Bet',
      invite: 'Invite next',
      hint: 'Small hint',
      resetJob: 'Restart round',
      next: 'Next bet',
      finalKicker: 'Party Hall of Fame · Sure-bet Champ',
      finalTitle: 'Math “must” beats luck!',
      finalText: 'After the worst-case packing, one extra pigeon has nowhere new to go — that is the pigeonhole principle.',
      playAgain: 'Throw another party',
      missionsLabel: 'Bet progress',
      drawersLabel: 'Bins',
      moodSmug: 'Sure-win face',
      moodWow: 'Whoa — must!',
      moodSad: 'Almost got me…',
      moodCheer: 'You are the champ',
      deskPlay: 'Seat guests · See the must',
      deskBet: 'Name bins & pigeons · Bet',
      deskDone: 'This bet is settled',
      pendingSeat: 'Next guest waits — tap a bin',
      pendingSock: 'Next sock waits — drop it in a color bin',
      pendingLetter: 'Next guest waits — pick a first letter',
      needPending: 'Tap “Invite next”, then tap a bin.',
      placed: (label, n) => `Into “${label}”. That bin now holds ${n}.`,
      collide: (label, n) => `Collision! “${label}” has ${n} — even the worst case cannot stop the must.`,
      fullSpread: (n) => `Nice: ${n} bins with 1 each, no pair yet. Invite one more?`,
      inviteReady: 'Guest at the door. Try an empty bin.',
      inviteBlocked: 'This bet is done. Tap “Next bet”.',
      wrongBet: (need, right) => `Not sure enough! To guarantee ≥${need} alike, the sure number is ${right}. Try again.`,
      rightBet: (d, need, p) => `Nailed it! ${d} bins, guarantee ≥${need}, sure line = ${d}×${need - 1}+1 = ${p}.`,
      demoStart: 'Watch the worst case: keep bins as empty as possible until one extra forces a pile-up.',
      demoDone: 'See? After the worst-case fill, one more must share a bin.',
      lockedMission: 'Finish earlier bets first',
      allDone: 'All four bets settled. You felt the wall of “must”!',
      monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      sockNames: ['Red', 'Blue', 'Green'],
      m0Kicker: 'Challenge the wizard · Birth months',
      m0Title: 'Seat 13 guests with no shared birth month?',
      m0Text: 'Tap “Invite next”, then a month bin. Keep months unique — the wizard bets #13 collides.',
      m0Rule: '12 months = 12 bins. Worst case: 12 people, one each. #13 has nowhere new.',
      m0Lesson: 'Pigeonhole: n bins and n+1 pigeons ⇒ some bin has ≥2.',
      m0Ready: 'Party time! Invite the first guest into a month.',
      m0Hint: 'Fill all 12 months with 1 person, then invite #13 — any bin makes a pair.',
      m0Formula: 'Bins 12 · aim for a pair · sure line 13',
      m0Win: 'Magic moment: your carefully built worst case still loses to guest #13. Must beats luck!',
      m1Kicker: 'You hold the wand · Sock drawer',
      m1Title: '3 sock colors in the dark — how many pulls guarantee a matching pair?',
      m1Text: 'First state bins, how many alike, and pigeons. Then watch the worst-case demo.',
      m1Rule: '3 colors. Worst case: one of each (still no pair); the 4th must match.',
      m1Lesson: 'Sure number = bins × (need − 1) + 1. Here 3×1+1=4.',
      m1Ready: 'Take the wand: fill three numbers, then Bet. Answer is 4.',
      m1Hint: 'Bins=3, guarantee ≥2. Worst: 3 singles, 4th pairs → 3×1+1=4.',
      m1Formula: 'Bins ? · guarantee a pair · sure line ?',
      m2Kicker: 'Raise the stakes · Triple month',
      m2Title: 'To guarantee ≥3 people share a birth month, how many people?',
      m2Text: 'Still 12 month bins. Write bins, need-count, and the sure pigeon count.',
      m2Rule: 'Two per month (24) can avoid triples; #25 forces some month to 3.',
      m2Lesson: 'General form: n bins, guarantee k alike → n(k−1)+1. 12×2+1=25.',
      m2Ready: 'Bins 12, guarantee ≥3. Compute the sure line, then bet.',
      m2Hint: 'Worst: 12×2=24 with no triple; #25 makes a triple.',
      m2Formula: 'Bins 12 · guarantee ≥3 · sure line ?',
      m3Kicker: 'Finale · Same first letter',
      m3Title: '26 letter bins — how many people guarantee two share a letter?',
      m3Text: 'State bins, need-count, and sure number. Watch #27 break the worst case.',
      m3Rule: '26 letter bins. 26 people can take every letter; #27 collides.',
      m3Lesson: 'Basic form again: n=26 bins, sure line n+1=27.',
      m3Ready: 'Finale: 26 letter bins, guarantee a shared letter.',
      m3Hint: 'Same logic as months: bins + 1.',
      m3Formula: 'Bins 26 · guarantee a pair · sure line ?',
    },
  };

  const MISSIONS = [
    {
      id: 'months',
      mode: 'construct',
      drawers: 12,
      need: 2,
      kind: 'month',
      icon: '📅',
    },
    {
      id: 'socks',
      mode: 'bet',
      drawers: 3,
      need: 2,
      kind: 'sock',
      fixedDrawers: true,
      fixedNeed: true,
      icon: '🧦',
    },
    {
      id: 'triple-month',
      mode: 'bet',
      drawers: 12,
      need: 3,
      kind: 'month',
      fixedDrawers: true,
      fixedNeed: true,
      icon: '3️⃣',
    },
    {
      id: 'letters',
      mode: 'bet',
      drawers: 26,
      need: 2,
      kind: 'letter',
      fixedDrawers: true,
      fixedNeed: true,
      icon: '🔤',
    },
  ];

  function sureNumber(drawers, need) {
    return drawers * (need - 1) + 1;
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
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      try {
        this.context ||= new C();
        if (this.context.state === 'suspended') this.context.resume().catch(() => {});
        return this.context;
      } catch { return null; }
    }

    tone(freq, dur, vol, type = 'sine', delay = 0) {
      const ctx = this.ensure();
      if (!ctx) return;
      const start = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(vol, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain).connect(ctx.destination);
      this.sources.add(osc);
      osc.addEventListener('ended', () => this.sources.delete(osc), { once: true });
      osc.start(start);
      osc.stop(start + dur + 0.02);
    }

    tap() { this.tone(480, 0.05, 0.016, 'triangle'); }
    place() { this.tone(540, 0.07, 0.018, 'sine'); this.tone(680, 0.06, 0.012, 'triangle', 0.03); }
    ok() { [392, 523, 659].forEach((f, i) => this.tone(f, 0.14, 0.02, 'triangle', i * 0.05)); }
    bad() { this.tone(170, 0.12, 0.024, 'sawtooth'); this.tone(120, 0.14, 0.016, 'sawtooth', 0.05); }
    magic() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.18, 0.02, 'sine', i * 0.06)); }
    finale() { [330, 440, 554, 659, 880].forEach((f, i) => this.tone(f, 0.26, 0.022, 'triangle', i * 0.06)); }
    setMuted(v) {
      this.muted = v;
      try { localStorage.setItem(SOUND_KEY, v ? '1' : '0'); } catch { /* ignore */ }
      if (v && this.context) {
        this.sources.forEach((s) => { try { s.stop(); } catch { /* ignore */ } });
        this.sources.clear();
      }
    }
  }

  const sound = new SoundEngine();
  let t = (key) => key;

  const el = {
    sound: document.getElementById('soundBtn'),
    theme: document.getElementById('themeBtn'),
    lang: document.getElementById('langBtn'),
    missionNumber: document.getElementById('missionNumber'),
    missionKicker: document.getElementById('missionKicker'),
    missionTitle: document.getElementById('missionTitle'),
    missionText: document.getElementById('missionText'),
    missionNav: document.getElementById('missionNav'),
    status: document.getElementById('status'),
    drawerCount: document.getElementById('drawerCount'),
    pigeonCount: document.getElementById('pigeonCount'),
    sureLine: document.getElementById('sureLine'),
    wizard: document.getElementById('wizard'),
    wizardMood: document.getElementById('wizardMood'),
    formulaText: document.getElementById('formulaText'),
    drawers: document.getElementById('drawers'),
    pending: document.getElementById('pending'),
    pendingGuest: document.getElementById('pendingGuest'),
    pendingText: document.getElementById('pendingText'),
    deskTitle: document.getElementById('deskTitle'),
    ruleText: document.getElementById('ruleText'),
    lessonIcon: document.getElementById('lessonIcon'),
    lessonText: document.getElementById('lessonText'),
    betForm: document.getElementById('betForm'),
    inputDrawers: document.getElementById('inputDrawers'),
    inputNeed: document.getElementById('inputNeed'),
    inputPigeons: document.getElementById('inputPigeons'),
    openBetBtn: document.getElementById('openBetBtn'),
    inviteBtn: document.getElementById('inviteBtn'),
    hintBtn: document.getElementById('hintBtn'),
    resetBtn: document.getElementById('resetBtn'),
    nextBtn: document.getElementById('nextBtn'),
    completeModal: document.getElementById('completeModal'),
    playAgainBtn: document.getElementById('playAgainBtn'),
  };

  function loadSave() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; }
    catch { return {}; }
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        mission: state.mission,
        cleared: state.cleared,
      }));
    } catch { /* ignore */ }
  }

  function loadDebug() {
    try { return JSON.parse(localStorage.getItem(DEBUG_KEY)) || null; }
    catch { return null; }
  }

  const save = loadSave();
  const debug = loadDebug();

  const state = {
    mission: Number.isInteger(debug?.mission) ? debug.mission : (save.mission || 0),
    cleared: Array.isArray(save.cleared) ? save.cleared.slice(0, MISSIONS.length) : [],
    counts: [],
    total: 0,
    pending: false,
    pendingEmoji: '🧒',
    phase: 'play', // play | won | demo
    busy: false,
    wizardMood: 'smug',
    statusKey: null,
    statusArgs: [],
    collideIndex: -1,
    betOpened: false,
  };

  while (state.cleared.length < MISSIONS.length) state.cleared.push(false);
  if (state.mission < 0 || state.mission >= MISSIONS.length) state.mission = 0;

  function mission() { return MISSIONS[state.mission]; }

  function drawerLabels() {
    const m = mission();
    if (m.kind === 'month') return t('monthNames');
    if (m.kind === 'sock') return t('sockNames');
    if (m.kind === 'letter') return LETTERS;
    return Array.from({ length: m.drawers }, (_, i) => String(i + 1));
  }

  function setStatus(key, ...args) {
    state.statusKey = key;
    state.statusArgs = args;
  }

  function statusText() {
    if (!state.statusKey) return '';
    const value = t(state.statusKey);
    return typeof value === 'function' ? value(...state.statusArgs) : value;
  }

  function maxInBins() {
    return state.counts.length ? Math.max(...state.counts) : 0;
  }

  function resetRound(keepMission = true) {
    const m = mission();
    state.counts = Array(m.drawers).fill(0);
    state.total = 0;
    state.pending = false;
    state.phase = m.mode === 'bet' ? 'bet' : 'play';
    state.busy = false;
    state.wizardMood = m.mode === 'bet' ? 'cheer' : 'smug';
    state.collideIndex = -1;
    state.betOpened = false;
    state.pendingEmoji = m.kind === 'sock' ? SOCK_EMOJI[0] : GUEST_EMOJI[0];
    if (m.mode === 'bet') {
      el.inputDrawers.value = String(m.drawers);
      el.inputNeed.value = String(m.need);
      el.inputPigeons.value = '';
      el.inputDrawers.disabled = !!m.fixedDrawers;
      el.inputNeed.disabled = !!m.fixedNeed;
      setStatus(`m${state.mission}Ready`);
    } else {
      setStatus(`m${state.mission}Ready`);
    }
    if (!keepMission) persist();
    render();
  }

  function placeInDrawer(index) {
    const m = mission();
    if (state.busy || state.phase === 'won') return false;
    if (m.mode === 'bet' && !state.betOpened) {
      setStatus('m1Ready');
      render();
      return false;
    }
    if (!state.pending) {
      setStatus('needPending');
      sound.bad();
      render();
      return false;
    }
    if (index < 0 || index >= m.drawers) return false;

    state.counts[index] += 1;
    state.total += 1;
    state.pending = false;
    const labels = drawerLabels();
    const label = labels[index];
    const n = state.counts[index];
    sound.place();
    window.cool?.track?.('place');

    if (n >= m.need && state.total >= sureNumber(m.drawers, m.need)) {
      // collision that proves the principle at/after sure line
      state.collideIndex = index;
      state.phase = 'won';
      state.wizardMood = 'wow';
      setStatus('collide', label, n);
      state.cleared[state.mission] = true;
      persist();
      sound.magic();
      window.cool?.stage?.(`mission${state.mission + 1}`);
      if (state.mission === 0) {
        setTimeout(() => {
          if (state.phase === 'won' && state.mission === 0) {
            setStatus('m0Win');
            render();
          }
        }, 700);
      }
      if (state.cleared.every(Boolean)) {
        window.cool?.complete?.();
      }
    } else if (n >= m.need) {
      // early collision before filling worst case — still ok educationally
      state.collideIndex = index;
      setStatus('placed', label, n);
      state.wizardMood = 'smug';
      sound.ok();
    } else {
      setStatus('placed', label, n);
      if (state.total === m.drawers * (m.need - 1) && maxInBins() <= m.need - 1) {
        setStatus('fullSpread', m.drawers);
        state.wizardMood = 'sad';
      } else {
        state.wizardMood = 'smug';
      }
    }
    render();
    return true;
  }

  function invite() {
    const m = mission();
    if (state.busy) return;
    if (state.phase === 'won') {
      setStatus('inviteBlocked');
      sound.bad();
      render();
      return;
    }
    if (m.mode === 'bet' && !state.betOpened) {
      setStatus(`m${state.mission}Ready`);
      sound.bad();
      render();
      return;
    }
    if (state.pending) {
      setStatus(m.kind === 'sock' ? 'pendingSock' : m.kind === 'letter' ? 'pendingLetter' : 'pendingSeat');
      render();
      return;
    }
    state.pending = true;
    if (m.kind === 'sock') {
      state.pendingEmoji = SOCK_EMOJI[state.total % SOCK_EMOJI.length];
    } else {
      state.pendingEmoji = GUEST_EMOJI[state.total % GUEST_EMOJI.length];
    }
    setStatus('inviteReady');
    sound.tap();
    window.cool?.track?.('invite');
    render();
  }

  function openBet() {
    const m = mission();
    if (m.mode !== 'bet' || state.busy || state.phase === 'won') return;

    const d = Number(el.inputDrawers.value);
    const need = Number(el.inputNeed.value);
    const p = Number(el.inputPigeons.value);
    const right = sureNumber(m.drawers, m.need);

    if (!Number.isFinite(d) || !Number.isFinite(need) || !Number.isFinite(p)) {
      setStatus('wrongBet', m.need, right);
      sound.bad();
      render();
      return;
    }

    if (d !== m.drawers || need !== m.need || p !== right) {
      setStatus('wrongBet', m.need, right);
      sound.bad();
      window.cool?.track?.('wrong_bet');
      render();
      return;
    }

    state.betOpened = true;
    state.phase = 'play';
    state.wizardMood = 'cheer';
    setStatus('rightBet', m.drawers, m.need, right);
    sound.ok();
    window.cool?.track?.('open_bet');
    window.cool?.stage?.(`bet${state.mission + 1}`);
    render();

    // Auto demo worst-case after correct bet
    runWorstCaseDemo();
  }

  async function runWorstCaseDemo() {
    const m = mission();
    if (state.busy) return;
    state.busy = true;
    state.phase = 'demo';
    state.counts = Array(m.drawers).fill(0);
    state.total = 0;
    state.pending = false;
    state.collideIndex = -1;
    setStatus('demoStart');
    render();

    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const per = m.need - 1;

    // Fill worst case: each drawer gets (need-1)
    for (let layer = 0; layer < per; layer += 1) {
      for (let i = 0; i < m.drawers; i += 1) {
        if (state.mission !== MISSIONS.indexOf(m)) { state.busy = false; return; }
        state.counts[i] += 1;
        state.total += 1;
        sound.place();
        render();
        await wait(m.drawers > 12 ? 28 : 55);
      }
    }

    // One more into drawer 0 forces need
    await wait(200);
    state.counts[0] += 1;
    state.total += 1;
    state.collideIndex = 0;
    state.phase = 'won';
    state.wizardMood = 'wow';
    state.cleared[state.mission] = true;
    persist();
    setStatus('demoDone');
    sound.magic();
    window.cool?.stage?.(`mission${state.mission + 1}`);
    if (state.cleared.every(Boolean)) {
      window.cool?.complete?.();
      sound.finale();
      el.completeModal.hidden = false;
    }
    state.busy = false;
    render();
  }

  function nextMission() {
    if (state.busy) return;
    const next = state.mission + 1;
    if (next >= MISSIONS.length) {
      el.completeModal.hidden = false;
      sound.finale();
      window.cool?.complete?.();
      render();
      return;
    }
    state.mission = next;
    persist();
    resetRound();
    sound.tap();
  }

  function goMission(index) {
    if (state.busy) return;
    if (index < 0 || index >= MISSIONS.length) return;
    if (index > 0 && !state.cleared[index - 1] && !state.cleared[index]) {
      setStatus('lockedMission');
      sound.bad();
      render();
      return;
    }
    state.mission = index;
    persist();
    resetRound();
  }

  function renderDrawers() {
    const m = mission();
    const labels = drawerLabels();
    const canClick = !state.busy && state.phase !== 'won' && (m.mode === 'construct' || state.betOpened);
    el.drawers.setAttribute('aria-label', t('drawersLabel'));
    el.drawers.innerHTML = labels.map((label, i) => {
      const count = state.counts[i] || 0;
      const pips = Array.from({ length: Math.min(count, 8) }, (_, p) => {
        const cls = m.kind === 'sock' ? `is-sock c${i % 5}` : `c${(i + p) % 5}`;
        return `<span class="${cls}"></span>`;
      }).join('');
      const classes = [
        'drawer',
        state.pending && canClick ? 'is-target' : '',
        state.collideIndex === i ? 'is-collide' : '',
      ].filter(Boolean).join(' ');
      return `<button class="${classes}" type="button" role="listitem" data-drawer="${i}" ${canClick ? '' : 'disabled'} aria-label="${label}: ${count}">
        <span class="drawer__label">${label}</span>
        <span class="drawer__count">${count}</span>
        <span class="drawer__pips">${pips}</span>
      </button>`;
    }).join('');
  }

  function renderNav() {
    el.missionNav.setAttribute('aria-label', t('missionsLabel'));
    el.missionNav.innerHTML = MISSIONS.map((m, i) => {
      const classes = [
        i === state.mission ? 'is-active' : '',
        state.cleared[i] ? 'is-done' : '',
      ].filter(Boolean).join(' ');
      const locked = i > 0 && !state.cleared[i - 1] && !state.cleared[i] && i !== state.mission;
      return `<button type="button" class="${classes}" data-mission="${i}" ${locked ? 'disabled' : ''} aria-label="${i + 1}">${m.icon}</button>`;
    }).join('');
  }

  function render() {
    const m = mission();
    const idx = state.mission;
    const sure = sureNumber(m.drawers, m.need);

    el.missionNumber.textContent = String(idx + 1).padStart(2, '0');
    el.missionKicker.textContent = t(`m${idx}Kicker`);
    el.missionTitle.textContent = t(`m${idx}Title`);
    el.missionText.textContent = t(`m${idx}Text`);
    el.ruleText.textContent = t(`m${idx}Rule`);
    el.lessonText.textContent = t(`m${idx}Lesson`);
    el.lessonIcon.textContent = m.icon;
    el.formulaText.textContent = state.betOpened || m.mode === 'construct'
      ? `${t('meterDrawers')} ${m.drawers} · ≥${m.need} · ${t('meterSure')} ${sure}`
      : t(`m${idx}Formula`);

    el.drawerCount.textContent = String(m.drawers);
    el.pigeonCount.textContent = String(state.total);
    el.sureLine.textContent = String(sure);
    el.status.textContent = statusText();

    el.wizard.dataset.mood = state.wizardMood;
    const moodKey = ({
      smug: 'moodSmug',
      wow: 'moodWow',
      sad: 'moodSad',
      cheer: 'moodCheer',
    })[state.wizardMood] || 'moodSmug';
    el.wizardMood.textContent = t(moodKey);

    const showBet = m.mode === 'bet' && state.phase !== 'won' && !state.betOpened;
    el.betForm.hidden = !showBet;
    el.inviteBtn.hidden = showBet;
    el.deskTitle.textContent = state.phase === 'won' ? t('deskDone') : (showBet ? t('deskBet') : t('deskPlay'));

    el.pending.hidden = !state.pending;
    el.pendingGuest.textContent = state.pendingEmoji;
    el.pendingText.textContent = m.kind === 'sock' ? t('pendingSock') : m.kind === 'letter' ? t('pendingLetter') : t('pendingSeat');

    el.nextBtn.hidden = state.phase !== 'won';
    el.inviteBtn.disabled = state.busy || state.phase === 'won' || (m.mode === 'bet' && !state.betOpened);
    el.openBetBtn.disabled = state.busy;
    el.hintBtn.disabled = state.busy;
    el.resetBtn.disabled = state.busy;

    const muted = sound.muted;
    el.sound.textContent = muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', muted ? 'true' : 'false');
    el.sound.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));

    renderDrawers();
    renderNav();

    if (state.cleared.every(Boolean) && state.phase === 'won' && state.mission === MISSIONS.length - 1) {
      el.completeModal.hidden = false;
    }
  }

  /* events */
  el.drawers.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-drawer]');
    if (!btn) return;
    placeInDrawer(Number(btn.dataset.drawer));
  });

  el.missionNav.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mission]');
    if (!btn) return;
    goMission(Number(btn.dataset.mission));
  });

  el.inviteBtn.addEventListener('click', invite);
  el.openBetBtn.addEventListener('click', openBet);
  el.hintBtn.addEventListener('click', () => {
    setStatus(`m${state.mission}Hint`);
    sound.tap();
    render();
  });
  el.resetBtn.addEventListener('click', () => {
    resetRound();
    sound.tap();
  });
  el.nextBtn.addEventListener('click', nextMission);
  el.playAgainBtn.addEventListener('click', () => {
    el.completeModal.hidden = true;
    state.mission = 0;
    state.cleared = MISSIONS.map(() => false);
    persist();
    resetRound();
    sound.tap();
  });

  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    if (!sound.muted) sound.tap();
    render();
  });

  window.cool?.preferences?.on?.(() => {}); // ensure sdk present

  /* i18n / theme via platform SDK */
  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang, theme }) {
      t = translate;
      document.title = t('doc');
      if (el.lang) el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      if (el.theme) {
        el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
        el.theme.setAttribute('aria-label', t('themeLabel'));
      }
      render();
    },
  });

  el.lang?.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme?.addEventListener('click', () => window.cool.preferences.toggleTheme());

  // boot
  resetRound();

  window.__BET_PARTY__ = {
    getState: () => ({
      mission: state.mission,
      cleared: state.cleared.slice(),
      counts: state.counts.slice(),
      total: state.total,
      pending: state.pending,
      phase: state.phase,
      busy: state.busy,
      betOpened: state.betOpened,
      sure: sureNumber(mission().drawers, mission().need),
      drawers: mission().drawers,
      need: mission().need,
    }),
    sureNumber,
    invite,
    place: placeInDrawer,
    openBet: (drawers, need, pigeons) => {
      el.inputDrawers.value = String(drawers);
      el.inputNeed.value = String(need);
      el.inputPigeons.value = String(pigeons);
      openBet();
    },
    setMission: (i) => goMission(i),
    reset: () => resetRound(),
    setCleared: (arr) => {
      state.cleared = MISSIONS.map((_, i) => !!arr[i]);
      persist();
      render();
    },
  };
})();
