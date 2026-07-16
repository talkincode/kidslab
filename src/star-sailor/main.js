import * as THREE from './vendor/three.module.min.js';

(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '星海水手 · KidsLab', back: '返回平台', title: '星海水手', tip0: '站在船上拖动天空环顾；按航海日志完成 6 个星空任务。', nogl: '你的浏览器暂不支持 WebGL，海上的星光暂时收帆。', start: '开始任务', fast: '按住快进', monthLabel: '月份轮盘', helmTip: '拖动船头方向盘，让箭头对准北极星。',
      chapters: ['连星成图', '寻找北极星', '掉头向北', '星轨快进', '季节星空', '光年信使'],
      texts: ['依次点击北斗七星，连成勺子；接着点亮仙后座 W。', '从北斗勺口两星“天璇→天枢”往外拖一条线，拉到 5 倍距离命中北极星。', '船迷航了。拖动方向盘，把船头箭头对准北极星方向。', '按住快进：星空绕天轴旋转，长曝光星轨会画出同心圆，圆心就是北极星。', '转动月份轮盘：冬季猎户座登场，夏季逐渐隐没；北斗始终绕北极星转。', '点击正确答案，收下来自星光过去的消息。'],
      ok: ['北斗亮起来了！再连仙后座 W。', '星图完成：大熊座和仙后座会帮你认路。', '命中北极星！它几乎在天北极旁，所以看起来不动。', '船头向北！古代水手靠它定方向。', '看见了吗？所有星轨围着北极星画圆弧。', '季节会改变夜晚能看见的星座。', '光年是光走一年的距离，不是时间单位。任务完成！'],
      miss: '差一点，跟着航海日志再试试。', polaris: '北极星', north: '北', winter: '冬季：猎户座高挂南天', summer: '夏季：猎户座白天在太阳附近，夜里难见', quizDone: '星光信使通关！你集齐了全部航海徽章。',
      quiz: [['天狼星 8.6 光年，意思是？', ['它的光走到我们眼里约 8.6 年', '它离我们 8.6 天', '它每年移动 8.6 米'], 0], ['北极星约 433 光年，所以我们看到的是？', ['约 433 年前出发的光', '明天的北极星', '月球反光'], 0], ['光年是什么单位？', ['距离', '时间', '温度'], 0]],
    },
    en: {
      doc: 'Star Sailor · KidsLab', back: 'Back to platform', title: 'Star Sailor', tip0: 'Stand on the boat, drag to look around, and finish 6 navigation log missions.', nogl: 'Your browser does not support WebGL; the starlight cannot sail today.', start: 'Start mission', fast: 'Hold fast-forward', monthLabel: 'Month wheel', helmTip: 'Drag the helm so the bow arrow points to Polaris.',
      chapters: ['Connect stars', 'Find Polaris', 'Turn north', 'Star-trail magic', 'Season sky', 'Light-year messenger'],
      texts: ['Click the seven Big Dipper stars in order; then light the Cassiopeia W.', 'Drag a line from Merak to Dubhe and extend it five times to hit Polaris.', 'The boat is lost. Drag the helm and point the bow toward Polaris.', 'Hold fast-forward: the sky spins around the celestial axis and long-exposure trails circle Polaris.', 'Turn the month wheel: Orion appears in winter and hides in summer; the Dipper circles Polaris.', 'Choose correct answers and receive messages from old starlight.'],
      ok: ['The Dipper is lit! Now connect the Cassiopeia W.', 'Star maps complete: Great Bear and Cassiopeia can guide you.', 'Polaris found! It is almost on the north celestial pole, so it barely moves.', 'Bow north! Ancient sailors used it for direction.', 'See? All trails arc around Polaris.', 'Seasons change which constellations are visible at night.', 'A light-year is distance, not a time unit. Mission complete!'],
      miss: 'Almost. Follow the log and try again.', polaris: 'Polaris', north: 'N', winter: 'Winter: Orion is high in the night sky', summer: 'Summer: Orion is near the Sun and hard to see at night', quizDone: 'Light-year messenger complete! All badges collected.',
      quiz: [['Sirius is 8.6 light-years away. That means:', ['Its light takes about 8.6 years to reach us', 'It is 8.6 days away', 'It moves 8.6 meters per year'], 0], ['Polaris is about 433 light-years away. We see:', ['Light that left about 433 years ago', 'Tomorrow’s Polaris', 'Moonlight'], 0], ['A light-year is a unit of:', ['distance', 'time', 'temperature'], 0]],
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

  const canvas = $('#scene');
  const trailCanvas = $('#trails');
  const trailCtx = trailCanvas.getContext('2d');
  const overlay = $('#overlay');
  const toast = $('#toast');
  const badges = $('#badges');
  const chapterNo = $('#chapterNo');
  const chapterTitle = $('#chapterTitle');
  const chapterText = $('#chapterText');
  const mainBtn = $('#mainBtn');
  const fastBtn = $('#fastBtn');
  const helm = $('#helm');
  const wheel = $('#wheel');
  const monthBox = $('#monthBox');
  const monthRange = $('#monthRange');
  const monthText = $('#monthText');
  const quiz = $('#quiz');

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
  catch { $('#nogl').hidden = false; canvas.remove(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, 1, .1, 360);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const starRoot = new THREE.Group();
  scene.add(starRoot);
  scene.add(new THREE.AmbientLight(0x8fb8ff, 1.2));

  const R = 95;
  const STAR = {
    dubhe: [18, 46, -72], merak: [8, 35, -76], phecda: [-6, 31, -73], megrez: [-17, 39, -76], alioth: [-32, 44, -72], mizar: [-47, 48, -67], alkaid: [-65, 51, -58],
    caph: [45, 50, -65], schedar: [31, 62, -67], gammaCas: [12, 54, -82], ruchbah: [-7, 62, -70], segin: [-24, 55, -67], polaris: [33, 73, -44],
    betelgeuse: [-48, 4, -82], bellatrix: [-24, 8, -91], alnilam: [-36, -5, -86], rigel: [-20, -20, -88], saiph: [-56, -18, -75], sirius: [-78, -32, -54], vega: [70, 26, -60], deneb: [48, 35, -70], altair: [83, 0, -44], arcturus: [8, 18, -93], spica: [26, -18, -88]
  };
  const META = { polaris: ['Polaris', 2.0], sirius: ['Sirius', 2.2], vega: ['Vega', 1.7], betelgeuse: ['Betelgeuse', 1.6], rigel: ['Rigel', 1.7], arcturus: ['Arcturus', 1.8], deneb: ['Deneb', 1.5], altair: ['Altair', 1.5] };
  const dipperSeq = ['dubhe', 'merak', 'phecda', 'megrez', 'alioth', 'mizar', 'alkaid'];
  const casSeq = ['caph', 'schedar', 'gammaCas', 'ruchbah', 'segin'];
  const starObjects = new Map();
  const starWorld = new Map();
  const litLines = [];
  let chapter = 0, started = false, dipperStep = 0, casStep = 0, tracingCas = false, timeSpin = 0, fast = false, fastFrames = 0, yaw = 0, pitch = .02, targetYaw = 0, targetPitch = .02, draggingLook = false, lastX = 0, lastY = 0, dragLine = null, helmAngle = 130, quizIndex = 0, seasonAngle = 0, finalBadged = false;

  function norm(v) { return new THREE.Vector3(v[0], v[1], v[2]).normalize().multiplyScalar(R); }
  function starTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 96; const g = c.getContext('2d');
    const grad = g.createRadialGradient(48, 48, 0, 48, 48, 48); grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(.2, 'rgba(255,244,190,1)'); grad.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = grad; g.fillRect(0, 0, 96, 96); return new THREE.CanvasTexture(c);
  }
  const dot = starTexture();
  Object.entries(STAR).forEach(([id, arr]) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: id === 'polaris' ? 0xfff0a0 : 0xffffff, transparent: true, depthWrite: false, sizeAttenuation: true }));
    sp.position.copy(norm(arr)); const size = META[id]?.[1] || (dipperSeq.includes(id) || casSeq.includes(id) ? 1.35 : 1.05); sp.scale.setScalar(size * 2.2); sp.userData.id = id; starRoot.add(sp); starObjects.set(id, sp); starWorld.set(id, sp.position.clone());
  });
  for (let i = 0; i < 420; i++) {
    const u = Math.random(), v = Math.random(), theta = 2 * Math.PI * u, phi = Math.acos(2 * v - 1);
    const y = Math.cos(phi); if (y < -.28) continue;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: 0xbfd7ff, transparent: true, opacity: .45 + Math.random() * .35, depthWrite: false }));
    sp.position.set(Math.sin(phi) * Math.cos(theta) * R, y * R, Math.sin(phi) * Math.sin(theta) * R); sp.scale.setScalar(.55 + Math.random() * .8); starRoot.add(sp);
  }

  const sea = new THREE.Mesh(new THREE.PlaneGeometry(220, 140, 18, 12), new THREE.MeshStandardMaterial({ color: 0x0b6b8c, roughness: .9, metalness: 0, transparent: true, opacity: .86, side: THREE.DoubleSide }));
  sea.rotation.x = -Math.PI / 2; sea.position.y = -10; sea.position.z = -36; scene.add(sea);
  const boat = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.BoxGeometry(8, 1.3, 3), new THREE.MeshStandardMaterial({ color: 0x8b542d, roughness: .8 }));
  hull.position.y = -5.2; const mast = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 7), new THREE.MeshStandardMaterial({ color: 0x5a321c })); mast.position.y = -1.6;
  const sail = new THREE.Mesh(new THREE.ConeGeometry(2, 4, 3), new THREE.MeshStandardMaterial({ color: 0xf6edd2, roughness: .7, side: THREE.DoubleSide })); sail.position.set(1.2, -1.6, 0); sail.rotation.z = .35;
  boat.add(hull, mast, sail); boat.position.set(0, -5, -15); scene.add(boat);

  function applyCamera() {
    const dir = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
    camera.position.set(0, 0, 0); camera.lookAt(dir.multiplyScalar(10));
  }
  function project(id) {
    const p = starObjects.get(id).getWorldPosition(new THREE.Vector3()).project(camera);
    return { x: (p.x * .5 + .5) * canvas.clientWidth, y: (-p.y * .5 + .5) * canvas.clientHeight, z: p.z };
  }
  function drawLine(a, b, cls = '') {
    const pa = project(a), pb = project(b); if (pa.z > 1 || pb.z > 1) return;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); line.setAttribute('x1', pa.x); line.setAttribute('y1', pa.y); line.setAttribute('x2', pb.x); line.setAttribute('y2', pb.y); if (cls) line.setAttribute('class', cls); overlay.appendChild(line);
  }
  function redrawOverlay() {
    overlay.innerHTML = '';
    litLines.forEach(([a, b]) => drawLine(a, b));
    if (chapter === 1 && started) { drawLine('merak', 'dubhe', 'guide'); if (dragLine) addDragSvg(dragLine.x1, dragLine.y1, dragLine.x2, dragLine.y2); }
  }
  function addDragSvg(x1, y1, x2, y2) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); line.setAttribute('x1', x1); line.setAttribute('y1', y1); line.setAttribute('x2', x2); line.setAttribute('y2', y2); line.setAttribute('class', 'guide'); overlay.appendChild(line);
  }
  function toastMsg(msg, good = true) { toast.textContent = msg; toast.style.borderColor = good ? 'var(--accent-2)' : 'var(--bad)'; toast.hidden = false; clearTimeout(toast._timer); toast._timer = setTimeout(() => { toast.hidden = true; }, 2600); }
  function badge(icon) { const b = document.createElement('span'); b.className = 'badge'; b.textContent = icon; badges.appendChild(b); sfx.good(); }
  function nextChapter(icon) { badge(icon); chapter = Math.min(5, chapter + 1); started = false; mainBtn.hidden = false; fastBtn.hidden = true; helm.hidden = true; monthBox.hidden = true; quiz.hidden = true; $('#myth').hidden = true; dragLine = null; renderChapter(); }

  function renderChapter() {
    chapterNo.textContent = `${chapter + 1}/6`; chapterTitle.textContent = t('chapters')[chapter]; chapterText.textContent = t('texts')[chapter];
    mainBtn.textContent = t('start'); fastBtn.textContent = t('fast'); redrawOverlay();
  }
  function startChapter() {
    started = true; mainBtn.hidden = true;
    if (chapter === 0) { dipperStep = 0; casStep = 0; tracingCas = false; litLines.length = 0; toastMsg(t('texts')[0]); }
    if (chapter === 1) toastMsg(t('texts')[1]);
    if (chapter === 2) { helm.hidden = false; toastMsg(t('texts')[2]); }
    if (chapter === 3) { fastBtn.hidden = false; toastMsg(t('texts')[3]); }
    if (chapter === 4) { monthBox.hidden = false; toastMsg(t('texts')[4]); }
    if (chapter === 5) { quiz.hidden = false; buildQuiz(); }
    redrawOverlay();
  }

  function onStarClick(id) {
    if (!started) return;
    if (chapter === 0) {
      const seq = tracingCas ? casSeq : dipperSeq, step = tracingCas ? casStep : dipperStep;
      if (id === seq[step]) {
        if (step > 0) litLines.push([seq[step - 1], id]);
        starObjects.get(id).material.color.set(0xffd166); sfx.click();
        if (!tracingCas) { dipperStep++; if (dipperStep === dipperSeq.length) { tracingCas = true; $('#myth').hidden = false; toastMsg(t('ok')[0]); } }
        else { casStep++; if (casStep === casSeq.length) { toastMsg(t('ok')[1]); setTimeout(() => nextChapter('🐻'), 900); } }
      } else { toastMsg(t('miss'), false); sfx.bad(); }
      redrawOverlay();
    }
    if (chapter === 5 && id === 'polaris') toastMsg(`${t('polaris')}: 433 light-years`);
    if (chapter === 5 && id === 'sirius') toastMsg('Sirius: 8.6 light-years');
  }

  function getPointer(e) { const r = canvas.getBoundingClientRect(); pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1; pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1; return r; }
  canvas.addEventListener('pointerdown', (e) => {
    const r = getPointer(e); raycaster.setFromCamera(pointer, camera); const hit = raycaster.intersectObjects([...starObjects.values()])[0];
    if (hit) { onStarClick(hit.object.userData.id); return; }
    if (chapter === 1 && started) { const merak = project('merak'); const dist = Math.hypot(e.clientX - r.left - merak.x, e.clientY - r.top - merak.y); if (dist < 46) { dragLine = { x1: merak.x, y1: merak.y, x2: merak.x, y2: merak.y }; canvas.setPointerCapture(e.pointerId); return; } }
    draggingLook = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    const r = getPointer(e);
    if (dragLine) { dragLine.x2 = e.clientX - r.left; dragLine.y2 = e.clientY - r.top; redrawOverlay(); return; }
    if (!draggingLook) return;
    targetYaw -= (e.clientX - lastX) * .006; targetPitch += (e.clientY - lastY) * .004; targetPitch = Math.max(-.55, Math.min(.9, targetPitch)); lastX = e.clientX; lastY = e.clientY;
  });
  canvas.addEventListener('pointerup', (e) => {
    const r = canvas.getBoundingClientRect();
    if (dragLine && chapter === 1) {
      const pol = project('polaris'), dub = project('dubhe'), mer = project('merak');
      const endNear = Math.hypot(dragLine.x2 - pol.x, dragLine.y2 - pol.y) < 58;
      const base = Math.hypot(dub.x - mer.x, dub.y - mer.y), len = Math.hypot(dragLine.x2 - mer.x, dragLine.y2 - mer.y);
      if (endNear && len > base * 3.8) { litLines.push(['merak', 'dubhe'], ['dubhe', 'polaris']); starObjects.get('polaris').material.color.set(0xffd166); toastMsg(t('ok')[2]); sfx.magic(); setTimeout(() => nextChapter('⭐'), 1000); }
      else { toastMsg(t('miss'), false); sfx.bad(); }
      dragLine = null; redrawOverlay();
    }
    draggingLook = false; try { canvas.releasePointerCapture(e.pointerId); } catch {}
  });

  let helmDragging = false;
  wheel.addEventListener('pointerdown', (e) => { helmDragging = true; wheel.setPointerCapture(e.pointerId); });
  wheel.addEventListener('pointermove', (e) => {
    if (!helmDragging) return; const r = wheel.getBoundingClientRect(); helmAngle = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI + 90; wheel.style.transform = `rotate(${helmAngle}deg)`;
  });
  wheel.addEventListener('pointerup', (e) => { helmDragging = false; try { wheel.releasePointerCapture(e.pointerId); } catch {} if (chapter === 2 && started && Math.abs(((helmAngle % 360) + 360) % 360) < 28) { toastMsg(t('ok')[3]); nextChapter('🧭'); } else if (chapter === 2 && started) { toastMsg(t('miss'), false); sfx.bad(); } });

  fastBtn.addEventListener('pointerdown', () => { fast = true; fastFrames = 0; toastMsg(t('texts')[3]); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => fastBtn.addEventListener(ev, () => { fast = false; if (chapter === 3 && started && fastFrames > 55) { toastMsg(t('ok')[4]); nextChapter('🌀'); } }));
  monthRange.addEventListener('input', () => {
    const m = Number(monthRange.value); monthText.textContent = m; seasonAngle = (m - 1) / 12 * Math.PI * 2; starRoot.rotation.z = seasonAngle * .15;
    const orionOpacity = (m <= 3 || m >= 11) ? 1 : (m >= 6 && m <= 8 ? .18 : .55);
    ['betelgeuse', 'bellatrix', 'alnilam', 'rigel', 'saiph'].forEach((id) => { starObjects.get(id).material.opacity = orionOpacity; });
    toastMsg(orionOpacity > .8 ? t('winter') : t('summer'));
    if (chapter === 4 && started && (m === 1 || m === 7)) setTimeout(() => nextChapter('🗓️'), 650);
  });

  function buildQuiz() {
    quiz.innerHTML = ''; const q = t('quiz')[quizIndex];
    if (!q) {
      toastMsg(t('quizDone'));
      if (!finalBadged) { finalBadged = true; badge('💌'); }
      mainBtn.hidden = true;
      return;
    }
    const h = document.createElement('strong'); h.textContent = q[0]; quiz.appendChild(h);
    q[1].forEach((ans, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = ans; b.addEventListener('click', () => { if (i === q[2]) { b.className = 'ok'; toastMsg(t('ok')[6]); quizIndex++; setTimeout(buildQuiz, 500); sfx.good(); } else { b.className = 'bad'; toastMsg(t('miss'), false); sfx.bad(); } }); quiz.appendChild(b); });
  }

  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'; document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((n) => { const v = I18N[lang][n.dataset.t]; if (typeof v === 'string') n.textContent = v; });
    $('#langBtn').textContent = lang === 'zh' ? 'EN' : '中'; renderChapter(); if (!quiz.hidden) buildQuiz();
  }
  function applyTheme() { document.documentElement.dataset.theme = theme; $('#themeBtn').textContent = theme === 'light' ? '🌙' : '☀️'; scene.background = new THREE.Color(cssVar('--sky')); dispatchEvent(new CustomEvent('themechange', { detail: { theme } })); }
  $('#langBtn').addEventListener('click', () => { lang = lang === 'zh' ? 'en' : 'zh'; store.set(LS.lang, lang); applyLang(); });
  $('#themeBtn').addEventListener('click', () => { theme = theme === 'light' ? 'dark' : 'light'; store.set(LS.theme, theme); applyTheme(); });
  mainBtn.addEventListener('click', startChapter);

  let actx = null;
  function tone(freq, dur = .1, type = 'sine', gain = .08, delay = 0) { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const t0 = actx.currentTime + delay, o = actx.createOscillator(), g = actx.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(gain, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + dur); o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + dur + .02); } catch {} }
  const sfx = { click: () => tone(660, .08, 'triangle'), bad: () => tone(150, .18, 'sawtooth'), good: () => [520, 660, 880].forEach((f, i) => tone(f, .12, 'triangle', .08, i * .06)), magic: () => [392, 523, 784, 1046].forEach((f, i) => tone(f, .16, 'sine', .08, i * .08)) };
  addEventListener('pointerdown', () => { if (actx?.state === 'suspended') actx.resume(); }, { once: false });

  function resize() {
    const r = canvas.getBoundingClientRect(); renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false); camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix();
    const dpr = Math.min(devicePixelRatio || 1, 2); trailCanvas.width = Math.max(1, Math.floor(r.width * dpr)); trailCanvas.height = Math.max(1, Math.floor(r.height * dpr)); trailCanvas.style.width = `${r.width}px`; trailCanvas.style.height = `${r.height}px`; trailCtx.setTransform(dpr, 0, 0, dpr, 0, 0); redrawOverlay();
  }
  addEventListener('resize', resize);

  function drawTrails() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    trailCtx.globalCompositeOperation = 'destination-out';
    trailCtx.fillStyle = 'rgba(0,0,0,0.035)'; trailCtx.fillRect(0, 0, w, h);
    trailCtx.globalCompositeOperation = 'source-over';
    if (!fast) return;
    trailCtx.strokeStyle = 'rgba(255,230,150,0.55)'; trailCtx.lineWidth = 1.25;
    [...starObjects.keys()].forEach((id) => {
      if (id === 'polaris') return;
      const before = project(id); timeSpin += .00002; starRoot.rotation.y += .00002; const after = project(id); starRoot.rotation.y -= .00002; timeSpin -= .00002;
      if (before.z < 1 && after.z < 1) { trailCtx.beginPath(); trailCtx.moveTo(before.x, before.y); trailCtx.lineTo(after.x, after.y); trailCtx.stroke(); }
    });
  }

  function animate(tick) {
    yaw += (targetYaw - yaw) * .08; pitch += (targetPitch - pitch) * .08; applyCamera();
    const pos = sea.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin(tick * .001 + i * .7) * .6);
    pos.needsUpdate = true; boat.rotation.z = Math.sin(tick * .0015) * .045; boat.position.y = -5 + Math.sin(tick * .0018) * .22;
    if (fast) {
      starRoot.rotation.y += .012; fastFrames++; drawTrails();
    } else {
      trailCtx.globalCompositeOperation = 'destination-out';
      trailCtx.fillStyle = 'rgba(0,0,0,0.045)'; trailCtx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      trailCtx.globalCompositeOperation = 'source-over';
    }
    redrawOverlay(); renderer.render(scene, camera); requestAnimationFrame(animate);
  }

  applyTheme(); applyLang(); resize(); applyCamera(); requestAnimationFrame(animate);
})();
