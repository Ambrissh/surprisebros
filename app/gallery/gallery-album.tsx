'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { albumReducer, initialAlbumState } from './album-state.mjs';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { SiteHeader } from '@/components/site-header';
import nativePhotos from '../../lib/native-photos.json';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

import './gallery.css';

type GalleryPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  thumbnail: boolean;
};

const photos: GalleryPhoto[] = nativePhotos;

const photosPerSpread = 4;
const spreadCount = Math.ceil(photos.length / photosPerSpread);
const rings = Array.from({ length: 12 });

type TurnState = {
  direction: -1 | 1;
  from: number;
  to: number;
};

export function GalleryAlbum() {
  const [albumState, dispatch] = useReducer(albumReducer, initialAlbumState);
  const isOpen = ['opening', 'open', 'turning'].includes(albumState.phase);
  const isClosing = albumState.phase === 'closing';
  const spreadIndex = albumState.spread;
  const turning = albumState.turn as TurnState | null;
  const busy = albumState.phase !== 'open';
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const swipeOrigin = useRef<number | null>(null);

  useEffect(() => {
    if (albumState.phase === 'open' || albumState.phase === 'closed') return;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    // Also settle if the browser cancels an animation or backgrounds the tab.
    const timer = window.setTimeout(
      () => dispatch({ type: 'settled', revision: albumState.revision }),
      reduced ? 0 : 1000,
    );
    return () => window.clearTimeout(timer);
  }, [albumState.phase, albumState.revision]);

  const showPreviousPhoto = useCallback(() => {
    setSelectedPhoto((current) => {
      if (current === null) return photos.length - 1;
      return (current - 1 + photos.length) % photos.length;
    });
  }, []);

  const showNextPhoto = useCallback(() => {
    setSelectedPhoto((current) => {
      if (current === null) return 0;
      return (current + 1) % photos.length;
    });
  }, []);

  useEffect(() => {
    if (selectedPhoto === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') showPreviousPhoto();
      if (event.key === 'ArrowRight') showNextPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, showNextPhoto, showPreviousPhoto]);

  useEffect(() => {
    const adjacentPhotos = [
      ...getSpreadPhotos((spreadIndex + 1) % spreadCount),
      ...getSpreadPhotos((spreadIndex - 1 + spreadCount) % spreadCount),
    ];

    adjacentPhotos.forEach((photo) => {
      const image = new window.Image();
      image.src = photo.src;
    });
  }, [spreadIndex]);

  const beginTurn = (to: number, direction: -1 | 1) => {
    dispatch({ type: 'turn', to, direction, count: spreadCount });
  };

  const changeSpread = (direction: -1 | 1) => {
    const next = (spreadIndex + direction + spreadCount) % spreadCount;
    beginTurn(next, direction);
  };

  const closeAlbum = () => {
    dispatch({ type: 'close' });
  };

  const spreadStart = spreadIndex * photosPerSpread;
  const spreadPhotos = getSpreadPhotos(spreadIndex);
  const selected = selectedPhoto === null ? null : photos[selectedPhoto];

  return (
    <main className="gallery-shell">
      <SiteHeader page="gallery" />
      <h1 className="sr-only">
        Surprise Bro&apos;s event decoration gallery in Tirunelveli
      </h1>

      <section className="album-stage" aria-label="Celebration gallery">
        <div
          className={`album ${isOpen ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''}`}
        >
          <div id="album-pages" className="album-pages" aria-hidden={!isOpen}>
            <div className="spread-content">
              <AlbumPage
                side="left"
                photos={spreadPhotos.slice(0, 2)}
                offset={spreadStart}
                onSelect={setSelectedPhoto}
              />

              <div className="album-binding" aria-hidden="true">
                <span className="binding-rail" />
                <div className="binding-rings">
                  {rings.map((_, index) => (
                    <span className="binding-ring" key={index} />
                  ))}
                </div>
              </div>

              <AlbumPage
                side="right"
                photos={spreadPhotos.slice(2, 4)}
                offset={spreadStart + 2}
                onSelect={setSelectedPhoto}
              />
            </div>

            {turning ? (
              <TurningPage
                turn={turning}
                onSelect={setSelectedPhoto}
                onComplete={() =>
                  dispatch({ type: 'settled', revision: albumState.revision })
                }
              />
            ) : null}
          </div>

          <span className="cover-binding" aria-hidden="true">
            {rings.map((_, index) => (
              <span key={index} />
            ))}
          </span>

          <button
            className="album-cover"
            type="button"
            onClick={() => dispatch({ type: 'open' })}
            aria-controls="album-pages"
            aria-expanded={isOpen}
            tabIndex={isOpen || isClosing ? -1 : 0}
            disabled={isClosing}
            onTransitionEnd={(event) => {
              if (
                event.target !== event.currentTarget ||
                event.propertyName !== 'transform'
              )
                return;
              if (albumState.phase === 'opening' || isClosing)
                dispatch({ type: 'settled', revision: albumState.revision });
            }}
          >
            <span className="cover-inset" aria-hidden="true" />
            <span className="cover-brand">Surprise Bro&apos;s</span>
            <strong>Gallery</strong>
            <span className="cover-action">Open gallery</span>
          </button>
        </div>

        <div
          className={`album-controls ${isOpen ? 'is-visible' : ''}`}
          aria-hidden={!isOpen}
        >
          <button
            type="button"
            onClick={() => changeSpread(-1)}
            aria-label="Previous album pages"
            disabled={busy}
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          <div className="spread-dots" aria-label="Album pages">
            {Array.from({ length: spreadCount }).map((_, index) => (
              <button
                type="button"
                key={index}
                className={index === spreadIndex ? 'is-active' : undefined}
                onClick={() => beginTurn(index, index > spreadIndex ? 1 : -1)}
                aria-label={`Open album pages ${index + 1}`}
                aria-current={index === spreadIndex ? 'page' : undefined}
                disabled={busy}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => changeSpread(1)}
            aria-label="Next album pages"
            disabled={busy}
          >
            <ChevronRight aria-hidden="true" />
          </button>

          <button
            className="close-album"
            type="button"
            onClick={closeAlbum}
            aria-label="Close album"
            disabled={busy}
          >
            <X aria-hidden="true" />
          </button>
        </div>
      </section>

      <details className="gallery-photo-index">
        <summary>Browse all {photos.length} celebration photos</summary>
        <div className="gallery-index-grid">
          {photos.map((photo, index) => (
            <button
              type="button"
              key={photo.src}
              onClick={() => setSelectedPhoto(index)}
              aria-label={`View ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                unoptimized
                loading="lazy"
                className={photo.thumbnail ? 'is-thumbnail' : undefined}
              />
            </button>
          ))}
        </div>
      </details>

      <footer className="gallery-footer">
        <p>
          Website built by Ambrissh
          <a href="tel:+919952222309">9952222309</a>
        </p>
      </footer>

      <Dialog
        open={selectedPhoto !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPhoto(null);
        }}
      >
        <DialogContent className="photo-lightbox" showCloseButton={false}>
          <DialogTitle className="sr-only">Expanded photograph</DialogTitle>
          <DialogDescription className="sr-only">
            Use the arrow buttons or keyboard arrow keys to view another
            photograph.
          </DialogDescription>

          {selected && selectedPhoto !== null ? (
            <div
              className="lightbox-frame"
              onPointerDown={(event) => {
                swipeOrigin.current = event.clientX;
              }}
              onPointerUp={(event) => {
                if (swipeOrigin.current === null) return;
                const distance = event.clientX - swipeOrigin.current;
                swipeOrigin.current = null;
                if (Math.abs(distance) < 45) return;
                if (distance > 0) showPreviousPhoto();
                else showNextPhoto();
              }}
            >
              <Image
                key={selected.src}
                src={selected.src}
                alt={selected.alt}
                unoptimized
                className={selected.thumbnail ? 'is-thumbnail' : undefined}
                width={selected.width}
                height={selected.height}
                sizes="94vw"
                priority
              />

              <button
                className="lightbox-button lightbox-close"
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close expanded photograph"
              >
                <X aria-hidden="true" />
              </button>
              <button
                className="lightbox-button lightbox-previous"
                type="button"
                onClick={showPreviousPhoto}
                aria-label="Previous photograph"
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <button
                className="lightbox-button lightbox-next"
                type="button"
                onClick={showNextPhoto}
                aria-label="Next photograph"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default GalleryAlbum;

function getSpreadPhotos(index: number) {
  const start = index * photosPerSpread;
  return photos.slice(start, start + photosPerSpread);
}

function TurningPage({
  turn,
  onSelect,
  onComplete,
}: {
  turn: TurnState;
  onSelect: (index: number) => void;
  onComplete: () => void;
}) {
  const fromPhotos = getSpreadPhotos(turn.from);
  const toPhotos = getSpreadPhotos(turn.to);
  const isForward = turn.direction === 1;
  const frontPhotos = isForward ? fromPhotos.slice(2, 4) : toPhotos.slice(2, 4);
  const frontOffset = (isForward ? turn.from : turn.to) * photosPerSpread + 2;
  const backPhotos = isForward ? toPhotos.slice(0, 2) : fromPhotos.slice(0, 2);
  const backOffset = (isForward ? turn.to : turn.from) * photosPerSpread;
  const heldPhotos = isForward
    ? fromPhotos.slice(0, 2)
    : fromPhotos.slice(2, 4);
  const heldOffset = turn.from * photosPerSpread + (isForward ? 0 : 2);
  const heldSide = isForward ? 'left' : 'right';

  return (
    <>
      <div
        className={`turning-hold turning-hold-${heldSide}`}
        aria-hidden="true"
      >
        <AlbumPage
          side={heldSide}
          photos={heldPhotos}
          offset={heldOffset}
          onSelect={onSelect}
          inactive
        />
      </div>

      <div
        className={`turning-page ${isForward ? 'turning-forward' : 'turning-backward'}`}
        aria-hidden="true"
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) onComplete();
        }}
      >
        <div className="turn-face turn-front">
          <AlbumPage
            side="right"
            photos={frontPhotos}
            offset={frontOffset}
            onSelect={onSelect}
            inactive
          />
        </div>
        <div className="turn-face turn-back">
          <AlbumPage
            side="left"
            photos={backPhotos}
            offset={backOffset}
            onSelect={onSelect}
            inactive
          />
        </div>
      </div>
    </>
  );
}

function AlbumPage({
  side,
  photos: pagePhotos,
  offset,
  onSelect,
  inactive = false,
}: {
  side: 'left' | 'right';
  photos: GalleryPhoto[];
  offset: number;
  onSelect: (index: number) => void;
  inactive?: boolean;
}) {
  return (
    <div className={`album-page album-page-${side}`}>
      <div className="photo-grid">
        {pagePhotos.length === 0 && (
          <p className="album-last-page">
            Every celebration, a new story.
            <br />
            Yours could be next.
          </p>
        )}
        {pagePhotos.map((photo, index) => {
          const photoIndex = offset + index;

          return (
            <button
              className="album-photo"
              type="button"
              key={photo.src}
              onClick={() => onSelect(photoIndex)}
              aria-label={`View ${photo.alt}`}
              tabIndex={inactive ? -1 : 0}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                unoptimized
                loading="eager"
                className={photo.thumbnail ? 'is-thumbnail' : undefined}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 720px) 42vw, 36vw"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
