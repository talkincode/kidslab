import * as THREE from './vendor/three.module.min.js';
import {
  AMINO_ACIDS,
  BASES,
  TEMPLATE_STRAND,
  codonsOf,
  complementBase,
  complementStrand,
  hasSilentSubstitution,
  isLegalPair,
  mutationReport,
  proteinOf,
  retainedParentalStrands,
  transcribe,
} from './dna-model.js';

/* ================================ i18n ================================ */

const I18N = {
  zh: {
    doc: 'DNA 复制实验室 · KidsLab',
    back: '返回平台',
    title: 'DNA 复制实验室',
    navTask: '任务',
    navStage: '复制叉',
    navLog: '记录',
    tabCopy: '复制',
    tabMutate: '突变',
    tabSilent: '挑战',
    stationCopyTitle: '一条链，怎么长出完整的两条？',
    stationMutateTitle: '换掉一个碱基，会怎样？',
    stationSilentTitle: '改了碱基，蛋白却没变',
    predictionTitle: '先猜一猜',
    predictionPrompt: '一条双链复制成两条双链。新的两条里，一共还剩几条是原来的老链？',
    predictionZero: '一条都不剩',
    predictionTwo: '各留一条',
    predictionFour: '全是老链',
    predictionSavedRight: '记住这个猜想。配完链，颜色会给答案。',
    predictionSavedOther: '先别改。配完链，看看颜色怎么分。',
    predictionVerdict: (guess, count) => `你猜「${guess}」。实测：两条子代双链里各有一条灰色老链，一共 ${count} 条 —— 这就叫半保留复制。`,
    copyTitle: '给露出来的碱基配对',
    copyHintStart: '看模型上闪着的那个碱基，选出能跟它配对的。',
    copyHintGoing: (base) => `现在露出的是 ${base}。它只认一个搭档。`,
    copyHintDone: '两条新链都配好了。看颜色：每条双链都是一灰一绿。',
    controlLabel: '规则：',
    controlCopy: 'A 只和 T 配，G 只和 C 配。配错就搭不上去。',
    mutateSpotTitle: '挑一个位点动手改',
    mutateNeedCopy: '先把上一站的链配完，才有东西可改。',
    mutateReady: '选一个位点，再选换成哪个碱基。',
    mutateBaseTitle: '换成哪个碱基',
    applyMutation: '强行换掉它',
    restoreSequence: '还原原始序列',
    restored: '序列还原了，突变记录留在本子上。',
    mutateSilent: (codonA, codonB, acid) => `密码子从 ${codonA} 变成 ${codonB}，氨基酸还是 ${acid} —— 同义突变。`,
    mutateMissense: (acidA, acidB) => `${acidA} 被换成了 ${acidB} —— 错义突变，蛋白变了。`,
    mutateNonsense: '这里提前出现了终止密码子 —— 无义突变，蛋白被截断。',
    mutateNeedSpot: '先点一个位点。',
    mutateNeedBase: '再选一个要换上去的碱基。',
    silentTitle: '改了碱基，蛋白却没变',
    silentPrompt: '有些位置换掉一个碱基，密码子变了，可翻译出来的氨基酸一模一样。找出这样的一次替换。',
    silentTargetLabel: '当前蛋白（不能变）',
    silentHint: '线索：一种氨基酸常常对应好几个密码子。',
    silentSlotEmpty: '还没找到同义突变',
    silentSlotFound: (spot, from, to) => `第 ${spot} 位 ${from}→${to}：蛋白没变`,
    silentNeedCopy: '先完成复制站。',
    silentTryMore: '这次蛋白变了。换一个位点试试。',
    silentDone: '找到了！同一个氨基酸可以由几个不同的密码子编码。',
    stageTitle: '复制叉',
    readExposed: '露出的碱基',
    readNew: '已配好的新链',
    readFork: '复制叉',
    hintOrbit: '拖动可以转动螺旋',
    nogl: '这台设备暂时打不开 3D，换个浏览器就能看双螺旋了。',
    undo: '拆掉一个',
    recenter: '正视螺旋',
    restart: '重开复制',
    stateWaiting: '待解旋',
    stateWorking: (done, total) => `已配 ${done}/${total}`,
    stateDone: '复制完成',
    logTitle: '序列与记录',
    reset: '重开实验',
    seqTemplate: '模板链',
    seqCoding: '新配出的链',
    seqRna: 'mRNA',
    colSpot: '位点',
    colChange: '替换',
    colCodon: '密码子',
    colAcid: '氨基酸',
    colKind: '类型',
    kindSilent: '同义',
    kindMissense: '错义',
    kindNonsense: '无义',
    mutationEmpty: '还没有做过突变',
    paired: (base, partner) => `${base} 和 ${partner} 配上了。`,
    mismatch: (base, wrong, right) => `${wrong} 搭不上 ${base}。${base} 只和 ${right} 配。`,
    undone: '拆掉最后一个碱基。',
    undoEmpty: '还没有配上去的碱基。',
    restarted: '链拆干净了，从头再配。',
    resetDone: '实验重置了。序列和记录都恢复原样。',
    copyDone: (count) => `复制完成！两条子代双链里保留了 ${count} 条老链。`,
    recentered: '视角回正。',
    soundOn: '关闭声音',
    soundOff: '打开声音',
    theme: '切换主题',
    lang: 'Switch to English',
    allDone: '通关：配对规则、半保留复制和同义突变都验证过了。',
    conclusionStart: '把露出来的碱基一个个配上去。',
    conclusionSemi: '看颜色：每条子代双链都是一条灰色老链配一条绿色新链。',
    conclusionCode: '再看记录表：碱基一改，密码子就变；但氨基酸不一定跟着变。',
    conclusionFinal: '结论：碱基配对是死规则，所以一条旧链就足够复原整条双链；而密码子有冗余，所以有些碱基改动不会改变蛋白。',
    strandOld: '老链',
    strandNew: '新链',
  },
  en: {
    doc: 'DNA Replication Lab · KidsLab',
    back: 'Back to platform',
    title: 'DNA Replication Lab',
    navTask: 'Task',
    navStage: 'Fork',
    navLog: 'Log',
    tabCopy: 'Copy',
    tabMutate: 'Mutate',
    tabSilent: 'Challenge',
    stationCopyTitle: 'How does one strand rebuild two?',
    stationMutateTitle: 'Swap one base — then what?',
    stationSilentTitle: 'Base changed, protein did not',
    predictionTitle: 'Predict first',
    predictionPrompt: 'One double helix copies into two. Across both new helices, how many strands are still the original ones?',
    predictionZero: 'None are left',
    predictionTwo: 'One in each',
    predictionFour: 'All of them',
    predictionSavedRight: 'Hold that guess. The colours will answer once the strand is paired.',
    predictionSavedOther: 'Keep it for now. Finish pairing and watch the colours.',
    predictionVerdict: (guess, count) => `You guessed "${guess}". Measured: each daughter helix keeps one grey parental strand, ${count} in total — that is semi-conservative replication.`,
    copyTitle: 'Pair the exposed base',
    copyHintStart: 'Look at the flashing base on the model, then pick its partner.',
    copyHintGoing: (base) => `${base} is exposed right now. It accepts exactly one partner.`,
    copyHintDone: 'Both new strands are paired. Look at the colours: every helix is one grey, one green.',
    controlLabel: 'Rule:',
    controlCopy: 'A pairs only with T, G only with C. A wrong base will not bond.',
    mutateSpotTitle: 'Pick a site to change',
    mutateNeedCopy: 'Finish the previous station first — there is nothing to change yet.',
    mutateReady: 'Choose a site, then choose the base to put there.',
    mutateBaseTitle: 'Swap in which base',
    applyMutation: 'Force the swap',
    restoreSequence: 'Restore original sequence',
    restored: 'Sequence restored. The mutation log stays in the notebook.',
    mutateSilent: (codonA, codonB, acid) => `The codon went ${codonA} → ${codonB}, and the amino acid is still ${acid} — a silent mutation.`,
    mutateMissense: (acidA, acidB) => `${acidA} became ${acidB} — a missense mutation; the protein changed.`,
    mutateNonsense: 'A stop codon appeared early — a nonsense mutation; the protein is cut short.',
    mutateNeedSpot: 'Pick a site first.',
    mutateNeedBase: 'Now pick the base to swap in.',
    silentTitle: 'Base changed, protein did not',
    silentPrompt: 'At some positions one base swap changes the codon but the amino acid stays identical. Find one.',
    silentTargetLabel: 'Current protein (must not change)',
    silentHint: 'Clue: one amino acid often has several codons.',
    silentSlotEmpty: 'No silent mutation found yet',
    silentSlotFound: (spot, from, to) => `Site ${spot} ${from}→${to}: protein unchanged`,
    silentNeedCopy: 'Finish the copy station first.',
    silentTryMore: 'That one changed the protein. Try a different site.',
    silentDone: 'Found it! Several different codons can spell the same amino acid.',
    stageTitle: 'Replication fork',
    readExposed: 'Exposed base',
    readNew: 'New strand so far',
    readFork: 'Fork',
    hintOrbit: 'Drag to turn the helix',
    nogl: '3D is unavailable on this device. Another browser will show the helix.',
    undo: 'Take one off',
    recenter: 'Face the helix',
    restart: 'Restart copying',
    stateWaiting: 'Not unwound',
    stateWorking: (done, total) => `Paired ${done}/${total}`,
    stateDone: 'Copy complete',
    logTitle: 'Sequences and log',
    reset: 'Restart lab',
    seqTemplate: 'Template strand',
    seqCoding: 'Newly paired strand',
    seqRna: 'mRNA',
    colSpot: 'Site',
    colChange: 'Swap',
    colCodon: 'Codon',
    colAcid: 'Amino acid',
    colKind: 'Type',
    kindSilent: 'Silent',
    kindMissense: 'Missense',
    kindNonsense: 'Nonsense',
    mutationEmpty: 'No mutation tried yet',
    paired: (base, partner) => `${base} paired with ${partner}.`,
    mismatch: (base, wrong, right) => `${wrong} will not bond to ${base}. ${base} pairs only with ${right}.`,
    undone: 'Removed the last base.',
    undoEmpty: 'No base has been added yet.',
    restarted: 'Strand cleared. Pair it again from the start.',
    resetDone: 'Lab reset. Sequences and log are back to the start.',
    copyDone: (count) => `Copy complete! The two daughter helices keep ${count} parental strands.`,
    recentered: 'View recentred.',
    soundOn: 'Mute sound',
    soundOff: 'Turn sound on',
    theme: 'Toggle theme',
    lang: '切换到中文',
    allDone: 'Complete: pairing rules, semi-conservative replication and a silent mutation all verified.',
    conclusionStart: 'Pair the exposed bases one at a time.',
    conclusionSemi: 'Look at the colours: each daughter helix is one grey parental strand plus one green new strand.',
    conclusionCode: 'Read the log: change a base and the codon changes — but the amino acid does not have to.',
    conclusionFinal: 'Conclusion: base pairing is a strict rule, so one old strand is enough to rebuild the whole helix. The codon table is redundant, so some base changes leave the protein untouched.',
    strandOld: 'parental',
    strandNew: 'new',
  },
};

const SOUND_KEY = 'kidslab.dna-replication-lab.sound';
const BASE_COLORS = Object.freeze({ A: 0xe8a13c, T: 0x2fae9d, G: 0x8b6cd6, C: 0xe8607a });
const KIND_KEYS = Object.freeze({ silent: 'kindSilent', missense: 'kindMissense', nonsense: 'kindNonsense' });
const PREDICTION_COUNTS = Object.freeze({ zero: 0, two: 2, four: 4 });

const $ = (selector) => document.querySelector(selector);

const elements = {
  app: $('#app'),
  langBtn: $('#langBtn'),
  themeBtn: $('#themeBtn'),
  soundBtn: $('#soundBtn'),
  stationCode: $('#stationCode'),
  taskTitle: $('#taskTitle'),
  predictionPrompt: $('#predictionPrompt'),
  predictionGrid: $('#predictionGrid'),
  predictionVerdict: $('#predictionVerdict'),
  predictionFeedback: $('#predictionFeedback'),
  copyCount: $('#copyCount'),
  copyHint: $('#copyHint'),
  strandStrip: $('#strandStrip'),
  mutateHint: $('#mutateHint'),
  spotGrid: $('#spotGrid'),
  swapGrid: $('#swapGrid'),
  mutateBtn: $('#mutateBtn'),
  restoreBtn: $('#restoreBtn'),
  mutateFeedback: $('#mutateFeedback'),
  silentTarget: $('#silentTarget'),
  silentProgress: $('#silentProgress'),
  silentFeedback: $('#silentFeedback'),
  labState: $('#labState'),
  readExposed: $('#readExposed'),
  readNew: $('#readNew'),
  readFork: $('#readFork'),
  canvas: $('#scene'),
  sceneWrap: $('.scene-wrap'),
  sceneMarkers: $('#sceneMarkers'),
  sceneHint: $('#sceneHint'),
  nogl: $('#nogl'),
  toast: $('#toast'),
  basePool: $('#basePool'),
  undoBtn: $('#undoBtn'),
  viewBtn: $('#viewBtn'),
  restartBtn: $('#restartBtn'),
  seqTemplate: $('#seqTemplate'),
  seqCoding: $('#seqCoding'),
  seqRna: $('#seqRna'),
  proteinRow: $('#proteinRow'),
  mutationBody: $('#mutationBody'),
  conclusion: $('#conclusion'),
};

/* ================================ 状态 ================================ */

const LENGTH = TEMPLATE_STRAND.length;

function makeState() {
  return {
    station: 'copy',
    mobilePanel: 'task',
    template: TEMPLATE_STRAND,
    placed: [],
    prediction: null,
    predictionNotice: null,
    spot: null,
    swapBase: null,
    mutations: [],
    silentFound: null,
    mutateNotice: null,
    silentNotice: null,
    baselineProtein: proteinOf(TEMPLATE_STRAND),
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
const acidName = (code) => `${AMINO_ACIDS[code] || code}`;
const copyComplete = () => state.placed.length === LENGTH;
const exposedBase = () => (copyComplete() ? null : state.template[state.placed.length]);
const newStrand = () => state.placed.join('');

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
  pair: { notes: [523], duration: 0.16, gain: 0.045, type: 'sine' },
  error: { notes: [180, 140], duration: 0.24, gain: 0.04, type: 'sawtooth' },
  mutate: { notes: [330, 294], duration: 0.26, gain: 0.045, type: 'triangle' },
  success: { notes: [523, 659], duration: 0.28, gain: 0.055, type: 'sine' },
  complete: { notes: [440, 554, 659, 880], duration: 0.6, gain: 0.06, type: 'sine' },
});

function tone(kind) {
  if (muted) return;
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    audioContext ||= new AudioCtor();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    const settings = TONES[kind] || TONES.pair;
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
    // 音频不可用时静默降级
  }
}

/* ================================ 提示条 ================================ */

let toastTimer = 0;

function toast(message, kind = '') {
  elements.toast.textContent = message;
  elements.toast.className = `toast${kind ? ` is-${kind}` : ''}`;
  elements.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { elements.toast.hidden = true; }, kind === 'error' ? 3600 : 2600);
}

/* ================================ three.js 场景 ================================ */

const RISE = 1.15;          // 相邻碱基对的轴向间距
const HELIX_RADIUS = 1.42;
const TWIST = (Math.PI * 2) / 10; // B-DNA 每 10 个碱基对转一圈
const FORK_SPREAD = 3.35;   // 复制叉张开后两条子代双链的中心距

let renderer = null;
let scene = null;
let camera = null;
let hemiLight = null;
let sunLight = null;
const helixGroup = new THREE.Group();
const disposables = [];
const nodes = [];
const baseTextures = new Map();
let oldMaterial = null;
let freshMaterial = null;
const baseMaterials = new Map();

const orbitCam = { yaw: 0.42, pitch: 0.16, dist: 19, targetYaw: 0.42, targetPitch: 0.16, targetDist: 19 };
const pointers = new Map();
let dragging = false;
let dragMoved = 0;
let pinchStart = 0;

function baseTexture(base) {
  if (baseTextures.has(base)) return baseTextures.get(base);
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = `#${BASE_COLORS[base].toString(16).padStart(6, '0')}`;
  ctx.beginPath();
  ctx.arc(64, 64, 58, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(20, 28, 24, 0.75)';
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.fillStyle = base === 'G' || base === 'C' ? '#ffffff' : '#17221d';
  ctx.font = '900 76px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(base, 64, 70);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  disposables.push(texture);
  baseTextures.set(base, texture);
  return texture;
}

function baseMaterial(base) {
  if (!baseMaterials.has(base)) {
    const material = new THREE.MeshStandardMaterial({ color: BASE_COLORS[base], roughness: 0.42, metalness: 0.12 });
    baseMaterials.set(base, material);
    disposables.push(material);
  }
  return baseMaterials.get(base);
}

const beadGeometry = new THREE.SphereGeometry(0.22, 20, 14);
const linkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 12, 1, true);
const rungGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
disposables.push(beadGeometry, linkGeometry, rungGeometry);

function makeStrandNode(kind) {
  const bead = new THREE.Mesh(beadGeometry, kind === 'old' ? oldMaterial : freshMaterial);
  bead.castShadow = true;
  const rung = new THREE.Mesh(rungGeometry, baseMaterial('A'));
  rung.castShadow = true;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: baseTexture('A'), transparent: true, depthWrite: false }));
  sprite.scale.setScalar(0.9);
  disposables.push(sprite.material);
  const link = new THREE.Mesh(linkGeometry, kind === 'old' ? oldMaterial : freshMaterial);
  link.castShadow = true;
  helixGroup.add(bead, rung, sprite, link);
  return { bead, rung, sprite, link, position: new THREE.Vector3() };
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
  camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);
  placeCamera();

  hemiLight = new THREE.HemisphereLight(0xffffff, 0x2f4a3f, 1.15);
  scene.add(hemiLight);
  sunLight = new THREE.DirectionalLight(0xfff6ea, 2.2);
  sunLight.position.set(6, 9, 8);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  scene.add(sunLight);
  const rim = new THREE.DirectionalLight(0x9fe3ff, 0.65);
  rim.position.set(-7, -3, -6);
  scene.add(rim);

  oldMaterial = new THREE.MeshStandardMaterial({ color: 0x7d8ba0, roughness: 0.5, metalness: 0.3 });
  freshMaterial = new THREE.MeshStandardMaterial({ color: 0x3fae74, roughness: 0.4, metalness: 0.24, emissive: 0x0d3b25 });
  disposables.push(oldMaterial, freshMaterial);

  for (let i = 0; i < LENGTH; i += 1) {
    nodes.push({
      openness: 0,
      oldA: makeStrandNode('old'),
      oldB: makeStrandNode('old'),
      newA: makeStrandNode('fresh'),
      newB: makeStrandNode('fresh'),
    });
  }
  scene.add(helixGroup);

  applySceneTheme();
  resizeRenderer();
  new ResizeObserver(resizeRenderer).observe(elements.sceneWrap);
  requestAnimationFrame(animate);
  return true;
}

/* 标记位置靠投影算出来，相机必须先摆好，否则新建的标记会停在画布角上 */
function placeCamera() {
  camera.position.set(
    Math.cos(orbitCam.pitch) * Math.sin(orbitCam.yaw) * orbitCam.dist,
    Math.sin(orbitCam.pitch) * orbitCam.dist,
    Math.cos(orbitCam.pitch) * Math.cos(orbitCam.yaw) * orbitCam.dist,
  );
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
}

function applySceneTheme() {
  if (!renderer) return;
  const dark = (window.cool?.preferences?.theme || 'light') === 'dark';
  hemiLight.intensity = dark ? 0.72 : 1.25;
  sunLight.intensity = dark ? 2.0 : 2.25;
  oldMaterial.color.set(dark ? 0x93a4b8 : 0x76849a);
  freshMaterial.emissiveIntensity = dark ? 0.6 : 0.25;
}

function resizeRenderer() {
  if (!renderer) return;
  const width = Math.max(1, elements.sceneWrap.clientWidth);
  const height = Math.max(1, elements.sceneWrap.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

const tmpAxis = new THREE.Vector3();
const tmpQuat = new THREE.Quaternion();
const UP = new THREE.Vector3(0, 1, 0);

function placeSegment(mesh, from, to, thickness) {
  tmpAxis.copy(to).sub(from);
  const distance = tmpAxis.length();
  if (distance < 1e-5) {
    mesh.visible = false;
    return;
  }
  mesh.visible = true;
  tmpAxis.divideScalar(distance);
  tmpQuat.setFromUnitVectors(UP, tmpAxis);
  mesh.quaternion.copy(tmpQuat);
  mesh.scale.set(thickness, distance, thickness);
  mesh.position.copy(from).addScaledVector(tmpAxis, distance / 2);
}

function updateStrandNode(node, base, shown) {
  node.bead.visible = shown;
  node.rung.visible = false;
  node.sprite.visible = false;
  node.link.visible = false;
  if (!shown || !base) return;
  node.rung.material = baseMaterial(base);
  node.sprite.material.map = baseTexture(base);
  node.sprite.material.needsUpdate = true;
}

/**
 * 每帧按 openness 摆位：openness=0 是完整双螺旋，=1 是完全张开的复制叉，
 * 两条子代双链各自绕自己的轴。碱基对已配好的位置 openness 趋向 1。
 */
function updateHelix(delta) {
  if (!renderer) return;
  const fork = state.placed.length;
  let openSum = 0;
  for (let i = 0; i < LENGTH; i += 1) {
    const node = nodes[i];
    const target = i < fork ? 1 : 0;
    node.openness = approach(node.openness, target, delta * 5.5);
    openSum += node.openness;
    const o = node.openness;
    const angle = i * TWIST;
    const y = (i - (LENGTH - 1) / 2) * RISE;
    const cos = Math.cos(angle) * HELIX_RADIUS;
    const sin = Math.sin(angle) * HELIX_RADIUS;
    const leftCenter = -o * FORK_SPREAD;
    const rightCenter = o * FORK_SPREAD;
    node.oldA.position.set(leftCenter + cos, y, sin);
    node.newA.position.set(leftCenter - cos, y, -sin);
    node.oldB.position.set(rightCenter - cos, y, -sin);
    node.newB.position.set(rightCenter + cos, y, sin);

    const templateBase = state.template[i];
    const placedBase = state.placed[i];
    const codingBase = complementBase(templateBase);
    updateStrandNode(node.oldA, templateBase, true);
    updateStrandNode(node.oldB, codingBase, true);
    updateStrandNode(node.newA, placedBase, Boolean(placedBase));
    updateStrandNode(node.newB, placedBase ? templateBase : null, Boolean(placedBase));

    for (const [strand, base] of [
      [node.oldA, templateBase],
      [node.oldB, codingBase],
      [node.newA, placedBase],
      [node.newB, placedBase ? templateBase : null],
    ]) {
      strand.bead.position.copy(strand.position);
      if (!strand.bead.visible || !base) continue;
      /* 碱基横杆从骨架伸向所属双链的轴心，一半长度，颜色即碱基 */
      const axisX = strand === node.oldA || strand === node.newA ? leftCenter : rightCenter;
      const midpoint = new THREE.Vector3(axisX, strand.position.y, 0);
      strand.rung.visible = true;
      placeSegment(strand.rung, strand.position, midpoint, 0.62);
      strand.sprite.visible = true;
      strand.sprite.position.lerpVectors(strand.position, midpoint, 0.38);
    }

    if (i + 1 < LENGTH) {
      const next = nodes[i + 1];
      for (const [a, b] of [
        [node.oldA, next.oldA], [node.oldB, next.oldB],
        [node.newA, next.newA], [node.newB, next.newB],
      ]) {
        if (a.bead.visible && b.bead.visible) placeSegment(a.link, a.position, b.position, 1);
        else a.link.visible = false;
      }
    } else {
      for (const strand of [node.oldA, node.oldB, node.newA, node.newB]) strand.link.visible = false;
    }
  }
  const averageOpen = openSum / LENGTH;
  orbitCam.targetDist = 18 + averageOpen * 6.5;
}

/* 指数补间永远逼近而不到达，位置会一直有 0.x 像素的抖动。
   足够接近时直接落定，界面上的标记才真正静止。 */
const SETTLE = 0.0008;

function approach(current, target, factor) {
  const next = current + (target - current) * Math.min(1, factor);
  return Math.abs(target - next) < SETTLE ? target : next;
}

function animate(now) {
  requestAnimationFrame(animate);
  if (!renderer) return;
  const delta = Math.min(0.05, animate.last ? (now - animate.last) / 1000 : 0.016);
  animate.last = now;

  updateHelix(delta);

  /* 待配对的那个碱基呼吸放大，指向「该看这里」 */
  const fork = state.placed.length;
  if (fork < LENGTH) {
    const pulse = 1 + Math.sin(now / 190) * 0.22;
    nodes[fork].oldA.sprite.scale.setScalar(0.9 * pulse);
  }
  for (let i = 0; i < LENGTH; i += 1) {
    if (i !== fork) nodes[i].oldA.sprite.scale.setScalar(0.9);
  }

  orbitCam.yaw = approach(orbitCam.yaw, orbitCam.targetYaw, delta * 8);
  orbitCam.pitch = approach(orbitCam.pitch, orbitCam.targetPitch, delta * 8);
  orbitCam.dist = approach(orbitCam.dist, orbitCam.targetDist, delta * 4);
  camera.position.set(
    Math.cos(orbitCam.pitch) * Math.sin(orbitCam.yaw) * orbitCam.dist,
    Math.sin(orbitCam.pitch) * orbitCam.dist,
    Math.cos(orbitCam.pitch) * Math.cos(orbitCam.yaw) * orbitCam.dist,
  );
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  updateMarker();
  renderer.render(scene, camera);
}

/* ================================ 场景标记 ================================ */

const projected = new THREE.Vector3();
let markerButton = null;

function ensureMarker() {
  if (markerButton) return markerButton;
  markerButton = document.createElement('button');
  markerButton.type = 'button';
  markerButton.className = 'scene-marker';
  markerButton.dataset.marker = 'exposed';
  elements.sceneMarkers.append(markerButton);
  return markerButton;
}

function updateMarker() {
  const marker = ensureMarker();
  const base = exposedBase();
  if (!base || !renderer || !camera) {
    marker.hidden = true;
    return;
  }
  marker.hidden = false;
  marker.textContent = base;
  marker.setAttribute('aria-label', text('copyHintGoing', base));
  projected.copy(nodes[state.placed.length].oldA.position).project(camera);
  if (projected.z > 1) {
    marker.style.visibility = 'hidden';
    return;
  }
  marker.style.visibility = 'visible';
  const width = elements.canvas.clientWidth;
  const height = elements.canvas.clientHeight;
  const transform = `translate(${((projected.x * 0.5 + 0.5) * width).toFixed(1)}px, ${((-projected.y * 0.5 + 0.5) * height).toFixed(1)}px) translate(-50%, -50%)`;
  if (marker.dataset.transform !== transform) {
    marker.dataset.transform = transform;
    marker.style.transform = transform;
  }
}

function bindPointer() {
  if (!renderer) return;
  const surface = elements.sceneWrap;
  surface.addEventListener('pointerdown', (event) => {
    if (event.target === elements.canvas) surface.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) { dragging = true; dragMoved = 0; }
    else if (pointers.size === 2) {
      const [first, second] = [...pointers.values()];
      pinchStart = Math.hypot(first.x - second.x, first.y - second.y);
    }
  });
  surface.addEventListener('pointermove', (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size >= 2) {
      const [first, second] = [...pointers.values()];
      const spread = Math.hypot(first.x - second.x, first.y - second.y);
      if (pinchStart > 0) {
        orbitCam.targetDist = Math.min(46, Math.max(10, orbitCam.targetDist * (pinchStart / Math.max(1, spread))));
        pinchStart = spread;
      }
      return;
    }
    dragMoved += Math.abs(dx) + Math.abs(dy);
    if (!dragging || dragMoved < 5) return;
    orbitCam.targetYaw -= dx * 0.008;
    orbitCam.targetPitch = Math.max(-1.2, Math.min(1.2, orbitCam.targetPitch + dy * 0.006));
  });
  const release = (event) => {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = 0;
    if (!pointers.size) dragging = false;
  };
  surface.addEventListener('pointerup', release);
  surface.addEventListener('pointercancel', release);
  surface.addEventListener('wheel', (event) => {
    event.preventDefault();
    orbitCam.targetDist = Math.min(46, Math.max(10, orbitCam.targetDist * (event.deltaY > 0 ? 1.1 : 0.91)));
  }, { passive: false });
}

/* ================================ 实验动作 ================================ */

function placeBase(base) {
  const template = exposedBase();
  if (!template) return;
  if (!isLegalPair(template, base)) {
    tone('error');
    toast(text('mismatch', template, base, complementBase(template)), 'error');
    window.cool?.track?.('mismatched_base', { template, attempted: base });
    return;
  }
  state.placed.push(base);
  tone('pair');
  toast(text('paired', template, base));
  window.cool?.stage('pairing');
  if (copyComplete()) {
    const retained = retainedParentalStrands(state.template);
    tone('complete');
    toast(text('copyDone', retained), 'success');
    window.cool?.stage('copy_complete');
    window.cool?.track?.('completed_replication', { retained });
  }
  checkCompletion();
  render();
}

function undoBase() {
  if (!state.placed.length) {
    tone('error');
    toast(text('undoEmpty'), 'error');
    return;
  }
  state.placed.pop();
  tone('pair');
  toast(text('undone'));
  render();
}

function restartStrand() {
  state.placed = [];
  tone('pair');
  toast(text('restarted'));
  render();
}

function applySwap() {
  if (!copyComplete()) {
    tone('error');
    state.mutateNotice = { key: 'mutateNeedCopy', kind: 'error' };
    render();
    return;
  }
  if (state.spot === null) {
    tone('error');
    state.mutateNotice = { key: 'mutateNeedSpot', kind: 'error' };
    render();
    return;
  }
  if (!state.swapBase) {
    tone('error');
    state.mutateNotice = { key: 'mutateNeedBase', kind: 'error' };
    render();
    return;
  }
  const report = mutationReport(state.template, state.spot, state.swapBase);
  if (!report) {
    tone('error');
    state.mutateNotice = { key: 'mutateNeedBase', kind: 'error' };
    render();
    return;
  }
  state.template = report.after.template;
  state.placed = [...report.after.coding];
  state.mutations.push(report);
  state.swapBase = null;
  const noticeKey = { silent: 'mutateSilent', missense: 'mutateMissense', nonsense: 'mutateNonsense' }[report.kind];
  const args = report.kind === 'silent'
    ? [report.codonBefore, report.codonAfter, acidName(report.acidAfter)]
    : report.kind === 'missense'
      ? [acidName(report.acidBefore), acidName(report.acidAfter)]
      : [];
  state.mutateNotice = { key: noticeKey, kind: report.kind === 'silent' ? 'success' : 'error', args };
  if (report.kind === 'silent' && !state.silentFound) {
    state.silentFound = report;
    state.silentNotice = { key: 'silentDone', kind: 'success' };
    window.cool?.stage('silent_mutation');
    window.cool?.track?.('found_silent_mutation', { site: report.index + 1 });
  } else if (state.station === 'silent' && !state.silentFound) {
    state.silentNotice = { key: 'silentTryMore', kind: '' };
  }
  tone(report.kind === 'silent' ? 'success' : 'mutate');
  window.cool?.track?.('applied_mutation', { kind: report.kind, site: report.index + 1 });
  checkCompletion();
  render();
}

function restoreSequence() {
  state.template = TEMPLATE_STRAND;
  state.placed = [...complementStrand(TEMPLATE_STRAND)];
  state.spot = null;
  state.swapBase = null;
  state.mutateNotice = null;
  tone('pair');
  toast(text('restored'));
  render();
}

function checkCompletion() {
  if (state.completed) return;
  if (copyComplete() && state.prediction && state.silentFound) {
    state.completed = true;
    window.cool?.complete?.();
    window.cool?.track?.('completed_dna_lab');
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
  tone('pair');
  toast(text('resetDone'));
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
  const codes = { copy: 'STATION 01', mutate: 'STATION 02', silent: 'STATION 03 · L4' };
  const titles = { copy: 'stationCopyTitle', mutate: 'stationMutateTitle', silent: 'stationSilentTitle' };
  elements.stationCode.textContent = codes[state.station];
  elements.taskTitle.textContent = text(titles[state.station]);
  document.querySelectorAll('[data-station]').forEach((button) => {
    const active = button.dataset.station === state.station;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $('#stationCopy').hidden = state.station !== 'copy';
  $('#stationMutate').hidden = state.station !== 'mutate';
  $('#stationSilent').hidden = state.station !== 'silent';
}

function renderCopyStation() {
  document.querySelectorAll('[data-prediction]').forEach((button) => {
    const active = button.dataset.prediction === state.prediction;
    button.classList.toggle('is-selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const verified = Boolean(state.prediction && copyComplete());
  elements.predictionGrid.hidden = verified;
  elements.predictionPrompt.hidden = verified;
  elements.predictionVerdict.hidden = !verified;
  if (verified) {
    elements.predictionVerdict.textContent = text(
      'predictionVerdict',
      text(`prediction${state.prediction[0].toUpperCase()}${state.prediction.slice(1)}`),
      retainedParentalStrands(state.template),
    );
  }
  renderNotice(elements.predictionFeedback, verified ? null : state.predictionNotice);

  elements.copyCount.textContent = `${state.placed.length} / ${LENGTH}`;
  const exposed = exposedBase();
  elements.copyHint.textContent = exposed
    ? text(state.placed.length ? 'copyHintGoing' : 'copyHintStart', exposed)
    : text('copyHintDone');

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < LENGTH; i += 1) {
    const cell = document.createElement('div');
    const mutated = state.mutations.some((report) => report.index === i);
    cell.className = `strand-cell${mutated ? ' is-mutated' : ''}`;
    cell.setAttribute('role', 'listitem');
    const top = document.createElement('span');
    top.className = 'base-tile';
    top.dataset.base = state.template[i];
    top.textContent = state.template[i];
    const bottom = document.createElement('span');
    const placed = state.placed[i];
    if (placed) {
      bottom.className = 'base-tile';
      bottom.dataset.base = placed;
      bottom.textContent = placed;
    } else {
      bottom.className = `base-tile ${i === state.placed.length ? 'base-tile--next' : 'base-tile--empty'}`;
      bottom.textContent = i === state.placed.length ? '?' : '·';
    }
    cell.append(top, bottom);
    fragment.append(cell);
  }
  elements.strandStrip.replaceChildren(fragment);
}

function renderMutateStation() {
  const ready = copyComplete();
  elements.mutateHint.textContent = text(ready ? 'mutateReady' : 'mutateNeedCopy');

  const spots = document.createDocumentFragment();
  for (let i = 0; i < LENGTH; i += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `spot-btn${state.spot === i ? ' is-selected' : ''}`;
    button.dataset.spot = String(i);
    button.disabled = !ready;
    button.setAttribute('aria-pressed', String(state.spot === i));
    const label = document.createElement('small');
    label.textContent = String(i + 1);
    const base = document.createElement('strong');
    base.textContent = state.template[i];
    button.append(label, base);
    spots.append(button);
  }
  elements.spotGrid.replaceChildren(spots);

  const swaps = document.createDocumentFragment();
  const current = state.spot === null ? null : state.template[state.spot];
  BASES.filter((base) => base !== current).forEach((base) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `swap-btn${state.swapBase === base ? ' is-selected' : ''}`;
    button.dataset.base = base;
    button.disabled = !ready || state.spot === null;
    button.setAttribute('aria-pressed', String(state.swapBase === base));
    button.textContent = base;
    swaps.append(button);
  });
  elements.swapGrid.replaceChildren(swaps);
  elements.mutateBtn.disabled = !ready || state.spot === null || !state.swapBase;
  elements.restoreBtn.hidden = state.template === TEMPLATE_STRAND;
  renderNotice(elements.mutateFeedback, state.mutateNotice);
}

function renderSilentStation() {
  elements.silentTarget.textContent = proteinOf(state.template).map(acidName).join('-');
  const slot = document.createElement('div');
  slot.className = `silent-slot${state.silentFound ? ' is-found' : ''}`;
  const mark = document.createElement('span');
  mark.setAttribute('aria-hidden', 'true');
  mark.textContent = state.silentFound ? '✓' : '○';
  const label = document.createElement('span');
  label.textContent = state.silentFound
    ? text('silentSlotFound', state.silentFound.index + 1, state.silentFound.fromBase, state.silentFound.toBase)
    : text('silentSlotEmpty');
  slot.append(mark, label);
  elements.silentProgress.replaceChildren(slot);
  renderNotice(elements.silentFeedback, copyComplete() ? state.silentNotice : { key: 'silentNeedCopy', kind: '' });
}

function renderStage() {
  const exposed = exposedBase();
  elements.readExposed.textContent = exposed || '—';
  elements.readNew.textContent = newStrand() || '—';
  elements.readFork.textContent = `${state.placed.length} / ${LENGTH}`;
  elements.sceneHint.textContent = text('hintOrbit');

  const pool = document.createDocumentFragment();
  BASES.forEach((base) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'base-chip';
    button.dataset.base = base;
    button.disabled = !exposed;
    const glyph = document.createElement('strong');
    glyph.textContent = base;
    const hint = document.createElement('small');
    hint.textContent = `+${base}`;
    button.append(glyph, hint);
    button.setAttribute('aria-label', `${base}`);
    pool.append(button);
  });
  elements.basePool.replaceChildren(pool);

  let stateLabel = text('stateWaiting');
  if (copyComplete()) stateLabel = text('stateDone');
  else if (state.placed.length) stateLabel = text('stateWorking', state.placed.length, LENGTH);
  elements.labState.textContent = stateLabel;
  elements.labState.classList.toggle('is-active', copyComplete());
}

function renderSequences() {
  const coding = copyComplete() ? newStrand() : '';
  elements.seqTemplate.textContent = state.template;
  elements.seqCoding.textContent = coding || '—';
  elements.seqRna.textContent = coding ? transcribe(coding) : '—';

  const fragment = document.createDocumentFragment();
  if (coding) {
    const rna = transcribe(coding);
    const protein = proteinOf(state.template);
    codonsOf(rna).forEach((codon, index) => {
      const card = document.createElement('div');
      const changed = state.baselineProtein[index] !== protein[index];
      card.className = `acid-card${changed ? ' is-changed' : ''}`;
      const code = document.createElement('small');
      code.textContent = codon;
      const name = document.createElement('strong');
      name.textContent = acidName(protein[index]);
      card.append(code, name);
      fragment.append(card);
    });
  }
  elements.proteinRow.replaceChildren(fragment);
}

function renderMutations() {
  const fragment = document.createDocumentFragment();
  if (!state.mutations.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.className = 'table-empty';
    cell.textContent = text('mutationEmpty');
    row.append(cell);
    fragment.append(row);
  }
  state.mutations.forEach((report) => {
    const row = document.createElement('tr');
    const cells = [
      String(report.index + 1),
      `${report.fromBase}→${report.toBase}`,
      `${report.codonBefore}→${report.codonAfter}`,
      `${acidName(report.acidBefore)}→${acidName(report.acidAfter)}`,
      text(KIND_KEYS[report.kind]),
    ];
    cells.forEach((value, index) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (index === 1 || index === 2) cell.className = 'mono';
      if (index === 4) cell.className = `is-${report.kind}`;
      row.append(cell);
    });
    fragment.append(row);
  });
  elements.mutationBody.replaceChildren(fragment);
}

function renderConclusion() {
  let key = 'conclusionStart';
  if (state.completed) key = 'conclusionFinal';
  else if (state.mutations.length) key = 'conclusionCode';
  else if (copyComplete()) key = 'conclusionSemi';
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
  renderCopyStation();
  renderMutateStation();
  renderSilentStation();
  renderStage();
  renderSequences();
  renderMutations();
  renderConclusion();
  renderMobileNavigation();
}

/* ================================ 事件绑定 ================================ */

const isCompact = () => window.matchMedia('(max-width: 900px)').matches;

document.querySelectorAll('[data-station]').forEach((button) => {
  button.addEventListener('click', () => {
    state.station = button.dataset.station;
    state.mutateNotice = null;
    if (state.station !== 'silent') state.silentNotice = state.silentFound ? { key: 'silentDone', kind: 'success' } : null;
    render();
  });
});

document.querySelectorAll('[data-prediction]').forEach((button) => {
  button.addEventListener('click', () => {
    state.prediction = button.dataset.prediction;
    const correct = PREDICTION_COUNTS[state.prediction] === retainedParentalStrands(state.template);
    state.predictionNotice = {
      key: correct ? 'predictionSavedRight' : 'predictionSavedOther',
      kind: correct ? 'success' : '',
    };
    window.cool?.stage('prediction');
    window.cool?.track?.('predicted_retained_strands', { prediction: state.prediction });
    tone('pair');
    checkCompletion();
    render();
  });
});

elements.basePool.addEventListener('click', (event) => {
  const button = event.target.closest('[data-base]');
  if (!button) return;
  placeBase(button.dataset.base);
  if (isCompact()) renderMobileNavigation();
});

elements.sceneMarkers.addEventListener('click', () => {
  const base = exposedBase();
  if (!base || dragMoved >= 5) return;
  toast(text('copyHintGoing', base));
});

elements.spotGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-spot]');
  if (!button) return;
  state.spot = Number(button.dataset.spot);
  state.swapBase = null;
  state.mutateNotice = null;
  tone('pair');
  render();
});

elements.swapGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-base]');
  if (!button) return;
  state.swapBase = button.dataset.base;
  state.mutateNotice = null;
  tone('pair');
  render();
});

elements.mutateBtn.addEventListener('click', applySwap);
elements.restoreBtn.addEventListener('click', restoreSequence);
elements.undoBtn.addEventListener('click', undoBase);
elements.restartBtn.addEventListener('click', restartStrand);
elements.viewBtn.addEventListener('click', () => {
  orbitCam.targetYaw = 0.42;
  orbitCam.targetPitch = 0.16;
  tone('pair');
  toast(text('recentered'));
});
$('#resetBtn').addEventListener('click', resetLab);

document.querySelectorAll('.mobile-nav__button').forEach((button) => {
  button.addEventListener('click', () => {
    state.mobilePanel = button.dataset.mobilePanel;
    renderMobileNavigation();
    if (state.mobilePanel === 'stage') resizeRenderer();
  });
});

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
  /* 螺旋位置由 openness 在帧里推进，先算一帧再定位标记，避免标记停在画布角上 */
  updateHelix(1);
  updateMarker();
}
/* 关卡序列保证 L4 一定有解，缺解时不应上线 */
if (!hasSilentSubstitution(TEMPLATE_STRAND)) {
  console.warn('dna-replication-lab: 当前模板链没有同义替换，L4 挑战无解');
}
render();
