import * as THREE from 'three';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import { createLabAudio } from './audio.js';
import {
  BUILD_TARGETS,
  ELEMENTS,
  ISOMER_CHALLENGES,
  MOLECULE_LIBRARY,
  REAGENTS,
  adjacency,
  addAtom,
  attachAtom,
  createMolecule,
  cycleBondOrder,
  elementOf,
  freeValence,
  identifyMolecule,
  isComplete,
  layoutMolecule,
  matchIsomer,
  measureAngle,
  molecularFormula,
  neighborsOf,
  reactionOutcome,
  removeAtom,
} from './molecule-model.js';

const I18N = {
  zh: {
    doc: '有机分子工坊 · KidsLab',
    back: '返回平台',
    title: '有机分子工坊',
    subtitle: '点发光键位拼分子，台上直接读键角、滴试剂',
    tabBuild: '拼装',
    tabReact: '试剂',
    tabIsomer: '异构',
    parameters: '实验台',
    coachStart: '选一个原子，点发光的键位',
    coachOpen: (n) => `还空着 ${n} 根键，点亮点接上去`,
    coachComplete: '完整了。量一个键角，或打开右侧滴试剂',
    coachMeasureCenter: '量角器举起来了。先点中间那个原子',
    coachMeasureSides: '好。再点它两侧相连的原子',
    coachDrip: '选一瓶试剂，滴到完整分子上看看变不变',
    coachIsomer: '只给你分子式。换一种连法，就是另一种物质',
    controlLabel: '每次只改一处成键',
    controlBuild: '其余原子先不动。规律是台上读出来的，不是卷子上抄的。',
    drip: '滴上去看看',
    reactNoSample: '拼装台上还不是一个完整分子。先把空键位补满。',
    reactSampleLine: (name, group) => `台上样品：${name}（${group}）`,
    reactNeedReagent: '先选一瓶试剂。',
    reactDone: '这瓶试剂已经在这个分子上试过了，换一瓶。',
    isomerPrompt: '只给你分子式。原子数一样，连法不一样，就是不同的物质。',
    isomerRuleTitle: '怎么算同一种？',
    isomerRule: '只看谁跟谁相连，摆的角度不算。',
    isomerSlotEmpty: (n) => `第 ${n} 种：还没找到`,
    isomerFound: (name) => `已找到：${name}`,
    isomerHit: (name) => `找到一种：${name}！`,
    isomerRepeat: '这就是刚才那一种，连法完全一样。换个连法。',
    isomerWrongFormula: (has, want) => `台上是 ${has}，这一关要 ${want}。`,
    isomerIncomplete: '还有空着的键。先把它补满。',
    isomerChallengeDone: (formula) => `${formula} 的两种连法都找到了！`,
    isomerNext: '换下一张分子式卡 →',
    isomerAllDone: '两张分子式卡都通关了。同分异构不是摆姿势，是连法不同。',
    readFree: '空着的键',
    readAngle: '键角读数',
    noglTitle: '这台设备暂时打不开 3D 拼装台',
    noglText: '换一个支持 WebGL 的浏览器就能拼分子了。',
    viewStage: '舞台',
    viewFront: '正视',
    viewSide: '侧视',
    autoOrbit: '自动环绕',
    atomC: '碳',
    atomH: '氢',
    atomO: '氧',
    measure: '量键角',
    undo: '拆掉一个',
    clear: '清空',
    logTitle: '分子档案',
    reset: '重开实验',
    colMolecule: '分子',
    colFormula: '分子式',
    colShape: '形状',
    colAngle: '键角',
    colGroup: '官能团',
    matrixTitle: '反应矩阵',
    legendTitle: '怎么读这张表',
    legendYes: '✓ 有变化',
    legendNo: '✗ 没变化',
    legendUnknown: '· 还没试',
    archiveEmpty: '还没有分子入档',
    stateEmpty: '空台',
    stateBuilding: '拼装中',
    stateOpen: (n) => `还差 ${n} 根键`,
    stateComplete: '完整分子',
    stateMeasure: '量角器已举起',
    slotPlaced: (element, host) => `${element} 接到了${host}上。`,
    seedPlaced: (element) => `第一个${element}原子放好了。发光的就是还空着的键。`,
    slotFull: '这个原子已经没有空键位了。',
    bondUp: (order) => (order === 2 ? '变成双键了，这几个原子被压进同一个平面。' : '双键拆回单键。'),
    bondBlocked: '两端都得先腾出一根空键，才能变双键。',
    atomInfo: (element, free) => `${element}：还空着 ${free} 根键。`,
    atomInfoFull: (element) => `${element}：键位已经排满。`,
    undoDone: '拆掉一个末端原子。',
    undoBlocked: '中间的原子不能直接拆，先拆外面的。',
    undoEmpty: '台上已经空了。',
    cleared: '拼装台清空了。',
    measureOn: '量角器举起来了。先点中间那个原子。',
    measureOff: '收起量角器。',
    measureNeedCenter: '这个原子只有一根键，量不出夹角。挑一个中间的。',
    measurePickSides: '好。现在点它两侧的原子。',
    measureNeedNeighbor: '要点跟中间原子直接相连的那两个。',
    measureSame: '不能点同一个原子两次。',
    measureResult: (a, center, b, angle) => `${a}—${center}—${b} = ${angle}°`,
    measureLogged: (angle) => `键角 ${angle}° 已记入档案。`,
    buildDone: (name) => `${name} 拼好了！`,
    buildWrongSkeleton: (formula) => `原子数对上了（${formula}），但连法和这个分子不一样。`,
    archiveNew: (name) => `${name} 入档。`,
    conclusionStart: '拼一个分子，档案就会记下它的形状。试剂矩阵要自己滴。',
    conclusionShapes: '看档案：碳接 4 根单键就撑开，接双键就压成平面。',
    conclusionGroups: '再看反应矩阵：同一行的脾气，由连接方式决定。',
    conclusionFinal: '结论：分子式只说有几个原子；它是什么、能发生什么反应，要看原子怎么连。',
    targetHintDone: '四个分子都拼好了。打开试剂站，看它们脾气一样吗。',
    shapeTetra: '正四面体',
    shapeTrigonal: '平面三角',
    shapeChain: '折线链',
    groupAlkane: '只有 C—H',
    groupAlkene: '碳碳双键',
    groupHydroxyl: '羟基 —OH',
    groupCarboxyl: '羧基 —COOH',
    groupEther: '醚键 C—O—C',
    groupOther: '其他',
    nameMethane: '甲烷',
    nameEthene: '乙烯',
    nameEthanol: '乙醇',
    nameAceticAcid: '乙酸',
    nameDimethylEther: '甲醚',
    nameNButane: '正丁烷',
    nameIsoButane: '异丁烷',
    reagentBromineWater: '溴水',
    reagentBromineWaterShort: '溴水',
    reagentBromineWaterSub: '橙黄色，遇到能加成的键就褪色',
    reagentSodium: '金属钠',
    reagentSodiumShort: '钠',
    reagentSodiumSub: '遇到能给出的氢就冒气泡',
    reagentLitmus: '紫色石蕊',
    reagentLitmusShort: '石蕊',
    reagentLitmusSub: '遇酸变红',
    reagentEsterify: '乙酸 + 浓硫酸 · 加热',
    reagentEsterifyShort: '酯化',
    reagentEsterifySub: '生成有果香的酯',
    signBromineWaterYes: '橙色褪掉了 —— 双键把溴加进来了。',
    signBromineWaterNo: '橙色一点没变。',
    signSodiumYes: '钠粒上冒出气泡 —— 放出氢气。',
    signSodiumNo: '钠粒静静躺着，没有气泡。',
    signLitmusYes: '石蕊变红了 —— 它电离出了 H⁺。',
    signLitmusNo: '石蕊还是紫色。',
    signEsterifyYes: '闻到果香 —— 生成了酯。',
    signEsterifyNo: '没有香味，没有酯。',
    soundOn: '关闭声音',
    soundOff: '打开声音',
    musicOn: '关闭背景音乐',
    musicOff: '打开背景音乐',
    theme: '切换主题',
    lang: 'Switch to English',
    resetDone: '实验重置了。档案和矩阵都清空。',
    allDone: '通关：分子拼齐、反应矩阵填满、同分异构也找出来了。',
  },
  en: {
    doc: 'Organic Builder Lab · KidsLab',
    back: 'Back to platform',
    title: 'Organic Builder Lab',
    subtitle: 'Tap glowing bonds to build, then read angles and drip reagents',
    tabBuild: 'Build',
    tabReact: 'Test',
    tabIsomer: 'Isomers',
    parameters: 'Bench',
    coachStart: 'Pick an atom, then tap a glowing bond slot',
    coachOpen: (n) => `${n} open bond${n === 1 ? '' : 's'} left — tap a glow to join`,
    coachComplete: 'Finished. Read an angle, or open the panel and drip a reagent',
    coachMeasureCenter: 'Protractor raised. Tap the middle atom first',
    coachMeasureSides: 'Good. Now tap the two atoms bonded to it',
    coachDrip: 'Pick a bottle and drip it onto a finished molecule',
    coachIsomer: 'You only get the formula. Different wiring, different stuff',
    controlLabel: 'Change one bond at a time',
    controlBuild: 'Leave the other atoms alone. The pattern grows on the bench, not on a quiz.',
    drip: 'Drip it on',
    reactNoSample: 'The bench does not hold a finished molecule yet. Fill every open bond first.',
    reactSampleLine: (name, group) => `Sample on the bench: ${name} (${group})`,
    reactNeedReagent: 'Pick a reagent first.',
    reactDone: 'That reagent is already tested on this molecule. Try another bottle.',
    isomerPrompt: 'You only get the formula. Same atoms, different wiring, different substance.',
    isomerRuleTitle: 'What counts as the same?',
    isomerRule: 'Only who-bonds-to-whom counts. The pose does not.',
    isomerSlotEmpty: (n) => `Structure ${n}: not found yet`,
    isomerFound: (name) => `Found: ${name}`,
    isomerHit: (name) => `Found one: ${name}!`,
    isomerRepeat: 'That is the same wiring as before. Connect them a different way.',
    isomerWrongFormula: (has, want) => `The bench holds ${has}; this card needs ${want}.`,
    isomerIncomplete: 'Some bonds are still open. Fill them first.',
    isomerChallengeDone: (formula) => `Both wirings of ${formula} found!`,
    isomerNext: 'Next formula card →',
    isomerAllDone: 'Both formula cards cleared. Isomers are about wiring, not posing.',
    readFree: 'Open bonds',
    readAngle: 'Angle reading',
    noglTitle: 'This device cannot show the 3D bench',
    noglText: 'Another browser with WebGL will let you build molecules.',
    viewStage: 'Stage',
    viewFront: 'Front',
    viewSide: 'Side',
    autoOrbit: 'Auto orbit',
    atomC: 'Carbon',
    atomH: 'Hydrogen',
    atomO: 'Oxygen',
    measure: 'Protractor',
    undo: 'Take one off',
    clear: 'Clear',
    logTitle: 'Molecule log',
    reset: 'Restart lab',
    colMolecule: 'Molecule',
    colFormula: 'Formula',
    colShape: 'Shape',
    colAngle: 'Angle',
    colGroup: 'Group',
    matrixTitle: 'Reaction matrix',
    legendTitle: 'How to read this table',
    legendYes: '✓ changed',
    legendNo: '✗ no change',
    legendUnknown: '· untested',
    archiveEmpty: 'No molecule logged yet',
    stateEmpty: 'Empty bench',
    stateBuilding: 'Building',
    stateOpen: (n) => `${n} bond${n === 1 ? '' : 's'} to go`,
    stateComplete: 'Finished molecule',
    stateMeasure: 'Protractor raised',
    slotPlaced: (element, host) => `${element} joined the ${host}.`,
    seedPlaced: (element) => `First ${element} atom placed. The glowing prongs are its open bonds.`,
    slotFull: 'That atom has no open bond left.',
    bondUp: (order) => (order === 2
      ? 'Now a double bond — these atoms flatten into one plane.'
      : 'Double bond back to single.'),
    bondBlocked: 'Both ends need a spare bond before it can double up.',
    atomInfo: (element, free) => `${element}: ${free} open bond${free === 1 ? '' : 's'} left.`,
    atomInfoFull: (element) => `${element}: every bond slot is taken.`,
    undoDone: 'Took one end atom off.',
    undoBlocked: 'A middle atom cannot go first. Remove an outer one.',
    undoEmpty: 'The bench is already empty.',
    cleared: 'Bench cleared.',
    measureOn: 'Protractor raised. Click the middle atom first.',
    measureOff: 'Protractor put away.',
    measureNeedCenter: 'That atom has only one bond, so there is no angle. Pick a middle atom.',
    measurePickSides: 'Good. Now click the two atoms on either side.',
    measureNeedNeighbor: 'Pick the two atoms bonded directly to the middle one.',
    measureSame: 'You cannot pick the same atom twice.',
    measureResult: (a, center, b, angle) => `${a}—${center}—${b} = ${angle}°`,
    measureLogged: (angle) => `Angle ${angle}° written into the log.`,
    buildDone: (name) => `${name} is built!`,
    buildWrongSkeleton: (formula) => `Atom counts match (${formula}), but the wiring is not this molecule.`,
    archiveNew: (name) => `${name} logged.`,
    conclusionStart: 'Build a molecule and the log records its shape. Drip reagents yourself.',
    conclusionShapes: 'Read the log: four single bonds spread carbon out; a double bond flattens it.',
    conclusionGroups: 'Now read the matrix: each row behaves by how it is wired.',
    conclusionFinal: 'Conclusion: a formula only counts atoms. What a substance is comes from the wiring.',
    targetHintDone: 'All four are built. Open the reagent station and see if they behave alike.',
    shapeTetra: 'Tetrahedral',
    shapeTrigonal: 'Trigonal planar',
    shapeChain: 'Bent chain',
    groupAlkane: 'C—H only',
    groupAlkene: 'C=C double bond',
    groupHydroxyl: 'Hydroxyl —OH',
    groupCarboxyl: 'Carboxyl —COOH',
    groupEther: 'Ether C—O—C',
    groupOther: 'Other',
    nameMethane: 'Methane',
    nameEthene: 'Ethene',
    nameEthanol: 'Ethanol',
    nameAceticAcid: 'Acetic acid',
    nameDimethylEther: 'Dimethyl ether',
    nameNButane: 'n-Butane',
    nameIsoButane: 'Isobutane',
    reagentBromineWater: 'Bromine water',
    reagentBromineWaterShort: 'Br₂(aq)',
    reagentBromineWaterSub: 'Orange; fades when a bond can add it on',
    reagentSodium: 'Sodium metal',
    reagentSodiumShort: 'Na',
    reagentSodiumSub: 'Bubbles when a hydrogen can be given up',
    reagentLitmus: 'Purple litmus',
    reagentLitmusShort: 'Litmus',
    reagentLitmusSub: 'Turns red in acid',
    reagentEsterify: 'Acetic acid + conc. H₂SO₄ · heat',
    reagentEsterifyShort: 'Ester',
    reagentEsterifySub: 'Makes a fruity ester',
    signBromineWaterYes: 'The orange drained away — the double bond took the bromine.',
    signBromineWaterNo: 'The orange did not change at all.',
    signSodiumYes: 'Bubbles rise off the sodium — hydrogen gas.',
    signSodiumNo: 'The sodium just sits there. No bubbles.',
    signLitmusYes: 'The litmus went red — it released H⁺.',
    signLitmusNo: 'The litmus stayed purple.',
    signEsterifyYes: 'A fruity smell — an ester formed.',
    signEsterifyNo: 'No smell, no ester.',
    soundOn: 'Mute sound',
    soundOff: 'Turn sound on',
    musicOn: 'Mute music',
    musicOff: 'Turn music on',
    theme: 'Toggle theme',
    lang: '切换到中文',
    resetDone: 'Lab reset. The log and the matrix are cleared.',
    allDone: 'Complete: every molecule built, the matrix filled, and the isomers found.',
  },
};

const MOLECULE_NAME_KEYS = Object.freeze({
  methane: 'nameMethane',
  ethene: 'nameEthene',
  ethanol: 'nameEthanol',
  aceticAcid: 'nameAceticAcid',
  dimethylEther: 'nameDimethylEther',
  nButane: 'nameNButane',
  isoButane: 'nameIsoButane',
});
const GROUP_KEYS = Object.freeze({
  alkane: 'groupAlkane',
  alkene: 'groupAlkene',
  hydroxyl: 'groupHydroxyl',
  carboxyl: 'groupCarboxyl',
  ether: 'groupEther',
  other: 'groupOther',
  empty: 'groupOther',
});
const REAGENT_KEYS = Object.freeze({
  bromineWater: 'reagentBromineWater',
  sodium: 'reagentSodium',
  litmus: 'reagentLitmus',
  esterify: 'reagentEsterify',
});
const REAGENT_TINTS = Object.freeze({
  bromineWater: 0xe07b1f,
  sodium: 0x9fb6d8,
  litmus: 0x8b5fc4,
  esterify: 0xe8c33c,
});
const ELEMENT_NAME_KEYS = Object.freeze({ C: 'atomC', H: 'atomH', O: 'atomO' });
const SHAPE_KEYS = Object.freeze({
  methane: 'shapeTetra',
  ethene: 'shapeTrigonal',
  ethanol: 'shapeChain',
  aceticAcid: 'shapeTrigonal',
  dimethylEther: 'shapeChain',
  nButane: 'shapeChain',
  isoButane: 'shapeChain',
});
const VIEWS = Object.freeze({
  stage: { yaw: 0.72, pitch: 0.42 },
  front: { yaw: 0, pitch: 0.18 },
  side: { yaw: Math.PI / 2, pitch: 0.18 },
});

const $ = (selector) => document.querySelector(selector);
const elements = {
  langBtn: $('#langBtn'),
  themeBtn: $('#themeBtn'),
  soundBtn: $('#soundBtn'),
  musicBtn: $('#musicBtn'),
  console: $('#console'),
  sheetHandle: $('#sheetHandle'),
  coach: $('#coach'),
  currentTarget: $('#currentTarget'),
  targetGrid: $('#targetGrid'),
  reactSample: $('#reactSample'),
  reagentGrid: $('#reagentGrid'),
  dripBtn: $('#dripBtn'),
  reactFeedback: $('#reactFeedback'),
  isomerFormula: $('#isomerFormula'),
  isomerProgress: $('#isomerProgress'),
  isomerNextBtn: $('#isomerNextBtn'),
  isomerFeedback: $('#isomerFeedback'),
  labState: $('#labState'),
  readFormula: $('#readFormula'),
  readFree: $('#readFree'),
  readAngle: $('#readAngle'),
  canvas: $('#scene'),
  viewport: $('.viewport'),
  sceneMarkers: $('#sceneMarkers'),
  nogl: $('#nogl'),
  toast: $('#toast'),
  measureBtn: $('#measureBtn'),
  undoBtn: $('#undoBtn'),
  clearBtn: $('#clearBtn'),
  autoOrbitBtn: $('#autoOrbitBtn'),
  archiveBody: $('#archiveBody'),
  matrixHead: $('#matrixHead'),
  matrixBody: $('#matrixBody'),
  matrixCount: $('#matrixCount'),
  conclusion: $('#conclusion'),
};

function makeState() {
  return {
    station: 'build',
    molecule: createMolecule(),
    selectedElement: 'C',
    targetIndex: 0,
    archive: [],
    reactions: {},
    reagent: null,
    isomerIndex: 0,
    isomerFound: [[], []],
    measure: { active: false, centerId: null, sideIds: [] },
    angleReading: null,
    completed: false,
    played: false,
  };
}

let state = makeState();
let lang = window.cool?.preferences?.lang || 'zh';
let t = (key) => key;
const audio = createLabAudio();
const text = (key, ...args) => t(key, ...args);
const moleculeName = (key) => text(MOLECULE_NAME_KEYS[key] || key);
const groupName = (group) => text(GROUP_KEYS[group] || 'groupOther');
const elementName = (element) => text(ELEMENT_NAME_KEYS[element] || element);
const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉';
const prettyFormula = (formula) => formula.replace(/\d/g, (digit) => SUBSCRIPTS[Number(digit)]);

function markPlayed() {
  if (state.played) return;
  state.played = true;
  window.cool?.stage?.('building');
}

function renderSoundButtons() {
  elements.soundBtn.textContent = audio.sfxOn ? '🔊' : '🔇';
  elements.soundBtn.setAttribute('aria-pressed', String(audio.sfxOn));
  elements.soundBtn.setAttribute('aria-label', text(audio.sfxOn ? 'soundOn' : 'soundOff'));
  elements.musicBtn.textContent = audio.musicOn ? '♫' : '♩';
  elements.musicBtn.setAttribute('aria-pressed', String(audio.musicOn));
  elements.musicBtn.setAttribute('aria-label', text(audio.musicOn ? 'musicOn' : 'musicOff'));
}

let toastTimer = 0;
function toast(message, kind = '') {
  elements.toast.textContent = message;
  elements.toast.className = `focus-toast${kind ? ` is-${kind}` : ''}`;
  elements.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { elements.toast.hidden = true; }, kind === 'error' ? 3400 : 2800);
}

const ATOM_RADII = Object.freeze({ C: 0.36, H: 0.22, O: 0.33 });
const TWEEN_SECONDS = 0.3;
let renderer = null;
let scene = null;
let camera = null;
let hemiLight = null;
let sunLight = null;
let fillLight = null;
let benchTop = null;
let dishMesh = null;
const benchMaterials = [];
const moleculeGroup = new THREE.Group();
const atomGroup = new THREE.Group();
const bondGroup = new THREE.Group();
const slotGroup = new THREE.Group();
const effectGroup = new THREE.Group();
const arcGroup = new THREE.Group();
const atomMeshes = new Map();
const bondEntries = new Map();
const atomMaterials = new Map();
const disposables = [];
let slotMaterial = null;
let stubMaterial = null;
let arcMaterial = null;
let bondMaterial = null;
const orbit = {
  yaw: 0.72, pitch: 0.42, dist: 8.6,
  targetYaw: 0.72, targetPitch: 0.42, targetDist: 8.6,
  auto: false,
};
const pointers = new Map();
let dragging = false;
let dragMoved = 0;
let pinchStart = 0;
let groupOffset = new THREE.Vector3();
let groupOffsetTarget = new THREE.Vector3();
const effects = [];
let lastSize = { w: 0, h: 0 };

function cssColor(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  try {
    return new THREE.Color(raw || fallback);
  } catch {
    return new THREE.Color(fallback);
  }
}

function initScene() {
  try {
    renderer = new THREE.WebGLRenderer({ canvas: elements.canvas, antialias: true, alpha: false });
  } catch {
    elements.nogl.hidden = false;
    elements.canvas.remove();
    return false;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.06).texture;
  pmrem.dispose();

  hemiLight = new THREE.HemisphereLight(0xffffff, 0x40506a, 1.15);
  scene.add(hemiLight);
  sunLight = new THREE.DirectionalLight(0xfff6e8, 2.15);
  sunLight.position.set(4.8, 9.2, 5.2);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.left = -8;
  sunLight.shadow.camera.right = 8;
  sunLight.shadow.camera.top = 8;
  sunLight.shadow.camera.bottom = -8;
  sunLight.shadow.bias = -0.0015;
  scene.add(sunLight);
  fillLight = new THREE.DirectionalLight(0x9fd8ff, 0.55);
  fillLight.position.set(-6, 2.8, -5);
  scene.add(fillLight);

  createBench();

  for (const element of Object.keys(ELEMENTS)) {
    const material = new THREE.MeshPhysicalMaterial({
      color: cssColor(`--atom-${element.toLowerCase()}`, '#888888'),
      roughness: element === 'H' ? 0.22 : 0.28,
      metalness: element === 'C' ? 0.22 : 0.06,
      clearcoat: element === 'H' ? 0.55 : 0.18,
      clearcoatRoughness: 0.32,
    });
    atomMaterials.set(element, material);
    disposables.push(material);
  }
  bondMaterial = new THREE.MeshStandardMaterial({ color: 0xb9c2cc, roughness: 0.38, metalness: 0.42 });
  slotMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8a13c, emissive: 0xe8a13c, emissiveIntensity: 0.7,
    transparent: true, opacity: 0.55, roughness: 0.3,
  });
  stubMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8a13c, roughness: 0.5, metalness: 0.2, transparent: true, opacity: 0.55,
  });
  arcMaterial = new THREE.MeshStandardMaterial({
    color: 0x34b8c6, emissive: 0x34b8c6, emissiveIntensity: 0.55, roughness: 0.4,
  });
  disposables.push(bondMaterial, slotMaterial, stubMaterial, arcMaterial);

  moleculeGroup.add(atomGroup, bondGroup, slotGroup, effectGroup, arcGroup);
  scene.add(moleculeGroup);
  applySceneTheme();
  resizeRenderer();
  requestAnimationFrame(animate);
  return true;
}

function createBench() {
  const wood = new THREE.MeshStandardMaterial({ color: cssColor('--bench-color', '#c4a574'), roughness: 0.7, metalness: 0.05 });
  const woodDark = new THREE.MeshStandardMaterial({ color: 0x4a331f, roughness: 0.78, metalness: 0.04 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x8f99a6, roughness: 0.28, metalness: 0.78 });
  const brass = new THREE.MeshPhysicalMaterial({ color: 0xc9973f, roughness: 0.3, metalness: 0.86, clearcoat: 0.35 });
  const porcelain = new THREE.MeshPhysicalMaterial({
    color: 0xf4efe4, roughness: 0.2, metalness: 0.04, clearcoat: 0.65, clearcoatRoughness: 0.18,
  });
  benchMaterials.push(wood, woodDark, steel, brass, porcelain);

  benchTop = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.24, 4.6), wood);
  benchTop.position.set(0, -2.32, 0);
  benchTop.receiveShadow = true;
  benchTop.castShadow = true;
  scene.add(benchTop);

  for (const [x, z] of [[-3.2, -1.85], [3.2, -1.85], [-3.2, 1.85], [3.2, 1.85]]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.7, 0.24), woodDark);
    leg.position.set(x, -3.28, z);
    leg.castShadow = true;
    scene.add(leg);
  }

  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.72, 0.12, 28), steel);
  standBase.position.set(-2.55, -2.14, -1.45);
  standBase.castShadow = true;
  scene.add(standBase);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.2, 16), steel);
  rod.position.set(-2.55, -0.48, -1.45);
  rod.castShadow = true;
  scene.add(rod);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 12), steel);
  arm.rotation.z = Math.PI / 2;
  arm.position.set(-1.45, 0.55, -1.45);
  scene.add(arm);
  const clamp = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 10, 28), brass);
  clamp.rotation.y = Math.PI / 2;
  clamp.position.set(-0.4, 0.55, -1.45);
  clamp.castShadow = true;
  scene.add(clamp);

  dishMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.5, 0.09, 56), porcelain);
  dishMesh.position.set(0, -1.94, 0);
  dishMesh.receiveShadow = true;
  dishMesh.castShadow = true;
  scene.add(dishMesh);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.46, 0.035, 8, 56), brass);
  rim.rotation.x = Math.PI / 2;
  rim.position.set(0, -1.88, 0);
  scene.add(rim);
}

function applySceneTheme() {
  if (!renderer) return;
  const dark = (window.cool?.preferences?.theme || 'light') === 'dark';
  const paper = cssColor('--paper', dark ? '#101620' : '#ece9e2');
  scene.background = paper;
  hemiLight.intensity = dark ? 0.78 : 1.15;
  hemiLight.groundColor.set(dark ? 0x1b2634 : 0x6a5a40);
  sunLight.intensity = dark ? 1.85 : 2.15;
  fillLight.intensity = dark ? 0.42 : 0.55;
  benchTop.material.color.copy(cssColor('--bench-color', dark ? '#3a4b5e' : '#c4a574'));
  for (const [element, material] of atomMaterials) {
    material.color.copy(cssColor(`--atom-${element.toLowerCase()}`, '#888888'));
  }
  bondMaterial.color.set(dark ? 0x8b9aa9 : 0xc3ccd6);
}

function resizeRenderer() {
  if (!renderer) return;
  const width = Math.max(1, elements.viewport.clientWidth || window.innerWidth);
  const height = Math.max(1, elements.viewport.clientHeight || window.innerHeight);
  if (width === lastSize.w && height === lastSize.h) return;
  lastSize = { w: width, h: height };
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.fov = camera.aspect < 0.85 ? 48 : 38;
  camera.updateProjectionMatrix();
}

function disposeChildren(group) {
  for (const child of [...group.children]) {
    group.remove(child);
    child.traverse?.((node) => { if (node.geometry) node.geometry.dispose(); });
    if (child.geometry) child.geometry.dispose();
  }
}

function syncScene() {
  if (!renderer) return;
  const { positions, openSlots } = layoutMolecule(state.molecule);

  for (const [atomId, mesh] of [...atomMeshes]) {
    if (!positions.has(atomId)) {
      atomGroup.remove(mesh);
      mesh.geometry.dispose();
      mesh.children.forEach((child) => child.geometry?.dispose());
      atomMeshes.delete(atomId);
    }
  }

  for (const atom of state.molecule.atoms) {
    const target = positions.get(atom.id);
    if (!target) continue;
    let mesh = atomMeshes.get(atom.id);
    if (!mesh) {
      const radius = ATOM_RADII[atom.element];
      const geometry = new THREE.SphereGeometry(radius, 36, 24);
      mesh = new THREE.Mesh(geometry, atomMaterials.get(atom.element));
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { kind: 'atom', atomId: atom.id, element: atom.element };
      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(Math.max(radius, 0.34), 12, 10),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      );
      hit.userData = mesh.userData;
      mesh.add(hit);
      mesh.position.set(...target);
      mesh.userData.from = mesh.position.clone();
      mesh.userData.to = mesh.position.clone();
      mesh.userData.progress = 1;
      mesh.scale.setScalar(0.01);
      mesh.userData.pop = 0;
      atomGroup.add(mesh);
      atomMeshes.set(atom.id, mesh);
    } else {
      const to = new THREE.Vector3(...target);
      if (to.distanceToSquared(mesh.userData.to) > 1e-8) {
        mesh.userData.from = mesh.position.clone();
        mesh.userData.to = to;
        mesh.userData.progress = 0;
      }
    }
  }

  for (const [bondId, entry] of [...bondEntries]) {
    const bond = state.molecule.bonds.find((item) => item.id === bondId);
    if (!bond || bond.order !== entry.order) {
      bondGroup.remove(entry.group);
      disposeChildren(entry.group);
      bondEntries.delete(bondId);
    }
  }

  for (const bond of state.molecule.bonds) {
    if (bondEntries.has(bond.id)) continue;
    const group = new THREE.Group();
    const strands = bond.order === 1 ? [0] : [-1, 1];
    const radius = bond.order === 1 ? 0.1 : 0.066;
    strands.forEach((side) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, 18, 1, true), bondMaterial);
      mesh.castShadow = true;
      mesh.userData = { kind: 'bond', bondId: bond.id, side };
      group.add(mesh);
    });
    const hit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 1, 10, 1, true),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    );
    hit.userData = { kind: 'bond', bondId: bond.id, side: 0 };
    group.add(hit);
    bondGroup.add(group);
    bondEntries.set(bond.id, { group, order: bond.order, perp: bondPerpendicular(bond, positions) });
  }

  disposeChildren(slotGroup);
  const activeSlots = [];
  if (!state.measure.active) {
    const usedHosts = new Set();
    for (const slot of openSlots) {
      const isActive = !usedHosts.has(slot.hostId);
      if (isActive) {
        usedHosts.add(slot.hostId);
        activeSlots.push(slot);
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 16), slotMaterial);
        mesh.position.set(...slot.position);
        mesh.userData = { kind: 'slot', hostId: slot.hostId, pulse: true };
        const hit = new THREE.Mesh(
          new THREE.SphereGeometry(0.4, 10, 8),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
        );
        hit.userData = mesh.userData;
        mesh.add(hit);
        slotGroup.add(mesh);
      }
      const host = positions.get(slot.hostId);
      if (!host) continue;
      const stub = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.42, 12, 1, true), stubMaterial);
      const direction = new THREE.Vector3(...slot.direction);
      stub.position.set(...host).addScaledVector(direction, 0.42);
      stub.quaternion.setFromUnitVectors(UP, direction);
      stub.userData = { kind: 'slot', hostId: slot.hostId };
      slotGroup.add(stub);
    }
    if (!state.molecule.atoms.length) {
      activeSlots.push({ hostId: null, position: [0, 0, 0], direction: [0, 1, 0] });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.26, 22, 16), slotMaterial);
      mesh.userData = { kind: 'slot', hostId: null, pulse: true };
      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 10, 8),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      );
      hit.userData = mesh.userData;
      mesh.add(hit);
      slotGroup.add(mesh);
    }
  }

  rebuildMarkers(activeSlots, positions);

  const points = [...positions.values()];
  if (points.length) {
    const centroid = points.reduce(
      (sum, point) => [sum[0] + point[0], sum[1] + point[1], sum[2] + point[2]],
      [0, 0, 0],
    ).map((value) => value / points.length);
    const lift = camera.aspect < 0.85 ? 0.85 : 0.15;
    groupOffsetTarget = new THREE.Vector3(-centroid[0], -centroid[1] + lift, -centroid[2]);
    const radius = Math.max(...points.map((point) => Math.hypot(
      point[0] - centroid[0], point[1] - centroid[1], point[2] - centroid[2],
    )));
    orbit.targetDist = Math.min(13.5, Math.max(6.4, 5.4 + radius * 2.1));
  } else {
    groupOffsetTarget = new THREE.Vector3(0, camera.aspect < 0.85 ? 0.85 : 0.15, 0);
    orbit.targetDist = 7.4;
  }
  orbit.dist = orbit.targetDist;
  refreshArc(positions);
}

const markers = [];
function rebuildMarkers(activeSlots, positions) {
  markers.length = 0;
  const fragment = document.createDocumentFragment();
  const addMarker = (kind, resolve, options) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `scene-marker scene-marker--${kind}${options.extraClass || ''}`;
    button.dataset.marker = kind;
    Object.assign(button.dataset, options.data || {});
    button.setAttribute('aria-label', options.label);
    if (options.glyph) button.textContent = options.glyph;
    fragment.append(button);
    markers.push({ element: button, resolve });
  };
  const anchorOf = (atomId) => {
    const target = positions.get(atomId);
    return target ? new THREE.Vector3(...target) : new THREE.Vector3();
  };

  if (state.measure.active) {
    const { centerId, sideIds } = state.measure;
    for (const atom of state.molecule.atoms) {
      if (!atomMeshes.has(atom.id)) continue;
      const isCenter = centerId === atom.id;
      const picked = sideIds.includes(atom.id);
      const pickable = centerId
        ? !isCenter && !picked && neighborsOf(state.molecule, centerId).some((edge) => edge.id === atom.id)
        : neighborsOf(state.molecule, atom.id).length >= 2;
      if (!pickable && !isCenter && !picked) continue;
      addMarker('atom', () => anchorOf(atom.id), {
        data: { atomId: String(atom.id) },
        extraClass: pickable ? ' is-pickable' : ' is-picked is-locked',
        label: `${elementName(atom.element)} ${atom.id}`,
        glyph: isCenter ? '◎' : picked ? '✓' : '',
      });
    }
  } else {
    activeSlots.forEach((slot, index) => {
      const host = slot.hostId === null ? null : elementOf(state.molecule, slot.hostId);
      addMarker('slot', () => new THREE.Vector3(...slot.position), {
        data: { slotIndex: String(index), slotHost: slot.hostId === null ? 'seed' : String(slot.hostId) },
        label: host
          ? `${elementName(state.selectedElement)} → ${elementName(host)}`
          : elementName(state.selectedElement),
        glyph: '+',
      });
    });
    for (const bond of state.molecule.bonds) {
      if (!positions.has(bond.a) || !positions.has(bond.b)) continue;
      const canChange = bond.order > 1
        || (freeValence(state.molecule, bond.a) >= 1 && freeValence(state.molecule, bond.b) >= 1);
      if (!canChange) continue;
      const midpoint = anchorOf(bond.a).add(anchorOf(bond.b)).multiplyScalar(0.5);
      const pair = [elementOf(state.molecule, bond.a), elementOf(state.molecule, bond.b)].sort().join('');
      addMarker('bond', () => midpoint, {
        data: { bondId: bond.id, bondKind: pair, bondOrder: String(bond.order) },
        label: `${elementOf(state.molecule, bond.a)}–${elementOf(state.molecule, bond.b)}`,
      });
    }
  }
  elements.sceneMarkers.replaceChildren(fragment);
  updateMarkerPositions();
}

const projected = new THREE.Vector3();
const MARKER_MIN_GAP = 48;
const MARKER_EDGE = 24;
const markerLayout = [];

function updateMarkerPositions() {
  if (!markers.length || !camera) return;
  const width = elements.canvas.clientWidth;
  const height = elements.canvas.clientHeight;
  markerLayout.length = 0;
  for (const marker of markers) {
    projected.copy(marker.resolve()).add(groupOffsetTarget).project(camera);
    if (projected.z > 1) {
      marker.element.style.visibility = 'hidden';
      continue;
    }
    marker.element.style.visibility = 'visible';
    marker.element.style.zIndex = String(Math.round((1 - projected.z) * 1000));
    markerLayout.push({
      marker,
      x: (projected.x * 0.5 + 0.5) * width,
      y: (-projected.y * 0.5 + 0.5) * height,
    });
  }
  for (let pass = 0; pass < 4; pass += 1) {
    for (let i = 0; i < markerLayout.length; i += 1) {
      for (let j = i + 1; j < markerLayout.length; j += 1) {
        const a = markerLayout[i];
        const b = markerLayout[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distance = Math.hypot(dx, dy);
        if (distance >= MARKER_MIN_GAP) continue;
        if (distance < 0.001) { dx = 1; dy = 0.35; distance = Math.hypot(dx, dy); }
        const push = (MARKER_MIN_GAP - distance) / 2;
        const ux = (dx / distance) * push;
        const uy = (dy / distance) * push;
        a.x -= ux; a.y -= uy; b.x += ux; b.y += uy;
      }
    }
  }
  for (const item of markerLayout) {
    const x = Math.min(width - MARKER_EDGE, Math.max(MARKER_EDGE, item.x));
    const y = Math.min(height - MARKER_EDGE, Math.max(MARKER_EDGE, item.y));
    const transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
    if (item.marker.transform !== transform) {
      item.marker.transform = transform;
      item.marker.element.style.transform = transform;
    }
  }
}

function bondPerpendicular(bond, positions) {
  const pa = positions.get(bond.a);
  const pb = positions.get(bond.b);
  const fallback = new THREE.Vector3(0, 0, 1);
  if (!pa || !pb) return fallback;
  const axis = new THREE.Vector3(pb[0] - pa[0], pb[1] - pa[1], pb[2] - pa[2]).normalize();
  const adj = adjacency(state.molecule);
  const pick = (hostId, partnerId, origin) => {
    for (const edge of adj.get(hostId) || []) {
      if (edge.id === partnerId) continue;
      const other = positions.get(edge.id);
      if (!other) continue;
      return new THREE.Vector3(other[0] - origin[0], other[1] - origin[1], other[2] - origin[2]);
    }
    return null;
  };
  const reference = pick(bond.a, bond.b, pa) || pick(bond.b, bond.a, pb);
  if (!reference) return fallback;
  const perpendicular = reference.clone().sub(axis.clone().multiplyScalar(reference.dot(axis)));
  return perpendicular.lengthSq() > 1e-6 ? perpendicular.normalize() : fallback;
}

const UP = new THREE.Vector3(0, 1, 0);
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpAxis = new THREE.Vector3();
const tmpPerp = new THREE.Vector3();
const tmpQuat = new THREE.Quaternion();

function updateBondTransforms() {
  for (const [bondId, entry] of bondEntries) {
    const bond = state.molecule.bonds.find((item) => item.id === bondId);
    if (!bond) continue;
    const meshA = atomMeshes.get(bond.a);
    const meshB = atomMeshes.get(bond.b);
    if (!meshA || !meshB) continue;
    tmpA.copy(meshA.position);
    tmpB.copy(meshB.position);
    tmpAxis.copy(tmpB).sub(tmpA);
    const distance = tmpAxis.length();
    if (distance < 1e-5) continue;
    tmpAxis.divideScalar(distance);
    tmpQuat.setFromUnitVectors(UP, tmpAxis);
    tmpPerp.copy(entry.perp);
    tmpPerp.sub(tmpAxis.clone().multiplyScalar(tmpPerp.dot(tmpAxis)));
    if (tmpPerp.lengthSq() < 1e-6) tmpPerp.set(tmpAxis.z, tmpAxis.x, tmpAxis.y).cross(tmpAxis);
    tmpPerp.normalize();
    const offset = entry.order === 1 ? 0 : 0.115;
    for (const child of entry.group.children) {
      child.quaternion.copy(tmpQuat);
      child.scale.set(1, distance, 1);
      child.position.copy(tmpA).addScaledVector(tmpAxis, distance / 2);
      if (offset && child.userData.side) child.position.addScaledVector(tmpPerp, offset * child.userData.side);
    }
  }
}

function refreshArc(positions) {
  disposeChildren(arcGroup);
  const { centerId, sideIds } = state.measure;
  if (!centerId || sideIds.length !== 2) return;
  const center = positions.get(centerId);
  const first = positions.get(sideIds[0]);
  const second = positions.get(sideIds[1]);
  if (!center || !first || !second) return;
  const origin = new THREE.Vector3(...center);
  const u = new THREE.Vector3(...first).sub(origin).normalize();
  const v = new THREE.Vector3(...second).sub(origin).normalize();
  const total = u.angleTo(v);
  const axis = new THREE.Vector3().crossVectors(u, v);
  if (axis.lengthSq() < 1e-8) return;
  axis.normalize();
  const points = [];
  for (let i = 0; i <= 40; i += 1) {
    points.push(u.clone().applyAxisAngle(axis, (total * i) / 40).multiplyScalar(0.72).add(origin));
  }
  arcGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 44, 0.035, 8, false), arcMaterial));
}

function spawnEffect(reagent, reacts) {
  if (!renderer) return;
  const color = new THREE.Color(REAGENT_TINTS[reagent] || 0xffffff);
  const count = reacts ? 18 : 8;
  for (let i = 0; i < count; i += 1) {
    const geometry = new THREE.SphereGeometry(reacts ? 0.09 : 0.07, 10, 8);
    const material = new THREE.MeshStandardMaterial({
      color, emissive: color, emissiveIntensity: reacts ? 0.6 : 0.2, transparent: true, opacity: 0.9,
    });
    const mesh = new THREE.Mesh(geometry, material);
    const angle = (Math.PI * 2 * i) / count;
    const spread = 0.9 + Math.random() * 0.7;
    mesh.position.set(Math.cos(angle) * spread, 1.9 + Math.random() * 0.6, Math.sin(angle) * spread);
    effectGroup.add(mesh);
    effects.push({
      mesh, material, geometry, life: 0, span: reacts ? 1.25 : 0.85,
      velocity: new THREE.Vector3(Math.cos(angle) * 0.12, reacts ? 0.55 + Math.random() * 0.5 : -1.5, Math.sin(angle) * 0.12),
    });
  }
}

function stepEffects(delta) {
  for (let i = effects.length - 1; i >= 0; i -= 1) {
    const effect = effects[i];
    effect.life += delta;
    const ratio = effect.life / effect.span;
    effect.mesh.position.addScaledVector(effect.velocity, delta);
    effect.material.opacity = Math.max(0, 0.9 * (1 - ratio));
    effect.mesh.scale.setScalar(1 + ratio * 0.6);
    if (ratio >= 1) {
      effectGroup.remove(effect.mesh);
      effect.geometry.dispose();
      effect.material.dispose();
      effects.splice(i, 1);
    }
  }
}

const SETTLE = 0.0008;
function approach(current, target, factor) {
  const next = current + (target - current) * Math.min(1, factor);
  return Math.abs(target - next) < SETTLE ? target : next;
}

let lastFrame = 0;
function animate(now) {
  requestAnimationFrame(animate);
  if (!renderer) return;
  const delta = Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0.016);
  lastFrame = now;
  for (const mesh of atomMeshes.values()) {
    if (mesh.userData.progress < 1) {
      mesh.userData.progress = Math.min(1, mesh.userData.progress + delta / TWEEN_SECONDS);
      const k = 1 - (1 - mesh.userData.progress) ** 3;
      mesh.position.lerpVectors(mesh.userData.from, mesh.userData.to, k);
    }
    if (mesh.userData.pop < 1) {
      mesh.userData.pop = Math.min(1, mesh.userData.pop + delta / 0.26);
      const k = 1 - (1 - mesh.userData.pop) ** 3;
      mesh.scale.setScalar(0.2 + 0.8 * k + Math.sin(k * Math.PI) * 0.12);
    }
  }
  updateBondTransforms();
  const pulse = 0.86 + Math.sin(now / 260) * 0.16;
  for (const slot of slotGroup.children) {
    if (slot.userData.pulse) slot.scale.setScalar(pulse);
  }
  if (slotMaterial) slotMaterial.opacity = 0.42 + Math.sin(now / 260) * 0.16;
  stepEffects(delta);
  groupOffset.lerp(groupOffsetTarget, Math.min(1, delta * 7));
  if (groupOffset.distanceTo(groupOffsetTarget) < SETTLE) groupOffset.copy(groupOffsetTarget);
  moleculeGroup.position.copy(groupOffset);
  if (orbit.auto) orbit.targetYaw += delta * 0.35;
  orbit.yaw = approach(orbit.yaw, orbit.targetYaw, delta * 9);
  orbit.pitch = approach(orbit.pitch, orbit.targetPitch, delta * 9);
  orbit.dist = approach(orbit.dist, orbit.targetDist, delta * 5);
  camera.position.set(
    Math.cos(orbit.pitch) * Math.sin(orbit.yaw) * orbit.dist,
    Math.sin(orbit.pitch) * orbit.dist,
    Math.cos(orbit.pitch) * Math.cos(orbit.yaw) * orbit.dist,
  );
  camera.lookAt(0, camera.aspect < 0.85 ? -0.85 : 0, 0);
  camera.updateMatrixWorld();
  updateMarkerPositions();
  renderer.render(scene, camera);
}

const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();
function pickAt(clientX, clientY) {
  if (!renderer) return null;
  const rect = elements.canvas.getBoundingClientRect();
  pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNdc, camera);
  const order = state.measure.active ? [atomGroup, bondGroup] : [slotGroup, bondGroup, atomGroup];
  for (const group of order) {
    const hits = raycaster.intersectObjects(group.children, true);
    if (hits.length) return hits[0].object.userData;
  }
  return null;
}

function isOrbitIgnore(target) {
  return Boolean(target.closest?.('.view-dock, .tool-dock, .console, .bar, .sheet-handle'));
}

function bindPointer() {
  if (!renderer) return;
  const host = elements.viewport;
  host.addEventListener('pointerdown', (event) => {
    if (isOrbitIgnore(event.target)) return;
    if (event.target === elements.canvas) host.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) { dragging = true; dragMoved = 0; }
    else if (pointers.size === 2) {
      const [first, second] = [...pointers.values()];
      pinchStart = Math.hypot(first.x - second.x, first.y - second.y);
    }
  });
  host.addEventListener('pointermove', (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size >= 2) {
      const [first, second] = [...pointers.values()];
      const spread = Math.hypot(first.x - second.x, first.y - second.y);
      if (pinchStart > 0) {
        orbit.targetDist = Math.min(15, Math.max(4.2, orbit.targetDist * (pinchStart / Math.max(1, spread))));
        pinchStart = spread;
      }
      dragMoved = 99;
      return;
    }
    dragMoved += Math.abs(dx) + Math.abs(dy);
    if (!dragging || dragMoved < 6) return;
    if (orbit.auto) setAutoOrbit(false);
    orbit.targetYaw -= dx * 0.008;
    orbit.targetPitch = Math.max(-1.2, Math.min(1.2, orbit.targetPitch + dy * 0.006));
  });
  const finish = (event) => {
    const wasSingle = pointers.size === 1;
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = 0;
    if (!pointers.size) dragging = false;
    if (wasSingle && dragMoved < 6 && event.target === elements.canvas) {
      handleScenePick(event.clientX, event.clientY);
    }
  };
  host.addEventListener('pointerup', finish);
  host.addEventListener('pointercancel', (event) => {
    pointers.delete(event.pointerId);
    if (!pointers.size) dragging = false;
  });
  host.addEventListener('wheel', (event) => {
    if (isOrbitIgnore(event.target)) return;
    event.preventDefault();
    orbit.targetDist = Math.min(15, Math.max(4.2, orbit.targetDist + Math.sign(event.deltaY) * 0.7));
  }, { passive: false });
}

function handleScenePick(clientX, clientY) {
  const target = pickAt(clientX, clientY);
  if (!target) return;
  if (state.measure.active) {
    if (target.kind === 'atom') handleMeasurePick(target.atomId);
    return;
  }
  if (target.kind === 'slot') { placeAtom(target.hostId); return; }
  if (target.kind === 'bond') { toggleBond(target.bondId); return; }
  if (target.kind === 'atom') {
    const free = freeValence(state.molecule, target.atomId);
    toast(free > 0
      ? text('atomInfo', elementName(target.element), free)
      : text('atomInfoFull', elementName(target.element)));
  }
}

function placeAtom(hostId) {
  markPlayed();
  const element = state.selectedElement;
  if (hostId === null) {
    state.molecule = addAtom(createMolecule(), element).molecule;
    audio.place();
    toast(text('seedPlaced', elementName(element)));
    window.cool?.track?.('place_atom', { element });
    afterMoleculeChange();
    return;
  }
  const host = elementOf(state.molecule, hostId);
  const result = attachAtom(state.molecule, hostId, element, 1);
  if (!result.atomId) {
    audio.error();
    toast(text('slotFull'), 'error');
    return;
  }
  state.molecule = result.molecule;
  audio.place();
  toast(text('slotPlaced', elementName(element), elementName(host)));
  window.cool?.track?.('place_atom', { element });
  afterMoleculeChange();
}

function toggleBond(bondId) {
  markPlayed();
  const result = cycleBondOrder(state.molecule, bondId);
  if (!result.changed) {
    audio.error();
    toast(text('bondBlocked'), 'error');
    return;
  }
  state.molecule = result.molecule;
  const after = state.molecule.bonds.find((bond) => bond.id === bondId).order;
  audio.bond();
  toast(text('bondUp', after));
  window.cool?.track?.('raise_bond', { order: after });
  afterMoleculeChange();
}

function undoAtom() {
  if (!state.molecule.atoms.length) {
    audio.error();
    toast(text('undoEmpty'), 'error');
    return;
  }
  const terminal = [...state.molecule.atoms]
    .reverse()
    .find((atom) => neighborsOf(state.molecule, atom.id).length <= 1);
  if (!terminal) {
    audio.error();
    toast(text('undoBlocked'), 'error');
    return;
  }
  const result = removeAtom(state.molecule, terminal.id);
  if (!result.removed) {
    audio.error();
    toast(text('undoBlocked'), 'error');
    return;
  }
  state.molecule = result.molecule;
  audio.place();
  toast(text('undoDone'));
  afterMoleculeChange();
}

function clearBench() {
  state.molecule = createMolecule();
  state.measure = { active: false, centerId: null, sideIds: [] };
  state.angleReading = null;
  audio.clear();
  toast(text('cleared'));
  afterMoleculeChange();
}

function afterMoleculeChange() {
  state.measure.centerId = null;
  state.measure.sideIds = [];
  state.angleReading = null;
  checkStationProgress();
  syncScene();
  render();
}

function toggleMeasure() {
  state.measure.active = !state.measure.active;
  state.measure.centerId = null;
  state.measure.sideIds = [];
  if (state.measure.active) state.angleReading = null;
  toast(text(state.measure.active ? 'measureOn' : 'measureOff'));
  audio.measure();
  syncScene();
  render();
}

function handleMeasurePick(atomId) {
  const measure = state.measure;
  if (!measure.centerId) {
    if (neighborsOf(state.molecule, atomId).length < 2) {
      audio.error();
      toast(text('measureNeedCenter'), 'error');
      return;
    }
    measure.centerId = atomId;
    measure.sideIds = [];
    audio.measure();
    toast(text('measurePickSides'));
    syncScene();
    render();
    return;
  }
  const isNeighbor = neighborsOf(state.molecule, measure.centerId).some((edge) => edge.id === atomId);
  if (!isNeighbor) {
    audio.error();
    toast(text('measureNeedNeighbor'), 'error');
    return;
  }
  if (measure.sideIds.includes(atomId)) {
    audio.error();
    toast(text('measureSame'), 'error');
    return;
  }
  measure.sideIds.push(atomId);
  if (measure.sideIds.length < 2) {
    audio.measure();
    syncScene();
    render();
    return;
  }
  const { positions } = layoutMolecule(state.molecule);
  const angle = measureAngle(positions, measure.sideIds[0], measure.centerId, measure.sideIds[1]);
  state.angleReading = angle;
  audio.measure();
  const label = text(
    'measureResult',
    elementOf(state.molecule, measure.sideIds[0]),
    elementOf(state.molecule, measure.centerId),
    elementOf(state.molecule, measure.sideIds[1]),
    angle.toFixed(1),
  );
  const identity = identifyMolecule(state.molecule);
  const row = identity && state.archive.find((entry) => entry.key === identity.key);
  if (row && row.angle === null) {
    row.angle = angle;
    row.angleLabel = `${elementOf(state.molecule, measure.sideIds[0])}–${elementOf(state.molecule, measure.centerId)}–${elementOf(state.molecule, measure.sideIds[1])}`;
    toast(`${label} · ${text('measureLogged', angle.toFixed(1))}`, 'success');
    window.cool?.track?.('measure_angle', { molecule: identity.key, angle: Number(angle.toFixed(1)) });
  } else {
    toast(label);
    window.cool?.track?.('measure_angle', { angle: Number(angle.toFixed(1)) });
  }
  syncScene();
  render();
}

function currentTargetKey() {
  return BUILD_TARGETS[state.targetIndex] || null;
}

function archiveMolecule(identity) {
  if (state.archive.some((entry) => entry.key === identity.key)) return false;
  state.archive.push({
    key: identity.key,
    formula: identity.formula,
    group: identity.group,
    angle: null,
    angleLabel: '',
  });
  return true;
}

function checkStationProgress() {
  const identity = identifyMolecule(state.molecule);
  if (state.station === 'build') {
    const targetKey = currentTargetKey();
    if (identity && targetKey && identity.key === targetKey) {
      const fresh = archiveMolecule(identity);
      state.targetIndex = Math.min(BUILD_TARGETS.length, state.targetIndex + 1);
      window.cool?.stage?.(`built_${identity.key}`);
      if (fresh) {
        audio[state.targetIndex >= BUILD_TARGETS.length ? 'complete' : 'success']();
        toast(text('buildDone', moleculeName(identity.key)), 'success');
      }
    } else if (identity) {
      archiveMolecule(identity);
    } else if (isComplete(state.molecule) && targetKey) {
      const wanted = MOLECULE_LIBRARY[targetKey];
      if (molecularFormula(state.molecule) === wanted.formula) {
        audio.error();
        toast(text('buildWrongSkeleton', prettyFormula(wanted.formula)), 'error');
      }
    }
  } else if (identity) {
    archiveMolecule(identity);
  }
  if (state.station === 'isomer') checkIsomer(identity);
  checkCompletion();
}

function checkIsomer(identity) {
  const challenge = ISOMER_CHALLENGES[state.isomerIndex];
  if (!challenge || !state.molecule.atoms.length) return;
  if (!isComplete(state.molecule)) {
    state.isomerNotice = { key: 'isomerIncomplete', kind: '' };
    return;
  }
  const formula = molecularFormula(state.molecule);
  if (formula !== challenge.formula) {
    state.isomerNotice = {
      key: 'isomerWrongFormula',
      kind: 'error',
      args: [prettyFormula(formula), prettyFormula(challenge.formula)],
    };
    return;
  }
  const match = matchIsomer(challenge, state.molecule);
  if (!match) {
    state.isomerNotice = { key: 'isomerRepeat', kind: 'error' };
    return;
  }
  const found = state.isomerFound[state.isomerIndex];
  if (found.includes(match)) {
    state.isomerNotice = { key: 'isomerRepeat', kind: 'error' };
    return;
  }
  found.push(match);
  if (identity) archiveMolecule(identity);
  window.cool?.stage?.(`isomer_${challenge.id}`);
  window.cool?.track?.('find_isomer', { challenge: challenge.id, molecule: match });
  if (found.length >= challenge.answers.length) {
    state.isomerNotice = { key: 'isomerChallengeDone', kind: 'success', args: [prettyFormula(challenge.formula)] };
    audio.complete();
    toast(text('isomerChallengeDone', prettyFormula(challenge.formula)), 'success');
  } else {
    state.isomerNotice = { key: 'isomerHit', kind: 'success', args: [moleculeName(match)] };
    audio.success();
    toast(text('isomerHit', moleculeName(match)), 'success');
  }
}

function matrixRows() {
  const ordered = BUILD_TARGETS.filter((key) => state.archive.some((entry) => entry.key === key));
  const extra = state.archive.map((entry) => entry.key).filter((key) => !BUILD_TARGETS.includes(key));
  return [...ordered, ...extra];
}

function testedCellCount() {
  return BUILD_TARGETS.reduce(
    (total, key) => total + REAGENTS.filter((reagent) => state.reactions[`${key}:${reagent}`] !== undefined).length,
    0,
  );
}

const CORE_CELL_TOTAL = BUILD_TARGETS.length * REAGENTS.length;

function benchSample() {
  return identifyMolecule(state.molecule) || null;
}

function runReagentTest() {
  markPlayed();
  const sample = benchSample();
  if (!sample) {
    audio.error();
    state.reactNotice = { key: 'reactNoSample', kind: 'error' };
    render();
    return;
  }
  if (!state.reagent) {
    audio.error();
    state.reactNotice = { key: 'reactNeedReagent', kind: 'error' };
    render();
    return;
  }
  const cell = `${sample.key}:${state.reagent}`;
  if (state.reactions[cell] !== undefined) {
    audio.error();
    state.reactNotice = { key: 'reactDone', kind: 'error' };
    render();
    return;
  }
  const reacts = reactionOutcome(sample.group, state.reagent);
  state.reactions[cell] = reacts;
  const signKey = `sign${state.reagent[0].toUpperCase()}${state.reagent.slice(1)}${reacts ? 'Yes' : 'No'}`;
  state.reactNotice = { key: signKey, kind: reacts ? 'success' : '' };
  spawnEffect(state.reagent, reacts);
  audio[reacts ? 'dripYes' : 'dripNo']();
  window.cool?.stage?.('reagent_test');
  window.cool?.track?.('drip_reagent', { molecule: sample.key, reagent: state.reagent, reacts });
  const nextReagent = REAGENTS.find((reagent) => state.reactions[`${sample.key}:${reagent}`] === undefined);
  state.reagent = nextReagent || null;
  checkCompletion();
  render();
}

function coreMatrixComplete() {
  return BUILD_TARGETS.every((key) => REAGENTS.every(
    (reagent) => state.reactions[`${key}:${reagent}`] !== undefined,
  ));
}

function checkCompletion() {
  if (state.completed) return;
  const built = BUILD_TARGETS.every((key) => state.archive.some((entry) => entry.key === key));
  const isomers = state.isomerFound[0].length >= ISOMER_CHALLENGES[0].answers.length;
  if (built && coreMatrixComplete() && isomers) {
    state.completed = true;
    window.cool?.complete?.();
    audio.complete();
    toast(text('allDone'), 'success');
  }
}

function resetLab() {
  const station = state.station;
  state = makeState();
  state.station = station;
  toast(text('resetDone'));
  audio.clear();
  syncScene();
  render();
}

function goToView(name) {
  const view = VIEWS[name];
  if (!view) return;
  setAutoOrbit(false);
  orbit.targetYaw = view.yaw;
  orbit.targetPitch = view.pitch;
  document.querySelectorAll('.view-btn[data-view]').forEach((button) => {
    const active = button.dataset.view === name;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function setAutoOrbit(next) {
  orbit.auto = next;
  elements.autoOrbitBtn.classList.toggle('is-active', next);
  elements.autoOrbitBtn.setAttribute('aria-pressed', String(next));
  if (next) {
    document.querySelectorAll('.view-btn[data-view]').forEach((button) => {
      button.classList.remove('is-active');
      button.setAttribute('aria-pressed', 'false');
    });
  }
}

function renderNotice(element, notice) {
  if (!notice) {
    element.textContent = '';
    element.className = element.className.replace(/\s*\bis-(?:success|error)\b/g, '');
    return;
  }
  element.textContent = text(notice.key, ...(notice.args || []));
  element.className = element.className.replace(/\s*\bis-(?:success|error)\b/g, '');
  if (notice.kind) element.classList.add(`is-${notice.kind}`);
}

function renderStations() {
  document.querySelectorAll('[data-station]').forEach((button) => {
    const active = button.dataset.station === state.station;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $('#stationBuild').hidden = state.station !== 'build';
  $('#stationReact').hidden = state.station !== 'react';
  $('#stationIsomer').hidden = state.station !== 'isomer';
}

function renderBuildStation() {
  const targetKey = currentTargetKey();
  if (targetKey) {
    const name = document.createElement('span');
    name.textContent = moleculeName(targetKey);
    const formula = document.createElement('span');
    formula.className = 'current-target__formula';
    formula.textContent = prettyFormula(MOLECULE_LIBRARY[targetKey].formula);
    elements.currentTarget.replaceChildren(name, formula);
  } else {
    elements.currentTarget.textContent = text('targetHintDone');
  }
  const fragment = document.createDocumentFragment();
  BUILD_TARGETS.forEach((key, index) => {
    const chip = document.createElement('div');
    const logged = state.archive.find((entry) => entry.key === key);
    const isDone = Boolean(logged);
    chip.className = `target-chip${isDone ? ' is-done' : ''}${index === state.targetIndex ? ' is-active' : ''}`;
    chip.setAttribute('role', 'listitem');
    const mark = document.createElement('span');
    mark.textContent = isDone ? '✓' : '○';
    const label = document.createElement('span');
    label.textContent = moleculeName(key);
    chip.append(mark, label);
    fragment.append(chip);
  });
  elements.targetGrid.replaceChildren(fragment);
}

function renderReactStation() {
  const sample = benchSample();
  elements.reactSample.textContent = sample
    ? text('reactSampleLine', moleculeName(sample.key), groupName(sample.group))
    : text('reactNoSample');
  const fragment = document.createDocumentFragment();
  REAGENTS.forEach((reagent) => {
    const button = document.createElement('button');
    const tested = sample && state.reactions[`${sample.key}:${reagent}`] !== undefined;
    button.type = 'button';
    button.className = `reagent-card${state.reagent === reagent ? ' is-selected' : ''}`;
    button.dataset.reagent = reagent;
    button.setAttribute('aria-pressed', String(state.reagent === reagent));
    const title = document.createElement('strong');
    title.textContent = `${tested ? '✓ ' : ''}${text(REAGENT_KEYS[reagent])}`;
    const sub = document.createElement('small');
    sub.textContent = text(`${REAGENT_KEYS[reagent]}Sub`);
    button.append(title, sub);
    fragment.append(button);
  });
  elements.reagentGrid.replaceChildren(fragment);
  elements.dripBtn.disabled = !state.reagent;
  renderNotice(elements.reactFeedback, state.reactNotice);
}

function renderIsomerStation() {
  const challenge = ISOMER_CHALLENGES[state.isomerIndex];
  elements.isomerFormula.textContent = prettyFormula(challenge.formula);
  const found = state.isomerFound[state.isomerIndex];
  const fragment = document.createDocumentFragment();
  challenge.answers.forEach((_, index) => {
    const slot = document.createElement('div');
    const key = found[index];
    slot.className = `isomer-slot${key ? ' is-found' : ''}`;
    const mark = document.createElement('span');
    mark.textContent = key ? '✓' : '○';
    const label = document.createElement('span');
    label.textContent = key ? text('isomerFound', moleculeName(key)) : text('isomerSlotEmpty', index + 1);
    slot.append(mark, label);
    fragment.append(slot);
  });
  elements.isomerProgress.replaceChildren(fragment);
  const solved = found.length >= challenge.answers.length;
  elements.isomerNextBtn.hidden = !solved || state.isomerIndex >= ISOMER_CHALLENGES.length - 1;
  renderNotice(elements.isomerFeedback, state.isomerNotice);
}

function renderStage() {
  document.querySelectorAll('[data-element]').forEach((button) => {
    const active = button.dataset.element === state.selectedElement;
    button.classList.toggle('is-selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  elements.measureBtn.setAttribute('aria-pressed', String(state.measure.active));
  const formula = state.molecule.atoms.length ? prettyFormula(molecularFormula(state.molecule)) : '—';
  const open = state.molecule.atoms.reduce((total, atom) => total + freeValence(state.molecule, atom.id), 0);
  elements.readFormula.textContent = formula;
  elements.readFree.textContent = state.molecule.atoms.length ? String(open) : '—';
  elements.readAngle.textContent = state.angleReading === null ? '—' : `${state.angleReading.toFixed(1)}°`;
  let stateKey = 'stateEmpty';
  let stateArgs = [];
  if (state.measure.active) stateKey = 'stateMeasure';
  else if (!state.molecule.atoms.length) stateKey = 'stateEmpty';
  else if (open === 0) stateKey = 'stateComplete';
  else { stateKey = 'stateOpen'; stateArgs = [open]; }
  elements.labState.textContent = text(stateKey, ...stateArgs);

  let coachKey = 'coachStart';
  let coachArgs = [];
  if (state.measure.active) coachKey = state.measure.centerId ? 'coachMeasureSides' : 'coachMeasureCenter';
  else if (!state.molecule.atoms.length) coachKey = 'coachStart';
  else if (open > 0) { coachKey = 'coachOpen'; coachArgs = [open]; }
  else if (state.station === 'react') coachKey = 'coachDrip';
  else if (state.station === 'isomer') coachKey = 'coachIsomer';
  else coachKey = 'coachComplete';
  elements.coach.textContent = text(coachKey, ...coachArgs);
}

function renderArchive() {
  const fragment = document.createDocumentFragment();
  if (!state.archive.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.className = 'table-empty';
    cell.textContent = text('archiveEmpty');
    row.append(cell);
    fragment.append(row);
  }
  state.archive.forEach((entry) => {
    const row = document.createElement('tr');
    [
      moleculeName(entry.key),
      prettyFormula(entry.formula),
      text(SHAPE_KEYS[entry.key] || 'shapeChain'),
      entry.angle === null ? '—' : `${entry.angle.toFixed(1)}°`,
      groupName(entry.group),
    ].forEach((value, index) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (index === 3 && entry.angle === null) cell.className = 'table-empty';
      row.append(cell);
    });
    fragment.append(row);
  });
  elements.archiveBody.replaceChildren(fragment);
}

function renderMatrix() {
  const rows = matrixRows();
  const head = document.createDocumentFragment();
  const corner = document.createElement('th');
  corner.textContent = text('colMolecule');
  head.append(corner);
  REAGENTS.forEach((reagent) => {
    const cell = document.createElement('th');
    cell.textContent = text(`${REAGENT_KEYS[reagent]}Short`);
    head.append(cell);
  });
  elements.matrixHead.replaceChildren(head);
  const body = document.createDocumentFragment();
  rows.forEach((key) => {
    const row = document.createElement('tr');
    const label = document.createElement('th');
    label.scope = 'row';
    label.textContent = moleculeName(key);
    row.append(label);
    REAGENTS.forEach((reagent) => {
      const cell = document.createElement('td');
      const value = state.reactions[`${key}:${reagent}`];
      cell.className = `matrix-cell ${value === undefined ? 'is-unknown' : value ? 'is-yes' : 'is-no'}`;
      cell.textContent = value === undefined ? '·' : value ? '✓' : '✗';
      row.append(cell);
    });
    body.append(row);
  });
  elements.matrixBody.replaceChildren(body);
  elements.matrixCount.textContent = `${testedCellCount()} / ${CORE_CELL_TOTAL}`;
}

function renderConclusion() {
  let key = 'conclusionStart';
  if (state.completed) key = 'conclusionFinal';
  else if (testedCellCount() >= 4) key = 'conclusionGroups';
  else if (state.archive.some((entry) => entry.angle !== null)) key = 'conclusionShapes';
  elements.conclusion.textContent = text(key);
  elements.conclusion.classList.toggle('is-success', state.completed);
}

function render() {
  document.title = text('doc');
  renderSoundButtons();
  elements.themeBtn.setAttribute('aria-label', text('theme'));
  elements.langBtn.setAttribute('aria-label', text('lang'));
  elements.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
  elements.themeBtn.textContent = (window.cool?.preferences?.theme || 'light') === 'light' ? '🌙' : '☀️';
  renderStations();
  renderBuildStation();
  renderReactStation();
  renderIsomerStation();
  renderStage();
  renderArchive();
  renderMatrix();
  renderConclusion();
}

document.querySelectorAll('[data-station]').forEach((button) => {
  button.addEventListener('click', () => {
    state.station = button.dataset.station;
    state.reactNotice = null;
    state.isomerNotice = null;
    if (state.station === 'react') {
      const sample = benchSample();
      if (sample && !state.reagent) {
        state.reagent = REAGENTS.find((reagent) => state.reactions[`${sample.key}:${reagent}`] === undefined) || null;
      }
    }
    checkStationProgress();
    syncScene();
    render();
  });
});

document.querySelectorAll('[data-element]').forEach((button) => {
  button.addEventListener('click', () => {
    state.selectedElement = button.dataset.element;
    audio.pick();
    if (state.measure.active) toggleMeasure();
    else {
      syncScene();
      render();
    }
  });
});

elements.sceneMarkers.addEventListener('click', (event) => {
  const button = event.target.closest('[data-marker]');
  if (!button || dragMoved >= 6) return;
  if (button.dataset.marker === 'slot') {
    placeAtom(button.dataset.slotHost === 'seed' ? null : Number(button.dataset.slotHost));
  } else if (button.dataset.marker === 'bond') {
    toggleBond(button.dataset.bondId);
  } else if (button.dataset.marker === 'atom') {
    handleMeasurePick(Number(button.dataset.atomId));
  }
});

elements.reagentGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-reagent]');
  if (!button) return;
  state.reagent = button.dataset.reagent;
  state.reactNotice = null;
  audio.pick();
  render();
});

elements.isomerNextBtn.addEventListener('click', () => {
  if (state.isomerIndex >= ISOMER_CHALLENGES.length - 1) return;
  state.isomerIndex += 1;
  state.isomerNotice = null;
  audio.pick();
  render();
});

document.querySelectorAll('.view-btn[data-view]').forEach((button) => {
  button.addEventListener('click', () => goToView(button.dataset.view));
});
elements.autoOrbitBtn.addEventListener('click', () => setAutoOrbit(!orbit.auto));
elements.dripBtn.addEventListener('click', runReagentTest);
elements.measureBtn.addEventListener('click', toggleMeasure);
elements.undoBtn.addEventListener('click', undoAtom);
elements.clearBtn.addEventListener('click', clearBench);
$('#resetBtn').addEventListener('click', resetLab);
elements.soundBtn.addEventListener('click', () => {
  audio.unlock();
  audio.setSfx(!audio.sfxOn);
  renderSoundButtons();
});
elements.musicBtn.addEventListener('click', () => {
  audio.unlock();
  audio.setMusic(!audio.musicOn);
  renderSoundButtons();
});
elements.themeBtn.addEventListener('click', () => window.cool?.preferences?.toggleTheme?.());
elements.langBtn.addEventListener('click', () => window.cool?.preferences?.toggleLang?.());
elements.sheetHandle.addEventListener('click', () => {
  elements.console.classList.toggle('is-collapsed');
  elements.sheetHandle.setAttribute(
    'aria-expanded',
    elements.console.classList.contains('is-collapsed') ? 'false' : 'true',
  );
});

document.addEventListener('pointerdown', () => { audio.unlock(); }, { once: true });

window.cool?.bindI18n?.(I18N, {
  onChange({ t: translate, lang: nextLang, kind }) {
    t = translate;
    lang = nextLang;
    if (kind === 'theme') applySceneTheme();
    render();
  },
});

if (window.matchMedia('(max-width: 880px)').matches) {
  elements.console.classList.add('is-collapsed');
  elements.sheetHandle.setAttribute('aria-expanded', 'false');
}

if (initScene()) {
  bindPointer();
  syncScene();
}
window.addEventListener('resize', resizeRenderer);
render();
