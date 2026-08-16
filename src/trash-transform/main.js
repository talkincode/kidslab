(() => {
  'use strict';

  const SOUND_KEY = 'kidslab.sound.muted';
  const SAVE_KEY = 'kidslab.trash-transform';

  const I18N = {
    zh: {
      doc: '垃圾变形记 · KidsLab',
      back: '返回平台',
      title: '垃圾变形记',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      shiftLabel: '班次',
      sorted: '已变形',
      conveyor: '传送带',
      incoming: '下一件废品',
      hint: '轻提示',
      podsLabel: '变形舱',
      choosePod: '按材料投放',
      codex: '变身图鉴',
      shiftNav: '回收班次',
      lockedShift: '先完成前一班',
      shiftLabelFull: (n, title) => `第 ${n} 班：${title}`,
      finalKicker: '三班回收任务完成',
      finalTitle: '变形工厂开足马力！',
      finalText: '你按材料分拣废品，让塑料、金属、纸张、玻璃和厨余各自找到新生命。',
      playAgain: '再开一班流水线',
      beltEmpty: '本班废品全变形啦！点下一班继续。',
      beltDoneAll: '三班任务全部完成！工厂墙上的图鉴亮起来了。',
      holdHint: '废品已拿起。点一个变形舱放进去。',
      dropCancel: '先点传送带上的废品，或把它拖进变形舱。',
      lockedPod: '这一班还没开放这个变形舱。',
      materials: {
        plastic: { name: '塑料舱', hint: '瓶子、盒盖一类' },
        metal: { name: '金属舱', hint: '易拉罐、铁皮' },
        paper: { name: '纸张舱', hint: '报纸、纸盒' },
        glass: { name: '玻璃舱', hint: '罐子、瓶罐' },
        organic: { name: '堆肥舱', hint: '果皮菜叶' },
      },
      items: {
        bottle: '塑料瓶',
        cap: '塑料瓶盖',
        can: '易拉罐',
        foil: '铝箔餐盒',
        newspaper: '旧报纸',
        carton: '纸盒',
        jar: '玻璃罐',
        glassBottle: '玻璃瓶',
        banana: '香蕉皮',
        leaves: '菜叶',
      },
      tags: {
        recyclable: '可回收',
        compost: '可堆肥',
      },
      transforms: {
        plastic: '塑料瓶熔成纤维，织出抓绒外套！',
        metal: '易拉罐回炉，重生为自行车架！',
        paper: '废纸打浆，变成崭新绘本！',
        glass: '碎玻璃重熔，吹成新瓶子！',
        organic: '果皮菜叶堆肥，变成肥沃黑土！',
      },
      codexNames: {
        plastic: '抓绒外套',
        metal: '自行车架',
        paper: '新绘本',
        glass: '新玻璃瓶',
        organic: '黑土养分',
      },
      shifts: [
        {
          kicker: '第一班 · 新手分拣',
          title: '按材料把废品送进变形舱',
          ready: '点废品，丢进舱。',
          lesson: '同一类材料才能一起进变形舱，分对了才会变身。',
          hint: '先看废品是塑料、金属还是纸。瓶子去塑料舱，罐子去金属舱。',
          done: '第一班完成！塑料、金属和纸张都找到了新去处。',
        },
        {
          kicker: '第二班 · 玻璃入厂',
          title: '别把玻璃瓶扔进塑料舱',
          ready: '玻璃瓶走玻璃舱。',
          lesson: '玻璃看起来像塑料，但它更重、会碎，要单独回收重熔。',
          hint: '玻璃罐和玻璃瓶进玻璃舱；塑料瓶仍然进塑料舱。',
          done: '第二班完成！玻璃也成功重生成新瓶子。',
        },
        {
          kicker: '第三班 · 堆肥上线',
          title: '厨余也能变形',
          ready: '果皮去堆肥舱。',
          lesson: '厨余不是垃圾终点：堆肥后会变成能养土壤的养分。',
          hint: '香蕉皮和菜叶走堆肥；其余仍按塑料、金属、纸、玻璃分。',
          done: '第三班完成！可回收物和厨余都各自变形成功。',
        },
      ],
      wrong: {
        plastic: '这件不是塑料。塑料舱只收瓶子、盖子这类塑料。',
        metal: '这件不是金属。金属舱喜欢易拉罐和铝箔。',
        paper: '这件不是纸。纸张舱收报纸和纸盒。',
        glass: '这件不是玻璃。玻璃舱收罐子和玻璃瓶。',
        organic: '这件不是厨余。堆肥舱只收果皮菜叶。',
      },
      nextShift: '进入下一班',
      shiftCompleteTitle: '本班清仓完成！',
    },
    en: {
      doc: 'Trash Transformers · KidsLab',
      back: 'Back to platform',
      title: 'Trash Transformers',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      shiftLabel: 'Shift',
      sorted: 'Transformed',
      conveyor: 'Conveyor',
      incoming: 'Next scrap',
      hint: 'Hint',
      podsLabel: 'Transform pods',
      choosePod: 'Sort by material',
      codex: 'Transform codex',
      shiftNav: 'Recycling shifts',
      lockedShift: 'Finish the previous shift first',
      shiftLabelFull: (n, title) => `Shift ${n}: ${title}`,
      finalKicker: 'All three shifts complete',
      finalTitle: 'The transform factory is roaring!',
      finalText: 'You sorted by material so plastic, metal, paper, glass, and food scraps each found a new life.',
      playAgain: 'Run the line again',
      beltEmpty: 'This shift is clear! Continue to the next shift.',
      beltDoneAll: 'All three shifts done! The wall codex is glowing.',
      holdHint: 'Scrap picked up. Tap a transform pod to drop it in.',
      dropCancel: 'Pick the scrap on the belt, or drag it into a pod.',
      lockedPod: 'This pod is not open on this shift yet.',
      materials: {
        plastic: { name: 'Plastic pod', hint: 'Bottles and caps' },
        metal: { name: 'Metal pod', hint: 'Cans and foil' },
        paper: { name: 'Paper pod', hint: 'News and cartons' },
        glass: { name: 'Glass pod', hint: 'Jars and bottles' },
        organic: { name: 'Compost pod', hint: 'Peels and greens' },
      },
      items: {
        bottle: 'Plastic bottle',
        cap: 'Plastic cap',
        can: 'Aluminum can',
        foil: 'Foil tray',
        newspaper: 'Newspaper',
        carton: 'Cardboard box',
        jar: 'Glass jar',
        glassBottle: 'Glass bottle',
        banana: 'Banana peel',
        leaves: 'Veggie leaves',
      },
      tags: {
        recyclable: 'Recyclable',
        compost: 'Compostable',
      },
      transforms: {
        plastic: 'The bottle melts into fiber and becomes a fleece jacket!',
        metal: 'The can is remelted into a bicycle frame!',
        paper: 'The scrap is pulped into a brand-new picture book!',
        glass: 'Crushed glass is melted and blown into a new bottle!',
        organic: 'Peels and leaves compost into rich dark soil!',
      },
      codexNames: {
        plastic: 'Fleece jacket',
        metal: 'Bike frame',
        paper: 'New book',
        glass: 'New glass bottle',
        organic: 'Garden soil',
      },
      shifts: [
        {
          kicker: 'Shift 1 · Rookie sort',
          title: 'Send each scrap into the right material pod',
          ready: 'Pick scrap. Drop it in a pod.',
          lesson: 'Only matching materials share a pod. Sort right to transform.',
          hint: 'Look for plastic, metal, or paper. Bottles go plastic; cans go metal.',
          done: 'Shift 1 clear! Plastic, metal, and paper all found new jobs.',
        },
        {
          kicker: 'Shift 2 · Glass online',
          title: 'Do not drop glass into the plastic pod',
          ready: 'Glass bottles go in the glass pod.',
          lesson: 'Glass can look like plastic, but it is heavier and recycles by remelting alone.',
          hint: 'Glass jars and bottles go to glass. Plastic bottles still go to plastic.',
          done: 'Shift 2 clear! Glass transformed into new bottles too.',
        },
        {
          kicker: 'Shift 3 · Compost line',
          title: 'Food scraps can transform too',
          ready: 'Peels go in compost.',
          lesson: 'Food scraps are not the end: compost turns them into soil food.',
          hint: 'Banana peels and leaves go to compost; everything else still sorts by material.',
          done: 'Shift 3 clear! Recyclables and organics each transformed.',
        },
      ],
      wrong: {
        plastic: 'Not plastic. This pod only takes bottles, caps, and similar plastics.',
        metal: 'Not metal. This pod wants cans and foil.',
        paper: 'Not paper. This pod takes newspapers and cardboard.',
        glass: 'Not glass. This pod takes jars and glass bottles.',
        organic: 'Not food scraps. Compost only takes peels and leaves.',
      },
      nextShift: 'Start next shift',
      shiftCompleteTitle: 'Shift cleared!',
    },
  };

  const MATERIALS = [
    { id: 'plastic', icon: '🧴', product: '🧥', unlockShift: 0 },
    { id: 'metal', icon: '🥫', product: '🚲', unlockShift: 0 },
    { id: 'paper', icon: '📰', product: '📖', unlockShift: 0 },
    { id: 'glass', icon: '🫙', product: '🍾', unlockShift: 1 },
    { id: 'organic', icon: '🍌', product: '🌱', unlockShift: 2 },
  ];

  const SHIFTS = [
    {
      pods: ['plastic', 'metal', 'paper'],
      queue: ['bottle', 'can', 'newspaper', 'cap'],
    },
    {
      pods: ['plastic', 'metal', 'paper', 'glass'],
      queue: ['jar', 'foil', 'carton', 'glassBottle', 'bottle'],
    },
    {
      pods: ['plastic', 'metal', 'paper', 'glass', 'organic'],
      queue: ['banana', 'can', 'leaves', 'newspaper', 'jar', 'cap'],
    },
  ];

  const ITEM_META = {
    bottle: { material: 'plastic', icon: '🧴', tag: 'recyclable' },
    cap: { material: 'plastic', icon: '🔵', tag: 'recyclable' },
    can: { material: 'metal', icon: '🥫', tag: 'recyclable' },
    foil: { material: 'metal', icon: '📦', tag: 'recyclable' },
    newspaper: { material: 'paper', icon: '📰', tag: 'recyclable' },
    carton: { material: 'paper', icon: '📦', tag: 'recyclable' },
    jar: { material: 'glass', icon: '🫙', tag: 'recyclable' },
    glassBottle: { material: 'glass', icon: '🍾', tag: 'recyclable' },
    banana: { material: 'organic', icon: '🍌', tag: 'compost' },
    leaves: { material: 'organic', icon: '🥬', tag: 'compost' },
  };

  const els = {
    soundBtn: document.getElementById('soundBtn'),
    themeBtn: document.getElementById('themeBtn'),
    langBtn: document.getElementById('langBtn'),
    shiftNumber: document.getElementById('shiftNumber'),
    shiftKicker: document.getElementById('shiftKicker'),
    shiftTitle: document.getElementById('shiftTitle'),
    status: document.getElementById('status'),
    progressText: document.getElementById('progressText'),
    shiftNav: document.getElementById('shiftNav'),
    hintBtn: document.getElementById('hintBtn'),
    belt: document.getElementById('belt'),
    scrap: document.getElementById('scrap'),
    scrapIcon: document.getElementById('scrapIcon'),
    scrapName: document.getElementById('scrapName'),
    scrapTag: document.getElementById('scrapTag'),
    beltEmpty: document.getElementById('beltEmpty'),
    beltEmptyText: document.getElementById('beltEmptyText'),
    transformStage: document.getElementById('transformStage'),
    transformFrom: document.getElementById('transformFrom'),
    transformTo: document.getElementById('transformTo'),
    transformText: document.getElementById('transformText'),
    lessonText: document.getElementById('lessonText'),
    podGrid: document.getElementById('podGrid'),
    codexList: document.getElementById('codexList'),
    codexCount: document.getElementById('codexCount'),
    completeModal: document.getElementById('completeModal'),
    playAgainBtn: document.getElementById('playAgainBtn'),
  };

  let t = (key) => key;
  let audioContext = null;
  let muted = false;
  let transformTimer = 0;
  let jamTimer = 0;

  const state = {
    shift: 0,
    unlocked: 0,
    completedShifts: [],
    queue: [],
    sorted: 0,
    total: 0,
    held: false,
    counts: Object.fromEntries(MATERIALS.map((m) => [m.id, 0])),
    codex: [],
    finished: false,
    drag: null,
    coachLesson: false,
  };

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
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

  function tone(freq, duration, type, gainValue, delay = 0) {
    const ctx = ensureAudio();
    if (!ctx || muted) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playSound(kind) {
    if (muted) return;
    if (kind === 'tap') tone(520, 0.08, 'triangle', 0.03);
    else if (kind === 'pick') {
      tone(480, 0.07, 'sine', 0.035);
      tone(640, 0.09, 'triangle', 0.03, 0.04);
    } else if (kind === 'good') {
      tone(523, 0.11, 'sine', 0.05);
      tone(659, 0.13, 'sine', 0.045, 0.08);
      tone(784, 0.16, 'triangle', 0.04, 0.15);
    } else if (kind === 'bad') {
      tone(210, 0.14, 'sawtooth', 0.03);
      tone(160, 0.16, 'triangle', 0.025, 0.05);
    } else if (kind === 'transform') {
      tone(392, 0.1, 'sine', 0.04);
      tone(523, 0.12, 'triangle', 0.04, 0.08);
      tone(784, 0.16, 'sine', 0.035, 0.18);
    } else if (kind === 'win') {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, 'sine', 0.045, i * 0.09));
    }
  }

  function setMuted(next) {
    muted = next;
    try {
      localStorage.setItem(SOUND_KEY, muted ? '1' : '0');
    } catch {
      /* ignore */
    }
    syncSoundButton();
  }

  function syncSoundButton() {
    if (!els.soundBtn) return;
    els.soundBtn.textContent = muted ? '🔇' : '🔊';
    els.soundBtn.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
    els.soundBtn.setAttribute('aria-pressed', String(muted));
  }

  function track(name) {
    try {
      window.cool?.track?.(name);
    } catch {
      /* ignore */
    }
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        shift: state.shift,
        unlocked: state.unlocked,
        completedShifts: state.completedShifts,
        queue: state.queue,
        sorted: state.sorted,
        counts: state.counts,
        codex: state.codex,
        finished: state.finished,
      }));
    } catch {
      /* ignore */
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return;
      if (Number.isInteger(data.shift)) state.shift = Math.max(0, Math.min(SHIFTS.length - 1, data.shift));
      if (Number.isInteger(data.unlocked)) state.unlocked = Math.max(0, Math.min(SHIFTS.length - 1, data.unlocked));
      if (Array.isArray(data.completedShifts)) state.completedShifts = data.completedShifts.filter((n) => n >= 0 && n < SHIFTS.length);
      if (Array.isArray(data.queue)) state.queue = data.queue.filter((id) => ITEM_META[id]);
      if (Number.isInteger(data.sorted)) state.sorted = Math.max(0, data.sorted);
      if (data.counts && typeof data.counts === 'object') {
        MATERIALS.forEach((m) => {
          if (Number.isFinite(data.counts[m.id])) state.counts[m.id] = Math.max(0, data.counts[m.id] | 0);
        });
      }
      if (Array.isArray(data.codex)) state.codex = data.codex.filter((id) => MATERIALS.some((m) => m.id === id));
      state.finished = Boolean(data.finished);
    } catch {
      /* ignore */
    }
  }

  function currentItemId() {
    return state.queue[0] || null;
  }

  function currentMeta() {
    const id = currentItemId();
    return id ? ITEM_META[id] : null;
  }

  function shiftCopy() {
    return t('shifts')[state.shift];
  }

  function setStatus(text) {
    els.status.textContent = text;
  }

  function clearHeld() {
    state.held = false;
    els.scrap.classList.remove('is-held', 'is-dragging');
    els.scrap.setAttribute('aria-grabbed', 'false');
    els.scrap.style.left = '';
    els.scrap.style.top = '';
    els.scrap.style.width = '';
    document.querySelectorAll('.pod.is-hot').forEach((node) => node.classList.remove('is-hot'));
  }

  function showTransform(materialId, itemId) {
    const material = MATERIALS.find((m) => m.id === materialId);
    const item = ITEM_META[itemId];
    if (!material || !item) return;
    window.clearTimeout(transformTimer);
    els.transformFrom.textContent = item.icon;
    els.transformTo.textContent = material.product;
    els.transformText.textContent = t('transforms')[materialId];
    els.transformStage.hidden = false;
    transformTimer = window.setTimeout(() => {
      els.transformStage.hidden = true;
    }, 2200);
  }

  function unlockCodex(materialId) {
    if (state.codex.includes(materialId)) return;
    state.codex.push(materialId);
    track('codex');
  }

  function renderCodex() {
    els.codexList.innerHTML = '';
    MATERIALS.forEach((material) => {
      const unlocked = state.codex.includes(material.id);
      const chip = document.createElement('div');
      chip.className = `codex-chip${unlocked ? '' : ' is-locked'}`;
      chip.innerHTML = `<span aria-hidden="true">${unlocked ? material.product : '❔'}</span><span>${unlocked ? t('codexNames')[material.id] : '???'}</span>`;
      els.codexList.appendChild(chip);
    });
    els.codexCount.textContent = `${state.codex.length}/${MATERIALS.length}`;
  }

  function renderPods() {
    const openPods = new Set(SHIFTS[state.shift].pods);
    els.podGrid.innerHTML = '';
    MATERIALS.forEach((material) => {
      const open = openPods.has(material.id);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pod';
      btn.dataset.material = material.id;
      btn.disabled = !open;
      btn.setAttribute('aria-label', t('materials')[material.id].name);
      btn.innerHTML = `
        <span class="pod__icon" aria-hidden="true">${material.icon}</span>
        <span class="pod__copy">
          <strong>${t('materials')[material.id].name}</strong>
          <small>${open ? t('materials')[material.id].hint : t('lockedPod')}</small>
        </span>
        <span class="pod__count" aria-hidden="true">${state.counts[material.id]}</span>
      `;
      if (open) {
        btn.addEventListener('click', () => sortInto(material.id));
        btn.addEventListener('pointerenter', () => {
          if (state.held) btn.classList.add('is-hot');
        });
        btn.addEventListener('pointerleave', () => btn.classList.remove('is-hot'));
      }
      els.podGrid.appendChild(btn);
    });
  }

  function renderShiftNav() {
    els.shiftNav.innerHTML = '';
    els.shiftNav.setAttribute('aria-label', t('shiftNav'));
    SHIFTS.forEach((_, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const title = t('shifts')[index].kicker;
      btn.textContent = `${index + 1}. ${title.split('·')[0].trim()}`;
      btn.setAttribute('aria-label', typeof t('shiftLabelFull') === 'function' ? t('shiftLabelFull')(index + 1, title) : title);
      if (index === state.shift) btn.setAttribute('aria-current', 'true');
      const locked = index > state.unlocked && !state.completedShifts.includes(index);
      btn.disabled = locked;
      if (locked) btn.title = t('lockedShift');
      btn.addEventListener('click', () => {
        if (index === state.shift) return;
        playSound('tap');
        enterShift(index, { preserveQueue: index === state.shift });
      });
      els.shiftNav.appendChild(btn);
    });
  }

  function renderScrap() {
    const itemId = currentItemId();
    const meta = currentMeta();
    if (!itemId || !meta) {
      els.scrap.hidden = true;
      els.beltEmpty.hidden = false;
      const allDone = state.completedShifts.length >= SHIFTS.length;
      els.beltEmptyText.textContent = allDone ? t('beltDoneAll') : t('beltEmpty');
      return;
    }
    els.beltEmpty.hidden = true;
    els.scrap.hidden = false;
    els.scrapIcon.textContent = meta.icon;
    els.scrapName.textContent = t('items')[itemId];
    els.scrapTag.textContent = t('tags')[meta.tag];
    els.scrap.setAttribute('aria-label', t('items')[itemId]);
  }

  function renderBrief() {
    const copy = shiftCopy();
    els.shiftNumber.textContent = String(state.shift + 1).padStart(2, '0');
    els.shiftKicker.textContent = copy.kicker;
    els.shiftTitle.textContent = copy.title;
    els.progressText.textContent = `${state.sorted}/${state.total}`;
    els.lessonText.textContent = copy.lesson;
    els.lessonText.hidden = !state.coachLesson;
  }

  function render() {
    renderBrief();
    renderShiftNav();
    renderPods();
    renderScrap();
    renderCodex();
    syncSoundButton();
    if (els.themeBtn) els.themeBtn.setAttribute('aria-label', t('themeLabel'));
    if (state.finished) els.completeModal.hidden = false;
    else els.completeModal.hidden = true;
  }

  function enterShift(index, { preserveQueue = false, announce = true } = {}) {
    state.shift = index;
    state.unlocked = Math.max(state.unlocked, index);
    state.held = false;
    state.drag = null;
    state.coachLesson = false;
    clearHeld();
    els.transformStage.hidden = true;
    const plan = SHIFTS[index];
    state.total = plan.queue.length;
    if (!preserveQueue || !state.queue.length) {
      const alreadyDone = state.completedShifts.includes(index);
      state.queue = alreadyDone ? [] : plan.queue.slice();
      state.sorted = alreadyDone ? state.total : state.total - state.queue.length;
    } else {
      state.sorted = Math.max(0, state.total - state.queue.length);
    }
    if (announce) setStatus(shiftCopy().ready);
    window.cool?.stage?.(`shift${index + 1}`);
    save();
    render();
  }

  function markShiftComplete() {
    if (!state.completedShifts.includes(state.shift)) {
      state.completedShifts.push(state.shift);
    }
    state.unlocked = Math.max(state.unlocked, Math.min(SHIFTS.length - 1, state.shift + 1));
    setStatus(shiftCopy().done);
    track('shift_clear');

    if (state.completedShifts.length >= SHIFTS.length) {
      state.finished = true;
      playSound('win');
      window.cool?.complete?.();
      track('complete');
      els.completeModal.hidden = false;
      window.setTimeout(() => els.playAgainBtn?.focus(), 30);
    } else {
      playSound('good');
    }
    save();
    render();
  }

  function sortInto(materialId) {
    const itemId = currentItemId();
    const meta = currentMeta();
    if (!itemId || !meta) {
      setStatus(t('dropCancel'));
      playSound('bad');
      return;
    }
    if (!SHIFTS[state.shift].pods.includes(materialId)) {
      setStatus(t('lockedPod'));
      playSound('bad');
      return;
    }

    const podBtn = els.podGrid.querySelector(`[data-material="${materialId}"]`);
    if (meta.material !== materialId) {
      playSound('bad');
      track('sort_wrong');
      setStatus(t('wrong')[materialId]);
      state.coachLesson = true;
      els.lessonText.hidden = false;
      state.held = true;
      els.scrap.classList.add('is-held');
      els.scrap.setAttribute('aria-grabbed', 'true');
      els.belt.classList.add('is-jam');
      podBtn?.classList.add('is-error');
      window.clearTimeout(jamTimer);
      jamTimer = window.setTimeout(() => {
        els.belt.classList.remove('is-jam');
        podBtn?.classList.remove('is-error');
      }, 420);
      save();
      return;
    }

    // correct
    state.queue.shift();
    state.sorted += 1;
    state.counts[materialId] += 1;
    unlockCodex(materialId);
    clearHeld();
    playSound('transform');
    track('sort_ok');
    showTransform(materialId, itemId);
    podBtn?.classList.add('is-success');
    window.setTimeout(() => podBtn?.classList.remove('is-success'), 450);
    setStatus(t('transforms')[materialId]);
    state.coachLesson = true;
    save();
    renderScrap();
    renderPods();
    renderCodex();
    renderBrief();

    if (!state.queue.length) {
      window.setTimeout(() => markShiftComplete(), 450);
    }
  }

  function toggleHold() {
    if (!currentItemId()) return;
    state.held = !state.held;
    if (state.held) {
      els.scrap.classList.add('is-held');
      els.scrap.setAttribute('aria-grabbed', 'true');
      setStatus(t('holdHint'));
      playSound('pick');
      track('pick');
    } else {
      clearHeld();
      setStatus(shiftCopy().ready);
      playSound('tap');
    }
  }

  function startDrag(event) {
    if (!currentItemId()) return;
    if (event.button != null && event.button !== 0) return;
    const rect = els.scrap.getBoundingClientRect();
    state.drag = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      moved: false,
      originX: event.clientX,
      originY: event.clientY,
    };
    state.held = true;
    els.scrap.classList.add('is-held');
    els.scrap.setAttribute('aria-grabbed', 'true');
    try {
      els.scrap.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    playSound('pick');
    track('pick');
    setStatus(t('holdHint'));
  }

  function moveDrag(event) {
    if (!state.drag || state.drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - state.drag.originX;
    const dy = event.clientY - state.drag.originY;
    if (Math.hypot(dx, dy) > 6) state.drag.moved = true;
    if (!state.drag.moved) return;
    els.scrap.classList.add('is-dragging');
    els.scrap.style.width = `${state.drag.width}px`;
    els.scrap.style.left = `${event.clientX - state.drag.offsetX}px`;
    els.scrap.style.top = `${event.clientY - state.drag.offsetY}px`;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const pod = target?.closest?.('.pod:not(:disabled)');
    document.querySelectorAll('.pod.is-hot').forEach((node) => {
      if (node !== pod) node.classList.remove('is-hot');
    });
    pod?.classList.add('is-hot');
  }

  function endDrag(event) {
    if (!state.drag || state.drag.pointerId !== event.pointerId) return;
    const moved = state.drag.moved;
    const x = event.clientX;
    const y = event.clientY;
    state.drag = null;
    els.scrap.classList.remove('is-dragging');
    els.scrap.style.left = '';
    els.scrap.style.top = '';
    els.scrap.style.width = '';
    try {
      els.scrap.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }

    const target = document.elementFromPoint(x, y);
    const pod = target?.closest?.('.pod:not(:disabled)');
    document.querySelectorAll('.pod.is-hot').forEach((node) => node.classList.remove('is-hot'));
    if (pod?.dataset.material) {
      sortInto(pod.dataset.material);
      return;
    }
    // Tap selects; drag-cancel outside keeps selection for tap-to-pod.
    state.held = true;
    els.scrap.classList.add('is-held');
    els.scrap.setAttribute('aria-grabbed', 'true');
    setStatus(moved ? t('holdHint') : t('holdHint'));
  }

  function onHint() {
    playSound('tap');
    state.coachLesson = true;
    els.lessonText.hidden = false;
    setStatus(shiftCopy().hint);
    track('hint');
  }

  function playAgain() {
    playSound('tap');
    state.shift = 0;
    state.unlocked = 0;
    state.completedShifts = [];
    state.counts = Object.fromEntries(MATERIALS.map((m) => [m.id, 0]));
    state.codex = [];
    state.finished = false;
    state.queue = [];
    state.sorted = 0;
    els.completeModal.hidden = true;
    enterShift(0);
    track('replay');
  }

  function bind() {
    els.langBtn?.addEventListener('click', () => window.cool.preferences.toggleLang());
    els.themeBtn?.addEventListener('click', () => window.cool.preferences.toggleTheme());
    els.soundBtn?.addEventListener('click', () => {
      setMuted(!muted);
      if (!muted) playSound('tap');
    });
    els.hintBtn?.addEventListener('click', onHint);
    els.playAgainBtn?.addEventListener('click', playAgain);

    els.scrap.addEventListener('pointerdown', startDrag);
    els.scrap.addEventListener('pointermove', moveDrag);
    els.scrap.addEventListener('pointerup', endDrag);
    els.scrap.addEventListener('pointercancel', endDrag);
    els.scrap.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleHold();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && audioContext && audioContext.state === 'running') {
        audioContext.suspend().catch(() => {});
      }
    });
  }

  function boot() {
    try {
      muted = localStorage.getItem(SOUND_KEY) === '1';
    } catch {
      muted = false;
    }
    load();
    bind();

    window.cool.bindI18n(I18N, {
      onChange({ t: translate, lang, theme }) {
        t = translate;
        document.title = t('doc');
        if (els.langBtn) els.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
        if (els.themeBtn) els.themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
        document.documentElement.style.setProperty('--accent-live', cssVar('--accent'));
        render();
        if (!els.status.dataset.locked) {
          /* keep latest status if set; only fill default when empty */
        }
      },
    });

    if (!state.queue.length && !state.completedShifts.includes(state.shift) && !state.finished) {
      enterShift(state.shift);
    } else {
      state.total = SHIFTS[state.shift].queue.length;
      if (!state.queue.length && state.completedShifts.includes(state.shift)) {
        state.sorted = state.total;
      } else {
        state.sorted = Math.max(0, state.total - state.queue.length);
      }
      setStatus(state.finished ? t('beltDoneAll') : shiftCopy().ready);
      render();
      if (state.finished) els.completeModal.hidden = false;
    }

    window.cool?.stage?.('start');
  }

  boot();
})();
