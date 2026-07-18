(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '格子大厦 · KidsLab',
      back: '返回平台',
      title: '格子大厦',
      eyebrow: '面积模型施工队',
      tip0: '点一块施工区，算对房间数，就能把整栋楼盖起来。',
      mission: '今日任务',
      chooseZone: '选中施工区后，在这里报数',
      hint: '💡 看施工提示',
      reset: '重新开始',
      inspection: '验收通过',
      levels: ['热身楼', '摩天楼', '拆迁队'],
      missions: ['盖一座 13 × 6 的公寓', '盖一座 23 × 14 的摩天楼', '把 312 间房拆成每层 24 间'],
      start: '先点亮一块施工区！',
      select: (a, b) => `这块是 ${a} × ${b}，一共有多少间？`,
      correct: (n) => `${n} 间，施工正确！继续盖下一块。`,
      wrong: '这批窗户装不下，再算一次。别担心，施工图不会消失。',
      totalAsk: (a, b) => `施工区都盖好啦！整栋 ${a} × ${b} 有多少间？`,
      divisionAsk: '312 间房，每层 24 间，一共能拆成几层？',
      totalCorrect: '总数核对正确，准备封顶！',
      hintZone: (a, b) => `数格子：每行 ${a} 间，共 ${b} 行。也可以把 ${a} 连加 ${b} 次。`,
      hintTotal: '把每块施工区的房间数加起来，就是整栋楼的房间数。',
      hintDivision: '反过来想：24 乘几等于 312？施工图里竖着有几层？',
      completeTitles: ['第一栋楼封顶！', '摩天楼全部亮灯！', '拆迁规划完成！'],
      completeTexts: [
        '13 × 6 = 10 × 6 + 3 × 6 = 78。把 13 拆成 10 和 3，算起来更轻松。',
        '23 × 14 = 20 × 10 + 20 × 4 + 3 × 10 + 3 × 4 = 322。',
        '312 ÷ 24 = 13，因为 24 × 13 = 312。除法也能用乘法施工图检查。',
      ],
      next: '下一张施工图',
      replay: '重新挑战',
      equationStart: (a, b) => `${a} × ${b} = 等待施工…`,
      equationParts: (parts) => parts.join(' + '),
      equationTotal: (parts, total) => `${parts.join(' + ')} = ${total}`,
      divisionEquation: (total, a, b) => `${total} ÷ ${a} = ${b}`,
      locked: '先完成前一张施工图',
    },
    en: {
      doc: 'Grid Tower · KidsLab',
      back: 'Back to platform',
      title: 'Grid Tower',
      eyebrow: 'Area Model Build Crew',
      tip0: 'Tap a building zone, solve its rooms, and build the whole tower.',
      mission: 'Today’s mission',
      chooseZone: 'Select a zone, then report the room count here',
      hint: '💡 Construction hint',
      reset: 'Restart',
      inspection: 'Inspection passed',
      levels: ['Warm-up', 'Skyscraper', 'Demolition'],
      missions: ['Build a 13 × 6 apartment', 'Build a 23 × 14 skyscraper', 'Split 312 rooms into floors of 24'],
      start: 'Light up a construction zone first!',
      select: (a, b) => `This zone is ${a} × ${b}. How many rooms?`,
      correct: (n) => `${n} rooms — correct! Build the next zone.`,
      wrong: 'Those windows will not fit. Try the multiplication again; your plan is safe.',
      totalAsk: (a, b) => `All zones are built! How many rooms in ${a} × ${b}?`,
      divisionAsk: '312 rooms, 24 on each floor. How many floors?',
      totalCorrect: 'The total checks out. Ready to top out!',
      hintZone: (a, b) => `Count the grid: ${a} rooms in each row and ${b} rows. Or add ${a}, ${b} times.`,
      hintTotal: 'Add the room counts from every zone to get the whole building.',
      hintDivision: 'Think backward: 24 times what equals 312? How many rows are in the plan?',
      completeTitles: ['First tower topped out!', 'Every skyscraper light is on!', 'Demolition plan complete!'],
      completeTexts: [
        '13 × 6 = 10 × 6 + 3 × 6 = 78. Splitting 13 into 10 and 3 makes the work easier.',
        '23 × 14 = 20 × 10 + 20 × 4 + 3 × 10 + 3 × 4 = 322.',
        '312 ÷ 24 = 13 because 24 × 13 = 312. Division can be checked with a multiplication plan.',
      ],
      next: 'Next blueprint',
      replay: 'Challenge again',
      equationStart: (a, b) => `${a} × ${b} = waiting for construction…`,
      equationParts: (parts) => parts.join(' + '),
      equationTotal: (parts, total) => `${parts.join(' + ')} = ${total}`,
      divisionEquation: (total, a, b) => `${total} ÷ ${a} = ${b}`,
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
      a: 24,
      b: 13,
      columns: [20, 4],
      rows: [10, 3],
      answers: {
        200: [200, 240, 140, 30],
        40: [40, 14, 80, 24],
        60: [60, 23, 80, 72],
        12: [12, 7, 16, 24],
        total: [12, 13, 14, 24],
      },
      division: true,
      total: 312,
    },
  ];

  const $ = (selector) => document.querySelector(selector);
  const SAVE_KEY = 'kidslab.grid-tower';
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
    badge: $('#siteBadge'),
    levels: $('#levelStrip'),
    mission: $('#missionTitle'),
    topRuler: $('#topRuler'),
    sideRuler: $('#sideRuler'),
    tower: $('#tower'),
    equation: $('#equation'),
    feedback: $('#feedback'),
    foreman: $('#foremanFace'),
    question: $('#questionText'),
    answers: $('#answerGrid'),
    hint: $('#hintBtn'),
    reset: $('#resetBtn'),
    modal: $('#modal'),
    modalTitle: $('#modalTitle'),
    modalText: $('#modalText'),
    celebration: $('#celebration'),
    next: $('#nextBtn'),
  };

  let t = (key) => key;
  let lang = window.cool.preferences.lang;
  let theme = window.cool.preferences.theme;
  let levelIndex = Math.min(2, Math.max(0, Number(saved.level) || 0));
  let unlocked = Math.min(2, Math.max(levelIndex, Number(saved.unlocked) || 0));
  let built = new Set();
  let selected = null;
  let askingTotal = false;
  let wrongCount = 0;
  let completed = false;

  function level() {
    return LEVELS[levelIndex];
  }

  function zonesFor(current) {
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

  function setFeedback(message, face = '👷') {
    el.feedback.textContent = message;
    el.foreman.textContent = face;
  }

  function selectZone(id) {
    if (completed || askingTotal || built.has(id)) return;
    selected = zonesFor(level()).find((zone) => zone.id === id) || null;
    if (!selected) return;
    wrongCount = 0;
    setFeedback(t('select', selected.a, selected.b), '👷‍♀️');
    window.cool.track('select_building_zone');
    render();
  }

  function chooseAnswer(value, button) {
    if (completed) return;
    const expected = askingTotal
      ? (level().division ? level().b : level().a * level().b)
      : selected?.value;
    if (expected == null) return;

    if (value !== expected) {
      wrongCount += 1;
      button.classList.add('is-wrong');
      selected && document.querySelector(`[data-zone="${selected.id}"]`)?.classList.add('is-wrong');
      setFeedback(t('wrong'), '🧑‍🔧');
      window.cool.track('retry_room_count');
      setTimeout(() => {
        button.classList.remove('is-wrong');
        document.querySelector('.zone.is-wrong')?.classList.remove('is-wrong');
      }, 340);
      return;
    }

    button.classList.add('is-right');
    if (askingTotal) {
      completed = true;
      setFeedback(t('totalCorrect'), '🎉');
      window.cool.track(level().division ? 'solve_division_plan' : 'finish_tower');
      setTimeout(showCompletion, 380);
      render();
      return;
    }

    built.add(selected.id);
    setFeedback(t('correct', selected.value), '👷‍♀️');
    selected = null;
    wrongCount = 0;
    window.cool.track('build_zone');
    if (built.size === zonesFor(level()).length) {
      askingTotal = true;
      setFeedback(level().division ? t('divisionAsk') : t('totalAsk', level().a, level().b), '🧮');
    }
    render();
  }

  function showHint() {
    if (askingTotal) {
      setFeedback(level().division ? t('hintDivision') : t('hintTotal'), '💡');
    } else if (selected) {
      setFeedback(t('hintZone', selected.a, selected.b), '💡');
    } else {
      const first = zonesFor(level()).find((zone) => !built.has(zone.id));
      if (first) {
        selected = first;
        setFeedback(t('select', first.a, first.b), '👉');
      }
    }
    window.cool.track('open_construction_hint');
    render();
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
    el.next.textContent = levelIndex === LEVELS.length - 1 ? t('replay') : t('next');
    el.modal.hidden = false;
    renderLevels();
  }

  function resetLevel() {
    built = new Set();
    selected = null;
    askingTotal = false;
    wrongCount = 0;
    completed = false;
    el.modal.hidden = true;
    setFeedback(t('start'));
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

  function renderTower() {
    const current = level();
    el.tower.style.gridTemplateColumns = current.columns.map((n) => `${n}fr`).join(' ');
    el.tower.style.gridTemplateRows = current.rows.map((n) => `${n}fr`).join(' ');
    el.tower.innerHTML = zonesFor(current).map((zone) => {
      const isBuilt = built.has(zone.id);
      const isSelected = selected?.id === zone.id;
      const math = isBuilt ? `${zone.a} × ${zone.b} = ${zone.value}` : `${zone.a} × ${zone.b} = ?`;
      return `<button class="zone ${isBuilt ? 'is-built' : ''} ${isSelected ? 'is-selected' : ''}" type="button" data-zone="${zone.id}" style="grid-area:${zone.row}/${zone.column}" aria-label="${math}"><span class="zone__math">${math}</span></button>`;
    }).join('');
    el.tower.querySelectorAll('[data-zone]').forEach((zone) => {
      zone.addEventListener('click', () => selectZone(zone.dataset.zone));
    });
  }

  function renderAnswers() {
    let options = [];
    let prompt = '—';
    if (askingTotal) {
      options = level().answers.total;
      prompt = level().division ? `${level().total} ÷ ${level().a} = ?` : `${level().a} × ${level().b} = ?`;
    } else if (selected) {
      options = level().answers[selected.value];
      prompt = `${selected.a} × ${selected.b} = ?`;
    }
    el.question.textContent = prompt;
    el.answers.innerHTML = shuffle(options, levelIndex + (selected?.value || 0)).map((value) =>
      `<button class="answer" type="button" data-answer="${value}">${value}</button>`).join('');
    el.answers.querySelectorAll('[data-answer]').forEach((button) => {
      button.addEventListener('click', () => chooseAnswer(Number(button.dataset.answer), button));
    });
  }

  function renderEquation() {
    const current = level();
    const solved = zonesFor(current).filter((zone) => built.has(zone.id)).map((zone) => zone.value);
    if (!solved.length) {
      el.equation.textContent = t('equationStart', current.a, current.b);
      return;
    }
    if (completed) {
      el.equation.innerHTML = current.division
        ? t('divisionEquation', current.total, current.a, current.b)
        : `${current.a} × ${current.b} = ${t('equationTotal', solved, current.a * current.b)}`;
      return;
    }
    el.equation.innerHTML = t('equationParts', solved.map((n) => `<span>${n}</span>`));
  }

  function render() {
    const current = level();
    el.badge.textContent = current.division ? `${current.total} ÷ ${current.a}` : `${current.a} × ${current.b}`;
    el.mission.textContent = t('missions')[levelIndex];
    el.topRuler.textContent = current.a;
    el.sideRuler.textContent = current.b;
    el.reset.setAttribute('aria-label', t('reset'));
    renderLevels();
    renderTower();
    renderAnswers();
    renderEquation();
  }

  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
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
      render();
    },
  });

  resetLevel();
})();
