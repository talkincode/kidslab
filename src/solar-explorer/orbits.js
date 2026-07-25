/**
 * 太阳系轨道力学 — 纯计算模块（无渲染依赖，可单元测试）
 *
 * 轨道要素与算法：NASA/JPL SSD《Approximate Positions of the Planets》
 * （Standish & Williams 1992），Table 2a + 2b，适用公元前 3000 — 公元 3000 年。
 * 坐标系：J2000 平黄道与春分点，日心直角坐标，单位 au。
 */

export const AU_KM = 149597870.7;          /* 天文单位，km（IAU 2012 定义） */
export const DAYS_PER_YEAR = 365.25;       /* 儒略年 */
export const J2000_JD = 2451545.0;         /* J2000.0 历元的儒略日 */
export const GM_SUN = 1.32712440018e11;    /* 太阳日心引力常数，km³/s² */
export const OBLIQUITY_DEG = 23.43928;     /* J2000 黄赤交角 */

const DEG = Math.PI / 180;
const CENTURY_DAYS = 36525;

/**
 * Table 2a：a0/ȧ [au, au/世纪]，e0/ė，I0/İ、L0/L̇、ϖ0/ϖ̇、Ω0/Ω̇ [度, 度/世纪]
 * Table 2b：木星—海王星平近点角的附加项 b、c、s、f
 */
const ELEMENTS = {
  mercury: { a: [0.38709843, 0.0], e: [0.20563661, 0.00002123], i: [7.00559432, -0.00590158], l: [252.25166724, 149472.67486623], peri: [77.45771895, 0.15940013], node: [48.33961819, -0.12214182] },
  venus: { a: [0.72332102, -0.00000026], e: [0.00676399, -0.00005107], i: [3.39777545, 0.00043494], l: [181.97970850, 58517.81560260], peri: [131.76755713, 0.05679648], node: [76.67261496, -0.27274174] },
  earth: { a: [1.00000018, -0.00000003], e: [0.01673163, -0.00003661], i: [-0.00054346, -0.01337178], l: [100.46691572, 35999.37306329], peri: [102.93005885, 0.31795260], node: [-5.11260389, -0.24123856] },
  mars: { a: [1.52371243, 0.00000097], e: [0.09336511, 0.00009149], i: [1.85181869, -0.00724757], l: [-4.56813164, 19140.29934243], peri: [-23.91744784, 0.45223625], node: [49.71320984, -0.26852431] },
  jupiter: { a: [5.20248019, -0.00002864], e: [0.04853590, 0.00018026], i: [1.29861416, -0.00322699], l: [34.33479152, 3034.90371757], peri: [14.27495244, 0.18199196], node: [100.29282654, 0.13024619], extra: [-0.00012452, 0.06064060, -0.35635438, 38.35125000] },
  saturn: { a: [9.54149883, -0.00003065], e: [0.05550825, -0.00032044], i: [2.49424102, 0.00451969], l: [50.07571329, 1222.11494724], peri: [92.86136063, 0.54179478], node: [113.63998702, -0.25015002], extra: [0.00025899, -0.13434469, 0.87320147, 38.35125000] },
  uranus: { a: [19.18797948, -0.00020455], e: [0.04685740, -0.00001550], i: [0.77298127, -0.00180155], l: [314.20276625, 428.49512595], peri: [172.43404441, 0.09266985], node: [73.96250215, 0.05739699], extra: [0.00058331, -0.97731848, 0.17689245, 7.67025000] },
  neptune: { a: [30.06952752, 0.00006447], e: [0.00895439, 0.00000818], i: [1.77005520, 0.00022400], l: [304.22289287, 218.46515314], peri: [46.68158724, 0.01009938], node: [131.78635853, -0.00606302], extra: [-0.00041348, 0.68346318, -0.10162547, 7.67025000] },
};

/**
 * 行星的物理与展示数据。
 * radiusKm 为赤道半径、rotationDays 为恒星自转周期（负值＝逆行）、
 * tiltDeg 为自转轴相对轨道面的倾角，取自 JPL SSD 与其引用的 IAU/IAG 自转要素报告。
 */
export const PLANETS = [
  {
    id: 'mercury', emoji: '🪨', color: 0xa9998c, accent: '#b9a99b',
    radiusKm: 2440.53, rotationDays: 58.6462, tiltDeg: 0.034,
    name: { zh: '水星', en: 'Mercury' },
    fact: {
      zh: '水星 88 天绕日一圈，并以 3∶2 共振自转；从一次正午到下一次正午约 176 天，确实比一年更长。',
      en: 'Mercury orbits in 88 days and spins in a 3:2 resonance; noon-to-noon takes about 176 days, longer than its year.',
    },
  },
  {
    id: 'venus', emoji: '🌕', color: 0xe6c98a, accent: '#e8c47e',
    radiusKm: 6051.8, rotationDays: -243.018, tiltDeg: 177.36,
    name: { zh: '金星', en: 'Venus' },
    fact: {
      zh: '金星几乎是倒着转的，自转轴倾角 177°，太阳在那里从西边升起。',
      en: 'Venus spins upside down — a 177° axial tilt means the Sun rises in its west.',
    },
  },
  {
    id: 'earth', emoji: '🌍', color: 0x4d96ff, accent: '#4d96ff',
    radiusKm: 6378.14, rotationDays: 0.99726968, tiltDeg: 23.44,
    name: { zh: '地球', en: 'Earth' },
    fact: {
      zh: '我们脚下的地球一边以 29.8 km/s 绕太阳跑，一边被太阳带着在银河里飞。',
      en: 'Earth races around the Sun at 29.8 km/s while the Sun carries it across the galaxy.',
    },
  },
  {
    id: 'mars', emoji: '🔴', color: 0xd8623f, accent: '#e35b40',
    radiusKm: 3396.19, rotationDays: 1.02595676, tiltDeg: 25.19,
    name: { zh: '火星', en: 'Mars' },
    fact: {
      zh: '火星轨道偏心率约 0.093，在八大行星中仅次于水星；它与太阳的距离变化比地球更明显。',
      en: 'Mars has an eccentricity near 0.093, second only to Mercury, so its distance from the Sun varies more than Earth’s.',
    },
  },
  {
    id: 'jupiter', emoji: '🟠', color: 0xd2a06a, accent: '#d9a066',
    radiusKm: 71492, rotationDays: 0.41354, tiltDeg: 3.13,
    name: { zh: '木星', en: 'Jupiter' },
    fact: {
      zh: '木星最重也转得最快：不到 10 小时自转一圈，被自己甩成了一个扁球。',
      en: 'Jupiter is the biggest and the fastest spinner: under 10 hours per turn, which bulges its equator.',
    },
  },
  {
    id: 'saturn', emoji: '🪐', color: 0xe0c48c, accent: '#e5c98e', ring: true,
    radiusKm: 60268, rotationDays: 0.44401, tiltDeg: 26.73,
    name: { zh: '土星', en: 'Saturn' },
    fact: {
      zh: '土星平均密度约 0.69 g/cm³，比水小；“能浮起来”只是帮助理解平均密度的思想实验。',
      en: 'Saturn’s mean density is about 0.69 g/cm³, below water; “it would float” is only a density thought experiment.',
    },
  },
  {
    id: 'uranus', emoji: '🩵', color: 0x8fd6e8, accent: '#8fd6e8', ring: true,
    radiusKm: 25559, rotationDays: -0.71833, tiltDeg: 97.77,
    name: { zh: '天王星', en: 'Uranus' },
    fact: {
      zh: '天王星几乎是躺着滚的：自转轴倾角 97.8°，一“极夜”能持续 42 年。',
      en: 'Uranus rolls on its side: a 97.8° tilt gives each pole a 42-year-long night.',
    },
  },
  {
    id: 'neptune', emoji: '🔵', color: 0x466ae0, accent: '#4664e0',
    radiusKm: 24764, rotationDays: 0.67125, tiltDeg: 28.32,
    name: { zh: '海王星', en: 'Neptune' },
    fact: {
      zh: '海王星绕太阳一圈要 164.8 年 —— 从 1846 年被发现算起，它才刚跑完一圈。',
      en: 'Neptune needs 164.8 years per lap — since its 1846 discovery it has finished just one.',
    },
  },
];

export const SUN = {
  id: 'sun', emoji: '☀️', color: 0xffb703, accent: '#ffb703',
  radiusKm: 695700, rotationDays: 25.38, tiltDeg: 7.25,
  name: { zh: '太阳', en: 'The Sun' },
  fact: {
    zh: '太阳占了太阳系 99.86% 的质量，正是它的引力把八大行星拴在轨道上。',
    en: 'The Sun holds 99.86% of the solar system’s mass; its gravity keeps all eight planets in orbit.',
  },
};

/* ---------------- 银河系里的运动方向（J2000 黄道单位向量） ---------------- */

/** 赤道坐标单位向量 → J2000 黄道坐标单位向量 */
function equatorialToEcliptic([x, y, z]) {
  const eps = OBLIQUITY_DEG * DEG;
  return [x, y * Math.cos(eps) + z * Math.sin(eps), -y * Math.sin(eps) + z * Math.cos(eps)];
}

function sphericalToUnit(raDeg, decDeg) {
  const ra = raDeg * DEG;
  const dec = decDeg * DEG;
  return [Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec)];
}

function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function scale(v, k) { return [v[0] * k, v[1] * k, v[2] * k]; }
function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function length(v) { return Math.hypot(v[0], v[1], v[2]); }
function normalize(v) { const n = length(v); return n ? scale(v, 1 / n) : [0, 0, 0]; }

/* 银道坐标系的三个基准方向（ICRS J2000，来自 IAU 银道坐标定义） */
const GALACTIC_CENTER_EQ = sphericalToUnit(266.40500, -28.93617);        /* l=0, b=0 */
const GALACTIC_POLE_EQ = sphericalToUnit(192.85948, 27.12825);           /* b=+90 */
const GALACTIC_ROTATION_EQ = cross(GALACTIC_POLE_EQ, GALACTIC_CENTER_EQ); /* l=90, b=0：银河自转方向 */

/** 太阳相对本地静止标准的本动：Schönrich+2010 (U, V, W) = (11.1, 12.24, 7.25) km/s */
const SOLAR_PECULIAR = { u: 11.1, v: 12.24, w: 7.25 };
const SOLAR_APEX_EQ = normalize(add(
  add(scale(GALACTIC_CENTER_EQ, SOLAR_PECULIAR.u), scale(GALACTIC_ROTATION_EQ, SOLAR_PECULIAR.v)),
  scale(GALACTIC_POLE_EQ, SOLAR_PECULIAR.w),
));

/** 参考系：太阳自己的运动。速度 km/s，方向为 J2000 黄道单位向量。 */
export const DRIFT_MODES = {
  none: { id: 'none', speedKmS: 0, direction: [0, 0, 1] },
  local: {
    id: 'local',
    speedKmS: Math.hypot(SOLAR_PECULIAR.u, SOLAR_PECULIAR.v, SOLAR_PECULIAR.w),
    direction: equatorialToEcliptic(SOLAR_APEX_EQ),
  },
  galaxy: {
    id: 'galaxy',
    speedKmS: 230,
    direction: equatorialToEcliptic(GALACTIC_ROTATION_EQ),
  },
};

/** 银道北极方向（J2000 黄道单位向量）：用来在天球上画出银河带 */
export const GALACTIC_POLE_ECLIPTIC = equatorialToEcliptic(GALACTIC_POLE_EQ);

/** km/s → au/儒略年 */
export const kmsToAuPerYear = (kms) => (kms * DAYS_PER_YEAR * 86400) / AU_KM;

/** 运动方向与黄道面的夹角（度）：z 分量的反正弦 */
export const angleToEclipticDeg = (direction) => Math.abs(Math.asin(direction[2] / length(direction))) / DEG;

/* ---------------- 儒略日与日期 ---------------- */

export function julianDayFromDate(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

export function dateFromJulianDay(jd) {
  return new Date((jd - 2440587.5) * 86400000);
}

/* ---------------- 开普勒轨道 ---------------- */

/** 把角度归一化到 [-180, 180) */
export function wrapDegrees(deg) {
  const value = ((deg + 180) % 360 + 360) % 360 - 180;
  return value;
}

/**
 * 解开普勒方程 M = E − e* sinE（单位：度，e* = 180/π · e）
 * 牛顿迭代，JPL 建议 tol = 1e-6 度。
 */
export function solveKepler(meanAnomalyDeg, e, tolerance = 1e-7) {
  const eStar = e / DEG;
  const m = wrapDegrees(meanAnomalyDeg);
  let eccentricAnomaly = m + eStar * Math.sin(m * DEG);
  for (let step = 0; step < 40; step += 1) {
    const deltaM = m - (eccentricAnomaly - eStar * Math.sin(eccentricAnomaly * DEG));
    const deltaE = deltaM / (1 - e * Math.cos(eccentricAnomaly * DEG));
    eccentricAnomaly += deltaE;
    if (Math.abs(deltaE) <= tolerance) break;
  }
  return eccentricAnomaly;
}

/** 某儒略日的六个轨道要素（含世纪变率与木—海附加项） */
export function elementsAt(planetId, julianDay) {
  const table = ELEMENTS[planetId];
  if (!table) throw new RangeError(`Unknown planet: ${planetId}`);
  const centuries = (julianDay - J2000_JD) / CENTURY_DAYS;
  const at = ([base, rate]) => base + rate * centuries;

  const a = at(table.a);
  const e = at(table.e);
  const inclination = at(table.i);
  const meanLongitude = at(table.l);
  const perihelion = at(table.peri);
  const node = at(table.node);

  let meanAnomaly = meanLongitude - perihelion;
  if (table.extra) {
    const [b, c, s, f] = table.extra;
    meanAnomaly += b * centuries * centuries
      + c * Math.cos(f * centuries * DEG)
      + s * Math.sin(f * centuries * DEG);
  }

  return {
    a,
    e,
    inclination,
    meanLongitude,
    perihelion,
    node,
    argPerihelion: perihelion - node,
    meanAnomaly: wrapDegrees(meanAnomaly),
    /* 平均角速度 rad/day，由平黄经变率给出 */
    meanMotion: (table.l[1] * DEG) / CENTURY_DAYS,
  };
}

/**
 * 计算轨道平面坐标与到 J2000 黄道系的旋转矩阵。
 * 位置和速度计算共享这一步，轨道线只取位置时不再重复计算速度。
 */
function orbitalGeometryAt(planetId, julianDay) {
  const el = elementsAt(planetId, julianDay);
  const eccentricAnomaly = solveKepler(el.meanAnomaly, el.e) * DEG;
  const cosE = Math.cos(eccentricAnomaly);
  const sinE = Math.sin(eccentricAnomaly);
  const sqrtOneMinusE2 = Math.sqrt(1 - el.e * el.e);

  /* 轨道平面内：x' 指向近日点 */
  const xOrbit = el.a * (cosE - el.e);
  const yOrbit = el.a * sqrtOneMinusE2 * sinE;

  const w = el.argPerihelion * DEG;
  const o = el.node * DEG;
  const i = el.inclination * DEG;
  const cosW = Math.cos(w); const sinW = Math.sin(w);
  const cosO = Math.cos(o); const sinO = Math.sin(o);
  const cosI = Math.cos(i); const sinI = Math.sin(i);

  /* R_z(−Ω) R_x(−I) R_z(−ω) 的展开式（JPL 文档第 5 步） */
  const m11 = cosW * cosO - sinW * sinO * cosI;
  const m12 = -sinW * cosO - cosW * sinO * cosI;
  const m21 = cosW * sinO + sinW * cosO * cosI;
  const m22 = -sinW * sinO + cosW * cosO * cosI;
  const m31 = sinW * sinI;
  const m32 = cosW * sinI;

  const position = [
    m11 * xOrbit + m12 * yOrbit,
    m21 * xOrbit + m22 * yOrbit,
    m31 * xOrbit + m32 * yOrbit,
  ];

  return {
    el,
    cosE,
    sinE,
    sqrtOneMinusE2,
    m11,
    m12,
    m21,
    m22,
    m31,
    m32,
    position,
  };
}

/**
 * 日心 J2000 黄道直角坐标与速度。
 * @returns {{position: number[], velocity: number[], radiusAu: number, speedKmS: number, elements: object}}
 *   position 单位 au，velocity 单位 km/s
 */
export function heliocentricState(planetId, julianDay) {
  const orbit = orbitalGeometryAt(planetId, julianDay);
  const { el, cosE, sinE, sqrtOneMinusE2, m11, m12, m21, m22, m31, m32, position } = orbit;

  /* dE/dt = n / (1 − e cosE) */
  const eDot = el.meanMotion / (1 - el.e * cosE);
  const vxOrbit = -el.a * sinE * eDot;                  /* au/day */
  const vyOrbit = el.a * sqrtOneMinusE2 * cosE * eDot;  /* au/day */
  const auPerDayToKmS = AU_KM / 86400;
  const velocity = [
    (m11 * vxOrbit + m12 * vyOrbit) * auPerDayToKmS,
    (m21 * vxOrbit + m22 * vyOrbit) * auPerDayToKmS,
    (m31 * vxOrbit + m32 * vyOrbit) * auPerDayToKmS,
  ];

  return {
    position,
    velocity,
    radiusAu: length(position),
    speedKmS: length(velocity),
    elements: el,
  };
}

/** 只要位置（轨道线与拖尾用，省掉速度计算） */
export function heliocentricPosition(planetId, julianDay) {
  return orbitalGeometryAt(planetId, julianDay).position;
}

/** 由半长轴得到公转周期（儒略年）：开普勒第三定律 T² = a³（日心、以年与 au 为单位） */
export function orbitalPeriodYears(planetId, julianDay = J2000_JD) {
  const el = elementsAt(planetId, julianDay);
  return Math.sqrt(el.a ** 3);
}

/** 维斯-维瓦方程校验用：v = √(GM(2/r − 1/a))，km/s */
export function visVivaSpeed(radiusAu, semiMajorAu) {
  const r = radiusAu * AU_KM;
  const a = semiMajorAu * AU_KM;
  return Math.sqrt(GM_SUN * (2 / r - 1 / a));
}

export const vectorHelpers = { add, scale, length, normalize, cross };
