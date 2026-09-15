import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BUILDING_SIZE,
  DISTRICT_MEANS,
  LIMITS,
  METHODS,
  POPULATION_N,
  SURVEY_POINT,
  Z95,
  censusMean,
  compareMethods,
  createLab,
  drawSample,
  parseLab,
  recordTrial,
  resetLab,
  runBatch,
  runCensus,
  sampleSd,
  serializeLab,
  setMethod,
  setN,
  snapshot,
  standardError,
  theoreticalBias,
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

function assertWholeBuildings(lab, buildingCount) {
  const buildings = lab.sample.buildings;
  assert.ok(Array.isArray(buildings));
  assert.equal(buildings.length, buildingCount);
  assert.equal(new Set(buildings).size, buildingCount);
  assert.equal(lab.sample.ids.length, buildingCount * BUILDING_SIZE);
  assert.equal(new Set(lab.sample.ids).size, lab.sample.ids.length);
  const residents = lab.population.filter((person) => buildings.includes(person.buildingId));
  assert.equal(residents.length, lab.sample.ids.length);
  assert.deepEqual(
    [...lab.sample.ids].sort((a, b) => a - b),
    residents.map((person) => person.id).sort((a, b) => a - b),
  );
  for (const buildingId of buildings) {
    const inBuilding = lab.population.filter((person) => person.buildingId === buildingId);
    assert.equal(inBuilding.length, BUILDING_SIZE);
    assert.ok(inBuilding.every((person) => lab.sample.ids.includes(person.id)));
  }
}

test('cluster n=20 is a census of 1 whole building', () => {
  const lab = mustDraw(createLab({ seed: 42 }), { method: 'cluster', n: 20 });
  assertWholeBuildings(lab, 1);
});

test('cluster n=40 is a census of 2 whole buildings, not a district subsample', () => {
  const lab = mustDraw(createLab({ seed: 42 }), { method: 'cluster', n: 40 });
  assertWholeBuildings(lab, 2);
  const districts = Object.values(lab.sample.districts).filter((count) => count > 0);
  assert.ok(districts.every((count) => count % BUILDING_SIZE === 0));
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

test('stratified n=80 takes exactly 20 people from each district', () => {
  const lab = mustDraw(createLab({ seed: 3 }), { method: 'stratified', n: 80 });
  assert.deepEqual(lab.sample.districts, {
    downtown: 20,
    riverside: 20,
    factory: 20,
    hill: 20,
  });
});

test('convenience samples only the downtown survey-point catchment', () => {
  const lab = mustDraw(createLab({ seed: 42 }), { method: 'convenience', n: 40 });
  assert.deepEqual(lab.sample.surveyPoint, { ...SURVEY_POINT });
  for (const id of lab.sample.ids) {
    const person = lab.population.find((entry) => entry.id === id);
    assert.equal(person.district, 'downtown');
    const dx = person.x - SURVEY_POINT.x;
    const dz = person.z - SURVEY_POINT.z;
    assert.ok(Math.hypot(dx, dz) <= SURVEY_POINT.radius, `person ${id} too far from survey point`);
  }
  const xs = lab.sample.ids.map((id) => lab.population.find((entry) => entry.id === id).x);
  const zs = lab.sample.ids.map((id) => lab.population.find((entry) => entry.id === id).z);
  assert.ok(Math.max(...xs) - Math.min(...xs) < 6);
  assert.ok(Math.max(...zs) - Math.min(...zs) < 6);
});

test('census reports N, μ, σ and theoretical Bias, not a single-trial error labeled Bias', () => {
  let lab = mustDraw(createLab({ seed: 42 }), { method: 'convenience', n: 40 });
  const before = snapshot(lab);
  assert.equal(before.biasTheoretical, null);
  assert.equal(before.censusSd, null);
  assert.equal(before.deviationFromMu, null);

  lab = runCensus(lab).lab;
  const view = snapshot(lab);
  nearly(view.censusMean, 30);
  assert.equal(view.censusN, 400);
  nearly(view.censusSd ** 2, 188);
  nearly(view.biasTheoretical, -18);
  nearly(theoreticalBias('convenience'), -18);
  nearly(theoreticalBias('simple'), 0);
  nearly(theoreticalBias('stratified'), 0);
  nearly(theoreticalBias('cluster'), 0);
  nearly(view.deviationFromMu, lab.sample.mean - 30);
  assert.equal(Object.hasOwn(view, 'bias'), false);
});

test('larger n yields a smaller SRS standard error with the FPC formula', () => {
  const small = mustDraw(createLab({ seed: 11 }), { method: 'simple', n: 16 });
  const large = mustDraw(createLab({ seed: 11 }), { method: 'simple', n: 80 });
  nearly(
    small.sample.se,
    standardError(small.sample.sd, 16, 400),
  );
  nearly(
    large.sample.se,
    standardError(large.sample.sd, 80, 400),
  );
  assert.ok(large.sample.se < small.sample.se);
  assert.ok(large.sample.se < 2.5);
  assert.ok(small.sample.se > 3);
});

test('runBatch k=50 is deterministic and illegal k is refused without mutation', () => {
  const lab = setMethod(createLab({ seed: 42, n: 40 }), 'simple').lab;
  const frozen = serializeLab(lab);

  const bad = runBatch(lab, 7);
  assert.equal(bad.ok, false);
  assert.equal(bad.reason, 'invalid-k');
  assert.equal(serializeLab(bad.lab), frozen);

  const a = runBatch(lab, 50);
  const b = runBatch(lab, 50);
  assert.equal(a.ok, true);
  assert.equal(a.lab.batch.k, 50);
  assert.equal(a.lab.batch.means.length, 50);
  assert.deepEqual(a.lab.batch.means, b.lab.batch.means);
  assert.equal(a.lab.sample, lab.sample);
  assert.ok(a.lab.batch.means.every((mean) => Number.isFinite(mean)));
});

test('batch of 100 convenience means stays biased; SRS batch mean stays near μ', () => {
  const convenience = runBatch(setMethod(createLab({ seed: 8, n: 40 }), 'convenience').lab, 100);
  const simple = runBatch(createLab({ seed: 8, n: 40 }), 100);
  assert.equal(convenience.ok, true);
  assert.equal(simple.ok, true);
  nearly(convenience.lab.batch.meanOfMeans, 12, 2);
  nearly(simple.lab.batch.meanOfMeans, 30, 2);
  assert.ok(convenience.lab.batch.means.every((mean) => mean <= 16));
});

test('cluster batch at n=40 is more spread than SRS; stratified is tighter', () => {
  const seed = 21;
  const n = 40;
  const k = 100;
  const simple = runBatch(createLab({ seed, n }), k).lab.batch.means;
  const stratified = runBatch(setMethod(createLab({ seed, n }), 'stratified').lab, k).lab.batch.means;
  const cluster = runBatch(setMethod(createLab({ seed, n }), 'cluster').lab, k).lab.batch.means;

  const variance = (values) => {
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    return values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1);
  };

  assert.ok(variance(cluster) > variance(simple), 'cluster should spread more than SRS');
  assert.ok(variance(stratified) < variance(simple), 'stratified should be tighter than SRS');
  nearly(simple.reduce((sum, value) => sum + value, 0) / simple.length, 30, 2);
  nearly(stratified.reduce((sum, value) => sum + value, 0) / stratified.length, 30, 1.2);
});

test('compareMethods stores four sampling distributions at the same n', () => {
  const result = compareMethods(createLab({ seed: 5, n: 40 }), 50);
  assert.equal(result.ok, true);
  for (const method of METHODS) {
    assert.equal(result.lab.distributions[method].means.length, 50);
    assert.equal(result.lab.distributions[method].n, 40);
    assert.equal(result.lab.distributions[method].k, 50);
  }
  const again = compareMethods(createLab({ seed: 5, n: 40 }), 50);
  assert.deepEqual(result.lab.distributions.simple.means, again.lab.distributions.simple.means);
});

test('after census, batch Monte Carlo bias is shown separately from this-draw error', () => {
  let lab = setMethod(createLab({ seed: 4, n: 40 }), 'convenience').lab;
  lab = runBatch(lab, 50).lab;
  lab = runCensus(lab).lab;
  const view = snapshot(lab);
  nearly(view.biasTheoretical, -18);
  assert.ok(Math.abs(view.biasMonteCarlo + 18) < 3);
  assert.notEqual(view.biasMonteCarlo, view.deviationFromMu);
});
