export const VOLTAGE_MIN_V = 0;
export const VOLTAGE_MAX_V = 6;
export const RESISTANCE_MIN_OHM = 5;
export const RESISTANCE_MAX_OHM = 50;
export const AMMETER_RANGES_A = Object.freeze([0.3, 3]);
export const VOLTMETER_RANGES_V = Object.freeze([3, 15]);
export const CORRECT_WIRING = 'series-parallel';
export const GRAPH = Object.freeze({
  originX: 38,
  originY: 156,
  width: 264,
  height: 138,
  maxVoltageV: 6,
  maxCurrentA: 1.2,
});

export const DEFAULT_SETUP = Object.freeze({
  voltageV: 1.5,
  resistanceOhm: 10,
  ammeterRangeA: 3,
  voltmeterRangeV: 15,
  wiring: CORRECT_WIRING,
});

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isOption(value, options) {
  return options.includes(value);
}

function round(value) {
  return Number(value.toFixed(8));
}

function sameTrial(first, second) {
  return first.voltageV === second.voltageV && first.resistanceOhm === second.resistanceOhm;
}

export function currentFromOhmLaw(voltageV, resistanceOhm) {
  if (!isFiniteNumber(voltageV) || !isFiniteNumber(resistanceOhm) || resistanceOhm === 0) {
    return null;
  }
  return round(voltageV / resistanceOhm);
}

export function measureCircuit({
  voltageV,
  resistanceOhm,
  ammeterRangeA,
  voltmeterRangeV,
  wiring,
} = {}) {
  if (
    !(isFiniteNumber(voltageV) && voltageV >= VOLTAGE_MIN_V && voltageV <= VOLTAGE_MAX_V)
    || !(isFiniteNumber(resistanceOhm) && resistanceOhm >= RESISTANCE_MIN_OHM && resistanceOhm <= RESISTANCE_MAX_OHM)
    || !isOption(ammeterRangeA, AMMETER_RANGES_A)
    || !isOption(voltmeterRangeV, VOLTMETER_RANGES_V)
  ) {
    return { ok: false, reason: 'invalid-setup' };
  }
  if (wiring === 'ammeter-parallel') return { ok: false, reason: 'short-circuit' };
  if (wiring === 'voltmeter-series') return { ok: false, reason: 'open-circuit' };
  if (wiring !== CORRECT_WIRING) return { ok: false, reason: 'invalid-wiring' };
  if (voltageV > voltmeterRangeV) return { ok: false, reason: 'voltmeter-overload' };

  const currentA = currentFromOhmLaw(voltageV, resistanceOhm);
  if (currentA > ammeterRangeA) return { ok: false, reason: 'ammeter-overload' };
  return {
    ok: true,
    voltageV,
    currentA,
    resistanceOhm,
  };
}

export function recordObservation(trials, setup) {
  const history = Array.isArray(trials) ? trials : [];
  const reading = measureCircuit(setup);
  if (!reading.ok) return { ...reading, trials: history };
  if (history.some((trial) => sameTrial(trial, reading))) {
    return { ok: false, reason: 'already-recorded', trials: history };
  }
  const trial = Object.freeze({
    voltageV: reading.voltageV,
    resistanceOhm: reading.resistanceOhm,
    currentA: reading.currentA,
  });
  return { ok: true, trial, trials: [...history, trial].slice(-100) };
}

export function restoreObservations(saved) {
  const source = saved?.trials ?? saved?.lab?.trials;
  if (!Array.isArray(source)) return [];
  return source.filter((trial) => {
    const reading = measureCircuit({
      voltageV: trial.voltageV,
      resistanceOhm: trial.resistanceOhm,
      ammeterRangeA: 3,
      voltmeterRangeV: 15,
      wiring: CORRECT_WIRING,
    });
    return reading.ok && trial.currentA === reading.currentA;
  }).slice(-100).map(({ voltageV, resistanceOhm, currentA }) => ({
    voltageV,
    resistanceOhm,
    currentA,
  }));
}

function readSetup(raw) {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SETUP };
  const candidate = {
    voltageV: raw.voltageV,
    resistanceOhm: raw.resistanceOhm,
    ammeterRangeA: raw.ammeterRangeA ?? DEFAULT_SETUP.ammeterRangeA,
    voltmeterRangeV: raw.voltmeterRangeV ?? DEFAULT_SETUP.voltmeterRangeV,
    wiring: raw.wiring === 'ammeter-parallel' || raw.wiring === 'voltmeter-series'
      ? CORRECT_WIRING
      : (raw.wiring ?? CORRECT_WIRING),
  };
  const check = measureCircuit(candidate);
  if (check.ok || check.reason === 'ammeter-overload' || check.reason === 'voltmeter-overload') {
    return candidate;
  }
  if (
    isFiniteNumber(candidate.voltageV)
    && candidate.voltageV >= VOLTAGE_MIN_V
    && candidate.voltageV <= VOLTAGE_MAX_V
    && isFiniteNumber(candidate.resistanceOhm)
    && candidate.resistanceOhm >= RESISTANCE_MIN_OHM
    && candidate.resistanceOhm <= RESISTANCE_MAX_OHM
    && isOption(candidate.ammeterRangeA, AMMETER_RANGES_A)
    && isOption(candidate.voltmeterRangeV, VOLTMETER_RANGES_V)
  ) {
    return { ...candidate, wiring: CORRECT_WIRING };
  }
  return { ...DEFAULT_SETUP };
}

export function restoreExperiment(saved) {
  if (!saved || typeof saved !== 'object') {
    return { setup: { ...DEFAULT_SETUP }, history: [] };
  }
  return {
    setup: readSetup(saved.setup),
    history: restoreObservations(saved),
  };
}

export function deriveExperiment(setup, history) {
  const measurement = measureCircuit(setup);
  const theoreticalCurrentA = isFiniteNumber(setup?.voltageV) && isFiniteNumber(setup?.resistanceOhm) && setup.resistanceOhm !== 0
    ? setup.voltageV / setup.resistanceOhm
    : null;
  return {
    setup: { ...setup },
    history: Array.isArray(history) ? history : [],
    theoreticalCurrentA,
    measurement,
    status: measurement.ok ? 'live' : measurement.reason,
  };
}

export function graphPoint(voltageV, currentA) {
  return {
    x: GRAPH.originX + (voltageV / GRAPH.maxVoltageV) * GRAPH.width,
    y: GRAPH.originY - (currentA / GRAPH.maxCurrentA) * GRAPH.height,
  };
}

export function theoryLineEnd(resistanceOhm) {
  const currentA = GRAPH.maxVoltageV / resistanceOhm;
  return graphPoint(GRAPH.maxVoltageV, currentA);
}
