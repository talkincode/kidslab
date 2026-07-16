import * as THREE from './vendor/three.module.min.js';
(() => {
  'use strict';
  const I18N = {
    zh: {
      doc: '地球调度员 · KidsLab',
      back: '返回平台',
      title: '地球调度员',
      eyebrow: '地球运行调度中心 · 新员工训练',
      tip0: '拖动视角观察，拨自转、推公转、掰地轴，亲手调出昼夜和四季。',
      nogl: '你的浏览器暂不支持 WebGL，请换一个支持 3D 的浏览器继续调度地球。',
      tiltNow: '地轴', dateNow: '日期', northSeason: '北半球',
      mainView: '主视角：拖拽绕行，滚轮缩放，双击聚焦地球',
      mainViewBtn: '主视角', groundViewBtn: '地面视角',
      spinDial: '自转拨盘', spinHelp: '让城市转进阳光，就是日出；转出阳光，就是夜晚。',
      orbitPush: '公转推杆', orbitHelp: '推地球绕太阳走，地轴方向保持不变，四季才会出现。',
      tiltKnob: '地轴倾斜旋钮', tiltHelp: '默认 23.5°。掰直为 0°，全球四季会瞬间熄灭。',
      spring: '春分', summer: '夏至', autumn: '秋分', winter: '冬至',
      clocks: '四城当地时间', dispatchDesk: '调度工单', nextMission: '下一张工单 →',
      surrender: '确认：这张工单做不到', setBeijing8: '把北京拨到 8:00',
      eternalEquinox: '永恒的春分', crazyWorld: '疯狂世界：90° 倾角',
      done: '盖章完成！', tryAgain: '还差一点，继续调度。',
      day: '白天', night: '夜晚', selected: '已选城市', altitude: '太阳高度', shadow: '影子约',
      groundHint: '地面视角：看太阳离地平线越高，正午影子越短。',
      seasons: { spring: '春', summer: '夏', autumn: '秋', winter: '冬', none: '四季熄灭' },
      cities: {
        beijing: '北京 🔴', sydney: '悉尼 🟡', london: '伦敦', newyork: '纽约', southpole: '南极圈 🐧',
      },
      missions: [
        { title: '让北京日出', body: '拖动地球表面或自转拨盘，让北京刚好从夜半球转进昼半球。标签贴在晨昏线附近就会盖章。' },
        { title: '让全世界都轮到白天', body: '继续拨自转，让地球完整转一圈。每座城市都会排队进入阳光，这就是昼夜交替。' },
        { title: '让悉尼入夏', body: '推公转到 12 月附近：南半球倾向太阳，悉尼夏天到了；同时北京却进入冬天。' },
        { title: '北京和悉尼同时过夏天？', body: '试试看：只靠真实地轴和公转做不到。北半球夏天时南半球冬天，反过来也一样。' },
        { title: '给企鹅一个不落的太阳', body: '把日期推到南半球夏至附近，南极圈 24 小时都在昼半球。切到南极圈视角验证太阳不落。' },
        { title: '掰直地轴', body: '明星工单：把 23.5° 调到 0°。四个公转位置都变成昼夜平分，季节仪表盘会熄灭；再试试 90° 的疯狂世界。' },
        { title: '时差接单', body: '把北京拨到 8:00。此时纽约大约几点？观察四城时间表，选出正确答案。' },
        { title: '影子侦探', body: '切地面视角，对比夏至和冬至的正午太阳高度。为什么冬天正午影子更长？' },
      ],
      answers: {
        tz: ['纽约约前一天 19:00', '纽约约当天 03:00', '纽约约当天 12:00'],
        shadow: ['冬天太阳高度低，光斜着照，影子更长', '冬天地球转得更慢，所以影子更长', '冬天太阳变小，所以影子更长'],
      },
    },
    en: {
      doc: 'Earth Dispatcher · KidsLab',
      back: 'Back to platform',
      title: 'Earth Dispatcher',
      eyebrow: 'Earth Operations · Rookie Dispatcher Training',
      tip0: 'Orbit the camera, spin Earth, push the year, and bend the axis to make day, night and seasons.',
      nogl: 'Your browser does not support WebGL. Please use a 3D-capable browser to dispatch Earth.',
      tiltNow: 'Axis', dateNow: 'Date', northSeason: 'Northern hemi.',
      mainView: 'Main view: drag to orbit, wheel to zoom, double-click to focus Earth',
      mainViewBtn: 'Main view', groundViewBtn: 'Ground view',
      spinDial: 'Rotation dial', spinHelp: 'Spin a city into sunlight for sunrise; spin it away for night.',
      orbitPush: 'Orbit pushbar', orbitHelp: 'Move Earth around the Sun. The axis keeps pointing the same way — that makes seasons.',
      tiltKnob: 'Axial tilt knob', tiltHelp: 'Default is 23.5°. Straighten it to 0° and seasons fade out everywhere.',
      spring: 'Equinox', summer: 'Jun solstice', autumn: 'Equinox', winter: 'Dec solstice',
      clocks: 'Local time in four cities', dispatchDesk: 'Dispatch tickets', nextMission: 'Next ticket →',
      surrender: 'Confirm: impossible ticket', setBeijing8: 'Set Beijing to 8:00',
      eternalEquinox: 'Eternal equinox', crazyWorld: 'Wild world: 90° tilt',
      done: 'Stamped complete!', tryAgain: 'Almost. Keep dispatching.',
      day: 'Day', night: 'Night', selected: 'Selected city', altitude: 'Sun altitude', shadow: 'Shadow about',
      groundHint: 'Ground view: the higher the Sun, the shorter the noon shadow.',
      seasons: { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter', none: 'Seasons off' },
      cities: {
        beijing: 'Beijing 🔴', sydney: 'Sydney 🟡', london: 'London', newyork: 'New York', southpole: 'Antarctic Circle 🐧',
      },
      missions: [
        { title: 'Give Beijing a sunrise', body: 'Drag Earth or the rotation dial until Beijing just moves from the night side into daylight. The city label should sit near the terminator.' },
        { title: 'Let every city get daylight', body: 'Keep spinning Earth through one full turn. Every city takes a shift in the sunlight — day and night alternate.' },
        { title: 'Bring summer to Sydney', body: 'Push the orbit to December: the Southern Hemisphere leans toward the Sun, so Sydney gets summer while Beijing gets winter.' },
        { title: 'Can Beijing and Sydney both have summer?', body: 'Try it: with the real axis and orbit, it cannot be done. When the north has summer, the south has winter, and vice versa.' },
        { title: 'Give penguins a Sun that never sets', body: 'Move to the Southern Hemisphere summer solstice. The Antarctic Circle stays in daylight for 24 hours. Ground view verifies the Sun does not set.' },
        { title: 'Straighten the axis', body: 'Star ticket: turn 23.5° down to 0°. All four orbit positions split day and night evenly and the season gauge goes dark; then try the wild 90° world.' },
        { title: 'Time-zone dispatch', body: 'Set Beijing to 8:00. What time is it in New York? Read the city clocks and choose the answer.' },
        { title: 'Shadow detective', body: 'Use ground view and compare noon Sun altitude at solstices. Why are noon shadows longer in winter?' },
      ],
      answers: {
        tz: ['New York is about previous day 19:00', 'New York is about same day 03:00', 'New York is about same day 12:00'],
        shadow: ['Winter Sun is lower, so light arrives at a slant and shadows grow longer', 'Earth spins slower in winter, so shadows grow longer', 'The Sun gets smaller in winter, so shadows grow longer'],
      },
    },
  };
  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* 忽略 */ } },
  };
  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme)
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme !== 'light' && theme !== 'dark') theme = 'light';
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const langBtn = document.getElementById('langBtn'), themeBtn = document.getElementById('themeBtn');
  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((n) => {
      const v = I18N[lang][n.dataset.t];
      if (typeof v === 'string') n.textContent = v;
    });
    if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    refreshStaticUi();
    render();
  }
  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    render();
  }
  langBtn?.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    store.set(LS.lang, lang);
    applyLang();
  });
  themeBtn?.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set(LS.theme, theme);
    applyTheme();
  });
  const TAU = Math.PI * 2, DEG = Math.PI / 180, RAD = 180 / Math.PI;
  const EARTH_R = 2.25, ORBIT_R = 8.8, DEFAULT_TILT = 23.5;
  const SPRING_DAY = 80, SUMMER_DAY = 172, AUTUMN_DAY = 265, WINTER_DAY = 355;
  const $ = (id) => document.getElementById(id);
  const canvas = $('scene');
  const labelLayer = $('labelLayer');
  const spinSlider = $('spinSlider');
  const daySlider = $('daySlider');
  const tiltSlider = $('tiltSlider');
  const spinOut = $('spinOut');
  const dayOut = $('dayOut');
  const tiltOut = $('tiltOut');
  const tiltRead = $('tiltRead');
  const dateRead = $('dateRead');
  const seasonBadge = $('seasonBadge');
  const clockRows = $('clockRows');
  const cityPicker = $('cityPicker');
  const missionTitle = $('missionTitle');
  const missionBody = $('missionBody');
  const missionActions = $('missionActions');
  const answerRow = $('answerRow');
  const nextMission = $('nextMission');
  const stampRow = $('stampRow');
  const stageCard = $('stageCard');
  const groundPanel = $('groundPanel');
  const groundTitle = $('groundTitle');
  const groundStats = $('groundStats');
  const sunDot = $('sunDot');
  const mainViewBtn = $('mainViewBtn');
  const groundViewBtn = $('groundViewBtn');
  const viewChip = $('viewChip');
  const cities = [
    { id: 'beijing', lat: 39.9, lon: 116.4, color: 0xff3b30, emoji: '🔴' },
    { id: 'sydney', lat: -33.9, lon: 151.2, color: 0xffd60a, emoji: '🟡' },
    { id: 'london', lat: 51.5, lon: -0.1, color: 0xffffff, emoji: '⚪' },
    { id: 'newyork', lat: 40.7, lon: -74.0, color: 0x44a7ff, emoji: '🔵' },
    { id: 'southpole', lat: -66.5, lon: 30, color: 0xbaf3ff, emoji: '🐧' },
  ];
  const state = {
    spin: 0,
    day: SUMMER_DAY,
    tilt: DEFAULT_TILT,
    selectedCity: 'beijing',
    mission: 0,
    completed: Array(8).fill(false),
    view: 'main',
    totalSpinTravel: 0,
    lastSpin: 0,
    magicZeroSeen: false,
    magicNinetySeen: false,
    cameraTarget: new THREE.Vector3(0, 0, 0),
  };
  const missionRuntime = {
    tzAnswered: false,
    shadowAnswered: false,
    impossibleAcknowledged: false,
  };
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    $('nogl').hidden = false;
    canvas.remove();
    throw new Error('WebGL unavailable');
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 160);
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const clock = new THREE.Clock();
  const root = new THREE.Group();
  const orbitGroup = new THREE.Group();
  const earthContainer = new THREE.Group();
  const spinGroup = new THREE.Group();
  const globeGroup = new THREE.Group();
  const labels3d = [];
  scene.add(root);
  root.add(orbitGroup);
  orbitGroup.add(earthContainer);
  earthContainer.add(spinGroup);
  spinGroup.add(globeGroup);
  const ambient = new THREE.AmbientLight(0xffffff, 0.19);
  const sunLight = new THREE.PointLight(0xffffff, 3.4, 80, 1.2);
  scene.add(ambient, sunLight);
  const dotTexture = makeSoftCircleTexture(128);
  const earthTexture = makeEarthTexture();
  const nightTexture = makeNightTexture();
  const earthMat = new THREE.MeshLambertMaterial({ map: earthTexture });
  const globe = new THREE.Mesh(new THREE.SphereGeometry(EARTH_R, 96, 64), earthMat);
  globeGroup.add(globe);
  const nightShell = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_R * 1.004, 96, 64),
    new THREE.MeshBasicMaterial({ map: nightTexture, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending })
  );
  globeGroup.add(nightShell);
  const terminator = makeTerminatorRing();
  earthContainer.add(terminator);
  const axisRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, EARTH_R * 3.1, 16),
    new THREE.MeshBasicMaterial({ color: 0xfff3a0 })
  );
  const northTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 0.38, 24),
    new THREE.MeshBasicMaterial({ color: 0xff6b35 })
  );
  northTip.position.y = EARTH_R * 1.65;
  axisRod.add(northTip);
  spinGroup.add(axisRod);
  const equator = makeLatitudeRing(0, 0xffffff, 0.23);
  const arctic = makeLatitudeRing(66.5, 0x9be7ff, 0.45);
  const antarctic = makeLatitudeRing(-66.5, 0x9be7ff, 0.45);
  globeGroup.add(equator, arctic, antarctic);
  const cityMeshes = new Map();
  const cityLabels = new Map();
  for (const city of cities) addCityMarker(city);
  const sun = makeSun();
  root.add(sun);
  sunLight.position.set(0, 0, 0);
  const orbitLine = makeOrbitLine();
  root.add(orbitLine);
  const seasonMarkers = makeSeasonMarkers();
  seasonMarkers.forEach((m) => root.add(m));
  const starField = makeStarField();
  scene.add(starField);
  const cameraCtl = {
    theta: -0.72,
    phi: 1.05,
    radius: 18.5,
    minRadius: 7,
    maxRadius: 34,
    dragging: false,
    dragMode: 'camera',
    lastX: 0,
    lastY: 0,
    pinchDist: 0,
  };
  function makeSoftCircleTexture(size) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.38, 'rgba(255,255,255,.72)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  function makeEarthTexture() {
    const c = document.createElement('canvas');
    c.width = 2048; c.height = 1024;
    const g = c.getContext('2d');
    const sea = g.createLinearGradient(0, 0, 0, c.height);
    sea.addColorStop(0, '#75d7ff'); sea.addColorStop(0.48, '#2b95d6'); sea.addColorStop(1, '#1268ad');
    g.fillStyle = sea; g.fillRect(0, 0, c.width, c.height);
    g.globalAlpha = 0.22;
    for (let y = 60; y < c.height; y += 95) {
      g.beginPath();
      for (let x = 0; x <= c.width; x += 20) {
        const yy = y + Math.sin(x * 0.018 + y) * 8;
        if (x === 0) g.moveTo(x, yy); else g.lineTo(x, yy);
      }
      g.strokeStyle = '#ffffff'; g.lineWidth = 3; g.stroke();
    }
    g.globalAlpha = 1;
    const land = '#4bb45f';
    const land2 = '#82c85c';
    const edge = 'rgba(30,78,58,.45)';
    const poly = (pts, fill = land) => {
      g.beginPath();
      pts.forEach(([lon, lat], i) => {
        const [x, y] = llToUv(lon, lat, c.width, c.height);
        if (i) g.lineTo(x, y); else g.moveTo(x, y);
      });
      g.closePath(); g.fillStyle = fill; g.fill(); g.strokeStyle = edge; g.lineWidth = 7; g.stroke();
    };
    poly([[-168, 65], [-138, 72], [-105, 58], [-62, 52], [-54, 25], [-84, 12], [-102, 22], [-124, 34], [-150, 48]], land2);
    poly([[-81, 12], [-58, 5], [-42, -18], [-52, -42], [-70, -55], [-78, -20]], land);
    poly([[-18, 35], [10, 70], [45, 62], [34, 35], [50, 10], [35, -35], [15, -35], [4, 2]], land2);
    poly([[-10, 36], [35, 34], [52, 12], [42, -8], [28, -34], [13, -35], [2, -5]], land);
    poly([[32, 70], [88, 72], [142, 58], [154, 35], [118, 20], [88, 8], [68, 25], [42, 32]], land2);
    poly([[64, 28], [92, 22], [106, 5], [82, -8], [70, 6]], land);
    poly([[111, -10], [154, -17], [151, -39], [122, -44], [112, -28]], '#d5b15c');
    poly([[-180, -63], [-90, -72], [0, -65], [90, -72], [180, -63], [180, -86], [-180, -86]], '#eaf8f8');
    poly([[-55, 84], [40, 82], [130, 84], [180, 80], [180, 90], [-180, 90], [-180, 82]], '#eaf8f8');
    for (const city of cities) {
      const [x, y] = llToUv(city.lon, city.lat, c.width, c.height);
      g.beginPath(); g.arc(x, y, city.id === 'southpole' ? 8 : 10, 0, TAU);
      g.fillStyle = `#${new THREE.Color(city.color).getHexString()}`; g.fill();
      g.lineWidth = 5; g.strokeStyle = '#1c2a38'; g.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }
  function makeNightTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    g.fillStyle = 'rgba(0,0,0,0)'; g.fillRect(0, 0, c.width, c.height);
    const clusters = [[116, 40], [151, -34], [0, 52], [-74, 41], [78, 22], [10, 50], [139, 36]];
    for (const [lon, lat] of clusters) {
      const [cx, cy] = llToUv(lon, lat, c.width, c.height);
      for (let i = 0; i < 55; i++) {
        const x = cx + (Math.random() - 0.5) * 90;
        const y = cy + (Math.random() - 0.5) * 48;
        g.beginPath(); g.arc(x, y, 1 + Math.random() * 2.2, 0, TAU);
        g.fillStyle = `rgba(255,219,126,${0.25 + Math.random() * 0.55})`; g.fill();
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  function llToUv(lon, lat, w, h) {
    return [((lon + 180) / 360) * w, ((90 - lat) / 180) * h];
  }
  function localPos(lat, lon, r = EARTH_R) {
    const la = lat * DEG;
    const lo = lon * DEG;
    return new THREE.Vector3(
      Math.cos(la) * Math.sin(lo) * r,
      Math.sin(la) * r,
      Math.cos(la) * Math.cos(lo) * r
    );
  }
  function makeLatitudeRing(lat, color, opacity) {
    const pts = [];
    const y = Math.sin(lat * DEG) * EARTH_R;
    const rr = Math.cos(lat * DEG) * EARTH_R;
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * TAU;
      pts.push(new THREE.Vector3(Math.sin(a) * rr, y, Math.cos(a) * rr));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  }
  function makeTerminatorRing() {
    const pts = [];
    for (let i = 0; i <= 192; i++) {
      const a = (i / 192) * TAU;
      pts.push(new THREE.Vector3(Math.cos(a) * EARTH_R * 1.012, Math.sin(a) * EARTH_R * 1.012, 0));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 }));
  }
  function makeSun() {
    const grp = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.86, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0xffc857 })
    );
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: dotTexture, color: 0xffb13b, transparent: true, opacity: 0.72,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    glow.scale.setScalar(5.2);
    grp.add(core, glow);
    return grp;
  }
  function makeOrbitLine() {
    const pts = [];
    for (let i = 0; i <= 256; i++) {
      const a = (i / 256) * TAU;
      pts.push(new THREE.Vector3(Math.cos(a) * ORBIT_R, 0, Math.sin(a) * ORBIT_R));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineDashedMaterial({ color: 0x8bd3ff, dashSize: 0.35, gapSize: 0.22, transparent: true, opacity: 0.72 });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    return line;
  }
  function makeSeasonMarkers() {
    const list = [
      { day: SPRING_DAY, key: 'spring', color: 0x8eea7a },
      { day: SUMMER_DAY, key: 'summer', color: 0xffd166 },
      { day: AUTUMN_DAY, key: 'autumn', color: 0xff8f45 },
      { day: WINTER_DAY, key: 'winter', color: 0x8bd3ff },
    ];
    return list.map((m) => {
      const a = dayToOrbitAngle(m.day);
      const grp = new THREE.Group();
      grp.position.set(Math.cos(a) * ORBIT_R, 0, Math.sin(a) * ORBIT_R);
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.08), new THREE.MeshBasicMaterial({ color: m.color }));
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTexture, color: m.color, transparent: true, opacity: 0.4 }));
      halo.scale.setScalar(0.9);
      grp.add(tick, halo);
      labels3d.push({ object: grp, key: m.key, kind: 'season' });
      return grp;
    });
  }
  function makeStarField() {
    const geo = new THREE.BufferGeometry();
    const count = 900;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 36 + Math.random() * 45;
      const a = Math.random() * TAU;
      const y = (Math.random() - 0.5) * 34;
      pos.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3);
      c.setHSL(0.55 + Math.random() * 0.14, 0.55, 0.72 + Math.random() * 0.25);
      col.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.18, map: dotTexture, vertexColors: true, transparent: true, opacity: 0.82, depthWrite: false }));
  }
  function addCityMarker(city) {
    const marker = new THREE.Group();
    const p = localPos(city.lat, city.lon, EARTH_R * 1.012);
    marker.position.copy(p);
    marker.lookAt(new THREE.Vector3(0, 0, 0));
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(city.id === 'southpole' ? 0.075 : 0.09, 18, 12),
      new THREE.MeshBasicMaterial({ color: city.color })
    );
    marker.add(dot);
    globeGroup.add(marker);
    cityMeshes.set(city.id, marker);
    const el = document.createElement('div');
    el.className = 'city-label';
    labelLayer.appendChild(el);
    cityLabels.set(city.id, el);
  }
  function dayToOrbitAngle(day) {
    return ((day - SUMMER_DAY) / 365) * TAU + Math.PI;
  }
  function orbitAngleToDay(angle) {
    return (((angle - Math.PI) / TAU) * 365 + SUMMER_DAY + 3650) % 365;
  }
  function axisVector() {
    const tilt = state.tilt * DEG;
    return new THREE.Vector3(Math.sin(tilt), Math.cos(tilt), 0).normalize();
  }
  function sunDirectionFromEarth() {
    return earthContainer.position.clone().multiplyScalar(-1).normalize();
  }
  function solarDeclination() {
    const dot = THREE.MathUtils.clamp(axisVector().dot(sunDirectionFromEarth()), -1, 1);
    return Math.asin(dot) * RAD;
  }
  function localSunVectorInGlobe() {
    const invAxis = spinGroup.quaternion.clone().invert();
    const invSpin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -state.spin);
    return sunDirectionFromEarth().clone().applyQuaternion(invAxis).applyQuaternion(invSpin).normalize();
  }
  function subsolarLongitude() {
    const s = localSunVectorInGlobe();
    return Math.atan2(s.x, s.z) * RAD;
  }
  function localTime(city) {
    const hours = 12 + angleDeltaDeg(city.lon, subsolarLongitude()) / 15;
    return wrapHours(hours);
  }
  function cityWorldNormal(city) {
    return localPos(city.lat, city.lon, 1)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), state.spin)
      .applyQuaternion(spinGroup.quaternion)
      .normalize();
  }
  function cityLight(city) {
    return cityWorldNormal(city).dot(sunDirectionFromEarth());
  }
  function wrapHours(h) {
    return ((h % 24) + 24) % 24;
  }
  function angleDeltaDeg(a, b) {
    let d = a - b;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    return d;
  }
  function setSpinForCityTime(cityId, targetHour) {
    const city = cities.find((c) => c.id === cityId);
    if (!city) return;
    for (let i = 0; i < 5; i++) {
      const now = localTime(city);
      const diff = angleDeltaDeg((targetHour - now) * 15, 0) * DEG;
      setSpin(state.spin + diff);
    }
  }
  function setSpin(value) {
    const next = ((value % TAU) + TAU) % TAU;
    let d = next - state.lastSpin;
    if (d > Math.PI) d -= TAU;
    if (d < -Math.PI) d += TAU;
    if (Math.abs(d) < Math.PI) state.totalSpinTravel += Math.abs(d);
    state.spin = next;
    state.lastSpin = next;
    spinSlider.value = String(Math.round(next * RAD));
  }
  function setDay(day) {
    state.day = THREE.MathUtils.clamp(day, 0, 365);
    daySlider.value = String(Math.round(state.day));
  }
  function setTilt(tilt) {
    state.tilt = THREE.MathUtils.clamp(tilt, 0, 90);
    tiltSlider.value = String(state.tilt);
    if (state.tilt <= 0.75) state.magicZeroSeen = true;
    if (state.tilt >= 88.5) state.magicNinetySeen = true;
  }
  function northernSeason() {
    if (state.tilt < 1) return 'none';
    const d = state.day;
    if (d >= SPRING_DAY && d < SUMMER_DAY) return 'spring';
    if (d >= SUMMER_DAY && d < AUTUMN_DAY) return 'summer';
    if (d >= AUTUMN_DAY && d < WINTER_DAY) return 'autumn';
    return 'winter';
  }
  function formatDate(day) {
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let n = Math.round(day);
    let m = 0;
    while (m < 11 && n >= monthDays[m]) { n -= monthDays[m]; m++; }
    return lang === 'zh' ? `${m + 1}月${n + 1}日` : `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m]} ${n + 1}`;
  }
  function fmtHour(h) {
    const total = Math.round(wrapHours(h) * 60);
    const hh = Math.floor(total / 60) % 24;
    const mm = total % 60;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }
  function approxShadow(altDeg) {
    if (altDeg <= 1) return '∞';
    return `${(1 / Math.tan(altDeg * DEG)).toFixed(1)}×`;
  }
  function refreshStaticUi() {
    cityPicker.innerHTML = '';
    cities.forEach((city) => {
      const btn = document.createElement('button');
      btn.className = 'city-btn';
      btn.type = 'button';
      btn.dataset.city = city.id;
      btn.textContent = t('cities')[city.id];
      btn.addEventListener('click', () => {
        state.selectedCity = city.id;
        focusEarth();
        render();
      });
      cityPicker.appendChild(btn);
    });
    stampRow.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('span');
      s.className = 'stamp';
      s.textContent = i + 1;
      stampRow.appendChild(s);
    }
    buildMissionActions();
  }
  function buildMissionActions() {
    missionActions.innerHTML = '';
    answerRow.innerHTML = '';
    const m = state.mission;
    if (m === 3) {
      const b = actionButton(t('surrender'), () => {
        missionRuntime.impossibleAcknowledged = true;
        completeMission(3);
      }, false);
      missionActions.appendChild(b);
    }
    if (m === 6) {
      missionActions.appendChild(actionButton(t('setBeijing8'), () => {
        setSpinForCityTime('beijing', 8);
        render();
      }, true));
      t('answers').tz.forEach((text, idx) => {
        answerRow.appendChild(answerButton(text, idx === 0, () => {
          missionRuntime.tzAnswered = idx === 0;
          if (idx === 0 && Math.abs(localTime(cities[0]) - 8) < 0.35) completeMission(6);
        }));
      });
    }
    if (m === 7) {
      t('answers').shadow.forEach((text, idx) => {
        answerRow.appendChild(answerButton(text, idx === 0, () => {
          missionRuntime.shadowAnswered = idx === 0;
          if (idx === 0) completeMission(7);
        }));
      });
    }
  }
  function actionButton(text, fn, ghost) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `btn ${ghost ? 'btn--ghost' : ''}`;
    b.textContent = text;
    b.addEventListener('click', fn);
    return b;
  }
  function answerButton(text, correct, fn) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'answer';
    b.textContent = text;
    b.addEventListener('click', () => {
      [...answerRow.children].forEach((n) => n.classList.remove('correct', 'wrong'));
      b.classList.add(correct ? 'correct' : 'wrong');
      fn();
      render();
    });
    return b;
  }
  spinSlider.addEventListener('input', () => {
    setSpin(Number(spinSlider.value) * DEG);
    render();
  });
  daySlider.addEventListener('input', () => {
    setDay(Number(daySlider.value));
    render();
  });
  tiltSlider.addEventListener('input', () => {
    setTilt(Number(tiltSlider.value));
    if (state.magicZeroSeen || state.magicNinetySeen) stageCard.classList.add('magic-flash');
    render();
  });
  stageCard.addEventListener('animationend', () => stageCard.classList.remove('magic-flash'));
  nextMission.addEventListener('click', () => {
    if (state.mission < 7 && state.completed[state.mission]) {
      state.mission += 1;
      buildMissionActions();
      render();
    }
  });
  mainViewBtn.addEventListener('click', () => {
    state.view = 'main';
    render();
  });
  groundViewBtn.addEventListener('click', () => {
    state.view = 'ground';
    render();
  });
  const activePointers = new Map();
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    cameraCtl.dragging = true;
    cameraCtl.lastX = e.clientX;
    cameraCtl.lastY = e.clientY;
    cameraCtl.dragMode = hitEarth(e) ? 'spin' : 'camera';
    if (activePointers.size === 2) cameraCtl.pinchDist = pointerDistance();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!cameraCtl.dragging) return;
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.size === 2) {
      const d = pointerDistance();
      if (cameraCtl.pinchDist) cameraCtl.radius = THREE.MathUtils.clamp(cameraCtl.radius * (cameraCtl.pinchDist / d), cameraCtl.minRadius, cameraCtl.maxRadius);
      cameraCtl.pinchDist = d;
      render();
      return;
    }
    const dx = e.clientX - cameraCtl.lastX;
    const dy = e.clientY - cameraCtl.lastY;
    cameraCtl.lastX = e.clientX;
    cameraCtl.lastY = e.clientY;
    if (cameraCtl.dragMode === 'spin') setSpin(state.spin + dx * 0.012);
    else {
      cameraCtl.theta -= dx * 0.006;
      cameraCtl.phi = THREE.MathUtils.clamp(cameraCtl.phi + dy * 0.005, 0.24, Math.PI - 0.24);
    }
    render();
  });
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    cameraCtl.radius = THREE.MathUtils.clamp(cameraCtl.radius + e.deltaY * 0.015, cameraCtl.minRadius, cameraCtl.maxRadius);
  }, { passive: false });
  canvas.addEventListener('dblclick', focusEarth);
  function endPointer(e) {
    activePointers.delete(e.pointerId);
    if (!activePointers.size) {
      cameraCtl.dragging = false;
      cameraCtl.pinchDist = 0;
    }
  }
  function pointerDistance() {
    const pts = [...activePointers.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }
  function hitEarth(e) {
    const rect = canvas.getBoundingClientRect();
    pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    return raycaster.intersectObject(globe, false).length > 0;
  }
  function focusEarth() {
    const target = earthContainer.position.clone();
    state.cameraTarget.copy(target);
    cameraCtl.radius = THREE.MathUtils.clamp(11.5, cameraCtl.minRadius, cameraCtl.maxRadius);
  }
  function updateWorld() {
    const a = dayToOrbitAngle(state.day);
    earthContainer.position.set(Math.cos(a) * ORBIT_R, 0, Math.sin(a) * ORBIT_R);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), axisVector());
    spinGroup.quaternion.copy(q);
    globeGroup.rotation.y = state.spin;
    const sunDir = sunDirectionFromEarth();
    terminator.position.set(0, 0, 0);
    terminator.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), sunDir);
    terminator.material.opacity = state.tilt < 1 ? 0.85 : 0.55;
    const target = state.view === 'ground' ? earthContainer.position : state.cameraTarget;
    const x = target.x + cameraCtl.radius * Math.sin(cameraCtl.phi) * Math.sin(cameraCtl.theta);
    const y = target.y + cameraCtl.radius * Math.cos(cameraCtl.phi);
    const z = target.z + cameraCtl.radius * Math.sin(cameraCtl.phi) * Math.cos(cameraCtl.theta);
    camera.position.set(x, y, z);
    camera.lookAt(target);
  }
  function render() {
    updateWorld();
    updateHud();
    updateLabels();
    updateGroundPanel();
    checkMissions();
  }
  function updateHud() {
    const tiltTxt = `${state.tilt.toFixed(state.tilt % 1 ? 1 : 0)}°`;
    tiltOut.textContent = tiltTxt;
    tiltRead.textContent = tiltTxt;
    spinOut.textContent = `${Math.round(state.spin * RAD)}°`;
    dayOut.textContent = `Day ${Math.round(state.day)}`;
    dateRead.textContent = formatDate(state.day);
    const season = northernSeason();
    seasonBadge.querySelector('b').textContent = t('seasons')[season];
    seasonBadge.classList.toggle('off', season === 'none');
    if (state.tilt >= 88.5) $('magicHint').textContent = t('crazyWorld');
    else if (state.tilt <= 0.75) $('magicHint').textContent = t('eternalEquinox');
    else $('magicHint').textContent = t('tiltHelp');
    clockRows.innerHTML = '';
    for (const city of cities.slice(0, 4)) {
      const row = document.createElement('div');
      row.className = 'clock-row';
      const lit = cityLight(city) > 0;
      row.innerHTML = `<span>${t('cities')[city.id]}</span><small>${fmtHour(localTime(city))}</small><i class="day-dot ${lit ? '' : 'night'}"></i>`;
      clockRows.appendChild(row);
    }
    document.querySelectorAll('.city-btn').forEach((b) => b.classList.toggle('active', b.dataset.city === state.selectedCity));
    mainViewBtn.classList.toggle('active', state.view === 'main');
    groundViewBtn.classList.toggle('active', state.view === 'ground');
    groundPanel.hidden = state.view !== 'ground';
    viewChip.textContent = state.view === 'ground' ? t('groundHint') : t('mainView');
  }
  function updateLabels() {
    const rect = canvas.getBoundingClientRect();
    const sunDir = sunDirectionFromEarth();
    for (const city of cities) {
      const marker = cityMeshes.get(city.id);
      const el = cityLabels.get(city.id);
      marker.getWorldPosition(tmpV1);
      tmpV2.copy(tmpV1).project(camera);
      const visible = tmpV2.z < 1 && tmpV2.z > -1;
      el.style.display = visible ? 'block' : 'none';
      if (!visible) continue;
      el.style.left = `${(tmpV2.x * 0.5 + 0.5) * rect.width}px`;
      el.style.top = `${(-tmpV2.y * 0.5 + 0.5) * rect.height}px`;
      el.textContent = t('cities')[city.id];
      el.classList.toggle('night', cityLight(city) <= 0);
      el.classList.toggle('selected', city.id === state.selectedCity);
    }
    seasonMarkers.forEach((m, i) => {
      const label = labels3d[i];
      if (!label.el) {
        label.el = document.createElement('div');
        label.el.className = 'city-label';
        labelLayer.appendChild(label.el);
      }
      m.getWorldPosition(tmpV1);
      tmpV1.y += 0.7;
      tmpV2.copy(tmpV1).project(camera);
      label.el.style.display = tmpV2.z < 1 ? 'block' : 'none';
      label.el.style.left = `${(tmpV2.x * 0.5 + 0.5) * rect.width}px`;
      label.el.style.top = `${(-tmpV2.y * 0.5 + 0.5) * rect.height}px`;
      label.el.textContent = t(label.key);
    });
    void sunDir;
  }
  const tmpV1 = new THREE.Vector3(), tmpV2 = new THREE.Vector3();
  function updateGroundPanel() {
    const city = cities.find((c) => c.id === state.selectedCity) || cities[0];
    const alt = Math.asin(THREE.MathUtils.clamp(cityLight(city), -1, 1)) * RAD;
    const x = 50 + angleDeltaDeg(city.lon, subsolarLongitude()) / 180 * 48;
    const y = 70 - THREE.MathUtils.clamp(alt, -10, 90) / 100 * 72;
    sunDot.style.left = `${THREE.MathUtils.clamp(x, 5, 95)}%`;
    sunDot.style.top = `${THREE.MathUtils.clamp(y, 8, 94)}%`;
    groundTitle.textContent = `${t('selected')} · ${t('cities')[city.id]}`;
    groundStats.textContent = `${t('altitude')}: ${alt.toFixed(1)}° · ${t('shadow')}: ${approxShadow(alt)} · ${fmtHour(localTime(city))} ${cityLight(city) > 0 ? t('day') : t('night')}`;
  }
  function checkMissions() {
    const mission = t('missions')[state.mission];
    missionTitle.textContent = mission.title;
    missionBody.textContent = mission.body;
    [...stampRow.children].forEach((s, i) => s.classList.toggle('done', state.completed[i]));
    nextMission.disabled = !state.completed[state.mission] || state.mission >= 7;
    if (state.completed[state.mission]) return;
    const bj = cities[0];
    const syd = cities[1];
    switch (state.mission) {
      case 0:
        if (localTime(bj) > 5.25 && localTime(bj) < 6.9 && Math.abs(cityLight(bj)) < 0.22) completeMission(0);
        break;
      case 1:
        if (state.totalSpinTravel >= TAU * 0.96) completeMission(1);
        break;
      case 2:
        if ((state.day >= 330 || state.day <= 25) && cityLight(syd) > 0.2 && state.tilt > 12) completeMission(2);
        break;
      case 4:
        if ((state.day >= 330 || state.day <= 25) && state.tilt > 20 && state.selectedCity === 'southpole') completeMission(4);
        break;
      case 5:
        if (state.magicZeroSeen && state.tilt <= 1) completeMission(5);
        break;
      default:
        break;
    }
  }
  function completeMission(i) {
    if (state.completed[i]) return;
    state.completed[i] = true;
    const old = missionBody.textContent;
    missionBody.textContent = `${t('done')} ${old}`;
    if (i === 5) stageCard.classList.add('magic-flash');
  }
  function resize() {
    const rect = stageCard.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    render();
  }
  function applySceneTheme() {
    const top = new THREE.Color(cssVar('--space-top'));
    const bottom = new THREE.Color(cssVar('--space-bottom'));
    scene.background = top.clone().lerp(bottom, 0.45);
    scene.fog = new THREE.FogExp2(scene.background, theme === 'dark' ? 0.014 : 0.018);
    orbitLine.material.color.set(cssVar('--orbit'));
  }
  addEventListener('resize', resize);
  addEventListener('themechange', () => applySceneTheme());
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) clock.getDelta();
  });
  function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const tm = clock.elapsedTime;
    sun.rotation.y += dt * 0.2;
    starField.rotation.y += dt * 0.006;
    if (!cameraCtl.dragging) {
      cameraCtl.theta += Math.sin(tm * 0.18) * 0.0006;
    }
    updateWorld();
    renderer.render(scene, camera);
    updateLabels();
  }
  setSpin(0);
  setDay(SUMMER_DAY);
  setTilt(DEFAULT_TILT);
  state.cameraTarget.set(0, 0, 0);
  applyTheme();
  applyLang();
  applySceneTheme();
  resize();
  loop();
})();
