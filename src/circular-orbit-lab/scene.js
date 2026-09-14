import * as THREE from 'three';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import {
  EARTH_RADIUS,
  describeOrbit,
  gravityAtRadius,
  radiusAtAngle,
} from './orbit-model.js';
import { launchRadius, launchSpeedOf } from './lab-model.js';

const SCENE_UNIT = 1e6;
const EARTH_SCENE_RADIUS = EARTH_RADIUS / SCENE_UNIT;
const SIDEREAL_DAY = 86164;
const TWO_PI = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);
const SETTLE = 0.0008;
const LAND_PATCHES = Object.freeze([
  [0.14, 0.30, 0.10], [0.17, 0.42, 0.07], [0.20, 0.58, 0.09], [0.23, 0.70, 0.06],
  [0.44, 0.26, 0.07], [0.50, 0.40, 0.11], [0.53, 0.58, 0.10], [0.49, 0.72, 0.05],
  [0.68, 0.34, 0.12], [0.74, 0.50, 0.09], [0.80, 0.30, 0.07], [0.86, 0.66, 0.06],
  [0.33, 0.20, 0.05], [0.62, 0.20, 0.06], [0.92, 0.44, 0.05], [0.05, 0.52, 0.05],
]);

function approach(current, target, factor) {
  const next = current + (target - current) * Math.min(1, factor);
  return Math.abs(target - next) < SETTLE ? target : next;
}

export function createOrbitScene({ canvas, cssVar, onFirstInteract }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.5, 500);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.08).texture;

  const disposables = [];
  const bursts = [];
  const burstGroup = new THREE.Group();
  scene.add(burstGroup);

  function canvasTexture(width, height, draw) {
    const paper = Object.assign(document.createElement('canvas'), { width, height });
    draw(paper.getContext('2d'), width, height);
    const texture = new THREE.CanvasTexture(paper);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    disposables.push(texture);
    return texture;
  }

  function buildEarthTexture() {
    return canvasTexture(1024, 512, (ctx, w, h) => {
      const ocean = ctx.createLinearGradient(0, 0, 0, h);
      ocean.addColorStop(0, '#123b63');
      ocean.addColorStop(0.32, '#14588c');
      ocean.addColorStop(0.5, '#1a72ad');
      ocean.addColorStop(0.68, '#14588c');
      ocean.addColorStop(1, '#123b63');
      ctx.fillStyle = ocean;
      ctx.fillRect(0, 0, w, h);
      for (const [u, v, size] of LAND_PATCHES) {
        const cx = u * w;
        const cy = v * h;
        const radius = size * w;
        const land = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
        land.addColorStop(0, '#4f8a3f');
        land.addColorStop(0.62, '#3d7135');
        land.addColorStop(1, 'rgba(61, 113, 53, 0)');
        ctx.fillStyle = land;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius, radius * 0.72, u * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(150, 138, 92, 0.42)';
        ctx.beginPath();
        ctx.ellipse(cx + radius * 0.3, cy + radius * 0.1, radius * 0.42, radius * 0.28, u * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const [y0, y1] of [[0, h * 0.09], [h * 0.91, h]]) {
        const cap = ctx.createLinearGradient(0, y0, 0, y1);
        const top = y0 === 0;
        cap.addColorStop(top ? 0 : 1, 'rgba(245, 250, 255, 0.95)');
        cap.addColorStop(top ? 1 : 0, 'rgba(245, 250, 255, 0)');
        ctx.fillStyle = cap;
        ctx.fillRect(0, y0, w, y1 - y0);
      }
      ctx.fillStyle = 'rgba(255, 232, 180, 0.22)';
      ctx.fillRect(0, h / 2 - 2, w, 4);
    });
  }

  function buildCloudTexture() {
    return canvasTexture(1024, 512, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      let seed = 20260825;
      const random = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let i = 0; i < 130; i += 1) {
        const cx = random() * w;
        const cy = h * 0.12 + random() * h * 0.76;
        const radius = 14 + random() * 46;
        const puff = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        puff.addColorStop(0, 'rgba(255, 255, 255, 0.62)');
        puff.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = puff;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius, radius * 0.55, random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  function buildStars() {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    let seed = 77771;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let i = 0; i < count; i += 1) {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const radius = 260 + random() * 80;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xffffff, size: 1.5, sizeAttenuation: false, transparent: true, opacity: 0.78,
    });
    disposables.push(geometry, material);
    return new THREE.Points(geometry, material);
  }

  function buildSatellite() {
    const group = new THREE.Group();
    const bodyGeometry = new THREE.BoxGeometry(0.62, 0.5, 0.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xe6e9ef, roughness: 0.28, metalness: 0.72,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    group.add(body);
    const panelGeometry = new THREE.BoxGeometry(1.15, 0.05, 0.42);
    const panelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1d3f8a, roughness: 0.18, metalness: 0.55, emissive: 0x0b1a44, emissiveIntensity: 0.35,
    });
    for (const side of [-1, 1]) {
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.position.x = side * 0.92;
      panel.castShadow = true;
      group.add(panel);
    }
    const dishGeometry = new THREE.ConeGeometry(0.24, 0.3, 18, 1, true);
    const dishMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3c35c, roughness: 0.28, metalness: 0.55, side: THREE.DoubleSide,
    });
    const dish = new THREE.Mesh(dishGeometry, dishMaterial);
    dish.rotation.x = Math.PI;
    dish.position.y = 0.34;
    group.add(dish);
    disposables.push(bodyGeometry, bodyMaterial, panelGeometry, panelMaterial, dishGeometry, dishMaterial);
    return group;
  }

  function makeArrow(color) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color, emissive: color, emissiveIntensity: 0.7, roughness: 0.4,
      depthTest: false, transparent: true, opacity: 0.96,
    });
    const shaftGeometry = new THREE.CylinderGeometry(1, 1, 1, 12);
    const headGeometry = new THREE.ConeGeometry(1, 1, 16);
    const shaft = new THREE.Mesh(shaftGeometry, material);
    const head = new THREE.Mesh(headGeometry, material);
    group.add(shaft, head);
    group.renderOrder = 12;
    disposables.push(shaftGeometry, headGeometry, material);
    return { group, shaft, head };
  }

  function aimArrow(arrow, origin, direction, length, thickness) {
    const headLength = Math.min(length * 0.36, thickness * 3.4);
    const shaftLength = Math.max(0.001, length - headLength);
    arrow.group.position.copy(origin);
    arrow.group.quaternion.setFromUnitVectors(UP, direction);
    arrow.shaft.scale.set(thickness, shaftLength, thickness);
    arrow.shaft.position.set(0, shaftLength / 2, 0);
    arrow.head.scale.set(thickness * 2.5, headLength, thickness * 2.5);
    arrow.head.position.set(0, shaftLength + headLength / 2, 0);
  }

  const ambientLight = new THREE.HemisphereLight(0xdfeaff, 0x101828, 0.85);
  scene.add(ambientLight);
  const sunLight = new THREE.DirectionalLight(0xfff4e0, 2.6);
  sunLight.position.set(30, 14, 22);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.radius = 4;
  scene.add(sunLight);
  scene.add(buildStars());

  const earthSpin = new THREE.Group();
  const earthGeometry = new THREE.SphereGeometry(EARTH_SCENE_RADIUS, 72, 48);
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: buildEarthTexture(), roughness: 0.78, metalness: 0.08,
  });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  earthMesh.receiveShadow = true;
  earthSpin.add(earthMesh);
  disposables.push(earthGeometry, earthMaterial);

  const cloudGeometry = new THREE.SphereGeometry(EARTH_SCENE_RADIUS * 1.012, 64, 40);
  const cloudMaterial = new THREE.MeshStandardMaterial({
    map: buildCloudTexture(), transparent: true, opacity: 0.55, roughness: 1, depthWrite: false,
  });
  const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  earthSpin.add(cloudMesh);
  disposables.push(cloudGeometry, cloudMaterial);

  const markerGeometry = new THREE.ConeGeometry(0.16, 0.62, 14);
  const markerMaterial = new THREE.MeshStandardMaterial({
    color: 0xff8a4c, emissive: 0x8a3d09, roughness: 0.4,
  });
  const stationMarker = new THREE.Mesh(markerGeometry, markerMaterial);
  stationMarker.position.set(EARTH_SCENE_RADIUS + 0.24, 0, 0);
  stationMarker.rotation.z = -Math.PI / 2;
  earthSpin.add(stationMarker);
  disposables.push(markerGeometry, markerMaterial);
  scene.add(earthSpin);

  const atmosphereGeometry = new THREE.SphereGeometry(EARTH_SCENE_RADIUS * 1.028, 48, 32);
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x7fc4ff, transparent: true, opacity: 0.2, side: THREE.BackSide, depthWrite: false,
  });
  const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  scene.add(atmosphereMesh);
  disposables.push(atmosphereGeometry, atmosphereMaterial);

  const satellite = buildSatellite();
  satellite.visible = false;
  scene.add(satellite);
  const velocityArrow = makeArrow(0x35d3f5);
  const gravityArrow = makeArrow(0xff5b57);
  velocityArrow.group.visible = false;
  gravityArrow.group.visible = false;
  scene.add(velocityArrow.group, gravityArrow.group);

  const orbitCam = { yaw: 0.6, pitch: 0.62, dist: 26, targetYaw: 0.6, targetPitch: 0.62, targetDist: 26 };
  let arrowScale = 1.7;
  let orbitPath = null;
  let referenceRing = null;
  let pathKey = '';
  let lastW = 0;
  let lastH = 0;
  let lastLab = null;
  let lastFrame = 0;

  function applyThemeBg() {
    const a = cssVar('--scene-a');
    const b = cssVar('--scene-b');
    const c = cssVar('--scene-c');
    const paper = Object.assign(document.createElement('canvas'), { width: 16, height: 512 });
    const ctx = paper.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, a);
    g.addColorStop(0.55, b);
    g.addColorStop(1, c);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 512);
    const tex = new THREE.CanvasTexture(paper);
    tex.colorSpace = THREE.SRGBColorSpace;
    if (scene.background?.isTexture) scene.background.dispose();
    scene.background = tex;
    const dark = document.documentElement.dataset.theme === 'dark';
    ambientLight.intensity = dark ? 0.42 : 0.95;
    sunLight.intensity = dark ? 2.7 : 2.4;
    atmosphereMesh.material.opacity = dark ? 0.26 : 0.2;
    cloudMesh.material.opacity = dark ? 0.4 : 0.58;
  }

  function resize() {
    const width = innerWidth;
    const height = innerHeight;
    if (width === lastW && height === lastH) return;
    lastW = width;
    lastH = height;
    renderer.setSize(width, height);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  }

  const scenePoint = (orbit, angle) => {
    const radius = radiusAtAngle(orbit, angle) / SCENE_UNIT;
    return new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle));
  };

  function rebuildOrbitPath(lab) {
    const key = `${lab.altitudeKm}:${lab.speedRatio}:${lab.launched}`;
    if (key === pathKey && orbitPath) return;
    pathKey = key;
    if (orbitPath) {
      scene.remove(orbitPath);
      orbitPath.geometry.dispose();
      orbitPath.material.dispose();
      orbitPath = null;
    }
    if (referenceRing) {
      scene.remove(referenceRing);
      referenceRing.geometry.dispose();
      referenceRing.material.dispose();
      referenceRing = null;
    }
    const orbit = lab.orbit || describeOrbit(launchRadius(lab), launchSpeedOf(lab));
    if (!orbit) return;
    const reach = orbit.apsides ? orbit.apsides.apogee : launchRadius(lab) * 3;
    const viewRadius = Math.max(reach / SCENE_UNIT, EARTH_SCENE_RADIUS * 1.08);
    orbitCam.targetDist = Math.min(240, Math.max(22, (viewRadius / 0.344) * 1.3));
    arrowScale = Math.max(1.4, viewRadius * 0.3);
    const tubeRadius = Math.min(0.36, Math.max(0.075, orbitCam.targetDist * 0.0075));
    const span = orbit.eccentricity > 1 ? orbit.maxAngle * 0.97 : Math.PI;
    const points = [];
    const steps = 260;
    for (let i = 0; i <= steps; i += 1) {
      const angle = orbit.startAngle - span + ((2 * span) * i) / steps;
      const point = scenePoint(orbit, angle);
      if (!Number.isFinite(point.x) || point.length() > 220) continue;
      points.push(point);
    }
    if (points.length > 3) {
      const closed = orbit.eccentricity <= 1;
      const curve = new THREE.CatmullRomCurve3(points, closed);
      const geometry = new THREE.TubeGeometry(curve, 240, tubeRadius, 8, closed);
      const color = { circular: 0x3ec7e0, ellipse: 0xf0b13c, crash: 0xd9634f, escape: 0x9d7bea }[orbit.kind] || 0xf0b13c;
      const material = new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 0.75, roughness: 0.4, transparent: true,
        opacity: lab.launched ? 1 : 0.72,
      });
      orbitPath = new THREE.Mesh(geometry, material);
      scene.add(orbitPath);
    }
    if (orbit.kind !== 'circular') {
      const ringGeometry = new THREE.TorusGeometry(launchRadius(lab) / SCENE_UNIT, tubeRadius * 0.4, 6, 140);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.34 });
      referenceRing = new THREE.Mesh(ringGeometry, ringMaterial);
      referenceRing.rotation.x = Math.PI / 2;
      scene.add(referenceRing);
    }
  }

  function spawnBurst(position, color, count) {
    for (let i = 0; i < count; i += 1) {
      const geometry = new THREE.SphereGeometry(0.16, 8, 6);
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      const direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      burstGroup.add(mesh);
      bursts.push({
        mesh, material, geometry, life: 0, span: 0.9,
        velocity: direction.multiplyScalar(2.4 + Math.random() * 2),
      });
    }
  }

  function stepBursts(delta) {
    for (let i = bursts.length - 1; i >= 0; i -= 1) {
      const burst = bursts[i];
      burst.life += delta;
      const ratio = burst.life / burst.span;
      burst.mesh.position.addScaledVector(burst.velocity, delta);
      burst.material.opacity = Math.max(0, 0.9 * (1 - ratio));
      if (ratio >= 1) {
        burstGroup.remove(burst.mesh);
        burst.geometry.dispose();
        burst.material.dispose();
        bursts.splice(i, 1);
      }
    }
  }

  function setLab(lab) {
    lastLab = lab;
    rebuildOrbitPath(lab);
  }

  function flashCrash() {
    spawnBurst(satellite.position.clone(), 0xd9634f, 16);
  }

  function animate(now) {
    requestAnimationFrame(animate);
    const delta = Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0.016);
    lastFrame = now;
    const lab = lastLab;

    if (lab?.launched && lab.flight && lab.orbit) {
      const point = scenePoint(lab.orbit, lab.flight.angle);
      if (Number.isFinite(point.x) && point.length() < 220) {
        satellite.visible = lab.flight.status !== 'crashed';
        satellite.position.copy(point);
        satellite.scale.setScalar(Math.min(3.4, Math.max(0.55, orbitCam.dist * 0.055)));
        const ahead = scenePoint(lab.orbit, lab.flight.angle + 0.02);
        const behind = scenePoint(lab.orbit, lab.flight.angle - 0.02);
        const heading = ahead.clone().sub(behind).normalize();
        satellite.lookAt(point.clone().add(heading));
        if (lab.showVectors && lab.flight.status !== 'crashed') {
          const referenceGravity = gravityAtRadius(launchRadius(lab));
          const currentGravity = gravityAtRadius(lab.flight.radius);
          const currentSpeed = lab.orbit.angularMomentum / lab.flight.radius;
          const thickness = arrowScale * 0.09;
          velocityArrow.group.visible = true;
          gravityArrow.group.visible = true;
          aimArrow(
            velocityArrow,
            point,
            heading,
            Math.min(arrowScale * 2.6, Math.max(arrowScale * 0.35, arrowScale * (currentSpeed / lab.orbit.circularSpeed))),
            thickness,
          );
          aimArrow(
            gravityArrow,
            point,
            point.clone().multiplyScalar(-1).normalize(),
            Math.min(arrowScale * 2.6, Math.max(arrowScale * 0.28, arrowScale * (currentGravity / referenceGravity))),
            thickness,
          );
        } else {
          velocityArrow.group.visible = false;
          gravityArrow.group.visible = false;
        }
      }
      earthSpin.rotation.y = (lab.flight.elapsed / SIDEREAL_DAY) * TWO_PI;
    } else {
      satellite.visible = false;
      velocityArrow.group.visible = false;
      gravityArrow.group.visible = false;
      earthSpin.rotation.y += delta * 0.03;
    }

    stepBursts(delta);
    orbitCam.yaw = approach(orbitCam.yaw, orbitCam.targetYaw, delta * 8);
    orbitCam.pitch = approach(orbitCam.pitch, orbitCam.targetPitch, delta * 8);
    orbitCam.dist = approach(orbitCam.dist, orbitCam.targetDist, delta * 4);
    camera.position.set(
      Math.cos(orbitCam.pitch) * Math.sin(orbitCam.yaw) * orbitCam.dist,
      Math.sin(orbitCam.pitch) * orbitCam.dist,
      Math.cos(orbitCam.pitch) * Math.cos(orbitCam.yaw) * orbitCam.dist,
    );
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  const pointers = new Map();
  let dragging = false;
  let dragMoved = 0;
  let pinchStart = 0;

  canvas.addEventListener('pointerdown', (event) => {
    onFirstInteract?.();
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) { dragging = true; dragMoved = 0; }
    else if (pointers.size === 2) {
      const [first, second] = [...pointers.values()];
      pinchStart = Math.hypot(first.x - second.x, first.y - second.y);
    }
  });
  canvas.addEventListener('pointermove', (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size >= 2) {
      const [first, second] = [...pointers.values()];
      const spread = Math.hypot(first.x - second.x, first.y - second.y);
      if (pinchStart > 0) {
        orbitCam.targetDist = Math.min(320, Math.max(11, orbitCam.targetDist * (pinchStart / Math.max(1, spread))));
        pinchStart = spread;
      }
      return;
    }
    dragMoved += Math.abs(dx) + Math.abs(dy);
    if (!dragging || dragMoved < 5) return;
    orbitCam.targetYaw -= dx * 0.008;
    orbitCam.targetPitch = Math.max(-1.35, Math.min(1.35, orbitCam.targetPitch + dy * 0.006));
  });
  const release = (event) => {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = 0;
    if (!pointers.size) dragging = false;
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    onFirstInteract?.();
    orbitCam.targetDist = Math.min(320, Math.max(11, orbitCam.targetDist * (event.deltaY > 0 ? 1.12 : 0.89)));
  }, { passive: false });

  addEventListener('resize', resize);
  applyThemeBg();
  resize();
  requestAnimationFrame(animate);

  return {
    setLab,
    applyTheme: applyThemeBg,
    flashCrash,
  };
}
