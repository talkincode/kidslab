import * as THREE from './vendor/three.module.min.js';

(() => {
  'use strict';

  /* ============================== i18n ============================== */
  const I18N = {
    zh: {
      doc: '体积水族馆 · KidsLab', back: '返回平台', title: '体积水族馆',
      eyebrow: '五年级 · 体积与容积',
      tipBuild: '你是水族馆小馆长！给鱼儿盖大小合适的新家吧。',
      tipDisplace: '尺子量不了的东西，水可以帮你量——试试看！',
      tipPump: '看看 1 升水到底有多少，学会 L 和 cm³ 互换。',
      tipBonus: '奇形怪状的缸别怕：切开、分别算、再加起来。',
      modeBuild: '🏠 盖鱼缸', modeDisplace: '🪨 量石头', modePump: '💧 认识“升”', modeBonus: '🧩 组合缸',
      buildTitle: '🏠 盖鱼缸',
      buildGoal: '🎯 任务：调好长、宽、高，给这条鱼盖一个够大的家。',
      buildStep1: '拖滑块，改变鱼缸的长、宽、高',
      buildStep2: '看公式：长 × 宽 × 高 = 体积',
      buildStep3: '体积够大了？点“放水！请鱼入住”',
      length: '长', width: '宽', height: '高',
      fillTank: '💦 放水！请鱼入住', hideGrid: '隐藏小方块刻度', showGrid: '显示小方块刻度', nextCustomer: '下一位客人 →',
      displaceTitle: '🪨 量石头',
      displaceGoal: '🎯 任务：石头凹凸不平，尺子量不了——把它放进满满的水缸，溢出多少水，它就有多大！',
      displaceStep1: '选一个宝贝', displaceStep2: '先猜猜它有多少 cm³',
      displaceStep3: '把它拖进水缸（或点下面的按钮），看量杯接住多少水',
      guessLabel: '我猜它是——',
      measureIdle: '量杯空空的，等水流进来……', dropObject: '💧 放进水里！',
      pumpTitle: '💧 认识“升”',
      pumpGoal: '🎯 任务：左边的正方体水箱边长 10cm，装满正好是 1000 cm³ 的水——人们给它起了个名字，叫 1 升（L）。',
      pumpAgain: '▶ 再看一遍抽水',
      bonusTitle: '🧩 组合缸',
      bonusGoal: '🎯 任务：这个 L 形大缸不是长方体，怎么算体积？——切成两块长方体，分别算，再加起来！',
      solveL: '✂️ 切开看看', whale: '🐋 鲸鲨彩蛋',
      hintOrbit: '🖐️ 拖动空白处旋转 · 滚轮缩放',
      hintDrag: '✋ 按住宝贝，拖到发光的水缸上松手',
      nogl: '你的浏览器暂不支持 WebGL，可以继续玩右侧的文字挑战。',
      need: (n) => `我的新家要装下 ${n} 块小方块（${n} cm³）`,
      prefFlat: '悄悄话：我喜欢矮矮宽宽的缸', prefTall: '悄悄话：我喜欢高高的缸，能往上冲！', prefExact: '悄悄话：不大不小刚刚好，我最开心',
      volume: (l, w, h, v) => `${l} × ${w} × ${h} = ${v} cm³`,
      happy: (name, plus) => plus ? `${name}：哇！大小够住，形状还是我的最爱！奖励 2 颗星 ⭐⭐` : `${name}：谢谢馆长，水够多，我搬进来啦！⭐`,
      sad: (name, need, v) => `${name}：呜……这里只有 ${v} 块小方块，我要 ${need} 块才住得下，再调大一点嘛～`,
      selected: (n) => `选中了${n}！先猜猜它的体积，再拖进水缸。`,
      guessRight: '猜对啦！奖励 1 枚贝壳 🐚，快放进水里验证！', guessWrong: '记住你的猜想——放进水里就见分晓！',
      splash: '扑通！', measured: (name, v) => `溢出的水正好 ${v} cm³ —— ${name} 的体积就是 ${v} cm³！`,
      backHome: '要放进水缸里哦，我先把它送回原位～',
      pumpGood: '答对啦！看，水泵把水抽过去了 💧', pumpBad: '再想想：1 L = 1000 cm³，升变厘米立方要 ×1000。',
      lshape: '切开啦！左块 4×2×2=16，右块 2×2×3=12，合起来 28 cm³！',
      whaleMsg: '真的鲸鲨要住几百万升的水！先用 长×宽×高 估一个大概，科学家也是这么干的。',
    },
    en: {
      doc: 'Volume Aquarium · KidsLab', back: 'Back to platform', title: 'Volume Aquarium',
      eyebrow: 'Grade 5 · Volume & Capacity',
      tipBuild: "You're the aquarium keeper! Build each fish a home that's just big enough.",
      tipDisplace: "A ruler can't measure a lumpy rock — but water can. Try it!",
      tipPump: 'See how much 1 liter really is, and swap between L and cm³.',
      tipBonus: 'Odd-shaped tank? Cut it up, measure each part, then add them.',
      modeBuild: '🏠 Build a tank', modeDisplace: '🪨 Measure a rock', modePump: '💧 Meet the liter', modeBonus: '🧩 Combo tank',
      buildTitle: '🏠 Build a tank',
      buildGoal: '🎯 Goal: set length, width and height to build a big-enough home for this fish.',
      buildStep1: 'Drag the sliders to resize the tank',
      buildStep2: 'Watch the formula: length × width × height = volume',
      buildStep3: 'Big enough? Press “Fill it up!”',
      length: 'Length', width: 'Width', height: 'Height',
      fillTank: '💦 Fill it up!', hideGrid: 'Hide unit cubes', showGrid: 'Show unit cubes', nextCustomer: 'Next guest →',
      displaceTitle: '🪨 Measure a rock',
      displaceGoal: "🎯 Goal: a lumpy rock can't be measured with a ruler — drop it in a full tank; the spilled water shows its size!",
      displaceStep1: 'Pick a treasure', displaceStep2: 'Guess its volume in cm³ first',
      displaceStep3: 'Drag it into the tank (or press the button) and read the beaker',
      guessLabel: 'My guess is —',
      measureIdle: 'The beaker is empty, waiting for water…', dropObject: '💧 Drop it in!',
      pumpTitle: '💧 Meet the liter',
      pumpGoal: '🎯 Goal: the cube tank is 10cm on each side, holding exactly 1000 cm³ of water — we call that 1 liter (L).',
      pumpAgain: '▶ Replay the pump',
      bonusTitle: '🧩 Combo tank',
      bonusGoal: "🎯 Goal: this L-shaped tank isn't a cuboid. Cut it into two cuboids, measure each, then add!",
      solveL: '✂️ Cut it open', whale: '🐋 Whale shark egg',
      hintOrbit: '🖐️ Drag empty space to orbit · scroll to zoom',
      hintDrag: '✋ Hold a treasure and drop it on the glowing tank',
      nogl: 'WebGL is unavailable, but the text challenges on the right still work.',
      need: (n) => `My new home must hold ${n} little cubes (${n} cm³)`,
      prefFlat: 'Psst: I like low, wide tanks', prefTall: 'Psst: I like tall tanks — I love to dive!', prefExact: 'Psst: a perfect fit makes me happiest',
      volume: (l, w, h, v) => `${l} × ${w} × ${h} = ${v} cm³`,
      happy: (name, plus) => plus ? `${name}: Wow! Big enough AND my favorite shape! +2 stars ⭐⭐` : `${name}: Thanks, keeper! Plenty of water — moving in! ⭐`,
      sad: (name, need, v) => `${name}: Aww… only ${v} cubes here. I need ${need} to fit. Make it bigger!`,
      selected: (n) => `${n} selected! Guess its volume, then drag it into the tank.`,
      guessRight: 'Correct! +1 shell 🐚 — now drop it in to check!', guessWrong: 'Keep that guess — the water will tell the truth!',
      splash: 'Splash!', measured: (name, v) => `The spilled water is exactly ${v} cm³ — so ${name} is ${v} cm³!`,
      backHome: 'Drop it inside the tank — sending it back home for now.',
      pumpGood: 'Correct! Watch the pump move the water 💧', pumpBad: 'Think again: 1 L = 1000 cm³, so multiply liters by 1000.',
      lshape: 'Cut! Left 4×2×2=16, right 2×2×3=12 — together 28 cm³!',
      whaleMsg: 'A real whale shark needs millions of liters! Estimate with length×width×height — scientists do the same.',
    },
  };

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme !== 'light' && theme !== 'dark') theme = 'light';
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const $ = (s) => document.querySelector(s);
  const langBtn = $('#langBtn');
  const themeBtn = $('#themeBtn');

  /* ============================== data ============================== */
  const state = {
    mode: 'build', stars: 0, shells: 0, pumpDone: 0, grid: true, customer: 0,
    water: 0, fishHappy: false, fishIn: false,
    selectedObject: 0, guessed: null, measuring: false, beaker: 0,
    pumpLevel: 0, pumpQ: 0, pumpRun: false, lSolved: false,
  };
  const customers = [
    { emoji: '🐠', name: { zh: '泡泡鱼', en: 'Bubbles' }, need: 24, pref: 'flat' },
    { emoji: '🐡', name: { zh: '鼓鼓河豚', en: 'Puffy' }, need: 30, pref: 'exact' },
    { emoji: '🦐', name: { zh: '虾米队长', en: 'Captain Shrimp' }, need: 18, pref: 'flat' },
    { emoji: '🐟', name: { zh: '闪闪鱼', en: 'Sparkfin' }, need: 36, pref: 'tall' },
    { emoji: '🦀', name: { zh: '钳钳蟹', en: 'Claw Crab' }, need: 32, pref: 'exact' },
    { emoji: '🦑', name: { zh: '墨墨鱿鱼', en: 'Inky Squid' }, need: 48, pref: 'tall' },
  ];
  const objects = [
    { key: 'rock', name: { zh: '皱皱岩石', en: 'the lumpy rock' }, icon: '🪨', volume: 240, color: 0x8d7b74 },
    { key: 'dino', name: { zh: '玩具恐龙', en: 'the toy dino' }, icon: '🦖', volume: 180, color: 0x70c174 },
    { key: 'castle', name: { zh: '迷你城堡', en: 'the mini castle' }, icon: '🏰', volume: 320, color: 0xc9a46a },
    { key: 'shell', name: { zh: '大海螺', en: 'the big conch' }, icon: '🐚', volume: 120, color: 0xf4a7b9 },
    { key: 'sub', name: { zh: '小潜艇', en: 'the tiny sub' }, icon: '🚢', volume: 400, color: 0xf6c453 },
  ];
  const pumpQs = [
    { q: { zh: '水箱装了 2.4 L，等于多少 cm³？', en: 'The tank holds 2.4 L. How many cm³?' }, answer: '2400', opts: ['240', '2400', '24000'] },
    { q: { zh: '量杯里有 750 cm³，等于多少 L？', en: 'The beaker shows 750 cm³. How many L?' }, answer: '0.75', opts: ['0.075', '0.75', '7.5'] },
    { q: { zh: '3 L 加 500 cm³，一共多少 cm³？', en: '3 L plus 500 cm³ makes how many cm³?' }, answer: '3500', opts: ['3050', '3500', '300500'] },
  ];
  const OBJ_HOME = (i) => new THREE.Vector3(-4.2 + i * 2.1, 0.62, 3.0);

  /* ============================== three setup ============================== */
  const canvas = $('#scene');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false }); }
  catch { $('#nogl').hidden = false; canvas.remove(); renderer = null; }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  const root = new THREE.Group(); scene.add(root);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x334466, 1.9); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 2.1); sun.position.set(5, 9, 6); scene.add(sun);
  const fill = new THREE.DirectionalLight(0x9be7ff, 0.55); fill.position.set(-6, 4, -4); scene.add(fill);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pickables = [];
  const dragPlane = new THREE.Plane();
  const dragPoint = new THREE.Vector3();
  const dragOffset = new THREE.Vector3();

  let tankGroup, gridGroup, waterMesh, waterTop, fishGroup, unitCube, dropRing;
  let objectGroup, beakerWater, pumpWater, cubeWater, pumpDrops = [];
  let bubbles = [], splashes = [];
  let dragObject = null, hoverTank = false, flyBacks = [];
  let tankDims = { l: 4, w: 3, h: 2 };
  const orbit = { yaw: -0.6, pitch: 0.42, dist: 13, tyaw: -0.6, tpitch: 0.42, tdist: 13, down: false, moved: false, x: 0, y: 0 };

  const mat = {
    glass: new THREE.MeshPhysicalMaterial({ color: 0xbfeaff, transparent: true, opacity: 0.16, roughness: 0.06, metalness: 0, side: THREE.DoubleSide, depthWrite: false }),
    water: new THREE.MeshPhysicalMaterial({ color: 0x2fb7e8, transparent: true, opacity: 0.38, roughness: 0.22, side: THREE.DoubleSide, depthWrite: false }),
    waterTop: new THREE.MeshPhysicalMaterial({ color: 0x7fdcff, transparent: true, opacity: 0.55, roughness: 0.1 }),
    frame: new THREE.MeshToonMaterial({ color: 0xff8f6b }),
    wood: new THREE.MeshToonMaterial({ color: 0xb98a5e }),
    woodDark: new THREE.MeshToonMaterial({ color: 0x9a6f4a }),
    sand: new THREE.MeshToonMaterial({ color: 0xf3dfae }),
    plant: new THREE.MeshToonMaterial({ color: 0x3fbf7f }),
    pebble: new THREE.MeshToonMaterial({ color: 0xcdb8d8 }),
    fish: new THREE.MeshToonMaterial({ color: 0xff6b9d, emissive: 0x51122b }),
    shadow: new THREE.MeshBasicMaterial({ color: 0x1b2b46, transparent: true, opacity: 0.16 }),
  };

  /* ============================== scene builders ============================== */
  function makeGround() {
    const g = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(9.6, 10.4, 0.5, 48), mat.wood);
    disc.position.y = -0.62; g.add(disc);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(9.6, 9.6, 0.1, 48), new THREE.MeshToonMaterial({ color: 0xd9b98c }));
    top.position.y = -0.32; g.add(top);
    return g;
  }

  function makeStand(l, w) {
    const g = new THREE.Group();
    const top = new THREE.Mesh(new THREE.BoxGeometry(l + 0.9, 0.26, w + 0.9), mat.woodDark);
    top.position.y = -0.13; g.add(top);
    const body = new THREE.Mesh(new THREE.BoxGeometry(l + 0.5, 0.36, w + 0.5), mat.wood);
    body.position.y = -0.44; g.add(body);
    return g;
  }

  function makeFrame(l, w, h) {
    const g = new THREE.Group();
    const bar = 0.09;
    const mk = (sx, sy, sz, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat.frame); m.position.set(x, y, z); g.add(m); };
    for (const [x, z] of [[-l / 2, -w / 2], [l / 2, -w / 2], [-l / 2, w / 2], [l / 2, w / 2]]) mk(bar, h + bar, bar, x, h / 2, z);
    for (const y of [0, h]) {
      mk(l + bar, bar, bar, 0, y, -w / 2); mk(l + bar, bar, bar, 0, y, w / 2);
      mk(bar, bar, w + bar, -l / 2, y, 0); mk(bar, bar, w + bar, l / 2, y, 0);
    }
    return g;
  }

  function makeDecor(l, w) {
    const g = new THREE.Group();
    const sand = new THREE.Mesh(new THREE.BoxGeometry(l - 0.16, 0.14, w - 0.16), mat.sand);
    sand.position.y = 0.07; g.add(sand);
    const rnd = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; };
    const r = rnd(42 + l * 7 + w * 13);
    const nPlant = Math.max(1, Math.min(3, Math.round((l * w) / 8)));
    for (let i = 0; i < nPlant; i++) {
      const px = (r() - 0.5) * (l - 1), pz = (r() - 0.5) * (w - 1);
      for (let b = 0; b < 3; b++) {
        const blade = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.55 + r() * 0.35, 5), mat.plant);
        blade.position.set(px + (r() - 0.5) * 0.22, 0.42, pz + (r() - 0.5) * 0.22);
        blade.rotation.z = (r() - 0.5) * 0.5; g.add(blade);
      }
    }
    for (let i = 0; i < Math.min(4, Math.round(l * w / 5)); i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.09 + r() * 0.07, 10, 8), mat.pebble);
      p.position.set((r() - 0.5) * (l - 0.7), 0.16, (r() - 0.5) * (w - 0.7));
      p.scale.y = 0.7; g.add(p);
    }
    return g;
  }

  function makeTank(l = 4, w = 3, h = 2, { decor = true } = {}) {
    if (tankGroup) root.remove(tankGroup);
    tankDims = { l, w, h };
    tankGroup = new THREE.Group(); root.add(tankGroup);
    tankGroup.add(makeStand(l, w));

    const glass = new THREE.Mesh(new THREE.BoxGeometry(l, h, w), mat.glass);
    glass.position.y = h / 2; tankGroup.add(glass);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(glass.geometry), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
    edges.position.copy(glass.position); tankGroup.add(edges);
    tankGroup.add(makeFrame(l, w, h));
    if (decor) tankGroup.add(makeDecor(l, w));

    gridGroup = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({ color: 0x7fdcff, transparent: true, opacity: 0.4 });
    const pts = [];
    for (let x = 0; x <= l; x++) for (let z = 0; z <= w; z++) pts.push(new THREE.Vector3(x - l / 2, 0, z - w / 2), new THREE.Vector3(x - l / 2, h, z - w / 2));
    for (let y = 0; y <= h; y++) {
      for (let x = 0; x <= l; x++) pts.push(new THREE.Vector3(x - l / 2, y, -w / 2), new THREE.Vector3(x - l / 2, y, w / 2));
      for (let z = 0; z <= w; z++) pts.push(new THREE.Vector3(-l / 2, y, z - w / 2), new THREE.Vector3(l / 2, y, z - w / 2));
    }
    gridGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
    // 一个高亮单位方块：让“1 cm³”看得见摸得着
    unitCube = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.92, 0.92), new THREE.MeshToonMaterial({ color: 0xffd166, transparent: true, opacity: 0.85 }));
    unitCube.position.set(-l / 2 + 0.5, 0.46, -w / 2 + 0.5);
    const ucEdge = new THREE.LineSegments(new THREE.EdgesGeometry(unitCube.geometry), new THREE.LineBasicMaterial({ color: 0xa06a00 }));
    unitCube.add(ucEdge); gridGroup.add(unitCube);
    gridGroup.visible = state.grid;
    tankGroup.add(gridGroup);

    waterMesh = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.01, l - 0.14), 1, Math.max(0.01, w - 0.14)), mat.water);
    waterMesh.position.y = 0.005; waterMesh.scale.y = 0.02; tankGroup.add(waterMesh);
    waterTop = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.01, l - 0.14), 0.045, Math.max(0.01, w - 0.14)), mat.waterTop);
    waterTop.position.y = 0.03; tankGroup.add(waterTop);

    fishGroup = makeFish(); fishGroup.visible = state.fishIn; tankGroup.add(fishGroup);

    // 缸口投放高亮圈（displace 模式引导拖拽）
    dropRing = new THREE.Mesh(new THREE.RingGeometry(Math.min(l, w) * 0.28, Math.min(l, w) * 0.42, 40), new THREE.MeshBasicMaterial({ color: 0x06d6a0, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
    dropRing.rotation.x = -Math.PI / 2; dropRing.position.y = h + 0.06; tankGroup.add(dropRing);
  }

  function makeFish() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 16), mat.fish); body.scale.set(1.35, 0.78, 0.72); g.add(body);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 3), new THREE.MeshToonMaterial({ color: 0xffd166 }));
    tail.position.x = -0.58; tail.rotation.z = Math.PI / 2; g.add(tail);
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.34, 3), new THREE.MeshToonMaterial({ color: 0xffd166 }));
    fin.position.set(-0.02, 0.34, 0); g.add(fin);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshBasicMaterial({ color: 0x1b1b1b })); eye.position.set(0.32, 0.14, 0.24); g.add(eye);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); glint.position.set(0.345, 0.165, 0.28); g.add(glint);
    return g;
  }

  function makeBubble() {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.05 + Math.random() * 0.07, 12, 8), new THREE.MeshBasicMaterial({ color: 0xcff7ff, transparent: true, opacity: 0.7 }));
    const { l, w } = tankDims;
    b.position.set((Math.random() - 0.5) * (l * 0.5), 0.35, (Math.random() - 0.5) * (w * 0.5));
    b.userData.life = 1.8; tankGroup.add(b); bubbles.push(b);
  }

  function makeShadowDisc(radius) {
    const m = new THREE.Mesh(new THREE.CircleGeometry(radius, 28), mat.shadow);
    m.rotation.x = -Math.PI / 2; m.position.y = 0.012; return m;
  }

  /* -------- 量石头：物件桌 + 满水缸 + 量杯 -------- */
  function buildIrregularObjects() {
    if (objectGroup) root.remove(objectGroup);
    objectGroup = new THREE.Group(); root.add(objectGroup); pickables.length = 0;

    // 展示桌
    const table = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.24, 1.9), mat.woodDark);
    table.position.set(0, 0.32, 3.0); objectGroup.add(table);
    const tableLegL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 1.5), mat.wood); tableLegL.position.set(-4.8, 0.1, 3.0); objectGroup.add(tableLegL);
    const tableLegR = tableLegL.clone(); tableLegR.position.x = 4.8; objectGroup.add(tableLegR);

    objects.forEach((o, i) => {
      const g = new THREE.Group(); g.name = o.key; g.userData.item = o; g.userData.index = i;
      g.position.copy(OBJ_HOME(i)); g.position.y = 0.62;
      const m = new THREE.MeshToonMaterial({ color: o.color });
      if (o.key === 'rock') { [[0, 0, 0, .5], [.4, .14, .13, .34], [-.34, .07, -.1, .29]].forEach(a => { const s = new THREE.Mesh(new THREE.DodecahedronGeometry(a[3], 0), m); s.position.set(a[0], a[1], a[2]); g.add(s); }); }
      if (o.key === 'dino') { const body = new THREE.Mesh(new THREE.BoxGeometry(.8, .38, .32), m); const neck = new THREE.Mesh(new THREE.ConeGeometry(.16, .58, 8), m); neck.position.set(.44, .34, 0); neck.rotation.z = -.45; const head = new THREE.Mesh(new THREE.SphereGeometry(.22, 16, 10), m); head.position.set(.66, .58, 0); g.add(body, neck, head); }
      if (o.key === 'castle') { for (let j = 0; j < 3; j++) { const tower = new THREE.Mesh(new THREE.CylinderGeometry(.16, .2, .72, 8), m); tower.position.set((j - 1) * .34, .36, 0); g.add(tower); const roof = new THREE.Mesh(new THREE.ConeGeometry(.2, .26, 8), new THREE.MeshToonMaterial({ color: 0xef476f })); roof.position.set((j - 1) * .34, .84, 0); g.add(roof); } const base = new THREE.Mesh(new THREE.BoxGeometry(1.05, .38, .5), m); base.position.y = .16; g.add(base); }
      if (o.key === 'shell') { const shell = new THREE.Mesh(new THREE.TorusKnotGeometry(.28, .12, 50, 8), m); shell.rotation.x = 1.1; shell.position.y = .1; g.add(shell); }
      if (o.key === 'sub') { const sub = new THREE.Mesh(new THREE.CapsuleGeometry(.24, .75, 8, 16), m); sub.rotation.z = Math.PI / 2; const cap = new THREE.Mesh(new THREE.SphereGeometry(.15, 16, 8), new THREE.MeshToonMaterial({ color: 0x9be7ff })); cap.position.y = .28; const peri = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, .3, 8), m); peri.position.set(.22, .34, 0); g.add(sub, cap, peri); }
      const shadow = makeShadowDisc(0.55); shadow.position.y = -0.48; g.add(shadow); g.userData.shadow = shadow;
      objectGroup.add(g); pickables.push(g);
    });
    makeBeaker();
  }

  function makeBeaker() {
    const beaker = new THREE.Group(); beaker.position.set(4.6, 0, -0.4); objectGroup.add(beaker);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.18, 32), mat.woodDark); base.position.y = 0.09; beaker.add(base);
    const glassGeo = new THREE.CylinderGeometry(.72, .72, 2.7, 32, 1, true);
    const glass = new THREE.Mesh(glassGeo, mat.glass); glass.position.y = 1.53; beaker.add(glass);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(.72, .035, 10, 32), mat.frame); rim.rotation.x = Math.PI / 2; rim.position.y = 2.88; beaker.add(rim);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(glassGeo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .55 }));
    edge.position.y = 1.53; beaker.add(edge);
    beakerWater = new THREE.Mesh(new THREE.CylinderGeometry(.65, .65, 1, 32), mat.water);
    beakerWater.position.y = 0.19; beakerWater.scale.y = 0.02; beaker.add(beakerWater);
    for (let i = 1; i <= 5; i++) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.045, 0.02), new THREE.MeshBasicMaterial({ color: 0xff8f6b }));
      tick.position.set(0.72, 0.18 + i * 0.5, 0.28); tick.lookAt(0, 0.18 + i * 0.5, 0); beaker.add(tick);
    }
  }

  /* -------- 认识“升”：正方体水箱 + 量筒 + 泵 -------- */
  function makePumpScene() {
    if (objectGroup) root.remove(objectGroup);
    objectGroup = new THREE.Group(); root.add(objectGroup);
    const stand = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.3, 4.4), mat.woodDark); stand.position.set(0, -0.15, 0); objectGroup.add(stand);

    const cubeGeo = new THREE.BoxGeometry(3, 3, 3);
    const cube = new THREE.Mesh(cubeGeo, mat.glass); cube.position.set(-2.4, 1.5, 0); objectGroup.add(cube);
    const cubeEdge = new THREE.LineSegments(new THREE.EdgesGeometry(cubeGeo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6 }));
    cubeEdge.position.copy(cube.position); objectGroup.add(cubeEdge);
    cubeWater = new THREE.Mesh(new THREE.BoxGeometry(2.84, 1, 2.84), mat.water); cubeWater.position.set(-2.4, .01, 0); cubeWater.scale.y = 2.3; cubeWater.position.y = 1.15; objectGroup.add(cubeWater);

    const cylGeo = new THREE.CylinderGeometry(.8, .8, 3.1, 32, 1, true);
    const cyl = new THREE.Mesh(cylGeo, mat.glass); cyl.position.set(2.6, 1.55, 0); objectGroup.add(cyl);
    const cylEdge = new THREE.LineSegments(new THREE.EdgesGeometry(cylGeo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .5 }));
    cylEdge.position.copy(cyl.position); objectGroup.add(cylEdge);
    const cylBase = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.1, 0.16, 32), mat.woodDark); cylBase.position.set(2.6, 0.08, 0); objectGroup.add(cylBase);
    pumpWater = new THREE.Mesh(new THREE.CylinderGeometry(.72, .72, 1, 32), mat.water); pumpWater.position.set(2.6, .01, 0); pumpWater.scale.y = 0.02; objectGroup.add(pumpWater);

    // 水管：粗管子代替 1px 线
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-2.4, 3.15, 0), new THREE.Vector3(0, 3.9, 0), new THREE.Vector3(2.6, 3.3, 0)]);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.09, 10), mat.frame); objectGroup.add(tube);
    const pumpBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.55), mat.frame); pumpBox.position.set(0, 3.85, 0); objectGroup.add(pumpBox);
    pumpDrops = [];
    for (let i = 0; i < 4; i++) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), new THREE.MeshBasicMaterial({ color: 0x4cc9f0 }));
      d.userData.tt = i / 4; objectGroup.add(d); pumpDrops.push(d);
    }
    state.pumpLevel = 0; state.pumpRun = true;
  }

  /* -------- 组合缸 -------- */
  function makeLShape(split = false) {
    if (objectGroup) root.remove(objectGroup);
    objectGroup = new THREE.Group(); root.add(objectGroup);
    const stand = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.3, 3.6), mat.woodDark); stand.position.y = -0.15; objectGroup.add(stand);
    const gap = split ? 0.55 : 0;
    const mkBox = (sx, sy, sz, x, y, color) => {
      const grp = new THREE.Group();
      const glass = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat.glass); glass.position.set(x, y, 0); grp.add(glass);
      const wat = new THREE.Mesh(new THREE.BoxGeometry(sx - .1, sy - .12, sz - .1), new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity: .5, roughness: .2 }));
      wat.position.set(x, y, 0); grp.add(wat);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(glass.geometry), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8 }));
      e.position.set(x, y, 0); grp.add(e);
      return grp;
    };
    objectGroup.add(mkBox(4, 2, 2, -0.5 - gap, 1, split ? 0x06d6a0 : 0x2fb7e8));
    objectGroup.add(mkBox(2, 3, 2, 1.5 + gap, 1.5, split ? 0xffd166 : 0x2fb7e8));
  }

  /* ============================== camera / resize / theme ============================== */
  function updateCamera() {
    const cp = Math.max(-1.1, Math.min(1.1, orbit.pitch));
    camera.position.set(Math.sin(orbit.yaw) * Math.cos(cp) * orbit.dist, Math.sin(cp) * orbit.dist + 2.2, Math.cos(orbit.yaw) * Math.cos(cp) * orbit.dist);
    camera.lookAt(0, 1.4, 0); camera.updateProjectionMatrix();
  }

  function resize() {
    if (!renderer) return;
    const box = canvas.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(box.width, box.height, false);
    camera.aspect = box.width / Math.max(1, box.height); updateCamera();
  }

  function updateTheme() {
    const bg = new THREE.Color(cssVar('--sky') || (theme === 'dark' ? '#101d33' : '#dff3fb'));
    scene.background = bg;
    scene.fog = new THREE.Fog(bg, 22, 46);
    hemi.color.set(theme === 'dark' ? 0xbfe3ff : 0xffffff);
    hemi.groundColor.set(theme === 'dark' ? 0x181534 : 0xcdeffd);
    mat.shadow.opacity = theme === 'dark' ? 0.3 : 0.16;
  }

  /* ============================== helpers ============================== */
  function dims() { return [$('#len').valueAsNumber, $('#wid').valueAsNumber, $('#hei').valueAsNumber]; }
  function customer() { return customers[state.customer % customers.length]; }
  function loc(obj) { return obj[lang] ?? obj.zh; }
  function prefText(p) { return p === 'flat' ? t('prefFlat') : p === 'tall' ? t('prefTall') : t('prefExact'); }
  function likes(c, l, w, h, v) { return (c.pref === 'flat' && h <= 2 && l >= w) || (c.pref === 'tall' && h >= Math.max(l, w)) || (c.pref === 'exact' && v === c.need); }

  /* ============================== panel renderers ============================== */
  function renderBuildPanel({ rebuild = true } = {}) {
    const c = customer(); const [l, w, h] = dims(); const v = l * w * h;
    $('#lenVal').textContent = l; $('#widVal').textContent = w; $('#heiVal').textContent = h;
    $('#formula').textContent = t('volume')(l, w, h, v);
    $('#customerCard').innerHTML = `<span class="emoji">${c.emoji}</span><span><b>${loc(c.name)}</b><br><span class="need">${t('need')(c.need)}</span><br><small>${prefText(c.pref)}</small></span>`;
    $('#toggleGrid').textContent = state.grid ? t('hideGrid') : t('showGrid');
    if (state.mode === 'build' && rebuild) makeTank(l, w, h);
  }

  function renderDisplacePanel() {
    $('#objectButtons').innerHTML = objects.map((o, i) => `<button class="btn btn--ghost ${i === state.selectedObject ? 'is-active' : ''}" data-object="${i}" type="button">${o.icon} ${loc(o.name)}</button>`).join('');
    const o = objects[state.selectedObject];
    const opts = [o.volume, Math.round(o.volume * 0.75 / 10) * 10, Math.round(o.volume * 1.25 / 10) * 10].sort((a, b) => a - b);
    $('#guessButtons').innerHTML = opts.map(v => `<button class="btn btn--ghost ${state.guessed === v ? 'is-active' : ''}" data-guess="${v}" type="button">${v} cm³</button>`).join('');
    $('#measureReadout').textContent = state.beaker ? t('measured')(loc(o.name), o.volume) : t('measureIdle');
  }

  function renderPumpPanel() {
    const q = pumpQs[state.pumpQ % pumpQs.length]; $('#pumpQuestion').textContent = q.q[lang] ?? q.q.zh;
    $('#pumpChoices').innerHTML = q.opts.map(o => `<button class="btn btn--ghost" data-pump="${o}" type="button">${o}</button>`).join('');
  }

  function renderScore() { $('#stars').textContent = `⭐ ${state.stars}`; $('#shells').textContent = `🐚 ${state.shells}`; $('#pumps').textContent = `💧 ${state.pumpDone}/3`; }
  function toast(msg) { const el = $('#toast'); el.textContent = msg; el.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { el.hidden = true; }, 3000); }

  function render() {
    document.querySelectorAll('.mode-panel').forEach(p => { p.hidden = p.id !== `${state.mode}Panel`; });
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('is-active', b.dataset.mode === state.mode));
    const tipKey = { build: 'tipBuild', displace: 'tipDisplace', pump: 'tipPump', bonus: 'tipBonus' }[state.mode];
    $('#tip').textContent = t(tipKey);
    $('#sceneHint').textContent = state.mode === 'displace' ? t('hintDrag') : t('hintOrbit');
    renderScore();
    if (state.mode === 'build') renderBuildPanel({ rebuild: false });
    if (state.mode === 'displace') renderDisplacePanel();
    if (state.mode === 'pump') renderPumpPanel();
  }

  function setMode(m) {
    state.mode = m; state.beaker = 0; state.water = 0; state.fishIn = false; state.measuring = false;
    dragObject = null; flyBacks = [];
    // 每个模式给一个舒服的默认视角
    orbit.tyaw = -0.6; orbit.tpitch = m === 'displace' ? 0.5 : 0.42;
    orbit.tdist = { build: 13, displace: 15, pump: 13.5, bonus: 12 }[m] ?? 13;
    if (tankGroup) { root.remove(tankGroup); tankGroup = null; }
    if (objectGroup) { root.remove(objectGroup); objectGroup = null; }
    beakerWater = pumpWater = cubeWater = null; pumpDrops = [];
    if (m === 'build') makeTank(...dims());
    if (m === 'displace') { makeTank(4, 3, 3, { decor: false }); state.water = 1; buildIrregularObjects(); }
    if (m === 'pump') makePumpScene();
    if (m === 'bonus') makeLShape(state.lSolved);
    render();
  }

  /* ============================== game actions ============================== */
  function confirmTank() {
    const [l, w, h] = dims(); const v = l * w * h; const c = customer();
    state.water = 1; state.fishHappy = v >= c.need; state.fishIn = true;
    if (fishGroup) fishGroup.visible = true;
    if (state.fishHappy) {
      const plus = likes(c, l, w, h, v); state.stars += plus ? 2 : 1;
      toast(t('happy')(loc(c.name), plus)); state.customer++;
      setTimeout(() => { if (state.mode === 'build') renderBuildPanel({ rebuild: false }); }, 50);
    } else {
      toast(t('sad')(loc(c.name), c.need, v));
    }
    renderScore();
  }

  function nextCustomer() {
    state.customer++; state.water = 0; state.fishHappy = false; state.fishIn = false;
    if (fishGroup) fishGroup.visible = false;
    renderBuildPanel({ rebuild: false }); renderScore();
  }

  function splashAt(x, z, big = false) {
    const n = big ? 26 : 14;
    for (let i = 0; i < n; i++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(.035 + Math.random() * .05, 8, 6), new THREE.MeshBasicMaterial({ color: 0x9be7ff, transparent: true, opacity: .85 }));
      s.position.set(x + (Math.random() - .5) * .8, tankDims.h + 0.1, z + (Math.random() - .5) * .8);
      s.userData.v = new THREE.Vector3((Math.random() - .5) * .09, Math.random() * .1 + .04, (Math.random() - .5) * .09);
      tankGroup.add(s); splashes.push(s);
    }
  }

  function measureObject(fromDrag = false, obj = null) {
    const g = obj || pickables[state.selectedObject];
    const o = objects[state.selectedObject];
    state.measuring = true; state.beaker = 0;
    if (g) {
      // 沉入动画：目标点 = 缸内沙面附近
      g.userData.sink = { target: new THREE.Vector3((Math.random() - .5) * 1.2, 0.55, (Math.random() - .5) * 0.8), tt: 0 };
      if (g.userData.shadow) g.userData.shadow.visible = false;
    }
    splashAt(g ? g.position.x : 0, g ? g.position.z : 0, true);
    toast(`${t('splash')} ${t('measured')(loc(o.name), o.volume)}`);
    setTimeout(() => { state.measuring = false; state.beaker = 1; renderDisplacePanel(); }, 1000);
  }

  function returnObject(g) {
    const home = OBJ_HOME(g.userData.index);
    flyBacks.push({ g, from: g.position.clone(), to: home, tt: 0 });
  }

  /* ============================== drag & drop（重做） ============================== */
  function setPointerFromEvent(e) {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
  }

  function pickObject() {
    const hit = raycaster.intersectObjects(pickables, true)[0];
    if (!hit) return null;
    let g = hit.object;
    while (g.parent && !g.userData.item) g = g.parent;
    return g.userData.item ? g : null;
  }

  function overTank() {
    // 以“指针指向哪”为准：射线与缸口平面求交，孩子看到指到缸上就算对准
    const rimPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -tankDims.h);
    const p = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(rimPlane, p)) return false;
    const { l, w } = tankDims;
    if (Math.abs(p.x) < l / 2 + 0.3 && Math.abs(p.z) < w / 2 + 0.3) { overTank.hit = p; return true; }
    return false;
  }

  function onPointerDown(e) {
    if (!renderer) return;
    canvas.setPointerCapture(e.pointerId);
    orbit.down = true; orbit.moved = false; orbit.x = e.clientX; orbit.y = e.clientY;
    if (state.mode === 'displace' && !state.measuring) {
      setPointerFromEvent(e);
      const g = pickObject();
      if (g && !g.userData.sink) {
        dragObject = g;
        flyBacks = flyBacks.filter(f => f.g !== g);
        state.selectedObject = g.userData.index;
        state.beaker = 0;
        // 拖拽平面：过物体中心、面向相机（只取水平面外的朝向，保证能上下左右移动）
        dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()).negate(), g.position);
        if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) dragOffset.copy(g.position).sub(dragPoint);
        g.userData.baseScale = g.scale.x;
        canvas.classList.add('is-grabbing');
        toast(t('selected')(loc(g.userData.item.name)));
        renderDisplacePanel();
      }
    }
    if (!dragObject) canvas.classList.add('is-grabbing');
  }

  function onPointerMove(e) {
    if (!orbit.down) return;
    const dx = e.clientX - orbit.x, dy = e.clientY - orbit.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) orbit.moved = true;
    orbit.x = e.clientX; orbit.y = e.clientY;
    if (dragObject) {
      // 1:1 跟手：射线与拖拽平面求交
      setPointerFromEvent(e);
      if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
        dragObject.position.copy(dragPoint.add(dragOffset));
        dragObject.position.y = Math.max(0.45, dragObject.position.y);
      }
      hoverTank = overTank();
      return;
    }
    orbit.tyaw -= dx * 0.006;
    orbit.tpitch = Math.max(-0.4, Math.min(1.05, orbit.tpitch - dy * 0.006));
  }

  function onPointerUp(e) {
    orbit.down = false;
    canvas.classList.remove('is-grabbing');
    canvas.releasePointerCapture?.(e.pointerId);
    if (!dragObject) return;
    const g = dragObject; dragObject = null; hoverTank = false;
    setPointerFromEvent(e);
    if (overTank()) {
      // 先把物件挪到指针指着的缸口正上方，再沉下去
      const hit = overTank.hit; const { l, w, h } = tankDims;
      g.position.set(THREE.MathUtils.clamp(hit.x, -l / 2 + 0.5, l / 2 - 0.5), h + 0.5, THREE.MathUtils.clamp(hit.z, -w / 2 + 0.4, w / 2 - 0.4));
      measureObject(true, g);
    } else { if (orbit.moved) toast(t('backHome')); returnObject(g); }
  }

  function runPump(correct = false) {
    state.pumpLevel = 0; state.pumpRun = true;
    if (correct) { state.pumpDone = Math.min(3, state.pumpDone + 1); state.pumpQ++; }
    render();
  }

  /* ============================== main loop ============================== */
  let last = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const tm = now / 1000;

    // 相机阻尼
    orbit.yaw += (orbit.tyaw - orbit.yaw) * 0.14;
    orbit.pitch += (orbit.tpitch - orbit.pitch) * 0.14;
    orbit.dist += (orbit.tdist - orbit.dist) * 0.14;
    updateCamera();

    // 水位
    if (waterMesh) {
      const h = tankDims.h;
      const target = state.mode === 'displace' ? h * 0.96 : (state.water ? h * .9 : 0.02);
      waterMesh.scale.y += (target - waterMesh.scale.y) * .07;
      waterMesh.position.y = waterMesh.scale.y / 2 + 0.02;
      if (waterTop) {
        waterTop.position.y = waterMesh.scale.y + 0.02;
        waterTop.visible = waterMesh.scale.y > 0.1;
        waterTop.scale.x = 1 + Math.sin(tm * 2.1) * 0.004; waterTop.scale.z = 1 + Math.cos(tm * 1.7) * 0.004;
      }
    }

    // 鱼
    if (fishGroup?.visible) {
      const { l, w, h } = tankDims;
      const rx = Math.max(0.3, l / 2 - 0.75), rz = Math.max(0.15, w / 2 - 0.6);
      const wl = Math.max(0.6, waterMesh.scale.y);
      fishGroup.position.set(Math.sin(tm * 1.4) * rx, Math.min(wl - 0.35, 0.5 + Math.sin(tm * 2) * 0.18 + (h - 1) * 0.2), Math.cos(tm * 1.05) * rz);
      fishGroup.rotation.y = Math.cos(tm * 1.4) > 0 ? 0 : Math.PI;
      fishGroup.rotation.z = state.fishHappy ? Math.sin(tm * 3) * 0.08 : Math.sin(tm * 9) * 0.22 + Math.PI;
      if (state.fishHappy && Math.random() < .04) makeBubble();
    }

    // 单位方块呼吸
    if (unitCube && gridGroup?.visible) { const s = 1 + Math.sin(tm * 2.4) * 0.045; unitCube.scale.set(s, s, s); }

    // 投放圈
    if (dropRing) {
      const targetOp = dragObject ? (hoverTank ? 0.85 : 0.4) : 0;
      dropRing.material.opacity += (targetOp - dropRing.material.opacity) * 0.15;
      dropRing.material.color.set(hoverTank ? 0x06d6a0 : 0xffd166);
      const s = 1 + Math.sin(tm * 4) * 0.06;
      dropRing.scale.set(s, s, 1);
    }

    // 拖拽中的物件：轻微放大 + 悬浮感 + 地面影子跟随
    pickables.forEach(g => {
      const isDrag = g === dragObject;
      const base = g.userData.baseScale || 1;
      const target = isDrag ? base * 1.15 : base;
      g.scale.x += (target - g.scale.x) * 0.2; g.scale.y = g.scale.z = g.scale.x;
      if (g.userData.shadow) {
        g.userData.shadow.position.y = -g.position.y + 0.02;
        g.userData.shadow.material = mat.shadow;
        g.userData.shadow.scale.setScalar(Math.max(0.5, 1.25 - g.position.y * 0.12));
      }
      if (!isDrag && !g.userData.sink && !flyBacks.some(f => f.g === g)) g.rotation.y += dt * 0.4;
      // 沉入动画
      if (g.userData.sink) {
        const s = g.userData.sink; s.tt = Math.min(1, s.tt + dt * 1.6);
        const k = 1 - Math.pow(1 - s.tt, 3);
        g.position.lerp(s.target, k * 0.2 + 0.02);
        g.rotation.z += dt * 0.8;
        if (s.tt >= 1 && g.position.distanceTo(s.target) < 0.05) delete g.userData.sink;
      }
    });

    // 飞回动画
    flyBacks = flyBacks.filter(f => {
      f.tt = Math.min(1, f.tt + dt * 2.2);
      const k = 1 - Math.pow(1 - f.tt, 3);
      f.g.position.lerpVectors(f.from, f.to, k);
      f.g.position.y = THREE.MathUtils.lerp(f.from.y, f.to.y, k) + Math.sin(k * Math.PI) * 1.1;
      if (f.tt >= 1) { if (f.g.userData.shadow) f.g.userData.shadow.visible = true; return false; }
      return true;
    });

    // 泡泡 / 水花
    bubbles = bubbles.filter(b => { b.position.y += dt * .75; b.userData.life -= dt; b.material.opacity = Math.max(0, b.userData.life / 1.8); if (b.userData.life <= 0) { tankGroup?.remove(b); return false; } return true; });
    splashes = splashes.filter(s => { s.position.add(s.userData.v); s.userData.v.y -= .006; s.material.opacity -= .016; if (s.material.opacity <= 0) { tankGroup?.remove(s); return false; } return true; });

    // 量杯水位
    if (beakerWater) {
      const full = Math.min(2.4, objects[state.selectedObject].volume / 165);
      const target = (state.measuring || state.beaker) ? full : 0.02;
      beakerWater.scale.y += (target - beakerWater.scale.y) * .06;
      beakerWater.position.y = 0.19 + beakerWater.scale.y / 2;
    }

    // 抽水演示
    if (pumpWater && cubeWater && state.pumpRun) {
      state.pumpLevel = Math.min(1, state.pumpLevel + dt * .3);
      const k = state.pumpLevel;
      pumpWater.scale.y += (k * 2.7 - pumpWater.scale.y) * .08; pumpWater.position.y = 0.02 + pumpWater.scale.y / 2;
      cubeWater.scale.y += ((1 - k) * 2.3 + 0.02 - cubeWater.scale.y) * .08; cubeWater.position.y = 0.02 + cubeWater.scale.y / 2;
      $('#pumpFormula').textContent = `${(k).toFixed(2)} L = ${Math.round(k * 1000)} cm³`;
      pumpDrops.forEach(d => {
        d.userData.tt = (d.userData.tt + dt * 0.55) % 1;
        const p = new THREE.CatmullRomCurve3([new THREE.Vector3(-2.4, 3.15, 0), new THREE.Vector3(0, 3.9, 0), new THREE.Vector3(2.6, 3.3, 0)]).getPoint(d.userData.tt);
        d.position.copy(p); d.visible = k < 1;
      });
      if (k >= 1) state.pumpRun = false;
    }

    renderer?.render(scene, camera);
  }

  /* ============================== i18n / theme apply ============================== */
  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'; document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((n) => { const v = I18N[lang][n.dataset.t]; if (typeof v === 'string') n.textContent = v; });
    if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    render();
  }
  function applyTheme() { document.documentElement.dataset.theme = theme; if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️'; updateTheme(); }

  /* ============================== events ============================== */
  langBtn?.addEventListener('click', () => { lang = lang === 'zh' ? 'en' : 'zh'; store.set(LS.lang, lang); applyLang(); });
  themeBtn?.addEventListener('click', () => { theme = theme === 'light' ? 'dark' : 'light'; store.set(LS.theme, theme); applyTheme(); });
  addEventListener('resize', resize);
  canvas?.addEventListener('pointerdown', onPointerDown);
  canvas?.addEventListener('pointermove', onPointerMove);
  canvas?.addEventListener('pointerup', onPointerUp);
  canvas?.addEventListener('pointercancel', onPointerUp);
  canvas?.addEventListener('wheel', (e) => { e.preventDefault(); orbit.tdist = Math.max(7, Math.min(22, orbit.tdist + Math.sign(e.deltaY))); }, { passive: false });
  ['len', 'wid', 'hei'].forEach(id => $(`#${id}`).addEventListener('input', () => { state.water = 0; state.fishHappy = false; state.fishIn = false; renderBuildPanel(); }));
  $('#confirmTank').addEventListener('click', confirmTank);
  $('#toggleGrid').addEventListener('click', () => { state.grid = !state.grid; if (gridGroup) gridGroup.visible = state.grid; $('#toggleGrid').textContent = state.grid ? t('hideGrid') : t('showGrid'); });
  $('#nextCustomer').addEventListener('click', nextCustomer);
  document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('#objectButtons').addEventListener('click', e => {
    const b = e.target.closest('[data-object]'); if (!b) return;
    const i = +b.dataset.object;
    const g = pickables[i];
    if (g?.userData.sink) delete g.userData.sink;
    if (state.selectedObject !== i && g) { returnObject(pickables[state.selectedObject]); }
    state.selectedObject = i; state.beaker = 0; state.guessed = null;
    toast(t('selected')(loc(objects[i].name))); renderDisplacePanel();
  });
  $('#guessButtons').addEventListener('click', e => {
    const b = e.target.closest('[data-guess]'); if (!b) return;
    state.guessed = +b.dataset.guess;
    if (state.guessed === objects[state.selectedObject].volume) { state.shells++; toast(t('guessRight')); }
    else toast(t('guessWrong'));
    renderScore(); renderDisplacePanel();
  });
  $('#dropObject').addEventListener('click', () => { if (state.measuring) return; const g = pickables[state.selectedObject]; if (g) { g.position.set(0, tankDims.h + 1.4, 0); } measureObject(false, g); });
  $('#pumpChoices').addEventListener('click', e => {
    const b = e.target.closest('[data-pump]'); if (!b) return;
    const ok = b.dataset.pump === pumpQs[state.pumpQ % pumpQs.length].answer;
    b.classList.add(ok ? 'choice-good' : 'choice-bad');
    toast(ok ? t('pumpGood') : t('pumpBad'));
    if (ok) setTimeout(() => runPump(true), 600);
  });
  $('#pumpAgain').addEventListener('click', () => runPump(false));
  $('#solveL').addEventListener('click', () => { if (!state.lSolved) { state.lSolved = true; state.stars++; } makeLShape(true); toast(t('lshape')); renderScore(); });
  $('#whale').addEventListener('click', () => toast(t('whaleMsg')));

  /* ============================== boot ============================== */
  root.add(makeGround());
  applyTheme(); applyLang(); setMode('build'); resize(); requestAnimationFrame(loop);
  // 供自动化测试读取（不参与功能逻辑）
  window.__aqua = { camera, state, getPickables: () => pickables };
})();
