/* ============================================================
   观测实验纯模型 · 无 DOM / 无 three
   竖直弹跳：y 向上为正，地面 y=0，重力加速度 g 向下。
   所有课件的玩法逻辑都应抽成这样的纯函数，再用单测锁死。
   ============================================================ */

export const LIMITS = Object.freeze({
  g: Object.freeze([1.6, 24.8]),
  restitution: Object.freeze([0, 1]),
  dropHeight: Object.freeze([0.2, 2]),
  mass: Object.freeze([0.05, 2]),
});

export const DEFAULTS = Object.freeze({
  g: 9.8,
  restitution: 0.72,
  dropHeight: 1.2,
  mass: 0.25,
});

const EPS = 1e-9;
const REST_SPEED = 0.05;

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function clampNumber(value, min, max) {
  if (!isFiniteNumber(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function createSetup(partial = {}) {
  return {
    g: clampNumber(partial.g ?? DEFAULTS.g, ...LIMITS.g),
    restitution: clampNumber(partial.restitution ?? DEFAULTS.restitution, ...LIMITS.restitution),
    dropHeight: clampNumber(partial.dropHeight ?? DEFAULTS.dropHeight, ...LIMITS.dropHeight),
    mass: clampNumber(partial.mass ?? DEFAULTS.mass, ...LIMITS.mass),
  };
}

export function validateSetup(raw) {
  if (!raw || typeof raw !== 'object') return { ok: false, reason: 'invalid-setup' };
  for (const key of Object.keys(LIMITS)) {
    if (!isFiniteNumber(raw[key])) return { ok: false, reason: `invalid-${key}` };
    const [min, max] = LIMITS[key];
    if (raw[key] < min || raw[key] > max) return { ok: false, reason: `out-of-range-${key}` };
  }
  return { ok: true };
}

export function createSim(partial = {}) {
  const setup = createSetup(partial);
  return {
    ...setup,
    y: setup.dropHeight,
    v: 0,
    t: 0,
    bounces: 0,
    resting: false,
    paused: false,
  };
}

export function dropAgain(sim) {
  if (!sim) return { ok: false, reason: 'invalid-sim', sim };
  const setup = createSetup(sim);
  return { ok: true, sim: { ...createSim(setup), paused: Boolean(sim.paused) } };
}

export function setPaused(sim, paused) {
  if (!sim) return { ok: false, reason: 'invalid-sim', sim };
  return { ok: true, sim: { ...sim, paused: Boolean(paused) } };
}

export function patchSetup(sim, patch = {}, { reset = false } = {}) {
  if (!sim) return { ok: false, reason: 'invalid-sim', sim };
  const next = createSetup({ ...sim, ...patch });
  if (reset) return dropAgain({ ...sim, ...next });
  return { ok: true, sim: { ...sim, ...next } };
}

export function timeToFirstImpact(setup) {
  const { dropHeight, g } = createSetup(setup);
  return Math.sqrt((2 * dropHeight) / g);
}

export function impactSpeed(setup) {
  const { dropHeight, g } = createSetup(setup);
  return Math.sqrt(2 * g * dropHeight);
}

export function predictedPeakHeight(setup) {
  const { dropHeight, restitution } = createSetup(setup);
  return dropHeight * restitution * restitution;
}

export function energies(sim) {
  if (!sim) return { kinetic: 0, potential: 0, mechanical: 0 };
  const kinetic = 0.5 * sim.mass * sim.v * sim.v;
  const potential = sim.mass * sim.g * sim.y;
  return {
    kinetic,
    potential,
    mechanical: kinetic + potential,
  };
}

export function snapshot(sim) {
  if (!sim) return null;
  const energy = energies(sim);
  return {
    g: sim.g,
    restitution: sim.restitution,
    dropHeight: sim.dropHeight,
    mass: sim.mass,
    y: sim.y,
    v: sim.v,
    t: sim.t,
    bounces: sim.bounces,
    resting: sim.resting,
    paused: sim.paused,
    ...energy,
  };
}

export function recordObservation(history, sim) {
  if (!Array.isArray(history)) return { ok: false, reason: 'invalid-history', history };
  const snap = snapshot(sim);
  if (!snap) return { ok: false, reason: 'invalid-sim', history };
  return { ok: true, history: Object.freeze([...history, Object.freeze(snap)].slice(-24)) };
}

function advance(y, v, g, dt) {
  return {
    y: y + v * dt - 0.5 * g * dt * dt,
    v: v - g * dt,
  };
}

function timeToGround(y, v, g) {
  const disc = v * v + 2 * g * y;
  if (disc < 0 || g <= 0) return Infinity;
  const tau = (v + Math.sqrt(disc)) / g;
  return tau > EPS ? tau : Infinity;
}

function settleBounce(v, restitution) {
  const incoming = v;
  if (restitution <= 0 || Math.abs(incoming) < REST_SPEED) {
    return { v: 0, resting: true };
  }
  return { v: -incoming * restitution, resting: false };
}

export function stepSim(sim, dt) {
  if (!sim) return { ok: false, reason: 'invalid-sim', sim, events: [] };
  if (!isFiniteNumber(dt) || dt < 0) return { ok: false, reason: 'invalid-dt', sim, events: [] };
  if (!isFiniteNumber(sim.g) || sim.g <= 0) return { ok: false, reason: 'invalid-g', sim, events: [] };
  if (!isFiniteNumber(sim.y) || !isFiniteNumber(sim.v)) {
    return { ok: false, reason: 'invalid-state', sim, events: [] };
  }

  if (dt === 0 || sim.paused) {
    return { ok: true, sim: { ...sim }, events: [] };
  }

  let { y, v, t, bounces, resting } = sim;
  const { g, restitution } = sim;
  let remaining = dt;
  const events = [];

  if (resting) {
    return { ok: true, sim: { ...sim, y: 0, v: 0 }, events: [] };
  }

  if (y <= EPS && v <= REST_SPEED) {
    const settled = settleBounce(v, restitution);
    return {
      ok: true,
      sim: { ...sim, y: 0, v: settled.v, resting: settled.resting },
      events: settled.resting ? [{ type: 'rest', t, speed: Math.abs(v) }] : [],
    };
  }

  while (remaining > EPS && !resting) {
    const hit = timeToGround(Math.max(0, y), v, g);
    if (hit < remaining) {
      const moved = advance(y, v, g, hit);
      y = 0;
      v = moved.v;
      t += hit;
      remaining -= hit;
      const speed = Math.abs(v);
      const settled = settleBounce(v, restitution);
      v = settled.v;
      resting = settled.resting;
      if (resting) {
        events.push({ type: 'rest', t, speed });
      } else {
        bounces += 1;
        events.push({ type: 'bounce', t, speed, outgoing: v });
      }
    } else {
      const moved = advance(y, v, g, remaining);
      y = Math.max(0, moved.y);
      v = moved.v;
      t += remaining;
      remaining = 0;
    }
  }

  return {
    ok: true,
    sim: {
      ...sim,
      y,
      v,
      t,
      bounces,
      resting,
    },
    events,
  };
}

export function runUntil(sim, seconds, dt = 1 / 240) {
  if (!isFiniteNumber(seconds) || seconds < 0) return { ok: false, reason: 'invalid-seconds', sim };
  if (!isFiniteNumber(dt) || dt <= 0) return { ok: false, reason: 'invalid-dt', sim };
  let current = sim;
  const events = [];
  let guard = 0;
  const maxSteps = Math.ceil(seconds / dt) + 8;
  let left = seconds;
  while (left > EPS && guard < maxSteps) {
    const slice = Math.min(dt, left);
    const result = stepSim(current, slice);
    if (!result.ok) return result;
    current = result.sim;
    events.push(...result.events);
    left -= slice;
    guard += 1;
    if (current.resting) break;
  }
  return { ok: true, sim: current, events };
}
