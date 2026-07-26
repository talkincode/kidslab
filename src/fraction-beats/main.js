(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '分数节拍屋 · KidsLab',
      back: '返回平台',
      title: '分数节拍屋',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      missionsLabel: '关卡',
      wheelLabel: '八格节拍唱片',
      trackLabel: '你的节拍小节',
      paletteLabel: '节拍块',
      addHalf: '加入二分之一拍',
      addQuarter: '加入四分之一拍',
      addEighth: '加入八分之一拍',
      total: '这一小节',
      oneMeasure: '一小节',
      target: '目标',
      yours: '你的',
      sampleDesk: '节拍采样台',
      chooseBeat: '选一个音色块',
      half: '大鼓 · 4 格',
      quarter: '拍手 · 2 格',
      eighth: '沙锤 · 1 格',
      dropHint: '点击节拍块，或拖到唱片上',
      play: '试听',
      check: '检查节奏',
      next: '下一关',
      undo: '撤回',
      clear: '清空',
      hint: '提示',
      finalKicker: '三间节拍房全部点亮',
      finalTitle: '全场节拍制作人！',
      finalText: '你把分数拼成了完整的一小节，还听出了 1/4 和 2/8 一样长。',
      playAgain: '再编一首',
      mission1Kicker: '热身排练',
      mission1Title: '把一小节拼满',
      mission1Text: '一圈是 1。用节拍块刚好铺满 8 格。',
      mission2Kicker: '等值对拍',
      mission2Title: '让两条节奏一样长',
      mission2Text: '上面是 1/4。用两个 1/8 拼出同样长度。',
      mission3Kicker: '主舞台演出',
      mission3Title: '点亮蹦迪房',
      mission3Text: '按 1/4、1/8、1/8、1/2 排序，再试听。',
      missionLabel: (n, title) => `第 ${n} 关：${title}`,
      lockedMission: '先完成前一关',
      ready1: '点一个节拍块，把它送进唱片！',
      ready2: '目标是 1/4。试着用更小的 1/8 拍拼出来。',
      ready3: '按指定顺序编曲，再按试听让动物乐队开演。',
      added: (fraction) => `加入 ${fraction} 拍，还可以继续拼。`,
      full: '刚好填到 1！现在检查这一小节。',
      overflow: '这个节拍放不下，一小节不能超过 1。',
      empty: '唱片还是空的，先加入一个节拍。',
      cleared: '唱片清空了，重新编一段吧。',
      undone: '撤回最后一个节拍。',
      cannotUndo: '还没有可以撤回的节拍。',
      playedEmpty: '先放进节拍，乐队才有东西可演。',
      playing: '节奏开演！看每一格依次亮起来。',
      mission1Wrong: (left) => `还差 ${left}/8 才是一整小节。`,
      mission1Done: '太准了！这些分数合起来正好是一整小节。',
      mission2Wrong: '还不一样长。1/4 要占两格，再补一个 1/8。',
      mission2Done: '听起来一样长：1/4 = 2/8！',
      mission3Wrong: '总长可能对了，但顺序还要是 1/4、1/8、1/8、1/2。',
      mission3NeedPlay: '节奏拼对了！先按试听，让乐队真正演一次。',
      mission3Done: '完美编曲！四段分数合起来就是 1。',
      hint1: '把每个节拍都换成八分之一：1/2 是 4 格，1/4 是 2 格。',
      hint2: '一个 1/4 占 2 格；两个 1/8 也占 2 格。',
      hint3: '先拍手，再摇两下沙锤，最后放进占半圈的大鼓。',
      equationOpen: (sum) => `${sum}/8 / 1`,
      fractionWhole: '1',
      fractionUnits: (units) => `${units}/8`,
      blockLabel: (fraction, name) => `${fraction} ${name}`,
      kick: '大鼓',
      clap: '拍手',
      shaker: '沙锤',
    },
    en: {
      doc: 'Fraction Beat House · KidsLab',
      back: 'Back to platform',
      title: 'Fraction Beat House',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      missionsLabel: 'Missions',
      wheelLabel: 'Eight-step beat record',
      trackLabel: 'Your rhythm measure',
      paletteLabel: 'Beat blocks',
      addHalf: 'Add a one-half beat',
      addQuarter: 'Add a one-quarter beat',
      addEighth: 'Add a one-eighth beat',
      total: 'This measure',
      oneMeasure: 'one measure',
      target: 'Target',
      yours: 'Yours',
      sampleDesk: 'BEAT SAMPLE DESK',
      chooseBeat: 'Choose a sound block',
      half: 'Kick · 4 steps',
      quarter: 'Clap · 2 steps',
      eighth: 'Shaker · 1 step',
      dropHint: 'Click a beat, or drag it onto the record',
      play: 'Play',
      check: 'Check groove',
      next: 'Next mission',
      undo: 'Undo',
      clear: 'Clear',
      hint: 'Hint',
      finalKicker: 'ALL THREE BEAT ROOMS ARE LIT',
      finalTitle: 'Head Beat Producer!',
      finalText: 'You built a complete measure from fractions and heard that 1/4 lasts exactly as long as 2/8.',
      playAgain: 'Make another',
      mission1Kicker: 'WARM-UP ROOM',
      mission1Title: 'Fill One Measure',
      mission1Text: 'The ring is 1. Fill all 8 steps with beat blocks.',
      mission2Kicker: 'EQUAL-BEAT ROOM',
      mission2Title: 'Make Both Grooves Equal',
      mission2Text: 'Top is 1/4. Match it with two 1/8 beats.',
      mission3Kicker: 'MAIN STAGE',
      mission3Title: 'Light the Dance House',
      mission3Text: 'Build 1/4, 1/8, 1/8, 1/2 in order. Then Play.',
      missionLabel: (n, title) => `Mission ${n}: ${title}`,
      lockedMission: 'Finish the previous mission first',
      ready1: 'Tap a beat block and send it into the record!',
      ready2: 'The target is 1/4. Try building it from smaller 1/8 beats.',
      ready3: 'Build the requested order, then press Play for the animal band.',
      added: (fraction) => `${fraction} beat added. Keep building.`,
      full: 'Exactly 1! Check your completed measure.',
      overflow: 'That beat will not fit. One measure cannot be more than 1.',
      empty: 'The record is empty. Add a beat first.',
      cleared: 'Record cleared. Build a fresh groove.',
      undone: 'Last beat removed.',
      cannotUndo: 'There is no beat to undo yet.',
      playedEmpty: 'Add a beat before asking the band to play.',
      playing: 'The groove is live! Watch every step light up.',
      mission1Wrong: (left) => `${left}/8 of the measure is still empty.`,
      mission1Done: 'Right on the beat! These fractions make exactly one measure.',
      mission2Wrong: 'Not equal yet. A 1/4 takes two steps, so add one more 1/8.',
      mission2Done: 'They last the same: 1/4 = 2/8!',
      mission3Wrong: 'The total may be right, but the order must be 1/4, 1/8, 1/8, 1/2.',
      mission3NeedPlay: 'The groove is correct! Press Play so the band performs it once.',
      mission3Done: 'Perfect mix! All four fractions add up to 1.',
      hint1: 'Think in eighths: 1/2 is 4 steps, and 1/4 is 2 steps.',
      hint2: 'One 1/4 takes 2 steps. Two 1/8 beats also take 2 steps.',
      hint3: 'Clap first, shake twice, then finish with the half-ring kick.',
      equationOpen: (sum) => `${sum}/8 / 1`,
      fractionWhole: '1',
      fractionUnits: (units) => `${units}/8`,
      blockLabel: (fraction, name) => `${fraction} ${name}`,
      kick: 'kick',
      clap: 'clap',
      shaker: 'shaker',
    },
  };

  const MISSIONS = [
    { kicker: 'mission1Kicker', title: 'mission1Title', text: 'mission1Text', ready: 'ready1' },
    { kicker: 'mission2Kicker', title: 'mission2Title', text: 'mission2Text', ready: 'ready2' },
    { kicker: 'mission3Kicker', title: 'mission3Title', text: 'mission3Text', ready: 'ready3' },
  ];
  const BEATS = {
    4: { fraction: '1/2', kind: 'kick', color: '--half', icon: '🥁' },
    2: { fraction: '1/4', kind: 'clap', color: '--quarter', icon: '👏' },
    1: { fraction: '1/8', kind: 'shaker', color: '--eighth', icon: '🪇' },
  };
  const SAVE_KEY = 'kidslab.fraction-beats';
  const SOUND_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    course: $('.course'),
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    nav: $('#missionNav'),
    status: $('#status'),
    fractionTotal: $('#fractionTotal'),
    club: $('#club'),
    wheel: $('#beatWheel'),
    targetRow: $('#targetRow'),
    targetTrack: $('#targetTrack'),
    track: $('#measureTrack'),
    equation: $('#equation'),
    palette: $('#beatPalette'),
    play: $('#playBtn'),
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
  let beatsByMission = [[], [], []];
  let statusMessage = { key: 'ready1', args: [], tone: '' };
  let playedFinal = false;
  let playTimer = 0;
  let draggedUnits = 0;

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

    tone(frequency, duration, type = 'sine', volume = 0.055, delay = 0) {
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
      if (kind === 'kick') {
        const context = this.ensure();
        if (!context) return;
        const start = context.currentTime;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(135, start);
        oscillator.frequency.exponentialRampToValueAtTime(48, start + 0.16);
        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.2);
      } else if (kind === 'clap') {
        this.tone(420, 0.055, 'square', 0.035);
        this.tone(620, 0.045, 'triangle', 0.025, 0.025);
      } else if (kind === 'shaker') {
        this.tone(980, 0.035, 'triangle', 0.022);
      } else if (kind === 'error') {
        this.tone(185, 0.14, 'sawtooth', 0.035);
      } else if (kind === 'success') {
        this.tone(392, 0.1, 'sine', 0.045);
        this.tone(523, 0.13, 'sine', 0.05, 0.09);
      } else if (kind === 'complete') {
        [392, 494, 587, 784].forEach((frequency, index) => this.tone(frequency, 0.16, 'sine', 0.055, index * 0.1));
      }
    }
  }

  const sound = new SoundEngine();

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked, completed: [...completed] }));
    } catch {}
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function currentBeats() {
    return beatsByMission[missionIndex];
  }

  function totalUnits() {
    return currentBeats().reduce((sum, units) => sum + units, 0);
  }

  function fractionForTotal(units) {
    if (units === 0) return '0';
    if (units === 8) return t('fractionWhole');
    if (units === 4) return '1/2';
    if (units === 2) return '1/4';
    if (units === 1) return '1/8';
    if (units === 6) return '3/4';
    return `${units}/8`;
  }

  function setStatus(key, args = [], tone = '') {
    statusMessage = { key, args, tone };
    renderStatus();
  }

  function renderStatus() {
    el.status.textContent = t(statusMessage.key, ...statusMessage.args);
    el.status.className = `status ${statusMessage.tone}`.trim();
  }

  function renderNav() {
    el.nav.replaceChildren();
    MISSIONS.forEach((mission, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `mission-btn${index === missionIndex ? ' current' : ''}${completed.has(index) ? ' done' : ''}`;
      button.textContent = String(index + 1);
      button.disabled = index > unlocked;
      button.setAttribute('aria-label', t('missionLabel', index + 1, t(mission.title)));
      if (button.disabled) button.title = t('lockedMission');
      button.addEventListener('click', () => switchMission(index));
      el.nav.append(button);
    });
  }

  function makeBlock(units, target = false) {
    const beat = BEATS[units];
    const block = document.createElement('div');
    block.className = 'beat-block';
    block.style.flex = `0 0 ${units * 12.5}%`;
    block.style.setProperty('--block-color', cssVar(beat.color));
    block.setAttribute('aria-label', t('blockLabel', beat.fraction, t(beat.kind)));
    const strong = document.createElement('strong');
    strong.textContent = beat.fraction;
    const small = document.createElement('small');
    small.textContent = target ? t('target') : t(beat.kind);
    block.append(strong, small);
    return block;
  }

  function renderTracks() {
    el.track.replaceChildren(...currentBeats().map((units) => makeBlock(units)));
    el.targetTrack.replaceChildren();
    el.targetRow.hidden = missionIndex !== 1;
    if (missionIndex === 1) el.targetTrack.append(makeBlock(2, true));
    const total = totalUnits();
    el.fractionTotal.textContent = fractionForTotal(total);
    el.equation.classList.toggle('success', completed.has(missionIndex));
    if (missionIndex === 1 && completed.has(1)) {
      el.equation.textContent = '1/4 = 2/8';
    } else if (missionIndex === 2 && total === 8) {
      el.equation.textContent = '1/4 + 1/8 + 1/8 + 1/2 = 1';
    } else {
      el.equation.textContent = t('equationOpen', total);
    }
  }

  function renderWheel() {
    el.wheel.querySelectorAll('.beat-cell').forEach((cell) => cell.remove());
    const groups = [];
    currentBeats().forEach((units, group) => {
      for (let index = 0; index < units; index += 1) groups.push({ units, group });
    });
    for (let index = 0; index < 8; index += 1) {
      const cell = document.createElement('span');
      cell.className = `beat-cell${groups[index] ? ' filled' : ''}`;
      cell.style.setProperty('--angle', `${index * 45}deg`);
      cell.textContent = String(index + 1);
      if (groups[index]) {
        cell.style.setProperty('--cell-color', cssVar(BEATS[groups[index].units].color));
        cell.dataset.kind = BEATS[groups[index].units].kind;
        cell.dataset.group = String(groups[index].group);
      }
      el.wheel.append(cell);
    }
  }

  function renderPalette() {
    el.palette.setAttribute('aria-label', t('paletteLabel'));
    el.palette.querySelector('[data-units="4"]').setAttribute('aria-label', t('addHalf'));
    el.palette.querySelector('[data-units="2"]').setAttribute('aria-label', t('addQuarter'));
    el.palette.querySelector('[data-units="1"]').setAttribute('aria-label', t('addEighth'));
  }

  function render() {
    const mission = MISSIONS[missionIndex];
    el.missionNumber.textContent = String(missionIndex + 1).padStart(2, '0');
    el.missionKicker.textContent = t(mission.kicker);
    el.missionTitle.textContent = t(mission.title);
    el.missionText.textContent = t(mission.text);
    el.nav.setAttribute('aria-label', t('missionsLabel'));
    el.wheel.setAttribute('aria-label', t('wheelLabel'));
    el.track.setAttribute('aria-label', t('trackLabel'));
    el.sound.textContent = sound.muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', String(sound.muted));
    el.sound.setAttribute('aria-label', t(sound.muted ? 'soundOn' : 'soundOff'));
    el.theme.setAttribute('aria-label', t('themeLabel'));
    renderNav();
    renderPalette();
    renderTracks();
    renderWheel();
    renderStatus();
  }

  function addBeat(units) {
    const beats = currentBeats();
    if (totalUnits() + units > 8) {
      sound.play('error');
      setStatus('overflow', [], 'bad');
      return;
    }
    beats.push(units);
    playedFinal = false;
    sound.play(BEATS[units].kind);
    window.cool?.track?.('add_beat', { fraction: BEATS[units].fraction, mission: missionIndex + 1 });
    setStatus(totalUnits() === 8 ? 'full' : 'added', totalUnits() === 8 ? [] : [BEATS[units].fraction], totalUnits() === 8 ? 'good' : '');
    renderTracks();
    renderWheel();
  }

  function clearPlayback() {
    clearTimeout(playTimer);
    playTimer = 0;
    el.wheel.classList.remove('spinning');
    el.club.classList.remove('disco');
    el.wheel.querySelectorAll('.current').forEach((cell) => cell.classList.remove('current'));
  }

  function playSequence() {
    clearPlayback();
    if (!currentBeats().length) {
      sound.play('error');
      setStatus('playedEmpty', [], 'bad');
      return;
    }
    setStatus('playing', [], 'good');
    playedFinal = missionIndex === 2;
    el.wheel.classList.add('spinning');
    el.club.classList.add('disco');
    const events = [];
    let cursor = 0;
    currentBeats().forEach((units) => {
      events.push({ step: cursor, kind: BEATS[units].kind });
      cursor += units;
    });
    let step = 0;
    const tick = () => {
      const cells = [...el.wheel.querySelectorAll('.beat-cell')];
      cells.forEach((cell) => cell.classList.remove('current'));
      cells[step]?.classList.add('current');
      const event = events.find((item) => item.step === step);
      if (event) sound.play(event.kind);
      step += 1;
      if (step < 8) {
        playTimer = window.setTimeout(tick, 145);
      } else {
        playTimer = window.setTimeout(clearPlayback, 220);
      }
    };
    tick();
    window.cool?.track?.('play_measure', { mission: missionIndex + 1 });
  }

  function markMissionDone(messageKey) {
    completed.add(missionIndex);
    unlocked = Math.max(unlocked, Math.min(2, missionIndex + 1));
    save();
    sound.play(missionIndex === 2 ? 'complete' : 'success');
    setStatus(messageKey, [], 'good');
    render();
    if (missionIndex < 2) {
      el.next.hidden = false;
      el.next.focus();
    } else {
      window.cool?.complete?.();
      showComplete();
    }
  }

  function checkMission() {
    const beats = currentBeats();
    const total = totalUnits();
    window.cool?.track?.('check_measure', { mission: missionIndex + 1, total_eighths: total });
    if (missionIndex === 0) {
      if (total !== 8) {
        sound.play('error');
        setStatus(total === 0 ? 'empty' : 'mission1Wrong', total === 0 ? [] : [8 - total], 'bad');
        return;
      }
      markMissionDone('mission1Done');
      return;
    }
    if (missionIndex === 1) {
      if (beats.length !== 2 || beats.some((units) => units !== 1)) {
        sound.play('error');
        setStatus('mission2Wrong', [], 'bad');
        return;
      }
      markMissionDone('mission2Done');
      return;
    }
    const correct = beats.length === 4 && beats.every((units, index) => units === [2, 1, 1, 4][index]);
    if (!correct) {
      sound.play('error');
      setStatus('mission3Wrong', [], 'bad');
      return;
    }
    if (!playedFinal) {
      sound.play('error');
      setStatus('mission3NeedPlay', [], 'bad');
      return;
    }
    markMissionDone('mission3Done');
  }

  function switchMission(index) {
    if (index > unlocked) return;
    clearPlayback();
    missionIndex = index;
    playedFinal = false;
    statusMessage = { key: MISSIONS[index].ready, args: [], tone: '' };
    el.next.hidden = true;
    render();
    el.check.focus();
    window.cool?.stage?.(`level${index + 1}`);
  }

  function showComplete() {
    clearPlayback();
    el.modal.hidden = false;
    el.course.inert = true;
    el.playAgain.focus();
  }

  function restartAll() {
    missionIndex = 0;
    unlocked = 0;
    completed = new Set();
    beatsByMission = [[], [], []];
    playedFinal = false;
    statusMessage = { key: 'ready1', args: [], tone: '' };
    save();
    el.modal.hidden = true;
    el.course.inert = false;
    render();
    el.palette.querySelector('button').focus();
  }

  el.palette.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-units]');
    if (button) addBeat(Number(button.dataset.units));
  });
  el.palette.addEventListener('dragstart', (event) => {
    const button = event.target.closest('button[data-units]');
    if (!button) return;
    draggedUnits = Number(button.dataset.units);
    event.dataTransfer?.setData('text/plain', String(draggedUnits));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy';
  });
  [el.track, el.wheel].forEach((dropZone) => {
    dropZone.addEventListener('dragover', (event) => {
      event.preventDefault();
      el.track.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => el.track.classList.remove('dragover'));
    dropZone.addEventListener('drop', (event) => {
      event.preventDefault();
      el.track.classList.remove('dragover');
      const units = Number(event.dataTransfer?.getData('text/plain')) || draggedUnits;
      if (BEATS[units]) addBeat(units);
    });
  });
  el.play.addEventListener('click', playSequence);
  el.check.addEventListener('click', checkMission);
  el.next.addEventListener('click', () => switchMission(Math.min(2, missionIndex + 1)));
  el.undo.addEventListener('click', () => {
    if (!currentBeats().length) {
      sound.play('error');
      setStatus('cannotUndo', [], 'bad');
      return;
    }
    currentBeats().pop();
    playedFinal = false;
    sound.play('shaker');
    setStatus('undone');
    renderTracks();
    renderWheel();
  });
  el.clear.addEventListener('click', () => {
    currentBeats().length = 0;
    playedFinal = false;
    sound.play('shaker');
    setStatus('cleared');
    renderTracks();
    renderWheel();
  });
  el.hint.addEventListener('click', () => {
    sound.play('clap');
    setStatus(`hint${missionIndex + 1}`);
    window.cool?.track?.('show_hint', { mission: missionIndex + 1 });
  });
  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    render();
    if (!sound.muted) sound.play('success');
  });
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.playAgain.addEventListener('click', restartAll);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearPlayback();
  });

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang, theme }) {
      t = translate;
      language = lang;
      document.title = t('doc');
      document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
      el.lang.textContent = language === 'zh' ? 'EN' : '中';
      el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
      render();
    },
  });
})();
