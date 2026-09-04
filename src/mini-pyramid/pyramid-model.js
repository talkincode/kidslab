/* Mini Pyramid · pure mechanics model.
   Values use tonnes-force and metres for a deliberately qualitative primary-school
   workshop: every successful plan keeps ideal work (force × distance) visible. */

const MAX_FORCE = 4;
const RAMP_LOAD = 12;
const RAMP_RISE = 2;
const LEVER_LOAD = 10;
const LEVER_LOAD_ARM = 1;
const PULLEY_LOAD = 12;
const PULLEY_RISE = 2;
const MISSION_ORDER = ['ramp', 'lever', 'pulley'];

function finitePositive(value) {
  return Number.isFinite(value) && value > 0;
}

function invalid(error) {
  return { error, effort: null, distance: null, work: null };
}

function rampPlan({ load = RAMP_LOAD, rise = RAMP_RISE, length } = {}) {
  if (!finitePositive(load) || !finitePositive(rise) || !finitePositive(length) || length <= rise) {
    return invalid('invalid-ramp');
  }
  const effort = (load * rise) / length;
  const distance = length;
  return {
    error: null,
    effort,
    distance,
    work: load * rise,
    maxForce: MAX_FORCE,
    kind: 'ramp',
  };
}

function leverPlan({ load = LEVER_LOAD, loadArm = LEVER_LOAD_ARM, effortArm } = {}) {
  if (!finitePositive(load) || !finitePositive(loadArm) || !finitePositive(effortArm)) {
    return invalid('invalid-lever');
  }
  return {
    error: null,
    effort: (load * loadArm) / effortArm,
    distance: 1,
    effortDistance: effortArm / loadArm,
    work: load,
    maxForce: MAX_FORCE,
    kind: 'lever',
  };
}

function pulleyPlan({ load = PULLEY_LOAD, rise = PULLEY_RISE, supports } = {}) {
  if (!finitePositive(load) || !finitePositive(rise) || !Number.isInteger(supports) || supports < 1) {
    return invalid('invalid-pulley');
  }
  return {
    error: null,
    effort: load / supports,
    distance: rise * supports,
    work: load * rise,
    maxForce: MAX_FORCE,
    kind: 'pulley',
  };
}

function createSite() {
  return {
    mission: 0,
    cleared: [],
    complete: false,
    lastError: null,
    attempts: [],
  };
}

function cloneSite(site) {
  return {
    ...site,
    cleared: [...(site.cleared || [])],
    attempts: [...(site.attempts || [])],
  };
}

function planFor(choice) {
  if (choice?.kind === 'ramp') return rampPlan(choice);
  if (choice?.kind === 'lever') return leverPlan(choice);
  if (choice?.kind === 'pulley') return pulleyPlan(choice);
  return invalid('invalid-choice');
}

function applyChoice(site, choice) {
  const next = cloneSite(site);
  const expected = MISSION_ORDER[next.mission];
  const plan = planFor(choice);

  if (next.complete || !expected || choice?.kind !== expected) {
    next.lastError = 'wrong-station';
    return { site: next, plan, error: 'wrong-station' };
  }

  const error = plan.error || (plan.effort > MAX_FORCE ? 'too-heavy' : null);
  next.attempts.push({ kind: choice.kind, error });
  next.lastError = error;
  if (error) return { site: next, plan, error };

  next.cleared.push(expected);
  next.mission += 1;
  next.complete = next.mission === MISSION_ORDER.length;
  return { site: next, plan, error: null };
}

export {
  MAX_FORCE,
  RAMP_LOAD,
  RAMP_RISE,
  LEVER_LOAD,
  LEVER_LOAD_ARM,
  PULLEY_LOAD,
  PULLEY_RISE,
  MISSION_ORDER,
  createSite,
  rampPlan,
  leverPlan,
  pulleyPlan,
  applyChoice,
};
