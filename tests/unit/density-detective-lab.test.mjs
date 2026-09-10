import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DENSITY_CASE,
  REFERENCE_MATERIALS,
  calculateDensity,
  calculateMassVolumeSlope,
  createLab,
  createMeasurement,
  getSpecimen,
  identifyMaterial,
  liveReadings,
  logLiveTrial,
  resetLab,
  selectSpecimen,
  submergeSpecimen,
  weighSpecimen,
} from '../../src/density-detective-lab/density-model.js';

test('density identity ρ = m / V holds for every golden specimen', () => {
  for (const sample of DENSITY_CASE.samples) {
    assert.equal(calculateDensity(sample.massG, sample.volumeCm3), 2.7);
    assert.equal(createMeasurement(sample).densityGPerCm3, 2.7);
    assert.equal(createMeasurement(sample).displacedVolumeMl, sample.volumeCm3);
  }
  assert.equal(calculateDensity(27, 10), 2.7);
  assert.equal(calculateDensity(54, 20), 2.7);
  assert.equal(calculateDensity(81, 30), 2.7);
});

test('displacement volume equals the rise in the cylinder and 1 mL = 1 cm³', () => {
  const measurement = createMeasurement(getSpecimen('specimen-b'), 40);
  assert.equal(measurement.initialWaterMl, 40);
  assert.equal(measurement.finalWaterMl, 60);
  assert.equal(measurement.displacedVolumeMl, 20);
  assert.equal(measurement.volumeCm3, 20);
});

test('density calculation rejects empty, zero, negative, and non-finite volume', () => {
  assert.equal(calculateDensity(10, 0), null);
  assert.equal(calculateDensity(10, -4), null);
  assert.equal(calculateDensity(-1, 10), null);
  assert.equal(calculateDensity(Number.NaN, 10), null);
  assert.equal(calculateDensity(10, Number.POSITIVE_INFINITY), null);
  assert.equal(calculateDensity(0, 10), 0);
});

test('weighing then submerging exposes live instrument readings without typed answers', () => {
  let lab = createLab();
  lab = weighSpecimen(lab).lab;
  assert.equal(liveReadings(lab).massG, 27);
  assert.equal(liveReadings(lab).volumeCm3, null);

  lab = submergeSpecimen(lab).lab;
  const live = liveReadings(lab);
  assert.equal(live.massG, 27);
  assert.equal(live.initialWaterMl, 40);
  assert.equal(live.finalWaterMl, 50);
  assert.equal(live.volumeCm3, 10);
});

test('illegal actions are rejected and leave the lab unchanged', () => {
  const lab = createLab();
  const unknown = selectSpecimen(lab, 'specimen-z');
  assert.equal(unknown.ok, false);
  assert.equal(unknown.reason, 'unknown-specimen');
  assert.equal(unknown.lab.selectedSpecimenId, 'specimen-a');

  const dunkFirst = submergeSpecimen(lab);
  assert.equal(dunkFirst.ok, false);
  assert.equal(dunkFirst.reason, 'weigh-first');
  assert.equal(dunkFirst.lab.observation.submerged, false);

  const tooSoon = logLiveTrial(lab);
  assert.equal(tooSoon.ok, false);
  assert.equal(tooSoon.reason, 'need-both-readings');
  assert.equal(tooSoon.lab.records.length, 0);
});

test('a failed dunk can be recovered by weighing, then logging the live trial', () => {
  let lab = createLab();
  lab = submergeSpecimen(lab).lab;
  assert.equal(lab.records.length, 0);

  lab = weighSpecimen(lab).lab;
  lab = submergeSpecimen(lab).lab;
  const logged = logLiveTrial(lab);
  assert.equal(logged.ok, true);
  assert.equal(logged.lab.records.length, 1);
  assert.equal(logged.lab.records[0].densityGPerCm3, 2.7);
  assert.equal(logged.lab.complete, false);
});

test('three live trials lock aluminum from the mass–volume slope, not a quiz guess', () => {
  let lab = createLab();
  for (const sample of DENSITY_CASE.samples) {
    lab = selectSpecimen(lab, sample.id).lab;
    lab = weighSpecimen(lab).lab;
    lab = submergeSpecimen(lab).lab;
    lab = logLiveTrial(lab).lab;
  }

  assert.equal(lab.records.length, 3);
  assert.equal(calculateMassVolumeSlope(lab.records), 2.7);
  assert.equal(identifyMaterial(calculateMassVolumeSlope(lab.records), REFERENCE_MATERIALS)?.id, 'aluminum');
  assert.equal(lab.identifiedMaterialId, 'aluminum');
  assert.equal(lab.complete, true);

  const duplicate = logLiveTrial(selectSpecimen(lab, 'specimen-a').lab);
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.reason, 'already-recorded');
  assert.equal(duplicate.lab.records.length, 3);
  assert.equal(duplicate.lab.complete, true);
});

test('reset clears records so the bench can be used again', () => {
  let lab = createLab();
  lab = weighSpecimen(lab).lab;
  lab = submergeSpecimen(lab).lab;
  lab = logLiveTrial(lab).lab;
  lab = resetLab();
  assert.equal(lab.records.length, 0);
  assert.equal(lab.complete, false);
  assert.equal(lab.identifiedMaterialId, null);
  assert.equal(lab.selectedSpecimenId, 'specimen-a');
});
