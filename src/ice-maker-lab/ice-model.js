/* ============================================================
   制冰实验室纯模型 · 无 DOM / 无 three
   蒸汽压缩循环的教学账本：蒸发器吸热 Q_c，压缩机做功 W，冷凝器放热 Q_h = Q_c + W。
   时间按 TIME_SCALE 加速，便于在数十秒内看到降温、0 °C 潜热结冰和房间变热。
   ============================================================ */

export const AMBIENT_C = 22;
export const FREEZE_C = 0;
export const MOLD_COUNT = 6;
export const WATER_MASS_G = 150;
export const C_WATER_J_PER_G_K = 4.184;
export const L_FUSION_J_PER_G = 334;
export const COP = 2.5;
export const TIME_SCALE = 24;
export const LEAK_W = 40;
export const WARM_W = Object.freeze({ shut: 6, open: 28 });
export const LOOP_PERIOD_S = 4;
export const RATED_POWER_W = Object.freeze({ 1: 40, 2: 80, 3: 120 });
export const POWER_LEVELS = Object.freeze([1, 2, 3]);

const EPS = 1e-9;
const ICE_READY = 0.98;

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function clone(lab) {
  return {
    ...lab,
    loopSeen: { ...lab.loopSeen },
  };
}

function emptyLoopSeen() {
  return { comp: false, cond: false, exp: false, evap: false };
}

export function createLab() {
  return {
    version: 1,
    filled: false,
    power: false,
    powerLevel: 2,
    doorOpen: false,
    waterMassG: 0,
    moldTempC: AMBIENT_C,
    iceFraction: 0,
    harvestedCubes: 0,
    heatFromWaterJ: 0,
    heatLeakJ: 0,
    compressorWorkJ: 0,
    heatToRoomJ: 0,
    loopPhase: 0,
    loopSeen: emptyLoopSeen(),
    t: 0,
  };
}

export function snapshot(lab) {
  if (!lab) return null;
  return {
    version: lab.version,
    filled: lab.filled,
    power: lab.power,
    powerLevel: lab.powerLevel,
    doorOpen: lab.doorOpen,
    waterMassG: lab.waterMassG,
    moldTempC: lab.moldTempC,
    iceFraction: lab.iceFraction,
    harvestedCubes: lab.harvestedCubes,
    heatFromWaterJ: lab.heatFromWaterJ,
    heatLeakJ: lab.heatLeakJ,
    compressorWorkJ: lab.compressorWorkJ,
    heatToRoomJ: lab.heatToRoomJ,
    loopPhase: lab.loopPhase,
    loopSeen: { ...lab.loopSeen },
    t: lab.t,
  };
}

export function energyBalance(lab) {
  const heatFromWaterJ = lab?.heatFromWaterJ || 0;
  const heatLeakJ = lab?.heatLeakJ || 0;
  const compressorWorkJ = lab?.compressorWorkJ || 0;
  const heatToRoomJ = lab?.heatToRoomJ || 0;
  return {
    heatFromWaterJ,
    heatLeakJ,
    compressorWorkJ,
    heatToRoomJ,
    evaporatorHeatJ: heatFromWaterJ + heatLeakJ,
    netRoomHeatJ: heatToRoomJ - heatLeakJ,
  };
}

export function coolingPowerW(level) {
  return RATED_POWER_W[level] * COP * TIME_SCALE;
}

export function workPowerW(level) {
  return RATED_POWER_W[level] * TIME_SCALE;
}

export function loopStage(lab) {
  if (!lab?.power) return 'idle';
  const phase = ((lab.loopPhase % 1) + 1) % 1;
  if (phase < 0.25) return 'comp';
  if (phase < 0.5) return 'cond';
  if (phase < 0.75) return 'exp';
  return 'evap';
}

function validLab(lab) {
  if (!lab || lab.version !== 1) return false;
  return [
    lab.waterMassG,
    lab.moldTempC,
    lab.iceFraction,
    lab.harvestedCubes,
    lab.heatFromWaterJ,
    lab.heatLeakJ,
    lab.compressorWorkJ,
    lab.heatToRoomJ,
    lab.loopPhase,
    lab.t,
    lab.powerLevel,
  ].every(isFiniteNumber);
}

export function fillWater(lab) {
  if (!lab) return { ok: false, reason: 'invalid-lab', lab };
  if (lab.filled && lab.iceFraction >= ICE_READY) {
    return { ok: false, reason: 'harvest-first', lab };
  }
  if (lab.filled) {
    return { ok: false, reason: 'already-filled', lab };
  }
  const next = clone(lab);
  next.filled = true;
  next.waterMassG = WATER_MASS_G;
  next.moldTempC = AMBIENT_C;
  next.iceFraction = 0;
  return { ok: true, lab: next };
}

export function setPower(lab, on) {
  if (!lab) return { ok: false, reason: 'invalid-lab', lab };
  if (typeof on !== 'boolean') return { ok: false, reason: 'invalid-power', lab };
  if (on && !lab.filled && lab.iceFraction < ICE_READY) {
    return { ok: false, reason: 'need-water', lab };
  }
  const next = clone(lab);
  next.power = on;
  if (!on) next.loopPhase = 0;
  return { ok: true, lab: next };
}

export function setPowerLevel(lab, level) {
  if (!lab) return { ok: false, reason: 'invalid-lab', lab };
  if (!POWER_LEVELS.includes(level)) return { ok: false, reason: 'invalid-power-level', lab };
  return { ok: true, lab: { ...clone(lab), powerLevel: level } };
}

export function setDoor(lab, open) {
  if (!lab) return { ok: false, reason: 'invalid-lab', lab };
  if (typeof open !== 'boolean') return { ok: false, reason: 'invalid-door', lab };
  return { ok: true, lab: { ...clone(lab), doorOpen: open } };
}

export function harvest(lab) {
  if (!lab) return { ok: false, reason: 'invalid-lab', lab };
  if (!lab.filled || lab.iceFraction < ICE_READY) {
    return { ok: false, reason: 'not-frozen', lab };
  }
  const next = clone(lab);
  next.harvestedCubes += MOLD_COUNT;
  next.filled = false;
  next.waterMassG = 0;
  next.iceFraction = 0;
  next.moldTempC = Math.min(AMBIENT_C, next.moldTempC + 8);
  next.power = false;
  next.loopPhase = 0;
  return { ok: true, lab: next };
}

export function resetLab(lab, { keepCubes = false } = {}) {
  if (!lab) return { ok: false, reason: 'invalid-lab', lab };
  const next = createLab();
  if (keepCubes) next.harvestedCubes = lab.harvestedCubes;
  return { ok: true, lab: next };
}

function extractHeatFromWater(lab, budgetJ) {
  if (!lab.filled || lab.waterMassG <= 0 || budgetJ <= EPS) return 0;
  let remaining = budgetJ;
  let taken = 0;
  const mass = lab.waterMassG;

  if (lab.iceFraction < 1 - EPS && lab.moldTempC > FREEZE_C + EPS) {
    const sensible = mass * C_WATER_J_PER_G_K * (lab.moldTempC - FREEZE_C);
    const use = Math.min(remaining, Math.max(0, sensible));
    lab.moldTempC -= use / (mass * C_WATER_J_PER_G_K);
    if (lab.moldTempC <= FREEZE_C + 1e-9) lab.moldTempC = FREEZE_C;
    remaining -= use;
    taken += use;
  }

  if (remaining > EPS && lab.moldTempC <= FREEZE_C + 1e-6 && lab.iceFraction < 1 - EPS) {
    const latent = mass * L_FUSION_J_PER_G * (1 - lab.iceFraction);
    const use = Math.min(remaining, Math.max(0, latent));
    lab.iceFraction = Math.min(1, lab.iceFraction + use / (mass * L_FUSION_J_PER_G));
    lab.moldTempC = FREEZE_C;
    remaining -= use;
    taken += use;
  }

  return taken;
}

function addHeatToWater(lab, budgetJ) {
  if (!lab.filled || lab.waterMassG <= 0 || budgetJ <= EPS) return 0;
  let remaining = budgetJ;
  let added = 0;
  const mass = lab.waterMassG;

  if (lab.iceFraction > EPS) {
    const latent = mass * L_FUSION_J_PER_G * lab.iceFraction;
    const use = Math.min(remaining, latent);
    lab.iceFraction = Math.max(0, lab.iceFraction - use / (mass * L_FUSION_J_PER_G));
    lab.moldTempC = FREEZE_C;
    remaining -= use;
    added += use;
  }

  if (remaining > EPS && lab.iceFraction <= EPS && lab.moldTempC < AMBIENT_C) {
    const room = mass * C_WATER_J_PER_G_K * (AMBIENT_C - lab.moldTempC);
    const use = Math.min(remaining, Math.max(0, room));
    lab.moldTempC = Math.min(AMBIENT_C, lab.moldTempC + use / (mass * C_WATER_J_PER_G_K));
    remaining -= use;
    added += use;
  }

  return added;
}

export function stepLab(lab, dt) {
  if (!lab) return { ok: false, reason: 'invalid-lab', lab, events: [] };
  if (!isFiniteNumber(dt) || dt < 0) return { ok: false, reason: 'invalid-dt', lab, events: [] };
  if (!validLab(lab)) return { ok: false, reason: 'invalid-state', lab, events: [] };

  const next = clone(lab);
  const events = [];
  if (dt === 0) return { ok: true, lab: next, events };

  const iceBefore = next.iceFraction;
  const tempBefore = next.moldTempC;

  if (next.power && next.filled) {
    const workJ = workPowerW(next.powerLevel) * dt;
    const capacityJ = coolingPowerW(next.powerLevel) * dt;
    const leakAvailable = next.doorOpen ? LEAK_W * TIME_SCALE * dt : 0;
    const leakTaken = Math.min(capacityJ, leakAvailable);
    const fromWater = extractHeatFromWater(next, capacityJ - leakTaken);
    next.heatLeakJ += leakTaken;
    next.heatFromWaterJ += fromWater;
    next.compressorWorkJ += workJ;
    next.heatToRoomJ += leakTaken + fromWater + workJ;
    next.loopPhase = (next.loopPhase + dt / LOOP_PERIOD_S) % 1;
    const stage = loopStage(next);
    if (stage !== 'idle') next.loopSeen[stage] = true;
  } else if (next.filled) {
    const warm = (next.doorOpen ? WARM_W.open : WARM_W.shut) * TIME_SCALE * dt;
    addHeatToWater(next, warm);
    next.loopPhase = 0;
  }

  next.t += dt;
  if (tempBefore > FREEZE_C + 0.05 && next.moldTempC <= FREEZE_C + 0.05 && iceBefore < 0.02) {
    events.push({ type: 'freeze-start', t: next.t });
  }
  if (iceBefore < ICE_READY && next.iceFraction >= ICE_READY) {
    events.push({ type: 'ice-ready', t: next.t });
  }
  return { ok: true, lab: next, events };
}

export function restoreLab(saved) {
  if (!saved || saved.version !== 1) return null;
  const base = createLab();
  const next = {
    ...base,
    ...saved,
    loopSeen: { ...emptyLoopSeen(), ...(saved.loopSeen || {}) },
  };
  if (!validLab(next)) return null;
  if (!POWER_LEVELS.includes(next.powerLevel)) return null;
  if (typeof next.filled !== 'boolean' || typeof next.power !== 'boolean' || typeof next.doorOpen !== 'boolean') {
    return null;
  }
  next.iceFraction = Math.min(1, Math.max(0, next.iceFraction));
  next.moldTempC = Math.min(AMBIENT_C, Math.max(FREEZE_C, next.moldTempC));
  return next;
}
