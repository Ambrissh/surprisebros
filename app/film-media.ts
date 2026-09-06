export type FilmMediaSlot = {
  id: string;
  label: string;
  kind: 'photo' | 'reel';
  /** Photo URL, or the original reel/video link. Null keeps the sample placeholder. */
  source: string | null;
  /** Lightweight cover shown while scrolling. Null preserves the opening reference frame. */
  poster: string | null;
  /** SVG alignment controls the crop without stretching the media. */
  alignment?: 'xMinYMid' | 'xMidYMid' | 'xMaxYMid' | 'xMidYMin';
};

// Replace source/poster here when the final photos and reel links arrive.
// Reel players are never mounted into the moving strip: their cover stays in
// the frame and the original reel opens only when selected.
export const filmMediaSlots: FilmMediaSlot[] = [
  {
    id: '01',
    label: 'Wedding stage',
    kind: 'photo',
    source: null,
    poster: null,
  },
  {
    id: '02',
    label: 'Couple portrait',
    kind: 'reel',
    source: null,
    poster: null,
  },
  {
    id: '03',
    label: 'Reception details',
    kind: 'photo',
    source: null,
    poster: null,
  },
  { id: '04', label: 'Celebration', kind: 'reel', source: null, poster: null },
  {
    id: '05',
    label: 'Floral styling',
    kind: 'photo',
    source: null,
    poster: null,
  },
  {
    id: '06',
    label: 'Wedding aisle',
    kind: 'photo',
    source: null,
    poster: null,
  },
  {
    id: '07',
    label: 'Marigold moments',
    kind: 'photo',
    source: null,
    poster: '/assets/gallery/optimized/moment-09-1280.jpg',
  },
  {
    id: '08',
    label: 'A beautiful beginning',
    kind: 'reel',
    source: null,
    poster: '/assets/gallery/optimized/moment-02-1280.jpg',
  },
  {
    id: '09',
    label: 'Made for you',
    kind: 'photo',
    source: null,
    poster: '/assets/gallery/optimized/moment-03-1280.jpg',
  },
  {
    id: '10',
    label: 'A little magic',
    kind: 'photo',
    source: null,
    poster: '/assets/gallery/optimized/moment-07-1280.jpg',
  },
  {
    id: '11',
    label: 'Beautifully personal',
    kind: 'reel',
    source: null,
    poster: '/assets/gallery/optimized/moment-17-1280.jpg',
  },
  {
    id: '12',
    label: 'A night to remember',
    kind: 'photo',
    source: null,
    poster: '/assets/gallery/optimized/moment-28-1280.jpg',
  },
];

function mediaUrl(value: string | null) {
  return value && /^(https?:\/\/|\/(?!\/))/.test(value) ? value : null;
}

export function filmMediaPresentation(slot: FilmMediaSlot) {
  const source = mediaUrl(slot.source);
  return {
    ready: Boolean(source),
    image:
      slot.kind === 'photo'
        ? (source ?? mediaUrl(slot.poster))
        : mediaUrl(slot.poster),
    href: slot.kind === 'reel' ? source : null,
    preserveAspectRatio: `${slot.alignment ?? 'xMidYMid'} slice`,
    label: `${slot.label}${source ? '' : ` — ${slot.kind} placeholder`}`,
  };
}
