import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CELL_SPECS,
  createLab,
  depthOfFieldUm,
  estimateCellLengthUm,
  fieldDiameterMm,
  parseLab,
  recordTrial,
  resetLab,
  serializeLab,
  setLight,
  setObjective,
  setSlide,
  snapshotView,
  totalMagnification,
  turnCoarse,
  turnFine,
} from '../../src/microscope-cell-lab/lab-model.js';

test('total magnification is eyepiece 10× times the objective', () => {
  assert.equal(totalMagnification(4), 40);
  assert.equal(totalMagnification(10), 100);
  assert.equal(totalMagnification(40), 400);
});

test('field diameter equals FN 18 mm divided by objective magnification', () => {
  assert.equal(fieldDiameterMm(4), 4.5);
  assert.equal(fieldDiameterMm(10), 1.8);
  assert.equal(fieldDiameterMm(40), 0.45);
  assert.equal(fieldDiameterMm(4) / fieldDiameterMm(10), 10 / 4);
  assert.equal(fieldDiameterMm(10) / fieldDiameterMm(40), 40 / 10);
});

test('cell length estimated from how many cells fit across the field', () => {
  assert.equal(estimateCellLengthUm(1.8, 9), 200);
  assert.equal(estimateCellLengthUm(1.8, 36), 50);
  const onionAcross = (fieldDiameterMm(4) * 1000) / CELL_SPECS.onion.lengthUm;
  assert.equal(onionAcross, 22.5);
});

test('a new lab starts on low power, out of focus, with onion on the stage', () => {
  const lab = createLab();
  const view = snapshotView(lab);
  assert.equal(lab.slide, 'onion');
  assert.equal(lab.objectiveMag, 4);
  assert.equal(view.totalMag, 40);
  assert.equal(view.fieldDiameterMm, 4.5);
  assert.equal(view.inFocus, false);
  assert.equal(view.visible, false);
  assert.equal(view.features, null);
});

test('coarse focus on 4× can bring the onion cells into a sharp, measurable view', () => {
  const focused = turnCoarse(createLab(), 800);
  assert.equal(focused.ok, true);
  const view = snapshotView(focused.lab);
  assert.equal(view.inFocus, true);
  assert.equal(view.visible, true);
  assert.equal(view.sharpness, 1);
  assert.equal(view.features.hasWall, true);
  assert.equal(view.features.hasChloroplast, false);
  assert.equal(view.features.hasLargeVacuole, true);
  assert.equal(view.cellsAcross, 22.5);
  assert.equal(view.estimatedCellLengthUm, 200);
});

test('switching up in power is refused until the current view is roughly focused', () => {
  const lab = createLab();
  const refused = setObjective(lab, 10);
  assert.equal(refused.ok, false);
  assert.equal(refused.reason, 'focus-first');
  assert.equal(refused.lab.objectiveMag, 4);
  assert.equal(refused.lab.coarseUm, lab.coarseUm);
});

test('after a sharp 4× view, 10× is allowed and the field shrinks by 4/10', () => {
  const focused = turnCoarse(createLab(), 800).lab;
  const zoomed = setObjective(focused, 10);
  assert.equal(zoomed.ok, true);
  const view = snapshotView(zoomed.lab);
  assert.equal(view.totalMag, 100);
  assert.equal(view.fieldDiameterMm, 1.8);
  assert.equal(view.inFocus, true);
  assert.equal(view.cellsAcross, 9);
});

test('coarse focus is forbidden on 40× and does not move the stage', () => {
  let lab = turnCoarse(createLab(), 800).lab;
  lab = setObjective(lab, 10).lab;
  lab = setObjective(lab, 40).lab;
  const before = lab.coarseUm;
  const refused = turnCoarse(lab, -20);
  assert.equal(refused.ok, false);
  assert.equal(refused.reason, 'coarse-forbidden-on-high-power');
  assert.equal(refused.lab.coarseUm, before);
  assert.equal(refused.lab.objectiveMag, 40);
  const fine = turnFine(refused.lab, 2);
  assert.equal(fine.ok, true);
  assert.equal(fine.lab.fineUm, 2);
});

test('a blurry or too-dark view cannot be written into the data table', () => {
  const blurry = recordTrial(createLab());
  assert.equal(blurry.ok, false);
  assert.equal(blurry.reason, 'out-of-focus');
  assert.equal(blurry.lab.trials.length, 0);

  const dark = setLight(turnCoarse(createLab(), 800).lab, 8);
  const tooDark = recordTrial(dark.lab);
  assert.equal(tooDark.ok, false);
  assert.equal(tooDark.reason, 'too-dark');
  assert.equal(tooDark.lab.trials.length, 0);
});

test('invalid knobs and unknown slides are rejected without mutating state', () => {
  const lab = createLab();
  assert.equal(setObjective(lab, 100).reason, 'invalid-objective');
  assert.equal(setObjective(lab, 100).lab.objectiveMag, 4);
  assert.equal(setSlide(lab, 'blood').reason, 'invalid-slide');
  assert.equal(setSlide(lab, 'blood').lab.slide, 'onion');
  assert.equal(turnCoarse(lab, Number.NaN).reason, 'invalid-delta');
  assert.equal(turnFine(lab, Number.POSITIVE_INFINITY).reason, 'invalid-delta');
  assert.equal(setLight(lab, -3).reason, 'out-of-range-light');
  assert.equal(setLight(lab, -3).lab.light, 40);
});

test('onion 4×, onion 10× and cheek 10× records complete the L3 comparison', () => {
  let lab = turnCoarse(createLab(), 800).lab;
  lab = recordTrial(lab).lab;
  lab = setObjective(lab, 10).lab;
  lab = recordTrial(lab).lab;
  const duplicate = recordTrial(lab);
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.reason, 'duplicate-trial');
  assert.equal(duplicate.lab.trials.length, 2);

  lab = setSlide(duplicate.lab, 'cheek').lab;
  const cheek = snapshotView(lab);
  assert.equal(cheek.features.hasWall, false);
  assert.equal(cheek.features.hasLargeVacuole, false);
  assert.equal(cheek.estimatedCellLengthUm, 50);
  lab = recordTrial(lab).lab;

  assert.equal(lab.phase, 'complete');
  assert.equal(lab.trials.length, 3);
  assert.equal(lab.trials[0].fieldDiameterMm, 4.5);
  assert.equal(lab.trials[1].fieldDiameterMm, 1.8);
  assert.equal(lab.trials[2].slide, 'cheek');
  assert.ok(depthOfFieldUm(4) > depthOfFieldUm(10));
  assert.ok(depthOfFieldUm(10) > depthOfFieldUm(40));
});

test('an in-progress lab serializes, restores, and can reset after a failed record', () => {
  let lab = turnCoarse(createLab(), 800).lab;
  lab = recordTrial(lab).lab;
  const restored = parseLab(serializeLab(lab));
  assert.equal(restored.ok, true);
  assert.equal(restored.lab.trials.length, 1);
  assert.equal(restored.lab.trials[0].totalMag, 40);

  const reset = resetLab(restored.lab);
  assert.equal(reset.ok, true);
  assert.equal(reset.lab.trials.length, 0);
  assert.equal(reset.lab.phase, 'observe');
  assert.equal(reset.lab.objectiveMag, 4);
  assert.equal(snapshotView(reset.lab).inFocus, false);

  assert.equal(parseLab('{"nope":true}').ok, false);
  assert.equal(parseLab(null).ok, false);
});
