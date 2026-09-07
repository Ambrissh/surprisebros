'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  FILM_EXTENSION_FRAMES,
  FILM_FRAME_COUNT,
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
import { advanceFilmProgress } from './film-motion';
import { filmChapters, filmMediaPresentation } from './film-media';
import nativePhotos from '../lib/native-photos.json';
import { FilmMediaFrame } from './film-media-frame';

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
const ribbonOutline = filmBand(
  0,
  FILM_LENGTH,
  -FILM_HALF_WIDTH,
  FILM_HALF_WIDTH,
);
const ribbonWindows = filmBand(0, FILM_LENGTH - 145, -136, 136);
const endPose = filmPose(FILM_LENGTH - 73);

export function FilmJourney() {
  const [chapter, setChapter] = useState(0);
  const filmMediaSlots = filmChapters[chapter];
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
    let lastProgress = -1;
    let progress = 0;
    const motion = { velocity: 0 };
    let target = 0;
    let lastTimestamp = 0;
    let needsSample = true;
    let snapNext = true;
    let viewportWidth = stage.clientWidth;
    let viewportHeight = stage.clientHeight;
    let travel = Math.max(1, section.offsetHeight - viewportHeight);

    const render = (timestamp: number) => {
      animationFrame = 0;
      if (reduced.matches) {
        scene.setAttribute('viewBox', '-54 0 1780 1000');
        reveal.setAttribute('stroke-dashoffset', String(FILM_LENGTH));
        stage.removeAttribute('style');
        lastProgress = -1;
        lastTimestamp = 0;
        motion.velocity = 0;
        return;
      }
      if (needsSample) {
        const bounds = section.getBoundingClientRect();
        // Finish just before the sticky stage releases, giving the last frame
        // time to settle into the contact section without a last-second snap.
        target = clamp(
          -bounds.top / Math.max(1, travel - viewportHeight * 0.25),
        );
        if (snapNext || bounds.top >= viewportHeight || bounds.bottom <= 0) {
          progress = target;
          motion.velocity = 0;
        }
        needsSample = false;
        snapNext = false;
      }
      const elapsed = lastTimestamp ? timestamp - lastTimestamp : 1000 / 60;
      lastTimestamp = timestamp;
      progress = advanceFilmProgress(progress, target, elapsed, motion);
      // Do not repaint the entire SVG while the user is elsewhere on the page.
      if (progress === lastProgress && progress === target) {
        lastTimestamp = 0;
        return;
      }
      lastProgress = progress;
      const camera = filmCamera(progress, viewportWidth, viewportHeight);
      scene.setAttribute('viewBox', camera.viewBox);
      reveal.setAttribute(
        'stroke-dashoffset',
        String(FILM_LENGTH - camera.reveal),
      );
      const caption = `${String(camera.frame).padStart(2, '0')} / ${FILM_FRAME_COUNT}`;
      if (counter.textContent !== caption) counter.textContent = caption;
      stage.style.setProperty('--film-settle', String(camera.settling));
      stage.style.setProperty(
        '--film-heading',
        String(1 - clamp(progress / 0.12)),
      );
      const background = [229, 223, 214].map((channel) =>
        Math.round(255 + (channel - 255) * camera.settling),
      );
      const color = `rgb(${background.join(', ')})`;
      if (stage.style.backgroundColor !== color)
        stage.style.backgroundColor = color;
      if (progress !== target) {
        animationFrame = window.requestAnimationFrame(render);
      } else {
        lastTimestamp = 0;
      }
    };
    const requestRender = () => {
      needsSample = true;
      if (!animationFrame)
        animationFrame = window.requestAnimationFrame(render);
    };
    const measure = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const distance = Math.max(1, section.offsetHeight - height);
      if (
        width === viewportWidth &&
        height === viewportHeight &&
        distance === travel
      ) {
        requestRender();
        return;
      }
      lastProgress = -1;
      snapNext = true;
      viewportWidth = width;
      viewportHeight = height;
      travel = distance;
      requestRender();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', measure);
    const changeMotionPreference = () => {
      lastProgress = -1;
      snapNext = true;
      motion.velocity = 0;
      measure();
    };
    reduced.addEventListener('change', changeMotionPreference);
    requestRender();
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', measure);
      reduced.removeEventListener('change', changeMotionPreference);
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
            aria-label={`A continuous film of ${FILM_FRAME_COUNT} celebration moments`}
          >
            <defs>
              <clipPath id="film-hardware-only">
                <path
                  d="M0 0H1672V941H0Z M370 331V608H1672V331Z"
                  clipRule="evenodd"
                />
              </clipPath>
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
              clipPath="url(#film-hardware-only)"
              x="0"
              y="0"
              width="1672"
              height="941"
            />
            {firstFrames.map((frame, index) => {
              const slot = filmMediaSlots[index];
              const media = filmMediaPresentation(slot);
              return (
                <FilmMediaFrame
                  key={slot.id}
                  slot={slot}
                  center={{
                    x: frame.x + frame.width / 2,
                    y: frame.y + frame.height / 2,
                  }}
                >
                  {media.image ? (
                    <>
                      <rect
                        x={frame.x}
                        y={frame.y}
                        width={frame.width}
                        height={frame.height}
                        fill="#f4eee5"
                      />
                      <image
                        href={media.image}
                        x={frame.x + (slot.thumbnail ? frame.width * 0.2 : 0)}
                        y={frame.y + (slot.thumbnail ? frame.height * 0.2 : 0)}
                        width={frame.width * (slot.thumbnail ? 0.6 : 1)}
                        height={frame.height * (slot.thumbnail ? 0.6 : 1)}
                        preserveAspectRatio={media.preserveAspectRatio}
                      />
                    </>
                  ) : (
                    <rect
                      x={frame.x}
                      y={frame.y}
                      width={frame.width}
                      height={frame.height}
                      fill="transparent"
                    />
                  )}
                </FilmMediaFrame>
              );
            })}
            <g mask="url(#film-scroll-reveal)">
              <path
                d={ribbonOutline}
                fill="url(#film-material)"
                stroke="#6d3030"
                strokeWidth="0.8"
              />
              <path d={ribbonWindows} fill="#fff" />
              {FILM_EXTENSION_FRAMES.map((frame, index) => {
                const slot = filmMediaSlots[index + firstFrames.length];
                const media = filmMediaPresentation(slot);
                return (
                  <FilmMediaFrame key={slot.id} slot={slot} center={frame.pose}>
                    <g clipPath={`url(#film-window-${frame.number})`}>
                      <path d={frame.clip} fill="#f4eee5" />
                      {media.image && (
                        <image
                          href={media.image}
                          x={frame.image.x}
                          y={frame.image.y}
                          width={frame.image.width}
                          height={frame.image.height}
                          preserveAspectRatio={media.preserveAspectRatio}
                          transform={`rotate(${frame.pose.angle} ${frame.pose.x} ${frame.pose.y})`}
                        />
                      )}
                    </g>
                  </FilmMediaFrame>
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
            <div className="film-chapters" aria-label="Choose film photos">
              {filmChapters.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  aria-pressed={chapter === index}
                  onClick={() => {
                    setChapter(index);
                    sectionRef.current?.scrollIntoView({
                      behavior: window.matchMedia(
                        '(prefers-reduced-motion: reduce)',
                      ).matches
                        ? 'auto'
                        : 'smooth',
                    });
                  }}
                >
                  {index * 10 + 1}–{index * 10 + 10}
                </button>
              ))}
            </div>
            <span ref={counterRef}>01 / {FILM_FRAME_COUNT}</span>
          </div>
        </div>
        <div className="motion-film-accessible-gallery">
          {filmChapters
            .flat()
            .filter(
              (slot, index, slots) =>
                slots.findIndex((item) => item.source === slot.source) ===
                index,
            )
            .map((slot) => {
              const media = filmMediaPresentation(slot);
              if (!media.image) return null;
              const preview = (
                <Image
                  src={media.image}
                  alt={media.label}
                  width={400}
                  height={520}
                  sizes="(max-width: 600px) 45vw, 22vw"
                  unoptimized
                />
              );
              return media.href ? (
                <a
                  key={slot.id}
                  href={media.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${slot.label} (opens in a new tab)`}
                >
                  {preview}
                </a>
              ) : (
                <div key={slot.id}>{preview}</div>
              );
            })}
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
            src={nativePhotos[13].src}
            alt={nativePhotos[13].alt}
            width={nativePhotos[13].width}
            height={nativePhotos[13].height}
            unoptimized
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
          <div className="celebration-map">
            <iframe
              title="Surprise Bro's location in Gandhinagar, Tirunelveli"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.584193237431!2d77.6790094!3d8.7309737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0411406b9f4081%3A0xd5db0492ad319ed9!2sSurprise%20Bro's!5e0!3m2!1sen!2sin!4v1788703870849!5m2!1sen!2sin"
              width="600"
              height="450"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <address className="celebration-address">
            87 Q 1, Azad Road, near Sona Mahal
            <br />
            Gandhinagar, Tirunelveli 627008
          </address>
          <a
            className="celebration-directions"
            href="https://maps.app.goo.gl/qu8MeJuvyYZsChcBA"
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps <ArrowUpRight aria-hidden="true" />
          </a>
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
