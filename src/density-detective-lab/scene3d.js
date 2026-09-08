import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const TONE = {
  light: 0xc5d3d8,
  mid: 0x9eafb6,
  deep: 0x7d8e96,
};

function woodTexture(hex, seed = 11) {
  const canvas = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, 256, 256);
  let n = seed >>> 0;
  const rnd = () => { n = (n * 1664525 + 1013904223) >>> 0; return n / 0xffffffff; };
  for (let y = 0; y < 256; y += 3) {
    ctx.strokeStyle = `rgba(255,236,196,${0.04 + rnd() * 0.05})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 256; x += 18) ctx.lineTo(x, y + Math.sin((x + y) * 0.04) * 2);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createDensityScene(canvas) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !reduced });
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
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xf7fff8, 0x1c3338, 1.1));
  const key = new THREE.DirectionalLight(0xfff6e4, 2.4);
  key.position.set(-5, 8, 4);
  key.castShadow = !reduced;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x7ec9d8, 0.5);
  fill.position.set(4, 3, -3);
  scene.add(fill);

  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({
    color, roughness: 0.4, metalness: 0.16, envMapIntensity: 1.1, ...extra,
  });
  const glass = (color, extra = {}) => new THREE.MeshPhysicalMaterial({
    color, roughness: 0.07, metalness: 0.02, transmission: 0.84, thickness: 0.35,
    transparent: true, ior: 1.46, envMapIntensity: 1.35, ...extra,
  });

  const table = new THREE.Mesh(new RoundedBoxGeometry(9.2, 0.26, 4.2, 4, 0.08), std(0xc4a06a, { map: woodTexture('#c4a06a'), roughness: 0.5 }));
  table.position.y = -0.13;
  table.receiveShadow = true;
  scene.add(table);

  const balance = new THREE.Group();
  balance.position.set(-2.15, 0, 0.1);
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.9, 1.05, 1.25, 3, 0.08), std(0x16343b, { metalness: 0.38, roughness: 0.26 }));
  body.position.y = 0.58;
  body.castShadow = true;
  const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.05, 36), std(0xd7e3e6, { metalness: 0.78, roughness: 0.18 }));
  pan.position.y = 1.18;
  const lcdCanvas = Object.assign(document.createElement('canvas'), { width: 256, height: 128 });
  const lcdCtx = lcdCanvas.getContext('2d');
  const lcdMap = new THREE.CanvasTexture(lcdCanvas);
  lcdMap.colorSpace = THREE.SRGBColorSpace;
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 0.5), new THREE.MeshBasicMaterial({ map: lcdMap, toneMapped: false }));
  lcd.position.set(0, 0.62, 0.64);
  balance.add(body, pan, lcd);
  scene.add(balance);

  const cylinder = new THREE.Group();
  cylinder.position.set(1.85, 0, 0.05);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.15, 40, 1, true), glass(0xcff5ff, { opacity: 0.42 }));
  tube.position.y = 1.18;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.7, 0.16, 32), std(0xd5e4e8, { metalness: 0.3 }));
  base.position.y = 0.08;
  const water = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    new THREE.MeshPhysicalMaterial({ color: 0x3fa9c4, roughness: 0.12, transmission: 0.28, transparent: true, opacity: 0.78 }),
  );
  water.position.y = 0.55;
  cylinder.add(tube, base, water);
  scene.add(cylinder);

  const specimen = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.34, 0.46, 2, 0.05), std(TONE.light, { metalness: 0.82, roughness: 0.22 }));
  specimen.castShadow = true;
  scene.add(specimen);

  let yaw = 0.38;
  let elevation = 0.58;
  let radius = 7.6;
  let weighed = false;
  let submerged = false;
  let waterMl = 40;
  let size = 1;
  let running = true;
  const restPos = new THREE.Vector3(-0.15, 0.22, 1.15);
  const panPos = new THREE.Vector3(-2.15, 1.28, 0.1);
  const waterPos = new THREE.Vector3(1.85, 0.72, 0.05);
  const specimenPos = restPos.clone();
  const targetLook = new THREE.Vector3(0, 0.85, 0);

  function drawLcd(text) {
    lcdCtx.fillStyle = '#071c22';
    lcdCtx.fillRect(0, 0, 256, 128);
    lcdCtx.fillStyle = '#93f5df';
    lcdCtx.textAlign = 'center';
    lcdCtx.font = 'bold 48px ui-monospace, monospace';
    lcdCtx.fillText(text, 128, 72);
    lcdMap.needsUpdate = true;
  }
  drawLcd('—  g');

  function applyTheme() {
    const dark = document.documentElement.dataset.theme === 'dark';
    scene.background = new THREE.Color(dark ? 0x0b1821 : 0xd9eef0);
    renderer.toneMappingExposure = dark ? 0.9 : 1.05;
  }

  function setSpecimen({ tone = 'light', volumeCm3 = 10, massText = '—' }) {
    size = 0.78 + volumeCm3 / 48;
    specimen.scale.set(size, size, size);
    specimen.material.color.setHex(TONE[tone] || TONE.light);
    drawLcd(massText);
  }

  function setState({ isWeighed, isSubmerged, massText, waterLevelMl }) {
    weighed = isWeighed;
    submerged = isSubmerged;
    waterMl = waterLevelMl;
    drawLcd(isWeighed ? massText : '—  g');
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
    const goal = submerged ? waterPos : weighed ? panPos : restPos;
    specimenPos.lerp(goal, 1 - Math.exp(-dt * 7));
    specimen.position.copy(specimenPos);
    const waterH = 0.42 + (waterMl / 75) * 1.15;
    water.scale.y = THREE.MathUtils.damp(water.scale.y, waterH, 8, dt);
    water.position.y = 0.12 + water.scale.y / 2;
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
  return { setSpecimen, setState, applyTheme };
}
