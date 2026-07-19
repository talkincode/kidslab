(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '七巧板皮影戏 · KidsLab',
      back: '返回平台',
      title: '七巧板皮影戏',
      theme: '切换主题',
      eyebrow: '今晚演出：狐狸过河',
      progress: '归位',
      act: '幕',
      workbench: '后台木片桌',
      turnLeft: '左转',
      turnRight: '右转',
      flip: '翻面',
      hint: '灯笼提示：帮我放一块',
      reset: '重开本幕',
      stageLabel: '可拖动的七巧板拼图舞台',
      shelfLabel: '七巧板木片',
      controlsLabel: '木片动作',
      intro: '拖住木片送到同形剪影。方向不对，就转一转！',
      selected: (name) => `已拿起${name}。拖到发光轮廓里；需要时先旋转或翻面。`,
      wrong: '还没对上剪影。木片回到后台了，看看位置和方向再试一次！',
      correct: (name, count) => `${name}稳稳归位！还差 ${7 - count} 块。`,
      lastPiece: '最后一块归位——剪影醒过来了！',
      locked: '先演完前一幕，后面的角色才会登场。',
      hintPlaced: (name) => `灯笼照亮了${name}的位置。观察它怎样滑动、转向，再放下一块！`,
      resetDone: '这一幕重新布景。七块木片都回到后台啦！',
      completedScene: '这一幕已经演完，可以重玩或继续后面的故事。',
      pieces: ['大三角一', '大三角二', '中三角', '小三角一', '小三角二', '正方形', '平行四边形'],
      scenes: [
        {
          tab: '第一幕 · 桥',
          mission: '第一幕缺一座桥。把七块木片都送进发光剪影，故事才能继续！',
          title: '桥架起来了！',
          text: '七块木片没有变大或缩小，只是滑动、转向和翻面，就组成了新的轮廓。',
          art: '🦊🌉',
        },
        {
          tab: '第二幕 · 狐狸',
          mission: '桥有了，主角却没登台。拼出狐狸，让它踩着月光过河！',
          title: '狐狸抖抖尾巴，活了！',
          text: '同一组图形换了位置和方向，就从一座桥变成了狐狸。分开看是木片，合起来就是角色。',
          art: '🌙🦊',
        },
        {
          tab: '第三幕 · 大雁',
          mission: '河对岸传来翅膀声。最后拼出大雁，为狐狸引路回家！',
          title: '三幕皮影戏圆满收官！',
          text: '你用完了每一块，而且没有重叠。滑动、旋转、翻面，让七块图形讲完了一整个故事！',
          art: '🦊🪿✨',
        },
      ],
      next: '下一幕 →',
      replay: '再演一遍',
    },
    en: {
      doc: 'Tangram Shadow Play · KidsLab',
      back: 'Back to platform',
      title: 'Tangram Shadow Play',
      theme: 'Switch theme',
      eyebrow: 'Tonight: The Fox Crosses the River',
      progress: 'Placed',
      act: 'Act',
      workbench: 'Backstage piece table',
      turnLeft: 'Turn left',
      turnRight: 'Turn right',
      flip: 'Flip',
      hint: 'Lantern hint: place one piece',
      reset: 'Restart this act',
      stageLabel: 'Draggable tangram puzzle stage',
      shelfLabel: 'Tangram pieces',
      controlsLabel: 'Piece controls',
      intro: 'Drag a piece into its matching shadow. If it points the wrong way, give it a turn!',
      selected: (name) => `${name} selected. Drag it into the glowing outline; turn or flip it if needed.`,
      wrong: 'Not quite aligned with the shadow. The piece is back backstage — check its place and direction!',
      correct: (name, count) => `${name} is in place! ${7 - count} pieces to go.`,
      lastPiece: 'The final piece lands — the shadow wakes up!',
      locked: 'Finish the earlier act before the next character can enter.',
      hintPlaced: (name) => `The lantern revealed the home of ${name}. Watch how it slides and turns, then place the next one!`,
      resetDone: 'The stage is reset. All seven pieces are back backstage!',
      completedScene: 'This act is complete. Replay it or continue the story.',
      pieces: ['Large triangle one', 'Large triangle two', 'Medium triangle', 'Small triangle one', 'Small triangle two', 'Square', 'Parallelogram'],
      scenes: [
        {
          tab: 'Act 1 · Bridge',
          mission: 'Act one needs a bridge. Move all seven pieces into the glowing shadow so the story can continue!',
          title: 'The bridge rises!',
          text: 'None of the seven pieces grew or shrank. They only slid, turned, and flipped to make a brand-new outline.',
          art: '🦊🌉',
        },
        {
          tab: 'Act 2 · Fox',
          mission: 'The bridge is ready, but the hero is missing. Build the fox so it can cross under the moon!',
          title: 'The fox shakes its tail — alive!',
          text: 'The same shapes changed position and direction, turning a bridge into a fox. Each is a piece alone and a character together.',
          art: '🌙🦊',
        },
        {
          tab: 'Act 3 · Goose',
          mission: 'Wings rustle across the river. Build the goose to guide the fox home!',
          title: 'All three shadow-play acts are complete!',
          text: 'You used every piece with no overlaps. Slides, turns, and flips let seven shapes tell a whole story!',
          art: '🦊🪿✨',
        },
      ],
      next: 'Next act →',
      replay: 'Play it again',
    },
  };

  const COLORS = ['--coral', '--blue', '--gold', '--jade', '--violet', '--crimson', '--blue'];
  const PIECE_DEFS = [
    { id: 'large-a', shape: 'triangle', size: 1.18, points: [[-0.82, -0.82], [-0.82, 0.82], [0.82, 0.82]] },
    { id: 'large-b', shape: 'triangle', size: 1.18, points: [[-0.82, -0.82], [-0.82, 0.82], [0.82, 0.82]] },
    { id: 'medium', shape: 'triangle', size: 0.91, points: [[-0.76, -0.76], [-0.76, 0.76], [0.76, 0.76]] },
    { id: 'small-a', shape: 'triangle', size: 0.7, points: [[-0.72, -0.72], [-0.72, 0.72], [0.72, 0.72]] },
    { id: 'small-b', shape: 'triangle', size: 0.7, points: [[-0.72, -0.72], [-0.72, 0.72], [0.72, 0.72]] },
    { id: 'square', shape: 'square', size: 0.7, points: [[-0.63, -0.63], [0.63, -0.63], [0.63, 0.63], [-0.63, 0.63]] },
    { id: 'para', shape: 'para', size: 0.82, points: [[-0.9, -0.55], [0.4, -0.55], [0.9, 0.55], [-0.4, 0.55]] },
  ];

  const TARGETS = [
    [
      [0.35, 0.45, 225, 1], [0.55, 0.45, 315, 1], [0.45, 0.28, 45, 1],
      [0.25, 0.60, 45, 1], [0.65, 0.60, 135, 1], [0.45, 0.50, 45, 1], [0.45, 0.66, 0, 1],
    ],
    [
      [0.43, 0.48, 45, 1], [0.55, 0.53, 225, 1], [0.34, 0.34, 315, 1],
      [0.28, 0.25, 45, 1], [0.34, 0.62, 135, 1], [0.49, 0.66, 0, 1], [0.67, 0.42, 335, -1],
    ],
    [
      [0.48, 0.51, 225, 1], [0.59, 0.47, 45, 1], [0.37, 0.35, 315, 1],
      [0.31, 0.24, 45, 1], [0.66, 0.62, 225, 1], [0.45, 0.65, 0, 1], [0.68, 0.34, 25, 1],
    ],
  ];

  const SAVE_KEY = 'kidslab.tangram-theater';
  const canvas = document.querySelector('#stage');
  const ctx = canvas.getContext('2d');
  const els = {
    lang: document.querySelector('#langBtn'),
    theme: document.querySelector('#themeBtn'),
    mission: document.querySelector('#mission'),
    progress: document.querySelector('#progressCount'),
    tabs: document.querySelector('#sceneTabs'),
    act: document.querySelector('#actNumber'),
    pieceName: document.querySelector('#pieceName'),
    feedback: document.querySelector('#feedback'),
    shelf: document.querySelector('#pieceShelf'),
    left: document.querySelector('#leftBtn'),
    right: document.querySelector('#rightBtn'),
    flip: document.querySelector('#flipBtn'),
    hint: document.querySelector('#hintBtn'),
    reset: document.querySelector('#resetBtn'),
    modal: document.querySelector('#modal'),
    modalKicker: document.querySelector('#modalKicker'),
    modalArt: document.querySelector('#modalArt'),
    modalTitle: document.querySelector('#modalTitle'),
    modalText: document.querySelector('#modalText'),
    next: document.querySelector('#nextBtn'),
  };

  let t = (key) => key;
  let sceneIndex = 0;
  let unlocked = 0;
  let completed = 0;
  let selected = 0;
  let pieces = [];
  let dragging = null;
  let finaleStarted = 0;
  let hintPulse = -1;
  let cssWidth = 0;
  let cssHeight = 0;
  let dpr = 1;
  let feedbackKey = 'intro';
  let feedbackArgs = [];
  let feedbackKind = '';
  let feedbackTimer = 0;

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function readSave() {
    try {
      const data = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      unlocked = Math.min(2, Math.max(0, Number(data.unlocked) || 0));
      completed = Math.min(3, Math.max(0, Number(data.completed) || 0));
      sceneIndex = Math.min(unlocked, Math.max(0, Number(data.scene) || 0));
    } catch {
      unlocked = 0;
      completed = 0;
      sceneIndex = 0;
    }
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked, completed, scene: sceneIndex }));
    } catch {
      // Persistence is optional; the complete game remains playable.
    }
  }

  function sourceFor(index) {
    return {
      x: cssWidth * (0.12 + index * 0.125),
      y: cssHeight * 0.84,
    };
  }

  function targetFor(index) {
    const [x, y, rotation, flip] = TARGETS[sceneIndex][index];
    return { x: cssWidth * x, y: cssHeight * y, rotation, flip };
  }

  function pieceScale() {
    return Math.min(cssWidth, cssHeight) * 0.077;
  }

  function resetPieces(message = true) {
    pieces = PIECE_DEFS.map((definition, index) => {
      const source = sourceFor(index);
      return {
        ...definition,
        x: source.x,
        y: source.y,
        rotation: (index * 45 + sceneIndex * 15) % 360,
        flip: 1,
        placed: false,
      };
    });
    selected = 0;
    finaleStarted = 0;
    hintPulse = -1;
    if (message) setFeedback('resetDone', [], '');
    renderUI();
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const previousWidth = cssWidth || rect.width;
    const previousHeight = cssHeight || rect.height;
    cssWidth = Math.max(1, rect.width);
    cssHeight = Math.max(1, rect.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!pieces.length) {
      resetPieces(false);
      return;
    }

    pieces.forEach((piece, index) => {
      if (piece.placed) {
        const target = targetFor(index);
        piece.x = target.x;
        piece.y = target.y;
      } else {
        piece.x = piece.x / previousWidth * cssWidth;
        piece.y = piece.y / previousHeight * cssHeight;
      }
    });
  }

  function transformedPoints(piece, override = {}) {
    const scale = pieceScale() * piece.size;
    const rotation = (override.rotation ?? piece.rotation) * Math.PI / 180;
    const flip = override.flip ?? piece.flip;
    const x = override.x ?? piece.x;
    const y = override.y ?? piece.y;
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    return piece.points.map(([px, py]) => {
      const sx = px * scale * flip;
      const sy = py * scale;
      return [x + sx * cos - sy * sin, y + sx * sin + sy * cos];
    });
  }

  function pathPiece(piece, override) {
    const points = transformedPoints(piece, override);
    ctx.beginPath();
    points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.closePath();
  }

  function drawScenery(now) {
    const horizon = cssHeight * 0.72;
    const ink = cssVar('--line');
    const shadow = cssVar('--shadow');
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = ink;

    ctx.beginPath();
    ctx.moveTo(0, horizon);
    for (let x = 0; x <= cssWidth; x += 35) {
      ctx.lineTo(x, horizon - 10 - Math.sin(x * 0.035) * 8);
    }
    ctx.lineTo(cssWidth, cssHeight);
    ctx.lineTo(0, cssHeight);
    ctx.closePath();
    ctx.fill();

    const moonX = cssWidth * 0.76;
    const moonY = cssHeight * 0.18;
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = cssVar('--gold');
    ctx.beginPath();
    ctx.arc(moonX, moonY, Math.min(cssWidth, cssHeight) * 0.065, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.16;
    ctx.fillStyle = shadow;
    for (let i = 0; i < 5; i += 1) {
      const sway = Math.sin(now / 700 + i) * 4;
      ctx.fillRect(cssWidth * (0.1 + i * 0.2) + sway, horizon - 60 - i % 2 * 18, 4, 70);
      ctx.beginPath();
      ctx.ellipse(cssWidth * (0.1 + i * 0.2) + sway, horizon - 66 - i % 2 * 18, 17, 28, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawTargets(now) {
    pieces.forEach((piece, index) => {
      if (piece.placed) return;
      const target = targetFor(index);
      const pulse = index === hintPulse ? 0.48 + Math.sin(now / 170) * 0.16 : 0.24;
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.fillStyle = index === hintPulse ? cssVar('--gold') : cssVar('--ghost');
      ctx.strokeStyle = cssVar('--line');
      ctx.lineWidth = index === hintPulse ? 4 : 2;
      ctx.setLineDash(index === hintPulse ? [9, 7] : [5, 6]);
      pathPiece(piece, target);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawPiece(piece, index, now) {
    const color = cssVar(COLORS[index]);
    ctx.save();
    const lift = dragging?.index === index ? -5 : 0;
    if (lift) piece.y += lift;
    ctx.shadowColor = cssVar('--shadow');
    ctx.shadowBlur = dragging?.index === index ? 15 : 7;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = dragging?.index === index ? 9 : 5;
    pathPiece(piece);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = selected === index && !piece.placed ? 4 : 2;
    ctx.strokeStyle = selected === index && !piece.placed ? cssVar('--gold') : cssVar('--line');
    ctx.stroke();

    if (piece.placed) {
      ctx.globalAlpha = 0.18 + Math.sin(now / 500 + index) * 0.04;
      ctx.fillStyle = cssVar('--spotlight');
      pathPiece(piece);
      ctx.fill();
    }
    if (lift) piece.y -= lift;
    ctx.restore();
  }

  function drawFinale(now) {
    if (!finaleStarted) return;
    const elapsed = now - finaleStarted;
    const progress = Math.min(1, elapsed / 850);
    ctx.save();
    ctx.globalAlpha = 0.22 * (1 - progress);
    ctx.fillStyle = cssVar('--gold');
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    ctx.restore();

    if (elapsed > 900 && els.modal.hidden) showModal();
  }

  function draw(now = performance.now()) {
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    drawScenery(now);
    drawTargets(now);
    pieces.forEach((piece, index) => drawPiece(piece, index, now));
    drawFinale(now);
    requestAnimationFrame(draw);
  }

  function pointInPolygon(x, y, points) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
      const [xi, yi] = points[i];
      const [xj, yj] = points[j];
      const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi || 0.00001) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function pickPiece(x, y) {
    for (let index = pieces.length - 1; index >= 0; index -= 1) {
      if (!pieces[index].placed && pointInPolygon(x, y, transformedPoints(pieces[index]))) return index;
    }
    return -1;
  }

  function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
  }

  function angleDistance(a, b) {
    const difference = Math.abs(normalizeAngle(a) - normalizeAngle(b));
    return Math.min(difference, 360 - difference);
  }

  function setFeedback(key, args = [], kind = '') {
    clearTimeout(feedbackTimer);
    feedbackTimer = 0;
    feedbackKey = key;
    feedbackArgs = args;
    feedbackKind = kind;
    renderFeedback();
  }

  function renderFeedback() {
    els.feedback.textContent = t(feedbackKey, ...feedbackArgs);
    els.feedback.className = `feedback${feedbackKind ? ` is-${feedbackKind}` : ''}`;
  }

  function trySnap(index) {
    const piece = pieces[index];
    const target = targetFor(index);
    const distance = Math.hypot(piece.x - target.x, piece.y - target.y);
    const closeEnough = distance <= Math.max(34, pieceScale() * 0.9);
    const angleMatches = angleDistance(piece.rotation, target.rotation) <= 24;
    const flipMatches = piece.flip === target.flip;

    if (closeEnough && angleMatches && flipMatches) {
      piece.x = target.x;
      piece.y = target.y;
      piece.rotation = target.rotation;
      piece.flip = target.flip;
      piece.placed = true;
      hintPulse = -1;
      const count = pieces.filter((candidate) => candidate.placed).length;
      window.cool.track('place_tangram_piece', { scene: sceneIndex + 1, piece: piece.id });
      if (count === pieces.length) {
        setFeedback('lastPiece', [], 'good');
        completeScene();
      } else {
        selected = pieces.findIndex((candidate) => !candidate.placed);
        setFeedback('correct', [t('pieces')[index], count], 'good');
      }
      renderUI();
      return true;
    }

    const source = sourceFor(index);
    piece.x = source.x;
    piece.y = source.y;
    setFeedback('wrong', [], 'wrong');
    window.cool.track('retry_tangram_piece', { scene: sceneIndex + 1 });
    clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => setFeedback('selected', [t('pieces')[index]], ''), 1400);
    return false;
  }

  function pointerDown(event) {
    if (finaleStarted || !els.modal.hidden) return;
    const point = canvasPoint(event);
    const index = pickPiece(point.x, point.y);

    if (index < 0) {
      const piece = pieces[selected];
      if (piece && !piece.placed) {
        piece.x = point.x;
        piece.y = point.y;
        trySnap(selected);
      }
      return;
    }

    selected = index;
    const piece = pieces[index];
    dragging = { index, dx: point.x - piece.x, dy: point.y - piece.y };
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add('is-dragging');
    setFeedback('selected', [t('pieces')[index]], '');
    renderUI();
  }

  function pointerMove(event) {
    if (!dragging) return;
    const point = canvasPoint(event);
    const piece = pieces[dragging.index];
    piece.x = point.x - dragging.dx;
    piece.y = point.y - dragging.dy;
  }

  function pointerUp(event) {
    if (!dragging) return;
    const index = dragging.index;
    dragging = null;
    canvas.classList.remove('is-dragging');
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    trySnap(index);
  }

  function transformSelected(deltaRotation = 0, shouldFlip = false) {
    const piece = pieces[selected];
    if (!piece || piece.placed || finaleStarted) return;
    piece.rotation = normalizeAngle(piece.rotation + deltaRotation);
    if (shouldFlip) piece.flip *= -1;
    setFeedback('selected', [t('pieces')[selected]], '');
    window.cool.track(shouldFlip ? 'flip_tangram_piece' : 'turn_tangram_piece');
  }

  function placeHint() {
    if (finaleStarted) return;
    let index = selected;
    if (pieces[index]?.placed) index = pieces.findIndex((piece) => !piece.placed);
    if (index < 0) return;
    const piece = pieces[index];
    const target = targetFor(index);
    piece.x = target.x;
    piece.y = target.y;
    piece.rotation = target.rotation;
    piece.flip = target.flip;
    piece.placed = true;
    hintPulse = index;
    const count = pieces.filter((candidate) => candidate.placed).length;
    setFeedback(count === 7 ? 'lastPiece' : 'hintPlaced', count === 7 ? [] : [t('pieces')[index]], 'good');
    window.cool.track('use_tangram_hint', { scene: sceneIndex + 1 });
    if (count === 7) completeScene();
    else selected = pieces.findIndex((candidate) => !candidate.placed);
    renderUI();
  }

  function completeScene() {
    if (finaleStarted) return;
    finaleStarted = performance.now();
    completed = Math.max(completed, sceneIndex + 1);
    if (sceneIndex < 2) unlocked = Math.max(unlocked, sceneIndex + 1);
    save();
    window.cool.stage(`act-${sceneIndex + 1}-complete`);
    if (sceneIndex === 2) window.cool.complete?.();
  }

  function showModal() {
    const scene = t('scenes')[sceneIndex];
    els.modalKicker.textContent = scene.tab;
    els.modalArt.textContent = scene.art;
    els.modalTitle.textContent = scene.title;
    els.modalText.textContent = scene.text;
    els.next.textContent = sceneIndex === 2 ? t('replay') : t('next');
    els.modal.hidden = false;
  }

  function switchScene(index) {
    if (index > unlocked) {
      setFeedback('locked', [], 'wrong');
      return;
    }
    sceneIndex = index;
    els.modal.hidden = true;
    save();
    resetPieces(false);
    setFeedback(index < completed ? 'completedScene' : 'intro', [], '');
    window.cool.stage(`act-${sceneIndex + 1}`);
    renderUI();
  }

  function nextScene() {
    if (sceneIndex === 2) {
      completed = 0;
      unlocked = 0;
      switchScene(0);
      return;
    }
    switchScene(sceneIndex + 1);
  }

  function renderTabs() {
    els.tabs.innerHTML = t('scenes').map((scene, index) => `
      <button class="scene-tab ${index === sceneIndex ? 'is-active' : ''} ${index < completed ? 'is-done' : ''}"
        type="button" data-scene="${index}" ${index > unlocked ? 'disabled' : ''}>${scene.tab}</button>
    `).join('');
    els.tabs.querySelectorAll('[data-scene]').forEach((button) => {
      button.addEventListener('click', () => switchScene(Number(button.dataset.scene)));
    });
  }

  function renderShelf() {
    els.shelf.innerHTML = pieces.map((piece, index) => `
      <button class="piece-button ${selected === index ? 'is-active' : ''} ${piece.placed ? 'is-placed' : ''}"
        type="button" role="option" aria-selected="${selected === index}" data-piece="${index}"
        data-shape="${piece.shape}" aria-label="${t('pieces')[index]}"
        style="--piece-color:${cssVar(COLORS[index])}">
        <span class="piece-button__shape" aria-hidden="true"></span>
      </button>
    `).join('');
    els.shelf.querySelectorAll('[data-piece]').forEach((button) => {
      button.addEventListener('click', () => {
        selected = Number(button.dataset.piece);
        const piece = pieces[selected];
        setFeedback(piece.placed ? 'completedScene' : 'selected', piece.placed ? [] : [t('pieces')[selected]], '');
        renderUI();
      });
    });
  }

  function renderUI() {
    if (!pieces.length) return;
    const count = pieces.filter((piece) => piece.placed).length;
    const scene = t('scenes')[sceneIndex];
    els.mission.textContent = scene.mission;
    els.progress.textContent = `${count}/7`;
    els.act.textContent = sceneIndex + 1;
    els.pieceName.textContent = t('pieces')[selected];
    els.left.disabled = pieces[selected].placed || Boolean(finaleStarted);
    els.right.disabled = pieces[selected].placed || Boolean(finaleStarted);
    els.flip.disabled = pieces[selected].placed || Boolean(finaleStarted);
    els.hint.disabled = Boolean(finaleStarted);
    els.hint.setAttribute('aria-label', t('hint'));
    els.reset.setAttribute('aria-label', t('reset'));
    els.theme.setAttribute('aria-label', t('theme'));
    canvas.setAttribute('aria-label', t('stageLabel'));
    els.shelf.setAttribute('aria-label', t('shelfLabel'));
    document.querySelector('.control-row').setAttribute('aria-label', t('controlsLabel'));
    renderFeedback();
    renderTabs();
    renderShelf();
  }

  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointercancel', pointerUp);
  els.left.addEventListener('click', () => transformSelected(-45));
  els.right.addEventListener('click', () => transformSelected(45));
  els.flip.addEventListener('click', () => transformSelected(0, true));
  els.hint.addEventListener('click', placeHint);
  els.reset.addEventListener('click', () => {
    resetPieces(false);
    setFeedback('resetDone', [], '');
    window.cool.track('reset_tangram_act', { scene: sceneIndex + 1 });
  });
  els.next.addEventListener('click', nextScene);
  els.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  els.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') transformSelected(-45);
    if (event.key === 'ArrowRight') transformSelected(45);
    if (event.key.toLowerCase() === 'f') transformSelected(0, true);
  });

  readSave();
  new ResizeObserver(resizeCanvas).observe(canvas);
  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang, theme }) {
      t = translate;
      document.title = t('doc');
      els.lang.textContent = lang === 'zh' ? 'EN' : '中';
      els.theme.textContent = theme === 'light' ? '🌙' : '☀️';
      renderUI();
    },
  });
  requestAnimationFrame(draw);
})();
