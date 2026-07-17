(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '📦 神秘盒子 · KidsLab',
      back: '返回平台',
      title: '神秘盒子',
      caseFile: '五感侦探档案',
      mission: '盒子里是什么？找线索，再选择！',
      round: '回合',
      boxNote: '禁止偷看 · ONLY CLUES',
      listen: '听一听',
      touch: '摸一摸',
      smell: '闻一闻',
      shadow: '照剪影',
      suspectFile: '嫌疑物图鉴',
      pickOne: '证据指向谁？',
      remaining: '还在',
      newCase: '换一个盒子',
      solved: '破案',
      nextCase: '下一只神秘盒子 →',
      emptyEvidence: '待取证',
      start: '点一种感官，看谁被证据排除。',
      boxHint: '先不能开盒！小侦探要用证据说话。',
      ready: '只剩一个嫌疑物了！点它提交你的答案。',
      magic: '沙沙声 + 刺刺的触感——两条证据一起指向刺猬！',
      eliminated: (count) => `这条证据排除了 ${count} 个嫌疑物。继续取证，或点一个猜猜看！`,
      noElimination: '这条证据暂时没排除谁。换一种感官，证据会更清楚。',
      wrong: (name) => `不是${name}！它“咚”地跳出嫌疑名单。证据还在，继续找。`,
      winTitle: (name) => `是${name}！`,
      winText: (count) => count <= 2
        ? `只用 ${count} 条证据就锁定目标，超级观察员！`
        : `你把 ${count} 条证据拼在一起，找到了最可靠的答案。`,
      idle: '小提示：同一种特征可能属于两个物品，试着组合两条不同证据。',
      sensorNames: { sound: '声音', touch: '触感', smell: '气味', shadow: '剪影' },
      traits: {
        rustle: '沙沙',
        quiet: '静静的',
        ring: '叮当',
        jingle: '哗啦',
        squeak: '吱吱',
        spiky: '刺刺',
        bumpy: '凹凸',
        cool: '冰凉',
        smooth: '光滑',
        soft: '软软',
        earth: '泥土味',
        sweet: '甜香',
        none: '没气味',
        metal: '金属味',
        rubber: '橡胶味',
        fabric: '布料味',
        citrus: '橘子香',
        forest: '松林味',
        round: '圆滚滚',
        crown: '尖叶冠',
        dome: '小圆顶',
        teeth: '锯齿边',
        duck: '鸭嘴形',
        ears: '长耳朵',
        ball: '圆球形',
        cone: '小锥形',
      },
      objects: ['刺猬', '菠萝', '铃铛', '钥匙', '橡皮鸭', '布老鼠', '橙子', '松果'],
    },
    en: {
      doc: '📦 Mystery Box · KidsLab',
      back: 'Back',
      title: 'Mystery Box',
      caseFile: 'Senses detective file',
      mission: 'What is inside? Gather clues, then choose!',
      round: 'Round',
      boxNote: 'NO PEEKING · ONLY CLUES',
      listen: 'Listen',
      touch: 'Touch',
      smell: 'Smell',
      shadow: 'Shadow',
      suspectFile: 'Suspect collection',
      pickOne: 'Who fits the clues?',
      remaining: 'left',
      newCase: 'Switch the box',
      solved: 'SOLVED',
      nextCase: 'Next mystery box →',
      emptyEvidence: 'waiting',
      start: 'Pick a sense. Watch suspects drop out.',
      boxHint: 'No peeking yet! A detective needs evidence.',
      ready: 'Only one suspect remains. Tap it to submit your answer!',
      magic: 'Rustling + spiky — those two clues point straight to the hedgehog!',
      eliminated: (count) => `That clue eliminated ${count} suspect${count === 1 ? '' : 's'}. Gather more evidence or make a guess!`,
      noElimination: 'This clue did not eliminate anyone yet. Try another sense.',
      wrong: (name) => `Not the ${name}! It tumbles off the suspect board. Keep investigating.`,
      winTitle: (name) => `It is the ${name}!`,
      winText: (count) => count <= 2
        ? `Only ${count} clues needed — super observation!`
        : `You combined ${count} clues to reach the most reliable answer.`,
      idle: 'Hint: two objects can share one trait. Combine clues from different senses.',
      sensorNames: { sound: 'Sound', touch: 'Touch', smell: 'Smell', shadow: 'Shape' },
      traits: {
        rustle: 'rustle',
        quiet: 'quiet',
        ring: 'ring',
        jingle: 'jingle',
        squeak: 'squeak',
        spiky: 'spiky',
        bumpy: 'bumpy',
        cool: 'cool',
        smooth: 'smooth',
        soft: 'soft',
        earth: 'earthy',
        sweet: 'sweet',
        none: 'no smell',
        metal: 'metallic',
        rubber: 'rubbery',
        fabric: 'fabric',
        citrus: 'citrus',
        forest: 'piney',
        round: 'round',
        crown: 'leafy crown',
        dome: 'small dome',
        teeth: 'jagged edge',
        duck: 'duck shape',
        ears: 'long ears',
        ball: 'ball shape',
        cone: 'cone shape',
      },
      objects: ['hedgehog', 'pineapple', 'bell', 'keys', 'rubber duck', 'toy mouse', 'orange', 'pine cone'],
    },
  };

  const OBJECTS = [
    { icon: '🦔', sound: 'rustle', touch: 'spiky', smell: 'earth', shadow: 'round' },
    { icon: '🍍', sound: 'quiet', touch: 'spiky', smell: 'sweet', shadow: 'crown' },
    { icon: '🔔', sound: 'ring', touch: 'cool', smell: 'none', shadow: 'dome' },
    { icon: '🔑', sound: 'jingle', touch: 'cool', smell: 'metal', shadow: 'teeth' },
    { icon: '🦆', sound: 'squeak', touch: 'smooth', smell: 'rubber', shadow: 'duck' },
    { icon: '🐭', sound: 'squeak', touch: 'soft', smell: 'fabric', shadow: 'ears' },
    { icon: '🍊', sound: 'quiet', touch: 'bumpy', smell: 'citrus', shadow: 'ball' },
    { icon: '🌲', sound: 'rustle', touch: 'bumpy', smell: 'forest', shadow: 'cone' },
  ];

  const SENSOR_META = {
    sound: { button: 'listen', icon: '👂', clueIcon: { rustle: '🍂', quiet: '🤫', ring: '🎵', jingle: '🎶', squeak: '〰️' } },
    touch: { button: 'touch', icon: '✋', clueIcon: { spiky: '✳️', bumpy: '🔘', cool: '❄️', smooth: '💧', soft: '☁️' } },
    smell: { button: 'smell', icon: '👃', clueIcon: { earth: '🌱', sweet: '🍯', none: '➖', metal: '⚙️', rubber: '⭕', fabric: '🧶', citrus: '🍊', forest: '🌲' } },
    shadow: { button: 'shadow', icon: '🔦', clueIcon: { round: '●', crown: '♛', dome: '◠', teeth: '〽️', duck: '🦆', ears: '⌁', ball: '⚫', cone: '▲' } },
  };

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
    round: 1,
    secret: 0,
    used: new Set(),
    alive: new Set(OBJECTS.map((_, index) => index)),
    wrong: new Set(),
    solved: false,
    muted: false,
    stars: 3,
    message: null,
    messageKind: '',
    idleTimer: 0,
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  const objectName = (index) => t('objects')[index];
  const secret = () => OBJECTS[state.secret];
  const traitLabel = (trait) => t('traits')[trait] || trait;

  const els = {
    lab: $('#lab'),
    box: $('#mysteryBox'),
    inside: $('#boxInside'),
    evidence: $('#evidenceRack'),
    sensors: $('#sensorDock'),
    suspects: $('#suspectGrid'),
    remaining: $('#remainingText'),
    stars: $('#stars'),
    round: $('#roundText'),
    mission: $('#missionText'),
    narrator: $('#narrator'),
    win: $('#win'),
    winEmoji: $('#winEmoji'),
    winTitle: $('#winTitle'),
    winText: $('#winText'),
    winStars: $('#winStars'),
    confetti: $('#confetti'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
  };

  let audio = null;
  function ensureAudio() {
    if (state.muted) return null;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      return audio;
    } catch {
      return null;
    }
  }

  function tone(frequency, duration = 0.12, delay = 0, type = 'sine', gainValue = 0.08, endFrequency = null) {
    const context = ensureAudio();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + delay;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    gain.gain.setValueAtTime(gainValue, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  function noise(duration = 0.32) {
    const context = ensureAudio();
    if (!context) return;
    const frames = Math.floor(context.sampleRate * duration);
    const buffer = context.createBuffer(1, frames, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < frames; index += 1) {
      const envelope = Math.sin(Math.PI * index / frames);
      data[index] = (Math.random() * 2 - 1) * envelope;
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    gain.gain.value = 0.07;
    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
  }

  function playSoundTrait(trait) {
    if (trait === 'rustle') noise();
    if (trait === 'quiet') tone(180, 0.05, 0, 'sine', 0.025);
    if (trait === 'ring') [784, 1175].forEach((frequency, index) => tone(frequency, 0.32, index * 0.09, 'sine', 0.1));
    if (trait === 'jingle') [660, 880, 740].forEach((frequency, index) => tone(frequency, 0.14, index * 0.07, 'triangle', 0.085));
    if (trait === 'squeak') tone(420, 0.28, 0, 'square', 0.055, 980);
  }

  function playProbe(sensor) {
    els.box.classList.remove('is-rattling');
    void els.box.offsetWidth;
    els.box.classList.add('is-rattling');
    setTimeout(() => els.box.classList.remove('is-rattling'), 600);
    if (sensor === 'sound') playSoundTrait(secret().sound);
    if (sensor === 'touch') {
      const patterns = { spiky: [35, 30, 35, 30, 35], bumpy: [80, 45, 80], cool: [180], smooth: [45], soft: [25, 70, 25] };
      try {
        if (!navigator.userActivation || navigator.userActivation.isActive) {
          navigator.vibrate?.(patterns[secret().touch] || 50);
        }
      } catch {}
      tone(320, 0.08, 0, 'triangle', 0.05);
    }
    if (sensor === 'smell') {
      tone(260, 0.18, 0, 'sine', 0.04, 390);
      tone(390, 0.18, 0.13, 'sine', 0.035, 520);
    }
    if (sensor === 'shadow') {
      els.lab.classList.add('is-shadowing');
      tone(520, 0.07, 0, 'square', 0.045);
      setTimeout(() => els.lab.classList.remove('is-shadowing'), 850);
    }
  }

  function setMessage(messageFactory, kind = '') {
    state.message = messageFactory;
    state.messageKind = kind;
    resetIdleHint();
  }

  function calculateStars() {
    const clueCost = Math.max(0, state.used.size - 2);
    state.stars = Math.max(1, 3 - clueCost - state.wrong.size);
  }

  function renderEvidence() {
    els.evidence.innerHTML = Object.entries(SENSOR_META).map(([sensor, meta]) => {
      const used = state.used.has(sensor);
      const trait = secret()[sensor];
      const icon = used ? meta.clueIcon[trait] : '❔';
      const label = used ? traitLabel(trait) : t('emptyEvidence');
      return `<div class="evidence${used ? '' : ' is-empty'}">
        <span class="evidence__icon">${icon}</span>
        <span><b>${label}</b><small>${t('sensorNames')[sensor]}</small></span>
      </div>`;
    }).join('');
  }

  function renderSuspects() {
    const oneLeft = state.alive.size === 1;
    els.suspects.innerHTML = OBJECTS.map((object, index) => {
      const alive = state.alive.has(index);
      const classes = [
        'suspect',
        alive ? '' : 'is-eliminated',
        state.wrong.has(index) ? 'is-wrong' : '',
        alive && oneLeft ? 'is-last' : '',
      ].filter(Boolean).join(' ');
      return `<button class="${classes}" type="button" data-guess="${index}" ${alive && !state.solved ? '' : 'disabled'}>
        <span class="suspect__icon">${object.icon}</span><b>${objectName(index)}</b>
      </button>`;
    }).join('');
  }

  function render() {
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
    els.round.textContent = String(state.round);
    els.mission.textContent = t('mission');
    els.stars.textContent = '★'.repeat(state.stars) + '☆'.repeat(3 - state.stars);
    els.remaining.textContent = String(state.alive.size);
    els.narrator.textContent = state.message ? state.message() : t('start');
    els.narrator.className = `narrator${state.messageKind ? ` is-${state.messageKind}` : ''}`;
    els.inside.textContent = secret().icon;
    els.lab.classList.toggle('is-solved', state.solved);
    renderEvidence();
    renderSuspects();
    $$('.sensor').forEach((button) => {
      button.disabled = state.used.has(button.dataset.sensor) || state.solved;
    });
  }

  function probe(sensor) {
    if (state.solved || state.used.has(sensor) || !SENSOR_META[sensor]) return;
    state.used.add(sensor);
    playProbe(sensor);
    const before = state.alive.size;
    OBJECTS.forEach((object, index) => {
      if (state.alive.has(index) && object[sensor] !== secret()[sensor]) state.alive.delete(index);
    });
    const removed = before - state.alive.size;
    calculateStars();
    const hedgehogMagic = state.secret === 0 && state.used.has('sound') && state.used.has('touch');
    if (hedgehogMagic) setMessage(() => t('magic'), 'good');
    else if (state.alive.size === 1) setMessage(() => t('ready'), 'good');
    else if (removed) setMessage(() => t('eliminated')(removed));
    else setMessage(() => t('noElimination'));
    window.cool?.track('probe', { sensor, remaining: state.alive.size });
    render();
  }

  function guess(index) {
    if (state.solved || !state.alive.has(index)) return;
    if (index === state.secret) {
      solve();
      return;
    }
    state.wrong.add(index);
    state.alive.delete(index);
    calculateStars();
    els.box.classList.remove('is-wrong');
    void els.box.offsetWidth;
    els.box.classList.add('is-wrong');
    setTimeout(() => els.box.classList.remove('is-wrong'), 520);
    [190, 145].forEach((frequency, order) => tone(frequency, 0.13, order * 0.08, 'sawtooth', 0.06));
    setMessage(() => t('wrong')(objectName(index)), 'warn');
    if (state.alive.size === 1) setTimeout(() => {
      if (!state.solved) {
        setMessage(() => t('ready'), 'good');
        render();
      }
    }, 900);
    window.cool?.track('wrong_guess', { clues: state.used.size });
    render();
  }

  function celebrate() {
    const symbols = ['✦', '★', '🔎', '✨', '●'];
    els.confetti.innerHTML = Array.from({ length: 30 }, (_, index) => {
      const left = (index * 37) % 100;
      const delay = (index % 8) * 0.07;
      const drift = `${(index % 2 ? 1 : -1) * (25 + (index * 13) % 90)}px`;
      return `<i style="left:${left}%;animation-delay:${delay}s;--drift:${drift}">${symbols[index % symbols.length]}</i>`;
    }).join('');
    setTimeout(() => { els.confetti.innerHTML = ''; }, 2300);
  }

  function solve() {
    state.solved = true;
    calculateStars();
    els.lab.classList.add('is-solved');
    [523, 659, 784, 1047].forEach((frequency, index) => tone(frequency, 0.22, index * 0.09, 'triangle', 0.08));
    setMessage(() => t('winTitle')(objectName(state.secret)), 'good');
    render();
    celebrate();
    setTimeout(() => {
      els.winEmoji.textContent = secret().icon;
      els.winTitle.textContent = t('winTitle')(objectName(state.secret));
      els.winText.textContent = t('winText')(state.used.size);
      els.winStars.textContent = '★'.repeat(state.stars) + '☆'.repeat(3 - state.stars);
      els.win.hidden = false;
    }, 680);
    window.cool?.stage(`solved_round_${state.round}`);
    window.cool?.complete?.();
    window.cool?.track('solve', { clues: state.used.size, stars: state.stars });
  }

  function chooseSecret() {
    if (state.round === 1) return 0;
    let next = state.secret;
    if (globalThis.crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      while (next === state.secret) {
        crypto.getRandomValues(values);
        next = values[0] % OBJECTS.length;
      }
      return next;
    }
    return (state.secret + 3) % OBJECTS.length;
  }

  function newCase(advance = true) {
    if (advance) state.round += 1;
    state.secret = chooseSecret();
    state.used = new Set();
    state.alive = new Set(OBJECTS.map((_, index) => index));
    state.wrong = new Set();
    state.solved = false;
    state.stars = 3;
    state.message = null;
    state.messageKind = '';
    els.win.hidden = true;
    els.lab.classList.remove('is-solved', 'is-shadowing');
    render();
    resetIdleHint();
  }

  function resetIdleHint() {
    clearTimeout(state.idleTimer);
    state.idleTimer = setTimeout(() => {
      if (!state.solved) {
        state.message = () => t('idle');
        state.messageKind = '';
        render();
      }
    }, 20000);
  }

  els.sensors.addEventListener('click', (event) => {
    const button = event.target.closest('[data-sensor]');
    if (button) probe(button.dataset.sensor);
  });
  els.suspects.addEventListener('click', (event) => {
    const button = event.target.closest('[data-guess]');
    if (button) guess(Number(button.dataset.guess));
  });
  els.box.addEventListener('click', () => {
    if (!state.solved) {
      setMessage(() => t('boxHint'));
      els.box.classList.add('is-rattling');
      setTimeout(() => els.box.classList.remove('is-rattling'), 600);
      render();
    }
  });
  $('#newCaseBtn').addEventListener('click', () => newCase(true));
  $('#nextBtn').addEventListener('click', () => newCase(true));
  els.sound.addEventListener('click', () => {
    state.muted = !state.muted;
    if (audio) {
      if (state.muted && audio.state === 'running') audio.suspend();
      if (!state.muted && audio.state === 'suspended') audio.resume();
    }
    render();
  });
  els.lang.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    store.set(LS.lang, lang);
    render();
    resetIdleHint();
  });
  els.theme.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set(LS.theme, theme);
    render();
  });
  addEventListener('keydown', (event) => {
    if (event.key >= '1' && event.key <= '4') {
      probe(Object.keys(SENSOR_META)[Number(event.key) - 1]);
    }
    if (event.key === 'Escape' && !els.win.hidden) els.win.hidden = true;
  });

  setMessage(() => t('start'));
  render();
  resetIdleHint();
})();
