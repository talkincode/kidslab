import assert from 'node:assert/strict';
import test from 'node:test';

import {
  choosePart,
  createWorkshop,
  evaluate,
  habitatOf,
  isDesignComplete,
  release,
  restoreWorkshop,
  selectCamp,
  setPart,
} from '../../src/creature-workshop/creature-model.js';

function dress(design, ears, coat, feet, extra) {
  return setPart(setPart(setPart(setPart(design, 'ears', ears), 'coat', coat), 'feet', feet), 'extra', extra);
}

function desertKit() {
  return dress({}, 'big', 'thin', 'pads', 'hump');
}

function arcticKit() {
  return dress({}, 'small', 'thick', 'snow', 'blubber');
}

function wetlandKit() {
  return dress({}, 'hidden', 'oily', 'web', 'tongue');
}

test('a desert kit survives the desert and names the fennec as prototype', () => {
  const result = evaluate('desert', desertKit());
  assert.equal(result.error, null);
  assert.equal(result.survived, true);
  assert.equal(result.perfect, true);
  assert.equal(result.prototype, 'fennec');
  assert.equal(result.score, 4);
});

test('the same desert kit fails in a blizzard and points at mismatched parts', () => {
  const result = evaluate('arctic', desertKit());
  assert.equal(result.survived, false);
  assert.ok(result.misses.length >= 3);
  assert.equal(result.failSlot, 'ears');
  assert.equal(result.prototype, null);
});

test('webbed feet that save a wetland creature become a liability in sand', () => {
  const mixed = dress({}, 'big', 'thin', 'web', 'hump');
  const desert = evaluate('desert', mixed);
  assert.equal(desert.survived, true);
  assert.deepEqual(desert.misses.map((item) => item.slot), ['feet']);

  const wetland = evaluate('wetland', mixed);
  assert.equal(wetland.survived, false);
  assert.ok(wetland.misses.some((item) => item.slot === 'ears'));
  assert.ok(wetland.misses.some((item) => item.slot === 'coat'));
});

test('three matching parts are enough to live 48 hours; two are not', () => {
  const almost = dress({}, 'big', 'thin', 'pads', 'tongue');
  assert.equal(evaluate('desert', almost).survived, true);
  assert.equal(evaluate('desert', almost).perfect, false);

  const weak = dress({}, 'big', 'thin', 'web', 'tongue');
  assert.equal(evaluate('desert', weak).survived, false);
  assert.equal(evaluate('desert', weak).score, 2);
});

test('release refuses an incomplete chimera and keeps the camp locked', () => {
  let shop = createWorkshop();
  shop = choosePart(shop, 'ears', 'big');
  const stuck = release(shop);
  assert.equal(isDesignComplete(stuck.design), false);
  assert.equal(stuck.lastRun.error, 'incomplete');
  assert.deepEqual(stuck.completed, []);
  assert.equal(stuck.unlocked, 0);
});

test('surviving desert unlocks the arctic; surviving all three finishes the hall', () => {
  let shop = createWorkshop();
  shop.design = desertKit();
  shop = release(shop);
  assert.deepEqual(shop.completed, [0]);
  assert.equal(shop.unlocked, 1);
  assert.equal(shop.hall[0].prototype, 'fennec');

  shop = selectCamp(shop, 1);
  shop.design = arcticKit();
  shop = release(shop);
  assert.deepEqual(shop.completed, [0, 1]);
  assert.equal(shop.unlocked, 2);

  shop = selectCamp(shop, 2);
  shop.design = wetlandKit();
  shop = release(shop);
  assert.equal(shop.finished, true);
  assert.equal(shop.hall.length, 3);
  assert.equal(shop.hall[2].prototype, 'platypus');
});

test('restoreWorkshop rebuilds progress and ignores unknown parts', () => {
  const saved = restoreWorkshop({
    camp: 1,
    unlocked: 1,
    completed: [0],
    finished: false,
    design: { ears: 'small', coat: 'thick', feet: 'laser', extra: 'blubber' },
    hall: [{ habitat: 'desert', design: { ears: 'big', coat: 'thin', feet: 'pads', extra: 'hump' }, perfect: true }],
  });
  assert.equal(saved.camp, 1);
  assert.equal(saved.design.feet, null);
  assert.equal(saved.design.ears, 'small');
  assert.equal(saved.hall[0].prototype, 'fennec');
  assert.equal(habitatOf(saved.camp), 'arctic');
});
