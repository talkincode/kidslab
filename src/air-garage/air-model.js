/* Air Garage · qualitative primary-school model.
   Mass units compare rubber vs trapped air; they are not grams.
   Rocket distance uses pump-counts as push units, with nozzle trading thrust for duration. */

const STATIONS = ['cup', 'balance', 'rocket'];
const RUBBER_MASS = 1;
const AIR_MASS = 4;
const BURST_AT = 7;
const TRACK_LENGTH = 6;
const NOZZLES = {
  small: { thrust: 1 },
  medium: { thrust: 2 },
  large: { thrust: 3 },
};

function createCup() {
  return {
    inWater: false,
    tilted: false,
    tissueWet: false,
    provenDry: false,
  };
}

function createBalance() {
  return {
    leftPopped: false,
    rightPopped: false,
  };
}

function createRocket() {
  return {
    pumps: 0,
    nozzle: 'medium',
    burst: false,
    distance: 0,
  };
}

function createGarage() {
  return {
    station: 0,
    cleared: [],
    complete: false,
    lastError: null,
    cup: createCup(),
    balance: createBalance(),
    rocket: createRocket(),
  };
}

function cloneGarage(garage) {
  return {
    ...garage,
    cleared: [...(garage.cleared || [])],
    cup: { ...createCup(), ...(garage.cup || {}) },
    balance: { ...createBalance(), ...(garage.balance || {}) },
    rocket: { ...createRocket(), ...(garage.rocket || {}) },
  };
}

function balloonMass(balance = {}, side) {
  const popped = side === 'right' ? balance.rightPopped : balance.leftPopped;
  return popped ? RUBBER_MASS : RUBBER_MASS + AIR_MASS;
}

function finishStation(garage, name) {
  if (!garage.cleared.includes(name)) garage.cleared.push(name);
  garage.station = Math.min(garage.cleared.length, STATIONS.length);
  garage.complete = garage.cleared.length === STATIONS.length;
  garage.lastError = null;
}

function dipCup(garage, { tilt = false } = {}) {
  const next = cloneGarage(garage);
  if (next.station !== 0) {
    next.lastError = 'wrong-station';
    return { garage: next, error: 'wrong-station' };
  }

  next.cup.inWater = true;
  next.cup.tilted = Boolean(tilt);
  if (tilt) {
    next.cup.tissueWet = true;
    next.cup.provenDry = false;
    next.lastError = 'air-escaped';
    return { garage: next, error: 'air-escaped' };
  }

  next.cup.tissueWet = false;
  next.cup.provenDry = true;
  finishStation(next, 'cup');
  return { garage: next, error: null };
}

function popBalloon(garage, side) {
  const next = cloneGarage(garage);
  if (next.station !== 1) {
    next.lastError = 'wrong-station';
    return { garage: next, error: 'wrong-station' };
  }
  if (side !== 'left' && side !== 'right') {
    next.lastError = 'invalid-side';
    return { garage: next, error: 'invalid-side' };
  }
  if (side === 'left') next.balance.leftPopped = true;
  else next.balance.rightPopped = true;
  next.lastError = null;
  return { garage: next, error: null };
}

function judgeBalance(garage) {
  const next = cloneGarage(garage);
  if (next.station !== 1) {
    next.lastError = 'wrong-station';
    return { garage: next, error: 'wrong-station', tilt: 0 };
  }

  const left = balloonMass(next.balance, 'left');
  const right = balloonMass(next.balance, 'right');
  const tilt = left === right ? 0 : left > right ? -1 : 1;

  if (tilt === 0) {
    const error = next.balance.leftPopped && next.balance.rightPopped
      ? 'air-gone'
      : 'still-balanced';
    next.lastError = error;
    return { garage: next, error, tilt };
  }

  finishStation(next, 'balance');
  return { garage: next, error: null, tilt };
}

function setNozzle(garage, nozzle) {
  const next = cloneGarage(garage);
  if (next.station !== 2) {
    next.lastError = 'wrong-station';
    return { garage: next, error: 'wrong-station' };
  }
  if (!NOZZLES[nozzle]) {
    next.lastError = 'invalid-nozzle';
    return { garage: next, error: 'invalid-nozzle' };
  }
  next.rocket.nozzle = nozzle;
  next.lastError = null;
  return { garage: next, error: null };
}

function pumpRocket(garage) {
  const next = cloneGarage(garage);
  if (next.station !== 2) {
    next.lastError = 'wrong-station';
    return { garage: next, error: 'wrong-station' };
  }
  if (next.rocket.burst) {
    next.lastError = 'burst';
    return { garage: next, error: 'burst' };
  }

  const pumps = next.rocket.pumps + 1;
  if (pumps >= BURST_AT) {
    next.rocket.pumps = 0;
    next.rocket.burst = true;
    next.rocket.distance = 0;
    next.lastError = 'burst';
    return { garage: next, error: 'burst' };
  }

  next.rocket.pumps = pumps;
  next.lastError = null;
  return { garage: next, error: null };
}

function launchRocket(garage) {
  const next = cloneGarage(garage);
  const thrust = NOZZLES[next.rocket.nozzle]?.thrust || 0;
  if (next.station !== 2) {
    next.lastError = 'wrong-station';
    return { garage: next, error: 'wrong-station', distance: 0, duration: 0, thrust };
  }

  if (next.rocket.burst) {
    next.lastError = 'burst';
    return { garage: next, error: 'burst', distance: 0, duration: 0, thrust };
  }
  if (next.rocket.pumps === 0) {
    next.rocket.distance = 0;
    next.lastError = 'no-air';
    return { garage: next, error: 'no-air', distance: 0, duration: 0, thrust };
  }

  const distance = next.rocket.pumps;
  const duration = thrust ? distance / thrust : 0;
  next.rocket.distance = distance;

  if (distance < TRACK_LENGTH) {
    next.lastError = 'too-short';
    return { garage: next, error: 'too-short', distance, duration, thrust };
  }

  finishStation(next, 'rocket');
  return { garage: next, error: null, distance, duration, thrust };
}

function resetStation(garage) {
  const next = cloneGarage(garage);
  const name = STATIONS[next.station];
  if (name === 'cup') next.cup = createCup();
  if (name === 'balance') next.balance = createBalance();
  if (name === 'rocket') next.rocket = createRocket();
  next.complete = false;
  next.lastError = null;
  return next;
}

export {
  AIR_MASS,
  BURST_AT,
  NOZZLES,
  RUBBER_MASS,
  STATIONS,
  TRACK_LENGTH,
  balloonMass,
  createGarage,
  dipCup,
  judgeBalance,
  launchRocket,
  popBalloon,
  pumpRocket,
  resetStation,
  setNozzle,
};
