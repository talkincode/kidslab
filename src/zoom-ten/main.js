import * as THREE from './vendor/three.module.min.js';

/* ============================================================
   数字宇宙 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '数字宇宙 · KidsLab',
      back: '返回平台',
      title: '数字宇宙',
      tip0: '滚轮 / 捏合 / 点击宇宙电梯：每一层都是 ×10，数位就是宇宙的楼层。',
      dockKicker: '当前停靠站',
      quizKicker: '估算小卡',
      challengeTitle: '电梯直达 · 单位换算',
      home: '一键回家',
      challenge: '单位换算挑战',
      soundOn: '声音：开',
      soundOff: '声音：关',
      nogl: '你的浏览器暂不支持 WebGL，但数字宇宙仍在：试试更新浏览器或换一台设备 ✨',
      floor: (n) => `${n >= 0 ? '+' : ''}${n} 层`,
      scaleLine: '数位就是宇宙的楼层',
      quizDone: '这枚邮票已经收集啦，继续搭电梯去别的楼层吧。',
      correct: '答对！邮票入册 ✨',
      wrong: '差一点，估算先看“有几个 0”。',
      revealSeats: '座位粒子点亮：一个体育场常常是“万”级。',
      homeLaunch: '从银河系俯冲回家——抓紧扶手！',
      homeLand: '到家！1 米的小朋友，是认识大数和小数的起点。',
      challengeOk: '直达成功！单位每换一级，小数点就搬家。',
      challengeNo: '再想想：km→m 是 ×1000，m→cm 是 ×100。',
      placeSmall: (p) => `${p} 位 · 小数楼层`,
      placeBig: (p) => `${p} 位 · 大数楼层`,
      enUnit: '',
      stations: {
        '-3': ['蚂蚁的眼睛', '1 毫米：复眼像一座闪闪发亮的小体育场，每个小面都在接收光。'],
        '-2': ['瓢虫', '1 厘米：瓢虫背上的斑点，已经能用尺子轻轻量出来。'],
        '-1': ['一朵花', '0.1 米：十厘米的花，提醒我们小数点右边也有楼层。'],
        '0': ['小朋友', '1 米：从自己出发，往上走是大数，往下走是小数。'],
        '1': ['大树', '10 米：一棵树大约是十个 1 米叠起来。'],
        '2': ['操场 / 体育场', '100 米：跑道、座位和欢呼声，开始进入“百”的世界。'],
        '3': ['街区', '1 000 米：一公里，十个百米连成一段上学路。'],
        '4': ['城市', '10 000 米：一万米，中文大数第一次换“万”级。'],
        '5': ['大地 / 山脉', '100 000 米：十万米，山脉像皱起来的地毯。'],
        '6': ['国家轮廓', '1 000 000 米：百万米，地图上的线条变成主角。'],
        '7': ['地球', '10 000 000 米：千万米，蓝色星球正好能装进镜头。'],
        '8': ['地月之间', '100 000 000 米：地月距离约 3.8 亿米，“亿”不再抽象。'],
        '9': ['太阳系内圈', '1 000 000 000 米：十亿米，行星轨道像发光的圆环。'],
        '11': ['全太阳系', '100 000 000 000 米：千亿米，外圈行星也进入同一张地图。'],
        '16': ['邻近恒星', '10 000 000 000 000 000 米：恒星之间，是用光年当尺子的距离。'],
        '21': ['银河系', '10²¹ 米：旋臂像盛开的烟花，人类的家只是其中一点。'],
      },
      quizzes: {
        '-3': ['蚂蚁复眼里“小镜片”的数量大约可能是？', ['5 个', '几百个', '一亿个'], 1, '很多昆虫的复眼由许多小眼组成，是“百/千”级的微小世界。'],
        '-2': ['1 厘米等于多少毫米？', ['10 毫米', '100 毫米', '1 000 毫米'], 0, '厘米到毫米是 ×10，小数楼层向下走一层。'],
        '-1': ['0.1 米也可以写成？', ['1 厘米', '10 厘米', '100 厘米'], 1, '0.1 m = 10 cm，小数点移动很有用。'],
        '1': ['一棵 10 米高的大树，约等于几个 1 米小朋友叠高？', ['1 个', '10 个', '100 个'], 1, '10 米就是 10 个 1 米。'],
        '2': ['大型体育场能坐多少人更合理？', ['2 千', '2 万', '200 万'], 1, '体育场常是“万”级，座位粒子正在点亮。'],
        '3': ['1 公里等于多少米？', ['100 米', '1 000 米', '10 000 米'], 1, 'kilo- 表示千，1 km = 1000 m。'],
        '4': ['10 000 米在中文分级里读作？', ['一千米', '一万米', '一亿米'], 1, '中文每 4 位分一级：个、万、亿。'],
        '6': ['1 000 000 米等于多少公里？', ['100 km', '1 000 km', '10 000 km'], 1, '米到公里 ÷1000，所以百万米是千公里。'],
        '8': ['1 亿秒大约是多少年？', ['3 年多', '31 年多', '300 年多'], 0, '1 年约 3150 万秒，所以 1 亿秒约 3.2 年；10 亿秒才约 31.7 年。'],
        '9': ['十亿写成数字有几个 0？', ['6 个', '9 个', '12 个'], 1, '1 000 000 000：1 后面 9 个 0。'],
        '21': ['银河系尺度最适合用哪种单位想象？', ['毫米', '光年', '厘米'], 1, '到恒星和银河的距离，用光年更像宇宙的尺子。'],
      },
      challenges: [
        ['3 km = ? m', '3000', ['300', '3000', '30000'], '3 km = 3 000 m。'],
        ['3 m = ? cm', '300', ['30', '300', '3000'], '米到厘米 ×100。'],
        ['3 m = ? mm', '3000', ['300', '3000', '30000'], '米到毫米 ×1000。'],
        ['0.01 m = ? cm', '1', ['0.1', '1', '10'], '0.01 m 就是 1 cm。'],
      ],
    },
    en: {
      doc: 'The Number Universe · KidsLab',
      back: 'Back to platform',
      title: 'The Number Universe',
      tip0: 'Wheel / pinch / tap the universe elevator: every floor is ×10, place value becomes distance.',
      dockKicker: 'Current stop',
      quizKicker: 'Estimation card',
      challengeTitle: 'Elevator Express · Unit Challenge',
      home: 'Warp home',
      challenge: 'Unit challenge',
      soundOn: 'Sound: on',
      soundOff: 'Sound: off',
      nogl: 'Your browser does not support WebGL. The number universe is still here — try another device ✨',
      floor: (n) => `${n >= 0 ? '+' : ''}${n}F`,
      scaleLine: 'Place value is the floors of the universe',
      quizDone: 'Stamp already collected. Ride to another floor!',
      correct: 'Correct! Stamp collected ✨',
      wrong: 'Almost — estimate by counting zeros first.',
      revealSeats: 'Seat particles light up: stadiums often live in the ten-thousands.',
      homeLaunch: 'Diving from the galaxy back home — hold tight!',
      homeLand: 'Home! The 1-meter kid is the start of big and small numbers.',
      challengeOk: 'Express success! Change unit, move the decimal point.',
      challengeNo: 'Try again: km→m is ×1000, m→cm is ×100.',
      placeSmall: (p) => `${p} place · decimal floor`,
      placeBig: (p) => `${p} place · big-number floor`,
      enUnit: '',
      stations: {
        '-3': ['Ant eye', '1 millimeter: a compound eye is a tiny sparkling stadium of lenses.'],
        '-2': ['Ladybug', '1 centimeter: the spots on its shell are big enough for a ruler.'],
        '-1': ['A flower', '0.1 meter: ten centimeters reminds us decimals have floors too.'],
        '0': ['Kid', '1 meter: start with yourself; up is big numbers, down is decimals.'],
        '1': ['Tall tree', '10 meters: about ten 1-meter kids stacked up.'],
        '2': ['Track / stadium', '100 meters: lanes, seats and cheers enter the hundreds.'],
        '3': ['Neighborhood', '1,000 meters: one kilometer, a chain of ten 100-meter runs.'],
        '4': ['City', '10,000 meters: ten thousand meters — a new place-value chunk.'],
        '5': ['Land / mountains', '100,000 meters: mountain ranges look like folded cloth.'],
        '6': ['Country outline', '1,000,000 meters: million-meter maps make borders visible.'],
        '7': ['Earth', '10,000,000 meters: the blue planet fits in the camera.'],
        '8': ['Earth to Moon', '100,000,000 meters: the Moon is about 380 million meters away.'],
        '9': ['Inner solar system', '1,000,000,000 meters: orbits become glowing rings.'],
        '11': ['Whole solar system', '100,000,000,000 meters: the outer planets join the map.'],
        '16': ['Nearby stars', '10,000,000,000,000,000 meters: stars need light-years as rulers.'],
        '21': ['Milky Way', '10²¹ meters: spiral arms bloom like fireworks; home is a dot.'],
      },
      quizzes: {
        '-3': ['How many tiny lenses might an ant-like compound eye have?', ['5', 'Hundreds', 'One hundred million'], 1, 'Many compound eyes are made from hundreds or thousands of tiny units.'],
        '-2': ['1 centimeter equals how many millimeters?', ['10 mm', '100 mm', '1,000 mm'], 0, 'Centimeter to millimeter is ×10: one decimal floor down.'],
        '-1': ['0.1 meter can also be written as:', ['1 cm', '10 cm', '100 cm'], 1, '0.1 m = 10 cm. Decimal points are elevators.'],
        '1': ['A 10 m tree is about how many 1 m kids stacked?', ['1', '10', '100'], 1, '10 meters is ten 1-meter lengths.'],
        '2': ['A large stadium might seat about:', ['2 thousand', '20 thousand', '2 million'], 1, 'Stadiums often live in the ten-thousands.'],
        '3': ['1 kilometer equals how many meters?', ['100 m', '1,000 m', '10,000 m'], 1, 'Kilo- means thousand.'],
        '4': ['10,000 meters is:', ['one thousand m', 'ten thousand m', 'one billion m'], 1, '10,000 is ten thousand.'],
        '6': ['1,000,000 meters equals how many kilometers?', ['100 km', '1,000 km', '10,000 km'], 1, 'Meters to kilometers is ÷1000.'],
        '8': ['100 million seconds is about:', ['3.2 years', '31.7 years', '300 years'], 0, 'A year has about 31.5 million seconds; one billion seconds is about 31.7 years.'],
        '9': ['How many zeros are in one billion?', ['6', '9', '12'], 1, '1,000,000,000 has nine zeros.'],
        '21': ['Which unit best imagines galaxy distances?', ['millimeters', 'light-years', 'centimeters'], 1, 'Stars and galaxies are easier to compare in light-years.'],
      },
      challenges: [
        ['3 km = ? m', '3000', ['300', '3000', '30000'], '3 km = 3,000 m.'],
        ['3 m = ? cm', '300', ['30', '300', '3000'], 'Meters to centimeters is ×100.'],
        ['3 m = ? mm', '3000', ['300', '3000', '30000'], 'Meters to millimeters is ×1000.'],
        ['0.01 m = ? cm', '1', ['0.1', '1', '10'], '0.01 m is 1 cm.'],
      ],
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

  /** 取当前语言文案；函数型 key 直接返回函数供调用方传参 */
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  /** 读取 CSS 主题变量（Canvas/three.js 取色必须走这里，勿硬编码） */
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const langBtn = document.getElementById('langBtn');
  const themeBtn = document.getElementById('themeBtn');

  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((n) => {
      const v = I18N[lang][n.dataset.t];
      if (typeof v === 'string') n.textContent = v;
    });
    if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    render(); // 语言切换后重绘动态文案
  }

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    /* Canvas / three.js 课件监听该事件重取 cssVar 配色 */
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

  /* ======================= 游戏区 · Game ======================= */
  const $ = (id) => document.getElementById(id);
  const canvas = $('scene');
  const stage = $('stage');
  const labelsLayer = $('labels');
  const slider = $('zoomSlider');
  const SAVE_KEY = 'kidslab.zoomten.stamps';
  const SOUND_KEY = 'kidslab.zoomten.sound';
  const STATION_EXP = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 16, 21];
  const STATION_ICONS = ['👁️', '🐞', '🌸', '🧒', '🌳', '🏟️', '🏘️', '🏙️', '⛰️', '🗺️', '🌍', '🌙', '☀️', '🪐', '✨', '🌌'];
  const placeNamesZh = ['个', '十', '百', '千', '万', '十万', '百万', '千万', '亿', '十亿', '百亿', '千亿'];
  const placeNamesEn = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands', 'hundred-thousands', 'millions', 'ten-millions', 'hundred-millions', 'billions', 'ten-billions', 'hundred-billions'];
  const tmpV = new THREE.Vector3();
  const state = {
    targetExp: 0,
    exp: 0,
    activeExp: 0,
    labels: new Map(),
    groups: new Map(),
    quizOpen: false,
    quizExp: null,
    currentChallenge: 0,
    homeRun: null,
    pointer: null,
    panX: 0,
    panY: 0,
    stamps: readJSON(SAVE_KEY, {}),
    sound: store.get(SOUND_KEY) !== 'off',
    lastAnnounce: '',
  };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  } catch {
    $('nogl').hidden = false;
    canvas.remove();
    return;
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0d24, 0.025);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 260);
  camera.position.set(0, 2, 16);
  const root = new THREE.Group();
  scene.add(root);
  const ambient = new THREE.HemisphereLight(0xffffff, 0x1f1a3c, 1.25);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
  keyLight.position.set(6, 10, 8);
  scene.add(ambient, keyLight);

  const dotTexture = softCircle(96);
  const shared = {
    white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65 }),
    ink: new THREE.MeshStandardMaterial({ color: 0x2b2440, roughness: 0.55 }),
    leaf: new THREE.MeshStandardMaterial({ color: 0x3ccf7a, roughness: 0.72 }),
    trunk: new THREE.MeshStandardMaterial({ color: 0x8a5a32, roughness: 0.8 }),
    water: new THREE.MeshStandardMaterial({ color: 0x2fb7ff, roughness: 0.42, metalness: 0.02 }),
    land: new THREE.MeshStandardMaterial({ color: 0x62c370, roughness: 0.75 }),
    glow: new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.72 }),
  };

  const builders = {
    '-3': buildAntEye, '-2': buildLadybug, '-1': buildFlower, '0': buildKid,
    '1': buildTree, '2': buildStadium, '3': buildBlocks, '4': buildCity,
    '5': buildMountains, '6': buildCountry, '7': buildEarth, '8': buildEarthMoon,
    '9': buildInnerSolar, '11': buildSolarSystem, '16': buildStars, '21': buildGalaxy,
  };

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  }
  function saveStamps() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state.stamps)); } catch { /* ignore */ } }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, p) { return a + (b - a) * p; }
  function smoothstep(edge0, edge1, x) {
    const p = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return p * p * (3 - 2 * p);
  }
  function nearestExp(v) {
    return STATION_EXP.reduce((best, e) => Math.abs(e - v) < Math.abs(best - v) ? e : best, STATION_EXP[0]);
  }
  function bracketExp(v) {
    for (let i = 0; i < STATION_EXP.length - 1; i++) {
      const a = STATION_EXP[i], b = STATION_EXP[i + 1];
      if (v >= a && v <= b) return [a, b, (v - a) / (b - a)];
    }
    return v < STATION_EXP[0] ? [STATION_EXP[0], STATION_EXP[0], 0] : [STATION_EXP[STATION_EXP.length - 1], STATION_EXP[STATION_EXP.length - 1], 0];
  }
  function expText(n) {
    const sup = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    return `10${String(n).split('').map((ch) => sup[ch] || ch).join('')}`;
  }
  function colorFromCss(name) { return new THREE.Color(cssVar(name) || '#000000'); }

  function softCircle(size) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }
  function material(color, roughness = 0.65, metalness = 0) {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness });
  }
  function basic(color, opacity = 1, blending = false) {
    return new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: opacity >= 1, blending: blending ? THREE.AdditiveBlending : THREE.NormalBlending });
  }
  function addMesh(g, geo, mat, pos = [0, 0, 0], scale = [1, 1, 1], rot = [0, 0, 0]) {
    const m = new THREE.Mesh(geo, mat.clone ? mat.clone() : mat);
    m.position.set(...pos); m.scale.set(...scale); m.rotation.set(...rot);
    g.add(m);
    return m;
  }
  function points(count, spread, palette, size = 0.16, flat = false) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * spread;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = flat ? (Math.random() - 0.5) * 0.15 : (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = Math.sin(a) * r;
      c.set(palette[(Math.random() * palette.length) | 0]).lerp(new THREE.Color(0xffffff), Math.random() * 0.35);
      col.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({ size, map: dotTexture, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }));
  }
  function ring(radius, color, tube = 0.025, opacity = 0.72) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 96), basic(color, opacity, true));
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  }
  function setGroupOpacity(obj, opacity) {
    obj.traverse((n) => {
      if (n.material) {
        const mats = Array.isArray(n.material) ? n.material : [n.material];
        mats.forEach((mat) => {
          if (!mat.userData.baseOpacity) mat.userData.baseOpacity = mat.opacity ?? 1;
          mat.transparent = true;
          mat.opacity = mat.userData.baseOpacity * opacity;
          mat.depthWrite = opacity > 0.88 && mat.userData.baseOpacity >= 1;
        });
      }
    });
  }
  function ensureStation(exp) {
    if (state.groups.has(exp)) return state.groups.get(exp);
    const group = new THREE.Group();
    group.userData.exp = exp;
    group.userData.anchor = new THREE.Vector3(0, 2.7, 0);
    builders[String(exp)](group);
    root.add(group);
    state.groups.set(exp, group);
    const label = document.createElement('div');
    label.className = 'scene-label';
    labelsLayer.append(label);
    state.labels.set(exp, label);
    return group;
  }
  function disposeStation(exp) {
    const group = state.groups.get(exp);
    if (!group) return;
    root.remove(group);
    group.traverse((n) => { if (n.geometry) n.geometry.dispose(); });
    state.groups.delete(exp);
    state.labels.get(exp)?.remove();
    state.labels.delete(exp);
  }

  function buildAntEye(g) {
    const lens = new THREE.SphereGeometry(0.18, 18, 12);
    for (let r = 0; r < 7; r++) for (let c = 0; c < 9; c++) {
      const x = (c - 4) * 0.36 + (r % 2) * 0.18;
      const y = (r - 3) * 0.31;
      const z = Math.sqrt(Math.max(0, 2.7 - x * x - y * y)) * 0.22;
      const m = material(new THREE.Color().setHSL(0.56 + r * 0.012, 0.86, 0.58), 0.28, 0.12);
      addMesh(g, lens, m, [x, y, z], [1, 1, 0.42]);
    }
    addMesh(g, new THREE.SphereGeometry(2.25, 48, 24), basic(0x2b2440, 0.18), [0, 0, -0.18], [1, 0.75, 0.35]);
    g.userData.anchor.set(0, 2.1, 0);
  }
  function buildLadybug(g) {
    addMesh(g, new THREE.SphereGeometry(1.9, 48, 24), material(0xef476f), [0, 0, 0], [1, 0.55, 1.15]);
    addMesh(g, new THREE.SphereGeometry(0.62, 32, 16), material(0x1d1936), [0, 0.1, 1.55], [1, 0.72, 1]);
    for (const x of [-0.82, 0.82, -0.42, 0.42]) for (const z of [-0.52, 0.24]) {
      addMesh(g, new THREE.SphereGeometry(0.18, 18, 10), material(0x19142c), [x, 0.92, z], [1, 0.18, 1]);
    }
    addMesh(g, new THREE.BoxGeometry(0.035, 0.08, 3.6), basic(0xffffff, 0.75), [0, 1.02, -0.05]);
    g.userData.anchor.set(0, 2.1, 0);
  }
  function buildFlower(g) {
    const petalGeo = new THREE.SphereGeometry(0.78, 32, 16);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2;
      const p = addMesh(g, petalGeo, material(i % 2 ? 0xff8fab : 0xff5d8f), [Math.cos(a) * 1.05, Math.sin(a) * 1.05 + 0.6, 0], [0.72, 1.05, 0.16]);
      p.rotation.z = a;
    }
    addMesh(g, new THREE.SphereGeometry(0.56, 32, 16), material(0xffd166), [0, 0.6, 0], [1, 1, 0.35]);
    addMesh(g, new THREE.CylinderGeometry(0.08, 0.13, 2.6, 12), shared.trunk, [0, -1.0, 0]);
    addMesh(g, new THREE.SphereGeometry(0.42, 20, 10), shared.leaf, [-0.42, -0.55, 0], [1.4, 0.35, 0.12], [0, 0, -0.35]);
    g.userData.anchor.set(0, 2.25, 0);
  }
  function buildKid(g) {
    addMesh(g, new THREE.SphereGeometry(0.45, 32, 16), material(0xffc6a8), [0, 1.35, 0]);
    addMesh(g, new THREE.BoxGeometry(0.82, 1.0, 0.36), material(0x4cc9f0), [0, 0.45, 0]);
    addMesh(g, new THREE.BoxGeometry(0.24, 0.85, 0.25), material(0x2b2440), [-0.24, -0.48, 0]);
    addMesh(g, new THREE.BoxGeometry(0.24, 0.85, 0.25), material(0x2b2440), [0.24, -0.48, 0]);
    addMesh(g, new THREE.BoxGeometry(0.22, 0.9, 0.22), material(0xffc6a8), [-0.68, 0.42, 0], [1, 1, 1], [0, 0, -0.35]);
    addMesh(g, new THREE.BoxGeometry(0.22, 0.9, 0.22), material(0xffc6a8), [0.68, 0.42, 0], [1, 1, 1], [0, 0, 0.35]);
    addMesh(g, new THREE.TorusGeometry(0.52, 0.04, 8, 48), material(0xffd166), [0, 1.42, 0.02], [1, 0.52, 1]);
    const grid = new THREE.GridHelper(5, 10, 0xffffff, 0xffffff);
    grid.position.y = -0.94;
    grid.material.transparent = true;
    grid.material.opacity = 0.18;
    g.add(grid);
    g.userData.anchor.set(0, 2.25, 0);
  }
  function buildTree(g) {
    addMesh(g, new THREE.CylinderGeometry(0.32, 0.5, 2.7, 16), shared.trunk, [0, -0.65, 0]);
    [[0, 1.1, 0, 1.25], [-0.75, 0.55, 0.05, 0.9], [0.8, 0.45, 0.1, 0.85], [0.2, 1.9, 0.1, 0.9]].forEach(([x, y, z, s]) => {
      addMesh(g, new THREE.IcosahedronGeometry(s, 2), shared.leaf, [x, y, z]);
    });
    for (let i = 0; i < 10; i++) addMesh(g, new THREE.SphereGeometry(0.08, 12, 8), material(0xff5d8f), [(Math.random() - 0.5) * 2, 0.4 + Math.random() * 1.8, (Math.random() - 0.5) * 1.2]);
    g.userData.anchor.set(0, 3.0, 0);
  }
  function buildStadium(g) {
    for (let i = 0; i < 4; i++) {
      const rr = 1.35 + i * 0.35;
      const m = ring(rr, i % 2 ? 0x4cc9f0 : 0xffd166, 0.03, 0.9);
      m.scale.y = 0.56; g.add(m);
    }
    const seats = points(600, 2.3, [0xffd166, 0xff5d8f, 0x4cc9f0], 0.08, true);
    seats.name = 'seatParticles'; seats.position.y = 0.16; g.add(seats);
    addMesh(g, new THREE.PlaneGeometry(3.2, 1.55), material(0x44c767), [0, 0, 0], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    g.userData.anchor.set(0, 1.7, 0);
  }
  function buildBlocks(g) {
    addMesh(g, new THREE.PlaneGeometry(6, 6), material(0x536dfe), [0, -0.03, 0], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    for (let x = -2; x <= 2; x++) for (let z = -2; z <= 2; z++) {
      if ((x + z) % 2 === 0) addMesh(g, new THREE.BoxGeometry(0.55, 0.25 + Math.random() * 0.9, 0.55), material([0xffd166, 0xff5d8f, 0x4cc9f0][Math.abs(x * z + z) % 3]), [x, 0.2, z]);
      else addMesh(g, new THREE.BoxGeometry(0.18, 0.05, 0.9), material(0xf7f7ff), [x, 0.03, z]);
    }
    g.userData.anchor.set(0, 2.2, 0);
  }
  function buildCity(g) {
    for (let i = 0; i < 72; i++) {
      const x = (Math.random() - 0.5) * 7;
      const z = (Math.random() - 0.5) * 5;
      const h = 0.4 + Math.random() * 2.2;
      const b = addMesh(g, new THREE.BoxGeometry(0.25 + Math.random() * 0.35, h, 0.25 + Math.random() * 0.35), material([0x5d6dff, 0x7b61ff, 0x118ab2][i % 3], 0.55), [x, h / 2 - 1.15, z]);
      if (Math.random() > 0.5) addMesh(b, new THREE.BoxGeometry(0.12, 0.06, 0.015), basic(0xfff1a8, 0.9, true), [0, h * 0.22, 0.18]);
    }
    g.add(points(260, 3.8, [0xffd166, 0xffffff, 0xff5d8f], 0.07, true));
    g.userData.anchor.set(0, 2.35, 0);
  }
  function buildMountains(g) {
    addMesh(g, new THREE.PlaneGeometry(7, 5), material(0x5fbf7b), [0, -1.12, 0], [1, 1, 1], [-Math.PI / 2, 0, 0]);
    for (let i = 0; i < 9; i++) {
      const h = 1.1 + Math.random() * 1.8;
      const cone = addMesh(g, new THREE.ConeGeometry(0.7 + Math.random() * 0.45, h, 4), material(0x8d99ae), [(i - 4) * 0.72, -1.05 + h / 2, -0.5 + Math.random() * 1.5], [1, 1, 1], [0, Math.PI / 4, 0]);
      addMesh(cone, new THREE.ConeGeometry(0.25, 0.35, 4), material(0xffffff), [0, h * 0.37, 0], [1, 1, 1], [0, Math.PI / 4, 0]);
    }
    g.userData.anchor.set(0, 2.4, 0);
  }
  function buildCountry(g) {
    const shape = new THREE.Shape();
    [[-1.6, -0.6], [-0.9, 0.8], [-0.1, 0.55], [0.35, 1.2], [1.55, 0.45], [1.05, -0.65], [0.15, -1.1], [-0.55, -0.78]].forEach(([x, y], i) => i ? shape.lineTo(x, y) : shape.moveTo(x, y));
    shape.closePath();
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025 }), material(0x06d6a0));
    mesh.rotation.x = -0.2; g.add(mesh);
    for (let i = 0; i < 18; i++) addMesh(g, new THREE.SphereGeometry(0.06, 12, 8), basic(0xffd166, 0.9, true), [(Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 1.7, 0.18]);
    g.userData.anchor.set(0, 2.0, 0);
  }
  function buildEarth(g) {
    const earth = addMesh(g, new THREE.SphereGeometry(1.55, 64, 32), shared.water);
    [[-0.45, 0.45, 0.92, 0.62], [0.52, -0.2, 0.58, 0.4], [0.2, 0.78, 0.42, 0.28]].forEach(([x, y, sx, sy]) => {
      addMesh(earth, new THREE.SphereGeometry(0.42, 24, 12), shared.land, [x, y, 1.22], [sx, sy, 0.09]);
    });
    addMesh(g, new THREE.SphereGeometry(1.7, 48, 24), basic(0xffffff, 0.18, true));
    g.userData.anchor.set(0, 2.35, 0);
  }
  function buildEarthMoon(g) {
    buildEarth(g);
    g.children.forEach((child) => { child.position.x -= 1.55; child.scale.multiplyScalar(0.62); });
    addMesh(g, new THREE.SphereGeometry(0.42, 32, 16), material(0xd8d8d8), [2.05, 0.25, 0]);
    const path = ring(1.95, 0xffffff, 0.012, 0.45); path.scale.x = 1.9; path.scale.y = 0.55; g.add(path);
    g.userData.anchor.set(0.3, 2.0, 0);
  }
  function buildInnerSolar(g) {
    addMesh(g, new THREE.SphereGeometry(0.45, 32, 16), basic(0xffd166, 1, true));
    [0.85, 1.28, 1.75, 2.28].forEach((r, i) => {
      g.add(ring(r, 0xffffff, 0.012, 0.36));
      const a = i * 1.35;
      addMesh(g, new THREE.SphereGeometry(0.08 + i * 0.025, 16, 8), material([0xbbbec9, 0xff9f1c, 0x2fb7ff, 0xef476f][i]), [Math.cos(a) * r, 0, Math.sin(a) * r]);
    });
    g.userData.anchor.set(0, 1.55, 0);
  }
  function buildSolarSystem(g) {
    buildInnerSolar(g);
    [2.9, 3.55, 4.2, 4.85].forEach((r, i) => {
      g.add(ring(r, 0x4cc9f0, 0.01, 0.24));
      const a = i * 1.6 + 0.4;
      addMesh(g, new THREE.SphereGeometry(0.16 + i * 0.04, 20, 10), material([0xf4a261, 0xe9c46a, 0x80c4ff, 0x577590][i]), [Math.cos(a) * r, 0, Math.sin(a) * r]);
    });
    g.scale.setScalar(0.7);
    g.userData.anchor.set(0, 2.05, 0);
  }
  function buildStars(g) {
    g.add(points(360, 4.8, [0xffffff, 0x9bf6ff, 0xffd166, 0xff8fab], 0.18));
    for (let i = 0; i < 5; i++) {
      const a = i * 1.2;
      const star = addMesh(g, new THREE.SphereGeometry(0.16 + Math.random() * 0.12, 18, 10), basic([0xffffff, 0x9bf6ff, 0xffd166][i % 3], 1, true), [Math.cos(a) * (1.2 + i * 0.55), Math.sin(a * 1.7) * 1.1, Math.sin(a) * (1.2 + i * 0.55)]);
      addMesh(star, new THREE.SphereGeometry(0.52, 20, 10), basic(0xffffff, 0.12, true));
    }
    g.userData.anchor.set(0, 2.2, 0);
  }
  function buildGalaxy(g) {
    const geo = new THREE.BufferGeometry();
    const count = 2600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const arm = i % 4;
      const r = Math.pow(Math.random(), 0.45) * 4.4;
      const a = arm * Math.PI / 2 + r * 1.25 + (Math.random() - 0.5) * 0.62;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.28 * (1 - r / 5);
      pos[i * 3 + 2] = Math.sin(a) * r * 0.62;
      c.set([0xffffff, 0x9bf6ff, 0xffd166, 0xff5d8f][i % 4]).lerp(new THREE.Color(0xffffff), Math.random() * 0.5);
      col.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.07, map: dotTexture, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
    addMesh(g, new THREE.SphereGeometry(0.45, 24, 12), basic(0xfff3b0, 0.85, true));
    g.userData.anchor.set(0, 2.45, 0);
  }

  function applyThreeTheme() {
    const a = colorFromCss('--space-a');
    const b = colorFromCss('--space-b');
    scene.background = a.clone().lerp(b, 0.42);
    scene.fog.color.copy(a.clone().lerp(b, 0.55));
    ambient.groundColor.copy(b);
    ambient.color.copy(theme === 'light' ? new THREE.Color(0xffffff) : new THREE.Color(0xb9d8ff));
  }
  addEventListener('themechange', applyThreeTheme);

  function formatMeter(value) {
    if (value >= 1) {
      const e = Math.log10(value);
      const nearest = Math.round(e);
      if (nearest >= 16 && Math.abs(e - nearest) < 0.06) {
        const raw = `1${'0'.repeat(nearest)}`;
        const grouped = lang === 'zh' ? groupZh(raw) : groupEn(raw);
        return { html: digitHtml(grouped, nearest), plain: `${grouped} m` };
      }
      if (e >= 16) {
        const floor = Math.floor(e);
        const mantissa = (10 ** (e - floor)).toFixed(2);
        return { html: `${mantissa}<span class="sep">×</span>${expText(floor)}<span class="unit">m</span>`, plain: `${mantissa}×10^${floor} m` };
      }
      const n = Math.round(value);
      const raw = String(n);
      const grouped = lang === 'zh' ? groupZh(raw) : n.toLocaleString('en-US');
      return { html: digitHtml(grouped, Math.max(0, Math.floor(Math.log10(n)))), plain: `${grouped} m` };
    }
    const decimals = Math.min(6, Math.max(1, Math.ceil(-Math.log10(value))));
    const s = value.toFixed(decimals);
    return { html: digitHtml(s, -decimals), plain: `${s} m` };
  }
  function groupZh(raw) {
    const parts = [];
    let s = raw;
    while (s.length > 4) { parts.unshift(s.slice(-4)); s = s.slice(0, -4); }
    parts.unshift(s);
    return parts.join(' ');
  }
  function groupEn(raw) {
    const parts = [];
    let s = raw;
    while (s.length > 3) { parts.unshift(s.slice(-3)); s = s.slice(0, -3); }
    parts.unshift(s);
    return parts.join(',');
  }
  function digitHtml(str, hotExp) {
    const chars = String(str).split('');
    let digitIndex = chars.filter((ch) => /\d/.test(ch)).length - 1;
    return chars.map((ch) => {
      if (/\d/.test(ch)) {
        const exp = digitIndex--;
        return `<span class="digit ${exp === hotExp ? 'hot' : ''}">${ch}</span>`;
      }
      if (ch === ' ') return '<span class="sep"> </span>';
      if (ch === ',' || ch === '.') return `<span class="sep">${ch}</span>`;
      return ch;
    }).join('') + (str.includes('m') ? '' : '<span class="unit">m</span>');
  }
  function updateReadout() {
    const rounded = Math.round(state.exp);
    const value = Math.pow(10, state.exp);
    $('powBadge').textContent = expText(rounded);
    $('floorText').textContent = t('floor')(rounded);
    const f = formatMeter(value);
    $('meterReadout').innerHTML = f.html;
    const place = rounded < 0
      ? t('placeSmall')(rounded === -1 ? (lang === 'zh' ? '十分' : 'tenths') : rounded === -2 ? (lang === 'zh' ? '百分' : 'hundredths') : (lang === 'zh' ? '千分' : 'thousandths'))
      : t('placeBig')((lang === 'zh' ? (placeNamesZh[rounded] || expText(rounded)) : (placeNamesEn[rounded] || expText(rounded))));
    $('placeReadout').textContent = place;
    $('stationHint').textContent = t('scaleLine');
  }
  function updateDock() {
    const exp = nearestExp(state.exp);
    state.activeExp = exp;
    const [name, fact] = t('stations')[String(exp)];
    $('dockTitle').textContent = `${expText(exp)} · ${name}`;
    $('dockFact').textContent = fact;
    syncQuiz(exp, Math.abs(state.exp - exp) < 0.065);
  }
  function updateElevator() {
    document.querySelectorAll('.elevator__tick').forEach((b) => {
      b.classList.toggle('is-active', Number(b.dataset.exp) === state.activeExp);
    });
  }
  function renderStampBook() {
    $('stampBook').innerHTML = STATION_EXP.map((e, i) => `<span class="stamp ${state.stamps[e] ? 'got' : ''}" title="${t('stations')[String(e)][0]}">${state.stamps[e] ? STATION_ICONS[i] : '☆'}</span>`).join('');
  }
  function updateLabels() {
    const rect = stage.getBoundingClientRect();
    state.groups.forEach((group, exp) => {
      const label = state.labels.get(exp);
      if (!label) return;
      label.textContent = t('stations')[String(exp)][0];
      tmpV.copy(group.userData.anchor).applyMatrix4(group.matrixWorld).project(camera);
      const x = (tmpV.x * 0.5 + 0.5) * rect.width;
      const y = (-tmpV.y * 0.5 + 0.5) * rect.height;
      const visible = tmpV.z > -1 && tmpV.z < 1 && group.visible;
      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
      label.style.opacity = visible ? String(Math.min(1, group.userData.opacity || 0)) : '0';
    });
  }
  /** 每帧/每次状态变化的统一渲染入口（语言、主题切换都会调用） */
  function render() {
    updateReadout();
    updateDock();
    updateElevator();
    renderStampBook();
    $('soundBtn').textContent = state.sound ? t('soundOn') : t('soundOff');
  }

  function openQuiz(exp) {
    if (state.stamps[exp]) return;
    const quiz = t('quizzes')[String(exp)];
    if (!quiz) return;
    state.quizOpen = true;
    state.quizExp = exp;
    $('quizCard').hidden = false;
    $('quizQuestion').textContent = quiz[0];
    $('reveal').textContent = '';
    $('choices').innerHTML = quiz[1].map((c, i) => `<button class="choice" data-i="${i}" type="button"><span>${c}</span><b>${['A', 'B', 'C'][i]}</b></button>`).join('');
    $('choices').querySelectorAll('.choice').forEach((btn) => btn.addEventListener('click', () => answerQuiz(exp, Number(btn.dataset.i))));
  }
  function syncQuiz(exp, nearStation) {
    const quiz = t('quizzes')[String(exp)];
    if (!nearStation || !quiz) {
      if (state.quizOpen) closeQuiz();
      return;
    }
    if (state.stamps[exp]) {
      if (state.quizOpen && state.quizExp !== exp) closeQuiz();
      return;
    }
    if (!state.quizOpen || state.quizExp !== exp) openQuiz(exp);
  }
  function answerQuiz(exp, choice) {
    const quiz = t('quizzes')[String(exp)];
    $('choices').querySelectorAll('.choice').forEach((btn) => {
      btn.disabled = true;
      btn.classList.toggle('correct', Number(btn.dataset.i) === quiz[2]);
      btn.classList.toggle('wrong', Number(btn.dataset.i) === choice && choice !== quiz[2]);
    });
    if (choice === quiz[2]) {
      state.stamps[exp] = true;
      saveStamps();
      sparkleStation(exp);
      sfx('win');
      $('reveal').textContent = `${t('correct')} ${quiz[3]}`;
      renderStampBook();
    } else {
      sfx('bad');
      $('reveal').textContent = `${t('wrong')} ${quiz[3]}`;
    }
  }
  function sparkleStation(exp) {
    const g = ensureStation(exp);
    const burst = points(140, 1.8, [0xffd166, 0xffffff, 0xff5d8f], 0.18);
    burst.name = 'burst';
    burst.userData.life = 1;
    g.add(burst);
  }
  function closeQuiz() { state.quizOpen = false; state.quizExp = null; $('quizCard').hidden = true; }

  function showChallenge() {
    $('challengeCard').hidden = false;
    const list = t('challenges');
    const ch = list[state.currentChallenge % list.length];
    $('challengePrompt').textContent = ch[0];
    $('challengeReveal').textContent = '';
    $('challengeDigits').innerHTML = ch[1].split('').map((d, i) => `<span class="${i === ch[1].length - 1 ? 'on' : ''}">${d}</span>`).join('');
    $('challengeChoices').innerHTML = ch[2].map((c) => `<button class="choice" data-v="${c}" type="button">${c}</button>`).join('');
    $('challengeChoices').querySelectorAll('.choice').forEach((btn) => btn.addEventListener('click', () => answerChallenge(btn.dataset.v)));
  }
  function answerChallenge(v) {
    const ch = t('challenges')[state.currentChallenge % t('challenges').length];
    $('challengeChoices').querySelectorAll('.choice').forEach((btn) => {
      btn.disabled = true;
      btn.classList.toggle('correct', btn.dataset.v === ch[1]);
      btn.classList.toggle('wrong', btn.dataset.v === v && v !== ch[1]);
    });
    if (v === ch[1]) {
      $('challengeReveal').textContent = `${t('challengeOk')} ${ch[3]}`;
      state.currentChallenge += 1;
      sfx('ok');
    } else {
      $('challengeReveal').textContent = `${t('challengeNo')} ${ch[3]}`;
      sfx('bad');
    }
  }

  function setTargetExp(v, toneIt = false) {
    state.targetExp = clamp(v, STATION_EXP[0], STATION_EXP[STATION_EXP.length - 1]);
    slider.value = String(state.targetExp);
    if (toneIt) sfx('tick');
  }
  function jumpTo(exp) { setTargetExp(exp, true); closeQuiz(); }
  function makeElevator() {
    $('elevator').innerHTML = STATION_EXP.map((e) => `<button class="elevator__tick" data-exp="${e}" type="button" title="${expText(e)}">${e}</button>`).join('');
    $('elevator').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => jumpTo(Number(b.dataset.exp))));
  }
  function resize() {
    const r = stage.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);

  function sfx(kind) {
    if (!state.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const seq = {
        tick: [[420, 0.04]], ok: [[660, 0.08], [990, 0.1, 0.05]], bad: [[150, 0.16]],
        win: [[523, 0.08], [659, 0.08, 0.06], [784, 0.12, 0.12]], home: [[880, 0.05], [660, 0.05, 0.08], [440, 0.08, 0.16]],
      }[kind] || [[500, 0.06]];
      seq.forEach(([freq, dur, delay = 0]) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = kind === 'bad' ? 'sawtooth' : 'triangle';
        o.frequency.value = freq;
        const t0 = audioCtx.currentTime + delay;
        g.gain.setValueAtTime(0.13, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
        o.connect(g).connect(audioCtx.destination);
        o.start(t0); o.stop(t0 + dur + 0.03);
      });
    } catch { /* ignore */ }
  }
  let audioCtx = null;
  function homeRun() {
    closeQuiz();
    $('challengeCard').hidden = true;
    state.homeRun = { start: performance.now(), from: state.exp, to: 0, dur: 9300 };
    document.body.classList.add('home-run');
    $('stationHint').textContent = t('homeLaunch');
    sfx('home');
  }

  function shouldHandleStageGesture(target) {
    return !(target instanceof Element) || !target.closest('button, input, select, textarea, a, [role="button"], .dock, .quiz, .challenge, .elevator');
  }

  function attachControls() {
    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      setTargetExp(state.targetExp + Math.sign(e.deltaY) * 0.22, true);
    }, { passive: false });
    slider.addEventListener('input', () => setTargetExp(Number(slider.value)));
    $('minusBtn').addEventListener('click', () => setTargetExp(nearestExp(state.targetExp) - 1, true));
    $('plusBtn').addEventListener('click', () => setTargetExp(nearestExp(state.targetExp) + 1, true));
    $('homeBtn').addEventListener('click', homeRun);
    $('challengeBtn').addEventListener('click', showChallenge);
    $('quizClose').addEventListener('click', closeQuiz);
    $('challengeClose').addEventListener('click', () => { $('challengeCard').hidden = true; });
    $('soundBtn').addEventListener('click', () => {
      state.sound = !state.sound;
      store.set(SOUND_KEY, state.sound ? 'on' : 'off');
      render();
    });

    const touches = new Map();
    let pinchStart = 0;
    let pinchExp = 0;
    stage.addEventListener('pointerdown', (e) => {
      if (!shouldHandleStageGesture(e.target)) return;
      stage.setPointerCapture(e.pointerId);
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      state.pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, panX: state.panX, panY: state.panY };
      if (touches.size === 2) {
        const [a, b] = [...touches.values()];
        pinchStart = Math.hypot(a.x - b.x, a.y - b.y);
        pinchExp = state.targetExp;
      }
    });
    stage.addEventListener('pointermove', (e) => {
      if (!touches.has(e.pointerId)) return;
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touches.size === 2) {
        const [a, b] = [...touches.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        setTargetExp(pinchExp + Math.log2(Math.max(0.2, d / pinchStart)) * 0.9);
      } else if (state.pointer?.id === e.pointerId) {
        state.panX = clamp(state.pointer.panX + (e.clientX - state.pointer.x) / 180, -1.1, 1.1);
        state.panY = clamp(state.pointer.panY + (e.clientY - state.pointer.y) / 180, -0.8, 0.8);
      }
    });
    const end = (e) => { touches.delete(e.pointerId); if (state.pointer?.id === e.pointerId) state.pointer = null; };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
  }

  function animate(now) {
    requestAnimationFrame(animate);
    if (state.homeRun) {
      const p = clamp((now - state.homeRun.start) / state.homeRun.dur, 0, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      state.targetExp = lerp(state.homeRun.from, 0, ease);
      if (p >= 1) {
        state.homeRun = null;
        document.body.classList.remove('home-run');
        document.body.classList.add('landed');
        setTimeout(() => document.body.classList.remove('landed'), 480);
        $('stationHint').textContent = t('homeLand');
        sfx('win');
      }
    }
    state.exp += (state.targetExp - state.exp) * 0.085;
    slider.value = String(state.targetExp);
    const [a, b, p] = bracketExp(state.exp);
    const visible = new Set([a, b]);
    visible.forEach(ensureStation);
    [...state.groups.keys()].forEach((e) => { if (!visible.has(e)) disposeStation(e); });
    state.groups.forEach((g, exp) => {
      const dist = exp === a && a !== b ? p : exp === b && a !== b ? 1 - p : 0;
      const op = a === b ? 1 : smoothstep(1, 0, dist);
      g.visible = op > 0.02;
      g.userData.opacity = op;
      setGroupOpacity(g, op);
      const dir = exp === a ? -1 : 1;
      g.position.x = dir * dist * 1.8;
      g.position.y = Math.sin(now * 0.001 + exp) * 0.08;
      g.rotation.y += 0.003 + Math.abs(state.targetExp - state.exp) * 0.0008;
      g.scale.setScalar(lerp(0.86, 1.08, op));
      g.traverse((n) => {
        if (n.name === 'burst') {
          n.userData.life -= 0.018;
          n.scale.multiplyScalar(1.025);
          n.material.opacity = Math.max(0, n.userData.life);
          if (n.userData.life <= 0) n.removeFromParent();
        }
        if (n.name === 'seatParticles' && state.stamps[2]) n.rotation.y += 0.008;
      });
    });
    const speed = Math.abs(state.targetExp - state.exp);
    camera.position.x = state.panX * 2.2;
    camera.position.y = 1.45 - state.panY * 1.4 + Math.sin(now * 0.0004) * 0.08;
    camera.position.z = 9.8 - Math.min(2.2, speed * 0.7);
    camera.lookAt(state.panX * 0.8, 0.25 - state.panY * 0.5, 0);
    root.rotation.z = state.homeRun ? Math.sin(now * 0.006) * 0.025 : 0;
    updateLabels();
    updateReadout();
    updateDock();
    updateElevator();
    renderer.render(scene, camera);
  }

  /* ============================ 启动 ============================ */
  makeElevator();
  attachControls();
  applyThreeTheme();
  resize();
  applyTheme();
  applyLang();
  setTargetExp(0);
  requestAnimationFrame(animate);
})();
