import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULTS,
  G,
  analyticState,
  compareTrajectories,
  createLab,
  flightTime,
  launch,
  maxHeight,
  parseLab,
  rangeOf,
  recordTrial,
  resetFlight,
  resetLab,
  serializeLab,
  setAngle,
  setG,
  setHeight,
  setPaused,
  setSpeed,
  snapshot,
  stepLab,
} from '../../src/projectile-motion-lab/lab-model.js';

const nearly = (actual, expected, eps = 1e-9) => {
  assert.ok(Number.isFinite(actual), `expected finite, got ${actual}`);
  assert.ok(Math.abs(actual - expected) <= eps, `${actual} ≉ ${expected} (±${eps})`);
};

function land(lab, dt = 1 / 240) {
  let current = lab;
  for (let i = 0; i < 4000; i += 1) {
    const result = stepLab(current, dt);
    assert.equal(result.ok, true, result.reason);
    current = result.lab;
    if (current.flight?.landed && (!current.drop || current.drop.landed)) return current;
  }
  assert.fail('flight did not land');
}

test('horizontal projectile flight time is √(2h/g) and independent of speed', () => {
  const h = 5;
  const expected = Math.sqrt((2 * h) / G);
  nearly(flightTime({ height: h, speed: 10, angleDeg: 0, g: G }), expected);
  nearly(flightTime({ height: h, speed: 25, angleDeg: 0, g: G }), expected);
  nearly(rangeOf({ height: h, speed: 10, angleDeg: 0, g: G }), 10 * expected);
});

test('free fall from the same height shares the horizontal-projectile clock', () => {
  const h = 5;
  const dropT = flightTime({ height: h, speed: 0, angleDeg: 0, g: G });
  const flatT = flightTime({ height: h, speed: 12, angleDeg: 0, g: G });
  nearly(dropT, Math.sqrt((2 * h) / G));
  nearly(dropT, flatT);
});

test('ground launch range is v0² sin(2θ)/g and peaks at 45°', () => {
  const setup = { height: 0, speed: 10, angleDeg: 45, g: G };
  nearly(rangeOf(setup), (10 * 10) / G);
  nearly(flightTime(setup), (2 * 10 * Math.sin(Math.PI / 4)) / G);
  const r30 = rangeOf({ ...setup, angleDeg: 30 });
  const r60 = rangeOf({ ...setup, angleDeg: 60 });
  nearly(r30, r60);
  assert.ok(rangeOf(setup) > r30);
});

test('peak height is h + vy0²/(2g) when launched upward, else h', () => {
  nearly(maxHeight({ height: 5, speed: 10, angleDeg: 0, g: G }), 5);
  const vy0 = 20 * Math.sin((30 * Math.PI) / 180);
  nearly(maxHeight({ height: 5, speed: 20, angleDeg: 30, g: G }), 5 + (vy0 * vy0) / (2 * G));
});

test('analytic components stay independent: doubling vx doubles range, not hang time', () => {
  const a = { height: 4, speed: 8, angleDeg: 0, g: G };
  const b = { ...a, speed: 16 };
  nearly(flightTime(a), flightTime(b));
  nearly(rangeOf(b), 2 * rangeOf(a));
  const mid = analyticState(a, flightTime(a) / 2);
  nearly(mid.x, 8 * (flightTime(a) / 2));
  nearly(mid.y, 4 - 0.5 * G * (flightTime(a) / 2) ** 2);
  nearly(mid.vx, 8);
});

test('kinematic numeric trajectory matches the closed-form path pointwise', () => {
  const setup = { height: 5, speed: 12, angleDeg: 35, g: G };
  const report = compareTrajectories(setup, 1 / 120);
  assert.equal(report.ok, true);
  assert.ok(report.samples > 20);
  assert.ok(report.maxDx < 1e-9, `maxDx ${report.maxDx}`);
  assert.ok(report.maxDy < 1e-9, `maxDy ${report.maxDy}`);
});

test('a new lab starts ready on the platform, not in flight', () => {
  const lab = createLab();
  assert.equal(lab.height, DEFAULTS.height);
  assert.equal(lab.speed, DEFAULTS.speed);
  assert.equal(lab.angleDeg, 0);
  assert.equal(lab.g, G);
  assert.equal(lab.flight, null);
  assert.equal(lab.phase, 'observe');
  const view = snapshot(lab);
  assert.equal(view.ready, true);
  assert.equal(view.landed, false);
});

test('launching together lands the red ball and the yellow drop at the same time', () => {
  const started = launch(createLab(), { withDrop: true });
  assert.equal(started.ok, true);
  const landed = land(started.lab);
  nearly(landed.flight.landTime, landed.drop.landTime, 1e-6);
  nearly(landed.flight.landTime, Math.sqrt((2 * landed.height) / G), 1e-6);
  assert.equal(landed.flight.hoopHit, false);
});

test('recording is refused in flight and does not mutate the notebook', () => {
  const flying = launch(createLab(), { withDrop: true });
  const refused = recordTrial(flying.lab);
  assert.equal(refused.ok, false);
  assert.equal(refused.reason, 'still-flying');
  assert.equal(refused.lab.trials.length, 0);
  assert.equal(refused.lab.flight.landed, false);
});

test('invalid knobs and negative dt are rejected without changing state', () => {
  const lab = createLab();
  assert.equal(setSpeed(lab, -1).reason, 'out-of-range-speed');
  assert.equal(setSpeed(lab, -1).lab.speed, lab.speed);
  assert.equal(setAngle(lab, 90).reason, 'out-of-range-angle');
  assert.equal(setHeight(lab, 0).reason, 'out-of-range-height');
  assert.equal(setG(lab, 0).reason, 'out-of-range-g');
  assert.equal(setSpeed(lab, NaN).reason, 'invalid-speed');
  const launched = launch(lab).lab;
  assert.equal(stepLab(launched, -0.01).reason, 'invalid-dt');
  assert.equal(stepLab(launched, -0.01).lab.flight.t, launched.flight.t);
  assert.equal(launch(launched).reason, 'in-flight');
  assert.equal(recordTrial(createLab()).reason, 'no-flight');
});

test('pause freezes the clock; resume continues from the same place', () => {
  let lab = launch(createLab()).lab;
  lab = stepLab(lab, 0.2).lab;
  const paused = setPaused(lab, true);
  assert.equal(paused.ok, true);
  const held = stepLab(paused.lab, 0.5);
  assert.equal(held.ok, true);
  nearly(held.lab.flight.t, lab.flight.t);
  nearly(held.lab.flight.x, lab.flight.x);
  const resumed = setPaused(held.lab, false).lab;
  const moved = stepLab(resumed, 0.1).lab;
  assert.ok(moved.flight.t > lab.flight.t);
});

test('a 30° 8 m/s shot from 5 m threads the default hoop', () => {
  let lab = setAngle(createLab(), 30).lab;
  lab = setSpeed(lab, 8).lab;
  lab = launch(lab).lab;
  lab = land(lab);
  assert.equal(lab.flight.hoopHit, true);
  assert.ok(lab.flight.hoopMinDist <= lab.target.radius);
});

test('the same hoop shot still registers at a coarse 20 Hz clock', () => {
  let lab = setAngle(createLab(), 30).lab;
  lab = setSpeed(lab, 8).lab;
  lab = launch(lab).lab;
  lab = land(lab, 1 / 20);
  assert.equal(lab.flight.hoopHit, true);
  assert.ok(lab.flight.hoopMinDist <= lab.target.radius);
});

test('a flat 10 m/s shot misses the hoop and stays recoverable', () => {
  const started = launch(createLab());
  const landed = land(started.lab);
  assert.equal(landed.flight.hoopHit, false);
  assert.ok(landed.flight.hoopMinDist > landed.target.radius);
  const again = launch(resetFlight(landed).lab);
  assert.equal(again.ok, true);
  assert.equal(again.lab.flight.landed, false);
});

test('compare record plus a hoop hit completes the lab; reset flight keeps the notebook', () => {
  let lab = launch(createLab(), { withDrop: true }).lab;
  lab = land(lab);
  const compare = recordTrial(lab);
  assert.equal(compare.ok, true);
  assert.equal(compare.lab.trials.length, 1);
  assert.equal(compare.lab.trials[0].mode, 'compare');
  nearly(compare.lab.trials[0].flightTime, compare.lab.trials[0].dropTime, 1e-6);

  lab = resetFlight(compare.lab).lab;
  assert.equal(lab.flight, null);
  assert.equal(lab.trials.length, 1);

  lab = setAngle(lab, 30).lab;
  lab = setSpeed(lab, 8).lab;
  lab = launch(lab).lab;
  lab = land(lab);
  const done = recordTrial(lab);
  assert.equal(done.ok, true);
  assert.equal(done.lab.phase, 'complete');
  assert.equal(done.lab.trials[1].hoopHit, true);

  const cleared = resetLab(done.lab);
  assert.equal(cleared.ok, true);
  assert.equal(cleared.lab.trials.length, 0);
  assert.equal(cleared.lab.phase, 'observe');
});

test('serialize then parse restores trials after a mid-lab reload', () => {
  let lab = launch(createLab(), { withDrop: true }).lab;
  lab = land(lab);
  lab = recordTrial(lab).lab;
  const raw = serializeLab(lab);
  const restored = parseLab(raw);
  assert.equal(restored.ok, true);
  assert.equal(restored.lab.trials.length, 1);
  assert.equal(restored.lab.trials[0].mode, 'compare');
  assert.equal(parseLab('{').ok, false);
  assert.equal(parseLab(null).reason, 'invalid-save');
});
