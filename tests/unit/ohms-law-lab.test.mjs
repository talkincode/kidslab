import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createLab,
  measureCircuit,
  recordTrial,
  setConclusion,
  setPrediction,
  testDesign,
} from '../../src/ohms-law-lab/ohms-model.js';

test('a 10 Ω resistor gives proportional U-I readings in SI units', () => {
  const low = measureCircuit({
    voltageV: 1.5,
    resistanceOhm: 10,
    ammeterRangeA: 0.3,
    voltmeterRangeV: 3,
    wiring: 'series-parallel',
  });
  const high = measureCircuit({
    voltageV: 3,
    resistanceOhm: 10,
    ammeterRangeA: 0.3,
    voltmeterRangeV: 3,
    wiring: 'series-parallel',
  });

  assert.deepEqual(low, { ok: true, voltageV: 1.5, currentA: 0.15, resistanceOhm: 10 });
  assert.deepEqual(high, { ok: true, voltageV: 3, currentA: 0.3, resistanceOhm: 10 });
});

test('a wrong meter connection or selected range is rejected without recording a trial', () => {
  const lab = createLab();
  const shortCircuit = recordTrial(lab, {
    voltageV: 3,
    resistanceOhm: 10,
    ammeterRangeA: 0.3,
    voltmeterRangeV: 3,
    wiring: 'ammeter-parallel',
  });
  assert.equal(shortCircuit.reason, 'short-circuit');
  assert.equal(shortCircuit.lab.trials.length, 0);

  const overload = recordTrial(lab, {
    voltageV: 4.5,
    resistanceOhm: 10,
    ammeterRangeA: 0.3,
    voltmeterRangeV: 15,
    wiring: 'series-parallel',
  });
  assert.equal(overload.reason, 'ammeter-overload');
  assert.equal(overload.lab.trials.length, 0);
});

test('a student can recover from a wrong conclusion and finish the controlled comparison', () => {
  let lab = createLab();
  lab = setPrediction(lab, 'current-rises').lab;
  for (const setup of [
    { voltageV: 1.5, resistanceOhm: 10, ammeterRangeA: 0.3, voltmeterRangeV: 3 },
    { voltageV: 3, resistanceOhm: 10, ammeterRangeA: 0.3, voltmeterRangeV: 3 },
    { voltageV: 3, resistanceOhm: 20, ammeterRangeA: 0.3, voltmeterRangeV: 3 },
    { voltageV: 6, resistanceOhm: 20, ammeterRangeA: 3, voltmeterRangeV: 15 },
  ]) {
    const result = recordTrial(lab, { ...setup, wiring: 'series-parallel' });
    assert.equal(result.ok, true);
    lab = result.lab;
  }

  const wrong = setConclusion(lab, 'same-slope');
  assert.equal(wrong.reason, 'wrong-conclusion');
  assert.equal(wrong.lab.trials.length, 4);

  const right = setConclusion(wrong.lab, 'higher-resistance-lower-slope');
  assert.equal(right.ok, true);
  const design = testDesign(right.lab, {
    voltageV: 6,
    resistanceOhm: 20,
    ammeterRangeA: 3,
    voltmeterRangeV: 15,
    wiring: 'series-parallel',
  });
  assert.equal(design.ok, true);
  assert.equal(design.lab.phase, 'complete');
});
