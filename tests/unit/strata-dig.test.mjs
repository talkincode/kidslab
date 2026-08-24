import assert from 'node:assert/strict';
import test from 'node:test';

import {
  bonesComplete,
  brush,
  campComplete,
  collect,
  confirmFault,
  createSite,
  currentDepth,
  faultComplete,
  hammer,
  pickOlder,
  placeBone,
  selectFault,
} from '../../src/strata-dig/dig-model.js';

function dugSite() {
  let site = createSite();
  site = collect(brush(site));
  site = collect(hammer(site));
  site = collect(hammer(site));
  site = collect(hammer(site));
  return site;
}

function assembledSite() {
  let site = dugSite();
  for (const id of ['skull', 'ribs', 'hips', 'legs', 'tail']) {
    site = placeBone(site, id, id);
  }
  return site;
}

test('brushing topsoil exposes the modern toy and collecting it goes deeper', () => {
  const buried = collect(createSite());
  assert.equal(buried.error, 'still-buried');
  assert.equal(buried.tray.length, 0);

  const exposed = brush(createSite());
  assert.equal(exposed.error, null);
  assert.equal(exposed.layers[0].exposed, true);
  assert.equal(currentDepth(exposed), 0);

  const taken = collect(exposed);
  assert.equal(taken.error, null);
  assert.deepEqual(taken.tray, ['surface']);
  assert.equal(currentDepth(taken), 1);
});

test('a hard ice layer needs a hammer, and pottery cracks if smashed first', () => {
  const pottery = collect(brush(createSite()));
  const cracked = hammer(pottery);
  assert.equal(cracked.error, 'cracked');
  assert.equal(cracked.layers[1].cracked, true);
  assert.equal(cracked.layers[1].exposed, true);

  const ice = collect(cracked);
  const brushedHard = brush(ice);
  assert.equal(brushedHard.error, 'need-hammer');
  assert.equal(brushedHard.layers[2].exposed, false);

  const opened = hammer(ice);
  assert.equal(opened.error, null);
  assert.equal(opened.layers[2].exposed, true);
  assert.equal(collect(opened).tray.at(-1), 'ice');
});

test('four finds complete the dig camp and deeper layers come later', () => {
  const site = dugSite();
  assert.deepEqual(site.tray, ['surface', 'pottery', 'ice', 'dino']);
  assert.equal(campComplete(site, 0), true);
  assert.equal(site.layers[0].id, 'surface');
  assert.equal(site.layers[3].id, 'dino');
});

test('wrong bone slots bounce back and the last piece wakes the fossil', () => {
  let site = dugSite();
  const miss = placeBone(site, 'skull', 'tail');
  assert.equal(miss.error, 'wrong-slot');
  assert.equal(miss.bones.skull, undefined);
  assert.equal(miss.awoken, false);

  site = assembledSite();
  assert.equal(bonesComplete(site), true);
  assert.equal(site.awoken, true);
  assert.equal(campComplete(site, 1), true);
});

test('fault matching needs the same-age beds, then the deeper dinosaur is older', () => {
  let site = assembledSite();
  site = selectFault(site, 'left', 'pottery');
  site = selectFault(site, 'right', 'dino');
  const miss = confirmFault(site);
  assert.equal(miss.error, 'wrong-pair');
  assert.equal(miss.fault.matched.length, 0);

  site = confirmFault(selectFault(selectFault(assembledSite(), 'left', 'pottery'), 'right', 'pottery'));
  site = confirmFault(selectFault(selectFault(site, 'left', 'ash'), 'right', 'ash'));
  site = confirmFault(selectFault(selectFault(site, 'left', 'tusk'), 'right', 'tusk'));
  assert.deepEqual(site.fault.matched, ['pottery', 'ash', 'tusk']);

  const young = pickOlder(site, 'pottery');
  assert.equal(young.error, 'wrong-older');
  assert.equal(faultComplete(young), false);

  const old = pickOlder(site, 'dino');
  assert.equal(old.error, null);
  assert.equal(campComplete(old, 2), true);
});
