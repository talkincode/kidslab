import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyChoice,
  createSite,
  leverPlan,
  pulleyPlan,
  rampPlan,
} from '../../src/mini-pyramid/pyramid-model.js';

test('a gentler ramp lowers the required force but makes the pull longer', () => {
  const steep = rampPlan({ load: 12, rise: 2, length: 3 });
  const gentle = rampPlan({ load: 12, rise: 2, length: 6 });

  assert.equal(steep.effort, 8);
  assert.equal(gentle.effort, 4);
  assert.equal(gentle.distance, 6);
  assert.equal(gentle.work, 24);
  assert.equal(gentle.effort * gentle.distance, gentle.work);
});

test('a failed ramp plan leaves the block at the start so the engineer can retry', () => {
  const site = createSite();
  const failed = applyChoice(site, { kind: 'ramp', length: 3 });

  assert.equal(failed.error, 'too-heavy');
  assert.equal(failed.site.mission, 0);
  assert.equal(failed.site.complete, false);

  const recovered = applyChoice(failed.site, { kind: 'ramp', length: 6 });
  assert.equal(recovered.error, null);
  assert.equal(recovered.site.mission, 1);
  assert.equal(recovered.site.complete, false);
});

test('moving a lever fulcrum farther from the load trades pulling distance for force', () => {
  const shortArm = leverPlan({ load: 10, loadArm: 1, effortArm: 1 });
  const longArm = leverPlan({ load: 10, loadArm: 1, effortArm: 3 });

  assert.equal(shortArm.effort, 10);
  assert.equal(longArm.effort, 10 / 3);
  assert.equal(longArm.effortDistance, 3);
  assert.equal(longArm.work, 10);
});

test('an invalid pulley cannot progress, while four supporting ropes finish the site', () => {
  const site = { ...createSite(), mission: 2, cleared: ['ramp', 'lever'] };
  const invalid = pulleyPlan({ load: 12, rise: 2, supports: 0 });
  assert.equal(invalid.error, 'invalid-pulley');

  const miss = applyChoice(site, { kind: 'pulley', supports: 2 });
  assert.equal(miss.error, 'too-heavy');
  assert.equal(miss.site.mission, 2);

  const won = applyChoice(miss.site, { kind: 'pulley', supports: 4 });
  assert.equal(won.error, null);
  assert.equal(won.site.mission, 3);
  assert.equal(won.site.complete, true);
  assert.deepEqual(won.site.cleared, ['ramp', 'lever', 'pulley']);
});
