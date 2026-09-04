export const G = 9.8;
export const DT = 0.1;
export const TRACK_LENGTH_M = 1.2;
export const MARK_COUNT = 6;
export const HIT_TOLERANCE_M = 0.05;

function finiteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function quantize(value) {
  return Number(value.toFixed(12));
}

export function inclineAcceleration(angleDeg, g = G) {
  if (!finiteNumber(angleDeg) || angleDeg < 0 || angleDeg > 90) return null;
  return quantize(g * Math.sin((angleDeg * Math.PI) / 180));
}

export function positionAtTime(s0, v0, a, t) {
  if (![s0, v0, a, t].every(finiteNumber) || t < 0) return null;
  return quantize(s0 + v0 * t + 0.5 * a * t * t);
}

export function velocityAtTime(v0, a, t) {
  if (![v0, a, t].every(finiteNumber) || t < 0) return null;
  return quantize(v0 + a * t);
}

export function predictedAcceleration(angleDeg) {
  return inclineAcceleration(angleDeg);
}

export function withinRelative(actual, expected, relTol) {
  if (![actual, expected, relTol].every(finiteNumber) || relTol < 0) return false;
  if (expected === 0) return Math.abs(actual) <= relTol;
  return Math.abs(actual - expected) <= relTol * Math.abs(expected);
}

export function isHit(trueS, markedS, tolerance = HIT_TOLERANCE_M) {
  if (![trueS, markedS, tolerance].every(finiteNumber) || tolerance < 0) return false;
  return Math.abs(trueS - markedS) <= tolerance;
}

export function generateClip({ id, angleDeg, s0, v0 }) {
  const a = inclineAcceleration(angleDeg);
  if (a === null || !finiteNumber(s0) || !finiteNumber(v0)) return null;
  return Object.freeze({
    id,
    kind: Math.abs(a) < 1e-9 ? 'uniform' : 'accelerated',
    angleDeg,
    s0,
    v0,
    a,
  });
}

export const CLIPS = Object.freeze({
  uniform: generateClip({ id: 'uniform', angleDeg: 0, s0: 0.1, v0: 0.4 }),
  accel: generateClip({ id: 'accel', angleDeg: 30, s0: 0, v0: 0 }),
});

export function generateFrames(clip, { dt = DT, count = MARK_COUNT } = {}) {
  if (!clip || !finiteNumber(dt) || dt <= 0 || !Number.isInteger(count) || count < 2) return [];
  const frames = [];
  for (let i = 0; i < count; i += 1) {
    const t = quantize(i * dt);
    const s = positionAtTime(clip.s0, clip.v0, clip.a, t);
    if (s === null || s > TRACK_LENGTH_M) break;
    frames.push(Object.freeze({ index: i, t, s }));
  }
  return frames;
}

export function intervalVelocities(marks, dt = DT) {
  if (!Array.isArray(marks) || marks.length < 2 || !finiteNumber(dt) || dt <= 0) return [];
  const rows = [];
  for (let i = 1; i < marks.length; i += 1) {
    const prev = marks[i - 1];
    const next = marks[i];
    if (!prev || !next || !finiteNumber(prev.s) || !finiteNumber(next.s) || !finiteNumber(prev.t) || !finiteNumber(next.t)) {
      return [];
    }
    const interval = next.t - prev.t;
    if (interval <= 0) return [];
    rows.push(Object.freeze({
      tMid: quantize((prev.t + next.t) / 2),
      v: quantize((next.s - prev.s) / interval),
    }));
  }
  return rows;
}

export function leastSquaresSlope(xs, ys) {
  if (!Array.isArray(xs) || !Array.isArray(ys) || xs.length !== ys.length || xs.length < 2) return null;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  const n = xs.length;
  for (let i = 0; i < n; i += 1) {
    if (!finiteNumber(xs[i]) || !finiteNumber(ys[i])) return null;
    sumX += xs[i];
    sumY += ys[i];
    sumXY += xs[i] * ys[i];
    sumXX += xs[i] * xs[i];
  }
  const denom = n * sumXX - sumX * sumX;
  if (Math.abs(denom) < 1e-12) return null;
  return quantize((n * sumXY - sumX * sumY) / denom);
}

export function speedFromMarks(marks) {
  if (!Array.isArray(marks) || marks.length < 2) return null;
  return leastSquaresSlope(marks.map((mark) => mark.t), marks.map((mark) => mark.s));
}

export function accelerationFromMarks(marks, dt = DT) {
  const velocities = intervalVelocities(marks, dt);
  if (velocities.length < 2) return null;
  return leastSquaresSlope(velocities.map((row) => row.tMid), velocities.map((row) => row.v));
}

export function classifyMotion(marks, { uniformRelTol = 0.05, accelMin = 0.3 } = {}) {
  const velocities = intervalVelocities(marks);
  if (velocities.length < 2) return 'unknown';
  const mean = velocities.reduce((sum, row) => sum + row.v, 0) / velocities.length;
  const variance = velocities.reduce((sum, row) => sum + (row.v - mean) ** 2, 0) / velocities.length;
  const rel = Math.abs(mean) < 1e-9 ? Math.sqrt(variance) : Math.sqrt(variance) / Math.abs(mean);
  if (rel <= uniformRelTol) return 'uniform';
  const acceleration = accelerationFromMarks(marks);
  if (acceleration !== null && Math.abs(acceleration) >= accelMin) return 'accelerated';
  return 'unknown';
}

function clipForMission(id, options = {}) {
  if (id === 'design') {
    return generateClip({
      id: 'design',
      angleDeg: finiteNumber(options.angleDeg) ? options.angleDeg : 20,
      s0: 0,
      v0: 0,
    });
  }
  return CLIPS[id] || null;
}

export function startMission(id, options = {}) {
  const clip = clipForMission(id, options);
  if (!clip) return null;
  return {
    missionId: id,
    clip,
    frames: generateFrames(clip),
    frameIndex: 0,
    marks: [],
    concluded: false,
    conclusion: null,
    lastError: null,
  };
}

export function markFrame(lab, markedS) {
  if (!lab || lab.concluded) return { ok: false, reason: 'concluded' };
  const frame = lab.frames[lab.frameIndex];
  if (!frame) return { ok: false, reason: 'complete' };
  if (!isHit(frame.s, markedS)) {
    lab.lastError = 'miss';
    return { ok: false, reason: 'miss' };
  }
  lab.marks.push(Object.freeze({
    index: frame.index,
    t: frame.t,
    s: frame.s,
  }));
  lab.frameIndex += 1;
  lab.lastError = null;
  return { ok: true, frame };
}

export function concludeMotion(lab, kind) {
  if (!lab || lab.marks.length < MARK_COUNT) return { ok: false, reason: 'incomplete' };
  const actual = classifyMotion(lab.marks);
  if (actual !== kind) {
    lab.lastError = 'wrong-kind';
    return { ok: false, reason: 'wrong-kind', actual };
  }
  lab.concluded = true;
  lab.conclusion = kind;
  lab.lastError = null;
  return { ok: true, actual };
}

export function resetMission(lab, id, options = {}) {
  const next = startMission(id, options);
  if (!lab || !next) return lab;
  Object.assign(lab, next);
  return lab;
}

export function compactPanelAfter(event) {
  switch (event) {
    case 'marked-complete':
      return 'data';
    case 'advance':
    case 'choose-angle':
    case 'reset':
    case 'need-marks':
      return 'film';
    case 'advance-design':
      return 'lab';
    default:
      return null;
  }
}
