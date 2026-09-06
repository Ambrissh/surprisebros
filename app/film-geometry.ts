/** One arc-length coordinate system for the film, frames, holes and camera. */
type Point = { x: number; y: number };
type Sample = Point & { distance: number };
type Curve = [Point, Point, Point, Point];

export const FILM_JOIN = { x: 1671, y: 472 };
export const FILM_HALF_WIDTH = 171;
export const FILM_FRAME_COUNT = 12;
const extensionFrameCount = FILM_FRAME_COUNT - 6;

const curves: Curve[] = [
  [FILM_JOIN, { x: 2180, y: 472 }, { x: 2240, y: 1100 }, { x: 1700, y: 1320 }],
  [
    { x: 1700, y: 1320 },
    { x: 1376, y: 1452 },
    { x: 1190, y: 1640 },
    { x: 1190, y: 2100 },
  ],
];

function cubic(curve: Curve, t: number): Point {
  const u = 1 - t;
  return {
    x:
      u ** 3 * curve[0].x +
      3 * u ** 2 * t * curve[1].x +
      3 * u * t ** 2 * curve[2].x +
      t ** 3 * curve[3].x,
    y:
      u ** 3 * curve[0].y +
      3 * u ** 2 * t * curve[1].y +
      3 * u * t ** 2 * curve[2].y +
      t ** 3 * curve[3].y,
  };
}

const samples: Sample[] = [{ ...FILM_JOIN, distance: 0 }];
for (const curve of curves) {
  for (let index = 1; index <= 240; index++) {
    const point = cubic(curve, index / 240);
    const previous = samples[samples.length - 1];
    samples.push({
      ...point,
      distance:
        previous.distance +
        Math.hypot(point.x - previous.x, point.y - previous.y),
    });
  }
}

// Fixed precision also keeps SVG attributes identical in Safari and the server.
const precision = (value: number) => Math.round(value * 1000) / 1000;
export const FILM_LENGTH = precision(samples[samples.length - 1].distance);
export const FILM_SPINE = `M ${FILM_JOIN.x} ${FILM_JOIN.y} ${curves
  .map(
    (curve) =>
      `C ${curve
        .slice(1)
        .map((point) => `${point.x} ${point.y}`)
        .join(' ')}`,
  )
  .join(' ')}`;
export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);
export const smoothstep = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export function filmPoint(distance: number): Point {
  const target = clamp(distance, 0, FILM_LENGTH);
  let low = 0;
  let high = samples.length - 1;
  while (low + 1 < high) {
    const middle = Math.floor((low + high) / 2);
    if (samples[middle].distance < target) low = middle;
    else high = middle;
  }
  const a = samples[low];
  const b = samples[high];
  const t = (target - a.distance) / Math.max(b.distance - a.distance, 0.001);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function filmPose(distance: number, offset = 0) {
  const point = filmPoint(distance);
  const a = filmPoint(distance - 1);
  const b = filmPoint(distance + 1);
  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  return {
    x: precision(point.x - Math.sin(angle) * offset),
    y: precision(point.y + Math.cos(angle) * offset),
    angle: precision((angle * 180) / Math.PI),
  };
}

export function filmBand(
  start: number,
  end: number,
  low: number,
  high: number,
) {
  const count = Math.max(2, Math.ceil((end - start) / 7));
  const sides = [low, high].map((offset) =>
    Array.from({ length: count + 1 }, (_, index) => {
      const point = filmPose(start + ((end - start) * index) / count, offset);
      return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
    }),
  );
  return `M ${sides[0].join(' L ')} L ${sides[1].reverse().join(' L ')} Z`;
}

export const FILM_EXTENSION_FRAMES = Array.from(
  { length: extensionFrameCount },
  (_, index) => {
    const pitch = (FILM_LENGTH - 170) / extensionFrameCount;
    const start = index * pitch + 7;
    const end = (index + 1) * pitch - 7;
    const pose = filmPose((start + end) / 2);
    const radians = (pose.angle * Math.PI) / 180;
    const corners = Array.from({ length: 41 }, (_, sample) =>
      [-131, 131].map((offset) => {
        const point = filmPose(start + ((end - start) * sample) / 40, offset);
        const dx = point.x - pose.x;
        const dy = point.y - pose.y;
        return {
          x: dx * Math.cos(radians) + dy * Math.sin(radians),
          y: -dx * Math.sin(radians) + dy * Math.cos(radians),
        };
      }),
    ).flat();
    const left = Math.min(...corners.map((point) => point.x)) - 2;
    const top = Math.min(...corners.map((point) => point.y)) - 2;
    const right = Math.max(...corners.map((point) => point.x)) + 2;
    const bottom = Math.max(...corners.map((point) => point.y)) + 2;
    return {
      number: index + 7,
      start,
      end,
      pose,
      image: {
        x: precision(pose.x + left),
        y: precision(pose.y + top),
        width: precision(right - left),
        height: precision(bottom - top),
      },
      clip: filmBand(start, end, -131, 131),
    };
  },
);

export const FILM_HOLES = Array.from(
  { length: Math.floor(FILM_LENGTH / 31) },
  (_, index) => [-153, 153].map((offset) => filmPose(index * 31 + 17, offset)),
).flat();

export function filmCamera(progress: number, width: number, height: number) {
  const viewWidth = width < 600 ? 840 : width < 1000 ? 1300 : 1780;
  const viewHeight = (viewWidth * height) / width;
  const initialX = width < 600 ? 420 : 836;
  const leadIn = FILM_JOIN.x - initialX;
  const distance = clamp(progress) * (leadIn + FILM_LENGTH);
  const point =
    distance < leadIn
      ? { x: initialX + distance, y: FILM_JOIN.y }
      : filmPoint(distance - leadIn);
  // Let the final tip settle at the lower-right, directly above the cake scene.
  const settling = smoothstep((progress - 0.78) / 0.22);
  const x = point.x - viewWidth * 0.23 * settling;
  const y = point.y - viewHeight * 0.3 * settling;
  return {
    viewBox: `${x - viewWidth / 2} ${y - viewHeight / 2} ${viewWidth} ${viewHeight}`,
    reveal: clamp(distance - leadIn + viewWidth * 0.65, 0, FILM_LENGTH),
    frame:
      distance < leadIn
        ? Math.round(1 + (distance / leadIn) * 5)
        : Math.min(
            FILM_FRAME_COUNT,
            7 +
              Math.floor(
                ((distance - leadIn) / FILM_LENGTH) * extensionFrameCount,
              ),
          ),
    settling,
  };
}
