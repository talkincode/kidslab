import { createAudio } from './audio.js';
import { createPort3D } from './game3d.js';
import {
  LEVELS,
  checksFor,
  expectedZone,
  missionSolution,
  truthCode,
} from './model.js';

const I18N = {
  zh: {
    doc: '维恩太空港 · 轨道海关 · KidsLab',
    back: '返回平台',
    title: '维恩太空港 · 轨道海关',
    subtitle: '扫描两条规则，为每艘飞船找到唯一泊位',
    nogl: '浏览器暂不支持 WebGL，轨道停机坪无法启动。请换一个新浏览器试试。',
    docked: '已停靠',
    signal: '扫描码',
    panelTitle: '塔台控制台',
    chooseMission: '选择任务',
    watchDemo: '观看本关演示',
    questionOne: '问题一',
    questionTwo: '问题二',
    bothZone: '交集 · 两个都满足',
    neitherZone: '两个都不满足',
    hint: '提示泊位',
    reset: '重开任务',
    lesson: '交集小课堂',
    ruleTitle: '两个问题，正好四种答案',
    ruleText: '10、11、01、00，各自对应一个区域。',
    footTip: '拖动飞船到泊位 · 点击发光平台也能降落 · 拖空白转动视角',
    demoProgress: '本关自动演示',
    exitDemo: '退出演示',
    speed: '速度',
    lessonEyebrow: '轨道分类档案',
    previous: '上一步',
    next: '下一步',
    guideEyebrow: '第一次值守轨道海关',
    guideTitle: '两次扫描，唯一泊位',
    guide1: '看飞船是否满足规则 A',
    guide2: '再看它是否满足规则 B',
    guide3: '按 10、11、01、00 停入对应区域',
    guideDemo: '先看完整演示',
    guidePlay: '我来指挥',
    winEyebrow: '泊位全部确认',
    nextMission: '下一项任务',
    reviewDemo: '回看本关演示',
    yes: '满足',
    no: '不满足',
    onlyRule: (rule) => `只满足「${rule}」`,
    zoneNames: {
      left: '只满足规则 A',
      both: '交集：两个都满足',
      right: '只满足规则 B',
      neither: '两个都不满足',
    },
    zone3d: {
      left: '只满足 A · 10',
      both: '交集 · 11',
      right: '只满足 B · 01',
      neither: '都不满足 · 00',
    },
    rule3dPrefix: {
      left: '规则 A',
      right: '规则 B',
    },
    coachIcons: {
      scan: '核验',
      retry: '重试',
      hint: '提示',
      reset: '重置',
      auto: '演示',
      clear: '完成',
    },
    missionNames: ['双重身份', '形状扫描', '星际货运', '空港总考验'],
    missionBriefs: [
      '按“有触角”和“三只眼”完成身份核验。',
      '按“圆形船身”和“有条纹”完成外形核验。',
      '按“带水晶”和“有翅膀”完成货运核验。',
      '按“蓝色船身”和“星星标志”完成总考验。',
    ],
    rules: {
      antenna: '有触角',
      threeEyes: '三只眼',
      round: '圆形船身',
      striped: '有条纹',
      crystal: '带水晶',
      wings: '有翅膀',
      blue: '蓝色船身',
      star: '星星标志',
    },
    coachReadyTitle: '读取两块规则牌',
    coachReadyText: '依次回答“满足”或“不满足”，两个答案会指向唯一泊位。',
    coachShipTitle: (index, total) => `第 ${index} / ${total} 艘等待核验`,
    coachShipText: (left, right) => `扫描完成：规则 A 是“${left}”，规则 B 是“${right}”。`,
    coachWrongTitle: '泊位不匹配，飞船已返航',
    coachWrongText: (code, zone) => `扫描码是 ${code}，它应该去“${zone}”。再试一次。`,
    coachCorrectTitle: '海关放行，停靠成功',
    coachCorrectText: (zone) => `两次判断都对上了：${zone}。`,
    coachHintTitle: '按扫描码找泊位',
    coachHintText: (code, zone) => `${code} 对应“${zone}”，发光平台已经标出来。`,
    coachResetTitle: '任务已重新排队',
    coachResetText: '从第一艘开始，依次核验规则 A 与规则 B。',
    coachDemoStartTitle: '自动塔台接管',
    coachDemoStartText: '观察每艘飞船如何从两次扫描得到唯一泊位。',
    coachDemoMoveTitle: (index, total) => `演示 ${index} / ${total}`,
    coachDemoMoveText: (code, zone) => `扫描码 ${code}，所以降落在“${zone}”。`,
    coachDemoDoneTitle: '五艘飞船全部归位',
    coachDemoDoneText: '四种答案组合，正好覆盖四个区域。',
    demoPause: '暂停演示',
    demoPlay: '继续演示',
    demoReplay: '重新播放',
    lessonSteps: [
      {
        zone: null,
        title: '先问两个“是或否”',
        text: '同一艘飞船依次接受 A、B 两次扫描。答案只有四种组合。',
      },
      {
        zone: 'left',
        title: '10：只满足规则 A',
        text: 'A 回答“有”，B 回答“没有”。飞船进入左圈，但不进入重叠区。',
      },
      {
        zone: 'both',
        title: '11：两个都满足，就是交集',
        text: '两个回答都是“有”，飞船同时属于两个集合，所以停在重叠的中间。',
      },
      {
        zone: 'neither',
        title: '00：圆圈外也是正式区域',
        text: '两个回答都是“没有”，它不属于任一集合，应停在两个圆圈之外。',
      },
    ],
    winTitles: ['交集停机坪点亮了！', '分类雷达升级！', '星际货物全部签收！', '金牌塔台指挥官！'],
    winNotes: [
      '“两个都满足”的地方，就是交集。',
      '同一艘飞船可以只属于一个集合，也可以同时属于两个。',
      '哪边都不符合时，仍有正式泊位：两个圆圈外。',
      '你已经能用两个条件完成完整分类。',
    ],
    winStats: (mistakes) => `5 艘飞船 · ${mistakes} 次误判`,
    again: '重新值守',
    musicOn: '开启背景音乐',
    musicOff: '关闭背景音乐',
    soundOn: '开启音效',
    soundOff: '关闭音效',
    switchTheme: '切换深浅主题',
  },
  en: {
    doc: 'Venn Spaceport · Orbital Customs · KidsLab',
    back: 'Back',
    title: 'Venn Spaceport · Orbital Customs',
    subtitle: 'Scan two rules and assign every ship one exact bay',
    nogl: 'This browser cannot start the WebGL docking deck. Please try a newer browser.',
    docked: 'Docked',
    signal: 'Scan code',
    panelTitle: 'Control Console',
    chooseMission: 'Choose mission',
    watchDemo: 'Watch mission demo',
    questionOne: 'Question one',
    questionTwo: 'Question two',
    bothZone: 'Intersection · both',
    neitherZone: 'Neither rule',
    hint: 'Show bay',
    reset: 'Restart mission',
    lesson: 'Intersection lesson',
    ruleTitle: 'Two questions make four answers',
    ruleText: '10, 11, 01, and 00 each map to one region.',
    footTip: 'Drag the ship to a bay · tap a glowing platform · drag empty space to orbit',
    demoProgress: 'Mission demonstration',
    exitDemo: 'Exit demo',
    speed: 'Speed',
    lessonEyebrow: 'Orbital classification file',
    previous: 'Previous',
    next: 'Next',
    guideEyebrow: 'Your first orbital-customs shift',
    guideTitle: 'Two scans, one exact bay',
    guide1: 'Check whether the ship matches rule A',
    guide2: 'Then check whether it matches rule B',
    guide3: 'Use 10, 11, 01, or 00 to choose its bay',
    guideDemo: 'Watch the full demo',
    guidePlay: 'Take command',
    winEyebrow: 'Every bay confirmed',
    nextMission: 'Next mission',
    reviewDemo: 'Review this demo',
    yes: 'YES',
    no: 'NO',
    onlyRule: (rule) => `Only “${rule}”`,
    zoneNames: {
      left: 'rule A only',
      both: 'intersection: both rules',
      right: 'rule B only',
      neither: 'neither rule',
    },
    zone3d: {
      left: 'A ONLY · 10',
      both: 'A ∩ B · 11',
      right: 'B ONLY · 01',
      neither: 'OUTSIDE · 00',
    },
    rule3dPrefix: {
      left: 'Rule A',
      right: 'Rule B',
    },
    coachIcons: {
      scan: 'SCAN',
      retry: 'RETRY',
      hint: 'HINT',
      reset: 'RESET',
      auto: 'DEMO',
      clear: 'DONE',
    },
    missionNames: ['Double identity', 'Shape scanner', 'Star cargo', 'Spaceport finale'],
    missionBriefs: [
      'Verify ships by “has antennae” and “three eyes”.',
      'Verify ships by “round body” and “has stripes”.',
      'Verify cargo by “carries crystal” and “has wings”.',
      'Complete the finale with “blue body” and “star badge”.',
    ],
    rules: {
      antenna: 'has antennae',
      threeEyes: 'three eyes',
      round: 'round body',
      striped: 'has stripes',
      crystal: 'carries crystal',
      wings: 'has wings',
      blue: 'blue body',
      star: 'star badge',
    },
    coachReadyTitle: 'Read both scanner rules',
    coachReadyText: 'Answer yes or no twice. The pair points to exactly one bay.',
    coachShipTitle: (index, total) => `Ship ${index} of ${total} awaiting clearance`,
    coachShipText: (left, right) => `Scan complete: A is “${left}”; B is “${right}”.`,
    coachWrongTitle: 'Wrong bay — ship returned safely',
    coachWrongText: (code, zone) => `Its scan code is ${code}, so it belongs in “${zone}”. Try again.`,
    coachCorrectTitle: 'Customs cleared — docking complete',
    coachCorrectText: (zone) => `Both checks agree: ${zone}.`,
    coachHintTitle: 'Match the scan code',
    coachHintText: (code, zone) => `${code} maps to “${zone}”. That platform is now glowing.`,
    coachResetTitle: 'Mission queue reset',
    coachResetText: 'Start with the first ship: read A, then read B.',
    coachDemoStartTitle: 'Automatic control engaged',
    coachDemoStartText: 'Watch two scanner answers lead each ship to one exact bay.',
    coachDemoMoveTitle: (index, total) => `Demo ${index} of ${total}`,
    coachDemoMoveText: (code, zone) => `Scan code ${code}, so the ship docks in “${zone}”.`,
    coachDemoDoneTitle: 'All five ships are docked',
    coachDemoDoneText: 'Four answer pairs cover all four Venn regions.',
    demoPause: 'Pause demo',
    demoPlay: 'Continue demo',
    demoReplay: 'Replay demo',
    lessonSteps: [
      {
        zone: null,
        title: 'Ask two yes-or-no questions',
        text: 'Every ship passes scanner A and scanner B. Only four answer pairs are possible.',
      },
      {
        zone: 'left',
        title: '10: rule A only',
        text: 'A says yes and B says no. The ship goes inside the left circle but outside the overlap.',
      },
      {
        zone: 'both',
        title: '11: both rules means intersection',
        text: 'Two yes answers mean the ship belongs to both sets, so it docks in the overlap.',
      },
      {
        zone: 'neither',
        title: '00: outside is a real region',
        text: 'Two no answers mean the ship belongs to neither set, outside both circles.',
      },
    ],
    winTitles: ['The intersection is online!', 'Classification radar upgraded!', 'All star cargo checked in!', 'Gold orbital controller!'],
    winNotes: [
      'The place that satisfies both rules is the intersection.',
      'A ship may belong to one set or to both sets at once.',
      'When neither rule fits, the correct bay is outside both circles.',
      'You can now classify every ship with two conditions.',
    ],
    winStats: (mistakes) => `5 ships · ${mistakes} misclassifications`,
    again: 'Start over',
    musicOn: 'Turn background music on',
    musicOff: 'Turn background music off',
    soundOn: 'Turn sound effects on',
    soundOff: 'Turn sound effects off',
    switchTheme: 'Switch light or dark theme',
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionSeconds = (seconds) => reducedMotion ? 0.015 : seconds;
const motionMs = (milliseconds) => reducedMotion ? 20 : milliseconds;
const store = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { /* no-op */ }
  },
};

let lang = window.cool?.preferences?.lang
  || store.get('kidslab.lang')
  || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
if (!I18N[lang]) lang = 'zh';
let theme = window.cool?.preferences?.theme
  || store.get('kidslab.theme')
  || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
if (!['light', 'dark'].includes(theme)) theme = 'light';

const t = () => I18N[lang];
const audio = createAudio();
const solutions = LEVELS.map((level) => missionSolution(level));
let game = null;
let levelIndex = 0;
let shipIndex = 0;
let mistakes = 0;
let locked = false;
let mode = 'play';
let activeHint = null;
let hintTimer = 0;
let lessonIndex = 0;
let demoIndex = 0;
let demoPlaying = false;
let demoToken = 0;
let demoSnapshot = null;

const level = () => LEVELS[levelIndex];
const ship = () => level().ships[Math.min(shipIndex, level().ships.length - 1)];
const ruleName = (key) => t().rules[key];
const zoneName = (zone) => t().zoneNames[zone];

function setCoach(title, text, icon = 'scan', tone = '') {
  $('#coachTitle').textContent = title;
  $('#coachText').textContent = text;
  const key = String(icon).toLowerCase();
  const iconLabel = t().coachIcons?.[key] || icon;
  $('#coachIcon').textContent = iconLabel;
  $('#coach').classList.toggle('is-alert', tone === 'alert');
  $('#coach').classList.toggle('is-success', tone === 'success');
}

function track(name, data) {
  window.cool?.track?.(name, data);
}

function updateAudioButtons() {
  $('#musicBtn').textContent = audio.musicOn ? '♫' : '♪';
  $('#musicBtn').setAttribute('aria-pressed', String(audio.musicOn));
  $('#musicBtn').setAttribute('aria-label', audio.musicOn ? t().musicOff : t().musicOn);
  $('#soundBtn').textContent = audio.sfxOn ? '🔊' : '🔇';
  $('#soundBtn').setAttribute('aria-pressed', String(audio.sfxOn));
  $('#soundBtn').setAttribute('aria-label', audio.sfxOn ? t().soundOff : t().soundOn);
}

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  $('#themeBtn').textContent = theme === 'light' ? '☾' : '☀';
  $('#themeBtn').setAttribute('aria-label', t().switchTheme);
  game?.applyTheme();
}

function applyLanguage() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t().doc;
  $$('[data-t]').forEach((node) => {
    const value = t()[node.dataset.t];
    if (typeof value === 'string') node.textContent = value;
  });
  $('#langBtn').textContent = lang === 'zh' ? 'EN' : '中';
  updateAudioButtons();
  game?.setZoneLabels(t().zone3d);
  const [leftRule, rightRule] = level().rules;
  game?.setRules(
    `${t().rule3dPrefix.left} · ${ruleName(leftRule)}`,
    `${t().rule3dPrefix.right} · ${ruleName(rightRule)}`,
  );
  updateMissionUi();
  if (mode === 'lesson') renderLesson();
  if (mode === 'demo') updateDemoUi();
  if (mode === 'win') updateWinUi();
}

function updateMissionTabs() {
  $$('#missionTabs button').forEach((button, index) => {
    button.classList.toggle('is-on', index === levelIndex);
    button.setAttribute('aria-pressed', String(index === levelIndex));
    button.setAttribute('aria-label', `${index + 1}. ${t().missionNames[index]}`);
  });
}

function updateScanner(item) {
  const checks = checksFor(level(), item);
  const code = truthCode(level(), item);
  const [leftRule, rightRule] = level().rules;
  $('#leftRule').textContent = ruleName(leftRule);
  $('#rightRule').textContent = ruleName(rightRule);
  $('#leftAnswer').textContent = checks.left ? t().yes : t().no;
  $('#rightAnswer').textContent = checks.right ? t().yes : t().no;
  $('#leftScan').classList.toggle('is-yes', checks.left);
  $('#leftScan').classList.toggle('is-no', !checks.left);
  $('#rightScan').classList.toggle('is-yes', checks.right);
  $('#rightScan').classList.toggle('is-no', !checks.right);
  $('#signalValue').textContent = code;
  $('#leftZoneLabel').textContent = t().onlyRule(ruleName(leftRule));
  $('#rightZoneLabel').textContent = t().onlyRule(ruleName(rightRule));
  game?.setRules(
    `${t().rule3dPrefix.left} · ${ruleName(leftRule)}`,
    `${t().rule3dPrefix.right} · ${ruleName(rightRule)}`,
  );
  game?.setZoneLabels(t().zone3d);
}

function updateHud(value = shipIndex) {
  $('#missionBadge').textContent = `${String(levelIndex + 1).padStart(2, '0')} · ${t().missionNames[levelIndex]}`;
  $('#dockValue').textContent = `${value} / ${level().ships.length}`;
}

function clearHint() {
  clearTimeout(hintTimer);
  activeHint = null;
  game?.setHint(null);
  $$('#zoneGrid button').forEach((button) => button.classList.remove('is-hint'));
}

function refreshControls() {
  const unavailable = mode !== 'play' || locked;
  $$('#zoneGrid button').forEach((button) => { button.disabled = unavailable; });
  $$('#missionTabs button').forEach((button) => { button.disabled = locked || mode !== 'play'; });
  $('#hintBtn').disabled = unavailable;
  $('#resetBtn').disabled = unavailable;
  $('#lessonBtn').disabled = locked || mode !== 'play';
  $('#demoBtn').disabled = locked || mode !== 'play';
  game?.setInteractive(mode === 'play' && !locked);
  document.body.dataset.mode = mode;
}

function presentShip({ animate = true, announce = true } = {}) {
  const item = ship();
  updateScanner(item);
  updateHud();
  game?.setShip(item, { animate });
  if (announce) {
    const checks = checksFor(level(), item);
    setCoach(
      t().coachShipTitle(shipIndex + 1, level().ships.length),
      t().coachShipText(checks.left ? t().yes : t().no, checks.right ? t().yes : t().no),
    );
  }
  audio.scan();
  updateMissionTabs();
  refreshControls();
}

function updateMissionUi() {
  updateMissionTabs();
  updateHud(mode === 'demo' ? demoIndex : shipIndex);
  if (mode === 'demo') {
    const item = level().ships[Math.min(demoIndex, level().ships.length - 1)];
    updateScanner(item);
    return;
  }
  if (mode === 'win') {
    updateWinUi();
    return;
  }
  presentShip({ animate: false, announce: false });
}

async function chooseZone(zone) {
  if (mode !== 'play' || locked) return;
  audio.unlock();
  audio.grab();
  clearHint();
  locked = true;
  refreshControls();
  const item = ship();
  const expected = expectedZone(level(), item);
  const code = truthCode(level(), item);
  if (zone !== expected) {
    mistakes += 1;
    audio.invalid();
    setCoach(
      t().coachWrongTitle,
      t().coachWrongText(code, zoneName(expected)),
      'RETRY',
      'alert',
    );
    track('wrong_bay', { level: levelIndex + 1, ship: item.id, chosen: zone, expected });
    await game?.flyToZone(zone, { correct: false, duration: motionSeconds(0.72) });
    locked = false;
    refreshControls();
    return;
  }

  audio.dock();
  setCoach(
    t().coachCorrectTitle,
    t().coachCorrectText(zoneName(expected)),
    code,
    'success',
  );
  track('ship_landed', { level: levelIndex + 1, ship: item.id, zone });
  await game?.flyToZone(zone, { correct: true, duration: motionSeconds(0.68) });
  shipIndex += 1;
  updateHud();
  if (shipIndex >= level().ships.length) {
    finishLevel();
    return;
  }
  locked = false;
  presentShip();
}

function requestHint() {
  if (mode !== 'play' || locked) return;
  audio.unlock();
  audio.hint();
  clearHint();
  const expected = expectedZone(level(), ship());
  const code = truthCode(level(), ship());
  activeHint = expected;
  game?.setHint(expected);
  const button = $(`#zoneGrid [data-zone="${expected}"]`);
  button?.classList.add('is-hint');
  setCoach(t().coachHintTitle, t().coachHintText(code, zoneName(expected)), 'HINT');
  track('hint_used', { level: levelIndex + 1, ship: ship().id, zone: expected });
  hintTimer = setTimeout(() => {
    if (mode === 'play' && !locked) clearHint();
  }, 6500);
}

function launchConfetti() {
  const layer = $('#confettiLayer');
  layer.replaceChildren();
  const colors = ['#45d9d3', '#e86f61', '#f0bd5c', '#6ad7a9', '#dff8ef'];
  for (let index = 0; index < 48; index += 1) {
    const piece = document.createElement('i');
    piece.className = 'confetti';
    piece.style.left = `${(index * 41) % 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDuration = `${1.8 + (index % 8) * 0.14}s`;
    piece.style.animationDelay = `${(index % 7) * 0.05}s`;
    piece.style.setProperty('--drift', `${((index * 59) % 180) - 90}px`);
    layer.appendChild(piece);
  }
  setTimeout(() => layer.replaceChildren(), 4200);
}

function updateWinUi() {
  $('#winTitle').textContent = t().winTitles[levelIndex];
  $('#winStats').textContent = t().winStats(mistakes);
  $('#winNote').textContent = t().winNotes[levelIndex];
  $('#winNextBtn').textContent = levelIndex === LEVELS.length - 1 ? t().again : t().nextMission;
}

function finishLevel() {
  locked = true;
  mode = 'win';
  refreshControls();
  updateWinUi();
  game?.celebrate();
  audio.win();
  launchConfetti();
  setCoach(t().winTitles[levelIndex], t().winNotes[levelIndex], 'CLEAR', 'success');
  window.cool?.stage?.(`venn_level_${levelIndex + 1}`);
  if (levelIndex === LEVELS.length - 1) window.cool?.complete?.();
  track('complete_mission', { level: levelIndex + 1, mistakes });
  setTimeout(() => { $('#win').hidden = false; }, motionMs(480));
}

function startLevel(index, { announce = true } = {}) {
  demoToken += 1;
  demoPlaying = false;
  clearHint();
  levelIndex = Math.max(0, Math.min(LEVELS.length - 1, Number(index) || 0));
  shipIndex = 0;
  mistakes = 0;
  locked = false;
  mode = 'play';
  $('#win').hidden = true;
  $('#demoBar').hidden = true;
  $('#lessonCard').hidden = true;
  document.body.classList.remove('is-demo', 'is-lesson');
  updateMissionTabs();
  presentShip({ animate: true, announce });
  if (announce) {
    setCoach(t().coachReadyTitle, t().missionBriefs[levelIndex], 'SCAN');
  }
  window.cool?.stage?.(`venn_level_${levelIndex + 1}_started`);
}

function nextLevel() {
  startLevel(levelIndex === LEVELS.length - 1 ? 0 : levelIndex + 1);
}

function demoItemAt(index) {
  return level().ships[Math.min(index, level().ships.length - 1)];
}

function showDemoPosition(index) {
  const total = level().ships.length;
  demoIndex = Math.max(0, Math.min(total, Number(index) || 0));
  const itemIndex = demoIndex === total ? total - 1 : demoIndex;
  const item = level().ships[itemIndex];
  updateScanner(item);
  game?.setShip(item, { animate: false });
  if (demoIndex > 0) {
    const landedIndex = demoIndex === total ? total - 1 : demoIndex - 1;
    const landedItem = level().ships[landedIndex];
    updateScanner(landedItem);
    game?.setShip(landedItem, { animate: false });
    game?.flyToZone(solutions[levelIndex][landedIndex], { correct: true, duration: 0 });
  }
  updateDemoUi();
}

function updateDemoUi() {
  const total = level().ships.length;
  $('#demoCount').textContent = `${demoIndex} / ${total}`;
  $('#demoRange').max = String(total);
  $('#demoRange').value = String(demoIndex);
  $('#dockValue').textContent = `${demoIndex} / ${total}`;
  $('#demoPrevBtn').disabled = demoIndex <= 0;
  $('#demoNextBtn').disabled = demoIndex >= total;
  const replay = demoIndex >= total && !demoPlaying;
  $('#demoPlayBtn').textContent = replay ? '↻' : demoPlaying ? 'Ⅱ' : '▶';
  $('#demoPlayBtn').setAttribute(
    'aria-label',
    replay ? t().demoReplay : demoPlaying ? t().demoPause : t().demoPlay,
  );
  $('#demoPlayBtn').setAttribute('aria-pressed', String(demoPlaying));
}

function pauseDemo() {
  demoPlaying = false;
  demoToken += 1;
  updateDemoUi();
}

async function playDemo() {
  if (mode !== 'demo') return;
  const total = level().ships.length;
  if (demoIndex >= total) showDemoPosition(0);
  demoPlaying = true;
  const token = ++demoToken;
  updateDemoUi();

  while (mode === 'demo' && demoPlaying && token === demoToken && demoIndex < total) {
    const index = demoIndex;
    const item = level().ships[index];
    const zone = solutions[levelIndex][index];
    const code = truthCode(level(), item);
    const speed = Number($('#demoSpeed').value) || 1;
    game?.setShip(item, { animate: index > 0 });
    updateScanner(item);
    setCoach(
      t().coachDemoMoveTitle(index + 1, total),
      t().coachDemoMoveText(code, zoneName(zone)),
      code,
    );
    audio.scan();
    await sleep(motionMs(330 / speed));
    if (token !== demoToken || !demoPlaying) break;
    game?.setHint(zone);
    await game?.flyToZone(zone, { correct: true, duration: motionSeconds(0.62 / speed) });
    if (token !== demoToken || !demoPlaying) break;
    audio.dock();
    game?.setHint(null);
    demoIndex += 1;
    updateDemoUi();
    await sleep(motionMs(150 / speed));
  }

  if (mode === 'demo' && demoIndex >= total && token === demoToken) {
    demoPlaying = false;
    game?.celebrate();
    audio.win();
    setCoach(t().coachDemoDoneTitle, t().coachDemoDoneText, 'CLEAR', 'success');
  }
  updateDemoUi();
}

function jumpDemo(index) {
  if (mode !== 'demo') return;
  pauseDemo();
  showDemoPosition(index);
  if (demoIndex === 0) {
    setCoach(t().coachDemoStartTitle, t().coachDemoStartText, 'AUTO');
  } else {
    const landedIndex = Math.min(demoIndex - 1, level().ships.length - 1);
    const item = level().ships[landedIndex];
    const zone = solutions[levelIndex][landedIndex];
    setCoach(
      t().coachDemoMoveTitle(demoIndex, level().ships.length),
      t().coachDemoMoveText(truthCode(level(), item), zoneName(zone)),
      truthCode(level(), item),
    );
  }
}

function startDemo() {
  audio.unlock();
  $('#guide').hidden = true;
  $('#win').hidden = true;
  clearHint();
  demoSnapshot = { shipIndex, mistakes, previousMode: mode };
  mode = 'demo';
  locked = true;
  demoIndex = 0;
  demoPlaying = false;
  document.body.classList.add('is-demo');
  document.body.classList.remove('is-lesson');
  $('#demoBar').hidden = false;
  game?.setInteractive(false);
  setCoach(t().coachDemoStartTitle, t().coachDemoStartText, 'AUTO');
  showDemoPosition(0);
  refreshControls();
  playDemo();
  track('watch_demo', { level: levelIndex + 1 });
}

function exitDemo() {
  if (mode !== 'demo') return;
  pauseDemo();
  const snapshot = demoSnapshot;
  shipIndex = snapshot?.shipIndex ?? shipIndex;
  mistakes = snapshot?.mistakes ?? mistakes;
  demoSnapshot = null;
  $('#demoBar').hidden = true;
  document.body.classList.remove('is-demo');
  if (snapshot?.previousMode === 'win') {
    mode = 'win';
    locked = true;
    const lastIndex = level().ships.length - 1;
    const item = level().ships[lastIndex];
    updateScanner(item);
    updateHud(level().ships.length);
    game?.setShip(item, { animate: false });
    game?.flyToZone(solutions[levelIndex][lastIndex], { correct: true, duration: 0 });
    updateWinUi();
    $('#win').hidden = false;
    refreshControls();
    return;
  }
  mode = 'play';
  locked = false;
  presentShip({ animate: false });
}

function renderLesson() {
  const steps = t().lessonSteps;
  const step = steps[lessonIndex];
  $('#lessonCount').textContent = `${lessonIndex + 1} / ${steps.length}`;
  $('#lessonTitle').textContent = step.title;
  $('#lessonText').textContent = step.text;
  $('#lessonPrevBtn').disabled = lessonIndex === 0;
  $('#lessonNextBtn').textContent = lessonIndex === steps.length - 1 ? t().guidePlay : t().next;
  game?.setHint(step.zone);
}

function openLesson() {
  if (mode !== 'play' || locked) return;
  audio.unlock();
  mode = 'lesson';
  lessonIndex = 0;
  $('#lessonCard').hidden = false;
  document.body.classList.add('is-lesson');
  game?.setInteractive(false);
  renderLesson();
  refreshControls();
  track('open_lesson');
}

function closeLesson(announce = true) {
  if (mode !== 'lesson') return;
  mode = 'play';
  $('#lessonCard').hidden = true;
  document.body.classList.remove('is-lesson');
  game?.setHint(activeHint);
  if (announce) setCoach(t().coachReadyTitle, t().coachReadyText, 'SCAN');
  refreshControls();
}

function bindUi() {
  $('#themeBtn').addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set('kidslab.theme', theme);
    applyTheme();
  });
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    store.set('kidslab.lang', lang);
    applyLanguage();
  });
  $('#musicBtn').addEventListener('click', async () => {
    await audio.unlock();
    audio.setMusic(!audio.musicOn);
    updateAudioButtons();
  });
  $('#soundBtn').addEventListener('click', async () => {
    await audio.unlock();
    audio.setSfx(!audio.sfxOn);
    updateAudioButtons();
  });

  $('#missionTabs').addEventListener('click', (event) => {
    const button = event.target.closest('[data-level]');
    if (!button || button.disabled) return;
    audio.unlock();
    startLevel(Number(button.dataset.level));
  });
  $('#zoneGrid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-zone]');
    if (!button || button.disabled) return;
    chooseZone(button.dataset.zone);
  });
  $('#hintBtn').addEventListener('click', requestHint);
  $('#resetBtn').addEventListener('click', () => {
    audio.unlock();
    startLevel(levelIndex, { announce: false });
    setCoach(t().coachResetTitle, t().coachResetText, 'RESET');
    track('reset_mission', { level: levelIndex + 1 });
  });
  $('#lessonBtn').addEventListener('click', openLesson);
  $('#demoBtn').addEventListener('click', startDemo);

  $('#demoPlayBtn').addEventListener('click', () => {
    audio.unlock();
    if (demoPlaying) pauseDemo();
    else playDemo();
  });
  $('#demoPrevBtn').addEventListener('click', () => jumpDemo(demoIndex - 1));
  $('#demoNextBtn').addEventListener('click', () => jumpDemo(demoIndex + 1));
  $('#demoExitBtn').addEventListener('click', exitDemo);
  $('#demoRange').addEventListener('input', (event) => jumpDemo(Number(event.target.value)));

  $('#lessonPrevBtn').addEventListener('click', () => {
    lessonIndex = Math.max(0, lessonIndex - 1);
    renderLesson();
  });
  $('#lessonNextBtn').addEventListener('click', () => {
    if (lessonIndex >= t().lessonSteps.length - 1) closeLesson();
    else {
      lessonIndex += 1;
      renderLesson();
    }
  });
  $('#lessonExitBtn').addEventListener('click', () => closeLesson(false));

  $('#guideDemoBtn').addEventListener('click', () => {
    store.set('kidslab.venn-port.guided', '1');
    $('#guide').hidden = true;
    startDemo();
  });
  $('#guidePlayBtn').addEventListener('click', () => {
    store.set('kidslab.venn-port.guided', '1');
    $('#guide').hidden = true;
    setCoach(t().coachReadyTitle, t().coachReadyText, 'SCAN');
    audio.unlock();
  });

  $('#winNextBtn').addEventListener('click', nextLevel);
  $('#winDemoBtn').addEventListener('click', startDemo);
  $('#panelHandle').addEventListener('click', () => {
    const collapsed = $('#panel').classList.toggle('is-collapsed');
    $('#panelHandle').setAttribute('aria-expanded', String(!collapsed));
  });

  addEventListener('keydown', (event) => {
    if (event.target.matches('input, select, button, a')) return;
    const zones = { '1': 'left', '2': 'both', '3': 'right', '4': 'neither' };
    if (zones[event.key]) chooseZone(zones[event.key]);
  });
}

function init() {
  bindUi();
  game = createPort3D({
    canvas: $('#scene'),
    cssVar,
    onZoneRequest: chooseZone,
    onInteract: () => audio.unlock(),
  });
  if (!game) {
    $('#nogl').hidden = false;
    return;
  }
  applyTheme();
  applyLanguage();
  startLevel(0, { announce: false });
  setCoach(t().coachReadyTitle, t().coachReadyText, 'SCAN');
  updateAudioButtons();
  if (!store.get('kidslab.venn-port.guided')) {
    setTimeout(() => { $('#guide').hidden = false; }, 520);
  }
}

init();
