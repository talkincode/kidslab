import {
  NOZZLES,
  STATIONS,
  TRACK_LENGTH,
  balloonMass,
  createGarage,
  dipCup,
  judgeBalance,
  launchRocket,
  popBalloon,
  pumpRocket,
  resetStation,
  setNozzle,
} from './air-model.js';

const SAVE_KEY = 'kidslab.air-garage';
const SOUND_KEY = 'kidslab.sound.muted';

const I18N = {
  zh: {
    doc: '🎈 空气车库 · KidsLab',
    back: '返回平台',
    title: '空气车库',
    soundOff: '关闭声音',
    soundOn: '打开声音',
    themeLabel: '切换主题',
    routeLabel: '实验工位',
    sceneCanvas: '空气实验动画',
    readoutLabel: '实验读数',
    eyebrow: '只烧空气的改装车间',
    hint: '给我一点提示',
    reset: '这一关重来',
    complete: '空气车库通关啦！',
    certEyebrow: '空气技师认证',
    certTitle: '空气车库通关啦！',
    certText: '看不见的空气会占地方、有重量，还能把车子推过终点。',
    again: '再开一间车库',
    airEscaped: '空气从斜口跑光了，纸巾湿了。竖直再试。',
    stillBalanced: '两边一样重，天平还是平的。',
    airGone: '两只气球都瘪了，空气跑光，天平又平了。',
    noAir: '气球是瘪的，车子一步也没动。',
    tooShort: '气不够，车子没跑到终点。',
    burst: '打太满，气球砰地炸了！',
    dipStraight: '竖直扣下去',
    dipTilt: '斜着扣下去',
    popLeft: '扎破左边',
    popRight: '扎破右边',
    weigh: '看天平',
    pump: '打一下气',
    launch: '放车上赛道',
    tissueDry: '干燥',
    tissueWet: '湿了',
    cupAbove: '在水面',
    cupIn: '在水里',
    notTried: '还没试',
    airInside: '空气占着',
    airLeft: '空气跑了',
    massUnit: '格',
    pumpsUnit: '下',
    tiltLeft: '左边更重',
    tiltRight: '右边更重',
    tiltLevel: '平衡',
    burstLabel: '炸了',
    missions: [
      {
        name: '纸巾潜水',
        label: '工位 1 / 3 · 杯子',
        title: '把杯子竖直扣进水里',
        text: '杯底有一张纸巾。把它扣进水里。',
        hint: '杯子要开口朝下、竖直压进去。斜了，里面的空气就会跑掉。',
        stage: '纸巾藏在杯底',
        win: '纸巾还是干的！空气占着地方。',
        readA: '纸巾',
        readB: '杯子',
        readC: '发现',
      },
      {
        name: '气球天平',
        label: '工位 2 / 3 · 天平',
        title: '扎破一只气球',
        text: '两只鼓气球一样重。扎破一只再看天平。',
        hint: '只扎破一只。剩下那只还装着空气，会更重。',
        stage: '两只气球正对着看',
        win: '天平倾斜了！空气有重量。',
        readA: '左边',
        readB: '右边',
        readC: '天平',
      },
      {
        name: '气球赛车',
        label: '工位 3 / 3 · 赛车',
        title: '给赛车打满气',
        text: '打够气再出发。喷嘴决定喷得猛还是喷得久。',
        hint: '至少打 6 下。喷嘴越粗喷得越猛，气也越快用完。',
        stage: '赛道等着被推过终点',
        win: '压缩空气把车送过终点！',
        readA: '打气',
        readB: '推力',
        readC: '续航',
      },
    ],
  },
  en: {
    doc: '🎈 Air Garage · KidsLab',
    back: 'Back to platform',
    title: 'Air Garage',
    soundOff: 'Turn sound off',
    soundOn: 'Turn sound on',
    themeLabel: 'Switch theme',
    routeLabel: 'Lab stations',
    sceneCanvas: 'Air experiment animation',
    readoutLabel: 'Experiment readings',
    eyebrow: 'A garage that runs on air',
    hint: 'Give me a hint',
    reset: 'Retry this station',
    complete: 'Air garage complete!',
    certEyebrow: 'Air mechanic certificate',
    certTitle: 'Air garage complete!',
    certText: 'Invisible air takes up space, has weight, and can push a car to the finish.',
    again: 'Open another garage',
    airEscaped: 'Air rushed out the tilt. The tissue is wet. Dip it straight.',
    stillBalanced: 'Both sides still match, so the scale stays level.',
    airGone: 'Both balloons are empty. The air is gone, and the scale is level again.',
    noAir: 'The balloon is empty, so the car does not move.',
    tooShort: 'Not enough air. The car stops short of the finish.',
    burst: 'Too full! The balloon popped.',
    dipStraight: 'Dip it straight',
    dipTilt: 'Dip it tilted',
    popLeft: 'Pop the left',
    popRight: 'Pop the right',
    weigh: 'Read the scale',
    pump: 'Pump once',
    launch: 'Launch the car',
    tissueDry: 'dry',
    tissueWet: 'wet',
    cupAbove: 'above water',
    cupIn: 'in water',
    notTried: 'not yet',
    airInside: 'air trapped',
    airLeft: 'air escaped',
    massUnit: 'tiles',
    pumpsUnit: 'pumps',
    tiltLeft: 'left heavier',
    tiltRight: 'right heavier',
    tiltLevel: 'level',
    burstLabel: 'burst',
    missions: [
      {
        name: 'Tissue dive',
        label: 'Station 1 / 3 · Cup',
        title: 'Dip the cup straight into the water',
        text: 'A tissue sits in the cup. Dip it into the water.',
        hint: 'Keep the open end down and go in straight. Tilt, and the air inside escapes.',
        stage: 'The tissue hides in the cup',
        win: 'The tissue is still dry! Air inside the cup is taking up the space.',
        readA: 'Tissue',
        readB: 'Cup',
        readC: 'Finding',
      },
      {
        name: 'Balloon scale',
        label: 'Station 2 / 3 · Scale',
        title: 'Pop just one balloon',
        text: 'Two puffed balloons match. Pop one, then read the scale.',
        hint: 'Pop only one. The balloon that still holds air is heavier.',
        stage: 'Two balloons face each other',
        win: 'The scale tips! Invisible air really has weight.',
        readA: 'Left',
        readB: 'Right',
        readC: 'Scale',
      },
      {
        name: 'Balloon racer',
        label: 'Station 3 / 3 · Racer',
        title: 'Pump the race car full',
        text: 'Pump enough air, then go. The nozzle trades punch for lasting time.',
        hint: 'Pump at least 6 times. A wider nozzle pushes harder, but the air is gone sooner.',
        stage: 'The track waits for a finish',
        win: 'Compressed air pushed the car past the finish!',
        readA: 'Pumps',
        readB: 'Thrust',
        readC: 'Duration',
      },
    ],
  },
};

const els = {
  backBtn: document.getElementById('backBtn'),
  soundBtn: document.getElementById('soundBtn'),
  themeBtn: document.getElementById('themeBtn'),
  langBtn: document.getElementById('langBtn'),
  route: document.getElementById('route'),
  tip: document.getElementById('tip'),
  stageLabel: document.getElementById('stageLabel'),
  sceneBadge: document.getElementById('sceneBadge'),
  canvas: document.getElementById('garageCanvas'),
  stepCount: document.getElementById('stepCount'),
  missionTitle: document.getElementById('missionTitle'),
  missionText: document.getElementById('missionText'),
  readout: document.getElementById('readout'),
  readLabelA: document.getElementById('readLabelA'),
  readValueA: document.getElementById('readValueA'),
  readLabelB: document.getElementById('readLabelB'),
  readValueB: document.getElementById('readValueB'),
  readLabelC: document.getElementById('readLabelC'),
  readValueC: document.getElementById('readValueC'),
  controlZone: document.getElementById('controlZone'),
  status: document.getElementById('status'),
  hintBtn: document.getElementById('hintBtn'),
  resetBtn: document.getElementById('resetBtn'),
  celebration: document.getElementById('celebration'),
  againBtn: document.getElementById('againBtn'),
};

let t = (key) => key;
let activeLang = 'zh';
let muted = localStorage.getItem(SOUND_KEY) === 'true';
let audioContext = null;
let garage = createGarage();
let showHint = false;
let feedback = '';
let feedbackKind = '';

function currentIndex() {
  return Math.min(garage.station, STATIONS.length - 1);
}

function missionFor(index = currentIndex()) {
  return I18N[activeLang].missions[index];
}

function setFeedback(message, kind = '') {
  feedback = message;
  feedbackKind = kind;
}

function restore() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    if (!saved?.garage || !Number.isInteger(saved.garage.station)
      || saved.garage.station < 0 || saved.garage.station > STATIONS.length
      || !Array.isArray(saved.garage.cleared)) {
      throw new TypeError('invalid saved air-garage state');
    }
    garage = {
      ...createGarage(),
      ...saved.garage,
      cleared: [...saved.garage.cleared],
      cup: { ...createGarage().cup, ...(saved.garage.cup || {}) },
      balance: { ...createGarage().balance, ...(saved.garage.balance || {}) },
      rocket: { ...createGarage().rocket, ...(saved.garage.rocket || {}) },
    };
    feedback = saved.feedback || '';
    feedbackKind = saved.feedbackKind || '';
  } catch {
    localStorage.removeItem(SAVE_KEY);
    feedback = 'Saved garage was invalid and was reset.';
    feedbackKind = 'is-error';
  }
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ garage, feedback, feedbackKind }));
}

function applyResult(result, { success, errorMap, track }) {
  garage = result.garage;
  showHint = false;
  window.cool?.stage('level2');
  if (track) window.cool?.track(track);
  if (result.error) {
    setFeedback(t(errorMap[result.error] || 'reset'), 'is-error');
    playSound(result.error === 'burst' ? 'burst' : 'error');
  } else {
    setFeedback(success, 'is-win');
    if (garage.complete) {
      window.cool?.complete?.();
      playSound('complete');
    } else {
      playSound('success');
    }
  }
  save();
  render();
  if (garage.complete) requestAnimationFrame(() => els.againBtn.focus());
}

function renderRoute() {
  els.route.innerHTML = STATIONS.map((name, index) => {
    const cleared = garage.cleared.includes(name);
    const current = index === currentIndex() && !garage.complete;
    return `<li><button type="button" data-route="${index}" disabled aria-current="${current ? 'step' : 'false'}" class="${cleared ? 'is-cleared' : ''}" aria-label="${missionFor(index).name}">${cleared ? '✓' : index + 1}</button></li>`;
  }).join('');
}

function renderControls(mission) {
  const kind = STATIONS[currentIndex()];
  if (kind === 'cup') {
    els.controlZone.innerHTML = `
      <span class="choice-label">${mission.text}</span>
      <div class="choices choices--2">
        <button class="choice" id="dipStraightBtn" type="button">${t('dipStraight')}</button>
        <button class="choice" id="dipTiltBtn" type="button">${t('dipTilt')}</button>
      </div>`;
    els.controlZone.querySelector('#dipStraightBtn').addEventListener('click', () => {
      applyResult(dipCup(garage, { tilt: false }), {
        success: missionFor(0).win,
        errorMap: { 'air-escaped': 'airEscaped' },
        track: 'dip-cup',
      });
    });
    els.controlZone.querySelector('#dipTiltBtn').addEventListener('click', () => {
      applyResult(dipCup(garage, { tilt: true }), {
        success: missionFor(0).win,
        errorMap: { 'air-escaped': 'airEscaped' },
        track: 'dip-cup',
      });
    });
    return;
  }

  if (kind === 'balance') {
    els.controlZone.innerHTML = `
      <span class="choice-label">${mission.text}</span>
      <div class="choices">
        <button class="choice" id="popLeftBtn" type="button" aria-pressed="${garage.balance.leftPopped}">${t('popLeft')}</button>
        <button class="choice" id="popRightBtn" type="button" aria-pressed="${garage.balance.rightPopped}">${t('popRight')}</button>
      </div>
      <button class="primary" id="weighBtn" type="button">${t('weigh')}</button>`;
    els.controlZone.querySelector('#popLeftBtn').addEventListener('click', () => {
      garage = popBalloon(garage, 'left').garage;
      setFeedback('');
      playSound('pop');
      window.cool?.track('pop-balloon');
      save();
      render();
    });
    els.controlZone.querySelector('#popRightBtn').addEventListener('click', () => {
      garage = popBalloon(garage, 'right').garage;
      setFeedback('');
      playSound('pop');
      window.cool?.track('pop-balloon');
      save();
      render();
    });
    els.controlZone.querySelector('#weighBtn').addEventListener('click', () => {
      applyResult(judgeBalance(garage), {
        success: missionFor(1).win,
        errorMap: { 'still-balanced': 'stillBalanced', 'air-gone': 'airGone' },
        track: 'weigh-balloons',
      });
    });
    return;
  }

  els.controlZone.innerHTML = `
    <span class="choice-label">${mission.select || mission.text}</span>
    <div class="choices">
      ${['small', 'medium', 'large'].map((nozzle) => `<button class="choice" type="button" data-nozzle="${nozzle}" aria-pressed="${garage.rocket.nozzle === nozzle}">${nozzle === 'small' ? (activeLang === 'zh' ? '细喷嘴' : 'Narrow') : nozzle === 'medium' ? (activeLang === 'zh' ? '中喷嘴' : 'Medium') : (activeLang === 'zh' ? '粗喷嘴' : 'Wide')}</button>`).join('')}
    </div>
    <button class="choice" id="pumpBtn" type="button">${t('pump')}</button>
    <button class="primary" id="launchBtn" type="button">${t('launch')}</button>`;
  els.controlZone.querySelectorAll('[data-nozzle]').forEach((button) => {
    button.addEventListener('click', () => {
      garage = setNozzle(garage, button.dataset.nozzle).garage;
      setFeedback('');
      playSound('select');
      save();
      render();
    });
  });
  els.controlZone.querySelector('#pumpBtn').addEventListener('click', () => {
    const result = pumpRocket(garage);
    garage = result.garage;
    showHint = false;
    window.cool?.track('pump-balloon');
    if (result.error === 'burst') {
      setFeedback(t('burst'), 'is-error');
      playSound('burst');
    } else {
      setFeedback('');
      playSound('pump');
    }
    save();
    render();
  });
  els.controlZone.querySelector('#launchBtn').addEventListener('click', () => {
    applyResult(launchRocket(garage), {
      success: missionFor(2).win,
      errorMap: { 'no-air': 'noAir', 'too-short': 'tooShort', burst: 'burst' },
      track: 'launch-car',
    });
  });
}

function fillReadout(mission) {
  els.readLabelA.textContent = mission.readA;
  els.readLabelB.textContent = mission.readB;
  els.readLabelC.textContent = mission.readC;
  const kind = STATIONS[currentIndex()];
  if (kind === 'cup') {
    els.readValueA.textContent = garage.cup.tissueWet ? t('tissueWet') : t('tissueDry');
    els.readValueB.textContent = garage.cup.inWater ? t('cupIn') : t('cupAbove');
    els.readValueC.textContent = garage.cup.provenDry ? t('airInside') : garage.cup.tissueWet ? t('airLeft') : t('notTried');
    return;
  }
  if (kind === 'balance') {
    els.readValueA.textContent = `${balloonMass(garage.balance, 'left')} ${t('massUnit')}`;
    els.readValueB.textContent = `${balloonMass(garage.balance, 'right')} ${t('massUnit')}`;
    const left = balloonMass(garage.balance, 'left');
    const right = balloonMass(garage.balance, 'right');
    els.readValueC.textContent = left === right ? t('tiltLevel') : left > right ? t('tiltLeft') : t('tiltRight');
    return;
  }
  const thrust = NOZZLES[garage.rocket.nozzle]?.thrust || 0;
  els.readValueA.textContent = garage.rocket.burst ? t('burstLabel') : `${garage.rocket.pumps} ${t('pumpsUnit')}`;
  els.readValueB.textContent = String(thrust);
  els.readValueC.textContent = garage.rocket.pumps && thrust ? String(garage.rocket.pumps / thrust) : '0';
}

function render() {
  const mission = missionFor();
  document.title = t('doc');
  els.backBtn.setAttribute('aria-label', t('back'));
  els.langBtn.textContent = activeLang === 'zh' ? 'EN' : '中';
  els.themeBtn.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
  els.themeBtn.setAttribute('aria-label', t('themeLabel'));
  els.soundBtn.textContent = muted ? '🔇' : '🔊';
  els.soundBtn.setAttribute('aria-pressed', String(muted));
  els.soundBtn.setAttribute('aria-label', muted ? t('soundOn') : t('soundOff'));
  els.route.setAttribute('aria-label', t('routeLabel'));
  els.canvas.setAttribute('aria-label', t('sceneCanvas'));
  els.readout.setAttribute('aria-label', t('readoutLabel'));
  els.tip.textContent = showHint ? mission.hint : mission.text;
  els.hintBtn.setAttribute('aria-expanded', String(showHint));
  els.stepCount.textContent = mission.label;
  els.missionTitle.textContent = mission.title;
  els.missionText.textContent = mission.text;
  els.stageLabel.textContent = mission.name;
  els.sceneBadge.textContent = mission.stage;
  els.status.textContent = feedback;
  els.status.className = `feedback ${feedbackKind}`;
  fillReadout(mission);
  renderRoute();
  renderControls(mission);
  els.celebration.hidden = !garage.complete;
  draw();
}

function resetCurrent() {
  garage = resetStation(garage);
  showHint = false;
  setFeedback('');
  save();
  render();
  playSound('select');
}

function resetAll() {
  garage = createGarage();
  showHint = false;
  setFeedback('');
  window.cool?.progress?.clear();
  save();
  render();
  playSound('select');
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawBalloon(ctx, x, y, size, popped, color) {
  if (popped) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - size * .3, y - size * .2);
    ctx.lineTo(x + size * .25, y + size * .15);
    ctx.moveTo(x + size * .28, y - size * .18);
    ctx.lineTo(x - size * .2, y + size * .2);
    ctx.stroke();
    return;
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, size * .7, size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = cssVar('--line-strong');
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + size);
  ctx.lineTo(x, y + size * 1.35);
  ctx.stroke();
}

function drawCupScene(ctx, w, h) {
  const waterTop = h * .46;
  const tankX = w * .14;
  const tankW = w * .72;
  const tankH = h * .46;
  ctx.fillStyle = cssVar('--wood');
  roundRect(ctx, tankX - 10, waterTop + tankH - 18, tankW + 20, 28, 8);
  ctx.fill();

  const water = ctx.createLinearGradient(0, waterTop, 0, waterTop + tankH);
  water.addColorStop(0, cssVar('--water'));
  water.addColorStop(1, '#219ebc');
  ctx.fillStyle = water;
  roundRect(ctx, tankX, waterTop, tankW, tankH, 18);
  ctx.fill();
  ctx.strokeStyle = cssVar('--line-strong');
  ctx.lineWidth = 4;
  ctx.stroke();

  const dipped = garage.cup.inWater;
  const tilt = garage.cup.tilted ? -0.42 : 0;
  const cupX = w * .5;
  const cupY = dipped ? waterTop + h * .08 : h * .22;
  ctx.save();
  ctx.translate(cupX, cupY);
  ctx.rotate(tilt);
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.strokeStyle = cssVar('--line-strong');
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-42, -8);
  ctx.lineTo(-52, 78);
  ctx.lineTo(52, 78);
  ctx.lineTo(42, -8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = garage.cup.tissueWet ? '#7ad' : '#f8f1e3';
  roundRect(ctx, -22, 8, 44, 16, 5);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  if (garage.cup.tilted && garage.cup.inWater) {
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    for (const [bx, by, br] of [[w * .57, waterTop + 24, 8], [w * .62, waterTop + 48, 6], [w * .54, waterTop + 64, 5]]) {
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
}

function drawBalanceScene(ctx, w, h) {
  const midX = w * .5;
  const fulcrumY = h * .68;
  const left = balloonMass(garage.balance, 'left');
  const right = balloonMass(garage.balance, 'right');
  const tilt = left === right ? 0 : left > right ? -0.18 : 0.18;
  ctx.fillStyle = cssVar('--wood');
  ctx.beginPath();
  ctx.moveTo(midX - 28, fulcrumY + 18);
  ctx.lineTo(midX, fulcrumY - 18);
  ctx.lineTo(midX + 28, fulcrumY + 18);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = cssVar('--line-strong');
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.save();
  ctx.translate(midX, fulcrumY - 16);
  ctx.rotate(tilt);
  ctx.strokeStyle = cssVar('--line-strong');
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-w * .28, 0);
  ctx.lineTo(w * .28, 0);
  ctx.stroke();
  drawBalloon(ctx, -w * .26, -58, 36, garage.balance.leftPopped, cssVar('--rubber'));
  drawBalloon(ctx, w * .26, -58, 36, garage.balance.rightPopped, cssVar('--accent-2'));
  ctx.restore();
}

function drawRocketScene(ctx, w, h) {
  const trackY = h * .72;
  ctx.fillStyle = cssVar('--paper-2');
  roundRect(ctx, w * .08, trackY, w * .84, 18, 8);
  ctx.fill();
  ctx.strokeStyle = cssVar('--line-strong');
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(w * .1, trackY + 9);
  ctx.lineTo(w * .9, trackY + 9);
  ctx.stroke();
  ctx.setLineDash([]);

  const progress = Math.min(1, (garage.rocket.distance || 0) / TRACK_LENGTH);
  const carX = w * .16 + progress * w * .58;
  const carY = trackY - 18;
  ctx.fillStyle = cssVar('--accent');
  roundRect(ctx, carX, carY - 18, 72, 28, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = cssVar('--ink');
  ctx.beginPath();
  ctx.arc(carX + 16, carY + 12, 8, 0, Math.PI * 2);
  ctx.arc(carX + 54, carY + 12, 8, 0, Math.PI * 2);
  ctx.fill();
  const balloonX = carX - 6;
  const balloonY = carY - 38;
  drawBalloon(ctx, balloonX, balloonY, 22 + garage.rocket.pumps * 2, garage.rocket.burst, cssVar('--rubber'));
  ctx.fillStyle = cssVar('--ok');
  roundRect(ctx, w * .86, trackY - 26, 18, 36, 4);
  ctx.fill();
}

function draw() {
  const rect = els.canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  els.canvas.width = Math.round(rect.width * scale);
  els.canvas.height = Math.round(rect.height * scale);
  const ctx = els.canvas.getContext('2d');
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const { width: w, height: h } = rect;
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, cssVar('--sky'));
  sky.addColorStop(1, cssVar('--paper'));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = cssVar('--accent-2');
  ctx.beginPath();
  ctx.arc(w * .82, h * .16, Math.min(w, h) * .08, 0, Math.PI * 2);
  ctx.fill();

  const kind = STATIONS[currentIndex()];
  if (kind === 'cup') drawCupScene(ctx, w, h);
  else if (kind === 'balance') drawBalanceScene(ctx, w, h);
  else drawRocketScene(ctx, w, h);
}

function playTone(context, kind) {
  const frequencies = {
    select: 460, pump: 390, pop: 240, error: 165, burst: 120, success: 660, complete: 780,
  };
  const osc = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  osc.type = kind === 'error' || kind === 'burst' ? 'sawtooth' : kind === 'pop' ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(frequencies[kind] || 460, now);
  if (kind === 'complete') osc.frequency.exponentialRampToValueAtTime(1040, now + .16);
  if (kind === 'burst') osc.frequency.exponentialRampToValueAtTime(70, now + .2);
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(kind === 'burst' ? .16 : .12, now + .018);
  gain.gain.exponentialRampToValueAtTime(.0001, now + (kind === 'complete' || kind === 'burst' ? .35 : .18));
  osc.connect(gain).connect(context.destination);
  osc.start(now);
  osc.stop(now + (kind === 'complete' || kind === 'burst' ? .37 : .2));
}

function playSound(kind) {
  if (muted) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioContext) audioContext = new AudioContextClass();
    if (audioContext.state === 'suspended') {
      audioContext.resume()
        .then(() => playTone(audioContext, kind))
        .catch(() => { audioContext = null; });
    } else {
      playTone(audioContext, kind);
    }
  } catch {
    audioContext = null;
  }
}

els.soundBtn.addEventListener('click', () => {
  muted = !muted;
  localStorage.setItem(SOUND_KEY, String(muted));
  render();
  if (!muted) playSound('select');
});
els.langBtn.addEventListener('click', () => window.cool.preferences.toggleLang());
els.themeBtn.addEventListener('click', () => window.cool.preferences.toggleTheme());
els.hintBtn.addEventListener('click', () => {
  showHint = !showHint;
  render();
  playSound('select');
});
els.resetBtn.addEventListener('click', resetCurrent);
els.againBtn.addEventListener('click', resetAll);
window.addEventListener('resize', draw);
window.addEventListener('themechange', draw);

restore();
window.cool.bindI18n(I18N, {
  onChange({ t: translate, lang }) {
    t = translate;
    activeLang = lang;
    render();
  },
});
