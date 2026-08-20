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
