(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '因数水晶洞 · KidsLab',
      back: '返回平台',
      title: '因数水晶洞',
      chamber: '洞厅',
      depth: '地下 120 米',
      compositeLegend: '可敲开的合数',
      primeLegend: '质数原石',
      pouch: '原石袋',
      selectedCrystal: '当前水晶',
      chooseHammer: '选择因数锤',
      tuningFork: '3 号音叉',
      findMultiples: '点亮所有 3 的倍数',
      forkLabel: '敲响 3 号音叉',
      checkWall: '检查共振矿墙',
      notes: '探险记录',
      reset: '重探本厅',
      hint: '问问引路蝙蝠',
      next: '深入下一层',
      finish: '领取宇宙配方',
      playAgain: '重新勘探',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      theme: '切换主题',
      progressLabel: '洞厅进度',
      canvasLabel: '显示水晶因数分解过程的地下洞穴',
      emptyHistory: '第一锤还没有落下……',
      splitRecord: (from, a, b) => `${from} 裂成 ${a} × ${b}`,
      primeRecord: (values) => `收集质数原石：${values.join('、')}`,
      selectedStatus: (value) => `${value} 是合数。哪一把因数锤能把它整齐敲开？`,
      invalidSplit: (value, a, b) => `${a} × ${b} 不等于 ${value}，水晶只是晃了晃。换一把锤！`,
      validSplit: (value, a, b) => `咔嚓！${value} 沿着因数裂缝分成了 ${a} 和 ${b}。`,
      factorSolved: (value, recipe) => `${value} 已全部变成质数原石：${recipe}。`,
      uniqueDiscovery: '两条矿脉都敲到底了。质数原石会组成每个数独一无二的宇宙配方！',
      selectWall: '敲响 3 号音叉，再点亮矿墙上所有 3 的倍数。',
      forkStatus: '嗡——凡是能写成 3 × 某个正整数的水晶，都会与 3 号音叉共振。',
      wallWrong: '还有水晶发错了光，或有 3 的倍数没亮。错误选择已标红，可以原地调整。',
      wallSolved: '整面矿墙共振成功！12、15、18、21、24、27、30 都是 3 的倍数。',
      wallRecord: (values) => `3 的倍数：${values.join('、')}`,
      hints: [
        '找两个都大于 1、相乘正好等于 12 的数。质数 2 和 3 已经不能再敲。',
        '18 可以先裂成 3 × 6，也可以先裂成 2 × 9；只要继续敲到底，原石袋会一样。',
        '从 3 × 4、3 × 5、3 × 6 一路数到 3 × 10，就能找到墙上所有共振水晶。',
      ],
      missions: [
        {
          kicker: '第一矿层 · 紫晶裂谷',
          title: '把 12 敲成质数原石',
          prompt: '选择真正相乘等于水晶数字的因数锤。',
          start: '12 能被哪两个大于 1 的整数整齐敲开？',
        },
        {
          kicker: '第二矿层 · 双路晶脉',
          title: '追踪 18 的秘密配方',
          prompt: '从不同裂缝出发，最后都会抵达同一袋质数。',
          start: '18 有不止一条裂缝。选一条，继续敲到全是质数。',
        },
        {
          kicker: '第三矿层 · 共振长廊',
          title: '让 3 的倍数一起发光',
          prompt: '同一个数的倍数，会回应它的音叉。',
          start: '敲响 3 号音叉，再点亮矿墙上所有 3 的倍数。',
        },
      ],
      certificateKicker: '因数水晶洞勘探完成',
      certificateTitle: '宇宙配方证书',
      certificateText: '无论从哪条裂缝开始，同一个数最后都会留下同一袋质数原石，只是排列顺序可能不同。',
    },
    en: {
      doc: 'Factor Crystal Cave · KidsLab',
      back: 'Back to platform',
      title: 'Factor Crystal Cave',
      chamber: 'CHAMBER',
      depth: '120 m underground',
      compositeLegend: 'Composite: can crack',
      primeLegend: 'Prime stone',
      pouch: 'Stone pouch',
      selectedCrystal: 'CURRENT CRYSTAL',
      chooseHammer: 'Choose a factor hammer',
      tuningFork: 'NO. 3 TUNING FORK',
      findMultiples: 'Light every multiple of 3',
      forkLabel: 'Strike the No. 3 tuning fork',
      checkWall: 'Check the resonance wall',
      notes: 'Expedition notes',
      reset: 'Restart chamber',
      hint: 'Ask the guide bat',
      next: 'Descend deeper',
      finish: 'Claim cosmic recipe',
      playAgain: 'Explore again',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      theme: 'Switch theme',
      progressLabel: 'Cave chamber progress',
      canvasLabel: 'An underground cave showing a crystal factorization',
      emptyHistory: 'Your first hammer strike is waiting…',
      splitRecord: (from, a, b) => `${from} cracked into ${a} × ${b}`,
      primeRecord: (values) => `Prime stones collected: ${values.join(', ')}`,
      selectedStatus: (value) => `${value} is composite. Which factor hammer cracks it evenly?`,
      invalidSplit: (value, a, b) => `${a} × ${b} is not ${value}. The crystal only wobbled—try another hammer!`,
      validSplit: (value, a, b) => `Crack! ${value} split along its factor seam into ${a} and ${b}.`,
      factorSolved: (value, recipe) => `${value} is now all prime stones: ${recipe}.`,
      uniqueDiscovery: 'Both veins are fully cracked. Prime stones form a unique cosmic recipe for each number!',
      selectWall: 'Strike the No. 3 fork, then light every multiple of 3 on the wall.',
      forkStatus: 'Hummm—every crystal that can be written as 3 × a positive whole number resonates with fork 3.',
      wallWrong: 'A wrong crystal is glowing, or a multiple of 3 is still dark. Red choices can be fixed right here.',
      wallSolved: 'Full-wall resonance! 12, 15, 18, 21, 24, 27, and 30 are all multiples of 3.',
      wallRecord: (values) => `Multiples of 3: ${values.join(', ')}`,
      hints: [
        'Find two numbers greater than 1 whose product is exactly 12. Prime numbers 2 and 3 cannot crack again.',
        '18 can begin as 3 × 6 or 2 × 9. Keep cracking and the final pouch will be the same.',
        'Count 3 × 4, 3 × 5, 3 × 6, all the way to 3 × 10 to find every resonating crystal.',
      ],
      missions: [
        {
          kicker: 'LAYER ONE · AMETHYST RIFT',
          title: 'Crack 12 into prime stones',
          prompt: 'Choose a factor hammer whose numbers truly multiply to the crystal.',
          start: 'Which two whole numbers greater than 1 crack 12 evenly?',
        },
        {
          kicker: 'LAYER TWO · THE TWIN VEINS',
          title: 'Trace the secret recipe of 18',
          prompt: 'Different first cracks still lead to the same pouch of primes.',
          start: '18 has more than one seam. Pick one and keep cracking until every piece is prime.',
        },
        {
          kicker: 'LAYER THREE · RESONANCE HALL',
          title: 'Make every multiple of 3 glow',
          prompt: 'Multiples of the same number answer its tuning fork.',
          start: 'Strike fork 3, then light every multiple of 3 on the wall.',
        },
      ],
      certificateKicker: 'FACTOR CRYSTAL CAVE EXPEDITION COMPLETE',
      certificateTitle: 'Cosmic Recipe Certificate',
      certificateText: 'Whichever seam you start with, a number leaves the same pouch of prime stones. Only their order may change.',
    },
  };

  const TARGETS = [12, 18];
  const WALL_NUMBERS = [10, 12, 14, 15, 18, 21, 22, 24, 27, 30];
  const FACTOR_CHOICES = {
    4: [[2, 2], [2, 3], [1, 4], [3, 4]],
    6: [[2, 3], [3, 3], [2, 4], [1, 6]],
    9: [[3, 3], [2, 4], [2, 5], [1, 9]],
    12: [[3, 4], [2, 6], [2, 5], [4, 4]],
    18: [[3, 6], [2, 9], [3, 5], [4, 5]],
  };
  const STORAGE_KEY = 'kidslab.crystal-cave';
  const SOUND_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const isPrime = (value) => {
    if (!Number.isInteger(value) || value < 2) return false;
    for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
      if (value % divisor === 0) return false;
    }
    return true;
  };

  const elements = {
    course: $('#course'),
    chamberNumber: $('#chamberNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionPrompt: $('#missionPrompt'),
    progressDots: $('#progressDots'),
    status: $('#status'),
    canvas: $('#caveCanvas'),
    canvasShell: $('#canvasShell'),
    canvasLegend: $('#canvasLegend'),
    primePouch: $('#primePouch'),
    factorTools: $('#factorTools'),
    selectedValue: $('#selectedValue'),
    factorOptions: $('#factorOptions'),
    resonanceTools: $('#resonanceTools'),
    forkBtn: $('#forkBtn'),
    numberWall: $('#numberWall'),
    checkWallBtn: $('#checkWallBtn'),
    historyList: $('#historyList'),
    resetBtn: $('#resetBtn'),
    hintBtn: $('#hintBtn'),
    nextBtn: $('#nextBtn'),
    soundBtn: $('#soundBtn'),
    themeBtn: $('#themeBtn'),
    langBtn: $('#langBtn'),
    certificate: $('#certificate'),
    playAgainBtn: $('#playAgainBtn'),
  };

  let t = (key) => key;
  let lang = 'zh';
  let muted = false;
  let audioContext = null;
  let animationFrame = 0;
  let burstAt = 0;
  let wrongWall = [];
  let state = loadState();

  function freshState() {
    return {
      chamber: 0,
      factors: TARGETS.map((target) => ({ leaves: [target], history: [], solved: false })),
      resonance: [],
      resonanceSolved: false,
      completed: false,
    };
  }

  function loadState() {
    const fallback = freshState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || !Number.isInteger(saved.chamber) || saved.chamber < 0 || saved.chamber > 2) return fallback;
      const factors = TARGETS.map((target, index) => {
        const entry = saved.factors?.[index];
        const leaves = Array.isArray(entry?.leaves)
          ? entry.leaves.filter((value) => Number.isInteger(value) && value > 1 && value <= target)
          : [];
        const product = leaves.reduce((total, value) => total * value, 1);
        if (!leaves.length || product !== target) return fallback.factors[index];
        return {
          leaves,
          history: Array.isArray(entry.history)
            ? entry.history.filter((item) =>
                item && Number.isInteger(item.from) && Array.isArray(item.pair) &&
                item.pair.length === 2 && item.pair.every(Number.isInteger)).slice(0, 8)
            : [],
          solved: leaves.every(isPrime),
        };
      });
      return {
        chamber: saved.chamber,
        factors,
        resonance: Array.isArray(saved.resonance)
          ? [...new Set(saved.resonance.filter((value) => WALL_NUMBERS.includes(value)))]
          : [],
        resonanceSolved: Boolean(saved.resonanceSolved),
        completed: Boolean(saved.completed),
      };
    } catch {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable without blocking the expedition.
    }
  }

  function currentFactor() {
    return state.chamber < 2 ? state.factors[state.chamber] : null;
  }

  function selectedCompositeIndex() {
    return currentFactor()?.leaves.findIndex((value) => !isPrime(value)) ?? -1;
  }

  function selectedComposite() {
    const index = selectedCompositeIndex();
    return index >= 0 ? currentFactor().leaves[index] : null;
  }

  function splitCrystal(pair) {
    const factor = currentFactor();
    const index = selectedCompositeIndex();
    if (!factor || index < 0 || factor.solved) return;
    ensureAudio();
    const value = factor.leaves[index];
    const [a, b] = pair;
    if (a <= 1 || b <= 1 || a * b !== value) {
      elements.status.textContent = t('invalidSplit', value, a, b);
      burstAt = -performance.now();
      playSound('error');
      window.cool?.track?.('strike_wrong_factor', { chamber: state.chamber + 1, crystal: value });
      draw();
      return;
    }

    factor.leaves.splice(index, 1, a, b);
    factor.history.push({ from: value, pair: [a, b] });
    factor.solved = factor.leaves.every(isPrime);
    burstAt = performance.now();
    playSound(factor.solved ? 'success' : 'crack');
    window.cool?.track?.('split_composite_crystal', {
      chamber: state.chamber + 1,
      crystal: value,
      factors: `${a}x${b}`,
    });

    if (factor.solved) {
      const recipe = [...factor.leaves].sort((left, right) => left - right).join(' × ');
      elements.status.textContent = state.chamber === 1
        ? t('uniqueDiscovery')
        : t('factorSolved', TARGETS[state.chamber], recipe);
      window.cool?.stage?.(`chamber${state.chamber + 1}`);
    } else {
      elements.status.textContent = t('validSplit', value, a, b);
    }
    saveState();
    render(false);
  }

  function toggleWallNumber(value) {
    if (state.resonanceSolved) return;
    ensureAudio();
    const index = state.resonance.indexOf(value);
    if (index >= 0) state.resonance.splice(index, 1);
    else state.resonance.push(value);
    wrongWall = wrongWall.filter((number) => number !== value);
    playSound('select');
    saveState();
    render(false);
  }

  function ringFork() {
    ensureAudio();
    elements.forkBtn.classList.remove('is-ringing');
    void elements.forkBtn.offsetWidth;
    elements.forkBtn.classList.add('is-ringing');
    elements.status.textContent = t('forkStatus');
    playSound('fork');
    window.cool?.track?.('ring_multiple_fork', { fork: 3 });
  }

  function checkWall() {
    if (state.resonanceSolved) return;
    ensureAudio();
    const expected = WALL_NUMBERS.filter((value) => value % 3 === 0);
    wrongWall = WALL_NUMBERS.filter((value) =>
      state.resonance.includes(value) !== expected.includes(value));
    if (wrongWall.length) {
      elements.status.textContent = t('wallWrong');
      playSound('error');
      render(false);
      return;
    }
    state.resonanceSolved = true;
    elements.status.textContent = t('wallSolved');
    playSound('success');
    window.cool?.stage?.('chamber3');
    window.cool?.track?.('complete_multiple_wall', { fork: 3, count: expected.length });
    saveState();
    render(false);
  }

  function resetChamber() {
    if (state.chamber < 2) {
      state.factors[state.chamber] = {
        leaves: [TARGETS[state.chamber]],
        history: [],
        solved: false,
      };
    } else {
      state.resonance = [];
      state.resonanceSolved = false;
      wrongWall = [];
    }
    burstAt = 0;
    saveState();
    render();
    playSound('reset');
  }

  function nextChamber() {
    const solved = state.chamber < 2 ? currentFactor().solved : state.resonanceSolved;
    if (!solved) return;
    if (state.chamber < 2) {
      state.chamber += 1;
      wrongWall = [];
      saveState();
      render();
      playSound('descend');
      return;
    }
    state.completed = true;
    saveState();
    window.cool?.complete?.();
    playSound('finale');
    showCertificate();
  }

  function showCertificate() {
    state.completed = true;
    elements.certificate.hidden = false;
    elements.course.inert = true;
    requestAnimationFrame(() => elements.playAgainBtn.focus());
  }

  function hideCertificate() {
    elements.certificate.hidden = true;
    elements.course.inert = false;
  }

  function playAgain() {
    hideCertificate();
    state = freshState();
    wrongWall = [];
    saveState();
    render();
  }

  function render(resetStatus = true) {
    const mission = t('missions')[state.chamber];
    const factor = currentFactor();
    const selected = selectedComposite();
    document.title = t('doc');
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    elements.chamberNumber.textContent = state.chamber + 1;
    elements.missionKicker.textContent = mission.kicker;
    elements.missionTitle.textContent = mission.title;
    elements.missionPrompt.textContent = mission.prompt;
    if (resetStatus) {
      if (state.chamber < 2 && factor.solved) {
        const recipe = [...factor.leaves].sort((a, b) => a - b).join(' × ');
        elements.status.textContent = state.chamber === 1
          ? t('uniqueDiscovery')
          : t('factorSolved', TARGETS[state.chamber], recipe);
      } else if (state.chamber === 2 && state.resonanceSolved) {
        elements.status.textContent = t('wallSolved');
      } else {
        elements.status.textContent = mission.start;
      }
    }

    elements.progressDots.setAttribute('aria-label', t('progressLabel'));
    elements.progressDots.innerHTML = [0, 1, 2].map((index) => {
      const done = index < state.chamber || state.completed;
      const current = index === state.chamber && !state.completed;
      return `<span class="${done ? 'is-done' : current ? 'is-current' : ''}"><b>${done ? '✓' : index + 1}</b></span>`;
    }).join('');

    elements.factorTools.hidden = state.chamber === 2;
    elements.resonanceTools.hidden = state.chamber !== 2;
    elements.canvasLegend.hidden = state.chamber === 2;
    if (factor) {
      elements.selectedValue.textContent = selected ?? TARGETS[state.chamber];
      elements.factorOptions.innerHTML = selected
        ? (FACTOR_CHOICES[selected] || []).map(([a, b], index) =>
            `<button class="factor-choice" type="button" data-factor="${index}" data-a="${a}" data-b="${b}">${a} × ${b}</button>`).join('')
        : '';
      const primes = factor.leaves.filter(isPrime);
      elements.primePouch.innerHTML = primes.length
        ? primes.map((value) => `<span><b>${value}</b></span>`).join('')
        : '<span><b>?</b></span>';
      elements.historyList.innerHTML = factor.history.length
        ? [
            ...factor.history.map(({ from, pair }) => `<li>${t('splitRecord', from, pair[0], pair[1])}</li>`),
            ...(factor.solved ? [`<li>${t('primeRecord', [...factor.leaves].sort((a, b) => a - b))}</li>`] : []),
          ].join('')
        : `<li class="empty">${t('emptyHistory')}</li>`;
    } else {
      elements.primePouch.innerHTML = '<span><b>2</b></span><span><b>3</b></span><span><b>5</b></span><span><b>7</b></span>';
      elements.numberWall.innerHTML = WALL_NUMBERS.map((value) =>
        `<button class="number-stone ${wrongWall.includes(value) ? 'is-wrong' : ''}" type="button" data-number="${value}" aria-pressed="${state.resonance.includes(value)}">${value}</button>`).join('');
      elements.historyList.innerHTML = state.resonanceSolved
        ? `<li>${t('wallRecord', WALL_NUMBERS.filter((value) => value % 3 === 0))}</li>`
        : `<li class="empty">${t('selectWall')}</li>`;
    }

    const solved = state.chamber < 2 ? factor.solved : state.resonanceSolved;
    elements.nextBtn.hidden = !solved;
    elements.nextBtn.querySelector('[data-t]').textContent = state.chamber === 2 ? t('finish') : t('next');
    elements.canvas.setAttribute('aria-label', t('canvasLabel'));
    elements.forkBtn.setAttribute('aria-label', t('forkLabel'));
    elements.soundBtn.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
    elements.soundBtn.setAttribute('aria-pressed', String(muted));
    elements.soundBtn.textContent = muted ? '🔇' : '🔊';
    elements.themeBtn.setAttribute('aria-label', t('theme'));
    elements.themeBtn.textContent = document.documentElement.dataset.theme === 'light' ? '🌙' : '☀️';
    elements.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    draw();
  }

  function ensureAudio() {
    if (muted) return null;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      return audioContext;
    } catch {
      return null;
    }
  }

  function tone(frequency, start, duration, type = 'sine', volume = 0.04) {
    const context = ensureAudio();
    if (!context || muted) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + start);
    gain.gain.setValueAtTime(0.0001, context.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(context.currentTime + start);
    oscillator.stop(context.currentTime + start + duration + 0.02);
  }

  function playSound(kind) {
    if (muted) return;
    const sounds = {
      crack: [[220, 0, 0.08, 'square'], [410, 0.07, 0.15, 'triangle']],
      select: [[420, 0, 0.09, 'sine']],
      error: [[145, 0, 0.2, 'sawtooth'], [105, 0.12, 0.25, 'sawtooth']],
      success: [[523, 0, 0.12, 'sine'], [659, 0.12, 0.13, 'sine'], [880, 0.25, 0.23, 'sine']],
      fork: [[196, 0, 0.65, 'sine'], [392, 0.03, 0.48, 'sine']],
      descend: [[440, 0, 0.1, 'triangle'], [330, 0.1, 0.13, 'triangle']],
      reset: [[360, 0, 0.11, 'triangle']],
      finale: [[523, 0, 0.14, 'triangle'], [659, 0.13, 0.14, 'triangle'], [784, 0.26, 0.16, 'triangle'], [1047, 0.4, 0.36, 'sine']],
    };
    (sounds[kind] || []).forEach(([frequency, start, duration, type]) =>
      tone(frequency, start, duration, type));
  }

  function toggleSound() {
    muted = !muted;
    try {
      localStorage.setItem(SOUND_KEY, muted ? '1' : '0');
    } catch {
      // Preference persistence is optional.
    }
    if (muted && audioContext) audioContext.suspend().catch(() => {});
    else {
      ensureAudio();
      playSound('select');
    }
    render(false);
  }

  function resizeCanvas() {
    const rect = elements.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (elements.canvas.width !== width || elements.canvas.height !== height) {
      elements.canvas.width = width;
      elements.canvas.height = height;
    }
    draw();
  }

  function crystalPath(context, x, y, radius, seed = 0) {
    const points = 8;
    context.beginPath();
    for (let index = 0; index < points; index += 1) {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / points;
      const wobble = radius * (0.8 + ((index + seed) % 3) * 0.09);
      const px = x + Math.cos(angle) * wobble;
      const py = y + Math.sin(angle) * wobble;
      if (index === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
    context.closePath();
  }

  function drawCrystal(context, x, y, radius, value, prime, selected, alpha = 1) {
    context.save();
    context.globalAlpha = alpha;
    const glow = prime ? cssVar('--cyan') : cssVar('--violet');
    context.shadowColor = glow;
    context.shadowBlur = selected ? 30 : 18;
    const gradient = context.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
    gradient.addColorStop(0, '#f0ffff');
    gradient.addColorStop(0.3, prime ? '#77eff2' : '#b99af5');
    gradient.addColorStop(1, prime ? '#168ba4' : '#573097');
    crystalPath(context, x, y, radius, value);
    context.fillStyle = gradient;
    context.fill();
    context.lineWidth = selected ? 4 : 2;
    context.strokeStyle = selected ? '#ffcf5a' : '#ddffff';
    context.stroke();
    context.shadowBlur = 0;
    context.beginPath();
    context.moveTo(x, y - radius * 0.72);
    context.lineTo(x - radius * 0.24, y + radius * 0.55);
    context.lineTo(x + radius * 0.58, y + radius * 0.2);
    context.strokeStyle = '#ffffff88';
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = '#102033';
    context.font = `900 ${Math.max(16, radius * 0.78)}px ${cssVar('--display')}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(String(value), x, y + 1);
    if (prime) {
      context.fillStyle = '#eaffff';
      context.font = `900 ${Math.max(12, radius * 0.34)}px ${cssVar('--font')}`;
      context.fillText('PRIME', x, y + radius + 15);
    }
    context.restore();
  }

  function drawCave(context, width, height) {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, cssVar('--cave'));
    gradient.addColorStop(1, cssVar('--cave-deep'));
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#ffffff08';
    for (let index = 0; index < 45; index += 1) {
      const x = (index * 83) % width;
      const y = (index * 47) % height;
      context.beginPath();
      context.arc(x, y, 1 + index % 3, 0, Math.PI * 2);
      context.fill();
    }

    const ground = height * 0.83;
    context.beginPath();
    context.moveTo(0, ground);
    for (let x = 0; x <= width; x += 32) {
      context.lineTo(x, ground + Math.sin(x * 0.05) * 8);
    }
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.closePath();
    context.fillStyle = '#07101a';
    context.fill();
  }

  function drawFactorScene(context, width, height) {
    const factor = currentFactor();
    const root = TARGETS[state.chamber];
    const topY = Math.max(70, height * 0.22);
    const leafY = Math.min(height - 78, height * 0.64);
    const rootRadius = Math.min(54, Math.max(38, width * 0.072));
    drawCrystal(context, width / 2, topY, rootRadius, root, false, factor.history.length === 0);

    const count = factor.leaves.length;
    factor.leaves.forEach((value, index) => {
      const x = width * ((index + 1) / (count + 1));
      const radius = Math.min(42, Math.max(30, width / (count + 3) * 0.34));
      context.beginPath();
      context.moveTo(width / 2, topY + rootRadius * 0.7);
      context.bezierCurveTo(width / 2, topY + 90, x, leafY - 95, x, leafY - radius);
      context.strokeStyle = isPrime(value) ? '#48d9e688' : '#8d5de788';
      context.lineWidth = 3;
      context.stroke();
      drawCrystal(context, x, leafY, radius, value, isPrime(value), !isPrime(value));
    });

    if (factor.history.length === 0) {
      context.fillStyle = '#dceef3';
      context.font = `800 ${Math.max(16, Math.min(20, width / 34))}px ${cssVar('--font')}`;
      context.textAlign = 'center';
      context.fillText(lang === 'zh' ? '选择右侧因数锤，沿真正的因数裂缝敲开它' : 'Choose a factor hammer and crack along a true factor seam', width / 2, height - 26);
    }
  }

  function drawResonanceScene(context, width, height) {
    const columns = 5;
    const rows = 2;
    const padX = width * 0.11;
    const padY = height * 0.2;
    const cellW = (width - padX * 2) / columns;
    const cellH = (height - padY * 1.45) / rows;
    WALL_NUMBERS.forEach((value, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = padX + cellW * (col + 0.5);
      const y = padY + cellH * (row + 0.45);
      const active = state.resonance.includes(value);
      drawCrystal(context, x, y, Math.min(35, cellW * 0.26), value, active, false, active ? 1 : 0.48);
      if (active) {
        context.strokeStyle = '#48d9e655';
        context.lineWidth = 2;
        for (let ring = 1; ring <= 2; ring += 1) {
          context.beginPath();
          context.arc(x, y, 42 + ring * 9, 0, Math.PI * 2);
          context.stroke();
        }
      }
    });
    context.fillStyle = '#dceef3';
    context.font = `800 ${Math.max(16, Math.min(20, width / 34))}px ${cssVar('--font')}`;
    context.textAlign = 'center';
    context.fillText(lang === 'zh' ? '矿墙会跟着你的选择共振' : 'The mineral wall resonates with your choices', width / 2, height - 24);
  }

  function drawBurst(context, width, height) {
    if (!burstAt) return false;
    const start = Math.abs(burstAt);
    const elapsed = performance.now() - start;
    if (elapsed > 650) {
      burstAt = 0;
      return false;
    }
    const progress = elapsed / 650;
    const centerX = width / 2;
    const centerY = height * 0.38;
    for (let index = 0; index < 22; index += 1) {
      const angle = (Math.PI * 2 * index) / 22;
      const distance = progress * (45 + (index % 5) * 14);
      const size = 3 + index % 4;
      context.fillStyle = burstAt > 0
        ? index % 2 ? cssVar('--cyan') : cssVar('--violet')
        : cssVar('--danger');
      context.fillRect(
        centerX + Math.cos(angle) * distance - size / 2,
        centerY + Math.sin(angle) * distance - size / 2,
        size,
        size,
      );
    }
    return true;
  }

  function draw() {
    cancelAnimationFrame(animationFrame);
    const context = elements.canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = elements.canvas.width / dpr;
    const height = elements.canvas.height / dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    drawCave(context, width, height);
    if (state.chamber < 2) drawFactorScene(context, width, height);
    else drawResonanceScene(context, width, height);
    if (drawBurst(context, width, height)) animationFrame = requestAnimationFrame(draw);
  }

  elements.factorOptions.addEventListener('click', (event) => {
    const button = event.target.closest('[data-factor]');
    if (!button) return;
    splitCrystal([Number(button.dataset.a), Number(button.dataset.b)]);
  });
  elements.numberWall.addEventListener('click', (event) => {
    const button = event.target.closest('[data-number]');
    if (!button) return;
    toggleWallNumber(Number(button.dataset.number));
  });
  elements.forkBtn.addEventListener('click', ringFork);
  elements.checkWallBtn.addEventListener('click', checkWall);
  elements.resetBtn.addEventListener('click', resetChamber);
  elements.hintBtn.addEventListener('click', () => {
    elements.status.textContent = t('hints')[state.chamber];
    playSound('select');
  });
  elements.nextBtn.addEventListener('click', nextChamber);
  elements.playAgainBtn.addEventListener('click', playAgain);
  elements.soundBtn.addEventListener('click', toggleSound);
  elements.langBtn.addEventListener('click', () => window.cool.preferences.toggleLang());
  elements.themeBtn.addEventListener('click', () => window.cool.preferences.toggleTheme());
  addEventListener('resize', resizeCanvas);
  addEventListener('themechange', resizeCanvas);

  try {
    muted = localStorage.getItem(SOUND_KEY) === '1';
  } catch {
    muted = false;
  }

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang: nextLang }) {
      t = translate;
      lang = nextLang;
      render();
      resizeCanvas();
      if (state.completed) showCertificate();
    },
  });
})();
