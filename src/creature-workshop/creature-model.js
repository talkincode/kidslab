export const HABITATS = Object.freeze(['desert', 'arctic', 'wetland']);
export const SLOTS = Object.freeze(['ears', 'coat', 'feet', 'extra']);
export const SURVIVE_SCORE = 3;

export const PARTS = Object.freeze({
  ears: Object.freeze({
    big: Object.freeze({ habitats: Object.freeze(['desert']) }),
    small: Object.freeze({ habitats: Object.freeze(['arctic']) }),
    hidden: Object.freeze({ habitats: Object.freeze(['wetland']) }),
  }),
  coat: Object.freeze({
    thin: Object.freeze({ habitats: Object.freeze(['desert']) }),
    thick: Object.freeze({ habitats: Object.freeze(['arctic']) }),
    oily: Object.freeze({ habitats: Object.freeze(['wetland']) }),
  }),
  feet: Object.freeze({
    pads: Object.freeze({ habitats: Object.freeze(['desert']) }),
    snow: Object.freeze({ habitats: Object.freeze(['arctic']) }),
    web: Object.freeze({ habitats: Object.freeze(['wetland']) }),
  }),
  extra: Object.freeze({
    hump: Object.freeze({ habitats: Object.freeze(['desert']) }),
    blubber: Object.freeze({ habitats: Object.freeze(['arctic']) }),
    tongue: Object.freeze({ habitats: Object.freeze(['wetland']) }),
  }),
});

export const PROTOTYPES = Object.freeze({
  desert: 'fennec',
  arctic: 'arcticFox',
  wetland: 'platypus',
});

export function emptyDesign() {
  return { ears: null, coat: null, feet: null, extra: null };
}

export function createWorkshop() {
  return {
    camp: 0,
    unlocked: 0,
    completed: [],
    design: emptyDesign(),
    lastRun: null,
    hall: [],
    finished: false,
  };
}

function cloneWorkshop(workshop) {
  return {
    ...workshop,
    completed: Array.isArray(workshop.completed) ? [...workshop.completed] : [],
    design: { ...emptyDesign(), ...(workshop.design || {}) },
    lastRun: workshop.lastRun ? { ...workshop.lastRun } : null,
    hall: Array.isArray(workshop.hall) ? workshop.hall.map((entry) => ({
      ...entry,
      design: { ...entry.design },
    })) : [],
  };
}

export function habitatOf(camp) {
  return HABITATS[camp] || HABITATS[0];
}

export function isDesignComplete(design) {
  return SLOTS.every((slot) => Boolean(design?.[slot]));
}

export function setPart(design, slot, part) {
  const next = { ...emptyDesign(), ...design };
  if (!SLOTS.includes(slot)) return { ...next, error: 'bad-slot' };
  if (!PARTS[slot][part]) return { ...next, error: 'bad-part' };
  next[slot] = part;
  next.error = null;
  return next;
}

export function evaluate(habitat, design) {
  if (!HABITATS.includes(habitat)) {
    return { error: 'bad-habitat', survived: false, score: 0, fits: [], misses: [] };
  }
  if (!isDesignComplete(design)) {
    return { error: 'incomplete', survived: false, score: 0, fits: [], misses: [] };
  }

  const fits = [];
  const misses = [];
  for (const slot of SLOTS) {
    const part = design[slot];
    if (PARTS[slot][part].habitats.includes(habitat)) fits.push(slot);
    else misses.push({ slot, part });
  }

  const score = fits.length;
  const survived = score >= SURVIVE_SCORE;
  return {
    habitat,
    design: { ears: design.ears, coat: design.coat, feet: design.feet, extra: design.extra },
    fits,
    misses,
    score,
    survived,
    perfect: score === SLOTS.length,
    prototype: survived ? PROTOTYPES[habitat] : null,
    failSlot: survived ? null : misses[0]?.slot ?? null,
    error: null,
  };
}

export function choosePart(workshop, slot, part) {
  const next = cloneWorkshop(workshop);
  const design = setPart(next.design, slot, part);
  next.design = {
    ears: design.ears,
    coat: design.coat,
    feet: design.feet,
    extra: design.extra,
  };
  next.lastRun = null;
  next.error = design.error;
  return next;
}

export function release(workshop) {
  const next = cloneWorkshop(workshop);
  const habitat = habitatOf(next.camp);
  const result = evaluate(habitat, next.design);
  next.lastRun = result;
  next.error = result.error;

  if (result.error || !result.survived) return next;

  if (!next.completed.includes(next.camp)) {
    next.completed = [...next.completed, next.camp];
    next.hall = [...next.hall, {
      habitat,
      design: { ...next.design },
      prototype: result.prototype,
      perfect: result.perfect,
    }];
    if (next.camp < HABITATS.length - 1) {
      next.unlocked = Math.max(next.unlocked, next.camp + 1);
    }
    if (next.completed.length === HABITATS.length) next.finished = true;
  }

  return next;
}

export function selectCamp(workshop, camp) {
  const next = cloneWorkshop(workshop);
  if (!Number.isInteger(camp) || camp < 0 || camp >= HABITATS.length) {
    next.error = 'bad-camp';
    return next;
  }
  if (camp > next.unlocked) {
    next.error = 'locked';
    return next;
  }
  next.camp = camp;
  next.lastRun = null;
  next.error = null;
  return next;
}

export function resetWorkshop() {
  return createWorkshop();
}

export function restoreWorkshop(data) {
  const base = createWorkshop();
  if (!data || typeof data !== 'object') return base;

  if (Number.isInteger(data.camp)) base.camp = Math.max(0, Math.min(2, data.camp));
  if (Number.isInteger(data.unlocked)) base.unlocked = Math.max(0, Math.min(2, data.unlocked));
  if (Array.isArray(data.completed)) {
    base.completed = data.completed.filter((n) => Number.isInteger(n) && n >= 0 && n <= 2);
  }
  if (data.design && typeof data.design === 'object') {
    for (const slot of SLOTS) {
      const part = data.design[slot];
      base.design[slot] = PARTS[slot][part] ? part : null;
    }
  }
  if (Array.isArray(data.hall)) {
    base.hall = data.hall
      .filter((entry) => entry && HABITATS.includes(entry.habitat))
      .map((entry) => ({
        habitat: entry.habitat,
        prototype: PROTOTYPES[entry.habitat],
        perfect: Boolean(entry.perfect),
        design: {
          ears: PARTS.ears[entry.design?.ears] ? entry.design.ears : null,
          coat: PARTS.coat[entry.design?.coat] ? entry.design.coat : null,
          feet: PARTS.feet[entry.design?.feet] ? entry.design.feet : null,
          extra: PARTS.extra[entry.design?.extra] ? entry.design.extra : null,
        },
      }));
  }
  base.finished = Boolean(data.finished) || base.completed.length === HABITATS.length;
  if (base.completed.length) {
    base.unlocked = Math.max(base.unlocked, Math.min(2, Math.max(...base.completed) + (base.finished ? 0 : 1)));
  }
  return base;
}
