import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DENSITY_CASE,
  REFERENCE_MATERIALS,
  calculateDensity,
  calculateMassVolumeSlope,
  createMeasurement,
  getSpecimen,
  identifyMaterial,
  isMeasurementEntryAccurate,
} from '../../src/density-detective-lab/density-model.js';

test('water displacement creates consistent mass, volume, and density measurements', () => {
  const specimen = getSpecimen('specimen-b');
  const measurement = createMeasurement(specimen);

  assert.equal(measurement.initialWaterMl, 40);
  assert.equal(measurement.finalWaterMl, 60);
  assert.equal(measurement.displacedVolumeMl, 20);
  assert.equal(measurement.volumeCm3, 20);
  assert.equal(measurement.densityGPerCm3, 2.7);
  assert.equal(calculateDensity(54, 20), 2.7);
});

test('measurement entry validation rejects an incorrect balance or displacement reading', () => {
  const measurement = createMeasurement(getSpecimen('specimen-a'));

  assert.equal(isMeasurementEntryAccurate(measurement, 27, 10), true);
  assert.equal(isMeasurementEntryAccurate(measurement, 26.8, 10), false);
  assert.equal(isMeasurementEntryAccurate(measurement, 27, 9), false);
  assert.equal(calculateDensity(10, 0), null);
});

test('three samples form a mass-volume slope that identifies aluminum', () => {
  const records = DENSITY_CASE.samples.map((sample) => createMeasurement(sample));
  const slope = calculateMassVolumeSlope(records);

  assert.equal(slope, 2.7);
  assert.equal(identifyMaterial(slope, REFERENCE_MATERIALS)?.id, 'aluminum');
  assert.equal(identifyMaterial(5.4, REFERENCE_MATERIALS), null);
});
