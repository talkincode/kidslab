import assert from 'node:assert/strict';
import test from 'node:test';

import {
  addComponent,
  connectPorts,
  createCircuitDocument,
} from '../../src/electric-mouse/circuit-model.js';
import { simulateCircuit } from '../../src/electric-mouse/circuit-simulator.js';
import {
  deserializeCircuit,
  loadCircuit,
  saveCircuit,
  serializeCircuit,
} from '../../src/electric-mouse/circuit-storage.js';

function endpoint(component, portId) {
  return { componentId: component.id, portId };
}

function buildLampCircuit({ parallel = false, switchClosed = true } = {}) {
  const document = createCircuitDocument({ name: parallel ? 'Parallel' : 'Series' });
  const battery = addComponent(document, 'battery', {
    position: { x: 100, y: 200 },
    properties: { voltage: 6, internalResistance: 0.1, maxCurrent: 8 },
  });
  const control = addComponent(document, 'switch', {
    position: { x: 260, y: 200 },
    state: { closed: switchClosed },
  });
  const lampA = addComponent(document, 'lamp', {
    position: { x: 440, y: 140 },
    properties: { resistance: 12, ratedVoltage: 6 },
  });
  const lampB = addComponent(document, 'lamp', {
    position: { x: 440, y: 280 },
    properties: { resistance: 12, ratedVoltage: 6 },
  });

  connectPorts(document, endpoint(battery, 'positive'), endpoint(control, 'a'));
  if (parallel) {
    connectPorts(document, endpoint(control, 'b'), endpoint(lampA, 'a'));
    connectPorts(document, endpoint(control, 'b'), endpoint(lampB, 'a'));
    connectPorts(document, endpoint(lampA, 'b'), endpoint(battery, 'negative'));
    connectPorts(document, endpoint(lampB, 'b'), endpoint(battery, 'negative'));
  } else {
    connectPorts(document, endpoint(control, 'b'), endpoint(lampA, 'a'));
    connectPorts(document, endpoint(lampA, 'b'), endpoint(lampB, 'a'));
    connectPorts(document, endpoint(lampB, 'b'), endpoint(battery, 'negative'));
  }

  return { document, battery, control, lampA, lampB };
}

test('parallel lamps receive nearly full voltage while series lamps share it', () => {
  const parallel = buildLampCircuit({ parallel: true });
  const series = buildLampCircuit();

  const parallelResult = simulateCircuit(parallel.document);
  const seriesResult = simulateCircuit(series.document);
  const parallelLamp = parallelResult.analysis.components[parallel.lampA.id];
  const seriesLamp = seriesResult.analysis.components[series.lampA.id];

  assert.ok(parallelLamp.voltage > 5.8 && parallelLamp.voltage < 6);
  assert.ok(seriesLamp.voltage > 2.9 && seriesLamp.voltage < 3.1);
  assert.ok(parallelLamp.brightness > 0.93);
  assert.ok(seriesLamp.brightness > 0.23 && seriesLamp.brightness < 0.28);
});

test('an open switch stops current without marking the circuit as failed', () => {
  const { document, lampA } = buildLampCircuit({ parallel: true, switchClosed: false });

  const { analysis } = simulateCircuit(document);

  assert.equal(analysis.summary.status, 'open');
  assert.equal(analysis.components[lampA.id].current, 0);
  assert.equal(analysis.components[lampA.id].brightness, 0);
});

test('a dangling wire at a live node does not display current', () => {
  const { document, battery } = buildLampCircuit({ parallel: true });
  const spareSwitch = addComponent(document, 'switch', {
    position: { x: 700, y: 360 },
    state: { closed: false },
  });
  const dangling = connectPorts(
    document,
    endpoint(battery, 'positive'),
    endpoint(spareSwitch, 'a'),
  );

  const { analysis } = simulateCircuit(document);

  assert.equal(analysis.summary.status, 'active');
  assert.equal(analysis.wires[dangling.id].active, false);
  assert.equal(analysis.wires[dangling.id].current, 0);
});

test('two real SPDT switches control one lamp through either traveler', () => {
  const document = createCircuitDocument({ name: 'Two-way hall light' });
  const battery = addComponent(document, 'battery', {
    properties: { voltage: 6, internalResistance: 0.1, maxCurrent: 8 },
  });
  const switchA = addComponent(document, 'spdt', { state: { throw: 'a' } });
  const switchB = addComponent(document, 'spdt', { state: { throw: 'a' } });
  const lamp = addComponent(document, 'lamp', {
    properties: { ratedVoltage: 6, resistance: 12 },
  });
  connectPorts(document, endpoint(battery, 'positive'), endpoint(switchA, 'common'));
  connectPorts(document, endpoint(switchA, 'throwA'), endpoint(switchB, 'throwA'));
  connectPorts(document, endpoint(switchA, 'throwB'), endpoint(switchB, 'throwB'));
  connectPorts(document, endpoint(switchB, 'common'), endpoint(lamp, 'a'));
  connectPorts(document, endpoint(lamp, 'b'), endpoint(battery, 'negative'));

  let step = simulateCircuit(document);
  assert.equal(step.analysis.summary.status, 'active');

  step.document.components.find((item) => item.id === switchB.id).state.throw = 'b';
  step = simulateCircuit(step.document);
  assert.equal(step.analysis.summary.status, 'open');

  step.document.components.find((item) => item.id === switchA.id).state.throw = 'b';
  step = simulateCircuit(step.document);
  assert.equal(step.analysis.summary.status, 'active');
});

test('a breaker trips after sustained overcurrent and can be reset', () => {
  const document = createCircuitDocument({ name: 'Breaker test' });
  const battery = addComponent(document, 'battery', {
    properties: { voltage: 6, internalResistance: 0.2, maxCurrent: 20 },
  });
  const breaker = addComponent(document, 'breaker', {
    properties: { ratedCurrent: 0.5, tripHeat: 0.5 },
  });
  const lamp = addComponent(document, 'lamp', {
    properties: { ratedVoltage: 6, resistance: 2 },
  });
  connectPorts(document, endpoint(battery, 'positive'), endpoint(breaker, 'a'));
  connectPorts(document, endpoint(breaker, 'b'), endpoint(lamp, 'a'));
  connectPorts(document, endpoint(lamp, 'b'), endpoint(battery, 'negative'));

  let step = simulateCircuit(document, { deltaMs: 100 });
  assert.equal(step.document.components.find((item) => item.id === breaker.id).state.status, 'heating');
  for (let index = 0; index < 10 && !step.document.components.find((item) => item.id === breaker.id).state.tripped; index += 1) {
    step = simulateCircuit(step.document, { deltaMs: 100 });
  }
  assert.equal(step.document.components.find((item) => item.id === breaker.id).state.tripped, true);

  step = simulateCircuit(step.document);
  assert.equal(step.analysis.summary.status, 'open');
  const resetBreaker = step.document.components.find((item) => item.id === breaker.id);
  Object.assign(resetBreaker.state, { tripped: false, closed: true, overloadHeat: 0, status: 'normal' });
  step = simulateCircuit(step.document);
  assert.equal(step.analysis.summary.status, 'active');
});

test('crossing wire geometry stays separate until junction ports are explicitly connected', () => {
  const document = createCircuitDocument({ name: 'Crossing test' });
  const battery = addComponent(document, 'battery');
  const lamp = addComponent(document, 'lamp');
  const junctionA = addComponent(document, 'junction');
  const junctionB = addComponent(document, 'junction');
  connectPorts(
    document,
    endpoint(battery, 'positive'),
    endpoint(junctionA, 'west'),
    { controlPoints: [{ x: 400, y: 300 }] },
  );
  connectPorts(
    document,
    endpoint(lamp, 'a'),
    endpoint(junctionB, 'west'),
    { controlPoints: [{ x: 400, y: 300 }] },
  );
  connectPorts(document, endpoint(lamp, 'b'), endpoint(battery, 'negative'));

  let step = simulateCircuit(document);
  assert.equal(step.analysis.summary.status, 'open');

  connectPorts(step.document, endpoint(junctionA, 'east'), endpoint(junctionB, 'east'));
  step = simulateCircuit(step.document);
  assert.equal(step.analysis.summary.status, 'active');
});

test('a sustained direct short moves the battery from overload into protection', () => {
  const document = createCircuitDocument({ name: 'Short test' });
  const battery = addComponent(document, 'battery', {
    position: { x: 100, y: 100 },
    properties: {
      voltage: 6,
      internalResistance: 0.5,
      maxCurrent: 3,
      protectionHeat: 1,
    },
  });
  connectPorts(document, endpoint(battery, 'positive'), endpoint(battery, 'negative'));

  let step = simulateCircuit(document, { deltaMs: 100 });
  assert.equal(step.analysis.summary.status, 'short');
  assert.equal(step.analysis.components[battery.id].status, 'overload');

  for (let i = 0; i < 20 && step.document.components[0].state.status !== 'protected'; i += 1) {
    step = simulateCircuit(step.document, { deltaMs: 100 });
  }

  assert.equal(step.document.components[0].state.status, 'protected');
  assert.equal(step.analysis.summary.powered, false);
});

test('a fuse heats before it blows and becomes an open circuit afterward', () => {
  const document = createCircuitDocument({ name: 'Fuse test' });
  const battery = addComponent(document, 'battery', {
    properties: { voltage: 6, internalResistance: 0.2, maxCurrent: 20 },
  });
  const fuse = addComponent(document, 'fuse', {
    properties: { ratedCurrent: 0.2, tripHeat: 0.8 },
  });
  const lamp = addComponent(document, 'lamp', {
    properties: { resistance: 2, ratedVoltage: 6 },
  });
  connectPorts(document, endpoint(battery, 'positive'), endpoint(fuse, 'a'));
  connectPorts(document, endpoint(fuse, 'b'), endpoint(lamp, 'a'));
  connectPorts(document, endpoint(lamp, 'b'), endpoint(battery, 'negative'));

  let step = simulateCircuit(document, { deltaMs: 100 });
  assert.equal(step.document.components.find((item) => item.id === fuse.id).state.status, 'heating');

  for (let i = 0; i < 30 && !step.document.components.find((item) => item.id === fuse.id).state.blown; i += 1) {
    step = simulateCircuit(step.document, { deltaMs: 100 });
  }

  assert.equal(step.document.components.find((item) => item.id === fuse.id).state.blown, true);
  step = simulateCircuit(step.document, { deltaMs: 100 });
  assert.equal(step.analysis.summary.status, 'open');
});

test('versioned documents round-trip through the storage seam', () => {
  const { document, lampA } = buildLampCircuit({ parallel: true });
  document.viewport = { x: -120, y: 45, zoom: 1.35 };
  document.components.find((component) => component.id === lampA.id).rotation = 90;
  const memory = new Map();
  const storage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
  };

  const json = serializeCircuit(document);
  const parsed = deserializeCircuit(json);
  saveCircuit(storage, document, 'kidslab.test-circuit');
  const loaded = loadCircuit(storage, 'kidslab.test-circuit');

  assert.equal(parsed.version, 1);
  assert.equal(loaded.name, document.name);
  assert.equal(loaded.components.length, 4);
  assert.equal(loaded.wires.length, 5);
  assert.deepEqual(loaded.viewport, { x: -120, y: 45, zoom: 1.35 });
  assert.equal(loaded.components.find((component) => component.id === lampA.id).rotation, 90);
});
