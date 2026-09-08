import assert from 'node:assert/strict';
import { test } from 'node:test';
import { observeScrollScene } from '../lib/scroll-scene.ts';

test('scroll bursts use cached geometry; mobile chrome, resize and tab restore settle correctly', (t) => {
  const page = new EventTarget();
  page.scrollY = 0;
  const doc = new EventTarget();
  doc.hidden = false;
  doc.body = {};
  let pending = new Map();
  let id = 0;
  let observer;
  const originals = new Map();
  const install = (key, value) => {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  };
  install('window', page);
  install('document', doc);
  install('requestAnimationFrame', (cb) => {
    pending.set(++id, cb);
    return id;
  });
  install('cancelAnimationFrame', (key) => pending.delete(key));
  install(
    'ResizeObserver',
    class {
      constructor(callback) {
        observer = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  t.after(() => {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  const flush = () => {
    const callbacks = [...pending.values()];
    pending.clear();
    callbacks.forEach((callback) => callback());
  };
  let reads = 0;
  const stage = { clientWidth: 390, clientHeight: 700 };
  const section = {
    offsetHeight: 2800,
    getBoundingClientRect: () => {
      reads++;
      return { top: 1000 - page.scrollY };
    },
  };
  const samples = [];
  const stop = observeScrollScene(section, stage, (sample) =>
    samples.push(sample),
  );
  flush();
  assert.equal(samples[0].travel, 2100);
  assert.equal(samples[0].snap, true);
  for (let i = 0; i < 20; i++) {
    page.scrollY = 1100 + i;
    page.dispatchEvent(new Event('scroll'));
  }
  assert.equal(pending.size, 1, 'coalesce wheel/touch events within a frame');
  flush();
  assert.equal(reads, 1, 'ordinary scroll must not force a layout read');
  assert.equal(samples.at(-1).top, -119);
  assert.equal(samples.at(-1).snap, false);
  page.dispatchEvent(new Event('resize'));
  flush();
  assert.equal(
    samples.at(-1).snap,
    false,
    'browser chrome alone must not snap a stable scene',
  );
  stage.clientWidth = 844;
  stage.clientHeight = 390;
  observer();
  flush();
  assert.equal(samples.at(-1).travel, 2410);
  assert.equal(samples.at(-1).snap, true);
  page.dispatchEvent(new Event('scroll'));
  doc.hidden = true;
  doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(pending.size, 0);
  doc.hidden = false;
  page.scrollY = 2000;
  doc.dispatchEvent(new Event('visibilitychange'));
  flush();
  assert.equal(samples.at(-1).top, -1000);
  assert.equal(samples.at(-1).snap, true);
  stop();
  page.dispatchEvent(new Event('scroll'));
  assert.equal(pending.size, 0);
});
