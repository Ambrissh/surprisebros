'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import {
  FILM_EXTENSION_FRAMES,
  FILM_HALF_WIDTH,
  FILM_HOLES,
  FILM_LENGTH,
  FILM_SPINE,
  clamp,
  filmBand,
  filmCamera,
  filmPose,
} from './film-geometry';
import './film-journey.css';

const contactLink =
  'https://wa.me/918488991284?text=Hi%20Surprise%20Bro%27s%2C%20I%27d%20like%20to%20plan%20an%20event.';
const firstFrames = [
  { x: 372, y: 334, width: 187, height: 270, label: 'Wedding stage' },
  { x: 572, y: 343, width: 201, height: 261, label: 'Couple portrait' },
  { x: 786, y: 343, width: 214, height: 261, label: 'Reception details' },
  { x: 1012, y: 343, width: 216, height: 261, label: 'Celebration' },
  { x: 1241, y: 343, width: 209, height: 261, label: 'Floral styling' },
  { x: 1465, y: 343, width: 203, height: 261, label: 'Wedding aisle' },
];
const filmPhotos = [
  { number: '09', label: 'Marigold moments' },
  { number: '02', label: 'A beautiful beginning' },
  { number: '03', label: 'Made for you' },
  { number: '04', label: 'Evenings together' },
  { number: '05', label: 'Down the aisle' },
  { number: '06', label: 'In full bloom' },
  { number: '07', label: 'A little magic' },
  { number: '08', label: 'Time to celebrate' },
  { number: '10', label: 'All the colour' },
  { number: '11', label: 'The little details' },
  { number: '12', label: 'Just the two of you' },
  { number: '17', label: 'Beautifully personal' },
  { number: '18', label: 'A golden evening' },
  { number: '19', label: 'Something special' },
  { number: '24', label: 'Gather together' },
  { number: '28', label: 'A night to remember' },
];
const ribbonOutline = filmBand(
  0,
  FILM_LENGTH,
  -FILM_HALF_WIDTH,
  FILM_HALF_WIDTH,
);
const ribbonWindows = filmBand(0, FILM_LENGTH - 145, -136, 136);
const endPose = filmPose(FILM_LENGTH - 73);

export function FilmJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SVGSVGElement>(null);
  const revealRef = useRef<SVGPathElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    const reveal = revealRef.current;
    const counter = counterRef.current;
    if (!section || !stage || !scene || !reveal || !counter) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = 0;
    let viewportWidth = stage.clientWidth;
    let viewportHeight = stage.clientHeight;
    let travel = Math.max(1, section.offsetHeight - viewportHeight);

    const render = () => {
      animationFrame = 0;
      if (reduced.matches) return;
      const progress = clamp(-section.getBoundingClientRect().top / travel);
      const camera = filmCamera(progress, viewportWidth, viewportHeight);
      scene.setAttribute('viewBox', camera.viewBox);
      reveal.setAttribute(
        'stroke-dashoffset',
        String(FILM_LENGTH - camera.reveal),
      );
      counter.textContent = `${String(camera.frame).padStart(2, '0')} / 22`;
      stage.style.setProperty('--film-settle', String(camera.settling));
      stage.style.setProperty(
        '--film-heading',
        String(1 - clamp(progress / 0.12)),
      );
      const background = [203, 210, 204].map((channel) =>
        Math.round(255 + (channel - 255) * camera.settling),
      );
      stage.style.backgroundColor = `rgb(${background.join(' ')})`;
    };
    const requestRender = () => {
      if (!animationFrame)
        animationFrame = window.requestAnimationFrame(render);
    };
    const measure = () => {
      viewportWidth = stage.clientWidth;
      viewportHeight = stage.clientHeight;
      travel = Math.max(1, section.offsetHeight - viewportHeight);
      requestRender();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', measure);
    reduced.addEventListener('change', measure);
    render();
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', measure);
      reduced.removeEventListener('change', measure);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <section
        id="moments-in-motion"
        ref={sectionRef}
        className="motion-film"
        aria-labelledby="motion-film-title"
      >
        <div ref={stageRef} className="motion-film-stage">
          <div className="motion-film-heading">
            <h2 id="motion-film-title">Every celebration has a story.</h2>
            <a href="#reach-out">
              Let&apos;s create yours <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <svg
            ref={sceneRef}
            className="motion-film-scene"
            viewBox="-54 0 1780 1000"
            aria-label="A continuous film of 22 celebration moments"
          >
            <defs>
              <linearGradient id="film-material" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#310b0e" />
                <stop offset="0.5" stopColor="#240608" />
                <stop offset="1" stopColor="#390e12" />
              </linearGradient>
              <mask
                id="film-scroll-reveal"
                maskUnits="userSpaceOnUse"
                x="-200"
                y="-200"
                width="3200"
                height="4700"
              >
                <path
                  ref={revealRef}
                  d={FILM_SPINE}
                  fill="none"
                  stroke="white"
                  strokeWidth="348"
                  strokeLinecap="butt"
                  strokeLinejoin="round"
                  strokeDasharray={`${FILM_LENGTH} ${FILM_LENGTH}`}
                  strokeDashoffset={FILM_LENGTH}
                />
              </mask>
              {FILM_EXTENSION_FRAMES.map((frame) => (
                <clipPath id={`film-window-${frame.number}`} key={frame.number}>
                  <path d={frame.clip} />
                </clipPath>
              ))}
            </defs>
            <image
              href="/assets/film-roll-reference-composite.png"
              x="0"
              y="0"
              width="1672"
              height="941"
            />
            {firstFrames.map((frame, index) => (
              <g
                key={frame.label}
                data-video-slot={String(index + 1).padStart(2, '0')}
                aria-label={frame.label}
              >
                <title>{frame.label}</title>
                <rect
                  {...{
                    x: frame.x,
                    y: frame.y,
                    width: frame.width,
                    height: frame.height,
                  }}
                  fill="transparent"
                />
              </g>
            ))}
            <g mask="url(#film-scroll-reveal)">
              <path
                d={ribbonOutline}
                fill="url(#film-material)"
                stroke="#6d3030"
                strokeWidth="0.8"
              />
              <path d={ribbonWindows} fill="#fff" />
              {FILM_EXTENSION_FRAMES.map((frame, index) => {
                const photo = filmPhotos[index];
                return (
                  <g
                    key={frame.number}
                    data-video-slot={String(frame.number).padStart(2, '0')}
                    aria-label={photo.label}
                  >
                    <title>{photo.label}</title>
                    <g clipPath={`url(#film-window-${frame.number})`}>
                      <image
                        href={`/assets/gallery/optimized/moment-${photo.number}-1280.jpg`}
                        x={frame.image.x}
                        y={frame.image.y}
                        width={frame.image.width}
                        height={frame.image.height}
                        preserveAspectRatio="xMidYMid slice"
                        transform={`rotate(${frame.pose.angle} ${frame.pose.x} ${frame.pose.y})`}
                      />
                    </g>
                  </g>
                );
              })}
              {FILM_HOLES.map((hole, index) => (
                <rect
                  key={index}
                  x={hole.x - 6.5}
                  y={hole.y - 8}
                  width="13"
                  height="16"
                  rx="2"
                  fill="#fff"
                  transform={`rotate(${hole.angle} ${hole.x} ${hole.y})`}
                />
              ))}
              <text
                className="motion-film-end-label"
                x={endPose.x}
                y={endPose.y}
                transform={`rotate(${endPose.angle - 90} ${endPose.x} ${endPose.y})`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                YOUR STORY, NEXT.
              </text>
            </g>
          </svg>
          <div className="motion-film-ending" aria-hidden="true">
            <span>One more story to tell.</span>
            <strong>Yours.</strong>
            <ArrowDown />
          </div>
          <div className="motion-film-caption">
            <span>Moments in motion</span>
            <span ref={counterRef}>01 / 22</span>
          </div>
        </div>
        <div className="motion-film-accessible-gallery">
          {filmPhotos.map((photo) => (
            <Image
              key={photo.number}
              src={`/assets/gallery/optimized/moment-${photo.number}-1280.jpg`}
              alt={photo.label}
              width={400}
              height={520}
              sizes="(max-width: 600px) 45vw, 22vw"
            />
          ))}
        </div>
      </section>

      <section
        id="reach-out"
        className="celebration-contact"
        aria-labelledby="celebration-contact-heading"
      >
        <div className="celebration-contact-copy">
          <p className="celebration-eyebrow">
            A little planning. A lot of magic.
          </p>
          <h2 id="celebration-contact-heading">
            Big day?
            <br />
            Let&apos;s make it
            <br />
            <em>unforgettable.</em>
          </h2>
          <a
            className="celebration-contact-link"
            href={contactLink}
            target="_blank"
            rel="noreferrer"
          >
            Contact us <ArrowRight aria-hidden="true" />
          </a>
          <p className="celebration-contact-description">
            From wedding decor to birthday cakes and thoughtful surprises, we
            bring your ideas to life. Tell us what you&apos;re celebrating.
            We&apos;ll take it from there.
          </p>
        </div>
        <div className="celebration-contact-art">
          <Image
            src="/assets/celebration-cake-gift.png"
            alt="An ivory three-tier party cake with burgundy bows and candles, on a silver stand beside a golden gift"
            width={1086}
            height={1448}
            sizes="(max-width: 600px) 90vw, 50vw"
          />
        </div>
      </section>

      <footer className="celebration-footer" id="services">
        <div className="celebration-footer-about">
          <Link href="/#home" className="celebration-footer-brand">
            Surprise Bro&apos;s<span>Tirunelveli</span>
          </Link>
          <p>
            Event styling, celebrations, and the little details that make a big
            difference.
          </p>
          <a href={contactLink} target="_blank" rel="noreferrer">
            Let&apos;s plan something <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <nav aria-label="Footer navigation">
          <h3>Explore</h3>
          <Link href="/#home">Home</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/reviews">Reviews</Link>
          <a href="#reach-out">Contact</a>
        </nav>
        <div className="celebration-footer-services">
          <h3>Our services</h3>
          <p>Wedding & event decor</p>
          <p>Birthday celebrations</p>
          <p>Party cakes</p>
          <p>Personal surprises</p>
        </div>
        <div className="celebration-footer-location">
          <h3>Find us</h3>
          <div
            className="celebration-map-slot"
            data-location-slot
            aria-label="Location map placeholder"
          >
            <MapPin aria-hidden="true" />
            <strong>Tirunelveli</strong>
            <span>Location map coming soon</span>
          </div>
        </div>
        <div className="celebration-footer-bottom">
          <span>Made for your moments.</span>
          <Link href="/#home">
            Back to top <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </footer>
    </>
  );
}
