import * as THREE from './vendor/three.module.min.js';

(() => {
  'use strict';

  /* ============================== i18n ============================== */
  const I18N = {
    zh: {
      doc: '冰淇淋几何 · KidsLab', back: '返回平台', title: '冰淇淋几何', eyebrow: '六年级 · 圆柱 / 圆锥 / 旋转体',
      tip0: '欢迎来到冰淇淋工厂！先把纸片转成立体，再揭开圆锥体积“÷3”的秘密。',
      stationLathe: '🌀 旋转成型机', stationTriple: '🍦 三倍之谜', stationShop: '🏪 营业挑战',
      hintOrbit: '🖐️ 拖动空白处旋转 · 滚轮缩放',
      latheTitle: '🌀 旋转成型机', latheGoal: '🎯 任务：一张平平的纸片，绕着轴转一圈，就变出一个立体！集齐 4 种立体图鉴。',
      latheStep1: '选一张纸片', latheStep2: '点“转起来！”，或直接拖动纸片', latheStep3: '转满一圈，立体就收进图鉴',
      radius: '半径 r', height: '高 h', spinBtn: '🌀 转起来！', spinAgain: '↺ 再转一次',
      tripleTitle: '🍦 三倍之谜', tripleGoal: '🎯 任务：圆锥杯和圆柱杯，底一样大、高一样高。猜猜倒几杯，圆柱杯正好满？',
      tripleStep1: '点“接冰淇淋”，把圆锥杯接满（也可以把杯子拖到机器下）', tripleStep2: '点“倒进圆柱杯”（或把杯子拖过去）', tripleStep3: '数一数：第几杯刚好倒满？',
      fillCone: '🍦 接冰淇淋', pourCone: '💧 倒进圆柱杯', resetTriple: '↺ 重来一次', unequal: '🔍 换个小杯子对照',
      shopTitle: '🏪 营业挑战', shopGoal: '🎯 任务：客人想要冰淇淋多的那份！用公式帮客人算一算，答对赚金币开分店。',
      shopHintFormula: 'V柱 = πr²h　·　V锥 = πr²h ÷ 3',
      nextOrder: '下一位客人 →', nogl: '你的浏览器暂不支持 WebGL，不过右边的挑战题还可以玩。',
      rect: '长方形纸片', tri: '三角形纸片', semi: '半圆纸片', trap: '梯形纸片',
      solidCyl: '圆柱', solidCone: '圆锥', solidSphere: '球', solidFrustum: '圆台',
      spinsInto: (paper, solid) => `${paper} 转一圈 → ${solid}`,
      made: (n) => `✨ ${n}成型！收进立体图鉴～`, allMade: '🎉 图鉴集齐啦！你已经是旋转体小专家！',
      atlasHint: '图鉴：转出立体来点亮',
      cupsCount: (n) => `🍦 已倒 ${n} 杯`,
      tripleFull: (n) => `第 ${n} 杯刚好倒满！圆锥 = 圆柱的 ⅓`,
      coneFull: '接好啦！圆锥杯装满了冰淇淋。', coneEmptyTip: '圆锥杯还是空的，先去机器那里接一杯吧。',
      alreadyFull: '圆锥杯已经满啦，先倒进圆柱杯吧！', cylFullTip: '圆柱杯已经满啦！点“重来一次”再玩一遍。',
      magic: '🎉 第 3 杯刚好倒满！所以：圆锥体积 = 圆柱体积 ÷ 3', unequalStart: '换了一个小圆锥杯（底和高都不一样了），再试试要几杯？',
      unequalMsg: '看！杯子不是“等底等高”，倒了 4 杯还是不满——“÷3”只在等底等高时才成立！',
      equalStart: '换回等底等高的圆锥杯，重新开始！',
      order: (cone, cup) => `我想要多的那份！${cone}，${cup}——哪份多呀？`,
      coneDesc: (r, h) => `🍦 甜筒是圆锥（半径 ${r}、高 ${h}）`, cupDesc: (r, h) => `🥤 杯装是圆柱（半径 ${r}、高 ${h}）`,
      right: '✅ 答对了！客人开心地付了钱～', wrong: '❌ 再想想：圆锥的体积要 ÷ 3 哦。',
      reveal: (cv, yv, ans) => `甜筒 = ${cv}π，杯装 = ${yv}π → ${ans}`,
      equal: '一样多', cone: '甜筒多', cyl: '杯装多',
      branchDone: '🎊 金币攒够，分店开张啦！你是冰淇淋大亨！',
      volCyl: (r, h) => `V = π×${r}²×${h} = ${r * r * h}π`,
      volCone: (r, h) => `V = π×${r}²×${h}÷3 = ${Math.round(r * r * h / 3 * 100) / 100}π`,
      volSphere: (r) => `V = 4π×${r}³÷3 = ${Math.round(4 * r * r * r / 3 * 100) / 100}π（中学会学到）`,
      volFrustum: '上小下大的圆台（公式中学会学到）',
      idleLathe: '💡 试试点下面的“转起来！”，看纸片变立体', idleTriple: '💡 点“接冰淇淋”，开始解开三倍之谜', idleShop: '💡 用右边的公式算一算，再选答案',
    },
    en: {
      doc: 'Ice Cream Geometry · KidsLab', back: 'Back to platform', title: 'Ice Cream Geometry', eyebrow: 'Grade 6 · cylinder / cone / solids of revolution',
      tip0: 'Welcome to the ice cream factory! Spin paper into solids, then uncover the secret of “÷3” in cone volume.',
      stationLathe: '🌀 Spin shaper', stationTriple: '🍦 Triple mystery', stationShop: '🏪 Shop challenge',
      hintOrbit: '🖐️ Drag empty space to orbit · scroll to zoom',
      latheTitle: '🌀 Spin shaper', latheGoal: '🎯 Goal: spin a flat piece of paper around the axis and a solid appears! Collect all 4 solids.',
      latheStep1: 'Pick a paper shape', latheStep2: 'Press “Spin!” or drag the paper', latheStep3: 'Finish a full turn to collect the solid',
      radius: 'Radius r', height: 'Height h', spinBtn: '🌀 Spin!', spinAgain: '↺ Spin again',
      tripleTitle: '🍦 Triple mystery', tripleGoal: '🎯 Goal: the cone cup and cylinder cup share the same base and height. Guess how many cone cups fill the cylinder!',
      tripleStep1: 'Press “Fill cone” (or drag the cup under the machine)', tripleStep2: 'Press “Pour in” (or drag the cup over)', tripleStep3: 'Count: which pour fills it exactly?',
      fillCone: '🍦 Fill cone', pourCone: '💧 Pour in', resetTriple: '↺ Start over', unequal: '🔍 Try a smaller cup',
      shopTitle: '🏪 Shop challenge', shopGoal: '🎯 Goal: customers want the bigger serving! Use the formulas to help them and earn coins.',
      shopHintFormula: 'V cylinder = πr²h · V cone = πr²h ÷ 3',
      nextOrder: 'Next customer →', nogl: 'WebGL is unavailable, but the challenges on the right still work.',
      rect: 'Rectangle paper', tri: 'Triangle paper', semi: 'Semicircle paper', trap: 'Trapezoid paper',
      solidCyl: 'cylinder', solidCone: 'cone', solidSphere: 'sphere', solidFrustum: 'frustum',
      spinsInto: (paper, solid) => `${paper} spins into → ${solid}`,
      made: (n) => `✨ A ${n} formed! Added to the atlas~`, allMade: '🎉 Atlas complete! You are a solids-of-revolution expert!',
      atlasHint: 'Atlas: spin solids to light up',
      cupsCount: (n) => `🍦 ${n} cup${n === 1 ? '' : 's'} poured`,
      tripleFull: (n) => `Cup ${n} fills it exactly! Cone = ⅓ cylinder`,
      coneFull: 'Done! The cone cup is full of ice cream.', coneEmptyTip: 'The cone cup is empty — fill it at the machine first.',
      alreadyFull: 'The cone cup is already full. Pour it in first!', cylFullTip: 'The cylinder is full! Press “Start over” to play again.',
      magic: '🎉 The 3rd cup fills it exactly! So: cone volume = cylinder volume ÷ 3', unequalStart: 'Switched to a smaller cone cup (different base and height). How many cups now?',
      unequalMsg: 'See? Without equal base & height, even 4 cups don’t fill it — “÷3” only works with equal base and height!',
      equalStart: 'Back to the equal base & height cup. Try again!',
      order: (cone, cup) => `I want the bigger one! ${cone}, ${cup} — which has more?`,
      coneDesc: (r, h) => `🍦 the cone (radius ${r}, height ${h})`, cupDesc: (r, h) => `🥤 the cup, a cylinder (radius ${r}, height ${h})`,
      right: '✅ Correct! The customer happily pays~', wrong: '❌ Think again: cone volume needs ÷ 3.',
      reveal: (cv, yv, ans) => `Cone = ${cv}π, cup = ${yv}π → ${ans}`,
      equal: 'Same amount', cone: 'Cone has more', cyl: 'Cup has more',
      branchDone: '🎊 Enough coins — a new branch opens! Ice cream tycoon!',
      volCyl: (r, h) => `V = π×${r}²×${h} = ${r * r * h}π`,
      volCone: (r, h) => `V = π×${r}²×${h}÷3 = ${Math.round(r * r * h / 3 * 100) / 100}π`,
      volSphere: (r) => `V = 4π×${r}³÷3 = ${Math.round(4 * r * r * r / 3 * 100) / 100}π (middle school)`,
      volFrustum: 'A frustum: small top, big bottom (formula comes in middle school)',
      idleLathe: '💡 Try pressing “Spin!” to turn paper into a solid', idleTriple: '💡 Press “Fill cone” to start solving the mystery', idleShop: '💡 Use the formulas on the right, then pick an answer',
    },
  };

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { } } };
  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en'); if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); if (theme !== 'light' && theme !== 'dark') theme = 'light';
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const $ = (s) => document.querySelector(s);
  const langBtn = $('#langBtn'), themeBtn = $('#themeBtn');

  /* ============================== data ============================== */
  const shapes = [
    { id: 'rect', solidKey: 'solidCyl', icon: '▭' },
    { id: 'tri', solidKey: 'solidCone', icon: '◺' },
    { id: 'semi', solidKey: 'solidSphere', icon: '◠' },
    { id: 'trap', solidKey: 'solidFrustum', icon: '▱' },
  ];
  // r²h all divisible so volumes are neat multiples of π
  const orders = [
    { cone: [3, 12], cyl: [3, 4], ans: 'equal' }, { cone: [2, 9], cyl: [2, 4], ans: 'cyl' }, { cone: [4, 9], cyl: [4, 2], ans: 'cone' },
    { cone: [3, 6], cyl: [3, 2], ans: 'equal' }, { cone: [5, 6], cyl: [5, 3], ans: 'cyl' }, { cone: [2, 15], cyl: [2, 5], ans: 'equal' },
  ];
  const CUSTOMERS = ['🧒', '👧', '👦', '👵', '👨‍🦰', '🧑‍🎓'];
  const CUP = { R: 1.1, H: 2.7 };            // cylinder cup dims
  const CONE_EQ = { r: 1.1, h: 2.7 };        // equal base & height cone
  const CONE_NEQ = { r: 0.8, h: 2.0 };       // control cone
  const CONE_HOME = new THREE.Vector3(0, 0, 0.4);
  const FILL_SPOT = new THREE.Vector3(-2.5, 0, 0.4);
  const CYL_SPOT = new THREE.Vector3(2.6, 0, 0);

  const state = {
    station: 'lathe', shape: 0, r: 3, h: 6, phi: 0, formed: false,
    scoops: 0, coneFilled: false, equal: true, busy: false,
    atlas: new Set(), money: 0, order: 0, answered: false, branchToasted: false,
  };

  /* ============================== three setup ============================== */
  const canvas = $('#scene');
  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  } catch { $('#nogl').hidden = false; canvas?.remove(); }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  const root = new THREE.Group(); scene.add(root);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x64507a, 1.5); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.position.set(6, 10, 5);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -8; sun.shadow.camera.right = 8; sun.shadow.camera.top = 9; sun.shadow.camera.bottom = -5; sun.shadow.bias = -0.002;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xffd9ec, 0.6); fill.position.set(-6, 4, -4); scene.add(fill);
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const dragPoint = new THREE.Vector3();
  const orbit = { yaw: -0.5, pitch: 0.4, dist: 13, tyaw: -0.5, tpitch: 0.4, tdist: 13, down: false, x: 0, y: 0, mode: 'orbit' };

  /* materials (theme-tinted in updateTheme) */
  const mats = {
    stage: new THREE.MeshStandardMaterial({ color: 0xf7cfe0, roughness: 0.85 }),
    stageRim: new THREE.MeshStandardMaterial({ color: 0xdba7c2, roughness: 0.85 }),
    wood: new THREE.MeshStandardMaterial({ color: 0xc08b5c, roughness: 0.7 }),
    woodDark: new THREE.MeshStandardMaterial({ color: 0x9a6f4a, roughness: 0.7 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xb9c0d4, roughness: 0.3, metalness: 0.75 }),
    paper: new THREE.MeshStandardMaterial({ color: 0xfff0a3, roughness: 0.9, side: THREE.DoubleSide }),
    sweep: new THREE.MeshPhysicalMaterial({ color: 0xff7ab6, transparent: true, opacity: 0.42, roughness: 0.2, side: THREE.DoubleSide, depthWrite: false }),
    machine: new THREE.MeshStandardMaterial({ color: 0xff9dbe, roughness: 0.5 }),
    machineTop: new THREE.MeshStandardMaterial({ color: 0xfff3fa, roughness: 0.45 }),
    cream: new THREE.MeshStandardMaterial({ color: 0xfff0c8, roughness: 0.55 }),
    creamPink: new THREE.MeshStandardMaterial({ color: 0xffc2d8, roughness: 0.55 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xcdefff, transparent: true, opacity: 0.2, roughness: 0.06, side: THREE.DoubleSide, depthWrite: false }),
    cherry: new THREE.MeshStandardMaterial({ color: 0xe23f5e, roughness: 0.35 }),
    counter: new THREE.MeshStandardMaterial({ color: 0x8ecae6, roughness: 0.6 }),
    ring: new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
  };

  function loc(key) { return t(key); }
  function toast(msg, long = false) { const el = $('#toast'); el.textContent = msg; el.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => { el.hidden = true; }, long ? 4200 : 2800); }
  function bumpIdle() { bumpIdle.at = performance.now(); bumpIdle.shown = false; }
  bumpIdle();

  /* ============================== tween engine ============================== */
  const tweens = [];
  const easeOut = (k) => 1 - Math.pow(1 - k, 3);
  const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  function tween(dur, update, ease = easeOut) { return new Promise((res) => tweens.push({ el: 0, dur, update, ease, res })); }
  const wait = (s) => tween(s, () => { }, (k) => k);
  function stepTweens(dt) {
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i]; tw.el += dt; const k = Math.min(1, tw.el / tw.dur);
      tw.update(tw.ease(k));
      if (k >= 1) { tweens.splice(i, 1); tw.res(); }
    }
  }

  /* ============================== texture helpers ============================== */
  const disposables = [];
  function canvasTexture(size, draw) {
    const c = document.createElement('canvas'); c.width = c.height = size;
    draw(c.getContext('2d'), size);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; disposables.push(tex); return tex;
  }
  const waffleTex = canvasTexture(256, (ctx, s) => {
    ctx.fillStyle = '#d99a55'; ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#b97a3c'; ctx.lineWidth = 10;
    for (let i = -s; i < s * 2; i += 42) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + s, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i + s, 0); ctx.lineTo(i, s); ctx.stroke();
    }
  });
  waffleTex.wrapS = waffleTex.wrapT = THREE.RepeatWrapping; waffleTex.repeat.set(3, 1.6);
  const mats2 = { waffle: new THREE.MeshStandardMaterial({ map: waffleTex, roughness: 0.8, side: THREE.DoubleSide }) };

  function textSprite(text, { size = 64, color = '#2b2440', bg = null, scale = 1 } = {}) {
    const tex = canvasTexture(256, (ctx, s) => {
      if (bg) { ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(8, s / 2 - size, s - 16, size * 2, 30); ctx.fill(); }
      ctx.font = `900 ${size}px ui-rounded, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = color; ctx.fillText(text, s / 2, s / 2 + 4);
    });
    const m = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sp = new THREE.Sprite(m); sp.scale.setScalar(scale); return sp;
  }
  function emojiSprite(char, scale = 1) { return textSprite(char, { size: 150, scale }); }

  /* ============================== scene builders ============================== */
  function clearGroup(g) {
    if (!g) return;
    g.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.isSprite) { o.material.map?.dispose(); o.material.dispose(); }
    });
    root.remove(g);
  }
  let stageGroup = null, latheGroup = null, tripleGroup = null, shopGroup = null;
  let paperMesh = null, sweepMesh = null, sweepEdges = null, crank = null, axisMesh = null;
  let coneCup = null, coneCream = null, coneSwirl = null, cylCream = null, machineGroup = null, streamMesh = null, signSprite = null, fillRing = null, pourRing = null;
  let confetti = [];

  function makeStage() {
    if (stageGroup || !renderer) return;
    stageGroup = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(8.6, 9.3, 0.5, 56), mats.stage);
    disc.position.y = -0.26; disc.receiveShadow = true; stageGroup.add(disc);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(8.6, 0.13, 12, 56), mats.stageRim);
    rim.rotation.x = Math.PI / 2; rim.position.y = -0.02; stageGroup.add(rim);
    // little candy sprinkles around the edge
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const sp = new THREE.Mesh(new THREE.SphereGeometry(0.14 + Math.random() * 0.08, 12, 10),
        new THREE.MeshStandardMaterial({ color: [0xff5d8f, 0xffd166, 0x06d6a0, 0x4cc9f0][i % 4], roughness: 0.4 }));
      sp.position.set(Math.cos(a) * 7.6, 0.06, Math.sin(a) * 7.6); sp.castShadow = true; stageGroup.add(sp);
    }
    root.add(stageGroup);
  }

  /* ---------- station 1: lathe ---------- */
  function profile(shapeId, r, h) {
    const pts = [];
    if (shapeId === 'rect') pts.push(new THREE.Vector2(0.001, 0), new THREE.Vector2(r, 0), new THREE.Vector2(r, h), new THREE.Vector2(0.001, h));
    if (shapeId === 'tri') pts.push(new THREE.Vector2(0.001, 0), new THREE.Vector2(r, 0), new THREE.Vector2(0.001, h));
    if (shapeId === 'semi') for (let i = 0; i <= 28; i++) { const a = -Math.PI / 2 + (i / 28) * Math.PI; pts.push(new THREE.Vector2(Math.max(0.001, Math.cos(a) * r), r + Math.sin(a) * r)); }
    if (shapeId === 'trap') pts.push(new THREE.Vector2(0.001, 0), new THREE.Vector2(r, 0), new THREE.Vector2(r * 0.55, h), new THREE.Vector2(0.001, h));
    return pts;
  }
  function solidHeight(shapeId, r, h) { return shapeId === 'semi' ? r * 2 : h; }

  function makeLathe() {
    latheGroup = new THREE.Group(); root.add(latheGroup);
    // wooden base with feet
    const base = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.45, 3.4), mats.wood);
    base.position.y = 0.22; base.castShadow = base.receiveShadow = true; latheGroup.add(base);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.16, 3.6), mats.woodDark);
    trim.position.y = 0.02; trim.receiveShadow = true; latheGroup.add(trim);
    for (const sx of [-3.3, 3.3]) for (const sz of [-1.3, 1.3]) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.3, 14), mats.woodDark);
      foot.position.set(sx, -0.12, sz); latheGroup.add(foot);
    }
    // vertical axis + top bracket + crank
    axisMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 9.4, 20), mats.metal);
    axisMesh.position.y = 4.9; axisMesh.castShadow = true; latheGroup.add(axisMesh);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 0.28, 20), mats.metal);
    cap.position.y = 0.55; latheGroup.add(cap);
    const topHub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.34, 20), mats.metal);
    topHub.position.y = 9.65; latheGroup.add(topHub);
    crank = new THREE.Group(); crank.position.y = 9.85;
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.14, 0.14), mats.machine); arm.position.x = 0.85; arm.castShadow = true;
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.26, 18, 14), new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.4 })); knob.position.x = 1.7; knob.castShadow = true;
    crank.add(arm, knob); latheGroup.add(crank);
    rebuildLathe(true);
  }

  function rebuildLathe(full = false) {
    if (!latheGroup) return;
    const sh = shapes[state.shape], r = state.r, h = state.h;
    const pts = profile(sh.id, r, h);
    if (full) {
      if (paperMesh) { paperMesh.geometry.dispose(); latheGroup.remove(paperMesh); }
      const shp = new THREE.Shape(); shp.moveTo(pts[0].x, pts[0].y); pts.slice(1).forEach((p) => shp.lineTo(p.x, p.y)); shp.closePath();
      paperMesh = new THREE.Mesh(new THREE.ShapeGeometry(shp), mats.paper);
      paperMesh.position.y = 0.46; paperMesh.castShadow = true; latheGroup.add(paperMesh);
    }
    paperMesh.rotation.y = -Math.PI - state.phi; // paper rides the sweep's leading edge
    if (sweepMesh) { sweepMesh.geometry.dispose(); latheGroup.remove(sweepMesh); sweepMesh = null; }
    if (sweepEdges) { sweepEdges.geometry.dispose(); latheGroup.remove(sweepEdges); sweepEdges = null; }
    if (state.phi > 0.02) {
      const geo = new THREE.LatheGeometry(pts, 72, -Math.PI / 2 - state.phi, state.phi);
      sweepMesh = new THREE.Mesh(geo, mats.sweep); sweepMesh.position.y = 0.46; latheGroup.add(sweepMesh);
      if (state.phi >= Math.PI * 2 - 0.01) {
        sweepEdges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
        sweepEdges.position.y = 0.46; latheGroup.add(sweepEdges);
      }
    }
    if (crank) crank.rotation.y = -state.phi;
  }

  function setPhi(v) {
    const before = state.phi;
    state.phi = Math.max(0, Math.min(Math.PI * 2, v));
    rebuildLathe();
    if (state.phi >= Math.PI * 2 && before < Math.PI * 2) finishShape();
  }

  function finishShape() {
    state.formed = true;
    const sh = shapes[state.shape];
    if (!state.atlas.has(sh.id)) {
      state.atlas.add(sh.id);
      toast(state.atlas.size === 4 ? t('allMade') : t('made')(loc(sh.solidKey)), state.atlas.size === 4);
      burstStars(new THREE.Vector3(0, solidHeight(sh.id, state.r, state.h) * 0.5 + 0.6, 0), latheGroup);
    }
    renderLathePanel(); renderScore();
  }

  async function autoSpin() {
    if (state.busy || state.station !== 'lathe') return;
    state.busy = true;
    if (state.phi >= Math.PI * 2) { state.formed = false; await tween(0.3, (k) => setPhi((1 - k) * Math.PI * 2)); }
    await tween(1.7, (k) => setPhi(k * Math.PI * 2), easeInOut);
    state.busy = false; renderLathePanel();
  }

  function burstStars(at, parent) {
    if (!renderer || !parent) return;
    for (let i = 0; i < 26; i++) {
      const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.13), new THREE.MeshBasicMaterial({ color: [0xffd166, 0xff5d8f, 0x06d6a0, 0x4cc9f0][i % 4] }));
      m.position.copy(at);
      m.userData.v = new THREE.Vector3((Math.random() - 0.5) * 0.14, Math.random() * 0.12 + 0.05, (Math.random() - 0.5) * 0.14);
      m.userData.parent = parent; parent.add(m); confetti.push(m);
    }
  }

  /* ---------- station 2: triple mystery ---------- */
  function coneCupBuild(r, h) {
    const g = new THREE.Group();
    const shell = new THREE.Mesh(new THREE.ConeGeometry(r, h, 44, 1, true), mats2.waffle);
    shell.rotation.x = Math.PI; shell.position.y = h / 2; shell.castShadow = true; g.add(shell);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 10, 44), mats.woodDark);
    rim.rotation.x = Math.PI / 2; rim.position.y = h; g.add(rim);
    // cream cone: apex anchored at bottom so uniform scale = fill level
    const innerR = r * 0.92, innerH = h * 0.94;
    const cgeo = new THREE.ConeGeometry(innerR, innerH, 44);
    cgeo.rotateX(Math.PI); cgeo.translate(0, innerH / 2, 0);
    coneCream = new THREE.Mesh(cgeo, mats.cream); coneCream.position.y = 0.03; coneCream.scale.setScalar(0.001); g.add(coneCream);
    coneSwirl = new THREE.Group();
    const s1 = new THREE.Mesh(new THREE.SphereGeometry(r * 0.72, 22, 16), mats.cream); s1.position.y = 0.1; s1.scale.y = 0.72;
    const s2 = new THREE.Mesh(new THREE.SphereGeometry(r * 0.48, 20, 14), mats.cream); s2.position.y = r * 0.52; s2.scale.y = 0.78;
    const ch = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), mats.cherry); ch.position.y = r * 0.52 + r * 0.42;
    coneSwirl.add(s1, s2, ch); coneSwirl.position.y = h; coneSwirl.scale.setScalar(0.001); g.add(coneSwirl);
    // generous invisible hit target so small hands can grab the cup easily
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.7, r + 0.7, h + 1.4, 12), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    hit.position.y = (h + 1.4) / 2 - 0.2; g.add(hit);
    g.userData.h = h;
    return g;
  }

  function makeMachine() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.3, 3.1, 30), mats.machine);
    body.position.y = 1.55; body.castShadow = true; g.add(body);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.15, 30, 18, 0, Math.PI * 2, 0, Math.PI / 2), mats.machineTop);
    dome.position.y = 3.1; dome.castShadow = true; g.add(dome);
    const swirlTop = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.9, 20), mats.creamPink); swirlTop.position.y = 4.35; g.add(swirlTop);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.62, 20, 14), mats.creamPink); ball.position.y = 3.85; g.add(ball);
    // face
    for (const ex of [-0.42, 0.42]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), new THREE.MeshStandardMaterial({ color: 0x2b2440, roughness: 0.3 }));
      eye.position.set(ex, 2.35, 1.16); g.add(eye);
    }
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 8, 18, Math.PI), new THREE.MeshStandardMaterial({ color: 0x2b2440, roughness: 0.3 }));
    mouth.position.set(0, 2.05, 1.18); mouth.rotation.z = Math.PI; g.add(mouth);
    // arm + downward nozzle above the fill spot
    const armDir = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.22, 0.22), mats.metal);
    armDir.position.set(0.75, 3.55, 0.4); g.add(armDir);
    const noz = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.6, 16), mats.metal);
    noz.position.set(1.5, 3.25, 0.4); noz.castShadow = true; g.add(noz);
    return g;
  }

  function tickLabel(text, x, y) {
    const sp = textSprite(text, { size: 76, color: '#ffffff', bg: 'rgba(43,36,64,.65)', scale: 0.85 });
    sp.position.set(x, y, 0); return sp;
  }

  function makeTriple() {
    tripleGroup = new THREE.Group(); root.add(tripleGroup);
    // machine sits so nozzle is exactly above FILL_SPOT
    machineGroup = makeMachine(); machineGroup.position.set(FILL_SPOT.x - 1.5, 0, FILL_SPOT.z - 0.4); tripleGroup.add(machineGroup);
    // stream (hidden by default)
    streamMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 1, 12), mats.cream);
    streamMesh.visible = false; tripleGroup.add(streamMesh);
    // cone cup
    const dims = state.equal ? CONE_EQ : CONE_NEQ;
    coneCup = coneCupBuild(dims.r, dims.h); coneCup.position.copy(CONE_HOME); tripleGroup.add(coneCup);
    // glass cylinder cup with tick rings
    const cyl = new THREE.Group(); cyl.position.copy(CYL_SPOT);
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(CUP.R, CUP.R, CUP.H, 48, 1, true), mats.glass);
    glass.position.y = CUP.H / 2; cyl.add(glass);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(CUP.R + 0.12, CUP.R + 0.18, 0.14, 48), mats.metal);
    foot.position.y = 0.07; foot.castShadow = true; cyl.add(foot);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(CUP.R, 0.045, 10, 48), mats.metal);
    lip.rotation.x = Math.PI / 2; lip.position.y = CUP.H; cyl.add(lip);
    for (let i = 1; i <= 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(CUP.R + 0.02, 0.022, 8, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 }));
      ring.rotation.x = Math.PI / 2; ring.position.y = (i / 3) * CUP.H; cyl.add(ring);
      cyl.add(tickLabel(`${i}/3`, CUP.R + 0.75, (i / 3) * CUP.H));
    }
    cylCream = new THREE.Mesh(new THREE.CylinderGeometry(CUP.R * 0.93, CUP.R * 0.93, 1, 48), mats.cream);
    cylCream.scale.y = 0.001; cylCream.position.y = 0; cyl.add(cylCream);
    tripleGroup.add(cyl);
    // ×1/3 neon sign hanging above
    signSprite = textSprite('× 1/3', { size: 88, color: '#ffffff', bg: 'rgba(255,93,143,.9)', scale: 2.2 });
    signSprite.position.set(0, 5.2, -1.8); signSprite.material.opacity = 0.25; tripleGroup.add(signSprite);
    // drop-zone rings on the floor
    fillRing = new THREE.Mesh(new THREE.RingGeometry(0.7, 1.05, 40), mats.ring.clone());
    fillRing.rotation.x = -Math.PI / 2; fillRing.position.set(FILL_SPOT.x, 0.02, FILL_SPOT.z); tripleGroup.add(fillRing);
    pourRing = new THREE.Mesh(new THREE.RingGeometry(CUP.R + 0.2, CUP.R + 0.55, 40), mats.ring.clone());
    pourRing.rotation.x = -Math.PI / 2; pourRing.position.set(CYL_SPOT.x, 0.02, CYL_SPOT.z); tripleGroup.add(pourRing);
    syncTripleVisuals();
  }

  function cupRatio() {
    const c = state.equal ? CONE_EQ : CONE_NEQ;
    return (c.r * c.r * c.h / 3) / (CUP.R * CUP.R * CUP.H);
  }
  function syncTripleVisuals() {
    if (!renderer || !cylCream) return;
    const f = Math.min(1, state.scoops * cupRatio());
    cylCream.scale.y = Math.max(0.001, f * (CUP.H - 0.08));
    cylCream.position.y = cylCream.scale.y / 2 + 0.02;
    if (coneCream) coneCream.scale.setScalar(state.coneFilled ? 1 : 0.001);
    if (coneSwirl) coneSwirl.scale.setScalar(state.coneFilled ? 1 : 0.001);
  }

  async function moveCup(to, dur = 0.55) {
    const from = coneCup.position.clone();
    await tween(dur, (k) => {
      coneCup.position.lerpVectors(from, to, k);
      coneCup.position.y += Math.sin(k * Math.PI) * 0.7; // little hop
    }, easeInOut);
    coneCup.position.copy(to);
  }

  async function streamOn(x, z, topY, botY, dur) {
    if (!streamMesh) return wait(dur);
    streamMesh.visible = true;
    streamMesh.position.set(x, (topY + botY) / 2, z);
    streamMesh.scale.y = (topY - botY);
    await wait(dur);
    streamMesh.visible = false;
  }

  async function doFill() {
    if (state.station !== 'triple' || state.busy) return;
    if (state.coneFilled) { toast(t('alreadyFull')); return; }
    if (state.scoops * cupRatio() >= 0.999) { toast(t('cylFullTip')); return; }
    state.busy = true; bumpIdle(); renderTriplePanel();
    if (renderer && coneCup) {
      await moveCup(FILL_SPOT);
      const dims = state.equal ? CONE_EQ : CONE_NEQ;
      const p1 = streamOn(FILL_SPOT.x, FILL_SPOT.z, 2.95, dims.h - 0.1, 0.9);
      const p2 = (async () => { await wait(0.15); await tween(0.85, (k) => { coneCream.scale.setScalar(Math.max(0.001, k)); }); })();
      await Promise.all([p1, p2]);
      await tween(0.35, (k) => { coneSwirl.scale.setScalar(Math.max(0.001, k)); });
      state.coneFilled = true;
      await moveCup(CONE_HOME);
    } else { state.coneFilled = true; }
    toast(t('coneFull'));
    state.busy = false; renderTriplePanel();
  }

  async function doPour() {
    if (state.station !== 'triple' || state.busy) return;
    if (!state.coneFilled) { toast(t('coneEmptyTip')); return; }
    if (state.scoops * cupRatio() >= 0.999) { toast(t('cylFullTip')); return; }
    state.busy = true; bumpIdle(); renderTriplePanel();
    const startScoops = state.scoops;
    if (renderer && coneCup) {
      const over = new THREE.Vector3(CYL_SPOT.x - 2.0, CUP.H + 1.9, CYL_SPOT.z);
      await moveCup(over, 0.6);
      await tween(0.3, (k) => { coneCup.rotation.z = -k * 2.1; });
      const f0 = Math.min(1, startScoops * cupRatio()), f1 = Math.min(1, (startScoops + 1) * cupRatio());
      const p1 = streamOn(CYL_SPOT.x + 0.3, CYL_SPOT.z, 3.1, f0 * CUP.H + 0.1, 1.0);
      const p2 = tween(1.0, (k) => {
        const s = Math.max(0.001, 1 - k); coneCream.scale.setScalar(s); coneSwirl.scale.setScalar(s);
        const f = f0 + (f1 - f0) * k;
        cylCream.scale.y = Math.max(0.001, f * (CUP.H - 0.08)); cylCream.position.y = cylCream.scale.y / 2 + 0.02;
      }, (k) => k);
      await Promise.all([p1, p2]);
      await tween(0.25, (k) => { coneCup.rotation.z = -(1 - k) * 2.1; });
      await moveCup(CONE_HOME, 0.55);
    }
    state.coneFilled = false; state.scoops += 1;
    const full = state.scoops * cupRatio() >= 0.999;
    if (state.equal && state.scoops === 3) {
      toast(t('magic'), true);
      if (renderer) {
        burstStars(new THREE.Vector3(CYL_SPOT.x, CUP.H + 1, CYL_SPOT.z), tripleGroup);
        tween(0.8, (k) => { signSprite.material.opacity = 0.25 + k * 0.75; signSprite.scale.setScalar(2.2 + Math.sin(k * Math.PI) * 0.8); });
      }
    } else if (!state.equal && state.scoops === 4 && !full) {
      toast(t('unequalMsg'), true);
    } else if (full && !state.equal) {
      toast(t('cupsCount')(state.scoops));
    }
    state.busy = false; renderTriplePanel();
  }

  function resetTriple(unequal) {
    if (state.busy) return;
    state.equal = !unequal; state.scoops = 0; state.coneFilled = false;
    if (renderer) { clearGroup(tripleGroup); makeTriple(); }
    renderTriplePanel();
    toast(unequal ? t('unequalStart') : t('equalStart'));
  }

  /* ---------- station 3: shop ---------- */
  let productCone = null, productCup = null, customerSprite = null;
  function makeShop() {
    shopGroup = new THREE.Group(); root.add(shopGroup);
    const counter = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.1, 2.6), mats.counter);
    counter.position.y = 0.55; counter.castShadow = counter.receiveShadow = true; shopGroup.add(counter);
    const top = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.18, 2.9), mats.wood);
    top.position.y = 1.18; top.castShadow = true; shopGroup.add(top);
    // striped awning
    const awn = new THREE.Group(); awn.position.set(0, 5.6, 0.4);
    for (let i = 0; i < 8; i++) {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 2.2), i % 2 ? mats.machine : mats.machineTop);
      seg.position.x = -3.35 + i * 0.96; seg.rotation.x = -0.28; seg.castShadow = true; awn.add(seg);
    }
    shopGroup.add(awn);
    for (const px of [-3.5, 3.5]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.5, 14), mats.metal);
      pole.position.set(px, 3.4, 1.3); shopGroup.add(pole);
    }
    rebuildShopProducts();
  }

  function rebuildShopProducts() {
    if (!renderer || !shopGroup) return;
    for (const p of [productCone, productCup]) if (p) { clearGroupLocal(shopGroup, p); }
    if (customerSprite) { shopGroup.remove(customerSprite); customerSprite.material.map?.dispose(); customerSprite.material.dispose(); customerSprite = null; }
    const o = orders[state.order % orders.length];
    const S = 0.19; // world units per problem unit
    // cone product: waffle cone (apex down) + honest cream cone above? keep the pure cone of cream inside waffle
    productCone = new THREE.Group(); productCone.position.set(-1.9, 1.27, 0.3);
    const cr = o.cone[0] * S, chh = o.cone[1] * S;
    const shell = new THREE.Mesh(new THREE.ConeGeometry(cr, chh, 40, 1, true), mats2.waffle);
    shell.rotation.x = Math.PI; shell.position.y = chh / 2; shell.castShadow = true; productCone.add(shell);
    const creamTop = new THREE.Mesh(new THREE.SphereGeometry(cr * 0.98, 26, 18, 0, Math.PI * 2, 0, Math.PI / 2), mats.creamPink);
    creamTop.position.y = chh; creamTop.scale.y = 0.5; productCone.add(creamTop);
    const cherry1 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), mats.cherry); cherry1.position.y = chh + cr * 0.52; productCone.add(cherry1);
    productCone.add(labelAbove('🍦', chh + cr + 0.7));
    shopGroup.add(productCone);
    // cup product: glass cylinder full of cream
    productCup = new THREE.Group(); productCup.position.set(1.9, 1.27, 0.3);
    const ur = o.cyl[0] * S, uh = o.cyl[1] * S;
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(ur + 0.04, ur + 0.04, uh + 0.08, 40, 1, true), mats.glass);
    glass.position.y = (uh + 0.08) / 2; productCup.add(glass);
    const creamIn = new THREE.Mesh(new THREE.CylinderGeometry(ur, ur, uh, 40), mats.creamPink);
    creamIn.position.y = uh / 2; creamIn.castShadow = true; productCup.add(creamIn);
    const cherry2 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), mats.cherry); cherry2.position.y = uh + 0.12; productCup.add(cherry2);
    productCup.add(labelAbove('🥤', uh + 0.9));
    shopGroup.add(productCup);
    // customer
    customerSprite = emojiSprite(CUSTOMERS[state.order % CUSTOMERS.length], 1.9);
    customerSprite.position.set(0, 2.1, 2.6); shopGroup.add(customerSprite);
  }
  function labelAbove(char, y) { const sp = emojiSprite(char, 1.0); sp.position.y = y; return sp; }
  function clearGroupLocal(parent, g) { g.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.isSprite) { o.material.map?.dispose(); o.material.dispose(); } }); parent.remove(g); }

  /* ============================== camera & theme ============================== */
  function updateCamera() {
    orbit.yaw += (orbit.tyaw - orbit.yaw) * 0.14;
    orbit.pitch += (orbit.tpitch - orbit.pitch) * 0.14;
    orbit.dist += (orbit.tdist - orbit.dist) * 0.14;
    const lookY = state.station === 'lathe' ? 3.4 : 2.2;
    orbit.ly = orbit.ly === undefined ? lookY : orbit.ly + (lookY - orbit.ly) * 0.1;
    const p = orbit.pitch;
    camera.position.set(Math.sin(orbit.yaw) * Math.cos(p) * orbit.dist, Math.sin(p) * orbit.dist + 2.6, Math.cos(orbit.yaw) * Math.cos(p) * orbit.dist);
    camera.lookAt(0, orbit.ly, 0);
  }
  function resize() {
    if (!renderer) return;
    const box = canvas.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(box.width, box.height, false);
    camera.aspect = box.width / Math.max(1, box.height); camera.updateProjectionMatrix();
  }
  function updateTheme() {
    if (!renderer) return;
    scene.background = new THREE.Color(cssVar('--sky') || '#ffe9f2');
    scene.fog = new THREE.Fog(scene.background, 26, 60);
    hemi.groundColor.set(theme === 'dark' ? 0x241a3e : 0xffd9e8);
    hemi.intensity = theme === 'dark' ? 1.1 : 1.5;
    mats.stage.color.set(theme === 'dark' ? 0x4a3558 : 0xf7cfe0);
    mats.stageRim.color.set(theme === 'dark' ? 0x5d4470 : 0xdba7c2);
    mats.sweep.color.set(cssVar('--accent') || '#ff7ab6');
  }

  /* ============================== UI render ============================== */
  function renderLathePanel() {
    $('#shapeButtons').innerHTML = shapes.map((s, i) => `<button class="btn btn--ghost ${i === state.shape ? 'is-active' : ''}" data-shape="${i}" type="button">${s.icon} ${t(s.id)}</button>`).join('');
    $('#radiusVal').textContent = state.r; $('#heightVal').textContent = state.h;
    $('#heightRow').style.display = shapes[state.shape].id === 'semi' ? 'none' : '';
    const sh = shapes[state.shape];
    let line = t('spinsInto')(t(sh.id), loc(sh.solidKey));
    if (state.formed) {
      if (sh.id === 'rect') line = `${loc(sh.solidKey)}：${t('volCyl')(state.r, state.h)}`;
      if (sh.id === 'tri') line = `${loc(sh.solidKey)}：${t('volCone')(state.r, state.h)}`;
      if (sh.id === 'semi') line = `${loc(sh.solidKey)}：${t('volSphere')(state.r)}`;
      if (sh.id === 'trap') line = `${loc(sh.solidKey)}：${t('volFrustum')}`;
    }
    $('#latheFormula').textContent = line;
    $('#spinBtn').textContent = state.phi >= Math.PI * 2 ? t('spinAgain') : t('spinBtn');
    $('#atlasList').innerHTML = shapes.map((s) => `<span class="chip ${state.atlas.has(s.id) ? 'is-got' : ''}">${state.atlas.has(s.id) ? '✅' : '❔'} ${loc(s.solidKey)}</span>`).join('');
  }
  function renderTriplePanel() {
    const full = state.scoops * cupRatio() >= 0.999;
    $('#tripleReadout').textContent = (state.equal && full) ? t('tripleFull')(state.scoops) : t('cupsCount')(state.scoops);
    $('#fillCone').disabled = state.busy || state.coneFilled || full;
    $('#pourCone').disabled = state.busy || !state.coneFilled || full;
  }
  function renderShopPanel() {
    const o = orders[state.order % orders.length];
    $('#customerEmoji').textContent = CUSTOMERS[state.order % CUSTOMERS.length];
    $('#shopQuestion').textContent = t('order')(t('coneDesc')(...o.cone), t('cupDesc')(...o.cyl));
    $('#shopFormula').hidden = !state.answered;
    if (state.answered) {
      const cv = o.cone[0] ** 2 * o.cone[1] / 3, yv = o.cyl[0] ** 2 * o.cyl[1];
      $('#shopFormula').textContent = t('reveal')(Math.round(cv * 100) / 100, yv, t(o.ans));
    }
    $('#shopChoices').innerHTML = ['cone', 'cyl', 'equal'].map((a) => `<button class="btn btn--ghost" data-answer="${a}" type="button" ${state.answered ? 'disabled' : ''}>${t(a)}</button>`).join('');
    if (state.answered) {
      const btn = $(`#shopChoices [data-answer="${o.ans}"]`); btn?.classList.add('choice-good');
    }
  }
  function renderScore() {
    $('#atlas').textContent = `📘 ${state.atlas.size}/4`;
    $('#money').textContent = `🪙 ${state.money}`;
    $('#branch').textContent = `🏪 ${Math.min(100, Math.round(state.money / 6 * 100))}%`;
  }
  function render() {
    document.querySelectorAll('.station-panel').forEach((p) => { p.hidden = p.id !== `${state.station}Panel`; });
    document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('is-active', b.dataset.station === state.station));
    renderScore();
    if (state.station === 'lathe') renderLathePanel();
    if (state.station === 'triple') renderTriplePanel();
    if (state.station === 'shop') renderShopPanel();
  }

  function setStation(s) {
    if (state.busy || s === state.station) { render(); return; }
    state.station = s; bumpIdle();
    if (renderer) {
      clearGroup(latheGroup); latheGroup = null;
      clearGroup(tripleGroup); tripleGroup = null;
      clearGroup(shopGroup); shopGroup = null;
      paperMesh = sweepMesh = sweepEdges = null;
      if (s === 'lathe') { makeLathe(); orbit.tdist = 15; orbit.tpitch = 0.32; }
      if (s === 'triple') { state.scoops = 0; state.coneFilled = false; state.equal = true; makeTriple(); orbit.tdist = 12.5; orbit.tpitch = 0.38; }
      if (s === 'shop') { makeShop(); orbit.tdist = 12; orbit.tpitch = 0.34; }
      orbit.tyaw = -0.35;
    }
    render();
  }

  /* ============================== pointer interaction ============================== */
  let dragCone = false, spinDrag = false;
  function castPointer(e) {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
  }
  function onPointerDown(e) {
    if (!renderer) return;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('is-grabbing');
    orbit.down = true; orbit.x = e.clientX; orbit.y = e.clientY;
    bumpIdle();
    castPointer(e);
    if (state.station === 'lathe' && !state.busy) {
      const targets = [paperMesh, sweepMesh, crank].filter(Boolean);
      if (raycaster.intersectObjects(targets, true)[0]) { spinDrag = true; if (state.phi >= Math.PI * 2) { state.formed = false; state.phi = 0; rebuildLathe(); } return; }
    }
    if (state.station === 'triple' && !state.busy && coneCup) {
      if (raycaster.intersectObject(coneCup, true)[0]) {
        dragCone = true;
        dragPlane.set(new THREE.Vector3(0, 1, 0), -0.0);
        tween(0.18, (k) => { coneCup.position.y = k * 0.6; });
        fillRing.material.opacity = 0.55; pourRing.material.opacity = 0.55;
        return;
      }
    }
  }
  function onPointerMove(e) {
    if (!renderer || !orbit.down) return;
    const dx = e.clientX - orbit.x, dy = e.clientY - orbit.y; orbit.x = e.clientX; orbit.y = e.clientY;
    if (spinDrag) { setPhi(state.phi + Math.abs(dx) * 0.02 + Math.abs(dy) * 0.008); return; }
    if (dragCone && coneCup) {
      castPointer(e);
      if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
        coneCup.position.x = THREE.MathUtils.clamp(dragPoint.x, -5, 5);
        coneCup.position.z = THREE.MathUtils.clamp(dragPoint.z, -3, 3.5);
        const nearFill = coneCup.position.distanceTo(new THREE.Vector3(FILL_SPOT.x, coneCup.position.y, FILL_SPOT.z)) < 1.3;
        const nearPour = coneCup.position.distanceTo(new THREE.Vector3(CYL_SPOT.x, coneCup.position.y, CYL_SPOT.z)) < 1.6;
        fillRing.material.opacity = nearFill ? 0.95 : 0.55;
        pourRing.material.opacity = nearPour ? 0.95 : 0.55;
      }
      return;
    }
    orbit.tyaw -= dx * 0.006;
    orbit.tpitch = Math.max(-0.15, Math.min(1.05, orbit.tpitch - dy * 0.006));
  }
  async function onPointerUp(e) {
    orbit.down = false; canvas?.classList.remove('is-grabbing');
    canvas?.releasePointerCapture?.(e.pointerId);
    if (spinDrag) { spinDrag = false; renderLathePanel(); return; }
    if (dragCone && coneCup) {
      dragCone = false;
      fillRing.material.opacity = 0; pourRing.material.opacity = 0;
      const nearFill = coneCup.position.distanceTo(new THREE.Vector3(FILL_SPOT.x, coneCup.position.y, FILL_SPOT.z)) < 1.3;
      const nearPour = coneCup.position.distanceTo(new THREE.Vector3(CYL_SPOT.x, coneCup.position.y, CYL_SPOT.z)) < 1.6;
      coneCup.position.y = 0;
      if (nearFill && !state.coneFilled) { coneCup.position.copy(FILL_SPOT); await doFill(); return; }
      if (nearPour && state.coneFilled) { await doPour(); return; }
      if (!state.busy) moveCup(CONE_HOME, 0.4);
    }
  }

  /* ============================== main loop ============================== */
  let last = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    stepTweens(dt);
    if (renderer) {
      // idle micro-motions
      if (state.station === 'lathe' && crank && !state.busy && !spinDrag && state.phi === 0) crank.rotation.y -= dt * 0.5;
      if (customerSprite) customerSprite.position.y = 2.1 + Math.sin(now / 600) * 0.08;
      if (signSprite && state.equal && state.scoops >= 3) signSprite.material.opacity = 0.75 + Math.sin(now / 240) * 0.25;
      confetti = confetti.filter((c) => {
        c.position.add(c.userData.v); c.userData.v.y -= 0.0045; c.rotation.x += 0.12; c.rotation.z += 0.08;
        if (c.position.y < -0.3) { c.userData.parent?.remove(c); c.geometry.dispose(); return false; }
        return true;
      });
      updateCamera();
      renderer.render(scene, camera);
    }
    // gentle idle hint after 30s of no interaction
    if (!bumpIdle.shown && performance.now() - bumpIdle.at > 30000 && !state.busy) {
      bumpIdle.shown = true;
      toast(t(state.station === 'lathe' ? 'idleLathe' : state.station === 'triple' ? 'idleTriple' : 'idleShop'));
    }
  }

  /* ============================== lang / theme ============================== */
  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((n) => { const v = I18N[lang][n.dataset.t]; if (typeof v === 'string') n.textContent = v; });
    if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    render();
  }
  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    updateTheme();
  }

  /* ============================== events ============================== */
  langBtn?.addEventListener('click', () => { lang = lang === 'zh' ? 'en' : 'zh'; store.set(LS.lang, lang); applyLang(); });
  themeBtn?.addEventListener('click', () => { theme = theme === 'light' ? 'dark' : 'light'; store.set(LS.theme, theme); applyTheme(); });
  addEventListener('resize', resize);
  canvas?.addEventListener('pointerdown', onPointerDown);
  canvas?.addEventListener('pointermove', onPointerMove);
  canvas?.addEventListener('pointerup', onPointerUp);
  canvas?.addEventListener('pointercancel', onPointerUp);
  canvas?.addEventListener('wheel', (e) => { e.preventDefault(); orbit.tdist = Math.max(7, Math.min(22, orbit.tdist + Math.sign(e.deltaY))); }, { passive: false });
  document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => setStation(b.dataset.station)));

  $('#shapeButtons').addEventListener('click', (e) => {
    const b = e.target.closest('[data-shape]'); if (!b || state.busy) return;
    state.shape = +b.dataset.shape; state.phi = 0; state.formed = false; bumpIdle();
    if (renderer) rebuildLathe(true);
    renderLathePanel();
  });
  $('#radius').addEventListener('input', (e) => { if (state.busy) { e.target.value = state.r; return; } state.r = +e.target.value; state.phi = 0; state.formed = false; if (renderer) rebuildLathe(true); renderLathePanel(); bumpIdle(); });
  $('#height').addEventListener('input', (e) => { if (state.busy) { e.target.value = state.h; return; } state.h = +e.target.value; state.phi = 0; state.formed = false; if (renderer) rebuildLathe(true); renderLathePanel(); bumpIdle(); });
  $('#spinBtn').addEventListener('click', autoSpin);

  $('#fillCone').addEventListener('click', doFill);
  $('#pourCone').addEventListener('click', doPour);
  $('#resetTriple').addEventListener('click', () => resetTriple(false));
  $('#unequal').addEventListener('click', () => resetTriple(true));

  let shopTimer = null;
  function advanceOrder() {
    clearTimeout(shopTimer); shopTimer = null;
    state.order += 1; state.answered = false;
    renderShopPanel(); rebuildShopProducts(); bumpIdle();
  }
  $('#shopChoices').addEventListener('click', (e) => {
    const b = e.target.closest('[data-answer]'); if (!b || state.answered) return;
    bumpIdle();
    const o = orders[state.order % orders.length];
    const ok = b.dataset.answer === o.ans;
    state.answered = true;
    renderShopPanel();
    if (!ok) $(`#shopChoices [data-answer="${b.dataset.answer}"]`)?.classList.add('choice-bad');
    toast(ok ? t('right') : t('wrong'));
    if (ok) {
      state.money += 1; renderScore();
      if (renderer && shopGroup) burstStars(new THREE.Vector3(0, 3, 1), shopGroup);
      if (state.money >= 6 && !state.branchToasted) { state.branchToasted = true; setTimeout(() => toast(t('branchDone'), true), 1600); }
      shopTimer = setTimeout(advanceOrder, 2200);
    }
  });
  $('#nextOrder').addEventListener('click', advanceOrder);

  /* ============================== boot ============================== */
  applyTheme(); applyLang();
  makeStage();
  if (renderer) { makeLathe(); orbit.tdist = 15; orbit.tpitch = 0.32; }
  render(); resize();
  requestAnimationFrame(loop);
})();
