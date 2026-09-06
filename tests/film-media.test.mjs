import assert from 'node:assert/strict';
import { test } from 'node:test';
import { filmMediaSlots, filmMediaPresentation } from '../app/film-media.ts';
import { FILM_FRAME_COUNT } from '../app/film-geometry.ts';

await test('every film frame has an independently replaceable photo or reel slot', () => {
  assert.equal(filmMediaSlots.length, FILM_FRAME_COUNT);
  assert.equal(
    new Set(filmMediaSlots.map((slot) => slot.id)).size,
    FILM_FRAME_COUNT,
  );
  assert.ok(filmMediaSlots.some((slot) => slot.kind === 'reel'));
  assert.ok(filmMediaSlots.some((slot) => slot.kind === 'photo'));
  for (const slot of filmMediaSlots) {
    assert.equal(filmMediaPresentation(slot).href, null);
    assert.match(filmMediaPresentation(slot).label, /placeholder/);
  }
});

await test('photos replace the preview without stretching the frame', () => {
  const view = filmMediaPresentation({
    ...filmMediaSlots[0],
    source: '/assets/photo.jpg',
    alignment: 'xMidYMin',
  });
  assert.equal(view.image, '/assets/photo.jpg');
  assert.equal(view.preserveAspectRatio, 'xMidYMin slice');
  assert.equal(view.href, null);
});

await test('a reel keeps its lightweight poster in the film and only exposes an on-demand link', () => {
  const view = filmMediaPresentation({
    ...filmMediaSlots[7],
    source: 'https://example.com/reel/1',
  });
  assert.equal(view.image, filmMediaSlots[7].poster);
  assert.equal(view.href, 'https://example.com/reel/1');
  assert.doesNotMatch(view.label, /placeholder/);
});

await test('invalid reel URLs never become clickable', () => {
  const view = filmMediaPresentation({
    ...filmMediaSlots[7],
    source: 'javascript:alert(1)',
  });
  assert.equal(view.href, null);
});
