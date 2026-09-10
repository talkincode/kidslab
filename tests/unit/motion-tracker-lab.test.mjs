import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DT,
  G,
  MAX_MARKS,
  TRACK_LENGTH_M,
  accelerationFromMarks,
  classifyMotion,
  createLab,
  inclineAcceleration,
  intervalVelocities,
  markAt,
  markNow,
  positionAtTime,
  resetLab,
  setAngle,
  setKind,
  setPlaying,
  speedFromMarks,
  stepLab,
  velocityAtTime,
} from '../../src/motion-tracker-lab/motion-model.js';

function markEveryFrame(lab, count) {
  const recorded = [];
  for (let i = 0; i < count; i += 1) {
    const marked = markNow(lab);
    assert.equal(marked.ok, true, marked.reason);
    recorded.push({ t: lab.t, s: lab.s, v: lab.v });
    if (i < count - 1) {
      const stepped = stepLab(lab, DT);
      assert.equal(stepped.ok, true, stepped.reason);
    }
  }
  return recorded;
}

test('uniform motion identity: s = s0 + v t and v stays 0.40 m/s', () => {
  assert.equal(positionAtTime(0.1, 0.4, 0, 0.5), 0.3);
  assert.equal(velocityAtTime(0.4, 0, 0.5), 0.4);

  const lab = createLab({ kind: 'uniform' });
  assert.equal(lab.kind, 'uniform');
  assert.equal(lab.angleDeg, 0);
  assert.equal(lab.s0, 0.1);
  assert.equal(lab.v0, 0.4);
  assert.equal(lab.a, 0);
  assert.equal(lab.s, 0.1);
  assert.equal(lab.v, 0.4);

  const frames = markEveryFrame(lab, 6);
  assert.deepEqual(frames.map((frame) => frame.t), [0, 0.1, 0.2, 0.3, 0.4, 0.5]);
  assert.deepEqual(frames.map((frame) => Number(frame.s.toFixed(4))), [0.1, 0.14, 0.18, 0.22, 0.26, 0.3]);
  assert.ok(frames.every((frame) => Math.abs(frame.v - 0.4) < 1e-12));

  const velocities = intervalVelocities(lab.marks, DT);
  assert.ok(velocities.every((row) => Math.abs(row.v - 0.4) < 1e-12));
  assert.equal(Number(speedFromMarks(lab.marks).toFixed(4)), 0.4);
  assert.equal(classifyMotion(lab.marks), 'uniform');
});

test('constant-acceleration identities: v = v0 + at and s = s0 + v0 t + 1/2 a t²', () => {
  assert.equal(inclineAcceleration(30), 4.9);
  assert.equal(positionAtTime(0, 0, 4.9, 0.5), 0.6125);
  assert.equal(velocityAtTime(0, 4.9, 0.5), 2.45);

  const lab = createLab({ kind: 'accelerated', angleDeg: 30 });
  assert.equal(lab.a, 4.9);
  assert.equal(lab.s0, 0);
  assert.equal(lab.v0, 0);

  const frames = markEveryFrame(lab, 6);
  assert.deepEqual(frames.map((frame) => Number(frame.s.toFixed(4))), [0, 0.0245, 0.098, 0.2205, 0.392, 0.6125]);
  assert.deepEqual(frames.map((frame) => Number(frame.v.toFixed(4))), [0, 0.49, 0.98, 1.47, 1.96, 2.45]);

  const velocities = intervalVelocities(lab.marks, DT);
  assert.deepEqual(velocities.map((row) => Number(row.v.toFixed(4))), [0.245, 0.735, 1.225, 1.715, 2.205]);
  assert.equal(Number(accelerationFromMarks(lab.marks).toFixed(4)), 4.9);
  assert.equal(classifyMotion(lab.marks), 'accelerated');
});

test('frictionless incline acceleration is g sinθ, including 0° and 90° bounds', () => {
  assert.equal(inclineAcceleration(0), 0);
  assert.equal(inclineAcceleration(30), 4.9);
  assert.equal(inclineAcceleration(90), G);
  assert.equal(inclineAcceleration(-1), null);
  assert.equal(inclineAcceleration(91), null);
  assert.equal(inclineAcceleration(Number.NaN), null);
  assert.equal(positionAtTime(0, 0, 0, -0.1), null);
  assert.equal(velocityAtTime(0, 0, -0.1), null);
  assert.equal(positionAtTime(0, 0, 0, Number.POSITIVE_INFINITY), null);
});

test('illegal kind, angle, dt and mark input are rejected without mutating the run', () => {
  assert.equal(createLab({ kind: 'quiz' }), null);

  const lab = createLab({ kind: 'uniform' });
  const before = { kind: lab.kind, angleDeg: lab.angleDeg, t: lab.t, s: lab.s, marks: lab.marks.length };

  assert.equal(setKind(lab, 'exam').ok, false);
  assert.equal(setKind(lab, 'exam').reason, 'invalid-kind');
  assert.equal(setAngle(lab, 20).ok, false);
  assert.equal(setAngle(lab, 20).reason, 'level-track');
  assert.equal(stepLab(lab, 0).ok, false);
  assert.equal(stepLab(lab, -0.1).ok, false);
  assert.equal(stepLab(lab, Number.NaN).ok, false);
  assert.equal(markAt(lab, Number.NaN).ok, false);
  assert.equal(markAt(lab, Number.POSITIVE_INFINITY).ok, false);

  assert.equal(lab.kind, before.kind);
  assert.equal(lab.angleDeg, before.angleDeg);
  assert.equal(lab.t, before.t);
  assert.equal(lab.s, before.s);
  assert.equal(lab.marks.length, before.marks);
});

test('a missed tap stays on the same frame; a later hit records the true position', () => {
  const lab = createLab({ kind: 'uniform' });
  const miss = markAt(lab, 0.2);
  assert.equal(miss.ok, false);
  assert.equal(miss.reason, 'miss');
  assert.equal(lab.marks.length, 0);
  assert.equal(lab.t, 0);
  assert.equal(lab.lastError, 'miss');

  const hit = markAt(lab, 0.1);
  assert.equal(hit.ok, true);
  assert.equal(lab.marks.length, 1);
  assert.equal(lab.marks[0].s, 0.1);
  assert.equal(lab.marks[0].t, 0);
  assert.equal(lab.lastError, null);

  const duplicate = markNow(lab);
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.reason, 'duplicate');
  assert.equal(lab.marks.length, 1);
});

test('the cart stops at the track end and reset restores the same experiment', () => {
  const lab = createLab({ kind: 'uniform' });
  setPlaying(lab, true);
  assert.equal(lab.playing, true);

  let guard = 0;
  while (!lab.finished && guard < 100) {
    const result = stepLab(lab, DT);
    assert.equal(result.ok, true, result.reason);
    guard += 1;
  }
  assert.equal(lab.finished, true);
  assert.equal(lab.playing, false);
  assert.equal(Number(lab.s.toFixed(4)), TRACK_LENGTH_M);
  assert.equal(stepLab(lab, DT).ok, false);
  assert.equal(stepLab(lab, DT).reason, 'finished');

  resetLab(lab);
  assert.equal(lab.t, 0);
  assert.equal(lab.s, 0.1);
  assert.equal(lab.v, 0.4);
  assert.equal(lab.finished, false);
  assert.equal(lab.playing, false);
  assert.equal(lab.marks.length, 0);
  assert.equal(lab.kind, 'uniform');
  assert.equal(stepLab(lab, DT).ok, true);
});

test('switching to a 20° ramp resets marks and the v-t slope matches g sinθ', () => {
  const lab = createLab({ kind: 'uniform' });
  markEveryFrame(lab, 3);
  assert.equal(lab.marks.length, 3);

  const switched = setKind(lab, 'accelerated');
  assert.equal(switched.ok, true);
  assert.equal(lab.kind, 'accelerated');
  assert.equal(lab.angleDeg, 30);
  assert.equal(lab.marks.length, 0);
  assert.equal(lab.t, 0);

  const angled = setAngle(lab, 20);
  assert.equal(angled.ok, true);
  assert.equal(lab.angleDeg, 20);
  assert.equal(lab.a, inclineAcceleration(20));
  assert.equal(lab.marks.length, 0);

  markEveryFrame(lab, 6);
  const expected = Number((G * Math.sin((20 * Math.PI) / 180)).toFixed(4));
  assert.equal(Number(accelerationFromMarks(lab.marks).toFixed(4)), expected);
  assert.equal(classifyMotion(lab.marks), 'accelerated');
});

test('full mark tape rejects extra points, then reset recovers a fresh run', () => {
  const lab = createLab({ kind: 'uniform' });
  markEveryFrame(lab, MAX_MARKS);
  assert.equal(lab.marks.length, MAX_MARKS);
  const extra = markNow(lab);
  assert.equal(extra.ok, false);
  assert.equal(extra.reason, 'full');
  assert.equal(lab.marks.length, MAX_MARKS);

  resetLab(lab);
  assert.equal(markNow(lab).ok, true);
  assert.equal(lab.marks.length, 1);
});
