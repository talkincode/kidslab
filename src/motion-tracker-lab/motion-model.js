export const G = 9.8;
export const DT = 0.1;
export const TRACK_LENGTH_M = 1.2;
export const MAX_MARKS = 8;
export const HIT_TOLERANCE_M = 0.05;
export const ANGLE_PRESETS = Object.freeze([10, 20, 30]);

function finiteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function quantize(value) {
  return Number(value.toFixed(12));
}

export function inclineAcceleration(angleDeg, g = G) {
  if (!finiteNumber(angleDeg) || !finiteNumber(g) || angleDeg < 0 || angleDeg > 90) return null;
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

function kinematicsAt(s0, v0, a, t) {
  const s = positionAtTime(s0, v0, a, t);
  const v = velocityAtTime(v0, a, t);
  if (s === null || v === null) return null;
  return { t: quantize(t), s, v };
}

function timeToPosition(s0, v0, a, sTarget) {
  const distance = sTarget - s0;
  if (!finiteNumber(distance)) return null;
  if (Math.abs(a) < 1e-12) {
    if (Math.abs(v0) < 1e-12) return null;
    const t = distance / v0;
    return t >= 0 ? quantize(t) : null;
  }
  const disc = v0 * v0 + 2 * a * distance;
  if (disc < 0) return null;
  const root = Math.sqrt(disc);
  const t1 = (-v0 + root) / a;
  const t2 = (-v0 - root) / a;
  const candidates = [t1, t2].filter((t) => t >= -1e-12);
  if (candidates.length === 0) return null;
  return quantize(Math.max(0, Math.min(...candidates)));
}

function clipForKind(kind, angleDeg) {
  if (kind === 'uniform') {
    return {
      kind: 'uniform',
      angleDeg: 0,
      s0: 0.1,
      v0: 0.4,
      a: 0,
    };
  }
  if (kind === 'accelerated') {
    const angle = finiteNumber(angleDeg) ? angleDeg : 30;
    const a = inclineAcceleration(angle);
    if (a === null) return null;
    return {
      kind: 'accelerated',
      angleDeg: angle,
      s0: 0,
      v0: 0,
      a,
    };
  }
  return null;
}

function applyClip(lab, clip) {
  lab.kind = clip.kind;
  lab.angleDeg = clip.angleDeg;
  lab.s0 = clip.s0;
  lab.v0 = clip.v0;
  lab.a = clip.a;
  lab.t = 0;
  lab.s = clip.s0;
  lab.v = clip.v0;
  lab.playing = false;
  lab.finished = false;
  lab.marks = [];
  lab.lastError = null;
  return lab;
}

export function createLab({ kind = 'uniform', angleDeg = 30 } = {}) {
  const clip = clipForKind(kind, angleDeg);
  if (!clip) return null;
  return applyClip({}, clip);
}

export function setKind(lab, kind) {
  if (!lab) return { ok: false, reason: 'invalid-lab' };
  const angle = kind === 'accelerated' ? (lab.kind === 'accelerated' ? lab.angleDeg : 30) : 0;
  const clip = clipForKind(kind, angle);
  if (!clip) return { ok: false, reason: 'invalid-kind' };
  applyClip(lab, clip);
  return { ok: true };
}

export function setAngle(lab, angleDeg) {
  if (!lab) return { ok: false, reason: 'invalid-lab' };
  if (lab.kind !== 'accelerated') return { ok: false, reason: 'level-track' };
  const clip = clipForKind('accelerated', angleDeg);
  if (!clip) return { ok: false, reason: 'invalid-angle' };
  applyClip(lab, clip);
  return { ok: true };
}

export function setPlaying(lab, playing) {
  if (!lab) return { ok: false, reason: 'invalid-lab' };
  if (typeof playing !== 'boolean') return { ok: false, reason: 'invalid-playing' };
  lab.playing = playing && !lab.finished;
  return { ok: true, playing: lab.playing };
}

export function stepLab(lab, dt = DT) {
  if (!lab) return { ok: false, reason: 'invalid-lab' };
  if (!finiteNumber(dt) || dt <= 0) return { ok: false, reason: 'invalid-dt' };
  if (lab.finished) return { ok: false, reason: 'finished' };

  const nextT = lab.t + dt;
  const next = kinematicsAt(lab.s0, lab.v0, lab.a, nextT);
  if (!next) return { ok: false, reason: 'invalid-state' };

  if (next.s >= TRACK_LENGTH_M - 1e-12) {
    const endT = timeToPosition(lab.s0, lab.v0, lab.a, TRACK_LENGTH_M) ?? nextT;
    const end = kinematicsAt(lab.s0, lab.v0, lab.a, endT) || next;
    lab.t = end.t;
    lab.s = TRACK_LENGTH_M;
    lab.v = end.v;
    lab.finished = true;
    lab.playing = false;
    return { ok: true, finished: true };
  }

  lab.t = next.t;
  lab.s = next.s;
  lab.v = next.v;
  return { ok: true, finished: false };
}

function pushMark(lab) {
  if (lab.marks.length >= MAX_MARKS) return { ok: false, reason: 'full' };
  if (lab.marks.some((mark) => Math.abs(mark.t - lab.t) < 1e-12)) {
    return { ok: false, reason: 'duplicate' };
  }
  lab.marks.push(Object.freeze({
    index: lab.marks.length,
    t: lab.t,
    s: lab.s,
    v: lab.v,
  }));
  lab.lastError = null;
  return { ok: true, mark: lab.marks.at(-1) };
}

export function markNow(lab) {
  if (!lab) return { ok: false, reason: 'invalid-lab' };
  return pushMark(lab);
}

export function markAt(lab, markedS) {
  if (!lab) return { ok: false, reason: 'invalid-lab' };
  if (!finiteNumber(markedS)) return { ok: false, reason: 'invalid-position' };
  if (Math.abs(markedS - lab.s) > HIT_TOLERANCE_M) {
    lab.lastError = 'miss';
    return { ok: false, reason: 'miss' };
  }
  return pushMark(lab);
}

export function resetLab(lab) {
  if (!lab) return lab;
  return applyClip(lab, clipForKind(lab.kind, lab.angleDeg));
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
