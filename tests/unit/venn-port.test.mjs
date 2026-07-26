import assert from 'node:assert/strict';
import test from 'node:test';

import {
  checksFor,
  expectedZone,
  LEVELS,
  missionSolution,
  truthCode,
  ZONES,
} from '../../src/venn-port/model.js';

test('each mission has five unique ships and covers all four Venn regions', () => {
  const allIds = new Set();

  for (const level of LEVELS) {
    assert.equal(level.ships.length, 5);
    assert.deepEqual(new Set(missionSolution(level)), new Set(Object.values(ZONES)));

    for (const ship of level.ships) {
      assert.equal(allIds.has(ship.id), false, `duplicate ship id ${ship.id}`);
      allIds.add(ship.id);
    }
  }

  assert.equal(allIds.size, 20);
});

test('truth codes and destination zones follow both yes/no checks', () => {
  const level = { rules: ['a', 'b'] };
  const cases = [
    [{ a: true, b: false }, '10', 'left'],
    [{ a: true, b: true }, '11', 'both'],
    [{ a: false, b: true }, '01', 'right'],
    [{ a: false, b: false }, '00', 'neither'],
  ];

  for (const [ship, code, zone] of cases) {
    assert.equal(truthCode(level, ship), code);
    assert.equal(expectedZone(level, ship), zone);
  }
});

test('every mission solution is derived from the declared ship attributes', () => {
  for (const level of LEVELS) {
    const solution = missionSolution(level);
    level.ships.forEach((ship, index) => {
      const checks = checksFor(level, ship);
      assert.equal(solution[index], expectedZone(level, ship));
      assert.equal(truthCode(level, ship), `${Number(checks.left)}${Number(checks.right)}`);
    });
  }
});
