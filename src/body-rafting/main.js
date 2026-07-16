import * as THREE from './vendor/three.module.min.js';
(() => {
  'use strict'; const I18N = {
    zh: {
doc: '消化道漂流记 · KidsLab', back: '返回平台', title: '消化道漂流记', eyebrow: '人体消化系统 · 轨道漂流体验', heroTitle: '把自己缩小，坐上皮划艇随一口饭出发！', tip0: '按住屏幕左/右半边或拖动，让小艇躲浪、收集营养金币。', foodRice: '米饭', foodCandy: '糖果', foodFat: '肥肉',
steady: '稳一点', unsteady: '浪一点', soundOn: '声音开', soundOff: '静音', start: '开始漂流', restart: '再漂一次', chewBtn: '咀嚼！', tapBtn: '跟拍！', dodgeBtn: '抓稳！', collectBtn: '收金币', absorbBtn: '吸水！', finishBtn: '冲刺！',
nogl: '你的浏览器暂不支持 WebGL，但消化道图鉴仍可学习。', codexTitle: '器官图鉴', codexHint: '每穿过一段河道，就解锁一张知识卡。', locked: '漂到这里解锁', coins: (n) => `营养金币 ${n} 枚`, stars: (n) => `任务星级 ${n}/18`, finishTitle: '漂流完成！😆',
finishDesc: (coins, stars, food) => `你驾驶 ${food} 号小艇穿过 6 段消化道，收集 ${coins} 枚营养金币，得到 ${stars}/18 颗星。`, organMouth: '口腔 / Mouth', organEsophagus: '食道 / Esophagus', organStomach: '胃 / Stomach',
organSmall: '小肠 / Small Intestine', organLarge: '大肠 / Large Intestine', organExit: '出口 / Exit', missionMouth: (n) => `连点「咀嚼」${n}/20：牙齿把大食物块嚼碎`, missionEsophagus: (n) => `跟着蠕动节奏点拍子 ${n}/5：食道靠肌肉波推动食物`,
missionStomach: (n, h) => `左右躲开胃酸大浪 ${n}/3（碰到会冒烟但不会失败） · 命中 ${h}`, missionSmall: (n) => `小肠绒毛森林：左右移动收集营养金币 ${n} 枚`, missionLarge: (n) => `按「吸水」${n}/3：大肠回收水分，让残渣变干`, missionExit: '灯光变暗——含蓄地冲出最后出口！',
toastStart: '缩小完成！消化道河流开放 🚣', toastChew: '咔嚓！食物变小，唾液瀑布冲下来了。淀粉在这里开始变甜！🍚→🍬', toastRhythm: '咚！蠕动波把小艇往前推。', toastStomach: '胃酸漩涡启动！胃壁有黏液涂层保护自己不被消化。', toastHit: '噗——酸浪命中！小艇冒烟但还很勇敢。', toastDodge: '漂亮！躲过一朵胃酸浪。',
toastMagic: '魔法时刻：营养金币被吸进绒毛旁的血流，开始送往全身 ✨', toastWater: '咻——身体把水分回收啦。', toastExit: '黑屏、冲水声、你懂的 😆', candyBonus: '糖果剧本：糖在口腔就开始被吸收，小艇一路狂飙！', fatBonus: '肥肉剧本：胃里堵船，多转一圈，胆汁小人来救场！', riceBonus: '米饭剧本：淀粉先在口腔遇见唾液，慢慢变甜。',
mouthDo: '牙齿切碎食物，唾液把食物打湿，淀粉开始分解。', mouthFun: '趣味数字：人一生大约会分泌几万升唾液。', esoDo: '食道不是靠重力，而是靠一圈圈肌肉蠕动把食物送下去。', esoFun: '趣味数字：食物通常几秒钟就能滑到胃。', stomachDo: '胃搅拌食物，胃酸和酶把蛋白质拆成更小的部分。', stomachFun: '彩蛋：胃壁有黏液保护层，所以不会把自己消化掉。',
smallDo: '小肠绒毛大大增加表面积，营养从这里进入血液。', smallFun: '趣味数字：小肠大约 5–7 米，是吸收主力。', largeDo: '大肠主要回收水分和盐分，让剩余残渣慢慢变干。', largeFun: '趣味数字：这里住着许多帮忙的肠道细菌。', exitDo: '未吸收的残渣最终离开身体，旅程结束。', exitFun: '含蓄知识点：消化系统有入口，也有出口。', }, en: {
doc: 'Digestive Rafting · KidsLab', back: 'Back to platform', title: 'Digestive Rafting', eyebrow: 'Human digestive system · rail-rafting experience',
      heroTitle: 'Shrink down and raft away with one bite of food!',
tip0: 'Hold the left/right half of the screen or drag to dodge waves and collect nutrient coins.', foodRice: 'Rice', foodCandy: 'Candy', foodFat: 'Fat',
      steady: 'Steady', unsteady: 'Wilder', soundOn: 'Sound on', soundOff: 'Muted',
start: 'Start rafting', restart: 'Raft again', chewBtn: 'Chew!', tapBtn: 'Beat!', dodgeBtn: 'Hold tight!', collectBtn: 'Collect', absorbBtn: 'Absorb!', finishBtn: 'Sprint!',
      nogl: 'Your browser does not support WebGL, but the organ cards are still here.',
codexTitle: 'Organ Codex', codexHint: 'Finish each river section to unlock a science card.', locked: 'Raft here to unlock', coins: (n) => `${n} nutrient coins`, stars: (n) => `${n}/18 task stars`,
finishTitle: 'Raft complete! 😆', finishDesc: (coins, stars, food) => `Your ${food} raft crossed all 6 digestive sections, collected ${coins} nutrient coins, and earned ${stars}/18 stars.`,
organMouth: 'Mouth / 口腔', organEsophagus: 'Esophagus / 食道', organStomach: 'Stomach / 胃', organSmall: 'Small Intestine / 小肠', organLarge: 'Large Intestine / 大肠', organExit: 'Exit / 出口',
missionMouth: (n) => `Tap “Chew” ${n}/20: teeth crush the big food chunk`, missionEsophagus: (n) => `Tap with the peristalsis beat ${n}/5: muscle waves push food along`,
      missionStomach: (n, h) => `Dodge 3 acid waves ${n}/3 (hits smoke, no game over) · hits ${h}`,
missionSmall: (n) => `Villi forest: steer left/right to collect ${n} nutrient coins`, missionLarge: (n) => `Press “Absorb” ${n}/3: the large intestine recovers water`,
      missionExit: 'Lights dim — a tasteful final exit!',
toastStart: 'Shrink complete! The digestive river is open 🚣', toastChew: 'Crunch! The food gets smaller, and saliva pours in. Starch starts turning sweet here! 🍚→🍬',
      toastRhythm: 'Thump! A peristalsis wave pushes the raft.',
toastStomach: 'Acid whirlpool online! Mucus protects the stomach wall from digesting itself.', toastHit: 'Pfft — acid wave hit! Smoky raft, still brave.', toastDodge: 'Nice dodge! One acid wave down.',
toastMagic: 'Magic moment: nutrient coins rush into blood beside the villi and head for the body ✨', toastWater: 'Whoosh — the body recycled water.', toastExit: 'Blackout, flush sound, you know the rest 😆',
candyBonus: 'Candy script: sugar starts absorbing in the mouth, so the raft goes turbo!', fatBonus: 'Fat script: stomach traffic jam! One extra spin, then the bile buddy helps.',
      riceBonus: 'Rice script: starch meets saliva first and slowly tastes sweeter.',
mouthDo: 'Teeth break food apart. Saliva wets it and begins breaking down starch.', mouthFun: 'Fun number: a person can make tens of thousands of liters of saliva in a lifetime.',
      esoDo: 'The esophagus uses waves of muscle, not gravity, to push food down.',
esoFun: 'Fun number: food usually reaches the stomach in just a few seconds.', stomachDo: 'The stomach churns food. Acid and enzymes break proteins into smaller pieces.',
      stomachFun: 'Easter egg: mucus protects the stomach so it does not digest itself.', smallDo: 'Villi give the small intestine huge surface area. Nutrients enter blood here.',
      smallFun: 'Fun number: the small intestine is about 5–7 meters long and does most absorption.',
largeDo: 'The large intestine mainly recovers water and salts, drying the leftovers.', largeFun: 'Fun number: many helpful gut bacteria live here.',
      exitDo: 'Unabsorbed leftovers finally leave the body. Journey complete.', exitFun: 'Polite science point: the digestive system has an entrance and an exit.', }, };
  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' }; const store = {
    get: (k) => { try { return localStorage.getItem(k);
    } catch { return null;
    } }, set: (k, v) => { try { localStorage.setItem(k, v);
    } catch { /* ignore */ } }, };
  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en'); if (!I18N[lang]) lang = 'zh'; let theme = store.get(LS.theme)
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme !== 'light' && theme !== 'dark') theme = 'light';
    const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const langBtn = document.getElementById('langBtn');
  const themeBtn = document.getElementById('themeBtn');
  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'; document.title = t('doc'); document.querySelectorAll('[data-t]').forEach((n) => {
      const v = I18N[lang][n.dataset.t];
      if (typeof v === 'string') n.textContent = v;
      });
      if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
      render();
      }
  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    render();
    }
  langBtn?.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh'; store.set(LS.lang, lang); applyLang(); }); themeBtn?.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set(LS.theme, theme);
    applyTheme();
    });
    const $ = (s) => document.querySelector(s);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const smooth = (p) => p * p * (3 - 2 * p);
  const hex = (name) => new THREE.Color(cssVar(name));
  const canvas = $('#scene');
  const organName = $('#organName');
  const missionText = $('#missionText');
  const actionBtn = $('#actionBtn');
  const startBtn = $('#startBtn');
  const steadyBtn = $('#steadyBtn');
  const soundBtn = $('#soundBtn');
  const restartBtn = $('#restartBtn');
  const finish = $('#finish');
  const finishTitle = $('#finishTitle');
  const finishDesc = $('#finishDesc');
  const toastEl = $('#toast');
  const labelsEl = $('#labels');
  const coinCount = $('#coinCount');
  const starCount = $('#starCount');
  const codexCards = $('#codexCards');
  const foodButtons = [...document.querySelectorAll('.food')];
  const mapDots = [...document.querySelectorAll('.map__dot')];
  const FOOD = { rice: { icon: '🍚', key: 'foodRice', mult: 1, spin: 0, bonus: 'riceBonus', color: 0xfff0c7 },
candy: { icon: '🍬', key: 'foodCandy', mult: 1.22, spin: 0, bonus: 'candyBonus', color: 0xff65bd }, fat: { icon: '🥓', key: 'foodFat', mult: 0.9, spin: 1, bonus: 'fatBonus', color: 0xffa24d }, };
const SECTIONS = [ { id: 'mouth', icon: '🦷', start: 0.000, end: 0.155, organ: 'organMouth', action: 'chewBtn', color: '--gut-mouth' },
{ id: 'esophagus', icon: '〰️', start: 0.155, end: 0.315, organ: 'organEsophagus', action: 'tapBtn', color: '--gut-esophagus' },
{ id: 'stomach', icon: '🧪', start: 0.315, end: 0.500, organ: 'organStomach', action: 'dodgeBtn', color: '--gut-stomach' },
{ id: 'small', icon: '🌸', start: 0.500, end: 0.785, organ: 'organSmall', action: 'collectBtn', color: '--gut-small' },
{ id: 'large', icon: '💧', start: 0.785, end: 0.930, organ: 'organLarge', action: 'absorbBtn', color: '--gut-large' },
{ id: 'exit', icon: '😆', start: 0.930, end: 1.000, organ: 'organExit', action: 'finishBtn', color: '--gut-exit' }, ];
const CODEX = [ { id: 'mouth', title: 'organMouth', do: 'mouthDo', fun: 'mouthFun', badge: '🍚→🍬' },
{ id: 'esophagus', title: 'organEsophagus', do: 'esoDo', fun: 'esoFun', badge: '〰️ wave' }, { id: 'stomach', title: 'organStomach', do: 'stomachDo', fun: 'stomachFun', badge: 'pH 1–3' },
{ id: 'small', title: 'organSmall', do: 'smallDo', fun: 'smallFun', badge: '5–7 m' }, { id: 'large', title: 'organLarge', do: 'largeDo', fun: 'largeFun', badge: 'H₂O' },
{ id: 'exit', title: 'organExit', do: 'exitDo', fun: 'exitFun', badge: '😆' }, ]; const state = {
    started: false, done: false, food: 'rice', t: 0, displayT: 0, speed: 0, lateral: 0, targetLateral: 0, dragging: false, pointerId: null, steady: false, soundOn: true, chew: 0, rhythm: 0, dodged: 0, hits: 0,
    absorbed: 0, coins: 0, stars: 0, unlocked: new Set(), activeSection: 0, sectionAnnounced: new Set(), lastTime: 0, pulse: 0, waterLevel: 1, magicShown: false, };
    let renderer;
    try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false }); } catch {
    $('#nogl').hidden = false; canvas.remove(); }
  if (!renderer) {
    applyTheme(); applyLang(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(72, 1, 0.08, 260);
  const root = new THREE.Group();
  scene.add(root);
  const ambient = new THREE.HemisphereLight(0xffd6c0, 0x2b1020, 1.7);
  const headLamp = new THREE.PointLight(0xfff2c0, 2.6, 32, 1.3);
  const magicLight = new THREE.PointLight(0xff76d2, 0, 45, 1.6); scene.add(ambient, headLamp, magicLight); const pts = [
    [-7, 2.0, 0], [-4, 1.2, -7], [1, 0.3, -12], [5, -2.5, -16], [2, -7.0, -21], [-5, -9.0, -27], [-10, -6.5, -32], [-6, -2.0, -38], [1, -4.0, -43], [8, -6.0, -49], [11, -2.0, -57], [3, 1.5, -64],
    [-6, 0.0, -72], [-8, -3.2, -81], [0, -5.0, -90], [9, -2.0, -99], [5, 3.5, -110], [-5, 2.0, -120], [-12, -2.5, -131], [-7, -7.0, -142], [3, -6.0, -153], [9, -1.0, -164], [2, 3.0, -174], [-4, 1.5, -184],
  ].map((p) => new THREE.Vector3(...p));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.52);
  const tubeSegments = 420;
  const tubeRadius = 3.4;
  const tubeGeo = new THREE.TubeGeometry(curve, tubeSegments, tubeRadius, 28, false);
  const tubeColors = [];
  const tmpColor = new THREE.Color();
  for (let i = 0;
  i < tubeGeo.attributes.position.count;
  i++) {
    const ring = Math.floor(i / 29);
    const u = ring / tubeSegments;
    const sec = sectionAt(u);
    tmpColor.set(cssVar(sec.color));
    if (sec.id === 'stomach') tmpColor.offsetHSL(0, 0.08, -0.08);
    if (sec.id === 'small') tmpColor.offsetHSL(0, 0.1, 0.07);
    if (sec.id === 'exit') tmpColor.multiplyScalar(0.42);
    tubeColors.push(tmpColor.r, tmpColor.g, tmpColor.b);
    }
  tubeGeo.setAttribute('color', new THREE.Float32BufferAttribute(tubeColors, 3)); const tubeMat = new THREE.MeshLambertMaterial({
    vertexColors: true, side: THREE.BackSide, }); const tube = new THREE.Mesh(tubeGeo, tubeMat); root.add(tube);
  const waterPath = new THREE.TubeGeometry(curve, tubeSegments, 1.05, 18, false); const waterMat = new THREE.MeshLambertMaterial({
    color: 0x64d7ff, transparent: true, opacity: 0.54, emissive: 0x123b66, emissiveIntensity: 0.25, side: THREE.DoubleSide, });
    const water = new THREE.Mesh(waterPath, waterMat);
  water.scale.set(1, 0.16, 1); root.add(water); const raft = new THREE.Group(); const raftBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.45, 1.45, 6, 14), new THREE.MeshStandardMaterial({ color: 0xffc857, roughness: 0.5, metalness: 0.02 })
  ); raftBody.rotation.z = Math.PI / 2; const raftRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.63, 0.08, 8, 24), new THREE.MeshStandardMaterial({ color: 0xef476f, roughness: 0.42 })
  ); raftRim.scale.x = 1.55; const rider = new THREE.Mesh(
    new THREE.SphereGeometry(0.23, 16, 12), new THREE.MeshStandardMaterial({ color: 0x5a4bff, roughness: 0.55 })
  ); rider.position.y = 0.35; const paddle = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.04, 0.04), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 })
  ); paddle.position.y = 0.44; raft.add(raftBody, raftRim, rider, paddle); root.add(raft); const foodBall = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.62, 2), new THREE.MeshStandardMaterial({ color: FOOD.rice.color, roughness: 0.9 })
  ); foodBall.position.set(0, -0.2, -1.4); raft.add(foodBall); const foamTex = softCircleTexture(96); const splashes = makeSprites(90, 0xdef9ff, 0.32, 0.55);
  const salivaFalls = makeSprites(120, 0x99e8ff, 0.5, 0.75);
  const bloodSparks = makeSprites(120, 0xff2b5d, 0.0, 0.5);
  const sugarSparks = makeSprites(32, 0xff9de8, 0.0, 0.7);
  root.add(splashes.points, salivaFalls.points, bloodSparks.points, sugarSparks.points);
  const teeth = createTeeth();
  const contractions = createContractions();
  const stomachSet = createStomachSet();
  const villiSet = createVilliForest();
  const largeSet = createLargeIntestineSet();
  const exitGate = createExitGate();
  const coins = createCoins();
  const waves = createAcidWaves();
  root.add(teeth, contractions, stomachSet.group, villiSet.group, largeSet.group, exitGate, coins.group, waves.group); const labels = SECTIONS.map((sec, i) => {
    const el = document.createElement('div');
    el.className = 'label';
    labelsEl.appendChild(el);
    return { el, sec, t: (sec.start + sec.end) / 2 + (i === 2 ? 0.02 : 0) };
    });
    let actx = null;
  let waterGain = null; let noiseSrc = null; function ensureAudio() {
    if (!state.soundOn) return; try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); if (!noiseSrc) {
        const buffer = actx.createBuffer(1, actx.sampleRate * 2, actx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0;
        i < data.length;
        i++) data[i] = (Math.random() * 2 - 1) * 0.24;
        const filter = actx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 900;
        waterGain = actx.createGain();
        waterGain.gain.value = 0.025;
        noiseSrc = actx.createBufferSource();
        noiseSrc.buffer = buffer; noiseSrc.loop = true; noiseSrc.connect(filter).connect(waterGain).connect(actx.destination); noiseSrc.start(); }
    } catch { /* ignore */ }
  }
  function tone(freq, dur = 0.12, type = 'sine', gain = 0.1, delay = 0) {
    if (!state.soundOn) return;
    ensureAudio();
    if (!actx) return;
    const at = actx.currentTime + delay;
    const osc = actx.createOscillator();
    const g = actx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    g.gain.setValueAtTime(gain, at);
    g.gain.exponentialRampToValueAtTime(0.001, at + dur);
    osc.connect(g).connect(actx.destination);
    osc.start(at); osc.stop(at + dur + 0.03); }
  const sfx = {
    chew: () => { tone(180, 0.05, 'square', 0.06); tone(360, 0.07, 'triangle', 0.05, 0.04); }, beat: () => tone(125, 0.13, 'sine', 0.12),
    coin: () => [680, 960, 1320].forEach((f, i) => tone(f, 0.08, 'triangle', 0.09, i * 0.035)), hit: () => tone(90, 0.32, 'sawtooth', 0.07),
    water: () => [430, 620, 780].forEach((f, i) => tone(f, 0.12, 'sine', 0.08, i * 0.05)), win: () => [523, 659, 784, 1047, 1318].forEach((f, i) => tone(f, 0.16, 'triangle', 0.11, i * 0.09)),
    flush: () => { tone(70, 0.5, 'sawtooth', 0.08);
    tone(140, 0.35, 'sine', 0.05, 0.14);
    }, };
    foodButtons.forEach((btn) => btn.addEventListener('click', () => {
    if (state.started && !state.done) return;
    state.food = btn.dataset.food;
    foodButtons.forEach((b) => b.classList.toggle('active', b === btn));
    updateFoodLook();
    toast(t(FOOD[state.food].bonus), 1700);
    render(); })); startBtn.addEventListener('click', () => {
    ensureAudio(); resetRun(); state.started = true; startBtn.disabled = true; toast(t('toastStart'), 1300); }); restartBtn.addEventListener('click', () => {
    finish.hidden = true; resetRun(); state.started = true; startBtn.disabled = true; ensureAudio(); }); actionBtn.addEventListener('click', () => {
    ensureAudio(); const sec = SECTIONS[state.activeSection]?.id; if (sec === 'mouth') chew();
    else if (sec === 'esophagus') rhythmTap();
    else if (sec === 'large') absorbWater();
    else if (sec === 'exit') finishRun();
    else tone(280, 0.08, 'triangle', 0.06); }); steadyBtn.addEventListener('click', () => {
    state.steady = !state.steady; render(); }); soundBtn.addEventListener('click', () => {
    state.soundOn = !state.soundOn;
    if (!state.soundOn && waterGain) waterGain.gain.value = 0;
    if (state.soundOn) ensureAudio();
    render();
    });
    canvas.addEventListener('pointerdown', (e) => {
    ensureAudio();
    canvas.setPointerCapture(e.pointerId);
    state.pointerId = e.pointerId;
    state.dragging = true;
    setControlFromPointer(e, true);
    });
    canvas.addEventListener('pointermove', (e) => {
    if (!state.dragging || e.pointerId !== state.pointerId) return; setControlFromPointer(e, false); }); canvas.addEventListener('pointerup', (e) => {
    if (e.pointerId !== state.pointerId) return;
    state.dragging = false;
    state.pointerId = null;
    state.targetLateral = 0;
    });
    canvas.addEventListener('pointercancel', () => {
    state.dragging = false; state.targetLateral = 0; }); addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') state.targetLateral = -1;
    if (e.key === 'ArrowRight') state.targetLateral = 1;
    if (e.key === ' ' || e.key === 'Enter') actionBtn.click();
    });
    addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') state.targetLateral = 0;
    });
    addEventListener('resize', resize);
    addEventListener('themechange', () => {
    applySceneTheme(); updateTubeColors(); }); function sectionAt(u) {
    return SECTIONS.find((s) => u >= s.start && u < s.end) || SECTIONS[SECTIONS.length - 1]; }
  function sectionIndexAt(u) {
    return SECTIONS.findIndex((s) => u >= s.start && u < s.end); }
  function sectionProgress(sec) {
    return clamp((state.t - sec.start) / (sec.end - sec.start), 0, 1); }
  function baseSpeed() {
    const sec = SECTIONS[state.activeSection] || SECTIONS[0];
    const p = sectionProgress(sec);
    let s = 0.018;
    if (sec.id === 'mouth') s = 0.010 + state.chew / 20 * 0.012;
    if (sec.id === 'esophagus') s = 0.017 + Math.max(0, Math.sin(p * Math.PI * 12)) * 0.014 + state.rhythm * 0.001;
    if (sec.id === 'stomach') s = 0.013 + Math.sin(p * Math.PI * 4) * 0.004;
    if (sec.id === 'small') s = 0.020; if (sec.id === 'large') s = 0.012 + state.absorbed * 0.003; if (sec.id === 'exit') s = 0.030; s *= FOOD[state.food].mult;
    if (state.food === 'fat' && sec.id === 'stomach') s *= 0.72; return s; }
  function resetRun() {
    Object.assign(state, {
      started: false, done: false, t: 0, displayT: 0, speed: 0, lateral: 0, targetLateral: 0, chew: 0, rhythm: 0, dodged: 0, hits: 0, absorbed: 0, coins: 0, stars: 0,
      activeSection: 0, pulse: 0, waterLevel: 1, magicShown: false, }); state.unlocked = new Set(); state.sectionAnnounced = new Set(); state.started = false;
    waves.items.forEach((w) => { w.done = false;
    w.hit = false;
    w.mesh.visible = true;
    });
    coins.items.forEach((c) => { c.collected = false;
    c.flying = 0;
    c.mesh.visible = true;
    });
    updateFoodLook();
    render();
  }
  function chew() {
    if (state.chew >= 20) return;
    state.chew += 1;
    state.pulse = 1;
    foodBall.scale.setScalar(lerp(1, 0.32, state.chew / 20));
    sfx.chew();
    if (state.food === 'candy' && state.chew === 6) {
      sugarSparks.opacity = 1; state.coins += 3; toast(t('candyBonus'), 1200); }
    if (state.chew === 20) {
      awardSection('mouth', 3); salivaFalls.opacity = 0.9; toast(t('toastChew'), 2300); }
    render(); }
  function rhythmTap() {
    const sec = SECTIONS[1];
    if (state.t < sec.start || state.t > sec.end || state.rhythm >= 5) return;
    state.rhythm += 1;
    state.speed += 0.012;
    state.pulse = 1;
    sfx.beat();
    toast(t('toastRhythm'), 700);
    if (state.rhythm === 5) awardSection('esophagus', 3); render(); }
  function absorbWater() {
    const sec = SECTIONS[4];
    if (state.t < sec.start || state.t > sec.end || state.absorbed >= 3) return;
    state.absorbed += 1;
    state.waterLevel = 1 - state.absorbed * 0.22;
    sfx.water();
    toast(t('toastWater'), 900); if (state.absorbed === 3) awardSection('large', 3); render(); }
  function awardSection(id, count) {
    if (!state.unlocked.has(id)) {
      state.unlocked.add(id); state.stars += count; showCodexPulse(id); renderCodex(); }
  }
  function checkSectionTransitions() {
    const idx = Math.max(0, sectionIndexAt(state.t)); if (idx !== state.activeSection) {
      const prev = SECTIONS[state.activeSection];
      if (prev && !state.unlocked.has(prev.id)) awardSection(prev.id, prev.id === 'small' ? Math.min(3, Math.floor(state.coins / 8)) : 1);
      state.activeSection = idx;
      if (SECTIONS[idx].id === 'stomach') toast(t('toastStomach'), 2200); if (SECTIONS[idx].id === 'small' && !state.magicShown) {
        state.magicShown = true; toast(t('toastMagic'), 2600); }
      if (SECTIONS[idx].id === 'exit') toast(t('toastExit'), 1300); render(); }
  }
  function finishRun() {
    if (state.done) return; state.done = true; state.started = false; awardSection('exit', 3); sfx.flush(); sfx.win(); setTimeout(() => {
      finish.hidden = false;
      finishTitle.textContent = t('finishTitle');
      finishDesc.textContent = t('finishDesc')(state.coins, state.stars, `${FOOD[state.food].icon} ${t(FOOD[state.food].key)}`);
      }, 520);
    render(); }
  function updateTasks() {
    for (const w of waves.items) {
      if (w.done || state.t < w.t) continue; const distance = Math.abs(state.lateral - w.lane); if (distance < 0.5) {
        w.hit = true; state.hits += 1; sfx.hit(); makeSmoke(); toast(t('toastHit'), 900); } else {
        state.dodged += 1; tone(500, 0.08, 'triangle', 0.08); toast(t('toastDodge'), 700); }
      w.done = true; w.mesh.visible = false; if (state.dodged >= 3) awardSection('stomach', 3); }
    for (const c of coins.items) {
      if (c.collected) continue; const dt = Math.abs(state.t - c.t); if (dt < 0.010 && Math.abs(state.lateral - c.lane) < 0.38) {
        c.collected = true;
        c.flying = 1;
        state.coins += 1;
        bloodSparks.opacity = 1;
        sfx.coin();
        if (state.coins >= 12 && !state.unlocked.has('small')) awardSection('small', 3);
        }
    }
  }
  function updateFrame(now) {
    const dt = Math.min(0.05, (now - state.lastTime) / 1000 || 0.016); state.lastTime = now; if (state.started && !state.done) {
      state.speed = lerp(state.speed, baseSpeed(), 0.045);
      state.t = clamp(state.t + state.speed * dt, 0, 1);
      if (state.t > 0.997) finishRun();
      checkSectionTransitions();
      updateTasks();
      }
    state.displayT = lerp(state.displayT, state.t, 0.08);
    state.lateral = lerp(state.lateral, state.targetLateral, 0.12);
    state.pulse = Math.max(0, state.pulse - dt * 2.2);
    animateThree(now / 1000, dt);
    renderer.render(scene, camera); requestAnimationFrame(updateFrame); }
  function frameAt(u) {
    const p = curve.getPointAt(clamp(u, 0, 1));
    const tangent = curve.getTangentAt(clamp(u, 0, 1)).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(tangent.dot(up)) > 0.92) up.set(1, 0, 0);
    const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const normal = new THREE.Vector3().crossVectors(right, tangent).normalize();
    return { p, tangent, right, normal };
    }
  function animateThree(time, dt) {
    const u = state.displayT;
    const f = frameAt(u);
    const look = frameAt(Math.min(1, u + 0.013));
    const raftU = Math.max(0, u - 0.0025);
    const rf = frameAt(raftU);
    const wobble = state.steady ? 0.18 : 0.46;
    const wave = Math.sin(time * 5 + u * 55) * wobble; const offset = rf.right.clone().multiplyScalar(state.lateral * 1.18 + wave * 0.18)
      .add(rf.normal.clone().multiplyScalar(-0.72 + Math.sin(time * 3.7) * 0.08)); raft.position.copy(rf.p).add(offset);
    raft.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(raft.position, rf.p.clone().add(rf.tangent), rf.normal));
    raft.rotateZ(-state.lateral * 0.25 + Math.sin(time * 4) * wobble * 0.06);
    paddle.rotation.z = Math.sin(time * 7.5) * 0.45; const camOffset = f.normal.clone().multiplyScalar(0.22)
      .add(f.right.clone().multiplyScalar(state.lateral * 0.45))
      .add(f.tangent.clone().multiplyScalar(-0.7)); camera.position.copy(f.p).add(camOffset);
    camera.lookAt(look.p.clone().add(look.normal.clone().multiplyScalar(-0.25)).add(look.right.clone().multiplyScalar(state.lateral * 0.5)));
    camera.rotation.z += Math.sin(time * 2.6 + u * 31) * (state.steady ? 0.006 : 0.018) + state.lateral * 0.018;
    headLamp.position.copy(camera.position).add(f.tangent.clone().multiplyScalar(2));
    water.scale.y = lerp(water.scale.y, 0.16 * state.waterLevel, 0.04); waterMat.opacity = lerp(waterMat.opacity, 0.34 + state.waterLevel * 0.25, 0.03);
    waterMat.emissiveIntensity = 0.22 + Math.sin(time * 3) * 0.04;
    if (waterGain && state.soundOn) waterGain.gain.value = 0.018 + state.speed * 0.75;
    animateMouth(time);
    animateEsophagus(time);
    animateStomach(time, dt); animateVilli(time); animateLarge(time); animateCoins(time, dt); animateParticles(time); updateLabels(); }
  function animateMouth(time) {
    const secP = sectionProgress(SECTIONS[0]); teeth.visible = state.t < 0.22; teeth.children.forEach((m, i) => {
      const bite = Math.sin(time * 7 + i * 0.6) * (0.18 + state.pulse * 0.35);
      m.position.y = m.userData.baseY + bite * (m.userData.upper ? -1 : 1);
      });
      salivaFalls.points.visible = secP > 0.22 && secP < 1;
    salivaFalls.opacity = Math.max(0, salivaFalls.opacity - 0.004); salivaFalls.mat.opacity = salivaFalls.opacity; }
  function animateEsophagus(time) {
    contractions.visible = state.t > 0.13 && state.t < 0.36; contractions.children.forEach((ring, i) => {
      const a = time * 4.5 - i * 0.9;
      const s = 1 + Math.sin(a) * 0.18;
      ring.scale.setScalar(s);
      ring.material.opacity = 0.18 + Math.max(0, Math.sin(a)) * 0.35;
      });
      }
  function animateStomach(time, dt) {
    const sec = SECTIONS[2]; const active = state.t > sec.start - 0.03 && state.t < sec.end + 0.04; stomachSet.group.visible = active; if (!active) return;
    stomachSet.pool.rotation.z += dt * (state.food === 'fat' ? 1.3 : 0.9);
    stomachSet.pool.material.emissiveIntensity = 0.5 + Math.sin(time * 5) * 0.18;
    stomachSet.mucus.children.forEach((m, i) => {
      m.material.opacity = 0.22 + Math.sin(time * 3 + i) * 0.08;
      });
      stomachSet.bile.visible = state.food === 'fat' && sectionProgress(sec) > 0.45;
      if (stomachSet.bile.visible) {
      stomachSet.bile.position.y = Math.sin(time * 4) * 0.25; stomachSet.bile.rotation.y = time * 2; }
    if (state.food === 'fat') raft.rotateY(Math.sin(time * 2.2) * 0.04); }
  const villiDummy = new THREE.Object3D();
  const villiLook = new THREE.Matrix4();
  function animateVilli(time) {
    const sec = SECTIONS[3]; const active = state.t > sec.start - 0.04 && state.t < sec.end + 0.05; villiSet.group.visible = active;
    magicLight.intensity = active ? 3 + Math.sin(time * 2) * 0.8 : lerp(magicLight.intensity, 0, 0.08);
    if (!active) return;
    const dummy = villiDummy, look = villiLook;
    for (let i = 0;
    i < villiSet.count;
    i++) {
      const d = villiSet.data[i]; const sway = Math.sin(time * 2.4 + d.phase) * 0.16;
      if (!d.base) {
        const f = frameAt(d.t);
        d.base = f.p.clone()
          .add(f.right.clone().multiplyScalar(Math.cos(d.a) * (tubeRadius - 0.45)))
          .add(f.normal.clone().multiplyScalar(Math.sin(d.a) * (tubeRadius - 0.45)));
        d.quat = new THREE.Quaternion().setFromRotationMatrix(look.lookAt(d.base, f.p, f.tangent));
      }
      dummy.position.copy(d.base);
      dummy.quaternion.copy(d.quat);
        dummy.rotateX(sway);
      dummy.scale.set(d.s, d.len * (1 + Math.sin(time * 1.5 + d.phase) * 0.04), d.s); dummy.updateMatrix(); villiSet.mesh.setMatrixAt(i, dummy.matrix); }
    villiSet.mesh.instanceMatrix.needsUpdate = true; }
  function animateLarge(time) {
    const sec = SECTIONS[4]; largeSet.group.visible = state.t > sec.start - 0.04 && state.t < sec.end + 0.03; largeSet.group.children.forEach((m, i) => {
      const shrink = 1 - state.absorbed * 0.08 + Math.sin(time * 2 + i) * 0.03;
      m.scale.set(shrink, shrink, shrink);
      m.material.opacity = 0.2 + state.absorbed * 0.16;
      });
      }
  function animateCoins(time, dt) {
    coins.group.visible = state.t > 0.47 && state.t < 0.82; for (const c of coins.items) {
      if (c.collected && c.flying <= 0) continue; const f = frameAt(c.t); const bob = Math.sin(time * 4 + c.phase) * 0.16;
      let pos = f.p.clone().add(f.right.clone().multiplyScalar(c.lane * 1.25)).add(f.normal.clone().multiplyScalar(-0.65 + bob)); if (c.collected) {
        c.flying = Math.max(0, c.flying - dt * 1.8);
        const wall = f.p.clone().add(f.right.clone().multiplyScalar(Math.sign(c.lane || 1) * 2.55)).add(f.normal.clone().multiplyScalar(0.8));
        pos.lerp(wall, 1 - c.flying);
        c.mesh.material.opacity = c.flying;
        c.mesh.scale.setScalar(0.55 + c.flying * 0.45);
        if (c.flying <= 0) c.mesh.visible = false;
        }
      c.mesh.position.copy(pos); c.mesh.rotation.y = time * 4 + c.phase; }
  }
  function animateParticles(time) {
    splashes.points.rotation.z = Math.sin(time) * 0.05; const attrs = splashes.geo.attributes.position; for (let i = 0; i < attrs.count; i++) {
      const u = (state.t + i * 0.0024 + time * 0.002) % 1;
      const f = frameAt(u);
      const lane = Math.sin(i * 11.7) * 1.7;
      const y = -0.85 + Math.sin(time * 3 + i) * 0.18;
      const pos = f.p.clone().add(f.right.clone().multiplyScalar(lane)).add(f.normal.clone().multiplyScalar(y)); attrs.setXYZ(i, pos.x, pos.y, pos.z); }
    attrs.needsUpdate = true;
    sugarSparks.opacity = Math.max(0, sugarSparks.opacity - 0.008);
    sugarSparks.mat.opacity = sugarSparks.opacity;
    bloodSparks.opacity = Math.max(0, bloodSparks.opacity - 0.01);
    bloodSparks.mat.opacity = bloodSparks.opacity; magicLight.position.copy(frameAt(0.66).p); }
  function pathObjectAt(mesh, u, lane = 0, lift = 0) {
    const f = frameAt(u); mesh.position.copy(f.p).add(f.right.clone().multiplyScalar(lane)).add(f.normal.clone().multiplyScalar(lift));
    mesh.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(mesh.position, f.p.clone().add(f.tangent), f.normal)); return mesh; }
  function createTeeth() {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xfffbef, roughness: 0.48 });
    const geo = new THREE.BoxGeometry(0.75, 1.05, 0.6);
    for (let i = 0;
    i < 16;
    i++) {
      const upper = i < 8;
      const m = new THREE.Mesh(geo, mat);
      const lane = (i % 8 - 3.5) * 0.58;
      pathObjectAt(m, 0.05 + (i % 8) * 0.006, lane, upper ? 1.95 : -1.95);
      m.userData.baseY = m.position.y;
      m.userData.upper = upper; group.add(m); }
    return group; }
  function createContractions() {
    const group = new THREE.Group(); for (let i = 0; i < 13; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffe0cf, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
      const torus = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.08, 8, 64), mat);
      pathObjectAt(torus, 0.17 + i * 0.011, 0, 0); group.add(torus); }
    return group; }
  function createStomachSet() {
    const group = new THREE.Group(); const poolMat = new THREE.MeshStandardMaterial({
      color: 0x66d16a, emissive: 0x1c7a30, emissiveIntensity: 0.6, transparent: true, opacity: 0.72, side: THREE.DoubleSide, roughness: 0.35, });
    const pool = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.22, 12, 80), poolMat);
    pathObjectAt(pool, 0.405, 0, -0.9);
    group.add(pool);
    const mucus = new THREE.Group();
    for (let i = 0;
    i < 18;
    i++) {
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.06, 1.1 + Math.random() * 1.8), new THREE.MeshBasicMaterial({ color: 0x9fffd0, transparent: true, opacity: 0.25 })
      ); pathObjectAt(strip, 0.34 + Math.random() * 0.13, Math.sin(i) * 2.0, Math.cos(i) * 1.8); mucus.add(strip); }
    group.add(mucus); const bile = new THREE.Group();
    const buddy = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 14), new THREE.MeshStandardMaterial({ color: 0xb6ff46, emissive: 0x3c7200, emissiveIntensity: 0.4 }));
    const hat = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.42, 16), new THREE.MeshStandardMaterial({ color: 0x1e9b50 }));
    hat.position.y = 0.48;
    bile.add(buddy, hat);
    pathObjectAt(bile, 0.46, 1.8, -0.2);
    bile.visible = false; group.add(bile); return { group, pool, mucus, bile }; }
  function createVilliForest() {
    const count = 2600; const geo = new THREE.ConeGeometry(0.055, 0.85, 6, 1); geo.translate(0, 0.42, 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff9acb, emissive: 0x4c1238, emissiveIntensity: 0.18, roughness: 0.75 });
    const mesh = new THREE.InstancedMesh(geo, mat, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const group = new THREE.Group();
    group.add(mesh);
    const data = [];
    const dummy = new THREE.Object3D();
    for (let i = 0;
    i < count;
    i++) {
      data.push({
        t: 0.515 + Math.random() * 0.245, a: Math.random() * Math.PI * 2, s: 0.65 + Math.random() * 0.75, len: 0.65 + Math.random() * 1.15, phase: Math.random() * Math.PI * 2, });
        dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix); }
    return { group, mesh, count, data }; }
  function createLargeIntestineSet() {
    const group = new THREE.Group(); for (let i = 0; i < 10; i++) {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(2.45, 0.055, 8, 46), new THREE.MeshBasicMaterial({ color: 0xffd0a3, transparent: true, opacity: 0.2 })
      ); pathObjectAt(m, 0.795 + i * 0.013, 0, 0); group.add(m); }
    return { group }; }
  function createExitGate() {
    const group = new THREE.Group(); const mat = new THREE.MeshBasicMaterial({ color: 0x050508, transparent: true, opacity: 0.82, side: THREE.DoubleSide });
    const disk = new THREE.Mesh(new THREE.CircleGeometry(3.2, 50), mat); pathObjectAt(disk, 0.987, 0, 0); group.add(disk); return group; }
  function createAcidWaves() {
    const group = new THREE.Group(); const items = [
      { t: 0.365, lane: -0.75 }, { t: 0.415, lane: 0.82 }, { t: 0.475, lane: -0.15 }, ]; items.forEach((w) => {
      const mesh = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 1.35, 22), new THREE.MeshStandardMaterial({ color: 0x8dff63, emissive: 0x2a9f22, emissiveIntensity: 0.55, transparent: true, opacity: 0.85 })
      );
      mesh.rotation.x = Math.PI;
      pathObjectAt(mesh, w.t, w.lane * 1.3, -0.35);
      group.add(mesh);
      w.mesh = mesh;
      w.done = false;
      w.hit = false;
      });
      return { group, items };
      }
  function createCoins() {
    const group = new THREE.Group(); const items = []; for (let i = 0; i < 34; i++) {
      const mat = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xff8c00, emissiveIntensity: 0.65, roughness: 0.25 });
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.055, 24), mat); const c = {
        t: 0.515 + i * 0.0076 + Math.sin(i * 3) * 0.004, lane: [-0.9, -0.35, 0.3, 0.85][i % 4], phase: i * 0.7, mesh, collected: false, flying: 0, };
        pathObjectAt(mesh, c.t, c.lane * 1.25, -0.7);
      group.add(mesh); items.push(c); }
    return { group, items }; }
  function makeSprites(count, color, opacity, size) {
    const geo = new THREE.BufferGeometry(); const pos = new Float32Array(count * 3); for (let i = 0; i < count; i++) pos.set([0, -50, 0], i * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const mat = new THREE.PointsMaterial({
      color, size, map: foamTex, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, });
      const points = new THREE.Points(geo, mat);
      return { points, geo, mat, opacity };
      }
  function softCircleTexture(size = 80) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.34, 'rgba(255,255,255,0.78)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c); }
  function makeSmoke() {
    for (let i = 0; i < 12; i++) {
      const idx = i % splashes.geo.attributes.position.count;
      splashes.geo.attributes.position.setXYZ(idx, raft.position.x, raft.position.y + 0.4, raft.position.z);
      }
  }
  function render() {
    if (!organName) return;
    const sec = SECTIONS[state.activeSection] || SECTIONS[0];
    organName.textContent = t(sec.organ);
    actionBtn.textContent = t(sec.action);
    steadyBtn.textContent = state.steady ? t('unsteady') : t('steady');
    soundBtn.textContent = state.soundOn ? t('soundOn') : t('soundOff');
    coinCount.textContent = state.coins;
    starCount.textContent = state.stars; if (sec.id === 'mouth') missionText.textContent = t('missionMouth')(state.chew);
    if (sec.id === 'esophagus') missionText.textContent = t('missionEsophagus')(state.rhythm);
    if (sec.id === 'stomach') missionText.textContent = t('missionStomach')(state.dodged, state.hits);
    if (sec.id === 'small') missionText.textContent = t('missionSmall')(state.coins);
    if (sec.id === 'large') missionText.textContent = t('missionLarge')(state.absorbed);
    if (sec.id === 'exit') missionText.textContent = t('missionExit'); mapDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === state.activeSection);
      dot.classList.toggle('done', state.unlocked.has(SECTIONS[i].id));
      });
      labels.forEach((l) => { l.el.textContent = t(l.sec.organ);
      });
    renderCodex(); }
  function renderCodex() {
    codexCards.innerHTML = ''; CODEX.forEach((card) => {
      const unlocked = state.unlocked.has(card.id);
      const el = document.createElement('article');
      el.className = `codex-card${unlocked ? ' unlocked' : ''}`;
      el.innerHTML = unlocked
        ? `<span class="badge">${card.badge}</span><h3>${t(card.title)}</h3><p>${t(card.do)}</p><p>${t(card.fun)}</p>`
        : `<span class="badge">${card.badge}</span><h3>???</h3><p>${t('locked')}</p>`; codexCards.appendChild(el); }); }
  function showCodexPulse(id) {
    const card = CODEX.find((c) => c.id === id); if (card) toast(`${SECTIONS.find((s) => s.id === id).icon} ${t(card.title)}`, 950); }
  function toast(msg, ms = 1200) {
    toastEl.textContent = msg; toastEl.hidden = false; clearTimeout(toastEl._timer); toastEl._timer = setTimeout(() => { toastEl.hidden = true; }, ms); }
  function updateLabels() {
    const rect = canvas.getBoundingClientRect(); labels.forEach((l) => {
      const p = curve.getPointAt(l.t);
      const v = p.clone().project(camera);
      const visible = v.z < 1 && Math.abs(v.x) < 1.25 && Math.abs(v.y) < 1.25 && Math.abs(state.t - l.t) < 0.11;
      l.el.classList.toggle('show', visible);
      l.el.style.left = `${(v.x * 0.5 + 0.5) * rect.width}px`;
      l.el.style.top = `${(-v.y * 0.5 + 0.5) * rect.height}px`;
      });
      }
  function setControlFromPointer(e, first) {
    const r = canvas.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width; if (first) state.targetLateral = x < 0.5 ? -1 : 1;
    else state.targetLateral = clamp((x - 0.5) * 2.4, -1, 1); }
  function updateFoodLook() {
    foodBall.material.color.setHex(FOOD[state.food].color); foodBall.scale.setScalar(1); if (state.food === 'fat') foodBall.scale.set(1.25, 0.82, 0.82);
    if (state.food === 'candy') foodBall.scale.set(0.82, 0.82, 0.82); }
  function resize() {
    const rect = canvas.getBoundingClientRect(); const w = Math.max(2, rect.width); const h = Math.max(2, rect.height); renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  function applySceneTheme() {
    scene.background = hex('--scene-bg');
    scene.fog = new THREE.FogExp2(hex('--scene-fog'), theme === 'dark' ? 0.030 : 0.020);
    ambient.intensity = theme === 'dark' ? 1.05 : 1.75;
    headLamp.intensity = theme === 'dark' ? 3.2 : 2.45; }
  function updateTubeColors() {
    const attr = tubeGeo.attributes.color; for (let i = 0; i < attr.count; i++) {
      const ring = Math.floor(i / 29);
      const u = ring / tubeSegments;
      const sec = sectionAt(u);
      tmpColor.set(cssVar(sec.color));
      if (theme === 'dark') tmpColor.multiplyScalar(sec.id === 'small' ? 0.72 : 0.56);
      attr.setXYZ(i, tmpColor.r, tmpColor.g, tmpColor.b); }
    attr.needsUpdate = true; }
  applyTheme();
  applyLang();
  resize();
  resetRun();
  state.started = false;
  startBtn.disabled = false;
  toast(t(FOOD[state.food].bonus), 1400);
  requestAnimationFrame((now) => {
    state.lastTime = now; requestAnimationFrame(updateFrame); }); })();
