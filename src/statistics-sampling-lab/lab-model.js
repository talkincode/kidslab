/* ============================================================
   抽样统计实验室纯模型 · 无 DOM / 无 three
   星河城 400 名居民的通勤时间（分钟）。四区均值固定为
   12 / 24 / 36 / 48，全市均值精确为 30。抽样用显式种子，
   同一 seed + drawCount + method + n 得到同一批人。
   ============================================================ */

export const POPULATION_N = 400;
export const DISTRICT_SIZE = 100;
export const BUILDING_SIZE = 20;
export const BUILDINGS_PER_DISTRICT = 5;
export const Z95 = 1.96;
export const L4_BAND = 2;
export const BATCH_K = Object.freeze([50, 100]);

export const METHODS = Object.freeze(['simple', 'stratified', 'cluster', 'convenience']);

export const SURVEY_POINT = Object.freeze({
  x: 1.15,
  z: 1.15,
  radius: 6,
});

export const LIMITS = Object.freeze({
  n: Object.freeze([8, 80]),
});

export const DEFAULTS = Object.freeze({
  seed: 42,
  n: 40,
  method: 'simple',
});

export const DISTRICT_MEANS = Object.freeze({
  downtown: 12,
  riverside: 24,
  factory: 36,
  hill: 48,
});

const DISTRICT_BASE = Object.freeze({
  downtown: 8,
  riverside: 20,
  factory: 32,
  hill: 44,
});

export const DISTRICT_IDS = Object.freeze(['downtown', 'riverside', 'factory', 'hill']);

const DISTRICT_LAYOUT = Object.freeze({
  downtown: Object.freeze({ ox: 3.15, oz: 3.15 }),
  riverside: Object.freeze({ ox: -3.15, oz: 3.15 }),
  factory: Object.freeze({ ox: -3.15, oz: -3.15 }),
  hill: Object.freeze({ ox: 3.15, oz: -3.15 }),
});

const BUILDING_SPOTS = Object.freeze([
  Object.freeze([-1.7, -1.55]),
  Object.freeze([1.65, -1.5]),
  Object.freeze([-1.6, 1.55]),
  Object.freeze([1.62, 1.58]),
  Object.freeze([0.05, 0.08]),
]);

// Offsets from DISTRICT_BASE. Five buildings × 20 people; district mean stays base+4.
const BUILDING_OFFSET_MIXES = Object.freeze([
  Object.freeze([0, 2, 4, 6, 0, 2, 4, 6, 0, 2, 4, 0, 2, 4, 0, 2, 0, 2, 0, 0]),
  Object.freeze([0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 0, 2, 0, 2, 0, 2, 4]),
  Object.freeze([0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 6, 8, 0, 2, 4, 6, 8]),
  Object.freeze([8, 6, 4, 2, 0, 8, 6, 4, 2, 0, 8, 6, 4, 8, 6, 8, 6, 8, 6, 4]),
  Object.freeze([8, 6, 4, 2, 8, 6, 4, 8, 6, 4, 8, 6, 8, 6, 8, 6, 8, 2, 8, 4]),
]);

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function fail(lab, reason) {
  return { ok: false, reason, lab };
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function methodIndex(method) {
  const index = METHODS.indexOf(method);
  return index < 0 ? 0 : index;
}

export function sampleMean(values) {
  if (!Array.isArray(values) || values.length === 0) return NaN;
  let sum = 0;
  for (const value of values) sum += value;
  return sum / values.length;
}

export function sampleSd(values) {
  if (!Array.isArray(values) || values.length < 2) return 0;
  const mean = sampleMean(values);
  let ss = 0;
  for (const value of values) {
    const d = value - mean;
    ss += d * d;
  }
  return Math.sqrt(ss / (values.length - 1));
}

export function standardError(sd, n, N = POPULATION_N) {
  if (!isFiniteNumber(sd) || sd < 0 || !isFiniteNumber(n) || !isFiniteNumber(N)) return NaN;
  if (n < 2 || N <= 1) return NaN;
  if (n >= N) return 0;
  return (sd / Math.sqrt(n)) * Math.sqrt((N - n) / (N - 1));
}

export function populationSd(people) {
  const values = (people ?? POPULATION).map((person) => person.value);
  if (values.length === 0) return NaN;
  const mean = sampleMean(values);
  let ss = 0;
  for (const value of values) {
    const d = value - mean;
    ss += d * d;
  }
  return Math.sqrt(ss / values.length);
}

export function theoreticalBias(method) {
  if (method === 'convenience') return DISTRICT_MEANS.downtown - 30;
  if (METHODS.includes(method)) return 0;
  return NaN;
}

function distanceToSurvey(person) {
  return Math.hypot(person.x - SURVEY_POINT.x, person.z - SURVEY_POINT.z);
}

function inSurveyCatchment(person) {
  return person.district === 'downtown' && distanceToSurvey(person) <= SURVEY_POINT.radius;
}

function emptyDistricts() {
  return { downtown: 0, riverside: 0, factory: 0, hill: 0 };
}

function countDistricts(people) {
  const counts = emptyDistricts();
  for (const person of people) counts[person.district] += 1;
  return counts;
}

export function buildPopulation() {
  const people = [];
  DISTRICT_IDS.forEach((district, districtIndex) => {
    const base = DISTRICT_BASE[district];
    const layout = DISTRICT_LAYOUT[district];
    for (let building = 0; building < BUILDINGS_PER_DISTRICT; building += 1) {
      const mix = BUILDING_OFFSET_MIXES[building];
      const [sx, sz] = BUILDING_SPOTS[building];
      for (let slot = 0; slot < BUILDING_SIZE; slot += 1) {
        const localIndex = building * BUILDING_SIZE + slot;
        const angle = slot * 0.55;
        people.push(Object.freeze({
          id: districtIndex * DISTRICT_SIZE + localIndex,
          district,
          buildingId: districtIndex * BUILDINGS_PER_DISTRICT + building,
          value: base + mix[slot],
          x: layout.ox + sx + 0.22 * Math.cos(angle),
          z: layout.oz + sz + 0.22 * Math.sin(angle),
        }));
      }
    }
  });
  return Object.freeze(people);
}

const POPULATION = buildPopulation();

export function censusMean(lab) {
  const people = lab?.population ?? POPULATION;
  return sampleMean(people.map((person) => person.value));
}

function pickMany(pool, n, rng) {
  const copy = pool.slice();
  const picked = [];
  for (let i = 0; i < n; i += 1) {
    const j = i + Math.floor(rng() * (copy.length - i));
    const swap = copy[j];
    copy[j] = copy[i];
    copy[i] = swap;
    picked.push(copy[i]);
  }
  return picked;
}

function summarizePeople(people, method, n, extra = {}) {
  const values = people.map((person) => person.value);
  const mean = sampleMean(values);
  const sd = sampleSd(values);
  const se = standardError(sd, n, POPULATION_N);
  return {
    method,
    n,
    ids: people.map((person) => person.id),
    districts: countDistricts(people),
    mean,
    sd,
    se,
    lo: mean - Z95 * se,
    hi: mean + Z95 * se,
    buildings: extra.buildings ?? [],
    surveyPoint: extra.surveyPoint ?? null,
    cluster: extra.cluster ?? null,
  };
}

function freezeBatch(batch) {
  if (!batch) return null;
  return Object.freeze({
    ...batch,
    means: Object.freeze([...(batch.means ?? [])]),
  });
}

function freezeDistributions(distributions) {
  const next = {};
  for (const method of METHODS) {
    if (distributions?.[method]) next[method] = freezeBatch(distributions[method]);
  }
  return Object.freeze(next);
}

function freezeLab(lab) {
  return {
    ...lab,
    population: lab.population,
    sample: lab.sample
      ? Object.freeze({
        ...lab.sample,
        ids: Object.freeze([...(lab.sample.ids ?? [])]),
        buildings: Object.freeze([...(lab.sample.buildings ?? [])]),
        districts: Object.freeze({ ...emptyDistricts(), ...(lab.sample.districts ?? {}) }),
        surveyPoint: lab.sample.surveyPoint ? Object.freeze({ ...lab.sample.surveyPoint }) : null,
      })
      : null,
    census: lab.census ? Object.freeze({ ...lab.census }) : null,
    batch: freezeBatch(lab.batch),
    distributions: freezeDistributions(lab.distributions),
    trials: Object.freeze((lab.trials ?? []).map((trial) => Object.freeze({
      ...trial,
      ids: Object.freeze([...(trial.ids ?? [])]),
      buildings: Object.freeze([...(trial.buildings ?? [])]),
      districts: Object.freeze({ ...emptyDistricts(), ...(trial.districts ?? {}) }),
    }))),
  };
}

function withReason(lab, lastReason) {
  return freezeLab({ ...lab, lastReason });
}

function isComplete(lab) {
  if (!lab.census) return false;
  const hasConvenience = lab.trials.some((trial) => trial.method === 'convenience');
  const hasStratified = lab.trials.some((trial) => trial.method === 'stratified');
  const hit = lab.trials.some((trial) => Math.abs(trial.mean - lab.census.mean) < L4_BAND);
  return hasConvenience && hasStratified && hit;
}

function withPhase(lab) {
  return freezeLab({
    ...lab,
    phase: isComplete(lab) ? 'complete' : 'observe',
  });
}

export function createLab(partial = {}) {
  const seed = isFiniteNumber(partial.seed) ? (partial.seed >>> 0) : DEFAULTS.seed;
  const n = isFiniteNumber(partial.n) ? partial.n : DEFAULTS.n;
  const method = METHODS.includes(partial.method) ? partial.method : DEFAULTS.method;
  return withPhase({
    version: 1,
    seed,
    n,
    method,
    drawCount: isFiniteNumber(partial.drawCount) ? partial.drawCount : 0,
    population: POPULATION,
    sample: partial.sample ? { ...partial.sample } : null,
    census: partial.census ? { ...partial.census } : null,
    batch: partial.batch ? { ...partial.batch, means: [...(partial.batch.means ?? [])] } : null,
    distributions: partial.distributions ? { ...partial.distributions } : {},
    trials: Array.isArray(partial.trials) ? partial.trials.map((trial) => ({ ...trial })) : [],
    phase: partial.phase === 'complete' ? 'complete' : 'observe',
    lastReason: partial.lastReason ?? null,
  });
}

export function snapshot(lab) {
  if (!lab) return null;
  const censusMeanValue = lab.census?.mean ?? null;
  const batch = lab.batch && lab.batch.method === lab.method
    ? lab.batch
    : lab.distributions?.[lab.method] ?? null;
  return {
    seed: lab.seed,
    method: lab.method,
    n: lab.n,
    mean: lab.sample?.mean ?? null,
    sd: lab.sample?.sd ?? null,
    se: lab.sample?.se ?? null,
    lo: lab.sample?.lo ?? null,
    hi: lab.sample?.hi ?? null,
    sampledIds: lab.sample?.ids ?? [],
    districts: lab.sample?.districts ?? emptyDistricts(),
    buildings: lab.sample?.buildings ?? [],
    surveyPoint: lab.sample?.surveyPoint ?? null,
    cluster: lab.sample?.cluster ?? null,
    censusN: lab.census?.n ?? null,
    censusMean: censusMeanValue,
    censusSd: lab.census?.sd ?? null,
    biasTheoretical: lab.census ? theoreticalBias(lab.method) : null,
    biasMonteCarlo: lab.census && batch ? batch.meanOfMeans - censusMeanValue : null,
    deviationFromMu: lab.census && lab.sample ? lab.sample.mean - censusMeanValue : null,
    batch,
    distributions: lab.distributions,
    trials: lab.trials,
    trialCount: lab.trials.length,
    phase: lab.phase,
    complete: lab.phase === 'complete',
    ready: Boolean(lab.sample),
  };
}

export function setMethod(lab, method) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!METHODS.includes(method)) return fail(withReason(lab, 'invalid-method'), 'invalid-method');
  return { ok: true, lab: withReason({ ...lab, method }, null) };
}

export function setN(lab, n) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!isFiniteNumber(n)) return fail(withReason(lab, 'invalid-n'), 'invalid-n');
  if (n < LIMITS.n[0] || n > LIMITS.n[1]) {
    return fail(withReason(lab, 'out-of-range-n'), 'out-of-range-n');
  }
  if (n % 4 !== 0) return fail(withReason(lab, 'n-not-stratifiable'), 'n-not-stratifiable');
  return { ok: true, lab: withReason({ ...lab, n }, null) };
}

function rngFor(lab) {
  const seed = (lab.seed + lab.drawCount * 10007 + methodIndex(lab.method) * 9176 + lab.n * 13) >>> 0;
  return mulberry32(seed);
}

function rngForBatch(lab, trialIndex) {
  const seed = (lab.seed + 0xc0ffee + trialIndex * 10007 + methodIndex(lab.method) * 9176 + lab.n * 13) >>> 0;
  return mulberry32(seed);
}

function buildingIds() {
  const ids = [];
  for (let id = 0; id < DISTRICT_IDS.length * BUILDINGS_PER_DISTRICT; id += 1) ids.push(id);
  return ids;
}

function groupsOfSize(population, size) {
  const groups = [];
  for (const district of DISTRICT_IDS) {
    const residents = population.filter((person) => person.district === district);
    for (let start = 0; start + size <= residents.length; start += size) {
      groups.push(residents.slice(start, start + size));
    }
  }
  return groups;
}

function pickCluster(population, n, rng) {
  const k = n <= BUILDING_SIZE ? 1 : 2;
  const size = n / k;
  if (!Number.isInteger(size) || size < 4) return { error: 'n-not-stratifiable' };

  if (size === BUILDING_SIZE) {
    const chosen = pickMany(buildingIds(), k, rng);
    const picked = population.filter((person) => chosen.includes(person.buildingId));
    return { picked, buildings: chosen, cluster: chosen.slice().sort((a, b) => a - b).join(',') };
  }

  const groups = groupsOfSize(population, size);
  if (groups.length < k) return { error: 'n-too-large' };
  const chosenGroups = pickMany(groups, k, rng);
  const picked = chosenGroups.flat();
  const fully = [];
  for (const id of new Set(picked.map((person) => person.buildingId))) {
    const residents = population.filter((person) => person.buildingId === id);
    if (residents.every((person) => picked.some((entry) => entry.id === person.id))) {
      fully.push(id);
    }
  }
  return { picked, buildings: fully, cluster: fully.slice().sort((a, b) => a - b).join(',') };
}

function pickPeople(lab, rng) {
  const n = lab.n;
  if (lab.method === 'simple') {
    return { picked: pickMany(lab.population, n, rng), buildings: [], cluster: null, surveyPoint: null };
  }
  if (lab.method === 'convenience') {
    const pool = lab.population.filter(inSurveyCatchment);
    if (n > pool.length) return { error: 'n-too-large' };
    return {
      picked: pickMany(pool, n, rng),
      buildings: [],
      cluster: null,
      surveyPoint: { ...SURVEY_POINT },
    };
  }
  if (lab.method === 'stratified') {
    const per = n / 4;
    const picked = [];
    for (const district of DISTRICT_IDS) {
      const pool = lab.population.filter((person) => person.district === district);
      picked.push(...pickMany(pool, per, rng));
    }
    return { picked, buildings: [], cluster: null, surveyPoint: null };
  }
  if (lab.method === 'cluster') {
    const drawn = pickCluster(lab.population, n, rng);
    if (drawn.error) return drawn;
    return { ...drawn, surveyPoint: null };
  }
  return { error: 'invalid-method' };
}

function validateDraw(lab) {
  if (!lab) return 'invalid-lab';
  if (!METHODS.includes(lab.method)) return 'invalid-method';
  if (!isFiniteNumber(lab.n) || lab.n < LIMITS.n[0] || lab.n > LIMITS.n[1]) return 'out-of-range-n';
  if (lab.n % 4 !== 0) return 'n-not-stratifiable';
  return null;
}

export function drawSample(lab) {
  const reason = validateDraw(lab);
  if (reason === 'invalid-lab') return fail(lab, reason);
  if (reason) return fail(withReason(lab, reason), reason);

  const drawn = pickPeople(lab, rngFor(lab));
  if (drawn.error) return fail(withReason(lab, drawn.error), drawn.error);

  const sample = {
    ...summarizePeople(drawn.picked, lab.method, lab.n, drawn),
    drawId: lab.drawCount + 1,
  };

  return {
    ok: true,
    lab: withReason({
      ...lab,
      sample,
      drawCount: lab.drawCount + 1,
    }, null),
  };
}

export function runCensus(lab) {
  if (!lab) return fail(lab, 'invalid-lab');
  const mean = censusMean(lab);
  const sd = populationSd(lab.population);
  const next = withPhase({
    ...lab,
    census: { mean, sd, n: POPULATION_N, revealed: true },
    lastReason: null,
  });
  return { ok: true, lab: next };
}

function makeBatch(lab, k, rngAt) {
  const means = [];
  for (let i = 0; i < k; i += 1) {
    const drawn = pickPeople(lab, rngAt(i));
    if (drawn.error) return { error: drawn.error };
    means.push(sampleMean(drawn.picked.map((person) => person.value)));
  }
  const meanOfMeans = sampleMean(means);
  return {
    k,
    method: lab.method,
    n: lab.n,
    means,
    meanOfMeans,
    mcBias: meanOfMeans - censusMean(lab),
  };
}

export function runBatch(lab, k) {
  const reason = validateDraw(lab);
  if (reason === 'invalid-lab') return fail(lab, reason);
  if (reason) return fail(withReason(lab, reason), reason);
  if (k !== 50 && k !== 100) return fail(withReason(lab, 'invalid-k'), 'invalid-k');

  const batch = makeBatch(lab, k, (index) => rngForBatch(lab, index));
  if (batch.error) return fail(withReason(lab, batch.error), batch.error);

  return {
    ok: true,
    lab: withReason({
      ...lab,
      batch,
      distributions: { ...(lab.distributions ?? {}), [lab.method]: batch },
    }, null),
  };
}

export function compareMethods(lab, k) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (k !== 50 && k !== 100) return fail(withReason(lab, 'invalid-k'), 'invalid-k');
  if (!isFiniteNumber(lab.n) || lab.n < LIMITS.n[0] || lab.n > LIMITS.n[1]) {
    return fail(withReason(lab, 'out-of-range-n'), 'out-of-range-n');
  }
  if (lab.n % 4 !== 0) return fail(withReason(lab, 'n-not-stratifiable'), 'n-not-stratifiable');

  const distributions = { ...(lab.distributions ?? {}) };
  for (const method of METHODS) {
    const slice = { ...lab, method };
    const batch = makeBatch(slice, k, (index) => rngForBatch(slice, index));
    if (batch.error) return fail(withReason(lab, batch.error), batch.error);
    distributions[method] = batch;
  }

  return {
    ok: true,
    lab: withReason({
      ...lab,
      batch: distributions[lab.method],
      distributions,
    }, null),
  };
}

export function recordTrial(lab) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!lab.sample) return fail(withReason(lab, 'no-sample'), 'no-sample');
  if (lab.trials.some((trial) => trial.drawId === lab.sample.drawId)) {
    return fail(withReason(lab, 'duplicate'), 'duplicate');
  }
  const trial = {
    drawId: lab.sample.drawId,
    method: lab.sample.method,
    n: lab.sample.n,
    mean: lab.sample.mean,
    sd: lab.sample.sd,
    se: lab.sample.se,
    lo: lab.sample.lo,
    hi: lab.sample.hi,
    districts: { ...lab.sample.districts },
    cluster: lab.sample.cluster,
    buildings: [...(lab.sample.buildings ?? [])],
    surveyPoint: lab.sample.surveyPoint ? { ...lab.sample.surveyPoint } : null,
    ids: [...lab.sample.ids],
  };
  const next = withPhase({
    ...lab,
    trials: [...lab.trials, trial],
    lastReason: null,
  });
  return { ok: true, lab: next };
}

export function resetLab(lab) {
  if (!lab) return fail(lab, 'invalid-lab');
  return {
    ok: true,
    lab: createLab({ seed: lab.seed, n: lab.n, method: lab.method }),
  };
}

export function serializeLab(lab) {
  return JSON.stringify({
    version: 1,
    seed: lab.seed,
    n: lab.n,
    method: lab.method,
    drawCount: lab.drawCount,
    sample: lab.sample,
    census: lab.census,
    batch: lab.batch,
    distributions: lab.distributions,
    trials: lab.trials,
    phase: lab.phase,
  });
}

export function parseLab(raw) {
  if (raw == null) return createLab();
  let data = raw;
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw);
    } catch {
      return createLab();
    }
  }
  if (!data || typeof data !== 'object' || data.version !== 1) return createLab();
  if (!Array.isArray(data.trials)) return createLab();
  return createLab(data);
}
