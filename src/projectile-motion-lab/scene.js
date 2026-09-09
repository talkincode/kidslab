import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const BALL_R = 0.18;

function canvasTexture(draw, width = 512, height = 512) {
  const canvas = Object.assign(document.createElement('canvas'), { width, height });
  draw(canvas.getContext('2d'), width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function grassMap() {
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#3f8a46';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i += 1) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.strokeStyle = i % 4 === 0 ? '#2d6a34' : '#5aa85a';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 6, y - 8 - Math.random() * 10);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255, 236, 170, 0.07)';
    ctx.fillRect(0, 0, w, h);
  }, 1024, 1024);
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
    for (let i = 0; i < 18; i += 1) {
      ctx.fillStyle = `rgba(255,255,255,${0.03 + (i % 2) * 0.03})`;
      ctx.fillRect(0, i * 28, w, 3);
    }
  });
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
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.12, 120);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const grass = grassMap();
  grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
  grass.repeat.set(8, 4);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 16),
    new THREE.MeshStandardMaterial({ map: grass, roughness: 0.95, metalness: 0.02 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(10, 0, 0);
  ground.receiveShadow = true;
  scene.add(ground);

  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.28 });
  const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(36, 16), shadowMat);
  shadowFloor.rotation.x = -Math.PI / 2;
  shadowFloor.position.set(10, 0.01, 0);
  shadowFloor.receiveShadow = true;
  scene.add(shadowFloor);

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
  const key = new THREE.DirectionalLight(0xfff7ea, 2.2);
  key.position.set(8, 18, 10);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 5;
  key.shadow.bias = -0.00035;
  key.shadow.camera.left = -6;
  key.shadow.camera.right = 22;
  key.shadow.camera.top = 16;
  key.shadow.camera.bottom = -8;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 48;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9db7ff, 0.5);
  fill.position.set(-8, 6, -6);
  scene.add(fill);

  const wood = woodMap();
  const metal = metalMap();
  const woodMat = new THREE.MeshStandardMaterial({
    map: wood, roughness: 0.62, metalness: 0.04, color: 0xffffff,
  });
  const metalMat = new THREE.MeshStandardMaterial({
    map: metal, roughness: 0.28, metalness: 0.86, color: 0xc5ccd8,
  });
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x1b1f2a, roughness: 0.38, metalness: 0.72,
  });
  const brass = new THREE.MeshStandardMaterial({
    color: 0xc9a24a, roughness: 0.32, metalness: 0.85,
  });
  const chalk = new THREE.MeshStandardMaterial({
    color: 0xf4efe4, roughness: 0.86, metalness: 0.04,
  });

  const marks = new THREE.Group();
  for (let x = 0; x <= 22; x += 2) {
    const tick = new THREE.Mesh(new RoundedBoxGeometry(0.08, 0.06, 1.4, 1, 0.02), chalk);
    tick.position.set(x, 0.04, 0.9);
    marks.add(tick);
    if (x > 0) {
      const post = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.42, 0.12, 1, 0.02), woodMat);
      post.position.set(x, 0.22, 1.55);
      post.castShadow = true;
      marks.add(post);
    }
  }
  scene.add(marks);

  const tower = new THREE.Group();
  scene.add(tower);
  const deck = new THREE.Mesh(new RoundedBoxGeometry(1.8, 0.16, 1.5, 3, 0.04), woodMat);
  deck.castShadow = true;
  deck.receiveShadow = true;
  tower.add(deck);
  for (const [sx, sz] of [[-0.7, -0.55], [0.7, -0.55], [-0.7, 0.55], [0.7, 0.55]]) {
    const leg = new THREE.Mesh(new RoundedBoxGeometry(0.16, 1, 0.16, 2, 0.03), woodMat);
    leg.position.set(sx, 0, sz);
    leg.castShadow = true;
    tower.add(leg);
  }
  const rail = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.08, 1.4, 2, 0.02), darkMetal);
  rail.position.y = 0.12;
  tower.add(rail);

  const cannon = new THREE.Group();
  tower.add(cannon);
  const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.28, 24), darkMetal);
  mount.position.y = 0.28;
  mount.castShadow = true;
  cannon.add(mount);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 1.35, 24), metalMat);
  barrel.rotation.z = -Math.PI / 2;
  barrel.position.set(0.55, 0.42, 0);
  barrel.castShadow = true;
  cannon.add(barrel);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.035, 10, 24), brass);
  rim.rotation.y = Math.PI / 2;
  rim.position.set(1.22, 0.42, 0);
  cannon.add(rim);
  const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 22);
  for (const z of [-0.38, 0.38]) {
    const wheel = new THREE.Mesh(wheelGeo, woodMat);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(0.05, 0.28, z);
    wheel.castShadow = true;
    cannon.add(wheel);
  }

  const dropTower = new THREE.Group();
  dropTower.position.set(-0.7, 0, -0.35);
  scene.add(dropTower);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 1, 16), metalMat);
  pole.castShadow = true;
  dropTower.add(pole);
  const cage = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.12, 0.42, 2, 0.03), brass);
  cage.castShadow = true;
  dropTower.add(cage);

  const hoopGroup = new THREE.Group();
  scene.add(hoopGroup);
  const hoop = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.05, 12, 36),
    new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.28, metalness: 0.72 }),
  );
  hoop.rotation.y = Math.PI / 2;
  hoop.castShadow = true;
  hoopGroup.add(hoop);
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1, 12), darkMetal);
  stand.castShadow = true;
  hoopGroup.add(stand);

  const redMat = new THREE.MeshPhysicalMaterial({
    color: 0xff5d8f,
    roughness: 0.18,
    metalness: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.2,
  });
  const yellowMat = new THREE.MeshPhysicalMaterial({
    color: 0xffd166,
    roughness: 0.22,
    metalness: 0.2,
    clearcoat: 0.8,
    envMapIntensity: 1.1,
  });
  const projectile = new THREE.Mesh(new THREE.SphereGeometry(BALL_R, 40, 28), redMat);
  projectile.castShadow = true;
  scene.add(projectile);
  const dropBall = new THREE.Mesh(new THREE.SphereGeometry(BALL_R * 0.92, 32, 24), yellowMat);
  dropBall.castShadow = true;
  scene.add(dropBall);

  const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, 0x4cc9f0, 0.18, 0.12);
  const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1, 0xff9f1c, 0.18, 0.12);
  scene.add(arrowX, arrowY);

  const trailMax = 240;
  const trailPos = new Float32Array(trailMax * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  trailGeo.setDrawRange(0, 0);
  const trail = new THREE.Line(
    trailGeo,
    new THREE.LineBasicMaterial({ color: 0xff5d8f, transparent: true, opacity: 0.72 }),
  );
  scene.add(trail);
  let trailCount = 0;
  let lastTrailKey = '';

  const target = new THREE.Vector3(7.2, 3.4, 0);
  let yaw = 0.62;
  let pitch = 0.28;
  let radius = 16.5;
  const orbit = { dragging: false, px: 0, py: 0, pointerId: null };
  let lastW = 0;
  let lastH = 0;

  function placeCamera() {
    const cp = Math.cos(pitch);
    camera.position.set(
      target.x + Math.sin(yaw) * cp * radius,
      target.y + Math.sin(pitch) * radius,
      target.z + Math.cos(yaw) * cp * radius,
    );
    camera.lookAt(target);
  }

  function resize() {
    const w = innerWidth;
    const h = innerHeight;
    if (w === lastW && h === lastH) return;
    lastW = w;
    lastH = h;
    renderer.setSize(w, h);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', (event) => {
    reduced = event.matches;
  });

  function pushTrail(x, y) {
    if (trailCount >= trailMax) {
      trailPos.copyWithin(0, 3);
      trailCount = trailMax - 1;
    }
    const i = trailCount * 3;
    trailPos[i] = x;
    trailPos[i + 1] = y;
    trailPos[i + 2] = 0;
    trailCount += 1;
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.setDrawRange(0, trailCount);
  }

  function setLab(lab) {
    if (!lab) return;
    const H = lab.height;
    tower.position.set(0, H / 2, 0);
    deck.position.y = H / 2;
    tower.children.forEach((child) => {
      if (child === deck || child === rail || child === cannon) return;
      child.scale.set(1, H, 1);
      child.position.y = 0;
    });
    rail.position.y = H / 2 + 0.12;
    cannon.position.y = H / 2;
    cannon.rotation.z = (lab.angleDeg * Math.PI) / 180;

    dropTower.position.set(-0.75, 0, -0.4);
    pole.scale.set(1, H, 1);
    pole.position.y = H / 2;
    cage.position.y = H;

    hoopGroup.position.set(lab.target.x, 0, 0);
    hoop.position.y = lab.target.y;
    stand.scale.set(1, lab.target.y, 1);
    stand.position.y = lab.target.y / 2;

    const px = lab.flight ? lab.flight.x : 0.15;
    const py = lab.flight ? lab.flight.y : H;
    projectile.position.set(px, py + BALL_R, 0);
    const dropY = lab.drop ? lab.drop.y : H;
    const showDrop = Boolean(lab.drop) || !lab.flight;
    dropBall.visible = showDrop;
    dropBall.position.set(-0.75, dropY + BALL_R * 0.92, -0.4);

    const vx = lab.flight?.vx ?? lab.speed * Math.cos((lab.angleDeg * Math.PI) / 180);
    const vy = lab.flight?.vy ?? lab.speed * Math.sin((lab.angleDeg * Math.PI) / 180);
    arrowX.position.set(px, py + BALL_R, 0);
    arrowY.position.set(px, py + BALL_R, 0);
    arrowX.setLength(Math.max(0.35, Math.abs(vx) * 0.18), 0.18, 0.12);
    arrowY.setLength(Math.max(0.35, Math.abs(vy) * 0.18), 0.18, 0.12);
    arrowY.setDirection(new THREE.Vector3(0, vy >= 0 ? 1 : -1, 0));
    arrowX.visible = Boolean(lab.flight);
    arrowY.visible = Boolean(lab.flight);

    const key = lab.flight ? `${lab.flight.t.toFixed(3)}` : 'idle';
    if (!lab.flight) {
      trailCount = 0;
      trailGeo.setDrawRange(0, 0);
      lastTrailKey = 'idle';
    } else if (key !== lastTrailKey) {
      lastTrailKey = key;
      pushTrail(px, py + BALL_R);
    }
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
    pitch = Math.min(1.05, Math.max(0.08, pitch + dy * 0.004));
  });
  const stopDrag = (event) => {
    if (orbit.pointerId === event.pointerId) orbit.dragging = false;
  };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    radius = Math.min(28, Math.max(8, radius + event.deltaY * 0.01));
  }, { passive: false });

  addEventListener('resize', resize);
  applyThemeBg();
  resize();
  placeCamera();

  let raf = 0;
  function loop() {
    raf = requestAnimationFrame(loop);
    if (!reduced) projectile.rotation.z += 0.01;
    placeCamera();
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(loop);

  return {
    setLab,
    applyTheme: applyThemeBg,
    resize,
    dispose() {
      cancelAnimationFrame(raf);
      renderer.dispose();
    },
  };
}
