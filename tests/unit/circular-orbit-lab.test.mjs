import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CIRCULAR_TOLERANCE,
  SYNC_PERIOD_SECONDS,
  circularSpeed,
  radiusForPeriod,
} from '../../src/circular-orbit-lab/orbit-model.js';
import {
  abort,
  createLab,
  launch,
  parseLab,
  previewOrbit,
  recordTrial,
  resetLab,
  serializeLab,
  setAltitudeKm,
  setSpeedRatio,
  snapshot,
  stepLab,
} from '../../src/circular-orbit-lab/lab-model.js';

const close = (actual, expected, relative) => Math.abs(actual - expected) / Math.abs(expected) <= relative;

function flyUntilPending(lab, maxSteps = 20000) {
  let current = lab;
  for (let i = 0; i < maxSteps; i += 1) {
    const result = stepLab(current, 1 / 60);
    assert.equal(result.ok, true, result.reason);
    current = result.lab;
    if (current.pending) return current;
  }
  assert.fail('flight did not settle into a pending reading');
}

test('a new lab starts at 400 km with circular preview speed 7.67 km/s', () => {
  const lab = createLab();
  const view = snapshot(lab);
  assert.equal(view.altitudeKm, 400);
  assert.equal(view.speedRatio, 1);
  assert.equal(view.status, 'ready');
  assert.equal(previewOrbit(lab).kind, 'circular');
  assert.ok(close(view.circularSpeed / 1000, 7.67, 0.002), `v=${view.circularSpeed}`);
  assert.ok(close(view.escapeSpeed / view.circularSpeed, Math.SQRT2, 1e-9));
});

test('illegal altitude and speed knobs are rejected and leave the lab unchanged', () => {
  const lab = createLab();
  assert.equal(setAltitudeKm(lab, 0).ok, false);
  assert.equal(setAltitudeKm(lab, 0).reason, 'out-of-range-altitude');
  assert.equal(setAltitudeKm(lab, Number.NaN).reason, 'invalid-altitude');
  assert.equal(setSpeedRatio(lab, 0.1).reason, 'out-of-range-speed');
  assert.equal(setSpeedRatio(lab, -1).reason, 'out-of-range-speed');
  assert.deepEqual(snapshot(setAltitudeKm(lab, 0).lab), snapshot(lab));
});

test('raising altitude lowers both circular and escape speed', () => {
  const high = setAltitudeKm(createLab(), 8000);
  assert.equal(high.ok, true);
  const view = snapshot(high.lab);
  assert.equal(view.altitudeKm, 8000);
  assert.ok(view.circularSpeed / 1000 < 7.67);
  assert.ok(close(view.escapeSpeed / view.circularSpeed, Math.SQRT2, 1e-9));
});

test('a matched speed settles as a circular orbit with a 92-minute period', () => {
  const flown = flyUntilPending(launch(createLab()).lab);
  assert.equal(flown.pending.kind, 'circular');
  assert.ok(close(flown.pending.period, 5545, 0.002), `T=${flown.pending.period}`);
  assert.equal(snapshot(flown).status, 'orbiting');
});

test('too slow re-enters, too fast escapes, and abort recovers a ready console', () => {
  const crash = flyUntilPending(launch(setSpeedRatio(createLab(), 0.9).lab).lab);
  assert.equal(crash.pending.kind, 'crash');
  assert.equal(crash.pending.period, null);
  assert.equal(snapshot(crash).status, 'crashed');

  const recovered = abort(crash);
  assert.equal(recovered.ok, true);
  assert.equal(recovered.lab.pending, null);
  assert.equal(snapshot(recovered.lab).status, 'ready');

  const escape = flyUntilPending(launch(setSpeedRatio(recovered.lab, 1.5).lab).lab);
  assert.equal(escape.pending.kind, 'escape');
  assert.equal(snapshot(escape).status, 'escaped');
});

test('recording is refused before launch, during flight, and for a duplicate reading', () => {
  const idle = createLab();
  assert.equal(recordTrial(idle).reason, 'no-flight');

  const flying = launch(idle).lab;
  assert.equal(recordTrial(flying).reason, 'still-flying');

  const settled = flyUntilPending(flying);
  const first = recordTrial(settled);
  assert.equal(first.ok, true);
  assert.equal(first.lab.trials.length, 1);
  assert.equal(recordTrial(first.lab).reason, 'duplicate-trial');
});

test('logging circle, crash and escape completes the observation without a quiz lock', () => {
  let lab = createLab();
  lab = recordTrial(flyUntilPending(launch(lab).lab)).lab;
  lab = recordTrial(flyUntilPending(launch(setSpeedRatio(lab, 0.9).lab).lab)).lab;
  lab = recordTrial(flyUntilPending(launch(setSpeedRatio(lab, 1.5).lab).lab)).lab;
  assert.equal(lab.phase, 'complete');
  assert.equal(lab.seen.circular, true);
  assert.equal(lab.seen.crash, true);
  assert.equal(lab.seen.escape, true);
  assert.equal(lab.trials.length, 3);
});

test('a circular one-day orbit is recognized as synchronous without being a scored challenge', () => {
  const radius = radiusForPeriod(SYNC_PERIOD_SECONDS);
  const altitudeKm = Math.round((radius - 6.371e6) / 1000);
  const prepared = setAltitudeKm(createLab(), altitudeKm);
  assert.equal(prepared.ok, true);
  const flown = flyUntilPending(launch(prepared.lab).lab);
  assert.equal(flown.pending.kind, 'circular');
  assert.ok(close(flown.pending.period, SYNC_PERIOD_SECONDS, 0.01));
  const view = snapshot(flown);
  assert.equal(view.syncKind, 'sync');
});

test('a slightly fast launch at GEO altitude is not synchronous', () => {
  const radius = radiusForPeriod(SYNC_PERIOD_SECONDS);
  const altitudeKm = Math.round((radius - 6.371e6) / 1000);
  const prepared = setSpeedRatio(setAltitudeKm(createLab(), altitudeKm).lab, 1 + CIRCULAR_TOLERANCE * 4);
  const flown = flyUntilPending(launch(prepared.lab).lab);
  assert.notEqual(flown.pending.kind, 'circular');
  assert.equal(snapshot(flown).syncKind, 'not-circular');
});

test('the same launch replayed twice yields the identical pending reading', () => {
  const first = flyUntilPending(launch(setSpeedRatio(createLab(), 1.08).lab).lab);
  const second = flyUntilPending(launch(setSpeedRatio(createLab(), 1.08).lab).lab);
  assert.deepEqual(first.pending, second.pending);
});

test('serialize then parse restores the notebook and knobs after a reset', () => {
  let lab = recordTrial(flyUntilPending(launch(createLab()).lab)).lab;
  const saved = serializeLab(lab);
  const restored = parseLab(saved);
  assert.equal(restored.ok, true);
  assert.equal(restored.lab.trials.length, 1);
  assert.equal(restored.lab.trials[0].kind, 'circular');
  assert.equal(restored.lab.altitudeKm, 400);
  const cleared = resetLab(restored.lab);
  assert.equal(cleared.ok, true);
  assert.equal(cleared.lab.trials.length, 0);
  assert.equal(cleared.lab.phase, 'ready');
  assert.equal(parseLab('not-json').ok, false);
});
