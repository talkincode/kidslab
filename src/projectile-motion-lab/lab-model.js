/* ============================================================
   抛体运动实验室纯模型 · 无 DOM / 无 three
   +x 向右，+y 向上，地面 y = 0，抛出点 (0, h)。
   忽略空气阻力：ax = 0，ay = −g。
   ============================================================ */

export const G = 9.8;

export const LIMITS = Object.freeze({
  height: Object.freeze([1, 12]),
  speed: Object.freeze([0, 25]),
  angleDeg: Object.freeze([0, 80]),
  g: Object.freeze([1.6, 24.8]),
});

export const DEFAULTS = Object.freeze({
  height: 5,
  speed: 10,
  angleDeg: 0,
  g: G,
});

export const TARGET = Object.freeze({
  x: 8,
  y: 3,
  radius: 0.55,
});

const EPS = 1e-12;

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function fail(lab, reason) {
  return { ok: false, reason, lab };
}

function rad(angleDeg) {
  return (angleDeg * Math.PI) / 180;
}

function components(speed, angleDeg) {
  const theta = rad(angleDeg);
  return {
    vx: speed * Math.cos(theta),
    vy: speed * Math.sin(theta),
  };
}

export function setupOf(raw = {}) {
  return {
    height: isFiniteNumber(raw.height) ? raw.height : DEFAULTS.height,
    speed: isFiniteNumber(raw.speed) ? raw.speed : DEFAULTS.speed,
    angleDeg: isFiniteNumber(raw.angleDeg) ? raw.angleDeg : DEFAULTS.angleDeg,
    g: isFiniteNumber(raw.g) ? raw.g : DEFAULTS.g,
  };
}

export function analyticState(setup, t) {
  const { height, speed, angleDeg, g } = setupOf(setup);
  const { vx, vy } = components(speed, angleDeg);
  const time = Math.max(0, t);
  return {
    t: time,
    x: vx * time,
    y: height + vy * time - 0.5 * g * time * time,
    vx,
    vy: vy - g * time,
  };
}

export function flightTime(setup) {
  const { height, speed, angleDeg, g } = setupOf(setup);
  if (!(g > 0)) return Infinity;
  const { vy } = components(speed, angleDeg);
  const disc = vy * vy + 2 * g * height;
  if (disc < 0) return 0;
  return (vy + Math.sqrt(disc)) / g;
}

export function rangeOf(setup) {
  const { speed, angleDeg } = setupOf(setup);
  const { vx } = components(speed, angleDeg);
  return vx * flightTime(setup);
}

export function maxHeight(setup) {
  const { height, speed, angleDeg, g } = setupOf(setup);
  const { vy } = components(speed, angleDeg);
  if (vy <= 0) return height;
  return height + (vy * vy) / (2 * g);
}

export function hoopDistance(x, y, target = TARGET) {
  const dx = x - target.x;
  const dy = y - target.y;
  return Math.hypot(dx, dy);
}

function stepKinematic(state, g, dt) {
  return {
    t: state.t + dt,
    x: state.x + state.vx * dt,
    y: state.y + state.vy * dt - 0.5 * g * dt * dt,
    vx: state.vx,
    vy: state.vy - g * dt,
  };
}

function timeToGround(y, vy, g) {
  if (!(g > 0)) return Infinity;
  const disc = vy * vy + 2 * g * y;
  if (disc < 0) return Infinity;
  const tau = (vy + Math.sqrt(disc)) / g;
  return tau > EPS ? tau : 0;
}

export function compareTrajectories(setup, dt = 1 / 120) {
  if (!isFiniteNumber(dt) || dt <= 0) return { ok: false, reason: 'invalid-dt' };
  const cfg = setupOf(setup);
  const T = flightTime(cfg);
  let numeric = {
    t: 0,
    x: 0,
    y: cfg.height,
    ...components(cfg.speed, cfg.angleDeg),
  };
  let maxDx = 0;
  let maxDy = 0;
  let samples = 0;
  let remaining = T;
  while (remaining > EPS) {
    const slice = Math.min(dt, remaining);
    numeric = stepKinematic(numeric, cfg.g, slice);
    remaining -= slice;
    const closed = analyticState(cfg, numeric.t);
    maxDx = Math.max(maxDx, Math.abs(numeric.x - closed.x));
    maxDy = Math.max(maxDy, Math.abs(numeric.y - closed.y));
    samples += 1;
  }
  return { ok: true, samples, maxDx, maxDy, duration: T };
}

function freezeLab(lab) {
  return {
    ...lab,
    target: Object.freeze({ ...lab.target }),
    trials: Object.freeze(lab.trials.map((trial) => Object.freeze({ ...trial }))),
    flight: lab.flight ? { ...lab.flight, numeric: { ...lab.flight.numeric } } : null,
    drop: lab.drop ? { ...lab.drop } : null,
  };
}

function withReason(lab, lastReason) {
  return freezeLab({ ...lab, lastReason });
}

export function createLab(partial = {}) {
  const height = isFiniteNumber(partial.height) ? partial.height : DEFAULTS.height;
  const speed = isFiniteNumber(partial.speed) ? partial.speed : DEFAULTS.speed;
  const angleDeg = isFiniteNumber(partial.angleDeg) ? partial.angleDeg : DEFAULTS.angleDeg;
  const g = isFiniteNumber(partial.g) ? partial.g : DEFAULTS.g;
  const target = {
    x: isFiniteNumber(partial.target?.x) ? partial.target.x : TARGET.x,
    y: isFiniteNumber(partial.target?.y) ? partial.target.y : TARGET.y,
    radius: isFiniteNumber(partial.target?.radius) ? partial.target.radius : TARGET.radius,
  };
  return freezeLab({
    version: 1,
    height,
    speed,
    angleDeg,
    g,
    paused: Boolean(partial.paused),
    flight: partial.flight ? { ...partial.flight, numeric: { ...partial.flight.numeric } } : null,
    drop: partial.drop ? { ...partial.drop } : null,
    trials: Array.isArray(partial.trials) ? partial.trials.map((trial) => ({ ...trial })) : [],
    target,
    phase: partial.phase === 'complete' ? 'complete' : 'observe',
    lastReason: partial.lastReason ?? null,
  });
}

export function snapshot(lab) {
  if (!lab) return null;
  const flying = Boolean(lab.flight && !lab.flight.landed);
  const landed = Boolean(lab.flight?.landed);
  return {
    height: lab.height,
    speed: lab.speed,
    angleDeg: lab.angleDeg,
    g: lab.g,
    ready: !lab.flight,
    flying,
    landed,
    paused: lab.paused,
    t: lab.flight?.t ?? 0,
    x: lab.flight?.x ?? 0,
    y: lab.flight?.y ?? lab.height,
    vx: lab.flight?.vx ?? components(lab.speed, lab.angleDeg).vx,
    vy: lab.flight?.vy ?? components(lab.speed, lab.angleDeg).vy,
    dropY: lab.drop?.y ?? lab.height,
    dropLanded: Boolean(lab.drop?.landed),
    hoopHit: Boolean(lab.flight?.hoopHit),
    hoopMinDist: lab.flight?.hoopMinDist ?? hoopDistance(0, lab.height, lab.target),
    range: lab.flight?.range ?? null,
    flightTime: lab.flight?.landTime ?? null,
    dropTime: lab.drop?.landTime ?? null,
    trials: lab.trials.length,
    phase: lab.phase,
  };
}

function patchNumber(lab, key, value, min, max, reasonKey = key) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!isFiniteNumber(value)) return fail(lab, `invalid-${reasonKey}`);
  if (value < min || value > max) return fail(lab, `out-of-range-${reasonKey}`);
  if (lab.flight && !lab.flight.landed) return fail(withReason(lab, 'in-flight'), 'in-flight');
  return { ok: true, lab: withReason({ ...lab, [key]: value }, null) };
}

export function setHeight(lab, height) {
  return patchNumber(lab, 'height', height, ...LIMITS.height);
}

export function setSpeed(lab, speed) {
  return patchNumber(lab, 'speed', speed, ...LIMITS.speed);
}

export function setAngle(lab, angleDeg) {
  return patchNumber(lab, 'angleDeg', angleDeg, ...LIMITS.angleDeg, 'angle');
}

export function setG(lab, g) {
  return patchNumber(lab, 'g', g, ...LIMITS.g);
}

export function setPaused(lab, paused) {
  if (!lab) return fail(lab, 'invalid-lab');
  return { ok: true, lab: withReason({ ...lab, paused: Boolean(paused) }, null) };
}

function startFlight(lab, withDrop) {
  const { vx, vy } = components(lab.speed, lab.angleDeg);
  const origin = {
    t: 0,
    x: 0,
    y: lab.height,
    vx,
    vy,
  };
  const flight = {
    ...origin,
    numeric: { ...origin },
    landed: false,
    landTime: null,
    range: null,
    maxHeight: lab.height,
    hoopHit: false,
    hoopMinDist: hoopDistance(0, lab.height, lab.target),
  };
  const drop = withDrop
    ? {
        t: 0,
        y: lab.height,
        vy: 0,
        landed: false,
        landTime: null,
      }
    : null;
  return { flight, drop };
}

export function launch(lab, { withDrop = false } = {}) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (lab.flight && !lab.flight.landed) return fail(withReason(lab, 'in-flight'), 'in-flight');
  const next = startFlight(lab, withDrop);
  return {
    ok: true,
    lab: withReason({
      ...lab,
      paused: false,
      flight: next.flight,
      drop: next.drop,
    }, null),
  };
}

function sampleHoop(flight, target) {
  const dist = hoopDistance(flight.x, flight.y, target);
  const hoopMinDist = Math.min(flight.hoopMinDist, dist);
  const hoopHit = flight.hoopHit || dist <= target.radius;
  return { hoopMinDist, hoopHit };
}

function advanceFlight(flight, g, dt, target) {
  if (!flight || flight.landed) return { flight, events: [] };
  const hit = timeToGround(Math.max(0, flight.y), flight.vy, g);
  if (hit <= dt + EPS) {
    const landedAt = stepKinematic(flight, g, Math.max(0, hit));
    const hoop = sampleHoop({ ...flight, ...landedAt, y: 0 }, target);
    return {
      flight: {
        ...flight,
        t: landedAt.t,
        x: Math.max(0, landedAt.x),
        y: 0,
        vx: landedAt.vx,
        vy: landedAt.vy,
        numeric: stepKinematic(flight.numeric, g, Math.max(0, hit)),
        landed: true,
        landTime: landedAt.t,
        range: Math.max(0, landedAt.x),
        maxHeight: Math.max(flight.maxHeight, 0),
        hoopMinDist: hoop.hoopMinDist,
        hoopHit: hoop.hoopHit,
      },
      events: [{ type: 'land', t: landedAt.t, x: Math.max(0, landedAt.x) }],
    };
  }
  const moved = stepKinematic(flight, g, dt);
  const numeric = stepKinematic(flight.numeric, g, dt);
  const hoop = sampleHoop({ ...flight, ...moved }, target);
  return {
    flight: {
      ...flight,
      ...moved,
      numeric,
      maxHeight: Math.max(flight.maxHeight, moved.y),
      hoopMinDist: hoop.hoopMinDist,
      hoopHit: hoop.hoopHit,
    },
    events: [],
  };
}

function advanceDrop(drop, g, dt) {
  if (!drop || drop.landed) return { drop, events: [] };
  const hit = timeToGround(Math.max(0, drop.y), drop.vy, g);
  if (hit <= dt + EPS) {
    const t = drop.t + Math.max(0, hit);
    return {
      drop: { t, y: 0, vy: drop.vy - g * Math.max(0, hit), landed: true, landTime: t },
      events: [{ type: 'drop-land', t }],
    };
  }
  const y = drop.y + drop.vy * dt - 0.5 * g * dt * dt;
  const vy = drop.vy - g * dt;
  return {
    drop: { t: drop.t + dt, y, vy, landed: false, landTime: null },
    events: [],
  };
}

export function stepLab(lab, dt) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!isFiniteNumber(dt) || dt < 0) return fail(lab, 'invalid-dt');
  if (dt === 0 || lab.paused) {
    return { ok: true, lab: freezeLab(lab), events: [] };
  }
  if (!lab.flight && !lab.drop) {
    return { ok: true, lab: freezeLab(lab), events: [] };
  }

  let remaining = dt;
  let flight = lab.flight ? { ...lab.flight, numeric: { ...lab.flight.numeric } } : null;
  let drop = lab.drop ? { ...lab.drop } : null;
  const events = [];

  while (remaining > EPS) {
    const flightDone = !flight || flight.landed;
    const dropDone = !drop || drop.landed;
    if (flightDone && dropDone) break;
    const slice = remaining;
    if (flight && !flight.landed) {
      const moved = advanceFlight(flight, lab.g, slice, lab.target);
      flight = moved.flight;
      events.push(...moved.events);
    }
    if (drop && !drop.landed) {
      const moved = advanceDrop(drop, lab.g, slice);
      drop = moved.drop;
      events.push(...moved.events);
    }
    remaining = 0;
  }

  return {
    ok: true,
    events,
    lab: freezeLab({ ...lab, flight, drop }),
  };
}

function trialKey(trial) {
  return [trial.mode, trial.height, trial.speed, trial.angleDeg, trial.g].join('@');
}

function isComplete(trials) {
  const hasCompare = trials.some((trial) => (
    trial.mode === 'compare'
    && isFiniteNumber(trial.flightTime)
    && isFiniteNumber(trial.dropTime)
    && Math.abs(trial.flightTime - trial.dropTime) <= 0.02
  ));
  const hasHit = trials.some((trial) => trial.hoopHit);
  return hasCompare && hasHit;
}

export function recordTrial(lab) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!lab.flight) return fail(withReason(lab, 'no-flight'), 'no-flight');
  if (!lab.flight.landed) return fail(withReason(lab, 'still-flying'), 'still-flying');

  const trial = {
    height: lab.height,
    speed: lab.speed,
    angleDeg: lab.angleDeg,
    g: lab.g,
    flightTime: lab.flight.landTime,
    range: lab.flight.range,
    maxHeight: lab.flight.maxHeight,
    dropTime: lab.drop?.landTime ?? null,
    hoopHit: Boolean(lab.flight.hoopHit),
    hoopMinDist: lab.flight.hoopMinDist,
    mode: lab.drop ? 'compare' : 'single',
  };
  if (lab.trials.some((row) => trialKey(row) === trialKey(trial))) {
    return fail(withReason(lab, 'duplicate-trial'), 'duplicate-trial');
  }
  const trials = [...lab.trials, trial];
  return {
    ok: true,
    lab: freezeLab({
      ...lab,
      trials,
      phase: isComplete(trials) ? 'complete' : lab.phase,
      lastReason: null,
    }),
  };
}

export function resetFlight(lab) {
  if (!lab) return fail(lab, 'invalid-lab');
  return {
    ok: true,
    lab: withReason({
      ...lab,
      paused: false,
      flight: null,
      drop: null,
    }, null),
  };
}

export function resetLab(_lab) {
  return { ok: true, lab: createLab() };
}

export function serializeLab(lab) {
  return JSON.stringify({
    version: 1,
    height: lab.height,
    speed: lab.speed,
    angleDeg: lab.angleDeg,
    g: lab.g,
    paused: lab.paused,
    flight: lab.flight,
    drop: lab.drop,
    trials: lab.trials,
    target: lab.target,
    phase: lab.phase,
  });
}

export function parseLab(raw) {
  if (raw == null) return { ok: false, reason: 'invalid-save' };
  let data = raw;
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw);
    } catch {
      return { ok: false, reason: 'invalid-save' };
    }
  }
  if (!data || typeof data !== 'object' || data.version !== 1) {
    return { ok: false, reason: 'invalid-save' };
  }
  if (!Array.isArray(data.trials)) return { ok: false, reason: 'invalid-save' };
  return { ok: true, lab: createLab(data) };
}
