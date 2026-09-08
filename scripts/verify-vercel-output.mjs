import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const root = '.vercel/output';
const manifest = JSON.parse(await readFile(`${root}/config.json`, 'utf8'));
assert.equal(
  manifest.version,
  3,
  'Vercel must receive Build Output API v3 output',
);
assert.ok(
  manifest.routes?.some((route) => route.dest),
  'Page requests need a server route',
);
await access(`${root}/static/assets/optimized/hero-mobile.webp`);
await access(`${root}/static/favicon.png`);
console.log('Vercel routing manifest and public assets are present.');

// Exercise the generated Vercel function, not the development server.
process.env.NODE_ENV = 'production';
const { pathToFileURL } = await import('node:url');
const { resolve } = await import('node:path');
const serverRoute = manifest.routes.find(
  (route) => route.src === '/(.*)' && route.dest,
);
assert.ok(serverRoute, 'All app routes must reach the generated function');
const functionDir = `${root}/functions${serverRoute.dest}.func`;
const runtime = JSON.parse(
  await readFile(`${functionDir}/.vc-config.json`, 'utf8'),
);
const { default: handler } = await import(
  pathToFileURL(resolve(functionDir, runtime.handler)).href
);
assert.equal(typeof handler.fetch, 'function');
const routes = [
  ['/', /good.*design/s, 'text/html'],
  ['/gallery', /Open gallery/i, 'text/html'],
  ['/reviews', /Kind words/i, 'text/html'],
  ['/robots.txt', /Sitemap:/, 'text/plain'],
  ['/sitemap.xml', /<loc>.*\/gallery<\/loc>/, 'xml'],
];
for (const [route, content, contentType] of routes) {
  const response = await handler.fetch(
    new Request(`https://site.test${route}`),
  );
  assert.equal(response.status, 200, `${route} must return 200`);
  assert.ok(
    response.headers.get('content-type')?.includes(contentType),
    `${route} content type`,
  );
  const body = await response.text();
  assert.match(body, content, `${route} must contain the page content`);
  if (contentType === 'text/html') {
    const assets = [
      ...body.matchAll(/(?:src|href)="(\/_next\/static\/[^"?]+)[^"]*"/g),
    ];
    assert.ok(assets.length, `${route} must include hydration assets`);
    for (const [, asset] of assets) await access(`${root}/static${asset}`);
  }
  console.log(`PASS ${route}: 200, expected content, assets present`);
}
const rsc = await handler.fetch(
  new Request('https://site.test/gallery?_rsc', { headers: { RSC: '1' } }),
);
assert.equal(rsc.status, 200);
assert.match(rsc.headers.get('content-type'), /text\/x-component/);
await rsc.text();
const missing = await handler.fetch(
  new Request('https://site.test/does-not-exist'),
);
assert.equal(
  missing.status,
  404,
  'Unknown routes must remain real 404 responses',
);
await missing.text();
console.log('PASS client navigation payload and unknown-route handling');
