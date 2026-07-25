(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '墨迹怪物 · KidsLab',
      back: '返回平台',
      title: '墨迹怪物',
      chapter: '实验',
      navLabel: '实验关卡',
      canvasLabel: '墨迹实验纸',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      colorLabel: '墨水颜色',
      toolsLabel: '墨迹形状',
      choicesLabel: '镜像候选点',
      suspectsLabel: '怪物候选',
      inkDesk: '墨水工作台',
      chooseSplash: '选颜色与墨迹',
      toolBlob: '圆墨团',
      toolSplat: '爆墨花',
      toolDrip: '长墨滴',
      splash: '甩一团墨',
      fold: '沿虚线对折',
      nextMission: '下一关',
      mirrorDesk: '镜像修复台',
      mirrorRound: (n) => `第 ${n} 个斑点`,
      mirrorPrompt: '哪一个候选点和左边墨点离虚线一样远？',
      sameDistance: '对应点到对称轴的距离相等',
      detectiveDesk: '图鉴审查台',
      findFake: '找出冒牌怪',
      detectivePrompt: '轮廓看起来都很像，仔细检查眼睛、牙齿和斑点。',
      monsterOne: '1 号怪',
      monsterTwo: '2 号怪',
      monsterThree: '3 号怪',
      hint: '轻提示',
      restart: '重来本关',
      guideOne: '先看虚线两边',
      guideTwo: '比较对应位置',
      guideThree: '每个细节都要对称',
      finalKicker: '怪物图鉴认证完成',
      finalTitle: '轴对称驯兽师！',
      finalText: '你会用“折起来能重合”和“离对称轴一样远”检查每一个细节了。',
      playAgain: '再孵一只',
      sixfoldButton: '三折彩蛋',
      sixfoldStatus: '三折展开！同一团墨绕中心重复 6 次，变成旋转对称巨兽。',
      sixfoldBurst: '六重旋转对称',
      mission1Kicker: '怪物孵化室',
      mission1Title: '甩墨再对折',
      mission1Text: '在纸的左半边留下至少 3 团墨，再沿虚线对折。',
      mission2Kicker: '镜像急诊室',
      mission2Title: '补回另一半',
      mission2Text: '连续修好 3 个斑点：对应点要在另一侧，而且离虚线一样远。',
      mission3Kicker: '图鉴审查局',
      mission3Title: '揪出冒牌怪',
      mission3Text: '找出唯一不关于中线轴对称的怪物，别被相似轮廓骗了。',
      missionLabel: (n, title) => `第 ${n} 关：${title}`,
      lockedMission: '先完成前一关',
      createReady: '先选工具，再往左半张纸甩墨！',
      createCount: (n) => `墨团 ${n}/3`,
      leftOnly: '墨要甩在左半张纸上，右半边交给镜子！',
      needMore: (n) => `还差 ${n} 团墨，怪物才有完整身体。`,
      created: '啪！两边完全重合，一只轴对称怪物醒来了。',
      mirrorReady: '看左边的彩色斑点，选出它在右边的镜像位置。',
      mirrorCorrect: (n) => `位置正确！两边到虚线一样远。还剩 ${n} 个。`,
      mirrorDone: '三个斑点全部归位，镜像修复完成！',
      mirrorWrong: '这个点离虚线的距离不同，再比较一次。',
      detectiveReady: '检查每只怪的眼睛、牙齿和斑点，找出不对称的那只。',
      detectiveWrong: '这只怪的每个细节都能在另一边找到对应，继续查！',
      detectiveCorrect: '抓到了！2 号怪只有右边多了一颗斑点。',
      hintCreate: '虚线是对称轴。只画左边，对折会自动得到右边。',
      hintMirror: '像量尺一样比较：左点离虚线几格，右点也要离几格。',
      hintDetective: '先比眼睛，再比牙齿，最后数两边的小斑点。',
      progressInk: '墨团',
      progressSpots: '斑点',
      progressCase: '审查',
      caseOpen: '待抓捕',
      caseClosed: '已抓捕',
      candidate: (letter, steps) => `候选点 ${letter}，离对称轴 ${steps} 格`,
      mirrorA11y: (steps) => `左边墨点离对称轴 ${steps} 格。请选择右边距离相同的候选点，也可以直接在画布右半边点出位置。`,
      mirrorCanvas: (steps) => `镜像点绘制区。左边墨点离对称轴 ${steps} 格，可在右半边点出对应位置。`,
      suspectA11y: '1 号两边细节成对；2 号右边多一个斑点；3 号两边细节成对。',
      suspect: (n, detail) => `${n} 号怪物，${detail}`,
      symmetricDetail: '眼睛、牙齿和斑点都左右成对',
      asymmetricDetail: '眼睛和牙齿成对，但右边多一个斑点',
      berry: '莓果红',
      ocean: '海洋蓝',
      lime: '青柠绿',
      axis: '对称轴',
      foldMatch: '折叠后重合',
      equalDistance: '距离相等',
      fakeMark: '多出的斑点',
    },
    en: {
      doc: 'Inkblot Monsters · KidsLab',
      back: 'Back to platform',
      title: 'Inkblot Monsters',
      chapter: 'LAB',
      navLabel: 'Lab missions',
      canvasLabel: 'Inkblot experiment paper',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      colorLabel: 'Ink colors',
      toolsLabel: 'Ink shapes',
      choicesLabel: 'Mirror point choices',
      suspectsLabel: 'Monster suspects',
      inkDesk: 'INK WORKBENCH',
      chooseSplash: 'Pick a color and splat',
      toolBlob: 'Round blob',
      toolSplat: 'Star splat',
      toolDrip: 'Long drip',
      splash: 'Throw a splat',
      fold: 'Fold on the line',
      nextMission: 'Next mission',
      mirrorDesk: 'MIRROR REPAIR',
      mirrorRound: (n) => `Spot ${n} of 3`,
      mirrorPrompt: 'Which point is the same distance from the fold as the spot on the left?',
      sameDistance: 'Mirror points are equally far from the axis',
      detectiveDesk: 'GALLERY INSPECTION',
      findFake: 'Catch the impostor',
      detectivePrompt: 'Their outlines look alike. Check every eye, tooth, and spot.',
      monsterOne: 'Monster 1',
      monsterTwo: 'Monster 2',
      monsterThree: 'Monster 3',
      hint: 'Small hint',
      restart: 'Restart mission',
      guideOne: 'Look across the fold',
      guideTwo: 'Compare matching places',
      guideThree: 'Every detail must mirror',
      finalKicker: 'MONSTER GALLERY CERTIFIED',
      finalTitle: 'Line-Symmetry Tamer!',
      finalText: 'You can test every detail by folding to match and checking equal distance from the symmetry axis.',
      playAgain: 'Hatch another',
      sixfoldButton: 'Three-fold surprise',
      sixfoldStatus: 'Three folds open! One splat repeats 6 times around the center as a rotationally symmetric beast.',
      sixfoldBurst: 'six-fold rotational symmetry',
      mission1Kicker: 'HATCHERY',
      mission1Title: 'Splash, Then Fold',
      mission1Text: 'Leave at least 3 splats on the left half, then fold along the dashed line.',
      mission2Kicker: 'MIRROR CLINIC',
      mission2Title: 'Repair the Other Half',
      mission2Text: 'Repair 3 spots: each match belongs on the other side at the same distance from the fold.',
      mission3Kicker: 'GALLERY PATROL',
      mission3Title: 'Catch the Impostor',
      mission3Text: 'Find the only monster that is not line-symmetric. Similar outlines can still hide a mismatch.',
      missionLabel: (n, title) => `Mission ${n}: ${title}`,
      lockedMission: 'Finish the previous mission first',
      createReady: 'Pick a tool, then splash the left half of the page!',
      createCount: (n) => `Splats ${n}/3`,
      leftOnly: 'Splash the left half. Let the mirror make the right!',
      needMore: (n) => `${n} more splat${n === 1 ? '' : 's'} will give the monster a full body.`,
      created: 'SPLAT! Both halves match, and a line-symmetric monster wakes up.',
      mirrorReady: 'Look at the colored spot on the left and choose its mirror place on the right.',
      mirrorCorrect: (n) => `Correct place! Both points are equally far from the fold. ${n} left.`,
      mirrorDone: 'All three spots are home. Mirror repair complete!',
      mirrorWrong: 'That point is a different distance from the fold. Compare again.',
      detectiveReady: 'Check every eye, tooth, and spot. Find the monster that is not symmetric.',
      detectiveWrong: 'Every detail on this monster has a matching partner. Keep looking!',
      detectiveCorrect: 'Caught it! Monster 2 has one extra spot on the right.',
      hintCreate: 'The dashed line is the symmetry axis. Draw left; folding makes the right.',
      hintMirror: 'Count like a ruler: the left and right points must be equally far from the line.',
      hintDetective: 'Compare the eyes, then teeth, then count the tiny spots on both sides.',
      progressInk: 'Splats',
      progressSpots: 'Spots',
      progressCase: 'Case',
      caseOpen: 'Open',
      caseClosed: 'Closed',
      candidate: (letter, steps) => `Candidate ${letter}, ${steps} grid step${steps === 1 ? '' : 's'} from the symmetry axis`,
      mirrorA11y: (steps) => `The left spot is ${steps} grid step${steps === 1 ? '' : 's'} from the symmetry axis. Choose a point at the same distance on the right, or place it directly on the canvas.`,
      mirrorCanvas: (steps) => `Mirror-point drawing area. The left spot is ${steps} grid step${steps === 1 ? '' : 's'} from the axis; place its match on the right.`,
      suspectA11y: 'Monster 1 has paired details; Monster 2 has one extra spot on the right; Monster 3 has paired details.',
      suspect: (n, detail) => `Monster ${n}: ${detail}`,
      symmetricDetail: 'eyes, teeth, and spots are paired left to right',
      asymmetricDetail: 'eyes and teeth are paired, but there is one extra spot on the right',
      berry: 'Berry red',
      ocean: 'Ocean blue',
      lime: 'Lime green',
      axis: 'symmetry axis',
      foldMatch: 'matches when folded',
      equalDistance: 'equal distance',
      fakeMark: 'extra spot',
    },
  };

  const MISSIONS = [
    { kicker: 'mission1Kicker', title: 'mission1Title', text: 'mission1Text' },
    { kicker: 'mission2Kicker', title: 'mission2Title', text: 'mission2Text' },
    { kicker: 'mission3Kicker', title: 'mission3Title', text: 'mission3Text' },
  ];
  const COLORS = { berry: '--berry', ocean: '--ocean', lime: '--lime' };
  const SPLASH_POSITIONS = [
    { x: 295, y: 190 }, { x: 345, y: 300 }, { x: 235, y: 325 },
    { x: 340, y: 125 }, { x: 190, y: 240 }, { x: 275, y: 365 },
  ];
  const MIRROR_ROUNDS = [
    { y: 150, distance: 155, correct: 1, color: 'berry' },
    { y: 245, distance: 80, correct: 0, color: 'ocean' },
    { y: 335, distance: 230, correct: 2, color: 'lime' },
  ];
  const OPTION_DISTANCES = [80, 155, 230];
  const SAVE_KEY = 'kidslab.inkblot-monsters';
  const SOUND_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    chapterNumber: $('#chapterNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    nav: $('#missionNav'),
    status: $('#status'),
    progressLabel: $('#progressLabel'),
    progressValue: $('#progressValue'),
    shell: $('#canvasShell'),
    canvas: $('#inkCanvas'),
    burst: $('#resultBurst'),
    createPanel: $('#createPanel'),
    mirrorPanel: $('#mirrorPanel'),
    detectivePanel: $('#detectivePanel'),
    palette: $('#palette'),
    tools: $('#tools'),
    splash: $('#splashBtn'),
    fold: $('#foldBtn'),
    foldLabel: $('#foldLabel'),
    mirrorRound: $('#mirrorRound'),
    mirrorChoices: $('#mirrorChoices'),
    mirrorA11y: $('#mirrorA11y'),
    suspects: $('#suspectChoices'),
    hint: $('#hintBtn'),
    restart: $('#restartBtn'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
    modal: $('#completeModal'),
    sixfold: $('#sixfoldBtn'),
    playAgain: $('#playAgainBtn'),
  };
  const ctx = el.canvas.getContext('2d');
  const modalBackground = [document.querySelector('.bar'), document.querySelector('.course')];
  let t = (key) => key;
  let language = 'zh';
  let missionIndex = 0;
  let unlocked = 0;
  let completed = new Set();
  let splats = [];
  let selectedColor = 'berry';
  let selectedTool = 'blob';
  let folded = false;
  let mirrorIndex = 0;
  let solvedMirrors = [];
  let detectiveSolved = false;
  let statusMessage = { key: 'createReady', args: [] };
  let resultKey = null;
  let hintTimer = 0;
  let transitionTimer = 0;
  let bonusMode = false;

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(2, Math.max(0, Number(saved.unlocked) || 0));
    completed = new Set(Array.isArray(saved.completed) ? saved.completed.filter((n) => Number.isInteger(n) && n >= 0 && n < 3) : []);
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
          tap: [[360, 0, 0.06]],
          splat: [[120, 0, 0.07], [92, 0.04, 0.12]],
          fold: [[210, 0, 0.08], [330, 0.08, 0.13]],
          wrong: [[175, 0, 0.12], [125, 0.1, 0.18]],
          correct: [[480, 0, 0.1], [640, 0.09, 0.15]],
          complete: [[392, 0, 0.1], [523, 0.1, 0.11], [659, 0.2, 0.13], [784, 0.31, 0.25]],
        };
        (patterns[kind] || patterns.tap).forEach(([frequency, delay, duration]) => {
          const oscillator = this.context.createOscillator();
          const gain = this.context.createGain();
          const start = this.context.currentTime + delay;
          oscillator.type = kind === 'splat' || kind === 'wrong' ? 'triangle' : 'sine';
          oscillator.frequency.setValueAtTime(frequency, start);
          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.exponentialRampToValueAtTime(0.09, start + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
          oscillator.connect(gain).connect(this.context.destination);
          oscillator.start(start);
          oscillator.stop(start + duration + 0.02);
        });
      } catch {
        // Sound is optional; all feedback also appears visually.
      }
    }
  }

  const sound = new SoundEngine();
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const setStatus = (key, ...args) => { statusMessage = { key, args }; };
  const statusText = () => t(statusMessage.key, ...statusMessage.args);

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked, completed: [...completed] }));
    } catch {
      // Progress persistence is optional.
    }
  }

  function resetHintTimer() {
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      setStatus(['hintCreate', 'hintMirror', 'hintDetective'][missionIndex]);
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

  function completeMission(index) {
    completed.add(index);
    unlocked = Math.max(unlocked, Math.min(2, index + 1));
    persist();
    window.cool?.stage(`inkblot-mission-${index + 1}`);
  }

  function resetMission(index, message) {
    clearTimeout(transitionTimer);
    transitionTimer = 0;
    bonusMode = false;
    missionIndex = index;
    resultKey = null;
    setModalOpen(false);
    if (index === 0) {
      splats = [];
      folded = false;
      setStatus(message || 'createReady');
    } else if (index === 1) {
      mirrorIndex = 0;
      solvedMirrors = [];
      setStatus(message || 'mirrorReady');
    } else {
      detectiveSolved = false;
      setStatus(message || 'detectiveReady');
    }
    resetHintTimer();
    render();
  }

  function goToMission(index) {
    if (index > unlocked) return;
    resetMission(index);
  }

  function addSplat(x, y) {
    if (missionIndex !== 0 || folded) return;
    if (x >= 445 || x <= 80 || y <= 55 || y >= 415) {
      setStatus('leftOnly');
      resultKey = null;
      sound.play('wrong');
      render();
      return;
    }
    splats.push({
      x,
      y,
      color: selectedColor,
      tool: selectedTool,
      size: 34 + (splats.length % 3) * 8,
      seed: splats.length + 1,
    });
    setStatus('createCount', Math.min(3, splats.length));
    resultKey = null;
    sound.play('splat');
    window.cool?.track('throw-ink-splat', { count: splats.length, shape: selectedTool });
    resetHintTimer();
    render();
  }

  function addPresetSplat() {
    const position = SPLASH_POSITIONS[splats.length % SPLASH_POSITIONS.length];
    addSplat(position.x, position.y);
  }

  function foldPaper() {
    if (folded) {
      resetMission(1);
      el.mirrorChoices.querySelector('button')?.focus();
      return;
    }
    if (splats.length < 3) {
      setStatus('needMore', 3 - splats.length);
      resultKey = null;
      sound.play('wrong');
      render();
      return;
    }
    folded = true;
    completeMission(0);
    setStatus('created');
    resultKey = 'foldMatch';
    sound.play('fold');
    el.shell.classList.remove('fold-pop');
    void el.shell.offsetWidth;
    el.shell.classList.add('fold-pop');
    window.cool?.track('fold-ink-monster', { splats: splats.length });
    render();
  }

  function chooseMirror(choice) {
    if (missionIndex !== 1 || mirrorIndex >= MIRROR_ROUNDS.length) return;
    const button = el.mirrorChoices.querySelector(`[data-choice="${choice}"]`);
    const round = MIRROR_ROUNDS[mirrorIndex];
    if (choice !== round.correct) {
      button.classList.remove('wrong');
      void button.offsetWidth;
      button.classList.add('wrong');
      setStatus('mirrorWrong');
      resultKey = null;
      sound.play('wrong');
      window.cool?.track('miss-mirror-point', { round: mirrorIndex + 1, choice });
      render();
      return;
    }
    button.classList.remove('wrong');
    button.classList.add('correct');
    solvedMirrors.push(round);
    mirrorIndex += 1;
    sound.play('correct');
    window.cool?.track('place-mirror-point', { round: mirrorIndex });
    if (mirrorIndex === MIRROR_ROUNDS.length) {
      completeMission(1);
      setStatus('mirrorDone');
      resultKey = 'equalDistance';
      transitionTimer = setTimeout(() => {
        transitionTimer = 0;
        resetMission(2);
      }, 850);
    } else {
      setStatus('mirrorCorrect', MIRROR_ROUNDS.length - mirrorIndex);
      transitionTimer = setTimeout(() => {
        transitionTimer = 0;
        el.mirrorChoices.querySelectorAll('button').forEach((candidate) => candidate.classList.remove('correct', 'wrong'));
        render();
      }, 380);
    }
    resetHintTimer();
    render();
  }

  function chooseSuspect(index) {
    if (missionIndex !== 2 || detectiveSolved) return;
    const button = el.suspects.querySelector(`[data-suspect="${index}"]`);
    if (index !== 1) {
      button.classList.remove('wrong');
      void button.offsetWidth;
      button.classList.add('wrong');
      setStatus('detectiveWrong');
      resultKey = null;
      sound.play('wrong');
      window.cool?.track('clear-symmetric-monster', { suspect: index + 1 });
      render();
      return;
    }
    detectiveSolved = true;
    button.classList.add('correct');
    completeMission(2);
    setStatus('detectiveCorrect');
    resultKey = 'fakeMark';
    sound.play('complete');
    window.cool?.track('catch-inkblot-impostor', { suspect: 2 });
    window.cool?.complete?.();
    render();
    transitionTimer = setTimeout(() => {
      transitionTimer = 0;
      setModalOpen(true);
    }, 500);
  }

  function showHint() {
    setStatus(['hintCreate', 'hintMirror', 'hintDetective'][missionIndex]);
    resultKey = null;
    sound.play('tap');
    window.cool?.track('request-inkblot-hint', { mission: missionIndex + 1 });
    resetHintTimer();
    render();
  }

  function drawRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
  }

  function paperBase() {
    ctx.fillStyle = cssVar('--stage');
    ctx.fillRect(0, 0, 900, 460);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.18)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 9;
    ctx.fillStyle = cssVar('--paper');
    ctx.strokeStyle = '#25312d';
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, 68, 35, 764, 390, 24);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = 'rgba(37,49,45,.16)';
    ctx.lineWidth = 1;
    for (let y = 64; y < 415; y += 28) {
      ctx.beginPath();
      ctx.moveTo(88, y);
      ctx.lineTo(812, y);
      ctx.stroke();
    }
    ctx.setLineDash([10, 9]);
    ctx.strokeStyle = 'rgba(37,49,45,.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(450, 48);
    ctx.lineTo(450, 414);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = cssVar('--canvas-label');
    ctx.font = '900 15px ui-rounded, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('axis'), 450, 27);
    ctx.restore();
  }

  function splatPath(splat, mirrored = false) {
    const x = mirrored ? 900 - splat.x : splat.x;
    const direction = mirrored ? -1 : 1;
    const size = splat.size;
    ctx.save();
    ctx.translate(x, splat.y);
    ctx.scale(direction, 1);
    ctx.fillStyle = cssVar(COLORS[splat.color]);
    ctx.strokeStyle = '#25312d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (splat.tool === 'drip') {
      ctx.ellipse(0, 0, size * 0.58, size, -0.15, 0, Math.PI * 2);
      ctx.moveTo(size * 0.18, -size * 0.82);
      ctx.quadraticCurveTo(size * 0.6, -size * 1.45, size * 0.12, -size * 1.7);
      ctx.quadraticCurveTo(-size * 0.25, -size * 1.3, -size * 0.1, -size * 0.75);
    } else {
      const points = splat.tool === 'splat' ? 16 : 11;
      for (let i = 0; i < points; i += 1) {
        const angle = i / points * Math.PI * 2;
        const pulse = splat.tool === 'splat' && i % 2 ? 0.58 : 1;
        const jitter = 0.82 + ((i * 7 + splat.seed * 5) % 5) * 0.07;
        const radius = size * pulse * jitter;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius * 0.83;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
    if (splat.tool === 'splat') {
      [[1.45, -0.5, 0.13], [1.2, 0.78, 0.1], [-0.25, 1.25, 0.12]].forEach(([dx, dy, radius]) => {
        ctx.beginPath();
        ctx.arc(size * dx, size * dy, size * radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }
    ctx.restore();
  }

  function drawMonsterFace() {
    const eyeY = 195;
    [-76, 76].forEach((dx) => {
      ctx.fillStyle = '#fffdf4';
      ctx.strokeStyle = '#25312d';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(450 + dx, eyeY, 30, 35, dx < 0 ? -0.08 : 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#25312d';
      ctx.beginPath();
      ctx.arc(450 + dx * 0.93, eyeY + 3, 10, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.strokeStyle = '#25312d';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(450, 275, 76, 0.2, Math.PI - 0.2);
    ctx.stroke();
    [-38, 0, 38].forEach((dx) => {
      ctx.fillStyle = '#fffdf4';
      ctx.beginPath();
      ctx.moveTo(450 + dx - 12, 302);
      ctx.lineTo(450 + dx, 327);
      ctx.lineTo(450 + dx + 12, 302);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }

  function drawCreate() {
    paperBase();
    splats.forEach((splat) => {
      splatPath(splat);
      if (folded) splatPath(splat, true);
    });
    if (folded) drawMonsterFace();
    if (!splats.length) {
      ctx.fillStyle = 'rgba(37,49,45,.58)';
      ctx.font = '900 20px ui-rounded, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(language === 'zh' ? '← 在左边甩墨' : '← Splash on the left', 285, 238);
    }
  }

  function drawMirror() {
    paperBase();
    solvedMirrors.forEach((round) => {
      const color = cssVar(COLORS[round.color]);
      ctx.fillStyle = color;
      ctx.strokeStyle = '#25312d';
      ctx.lineWidth = 3;
      [450 - round.distance, 450 + round.distance].forEach((x) => {
        ctx.beginPath();
        ctx.arc(x, round.y, 19, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    });
    if (mirrorIndex >= MIRROR_ROUNDS.length) return;
    const round = MIRROR_ROUNDS[mirrorIndex];
    ctx.fillStyle = cssVar(COLORS[round.color]);
    ctx.strokeStyle = '#25312d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(450 - round.distance, round.y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = '#25312d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(450 - round.distance, round.y);
    ctx.lineTo(450, round.y);
    ctx.stroke();
    ctx.restore();
    OPTION_DISTANCES.forEach((distance, index) => {
      const x = 450 + distance;
      ctx.fillStyle = '#fff9e9';
      ctx.strokeStyle = index === round.correct ? cssVar(COLORS[round.color]) : '#25312d';
      ctx.lineWidth = index === round.correct ? 5 : 3;
      ctx.beginPath();
      ctx.arc(x, round.y, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#25312d';
      ctx.font = '1000 19px ui-rounded, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(['A', 'B', 'C'][index], x, round.y + 7);
    });
  }

  function miniMonster(cx, cy, color, fake = false, mood = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = color;
    ctx.strokeStyle = '#25312d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-92, 75);
    ctx.bezierCurveTo(-125, 22, -110, -80, -42, -90);
    ctx.bezierCurveTo(-20, -118, 20, -118, 42, -90);
    ctx.bezierCurveTo(110, -80, 125, 22, 92, 75);
    ctx.bezierCurveTo(55, 112, -55, 112, -92, 75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    [-38, 38].forEach((x) => {
      ctx.fillStyle = '#fffdf4';
      ctx.beginPath();
      ctx.arc(x, -34, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#25312d';
      ctx.beginPath();
      ctx.arc(x + (mood ? 2 : -2), -31, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.strokeStyle = '#25312d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 20, 42, 0.15, Math.PI - 0.15);
    ctx.stroke();
    [-22, 22].forEach((x) => {
      ctx.fillStyle = '#fffdf4';
      ctx.beginPath();
      ctx.moveTo(x - 9, 42);
      ctx.lineTo(x, 62);
      ctx.lineTo(x + 9, 42);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    [[-65, 25], [65, 25], [-72, -62], [72, -62]].forEach(([x, y]) => {
      ctx.fillStyle = '#25312d';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    if (fake) {
      ctx.fillStyle = '#25312d';
      ctx.beginPath();
      ctx.arc(44, 58, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawDetective() {
    ctx.fillStyle = cssVar('--stage');
    ctx.fillRect(0, 0, 900, 460);
    const cards = [
      { x: 35, color: cssVar(COLORS[splats[0]?.color] || '--ocean'), fake: false, tilt: -0.02 },
      { x: 315, color: cssVar('--berry'), fake: true, tilt: 0.025 },
      { x: 595, color: cssVar('--lime'), fake: false, tilt: -0.015 },
    ];
    cards.forEach((card, index) => {
      ctx.save();
      ctx.translate(card.x + 130, 230);
      ctx.rotate(card.tilt);
      ctx.fillStyle = cssVar('--paper');
      ctx.strokeStyle = '#25312d';
      ctx.lineWidth = 4;
      ctx.shadowColor = 'rgba(0,0,0,.18)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 7;
      drawRoundedRect(ctx, -120, -185, 240, 370, 22);
      ctx.fill();
      ctx.stroke();
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#25312d';
      ctx.font = '1000 22px ui-rounded, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`#${index + 1}`, 0, -145);
      miniMonster(0, 10, card.color, card.fake, index);
      ctx.restore();
    });
  }

  function drawSixfold() {
    ctx.fillStyle = cssVar('--stage');
    ctx.fillRect(0, 0, 900, 460);
    ctx.save();
    ctx.translate(450, 230);
    ctx.fillStyle = cssVar('--paper');
    ctx.strokeStyle = '#25312d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 194, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    const source = splats.length ? splats.slice(0, 4) : [
      { color: 'berry', size: 38 },
      { color: 'ocean', size: 34 },
      { color: 'lime', size: 30 },
    ];
    source.forEach((splat, index) => {
      const radius = 62 + index * 36;
      const base = index * 0.34;
      for (let turn = 0; turn < 6; turn += 1) {
        const angle = base + turn * Math.PI / 3;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        ctx.fillStyle = cssVar(COLORS[splat.color] || '--berry');
        ctx.strokeStyle = '#25312d';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(11, (splat.size || 32) * 0.42), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });
    ctx.fillStyle = cssVar('--yellow');
    ctx.strokeStyle = '#25312d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 43, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    for (let turn = 0; turn < 6; turn += 1) {
      const angle = turn * Math.PI / 3;
      ctx.fillStyle = '#25312d';
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * 21, Math.sin(angle) * 21, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw() {
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
    const scale = Math.min(width / 900, height / 460);
    const offsetX = (width - 900 * scale) / 2;
    const offsetY = (height - 460 * scale) / 2;
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    if (bonusMode) drawSixfold();
    else if (missionIndex === 0) drawCreate();
    else if (missionIndex === 1) drawMirror();
    else drawDetective();
  }

  function pointerToCanvas(event) {
    const rect = el.canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / 900, rect.height / 460);
    const offsetX = (rect.width - 900 * scale) / 2;
    const offsetY = (rect.height - 460 * scale) / 2;
    return {
      x: (event.clientX - rect.left - offsetX) / scale,
      y: (event.clientY - rect.top - offsetY) / scale,
    };
  }

  function renderNav() {
    el.nav.innerHTML = '';
    MISSIONS.forEach((mission, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `mission-btn${index === missionIndex ? ' current' : ''}${completed.has(index) ? ' done' : ''}`;
      button.textContent = String(index + 1).padStart(2, '0');
      button.disabled = index > unlocked;
      button.title = button.disabled ? t('lockedMission') : t('missionLabel', index + 1, t(mission.title));
      button.setAttribute('aria-label', button.title);
      button.addEventListener('click', () => goToMission(index));
      el.nav.appendChild(button);
    });
  }

  function render() {
    const mission = MISSIONS[missionIndex];
    el.chapterNumber.textContent = String(missionIndex + 1).padStart(2, '0');
    el.missionKicker.textContent = t(mission.kicker);
    el.missionTitle.textContent = t(mission.title);
    el.missionText.textContent = t(mission.text);
    el.status.textContent = statusText();
    el.burst.textContent = resultKey ? t(resultKey) : '';
    el.createPanel.hidden = bonusMode || missionIndex !== 0;
    el.mirrorPanel.hidden = bonusMode || missionIndex !== 1;
    el.detectivePanel.hidden = bonusMode || missionIndex !== 2;
    el.foldLabel.textContent = t(folded ? 'nextMission' : 'fold');
    el.fold.disabled = missionIndex !== 0;
    el.splash.disabled = folded;
    el.palette.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('selected', button.dataset.color === selectedColor);
      button.setAttribute('aria-pressed', String(button.dataset.color === selectedColor));
    });
    el.tools.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('selected', button.dataset.tool === selectedTool);
      button.setAttribute('aria-pressed', String(button.dataset.tool === selectedTool));
    });
    if (missionIndex === 0) {
      el.progressLabel.textContent = t('progressInk');
      el.progressValue.textContent = `${Math.min(3, splats.length)}/3`;
    } else if (missionIndex === 1) {
      el.progressLabel.textContent = t('progressSpots');
      el.progressValue.textContent = `${Math.min(3, mirrorIndex)}/3`;
      el.mirrorRound.textContent = t('mirrorRound', Math.min(3, mirrorIndex + 1));
    } else {
      el.progressLabel.textContent = t('progressCase');
      el.progressValue.textContent = bonusMode ? '×6' : t(detectiveSolved ? 'caseClosed' : 'caseOpen');
    }
    const mirrorSteps = mirrorIndex < MIRROR_ROUNDS.length ? MIRROR_ROUNDS[mirrorIndex].correct + 1 : 0;
    el.canvas.setAttribute('aria-label', missionIndex === 1 ? t('mirrorCanvas', mirrorSteps) : t('canvasLabel'));
    el.canvas.setAttribute('role', missionIndex === 0 && !bonusMode ? 'button' : 'img');
    el.canvas.tabIndex = missionIndex === 0 && !bonusMode ? 0 : -1;
    el.nav.setAttribute('aria-label', t('navLabel'));
    el.palette.setAttribute('aria-label', t('colorLabel'));
    el.tools.setAttribute('aria-label', t('toolsLabel'));
    el.mirrorChoices.setAttribute('aria-label', t('choicesLabel'));
    el.suspects.setAttribute('aria-label', t('suspectsLabel'));
    el.theme.setAttribute('aria-label', t('themeLabel'));
    el.palette.querySelector('[data-color="berry"]').setAttribute('aria-label', t('berry'));
    el.palette.querySelector('[data-color="ocean"]').setAttribute('aria-label', t('ocean'));
    el.palette.querySelector('[data-color="lime"]').setAttribute('aria-label', t('lime'));
    el.mirrorA11y.textContent = t('mirrorA11y', mirrorSteps);
    el.mirrorChoices.querySelectorAll('button').forEach((button, index) => {
      button.setAttribute('aria-label', t('candidate', ['A', 'B', 'C'][index], index + 1));
    });
    el.suspects.querySelectorAll('button').forEach((button, index) => {
      button.setAttribute('aria-label', t('suspect', index + 1, t(index === 1 ? 'asymmetricDetail' : 'symmetricDetail')));
    });
    sound.updateButton();
    renderNav();
    draw();
  }

  el.palette.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-color]');
    if (!button || folded) return;
    selectedColor = button.dataset.color;
    sound.play('tap');
    render();
  });
  el.tools.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-tool]');
    if (!button || folded) return;
    selectedTool = button.dataset.tool;
    sound.play('tap');
    render();
  });
  el.splash.addEventListener('click', addPresetSplat);
  el.fold.addEventListener('click', foldPaper);
  el.mirrorChoices.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-choice]');
    if (button) chooseMirror(Number(button.dataset.choice));
  });
  el.suspects.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-suspect]');
    if (button) chooseSuspect(Number(button.dataset.suspect));
  });
  el.canvas.addEventListener('pointerdown', (event) => {
    const point = pointerToCanvas(event);
    if (missionIndex === 0 && !folded) {
      el.canvas.setPointerCapture(event.pointerId);
      addSplat(point.x, point.y);
    } else if (missionIndex === 1 && mirrorIndex < MIRROR_ROUNDS.length) {
      const round = MIRROR_ROUNDS[mirrorIndex];
      if (point.x <= 450 || Math.abs(point.y - round.y) > 36) {
        setStatus('mirrorWrong');
        sound.play('wrong');
        window.cool?.track('miss-mirror-point', { round: mirrorIndex + 1, reason: point.x <= 450 ? 'side' : 'height' });
        render();
        return;
      }
      const distance = point.x - 450;
      const nearest = OPTION_DISTANCES
        .map((option, index) => ({ index, delta: Math.abs(option - distance) }))
        .sort((a, b) => a.delta - b.delta)[0];
      chooseMirror(nearest.index);
    }
  });
  el.canvas.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && missionIndex === 0 && !folded) {
      event.preventDefault();
      addPresetSplat();
    }
  });
  el.hint.addEventListener('click', showHint);
  el.restart.addEventListener('click', () => {
    resetMission(bonusMode ? 0 : missionIndex);
    window.cool?.track('restart-inkblot-mission', { mission: missionIndex + 1 });
  });
  el.sixfold.addEventListener('click', () => {
    clearTimeout(transitionTimer);
    transitionTimer = 0;
    setModalOpen(false);
    bonusMode = true;
    setStatus('sixfoldStatus');
    resultKey = 'sixfoldBurst';
    sound.play('fold');
    window.cool?.track('open-sixfold-inkblot');
    render();
  });
  el.playAgain.addEventListener('click', () => {
    completed = new Set();
    unlocked = 0;
    persist();
    resetMission(0);
    el.splash.focus();
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

  setStatus('createReady');
  resetHintTimer();
})();
