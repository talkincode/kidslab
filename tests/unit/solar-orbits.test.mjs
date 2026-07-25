import assert from 'node:assert/strict';
import test from 'node:test';

import {
  AU_KM,
  DRIFT_MODES,
  J2000_JD,
  PLANETS,
  SUN,
  SUN_TO_PLANET_MASS_RATIO,
  angleToEclipticDeg,
  dateFromJulianDay,
  elementsAt,
  heliocentricPosition,
  heliocentricState,
  julianDayFromDate,
  kmsToAuPerYear,
  orbitalPeriodYears,
  solveKepler,
  sunBarycentricOffset,
  sunOffsetInSolarRadii,
  visVivaSpeed,
  wrapDegrees,
} from '../../src/solar-explorer/orbits.js';

const DEG = Math.PI / 180;
const norm = (v) => Math.hypot(v[0], v[1], v[2]);

test('儒略日与日期互为逆运算', () => {
  const jd = julianDayFromDate(new Date(Date.UTC(2000, 0, 1, 12, 0, 0)));
  assert.ok(Math.abs(jd - J2000_JD) < 1e-6);
  const back = dateFromJulianDay(J2000_JD);
  assert.equal(back.toISOString(), '2000-01-01T12:00:00.000Z');
});

test('角度归一化落在 [-180, 180)', () => {
  assert.equal(wrapDegrees(370), 10);
  assert.equal(wrapDegrees(-370), -10);
  assert.ok(wrapDegrees(3600.5) < 180 && wrapDegrees(3600.5) >= -180);
});

test('开普勒方程的解满足 M = E − e* sinE', () => {
  for (const e of [0, 0.0067, 0.0934, 0.2056]) {
    for (const meanAnomaly of [-179, -90, -3, 0, 17, 120, 179]) {
      const eccentricAnomaly = solveKepler(meanAnomaly, e);
      const residual = eccentricAnomaly - (e / DEG) * Math.sin(eccentricAnomaly * DEG) - meanAnomaly;
      assert.ok(Math.abs(residual) < 1e-6, `M=${meanAnomaly} e=${e} 残差 ${residual}`);
    }
  }
});

test('J2000 时地月质心的日心黄道坐标与 JPL 历表一致（约 1e-3 au）', () => {
  const { position, radiusAu } = heliocentricState('earth', J2000_JD);
  assert.ok(Math.abs(position[0] - (-0.17724)) < 1e-3, `x=${position[0]}`);
  assert.ok(Math.abs(position[1] - 0.96719) < 1e-3, `y=${position[1]}`);
  assert.ok(Math.abs(position[2]) < 1e-3, `z=${position[2]}`);
  /* 2000 年 1 月初刚过近日点，日地距离小于 1 au */
  assert.ok(radiusAu > 0.982 && radiusAu < 0.985, `r=${radiusAu}`);
});

test('日心距离始终落在近日点与远日点之间', () => {
  for (const planet of PLANETS) {
    for (let year = 1900; year <= 2100; year += 7) {
      const jd = julianDayFromDate(new Date(Date.UTC(year, 5, 15)));
      const { radiusAu, elements } = heliocentricState(planet.id, jd);
      const perihelion = elements.a * (1 - elements.e);
      const aphelion = elements.a * (1 + elements.e);
      assert.ok(
        radiusAu >= perihelion - 1e-9 && radiusAu <= aphelion + 1e-9,
        `${planet.id} ${year}: r=${radiusAu} 不在 [${perihelion}, ${aphelion}]`,
      );
    }
  }
});

test('位置专用计算与完整状态中的位置完全一致', () => {
  for (const planet of PLANETS) {
    for (const offset of [-10000, 0, 10000]) {
      assert.deepEqual(
        heliocentricPosition(planet.id, J2000_JD + offset),
        heliocentricState(planet.id, J2000_JD + offset).position,
      );
    }
  }
});

test('解析速度与维斯-维瓦方程互相印证（误差 < 0.2%）', () => {
  for (const planet of PLANETS) {
    for (const offset of [0, 900, 3000]) {
      const { radiusAu, speedKmS, elements } = heliocentricState(planet.id, J2000_JD + offset);
      const expected = visVivaSpeed(radiusAu, elements.a);
      assert.ok(
        Math.abs(speedKmS - expected) / expected < 0.002,
        `${planet.id}: ${speedKmS} vs ${expected}`,
      );
    }
  }
});

test('公转周期与 JPL 公布值一致（误差 < 0.5%）', () => {
  const known = {
    mercury: 0.2408467,
    venus: 0.61519726,
    earth: 1.0000174,
    mars: 1.8808476,
    jupiter: 11.862615,
    saturn: 29.447498,
    uranus: 84.016846,
    neptune: 164.79132,
  };
  for (const [id, years] of Object.entries(known)) {
    const computed = orbitalPeriodYears(id);
    assert.ok(Math.abs(computed - years) / years < 0.005, `${id}: ${computed} vs ${years}`);
  }
});

test('地球公转速度在 29.29–30.29 km/s 之间摆动，近日点最快', () => {
  const speed = (id, jd = J2000_JD) => heliocentricState(id, jd).speedKmS;
  const samples = [];
  for (let day = 0; day < 366; day += 1) samples.push(speed('earth', J2000_JD + day));
  const fastest = Math.max(...samples);
  const slowest = Math.min(...samples);
  assert.ok(Math.abs(fastest - 30.29) < 0.1, `近日点速度 ${fastest}`);
  assert.ok(Math.abs(slowest - 29.29) < 0.1, `远日点速度 ${slowest}`);
  /* J2000（1 月 1 日）刚好在 1 月初的近日点附近，所以此刻偏快 */
  assert.ok(speed('earth') > 30.2, `J2000 速度 ${speed('earth')}`);
});

test('越靠近太阳跑得越快：水星最快、海王星最慢', () => {
  const speed = (id) => heliocentricState(id, J2000_JD).speedKmS;
  assert.ok(speed('mercury') > 38 && speed('mercury') < 60);
  assert.ok(speed('neptune') > 5 && speed('neptune') < 6);
  assert.ok(speed('mercury') > speed('earth'));
  assert.ok(speed('earth') > speed('mars'));
  assert.ok(speed('mars') > speed('jupiter'));
  assert.ok(speed('jupiter') > speed('neptune'));
});

test('轨道倾角与偏心率保持在已知量级', () => {
  const { elements: mercury } = heliocentricState('mercury', J2000_JD);
  assert.ok(Math.abs(mercury.inclination - 7.005) < 0.01);
  assert.ok(Math.abs(mercury.e - 0.2056) < 0.001);
  const { elements: earth } = heliocentricState('earth', J2000_JD);
  assert.ok(Math.abs(earth.inclination) < 0.01, '地球定义了黄道面，倾角约为 0');
});

test('太阳在银河系里的运动方向既不平行也不垂直于黄道面', () => {
  const local = angleToEclipticDeg(DRIFT_MODES.local.direction);
  const galaxy = angleToEclipticDeg(DRIFT_MODES.galaxy.direction);
  assert.ok(Math.abs(DRIFT_MODES.local.speedKmS - 18.04) < 0.05);
  assert.ok(local > 40 && local < 55, `本动倾角 ${local}`);
  /* 黄道面与银道面夹角约 60°，因此银河公转方向与黄道面约成 60° */
  assert.ok(Math.abs(galaxy - 59.6) < 1.5, `银河公转倾角 ${galaxy}`);
  for (const mode of Object.values(DRIFT_MODES)) {
    assert.ok(Math.abs(norm(mode.direction) - 1) < 1e-6, `${mode.id} 方向应为单位向量`);
  }
});

test('速度换算：230 km/s 约合每年 48.5 au', () => {
  assert.ok(Math.abs(kmsToAuPerYear(230) - 48.5) < 0.1);
  assert.ok(Math.abs(kmsToAuPerYear(1) * AU_KM - 365.25 * 86400) < 1);
});

test('轨道要素随时间缓慢进动，不会跳变', () => {
  const before = elementsAt('mars', J2000_JD);
  const after = elementsAt('mars', J2000_JD + 36525);
  assert.ok(Math.abs(after.a - before.a) < 0.001);
  assert.ok(Math.abs(after.inclination - before.inclination) < 0.02);
  assert.notEqual(after.perihelion, before.perihelion);
});

/* ---------------- 太阳系质心：太阳自己也在动 ---------------- */

test('太阳绕质心摆动：偏移量在约 0.05–2.2 个太阳半径之间', () => {
  let min = Infinity;
  let max = 0;
  /* 覆盖两个土星周期（约 59 年），足以扫过木土会合造成的极值 */
  for (let day = 0; day < 21600; day += 60) {
    const radii = sunOffsetInSolarRadii(J2000_JD + day);
    min = Math.min(min, radii);
    max = Math.max(max, radii);
  }
  assert.ok(max > 1.0, `质心至少一度跑到太阳表面之外，实测最大 ${max}`);
  assert.ok(max < 2.2, `质心偏移不应超过约 2 个太阳半径，实测最大 ${max}`);
  assert.ok(min < 1.0, `会合相位不同时质心应回到太阳体内，实测最小 ${min}`);
  assert.ok(min > 0.05, `质心不会精确落在太阳中心，实测最小 ${min}`);
});

test('质心定义自洽：以质心为原点时总质量矩为零', () => {
  const jd = J2000_JD + 4000;
  const sun = sunBarycentricOffset(jd);
  const moment = [0, 0, 0];
  for (const planet of PLANETS) {
    const mu = 1 / SUN_TO_PLANET_MASS_RATIO[planet.id];
    const helio = heliocentricPosition(planet.id, jd);
    for (let i = 0; i < 3; i += 1) moment[i] += mu * (helio[i] + sun[i]);
  }
  /* 太阳自身的质量矩（μ = 1）加上行星部分应互相抵消 */
  for (let i = 0; i < 3; i += 1) moment[i] += sun[i];
  assert.ok(norm(moment) < 1e-12, `总质量矩 ${norm(moment)} 应为零`);
});

test('木星主导质心：太阳被推向木星的反方向', () => {
  for (const day of [0, 3000, 9000, 15000]) {
    const jd = J2000_JD + day;
    const sun = sunBarycentricOffset(jd);
    const jupiter = heliocentricPosition('jupiter', jd);
    const cosine = (sun[0] * jupiter[0] + sun[1] * jupiter[1] + sun[2] * jupiter[2]) / (norm(sun) * norm(jupiter));
    assert.ok(cosine < -0.3, `第 ${day} 天：太阳应偏向木星反侧，实测 cos = ${cosine}`);
  }
});

test('单木星极限：木星单独贡献约 1.07 个太阳半径', () => {
  const mu = 1 / SUN_TO_PLANET_MASS_RATIO.jupiter;
  const radii = ((mu / (1 + mu)) * 5.2044 * AU_KM) / SUN.radiusKm;
  assert.ok(Math.abs(radii - 1.07) < 0.02, `日木质心 ${radii} 个太阳半径`);
});
