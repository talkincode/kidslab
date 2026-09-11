/**
 * Viewport resize planner for the ice-maker WebGL canvas.
 * Keep this DOM-free so ResizeObserver/setSize loops can be unit-tested.
 */

export function planViewportResize(previous, viewport) {
  const width = Math.max(1, Math.round(Number(viewport?.width) || 0));
  const height = Math.max(1, Math.round(Number(viewport?.height) || 0));
  if (previous && previous.width === width && previous.height === height) {
    return { apply: false, width, height };
  }
  return { apply: true, width, height };
}

export function cameraFovForAspect(aspect) {
  const value = Number(aspect);
  if (!Number.isFinite(value) || value <= 0) return 34;
  if (value < 0.85) return 52;
  if (value < 1.15) return 42;
  return 34;
}
