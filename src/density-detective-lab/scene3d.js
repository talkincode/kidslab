import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const TONE = {
  light: 0xd7e2e6,
  mid: 0xb7c4ca,
  deep: 0x8f9ea6,
};

const CYLINDER_CAPACITY_ML = 100;

function woodTexture(hex, seed = 11) {
  const canvas = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, 256, 256);
  let n = seed >>> 0;
  const rnd = () => { n = (n * 1664525 + 1013904223) >>> 0; return n / 0xffffffff; };
  for (let y = 0; y < 256; y += 2) {
    ctx.strokeStyle = `rgba(${rnd() > 0.5 ? '255,230,180' : '40,12,6'},${0.03 + rnd() * 0.05})`;
    ctx.lineWidth = 0.6 + rnd() * 1.5;
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

function steelTexture() {
  const canvas = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  gradient.addColorStop(0, '#9aa3aa');
  gradient.addColorStop(0.35, '#e8eef2');
  gradient.addColorStop(0.55, '#b7c0c6');
  gradient.addColorStop(1, '#f4f7f8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  ctx.globalAlpha = 0.08;
  for (let y = 0; y < 256; y += 3) {
    ctx.fillStyle = y % 6 === 0 ? '#ffffff' : '#4a555c';
    ctx.fillRect(0, y, 256, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function tickTexture() {
  const canvas = Object.assign(document.createElement('canvas'), { width: 256, height: 1024 });
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 256, 1024);
  for (let ml = 0; ml <= CYLINDER_CAPACITY_ML; ml += 2) {
    const y = 1000 - (ml / CYLINDER_CAPACITY_ML) * 960;
    const major = ml % 10 === 0;
    ctx.strokeStyle = major ? 'rgba(18, 36, 42, 0.9)' : 'rgba(18, 36, 42, 0.35)';
    ctx.lineWidth = major ? 3.2 : 1.4;
    ctx.beginPath();
    ctx.moveTo(major ? 16 : 52, y);
    ctx.lineTo(major ? 118 : 92, y);
    ctx.stroke();
    if (major && ml > 0) {
      ctx.fillStyle = 'rgba(18, 36, 42, 0.92)';
      ctx.font = '700 36px ui-sans-serif, sans-serif';
      ctx.fillText(String(ml), 128, y + 12);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function specimenScale(volumeCm3) {
  return Math.min(0.42, Math.cbrt(volumeCm3) * 0.132);
}

export function createDensityScene(canvas) {
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
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x1c3338, 1.12));
  const key = new THREE.DirectionalLight(0xfff1d4, 2.55);
  key.position.set(-4.6, 8.2, 5.2);
  key.castShadow = !reduced;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -7;
  key.shadow.camera.right = 7;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  scene.add(key);
  scene.add(new THREE.DirectionalLight(0x8ec9d8, 0.52).translateX(5).translateY(3).translateZ(-4));

  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({
    color, roughness: 0.4, metalness: 0.14, envMapIntensity: 1.1, ...extra,
  });
  const glass = (color, extra = {}) => new THREE.MeshPhysicalMaterial({
    color, roughness: 0.06, metalness: 0.02, transmission: 0.88, thickness: 0.28,
    transparent: true, ior: 1.46, envMapIntensity: 1.4, ...extra,
  });
  const brushed = steelTexture();
  const steel = std(0xd7dee3, { metalness: 0.88, roughness: 0.16, map: brushed, envMapIntensity: 1.35 });

  const table = new THREE.Mesh(
    new RoundedBoxGeometry(9.4, 0.24, 4.4, 4, 0.07),
    std(0xc4a06a, { map: woodTexture('#c4a06a'), roughness: 0.5 }),
  );
  table.position.y = -0.12;
  table.receiveShadow = true;
  scene.add(table);
  const apron = new THREE.Mesh(new RoundedBoxGeometry(9.5, 0.58, 4.5, 3, 0.05), std(0x6d4324, { roughness: 0.56 }));
  apron.position.y = -0.5;
  scene.add(apron);

  const cream = std(0xece7dc, { metalness: 0.08, roughness: 0.36 });
  const ink = std(0x1c2428, { metalness: 0.22, roughness: 0.4 });

  const balance = new THREE.Group();
  balance.position.set(-2.15, 0, 0.08);
  const chassis = new THREE.Mesh(new RoundedBoxGeometry(2.55, 0.62, 1.95, 4, 0.08), cream);
  chassis.position.y = 0.37;
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  const deck = new THREE.Mesh(new RoundedBoxGeometry(2.4, 0.08, 1.8, 3, 0.04), cream);
  deck.position.y = 0.71;
  const front = new THREE.Mesh(new RoundedBoxGeometry(2.2, 0.44, 0.08, 2, 0.02), ink);
  front.position.set(0, 0.36, 1.02);
  const lcdCanvas = Object.assign(document.createElement('canvas'), { width: 512, height: 192 });
  const lcdCtx = lcdCanvas.getContext('2d');
  const lcdMap = new THREE.CanvasTexture(lcdCanvas);
  lcdMap.colorSpace = THREE.SRGBColorSpace;
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(1.62, 0.56), new THREE.MeshBasicMaterial({ map: lcdMap, toneMapped: false }));
  lcd.position.set(0, 0.38, 1.07);
  const tare = new THREE.Mesh(new RoundedBoxGeometry(0.32, 0.11, 0.07, 2, 0.02), std(0xc9a227, { metalness: 0.35, roughness: 0.28 }));
  tare.position.set(0.86, 0.22, 1.06);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.19, 0.26, 24), steel);
  stem.position.y = 0.88;
  const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.055, 48), steel);
  pan.position.y = 1.04;
  pan.castShadow = true;
  pan.receiveShadow = true;
  const panLip = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.032, 10, 48), steel);
  panLip.rotation.x = Math.PI / 2;
  panLip.position.y = 1.07;
  [[-1.05, 0.06, -0.74], [1.05, 0.06, -0.74], [-1.05, 0.06, 0.74], [1.05, 0.06, 0.74]].forEach(([x, y, z]) => {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.12, 12), ink);
    foot.position.set(x, y, z);
    balance.add(foot);
  });
  balance.add(chassis, deck, front, lcd, tare, stem, pan, panLip);
  scene.add(balance);

  const cylinder = new THREE.Group();
  cylinder.position.set(1.92, 0, 0.04);
  const footRing = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.86, 0.14, 32), std(0xd5e4e8, { metalness: 0.28, roughness: 0.32 }));
  footRing.position.y = 0.07;
  footRing.castShadow = true;
  const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 2.18, 48, 1, true), glass(0xd7f7ff, { opacity: 0.22 }));
  outer.position.y = 1.22;
  const inner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 2.18, 48, 1, true),
    glass(0xcff5ff, { opacity: 0.16, side: THREE.BackSide, thickness: 0.08 }),
  );
  inner.position.y = 1.22;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.035, 12, 48), glass(0xecfbff, { transmission: 0.7 }));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 2.3;
  const floor = new THREE.Mesh(new THREE.CircleGeometry(0.5, 36), glass(0xcfeaf8, { transmission: 0.32, opacity: 0.85 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.14;
  const ticks = new THREE.Mesh(
    new THREE.CylinderGeometry(0.505, 0.505, 1.92, 48, 1, true),
    new THREE.MeshBasicMaterial({ map: tickTexture(), transparent: true, opacity: 0.92, side: THREE.DoubleSide, toneMapped: false }),
  );
  ticks.position.y = 1.18;
  const water = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.48, 1, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x2f9bb8,
      roughness: 0.06,
      metalness: 0,
      transmission: 0.42,
      thickness: 0.55,
      ior: 1.33,
      transparent: true,
      opacity: 0.78,
      envMapIntensity: 1.15,
    }),
  );
  const meniscusPts = [];
  for (let i = 0; i <= 18; i += 1) {
    const radius = (i / 18) * 0.48;
    meniscusPts.push(new THREE.Vector2(radius, 0.028 * (radius / 0.48) ** 2));
  }
  const meniscus = new THREE.Mesh(
    new THREE.LatheGeometry(meniscusPts, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x7ed0e4,
      roughness: 0.04,
      transmission: 0.58,
      thickness: 0.08,
      ior: 1.33,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
    }),
  );
  cylinder.add(footRing, outer, inner, rim, floor, ticks, water, meniscus);
  scene.add(cylinder);

  const specimen = new THREE.Mesh(
    new RoundedBoxGeometry(1, 1, 1, 2, 0.08),
    std(TONE.light, { metalness: 0.86, roughness: 0.18, envMapIntensity: 1.3 }),
  );
  specimen.castShadow = true;
  specimen.receiveShadow = true;
  scene.add(specimen);

  let yaw = 0.42;
  let elevation = 0.52;
  let radius = 7.4;
  let weighed = false;
  let submerged = false;
  let waterMl = 40;
  let size = specimenScale(10);
  specimen.scale.set(size, size, size);
  let running = true;
  const restPos = new THREE.Vector3(-0.12, 0.28, 1.18);
  const panPos = new THREE.Vector3(-2.15, 1.12, 0.08);
  const waterPos = new THREE.Vector3(1.92, 0.55, 0.04);
  const specimenPos = restPos.clone();
  const targetLook = new THREE.Vector3(0, 0.92, 0);

  function drawLcd(text, stable = false) {
    lcdCtx.fillStyle = '#071c22';
    lcdCtx.fillRect(0, 0, 512, 192);
    lcdCtx.fillStyle = '#3d5a58';
    lcdCtx.font = '700 22px ui-sans-serif, sans-serif';
    lcdCtx.textAlign = 'left';
    lcdCtx.fillText(stable ? 'STABLE' : 'BALANCE', 28, 36);
    lcdCtx.fillStyle = '#8ff5d4';
    lcdCtx.textAlign = 'center';
    lcdCtx.font = 'bold 84px ui-monospace, monospace';
    lcdCtx.fillText(text, 250, 128);
    lcdMap.needsUpdate = true;
  }
  drawLcd('—  g');

  function applyTheme() {
    const dark = document.documentElement.dataset.theme === 'dark';
    scene.background = new THREE.Color(dark ? 0x0b1821 : 0xd9eef0);
    renderer.toneMappingExposure = dark ? 0.9 : 1.08;
    key.intensity = dark ? 2.1 : 2.55;
  }

  function setSpecimen({ tone = 'light', volumeCm3 = 10, massText = '—  g' }) {
    size = specimenScale(volumeCm3);
    specimen.scale.set(size, size, size);
    specimen.material.color.setHex(TONE[tone] || TONE.light);
    drawLcd(massText, false);
  }

  function setState({ isWeighed, isSubmerged, massText, waterLevelMl }) {
    weighed = isWeighed;
    submerged = isSubmerged;
    waterMl = waterLevelMl;
    drawLcd(isWeighed ? massText : '—  g', isWeighed);
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
  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', (event) => {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    const prev = pointers.get(event.pointerId);
    if (!prev || pointers.size !== 1) return;
    yaw -= (event.clientX - prev.x) * 0.007;
    elevation = THREE.MathUtils.clamp(elevation + (event.clientY - prev.y) * 0.005, 0.22, 1.15);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  });
  const drop = (event) => pointers.delete(event.pointerId);
  canvas.addEventListener('pointerup', drop);
  canvas.addEventListener('pointercancel', drop);
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    radius = THREE.MathUtils.clamp(radius * Math.exp(THREE.MathUtils.clamp(event.deltaY, -80, 80) * 0.002), 5.4, 11);
  }, { passive: false });

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!running || document.hidden || canvas.clientWidth === 0) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const panGoal = panPos.clone();
    panGoal.y = 1.07 + size / 2;
    const dunkGoal = waterPos.clone();
    dunkGoal.y = 0.22 + size / 2;
    const restGoal = restPos.clone();
    restGoal.y = size / 2;
    const goal = submerged ? dunkGoal : weighed ? panGoal : restGoal;
    specimenPos.lerp(goal, 1 - Math.exp(-dt * 7));
    specimen.position.copy(specimenPos);
    const waterH = Math.max(0.18, (waterMl / CYLINDER_CAPACITY_ML) * 1.92);
    water.scale.y = THREE.MathUtils.damp(water.scale.y, waterH, 8, dt);
    water.position.y = 0.14 + water.scale.y / 2;
    meniscus.position.y = 0.14 + water.scale.y;
    camera.position.set(
      Math.sin(yaw) * Math.cos(elevation) * radius,
      Math.sin(elevation) * radius + 0.4,
      Math.cos(yaw) * Math.cos(elevation) * radius,
    );
    camera.lookAt(targetLook);
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
  return { setSpecimen, setState, applyTheme };
}
