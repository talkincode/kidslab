import {
  createLab,
  energyBalance,
  fillWater,
  harvest,
  loopStage,
  resetLab,
  restoreLab,
  setDoor,
  setPower,
  setPowerLevel,
  snapshot,
  stepLab,
} from './ice-model.js';
import { createLabAudio } from './audio.js';
import { createIceScene } from './scene3d.js';

const I18N = {
  zh: {
    doc: '制冰实验室 · KidsLab',
    back: '返回平台',
    title: '制冰实验室',
    nogl: '这台设备暂时不能显示 3D 制冰机，请换用支持 WebGL 的浏览器。',
    moldTemp: '冰格温度',
    iceProgress: '结冰',
    roomHeat: '搬到房间的热',
    cubes: '冰块',
    fill: '灌水',
    power: '开压缩机',
    powerStop: '关压缩机',
    door: '打开箱门',
    doorClose: '关上箱门',
    harvest: '取冰',
    panelTitle: '观测台',
    speed: '压缩机快慢',
    slow: '慢',
    mid: '中',
    fast: '快',
    loopTitle: '冷媒四步旅行',
    stepComp: '① 压缩机',
    stepCompD: '加压变热',
    stepCond: '② 冷凝器',
    stepCondD: '向房间放热',
    stepExp: '③ 节流阀',
    stepExpD: '降压变冷',
    stepEvap: '④ 蒸发器',
    stepEvapD: '吸走水的热',
    foundTitle: '热被搬走了，不是消失了',
    foundText: '冰格变冷结冰时，机器侧面的散热管会变热。水里的热加上压缩机做的功，都去了房间。',
    hint: '给我一点提示',
    reset: '重新实验',
    hintText: '先灌水，关好门，开压缩机。盯着冰格温度往 0°C 掉；结冰还要再等一会儿，因为化成冰还得继续吸热。',
    modelNote: '教学示意：时间已加快，读数不是真实冰箱的精确值。',
    footTip: '拖空白转视角 · 滚轮缩放 · 点部件看它在干什么',
    viewStage: '整机',
    viewLoop: '回路',
    viewCond: '散热',
    soundOn: '关闭声音',
    soundOff: '打开声音',
    theme: '切换主题',
    coachIdle: '先灌水，再开压缩机',
    coachHint: '热不会消失，只是被搬走。',
    filled: '模盒灌满清水了。关好门，打开压缩机开始搬热。',
    alreadyFilled: '模盒里已经有水了。',
    needWater: '模盒是空的——先灌水再制冷。',
    compressorOn: '压缩机嗡嗡转起来。看蒸发器变冷，散热管变热。',
    compressorOff: '压缩机停下了，冷媒不再搬热。',
    doorOpened: '门开了：暖空气溜进来，结冰会变慢。',
    doorShut: '门关好了，冷气留在里面。',
    freezeStart: '到 0°C 了。结冰还要继续吸走“潜热”，进度不会一下子满。',
    iceReady: '冰块冻实了。热已经在房间那边，可以取冰。',
    harvested: '收获 6 块冰。空模盒可以再灌水。',
    harvestEmpty: '还没冻好，不能取冰。',
    resetDone: '实验已清空。再灌一次水看看热去哪。',
    pinMolds: '冰格：水在这里降温、结冰。',
    pinEvap: '蒸发器：低压冷媒在这里吸热汽化，把水的热带走。',
    pinComp: '压缩机：给冷媒加压升温，才能把热“抬”到比房间还热。',
    pinCond: '冷凝器：热从这里甩进房间，所以侧面会发烫。',
    pinExp: '节流阀：高压液体突然降压变冷，准备去吸热。',
  },
  en: {
    doc: 'Ice Maker Lab · KidsLab',
    back: 'Back to platform',
    title: 'Ice Maker Lab',
    nogl: 'This device cannot show the 3D ice maker. Try a browser with WebGL.',
    moldTemp: 'Tray temp',
    iceProgress: 'Ice',
    roomHeat: 'Heat to room',
    cubes: 'Cubes',
    fill: 'Fill water',
    power: 'Start compressor',
    powerStop: 'Stop compressor',
    door: 'Open door',
    doorClose: 'Close door',
    harvest: 'Harvest',
    panelTitle: 'Observation deck',
    speed: 'Compressor speed',
    slow: 'Slow',
    mid: 'Mid',
    fast: 'Fast',
    loopTitle: 'Four-stop refrigerant trip',
    stepComp: '① Compressor',
    stepCompD: 'Pressurize & heat',
    stepCond: '② Condenser',
    stepCondD: 'Dump heat to room',
    stepExp: '③ Expansion',
    stepExpD: 'Drop pressure',
    stepEvap: '④ Evaporator',
    stepEvapD: 'Steal heat from water',
    foundTitle: 'Heat was moved, not deleted',
    foundText: 'While the tray freezes, the side coils get warm. Heat from the water plus compressor work both leave into the room.',
    hint: 'Give me a hint',
    reset: 'Restart experiment',
    hintText: 'Fill water, keep the door shut, start the compressor. Watch the tray fall toward 0°C; freezing still takes time because ice needs extra heat removed.',
    modelNote: 'Teaching model: time is sped up. Readings are not a real fridge.',
    footTip: 'Drag empty space to orbit · scroll to zoom · tap a part to read it',
    viewStage: 'Whole',
    viewLoop: 'Loop',
    viewCond: 'Heat out',
    soundOn: 'Mute sound',
    soundOff: 'Turn sound on',
    theme: 'Toggle theme',
    coachIdle: 'Fill water, then start the compressor',
    coachHint: 'Heat does not vanish — it is moved.',
    filled: 'Molds are full. Shut the door and start the compressor to move heat.',
    alreadyFilled: 'The molds already have water.',
    needWater: 'Molds are empty — fill water first.',
    compressorOn: 'Compressor humming. Watch the evaporator cool and the condenser warm.',
    compressorOff: 'Compressor stopped. Heat moving pauses.',
    doorOpened: 'Door open: warm air sneaks in and freezing slows.',
    doorShut: 'Door closed. Cold stays inside.',
    freezeStart: 'At 0°C. Freezing still needs latent heat, so the bar fills slowly.',
    iceReady: 'Ice is solid. That heat is already on the room side — harvest when ready.',
    harvested: 'Harvested 6 cubes. Refill the empty tray to go again.',
    harvestEmpty: 'Not frozen enough to harvest.',
    resetDone: 'Experiment cleared. Fill again and watch where the heat goes.',
    pinMolds: 'Ice tray: water cools and freezes here.',
    pinEvap: 'Evaporator: low-pressure refrigerant boils here and steals heat from the water.',
    pinComp: 'Compressor: it squeezes refrigerant so heat can be lifted above room temperature.',
    pinCond: 'Condenser: heat leaves into the room here, so the side feels warm.',
    pinExp: 'Expansion valve: high-pressure liquid suddenly drops pressure and gets cold.',
  },
};

const $ = (sel) => document.querySelector(sel);
const STORE = 'kidslab.ice-maker-lab';
const SOUND = 'kidslab.ice-maker-lab.sound';
const els = {
  mold: $('#moldReading'),
  ice: $('#iceReading'),
  room: $('#roomReading'),
  cubes: $('#cubeReading'),
  coachTitle: $('#coachTitle'),
  feedback: $('#feedback'),
  fill: $('#fillBtn'),
  power: $('#powerBtn'),
  door: $('#doorBtn'),
  harvest: $('#harvestBtn'),
  panel: $('#panel'),
  panelBody: $('#panelBody'),
  panelHandle: $('#panelHandle'),
  panelArrow: $('#panelArrow'),
  found: $('#foundCard'),
  hint: $('#hintText'),
  hintBtn: $('#hintBtn'),
  sound: $('#soundBtn'),
};

let lang = window.cool?.preferences?.lang
  || (document.documentElement.lang?.startsWith('zh') ? 'zh' : 'en');
let lab = restoreLab(load()) || createLab();
let muted = localStorage.getItem(SOUND) === 'off';
let panelOpen = true;
let notice = 'coachHint';
let titleKey = 'coachIdle';
let highlight = '';
let firstComplete = false;
let seenFreeze = false;
let seenReady = false;
const audio = createLabAudio({ bgmUrl: new URL('./audio/bgm-ice-lab.ogg', import.meta.url), muted });
const lab3d = createIceScene($('#scene'));
if (!lab3d) $('#nogl')?.removeAttribute('hidden');
document.addEventListener('pointerdown', () => { if (!muted) audio.unlock(); }, { once: true });
lab3d?.setPickHandler((name) => {
  highlight = name;
  titleKey = 'coachIdle';
  notice = ({
    molds: 'pinMolds', evap: 'pinEvap', comp: 'pinComp', cond: 'pinCond', exp: 'pinExp',
  })[name] || 'coachHint';
  audio.beep('tap');
  window.cool?.track?.(`inspect-${name}`);
  render();
});

const t = (key) => I18N[lang]?.[key] || I18N.zh[key] || key;

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE));
  } catch {
    return null;
  }
}

function save() {
  try { localStorage.setItem(STORE, JSON.stringify(snapshot(lab))); } catch { /* privacy */ }
}

function applyPanel() {
  els.panel.classList.toggle('is-collapsed', !panelOpen);
  els.panelBody.hidden = !panelOpen;
  els.panelHandle.setAttribute('aria-expanded', String(panelOpen));
  els.panelArrow.textContent = panelOpen ? '▾' : '▸';
}

function apply(result, okNotice, failMap = {}) {
  if (!result.ok) {
    notice = failMap[result.reason] || 'coachHint';
    audio.beep('bad');
    render();
    return false;
  }
  lab = result.lab;
  notice = okNotice;
  save();
  render();
  return true;
}

function render() {
  document.title = t('doc');
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-t]').forEach((node) => { node.textContent = t(node.dataset.t); });
  els.sound.textContent = muted ? '🔇' : '🔊';
  els.sound.setAttribute('aria-pressed', String(muted));
  els.sound.setAttribute('aria-label', t(muted ? 'soundOff' : 'soundOn'));
  $('#themeBtn').setAttribute('aria-label', t('theme'));
  $('#langBtn').textContent = lang === 'zh' ? 'EN' : '中';
  $('#themeBtn').textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';

  els.coachTitle.textContent = t(titleKey);
  els.feedback.textContent = t(notice);
  els.power.classList.toggle('is-on', lab.power);
  els.power.setAttribute('aria-pressed', String(lab.power));
  els.power.innerHTML = lab.power ? `⏻ <span>${t('powerStop')}</span>` : `⏻ <span>${t('power')}</span>`;
  els.door.setAttribute('aria-pressed', String(lab.doorOpen));
  els.door.innerHTML = lab.doorOpen ? `🚪 <span>${t('doorClose')}</span>` : `🚪 <span>${t('door')}</span>`;
  document.querySelectorAll('[data-speed]').forEach((button) => {
    button.classList.toggle('is-on', Number(button.dataset.speed) === lab.powerLevel);
  });
  renderLive();
}

function renderLive() {
  els.mold.textContent = `${lab.moldTempC.toFixed(1)} °C`;
  els.ice.textContent = `${Math.round(lab.iceFraction * 100)}%`;
  els.room.textContent = `${(energyBalance(lab).heatToRoomJ / 1000).toFixed(1)} kJ`;
  els.cubes.textContent = String(lab.harvestedCubes);
  els.harvest.disabled = lab.iceFraction < 0.98 || !lab.filled;
  els.coachTitle.textContent = t(titleKey);
  els.feedback.textContent = t(notice);
  const stage = loopStage(lab);
  document.querySelectorAll('#loopSteps li').forEach((node) => {
    const step = node.dataset.step;
    const live = lab.power && step === stage;
    node.classList.toggle('is-hot', live && (step === 'comp' || step === 'cond'));
    node.classList.toggle('is-cold', live && (step === 'exp' || step === 'evap'));
  });
  els.found.hidden = energyBalance(lab).heatToRoomJ < 8000 && lab.harvestedCubes === 0;
  lab3d?.setState({
    filled: lab.filled,
    power: lab.power,
    doorOpen: lab.doorOpen,
    iceFraction: lab.iceFraction,
    moldTempC: lab.moldTempC,
    loopStage: stage,
    highlight,
  });
  audio.setHum(lab.power && !muted, lab.powerLevel);
}

els.panelHandle.addEventListener('click', () => { panelOpen = !panelOpen; applyPanel(); });
els.fill.addEventListener('click', () => {
  titleKey = 'coachIdle';
  if (apply(fillWater(lab), 'filled', { 'already-filled': 'alreadyFilled' })) {
    audio.beep('fill');
    window.cool?.track?.('fill-water');
    window.cool?.stage?.('level2');
  }
});
els.power.addEventListener('click', () => {
  const on = !lab.power;
  titleKey = 'coachIdle';
  if (apply(setPower(lab, on), on ? 'compressorOn' : 'compressorOff', { 'need-water': 'needWater' })) {
    audio.beep(on ? 'power' : 'tap');
    window.cool?.track?.(on ? 'compressor-on' : 'compressor-off');
  }
});
els.door.addEventListener('click', () => {
  const open = !lab.doorOpen;
  titleKey = 'coachIdle';
  apply(setDoor(lab, open), open ? 'doorOpened' : 'doorShut');
  audio.beep('tap');
  window.cool?.track?.(open ? 'door-open' : 'door-close');
});
els.harvest.addEventListener('click', () => {
  titleKey = 'coachIdle';
  if (apply(harvest(lab), 'harvested', { 'not-frozen': 'harvestEmpty' })) {
    seenFreeze = false;
    seenReady = false;
    audio.beep('harvest');
    window.cool?.track?.('harvest-ice');
    if (!firstComplete) {
      firstComplete = true;
      window.cool?.complete?.();
      audio.beep('win');
    }
  }
});
document.querySelectorAll('[data-speed]').forEach((button) => {
  button.addEventListener('click', () => {
    apply(setPowerLevel(lab, Number(button.dataset.speed)), notice);
    audio.beep('tap');
  });
});
document.querySelectorAll('#loopSteps li').forEach((node) => {
  node.addEventListener('click', () => {
    const map = { comp: 'pinComp', cond: 'pinCond', exp: 'pinExp', evap: 'pinEvap' };
    highlight = node.dataset.step === 'comp' ? 'comp' : node.dataset.step === 'cond' ? 'cond' : node.dataset.step === 'exp' ? 'exp' : 'evap';
    notice = map[node.dataset.step];
    audio.beep('tap');
    render();
  });
});
document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-view]').forEach((item) => {
      const on = item === button;
      item.classList.toggle('is-on', on);
      item.setAttribute('aria-pressed', String(on));
    });
    lab3d?.setView(button.dataset.view);
    audio.beep('tap');
  });
});
$('#resetBtn').addEventListener('click', () => {
  lab = resetLab(lab).lab;
  highlight = '';
  firstComplete = false;
  seenFreeze = false;
  seenReady = false;
  titleKey = 'coachIdle';
  notice = 'resetDone';
  try {
    localStorage.removeItem(STORE);
    localStorage.removeItem('kidslab.progress.ice-maker-lab');
  } catch { /* privacy */ }
  audio.beep('tap');
  audio.setHum(false);
  render();
});
els.hintBtn.addEventListener('click', () => {
  const show = els.hint.hidden;
  els.hint.hidden = !show;
  els.hintBtn.setAttribute('aria-expanded', String(show));
  audio.beep('tap');
});
els.sound.addEventListener('click', () => {
  muted = !muted;
  audio.setMuted(muted);
  if (!muted) audio.unlock();
  try { localStorage.setItem(SOUND, muted ? 'off' : 'on'); } catch { /* privacy */ }
  render();
});
$('#langBtn').addEventListener('click', () => window.cool?.preferences?.setLang?.(lang === 'zh' ? 'en' : 'zh'));
$('#themeBtn').addEventListener('click', () => window.cool?.preferences?.toggleTheme?.());
addEventListener('langchange', (event) => {
  lang = event.detail?.lang || window.cool?.preferences?.lang || lang;
  render();
});
addEventListener('themechange', () => { lab3d?.applyTheme?.(); render(); });

let last = performance.now();
function tick(now) {
  let elapsed = Math.min(0.5, (now - last) / 1000);
  last = now;
  if ((lab.power || lab.filled) && elapsed > 0) {
    while (elapsed > 1e-6) {
      const slice = Math.min(1 / 30, elapsed);
      const result = stepLab(lab, slice);
      if (!result.ok) break;
      lab = result.lab;
      for (const event of result.events) {
        if (event.type === 'freeze-start' && !seenFreeze) {
          seenFreeze = true;
          notice = 'freezeStart';
          audio.beep('freeze');
        }
        if (event.type === 'ice-ready' && !seenReady) {
          seenReady = true;
          notice = 'iceReady';
          audio.beep('good');
          window.cool?.track?.('ice-ready');
        }
      }
      elapsed -= slice;
    }
    renderLive();
  }
  requestAnimationFrame(tick);
}

applyPanel();
render();
requestAnimationFrame(tick);
