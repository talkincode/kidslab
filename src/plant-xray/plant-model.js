export const ORGANS = Object.freeze(['root', 'stem', 'leaf', 'flower', 'fruit']);
export const STRESSES = Object.freeze(['dry', 'dark', 'flood']);
export const JOB_ORGAN = 'root';

export function createGarden() {
  return {
    planted: false,
    moisture: 0,
    radicle: false,
    shoot: false,
    rotten: false,
    plotA: { cared: false, look: 'seedling' },
    plotB: { stress: null, look: 'seedling' },
    waitedCompare: false,
    cause: null,
    organs: [],
    jobAnswer: null,
  };
}

function clone(garden) {
  return {
    ...garden,
    plotA: { ...garden.plotA },
    plotB: { ...garden.plotB },
    organs: Array.isArray(garden.organs) ? [...garden.organs] : [],
  };
}

export function seedLook(garden) {
  if (garden.rotten) return 'rotten';
  if (garden.shoot) return 'sprout';
  if (garden.radicle) return 'radicle';
  if (garden.planted) return garden.moisture > 0 ? 'buried-wet' : 'buried';
  return 'surface';
}

export function plant(garden) {
  const next = clone(garden);
  if (next.rotten) {
    next.planted = true;
    next.moisture = 0;
    next.radicle = false;
    next.shoot = false;
    next.rotten = false;
    next.error = null;
    return next;
  }
  if (next.planted) return { ...next, error: 'already-planted' };
  next.planted = true;
  next.error = null;
  return next;
}

export function waterSeed(garden) {
  const next = clone(garden);
  if (!next.planted) return { ...next, error: 'not-planted' };
  if (next.rotten) return { ...next, error: 'rotten' };
  if (next.moisture >= 2) return { ...next, error: 'already-flooded' };
  next.moisture = 1;
  next.error = null;
  return next;
}

export function floodSeed(garden) {
  const next = clone(garden);
  if (!next.planted) return { ...next, error: 'not-planted' };
  if (next.rotten) return { ...next, error: 'rotten' };
  next.moisture = 2;
  next.error = null;
  return next;
}

export function waitGerminate(garden) {
  const next = clone(garden);
  if (!next.planted) return { ...next, error: 'not-planted' };
  if (next.rotten) return { ...next, error: 'rotten' };
  if (next.moisture >= 2) {
    next.rotten = true;
    next.radicle = false;
    next.shoot = false;
    next.error = 'rotted';
    return next;
  }
  if (next.moisture < 1) return { ...next, error: 'thirsty' };
  if (!next.radicle) {
    next.radicle = true;
    next.error = null;
    return next;
  }
  if (!next.shoot) {
    next.shoot = true;
    next.error = null;
    return next;
  }
  return { ...next, error: 'already-sprouted' };
}

export function carePlotA(garden) {
  const next = clone(garden);
  next.plotA.cared = true;
  if (!next.waitedCompare) next.plotA.look = 'cared';
  next.error = null;
  return next;
}

export function setStressB(garden, stress) {
  const next = clone(garden);
  if (!STRESSES.includes(stress)) return { ...next, error: 'bad-stress' };
  if (next.waitedCompare) return { ...next, error: 'already-compared' };
  next.plotB.stress = stress;
  next.plotB.look = 'ready';
  next.error = null;
  return next;
}

export function waitCompare(garden) {
  const next = clone(garden);
  if (!next.plotA.cared) return { ...next, error: 'a-not-cared' };
  if (!next.plotB.stress) return { ...next, error: 'b-no-stress' };
  next.waitedCompare = true;
  next.plotA.look = 'healthy';
  next.plotB.look = next.plotB.stress === 'dry'
    ? 'wilted'
    : next.plotB.stress === 'dark'
      ? 'leggy'
      : 'soggy';
  next.error = null;
  return next;
}

export function guessCause(garden, cause) {
  const next = clone(garden);
  if (!STRESSES.includes(cause)) return { ...next, error: 'bad-cause' };
  if (!next.waitedCompare) return { ...next, error: 'no-compare' };
  if (cause !== next.plotB.stress) return { ...next, error: 'wrong-cause' };
  next.cause = cause;
  next.error = null;
  return next;
}

export function revealOrgan(garden, organ) {
  const next = clone(garden);
  if (!ORGANS.includes(organ)) return { ...next, error: 'bad-organ' };
  if (next.organs.includes(organ)) return { ...next, error: 'dup-organ' };
  next.organs.push(organ);
  next.error = null;
  return next;
}

export function atlasComplete(garden) {
  return ORGANS.every((id) => garden.organs.includes(id));
}

export function answerJob(garden, organ) {
  const next = clone(garden);
  if (!atlasComplete(next)) return { ...next, error: 'atlas-incomplete' };
  if (organ !== JOB_ORGAN) return { ...next, error: 'wrong-job' };
  next.jobAnswer = organ;
  next.error = null;
  return next;
}

export function campComplete(garden, camp) {
  if (camp === 0) return Boolean(garden.radicle && garden.shoot && !garden.rotten);
  if (camp === 1) return Boolean(garden.waitedCompare && garden.cause === garden.plotB.stress);
  if (camp === 2) return Boolean(atlasComplete(garden) && garden.jobAnswer === JOB_ORGAN);
  return false;
}
