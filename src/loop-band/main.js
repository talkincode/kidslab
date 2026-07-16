/* ============================================================
   循环乐队 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '循环乐队 · KidsLab',
      back: '返回平台',
      title: '循环乐队',
      tip0: '拖进音符和循环块，听一听，折叠重复的节奏。',
      eyebrow: 'WebAudio 节拍编程', play: '▶️ 播放', stop: '⏹ 停止', target: '🎧 听样带',
      levels: '闯关', free: '自由', bug: '错拍找 bug', bear: '鼓手', cat: '沙锤', frog: '贝斯', bird: '铃铛',
      blocks: '积木池', dragHint: '点一下添加；也可以拖到乐谱或循环框里。', scoreTitle: '乐谱轨道', clear: '清空', check: '检查', save: '保存', next: '下一关', replay: '再玩一次',
      addTarget: '现在添加到：', root: '主乐谱', loopName: (n) => `循环 ${n} 次`, loopLeft: (n) => `还剩 ${n}`, blockCount: (n) => `${n} 块`,
      perfect: '完全正确！', close: '声音不一样，再听样带找找规律。', freeTip: '自由模式：随便拼，最多保存 3 首小歌。',
      bugTip: '这段乐谱有一个循环次数错了。改对 N，让它和样带一样。', bugWin: '找到了！少一次/多一次就是错拍的 bug。',
      saved: '保存好了！', loaded: '已载入小歌。', empty: '先放几个积木吧。', passTitle: '乐队合拍啦！',
      stars3: '又准又省块，三星乐队！', stars2: '节奏正确，再少用些块可拿三星。', stars1: '节奏对了，继续挑战循环压缩！',
      magicTitle: '魔法时刻：规律被折叠了', magicText: '32 块 → 4 块！播放一模一样，重复的规律像纸扇一样收起来了。',
      l1: '4 个咚', l2: '咚哒循环', l3: '沙锤进来', l4: '贝斯脚步', l5: '叮咚叮咚', l6: '32→4 魔法', l7: '三层感觉', l8: '整首小歌',
      note_boom: '咚', note_clap: '哒', note_shake: '沙', note_bass: '嗡', note_bell: '叮', note_rest: '休', loop: '重复',
    },
    en: {
      doc: 'Loop Band · KidsLab',
      back: 'Back to platform',
      title: 'Loop Band',
      tip0: 'Drag notes and loops, listen, then fold repeating rhythms.',
      eyebrow: 'WebAudio rhythm coding', play: '▶️ Play', stop: '⏹ Stop', target: '🎧 Target',
      levels: 'Levels', free: 'Free', bug: 'Find bug', bear: 'Drums', cat: 'Shaker', frog: 'Bass', bird: 'Bells',
      blocks: 'Blocks', dragHint: 'Tap to add; or drag into the score / loop box.', scoreTitle: 'Score track', clear: 'Clear', check: 'Check', save: 'Save', next: 'Next level', replay: 'Replay',
      addTarget: 'Adding to:', root: 'main score', loopName: (n) => `repeat ${n} ×`, loopLeft: (n) => `${n} left`, blockCount: (n) => `${n} blocks`,
      perfect: 'Perfect match!', close: 'Not the same yet — listen again and spot the pattern.', freeTip: 'Free mode: build anything and save up to 3 songs.',
      bugTip: 'One loop count is wrong. Fix N so it matches the target.', bugWin: 'Bug found! One repeat too few/many made the beat drift.',
      saved: 'Saved!', loaded: 'Song loaded.', empty: 'Add some blocks first.', passTitle: 'The band is in sync!',
      stars3: 'Accurate and tiny: 3-star band!', stars2: 'Correct rhythm. Use fewer blocks for 3 stars.', stars1: 'Rhythm solved — keep compressing loops!',
      magicTitle: 'Magic moment: pattern folded', magicText: '32 blocks → 4 blocks! Same music, with the repeating pattern folded like a fan.',
      l1: '4 booms', l2: 'boom-clap loop', l3: 'shaker joins', l4: 'bass steps', l5: 'ding-boom', l6: '32→4 magic', l7: 'nested groove', l8: 'whole song',
      note_boom: 'boom', note_clap: 'clap', note_shake: 'shh', note_bass: 'bass', note_bell: 'ding', note_rest: 'rest', loop: 'repeat',
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
  const NOTES = {
    boom: { icon: '🥁', animal: 'boom', key: 'note_boom', color: 'note-boom' },
    clap: { icon: '👏', animal: 'clap', key: 'note_clap', color: 'note-clap' },
    shake: { icon: '🌰', animal: 'shake', key: 'note_shake', color: 'note-shake' },
    bass: { icon: '🐸', animal: 'bass', key: 'note_bass', color: 'note-bass' },
    bell: { icon: '🔔', animal: 'bell', key: 'note_bell', color: 'note-bell' },
    rest: { icon: '🤫', animal: 'rest', key: 'note_rest', color: 'note-rest' },
  };
  const LEVELS = [
    { name: 'l1', target: ['boom','boom','boom','boom'], ideal: 2, start: [] },
    { name: 'l2', target: 'boom clap boom clap boom clap boom clap'.split(' '), ideal: 3, start: [] },
    { name: 'l3', target: 'boom clap shake boom clap shake boom clap shake'.split(' '), ideal: 3, start: [] },
    { name: 'l4', target: 'bass boom clap bass boom clap bass boom clap'.split(' '), ideal: 3, start: [] },
    { name: 'l5', target: 'bell boom bell boom bell boom bell boom'.split(' '), ideal: 3, start: [] },
    { name: 'l6', target: Array.from({ length: 4 }, () => 'boom clap boom clap boom clap shake bell'.split(' ')).flat(), ideal: 4, start: [] },
    { name: 'l7', target: Array.from({ length: 2 }, () => 'boom clap boom clap boom clap shake boom clap boom clap boom clap bell'.split(' ')).flat(), ideal: 5, start: [] },
    { name: 'l8', target: 'boom clap shake bell boom clap shake bell boom boom clap rest boom clap shake bell'.split(' '), ideal: 8, start: [] },
  ];
  const BUG_SCORE = [{ type: 'loop', n: 3, children: [{ type: 'loop', n: 2, children: [{ type: 'note', sound: 'boom' }, { type: 'note', sound: 'clap' }] }, { type: 'note', sound: 'shake' }] }];
  const BUG_TARGET = Array.from({ length: 4 }, () => 'boom clap boom clap shake'.split(' ')).flat();
  const SONG_KEY = 'kidslab.loopband.songs.v1';

  const $ = (s) => document.querySelector(s);
  const palette = $('#palette');
  const scoreZone = $('#scoreZone');
  const statusEl = $('#status');
  const playBtn = $('#playBtn');
  const targetBtn = $('#targetBtn');
  const muteBtn = $('#muteBtn');
  const levelStrip = $('#levelStrip');
  const starsEl = $('#stars');
  const freeTools = $('#freeTools');
  const playHead = $('#playHead');
  const targetDots = $('#targetDots');

  let mode = 'levels';
  let levelIndex = 0;
  let score = [];
  let selectedPath = 'root';
  let blockId = 1;
  let activeMap = new Map();
  let soundOn = store.get('kidslab.loopband.sound') !== 'off';
  let audioCtx = null;
  let noiseBuffer = null;
  let scheduler = null;
  let playing = false;
  let playEvents = [];
  let nextEvent = 0;
  let startTime = 0;
  let totalBeats = 1;
  let lastBeat = -1;

  const clone = (obj) => JSON.parse(JSON.stringify(obj));
  const noteBlock = (sound) => ({ type: 'note', sound, id: `b${blockId++}` });
  const loopBlock = () => ({ type: 'loop', n: 2, children: [], id: `b${blockId++}` });

  function ensureIds(blocks) {
    blocks.forEach((b) => {
      b.id = b.id || `b${blockId++}`;
      if (b.children) ensureIds(b.children);
    });
    return blocks;
  }

  function getSongs() {
    try { return JSON.parse(localStorage.getItem(SONG_KEY)) || []; } catch { return []; }
  }
  function setSongs(v) {
    try { localStorage.setItem(SONG_KEY, JSON.stringify(v.slice(0, 3))); } catch { /* ignore */ }
  }

  function startAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const len = audioCtx.sampleRate * 0.35;
      noiseBuffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  function hitAnimal(sound) {
    const animal = document.querySelector(`.animal[data-sound="${sound}"]`) || document.querySelector('.animal[data-sound="shake"]');
    if (!animal) return;
    animal.classList.remove('hit');
    void animal.offsetWidth;
    animal.classList.add('hit');
  }

  function envGain(t0, dur, gain = 0.16) {
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    return g;
  }

  function playSound(sound, when) {
    if (!soundOn || !audioCtx || sound === 'rest') return;
    if (sound === 'boom') {
      const src = audioCtx.createBufferSource();
      const lp = audioCtx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(220, when);
      const g = envGain(when, 0.18, 0.32);
      src.buffer = noiseBuffer; src.connect(lp).connect(g).connect(audioCtx.destination); src.start(when); src.stop(when + 0.22);
      const o = audioCtx.createOscillator(); const og = envGain(when, 0.16, 0.23);
      o.type = 'sine'; o.frequency.setValueAtTime(90, when); o.frequency.exponentialRampToValueAtTime(42, when + 0.12);
      o.connect(og).connect(audioCtx.destination); o.start(when); o.stop(when + 0.18);
    } else if (sound === 'clap' || sound === 'shake') {
      const src = audioCtx.createBufferSource(); const f = audioCtx.createBiquadFilter(); const g = envGain(when, sound === 'clap' ? 0.1 : 0.07, sound === 'clap' ? 0.22 : 0.13);
      f.type = sound === 'clap' ? 'bandpass' : 'highpass'; f.frequency.value = sound === 'clap' ? 1200 : 4500;
      src.buffer = noiseBuffer; src.connect(f).connect(g).connect(audioCtx.destination); src.start(when); src.stop(when + 0.13);
    } else if (sound === 'bell') {
      [1320, 1980].forEach((f, i) => { const o = audioCtx.createOscillator(); const g = envGain(when + i * 0.01, 0.42, 0.1); o.type = 'sine'; o.frequency.value = f; o.connect(g).connect(audioCtx.destination); o.start(when + i * 0.01); o.stop(when + 0.45); });
    } else if (sound === 'bass') {
      const o = audioCtx.createOscillator(); const g = envGain(when, 0.28, 0.2);
      o.type = 'triangle'; o.frequency.setValueAtTime(110, when); o.frequency.exponentialRampToValueAtTime(82, when + 0.24);
      o.connect(g).connect(audioCtx.destination); o.start(when); o.stop(when + 0.3);
    }
  }

  function flatten(blocks, out = [], refs = []) {
    blocks.forEach((b) => {
      if (b.type === 'note') out.push({ sound: b.sound, refs: [...refs, { id: b.id, left: 1 }] });
      else {
        for (let i = 0; i < b.n; i++) flatten(b.children, out, [...refs, { id: b.id, left: b.n - i }]);
      }
    });
    return out;
  }

  function countBlocks(blocks) {
    return blocks.reduce((sum, b) => sum + 1 + (b.children ? countBlocks(b.children) : 0), 0);
  }

  function pathToChildren(path) {
    if (path === 'root') return score;
    const ids = path.split('/');
    let arr = score;
    for (const id of ids) {
      const found = arr.find((b) => b.id === id);
      if (!found || !found.children) return score;
      arr = found.children;
    }
    return arr;
  }

  function childrenPathFor(id, blocks = score, prefix = []) {
    for (const b of blocks) {
      if (b.id === id) return [...prefix, id].join('/');
      if (b.children) {
        const p = childrenPathFor(id, b.children, [...prefix, b.id]);
        if (p) return p;
      }
    }
    return '';
  }

  function addBlock(kind, path = selectedPath) {
    startAudio();
    const arr = pathToChildren(path);
    arr.push(kind === 'loop' ? loopBlock() : noteBlock(kind));
    render();
  }

  function removeBlock(id, blocks = score) {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx >= 0) { blocks.splice(idx, 1); return true; }
    return blocks.some((b) => b.children && removeBlock(id, b.children));
  }

  function setLoopN(id, n, blocks = score) {
    for (const b of blocks) {
      if (b.id === id) { b.n = n; return true; }
      if (b.children && setLoopN(id, n, b.children)) return true;
    }
    return false;
  }

  function renderPalette() {
    palette.innerHTML = '';
    Object.entries(NOTES).forEach(([key, n]) => {
      const el = document.createElement('button');
      el.type = 'button'; el.className = `block ${n.color}`; el.draggable = true; el.dataset.kind = key;
      el.innerHTML = `<span>${n.icon}</span><span>${t(n.key)}</span>`;
      palette.appendChild(el);
    });
    const loop = document.createElement('button');
    loop.type = 'button'; loop.className = 'block loop'; loop.draggable = true; loop.dataset.kind = 'loop';
    loop.innerHTML = `<span>🔁</span><span>${t('loop')}</span>`;
    palette.appendChild(loop);
  }

  function renderBlocks(blocks, zone, path) {
    zone.innerHTML = '';
    zone.dataset.path = path;
    zone.classList.toggle('selected', selectedPath === path);
    blocks.forEach((b) => {
      if (b.type === 'note') {
        const n = NOTES[b.sound];
        const el = document.createElement('div');
        el.className = `block ${n.color}`;
        el.dataset.id = b.id;
        el.innerHTML = `<span>${n.icon}</span><span>${t(n.key)}</span><button class="remove" type="button" aria-label="remove">×</button>`;
        if (activeMap.has(b.id)) el.classList.add('playing');
        zone.appendChild(el);
      } else {
        const el = document.createElement('div');
        el.className = 'block loop'; el.dataset.id = b.id;
        if (activeMap.has(b.id)) el.classList.add('playing');
        const left = activeMap.get(b.id);
        el.innerHTML = `<div class="loop__top"><span class="loop__label">🔁 ${t('loopName')(b.n)}</span><span class="loop__left">${left ? t('loopLeft')(left) : ''}</span><button class="remove" type="button" aria-label="remove">×</button></div><div class="loop__n"></div><div class="dropzone" data-path="${childrenPathFor(b.id)}"></div>`;
        const nbox = el.querySelector('.loop__n');
        for (let i = 2; i <= 8; i++) {
          const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = i; btn.className = i === b.n ? 'on' : ''; btn.dataset.n = i;
          nbox.appendChild(btn);
        }
        zone.appendChild(el);
        renderBlocks(b.children, el.querySelector('.dropzone'), childrenPathFor(b.id));
      }
    });
  }

  function renderLevels() {
    levelStrip.innerHTML = '';
    LEVELS.forEach((l, i) => {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = `levelchip ${i === levelIndex ? 'on' : ''}`; btn.dataset.level = i;
      btn.innerHTML = `${i + 1}<small>${t(l.name)}</small>`;
      levelStrip.appendChild(btn);
    });
  }

  function currentTarget() {
    return mode === 'bug' ? BUG_TARGET : LEVELS[levelIndex].target;
  }

  function renderTargetDots() {
    const target = currentTarget();
    targetDots.innerHTML = target.slice(0, 36).map((s) => `<span class="dot" title="${s}"></span>`).join('');
  }

  function updateStatus(msg) {
    const flat = flatten(score).map((e) => e.sound);
    statusEl.textContent = msg || `${t('addTarget')} ${selectedPath === 'root' ? t('root') : t('loop')} · ${flat.length} ♪ · ${t('blockCount')(countBlocks(score))}`;
  }

  /** 每帧/每次状态变化的统一渲染入口（语言、主题切换都会调用） */
  function render() {
    cssVar('--ink');
    renderPalette();
    renderLevels();
    renderTargetDots();
    renderBlocks(score, scoreZone, 'root');
    starsEl.textContent = '★'.repeat(starsForScore()) + '☆'.repeat(3 - starsForScore());
    playBtn.textContent = playing ? t('stop') : t('play');
    muteBtn.textContent = soundOn ? '🔊' : '🔇';
    freeTools.hidden = mode !== 'free';
    document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('on', tab.dataset.mode === mode));
    updateSongSlots();
    updateStatus();
  }

  function starsForScore() {
    const flat = flatten(score).map((e) => e.sound);
    if (!same(flat, currentTarget())) return 0;
    const ideal = mode === 'bug' ? 3 : LEVELS[levelIndex].ideal;
    const blocks = countBlocks(score);
    if (blocks <= ideal) return 3;
    if (blocks <= ideal + 2) return 2;
    return 1;
  }

  function same(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  function stopPlay() {
    if (scheduler) clearInterval(scheduler);
    scheduler = null; playing = false; activeMap.clear(); lastBeat = -1; playHead.style.width = '0%';
    render();
  }

  function startPlay(events, asTarget = false) {
    startAudio();
    if (!events.length) { updateStatus(t('empty')); return; }
    stopPlay();
    playEvents = events;
    nextEvent = 0; lastBeat = -1; totalBeats = events.length;
    startTime = audioCtx.currentTime + 0.08;
    playing = true; playBtn.textContent = t('stop');
    scheduler = setInterval(() => scheduleAhead(asTarget), 25);
    scheduleAhead(asTarget);
  }

  function scheduleAhead(asTarget) {
    if (!playing || !audioCtx) return;
    const beatDur = 0.34;
    while (nextEvent < playEvents.length && startTime + nextEvent * beatDur < audioCtx.currentTime + 0.1) {
      const ev = playEvents[nextEvent];
      const when = startTime + nextEvent * beatDur;
      playSound(ev.sound, when);
      setTimeout(() => {
        activeMap.clear();
        if (ev.refs) ev.refs.forEach((ref) => activeMap.set(ref.id || ref, ref.left || 1));
        hitAnimal(ev.sound);
        lastBeat = nextEvent;
        playHead.style.width = `${Math.min(100, ((nextEvent + 1) / totalBeats) * 100)}%`;
        renderBlocks(score, scoreZone, 'root');
      }, Math.max(0, (when - audioCtx.currentTime) * 1000));
      nextEvent++;
    }
    if (nextEvent >= playEvents.length && audioCtx.currentTime > startTime + playEvents.length * beatDur + 0.15) {
      stopPlay();
      if (!asTarget && mode !== 'free') checkScore(true);
    }
  }

  function targetEvents() {
    return currentTarget().map((sound) => ({ sound, refs: [] }));
  }

  function checkScore(fromPlay = false) {
    const flat = flatten(score).map((e) => e.sound);
    if (same(flat, currentTarget())) {
      const stars = starsForScore();
      updateStatus(`${t('perfect')} ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`);
      if (mode === 'bug') showModal('🐞', t('bugWin'), t('perfect'), false);
      else showWin(stars);
    } else if (!fromPlay) updateStatus(t('close'));
  }

  function showWin(stars) {
    if (levelIndex === 5 && stars >= 1) showModal('🪄', t('magicTitle'), t('magicText'), true);
    else showModal(stars === 3 ? '🌟' : '🎵', t('passTitle'), stars === 3 ? t('stars3') : stars === 2 ? t('stars2') : t('stars1'), true);
    confetti();
  }

  function showModal(emoji, title, text, advance) {
    $('#modalEmoji').textContent = emoji;
    $('#modalTitle').textContent = title;
    $('#modalText').textContent = text;
    $('#modalBtn').textContent = advance ? t('next') : t('replay');
    $('#modalBtn').dataset.advance = advance ? '1' : '0';
    $('#modal').hidden = false;
  }

  function confetti() {
    for (let i = 0; i < 34; i++) {
      const c = document.createElement('i'); c.className = 'confetti';
      c.style.left = `${Math.random() * 100}%`; c.style.animationDuration = `${1.4 + Math.random() * 1.5}s`; c.style.background = ['var(--accent)', 'var(--accent-2)', 'var(--mint)', 'var(--sky)'][i % 4];
      document.body.appendChild(c); setTimeout(() => c.remove(), 3200);
    }
  }

  function setMode(nextMode) {
    mode = nextMode;
    stopPlay();
    selectedPath = 'root';
    if (mode === 'bug') { score = ensureIds(clone(BUG_SCORE)); updateStatus(t('bugTip')); }
    else { score = []; updateStatus(mode === 'free' ? t('freeTip') : t('tip0')); }
    render();
  }

  function updateSongSlots() {
    const slots = $('#songSlots');
    if (!slots) return;
    slots.innerHTML = '';
    getSongs().forEach((song, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'mini'; b.dataset.load = i; b.textContent = `🎵 ${i + 1}`; slots.appendChild(b);
    });
  }

  function bindEvents() {
    document.addEventListener('pointerdown', startAudio, { once: true });
    palette.addEventListener('click', (e) => {
      const b = e.target.closest('[data-kind]'); if (!b) return;
      addBlock(b.dataset.kind);
    });
    palette.addEventListener('dragstart', (e) => {
      const b = e.target.closest('[data-kind]'); if (!b) return;
      e.dataTransfer.setData('text/plain', b.dataset.kind);
    });
    document.addEventListener('dragover', (e) => {
      const z = e.target.closest('.dropzone'); if (z) { e.preventDefault(); z.classList.add('over'); }
    });
    document.addEventListener('dragleave', (e) => e.target.closest('.dropzone')?.classList.remove('over'));
    document.addEventListener('drop', (e) => {
      const z = e.target.closest('.dropzone'); if (!z) return;
      e.preventDefault(); z.classList.remove('over'); selectedPath = z.dataset.path || 'root'; addBlock(e.dataTransfer.getData('text/plain'));
    });
    scoreZone.addEventListener('click', (e) => {
      const rem = e.target.closest('.remove');
      if (rem) { removeBlock(rem.closest('[data-id]').dataset.id); render(); return; }
      const nbtn = e.target.closest('[data-n]');
      if (nbtn) { setLoopN(nbtn.closest('[data-id]').dataset.id, Number(nbtn.dataset.n)); render(); return; }
      const zone = e.target.closest('.dropzone');
      if (zone) { selectedPath = zone.dataset.path || 'root'; render(); }
    });
    document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => setMode(tab.dataset.mode)));
    levelStrip.addEventListener('click', (e) => {
      const b = e.target.closest('[data-level]'); if (!b) return;
      levelIndex = Number(b.dataset.level); mode = 'levels'; score = []; selectedPath = 'root'; render();
    });
    playBtn.addEventListener('click', () => playing ? stopPlay() : startPlay(flatten(score)));
    targetBtn.addEventListener('click', () => startPlay(targetEvents(), true));
    $('#checkBtn').addEventListener('click', () => checkScore());
    $('#clearBtn').addEventListener('click', () => { score = []; selectedPath = 'root'; stopPlay(); render(); });
    muteBtn.addEventListener('click', () => { soundOn = !soundOn; store.set('kidslab.loopband.sound', soundOn ? 'on' : 'off'); render(); });
    $('#saveBtn').addEventListener('click', () => { const songs = getSongs(); songs.unshift(clone(score)); setSongs(songs); updateStatus(t('saved')); render(); });
    $('#songSlots').addEventListener('click', (e) => { const b = e.target.closest('[data-load]'); if (!b) return; score = ensureIds(clone(getSongs()[Number(b.dataset.load)] || [])); updateStatus(t('loaded')); render(); });
    $('#modalBtn').addEventListener('click', (e) => {
      $('#modal').hidden = true;
      if (e.target.dataset.advance === '1') levelIndex = (levelIndex + 1) % LEVELS.length;
      score = []; selectedPath = 'root'; render();
    });
    addEventListener('resize', renderTargetDots);
    addEventListener('themechange', renderTargetDots);
  }

  /* ============================ 启动 ============================ */
  bindEvents();
  applyTheme();
  applyLang();
})();
