import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const TRACK_LEN = 6.2;
const TRACK_Y = 1.12;

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
    ctx.fillStyle = '#8a5a32';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 42; i += 1) {
      const y = (i / 42) * h;
      ctx.strokeStyle = `rgba(42, 22, 10, ${0.08 + (i % 4) * 0.04})`;
      ctx.lineWidth = 2 + (i % 3);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * 0.3, y + 12, w * 0.7, y - 10, w, y + 8);
      ctx.stroke();
    }
  });
}

function aluminumMap() {
  return canvasTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#eef2f6');
    g.addColorStop(0.45, '#b7c0cc');
    g.addColorStop(1, '#7d8694');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 28; i += 1) {
      ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.08)' : 'rgba(30,40,50,0.08)';
      ctx.fillRect(0, i * 18, w, 7);
    }
    ctx.fillStyle = 'rgba(20, 28, 36, 0.18)';
    for (let x = 24; x < w; x += 36) {
      for (let y = 18; y < h; y += 28) ctx.fillRect(x, y, 5, 5);
    }
  }, 1024, 256);
}

function scaleMap() {
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#dfe6ee';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1d2730';
    for (let i = 0; i <= 12; i += 1) {
      const x = 16 + (i / 12) * (w - 32);
      ctx.fillRect(x, 8, i % 5 === 0 ? 4 : 2, i % 5 === 0 ? h - 16 : h * 0.45);
    }
  }, 1024, 64);
}

export function createMotionScene(canvas) {
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
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xf3f7ff, 0x3b2a18, 0.95));
  const key = new THREE.DirectionalLight(0xfff4e4, 2.35);
  key.position.set(-4, 9, 6);
  key.castShadow = !reduced;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 4;
  key.shadow.bias = -0.00035;
  key.shadow.camera.left = -8;
  key.shadow.camera.right = 8;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -6;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9eb7ff, 0.45);
  fill.position.set(6, 3, -4);
  scene.add(fill);

  const wood = woodMap();
  const alum = aluminumMap();
  alum.wrapS = THREE.RepeatWrapping;
  alum.repeat.set(2, 1);
  const woodMat = new THREE.MeshStandardMaterial({ map: wood, roughness: 0.64, metalness: 0.04 });
  const alumMat = new THREE.MeshPhysicalMaterial({
    map: alum, color: 0xd5dde6, metalness: 0.82, roughness: 0.28, clearcoat: 0.35, envMapIntensity: 1.15,
  });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x2a3038, metalness: 0.72, roughness: 0.32 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x1a1c20, roughness: 0.7, metalness: 0.12 });
  const orange = new THREE.MeshPhysicalMaterial({
    color: 0xff7a3c, roughness: 0.32, metalness: 0.18, clearcoat: 0.4, envMapIntensity: 1.1,
  });
  const flagMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.45, metalness: 0.2 });
  const teal = new THREE.MeshStandardMaterial({
    color: 0x14b8a6, emissive: 0x0d9488, emissiveIntensity: 0.4, roughness: 0.28, metalness: 0.2,
  });

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(10, 64),
    new THREE.MeshStandardMaterial({ color: 0xcbb896, roughness: 0.86, metalness: 0.04 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const table = new THREE.Mesh(new RoundedBoxGeometry(9.2, 0.28, 3.6, 2, 0.04), woodMat);
  table.position.y = 0.42;
  table.castShadow = true;
  table.receiveShadow = true;
  scene.add(table);
  [[-3.6, -1.3], [3.6, -1.3], [-3.6, 1.3], [3.6, 1.3]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.84, 0.22, 1, 0.03), woodMat);
    leg.position.set(x, 0.0, z);
    leg.castShadow = true;
    scene.add(leg);
  });

  const leftStand = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 0.7, 16), darkMetal);
  leftStand.position.set(-TRACK_LEN / 2, 0.78, 0);
  leftStand.castShadow = true;
  scene.add(leftStand);
  const rightStand = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 0.7, 16), darkMetal);
  rightStand.position.set(TRACK_LEN / 2, 0.78, 0);
  rightStand.castShadow = true;
  scene.add(rightStand);

  const beam = new THREE.Group();
  beam.position.set(-TRACK_LEN / 2, TRACK_Y, 0);
  scene.add(beam);

  const rail = new THREE.Mesh(new RoundedBoxGeometry(TRACK_LEN, 0.16, 0.58, 2, 0.03), alumMat);
  rail.position.set(TRACK_LEN / 2, 0, 0);
  rail.castShadow = true;
  rail.receiveShadow = true;
  beam.add(rail);
  const slot = new THREE.Mesh(new RoundedBoxGeometry(TRACK_LEN - 0.2, 0.05, 0.16, 1, 0.02), darkMetal);
  slot.position.set(TRACK_LEN / 2, 0.07, 0);
  beam.add(slot);
  const ruler = new THREE.Mesh(
    new THREE.BoxGeometry(TRACK_LEN - 0.3, 0.012, 0.12),
    new THREE.MeshStandardMaterial({ map: scaleMap(), roughness: 0.45, metalness: 0.15 }),
  );
  ruler.position.set(TRACK_LEN / 2, 0.09, 0.22);
  beam.add(ruler);

  const stop = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.28, 0.5, 1, 0.03), rubber);
  stop.position.set(TRACK_LEN - 0.08, 0.16, 0);
  beam.add(stop);
  const startCap = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.22, 0.5, 1, 0.03), darkMetal);
  startCap.position.set(0.06, 0.14, 0);
  beam.add(startCap);

  const gate = new THREE.Group();
  gate.position.set(1.15, 0.28, 0);
  [[0.28, 0.32], [-0.28, -0.32]].forEach(([z, armZ]) => {
    const post = new THREE.Mesh(new RoundedBoxGeometry(0.06, 0.42, 0.06, 1, 0.01), darkMetal);
    post.position.set(0, 0.08, z);
    gate.add(post);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), teal);
    eye.position.set(0, 0.22, armZ * 0.55);
    gate.add(eye);
  });
  beam.add(gate);

  const cart = new THREE.Group();
  cart.position.set(0.45, 0.2, 0);
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.86, 0.28, 0.46, 3, 0.05), orange);
  body.position.y = 0.08;
  body.castShadow = true;
  const cabin = new THREE.Mesh(
    new RoundedBoxGeometry(0.22, 0.14, 0.32, 2, 0.03),
    new THREE.MeshPhysicalMaterial({ color: 0xf4fbff, roughness: 0.18, metalness: 0.08, transparent: true, opacity: 0.78 }),
  );
  cabin.position.set(0.16, 0.24, 0);
  const bumper = new THREE.Mesh(new RoundedBoxGeometry(0.08, 0.16, 0.42, 1, 0.02), rubber);
  bumper.position.set(0.44, 0.08, 0);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.28, 0.16), flagMat);
  flag.position.set(-0.12, 0.32, 0);
  const wheelGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 18);
  wheelGeo.rotateZ(Math.PI / 2);
  [[-0.26, -0.02, 0.24], [0.26, -0.02, 0.24], [-0.26, -0.02, -0.24], [0.26, -0.02, -0.24]].forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, rubber);
    wheel.position.set(x, y, z);
    wheel.castShadow = true;
    cart.add(wheel);
  });
  cart.add(body, cabin, bumper, flag);
  beam.add(cart);

  const marks = [];
  const markGeo = new THREE.SphereGeometry(0.055, 14, 14);

  let angleDeg = 0;
  let along = 0.1;
  let yaw = 0.42;
  let pitch = 0.38;
  let radius = 8.4;
  const look = new THREE.Vector3(0.2, 1.15, 0);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const views = {
    stage: { yaw: 0.42, pitch: 0.38, radius: 8.4 },
    side: { yaw: 0.02, pitch: 0.18, radius: 8.8 },
    top: { yaw: 0.08, pitch: 1.22, radius: 9.2 },
  };

  function cssVar(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function applyTheme() {
    const dark = document.documentElement.dataset.theme === 'dark';
    scene.background = new THREE.Color(dark ? 0x152428 : 0xd5ebe6);
    renderer.toneMappingExposure = dark ? 0.92 : 1.08;
    floor.material.color.set(dark ? 0x3d3428 : 0xcbb896);
  }

  function localX(s) {
    return 0.28 + THREE.MathUtils.clamp(s / 1.2, 0, 1) * (TRACK_LEN - 0.7);
  }

  function updateStands(angleRad) {
    const lift = Math.sin(angleRad) * TRACK_LEN;
    const leftH = 0.7 + lift;
    leftStand.scale.y = leftH / 0.7;
    leftStand.position.set(-TRACK_LEN / 2, 0.42 + leftH / 2, 0);
    rightStand.scale.y = 1;
    rightStand.position.set(TRACK_LEN / 2, 0.78, 0);
  }

  function update({ angle, s, markList }) {
    angleDeg = angle;
    along = s;
    const angleRad = THREE.MathUtils.degToRad(angleDeg);
    const lift = Math.sin(angleRad) * TRACK_LEN;
    beam.rotation.z = -angleRad;
    beam.position.set(-TRACK_LEN / 2, TRACK_Y + lift, 0);
    look.y = 1.15 + lift * 0.45;
    updateStands(angleRad);
    cart.position.set(localX(along), 0.2, 0);
    while (marks.length < markList.length) {
      const mesh = new THREE.Mesh(markGeo, teal);
      beam.add(mesh);
      marks.push(mesh);
    }
    marks.forEach((mesh, i) => {
      const mark = markList[i];
      mesh.visible = Boolean(mark);
      if (mark) mesh.position.set(localX(mark.s), 0.22, 0.18);
    });
  }

  function setView(name) {
    const view = views[name] || views.stage;
    yaw = view.yaw;
    pitch = view.pitch;
    radius = view.radius;
  }

  function orbit(dx, dy) {
    yaw -= dx * 0.008;
    pitch = THREE.MathUtils.clamp(pitch + dy * 0.005, 0.12, 1.28);
  }

  function zoom(factor) {
    radius = THREE.MathUtils.clamp(radius * factor, 5.5, 14);
  }

  function pick(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(cart, true);
    return { hit: hits.length > 0 ? 'cart' : 'empty', s: along };
  }

  function placeCamera() {
    camera.position.set(
      Math.sin(yaw) * Math.cos(pitch) * radius,
      Math.sin(pitch) * radius + 0.4,
      Math.cos(yaw) * Math.cos(pitch) * radius,
    );
    camera.lookAt(look);
  }

  const cartScreen = { x: 80, y: 140, r: 42 };
  function projectCart() {
    const vector = cart.getWorldPosition(new THREE.Vector3()).project(camera);
    cartScreen.x = (vector.x * 0.5 + 0.5) * canvas.clientWidth;
    cartScreen.y = (-vector.y * 0.5 + 0.5) * canvas.clientHeight;
    cartScreen.r = Math.max(36, canvas.clientWidth * 0.05);
    return cartScreen;
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

  renderer.setAnimationLoop(() => {
    if (document.hidden || canvas.clientWidth === 0) return;
    placeCamera();
    renderer.render(scene, camera);
    projectCart();
  });

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  addEventListener('resize', resize);
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    zoom(Math.exp(THREE.MathUtils.clamp(event.deltaY, -100, 100) * 0.002));
  }, { passive: false });
  applyTheme();
  resize();
  addEventListener('themechange', applyTheme);

  return { update, orbit, zoom, setView, pick, applyTheme, projectCart, cartScreen };
}
