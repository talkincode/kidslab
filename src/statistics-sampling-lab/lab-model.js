/* ============================================================
   抽样统计实验室纯模型 · 无 DOM / 无 three
   星河城 400 名居民的通勤时间（分钟）。四区均值固定为
   12 / 24 / 36 / 48，全市均值精确为 30。抽样用显式种子，
   同一 seed + drawCount + method + n 得到同一批人。
   ============================================================ */

export const POPULATION_N = 400;
export const DISTRICT_SIZE = 100;
export const Z95 = 1.96;
export const L4_BAND = 2;

export const METHODS = Object.freeze(['simple', 'stratified', 'cluster', 'convenience']);

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
    for (let i = 0; i < DISTRICT_SIZE; i += 1) {
      people.push(Object.freeze({
        id: districtIndex * DISTRICT_SIZE + i,
        district,
        value: base + 2 * (i % 5),
      }));
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

function summarizePeople(people, method, n, cluster = null) {
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
    cluster,
  };
}

function freezeLab(lab) {
  return {
    ...lab,
    population: lab.population,
    sample: lab.sample
      ? Object.freeze({
        ...lab.sample,
        ids: Object.freeze([...(lab.sample.ids ?? [])]),
        districts: Object.freeze({ ...emptyDistricts(), ...(lab.sample.districts ?? {}) }),
      })
      : null,
    census: lab.census ? Object.freeze({ ...lab.census }) : null,
    trials: Object.freeze((lab.trials ?? []).map((trial) => Object.freeze({
      ...trial,
      ids: Object.freeze([...(trial.ids ?? [])]),
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
    trials: Array.isArray(partial.trials) ? partial.trials.map((trial) => ({ ...trial })) : [],
    phase: partial.phase === 'complete' ? 'complete' : 'observe',
    lastReason: partial.lastReason ?? null,
  });
}

export function snapshot(lab) {
  if (!lab) return null;
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
    cluster: lab.sample?.cluster ?? null,
    censusMean: lab.census?.mean ?? null,
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

export function drawSample(lab) {
  if (!lab) return fail(lab, 'invalid-lab');
  if (!METHODS.includes(lab.method)) return fail(withReason(lab, 'invalid-method'), 'invalid-method');
  if (!isFiniteNumber(lab.n) || lab.n < LIMITS.n[0] || lab.n > LIMITS.n[1]) {
    return fail(withReason(lab, 'out-of-range-n'), 'out-of-range-n');
  }
  if (lab.n % 4 !== 0) return fail(withReason(lab, 'n-not-stratifiable'), 'n-not-stratifiable');

  const rng = rngFor(lab);
  const n = lab.n;
  let picked;
  let cluster = null;

  if (lab.method === 'simple') {
    picked = pickMany(lab.population, n, rng);
  } else if (lab.method === 'convenience') {
    const pool = lab.population.filter((person) => person.district === 'downtown');
    if (n > pool.length) return fail(withReason(lab, 'n-too-large'), 'n-too-large');
    picked = pickMany(pool, n, rng);
  } else if (lab.method === 'stratified') {
    const per = n / 4;
    picked = [];
    for (const district of DISTRICT_IDS) {
      const pool = lab.population.filter((person) => person.district === district);
      picked.push(...pickMany(pool, per, rng));
    }
  } else if (lab.method === 'cluster') {
    cluster = DISTRICT_IDS[Math.floor(rng() * DISTRICT_IDS.length)];
    const pool = lab.population.filter((person) => person.district === cluster);
    if (n > pool.length) return fail(withReason(lab, 'n-too-large'), 'n-too-large');
    picked = pickMany(pool, n, rng);
  } else {
    return fail(withReason(lab, 'invalid-method'), 'invalid-method');
  }

  const sample = {
    ...summarizePeople(picked, lab.method, n, cluster),
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
  const next = withPhase({
    ...lab,
    census: { mean, n: POPULATION_N, revealed: true },
    lastReason: null,
  });
  return { ok: true, lab: next };
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
