import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import { cameraFovForAspect, planViewportResize } from './view-size.js';
import {
  applyOrbitDrag,
  applyPinchZoom,
  applyWheelZoom,
  createOrbit,
  setOrbitGoal,
  tickOrbit,
} from './camera-orbit.js';

function cssHex(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw || fallback;
}

function woodTexture(hex, seed = 9) {
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

function brushedMetal(hex, seed = 4) {
  const canvas = Object.assign(document.createElement('canvas'), { width: 128, height: 128 });
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, 128, 128);
  let n = seed >>> 0;
  const rnd = () => { n = (n * 1664525 + 1013904223) >>> 0; return n / 0xffffffff; };
  for (let y = 0; y < 128; y += 1) {
    ctx.fillStyle = `rgba(255,255,255,${0.015 + rnd() * 0.04})`;
    ctx.fillRect(0, y, 128, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function labelTexture(text, bg = '#16343c', fg = '#e8f7f6') {
  const canvas = Object.assign(document.createElement('canvas'), { width: 256, height: 64 });
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = fg;
  ctx.font = '700 28px ui-rounded, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 34);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function tube(points, radius, material, segments = 48) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 8, false), material);
  mesh.castShadow = true;
  return mesh;
}

export function createIceScene(canvas) {
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
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(cameraFovForAspect(1), 1, 0.1, 80);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xf3fbff, 0x24343a, 1.12));
  const key = new THREE.DirectionalLight(0xfff6e8, 2.35);
  key.position.set(-4.2, 7.4, 5.4);
  key.castShadow = !reduced;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  scene.add(key);
  scene.add(new THREE.DirectionalLight(0x8ec9d8, 0.48).translateX(5).translateY(3).translateZ(-3));

  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({
    color, roughness: 0.42, metalness: 0.14, envMapIntensity: 1.05, ...extra,
  });
  const glass = (color, extra = {}) => new THREE.MeshPhysicalMaterial({
    color, roughness: 0.06, metalness: 0.02, transmission: 0.78, thickness: 0.28,
    ior: 1.45, transparent: true, envMapIntensity: 1.35, ...extra,
  });

  const table = new THREE.Mesh(
    new RoundedBoxGeometry(6.6, 0.2, 3.6, 4, 0.05),
    std(0xb88955, { map: woodTexture('#b88955', 5), roughness: 0.5 }),
  );
  table.position.y = -0.1;
  table.receiveShadow = true;
  scene.add(table);
  const apron = new THREE.Mesh(new RoundedBoxGeometry(6.7, 0.48, 3.7, 3, 0.04), std(0x6d4324, { roughness: 0.58 }));
  apron.position.y = -0.42;
  scene.add(apron);

  const cream = std(0xeeeae1, { metalness: 0.08, roughness: 0.36 });
  const creamDark = std(0xd4cfc4, { metalness: 0.1, roughness: 0.4 });
  const steel = std(0xd5dee4, { map: brushedMetal('#cfd8de'), metalness: 0.86, roughness: 0.18 });
  const ink = std(0x1b2228, { metalness: 0.35, roughness: 0.38 });
  const copper = std(0xb87333, { metalness: 0.92, roughness: 0.26, envMapIntensity: 1.3 });
  const brass = std(0xc4a35a, { metalness: 0.85, roughness: 0.28 });
  const hotMat = std(0xd65b32, { metalness: 0.55, roughness: 0.28, emissive: 0x000000, emissiveIntensity: 0 });
  const coldMat = std(0x3b9ad4, { metalness: 0.45, roughness: 0.3, emissive: 0x000000, emissiveIntensity: 0 });
  const liquidMat = std(0xc56a3a, { metalness: 0.5, roughness: 0.3 });

  const machine = new THREE.Group();
  machine.position.set(-0.12, 0, 0);
  scene.add(machine);

  const floor = new THREE.Mesh(new RoundedBoxGeometry(1.72, 0.08, 0.86, 3, 0.03), creamDark);
  floor.position.y = 0.04;
  floor.receiveShadow = true;
  const back = new THREE.Mesh(new RoundedBoxGeometry(1.72, 1.62, 0.07, 3, 0.03), cream);
  back.position.set(0, 0.85, -0.4);
  back.castShadow = true;
  const left = new THREE.Mesh(new RoundedBoxGeometry(0.07, 1.62, 0.86, 3, 0.03), cream);
  left.position.set(-0.825, 0.85, 0);
  left.castShadow = true;
  const right = new THREE.Mesh(new RoundedBoxGeometry(0.08, 1.62, 0.36, 3, 0.03), creamDark);
  right.position.set(0.83, 0.85, -0.25);
  const top = new THREE.Mesh(new RoundedBoxGeometry(1.72, 0.08, 0.86, 3, 0.03), cream);
  top.position.set(0, 1.66, 0);
  top.castShadow = true;
  const liner = new THREE.Mesh(new RoundedBoxGeometry(1.5, 1.28, 0.04, 2, 0.01), steel);
  liner.position.set(0.02, 0.92, -0.33);
  const linerLeft = new THREE.Mesh(new RoundedBoxGeometry(0.04, 1.28, 0.7, 2, 0.01), steel);
  linerLeft.position.set(-0.76, 0.92, 0.02);
  const frontBar = new THREE.Mesh(new RoundedBoxGeometry(1.72, 0.28, 0.08, 3, 0.02), ink);
  frontBar.position.set(0, 0.18, 0.42);
  machine.add(floor, back, left, right, top, liner, linerLeft, frontBar);

  const lcdCanvas = Object.assign(document.createElement('canvas'), { width: 512, height: 160 });
  const lcdCtx = lcdCanvas.getContext('2d');
  const lcdMap = new THREE.CanvasTexture(lcdCanvas);
  lcdMap.colorSpace = THREE.SRGBColorSpace;
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.2), new THREE.MeshBasicMaterial({ map: lcdMap, toneMapped: false }));
  lcd.position.set(-0.28, 0.19, 0.465);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), std(0x3a444c, { emissive: 0x1a2a22, emissiveIntensity: 0.4 }));
  led.position.set(0.52, 0.19, 0.465);
  machine.add(lcd, led);

  const door = new THREE.Group();
  door.position.set(-0.82, 0.95, 0.41);
  const railMat = cream;
  const rails = [
    new THREE.Mesh(new RoundedBoxGeometry(1.58, 0.08, 0.05, 2, 0.02), railMat),
    new THREE.Mesh(new RoundedBoxGeometry(1.58, 0.08, 0.05, 2, 0.02), railMat),
    new THREE.Mesh(new RoundedBoxGeometry(0.08, 1.14, 0.05, 2, 0.02), railMat),
    new THREE.Mesh(new RoundedBoxGeometry(0.08, 1.14, 0.05, 2, 0.02), railMat),
  ];
  rails[0].position.set(0.79, 0.6, 0);
  rails[1].position.set(0.79, -0.6, 0);
  rails[2].position.set(0.04, 0, 0);
  rails[3].position.set(1.54, 0, 0);
  rails.forEach((rail) => { rail.castShadow = true; door.add(rail); });
  const doorGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.42, 1.12),
    glass(0xcfeaf8, { opacity: 0.22, transmission: 0.72, thickness: 0.08 }),
  );
  doorGlass.position.set(0.79, 0, 0.01);
  const handle = new THREE.Mesh(new RoundedBoxGeometry(0.08, 0.42, 0.05, 2, 0.02), steel);
  handle.position.set(1.48, 0.08, 0.06);
  door.add(doorGlass, handle);
  machine.add(door);

  const tray = new THREE.Group();
  tray.position.set(-0.08, 1.12, 0.02);
  const trayBody = new THREE.Mesh(new RoundedBoxGeometry(0.92, 0.08, 0.58, 3, 0.02), steel);
  trayBody.castShadow = true;
  trayBody.receiveShadow = true;
  tray.add(trayBody);
  const wells = [];
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const x = (col - 1) * 0.28;
      const z = (row - 0.5) * 0.24;
      const well = new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.07, 0.2, 2, 0.03), steel);
      well.position.set(x, 0.04, z);
      const water = new THREE.Mesh(
        new RoundedBoxGeometry(0.2, 0.05, 0.16, 2, 0.02),
        new THREE.MeshPhysicalMaterial({
          color: 0x3fa9c4, roughness: 0.08, transmission: 0.35, transparent: true, opacity: 0.82, thickness: 0.2,
        }),
      );
      water.position.set(x, 0.06, z);
      water.visible = false;
      const ice = new THREE.Mesh(
        new RoundedBoxGeometry(0.2, 0.055, 0.16, 2, 0.02),
        new THREE.MeshPhysicalMaterial({
          color: 0xd7f4ff, roughness: 0.12, transmission: 0.46, transparent: true, opacity: 0.9, thickness: 0.22,
        }),
      );
      ice.position.set(x, 0.06, z);
      ice.scale.set(1, 0.08, 1);
      ice.visible = false;
      tray.add(well, water, ice);
      wells.push({ water, ice });
    }
  }
  machine.add(tray);

  const evap = new THREE.Group();
  evap.position.set(-0.08, 0.96, 0.02);
  for (let i = 0; i < 5; i += 1) {
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.22 + i * 0.01, 0.018, 8, 28), copper);
    coil.rotation.x = Math.PI / 2;
    coil.position.y = -i * 0.028;
    coil.castShadow = true;
    evap.add(coil);
  }
  const frost = [];
  for (let i = 0; i < 10; i += 1) {
    const flake = new THREE.Mesh(new THREE.OctahedronGeometry(0.018, 0), std(0xf4fbff, { roughness: 0.7, transparent: true, opacity: 0 }));
    flake.position.set((i % 5) * 0.12 - 0.24, 0.04, (i > 4 ? 0.12 : -0.1));
    evap.add(flake);
    frost.push(flake);
  }
  machine.add(evap);

  const compressor = new THREE.Group();
  compressor.position.set(-0.42, 0.32, 0.02);
  const can = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.34, 28), ink);
  can.castShadow = true;
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.08, 24), ink);
  cap.position.y = 0.2;
  const footL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.05, 10), std(0x2a2018, { roughness: 0.8 }));
  footL.position.set(-0.1, -0.18, 0.08);
  const footR = footL.clone();
  footR.position.set(0.1, -0.18, -0.08);
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.07), new THREE.MeshBasicMaterial({ map: labelTexture('COMP', '#222', '#f2c14e'), toneMapped: false }));
  tag.position.set(0, 0.02, 0.175);
  compressor.add(can, cap, footL, footR, tag);
  machine.add(compressor);

  const expander = new THREE.Group();
  expander.position.set(0.42, 0.62, -0.08);
  const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.12, 16), brass);
  valve.rotation.z = Math.PI / 2;
  valve.castShadow = true;
  const capNut = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.05, 6), brass);
  capNut.position.set(0.08, 0.02, 0);
  expander.add(valve, capNut);
  machine.add(expander);

  const condenser = new THREE.Group();
  condenser.position.set(1.02, 0.92, 0);
  const condBox = new THREE.Mesh(new RoundedBoxGeometry(0.22, 1.18, 0.7, 2, 0.02), ink);
  condBox.castShadow = true;
  condenser.add(condBox);
  for (let i = 0; i < 11; i += 1) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.012, 0.66), std(0x3a4148, { metalness: 0.7, roughness: 0.32 }));
    fin.position.set(0.02, -0.48 + i * 0.09, 0);
    condenser.add(fin);
  }
  const snake = tube([
    [0.12, -0.5, -0.28], [0.12, -0.5, 0.28], [0.12, -0.32, 0.28], [0.12, -0.32, -0.28],
    [0.12, -0.14, -0.28], [0.12, -0.14, 0.28], [0.12, 0.04, 0.28], [0.12, 0.04, -0.28],
    [0.12, 0.22, -0.28], [0.12, 0.22, 0.28], [0.12, 0.4, 0.28], [0.12, 0.4, -0.28],
  ], 0.018, hotMat, 64);
  condenser.add(snake);
  const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16), steel);
  fanHub.rotation.z = Math.PI / 2;
  fanHub.position.set(0.14, 0.18, 0);
  const blades = new THREE.Group();
  blades.position.copy(fanHub.position);
  for (let i = 0; i < 3; i += 1) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.28, 0.06), std(0x9aa7ae, { metalness: 0.4, roughness: 0.35 }));
    blade.rotation.x = (i * Math.PI * 2) / 3;
    blade.position.y = 0.12;
    blades.add(blade);
  }
  condenser.add(fanHub, blades);
  machine.add(condenser);

  const hotPipe = tube([
    [-0.42, 0.52, 0.02], [-0.42, 0.72, -0.22], [0.2, 0.86, -0.28], [0.92, 0.92, -0.2], [1.12, 0.5, -0.28],
  ], 0.022, hotMat);
  const liquidPipe = tube([
    [1.12, 1.32, 0.28], [0.7, 0.72, 0.1], [0.48, 0.62, -0.08],
  ], 0.016, liquidMat);
  const coldPipe = tube([
    [0.36, 0.62, -0.08], [0.12, 0.78, 0.12], [-0.08, 0.92, 0.18], [-0.08, 0.96, 0.02],
  ], 0.016, coldMat);
  const suction = tube([
    [-0.08, 0.9, -0.16], [-0.28, 0.62, -0.18], [-0.42, 0.48, -0.04],
  ], 0.02, coldMat);
  machine.add(hotPipe, liquidPipe, coldPipe, suction);

  const heatPuffs = [];
  for (let i = 0; i < 8; i += 1) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 10, 10),
      std(0xe07040, { transparent: true, opacity: 0, roughness: 0.8 }),
    );
    puff.position.set(1.22, 0.5 + i * 0.08, (i % 2) * 0.12 - 0.06);
    scene.add(puff);
    heatPuffs.push({ mesh: puff, seed: i * 0.37 });
  }

  const plate = (text, x, y, z, rx = 0) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.34, 0.09),
      new THREE.MeshBasicMaterial({ map: labelTexture(text), toneMapped: false, transparent: true }),
    );
    mesh.position.set(x, y, z);
    mesh.rotation.y = rx;
    machine.add(mesh);
    return mesh;
  };
  const labels = {
    molds: plate('ICE TRAY', -0.08, 1.42, 0.34),
    evap: plate('EVAP', -0.55, 0.92, 0.34),
    comp: plate('COMP', -0.42, 0.58, 0.34),
    cond: plate('COND', 1.18, 1.52, 0.12, -0.5),
    exp: plate('TXV', 0.42, 0.78, 0.28),
  };

  const pickables = [
    { name: 'molds', object: tray },
    { name: 'evap', object: evap },
    { name: 'comp', object: compressor },
    { name: 'cond', object: condenser },
    { name: 'exp', object: expander },
  ];

  const views = {
    stage: { yaw: 0.62, elevation: 0.42, radius: 4.15, target: { x: 0.15, y: 0.82, z: 0 } },
    loop: { yaw: 0.18, elevation: 0.28, radius: 3.15, target: { x: 0.05, y: 0.78, z: 0 } },
    condenser: { yaw: 1.18, elevation: 0.32, radius: 3.05, target: { x: 0.7, y: 0.9, z: 0 } },
  };
  let orbit = createOrbit(views.stage);
  canvas.dataset.orbitRadius = orbit.radius.toFixed(3);
  let state = {
    filled: false, power: false, doorOpen: false, iceFraction: 0, moldTempC: 22, loopStage: 'idle',
  };
  let onPick = null;
  let running = true;

  function drawLcd() {
    lcdCtx.fillStyle = '#082226';
    lcdCtx.fillRect(0, 0, 512, 160);
    lcdCtx.fillStyle = '#7ee0ea';
    lcdCtx.font = '700 64px ui-monospace, monospace';
    lcdCtx.fillText(`${state.moldTempC.toFixed(1)}°C`, 28, 78);
    lcdCtx.font = '700 32px ui-rounded, sans-serif';
    lcdCtx.fillStyle = state.power ? '#9dffc2' : '#8aa3a8';
    lcdCtx.fillText(state.power ? 'COOL' : 'STBY', 28, 128);
    lcdCtx.fillStyle = '#f4c65d';
    lcdCtx.fillText(`${Math.round(state.iceFraction * 100)}%`, 330, 128);
    lcdMap.needsUpdate = true;
  }

  function applyTheme() {
    const a = cssHex('--scene-a', '#d7ecef');
    scene.background = new THREE.Color(a);
    renderer.toneMappingExposure = document.documentElement.dataset.theme === 'dark' ? 0.9 : 1.05;
    key.intensity = document.documentElement.dataset.theme === 'dark' ? 1.9 : 2.35;
  }

  function setState(next) {
    state = { ...state, ...next };
    drawLcd();
  }

  function setView(name) {
    orbit = setOrbitGoal(orbit, views[name] || views.stage);
  }

  function pinchDistance(map) {
    const pts = [...map.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }

  function setPickHandler(handler) {
    onPick = handler;
  }

  let viewW = 0;
  let viewH = 0;
  function resize() {
    const plan = planViewportResize(
      { width: viewW, height: viewH },
      { width: window.innerWidth, height: window.innerHeight },
    );
    if (!plan.apply) return;
    viewW = plan.width;
    viewH = plan.height;
    renderer.setSize(plan.width, plan.height, false);
    camera.aspect = plan.width / plan.height;
    camera.fov = cameraFovForAspect(camera.aspect);
    camera.updateProjectionMatrix();
  }

  const pointers = new Map();
  let dragMoved = false;
  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', (event) => {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    canvas.setPointerCapture(event.pointerId);
    dragMoved = false;
  });
  canvas.addEventListener('pointermove', (event) => {
    const prev = pointers.get(event.pointerId);
    if (!prev) return;
    if (pointers.size === 2) {
      const before = new Map(pointers);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      dragMoved = true;
      orbit = applyPinchZoom(orbit, pinchDistance(before), pinchDistance(pointers));
      return;
    }
    if (pointers.size !== 1) {
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      return;
    }
    const dx = event.clientX - prev.x;
    const dy = event.clientY - prev.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true;
    orbit = applyOrbitDrag(orbit, dx, dy);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  });
  const drop = (event) => {
    if (pointers.size === 1 && !dragMoved && onPick) {
      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(pickables.map((item) => item.object), true);
      if (hits[0]) {
        const found = pickables.find((item) => hits[0].object === item.object || item.object.getObjectById(hits[0].object.id) || hits[0].object.parent === item.object || item.object.children.includes(hits[0].object) || ancestorIs(hits[0].object, item.object));
        if (found) onPick(found.name);
      }
    }
    pointers.delete(event.pointerId);
  };
  function ancestorIs(node, root) {
    let current = node;
    while (current) {
      if (current === root) return true;
      current = current.parent;
    }
    return false;
  }
  canvas.addEventListener('pointerup', drop);
  canvas.addEventListener('pointercancel', drop);
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    orbit = applyWheelZoom(orbit, event.deltaY);
    canvas.dataset.orbitRadius = orbit.radius.toFixed(3);
  }, { passive: false });

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!running || document.hidden || canvas.clientWidth === 0) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    orbit = tickOrbit(orbit, dt);
    const { yaw, elevation, radius, target } = orbit;
    canvas.dataset.orbitRadius = radius.toFixed(3);

    const doorAngle = state.doorOpen ? -1.12 : 0;
    door.rotation.y += (doorAngle - door.rotation.y) * Math.min(1, dt * 6);

    wells.forEach(({ water, ice }) => {
      water.visible = state.filled && state.iceFraction < 0.98;
      ice.visible = state.iceFraction > 0.02;
      ice.scale.y = 0.12 + state.iceFraction * 0.9;
      water.material.color.setHex(state.moldTempC > 8 ? 0x3fa9c4 : 0x8fd3e8);
    });

    const glowHot = state.power && (state.loopStage === 'comp' || state.loopStage === 'cond');
    const glowCold = state.power && (state.loopStage === 'exp' || state.loopStage === 'evap');
    hotMat.emissive.setHex(glowHot ? 0xd65b32 : 0x000000);
    hotMat.emissiveIntensity = glowHot ? 0.35 : 0;
    coldMat.emissive.setHex(glowCold ? 0x3b9ad4 : 0x000000);
    coldMat.emissiveIntensity = glowCold ? 0.32 : 0;
    led.material.emissive.setHex(state.power ? 0x3dff9a : 0x1a2a22);
    led.material.emissiveIntensity = state.power ? 1.4 : 0.3;

    if (state.power) {
      blades.rotation.x += dt * 8;
      compressor.position.y = 0.32 + Math.sin(performance.now() / 70) * 0.003;
    } else {
      compressor.position.y += (0.32 - compressor.position.y) * 0.2;
    }

    frost.forEach((flake, i) => {
      flake.material.opacity = Math.max(0, state.iceFraction * 0.85 - i * 0.04);
      flake.visible = flake.material.opacity > 0.05;
    });

    heatPuffs.forEach((puff) => {
      const on = state.power;
      puff.mesh.material.opacity = on ? 0.28 : 0;
      if (on) {
        puff.mesh.position.y = 0.55 + ((performance.now() / 900 + puff.seed) % 1) * 1.1;
        puff.mesh.scale.setScalar(0.7 + ((performance.now() / 700 + puff.seed) % 1));
      }
    });

    Object.entries(labels).forEach(([name, mesh]) => {
      mesh.material.opacity = state.highlight === name ? 1 : 0.72;
    });

    camera.position.set(
      Math.sin(yaw) * Math.cos(elevation) * radius,
      Math.sin(elevation) * radius + 0.28,
      Math.cos(yaw) * Math.cos(elevation) * radius,
    );
    camera.lookAt(target.x, target.y, target.z);
    renderer.render(scene, camera);
  });

  addEventListener('resize', resize);
  visualViewport?.addEventListener('resize', resize);
  applyTheme();
  resize();
  drawLcd();
  addEventListener('themechange', applyTheme);

  return { setState, setView, setPickHandler, applyTheme };
}
