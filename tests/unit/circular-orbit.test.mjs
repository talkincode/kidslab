import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CIRCULAR_TOLERANCE,
  EARTH_RADIUS,
  MU,
  REENTRY_RADIUS,
  SYNC_PERIOD_SECONDS,
  altitudeFromRadius,
  apsides,
  circularSpeed,
  classifyLaunch,
  crashSpeed,
  createFlight,
  describeOrbit,
  eccentricity,
  escapeSpeed,
  gravityAtRadius,
  isSyncOrbit,
  orbitalPeriod,
  radiusAtAngle,
  radiusForPeriod,
  radiusFromAltitude,
  requiredCentripetal,
  semiMajorAxis,
  simulationStep,
  specificEnergy,
  stepFlight,
} from '../../src/circular-orbit-lab/orbit-model.js';

const LEO = radiusFromAltitude(4e5);
const close = (actual, expected, relative) => Math.abs(actual - expected) / Math.abs(expected) <= relative;

function flyUntilDone(orbit, radius, maxSteps = 60000) {
  let flight = createFlight(orbit);
  const step = simulationStep(radius);
  let guard = 0;
  while (flight.status === 'flying' && guard < maxSteps) {
    flight = stepFlight(orbit, flight, step);
    guard += 1;
  }
  return flight;
}

test('standard gravitational parameter and low-orbit values match the reference data', () => {
  assert.ok(close(MU, 3.986e14, 0.001), `MU=${MU}`);
  assert.equal(EARTH_RADIUS, 6.371e6);
  assert.ok(close(circularSpeed(LEO), 7672, 0.001), `v=${circularSpeed(LEO)}`);
  assert.ok(close(orbitalPeriod(LEO), 5545, 0.001), `T=${orbitalPeriod(LEO)}`);
  assert.ok(close(gravityAtRadius(LEO), 8.694, 0.002), `g=${gravityAtRadius(LEO)}`);
  assert.equal(circularSpeed(0), null);
  assert.equal(orbitalPeriod(-1), null);
});

test('escape speed is exactly the square root of two times the circular speed', () => {
  for (const altitude of [2e5, 4e5, 2e6, 3.5786e7]) {
    const radius = radiusFromAltitude(altitude);
    assert.ok(close(escapeSpeed(radius), circularSpeed(radius) * Math.SQRT2, 1e-12));
  }
});

test('a circular orbit needs gravity to supply exactly the centripetal acceleration', () => {
  const speed = circularSpeed(LEO);
  assert.ok(close(requiredCentripetal(LEO, speed), gravityAtRadius(LEO), 1e-12));
  assert.ok(requiredCentripetal(LEO, speed * 1.1) > gravityAtRadius(LEO));
  assert.ok(requiredCentripetal(LEO, speed * 0.9) < gravityAtRadius(LEO));
});

test('the synchronous orbit radius follows from one sidereal day', () => {
  const radius = radiusForPeriod(SYNC_PERIOD_SECONDS);
  assert.ok(close(radius, 4.2164e7, 0.001), `r=${radius}`);
  assert.ok(close(altitudeFromRadius(radius) / 1000, 35786, 0.001));
  assert.ok(close(orbitalPeriod(radius), SYNC_PERIOD_SECONDS, 1e-9));
  assert.equal(radiusForPeriod(0), null);
});

test('tangential launches classify into re-entry, ellipse, circle and escape', () => {
  const circular = circularSpeed(LEO);
  assert.equal(classifyLaunch(LEO, circular), 'circular');
  assert.equal(classifyLaunch(LEO, circular * (1 + CIRCULAR_TOLERANCE * 0.5)), 'circular');
  assert.equal(classifyLaunch(LEO, circular * 1.15), 'ellipse');
  assert.equal(classifyLaunch(LEO, circular * 0.9), 'crash');
  assert.equal(classifyLaunch(LEO, escapeSpeed(LEO)), 'escape');
  assert.equal(classifyLaunch(LEO, escapeSpeed(LEO) * 1.2), 'escape');
  assert.equal(classifyLaunch(EARTH_RADIUS * 0.5, circular), 'invalid');
  assert.equal(classifyLaunch(LEO, -1), 'invalid');
});

test('the crash boundary is the speed whose perigee just touches the re-entry altitude', () => {
  for (const altitude of [4e5, 2e6, 8e6]) {
    const radius = radiusFromAltitude(altitude);
    const boundary = crashSpeed(radius);
    const pair = apsides(radius, boundary);
    assert.ok(close(pair.perigee, REENTRY_RADIUS, 1e-9), `perigee=${pair.perigee}`);
    assert.equal(classifyLaunch(radius, boundary * 0.995), 'crash');
    assert.equal(classifyLaunch(radius, boundary * 1.02), 'ellipse');
    assert.ok(boundary < circularSpeed(radius));
  }
});

test('orbit energy, eccentricity and apsides agree with the conic description', () => {
  const speed = circularSpeed(LEO) * 1.15;
  const orbit = describeOrbit(LEO, speed);

  assert.equal(orbit.kind, 'ellipse');
  assert.ok(close(orbit.eccentricity, eccentricity(LEO, speed), 1e-12));
  assert.ok(specificEnergy(LEO, speed) < 0);
  assert.ok(close(orbit.semiMajor, semiMajorAxis(LEO, speed), 1e-12));
  /* 速度大于环绕速度时发射点就是近地点，θ=0 处半径回到发射半径 */
  assert.equal(orbit.startAngle, 0);
  assert.ok(close(radiusAtAngle(orbit, 0), LEO, 1e-9));
  assert.ok(close(radiusAtAngle(orbit, Math.PI), orbit.apsides.apogee, 1e-9));
  assert.ok(close(orbit.apsides.perigee + orbit.apsides.apogee, 2 * orbit.semiMajor, 1e-9));

  /* 速度小于环绕速度时发射点变成远地点 */
  const slow = describeOrbit(LEO, circularSpeed(LEO) * 0.97);
  assert.ok(close(slow.startAngle, Math.PI, 1e-12));
  assert.ok(close(radiusAtAngle(slow, Math.PI), LEO, 1e-9));
});

test('a fixed simulation step reproduces the analytic period for every altitude', () => {
  for (const altitude of [4e5, 2e6, 8e6, 3.5786e7]) {
    const radius = radiusFromAltitude(altitude);
    const orbit = describeOrbit(radius, circularSpeed(radius));
    const flight = flyUntilDone(orbit, radius);
    assert.equal(flight.status, 'lap');
    assert.ok(
      close(flight.lapSeconds, orbit.period, 0.0002),
      `measured ${flight.lapSeconds} vs analytic ${orbit.period}`,
    );
  }
});

test('the simulated flight ends the way the classifier predicted', () => {
  const cases = [
    [0.9, 'crashed'],
    [1.12, 'lap'],
    [1.5, 'escaped'],
  ];
  for (const [ratio, expected] of cases) {
    const orbit = describeOrbit(LEO, circularSpeed(LEO) * ratio);
    assert.equal(flyUntilDone(orbit, LEO).status, expected, `ratio ${ratio}`);
  }
});

test('an elliptical orbit takes longer per lap than the circle it started from', () => {
  const circle = describeOrbit(LEO, circularSpeed(LEO));
  const ellipse = describeOrbit(LEO, circularSpeed(LEO) * 1.12);
  assert.ok(ellipse.period > circle.period);
  assert.ok(ellipse.apsides.apogee > circle.apsides.apogee);
});

test('the synchronous-orbit check only passes a circular orbit within one percent', () => {
  const radius = radiusForPeriod(SYNC_PERIOD_SECONDS);
  const orbit = describeOrbit(radius, circularSpeed(radius));
  const flight = flyUntilDone(orbit, radius);

  assert.equal(isSyncOrbit(flight.lapSeconds, 'circular'), true);
  assert.equal(isSyncOrbit(flight.lapSeconds, 'ellipse'), false);
  assert.equal(isSyncOrbit(SYNC_PERIOD_SECONDS * 1.05, 'circular'), false);
  assert.equal(isSyncOrbit(orbitalPeriod(LEO), 'circular'), false);
  assert.equal(isSyncOrbit(null, 'circular'), false);
});

test('replaying the same launch twice yields the identical flight record', () => {
  const orbit = describeOrbit(LEO, circularSpeed(LEO) * 1.08);
  const first = flyUntilDone(orbit, LEO);
  const second = flyUntilDone(describeOrbit(LEO, circularSpeed(LEO) * 1.08), LEO);
  assert.deepEqual(first, second);
});
