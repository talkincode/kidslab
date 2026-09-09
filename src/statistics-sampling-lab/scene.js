import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const DISTRICT_LAYOUT = {
  downtown: { ox: 3.15, oz: 3.15, wall: 0x6ec9d6, roof: 0xd7f4fb, accent: 0xffd166 },
  riverside: { ox: -3.15, oz: 3.15, wall: 0x4d8fd8, roof: 0x8ec5ff, accent: 0x7ad7f0 },
  factory: { ox: -3.15, oz: -3.15, wall: 0xb85a32, roof: 0x6d3b28, accent: 0xc9a24a },
  hill: { ox: 3.15, oz: -3.15, wall: 0x5c8a4a, roof: 0x8fbf6a, accent: 0xf4d36a },
};

const DISTRICT_ORDER = ['downtown', 'riverside', 'factory', 'hill'];
const VISUAL_PER_DISTRICT = 16;

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
    for (let i = 0; i < 1600; i += 1) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.strokeStyle = i % 5 === 0 ? '#2d6a34' : '#62b05e';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 6, y - 7 - Math.random() * 10);
      ctx.stroke();
    }
  }, 1024, 1024);
}

function asphaltMap() {
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#3a3f4c';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i += 1) {
      ctx.fillStyle = `rgba(255,255,255,${0.015 + (i % 4) * 0.01})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 3, 2);
    }
    ctx.strokeStyle = '#f4d36a';
    ctx.setLineDash([18, 16]);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
  });
}

function brickMap() {
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#8a3d28';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#d9c4b0';
    ctx.lineWidth = 3;
    const bh = 28;
    const bw = 56;
    for (let row = 0; row < h / bh; row += 1) {
      const offset = row % 2 ? bw / 2 : 0;
      for (let col = -1; col < w / bw + 1; col += 1) {
        ctx.strokeRect(col * bw + offset, row * bh, bw - 2, bh - 2);
      }
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
  const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.12, 80);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.28 });
  const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), shadowMat);
  shadowFloor.rotation.x = -Math.PI / 2;
  shadowFloor.position.y = 0.002;
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

  scene.add(new THREE.HemisphereLight(0xfff4e5, 0x2a2438, 0.78));
  const key = new THREE.DirectionalLight(0xfff7ea, 2.2);
  key.position.set(7.2, 12.4, 6.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 4;
  key.shadow.bias = -0.0003;
  key.shadow.camera.left = -11;
  key.shadow.camera.right = 11;
  key.shadow.camera.top = 11;
  key.shadow.camera.bottom = -11;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9db7ff, 0.45);
  fill.position.set(-8, 4, -5);
  scene.add(fill);

  const grass = grassMap();
  grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
  grass.repeat.set(6, 6);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ map: grass, roughness: 0.95, metalness: 0.02 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const asphalt = asphaltMap();
  const roadMat = new THREE.MeshStandardMaterial({ map: asphalt, roughness: 0.88, metalness: 0.08 });
  const roadX = new THREE.Mesh(new THREE.BoxGeometry(20, 0.04, 1.45), roadMat);
  roadX.position.y = 0.02;
  roadX.receiveShadow = true;
  scene.add(roadX);
  const roadZ = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.04, 20), roadMat);
  roadZ.position.y = 0.021;
  roadZ.receiveShadow = true;
  scene.add(roadZ);

  const brick = brickMap();
  const people = [];
  const lcdState = { mean: null, census: null, method: 'simple' };

  const lcdCanvas = Object.assign(document.createElement('canvas'), { width: 512, height: 256 });
  const lcdTex = new THREE.CanvasTexture(lcdCanvas);
  lcdTex.colorSpace = THREE.SRGBColorSpace;

  function paintLcd() {
    const ctx = lcdCanvas.getContext('2d');
    ctx.fillStyle = '#0d1b16';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#143028';
    ctx.fillRect(18, 18, 476, 220);
    ctx.fillStyle = '#7dffb3';
    ctx.font = 'bold 36px ui-rounded, sans-serif';
    ctx.fillText('SAMPLE MEAN', 36, 78);
    ctx.font = 'bold 92px ui-monospaced, ui-rounded, sans-serif';
    ctx.fillText(lcdState.mean == null ? '----' : `${lcdState.mean.toFixed(1)}`, 36, 168);
    ctx.font = 'bold 32px ui-rounded, sans-serif';
    ctx.fillText('min', 320, 168);
    ctx.font = 'bold 28px ui-rounded, sans-serif';
    ctx.fillStyle = '#9be7c2';
    const census = lcdState.census == null ? 'CENSUS --' : `CENSUS ${lcdState.census.toFixed(1)}`;
    ctx.fillText(census, 36, 214);
    lcdTex.needsUpdate = true;
  }
  paintLcd();

  const kiosk = new THREE.Group();
  scene.add(kiosk);
  const kioskBody = new THREE.Mesh(
    new RoundedBoxGeometry(1.35, 1.7, 0.42, 2, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x2a3142, roughness: 0.38, metalness: 0.55 }),
  );
  kioskBody.position.y = 0.85;
  kioskBody.castShadow = true;
  kiosk.add(kioskBody);
  const lcd = new THREE.Mesh(
    new THREE.PlaneGeometry(1.12, 0.56),
    new THREE.MeshBasicMaterial({ map: lcdTex, toneMapped: false }),
  );
  lcd.position.set(0, 1.18, 0.22);
  kiosk.add(lcd);
  const bezel = new THREE.Mesh(
    new RoundedBoxGeometry(1.2, 0.64, 0.06, 2, 0.02),
    new THREE.MeshStandardMaterial({ color: 0xc9a24a, roughness: 0.3, metalness: 0.8 }),
  );
  bezel.position.set(0, 1.18, 0.18);
  kiosk.add(bezel);

  function addBuilding(group, x, z, w, d, h, wallColor, roofColor, brickWall = false) {
    const wall = new THREE.Mesh(
      new RoundedBoxGeometry(w, h, d, 2, 0.05),
      new THREE.MeshStandardMaterial({
        color: wallColor,
        map: brickWall ? brick : null,
        roughness: brickWall ? 0.82 : 0.42,
        metalness: brickWall ? 0.04 : 0.18,
      }),
    );
    wall.position.set(x, h / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);
    const roof = new THREE.Mesh(
      new RoundedBoxGeometry(w + 0.12, 0.1, d + 0.12, 2, 0.04),
      new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.35, metalness: 0.22 }),
    );
    roof.position.set(x, h + 0.04, z);
    roof.castShadow = true;
    group.add(roof);
  }

  function addPerson(district, visualIndex, x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.09, 0.22, 6, 10),
      new THREE.MeshStandardMaterial({ color: 0xf2d0b6, roughness: 0.55, metalness: 0.08 }),
    );
    body.position.y = 0.28;
    body.castShadow = true;
    group.add(body);
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 14, 12),
      new THREE.MeshStandardMaterial({ color: 0xffe0c2, roughness: 0.48, metalness: 0.05 }),
    );
    head.position.y = 0.5;
    head.castShadow = true;
    group.add(head);
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 10),
      new THREE.MeshStandardMaterial({
        color: 0xffd166,
        emissive: 0xffb347,
        emissiveIntensity: 0,
        roughness: 0.3,
        metalness: 0.2,
      }),
    );
    marker.position.y = 0.64;
    group.add(marker);
    scene.add(group);
    people.push({ district, visualIndex, group, body, marker, baseY: 0 });
  }

  DISTRICT_ORDER.forEach((id) => {
    const spec = DISTRICT_LAYOUT[id];
    const pad = new THREE.Mesh(
      new RoundedBoxGeometry(5.5, 0.06, 5.5, 2, 0.08),
      new THREE.MeshStandardMaterial({ color: spec.wall, roughness: 0.78, metalness: 0.04 }),
    );
    pad.position.set(spec.ox, 0.03, spec.oz);
    pad.receiveShadow = true;
    scene.add(pad);

    const heights = id === 'downtown' ? [1.6, 2.4, 1.9, 2.8] : id === 'factory' ? [1.1, 0.9, 1.35, 1.0] : [1.15, 1.35, 1.05, 1.45];
    const spots = [[-1.7, -1.55], [1.65, -1.5], [-1.6, 1.55], [1.62, 1.58]];
    spots.forEach(([dx, dz], index) => {
      addBuilding(
        scene,
        spec.ox + dx,
        spec.oz + dz,
        1.15 + (index % 2) * 0.2,
        1.05,
        heights[index],
        spec.wall,
        spec.roof,
        id === 'factory',
      );
    });

    let visual = 0;
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        addPerson(
          id,
          visual,
          spec.ox + (col - 1.5) * 0.42,
          spec.oz + (row - 1.5) * 0.42,
        );
        visual += 1;
      }
    }
  });

  const target = new THREE.Vector3(0, 1.15, 0);
  let yaw = 0.72;
  let pitch = 0.42;
  let radius = 13.2;
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

  function setLab(lab) {
    if (!lab) return;
    const sampled = new Set(lab.sample?.ids ?? []);
    lcdState.mean = lab.sample?.mean ?? null;
    lcdState.census = lab.census?.mean ?? null;
    lcdState.method = lab.method;
    paintLcd();
    for (const person of people) {
      const districtIndex = DISTRICT_ORDER.indexOf(person.district);
      let lit = false;
      if (sampled.size) {
        for (let i = person.visualIndex; i < 100; i += VISUAL_PER_DISTRICT) {
          if (sampled.has(districtIndex * 100 + i)) {
            lit = true;
            break;
          }
        }
      }
      person.marker.material.emissiveIntensity = lit ? 1.8 : 0;
      person.body.material.emissive = new THREE.Color(lit ? 0xffd166 : 0x000000);
      person.body.material.emissiveIntensity = lit ? 0.35 : 0;
      const lift = lit ? 0.18 : 0;
      person.group.position.y = reduced ? lift : person.group.position.y * 0.7 + lift * 0.3;
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
    pitch = Math.min(1.12, Math.max(0.16, pitch + dy * 0.004));
  });
  const stopDrag = (event) => {
    if (orbit.pointerId === event.pointerId) orbit.dragging = false;
  };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    radius = Math.min(18, Math.max(8, radius + event.deltaY * 0.004));
  }, { passive: false });

  addEventListener('resize', resize);
  applyThemeBg();
  resize();
  placeCamera();

  let raf = 0;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (!reduced) kiosk.position.y = Math.sin(now * 0.0016) * 0.02;
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
