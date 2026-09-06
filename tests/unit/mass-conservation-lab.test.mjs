import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createLab,
  recordTrial,
  runReaction,
  setConclusion,
  setPrediction,
} from '../../src/mass-conservation-lab/mass-model.js';

test('a sealed reaction keeps all reactants and carbon dioxide on the balance', () => {
  const trial = runReaction({ vessel: 'sealed' });

  assert.deepEqual(trial, {
    ok: true,
    vessel: 'sealed',
    massBeforeG: 100,
    massAfterG: 100,
    escapedGasG: 0,
    totalSystemMassG: 100,
  });
});

test('an open reaction shows escaped gas while the full system mass is conserved', () => {
  const trial = runReaction({ vessel: 'open' });

  assert.equal(trial.ok, true);
  assert.equal(trial.massBeforeG, 100);
  assert.equal(trial.massAfterG, 96);
  assert.equal(trial.escapedGasG, 4);
  assert.equal(trial.totalSystemMassG, 100);
});

test('a student can recover from a wrong conclusion after comparing open and sealed systems', () => {
  let lab = createLab();
  lab = setPrediction(lab, 'mass-disappears').lab;

  lab = recordTrial(lab, 'open').lab;
  lab = recordTrial(lab, 'sealed').lab;

  const wrong = setConclusion(lab, 'mass-lost');
  assert.equal(wrong.ok, false);
  assert.equal(wrong.reason, 'wrong-conclusion');
  assert.equal(wrong.lab.trials.length, 2);

  const right = setConclusion(wrong.lab, 'mass-conserved');
  assert.equal(right.ok, true);
  assert.equal(right.lab.phase, 'complete');
});

test('invalid vessels cannot create a trial or change the saved experiment', () => {
  const lab = createLab();
  const result = recordTrial(lab, 'leaking');

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'invalid-vessel');
  assert.equal(result.lab.trials.length, 0);
});
