import type { ReactNode } from 'react';
import { filmMediaPresentation, type FilmMediaSlot } from './film-media';

/** Same slot wrapper for the six opening frames and the six curved frames. */
export function FilmMediaFrame({
  slot,
  children,
  center,
}: {
  slot: FilmMediaSlot;
  children: ReactNode;
  center: { x: number; y: number };
}) {
  const media = filmMediaPresentation(slot);
  const content = (
    <>
      <title>{media.label}</title>
      {children}
      {media.href && (
        <g
          className="motion-film-play"
          aria-hidden="true"
          pointerEvents="none"
          transform={`translate(${center.x} ${center.y})`}
        >
          <circle
            r="27"
            fill="#232724"
            fillOpacity="0.72"
            stroke="white"
            strokeWidth="1.5"
          />
          <path d="M -6 -10 L 11 0 L -6 10 Z" fill="white" />
        </g>
      )}
    </>
  );
  if (media.href) {
    return (
      <a
        href={media.href}
        target="_blank"
        rel="noopener noreferrer"
        className="motion-film-media-link"
        data-video-slot={slot.id}
        data-media-kind={slot.kind}
        aria-label={`Watch ${slot.label} (opens in a new tab)`}
      >
        {content}
      </a>
    );
  }
  return (
    <g
      data-video-slot={slot.id}
      data-media-kind={slot.kind}
      data-media-state={media.ready ? 'ready' : 'placeholder'}
      aria-label={media.label}
    >
      {content}
    </g>
  );
}
