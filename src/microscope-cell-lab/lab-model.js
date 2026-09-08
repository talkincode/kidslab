/* ============================================================
   显微细胞实验室纯模型 · 无 DOM / 无 three
   目镜 10×，物镜 4/10/40×，FN = 18 mm。
   舞台高度 = 粗准焦 + 细准焦，焦点在 0 μm。
   ============================================================ */

export const EYEPIECE_MAG = 10;
export const FIELD_NUMBER_MM = 18;
export const OBJECTIVES = Object.freeze([4, 10, 40]);
export const SLIDES = Object.freeze(['onion', 'cheek']);

export const LIMITS = Object.freeze({
  coarseUm: Object.freeze([-2000, 2000]),
  fineUm: Object.freeze([-40, 40]),
  light: Object.freeze([0, 100]),
});

export const LIGHT_OK = Object.freeze([25, 80]);

export const CELL_SPECS = Object.freeze({
  onion: Object.freeze({
    id: 'onion',
    lengthUm: 200,
    widthUm: 50,
    hasWall: true,
    hasChloroplast: false,
    hasLargeVacuole: true,
    nucleus: 'side',
    shape: 'rectangle',
  }),
  cheek: Object.freeze({
    id: 'cheek',
    lengthUm: 50,
    widthUm: 50,
    hasWall: false,
    hasChloroplast: false,
    hasLargeVacuole: false,
    nucleus: 'center',
    shape: 'irregular',
  }),
});

const DEFAULTS = Object.freeze({
  version: 1,
  seed: 42,
  slide: 'onion',
  objectiveMag: 4,
  light: 40,
  coarseUm: -800,
  fineUm: 0,
  clipOn: true,
  crushed: false,
  trials: Object.freeze([]),
  phase: 'observe',
  lastReason: null,
});

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function freezeLab(lab) {
  return {
    ...lab,
    trials: Object.freeze(lab.trials.map((trial) => Object.freeze({ ...trial }))),
  };
}

function fail(lab, reason) {
  return { ok: false, reason, lab };
}

export function totalMagnification(objectiveMag) {
  return EYEPIECE_MAG * objectiveMag;
}

export function fieldDiameterMm(objectiveMag) {
  return FIELD_NUMBER_MM / objectiveMag;
}

export function depthOfFieldUm(objectiveMag) {
  if (objectiveMag <= 4) return 80;
  if (objectiveMag <= 10) return 20;
  return 4;
}

export function estimateCellLengthUm(fieldMm, cellsAcross) {
  return (fieldMm * 1000) / cellsAcross;
}

export function stageUm(lab) {
  return lab.coarseUm + lab.fineUm;
}

export function createLab(partial = {}) {
  const slide = SLIDES.includes(partial.slide) ? partial.slide : DEFAULTS.slide;
  const objectiveMag = OBJECTIVES.includes(partial.objectiveMag)
    ? partial.objectiveMag
    : DEFAULTS.objectiveMag;
  return freezeLab({
    version: 1,
    seed: isFiniteNumber(partial.seed) ? partial.seed : DEFAULTS.seed,
    slide,
    objectiveMag,
    light: clamp(
      isFiniteNumber(partial.light) ? partial.light : DEFAULTS.light,
      ...LIMITS.light,
    ),
    coarseUm: clamp(
      isFiniteNumber(partial.coarseUm) ? partial.coarseUm : DEFAULTS.coarseUm,
      ...LIMITS.coarseUm,
    ),
    fineUm: clamp(
      isFiniteNumber(partial.fineUm) ? partial.fineUm : DEFAULTS.fineUm,
      ...LIMITS.fineUm,
    ),
    clipOn: partial.clipOn !== false,
    crushed: Boolean(partial.crushed),
    trials: Array.isArray(partial.trials) ? partial.trials.map((trial) => ({ ...trial })) : [],
    phase: partial.phase === 'complete' ? 'complete' : 'observe',
    lastReason: partial.lastReason ?? null,
  });
}

export function sharpnessOf(lab) {
  const defocus = Math.abs(stageUm(lab));
  const dof = depthOfFieldUm(lab.objectiveMag);
  if (defocus <= dof) return 1;
  const fall = 1 - (defocus - dof) / (dof * 6);
  return Math.max(0, Number(fall.toFixed(4)));
}

export function snapshotView(lab) {
  if (!lab) return null;
  const sharpness = sharpnessOf(lab);
  const inFocus = sharpness >= 1;
  const lightOk = lab.light >= LIGHT_OK[0] && lab.light <= LIGHT_OK[1];
  const visible = inFocus && lightOk && lab.clipOn && !lab.crushed;
  const spec = CELL_SPECS[lab.slide];
  const fieldMm = fieldDiameterMm(lab.objectiveMag);
  const cellsAcross = (fieldMm * 1000) / spec.lengthUm;
  return {
    eyepieceMag: EYEPIECE_MAG,
    objectiveMag: lab.objectiveMag,
    totalMag: totalMagnification(lab.objectiveMag),
    fieldDiameterMm: fieldMm,
    stageUm: stageUm(lab),
    defocusUm: Math.abs(stageUm(lab)),
    dofUm: depthOfFieldUm(lab.objectiveMag),
    sharpness,
    inFocus,
    light: lab.light,
    lightOk,
    visible,
    slide: lab.slide,
    cellsAcross,
    estimatedCellLengthUm: spec.lengthUm,
    features: visible
      ? {
          hasWall: spec.hasWall,
          hasChloroplast: spec.hasChloroplast,
          hasLargeVacuole: spec.hasLargeVacuole,
          nucleus: spec.nucleus,
          shape: spec.shape,
        }
      : null,
  };
}

function withReason(lab, lastReason) {
  return freezeLab({ ...lab, lastReason });
}

export function setObjective(lab, objectiveMag) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!OBJECTIVES.includes(objectiveMag)) return fail(lab, 'invalid-objective');
  if (lab.crushed) return fail(lab, 'crushed');
  if (objectiveMag === lab.objectiveMag) {
    return { ok: true, lab: withReason(lab, null) };
  }
  if (objectiveMag > lab.objectiveMag && sharpnessOf(lab) < 0.5) {
    return fail(withReason(lab, 'focus-first'), 'focus-first');
  }
  return {
    ok: true,
    lab: withReason({ ...lab, objectiveMag }, null),
  };
}

export function setSlide(lab, slide) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!SLIDES.includes(slide)) return fail(lab, 'invalid-slide');
  return {
    ok: true,
    lab: withReason({ ...lab, slide }, null),
  };
}

export function setLight(lab, light) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!isFiniteNumber(light)) return fail(lab, 'invalid-light');
  if (light < LIMITS.light[0] || light > LIMITS.light[1]) {
    return fail(lab, 'out-of-range-light');
  }
  return {
    ok: true,
    lab: withReason({ ...lab, light }, null),
  };
}

export function turnCoarse(lab, deltaUm) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!isFiniteNumber(deltaUm)) return fail(lab, 'invalid-delta');
  if (lab.objectiveMag >= 40) {
    return fail(withReason(lab, 'coarse-forbidden-on-high-power'), 'coarse-forbidden-on-high-power');
  }
  const coarseUm = clamp(lab.coarseUm + deltaUm, ...LIMITS.coarseUm);
  return {
    ok: true,
    lab: withReason({ ...lab, coarseUm }, null),
  };
}

export function turnFine(lab, deltaUm) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!isFiniteNumber(deltaUm)) return fail(lab, 'invalid-delta');
  const fineUm = clamp(lab.fineUm + deltaUm, ...LIMITS.fineUm);
  return {
    ok: true,
    lab: withReason({ ...lab, fineUm }, null),
  };
}

export function setCoarseUm(lab, coarseUm) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!isFiniteNumber(coarseUm)) return fail(lab, 'invalid-delta');
  if (lab.objectiveMag >= 40) {
    return fail(withReason(lab, 'coarse-forbidden-on-high-power'), 'coarse-forbidden-on-high-power');
  }
  return {
    ok: true,
    lab: withReason({ ...lab, coarseUm: clamp(coarseUm, ...LIMITS.coarseUm) }, null),
  };
}

export function setFineUm(lab, fineUm) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!isFiniteNumber(fineUm)) return fail(lab, 'invalid-delta');
  return {
    ok: true,
    lab: withReason({ ...lab, fineUm: clamp(fineUm, ...LIMITS.fineUm) }, null),
  };
}

function trialKey(trial) {
  return `${trial.slide}@${trial.objectiveMag}`;
}

function isComplete(trials) {
  const keys = new Set(trials.map(trialKey));
  return keys.has('onion@4') && keys.has('onion@10') && keys.has('cheek@10');
}

export function recordTrial(lab) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (lab.crushed) return fail(lab, 'crushed');
  if (!lab.clipOn) return fail(lab, 'no-clip');
  const view = snapshotView(lab);
  if (!view.inFocus) return fail(withReason(lab, 'out-of-focus'), 'out-of-focus');
  if (lab.light < 15) return fail(withReason(lab, 'too-dark'), 'too-dark');
  if (lab.light > 90) return fail(withReason(lab, 'too-bright'), 'too-bright');
  if (!view.lightOk) return fail(withReason(lab, 'light-unusable'), 'light-unusable');

  const trial = {
    slide: lab.slide,
    objectiveMag: lab.objectiveMag,
    totalMag: view.totalMag,
    fieldDiameterMm: view.fieldDiameterMm,
    cellsAcross: view.cellsAcross,
    estimatedCellLengthUm: view.estimatedCellLengthUm,
    light: lab.light,
    features: { ...view.features },
  };
  if (lab.trials.some((row) => trialKey(row) === trialKey(trial))) {
    return fail(withReason(lab, 'duplicate-trial'), 'duplicate-trial');
  }
  const trials = [...lab.trials, trial];
  const phase = isComplete(trials) ? 'complete' : 'observe';
  return {
    ok: true,
    lab: freezeLab({ ...lab, trials, phase, lastReason: null }),
  };
}

export function resetLab(_lab) {
  return { ok: true, lab: createLab() };
}

export function serializeLab(lab) {
  return JSON.stringify({
    version: 1,
    seed: lab.seed,
    slide: lab.slide,
    objectiveMag: lab.objectiveMag,
    light: lab.light,
    coarseUm: lab.coarseUm,
    fineUm: lab.fineUm,
    clipOn: lab.clipOn,
    crushed: lab.crushed,
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
  if (!SLIDES.includes(data.slide) || !OBJECTIVES.includes(data.objectiveMag)) {
    return { ok: false, reason: 'invalid-save' };
  }
  if (!Array.isArray(data.trials)) return { ok: false, reason: 'invalid-save' };
  return { ok: true, lab: createLab(data) };
}
