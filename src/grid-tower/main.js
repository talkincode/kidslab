(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '格子大厦 · KidsLab',
      back: '返回平台',
      title: '格子大厦',
      eyebrow: '面积模型施工队',
      tip0: '点一块施工区，算对房间数，窗户就会一间间亮起来。',
      mission: '今日任务',
      chooseZone: '选中施工区后，在这里报数',
      demolishAsk: '随时可以抢答：一共能拆几层？',
      hint: '💡 看施工提示',
      reset: '重新开始',
      inspection: '验收通过',
      soundOn: '关闭音效',
      soundOff: '开启音效',
      levels: ['热身楼', '摩天楼', '拆迁队'],
      missions: ['盖一座 13 × 6 的公寓', '盖一座 23 × 14 的摩天楼', '把 312 间房的旧楼一层层拆掉'],
      start: '先点亮一块施工区！',
      select: (a, b) => `这块是 ${a} × ${b}，一共有多少间？`,
      correct: (n) => `${n} 扇窗全亮了！继续盖下一块。`,
      wrongHigh: '数大了，这批窗户装不下，再算一次。',
      wrongLow: '数小了，还有房间没数到，再算一次。',
      totalAsk: (a, b) => `施工区都盖好啦！整栋 ${a} × ${b} 有多少间？`,
      totalCorrect: '总数核对正确，准备封顶！',
      demolishBtn: '🧨 拆一层',
      demolishStart: '这栋旧楼共 312 间，每层 24 间。点 🧨 拆一层，或直接抢答能拆几层！',
      demolished: (f, left) => `轰！已拆 ${f} 层，还剩 ${left} 间。看出规律了吗？`,
      demolishDone: '全拆完了！数一数一共拆了几层，快去报数！',
      wrongFloorsHigh: '太多了——楼没有这么高，先拆一层找找感觉。',
      wrongFloorsLow: '太少了——还有好多房间没拆呢，再想想。',
      hintZone: (a, b) => `数格子：每行 ${a} 间，共 ${b} 行。也可以把 ${a} 连加 ${b} 次。`,
      hintTotal: '把每块施工区的房间数加起来，就是整栋楼的房间数。',
      hintDivision: '每拆一层就少 24 间。反过来想：24 乘几等于 312？',
      completeTitles: ['第一栋楼封顶！', '摩天楼全部亮灯！', '拆迁规划完成！'],
      completeTexts: [
        '把 13 拆成 10 和 3，两块分开算再相加，算起来更轻松。',
        '四块施工区加起来：200 + 30 + 80 + 12 = 322。',
        '312 ÷ 24 = 13，因为 24 × 13 = 312。除法也能用乘法施工图检查。',
      ],
      xrayTitle: '竖式 X 光：每一行就是一块施工区',
      next: '下一张施工图',
      replay: '重新挑战',
      equationStart: (a, b) => `${a} × ${b} = 等待施工…`,
      demolishLogStart: '一栋 312 间的旧楼 · 每层 24 间',
      demolishLog: (f, gone, left) => `已拆 ${f} 层 · 拆掉 ${gone} 间 · 还剩 ${left} 间`,
      demolishFinal: '312 ÷ 24 = 13 层',
      locked: '先完成前一张施工图',
    },
    en: {
      doc: 'Grid Tower · KidsLab',
      back: 'Back to platform',
      title: 'Grid Tower',
      eyebrow: 'Area Model Build Crew',
      tip0: 'Tap a building zone and solve it — the windows light up one by one.',
      mission: 'Today’s mission',
      chooseZone: 'Select a zone, then report the room count here',
      demolishAsk: 'Buzz in any time: how many floors in total?',
      hint: '💡 Construction hint',
      reset: 'Restart',
      inspection: 'Inspection passed',
      soundOn: 'Mute sound',
      soundOff: 'Turn sound on',
      levels: ['Warm-up', 'Skyscraper', 'Demolition'],
      missions: ['Build a 13 × 6 apartment', 'Build a 23 × 14 skyscraper', 'Tear down a 312-room tower floor by floor'],
      start: 'Light up a construction zone first!',
      select: (a, b) => `This zone is ${a} × ${b}. How many rooms?`,
      correct: (n) => `All ${n} windows are lit! Build the next zone.`,
      wrongHigh: 'Too many — those windows will not fit. Try again.',
      wrongLow: 'Too few — some rooms are still uncounted. Try again.',
      totalAsk: (a, b) => `All zones are built! How many rooms in ${a} × ${b}?`,
      totalCorrect: 'The total checks out. Ready to top out!',
      demolishBtn: '🧨 Tear down a floor',
      demolishStart: 'This old tower has 312 rooms, 24 per floor. Tap 🧨 to demolish, or buzz in with the floor count!',
      demolished: (f, left) => `Boom! ${f} floors down, ${left} rooms left. See the pattern?`,
      demolishDone: 'All torn down! Count the floors and report the answer!',
      wrongFloorsHigh: 'Too many — the tower is not that tall. Tear one down to get a feel.',
      wrongFloorsLow: 'Too few — plenty of rooms are still standing. Think again.',
      hintZone: (a, b) => `Count the grid: ${a} rooms in each row and ${b} rows. Or add ${a}, ${b} times.`,
      hintTotal: 'Add the room counts from every zone to get the whole building.',
      hintDivision: 'Each floor removes 24 rooms. Think backward: 24 times what equals 312?',
      completeTitles: ['First tower topped out!', 'Every skyscraper light is on!', 'Demolition plan complete!'],
      completeTexts: [
        'Split 13 into 10 and 3, solve each block, then add — much easier.',
        'Add the four zones: 200 + 30 + 80 + 12 = 322.',
        '312 ÷ 24 = 13 because 24 × 13 = 312. Division can be checked with a multiplication plan.',
      ],
      xrayTitle: 'Long-multiplication X-ray: every line is a build zone',
      next: 'Next blueprint',
      replay: 'Challenge again',
      equationStart: (a, b) => `${a} × ${b} = waiting for construction…`,
      demolishLogStart: 'One old tower · 312 rooms · 24 per floor',
      demolishLog: (f, gone, left) => `${f} floors down · ${gone} rooms gone · ${left} rooms left`,
      demolishFinal: '312 ÷ 24 = 13 floors',
      locked: 'Finish the previous blueprint first',
    },
  };

  const LEVELS = [
    {
      a: 13,
      b: 6,
      columns: [10, 3],
      rows: [6],
      answers: {
        60: [60, 50, 70, 16],
        18: [18, 16, 24, 9],
        total: [72, 78, 83, 68],
      },
    },
    {
      a: 23,
      b: 14,
      columns: [20, 3],
      rows: [10, 4],
      answers: {
        200: [200, 140, 230, 34],
        80: [80, 60, 24, 100],
        30: [30, 23, 40, 13],
        12: [12, 7, 14, 24],
        total: [312, 322, 332, 342],
      },
    },
    {
      division: true,
      total: 312,
      per: 24,
      floors: 13,
      answers: {
        total: [12, 13, 14, 24],
      },
    },
  ];

  const ZONE_COLORS = ['#4f8df9', '#ff9f3f', '#3fd08f', '#ff7bac'];
  const $ = (selector) => document.querySelector(selector);
  const SAVE_KEY = 'kidslab.grid-tower';
  const MUTE_KEY = 'kidslab.sound.muted';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saved = (() => {
    try {
      const value = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  })();

  const el = {
    lang: $('#langBtn'),
    theme: $('#themeBtn'),
    sound: $('#soundBtn'),
    badge: $('#siteBadge'),
    levels: $('#levelStrip'),
    mission: $('#missionTitle'),
    topRuler: $('#topRuler'),
    sideRuler: $('#sideRuler'),
    rulers: $('.rulers'),
    tower: $('#tower'),
    equation: $('#equation'),
    feedback: $('#feedback'),
    foreman: $('#foremanFace'),
    question: $('#questionText'),
    questionLabel: $('#questionLabel'),
    answers: $('#answerGrid'),
    demolish: $('#demolishBtn'),
    hint: $('#hintBtn'),
    reset: $('#resetBtn'),
    modal: $('#modal'),
    modalTitle: $('#modalTitle'),
    modalText: $('#modalText'),
    modalXray: $('#modalXray'),
    modalConfetti: $('#modalConfetti'),
    celebration: $('#celebration'),
    next: $('#nextBtn'),
  };

  let t = (key) => key;
  let lang = window.cool.preferences.lang;
  let theme = window.cool.preferences.theme;
  let levelIndex = Math.min(2, Math.max(0, Number(saved.level) || 0));
  let unlocked = Math.min(2, Math.max(levelIndex, Number(saved.unlocked) || 0));
  let built = new Set();
  const animatedZones = new Set();
  let selected = null;
  let askingTotal = false;
  let completed = false;
  let demolished = 0;
  let crashing = false;
  let muted = false;
  let audioContext = null;

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
      build: [[262, 0, 0.08, 0.05, 'square'], [330, 0.09, 0.08, 0.05, 'square'], [392, 0.18, 0.1, 0.05, 'square']],
      chime: [[523, 0, 0.09, 0.06, 'sine'], [659, 0.09, 0.12, 0.07, 'sine'], [784, 0.19, 0.14, 0.07, 'sine']],
      wah: [[233, 0, 0.13, 0.055, 'square'], [175, 0.12, 0.18, 0.05, 'square']],
      whoosh: [[330, 0, 0.09, 0.05, 'sine'], [440, 0.07, 0.09, 0.06, 'sine'], [587, 0.14, 0.12, 0.06, 'sine']],
      crash: [[220, 0, 0.08, 0.07, 'sawtooth'], [110, 0.06, 0.14, 0.08, 'sawtooth'], [65, 0.14, 0.2, 0.08, 'sine']],
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

  /* ---------- state helpers ---------- */

  function level() {
    return LEVELS[levelIndex];
  }

  function zonesFor(current) {
    if (current.division) return [];
    const zones = [];
    current.rows.forEach((row, rowIndex) => {
      current.columns.forEach((column, columnIndex) => {
        zones.push({
          id: `${rowIndex}-${columnIndex}`,
          a: column,
          b: row,
          value: column * row,
          row: rowIndex + 1,
          column: columnIndex + 1,
          color: ZONE_COLORS[(rowIndex * current.columns.length + columnIndex) % ZONE_COLORS.length],
        });
      });
    });
    return zones;
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ level: levelIndex, unlocked }));
    } catch {
      // Progress persistence is optional; the current session remains playable.
    }
  }

  function shuffle(values, seed) {
    return [...values].sort((a, b) => ((a * 17 + seed * 13) % 29) - ((b * 17 + seed * 13) % 29));
  }

  function setFeedback(message, face = '👷', excited = false) {
    el.feedback.textContent = message;
    el.foreman.textContent = face;
    el.foreman.classList.remove('is-bouncing');
    if (excited && !reducedMotion) {
      void el.foreman.offsetWidth;
      el.foreman.classList.add('is-bouncing');
    }
  }

  /* ---------- collect play (levels 1-2) ---------- */

  function selectZone(id) {
    if (completed || askingTotal || built.has(id)) return;
    selected = zonesFor(level()).find((zone) => zone.id === id) || null;
    if (!selected) return;
    tone('pop');
    setFeedback(t('select', selected.a, selected.b), '👷‍♀️');
    window.cool.track('select_building_zone');
    render();
  }

  function chooseAnswer(value, button) {
    if (completed) return;
    const current = level();
    const expected = askingTotal || current.division
      ? (current.division ? current.floors : current.a * current.b)
      : selected?.value;
    if (expected == null) return;

    if (value !== expected) {
      button.classList.add('is-wrong');
      selected && document.querySelector(`[data-zone="${selected.id}"]`)?.classList.add('is-wrong');
      if (current.division) {
        setFeedback(t(value > expected ? 'wrongFloorsHigh' : 'wrongFloorsLow'), '🧑‍🔧');
      } else {
        setFeedback(t(value > expected ? 'wrongHigh' : 'wrongLow'), '🧑‍🔧');
      }
      tone('wah');
      window.cool.track('retry_room_count');
      setTimeout(() => {
        button.classList.remove('is-wrong');
        document.querySelector('.zone.is-wrong')?.classList.remove('is-wrong');
      }, 340);
      return;
    }

    button.classList.add('is-right');
    if (current.division) {
      completed = true;
      setFeedback(t('totalCorrect'), '🎉', true);
      tone('stamp');
      window.cool.track('solve_division_plan');
      finishDemolition(() => setTimeout(showCompletion, reducedMotion ? 80 : 320));
      renderAnswers();
      return;
    }
    if (askingTotal) {
      completed = true;
      setFeedback(t('totalCorrect'), '🎉', true);
      tone('stamp');
      window.cool.track('finish_tower');
      setTimeout(showCompletion, 420);
      render();
      return;
    }

    built.add(selected.id);
    setFeedback(t('correct', selected.value), '👷‍♀️', true);
    tone('build');
    selected = null;
    window.cool.track('build_zone');
    if (built.size === zonesFor(current).length) {
      askingTotal = true;
      setTimeout(() => tone('whoosh'), reducedMotion ? 0 : 620);
      setFeedback(t('totalAsk', current.a, current.b), '🧮');
    }
    render();
  }

  /* ---------- demolition play (level 3) ---------- */

  function demolishFloor() {
    const current = level();
    if (completed || crashing || demolished >= current.floors) return;
    const target = el.tower.querySelector('.floor');
    crashing = true;
    el.demolish.disabled = true;
    tone('crash');
    window.cool.track('demolish_floor');
    target?.classList.add('is-crashing');
    setTimeout(() => {
      crashing = false;
      demolished += 1;
      const left = current.total - current.per * demolished;
      setFeedback(demolished >= current.floors ? t('demolishDone') : t('demolished', demolished, left), '🧨', true);
      render();
    }, reducedMotion ? 0 : 340);
  }

  function finishDemolition(done) {
    const current = level();
    const step = () => {
      if (demolished >= current.floors) {
        render();
        done();
        return;
      }
      demolished += 1;
      renderTower();
      renderEquation();
      tone('tick');
      setTimeout(step, reducedMotion ? 0 : 95);
    };
    step();
  }

  /* ---------- hints & completion ---------- */

  function showHint() {
    const current = level();
    if (current.division) {
      setFeedback(t('hintDivision'), '💡');
    } else if (askingTotal) {
      setFeedback(t('hintTotal'), '💡');
    } else if (selected) {
      setFeedback(t('hintZone', selected.a, selected.b), '💡');
    } else {
      const first = zonesFor(current).find((zone) => !built.has(zone.id));
      if (first) {
        selected = first;
        setFeedback(t('select', first.a, first.b), '👉');
      }
    }
    window.cool.track('open_construction_hint');
    render();
  }

  function xrayMarkup() {
    const current = level();
    if (current.division) {
      return `<p class="xray__check">312 − 24 × 13 = 0　✓</p>`;
    }
    const parts = zonesFor(current).slice().reverse();
    const rows = parts.map((zone) =>
      `<div class="xray__row"><i style="--zc:${zone.color}"></i><b>${zone.value}</b><small>${zone.a} × ${zone.b}</small></div>`).join('');
    return `
      <p class="xray__title">${t('xrayTitle')}</p>
      <div class="xray__sheet">
        <div class="xray__row xray__row--head"><i></i><b>${current.a}</b><small></small></div>
        <div class="xray__row xray__row--head"><i>×</i><b>${current.b}</b><small></small></div>
        <div class="xray__rule"></div>
        ${rows}
        <div class="xray__rule"></div>
        <div class="xray__row xray__row--sum"><i></i><b>${current.a * current.b}</b><small></small></div>
      </div>`;
  }

  function showCompletion() {
    const current = level();
    if (levelIndex < LEVELS.length - 1) {
      unlocked = Math.max(unlocked, levelIndex + 1);
      persist();
    } else {
      window.cool.complete?.();
    }
    el.celebration.textContent = current.division ? '🏚️➡️🏢' : levelIndex === 1 ? '🌃' : '🏙️';
    el.modalTitle.textContent = t('completeTitles')[levelIndex];
    el.modalText.textContent = t('completeTexts')[levelIndex];
    el.modalXray.innerHTML = xrayMarkup();
    el.modalConfetti.innerHTML = Array.from({ length: 14 }, (_, index) => `<i class="confetti-piece confetti-piece--${index % 7}"></i>`).join('');
    el.next.textContent = levelIndex === LEVELS.length - 1 ? t('replay') : t('next');
    el.modal.hidden = false;
    tone('fanfare');
    renderLevels();
  }

  function resetLevel() {
    built = new Set();
    animatedZones.clear();
    selected = null;
    askingTotal = false;
    completed = false;
    demolished = 0;
    crashing = false;
    el.modal.hidden = true;
    el.modalConfetti.innerHTML = '';
    setFeedback(level().division ? t('demolishStart') : t('start'), level().division ? '🧨' : '👷');
    window.cool.stage(`blueprint-${levelIndex + 1}`);
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

  /* ---------- rendering ---------- */

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

  function windowsMarkup(zone, animate) {
    let cells = '';
    for (let r = 0; r < zone.b; r += 1) {
      for (let c = 0; c < zone.a; c += 1) {
        cells += animate
          ? `<i style="animation-delay:${Math.min(1.05, (zone.b - 1 - r) * 0.05 + c * 0.007).toFixed(3)}s"></i>`
          : '<i class="is-set"></i>';
      }
    }
    return `<span class="windows" style="--wc:${zone.a};--wr:${zone.b}" aria-hidden="true">${cells}</span>`;
  }

  function renderTower() {
    const current = level();
    if (current.division) {
      renderDemolitionTower();
      return;
    }
    el.tower.classList.remove('tower--demolition');
    el.tower.style.gridTemplateColumns = current.columns.map((n) => `${n}fr`).join(' ');
    el.tower.style.gridTemplateRows = current.rows.map((n) => `${n}fr`).join(' ');
    el.tower.innerHTML = zonesFor(current).map((zone) => {
      const isBuilt = built.has(zone.id);
      const isSelected = selected?.id === zone.id;
      const fresh = isBuilt && !animatedZones.has(zone.id);
      const math = isBuilt ? `${zone.a} × ${zone.b} = ${zone.value}` : `${zone.a} × ${zone.b} = ?`;
      return `<button class="zone ${isBuilt ? 'is-built' : ''} ${isSelected ? 'is-selected' : ''}" type="button" data-zone="${zone.id}" style="grid-area:${zone.row}/${zone.column};--zc:${zone.color}" aria-label="${math}">${isBuilt ? windowsMarkup(zone, fresh) : ''}<span class="zone__math">${math}</span></button>`;
    }).join('');
    zonesFor(current).forEach((zone) => {
      if (built.has(zone.id)) animatedZones.add(zone.id);
    });
    el.tower.querySelectorAll('[data-zone]').forEach((zone) => {
      zone.addEventListener('click', () => selectZone(zone.dataset.zone));
    });
  }

  function renderDemolitionTower() {
    const current = level();
    el.tower.classList.add('tower--demolition');
    el.tower.style.gridTemplateColumns = '1fr';
    el.tower.style.gridTemplateRows = `repeat(${current.floors}, 1fr)`;
    let markup = '';
    for (let i = demolished; i < current.floors; i += 1) {
      const windows = Array.from({ length: current.per }, () => '<i></i>').join('');
      markup += `<div class="floor" style="grid-area:${i + 1}/1"><b class="floor__tag">${current.per}</b><span class="floor__windows" aria-hidden="true">${windows}</span></div>`;
    }
    el.tower.innerHTML = markup;
  }

  function renderAnswers() {
    const current = level();
    let options = [];
    let prompt = '—';
    if (current.division) {
      options = current.answers.total;
      prompt = `${current.total} ÷ ${current.per} = ?`;
    } else if (askingTotal) {
      options = current.answers.total;
      prompt = `${current.a} × ${current.b} = ?`;
    } else if (selected) {
      options = current.answers[selected.value];
      prompt = `${selected.a} × ${selected.b} = ?`;
    }
    el.question.textContent = prompt;
    el.questionLabel.textContent = t(current.division ? 'demolishAsk' : 'chooseZone');
    el.answers.classList.toggle('answer-grid--row', Boolean(current.division));
    el.answers.innerHTML = shuffle(options, levelIndex + (selected?.value || 0)).map((value) =>
      `<button class="answer" type="button" data-answer="${value}" ${completed ? 'disabled' : ''}>${value}</button>`).join('');
    el.answers.querySelectorAll('[data-answer]').forEach((button) => {
      button.addEventListener('click', () => chooseAnswer(Number(button.dataset.answer), button));
    });
  }

  function renderEquation() {
    const current = level();
    if (current.division) {
      if (completed) {
        el.equation.textContent = t('demolishFinal');
      } else if (!demolished) {
        el.equation.textContent = t('demolishLogStart');
      } else {
        el.equation.textContent = t('demolishLog', demolished, current.per * demolished, current.total - current.per * demolished);
      }
      return;
    }
    const solved = zonesFor(current).filter((zone) => built.has(zone.id));
    if (!solved.length) {
      el.equation.textContent = t('equationStart', current.a, current.b);
      return;
    }
    const chips = solved.map((zone) => `<span style="--zc:${zone.color}">${zone.value}</span>`).join(' + ');
    el.equation.innerHTML = completed
      ? `${current.a} × ${current.b} = ${chips} = ${current.a * current.b}`
      : chips;
  }

  function render() {
    const current = level();
    el.badge.textContent = current.division ? `${current.total} ÷ ${current.per}` : `${current.a} × ${current.b}`;
    el.mission.textContent = t('missions')[levelIndex];
    el.topRuler.textContent = current.division ? current.per : current.a;
    el.sideRuler.textContent = current.division ? '?' : current.b;
    el.demolish.hidden = !current.division;
    el.demolish.disabled = Boolean(current.division && (completed || demolished >= current.floors));
    el.reset.setAttribute('aria-label', t('reset'));
    renderLevels();
    renderTower();
    renderAnswers();
    renderEquation();
  }

  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.sound.addEventListener('click', () => {
    muted = !muted;
    try {
      localStorage.setItem(MUTE_KEY, String(muted));
    } catch {
      // Sound preference persistence is optional.
    }
    updateSoundButton();
    if (!muted) tone('pop');
  });
  el.hint.addEventListener('click', showHint);
  el.reset.addEventListener('click', resetLevel);
  el.next.addEventListener('click', nextLevel);
  el.demolish.addEventListener('click', demolishFloor);

  window.cool.bindI18n(I18N, {
    onChange(context) {
      t = context.t;
      lang = context.lang;
      theme = context.theme;
      document.title = t('doc');
      el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
      updateSoundButton();
      render();
    },
  });

  resetLevel();
})();
