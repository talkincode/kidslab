import {
  CIRCUIT_DOCUMENT_VERSION,
  cloneCircuitDocument,
  componentById,
  portById,
} from './circuit-model.js';

export const AUTOSAVE_KEY = 'kidslab.electricLab.autosave';
export const SAVED_CIRCUIT_KEY = 'kidslab.electricLab.saved';

export function validateCircuitDocument(document) {
  if (!document || typeof document !== 'object') throw new TypeError('Circuit document must be an object');
  if (document.version !== CIRCUIT_DOCUMENT_VERSION) {
    throw new TypeError(`Unsupported circuit document version: ${document.version}`);
  }
  if (typeof document.id !== 'string' || !document.id) throw new TypeError('Circuit document needs an id');
  if (typeof document.name !== 'string' || !document.name) throw new TypeError('Circuit document needs a name');
  if (!Array.isArray(document.components) || !Array.isArray(document.wires)) {
    throw new TypeError('Circuit document needs component and wire arrays');
  }
  const componentIds = new Set();
  for (const component of document.components) {
    if (!component.id || componentIds.has(component.id)) throw new TypeError(`Duplicate or missing component id: ${component.id || ''}`);
    componentIds.add(component.id);
    if (!Array.isArray(component.ports) || component.ports.length < 2) {
      throw new TypeError(`Component ${component.id} has invalid ports`);
    }
  }
  const wireIds = new Set();
  for (const wire of document.wires) {
    if (!wire.id || wireIds.has(wire.id)) throw new TypeError(`Duplicate or missing wire id: ${wire.id || ''}`);
    wireIds.add(wire.id);
    for (const endpoint of [wire.from, wire.to]) {
      const component = componentById(document, endpoint.componentId);
      if (!component || !portById(component, endpoint.portId)) {
        throw new TypeError(`Wire ${wire.id} has an invalid endpoint`);
      }
    }
  }
  if (!document.viewport || !Number.isFinite(document.viewport.x)
    || !Number.isFinite(document.viewport.y) || !Number.isFinite(document.viewport.zoom)) {
    throw new TypeError('Circuit document has an invalid viewport');
  }
  return document;
}

export function serializeCircuit(document) {
  validateCircuitDocument(document);
  return JSON.stringify(document);
}

export function deserializeCircuit(serialized) {
  if (typeof serialized !== 'string' || !serialized) throw new TypeError('Saved circuit is empty');
  const parsed = JSON.parse(serialized);
  validateCircuitDocument(parsed);
  return cloneCircuitDocument(parsed);
}

export function saveCircuit(storage, document, key = SAVED_CIRCUIT_KEY) {
  if (!storage?.setItem) throw new TypeError('Storage does not support setItem');
  storage.setItem(key, serializeCircuit(document));
  return key;
}

export function loadCircuit(storage, key = SAVED_CIRCUIT_KEY) {
  if (!storage?.getItem) throw new TypeError('Storage does not support getItem');
  const serialized = storage.getItem(key);
  return serialized ? deserializeCircuit(serialized) : null;
}
