import assert from 'node:assert/strict';
import test from 'node:test';

import {
  answerJob,
  atlasComplete,
  campComplete,
  carePlotA,
  createGarden,
  floodSeed,
  guessCause,
  plant,
  revealOrgan,
  seedLook,
  setStressB,
  waitCompare,
  waitGerminate,
  waterSeed,
} from '../../src/plant-xray/plant-model.js';

function sprouted(garden = createGarden()) {
  return waitGerminate(waitGerminate(waterSeed(plant(garden))));
}

test('the radicle grows down only after planting and a sip of water', () => {
  const dryWait = waitGerminate(plant(createGarden()));
  assert.equal(dryWait.error, 'thirsty');
  assert.equal(dryWait.radicle, false);

  const noPlant = waterSeed(createGarden());
  assert.equal(noPlant.error, 'not-planted');

  const firstDay = waitGerminate(waterSeed(plant(createGarden())));
  assert.equal(firstDay.error, null);
  assert.equal(firstDay.radicle, true);
  assert.equal(firstDay.shoot, false);
  assert.equal(seedLook(firstDay), 'radicle');
});

test('the shoot comes after the radicle, completing germination', () => {
  const grown = sprouted();
  assert.equal(grown.shoot, true);
  assert.equal(seedLook(grown), 'sprout');
  assert.equal(campComplete(grown, 0), true);
  assert.equal(waitGerminate(grown).error, 'already-sprouted');
});

test('flooding then waiting rots the seed and is recoverable by replanting', () => {
  const soaked = floodSeed(plant(createGarden()));
  assert.equal(soaked.moisture, 2);
  const dead = waitGerminate(soaked);
  assert.equal(dead.error, 'rotted');
  assert.equal(dead.rotten, true);
  assert.equal(seedLook(dead), 'rotten');
  assert.equal(campComplete(dead, 0), false);

  const again = plant(dead);
  assert.equal(again.rotten, false);
  assert.equal(again.planted, true);
  assert.equal(again.moisture, 0);
});

test('a fair comparison needs a cared A plot, one B stress, then waiting', () => {
  const early = waitCompare(createGarden());
  assert.equal(early.error, 'a-not-cared');

  const half = waitCompare(carePlotA(createGarden()));
  assert.equal(half.error, 'b-no-stress');

  const ready = waitCompare(setStressB(carePlotA(createGarden()), 'dry'));
  assert.equal(ready.error, null);
  assert.equal(ready.plotA.look, 'healthy');
  assert.equal(ready.plotB.look, 'wilted');
  assert.equal(ready.waitedCompare, true);
});

test('dark and flood stresses make different looks, and only the matching cause completes camp 1', () => {
  const dark = waitCompare(setStressB(carePlotA(createGarden()), 'dark'));
  assert.equal(dark.plotB.look, 'leggy');
  assert.equal(guessCause(dark, 'dry').error, 'wrong-cause');
  assert.equal(guessCause(dark, 'dark').cause, 'dark');
  assert.equal(campComplete(guessCause(dark, 'dark'), 1), true);

  const wet = waitCompare(setStressB(carePlotA(createGarden()), 'flood'));
  assert.equal(wet.plotB.look, 'soggy');
  assert.equal(guessCause(createGarden(), 'dry').error, 'no-compare');
  assert.equal(campComplete(guessCause(wet, 'flood'), 1), true);
});

test('the atlas must be complete before the root-drinks job can finish the garden', () => {
  let garden = createGarden();
  assert.equal(answerJob(garden, 'root').error, 'atlas-incomplete');

  for (const organ of ['root', 'stem', 'leaf', 'flower']) {
    garden = revealOrgan(garden, organ);
  }
  assert.equal(atlasComplete(garden), false);
  garden = revealOrgan(garden, 'fruit');
  assert.equal(atlasComplete(garden), true);
  assert.equal(revealOrgan(garden, 'root').error, 'dup-organ');

  const miss = answerJob(garden, 'leaf');
  assert.equal(miss.error, 'wrong-job');
  assert.equal(campComplete(miss, 2), false);

  const done = answerJob(garden, 'root');
  assert.equal(done.jobAnswer, 'root');
  assert.equal(campComplete(done, 2), true);
});
