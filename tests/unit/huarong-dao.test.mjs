import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PIECES,
  applyMove,
  buildOccupancy,
  canMove,
  createClassicState,
  isSolved,
  legalMoves,
  solvePuzzle,
  stateKey,
  validateState,
} from '../../src/huarong-dao/puzzle.js';

test('经典横刀立马布局合法，并且始终留下两格空位', () => {
  const state = createClassicState();
  assert.equal(validateState(state), true);
  assert.equal(PIECES.length, 10);
  assert.equal([...buildOccupancy(state)].filter((piece) => piece === -1).length, 2);
  assert.equal(legalMoves(state).length, 4);
});

test('棋块只能平移一格到空位，不能穿过边框或其他棋块', () => {
  const state = createClassicState();
  assert.equal(canMove(state, 0, 0, 1), false, '曹操下方被关羽挡住');
  assert.equal(canMove(state, 1, -1, 0), false, '张飞不能移出左边框');
  assert.equal(applyMove(state, { piece: 0, dx: 1, dy: 0 }), null);

  const first = legalMoves(state)[0];
  const next = applyMove(state, first);
  assert.ok(next);
  assert.equal(validateState(next), true);
  assert.equal([...buildOccupancy(next)].filter((piece) => piece === -1).length, 2);
});

test('求解器生成的每一步都合法，并把曹操送到南门', () => {
  let state = createClassicState();
  const solution = solvePuzzle(state, { maxNodes: 120000 });
  assert.ok(solution);
  assert.equal(solution.length, 116, '本课件按一格平移计步');
  for (const move of solution) {
    const next = applyMove(state, move);
    assert.ok(next, `非法解法步骤 ${JSON.stringify(move)}`);
    state = next;
  }
  assert.equal(isSolved(state), true);
});

test('提示算法从任意解法中间态继续收敛到目标', () => {
  const full = solvePuzzle(createClassicState());
  let state = createClassicState();
  for (const move of full.slice(0, -12)) state = applyMove(state, move);

  for (let remaining = 12; remaining > 0; remaining -= 1) {
    const hintPath = solvePuzzle(state);
    assert.equal(hintPath.length, remaining);
    state = applyMove(state, hintPath[0]);
  }
  assert.equal(isSolved(state), true);
});

test('同形将领或小卒交换身份不会改变求解状态键', () => {
  const state = createClassicState();
  const swappedGuards = state.slice();
  [swappedGuards[12], swappedGuards[16]] = [swappedGuards[16], swappedGuards[12]];
  [swappedGuards[13], swappedGuards[17]] = [swappedGuards[17], swappedGuards[13]];
  assert.equal(stateKey(swappedGuards), stateKey(state));

  const swappedGenerals = state.slice();
  [swappedGenerals[2], swappedGenerals[4]] = [swappedGenerals[4], swappedGenerals[2]];
  [swappedGenerals[3], swappedGenerals[5]] = [swappedGenerals[5], swappedGenerals[3]];
  assert.equal(stateKey(swappedGenerals), stateKey(state));
});
