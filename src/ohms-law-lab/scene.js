import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

function cssColor(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

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
      ctx.strokeStyle = `rgba(40, 18, 8, ${0.08 + (i % 4) * 0.04})`;
      ctx.lineWidth = 2 + (i % 3);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * 0.3, y + 12, w * 0.7, y - 10, w, y + 8);
      ctx.stroke();
    }
  });
}

function metalMap() {
  return canvasTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#e8edf4');
    g.addColorStop(0.5, '#9aa3b2');
    g.addColorStop(1, '#5c6573');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 16; i += 1) {
      ctx.fillStyle = `rgba(255,255,255,${0.03 + (i % 2) * 0.03})`;
      ctx.fillRect(0, i * 32, w, 3);
    }
  });
}

function rubberMap() {
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#1c2428';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(90, 140, 130, 0.18)';
    ctx.lineWidth = 2;
    for (let x = 24; x < w; x += 48) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 24; y < h; y += 48) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  });
}

export function createCircuitScene(host) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: host.tagName === 'CANVAS' ? host : undefined,
      antialias: true,
    });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  if (host.tagName !== 'CANVAS') host.prepend(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', '3D circuit bench');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const textures = [];
  const hemi = new THREE.HemisphereLight(0xf3fff8, 0x3a4a46, 0.85);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff6e8, 2.4);
  key.position.set(-4.5, 9, 5.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -8;
  key.shadow.camera.right = 8;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  key.shadow.bias = -0.00025;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xcde8ff, 0.55);
  fill.position.set(6, 4, -3);
  scene.add(fill);
  const lamp = new THREE.PointLight(0xffd9a0, 1.1, 14, 2);
  lamp.position.set(0.2, 3.4, 1.2);
  scene.add(lamp);

  const wood = woodMap();
  const metal = metalMap();
  const rubber = rubberMap();
  textures.push(wood, metal, rubber);
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  wood.repeat.set(2, 1);
  rubber.wrapS = rubber.wrapT = THREE.RepeatWrapping;
  rubber.repeat.set(4, 3);

  function std(params) {
    const mat = new THREE.MeshStandardMaterial(params);
    mat.envMapIntensity = params.envMapIntensity ?? 1.05;
    return mat;
  }
  function physical(params) {
    const mat = new THREE.MeshPhysicalMaterial(params);
    mat.envMapIntensity = params.envMapIntensity ?? 1.2;
    return mat;
  }

  function add(mesh, x, y, z, parent = scene) {
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 18),
    std({ color: 0x6d7c78, roughness: 0.92, metalness: 0.04 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.05;
  floor.receiveShadow = true;
  scene.add(floor);

  const table = add(
    new THREE.Mesh(
      new RoundedBoxGeometry(11.6, 0.42, 7.2, 3, 0.08),
      std({ map: wood, roughness: 0.62, metalness: 0.08, color: 0xffffff }),
    ),
    0, -0.42, 0,
  );
  add(new THREE.Mesh(new RoundedBoxGeometry(0.28, 1.5, 0.28, 2, 0.04), std({ map: wood, roughness: 0.7 })), -5.1, -1.15, 3.1);
  add(new THREE.Mesh(new RoundedBoxGeometry(0.28, 1.5, 0.28, 2, 0.04), std({ map: wood, roughness: 0.7 })), 5.1, -1.15, 3.1);
  add(new THREE.Mesh(new RoundedBoxGeometry(0.28, 1.5, 0.28, 2, 0.04), std({ map: wood, roughness: 0.7 })), -5.1, -1.15, -3.1);
  add(new THREE.Mesh(new RoundedBoxGeometry(0.28, 1.5, 0.28, 2, 0.04), std({ map: wood, roughness: 0.7 })), 5.1, -1.15, -3.1);

  add(
    new THREE.Mesh(
      new RoundedBoxGeometry(10.4, 0.08, 6.1, 2, 0.04),
      std({ map: rubber, roughness: 0.95, metalness: 0.02, color: 0xffffff }),
    ),
    0, -0.17, 0,
  );

  const back = add(
    new THREE.Mesh(new RoundedBoxGeometry(12.4, 4.6, 0.18, 2, 0.03), std({ color: 0xd5e4df, roughness: 0.88 })),
    0, 1.4, -3.7,
  );
  back.castShadow = false;

  const lampArm = add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 12), physical({ color: 0xb7c0c8, metalness: 0.8, roughness: 0.28 })), -1.8, 1.4, 2.6);
  lampArm.rotation.z = 0.45;
  add(new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 16), physical({ color: 0xfff1c8, emissive: 0xffc56a, emissiveIntensity: 0.65, roughness: 0.35 })), 0.15, 2.55, 1.35);

  function jack(parent, x, z, color) {
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 20), physical({ color, metalness: 0.55, roughness: 0.32 })), x, 0.08, z, parent);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.08, 12), physical({ color: 0xd7dde4, metalness: 0.9, roughness: 0.18 })), x, 0.16, z, parent);
  }

  function lcdTexture() {
    return canvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#07221c';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#8ff3c2';
      ctx.font = 'bold 92px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('1.50 V', w / 2, h * 0.62);
    }, 512, 256);
  }

  const psuLcd = lcdTexture();
  textures.push(psuLcd);
  const psu = add(
    new THREE.Mesh(
      new RoundedBoxGeometry(2.35, 1.35, 1.7, 4, 0.08),
      physical({ map: metal, color: 0xcfd6de, metalness: 0.72, roughness: 0.28 }),
    ),
    -3.7, 0.52, 0.15,
  );
  add(new THREE.Mesh(new RoundedBoxGeometry(2.15, 0.08, 1.52, 2, 0.02), std({ color: 0x1b2730, roughness: 0.5 })), 0, 0.68, 0, psu);
  const lcd = add(new THREE.Mesh(new THREE.PlaneGeometry(1.55, 0.55), new THREE.MeshBasicMaterial({ map: psuLcd, toneMapped: false })), 0, 0.42, 0.86, psu);
  lcd.castShadow = false;
  const knob = add(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.16, 24), physical({ color: 0x1c242c, metalness: 0.4, roughness: 0.35 })), 0.62, 0.08, 0.82, psu);
  add(new THREE.Mesh(new RoundedBoxGeometry(0.04, 0.05, 0.16, 1, 0.01), std({ color: 0xf4e9cb })), 0, 0.1, 0.04, knob);
  const led = add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), std({ color: 0x5dce89, emissive: 0x5dce89, emissiveIntensity: 0.8 })), -0.72, 0.12, 0.84, psu);
  jack(psu, -0.42, -0.72, 0xc72f40);
  jack(psu, 0.42, -0.72, 0x111821);

  function meterFace(unit) {
    return canvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#efe7cf';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#24333f';
      ctx.lineWidth = 5;
      for (let n = 0; n <= 10; n += 1) {
        const angle = Math.PI + (n / 10) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(w / 2 + Math.cos(angle) * 210, h * 0.72 + Math.sin(angle) * 210);
        ctx.lineTo(w / 2 + Math.cos(angle) * (n % 5 === 0 ? 168 : 186), h * 0.72 + Math.sin(angle) * (n % 5 === 0 ? 168 : 186));
        ctx.stroke();
      }
      ctx.fillStyle = '#182b36';
      ctx.textAlign = 'center';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText(unit, w / 2, h * 0.42);
      ctx.font = '28px sans-serif';
      ctx.fillText('0', 86, h * 0.84);
      ctx.fillStyle = '#d34b25';
      ctx.beginPath();
      ctx.moveTo(w / 2, h * 0.72);
      ctx.lineTo(w / 2 + Math.cos(Math.PI * 1.15) * 170, h * 0.72 + Math.sin(Math.PI * 1.15) * 170);
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#d34b25';
      ctx.stroke();
      ctx.fillStyle = '#23323d';
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.72, 12, 0, Math.PI * 2);
      ctx.fill();
    }, 512, 384);
  }

  function analogMeter(x, z, unit, bodyColor) {
    const group = new THREE.Group();
    group.position.set(x, 0.42, z);
    scene.add(group);
    add(new THREE.Mesh(new RoundedBoxGeometry(1.55, 0.72, 1.35, 3, 0.08), physical({ color: bodyColor, metalness: 0.18, roughness: 0.42 })), 0, 0, 0, group);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.08, 40), physical({ color: 0xd7dde6, metalness: 0.78, roughness: 0.22 })), 0, 0.38, 0.02, group);
    const faceMap = meterFace(unit);
    textures.push(faceMap);
    const face = add(new THREE.Mesh(new THREE.CircleGeometry(0.52, 40), new THREE.MeshBasicMaterial({ map: faceMap, toneMapped: false })), 0, 0.43, 0.02, group);
    face.rotation.x = -Math.PI / 2;
    face.castShadow = false;
    jack(group, -0.52, 0.52, 0xc72f40);
    jack(group, 0.52, 0.52, 0x111821);
    return {
      group,
      draw(value, range, fault) {
        const ctx = faceMap.image.getContext('2d');
        const w = faceMap.image.width;
        const h = faceMap.image.height;
        ctx.fillStyle = fault ? '#ffdcda' : '#efe7cf';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#24333f';
        ctx.lineWidth = 5;
        for (let n = 0; n <= 10; n += 1) {
          const angle = Math.PI + (n / 10) * Math.PI;
          ctx.beginPath();
          ctx.moveTo(w / 2 + Math.cos(angle) * 210, h * 0.72 + Math.sin(angle) * 210);
          ctx.lineTo(w / 2 + Math.cos(angle) * (n % 5 === 0 ? 168 : 186), h * 0.72 + Math.sin(angle) * (n % 5 === 0 ? 168 : 186));
          ctx.stroke();
        }
        ctx.fillStyle = '#182b36';
        ctx.textAlign = 'center';
        ctx.font = 'bold 54px sans-serif';
        ctx.fillText(unit, w / 2, h * 0.4);
        ctx.font = '26px sans-serif';
        ctx.fillText('0', 86, h * 0.84);
        ctx.fillText(String(range), w - 86, h * 0.84);
        const angle = Math.PI + THREE.MathUtils.clamp(value / range, 0, 1) * Math.PI;
        ctx.strokeStyle = fault ? '#c52b3c' : '#d34b25';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(w / 2, h * 0.72);
        ctx.lineTo(w / 2 + Math.cos(angle) * 168, h * 0.72 + Math.sin(angle) * 168);
        ctx.stroke();
        ctx.fillStyle = '#23323d';
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.72, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = 'bold 30px ui-monospace, monospace';
        ctx.fillStyle = fault ? '#b32334' : '#182b36';
        ctx.fillText(fault ? 'PROTECTED' : `${Number(value.toFixed(3))} ${unit}`, w / 2, h * 0.93);
        faceMap.needsUpdate = true;
      },
    };
  }

  const ammeter = analogMeter(-1.15, -1.85, 'A', 0x3f8ca3);
  const voltmeter = analogMeter(3.55, 0.05, 'V', 0x3f8f72);

  const resistor = add(
    new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.35, 36), std({ color: 0xd7bb82, roughness: 0.55, metalness: 0.12 })),
    1.55, 0.28, 0,
  );
  resistor.rotation.z = Math.PI / 2;
  const bands = [0x713d22, 0x171e26, 0x171e26, 0xcb9340].map((color, i) => add(
    new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.215, 0.09, 28), std({ color, roughness: 0.45 })),
    -0.42 + i * 0.26, 0, 0,
    resistor,
  ));
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 12), physical({ color: 0xc3cbd0, metalness: 0.85, roughness: 0.2 })), -0.92, 0, 0, resistor);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 12), physical({ color: 0xc3cbd0, metalness: 0.85, roughness: 0.2 })), 0.92, 0, 0, resistor);
  add(new THREE.Mesh(new RoundedBoxGeometry(0.55, 0.12, 0.55, 2, 0.04), std({ color: 0x2a353c, roughness: 0.6 })), 0.85, -0.12, 0);
  add(new THREE.Mesh(new RoundedBoxGeometry(0.55, 0.12, 0.55, 2, 0.04), std({ color: 0x2a353c, roughness: 0.6 })), 2.25, -0.12, 0);

  const wires = new THREE.Group();
  scene.add(wires);
  function tube(points, color) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 36, 0.045, 8, false),
      physical({ color, metalness: 0.35, roughness: 0.42, clearcoat: 0.35 }),
    );
    mesh.castShadow = true;
    wires.add(mesh);
    return curve;
  }
  const y = 0.18;
  tube([[-3.7, y, -0.57], [-3.7, y, -1.85], [-1.67, y, -1.85]], 0xd4573a);
  tube([[-0.63, y, -1.85], [0.85, y, -1.85], [0.85, y, 0]], 0xd4573a);
  tube([[2.25, y, 0], [2.25, y, 2.35], [-3.7, y, 2.35], [-3.7, y, 0.87]], 0x2a3038);
  tube([[0.85, y, 0], [0.85, y, 0.57], [3.03, y, 0.57]], 0x3fa37a);
  tube([[4.07, y, 0.57], [4.07, y, 0], [2.25, y, 0]], 0x3fa37a);
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.7, y, -0.57),
    new THREE.Vector3(-3.7, y, -1.85),
    new THREE.Vector3(-1.15, y, -1.85),
    new THREE.Vector3(0.85, y, -1.85),
    new THREE.Vector3(0.85, y, 0),
    new THREE.Vector3(2.25, y, 0),
    new THREE.Vector3(2.25, y, 2.35),
    new THREE.Vector3(-3.7, y, 2.35),
    new THREE.Vector3(-3.7, y, 0.87),
  ]);

  const particles = Array.from({ length: 12 }, () => {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 10, 10),
      std({ color: 0xffd46b, emissive: 0xffb347, emissiveIntensity: 0.65, roughness: 0.35 }),
    );
    p.castShadow = false;
    scene.add(p);
    return p;
  });

  let current = 0;
  let yaw = 0.42;
  let elevation = 0.72;
  let radius = 12;
  let running = true;
  const target = new THREE.Vector3(0, 0.35, 0);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function applyTheme() {
    const a = cssColor('--scene-a', '#e7f3f1');
    const b = cssColor('--scene-b', '#cfe4df');
    const c = cssColor('--scene-c', '#9fbfb8');
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
    renderer.setClearColor(new THREE.Color(c), 1);
  }
  applyTheme();

  function writeLcd(voltageV, live) {
    const ctx = psuLcd.image.getContext('2d');
    const w = psuLcd.image.width;
    const h = psuLcd.image.height;
    ctx.fillStyle = live ? '#07221c' : '#3a1214';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = live ? '#8ff3c2' : '#ff8b7a';
    ctx.font = 'bold 92px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(live ? `${voltageV.toFixed(2)} V` : 'PROT', w / 2, h * 0.62);
    psuLcd.needsUpdate = true;
  }

  function update({ setup, measurement: reading, status }) {
    current = reading.ok ? reading.currentA : 0;
    ammeter.draw(reading.ok ? reading.currentA : 0, setup.ammeterRangeA, !reading.ok);
    voltmeter.draw(reading.ok ? reading.voltageV : 0, setup.voltmeterRangeV, !reading.ok);
    writeLcd(setup.voltageV, reading.ok);
    led.material.color.setHex(reading.ok ? 0x5dce89 : 0xe33142);
    led.material.emissive.setHex(reading.ok ? 0x5dce89 : 0xe33142);
    knob.rotation.y = (setup.voltageV / 6) * Math.PI * 1.4;
    host.dataset.protection = reading.ok ? 'closed' : 'open';
    host.dataset.circuitState = reading.ok ? 'live' : 'protected';
    host.dataset.fault = status;
    const digitColors = [0x171e26, 0x713d22, 0xc7352c, 0xe78225, 0xe6c82d, 0x298b43, 0x2462bd, 0x754498, 0x888888, 0xeeeeee];
    bands[0].material.color.setHex(digitColors[setup.resistanceOhm < 10 ? setup.resistanceOhm : Math.floor(setup.resistanceOhm / 10)]);
    bands[1].material.color.setHex(digitColors[setup.resistanceOhm < 10 ? 0 : setup.resistanceOhm % 10]);
    bands[2].material.color.setHex(setup.resistanceOhm < 10 ? 0xcb9340 : 0x171e26);
    wires.children.forEach((wire) => {
      wire.material.emissive.setHex(reading.ok ? 0x000000 : 0x5a1020);
      wire.material.emissiveIntensity = reading.ok ? 0 : 0.45;
    });
  }

  let viewW = 0;
  let viewH = 0;
  function resize() {
    const width = Math.max(1, innerWidth);
    const height = Math.max(1, innerHeight);
    if (width === viewW && height === viewH) return;
    viewW = width;
    viewH = height;
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  addEventListener('resize', resize);

  const pointers = new Map();
  const clampRadius = (value) => THREE.MathUtils.clamp(value, 7, 22);
  function zoom(factor) {
    radius = clampRadius(radius * factor);
    host.dataset.zoom = (12 / radius).toFixed(2);
  }
  zoom(1);
  const distance = () => {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  renderer.domElement.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    renderer.domElement.setPointerCapture(e.pointerId);
  });
  renderer.domElement.addEventListener('pointermove', (e) => {
    const old = pointers.get(e.pointerId);
    if (!old) return;
    const before = pointers.size === 2 ? distance() : 0;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const after = distance();
      if (before > 0 && after > 0) zoom(before / after);
    } else if (pointers.size === 1) {
      yaw -= (e.clientX - old.x) * 0.008;
      elevation = THREE.MathUtils.clamp(elevation + (e.clientY - old.y) * 0.005, 0.28, 1.45);
    }
  });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    renderer.domElement.addEventListener(event, (e) => pointers.delete(e.pointerId));
  }
  renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoom(Math.exp(THREE.MathUtils.clamp(e.deltaY, -100, 100) * 0.002));
  }, { passive: false });

  function view(top) {
    yaw = top ? 0 : 0.42;
    elevation = top ? 1.42 : 0.72;
    radius = 12;
    zoom(1);
  }

  let phase = 0;
  let previous = 0;
  renderer.setAnimationLoop((time) => {
    const dt = Math.min((time - previous) / 1000, 0.05);
    previous = time;
    if (document.hidden || host.clientWidth === 0 || !running) return;
    camera.position.set(
      Math.sin(yaw) * Math.cos(elevation) * radius,
      Math.sin(elevation) * radius,
      Math.cos(yaw) * Math.cos(elevation) * radius,
    );
    camera.lookAt(target);
    if (!reduced.matches) phase = (phase + dt * Math.max(current, 0) * 0.22) % 1;
    particles.forEach((p, i) => {
      p.visible = current > 0;
      if (current > 0) p.position.copy(path.getPoint((phase + i / particles.length) % 1));
    });
    renderer.render(scene, camera);
  });
  renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    running = false;
    host.dataset.failed = 'true';
  });
  renderer.domElement.addEventListener('webglcontextrestored', () => {
    running = true;
    delete host.dataset.failed;
  });
  window.addEventListener('pagehide', () => {
    renderer.setAnimationLoop(null);
    observer.disconnect();
    scene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
    textures.forEach((tex) => tex.dispose());
    renderer.dispose();
  }, { once: true });
  resize();
  return { update, view, zoom, applyTheme };
}
