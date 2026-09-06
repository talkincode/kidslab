const REACTION = Object.freeze({
  massBeforeG: 100,
  gasProducedG: 4,
});

export function createLab() {
  return {
    phase: 'prediction',
    prediction: null,
    trials: [],
    conclusion: null,
  };
}

export function runReaction({ vessel } = {}) {
  if (!['open', 'sealed'].includes(vessel)) {
    return { ok: false, reason: 'invalid-vessel' };
  }

  const escapedGasG = vessel === 'open' ? REACTION.gasProducedG : 0;
  return {
    ok: true,
    vessel,
    massBeforeG: REACTION.massBeforeG,
    massAfterG: REACTION.massBeforeG - escapedGasG,
    escapedGasG,
    totalSystemMassG: REACTION.massBeforeG,
  };
}

export function setPrediction(lab, prediction) {
  return {
    ok: ['mass-disappears', 'mass-conserved'].includes(prediction),
    lab: {
      ...lab,
      prediction,
      phase: 'experiment',
    },
  };
}

export function recordTrial(lab, vessel) {
  const trial = runReaction({ vessel });
  if (!trial.ok) {
    return { ...trial, lab };
  }
  if (lab.trials.some((entry) => entry.vessel === vessel)) {
    return { ok: false, reason: 'duplicate-trial', lab };
  }
  return {
    ok: true,
    lab: {
      ...lab,
      phase: lab.trials.length === 0 ? 'experiment' : 'conclusion',
      trials: [...lab.trials, trial],
    },
  };
}

export function setConclusion(lab, conclusion) {
  if (lab.trials.length < 2) {
    return { ok: false, reason: 'need-comparison', lab };
  }
  if (conclusion !== 'mass-conserved') {
    return {
      ok: false,
      reason: 'wrong-conclusion',
      lab: { ...lab, conclusion },
    };
  }
  return {
    ok: true,
    lab: {
      ...lab,
      conclusion,
      phase: 'complete',
    },
  };
}
