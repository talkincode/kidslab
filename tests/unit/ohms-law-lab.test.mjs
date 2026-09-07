import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CORRECT_WIRING,
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

test('all offered U/R pairs obey Ohm law and inclusive range limits', () => {
  for (const voltageV of [1.5,3,4.5,6]) for (const resistanceOhm of [10,20]) {
    for (const ammeterRangeA of [.3,3]) for (const voltmeterRangeV of [3,15]) {
      const setup={voltageV,resistanceOhm,ammeterRangeA,voltmeterRangeV,wiring:CORRECT_WIRING};
      const result=measureCircuit(setup);
      const reason=voltageV>voltmeterRangeV?'voltmeter-overload':voltageV/resistanceOhm>ammeterRangeA?'ammeter-overload':null;
      assert.equal(result.ok,!reason);
      if(reason) assert.equal(result.reason,reason);
      else assert.equal(result.currentA,voltageV/resistanceOhm);
      assert.equal(measureCircuit({...setup,wiring:'ammeter-parallel'}).reason,'short-circuit');
      assert.equal(measureCircuit({...setup,wiring:'voltmeter-series'}).reason,'open-circuit');
    }
  }
});

test('continuous parameters support observation records and safe restoration', async () => {
  const {recordObservation,restoreObservations}=await import('../../src/ohms-law-lab/ohms-model.js');
  const setup={voltageV:3.6,resistanceOhm:30,ammeterRangeA:3,voltmeterRangeV:15,wiring:CORRECT_WIRING};
  assert.equal(measureCircuit(setup).currentA,.12);
  const result=recordObservation([],setup);
  assert.equal(result.ok,true);
  assert.equal(recordObservation(result.trials,setup).reason,'already-recorded');
  assert.deepEqual(restoreObservations({trials:[...result.trials,{voltageV:6,resistanceOhm:0,currentA:Infinity}]}),result.trials);
  assert.equal(measureCircuit({...setup,voltageV:0}).currentA,0);
  assert.equal(measureCircuit({...setup,resistanceOhm:0}).reason,'invalid-setup');
});
