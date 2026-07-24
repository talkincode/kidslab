import {
  cloneCircuitDocument,
  endpointKey,
} from './circuit-model.js';

const GMIN = 1e-9;
const EPSILON = 1e-8;

class UnionFind {
  constructor(keys) {
    this.parent = new Map(keys.map((key) => [key, key]));
  }

  find(key) {
    const parent = this.parent.get(key);
    if (parent === undefined) {
      this.parent.set(key, key);
      return key;
    }
    if (parent === key) return key;
    const root = this.find(parent);
    this.parent.set(key, root);
    return root;
  }

  union(a, b) {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) this.parent.set(rootB, rootA);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function number(value, fallback) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function solveLinear(matrix, vector) {
  const size = vector.length;
  const augmented = matrix.map((row, index) => [...row, vector[index]]);
  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
    }
    if (Math.abs(augmented[pivot][column]) < EPSILON) continue;
    if (pivot !== column) [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];
    const divisor = augmented[column][column];
    for (let x = column; x <= size; x += 1) augmented[column][x] /= divisor;
    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      if (Math.abs(factor) < EPSILON) continue;
      for (let x = column; x <= size; x += 1) {
        augmented[row][x] -= factor * augmented[column][x];
      }
    }
  }
  return augmented.map((row, index) => (
    Number.isFinite(row[size]) && Math.abs(row[index]) > EPSILON ? row[size] : 0
  ));
}

function componentEdges(component) {
  const resistance = (a, b, value, kind = component.type) => ({
    component,
    a: `${component.id}:${a}`,
    b: `${component.id}:${b}`,
    resistance: Math.max(0.0001, number(value, 1)),
    kind,
  });
  switch (component.type) {
    case 'lamp':
      return component.state.damaged || component.state.removed
        ? [] : [resistance('a', 'b', component.properties.resistance, 'lamp')];
    case 'motor':
      return [resistance('a', 'b', component.properties.resistance, 'motor')];
    case 'buzzer':
      return [resistance('a', 'b', component.properties.resistance, 'buzzer')];
    case 'switch':
      return component.state.closed
        ? [resistance('a', 'b', component.properties.closedResistance, 'switch')] : [];
    case 'button':
      return component.state.pressed
        ? [resistance('a', 'b', component.properties.closedResistance, 'button')] : [];
    case 'breaker':
      return component.state.closed && !component.state.tripped
        ? [resistance('a', 'b', component.properties.closedResistance, 'breaker')] : [];
    case 'fuse':
      return component.state.blown
        ? [] : [resistance('a', 'b', component.properties.resistance, 'fuse')];
    case 'spdt':
      return [
        resistance(
          'common',
          component.state.throw === 'b' ? 'throwB' : 'throwA',
          component.properties.closedResistance,
          'spdt',
        ),
      ];
    default:
      return [];
  }
}

function blankComponentAnalysis(component) {
  return {
    type: component.type,
    voltage: 0,
    current: 0,
    power: 0,
    brightness: 0,
    status: component.state.status || 'idle',
  };
}

function addConductance(matrix, indexA, indexB, conductance) {
  if (indexA !== null) matrix[indexA][indexA] += conductance;
  if (indexB !== null) matrix[indexB][indexB] += conductance;
  if (indexA !== null && indexB !== null) {
    matrix[indexA][indexB] -= conductance;
    matrix[indexB][indexA] -= conductance;
  }
}

function updateProtection(document, analysis, deltaMs) {
  const seconds = clamp(number(deltaMs, 0) / 1000, 0, 1);
  let newlyProtected = false;
  for (const component of document.components) {
    const meter = analysis.components[component.id] || blankComponentAnalysis(component);
    if (component.type === 'battery' || component.type === 'batteryBox') {
      if (component.state.status === 'protected') continue;
      const rating = Math.max(0.1, number(component.properties.maxCurrent, 4));
      const ratio = meter.current / rating;
      const previous = number(component.state.overloadHeat, 0);
      const heat = ratio > 1
        ? previous + Math.min(4, ratio - 1) * seconds
        : Math.max(0, previous - seconds * 0.55);
      const threshold = Math.max(0.2, number(component.properties.protectionHeat, 1.6));
      component.state.overloadHeat = heat;
      component.state.status = heat >= threshold ? 'protected' : ratio > 1 ? 'overload' : 'normal';
      meter.status = component.state.status;
      if (component.state.status === 'protected') newlyProtected = true;
    } else if (component.type === 'fuse') {
      if (component.state.blown) {
        component.state.status = 'blown';
        meter.status = 'blown';
        continue;
      }
      const rating = Math.max(0.05, number(component.properties.ratedCurrent, 2));
      const ratio = meter.current / rating;
      const previous = number(component.state.heat, 0);
      const heat = ratio > 1
        ? previous + Math.min(3, ratio - 1) * seconds
        : Math.max(0, previous - seconds * 0.42);
      component.state.heat = heat;
      if (heat >= Math.max(0.2, number(component.properties.tripHeat, 1.25))) {
        component.state.blown = true;
        component.state.status = 'blown';
      } else {
        component.state.status = ratio > 1 ? 'heating' : 'normal';
      }
      meter.status = component.state.status;
      meter.heat = heat;
    } else if (component.type === 'breaker') {
      if (component.state.tripped || !component.state.closed) {
        component.state.status = component.state.tripped ? 'tripped' : 'open';
        meter.status = component.state.status;
        continue;
      }
      const rating = Math.max(0.1, number(component.properties.ratedCurrent, 3));
      const ratio = meter.current / rating;
      const previous = number(component.state.overloadHeat, 0);
      const heat = ratio > 1
        ? previous + Math.min(3, ratio - 1) * seconds
        : Math.max(0, previous - seconds * 0.7);
      component.state.overloadHeat = heat;
      if (heat >= Math.max(0.2, number(component.properties.tripHeat, 1.2))) {
        component.state.tripped = true;
        component.state.closed = false;
        component.state.status = 'tripped';
      } else {
        component.state.status = ratio > 1 ? 'heating' : 'normal';
      }
      meter.status = component.state.status;
      meter.heat = heat;
    }
  }
  return newlyProtected;
}

function applyLoadStates(document, analysis) {
  for (const component of document.components) {
    const meter = analysis.components[component.id];
    if (!meter) continue;
    if (component.type === 'lamp') {
      if (component.state.damaged) meter.status = 'damaged';
      else if (component.state.removed) meter.status = 'removed';
      else if (meter.voltage > number(component.properties.ratedVoltage, 6) * 1.45) meter.status = 'overvoltage';
      else if (meter.brightness > 0.72) meter.status = 'bright';
      else if (meter.brightness > 0.03) meter.status = 'dim';
      else meter.status = 'off';
      component.state.status = meter.status;
    } else if (component.type === 'motor') {
      const ratio = meter.voltage / Math.max(0.1, number(component.properties.ratedVoltage, 6));
      meter.speed = clamp(ratio, 0, 1.3);
      meter.status = ratio > 1.25 ? 'overload' : ratio > 0.72 ? 'running' : ratio > 0.08 ? 'slow' : 'stopped';
      component.state.status = meter.status;
    } else if (component.type === 'buzzer') {
      const ratedPower = (number(component.properties.ratedVoltage, 6) ** 2)
        / Math.max(0.1, number(component.properties.resistance, 18));
      meter.level = clamp(meter.power / ratedPower, 0, 1);
      meter.status = meter.level > 0.12 ? 'sounding' : 'silent';
      component.state.status = meter.status;
    } else if (component.type === 'switch') {
      meter.status = component.state.closed ? 'closed' : 'open';
      component.state.status = meter.status;
    } else if (component.type === 'spdt') {
      meter.status = component.state.throw === 'b' ? 'throwB' : 'throwA';
      component.state.status = meter.status;
    } else if (component.type === 'button') {
      meter.status = component.state.pressed ? 'pressed' : 'open';
      component.state.status = meter.status;
    }
  }
}

function zeroAnalysis(document, status) {
  return {
    components: Object.fromEntries(document.components.map((component) => [
      component.id,
      blankComponentAnalysis(component),
    ])),
    wires: Object.fromEntries(document.wires.map((wire) => [
      wire.id,
      { current: 0, active: false, potential: 0 },
    ])),
    nodes: {},
    summary: {
      status,
      powered: false,
      totalCurrent: 0,
      sourceVoltage: 0,
      activeLoads: 0,
      faults: [],
    },
  };
}

export function simulateCircuit(document, options = {}) {
  const nextDocument = cloneCircuitDocument(document);
  const powered = options.powered !== false;
  const batteries = nextDocument.components.filter((component) => (
    component.type === 'battery' || component.type === 'batteryBox'
  ));
  const activeBatteries = batteries.filter((component) => component.state.status !== 'protected');
  if (!powered || !activeBatteries.length) {
    const analysis = zeroAnalysis(nextDocument, powered ? 'open' : 'off');
    updateProtection(nextDocument, analysis, options.deltaMs);
    applyLoadStates(nextDocument, analysis);
    return { document: nextDocument, analysis };
  }

  const portKeys = nextDocument.components.flatMap((component) => (
    component.ports.map((port) => `${component.id}:${port.id}`)
  ));
  const union = new UnionFind(portKeys);
  for (const junction of nextDocument.components.filter((component) => component.type === 'junction')) {
    const [first, ...rest] = junction.ports.map((port) => `${junction.id}:${port.id}`);
    for (const port of rest) union.union(first, port);
  }

  const roots = [...new Set(portKeys.map((key) => union.find(key)))];
  const ground = union.find(`${activeBatteries[0].id}:negative`);
  const nodeRoots = roots.filter((root) => root !== ground);
  const indexByRoot = new Map(nodeRoots.map((root, index) => [root, index]));
  const matrix = Array.from({ length: nodeRoots.length }, () => Array(nodeRoots.length).fill(0));
  const vector = Array(nodeRoots.length).fill(0);
  for (let index = 0; index < nodeRoots.length; index += 1) matrix[index][index] = GMIN;

  const edges = [
    ...nextDocument.components.flatMap(componentEdges),
    ...nextDocument.wires.map((wire) => ({
      wire,
      a: endpointKey(wire.from),
      b: endpointKey(wire.to),
      resistance: 0.005,
      kind: 'wire',
    })),
  ].map((edge) => ({
    ...edge,
    rootA: union.find(edge.a),
    rootB: union.find(edge.b),
  }));
  for (const edge of edges) {
    addConductance(
      matrix,
      edge.rootA === ground ? null : indexByRoot.get(edge.rootA),
      edge.rootB === ground ? null : indexByRoot.get(edge.rootB),
      1 / edge.resistance,
    );
  }

  for (const battery of activeBatteries) {
    const positive = union.find(`${battery.id}:positive`);
    const negative = union.find(`${battery.id}:negative`);
    const resistance = Math.max(0.01, number(battery.properties.internalResistance, 0.5));
    const voltage = number(battery.properties.voltage, 6);
    const positiveIndex = positive === ground ? null : indexByRoot.get(positive);
    const negativeIndex = negative === ground ? null : indexByRoot.get(negative);
    addConductance(matrix, positiveIndex, negativeIndex, 1 / resistance);
    if (positiveIndex !== null) vector[positiveIndex] += voltage / resistance;
    if (negativeIndex !== null) vector[negativeIndex] -= voltage / resistance;
  }

  const solution = solveLinear(matrix, vector);
  const voltageAtRoot = (root) => (root === ground ? 0 : solution[indexByRoot.get(root)] || 0);
  const analysis = zeroAnalysis(nextDocument, 'open');
  analysis.summary.powered = true;
  analysis.nodes = Object.fromEntries(roots.map((root) => [root, voltageAtRoot(root)]));

  for (const edge of edges) {
    const voltage = voltageAtRoot(edge.rootA) - voltageAtRoot(edge.rootB);
    const current = voltage / edge.resistance;
    if (edge.kind === 'wire') {
      const magnitude = Math.abs(current);
      const active = magnitude > 0.001;
      analysis.wires[edge.wire.id] = {
        current: active ? magnitude : 0,
        active,
        potential: (voltageAtRoot(edge.rootA) + voltageAtRoot(edge.rootB)) / 2,
        direction: current >= 0 ? 1 : -1,
      };
      continue;
    }
    const meter = analysis.components[edge.component.id];
    meter.voltage = Math.max(meter.voltage, Math.abs(voltage));
    meter.current = Math.max(meter.current, Math.abs(current));
    meter.power = Math.max(meter.power, Math.abs(voltage * current));
    if (edge.kind === 'lamp') {
      const ratedVoltage = Math.max(0.1, number(edge.component.properties.ratedVoltage, 6));
      const ratedPower = (ratedVoltage ** 2) / edge.resistance;
      meter.brightness = clamp(meter.power / ratedPower, 0, 1);
    }
  }

  const faults = [];
  let totalCurrent = 0;
  let sourceVoltage = 0;
  for (const battery of activeBatteries) {
    const positiveRoot = union.find(`${battery.id}:positive`);
    const negativeRoot = union.find(`${battery.id}:negative`);
    const terminalVoltage = voltageAtRoot(positiveRoot) - voltageAtRoot(negativeRoot);
    const openVoltage = number(battery.properties.voltage, 6);
    const resistance = Math.max(0.01, number(battery.properties.internalResistance, 0.5));
    const current = Math.max(0, (openVoltage - terminalVoltage) / resistance);
    const meter = analysis.components[battery.id];
    meter.voltage = Math.abs(terminalVoltage);
    meter.current = current;
    meter.power = Math.abs(terminalVoltage * current);
    totalCurrent += current;
    sourceVoltage = Math.max(sourceVoltage, openVoltage);
    const maxCurrent = Math.max(0.1, number(battery.properties.maxCurrent, 4));
    if (positiveRoot === negativeRoot || current > maxCurrent * 1.5) {
      faults.push({ type: 'short', componentId: battery.id, current });
    } else if (current > maxCurrent) {
      faults.push({ type: 'overload', componentId: battery.id, current });
    }
  }

  applyLoadStates(nextDocument, analysis);
  const newlyProtected = updateProtection(nextDocument, analysis, options.deltaMs);
  const activeLoads = Object.values(analysis.components).filter((meter) => (
    ['lamp', 'motor', 'buzzer'].includes(meter.type) && meter.power > 0.001
  )).length;
  analysis.summary = {
    status: faults.some((fault) => fault.type === 'short')
      ? 'short'
      : activeLoads > 0 ? 'active' : 'open',
    powered: true,
    totalCurrent,
    sourceVoltage,
    activeLoads,
    faults,
  };

  if (newlyProtected && nextDocument.components
    .filter((component) => component.type === 'battery' || component.type === 'batteryBox')
    .every((component) => component.state.status === 'protected')) {
    return simulateCircuit(nextDocument, { ...options, deltaMs: 0 });
  }
  return { document: nextDocument, analysis };
}
