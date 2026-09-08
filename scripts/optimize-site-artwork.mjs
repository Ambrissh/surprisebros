import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';

const assets = [
  ['surprise-bros-final-stage-v6', 1920],
  ['surprise-bros-final-stage-v6', 960, 'hero-mobile'],
  ['maroon-satin-curtain-v2', 1280],
  ['film-roll-reference-composite', 1672],
  ['surprise-bros-logo', 264],
  ['celebration-cake-gift', 460],
  ['reviews/balloon-wine', 460],
  ['reviews/balloon-pearl', 460],
  ['reviews/balloon-champagne', 460],
  ['reviews/burgundy-satin-ribbon', 740],
  ['reviews/christmas-wreath-premium', 600],
];
await mkdir('public/assets/optimized', { recursive: true });
let before = 0;
let after = 0;
for (const [name, width, alias] of assets) {
  const source = `public/assets/${name}.png`;
  const target = `public/assets/optimized/${alias ?? name.split('/').at(-1)}.webp`;
  await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 88, effort: 6 })
    .toFile(target);
  before += (await stat(source)).size;
  after += (await stat(target)).size;
}
console.log(
  `Artwork variants: ${(before / 1048576).toFixed(2)} MiB → ${(after / 1048576).toFixed(2)} MiB`,
);
