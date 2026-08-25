/**
 * 圆周与卫星实验室 · 轨道模型
 *
 * 纯函数层：中心引力、质点卫星、二体、忽略大气阻力与其他天体。
 * 发射一律是「在某高度沿水平方向给一个速度」，因此发射点必然是轨道的一个拱点，
 * 轨道形状可以解析写出，卫星位置再按角动量守恒逐步推进。
 */

export const GRAVITATIONAL_CONSTANT = 6.674e-11; // N·m²/kg²
export const EARTH_MASS = 5.972e24; // kg
export const EARTH_RADIUS = 6.371e6; // m
export const MU = GRAVITATIONAL_CONSTANT * EARTH_MASS; // m³/s²
/* 卡门线：低于这个高度就算擦进大气、任务失败 */
export const REENTRY_ALTITUDE = 1.0e5; // m
export const REENTRY_RADIUS = EARTH_RADIUS + REENTRY_ALTITUDE;
/* 判定「圆轨」的容差：速度与理论环绕速度相差不到 0.5% */
export const CIRCULAR_TOLERANCE = 0.005;
/* 不闭合轨道飞到发射半径的多少倍就判定飞离 */
export const ESCAPE_RADIUS_FACTOR = 3;

const TWO_PI = Math.PI * 2;

const finite = (value) => typeof value === 'number' && Number.isFinite(value);

export function radiusFromAltitude(altitudeMeters) {
  return EARTH_RADIUS + altitudeMeters;
}

export function altitudeFromRadius(radiusMeters) {
  return radiusMeters - EARTH_RADIUS;
}

/** 圆轨环绕速度 v = √(GM/r) */
export function circularSpeed(radius) {
  if (!finite(radius) || radius <= 0) return null;
  return Math.sqrt(MU / radius);
}

/** 逃逸速度 v = √(2GM/r)，正好是同高度圆轨速度的 √2 倍 */
export function escapeSpeed(radius) {
  const circular = circularSpeed(radius);
  return circular === null ? null : circular * Math.SQRT2;
}

/** 单位质量的机械能（比机械能）ε = v²/2 − GM/r */
export function specificEnergy(radius, speed) {
  if (!finite(radius) || radius <= 0 || !finite(speed)) return null;
  return (speed * speed) / 2 - MU / radius;
}

/** 半长轴 a = −GM/(2ε)；抛物线与双曲线返回 null */
export function semiMajorAxis(radius, speed) {
  const energy = specificEnergy(radius, speed);
  if (energy === null || energy >= -1e-9) return null;
  return -MU / (2 * energy);
}

/** 水平发射时的偏心率 e = |r v²/GM − 1| */
export function eccentricity(radius, speed) {
  if (!finite(radius) || radius <= 0 || !finite(speed)) return null;
  return Math.abs((radius * speed * speed) / MU - 1);
}

/** 开普勒第三定律 T = 2π√(a³/GM) */
export function orbitalPeriod(semiMajor) {
  if (!finite(semiMajor) || semiMajor <= 0) return null;
  return TWO_PI * Math.sqrt(semiMajor ** 3 / MU);
}

/** 由周期反推圆轨半径 r = (GM T²/4π²)^(1/3)，L4 挑战的解析解 */
export function radiusForPeriod(period) {
  if (!finite(period) || period <= 0) return null;
  return Math.cbrt((MU * period * period) / (TWO_PI * TWO_PI));
}

/** 两个拱点半径：发射点是其中之一，另一个由 r_p + r_a = 2a 给出 */
export function apsides(radius, speed) {
  const semiMajor = semiMajorAxis(radius, speed);
  if (semiMajor === null) return null;
  const other = 2 * semiMajor - radius;
  return { perigee: Math.min(radius, other), apogee: Math.max(radius, other) };
}

/**
 * 擦边速度：在半径 r 处水平发射，若速度低于它，椭圆的近地点会掉进大气。
 * 由活力公式在远地点取值：v = √(GM(2/r − 2/(r + r_reentry)))。
 */
export function crashSpeed(radius) {
  if (!finite(radius) || radius <= REENTRY_RADIUS) return null;
  return Math.sqrt(MU * (2 / radius - 2 / (radius + REENTRY_RADIUS)));
}

export function classifyLaunch(radius, speed) {
  if (!finite(radius) || radius <= EARTH_RADIUS || !finite(speed) || speed < 0) return 'invalid';
  if (speed >= escapeSpeed(radius)) return 'escape';
  const pair = apsides(radius, speed);
  if (!pair) return 'escape';
  if (pair.perigee <= REENTRY_RADIUS) return 'crash';
  const circular = circularSpeed(radius);
  if (Math.abs(speed - circular) / circular <= CIRCULAR_TOLERANCE) return 'circular';
  return 'ellipse';
}

/**
 * 轨道的解析描述。conic 的极坐标方程 r(θ) = p/(1 + e·cosθ)，
 * θ 从发射点算起：速度大于环绕速度时发射点是近地点（θ=0），小于时是远地点（θ=π）。
 */
export function describeOrbit(radius, speed) {
  const kind = classifyLaunch(radius, speed);
  if (kind === 'invalid') return null;
  const angularMomentum = radius * speed;
  const semiLatus = (angularMomentum * angularMomentum) / MU;
  const e = eccentricity(radius, speed);
  const startAngle = speed >= circularSpeed(radius) ? 0 : Math.PI;
  const semiMajor = semiMajorAxis(radius, speed);
  return {
    kind,
    radius,
    speed,
    angularMomentum,
    semiLatus,
    eccentricity: e,
    startAngle,
    semiMajor,
    period: semiMajor === null || kind === 'crash' ? null : orbitalPeriod(semiMajor),
    circularSpeed: circularSpeed(radius),
    escapeSpeed: escapeSpeed(radius),
    apsides: apsides(radius, speed),
    /* 双曲线的真近点角有上限，超过它卫星已经飞到无穷远 */
    maxAngle: e > 1 ? Math.acos(-1 / e) : Math.PI,
  };
}

export function radiusAtAngle(orbit, angle) {
  if (!orbit) return null;
  const denominator = 1 + orbit.eccentricity * Math.cos(angle);
  if (denominator <= 1e-9) return Infinity;
  return orbit.semiLatus / denominator;
}

/** 单位质量所受引力大小 g = GM/r² */
export function gravityAtRadius(radius) {
  if (!finite(radius) || radius <= 0) return null;
  return MU / (radius * radius);
}

/** 做圆周运动所需的向心加速度 a = v²/r */
export function requiredCentripetal(radius, speed) {
  if (!finite(radius) || radius <= 0 || !finite(speed)) return null;
  return (speed * speed) / radius;
}

/**
 * 沿轨道推进一个固定仿真步长。用 Heun（二阶）积分真近点角，
 * dθ/dt = L/r²（角动量守恒），固定步长保证同参数必得同结果。
 */
export function stepFlight(orbit, flight, stepSeconds) {
  if (!orbit || !flight || !finite(stepSeconds) || stepSeconds <= 0) return flight;
  const rate = (angle) => {
    const r = radiusAtAngle(orbit, angle);
    return Number.isFinite(r) && r > 0 ? orbit.angularMomentum / (r * r) : 0;
  };
  const k1 = rate(flight.angle);
  const k2 = rate(flight.angle + (k1 * stepSeconds) / 2);
  const angle = flight.angle + k2 * stepSeconds;
  const elapsed = flight.elapsed + stepSeconds;
  const travelled = flight.travelled + k2 * stepSeconds;
  const radius = radiusAtAngle(orbit, angle);
  let status = 'flying';
  let lapSeconds = flight.lapSeconds;
  const unbound = orbit.eccentricity >= 1;
  if (Number.isFinite(radius) && radius <= REENTRY_RADIUS) status = 'crashed';
  /* 不闭合的轨道走到发射半径的三倍就判定飞离：再等下去只是越来越慢地远离 */
  else if (unbound && (!Number.isFinite(radius) || radius >= orbit.radius * ESCAPE_RADIUS_FACTOR)) status = 'escaped';
  else if (unbound && Math.abs(angle - orbit.startAngle) >= orbit.maxAngle * 0.98) status = 'escaped';
  else if (travelled >= TWO_PI) {
    status = 'lap';
    if (lapSeconds === null) {
      /* 线性回插到正好整圈的时刻，消掉最后一个步长的过冲 */
      const overshoot = (travelled - TWO_PI) / Math.max(k2, 1e-12);
      lapSeconds = elapsed - overshoot;
    }
  }
  return { angle, elapsed, travelled, radius, status, lapSeconds };
}

export function createFlight(orbit) {
  if (!orbit) return null;
  return {
    angle: orbit.startAngle,
    elapsed: 0,
    travelled: 0,
    radius: orbit.radius,
    status: 'flying',
    lapSeconds: null,
  };
}

/** 一圈跑完需要多少仿真步：固定 1440 步，与实际帧率无关 */
export const STEPS_PER_REFERENCE_ORBIT = 1440;

export function simulationStep(radius) {
  const reference = orbitalPeriod(radius);
  return reference === null ? 1 : reference / STEPS_PER_REFERENCE_ORBIT;
}

/* ------------------------------ 任务与挑战 ------------------------------ */

export const LAUNCH_ALTITUDES = Object.freeze([
  Object.freeze({ id: 'leo', altitudeKm: 400 }),
  Object.freeze({ id: 'mid', altitudeKm: 2000 }),
  Object.freeze({ id: 'high', altitudeKm: 8000 }),
]);

export const MISSIONS = Object.freeze([
  Object.freeze({ id: 'circle', outcome: 'circular' }),
  Object.freeze({ id: 'fall', outcome: 'crash' }),
  Object.freeze({ id: 'leave', outcome: 'escape' }),
]);

/** L4：同步轨道周期取一个恒星日 86164 s，解析半径约 4.2164×10⁷ m */
export const SYNC_PERIOD_SECONDS = 86164;
export const SYNC_TOLERANCE = 0.01;

export function isSyncOrbit(measuredPeriod, kind) {
  if (kind !== 'circular' || !finite(measuredPeriod)) return false;
  return Math.abs(measuredPeriod - SYNC_PERIOD_SECONDS) / SYNC_PERIOD_SECONDS <= SYNC_TOLERANCE;
}
