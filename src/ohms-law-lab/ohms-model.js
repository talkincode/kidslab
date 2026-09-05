export const VOLTAGES_V = Object.freeze([1.5, 3, 4.5, 6]);
export const RESISTANCES_OHM = Object.freeze([10, 20]);
export const AMMETER_RANGES_A = Object.freeze([0.3, 3]);
export const VOLTMETER_RANGES_V = Object.freeze([3, 15]);
export const CORRECT_WIRING = 'series-parallel';

const PREDICTIONS = new Set(['current-rises', 'current-falls']);
const CONCLUSIONS = new Set(['higher-resistance-lower-slope', 'same-slope']);

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isOption(value, options) {
  return options.includes(value);
}

function round(value) {
  return Number(value.toFixed(8));
}

function hasCurve(lab, resistanceOhm) {
  return new Set(
    lab.trials
      .filter((trial) => trial.resistanceOhm === resistanceOhm)
      .map((trial) => trial.voltageV),
  ).size >= 2;
}

function phaseFor(lab) {
  if (!lab.prediction) return 'predict';
  if (!hasCurve(lab, 10)) return 'measure-10';
  if (!hasCurve(lab, 20)) return 'measure-20';
  if (!lab.conclusion) return 'conclude';
  if (!lab.designComplete) return 'design';
  return 'complete';
}

function withPhase(lab) {
  return { ...lab, phase: phaseFor(lab) };
}

function sameTrial(first, second) {
  return first.voltageV === second.voltageV && first.resistanceOhm === second.resistanceOhm;
}

function validTrial(trial) {
  return trial
    && isOption(trial.voltageV, VOLTAGES_V)
    && isOption(trial.resistanceOhm, RESISTANCES_OHM)
    && isFiniteNumber(trial.currentA)
    && round(trial.currentA) === round(trial.voltageV / trial.resistanceOhm);
}

export function createLab() {
  return {
    version: 1,
    prediction: null,
    trials: [],
    conclusion: null,
    designComplete: false,
    phase: 'predict',
  };
}

export function measureCircuit({
  voltageV,
  resistanceOhm,
  ammeterRangeA,
  voltmeterRangeV,
  wiring,
} = {}) {
  if (
    !isOption(voltageV, VOLTAGES_V)
    || !isOption(resistanceOhm, RESISTANCES_OHM)
    || !isOption(ammeterRangeA, AMMETER_RANGES_A)
    || !isOption(voltmeterRangeV, VOLTMETER_RANGES_V)
  ) {
    return { ok: false, reason: 'invalid-setup' };
  }
  if (wiring === 'ammeter-parallel') return { ok: false, reason: 'short-circuit' };
  if (wiring === 'voltmeter-series') return { ok: false, reason: 'open-circuit' };
  if (wiring !== CORRECT_WIRING) return { ok: false, reason: 'invalid-wiring' };
  if (voltageV > voltmeterRangeV) return { ok: false, reason: 'voltmeter-overload' };

  const currentA = round(voltageV / resistanceOhm);
  if (currentA > ammeterRangeA) return { ok: false, reason: 'ammeter-overload' };
  return {
    ok: true,
    voltageV,
    currentA,
    resistanceOhm,
  };
}

export function setPrediction(lab, prediction) {
  if (!lab || !PREDICTIONS.has(prediction)) return { ok: false, reason: 'invalid-prediction', lab };
  return { ok: true, lab: withPhase({ ...lab, prediction }) };
}

export function recordTrial(lab, setup) {
  if (!lab) return { ok: false, reason: 'invalid-lab', lab };
  const measured = measureCircuit(setup);
  if (!measured.ok) return { ...measured, lab };
  const expectedResistance = lab.phase === 'measure-10' ? 10 : lab.phase === 'measure-20' ? 20 : null;
  if (expectedResistance === null) return { ok: false, reason: 'phase-not-ready', lab };
  if (measured.resistanceOhm !== expectedResistance) {
    return { ok: false, reason: 'wrong-resistor', lab };
  }
  if (lab.trials.some((trial) => sameTrial(trial, measured))) {
    return { ok: false, reason: 'already-recorded', lab };
  }
  const trial = Object.freeze({
    voltageV: measured.voltageV,
    currentA: measured.currentA,
    resistanceOhm: measured.resistanceOhm,
  });
  return { ok: true, trial, lab: withPhase({ ...lab, trials: [...lab.trials, trial] }) };
}

export function curvesFor(lab) {
  if (!lab || !Array.isArray(lab.trials)) return [];
  return RESISTANCES_OHM.map((resistanceOhm) => ({
    resistanceOhm,
    points: lab.trials
      .filter((trial) => trial.resistanceOhm === resistanceOhm)
      .sort((first, second) => first.voltageV - second.voltageV),
  })).filter((curve) => curve.points.length > 0);
}

export function setConclusion(lab, conclusion) {
  if (!lab || !CONCLUSIONS.has(conclusion)) return { ok: false, reason: 'invalid-conclusion', lab };
  if (!hasCurve(lab, 10) || !hasCurve(lab, 20)) return { ok: false, reason: 'need-two-curves', lab };
  if (conclusion !== 'higher-resistance-lower-slope') {
    return { ok: false, reason: 'wrong-conclusion', lab };
  }
  return { ok: true, lab: withPhase({ ...lab, conclusion }) };
}

export function testDesign(lab, setup) {
  if (!lab || !lab.conclusion) return { ok: false, reason: 'need-conclusion', lab };
  const measured = measureCircuit(setup);
  if (!measured.ok) return { ...measured, lab };
  if (measured.resistanceOhm !== 20 || measured.currentA !== 0.3) {
    return { ok: false, reason: 'target-missed', lab, measured };
  }
  return { ok: true, measured, lab: withPhase({ ...lab, designComplete: true }) };
}

export function restoreLab(saved) {
  if (!saved || saved.version !== 1 || !Array.isArray(saved.trials)) return null;
  let lab = createLab();
  if (saved.prediction) {
    const predicted = setPrediction(lab, saved.prediction);
    if (!predicted.ok) return null;
    lab = predicted.lab;
  }
  for (const trial of saved.trials) {
    if (!validTrial(trial)) return null;
    const result = recordTrial(lab, {
      voltageV: trial.voltageV,
      resistanceOhm: trial.resistanceOhm,
      ammeterRangeA: 3,
      voltmeterRangeV: 15,
      wiring: CORRECT_WIRING,
    });
    if (!result.ok) return null;
    lab = result.lab;
  }
  if (saved.conclusion) {
    const concluded = setConclusion(lab, saved.conclusion);
    if (!concluded.ok) return null;
    lab = concluded.lab;
  }
  if (saved.designComplete) {
    const designed = testDesign(lab, {
      voltageV: 6,
      resistanceOhm: 20,
      ammeterRangeA: 3,
      voltmeterRangeV: 15,
      wiring: CORRECT_WIRING,
    });
    if (!designed.ok) return null;
    lab = designed.lab;
  }
  return lab;
}
