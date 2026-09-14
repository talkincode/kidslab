/**
 * 圆周与卫星实验室 · 会话层
 * 无 DOM / 无 three。物理公式仍在 orbit-model.js。
 */

import {
  EARTH_RADIUS,
  SYNC_PERIOD_SECONDS,
  circularSpeed,
  classifyLaunch,
  createFlight,
  describeOrbit,
  escapeSpeed,
  isSyncOrbit,
  simulationStep,
  stepFlight,
} from './orbit-model.js';

export const ALTITUDE_MIN_KM = 200;
export const ALTITUDE_MAX_KM = 40000;
export const SPEED_RATIO_MIN = 0.6;
export const SPEED_RATIO_MAX = 1.6;
export const LAP_TARGET_SECONDS = 9;

const TWO_PI = Math.PI * 2;

function finite(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function fail(lab, reason) {
  return { ok: false, reason, lab };
}

function freezeLab(lab) {
  return Object.freeze({
    ...lab,
    seen: Object.freeze({ ...lab.seen }),
    trials: Object.freeze((lab.trials ?? []).map((trial) => Object.freeze({ ...trial }))),
    pending: lab.pending ? Object.freeze({ ...lab.pending }) : null,
  });
}

function withReason(lab, lastReason) {
  return freezeLab({ ...lab, lastReason });
}

function emptySeen() {
  return { circular: false, ellipse: false, crash: false, escape: false };
}

function seenFromTrials(trials) {
  const seen = emptySeen();
  for (const trial of trials) {
    if (trial.kind in seen) seen[trial.kind] = true;
  }
  return seen;
}

function isComplete(trials) {
  const seen = seenFromTrials(trials);
  return seen.circular && seen.crash && seen.escape;
}

export function clampAltitudeKm(value) {
  return Math.min(ALTITUDE_MAX_KM, Math.max(ALTITUDE_MIN_KM, Math.round(value)));
}

export function clampSpeedRatio(value) {
  return Math.min(SPEED_RATIO_MAX, Math.max(SPEED_RATIO_MIN, Math.round(value * 500) / 500));
}

export function launchRadius(lab) {
  return EARTH_RADIUS + lab.altitudeKm * 1000;
}

export function launchSpeedOf(lab) {
  return circularSpeed(launchRadius(lab)) * lab.speedRatio;
}

export function previewOrbit(lab) {
  return describeOrbit(launchRadius(lab), launchSpeedOf(lab));
}

function clearFlight(lab) {
  return {
    ...lab,
    launched: false,
    orbit: null,
    flight: null,
    measuredPeriod: null,
    outcome: null,
    pending: null,
    simulationDebt: 0,
    referencePeriod: null,
    lastReason: null,
  };
}

export function createLab(raw = {}) {
  const altitudeKm = finite(raw.altitudeKm) ? clampAltitudeKm(raw.altitudeKm) : 400;
  const speedRatio = finite(raw.speedRatio) ? clampSpeedRatio(raw.speedRatio) : 1;
  const trials = Array.isArray(raw.trials) ? raw.trials.map((trial) => ({ ...trial })) : [];
  const showVectors = raw.showVectors !== false;
  return freezeLab({
    altitudeKm,
    speedRatio,
    showVectors,
    launched: false,
    orbit: null,
    flight: null,
    measuredPeriod: null,
    outcome: null,
    pending: null,
    trials,
    seen: seenFromTrials(trials),
    simulationDebt: 0,
    referencePeriod: null,
    phase: isComplete(trials) ? 'complete' : 'ready',
    lastReason: null,
  });
}

export function setAltitudeKm(lab, altitudeKm) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!finite(altitudeKm)) return fail(lab, 'invalid-altitude');
  if (altitudeKm < ALTITUDE_MIN_KM || altitudeKm > ALTITUDE_MAX_KM) {
    return fail(lab, 'out-of-range-altitude');
  }
  return { ok: true, lab: freezeLab(clearFlight({ ...lab, altitudeKm: clampAltitudeKm(altitudeKm) })) };
}

export function setSpeedRatio(lab, speedRatio) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!finite(speedRatio)) return fail(lab, 'invalid-speed');
  if (speedRatio < SPEED_RATIO_MIN || speedRatio > SPEED_RATIO_MAX) {
    return fail(lab, 'out-of-range-speed');
  }
  return { ok: true, lab: freezeLab(clearFlight({ ...lab, speedRatio: clampSpeedRatio(speedRatio) })) };
}

export function setShowVectors(lab, showVectors) {
  if (!lab) return fail(lab, 'invalid-lab');
  return { ok: true, lab: withReason({ ...lab, showVectors: Boolean(showVectors) }, null) };
}

export function launch(lab) {
  if (!lab) return fail(lab, 'invalid-lab');
  const radius = launchRadius(lab);
  const speed = launchSpeedOf(lab);
  const orbit = describeOrbit(radius, speed);
  if (!orbit) return fail(lab, 'invalid-launch');
  const referencePeriod = Math.max(600, orbit.period ?? simulationStep(radius) * 1440);
  return {
    ok: true,
    lab: freezeLab({
      ...clearFlight(lab),
      launched: true,
      orbit,
      flight: createFlight(orbit),
      referencePeriod,
    }),
  };
}

export function abort(lab) {
  if (!lab) return fail(lab, 'invalid-lab');
  return { ok: true, lab: freezeLab(clearFlight(lab)) };
}

function makePending(lab, kind, period) {
  return {
    altitudeKm: lab.altitudeKm,
    speed: launchSpeedOf(lab),
    speedRatio: lab.speedRatio,
    kind,
    period,
    perigee: lab.orbit?.apsides?.perigee ?? null,
  };
}

export function stepLab(lab, realDelta) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!finite(realDelta) || realDelta < 0) return fail(lab, 'invalid-dt');
  if (!lab.launched || !lab.flight || !lab.orbit || realDelta === 0) {
    return { ok: true, lab: freezeLab(lab), events: [] };
  }
  if (lab.flight.status === 'crashed' || lab.flight.status === 'escaped') {
    return { ok: true, lab: freezeLab(lab), events: [] };
  }

  const radius = launchRadius(lab);
  const step = simulationStep(radius);
  const missionPerSecond = lab.referencePeriod / LAP_TARGET_SECONDS;
  let debt = lab.simulationDebt + realDelta * missionPerSecond;
  let flight = lab.flight;
  let measuredPeriod = lab.measuredPeriod;
  let outcome = lab.outcome;
  let pending = lab.pending;
  const events = [];
  let guard = 0;

  while (debt >= step && guard < 400) {
    let next = stepFlight(lab.orbit, flight, step);
    debt -= step;
    guard += 1;
    if (next.status === 'lap') {
      if (measuredPeriod === null) {
        measuredPeriod = next.lapSeconds;
        outcome = lab.orbit.kind;
        pending = makePending(lab, outcome, measuredPeriod);
        events.push({ type: 'lap', kind: outcome, period: measuredPeriod });
      }
      next = { ...next, status: 'flying', travelled: next.travelled - TWO_PI };
    }
    flight = next;
    if (next.status === 'crashed') {
      outcome = 'crash';
      measuredPeriod = null;
      pending = makePending({ ...lab, outcome }, 'crash', null);
      events.push({ type: 'crashed' });
      break;
    }
    if (next.status === 'escaped') {
      outcome = 'escape';
      measuredPeriod = null;
      pending = makePending({ ...lab, outcome }, 'escape', null);
      events.push({ type: 'escaped' });
      break;
    }
  }

  return {
    ok: true,
    events,
    lab: freezeLab({
      ...lab,
      flight,
      measuredPeriod,
      outcome,
      pending,
      simulationDebt: debt,
      lastReason: null,
    }),
  };
}

function trialKey(trial) {
  return [trial.altitudeKm, trial.speedRatio, trial.kind].join('@');
}

export function recordTrial(lab) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!lab.pending) {
    if (lab.launched && lab.flight && lab.flight.status === 'flying' && lab.measuredPeriod === null) {
      return fail(withReason(lab, 'still-flying'), 'still-flying');
    }
    return fail(withReason(lab, 'no-flight'), 'no-flight');
  }
  const trial = { ...lab.pending };
  if (lab.trials.some((row) => trialKey(row) === trialKey(trial))) {
    return fail(withReason(lab, 'duplicate-trial'), 'duplicate-trial');
  }
  const trials = [...lab.trials, trial];
  return {
    ok: true,
    lab: freezeLab({
      ...lab,
      trials,
      seen: seenFromTrials(trials),
      phase: isComplete(trials) ? 'complete' : lab.phase,
      lastReason: null,
    }),
  };
}

export function resetLab() {
  return { ok: true, lab: createLab() };
}

function syncKindOf(lab) {
  const reading = lab.pending || lab.trials.at(-1);
  if (!reading) return 'waiting';
  if (reading.kind !== 'circular') return 'not-circular';
  if (isSyncOrbit(reading.period, 'circular')) return 'sync';
  if (finite(reading.period) && reading.period < SYNC_PERIOD_SECONDS) return 'too-low';
  return 'too-high';
}

function statusOf(lab) {
  if (lab.flight?.status === 'crashed') return 'crashed';
  if (lab.flight?.status === 'escaped') return 'escaped';
  if (lab.measuredPeriod !== null) return 'orbiting';
  if (lab.launched) return 'flying';
  return 'ready';
}

export function snapshot(lab) {
  const radius = launchRadius(lab);
  const circular = circularSpeed(radius);
  const escape = escapeSpeed(radius);
  return {
    altitudeKm: lab.altitudeKm,
    speedRatio: lab.speedRatio,
    speed: circular * lab.speedRatio,
    circularSpeed: circular,
    escapeSpeed: escape,
    status: statusOf(lab),
    clock: lab.flight?.elapsed ?? 0,
    kind: lab.pending?.kind ?? lab.outcome ?? classifyLaunch(radius, circular * lab.speedRatio),
    period: lab.pending?.period ?? lab.measuredPeriod,
    perigee: lab.pending?.perigee ?? lab.orbit?.apsides?.perigee ?? null,
    launched: lab.launched,
    pending: Boolean(lab.pending),
    trials: lab.trials.length,
    phase: lab.phase,
    showVectors: lab.showVectors,
    syncKind: syncKindOf(lab),
    seen: { ...lab.seen },
  };
}

export function serializeLab(lab) {
  return JSON.stringify({
    version: 1,
    altitudeKm: lab.altitudeKm,
    speedRatio: lab.speedRatio,
    showVectors: lab.showVectors,
    trials: lab.trials,
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
