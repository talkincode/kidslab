/**
 * DOM-free orbit camera for the ice-maker lab.
 * User zoom/orbit must write both the live value and the lerp goal, otherwise
 * the animation loop snaps the scene back to the last named view.
 */

export const RADIUS_MIN = 2.4;
export const RADIUS_MAX = 7.2;
export const ELEV_MIN = 0.18;
export const ELEV_MAX = 1.15;
export const LERP_RATE = 2.4;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function finite(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function point(value, fallback) {
  return {
    x: finite(value?.x, fallback.x),
    y: finite(value?.y, fallback.y),
    z: finite(value?.z, fallback.z),
  };
}

export function createOrbit(view) {
  const yaw = finite(view?.yaw, 0.62);
  const elevation = clamp(finite(view?.elevation, 0.42), ELEV_MIN, ELEV_MAX);
  const radius = clamp(finite(view?.radius, 4.15), RADIUS_MIN, RADIUS_MAX);
  const target = point(view?.target, { x: 0.15, y: 0.82, z: 0 });
  return {
    yaw,
    elevation,
    radius,
    target,
    goalYaw: yaw,
    goalElevation: elevation,
    goalRadius: radius,
    goalTarget: { ...target },
  };
}

export function applyWheelZoom(orbit, deltaY) {
  const dy = finite(deltaY, 0);
  const factor = Math.exp(clamp(dy, -80, 80) * 0.002);
  const radius = clamp(orbit.radius * factor, RADIUS_MIN, RADIUS_MAX);
  return { ...orbit, radius, goalRadius: radius };
}

export function applyOrbitDrag(orbit, dx, dy) {
  const yaw = orbit.yaw - finite(dx, 0) * 0.007;
  const elevation = clamp(orbit.elevation + finite(dy, 0) * 0.005, ELEV_MIN, ELEV_MAX);
  return {
    ...orbit,
    yaw,
    elevation,
    goalYaw: yaw,
    goalElevation: elevation,
  };
}

export function applyPinchZoom(orbit, previousDistance, nextDistance) {
  const prev = finite(previousDistance, 0);
  const next = finite(nextDistance, 0);
  if (!(prev > 0) || !(next > 0)) return orbit;
  const radius = clamp(orbit.radius * (prev / next), RADIUS_MIN, RADIUS_MAX);
  return { ...orbit, radius, goalRadius: radius };
}

export function setOrbitGoal(orbit, view) {
  const yaw = finite(view?.yaw, orbit.goalYaw);
  const elevation = clamp(finite(view?.elevation, orbit.goalElevation), ELEV_MIN, ELEV_MAX);
  const radius = clamp(finite(view?.radius, orbit.goalRadius), RADIUS_MIN, RADIUS_MAX);
  const goalTarget = point(view?.target, orbit.goalTarget);
  return {
    ...orbit,
    goalYaw: yaw,
    goalElevation: elevation,
    goalRadius: radius,
    goalTarget,
  };
}

export function tickOrbit(orbit, dt) {
  const k = Math.min(1, Math.max(0, finite(dt, 0)) * LERP_RATE);
  const lerp = (from, to) => from + (to - from) * k;
  return {
    ...orbit,
    yaw: lerp(orbit.yaw, orbit.goalYaw),
    elevation: lerp(orbit.elevation, orbit.goalElevation),
    radius: lerp(orbit.radius, orbit.goalRadius),
    target: {
      x: lerp(orbit.target.x, orbit.goalTarget.x),
      y: lerp(orbit.target.y, orbit.goalTarget.y),
      z: lerp(orbit.target.z, orbit.goalTarget.z),
    },
  };
}
