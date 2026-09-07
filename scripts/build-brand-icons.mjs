import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const logo = 'public/assets/surprise-bros-logo.png';
for (const [name, size] of [
  ['favicon.png', 96],
  ['apple-touch-icon.png', 180],
]) {
  await sharp(logo)
    .trim()
    .resize(size, size, { fit: 'contain', background: '#ffffff' })
    .png()
    .toFile(`public/${name}`);
}
const png = await sharp(logo)
  .trim()
  .resize(48, 48, { fit: 'contain', background: '#ffffff' })
  .png()
  .toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 48;
header[7] = 48;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([header, png]));
await writeFile(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><image width="48" height="48" href="data:image/png;base64,${png.toString('base64')}"/></svg>\n`,
);
console.log(
  'Brand favicon and Apple touch icon created from the supplied logo.',
);
