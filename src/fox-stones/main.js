/* ============================================================
   狐狸的石子 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '狐狸的石子 · KidsLab',
      back: '返回平台', title: '狐狸的石子',
      tip0: '每次拿 1–3 颗。狐狸很会算，但你也能从结局倒推。',
      eyebrow: '逆向推理森林', chooseFirst: '这个开局你要先手，还是让狐狸先？', humanFirst: '我先', foxFirst: '狐狸先',
      labTitle: '策略实验室', glasses: '必胜眼镜（3局后解锁）', stonesCount: '石子数', newRound: '新开一局', openReplay: '打开复盘板', again: '再来一局', badgeTitle: '策略大师', badgeSub: '我不是运气好，我是算出来的。',
      classic: '经典 1–3', max4: '变体 1–4', misere: '反转局', chooser: '先后手选择', setup: '设局教兔子',
      classicSub: '拿到最后一颗赢', max4Sub: '坑位变成 5 的倍数', misereSub: '拿最后一颗反而输', chooserSub: '先判断坑位再决定', setupSub: '你教笨兔子下棋',
      remain: (n) => `石子：${n}`, turnHuman: '你的回合', turnFox: '狐狸思考中', turnRabbit: '兔子等你教', streak: (n) => `无眼镜连胜：${n}/3`,
      foxThink: '眨眼计算…', foxSmug: '嘿嘿，再猜猜～', foxSad: '帽子、帽子飞啦！', foxIdle: '盯着石子',
      takeTip: (min, max) => `点按钮拿 ${min}–${max} 颗，目标是把坑位留给狐狸。`, bestTip: (n, pit) => `必胜眼镜：拿 ${n} 颗，把狐狸推进 ${pit}。`, noBest: '这个数已经是坑位：努力把损失降到最小！',
      rabbitAsk: '小兔子问：我该拿几颗呀？你替它选。', rabbitGood: '兔子照做了！狐狸掉进坑位。', rabbitBad: '哎呀，这步没把狐狸推进坑位。',
      humanWin: '你赢了！从终点倒着算，狐狸也会摔帽子。', foxWin: '狐狸赢了！复盘看看哪个 4 的倍数/坑位把你困住。', rabbitWin: '你和兔子赢了！教学相长。',
      replayTitle: '复盘板', replayIntro: '从 0 往回看：能把对手送到坑位，就握住主动权。',
      pitExplain: (n, base) => `${n} 是 ${base} 的倍数坑位：轮到谁面对它，完美对手就能镜像拿完。`,
      safeExplain: (n, take, pit) => `从 ${n} 拿 ${take} 颗，留下 ${pit}，这是稳赢入口。`,
      normalExplain: (n) => `${n} 不是坑位。试着找一个拿法，让剩下的数变成发光数字。`,
      unlocked: '必胜眼镜解锁！发光按钮会提示“拿几颗”。',
    },
    en: {
      doc: "The Fox's Stones · KidsLab",
      back: 'Back to platform', title: "The Fox's Stones",
      tip0: 'Take 1–3 stones. The fox calculates well, but you can reason backward.',
      eyebrow: 'Backward Reasoning Forest', chooseFirst: 'For this start, do you move first or let the fox?', humanFirst: 'I go first', foxFirst: 'Fox first',
      labTitle: 'Strategy lab', glasses: 'Winning glasses (unlock after 3 games)', stonesCount: 'Stones', newRound: 'New round', openReplay: 'Open replay board', again: 'Play again', badgeTitle: 'Strategy Master', badgeSub: 'Not luck — I calculated it.',
      classic: 'Classic 1–3', max4: 'Variant 1–4', misere: 'Reverse game', chooser: 'Choose turn order', setup: 'Set-up & teach rabbit',
      classicSub: 'Last stone wins', max4Sub: 'Pits become multiples of 5', misereSub: 'Last stone loses', chooserSub: 'Judge the pit first', setupSub: 'Teach a silly rabbit',
      remain: (n) => `Stones: ${n}`, turnHuman: 'Your turn', turnFox: 'Fox thinking', turnRabbit: 'Rabbit waits', streak: (n) => `No-glasses streak: ${n}/3`,
      foxThink: 'Blinking math…', foxSmug: 'Hehe, guess again~', foxSad: 'My hat! My hat!', foxIdle: 'Watching stones',
      takeTip: (min, max) => `Tap a button to take ${min}–${max}. Try to leave a pit for the fox.`, bestTip: (n, pit) => `Winning glasses: take ${n}, push fox to ${pit}.`, noBest: 'This number is already a pit: minimize the damage!',
      rabbitAsk: 'Bunny asks: how many should I take? Choose for it.', rabbitGood: 'Bunny followed you! Fox falls into a pit.', rabbitBad: 'Oops, that move did not push fox to a pit.',
      humanWin: 'You win! Reasoning backward makes the fox drop its hat.', foxWin: 'Fox wins! Replay which multiple/pit trapped you.', rabbitWin: 'You and Bunny win! Teaching makes learning stick.',
      replayTitle: 'Replay board', replayIntro: 'Look backward from 0: if you can send the opponent to a pit, you control the game.',
      pitExplain: (n, base) => `${n} is a multiple-of-${base} pit: whoever faces it loses to perfect mirror play.`,
      safeExplain: (n, take, pit) => `From ${n}, take ${take} and leave ${pit}. That is the winning gate.`,
      normalExplain: (n) => `${n} is not a pit. Find a take that leaves a glowing number.`,
      unlocked: 'Winning glasses unlocked! Glowing buttons show what to take.',
    },
  };

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* 忽略 */ } },
  };

  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme)
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme !== 'light' && theme !== 'dark') theme = 'light';

  /** 取当前语言文案；函数型 key 直接返回函数供调用方传参 */
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  /** 读取 CSS 主题变量（Canvas/three.js 取色必须走这里，勿硬编码） */
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const langBtn = document.getElementById('langBtn');
  const themeBtn = document.getElementById('themeBtn');

  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((n) => {
      const v = I18N[lang][n.dataset.t];
      if (typeof v === 'string') n.textContent = v;
    });
    if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    render(); // 语言切换后重绘动态文案
  }

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    /* Canvas / three.js 课件监听该事件重取 cssVar 配色 */
    dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    render();
  }

  langBtn?.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    store.set(LS.lang, lang);
    applyLang();
  });
  themeBtn?.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set(LS.theme, theme);
    applyTheme();
  });

  /* ======================= 游戏区 · Game ======================= */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const SAVE_KEY = 'kidslab.foxstones';
  const save = (() => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } })();
  const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch { /* ignore */ } };

  const MODES = [
    { id: 'classic', max: 3, misere: false, chooser: false, setup: false, title: 'classic', sub: 'classicSub' },
    { id: 'max4', max: 4, misere: false, chooser: false, setup: false, title: 'max4', sub: 'max4Sub' },
    { id: 'misere', max: 3, misere: true, chooser: false, setup: false, title: 'misere', sub: 'misereSub' },
    { id: 'chooser', max: 3, misere: false, chooser: true, setup: false, title: 'chooser', sub: 'chooserSub' },
    { id: 'setup', max: 3, misere: false, chooser: false, setup: true, title: 'setup', sub: 'setupSub' },
  ];

  const el = {
    modeTitle: $('#modeTitle'), tip: $('#tip'), fox: $('#fox'), foxMood: $('#foxMood'), modes: $('#modeTabs'), remaining: $('#remaining'), turn: $('#turnBadge'), streak: $('#streak'),
    choice: $('#choicePanel'), humanFirst: $('#humanFirst'), foxFirst: $('#foxFirst'), stones: $('#stones'), takes: $$('.take'), coach: $('#coach'), glasses: $('#glasses'), setupBox: $('#setupBox'), setupCount: $('#setupCount'), setupOut: $('#setupOut'), newRound: $('#newRound'), replayBtn: $('#replayBtn'), replay: $('#replayModal'), closeReplay: $('#closeReplay'), resultEmoji: $('#resultEmoji'), resultTitle: $('#resultTitle'), resultText: $('#resultText'), line: $('#numberLine'), explain: $('#explain'), again: $('#againBtn'), badge: $('#badge'),
  };

  let modeIndex = Math.max(0, MODES.findIndex((m) => m.id === (save.mode || 'classic')));
  let stones = 17;
  let initial = 17;
  let turn = 'human';
  let over = false;
  let foxState = 'idle';
  let history = [];
  let games = save.games || 0;
  let noGlassesStreak = save.noGlassesStreak || 0;
  let glassesUnlocked = games >= 3;
  let lastWinner = null;
  let waitingChoice = false;

  function mode() { return MODES[modeIndex]; }
  function randStart() {
    const min = mode().id === 'max4' ? 16 : 13;
    const max = mode().id === 'max4' ? 21 : 21;
    return min + Math.floor(Math.random() * (max - min + 1));
  }
  function base() { return mode().max + 1; }
  function isPit(n) {
    if (mode().misere) return n % base() === 1;
    return n % base() === 0;
  }
  function bestTake(n) {
    const max = Math.min(mode().max, n);
    for (let take = 1; take <= max; take += 1) {
      const left = n - take;
      if (left === 0) {
        if (!mode().misere) return take;
      } else if (isPit(left)) return take;
    }
    return Math.min(max, 1 + Math.floor(Math.random() * max));
  }
  function randomLegal(n) { return 1 + Math.floor(Math.random() * Math.min(mode().max, n)); }

  function newRound(keepMode = true) {
    const m = mode();
    stones = m.setup ? Number(el.setupCount.value) : randStart();
    initial = stones;
    history = [{ who: 'start', left: stones, take: 0 }];
    over = false;
    lastWinner = null;
    waitingChoice = m.chooser;
    turn = m.setup ? 'rabbit' : 'human';
    foxState = 'idle';
    if (!keepMode) save.mode = m.id;
    if (!waitingChoice && !m.setup && isPit(stones)) turn = 'fox';
    render();
    if (turn === 'fox') setTimeout(foxMove, 650);
  }

  function setMode(i) {
    modeIndex = i;
    save.mode = mode().id;
    persist();
    newRound(false);
  }

  function legalTake(n) { return n >= 1 && n <= mode().max && n <= stones; }

  function humanMove(n) {
    if (over || waitingChoice || (turn !== 'human' && turn !== 'rabbit') || !legalTake(n)) return;
    const wasGlasses = el.glasses.checked;
    animateTake(n, turn);
    const actor = turn;
    stones -= n;
    history.push({ who: actor, take: n, left: stones });
    if (actor === 'rabbit') {
      const target = isPit(stones);
      el.coach.textContent = target ? t('rabbitGood') : t('rabbitBad');
    }
    if (checkEnd(actor, wasGlasses)) return;
    turn = 'fox';
    foxState = 'think';
    render();
    setTimeout(foxMove, 650);
  }

  function foxMove() {
    if (over || turn !== 'fox') return;
    const n = bestTake(stones);
    animateTake(n, 'fox');
    stones -= n;
    history.push({ who: 'fox', take: n, left: stones });
    if (checkEnd('fox', false)) return;
    turn = mode().setup ? 'rabbit' : 'human';
    foxState = 'idle';
    render();
  }

  function checkEnd(actor, usedGlasses) {
    if (stones > 0) return false;
    over = true;
    const humanSide = actor === 'human' || actor === 'rabbit';
    let humanWon = mode().misere ? !humanSide : humanSide;
    if (mode().setup) humanWon = humanSide;
    lastWinner = humanWon ? 'human' : 'fox';
    foxState = humanWon ? 'sad' : 'smug';
    games += 1;
    save.games = games;
    glassesUnlocked = games >= 3;
    if (humanWon && !usedGlasses && !el.glasses.checked) noGlassesStreak += 1; else if (!humanWon) noGlassesStreak = 0;
    save.noGlassesStreak = noGlassesStreak;
    persist();
    render();
    setTimeout(showReplay, 650);
    if (glassesUnlocked && games === 3) setTimeout(() => { el.tip.textContent = t('unlocked'); }, 900);
    if (noGlassesStreak >= 3) setTimeout(showBadge, 1050);
    return true;
  }

  function animateTake(n, actor) {
    const nodes = $$('.stone:not(.gone)').slice(-n);
    nodes.forEach((node, i) => {
      node.classList.add('fly');
      node.style.animationDelay = `${i * 0.05}s`;
      setTimeout(() => node.classList.add('gone'), 560 + i * 50);
    });
    if (actor === 'fox') foxState = 'smug';
  }

  function showBadge() {
    el.badge.hidden = false;
    setTimeout(() => { el.badge.hidden = true; }, 3600);
  }

  function buildModes() {
    el.modes.innerHTML = MODES.map((m, i) => `<button class="modeBtn ${i === modeIndex ? 'on' : ''}" type="button" data-mode="${i}">${t(m.title)}<br><small>${t(m.sub)}</small></button>`).join('');
    el.modes.querySelectorAll('.modeBtn').forEach((b) => b.addEventListener('pointerdown', () => setMode(Number(b.dataset.mode))));
  }

  function renderStones() {
    const existing = el.stones.dataset.count;
    if (existing === String(stones) && el.stones.children.length) return;
    el.stones.dataset.count = String(stones);
    el.stones.innerHTML = Array.from({ length: stones }, (_, i) => `<button class="stone" type="button" data-stone="${i}" aria-label="stone">${i % 5 === 0 ? '🪨' : ''}</button>`).join('');
    el.stones.querySelectorAll('.stone').forEach((s) => s.addEventListener('pointerdown', () => {
      const idx = Number(s.dataset.stone);
      const take = Math.min(mode().max, stones - idx);
      previewPick(take);
    }));
  }

  function previewPick(n) {
    if (over || turn === 'fox' || waitingChoice) return;
    $$('.stone').forEach((s) => s.classList.remove('pick'));
    $$('.stone').slice(-n).forEach((s) => s.classList.add('pick'));
  }

  function render() {
    if (!el.modeTitle) return;
    const m = mode();
    buildModes();
    el.modeTitle.textContent = `${t(m.title)} · ${t(m.sub)}`;
    el.remaining.textContent = t('remain')(stones);
    el.turn.textContent = waitingChoice ? t('chooseFirst') : t(turn === 'fox' ? 'turnFox' : turn === 'rabbit' ? 'turnRabbit' : 'turnHuman');
    el.streak.textContent = t('streak')(noGlassesStreak);
    el.choice.hidden = !waitingChoice;
    el.setupBox.hidden = !m.setup;
    el.setupOut.textContent = el.setupCount.value;
    el.glasses.disabled = !glassesUnlocked;
    const moodKey = foxState === 'think' ? 'foxThink' : foxState === 'smug' ? 'foxSmug' : foxState === 'sad' ? 'foxSad' : 'foxIdle';
    el.foxMood.textContent = t(moodKey);
    el.fox.className = `fox ${foxState}`;
    const canTake = !over && !waitingChoice && turn !== 'fox';
    el.takes.forEach((btn) => {
      const n = Number(btn.dataset.take);
      btn.hidden = n > m.max;
      btn.disabled = !canTake || n > stones;
      btn.classList.toggle('best', Boolean(canTake && el.glasses.checked && n === bestTake(stones) && !isPit(stones)));
    });
    renderStones();
    const b = bestTake(stones);
    const pit = Math.max(0, stones - b);
    el.coach.textContent = m.setup ? t('rabbitAsk') : (el.glasses.checked && canTake ? (isPit(stones) ? t('noBest') : t('bestTip')(b, pit)) : t('takeTip')(1, m.max));
    if (over) el.coach.textContent = lastWinner === 'human' ? (m.setup ? t('rabbitWin') : t('humanWin')) : t('foxWin');
  }

  function showReplay() {
    el.resultEmoji.textContent = lastWinner === 'human' ? '🏆' : '🦊';
    el.resultTitle.textContent = t('replayTitle');
    el.resultText.textContent = lastWinner === 'human' ? (mode().setup ? t('rabbitWin') : t('humanWin')) : t('foxWin');
    buildNumberLine();
    el.replay.hidden = false;
  }

  function buildNumberLine() {
    const played = new Map();
    history.forEach((h, i) => played.set(h.left, i));
    el.line.innerHTML = '';
    for (let n = 0; n <= initial; n += 1) {
      const node = document.createElement('button');
      node.type = 'button';
      node.className = `num ${isPit(n) && n !== 0 ? 'pit' : ''} ${games >= 3 && isPit(n) && n !== 0 ? 'glow' : ''} ${played.has(n) ? 'step' : ''}`;
      node.textContent = String(n);
      if (played.has(n)) node.dataset.step = String(played.get(n));
      node.addEventListener('pointerdown', () => explainNumber(n));
      el.line.appendChild(node);
    }
    el.explain.textContent = t('replayIntro');
  }

  function explainNumber(n) {
    if (n === 0) { el.explain.textContent = t('replayIntro'); return; }
    if (isPit(n)) el.explain.textContent = t('pitExplain')(n, base());
    else {
      const take = bestTake(n);
      el.explain.textContent = t('safeExplain')(n, take, n - take) || t('normalExplain')(n);
    }
  }

  function chooseFirst(who) {
    waitingChoice = false;
    turn = who;
    render();
    if (turn === 'fox') setTimeout(foxMove, 650);
  }

  el.takes.forEach((b) => b.addEventListener('pointerdown', () => humanMove(Number(b.dataset.take))));
  el.humanFirst.addEventListener('pointerdown', () => chooseFirst('human'));
  el.foxFirst.addEventListener('pointerdown', () => chooseFirst('fox'));
  el.newRound.addEventListener('pointerdown', () => newRound());
  el.replayBtn.addEventListener('pointerdown', showReplay);
  el.closeReplay.addEventListener('pointerdown', () => { el.replay.hidden = true; });
  el.again.addEventListener('pointerdown', () => { el.replay.hidden = true; newRound(); });
  el.glasses.addEventListener('change', render);
  el.setupCount.addEventListener('input', () => { el.setupOut.textContent = el.setupCount.value; if (mode().setup && over) newRound(); });
  addEventListener('resize', () => { cssVar('--ink'); render(); });
  addEventListener('themechange', () => { cssVar('--paper'); render(); });

  /* ============================ 启动 ============================ */
  newRound();
  applyTheme();
  applyLang();
})();
