import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

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
  renderer.toneMappingExposure = 1.06;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.06).texture;
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xe8f6ff, 0x3a2a18, 1.2));
  const key = new THREE.DirectionalLight(0xfff3d6, 2.5);
  key.position.set(-3, 7, 5);
  key.castShadow = !reduced;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);

  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({
    color, roughness: 0.38, metalness: 0.18, envMapIntensity: 1.1, ...extra,
  });

  const floor = new THREE.Mesh(new THREE.CircleGeometry(8, 48), std(0xc9b48a, { roughness: 0.72, metalness: 0.04 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.02;
  floor.receiveShadow = true;
  scene.add(floor);

  const track = new THREE.Mesh(
    new RoundedBoxGeometry(6.4, 0.12, 0.62, 2, 0.04),
    std(0xffd166, { roughness: 0.32, metalness: 0.12 }),
  );
  track.castShadow = true;
  scene.add(track);

  const rail = new THREE.Mesh(new RoundedBoxGeometry(6.4, 0.08, 0.18, 2, 0.03), std(0x2a2418, { metalness: 0.4 }));
  rail.position.y = 0.08;
  track.add(rail);

  const cart = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.34, 0.5, 3, 0.06), std(0xff7a3c, { roughness: 0.28, metalness: 0.22 }));
  body.position.y = 0.28;
  body.castShadow = true;
  const cabin = new THREE.Mesh(new RoundedBoxGeometry(0.28, 0.18, 0.36, 2, 0.04), std(0xf8fbff, { roughness: 0.2 }));
  cabin.position.set(0.18, 0.46, 0);
  const wheelGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  [[-0.28, 0.11, 0.24], [0.28, 0.11, 0.24], [-0.28, 0.11, -0.24], [0.28, 0.11, -0.24]].forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, std(0x2a2418, { metalness: 0.55, roughness: 0.3 }));
    wheel.position.set(x, y, z);
    cart.add(wheel);
  });
  cart.add(body, cabin);
  track.add(cart);

  const marks = [];
  const markGeo = new THREE.SphereGeometry(0.07, 12, 12);
  const markMat = new THREE.MeshStandardMaterial({ color: 0x14b8a6, emissive: 0x0d9488, emissiveIntensity: 0.45, roughness: 0.3 });

  let angleDeg = 0;
  let along = 0;
  let running = true;
  const cartScreen = { x: 80, y: 140, r: 42 };

  function applyTheme() {
    const dark = document.documentElement.dataset.theme === 'dark';
    scene.background = new THREE.Color(dark ? 0x1a2a28 : 0xd9ece8);
    renderer.toneMappingExposure = dark ? 0.9 : 1.06;
  }

  function localX(s) {
    return -3.1 + THREE.MathUtils.clamp(s / 1.2, 0, 1) * 6.2;
  }

  function update({ angle, s, markList }) {
    angleDeg = angle;
    along = s;
    const angleRad = THREE.MathUtils.degToRad(angleDeg);
    track.rotation.z = angleRad;
    track.position.set(0, 0.08 + Math.sin(angleRad) * 0.15, 0);
    cart.position.set(localX(along), 0.16, 0);
    while (marks.length < markList.length) {
      const mesh = new THREE.Mesh(markGeo, markMat);
      track.add(mesh);
      marks.push(mesh);
    }
    marks.forEach((mesh, i) => {
      const mark = markList[i];
      mesh.visible = Boolean(mark);
      if (mark) mesh.position.set(localX(mark.s), 0.34, 0);
    });
  }

  function projectCart() {
    const vector = cart.getWorldPosition(new THREE.Vector3()).project(camera);
    cartScreen.x = (vector.x * 0.5 + 0.5) * canvas.clientWidth;
    cartScreen.y = (-vector.y * 0.5 + 0.5) * canvas.clientHeight;
    cartScreen.r = Math.max(36, canvas.clientWidth * 0.055);
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
    if (!running || document.hidden || canvas.clientWidth === 0) return;
    const angleRad = THREE.MathUtils.degToRad(angleDeg);
    camera.position.set(-2.8, 2.4 + Math.sin(angleRad) * 1.4, 6.3);
    camera.lookAt(0.2, 0.6 + Math.sin(angleRad) * 1.1, 0);
    renderer.render(scene, camera);
    projectCart();
  });

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  addEventListener('resize', resize);
  applyTheme();
  resize();
  addEventListener('themechange', applyTheme);
  return { update, projectCart, applyTheme, cartScreen };
}
