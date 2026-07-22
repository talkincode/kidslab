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
      tip0: '你和狐狸轮流拿石子。先会拿，再想办法赢！',
      eyebrow: '逆向推理森林', moreModes: '换一种玩法', chooseFirst: '这一局谁先拿？', humanFirst: '我先拿', foxFirst: '狐狸先拿',
      gotIt: '我懂了', howTo: '❓ 怎么玩',
      labTitle: '策略实验室', glasses: '提示眼镜（玩 3 局后解锁）', stonesCount: '石子数', newRound: '新开一局', openReplay: '打开复盘板', again: '再来一局', badgeTitle: '策略大师', badgeSub: '我不是运气好，我是算出来的。',
      classic: '经典 1–3', max4: '变体 1–4', misere: '反转局', chooser: '谁先拿？', setup: '教兔子',
      classicSub: '每次拿 1–3 颗，最后一颗赢', max4Sub: '每次最多拿 4 颗', misereSub: '拿最后一颗反而输', chooserSub: '先选谁开始', setupSub: '替兔子选择拿几颗',
      modeRule: (max, misere) => `每次可以拿 1–${max} 颗，${misere ? '拿到最后一颗的人输' : '拿到最后一颗的人赢'}。`,
      ruleTake: '① 你先拿', ruleFox: '② 狐狸再拿', ruleWin: '③ 最后一颗赢', ruleLose: '③ 最后一颗输',
      takeButton: (n) => `拿 ${n} 颗`, stonesLabel: (n) => `桌上还剩 ${n} 颗石子`,
      remain: (n) => `还剩 ${n} 颗`, turnHuman: '🟠 你的回合', turnFox: '🦊 狐狸的回合', turnRabbit: '🐰 帮兔子选', streak: (n) => `连胜挑战：${n}/3`,
      foxThink: '正在挑…', foxSmug: '嘿嘿，看我的～', foxSad: '帽子飞啦！', foxIdle: '等你先拿',
      startMove: '石子都在这里。现在轮到你先选。', foxStarts: '这局狐狸先拿。看看它拿几颗。', rabbitStarts: '小兔子等你替它选。',
      youTook: (n, left) => `你拿走 ${n} 颗，还剩 ${left} 颗。`, foxTook: (n, left) => `狐狸拿走 ${n} 颗，还剩 ${left} 颗。轮到你！`, rabbitTook: (n, left) => `兔子照你说的拿走 ${n} 颗，还剩 ${left} 颗。`,
      taking: (n) => `拿起 ${n} 颗石子…`, foxTaking: '狐狸正在拿石子…', waitFox: '狐狸正在选，不用点，马上又轮到你。',
      firstTakeTip: (max, misere) => `先试一次：点“拿 1 颗”到“拿 ${max} 颗”。${misere ? '小心，拿到最后一颗反而会输！' : '谁拿到最后一颗，谁就赢！'}`, takeTip: (max) => `轮到你：选一个橙色按钮，拿走 1–${max} 颗。`,
      bestTip: (n, pit) => `提示眼镜说：拿 ${n} 颗，给狐狸留下 ${pit} 颗。`, noBest: '现在没有稳稳的一步，先选一个合法拿法。',
      rabbitAsk: '小兔子问：我该拿几颗呀？请替它选一个橙色按钮。', rabbitGood: '兔子照做了！狐狸面对的是一个难赢的数。', rabbitBad: '这一步还没把难题留给狐狸，再观察一轮。',
      humanWin: '你拿到了最后一颗，你赢了！', foxWin: '狐狸拿到了最后一颗。看看复盘板，再试一次！', humanWinMisere: '狐狸拿了最后一颗，所以你赢了！', foxWinMisere: '你拿了最后一颗，所以这一局狐狸赢。', rabbitWin: '你和兔子拿到了最后一颗，配合成功！',
      replayTitle: '这一局发生了什么？', replayIntro: '点一点击过的数字。红色数字很难赢，我们把它叫作“坑位”。',
      pitExplain: (n, base) => `剩 ${n} 颗是“坑位”。对手可以让两人这一轮合计拿 ${base} 颗，把好机会一直留给自己。`,
      safeExplain: (n, take, pit) => `剩 ${n} 颗时拿 ${take} 颗，就会给狐狸留下红色的 ${pit} 颗。`,
      normalExplain: (n) => `剩 ${n} 颗不是坑位。找找看，拿几颗能留下红色数字？`,
      unlocked: '提示眼镜解锁！打开它，橙色按钮会告诉你该拿几颗。',
    },
    en: {
      doc: "The Fox's Stones · KidsLab",
      back: 'Back to platform', title: "The Fox's Stones",
      tip0: 'You and the fox take turns. Learn one move first, then outsmart the fox!',
      eyebrow: 'Backward Reasoning Forest', moreModes: 'Try another game', chooseFirst: 'Who takes first?', humanFirst: 'I go first', foxFirst: 'Fox goes first',
      gotIt: 'Got it', howTo: '❓ How to play',
      labTitle: 'Strategy lab', glasses: 'Hint glasses (unlock after 3 games)', stonesCount: 'Stones', newRound: 'New round', openReplay: 'Open replay', again: 'Play again', badgeTitle: 'Strategy Master', badgeSub: 'Not luck — I calculated it.',
      classic: 'Classic 1–3', max4: 'Variant 1–4', misere: 'Reverse game', chooser: 'Who starts?', setup: 'Teach Bunny',
      classicSub: 'Take 1–3; the last stone wins', max4Sub: 'Take up to 4 stones', misereSub: 'The last stone loses', chooserSub: 'Choose who starts', setupSub: 'Choose each move for Bunny',
      modeRule: (max, misere) => `Take 1–${max} stones each turn. ${misere ? 'Whoever takes the last stone loses.' : 'Whoever takes the last stone wins.'}`,
      ruleTake: '① Your pick', ruleFox: "② Fox's pick", ruleWin: '③ Last stone wins', ruleLose: '③ Last stone loses',
      takeButton: (n) => `Take ${n}`, stonesLabel: (n) => `${n} stones remain on the table`,
      remain: (n) => `${n} left`, turnHuman: '🟠 Your turn', turnFox: "🦊 Fox's turn", turnRabbit: '🐰 Help Bunny', streak: (n) => `Win challenge: ${n}/3`,
      foxThink: 'Choosing…', foxSmug: 'Hehe, watch this~', foxSad: 'My hat flew off!', foxIdle: 'Waiting for you',
      startMove: 'All stones are ready. You choose first.', foxStarts: 'The fox goes first this round. Watch how many it takes.', rabbitStarts: 'Bunny is waiting for you to choose.',
      youTook: (n, left) => `You took ${n}. ${left} stones remain.`, foxTook: (n, left) => `Fox took ${n}. ${left} remain — your turn!`, rabbitTook: (n, left) => `Bunny took ${n} as you said. ${left} remain.`,
      taking: (n) => `Picking up ${n}…`, foxTaking: 'The fox is picking up stones…', waitFox: 'The fox is choosing. Wait a moment — you are next.',
      firstTakeTip: (max, misere) => `Try it: tap “Take 1” through “Take ${max}”. ${misere ? 'Careful: taking the last stone loses!' : 'Whoever takes the last stone wins!'}`, takeTip: (max) => `Your turn: choose one orange button to take 1–${max}.`,
      bestTip: (n, pit) => `Hint glasses say: take ${n} and leave ${pit} for the fox.`, noBest: 'There is no guaranteed move here. Pick any legal move.',
      rabbitAsk: 'Bunny asks how many to take. Choose an orange button for it.', rabbitGood: 'Bunny followed you! The fox now faces a hard number.', rabbitBad: 'That move did not leave the hard number yet. Watch one more turn.',
      humanWin: 'You took the last stone. You win!', foxWin: 'The fox took the last stone. Check the replay and try again!', humanWinMisere: 'The fox took the last stone, so you win!', foxWinMisere: 'You took the last stone, so the fox wins this round.', rabbitWin: 'You and Bunny took the last stone. Teamwork wins!',
      replayTitle: 'What happened this round?', replayIntro: 'Tap a number you visited. Red numbers are hard to win from; we call them “pits.”',
      pitExplain: (n, base) => `${n} stones is a “pit.” An opponent can make both moves total ${base} each round and keep the good chances.`,
      safeExplain: (n, take, pit) => `With ${n} left, take ${take} to leave the red ${pit} for the fox.`,
      normalExplain: (n) => `${n} is not a pit. Can you take some stones and leave a red number?`,
      unlocked: 'Hint glasses unlocked! Turn them on to see which orange button to choose.',
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
    modeTitle: $('#modeTitle'), modePicker: $('#modePicker'), modeSummary: $('#modeSummary'), tip: $('#tip'), fox: $('#fox'), foxMood: $('#foxMood'), modes: $('#modeTabs'), remaining: $('#remaining'), turn: $('#turnBadge'), streak: $('#streak'),
    quickRules: $('#quickRules'), ruleTake: $('#ruleTake'), ruleFox: $('#ruleFox'), ruleGoal: $('#ruleGoal'), dismissRules: $('#dismissRules'), rulesBtn: $('#rulesBtn'), moveLog: $('#moveLog'),
    choice: $('#choicePanel'), humanFirst: $('#humanFirst'), foxFirst: $('#foxFirst'), stones: $('#stones'), takes: $$('.take'), coach: $('#coach'), glasses: $('#glasses'), setupBox: $('#setupBox'), setupCount: $('#setupCount'), setupOut: $('#setupOut'), newRound: $('#newRound'), replayBtn: $('#replayBtn'), replay: $('#replayModal'), closeReplay: $('#closeReplay'), resultEmoji: $('#resultEmoji'), resultTitle: $('#resultTitle'), resultText: $('#resultText'), line: $('#numberLine'), explain: $('#explain'), again: $('#againBtn'), badge: $('#badge'),
  };

  let modeIndex = Math.max(0, MODES.findIndex((m) => m.id === (save.games ? (save.mode || 'classic') : 'classic')));
  let stones = 9;
  let initial = 9;
  let turn = 'human';
  let over = false;
  let moving = false;
  let roundToken = 0;
  let foxState = 'idle';
  let history = [];
  let games = save.games || 0;
  let noGlassesStreak = save.noGlassesStreak || 0;
  let glassesUnlocked = games >= 3;
  let lastWinner = null;
  let waitingChoice = false;
  let rulesOpen = !save.rulesSeen;
  let moveMessage = { key: 'startMove', args: [] };

  function setMoveMessage(key, ...args) { moveMessage = { key, args }; }
  function moveMessageText() {
    const value = t(moveMessage.key);
    return typeof value === 'function' ? value(...moveMessage.args) : value;
  }

  function mode() { return MODES[modeIndex]; }
  function randStart() {
    if (games === 0 && mode().id === 'classic') return 9;
    const min = mode().id === 'max4' ? 16 : 13;
    const max = 21;
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
    roundToken += 1;
    moving = false;
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
    setMoveMessage(turn === 'fox' ? 'foxStarts' : m.setup ? 'rabbitStarts' : 'startMove');
    render();
    if (turn === 'fox') {
      const token = roundToken;
      setTimeout(() => foxMove(token), 550);
    }
  }

  function setMode(i) {
    modeIndex = i;
    save.mode = mode().id;
    persist();
    el.modePicker.open = false;
    newRound(false);
    window.cool?.track('change-stone-rule', { mode: mode().id });
  }

  function legalTake(n) { return n >= 1 && n <= mode().max && n <= stones; }

  function humanMove(n) {
    if (over || moving || waitingChoice || (turn !== 'human' && turn !== 'rabbit') || !legalTake(n)) return;
    const wasGlasses = el.glasses.checked;
    const actor = turn;
    const token = roundToken;
    moving = true;
    setMoveMessage('taking', n);
    previewPick(n);
    animateTake(n, actor);
    render();
    window.cool?.stage('fox-stones-play');
    window.cool?.track('take-stones', { actor, count: n, mode: mode().id });

    setTimeout(() => {
      if (token !== roundToken) return;
      stones -= n;
      history.push({ who: actor, take: n, left: stones });
      setMoveMessage(actor === 'rabbit' ? 'rabbitTook' : 'youTook', n, stones);
      moving = false;
      if (checkEnd(actor, wasGlasses)) return;
      turn = 'fox';
      foxState = 'think';
      render();
      setTimeout(() => foxMove(token), 520);
    }, 360);
  }

  function foxMove(token = roundToken) {
    if (token !== roundToken || over || moving || turn !== 'fox') return;
    const n = bestTake(stones);
    moving = true;
    setMoveMessage('foxTaking');
    animateTake(n, 'fox');
    render();

    setTimeout(() => {
      if (token !== roundToken) return;
      stones -= n;
      history.push({ who: 'fox', take: n, left: stones });
      setMoveMessage('foxTook', n, stones);
      moving = false;
      if (checkEnd('fox', false)) return;
      turn = mode().setup ? 'rabbit' : 'human';
      foxState = 'idle';
      render();
      window.cool?.track('fox-take-stones', { count: n, mode: mode().id });
    }, 360);
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
    const token = roundToken;
    setTimeout(() => { if (token === roundToken) showReplay(); }, 650);
    if (humanWon) {
      window.cool?.track('win-stone-round', { mode: mode().id, usedGlasses });
      if (mode().id === 'classic') window.cool?.complete?.();
    }
    if (glassesUnlocked && games === 3) setTimeout(() => { el.tip.textContent = t('unlocked'); }, 900);
    if (noGlassesStreak >= 3) setTimeout(showBadge, 1050);
    return true;
  }

  function animateTake(n, actor) {
    const nodes = $$('.stone:not(.gone)').slice(-n);
    nodes.forEach((node, i) => {
      node.classList.remove('pick');
      node.classList.add('fly');
      node.style.animationDelay = `${i * 0.035}s`;
    });
    if (actor === 'fox') foxState = 'smug';
  }

  function showBadge() {
    el.badge.hidden = false;
    setTimeout(() => { el.badge.hidden = true; }, 3600);
  }

  function buildModes() {
    const current = mode();
    el.modeSummary.textContent = t(current.title);
    el.modes.innerHTML = MODES.map((m, i) => `<button class="modeBtn ${i === modeIndex ? 'on' : ''}" type="button" role="tab" aria-selected="${i === modeIndex}" data-mode="${i}">${t(m.title)}<small>${t(m.sub)}</small></button>`).join('');
    el.modes.querySelectorAll('.modeBtn').forEach((b) => b.addEventListener('click', () => setMode(Number(b.dataset.mode))));
  }

  function renderStones() {
    const existing = el.stones.dataset.count;
    if (existing === String(stones) && el.stones.children.length) return;
    el.stones.dataset.count = String(stones);
    el.stones.innerHTML = Array.from({ length: stones }, (_, i) => `<span class="stone" aria-hidden="true" style="--tilt:${(i % 5) - 2}deg"></span>`).join('');
  }

  function previewPick(n) {
    if (over || moving || turn === 'fox' || waitingChoice) return;
    $$('.stone').forEach((s) => s.classList.remove('pick'));
    $$('.stone').slice(-n).forEach((s) => s.classList.add('pick'));
  }

  function clearPreview() {
    if (moving) return;
    $$('.stone').forEach((s) => s.classList.remove('pick'));
  }

  function resultMessage() {
    const m = mode();
    if (lastWinner === 'human') {
      if (m.setup) return t('rabbitWin');
      return t(m.misere ? 'humanWinMisere' : 'humanWin');
    }
    return t(m.misere ? 'foxWinMisere' : 'foxWin');
  }

  function render() {
    if (!el.modeTitle) return;
    const m = mode();
    buildModes();
    el.modeTitle.textContent = t(m.title);
    el.tip.textContent = t('modeRule')(m.max, m.misere);
    el.remaining.textContent = t('remain')(stones);
    el.stones.setAttribute('aria-label', t('stonesLabel')(stones));
    el.turn.textContent = waitingChoice ? t('chooseFirst') : t(turn === 'fox' ? 'turnFox' : turn === 'rabbit' ? 'turnRabbit' : 'turnHuman');
    el.streak.textContent = t('streak')(noGlassesStreak);
    el.quickRules.hidden = !rulesOpen;
    el.ruleTake.textContent = t('ruleTake');
    el.ruleFox.textContent = t('ruleFox');
    el.ruleGoal.textContent = t(m.misere ? 'ruleLose' : 'ruleWin');
    el.moveLog.textContent = moveMessageText();
    el.choice.hidden = !waitingChoice;
    el.setupBox.hidden = !m.setup;
    el.setupOut.textContent = el.setupCount.value;
    el.glasses.disabled = !glassesUnlocked;
    el.replayBtn.disabled = history.length <= 1;
    const moodKey = foxState === 'think' ? 'foxThink' : foxState === 'smug' ? 'foxSmug' : foxState === 'sad' ? 'foxSad' : 'foxIdle';
    el.foxMood.textContent = t(moodKey);
    el.fox.className = `fox ${foxState}`;
    const canTake = !over && !moving && !waitingChoice && turn !== 'fox';
    el.takes.forEach((btn) => {
      const n = Number(btn.dataset.take);
      btn.textContent = t('takeButton')(n);
      btn.setAttribute('aria-label', t('takeButton')(n));
      btn.hidden = n > m.max;
      btn.disabled = !canTake || n > stones;
      btn.classList.toggle('best', Boolean(canTake && el.glasses.checked && n === bestTake(stones) && !isPit(stones)));
    });
    renderStones();
    const b = bestTake(stones);
    const pit = Math.max(0, stones - b);
    if (over) el.coach.textContent = resultMessage();
    else if (moving) el.coach.textContent = moveMessageText();
    else if (waitingChoice) el.coach.textContent = t('chooseFirst');
    else if (turn === 'fox') el.coach.textContent = t('waitFox');
    else if (m.setup) el.coach.textContent = t('rabbitAsk');
    else if (games === 0 && history.length === 1) el.coach.textContent = t('firstTakeTip')(m.max, m.misere);
    else if (el.glasses.checked && canTake) el.coach.textContent = isPit(stones) ? t('noBest') : t('bestTip')(b, pit);
    else el.coach.textContent = t('takeTip')(m.max);
  }

  function showReplay() {
    el.resultEmoji.textContent = lastWinner === 'human' ? '🏆' : '🦊';
    el.resultTitle.textContent = t('replayTitle');
    el.resultText.textContent = resultMessage();
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
    setMoveMessage(who === 'fox' ? 'foxStarts' : 'startMove');
    render();
    if (turn === 'fox') {
      const token = roundToken;
      setTimeout(() => foxMove(token), 550);
    }
  }

  el.takes.forEach((button) => {
    const count = Number(button.dataset.take);
    button.addEventListener('click', () => humanMove(count));
    button.addEventListener('pointerenter', () => previewPick(count));
    button.addEventListener('pointerleave', clearPreview);
    button.addEventListener('focus', () => previewPick(count));
    button.addEventListener('blur', clearPreview);
  });
  el.humanFirst.addEventListener('click', () => chooseFirst('human'));
  el.foxFirst.addEventListener('click', () => chooseFirst('fox'));
  el.newRound.addEventListener('click', () => newRound());
  el.replayBtn.addEventListener('click', showReplay);
  el.closeReplay.addEventListener('click', () => { el.replay.hidden = true; });
  el.again.addEventListener('click', () => { el.replay.hidden = true; newRound(); });
  el.dismissRules.addEventListener('click', () => {
    rulesOpen = false;
    save.rulesSeen = true;
    persist();
    render();
    window.cool?.track('dismiss-how-to-play');
  });
  el.rulesBtn.addEventListener('click', () => {
    rulesOpen = true;
    render();
  });
  el.glasses.addEventListener('change', render);
  el.setupCount.addEventListener('input', () => { el.setupOut.textContent = el.setupCount.value; if (mode().setup && over) newRound(); });
  addEventListener('resize', () => { cssVar('--ink'); render(); });
  addEventListener('themechange', () => { cssVar('--paper'); render(); });

  /* ============================ 启动 ============================ */
  newRound();
  applyTheme();
  applyLang();
})();
