(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '外星农场 · KidsLab',
      back: '返回平台',
      title: '外星农场',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      missionsLabel: '农场任务',
      missionLabel: (n, title) => `第 ${n} 夜：${title}`,
      lockedMission: '先完成上一夜',
      creatureScene: '农场生物剪影',
      nightVision: '夜视',
      creatures: '总只数',
      eyes: '眼睛',
      legs: '腿',
      triBeast: '三脚兽',
      quadBeast: '四脚兽',
      mixLabel: '向右换成四脚兽',
      scanManifest: '核对清单',
      assumptionLabel: '假设法放大镜',
      assumeAllTri: '先假设全是三脚兽',
      exchangeSix: '一次换 6 只',
      scanSensors: '核对双传感器',
      decreaseTri: '减少三脚兽',
      increaseTri: '增加三脚兽',
      decreaseQuad: '减少四脚兽',
      increaseQuad: '增加四脚兽',
      hint: '轻提示',
      next: '进入下一夜',
      finalKicker: '三份清单全部破译',
      finalTitle: '天亮了，农场全貌出现！',
      finalText: '你用试调看见变化规律，用假设法一步算出答案，还让眼睛和腿两台传感器同时归零。',
      playAgain: '再值一次夜班',
      act1Kicker: '夜班一 · 试调围栏',
      act1Title: '保持 12 只，调到 43 条腿',
      act1Text: '拖动分群拨杆，让三脚兽与四脚兽此消彼长。',
      act1Console: '调节两种生物的数量',
      act1Lesson: '总只数不变时，一只三脚兽换成四脚兽，总腿数刚好多 1。',
      act1Ready: '夜视仪已开启。先拖动拨杆，观察每换一只会怎样。',
      act1Adjusted: (tri, quad, legs) => `现在是 ${tri} 只三脚兽、${quad} 只四脚兽，共 ${legs} 条腿。`,
      act1Wrong: (legs, direction) => `传感器读到 ${legs} 条腿，还差一点。把拨杆向${direction}调再试。`,
      act1Done: '清单吻合！5 只三脚兽 + 7 只四脚兽 = 12 只、43 条腿。',
      act1Hint: '目标是 43 条腿。每向右换一只，腿数增加 1。',
      act2Kicker: '夜班二 · 假设扫描',
      act2Title: '不用挨个试，一步找出 48 条腿',
      act2Text: '先把 14 只都当成三脚兽，再看腿数差了多少。',
      act2Console: '启动假设法放大镜',
      act2Lesson: '全按三脚兽算，再用“每替换一只多 1 条腿”把差补齐。',
      act2Ready: '这次有 14 只、48 条腿。先按下放大镜的假设按钮。',
      act2Assumed: '全是三脚兽只有 42 条腿，比清单少 6 条；每替换一只会多 1 条腿。',
      act2Done: '一次换 6 只，正好 48 条腿！系统惊呼：你没用试的？！',
      act2Hint: '先算 14 × 3，再比较它和 48 相差多少。',
      act3Kicker: '夜班三 · 双传感器',
      act3Title: '只看 20 只眼、48 条腿',
      act3Text: '总只数被云挡住了，分别调整两种生物，让两台传感器同时对准。',
      act3Console: '反推隐藏的生物数量',
      act3Lesson: '三脚兽贡献 1 眼 3 腿，四脚兽贡献 2 眼 4 腿；两条线索必须同时满足。',
      act3Ready: '云层遮住了总只数。用加减按钮同时对准 20 只眼和 48 条腿。',
      act3Progress: (tri, quad, eyes, legs) => `${tri} 只三脚兽 + ${quad} 只四脚兽：${eyes} 只眼、${legs} 条腿。`,
      act3Wrong: (eyes, legs) => `还没同时吻合：现在是 ${eyes} 只眼、${legs} 条腿。错误不会换题，继续调整。`,
      act3Done: '双传感器同时归零！8 只三脚兽和 6 只四脚兽藏在夜色里。',
      act3Hint: '四脚兽比三脚兽多 1 只眼、1 条腿。先盯住眼睛，再用腿数修正。',
      restored: '已恢复上次夜班进度。',
    },
    en: {
      doc: 'Alien Farm · KidsLab',
      back: 'Back to platform',
      title: 'Alien Farm',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      missionsLabel: 'Farm missions',
      missionLabel: (n, title) => `Night ${n}: ${title}`,
      lockedMission: 'Finish the previous night first',
      creatureScene: 'Alien silhouettes in the farm',
      nightVision: 'Night',
      creatures: 'Creatures',
      eyes: 'Eyes',
      legs: 'Legs',
      triBeast: 'Tripods',
      quadBeast: 'Quadpods',
      mixLabel: 'Slide right to swap in quadpods',
      scanManifest: 'Check manifest',
      assumptionLabel: 'Assumption scope',
      assumeAllTri: 'Assume every creature is a tripod',
      exchangeSix: 'Swap 6 at once',
      scanSensors: 'Check both sensors',
      decreaseTri: 'Remove one tripod',
      increaseTri: 'Add one tripod',
      decreaseQuad: 'Remove one quadpod',
      increaseQuad: 'Add one quadpod',
      hint: 'Small hint',
      next: 'Enter next night',
      finalKicker: 'ALL THREE MANIFESTS DECODED',
      finalTitle: 'Sunrise Reveals the Whole Farm!',
      finalText: 'You spotted a pattern by adjusting, solved a count in one step by assumption, and matched both eye and leg sensors.',
      playAgain: 'Take another night shift',
      act1Kicker: 'NIGHT ONE · ADJUST',
      act1Title: 'Keep 12 Creatures and Reach 43 Legs',
      act1Text: 'Move the herd slider so tripods and quadpods trade places.',
      act1Console: 'Adjust the two herds',
      act1Lesson: 'With the total fixed, replacing one tripod with one quadpod adds exactly one leg.',
      act1Ready: 'Night vision is on. Move the slider and watch what one swap changes.',
      act1Adjusted: (tri, quad, legs) => `${tri} tripods + ${quad} quadpods now make ${legs} legs.`,
      act1Wrong: (legs, direction) => `The sensor sees ${legs} legs. Move the slider ${direction} and check again.`,
      act1Done: 'Manifest matched! 5 tripods + 7 quadpods = 12 creatures and 43 legs.',
      act1Hint: 'You need 43 legs. Every step right adds exactly one leg.',
      act2Kicker: 'NIGHT TWO · ASSUME',
      act2Title: 'Reach 48 Legs without Guessing',
      act2Text: 'Treat all 14 as tripods first, then measure the missing legs.',
      act2Console: 'Power up the assumption scope',
      act2Lesson: 'Count an all-tripod herd, then fill the gap: each replacement adds one leg.',
      act2Ready: 'This manifest says 14 creatures and 48 legs. Start with the assumption button.',
      act2Assumed: 'Fourteen tripods have 42 legs—6 short of the manifest. Each replacement adds one.',
      act2Done: 'Six swaps land exactly on 48! The console gasps: “You did not even guess?!”',
      act2Hint: 'Calculate 14 × 3 first, then compare the result with 48.',
      act3Kicker: 'NIGHT THREE · TWO SENSORS',
      act3Title: 'Use Only 20 Eyes and 48 Legs',
      act3Text: 'Clouds hide the total. Adjust both species until both sensors match at once.',
      act3Console: 'Recover the hidden herd',
      act3Lesson: 'A tripod contributes 1 eye and 3 legs; a quadpod contributes 2 eyes and 4 legs. Both clues must match.',
      act3Ready: 'Clouds hide the creature total. Use the buttons to match 20 eyes and 48 legs.',
      act3Progress: (tri, quad, eyes, legs) => `${tri} tripods + ${quad} quadpods make ${eyes} eyes and ${legs} legs.`,
      act3Wrong: (eyes, legs) => `Not both yet: you have ${eyes} eyes and ${legs} legs. The same puzzle stays put.`,
      act3Done: 'Both sensors hit zero difference! Eight tripods and six quadpods were hiding in the dark.',
      act3Hint: 'A quadpod has one more eye and one more leg than a tripod. Match eyes, then correct with legs.',
      restored: 'Your last night-shift progress was restored.',
    },
  };

  const MISSIONS = [
    {
      kicker: 'act1Kicker',
      title: 'act1Title',
      text: 'act1Text',
      console: 'act1Console',
      lesson: 'act1Lesson',
      hint: 'act1Hint',
      icon: '↔',
      target: { creatures: 12, eyes: null, legs: 43 },
    },
    {
      kicker: 'act2Kicker',
      title: 'act2Title',
      text: 'act2Text',
      console: 'act2Console',
      lesson: 'act2Lesson',
      hint: 'act2Hint',
      icon: '−',
      target: { creatures: 14, eyes: null, legs: 48 },
    },
    {
      kicker: 'act3Kicker',
      title: 'act3Title',
      text: 'act3Text',
      console: 'act3Console',
      lesson: 'act3Lesson',
      hint: 'act3Hint',
      icon: '◎',
      target: { creatures: null, eyes: 20, legs: 48 },
    },
  ];

  const SAVE_KEY = 'kidslab.alien-farm';
  const SOUND_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    course: $('.course'),
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    missionNav: $('#missionNav'),
    status: $('#status'),
    creatureGrid: $('#creatureGrid'),
    creatureCount: $('#creatureCount'),
    creatureTarget: $('#creatureTarget'),
    eyeCount: $('#eyeCount'),
    eyeTarget: $('#eyeTarget'),
    legCount: $('#legCount'),
    legTarget: $('#legTarget'),
    consoleKicker: $('#consoleKicker'),
    consoleTitle: $('#consoleTitle'),
    trialControls: $('#trialControls'),
    assumptionControls: $('#assumptionControls'),
    sensorControls: $('#sensorControls'),
    mixRange: $('#mixRange'),
    trialTriCount: $('#trialTriCount'),
    trialQuadCount: $('#trialQuadCount'),
    checkTrial: $('#checkTrialBtn'),
    assumptionCard: $('#assumptionCard'),
    assumptionFormula: $('#assumptionFormula'),
    assume: $('#assumeBtn'),
    exchange: $('#exchangeBtn'),
    exchangeLabel: $('#exchangeLabel'),
    sensorTriCount: $('#sensorTriCount'),
    sensorQuadCount: $('#sensorQuadCount'),
    counterButtons: [...document.querySelectorAll('[data-species][data-delta]')],
    checkSensors: $('#checkSensorsBtn'),
    lessonIcon: $('#lessonIcon'),
    lessonText: $('#lessonText'),
    hint: $('#hintBtn'),
    next: $('#nextBtn'),
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
  let missionIndex = 0;
  let unlocked = 0;
  let completed = new Set();
  let trialQuad = 0;
  let assumed = false;
  let assumptionQuad = 0;
  let sensorTri = 4;
  let sensorQuad = 4;
  let statusMessage = { key: 'act1Ready', tone: '', args: [] };

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(2, Math.max(0, Number(saved.unlocked) || 0));
    missionIndex = Math.min(unlocked, Math.max(0, Number(saved.missionIndex) || 0));
    completed = new Set(
      Array.isArray(saved.completed)
        ? saved.completed.filter((value) => Number.isInteger(value) && value >= 0 && value <= 2)
        : [],
    );
    trialQuad = Math.min(12, Math.max(0, Number(saved.trialQuad) || 0));
    assumed = Boolean(saved.assumed);
    assumptionQuad = Math.min(14, Math.max(0, Number(saved.assumptionQuad) || 0));
    const savedSensorTri = Number(saved.sensorTri);
    const savedSensorQuad = Number(saved.sensorQuad);
    sensorTri = Number.isFinite(savedSensorTri) ? Math.min(20, Math.max(0, savedSensorTri)) : 4;
    sensorQuad = Number.isFinite(savedSensorQuad) ? Math.min(20, Math.max(0, savedSensorQuad)) : 4;
    statusMessage = defaultStatus(missionIndex);
  } catch {
    statusMessage = { key: 'act1Ready', tone: '', args: [] };
  }

  class SoundEngine {
    constructor() {
      try {
        this.muted = ['true', '1'].includes(localStorage.getItem(SOUND_KEY));
      } catch {
        this.muted = false;
      }
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

    tone(frequency, duration = .1, volume = .025, type = 'sine', delay = 0) {
      const context = this.ensure();
      if (!context) return;
      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      this.sources.add(oscillator);
      oscillator.addEventListener('ended', () => this.sources.delete(oscillator), { once: true });
      oscillator.start(start);
      oscillator.stop(start + duration + .02);
    }

    tap() {
      this.tone(310, .06, .018, 'triangle');
    }

    swap() {
      [360, 440].forEach((frequency, index) => this.tone(frequency, .08, .019, 'sine', index * .045));
    }

    error() {
      this.tone(155, .15, .028, 'sawtooth');
      this.tone(118, .18, .022, 'square', .08);
    }

    correct() {
      [420, 560, 720].forEach((frequency, index) => this.tone(frequency, .12, .025, 'triangle', index * .07));
    }

    magic() {
      [330, 495, 660, 990].forEach((frequency, index) => this.tone(frequency, .18, .024, 'sine', index * .08));
    }

    finale() {
      [330, 440, 550, 740, 990].forEach((frequency, index) => this.tone(frequency, .24, .028, 'triangle', index * .095));
    }

    setMuted(muted) {
      this.muted = muted;
      try {
        localStorage.setItem(SOUND_KEY, String(muted));
      } catch {}
      if (muted) {
        this.sources.forEach((source) => {
          try { source.stop(); } catch {}
        });
        this.sources.clear();
      }
    }
  }

  const sound = new SoundEngine();

  function totals(tri, quad) {
    return {
      creatures: tri + quad,
      eyes: tri + (2 * quad),
      legs: (3 * tri) + (4 * quad),
    };
  }

  function currentHerd() {
    if (missionIndex === 0) return { tri: 12 - trialQuad, quad: trialQuad };
    if (missionIndex === 1) return { tri: 14 - assumptionQuad, quad: assumptionQuad };
    return { tri: sensorTri, quad: sensorQuad };
  }

  function defaultStatus(index) {
    if (completed.has(index)) {
      return { key: `act${index + 1}Done`, tone: 'good', args: [] };
    }
    if (index === 1 && assumed) return { key: 'act2Assumed', tone: '', args: [] };
    if (index === 2 && (sensorTri !== 4 || sensorQuad !== 4)) {
      const counts = totals(sensorTri, sensorQuad);
      return { key: 'act3Progress', tone: '', args: [sensorTri, sensorQuad, counts.eyes, counts.legs] };
    }
    return { key: `act${index + 1}Ready`, tone: '', args: [] };
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        missionIndex,
        unlocked,
        completed: [...completed],
        trialQuad,
        assumed,
        assumptionQuad,
        sensorTri,
        sensorQuad,
      }));
    } catch {}
  }

  function setStatus(key, tone = '', ...args) {
    statusMessage = { key, tone, args };
    el.status.textContent = t(key, ...args);
    el.status.className = `status${tone ? ` ${tone}` : ''}`;
  }

  function createCreature(species, index) {
    const creature = document.createElement('div');
    const eyeCount = species === 'tri' ? 1 : 2;
    const legCount = species === 'tri' ? 3 : 4;
    creature.className = `alien alien--${species}`;
    creature.style.animationDelay = `${Math.min(index * 22, 240)}ms, ${400 + (index * 35)}ms`;
    creature.setAttribute('aria-hidden', 'true');
    creature.innerHTML = `
      <span class="alien__antenna"></span>
      <span class="alien__body"></span>
      <span class="alien__eyes">${'<i></i>'.repeat(eyeCount)}</span>
      <span class="alien__legs">${'<i></i>'.repeat(legCount)}</span>
    `;
    return creature;
  }

  function renderCreatures() {
    const { tri, quad } = currentHerd();
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < tri; index += 1) fragment.append(createCreature('tri', index));
    for (let index = 0; index < quad; index += 1) fragment.append(createCreature('quad', tri + index));
    el.creatureGrid.replaceChildren(fragment);
  }

  function renderSensors() {
    const herd = currentHerd();
    const counts = totals(herd.tri, herd.quad);
    const target = MISSIONS[missionIndex].target;
    const values = [
      ['creatures', el.creatureCount, el.creatureTarget],
      ['eyes', el.eyeCount, el.eyeTarget],
      ['legs', el.legCount, el.legTarget],
    ];
    values.forEach(([name, valueElement, targetElement]) => {
      const sensor = document.querySelector(`[data-sensor="${name}"]`);
      valueElement.textContent = counts[name];
      targetElement.textContent = target[name] ?? '?';
      sensor.classList.toggle('match', target[name] !== null && counts[name] === target[name]);
    });
  }

  function renderNav() {
    el.missionNav.replaceChildren();
    MISSIONS.forEach((mission, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `mission-btn${index === missionIndex ? ' current' : ''}${completed.has(index) ? ' done' : ''}`;
      button.textContent = String(index + 1);
      button.disabled = index > unlocked;
      button.setAttribute('aria-label', index > unlocked ? t('lockedMission') : t('missionLabel', index + 1, t(mission.title)));
      button.setAttribute('aria-current', index === missionIndex ? 'step' : 'false');
      button.addEventListener('click', () => switchMission(index));
      el.missionNav.append(button);
    });
  }

  function renderControls() {
    el.trialControls.hidden = missionIndex !== 0;
    el.assumptionControls.hidden = missionIndex !== 1;
    el.sensorControls.hidden = missionIndex !== 2;
    el.next.hidden = !completed.has(missionIndex) || missionIndex === 2;

    el.mixRange.value = String(trialQuad);
    el.mixRange.disabled = completed.has(0);
    el.checkTrial.disabled = completed.has(0);
    el.trialTriCount.textContent = 12 - trialQuad;
    el.trialQuadCount.textContent = trialQuad;

    el.assume.disabled = completed.has(1);
    el.assume.hidden = assumed;
    el.exchange.hidden = !assumed || completed.has(1);
    el.assumptionFormula.textContent = assumed ? '14 × 3 = 42  →  48 − 42 = 6' : '14 × 3 = ?';
    el.exchangeLabel.textContent = t('exchangeSix');

    el.sensorTriCount.textContent = sensorTri;
    el.sensorQuadCount.textContent = sensorQuad;
    el.counterButtons.forEach((button) => {
      button.disabled = completed.has(2);
      const key = `${button.dataset.delta === '1' ? 'increase' : 'decrease'}${button.dataset.species === 'tri' ? 'Tri' : 'Quad'}`;
      button.setAttribute('aria-label', t(key));
    });
    el.checkSensors.disabled = completed.has(2);

    el.theme.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
    el.theme.setAttribute('aria-label', t('themeLabel'));
    el.sound.textContent = sound.muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', String(sound.muted));
    el.sound.setAttribute('aria-label', sound.muted ? t('soundOn') : t('soundOff'));
    el.missionNav.setAttribute('aria-label', t('missionsLabel'));
    el.creatureGrid.setAttribute('aria-label', t('creatureScene'));
  }

  function render() {
    const mission = MISSIONS[missionIndex];
    el.missionNumber.textContent = String(missionIndex + 1).padStart(2, '0');
    el.missionKicker.textContent = t(mission.kicker);
    el.missionTitle.textContent = t(mission.title);
    el.missionText.textContent = t(mission.text);
    el.consoleKicker.textContent = missionIndex === 0
      ? (language === 'zh' ? 'NIGHT CONSOLE / 夜班控制台' : 'NIGHT CONSOLE')
      : missionIndex === 1
        ? (language === 'zh' ? 'ASSUMPTION SCOPE / 假设镜' : 'ASSUMPTION SCOPE')
        : (language === 'zh' ? 'SENSOR ARRAY / 传感器阵列' : 'SENSOR ARRAY');
    el.consoleTitle.textContent = t(mission.console);
    el.lessonIcon.textContent = mission.icon;
    el.lessonText.textContent = t(mission.lesson);
    setStatus(statusMessage.key, statusMessage.tone, ...statusMessage.args);
    renderNav();
    renderControls();
    renderCreatures();
    renderSensors();
  }

  function switchMission(index) {
    if (index > unlocked || index === missionIndex) return;
    missionIndex = index;
    statusMessage = defaultStatus(index);
    window.cool?.stage?.(`night-${index + 1}`);
    save();
    render();
  }

  function completeMission() {
    completed.add(missionIndex);
    unlocked = Math.max(unlocked, Math.min(2, missionIndex + 1));
    save();
    if (missionIndex === 2) {
      sound.finale();
      window.cool?.complete?.();
      setTimeout(() => {
        el.course.inert = true;
        el.modal.hidden = false;
        el.playAgain.focus();
      }, 280);
    } else {
      sound.correct();
    }
    render();
  }

  function checkTrial() {
    if (missionIndex !== 0 || completed.has(0)) return;
    const herd = currentHerd();
    const counts = totals(herd.tri, herd.quad);
    window.cool?.track?.('check-herd-manifest', { quadpods: trialQuad, legs: counts.legs });
    if (counts.legs !== 43) {
      sound.error();
      const direction = language === 'zh'
        ? (counts.legs < 43 ? '右' : '左')
        : (counts.legs < 43 ? 'right' : 'left');
      setStatus('act1Wrong', 'bad', counts.legs, direction);
      return;
    }
    setStatus('act1Done', 'good');
    completeMission();
  }

  function assumeAllTripods() {
    if (missionIndex !== 1 || completed.has(1)) return;
    assumed = true;
    assumptionQuad = 0;
    sound.swap();
    window.cool?.track?.('assume-all-tripods', { creatures: 14, assumedLegs: 42 });
    setStatus('act2Assumed');
    save();
    render();
    el.exchange.focus();
  }

  function exchangeByDifference() {
    if (missionIndex !== 1 || !assumed || completed.has(1)) return;
    assumptionQuad = 6;
    sound.magic();
    window.cool?.track?.('replace-by-leg-difference', { replacements: 6 });
    setStatus('act2Done', 'good');
    completeMission();
  }

  function adjustSensor(species, delta) {
    if (missionIndex !== 2 || completed.has(2)) return;
    if (species === 'tri') sensorTri = Math.min(20, Math.max(0, sensorTri + delta));
    if (species === 'quad') sensorQuad = Math.min(20, Math.max(0, sensorQuad + delta));
    const counts = totals(sensorTri, sensorQuad);
    sound.tap();
    setStatus('act3Progress', '', sensorTri, sensorQuad, counts.eyes, counts.legs);
    save();
    render();
  }

  function checkSensorHerd() {
    if (missionIndex !== 2 || completed.has(2)) return;
    const counts = totals(sensorTri, sensorQuad);
    window.cool?.track?.('check-eye-leg-sensors', {
      tripods: sensorTri,
      quadpods: sensorQuad,
      eyes: counts.eyes,
      legs: counts.legs,
    });
    if (counts.eyes !== 20 || counts.legs !== 48) {
      sound.error();
      setStatus('act3Wrong', 'bad', counts.eyes, counts.legs);
      return;
    }
    setStatus('act3Done', 'good');
    completeMission();
  }

  el.mixRange.addEventListener('input', () => {
    trialQuad = Number(el.mixRange.value);
    const herd = currentHerd();
    const counts = totals(herd.tri, herd.quad);
    setStatus('act1Adjusted', '', herd.tri, herd.quad, counts.legs);
    renderControls();
    renderCreatures();
    renderSensors();
  });
  el.mixRange.addEventListener('change', () => {
    sound.swap();
    save();
  });
  el.checkTrial.addEventListener('click', checkTrial);
  el.assume.addEventListener('click', assumeAllTripods);
  el.exchange.addEventListener('click', exchangeByDifference);
  el.counterButtons.forEach((button) => {
    button.addEventListener('click', () => adjustSensor(button.dataset.species, Number(button.dataset.delta)));
  });
  el.checkSensors.addEventListener('click', checkSensorHerd);
  el.hint.addEventListener('click', () => {
    sound.tap();
    setStatus(MISSIONS[missionIndex].hint);
  });
  el.next.addEventListener('click', () => switchMission(Math.min(2, missionIndex + 1)));
  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    renderControls();
    if (!sound.muted) sound.tap();
  });
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.playAgain.addEventListener('click', () => {
    el.modal.hidden = true;
    el.course.inert = false;
    missionIndex = 0;
    unlocked = 0;
    completed.clear();
    trialQuad = 0;
    assumed = false;
    assumptionQuad = 0;
    sensorTri = 4;
    sensorQuad = 4;
    statusMessage = { key: 'act1Ready', tone: '', args: [] };
    save();
    window.cool?.stage?.('night-1');
    render();
    el.mixRange.focus();
  });

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang }) {
      t = translate;
      language = lang;
      document.title = t('doc');
      render();
      if (completed.has(2) && el.modal.hidden) {
        el.course.inert = true;
        el.modal.hidden = false;
        el.playAgain.focus();
      }
    },
  });
})();
