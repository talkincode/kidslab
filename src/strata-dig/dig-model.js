export const LAYER_IDS = Object.freeze(['surface', 'pottery', 'ice', 'dino']);

export const LAYERS = Object.freeze([
  { id: 'surface', depth: 0, find: 'toy', fragile: false, hard: false },
  { id: 'pottery', depth: 1, find: 'pot', fragile: true, hard: false },
  { id: 'ice', depth: 2, find: 'tusk', fragile: false, hard: true },
  { id: 'dino', depth: 3, find: 'bone', fragile: false, hard: true },
]);

export const BONE_IDS = Object.freeze(['skull', 'ribs', 'hips', 'legs', 'tail']);

export const FAULT_LEFT = Object.freeze(['soil', 'pottery', 'ash', 'tusk']);
export const FAULT_RIGHT = Object.freeze(['pottery', 'ash', 'tusk', 'dino']);
export const FAULT_PAIRS = Object.freeze([
  ['pottery', 'pottery'],
  ['ash', 'ash'],
  ['tusk', 'tusk'],
]);

export const OLDER_OPTIONS = Object.freeze(['pottery', 'dino']);
export const OLDER_ANSWER = 'dino';

export function createSite() {
  return {
    layers: LAYER_IDS.map((id) => ({
      id,
      exposed: false,
      collected: false,
      cracked: false,
    })),
    currentIndex: 0,
    tray: [],
    bones: {},
    lastBoneError: null,
    fault: {
      left: null,
      right: null,
      matched: [],
      lastError: null,
    },
    olderPick: null,
    awoken: false,
  };
}

function clone(site) {
  return {
    ...site,
    layers: site.layers.map((layer) => ({ ...layer })),
    tray: [...site.tray],
    bones: { ...site.bones },
    fault: {
      ...site.fault,
      matched: [...site.fault.matched],
    },
  };
}

export function layerSpec(id) {
  return LAYERS.find((layer) => layer.id === id) || null;
}

export function currentLayer(site) {
  return site.layers[site.currentIndex] || null;
}

export function brush(site) {
  const next = clone(site);
  const layer = next.layers[next.currentIndex];
  if (!layer) return { ...next, error: 'pit-empty' };
  if (layer.collected) return { ...next, error: 'already-collected' };
  const spec = LAYERS[next.currentIndex];
  if (spec.hard && !layer.exposed) return { ...next, error: 'need-hammer' };
  layer.exposed = true;
  next.error = null;
  return next;
}

export function hammer(site) {
  const next = clone(site);
  const layer = next.layers[next.currentIndex];
  if (!layer) return { ...next, error: 'pit-empty' };
  if (layer.collected) return { ...next, error: 'already-collected' };
  const spec = LAYERS[next.currentIndex];
  if (spec.fragile && !layer.exposed) {
    layer.cracked = true;
    layer.exposed = true;
    next.error = 'cracked';
    return next;
  }
  if (layer.exposed) return { ...next, error: 'already-exposed' };
  layer.exposed = true;
  next.error = null;
  return next;
}

export function collect(site) {
  const next = clone(site);
  const layer = next.layers[next.currentIndex];
  if (!layer) return { ...next, error: 'pit-empty' };
  if (!layer.exposed) return { ...next, error: 'still-buried' };
  if (layer.collected) return { ...next, error: 'already-collected' };
  layer.collected = true;
  next.tray.push(layer.id);
  if (next.currentIndex < next.layers.length - 1) next.currentIndex += 1;
  next.error = null;
  return next;
}

export function bonesComplete(site) {
  return BONE_IDS.every((id) => site.bones[id]);
}

export function placeBone(site, boneId, slotId) {
  const next = clone(site);
  if (!BONE_IDS.includes(boneId) || !BONE_IDS.includes(slotId)) {
    return { ...next, error: 'bad-bone' };
  }
  if (next.bones[boneId]) return { ...next, error: 'already-placed' };
  if (boneId !== slotId) {
    next.lastBoneError = boneId;
    next.error = 'wrong-slot';
    return next;
  }
  next.bones = { ...next.bones, [boneId]: true };
  next.lastBoneError = null;
  next.error = null;
  if (bonesComplete(next)) next.awoken = true;
  return next;
}

export function selectFault(site, side, layerId) {
  const next = clone(site);
  const list = side === 'left' ? FAULT_LEFT : FAULT_RIGHT;
  if (side !== 'left' && side !== 'right') return { ...next, error: 'bad-side' };
  if (!list.includes(layerId)) return { ...next, error: 'bad-layer' };
  next.fault = { ...next.fault, [side]: layerId, lastError: null };
  next.error = null;
  return next;
}

export function confirmFault(site) {
  const next = clone(site);
  const { left, right, matched } = next.fault;
  if (!left || !right) return { ...next, error: 'need-both' };
  const ok = FAULT_PAIRS.some(([a, b]) => a === left && b === right);
  if (!ok) {
    next.fault = { ...next.fault, lastError: `${left}|${right}`, left: null, right: null };
    next.error = 'wrong-pair';
    return next;
  }
  if (matched.includes(left)) return { ...next, error: 'dup-pair' };
  next.fault = {
    ...next.fault,
    matched: [...matched, left],
    left: null,
    right: null,
    lastError: null,
  };
  next.error = null;
  return next;
}

export function pickOlder(site, pickId) {
  const next = clone(site);
  if (!OLDER_OPTIONS.includes(pickId)) return { ...next, error: 'bad-older' };
  if (pickId !== OLDER_ANSWER) {
    next.olderPick = pickId;
    next.error = 'wrong-older';
    return next;
  }
  next.olderPick = OLDER_ANSWER;
  next.error = null;
  return next;
}

export function faultComplete(site) {
  return site.fault.matched.length === FAULT_PAIRS.length && site.olderPick === OLDER_ANSWER;
}

export function campComplete(site, camp) {
  if (camp === 0) return site.tray.length === LAYER_IDS.length;
  if (camp === 1) return bonesComplete(site);
  if (camp === 2) return faultComplete(site);
  return false;
}

export function currentEra(site) {
  const layer = currentLayer(site);
  return layer ? layer.id : 'dino';
}

export function currentDepth(site) {
  return site.currentIndex;
}
