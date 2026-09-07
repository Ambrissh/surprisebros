/** Scroll response shared by the animation loop and its input-replay tests. */
export function advanceFilmProgress(
  current: number,
  target: number,
  elapsedMs: number,
  motion: { velocity: number },
) {
  const destination = Math.min(1, Math.max(0, target));
  // Exact critically damped response preserves velocity between scroll events.
  // It eases into wheel steps and settles without bouncing at any refresh rate.
  const seconds = Math.min(64, Math.max(0, elapsedMs)) / 1000;
  const frequency = 22;
  const offset = current - destination;
  const decay = Math.exp(-frequency * seconds);
  const impulse = motion.velocity + frequency * offset;
  const next = destination + (offset + impulse * seconds) * decay;
  motion.velocity = (motion.velocity - frequency * impulse * seconds) * decay;

  if (
    (Math.abs(destination - next) < 0.00002 && Math.abs(motion.velocity) < 0.0005) ||
    next < 0 || next > 1
  ) {
    motion.velocity = 0;
    return destination;
  }
  return next;
}
