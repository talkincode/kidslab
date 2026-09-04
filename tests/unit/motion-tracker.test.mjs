import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CLIPS,
  DT,
  G,
  MARK_COUNT,
  accelerationFromMarks,
  classifyMotion,
  compactPanelAfter,
  concludeMotion,
  generateFrames,
  inclineAcceleration,
  intervalVelocities,
  isHit,
  leastSquaresSlope,
  markFrame,
  positionAtTime,
  predictedAcceleration,
  resetMission,
  speedFromMarks,
  startMission,
  velocityAtTime,
  withinRelative,
} from '../../src/motion-tracker-lab/motion-model.js';

test('frictionless incline acceleration is g sin theta', () => {
  assert.equal(inclineAcceleration(0), 0);
  assert.equal(inclineAcceleration(30), 4.9);
  assert.equal(inclineAcceleration(90), G);
  assert.equal(inclineAcceleration(-1), null);
  assert.equal(inclineAcceleration(91), null);
});

test('uniform clip positions and interval velocities stay at 0.40 m/s', () => {
  const frames = generateFrames(CLIPS.uniform);
  assert.equal(frames.length, MARK_COUNT);
  assert.deepEqual(frames.map((frame) => frame.t), [0, 0.1, 0.2, 0.3, 0.4, 0.5]);
  assert.deepEqual(frames.map((frame) => Number(frame.s.toFixed(4))), [0.1, 0.14, 0.18, 0.22, 0.26, 0.3]);
  assert.equal(positionAtTime(0.1, 0.4, 0, 0.5), 0.3);
  assert.equal(velocityAtTime(0.4, 0, 0.5), 0.4);

  const velocities = intervalVelocities(frames, DT);
  assert.ok(velocities.every((row) => Math.abs(row.v - 0.4) < 1e-12));
  assert.equal(Number(speedFromMarks(frames).toFixed(4)), 0.4);
  assert.equal(classifyMotion(frames), 'uniform');
});

test('30 degree clip has a = 4.90 m/s² and a rising v-t slope', () => {
  assert.equal(CLIPS.accel.a, 4.9);
  const frames = generateFrames(CLIPS.accel);
  assert.deepEqual(frames.map((frame) => Number(frame.s.toFixed(4))), [0, 0.0245, 0.098, 0.2205, 0.392, 0.6125]);

  const velocities = intervalVelocities(frames, DT);
  assert.deepEqual(velocities.map((row) => Number(row.v.toFixed(4))), [0.245, 0.735, 1.225, 1.715, 2.205]);
  assert.equal(Number(accelerationFromMarks(frames).toFixed(4)), 4.9);
  assert.equal(classifyMotion(frames), 'accelerated');
  assert.equal(leastSquaresSlope([0.05, 0.15, 0.25], [0.245, 0.735, 1.225]), 4.9);
});

test('a missed tap stays on the same frame; a hit records the true position', () => {
  const lab = startMission('uniform');
  assert.equal(isHit(0.1, 0.2), false);
  assert.equal(markFrame(lab, 0.2).ok, false);
  assert.equal(lab.marks.length, 0);
  assert.equal(lab.frameIndex, 0);

  assert.equal(isHit(0.1, 0.1), true);
  assert.equal(markFrame(lab, 0.1).ok, true);
  assert.equal(lab.marks.length, 1);
  assert.equal(lab.marks[0].s, 0.1);
  assert.equal(lab.frameIndex, 1);
});

test('wrong motion conclusion keeps data; reset restores the clip', () => {
  const lab = startMission('uniform');
  for (const frame of generateFrames(CLIPS.uniform)) {
    assert.equal(markFrame(lab, frame.s).ok, true);
  }
  const wrong = concludeMotion(lab, 'accelerated');
  assert.equal(wrong.ok, false);
  assert.equal(lab.concluded, false);
  assert.equal(lab.marks.length, MARK_COUNT);

  const right = concludeMotion(lab, 'uniform');
  assert.equal(right.ok, true);
  assert.equal(lab.concluded, true);

  resetMission(lab, 'accel');
  assert.equal(lab.clip.id, 'accel');
  assert.equal(lab.marks.length, 0);
  assert.equal(lab.concluded, false);
});

test('compact layout auto-switches panels after clip events', () => {
  assert.equal(compactPanelAfter('marked-complete'), 'data');
  assert.equal(compactPanelAfter('advance'), 'film');
  assert.equal(compactPanelAfter('advance-design'), 'lab');
  assert.equal(compactPanelAfter('choose-angle'), 'film');
  assert.equal(compactPanelAfter('reset'), 'film');
  assert.equal(compactPanelAfter('need-marks'), 'film');
  assert.equal(compactPanelAfter('wrong-kind'), null);
  assert.equal(compactPanelAfter('unknown-event'), null);
});

test('design clip predicted acceleration matches measured v-t slope', () => {
  const expected = predictedAcceleration(20);
  assert.ok(withinRelative(expected, G * Math.sin((20 * Math.PI) / 180), 1e-12));
  const lab = startMission('design', { angleDeg: 20 });
  for (const frame of generateFrames(lab.clip)) {
    assert.equal(markFrame(lab, frame.s).ok, true);
  }
  assert.ok(withinRelative(accelerationFromMarks(lab.marks), expected, 0.02));
  assert.equal(concludeMotion(lab, 'accelerated').ok, true);
});
