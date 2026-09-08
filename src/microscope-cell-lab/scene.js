import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

function canvasTexture(draw, width = 512, height = 512) {
  const canvas = Object.assign(document.createElement('canvas'), { width, height });
  draw(canvas.getContext('2d'), width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function woodMap() {
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#6d4024';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 48; i += 1) {
      const y = (i / 48) * h;
      ctx.strokeStyle = `rgba(28, 14, 8, ${0.07 + (i % 5) * 0.03})`;
      ctx.lineWidth = 2 + (i % 3);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * 0.3, y + 10, w * 0.7, y - 12, w, y + 6);
      ctx.stroke();
    }
  });
}

function metalMap() {
  return canvasTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#d9dee8');
    g.addColorStop(0.45, '#8b93a3');
    g.addColorStop(1, '#4a5160');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

function drawEyepiece(ctx, w, h, view) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0b0d14';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w / 2 - 6, 0, Math.PI * 2);
  ctx.fill();

  const brightness = Math.max(0.08, Math.min(1, (view?.light ?? 40) / 70));
  const sharp = view?.sharpness ?? 0;
  const blur = (1 - sharp) * 14;
  ctx.filter = blur > 0.4 ? `blur(${blur}px)` : 'none';
  ctx.save();
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w / 2 - 18, 0, Math.PI * 2);
  ctx.clip();

  const glow = `rgba(${Math.round(255 * brightness)}, ${Math.round(236 * brightness)}, ${Math.round(180 * brightness)}, 1)`;
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  if (!view || sharp < 0.12) {
    ctx.fillStyle = `rgba(80, 60, 40, ${0.25 + sharp})`;
    for (let i = 0; i < 12; i += 1) {
      ctx.beginPath();
      ctx.ellipse(80 + (i * 97) % 360, 90 + (i * 53) % 340, 40, 22, i, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.filter = 'none';
    return;
  }

  const onion = view.slide !== 'cheek';
  const across = Math.max(3, Math.min(18, Math.round(view.cellsAcross || 8)));
  const cellW = (w - 80) / across;
  const cellH = onion ? cellW * 0.38 : cellW * 0.9;
  const wall = onion ? 5 : 0;
  ctx.translate(40, 40);

  for (let y = 0; y < across + 2; y += 1) {
    for (let x = 0; x < across + 1; x += 1) {
      const px = x * cellW + (onion ? 0 : (y % 2) * cellW * 0.3);
      const py = y * cellH;
      ctx.fillStyle = onion ? '#c6e39a' : '#f3c2b4';
      ctx.strokeStyle = onion ? '#5c3a1c' : 'rgba(140, 70, 70, 0.35)';
      ctx.lineWidth = wall || 1.5;
      ctx.beginPath();
      if (onion) {
        if (typeof ctx.roundRect === 'function') ctx.roundRect(px, py, cellW - 3, cellH - 3, 6);
        else ctx.rect(px, py, cellW - 3, cellH - 3);
      } else ctx.ellipse(px + cellW / 2, py + cellH / 2, cellW * 0.42, cellH * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (onion) {
        ctx.fillStyle = 'rgba(210, 240, 170, 0.7)';
        ctx.beginPath();
        ctx.ellipse(px + cellW * 0.52, py + cellH * 0.52, cellW * 0.28, cellH * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#6b3b8c';
        ctx.beginPath();
        ctx.arc(px + cellW * 0.18, py + cellH * 0.35, Math.max(3, cellW * 0.07), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#6b3b8c';
        ctx.beginPath();
        ctx.arc(px + cellW / 2, py + cellH / 2, Math.max(4, cellW * 0.12), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();
  ctx.filter = 'none';

  ctx.strokeStyle = 'rgba(255, 211, 106, 0.85)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w / 2 - 14, 0, Math.PI * 2);
  ctx.stroke();
}

export function createLabScene({ canvas, cssVar, onFirstInteract }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, innerWidth / innerHeight, 0.08, 80);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.28 });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(4.2, 64), shadowMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.001;
  floor.receiveShadow = true;
  scene.add(floor);

  function applyThemeBg() {
    const a = cssVar('--scene-a');
    const b = cssVar('--scene-b');
    const c = cssVar('--scene-c');
    const cv = Object.assign(document.createElement('canvas'), { width: 16, height: 512 });
    const ctx = cv.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, a);
    g.addColorStop(0.55, b);
    g.addColorStop(1, c);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 512);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    if (scene.background?.isTexture) scene.background.dispose();
    scene.background = tex;
    shadowMat.opacity = parseFloat(cssVar('--scene-shadow')) || 0.28;
  }

  scene.add(new THREE.HemisphereLight(0xfff4e5, 0x2a2438, 0.72));
  const key = new THREE.DirectionalLight(0xfff7ea, 2.15);
  key.position.set(4.6, 8.2, 5.4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 5;
  key.shadow.bias = -0.00035;
  const span = 5;
  key.shadow.camera.left = -span;
  key.shadow.camera.right = span;
  key.shadow.camera.top = span;
  key.shadow.camera.bottom = -span;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9db7ff, 0.55);
  fill.position.set(-6, 3.2, -4);
  scene.add(fill);

  const wood = woodMap();
  const metal = metalMap();
  const woodMat = new THREE.MeshStandardMaterial({ map: wood, roughness: 0.62, metalness: 0.04 });
  const enamel = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.35, metalness: 0.22 });
  const blackPaint = new THREE.MeshStandardMaterial({ color: 0x16181f, roughness: 0.4, metalness: 0.45 });
  const chrome = new THREE.MeshStandardMaterial({
    map: metal, color: 0xc5ccd8, roughness: 0.22, metalness: 0.88,
  });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9a24a, roughness: 0.32, metalness: 0.85 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xd7ecff, roughness: 0.06, metalness: 0, transmission: 0.7,
    thickness: 0.04, transparent: true, opacity: 0.35, ior: 1.5,
  });

  const table = new THREE.Mesh(new RoundedBoxGeometry(3.6, 0.16, 2.15, 3, 0.045), woodMat);
  table.position.y = 0.08;
  table.castShadow = true;
  table.receiveShadow = true;
  scene.add(table);
  for (const x of [-1.45, 1.45]) {
    for (const z of [-0.82, 0.82]) {
      const leg = new THREE.Mesh(new RoundedBoxGeometry(0.13, 0.78, 0.13, 2, 0.03), woodMat);
      leg.position.set(x, -0.31, z);
      leg.castShadow = true;
      scene.add(leg);
    }
  }

  const scope = new THREE.Group();
  scope.position.set(0.35, 0.16, 0.05);
  scene.add(scope);

  const base = new THREE.Mesh(new RoundedBoxGeometry(0.72, 0.08, 0.48, 3, 0.04), enamel);
  base.position.y = 0.05;
  base.castShadow = true;
  base.receiveShadow = true;
  scope.add(base);
  const footL = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.07, 0.42, 2, 0.03), enamel);
  footL.position.set(-0.28, 0.045, 0.02);
  scope.add(footL);
  const footR = footL.clone();
  footR.position.x = 0.28;
  scope.add(footR);

  const pillar = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.92, 0.16, 2, 0.03), enamel);
  pillar.position.set(0, 0.54, -0.14);
  pillar.castShadow = true;
  scope.add(pillar);
  const arm = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.16, 0.42, 2, 0.03), enamel);
  arm.position.set(0, 1.02, 0.04);
  arm.castShadow = true;
  scope.add(arm);

  const stage = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.035, 0.34, 2, 0.012), chrome);
  stage.position.set(0, 0.58, 0.12);
  stage.castShadow = true;
  stage.receiveShadow = true;
  scope.add(stage);
  const hole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.04, 24),
    new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.8, metalness: 0.2 }),
  );
  hole.position.set(0, 0.58, 0.12);
  scope.add(hole);

  const slide = new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.008, 0.08),
    new THREE.MeshPhysicalMaterial({
      color: 0xf4fbff, roughness: 0.08, metalness: 0, transmission: 0.55,
      transparent: true, opacity: 0.55, thickness: 0.02,
    }),
  );
  slide.position.set(0, 0.605, 0.12);
  scope.add(slide);
  const stain = new THREE.Mesh(
    new THREE.CircleGeometry(0.018, 20),
    new THREE.MeshStandardMaterial({ color: 0xc45c6a, roughness: 0.5, metalness: 0 }),
  );
  stain.rotation.x = -Math.PI / 2;
  stain.position.set(0, 0.611, 0.12);
  scope.add(stain);

  const clipGeo = new RoundedBoxGeometry(0.018, 0.012, 0.12, 1, 0.004);
  for (const x of [-0.08, 0.08]) {
    const clip = new THREE.Mesh(clipGeo, chrome);
    clip.position.set(x, 0.618, 0.12);
    scope.add(clip);
  }

  const lamp = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.05, 0.06, 20),
    new THREE.MeshStandardMaterial({
      color: 0xffe7a0, emissive: 0xffc14d, emissiveIntensity: 1.4, roughness: 0.35,
    }),
  );
  lamp.position.set(0, 0.42, 0.12);
  scope.add(lamp);
  const lampGlow = new THREE.PointLight(0xffd36a, 1.6, 2.4, 2);
  lampGlow.position.copy(lamp.position);
  scope.add(lampGlow);

  const turret = new THREE.Group();
  turret.position.set(0, 0.78, 0.12);
  scope.add(turret);
  const nosepiece = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 24), blackPaint);
  turret.add(nosepiece);
  const objLens = [
    { mag: 4, len: 0.07, color: 0xd4a017 },
    { mag: 10, len: 0.1, color: 0xc45c6a },
    { mag: 40, len: 0.14, color: 0x3d7a4a },
  ];
  objLens.forEach((spec, index) => {
    const ang = (index / 3) * Math.PI * 2;
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.02, spec.len, 16),
      new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.35, metalness: 0.4 }),
    );
    body.position.set(Math.sin(ang) * 0.055, -spec.len / 2 - 0.02, Math.cos(ang) * 0.055);
    turret.add(body);
  });

  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.34, 20), blackPaint);
  tube.position.set(0, 1.12, 0.12);
  tube.castShadow = true;
  scope.add(tube);
  const eyepiece = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.042, 0.1, 20), chrome);
  eyepiece.position.set(0, 1.32, 0.12);
  scope.add(eyepiece);
  const eyeGlass = new THREE.Mesh(new THREE.CircleGeometry(0.028, 20), glass);
  eyeGlass.rotation.x = -Math.PI / 2;
  eyeGlass.position.set(0, 1.372, 0.12);
  scope.add(eyeGlass);

  const coarse = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.08, 20), brass);
  coarse.rotation.z = Math.PI / 2;
  coarse.position.set(0.12, 0.72, -0.14);
  scope.add(coarse);
  const fine = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.06, 16), chrome);
  fine.rotation.z = Math.PI / 2;
  fine.position.set(0.16, 0.72, -0.14);
  scope.add(fine);

  const lcd = new THREE.Mesh(
    new THREE.PlaneGeometry(0.16, 0.07),
    new THREE.MeshStandardMaterial({
      color: 0x0d1f14, emissive: 0x3dff9a, emissiveIntensity: 0.55, roughness: 0.4,
    }),
  );
  lcd.position.set(0.11, 0.9, 0.02);
  lcd.rotation.y = Math.PI / 2.6;
  scope.add(lcd);

  const eyeCanvas = Object.assign(document.createElement('canvas'), { width: 512, height: 512 });
  const eyeTex = new THREE.CanvasTexture(eyeCanvas);
  eyeTex.colorSpace = THREE.SRGBColorSpace;
  const eyeMat = new THREE.MeshStandardMaterial({
    map: eyeTex, roughness: 0.35, metalness: 0.05, emissive: 0x222014, emissiveIntensity: 0.35,
  });
  const viewDisc = new THREE.Mesh(new THREE.CircleGeometry(0.52, 48), eyeMat);
  viewDisc.position.set(-1.05, 1.18, 0.35);
  viewDisc.castShadow = true;
  scene.add(viewDisc);
  const viewRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.52, 0.035, 12, 48),
    brass,
  );
  viewRim.position.copy(viewDisc.position);
  scene.add(viewRim);

  const target = new THREE.Vector3(-0.15, 0.95, 0.1);
  let yaw = 0.55;
  let pitch = 0.38;
  let radius = 3.55;
  const orbit = { dragging: false, px: 0, py: 0, pointerId: null };

  function placeCamera() {
    const cp = Math.cos(pitch);
    camera.position.set(
      target.x + Math.sin(yaw) * cp * radius,
      target.y + Math.sin(pitch) * radius,
      target.z + Math.cos(yaw) * cp * radius,
    );
    camera.lookAt(target);
    viewDisc.lookAt(camera.position);
    viewRim.lookAt(camera.position);
  }

  let lastSize = { w: 0, h: 0 };
  function resize() {
    const w = innerWidth;
    const h = innerHeight;
    if (w === lastSize.w && h === lastSize.h) return;
    lastSize = { w, h };
    renderer.setSize(w, h);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  function setView(view) {
    if (!view) return;
    drawEyepiece(eyeCanvas.getContext('2d'), 512, 512, view);
    eyeTex.needsUpdate = true;
    const glow = 0.4 + (view.light / 100) * 2.2;
    lamp.material.emissiveIntensity = glow;
    lampGlow.intensity = 0.4 + view.light / 40;
    const idx = view.objectiveMag === 40 ? 2 : view.objectiveMag === 10 ? 1 : 0;
    turret.rotation.y = -idx * ((Math.PI * 2) / 3);
    coarse.rotation.x = view.stageUm * 0.01;
    fine.rotation.x = (view.stageUm % 40) * 0.2;
    stain.material.color.set(view.slide === 'cheek' ? 0xf3c2b4 : 0xc45c6a);
    eyeMat.emissiveIntensity = 0.2 + view.sharpness * 0.5;
  }

  canvas.addEventListener('pointerdown', (event) => {
    onFirstInteract?.();
    orbit.dragging = true;
    orbit.px = event.clientX;
    orbit.py = event.clientY;
    orbit.pointerId = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!orbit.dragging) return;
    const dx = event.clientX - orbit.px;
    const dy = event.clientY - orbit.py;
    orbit.px = event.clientX;
    orbit.py = event.clientY;
    yaw -= dx * 0.005;
    pitch = Math.min(1.15, Math.max(0.12, pitch + dy * 0.004));
  });
  const stopDrag = (event) => {
    if (orbit.pointerId === event.pointerId) orbit.dragging = false;
  };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    radius = Math.min(6.4, Math.max(2.4, radius + event.deltaY * 0.004));
  }, { passive: false });

  addEventListener('resize', resize);
  applyThemeBg();
  resize();
  placeCamera();
  setView({
    light: 40, sharpness: 0, slide: 'onion', cellsAcross: 22.5, objectiveMag: 4, stageUm: -800,
  });

  let raf = 0;
  function loop() {
    raf = requestAnimationFrame(loop);
    placeCamera();
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(loop);

  return {
    setView,
    applyTheme: applyThemeBg,
    resize,
    dispose() {
      cancelAnimationFrame(raf);
      renderer.dispose();
    },
  };
}
