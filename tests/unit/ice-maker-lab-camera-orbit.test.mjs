import assert from 'node:assert/strict';
import test from 'node:test';

import {
  RADIUS_MAX,
  RADIUS_MIN,
  applyOrbitDrag,
  applyPinchZoom,
  applyWheelZoom,
  createOrbit,
  setOrbitGoal,
  tickOrbit,
} from '../../src/ice-maker-lab/camera-orbit.js';

const STAGE = {
  yaw: 0.62,
  elevation: 0.42,
  radius: 4.15,
  target: { x: 0.15, y: 0.82, z: 0 },
};

function nearly(actual, expected, eps = 1e-6) {
  assert.ok(Number.isFinite(actual), `expected finite, got ${actual}`);
  assert.ok(Math.abs(actual - expected) <= eps, `${actual} ≉ ${expected} (±${eps})`);
}

function settle(orbit, frames = 180, dt = 1 / 60) {
  let current = orbit;
  for (let i = 0; i < frames; i += 1) current = tickOrbit(current, dt);
  return current;
}

test('wheel zoom-out keeps the larger radius after the animation loop ticks', () => {
  let orbit = createOrbit(STAGE);
  orbit = applyWheelZoom(orbit, 80);
  assert.ok(orbit.radius > STAGE.radius, 'zoom-out should increase radius');
  nearly(orbit.goalRadius, orbit.radius);

  const later = settle(orbit);
  nearly(later.radius, orbit.radius);
  nearly(later.goalRadius, orbit.radius);
  assert.ok(later.radius > STAGE.radius);
});

test('wheel zoom-in keeps the smaller radius instead of snapping back to the named view', () => {
  let orbit = createOrbit(STAGE);
  orbit = applyWheelZoom(orbit, -80);
  assert.ok(orbit.radius < STAGE.radius);
  const later = settle(orbit);
  nearly(later.radius, orbit.radius);
  assert.ok(later.radius < STAGE.radius);
});

test('radius is clamped and illegal deltas do not produce NaN', () => {
  let far = createOrbit({ ...STAGE, radius: RADIUS_MAX });
  far = applyWheelZoom(far, 80);
  nearly(far.radius, RADIUS_MAX);

  let near = createOrbit({ ...STAGE, radius: RADIUS_MIN });
  near = applyWheelZoom(near, -80);
  nearly(near.radius, RADIUS_MIN);

  let bad = applyWheelZoom(createOrbit(STAGE), Number.NaN);
  assert.ok(Number.isFinite(bad.radius));
  assert.ok(Number.isFinite(bad.goalRadius));
});

test('orbit drag persists yaw after ticks, and a named view can still lerp afterward', () => {
  let orbit = createOrbit(STAGE);
  orbit = applyOrbitDrag(orbit, 40, 20);
  assert.ok(orbit.yaw < STAGE.yaw);
  assert.ok(orbit.elevation > STAGE.elevation);
  nearly(orbit.goalYaw, orbit.yaw);
  nearly(orbit.goalElevation, orbit.elevation);

  const held = settle(orbit);
  nearly(held.yaw, orbit.yaw);
  nearly(held.elevation, orbit.elevation);

  const looping = settle(setOrbitGoal(held, { ...STAGE, radius: 3.15, yaw: 0.18, elevation: 0.28 }));
  nearly(looping.yaw, 0.18, 1e-3);
  nearly(looping.elevation, 0.28, 1e-3);
  nearly(looping.radius, 3.15, 1e-3);
});

test('pinch zoom updates radius and the goal so the next frames do not restore it', () => {
  let orbit = createOrbit(STAGE);
  orbit = applyPinchZoom(orbit, 200, 100);
  assert.ok(orbit.radius > STAGE.radius);
  nearly(orbit.goalRadius, orbit.radius);
  const later = settle(orbit);
  nearly(later.radius, orbit.radius);
});
