(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '三角形实验室 · KidsLab',
      back: '返回平台',
      title: '三角形实验室',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      missionsLabel: '实验项目',
      missionLabel: (n, title) => `实验 ${n}：${title}`,
      lockedMission: '先完成上一个实验',
      records: '记录',
      loadElephant: '放上大象',
      testAgain: '再次放上大象',
      addBrace: '加一根斜撑',
      braceAdded: '斜撑已安装',
      tearAngles: '撕下三个角',
      anglesTorn: '三个角已拼好',
      newTriangle: '换个三角形',
      stickQuestion: '这三根木条能围成三角形吗？',
      canBuild: '能围成',
      cannotBuild: '围不成',
      hint: '轻提示',
      nextLab: '去下一个实验',
      finalKicker: '三项实验记录完成',
      finalTitle: '三角形专家认证！',
      finalText: '你用斜撑造出稳定结构，把三个内角拼成 180°，还找到了木条能围成三角形的严格条件。',
      playAgain: '重新做实验',
      phase1Kicker: '实验一 · 结构抗震',
      phase1Title: '斜撑让货架不再变形',
      phase1Text: '先放上大象测试方框，再加斜撑重试。',
      phase1Console: '让货架经受重量测试',
      phase1Lesson: '方框能在边长不变时改变角度；一根斜撑会把它分成两个稳定的三角形。',
      phase1Ready: '方框看着结实，真的扛得住吗？先放上大象。',
      phase1Collapsed: '哐当！边长没变，四个角却能活动，货架歪了。加根斜撑再试。',
      phase1Braced: '斜撑把方框分成两个三角形。现在再放一次大象。',
      phase1Success: '稳稳托住！固定边长的三角形不能随便改变角度。',
      phase1Hint: '方框缺少限制角度的边。试着从一个角连到对角。',
      phase2Kicker: '实验二 · 角的拼图',
      phase2Title: '三个内角拼成一条直线',
      phase2Text: '拖动任意顶点改变三角形，再把三个角撕下来。',
      phase2Console: '改变形状，再收集三个内角',
      phase2Lesson: '三角形形状可以改变，但三个内角放在一起总是一个 180° 的平角。',
      phase2Ready: '拖动三个圆点改变形状。角度会实时变化，但总和不会变。',
      phase2Changed: '新形状完成。三个角变了，看看总和有没有变。',
      phase2Success: (a, b, c) => `${a}° + ${b}° + ${c}° = 180°，正好拼成平角！`,
      phase2Hint: '盯住三个角度数字：一个变大时，另外的角会一起补偿。',
      phase3Kicker: '实验三 · 木条围栏',
      phase3Title: '两根短边必须够得着',
      phase3Text: '判断三组木条能否首尾相接，等于也不算围成。',
      phase3Console: '检查三边关系',
      phase3Lesson: '找出最长边。另两边之和必须严格大于它，三个端点才围得起来。',
      phase3Ready: (a, b, c) => `第 1 组：${a}、${b}、${c}。两根短边够不够跨过最长边？`,
      phase3Prompt: (n, a, b, c) => `第 ${n} 组：${a}、${b}、${c}。先比较，再判断。`,
      phase3Wrong: (a, b, c) => `再算一次：${a} + ${b} 和 ${c} 是什么关系？错误判断不会换题。`,
      phase3CorrectBuild: (a, b, c) => `正确！${a} + ${b} > ${c}，而且另外两组边也满足，木条围起来了。`,
      phase3CorrectNo: (a, b, c, symbol) => `正确！${a} + ${b} ${symbol} ${c}，两根短边够不着或只能排直线。`,
      phase3Done: '三组三边关系都判断正确，实验记录完整！',
      phase3Hint: '先找最长的一根，再把另外两根相加。注意条件是“大于”，不是“大于或等于”。',
      shelfLabel: 'SQUARE FRAME / 方框货架',
      angleLabel: 'ANGLE TABLE / 内角拼台',
      sticksLabel: 'STICK RACK / 木条架',
      formulaStable: '斜撑 → 2 个三角形 → 形状稳定',
      formulaAngles: '三角形内角和 = 180°',
      restored: '已恢复上次实验进度。',
    },
    en: {
      doc: 'Triangle Lab · KidsLab',
      back: 'Back to platform',
      title: 'Triangle Lab',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      missionsLabel: 'Lab stations',
      missionLabel: (n, title) => `Lab ${n}: ${title}`,
      lockedMission: 'Finish the previous lab first',
      records: 'Records',
      loadElephant: 'Load the elephant',
      testAgain: 'Load it again',
      addBrace: 'Add a diagonal brace',
      braceAdded: 'Brace installed',
      tearAngles: 'Tear off three corners',
      anglesTorn: 'Corners assembled',
      newTriangle: 'Try another triangle',
      stickQuestion: 'Can these three sticks enclose a triangle?',
      canBuild: 'Yes, they can',
      cannotBuild: 'No, they cannot',
      hint: 'Small hint',
      nextLab: 'Next lab',
      finalKicker: 'ALL THREE LAB RECORDS COMPLETE',
      finalTitle: 'Certified Triangle Expert!',
      finalText: 'You made a stable structure with a brace, assembled three interior angles into 180°, and found the strict rule for three sticks to enclose a triangle.',
      playAgain: 'Run the labs again',
      phase1Kicker: 'LAB ONE · STRUCTURE TEST',
      phase1Title: 'A Diagonal Brace Stops the Wobble',
      phase1Text: 'Load the square frame first, then add a brace and test again.',
      phase1Console: 'Put the shelf through a load test',
      phase1Lesson: 'A square can change angles without changing side lengths. One diagonal brace splits it into two stable triangles.',
      phase1Ready: 'The square looks strong. Is it? Load the elephant first.',
      phase1Collapsed: 'Crash! The sides stayed the same length, but the corners moved. Add a diagonal brace and retry.',
      phase1Braced: 'The brace split the frame into two triangles. Load the elephant again.',
      phase1Success: 'Rock solid! A triangle with fixed side lengths cannot freely change its angles.',
      phase1Hint: 'The square needs one more segment to control its angles. Connect one corner to the opposite corner.',
      phase2Kicker: 'LAB TWO · CORNER PUZZLE',
      phase2Title: 'Three Angles Make a Straight Line',
      phase2Text: 'Drag any vertex to reshape the triangle, then tear off all three corners.',
      phase2Console: 'Reshape the triangle and collect its corners',
      phase2Lesson: 'A triangle can change shape, but its three interior angles always combine into a 180° straight angle.',
      phase2Ready: 'Drag the three dots to change the shape. The angles change, but their total does not.',
      phase2Changed: 'New shape made. The angles changed—did their total change?',
      phase2Success: (a, b, c) => `${a}° + ${b}° + ${c}° = 180°—a perfect straight angle!`,
      phase2Hint: 'Watch the three angle labels. When one grows, the other angles compensate.',
      phase3Kicker: 'LAB THREE · STICK FENCE',
      phase3Title: 'The Two Short Sides Must Reach',
      phase3Text: 'Judge three stick sets. Equality makes a line, not a triangle.',
      phase3Console: 'Check the triangle inequality',
      phase3Lesson: 'Find the longest side. The other two must add to more than it, or the endpoints cannot enclose a triangle.',
      phase3Ready: (a, b, c) => `Set 1: ${a}, ${b}, ${c}. Can the two short sticks reach across the longest one?`,
      phase3Prompt: (n, a, b, c) => `Set ${n}: ${a}, ${b}, ${c}. Compare first, then decide.`,
      phase3Wrong: (a, b, c) => `Try again: how does ${a} + ${b} compare with ${c}? A wrong answer keeps the same set.`,
      phase3CorrectBuild: (a, b, c) => `Correct! ${a} + ${b} > ${c}, and the other pairs work too. The sticks enclose a triangle.`,
      phase3CorrectNo: (a, b, c, symbol) => `Correct! ${a} + ${b} ${symbol} ${c}, so the short sticks miss or only form a straight line.`,
      phase3Done: 'All three triangle-inequality records are correct!',
      phase3Hint: 'Find the longest stick, then add the other two. The rule says “greater than,” not “greater than or equal to.”',
      shelfLabel: 'SQUARE FRAME / STRUCTURE BENCH',
      angleLabel: 'ANGLE TABLE / CORNER PUZZLE',
      sticksLabel: 'STICK RACK / LENGTH TEST',
      formulaStable: 'brace → 2 triangles → stable shape',
      formulaAngles: 'triangle interior angles = 180°',
      restored: 'Your previous lab progress was restored.',
    },
  };

  const SAVE_KEY = 'kidslab.triangle-lab';
  const SOUND_KEY = 'kidslab.sound.muted';
  const LABS = [
    { kicker: 'phase1Kicker', title: 'phase1Title', text: 'phase1Text', console: 'phase1Console', lesson: 'phase1Lesson', icon: '🏗️' },
    { kicker: 'phase2Kicker', title: 'phase2Title', text: 'phase2Text', console: 'phase2Console', lesson: 'phase2Lesson', icon: '📐' },
    { kicker: 'phase3Kicker', title: 'phase3Title', text: 'phase3Text', console: 'phase3Console', lesson: 'phase3Lesson', icon: '🪵' },
  ];
  const TRIANGLES = [
    [{ x: .22, y: .76 }, { x: .50, y: .18 }, { x: .81, y: .72 }],
    [{ x: .18, y: .70 }, { x: .35, y: .20 }, { x: .84, y: .77 }],
    [{ x: .17, y: .77 }, { x: .68, y: .22 }, { x: .84, y: .72 }],
  ];
  const STICK_SETS = [
    { lengths: [2, 3, 7], canBuild: false },
    { lengths: [4, 5, 6], canBuild: true },
    { lengths: [3, 3, 6], canBuild: false },
  ];

  const $ = (selector) => document.querySelector(selector);
  const el = {
    course: $('.course'),
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    missionNav: $('#missionNav'),
    status: $('#status'),
    recordCount: $('#recordCount'),
    canvasShell: $('#canvasShell'),
    canvas: $('#labCanvas'),
    canvasLabel: $('#canvasLabel'),
    formula: $('#formula'),
    consoleKicker: $('#consoleKicker'),
    consoleTitle: $('#consoleTitle'),
    consoleStamp: $('#consoleStamp'),
    lessonIcon: $('#lessonIcon'),
    lessonText: $('#lessonText'),
    stabilityControls: $('#stabilityControls'),
    angleControls: $('#angleControls'),
    sticksControls: $('#sticksControls'),
    load: $('#loadBtn'),
    brace: $('#braceBtn'),
    tear: $('#tearBtn'),
    newTriangle: $('#newTriangleBtn'),
    canBuild: $('#canBuildBtn'),
    cannotBuild: $('#cannotBuildBtn'),
    hint: $('#hintBtn'),
    next: $('#nextLabBtn'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
    modal: $('#completeModal'),
    playAgain: $('#playAgainBtn'),
  };

  let t = (key, ...args) => {
    const value = I18N.zh[key];
    return typeof value === 'function' ? value(...args) : value;
  };
  let language = 'zh';
  let phase = 0;
  let unlocked = 0;
  let shelfCollapsed = false;
  let braceAdded = false;
  let stabilityDone = false;
  let triangleIndex = 0;
  let vertices = TRIANGLES[0].map((point) => ({ ...point }));
  let angleDone = false;
  let stickIndex = 0;
  let completed = false;
  let statusMessage = { key: 'phase1Ready', tone: '', args: [] };
  let draggingVertex = -1;
  let canvasSize = { width: 1, height: 1, dpr: 1 };

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(2, Math.max(0, Number(saved.unlocked) || 0));
    phase = Math.min(unlocked, Math.max(0, Number(saved.phase) || 0));
    stabilityDone = Boolean(saved.stabilityDone);
    braceAdded = stabilityDone || Boolean(saved.braceAdded);
    angleDone = Boolean(saved.angleDone);
    triangleIndex = Math.min(TRIANGLES.length - 1, Math.max(0, Number(saved.triangleIndex) || 0));
    vertices = TRIANGLES[triangleIndex].map((point) => ({ ...point }));
    stickIndex = Math.min(STICK_SETS.length, Math.max(0, Number(saved.stickIndex) || 0));
    completed = Boolean(saved.completed);
    if (phase === 0) statusMessage = { key: stabilityDone ? 'phase1Success' : braceAdded ? 'phase1Braced' : 'phase1Ready', tone: stabilityDone ? 'good' : '', args: [] };
    if (phase === 1) statusMessage = { key: angleDone ? 'phase2Success' : 'phase2Ready', tone: angleDone ? 'good' : '', args: angleDone ? exactDisplayAngles() : [] };
    if (phase === 2) statusMessage = stickStatus();
  } catch {}

  class SoundEngine {
    constructor() {
      try { this.muted = ['true', '1'].includes(localStorage.getItem(SOUND_KEY)); }
      catch { this.muted = false; }
      this.context = null;
      this.sources = new Set();
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

    tone(frequency, duration = .12, volume = .025, type = 'sine', delay = 0) {
      const context = this.ensure();
      if (!context) return;
      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + .015);
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      this.sources.add(oscillator);
      oscillator.onended = () => this.sources.delete(oscillator);
      oscillator.start(start);
      oscillator.stop(start + duration + .02);
    }

    tap() { this.tone(270, .08, .018, 'triangle'); }
    brace() { [220, 330].forEach((frequency, index) => this.tone(frequency, .13, .023, 'square', index * .05)); }
    error() { this.tone(145, .2, .03, 'sawtooth'); }
    correct() { [392, 523, 659].forEach((frequency, index) => this.tone(frequency, .18, .025, 'triangle', index * .06)); }
    complete() { [392, 494, 587, 784].forEach((frequency, index) => this.tone(frequency, .3, .028, 'triangle', index * .09)); }

    setMuted(muted) {
      this.muted = muted;
      try { localStorage.setItem(SOUND_KEY, String(muted)); } catch {}
      if (muted) {
        this.sources.forEach((source) => {
          try { source.stop(); } catch {}
        });
        this.sources.clear();
      }
    }
  }

  const sound = new SoundEngine();

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        phase, unlocked, braceAdded, stabilityDone, triangleIndex, angleDone, stickIndex, completed,
      }));
    } catch {}
  }

  function setStatus(key, tone = '', args = []) {
    statusMessage = { key, tone, args };
    renderStatus();
  }

  function renderStatus() {
    el.status.textContent = t(statusMessage.key, ...statusMessage.args);
    el.status.className = `status${statusMessage.tone ? ` ${statusMessage.tone}` : ''}`;
  }

  function completedLabs() {
    return Number(stabilityDone) + Number(angleDone) + Number(stickIndex >= STICK_SETS.length);
  }

  function stickStatus() {
    if (stickIndex >= STICK_SETS.length) return { key: 'phase3Done', tone: 'good', args: [] };
    const [a, b, c] = STICK_SETS[stickIndex].lengths;
    return {
      key: stickIndex === 0 ? 'phase3Ready' : 'phase3Prompt',
      tone: '',
      args: stickIndex === 0 ? [a, b, c] : [stickIndex + 1, a, b, c],
    };
  }

  function triangleAngles() {
    return vertices.map((point, index) => {
      const previous = vertices[(index + 2) % 3];
      const next = vertices[(index + 1) % 3];
      const ax = previous.x - point.x;
      const ay = previous.y - point.y;
      const bx = next.x - point.x;
      const by = next.y - point.y;
      const cosine = (ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by));
      return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
    }).map((angle) => Math.round(angle));
  }

  function exactDisplayAngles() {
    const angles = triangleAngles();
    angles[2] = 180 - angles[0] - angles[1];
    return angles;
  }

  function renderNav() {
    el.missionNav.setAttribute('aria-label', t('missionsLabel'));
    el.missionNav.replaceChildren(...LABS.map((lab, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `mission-btn${index === phase ? ' current' : ''}${index < unlocked || (index === 0 && stabilityDone) || (index === 1 && angleDone) || (index === 2 && stickIndex >= STICK_SETS.length) ? ' done' : ''}`;
      button.textContent = index + 1;
      button.disabled = index > unlocked;
      button.setAttribute('aria-label', index > unlocked ? t('lockedMission') : t('missionLabel', index + 1, t(lab.title)));
      button.addEventListener('click', () => {
        if (index <= unlocked) {
          phase = index;
          statusMessage = index === 0
            ? { key: stabilityDone ? 'phase1Success' : braceAdded ? 'phase1Braced' : 'phase1Ready', tone: stabilityDone ? 'good' : '', args: [] }
            : index === 1
              ? { key: angleDone ? 'phase2Success' : 'phase2Ready', tone: angleDone ? 'good' : '', args: angleDone ? exactDisplayAngles() : [] }
              : stickStatus();
          save();
          render();
          window.cool?.stage?.(`triangle-lab-${index + 1}`);
        }
      });
      return button;
    }));
  }

  function renderControls() {
    el.stabilityControls.hidden = phase !== 0;
    el.angleControls.hidden = phase !== 1;
    el.sticksControls.hidden = phase !== 2;
    el.next.hidden = !((phase === 0 && stabilityDone) || (phase === 1 && angleDone));
    el.load.disabled = stabilityDone;
    el.load.querySelector('[data-t]').textContent = t(shelfCollapsed || braceAdded ? 'testAgain' : 'loadElephant');
    el.brace.disabled = braceAdded;
    el.brace.querySelector('[data-t]').textContent = t(braceAdded ? 'braceAdded' : 'addBrace');
    el.tear.disabled = angleDone;
    el.tear.querySelector('[data-t]').textContent = t(angleDone ? 'anglesTorn' : 'tearAngles');
  }

  function render() {
    const lab = LABS[phase];
    el.missionNumber.textContent = String(phase + 1).padStart(2, '0');
    el.missionKicker.textContent = t(lab.kicker);
    el.missionTitle.textContent = t(lab.title);
    el.missionText.textContent = t(lab.text);
    el.consoleKicker.textContent = ['STRUCTURE BENCH / 结构台', 'ANGLE TABLE / 角度台', 'STICK RACK / 木条架'][phase];
    el.consoleTitle.textContent = t(lab.console);
    el.consoleStamp.textContent = String(phase + 1).padStart(2, '0');
    el.lessonIcon.textContent = lab.icon;
    el.lessonText.textContent = t(lab.lesson);
    el.recordCount.textContent = `${completedLabs()}/3`;
    el.canvasLabel.textContent = t(['shelfLabel', 'angleLabel', 'sticksLabel'][phase]);
    el.formula.textContent = phase === 0 && stabilityDone
      ? t('formulaStable')
      : phase === 1
        ? t('formulaAngles')
        : phase === 2
          ? stickFormula()
          : '';
    el.sound.textContent = sound.muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', String(sound.muted));
    el.sound.setAttribute('aria-label', t(sound.muted ? 'soundOn' : 'soundOff'));
    el.theme.setAttribute('aria-label', t('themeLabel'));
    el.lang.textContent = language === 'zh' ? 'EN' : '中';
    el.theme.textContent = document.documentElement.dataset.theme === 'light' ? '🌙' : '☀️';
    renderStatus();
    renderNav();
    renderControls();
    resizeCanvas();
    if (completed) showComplete(false);
  }

  function css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function resizeCanvas() {
    const rect = el.canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (el.canvas.width !== width || el.canvas.height !== height) {
      el.canvas.width = width;
      el.canvas.height = height;
    }
    canvasSize = { width: rect.width, height: rect.height, dpr };
    draw();
  }

  function context() {
    const ctx = el.canvas.getContext('2d');
    ctx.setTransform(canvasSize.dpr, 0, 0, canvasSize.dpr, 0, 0);
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    return ctx;
  }

  function draw() {
    const ctx = context();
    if (phase === 0) drawShelf(ctx);
    if (phase === 1) drawAngles(ctx);
    if (phase === 2) drawSticks(ctx);
  }

  function drawShelf(ctx) {
    const { width: w, height: h } = canvasSize;
    const left = w * .25;
    const top = h * .2;
    const shelfW = w * .5;
    const shelfH = h * .55;
    const skew = shelfCollapsed ? Math.min(w * .12, 72) : 0;
    ctx.save();
    ctx.translate(skew * .15, 0);
    ctx.strokeStyle = css('--line');
    ctx.lineWidth = Math.max(10, w * .018);
    ctx.fillStyle = css('--orange');
    ctx.beginPath();
    ctx.moveTo(left + skew, top);
    ctx.lineTo(left + shelfW + skew, top);
    ctx.lineTo(left + shelfW - skew, top + shelfH);
    ctx.lineTo(left - skew, top + shelfH);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth *= .66;
    for (let index = 1; index < 3; index += 1) {
      const y = top + shelfH * index / 3;
      ctx.beginPath();
      ctx.moveTo(left + skew * (1 - 2 * index / 3), y);
      ctx.lineTo(left + shelfW + skew * (1 - 2 * index / 3), y);
      ctx.stroke();
    }
    if (braceAdded) {
      ctx.strokeStyle = css('--yellow');
      ctx.lineWidth = Math.max(9, w * .016);
      ctx.beginPath();
      ctx.moveTo(left, top + shelfH);
      ctx.lineTo(left + shelfW, top);
      ctx.stroke();
    }
    ctx.fillStyle = css('--card');
    ctx.strokeStyle = css('--line');
    ctx.lineWidth = 3;
    [[left + skew, top], [left + shelfW + skew, top], [left + shelfW - skew, top + shelfH], [left - skew, top + shelfH]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.font = `${Math.max(46, Math.min(78, w * .1))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('🐘', left + shelfW / 2 + skew, top + 5);
    ctx.restore();
  }

  function canvasPoint(vertex) {
    return {
      x: vertex.x * canvasSize.width,
      y: vertex.y * canvasSize.height,
    };
  }

  function drawAngles(ctx) {
    const points = vertices.map(canvasPoint);
    const angles = exactDisplayAngles();
    if (angleDone) {
      const centerX = canvasSize.width / 2;
      const baseY = canvasSize.height * .64;
      const radius = Math.min(72, canvasSize.width * .11);
      const colors = [css('--yellow'), css('--orange'), css('--cyan')];
      let start = Math.PI;
      angles.forEach((angle, index) => {
        const sweep = angle * Math.PI / 180;
        ctx.fillStyle = colors[index];
        ctx.strokeStyle = css('--line');
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, baseY);
        ctx.arc(centerX, baseY, radius, start, start + sweep);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        start += sweep;
      });
      ctx.strokeStyle = css('--line');
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(centerX - radius - 35, baseY);
      ctx.lineTo(centerX + radius + 35, baseY);
      ctx.stroke();
      ctx.fillStyle = css('--ink');
      ctx.font = `900 ${Math.max(18, Math.min(27, canvasSize.width * .035))}px ${getComputedStyle(document.body).fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(`${angles.join('° + ')}° = 180°`, centerX, baseY + radius + 38);
      return;
    }

    ctx.fillStyle = colorMix(css('--yellow'), .38);
    ctx.strokeStyle = css('--line');
    ctx.lineWidth = Math.max(4, canvasSize.width * .007);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    points.forEach((point, index) => {
      ctx.fillStyle = [css('--yellow'), css('--orange'), css('--cyan')][index];
      ctx.strokeStyle = css('--line');
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const centroid = {
        x: (points[0].x + points[1].x + points[2].x) / 3,
        y: (points[0].y + points[1].y + points[2].y) / 3,
      };
      const distance = Math.hypot(centroid.x - point.x, centroid.y - point.y) || 1;
      const labelX = point.x + (centroid.x - point.x) / distance * 45;
      const labelY = point.y + (centroid.y - point.y) / distance * 45;
      ctx.fillStyle = css('--ink');
      ctx.font = `950 ${Math.max(16, Math.min(24, canvasSize.width * .03))}px ${getComputedStyle(document.body).fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${angles[index]}°`, labelX, labelY);
    });
  }

  function colorMix(hex, alpha) {
    const normalized = hex.startsWith('#') ? hex.slice(1) : '';
    if (![3, 6].includes(normalized.length)) return `rgba(255, 211, 79, ${alpha})`;
    const full = normalized.length === 3 ? [...normalized].map((char) => char + char).join('') : normalized;
    return `rgba(${Number.parseInt(full.slice(0, 2), 16)}, ${Number.parseInt(full.slice(2, 4), 16)}, ${Number.parseInt(full.slice(4, 6), 16)}, ${alpha})`;
  }

  function stickFormula() {
    if (stickIndex >= STICK_SETS.length) return '';
    const [a, b, c] = STICK_SETS[stickIndex].lengths;
    const symbol = a + b > c ? '>' : a + b === c ? '=' : '<';
    return `${a} + ${b} ${symbol} ${c}`;
  }

  function drawStick(ctx, x1, y1, x2, y2, color, label) {
    ctx.strokeStyle = css('--line');
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.fillStyle = css('--card');
    ctx.strokeStyle = css('--line');
    ctx.lineWidth = 2;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    ctx.beginPath();
    ctx.arc(mx, my, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = css('--ink');
    ctx.font = `950 17px ${getComputedStyle(document.body).fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, mx, my);
  }

  function drawSticks(ctx) {
    const { width: w, height: h } = canvasSize;
    const set = STICK_SETS[Math.min(stickIndex, STICK_SETS.length - 1)];
    const [a, b, c] = set.lengths;
    const scale = Math.min(w * .09, h * .09);
    const baseY = h * .72;
    const baseX = (w - c * scale) / 2;
    drawStick(ctx, baseX, baseY, baseX + c * scale, baseY, css('--orange'), c);
    const top = set.canBuild
      ? { x: baseX + c * scale * .46, y: baseY - h * .48 }
      : { x: baseX + c * scale * .5, y: baseY - h * .32 };
    if (set.canBuild) {
      drawStick(ctx, baseX, baseY, top.x, top.y, css('--yellow'), a);
      drawStick(ctx, top.x, top.y, baseX + c * scale, baseY, css('--cyan'), b);
    } else {
      const total = a + b;
      const gap = Math.max(10, (c - total) * scale);
      const meetingX = baseX + c * scale / 2;
      const equality = total === c;
      const rise = equality ? 0 : h * .28;
      drawStick(ctx, baseX, baseY, meetingX - gap / 2, baseY - rise, css('--yellow'), a);
      drawStick(ctx, meetingX + gap / 2, baseY - rise, baseX + c * scale, baseY, css('--cyan'), b);
      if (!equality) {
        ctx.strokeStyle = css('--bad');
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(meetingX - gap / 2, baseY - rise);
        ctx.lineTo(meetingX + gap / 2, baseY - rise);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  function animateShell(className) {
    el.canvasShell.classList.remove('shake', 'success');
    void el.canvasShell.offsetWidth;
    el.canvasShell.classList.add(className);
    setTimeout(() => el.canvasShell.classList.remove(className), 520);
  }

  function loadShelf() {
    if (stabilityDone) return;
    if (!braceAdded) {
      shelfCollapsed = true;
      setStatus('phase1Collapsed', 'bad');
      sound.error();
      animateShell('shake');
      window.cool?.track?.('test-square-frame', { result: 'collapsed' });
    } else {
      shelfCollapsed = false;
      stabilityDone = true;
      unlocked = Math.max(unlocked, 1);
      setStatus('phase1Success', 'good');
      sound.correct();
      animateShell('success');
      window.cool?.track?.('test-braced-frame', { result: 'stable' });
    }
    save();
    render();
  }

  function addBrace() {
    if (braceAdded) return;
    braceAdded = true;
    shelfCollapsed = false;
    setStatus('phase1Braced');
    sound.brace();
    window.cool?.track?.('add-diagonal-brace');
    save();
    render();
  }

  function tearAngles() {
    if (angleDone) return;
    angleDone = true;
    unlocked = Math.max(unlocked, 2);
    const angles = exactDisplayAngles();
    setStatus('phase2Success', 'good', angles);
    sound.correct();
    animateShell('success');
    window.cool?.track?.('assemble-interior-angles', { angles, total: 180 });
    save();
    render();
  }

  function newTriangle() {
    triangleIndex = (triangleIndex + 1) % TRIANGLES.length;
    vertices = TRIANGLES[triangleIndex].map((point) => ({ ...point }));
    angleDone = false;
    setStatus('phase2Ready');
    sound.tap();
    save();
    render();
  }

  function answerSticks(answer) {
    if (stickIndex >= STICK_SETS.length) return;
    const set = STICK_SETS[stickIndex];
    const [a, b, c] = set.lengths;
    if (answer !== set.canBuild) {
      setStatus('phase3Wrong', 'bad', [a, b, c]);
      sound.error();
      animateShell('shake');
      window.cool?.track?.('judge-stick-set', { lengths: set.lengths.join('-'), answer, correct: false });
      return;
    }

    const symbol = a + b === c ? '=' : '<';
    setStatus(set.canBuild ? 'phase3CorrectBuild' : 'phase3CorrectNo', 'good', set.canBuild ? [a, b, c] : [a, b, c, symbol]);
    sound.correct();
    animateShell('success');
    window.cool?.track?.('judge-stick-set', { lengths: set.lengths.join('-'), answer, correct: true });
    stickIndex += 1;
    if (stickIndex >= STICK_SETS.length) {
      completed = true;
      save();
      render();
      showComplete(true);
      return;
    }
    save();
    setTimeout(() => {
      statusMessage = stickStatus();
      render();
    }, 520);
  }

  function goNext() {
    if (phase === 0 && !stabilityDone) return;
    if (phase === 1 && !angleDone) return;
    phase = Math.min(2, phase + 1);
    statusMessage = phase === 1 ? { key: 'phase2Ready', tone: '', args: [] } : stickStatus();
    window.cool?.stage?.(`triangle-lab-${phase + 1}`);
    save();
    render();
  }

  function showComplete(withSound) {
    el.modal.hidden = false;
    el.course.inert = true;
    el.playAgain.focus();
    if (withSound) {
      sound.complete();
      window.cool?.complete?.();
      window.cool?.track?.('complete-triangle-lab', { labs: 3 });
    }
  }

  function reset() {
    phase = 0;
    unlocked = 0;
    shelfCollapsed = false;
    braceAdded = false;
    stabilityDone = false;
    triangleIndex = 0;
    vertices = TRIANGLES[0].map((point) => ({ ...point }));
    angleDone = false;
    stickIndex = 0;
    completed = false;
    statusMessage = { key: 'phase1Ready', tone: '', args: [] };
    el.modal.hidden = true;
    el.course.inert = false;
    save();
    render();
  }

  function hint() {
    setStatus(['phase1Hint', 'phase2Hint', 'phase3Hint'][phase]);
    sound.tap();
    window.cool?.track?.('request-triangle-hint', { lab: phase + 1 });
  }

  function pointerPosition(event) {
    const rect = el.canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }

  el.canvas.addEventListener('pointerdown', (event) => {
    if (phase !== 1 || angleDone) return;
    const point = pointerPosition(event);
    draggingVertex = vertices.findIndex((vertex) => Math.hypot(vertex.x - point.x, vertex.y - point.y) < .075);
    if (draggingVertex >= 0) {
      el.canvas.setPointerCapture(event.pointerId);
      sound.tap();
    }
  });

  el.canvas.addEventListener('pointermove', (event) => {
    if (draggingVertex < 0 || phase !== 1 || angleDone) return;
    const point = pointerPosition(event);
    vertices[draggingVertex] = {
      x: Math.max(.12, Math.min(.88, point.x)),
      y: Math.max(.14, Math.min(.82, point.y)),
    };
    draw();
  });

  function finishDrag(event) {
    if (draggingVertex < 0) return;
    draggingVertex = -1;
    if (el.canvas.hasPointerCapture(event.pointerId)) el.canvas.releasePointerCapture(event.pointerId);
    setStatus('phase2Changed');
    window.cool?.track?.('reshape-triangle', { angles: exactDisplayAngles().join('-') });
  }

  el.canvas.addEventListener('pointerup', finishDrag);
  el.canvas.addEventListener('pointercancel', finishDrag);
  el.load.addEventListener('click', loadShelf);
  el.brace.addEventListener('click', addBrace);
  el.tear.addEventListener('click', tearAngles);
  el.newTriangle.addEventListener('click', newTriangle);
  el.canBuild.addEventListener('click', () => answerSticks(true));
  el.cannotBuild.addEventListener('click', () => answerSticks(false));
  el.hint.addEventListener('click', hint);
  el.next.addEventListener('click', goNext);
  el.playAgain.addEventListener('click', reset);
  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    render();
  });
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  addEventListener('resize', resizeCanvas);
  addEventListener('themechange', () => requestAnimationFrame(resizeCanvas));

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang, theme }) {
      t = translate;
      language = lang;
      document.title = t('doc');
      el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
      render();
    },
  });
  window.cool?.stage?.(`triangle-lab-${phase + 1}`);
})();
