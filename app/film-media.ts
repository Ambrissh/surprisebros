import nativePhotos from '../lib/native-photos.json' with { type: 'json' };

export type FilmMediaSlot = {
  id: string;
  label: string;
  kind: 'photo' | 'reel';
  /** Photo URL, or the original reel/video link. Null keeps the sample placeholder. */
  source: string | null;
  /** Lightweight cover shown while scrolling, including for future video links. */
  poster: string | null;
  /** SVG alignment controls the crop without stretching the media. */
  alignment?: 'xMinYMid' | 'xMidYMid' | 'xMaxYMid' | 'xMidYMin';
  fit?: 'meet' | 'slice';
  thumbnail?: boolean;
};

// Three short chapters preserve the scroll length and large frames. The final
// two windows revisit details from each chapter instead of adding empty frames.
export const filmChapters = Array.from({ length: 3 }, (_, chapter) => {
  const photos = nativePhotos.slice(chapter * 10, chapter * 10 + 10);
  return Array.from({ length: 12 }, (_, index): FilmMediaSlot => {
    const photo = photos[index % photos.length];
    return {
      id: String(chapter * 12 + index + 1).padStart(2, '0'),
      label: photo.alt,
      kind: 'photo',
      source: photo.src,
      poster: photo.src,
      fit: 'meet',
      thumbnail: photo.thumbnail,
    };
  });
});
export const filmMediaSlots = filmChapters[0];

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
    preserveAspectRatio: `${slot.alignment ?? 'xMidYMid'} ${slot.fit ?? 'slice'}`,
    label: `${slot.label}${source ? '' : ` — ${slot.kind} placeholder`}`,
  };
}
