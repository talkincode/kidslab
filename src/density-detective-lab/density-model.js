export const REFERENCE_MATERIALS = Object.freeze([
  Object.freeze({ id: 'aluminum', densityGPerCm3: 2.70 }),
  Object.freeze({ id: 'iron', densityGPerCm3: 7.87 }),
  Object.freeze({ id: 'copper', densityGPerCm3: 8.96 }),
]);

export const DENSITY_CASE = Object.freeze({
  initialWaterMl: 40,
  materialId: 'aluminum',
  samples: Object.freeze([
    Object.freeze({ id: 'specimen-a', order: 1, massG: 27, volumeCm3: 10, tone: 'light' }),
    Object.freeze({ id: 'specimen-b', order: 2, massG: 54, volumeCm3: 20, tone: 'mid' }),
    Object.freeze({ id: 'specimen-c', order: 3, massG: 81, volumeCm3: 30, tone: 'deep' }),
  ]),
});

function finiteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function getSpecimen(id) {
  return DENSITY_CASE.samples.find((sample) => sample.id === id) || null;
}

export function calculateDensity(massG, volumeCm3) {
  if (!finiteNumber(massG) || !finiteNumber(volumeCm3) || massG < 0 || volumeCm3 <= 0) return null;
  return massG / volumeCm3;
}

export function createMeasurement(sample, initialWaterMl = DENSITY_CASE.initialWaterMl) {
  if (!sample || !finiteNumber(initialWaterMl) || initialWaterMl < 0) return null;
  const finalWaterMl = initialWaterMl + sample.volumeCm3;
  return Object.freeze({
    specimenId: sample.id,
    massG: sample.massG,
    initialWaterMl,
    finalWaterMl,
    displacedVolumeMl: finalWaterMl - initialWaterMl,
    volumeCm3: sample.volumeCm3,
    densityGPerCm3: calculateDensity(sample.massG, sample.volumeCm3),
  });
}

export function isMeasurementEntryAccurate(measurement, massG, displacedVolumeMl, tolerance = 0.05) {
  if (!measurement || !finiteNumber(massG) || !finiteNumber(displacedVolumeMl)) return false;
  return Math.abs(measurement.massG - massG) <= tolerance
    && Math.abs(measurement.displacedVolumeMl - displacedVolumeMl) <= tolerance;
}

export function calculateMassVolumeSlope(records) {
  if (!Array.isArray(records) || !records.length) return null;
  let sumMassVolume = 0;
  let sumVolumeSquared = 0;
  for (const record of records) {
    if (!record || !finiteNumber(record.massG) || !finiteNumber(record.volumeCm3) || record.volumeCm3 <= 0) {
      return null;
    }
    sumMassVolume += record.massG * record.volumeCm3;
    sumVolumeSquared += record.volumeCm3 ** 2;
  }
  return sumVolumeSquared ? sumMassVolume / sumVolumeSquared : null;
}

export function identifyMaterial(densityGPerCm3, materials = REFERENCE_MATERIALS, tolerance = 0.18) {
  if (!finiteNumber(densityGPerCm3) || !Array.isArray(materials) || !materials.length) return null;
  const nearest = materials.reduce((best, material) => (
    Math.abs(material.densityGPerCm3 - densityGPerCm3)
      < Math.abs(best.densityGPerCm3 - densityGPerCm3)
      ? material
      : best
  ));
  return Math.abs(nearest.densityGPerCm3 - densityGPerCm3) <= tolerance ? nearest : null;
}

function cloneLab(lab) {
  return {
    selectedSpecimenId: lab.selectedSpecimenId,
    observation: { weighed: lab.observation.weighed, submerged: lab.observation.submerged },
    records: lab.records.slice(),
    identifiedMaterialId: lab.identifiedMaterialId,
    complete: lab.complete,
  };
}

function fail(lab, reason) {
  return { ok: false, reason, lab: cloneLab(lab) };
}

function recordFor(lab, specimenId) {
  return lab.records.find((record) => record.specimenId === specimenId) || null;
}

export function createLab() {
  return {
    selectedSpecimenId: 'specimen-a',
    observation: { weighed: false, submerged: false },
    records: [],
    identifiedMaterialId: null,
    complete: false,
  };
}

export function resetLab() {
  return createLab();
}

export function liveReadings(lab) {
  const sample = getSpecimen(lab?.selectedSpecimenId);
  if (!sample) {
    return { massG: null, initialWaterMl: null, finalWaterMl: null, volumeCm3: null };
  }
  const measurement = createMeasurement(sample);
  const weighed = Boolean(recordFor(lab, sample.id) || lab.observation.weighed);
  const submerged = Boolean(recordFor(lab, sample.id) || lab.observation.submerged);
  return {
    massG: weighed ? measurement.massG : null,
    initialWaterMl: measurement.initialWaterMl,
    finalWaterMl: submerged ? measurement.finalWaterMl : null,
    volumeCm3: submerged ? measurement.volumeCm3 : null,
  };
}

export function selectSpecimen(lab, specimenId) {
  if (!lab) return fail(createLab(), 'invalid-lab');
  if (!getSpecimen(specimenId)) return fail(lab, 'unknown-specimen');
  const next = cloneLab(lab);
  next.selectedSpecimenId = specimenId;
  if (!recordFor(lab, specimenId)) {
    next.observation = { weighed: false, submerged: false };
  }
  return { ok: true, lab: next };
}

export function weighSpecimen(lab) {
  if (!lab) return fail(createLab(), 'invalid-lab');
  const sample = getSpecimen(lab.selectedSpecimenId);
  if (!sample) return fail(lab, 'unknown-specimen');
  if (recordFor(lab, sample.id)) return fail(lab, 'already-recorded');
  const next = cloneLab(lab);
  next.observation.weighed = true;
  return { ok: true, lab: next };
}

export function submergeSpecimen(lab) {
  if (!lab) return fail(createLab(), 'invalid-lab');
  const sample = getSpecimen(lab.selectedSpecimenId);
  if (!sample) return fail(lab, 'unknown-specimen');
  if (recordFor(lab, sample.id)) return fail(lab, 'already-recorded');
  if (!lab.observation.weighed) return fail(lab, 'weigh-first');
  const next = cloneLab(lab);
  next.observation.submerged = true;
  return { ok: true, lab: next };
}

export function logLiveTrial(lab) {
  if (!lab) return fail(createLab(), 'invalid-lab');
  const sample = getSpecimen(lab.selectedSpecimenId);
  if (!sample) return fail(lab, 'unknown-specimen');
  if (recordFor(lab, sample.id)) return fail(lab, 'already-recorded');
  if (!lab.observation.weighed || !lab.observation.submerged) {
    return fail(lab, 'need-both-readings');
  }
  const measurement = createMeasurement(sample);
  const next = cloneLab(lab);
  next.records.push(measurement);
  next.observation = { weighed: false, submerged: false };
  const remaining = DENSITY_CASE.samples.find((entry) => !recordFor(next, entry.id));
  if (remaining) {
    next.selectedSpecimenId = remaining.id;
  } else {
    const slope = calculateMassVolumeSlope(next.records);
    const identified = identifyMaterial(slope);
    next.identifiedMaterialId = identified?.id ?? null;
    next.complete = Boolean(identified);
  }
  return { ok: true, trial: measurement, lab: next };
}
