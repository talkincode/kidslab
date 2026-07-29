(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '彩虹舞台 · KidsLab',
      back: '返回平台',
      title: '彩虹舞台',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      missionsLabel: '舞台任务',
      canvasLabel: '彩虹舞台实验画面',
      lockedMission: '先完成前一幕',
      missionLabel: (n, title) => `第 ${n} 幕：${title}`,
      target: '演出目标',
      chooseLights: '点亮色光',
      redLight: '红光',
      greenLight: '绿光',
      blueLight: '蓝光',
      lightTarget: '用三盏灯做出白光',
      choosePigments: '倒入颜料',
      cyanPaint: '青色',
      yellowPaint: '黄色',
      magentaPaint: '品红',
      clearPaint: '清空调色桶',
      paintTarget: '只用两种颜料调出绿色',
      prismAngle: '棱镜角度',
      left: '左',
      right: '右',
      shine: '打开白光',
      prismTarget: '让整条彩虹落进幕布框',
      hint: '轻提示',
      check: '检查演出',
      next: '下一幕',
      finalKicker: '三幕灯光实验全部完成',
      finalTitle: '青蛙音乐节亮起来了！',
      finalText: '你用加色光合出白色，用减色颜料留下绿色，还把白光里藏着的彩虹展开了。',
      playAgain: '再办一场音乐节',
      act1Kicker: '第一幕 · 加色灯光',
      act1Title: '把三束色光叠成白色',
      act1Text: '点亮红、绿、蓝聚光灯，让三束光在主唱脚下重合。',
      act1Console: '三色聚光灯',
      act1Lesson: '色光越叠越亮；红、绿、蓝三束光能一起组成白光。',
      act1Ready: '先点亮一盏聚光灯，看看颜色怎样叠加。',
      act1Hint: '白光不是没有颜色。试着让红、绿、蓝三盏灯一起亮。',
      act1Empty: '还没有灯亮。先点一盏色灯，再检查舞台。',
      act1Wrong: '舞台还不是白色。还有色光没有加入重合区。',
      act1Done: '白光出现了！红、绿、蓝三束色光在这里一起发亮。',
      act2Kicker: '第二幕 · 减色颜料',
      act2Title: '从颜料里留下绿色',
      act2Text: '青色会拿走红光，黄色会拿走蓝光；找出留下绿色的两桶颜料。',
      act2Console: '海报调色桶',
      act2Lesson: '颜料会吸收一部分光。青色加黄色主要留下能反射进眼睛的绿光。',
      act2Ready: '选两桶颜料倒进调色桶，目标是绿色。',
      act2Hint: '青色主要拿走红光，黄色主要拿走蓝光。中间还剩哪种光？',
      act2Empty: '调色桶还是空的。先倒入两种颜料。',
      act2Count: '这张海报只准用两种颜料。可以点已选颜料取消。',
      act2Wrong: '这组颜料没有留下绿色。看看青色和黄色各自拿走了什么。',
      act2Done: '绿色调好了！青色和黄色共同吸收别的光，主要留下绿光。',
      act3Kicker: '第三幕 · 棱镜压轴',
      act3Title: '把白光里的彩虹展开',
      act3Text: '转动三棱镜，再打开白光，让七条彩带完整落进右侧幕布。',
      act3Console: '棱镜追光台',
      act3Lesson: '棱镜让不同波长的光偏折不同：红光通常偏得少，紫光偏得多。',
      act3Ready: '先打开白光，再转动棱镜寻找幕布中心。',
      act3Hint: '彩带落得太高就把角度向右调；目标在刻度正中间。',
      act3NeedShine: '白光还没打开。先让光穿过三棱镜。',
      act3Wrong: '彩带还没落进幕布框。根据落点方向调整棱镜。',
      act3Done: '整条光谱进框了！白光里的不同颜色被棱镜依次展开。',
      dark: '黑暗',
      white: '白光',
      red: '红色',
      green: '绿色',
      blue: '蓝色',
      yellow: '黄色',
      cyan: '青色',
      magenta: '品红',
      mixedLight: '混合色光',
      emptyBucket: '空桶',
      mixedPaint: '混合颜料',
      hiddenSpectrum: '等待白光',
      spectrum: '可见光谱',
      stageColor: '舞台光色',
      posterColor: '海报颜料',
      prismResult: '幕布读数',
      angle1: '偏左',
      angle2: '左中',
      angle3: '正中',
      angle4: '右中',
      angle5: '偏右',
    },
    en: {
      doc: 'Rainbow Stage · KidsLab',
      back: 'Back to platform',
      title: 'Rainbow Stage',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      missionsLabel: 'Stage missions',
      canvasLabel: 'Rainbow Stage experiment scene',
      lockedMission: 'Finish the previous act first',
      missionLabel: (n, title) => `Act ${n}: ${title}`,
      target: 'Show target',
      chooseLights: 'Switch on lights',
      redLight: 'Red',
      greenLight: 'Green',
      blueLight: 'Blue',
      lightTarget: 'Make white with all three lights',
      choosePigments: 'Pour pigments',
      cyanPaint: 'Cyan',
      yellowPaint: 'Yellow',
      magentaPaint: 'Magenta',
      clearPaint: 'Empty the paint bucket',
      paintTarget: 'Make green with only two pigments',
      prismAngle: 'Prism angle',
      left: 'Left',
      right: 'Right',
      shine: 'Switch on white light',
      prismTarget: 'Land the full rainbow inside the screen',
      hint: 'Small hint',
      check: 'Check the show',
      next: 'Next act',
      finalKicker: 'ALL THREE LIGHT LABS COMPLETE',
      finalTitle: 'The Frog Festival Is Glowing!',
      finalText: 'You made white with additive light, left green with subtractive pigment, and unfolded the rainbow hidden inside white light.',
      playAgain: 'Run another festival',
      act1Kicker: 'ACT ONE · ADDITIVE LIGHT',
      act1Title: 'Overlap Three Beams into White',
      act1Text: 'Switch on red, green, and blue spotlights so all three overlap beneath the singer.',
      act1Console: 'Three-color spotlights',
      act1Lesson: 'Adding light makes the result brighter. Red, green, and blue light can combine into white.',
      act1Ready: 'Switch on one spotlight and watch colors add together.',
      act1Hint: 'White light is not an empty color. Try red, green, and blue together.',
      act1Empty: 'No light is on yet. Switch on a color before checking.',
      act1Wrong: 'The stage is not white yet. One or more beams are missing from the overlap.',
      act1Done: 'White light! Red, green, and blue beams are all shining in the same place.',
      act2Kicker: 'ACT TWO · SUBTRACTIVE PIGMENT',
      act2Title: 'Leave Green in the Paint',
      act2Text: 'Cyan takes away red light and yellow takes away blue. Find the pair that leaves green.',
      act2Console: 'Poster paint bucket',
      act2Lesson: 'Pigments absorb some light. Cyan plus yellow mainly leaves green light to reflect to your eyes.',
      act2Ready: 'Pour two pigments into the bucket. Your target is green.',
      act2Hint: 'Cyan mainly takes red away; yellow mainly takes blue away. Which light remains?',
      act2Empty: 'The bucket is empty. Pour in two pigments first.',
      act2Count: 'This poster allows exactly two pigments. Tap a selected one to remove it.',
      act2Wrong: 'That pair does not leave green. Check what cyan and yellow each take away.',
      act2Done: 'Green mixed! Cyan and yellow absorb other light and mainly leave green.',
      act3Kicker: 'ACT THREE · PRISM FINALE',
      act3Title: 'Unfold the Rainbow inside White Light',
      act3Text: 'Turn the prism, switch on white light, and land all seven color ribbons on the screen.',
      act3Console: 'Prism follow-spot',
      act3Lesson: 'A prism bends wavelengths by different amounts: red usually bends less and violet more.',
      act3Ready: 'Switch on white light, then turn the prism toward the screen center.',
      act3Hint: 'If the rainbow lands too high, move the angle right. The target is the center mark.',
      act3NeedShine: 'The white light is still off. Send it through the prism first.',
      act3Wrong: 'The color ribbons miss the screen frame. Adjust the prism from the landing point.',
      act3Done: 'The full spectrum is framed! The prism spread the colors inside white light.',
      dark: 'Dark',
      white: 'White light',
      red: 'Red',
      green: 'Green',
      blue: 'Blue',
      yellow: 'Yellow',
      cyan: 'Cyan',
      magenta: 'Magenta',
      mixedLight: 'Mixed light',
      emptyBucket: 'Empty bucket',
      mixedPaint: 'Mixed pigment',
      hiddenSpectrum: 'Light is off',
      spectrum: 'Visible spectrum',
      stageColor: 'Stage light',
      posterColor: 'Poster paint',
      prismResult: 'Screen reading',
      angle1: 'Far left',
      angle2: 'Center-left',
      angle3: 'Centered',
      angle4: 'Center-right',
      angle5: 'Far right',
    },
  };

  const MISSIONS = [
    {
      kicker: 'act1Kicker',
      title: 'act1Title',
      text: 'act1Text',
      console: 'act1Console',
      lesson: 'act1Lesson',
      ready: 'act1Ready',
      hint: 'act1Hint',
      icon: '＋',
    },
    {
      kicker: 'act2Kicker',
      title: 'act2Title',
      text: 'act2Text',
      console: 'act2Console',
      lesson: 'act2Lesson',
      ready: 'act2Ready',
      hint: 'act2Hint',
      icon: '−',
    },
    {
      kicker: 'act3Kicker',
      title: 'act3Title',
      text: 'act3Text',
      console: 'act3Console',
      lesson: 'act3Lesson',
      ready: 'act3Ready',
      hint: 'act3Hint',
      icon: '△',
    },
  ];

  const SAVE_KEY = 'kidslab.rainbow-stage';
  const SOUND_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    missionNav: $('#missionNav'),
    status: $('#status'),
    canvas: $('#stageCanvas'),
    resultLabel: $('#resultLabel'),
    resultName: $('#resultName'),
    resultFormula: $('#resultFormula'),
    consoleKicker: $('#consoleKicker'),
    consoleTitle: $('#consoleTitle'),
    lightPanel: $('#lightPanel'),
    paintPanel: $('#paintPanel'),
    prismPanel: $('#prismPanel'),
    lightButtons: [...document.querySelectorAll('[data-light]')],
    paintButtons: [...document.querySelectorAll('[data-pigment]')],
    clearPaint: $('#clearPaintBtn'),
    prism: $('#prismSlider'),
    prismLabel: $('#prismAngleLabel'),
    shine: $('#shineBtn'),
    lessonIcon: $('#lessonIcon'),
    lessonText: $('#lessonText'),
    hint: $('#hintBtn'),
    check: $('#checkBtn'),
    next: $('#nextBtn'),
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
  let lights = new Set();
  let pigments = new Set();
  let prismAngle = 1;
  let prismShining = false;
  let statusMessage = { key: 'act1Ready', tone: '' };
  let flashUntil = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(2, Math.max(0, Number(saved.unlocked) || 0));
    completed = new Set(Array.isArray(saved.completed)
      ? saved.completed.filter((value) => Number.isInteger(value) && value >= 0 && value <= 2)
      : []);
  } catch {
    unlocked = 0;
    completed = new Set();
  }

  class SoundEngine {
    constructor() {
      try {
        this.muted = ['true', '1'].includes(localStorage.getItem(SOUND_KEY));
      } catch {
        this.muted = false;
      }
      this.context = null;
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

    tone(frequency, duration, volume, type = 'sine', delay = 0) {
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

    click(index = 0) {
      this.tone([280, 350, 430][index % 3], 0.08, 0.024, 'triangle');
    }

    shine() {
      [330, 440, 550].forEach((frequency, index) =>
        this.tone(frequency, 0.18, 0.018, 'sine', index * 0.035));
    }

    success(final = false) {
      [440, 554, 659, 880].forEach((frequency, index) =>
        this.tone(frequency, final ? 0.36 : 0.22, 0.032, 'sine', index * 0.075));
    }

    error() {
      this.tone(165, 0.16, 0.035, 'sawtooth');
      this.tone(120, 0.2, 0.028, 'sawtooth', 0.08);
    }

    setMuted(value) {
      this.muted = value;
      try { localStorage.setItem(SOUND_KEY, value ? '1' : '0'); } catch {}
      if (value && this.context) this.context.suspend().catch(() => {});
    }
  }

  const sound = new SoundEngine();

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        unlocked,
        completed: [...completed],
      }));
    } catch {}
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function setStatus(key, tone = '') {
    statusMessage = { key, tone };
    el.status.textContent = t(key);
    el.status.className = `status${tone ? ` ${tone}` : ''}`;
  }

  function resetMissionState() {
    lights = new Set();
    pigments = new Set();
    prismAngle = 1;
    prismShining = false;
    el.prism.value = '1';
  }

  function switchMission(index) {
    if (index > unlocked) return;
    missionIndex = index;
    resetMissionState();
    statusMessage = { key: MISSIONS[index].ready, tone: '' };
    window.cool?.stage?.(`act-${index + 1}`);
    sound.click(index);
    render();
  }

  function renderNav() {
    el.missionNav.replaceChildren();
    MISSIONS.forEach((mission, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `mission-btn${index === missionIndex ? ' current' : ''}${completed.has(index) ? ' done' : ''}`;
      button.textContent = String(index + 1).padStart(2, '0');
      button.disabled = index > unlocked;
      button.setAttribute('aria-label', index > unlocked
        ? t('lockedMission')
        : t('missionLabel', index + 1, t(mission.title)));
      button.addEventListener('click', () => switchMission(index));
      el.missionNav.append(button);
    });
  }

  function lightResult() {
    const red = lights.has('red') ? 255 : 0;
    const green = lights.has('green') ? 255 : 0;
    const blue = lights.has('blue') ? 255 : 0;
    let key = 'mixedLight';
    if (!lights.size) key = 'dark';
    else if (lights.size === 3) key = 'white';
    else if (lights.size === 1) key = [...lights][0];
    else if (lights.has('red') && lights.has('green')) key = 'yellow';
    else if (lights.has('green') && lights.has('blue')) key = 'cyan';
    else if (lights.has('red') && lights.has('blue')) key = 'magenta';
    return { red, green, blue, key };
  }

  function paintResult() {
    if (!pigments.size) return { color: cssVar('--screen'), key: 'emptyBucket' };
    let red = 242;
    let green = 242;
    let blue = 226;
    if (pigments.has('cyan')) red *= 0.12;
    if (pigments.has('magenta')) green *= 0.12;
    if (pigments.has('yellow')) blue *= 0.12;
    const key = pigments.size === 1 ? [...pigments][0]
      : pigments.size === 2 && pigments.has('cyan') && pigments.has('yellow')
        ? 'green'
        : 'mixedPaint';
    return {
      color: `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`,
      key,
    };
  }

  function renderResult() {
    if (missionIndex === 0) {
      const result = lightResult();
      el.resultLabel.textContent = t('stageColor');
      el.resultName.textContent = t(result.key);
      el.resultFormula.textContent = `R ${result.red} · G ${result.green} · B ${result.blue}`;
      return;
    }
    if (missionIndex === 1) {
      const result = paintResult();
      const names = [...pigments].map((key) => t(key));
      el.resultLabel.textContent = t('posterColor');
      el.resultName.textContent = t(result.key);
      el.resultFormula.textContent = names.length ? names.join(' + ') : 'C 0 · M 0 · Y 0';
      return;
    }
    el.resultLabel.textContent = t('prismResult');
    el.resultName.textContent = t(prismShining ? 'spectrum' : 'hiddenSpectrum');
    el.resultFormula.textContent = `△ ${t(`angle${prismAngle}`)}`;
  }

  function renderControls() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    el.lang.textContent = language === 'zh' ? 'EN' : '中';
    el.theme.textContent = document.documentElement.dataset.theme === 'light' ? '🌙' : '☀️';
    el.theme.setAttribute('aria-label', t('themeLabel'));
    el.sound.textContent = sound.muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', String(sound.muted));
    el.sound.setAttribute('aria-label', sound.muted ? t('soundOn') : t('soundOff'));
    el.missionNav.setAttribute('aria-label', t('missionsLabel'));
    el.canvas.setAttribute('aria-label', t('canvasLabel'));
    el.lightButtons.forEach((button) =>
      button.setAttribute('aria-pressed', String(lights.has(button.dataset.light))));
    el.paintButtons.forEach((button) =>
      button.setAttribute('aria-pressed', String(pigments.has(button.dataset.pigment))));
    el.prismLabel.textContent = t(`angle${prismAngle}`);
  }

  function render() {
    const mission = MISSIONS[missionIndex];
    el.missionNumber.textContent = String(missionIndex + 1).padStart(2, '0');
    el.missionKicker.textContent = t(mission.kicker);
    el.missionTitle.textContent = t(mission.title);
    el.missionText.textContent = t(mission.text);
    el.consoleKicker.textContent = missionIndex === 0
      ? (language === 'zh' ? 'LIGHT DESK / 灯光台' : 'LIGHT DESK')
      : missionIndex === 1
        ? (language === 'zh' ? 'POSTER SHOP / 海报间' : 'POSTER SHOP')
        : (language === 'zh' ? 'FOLLOW SPOT / 追光台' : 'FOLLOW SPOT');
    el.consoleTitle.textContent = t(mission.console);
    el.lessonIcon.textContent = mission.icon;
    el.lessonText.textContent = t(mission.lesson);
    el.lightPanel.hidden = missionIndex !== 0;
    el.paintPanel.hidden = missionIndex !== 1;
    el.prismPanel.hidden = missionIndex !== 2;
    el.next.hidden = !completed.has(missionIndex) || missionIndex === 2;
    el.check.hidden = completed.has(missionIndex);
    setStatus(statusMessage.key, statusMessage.tone);
    renderNav();
    renderControls();
    renderResult();
    draw();
  }

  function completeMission() {
    completed.add(missionIndex);
    unlocked = Math.max(unlocked, Math.min(2, missionIndex + 1));
    save();
    sound.success(missionIndex === 2);
    flashUntil = performance.now() + 900;
    if (missionIndex === 2) {
      window.cool?.complete?.();
      setTimeout(() => {
        el.modal.hidden = false;
        el.playAgain.focus();
      }, 320);
    }
    render();
  }

  function checkMission() {
    if (missionIndex === 0) {
      if (!lights.size) {
        sound.error();
        setStatus('act1Empty', 'bad');
      } else if (lights.size !== 3) {
        sound.error();
        setStatus('act1Wrong', 'bad');
      } else {
        setStatus('act1Done', 'good');
        completeMission();
      }
      return;
    }

    if (missionIndex === 1) {
      if (!pigments.size) {
        sound.error();
        setStatus('act2Empty', 'bad');
      } else if (pigments.size !== 2) {
        sound.error();
        setStatus('act2Count', 'bad');
      } else if (!(pigments.has('cyan') && pigments.has('yellow'))) {
        sound.error();
        setStatus('act2Wrong', 'bad');
      } else {
        setStatus('act2Done', 'good');
        completeMission();
      }
      return;
    }

    if (!prismShining) {
      sound.error();
      setStatus('act3NeedShine', 'bad');
    } else if (prismAngle !== 3) {
      sound.error();
      setStatus('act3Wrong', 'bad');
    } else {
      setStatus('act3Done', 'good');
      completeMission();
    }
  }

  function fitCanvas() {
    const rect = el.canvas.getBoundingClientRect();
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (el.canvas.width !== width || el.canvas.height !== height) {
      el.canvas.width = width;
      el.canvas.height = height;
    }
    return ratio;
  }

  function roundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
  }

  function drawFrog(context, x, y, size, ratio, spotlight = false) {
    context.save();
    context.translate(x, y);
    context.fillStyle = cssVar('--frog-dark');
    context.beginPath();
    context.ellipse(0, size * 0.25, size * 0.42, size * 0.34, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = cssVar('--frog');
    context.beginPath();
    context.arc(0, 0, size * 0.34, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(-size * 0.22, -size * 0.2, size * 0.13, 0, Math.PI * 2);
    context.arc(size * 0.22, -size * 0.2, size * 0.13, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = cssVar('--stage-2');
    context.beginPath();
    context.arc(-size * 0.22, -size * 0.2, size * 0.045, 0, Math.PI * 2);
    context.arc(size * 0.22, -size * 0.2, size * 0.045, 0, Math.PI * 2);
    context.fill();
    if (spotlight) {
      context.strokeStyle = cssVar('--screen');
      context.lineWidth = 2 * ratio;
      context.beginPath();
      context.arc(0, size * 0.02, size * 0.16, 0.18, Math.PI - 0.18);
      context.stroke();
    }
    context.restore();
  }

  function drawStageBase(context, width, height, ratio) {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, cssVar('--stage'));
    gradient.addColorStop(1, cssVar('--stage-2'));
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = cssVar('--canvas-grid');
    context.lineWidth = ratio;
    for (let x = 0; x < width; x += 54 * ratio) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    context.fillStyle = 'rgba(255,255,255,0.08)';
    context.fillRect(0, height * 0.72, width, height * 0.28);
    context.fillStyle = 'rgba(0,0,0,0.2)';
    for (let index = 0; index < 7; index += 1) {
      context.beginPath();
      context.arc(width * (0.08 + index * 0.14), height * 0.94, 18 * ratio, Math.PI, 0);
      context.fill();
    }
  }

  function drawLights(context, width, height, ratio) {
    drawStageBase(context, width, height, ratio);
    const colors = {
      red: cssVar('--red'),
      green: cssVar('--green'),
      blue: cssVar('--blue'),
    };
    const origins = [
      { key: 'red', x: width * 0.18 },
      { key: 'green', x: width * 0.5 },
      { key: 'blue', x: width * 0.82 },
    ];
    context.save();
    context.globalCompositeOperation = 'lighter';
    origins.forEach(({ key, x }) => {
      context.fillStyle = colors[key];
      context.globalAlpha = lights.has(key) ? 0.42 : 0.025;
      context.beginPath();
      context.moveTo(x - 17 * ratio, height * 0.08);
      context.lineTo(width * 0.36, height * 0.77);
      context.lineTo(width * 0.64, height * 0.77);
      context.lineTo(x + 17 * ratio, height * 0.08);
      context.closePath();
      context.fill();
      context.globalAlpha = lights.has(key) ? 1 : 0.18;
      context.shadowColor = colors[key];
      context.shadowBlur = lights.has(key) ? 18 * ratio : 0;
      context.beginPath();
      context.arc(x, height * 0.08, 12 * ratio, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
    });
    context.restore();
    const result = lightResult();
    context.fillStyle = `rgb(${result.red}, ${result.green}, ${result.blue})`;
    context.globalAlpha = lights.size ? 0.9 : 0.08;
    context.beginPath();
    context.ellipse(width * 0.5, height * 0.76, width * 0.15, height * 0.055, 0, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
    drawFrog(context, width * 0.5, height * 0.62, 42 * ratio, ratio, true);
  }

  function drawPaint(context, width, height, ratio) {
    drawStageBase(context, width, height, ratio);
    const centerX = width * 0.53;
    const centerY = height * 0.53;
    const result = paintResult();
    context.fillStyle = cssVar('--panel-2');
    roundedRect(context, width * 0.15, height * 0.18, width * 0.7, height * 0.56, 22 * ratio);
    context.fill();
    context.strokeStyle = cssVar('--line');
    context.lineWidth = 3 * ratio;
    context.stroke();
    context.fillStyle = cssVar('--line');
    roundedRect(context, centerX - width * 0.2, centerY - height * 0.13, width * 0.4, height * 0.3, 18 * ratio);
    context.fill();
    context.fillStyle = result.color;
    roundedRect(context, centerX - width * 0.18, centerY - height * 0.11, width * 0.36, height * 0.24, 14 * ratio);
    context.fill();
    const pots = [
      { key: 'cyan', color: '--cyan', x: width * 0.25 },
      { key: 'yellow', color: '--yellow', x: width * 0.5 },
      { key: 'magenta', color: '--magenta', x: width * 0.75 },
    ];
    pots.forEach((pot) => {
      const selected = pigments.has(pot.key);
      context.fillStyle = cssVar(pot.color);
      context.globalAlpha = selected ? 1 : 0.38;
      context.beginPath();
      context.arc(pot.x, height * 0.24, 22 * ratio, 0, Math.PI * 2);
      context.fill();
      if (selected) {
        context.strokeStyle = cssVar('--screen');
        context.lineWidth = 4 * ratio;
        context.beginPath();
        context.moveTo(pot.x, height * 0.28);
        context.quadraticCurveTo(centerX, height * 0.31, centerX, centerY - height * 0.1);
        context.stroke();
      }
    });
    context.globalAlpha = 1;
    drawFrog(context, width * 0.18, height * 0.68, 35 * ratio, ratio);
    drawFrog(context, width * 0.84, height * 0.68, 35 * ratio, ratio);
  }

  function drawPrism(context, width, height, ratio) {
    drawStageBase(context, width, height, ratio);
    const prismX = width * 0.43;
    const prismY = height * 0.5;
    const targetX = width * 0.88;
    const targetY = height * 0.55;
    context.fillStyle = cssVar('--screen');
    context.globalAlpha = 0.9;
    roundedRect(context, width * 0.79, height * 0.25, width * 0.16, height * 0.58, 8 * ratio);
    context.fill();
    context.globalAlpha = 1;
    context.strokeStyle = prismAngle === 3 && prismShining ? cssVar('--green') : cssVar('--line');
    context.lineWidth = 4 * ratio;
    context.stroke();
    context.strokeStyle = cssVar('--violet');
    context.lineWidth = 2 * ratio;
    context.beginPath();
    context.moveTo(width * 0.79, targetY);
    context.lineTo(width * 0.95, targetY);
    context.stroke();

    context.fillStyle = 'rgba(180, 235, 255, 0.28)';
    context.strokeStyle = cssVar('--cyan');
    context.lineWidth = 3 * ratio;
    context.beginPath();
    context.moveTo(prismX, prismY - height * 0.18);
    context.lineTo(prismX - width * 0.1, prismY + height * 0.17);
    context.lineTo(prismX + width * 0.1, prismY + height * 0.17);
    context.closePath();
    context.fill();
    context.stroke();

    if (!prismShining) {
      context.fillStyle = 'rgba(255,255,255,0.18)';
      context.beginPath();
      context.arc(width * 0.1, prismY, 13 * ratio, 0, Math.PI * 2);
      context.fill();
      return;
    }

    context.strokeStyle = cssVar('--screen');
    context.shadowColor = cssVar('--screen');
    context.shadowBlur = 10 * ratio;
    context.lineWidth = 8 * ratio;
    context.beginPath();
    context.moveTo(width * 0.08, prismY);
    context.lineTo(prismX, prismY);
    context.stroke();
    context.shadowBlur = 0;

    const landingY = height * (0.25 + prismAngle * 0.1);
    const rays = ['--ray-red', '--ray-orange', '--ray-yellow', '--ray-green', '--ray-blue', '--ray-indigo', '--ray-violet'];
    rays.forEach((color, index) => {
      const spread = (index - 3) * height * 0.024;
      context.strokeStyle = cssVar(color);
      context.lineWidth = 5 * ratio;
      context.beginPath();
      context.moveTo(prismX + width * 0.035, prismY + index * ratio);
      context.lineTo(targetX, landingY + spread);
      context.stroke();
    });
  }

  function draw() {
    const ratio = fitCanvas();
    const context = el.canvas.getContext('2d');
    const width = el.canvas.width;
    const height = el.canvas.height;
    context.clearRect(0, 0, width, height);
    if (missionIndex === 0) drawLights(context, width, height, ratio);
    else if (missionIndex === 1) drawPaint(context, width, height, ratio);
    else drawPrism(context, width, height, ratio);
    if (performance.now() < flashUntil) {
      context.fillStyle = 'rgba(255,255,255,0.12)';
      context.fillRect(0, 0, width, height);
      requestAnimationFrame(draw);
    }
  }

  el.lightButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const key = button.dataset.light;
      if (lights.has(key)) lights.delete(key);
      else lights.add(key);
      sound.click(index);
      setStatus('act1Ready');
      renderControls();
      renderResult();
      draw();
      window.cool?.track?.('toggle_stage_light', { color: key, enabled: lights.has(key) });
    });
  });

  el.paintButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const key = button.dataset.pigment;
      if (pigments.has(key)) pigments.delete(key);
      else if (pigments.size < 2) pigments.add(key);
      else {
        sound.error();
        setStatus('act2Count', 'bad');
        return;
      }
      sound.click(index);
      setStatus('act2Ready');
      renderControls();
      renderResult();
      draw();
      window.cool?.track?.('toggle_poster_pigment', { pigment: key, enabled: pigments.has(key) });
    });
  });

  el.clearPaint.addEventListener('click', () => {
    pigments.clear();
    sound.click();
    setStatus('act2Ready');
    renderControls();
    renderResult();
    draw();
  });

  el.prism.addEventListener('input', () => {
    prismAngle = Number(el.prism.value);
    prismShining = false;
    setStatus('act3Ready');
    renderControls();
    renderResult();
    draw();
  });

  el.shine.addEventListener('click', () => {
    prismShining = true;
    sound.shine();
    flashUntil = performance.now() + 500;
    setStatus(prismAngle === 3 ? 'act3Ready' : 'act3Wrong');
    renderResult();
    draw();
    window.cool?.track?.('shine_through_prism', { angle: prismAngle });
  });

  el.hint.addEventListener('click', () => {
    sound.click();
    setStatus(MISSIONS[missionIndex].hint);
  });
  el.check.addEventListener('click', checkMission);
  el.next.addEventListener('click', () => switchMission(Math.min(2, missionIndex + 1)));
  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    renderControls();
    if (!sound.muted) sound.click();
  });
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.playAgain.addEventListener('click', () => {
    el.modal.hidden = true;
    missionIndex = 0;
    unlocked = 0;
    completed.clear();
    resetMissionState();
    save();
    statusMessage = { key: 'act1Ready', tone: '' };
    window.cool?.stage?.('act-1');
    render();
  });

  window.addEventListener('resize', draw);
  window.addEventListener('themechange', draw);
  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang }) {
      t = translate;
      language = lang;
      render();
    },
  });
})();
