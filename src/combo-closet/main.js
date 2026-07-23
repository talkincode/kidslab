(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '搭配衣橱 · KidsLab',
      back: '返回平台',
      title: '搭配衣橱',
      eyebrow: '羊驼造型工作室',
      tip: '把帽子和上衣穿到小驼身上，拍齐所有不重样的搭配。',
      mission: '今日造型单',
      hatRack: '帽子架',
      topRack: '上衣架',
      dragTip: '点一点或拖过去，给小驼穿上',
      order: '📦 提交进货单',
      orderTip: '两张不一样的进货单都盖章，就完成大订单！',
      hint: '💡 给我一点提示',
      reset: '重新开始',
      soundOn: '关闭音效',
      soundOff: '开启音效',
      themeDark: '切换深色主题',
      themeLight: '切换浅色主题',
      showReady: '时装秀战报',
      stockHats: '进几顶不同的帽子？',
      stockTops: '进几件不同的上衣？',
      targetSign: '🎯 目标 12 套',
      levels: ['试衣间', '花园秀', '大订单'],
      missions: ['拍齐 2 × 2 = 4 套造型', '拍齐 3 × 2 = 6 套造型', '设计两张 12 套进货单'],
      hats: {
        straw: '草帽',
        beret: '贝雷帽',
        party: '派对帽',
        top: '小礼帽',
        cloud: '云朵帽',
      },
      tops: {
        star: '星星上衣',
        rainbow: '彩虹上衣',
        flower: '花朵上衣',
        dot: '波点上衣',
      },
      start: '先给小驼戴上一顶帽子吧！',
      needTop: '帽子真帅！再来一件上衣。',
      needHat: '上衣真好看！再来一顶帽子。',
      found: (count, total) => `咔嚓！新造型上墙，还差 ${total - count} 套。`,
      duplicate: (hat, top) => `「${hat} + ${top}」已经上墙啦！换一样再拍。`,
      collectHint: (count) => count
        ? `已经拍到 ${count} 套。固定一顶帽子，把剩下的上衣轮流试完。`
        : '先固定一顶帽子，把每件上衣都试一遍，再换下一顶帽子。',
      stockStart: '大订单要 12 套不重样！选好两个数，格子刚好摆满 12 格。',
      stockLow: (hats, tops, product, target) => `${hats} × ${tops} = ${product} 套，还差 ${target - product} 套，把数字调大一点！`,
      stockHigh: (hats, tops, product, target) => `${hats} × ${tops} = ${product} 套，多了 ${product - target} 套，把数字调小一点！`,
      stockFirst: (hats, tops) => `${hats} × ${tops} = 12，第一张进货单盖章！再找一张数字不一样的。`,
      stockDup: '这张进货单已经盖过章啦！换一组数字，乘出来还是 12。',
      stockDone: (hats, tops) => `${hats} × ${tops} = 12，两张进货单都盖章啦！`,
      stockHint: '哪两个 2 到 6 的数相乘等于 12？盖章一张后，交换两个数再试试！',
      idleHint: '固定一个选择，按顺序换另一个，就不会漏掉啦。',
      formula: (hats, tops, total) => `${hats} 顶帽子 × ${tops} 件上衣 = ${total} 套`,
      stockFormula: (hats, tops, total) => `${hats} × ${tops} = ${total} 套`,
      orderCard: (index) => `进货单 ${index}`,
      completeTitles: ['四套造型全部上墙！', '六套造型全部上墙！', '两张进货单都盖章啦！'],
      completeTexts: [
        '2 顶帽子，每顶都能配 2 件上衣：2 × 2 = 4 套。照片墙的每一枝，就是一套不重样的搭配。',
        '3 顶帽子，每顶都能配 2 件上衣：3 × 2 = 6 套。顺着树枝一枝枝拍，不重复也不漏掉。',
        '3 × 4、4 × 3、2 × 6、6 × 2 都能配出 12 套。交换两个因数，乘积不变！',
      ],
      next: '下一张造型单',
      replay: '重新开秀',
      locked: '先完成前一张造型单',
      hatsCount: (count) => `${count} 顶帽子`,
      topsCount: (count) => `${count} 件上衣`,
      wallLabel: '搭配树照片墙',
      gridLabel: (hats, tops) => `进货格子：${hats} 行 × ${tops} 列`,
      modelLabel: '小羊驼模特',
      photoOf: (hat, top) => `${hat} + ${top}`,
    },
    en: {
      doc: 'Combo Closet · KidsLab',
      back: 'Back to platform',
      title: 'Combo Closet',
      eyebrow: 'Alpaca Styling Studio',
      tip: 'Dress the alpaca in hats and tops. Snap every different outfit!',
      mission: 'Today’s style card',
      hatRack: 'Hat rack',
      topRack: 'Top rack',
      dragTip: 'Tap or drag onto the alpaca',
      order: '📦 Send the stock order',
      orderTip: 'Stamp two different stock orders to finish the big job!',
      hint: '💡 Give me a hint',
      reset: 'Restart',
      soundOn: 'Mute sound',
      soundOff: 'Turn sound on',
      themeDark: 'Switch to dark theme',
      themeLight: 'Switch to light theme',
      showReady: 'Runway report',
      stockHats: 'How many different hats?',
      stockTops: 'How many different tops?',
      targetSign: '🎯 Goal: 12 looks',
      levels: ['Fitting Room', 'Garden Show', 'Big Order'],
      missions: ['Snap all 2 × 2 = 4 outfits', 'Snap all 3 × 2 = 6 outfits', 'Design two orders for 12 looks'],
      hats: {
        straw: 'Straw hat',
        beret: 'Beret',
        party: 'Party hat',
        top: 'Top hat',
        cloud: 'Cloud hat',
      },
      tops: {
        star: 'Star top',
        rainbow: 'Rainbow top',
        flower: 'Flower top',
        dot: 'Polka-dot top',
      },
      start: 'Put a hat on the alpaca first!',
      needTop: 'Nice hat! Now add a top.',
      needHat: 'Nice top! Now add a hat.',
      found: (count, total) => `Snap! A new look is on the wall. ${total - count} to go.`,
      duplicate: (hat, top) => `“${hat} + ${top}” is already on the wall! Change one thing.`,
      collectHint: (count) => count
        ? `You have ${count}. Keep one hat on and try every remaining top.`
        : 'Keep one hat on, try every top, then switch hats.',
      stockStart: 'The big order needs 12 different looks. Pick two numbers that fill exactly 12 boxes.',
      stockLow: (hats, tops, product, target) => `${hats} × ${tops} = ${product}. ${target - product} short — make a number bigger!`,
      stockHigh: (hats, tops, product, target) => `${hats} × ${tops} = ${product}. ${product - target} too many — make a number smaller!`,
      stockFirst: (hats, tops) => `${hats} × ${tops} = 12. First order stamped! Find one with different numbers.`,
      stockDup: 'That order is already stamped! Pick different numbers that still make 12.',
      stockDone: (hats, tops) => `${hats} × ${tops} = 12. Both orders are stamped!`,
      stockHint: 'Which two numbers from 2 to 6 multiply to 12? After one order, swap the numbers and try again!',
      idleHint: 'Fix one choice and change the other in order — no look gets missed.',
      formula: (hats, tops, total) => `${hats} hats × ${tops} tops = ${total} looks`,
      stockFormula: (hats, tops, total) => `${hats} × ${tops} = ${total} looks`,
      orderCard: (index) => `Order ${index}`,
      completeTitles: ['All four looks are on the wall!', 'All six looks are on the wall!', 'Both orders are stamped!'],
      completeTexts: [
        'Each of 2 hats pairs with 2 tops: 2 × 2 = 4 outfits. Every branch photo on the wall is one unique look.',
        'Each of 3 hats pairs with 2 tops: 3 × 2 = 6 outfits. Following the branches prevents repeats and gaps.',
        '3 × 4, 4 × 3, 2 × 6 and 6 × 2 all make 12 looks. Swapping the two factors never changes the product!',
      ],
      next: 'Next style card',
      replay: 'Run the show again',
      locked: 'Finish the previous style card first',
      hatsCount: (count) => `${count} hats`,
      topsCount: (count) => `${count} tops`,
      wallLabel: 'Outfit-tree photo wall',
      gridLabel: (hats, tops) => `Stock grid: ${hats} rows × ${tops} columns`,
      modelLabel: 'Alpaca model',
      photoOf: (hat, top) => `${hat} + ${top}`,
    },
  };

  const HAT_IDS = ['straw', 'beret', 'party', 'top', 'cloud'];
  const TOP_IDS = ['star', 'rainbow', 'flower', 'dot'];
  const LEVELS = [
    { mode: 'collect', hats: ['straw', 'beret'], tops: ['star', 'rainbow'] },
    { mode: 'collect', hats: ['party', 'top', 'cloud'], tops: ['flower', 'dot'] },
    { mode: 'stock', target: 12, ordersNeeded: 2 },
  ];

  const $ = (selector) => document.querySelector(selector);
  const SAVE_KEY = 'kidslab.combo-closet';
  const MUTE_KEY = 'kidslab.sound.muted';
  const saved = (() => {
    try {
      const value = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  })();
  const reducedMotion = (() => {
    try {
      return matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  })();

  const el = {
    lang: $('#langBtn'),
    theme: $('#themeBtn'),
    sound: $('#soundBtn'),
    stamp: $('#orderStamp'),
    levels: $('#levelStrip'),
    mission: $('#missionTitle'),
    reset: $('#resetBtn'),
    collect: $('#collectGame'),
    stock: $('#stockGame'),
    hats: $('#hatChoices'),
    tops: $('#topChoices'),
    stage: $('#alpacaStage'),
    alpaca: $('#alpacaSvg'),
    hatUse: $('#alpacaHatUse'),
    topUse: $('#alpacaTopUse'),
    flash: $('#cameraFlash'),
    orderGrid: $('#orderGrid'),
    orderCount: $('#orderCount'),
    hatStock: $('#hatStock'),
    topStock: $('#topStock'),
    order: $('#orderBtn'),
    feedback: $('#feedback'),
    stylist: $('#stylistFace'),
    tree: $('#comboTree'),
    formula: $('#formula'),
    hint: $('#hintBtn'),
    modal: $('#modal'),
    modalTitle: $('#modalTitle'),
    modalText: $('#modalText'),
    modalConfetti: $('#modalConfetti'),
    celebration: $('#celebration'),
    next: $('#nextBtn'),
  };

  let t = (key, ...args) => key;
  let lang = window.cool.preferences.lang;
  let theme = window.cool.preferences.theme;
  let levelIndex = Math.min(2, Math.max(0, Number(saved.level) || 0));
  let unlocked = Math.min(2, Math.max(levelIndex, Number(saved.unlocked) || 0));
  let wornHat = null;
  let wornTop = null;
  let currentKey = null;
  let discovered = new Set();
  let stockHats = 2;
  let stockTops = 2;
  let foundOrders = [];
  let completed = false;
  let idleTimer = 0;
  let muted = false;
  let audioContext = null;
  const leafRefs = new Map();
  const rackRefs = { hat: new Map(), top: new Map() };

  try {
    muted = localStorage.getItem(MUTE_KEY) === 'true';
  } catch {
    muted = false;
  }

  /* ---------- audio ---------- */

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

  function tone(kind) {
    const ac = ensureAudio();
    if (!ac) return;
    const patterns = {
      pop: [[392, 0, 0.07, 0.05, 'sine'], [523, 0.05, 0.09, 0.05, 'sine']],
      shutter: [[1500, 0, 0.035, 0.05, 'square'], [98, 0.03, 0.09, 0.08, 'sine']],
      chime: [[523, 0.06, 0.09, 0.06, 'sine'], [659, 0.15, 0.14, 0.07, 'sine']],
      wah: [[233, 0, 0.13, 0.055, 'square'], [175, 0.12, 0.18, 0.05, 'square']],
      tick: [[880, 0, 0.03, 0.04, 'sine']],
      stamp: [[262, 0, 0.08, 0.07, 'sine'], [392, 0.07, 0.11, 0.07, 'sine']],
      fanfare: [[392, 0, 0.11, 0.06, 'sine'], [523, 0.1, 0.11, 0.07, 'sine'], [659, 0.2, 0.12, 0.07, 'sine'], [784, 0.3, 0.22, 0.08, 'sine']],
    };
    const now = ac.currentTime;
    for (const [frequency, offset, duration, volume, type] of patterns[kind] || patterns.pop) {
      const oscillator = ac.createOscillator();
      const gain = ac.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(volume, now + offset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
      oscillator.connect(gain).connect(ac.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration + 0.02);
    }
  }

  function updateSoundButton() {
    el.sound.textContent = muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', String(muted));
    el.sound.setAttribute('aria-label', t(muted ? 'soundOff' : 'soundOn'));
    el.sound.title = t(muted ? 'soundOff' : 'soundOn');
  }

  /* ---------- helpers ---------- */

  function level() {
    return LEVELS[levelIndex];
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ level: levelIndex, unlocked }));
    } catch {
      // Progress persistence is optional; the current session remains playable.
    }
  }

  function setFeedback(message, face = '🦙') {
    el.feedback.textContent = message;
    el.stylist.textContent = face;
  }

  function scheduleIdleHint() {
    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      if (!completed && el.modal.hidden) setFeedback(t(level().mode === 'stock' ? 'stockHint' : 'idleHint'), '💡');
    }, 30000);
  }

  function outfitKey(hat, top) {
    return `${hat}:${top}`;
  }

  function totalLooks(current = level()) {
    return current.mode === 'collect' ? current.hats.length * current.tops.length : current.target;
  }

  function hatThumb(id) {
    return `<svg class="thumb" viewBox="0 0 88 64" aria-hidden="true"><use href="#sym-hat-${id}"></use></svg>`;
  }

  function topThumb(id) {
    return `<svg class="thumb thumb--top" viewBox="0 0 108 86" aria-hidden="true"><use href="#sym-top-${id}"></use></svg>`;
  }

  function comboArt(hat, top) {
    return `<svg class="combo-art" viewBox="0 0 96 118" aria-hidden="true"><use href="#sym-top-${top}" x="-6" y="42" width="108" height="86"></use><use href="#sym-hat-${hat}" x="8" y="-2" width="80" height="58"></use></svg>`;
  }

  function popStamp() {
    el.stamp.parentElement.classList.remove('is-pop');
    void el.stamp.parentElement.offsetWidth;
    el.stamp.parentElement.classList.add('is-pop');
  }

  function playAlpaca(mood) {
    el.alpaca.classList.remove('is-happy', 'is-sad');
    void el.alpaca.getBoundingClientRect();
    el.alpaca.classList.add(mood);
    window.setTimeout(() => el.alpaca.classList.remove(mood), 700);
  }

  function flashCamera() {
    el.flash.classList.remove('is-on');
    void el.flash.offsetWidth;
    el.flash.classList.add('is-on');
  }

  /* ---------- dressing ---------- */

  function renderAlpaca() {
    const current = level();
    if (current.mode !== 'collect') return;
    if (wornHat) {
      el.hatUse.setAttribute('href', `#sym-hat-${wornHat}`);
      el.hatUse.removeAttribute('hidden');
    } else {
      el.hatUse.setAttribute('hidden', '');
    }
    if (wornTop) {
      el.topUse.setAttribute('href', `#sym-top-${wornTop}`);
      el.topUse.removeAttribute('hidden');
    } else {
      el.topUse.setAttribute('hidden', '');
    }
    el.alpaca.classList.toggle('hint-hat', !wornHat);
    el.alpaca.classList.toggle('hint-top', !wornTop);
    const hatName = wornHat ? t('hats')[wornHat] : '—';
    const topName = wornTop ? t('tops')[wornTop] : '—';
    el.alpaca.setAttribute('aria-label', `${t('modelLabel')}: ${hatName}, ${topName}`);
    for (const [id, button] of rackRefs.hat) {
      button.classList.toggle('is-selected', id === wornHat);
      button.setAttribute('aria-pressed', String(id === wornHat));
    }
    for (const [id, button] of rackRefs.top) {
      button.classList.toggle('is-selected', id === wornTop);
      button.setAttribute('aria-pressed', String(id === wornTop));
    }
  }

  function equip(type, id) {
    if (completed || level().mode !== 'collect') return;
    if (type === 'hat') {
      if (wornHat === id) return;
      wornHat = id;
    } else {
      if (wornTop === id) return;
      wornTop = id;
    }
    tone('pop');
    window.cool.track(type === 'hat' ? 'choose_hat' : 'choose_top');
    renderAlpaca();
    scheduleIdleHint();

    if (!wornHat || !wornTop) {
      setFeedback(t(wornHat ? 'needTop' : 'needHat'), '✨');
      return;
    }
    const key = outfitKey(wornHat, wornTop);
    if (key === currentKey) return;
    currentKey = key;
    checkOutfit(key);
  }

  function checkOutfit(key) {
    const total = totalLooks();
    if (discovered.has(key)) {
      tone('wah');
      playAlpaca('is-sad');
      setFeedback(t('duplicate', t('hats')[wornHat], t('tops')[wornTop]), '🙈');
      const leaf = leafRefs.get(key);
      if (leaf) {
        leaf.classList.remove('is-wiggle');
        void leaf.offsetWidth;
        leaf.classList.add('is-wiggle');
      }
      window.cool.track('retry_duplicate_outfit');
      return;
    }

    discovered.add(key);
    tone('shutter');
    tone('chime');
    flashCamera();
    playAlpaca('is-happy');
    setFeedback(t('found', discovered.size, total), '📸');
    popStamp();
    window.cool.track('discover_outfit');
    flyPhotoToWall(key);
    renderProgress();

    if (discovered.size === total) {
      completed = true;
      clearTimeout(idleTimer);
      window.setTimeout(() => tone('fanfare'), 450);
      window.setTimeout(showCompletion, 950);
    }
  }

  function revealLeaf(key) {
    const leaf = leafRefs.get(key);
    if (leaf) leaf.classList.add('is-found');
  }

  function flyPhotoToWall(key) {
    const leaf = leafRefs.get(key);
    if (!leaf || reducedMotion) {
      revealLeaf(key);
      return;
    }
    const from = el.alpaca.getBoundingClientRect();
    const to = leaf.getBoundingClientRect();
    const size = { w: 72, h: 88 };
    const start = {
      x: from.left + from.width / 2 - size.w / 2,
      y: from.top + from.height * 0.32 - size.h / 2,
    };
    const photo = document.createElement('div');
    photo.className = 'fly-photo';
    photo.innerHTML = comboArt(wornHat, wornTop);
    photo.style.width = `${size.w}px`;
    photo.style.height = `${size.h}px`;
    photo.style.left = `${start.x}px`;
    photo.style.top = `${start.y}px`;
    document.body.appendChild(photo);
    void photo.offsetWidth;
    const scale = Math.max(0.3, Math.min(1, to.width / size.w));
    photo.style.transform = `translate(${to.left + to.width / 2 - (start.x + size.w / 2)}px, ${to.top + to.height / 2 - (start.y + size.h / 2)}px) scale(${scale}) rotate(6deg)`;
    photo.style.opacity = '0.25';
    const finish = () => {
      photo.remove();
      revealLeaf(key);
    };
    photo.addEventListener('transitionend', finish, { once: true });
    window.setTimeout(finish, 700);
  }

  /* ---------- drag & tap ---------- */

  function flyGhost(fromRect, toRect, inner, ghost = null) {
    const node = ghost || document.createElement('div');
    if (!ghost) {
      node.className = 'drag-ghost';
      node.innerHTML = inner;
      node.style.width = `${fromRect.width}px`;
      node.style.height = `${fromRect.height}px`;
      node.style.left = `${fromRect.left}px`;
      node.style.top = `${fromRect.top}px`;
      document.body.appendChild(node);
      void node.offsetWidth;
    }
    node.classList.add('is-flying');
    const base = node.__origin || { x: fromRect.left, y: fromRect.top };
    node.style.transform = `translate(${toRect.left + toRect.width / 2 - (base.x + fromRect.width / 2)}px, ${toRect.top + toRect.height / 2 - (base.y + fromRect.height / 2)}px) scale(0.5)`;
    node.style.opacity = '0';
    const cleanup = () => node.remove();
    node.addEventListener('transitionend', cleanup, { once: true });
    window.setTimeout(cleanup, 500);
  }

  function wearTargetRect(type) {
    const use = type === 'hat' ? el.hatUse : el.topUse;
    const rect = use.getBoundingClientRect();
    if (rect.width > 4) return rect;
    const stage = el.stage.getBoundingClientRect();
    return type === 'hat'
      ? { left: stage.left + stage.width * 0.36, top: stage.top + stage.height * 0.1, width: stage.width * 0.28, height: stage.height * 0.16 }
      : { left: stage.left + stage.width * 0.32, top: stage.top + stage.height * 0.5, width: stage.width * 0.36, height: stage.height * 0.24 };
  }

  function attachDress(button, type, id, thumbHtml) {
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let ghost = null;

    const overStage = (x, y) => {
      const rect = el.stage.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };

    const endDrag = (x, y, cancelled) => {
      el.stage.classList.remove('is-drop-ready');
      if (!ghost) {
        if (!cancelled) {
          tone('pop');
          if (!reducedMotion) flyGhost(button.getBoundingClientRect(), wearTargetRect(type), thumbHtml);
          equip(type, id);
        }
        return;
      }
      const node = ghost;
      ghost = null;
      if (!cancelled && overStage(x, y)) {
        flyGhost(node.getBoundingClientRect(), wearTargetRect(type), '', node);
        equip(type, id);
      } else {
        flyGhost(node.getBoundingClientRect(), button.getBoundingClientRect(), '', node);
      }
    };

    button.addEventListener('pointerdown', (event) => {
      if (completed || level().mode !== 'collect') return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      try {
        button.setPointerCapture(pointerId);
      } catch {
        // Pointer capture is a progressive enhancement; taps still work.
      }
    });
    button.addEventListener('pointermove', (event) => {
      if (event.pointerId !== pointerId) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!ghost && Math.hypot(dx, dy) > 8) {
        ghost = document.createElement('div');
        ghost.className = 'drag-ghost';
        ghost.innerHTML = thumbHtml;
        const rect = button.getBoundingClientRect();
        ghost.style.width = `${rect.width}px`;
        ghost.style.height = `${rect.height}px`;
        ghost.style.left = `${rect.left}px`;
        ghost.style.top = `${rect.top}px`;
        ghost.__origin = { x: rect.left, y: rect.top };
        document.body.appendChild(ghost);
        button.classList.add('is-dragging');
      }
      if (ghost) {
        const rect = button.getBoundingClientRect();
        ghost.style.transform = `translate(${event.clientX - rect.left - rect.width / 2}px, ${event.clientY - rect.top - rect.height / 2}px) scale(1.08)`;
        el.stage.classList.toggle('is-drop-ready', overStage(event.clientX, event.clientY));
      }
    });
    const onUp = (event) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      button.classList.remove('is-dragging');
      endDrag(event.clientX, event.clientY, event.type === 'pointercancel');
    };
    button.addEventListener('pointerup', onUp);
    button.addEventListener('pointercancel', onUp);
    button.addEventListener('click', (event) => {
      // Keyboard activation only; pointer taps are handled on pointerup.
      if (event.detail === 0) equip(type, id);
    });
  }

  /* ---------- stock level ---------- */

  function chooseStock(type, value) {
    if (completed || level().mode !== 'stock') return;
    if (type === 'hat') stockHats = value;
    else stockTops = value;
    tone('pop');
    window.cool.track(type === 'hat' ? 'choose_hat_stock' : 'choose_top_stock');
    scheduleIdleHint();
    renderStock();
    renderProgress();
  }

  function orderFound(hats, tops) {
    return foundOrders.some((order) => order.hats === hats && order.tops === tops);
  }

  function submitOrder() {
    if (completed || level().mode !== 'stock') return;
    const current = level();
    const product = stockHats * stockTops;
    scheduleIdleHint();

    if (product !== current.target) {
      tone('wah');
      el.orderGrid.classList.remove('is-shake');
      void el.orderGrid.offsetWidth;
      el.orderGrid.classList.add('is-shake');
      setFeedback(t(product < current.target ? 'stockLow' : 'stockHigh', stockHats, stockTops, product, current.target), '🧮');
      window.cool.track('retry_stock_order');
      return;
    }
    if (orderFound(stockHats, stockTops)) {
      tone('wah');
      setFeedback(t('stockDup'), '🙈');
      const card = el.tree.querySelector(`[data-order="${stockHats}x${stockTops}"]`);
      if (card) {
        card.classList.remove('is-wiggle');
        void card.offsetWidth;
        card.classList.add('is-wiggle');
      }
      window.cool.track('retry_stock_order');
      return;
    }

    foundOrders.push({ hats: stockHats, tops: stockTops });
    tone('stamp');
    flashCamera();
    popStamp();
    litGridCells();

    if (foundOrders.length >= current.ordersNeeded) {
      completed = true;
      clearTimeout(idleTimer);
      setFeedback(t('stockDone', stockHats, stockTops), '🎉');
      window.cool.track('complete_stock_order');
      renderWall();
      renderProgress();
      window.setTimeout(() => tone('fanfare'), 500);
      window.setTimeout(showCompletion, 1150);
    } else {
      setFeedback(t('stockFirst', stockHats, stockTops), '🎉');
      window.cool.track('stamp_stock_order');
      renderWall();
      renderProgress();
    }
  }

  function litGridCells() {
    const cells = [...el.orderGrid.querySelectorAll('.grid-cell')];
    cells.forEach((cell, index) => {
      if (reducedMotion) {
        cell.classList.add('is-lit');
        return;
      }
      window.setTimeout(() => {
        cell.classList.add('is-lit');
        if (index % 4 === 0) tone('tick');
      }, index * 45);
    });
  }

  function renderStock() {
    const values = [2, 3, 4, 5, 6];
    el.hatStock.innerHTML = values.map((value) =>
      `<button class="number-choice ${stockHats === value ? 'is-selected' : ''}" type="button" data-hat-stock="${value}" aria-label="${t('hatsCount', value)}">${value}</button>`).join('');
    el.topStock.innerHTML = values.map((value) =>
      `<button class="number-choice ${stockTops === value ? 'is-selected' : ''}" type="button" data-top-stock="${value}" aria-label="${t('topsCount', value)}">${value}</button>`).join('');
    el.hatStock.querySelectorAll('[data-hat-stock]').forEach((button) => {
      button.addEventListener('click', () => chooseStock('hat', Number(button.dataset.hatStock)));
    });
    el.topStock.querySelectorAll('[data-top-stock]').forEach((button) => {
      button.addEventListener('click', () => chooseStock('top', Number(button.dataset.topStock)));
    });

    const product = stockHats * stockTops;
    const target = level().target;
    el.orderGrid.style.setProperty('--cols', stockTops);
    el.orderGrid.setAttribute('aria-label', t('gridLabel', stockHats, stockTops));
    const cells = [];
    for (let row = 0; row < stockHats; row += 1) {
      for (let col = 0; col < stockTops; col += 1) {
        cells.push(`<span class="grid-cell">${comboArt(HAT_IDS[row % HAT_IDS.length], TOP_IDS[col % TOP_IDS.length])}</span>`);
      }
    }
    el.orderGrid.innerHTML = cells.join('');
    el.orderCount.textContent = t('stockFormula', stockHats, stockTops, product);
    el.orderCount.className = `order-count ${product === target ? 'is-exact' : product < target ? 'is-low' : 'is-high'}`;
  }

  /* ---------- wall / tree ---------- */

  function renderWall() {
    const current = level();
    el.tree.setAttribute('aria-label', t('wallLabel'));
    leafRefs.clear();

    if (current.mode === 'stock') {
      el.tree.className = 'combo-tree stock-wall';
      el.tree.innerHTML = [0, 1].map((index) => {
        const order = foundOrders[index];
        if (!order) {
          return `<div class="order-card"><span class="order-card__label">${t('orderCard', index + 1)}</span><span class="order-card__body">?</span></div>`;
        }
        return `<div class="order-card is-stamped" data-order="${order.hats}x${order.tops}">
          <span class="order-card__label">${t('orderCard', index + 1)}</span>
          <span class="order-card__body">${t('stockFormula', order.hats, order.tops, order.hats * order.tops)}</span>
          <span class="order-card__stamp" aria-hidden="true">✓</span>
        </div>`;
      }).join('');
      return;
    }

    el.tree.className = 'combo-tree';
    el.tree.innerHTML = current.hats.map((hat) => `
      <div class="tree-branch">
        <span class="branch-hat" title="${t('hats')[hat]}">${hatThumb(hat)}</span>
        <div class="branch-leaves" style="--leaves:${current.tops.length}">
          ${current.tops.map((top) => `
            <span class="leaf" data-key="${outfitKey(hat, top)}" title="${t('photoOf', t('hats')[hat], t('tops')[top])}">
              ${comboArt(hat, top)}
              <span class="leaf-q" aria-hidden="true">?</span>
            </span>`).join('')}
        </div>
      </div>`).join('');
    el.tree.querySelectorAll('.leaf').forEach((leaf) => {
      leafRefs.set(leaf.dataset.key, leaf);
      if (discovered.has(leaf.dataset.key)) leaf.classList.add('is-found');
    });
  }

  /* ---------- flow ---------- */

  function showHint() {
    setFeedback(t(level().mode === 'stock' ? 'stockHint' : 'collectHint', discovered.size), '💡');
    window.cool.track('open_combo_hint');
    scheduleIdleHint();
  }

  function showCompletion() {
    if (levelIndex < LEVELS.length - 1) {
      unlocked = Math.max(unlocked, levelIndex + 1);
      persist();
    } else {
      window.cool.complete?.();
    }
    el.celebration.textContent = levelIndex === 2 ? '📦✨' : levelIndex === 1 ? '🌸🦙🌸' : '📸';
    el.modalTitle.textContent = t('completeTitles')[levelIndex];
    el.modalText.textContent = t('completeTexts')[levelIndex];
    el.next.textContent = levelIndex === LEVELS.length - 1 ? t('replay') : t('next');
    el.modalConfetti.innerHTML = Array.from({ length: 14 }, (_, index) => `<i class="confetti-piece confetti-piece--${index % 7}"></i>`).join('');
    el.modal.hidden = false;
    renderLevels();
  }

  function resetLevel() {
    wornHat = null;
    wornTop = null;
    currentKey = null;
    discovered = new Set();
    stockHats = 2;
    stockTops = 2;
    foundOrders = [];
    completed = false;
    el.modal.hidden = true;
    setFeedback(t(level().mode === 'stock' ? 'stockStart' : 'start'), level().mode === 'stock' ? '📋' : '🦙');
    window.cool.stage(`style-card-${levelIndex + 1}`);
    scheduleIdleHint();
    render();
  }

  function setLevel(index) {
    if (index > unlocked) {
      setFeedback(t('locked'), '🔒');
      return;
    }
    levelIndex = index;
    persist();
    resetLevel();
  }

  function nextLevel() {
    el.modal.hidden = true;
    setLevel(levelIndex === LEVELS.length - 1 ? 0 : levelIndex + 1);
  }

  /* ---------- render ---------- */

  function renderLevels() {
    el.levels.innerHTML = t('levels').map((name, index) => {
      const disabled = index > unlocked;
      const done = index < unlocked || (index === levelIndex && completed);
      return `<button class="level-button ${index === levelIndex ? 'is-active' : ''} ${done ? 'is-done' : ''}" type="button" data-level="${index}" ${disabled ? 'disabled' : ''}>${index + 1}. ${name}</button>`;
    }).join('');
    el.levels.querySelectorAll('[data-level]').forEach((button) => {
      button.addEventListener('click', () => setLevel(Number(button.dataset.level)));
    });
  }

  function buildRacks() {
    const current = level();
    if (current.mode !== 'collect') return;
    rackRefs.hat.clear();
    rackRefs.top.clear();
    el.hats.innerHTML = current.hats.map((hat) =>
      `<button class="choice" type="button" data-hat="${hat}" aria-label="${t('hats')[hat]}" aria-pressed="false">${hatThumb(hat)}</button>`).join('');
    el.tops.innerHTML = current.tops.map((top) =>
      `<button class="choice" type="button" data-top="${top}" aria-label="${t('tops')[top]}" aria-pressed="false">${topThumb(top)}</button>`).join('');
    el.hats.querySelectorAll('[data-hat]').forEach((button) => {
      rackRefs.hat.set(button.dataset.hat, button);
      attachDress(button, 'hat', button.dataset.hat, hatThumb(button.dataset.hat));
    });
    el.tops.querySelectorAll('[data-top]').forEach((button) => {
      rackRefs.top.set(button.dataset.top, button);
      attachDress(button, 'top', button.dataset.top, topThumb(button.dataset.top));
    });
  }

  function renderProgress() {
    const current = level();
    if (current.mode === 'stock') {
      el.stamp.textContent = `${Math.min(foundOrders.length, current.ordersNeeded)} / ${current.ordersNeeded}`;
      el.formula.textContent = t('stockFormula', stockHats, stockTops, stockHats * stockTops);
    } else {
      el.stamp.textContent = `${discovered.size} / ${totalLooks()}`;
      el.formula.textContent = t('formula', current.hats.length, current.tops.length, totalLooks());
    }
  }

  function render() {
    const current = level();
    const isStock = current.mode === 'stock';
    el.collect.hidden = isStock;
    el.stock.hidden = !isStock;
    el.mission.textContent = t('missions')[levelIndex];
    el.reset.setAttribute('aria-label', t('reset'));

    if (isStock) {
      renderStock();
    } else {
      buildRacks();
      renderAlpaca();
    }
    renderProgress();
    renderWall();
    renderLevels();
    updateSoundButton();
  }

  /* ---------- events ---------- */

  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.sound.addEventListener('click', () => {
    muted = !muted;
    try {
      localStorage.setItem(MUTE_KEY, String(muted));
    } catch {
      // Preference persistence is optional.
    }
    if (!muted) tone('pop');
    updateSoundButton();
  });
  el.order.addEventListener('click', submitOrder);
  el.hint.addEventListener('click', showHint);
  el.reset.addEventListener('click', resetLevel);
  el.next.addEventListener('click', nextLevel);

  window.cool.bindI18n(I18N, {
    onChange(context) {
      t = context.t;
      lang = context.lang;
      theme = context.theme;
      document.title = t('doc');
      el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
      el.theme.setAttribute('aria-label', t(theme === 'light' ? 'themeDark' : 'themeLight'));
      render();
    },
  });

  resetLevel();
})();
