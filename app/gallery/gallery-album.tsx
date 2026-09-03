'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

const photos = [
  {
    src: '/assets/gallery/moment-01.jpg',
    alt: 'An outdoor ceremony beneath a garden rotunda dressed with flowers',
    caption: 'Garden promises',
    note: 'A quiet aisle, framed in green',
  },
  {
    src: '/assets/gallery/moment-02.jpg',
    alt: 'A colourful Indian wedding ceremony beneath a floral mandap',
    caption: 'Under the open sky',
    note: 'A mandap made for the moment',
  },
  {
    src: '/assets/gallery/moment-03.jpg',
    alt: 'A candlelit Indian wedding stage with a grand chandelier',
    caption: 'A golden ceremony',
    note: 'Warm light, flowers, and family',
  },
  {
    src: '/assets/gallery/moment-04.jpg',
    alt: 'A jewel-toned wedding stage surrounded by red and pink flowers',
    caption: 'In full colour',
    note: 'A stage with a little drama',
  },
  {
    src: '/assets/gallery/moment-05.jpg',
    alt: 'A night reception venue glowing with chandeliers and patterned drapes',
    caption: 'After-dark glow',
    note: 'The evening, beautifully lit',
  },
  {
    src: '/assets/gallery/moment-06.jpg',
    alt: 'A rustic wedding venue with a bridal dress beneath chandeliers',
    caption: 'Before the guests arrive',
    note: 'Every light in its place',
  },
  {
    src: '/assets/gallery/moment-07.jpg',
    alt: 'A floral reception stage with warm fairy lights and yellow cushions',
    caption: 'Flowers after dusk',
    note: 'Soft light and joyful colour',
  },
  {
    src: '/assets/gallery/moment-08.jpg',
    alt: 'A garden wedding stage framed by white blossoms',
    caption: 'The garden chapter',
    note: 'A simple stage, carefully composed',
  },
] as const;

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Reach out', href: '/#reach-out' },
];

const rings = Array.from({ length: 9 }, (_, index) => index);

export function GalleryAlbum() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const moveSelection = useCallback((direction: number) => {
    setSelectedPhoto((current) => {
      if (current === null) return null;
      return (current + direction + photos.length) % photos.length;
    });
  }, []);

  useEffect(() => {
    if (selectedPhoto === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') moveSelection(-1);
      if (event.key === 'ArrowRight') moveSelection(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveSelection, selectedPhoto]);

  return (
    <main className="gallery-page">
      <header className="gallery-header">
        <Link className="gallery-brand" href="/" aria-label="Surprise Bro's home">
          <span className="gallery-monogram" aria-hidden="true">SB</span>
          <span>
            <strong>Surprise Bro&apos;s</strong>
            <small>Events · Tirunelveli</small>
          </span>
        </Link>

        <nav className="gallery-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={item.label === 'Gallery' ? 'is-active' : undefined}
              aria-current={item.label === 'Gallery' ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="gallery-intro" aria-labelledby="gallery-title">
        <p>Collected celebrations · Volume I</p>
        <h1 id="gallery-title">
          A few moments<br />
          we keep returning to.
        </h1>
        <span>Open the album, then select a photograph to see it in full.</span>
      </section>

      <section className="album-stage" aria-label="Interactive celebration album">
        <div className={`album ${isOpen ? 'is-open' : ''}`}>
          <div className="album-pages" aria-hidden={!isOpen}>
            <AlbumPage
              side="left"
              photos={photos.slice(0, 4)}
              offset={0}
              onSelect={setSelectedPhoto}
              isInteractive={isOpen}
            />

            <div className="album-binding" aria-hidden="true">
              {rings.map((ring) => <i key={ring} />)}
            </div>

            <AlbumPage
              side="right"
              photos={photos.slice(4)}
              offset={4}
              onSelect={setSelectedPhoto}
              isInteractive={isOpen}
            />
          </div>

          <button
            type="button"
            className="album-cover"
            onClick={() => setIsOpen(true)}
            aria-label="Open the celebration album"
            disabled={isOpen}
          >
            <span className="cover-frame" aria-hidden="true" />
            <span className="cover-flourish" aria-hidden="true">✦</span>
            <span className="cover-volume">The celebrations of</span>
            <strong>
              Surprise<br />
              Bro&apos;s
            </strong>
            <span className="cover-place">Tirunelveli · Est. with joy</span>
            <span className="cover-prompt">
              <Images aria-hidden="true" />
              Open the album
            </span>
          </button>
        </div>

        <div className={`album-actions ${isOpen ? 'is-visible' : ''}`}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={!isOpen}
          >
            <X aria-hidden="true" />
            Close album
          </Button>
          <Link href="/">
            <ArrowLeft aria-hidden="true" />
            Back to the beginning
          </Link>
        </div>
      </section>

      <p className="gallery-colophon">Designed celebrations, carefully remembered.</p>

      <Dialog
        open={selectedPhoto !== null}
        onOpenChange={(open) => !open && setSelectedPhoto(null)}
      >
        <DialogContent className="gallery-lightbox" showCloseButton={false}>
          {selectedPhoto !== null && (
            <>
              <DialogTitle className="sr-only">{photos[selectedPhoto].caption}</DialogTitle>
              <DialogDescription className="sr-only">
                {photos[selectedPhoto].note}
              </DialogDescription>

              <button
                type="button"
                className="lightbox-close"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photograph"
              >
                <X aria-hidden="true" />
              </button>

              <div className="lightbox-photo-wrap">
                <Image
                  src={photos[selectedPhoto].src}
                  alt={photos[selectedPhoto].alt}
                  width={1600}
                  height={1067}
                  sizes="94vw"
                />
              </div>

              <div className="lightbox-caption">
                <span>
                  {String(selectedPhoto + 1).padStart(2, '0')} /{' '}
                  {String(photos.length).padStart(2, '0')}
                </span>
                <p>
                  <strong>{photos[selectedPhoto].caption}</strong>
                  <small>{photos[selectedPhoto].note}</small>
                </p>
              </div>

              <button
                type="button"
                className="lightbox-arrow lightbox-arrow-left"
                onClick={() => moveSelection(-1)}
                aria-label="Previous photograph"
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                className="lightbox-arrow lightbox-arrow-right"
                onClick={() => moveSelection(1)}
                aria-label="Next photograph"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function AlbumPage({
  side,
  photos: pagePhotos,
  offset,
  onSelect,
  isInteractive,
}: {
  side: 'left' | 'right';
  photos: ReadonlyArray<(typeof photos)[number]>;
  offset: number;
  onSelect: (index: number) => void;
  isInteractive: boolean;
}) {
  return (
    <div className={`album-page album-page-${side}`}>
      <div className="page-heading">
        <span>{side === 'left' ? 'Ceremonies' : 'After the vows'}</span>
        <i />
        <small>{side === 'left' ? '01' : '02'}</small>
      </div>

      <div className="photo-grid">
        {pagePhotos.map((photo, index) => (
          <button
            type="button"
            className={`album-photo album-photo-${index + 1}`}
            key={photo.src}
            onClick={() => onSelect(offset + index)}
            aria-label={`Expand photograph: ${photo.caption}`}
            tabIndex={isInteractive ? 0 : -1}
          >
            <span className="photo-print">
              <Image
                src={photo.src}
                alt=""
                width={800}
                height={540}
                sizes="(max-width: 680px) 42vw, 20vw"
              />
            </span>
            <span className="photo-caption">
              <strong>{photo.caption}</strong>
              <small>{photo.note}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
