(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '声波乐团 · KidsLab',
      back: '返回平台',
      title: '声波乐团',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      missionsLabel: '实验关卡',
      waveformLabel: '声音波形图',
      measuresLabel: '实时测量',
      signal: '信号在线',
      silentSignal: '真空静音',
      stringCam: '高速琴弦相机',
      scope: '波形观察窗',
      vacuumJar: '真空罩',
      frequency: '频率',
      amplitude: '振幅',
      air: '空气',
      controlDesk: 'WAVE BAND / 控制台',
      tension: '琴弦松紧',
      loose: '松',
      medium: '适中',
      tight: '紧',
      target: '演出目标',
      pitchTarget: '做出 510 Hz 的高音',
      pluck: '拨动琴弦',
      pluckStrength: '拨弦力度',
      soft: '轻',
      normal: '适中',
      strong: '重',
      loudTarget: '保持音高，做出大振幅响音',
      airBridge: '空气桥',
      airFull: '满格 · 声音能传出',
      airSome: (n) => `还剩 ${n}% · 声音变小`,
      airEmpty: '0% · 闹钟还在振动',
      vacuumTarget: '抽光空气，观察闹钟',
      pump: '抽走空气',
      ring: '敲响闹钟',
      refill: '让空气回来',
      hint: '小提示',
      check: '检查实验',
      next: '下一声部',
      finalKicker: '三种声音秘密全部看见',
      finalTitle: '首席声波指挥！',
      finalText: '你用频率改变音高，用振幅改变响度，还发现声音离不开传播介质。',
      playAgain: '再演一次',
      missionLabel: (n, title) => `第 ${n} 关：${title}`,
      lockedMission: '先完成前一关',
      mission1Kicker: '第一声部 · 音高',
      mission1Title: '把琴弦调成高音',
      mission1Text: '绷紧琴弦，再拨一下。让示波器挤出更多波峰。',
      mission2Kicker: '第二声部 · 响度',
      mission2Title: '只让声音变响',
      mission2Text: '用同一根琴弦大力拨动。波要变高，不能变密。',
      mission3Kicker: '压轴实验 · 传播',
      mission3Title: '让闹钟无声地响',
      mission3Text: '逐步抽走空气。看看没有空气时，振动还能不能传出来。',
      consolePitch: '琴弦调音器',
      consoleLoud: '振幅放大器',
      consoleVacuum: '真空控制器',
      readyPitch: '先拨一下琴弦，听听现在的声音。',
      readyLoud: '轻轻拨一下，先记住这根弦的音高。',
      readyVacuum: '先敲响闹钟，再一点点抽走空气。',
      pitchPlucked: (hz) => `听见了 ${hz} Hz。波峰越密，音高越高。`,
      loudPlucked: (level) => `音高还是 360 Hz，波形振幅变成 ${level}/3。`,
      alarmRang: (air) => air === 0
        ? '闹钟锤还在敲，但真空里没有声音传出来。'
        : `闹钟在振动；空气还剩 ${air}%，声音能传出来。`,
      pumped: (air) => air === 0
        ? '空气抽光了。现在敲响闹钟，观察它还在不在振动。'
        : `抽走一部分空气，还剩 ${air}%。再听一次会更小。`,
      refilled: '空气回来了，声音又有了传播的桥。',
      needPluck: '先拨一下，实验员要听见并看见这次变化。',
      pitchWrong: '还不是高音。把琴弦调到最紧，再拨一下。',
      pitchDone: '高音命中！510 Hz 的波峰更密，每秒振动次数更多。',
      loudWrong: '振幅还不够大。保持同一根弦，改用最大力度拨动。',
      loudDone: '响度命中！波变高了，但频率仍是 360 Hz，音高没变。',
      vacuumWrong: '空气还在传递振动。继续抽气，直到空气表归零。',
      needRingVacuum: '空气已经抽光，再敲一次闹钟确认结果。',
      vacuumDone: '实验成功！闹钟仍在振动，但真空里没有介质传声。',
      hintPitch: '把滑杆推向“紧”。琴弦越紧，振动越快。',
      hintLoud: '把力度推到“重”。拨得更开，振幅更大。',
      hintVacuum: '连续按“抽走空气”，归零后再敲响闹钟。',
      lessonPitch: '弦越紧，每秒振动次数越多，音高越高。',
      lessonLoud: '拨得越用力，振幅越大，声音越响；频率和音高不变。',
      lessonVacuum: '振动需要空气等介质传出去；真空中听不到声音。',
    },
    en: {
      doc: 'Wave Band · KidsLab',
      back: 'Back to platform',
      title: 'Wave Band',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      missionsLabel: 'Lab missions',
      waveformLabel: 'Sound waveform',
      measuresLabel: 'Live measurements',
      signal: 'Signal live',
      silentSignal: 'Vacuum silent',
      stringCam: 'HIGH-SPEED STRING CAM',
      scope: 'WAVE MONITOR',
      vacuumJar: 'VACUUM JAR',
      frequency: 'Frequency',
      amplitude: 'Amplitude',
      air: 'Air',
      controlDesk: 'WAVE BAND / CONSOLE',
      tension: 'String tension',
      loose: 'Loose',
      medium: 'Medium',
      tight: 'Tight',
      target: 'SHOW TARGET',
      pitchTarget: 'Make a 510 Hz high note',
      pluck: 'Pluck the string',
      pluckStrength: 'Pluck strength',
      soft: 'Soft',
      normal: 'Medium',
      strong: 'Strong',
      loudTarget: 'Keep pitch; make a tall, loud wave',
      airBridge: 'Air bridge',
      airFull: 'Full · sound can travel',
      airSome: (n) => `${n}% left · sound is softer`,
      airEmpty: '0% · the alarm still vibrates',
      vacuumTarget: 'Remove all air and watch the alarm',
      pump: 'Pump out air',
      ring: 'Ring alarm',
      refill: 'Let the air back in',
      hint: 'Hint',
      check: 'Check experiment',
      next: 'Next part',
      finalKicker: 'ALL THREE SOUND SECRETS REVEALED',
      finalTitle: 'Chief Wave Conductor!',
      finalText: 'You changed pitch with frequency, loudness with amplitude, and discovered that sound needs a medium.',
      playAgain: 'Play again',
      missionLabel: (n, title) => `Mission ${n}: ${title}`,
      lockedMission: 'Finish the previous mission first',
      mission1Kicker: 'PART ONE · PITCH',
      mission1Title: 'Tune a High Note',
      mission1Text: 'Tighten the string, then pluck. Pack more peaks into the scope.',
      mission2Kicker: 'PART TWO · LOUDNESS',
      mission2Title: 'Make Only Loudness Grow',
      mission2Text: 'Pluck the same string harder. Make the wave taller, not denser.',
      mission3Kicker: 'FINALE · TRAVEL',
      mission3Title: 'Make the Alarm Ring Silently',
      mission3Text: 'Pump out the air. Can vibration travel when no air is left?',
      consolePitch: 'String tuner',
      consoleLoud: 'Amplitude booster',
      consoleVacuum: 'Vacuum controller',
      readyPitch: 'Pluck once and listen to the starting note.',
      readyLoud: 'Pluck softly and remember this string’s pitch.',
      readyVacuum: 'Ring the alarm, then pump out the air step by step.',
      pitchPlucked: (hz) => `That was ${hz} Hz. Denser peaks make a higher pitch.`,
      loudPlucked: (level) => `Pitch stays at 360 Hz while amplitude becomes ${level}/3.`,
      alarmRang: (air) => air === 0
        ? 'The hammer still moves, but no sound travels through the vacuum.'
        : `The alarm vibrates. With ${air}% air, sound can still travel.`,
      pumped: (air) => air === 0
        ? 'All air is gone. Ring the alarm and watch whether it still vibrates.'
        : `${air}% air remains. Ring it again and the sound will be softer.`,
      refilled: 'Air is back, rebuilding the bridge that carries sound.',
      needPluck: 'Pluck first so the lab can hear and see this change.',
      pitchWrong: 'Not high yet. Tighten the string all the way, then pluck.',
      pitchDone: 'High note hit! The 510 Hz wave has more peaks each second.',
      loudWrong: 'The wave is not tall enough. Keep this string and use maximum strength.',
      loudDone: 'Loudness hit! The wave grew taller, but pitch stayed at 360 Hz.',
      vacuumWrong: 'Air is still carrying the vibration. Keep pumping until the gauge reaches zero.',
      needRingVacuum: 'The air is gone. Ring once more to confirm the result.',
      vacuumDone: 'Experiment complete! The alarm vibrates, but a vacuum has no medium to carry sound.',
      hintPitch: 'Slide toward “Tight.” A tighter string vibrates faster.',
      hintLoud: 'Slide toward “Strong.” A wider pluck makes a taller wave.',
      hintVacuum: 'Keep pressing “Pump out air,” then ring again at zero.',
      lessonPitch: 'A tighter string vibrates more times each second, giving a higher pitch.',
      lessonLoud: 'A harder pluck makes a larger amplitude and louder sound; pitch stays the same.',
      lessonVacuum: 'Vibration needs a medium such as air to travel. Sound cannot cross a vacuum.',
    },
  };

  const MISSIONS = [
    {
      kicker: 'mission1Kicker',
      title: 'mission1Title',
      text: 'mission1Text',
      console: 'consolePitch',
      ready: 'readyPitch',
      lesson: 'lessonPitch',
      icon: '↟',
    },
    {
      kicker: 'mission2Kicker',
      title: 'mission2Title',
      text: 'mission2Text',
      console: 'consoleLoud',
      ready: 'readyLoud',
      lesson: 'lessonLoud',
      icon: '↕',
    },
    {
      kicker: 'mission3Kicker',
      title: 'mission3Title',
      text: 'mission3Text',
      console: 'consoleVacuum',
      ready: 'readyVacuum',
      lesson: 'lessonVacuum',
      icon: '◌',
    },
  ];

  const SAVE_KEY = 'kidslab.wave-band';
  const SOUND_KEY = 'kidslab.sound.muted';
  const FREQUENCIES = [290, 400, 510];
  const $ = (selector) => document.querySelector(selector);
  const el = {
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    missionNav: $('#missionNav'),
    status: $('#status'),
    signal: $('#signalBadge'),
    stringBench: $('#stringBench'),
    stringLine: $('#stringLine'),
    scopeReadout: $('#scopeReadout'),
    canvas: $('#waveCanvas'),
    bellJar: $('#bellJar'),
    airDots: $('#airDots'),
    alarm: $('#alarm'),
    frequency: $('#frequencyValue'),
    amplitude: $('#amplitudeValue'),
    air: $('#airValue'),
    consoleTitle: $('#consoleTitle'),
    pitchPanel: $('#pitchPanel'),
    loudnessPanel: $('#loudnessPanel'),
    vacuumPanel: $('#vacuumPanel'),
    tension: $('#tensionSlider'),
    tensionLabel: $('#tensionLabel'),
    strength: $('#strengthSlider'),
    strengthLabel: $('#strengthLabel'),
    airLabel: $('#airLabel'),
    airGauge: $('#airGauge'),
    pluck: $('#pluckBtn'),
    loudPluck: $('#loudPluckBtn'),
    pump: $('#pumpBtn'),
    ring: $('#alarmBtn'),
    refill: $('#refillBtn'),
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
  let tension = 1;
  let strength = 1;
  let air = 100;
  let pluckedSinceChange = false;
  let rangAtVacuum = false;
  let statusMessage = { key: 'readyPitch', args: [], tone: '' };
  let pulseUntil = 0;
  let animationFrame = 0;

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

    setMuted(value) {
      this.muted = value;
      try { localStorage.setItem(SOUND_KEY, String(value)); } catch {}
      if (value && this.context) this.context.suspend().catch(() => {});
    }

    tone(frequency, duration, volume, type = 'triangle', delay = 0) {
      const context = this.ensure();
      if (!context || volume <= 0) return;
      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    }

    pluck(frequency, amplitude) {
      this.tone(frequency, 0.48, 0.018 + amplitude * 0.017, 'triangle');
      this.tone(frequency * 2, 0.23, 0.009 + amplitude * 0.005, 'sine', 0.015);
    }

    alarm(airPercent) {
      const volume = 0.052 * (airPercent / 100);
      this.tone(720, 0.12, volume, 'square');
      this.tone(570, 0.12, volume, 'square', 0.14);
      this.tone(720, 0.12, volume, 'square', 0.28);
    }

    success(final = false) {
      [440, 554, 659].forEach((frequency, index) =>
        this.tone(frequency, final ? 0.36 : 0.2, 0.035, 'sine', index * 0.09));
    }

    error() {
      this.tone(170, 0.16, 0.038, 'sawtooth');
      this.tone(125, 0.2, 0.03, 'sawtooth', 0.08);
    }

    click() {
      this.tone(330, 0.07, 0.02, 'triangle');
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

  function setStatus(key, tone = '', ...args) {
    statusMessage = { key, args, tone };
    el.status.textContent = t(key, ...args);
    el.status.className = `status${tone ? ` ${tone}` : ''}`;
  }

  function currentFrequency() {
    if (missionIndex === 1) return 360;
    return FREQUENCIES[tension - 1];
  }

  function currentAmplitude() {
    return missionIndex === 1 ? strength : 1;
  }

  function populateAirDots() {
    if (el.airDots.children.length) return;
    for (let index = 0; index < 24; index += 1) {
      const dot = document.createElement('i');
      dot.style.left = `${9 + ((index * 37) % 82)}%`;
      dot.style.top = `${7 + ((index * 53) % 84)}%`;
      el.airDots.append(dot);
    }
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

  function render() {
    const mission = MISSIONS[missionIndex];
    el.missionNumber.textContent = String(missionIndex + 1).padStart(2, '0');
    el.missionKicker.textContent = t(mission.kicker);
    el.missionTitle.textContent = t(mission.title);
    el.missionText.textContent = t(mission.text);
    el.consoleTitle.textContent = t(mission.console);
    el.lessonText.textContent = t(mission.lesson);
    el.lessonIcon.textContent = mission.icon;
    el.pitchPanel.hidden = missionIndex !== 0;
    el.loudnessPanel.hidden = missionIndex !== 1;
    el.vacuumPanel.hidden = missionIndex !== 2;
    el.stringBench.hidden = missionIndex === 2;
    el.bellJar.hidden = missionIndex !== 2;
    el.frequency.innerHTML = `${missionIndex === 2 ? '—' : currentFrequency()} <small>${missionIndex === 2 ? '' : 'Hz'}</small>`;
    el.amplitude.innerHTML = `${missionIndex === 2 ? '—' : currentAmplitude()} <small>${missionIndex === 2 ? '' : '/ 3'}</small>`;
    el.air.innerHTML = `${missionIndex === 2 ? air : 100} <small>%</small>`;
    el.scopeReadout.textContent = missionIndex === 2
      ? (air === 0 ? 'NO MEDIUM' : `${air}% AIR`)
      : `${currentFrequency()} Hz`;
    el.tensionLabel.textContent = t(['loose', 'medium', 'tight'][tension - 1]);
    el.strengthLabel.textContent = t(['soft', 'normal', 'strong'][strength - 1]);
    el.airLabel.textContent = air === 0 ? t('airEmpty') : air === 100 ? t('airFull') : t('airSome', air);
    el.airGauge.style.transform = `scaleX(${air / 100})`;
    el.airDots.style.opacity = String(air / 100);
    el.signal.classList.toggle('silent', missionIndex === 2 && air === 0);
    el.signal.querySelector('span').textContent = missionIndex === 2 && air === 0 ? t('silentSignal') : t('signal');
    el.next.hidden = !completed.has(missionIndex) || missionIndex === 2;
    el.check.hidden = completed.has(missionIndex);
    const message = statusMessage;
    setStatus(message.key, message.tone, ...message.args);
    renderNav();
    renderControls();
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
    el.canvas.setAttribute('aria-label', t('waveformLabel'));
    $('.meters').setAttribute('aria-label', t('measuresLabel'));
  }

  function switchMission(index) {
    if (index > unlocked) return;
    missionIndex = index;
    tension = 1;
    strength = 1;
    air = 100;
    pluckedSinceChange = false;
    rangAtVacuum = false;
    el.tension.value = '1';
    el.strength.value = '1';
    statusMessage = { key: MISSIONS[index].ready, args: [], tone: '' };
    window.cool?.stage?.(`mission-${index + 1}`);
    sound.click();
    render();
  }

  function animatePluck() {
    el.stringBench.classList.remove('plucked');
    void el.stringBench.offsetWidth;
    el.stringBench.classList.add('plucked');
    pulseUntil = performance.now() + 850;
  }

  function pluckString() {
    pluckedSinceChange = true;
    animatePluck();
    const frequency = currentFrequency();
    const amplitude = currentAmplitude();
    sound.pluck(frequency, amplitude);
    setStatus(missionIndex === 0 ? 'pitchPlucked' : 'loudPlucked', '', missionIndex === 0 ? frequency : amplitude);
    window.cool?.track?.(missionIndex === 0 ? 'pluck_pitch_string' : 'pluck_loudness_string', {
      frequency,
      amplitude,
    });
  }

  function ringAlarm() {
    rangAtVacuum ||= air === 0;
    el.alarm.classList.remove('ringing');
    void el.alarm.offsetWidth;
    el.alarm.classList.add('ringing');
    pulseUntil = performance.now() + 700;
    sound.alarm(air);
    setStatus('alarmRang', air === 0 ? 'good' : '', air);
    window.cool?.track?.('ring_alarm', { air });
  }

  function completeMission() {
    completed.add(missionIndex);
    unlocked = Math.max(unlocked, Math.min(2, missionIndex + 1));
    save();
    sound.success(missionIndex === 2);
    if (missionIndex === 2) {
      window.cool?.complete?.();
      setTimeout(() => {
        el.modal.hidden = false;
        el.playAgain.focus();
      }, 350);
    }
    render();
  }

  function checkMission() {
    if (missionIndex < 2 && !pluckedSinceChange) {
      sound.error();
      setStatus('needPluck', 'bad');
      return;
    }

    if (missionIndex === 0) {
      if (tension !== 3) {
        sound.error();
        setStatus('pitchWrong', 'bad');
        return;
      }
      setStatus('pitchDone', 'good');
      completeMission();
      return;
    }

    if (missionIndex === 1) {
      if (strength !== 3) {
        sound.error();
        setStatus('loudWrong', 'bad');
        return;
      }
      setStatus('loudDone', 'good');
      completeMission();
      return;
    }

    if (air > 0) {
      sound.error();
      setStatus('vacuumWrong', 'bad');
      return;
    }
    if (!rangAtVacuum) {
      sound.error();
      setStatus('needRingVacuum', 'bad');
      return;
    }
    setStatus('vacuumDone', 'good');
    completeMission();
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

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function drawWave(time) {
    const ratio = fitCanvas();
    const context = el.canvas.getContext('2d');
    const width = el.canvas.width;
    const height = el.canvas.height;
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#061612';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = 'rgba(105, 235, 207, 0.14)';
    context.lineWidth = ratio;
    for (let x = 0; x <= width; x += 28 * ratio) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 0; y <= height; y += 24 * ratio) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    const active = time < pulseUntil;
    const frequencyScale = missionIndex === 2 ? 6 : currentFrequency() / 46;
    const amplitudeScale = missionIndex === 2 ? Math.max(0.12, air / 100) : currentAmplitude() / 3;
    const visualAmplitude = (active ? 0.36 : 0.12) * amplitudeScale * height;
    context.beginPath();
    for (let x = 0; x <= width; x += 2 * ratio) {
      const phase = (x / width) * Math.PI * 2 * frequencyScale + time * 0.008;
      const taper = Math.sin(Math.min(1, x / (width * 0.12)) * Math.PI / 2)
        * Math.sin(Math.min(1, (width - x) / (width * 0.12)) * Math.PI / 2);
      const y = height / 2 + Math.sin(phase) * visualAmplitude * taper;
      if (x === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.strokeStyle = cssVar('--scope');
    context.shadowColor = cssVar('--scope-soft');
    context.shadowBlur = 10 * ratio;
    context.lineWidth = 2.2 * ratio;
    context.stroke();
    context.shadowBlur = 0;
    animationFrame = requestAnimationFrame(drawWave);
  }

  el.tension.addEventListener('input', () => {
    tension = Number(el.tension.value);
    pluckedSinceChange = false;
    setStatus('readyPitch');
    render();
  });

  el.strength.addEventListener('input', () => {
    strength = Number(el.strength.value);
    pluckedSinceChange = false;
    setStatus('readyLoud');
    render();
  });

  el.pluck.addEventListener('click', pluckString);
  el.loudPluck.addEventListener('click', pluckString);
  el.ring.addEventListener('click', ringAlarm);

  el.pump.addEventListener('click', () => {
    air = Math.max(0, air - 25);
    rangAtVacuum = false;
    sound.click();
    setStatus('pumped', air === 0 ? 'good' : '', air);
    window.cool?.track?.('pump_air', { air });
    render();
  });

  el.refill.addEventListener('click', () => {
    air = 100;
    rangAtVacuum = false;
    sound.click();
    setStatus('refilled');
    render();
  });

  el.hint.addEventListener('click', () => {
    sound.click();
    setStatus(['hintPitch', 'hintLoud', 'hintVacuum'][missionIndex]);
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
    tension = 1;
    strength = 1;
    air = 100;
    pluckedSinceChange = false;
    rangAtVacuum = false;
    statusMessage = { key: 'readyPitch', args: [], tone: '' };
    render();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && sound.context?.state === 'running') sound.context.suspend().catch(() => {});
  });

  window.addEventListener('resize', fitCanvas);
  populateAirDots();
  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang }) {
      t = translate;
      language = lang;
      render();
    },
  });
  animationFrame = requestAnimationFrame(drawWave);
  window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame), { once: true });
})();
