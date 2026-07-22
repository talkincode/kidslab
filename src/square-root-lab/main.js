/* 平方根建筑师 · Square Root Builder */
(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '平方根建筑师 · KidsLab', back: '返回平台', title: '平方根建筑师',
      eyebrow: 'AREA → SIDE · 面积反推边长',
      mission: '给我正方形的面积，我来找边长。',
      hint: '输入一个不小于 0 的数，看看哪条边乘自己刚好得到它。',
      exploreTab: '自由探索', challengeTab: '闯关', areaLabel: '正方形面积 A',
      inputHelp: '请输入零到一万亿之间的数', calculate: '开始测量', try: '试一试', blueprint: '建筑蓝图',
      drawingEyebrow: 'LIVE BLUEPRINT · 实时蓝图', drawingTitle: '这条边，就是 √A', next: '下一题',
      soundOn: '关闭声音', soundOff: '打开声音', theme: '切换主题', lang: 'Switch to English',
      modeLabel: '学习模式', quickLabel: '快速示例', canvasLabel: '平方根面积示意图',
      empty: '先写下一个面积。', invalid: '面积不能是负数；实数范围内，负数没有平方根。',
      tooLarge: '请把面积控制在 0 到 1 万亿之间。', measured: '测量完成：平方根就是这块正方形的边长。',
      perfect: (root) => `刚好！${format(root)} × ${format(root)} 拼成完整正方形。`,
      approx: (lo, hi) => `还差一点拼成整格：答案在 ${format(lo)} 和 ${format(hi)} 之间。`,
      zero: '0 的算术平方根是 0。',
      boundsPerfect: (root, area) => `${format(root)}² = ${format(area)}`,
      boundsBetween: (lo, area, hi) => `${format(lo)}² < ${format(area)} < ${format(hi)}²`,
      equation: (root, area, exact) => `${format(root, exact ? 8 : 4)} × ${format(root, exact ? 8 : 4)} ${exact ? '=' : '≈'} ${format(area)}`,
      insightPerfect: (root, area) => `√${format(area)} = ${format(root)}，因为 ${format(root)}² = ${format(area)}。`,
      insightBetween: (area, lo, hi) => `√${format(area)} 在 ${format(lo)} 和 ${format(hi)} 之间，因为 ${format(lo)}² = ${format(lo * lo)}，${format(hi)}² = ${format(hi * hi)}。`,
      areaStamp: (area) => `A = ${format(area)}`,
      correct: '蓝图吻合！这一步算对了。', wrong: '这块尺寸对不上，再看一眼平方或夹逼范围。',
      completed: '五张蓝图全部通过！你已经会从面积反推边长了。', restart: '再闯一轮',
      level: (n, total) => `${n} / ${total}`,
      challengeQuestions: [
        { prompt: '一块正方形地砖面积是 49 cm²，边长是多少？', choices: ['6 cm', '7 cm', '8 cm'] },
        { prompt: '√20 在哪两个相邻整数之间？', choices: ['3 和 4', '4 和 5', '5 和 6'] },
        { prompt: '√72 化简后是哪一项？', choices: ['3√8', '6√2', '8√2'] },
        { prompt: '√10 保留两位小数约是多少？', choices: ['3.06', '3.16', '3.26'] },
        { prompt: '哪个数的算术平方根是 12？', choices: ['24', '122', '144'] },
      ],
    },
    en: {
      doc: 'Square Root Builder · KidsLab', back: 'Back to platform', title: 'Square Root Builder',
      eyebrow: 'AREA → SIDE · REVERSE THE SQUARE',
      mission: 'Give me a square’s area. I’ll find its side.',
      hint: 'Enter any number from 0 up and find the side that multiplies by itself to make it.',
      exploreTab: 'Explore', challengeTab: 'Challenge', areaLabel: 'Square area A',
      inputHelp: 'Enter a number from zero to one trillion', calculate: 'Measure it', try: 'Try', blueprint: 'BUILDING PLAN',
      drawingEyebrow: 'LIVE BLUEPRINT', drawingTitle: 'This side is √A', next: 'Next plan',
      soundOn: 'Mute sound', soundOff: 'Turn sound on', theme: 'Toggle theme', lang: '切换到中文',
      modeLabel: 'Learning mode', quickLabel: 'Quick examples', canvasLabel: 'Square-root area diagram',
      empty: 'Write an area first.', invalid: 'Area cannot be negative. Negative numbers have no real square roots.',
      tooLarge: 'Keep the area between 0 and one trillion.', measured: 'Measured: the square root is the side length of this square.',
      perfect: (root) => `Perfect fit! ${format(root)} × ${format(root)} makes the whole square.`,
      approx: (lo, hi) => `It falls between grid lines: the answer is between ${format(lo)} and ${format(hi)}.`,
      zero: 'The principal square root of 0 is 0.',
      boundsPerfect: (root, area) => `${format(root)}² = ${format(area)}`,
      boundsBetween: (lo, area, hi) => `${format(lo)}² < ${format(area)} < ${format(hi)}²`,
      equation: (root, area, exact) => `${format(root, exact ? 8 : 4)} × ${format(root, exact ? 8 : 4)} ${exact ? '=' : '≈'} ${format(area)}`,
      insightPerfect: (root, area) => `√${format(area)} = ${format(root)} because ${format(root)}² = ${format(area)}.`,
      insightBetween: (area, lo, hi) => `√${format(area)} is between ${format(lo)} and ${format(hi)} because ${format(lo)}² = ${format(lo * lo)} and ${format(hi)}² = ${format(hi * hi)}.`,
      areaStamp: (area) => `A = ${format(area)}`,
      correct: 'Blueprint matched! That step is right.', wrong: 'That size does not fit. Check the square or the integer bounds.',
      completed: 'All five plans passed! You can now reverse an area to find its side.', restart: 'Play again',
      level: (n, total) => `${n} / ${total}`,
      challengeQuestions: [
        { prompt: 'A square tile has area 49 cm². What is its side length?', choices: ['6 cm', '7 cm', '8 cm'] },
        { prompt: 'Between which consecutive integers is √20?', choices: ['3 and 4', '4 and 5', '5 and 6'] },
        { prompt: 'Which is the simplified form of √72?', choices: ['3√8', '6√2', '8√2'] },
        { prompt: 'What is √10 rounded to two decimal places?', choices: ['3.06', '3.16', '3.26'] },
        { prompt: 'Which number has principal square root 12?', choices: ['24', '122', '144'] },
      ],
    },
  };

  const CHALLENGES = [
    { answer: 1, area: 49 },
    { answer: 1, area: 20 },
    { answer: 1, area: 72 },
    { answer: 1, area: 10 },
    { answer: 2, area: 144 },
  ];
  const MAX_AREA = 1_000_000_000_000;
  const SOUND_KEY = 'kidslab.square-root-lab.sound';
  const $ = (selector) => document.querySelector(selector);
  let t = (key) => key;
  let lang = window.cool.preferences.lang;
  let currentArea = 72;
  let challengeIndex = 0;
  let challengeSolved = false;
  let audioContext = null;
  let muted = false;
  try { muted = localStorage.getItem(SOUND_KEY) === 'off'; } catch { muted = false; }

  const canvas = $('#squareCanvas');
  const ctx = canvas.getContext('2d');

  function format(value, digits = 6) {
    if (!Number.isFinite(value)) return '—';
    if (Math.abs(value) >= 1e9) return value.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', { maximumFractionDigits: 2 });
    const rounded = Number(value.toFixed(digits));
    return rounded.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', { maximumFractionDigits: digits, useGrouping: false });
  }

  function isExactRoot(area, root) {
    if (Number.isInteger(root)) return true;
    const shortRoot = Number(root.toFixed(8));
    return Math.abs(shortRoot * shortRoot - area) <= Math.max(1, area) * 1e-14;
  }

  function simplifiedRadical(area) {
    if (!Number.isSafeInteger(area) || area < 2 || area > 1_000_000) return null;
    const root = Math.sqrt(area);
    if (Number.isInteger(root)) return null;
    for (let factor = Math.floor(root); factor >= 2; factor -= 1) {
      const square = factor * factor;
      if (area % square === 0) return { outside: factor, inside: area / square };
    }
    return null;
  }

  function resultExpression(area, root, exact) {
    const left = `√${format(area)}`;
    if (exact) return `${left} = ${format(root)}`;
    const simplified = simplifiedRadical(area);
    const exactPart = simplified ? `${simplified.outside}√${simplified.inside}` : left;
    return simplified ? `${left} = ${exactPart} ≈ ${format(root, 4)}` : `${left} ≈ ${format(root, 4)}`;
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); } catch { /* storage can be unavailable */ }
  }

  function setMuted(nextMuted) {
    muted = nextMuted;
    safeStorageSet(SOUND_KEY, muted ? 'off' : 'on');
    if (audioContext && muted) audioContext.suspend().catch(() => {});
    renderSoundButton();
  }

  function renderSoundButton() {
    const button = $('#soundBtn');
    button.textContent = muted ? '🔇' : '🔊';
    button.setAttribute('aria-pressed', String(muted));
    button.setAttribute('aria-label', t(muted ? 'soundOff' : 'soundOn'));
  }

  function tone(kind) {
    if (muted) return;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;
      audioContext ||= new AudioCtor();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const now = audioContext.currentTime;
      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(kind === 'error' ? 0.045 : 0.065, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'complete' ? 0.62 : 0.24));
      gain.connect(audioContext.destination);
      const notes = {
        tap: [330], success: [523, 659], error: [190, 150], complete: [523, 659, 784],
      }[kind] || [330];
      notes.forEach((frequency, index) => {
        const osc = audioContext.createOscillator();
        osc.type = kind === 'error' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(frequency, now + index * 0.1);
        osc.connect(gain);
        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + (kind === 'complete' ? 0.28 : 0.17));
      });
    } catch { /* audio is optional */ }
  }

  function validateArea(raw) {
    if (String(raw).trim() === '') return { error: 'empty' };
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0) return { error: 'invalid' };
    if (value > MAX_AREA) return { error: 'tooLarge' };
    return { value };
  }

  function showArea(area, { announce = true, playSound = true } = {}) {
    currentArea = area;
    const root = Math.sqrt(area);
    const exact = isExactRoot(area, root);
    const lower = Math.floor(root);
    const upper = Math.ceil(root);

    $('#areaInput').value = String(area);
    $('#areaStamp').textContent = t('areaStamp', area);
    $('#resultValue').textContent = resultExpression(area, root, exact);
    $('#boundsText').textContent = exact ? t('boundsPerfect', root, area) : t('boundsBetween', lower, area, upper);
    $('#sideEquation').textContent = t('equation', root, area, exact);
    $('#insightText').textContent = exact ? t('insightPerfect', root, area) : t('insightBetween', area, lower, upper);
    const feedback = $('#feedback');
    feedback.className = 'feedback is-success';
    feedback.textContent = area === 0 ? t('zero') : exact ? t('perfect', root) : t('approx', lower, upper);
    drawSquare();
    if (announce) {
      window.cool?.stage('explore');
      window.cool?.track('measure_area', { value: area });
    }
    if (playSound) tone(exact ? 'success' : 'tap');
  }

  function calculate() {
    const parsed = validateArea($('#areaInput').value);
    if (parsed.error) {
      const feedback = $('#feedback');
      feedback.className = 'feedback is-error';
      feedback.textContent = t(parsed.error);
      tone('error');
      window.cool?.track('invalid_area');
      return;
    }
    showArea(parsed.value);
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawSquare();
  }

  function roundRect(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, r);
  }

  function drawArrow(x1, y1, x2, y2, color) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    for (const [x, y, direction] of [[x1, y1, angle], [x2, y2, angle + Math.PI]]) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(direction + 0.55) * 8, y + Math.sin(direction + 0.55) * 8);
      ctx.lineTo(x + Math.cos(direction - 0.55) * 8, y + Math.sin(direction - 0.55) * 8);
      ctx.closePath(); ctx.fill();
    }
  }

  function drawSquare() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);

    const area = currentArea;
    const root = Math.sqrt(area);
    const exact = isExactRoot(area, root);
    const lower = Math.floor(root);
    const upper = Math.ceil(root);
    const available = Math.max(70, Math.min(width - 118, height - 64, 310));
    const normalizer = Math.max(upper, 1);
    const size = area === 0 ? 8 : Math.max(40, available * (root / normalizer));
    const guideSize = Math.max(available, size);
    const cx = width / 2;
    const cy = height / 2 - 2;
    const x = cx - size / 2;
    const y = cy - size / 2;
    const gx = cx - guideSize / 2;
    const gy = cy - guideSize / 2;

    ctx.save();
    ctx.setLineDash([7, 7]);
    ctx.strokeStyle = cssVar('--blueprint-soft');
    ctx.lineWidth = 1.5;
    ctx.strokeRect(gx, gy, guideSize, guideSize);
    ctx.setLineDash([]);

    const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
    gradient.addColorStop(0, cssVar('--yellow'));
    gradient.addColorStop(1, cssVar('--orange'));
    ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
    ctx.shadowBlur = 16;
    roundRect(x, y, size, size, Math.min(18, size * 0.08));
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = cssVar('--blueprint-deep');
    ctx.lineWidth = 2.5;
    ctx.stroke();

    if (exact && Number.isInteger(root) && root > 0 && root <= 16) {
      ctx.strokeStyle = 'rgba(23, 45, 62, 0.32)';
      ctx.lineWidth = 1;
      for (let index = 1; index < root; index += 1) {
        const offset = (size * index) / root;
        ctx.beginPath(); ctx.moveTo(x + offset, y); ctx.lineTo(x + offset, y + size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y + offset); ctx.lineTo(x + size, y + offset); ctx.stroke();
      }
    }

    const lineColor = cssVar('--blueprint-line');
    drawArrow(x, y + size + 22, x + size, y + size + 22, lineColor);
    ctx.fillStyle = lineColor;
    ctx.font = `800 ${width < 430 ? 14 : 16}px ${cssVar('--font-body') || 'sans-serif'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`√${format(area)} ${exact ? '=' : '≈'} ${format(root, 4)}`, cx, y + size + 43);

    ctx.save();
    ctx.translate(x - 27, cy);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`√A`, 0, 0);
    ctx.restore();

    ctx.fillStyle = cssVar('--ink-on-yellow');
    ctx.font = `900 ${Math.max(15, Math.min(28, size * 0.16))}px ${cssVar('--font-display') || 'serif'}`;
    ctx.fillText(`A = ${format(area)}`, cx, cy);

    if (!exact && area > 0) {
      ctx.fillStyle = lineColor;
      ctx.font = `800 13px ${cssVar('--font-body') || 'sans-serif'}`;
      ctx.textAlign = 'left';
      ctx.fillText(`${lower}²`, gx + guideSize + 10, gy + guideSize - 8);
      ctx.fillText(`${upper}²`, gx + guideSize + 10, gy + 8);
    }
    ctx.restore();
  }

  function renderMode(mode) {
    const explore = mode === 'explore';
    $('#explorePanel').hidden = !explore;
    $('#challengePanel').hidden = explore;
    $('#exploreTab').classList.toggle('is-active', explore);
    $('#challengeTab').classList.toggle('is-active', !explore);
    $('#exploreTab').setAttribute('aria-selected', String(explore));
    $('#challengeTab').setAttribute('aria-selected', String(!explore));
    if (!explore) {
      challengeIndex = 0;
      challengeSolved = false;
      renderChallenge();
      window.cool?.stage('challenge');
      window.cool?.track('start_root_challenge');
    }
    requestAnimationFrame(resizeCanvas);
    tone('tap');
  }

  function renderChallenge() {
    const questionText = t('challengeQuestions')[challengeIndex];
    const challenge = CHALLENGES[challengeIndex];
    $('#levelBadge').textContent = t('level', challengeIndex + 1, CHALLENGES.length);
    $('#streak').textContent = `${'◆ '.repeat(challengeIndex)}${'◇ '.repeat(CHALLENGES.length - challengeIndex)}`.trim();
    $('#challengePrompt').textContent = questionText.prompt;
    $('#challengeFeedback').textContent = '';
    $('#challengeFeedback').className = 'challenge-feedback';
    $('#nextChallenge').hidden = true;
    $('#nextChallenge').textContent = t('next');
    const grid = $('#choiceGrid');
    grid.innerHTML = '';
    questionText.choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice-btn';
      button.textContent = choice;
      button.dataset.choice = String(index);
      button.addEventListener('click', () => chooseAnswer(index, button));
      grid.appendChild(button);
    });
    showArea(challenge.area, { announce: false, playSound: false });
    $('#feedback').textContent = '';
  }

  function chooseAnswer(index, button) {
    if (challengeSolved) return;
    const challenge = CHALLENGES[challengeIndex];
    const feedback = $('#challengeFeedback');
    if (index !== challenge.answer) {
      button.classList.add('is-wrong');
      feedback.className = 'challenge-feedback is-error';
      feedback.textContent = t('wrong');
      tone('error');
      window.cool?.track('root_answer_retry', { value: challengeIndex + 1 });
      setTimeout(() => button.classList.remove('is-wrong'), 450);
      return;
    }
    challengeSolved = true;
    button.classList.add('is-correct');
    $('#choiceGrid').querySelectorAll('button').forEach((choice) => { choice.disabled = true; });
    feedback.className = 'challenge-feedback is-success';
    feedback.textContent = challengeIndex === CHALLENGES.length - 1 ? t('completed') : t('correct');
    $('#streak').textContent = `${'◆ '.repeat(challengeIndex + 1)}${'◇ '.repeat(CHALLENGES.length - challengeIndex - 1)}`.trim();
    const next = $('#nextChallenge');
    next.hidden = false;
    if (challengeIndex === CHALLENGES.length - 1) {
      next.textContent = t('restart');
      window.cool?.complete?.();
      window.cool?.track('complete_root_challenge');
      tone('complete');
    } else {
      tone('success');
    }
  }

  function nextChallenge() {
    if (!challengeSolved) return;
    challengeIndex = challengeIndex === CHALLENGES.length - 1 ? 0 : challengeIndex + 1;
    challengeSolved = false;
    renderChallenge();
    tone('tap');
  }

  function renderLanguageAndTheme(theme) {
    document.title = t('doc');
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    $('#langBtn').textContent = lang === 'zh' ? 'EN' : '中';
    $('#langBtn').setAttribute('aria-label', t('lang'));
    $('#themeBtn').textContent = theme === 'light' ? '🌙' : '☀️';
    $('#themeBtn').setAttribute('aria-label', t('theme'));
    $('.back-pill').setAttribute('aria-label', t('back'));
    $('.mode-tabs').setAttribute('aria-label', t('modeLabel'));
    $('.quick-picks').setAttribute('aria-label', t('quickLabel'));
    canvas.setAttribute('aria-label', t('canvasLabel'));
    renderSoundButton();
    if (!$('#challengePanel').hidden) {
      challengeSolved = false;
      renderChallenge();
    } else {
      showArea(currentArea, { announce: false, playSound: false });
    }
    requestAnimationFrame(resizeCanvas);
  }

  $('#calculateBtn').addEventListener('click', calculate);
  $('#areaInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') calculate();
  });
  document.querySelectorAll('.quick-picks button').forEach((button) => {
    button.addEventListener('click', () => showArea(Number(button.dataset.value)));
  });
  document.querySelectorAll('.mode-tab').forEach((button) => {
    button.addEventListener('click', () => renderMode(button.dataset.mode));
  });
  $('#nextChallenge').addEventListener('click', nextChallenge);
  $('#langBtn').addEventListener('click', () => window.cool.preferences.toggleLang());
  $('#themeBtn').addEventListener('click', () => window.cool.preferences.toggleTheme());
  $('#soundBtn').addEventListener('click', () => {
    setMuted(!muted);
    if (!muted) tone('tap');
  });
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('themechange', resizeCanvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && audioContext?.state === 'running') audioContext.suspend().catch(() => {});
  });

  window.cool.bindI18n(I18N, {
    onChange({ lang: nextLang, theme, t: translate }) {
      lang = nextLang;
      t = translate;
      renderLanguageAndTheme(theme);
    },
  });
})();
