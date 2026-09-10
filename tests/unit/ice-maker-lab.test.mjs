import assert from 'node:assert/strict';
import test from 'node:test';

import {
  AMBIENT_C,
  COP,
  C_WATER_J_PER_G_K,
  FREEZE_C,
  L_FUSION_J_PER_G,
  LEAK_W,
  MOLD_COUNT,
  RATED_POWER_W,
  TIME_SCALE,
  WATER_MASS_G,
  createLab,
  energyBalance,
  fillWater,
  harvest,
  loopStage,
  resetLab,
  setDoor,
  setPower,
  setPowerLevel,
  snapshot,
  stepLab,
} from '../../src/ice-maker-lab/ice-model.js';

const EPS = 1e-6;

function nearly(actual, expected, eps = 1e-4) {
  assert.ok(Number.isFinite(actual), `expected finite, got ${actual}`);
  assert.ok(Math.abs(actual - expected) <= eps, `${actual} ≉ ${expected} (±${eps})`);
}

function freezeBudgetJ() {
  return WATER_MASS_G * C_WATER_J_PER_G_K * (AMBIENT_C - FREEZE_C)
    + WATER_MASS_G * L_FUSION_J_PER_G;
}

function coolingPowerW(level) {
  return RATED_POWER_W[level] * COP * TIME_SCALE;
}

function runSeconds(lab, seconds, dt = 1 / 60) {
  let current = lab;
  let left = seconds;
  while (left > 1e-9) {
    const slice = Math.min(dt, left);
    const result = stepLab(current, slice);
    assert.equal(result.ok, true, result.reason);
    current = result.lab;
    left -= slice;
  }
  return current;
}

function readyLab(level = 2) {
  let lab = createLab();
  lab = fillWater(lab).lab;
  lab = setPowerLevel(lab, level).lab;
  lab = setPower(lab, true).lab;
  return lab;
}

test('energy identity: condenser heat equals evaporator heat plus compressor work', () => {
  let lab = readyLab(2);
  lab = runSeconds(lab, 6);
  const energy = energyBalance(lab);

  nearly(energy.evaporatorHeatJ, energy.heatFromWaterJ + energy.heatLeakJ);
  nearly(energy.heatToRoomJ, energy.heatFromWaterJ + energy.heatLeakJ + energy.compressorWorkJ);
  nearly(energy.netRoomHeatJ, energy.heatFromWaterJ + energy.compressorWorkJ);
  nearly(energy.heatToRoomJ / energy.compressorWorkJ, 1 + COP, 1e-6);
  assert.ok(energy.heatFromWaterJ > 0);
  assert.ok(energy.compressorWorkJ > 0);
  assert.equal(energy.heatLeakJ, 0);
});

test('phase change stays at 0 °C while latent heat is removed, then ice completes', () => {
  const qDot = coolingPowerW(2);
  const sensibleJ = WATER_MASS_G * C_WATER_J_PER_G_K * (AMBIENT_C - FREEZE_C);
  const latentJ = WATER_MASS_G * L_FUSION_J_PER_G;
  const tCool = sensibleJ / qDot;
  const tFreeze = latentJ / qDot;

  let lab = readyLab(2);
  lab = runSeconds(lab, tCool * 0.5);
  assert.ok(lab.moldTempC > FREEZE_C + 0.3);
  assert.equal(lab.iceFraction, 0);

  lab = runSeconds(lab, tCool * 0.6);
  nearly(lab.moldTempC, FREEZE_C, 0.05);
  assert.ok(lab.iceFraction < 0.2);

  lab = runSeconds(lab, tFreeze * 0.4);
  nearly(lab.moldTempC, FREEZE_C, 0.02);
  assert.ok(lab.iceFraction > 0.3);
  assert.ok(lab.iceFraction < 0.7);

  lab = runSeconds(lab, tFreeze);
  nearly(lab.iceFraction, 1, 1e-6);
  nearly(lab.moldTempC, FREEZE_C, 0.02);
  nearly(energyBalance(lab).heatFromWaterJ, freezeBudgetJ(), 2);
});

test('an open door slows freezing because leak heat steals evaporator capacity', () => {
  const duration = 8;
  let shut = readyLab(2);
  shut = setDoor(shut, false).lab;
  shut = runSeconds(shut, duration);

  let open = readyLab(2);
  open = setDoor(open, true).lab;
  open = runSeconds(open, duration);

  assert.ok(open.iceFraction + open.moldTempC * 0.01 < shut.iceFraction + shut.moldTempC * 0.01
    || open.moldTempC > shut.moldTempC);
  assert.ok(energyBalance(open).heatLeakJ > 100);
  assert.equal(energyBalance(shut).heatLeakJ, 0);
  nearly(
    energyBalance(open).heatToRoomJ,
    energyBalance(open).heatFromWaterJ + energyBalance(open).heatLeakJ + energyBalance(open).compressorWorkJ,
  );
  nearly(
    energyBalance(open).netRoomHeatJ,
    energyBalance(open).heatFromWaterJ + energyBalance(open).compressorWorkJ,
  );
  nearly(energyBalance(open).heatLeakJ, LEAK_W * TIME_SCALE * duration, 8);
});

test('higher compressor power freezes faster and dumps more heat into the room', () => {
  const duration = 5;
  let slow = runSeconds(readyLab(1), duration);
  let fast = runSeconds(readyLab(3), duration);
  const slowE = energyBalance(slow);
  const fastE = energyBalance(fast);

  assert.ok(fast.moldTempC < slow.moldTempC || fast.iceFraction > slow.iceFraction);
  assert.ok(fastE.heatToRoomJ > slowE.heatToRoomJ);
  nearly(fastE.compressorWorkJ / slowE.compressorWorkJ, RATED_POWER_W[3] / RATED_POWER_W[1], 1e-6);
});

test('loop stages cycle only while the compressor is on', () => {
  let lab = fillWater(createLab()).lab;
  assert.equal(loopStage(lab), 'idle');
  lab = setPower(lab, true).lab;
  const seen = new Set();
  lab = runSeconds(lab, 5, 1 / 30);
  for (const stage of ['comp', 'cond', 'exp', 'evap']) {
    assert.equal(lab.loopSeen[stage], true, stage);
    seen.add(stage);
  }
  assert.equal(seen.size, 4);
  lab = setPower(lab, false).lab;
  assert.equal(loopStage(lab), 'idle');
});

test('illegal actions are rejected without mutating the lab, and harvest recovers to a new tray', () => {
  const empty = createLab();
  const frozenEmpty = snapshot(empty);

  const noWater = setPower(empty, true);
  assert.equal(noWater.ok, false);
  assert.equal(noWater.reason, 'need-water');
  assert.deepEqual(snapshot(empty), frozenEmpty);

  const noHarvest = harvest(empty);
  assert.equal(noHarvest.reason, 'not-frozen');
  assert.deepEqual(snapshot(empty), frozenEmpty);

  const badLevel = setPowerLevel(empty, 0);
  assert.equal(badLevel.reason, 'invalid-power-level');

  const badDoor = setDoor(empty, 'ajar');
  assert.equal(badDoor.reason, 'invalid-door');

  const badDt = stepLab(empty, -0.2);
  assert.equal(badDt.reason, 'invalid-dt');
  assert.deepEqual(snapshot(empty), frozenEmpty);

  const nanState = stepLab({ ...empty, moldTempC: Number.NaN }, 0.016);
  assert.equal(nanState.reason, 'invalid-state');

  let lab = fillWater(createLab()).lab;
  const filledOnce = fillWater(lab);
  assert.equal(filledOnce.reason, 'already-filled');
  assert.equal(lab.filled, true);

  lab = setPower(lab, true).lab;
  lab = runSeconds(lab, freezeBudgetJ() / coolingPowerW(2) + 0.5);
  assert.ok(lab.iceFraction >= 0.98);
  assert.equal(fillWater(lab).reason, 'harvest-first');

  const tooSoon = harvest({ ...lab, iceFraction: 0.4 });
  assert.equal(tooSoon.reason, 'not-frozen');

  const done = harvest(lab);
  assert.equal(done.ok, true);
  assert.equal(done.lab.harvestedCubes, MOLD_COUNT);
  assert.equal(done.lab.filled, false);
  assert.equal(done.lab.iceFraction, 0);

  const refill = fillWater(done.lab);
  assert.equal(refill.ok, true);
  nearly(refill.lab.moldTempC, AMBIENT_C, 1e-6);
  assert.equal(refill.lab.harvestedCubes, MOLD_COUNT);
});

test('turning the compressor off too early lets ice melt, and reset restores a playable lab', () => {
  let lab = readyLab(3);
  lab = runSeconds(lab, freezeBudgetJ() / coolingPowerW(3) + 0.4);
  assert.ok(lab.iceFraction >= 0.98);

  lab = setPower(lab, false).lab;
  lab = setDoor(lab, true).lab;
  lab = runSeconds(lab, 12);
  assert.ok(lab.iceFraction < 0.98 || lab.moldTempC > FREEZE_C);

  const recovered = setPower(lab, true);
  assert.equal(recovered.ok, true);
  lab = runSeconds(recovered.lab, freezeBudgetJ() / coolingPowerW(3) + 1);
  assert.ok(lab.iceFraction >= 0.98);

  const reset = resetLab(lab);
  assert.equal(reset.ok, true);
  assert.equal(reset.lab.filled, false);
  assert.equal(reset.lab.power, false);
  assert.equal(reset.lab.harvestedCubes, 0);
  nearly(reset.lab.moldTempC, AMBIENT_C);
  assert.equal(energyBalance(reset.lab).heatToRoomJ, 0);

  const keep = resetLab(lab, { keepCubes: true });
  assert.equal(keep.lab.harvestedCubes, lab.harvestedCubes);
});
