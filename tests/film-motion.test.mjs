import assert from 'node:assert/strict';
import { test } from 'node:test';
import { advanceFilmProgress } from '../app/film-motion.ts';
import { filmCamera } from '../app/film-geometry.ts';

await test('a coarse wheel step glides instead of jumping the full camera distance', () => {
  const current = 0.36;
  const target = 0.43;
  const progress = advanceFilmProgress(current, target, 1000 / 60, { velocity: 0 });
  const origin = filmCamera(current, 1440, 900).viewBox.split(' ').map(Number);
  const raw = filmCamera(target, 1440, 900).viewBox.split(' ').map(Number);
  const eased = filmCamera(progress, 1440, 900).viewBox.split(' ').map(Number);
  const fullJump = Math.hypot(raw[0] - origin[0], raw[1] - origin[1]);
  const firstStep = Math.hypot(eased[0] - origin[0], eased[1] - origin[1]);
  assert.ok(
    firstStep > 0 && firstStep < fullJump * 0.25,
    `First frame moved ${firstStep.toFixed(1)} of ${fullJump.toFixed(1)} units`,
  );
});

await test('motion converges without overshoot or bounce in either direction', () => {
  for (const [start, target] of [
    [0.1, 0.8],
    [0.8, 0.1],
    [0.9, 1],
    [0.1, 0],
  ]) {
    let progress = start;
    const motion = { velocity: 0 };
    for (let step = 0; step < 120; step++) {
      const next = advanceFilmProgress(progress, target, 1000 / 60, motion);
      assert.ok(
        next >= Math.min(progress, target) &&
          next <= Math.max(progress, target),
      );
      progress = next;
    }
    assert.equal(progress, target);
  }
});

await test('response speed stays consistent on 30, 60 and 120 Hz displays', () => {
  const results = [30, 60, 120].map((fps) => {
    let progress = 0.2;
    const motion = { velocity: 0 };
    for (let step = 0; step < fps / 2; step++) {
      progress = advanceFilmProgress(progress, 0.7, 1000 / fps, motion);
    }
    return progress;
  });
  assert.ok(Math.max(...results) - Math.min(...results) < 0.00001);
});

await test('a wheel notch builds speed gently instead of starting at peak speed', () => {
  const motion = { velocity: 0 };
  const start = 0.36;
  const target = 0.43;
  const first = advanceFilmProgress(start, target, 1000 / 60, motion);
  const second = advanceFilmProgress(first, target, 1000 / 60, motion);
  assert.ok(first - start < second - first, 'The first frame should ease into motion');
  assert.ok(first - start < (target - start) * 0.08);
});
