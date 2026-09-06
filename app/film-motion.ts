/** Scroll response shared by the animation loop and its input-replay tests. */
export function advanceFilmProgress(
  current: number,
  target: number,
  elapsedMs: number,
) {
  const destination = Math.min(1, Math.max(0, target));
  // Time-based damping: the same gentle response on mouse, trackpad and touch,
  // without intercepting native scrolling or leaving a permanent animation loop.
  const blend = -Math.expm1(-Math.min(64, Math.max(0, elapsedMs)) / 105);
  const next = current + (destination - current) * blend;
  return Math.abs(destination - next) < 0.00002 ? destination : next;
}
