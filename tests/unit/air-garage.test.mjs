import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BURST_AT,
  TRACK_LENGTH,
  balloonMass,
  createGarage,
  dipCup,
  judgeBalance,
  launchRocket,
  popBalloon,
  pumpRocket,
  resetStation,
  setNozzle,
} from '../../src/air-garage/air-model.js';

test('an inverted cup keeps the tissue dry because trapped air occupies the space', () => {
  const result = dipCup(createGarage(), { tilt: false });

  assert.equal(result.error, null);
  assert.equal(result.garage.cup.inWater, true);
  assert.equal(result.garage.cup.tissueWet, false);
  assert.equal(result.garage.cup.provenDry, true);
  assert.equal(result.garage.station, 1);
  assert.deepEqual(result.garage.cleared, ['cup']);
});

test('tilting the cup lets air escape, wets the tissue, and leaves the station retryable', () => {
  const failed = dipCup(createGarage(), { tilt: true });

  assert.equal(failed.error, 'air-escaped');
  assert.equal(failed.garage.cup.tissueWet, true);
  assert.equal(failed.garage.cup.provenDry, false);
  assert.equal(failed.garage.station, 0);
  assert.deepEqual(failed.garage.cleared, []);

  const retried = dipCup(resetStation(failed.garage), { tilt: false });
  assert.equal(retried.error, null);
  assert.equal(retried.garage.cup.tissueWet, false);
  assert.equal(retried.garage.station, 1);
});

test('popping exactly one balloon unbalances the scale because the remaining air still has mass', () => {
  const garage = createGarage();
  garage.station = 1;
  garage.cleared = ['cup'];

  assert.equal(balloonMass(garage.balance, 'left'), balloonMass(garage.balance, 'right'));
  assert.ok(balloonMass(garage.balance, 'left') > balloonMass({ leftPopped: true }, 'left'));

  const stillLevel = judgeBalance(garage);
  assert.equal(stillLevel.error, 'still-balanced');
  assert.equal(stillLevel.garage.station, 1);

  const popped = popBalloon(garage, 'left');
  const bothGone = judgeBalance(popBalloon(popped.garage, 'right').garage);
  assert.equal(bothGone.error, 'air-gone');
  assert.equal(bothGone.tilt, 0);
  assert.equal(bothGone.garage.station, 1);

  const recovered = judgeBalance(popBalloon(resetStation(bothGone.garage), 'right').garage);
  assert.equal(recovered.error, null);
  assert.equal(recovered.tilt, -1);
  assert.equal(recovered.garage.station, 2);
  assert.deepEqual(recovered.garage.cleared, ['cup', 'balance']);
});

test('a balloon engine needs enough compressed air, bursts if overpumped, and can relaunch', () => {
  const ready = createGarage();
  ready.station = 2;
  ready.cleared = ['cup', 'balance'];

  const empty = launchRocket(ready);
  assert.equal(empty.error, 'no-air');
  assert.equal(empty.distance, 0);
  assert.equal(empty.garage.complete, false);

  let pumped = ready;
  for (let i = 0; i < 3; i += 1) pumped = pumpRocket(pumped).garage;
  const short = launchRocket(pumped);
  assert.equal(short.error, 'too-short');
  assert.equal(short.distance, 3);
  assert.ok(short.distance < TRACK_LENGTH);

  let burstState = ready;
  for (let i = 0; i < BURST_AT; i += 1) burstState = pumpRocket(burstState).garage;
  assert.equal(burstState.rocket.burst, true);
  assert.equal(burstState.rocket.pumps, 0);
  const popped = launchRocket(burstState);
  assert.equal(popped.error, 'burst');

  const reset = resetStation(popped.garage);
  let full = setNozzle(reset, 'small').garage;
  for (let i = 0; i < TRACK_LENGTH; i += 1) full = pumpRocket(full).garage;
  const won = launchRocket(full);
  assert.equal(won.error, null);
  assert.equal(won.distance, TRACK_LENGTH);
  assert.equal(won.duration, TRACK_LENGTH);
  assert.equal(won.thrust, 1);
  assert.equal(won.garage.complete, true);
  assert.deepEqual(won.garage.cleared, ['cup', 'balance', 'rocket']);
});
