(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '角度高尔夫 · KidsLab',
      back: '返回平台',
      title: '角度高尔夫',
      hole: '球洞',
      holeNavLabel: '球洞',
      quickAnglesLabel: '快捷角度',
      strokes: '杆数',
      callAngle: '报角瞄准',
      angleLabel: '角度',
      hint: '轻提示',
      restart: '重打本洞',
      guideRead: '看量角器的 0° 基准线',
      guideCall: '输入你判断的角度',
      guideWatch: '挥杆，沿轨迹修正',
      finalKicker: '角度大师赛完成',
      finalTitle: '三墙神仙球！',
      finalText: '你用数字瞄准，还看见了每次反弹里相等的入射角与反射角。',
      playAgain: '再打一轮',
      holeLabel: (n, title) => `第 ${n} 洞：${title}`,
      hole1Kicker: '热身果岭',
      hole1Title: '0° 直推',
      hole1Mission: '水平向右就是 0°。报出角度，让球沿基准线进洞。',
      hole2Kicker: '风车斜坡',
      hole2Title: '锐角穿门',
      hole2Mission: '球洞在基准线上方。估出锐角，让球从黄色门框正中穿过。',
      hole3Kicker: '镜面决赛',
      hole3Title: '三墙反弹',
      hole3Mission: '上下墙像镜子。用同一个锐角连续反弹三次，一杆进洞。',
      ready: '输入角度，再挥杆！',
      readyNext: '这一洞准备好了。报出角度吧！',
      shooting: (angle) => `第 ${angle}° 杆出发——看轨迹！`,
      tooHigh: (amount) => `角度大了约 ${amount}°。把瞄准线往下压一点。`,
      tooLow: (amount) => `角度小了约 ${amount}°。把瞄准线往上抬一点。`,
      directSuccess: '漂亮的 0° 直推！基准线就是最可靠的起点。',
      gateSuccess: '穿门进洞！你报出的 27° 是一个锐角。',
      bankSuccess: '三次反弹全部命中！每次都是 30° 入射、30° 反射。',
      nextHole: '下一洞',
      shoot: '挥杆',
      hint1: '看水平虚线：它就是 0°，不用把杆抬起来。',
      hint2: '先找 30° 刻度，再稍微往 0° 方向退一点。',
      hint3: '试试量角器上最常见的 60°；碰墙时要从法线量角。',
      restarted: '球回到发球点。本洞可以重新判断。',
      invalidAngle: '请输入 0° 到 180° 之间的整数。',
      lockedHole: '先完成前一洞',
      zeroAngle: '0° 基准线',
      acuteAngle: '锐角',
      rightAngle: '直角',
      obtuseAngle: '钝角',
      straightAngle: '平角',
      angleType: (angle, kind) => `${angle}° · ${kind}`,
      canvasLabel: '迷你高尔夫球道',
      baseLine: '0° 基准线',
      targetAngle: '目标方向',
      reflectLabel: '30° = 30°',
      decreaseAngle: '减小 1 度',
      increaseAngle: '增加 1 度',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
    },
    en: {
      doc: 'Angle Golf · KidsLab',
      back: 'Back to platform',
      title: 'Angle Golf',
      hole: 'Hole',
      holeNavLabel: 'Holes',
      quickAnglesLabel: 'Quick angles',
      strokes: 'Strokes',
      callAngle: 'Call your angle',
      angleLabel: 'Angle',
      hint: 'Small hint',
      restart: 'Replay hole',
      guideRead: 'Find the protractor’s 0° baseline',
      guideCall: 'Type the angle you judge',
      guideWatch: 'Swing, then correct from the trail',
      finalKicker: 'Angle Masters complete',
      finalTitle: 'Three-bank wonder shot!',
      finalText: 'You aimed with numbers and saw equal incidence and reflection angles at every bank.',
      playAgain: 'Play all holes again',
      holeLabel: (n, title) => `Hole ${n}: ${title}`,
      hole1Kicker: 'Warm-up green',
      hole1Title: 'The 0° Putt',
      hole1Mission: 'Straight right is 0°. Call the angle and roll along the baseline.',
      hole2Kicker: 'Windmill slope',
      hole2Title: 'Acute Gate',
      hole2Mission: 'The cup sits above the baseline. Estimate the acute angle and thread the yellow gate.',
      hole3Kicker: 'Mirror final',
      hole3Title: 'Three Banks',
      hole3Mission: 'The top and bottom walls act like mirrors. Use one acute angle to bank three times and sink it.',
      ready: 'Type an angle, then swing!',
      readyNext: 'This hole is ready. Call your angle!',
      shooting: (angle) => `The ${angle}° shot is away — watch the trail!`,
      tooHigh: (amount) => `About ${amount}° too high. Lower the aim a little.`,
      tooLow: (amount) => `About ${amount}° too low. Raise the aim a little.`,
      directSuccess: 'Perfect 0° putt! The baseline is a dependable starting point.',
      gateSuccess: 'Through the gate! Your 27° shot is an acute angle.',
      bankSuccess: 'All three banks landed! Each one shows 30° in and 30° out.',
      nextHole: 'Next hole',
      shoot: 'Swing',
      hint1: 'Look at the horizontal dashed line: it is 0°, so do not lift the club.',
      hint2: 'Find 30° first, then move slightly back toward 0°.',
      hint3: 'Try the familiar 60° mark; at a wall, measure from the normal.',
      restarted: 'The ball is back on the tee. Judge this hole again.',
      invalidAngle: 'Enter a whole number from 0° to 180°.',
      lockedHole: 'Finish the previous hole first',
      zeroAngle: '0° baseline',
      acuteAngle: 'Acute angle',
      rightAngle: 'Right angle',
      obtuseAngle: 'Obtuse angle',
      straightAngle: 'Straight angle',
      angleType: (angle, kind) => `${angle}° · ${kind}`,
      canvasLabel: 'Mini golf course',
      baseLine: '0° baseline',
      targetAngle: 'Target direction',
      reflectLabel: '30° = 30°',
      decreaseAngle: 'Decrease by 1 degree',
      increaseAngle: 'Increase by 1 degree',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
    },
  };

  const HOLES = [
    {
      kicker: 'hole1Kicker',
      title: 'hole1Title',
      mission: 'hole1Mission',
      answer: 0,
      tee: { x: 92, y: 324 },
      cup: { x: 700, y: 324 },
      success: 'directSuccess',
      hint: 'hint1',
      path: [{ x: 92, y: 324 }, { x: 700, y: 324 }],
    },
    {
      kicker: 'hole2Kicker',
      title: 'hole2Title',
      mission: 'hole2Mission',
      answer: 27,
      tee: { x: 90, y: 350 },
      cup: { x: 620, y: 80 },
      success: 'gateSuccess',
      hint: 'hint2',
      path: [{ x: 90, y: 350 }, { x: 620, y: 80 }],
    },
    {
      kicker: 'hole3Kicker',
      title: 'hole3Title',
      mission: 'hole3Mission',
      answer: 60,
      tee: { x: 80, y: 320 },
      cup: { x: 690, y: 216.55 },
      success: 'bankSuccess',
      hint: 'hint3',
      path: [
        { x: 80, y: 320 },
        { x: 230.11, y: 60 },
        { x: 414.86, y: 380 },
        { x: 599.62, y: 60 },
        { x: 690, y: 216.55 },
      ],
    },
  ];

  const $ = (selector) => document.querySelector(selector);
  const el = {
    holeNumber: $('#holeNumber'),
    holeKicker: $('#holeKicker'),
    holeTitle: $('#holeTitle'),
    holeMission: $('#holeMission'),
    holeNav: $('#holeNav'),
    quickAngles: $('.quick-angles'),
    status: $('#status'),
    strokes: $('#strokeCount'),
    shell: $('#canvasShell'),
    canvas: $('#courseCanvas'),
    burst: $('#resultBurst'),
    angleType: $('#angleType'),
    angleInput: $('#angleInput'),
    minus: $('#minusBtn'),
    plus: $('#plusBtn'),
    shoot: $('#shootBtn'),
    shootLabel: $('#shootLabel'),
    hint: $('#hintBtn'),
    restart: $('#restartBtn'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
    modal: $('#completeModal'),
    playAgain: $('#playAgainBtn'),
  };

  const ctx = el.canvas.getContext('2d');
  const SAVE_KEY = 'kidslab.angle-golf';
  const SOUND_KEY = 'kidslab.sound.muted';
  let t = (key) => key;
  let language = 'zh';
  let holeIndex = 0;
  let unlocked = 0;
  let completed = new Set();
  let strokes = 0;
  let busy = false;
  let holeWon = false;
  let angle = 0;
  let statusMessage = { key: 'ready', args: [] };
  let resultText = '';
  let resultKey = null;
  let trail = null;
  let ball = null;
  let hintTimer = 0;
  let animationToken = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(HOLES.length - 1, Math.max(0, Number(saved.unlocked) || 0));
    completed = new Set(Array.isArray(saved.completed) ? saved.completed.filter((n) => Number.isInteger(n) && n >= 0 && n < HOLES.length) : []);
  } catch {
    unlocked = 0;
    completed = new Set();
  }

  class SoundEngine {
    constructor() {
      try { this.muted = localStorage.getItem(SOUND_KEY) === 'true'; } catch { this.muted = false; }
      this.context = null;
    }

    toggle() {
      this.muted = !this.muted;
      try { localStorage.setItem(SOUND_KEY, String(this.muted)); } catch { /* storage is optional */ }
      this.updateButton();
      if (!this.muted) this.play('tap');
    }

    updateButton() {
      el.sound.textContent = this.muted ? '🔇' : '🔊';
      el.sound.setAttribute('aria-pressed', String(this.muted));
      el.sound.setAttribute('aria-label', t(this.muted ? 'soundOn' : 'soundOff'));
    }

    play(kind) {
      if (this.muted) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      try {
        this.context ||= new AudioContextClass();
        if (this.context.state === 'suspended') this.context.resume().catch(() => {});
        const patterns = {
          tap: [[330, 0, 0.06]],
          swing: [[155, 0, 0.08], [235, 0.08, 0.1]],
          miss: [[190, 0, 0.12], [135, 0.1, 0.18]],
          success: [[523, 0, 0.11], [659, 0.1, 0.12], [784, 0.2, 0.2]],
          bank: [[260, 0, 0.055]],
          complete: [[392, 0, 0.11], [523, 0.1, 0.11], [659, 0.2, 0.12], [784, 0.31, 0.28]],
        };
        (patterns[kind] || patterns.tap).forEach(([frequency, delay, duration]) => {
          const oscillator = this.context.createOscillator();
          const gain = this.context.createGain();
          const start = this.context.currentTime + delay;
          oscillator.type = kind === 'miss' ? 'triangle' : 'sine';
          oscillator.frequency.setValueAtTime(frequency, start);
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(0.1, start + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
          oscillator.connect(gain).connect(this.context.destination);
          oscillator.start(start);
          oscillator.stop(start + duration + 0.02);
        });
      } catch {
        // Audio is optional; gameplay and visual feedback remain available.
      }
    }
  }

  const sound = new SoundEngine();
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const modalBackground = [document.querySelector('.bar'), document.querySelector('.course')];
  const currentHole = () => HOLES[holeIndex];
  const setStatus = (key, ...args) => { statusMessage = { key, args }; };
  const statusText = () => t(statusMessage.key, ...statusMessage.args);

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked, completed: [...completed] }));
    } catch {
      // Progress persistence is optional.
    }
  }

  function clampAngle(value) {
    if (!Number.isFinite(value)) return null;
    return Math.min(180, Math.max(0, Math.round(value)));
  }

  function parseSubmittedAngle(value) {
    const raw = String(value).trim();
    if (!/^\d+$/.test(raw)) return null;
    const parsed = Number(raw);
    return Number.isInteger(parsed) && parsed >= 0 && parsed <= 180 ? parsed : null;
  }

  function angleKind(value) {
    if (value === 0) return 'zeroAngle';
    if (value < 90) return 'acuteAngle';
    if (value === 90) return 'rightAngle';
    if (value < 180) return 'obtuseAngle';
    return 'straightAngle';
  }

  function updateAngle(value, announce = false) {
    const next = clampAngle(Number(value));
    if (next === null) return;
    angle = next;
    el.angleInput.value = String(angle);
    if (announce) sound.play('tap');
    resultText = '';
    resultKey = null;
    resetHintTimer();
    render();
  }

  function resetHintTimer() {
    clearTimeout(hintTimer);
    if (busy || holeWon) return;
    hintTimer = setTimeout(() => {
      setStatus(currentHole().hint);
      render();
    }, 30000);
  }

  function setModalOpen(open) {
    el.modal.hidden = !open;
    modalBackground.forEach((region) => {
      if (region) region.inert = open;
    });
    if (open) requestAnimationFrame(() => el.playAgain.focus());
  }

  function startHole(index, message = 'readyNext') {
    animationToken += 1;
    holeIndex = index;
    strokes = 0;
    busy = false;
    holeWon = false;
    angle = currentHole().answer === 0 ? 0 : 30;
    trail = null;
    ball = null;
    resultText = '';
    resultKey = null;
    setModalOpen(false);
    setStatus(message);
    resetHintTimer();
    render();
  }

  function missPath(shotAngle) {
    const hole = currentHole();
    const radians = shotAngle * Math.PI / 180;
    let x = hole.tee.x;
    let y = hole.tee.y;
    let dx = Math.cos(radians);
    let dy = -Math.sin(radians);
    const points = [{ x, y }];
    if (holeIndex !== 2 || dx <= 0 || Math.abs(dy) < 0.000001) {
      const candidates = [];
      if (dx > 0) candidates.push((785 - x) / dx);
      if (dx < 0) candidates.push((15 - x) / dx);
      if (dy < 0) candidates.push((18 - y) / dy);
      if (dy > 0) candidates.push((385 - y) / dy);
      const distance = Math.min(...candidates.filter((n) => n > 0));
      points.push({ x: x + dx * distance, y: y + dy * distance });
      return points;
    }

    for (let bounce = 0; bounce < 7 && x < 785; bounce += 1) {
      const wallY = dy < 0 ? 60 : 380;
      const wallDistance = (wallY - y) / dy;
      const edgeDistance = (785 - x) / dx;
      const distance = Math.min(wallDistance, edgeDistance);
      x += dx * distance;
      y += dy * distance;
      points.push({ x, y });
      if (edgeDistance <= wallDistance) break;
      dy *= -1;
    }
    return points;
  }

  function pathLength(points) {
    let total = 0;
    for (let i = 1; i < points.length; i += 1) {
      total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    }
    return total;
  }

  function pointAlong(points, distance) {
    let remaining = distance;
    for (let i = 1; i < points.length; i += 1) {
      const start = points[i - 1];
      const end = points[i];
      const length = Math.hypot(end.x - start.x, end.y - start.y);
      if (remaining <= length) {
        const ratio = length ? remaining / length : 0;
        return { x: start.x + (end.x - start.x) * ratio, y: start.y + (end.y - start.y) * ratio, segment: i };
      }
      remaining -= length;
    }
    const last = points[points.length - 1];
    return { ...last, segment: points.length - 1 };
  }

  function shoot() {
    if (busy) return;
    if (holeWon) {
      if (holeIndex < HOLES.length - 1) startHole(holeIndex + 1);
      return;
    }

    const submitted = parseSubmittedAngle(el.angleInput.value);
    if (submitted === null) {
      setStatus('invalidAngle');
      sound.play('miss');
      render();
      return;
    }
    angle = submitted;
    el.angleInput.value = String(angle);
    const token = ++animationToken;
    const hole = currentHole();
    const success = angle === hole.answer;
    const points = success ? hole.path : missPath(angle);
    const total = pathLength(points);
    const duration = Math.min(1350, Math.max(620, total * 1.4));
    const startedAt = performance.now();
    const bankSegmentsPlayed = new Set();
    strokes += 1;
    busy = true;
    trail = points;
    ball = { ...points[0] };
    resultText = '';
    resultKey = null;
    setStatus('shooting', angle);
    sound.play('swing');
    window.cool?.stage(`angle-hole-${holeIndex + 1}`);
    window.cool?.track('swing-angle', { hole: holeIndex + 1, angle });
    render();

    const animate = (now) => {
      if (token !== animationToken) return;
      const progress = Math.min(1, (now - startedAt) / duration);
      const position = pointAlong(points, total * (1 - Math.pow(1 - progress, 2)));
      ball = position;
      if (holeIndex === 2 && position.segment > 1 && !bankSegmentsPlayed.has(position.segment)) {
        bankSegmentsPlayed.add(position.segment);
        sound.play('bank');
      }
      draw();
      if (progress < 1) {
        requestAnimationFrame(animate);
        return;
      }
      if (success) {
        busy = false;
        holeWon = true;
        completed.add(holeIndex);
        unlocked = Math.max(unlocked, Math.min(HOLES.length - 1, holeIndex + 1));
        persist();
        resultKey = hole.success;
        setStatus(hole.success);
        sound.play(holeIndex === HOLES.length - 1 ? 'complete' : 'success');
        window.cool?.track('sink-angle-hole', { hole: holeIndex + 1, angle, strokes });
        if (holeIndex === HOLES.length - 1) {
          window.cool?.complete?.();
          setTimeout(() => {
            if (token === animationToken) setModalOpen(true);
          }, 430);
        }
      } else {
        const delta = Math.max(1, Math.round(Math.abs(angle - hole.answer)));
        setStatus(angle > hole.answer ? 'tooHigh' : 'tooLow', delta);
        resultText = angle > hole.answer ? '↘' : '↗';
        resultKey = null;
        sound.play('miss');
        window.cool?.track('miss-angle-hole', { hole: holeIndex + 1, angle, direction: angle > hole.answer ? 'high' : 'low' });
        setTimeout(() => {
          if (token !== animationToken || holeWon) return;
          busy = false;
          ball = null;
          trail = null;
          resultText = '';
          resultKey = null;
          render();
        }, 520);
      }
      resetHintTimer();
      render();
    };
    requestAnimationFrame(animate);
  }

  function showHint() {
    if (busy || holeWon) return;
    setStatus(currentHole().hint);
    resultText = '💡';
    resultKey = null;
    sound.play('tap');
    window.cool?.track('request-angle-hint', { hole: holeIndex + 1 });
    render();
    resetHintTimer();
  }

  function restart() {
    if (busy) animationToken += 1;
    startHole(holeIndex, 'restarted');
    window.cool?.track('restart-angle-hole', { hole: holeIndex + 1 });
  }

  function drawRoundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function drawCup(hole) {
    const ink = cssVar('--line-strong');
    const card = cssVar('--card');
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.ellipse(hole.cup.x, hole.cup.y, 15, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(hole.cup.x, hole.cup.y);
    ctx.lineTo(hole.cup.x, hole.cup.y - 74);
    ctx.stroke();
    ctx.fillStyle = cssVar('--accent-2');
    ctx.beginPath();
    ctx.moveTo(hole.cup.x + 2, hole.cup.y - 72);
    ctx.lineTo(hole.cup.x + 50, hole.cup.y - 56);
    ctx.lineTo(hole.cup.x + 2, hole.cup.y - 42);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = card;
    ctx.font = '900 17px ui-rounded, sans-serif';
    ctx.fillText(String(holeIndex + 1), hole.cup.x + 15, hole.cup.y - 52);
  }

  function drawProtractor(hole) {
    const ink = cssVar('--canvas-ink');
    const soft = cssVar('--canvas-ink');
    ctx.save();
    ctx.strokeStyle = soft;
    ctx.fillStyle = soft;
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 6]);
    ctx.beginPath();
    ctx.moveTo(hole.tee.x - 84, hole.tee.y);
    ctx.lineTo(hole.tee.x + 132, hole.tee.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.78;
    ctx.beginPath();
    ctx.arc(hole.tee.x, hole.tee.y, 82, Math.PI, Math.PI * 2);
    ctx.stroke();
    for (let degree = 0; degree <= 180; degree += 10) {
      const radians = degree * Math.PI / 180;
      const outer = 82;
      const inner = degree % 30 === 0 ? 69 : 75;
      ctx.beginPath();
      ctx.moveTo(hole.tee.x + Math.cos(radians) * inner, hole.tee.y - Math.sin(radians) * inner);
      ctx.lineTo(hole.tee.x + Math.cos(radians) * outer, hole.tee.y - Math.sin(radians) * outer);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = cssVar('--canvas-highlight');
    ctx.lineWidth = 6;
    const aim = angle * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(hole.tee.x, hole.tee.y);
    ctx.lineTo(hole.tee.x + Math.cos(aim) * 105, hole.tee.y - Math.sin(aim) * 105);
    ctx.stroke();
    ctx.fillStyle = ink;
    ctx.font = '900 15px ui-rounded, sans-serif';
    ctx.fillText(t('baseLine'), hole.tee.x + 92, hole.tee.y + 24);
    ctx.restore();
  }

  function drawDecorations() {
    const line = cssVar('--line-strong');
    ctx.fillStyle = cssVar('--canvas-sky');
    ctx.fillRect(0, 0, 800, 400);
    ctx.fillStyle = cssVar('--canvas-far');
    ctx.beginPath();
    ctx.moveTo(0, 98);
    ctx.quadraticCurveTo(120, 18, 245, 96);
    ctx.quadraticCurveTo(390, 6, 535, 93);
    ctx.quadraticCurveTo(670, 17, 800, 88);
    ctx.lineTo(800, 400);
    ctx.lineTo(0, 400);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = cssVar('--grass');
    drawRoundedRect(ctx, 20, 42, 760, 338, 28);
    ctx.fill();
    ctx.strokeStyle = line;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = cssVar('--shine');
    for (let x = 25; x < 780; x += 72) ctx.fillRect(x, 44, 35, 334);
    ctx.restore();

    if (holeIndex === 0) {
      ctx.fillStyle = cssVar('--sand');
      ctx.beginPath();
      ctx.ellipse(420, 112, 92, 34, -0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = cssVar('--water');
      ctx.beginPath();
      ctx.ellipse(455, 246, 82, 29, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (holeIndex === 1) {
      [{ x: 343, y: 167 }, { x: 387, y: 253 }].forEach((post, index) => {
        ctx.fillStyle = cssVar('--accent');
        ctx.strokeStyle = line;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(post.x, post.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = cssVar('--ink-on-accent');
        ctx.font = '900 15px ui-rounded, sans-serif';
        ctx.fillText(index === 0 ? 'A' : 'B', post.x - 6, post.y + 5);
      });
    } else {
      ctx.fillStyle = cssVar('--accent');
      ctx.strokeStyle = line;
      ctx.lineWidth = 4;
      drawRoundedRect(ctx, 28, 47, 744, 25, 10);
      ctx.fill();
      ctx.stroke();
      drawRoundedRect(ctx, 28, 368, 744, 20, 10);
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.setLineDash([8, 7]);
      ctx.strokeStyle = cssVar('--shine');
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(45, 60);
      ctx.lineTo(755, 60);
      ctx.moveTo(45, 380);
      ctx.lineTo(755, 380);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawTrail() {
    if (!trail) return;
    ctx.save();
    ctx.strokeStyle = cssVar('--canvas-highlight');
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([4, 10]);
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    trail.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.stroke();
    ctx.setLineDash([]);
    if (holeWon && holeIndex === 2) {
      ctx.fillStyle = cssVar('--ink-on-accent');
      ctx.font = '900 15px ui-rounded, sans-serif';
      trail.slice(1, -1).forEach((point, index) => {
        ctx.fillStyle = cssVar('--accent');
        drawRoundedRect(ctx, point.x - 51, point.y === 60 ? point.y + 9 : point.y - 34, 102, 27, 10);
        ctx.fill();
        ctx.strokeStyle = cssVar('--line-strong');
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = cssVar('--ink-on-accent');
        ctx.fillText(t('reflectLabel'), point.x - 42, point.y === 60 ? point.y + 28 : point.y - 15);
        if (index < 2) {
          ctx.strokeStyle = cssVar('--line-strong');
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(point.x, point.y - 25);
          ctx.lineTo(point.x, point.y + 25);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    }
    ctx.restore();
  }

  function drawBall() {
    const point = ball || currentHole().tee;
    ctx.save();
    ctx.shadowColor = cssVar('--shadow');
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = cssVar('--card');
    ctx.strokeStyle = cssVar('--line-strong');
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = cssVar('--line');
    [[-4, -3], [4, -5], [1, 4], [-6, 5]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(point.x + x, point.y + y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function draw() {
    if (!ctx) return;
    const rect = el.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (el.canvas.width !== width || el.canvas.height !== height) {
      el.canvas.width = width;
      el.canvas.height = height;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const scale = Math.min(width / 800, height / 400);
    const offsetX = (width - 800 * scale) / 2;
    const offsetY = (height - 400 * scale) / 2;
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    drawDecorations();
    drawCup(currentHole());
    drawProtractor(currentHole());
    drawTrail();
    drawBall();
  }

  function renderNav() {
    el.holeNav.innerHTML = '';
    HOLES.forEach((hole, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `hole-btn${index === holeIndex ? ' current' : ''}${completed.has(index) ? ' done' : ''}`;
      button.textContent = String(index + 1).padStart(2, '0');
      button.disabled = busy || index > unlocked;
      button.title = button.disabled ? t('lockedHole') : t('holeLabel', index + 1, t(hole.title));
      button.setAttribute('aria-label', button.title);
      button.addEventListener('click', () => startHole(index));
      el.holeNav.appendChild(button);
    });
  }

  function render() {
    if (!el.holeTitle) return;
    const hole = currentHole();
    el.holeNumber.textContent = String(holeIndex + 1).padStart(2, '0');
    el.holeKicker.textContent = t(hole.kicker);
    el.holeTitle.textContent = t(hole.title);
    el.holeMission.textContent = t(hole.mission);
    el.status.textContent = statusText();
    el.strokes.textContent = String(strokes);
    el.burst.textContent = resultKey ? t(resultKey) : resultText;
    el.angleType.textContent = t('angleType', angle, t(angleKind(angle)));
    el.angleInput.value = String(angle);
    el.shootLabel.textContent = t(holeWon && holeIndex < HOLES.length - 1 ? 'nextHole' : 'shoot');
    el.shoot.disabled = busy || (holeWon && holeIndex === HOLES.length - 1);
    el.hint.disabled = busy || holeWon;
    el.restart.disabled = busy;
    el.angleInput.disabled = busy || holeWon;
    el.minus.disabled = busy || holeWon;
    el.plus.disabled = busy || holeWon;
    document.querySelectorAll('.quick-angles button').forEach((button) => { button.disabled = busy || holeWon; });
    el.canvas.setAttribute('aria-label', t('canvasLabel'));
    el.angleInput.setAttribute('aria-label', t('angleLabel'));
    el.holeNav.setAttribute('aria-label', t('holeNavLabel'));
    el.quickAngles.setAttribute('aria-label', t('quickAnglesLabel'));
    el.minus.setAttribute('aria-label', t('decreaseAngle'));
    el.plus.setAttribute('aria-label', t('increaseAngle'));
    el.theme.setAttribute('aria-label', t('themeLabel'));
    sound.updateButton();
    renderNav();
    draw();
  }

  el.angleInput.addEventListener('input', () => {
    const value = parseSubmittedAngle(el.angleInput.value);
    if (value !== null) {
      angle = value;
      resultText = '';
      resultKey = null;
      resetHintTimer();
      render();
    }
  });
  el.minus.addEventListener('click', () => updateAngle(angle - 1, true));
  el.plus.addEventListener('click', () => updateAngle(angle + 1, true));
  document.querySelectorAll('.quick-angles button').forEach((button) => {
    button.addEventListener('click', () => updateAngle(Number(button.dataset.angle), true));
  });
  el.shoot.addEventListener('click', shoot);
  el.hint.addEventListener('click', showHint);
  el.restart.addEventListener('click', restart);
  el.playAgain.addEventListener('click', () => {
    completed = new Set();
    unlocked = 0;
    persist();
    startHole(0, 'ready');
    el.shoot.focus();
  });
  el.sound.addEventListener('click', () => sound.toggle());
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  addEventListener('resize', draw);
  addEventListener('themechange', draw);

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang, theme }) {
      t = translate;
      language = lang;
      document.title = t('doc');
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
      el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
      render();
    },
  });

  setStatus('ready');
  resetHintTimer();
})();
