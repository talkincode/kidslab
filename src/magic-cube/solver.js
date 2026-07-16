/* ============================================================
   魔方小达人 · 层先法求解器（孩子的公式，不是 AI 最优解）
   —— 白顶体系（白心固定朝上、黄在底）：
      3×3：拼白十字 → 右手公式装白角 → 中层棱回家 →
            底面黄十字 → 小鱼公式翻黄面 → 角排座位 → 棱排座位
      2×2：装白面 → 小鱼公式翻黄面 → 底层排座位
   纯数据实现，无 three.js 依赖，Node 可直接单测。
   输出：[{ axis, coord, turns, stage }]，stage 是阶段 key。
   ============================================================ */

/* 面色号（与 cube3d SKINS 顺序一致）：+x红0 -x橙1 +y白2 -y黄3 +z绿4 -z蓝5 */
const W = 2, Y = 3;
const DIR = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const faceOf = (n) => DIR.findIndex((d) => d[0] === n[0] && d[1] === n[1] && d[2] === n[2]);

function rot90(v, axis) {
  const [x, y, z] = v;
  if (axis === 0) return [x, -z, y];
  if (axis === 1) return [z, y, -x];
  return [-y, x, z];
}
function rotN(v, axis, k) { let r = v; for (let i = 0; i < k; i++) r = rot90(r, axis); return r; }

/** 虚拟魔方：pieces = [{ c, st:[{n, col}] }] */
function apply(pieces, mv) {
  const k = ((mv.turns % 4) + 4) % 4;
  if (!k) return;
  for (const p of pieces) {
    if (p.c[mv.axis] !== mv.coord) continue;
    p.c = rotN(p.c, mv.axis, k);
    for (const s of p.st) s.n = rotN(s.n, mv.axis, k);
  }
}
const clone = (pieces) => pieces.map((p) => ({ c: [...p.c], st: p.st.map((s) => ({ n: [...s.n], col: s.col })) }));
const key = (mv) => `${mv.axis}:${mv.coord}:${((mv.turns % 4) + 4) % 4}`;

/** 记号 → move（m = N-1 的层坐标；3×3 额外含中层 M/E/S 用于摆正中心） */
function makeMoves(m) {
  return {
    R: { axis: 0, coord: m, turns: 3 }, "R'": { axis: 0, coord: m, turns: 1 }, R2: { axis: 0, coord: m, turns: 2 },
    L: { axis: 0, coord: -m, turns: 1 }, "L'": { axis: 0, coord: -m, turns: 3 }, L2: { axis: 0, coord: -m, turns: 2 },
    U: { axis: 1, coord: m, turns: 3 }, "U'": { axis: 1, coord: m, turns: 1 }, U2: { axis: 1, coord: m, turns: 2 },
    D: { axis: 1, coord: -m, turns: 1 }, "D'": { axis: 1, coord: -m, turns: 3 }, D2: { axis: 1, coord: -m, turns: 2 },
    F: { axis: 2, coord: m, turns: 3 }, "F'": { axis: 2, coord: m, turns: 1 }, F2: { axis: 2, coord: m, turns: 2 },
    B: { axis: 2, coord: -m, turns: 1 }, "B'": { axis: 2, coord: -m, turns: 3 }, B2: { axis: 2, coord: -m, turns: 2 },
    M: { axis: 0, coord: 0, turns: 1 }, "M'": { axis: 0, coord: 0, turns: 3 }, M2: { axis: 0, coord: 0, turns: 2 },
    E: { axis: 1, coord: 0, turns: 1 }, "E'": { axis: 1, coord: 0, turns: 3 }, E2: { axis: 1, coord: 0, turns: 2 },
    S: { axis: 2, coord: 0, turns: 3 }, "S'": { axis: 2, coord: 0, turns: 1 }, S2: { axis: 2, coord: 0, turns: 2 },
  };
}

export function isSolvedState(pieces) {
  for (const p of pieces) for (const s of p.st) {
    const f = faceOf(s.n);
    if (f < 0 || s.col !== f) return false;
  }
  return true;
}

/* ============ 求解上下文 ============ */
function ctx(pieces, m) {
  const MV = makeMoves(m);
  const out = [];
  let stage = '';
  const doSeq = (names) => {
    for (const nm of names.split(' ')) {
      if (!nm) continue;
      const mv = MV[nm];
      apply(pieces, mv);
      out.push({ ...mv, stage });
    }
  };
  const doMove = (mv) => { apply(pieces, mv); out.push({ ...mv, stage }); };
  return {
    pieces, m, MV, out,
    /* 外层转动集合（BFS 用，禁中层，避免转乱中心门牌） */
    outerMV: Object.entries(MV).filter(([k]) => !/^[MES]/.test(k)).map(([, v]) => v),
    midMV: Object.entries(MV).filter(([k]) => /^[MES]/.test(k)).map(([, v]) => v),
    setStage: (s) => { stage = s; },
    seq: doSeq, move: doMove,
    edge: (a, b) => pieces.find((p) => p.st.length === 2 && p.st.some((s) => s.col === a) && p.st.some((s) => s.col === b)),
    corner: (a, b, c) => pieces.find((p) => p.st.length === 3 && [a, b, c].every((x) => p.st.some((s) => s.col === x))),
    stOf: (p, col) => p.st.find((s) => s.col === col),
  };
}

/** BFS：找 ≤maxDepth 步使 goal 成立且 keep 保持（中途允许破坏；sigOf 提供轻量签名加速） */
function bfs(C, goal, keep, maxDepth = 5, sigOf = sig, moveSet = null) {
  if (goal(C.pieces) && (!keep || keep(C.pieces))) return true;
  const moves = moveSet || C.outerMV;
  const start = clone(C.pieces);
  const q = [{ p: start, path: [] }];
  const seen = new Set([sigOf(start)]);
  while (q.length) {
    const cur = q.shift();
    if (cur.path.length >= maxDepth) continue;
    for (const mv of moves) {
      const np = clone(cur.p);
      apply(np, mv);
      const s = sigOf(np);
      if (seen.has(s)) continue;
      seen.add(s);
      const path = [...cur.path, mv];
      if (goal(np) && (!keep || keep(np))) {
        for (const m of path) C.move(m);
        return true;
      }
      q.push({ p: np, path });
    }
  }
  return false;
}
const sig = (pieces) => pieces.map((p) => p.c.join(',') + '|' + p.st.map((s) => s.n.join(',') + s.col).join(';')).join('/');

/** 宏搜索：动作 = D 预转 0~3 次 + 固定公式，BFS 到 goal（孩子式：永远在套公式） */
function macroBFS(C, formula, goal, maxDepth = 6) {
  if (goal(C.pieces)) return true;
  const pres = ['', 'D', 'D2', "D'"];
  const start = clone(C.pieces);
  const q = [{ p: start, path: [] }];
  const seen = new Set([sig(start)]);
  while (q.length) {
    const cur = q.shift();
    if (cur.path.length >= maxDepth) continue;
    for (const pre of pres) {
      const np = clone(cur.p);
      const names = (pre ? pre + ' ' : '') + formula;
      for (const nm of names.split(' ')) apply(np, C.MV[nm]);
      const s = sig(np);
      if (seen.has(s)) continue;
      seen.add(s);
      const path = [...cur.path, names];
      if (goal(np)) {
        for (const seq of path) C.seq(seq);
        return true;
      }
      q.push({ p: np, path });
    }
  }
  return false;
}
/** 目标谓词加壳：允许最后再补 0~3 次 D 对齐 */
function upToD(C, pred) {
  return (pieces) => {
    const t = clone(pieces);
    for (let k = 0; k < 4; k++) {
      if (pred(t)) return true;
      apply(t, C.MV.D);
    }
    return false;
  };
}
function finishAlignD(C, pred) {
  for (let k = 0; k < 4; k++) {
    if (pred(C.pieces)) return true;
    C.seq('D');
  }
  return pred(C.pieces);
}

/* ============ 3×3 阶段实现（白顶：W=+y, Y=-y） ============ */

/** 棱归位判定：白贴纸朝上、侧色贴纸朝对应中心 */
const edgeHome = (p, col) => {
  const w = p.st.find((s) => s.col === W), o = p.st.find((s) => s.col === col);
  return faceOf(w.n) === W && faceOf(o.n) === col;
};
const cornerHomeW = (p) => p.st.every((s) => faceOf(s.n) === s.col);

/** 3×3 第 0 步：用中层转动摆正 6 个中心门牌（白上黄下红右绿前） */
function solveOrient(C) {
  C.setStage('orient');
  const centersOk = (ps) => ps.filter((p) => p.st.length === 1).every((p) => faceOf(p.st[0].n) === p.st[0].col);
  const sigOf = (ps) => ps.filter((p) => p.st.length === 1).map((p) => p.c.join(',') + p.st[0].col).join('/');
  if (!bfs(C, centersOk, null, 4, sigOf, C.midMV)) throw new Error('orient');
}

function solveCross(C) {
  C.setStage('cross');
  const done = [];
  const edgeOf = (ps, col) => ps.find((p) => p.st.length === 2 && p.st.some((s) => s.col === W) && p.st.some((s) => s.col === col));
  for (const col of [4, 0, 5, 1]) {           // 绿 红 蓝 橙
    const ok = (ps) => edgeHome(edgeOf(ps, col), col);
    const keep = (ps) => done.every((dc) => edgeHome(edgeOf(ps, dc), dc));
    /* 轻签名：只看目标棱与已完成棱 → 状态空间极小，深搜也秒回 */
    const sigOf = (ps) => [col, ...done].map((c) => {
      const e = edgeOf(ps, c);
      return e.c.join(',') + '#' + e.st.map((s) => s.n.join(',') + s.col).join(';');
    }).join('/');
    if (!bfs(C, ok, keep, 7, sigOf)) throw new Error(`cross ${col}`);
    done.push(col);
  }
}

/** 白角：拽下 → D 对齐 → 重复右手公式 (侧′ D′ 侧 D) */
const CORNER_SLOTS = [
  { pos: [1, 1, 1], cols: [W, 0, 4], seq: "R' D' R D" },    // U-R-F
  { pos: [-1, 1, 1], cols: [W, 1, 4], seq: "F' D' F D" },   // U-L-F（用 F 当右手）
  { pos: [-1, 1, -1], cols: [W, 1, 5], seq: "L' D' L D" },  // U-L-B
  { pos: [1, 1, -1], cols: [W, 0, 5], seq: "B' D' B D" },   // U-R-B
];
function solveCornersW(C) {
  C.setStage('corners');
  const m = C.m;
  for (const slot of CORNER_SLOTS) {
    const target = () => C.corner(...slot.cols);
    if (cornerHomeW(target())) continue;
    /* 在顶层别的槽？先套那个槽的公式一次拽下来 */
    let p = target();
    if (p.c[1] === m) {
      const s = CORNER_SLOTS.find((sl) => sl.pos.every((v, i) => v * m === p.c[i]));
      C.seq(s.seq);
    }
    /* D 转对齐到槽正下方 */
    p = target();
    const want = [slot.pos[0] * m, -m, slot.pos[2] * m];
    for (let k = 0; k < 4; k++) {
      if (p.c[0] === want[0] && p.c[2] === want[2]) break;
      C.seq('D');
      p = target();
    }
    /* 重复右手公式直到归位 */
    for (let k = 0; k < 8 && !cornerHomeW(target()); k++) C.seq(slot.seq);
    if (!cornerHomeW(target())) throw new Error('corner');
  }
}

/** 中层棱：顶出 → D 对齐 → 右插/左插 */
const MID_SLOTS = [
  { pos: [1, 0, 1], cols: [0, 4] },   // R-F
  { pos: [-1, 0, 1], cols: [1, 4] },  // L-F
  { pos: [-1, 0, -1], cols: [1, 5] }, // L-B
  { pos: [1, 0, -1], cols: [0, 5] },  // R-B
];
/* 从底层插入中层槽：key = `${朝侧贴纸的色},${朝下贴纸的色}`
   右插模板 D r D′ r′ D′ f′ D f（基准 (B,R) 由标准公式 x2 共轭严格导出，其余绕 y 派生） */
const INSERT = {
  '5,0': "D R D' R' D' B' D B",   // 朝B蓝 · 槽 B|R 右插
  '1,5': "D B D' B' D' L' D L",   // 朝L橙 · 槽 L|B 右插
  '4,1': "D L D' L' D' F' D F",   // 朝F绿 · 槽 F|L 右插
  '0,4': "D F D' F' D' R' D R",   // 朝R红 · 槽 R|F 右插
  '5,1': "D' L' D L D B D' B'",   // 朝B蓝 · 槽 B|L 左插
  '1,4': "D' F' D F D L D' L'",   // 朝L橙 · 槽 L|F 左插
  '4,0': "D' R' D R D F D' F'",   // 朝F绿 · 槽 F|R 左插
  '0,5': "D' B' D B D R D' R'",   // 朝R红 · 槽 R|B 左插
};
function solveMiddle(C) {
  C.setStage('middle');
  const m = C.m;
  const homeMid = (p) => p.st.every((s) => faceOf(s.n) === s.col);
  for (const slot of MID_SLOTS) {
    const target = () => C.edge(...slot.cols);
    if (homeMid(target())) continue;
    let p = target();
    /* 卡在中层？用任一插入把它顶出到底层 */
    if (p.c[1] === 0) {
      const sl = MID_SLOTS.find((s) => s.pos[0] * m === p.c[0] && s.pos[2] * m === p.c[2]);
      C.seq(INSERT[`${sl.cols[1]},${sl.cols[0]}`]);   // 对着该槽随便插一次 → 目标棱被顶出
      p = target();
    }
    /* 底层：转 D 使其中一张贴纸对齐所属中心（贴纸朝向面 f 就绪），选公式 */
    let okKey = null;
    for (let k = 0; k < 4 && !okKey; k++) {
      p = target();
      const side = p.st.find((s) => faceOf(s.n) !== Y && faceOf(s.n) !== W);
      const f = faceOf(side.n);
      if (f === side.col) okKey = `${side.col},${p.st.find((s) => s !== side).col}`;
      else C.seq('D');
    }
    if (!okKey) throw new Error('mid align');
    C.seq(INSERT[okKey]);
    if (!homeMid(target())) throw new Error('mid insert');
  }
}

/** 底面黄十字：宏搜索 = D 预转 + (B R D R′ D′ B′)，孩子式"摆好再套公式" */
const yellowCrossPred = (ps) => ps
  .filter((p) => p.st.length === 2 && p.st.some((s) => s.col === Y))
  .every((p) => faceOf(p.st.find((s) => s.col === Y).n) === Y);
function solveYellowCross(C) {
  C.setStage('yellowCross');
  if (!macroBFS(C, "B R D R' D' B'", yellowCrossPred, 6)) throw new Error('yellow cross');
}

/** 黄面小鱼：宏搜索 = D 预转 + (R D R′ D R D2 R′) */
const yellowFacePred = (ps) => ps
  .filter((p) => p.st.length === 3 && p.st.some((s) => s.col === Y))
  .every((p) => faceOf(p.st.find((s) => s.col === Y).n) === Y);
function solveYellowFace(C) {
  C.setStage('yellowFace');
  if (!macroBFS(C, "R D R' D R D2 R'", yellowFacePred, 6)) throw new Error('yellow face');
}

/** 底层角排座位：宏搜索 = D 预转 + A-perm 映射（D 对齐后全部归位） */
const cornersPermPred = (ps) => ps
  .filter((p) => p.st.length === 3 && p.st.some((s) => s.col === Y))
  .every((p) => p.st.every((s) => faceOf(s.n) === s.col));
function solvePermCorners(C) {
  C.setStage('permCorners');
  if (!macroBFS(C, "D R D' L' D R' D' L", upToD(C, cornersPermPred), 5)) throw new Error('perm corners');
  finishAlignD(C, cornersPermPred);
}

/** 底层棱排座位：宏搜索 = D 预转 + Ua-perm 映射 → 完全还原 */
function solvePermEdges(C) {
  C.setStage('permEdges');
  if (!macroBFS(C, "R D' R D R D R D' R' D' R2", upToD(C, isSolvedState), 5)) throw new Error('perm edges');
  finishAlignD(C, isSolvedState);
}

/* ============ 2×2（白顶）：白面 → 黄面朝向 → 底层排位 ============ */

function solve2FirstFace(C) {
  C.setStage('firstFace');
  const m = C.m;
  /* 锚：白-红-绿角 → BFS 放到 U-R-F 正位（轻签名只看锚） */
  const anchorOf = (ps) => ps.find((q) => [W, 0, 4].every((c) => q.st.some((s) => s.col === c)));
  const anchorOk = (ps) => anchorOf(ps).st.every((s) => faceOf(s.n) === s.col);
  const sigOf = (ps) => {
    const p = anchorOf(ps);
    return p.c.join(',') + '#' + p.st.map((s) => s.n.join(',') + s.col).join(';');
  };
  if (!bfs(C, anchorOk, null, 6, sigOf)) throw new Error('anchor');
  /* 其余三个白角：拽下 → D 对齐 → 槽公式（避开锚所在层的 R？公式按槽选） */
  const slots = [
    { pos: [-1, 1, 1], cols: [W, 1, 4], seq: "F' D' F D" },
    { pos: [-1, 1, -1], cols: [W, 1, 5], seq: "L' D' L D" },
    { pos: [1, 1, -1], cols: [W, 0, 5], seq: "B' D' B D" },
  ];
  for (const slot of slots) {
    const target = () => C.corner(...slot.cols);
    if (target().st.every((s) => faceOf(s.n) === s.col)) continue;
    let p = target();
    if (p.c[1] === m) {
      const s = slots.find((sl) => sl.pos.every((v, i) => v * m === p.c[i]));
      C.seq(s ? s.seq : "R' D' R D");   // 在锚槽不可能（锚已占）
    }
    p = target();
    const want = [slot.pos[0] * m, slot.pos[2] * m];
    for (let k = 0; k < 4; k++) {
      if (p.c[0] === want[0] && p.c[2] === want[1]) break;
      C.seq('D');
      p = target();
    }
    for (let k = 0; k < 8 && !target().st.every((s) => faceOf(s.n) === s.col); k++) C.seq(slot.seq);
    if (!target().st.every((s) => faceOf(s.n) === s.col)) throw new Error('2x2 face');
  }
}
function solve2Orient(C) {
  C.setStage('yellowFace');
  solveYellowFace(C);   // 逻辑通用（角块小鱼）
}
function solve2Perm(C) {
  C.setStage('permCorners');
  /* 宏搜索 = D 预转 + J-perm 映射（R D R′ D′ R′ B R2 D′ R′ D′ R D R′ B′） */
  if (!macroBFS(C, "R D R' D' R' B R2 D' R' D' R D R' B'", upToD(C, isSolvedState), 4)) throw new Error('2x2 perm');
  finishAlignD(C, isSolvedState);
}

/* ============ 入口 ============ */
export function solveLBL(state, n, debug = false) {
  const pieces = clone(state);
  const m = n - 1;
  const C = ctx(pieces, m);
  try {
    if (n === 3) {
      solveOrient(C);
      solveCross(C);
      solveCornersW(C);
      solveMiddle(C);
      solveYellowCross(C);
      solveYellowFace(C);
      solvePermCorners(C);
      solvePermEdges(C);
    } else if (n === 2) {
      solve2FirstFace(C);
      solve2Orient(C);
      solve2Perm(C);
    } else {
      return null;
    }
  } catch (e) {
    if (debug) console.log('  [solver]', e.message);
    return null;
  }
  if (!isSolvedState(pieces)) return null;
  /* 压缩相邻同层转动（跨阶段也合并，避免“转过去又转回来”；stage 归属后一阶段） */
  const merged = [];
  for (const mv of C.out) {
    const last = merged[merged.length - 1];
    if (last && last.axis === mv.axis && last.coord === mv.coord) {
      last.turns = (last.turns + mv.turns) % 4;
      last.stage = mv.stage;
      if (!last.turns) merged.pop();
    } else {
      merged.push({ ...mv });
    }
  }
  return merged;
}
