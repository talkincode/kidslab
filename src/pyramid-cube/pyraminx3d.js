/* ============================================================
   金属金字塔魔方 · 3D 引擎
   数据为真：4 tip + 4 center + 6 edge；网格只是投影。
   move = { vertex:0..3, layer:0|1, turns:1|2 }  // 120° 单位，layer0=尖角 layer1=深层
   ============================================================ */
import * as THREE from 'three';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const TAU3 = (Math.PI * 2) / 3;
const SIZE = 2.35;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/* 正四面体顶点（中心在原点） */
const VRAW = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
];
const VERTS = VRAW.map((p) => new THREE.Vector3(...p).normalize().multiplyScalar(SIZE));
const VDIR = VRAW.map((p) => new THREE.Vector3(...p).normalize());

/* 6 条棱：端点顶点编号 */
const EDGES = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

/* 面色：面 opposite 顶点 i 的颜色（蓝红黄绿） */
const FACE_HEX = [0x1d6fe8, 0xd63031, 0xf1c40f, 0x1db954];
const FACE_NAME = ['U', 'L', 'R', 'B']; // 记号：顶点名

const SKIN_MAT = {
  plastic: { roughness: 0.28, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.16, envMapIntensity: 1.1 },
  mirror: { roughness: 0.1, metalness: 0.92, clearcoat: 0.85, clearcoatRoughness: 0.08, envMapIntensity: 1.7 },
};
const BODY_MAT = {
  plastic: { color: 0x1a1b21, roughness: 0.4, metalness: 0.08, clearcoat: 0.65, clearcoatRoughness: 0.32, envMapIntensity: 0.85 },
  mirror: { color: 0x0c0d12, roughness: 0.18, metalness: 0.96, clearcoat: 0.7, clearcoatRoughness: 0.14, envMapIntensity: 1.5 },
};
const SKINS = {
  mirror: { colors: FACE_HEX.map((c) => `#${c.toString(16).padStart(6, '0')}`), emissive: 0.05, finish: 'mirror' },
  classic: { colors: ['#2265e0', '#e03131', '#ffd21e', '#16b04f'], emissive: 0, finish: 'plastic' },
  neon: { colors: ['#00c8ff', '#ff2f68', '#f2ff2e', '#2bff88'], emissive: 0.32, finish: 'plastic' },
};


/** 顶点 v 周围三条棱（与 solver.js 同序，绕 +轴右手循环） */
const AROUND = [
  [0, 1, 2], // v0 → edges to 1,2,3
  [0, 3, 4], // v1 → edges to 0,2,3
  [1, 3, 5], // v2 → edges to 0,1,3
  [2, 4, 5], // v3 → edges to 0,1,2
];

function makeTriGeo(a, b, c) {
  const geo = new THREE.BufferGeometry();
  const n = new THREE.Vector3().crossVectors(
    new THREE.Vector3().subVectors(b, a),
    new THREE.Vector3().subVectors(c, a),
  ).normalize();
  const pos = new Float32Array([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z]);
  const nor = new Float32Array([n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z]);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  geo.computeBoundingSphere();
  return geo;
}

function makeSolidTet(a, b, c, d) {
  const geo = new THREE.BufferGeometry();
  const faces = [[a, b, c], [a, c, d], [a, d, b], [b, d, c]];
  const pos = [];
  const nor = [];
  const cen = a.clone().add(b).add(c).add(d).multiplyScalar(0.25);
  for (const [p, q, r] of faces) {
    const n = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors(q, p),
      new THREE.Vector3().subVectors(r, p),
    ).normalize();
    const fc = p.clone().add(q).add(r).multiplyScalar(1 / 3);
    if (n.dot(fc.clone().sub(cen)) < 0) n.negate();
    pos.push(p.x, p.y, p.z, q.x, q.y, q.z, r.x, r.y, r.z);
    nor.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.computeBoundingSphere();
  return geo;
}

/** 顶点 v 处的局部基：e0 沿棱到 next，绕轴 120° 得 e1、e2 */
function tipFrame(v) {
  const axis = VDIR[v].clone();
  const others = [0, 1, 2, 3].filter((i) => i !== v);
  const e0 = VDIR[others[0]].clone().sub(axis.clone().multiplyScalar(VDIR[others[0]].dot(axis))).normalize();
  const e1 = new THREE.Vector3().crossVectors(axis, e0).normalize();
  // 重新用 AROUND 顺序对齐
  const ord = AROUND[v].map((ei) => {
    const [a, b] = EDGES[ei];
    return a === v ? b : a;
  });
  const p0 = VDIR[ord[0]].clone().projectOnPlane(axis).normalize();
  const x = p0;
  const y = new THREE.Vector3().crossVectors(axis, x).normalize();
  return { axis, x, y, ord };
}

export function createPyraminxApp({ canvas, cssVar, onUserTwist, onFirstInteract, onLiveTwist }) {
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
  renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 120);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;

  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.28 });
  function applyThemeBg() {
    const a = cssVar('--scene-a'); const b = cssVar('--scene-b'); const c = cssVar('--scene-c');
    const cv = Object.assign(document.createElement('canvas'), { width: 16, height: 512 });
    const x = cv.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, a); g.addColorStop(0.55, b); g.addColorStop(1, c);
    x.fillStyle = g; x.fillRect(0, 0, 16, 512);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    if (scene.background?.isTexture) scene.background.dispose();
    scene.background = tex;
    shadowMat.opacity = parseFloat(cssVar('--scene-shadow')) || 0.28;
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.48));
  const key = new THREE.DirectionalLight(0xffffff, 2.05);
  key.position.set(6, 11, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 6;
  key.shadow.bias = -0.0004;
  const kf = 7;
  key.shadow.camera.left = -kf; key.shadow.camera.right = kf;
  key.shadow.camera.top = kf; key.shadow.camera.bottom = -kf;
  scene.add(key);
  scene.add(new THREE.DirectionalLight(0x9db8ff, 0.55).translateX(-7).translateY(3).translateZ(-6));
  const rim = new THREE.PointLight(0xfff1d6, 14, 32, 2);
  rim.position.set(0, 7, -8);
  scene.add(rim);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), shadowMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -SIZE - 0.55;
  ground.receiveShadow = true;
  scene.add(ground);

  const bodyMat = new THREE.MeshPhysicalMaterial({ ...BODY_MAT.mirror });
  const stickMats = FACE_HEX.map((c) => new THREE.MeshPhysicalMaterial({
    color: c, ...SKIN_MAT.mirror, emissive: c, emissiveIntensity: 0.05,
  }));
  const glowMats = FACE_HEX.map((c) => new THREE.MeshPhysicalMaterial({
    color: c, ...SKIN_MAT.mirror, emissive: c, emissiveIntensity: 0.45,
  }));
  const FADE_TINT = new THREE.Color(0xc9c6d2);
  const fadeOf = (c) => new THREE.Color(c).lerp(FADE_TINT, 0.55);
  const fadeMats = FACE_HEX.map((c) => new THREE.MeshPhysicalMaterial({
    color: fadeOf(c), roughness: 0.45, metalness: 0.35,
    clearcoat: 0.4, clearcoatRoughness: 0.4, envMapIntensity: 0.6,
  }));
  let currentSkinId = 'mirror';

  function applyFinish(mat, finish, { faded = false, glow = false } = {}) {
    const base = SKIN_MAT[finish] || SKIN_MAT.plastic;
    if (faded) {
      mat.roughness = finish === 'mirror' ? 0.3 : 0.48;
      mat.metalness = finish === 'mirror' ? 0.5 : 0;
      mat.clearcoat = finish === 'mirror' ? 0.5 : 0.35;
      mat.clearcoatRoughness = finish === 'mirror' ? 0.25 : 0.45;
      mat.envMapIntensity = finish === 'mirror' ? 0.85 : 0.5;
      return;
    }
    Object.assign(mat, {
      roughness: base.roughness,
      metalness: base.metalness,
      clearcoat: base.clearcoat,
      clearcoatRoughness: base.clearcoatRoughness,
      envMapIntensity: base.envMapIntensity * (glow ? 1.12 : 1),
    });
  }

  function setSkin(id) {
    const skin = SKINS[id] || SKINS.mirror;
    currentSkinId = SKINS[id] ? id : 'mirror';
    const finish = skin.finish || 'plastic';
    const body = BODY_MAT[finish] || BODY_MAT.plastic;
    bodyMat.color.setHex(body.color);
    bodyMat.roughness = body.roughness;
    bodyMat.metalness = body.metalness;
    bodyMat.clearcoat = body.clearcoat;
    bodyMat.clearcoatRoughness = body.clearcoatRoughness;
    bodyMat.envMapIntensity = body.envMapIntensity;
    skin.colors.forEach((hex, i) => {
      stickMats[i].color.set(hex);
      stickMats[i].emissive.set(hex);
      stickMats[i].emissiveIntensity = skin.emissive;
      applyFinish(stickMats[i], finish);
      glowMats[i].color.set(hex);
      glowMats[i].emissive.set(hex);
      glowMats[i].emissiveIntensity = Math.max(0.42, skin.emissive + 0.35);
      applyFinish(glowMats[i], finish, { glow: true });
      fadeMats[i].color.copy(fadeOf(hex));
      applyFinish(fadeMats[i], finish, { faded: true });
    });
    renderer.toneMappingExposure = finish === 'mirror' ? 1.18 : 1.06;
  }

  const root = new THREE.Group();
  scene.add(root);
  const pivot = new THREE.Group();
  scene.add(pivot);

  /* pieces: tips[4], centers[4], edges[6] — each { mesh, kind, id, colors:[faceIds], homeQuat, quat } */
  let tips = [];
  let centers = [];
  let edges = [];
  let pickables = [];
  let explode = 0;
  let explodeTarget = 0;

  function disposeMesh(m) {
    m.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
  }

  /* 缝隙：机体略收、贴纸再多收一点，露出细金属边，避免大裂缝 */
  const BODY_SEAM = 0.03;
  const STICKER_GAP = 0.055;
  const STICKER_LIFT = 0.013;

  function shrinkPts(pts, seam) {
    const cen = new THREE.Vector3();
    for (const p of pts) cen.add(p);
    cen.multiplyScalar(1 / pts.length);
    return pts.map((p) => p.clone().lerp(cen, seam));
  }

  function addBodyTet(parent, a, b, c, d, seam = BODY_SEAM) {
    const [sa, sb, sc, sd] = shrinkPts([a, b, c, d], seam);
    const body = new THREE.Mesh(makeSolidTet(sa, sb, sc, sd), bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    parent.add(body);
    return body;
  }

  function addSticker(parent, a, b, c, colorId, lift = STICKER_LIFT) {
    const mid = a.clone().add(b).add(c).multiplyScalar(1 / 3);
    const n = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors(b, a),
      new THREE.Vector3().subVectors(c, a),
    ).normalize();
    if (n.dot(mid) < 0) n.negate();
    // 保证 makeTriGeo 顶点绕序与法线一致
    let aa = a; let bb = b; let cc = c;
    const n2 = new THREE.Vector3().crossVectors(bb.clone().sub(aa), cc.clone().sub(aa));
    if (n2.dot(n) < 0) { bb = c; cc = b; }
    aa = aa.clone().addScaledVector(n, lift);
    bb = bb.clone().addScaledVector(n, lift);
    cc = cc.clone().addScaledVector(n, lift);
    const mesh = new THREE.Mesh(makeTriGeo(aa, bb, cc), stickMats[colorId]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.colorId = colorId;
    parent.add(mesh);
    return mesh;
  }

  let coreMesh = null;

  function edgeIndex(a, b) {
    for (let i = 0; i < 6; i++) {
      const [x, y] = EDGES[i];
      if ((x === a && y === b) || (x === b && y === a)) return i;
    }
    return 0;
  }

  /** 面 opposite opp 的三个顶点，外法线朝外 */
  function faceCorners(opp) {
    const vs = [0, 1, 2, 3].filter((i) => i !== opp);
    const A = VERTS[vs[0]]; const B = VERTS[vs[1]]; const C = VERTS[vs[2]];
    const n = new THREE.Vector3().crossVectors(B.clone().sub(A), C.clone().sub(A));
    const fc = A.clone().add(B).add(C).multiplyScalar(1 / 3);
    if (n.dot(fc) < 0) return [vs[0], vs[2], vs[1]];
    return vs;
  }

  function shrinkTri(p0, p1, p2, gap = STICKER_GAP) {
    const m = p0.clone().add(p1).add(p2).multiplyScalar(1 / 3);
    return [p0, p1, p2].map((p) => p.clone().lerp(m, gap));
  }

  function vertexNeighbors(v) {
    return AROUND[v].map((ei) => {
      const [a, b] = EDGES[ei];
      return a === v ? b : a;
    });
  }

  function rebuildLocalPieces() {
    for (const m of [...tips, ...centers, ...edges]) {
      root.remove(m);
      disposeMesh(m);
    }
    if (coreMesh) {
      root.remove(coreMesh);
      disposeMesh(coreMesh);
      coreMesh = null;
    }
    tips = []; centers = []; edges = []; pickables = [];

    // 深部微型核：仅在爆炸视图时隐约可见，正常状态不从缝里透出大空洞
    const coreV = VERTS.map((v) => v.clone().multiplyScalar(0.42));
    coreMesh = new THREE.Mesh(makeSolidTet(coreV[0], coreV[1], coreV[2], coreV[3]), bodyMat);
    coreMesh.castShadow = false;
    coreMesh.receiveShadow = true;
    root.add(coreMesh);

    for (let v = 0; v < 4; v++) {
      const ord = vertexNeighbors(v);
      const tip = new THREE.Group();
      tip.userData.kind = 'tip'; tip.userData.id = v; tip.userData.vertex = v;
      tip.userData.homeMid = VERTS[v].clone().multiplyScalar(0.9);
      {
        // 尖角：顶点 → 三条棱 1/3 处，与贴纸分区对齐
        const apex = VERTS[v].clone();
        const base = ord.map((o) => VERTS[v].clone().lerp(VERTS[o], 1 / 3));
        addBodyTet(tip, apex, base[0], base[1], base[2]);
      }

      const cen = new THREE.Group();
      cen.userData.kind = 'center'; cen.userData.id = v; cen.userData.vertex = v;
      cen.userData.homeMid = VERTS[v].clone().multiplyScalar(0.5);
      {
        // 中心块：贴在尖角内侧，三面贴纸对应三个四面体楔
        const top = ord.map((o) => VERTS[v].clone().lerp(VERTS[o], 1 / 3));
        const inner = VDIR[v].clone().multiplyScalar(SIZE * 0.2);
        for (let i = 0; i < 3; i++) {
          const o0 = ord[i];
          const o1 = ord[(i + 1) % 3];
          const fc = VERTS[v].clone().add(VERTS[o0]).add(VERTS[o1]).multiplyScalar(1 / 3);
          addBodyTet(cen, inner, top[i], top[(i + 1) % 3], fc);
        }
      }

      tips.push(tip); centers.push(cen);
      root.add(tip, cen);
    }

    for (let e = 0; e < 6; e++) {
      const ed = new THREE.Group();
      ed.userData.kind = 'edge'; ed.userData.id = e; ed.userData.ends = EDGES[e].slice();
      const [a, b] = EDGES[e];
      ed.userData.homeMid = VERTS[a].clone().add(VERTS[b]).multiplyScalar(0.5);
      {
        // 棱块：棱中段两点 + 两侧面心，外表面与贴纸三角重合
        const others = [0, 1, 2, 3].filter((x) => x !== a && x !== b);
        const e1 = VERTS[a].clone().lerp(VERTS[b], 1 / 3);
        const e2 = VERTS[a].clone().lerp(VERTS[b], 2 / 3);
        const f0 = VERTS[a].clone().add(VERTS[b]).add(VERTS[others[0]]).multiplyScalar(1 / 3);
        const f1 = VERTS[a].clone().add(VERTS[b]).add(VERTS[others[1]]).multiplyScalar(1 / 3);
        addBodyTet(ed, e1, e2, f0, f1);
      }
      edges.push(ed);
      root.add(ed);
    }

    // 四面 × 9 面片贴纸，严格拼成单色面
    for (let opp = 0; opp < 4; opp++) {
      const [va, vb, vc] = faceCorners(opp);
      const A = VERTS[va]; const B = VERTS[vb]; const C = VERTS[vc];
      const pt = (i, j, k) => A.clone().multiplyScalar(i / 3)
        .addScaledVector(B, j / 3).addScaledVector(C, k / 3);
      const put = (group, p0, p1, p2) => {
        const [s0, s1, s2] = shrinkTri(p0, p1, p2, STICKER_GAP);
        addSticker(group, s0, s1, s2, opp, STICKER_LIFT);
      };
      // 3 尖角
      put(tips[va], pt(3, 0, 0), pt(2, 1, 0), pt(2, 0, 1));
      put(tips[vb], pt(0, 3, 0), pt(1, 2, 0), pt(0, 2, 1));
      put(tips[vc], pt(0, 0, 3), pt(1, 0, 2), pt(0, 1, 2));
      // 3 棱（朝面心的上三角）
      put(edges[edgeIndex(va, vb)], pt(2, 1, 0), pt(1, 2, 0), pt(1, 1, 1));
      put(edges[edgeIndex(vb, vc)], pt(0, 2, 1), pt(0, 1, 2), pt(1, 1, 1));
      put(edges[edgeIndex(vc, va)], pt(2, 0, 1), pt(1, 0, 2), pt(1, 1, 1));
      // 3 中心（朝尖角的下三角）
      put(centers[va], pt(2, 1, 0), pt(2, 0, 1), pt(1, 1, 1));
      put(centers[vb], pt(1, 2, 0), pt(0, 2, 1), pt(1, 1, 1));
      put(centers[vc], pt(1, 0, 2), pt(0, 1, 2), pt(1, 1, 1));
    }

    pickables = [];
    for (const g of [...tips, ...centers, ...edges]) {
      pickables.push(g, ...g.children);
      g.traverse((ch) => { if (ch.isMesh) pickables.push(ch); });
    }
    placeLocal();
  }

  /** 把家棱 homeEi 旋到槽位 slotEi 的四元数（绕原点） */
  function mapEdgeQuat(homeEi, slotEi, flip) {
    const [ha, hb] = EDGES[homeEi];
    let [sa, sb] = EDGES[slotEi];
    if (flip) [sa, sb] = [sb, sa];
    const A = VERTS[ha]; const B = VERTS[hb];
    const C = VERTS[sa]; const D = VERTS[sb];
    const hx = B.clone().sub(A).normalize();
    const hy = A.clone().add(B).normalize();
    hy.sub(hx.clone().multiplyScalar(hy.dot(hx))).normalize();
    const hz = new THREE.Vector3().crossVectors(hx, hy).normalize();
    const sx = D.clone().sub(C).normalize();
    const sy = C.clone().add(D).normalize();
    sy.sub(sx.clone().multiplyScalar(sy.dot(sx))).normalize();
    const sz = new THREE.Vector3().crossVectors(sx, sy).normalize();
    const hm = new THREE.Matrix4().makeBasis(hx, hy, hz);
    const sm = new THREE.Matrix4().makeBasis(sx, sy, sz);
    const R = sm.multiply(hm.clone().invert());
    return new THREE.Quaternion().setFromRotationMatrix(R);
  }

  /* 逻辑状态 */
  let tipOri = [0, 0, 0, 0];
  let cenOri = [0, 0, 0, 0];
  let edgePerm = [0, 1, 2, 3, 4, 5];
  let edgeOri = [0, 0, 0, 0, 0, 0];

  function resetState() {
    tipOri = [0, 0, 0, 0];
    cenOri = [0, 0, 0, 0];
    edgePerm = [0, 1, 2, 3, 4, 5];
    edgeOri = [0, 0, 0, 0, 0, 0];
  }

  function applyMoveData(vertex, layer, turns) {
    const t = ((turns % 3) + 3) % 3;
    if (!t) return;
    for (let k = 0; k < t; k++) {
      tipOri[vertex] = (tipOri[vertex] + 1) % 3;
      if (layer >= 1) {
        cenOri[vertex] = (cenOri[vertex] + 1) % 3;
        const e = AROUND[vertex];
        const p0 = edgePerm[e[0]]; const p1 = edgePerm[e[1]]; const p2 = edgePerm[e[2]];
        edgePerm[e[0]] = p2;
        edgePerm[e[1]] = p0;
        edgePerm[e[2]] = p1;
      }
    }
  }

  function quatAround(v, turns) {
    return new THREE.Quaternion().setFromAxisAngle(VDIR[v], turns * TAU3);
  }

  function placeLocal() {
    // 世界坐标零件：绕原点旋转即可到位
    for (let v = 0; v < 4; v++) {
      tips[v].position.set(0, 0, 0);
      tips[v].quaternion.copy(quatAround(v, tipOri[v]));
      if (explode > 0.001) tips[v].position.addScaledVector(VDIR[v], explode * 0.55);

      centers[v].position.set(0, 0, 0);
      centers[v].quaternion.copy(quatAround(v, cenOri[v]));
      if (explode > 0.001) centers[v].position.addScaledVector(VDIR[v], explode * 0.28);
    }
    for (let s = 0; s < 6; s++) {
      const p = edgePerm[s];
      const mesh = edges[p];
      mesh.position.set(0, 0, 0);
      mesh.quaternion.copy(mapEdgeQuat(p, s, edgeOri[p] % 2 === 1));
      if (explode > 0.001) {
        const [sa, sb] = EDGES[s];
        const dir = VERTS[sa].clone().add(VERTS[sb]).normalize();
        mesh.position.addScaledVector(dir, explode * 0.35);
      }
    }
  }

  function build() {
    if (tween) { const r = tween.resolve; tween = null; r(); }
    snapAnim = null;
    drag = null;
    animating = false;
    unflash();
    setTracked(false);
    focusType = null;
    explode = 0; explodeTarget = 0;
    pivot.clear();
    pivot.rotation.set(0, 0, 0);
    resetState();
    rebuildLocalPieces();
    fitCamera();
  }

  function commit(move) {
    applyMoveData(move.vertex, move.layer, move.turns);
    placeLocal();
  }

  function isSolved() {
    if (tipOri.some((o) => o !== 0)) return false;
    if (cenOri.some((o) => o !== 0)) return false;
    for (let i = 0; i < 6; i++) if (edgePerm[i] !== i || edgeOri[i] !== 0) return false;
    return true;
  }

  /* ---------- 动画 ---------- */
  let animating = false;
  let tween = null;

  function piecesForMove(vertex, layer) {
    const list = [tips[vertex]];
    if (layer >= 1) {
      list.push(centers[vertex]);
      for (const ei of AROUND[vertex]) list.push(edges[edgePerm[ei]]);
    }
    return list;
  }

  function attachPivot(list) {
    pivot.rotation.set(0, 0, 0);
    pivot.quaternion.identity();
    pivot.position.set(0, 0, 0);
    for (const m of list) pivot.add(m);
  }
  function detachPivot(list) {
    for (const m of list) root.add(m);
  }

  function animateMove(move, dur) {
    return new Promise((resolve) => {
      const t = ((move.turns % 3) + 3) % 3;
      if (!t) { resolve(); return; }
      const signed = t === 2 ? -1 : 1;
      const list = piecesForMove(move.vertex, move.layer);
      attachPivot(list);
      animating = true;
      const axisVec = VDIR[move.vertex].clone();
      tween = {
        axisVec, from: 0, to: signed * TAU3, dur: dur * (t === 2 ? 1.15 : 1),
        t: 0, list, move, resolve,
      };
    });
  }

  function stepTween(dt) {
    if (!tween) return;
    tween.t += dt;
    const p = Math.min(1, tween.t / tween.dur);
    const ang = tween.from + (tween.to - tween.from) * easeInOut(p);
    pivot.setRotationFromAxisAngle(tween.axisVec, ang);
    if (p >= 1) {
      const { list, move, resolve } = tween;
      tween = null;
      detachPivot(list);
      pivot.rotation.set(0, 0, 0);
      commit(move);
      animating = false;
      resolve();
    }
  }

  /* ---------- 相机 ---------- */
  const orbit = { theta: 0.55, phi: 1.05, r: 9, tTheta: 0.55, tPhi: 1.05, tR: 9, min: 4.5, max: 22 };
  let idleSpin = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lessonView = false;
  function updateFraming() {
    const mobile = innerWidth < 761;
    let dx; let dy;
    if (lessonView) {
      dx = mobile ? 0 : -Math.min(130, innerWidth * 0.1);
      dy = mobile ? Math.min(118, innerHeight * 0.17) : Math.min(56, innerHeight * 0.07);
    } else {
      dx = mobile ? 0 : Math.min(178, innerWidth * 0.14);
      dy = mobile ? Math.min(70, innerHeight * 0.105) : 0;
    }
    camera.setViewOffset(innerWidth, innerHeight, dx, dy, innerWidth, innerHeight);
  }
  const aspectBoost = () => Math.max(1, Math.pow(0.92 / camera.aspect, 0.9));
  let fitR = 9;
  function fitCamera() {
    const boost = aspectBoost();
    fitR = (SIZE * 3.6 + 1.4) * boost;
    orbit.tR = fitR * (1 + explodeTarget * 0.45);
    orbit.min = SIZE * 2.2; orbit.max = SIZE * 8 * boost;
    ground.position.y = -SIZE - 0.55;
    updateFraming();
  }
  function updateCamera(dt) {
    const s = Math.min(1, dt * 8);
    orbit.theta += (orbit.tTheta - orbit.theta) * s;
    orbit.phi += (orbit.tPhi - orbit.phi) * s;
    orbit.r += (orbit.tR - orbit.r) * s;
    if (idleSpin) orbit.tTheta += dt * 0.2;
    const { theta, phi, r } = orbit;
    camera.position.set(r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.cos(theta));
    camera.lookAt(0, 0, 0);
  }

  /* ---------- 指针 ---------- */
  let locked = false;
  const pointers = new Map();
  let drag = null;
  let pinch0 = 0;
  let interacted = false;
  const raycaster = new THREE.Raycaster();

  function pointerRay(e) {
    const r = canvas.getBoundingClientRect();
    const p = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(p, camera);
    return raycaster;
  }

  function findPiece(obj) {
    let o = obj;
    while (o) {
      if (o.userData && o.userData.kind) return o;
      o = o.parent;
    }
    return null;
  }

  function onDown(e) {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!interacted) { interacted = true; idleSpin = false; onFirstInteract?.(); }
    if (drag?.mode === 'twist') return;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch0 = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      drag = { mode: 'pinch', r0: orbit.tR };
      return;
    }
    if (pointers.size > 1) return;
    const ray = pointerRay(e);
    const hits = locked || animating ? [] : ray.intersectObjects(pickables, false);
    if (hits.length) {
      const piece = findPiece(hits[0].object);
      if (!piece) { drag = { mode: 'orbit', pid: e.pointerId, x: e.clientX, y: e.clientY }; return; }
      let vertex;
      let layer;
      if (piece.userData.kind === 'tip') {
        vertex = piece.userData.id;
        layer = 0;
      } else if (piece.userData.kind === 'center') {
        vertex = piece.userData.id;
        layer = 1;
      } else {
        // edge: pick nearest endpoint vertex as turn axis
        const [ea, eb] = EDGES[edgePerm.indexOf(piece.userData.id) >= 0
          ? (() => { for (let s = 0; s < 6; s++) if (edgePerm[s] === piece.userData.id) return s; return piece.userData.id; })()
          : piece.userData.id];
        // better: current slot ends
        let slot = piece.userData.id;
        for (let s = 0; s < 6; s++) if (edgePerm[s] === piece.userData.id) { slot = s; break; }
        const ends = EDGES[slot];
        const pt = hits[0].point;
        vertex = pt.distanceTo(VERTS[ends[0]]) < pt.distanceTo(VERTS[ends[1]]) ? ends[0] : ends[1];
        layer = 1;
      }
      const axis = VDIR[vertex].clone();
      const hit = hits[0].point;
      // plane through hit, normal = view-ish cross axis for drag measure — use plane perpendicular to axis at tip
      const plane = new THREE.Plane(axis, -hit.dot(axis));
      drag = {
        mode: 'twist', pid: e.pointerId, vertex, layer, axis, plane,
        p0: hit.clone(), armed: false, sx: e.clientX, sy: e.clientY, angle: 0,
      };
    } else {
      drag = { mode: 'orbit', pid: e.pointerId, x: e.clientX, y: e.clientY };
    }
  }

  function onMove(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!drag) return;
    if (drag.mode === 'pinch' && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      orbit.tR = THREE.MathUtils.clamp(drag.r0 * (pinch0 / d), orbit.min, orbit.max);
      return;
    }
    if (drag.pid !== undefined && e.pointerId !== drag.pid) return;
    if (drag.mode === 'orbit') {
      const dx = e.clientX - drag.x; const dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY;
      orbit.tTheta -= dx * 0.006;
      orbit.tPhi = THREE.MathUtils.clamp(orbit.tPhi - dy * 0.005, 0.35, 2.6);
      return;
    }
    const ray = pointerRay(e);
    const hit = new THREE.Vector3();
    if (!ray.ray.intersectPlane(drag.plane, hit)) return;
    if (!drag.armed) {
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 8) return;
      // tangent basis on plane
      const tmp = Math.abs(drag.axis.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      drag.e1 = new THREE.Vector3().crossVectors(drag.axis, tmp).normalize();
      drag.e2 = new THREE.Vector3().crossVectors(drag.axis, drag.e1).normalize();
      drag.list = piecesForMove(drag.vertex, drag.layer);
      attachPivot(drag.list);
      drag.armed = true;
      animating = true;
      // reference angle of p0
      const r0 = drag.p0.clone().sub(drag.axis.clone().multiplyScalar(drag.p0.dot(drag.axis)));
      drag.a0 = Math.atan2(r0.dot(drag.e2), r0.dot(drag.e1));
    }
    const r = hit.clone().sub(drag.axis.clone().multiplyScalar(hit.dot(drag.axis)));
    const a = Math.atan2(r.dot(drag.e2), r.dot(drag.e1));
    let dang = a - drag.a0;
    while (dang > Math.PI) dang -= Math.PI * 2;
    while (dang < -Math.PI) dang += Math.PI * 2;
    drag.angle = dang;
    pivot.setRotationFromAxisAngle(drag.axis, drag.angle);
    onLiveTwist?.(drag.angle);
  }

  function onUp(e) {
    pointers.delete(e.pointerId);
    if (!drag) return;
    if (drag.mode === 'pinch') { if (pointers.size < 2) drag = null; return; }
    if (drag.pid !== undefined && e.pointerId !== drag.pid) return;
    if (drag.mode !== 'twist') { drag = null; return; }
    const d = drag; drag = null;
    if (!d.armed) return;
    // snap to nearest 120°
    const kA = Math.round((d.angle || 0) / TAU3);
    const target = kA * TAU3;
    const startAng = d.angle || 0;
    const dur = Math.max(0.08, Math.min(0.28, Math.abs(target - startAng) / TAU3 * 0.28));
    const t0 = performance.now() / 1000;
    const finish = () => {
      detachPivot(d.list);
      pivot.rotation.set(0, 0, 0);
      // kA positive = CCW around +axis = +turns
      let turns = ((kA % 3) + 3) % 3;
      const move = { vertex: d.vertex, layer: d.layer, turns };
      commit(move);
      animating = false;
      if (turns) onUserTwist?.(move);
    };
    snapAnim = { d, startAng, target, dur, t0, finish };
  }

  let snapAnim = null;
  function stepSnap() {
    if (!snapAnim) return;
    const { d, startAng, target, dur, t0, finish } = snapAnim;
    const p = Math.min(1, (performance.now() / 1000 - t0) / dur);
    const ang = startAng + (target - startAng) * easeOut(p);
    pivot.setRotationFromAxisAngle(d.axis, ang);
    if (p >= 1) { snapAnim = null; finish(); }
  }

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (!interacted) { interacted = true; idleSpin = false; onFirstInteract?.(); }
    orbit.tR = THREE.MathUtils.clamp(orbit.tR * Math.exp(e.deltaY * 0.0012), orbit.min, orbit.max);
  }, { passive: false });

  /* ---------- 讲解辅助 ---------- */
  let focusType = null;
  let tracked = null; let trackedMats = null; let trackedT = 0;
  const dimMat = new THREE.MeshPhysicalMaterial({
    color: 0x4a4b57, roughness: 0.7, metalness: 0.1,
    clearcoat: 0.15, clearcoatRoughness: 0.7, envMapIntensity: 0.25,
  });
  const trackBody = new THREE.MeshPhysicalMaterial({
    color: 0xffb300, roughness: 0.3, metalness: 0.2,
    clearcoat: 0.8, clearcoatRoughness: 0.25, envMapIntensity: 1.1,
    emissive: 0xff9500, emissiveIntensity: 0.35,
  });

  function setExplode(v) {
    explodeTarget = Math.max(0, v);
    orbit.tR = fitR * (1 + explodeTarget * 0.45);
  }
  function setFocus(type) {
    focusType = type || null;
    const all = [...tips, ...centers, ...edges];
    for (const m of all) {
      if (m === tracked) continue;
      const on = focusType && m.userData.kind === focusType;
      m.traverse((ch) => {
        if (!ch.isMesh || ch === m) return;
        if (ch.userData.colorId == null) {
          ch.material = on ? ch.material : (focusType ? dimMat : bodyMat);
          return;
        }
        ch.material = on ? glowMats[ch.userData.colorId]
          : focusType ? dimMat
            : stickMats[ch.userData.colorId];
      });
      // body
      m.children.forEach((ch) => {
        if (ch.userData.colorId == null && ch.isMesh) {
          ch.material = focusType && !on ? dimMat : bodyMat;
        }
      });
    }
  }
  function setTracked(on, mode = 'edge') {
    if (tracked) {
      tracked.scale.setScalar(1);
      tracked.children.forEach((ch) => {
        if (ch.userData.colorId == null) ch.material = bodyMat;
      });
      trackedMats?.forEach((m) => m.dispose());
      trackedMats = null;
      tracked = null;
      setFocus(focusType);
    }
    if (!on) return;
    tracked = mode === 'tip' ? tips[0] : edges[0];
    trackedT = 0;
    tracked.children.forEach((ch) => {
      if (ch.userData.colorId == null && ch.isMesh) ch.material = trackBody;
    });
    trackedMats = [];
    tracked.traverse((ch) => {
      if (ch.userData.colorId == null) return;
      const mat = stickMats[ch.userData.colorId].clone();
      mat.emissive.set(stickMats[ch.userData.colorId].color);
      mat.emissiveIntensity = 0.4;
      ch.material = mat;
      trackedMats.push(mat);
    });
  }
  function stepLesson(dt) {
    if (explode !== explodeTarget && !animating && !snapAnim) {
      explode += (explodeTarget - explode) * Math.min(1, dt * 4.5);
      if (Math.abs(explode - explodeTarget) < 0.002) explode = explodeTarget;
      placeLocal();
    }
    if (tracked) {
      trackedT += dt;
      const p = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(trackedT * 5));
      for (const mat of trackedMats || []) mat.emissiveIntensity = p;
      tracked.scale.setScalar(1 + 0.05 * Math.sin(trackedT * 5));
    }
  }

  let flashList = null; let flashT = 0; let flashDur = 0;
  function unflash() {
    if (!flashList) return;
    flashList = null;
    for (const m of [...tips, ...centers, ...edges]) {
      if (m === tracked) continue;
      m.traverse((ch) => {
        if (ch.userData.colorId != null) ch.material = stickMats[ch.userData.colorId];
        else if (ch.isMesh && ch.parent === m) ch.material = bodyMat;
      });
    }
  }
  function flashMove(move, dur = 1.6) {
    unflash();
    flashList = piecesForMove(move.vertex, move.layer);
    const set = new Set(flashList);
    flashT = 0; flashDur = dur;
    for (const m of [...tips, ...centers, ...edges]) {
      if (m === tracked) continue;
      const on = set.has(m);
      m.traverse((ch) => {
        if (ch.userData.colorId != null) {
          ch.material = on ? glowMats[ch.userData.colorId] : fadeMats[ch.userData.colorId];
        }
      });
    }
  }
  function stepFlash(dt) {
    if (!flashList) return;
    flashT += dt;
    const p = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(flashT * 8));
    for (const m of glowMats) m.emissiveIntensity = p;
    if (flashT >= flashDur) unflash();
  }

  function randomScramble(count, { tips: useTips = true } = {}) {
    const moves = [];
    let lastV = -1;
    while (moves.length < count) {
      const vertex = Math.floor(Math.random() * 4);
      if (vertex === lastV) continue;
      lastV = vertex;
      const layer = useTips && Math.random() < 0.25 ? 0 : 1;
      const turns = 1 + Math.floor(Math.random() * 2);
      moves.push({ vertex, layer, turns });
    }
    return moves;
  }

  const invert = (mv) => ({ vertex: mv.vertex, layer: mv.layer, turns: (3 - (mv.turns % 3)) % 3 });

  function notation(mv) {
    const face = FACE_NAME[mv.vertex];
    const tip = mv.layer === 0;
    const letter = tip ? face.toLowerCase() : face;
    const suf = mv.turns === 2 ? '′' : '';
    return { text: letter + suf, face, tip };
  }

  /* confetti */
  let confetti = null;
  function celebrate() {
    if (confetti) { scene.remove(confetti.mesh); confetti.mesh.geometry.dispose(); confetti.mesh.material.dispose(); }
    const COUNT = 120;
    const geo = new THREE.PlaneGeometry(0.14, 0.24);
    const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true });
    const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
    mesh.frustumCulled = false;
    const parts = [];
    const palette = (SKINS[currentSkinId] || SKINS.mirror).colors;
    const col = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      parts.push({
        p: new THREE.Vector3((Math.random() - 0.5) * 1.2, Math.random(), (Math.random() - 0.5) * 1.2),
        v: new THREE.Vector3((Math.random() - 0.5) * 7, 5 + Math.random() * 5, (Math.random() - 0.5) * 7),
        r: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
        w: new THREE.Vector3(Math.random() * 8 - 4, Math.random() * 8 - 4, Math.random() * 8 - 4),
      });
      mesh.setColorAt(i, col.set(palette[i % palette.length]));
    }
    scene.add(mesh);
    confetti = { mesh, parts, life: 0 };
  }
  const dummy = new THREE.Object3D();
  function stepConfetti(dt) {
    if (!confetti) return;
    confetti.life += dt;
    const { mesh, parts, life } = confetti;
    for (let i = 0; i < parts.length; i++) {
      const pt = parts[i];
      pt.v.y -= 12 * dt;
      pt.p.addScaledVector(pt.v, dt);
      pt.r.x += pt.w.x * dt; pt.r.y += pt.w.y * dt; pt.r.z += pt.w.z * dt;
      dummy.position.copy(pt.p);
      dummy.rotation.copy(pt.r);
      dummy.scale.setScalar(Math.max(0, Math.min(1, 3 - life)));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (life > 3.2) {
      scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose();
      confetti = null;
    }
  }

  const clock = new THREE.Clock();
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    fitCamera();
  });
  (function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 1 / 30);
    stepTween(dt);
    stepSnap();
    stepConfetti(dt);
    stepLesson(dt);
    stepFlash(dt);
    updateCamera(dt);
    renderer.render(scene, camera);
  })();

  applyThemeBg();
  setSkin('mirror');
  build();

  return {
    build,
    setSkin,
    animateMove,
    isSolved,
    randomScramble,
    invert,
    notation,
    celebrate,
    setExplode,
    setFocus,
    setTracked,
    flashMove,
    getState: () => ({
      tipOri: [...tipOri],
      cenOri: [...cenOri],
      edgePerm: [...edgePerm],
      edgeOri: [...edgeOri],
    }),
    setLessonView: (v) => { lessonView = !!v; updateFraming(); },
    refreshTheme: applyThemeBg,
    setLocked: (v) => { locked = v; },
    setIdleSpin: (v) => { idleSpin = v; },
    isBusy: () => animating || !!snapAnim,
  };
}
