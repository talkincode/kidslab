import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import {
  BOARD_COLS,
  BOARD_ROWS,
  PIECES,
  buildOccupancy,
  legalMoves,
  piecePosition,
} from './puzzle.js';

const HALF_PI = Math.PI / 2;
const CELL = 1.08;
const GAP = 0.075;
const PIECE_HEIGHT = 0.38;
const BOARD_WIDTH = BOARD_COLS * CELL;
const BOARD_DEPTH = BOARD_ROWS * CELL;
const BOARD_TOP = 0.28;
const PIECE_Y = BOARD_TOP + PIECE_HEIGHT / 2 + 0.03;

const ROLE_COLORS = {
  hero: ['#7c151b', '#c12c2e'],
  general: ['#683018', '#a44b27'],
  gate: ['#163f32', '#2f7555'],
  guard: ['#71491e', '#b9833d'],
};

const easeInOut = (value) => (
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2
);

function makeWoodTexture(hex, seed = 1, size = 256) {
  const canvas = Object.assign(document.createElement('canvas'), { width: size, height: size });
  const context = canvas.getContext('2d');
  context.fillStyle = hex;
  context.fillRect(0, 0, size, size);
  let random = seed >>> 0;
  const next = () => {
    random = (random * 1664525 + 1013904223) >>> 0;
    return random / 0xffffffff;
  };
  for (let y = 0; y < size; y += 2) {
    const alpha = 0.025 + next() * 0.04;
    context.strokeStyle = `rgba(${next() > 0.5 ? '255,230,180' : '34,8,3'},${alpha})`;
    context.lineWidth = 0.5 + next() * 1.8;
    context.beginPath();
    context.moveTo(0, y + Math.sin(y * 0.12) * 2);
    for (let x = 0; x <= size; x += 16) {
      context.lineTo(x, y + Math.sin((x + y) * 0.055) * (1.5 + next() * 2));
    }
    context.stroke();
  }
  for (let i = 0; i < 900; i += 1) {
    const shade = next() > 0.5 ? 255 : 0;
    context.fillStyle = `rgba(${shade},${shade},${shade},${0.008 + next() * 0.014})`;
    context.fillRect(next() * size, next() * size, 1 + next() * 2, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function makeLabelTexture(piece, lang) {
  const canvas = Object.assign(document.createElement('canvas'), { width: 512, height: 512 });
  const context = canvas.getContext('2d');
  const text = lang === 'zh' ? piece.zh : piece.en;
  context.clearRect(0, 0, 512, 512);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#f8df9a';
  context.strokeStyle = 'rgba(45,16,7,.72)';
  context.lineJoin = 'round';
  context.shadowColor = 'rgba(255,218,120,.28)';
  context.shadowBlur = 18;

  if (lang === 'zh') {
    const chars = [...text];
    const vertical = piece.h > piece.w;
    const size = chars.length === 1 ? 230 : vertical ? 170 : 185;
    context.font = `700 ${size}px "STKaiti", "KaiTi", "Songti SC", serif`;
    context.lineWidth = 12;
    chars.forEach((char, index) => {
      const x = vertical ? 256 : 256 + (index - (chars.length - 1) / 2) * 190;
      const y = vertical ? 256 + (index - (chars.length - 1) / 2) * 190 : 256;
      context.strokeText(char, x, y);
      context.fillText(char, x, y);
    });
  } else {
    const words = text.split(' ');
    context.font = `700 ${piece.role === 'guard' ? 92 : 78}px Georgia, serif`;
    context.lineWidth = 8;
    const lines = words.length > 1 ? words : [text];
    lines.forEach((line, index) => {
      const y = 256 + (index - (lines.length - 1) / 2) * 96;
      context.strokeText(line, 256, y);
      context.fillText(line, 256, y);
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createArrowGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.28);
  shape.lineTo(0.17, 0.03);
  shape.lineTo(0.075, 0.03);
  shape.lineTo(0.075, -0.24);
  shape.lineTo(-0.075, -0.24);
  shape.lineTo(-0.075, 0.03);
  shape.lineTo(-0.17, 0.03);
  shape.closePath();
  const geometry = new THREE.ShapeGeometry(shape);
  geometry.rotateX(-HALF_PI);
  return geometry;
}

export function createBoard3D({
  canvas,
  cssVar,
  onSelect,
  onMoveRequest,
  onInvalid,
  onInteract,
}) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderScale = reducedMotion ? 0.5 : 1;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !reducedMotion, alpha: false });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(devicePixelRatio, reducedMotion ? 1 : 2));
  renderer.setSize(
    Math.round(innerWidth * renderScale),
    Math.round(innerHeight * renderScale),
    !reducedMotion,
  );
  renderer.shadowMap.enabled = !reducedMotion;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 80);
  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xfff1d6, 0x251715, 1.25));
  const key = new THREE.DirectionalLight(0xffe6bd, 3.1);
  key.position.set(-4.5, 9, 6.5);
  key.castShadow = !reducedMotion;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 5;
  key.shadow.bias = -0.00035;
  key.shadow.camera.left = -7;
  key.shadow.camera.right = 7;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -8;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x8db7c7, 0.72);
  fill.position.set(6, 4, -5);
  scene.add(fill);
  const lantern = new THREE.PointLight(0xff9e52, 35, 18, 2);
  lantern.position.set(-5.5, 4.5, -4);
  scene.add(lantern);

  const deskTexture = makeWoodTexture('#47261b', 91, 512);
  deskTexture.repeat.set(5, 5);
  const desk = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ map: deskTexture, roughness: 0.78, metalness: 0 }),
  );
  desk.rotation.x = -HALF_PI;
  desk.position.y = -0.08;
  desk.receiveShadow = true;
  scene.add(desk);

  const boardTexture = makeWoodTexture('#34150f', 31);
  const trayTexture = makeWoodTexture('#8f5630', 47);
  const brassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xb9812f,
    roughness: 0.23,
    metalness: 0.82,
    clearcoat: 0.55,
    clearcoatRoughness: 0.18,
  });
  const darkWoodMaterial = new THREE.MeshPhysicalMaterial({
    map: boardTexture,
    color: 0xffffff,
    roughness: 0.36,
    metalness: 0,
    clearcoat: 0.55,
    clearcoatRoughness: 0.3,
  });
  const trayMaterial = new THREE.MeshStandardMaterial({
    map: trayTexture,
    color: 0xffffff,
    roughness: 0.58,
    metalness: 0,
  });

  const board = new THREE.Group();
  scene.add(board);
  const base = new THREE.Mesh(
    new RoundedBoxGeometry(BOARD_WIDTH + 0.78, 0.34, BOARD_DEPTH + 0.78, 5, 0.14),
    darkWoodMaterial,
  );
  base.position.y = 0.11;
  base.castShadow = true;
  base.receiveShadow = true;
  board.add(base);
  const tray = new THREE.Mesh(
    new RoundedBoxGeometry(BOARD_WIDTH + 0.12, 0.12, BOARD_DEPTH + 0.12, 3, 0.05),
    trayMaterial,
  );
  tray.position.y = BOARD_TOP - 0.08;
  tray.receiveShadow = true;
  board.add(tray);

  const railHeight = 0.52;
  const railThickness = 0.23;
  const railY = BOARD_TOP + railHeight / 2 - 0.03;
  const addRail = (width, depth, x, z) => {
    const rail = new THREE.Mesh(
      new RoundedBoxGeometry(width, railHeight, depth, 4, 0.07),
      darkWoodMaterial,
    );
    rail.position.set(x, railY, z);
    rail.castShadow = true;
    rail.receiveShadow = true;
    board.add(rail);
  };
  addRail(BOARD_WIDTH + 0.54, railThickness, 0, -BOARD_DEPTH / 2 - 0.18);
  addRail(railThickness, BOARD_DEPTH + 0.54, -BOARD_WIDTH / 2 - 0.18, 0);
  addRail(railThickness, BOARD_DEPTH + 0.54, BOARD_WIDTH / 2 + 0.18, 0);
  const bottomSegment = (BOARD_WIDTH - 2 * CELL) / 2 + 0.27;
  addRail(bottomSegment, railThickness, -(CELL + bottomSegment / 2 - 0.12), BOARD_DEPTH / 2 + 0.18);
  addRail(bottomSegment, railThickness, CELL + bottomSegment / 2 - 0.12, BOARD_DEPTH / 2 + 0.18);

  const grooveMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a170f,
    roughness: 0.9,
    transparent: true,
    opacity: 0.48,
  });
  for (let col = 1; col < BOARD_COLS; col += 1) {
    const groove = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.012, BOARD_DEPTH), grooveMaterial);
    groove.position.set((col - BOARD_COLS / 2) * CELL, BOARD_TOP + 0.002, 0);
    board.add(groove);
  }
  for (let row = 1; row < BOARD_ROWS; row += 1) {
    const groove = new THREE.Mesh(new THREE.BoxGeometry(BOARD_WIDTH, 0.012, 0.018), grooveMaterial);
    groove.position.set(0, BOARD_TOP + 0.002, (row - BOARD_ROWS / 2) * CELL);
    board.add(groove);
  }

  const gateMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf1b84c,
    emissive: 0xff8a20,
    emissiveIntensity: 0.28,
    roughness: 0.32,
    metalness: 0.55,
    transparent: true,
    opacity: 0.82,
  });
  const gate = new THREE.Mesh(new RoundedBoxGeometry(2 * CELL - 0.14, 0.05, 0.8, 3, 0.07), gateMaterial);
  gate.position.set(0, BOARD_TOP + 0.015, BOARD_DEPTH / 2 + 0.44);
  gate.receiveShadow = true;
  board.add(gate);
  const gateLine = new THREE.Mesh(new THREE.BoxGeometry(2 * CELL - 0.26, 0.09, 0.08), brassMaterial);
  gateLine.position.set(0, BOARD_TOP + 0.08, BOARD_DEPTH / 2 + 0.12);
  board.add(gateLine);

  const studGeometry = new THREE.CylinderGeometry(0.075, 0.075, 0.065, 20);
  for (const x of [-BOARD_WIDTH / 2 - 0.24, BOARD_WIDTH / 2 + 0.24]) {
    for (const z of [-BOARD_DEPTH / 2 - 0.24, BOARD_DEPTH / 2 + 0.24]) {
      const stud = new THREE.Mesh(studGeometry, brassMaterial);
      stud.position.set(x, 0.33, z);
      stud.castShadow = true;
      board.add(stud);
    }
  }

  const sealCanvas = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const sealContext = sealCanvas.getContext('2d');
  sealContext.fillStyle = '#a6191f';
  sealContext.fillRect(18, 18, 220, 220);
  sealContext.strokeStyle = '#f2c66e';
  sealContext.lineWidth = 10;
  sealContext.strokeRect(34, 34, 188, 188);
  sealContext.fillStyle = '#f2c66e';
  sealContext.font = '700 132px "STKaiti", "KaiTi", serif';
  sealContext.textAlign = 'center';
  sealContext.textBaseline = 'middle';
  sealContext.fillText('华', 128, 132);
  const sealTexture = new THREE.CanvasTexture(sealCanvas);
  sealTexture.colorSpace = THREE.SRGBColorSpace;
  const seal = new THREE.Mesh(
    new THREE.PlaneGeometry(1.18, 1.18),
    new THREE.MeshBasicMaterial({ map: sealTexture, transparent: true, opacity: 0.88 }),
  );
  seal.rotation.x = -HALF_PI;
  seal.rotation.z = -0.08;
  seal.position.set(-3.5, 0.012, -2.2);
  scene.add(seal);

  const textures = Object.fromEntries(
    Object.entries(ROLE_COLORS).map(([role, [, top]], index) => [
      role,
      makeWoodTexture(top, 120 + index * 17),
    ]),
  );

  const pieceGroup = new THREE.Group();
  board.add(pieceGroup);
  const pieceObjects = [];
  const labelMaterials = [];
  const pickables = [];
  let lang = 'zh';

  function createPiece(piece, index) {
    const group = new THREE.Group();
    group.userData.pieceIndex = index;
    const width = piece.w * CELL - GAP;
    const depth = piece.h * CELL - GAP;
    const [dark] = ROLE_COLORS[piece.role];
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      map: textures[piece.role],
      color: 0xffffff,
      roughness: piece.role === 'hero' ? 0.26 : 0.32,
      metalness: 0.03,
      clearcoat: piece.role === 'hero' ? 0.92 : 0.72,
      clearcoatRoughness: 0.2,
      emissive: new THREE.Color(dark).multiplyScalar(0.2),
      emissiveIntensity: 0,
      envMapIntensity: 1.2,
    });
    const body = new THREE.Mesh(
      new RoundedBoxGeometry(width, PIECE_HEIGHT, depth, 5, 0.085),
      bodyMaterial,
    );
    body.castShadow = true;
    body.receiveShadow = true;
    body.userData.pieceIndex = index;
    group.add(body);

    const inlayMaterial = new THREE.MeshPhysicalMaterial({
      color: piece.role === 'hero' ? 0xcd3c34 : piece.role === 'gate' ? 0x4d8d65 : 0xc17a3b,
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.72,
      clearcoatRoughness: 0.24,
    });
    const inlay = new THREE.Mesh(
      new RoundedBoxGeometry(width - 0.14, 0.045, depth - 0.14, 3, 0.055),
      inlayMaterial,
    );
    inlay.position.y = PIECE_HEIGHT / 2 + 0.008;
    inlay.castShadow = true;
    inlay.userData.pieceIndex = index;
    group.add(inlay);

    const labelMaterial = new THREE.MeshBasicMaterial({
      map: makeLabelTexture(piece, lang),
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.78, depth * 0.78),
      labelMaterial,
    );
    label.rotation.x = -HALF_PI;
    label.position.y = PIECE_HEIGHT / 2 + 0.038;
    label.userData.pieceIndex = index;
    group.add(label);

    const rimMaterial = new THREE.MeshPhysicalMaterial({
      color: piece.role === 'hero' ? 0xd7a744 : 0x6b351c,
      roughness: 0.25,
      metalness: piece.role === 'hero' ? 0.66 : 0.12,
      transparent: true,
      opacity: piece.role === 'hero' ? 0.9 : 0.55,
    });
    const rim = new THREE.Mesh(
      new RoundedBoxGeometry(width - 0.05, PIECE_HEIGHT + 0.035, depth - 0.05, 3, 0.075),
      rimMaterial,
    );
    rim.scale.set(1, 1, 1);
    rim.material.side = THREE.BackSide;
    rim.userData.pieceIndex = index;
    group.add(rim);

    pieceGroup.add(group);
    pieceObjects.push({ group, body, bodyMaterial, label, labelMaterial, baseY: PIECE_Y });
    labelMaterials.push(labelMaterial);
    pickables.push(body, inlay, label);
  }

  PIECES.forEach(createPiece);

  const arrowGeometry = createArrowGeometry();
  const arrowMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x77e1b0,
    emissive: 0x3ee69c,
    emissiveIntensity: 0.9,
    roughness: 0.25,
    metalness: 0.12,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  });
  const arrowGroup = new THREE.Group();
  board.add(arrowGroup);
  const emptyGroup = new THREE.Group();
  board.add(emptyGroup);
  const emptyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf0c65f,
    emissive: 0xff9d32,
    emissiveIntensity: 0.42,
    roughness: 0.35,
    transparent: true,
    opacity: 0.56,
  });

  let state = null;
  let selected = -1;
  let hintedMove = null;
  let interactive = true;
  let tween = null;
  let shake = null;
  let celebration = null;
  let lessonFocus = null;

  const worldPosition = (boardState, index) => {
    const piece = PIECES[index];
    const { x, y } = piecePosition(boardState, index);
    return new THREE.Vector3(
      (x + piece.w / 2 - BOARD_COLS / 2) * CELL,
      PIECE_Y,
      (y + piece.h / 2 - BOARD_ROWS / 2) * CELL,
    );
  };

  function syncPieces() {
    if (!state) return;
    pieceObjects.forEach(({ group }, index) => group.position.copy(worldPosition(state, index)));
  }

  function clearArrows() {
    arrowGroup.clear();
  }

  function arrowAngle(move) {
    if (move.dy < 0) return 0;
    if (move.dx > 0) return -HALF_PI;
    if (move.dy > 0) return Math.PI;
    return HALF_PI;
  }

  function updateArrows() {
    clearArrows();
    if (!state || selected < 0 || !interactive) return;
    const piece = PIECES[selected];
    const center = worldPosition(state, selected);
    for (const move of legalMoves(state, selected)) {
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.rotation.y = arrowAngle(move);
      const edgeX = piece.w * CELL / 2 + 0.2;
      const edgeZ = piece.h * CELL / 2 + 0.2;
      arrow.position.set(
        center.x + move.dx * edgeX,
        BOARD_TOP + 0.075,
        center.z + move.dy * edgeZ,
      );
      arrow.scale.setScalar(hintedMove
        && move.piece === hintedMove.piece
        && move.dx === hintedMove.dx
        && move.dy === hintedMove.dy ? 1.26 : 1);
      arrow.userData.move = move;
      arrowGroup.add(arrow);
    }
  }

  function updateSelection() {
    pieceObjects.forEach(({ bodyMaterial, group }, index) => {
      const active = index === selected;
      const hinting = hintedMove?.piece === index;
      bodyMaterial.emissiveIntensity = hinting ? 0.42 : active ? 0.2 : 0;
      group.scale.setScalar(active ? 1.018 : 1);
    });
    updateArrows();
  }

  function selectPiece(index, notify = true) {
    selected = Number.isInteger(index) ? index : -1;
    hintedMove = null;
    updateSelection();
    if (notify) onSelect?.(selected, selected >= 0 ? legalMoves(state, selected) : []);
  }

  function setState(nextState, { preserveSelection = false } = {}) {
    if (tween) {
      const activeTween = tween;
      tween = null;
      clearTimeout(activeTween.timeoutId);
      activeTween.resolve?.(false);
    }
    celebration = null;
    state = nextState.slice();
    if (!preserveSelection) selected = -1;
    hintedMove = null;
    gateMaterial.emissiveIntensity = lessonFocus === 'exit' ? 1.25 : 0.28;
    syncPieces();
    updateSelection();
    updateEmptyMarkers();
  }

  function animateMove(move, nextState, duration = 0.26) {
    if (!state) {
      setState(nextState);
      return Promise.resolve();
    }
    if (tween) return Promise.resolve(false);
    const object = pieceObjects[move.piece].group;
    const from = object.position.clone();
    const to = worldPosition(nextState, move.piece);
    clearArrows();
    if (duration <= 0.02) {
      state = nextState.slice();
      object.position.copy(to);
      syncPieces();
      updateSelection();
      updateEmptyMarkers();
      return Promise.resolve(true);
    }
    return new Promise((resolve) => {
      const activeTween = {
        object,
        move,
        from,
        to,
        nextState: nextState.slice(),
        startedAt: performance.now(),
        duration,
        resolve,
      };
      activeTween.timeoutId = setTimeout(
        () => finishTween(activeTween),
        duration * 1000 + 100,
      );
      tween = activeTween;
    });
  }

  function finishTween(activeTween) {
    if (!activeTween || tween !== activeTween) return;
    clearTimeout(activeTween.timeoutId);
    tween = null;
    state = activeTween.nextState;
    syncPieces();
    updateSelection();
    updateEmptyMarkers();
    activeTween.resolve(true);
  }

  function stepTween(now) {
    if (!tween) return;
    const progress = Math.min(1, (now - tween.startedAt) / 1000 / tween.duration);
    const eased = easeInOut(progress);
    tween.object.position.lerpVectors(tween.from, tween.to, eased);
    tween.object.position.y += Math.sin(progress * Math.PI) * 0.09;
    if (progress < 1) return;
    finishTween(tween);
  }

  function nudgeInvalid(pieceIndex = selected) {
    if (pieceIndex < 0) return;
    const object = pieceObjects[pieceIndex].group;
    shake = { object, origin: object.position.clone(), startedAt: performance.now(), duration: 0.34 };
  }

  function stepShake(now) {
    if (!shake) return;
    const progress = Math.min(1, (now - shake.startedAt) / 1000 / shake.duration);
    shake.object.position.x = shake.origin.x + Math.sin(progress * Math.PI * 7) * (1 - progress) * 0.09;
    if (progress >= 1) {
      shake.object.position.copy(shake.origin);
      shake = null;
    }
  }

  function celebrate() {
    celebration = { startedAt: performance.now(), duration: 1.35, origin: pieceObjects[0].group.position.clone() };
    interactive = false;
    clearArrows();
  }

  function stepCelebration(now) {
    if (!celebration) return;
    const progress = Math.min(1, (now - celebration.startedAt) / 1000 / celebration.duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const cao = pieceObjects[0].group;
    cao.position.z = celebration.origin.z + eased * 0.82;
    cao.position.y = celebration.origin.y + Math.sin(progress * Math.PI) * 0.22;
    gateMaterial.emissiveIntensity = 0.3 + Math.sin(progress * Math.PI) * 1.4;
  }

  function updateEmptyMarkers() {
    emptyGroup.clear();
    if (!state || lessonFocus !== 'empty') return;
    const occupancy = buildOccupancy(state);
    for (let cell = 0; cell < occupancy.length; cell += 1) {
      if (occupancy[cell] !== -1) continue;
      const x = cell % BOARD_COLS;
      const y = Math.floor(cell / BOARD_COLS);
      const marker = new THREE.Mesh(
        new RoundedBoxGeometry(CELL - 0.15, 0.04, CELL - 0.15, 3, 0.06),
        emptyMaterial,
      );
      marker.position.set(
        (x + 0.5 - BOARD_COLS / 2) * CELL,
        BOARD_TOP + 0.035,
        (y + 0.5 - BOARD_ROWS / 2) * CELL,
      );
      emptyGroup.add(marker);
    }
  }

  function setLessonFocus(focus) {
    lessonFocus = focus;
    if (focus === 'empty') {
      selected = -1;
      hintedMove = null;
    } else if (focus === 'cao') {
      selected = 0;
      hintedMove = legalMoves(state, 0)[0] || null;
    } else if (focus === 'guan') {
      selected = 5;
      hintedMove = legalMoves(state, 5)[0] || null;
    } else {
      selected = -1;
      hintedMove = null;
    }
    gateMaterial.emissiveIntensity = focus === 'exit' ? 1.25 : 0.28;
    updateSelection();
    updateEmptyMarkers();
  }

  function setHint(move) {
    if (!move) {
      hintedMove = null;
      updateSelection();
      return;
    }
    selected = move.piece;
    hintedMove = { ...move };
    updateSelection();
    onSelect?.(selected, legalMoves(state, selected));
  }

  function setLanguage(nextLang) {
    lang = nextLang === 'en' ? 'en' : 'zh';
    pieceObjects.forEach(({ labelMaterial }, index) => {
      labelMaterial.map?.dispose();
      labelMaterial.map = makeLabelTexture(PIECES[index], lang);
      labelMaterial.needsUpdate = true;
    });
  }

  function gradientBackground() {
    const canvasBg = Object.assign(document.createElement('canvas'), { width: 32, height: 512 });
    const context = canvasBg.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, cssVar('--scene-a') || '#ead9b9');
    gradient.addColorStop(0.55, cssVar('--scene-b') || '#9b6d4c');
    gradient.addColorStop(1, cssVar('--scene-c') || '#321a17');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 512);
    const texture = new THREE.CanvasTexture(canvasBg);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function applyTheme() {
    if (scene.background?.isTexture) scene.background.dispose();
    scene.background = gradientBackground();
    renderer.toneMappingExposure = parseFloat(cssVar('--scene-exposure')) || 1.08;
  }

  const orbit = {
    theta: 0.18,
    phi: 0.82,
    radius: 9.6,
    targetTheta: 0.18,
    targetPhi: 0.82,
    targetRadius: 9.6,
  };

  function updateFraming() {
    const mobile = innerWidth <= 720;
    const narrow = innerWidth <= 1080;
    const dx = mobile ? 0 : narrow ? 90 : 190;
    const dy = mobile ? Math.min(125, innerHeight * 0.19) : 0;
    camera.clearViewOffset();
    camera.setViewOffset(innerWidth, innerHeight, dx, dy, innerWidth, innerHeight);
  }

  function updateCamera(dt) {
    const factor = Math.min(1, dt * 8);
    orbit.theta += (orbit.targetTheta - orbit.theta) * factor;
    orbit.phi += (orbit.targetPhi - orbit.phi) * factor;
    orbit.radius += (orbit.targetRadius - orbit.radius) * factor;
    const radius = orbit.radius;
    camera.position.set(
      Math.sin(orbit.theta) * Math.sin(orbit.phi) * radius,
      Math.cos(orbit.phi) * radius,
      Math.cos(orbit.theta) * Math.sin(orbit.phi) * radius,
    );
    camera.lookAt(0, 0.25, 0.15);
  }

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
  }

  function pickPiece(event) {
    updatePointer(event);
    const arrowHit = raycaster.intersectObjects(arrowGroup.children, false)[0];
    if (arrowHit?.object.userData.move) return { kind: 'arrow', move: arrowHit.object.userData.move };
    const hit = raycaster.intersectObjects(pickables, false)[0];
    if (hit) return { kind: 'piece', piece: hit.object.userData.pieceIndex };
    return { kind: 'empty' };
  }

  function screenDirection(pieceIndex, move) {
    const rect = canvas.getBoundingClientRect();
    const start = worldPosition(state, pieceIndex).project(camera);
    const nextState = state.slice();
    nextState[pieceIndex * 2] += move.dx;
    nextState[pieceIndex * 2 + 1] += move.dy;
    const end = worldPosition(nextState, pieceIndex).project(camera);
    return new THREE.Vector2(
      (end.x - start.x) * rect.width / 2,
      -(end.y - start.y) * rect.height / 2,
    ).normalize();
  }

  function moveFromDrag(pieceIndex, screenDx, screenDy) {
    const drag = new THREE.Vector2(screenDx, screenDy);
    if (drag.lengthSq() < 220) return null;
    drag.normalize();
    let best = null;
    let bestDot = 0.52;
    for (const move of legalMoves(state, pieceIndex)) {
      const dot = drag.dot(screenDirection(pieceIndex, move));
      if (dot > bestDot) {
        bestDot = dot;
        best = move;
      }
    }
    return best;
  }

  let gesture = null;
  const pointers = new Map();

  function requestMove(move) {
    if (!interactive || tween) return;
    const valid = legalMoves(state, move.piece).some(
      (candidate) => candidate.dx === move.dx && candidate.dy === move.dy,
    );
    if (!valid) {
      nudgeInvalid(move.piece);
      onInvalid?.(move.piece);
      return;
    }
    onMoveRequest?.(move);
  }

  canvas.addEventListener('pointerdown', (event) => {
    onInteract?.();
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    canvas.setPointerCapture(event.pointerId);
    if (pointers.size === 2) {
      const values = [...pointers.values()];
      gesture = {
        kind: 'pinch',
        distance: Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y),
        radius: orbit.targetRadius,
      };
      return;
    }
    if (!interactive || tween) return;
    const hit = pickPiece(event);
    if (hit.kind === 'arrow') {
      gesture = { kind: 'arrow', move: hit.move, startX: event.clientX, startY: event.clientY };
      return;
    }
    if (hit.kind === 'piece') {
      selectPiece(hit.piece);
      gesture = { kind: 'piece', piece: hit.piece, startX: event.clientX, startY: event.clientY };
      return;
    }
    gesture = {
      kind: 'orbit',
      startX: event.clientX,
      startY: event.clientY,
      theta: orbit.targetTheta,
      phi: orbit.targetPhi,
    };
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (gesture?.kind === 'pinch' && pointers.size >= 2) {
      const values = [...pointers.values()];
      const distance = Math.max(1, Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y));
      orbit.targetRadius = THREE.MathUtils.clamp(gesture.radius * gesture.distance / distance, 7.4, 13.2);
      return;
    }
    if (!gesture) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    if (gesture.kind === 'piece') {
      const move = moveFromDrag(gesture.piece, dx, dy);
      if (move) {
        gesture = null;
        requestMove(move);
      }
    } else if (gesture.kind === 'orbit') {
      orbit.targetTheta = THREE.MathUtils.clamp(gesture.theta - dx * 0.004, -0.46, 0.46);
      orbit.targetPhi = THREE.MathUtils.clamp(gesture.phi + dy * 0.003, 0.68, 0.98);
    }
  });

  function finishPointer(event) {
    pointers.delete(event.pointerId);
    if (gesture?.kind === 'arrow') {
      const distance = Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY);
      if (distance < 16) requestMove(gesture.move);
    }
    if (pointers.size === 0) gesture = null;
  }
  canvas.addEventListener('pointerup', finishPointer);
  canvas.addEventListener('pointercancel', finishPointer);

  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    orbit.targetRadius = THREE.MathUtils.clamp(orbit.targetRadius + event.deltaY * 0.006, 7.4, 13.2);
  }, { passive: false });

  function moveSelected(dx, dy) {
    onInteract?.();
    if (selected < 0) {
      onInvalid?.(-1);
      return false;
    }
    const move = { piece: selected, dx, dy };
    const valid = legalMoves(state, selected).some((item) => item.dx === dx && item.dy === dy);
    if (!valid) {
      nudgeInvalid(selected);
      onInvalid?.(selected);
      return false;
    }
    requestMove(move);
    return true;
  }

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, reducedMotion ? 1 : 2));
    renderer.setSize(
      Math.round(innerWidth * renderScale),
      Math.round(innerHeight * renderScale),
      !reducedMotion,
    );
    updateFraming();
  });

  updateFraming();
  applyTheme();

  let running = true;
  let lastFrameAt = -Infinity;
  function frame(now = performance.now()) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (reducedMotion && now - lastFrameAt < 125) return;
    lastFrameAt = now;
    const dt = Math.min(clock.getDelta(), reducedMotion ? 1 / 8 : 1 / 30);
    stepTween(now);
    stepShake(now);
    stepCelebration(now);
    updateCamera(dt);
    const pulse = 0.82 + Math.sin(performance.now() * 0.005) * 0.18;
    arrowMaterial.emissiveIntensity = hintedMove ? 1.25 * pulse : 0.78 * pulse;
    emptyMaterial.emissiveIntensity = 0.38 + 0.22 * pulse;
    renderer.render(scene, camera);
  }
  frame();

  return {
    setState,
    animateMove,
    selectPiece,
    moveSelected,
    setHint,
    setLessonFocus,
    setLanguage,
    applyTheme,
    celebrate,
    nudgeInvalid,
    setInteractive(value) {
      interactive = Boolean(value);
      if (!interactive) clearArrows();
      else updateArrows();
    },
    get selected() { return selected; },
    get state() { return state?.slice() || null; },
    dispose() {
      running = false;
      renderer.dispose();
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.filter(Boolean).forEach((material) => {
          Object.values(material).forEach((value) => value?.isTexture && value.dispose());
          material.dispose?.();
        });
      });
    },
  };
}
