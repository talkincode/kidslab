import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

import {
  createSetup,
  createSim,
  dropAgain,
  energies,
  impactSpeed,
  patchSetup,
  predictedPeakHeight,
  recordObservation,
  runUntil,
  stepSim,
  timeToFirstImpact,
  validateSetup,
} from '../../docs/courseware-template/lab-model.js';

const nearly = (actual, expected, eps = 1e-6) => {
  assert.ok(Number.isFinite(actual), `expected finite, got ${actual}`);
  assert.ok(Math.abs(actual - expected) <= eps, `${actual} ≉ ${expected} (±${eps})`);
};

test('free-fall identities: t=√(2h/g) and v=√(2gh)', () => {
  const setup = createSetup({ g: 9.8, dropHeight: 1.25, restitution: 1, mass: 0.4 });
  nearly(timeToFirstImpact(setup), Math.sqrt((2 * 1.25) / 9.8));
  nearly(impactSpeed(setup), Math.sqrt(2 * 9.8 * 1.25));

  const started = createSim(setup);
  const { sim, events } = runUntil(started, timeToFirstImpact(setup) + 1e-4, 1 / 400);
  assert.equal(events[0]?.type, 'bounce');
  nearly(sim.t, timeToFirstImpact(setup), 2e-3);
  nearly(Math.abs(events[0].speed), impactSpeed(setup), 2e-3);
});

test('elastic bounce returns to the drop height and conserves mechanical energy', () => {
  const setup = createSetup({ g: 10, dropHeight: 1.6, restitution: 1, mass: 0.5 });
  const initial = energies(createSim(setup)).mechanical;
  const after = runUntil(createSim(setup), timeToFirstImpact(setup) * 2, 1 / 480);
  assert.equal(after.ok, true);
  assert.equal(after.sim.bounces, 1);
  nearly(after.sim.y, 1.6, 0.02);
  nearly(after.sim.v, 0, 0.08);
  nearly(energies(after.sim).mechanical, initial, 0.02);
});

test('predicted peak after one bounce is h e², and e=0 sticks on the floor', () => {
  const bouncy = createSetup({ dropHeight: 1.2, restitution: 0.5, g: 9.8 });
  nearly(predictedPeakHeight(bouncy), 1.2 * 0.25);
  const peak = runUntil(createSim(bouncy), timeToFirstImpact(bouncy) * 1.6, 1 / 360);
  assert.ok(peak.sim.bounces >= 1);
  assert.ok(peak.sim.y <= 1.2 * 0.25 + 0.03);
  assert.ok(peak.sim.y >= 1.2 * 0.25 - 0.08);

  const sticky = runUntil(createSim({ dropHeight: 0.8, restitution: 0, g: 9.8 }), 2, 1 / 120);
  assert.equal(sticky.sim.resting, true);
  assert.equal(sticky.sim.y, 0);
  assert.equal(sticky.sim.v, 0);
  assert.equal(sticky.events.some((event) => event.type === 'rest'), true);
});

test('invalid setup, negative dt, and NaN state are rejected without mutating history', () => {
  assert.equal(validateSetup({ g: 9.8, restitution: 0.5, dropHeight: 1, mass: 0.2 }).ok, true);
  assert.equal(validateSetup({ g: 0, restitution: 0.5, dropHeight: 1, mass: 0.2 }).reason, 'out-of-range-g');
  assert.equal(validateSetup({ g: 9.8, restitution: 1.2, dropHeight: 1, mass: 0.2 }).reason, 'out-of-range-restitution');
  assert.equal(validateSetup(null).reason, 'invalid-setup');

  const sim = createSim();
  const frozen = { ...sim };
  const badDt = stepSim(sim, -0.01);
  assert.equal(badDt.ok, false);
  assert.equal(badDt.reason, 'invalid-dt');
  assert.deepEqual(sim, frozen);

  const nanState = stepSim({ ...sim, v: Number.NaN }, 0.016);
  assert.equal(nanState.reason, 'invalid-state');

  const history = [];
  const badHistory = recordObservation('nope', sim);
  assert.equal(badHistory.reason, 'invalid-history');
  assert.equal(recordObservation(history, sim).history.length, 1);
  assert.equal(history.length, 0);
});

test('patching gravity live and dropping again recover a playable sim', () => {
  let sim = createSim({ g: 9.8, dropHeight: 1, restitution: 0.8 });
  sim = runUntil(sim, 0.2, 1 / 120).sim;
  assert.ok(sim.y < 1);
  const patched = patchSetup(sim, { g: 1.6 });
  assert.equal(patched.ok, true);
  assert.equal(patched.sim.g, 1.6);
  assert.equal(patched.sim.y, sim.y);

  const paused = stepSim({ ...patched.sim, paused: true }, 1);
  assert.equal(paused.sim.y, patched.sim.y);
  assert.equal(paused.sim.t, patched.sim.t);

  const reset = dropAgain(patched.sim);
  assert.equal(reset.sim.y, reset.sim.dropHeight);
  assert.equal(reset.sim.v, 0);
  assert.equal(reset.sim.bounces, 0);
  assert.equal(reset.sim.resting, false);
});

test('template chrome is a 3D observation lab, not an exam', async () => {
  const html = await readFile(new URL('../../docs/courseware-template/index.html', import.meta.url), 'utf8');
  const js = await readFile(new URL('../../docs/courseware-template/main.js', import.meta.url), 'utf8');
  assert.match(html, /id="scene"/);
  assert.match(html, /id="panel"/);
  assert.match(html, /id="panelHandle"/);
  assert.match(html, /id="musicBtn"/);
  assert.match(html, /id="soundBtn"/);
  assert.match(html, /type="importmap"/);
  assert.match(js, /createLabScene/);
  assert.match(js, /createAudio/);
  const visible = html.replace(/<!--[\s\S]*?-->/g, '');
  assert.doesNotMatch(visible, /选择题|请选择正确答案|考试试卷|multiple-choice/i);
  assert.doesNotMatch(js, /选择题|请选择正确答案|考试试卷/);
});
