export const TURBIDITY_CLEAR = 8;
export const SALINITY_FRESH = 5;
export const FILTER_LAYERS = Object.freeze(['gravel', 'sand', 'charcoal']);

export function createBucket() {
  return {
    turbidity: 92,
    salinity: 78,
    leaves: true,
    settled: false,
    layers: [],
    filtered: false,
    collectorOn: false,
    heated: false,
    distilled: false,
    tastedMuddy: false,
    tastedSalty: false,
    tastedFresh: false,
  };
}

function clone(bucket) {
  return {
    ...bucket,
    layers: Array.isArray(bucket.layers) ? [...bucket.layers] : [],
  };
}

export function settle(bucket) {
  const next = clone(bucket);
  if (next.distilled) return { ...next, error: 'already-fresh' };
  next.settled = true;
  next.turbidity = Math.min(next.turbidity, 40);
  next.error = null;
  return next;
}

export function scoopLeaves(bucket) {
  const next = clone(bucket);
  if (!next.settled) return { ...next, error: 'not-settled' };
  next.leaves = false;
  next.error = null;
  return next;
}

export function shake(bucket) {
  const next = clone(bucket);
  if (next.filtered || next.distilled) return { ...next, error: 'already-processed' };
  next.settled = false;
  next.leaves = true;
  next.turbidity = Math.max(next.turbidity, 88);
  next.error = null;
  return next;
}

export function addLayer(bucket, layer) {
  const next = clone(bucket);
  if (!FILTER_LAYERS.includes(layer)) return { ...next, error: 'bad-layer' };
  if (next.layers.includes(layer)) return { ...next, error: 'dup-layer' };
  next.layers.push(layer);
  next.error = null;
  return next;
}

export function canPour(bucket) {
  return FILTER_LAYERS.every((id) => bucket.layers.includes(id));
}

export function pourFilter(bucket) {
  const next = clone(bucket);
  if (!canPour(next)) return { ...next, error: 'incomplete-filter' };
  next.filtered = true;
  next.turbidity = Math.min(next.turbidity, 6);
  next.error = null;
  return next;
}

export function setCollector(bucket, on) {
  const next = clone(bucket);
  next.collectorOn = Boolean(on);
  next.error = null;
  return next;
}

export function heat(bucket) {
  const next = clone(bucket);
  next.heated = true;
  if (!next.collectorOn) {
    next.error = 'no-collector';
    return next;
  }
  next.distilled = true;
  next.leaves = false;
  next.turbidity = 2;
  next.salinity = 1;
  next.error = null;
  return next;
}

export function isClear(bucket) {
  return bucket.turbidity <= TURBIDITY_CLEAR;
}

export function isFresh(bucket) {
  return bucket.salinity <= SALINITY_FRESH;
}

export function isDrinkable(bucket) {
  return isClear(bucket) && isFresh(bucket);
}

export function taste(bucket) {
  const next = clone(bucket);
  if (!isClear(next)) {
    next.tastedMuddy = true;
    next.sip = 'muddy';
    next.error = null;
    return next;
  }
  if (!isFresh(next)) {
    next.tastedSalty = true;
    next.sip = 'salty';
    next.error = null;
    return next;
  }
  next.tastedFresh = true;
  next.sip = 'fresh';
  next.error = null;
  return next;
}

export function campComplete(bucket, camp) {
  if (camp === 0) return Boolean(bucket.settled && !bucket.leaves);
  if (camp === 1) return Boolean(bucket.filtered && bucket.tastedSalty);
  if (camp === 2) return Boolean(bucket.distilled && bucket.tastedFresh);
  return false;
}

export function waterLook(bucket) {
  if (bucket.distilled || isDrinkable(bucket)) return 'fresh';
  if (isClear(bucket)) return 'clear';
  if (bucket.settled) return 'settled';
  return 'muddy';
}
