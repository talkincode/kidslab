import * as THREE from './vendor/three.module.min.js';

(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '植物生长实验室 · KidsLab',
      back: '返回平台',
      title: '植物生长实验室',
      day: '实验日',
      stage: '阶段',
      growth: '生长',
      health: '健康',
      choosePlant: '选择植物',
      environment: '环境参数',
      light: '光照',
      humidity: '湿度',
      temperature: '温度',
      nutrients: '养分',
      water: '浇水',
      fertilize: '施肥',
      timeMachine: '时间加快装置',
      jump: '快进',
      jumpBtn: '推进时间',
      reset: '重置',
      journal: '实验日志',
      soundOn: '声音开',
      soundOff: '静音',
      nogl: '你的浏览器暂不支持 WebGL。',
      stages: ['种子', '发芽', '幼苗', '伸长期', '花芽', '开花', '结果'],
      stable: '环境稳定，植物正在积累能量。',
      dry: '湿度偏低，叶片边缘开始失水。',
      wet: '湿度过高，土壤缺氧会让根系变慢。',
      dark: '光照不足，茎会变细并向灯光伸长。',
      heat: '温度偏高，蒸腾太快，健康值正在下降。',
      cold: '温度偏低，细胞分裂速度明显变慢。',
      hungry: '养分不足，新叶颜色会变浅。',
      burned: '肥料过量，根部出现烧苗风险。',
      watered: '浇水后，空气和土壤湿度上升。',
      fed: '肥料颗粒进入土壤，养分开始释放。',
      resetLog: '实验重置，种子回到新鲜土壤中。',
      jumped: (d) => `时间推进 ${d} 天。`,
      soundEnabled: '声音已开启：浇水、施肥和阶段变化会有反馈。',
      plantNames: { pea: '豌豆', sunflower: '向日葵', tomato: '番茄' },
      plantLog: (name) => `选择了${name}，实验从第 0 天开始。`,
      stageLog: (stage) => `观察到阶段变化：${stage}。`,
      jumpDays: (d) => `${d}天`,
      dayValue: (d) => `${d.toFixed(1)}`,
    },
    en: {
      doc: 'Plant Growth Lab · KidsLab',
      back: 'Back to platform',
      title: 'Plant Growth Lab',
      day: 'Lab day',
      stage: 'Stage',
      growth: 'Growth',
      health: 'Health',
      choosePlant: 'Choose a plant',
      environment: 'Environment',
      light: 'Light',
      humidity: 'Humidity',
      temperature: 'Temperature',
      nutrients: 'Nutrients',
      water: 'Water',
      fertilize: 'Fertilize',
      timeMachine: 'Time accelerator',
      jump: 'Jump',
      jumpBtn: 'Advance time',
      reset: 'Reset',
      journal: 'Journal',
      soundOn: 'Sound on',
      soundOff: 'Muted',
      nogl: 'WebGL is unavailable in this browser.',
      stages: ['Seed', 'Germination', 'Seedling', 'Vegetative', 'Budding', 'Flowering', 'Fruiting'],
      stable: 'The environment is steady and the plant is storing energy.',
      dry: 'Humidity is low. Leaf edges are losing water.',
      wet: 'Humidity is too high. The roots are slowing down.',
      dark: 'Light is low. The stem grows thin and reaches upward.',
      heat: 'Temperature is high. Fast transpiration is lowering health.',
      cold: 'Temperature is low. Cell division slows down.',
      hungry: 'Nutrients are low. New leaves grow pale.',
      burned: 'Too much fertilizer. Roots are at risk of burn.',
      watered: 'Watering raised air and soil moisture.',
      fed: 'Fertilizer pellets entered the soil and started releasing nutrients.',
      resetLog: 'Experiment reset. The seed is back in fresh soil.',
      jumped: (d) => `Advanced ${d} days.`,
      soundEnabled: 'Sound is on: watering, feeding, and stage changes now respond.',
      plantNames: { pea: 'Pea', sunflower: 'Sunflower', tomato: 'Tomato' },
      plantLog: (name) => `${name} selected. The experiment starts at day 0.`,
      stageLog: (stage) => `Stage changed: ${stage}.`,
      jumpDays: (d) => `${d}d`,
      dayValue: (d) => `${d.toFixed(1)}`,
    },
  };

  const SPECIES = {
    pea: {
      key: 'pea',
      emoji: '🌱',
      maturity: 38,
      maxHeight: 2.25,
      stemColor: 0x60a35d,
      leafColor: 0x51a756,
      leafAccent: 0xa8da75,
      flowerColor: 0xf2f0ff,
      fruitColor: 0x5dbd50,
      ideal: { light: 62, humidity: 62, temperature: 21, nutrients: 52 },
      range: {
        light: [35, 72, 92],
        humidity: [44, 62, 78],
        temperature: [10, 21, 31],
        nutrients: [24, 52, 82],
      },
      leafPairs: 8,
    },
    sunflower: {
      key: 'sunflower',
      emoji: '🌻',
      maturity: 58,
      maxHeight: 3.85,
      stemColor: 0x547c36,
      leafColor: 0x4b8c3e,
      leafAccent: 0x9bc75e,
      flowerColor: 0xffc740,
      fruitColor: 0x5d3b20,
      ideal: { light: 82, humidity: 50, temperature: 25, nutrients: 58 },
      range: {
        light: [58, 84, 100],
        humidity: [35, 50, 72],
        temperature: [14, 25, 35],
        nutrients: [30, 58, 84],
      },
      leafPairs: 10,
    },
    tomato: {
      key: 'tomato',
      emoji: '🍅',
      maturity: 50,
      maxHeight: 2.95,
      stemColor: 0x4f8b43,
      leafColor: 0x3f8a45,
      leafAccent: 0x92bf63,
      flowerColor: 0xffdc46,
      fruitColor: 0xd64232,
      ideal: { light: 76, humidity: 56, temperature: 24, nutrients: 64 },
      range: {
        light: [50, 76, 95],
        humidity: [42, 56, 76],
        temperature: [13, 24, 34],
        nutrients: [36, 64, 86],
      },
      leafPairs: 11,
    },
  };

  const SPEEDS = [0, 1, 10, 50, 200];
  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme', sound: 'kidslab.plantLab.sound' };
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => {
    const t = clamp((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  };

  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  };
  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme !== 'light' && theme !== 'dark') theme = 'light';
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  const plantName = (key) => t('plantNames')[key] ?? key;

  const ui = {
    langBtn: $('langBtn'),
    themeBtn: $('themeBtn'),
    soundBtn: $('soundBtn'),
    dayRead: $('dayRead'),
    stageRead: $('stageRead'),
    growthRead: $('growthRead'),
    healthRead: $('healthRead'),
    diagnosis: $('diagnosis'),
    plantBadge: $('plantBadge'),
    speedBadge: $('speedBadge'),
    plantChoices: $('plantChoices'),
    speedChoices: $('speedChoices'),
    journal: $('journal'),
    light: $('light'),
    humidity: $('humidity'),
    temperature: $('temperature'),
    nutrients: $('nutrients'),
    lightOut: $('lightOut'),
    humidityOut: $('humidityOut'),
    tempOut: $('tempOut'),
    nutrientOut: $('nutrientOut'),
    waterBtn: $('waterBtn'),
    fertilizeBtn: $('fertilizeBtn'),
    jumpDays: $('jumpDays'),
    jumpOut: $('jumpOut'),
    jumpBtn: $('jumpBtn'),
    resetBtn: $('resetBtn'),
  };

  const state = {
    species: 'sunflower',
    day: 0,
    biomass: 0.015,
    health: 100,
    light: 72,
    humidity: 58,
    temperature: 24,
    nutrients: 42,
    speed: 10,
    lastStage: 0,
    waterFlash: 0,
    fertilizerFlash: 0,
    sound: store.get(LS.sound) !== 'off',
    journal: [],
  };

  const canvas = $('scene');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch {
    $('nogl').hidden = false;
    canvas.remove();
    return;
  }

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.physicallyCorrectLights = true;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xd9e8dc);
  scene.fog = new THREE.Fog(0xd9e8dc, 11, 26);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 90);
  const root = new THREE.Group();
  const lab = new THREE.Group();
  const plantAnchor = new THREE.Group();
  const effectAnchor = new THREE.Group();
  scene.add(root);
  root.add(lab, plantAnchor, effectAnchor);

  const clock = new THREE.Clock();
  const pointer = { down: false, x: 0, y: 0 };
  const orbit = { yaw: -0.42, pitch: 0.36, dist: 10.2, targetYaw: -0.42, targetPitch: 0.36, targetDist: 10.2 };
  const particles = [];
  const fertilizerPellets = [];
  const leafLines = [];
  let audioCtx = null;
  let audioUnlocked = false;

  const hemi = new THREE.HemisphereLight(0xf9fff1, 0x466246, 0.62);
  const sun = new THREE.DirectionalLight(0xfff7d6, 2.25);
  sun.position.set(-3.4, 5.7, 4.8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(3072, 3072);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 22;
  sun.shadow.camera.left = -8;
  sun.shadow.camera.right = 8;
  sun.shadow.camera.top = 8;
  sun.shadow.camera.bottom = -8;
  const growLight = new THREE.SpotLight(0xffe8aa, 8, 10, Math.PI / 6.2, 0.62, 1.2);
  growLight.position.set(4.15, 5.38, -2.78);
  growLight.target.position.set(0, 1.55, 0);
  growLight.castShadow = true;
  growLight.shadow.mapSize.set(1024, 1024);
  const bounce = new THREE.DirectionalLight(0xa6d7ff, 0.55);
  bounce.position.set(4, 3.8, 5);
  scene.add(hemi, sun, growLight, growLight.target, bounce);

  const textures = {
    soil: makeCanvasTexture(512, paintSoil),
    pot: makeCanvasTexture(512, paintPot),
    leaf: makeCanvasTexture(512, paintLeaf),
    stem: makeCanvasTexture(384, paintStem),
    petal: makeCanvasTexture(256, paintPetal),
    mist: makeSoftCircleTexture(96, 'rgba(230,255,255,1)'),
  };

  const materials = {
    bench: new THREE.MeshStandardMaterial({ color: 0x9a6a43, roughness: 0.66, metalness: 0.04 }),
    backWall: new THREE.MeshStandardMaterial({ color: 0xd5dfd0, roughness: 0.92 }),
    pot: new THREE.MeshStandardMaterial({ color: 0xbd6646, map: textures.pot, roughness: 0.78 }),
    soil: new THREE.MeshStandardMaterial({ color: 0x3f2b1d, map: textures.soil, roughness: 0.96 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xd8f7ff,
      transparent: true,
      opacity: 0.22,
      roughness: 0.04,
      transmission: 0.35,
      thickness: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    metal: new THREE.MeshStandardMaterial({ color: 0x879188, roughness: 0.42, metalness: 0.58 }),
    lamp: new THREE.MeshStandardMaterial({ color: 0xffd568, emissive: 0xffb22f, emissiveIntensity: 1.2, roughness: 0.36 }),
    water: new THREE.MeshPhysicalMaterial({ color: 0x9bdff6, transparent: true, opacity: 0.45, roughness: 0.08, transmission: 0.15, depthWrite: false }),
    droplet: new THREE.MeshPhysicalMaterial({ color: 0xb9f0ff, transparent: true, opacity: 0.68, roughness: 0.02, transmission: 0.42, depthWrite: false }),
    fertilizer: new THREE.MeshStandardMaterial({ color: 0xd7b36a, roughness: 0.84 }),
  };

  let potGroup;
  let soilMesh;
  let plantGroup = new THREE.Group();
  let mistPoints;
  let lampBulb;
  let waterDisk;
  let lastVisualBiomass = -1;
  let lastVisualStage = -1;

  initLab();
  plantAnchor.add(plantGroup);
  makeMist();
  buildControls();
  resetExperiment('sunflower', false);
  applyLang();
  applyTheme();
  bindEvents();
  resize();
  requestAnimationFrame(tick);

  function initLab() {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.48, 7.2), materials.bench);
    bench.position.set(0, -0.38, 0);
    bench.receiveShadow = true;
    lab.add(bench);

    const wall = new THREE.Mesh(new THREE.BoxGeometry(13, 7.2, 0.2), materials.backWall);
    wall.position.set(0, 2.85, -3.65);
    wall.receiveShadow = true;
    lab.add(wall);

    const shelf = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.16, 0.72), materials.bench);
    shelf.position.set(0, 3.45, -3.16);
    shelf.castShadow = true;
    lab.add(shelf);

    for (let i = 0; i < 5; i++) {
      const jar = makeJar(0.24 + i * 0.02, 0.58 + (i % 2) * 0.18, [0x9ad5be, 0xffd99a, 0xaec7e8, 0xd9b78e, 0xcedd9a][i]);
      jar.position.set(-3.8 + i * 1.1, 3.92, -3.15);
      lab.add(jar);
    }

    potGroup = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 0.82, 1.16, 56, 1, true), materials.pot);
    pot.position.y = 0.28;
    pot.castShadow = true;
    pot.receiveShadow = true;
    potGroup.add(pot);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.08, 16, 64), materials.pot);
    rim.position.y = 0.86;
    rim.rotation.x = Math.PI / 2;
    rim.castShadow = true;
    potGroup.add(rim);

    const foot = new THREE.Mesh(new THREE.TorusGeometry(0.83, 0.055, 12, 52), materials.pot);
    foot.position.y = -0.29;
    foot.rotation.x = Math.PI / 2;
    potGroup.add(foot);

    soilMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.03, 0.98, 0.16, 64), materials.soil);
    soilMesh.position.y = 0.82;
    soilMesh.receiveShadow = true;
    potGroup.add(soilMesh);

    waterDisk = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.018, 64), materials.water);
    waterDisk.position.y = 0.916;
    waterDisk.visible = false;
    potGroup.add(waterDisk);

    addSoilPebbles(potGroup);
    lab.add(potGroup);

    const lampBody = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.58, 0.18, 48), materials.metal);
    lampBody.position.set(4.15, 5.48, -3.28);
    lampBody.rotation.x = Math.PI / 2;
    lampBody.castShadow = true;
    lab.add(lampBody);

    lampBulb = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.39, 0.045, 48), materials.lamp);
    lampBulb.position.set(4.15, 5.48, -3.18);
    lampBulb.rotation.x = Math.PI / 2;
    lab.add(lampBulb);
  }

  function makeJar(radius, height, color) {
    const g = new THREE.Group();
    const glass = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius * 0.9, height, 28, 1, true),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.28, roughness: 0.05, transmission: 0.35, depthWrite: false })
    );
    const fill = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.86, radius * 0.82, height * 0.45, 28),
      new THREE.MeshStandardMaterial({ color, roughness: 0.72 })
    );
    fill.position.y = -height * 0.18;
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.02, radius * 1.02, 0.08, 28), materials.metal);
    lid.position.y = height * 0.52;
    g.add(glass, fill, lid);
    return g;
  }

  function addSoilPebbles(group) {
    const geo = new THREE.SphereGeometry(0.025, 7, 5);
    const colors = [0x2a1a13, 0x4b3020, 0x65442b, 0x211711];
    for (let i = 0; i < 140; i++) {
      const a = seeded(i + 8) * Math.PI * 2;
      const r = Math.sqrt(seeded(i + 81)) * 0.96;
      const pebble = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 1 }));
      pebble.position.set(Math.cos(a) * r, 0.91 + seeded(i + 14) * 0.035, Math.sin(a) * r);
      pebble.scale.setScalar(0.55 + seeded(i + 33) * 1.5);
      pebble.scale.y *= 0.45;
      pebble.rotation.set(seeded(i + 4), seeded(i + 5), seeded(i + 6));
      group.add(pebble);
    }
  }

  function buildControls() {
    ui.plantChoices.innerHTML = Object.keys(SPECIES).map((key) => (
      `<button type="button" data-plant="${key}">${SPECIES[key].emoji} <span>${plantName(key)}</span></button>`
    )).join('');
    ui.speedChoices.innerHTML = SPEEDS.map((speed) => (
      `<button type="button" data-speed="${speed}">${speed === 0 ? '⏸' : `${speed}×`}</button>`
    )).join('');
    updateActiveButtons();
  }

  function bindEvents() {
    ui.langBtn.addEventListener('click', () => {
      lang = lang === 'zh' ? 'en' : 'zh';
      store.set(LS.lang, lang);
      applyLang();
    });
    ui.themeBtn.addEventListener('click', () => {
      theme = theme === 'light' ? 'dark' : 'light';
      store.set(LS.theme, theme);
      applyTheme();
    });
    ui.soundBtn.addEventListener('click', async () => {
      state.sound = !state.sound;
      store.set(LS.sound, state.sound ? 'on' : 'off');
      await unlockAudio();
      if (state.sound) {
        playSound('toggle');
        log(t('soundEnabled'));
      }
      updateSoundButton();
    });
    ui.plantChoices.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-plant]');
      if (btn) {
        unlockAudio();
        playSound('select');
        resetExperiment(btn.dataset.plant, true);
      }
    });
    ui.speedChoices.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-speed]');
      if (!btn) return;
      state.speed = Number(btn.dataset.speed);
      unlockAudio();
      playSound(state.speed === 0 ? 'pause' : 'tick');
      updateActiveButtons();
      updateUi();
    });
    for (const [el, key] of [[ui.light, 'light'], [ui.humidity, 'humidity'], [ui.temperature, 'temperature'], [ui.nutrients, 'nutrients']]) {
      el.addEventListener('input', () => {
        state[key] = Number(el.value);
        updateUi();
      });
    }
    ui.jumpDays.addEventListener('input', () => {
      ui.jumpOut.textContent = t('jumpDays')(Number(ui.jumpDays.value));
    });
    ui.waterBtn.addEventListener('click', () => {
      unlockAudio();
      state.humidity = clamp(state.humidity + 16, 0, 100);
      state.waterFlash = 1;
      spawnWaterMist();
      playSound('water');
      log(t('watered'));
      syncInputs();
      updateUi();
    });
    ui.fertilizeBtn.addEventListener('click', () => {
      unlockAudio();
      state.nutrients = clamp(state.nutrients + 22, 0, 100);
      state.fertilizerFlash = 1;
      spawnFertilizer();
      playSound('fertilize');
      log(t('fed'));
      syncInputs();
      updateUi();
    });
    ui.jumpBtn.addEventListener('click', () => {
      unlockAudio();
      const days = Number(ui.jumpDays.value);
      simulateDays(days);
      playSound('grow');
      log(t('jumped')(days));
      updateUi();
    });
    ui.resetBtn.addEventListener('click', () => {
      unlockAudio();
      playSound('reset');
      resetExperiment(state.species, true);
    });
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      orbit.targetDist = clamp(orbit.targetDist + event.deltaY * 0.006, 6.2, 15);
    }, { passive: false });
    addEventListener('resize', resize);
  }

  async function unlockAudio() {
    if (!state.sound) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    audioUnlocked = true;
  }

  function playSound(kind) {
    if (!state.sound || !audioUnlocked || !audioCtx) return;
    const now = audioCtx.currentTime;
    if (kind === 'water') {
      playNoise(now, 0.46, 680, 0.14);
      playTone(now + 0.03, 520, 0.12, 0.035, 'sine');
      playTone(now + 0.16, 390, 0.18, 0.028, 'triangle');
      return;
    }
    if (kind === 'fertilize') {
      [0, 0.055, 0.11, 0.18].forEach((d, i) => playTone(now + d, 180 + i * 34, 0.055, 0.05, 'square'));
      playNoise(now + 0.05, 0.18, 1400, 0.055);
      return;
    }
    if (kind === 'grow') {
      [392, 494, 587, 784].forEach((f, i) => playTone(now + i * 0.085, f, 0.18, 0.045, 'sine'));
      return;
    }
    if (kind === 'stage') {
      [523, 659, 784].forEach((f, i) => playTone(now + i * 0.07, f, 0.22, 0.04, 'triangle'));
      return;
    }
    if (kind === 'select') playTone(now, 330, 0.09, 0.035, 'triangle');
    if (kind === 'toggle') playTone(now, 660, 0.12, 0.035, 'sine');
    if (kind === 'pause') playTone(now, 196, 0.12, 0.035, 'sine');
    if (kind === 'tick') playTone(now, 440, 0.07, 0.026, 'triangle');
    if (kind === 'reset') playTone(now, 262, 0.12, 0.035, 'sine');
  }

  function playTone(start, freq, dur, gainValue, type) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.03);
  }

  function playNoise(start, dur, cutoff, gainValue) {
    const length = Math.max(1, Math.floor(audioCtx.sampleRate * dur));
    const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const src = audioCtx.createBufferSource();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, start);
    gain.gain.setValueAtTime(gainValue, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.buffer = buffer;
    src.connect(filter).connect(gain).connect(audioCtx.destination);
    src.start(start);
    src.stop(start + dur + 0.02);
  }

  function resetExperiment(species, addEntry) {
    state.species = species;
    state.day = 0;
    state.biomass = 0.015;
    state.health = 100;
    state.light = SPECIES[species].ideal.light - 4;
    state.humidity = SPECIES[species].ideal.humidity;
    state.temperature = SPECIES[species].ideal.temperature;
    state.nutrients = Math.max(35, SPECIES[species].ideal.nutrients - 12);
    state.speed = 10;
    state.waterFlash = 0;
    state.fertilizerFlash = 0;
    state.lastStage = 0;
    state.journal = [];
    fertilizerPellets.length = 0;
    effectAnchor.clear();
    makeMist();
    if (addEntry) log(t('plantLog')(plantName(species)));
    else log(t('plantLog')(plantName(species)));
    syncInputs();
    updateActiveButtons();
    rebuildPlant();
    updateUi();
  }

  function simulateDays(days) {
    const steps = Math.max(8, Math.ceil(days * 6));
    for (let i = 0; i < steps; i++) advance(days / steps);
    rebuildPlant();
  }

  function advance(dtDays) {
    const species = SPECIES[state.species];
    const score = environmentScore(species);
    state.day += dtDays;
    const healthFactor = clamp((state.health - 12) / 88);
    state.biomass = clamp(state.biomass + dtDays * (score.growthScore ** 1.42) * healthFactor / species.maturity, 0.015, 1);
    state.health = clamp(lerp(state.health, 100 * score.healthScore, clamp(dtDays * 0.09, 0, 0.42)), 2, 100);
    state.humidity = clamp(state.humidity, 0, 100);
    state.nutrients = clamp(state.nutrients - dtDays * score.nutrientUse, 0, 100);
    state.waterFlash = Math.max(0, state.waterFlash - dtDays * 0.18);
    state.fertilizerFlash = Math.max(0, state.fertilizerFlash - dtDays * 0.22);
    const stage = stageIndex();
    if (stage !== state.lastStage) {
      state.lastStage = stage;
      playSound('stage');
      log(t('stageLog')(t('stages')[stage]));
    }
  }

  function environmentScore(species) {
    const r = species.range;
    const light = bandScore(state.light, r.light);
    const humidity = bandScore(state.humidity, r.humidity);
    const temp = bandScore(state.temperature, r.temperature);
    const nutrients = bandScore(state.nutrients, r.nutrients);
    const drought = belowStress(state.humidity, r.humidity[0], 16);
    const waterlogging = aboveStress(state.humidity, r.humidity[2], 18);
    const cold = belowStress(state.temperature, r.temperature[0], 8);
    const heat = aboveStress(state.temperature, r.temperature[2], 8);
    const starvation = belowStress(state.nutrients, r.nutrients[0], 20);
    const fertilizerBurn = aboveStress(state.nutrients, r.nutrients[2], 12);
    const shade = belowStress(state.light, r.light[0], 28);
    const lightBurn = aboveStress(state.light, r.light[2], 12) * (state.humidity < r.humidity[1] ? 1 : 0.45);
    const limiting = Math.min(light, humidity, temp, nutrients);
    const average = (light + humidity + temp + nutrients) / 4;
    const stress = clamp(drought * 0.24 + waterlogging * 0.18 + cold * 0.18 + heat * 0.24 + starvation * 0.13 + fertilizerBurn * 0.28 + shade * 0.12 + lightBurn * 0.16, 0, 0.95);
    const growthScore = clamp(0.015 + limiting * 0.72 + average * 0.23 - stress * 0.56, 0, 1);
    const healthScore = clamp(1 - stress, 0.03, 1);
    const transpiration = 0.22 + state.light * 0.0048 + Math.max(0, state.temperature - 18) * 0.032 + state.biomass * 0.48;
    const waterUse = transpiration * (state.humidity > 84 ? 0.45 : 1) * (state.health < 35 ? 0.72 : 1);
    const nutrientUse = (0.035 + state.biomass * 0.18) * (0.28 + growthScore) * (fertilizerBurn > 0 ? 0.42 : 1);
    return { light, humidity, temp, nutrients, growthScore, healthScore, stress, waterUse, nutrientUse, drought, waterlogging, cold, heat, starvation, fertilizerBurn, shade, lightBurn };
  }

  function bandScore(value, [min, optimum, max]) {
    if (value <= min) return clamp(value / Math.max(1, min) * 0.18);
    if (value < optimum) return lerp(0.18, 1, (value - min) / (optimum - min));
    if (value <= max) return lerp(1, 0.45, (value - optimum) / (max - optimum));
    return clamp(0.45 - (value - max) / Math.max(1, 100 - max || 12) * 0.45, 0, 0.45);
  }

  function belowStress(value, min, spread) {
    return clamp((min - value) / spread);
  }

  function aboveStress(value, max, spread) {
    return clamp((value - max) / spread);
  }

  function stageIndex() {
    const g = state.biomass;
    if (g < 0.045) return 0;
    if (g < 0.12) return 1;
    if (g < 0.3) return 2;
    if (g < 0.56) return 3;
    if (g < 0.73) return 4;
    if (g < 0.9) return 5;
    return 6;
  }

  function rebuildPlant() {
    plantAnchor.remove(plantGroup);
    plantGroup.traverse((node) => {
      if (node.geometry) node.geometry.dispose();
      if (node.material && !Object.values(materials).includes(node.material)) {
        if (Array.isArray(node.material)) node.material.forEach((m) => m.dispose?.());
        else node.material.dispose?.();
      }
    });
    leafLines.length = 0;
    plantGroup = new THREE.Group();
    plantAnchor.add(plantGroup);
    buildPlantModel(plantGroup, SPECIES[state.species]);
    lastVisualBiomass = state.biomass;
    lastVisualStage = stageIndex();
  }

  function buildPlantModel(group, species) {
    const g = state.biomass;
    const health = state.health / 100;
    const stress = 1 - health;
    const vigor = environmentScore(species).growthScore;
    const height = species.maxHeight * smooth(0.05, 0.94, g) * lerp(0.62, 1.08, health);
    const lean = (state.light < 42 ? (42 - state.light) / 42 : 0) * 0.62;
    const stemMat = new THREE.MeshStandardMaterial({
      color: mixHex(species.stemColor, 0x6b5536, stress * 0.55),
      map: textures.stem,
      roughness: 0.82,
      metalness: 0.02,
    });
    const leafMat = new THREE.MeshPhysicalMaterial({
      color: mixHex(species.leafColor, 0xb98b45, stress * 0.7),
      map: textures.leaf,
      roughness: 0.58,
      sheen: 0.72,
      clearcoat: 0.18,
      clearcoatRoughness: 0.62,
      side: THREE.DoubleSide,
    });
    const veinMat = new THREE.MeshStandardMaterial({
      color: mixHex(species.leafAccent, 0x7f6a34, stress * 0.72),
      roughness: 0.7,
    });

    if (g < 0.045) {
      const seed = new THREE.Mesh(new THREE.SphereGeometry(0.16, 28, 16), new THREE.MeshStandardMaterial({ color: 0x9c6b3e, roughness: 0.85 }));
      seed.position.set(0, 0.98, 0);
      seed.scale.set(1.24, 0.7, 0.88);
      seed.castShadow = true;
      group.add(seed);
      const rootTip = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.18, 5, 10), new THREE.MeshStandardMaterial({ color: 0xf0dfbd, roughness: 0.82 }));
      rootTip.position.set(-0.08, 0.88, 0.03);
      rootTip.rotation.z = 0.9;
      group.add(rootTip);
      return;
    }

    const stemSegments = Math.max(1, Math.ceil(3 + g * 10));
    const points = [];
    for (let i = 0; i <= stemSegments; i++) {
      const p = i / stemSegments;
      const wave = Math.sin(p * Math.PI * 1.7 + g * 2.1) * 0.035 * (1 - stress * 0.5);
      points.push(new THREE.Vector3(wave + lean * p * p, 0.9 + height * p, Math.cos(p * Math.PI * 1.3) * 0.045));
    }
    const stemGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), stemSegments * 7, lerp(0.035, 0.115, g) * lerp(0.75, 1.08, health), 18, false);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.castShadow = true;
    stem.receiveShadow = true;
    group.add(stem);

    const visibleLeaves = Math.floor(lerp(2, species.leafPairs, smooth(0.1, 0.78, g)));
    for (let i = 0; i < visibleLeaves; i++) {
      const p = (i + 1) / (visibleLeaves + 1);
      const side = i % 2 === 0 ? 1 : -1;
      const node = curvePoint(points, p);
      const size = lerp(0.25, 0.68, smooth(0.15, 0.72, g)) * (1 - Math.abs(p - 0.55) * 0.42) * lerp(0.64, 1.05, health);
      const droop = stress * 0.75 + (state.humidity < 28 ? 0.42 : 0);
      const petioleEnd = node.clone().add(new THREE.Vector3(side * size * 0.34, size * 0.06, (i % 3 - 1) * 0.05));
      group.add(makeCylinderBetween(node, petioleEnd, 0.012 + size * 0.012, stemMat));
      const leaf = makeLeafGroup(size, side, species, leafMat, veinMat, stress, i);
      leaf.position.copy(petioleEnd);
      leaf.rotation.set(-0.52 - droop * 0.38, side * (0.88 + p * 0.55), side * (0.18 + p * 0.18));
      leaf.scale.setScalar(lerp(0.82, 1.04, vigor));
      group.add(leaf);
    }

    if (species.key === 'pea' && g > 0.34) addPeaTendrils(group, points, stemMat, stress);
    if (g > 0.67) {
      if (species.key === 'sunflower') addSunflower(group, curvePoint(points, 1), g, health, species);
      if (species.key === 'tomato') addTomatoFlowers(group, points, g, health, species);
      if (species.key === 'pea') addPeaFlowers(group, points, g, health, species);
    }
  }

  function curvePoint(points, tVal) {
    const idx = clamp(tVal, 0, 1) * (points.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.min(points.length - 1, lo + 1);
    return points[lo].clone().lerp(points[hi], idx - lo);
  }

  function makeLeafGroup(size, side, species, material, veinMat, stress, index) {
    const lengthFactor = species.key === 'sunflower' ? 1.52 : species.key === 'tomato' ? 1.08 : 1.0;
    const widthFactor = species.key === 'sunflower' ? 0.72 : species.key === 'tomato' ? 0.62 : 0.52;
    const length = size * lengthFactor;
    const width = size * widthFactor;
    const curl = (0.05 + stress * 0.16 + (state.humidity < 30 ? 0.09 : 0)) * (index % 2 ? -1 : 1);
    const group = new THREE.Group();
    const leaf = new THREE.Mesh(makeLeafGeometry(length, width, size * 0.026, curl, species.key), material);
    leaf.scale.x = side;
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    group.add(leaf);

    const mid = makeCylinderBetween(new THREE.Vector3(0, 0.03, 0.026), new THREE.Vector3(0, length * 0.92, 0.05), size * 0.015, veinMat);
    group.add(mid);
    for (let i = 0; i < 5; i++) {
      const y = length * (0.22 + i * 0.12);
      const branchLen = width * (0.36 - i * 0.03);
      for (const dir of [-1, 1]) {
        const start = new THREE.Vector3(0, y, 0.04);
        const end = new THREE.Vector3(dir * branchLen, y + length * 0.08, 0.047);
        const vein = makeCylinderBetween(start, end, size * 0.0055, veinMat);
        vein.scale.x *= side;
        group.add(vein);
      }
    }
    return group;
  }

  function makeLeafGeometry(length, width, thickness, curl, speciesKey) {
    const rows = 18;
    const cols = 12;
    const vertices = [];
    const normals = [];
    const uvs = [];
    const addSurface = (zSign) => {
      for (let i = 0; i <= rows; i++) {
        const u = i / rows;
        const profile = Math.sin(Math.PI * u) ** (speciesKey === 'tomato' ? 0.42 : 0.58);
        const taper = speciesKey === 'pea' ? 0.78 + u * 0.1 : 1;
        for (let j = 0; j <= cols; j++) {
          const v = j / cols * 2 - 1;
          const edge = Math.abs(v);
          const serration = speciesKey === 'tomato' ? Math.sin(u * 42 + v * 16) * 0.035 : 0;
          const x = v * width * profile * taper * (1 + serration);
          const y = u * length;
          const arch = Math.sin(Math.PI * u) * (1 - edge * 0.45);
          const z = curl * (v * v - 0.26) * arch + zSign * thickness * (0.45 + (1 - edge) * 0.55);
          vertices.push(x, y, z);
          normals.push(0, 0, zSign);
          uvs.push(j / cols, u);
        }
      }
    };
    addSurface(1);
    addSurface(-1);
    const indices = [];
    const rowSize = cols + 1;
    const surface = (offset, flip) => {
      for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
        const a = offset + i * rowSize + j;
        const b = a + 1;
        const c = a + rowSize;
        const d = c + 1;
        if (flip) indices.push(a, c, b, b, c, d);
        else indices.push(a, b, c, b, d, c);
      }
    };
    surface(0, false);
    surface((rows + 1) * rowSize, true);
    const bottomOffset = (rows + 1) * rowSize;
    for (let i = 0; i < rows; i++) {
      const a = i * rowSize, b = (i + 1) * rowSize;
      const c = bottomOffset + i * rowSize, d = bottomOffset + (i + 1) * rowSize;
      indices.push(a, c, b, b, c, d);
      const ar = a + cols, br = b + cols, cr = c + cols, dr = d + cols;
      indices.push(ar, br, cr, br, dr, cr);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  function addSunflower(group, top, g, health, species) {
    const flower = new THREE.Group();
    flower.position.copy(top);
    flower.position.y += 0.15;
    flower.rotation.set(-0.14, 0.35, 0.04);
    const bloom = smooth(0.72, 0.94, g) * health;
    const petalMat = new THREE.MeshPhysicalMaterial({ color: species.flowerColor, map: textures.petal, roughness: 0.48, sheen: 0.55, side: THREE.DoubleSide });
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      const p = new THREE.Mesh(makeLeafGeometry(0.62, 0.13, 0.012, Math.sin(i) * 0.035, 'pea'), petalMat);
      p.position.set(Math.cos(a) * 0.27 * bloom, Math.sin(a) * 0.27 * bloom, 0.06 + (i % 2) * 0.012);
      p.rotation.z = a - Math.PI / 2;
      p.rotation.x = 0.16 + Math.sin(i * 1.7) * 0.08;
      p.scale.setScalar(lerp(0.18, 1, bloom));
      p.castShadow = true;
      flower.add(p);
    }
    const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.34 * bloom, 0.36 * bloom, 0.12, 64), new THREE.MeshStandardMaterial({ color: species.fruitColor, roughness: 0.92 }));
    disk.rotation.x = Math.PI / 2;
    disk.castShadow = true;
    flower.add(disk);
    const seedMat = new THREE.MeshStandardMaterial({ color: 0x2b1b11, roughness: 0.94 });
    for (let i = 0; i < 54; i++) {
      const r = Math.sqrt(seeded(i + 701)) * 0.29 * bloom;
      const a = i * 2.399963;
      const seed = new THREE.Mesh(new THREE.SphereGeometry(0.018 * bloom, 8, 6), seedMat);
      seed.position.set(Math.cos(a) * r, Math.sin(a) * r, 0.075);
      seed.scale.set(1, 0.7, 0.42);
      flower.add(seed);
    }
    group.add(flower);
  }

  function addTomatoFlowers(group, points, g, health, species) {
    const bloom = smooth(0.68, 0.88, g) * health;
    for (let i = 0; i < 5; i++) {
      const p = 0.54 + i * 0.08;
      const node = curvePoint(points, clamp(p, 0, 1));
      const side = i % 2 ? -1 : 1;
      const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.025, 0.62, 10), new THREE.MeshStandardMaterial({ color: species.stemColor, roughness: 0.8 }));
      branch.position.copy(node).add(new THREE.Vector3(side * 0.22, 0.05, 0));
      branch.rotation.z = side * 1.05;
      branch.castShadow = true;
      group.add(branch);
      if (g > 0.88) {
        const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.14 + i * 0.01, 28, 18), new THREE.MeshStandardMaterial({ color: species.fruitColor, roughness: 0.48, metalness: 0.02 }));
        fruit.position.copy(node).add(new THREE.Vector3(side * 0.5, -0.12, 0.04));
        fruit.scale.y = 0.92;
        fruit.castShadow = true;
        group.add(fruit);
        addCalyx(group, fruit.position, 0.12 + i * 0.008, species);
      } else {
        addSmallFlower(group, node.clone().add(new THREE.Vector3(side * 0.52, 0.04, 0.04)), species.flowerColor, bloom);
      }
    }
  }

  function addPeaFlowers(group, points, g, health, species) {
    const bloom = smooth(0.7, 0.86, g) * health;
    for (let i = 0; i < 4; i++) {
      const node = curvePoint(points, 0.52 + i * 0.1);
      const side = i % 2 ? -1 : 1;
      if (g > 0.88) {
        const pod = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.44, 8, 18), new THREE.MeshStandardMaterial({ color: species.fruitColor, roughness: 0.62 }));
        pod.position.copy(node).add(new THREE.Vector3(side * 0.48, -0.04, 0.02));
        pod.rotation.z = side * 1.15;
        pod.castShadow = true;
        group.add(pod);
        for (let p = -1; p <= 1; p++) {
          const pea = new THREE.Mesh(new THREE.SphereGeometry(0.034, 10, 8), new THREE.MeshStandardMaterial({ color: 0x78cf62, roughness: 0.62 }));
          pea.position.copy(pod.position).add(new THREE.Vector3(side * 0.03, p * 0.1, 0.075));
          pea.castShadow = true;
          group.add(pea);
        }
      } else {
        addSmallFlower(group, node.clone().add(new THREE.Vector3(side * 0.42, 0.03, 0.02)), species.flowerColor, bloom);
      }
    }
  }

  function addSmallFlower(group, pos, color, bloom) {
    const matFlower = new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, sheen: 0.45, side: THREE.DoubleSide });
    const flower = new THREE.Group();
    flower.position.copy(pos);
    flower.scale.setScalar(lerp(0.25, 1, bloom));
    for (let i = 0; i < 5; i++) {
      const p = new THREE.Mesh(makeLeafGeometry(0.2, 0.055, 0.006, 0.018, 'pea'), matFlower);
      p.position.set(Math.cos(i / 5 * Math.PI * 2) * 0.07, Math.sin(i / 5 * Math.PI * 2) * 0.07, 0);
      p.rotation.z = i / 5 * Math.PI * 2;
      p.rotation.x = 0.25;
      p.castShadow = true;
      flower.add(p);
    }
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.035, 14, 10), new THREE.MeshStandardMaterial({ color: 0xffd15c, roughness: 0.55 }));
    flower.add(core);
    group.add(flower);
  }

  function addCalyx(group, pos, size, species) {
    const matCalyx = new THREE.MeshStandardMaterial({ color: species.stemColor, roughness: 0.72 });
    const calyx = new THREE.Group();
    calyx.position.copy(pos).add(new THREE.Vector3(0, size * 0.85, 0));
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * Math.PI * 2;
      const leaf = new THREE.Mesh(makeLeafGeometry(size * 0.42, size * 0.12, 0.004, 0.015, 'pea'), matCalyx);
      leaf.rotation.set(0.7, 0, a);
      leaf.position.set(Math.cos(a) * size * 0.16, 0, Math.sin(a) * size * 0.16);
      calyx.add(leaf);
    }
    group.add(calyx);
  }

  function addPeaTendrils(group, points, matStem, stress) {
    for (let i = 0; i < 3; i++) {
      const node = curvePoint(points, 0.42 + i * 0.16);
      const side = i % 2 ? -1 : 1;
      const pts = [];
      for (let s = 0; s < 18; s++) {
        const p = s / 17;
        pts.push(new THREE.Vector3(
          node.x + side * (0.14 + p * 0.42),
          node.y + p * 0.16,
          node.z + Math.sin(p * Math.PI * 4) * (0.07 - stress * 0.02),
        ));
      }
      const tendril = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 36, 0.009, 8, false), matStem);
      tendril.castShadow = true;
      group.add(tendril);
    }
  }

  function makeCylinderBetween(start, end, radius, material) {
    const mid = start.clone().lerp(end, 0.5);
    const dir = end.clone().sub(start);
    const len = Math.max(0.001, dir.length());
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 10), material);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    mesh.castShadow = true;
    return mesh;
  }

  function makeMist() {
    if (mistPoints) effectAnchor.remove(mistPoints);
    const count = 170;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = seeded(i + 101) * Math.PI * 2;
      const r = Math.sqrt(seeded(i + 303)) * 2.1;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = 1.0 + seeded(i + 404) * 3.6;
      positions[i * 3 + 2] = Math.sin(a) * r;
      sizes[i] = 0.05 + seeded(i + 505) * 0.11;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    const matMist = new THREE.PointsMaterial({ map: textures.mist, size: 0.13, transparent: true, opacity: 0.15, depthWrite: false, color: 0xdffaff });
    mistPoints = new THREE.Points(geo, matMist);
    effectAnchor.add(mistPoints);
  }

  function spawnWaterMist() {
    const geo = new THREE.SphereGeometry(0.026, 10, 8);
    for (let i = 0; i < 60; i++) {
      const mesh = new THREE.Mesh(geo, materials.droplet.clone());
      mesh.position.set((seeded(i + Date.now()) - 0.5) * 1.2, 3.4 + seeded(i + 9), 0.8 + (seeded(i + 14) - 0.5) * 0.9);
      mesh.scale.y = 1.45;
      effectAnchor.add(mesh);
      particles.push({
        type: 'water',
        mesh,
        v: new THREE.Vector3((seeded(i + 3) - 0.5) * 0.018, -0.025 - seeded(i + 7) * 0.03, (seeded(i + 6) - 0.5) * 0.016),
        life: 1,
      });
    }
  }

  function spawnFertilizer() {
    const geo = new THREE.SphereGeometry(0.035, 10, 7);
    for (let i = 0; i < 24; i++) {
      const pellet = new THREE.Mesh(geo, materials.fertilizer);
      pellet.position.set((seeded(i + Date.now()) - 0.5) * 1.25, 2.8 + seeded(i + 7) * 1.2, (seeded(i + 33) - 0.5) * 1.25);
      pellet.castShadow = true;
      fertilizerPellets.push({ mesh: pellet, v: new THREE.Vector3((seeded(i + 4) - 0.5) * 0.02, -0.04 - seeded(i + 5) * 0.025, (seeded(i + 6) - 0.5) * 0.02), life: 1 });
      effectAnchor.add(pellet);
    }
  }

  function updateEffects(dt) {
    const humidityAlpha = clamp(state.humidity / 100) * 0.28 + state.waterFlash * 0.2;
    mistPoints.material.opacity = humidityAlpha;
    mistPoints.rotation.y += dt * 0.04;
    const pos = mistPoints.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) + dt * (0.015 + state.humidity * 0.00035);
      pos.setY(i, y > 4.8 ? 1.0 : y);
    }
    pos.needsUpdate = true;

    waterDisk.visible = state.waterFlash > 0.03 || state.humidity > 76;
    waterDisk.material.opacity = clamp((state.humidity - 70) / 50 + state.waterFlash * 0.35, 0.05, 0.58);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.mesh.position.addScaledVector(p.v, dt * 60);
      p.mesh.scale.multiplyScalar(0.996);
      p.life -= dt * 0.9;
      p.mesh.material.opacity = clamp(p.life * 0.68);
      if (p.life <= 0 || p.mesh.position.y < 0.92) {
        effectAnchor.remove(p.mesh);
        particles.splice(i, 1);
      }
    }

    for (let i = fertilizerPellets.length - 1; i >= 0; i--) {
      const f = fertilizerPellets[i];
      f.mesh.position.addScaledVector(f.v, dt * 60);
      f.mesh.rotation.x += dt * 4;
      f.mesh.rotation.z += dt * 2;
      if (f.mesh.position.y < 0.98) {
        f.life -= dt * 0.9;
        f.mesh.scale.setScalar(Math.max(0.01, f.life));
      }
      if (f.life <= 0) {
        effectAnchor.remove(f.mesh);
        fertilizerPellets.splice(i, 1);
      }
    }

    const wet = clamp((state.humidity - 35) / 55);
    materials.soil.color.setHex(mixHex(0x4b301e, 0x21160e, wet * 0.75));
  }

  function updateLighting() {
    const light = state.light / 100;
    const score = environmentScore(SPECIES[state.species]);
    sun.intensity = lerp(0.18, 4.1, light);
    growLight.intensity = lerp(0.35, 13.5, light);
    growLight.angle = lerp(Math.PI / 8.5, Math.PI / 5.4, clamp(state.light / 120));
    const warm = clamp((state.temperature - 12) / 30);
    sun.color.setHSL(0.11, lerp(0.22, 0.45, warm), lerp(0.66, 0.86, light));
    growLight.color.setHSL(0.1, 0.82, lerp(0.55, 0.82, light));
    materials.lamp.emissiveIntensity = lerp(0.18, 3.4, light);
    hemi.intensity = lerp(0.28, 0.76, light) * lerp(0.82, 1, score.humidity);
    renderer.toneMappingExposure = lerp(0.78, 1.18, light);
    scene.fog.color.set(theme === 'dark' ? 0x182318 : 0xd9e8dc);
    scene.background.set(theme === 'dark' ? 0x182318 : 0xd9e8dc);
  }

  function updateUi() {
    const stage = stageIndex();
    const stages = t('stages');
    ui.dayRead.textContent = t('dayValue')(state.day);
    ui.stageRead.textContent = stages[stage];
    ui.growthRead.textContent = `${Math.round(state.biomass * 100)}%`;
    ui.healthRead.textContent = `${Math.round(state.health)}%`;
    ui.plantBadge.textContent = `${SPECIES[state.species].emoji} ${plantName(state.species)}`;
    ui.speedBadge.textContent = state.speed === 0 ? 'pause' : `${state.speed}×`;
    ui.lightOut.textContent = `${Math.round(state.light)}%`;
    ui.humidityOut.textContent = `${Math.round(state.humidity)}%`;
    ui.tempOut.textContent = `${Math.round(state.temperature)}°C`;
    ui.nutrientOut.textContent = `${Math.round(state.nutrients)}%`;
    ui.jumpOut.textContent = t('jumpDays')(Number(ui.jumpDays.value));
    ui.diagnosis.textContent = diagnosis();
    updateActiveButtons();
  }

  function syncInputs() {
    ui.light.value = String(Math.round(state.light));
    ui.humidity.value = String(Math.round(state.humidity));
    ui.temperature.value = String(Math.round(state.temperature));
    ui.nutrients.value = String(Math.round(state.nutrients));
  }

  function updateActiveButtons() {
    ui.plantChoices.querySelectorAll('[data-plant]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.plant === state.species);
      const span = btn.querySelector('span');
      if (span) span.textContent = plantName(btn.dataset.plant);
    });
    ui.speedChoices.querySelectorAll('[data-speed]').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.speed) === state.speed);
    });
    updateSoundButton();
  }

  function updateSoundButton() {
    ui.soundBtn.textContent = state.sound ? '🔊' : '🔇';
    ui.soundBtn.setAttribute('aria-label', state.sound ? t('soundOn') : t('soundOff'));
    ui.soundBtn.setAttribute('title', state.sound ? t('soundOn') : t('soundOff'));
    ui.soundBtn.setAttribute('aria-pressed', state.sound ? 'true' : 'false');
  }

  function diagnosis() {
    const score = environmentScore(SPECIES[state.species]);
    if (score.fertilizerBurn > 0.18) return t('burned');
    if (score.shade > 0.25) return t('dark');
    if (score.drought > 0.22) return t('dry');
    if (score.waterlogging > 0.2) return t('wet');
    if (score.heat > 0.2 || score.lightBurn > 0.3) return t('heat');
    if (score.cold > 0.22) return t('cold');
    if (score.starvation > 0.24) return t('hungry');
    return t('stable');
  }

  function log(message) {
    state.journal.unshift({ day: state.day, message });
    state.journal = state.journal.slice(0, 8);
    ui.journal.innerHTML = state.journal.map((item) => `<li><b>${t('dayValue')(item.day)}</b> ${escapeHtml(item.message)}</li>`).join('');
  }

  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((node) => {
      const val = I18N[lang][node.dataset.t];
      if (typeof val === 'string') node.textContent = val;
    });
    ui.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    buildControls();
    ui.journal.innerHTML = '';
    const old = [...state.journal];
    state.journal = [];
    old.reverse().forEach((entry) => log(entry.message));
    updateUi();
  }

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    ui.themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    updateLighting();
  }

  function tick() {
    const dt = Math.min(clock.getDelta(), 0.06);
    if (state.speed > 0) {
      const dtDays = dt * state.speed * 0.18;
      advance(dtDays);
      const visualThreshold = state.speed >= 100 ? 0.028 : state.speed >= 50 ? 0.018 : 0.01;
      if (Math.abs(state.biomass - lastVisualBiomass) > visualThreshold || stageIndex() !== lastVisualStage) rebuildPlant();
    }
    orbit.yaw = lerp(orbit.yaw, orbit.targetYaw, 0.12);
    orbit.pitch = lerp(orbit.pitch, orbit.targetPitch, 0.12);
    orbit.dist = lerp(orbit.dist, orbit.targetDist, 0.12);
    const cp = Math.cos(orbit.pitch);
    camera.position.set(Math.sin(orbit.yaw) * cp * orbit.dist, 1.7 + Math.sin(orbit.pitch) * orbit.dist, Math.cos(orbit.yaw) * cp * orbit.dist);
    camera.lookAt(0, 2.3, 0);
    root.rotation.y = Math.sin(state.day * 0.08) * 0.015;
    potGroup.rotation.y = Math.sin(state.day * 0.04) * 0.018;
    plantGroup.rotation.z = Math.sin(state.day * 0.11) * 0.018;
    updateEffects(dt);
    updateLighting();
    updateUi();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  function onPointerDown(event) {
    pointer.down = true;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event) {
    if (!pointer.down) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    orbit.targetYaw -= dx * 0.006;
    orbit.targetPitch = clamp(orbit.targetPitch - dy * 0.0045, -0.05, 0.92);
  }

  function onPointerUp() {
    pointer.down = false;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function makeCanvasTexture(size, painter) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    painter(ctx, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    return tex;
  }

  function paintSoil(ctx, size) {
    ctx.fillStyle = '#382318';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 2600; i++) {
      const r = seeded(i) * 2.8 + 0.3;
      const x = seeded(i + 20) * size;
      const y = seeded(i + 40) * size;
      const shade = Math.floor(24 + seeded(i + 60) * 64);
      ctx.fillStyle = `rgb(${shade + 38}, ${shade + 22}, ${shade + 10})`;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 1.4, r, seeded(i + 80) * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function paintPot(ctx, size) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#e08b61');
    grad.addColorStop(0.45, '#ad583d');
    grad.addColorStop(1, '#7e3828');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    ctx.globalAlpha = 0.23;
    for (let y = 0; y < size; y += 24) {
      ctx.fillStyle = y % 48 === 0 ? '#ffd3a8' : '#4f2017';
      ctx.fillRect(0, y, size, 3);
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(65,31,21,${0.05 + seeded(i) * 0.14})`;
      ctx.fillRect(seeded(i + 1) * size, seeded(i + 2) * size, 1 + seeded(i + 3) * 2, 1 + seeded(i + 4) * 2);
    }
  }

  function paintLeaf(ctx, size) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#9bdc70');
    grad.addColorStop(0.5, '#3d8c42');
    grad.addColorStop(1, '#1f5f2f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(225,255,188,.46)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(size * 0.5, size);
    ctx.lineTo(size * 0.52, 0);
    ctx.stroke();
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const y = size * (0.14 + i * 0.07);
      ctx.beginPath();
      ctx.moveTo(size * 0.51, y);
      ctx.lineTo(size * (0.18 + seeded(i) * 0.16), y + 34);
      ctx.moveTo(size * 0.52, y);
      ctx.lineTo(size * (0.82 - seeded(i + 8) * 0.16), y + 30);
      ctx.stroke();
    }
  }

  function paintStem(ctx, size) {
    ctx.fillStyle = '#5d8d42';
    ctx.fillRect(0, 0, size, size);
    for (let x = 0; x < size; x += 11) {
      ctx.strokeStyle = x % 22 ? 'rgba(33,72,25,.22)' : 'rgba(180,220,126,.18)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + seeded(x) * 6, 0);
      ctx.bezierCurveTo(x + 16, size * 0.3, x - 10, size * 0.62, x + 6, size);
      ctx.stroke();
    }
  }

  function paintPetal(ctx, size) {
    const grad = ctx.createRadialGradient(size * 0.45, size * 0.62, 2, size * 0.5, size * 0.5, size * 0.7);
    grad.addColorStop(0, '#fff1a3');
    grad.addColorStop(0.52, '#ffbe36');
    grad.addColorStop(1, '#d57918');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(116,72,12,.16)';
    for (let i = 0; i < 14; i++) {
      ctx.beginPath();
      ctx.moveTo(size * 0.5, size);
      ctx.lineTo(size * (0.1 + i * 0.06), 0);
      ctx.stroke();
    }
  }

  function makeSoftCircleTexture(size, color) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, color);
    g.addColorStop(0.45, color.replace('1)', '.42)'));
    g.addColorStop(1, color.replace('1)', '0)'));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function seeded(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function mixHex(a, b, tVal) {
    const tMix = clamp(tVal);
    const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
    const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
    return ((lerp(ar, br, tMix) & 255) << 16) | ((lerp(ag, bg, tMix) & 255) << 8) | (lerp(ab, bb, tMix) & 255);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  }
})();
