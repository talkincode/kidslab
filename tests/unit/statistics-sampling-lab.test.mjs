import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DISTRICT_MEANS,
  LIMITS,
  METHODS,
  POPULATION_N,
  Z95,
  censusMean,
  createLab,
  drawSample,
  parseLab,
  recordTrial,
  resetLab,
  runCensus,
  sampleSd,
  serializeLab,
  setMethod,
  setN,
  snapshot,
  standardError,
} from '../../src/statistics-sampling-lab/lab-model.js';

const nearly = (actual, expected, eps = 1e-9) => {
  assert.ok(Number.isFinite(actual), `expected finite, got ${actual}`);
  assert.ok(Math.abs(actual - expected) <= eps, `${actual} ≉ ${expected} (±${eps})`);
};

function mustDraw(lab, patch = {}) {
  let current = lab;
  if (patch.method) {
    const methoded = setMethod(current, patch.method);
    assert.equal(methoded.ok, true, methoded.reason);
    current = methoded.lab;
  }
  if (patch.n != null) {
    const sized = setN(current, patch.n);
    assert.equal(sized.ok, true, sized.reason);
    current = sized.lab;
  }
  const drawn = drawSample(current);
  assert.equal(drawn.ok, true, drawn.reason);
  return drawn.lab;
}

test('city census mean is 30 min and district means are the designed constants', () => {
  const lab = createLab();
  nearly(censusMean(lab), 30);
  nearly(DISTRICT_MEANS.downtown, 12);
  nearly(DISTRICT_MEANS.riverside, 24);
  nearly(DISTRICT_MEANS.factory, 36);
  nearly(DISTRICT_MEANS.hill, 48);
  assert.equal(lab.population.length, POPULATION_N);
  assert.equal(POPULATION_N, 400);
});

test('unbiased sample sd of 10,12,14 is 2 and SRS SE uses s/√n with FPC', () => {
  nearly(sampleSd([10, 12, 14]), 2);
  nearly(standardError(2, 4, 400), 0.9962335082737976);
  nearly(Z95, 1.96);
  const half = 1.96 * 0.9962335082737976;
  nearly(12 - half, 10.047382323783356);
  nearly(12 + half, 13.952617676216644);
});

test('simple random sample draws n unique residents from the whole city', () => {
  const lab = mustDraw(createLab(), { method: 'simple', n: 40 });
  assert.equal(lab.sample.method, 'simple');
  assert.equal(lab.sample.ids.length, 40);
  assert.equal(new Set(lab.sample.ids).size, 40);
  assert.ok(lab.sample.ids.every((id) => id >= 0 && id < 400));
  assert.equal(lab.sample.n, 40);
});

test('stratified n=40 takes exactly 10 people from each district', () => {
  const lab = mustDraw(createLab(), { method: 'stratified', n: 40 });
  assert.deepEqual(lab.sample.districts, {
    downtown: 10,
    riverside: 10,
    factory: 10,
    hill: 10,
  });
  nearly(lab.sample.mean, 30, 4);
});

test('one-cluster samples stay inside a single district', () => {
  const lab = mustDraw(createLab(), { method: 'cluster', n: 40 });
  const present = Object.entries(lab.sample.districts).filter(([, count]) => count > 0);
  assert.equal(present.length, 1);
  assert.equal(present[0][1], 40);
  assert.equal(lab.sample.cluster, present[0][0]);
});

test('convenience samples only downtown, stay in [8,16], and 95% interval misses 30', () => {
  const lab = mustDraw(createLab(), { method: 'convenience', n: 40 });
  assert.deepEqual(lab.sample.districts, {
    downtown: 40,
    riverside: 0,
    factory: 0,
    hill: 0,
  });
  assert.ok(lab.sample.mean >= 8 && lab.sample.mean <= 16);
  assert.ok(lab.sample.hi < 20, `hi ${lab.sample.hi} should miss the city mean`);
  assert.equal(lab.sample.lo <= 30 && lab.sample.hi >= 30, false);
});

test('repeated convenience draws with a fixed seed stay stably biased low', () => {
  let lab = setMethod(createLab({ seed: 42 }), 'convenience').lab;
  lab = setN(lab, 40).lab;
  const means = [];
  for (let i = 0; i < 8; i += 1) {
    lab = drawSample(lab).lab;
    means.push(lab.sample.mean);
  }
  assert.ok(means.every((mean) => mean <= 16));
  assert.ok(means.every((mean) => mean >= 8));
  const spread = Math.max(...means) - Math.min(...means);
  assert.ok(spread < 6, `convenience spread ${spread} should look stably wrong`);
  assert.ok(new Set(means.map((mean) => mean.toFixed(4))).size > 1);
});

test('same seed and draw index replay the same sample', () => {
  const a = mustDraw(createLab({ seed: 7 }), { method: 'simple', n: 24 });
  const b = mustDraw(createLab({ seed: 7 }), { method: 'simple', n: 24 });
  assert.deepEqual(a.sample.ids, b.sample.ids);
  nearly(a.sample.mean, b.sample.mean);
});

test('out-of-range n, odd stratified n, and unknown methods are refused without mutation', () => {
  const lab = createLab();
  const frozen = serializeLab(lab);

  const badN = setN(lab, 0);
  assert.equal(badN.ok, false);
  assert.equal(badN.reason, 'out-of-range-n');
  assert.equal(serializeLab(badN.lab), frozen);

  const huge = setN(lab, 400);
  assert.equal(huge.ok, false);
  assert.equal(huge.reason, 'out-of-range-n');

  const nanN = setN(lab, Number.NaN);
  assert.equal(nanN.ok, false);
  assert.equal(nanN.reason, 'invalid-n');

  const methoded = setMethod(lab, 'convenience');
  assert.equal(methoded.ok, true);
  const odd = setN(methoded.lab, 9);
  assert.equal(odd.ok, false);
  assert.equal(odd.reason, 'n-not-stratifiable');

  const unknown = setMethod(lab, 'quota');
  assert.equal(unknown.ok, false);
  assert.equal(unknown.reason, 'invalid-method');
  assert.equal(serializeLab(unknown.lab), frozen);

  assert.deepEqual([...METHODS], ['simple', 'stratified', 'cluster', 'convenience']);
  assert.deepEqual([...LIMITS.n], [8, 80]);
});

test('recording without a sample is refused and the notebook stays empty', () => {
  const lab = createLab();
  const refused = recordTrial(lab);
  assert.equal(refused.ok, false);
  assert.equal(refused.reason, 'no-sample');
  assert.equal(refused.lab.trials.length, 0);
  assert.equal(lab.trials.length, 0);
});

test('duplicate record of the same draw is refused; a new draw can be recorded', () => {
  const drawn = mustDraw(createLab(), { method: 'convenience', n: 40 });
  const first = recordTrial(drawn);
  assert.equal(first.ok, true);
  assert.equal(first.lab.trials.length, 1);

  const dup = recordTrial(first.lab);
  assert.equal(dup.ok, false);
  assert.equal(dup.reason, 'duplicate');
  assert.equal(dup.lab.trials.length, 1);

  const again = drawSample(dup.lab);
  assert.equal(again.ok, true);
  const second = recordTrial(again.lab);
  assert.equal(second.ok, true);
  assert.equal(second.lab.trials.length, 2);
});

test('census reveals the exact 30 min mean and serialize/parse restores the notebook', () => {
  let lab = mustDraw(createLab(), { method: 'convenience', n: 40 });
  lab = recordTrial(lab).lab;
  const counted = runCensus(lab);
  assert.equal(counted.ok, true);
  nearly(counted.lab.census.mean, 30);
  assert.equal(counted.lab.census.n, 400);

  const restored = parseLab(serializeLab(counted.lab));
  assert.equal(restored.trials.length, 1);
  nearly(restored.census.mean, 30);
  assert.equal(restored.sample.n, 40);
  assert.equal(restored.method, 'convenience');
});

test('reset clears trials and sample but keeps the same city, so the lab can continue', () => {
  let lab = mustDraw(createLab(), { method: 'simple', n: 40 });
  lab = recordTrial(lab).lab;
  lab = runCensus(lab).lab;
  const reset = resetLab(lab);
  assert.equal(reset.ok, true);
  assert.equal(reset.lab.trials.length, 0);
  assert.equal(reset.lab.sample, null);
  assert.equal(reset.lab.census, null);
  assert.equal(reset.lab.phase, 'observe');
  nearly(censusMean(reset.lab), 30);

  const again = drawSample(reset.lab);
  assert.equal(again.ok, true);
  assert.equal(again.lab.sample.n, 40);
});

test('L3 notes plus an L4 hit within 2 min complete the lab', () => {
  let lab = createLab({ seed: 42 });
  lab = mustDraw(lab, { method: 'convenience', n: 40 });
  lab = recordTrial(lab).lab;
  lab = mustDraw(lab, { method: 'stratified', n: 40 });
  lab = recordTrial(lab).lab;
  lab = runCensus(lab).lab;

  const view = snapshot(lab);
  assert.equal(view.censusMean, 30);
  assert.ok(view.trials.some((trial) => trial.method === 'convenience'));
  assert.ok(view.trials.some((trial) => trial.method === 'stratified'));
  const hit = lab.trials.find((trial) => Math.abs(trial.mean - 30) < 2);
  assert.ok(hit, 'stratified n=40 should land inside ±2 min');
  assert.equal(lab.phase, 'complete');
  assert.equal(view.complete, true);
});
