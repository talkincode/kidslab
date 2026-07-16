/* ============================================================
   魔方小达人 · 3D 引擎
   —— 数据为真：cubie = { c:整数坐标, quat, stickers[{n,color}] }
      网格只是数据的投影，每次提交后 syncFromModel() 全量对齐。
   ============================================================ */
import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const HALF_PI = Math.PI / 2;
const PITCH = 1.06;                    // 相邻小块中心距（块边长 1 + 缝 0.06）
const AXES = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];

/* 贴纸配色（面顺序：+x R, -x L, +y U, -y D, +z F, -z B） */
const SKINS = {
  classic: { colors: ['#e03131', '#ff8c1a', '#f8fafc', '#ffd21e', '#16b04f', '#2265e0'], emissive: 0 },
  macaron: { colors: ['#ff9db0', '#ffc79b', '#fff7e6', '#ffe9a3', '#a5e6bd', '#a9c6f7'], emissive: 0 },
  neon:    { colors: ['#ff2f68', '#ff9500', '#edf2ff', '#f2ff2e', '#2bff88', '#00c8ff'], emissive: 0.38 },
};

/* ---------- 整数坐标绕 +axis 旋转 90°（右手，精确无漂移） ---------- */
function rot90(v, axis) {
  const [x, y, z] = v;
  if (axis === 0) return [x, -z, y];
  if (axis === 1) return [z, y, -x];
  return [-y, x, z];
}
function rotN(v, axis, k) { let r = v; for (let i = 0; i < k; i++) r = rot90(r, axis); return r; }

/* ---------- 24 个立方体旋转群四元数（用于姿态吸附，消除浮点漂移） ---------- */
const GROUP24 = (() => {
  const qs = [new THREE.Quaternion()];
  const seen = new Set(['1,0,0,0']);
  const keyOf = (q) => {
    let { x, y, z, w } = q;
    if (w < -1e-6 || (Math.abs(w) < 1e-6 && (x < -1e-6 || (Math.abs(x) < 1e-6 && (y < -1e-6 || (Math.abs(y) < 1e-6 && z < 0)))))) { x = -x; y = -y; z = -z; w = -w; }
    return [w, x, y, z].map((n) => Math.round(n * 1000) / 1000).join(',');
  };
  const gens = [];
  for (const a of AXES) for (const s of [1, -1]) gens.push(new THREE.Quaternion().setFromAxisAngle(a, s * HALF_PI));
  for (let i = 0; i < qs.length; i++) {
    for (const g of gens) {
      const nq = qs[i].clone().premultiply(g).normalize();
      const k = keyOf(nq);
      if (!seen.has(k)) { seen.add(k); qs.push(nq); }
    }
  }
  return qs; // 恰好 24 个
})();
function snapQuat(q) {
  let best = GROUP24[0]; let bd = -1;
  for (const g of GROUP24) { const d = Math.abs(q.dot(g)); if (d > bd) { bd = d; best = g; } }
  q.copy(best);
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/* ============================================================ */
export function createCubeApp({ canvas, cssVar, onUserTwist, onFirstInteract, onLiveTwist }) {
  /* ---------- 渲染器（拿不到 WebGL 时返回 null，由外层降级） ---------- */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 120);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  /* ---------- 主题背景（颜色一律来自 CSS token） ---------- */
  function applyThemeBg() {
    const a = cssVar('--scene-a'), b = cssVar('--scene-b'), c = cssVar('--scene-c');
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

  /* ---------- 灯光 ---------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(6, 10, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 6;
  key.shadow.bias = -0.0004;
  const kf = 6;
  key.shadow.camera.left = -kf; key.shadow.camera.right = kf;
  key.shadow.camera.top = kf; key.shadow.camera.bottom = -kf;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9db8ff, 0.55);
  fill.position.set(-7, 3, -6);
  scene.add(fill);
  const rim = new THREE.PointLight(0xfff1d6, 12, 30, 2);
  rim.position.set(0, 6, -8);
  scene.add(rim);

  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.28 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), shadowMat);
  ground.rotation.x = -HALF_PI;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---------- 共享几何与材质 ---------- */
  const bodyGeo = new RoundedBoxGeometry(1, 1, 1, 4, 0.085);
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a1b21, roughness: 0.38, metalness: 0.05,
    clearcoat: 0.7, clearcoatRoughness: 0.3, envMapIntensity: 0.9,
  });
  const stickGeo = new RoundedBoxGeometry(0.86, 0.86, 0.06, 3, 0.028);
  const stickMats = SKINS.classic.colors.map((c) => new THREE.MeshPhysicalMaterial({
    color: c, roughness: 0.26, metalness: 0,
    clearcoat: 1, clearcoatRoughness: 0.14, envMapIntensity: 1.15,
    emissive: c, emissiveIntensity: 0,
  }));
  /* 讲解聚焦用的「亮灯」版贴纸 */
  const glowMats = SKINS.classic.colors.map((c) => new THREE.MeshPhysicalMaterial({
    color: c, roughness: 0.26, metalness: 0,
    clearcoat: 1, clearcoatRoughness: 0.14, envMapIntensity: 1.15,
    emissive: c, emissiveIntensity: 0.42,
  }));
  /* 「帮我一步」非标记层用的淡化版贴纸：颜色变淡但仍可辨认 */
  const FADE_TINT = new THREE.Color(0xc9c6d2);
  const fadeOf = (c) => new THREE.Color(c).lerp(FADE_TINT, 0.55);
  const fadeMats = SKINS.classic.colors.map((c) => new THREE.MeshPhysicalMaterial({
    color: fadeOf(c), roughness: 0.45, metalness: 0,
    clearcoat: 0.4, clearcoatRoughness: 0.4, envMapIntensity: 0.55,
  }));
  function setSkin(id) {
    const skin = SKINS[id] || SKINS.classic;
    skin.colors.forEach((c, i) => {
      stickMats[i].color.set(c);
      stickMats[i].emissive.set(c);
      stickMats[i].emissiveIntensity = skin.emissive;
      glowMats[i].color.set(c);
      glowMats[i].emissive.set(c);
      fadeMats[i].color.copy(fadeOf(c));
    });
  }

  /* ---------- 魔方数据与网格 ---------- */
  const cubeGroup = new THREE.Group();
  scene.add(cubeGroup);
  const pivot = new THREE.Group();
  scene.add(pivot);

  let N = 3;
  let cubies = [];          // { c:[x,y,z], quat, stickers:[{n:[x,y,z], color}], mesh }
  const raycaster = new THREE.Raycaster();
  let pickables = [];

  function build(n) {
    N = n;
    /* 重建前取消一切进行中的动画/拖拽，避免旧网格残留在 pivot 里 */
    if (tween) { const r = tween.resolve; tween = null; r(); }
    snapAnim = null;
    drag = null;
    animating = false;
    if (trackedMats) trackedMats.forEach((m) => m.dispose());
    trackedCb = null; trackedMats = null; focusType = null;
    flashList = null;
    explode = 0; explodeTarget = 0;
    pivot.clear();
    pivot.rotation.set(0, 0, 0);
    cubeGroup.clear();
    cubies = []; pickables = [];
    const m = N - 1;
    for (let ix = 0; ix < N; ix++) for (let iy = 0; iy < N; iy++) for (let iz = 0; iz < N; iz++) {
      const c = [2 * ix - m, 2 * iy - m, 2 * iz - m];
      if (Math.max(Math.abs(c[0]), Math.abs(c[1]), Math.abs(c[2])) !== m) continue; // 跳过看不见的内芯
      const mesh = new THREE.Mesh(bodyGeo, bodyMat);
      mesh.castShadow = true;
      const stickers = [];
      const faces = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
      faces.forEach((nv, fi) => {
        const ax = nv.findIndex((v) => v !== 0);
        if (c[ax] !== nv[ax] * m) return;
        const st = new THREE.Mesh(stickGeo, stickMats[fi]);
        st.position.set(nv[0] * 0.505, nv[1] * 0.505, nv[2] * 0.505);
        if (ax === 0) st.rotation.y = HALF_PI; else if (ax === 1) st.rotation.x = HALF_PI;
        mesh.add(st);
        st.userData.ci = cubies.length;
        stickers.push({ n: nv, color: fi });
      });
      mesh.userData.ci = cubies.length;
      cubies.push({ c, quat: new THREE.Quaternion(), stickers, mesh });
      cubeGroup.add(mesh);
      pickables.push(mesh, ...mesh.children);
    }
    syncFromModel();
    fitCamera();
  }

  function syncFromModel() {
    const f = (1 + explode) * PITCH / 2;
    for (const cb of cubies) {
      cb.mesh.position.set(cb.c[0] * f, cb.c[1] * f, cb.c[2] * f);
      cb.mesh.quaternion.copy(cb.quat);
    }
  }

  /** 提交一步：move = { axis:0|1|2, coord:整数层坐标, turns:1|2|3 (绕 +axis 右手 90° 数) } */
  function commit(move) {
    const k = ((move.turns % 4) + 4) % 4;
    if (!k) return;
    const q = new THREE.Quaternion().setFromAxisAngle(AXES[move.axis], k * HALF_PI);
    for (const cb of cubies) {
      if (cb.c[move.axis] !== move.coord) continue;
      cb.c = rotN(cb.c, move.axis, k);
      cb.quat.premultiply(q);
      snapQuat(cb.quat);
    }
    syncFromModel();
  }

  /** 判定还原：每个朝向上所有贴纸同色（允许整体旋转、允许中心块自转） */
  function isSolved() {
    const seen = new Map();
    const v = new THREE.Vector3();
    for (const cb of cubies) for (const st of cb.stickers) {
      v.set(st.n[0], st.n[1], st.n[2]).applyQuaternion(cb.quat);
      const key = `${Math.round(v.x)},${Math.round(v.y)},${Math.round(v.z)}`;
      const prev = seen.get(key);
      if (prev === undefined) seen.set(key, st.color);
      else if (prev !== st.color) return false;
    }
    return true;
  }

  /* ---------- 层动画（程序驱动：打乱 / 提示 / 演示 / 撤销） ---------- */
  let animating = false;
  const layerCubies = (axis, coord) => cubies.filter((cb) => cb.c[axis] === coord);

  function attachPivot(list) {
    pivot.rotation.set(0, 0, 0);
    pivot.quaternion.identity();
    for (const cb of list) pivot.add(cb.mesh);
  }
  function detachPivot(list) {
    for (const cb of list) cubeGroup.add(cb.mesh);
  }

  let tween = null; // { axisVec, from, to, dur, t, list, move, resolve }
  function animateMove(move, dur) {
    return new Promise((resolve) => {
      const k = ((move.turns % 4) + 4) % 4;
      if (!k) { resolve(); return; }
      const signed = k === 3 ? -1 : k;               // 走最短弧
      const list = layerCubies(move.axis, move.coord);
      attachPivot(list);
      animating = true;
      const d = dur * (Math.abs(signed) === 2 ? 1.55 : 1);
      tween = { axisVec: AXES[move.axis], from: 0, to: signed * HALF_PI, dur: d, t: 0, list, move, resolve };
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

  /* ---------- 相机轨道（自写：空白拖拽环绕 + 滚轮/双指缩放 + 阻尼） ---------- */
  const orbit = { theta: 0.72, phi: 1.05, r: 8, tTheta: 0.72, tPhi: 1.05, tR: 8, min: 4, max: 26 };
  let idleSpin = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* 视图偏移：桌面把魔方让出右侧面板区，手机抬高避开底部抽屉；讲解模式给左下卡片让位 */
  let lessonView = false;
  function updateFraming() {
    const mobile = innerWidth < 761;
    let dx, dy;
    if (lessonView) {
      dx = mobile ? 0 : -Math.min(130, innerWidth * 0.1);
      dy = mobile ? Math.min(118, innerHeight * 0.17) : Math.min(56, innerHeight * 0.07);
    } else {
      dx = mobile ? 0 : Math.min(178, innerWidth * 0.14);
      dy = mobile ? Math.min(70, innerHeight * 0.105) : 0;
    }
    camera.setViewOffset(innerWidth, innerHeight, dx, dy, innerWidth, innerHeight);
  }
  /* 竖屏时按宽高比拉远相机，保证魔方整体在画面里 */
  const aspectBoost = () => Math.max(1, Math.pow(0.92 / camera.aspect, 0.9));
  let fitR = 8;
  function fitCamera() {
    const half = (N * PITCH) / 2;
    const boost = aspectBoost();
    fitR = (half * 4.9 + 1.7) * boost;
    orbit.tR = fitR * (1 + explodeTarget * 0.5);
    orbit.min = half * 2.6; orbit.max = half * 9 * boost;
    ground.position.y = -half - 1.35;
    key.shadow.camera.left = -half * 2.6; key.shadow.camera.right = half * 2.6;
    key.shadow.camera.top = half * 2.6; key.shadow.camera.bottom = -half * 2.6;
    key.shadow.camera.updateProjectionMatrix();
    updateFraming();
  }
  function updateCamera(dt) {
    const s = Math.min(1, dt * 8);
    orbit.theta += (orbit.tTheta - orbit.theta) * s;
    orbit.phi += (orbit.tPhi - orbit.phi) * s;
    orbit.r += (orbit.tR - orbit.r) * s;
    if (idleSpin) orbit.tTheta += dt * 0.22;
    const { theta, phi, r } = orbit;
    camera.position.set(r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.cos(theta));
    camera.lookAt(0, 0, 0);
  }

  /* ---------- 指针交互：块上拖=转层（跟手），空白拖=转视角 ---------- */
  let locked = false;
  const pointers = new Map();
  let drag = null;   // { mode:'orbit'|'twist', ... }
  let pinch0 = 0;
  let interacted = false;

  function pointerRay(e) {
    const r = canvas.getBoundingClientRect();
    const p = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(p, camera);
    return raycaster;
  }

  function onDown(e) {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!interacted) { interacted = true; idleSpin = false; onFirstInteract?.(); }
    if (drag?.mode === 'twist') return;            // 转层进行中，忽略新手指
    if (pointers.size === 2) {                     // 双指 → 缩放
      const [a, b] = [...pointers.values()];
      pinch0 = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      drag = { mode: 'pinch', r0: orbit.tR };
      return;
    }
    if (pointers.size > 1) return;
    const ray = pointerRay(e);
    const hits = locked || animating ? [] : ray.intersectObjects(pickables, false);
    if (hits.length) {
      const h = hits[0];
      const ci = h.object.userData.ci;
      const cb = cubies[ci];
      const nW = h.face.normal.clone().transformDirection(h.object.matrixWorld);
      /* 命中面法线吸附到该块确实朝外的轴上（贴纸侧面命中时兜底） */
      let bestAx = -1, bestDot = -1, m = N - 1;
      for (let ax = 0; ax < 3; ax++) {
        if (Math.abs(cb.c[ax]) !== m) continue;
        const d = nW.x * AXES[ax].x * Math.sign(cb.c[ax]) + nW.y * AXES[ax].y * Math.sign(cb.c[ax]) + nW.z * AXES[ax].z * Math.sign(cb.c[ax]);
        if (d > bestDot) { bestDot = d; bestAx = ax; }
      }
      if (bestAx < 0) { drag = { mode: 'orbit', pid: e.pointerId, x: e.clientX, y: e.clientY }; return; }
      const n = AXES[bestAx].clone().multiplyScalar(Math.sign(cb.c[bestAx]));
      drag = { mode: 'twist', pid: e.pointerId, ci, n, p0: h.point.clone(), plane: new THREE.Plane(n, -h.point.dot(n)), armed: false, sx: e.clientX, sy: e.clientY };
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
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY;
      orbit.tTheta -= dx * 0.006;
      orbit.tPhi = THREE.MathUtils.clamp(orbit.tPhi - dy * 0.005, 0.35, 2.6);
      return;
    }
    /* --- twist：把指针投到命中面上，算拖动矢量 --- */
    const ray = pointerRay(e);
    const hit = new THREE.Vector3();
    if (!ray.ray.intersectPlane(drag.plane, hit)) return;
    const dv = hit.clone().sub(drag.p0);
    if (!drag.armed) {
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 7) return;
      /* 选面内两轴中与拖动更同向的一根作为“滑动方向”，旋转轴 = n × ê */
      let bestAx = -1, bestVal = 0;
      for (let ax = 0; ax < 3; ax++) {
        if (Math.abs(drag.n.dot(AXES[ax])) > 0.5) continue;
        const d = dv.dot(AXES[ax]);
        if (Math.abs(d) > Math.abs(bestVal)) { bestVal = d; bestAx = ax; }
      }
      if (bestAx < 0) return;
      const eHat = AXES[bestAx].clone().multiplyScalar(Math.sign(bestVal) || 1);
      const aVec = drag.n.clone().cross(eHat);
      const axis = aVec.x ? 0 : aVec.y ? 1 : 2;
      const cb = cubies[drag.ci];
      drag.eHat = eHat;
      drag.aVec = aVec;
      drag.axis = axis;
      drag.coord = cb.c[axis];
      drag.radius = Math.max(0.4, Math.abs(drag.p0.dot(drag.n)));
      drag.list = layerCubies(axis, drag.coord);
      attachPivot(drag.list);
      drag.armed = true;
      animating = true;
    }
    drag.angle = dv.dot(drag.eHat) / drag.radius;
    pivot.setRotationFromAxisAngle(drag.aVec, drag.angle);
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
    /* 吸附到最近的 90° 倍数并补间过去，然后提交数据 */
    const kA = Math.round((d.angle || 0) / HALF_PI);
    const target = kA * HALF_PI;
    const startAng = d.angle || 0;
    const dur = Math.max(0.08, Math.min(0.3, Math.abs(target - startAng) / HALF_PI * 0.3));
    const t0 = perfNow();
    const finish = () => {
      detachPivot(d.list);
      pivot.rotation.set(0, 0, 0);
      /* 换算成绕 +axis 的圈数（aVec 可能是负轴） */
      const sign = d.aVec.x + d.aVec.y + d.aVec.z >= 0 ? 1 : -1;
      const turns = ((kA * sign) % 4 + 4) % 4;
      const move = { axis: d.axis, coord: d.coord, turns };
      commit(move);
      animating = false;
      if (turns) onUserTwist?.(move);
    };
    snapAnim = { d, startAng, target, dur, t0, finish };
  }
  let snapAnim = null;
  const perfNow = () => performance.now() / 1000;
  function stepSnap() {
    if (!snapAnim) return;
    const { d, startAng, target, dur, t0, finish } = snapAnim;
    const p = Math.min(1, (perfNow() - t0) / dur);
    const ang = startAng + (target - startAng) * easeOut(p);
    pivot.setRotationFromAxisAngle(d.aVec, ang);
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

  /* ---------- 讲解模式：炸开视图 / 零件聚焦 / 追踪高亮 ---------- */
  let explode = 0, explodeTarget = 0;
  const dimMat = new THREE.MeshPhysicalMaterial({
    color: 0x4a4b57, roughness: 0.7, metalness: 0,
    clearcoat: 0.15, clearcoatRoughness: 0.7, envMapIntensity: 0.25,
  });
  let focusType = null;   // null | 'center' | 'edge' | 'corner'
  let trackedCb = null, trackedMats = null, trackedT = 0;
  const pieceType = (cb) => (cb.stickers.length === 1 ? 'center' : cb.stickers.length === 2 ? 'edge' : 'corner');

  function setExplode(v) {
    explodeTarget = Math.max(0, v);
    orbit.tR = fitR * (1 + explodeTarget * 0.5);
  }
  function setFocus(type) {
    focusType = type || null;
    for (const cb of cubies) {
      if (cb === trackedCb) continue;
      const on = focusType && pieceType(cb) === focusType;
      cb.mesh.children.forEach((st, i) => {
        st.material = on ? glowMats[cb.stickers[i].color]
          : focusType ? dimMat
          : stickMats[cb.stickers[i].color];
      });
    }
  }
  /** 追踪高亮：金色壳 + 贴纸发光呼吸。mode: 'edge'前上棱(缺则前上右角) | 'low'左下后锚点角 */
  const trackBodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xffb300, roughness: 0.3, metalness: 0.15,
    clearcoat: 0.8, clearcoatRoughness: 0.25, envMapIntensity: 1.1,
    emissive: 0xff9500, emissiveIntensity: 0.35,
  });
  function setTracked(on, mode = 'edge') {
    if (trackedCb) {
      const cb = trackedCb;
      trackedCb = null;
      cb.mesh.scale.setScalar(1);
      cb.mesh.material = bodyMat;
      trackedMats.forEach((m) => m.dispose());
      trackedMats = null;
      setFocus(focusType); // 恢复该块的常规材质
    }
    if (!on) return;
    const m = N - 1;
    trackedCb = mode === 'low'
      ? (cubies.find((cb) => cb.c[0] === -m && cb.c[1] === -m && cb.c[2] === -m) || cubies[0])
      : (cubies.find((cb) => cb.stickers.length === 2 && cb.c[1] === m && cb.c[2] === m)
        || cubies.find((cb) => cb.c[0] === m && cb.c[1] === m && cb.c[2] === m)  // 2×2 无棱块 → 前上右角
        || cubies[0]);
    trackedT = 0;
    trackedCb.mesh.material = trackBodyMat;
    trackedMats = trackedCb.stickers.map((s) => {
      const mat = stickMats[s.color].clone();
      mat.emissive.set(stickMats[s.color].color);
      mat.emissiveIntensity = 0.4;
      return mat;
    });
    trackedCb.mesh.children.forEach((st, i) => { st.material = trackedMats[i]; });
  }
  function stepLesson(dt) {
    if (explode !== explodeTarget && !animating && !snapAnim) {
      explode += (explodeTarget - explode) * Math.min(1, dt * 4.5);
      if (Math.abs(explode - explodeTarget) < 0.002) explode = explodeTarget;
      syncFromModel();
    }
    if (trackedCb) {
      trackedT += dt;
      const p = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(trackedT * 5));
      for (const mat of trackedMats) mat.emissiveIntensity = p;
      trackedCb.mesh.scale.setScalar(1 + 0.055 * Math.sin(trackedT * 5));
    }
  }

  /* ---------- 提示标记：聚光灯点亮即将搬运的一层，其余熄灭 ---------- */
  let flashList = null, flashT = 0, flashDur = 0;
  function unflash() {
    if (!flashList) return;
    for (const m of glowMats) m.emissiveIntensity = 0.42;
    flashList = null;
    for (const cb of cubies) {
      if (cb === trackedCb) continue;
      cb.mesh.children.forEach((st, i) => { st.material = stickMats[cb.stickers[i].color]; });
    }
  }
  /** 高亮 axis/coord 层的全部零件 dur 秒（其余零件颜色变淡），用于「帮我一步」 */
  function flashLayer(axis, coord, dur = 1.6) {
    unflash();
    flashList = layerCubies(axis, coord);
    const inLayer = new Set(flashList);
    flashT = 0; flashDur = dur;
    for (const cb of cubies) {
      if (cb === trackedCb) continue;
      const on = inLayer.has(cb);
      cb.mesh.children.forEach((st, i) => { st.material = on ? glowMats[cb.stickers[i].color] : fadeMats[cb.stickers[i].color]; });
    }
  }
  function stepFlash(dt) {
    if (!flashList) return;
    flashT += dt;
    const p = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(flashT * 8));
    for (const m of glowMats) m.emissiveIntensity = p;
    if (flashT >= flashDur) unflash();
  }

  /* ---------- 打乱序列生成 ---------- */
  function randomScramble(count) {
    const m = N - 1;
    const coords = []; for (let i = -m; i <= m; i += 2) coords.push(i);
    const moves = [];
    let last = '';
    while (moves.length < count) {
      const axis = Math.floor(Math.random() * 3);
      const coord = coords[Math.floor(Math.random() * coords.length)];
      const key = `${axis}:${coord}`;
      if (key === last) continue;
      last = key;
      moves.push({ axis, coord, turns: 1 + Math.floor(Math.random() * 3) });
    }
    return moves;
  }
  const invert = (mv) => ({ axis: mv.axis, coord: mv.coord, turns: (4 - mv.turns) % 4 });

  /** 转动记号：{ text:'R′', face:'R'|'U'...|'M'|'E'|'S', inner:0|2 } */
  function notation(mv) {
    const m = N - 1;
    const posL = ['R', 'U', 'F'][mv.axis], negL = ['L', 'D', 'B'][mv.axis];
    let face, positive, inner = 0;
    if (mv.coord === m) { face = posL; positive = true; }
    else if (mv.coord === -m) { face = negL; positive = false; }
    else if (mv.coord === 0) { face = ['M', 'E', 'S'][mv.axis]; positive = mv.axis === 2; }
    else { inner = 2; face = mv.coord > 0 ? posL : negL; positive = mv.coord > 0; }
    const k = mv.turns;
    const suffix = k === 2 ? '2' : (positive ? (k === 3 ? '' : '′') : (k === 1 ? '' : '′'));
    return { text: (inner ? '2' : '') + face + suffix, face, inner };
  }

  /* ---------- 彩带庆祝（InstancedMesh，一次 draw call） ---------- */
  let confetti = null;
  function celebrate() {
    if (confetti) { scene.remove(confetti.mesh); confetti.mesh.geometry.dispose(); confetti.mesh.material.dispose(); }
    const COUNT = 140;
    const geo = new THREE.PlaneGeometry(0.16, 0.28);
    const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 1 });
    const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
    mesh.frustumCulled = false;
    const parts = [];
    const palette = SKINS.classic.colors;
    const col = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      parts.push({
        p: new THREE.Vector3((Math.random() - 0.5) * 1.5, Math.random() * 1.2, (Math.random() - 0.5) * 1.5),
        v: new THREE.Vector3((Math.random() - 0.5) * 8, 5 + Math.random() * 6, (Math.random() - 0.5) * 8),
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
      const s = Math.max(0, Math.min(1, 3 - life));
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (life > 3.2) {
      scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose();
      confetti = null;
    }
  }

  /* ---------- 主循环与自适应 ---------- */
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
  build(3);

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
    flashLayer,
    /** 导出零件状态给求解器（整数坐标 + 贴纸法向/色号） */
    getState: () => cubies.map((cb) => {
      const v = new THREE.Vector3();
      return {
        c: [...cb.c],
        st: cb.stickers.map((s) => {
          v.set(s.n[0], s.n[1], s.n[2]).applyQuaternion(cb.quat);
          return { n: [Math.round(v.x), Math.round(v.y), Math.round(v.z)], col: s.color };
        }),
      };
    }),
    setLessonView: (v) => { lessonView = !!v; updateFraming(); },
    refreshTheme: applyThemeBg,
    setLocked: (v) => { locked = v; },
    setIdleSpin: (v) => { idleSpin = v; },
    isBusy: () => animating || !!snapAnim,
    order: () => N,
  };
}
