(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '⛵ 小小港湾 · KidsLab',
      back: '返回平台',
      title: '小小港湾',
      eyebrow: '今天的港务证',
      tip0: '先装正好 4 箱货，再把一团泥变成会浮的小船。',
      routeCargo: '装货',
      routeClay: '造船',
      routeMaterials: '试水',
      waterline: '吃水线',
      hint: '给我一点提示',
      reset: '重做这一步',
      certEyebrow: '港务局特别颁发',
      certTitle: '小小浮力工程师',
      certText: '你用吃水线管住了货物，还让一块会沉的泥载着三颗螺丝帽漂起来了！',
      again: '再巡一次港',
      soundOn: '关闭音效',
      soundOff: '开启音效',
      stageLabels: ['1 · 装货码头', '2 · 橡皮泥船坞', '3 · 材料试水池'],
      stepCounts: ['任务 1 / 3', '任务 2 / 3', '任务 3 / 3'],
      titles: ['给渡船装 4 箱货', '把泥球变成小船', '先猜，再把材料扔下水'],
      descriptions: [
        '每加一箱，船会沉低一点。别让水漫过红色安全线！',
        '同一团橡皮泥，形状不同，排开的水也不同。',
        '材料和里面的空气都会影响整体沉浮。猜错也没关系，实验会告诉你。',
      ],
      cargoReadout: (n) => `<strong>${n} / 4</strong> 箱货物`,
      clayReadout: (shape, bolts) => shape === 'bowl'
        ? `<strong>碗形小船</strong> · ${bolts} / 3 颗螺丝帽`
        : '<strong>实心泥球</strong> · 还不能载货',
      materialReadout: (done, total) => `<strong>${done} / ${total}</strong> 件材料完成试水`,
      addCrate: '＋ 装一箱',
      unloadCrate: '－ 卸一箱',
      sail: '鸣笛出港',
      clayBall: '● 捏成实心球',
      clayBowl: '⏝ 捏成小碗',
      testClay: '放进水里',
      addBolt: '＋ 放一颗螺丝帽',
      predictFloat: '我猜会浮',
      predictSink: '我猜会沉',
      dropMaterial: '扑通！放进水',
      nextMaterial: '试下一个',
      cargoStart: '水面离安全线还远，先装一箱看看。',
      cargoOkay: '船下沉了一点，因为它要排开更多水来托住货物。',
      cargoTarget: '正好 4 箱！吃水线仍在安全范围，鸣笛出港吧。',
      cargoLight: '船长的清单要 4 箱，现在还少了一点。',
      cargoExtra: '5 箱还能浮，但超过今天的安全装载单。卸下一箱更稳妥。',
      cargoSunk: '咕嘟！第 6 箱让水漫进船舱了。卸货就能让船重新浮起来。',
      cargoSuccess: '任务完成：货物越重，船就要排开越多水，所以会坐得更低。',
      clayStart: '先试试实心泥球，再想办法让同一团泥浮起来。',
      clayChoose: '先选一种形状，再放进水里。',
      ballSinks: '泥球沉底了：它排开的水太少，托不起这团泥。',
      bowlFloats: '小碗浮起来了！中空形状包住空气，也排开了更多水。',
      needBowl: '先把泥捏成中空的小碗，才有地方放螺丝帽。',
      boltAdded: '小船又低了一点，但仍在排开足够的水。',
      claySuccess: '三颗都载住了！不是橡皮泥变轻了，是形状让整体更容易浮。',
      materialStart: (name) => `轮到${name}。先猜它会浮还是会沉。`,
      choosePrediction: '先按“会浮”或“会沉”，再做实验。',
      predictionSet: (guess) => `你猜它会${guess}。现在放进水里验证！`,
      materialRight: (name, result, why) => `猜对了！${name}${result}。${why}`,
      materialWrong: (name, result, why) => `这次和猜想不同：${name}${result}。${why}`,
      allMaterials: '四件材料都试过了：判断沉浮要看物体整体，而不能只看大小。',
      cargoHint: '盯住船身的红线：4 箱时红线还在水面上，6 箱时水会漫进去。',
      clayHint: '别换材料，只换形状。中空小碗能包住空气、排开更多水。',
      materialHint: '想想物体是实心的，还是包住了很多空气；但最后一定要用实验验证。',
      water: ['低', '较低', '安全', '危险', '进水'],
      materials: [
        { id: 'wood', name: '干木块', emoji: '🪵', result: '浮在水面', outcome: '浮', why: '这块干木头的平均密度比水小。' },
        { id: 'stone', name: '石头', emoji: '🪨', result: '沉到池底', outcome: '沉', why: '这块实心石头的平均密度比水大。' },
        { id: 'bolt', name: '钢制螺丝帽', emoji: '🔩', result: '沉到池底', outcome: '沉', why: '实心钢制零件比同体积的水重得多。' },
        { id: 'bottle', name: '密封空瓶', emoji: '🧴', result: '浮在水面', outcome: '浮', why: '瓶里包住的空气让整个瓶子的平均密度变小。' },
      ],
    },
    en: {
      doc: '⛵ Tiny Harbor · KidsLab',
      back: 'Back to platform',
      title: 'Tiny Harbor',
      eyebrow: "Today's harbor license",
      tip0: 'Load exactly 4 crates, then turn a lump of clay into a floating boat.',
      routeCargo: 'Load',
      routeClay: 'Build',
      routeMaterials: 'Test',
      waterline: 'Waterline',
      hint: 'Give me a hint',
      reset: 'Reset this step',
      certEyebrow: 'Special award from the harbor office',
      certTitle: 'Junior Buoyancy Engineer',
      certText: 'You kept cargo below the safety line and made sinking clay carry three metal nuts!',
      again: 'Patrol the harbor again',
      soundOn: 'Mute sound',
      soundOff: 'Turn sound on',
      stageLabels: ['1 · Cargo dock', '2 · Clay shipyard', '3 · Material test pool'],
      stepCounts: ['Mission 1 / 3', 'Mission 2 / 3', 'Mission 3 / 3'],
      titles: ['Load 4 crates on the ferry', 'Turn a clay ball into a boat', 'Predict, then splash-test it'],
      descriptions: [
        'Each crate makes the boat sit lower. Keep water below the red safety line!',
        'The same clay can push aside different amounts of water when its shape changes.',
        'The material and any trapped air affect the whole object. A wrong guess is a useful experiment.',
      ],
      cargoReadout: (n) => `<strong>${n} / 4</strong> cargo crates`,
      clayReadout: (shape, bolts) => shape === 'bowl'
        ? `<strong>Bowl-shaped boat</strong> · ${bolts} / 3 metal nuts`
        : '<strong>Solid clay ball</strong> · no cargo yet',
      materialReadout: (done, total) => `<strong>${done} / ${total}</strong> materials tested`,
      addCrate: '+ Load a crate',
      unloadCrate: '− Unload a crate',
      sail: 'Honk and sail',
      clayBall: '● Make a solid ball',
      clayBowl: '⏝ Make a bowl',
      testClay: 'Put it in the water',
      addBolt: '+ Add a metal nut',
      predictFloat: 'I predict: float',
      predictSink: 'I predict: sink',
      dropMaterial: 'Splash-test it!',
      nextMaterial: 'Test the next one',
      cargoStart: 'The water is far below the safety line. Load one crate and watch.',
      cargoOkay: 'The boat sits lower because it must displace more water to support the cargo.',
      cargoTarget: 'Exactly 4! The safety line is still above water. Honk and sail.',
      cargoLight: "The captain's list asks for 4 crates. You still need a few.",
      cargoExtra: 'Five still float, but that is over today’s safe cargo order. Unload one for a safer trip.',
      cargoSunk: 'Glug! The sixth crate lets water spill into the boat. Unload cargo to float again.',
      cargoSuccess: 'Mission complete: heavier cargo needs more displaced water, so the boat sits lower.',
      clayStart: 'Try the solid clay ball first. Then find a way to float the same lump of clay.',
      clayChoose: 'Choose a shape before putting it in the water.',
      ballSinks: 'The ball sank: it did not push aside enough water to support the clay.',
      bowlFloats: 'The bowl floats! Its hollow shape traps air and pushes aside more water.',
      needBowl: 'Make a hollow bowl first so there is somewhere to put the metal nuts.',
      boltAdded: 'The boat sits a little lower, but it still displaces enough water.',
      claySuccess: 'All three stay afloat! The clay did not get lighter—the new shape helps the whole object float.',
      materialStart: (name) => `${name} is next. Predict whether it will float or sink.`,
      choosePrediction: 'Choose “float” or “sink” before running the test.',
      predictionSet: (guess) => `You predict it will ${guess}. Now test it in the water!`,
      materialRight: (name, result, why) => `Correct! ${name} ${result}. ${why}`,
      materialWrong: (name, result, why) => `Different from the prediction: ${name} ${result}. ${why}`,
      allMaterials: 'All four are tested: judge the whole object, not only its size.',
      cargoHint: 'Watch the red line on the hull: it stays above water with 4 crates, but floods with 6.',
      clayHint: 'Keep the same material and change only its shape. A hollow bowl traps air and displaces more water.',
      materialHint: 'Ask whether it is solid or holds lots of air—but always test the prediction.',
      water: ['Low', 'Lower', 'Safe', 'Danger', 'Flooded'],
      materials: [
        { id: 'wood', name: 'dry wood block', emoji: '🪵', result: 'floats', outcome: 'float', why: 'This dry wood is less dense on average than water.' },
        { id: 'stone', name: 'stone', emoji: '🪨', result: 'sinks to the bottom', outcome: 'sink', why: 'This solid stone is denser on average than water.' },
        { id: 'bolt', name: 'steel nut', emoji: '🔩', result: 'sinks to the bottom', outcome: 'sink', why: 'A solid steel part is much heavier than the same volume of water.' },
        { id: 'bottle', name: 'sealed empty bottle', emoji: '🧴', result: 'floats', outcome: 'float', why: 'The trapped air lowers the average density of the whole bottle.' },
      ],
    },
  };

  const els = {
    lang: document.getElementById('langBtn'),
    theme: document.getElementById('themeBtn'),
    sound: document.getElementById('soundBtn'),
    canvas: document.getElementById('harborCanvas'),
    route: document.getElementById('route'),
    label: document.getElementById('stageLabel'),
    waterMeter: document.getElementById('waterMeter'),
    waterline: document.getElementById('waterlineValue'),
    master: document.getElementById('harborMaster'),
    stepCount: document.getElementById('stepCount'),
    title: document.getElementById('missionTitle'),
    text: document.getElementById('missionText'),
    readout: document.getElementById('readout'),
    controls: document.getElementById('controls'),
    feedback: document.getElementById('feedback'),
    hint: document.getElementById('hintBtn'),
    reset: document.getElementById('resetBtn'),
    celebration: document.getElementById('celebration'),
    again: document.getElementById('againBtn'),
  };

  const STEPS = ['cargo', 'clay', 'materials'];
  const SAVE_KEY = 'kidslab.tiny-harbor';
  const MUTE_KEY = 'kidslab.sound.muted';
  const ctx = els.canvas.getContext('2d');
  let t = (key) => key;
  let lang = window.cool.preferences.lang;
  let audioContext = null;
  let muted = localStorage.getItem(MUTE_KEY) === 'true';
  let hintTimer = 0;
  let animationFrame = 0;

  const state = {
    step: 'cargo',
    cargo: 0,
    shape: 'ball',
    testedShape: '',
    bolts: 0,
    materialIndex: 0,
    prediction: '',
    materialTested: false,
    materialResults: [],
    feedbackKey: 'cargoStart',
    feedbackType: '',
    splash: 0,
  };

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        step: state.step,
        materialResults: state.materialResults,
      }));
    } catch {}
  }

  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      if (!saved || !STEPS.includes(saved.step)) return;
      state.step = saved.step;
      state.materialResults = Array.isArray(saved.materialResults) ? saved.materialResults.slice(0, 4) : [];
      if (state.step === 'materials') state.materialIndex = Math.min(state.materialResults.length, 3);
      state.feedbackKey = state.step === 'cargo' ? 'cargoStart' : state.step === 'clay' ? 'clayStart' : 'materialStart';
    } catch {}
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function stepIndex() {
    return Math.max(0, STEPS.indexOf(state.step));
  }

  function currentMaterial() {
    return t('materials')[state.materialIndex];
  }

  function ensureAudio() {
    if (muted) return null;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      audioContext ||= new AudioCtor();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      return audioContext;
    } catch {
      return null;
    }
  }

  function tone(kind) {
    const ac = ensureAudio();
    if (!ac) return;
    const patterns = {
      tap: [[310, 0, 0.07, 0.06]],
      plop: [[190, 0, 0.12, 0.08], [125, 0.08, 0.14, 0.06]],
      correct: [[440, 0, 0.09, 0.07], [660, 0.1, 0.14, 0.08]],
      wrong: [[210, 0, 0.12, 0.08], [150, 0.11, 0.17, 0.07]],
      complete: [[392, 0, 0.12, 0.07], [523, 0.11, 0.14, 0.08], [659, 0.23, 0.2, 0.09]],
    };
    const now = ac.currentTime;
    for (const [frequency, offset, duration, volume] of patterns[kind] || patterns.tap) {
      const oscillator = ac.createOscillator();
      const gain = ac.createGain();
      oscillator.type = kind === 'wrong' ? 'square' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(volume, now + offset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
      oscillator.connect(gain).connect(ac.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration + 0.02);
    }
  }

  function updateSoundButton() {
    els.sound.textContent = muted ? '🔇' : '🔊';
    els.sound.setAttribute('aria-pressed', String(muted));
    els.sound.setAttribute('aria-label', t(muted ? 'soundOff' : 'soundOn'));
    els.sound.title = t(muted ? 'soundOff' : 'soundOn');
  }

  function setFeedback(key, type = '') {
    state.feedbackKey = key;
    state.feedbackType = type;
    renderFeedback();
    scheduleHint();
  }

  function renderFeedback() {
    let message;
    if (state.feedbackKey === 'materialStart') message = t('materialStart', currentMaterial().name);
    else if (state.feedbackKey === 'predictionSet') message = t('predictionSet', state.prediction);
    else if (state.feedbackKey === 'materialRight' || state.feedbackKey === 'materialWrong') {
      const material = currentMaterial();
      message = t(state.feedbackKey, material.name, material.result, material.why);
    }
    else message = t(state.feedbackKey);
    els.feedback.textContent = message;
    els.feedback.className = `feedback${state.feedbackType ? ` is-${state.feedbackType}` : ''}`;
  }

  function renderRoute() {
    const active = stepIndex();
    [...els.route.children].forEach((item, index) => {
      item.classList.toggle('is-active', index === active);
      item.classList.toggle('is-done', index < active);
    });
  }

  function button(label, action, className = 'primary', disabled = false) {
    return `<button class="${className}" type="button" data-action="${action}"${disabled ? ' disabled' : ''}>${label}</button>`;
  }

  function renderControls() {
    if (state.step === 'cargo') {
      els.readout.innerHTML = t('cargoReadout', state.cargo);
      els.controls.innerHTML = [
        button(t('addCrate'), 'add-cargo', 'primary', state.cargo >= 6),
        button(t('unloadCrate'), 'remove-cargo', 'secondary', state.cargo === 0),
        button(t('sail'), 'sail', 'material-choice', false),
      ].join('');
      return;
    }

    if (state.step === 'clay') {
      els.readout.innerHTML = t('clayReadout', state.shape, state.bolts);
      els.controls.innerHTML = [
        button(t('clayBall'), 'shape-ball', `choice${state.shape === 'ball' ? ' is-selected' : ''}`),
        button(t('clayBowl'), 'shape-bowl', `choice${state.shape === 'bowl' ? ' is-selected' : ''}`),
        button(t('testClay'), 'test-clay', 'primary'),
        button(t('addBolt'), 'add-bolt', 'material-choice', state.testedShape !== 'bowl' || state.bolts >= 3),
      ].join('');
      return;
    }

    const material = currentMaterial();
    const testedCount = state.materialResults.length + (state.materialTested ? 1 : 0);
    els.readout.innerHTML = t('materialReadout', testedCount, t('materials').length);
    els.controls.innerHTML = `
      <div class="material-card"><span class="emoji">${material.emoji}</span><span>${material.name}</span></div>
      ${button(t('predictFloat'), 'predict-float', `choice${state.prediction === 'float' || state.prediction === '浮' ? ' is-selected' : ''}`, state.materialTested)}
      ${button(t('predictSink'), 'predict-sink', `choice${state.prediction === 'sink' || state.prediction === '沉' ? ' is-selected' : ''}`, state.materialTested)}
      ${state.materialTested
        ? button(t('nextMaterial'), 'next-material', 'material-choice')
        : button(t('dropMaterial'), 'drop-material', 'primary', !state.prediction)}
    `;
  }

  function render() {
    const index = stepIndex();
    els.label.textContent = t('stageLabels')[index];
    els.stepCount.textContent = t('stepCounts')[index];
    els.title.textContent = t('titles')[index];
    els.text.textContent = t('descriptions')[index];
    els.waterMeter.hidden = state.step === 'materials';
    renderRoute();
    renderControls();
    renderFeedback();
    updateSoundButton();
    drawHarbor(performance.now());
  }

  function completeStep(next) {
    state.step = next;
    state.feedbackKey = next === 'clay' ? 'clayStart' : 'materialStart';
    state.feedbackType = '';
    save();
    window.cool.stage(`${next}-mission`);
    tone('complete');
    render();
    scheduleHint();
  }

  function handleCargo(action) {
    if (action === 'add-cargo' && state.cargo < 6) {
      state.cargo += 1;
      state.splash = 1;
      tone(state.cargo === 6 ? 'wrong' : 'tap');
      if (state.cargo === 6) {
        setFeedback('cargoSunk', 'bad');
        els.master.classList.add('is-alarmed');
        setTimeout(() => els.master.classList.remove('is-alarmed'), 900);
        window.cool.track('overload-cargo-boat');
      } else if (state.cargo === 4) setFeedback('cargoTarget', 'good');
      else if (state.cargo === 5) setFeedback('cargoExtra');
      else setFeedback('cargoOkay');
    }

    if (action === 'remove-cargo' && state.cargo > 0) {
      state.cargo -= 1;
      tone('tap');
      if (state.cargo === 4) setFeedback('cargoTarget', 'good');
      else if (state.cargo === 0) setFeedback('cargoStart');
      else setFeedback('cargoOkay');
      window.cool.track('unload-cargo');
    }

    if (action === 'sail') {
      if (state.cargo === 4) {
        setFeedback('cargoSuccess', 'good');
        window.cool.track('sail-safe-cargo');
        setTimeout(() => completeStep('clay'), 550);
      } else {
        tone('wrong');
        setFeedback(state.cargo < 4 ? 'cargoLight' : state.cargo === 6 ? 'cargoSunk' : 'cargoExtra', 'bad');
      }
    }
    renderControls();
  }

  function handleClay(action) {
    if (action === 'shape-ball' || action === 'shape-bowl') {
      state.shape = action === 'shape-ball' ? 'ball' : 'bowl';
      state.testedShape = '';
      state.bolts = 0;
      tone('tap');
      setFeedback('clayChoose');
      window.cool.track('shape-clay', { shape: state.shape });
    }

    if (action === 'test-clay') {
      state.testedShape = state.shape;
      state.splash = 1;
      if (state.shape === 'ball') {
        tone('plop');
        setFeedback('ballSinks', 'bad');
        window.cool.track('sink-clay-ball');
      } else {
        tone('correct');
        setFeedback('bowlFloats', 'good');
        window.cool.track('float-clay-bowl');
      }
    }

    if (action === 'add-bolt') {
      if (state.testedShape !== 'bowl') {
        tone('wrong');
        setFeedback('needBowl', 'bad');
      } else if (state.bolts < 3) {
        state.bolts += 1;
        state.splash = 0.7;
        tone(state.bolts === 3 ? 'complete' : 'tap');
        if (state.bolts === 3) {
          setFeedback('claySuccess', 'good');
          window.cool.track('load-clay-boat');
          setTimeout(() => completeStep('materials'), 700);
        } else setFeedback('boltAdded', 'good');
      }
    }
    renderControls();
  }

  function handleMaterials(action) {
    const material = currentMaterial();
    if (action === 'predict-float' || action === 'predict-sink') {
      state.prediction = lang === 'zh'
        ? (action === 'predict-float' ? '浮' : '沉')
        : (action === 'predict-float' ? 'float' : 'sink');
      tone('tap');
      setFeedback('predictionSet');
      window.cool.track('predict-material', { material: material.id, prediction: action.slice(8) });
    }

    if (action === 'drop-material') {
      if (!state.prediction) {
        tone('wrong');
        setFeedback('choosePrediction', 'bad');
        return;
      }
      state.materialTested = true;
      state.splash = 1;
      const correct = state.prediction === material.outcome;
      state.feedbackKey = correct ? 'materialRight' : 'materialWrong';
      state.feedbackType = correct ? 'good' : 'bad';
      renderFeedback();
      tone(correct ? 'correct' : 'wrong');
      window.cool.track('test-material', { material: material.id, correct });
    }

    if (action === 'next-material' && state.materialTested) {
      state.materialResults.push(material.id);
      if (state.materialIndex >= t('materials').length - 1) {
        save();
        tone('complete');
        setFeedback('allMaterials', 'good');
        window.cool.complete?.();
        setTimeout(() => { els.celebration.hidden = false; }, 450);
      } else {
        state.materialIndex += 1;
        state.prediction = '';
        state.materialTested = false;
        state.feedbackKey = 'materialStart';
        state.feedbackType = '';
        save();
        tone('tap');
      }
    }
    renderControls();
  }

  function handleAction(action) {
    ensureAudio();
    if (state.step === 'cargo') handleCargo(action);
    else if (state.step === 'clay') handleClay(action);
    else handleMaterials(action);
    render();
  }

  function resetStep() {
    if (state.step === 'cargo') {
      state.cargo = 0;
      state.feedbackKey = 'cargoStart';
    } else if (state.step === 'clay') {
      state.shape = 'ball';
      state.testedShape = '';
      state.bolts = 0;
      state.feedbackKey = 'clayStart';
    } else {
      state.prediction = '';
      state.materialTested = false;
      state.feedbackKey = 'materialStart';
    }
    state.feedbackType = '';
    tone('tap');
    render();
    scheduleHint();
    window.cool.track('reset-harbor-mission', { step: state.step });
  }

  function showHint() {
    const key = state.step === 'cargo' ? 'cargoHint' : state.step === 'clay' ? 'clayHint' : 'materialHint';
    setFeedback(key);
    tone('tap');
    window.cool.track('open-harbor-hint', { step: state.step });
  }

  function scheduleHint() {
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      const key = state.step === 'cargo' ? 'cargoHint' : state.step === 'clay' ? 'clayHint' : 'materialHint';
      if (!state.feedbackType) {
        state.feedbackKey = key;
        renderFeedback();
      }
    }, 30000);
  }

  function waterLevel() {
    if (state.step === 'cargo') return Math.min(4, Math.floor(state.cargo / 1.5));
    if (state.step === 'clay') {
      if (state.testedShape === 'ball') return 4;
      if (state.testedShape === 'bowl') return Math.min(3, 1 + state.bolts);
      return 0;
    }
    return currentMaterial().outcome === (lang === 'zh' ? '沉' : 'sink') && state.materialTested ? 4 : 1;
  }

  function roundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
  }

  function drawCloud(x, y, scale) {
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.beginPath();
    ctx.arc(x, y, 24 * scale, 0, Math.PI * 2);
    ctx.arc(x + 27 * scale, y - 10 * scale, 30 * scale, 0, Math.PI * 2);
    ctx.arc(x + 58 * scale, y, 23 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCargoBoat(width, height, time) {
    const cx = width * 0.47;
    const waterY = height * 0.59;
    const sink = state.cargo * height * 0.013;
    const bob = Math.sin(time / 650) * 2;
    const y = waterY - height * 0.09 + sink + bob;
    ctx.save();
    if (state.cargo >= 6) ctx.rotate(0.08);
    ctx.translate(cx, y);
    ctx.fillStyle = cssVar('--boat');
    ctx.strokeStyle = cssVar('--line-strong');
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-width * 0.19, 0);
    ctx.lineTo(width * 0.18, 0);
    ctx.lineTo(width * 0.13, height * 0.12);
    ctx.quadraticCurveTo(0, height * 0.17, -width * 0.14, height * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = cssVar('--sail');
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-width * 0.16, height * 0.047);
    ctx.lineTo(width * 0.15, height * 0.047);
    ctx.stroke();

    ctx.strokeStyle = cssVar('--line-strong');
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-width * 0.03, 0);
    ctx.lineTo(-width * 0.03, -height * 0.18);
    ctx.stroke();
    ctx.fillStyle = cssVar('--sail');
    ctx.beginPath();
    ctx.moveTo(-width * 0.025, -height * 0.17);
    ctx.lineTo(width * 0.095, -height * 0.08);
    ctx.lineTo(-width * 0.025, -height * 0.045);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const crateSize = Math.min(38, width * 0.055);
    for (let i = 0; i < state.cargo; i += 1) {
      const column = i % 3;
      const row = Math.floor(i / 3);
      const x = -crateSize * 1.15 + column * crateSize * 1.14;
      const crateY = -crateSize * 0.45 - row * crateSize * 0.92;
      ctx.fillStyle = '#d98a3b';
      ctx.strokeStyle = cssVar('--line-strong');
      ctx.lineWidth = 2.5;
      roundedRect(ctx, x, crateY, crateSize, crateSize * 0.8, 4);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 5, crateY + 4);
      ctx.lineTo(x + crateSize - 5, crateY + crateSize * 0.8 - 4);
      ctx.moveTo(x + crateSize - 5, crateY + 4);
      ctx.lineTo(x + 5, crateY + crateSize * 0.8 - 4);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawClay(width, height, time) {
    const waterY = height * 0.6;
    const cx = width * 0.5;
    ctx.save();
    ctx.translate(cx, waterY);
    ctx.strokeStyle = cssVar('--line-strong');
    ctx.lineWidth = 4;
    ctx.fillStyle = cssVar('--clay');

    if (state.shape === 'ball') {
      const sunk = state.testedShape === 'ball' ? height * 0.25 : -height * 0.1;
      ctx.beginPath();
      ctx.arc(0, sunk, Math.min(52, width * 0.08), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-15, sunk - 11, 4, 0, Math.PI * 2);
      ctx.arc(12, sunk - 17, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fill();
    } else {
      const floatY = state.testedShape === 'bowl' ? state.bolts * height * 0.017 + Math.sin(time / 600) * 2 : -height * 0.11;
      ctx.translate(0, floatY);
      ctx.beginPath();
      ctx.moveTo(-width * 0.15, -height * 0.05);
      ctx.quadraticCurveTo(-width * 0.11, height * 0.095, 0, height * 0.11);
      ctx.quadraticCurveTo(width * 0.11, height * 0.095, width * 0.15, -height * 0.05);
      ctx.quadraticCurveTo(width * 0.09, -height * 0.005, 0, 0);
      ctx.quadraticCurveTo(-width * 0.09, -height * 0.005, -width * 0.15, -height * 0.05);
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < state.bolts; i += 1) {
        const x = (i - 1) * 42;
        ctx.fillStyle = cssVar('--stone');
        ctx.beginPath();
        ctx.arc(x, 8, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = cssVar('--card');
        ctx.beginPath();
        ctx.arc(x, 8, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawMaterial(width, height, time) {
    const material = currentMaterial();
    const isSink = material.outcome === (lang === 'zh' ? '沉' : 'sink');
    const waterY = height * 0.58;
    const targetY = state.materialTested ? (isSink ? height * 0.79 : waterY - 18 + Math.sin(time / 550) * 3) : height * 0.39;
    ctx.save();
    ctx.translate(width * 0.5, targetY);
    ctx.font = `${Math.min(74, width * 0.11)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(material.emoji, 0, 0);
    ctx.restore();
  }

  function drawHarbor(time) {
    const rect = els.canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    if (els.canvas.width !== width * ratio || els.canvas.height !== height * ratio) {
      els.canvas.width = width * ratio;
      els.canvas.height = height * ratio;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.62);
    sky.addColorStop(0, cssVar('--sky-top'));
    sky.addColorStop(1, cssVar('--sky-bottom'));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    drawCloud(width * 0.1, height * 0.15, 0.75);
    drawCloud(width * 0.65, height * 0.1, 0.55);

    ctx.fillStyle = cssVar('--sand');
    ctx.beginPath();
    ctx.moveTo(0, height * 0.51);
    ctx.quadraticCurveTo(width * 0.18, height * 0.46, width * 0.34, height * 0.54);
    ctx.lineTo(width * 0.38, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    const waterY = height * 0.57;
    const water = ctx.createLinearGradient(0, waterY, 0, height);
    water.addColorStop(0, cssVar('--water-top'));
    water.addColorStop(1, cssVar('--water-bottom'));
    ctx.fillStyle = water;
    ctx.fillRect(0, waterY, width, height - waterY);

    ctx.strokeStyle = cssVar('--water-glint');
    ctx.lineWidth = 3;
    for (let row = 0; row < 5; row += 1) {
      ctx.beginPath();
      const y = waterY + 14 + row * 28;
      for (let x = -20; x < width + 30; x += 32) {
        const wave = Math.sin((x + time * 0.05 + row * 23) / 28) * 3;
        ctx.moveTo(x, y + wave);
        ctx.lineTo(x + 17, y + wave);
      }
      ctx.stroke();
    }

    ctx.fillStyle = cssVar('--dock');
    ctx.strokeStyle = cssVar('--line-strong');
    ctx.lineWidth = 4;
    ctx.fillRect(0, height * 0.46, width * 0.26, height * 0.09);
    ctx.strokeRect(-2, height * 0.46, width * 0.26 + 2, height * 0.09);
    for (let x = 15; x < width * 0.26; x += 48) {
      ctx.fillRect(x, height * 0.5, 14, height * 0.28);
      ctx.strokeRect(x, height * 0.5, 14, height * 0.28);
    }

    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = cssVar('--coral') || '#ff667a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width * 0.31, waterY + height * 0.08);
    ctx.lineTo(width * 0.72, waterY + height * 0.08);
    ctx.stroke();
    ctx.setLineDash([]);

    if (state.step === 'cargo') drawCargoBoat(width, height, time);
    else if (state.step === 'clay') drawClay(width, height, time);
    else drawMaterial(width, height, time);

    state.splash = Math.max(0, state.splash - 0.035);
    if (state.splash > 0) {
      ctx.strokeStyle = cssVar('--sail');
      ctx.globalAlpha = state.splash;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(width * 0.5, waterY + 14, 70 * (1.2 - state.splash), 15 * (1.2 - state.splash), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    els.waterline.textContent = t('water')[waterLevel()];
  }

  function animate(time) {
    drawHarbor(time);
    animationFrame = requestAnimationFrame(animate);
  }

  els.controls.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (target && !target.disabled) handleAction(target.dataset.action);
  });

  els.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  els.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  els.sound.addEventListener('click', () => {
    muted = !muted;
    localStorage.setItem(MUTE_KEY, String(muted));
    if (!muted) tone('tap');
    updateSoundButton();
  });
  els.hint.addEventListener('click', showHint);
  els.reset.addEventListener('click', resetStep);
  els.again.addEventListener('click', () => {
    Object.assign(state, {
      step: 'cargo',
      cargo: 0,
      shape: 'ball',
      testedShape: '',
      bolts: 0,
      materialIndex: 0,
      prediction: '',
      materialTested: false,
      materialResults: [],
      feedbackKey: 'cargoStart',
      feedbackType: '',
      splash: 0,
    });
    els.celebration.hidden = true;
    save();
    render();
  });

  window.addEventListener('resize', render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else if (!animationFrame) {
      animationFrame = requestAnimationFrame(animate);
    }
  });

  restore();
  window.cool.bindI18n(I18N, {
    onChange(context) {
      t = context.t;
      lang = context.lang;
      document.title = t('doc');
      els.lang.textContent = lang === 'zh' ? 'EN' : '中';
      els.theme.textContent = context.theme === 'light' ? '🌙' : '☀️';
      if (state.prediction) {
        const predictsFloat = state.prediction === 'float' || state.prediction === '浮';
        state.prediction = lang === 'zh' ? (predictsFloat ? '浮' : '沉') : (predictsFloat ? 'float' : 'sink');
      }
      render();
    },
  });
  scheduleHint();
  animationFrame = requestAnimationFrame(animate);
})();
