const PH_MIN = 0;
const PH_MAX = 14;
const NEUTRAL_PH = 7;
const NEUTRAL_EPS = 0.05;

export const SAMPLES = Object.freeze([
  Object.freeze({ id: 'lemon', ph: 2.0 }),
  Object.freeze({ id: 'cola', ph: 2.5 }),
  Object.freeze({ id: 'vinegar', ph: 2.9 }),
  Object.freeze({ id: 'coffee', ph: 5.0 }),
  Object.freeze({ id: 'milk', ph: 6.6 }),
  Object.freeze({ id: 'water', ph: 7.0 }),
  Object.freeze({ id: 'seawater', ph: 8.1 }),
  Object.freeze({ id: 'soda', ph: 9.0 }),
  Object.freeze({ id: 'soap', ph: 10.0 }),
  Object.freeze({ id: 'ammonia', ph: 11.5 }),
  Object.freeze({ id: 'bleach', ph: 12.6 }),
]);

export const INDICATOR_STOPS = Object.freeze({
  universal: Object.freeze([
    [0, '#e5243b'], [2, '#f04a1e'], [4, '#f9a825'], [6, '#c0ca33'],
    [7, '#4caf50'], [8, '#26a69a'], [10, '#2196f3'], [12, '#3f51b5'], [14, '#6a1b9a'],
  ]),
  litmus: Object.freeze([
    [0, '#e5484d'], [5, '#e5484d'], [6.5, '#9a6bd0'], [8, '#3b6fd4'], [14, '#3b6fd4'],
  ]),
  phenol: Object.freeze([
    [0, '#dff3f8'], [8, '#dff3f8'], [9, '#ff8fc0'], [10, '#f0409a'], [14, '#e01e86'],
  ]),
});

const SAMPLE_BY_ID = new Map(SAMPLES.map((sample) => [sample.id, sample]));

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
}

function rgbToHex(rgb) {
  return `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function mixHex(from, to, t) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex(a.map((channel, i) => Math.round(channel + (b[i] - channel) * t)));
}

function snapshot(lab) {
  return {
    ph: lab.ph,
    indicator: lab.indicator,
    sampleId: lab.sampleId,
    seen: { ...lab.seen },
    complete: lab.complete,
  };
}

function withSeen(lab, flag) {
  const seen = { ...lab.seen, [flag]: true };
  const complete = Boolean(seen.sample && seen.indicator && seen.colorChange);
  return { ...lab, seen, complete: lab.complete || complete };
}

export function createLab() {
  return {
    ph: NEUTRAL_PH,
    indicator: 'universal',
    sampleId: 'water',
    seen: { sample: false, indicator: false, colorChange: false },
    complete: false,
  };
}

export function clampPh(ph) {
  if (!Number.isFinite(ph)) return null;
  return Math.min(PH_MAX, Math.max(PH_MIN, ph));
}

export function interpolateIndicatorColor(ph, indicatorId) {
  const stops = INDICATOR_STOPS[indicatorId];
  if (!stops) return null;
  const value = clampPh(ph);
  if (value == null) return null;
  if (value <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i += 1) {
    const [p1, c1] = stops[i];
    if (value <= p1) {
      const [p0, c0] = stops[i - 1];
      if (p1 === p0) return c1;
      return mixHex(c0, c1, (value - p0) / (p1 - p0));
    }
  }
  return stops[stops.length - 1][1];
}

export function classifyPh(ph) {
  if (!Number.isFinite(ph)) return null;
  if (Math.abs(ph - NEUTRAL_PH) < NEUTRAL_EPS) return 'neutral';
  if (ph < 3) return 'more-acidic';
  if (ph < NEUTRAL_PH) return 'acidic';
  if (ph <= 11) return 'basic';
  return 'more-basic';
}

export function estimateHydroniumMolPerL(ph) {
  if (!Number.isFinite(ph)) return null;
  return 10 ** (-ph);
}

export function formatHydronium(ph) {
  const molPerL = estimateHydroniumMolPerL(ph);
  if (molPerL == null) return null;
  const exp = -ph;
  const exponent = Math.floor(exp);
  const mantissa = 10 ** (exp - exponent);
  return {
    molPerL,
    mantissa: mantissa.toFixed(1),
    exponent,
  };
}

export function selectSample(lab, sampleId) {
  const sample = SAMPLE_BY_ID.get(sampleId);
  if (!sample) {
    return { ok: false, reason: 'unknown-sample', lab };
  }
  return {
    ok: true,
    lab: withSeen({
      ...snapshot(lab),
      sampleId: sample.id,
      ph: sample.ph,
    }, 'sample'),
  };
}

export function setPh(lab, ph) {
  if (!Number.isFinite(ph)) {
    return { ok: false, reason: 'invalid-ph', lab };
  }
  if (ph < PH_MIN || ph > PH_MAX) {
    return { ok: false, reason: 'ph-out-of-range', lab };
  }
  return {
    ok: true,
    lab: {
      ...snapshot(lab),
      ph,
      sampleId: null,
    },
  };
}

export function setIndicator(lab, indicatorId) {
  if (!INDICATOR_STOPS[indicatorId]) {
    return { ok: false, reason: 'unknown-indicator', lab };
  }
  const next = withSeen({
    ...snapshot(lab),
    indicator: indicatorId,
  }, 'indicator');
  return { ok: true, lab: next };
}

export function dropIndicator(lab) {
  if (!INDICATOR_STOPS[lab.indicator]) {
    return { ok: false, reason: 'unknown-indicator', lab };
  }
  return { ok: true, lab: withSeen(snapshot(lab), 'colorChange') };
}

export function observationComplete(lab) {
  return Boolean(lab?.complete || (lab?.seen?.sample && lab?.seen?.indicator && lab?.seen?.colorChange));
}

export function liquidColor(lab) {
  return interpolateIndicatorColor(lab.ph, lab.indicator);
}
