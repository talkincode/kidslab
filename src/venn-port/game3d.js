import * as THREE from 'three';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const HALF_PI = Math.PI / 2;
const STAGING = new THREE.Vector3(0, 1.34, 3.45);
const ZONE_POSITIONS = Object.freeze({
  left: new THREE.Vector3(-2.62, 0.48, 0.05),
  both: new THREE.Vector3(0, 0.5, 0.05),
  right: new THREE.Vector3(2.62, 0.48, 0.05),
  neither: new THREE.Vector3(0, 0.48, -3.08),
});

const ease = (value) => (
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2
);

function seededPoints(count, seed = 1) {
  const positions = new Float32Array(count * 3);
  let value = seed >>> 0;
  const random = () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0xffffffff;
  };
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (random() - 0.5) * 56;
    positions[index * 3 + 1] = random() * 24 - 2;
    positions[index * 3 + 2] = -10 - random() * 28;
  }
  return positions;
}

function makeLabelTexture(text, {
  foreground = '#f7f1df',
  background = 'rgba(8,20,34,.88)',
  border = '#7ce8df',
  width = 512,
  height = 128,
  fontSize = 42,
} = {}) {
  const canvas = Object.assign(document.createElement('canvas'), { width, height });
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, width, height);
  context.fillStyle = background;
  context.strokeStyle = border;
  context.lineWidth = 6;
  context.beginPath();
  context.roundRect(6, 6, width - 12, height - 12, 24);
  context.fill();
  context.stroke();
  context.fillStyle = foreground;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `800 ${fontSize}px "Avenir Next", "PingFang SC", sans-serif`;
  context.fillText(text, width / 2, height / 2 + 1, width - 36);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function makeMarkTexture(mark) {
  const canvas = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, 256, 256);
  context.fillStyle = '#fff3b7';
  context.strokeStyle = 'rgba(10,22,32,.72)';
  context.lineWidth = 12;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '900 138px "Avenir Next", sans-serif';
  context.strokeText(mark, 128, 132);
  context.fillText(mark, 128, 132);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function setCylinderBetween(mesh, from, to) {
  const direction = to.clone().sub(from);
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.scale.y = direction.length();
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );
}

function disposeObject(object) {
  object.traverse((child) => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => {
        material.map?.dispose?.();
        material.dispose?.();
      });
    } else {
      child.material?.map?.dispose?.();
      child.material?.dispose?.();
    }
  });
}

export function createPort3D({
  canvas,
  cssVar,
  onZoneRequest,
  onInteract,
}) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderScale = reducedMotion ? 0.4 : 1;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !reducedMotion,
      alpha: false,
      powerPreference: 'high-performance',
    });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(devicePixelRatio, reducedMotion ? 1 : 2));
  renderer.setSize(
    Math.round(innerWidth * renderScale),
    Math.round(innerHeight * renderScale),
    !reducedMotion,
  );
  renderer.shadowMap.enabled = !reducedMotion;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 90);
  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.7);
  const staging = STAGING.clone();

  if (!reducedMotion) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
    pmrem.dispose();
  }

  const materials = {
    deck: new THREE.MeshPhysicalMaterial({
      color: 0x28343c,
      roughness: 0.34,
      metalness: 0.72,
      clearcoat: 0.34,
      clearcoatRoughness: 0.26,
    }),
    panel: new THREE.MeshStandardMaterial({
      color: 0x3b4950,
      roughness: 0.47,
      metalness: 0.6,
    }),
    brass: new THREE.MeshPhysicalMaterial({
      color: 0xb88643,
      roughness: 0.25,
      metalness: 0.86,
      clearcoat: 0.42,
    }),
    runway: new THREE.MeshStandardMaterial({
      color: 0x173944,
      emissive: 0x36c7c2,
      emissiveIntensity: 0.22,
      roughness: 0.42,
      metalness: 0.5,
    }),
    left: new THREE.MeshPhysicalMaterial({
      color: 0x2ca9b8,
      emissive: 0x176d79,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.3,
      roughness: 0.24,
      metalness: 0.12,
      depthWrite: false,
    }),
    right: new THREE.MeshPhysicalMaterial({
      color: 0xdc675f,
      emissive: 0x7a2f32,
      emissiveIntensity: 0.42,
      transparent: true,
      opacity: 0.29,
      roughness: 0.24,
      metalness: 0.12,
      depthWrite: false,
    }),
  };

  scene.background = new THREE.Color(0x06131f);
  scene.fog = new THREE.FogExp2(0x071520, 0.021);
  scene.add(new THREE.HemisphereLight(0xc5ecff, 0x111c20, 1.35));

  const key = new THREE.DirectionalLight(0xccefff, 3.2);
  key.position.set(-5, 11, 7);
  key.castShadow = !reducedMotion;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 6;
  key.shadow.bias = -0.0004;
  key.shadow.camera.left = -9;
  key.shadow.camera.right = 9;
  key.shadow.camera.top = 9;
  key.shadow.camera.bottom = -9;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xff9e78, 2.1);
  rim.position.set(7, 5, -6);
  scene.add(rim);

  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(seededPoints(460, 7128), 3));
  const stars = new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({
      color: 0xdff8ff,
      size: 0.085,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.88,
    }),
  );
  scene.add(stars);

  const planetMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x286f7b,
    roughness: 0.82,
    metalness: 0,
    clearcoat: 0.08,
  });
  const planet = new THREE.Mesh(new THREE.SphereGeometry(6.5, 64, 36), planetMaterial);
  planet.position.set(-1.2, -5.5, -14);
  scene.add(planet);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(6.72, 64, 36),
    new THREE.MeshBasicMaterial({
      color: 0x6fe4ef,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    }),
  );
  atmosphere.position.copy(planet.position);
  scene.add(atmosphere);

  const deck = new THREE.Group();
  scene.add(deck);
  const deckBase = new THREE.Mesh(
    new THREE.CylinderGeometry(7.15, 7.5, 0.48, 72),
    materials.deck,
  );
  deckBase.position.y = -0.24;
  deckBase.receiveShadow = true;
  deckBase.castShadow = true;
  deck.add(deckBase);

  const deckRing = new THREE.Mesh(
    new THREE.TorusGeometry(7.05, 0.14, 14, 96),
    materials.brass,
  );
  deckRing.rotation.x = HALF_PI;
  deckRing.position.y = 0.035;
  deck.add(deckRing);

  for (let index = 0; index < 16; index += 1) {
    const angle = index / 16 * Math.PI * 2;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 5.8), materials.panel);
    rib.position.set(Math.sin(angle) * 3.1, 0.025, Math.cos(angle) * 3.1);
    rib.rotation.y = angle;
    deck.add(rib);
  }

  const runway = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.055, 6.1), materials.runway);
  runway.position.set(0, 0.055, 2.15);
  runway.receiveShadow = true;
  deck.add(runway);

  const runwayLights = [];
  for (let index = 0; index < 9; index += 1) {
    for (const side of [-1, 1]) {
      const light = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.035, 0.25),
        new THREE.MeshBasicMaterial({
          color: 0x9ffcf1,
          transparent: true,
          opacity: 0.64,
        }),
      );
      light.position.set(side * 0.48, 0.095, 4.7 - index * 0.64);
      runwayLights.push(light);
      deck.add(light);
    }
  }

  const circleGroup = new THREE.Group();
  deck.add(circleGroup);
  const circleRadius = 2.75;
  const ringMaterials = {
    left: new THREE.MeshStandardMaterial({
      color: 0x82f5ef,
      emissive: 0x42dbd7,
      emissiveIntensity: 1.35,
      roughness: 0.26,
      metalness: 0.34,
    }),
    right: new THREE.MeshStandardMaterial({
      color: 0xff9a82,
      emissive: 0xe85d52,
      emissiveIntensity: 1.24,
      roughness: 0.26,
      metalness: 0.34,
    }),
  };

  for (const [side, x] of [['left', -1.5], ['right', 1.5]]) {
    const disk = new THREE.Mesh(new THREE.CircleGeometry(circleRadius, 96), materials[side]);
    disk.rotation.x = -HALF_PI;
    disk.position.set(x, 0.09, 0.05);
    circleGroup.add(disk);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(circleRadius, 0.075, 16, 128), ringMaterials[side]);
    ring.rotation.x = HALF_PI;
    ring.position.set(x, 0.13, 0.05);
    circleGroup.add(ring);
  }

  const zoneMeshes = new Map();
  const zoneHitMeshes = [];
  const zoneLabelSprites = new Map();
  const zoneColors = {
    left: [0x39b9c6, 0x54e6df],
    both: [0xd2aa54, 0xffd875],
    right: [0xd96d5e, 0xff9c83],
    neither: [0x657687, 0xa3b7c6],
  };
  const defaultZoneLabels = {
    left: '只满足 A · 10',
    both: '交集 · 11',
    right: '只满足 B · 01',
    neither: '都不满足 · 00',
  };

  function updateZoneLabel(zone, text) {
    const [color, emissive] = zoneColors[zone];
    const oldSprite = zoneLabelSprites.get(zone);
    const texture = makeLabelTexture(text, {
      foreground: zone === 'both' ? '#241a0e' : '#f5f9fb',
      background: zone === 'both' ? 'rgba(255,214,110,.92)' : 'rgba(8,20,32,.86)',
      border: `#${emissive.toString(16).padStart(6, '0')}`,
      width: 512,
      height: 128,
      fontSize: 42,
    });

    if (oldSprite) {
      oldSprite.material.map?.dispose();
      oldSprite.material.map = texture;
      oldSprite.material.needsUpdate = true;
    } else {
      const label = new THREE.Sprite(new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      }));
      label.position.copy(ZONE_POSITIONS[zone]);
      label.position.y = zone === 'both' ? 1.02 : 0.98;
      label.scale.set(zone === 'neither' ? 2.1 : 1.95, 0.48, 1);
      deck.add(label);
      zoneLabelSprites.set(zone, label);
    }
  }

  function setZoneLabels(labels) {
    if (!labels) return;
    for (const [zone, text] of Object.entries(labels)) {
      updateZoneLabel(zone, text);
    }
  }

  for (const zone of Object.keys(ZONE_POSITIONS)) {
    const [color, emissive] = zoneColors[zone];
    const group = new THREE.Group();
    const material = new THREE.MeshPhysicalMaterial({
      color,
      emissive,
      emissiveIntensity: 0.58,
      roughness: 0.25,
      metalness: 0.62,
      clearcoat: 0.54,
    });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.86, 0.16, 48), material);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.66, 0.055, 12, 48),
      new THREE.MeshBasicMaterial({ color: emissive }),
    );
    ring.rotation.x = HALF_PI;
    ring.position.y = 0.1;
    group.add(ring);
    group.position.copy(ZONE_POSITIONS[zone]);
    group.position.y = 0.17;
    group.userData = { zone, material, baseIntensity: 0.58 };
    deck.add(group);
    zoneMeshes.set(zone, group);

    const hit = new THREE.Mesh(
      new THREE.CylinderGeometry(1.02, 1.02, 0.35, 32),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    );
    hit.position.copy(ZONE_POSITIONS[zone]);
    hit.position.y = 0.34;
    hit.userData.zone = zone;
    deck.add(hit);
    zoneHitMeshes.push(hit);

    updateZoneLabel(zone, defaultZoneLabels[zone]);
  }

  const ruleSprites = [];
  function setRuleLabel(index, text, side) {
    const old = ruleSprites[index];
    if (old) {
      scene.remove(old);
      old.material.map?.dispose();
      old.material.dispose();
    }
    const isLeft = side === 'left';
    const texture = makeLabelTexture(text, {
      border: isLeft ? '#54e6df' : '#ff9c83',
      background: isLeft ? 'rgba(5,20,30,.88)' : 'rgba(30,12,16,.88)',
      foreground: isLeft ? '#e2faf8' : '#ffece8',
      width: 576,
      height: 130,
      fontSize: 40,
    });
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    }));
    sprite.position.set(isLeft ? -2.85 : 2.85, 1.95, -1.8);
    sprite.scale.set(2.4, 0.52, 1);
    sprite.visible = innerWidth >= 540;
    scene.add(sprite);
    ruleSprites[index] = sprite;
  }

  let shipGroup = null;
  let shipPickables = [];
  let flight = null;
  let arrivalStartedAt = 0;
  let celebration = null;
  let interactive = true;
  let hintedZone = null;
  let hoveredZone = null;

  function createShip(item) {
    const group = new THREE.Group();
    const hullColor = new THREE.Color(item.blue ? '#237fa9' : item.hull);
    const hullMaterial = new THREE.MeshPhysicalMaterial({
      color: hullColor,
      roughness: 0.24,
      metalness: 0.62,
      clearcoat: 0.86,
      clearcoatRoughness: 0.18,
    });
    const accentMaterial = new THREE.MeshPhysicalMaterial({
      color: item.accent,
      emissive: new THREE.Color(item.accent).multiplyScalar(0.28),
      emissiveIntensity: 0.62,
      roughness: 0.22,
      metalness: 0.48,
    });
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x14252e,
      roughness: 0.34,
      metalness: 0.7,
    });
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xb9f4f2,
      emissive: 0x285e69,
      emissiveIntensity: 0.35,
      roughness: 0.08,
      metalness: 0.06,
      transparent: true,
      opacity: 0.78,
      transmission: reducedMotion ? 0 : 0.18,
    });

    const hull = new THREE.Mesh(new THREE.SphereGeometry(0.9, 48, 24), hullMaterial);
    hull.scale.set(item.round ? 1.02 : 1.28, item.round ? 0.48 : 0.34, item.round ? 0.96 : 0.88);
    hull.castShadow = true;
    hull.receiveShadow = true;
    group.add(hull);

    const rimMesh = new THREE.Mesh(new THREE.TorusGeometry(0.91, 0.12, 14, 56), accentMaterial);
    rimMesh.rotation.x = HALF_PI;
    rimMesh.scale.x = item.round ? 1 : 1.18;
    rimMesh.castShadow = true;
    group.add(rimMesh);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.52, 40, 20), glassMaterial);
    dome.scale.y = 0.72;
    dome.position.y = 0.35;
    dome.castShadow = true;
    group.add(dome);

    const eyeCount = item.threeEyes ? 3 : 2;
    for (let index = 0; index < eyeCount; index += 1) {
      const spacing = 0.21;
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 12), accentMaterial);
      eye.position.set((index - (eyeCount - 1) / 2) * spacing, 0.39, 0.46);
      eye.scale.y = 1.25;
      group.add(eye);
    }

    if (item.antenna) {
      for (const side of [-1, 1]) {
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1, 10), darkMaterial);
        const from = new THREE.Vector3(side * 0.17, 0.62, 0);
        const to = new THREE.Vector3(side * 0.33, 0.98, 0);
        setCylinderBetween(rod, from, to);
        group.add(rod);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), accentMaterial);
        tip.position.copy(to);
        group.add(tip);
      }
    }

    if (item.wings) {
      for (const side of [-1, 1]) {
        const wing = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.82, 4), accentMaterial);
        wing.position.set(side * 1.06, 0.02, -0.05);
        wing.rotation.z = side * -HALF_PI;
        wing.rotation.y = side * 0.18;
        wing.scale.z = 0.45;
        wing.castShadow = true;
        group.add(wing);
      }
    }

    if (item.crystal) {
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.23, 0), accentMaterial);
      crystal.position.set(0, 0.91, -0.04);
      crystal.rotation.y = 0.35;
      group.add(crystal);
    }

    if (item.striped) {
      for (const offset of [-0.3, 0, 0.3]) {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 1.42), accentMaterial);
        stripe.position.set(offset, 0.18, 0);
        stripe.rotation.y = 0.18;
        group.add(stripe);
      }
    }

    const markTexture = makeMarkTexture(item.mark);
    const mark = new THREE.Sprite(new THREE.SpriteMaterial({
      map: markTexture,
      transparent: true,
      depthTest: false,
    }));
    mark.position.set(0, 0.01, 0.88);
    mark.scale.set(0.48, 0.48, 1);
    group.add(mark);

    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(0.44, 1.2, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: item.accent,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    beam.position.y = -0.7;
    beam.rotation.z = Math.PI;
    group.add(beam);

    group.userData.beam = beam;
    group.traverse((child) => {
      if (child.isMesh && child !== beam) shipPickables.push(child);
    });
    return group;
  }

  function cancelFlight(result = false) {
    if (!flight) return;
    const active = flight;
    flight = null;
    clearTimeout(active.timeoutId);
    active.resolve(result);
  }

  function setShip(item, { animate = true } = {}) {
    cancelFlight(false);
    if (shipGroup) {
      scene.remove(shipGroup);
      disposeObject(shipGroup);
    }
    shipPickables = [];
    shipGroup = createShip(item);
    shipGroup.position.copy(staging);
    shipGroup.rotation.y = -0.12;
    scene.add(shipGroup);
    arrivalStartedAt = animate && !reducedMotion ? performance.now() : 0;
    if (arrivalStartedAt) {
      shipGroup.position.y += 1.8;
      shipGroup.scale.setScalar(0.35);
    }
  }

  function setRules(leftLabel, rightLabel) {
    setRuleLabel(0, leftLabel, 'left');
    setRuleLabel(1, rightLabel, 'right');
  }

  function setHint(zone) {
    hintedZone = zone || null;
  }

  function setInteractive(value) {
    interactive = Boolean(value);
    if (!interactive) hoveredZone = null;
  }

  function finishFlight(active) {
    if (!active || flight !== active) return;
    clearTimeout(active.timeoutId);
    flight = null;
    shipGroup.position.copy(active.correct ? active.target : staging);
    shipGroup.rotation.set(0, active.correct ? 0.08 : -0.12, 0);
    active.resolve(true);
  }

  function flyToZone(zone, { correct = true, duration = 0.72 } = {}) {
    if (!shipGroup || !ZONE_POSITIONS[zone]) return Promise.resolve(false);
    cancelFlight(false);
    hoveredZone = null;
    const effectiveDuration = reducedMotion ? 0.015 : duration;
    const target = ZONE_POSITIONS[zone].clone();
    target.y = correct ? 0.93 : 1.02;
    if (effectiveDuration <= 0.02) {
      shipGroup.position.copy(correct ? target : staging);
      shipGroup.rotation.set(0, correct ? 0.08 : -0.12, 0);
      return Promise.resolve(true);
    }
    return new Promise((resolve) => {
      const active = {
        from: shipGroup.position.clone(),
        target,
        zone,
        correct,
        duration: effectiveDuration,
        startedAt: performance.now(),
        resolve,
      };
      active.timeoutId = setTimeout(() => finishFlight(active), effectiveDuration * 1000 + 140);
      flight = active;
    });
  }

  function stepFlight(now) {
    if (!flight || !shipGroup) return;
    const progress = Math.min(1, (now - flight.startedAt) / 1000 / flight.duration);
    if (flight.correct) {
      const curved = ease(progress);
      shipGroup.position.lerpVectors(flight.from, flight.target, curved);
      shipGroup.position.y += Math.sin(progress * Math.PI) * 0.9;
      shipGroup.rotation.y = -0.12 + progress * Math.PI * 1.1;
      shipGroup.rotation.z = Math.sin(progress * Math.PI) * -0.08;
    } else {
      const outbound = progress < 0.5;
      const local = ease(outbound ? progress * 2 : (progress - 0.5) * 2);
      shipGroup.position.lerpVectors(
        outbound ? flight.from : flight.target,
        outbound ? flight.target : staging,
        local,
      );
      shipGroup.position.y += Math.sin(local * Math.PI) * 0.45;
      shipGroup.rotation.z = outbound
        ? Math.sin(progress * Math.PI * 9) * 0.08
        : Math.sin(progress * Math.PI * 4) * 0.035;
    }
    if (progress >= 1) finishFlight(flight);
  }

  function celebrate() {
    celebration = { startedAt: performance.now(), duration: 1.8 };
  }

  function stepCelebration(now) {
    if (!celebration) return;
    const progress = Math.min(1, (now - celebration.startedAt) / 1000 / celebration.duration);
    if (shipGroup) {
      shipGroup.rotation.y += 0.065;
      shipGroup.position.y += Math.sin(progress * Math.PI * 4) * 0.006;
    }
    if (progress >= 1) celebration = null;
  }

  function stepArrival(now) {
    if (!arrivalStartedAt || !shipGroup) return;
    const progress = Math.min(1, (now - arrivalStartedAt) / 520);
    const curved = 1 - Math.pow(1 - progress, 3);
    shipGroup.position.y = THREE.MathUtils.lerp(staging.y + 1.8, staging.y, curved);
    shipGroup.scale.setScalar(THREE.MathUtils.lerp(0.35, 1, curved));
    shipGroup.rotation.y = THREE.MathUtils.lerp(-1.2, -0.12, curved);
    if (progress >= 1) arrivalStartedAt = 0;
  }

  const orbit = {
    theta: 0,
    phi: 0.78,
    radius: 12.6,
    targetTheta: 0,
    targetPhi: 0.78,
    targetRadius: 12.6,
    focus: new THREE.Vector3(),
    targetFocus: new THREE.Vector3(),
  };

  function updateFraming() {
    const desktop = innerWidth >= 960;
    const tablet = innerWidth >= 680 && innerWidth < 960;
    const phone = innerWidth < 680;
    const shipWasStaged = shipGroup && !flight && shipGroup.position.distanceTo(staging) < 0.2;
    staging.set(0, phone ? 1.55 : STAGING.y, phone ? 1.35 : STAGING.z);
    if (shipWasStaged) shipGroup.position.copy(staging);

    if (phone) {
      orbit.targetFocus.set(0, 0.72, 2.08);
      orbit.targetRadius = 12.6;
      orbit.targetPhi = 0.76;
    } else if (tablet) {
      orbit.targetFocus.set(-0.4, 0.15, 0.25);
      orbit.targetRadius = 13.0;
      orbit.targetPhi = 0.78;
    } else {
      orbit.targetFocus.set(-0.95, 0.1, 0.25);
      orbit.targetRadius = 13.2;
      orbit.targetPhi = 0.78;
    }
    const showLabels = innerWidth >= 540;
    zoneLabelSprites.forEach((label) => { label.visible = showLabels; });
    ruleSprites.forEach((label) => { if (label) label.visible = showLabels; });
  }

  function updateCamera(dt) {
    const damping = 1 - Math.pow(0.001, dt);
    orbit.theta = THREE.MathUtils.lerp(orbit.theta, orbit.targetTheta, damping);
    orbit.phi = THREE.MathUtils.lerp(orbit.phi, orbit.targetPhi, damping);
    orbit.radius = THREE.MathUtils.lerp(orbit.radius, orbit.targetRadius, damping);
    orbit.focus.lerp(orbit.targetFocus, damping);
    const horizontal = Math.cos(orbit.phi) * orbit.radius;
    camera.position.set(
      orbit.focus.x + Math.sin(orbit.theta) * horizontal,
      orbit.focus.y + Math.sin(orbit.phi) * orbit.radius,
      orbit.focus.z + Math.cos(orbit.theta) * horizontal,
    );
    camera.lookAt(orbit.focus);
  }

  function applyTheme() {
    const dark = document.documentElement.dataset.theme === 'dark';
    scene.background.set(dark ? 0x030b12 : 0x071a27);
    scene.fog.color.set(dark ? 0x030b12 : 0x071a27);
    renderer.toneMappingExposure = Number.parseFloat(cssVar('--scene-exposure')) || (dark ? 0.9 : 1.08);
    planetMaterial.color.set(dark ? 0x1f5966 : 0x2d7d86);
  }

  const pointers = new Map();
  let gesture = null;
  function setPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    pointer.y = -(event.clientY - rect.top) / rect.height * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
  }

  function zoneAtPointer(event) {
    setPointer(event);
    return raycaster.intersectObjects(zoneHitMeshes, false)[0]?.object.userData.zone || null;
  }

  function planePoint(event) {
    setPointer(event);
    return raycaster.ray.intersectPlane(dragPlane, new THREE.Vector3());
  }

  canvas.addEventListener('pointerdown', (event) => {
    onInteract?.();
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    canvas.setPointerCapture(event.pointerId);
    setPointer(event);
    const hitShip = interactive && !flight && shipGroup
      ? raycaster.intersectObjects(shipPickables, false).length > 0
      : false;
    const zone = interactive ? zoneAtPointer(event) : null;
    if (hitShip) {
      const point = planePoint(event);
      gesture = {
        kind: 'ship',
        pointerId: event.pointerId,
        offset: point ? shipGroup.position.clone().sub(point) : new THREE.Vector3(),
      };
      shipGroup.scale.setScalar(1.06);
    } else if (zone) {
      gesture = {
        kind: 'zone',
        pointerId: event.pointerId,
        zone,
        x: event.clientX,
        y: event.clientY,
      };
      hoveredZone = zone;
    } else {
      gesture = {
        kind: 'orbit',
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        theta: orbit.targetTheta,
        phi: orbit.targetPhi,
      };
    }
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (gesture.kind === 'ship' && shipGroup) {
      const point = planePoint(event);
      if (!point) return;
      shipGroup.position.copy(point.add(gesture.offset));
      shipGroup.position.x = THREE.MathUtils.clamp(shipGroup.position.x, -4.6, 4.6);
      shipGroup.position.z = THREE.MathUtils.clamp(shipGroup.position.z, -3.9, 4.1);
      shipGroup.position.y = 1.16;
      let nearest = null;
      let nearestDistance = 1.18;
      for (const [zone, position] of Object.entries(ZONE_POSITIONS)) {
        const distance = Math.hypot(
          shipGroup.position.x - position.x,
          shipGroup.position.z - position.z,
        );
        if (distance < nearestDistance) {
          nearest = zone;
          nearestDistance = distance;
        }
      }
      hoveredZone = nearest;
    } else if (gesture.kind === 'orbit') {
      orbit.targetTheta = THREE.MathUtils.clamp(
        gesture.theta - (event.clientX - gesture.x) * 0.003,
        -0.42,
        0.42,
      );
      orbit.targetPhi = THREE.MathUtils.clamp(
        gesture.phi + (event.clientY - gesture.y) * 0.0025,
        0.64,
        0.98,
      );
    }
  });

  function finishPointer(event) {
    pointers.delete(event.pointerId);
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (gesture.kind === 'ship' && shipGroup) {
      shipGroup.scale.setScalar(1);
      const zone = hoveredZone;
      hoveredZone = null;
      if (zone) onZoneRequest?.(zone);
      else shipGroup.position.copy(staging);
    } else if (gesture.kind === 'zone') {
      const distance = Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y);
      const zone = gesture.zone;
      hoveredZone = null;
      if (distance < 18) onZoneRequest?.(zone);
    }
    gesture = null;
  }
  canvas.addEventListener('pointerup', finishPointer);
  canvas.addEventListener('pointercancel', finishPointer);

  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    orbit.targetRadius = THREE.MathUtils.clamp(orbit.targetRadius + event.deltaY * 0.006, 9.6, 15.8);
  }, { passive: false });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, reducedMotion ? 1 : 2));
    renderer.setSize(
      Math.round(innerWidth * renderScale),
      Math.round(innerHeight * renderScale),
      !reducedMotion,
    );
    updateFraming();
  });

  updateFraming();
  applyTheme();

  let running = true;
  let lastFrameAt = -Infinity;
  function frame(now = performance.now()) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (reducedMotion && now - lastFrameAt < 400) return;
    lastFrameAt = now;
    const dt = Math.min(clock.getDelta(), reducedMotion ? 1 / 8 : 1 / 30);
    stepArrival(now);
    stepFlight(now);
    stepCelebration(now);
    updateCamera(dt);

    const pulse = 0.5 + 0.5 * Math.sin(now * 0.0046);
    for (const [zone, group] of zoneMeshes) {
      const active = zone === hoveredZone || zone === hintedZone;
      group.userData.material.emissiveIntensity = active
        ? 1.25 + pulse * 0.72
        : group.userData.baseIntensity + pulse * 0.12;
      group.scale.setScalar(active ? 1.02 + pulse * 0.035 : 1);
    }
    runwayLights.forEach((light, index) => {
      light.material.opacity = 0.58 + ((index + Math.floor(now / 150)) % 5 === 0 ? 0.42 : 0);
    });
    if (shipGroup && !flight && !gesture && !arrivalStartedAt && !reducedMotion) {
      const atStaging = Math.hypot(
        shipGroup.position.x - staging.x,
        shipGroup.position.z - staging.z,
      ) < 0.08;
      if (atStaging) shipGroup.position.y = staging.y + Math.sin(now * 0.0032) * 0.04;
      shipGroup.rotation.y += 0.0012;
      shipGroup.userData.beam.material.opacity = 0.18 + pulse * 0.08;
    }
    stars.rotation.y += dt * 0.004;
    renderer.render(scene, camera);
  }
  frame();

  return {
    setShip,
    setRules,
    setZoneLabels,
    setHint,
    setInteractive,
    flyToZone,
    celebrate,
    applyTheme,
    get hoveredZone() { return hoveredZone; },
    dispose() {
      running = false;
      cancelFlight(false);
      zoneLabelSprites.forEach((sprite) => {
        sprite.material.map?.dispose();
        sprite.material.dispose();
      });
      ruleSprites.forEach((sprite) => {
        sprite?.material.map?.dispose();
        sprite?.material.dispose();
      });
      renderer.dispose();
      disposeObject(scene);
    },
  };
}
