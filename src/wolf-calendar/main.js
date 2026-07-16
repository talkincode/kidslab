import * as THREE from './vendor/three.module.min.js';

(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '月相狼历 · KidsLab', back: '返回平台', title: '月相狼历', tip0: '拖动月球绕地球走，右侧圆窗会显示地球上看到的月相。',
      nogl: '你的浏览器暂不支持 WebGL，但狼人仍会抬头看月亮 ✨', check: '让狼人查看', next: '下一单', tiltOff: '轨道倾角：关', tiltOn: '轨道倾角：开', calendarOpen: '进入月历终极关',
      whyTitle: '为什么不是每月都有日食/月食？', tiltExplainOff: '打开“轨道倾角”，会看到月球通常从太阳视线的上方或下方经过；只有节点附近排成直线才可能日食或月食。', tiltExplainOn: '现在轨道倾斜了 5°（演示中放大显示）：新月常从太阳上方/下方掠过，所以不会每月日食。',
      magicTitle: '圆缺是位置魔术！', magicText: '月球到日地之间时，朝向我们的半面是暗的，所以看到新月。', calendarTitle: '月历排程终极关', calendarTip: '把 4 张活动卡拖到合适农历日期；拖动时月球会自动演示当天月相。',
      right: '对啦！狼历贴纸 +1。', wrong: '不对哦，先看看圆窗里的月亮形状。', allOrders: '8 张狼历贴纸集齐！去挑战月历吧。', calendarWin: '月历排好啦！你已经会用月相安排狼人生活。', calendarTry: '日期还不合适，观察月相再试试。',
      phases: ['新月', '娥眉月', '上弦月', '盈凸月', '满月', '亏凸月', '下弦月', '残月'],
      lunar: ['农历初一附近', '农历初三四', '农历初七八', '农历十一二', '农历十五附近', '农历十八九', '农历廿二三', '农历廿六七'],
      labels: ['新月', '娥眉', '上弦', '盈凸', '满月', '亏凸', '下弦', '残月'],
      orders: [
        ['howl', '周五我要开嚎叫音乐会，要满月！', '🌕'], ['chips', '下周想隐身进城买薯片，要新月。', '🌑'], ['selfie', '想和朋友拍半张脸的酷照，要上弦月。', '🌓'], ['doctor', '狼牙医生只在下弦月开门。', '🌗'],
        ['poem', '我要写一首越来越亮的月亮诗，要娥眉月。', '🌒'], ['camp', '森林露营要亮但不要太圆，选盈凸月。', '🌔'], ['hide', '捉迷藏要暗一点的残月。', '🌘'], ['dance', '月亮刚过满，适合亏凸月舞会。', '🌖']
      ],
      activities: [['concert', '嚎叫音乐会', 15], ['chips', '买薯片', 1], ['party', '半脸聚会', 8], ['doctor', '看医生', 23]],
    },
    en: {
      doc: 'Werewolf Moon Calendar · KidsLab', back: 'Back to platform', title: 'Werewolf Moon Calendar', tip0: 'Drag the Moon around Earth; the round window shows the phase seen from Earth.',
      nogl: 'Your browser does not support WebGL, but the wolf can still watch the Moon ✨', check: 'Ask the wolf', next: 'Next order', tiltOff: 'Orbit tilt: off', tiltOn: 'Orbit tilt: on', calendarOpen: 'Final calendar challenge',
      whyTitle: 'Why not an eclipse every month?', tiltExplainOff: 'Turn on orbit tilt: the Moon usually passes above or below the Sun line. Only near nodes can eclipses happen.', tiltExplainOn: 'The orbit is tilted 5° (exaggerated here): most new moons pass above/below the Sun, so no monthly eclipse.',
      magicTitle: 'Phases are position magic!', magicText: 'When the Moon is between Sun and Earth, the half facing us is dark: a new moon.', calendarTitle: 'Final Moon Calendar', calendarTip: 'Drag 4 activity cards to lunar dates; the Moon demonstrates that day as you drag.',
      right: 'Correct! Wolf-calendar sticker +1.', wrong: 'Not yet. Look at the round phase window first.', allOrders: 'All 8 stickers collected! Try the calendar.', calendarWin: 'Calendar complete! You can plan werewolf life by moon phase.', calendarTry: 'That date does not fit. Watch the phase and try again.',
      phases: ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'],
      lunar: ['around day 1', 'day 3–4', 'day 7–8', 'day 11–12', 'around day 15', 'day 18–19', 'day 22–23', 'day 26–27'],
      labels: ['New', 'Crescent', '1st Q', 'Gibbous', 'Full', 'Waning G', 'Last Q', 'Waning C'],
      orders: [
        ['howl', 'Friday howling concert: I need a full moon!', '🌕'], ['chips', 'Invisible city chip run: new moon, please.', '🌑'], ['selfie', 'A half-face cool photo needs first quarter.', '🌓'], ['doctor', 'The fang doctor opens at last quarter.', '🌗'],
        ['poem', 'A growing moon poem starts with waxing crescent.', '🌒'], ['camp', 'Bright but not round: waxing gibbous camp.', '🌔'], ['hide', 'Hide-and-seek needs a dim waning crescent.', '🌘'], ['dance', 'Just after full: waning gibbous dance.', '🌖']
      ],
      activities: [['concert', 'Howling concert', 15], ['chips', 'Chip run', 1], ['party', 'Half-face party', 8], ['doctor', 'Fang doctor', 23]],
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
  const phaseCanvas = $('#phaseCanvas');
  const pctx = phaseCanvas.getContext('2d');
  const labelsLayer = $('#labels');
  const speech = $('#speech');
  const wolf = $('#wolf');
  const stickers = $('#stickers');
  const magic = $('#magic');
  const tiltBtn = $('#tiltBtn');
  const checkBtn = $('#checkBtn');
  const nextBtn = $('#nextBtn');
  const phaseName = $('#phaseName');
  const lunarName = $('#lunarName');
  const tiltExplain = $('#tiltExplain');

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
  catch { $('#nogl').hidden = false; canvas.remove(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 140);
  camera.position.set(0, 19, 22);
  camera.lookAt(0, 0, 0);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();

  const sunDir = new THREE.Vector3(1, 0, 0);
  const orbitR = 7.2;
  let moonAngle = Math.PI;
  let tiltOn = false;
  let dragging = false;
  let orderIndex = 0;
  const wonOrders = new Set();
  let magicSeen = false;

  const root = new THREE.Group();
  scene.add(root);
  scene.add(new THREE.AmbientLight(0x334466, 1.4));
  const sunLight = new THREE.DirectionalLight(0xffffff, 3.1);
  sunLight.position.set(20, 4, 0);
  scene.add(sunLight);

  function circleTexture(color, glow = color) {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, color); grad.addColorStop(.42, color); grad.addColorStop(1, glow.replace('1)', '0)'));
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  const starsGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(900 * 3);
  for (let i = 0; i < 900; i++) {
    const r = 42 + Math.random() * 34, a = Math.random() * Math.PI * 2, y = (Math.random() - .2) * 32;
    starPos[i * 3] = Math.cos(a) * r; starPos[i * 3 + 1] = y; starPos[i * 3 + 2] = Math.sin(a) * r;
  }
  starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ size: .16, color: 0xffffff, transparent: true, opacity: .75 })));

  const sun = new THREE.Mesh(new THREE.SphereGeometry(1.25, 32, 16), new THREE.MeshBasicMaterial({ color: 0xffd166 }));
  sun.position.set(17, 0, 0); root.add(sun);
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: circleTexture('rgba(255,209,102,1)', 'rgba(255,209,102,1)'), color: 0xffd166, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  sunGlow.scale.set(8, 8, 1); sun.add(sunGlow);

  const earth = new THREE.Mesh(new THREE.SphereGeometry(1.25, 48, 24), new THREE.MeshStandardMaterial({ color: 0x287ad8, roughness: .75, metalness: 0 }));
  const earthLand = new THREE.Mesh(new THREE.SphereGeometry(1.275, 16, 8), new THREE.MeshBasicMaterial({ color: 0x38b66a, transparent: true, opacity: .42, wireframe: true }));
  root.add(earth, earthLand);

  const moon = new THREE.Mesh(new THREE.SphereGeometry(.62, 48, 24), new THREE.MeshStandardMaterial({ color: 0xd8d0bf, roughness: .9 }));
  moon.userData.moon = true; root.add(moon);
  const orbit = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .42 }));
  root.add(orbit);
  const phaseMarkers = [];
  for (let i = 0; i < 8; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(.11, 12, 8), new THREE.MeshBasicMaterial({ color: i === 0 ? 0x333333 : (i === 4 ? 0xfff3c1 : 0xa5c8ff) }));
    root.add(m); phaseMarkers.push(m);
  }

  function updateOrbitGeometry() {
    const pts = [];
    for (let i = 0; i <= 160; i++) {
      const a = i / 160 * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * orbitR, orbitY(a), Math.sin(a) * orbitR));
    }
    orbit.geometry.dispose(); orbit.geometry = new THREE.BufferGeometry().setFromPoints(pts);
  }
  function orbitY(a) { return tiltOn ? Math.sin(a) * Math.sin(THREE.MathUtils.degToRad(5)) * 7 : 0; }
  function setMoonAngle(a) {
    moonAngle = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    moon.position.set(Math.cos(moonAngle) * orbitR, orbitY(moonAngle), Math.sin(moonAngle) * orbitR);
    drawPhase(); updateLabels();
    if (phaseIndex() === 0 && !magicSeen && Math.abs(Math.sin(moonAngle / 2)) < .16) { magicSeen = true; magic.hidden = false; setTimeout(() => { magic.hidden = true; }, 4600); sfx.magic(); }
  }
  function phaseIndex() { return Math.round(moonAngle / (Math.PI / 4)) % 8; }
  function targetAngle(kind) { return { chips: 0, poem: Math.PI / 4, selfie: Math.PI / 2, camp: Math.PI * .75, howl: Math.PI, dance: Math.PI * 1.25, doctor: Math.PI * 1.5, hide: Math.PI * 1.75 }[kind] ?? 0; }
  function angleClose(a, b) { return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))) < Math.PI / 8.5; }

  function drawPhase() {
    const w = phaseCanvas.width, h = phaseCanvas.height, r = w * .45, cx = w / 2, cy = h / 2;
    const img = pctx.createImageData(w, h);
    const observer = new THREE.Vector3(-Math.cos(moonAngle), -orbitY(moonAngle) / orbitR, -Math.sin(moonAngle)).normalize();
    const toSun = new THREE.Vector3(17 - moon.position.x, -moon.position.y, -moon.position.z).normalize();
    const xAxis = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), observer).normalize();
    if (xAxis.lengthSq() < .01) xAxis.set(1, 0, 0);
    const yAxis = new THREE.Vector3().crossVectors(observer, xAxis).normalize();
    const n = new THREE.Vector3();
    const lit = new THREE.Color('#fff3c1'), dark = new THREE.Color('#111525'), rim = new THREE.Color(cssVar('--ink-soft') || '#888');
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const dx = (x - cx) / r, dy = (y - cy) / r, d2 = dx * dx + dy * dy, id = (y * w + x) * 4;
      if (d2 > 1) continue;
      const dz = Math.sqrt(1 - d2);
      n.copy(xAxis).multiplyScalar(dx).addScaledVector(yAxis, -dy).addScaledVector(observer, dz).normalize();
      const illum = n.dot(toSun) > 0;
      const shade = Math.max(0, n.dot(observer)) * .35 + .65;
      const c = illum ? lit : dark;
      img.data[id] = c.r * 255 * shade; img.data[id + 1] = c.g * 255 * shade; img.data[id + 2] = c.b * 255 * shade; img.data[id + 3] = 255;
      if (Math.abs(Math.sqrt(d2) - 1) < .018) { img.data[id] = rim.r * 255; img.data[id + 1] = rim.g * 255; img.data[id + 2] = rim.b * 255; }
    }
    pctx.putImageData(img, 0, 0);
    const idx = phaseIndex(); phaseName.textContent = t('phases')[idx]; lunarName.textContent = t('lunar')[idx];
  }

  function updateLabels() {
    labelsLayer.innerHTML = '';
    phaseMarkers.forEach((m, i) => {
      const a = i * Math.PI / 4; m.position.set(Math.cos(a) * orbitR, orbitY(a), Math.sin(a) * orbitR);
      const p = m.position.clone().project(camera);
      if (p.z < -1 || p.z > 1) return;
      const el = document.createElement('div'); el.className = 'phase-label'; el.textContent = t('labels')[i];
      el.style.left = `${(p.x * .5 + .5) * labelsLayer.clientWidth}px`; el.style.top = `${(-p.y * .5 + .5) * labelsLayer.clientHeight}px`;
      labelsLayer.appendChild(el);
    });
  }

  function updateOrderText() {
    const order = t('orders')[orderIndex];
    speech.textContent = order[1];
    nextBtn.disabled = orderIndex >= t('orders').length - 1;
  }
  function celebrate(kind) {
    wolf.className = `wolf happy ${kind === 'chips' ? 'invisible' : ''}`;
    setTimeout(() => { wolf.className = 'wolf'; }, 1200);
    sfx.good();
  }
  function checkOrder() {
    const [kind,, emoji] = t('orders')[orderIndex];
    if (angleClose(moonAngle, targetAngle(kind))) {
      if (!wonOrders.has(orderIndex)) { wonOrders.add(orderIndex); const s = document.createElement('span'); s.className = 'sticker'; s.textContent = emoji; stickers.appendChild(s); }
      speech.textContent = wonOrders.size === t('orders').length ? t('allOrders') : t('right');
      celebrate(kind);
    } else { speech.textContent = t('wrong'); wolf.className = 'wolf wrong'; setTimeout(() => { wolf.className = 'wolf'; }, 500); sfx.bad(); }
  }

  function makeCalendar() {
    const cards = $('#activityCards'), grid = $('#monthGrid'), feedback = $('#calendarFeedback');
    cards.innerHTML = ''; grid.innerHTML = ''; feedback.textContent = '';
    const done = new Set();
    t('activities').forEach(([id, name]) => {
      const c = document.createElement('div'); c.className = 'activity'; c.draggable = true; c.textContent = name; c.dataset.id = id;
      c.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', id); }); cards.appendChild(c);
    });
    for (let d = 1; d <= 30; d++) {
      const cell = document.createElement('button'); cell.className = 'day'; cell.type = 'button'; cell.textContent = d; cell.dataset.day = d;
      cell.addEventListener('dragenter', () => { setMoonAngle((d - 1) / 29 * Math.PI * 2); cell.classList.add('hot'); });
      cell.addEventListener('dragleave', () => cell.classList.remove('hot'));
      cell.addEventListener('dragover', (e) => e.preventDefault());
      cell.addEventListener('click', () => setMoonAngle((d - 1) / 29 * Math.PI * 2));
      cell.addEventListener('drop', (e) => {
        e.preventDefault(); cell.classList.remove('hot');
        const id = e.dataTransfer.getData('text/plain');
        const item = t('activities').find((a) => a[0] === id); if (!item) return;
        const ok = Math.abs(d - item[2]) <= 1;
        if (ok) { cell.classList.add('ok'); cell.textContent = `${d} · ${item[1]}`; done.add(id); document.querySelector(`.activity[data-id="${id}"]`)?.classList.add('done'); feedback.textContent = done.size === 4 ? t('calendarWin') : t('right'); sfx.good(); }
        else { feedback.textContent = t('calendarTry'); sfx.bad(); }
      });
      grid.appendChild(cell);
    }
  }

  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'; document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((n) => { const v = I18N[lang][n.dataset.t]; if (typeof v === 'string') n.textContent = v; });
    $('#langBtn').textContent = lang === 'zh' ? 'EN' : '中';
    tiltBtn.textContent = tiltOn ? t('tiltOn') : t('tiltOff'); tiltExplain.textContent = tiltOn ? t('tiltExplainOn') : t('tiltExplainOff');
    updateOrderText(); drawPhase(); updateLabels(); makeCalendar();
  }
  function applyTheme() {
    document.documentElement.dataset.theme = theme; $('#themeBtn').textContent = theme === 'light' ? '🌙' : '☀️';
    scene.background = new THREE.Color(cssVar('--space')); dispatchEvent(new CustomEvent('themechange', { detail: { theme } })); drawPhase();
  }

  function pointerXY(e) { const r = canvas.getBoundingClientRect(); pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1; pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1; }
  canvas.addEventListener('pointerdown', (e) => { pointerXY(e); raycaster.setFromCamera(pointer, camera); const hits = raycaster.intersectObject(moon); if (hits.length) { dragging = true; canvas.setPointerCapture(e.pointerId); } });
  canvas.addEventListener('pointermove', (e) => { if (!dragging) return; pointerXY(e); raycaster.setFromCamera(pointer, camera); if (raycaster.ray.intersectPlane(dragPlane, hit)) setMoonAngle(Math.atan2(hit.z, hit.x)); });
  canvas.addEventListener('pointerup', (e) => { dragging = false; try { canvas.releasePointerCapture(e.pointerId); } catch {} });

  checkBtn.addEventListener('click', checkOrder);
  nextBtn.addEventListener('click', () => { orderIndex = Math.min(orderIndex + 1, t('orders').length - 1); updateOrderText(); });
  tiltBtn.addEventListener('click', () => { tiltOn = !tiltOn; updateOrbitGeometry(); setMoonAngle(moonAngle); applyLang(); });
  $('#calendarOpen').addEventListener('click', () => { $('#calendarModal').hidden = false; makeCalendar(); });
  $('#closeCalendar').addEventListener('click', () => { $('#calendarModal').hidden = true; });
  $('#langBtn').addEventListener('click', () => { lang = lang === 'zh' ? 'en' : 'zh'; store.set(LS.lang, lang); applyLang(); });
  $('#themeBtn').addEventListener('click', () => { theme = theme === 'light' ? 'dark' : 'light'; store.set(LS.theme, theme); applyTheme(); });

  let actx = null;
  function tone(freq, dur = .12, type = 'sine', gain = .09, delay = 0) {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(), t0 = actx.currentTime + delay; o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(gain, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + dur); o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + dur + .02); } catch {}
  }
  const sfx = { good: () => [440, 660, 880].forEach((f, i) => tone(f, .12, 'triangle', .1, i * .06)), bad: () => tone(150, .18, 'sawtooth', .08), magic: () => [330, 495, 660, 990].forEach((f, i) => tone(f, .16, 'sine', .08, i * .08)) };
  addEventListener('pointerdown', () => { if (actx?.state === 'suspended') actx.resume(); }, { once: false });

  function resize() {
    const r = canvas.getBoundingClientRect(); renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false); camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix(); updateLabels();
  }
  addEventListener('resize', resize);
  addEventListener('themechange', drawPhase);

  function animate(time) {
    earth.rotation.y = time * .00035; earthLand.rotation.y = time * .00028; sun.rotation.y += .003;
    moon.rotation.y += .004; renderer.render(scene, camera); requestAnimationFrame(animate);
  }

  updateOrbitGeometry(); applyTheme(); applyLang(); resize(); setMoonAngle(Math.PI); requestAnimationFrame(animate);
})();
