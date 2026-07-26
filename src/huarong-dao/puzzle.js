export const BOARD_COLS = 4;
export const BOARD_ROWS = 5;

export const PIECES = Object.freeze([
  { id: 'cao', role: 'hero', w: 2, h: 2, zh: '曹操', en: 'Cao Cao' },
  { id: 'zhang', role: 'general', w: 1, h: 2, zh: '张飞', en: 'Zhang Fei' },
  { id: 'zhao', role: 'general', w: 1, h: 2, zh: '赵云', en: 'Zhao Yun' },
  { id: 'ma', role: 'general', w: 1, h: 2, zh: '马超', en: 'Ma Chao' },
  { id: 'huang', role: 'general', w: 1, h: 2, zh: '黄忠', en: 'Huang Zhong' },
  { id: 'guan', role: 'gate', w: 2, h: 1, zh: '关羽', en: 'Guan Yu' },
  { id: 'guard-a', role: 'guard', w: 1, h: 1, zh: '卒', en: 'Guard' },
  { id: 'guard-b', role: 'guard', w: 1, h: 1, zh: '卒', en: 'Guard' },
  { id: 'guard-c', role: 'guard', w: 1, h: 1, zh: '卒', en: 'Guard' },
  { id: 'guard-d', role: 'guard', w: 1, h: 1, zh: '卒', en: 'Guard' },
]);

const START_PAIRS = [
  [1, 0], [0, 0], [3, 0], [0, 2], [3, 2],
  [1, 2], [1, 3], [2, 3], [0, 4], [3, 4],
];

export const DIRECTIONS = Object.freeze([
  { dx: 0, dy: -1, key: 'up' },
  { dx: 1, dy: 0, key: 'right' },
  { dx: 0, dy: 1, key: 'down' },
  { dx: -1, dy: 0, key: 'left' },
]);

export function createClassicState() {
  return START_PAIRS.flat();
}

export function cloneState(state) {
  return state.slice();
}

export function piecePosition(state, piece) {
  return { x: state[piece * 2], y: state[piece * 2 + 1] };
}

export function stateKey(state) {
  const fixed = [state[0], state[1], state[10], state[11]];
  const generals = [];
  for (let i = 1; i <= 4; i += 1) {
    generals.push(state[i * 2 + 1] * BOARD_COLS + state[i * 2]);
  }
  generals.sort((a, b) => a - b);
  const guards = [];
  for (let i = 6; i < PIECES.length; i += 1) {
    guards.push(state[i * 2 + 1] * BOARD_COLS + state[i * 2]);
  }
  guards.sort((a, b) => a - b);
  return `${fixed.join(',')}|${generals.join(',')}|${guards.join(',')}`;
}

export function buildOccupancy(state, ignorePiece = -1) {
  const cells = new Int8Array(BOARD_COLS * BOARD_ROWS);
  cells.fill(-1);
  for (let i = 0; i < PIECES.length; i += 1) {
    if (i === ignorePiece) continue;
    const piece = PIECES[i];
    const x = state[i * 2];
    const y = state[i * 2 + 1];
    for (let row = y; row < y + piece.h; row += 1) {
      for (let col = x; col < x + piece.w; col += 1) {
        cells[row * BOARD_COLS + col] = i;
      }
    }
  }
  return cells;
}

export function canMove(state, pieceIndex, dx, dy) {
  const piece = PIECES[pieceIndex];
  if (!piece || Math.abs(dx) + Math.abs(dy) !== 1) return false;
  const x = state[pieceIndex * 2] + dx;
  const y = state[pieceIndex * 2 + 1] + dy;
  if (x < 0 || y < 0 || x + piece.w > BOARD_COLS || y + piece.h > BOARD_ROWS) return false;
  const cells = buildOccupancy(state, pieceIndex);
  for (let row = y; row < y + piece.h; row += 1) {
    for (let col = x; col < x + piece.w; col += 1) {
      if (cells[row * BOARD_COLS + col] !== -1) return false;
    }
  }
  return true;
}

export function legalMoves(state, pieceIndex = null) {
  const moves = [];
  const first = pieceIndex === null ? 0 : pieceIndex;
  const last = pieceIndex === null ? PIECES.length : pieceIndex + 1;
  for (let piece = first; piece < last; piece += 1) {
    for (const direction of DIRECTIONS) {
      if (canMove(state, piece, direction.dx, direction.dy)) {
        moves.push({ piece, dx: direction.dx, dy: direction.dy });
      }
    }
  }
  return moves;
}

export function applyMove(state, move) {
  if (!canMove(state, move.piece, move.dx, move.dy)) return null;
  const next = state.slice();
  next[move.piece * 2] += move.dx;
  next[move.piece * 2 + 1] += move.dy;
  return next;
}

export function invertMove(move) {
  return { piece: move.piece, dx: -move.dx, dy: -move.dy };
}

export function isSolved(state) {
  return state[0] === 1 && state[1] === 3;
}

export function validateState(state) {
  if (!Array.isArray(state) || state.length !== PIECES.length * 2) return false;
  const cells = new Int8Array(BOARD_COLS * BOARD_ROWS);
  cells.fill(-1);
  for (let i = 0; i < PIECES.length; i += 1) {
    const piece = PIECES[i];
    const x = state[i * 2];
    const y = state[i * 2 + 1];
    if (!Number.isInteger(x) || !Number.isInteger(y)) return false;
    if (x < 0 || y < 0 || x + piece.w > BOARD_COLS || y + piece.h > BOARD_ROWS) return false;
    for (let row = y; row < y + piece.h; row += 1) {
      for (let col = x; col < x + piece.w; col += 1) {
        const cell = row * BOARD_COLS + col;
        if (cells[cell] !== -1) return false;
        cells[cell] = i;
      }
    }
  }
  return true;
}

export function solvePuzzle(startState, { maxNodes = 120000 } = {}) {
  if (!validateState(startState)) return null;
  if (isSolved(startState)) return [];

  const states = [startState.slice()];
  const parents = [-1];
  const moves = [null];
  const visited = new Map([[stateKey(startState), 0]]);

  for (let head = 0; head < states.length && states.length < maxNodes; head += 1) {
    const state = states[head];
    for (const move of legalMoves(state)) {
      const next = applyMove(state, move);
      const key = stateKey(next);
      if (visited.has(key)) continue;
      const index = states.length;
      states.push(next);
      parents.push(head);
      moves.push(move);
      visited.set(key, index);
      if (!isSolved(next)) continue;

      const path = [];
      for (let cursor = index; parents[cursor] !== -1; cursor = parents[cursor]) {
        path.push(moves[cursor]);
      }
      return path.reverse();
    }
  }
  return null;
}

export function moveLabel(move, lang = 'zh') {
  const piece = PIECES[move.piece];
  const direction = DIRECTIONS.find((item) => item.dx === move.dx && item.dy === move.dy);
  const names = lang === 'zh'
    ? { up: '向上', right: '向右', down: '向下', left: '向左' }
    : { up: 'up', right: 'right', down: 'down', left: 'left' };
  return lang === 'zh'
    ? `${piece.zh}${names[direction.key]}一步`
    : `Move ${piece.en} one step ${names[direction.key]}`;
}
