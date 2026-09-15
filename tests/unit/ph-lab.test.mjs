import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifyPh,
  createLab,
  dropIndicator,
  estimateHydroniumMolPerL,
  formatHydronium,
  interpolateIndicatorColor,
  observationComplete,
  selectSample,
  setIndicator,
  setPh,
} from '../../src/ph-lab/ph-model.js';

test('universal indicator stop colours are the teaching chart, not a live measurement', () => {
  assert.equal(interpolateIndicatorColor(0, 'universal'), '#e5243b');
  assert.equal(interpolateIndicatorColor(7, 'universal'), '#4caf50');
  assert.equal(interpolateIndicatorColor(14, 'universal'), '#6a1b9a');
});

test('litmus stays reddish below about pH 5 and blue above about pH 8', () => {
  assert.equal(interpolateIndicatorColor(0, 'litmus'), '#e5484d');
  assert.equal(interpolateIndicatorColor(5, 'litmus'), '#e5484d');
  assert.equal(interpolateIndicatorColor(8, 'litmus'), '#3b6fd4');
  assert.equal(interpolateIndicatorColor(14, 'litmus'), '#3b6fd4');
});

test('phenolphthalein is nearly colourless in acid and neutral, pink only in base', () => {
  for (const ph of [0, 3, 7, 8]) {
    assert.equal(interpolateIndicatorColor(ph, 'phenol'), '#dff3f8');
  }
  assert.equal(interpolateIndicatorColor(9, 'phenol'), '#ff8fc0');
  assert.equal(interpolateIndicatorColor(10, 'phenol'), '#f0409a');
  assert.equal(interpolateIndicatorColor(14, 'phenol'), '#e01e86');
});

test('indicator colours lerp linearly between neighbouring stops', () => {
  // Independent mix of universal pH 0 #e5243b and pH 2 #f04a1e at t=0.5.
  assert.equal(interpolateIndicatorColor(1, 'universal'), '#eb372d');
  // Independent mix of litmus pH 5 #e5484d and pH 6.5 #9a6bd0 at t=2/3.
  assert.equal(interpolateIndicatorColor(6, 'litmus'), '#b35fa4');
});

test('an unknown indicator is rejected and does not change lab state', () => {
  const lab = createLab();
  const result = setIndicator(lab, 'methyl-orange');
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'unknown-indicator');
  assert.equal(result.lab.indicator, 'universal');
  assert.equal(result.lab.ph, 7);
  assert.equal(interpolateIndicatorColor(7, 'methyl-orange'), null);
});

test('pH 0 and 14 are legal edges; NaN and out-of-range values are refused', () => {
  const lab = createLab();
  assert.equal(setPh(lab, 0).ok, true);
  assert.equal(setPh(lab, 0).lab.ph, 0);
  assert.equal(setPh(lab, 14).ok, true);
  assert.equal(setPh(lab, 14).lab.ph, 14);

  const nan = setPh(lab, Number.NaN);
  assert.equal(nan.ok, false);
  assert.equal(nan.reason, 'invalid-ph');
  assert.equal(nan.lab.ph, 7);

  const inf = setPh(lab, Number.POSITIVE_INFINITY);
  assert.equal(inf.ok, false);
  assert.equal(inf.reason, 'invalid-ph');
  assert.equal(inf.lab, lab);

  const high = setPh(lab, 14.1);
  assert.equal(high.ok, false);
  assert.equal(high.reason, 'ph-out-of-range');
  assert.equal(high.lab.ph, 7);

  const low = setPh(lab, -0.01);
  assert.equal(low.ok, false);
  assert.equal(low.reason, 'ph-out-of-range');
  assert.equal(low.lab.ph, 7);
});

test('25 °C teaching grades match facts F2/F5 and never say strong acid or strong base', () => {
  assert.equal(classifyPh(7), 'neutral');
  assert.equal(classifyPh(6.96), 'neutral');
  assert.equal(classifyPh(2.9), 'more-acidic');
  assert.equal(classifyPh(3), 'acidic');
  assert.equal(classifyPh(6.9), 'acidic');
  assert.equal(classifyPh(11), 'basic');
  assert.equal(classifyPh(8.1), 'basic');
  assert.equal(classifyPh(11.1), 'more-basic');
  assert.equal(classifyPh(Number.NaN), null);
  assert.notEqual(classifyPh(1), 'strong-acid');
  assert.notEqual(classifyPh(13), 'strong-base');
});

test('dilute-solution hydronium estimate is 10^(−pH) mol/L, not activity', () => {
  assert.equal(estimateHydroniumMolPerL(7), 1e-7);
  assert.equal(estimateHydroniumMolPerL(0), 1);
  assert.equal(estimateHydroniumMolPerL(2), 0.01);
  assert.equal(estimateHydroniumMolPerL(14), 1e-14);
  assert.equal(estimateHydroniumMolPerL(Number.NaN), null);

  const mid = formatHydronium(7);
  assert.equal(mid.mantissa, '1.0');
  assert.equal(mid.exponent, -7);
  assert.equal(mid.molPerL, 1e-7);
});

test('choosing a sample replaces the cup instead of mixing pH values', () => {
  let lab = createLab();
  assert.equal(lab.sampleId, 'water');
  assert.equal(lab.ph, 7);

  const lemon = selectSample(lab, 'lemon');
  assert.equal(lemon.ok, true);
  lab = lemon.lab;
  assert.equal(lab.sampleId, 'lemon');
  assert.equal(lab.ph, 2);
  assert.equal((lab.ph + 7) / 2, 4.5);
  assert.notEqual(lab.ph, 4.5);

  const water = selectSample(lab, 'water');
  assert.equal(water.ok, true);
  assert.equal(water.lab.sampleId, 'water');
  assert.equal(water.lab.ph, 7);
});

test('an unknown sample id is refused and the previous cup stays put', () => {
  const lab = selectSample(createLab(), 'lemon').lab;
  const unknown = selectSample(lab, 'mystery-juice');
  assert.equal(unknown.ok, false);
  assert.equal(unknown.reason, 'unknown-sample');
  assert.equal(unknown.lab.sampleId, 'lemon');
  assert.equal(unknown.lab.ph, 2);
});

test('after an illegal edit the bench can recover by picking a real sample', () => {
  let lab = createLab();
  lab = setPh(lab, Number.NaN).lab;
  lab = setIndicator(lab, 'unknown').lab;
  lab = selectSample(lab, 'nope').lab;
  assert.equal(lab.ph, 7);
  assert.equal(lab.indicator, 'universal');
  assert.equal(lab.sampleId, 'water');

  const recovered = selectSample(lab, 'bleach');
  assert.equal(recovered.ok, true);
  assert.equal(recovered.lab.sampleId, 'bleach');
  assert.equal(recovered.lab.ph, 12.6);
  assert.equal(classifyPh(recovered.lab.ph), 'more-basic');
});

test('the first observe loop is sample + indicator + colour change, then it can be replayed', () => {
  let lab = createLab();
  assert.equal(observationComplete(lab), false);

  lab = selectSample(lab, 'lemon').lab;
  assert.equal(observationComplete(lab), false);

  lab = setIndicator(lab, 'phenol').lab;
  assert.equal(observationComplete(lab), false);

  const dropped = dropIndicator(lab);
  assert.equal(dropped.ok, true);
  lab = dropped.lab;
  assert.equal(observationComplete(lab), true);
  assert.equal(lab.complete, true);

  lab = selectSample(lab, 'ammonia').lab;
  assert.equal(observationComplete(lab), true);
});
