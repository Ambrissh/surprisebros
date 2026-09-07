import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  albumReducer as reduce,
  initialAlbumState,
} from '../app/gallery/album-state.mjs';

await test('rapid repeated clicks never interrupt an opening or turning page', () => {
  let state = reduce(initialAlbumState, { type: 'open' });
  assert.equal(
    reduce(state, { type: 'turn', to: 1, count: 8, direction: 1 }),
    state,
  );
  state = reduce(state, { type: 'settled', revision: state.revision });
  state = reduce(state, { type: 'turn', to: 1, count: 8, direction: 1 });
  for (let i = 0; i < 100; i++) {
    assert.equal(
      reduce(state, { type: 'turn', to: 2, count: 8, direction: 1 }),
      state,
    );
    assert.equal(reduce(state, { type: 'close' }), state);
  }
  assert.deepEqual(state.turn, { from: 0, to: 1, direction: 1 });
});

await test('all eight spreads, including the final two photos, can be reached and reversed', () => {
  let state = reduce(initialAlbumState, { type: 'open' });
  state = reduce(state, { type: 'settled', revision: state.revision });
  for (const to of [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0]) {
    state = reduce(state, {
      type: 'turn',
      to,
      count: 8,
      direction: to > state.spread ? 1 : -1,
    });
    assert.equal(state.spread, to);
    assert.equal(state.phase, 'turning');
    state = reduce(state, { type: 'settled', revision: state.revision });
    assert.equal(state.turn, null);
  }
  assert.equal(
    reduce(state, { type: 'turn', to: 8, count: 8, direction: 1 }),
    state,
  );
});

await test('stale animation completions cannot finish a newer transition; closing resets the cover', () => {
  let state = reduce(initialAlbumState, { type: 'open' });
  state = reduce(state, { type: 'settled', revision: state.revision });
  state = reduce(state, { type: 'close' });
  assert.equal(
    reduce(state, { type: 'settled', revision: state.revision - 1 }),
    state,
  );
  state = reduce(state, { type: 'settled', revision: state.revision });
  assert.equal(state.phase, 'closed');
  assert.equal(state.spread, 0);
});
