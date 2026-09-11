import assert from 'node:assert/strict';
import test from 'node:test';

import { cameraFovForAspect, planViewportResize } from '../../src/ice-maker-lab/view-size.js';

test('shrinking the viewport applies the new size instead of restoring the old one', () => {
  const start = planViewportResize(null, { width: 1280, height: 800 });
  assert.deepEqual(start, { apply: true, width: 1280, height: 800 });

  const shrunk = planViewportResize(start, { width: 720, height: 640 });
  assert.equal(shrunk.apply, true);
  assert.equal(shrunk.width, 720);
  assert.equal(shrunk.height, 640);
});

test('an observer echo at the same size does not re-apply and cannot bounce back to 1280×800', () => {
  let size = planViewportResize(null, { width: 1280, height: 800 });
  size = planViewportResize(size, { width: 720, height: 640 });
  assert.equal(size.width, 720);
  assert.equal(size.height, 640);

  const echo = planViewportResize(size, { width: 720, height: 640 });
  assert.equal(echo.apply, false);
  assert.equal(echo.width, 720);
  assert.equal(echo.height, 640);
});

test('zero or missing viewport sizes clamp to 1px so setSize never gets an empty canvas', () => {
  const missing = planViewportResize(null, { width: 0, height: Number.NaN });
  assert.deepEqual(missing, { apply: true, width: 1, height: 1 });
});

test('narrow phone aspect uses a wider vertical FOV so the ice maker stays in frame', () => {
  assert.equal(cameraFovForAspect(1280 / 800), 34);
  assert.equal(cameraFovForAspect(800 / 800), 42);
  assert.equal(cameraFovForAspect(375 / 667), 52);
  assert.equal(cameraFovForAspect(0), 34);
});
