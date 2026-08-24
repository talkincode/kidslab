import assert from 'node:assert/strict';
import test from 'node:test';

import {
  addLayer,
  campComplete,
  canPour,
  createBucket,
  heat,
  isClear,
  isDrinkable,
  isFresh,
  pourFilter,
  scoopLeaves,
  setCollector,
  settle,
  shake,
  taste,
  waterLook,
} from '../../src/island-water/water-model.js';

function layered(bucket = createBucket()) {
  return addLayer(addLayer(addLayer(bucket, 'gravel'), 'sand'), 'charcoal');
}

test('settling drops turbidity but leaves salt unchanged', () => {
  const start = createBucket();
  const next = settle(start);

  assert.equal(start.turbidity, 92);
  assert.equal(start.salinity, 78);
  assert.equal(next.settled, true);
  assert.ok(next.turbidity < start.turbidity);
  assert.equal(next.salinity, start.salinity);
  assert.equal(isClear(next), false);
  assert.equal(waterLook(next), 'settled');
});

test('leaves can be scooped only after settling', () => {
  const muddy = scoopLeaves(createBucket());
  assert.equal(muddy.error, 'not-settled');
  assert.equal(muddy.leaves, true);

  const ready = scoopLeaves(settle(createBucket()));
  assert.equal(ready.error, null);
  assert.equal(ready.leaves, false);
  assert.equal(campComplete(ready, 0), true);
});

test('a complete sand-charcoal filter clears water but cannot remove dissolved salt', () => {
  const unfinished = pourFilter(addLayer(createBucket(), 'sand'));
  assert.equal(unfinished.error, 'incomplete-filter');
  assert.equal(unfinished.filtered, false);
  assert.equal(canPour(unfinished), false);

  const filtered = pourFilter(layered());
  assert.equal(filtered.error, null);
  assert.equal(filtered.filtered, true);
  assert.equal(isClear(filtered), true);
  assert.equal(isFresh(filtered), false);
  assert.equal(filtered.salinity, 78);
  assert.equal(waterLook(filtered), 'clear');
});

test('tasting clear salty water is the dissolved-salt discovery, not a drinkable finish', () => {
  const sip = taste(pourFilter(layered()));
  assert.equal(sip.sip, 'salty');
  assert.equal(sip.tastedSalty, true);
  assert.equal(isDrinkable(sip), false);
  assert.equal(campComplete(sip, 1), true);
});

test('distillation needs a condenser and then makes drinkable fresh water', () => {
  const lost = heat(pourFilter(layered()));
  assert.equal(lost.error, 'no-collector');
  assert.equal(lost.distilled, false);
  assert.equal(lost.salinity, 78);

  const fresh = heat(setCollector(pourFilter(layered()), true));
  assert.equal(fresh.error, null);
  assert.equal(fresh.distilled, true);
  assert.equal(isFresh(fresh), true);
  assert.equal(isDrinkable(fresh), true);
  assert.equal(taste(fresh).sip, 'fresh');
  assert.equal(campComplete(taste(fresh), 2), true);
});

test('shaking remuddies an unfiltered bucket and tasting mud is recoverable', () => {
  const shaken = shake(settle(createBucket()));
  assert.equal(shaken.settled, false);
  assert.equal(shaken.leaves, true);
  assert.ok(shaken.turbidity >= 88);
  assert.equal(taste(shaken).sip, 'muddy');

  const locked = shake(pourFilter(layered()));
  assert.equal(locked.error, 'already-processed');
});
