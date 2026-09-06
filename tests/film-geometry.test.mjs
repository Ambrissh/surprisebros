import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  FILM_EXTENSION_FRAMES,
  FILM_FRAME_COUNT,
  FILM_JOIN,
  FILM_LENGTH,
  filmCamera,
  filmPoint,
  filmPose,
} from '../app/film-geometry.ts';

await test('the shorter strip starts at the reel edge and has 12 total frames', () => {
  assert.deepEqual(filmPoint(0), FILM_JOIN);
  assert.ok(Math.abs(filmPose(0).angle) < 0.5);
  assert.equal(FILM_EXTENSION_FRAMES.length + 6, FILM_FRAME_COUNT);
  assert.equal(FILM_FRAME_COUNT, 12);
  assert.ok(FILM_LENGTH < 2600);
});

await test('every curved window stays covered by its photo, including tight bends', () => {
  for (const frame of FILM_EXTENSION_FRAMES) {
    const radians = (frame.pose.angle * Math.PI) / 180;
    for (let step = 0; step <= 100; step++) {
      for (const offset of [-131, 131]) {
        const point = filmPose(
          frame.start + ((frame.end - frame.start) * step) / 100,
          offset,
        );
        const dx = point.x - frame.pose.x;
        const dy = point.y - frame.pose.y;
        const x =
          frame.pose.x + dx * Math.cos(radians) + dy * Math.sin(radians);
        const y =
          frame.pose.y - dx * Math.sin(radians) + dy * Math.cos(radians);
        assert.ok(x >= frame.image.x && x <= frame.image.x + frame.image.width);
        assert.ok(
          y >= frame.image.y && y <= frame.image.y + frame.image.height,
        );
      }
    }
  }
});

await test('camera follows one continuous path and reaches the complete film at every viewport', () => {
  for (const [width, height] of [
    [1440, 900],
    [1920, 1080],
    [390, 844],
    [820, 1180],
    [844, 390],
  ]) {
    let previous = filmCamera(0, width, height);
    for (let step = 1; step <= 1000; step++) {
      const camera = filmCamera(step / 1000, width, height);
      const box = camera.viewBox.split(' ').map(Number);
      const before = previous.viewBox.split(' ').map(Number);
      assert.ok(box.every(Number.isFinite));
      assert.ok(Math.hypot(box[0] - before[0], box[1] - before[1]) < 20);
      assert.ok(camera.reveal >= previous.reveal);
      assert.ok(camera.frame >= previous.frame);
      previous = camera;
    }
    assert.equal(previous.frame, FILM_FRAME_COUNT);
    assert.equal(previous.reveal, FILM_LENGTH);
    assert.equal(previous.settling, 1);
  }
});
