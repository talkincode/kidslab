import assert from 'node:assert/strict';
import test from 'node:test';

import {
  emptyState,
  inBand,
  MISSIONS,
  missionStart,
  progress,
  snapshot,
  step,
} from '../../src/eco-island/eco-model.js';

/* 跑仿真直到通关或到最大帧数，返回是否通关 */
function play(mission, actions = {}) {
  const s = missionStart(mission);
  for (const [key, value] of Object.entries(actions)) s[key] = value;
  let p = { done: false };
  for (let i = 0; i < 3000; i += 1) {
    p = progress(step(s), mission);
    if (p.done) break;
  }
  return { p, s };
}

test('empty island stays barren without a producer', () => {
  const s = emptyState();
  for (let i = 0; i < 500; i += 1) step(s);
  const snap = snapshot(s);
  assert.equal(snap.grass, 0);
  assert.equal(snap.rabbit, 0);
  assert.equal(play(MISSIONS[0]).p.done, false);
});

test('mission 1 needs a producer — grass alone revives rabbits, rabbits alone starve', () => {
  assert.equal(play(MISSIONS[0], { rabbit: 30 }).p.done, false, 'rabbits without grass starve');
  const won = play(MISSIONS[0], { grass: 20 });
  assert.equal(won.p.done, true, 'planting grass lets the island bloom');
  assert.ok(inBand(won.s.grass, MISSIONS[0].goal.grass));
  assert.ok(inBand(won.s.rabbit, MISSIONS[0].goal.rabbit));
});

test('mission 2 needs a decomposer — bodies stack up and the soil stays poor without one', () => {
  assert.equal(play(MISSIONS[1]).p.done, false, 'no decomposer means carcasses pile up');
  assert.equal(play(MISSIONS[1], { mushroom: 4 }).p.done, true, 'mushrooms decompose carcasses');
  assert.equal(play(MISSIONS[1], { worm: 4 }).p.done, true, 'earthworms also decompose carcasses');
});

test('mission 3 needs a consumer to rein in rabbits', () => {
  assert.equal(play(MISSIONS[2]).p.done, false, 'rabbit boom without a fox eats the grass bare');
  const won = play(MISSIONS[2], { fox: 2 });
  assert.equal(won.p.done, true, 'a fox brings rabbits back into the target band');
  assert.ok(inBand(won.s.rabbit, MISSIONS[2].goal.rabbit));
});

test('mission 4 needs the full web — missing any role never reaches stability', () => {
  assert.equal(play(MISSIONS[3]).p.done, false, 'barren with nothing added');
  assert.equal(
    play(MISSIONS[3], { grass: 20, rabbit: 5, mushroom: 4, worm: 4 }).p.done,
    false,
    'without a fox the web stays unbalanced',
  );
  const won = play(MISSIONS[3], { grass: 20, rabbit: 5, fox: 2, mushroom: 4, worm: 4 });
  assert.equal(won.p.done, true, 'producer + consumer + decomposer makes the whole island thrive');
  assert.ok(inBand(won.s.grass, MISSIONS[3].goal.grass));
  assert.ok(inBand(won.s.rabbit, MISSIONS[3].goal.rabbit));
  assert.ok(inBand(won.s.fox, MISSIONS[3].goal.fox));
  assert.ok(inBand(won.s.carcasses, MISSIONS[3].goal.carcasses));
});

test('progress counts consecutive in-band frames and resets on a miss', () => {
  const s = missionStart(MISSIONS[0]);
  s.grass = 150; s.rabbit = 30;
  const p1 = progress(s, MISSIONS[0]);
  assert.equal(p1.ok, true);
  assert.equal(p1.stable, 1);
  assert.equal(p1.pct, Math.round((1 / MISSIONS[0].needed) * 100));
  s.rabbit = 0; // 掉出区间
  const p2 = progress(s, MISSIONS[0]);
  assert.equal(p2.ok, false);
  assert.equal(p2.stable, 0, 'a miss resets the consecutive counter');
});