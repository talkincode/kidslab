import * as THREE from './vendor/three.module.min.js';
import {
  BUILD_TARGETS,
  ELEMENTS,
  ISOMER_CHALLENGES,
  MOLECULE_LIBRARY,
  REAGENTS,
  adjacency,
  attachAtom,
  createMolecule,
  cycleBondOrder,
  detectFunctionalGroup,
  elementOf,
  freeValence,
  geometryOf,
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

/* ================================ i18n ================================ */

const I18N = {
  zh: {
    doc: '有机分子工坊 · KidsLab',
    back: '返回平台',
    title: '有机分子工坊',
    navTask: '任务',
    navStage: '拼装台',
    navLog: '记录',
    tabBuild: '拼装',
    tabReact: '试剂',
    tabIsomer: '异构',
    stationBuildTitle: '碳能搭出什么？',
    stationReactTitle: '换个官能团，性质变吗？',
    stationIsomerTitle: '同式不同物',
    predictionTitle: '先猜一猜',
    predictionPrompt: '一个碳原子接上 4 个氢，这 4 根键会怎样排开？',
    predictionFlat: '平面十字',
    predictionTetra: '撑向四角',
    predictionLine: '挤成一条线',
    predictionVerdict: (guess, angle) => `你猜「${guess}」，量角器读出 ${angle}°：4 根键真的撑向四个角。`,
    predictionSavedRight: '记住这个猜想。等会儿用量角器亲自量一量。',
    predictionSavedOther: '先别改。拼出甲烷，量一量键角就知道了。',
    targetTitle: '按订单拼分子',
    targetHintBuild: '选一个原子，再点场景里发光的键位。',
    targetHintBond: '想要双键？直接点那根键。',
    targetHintMeasure: '拼好了！用量角器读一个键角，才算记录完整。',
    targetHintDone: '四个分子都拼好了。去试剂站看看它们脾气一样吗。',
    controlLabel: '控制变量：',
    controlBuild: '每次只改一处成键，其余原子不动。',
    reactPickTitle: '选一瓶试剂',
    reactPredictTitle: '先预测，再动手',
    reactPredictHint: '这瓶试剂会跟它反应吗？',
    guessYes: '会反应',
    guessNo: '不反应',
    runTest: '滴上去看看',
    reactNoSample: '拼装台上还不是一个完整分子。先去拼装台把空键位补满。',
    reactSampleLine: (name, group) => `台上样品：${name}（${group}）`,
    reactNeedReagent: '先选一瓶试剂。',
    reactNeedGuess: '先押一个：会反应，还是不反应？',
    reactRight: (sign) => `猜对了！${sign}`,
    reactWrong: (sign) => `和你猜的不一样：${sign}`,
    reactDone: '这瓶试剂已经在这个分子上试过了，换一瓶。',
    isomerTitle: '同一个分子式，几种分子？',
    isomerPrompt: '只给你分子式。原子数一样，连法不一样，就是不同的物质。',
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
    stageTitle: '球棍拼装台',
    readFormula: '分子式',
    readFree: '空着的键',
    readAngle: '键角读数',
    hintOrbit: '拖动空白处转动模型',
    nogl: '这台设备暂时打不开 3D，换个浏览器就能拼分子了。',
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
    seedPlaced: (element) => `第一个${element}原子放好了。它周围亮起来的就是还空着的键。`,
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
    conclusionStart: '拼一个分子，档案就会记下它的形状和官能团。',
    conclusionShapes: '看档案：碳接 4 根单键就撑成四面体，接双键就压成平面。',
    conclusionGroups: '再看反应矩阵：同一行的脾气，由官能团决定，不是由碳的个数决定。',
    conclusionFinal: '结论：分子式只说有几个原子；决定它是什么物质、能发生什么反应的，是原子怎么连、连的是哪个官能团。',
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
    theme: '切换主题',
    lang: 'Switch to English',
    resetDone: '实验重置了。档案和矩阵都清空。',
    allDone: '通关：分子拼齐、反应矩阵填满、同分异构也找出来了。',
  },
  en: {
    doc: 'Organic Builder Lab · KidsLab',
    back: 'Back to platform',
    title: 'Organic Builder Lab',
    navTask: 'Task',
    navStage: 'Bench',
    navLog: 'Log',
    tabBuild: 'Build',
    tabReact: 'Test',
    tabIsomer: 'Isomers',
    stationBuildTitle: 'What can carbon build?',
    stationReactTitle: 'Swap the group, swap the chemistry?',
    stationIsomerTitle: 'Same formula, different stuff',
    predictionTitle: 'Predict first',
    predictionPrompt: 'One carbon takes on four hydrogens. How do those four bonds spread out?',
    predictionFlat: 'Flat cross',
    predictionTetra: 'Out to four corners',
    predictionLine: 'Squeezed into a line',
    predictionVerdict: (guess, angle) => `You guessed "${guess}"; the protractor reads ${angle}° — the four bonds really do reach four corners.`,
    predictionSavedRight: 'Hold that guess. You will measure the angle yourself in a moment.',
    predictionSavedOther: 'Keep it for now. Build methane, measure the angle, and see.',
    targetTitle: 'Build the order',
    targetHintBuild: 'Pick an atom, then click a glowing bond slot in the scene.',
    targetHintBond: 'Want a double bond? Just click that bond.',
    targetHintMeasure: 'Built! Read one bond angle to finish the record.',
    targetHintDone: 'All four are built. Head to the test bench and see if they behave alike.',
    controlLabel: 'Controls:',
    controlBuild: 'Change one bond at a time; leave the other atoms alone.',
    reactPickTitle: 'Pick a reagent',
    reactPredictTitle: 'Predict, then pour',
    reactPredictHint: 'Will this reagent react with it?',
    guessYes: 'It reacts',
    guessNo: 'No reaction',
    runTest: 'Pour it on',
    reactNoSample: 'The bench does not hold a finished molecule yet. Fill every open bond first.',
    reactSampleLine: (name, group) => `Sample on the bench: ${name} (${group})`,
    reactNeedReagent: 'Pick a reagent first.',
    reactNeedGuess: 'Commit to a guess: reacts, or not?',
    reactRight: (sign) => `Good call! ${sign}`,
    reactWrong: (sign) => `Not what you guessed: ${sign}`,
    reactDone: 'That reagent is already tested on this molecule. Try another bottle.',
    isomerTitle: 'One formula, how many molecules?',
    isomerPrompt: 'You only get the formula. Same atoms, different wiring, different substance.',
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
    stageTitle: 'Ball-and-stick bench',
    readFormula: 'Formula',
    readFree: 'Open bonds',
    readAngle: 'Angle reading',
    hintOrbit: 'Drag empty space to turn the model',
    nogl: '3D is unavailable on this device. Another browser will let you build molecules.',
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
    conclusionStart: 'Build a molecule and the log records its shape and functional group.',
    conclusionShapes: 'Read the log: four single bonds push carbon into a tetrahedron; a double bond flattens it.',
    conclusionGroups: 'Now read the matrix: each row behaves by its functional group, not by how many carbons it has.',
    conclusionFinal: 'Conclusion: a formula only counts atoms. What a substance is, and what it reacts with, comes from how the atoms are wired and which functional group they form.',
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
    theme: 'Toggle theme',
    lang: '切换到中文',
    resetDone: 'Lab reset. The log and the matrix are cleared.',
    allDone: 'Complete: every molecule built, the matrix filled, and the isomers found.',
  },
};

const SOUND_KEY = 'kidslab.organic-builder-lab.sound';
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

const $ = (selector) => document.querySelector(selector);

const elements = {
  app: $('#app'),
  langBtn: $('#langBtn'),
  themeBtn: $('#themeBtn'),
  soundBtn: $('#soundBtn'),
  stationCode: $('#stationCode'),
  taskTitle: $('#taskTitle'),
  predictionFeedback: $('#predictionFeedback'),
  predictionVerdict: $('#predictionVerdict'),
  buildCount: $('#buildCount'),
  currentTarget: $('#currentTarget'),
  targetHint: $('#targetHint'),
  targetGrid: $('#targetGrid'),
  reactSample: $('#reactSample'),
  reagentGrid: $('#reagentGrid'),
  reactQuestion: $('#reactQuestion'),
  testBtn: $('#testBtn'),
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
  sceneWrap: $('.scene-wrap'),
  sceneMarkers: $('#sceneMarkers'),
  sceneHint: $('#sceneHint'),
  nogl: $('#nogl'),
  toast: $('#toast'),
  measureBtn: $('#measureBtn'),
  undoBtn: $('#undoBtn'),
  clearBtn: $('#clearBtn'),
  archiveBody: $('#archiveBody'),
  matrixHead: $('#matrixHead'),
  matrixBody: $('#matrixBody'),
  matrixCount: $('#matrixCount'),
  conclusion: $('#conclusion'),
};

/* ================================ 状态 ================================ */

function makeState() {
  return {
    station: 'build',
    mobilePanel: 'task',
    molecule: createMolecule(),
    selectedElement: 'C',
    prediction: null,
    targetIndex: 0,
    archive: [],
    reactions: {},
    reagent: null,
    guess: null,
    isomerIndex: 0,
    isomerFound: [[], []],
    measure: { active: false, centerId: null, sideIds: [] },
    angleReading: null,
    completed: false,
  };
}

let state = makeState();
let lang = window.cool?.preferences?.lang || 'zh';
let t = (key) => key;
let muted = safeGet(SOUND_KEY) === 'off';
let audioContext = null;

function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* 隐私模式下静默降级 */ }
}

const text = (key, ...args) => t(key, ...args);
const moleculeName = (key) => text(MOLECULE_NAME_KEYS[key] || key);
const groupName = (group) => text(GROUP_KEYS[group] || 'groupOther');
const elementName = (element) => text(ELEMENT_NAME_KEYS[element] || element);

/* 下标化分子式：C2H6O → C₂H₆O */
const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉';
const prettyFormula = (formula) => formula.replace(/\d/g, (digit) => SUBSCRIPTS[Number(digit)]);

/* ================================ 声音 ================================ */

function setMuted(nextMuted) {
  muted = nextMuted;
  safeSet(SOUND_KEY, muted ? 'off' : 'on');
  if (muted && audioContext?.state === 'running') audioContext.suspend().catch(() => {});
  renderSoundButton();
}

function renderSoundButton() {
  elements.soundBtn.textContent = muted ? '🔇' : '🔊';
  elements.soundBtn.setAttribute('aria-pressed', String(muted));
  elements.soundBtn.setAttribute('aria-label', text(muted ? 'soundOff' : 'soundOn'));
}

const TONES = Object.freeze({
  place: { notes: [392], duration: 0.16, gain: 0.045, type: 'sine' },
  bond: { notes: [330, 494], duration: 0.24, gain: 0.05, type: 'triangle' },
  measure: { notes: [587], duration: 0.18, gain: 0.04, type: 'sine' },
  success: { notes: [523, 659], duration: 0.28, gain: 0.055, type: 'sine' },
  error: { notes: [175, 140], duration: 0.24, gain: 0.04, type: 'sawtooth' },
  complete: { notes: [440, 554, 659, 880], duration: 0.6, gain: 0.06, type: 'sine' },
});

function tone(kind) {
  if (muted) return;
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    audioContext ||= new AudioCtor();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    const settings = TONES[kind] || TONES.place;
    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(settings.gain, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + settings.duration);
    gain.connect(audioContext.destination);
    settings.notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = settings.type;
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.09);
      oscillator.connect(gain);
      oscillator.start(now + index * 0.09);
      oscillator.stop(now + index * 0.09 + settings.duration * 0.6);
    });
  } catch {
    // 音频不可用时静默降级，不影响拼装
  }
}

/* ================================ 提示条 ================================ */

let toastTimer = 0;

function toast(message, kind = '') {
  elements.toast.textContent = message;
  elements.toast.className = `toast${kind ? ` is-${kind}` : ''}`;
  elements.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { elements.toast.hidden = true; }, kind === 'error' ? 3400 : 2800);
}

/* ================================ three.js 场景 ================================ */

const ATOM_RADII = Object.freeze({ C: 0.36, H: 0.22, O: 0.33 });
const TWEEN_SECONDS = 0.3;

let renderer = null;
let scene = null;
let camera = null;
let hemiLight = null;
let sunLight = null;
let benchMesh = null;
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

const orbit = { yaw: 0.72, pitch: 0.42, dist: 8.6, targetYaw: 0.72, targetPitch: 0.42, targetDist: 8.6 };
const pointers = new Map();
let dragging = false;
let dragMoved = 0;
let pinchStart = 0;
let groupOffset = new THREE.Vector3();
let groupOffsetTarget = new THREE.Vector3();
const effects = [];

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
    renderer = new THREE.WebGLRenderer({ canvas: elements.canvas, antialias: true, alpha: true });
  } catch {
    elements.nogl.hidden = false;
    elements.canvas.remove();
    return false;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  placeCamera();

  hemiLight = new THREE.HemisphereLight(0xffffff, 0x40506a, 1.3);
  scene.add(hemiLight);
  sunLight = new THREE.DirectionalLight(0xfff6e8, 2.3);
  sunLight.position.set(4.5, 8.5, 5.5);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.left = -7;
  sunLight.shadow.camera.right = 7;
  sunLight.shadow.camera.top = 7;
  sunLight.shadow.camera.bottom = -7;
  sunLight.shadow.bias = -0.0015;
  scene.add(sunLight);
  const rim = new THREE.DirectionalLight(0x9fd8ff, 0.7);
  rim.position.set(-6, 2.5, -5);
  scene.add(rim);

  const benchGeometry = new THREE.CylinderGeometry(2.45, 2.6, 0.3, 72, 1, false);
  const benchMaterial = new THREE.MeshStandardMaterial({ roughness: 0.86, metalness: 0.04 });
  benchMesh = new THREE.Mesh(benchGeometry, benchMaterial);
  benchMesh.position.y = -2.15;
  benchMesh.receiveShadow = true;
  scene.add(benchMesh);
  disposables.push(benchGeometry, benchMaterial);

  const ringGeometry = new THREE.TorusGeometry(2.12, 0.04, 8, 80);
  const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xe8a13c, roughness: 0.4, metalness: 0.5 });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.98;
  scene.add(ring);
  disposables.push(ringGeometry, ringMaterial);

  for (const element of Object.keys(ELEMENTS)) {
    const material = new THREE.MeshStandardMaterial({
      color: cssColor(`--atom-${element.toLowerCase()}`, '#888888'),
      roughness: element === 'H' ? 0.32 : 0.28,
      metalness: element === 'C' ? 0.35 : 0.12,
    });
    atomMaterials.set(element, material);
    disposables.push(material);
  }
  bondMaterial = new THREE.MeshStandardMaterial({ color: 0xb9c2cc, roughness: 0.42, metalness: 0.28 });
  slotMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8a13c,
    emissive: 0xe8a13c,
    emissiveIntensity: 0.7,
    transparent: true,
    opacity: 0.55,
    roughness: 0.3,
  });
  stubMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8a13c,
    roughness: 0.5,
    metalness: 0.2,
    transparent: true,
    opacity: 0.55,
  });
  arcMaterial = new THREE.MeshStandardMaterial({
    color: 0x34b8c6,
    emissive: 0x34b8c6,
    emissiveIntensity: 0.55,
    roughness: 0.4,
  });
  disposables.push(bondMaterial, slotMaterial, stubMaterial, arcMaterial);

  moleculeGroup.add(atomGroup, bondGroup, slotGroup, effectGroup, arcGroup);
  scene.add(moleculeGroup);

  applySceneTheme();
  resizeRenderer();
  new ResizeObserver(resizeRenderer).observe(elements.sceneWrap);
  requestAnimationFrame(animate);
  return true;
}

/* 标记位置靠投影算出来，相机必须先摆好，否则新建的标记会停在画布角上 */
function placeCamera() {
  camera.position.set(
    Math.cos(orbit.pitch) * Math.sin(orbit.yaw) * orbit.dist,
    Math.sin(orbit.pitch) * orbit.dist,
    Math.cos(orbit.pitch) * Math.cos(orbit.yaw) * orbit.dist,
  );
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
}

function applySceneTheme() {
  if (!renderer) return;
  const dark = (window.cool?.preferences?.theme || 'light') === 'dark';
  hemiLight.intensity = dark ? 0.82 : 1.35;
  hemiLight.groundColor.set(dark ? 0x1b2634 : 0x50607a);
  sunLight.intensity = dark ? 2.0 : 2.35;
  benchMesh.material.color.copy(cssColor('--bench-color', dark ? '#2a3949' : '#cbd6dc'));
  for (const [element, material] of atomMaterials) {
    material.color.copy(cssColor(`--atom-${element.toLowerCase()}`, '#888888'));
  }
  bondMaterial.color.set(dark ? 0x8b9aa9 : 0xc3ccd6);
}

function resizeRenderer() {
  if (!renderer) return;
  const width = Math.max(1, elements.sceneWrap.clientWidth);
  const height = Math.max(1, elements.sceneWrap.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function disposeChildren(group) {
  for (const child of [...group.children]) {
    group.remove(child);
    child.traverse?.((node) => {
      if (node.geometry) node.geometry.dispose();
    });
    if (child.geometry) child.geometry.dispose();
  }
}

/** 把模型坐标同步到 three 场景：已有原子做补间，新原子直接落位 */
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
      const hitGeometry = new THREE.SphereGeometry(Math.max(radius, 0.34), 12, 10);
      const hit = new THREE.Mesh(hitGeometry, new THREE.MeshBasicMaterial({
        transparent: true, opacity: 0, depthWrite: false,
      }));
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
      const geometry = new THREE.CylinderGeometry(radius, radius, 1, 18, 1, true);
      const mesh = new THREE.Mesh(geometry, bondMaterial);
      mesh.castShadow = true;
      mesh.userData = { kind: 'bond', bondId: bond.id, side };
      group.add(mesh);
    });
    const hitGeometry = new THREE.CylinderGeometry(0.24, 0.24, 1, 10, 1, true);
    const hit = new THREE.Mesh(hitGeometry, new THREE.MeshBasicMaterial({
      transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide,
    }));
    hit.userData = { kind: 'bond', bondId: bond.id, side: 0 };
    group.add(hit);
    bondGroup.add(group);
    bondEntries.set(bond.id, { group, order: bond.order, perp: bondPerpendicular(bond, positions) });
  }

  /**
   * 每个原子只暴露一个可点键位：新原子一定落在它下一个空方向上，
   * 点哪里就长在哪里。其余空价位画成短接头，让「还差几根键」一眼可见。
   */
  disposeChildren(slotGroup);
  const activeSlots = [];
  if (!state.measure.active) {
    const usedHosts = new Set();
    for (const slot of openSlots) {
      const isActive = !usedHosts.has(slot.hostId);
      if (isActive) {
        usedHosts.add(slot.hostId);
        activeSlots.push(slot);
        const geometry = new THREE.SphereGeometry(0.18, 20, 16);
        const mesh = new THREE.Mesh(geometry, slotMaterial);
        mesh.position.set(...slot.position);
        mesh.userData = { kind: 'slot', hostId: slot.hostId, pulse: true };
        const hitGeometry = new THREE.SphereGeometry(0.4, 10, 8);
        const hit = new THREE.Mesh(hitGeometry, new THREE.MeshBasicMaterial({
          transparent: true, opacity: 0, depthWrite: false,
        }));
        hit.userData = mesh.userData;
        mesh.add(hit);
        slotGroup.add(mesh);
      }
      const host = positions.get(slot.hostId);
      if (!host) continue;
      const stubGeometry = new THREE.CylinderGeometry(0.055, 0.055, 0.42, 12, 1, true);
      const stub = new THREE.Mesh(stubGeometry, stubMaterial);
      const direction = new THREE.Vector3(...slot.direction);
      stub.position.set(...host).addScaledVector(direction, 0.42);
      stub.quaternion.setFromUnitVectors(UP, direction);
      stub.userData = { kind: 'slot', hostId: slot.hostId };
      slotGroup.add(stub);
    }
    if (!state.molecule.atoms.length) {
      activeSlots.push({ hostId: null, position: [0, 0, 0], direction: [0, 1, 0] });
      const geometry = new THREE.SphereGeometry(0.26, 22, 16);
      const mesh = new THREE.Mesh(geometry, slotMaterial);
      mesh.userData = { kind: 'slot', hostId: null, pulse: true };
      const hitGeometry = new THREE.SphereGeometry(0.6, 10, 8);
      const hit = new THREE.Mesh(hitGeometry, new THREE.MeshBasicMaterial({
        transparent: true, opacity: 0, depthWrite: false,
      }));
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
    groupOffsetTarget = new THREE.Vector3(-centroid[0], -centroid[1], -centroid[2]);
    const radius = Math.max(...points.map((point) => Math.hypot(
      point[0] - centroid[0], point[1] - centroid[1], point[2] - centroid[2],
    )));
    orbit.targetDist = Math.min(13.5, Math.max(6.4, 5.4 + radius * 2.1));
  } else {
    groupOffsetTarget = new THREE.Vector3();
    orbit.targetDist = 7.4;
  }
  /* 分子变化引起的视距调整直接落定，标记就不会在补间里漂移 */
  orbit.dist = orbit.targetDist;
  refreshArc(positions);
}

/**
 * 每个可操作目标在 3D 场景上放一个 DOM 按钮：three.js 负责视觉，
 * 按钮负责命中区 ≥44px、键盘可达和读屏可读。位置每帧由投影更新。
 */
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

  /* 只给「此刻真正可点」的目标放标记：原子挨得近，多余的标记会互相挡住命中区 */
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
      const anchor = anchorOf(atom.id);
      addMarker('atom', () => anchor, {
        data: { atomId: String(atom.id) },
        extraClass: pickable ? ' is-pickable' : ' is-picked is-locked',
        label: `${elementName(atom.element)} ${atom.id}`,
        glyph: isCenter ? '◎' : picked ? '✓' : '',
      });
    }
  } else {
    activeSlots.forEach((slot, index) => {
      const anchor = new THREE.Vector3(...slot.position);
      const host = slot.hostId === null ? null : elementOf(state.molecule, slot.hostId);
      addMarker('slot', () => anchor, {
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
        label: `${elementOf(state.molecule, bond.a)}–${elementOf(state.molecule, bond.b)} · ${text('targetHintBond')}`,
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
    /* 近的标记压在远的上面，重叠时点到的总是眼前那个 */
    marker.element.style.zIndex = String(Math.round((1 - projected.z) * 1000));
    markerLayout.push({
      marker,
      x: (projected.x * 0.5 + 0.5) * width,
      y: (-projected.y * 0.5 + 0.5) * height,
    });
  }

  /* 分子里的原子挨得很近，投影后 44px 的命中区会互相盖住。
     松弛几轮把重叠的标记推开，保证每个目标都点得到。 */
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
        a.x -= ux;
        a.y -= uy;
        b.x += ux;
        b.y += uy;
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
  const radius = 0.72;
  const points = [];
  const steps = 40;
  for (let i = 0; i <= steps; i += 1) {
    const point = u.clone().applyAxisAngle(axis, (total * i) / steps).multiplyScalar(radius).add(origin);
    points.push(point);
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 44, 0.035, 8, false);
  const arc = new THREE.Mesh(geometry, arcMaterial);
  arcGroup.add(arc);
}

function spawnEffect(reagent, reacts) {
  if (!renderer) return;
  const color = new THREE.Color(REAGENT_TINTS[reagent] || 0xffffff);
  const count = reacts ? 18 : 8;
  for (let i = 0; i < count; i += 1) {
    const geometry = new THREE.SphereGeometry(reacts ? 0.09 : 0.07, 10, 8);
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: reacts ? 0.6 : 0.2,
      transparent: true,
      opacity: 0.9,
    });
    const mesh = new THREE.Mesh(geometry, material);
    const angle = (Math.PI * 2 * i) / count;
    const spread = 0.9 + Math.random() * 0.7;
    mesh.position.set(Math.cos(angle) * spread, 1.9 + Math.random() * 0.6, Math.sin(angle) * spread);
    effectGroup.add(mesh);
    effects.push({
      mesh,
      material,
      geometry,
      life: 0,
      span: reacts ? 1.25 : 0.85,
      velocity: new THREE.Vector3(
        Math.cos(angle) * 0.12,
        reacts ? 0.55 + Math.random() * 0.5 : -1.5,
        Math.sin(angle) * 0.12,
      ),
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

/* 指数补间永远逼近而不到达，位置会一直有 0.x 像素的抖动。
   足够接近时直接落定，界面上的标记才真正静止。 */
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

  orbit.yaw = approach(orbit.yaw, orbit.targetYaw, delta * 9);
  orbit.pitch = approach(orbit.pitch, orbit.targetPitch, delta * 9);
  orbit.dist = approach(orbit.dist, orbit.targetDist, delta * 5);
  camera.position.set(
    Math.cos(orbit.pitch) * Math.sin(orbit.yaw) * orbit.dist,
    Math.sin(orbit.pitch) * orbit.dist,
    Math.cos(orbit.pitch) * Math.cos(orbit.yaw) * orbit.dist,
  );
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  updateMarkerPositions();
  renderer.render(scene, camera);
}

/* ================================ 拾取 ================================ */

const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();

function pickAt(clientX, clientY) {
  if (!renderer) return null;
  const rect = elements.canvas.getBoundingClientRect();
  pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNdc, camera);
  const order = state.measure.active
    ? [atomGroup, bondGroup]
    : [slotGroup, bondGroup, atomGroup];
  for (const group of order) {
    const hits = raycaster.intersectObjects(group.children, true);
    if (hits.length) return hits[0].object.userData;
  }
  return null;
}

function bindPointer() {
  if (!renderer) return;
  /* 监听整个场景容器而不是画布：标记按钮上的拖动也要能转动模型 */
  const canvas = elements.sceneWrap;
  canvas.addEventListener('pointerdown', (event) => {
    /* 只在画布上按下时捕获指针；从标记按钮上捕获会把 click 重定向到容器，按钮就点不动了 */
    if (event.target === elements.canvas) canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) {
      dragging = true;
      dragMoved = 0;
    } else if (pointers.size === 2) {
      const [first, second] = [...pointers.values()];
      pinchStart = Math.hypot(first.x - second.x, first.y - second.y);
    }
  });
  canvas.addEventListener('pointermove', (event) => {
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
    orbit.targetYaw -= dx * 0.008;
    orbit.targetPitch = Math.max(-1.2, Math.min(1.2, orbit.targetPitch + dy * 0.006));
  });
  const finish = (event) => {
    const wasSingle = pointers.size === 1;
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = 0;
    if (!pointers.size) dragging = false;
    /* 落在标记按钮上的点击由按钮自己处理，避免同一次操作被执行两遍 */
    if (wasSingle && dragMoved < 6 && event.target === elements.canvas) {
      handleScenePick(event.clientX, event.clientY);
    }
  };
  canvas.addEventListener('pointerup', finish);
  canvas.addEventListener('pointercancel', (event) => {
    pointers.delete(event.pointerId);
    if (!pointers.size) dragging = false;
  });
  canvas.addEventListener('wheel', (event) => {
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
  if (target.kind === 'slot') {
    placeAtom(target.hostId);
    return;
  }
  if (target.kind === 'bond') {
    toggleBond(target.bondId);
    return;
  }
  if (target.kind === 'atom') {
    const free = freeValence(state.molecule, target.atomId);
    toast(free > 0
      ? text('atomInfo', elementName(target.element), free)
      : text('atomInfoFull', elementName(target.element)));
  }
}

/* ================================ 拼装动作 ================================ */

function placeAtom(hostId) {
  const element = state.selectedElement;
  if (hostId === null) {
    const seeded = attachSeed(element);
    state.molecule = seeded;
    tone('place');
    toast(text('seedPlaced', elementName(element)));
    window.cool?.track?.('placed_atom', { element });
    afterMoleculeChange();
    return;
  }
  const host = elementOf(state.molecule, hostId);
  const result = attachAtom(state.molecule, hostId, element, 1);
  if (!result.atomId) {
    tone('error');
    toast(text('slotFull'), 'error');
    return;
  }
  state.molecule = result.molecule;
  tone('place');
  toast(text('slotPlaced', elementName(element), elementName(host)));
  window.cool?.track?.('placed_atom', { element });
  afterMoleculeChange();
}

function attachSeed(element) {
  const seeded = createMolecule();
  seeded.atoms.push({ id: seeded.nextId, element });
  seeded.nextId += 1;
  return seeded;
}

function toggleBond(bondId) {
  const before = state.molecule.bonds.find((bond) => bond.id === bondId)?.order ?? 1;
  const result = cycleBondOrder(state.molecule, bondId);
  if (!result.changed) {
    tone('error');
    toast(text('bondBlocked'), 'error');
    return;
  }
  state.molecule = result.molecule;
  const after = state.molecule.bonds.find((bond) => bond.id === bondId).order;
  tone('bond');
  toast(text('bondUp', after));
  window.cool?.track?.('changed_bond_order', { from: before, to: after });
  afterMoleculeChange();
}

function undoAtom() {
  if (!state.molecule.atoms.length) {
    tone('error');
    toast(text('undoEmpty'), 'error');
    return;
  }
  const terminal = [...state.molecule.atoms]
    .reverse()
    .find((atom) => neighborsOf(state.molecule, atom.id).length <= 1);
  if (!terminal) {
    tone('error');
    toast(text('undoBlocked'), 'error');
    return;
  }
  const result = removeAtom(state.molecule, terminal.id);
  if (!result.removed) {
    tone('error');
    toast(text('undoBlocked'), 'error');
    return;
  }
  state.molecule = result.molecule;
  tone('place');
  toast(text('undoDone'));
  afterMoleculeChange();
}

function clearBench() {
  state.molecule = createMolecule();
  state.measure = { active: false, centerId: null, sideIds: [] };
  state.angleReading = null;
  state.guess = null;
  tone('place');
  toast(text('cleared'));
  afterMoleculeChange();
}

/** 分子结构变化后统一走一遍：站点判定 → 场景同步 → 界面刷新 */
function afterMoleculeChange() {
  state.measure.centerId = null;
  state.measure.sideIds = [];
  state.angleReading = null;
  state.guess = null;
  checkStationProgress();
  syncScene();
  render();
}

/* ================================ 量键角 ================================ */

function toggleMeasure() {
  state.measure.active = !state.measure.active;
  state.measure.centerId = null;
  state.measure.sideIds = [];
  /* 收起量角器不该擦掉刚读到的数：只有开始新的一次测量才清零 */
  if (state.measure.active) state.angleReading = null;
  toast(text(state.measure.active ? 'measureOn' : 'measureOff'));
  tone('measure');
  syncScene();
  render();
}

function handleMeasurePick(atomId) {
  const measure = state.measure;
  if (!measure.centerId) {
    if (neighborsOf(state.molecule, atomId).length < 2) {
      tone('error');
      toast(text('measureNeedCenter'), 'error');
      return;
    }
    measure.centerId = atomId;
    measure.sideIds = [];
    tone('measure');
    toast(text('measurePickSides'));
    syncScene();
    render();
    return;
  }
  const isNeighbor = neighborsOf(state.molecule, measure.centerId).some((edge) => edge.id === atomId);
  if (!isNeighbor) {
    tone('error');
    toast(text('measureNeedNeighbor'), 'error');
    return;
  }
  if (measure.sideIds.includes(atomId)) {
    tone('error');
    toast(text('measureSame'), 'error');
    return;
  }
  measure.sideIds.push(atomId);
  if (measure.sideIds.length < 2) {
    tone('measure');
    syncScene();
    render();
    return;
  }
  const { positions } = layoutMolecule(state.molecule);
  const angle = measureAngle(positions, measure.sideIds[0], measure.centerId, measure.sideIds[1]);
  state.angleReading = angle;
  tone('measure');
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
    window.cool?.track?.('measured_bond_angle', { molecule: identity.key, angle: Number(angle.toFixed(1)) });
    if (identity.key === 'methane' && state.prediction) {
      state.predictionChecked = true;
    }
  } else {
    toast(label);
  }
  syncScene();
  render();
}

/* ================================ 站点逻辑 ================================ */

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
      window.cool?.stage(`built_${identity.key}`);
      window.cool?.track?.('built_target_molecule', { molecule: identity.key });
      if (fresh) {
        tone(state.targetIndex >= BUILD_TARGETS.length ? 'complete' : 'success');
        toast(text('buildDone', moleculeName(identity.key)), 'success');
      }
    } else if (identity) {
      archiveMolecule(identity);
    } else if (isComplete(state.molecule) && targetKey) {
      const wanted = MOLECULE_LIBRARY[targetKey];
      if (molecularFormula(state.molecule) === wanted.formula) {
        tone('error');
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
  window.cool?.stage(`isomer_${challenge.id}`);
  window.cool?.track?.('found_isomer', { challenge: challenge.id, molecule: match });
  if (found.length >= challenge.answers.length) {
    state.isomerNotice = { key: 'isomerChallengeDone', kind: 'success', args: [prettyFormula(challenge.formula)] };
    tone('complete');
    toast(text('isomerChallengeDone', prettyFormula(challenge.formula)), 'success');
  } else {
    state.isomerNotice = { key: 'isomerHit', kind: 'success', args: [moleculeName(match)] };
    tone('success');
    toast(text('isomerHit', moleculeName(match)), 'success');
  }
}

function matrixRows() {
  const ordered = BUILD_TARGETS.filter((key) => state.archive.some((entry) => entry.key === key));
  const extra = state.archive.map((entry) => entry.key).filter((key) => !BUILD_TARGETS.includes(key));
  return [...ordered, ...extra];
}

/** 只统计四个必做分子构成的 16 个核心格，异构站顺手拼出的分子算加分不改分母 */
function testedCellCount() {
  return BUILD_TARGETS.reduce(
    (total, key) => total + REAGENTS.filter((reagent) => state.reactions[`${key}:${reagent}`] !== undefined).length,
    0,
  );
}

const CORE_CELL_TOTAL = BUILD_TARGETS.length * REAGENTS.length;

function benchSample() {
  const identity = identifyMolecule(state.molecule);
  return identity || null;
}

function runReagentTest() {
  const sample = benchSample();
  if (!sample) {
    tone('error');
    state.reactNotice = { key: 'reactNoSample', kind: 'error' };
    render();
    return;
  }
  if (!state.reagent) {
    tone('error');
    state.reactNotice = { key: 'reactNeedReagent', kind: 'error' };
    render();
    return;
  }
  if (!state.guess) {
    tone('error');
    state.reactNotice = { key: 'reactNeedGuess', kind: 'error' };
    render();
    return;
  }
  const cell = `${sample.key}:${state.reagent}`;
  if (state.reactions[cell] !== undefined) {
    tone('error');
    state.reactNotice = { key: 'reactDone', kind: 'error' };
    render();
    return;
  }
  const reacts = reactionOutcome(sample.group, state.reagent);
  state.reactions[cell] = reacts;
  const signKey = `sign${state.reagent[0].toUpperCase()}${state.reagent.slice(1)}${reacts ? 'Yes' : 'No'}`;
  const correct = (state.guess === 'yes') === reacts;
  state.reactNotice = {
    key: correct ? 'reactRight' : 'reactWrong',
    kind: correct ? 'success' : 'error',
    args: [text(signKey)],
  };
  spawnEffect(state.reagent, reacts);
  tone(correct ? 'success' : 'error');
  window.cool?.stage('reagent_test');
  window.cool?.track?.('tested_reagent', { molecule: sample.key, reagent: state.reagent, reacts });
  state.guess = null;
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
  const angles = BUILD_TARGETS.every((key) => state.archive.find((entry) => entry.key === key)?.angle !== null);
  const isomers = state.isomerFound[0].length >= ISOMER_CHALLENGES[0].answers.length;
  if (built && angles && coreMatrixComplete() && isomers) {
    state.completed = true;
    window.cool?.complete?.();
    window.cool?.track?.('completed_organic_lab');
    tone('complete');
    toast(text('allDone'), 'success');
  }
}

function resetLab() {
  const station = state.station;
  const mobilePanel = state.mobilePanel;
  state = makeState();
  state.station = station;
  state.mobilePanel = mobilePanel;
  toast(text('resetDone'));
  tone('place');
  syncScene();
  render();
}

/* ================================ 界面渲染 ================================ */

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
  const codes = { build: 'STATION 01', react: 'STATION 02', isomer: 'STATION 03 · L4' };
  const titles = { build: 'stationBuildTitle', react: 'stationReactTitle', isomer: 'stationIsomerTitle' };
  elements.stationCode.textContent = codes[state.station];
  elements.taskTitle.textContent = text(titles[state.station]);
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
  document.querySelectorAll('[data-prediction]').forEach((button) => {
    const active = button.dataset.prediction === state.prediction;
    button.classList.toggle('is-selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const methane = state.archive.find((entry) => entry.key === 'methane');
  const verified = Boolean(state.prediction && methane && methane.angle !== null);
  $('#predictionGrid').hidden = verified;
  $('#predictionPrompt').hidden = verified;
  elements.predictionVerdict.hidden = !verified;
  if (verified) {
    elements.predictionVerdict.textContent = text(
      'predictionVerdict',
      text(`prediction${state.prediction[0].toUpperCase()}${state.prediction.slice(1)}`),
      methane.angle.toFixed(1),
    );
  }
  renderNotice(elements.predictionFeedback, verified ? null : state.predictionNotice);

  const done = state.archive.filter((entry) => BUILD_TARGETS.includes(entry.key)).length;
  elements.buildCount.textContent = `${done} / ${BUILD_TARGETS.length}`;
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

  let hintKey = 'targetHintBuild';
  if (!targetKey) hintKey = 'targetHintDone';
  else if (state.archive.some((entry) => entry.key === targetKey && entry.angle === null)) hintKey = 'targetHintMeasure';
  else if (targetKey === 'ethene') hintKey = 'targetHintBond';
  const pending = state.archive.find((entry) => BUILD_TARGETS.includes(entry.key) && entry.angle === null);
  if (pending) hintKey = 'targetHintMeasure';
  elements.targetHint.textContent = text(hintKey);

  const fragment = document.createDocumentFragment();
  BUILD_TARGETS.forEach((key, index) => {
    const chip = document.createElement('div');
    const logged = state.archive.find((entry) => entry.key === key);
    const isDone = Boolean(logged && logged.angle !== null);
    chip.className = `target-chip${isDone ? ' is-done' : ''}${index === state.targetIndex ? ' is-active' : ''}`;
    chip.setAttribute('role', 'listitem');
    const mark = document.createElement('span');
    mark.className = 'target-chip__mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = isDone ? '✓' : logged ? '📐' : '○';
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

  document.querySelectorAll('[data-guess]').forEach((button) => {
    const active = button.dataset.guess === state.guess;
    button.classList.toggle('is-selected', active);
    button.setAttribute('aria-pressed', String(active));
    button.disabled = !sample || !state.reagent;
  });
  elements.testBtn.disabled = !sample || !state.reagent || !state.guess;
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
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = key ? '✓' : '○';
    const label = document.createElement('span');
    label.textContent = key ? text('isomerFound', moleculeName(key)) : text('isomerSlotEmpty', index + 1);
    slot.append(mark, label);
    fragment.append(slot);
  });
  elements.isomerProgress.replaceChildren(fragment);
  /* 通关后不自动换卡：让两个勾留在屏幕上，学生自己决定何时进下一张 */
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
  elements.labState.classList.toggle('is-active', stateKey === 'stateComplete' || stateKey === 'stateMeasure');
  elements.sceneHint.textContent = text('hintOrbit');
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
    const cells = [
      moleculeName(entry.key),
      prettyFormula(entry.formula),
      text(SHAPE_KEYS[entry.key] || 'shapeChain'),
      entry.angle === null ? '—' : `${entry.angle.toFixed(1)}°`,
      groupName(entry.group),
    ];
    cells.forEach((value, index) => {
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

function renderMobileNavigation() {
  elements.app.dataset.mobilePanel = state.mobilePanel;
  document.querySelectorAll('.mobile-nav__button').forEach((button) => {
    const active = button.dataset.mobilePanel === state.mobilePanel;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function render() {
  document.title = text('doc');
  renderSoundButton();
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
  renderMobileNavigation();
}

/* ================================ 事件绑定 ================================ */

const isCompact = () => window.matchMedia('(max-width: 900px)').matches;

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

document.querySelectorAll('[data-prediction]').forEach((button) => {
  button.addEventListener('click', () => {
    state.prediction = button.dataset.prediction;
    state.predictionNotice = {
      key: state.prediction === 'tetra' ? 'predictionSavedRight' : 'predictionSavedOther',
      kind: state.prediction === 'tetra' ? 'success' : '',
    };
    window.cool?.stage('prediction');
    window.cool?.track?.('predicted_geometry', { prediction: state.prediction });
    tone('place');
    render();
  });
});

document.querySelectorAll('[data-element]').forEach((button) => {
  button.addEventListener('click', () => {
    state.selectedElement = button.dataset.element;
    if (state.measure.active) toggleMeasure();
    else {
      syncScene();
      render();
    }
    if (isCompact()) {
      state.mobilePanel = 'stage';
      renderMobileNavigation();
    }
  });
});

document.querySelectorAll('[data-guess]').forEach((button) => {
  button.addEventListener('click', () => {
    state.guess = button.dataset.guess;
    state.reactNotice = null;
    tone('place');
    render();
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
  state.guess = null;
  state.reactNotice = null;
  tone('place');
  render();
});

document.querySelectorAll('.mobile-nav__button').forEach((button) => {
  button.addEventListener('click', () => {
    state.mobilePanel = button.dataset.mobilePanel;
    renderMobileNavigation();
    if (state.mobilePanel === 'stage') resizeRenderer();
  });
});

elements.isomerNextBtn.addEventListener('click', () => {
  if (state.isomerIndex >= ISOMER_CHALLENGES.length - 1) return;
  state.isomerIndex += 1;
  state.isomerNotice = null;
  tone('place');
  render();
});

elements.testBtn.addEventListener('click', runReagentTest);
elements.measureBtn.addEventListener('click', toggleMeasure);
elements.undoBtn.addEventListener('click', undoAtom);
elements.clearBtn.addEventListener('click', clearBench);
$('#resetBtn').addEventListener('click', resetLab);
elements.soundBtn.addEventListener('click', () => setMuted(!muted));
elements.themeBtn.addEventListener('click', () => window.cool?.preferences?.toggleTheme?.());
elements.langBtn.addEventListener('click', () => window.cool?.preferences?.toggleLang?.());

document.addEventListener('visibilitychange', () => {
  if (document.hidden && audioContext?.state === 'running') audioContext.suspend().catch(() => {});
});

window.cool?.bindI18n?.(I18N, {
  onChange({ t: translate, lang: nextLang, kind }) {
    t = translate;
    lang = nextLang;
    if (kind === 'theme') applySceneTheme();
    render();
  },
});

if (initScene()) {
  bindPointer();
  syncScene();
}
render();
