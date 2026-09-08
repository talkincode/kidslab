import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

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

export function createMassScene(canvas) {
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
  key.shadow.camera.left = -6;
  key.shadow.camera.right = 6;
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
    new RoundedBoxGeometry(7.2, 0.22, 4.2, 4, 0.06),
    std(0xb88955, { map: woodTexture('#b88955', 3), roughness: 0.48 }),
  );
  table.position.y = -0.11;
  table.receiveShadow = true;
  scene.add(table);
  const apron = new THREE.Mesh(new RoundedBoxGeometry(7.3, 0.55, 4.3, 3, 0.04), std(0x6d4324, { roughness: 0.55 }));
  apron.position.y = -0.48;
  scene.add(apron);

  const steel = std(0xd7dee3, { metalness: 0.86, roughness: 0.18 });
  const cream = std(0xece7dc, { metalness: 0.08, roughness: 0.38 });
  const ink = std(0x1c2428, { metalness: 0.22, roughness: 0.4 });

  const balance = new THREE.Group();
  const chassis = new THREE.Mesh(new RoundedBoxGeometry(2.7, 0.62, 2.05, 4, 0.08), cream);
  chassis.position.y = 0.37;
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  const deck = new THREE.Mesh(new RoundedBoxGeometry(2.55, 0.08, 1.9, 3, 0.04), cream);
  deck.position.y = 0.71;
  const front = new THREE.Mesh(new RoundedBoxGeometry(2.35, 0.42, 0.08, 2, 0.02), ink);
  front.position.set(0, 0.36, 1.06);
  const lcdCanvas = Object.assign(document.createElement('canvas'), { width: 512, height: 192 });
  const lcdCtx = lcdCanvas.getContext('2d');
  const lcdMap = new THREE.CanvasTexture(lcdCanvas);
  lcdMap.colorSpace = THREE.SRGBColorSpace;
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.58), new THREE.MeshBasicMaterial({ map: lcdMap, toneMapped: false }));
  lcd.position.set(0, 0.38, 1.11);
  const tare = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.12, 0.08, 2, 0.02), std(0xc9a227, { metalness: 0.35, roughness: 0.28 }));
  tare.position.set(0.92, 0.22, 1.1);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.28, 20), steel);
  stem.position.y = 0.88;
  const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.07, 48), steel);
  pan.position.y = 1.05;
  pan.castShadow = true;
  pan.receiveShadow = true;
  const panLip = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.035, 10, 48), steel);
  panLip.rotation.x = Math.PI / 2;
  panLip.position.y = 1.09;
  [[-1.1, 0.06, -0.78], [1.1, 0.06, -0.78], [-1.1, 0.06, 0.78], [1.1, 0.06, 0.78]].forEach(([x, y, z]) => {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.12, 12), ink);
    foot.position.set(x, y, z);
    balance.add(foot);
  });
  balance.add(chassis, deck, front, lcd, tare, stem, pan, panLip);
  scene.add(balance);

  const beaker = new THREE.Group();
  beaker.position.set(0, 1.09, 0);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.46, 1.15, 48, 1, true), glass(0xd7f4ff, { opacity: 0.95 }));
  wall.position.y = 0.62;
  wall.castShadow = true;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.04, 12, 48), glass(0xecfbff));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 1.2;
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.46, 32), glass(0xcfeaf8, { transmission: 0.35 }));
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.y = 0.05;
  const liquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.4, 1, 32),
    new THREE.MeshPhysicalMaterial({ color: 0xf0c56a, roughness: 0.18, transmission: 0.35, transparent: true, opacity: 0.92 }),
  );
  liquid.position.y = 0.38;
  liquid.scale.y = 0.58;
  const powder = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 12), std(0xf7f1e4, { roughness: 0.9 }));
  powder.scale.set(1.25, 0.36, 1.25);
  powder.position.y = 0.18;
  beaker.add(wall, rim, bottom, liquid, powder);
  scene.add(beaker);

  const dome = new THREE.Mesh(
    new THREE.CylinderGeometry(0.78, 0.82, 1.55, 40, 1, true),
    glass(0xbfe7f4, { transmission: 0.72, opacity: 0.42, transparent: true }),
  );
  dome.position.set(0, 1.9, 0);
  dome.scale.setScalar(0.001);
  const domeCap = new THREE.Mesh(new THREE.SphereGeometry(0.78, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), glass(0xbfe7f4, { transmission: 0.72, opacity: 0.42 }));
  domeCap.position.y = 0.78;
  dome.add(domeCap);
  scene.add(dome);

  const bubbles = Array.from({ length: 18 }, (_, i) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.04 + (i % 4) * 0.01, 10, 10),
      new THREE.MeshPhysicalMaterial({ color: 0xe7fff8, roughness: 0.12, transmission: 0.7, transparent: true, opacity: 0.7 }),
    );
    mesh.visible = false;
    beaker.add(mesh);
    return { mesh, seed: i * 17.13 };
  });

  const vinegar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.11, 0.38, 16),
    new THREE.MeshPhysicalMaterial({ color: 0xe7c56a, transparent: true, opacity: 0.85, roughness: 0.15 }),
  );
  vinegar.visible = false;
  scene.add(vinegar);

  let yaw = 0.38;
  let elevation = 0.58;
  let radius = 6.4;
  let vessel = 'open';
  let massG = 100;
  let reacting = 0;
  let targetMass = 100;
  let running = true;
  const target = new THREE.Vector3(0, 1.25, 0);

  function drawLcd(value) {
    lcdCtx.fillStyle = '#0b1c20';
    lcdCtx.fillRect(0, 0, 512, 192);
    lcdCtx.fillStyle = '#3d5a58';
    lcdCtx.font = '700 22px ui-sans-serif, sans-serif';
    lcdCtx.textAlign = 'left';
    lcdCtx.fillText('BALANCE', 28, 36);
    lcdCtx.fillStyle = '#8ff5d4';
    lcdCtx.textAlign = 'center';
    lcdCtx.font = 'bold 92px ui-monospace, monospace';
    lcdCtx.fillText(Number(value).toFixed(1), 250, 128);
    lcdCtx.font = 'bold 36px ui-monospace, monospace';
    lcdCtx.fillText('g', 430, 128);
    lcdMap.needsUpdate = true;
  }
  drawLcd(massG);

  function applyTheme() {
    const a = cssHex('--scene-a', '#dff2f1');
    const b = cssHex('--bench', '#12333a');
    scene.background = new THREE.Color(a);
    renderer.toneMappingExposure = document.documentElement.dataset.theme === 'dark' ? 0.92 : 1.08;
    key.intensity = document.documentElement.dataset.theme === 'dark' ? 2.1 : 2.6;
    void b;
  }

  function setVessel(next) {
    vessel = next;
  }

  function setMass(value) {
    massG = value;
    drawLcd(massG);
  }

  function playReaction({ massAfterG }) {
    reacting = 1;
    targetMass = massAfterG;
    vinegar.visible = true;
    vinegar.position.set(0, 2.85, 0);
    bubbles.forEach((bubble, i) => {
      bubble.mesh.visible = true;
      bubble.mesh.position.set((i % 5) * 0.12 - 0.24, 0.4, ((i * 3) % 5) * 0.1 - 0.2);
    });
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
    elevation = THREE.MathUtils.clamp(elevation + (event.clientY - prev.y) * 0.005, 0.28, 1.2);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  });
  const drop = (event) => pointers.delete(event.pointerId);
  canvas.addEventListener('pointerup', drop);
  canvas.addEventListener('pointercancel', drop);
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    radius = THREE.MathUtils.clamp(radius * Math.exp(THREE.MathUtils.clamp(event.deltaY, -80, 80) * 0.002), 5.2, 11);
  }, { passive: false });

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!running || document.hidden || canvas.clientWidth === 0) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    if (reacting > 0) {
      reacting = Math.max(0, reacting - dt / 1.15);
      const p = 1 - reacting;
      vinegar.position.y = 2.85 - easeOut(Math.min(1, p * 1.6)) * 0.7;
      vinegar.material.opacity = p < 0.55 ? 0.85 : 0.85 * (1 - (p - 0.55) / 0.45);
      if (p > 0.7) vinegar.visible = false;
      liquid.material.color.setHex(p < 0.4 ? 0xf0c56a : 0xd9784c);
      liquid.scale.y = 0.62 + Math.sin(p * Math.PI) * 0.08;
      const shown = THREE.MathUtils.lerp(100, targetMass, easeOut(p));
      if (Math.abs(shown - massG) > 0.05) setMass(shown);
      bubbles.forEach((bubble, i) => {
        const rise = (p * 1.4 + bubble.seed * 0.01) % 1;
        bubble.mesh.position.y = 0.45 + rise * (vessel === 'open' ? 1.8 : 1.05);
        bubble.mesh.position.x = Math.sin(bubble.seed + p * 8) * 0.22;
        bubble.mesh.visible = p > 0.12 && p < 0.98;
        bubble.mesh.material.opacity = vessel === 'open' && rise > 0.72 ? 0.15 : 0.7;
      });
      if (reacting === 0) {
        setMass(targetMass);
        vinegar.visible = false;
        bubbles.forEach((bubble) => { bubble.mesh.visible = false; });
      }
    }
    const domeScale = vessel === 'sealed' ? 1 : 0.001;
    dome.scale.setScalar(THREE.MathUtils.damp(dome.scale.x, domeScale, 8, dt));
    dome.position.y = THREE.MathUtils.damp(dome.position.y, vessel === 'sealed' ? 1.92 : 0.4, 8, dt);
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

  return { setVessel, setMass, playReaction, applyTheme };
}
