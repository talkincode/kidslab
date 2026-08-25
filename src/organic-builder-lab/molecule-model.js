/**
 * 有机分子工坊 · 分子图与空间构型模型
 *
 * 纯函数层：分子只是「原子 + 键」的图。价键计数、分子式、同分异构判定和
 * VSEPR 空间布点都在这里完成，渲染层只负责把坐标画出来。
 */

export const ELEMENTS = Object.freeze({
  C: Object.freeze({ symbol: 'C', valence: 4 }),
  H: Object.freeze({ symbol: 'H', valence: 1 }),
  O: Object.freeze({ symbol: 'O', valence: 2 }),
});

/* 键长取常见平均键长的近似值，单位 Å；只用于按比例作图，不作为测量结果 */
export const BOND_LENGTHS = Object.freeze({
  'C-C': 1.54,
  'C=C': 1.34,
  'C-H': 1.09,
  'C-O': 1.43,
  'C=O': 1.23,
  'O-H': 0.96,
});

export const TETRAHEDRAL_ANGLE = 109.47;
export const TRIGONAL_ANGLE = 120;
export const BENT_ANGLE = 104.5;

const DEG = Math.PI / 180;
const CAPACITY = Object.freeze({ tetrahedral: 4, trigonal: 3, linear: 2, bent: 2, terminal: 1 });

/* ------------------------------ 向量工具 ------------------------------ */

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scale = (v, k) => [v[0] * k, v[1] * k, v[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const length = (v) => Math.hypot(v[0], v[1], v[2]);

function normalize(v) {
  const n = length(v);
  return n > 1e-9 ? scale(v, 1 / n) : [1, 0, 0];
}

function anyPerpendicular(v) {
  for (const axis of [[0, 1, 0], [1, 0, 0], [0, 0, 1]]) {
    const candidate = cross(v, axis);
    if (length(candidate) > 0.25) return normalize(candidate);
  }
  return [1, 0, 0];
}

/* 把参考法线投影成与 axis 严格垂直的单位向量，保证 sp² 体系共面 */
function orthogonalizeTo(reference, axis) {
  const projected = sub(reference, scale(axis, dot(reference, axis)));
  return length(projected) > 0.05 ? normalize(projected) : anyPerpendicular(axis);
}

/* ------------------------------ 分子图 ------------------------------ */

export function createMolecule() {
  return { atoms: [], bonds: [], nextId: 1 };
}

function cloneMolecule(molecule) {
  return {
    atoms: molecule.atoms.map((atom) => ({ ...atom })),
    bonds: molecule.bonds.map((bond) => ({ ...bond })),
    nextId: molecule.nextId,
  };
}

export function atomById(molecule, atomId) {
  return molecule.atoms.find((atom) => atom.id === atomId) || null;
}

export function bondById(molecule, bondId) {
  return molecule.bonds.find((bond) => bond.id === bondId) || null;
}

export function elementOf(molecule, atomId) {
  return atomById(molecule, atomId)?.element || null;
}

export function bondBetween(molecule, a, b) {
  return molecule.bonds.find(
    (bond) => (bond.a === a && bond.b === b) || (bond.a === b && bond.b === a),
  ) || null;
}

export function adjacency(molecule) {
  const map = new Map(molecule.atoms.map((atom) => [atom.id, []]));
  for (const bond of molecule.bonds) {
    map.get(bond.a)?.push({ id: bond.b, order: bond.order, bondId: bond.id });
    map.get(bond.b)?.push({ id: bond.a, order: bond.order, bondId: bond.id });
  }
  return map;
}

export function neighborsOf(molecule, atomId) {
  return adjacency(molecule).get(atomId) || [];
}

export function usedValence(molecule, atomId) {
  return molecule.bonds.reduce(
    (total, bond) => total + (bond.a === atomId || bond.b === atomId ? bond.order : 0),
    0,
  );
}

export function freeValence(molecule, atomId) {
  const atom = atomById(molecule, atomId);
  if (!atom) return 0;
  return ELEMENTS[atom.element].valence - usedValence(molecule, atomId);
}

/** 未成键的价数总和为 0 且至少有一个原子，才算一个完整分子 */
export function isComplete(molecule) {
  if (!molecule.atoms.length) return false;
  return molecule.atoms.every((atom) => freeValence(molecule, atom.id) === 0);
}

export function addAtom(molecule, element) {
  if (!ELEMENTS[element]) return { molecule, atomId: null };
  const next = cloneMolecule(molecule);
  const atomId = next.nextId;
  next.nextId += 1;
  next.atoms.push({ id: atomId, element });
  return { molecule: next, atomId };
}

/** 在 hostId 的空价位上接一个新原子；余价不足时原样返回 */
export function attachAtom(molecule, hostId, element, order = 1) {
  const host = atomById(molecule, hostId);
  if (!host || !ELEMENTS[element] || order < 1) return { molecule, atomId: null };
  if (freeValence(molecule, hostId) < order) return { molecule, atomId: null };
  if (ELEMENTS[element].valence < order) return { molecule, atomId: null };
  const seeded = addAtom(molecule, element);
  const next = seeded.molecule;
  next.bonds.push({ id: `b${next.nextId}`, a: hostId, b: seeded.atomId, order });
  next.nextId += 1;
  return { molecule: next, atomId: seeded.atomId };
}

/** 提升/降低键级；任一端余价不足时拒绝，保证价键守恒 */
export function setBondOrder(molecule, bondId, order) {
  const bond = bondById(molecule, bondId);
  if (!bond || order < 1 || order > 3) return { molecule, changed: false };
  const delta = order - bond.order;
  if (delta === 0) return { molecule, changed: false };
  if (delta > 0 && (freeValence(molecule, bond.a) < delta || freeValence(molecule, bond.b) < delta)) {
    return { molecule, changed: false };
  }
  const next = cloneMolecule(molecule);
  bondById(next, bondId).order = order;
  return { molecule: next, changed: true };
}

export function cycleBondOrder(molecule, bondId) {
  const bond = bondById(molecule, bondId);
  if (!bond) return { molecule, changed: false };
  const raised = setBondOrder(molecule, bondId, bond.order + 1);
  if (raised.changed) return raised;
  return setBondOrder(molecule, bondId, 1);
}

/** 删除一个原子及其所有键；只允许删末端原子，避免把分子拆成两块 */
export function removeAtom(molecule, atomId) {
  const degree = neighborsOf(molecule, atomId).length;
  if (!atomById(molecule, atomId) || degree > 1) return { molecule, removed: false };
  const next = cloneMolecule(molecule);
  next.atoms = next.atoms.filter((atom) => atom.id !== atomId);
  next.bonds = next.bonds.filter((bond) => bond.a !== atomId && bond.b !== atomId);
  return { molecule: next, removed: true };
}

/** 把所有剩余空价补成氢原子，用于生成参考分子 */
export function fillHydrogens(molecule) {
  let current = molecule;
  for (const atom of molecule.atoms) {
    let guard = 0;
    while (freeValence(current, atom.id) > 0 && guard < 8) {
      current = attachAtom(current, atom.id, 'H').molecule;
      guard += 1;
    }
  }
  return current;
}

/* ------------------------------ 分子式与同分异构 ------------------------------ */

/** Hill 系统：先 C，再 H，其余元素按字母序 */
export function molecularFormula(molecule) {
  const counts = new Map();
  for (const atom of molecule.atoms) counts.set(atom.element, (counts.get(atom.element) || 0) + 1);
  const rest = [...counts.keys()].filter((el) => el !== 'C' && el !== 'H').sort();
  const order = [...(counts.has('C') ? ['C'] : []), ...(counts.has('H') ? ['H'] : []), ...rest];
  return order
    .map((el) => `${el}${counts.get(el) > 1 ? counts.get(el) : ''}`)
    .join('');
}

const BOND_MARK = Object.freeze({ 1: '-', 2: '=', 3: '#' });

/**
 * 无根树的 AHU 规范形：以每个原子为根做「元素 + 有序子串」序列化，取字典序最小。
 * 分子只有十几个原子，O(n²) 完全够用；连通性相同则串相同，异构体串不同。
 */
export function canonicalKey(molecule) {
  if (!molecule.atoms.length) return '';
  const adj = adjacency(molecule);
  const serialize = (atomId, parentId, depth) => {
    if (depth > molecule.atoms.length + 1) return '*';
    const children = (adj.get(atomId) || [])
      .filter((edge) => edge.id !== parentId)
      .map((edge) => `${BOND_MARK[edge.order]}${serialize(edge.id, atomId, depth + 1)}`)
      .sort();
    return `${elementOf(molecule, atomId)}(${children.join('')})`;
  };
  return molecule.atoms
    .map((atom) => serialize(atom.id, null, 0))
    .sort()[0];
}

export function isSameSkeleton(a, b) {
  return canonicalKey(a) === canonicalKey(b);
}

/* ------------------------------ 官能团 ------------------------------ */

/**
 * 按课标教学顺序识别一个主官能团：羧基 → 碳碳双键 → 羟基 → 醚键 → 烷烃。
 * 羧基必须排在最前：它同时含有 C=O 和 O—H，否则会被误判成醇。
 */
export function detectFunctionalGroup(molecule) {
  if (!molecule.atoms.length) return 'empty';
  const adj = adjacency(molecule);
  const el = (id) => elementOf(molecule, id);

  for (const atom of molecule.atoms) {
    if (atom.element !== 'C') continue;
    const edges = adj.get(atom.id) || [];
    const hasCarbonyl = edges.some((edge) => el(edge.id) === 'O' && edge.order === 2);
    const hasHydroxyl = edges.some((edge) => {
      if (el(edge.id) !== 'O' || edge.order !== 1) return false;
      return (adj.get(edge.id) || []).some((sub) => el(sub.id) === 'H');
    });
    if (hasCarbonyl && hasHydroxyl) return 'carboxyl';
  }

  if (molecule.bonds.some((bond) => bond.order === 2 && el(bond.a) === 'C' && el(bond.b) === 'C')) {
    return 'alkene';
  }

  for (const atom of molecule.atoms) {
    if (atom.element !== 'O') continue;
    const edges = adj.get(atom.id) || [];
    if (edges.some((edge) => edge.order !== 1)) continue;
    const carbons = edges.filter((edge) => el(edge.id) === 'C').length;
    const hydrogens = edges.filter((edge) => el(edge.id) === 'H').length;
    if (carbons === 1 && hydrogens === 1) return 'hydroxyl';
    if (carbons === 2) return 'ether';
  }

  if (molecule.atoms.every((atom) => atom.element !== 'O')
    && molecule.bonds.every((bond) => bond.order === 1)) {
    return 'alkane';
  }
  return 'other';
}

/* ------------------------------ 试剂反应矩阵 ------------------------------ */

export const REAGENTS = Object.freeze(['bromineWater', 'sodium', 'litmus', 'esterify']);

/**
 * 每格都是课标范围内的定性结论，不含产率与机理。
 * 溴水：只有碳碳双键发生加成褪色（不设光照，故烷烃不取代）。
 * 钠：羟基和羧基的 O—H 都放出氢气。
 * 石蕊：只有羧基电离出 H⁺ 使石蕊变红。
 * 酯化（乙酸 + 浓硫酸 + 加热）：只有醇羟基生成有果香的酯。
 */
export const REACTION_MATRIX = Object.freeze({
  alkane: Object.freeze({ bromineWater: false, sodium: false, litmus: false, esterify: false }),
  alkene: Object.freeze({ bromineWater: true, sodium: false, litmus: false, esterify: false }),
  hydroxyl: Object.freeze({ bromineWater: false, sodium: true, litmus: false, esterify: true }),
  carboxyl: Object.freeze({ bromineWater: false, sodium: true, litmus: true, esterify: false }),
  ether: Object.freeze({ bromineWater: false, sodium: false, litmus: false, esterify: false }),
});

export function reactionOutcome(group, reagent) {
  const row = REACTION_MATRIX[group];
  if (!row || !(reagent in row)) return null;
  return row[reagent];
}

/* ------------------------------ 空间构型 ------------------------------ */

/** 价层电子对数 = 已成 σ 键数 + 剩余空价；空碳也按四面体预留四个键位 */
export function stericNumber(molecule, atomId) {
  return neighborsOf(molecule, atomId).length + freeValence(molecule, atomId);
}

export function geometryOf(molecule, atomId) {
  const atom = atomById(molecule, atomId);
  if (!atom) return 'terminal';
  const steric = stericNumber(molecule, atomId);
  if (atom.element === 'O') return steric >= 2 ? 'bent' : 'terminal';
  if (steric >= 4) return 'tetrahedral';
  if (steric === 3) return 'trigonal';
  if (steric === 2) return 'linear';
  return 'terminal';
}

export function bondLength(elementA, elementB, order) {
  const mark = order >= 2 ? '=' : '-';
  return BOND_LENGTHS[`${elementA}${mark}${elementB}`]
    ?? BOND_LENGTHS[`${elementB}${mark}${elementA}`]
    ?? 1.5;
}

function rootDirections(geometry) {
  if (geometry === 'tetrahedral') {
    return [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(normalize);
  }
  if (geometry === 'trigonal') {
    return [0, 120, 240].map((deg) => [Math.cos(deg * DEG), Math.sin(deg * DEG), 0]);
  }
  if (geometry === 'bent') {
    const half = (BENT_ANGLE / 2) * DEG;
    return [[Math.cos(half), Math.sin(half), 0], [Math.cos(half), -Math.sin(half), 0]];
  }
  if (geometry === 'linear') return [[1, 0, 0], [-1, 0, 0]];
  return [[1, 0, 0]];
}

/** 已知父原子方向后，按理想键角把余下键位排开 */
function spreadDirections(geometry, toParent, planeNormal, count) {
  const directions = [];
  if (count <= 0) return directions;
  if (geometry === 'tetrahedral') {
    const cosA = -1 / 3;
    const sinA = Math.sqrt(8) / 3;
    const u = orthogonalizeTo(planeNormal || anyPerpendicular(toParent), toParent);
    const v = normalize(cross(toParent, u));
    for (let k = 0; k < count; k += 1) {
      const phi = (2 * Math.PI * k) / 3;
      directions.push(normalize(add(
        scale(toParent, cosA),
        add(scale(u, Math.cos(phi) * sinA), scale(v, Math.sin(phi) * sinA)),
      )));
    }
    return directions;
  }
  if (geometry === 'trigonal') {
    const cosA = Math.cos(TRIGONAL_ANGLE * DEG);
    const sinA = Math.sin(TRIGONAL_ANGLE * DEG);
    const u = normalize(cross(planeNormal || anyPerpendicular(toParent), toParent));
    for (let k = 0; k < count; k += 1) {
      const side = k === 0 ? 1 : -1;
      directions.push(normalize(add(scale(toParent, cosA), scale(u, side * sinA))));
    }
    return directions;
  }
  if (geometry === 'bent') {
    const u = orthogonalizeTo(planeNormal || anyPerpendicular(toParent), toParent);
    const angle = BENT_ANGLE * DEG;
    for (let k = 0; k < count; k += 1) {
      directions.push(normalize(add(scale(toParent, Math.cos(angle)), scale(u, Math.sin(angle)))));
    }
    return directions;
  }
  for (let k = 0; k < count; k += 1) directions.push(scale(toParent, -1));
  return directions;
}

const SLOT_DISTANCE = 1.18;

/**
 * 从一个根原子做广度优先布点。双键会把父原子的分子平面法线传给子原子，
 * 所以整个 sp² 体系（例如乙烯）严格共面。
 * 返回 positions（原子坐标）与 openSlots（可以接新原子的空键位）。
 */
export function layoutMolecule(molecule) {
  const positions = new Map();
  const openSlots = [];
  if (!molecule.atoms.length) return { positions, openSlots };

  const adj = adjacency(molecule);
  const rootAtom = molecule.atoms.find((atom) => atom.element === 'C') || molecule.atoms[0];
  positions.set(rootAtom.id, [0, 0, 0]);
  const queue = [{ id: rootAtom.id, toParent: null, planeNormal: null }];
  const placed = new Set([rootAtom.id]);

  while (queue.length) {
    const { id, toParent, planeNormal } = queue.shift();
    const geometry = geometryOf(molecule, id);
    const capacity = CAPACITY[geometry];
    const children = (adj.get(id) || []).filter((edge) => !placed.has(edge.id));
    const slots = capacity - (toParent ? 1 : 0);

    let normal = planeNormal;
    if (geometry === 'trigonal') {
      normal = toParent
        ? orthogonalizeTo(planeNormal || anyPerpendicular(toParent), toParent)
        : [0, 0, 1];
    }
    const directions = toParent
      ? spreadDirections(geometry, toParent, normal, slots)
      : rootDirections(geometry).slice(0, capacity);

    children.forEach((edge, index) => {
      const direction = directions[index] || directions[directions.length - 1] || [1, 0, 0];
      const distance = bondLength(elementOf(molecule, id), elementOf(molecule, edge.id), edge.order);
      positions.set(edge.id, add(positions.get(id), scale(direction, distance)));
      placed.add(edge.id);
      queue.push({
        id: edge.id,
        toParent: scale(direction, -1),
        planeNormal: edge.order >= 2 ? normal : null,
      });
    });

    const open = Math.min(freeValence(molecule, id), Math.max(0, slots - children.length));
    for (let k = 0; k < open; k += 1) {
      const direction = directions[children.length + k];
      if (!direction) break;
      openSlots.push({
        hostId: id,
        direction,
        position: add(positions.get(id), scale(direction, SLOT_DISTANCE)),
      });
    }
  }
  return { positions, openSlots };
}

/** 三点夹角（度）：中心原子在 centerId */
export function measureAngle(positions, aId, centerId, bId) {
  const center = positions.get(centerId);
  const a = positions.get(aId);
  const b = positions.get(bId);
  if (!center || !a || !b) return null;
  const u = normalize(sub(a, center));
  const v = normalize(sub(b, center));
  const cosine = Math.min(1, Math.max(-1, dot(u, v)));
  return (Math.acos(cosine) / DEG);
}

/** 所有原子到最佳拟合平面的最大距离；乙烯这类 sp² 分子应当接近 0 */
export function planarityDeviation(positions) {
  const points = [...positions.values()];
  if (points.length < 4) return 0;
  const centroid = points
    .reduce((sum, point) => add(sum, point), [0, 0, 0])
    .map((value) => value / points.length);
  let best = Infinity;
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const normal = cross(sub(points[i], centroid), sub(points[j], centroid));
      if (length(normal) < 1e-6) continue;
      const unit = normalize(normal);
      const deviation = Math.max(
        ...points.map((point) => Math.abs(dot(sub(point, centroid), unit))),
      );
      best = Math.min(best, deviation);
    }
  }
  return Number.isFinite(best) ? best : 0;
}

/* ------------------------------ 参考分子库 ------------------------------ */

function buildSkeleton(steps) {
  let molecule = createMolecule();
  const ids = [];
  steps.forEach((step) => {
    if (typeof step === 'string') {
      const seeded = addAtom(molecule, step);
      molecule = seeded.molecule;
      ids.push(seeded.atomId);
      return;
    }
    const [hostIndex, element, order = 1] = step;
    const attached = attachAtom(molecule, ids[hostIndex], element, order);
    molecule = attached.molecule;
    ids.push(attached.atomId);
  });
  return molecule;
}

const SKELETONS = Object.freeze({
  methane: ['C'],
  ethene: ['C', [0, 'C', 2]],
  ethanol: ['C', [0, 'C'], [1, 'O']],
  aceticAcid: ['C', [0, 'C'], [1, 'O', 2], [1, 'O']],
  dimethylEther: ['C', [0, 'O'], [1, 'C']],
  nButane: ['C', [0, 'C'], [1, 'C'], [2, 'C']],
  isoButane: ['C', [0, 'C'], [0, 'C'], [0, 'C']],
});

export const MOLECULE_LIBRARY = Object.freeze(Object.fromEntries(
  Object.entries(SKELETONS).map(([key, steps]) => {
    const molecule = fillHydrogens(buildSkeleton(steps));
    return [key, Object.freeze({
      key,
      molecule,
      formula: molecularFormula(molecule),
      canonical: canonicalKey(molecule),
      group: detectFunctionalGroup(molecule),
    })];
  }),
));

export function identifyMolecule(molecule) {
  if (!isComplete(molecule)) return null;
  const key = canonicalKey(molecule);
  return Object.values(MOLECULE_LIBRARY).find((entry) => entry.canonical === key) || null;
}

/** 拼装站的四个必做分子，顺序即课标教学顺序 */
export const BUILD_TARGETS = Object.freeze(['methane', 'ethene', 'ethanol', 'aceticAcid']);

/** L4：只给分子式，学生要找出两种不同连接方式 */
export const ISOMER_CHALLENGES = Object.freeze([
  Object.freeze({ id: 'c2h6o', formula: 'C2H6O', answers: Object.freeze(['ethanol', 'dimethylEther']) }),
  Object.freeze({ id: 'c4h10', formula: 'C4H10', answers: Object.freeze(['nButane', 'isoButane']) }),
]);

export function matchIsomer(challenge, molecule) {
  if (!isComplete(molecule)) return null;
  if (molecularFormula(molecule) !== challenge.formula) return null;
  const key = canonicalKey(molecule);
  return challenge.answers.find((name) => MOLECULE_LIBRARY[name].canonical === key) || null;
}
