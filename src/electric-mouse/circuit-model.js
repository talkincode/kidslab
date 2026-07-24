export const CIRCUIT_DOCUMENT_VERSION = 1;

const TWO_PORTS = [
  { id: 'a', name: 'A', kind: 'electrical', localPosition: { x: -48, y: 0 } },
  { id: 'b', name: 'B', kind: 'electrical', localPosition: { x: 48, y: 0 } },
];

const SOURCE_PORTS = [
  { id: 'negative', name: '−', kind: 'electrical', localPosition: { x: -52, y: 0 } },
  { id: 'positive', name: '+', kind: 'electrical', localPosition: { x: 52, y: 0 } },
];

export const COMPONENT_CATALOG = Object.freeze({
  battery: {
    label: { zh: '电池', en: 'Battery' },
    icon: '🔋',
    size: { width: 104, height: 68 },
    ports: SOURCE_PORTS,
    properties: { voltage: 6, internalResistance: 0.5, maxCurrent: 4, capacity: 100, protectionHeat: 1.6 },
    state: { status: 'normal', overloadHeat: 0 },
  },
  batteryBox: {
    label: { zh: '电池盒', en: 'Battery box' },
    icon: '🪫',
    size: { width: 118, height: 72 },
    ports: SOURCE_PORTS,
    properties: { voltage: 9, cells: 6, internalResistance: 0.8, maxCurrent: 5, capacity: 100, protectionHeat: 1.8 },
    state: { status: 'normal', overloadHeat: 0 },
  },
  lamp: {
    label: { zh: '灯泡', en: 'Bulb' },
    icon: '💡',
    size: { width: 96, height: 82 },
    ports: TWO_PORTS,
    properties: { ratedVoltage: 6, resistance: 12 },
    state: { damaged: false, removed: false, status: 'off' },
  },
  motor: {
    label: { zh: '电动机', en: 'Motor' },
    icon: '⚙️',
    size: { width: 100, height: 76 },
    ports: TWO_PORTS,
    properties: { ratedVoltage: 6, resistance: 8 },
    state: { status: 'stopped' },
  },
  buzzer: {
    label: { zh: '蜂鸣器', en: 'Buzzer' },
    icon: '📣',
    size: { width: 100, height: 74 },
    ports: TWO_PORTS,
    properties: { ratedVoltage: 6, resistance: 18 },
    state: { status: 'silent' },
  },
  switch: {
    label: { zh: '单刀开关', en: 'Switch' },
    icon: '🎚️',
    size: { width: 108, height: 70 },
    ports: TWO_PORTS,
    properties: { closedResistance: 0.02 },
    state: { closed: false, status: 'open' },
  },
  spdt: {
    label: { zh: '双控开关', en: 'Two-way switch' },
    icon: '↔️',
    size: { width: 116, height: 88 },
    ports: [
      { id: 'common', name: 'C', kind: 'electrical', localPosition: { x: -54, y: 0 } },
      { id: 'throwA', name: '1', kind: 'electrical', localPosition: { x: 54, y: -24 } },
      { id: 'throwB', name: '2', kind: 'electrical', localPosition: { x: 54, y: 24 } },
    ],
    properties: { closedResistance: 0.02 },
    state: { throw: 'a', status: 'throwA' },
  },
  button: {
    label: { zh: '按钮开关', en: 'Push button' },
    icon: '🔴',
    size: { width: 104, height: 72 },
    ports: TWO_PORTS,
    properties: { closedResistance: 0.02 },
    state: { pressed: false, status: 'open' },
  },
  breaker: {
    label: { zh: '总开关', en: 'Breaker' },
    icon: '🛡️',
    size: { width: 112, height: 78 },
    ports: TWO_PORTS,
    properties: { ratedCurrent: 3, tripHeat: 1.2, closedResistance: 0.025 },
    state: { closed: true, tripped: false, overloadHeat: 0, status: 'normal' },
  },
  fuse: {
    label: { zh: '保险丝', en: 'Fuse' },
    icon: '🧯',
    size: { width: 108, height: 68 },
    ports: TWO_PORTS,
    properties: { ratedCurrent: 2, tripHeat: 1.25, resistance: 0.03 },
    state: { blown: false, heat: 0, status: 'normal' },
  },
  junction: {
    label: { zh: '接线柱', en: 'Junction' },
    icon: '✣',
    size: { width: 76, height: 76 },
    ports: [
      { id: 'north', name: 'N', kind: 'electrical', localPosition: { x: 0, y: -34 } },
      { id: 'east', name: 'E', kind: 'electrical', localPosition: { x: 34, y: 0 } },
      { id: 'south', name: 'S', kind: 'electrical', localPosition: { x: 0, y: 34 } },
      { id: 'west', name: 'W', kind: 'electrical', localPosition: { x: -34, y: 0 } },
    ],
    properties: {},
    state: { status: 'idle' },
  },
});

function clone(value) {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function nextId(document, prefix) {
  const sequence = Number(document.metadata?.idSequence || 0) + 1;
  document.metadata = { ...(document.metadata || {}), idSequence: sequence };
  return `${prefix}-${sequence.toString(36)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function createCircuitDocument({ id, name = '我的电路', metadata } = {}) {
  const timestamp = nowIso();
  return {
    version: CIRCUIT_DOCUMENT_VERSION,
    id: id || `circuit-${timestamp.replace(/\D/g, '').slice(0, 17)}`,
    name,
    createdAt: timestamp,
    updatedAt: timestamp,
    components: [],
    wires: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    metadata: { idSequence: 0, ...(metadata || {}) },
  };
}

export function getComponentDefinition(type) {
  const definition = COMPONENT_CATALOG[type];
  if (!definition) throw new TypeError(`Unknown circuit component type: ${type}`);
  return definition;
}

export function addComponent(document, type, options = {}) {
  const definition = getComponentDefinition(type);
  const component = {
    id: options.id || nextId(document, type),
    type,
    position: {
      x: Number(options.position?.x ?? 320),
      y: Number(options.position?.y ?? 240),
    },
    rotation: Number(options.rotation || 0),
    ports: clone(definition.ports),
    properties: { ...clone(definition.properties), ...(options.properties || {}) },
    state: { ...clone(definition.state), ...(options.state || {}) },
  };
  document.components.push(component);
  touchDocument(document);
  return component;
}

export function componentById(document, componentId) {
  return document.components.find((component) => component.id === componentId) || null;
}

export function portById(component, portId) {
  return component?.ports.find((port) => port.id === portId) || null;
}

export function validateEndpoint(document, endpoint) {
  const component = componentById(document, endpoint?.componentId);
  if (!component) throw new TypeError(`Unknown component: ${endpoint?.componentId || ''}`);
  if (!portById(component, endpoint.portId)) {
    throw new TypeError(`Unknown port ${endpoint.portId || ''} on ${component.id}`);
  }
  return component;
}

export function connectPorts(document, from, to, options = {}) {
  validateEndpoint(document, from);
  validateEndpoint(document, to);
  if (from.componentId === to.componentId && from.portId === to.portId) {
    throw new TypeError('A wire cannot connect a port to itself');
  }
  const duplicate = document.wires.find((wire) => (
    wire.from.componentId === from.componentId
      && wire.from.portId === from.portId
      && wire.to.componentId === to.componentId
      && wire.to.portId === to.portId
  ) || (
    wire.from.componentId === to.componentId
      && wire.from.portId === to.portId
      && wire.to.componentId === from.componentId
      && wire.to.portId === from.portId
  ));
  if (duplicate) return duplicate;
  const wire = {
    id: options.id || nextId(document, 'wire'),
    from: { ...from },
    to: { ...to },
    ...(options.controlPoints?.length ? { controlPoints: clone(options.controlPoints) } : {}),
  };
  document.wires.push(wire);
  touchDocument(document);
  return wire;
}

export function removeComponents(document, componentIds) {
  const ids = new Set(componentIds);
  document.components = document.components.filter((component) => !ids.has(component.id));
  document.wires = document.wires.filter((wire) => (
    !ids.has(wire.from.componentId) && !ids.has(wire.to.componentId)
  ));
  touchDocument(document);
}

export function removeWires(document, wireIds) {
  const ids = new Set(wireIds);
  document.wires = document.wires.filter((wire) => !ids.has(wire.id));
  touchDocument(document);
}

export function cloneCircuitDocument(document) {
  return clone(document);
}

export function touchDocument(document) {
  document.updatedAt = nowIso();
  return document;
}

export function endpointKey(endpoint) {
  return `${endpoint.componentId}:${endpoint.portId}`;
}
