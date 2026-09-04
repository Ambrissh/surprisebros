"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import "./gallery.css";

type GalleryPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const photos: GalleryPhoto[] = [
  {
    src: "/assets/gallery/optimized/moment-01-1280.jpg",
    alt: "Bride and groom smiling beneath a floral wedding canopy",
    width: 1280,
    height: 1920,
  },
  {
    src: "/assets/gallery/optimized/moment-02-1280.jpg",
    alt: "Warmly lit wedding stage framed with flowers",
    width: 1280,
    height: 854,
  },
  {
    src: "/assets/gallery/optimized/moment-03-1280.jpg",
    alt: "Pastel reception decor with layered floral details",
    width: 1280,
    height: 854,
  },
  {
    src: "/assets/gallery/optimized/moment-04-1280.jpg",
    alt: "Outdoor celebration table set beneath string lights",
    width: 1280,
    height: 854,
  },
  {
    src: "/assets/gallery/optimized/moment-05-1280.jpg",
    alt: "Elegant wedding aisle with white flowers",
    width: 1280,
    height: 854,
  },
  {
    src: "/assets/gallery/optimized/moment-06-1280.jpg",
    alt: "Wedding ceremony stage glowing in warm light",
    width: 1280,
    height: 854,
  },
  {
    src: "/assets/gallery/optimized/moment-07-1280.jpg",
    alt: "Floral arch arranged for an evening celebration",
    width: 1280,
    height: 848,
  },
  {
    src: "/assets/gallery/optimized/moment-08-1280.jpg",
    alt: "Reception venue dressed with flowers and candlelight",
    width: 1280,
    height: 822,
  },
  {
    src: "/assets/gallery/optimized/moment-09-1280.jpg",
    alt: "Outdoor wedding stage beneath hanging marigold garlands",
    width: 1280,
    height: 1920,
  },
  {
    src: "/assets/gallery/optimized/moment-10-1280.jpg",
    alt: "Colourful Indian celebration decorated with flowers",
    width: 1280,
    height: 854,
  },
  {
    src: "/assets/gallery/optimized/moment-11-1280.jpg",
    alt: "Ceremonial flowers and brass vessels arranged for a wedding",
    width: 1280,
    height: 853,
  },
  {
    src: "/assets/gallery/optimized/moment-12-1280.jpg",
    alt: "Newlywed couple standing beneath a flower arch",
    width: 1280,
    height: 1834,
  },
  {
    src: "/assets/gallery/optimized/moment-13-1280.jpg",
    alt: "Red and gold wedding stage with traditional details",
    width: 1280,
    height: 719,
  },
  {
    src: "/assets/gallery/optimized/moment-14-1280.jpg",
    alt: "Ornate red ceremony stage surrounded by flowers",
    width: 1280,
    height: 853,
  },
  {
    src: "/assets/gallery/optimized/moment-15-1280.jpg",
    alt: "Traditional red and gold celebration decor",
    width: 1280,
    height: 719,
  },
  {
    src: "/assets/gallery/optimized/moment-16-1280.jpg",
    alt: "Bright striped event stage with a floral sofa",
    width: 1280,
    height: 848,
  },
  {
    src: "/assets/gallery/optimized/moment-17-1280.jpg",
    alt: "Modern white wedding aisle with sculptural flowers",
    width: 1280,
    height: 960,
  },
  {
    src: "/assets/gallery/optimized/moment-18-1280.jpg",
    alt: "Cream and gold reception stage with mirrored arches",
    width: 1280,
    height: 853,
  },
  {
    src: "/assets/gallery/optimized/moment-19-1280.jpg",
    alt: "Pink floral wedding stage with layered blooms",
    width: 1280,
    height: 853,
  },
  {
    src: "/assets/gallery/optimized/moment-20-1280.jpg",
    alt: "Garden venue entrance framed by a flower arch",
    width: 1280,
    height: 719,
  },
  {
    src: "/assets/gallery/optimized/moment-21-1280.jpg",
    alt: "Reception entrance dressed in white drapery and flowers",
    width: 1280,
    height: 853,
  },
  {
    src: "/assets/gallery/optimized/moment-22-1280.jpg",
    alt: "Warm hanging lights against rich red curtains",
    width: 1280,
    height: 960,
  },
  {
    src: "/assets/gallery/optimized/moment-23-1280.jpg",
    alt: "Soft pink celebration stage with floral arrangements",
    width: 1280,
    height: 853,
  },
  {
    src: "/assets/gallery/optimized/moment-24-1280.jpg",
    alt: "Wedding table details with flowers and place settings",
    width: 1280,
    height: 853,
  },
  {
    src: "/assets/gallery/optimized/moment-25-1280.jpg",
    alt: "Outdoor ceremony aisle lined with white flowers",
    width: 1280,
    height: 853,
  },
  {
    src: "/assets/gallery/optimized/moment-26-1280.jpg",
    alt: "Candlelit banquet table in a dark reception room",
    width: 1280,
    height: 853,
  },
  {
    src: "/assets/gallery/optimized/moment-27-1280.jpg",
    alt: "Purple evening banquet table with elegant place settings",
    width: 1280,
    height: 853,
  },
  {
    src: "/assets/gallery/optimized/moment-28-1280.jpg",
    alt: "Luxury reception room filled with candles and flowers",
    width: 1280,
    height: 853,
  },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "WhatsApp", href: "https://wa.me/919790321840" },
];

const photosPerSpread = 4;
const spreadCount = Math.ceil(photos.length / photosPerSpread);
const rings = Array.from({ length: 12 });

type TurnState = {
  direction: -1 | 1;
  from: number;
  to: number;
};

export function GalleryAlbum() {
  const [isOpen, setIsOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [turning, setTurning] = useState<TurnState | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const swipeOrigin = useRef<number | null>(null);
  const indexTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const turnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (event.key === "ArrowLeft") showPreviousPhoto();
      if (event.key === "ArrowRight") showNextPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  useEffect(
    () => () => {
      if (indexTimer.current) clearTimeout(indexTimer.current);
      if (turnTimer.current) clearTimeout(turnTimer.current);
    },
    [],
  );

  const beginTurn = (to: number, direction: -1 | 1) => {
    if (turning || to === spreadIndex) return;

    const from = spreadIndex;
    setTurning({ direction, from, to });

    indexTimer.current = setTimeout(() => {
      setSpreadIndex(to);
    }, 440);

    turnTimer.current = setTimeout(() => {
      setTurning(null);
    }, 920);
  };

  const changeSpread = (direction: -1 | 1) => {
    const next = (spreadIndex + direction + spreadCount) % spreadCount;
    beginTurn(next, direction);
  };

  const spreadStart = spreadIndex * photosPerSpread;
  const spreadPhotos = getSpreadPhotos(spreadIndex);
  const selected = selectedPhoto === null ? null : photos[selectedPhoto];

  return (
    <main className="gallery-shell">
      <header className="gallery-header">
        <Link className="gallery-brand" href="/" aria-label="Surprise Bro's home">
          <strong>Surprise Bro&apos;s</strong>
          <span>Tirunelveli</span>
        </Link>

        <nav className="gallery-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={item.label === "Gallery" ? "is-current" : undefined}
              target={item.label === "WhatsApp" ? "_blank" : undefined}
              rel={item.label === "WhatsApp" ? "noreferrer" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="album-stage" aria-label="Celebration gallery">
        <div className={`album ${isOpen ? "is-open" : ""}`}>
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
              <TurningPage turn={turning} onSelect={setSelectedPhoto} />
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
            onClick={() => setIsOpen(true)}
            aria-controls="album-pages"
            aria-expanded={isOpen}
            tabIndex={isOpen ? -1 : 0}
          >
            <span className="cover-inset" aria-hidden="true" />
            <span className="cover-brand">Surprise Bro&apos;s</span>
            <strong>Gallery</strong>
            <span className="cover-action">Open gallery</span>
          </button>
        </div>

        <div className={`album-controls ${isOpen ? "is-visible" : ""}`} aria-hidden={!isOpen}>
          <button
            type="button"
            onClick={() => changeSpread(-1)}
            aria-label="Previous album pages"
            disabled={!isOpen || turning !== null}
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          <div className="spread-dots" aria-label="Album pages">
            {Array.from({ length: spreadCount }).map((_, index) => (
              <button
                type="button"
                key={index}
                className={index === spreadIndex ? "is-active" : undefined}
                onClick={() => beginTurn(index, index > spreadIndex ? 1 : -1)}
                aria-label={`Open album pages ${index + 1}`}
                aria-current={index === spreadIndex ? "page" : undefined}
                disabled={!isOpen || turning !== null}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => changeSpread(1)}
            aria-label="Next album pages"
            disabled={!isOpen || turning !== null}
          >
            <ChevronRight aria-hidden="true" />
          </button>

          <button
            className="close-album"
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close album"
            disabled={!isOpen || turning !== null}
          >
            <X aria-hidden="true" />
          </button>
        </div>
      </section>

      <Dialog
        open={selectedPhoto !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPhoto(null);
        }}
      >
        <DialogContent className="photo-lightbox" showCloseButton={false}>
          <DialogTitle className="sr-only">Expanded photograph</DialogTitle>
          <DialogDescription className="sr-only">
            Use the arrow buttons or keyboard arrow keys to view another photograph.
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
}: {
  turn: TurnState;
  onSelect: (index: number) => void;
}) {
  const fromPhotos = getSpreadPhotos(turn.from);
  const toPhotos = getSpreadPhotos(turn.to);
  const isForward = turn.direction === 1;
  const frontPhotos = isForward ? fromPhotos.slice(2, 4) : toPhotos.slice(2, 4);
  const frontOffset = (isForward ? turn.from : turn.to) * photosPerSpread + 2;
  const backPhotos = isForward ? toPhotos.slice(0, 2) : fromPhotos.slice(0, 2);
  const backOffset = (isForward ? turn.to : turn.from) * photosPerSpread;

  return (
    <div
      className={`turning-page ${isForward ? "turning-forward" : "turning-backward"}`}
      aria-hidden="true"
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
  );
}

function AlbumPage({
  side,
  photos: pagePhotos,
  offset,
  onSelect,
  inactive = false,
}: {
  side: "left" | "right";
  photos: GalleryPhoto[];
  offset: number;
  onSelect: (index: number) => void;
  inactive?: boolean;
}) {
  return (
    <div className={`album-page album-page-${side}`}>
      <div className="photo-grid">
        {pagePhotos.map((photo, index) => {
          const photoIndex = offset + index;

          return (
            <button
              className="album-photo"
              type="button"
              key={photo.src}
              onClick={() => onSelect(photoIndex)}
              aria-label={`View photograph ${photoIndex + 1}`}
              tabIndex={inactive ? -1 : 0}
            >
              <Image
                src={photo.src}
                alt=""
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
