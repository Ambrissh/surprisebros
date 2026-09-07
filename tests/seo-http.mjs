import assert from 'node:assert/strict';
import photos from '../lib/native-photos.json' with { type: 'json' };

const origin = process.argv[2] || 'http://127.0.0.1:3001';
const titles = new Set();
for (const route of ['/', '/gallery', '/reviews']) {
  const response = await fetch(`${origin}${route}`);
  assert.equal(response.status, 200, route);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && title.includes('Surprise'), `${route} title`);
  titles.add(title);
  assert.match(html, /name="description"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /favicon\.png/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /<h1[\s>]/);
  if (route === '/gallery') {
    for (const photo of photos)
      assert.ok(html.includes(photo.src), `Gallery missing ${photo.src}`);
    assert.doesNotMatch(html, /assets\/gallery\/optimized\/moment-/);
  }
  console.log(
    `${route}: searchable metadata, heading, logo icon and business data verified`,
  );
}
assert.equal(titles.size, 3);
for (const route of [
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  ...photos.map((photo) => photo.src),
]) {
  const response = await fetch(`${origin}${route}`);
  assert.equal(response.status, 200, route);
  if (route === '/robots.txt')
    assert.match(await response.text(), /Sitemap: https:\/\/.+\/sitemap.xml/);
  if (route === '/sitemap.xml') {
    const xml = await response.text();
    assert.equal((xml.match(/<loc>/g) || []).length, 3);
  }
}
assert.equal((await fetch(`${origin}/page-that-does-not-exist`)).status, 404);
console.log(
  'All 30 photos, favicon formats, robots, sitemap and 404 response verified.',
);
