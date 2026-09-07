import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const supplied = [
  [
    'afe56a04-9ade-4338-889d-6320da65c7a5',
    'Black and gold Boss Baby birthday decorations with stacked gift cases',
  ],
  [
    'da3e5a54-f64c-4ae7-986d-cf74adec303e',
    'Ivory wedding stage with pink and white flowers and a beige loveseat',
  ],
  [
    'a1e6779e-05d7-4701-a31f-8afb90fbf54f',
    'Blue and silver first birthday stage with a crown cake',
  ],
  [
    '47ac06c9-d8fb-4cf8-834b-a248f6a20952',
    'White draped entrance with hanging flowers and warm pendant lights',
  ],
  [
    '3c408156-851c-4e6d-893f-4c588f24a9ff',
    'Pink fairy birthday decorations with butterflies and a tiered cake',
  ],
  [
    'cf9598eb-f763-40ee-b261-d4f8fd350f07',
    'White draped wedding stage with floral arrangements and a mauve sofa',
  ],
  [
    'e905cf23-0d43-46a9-a161-5ba78a6a0f46',
    'Pastel cartoon birthday stage with a gold sequin backdrop',
  ],
  [
    '9e8dc406-e1ba-4797-b8d3-d382eb980edd',
    'Blue and white baptism and birthday decorations with gold balloons',
  ],
  [
    'f62a9ce5-c911-461f-bd5d-dfd20a49a6fc',
    'Red rose petals and warm candle lights arranged on a celebration table',
  ],
  [
    'b8d2b6d0-95e2-4049-8231-fc8db555650d',
    'Pink and blue cake pops on a gold display stand',
  ],
  [
    'a25e0153-7037-46db-bb58-045b33d0e595',
    'Traditional ceremony stage with a temple illustration and floral canopy',
  ],
  [
    '7ea8f9e0-4501-408d-a4c5-7cca4f5a0a42',
    'Purple butterfly first birthday stage with floral cake pedestals',
  ],
  [
    '1cd9cc88-4cd3-4178-81df-d77b7a58abf9',
    'Teddy bear birthday backdrop with blue and silver balloons',
  ],
  [
    '51849d65-02a8-461c-9848-58953c46e722',
    'Doctor-themed blue birthday cake surrounded by red rose petals',
  ],
  [
    'a97aa184-e387-4858-8bd8-830281425c09',
    'Amber-lit celebration stage with drapes, white flowers and string lights',
  ],
  [
    '47855fc0-25ca-4607-839a-8827c1575150',
    'Blue Boss Baby cupcakes on a three-tier birthday display',
  ],
  [
    '09e9effd-9b0f-4a2e-870c-87b925b5223b',
    'Yellow glazed birthday cake with chocolate decorations',
  ],
  [
    'dab946c7-a7e3-45c7-95c1-84a7d9d9c81c',
    'Intimate birthday dinner setup with hanging white flowers and a teddy bear',
  ],
  [
    'deae617b-48df-4747-9e4e-99425c9d9b31',
    'Pink and lavender butterfly birthday stage with a silver sequin wall',
  ],
  [
    '10fe1cf7-a1d6-4afb-9305-208293a71bd1',
    'Traditional red and gold event backdrop with a carved wooden seat',
  ],
  [
    '7bbf65e3-6055-4e2d-9c7b-d51a4f4b9566',
    'Traditional floral stage with jasmine garlands and brass lamps',
  ],
  [
    'e60ca627-88b4-41c1-8a59-9b6488a3908b',
    'Lavender butterfly birthday stage prepared for photography',
  ],
  [
    '78bb8033-8bee-4fac-8723-32047ee4c3de',
    'Chocolate bouquet wrapped in red paper',
  ],
  [
    '810d94a2-d8d6-4c79-9c87-3923671a1c84',
    'Purple and gold first birthday decor with illuminated arches',
  ],
  [
    'cd08a155-6b26-4dde-85f2-a9364c01d6eb',
    'Small photograph of a purple and white decorated event stage',
  ],
  [
    'a00cd4b5-b454-46ed-97a3-591c75aba7d1',
    'Small birthday photograph of a child in a red toy car',
  ],
  [
    '3fd34235-a553-4292-91bb-43f1bf49327f',
    'Pink butterfly birthday backdrop with flowers and a gold display wheel',
  ],
  [
    '4691d11c-d361-4ab0-bcce-6321f136bf83',
    'Pink and gold butterfly birthday decorations in a celebration hall',
  ],
  [
    '735d9a7d-14c2-47b7-9e7d-d4ec0d1664e8',
    'Red wedding car decorated with white and pink flowers',
  ],
  [
    'd122060e-c1ed-41ee-ba13-bb26a93269e3',
    'Rooftop event seating with white chair covers and red table linens',
  ],
];

if (!process.argv[2])
  throw new Error(
    'Provide the directory containing the 30 supplied clipboard photos.',
  );
await mkdir('public/assets/native', { recursive: true });
const photos = [];
for (const [index, [id, alt]] of supplied.entries()) {
  const src = `/assets/native/celebration-${String(index + 1).padStart(2, '0')}.webp`;
  const { width, height } = await sharp(
    path.join(process.argv[2], `codex-clipboard-${id}.png`),
  )
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 88, effort: 6 })
    .toFile(`public${src}`);
  photos.push({
    src,
    alt,
    width,
    height,
    thumbnail: width < 300,
    source: `User attachment ${index + 1}, 2026-09-07`,
  });
}
await writeFile(
  'lib/native-photos.json',
  `${JSON.stringify(photos, null, 2)}\n`,
);
console.log(`Imported ${photos.length} client photos without upscaling.`);
