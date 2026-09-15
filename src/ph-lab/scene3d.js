import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import { SAMPLES, interpolateIndicatorColor } from './ph-model.js';

const easeOut = (t) => 1 - (1 - t) ** 3;

function woodTexture(hex, seed = 7) {
  const canvas = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, 256, 256);
  let n = seed >>> 0;
  const rnd = () => { n = (n * 1664525 + 1013904223) >>> 0; return n / 0xffffffff; };
  for (let y = 0; y < 256; y += 2) {
    ctx.strokeStyle = `rgba(${rnd() > 0.5 ? '255,230,180' : '40,12,6'},${0.03 + rnd() * 0.05})`;
    ctx.lineWidth = 0.6 + rnd() * 1.6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 256; x += 16) ctx.lineTo(x, y + Math.sin((x + y) * 0.05) * 2);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function cssHex(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw || fallback;
}

function bottleHome(index) {
  const col = index % 6;
  const row = Math.floor(index / 6);
  return {
    x: -2.08 + col * 0.64 + row * 0.2,
    y: 0.36,
    z: -1.38 - row * 0.5,
  };
}

export function createPhScene(canvas, { onSample, onBeaker } = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !reduced, alpha: false });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, reduced ? 1 : 2));
  renderer.shadowMap.enabled = !reduced;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xfff4e2, 0x24343a, 1.15));
  const key = new THREE.DirectionalLight(0xfff1d4, 2.6);
  key.position.set(-4, 8, 6);
  key.castShadow = !reduced;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -7;
  key.shadow.camera.right = 7;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  scene.add(key);
  scene.add(new THREE.DirectionalLight(0x8ec9d8, 0.55).translateX(5).translateY(3).translateZ(-4));

  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({
    color, roughness: 0.42, metalness: 0.12, envMapIntensity: 1.05, ...extra,
  });
  const glass = (color, extra = {}) => new THREE.MeshPhysicalMaterial({
    color, roughness: 0.06, metalness: 0.02, transmission: 0.86, thickness: 0.45,
    ior: 1.45, transparent: true, envMapIntensity: 1.4, ...extra,
  });

  const table = new THREE.Mesh(
    new RoundedBoxGeometry(7.4, 0.22, 4.4, 4, 0.06),
    std(0xb88955, { map: woodTexture('#b88955', 3), roughness: 0.48 }),
  );
  table.position.y = -0.11;
  table.receiveShadow = true;
  scene.add(table);
  const apron = new THREE.Mesh(new RoundedBoxGeometry(7.5, 0.55, 4.5, 3, 0.04), std(0x6d4324, { roughness: 0.55 }));
  apron.position.y = -0.48;
  scene.add(apron);
  const ceramic = new THREE.Mesh(
    new RoundedBoxGeometry(3.6, 0.05, 2.35, 3, 0.04),
    std(0xf4f1ea, { roughness: 0.22, metalness: 0.08 }),
  );
  ceramic.position.set(0.28, 0.015, 0.32);
  ceramic.receiveShadow = true;
  scene.add(ceramic);

  const beaker = new THREE.Group();
  beaker.position.set(0.05, 0, 0.32);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.46, 1.18, 48, 1, true), glass(0xd7f4ff, { opacity: 0.95 }));
  wall.position.y = 0.64;
  wall.castShadow = true;
  const innerWall = new THREE.Mesh(
    new THREE.CylinderGeometry(0.485, 0.425, 1.14, 48, 1, true),
    glass(0xe7f7ff, { side: THREE.BackSide, thickness: 0.16, transmission: 0.92 }),
  );
  innerWall.position.y = 0.64;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.04, 12, 48), glass(0xecfbff));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 1.23;
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.46, 32), glass(0xcfeaf8, { transmission: 0.32 }));
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.y = 0.05;
  const liquidMat = new THREE.MeshPhysicalMaterial({
    color: 0x4caf50, roughness: 0.18, transmission: 0.28, transparent: true, opacity: 0.92, thickness: 0.4,
  });
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.4, 0.72, 32), liquidMat);
  liquid.position.y = 0.42;
  const meniscus = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), liquidMat);
  meniscus.scale.set(1, 0.18, 1);
  meniscus.position.y = 0.76;
  const beakerHit = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.58, 1.3, 16),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
  );
  beakerHit.position.y = 0.7;
  beakerHit.userData = { kind: 'beaker' };
  beaker.add(wall, innerWall, rim, bottom, liquid, meniscus, beakerHit);
  scene.add(beaker);

  const bubbles = Array.from({ length: 10 }, (_, i) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.025 + (i % 3) * 0.01, 10, 10),
      new THREE.MeshPhysicalMaterial({ color: 0xe7fff8, roughness: 0.12, transmission: 0.7, transparent: true, opacity: 0.55 }),
    );
    mesh.position.set(((i % 5) - 2) * 0.08, 0.25 + (i % 4) * 0.08, ((i * 3) % 5 - 2) * 0.07);
    beaker.add(mesh);
    return { mesh, seed: i * 13.7 };
  });

  const steel = std(0xd7dee3, { metalness: 0.86, roughness: 0.18 });
  const cream = std(0xece7dc, { metalness: 0.08, roughness: 0.38 });
  const ink = std(0x1c2428, { metalness: 0.22, roughness: 0.4 });

  const meter = new THREE.Group();
  meter.position.set(1.42, 0, 0.32);
  const chassis = new THREE.Mesh(new RoundedBoxGeometry(0.95, 1.12, 0.62, 4, 0.06), cream);
  chassis.position.y = 0.62;
  chassis.castShadow = true;
  const face = new THREE.Mesh(new RoundedBoxGeometry(0.82, 0.48, 0.06, 2, 0.02), ink);
  face.position.set(0, 0.78, 0.32);
  const lcdCanvas = Object.assign(document.createElement('canvas'), { width: 512, height: 220 });
  const lcdCtx = lcdCanvas.getContext('2d');
  const lcdMap = new THREE.CanvasTexture(lcdCanvas);
  lcdMap.colorSpace = THREE.SRGBColorSpace;
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.32), new THREE.MeshBasicMaterial({ map: lcdMap, toneMapped: false }));
  lcd.position.set(0, 0.8, 0.36);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 16), std(0xc9a227, { metalness: 0.4, roughness: 0.3 }));
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0.28, 0.42, 0.34);
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 1.7, 12), steel);
  stand.position.set(-0.38, 0.95, 0);
  const base = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.08, 0.42, 2, 0.04), ink);
  base.position.set(-0.38, 0.04, 0);
  const arm = new THREE.Mesh(new RoundedBoxGeometry(0.86, 0.06, 0.06, 2, 0.02), steel);
  arm.position.set(-0.82, 1.68, 0);
  const probe = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 1.22, 12), glass(0xcfeaf8, { transmission: 0.4, thickness: 0.2 }));
  probe.position.set(-1.18, 0.98, 0);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), glass(0xe7f7ff, { transmission: 0.5 }));
  bulb.position.set(-1.18, 0.36, 0);
  meter.add(chassis, face, lcd, knob, stand, base, arm, probe, bulb);
  scene.add(meter);

  const dropper = new THREE.Group();
  dropper.position.set(-0.42, 1.95, 0.32);
  const pipette = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.018, 0.55, 12), glass(0xf4fbff));
  const bulbTop = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), std(0xe36b8a, { roughness: 0.45 }));
  bulbTop.position.y = 0.32;
  dropper.add(pipette, bulbTop);
  scene.add(dropper);
  const droplet = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 12, 10),
    new THREE.MeshPhysicalMaterial({ color: 0x9ad7ff, roughness: 0.12, transmission: 0.55, transparent: true, opacity: 0.85 }),
  );
  droplet.visible = false;
  scene.add(droplet);

  const stream = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.045, 0.7, 8),
    new THREE.MeshPhysicalMaterial({ color: 0x8fd6a2, transparent: true, opacity: 0.7, roughness: 0.2 }),
  );
  stream.visible = false;
  scene.add(stream);

  const bottles = SAMPLES.map((sample, index) => {
    const home = bottleHome(index);
    const group = new THREE.Group();
    group.position.set(home.x, home.y, home.z);
    const capHex = interpolateIndicatorColor(sample.ph, 'universal') || '#4caf50';
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.42, 18), glass(0xe8f7fb, { opacity: 0.7, transmission: 0.55 }));
    body.castShadow = true;
    const fill = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.1, 0.28, 16),
      new THREE.MeshPhysicalMaterial({ color: capHex, transparent: true, opacity: 0.88, roughness: 0.22 }),
    );
    fill.position.y = -0.02;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.12, 12), glass(0xe8f7fb, { transmission: 0.5 }));
    neck.position.y = 0.26;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.07, 12), std(capHex, { roughness: 0.4 }));
    cap.position.y = 0.34;
    const hit = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.82, 0.46),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
    );
    hit.position.y = 0.08;
    hit.userData = { kind: 'sample', id: sample.id };
    group.add(body, fill, neck, cap, hit);
    group.userData = { id: sample.id, home, index };
    scene.add(group);
    return group;
  });

  let yaw = 0.42;
  let elevation = 0.54;
  let radius = 6.35;
  let running = true;
  let phValue = 7;
  let selectedId = 'water';
  const target = new THREE.Vector3(0.25, 1.05, 0.18);
  const targetColor = new THREE.Color(0x4caf50);
  let action = null;
  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function drawLcd(value) {
    lcdCtx.fillStyle = '#071614';
    lcdCtx.fillRect(0, 0, 512, 220);
    lcdCtx.fillStyle = '#3d6a62';
    lcdCtx.font = '700 28px ui-sans-serif, sans-serif';
    lcdCtx.textAlign = 'left';
    lcdCtx.fillText('BENCH pH', 28, 42);
    lcdCtx.fillStyle = '#8ff5d4';
    lcdCtx.textAlign = 'center';
    lcdCtx.font = 'bold 92px ui-monospace, monospace';
    lcdCtx.fillText(Number(value).toFixed(1), 250, 140);
    lcdCtx.font = 'bold 36px ui-monospace, monospace';
    lcdCtx.fillText('pH', 430, 140);
    lcdMap.needsUpdate = true;
  }
  drawLcd(phValue);

  function applyTheme() {
    const a = cssHex('--scene-a', '#dceeea');
    const b = cssHex('--scene-b', '#b7d4ce');
    scene.background = new THREE.Color(a);
    const dark = document.documentElement.dataset.theme === 'dark';
    renderer.toneMappingExposure = dark ? 0.92 : 1.08;
    key.intensity = dark ? 2.1 : 2.6;
    void b;
  }

  function setLiquidColor(hex) {
    if (!hex) return;
    targetColor.set(hex);
    const { r, g, b } = targetColor;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const pale = sat < 0.22 && min > 0.72;
    liquidMat.opacity = pale ? 0.28 : 0.9;
    liquidMat.transmission = pale ? 0.72 : 0.28;
    droplet.material.color.copy(targetColor);
    stream.material.color.copy(targetColor);
  }

  function setPh(value) {
    phValue = value;
    drawLcd(value);
  }

  function setSelectedSample(id) {
    selectedId = id;
    bottles.forEach((bottle) => {
      const on = bottle.userData.id === id;
      bottle.scale.setScalar(on ? 1.08 : 1);
    });
  }

  function playPour(id) {
    const bottle = bottles.find((item) => item.userData.id === id);
    if (!bottle) return;
    action = { type: 'pour', t: 1, bottle, id };
    stream.material.color.copy(targetColor);
  }

  function playDrop() {
    action = { type: 'drop', t: 1 };
    droplet.visible = true;
    droplet.position.set(-0.42, 1.62, 0.32);
  }

  let viewW = 0;
  let viewH = 0;
  function resize() {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    if (width === viewW && height === viewH) return;
    viewW = width;
    viewH = height;
    renderer.setSize(width, height, false);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const pointers = new Map();
  let drag = false;
  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', (event) => {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    canvas.setPointerCapture(event.pointerId);
    drag = false;
  });
  canvas.addEventListener('pointermove', (event) => {
    const prev = pointers.get(event.pointerId);
    if (!prev || pointers.size !== 1) return;
    const dx = event.clientX - prev.x;
    const dy = event.clientY - prev.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag = true;
    yaw -= dx * 0.007;
    elevation = THREE.MathUtils.clamp(elevation + dy * 0.005, 0.28, 1.2);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  });
  function pick(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    for (const hit of hits) {
      let node = hit.object;
      while (node) {
        if (node.userData?.kind === 'sample') {
          onSample?.(node.userData.id);
          return;
        }
        if (node.userData?.kind === 'beaker') {
          onBeaker?.();
          return;
        }
        node = node.parent;
      }
    }
  }
  const dropPointer = (event) => {
    if (pointers.has(event.pointerId) && pointers.size === 1 && !drag) pick(event);
    pointers.delete(event.pointerId);
  };
  canvas.addEventListener('pointerup', dropPointer);
  canvas.addEventListener('pointercancel', (event) => pointers.delete(event.pointerId));
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    radius = THREE.MathUtils.clamp(radius * Math.exp(THREE.MathUtils.clamp(event.deltaY, -80, 80) * 0.002), 4.8, 11);
  }, { passive: false });

  renderer.setAnimationLoop(() => {
    if (!running || document.hidden || canvas.clientWidth === 0) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    liquid.material.color.lerp(targetColor, 1 - Math.exp(-dt * 7));
    meniscus.position.y = 0.76 + Math.sin(t * 2.1) * 0.012;
    bubbles.forEach((bubble) => {
      const rise = (t * 0.18 + bubble.seed * 0.01) % 1;
      bubble.mesh.position.y = 0.22 + rise * 0.52;
      bubble.mesh.position.x = Math.sin(bubble.seed + t * 1.4) * 0.18;
      bubble.mesh.material.opacity = 0.15 + (1 - rise) * 0.4;
    });
    if (action) {
      action.t = Math.max(0, action.t - dt / 0.85);
      const p = 1 - action.t;
      if (action.type === 'pour') {
        const home = action.bottle.userData.home;
        const lift = easeOut(Math.min(1, p * 1.4));
        action.bottle.position.set(
          THREE.MathUtils.lerp(home.x, 0.55, lift),
          THREE.MathUtils.lerp(home.y, 1.72, lift),
          THREE.MathUtils.lerp(home.z, 0.55, lift),
        );
        action.bottle.rotation.z = -0.95 * Math.sin(Math.min(1, p * 1.6) * Math.PI);
        stream.visible = p > 0.28 && p < 0.78;
        stream.position.set(0.22, 1.28, 0.42);
        stream.rotation.z = 0.45;
        stream.material.opacity = p < 0.55 ? 0.7 : 0.7 * (1 - (p - 0.55) / 0.23);
        if (action.t === 0) {
          action.bottle.position.set(home.x, home.y, home.z);
          action.bottle.rotation.z = 0;
          stream.visible = false;
          action = null;
        }
      } else if (action.type === 'drop') {
        droplet.visible = true;
        droplet.position.set(-0.42, 1.62 - easeOut(p) * 0.9, 0.32);
        droplet.scale.setScalar(1 - p * 0.25);
        if (action.t === 0) {
          droplet.visible = false;
          action = null;
        }
      }
    }
    bottles.forEach((bottle) => {
      if (action?.bottle === bottle) return;
      const home = bottle.userData.home;
      bottle.position.y = THREE.MathUtils.damp(bottle.position.y, home.y + (bottle.userData.id === selectedId ? 0.06 : 0), 8, dt);
    });
    camera.position.set(
      Math.sin(yaw) * Math.cos(elevation) * radius,
      Math.sin(elevation) * radius + 0.35,
      Math.cos(yaw) * Math.cos(elevation) * radius,
    );
    camera.lookAt(target);
    renderer.render(scene, camera);
  });

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  addEventListener('resize', resize);
  applyTheme();
  resize();
  addEventListener('themechange', applyTheme);
  addEventListener('pagehide', () => {
    running = false;
    renderer.setAnimationLoop(null);
  });

  return { applyTheme, setLiquidColor, setPh, setSelectedSample, playPour, playDrop };
}
