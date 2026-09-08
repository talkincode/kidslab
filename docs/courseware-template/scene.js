import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const BALL_R = 0.09;
const CHAMBER_W = 1.12;
const CHAMBER_D = 1.12;
const CHAMBER_H = 2.22;

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
    ctx.fillStyle = 'rgba(255, 210, 140, 0.05)';
    ctx.fillRect(0, 0, w, h);
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

function tickMap() {
  return canvasTexture((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(18, 22, 32, 0.55)';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#f4d36a';
    ctx.fillStyle = '#f4d36a';
    ctx.lineWidth = 4;
    for (let i = 0; i <= 20; i += 1) {
      const y = 24 + (i / 20) * (h - 48);
      const long = i % 5 === 0;
      ctx.beginPath();
      ctx.moveTo(long ? 18 : 48, y);
      ctx.lineTo(w - 16, y);
      ctx.stroke();
      if (long) {
        ctx.font = 'bold 42px ui-rounded, sans-serif';
        ctx.fillText(String((20 - i) / 10), 20, y - 8);
      }
    }
  }, 256, 1024);
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
  const rim = new THREE.PointLight(0xffc978, 1.4, 8, 1.6);
  rim.position.set(0.2, 2.4, 1.6);
  scene.add(rim);

  const wood = woodMap();
  wood.repeat.set(2, 1);
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
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xd7ecff,
    roughness: 0.06,
    metalness: 0,
    transmission: 0.86,
    thickness: 0.08,
    transparent: true,
    opacity: 0.28,
    ior: 1.5,
    envMapIntensity: 1.3,
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
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.04, 20), darkMetal);
      foot.position.set(x, -0.7, z);
      scene.add(foot);
    }
  }

  const apron = new THREE.Mesh(new RoundedBoxGeometry(3.48, 0.07, 2.04, 2, 0.02), darkMetal);
  apron.position.y = 0.015;
  scene.add(apron);

  const chamber = new THREE.Group();
  chamber.position.set(0, 0.16, 0);
  scene.add(chamber);

  const base = new THREE.Mesh(new RoundedBoxGeometry(CHAMBER_W + 0.22, 0.08, CHAMBER_D + 0.22, 3, 0.03), metalMat);
  base.position.y = 0.04;
  base.castShadow = true;
  base.receiveShadow = true;
  chamber.add(base);

  const posts = [
    [-1, -1], [1, -1], [-1, 1], [1, 1],
  ];
  for (const [sx, sz] of posts) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, CHAMBER_H, 16), metalMat);
    post.position.set(sx * CHAMBER_W / 2, CHAMBER_H / 2 + 0.08, sz * CHAMBER_D / 2);
    post.castShadow = true;
    chamber.add(post);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), brass);
    cap.position.copy(post.position);
    cap.position.y += CHAMBER_H / 2;
    chamber.add(cap);
  }

  const lid = new THREE.Mesh(new RoundedBoxGeometry(CHAMBER_W + 0.18, 0.05, CHAMBER_D + 0.18, 2, 0.02), metalMat);
  lid.position.y = CHAMBER_H + 0.1;
  chamber.add(lid);

  const led = new THREE.Mesh(
    new THREE.BoxGeometry(CHAMBER_W * 0.72, 0.02, 0.06),
    new THREE.MeshStandardMaterial({ color: 0xffd36a, emissive: 0xffb347, emissiveIntensity: 1.8 }),
  );
  led.position.set(0, CHAMBER_H + 0.07, CHAMBER_D * 0.42);
  chamber.add(led);

  const paneGeo = new THREE.PlaneGeometry(CHAMBER_W - 0.08, CHAMBER_H - 0.08);
  const panes = [
    { pos: [0, CHAMBER_H / 2 + 0.08, CHAMBER_D / 2], rot: [0, 0, 0] },
    { pos: [0, CHAMBER_H / 2 + 0.08, -CHAMBER_D / 2], rot: [0, Math.PI, 0] },
    { pos: [CHAMBER_W / 2, CHAMBER_H / 2 + 0.08, 0], rot: [0, Math.PI / 2, 0] },
    { pos: [-CHAMBER_W / 2, CHAMBER_H / 2 + 0.08, 0], rot: [0, -Math.PI / 2, 0] },
  ];
  for (const pane of panes) {
    const mesh = new THREE.Mesh(paneGeo, glass);
    mesh.position.set(...pane.pos);
    mesh.rotation.set(...pane.rot);
    chamber.add(mesh);
  }

  const ruler = new THREE.Mesh(
    new THREE.PlaneGeometry(0.18, CHAMBER_H - 0.2),
    new THREE.MeshBasicMaterial({ map: tickMap(), transparent: true, toneMapped: false }),
  );
  ruler.position.set(-CHAMBER_W / 2 + 0.04, CHAMBER_H / 2 + 0.08, 0.01);
  chamber.add(ruler);

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.03, 32), darkMetal);
  pad.position.y = 0.095;
  chamber.add(pad);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.12, 0.2, 40),
    new THREE.MeshBasicMaterial({ color: 0xffd36a, transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.12;
  chamber.add(ring);

  const ballMat = new THREE.MeshPhysicalMaterial({
    color: 0xff5d8f,
    roughness: 0.18,
    metalness: 0.35,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    iridescence: 0.35,
    iridescenceIOR: 1.4,
    envMapIntensity: 1.25,
  });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(BALL_R, 48, 32), ballMat);
  ball.castShadow = true;
  ball.position.y = BALL_R + 1.2;
  chamber.add(ball);

  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(BALL_R * 0.34, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28 }),
  );
  highlight.position.set(-0.025, 0.03, 0.04);
  ball.add(highlight);

  const moteGeo = new THREE.BufferGeometry();
  const moteCount = 80;
  const motePos = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i += 1) {
    motePos[i * 3] = (Math.random() - 0.5) * CHAMBER_W * 0.7;
    motePos[i * 3 + 1] = 0.2 + Math.random() * CHAMBER_H * 0.9;
    motePos[i * 3 + 2] = (Math.random() - 0.5) * CHAMBER_D * 0.7;
  }
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(
    moteGeo,
    new THREE.PointsMaterial({ color: 0xffe7a8, size: 0.018, transparent: true, opacity: 0.35 }),
  );
  chamber.add(motes);

  const target = new THREE.Vector3(0, 1.05, 0);
  let yaw = 0.46;
  let pitch = 0.42;
  let radius = 4.15;
  const orbit = { dragging: false, px: 0, py: 0, pointerId: null };

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
    renderer.setSize(w, h);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  let spark = 0;
  let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', (event) => {
    reduced = event.matches;
  });

  function setSim(sim) {
    if (!sim) return;
    ball.position.y = BALL_R + sim.y;
    const speed = Math.abs(sim.v);
    ball.rotation.z = sim.t * 0.4;
    const heat = Math.min(1, speed / 6);
    ballMat.emissive.setHSL(0.95 - sim.restitution * 0.15, 0.7, 0.12 + heat * 0.12);
    ballMat.color.setHSL(0.95 - sim.restitution * 0.18, 0.72, 0.55);
    led.material.emissiveIntensity = 1.2 + heat * 1.4;
    if (spark > 0) {
      spark *= reduced ? 0 : 0.86;
      ring.material.opacity = spark;
      ring.scale.setScalar(1 + (1 - spark) * 1.8);
    }
  }

  function flash() {
    spark = 1;
    ring.scale.setScalar(1);
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
    radius = Math.min(6.4, Math.max(2.6, radius + event.deltaY * 0.004));
  }, { passive: false });

  addEventListener('resize', resize);
  applyThemeBg();
  resize();
  placeCamera();

  let raf = 0;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (!reduced) {
      motes.rotation.y = now * 0.00007;
      const pos = motes.geometry.attributes.position;
      for (let i = 0; i < moteCount; i += 1) {
        pos.array[i * 3 + 1] += Math.sin(now * 0.001 + i) * 0.00025;
      }
      pos.needsUpdate = true;
    }
    placeCamera();
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(loop);

  return {
    setSim,
    flash,
    applyTheme: applyThemeBg,
    resize,
    dispose() {
      cancelAnimationFrame(raf);
      renderer.dispose();
    },
  };
}
