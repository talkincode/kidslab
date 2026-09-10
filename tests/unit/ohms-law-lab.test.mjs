import assert from 'node:assert/strict';
import test from 'node:test';

import {
  AMMETER_RANGES_A,
  CORRECT_WIRING,
  DEFAULT_SETUP,
  RESISTANCE_MAX_OHM,
  RESISTANCE_MIN_OHM,
  VOLTAGE_MAX_V,
  VOLTAGE_MIN_V,
  VOLTMETER_RANGES_V,
  currentFromOhmLaw,
  deriveExperiment,
  graphPoint,
  measureCircuit,
  recordObservation,
  restoreExperiment,
  restoreObservations,
} from '../../src/ohms-law-lab/ohms-model.js';

const live = (overrides = {}) => ({
  ...DEFAULT_SETUP,
  ammeterRangeA: 3,
  voltmeterRangeV: 15,
  wiring: CORRECT_WIRING,
  ...overrides,
});

test('Ohm identity: I = U / R in SI units for ohmic resistors', () => {
  assert.equal(currentFromOhmLaw(1.5, 10), 0.15);
  assert.equal(currentFromOhmLaw(3, 10), 0.3);
  assert.equal(currentFromOhmLaw(6, 20), 0.3);
  assert.equal(currentFromOhmLaw(3.6, 30), 0.12);

  const low = measureCircuit(live({ voltageV: 1.5, resistanceOhm: 10 }));
  const high = measureCircuit(live({ voltageV: 3, resistanceOhm: 10 }));
  assert.deepEqual(low, { ok: true, voltageV: 1.5, currentA: 0.15, resistanceOhm: 10 });
  assert.deepEqual(high, { ok: true, voltageV: 3, currentA: 0.3, resistanceOhm: 10 });
  assert.equal(high.currentA / low.currentA, high.voltageV / low.voltageV);
});

test('zero voltage is a legal idle circuit with zero current', () => {
  const reading = measureCircuit(live({ voltageV: 0, resistanceOhm: 10 }));
  assert.equal(reading.ok, true);
  assert.equal(reading.currentA, 0);
  assert.equal(reading.voltageV, VOLTAGE_MIN_V);
});

test('inclusive extremes still obey Ohm’s law when meters can take the load', () => {
  const maxSafe = measureCircuit(live({
    voltageV: VOLTAGE_MAX_V,
    resistanceOhm: RESISTANCE_MIN_OHM,
    ammeterRangeA: 3,
    voltmeterRangeV: 15,
  }));
  assert.equal(maxSafe.ok, true);
  assert.equal(maxSafe.currentA, 1.2);

  const minR = measureCircuit(live({ voltageV: 1.5, resistanceOhm: RESISTANCE_MIN_OHM }));
  assert.equal(minR.ok, true);
  assert.equal(minR.currentA, 0.3);

  const maxR = measureCircuit(live({ voltageV: VOLTAGE_MAX_V, resistanceOhm: RESISTANCE_MAX_OHM }));
  assert.equal(maxR.ok, true);
  assert.equal(maxR.currentA, 0.12);
});

test('illegal inputs are rejected without inventing a current', () => {
  for (const setup of [
    live({ voltageV: -0.1 }),
    live({ voltageV: 6.1 }),
    live({ voltageV: Number.NaN }),
    live({ resistanceOhm: 0 }),
    live({ resistanceOhm: 4 }),
    live({ resistanceOhm: 51 }),
    live({ resistanceOhm: Number.POSITIVE_INFINITY }),
    live({ ammeterRangeA: 1 }),
    live({ voltmeterRangeV: 10 }),
    { voltageV: 3, resistanceOhm: 10 },
  ]) {
    const reading = measureCircuit(setup);
    assert.equal(reading.ok, false);
    assert.equal(reading.reason, 'invalid-setup');
    assert.equal(reading.currentA, undefined);
  }

  assert.equal(measureCircuit(live({ wiring: 'ammeter-parallel' })).reason, 'short-circuit');
  assert.equal(measureCircuit(live({ wiring: 'voltmeter-series' })).reason, 'open-circuit');
  assert.equal(measureCircuit(live({ wiring: 'mystery' })).reason, 'invalid-wiring');
});

test('meter overrange opens protection and does not record', () => {
  const overload = measureCircuit(live({
    voltageV: 4.5,
    resistanceOhm: 10,
    ammeterRangeA: 0.3,
    voltmeterRangeV: 15,
  }));
  assert.equal(overload.ok, false);
  assert.equal(overload.reason, 'ammeter-overload');

  const voltOver = measureCircuit(live({
    voltageV: 4.5,
    resistanceOhm: 20,
    ammeterRangeA: 3,
    voltmeterRangeV: 3,
  }));
  assert.equal(voltOver.reason, 'voltmeter-overload');

  const blocked = recordObservation([], live({
    voltageV: 4.5,
    resistanceOhm: 10,
    ammeterRangeA: 0.3,
  }));
  assert.equal(blocked.ok, false);
  assert.equal(blocked.reason, 'ammeter-overload');
  assert.deepEqual(blocked.trials, []);
});

test('widening the ammeter range recovers a previously protected circuit', () => {
  const tight = live({ voltageV: 4.5, resistanceOhm: 10, ammeterRangeA: 0.3 });
  assert.equal(deriveExperiment(tight, []).status, 'ammeter-overload');

  const recovered = deriveExperiment({ ...tight, ammeterRangeA: 3 }, []);
  assert.equal(recovered.status, 'live');
  assert.equal(recovered.measurement.ok, true);
  assert.equal(recovered.measurement.currentA, 0.45);
  assert.equal(recovered.theoreticalCurrentA, 0.45);
});

test('observation records keep history across a failed attempt', () => {
  const first = recordObservation([], live({ voltageV: 3.6, resistanceOhm: 30 }));
  assert.equal(first.ok, true);
  assert.equal(first.trials.length, 1);
  assert.equal(first.trials[0].currentA, 0.12);

  const duplicate = recordObservation(first.trials, live({ voltageV: 3.6, resistanceOhm: 30 }));
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.reason, 'already-recorded');
  assert.deepEqual(duplicate.trials, first.trials);

  const failed = recordObservation(first.trials, live({
    voltageV: 6,
    resistanceOhm: 5,
    ammeterRangeA: 0.3,
  }));
  assert.equal(failed.ok, false);
  assert.equal(failed.reason, 'ammeter-overload');
  assert.deepEqual(failed.trials, first.trials);

  const second = recordObservation(first.trials, live({ voltageV: 3.6, resistanceOhm: 15 }));
  assert.equal(second.ok, true);
  assert.equal(second.trials.length, 2);
  assert.equal(second.trials[1].currentA, 0.24);
});

test('restore drops illegal rows and migrates a shorted save back to working wiring', () => {
  const saved = {
    version: 2,
    setup: {
      voltageV: 2.9,
      resistanceOhm: 36,
      ammeterRangeA: 3,
      voltmeterRangeV: 15,
      wiring: 'ammeter-parallel',
    },
    trials: [
      { voltageV: 1.5, resistanceOhm: 10, currentA: 0.15 },
      { voltageV: 6, resistanceOhm: 0, currentA: Number.POSITIVE_INFINITY },
      { voltageV: 3, resistanceOhm: 10, currentA: 0.99 },
    ],
  };

  const history = restoreObservations(saved);
  assert.deepEqual(history, [{ voltageV: 1.5, resistanceOhm: 10, currentA: 0.15 }]);

  const restored = restoreExperiment(saved);
  assert.equal(restored.setup.wiring, CORRECT_WIRING);
  assert.equal(restored.setup.voltageV, 2.9);
  assert.equal(restored.setup.resistanceOhm, 36);
  assert.deepEqual(restored.history, history);
  assert.equal(measureCircuit(restored.setup).ok, true);
});

test('corrupt storage falls back to a safe default bench', () => {
  assert.deepEqual(restoreExperiment(null).setup, { ...DEFAULT_SETUP });
  assert.deepEqual(restoreExperiment({ version: 9, trials: 'nope' }).history, []);
  assert.equal(restoreExperiment({ setup: { voltageV: -3, resistanceOhm: 10 } }).setup.voltageV, DEFAULT_SETUP.voltageV);
});

test('U-I graph maps voltage to x and current to y with a fixed lab scale', () => {
  const origin = graphPoint(0, 0);
  const top = graphPoint(6, 1.2);
  const sample = graphPoint(2.9, 0.08055555555555556);
  assert.deepEqual(origin, { x: 38, y: 156 });
  assert.deepEqual(top, { x: 302, y: 18 });
  assert.equal(sample.x, 38 + (2.9 / 6) * 264);
});

test('offered meter ranges are the only legal instrument scales', () => {
  assert.deepEqual(AMMETER_RANGES_A, [0.3, 3]);
  assert.deepEqual(VOLTMETER_RANGES_V, [3, 15]);
});
