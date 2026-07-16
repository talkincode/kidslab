/* ============================================================
   六幕宇宙 · Six stages of the cosmic zoom
   台灯书桌 → 城市夜景 → 地球 → 太阳系 → 银河系 → 宇宙之网
   所有纹理均由 canvas 程序化生成，零外部素材。
   每幕自带灯光与天幕；stage.group 的缩放/位移/旋转由时间线驱动，
   幕内动画在 update(dt, t) 中进行。
   ============================================================ */

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

/* ---------- 纹理工厂 ---------- */
function makeTex(THREE, w, h, draw, { srgb = true, repeat = false } = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

function softDot(THREE, size = 128, stops = [[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,255,255,0.55)'], [1, 'rgba(255,255,255,0)']]) {
  return makeTex(THREE, size, size, (g) => {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(([o, col]) => grad.addColorStop(o, col));
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }, { srgb: false });
}

/* 柔和噪点涂抹：用一堆随机径向渐变叠出云雾/地形 */
function blotch(g, n, x0, y0, x1, y1, rMin, rMax, color, alpha) {
  for (let i = 0; i < n; i++) {
    const x = rand(x0, x1), y = rand(y0, y1), r = rand(rMin, rMax);
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, color.replace('$a', (alpha * rand(0.5, 1)).toFixed(3)));
    gr.addColorStop(1, color.replace('$a', '0'));
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
}

/* 共用星空（每幕独立实例，便于淡入淡出） */
function makeStars(THREE, dot, { count = 1500, spread = 160, size = 0.7, opacity = 0.85, flat = 0.6 } = {}) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const c = new THREE.Color();
  const tints = [0xffffff, 0xcfe0ff, 0xffe6c8, 0xf3d8ff];
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread * flat;
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    c.set(pick(tints)).multiplyScalar(rand(0.45, 1));
    col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    size, map: dot, vertexColors: true, transparent: true, opacity,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  }));
}

function glowSprite(THREE, dot, color, scale, opacity) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: dot, color, transparent: true, opacity,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  s.scale.setScalar(scale);
  return s;
}

/* 天幕穹顶（竖直渐变） */
function skyDome(THREE, radius, stops) {
  const tex = makeTex(THREE, 4, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 512);
    stops.forEach(([o, col]) => gr.addColorStop(o, col));
    g.fillStyle = gr;
    g.fillRect(0, 0, 4, 512);
  });
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 24),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false, fog: false })
  );
}

/* ============================================================
   第 0 幕 · 一盏灯（书桌 · 摊开的书 · 纸飞机 · 窗外城市微光）
   ============================================================ */
function buildLamp(THREE, dot) {
  const group = new THREE.Group();
  const onFade = [];

  group.add(skyDome(THREE, 90, [[0, '#241b4d'], [0.5, '#120d2e'], [1, '#060412']]));

  /* 木纹书桌 */
  const woodTex = makeTex(THREE, 512, 512, (g, w, h) => {
    g.fillStyle = '#5a3a22';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) {
      const y = Math.random() * h;
      g.strokeStyle = `rgba(${30 + Math.random() * 50 | 0},${18 + Math.random() * 26 | 0},10,${rand(0.08, 0.3)})`;
      g.lineWidth = rand(1, 6);
      g.beginPath();
      g.moveTo(0, y);
      for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x * 0.02 + i) * 4);
      g.stroke();
    }
    blotch(g, 22, 0, 0, w, h, 30, 120, 'rgba(120,80,45,$a)', 0.12);
  }, { repeat: true });
  woodTex.repeat.set(2, 1.2);
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(30, 0.9, 16),
    new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.62, metalness: 0.05 })
  );
  desk.position.y = -1.05;
  desk.receiveShadow = true;
  group.add(desk);

  /* 摊开的书：两页微曲 + 深蓝封皮 */
  const pageTex = (flip) => makeTex(THREE, 256, 256, (g, w, h) => {
    g.fillStyle = '#f6eed8';
    g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(90,80,70,0.55)';
    for (let y = 44; y < h - 30; y += 16) {
      const wd = flip && y === 44 ? 90 : rand(120, 190);
      g.fillRect(30, y, wd, 3.2);
    }
    g.strokeStyle = 'rgba(210,150,60,0.9)';
    g.lineWidth = 5;
    if (flip) { g.beginPath(); g.arc(180, 190, 30, 0, TAU); g.stroke(); g.beginPath(); g.moveTo(180, 160); g.lineTo(180, 220); g.moveTo(150, 190); g.lineTo(210, 190); g.stroke(); }
    const sh = g.createLinearGradient(flip ? 0 : w, 0, flip ? 60 : w - 60, 0);
    sh.addColorStop(0, 'rgba(120,100,70,0.5)');
    sh.addColorStop(1, 'rgba(120,100,70,0)');
    g.fillStyle = sh;
    g.fillRect(flip ? 0 : w - 60, 0, 60, h);
  });
  const book = new THREE.Group();
  const cover = new THREE.Mesh(
    new THREE.BoxGeometry(8.6, 0.3, 5.9),
    new THREE.MeshStandardMaterial({ color: 0x27408f, roughness: 0.5 })
  );
  cover.position.y = -0.42;
  cover.castShadow = true;
  book.add(cover);
  [-1, 1].forEach((side) => {
    const geo = new THREE.PlaneGeometry(4, 5.5, 20, 4);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const u = (x + 2) / 4;
      p.setZ(i, Math.sin(u * Math.PI) * 0.34 + (side > 0 ? u : 1 - u) * 0.1);
    }
    geo.computeVertexNormals();
    const page = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: pageTex(side < 0), roughness: 0.9 }));
    page.rotation.x = -Math.PI / 2;
    page.position.set(side * 2.02, -0.24, 0);
    page.castShadow = true;
    book.add(page);
  });
  book.position.set(0.4, -0.35, 0.6);
  book.rotation.y = -0.14;
  group.add(book);

  /* 黄铜台灯 */
  const brass = new THREE.MeshStandardMaterial({ color: 0x2f5e46, roughness: 0.32, metalness: 0.75 });
  const lamp = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.4, 32), brass);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 4.6, 16), brass);
  stem.position.set(0.5, 2.4, 0);
  stem.rotation.z = -0.22;
  const shade = new THREE.Mesh(new THREE.SphereGeometry(1.55, 32, 16, 0, TAU, 0, Math.PI / 2), brass);
  shade.position.set(1.6, 4.6, 0);
  shade.rotation.z = -2.35;
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xffd9a0, emissive: 0xffc37a, emissiveIntensity: 2.6, roughness: 0.4 })
  );
  bulb.position.set(2.1, 4.15, 0);
  lamp.add(base, stem, shade, bulb);
  lamp.children.forEach((m) => { m.castShadow = true; });
  lamp.position.set(-6.4, -0.6, -1.6);
  lamp.rotation.y = 0.5;
  group.add(lamp);
  const lampGlow = glowSprite(THREE, dot, 0xffb865, 9, 0.5);
  lampGlow.position.set(-4.4, 3.6, -1.2);
  group.add(lampGlow);

  /* 铅笔 + 纸飞机 */
  const pencil = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 3.4, 6), new THREE.MeshStandardMaterial({ color: 0xffb03a, roughness: 0.6 }));
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.5, 6), new THREE.MeshStandardMaterial({ color: 0xe8d3b0, roughness: 0.8 }));
  tip.position.y = 1.95;
  const lead = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 6), new THREE.MeshStandardMaterial({ color: 0x333333 }));
  lead.position.y = 2.14;
  pencil.add(shaft, tip, lead);
  pencil.rotation.set(Math.PI / 2, 0, 0.5);
  pencil.position.set(5.2, -0.42, 2.8);
  pencil.children.forEach((m) => { m.castShadow = true; });
  group.add(pencil);

  const planeGeo = new THREE.BufferGeometry();
  planeGeo.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0.55, 2.2, -1.5, 0, -1.5, 0, 0.18, -1.7,
    0, 0.55, 2.2, 0, 0.18, -1.7, 1.5, 0, -1.5,
    0, 0.18, -1.7, -0.45, -0.5, -1.6, 0, 0.5, 2.15,
    0, 0.18, -1.7, 0, 0.5, 2.15, 0.45, -0.5, -1.6,
  ], 3));
  planeGeo.computeVertexNormals();
  const paperPlane = new THREE.Mesh(planeGeo, new THREE.MeshStandardMaterial({ color: 0xf4f6ff, roughness: 0.85, side: THREE.DoubleSide }));
  paperPlane.scale.setScalar(1.15);
  paperPlane.position.set(6.2, 0.15, -2.6);
  paperPlane.rotation.y = -0.9;
  paperPlane.castShadow = true;
  group.add(paperPlane);

  /* 窗：外面是城市微光（预告下一幕） */
  const win = new THREE.Group();
  const bokeh = makeTex(THREE, 256, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#101a3e');
    gr.addColorStop(0.62, '#1c1636');
    gr.addColorStop(1, '#33203a');
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    blotch(g, 46, 0, h * 0.55, w, h, 3, 12, 'rgba(255,200,120,$a)', 0.8);
    blotch(g, 18, 0, h * 0.5, w, h, 2, 8, 'rgba(140,200,255,$a)', 0.7);
    blotch(g, 5, 0, 0, w, h * 0.4, 1, 2.4, 'rgba(255,255,255,$a)', 0.9);
  });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(10.6, 8), new THREE.MeshBasicMaterial({ map: bokeh }));
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1430, roughness: 0.7 });
  const mkBar = (w, h, x, y) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.5), frameMat);
    b.position.set(x, y, 0.26);
    return b;
  };
  win.add(glass, mkBar(11.4, 0.5, 0, 4.1), mkBar(11.4, 0.5, 0, -4.1), mkBar(0.5, 8.6, -5.5, 0), mkBar(0.5, 8.6, 5.5, 0), mkBar(0.32, 8, 0, 0), mkBar(10.6, 0.32, 0, 0));
  win.position.set(8.5, 4.6, -13);
  win.rotation.y = -0.28;
  group.add(win);
  const moon = glowSprite(THREE, dot, 0xdfe8ff, 3.4, 0.9);
  moon.position.set(11.5, 8.6, -14);
  group.add(moon);

  /* 光：暖聚光（投影）+ 窗外冷月光补光 */
  const spot = new THREE.SpotLight(0xffc98a, 3.2, 0, 0.72, 0.55, 0);
  spot.position.set(-4.6, 4.9, -1.3);
  spot.target.position.set(0.6, -0.6, 0.6);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.002;
  spot.shadow.camera.near = 1;
  spot.shadow.camera.far = 40;
  group.add(spot, spot.target);
  const moonFill = new THREE.DirectionalLight(0x7d95e8, 0.55);
  moonFill.position.set(10, 8, -10);
  group.add(moonFill);
  const warmAmb = new THREE.PointLight(0xff9c5a, 0.5, 0, 0);
  warmAmb.position.set(-4, 3, 2);
  group.add(warmAmb);

  /* 光锥里的尘埃 */
  const dustN = 130;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) {
    dustPos[i * 3] = rand(-5, 3);
    dustPos[i * 3 + 1] = rand(-0.8, 4.6);
    dustPos[i * 3 + 2] = rand(-2.4, 2.4);
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    size: 0.08, map: dot, color: 0xffd9a8, transparent: true, opacity: 0.75,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  group.add(dust);

  return {
    group, onFade,
    update(dt, t) {
      const p = dust.geometry.attributes.position;
      for (let i = 0; i < dustN; i++) {
        let y = p.getY(i) + dt * 0.16;
        if (y > 4.8) y = -0.8;
        p.setY(i, y);
        p.setX(i, p.getX(i) + Math.sin(t * 0.7 + i) * dt * 0.05);
      }
      p.needsUpdate = true;
      spot.intensity = 3.2 + Math.sin(t * 11) * 0.06 + Math.sin(t * 3.1) * 0.05;
      lampGlow.material.opacity = 0.46 + Math.sin(t * 2.2) * 0.05;
      paperPlane.position.y = 0.15 + Math.sin(t * 1.1) * 0.05;
    },
  };
}

/* ============================================================
   第 1 幕 · 城市夜景（发光街网 · 千楼灯窗 · 车流光）
   ============================================================ */
function buildCity(THREE, dot) {
  const group = new THREE.Group();
  const onFade = [];

  group.add(skyDome(THREE, 180, [[0, '#04030e'], [0.55, '#0a0f2c'], [0.8, '#241a3f'], [1, '#4a2c33']]));
  const stars = makeStars(THREE, dot, { count: 900, spread: 260, size: 0.5, opacity: 0.7, flat: 0.5 });
  stars.position.y = 60;
  group.add(stars);
  const moon = glowSprite(THREE, dot, 0xe8efff, 10, 0.85);
  moon.position.set(-60, 74, -110);
  group.add(moon);

  /* 街道网格地面 */
  const streetTex = makeTex(THREE, 512, 512, (g, w, h) => {
    g.fillStyle = '#05060c';
    g.fillRect(0, 0, w, h);
    blotch(g, 40, 0, 0, w, h, 20, 80, 'rgba(28,32,52,$a)', 0.5);
    const line = (px, horiz, width, core, glow) => {
      g.save();
      g.shadowColor = glow;
      g.shadowBlur = width * 3.2;
      g.strokeStyle = core;
      g.lineWidth = width;
      g.beginPath();
      if (horiz) { g.moveTo(0, px); g.lineTo(w, px); } else { g.moveTo(px, 0); g.lineTo(px, h); }
      g.stroke();
      g.restore();
    };
    for (let i = 0; i <= 4; i++) {
      line(i * 128, true, 5, 'rgba(255,176,80,0.95)', 'rgba(255,150,50,0.9)');
      line(i * 128, false, 5, 'rgba(255,176,80,0.95)', 'rgba(255,150,50,0.9)');
    }
    for (let i = 0; i < 8; i++) {
      line(64 + i * 64, true, 2, 'rgba(190,190,220,0.5)', 'rgba(160,170,255,0.45)');
      line(64 + i * 64, false, 2, 'rgba(190,190,220,0.5)', 'rgba(160,170,255,0.45)');
    }
  }, { repeat: true });
  streetTex.repeat.set(6, 6);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshStandardMaterial({ color: 0x0b0d16, roughness: 0.9, emissive: 0xffffff, emissiveMap: streetTex, emissiveIntensity: 0.85 })
  );
  ground.rotation.x = -Math.PI / 2;
  group.add(ground);

  /* 楼群：5 组 InstancedMesh，窗纹理各异；顶面用暗色屋顶 */
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x12141f, roughness: 0.92 });
  const windowTex = (warmBias) => makeTex(THREE, 128, 256, (g, w, h) => {
    g.fillStyle = '#0c0e18';
    g.fillRect(0, 0, w, h);
    const cw = 8, ch = 10;
    for (let y = 4; y < h - 4; y += ch) {
      for (let x = 4; x < w - 4; x += cw) {
        if (Math.random() > 0.62) continue;
        const warm = Math.random() < warmBias;
        const a = rand(0.35, 1);
        g.fillStyle = warm ? `rgba(255,${185 + Math.random() * 40 | 0},110,${a})` : `rgba(150,200,255,${a * 0.8})`;
        g.fillRect(x + 1, y + 2, cw - 3, ch - 4);
      }
    }
  });
  const cell = 4.2;
  const half = 25;
  const positions = [];
  for (let gx = -half; gx <= half; gx++) {
    for (let gz = -half; gz <= half; gz++) {
      if (gx % 6 === 0 || gz % 6 === 0) continue;          // 大道留空
      if (Math.random() < 0.16) continue;
      const x = gx * cell + rand(-0.5, 0.5);
      const z = gz * cell + rand(-0.5, 0.5);
      const d = Math.hypot(x, z);
      const downtown = Math.exp(-(d * d) / (2 * 30 * 30));
      const hgt = 1.6 + Math.pow(Math.random(), 2.4) * 7 + downtown * (10 + Math.random() * 26);
      positions.push({ x, z, w: rand(2.2, 3.4), d: rand(2.2, 3.4), h: hgt });
    }
  }
  const geoBox = new THREE.BoxGeometry(1, 1, 1);
  const chunk = Math.ceil(positions.length / 5);
  const dummy = new THREE.Object3D();
  const cvar = new THREE.Color();
  for (let m = 0; m < 5; m++) {
    const winMat = new THREE.MeshStandardMaterial({
      color: 0x161a28, roughness: 0.75, metalness: 0.15,
      emissive: 0xffffff, emissiveMap: windowTex(rand(0.55, 0.85)), emissiveIntensity: rand(0.85, 1.15),
    });
    const mats = [winMat, winMat, roofMat, roofMat, winMat, winMat];
    const list = positions.slice(m * chunk, (m + 1) * chunk);
    if (!list.length) continue;
    const inst = new THREE.InstancedMesh(geoBox, mats, list.length);
    list.forEach((b, i) => {
      dummy.position.set(b.x, b.h / 2, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.rotation.y = 0;
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      cvar.setHSL(0.62, 0.18, rand(0.5, 1) * 0.75 + 0.25);
      inst.setColorAt(i, cvar);
    });
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    group.add(inst);
  }

  /* 地标塔 + 红色航空灯 */
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x1b2136, roughness: 0.5, metalness: 0.4,
    emissive: 0xffffff, emissiveMap: windowTex(0.5), emissiveIntensity: 1.1,
  });
  const tower = new THREE.Group();
  [[7, 26, 0], [5, 16, 26], [3, 10, 42]].forEach(([wd, hg, y0]) => {
    const t = new THREE.Mesh(new THREE.BoxGeometry(wd, hg, wd), [towerMat, towerMat, roofMat, roofMat, towerMat, towerMat]);
    t.position.y = y0 + hg / 2;
    tower.add(t);
  });
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 9, 8), new THREE.MeshStandardMaterial({ color: 0x8891a8, roughness: 0.4, metalness: 0.8 }));
  antenna.position.y = 56.5;
  tower.add(antenna);
  const beacon = glowSprite(THREE, dot, 0xff3b30, 3, 0.9);
  beacon.position.y = 61.5;
  tower.add(beacon);
  tower.position.set(6, 0, -4);
  group.add(tower);

  /* 车流光 */
  const cars = [];
  const carsGrp = new THREE.Group();
  const avenues = [-25, -12.6, 0, 12.6, 25].map((v) => v * cell);
  for (let i = 0; i < 52; i++) {
    const red = Math.random() < 0.42;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: dot, color: red ? 0xff5a3c : 0xfff3cf, transparent: true, opacity: rand(0.65, 0.95),
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    s.scale.set(rand(2, 3.4), 0.42, 1);
    const horiz = Math.random() < 0.5;
    const lane = pick(avenues) + rand(-1.2, 1.2);
    cars.push({ s, horiz, lane, v: (red ? -1 : 1) * rand(9, 16), off: rand(-150, 150) });
    carsGrp.add(s);
  }
  group.add(carsGrp);

  /* 城市光雾 */
  for (let i = 0; i < 7; i++) {
    const h = glowSprite(THREE, dot, i % 2 ? 0xff9c50 : 0x6a7ac8, rand(34, 70), 0.05);
    h.position.set(rand(-70, 70), rand(4, 16), rand(-70, 40));
    group.add(h);
  }

  const hemi = new THREE.HemisphereLight(0x2a3a68, 0x3d2a1a, 0.55);
  const moonLight = new THREE.DirectionalLight(0x93a8ff, 0.5);
  moonLight.position.set(-60, 80, -60);
  group.add(hemi, moonLight);

  return {
    group, onFade,
    update(dt, t) {
      for (const c of cars) {
        c.off += c.v * dt;
        if (c.off > 150) c.off = -150;
        if (c.off < -150) c.off = 150;
        if (c.horiz) c.s.position.set(c.off, 0.5, c.lane);
        else c.s.position.set(c.lane, 0.5, c.off);
      }
      beacon.material.opacity = 0.35 + Math.abs(Math.sin(t * 2.4)) * 0.6;
    },
  };
}

/* ============================================================
   第 2 幕 · 地球（大陆 · 云层 · 大气辉光 · 月亮）
   ============================================================ */

/* 粗略大陆多边形 [经, 纬]，等距圆柱投影绘制 */
const CONTINENTS = [
  [[-166, 64], [-152, 70], [-132, 70], [-112, 71], [-92, 70], [-72, 62], [-56, 52], [-64, 46], [-70, 41], [-75, 33], [-80, 26], [-88, 30], [-96, 28], [-101, 22], [-96, 16], [-86, 12], [-80, 8], [-84, 14], [-94, 18], [-104, 24], [-114, 32], [-122, 40], [-126, 48], [-136, 57], [-152, 59], [-164, 58]],
  [[-52, 62], [-30, 70], [-22, 78], [-38, 83], [-58, 79], [-56, 68]],                       // 格陵兰
  [[-80, 9], [-70, 11], [-60, 6], [-50, 0], [-41, -6], [-37, -12], [-40, -21], [-48, -26], [-56, -33], [-61, -39], [-66, -46], [-71, -53], [-73, -46], [-73, -35], [-71, -24], [-70, -14], [-76, -5], [-80, 1]],
  [[-17, 15], [-10, 26], [-1, 33], [10, 34], [20, 32], [30, 31], [36, 29], [43, 12], [51, 12], [45, 1], [40, -6], [36, -16], [33, -26], [26, -34], [19, -34], [14, -24], [12, -14], [9, -4], [8, 4], [0, 6], [-8, 5], [-15, 11]],
  [[-9, 37], [-9, 44], [-1, 47], [-4, 49], [1, 51], [5, 54], [8, 58], [12, 65], [22, 70], [42, 67], [62, 70], [84, 74], [104, 76], [124, 73], [142, 70], [162, 67], [178, 66], [170, 60], [156, 60], [142, 55], [132, 44], [122, 38], [120, 28], [109, 19], [105, 10], [100, 7], [98, 13], [91, 21], [85, 21], [80, 9], [72, 20], [66, 25], [57, 26], [48, 29], [43, 37], [35, 37], [27, 37], [22, 39], [14, 41], [8, 44], [2, 40], [-4, 37]],
  [[114, -22], [122, -17], [130, -13], [137, -11], [143, -11], [147, -16], [151, -25], [153, -31], [147, -39], [139, -38], [131, -32], [123, -34], [115, -31]],
];
const ISLANDS = [[-4, 54, 9, 14], [139, 37, 6, 13], [122, 12, 8, 10], [110, -3, 16, 8], [47, -20, 5, 11], [172, -42, 5, 11], [-19, 65, 8, 5]];

function drawLand(g, w, h, inset = 0) {
  const X = (lon) => ((lon + 180) / 360) * w;
  const Y = (lat) => ((90 - lat) / 180) * h;
  for (const poly of CONTINENTS) {
    g.beginPath();
    poly.forEach(([lon, lat], i) => {
      const x = X(lon), y = Y(lat);
      if (i === 0) g.moveTo(x, y);
      else {
        const [plon, plat] = poly[i - 1];
        g.quadraticCurveTo(X(plon), Y(plat), (X(plon) + x) / 2, (Y(plat) + y) / 2);
      }
    });
    g.closePath();
    g.fill();
  }
  for (const [lon, lat, ew, eh] of ISLANDS) {
    g.beginPath();
    g.ellipse(X(lon), Y(lat), Math.max(1, ew * (w / 1024) * 2 - inset), Math.max(1, eh * (h / 512) - inset), rand(-0.5, 0.5), 0, TAU);
    g.fill();
  }
  g.fillRect(0, Y(-71), w, h - Y(-71));   // 南极
}

function buildEarth(THREE, dot) {
  const group = new THREE.Group();
  const onFade = [];

  group.add(makeStars(THREE, dot, { count: 2200, spread: 260, size: 0.6, opacity: 0.9, flat: 1 }));
  const band = glowSprite(THREE, dot, 0x9db8ff, 130, 0.045);
  band.position.set(-30, 20, -110);
  group.add(band);

  const dayTex = makeTex(THREE, 1024, 512, (g, w, h) => {
    const sea = g.createLinearGradient(0, 0, 0, h);
    sea.addColorStop(0, '#12365e');
    sea.addColorStop(0.5, '#0e4b78');
    sea.addColorStop(1, '#123a63');
    g.fillStyle = sea;
    g.fillRect(0, 0, w, h);
    blotch(g, 90, 0, 0, w, h, 20, 90, 'rgba(26,90,140,$a)', 0.25);
    g.save();
    g.filter = 'blur(6px)';
    g.fillStyle = 'rgba(70,160,190,0.75)';
    drawLand(g, w, h, -2);
    g.restore();
    g.fillStyle = '#3d7a3f';
    drawLand(g, w, h);
    g.save();
    g.globalCompositeOperation = 'source-atop';
    blotch(g, 130, 0, 0, w, h, 12, 60, 'rgba(96,140,60,$a)', 0.5);
    blotch(g, 60, 0, h * 0.28, w, h * 0.46, 10, 46, 'rgba(196,168,90,$a)', 0.55);   // 副热带荒漠
    blotch(g, 40, 0, h * 0.42, w, h * 0.58, 12, 50, 'rgba(30,90,40,$a)', 0.6);      // 赤道雨林
    blotch(g, 46, 0, 0, w, h * 0.16, 16, 60, 'rgba(225,232,240,$a)', 0.8);          // 北方针叶/苔原
    blotch(g, 60, 0, 0, w, h, 2, 8, 'rgba(60,70,40,$a)', 0.5);
    const ice = g.createLinearGradient(0, 0, 0, h);
    ice.addColorStop(0, 'rgba(240,248,255,0.95)');
    ice.addColorStop(0.09, 'rgba(240,248,255,0)');
    ice.addColorStop(0.9, 'rgba(240,248,255,0)');
    ice.addColorStop(1, 'rgba(240,248,255,0.98)');
    g.fillStyle = ice;
    g.fillRect(0, 0, w, h);
    g.restore();
  });
  const roughTex = makeTex(THREE, 512, 256, (g, w, h) => {
    g.fillStyle = '#404040';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#e8e8e8';
    drawLand(g, w, h);
  }, { srgb: false });
  const nightTex = makeTex(THREE, 1024, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    blotch(g, 300, 0, h * 0.1, w, h * 0.78, 1.5, 5, 'rgba(255,190,110,$a)', 0.6);
    g.globalCompositeOperation = 'destination-in';
    g.fillStyle = '#ffffff';
    drawLand(g, w, h);                                  // 只保留陆地上的灯
    g.globalCompositeOperation = 'destination-over';
    g.fillStyle = '#000000';
    g.fillRect(0, 0, w, h);
  });

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(6, 96, 64),
    new THREE.MeshStandardMaterial({
      map: dayTex, roughnessMap: roughTex, roughness: 1, metalness: 0.02,
      emissive: 0xffc37a, emissiveMap: nightTex, emissiveIntensity: 0.5,
    })
  );
  earth.rotation.z = 0.08;
  group.add(earth);

  const cloudTex = makeTex(THREE, 1024, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    blotch(g, 60, 0, h * 0.42, w, h * 0.58, 10, 40, 'rgba(255,255,255,$a)', 0.5);
    for (let i = 0; i < 26; i++) {
      const y0 = pick([h * 0.18, h * 0.3, h * 0.66, h * 0.78]) + rand(-20, 20);
      const x0 = rand(0, w);
      g.save();
      g.translate(x0, y0);
      g.rotate(rand(-0.3, 0.3));
      blotch(g, 14, -90, -10, 90, 10, 6, 26, 'rgba(255,255,255,$a)', 0.6);
      g.restore();
    }
    blotch(g, 100, 0, 0, w, h, 4, 14, 'rgba(255,255,255,$a)', 0.35);
  });
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(6.1, 96, 64),
    new THREE.MeshStandardMaterial({ map: cloudTex, transparent: true, opacity: 0.92, depthWrite: false, roughness: 1 })
  );
  group.add(clouds);

  /* 大气辉光（菲涅尔壳） */
  const atmoUniforms = { uColor: { value: new THREE.Color(0x5fa8ff) }, uAlpha: { value: 1 } };
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(6.62, 64, 48),
    new THREE.ShaderMaterial({
      uniforms: atmoUniforms,
      vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 uColor; uniform float uAlpha; varying vec3 vN;
        void main(){ float i = pow(clamp(0.68 - dot(vN, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 3.4); gl_FragColor = vec4(uColor, 1.0) * min(i * 1.6, 1.1) * uAlpha; }`,
      side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
  );
  group.add(atmo);
  onFade.push((a) => { atmoUniforms.uAlpha.value = a; });

  const moonTex = makeTex(THREE, 256, 128, (g, w, h) => {
    g.fillStyle = '#b8b4ac';
    g.fillRect(0, 0, w, h);
    blotch(g, 60, 0, 0, w, h, 4, 22, 'rgba(120,115,105,$a)', 0.5);
    blotch(g, 40, 0, 0, w, h, 2, 9, 'rgba(90,86,80,$a)', 0.55);
    blotch(g, 30, 0, 0, w, h, 3, 12, 'rgba(215,212,205,$a)', 0.5);
  });
  const moonOrbit = new THREE.Group();
  moonOrbit.rotation.x = 0.16;
  const moon = new THREE.Mesh(new THREE.SphereGeometry(1.55, 48, 32), new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.96 }));
  moon.position.set(17.5, 0, 0);
  moonOrbit.add(moon);
  moonOrbit.rotation.y = 2.2;
  group.add(moonOrbit);

  const sun = new THREE.DirectionalLight(0xfff2dc, 3.4);
  sun.position.set(34, 8, 16);
  group.add(sun);
  const sunGlow = glowSprite(THREE, dot, 0xfff0d0, 30, 0.85);
  sunGlow.position.set(120, 26, 52);
  const sunCore = glowSprite(THREE, dot, 0xffffff, 9, 1);
  sunCore.position.copy(sunGlow.position);
  group.add(sunGlow, sunCore);
  const fill = new THREE.AmbientLight(0x1b2a4a, 0.8);
  group.add(fill);

  return {
    group, onFade,
    update(dt) {
      earth.rotation.y += dt * 0.05;
      clouds.rotation.y += dt * 0.068;
      moonOrbit.rotation.y += dt * 0.02;
      moon.rotation.y += dt * 0.02;
    },
  };
}

/* ============================================================
   第 3 幕 · 太阳系（日冕脉动 · 八大行星 · 小行星带 · 土星环）
   ============================================================ */
function buildSolar(THREE, dot) {
  const group = new THREE.Group();
  const onFade = [];

  group.add(makeStars(THREE, dot, { count: 2400, spread: 300, size: 0.65, opacity: 0.85, flat: 1 }));

  const sunTex = makeTex(THREE, 256, 256, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
    gr.addColorStop(0, '#fff7d8');
    gr.addColorStop(0.55, '#ffca4a');
    gr.addColorStop(1, '#ff8412');
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    blotch(g, 90, 0, 0, w, h, 3, 14, 'rgba(255,120,20,$a)', 0.4);
    blotch(g, 50, 0, 0, w, h, 2, 8, 'rgba(255,255,220,$a)', 0.4);
  });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(2.5, 48, 32), new THREE.MeshBasicMaterial({ map: sunTex }));
  group.add(sun);
  const corona1 = glowSprite(THREE, dot, 0xffb020, 12, 0.75);
  const corona2 = glowSprite(THREE, dot, 0xff7a00, 24, 0.4);
  const corona3 = glowSprite(THREE, dot, 0xffe8b0, 7, 0.95);
  group.add(corona1, corona2, corona3);
  const sunLight = new THREE.PointLight(0xfff0d8, 3, 0, 0);
  group.add(sunLight);
  group.add(new THREE.AmbientLight(0x101528, 1));

  const bandTex = (cols, spot) => makeTex(THREE, 256, 128, (g, w, h) => {
    cols.forEach((col, i) => {
      g.fillStyle = col;
      const y0 = (i / cols.length) * h;
      g.fillRect(0, y0, w, h / cols.length + 2);
    });
    for (let i = 0; i < 20; i++) {
      g.fillStyle = `rgba(255,255,255,${rand(0.03, 0.1)})`;
      const y = rand(0, h);
      g.fillRect(0, y, w, rand(1, 5));
    }
    if (spot) {
      g.fillStyle = 'rgba(200,90,50,0.85)';
      g.beginPath();
      g.ellipse(w * 0.3, h * 0.62, 16, 9, 0, 0, TAU);
      g.fill();
    }
    blotch(g, 40, 0, 0, w, h, 4, 20, 'rgba(0,0,0,$a)', 0.12);
  });
  const rockTex = (base, dark) => makeTex(THREE, 128, 64, (g, w, h) => {
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);
    blotch(g, 40, 0, 0, w, h, 2, 12, dark + '$a)', 0.5);
    blotch(g, 20, 0, 0, w, h, 1, 5, 'rgba(255,255,255,$a)', 0.18);
  });

  /* [半径, 轨道半径, 公转速度, 纹理, 倾角] */
  const PLANETS = [
    [0.3, 4.6, 0.62, rockTex('#9a8f83', 'rgba(70,62,55,')],
    [0.52, 6.2, 0.45, rockTex('#e0b26a', 'rgba(150,105,50,')],
    [0.56, 8.0, 0.36, rockTex('#3f76c8', 'rgba(50,140,90,')],
    [0.42, 9.9, 0.29, rockTex('#c65f38', 'rgba(120,55,28,')],
    [1.35, 13.4, 0.16, bandTex(['#c8a06a', '#e8d0a8', '#a87850', '#e0c090', '#b08058', '#d8c098'], true)],
    [1.1, 17.2, 0.11, bandTex(['#e0cfa0', '#d0b988', '#e8dcc0', '#c8b080'], false), 'ring'],
    [0.8, 20.4, 0.08, rockTex('#9fd8e0', 'rgba(120,180,190,')],
    [0.78, 23.0, 0.06, rockTex('#3455d0', 'rgba(40,60,150,')],
  ];
  const planets = [];
  const orbitMat = new THREE.LineBasicMaterial({ color: 0x6f7fb8, transparent: true, opacity: 0.22 });
  PLANETS.forEach(([r, orbR, spd, texture, ring], idx) => {
    const orbit = new THREE.Group();
    orbit.rotation.x = rand(-0.05, 0.05);
    orbit.rotation.y = rand(0, TAU);
    const pts = [];
    for (let i = 0; i <= 128; i++) pts.push(new THREE.Vector3(Math.cos((i / 128) * TAU) * orbR, 0, Math.sin((i / 128) * TAU) * orbR));
    orbit.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), orbitMat.clone()));
    const holder = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 28), new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9, metalness: 0 }));
    holder.add(body);
    if (ring) {
      const inner = r * 1.35, outer = r * 2.3;
      const rGeo = new THREE.RingGeometry(inner, outer, 96, 1);
      const uv = rGeo.attributes.uv, posA = rGeo.attributes.position;
      for (let i = 0; i < uv.count; i++) {
        const rr = Math.hypot(posA.getX(i), posA.getY(i));
        uv.setXY(i, (rr - inner) / (outer - inner), 0.5);
      }
      const ringTex = makeTex(THREE, 256, 8, (g, w, h) => {
        for (let x = 0; x < w; x++) {
          const t = x / w;
          const gap = (t > 0.52 && t < 0.6) ? 0.12 : 1;
          const a = (0.25 + Math.abs(Math.sin(t * 40)) * 0.4 + rand(0, 0.2)) * gap * (1 - Math.abs(t - 0.5) * 0.9);
          g.fillStyle = `rgba(220,200,165,${a.toFixed(3)})`;
          g.fillRect(x, 0, 1, h);
        }
      });
      const ringMesh = new THREE.Mesh(rGeo, new THREE.MeshStandardMaterial({ map: ringTex, transparent: true, side: THREE.DoubleSide, roughness: 0.9, depthWrite: false }));
      ringMesh.rotation.x = Math.PI / 2 - 0.42;
      holder.add(ringMesh);
    }
    if (idx === 2) {
      const glow = glowSprite(THREE, dot, 0x5fa8ff, r * 3.4, 0.35);
      holder.add(glow);
    }
    orbit.add(holder);
    group.add(orbit);
    planets.push({ holder, body, orbR, spd, ang: rand(0, TAU) });
  });

  /* 小行星带 */
  const astN = 900;
  const astGeo = new THREE.BufferGeometry();
  const astPos = new Float32Array(astN * 3);
  for (let i = 0; i < astN; i++) {
    const a = Math.random() * TAU;
    const r = 11 + Math.random() * 1.6 + Math.sin(a * 7) * 0.15;
    astPos[i * 3] = Math.cos(a) * r;
    astPos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
    astPos[i * 3 + 2] = Math.sin(a) * r;
  }
  astGeo.setAttribute('position', new THREE.BufferAttribute(astPos, 3));
  const belt = new THREE.Points(astGeo, new THREE.PointsMaterial({
    size: 0.09, map: dot, color: 0xb8a890, transparent: true, opacity: 0.7,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  group.add(belt);

  return {
    group, onFade,
    update(dt, t) {
      for (const p of planets) {
        p.ang += dt * p.spd * 0.5;
        p.holder.position.set(Math.cos(p.ang) * p.orbR, 0, Math.sin(p.ang) * p.orbR);
        p.body.rotation.y += dt * 0.4;
      }
      belt.rotation.y += dt * 0.02;
      sun.rotation.y += dt * 0.04;
      const pulse = 1 + Math.sin(t * 1.4) * 0.06;
      corona1.scale.setScalar(12 * pulse);
      corona2.scale.setScalar(24 * (2 - pulse));
      corona2.material.opacity = 0.34 + Math.sin(t * 0.9) * 0.08;
    },
  };
}

/* ============================================================
   第 4 幕 · 银河系（五旋臂 4.2 万星点 · 边缘侧视揭幕 · 太阳标记）
   ============================================================ */
function buildGalaxy(THREE, dot, registerLangHook) {
  const group = new THREE.Group();
  const onFade = [];
  const spin = new THREE.Group();
  group.add(spin);

  const N = 42000, RADIUS = 15, BRANCHES = 5, SPIN = 1.3, RPOW = 2.6;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const inner = new THREE.Color(0xffd9a8);
  const mid = new THREE.Color(0xc7a8ff);
  const outer = new THREE.Color(0x6fb4ff);
  const c = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const r = Math.pow(Math.random(), 1.6) * RADIUS;
    const branch = ((i % BRANCHES) / BRANCHES) * TAU;
    const ang = branch + r * SPIN * 0.28;
    const spread = (Math.pow(Math.random(), RPOW) * (Math.random() < 0.5 ? 1 : -1));
    const rx = spread * (0.32 + r * 0.1) * 2.2;
    const ry = spread * 0.5 * (1.4 - r / RADIUS) * (Math.random() < 0.5 ? 1 : -1) * (0.5 + Math.random());
    const rz = (Math.pow(Math.random(), RPOW) * (Math.random() < 0.5 ? 1 : -1)) * (0.32 + r * 0.1) * 2.2;
    pos[i * 3] = Math.cos(ang) * r + rx;
    pos[i * 3 + 1] = ry * 0.5;
    pos[i * 3 + 2] = Math.sin(ang) * r + rz;
    const tt = r / RADIUS;
    if (tt < 0.4) c.lerpColors(inner, mid, tt / 0.4);
    else c.lerpColors(mid, outer, (tt - 0.4) / 0.6);
    c.lerp(new THREE.Color(0xffffff), Math.random() * 0.3);
    col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const points = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.16, map: dot, vertexColors: true, transparent: true, opacity: 1,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  spin.add(points);

  const core1 = glowSprite(THREE, dot, 0xffe0b0, 9, 0.95);
  const core2 = glowSprite(THREE, dot, 0xffc890, 18, 0.5);
  const halo = glowSprite(THREE, dot, 0x8f9fff, 40, 0.13);
  spin.add(core1, core2, halo);

  /* 太阳位置标记（猎户臂） */
  const marker = new THREE.Group();
  const ringTex = makeTex(THREE, 128, 128, (g, w, h) => {
    g.strokeStyle = 'rgba(255,214,102,0.95)';
    g.lineWidth = 6;
    g.beginPath();
    g.arc(w / 2, h / 2, 44, 0, TAU);
    g.stroke();
  }, { srgb: false });
  const ring = new THREE.Sprite(new THREE.SpriteMaterial({ map: ringTex, transparent: true, depthWrite: false }));
  ring.scale.setScalar(1.6);
  const sunDot = glowSprite(THREE, dot, 0xffd166, 0.8, 1);
  let labelSprite = null;
  const setLabel = (lang) => {
    const text = lang === 'zh' ? '太阳在这里' : 'Our Sun is here';
    const tex = makeTex(THREE, 512, 128, (g, w, h) => {
      g.font = `700 52px ui-rounded, "PingFang SC", "Microsoft YaHei", sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.shadowColor = 'rgba(255,190,80,0.9)';
      g.shadowBlur = 18;
      g.fillStyle = '#fff2d0';
      g.fillText(text, w / 2, h / 2);
    }, { srgb: false });
    if (!labelSprite) {
      labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
      labelSprite.scale.set(5.4, 1.35, 1);
      labelSprite.position.set(0, 1.5, 0);
      marker.add(labelSprite);
    } else {
      labelSprite.material.map.dispose();
      labelSprite.material.map = tex;
      labelSprite.material.needsUpdate = true;
    }
  };
  setLabel('zh');
  registerLangHook(setLabel);
  marker.add(ring, sunDot);
  const mAng = (0 / BRANCHES) * TAU + 8.2 * SPIN * 0.28;
  marker.position.set(Math.cos(mAng) * 8.2, 0.5, Math.sin(mAng) * 8.2);
  spin.add(marker);

  /* 卫星星系 + 远处微光 */
  const lmc = glowSprite(THREE, dot, 0xbfd0ff, 4, 0.22);
  lmc.position.set(20, -7, -9);
  const smc = glowSprite(THREE, dot, 0xd8c8ff, 2.6, 0.18);
  smc.position.set(24, -10, -4);
  group.add(lmc, smc);
  group.add(makeStars(THREE, dot, { count: 1200, spread: 280, size: 0.5, opacity: 0.55, flat: 1 }));

  return {
    group, onFade,
    update(dt, t) {
      spin.rotation.y += dt * 0.02;
      core2.material.opacity = 0.4 + Math.sin(t * 0.8) * 0.08;
      const pulse = 1 + Math.sin(t * 2.4) * 0.18;
      ring.scale.setScalar(1.6 * pulse);
      ring.material.opacity = 0.65 + Math.sin(t * 2.4) * 0.3;
    },
  };
}

/* ============================================================
   第 5 幕 · 宇宙之网（星系长城 · 纤维结构 · 亿万星系）
   ============================================================ */
function buildUniverse(THREE, dot) {
  const group = new THREE.Group();
  const onFade = [];
  const drift = new THREE.Group();
  group.add(drift);

  /* 四种星系形态纹理 */
  const spiralTex = (hue) => makeTex(THREE, 128, 128, (g, w, h) => {
    g.translate(w / 2, h / 2);
    const core = g.createRadialGradient(0, 0, 0, 0, 0, 16);
    core.addColorStop(0, 'rgba(255,244,220,1)');
    core.addColorStop(1, 'rgba(255,244,220,0)');
    g.fillStyle = core;
    g.fillRect(-20, -20, 40, 40);
    for (let arm = 0; arm < 2; arm++) {
      g.rotate(Math.PI * arm);
      for (let i = 0; i < 46; i++) {
        const tt = i / 46;
        const ang = tt * 3.6;
        const r = 5 + tt * 48;
        const x = Math.cos(ang) * r, y = Math.sin(ang) * r * 0.72;
        const gr = g.createRadialGradient(x, y, 0, x, y, 7 * (1 - tt * 0.5));
        gr.addColorStop(0, `hsla(${hue},80%,75%,${0.5 * (1 - tt)})`);
        gr.addColorStop(1, `hsla(${hue},80%,75%,0)`);
        g.fillStyle = gr;
        g.fillRect(x - 8, y - 8, 16, 16);
      }
      g.rotate(-Math.PI * arm);
    }
  }, { srgb: false });
  const ellipticalTex = makeTex(THREE, 128, 128, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 52);
    gr.addColorStop(0, 'rgba(255,236,200,0.95)');
    gr.addColorStop(0.4, 'rgba(255,220,170,0.4)');
    gr.addColorStop(1, 'rgba(255,220,170,0)');
    g.save();
    g.translate(w / 2, h / 2);
    g.scale(1, 0.68);
    g.translate(-w / 2, -h / 2);
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    g.restore();
  }, { srgb: false });
  const irregularTex = makeTex(THREE, 128, 128, (g, w, h) => {
    blotch(g, 14, 30, 34, 98, 94, 8, 22, 'rgba(190,210,255,$a)', 0.55);
    blotch(g, 8, 40, 40, 88, 88, 4, 10, 'rgba(255,255,255,$a)', 0.5);
  }, { srgb: false });
  const textures = [spiralTex(210), spiralTex(260), ellipticalTex, irregularTex];

  /* 宇宙纤维：沿曲线撒星系 */
  const placements = [];
  for (let f = 0; f < 15; f++) {
    const p0 = new THREE.Vector3(rand(-26, 26), rand(-18, 18), rand(-26, 26));
    const dir = new THREE.Vector3(rand(-1, 1), rand(-0.6, 0.6), rand(-1, 1)).normalize();
    const perp = new THREE.Vector3(-dir.z, dir.x * 0.5, dir.x).normalize();
    const len = rand(24, 44);
    const wob = rand(2, 6);
    const nSeg = 15;
    for (let s = 0; s < nSeg; s++) {
      const tt = s / (nSeg - 1);
      const base = p0.clone().addScaledVector(dir, (tt - 0.5) * len).addScaledVector(perp, Math.sin(tt * Math.PI * rand(1, 2)) * wob);
      const n = Math.random() < 0.24 ? 3 : 1;
      for (let k = 0; k < n; k++) {
        placements.push({
          p: base.clone().add(new THREE.Vector3(rand(-1.6, 1.6), rand(-1.6, 1.6), rand(-1.6, 1.6))),
          s: rand(0.7, 2.6), v: (Math.random() * 4) | 0,
        });
      }
    }
  }
  for (let nCl = 0; nCl < 7; nCl++) {
    const center = new THREE.Vector3(rand(-22, 22), rand(-14, 14), rand(-22, 22));
    for (let k = 0; k < 14; k++) {
      placements.push({
        p: center.clone().add(new THREE.Vector3(rand(-2.6, 2.6), rand(-2.2, 2.2), rand(-2.6, 2.6))),
        s: rand(0.8, 3), v: (Math.random() * 4) | 0,
      });
    }
  }

  const planeGeo = new THREE.PlaneGeometry(1, 1);
  const dummy = new THREE.Object3D();
  const cvar = new THREE.Color();
  for (let v = 0; v < 4; v++) {
    const list = placements.filter((pl) => pl.v === v);
    if (!list.length) continue;
    const mat = new THREE.MeshBasicMaterial({
      map: textures[v], transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    });
    const inst = new THREE.InstancedMesh(planeGeo, mat, list.length);
    list.forEach((pl, i) => {
      dummy.position.copy(pl.p);
      dummy.rotation.set(rand(0, TAU), rand(0, TAU), rand(0, TAU));
      dummy.scale.setScalar(pl.s);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      cvar.setHSL(rand(0.55, 0.72), rand(0.3, 0.6), rand(0.6, 1));
      if (v === 2) cvar.setHSL(rand(0.07, 0.12), rand(0.4, 0.6), rand(0.65, 1));
      inst.setColorAt(i, cvar);
    });
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    drift.add(inst);
  }

  /* 更远的星系尘 + 幽蓝雾霭 */
  const farN = 3200;
  const farGeo = new THREE.BufferGeometry();
  const farPos = new Float32Array(farN * 3);
  const farCol = new Float32Array(farN * 3);
  for (let i = 0; i < farN; i++) {
    farPos[i * 3] = rand(-70, 70);
    farPos[i * 3 + 1] = rand(-50, 50);
    farPos[i * 3 + 2] = rand(-70, 70);
    cvar.setHSL(rand(0.52, 0.75), 0.5, rand(0.5, 0.9));
    farCol.set([cvar.r, cvar.g, cvar.b], i * 3);
  }
  farGeo.setAttribute('position', new THREE.BufferAttribute(farPos, 3));
  farGeo.setAttribute('color', new THREE.BufferAttribute(farCol, 3));
  const farDust = new THREE.Points(farGeo, new THREE.PointsMaterial({
    size: 0.22, map: dot, vertexColors: true, transparent: true, opacity: 0.6,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  drift.add(farDust);

  for (let i = 0; i < 6; i++) {
    const haze = glowSprite(THREE, dot, i % 2 ? 0x4a3a8f : 0x1f4a6f, rand(30, 55), 0.06);
    haze.position.set(rand(-30, 30), rand(-20, 20), rand(-30, 10));
    drift.add(haze);
  }

  return {
    group, onFade,
    update(dt) {
      drift.rotation.y += dt * 0.008;
      drift.rotation.x += dt * 0.0022;
    },
  };
}

/* ============================================================
   出口：六幕清单 + 时间线参数
   zoomFrom→zoomTo 指数缩放模拟推拉镜头；rot/pos 线性缓动。
   ============================================================ */
export function buildStages(THREE, registerLangHook) {
  const dot = softDot(THREE);
  return [
    {
      ...buildLamp(THREE, dot), id: 'lamp', dur: 12,
      zoomFrom: 2.1, zoomTo: 0.66,
      posFrom: [0, -1.2, 7], posTo: [0, -2.4, -4],
      rotFrom: [0, 0.06, 0], rotTo: [-0.04, -0.05, 0],
    },
    {
      ...buildCity(THREE, dot), id: 'city', dur: 12,
      zoomFrom: 2.1, zoomTo: 0.4,
      posFrom: [0, -16, 10], posTo: [0, -6, -6],
      rotFrom: [-0.02, 0.2, 0], rotTo: [-0.58, 0.62, 0],
    },
    {
      ...buildEarth(THREE, dot), id: 'earth', dur: 13,
      zoomFrom: 1.45, zoomTo: 0.52,
      posFrom: [0, -1.5, 2], posTo: [2, 0.5, -5],
      rotFrom: [0.05, -0.5, 0], rotTo: [-0.08, 0.4, 0],
    },
    {
      ...buildSolar(THREE, dot), id: 'solar', dur: 12,
      zoomFrom: 2.6, zoomTo: 0.42,
      posFrom: [-2, -3, 9], posTo: [0, 1.5, -5],
      rotFrom: [0.2, 0, 0], rotTo: [0.62, 0.5, 0],
    },
    {
      ...buildGalaxy(THREE, dot, registerLangHook), id: 'galaxy', dur: 12,
      zoomFrom: 2.3, zoomTo: 0.5,
      posFrom: [0, -1.5, 5], posTo: [0, 1, -5],
      rotFrom: [1.22, 0.15, 0.05], rotTo: [0.4, 0.55, 0.12],
    },
    {
      ...buildUniverse(THREE, dot), id: 'universe', dur: 13,
      zoomFrom: 2.4, zoomTo: 0.34,
      posFrom: [0, 0, 9], posTo: [0, 0.5, -6],
      rotFrom: [0.05, 0, 0], rotTo: [0.22, 0.5, 0.06],
    },
  ];
}
