/* ============================================================
   金字塔魔方 · 初级还原 + 倒带兜底
   阶段：tips → centers → edges（BFS）
   输出：[{ vertex, layer, turns, stage }]
   ============================================================ */

const EDGES = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

function edgesAround(v) {
  const others = [0, 1, 2, 3].filter((i) => i !== v);
  // 固定组合顺序（与 3D 引擎右手序一致的近似：按编号排序后旋转对齐）
  // 使用预计算表，避免 three 依赖
  const TABLE = [
    [0, 1, 2], // v0: edges to 1,2,3 → edge ids 0,1,2
    [0, 3, 4], // v1: to 0,2,3 → 0,3,4
    [1, 3, 5], // v2: to 0,1,3 → 1,3,5
    [2, 4, 5], // v3: to 0,1,2 → 2,4,5
  ];
  return TABLE[v].slice();
}

function cloneState(s) {
  return {
    tipOri: [...s.tipOri],
    cenOri: [...s.cenOri],
    edgePerm: [...s.edgePerm],
    edgeOri: [...s.edgeOri],
  };
}

function apply(s, mv) {
  const t = ((mv.turns % 3) + 3) % 3;
  if (!t) return;
  for (let k = 0; k < t; k++) {
    s.tipOri[mv.vertex] = (s.tipOri[mv.vertex] + 1) % 3;
    if (mv.layer >= 1) {
      s.cenOri[mv.vertex] = (s.cenOri[mv.vertex] + 1) % 3;
      const e = edgesAround(mv.vertex);
      const p0 = s.edgePerm[e[0]]; const p1 = s.edgePerm[e[1]]; const p2 = s.edgePerm[e[2]];
      s.edgePerm[e[0]] = p2;
      s.edgePerm[e[1]] = p0;
      s.edgePerm[e[2]] = p1;
      const o0 = s.edgeOri[p0]; const o1 = s.edgeOri[p1]; const o2 = s.edgeOri[p2];
      // 朝向跟着零件走（本模型 moves 不改 edgeOri 数值）
      void o0; void o1; void o2;
    }
  }
}

function tipsSolved(s) { return s.tipOri.every((o) => o === 0); }
function centersSolved(s) { return s.cenOri.every((o) => o === 0); }
function edgesSolved(s) {
  for (let i = 0; i < 6; i++) if (s.edgePerm[i] !== i || s.edgeOri[i] !== 0) return false;
  return true;
}
function solved(s) { return tipsSolved(s) && centersSolved(s) && edgesSolved(s); }

function sig(s) {
  return s.tipOri.join('') + '|' + s.cenOri.join('') + '|' + s.edgePerm.join('') + '|' + s.edgeOri.join('');
}

/** 所有深层 + 尖角转动 */
function allMoves() {
  const m = [];
  for (let v = 0; v < 4; v++) {
    for (const layer of [0, 1]) {
      for (const turns of [1, 2]) m.push({ vertex: v, layer, turns });
    }
  }
  return m;
}

const MOVES = allMoves();
const DEEP = MOVES.filter((m) => m.layer === 1);
const TIP = MOVES.filter((m) => m.layer === 0);

function bfs(start, goal, moveSet, maxDepth = 8) {
  if (goal(start)) return [];
  const q = [{ s: cloneState(start), path: [] }];
  const seen = new Set([sig(start)]);
  while (q.length) {
    const cur = q.shift();
    if (cur.path.length >= maxDepth) continue;
    for (const mv of moveSet) {
      const ns = cloneState(cur.s);
      apply(ns, mv);
      const k = sig(ns);
      if (seen.has(k)) continue;
      seen.add(k);
      const path = [...cur.path, mv];
      if (goal(ns)) return path;
      q.push({ s: ns, path });
    }
  }
  return null;
}

/**
 * 初级层先：尖角 → 中心 → 棱
 * 失败时返回 null（由上层倒带）
 */
export function solvePyraminx(state) {
  if (!state) return null;
  const s = cloneState(state);
  if (solved(s)) return [];
  const out = [];

  // 1) tips
  if (!tipsSolved(s)) {
    const path = bfs(s, tipsSolved, TIP, 4);
    if (!path) return null;
    for (const mv of path) {
      apply(s, mv);
      out.push({ ...mv, stage: 'tips' });
    }
  }

  // 2) centers（只动深层；可能暂时弄乱棱）
  if (!centersSolved(s)) {
    const path = bfs(s, (x) => tipsSolved(x) && centersSolved(x), DEEP, 6);
    if (!path) {
      // 放宽：允许尖角一起动
      const path2 = bfs(s, (x) => tipsSolved(x) && centersSolved(x), MOVES, 7);
      if (!path2) return null;
      for (const mv of path2) {
        apply(s, mv);
        out.push({ ...mv, stage: 'centers' });
      }
    } else {
      for (const mv of path) {
        apply(s, mv);
        out.push({ ...mv, stage: 'centers' });
      }
    }
  }

  // 3) edges
  if (!edgesSolved(s)) {
    const path = bfs(s, solved, DEEP, 10);
    if (!path) {
      const path2 = bfs(s, solved, MOVES, 11);
      if (!path2) return null;
      for (const mv of path2) {
        apply(s, mv);
        out.push({ ...mv, stage: 'edges' });
      }
    } else {
      for (const mv of path) {
        apply(s, mv);
        out.push({ ...mv, stage: 'edges' });
      }
    }
  }

  return out;
}

export function isSolvedState(state) {
  return solved(state);
}

/** 与 3D 引擎 edgesAround 顺序可能略有差异时，倒带始终正确 */
export function invertMove(mv) {
  return { vertex: mv.vertex, layer: mv.layer, turns: (3 - (mv.turns % 3)) % 3 };
}
