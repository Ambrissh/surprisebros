'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Reach out', href: '/#reach-out' },
];

const filmPlaceholders = [
  { number: '01', label: 'Wedding stage' },
  { number: '02', label: 'Couple portrait' },
  { number: '03', label: 'Reception details' },
  { number: '04', label: 'Celebration' },
  { number: '05', label: 'Floral styling' },
  { number: '06', label: 'Wedding aisle' },
  { number: '07', label: 'Reel placeholder' },
  { number: '08', label: 'Reel placeholder' },
  { number: '09', label: 'Reel placeholder' },
  { number: '10', label: 'Reel placeholder' },
  { number: '11', label: 'Reel placeholder' },
  { number: '12', label: 'Reel placeholder' },
  { number: '13', label: 'Reel placeholder' },
  { number: '14', label: 'Reel placeholder' },
  { number: '15', label: 'Reel placeholder' },
  { number: '16', label: 'Reel placeholder' },
  { number: '17', label: 'Reel placeholder' },
  { number: '18', label: 'Reel placeholder' },
  { number: '19', label: 'Reel placeholder' },
  { number: '20', label: 'Reel placeholder' },
  { number: '21', label: 'Reel placeholder' },
  { number: '22', label: 'Reel placeholder' },
];

const filmTailPlaceholders = filmPlaceholders.slice(6);

export function ActOne() {
  const heroImageRef = useRef<HTMLImageElement>(null);
  const storySectionRef = useRef<HTMLElement>(null);
  const storyTitleRef = useRef<HTMLDivElement>(null);
  const storyTextRef = useRef<HTMLDivElement>(null);
  const storyDecorRef = useRef<HTMLDivElement>(null);
  const filmSectionRef = useRef<HTMLElement>(null);
  const filmTrackRef = useRef<HTMLDivElement>(null);
  const filmBridgeRef = useRef<SVGSVGElement>(null);
  const filmTailRef = useRef<HTMLDivElement>(null);
  const filmCounterRef = useRef<HTMLSpanElement>(null);
  const filmFinaleRef = useRef<HTMLDivElement>(null);
  const [heroReady, setHeroReady] = useState(false);
  const [curtainReady, setCurtainReady] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(false);
  const [copyVisible, setCopyVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const heroImage = heroImageRef.current;
    if (heroImage?.complete && heroImage.naturalWidth > 0) setHeroReady(true);
  }, []);

  useEffect(() => {
    const section = filmSectionRef.current;
    const track = filmTrackRef.current;
    const bridge = filmBridgeRef.current;
    const tail = filmTailRef.current;
    const counter = filmCounterRef.current;
    const finale = filmFinaleRef.current;

    if (!section || !track || !bridge || !tail || !counter || !finale) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const render = () => {
      frame = 0;

      if (reduceMotion.matches) {
        track.removeAttribute('style');
        bridge.removeAttribute('style');
        tail.removeAttribute('style');
        counter.removeAttribute('style');
        finale.removeAttribute('style');
        return;
      }

      const bounds = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-bounds.top / travel, 0), 1);
      const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
      const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);
      const entrance = clamp(progress / 0.035);
      const horizontalProgress = easeOut(clamp(progress / 0.2));
      const bridgeEntrance = easeOut(clamp((progress - 0.155) / 0.055));
      const tailProgress = clamp((progress - 0.19) / 0.64);
      const finaleEntrance = easeOut(clamp((progress - 0.835) / 0.155));
      const startX = window.innerWidth * 0.04;
      const endX = window.innerWidth * 0.035 - track.scrollWidth;
      const x = startX + (endX - startX) * horizontalProgress;
      const y = (1 - entrance) * 7;
      const tailDistance = tail.scrollHeight + window.innerHeight * 0.46;
      const tailY = window.innerHeight * 0.1 - tailDistance * tailProgress;
      const tailSway = Math.sin(tailProgress * Math.PI * 4) * 1.4;
      const bridgeExit = clamp((progress - 0.79) / 0.09);
      const sceneExit = clamp((progress - 0.82) / 0.12);
      const horizontalFrame = Math.max(
        1,
        Math.min(6, Math.ceil(horizontalProgress * 6)),
      );
      const tailFrame = Math.max(
        7,
        Math.min(22, 6 + Math.ceil(tailProgress * 16)),
      );
      const activeFrame = progress < 0.19 ? horizontalFrame : tailFrame;

      track.style.opacity = `${Math.min(entrance * 1.6, 1) * (1 - sceneExit)}`;
      track.style.transform = `translate3d(${x}px, calc(-50% + ${y}vh), 0)`;
      bridge.style.opacity = `${bridgeEntrance * (1 - bridgeExit)}`;
      bridge.style.transform = `translate3d(0, ${y * 0.25}vh, 0)`;
      tail.style.opacity = `${bridgeEntrance * (1 - sceneExit)}`;
      tail.style.transform = `translate3d(-50%, ${tailY}px, 0) rotate(${tailSway}deg)`;
      counter.textContent = `${String(activeFrame).padStart(2, '0')} / 22`;
      counter.style.opacity = `${bridgeEntrance * (1 - sceneExit)}`;
      finale.style.transform = `translate3d(0, ${(1 - finaleEntrance) * 106}%, 0)`;
      finale.style.borderRadius = `${1.9 - finaleEntrance * 1.15}rem`;
    };

    const requestRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender);
    reduceMotion.addEventListener('change', requestRender);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', requestRender);
      reduceMotion.removeEventListener('change', requestRender);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const curtain = new window.Image();

    curtain.onload = () => active && setCurtainReady(true);
    curtain.onerror = () => active && setCurtainReady(true);
    curtain.src = '/assets/maroon-satin-curtain-v2.png';

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!heroReady || !curtainReady) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const settleImmediately = () => {
      setIsOpening(true);
      setSceneVisible(true);
      setCopyVisible(true);
      setNavVisible(true);
    };

    if (reducedMotion) {
      const reducedMotionTimer = window.setTimeout(settleImmediately, 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    const timers = [
      window.setTimeout(() => setIsOpening(true), 180),
      // Let the curtains clear and hold a dark studio before the practicals ignite.
      window.setTimeout(() => setSceneVisible(true), 2180),
      window.setTimeout(() => setCopyVisible(true), 4180),
      window.setTimeout(() => setNavVisible(true), 4380),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [heroReady, curtainReady]);

  useEffect(() => {
    const section = storySectionRef.current;
    const title = storyTitleRef.current;
    const story = storyTextRef.current;
    const decor = storyDecorRef.current;

    if (!section || !title || !story || !decor) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const render = () => {
      frame = 0;

      if (reduceMotion.matches) {
        title.removeAttribute('style');
        story.removeAttribute('style');
        decor.removeAttribute('style');
        return;
      }

      const bounds = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-bounds.top / travel, 0), 1);
      const titleExit = Math.min(Math.max((progress - 0.06) / 0.24, 0), 1);
      const storyEntrance = Math.min(Math.max((progress - 0.04) / 0.9, 0), 1);
      const celebrationEntrance = Math.min(progress / 0.32, 1);
      const celebrationExit = Math.min(Math.max((progress - 0.36) / 0.2, 0), 1);

      title.style.opacity = `${1 - titleExit}`;
      title.style.transform = `translate3d(0, ${-titleExit * 14}vh, 0) scale(${1 - titleExit * 0.08})`;

      const storyY = 96 - storyEntrance * 90;
      const storyTilt = 55 - storyEntrance * 35;
      const storyZ = -160 + storyEntrance * 210;
      story.style.opacity = `${Math.min(storyEntrance * 2.8, 1)}`;
      story.style.transform = `translate3d(0, ${storyY}vh, ${storyZ}px) rotateX(${storyTilt}deg)`;

      const celebrationY = 14 - celebrationEntrance * 18;
      const celebrationTilt = 48 - celebrationEntrance * 26;
      const celebrationZ = -180 + celebrationEntrance * 210;
      const celebrationScale = 0.84 + celebrationEntrance * 0.16;
      const celebrationOpacity =
        (0.34 + celebrationEntrance * 0.52) * (1 - celebrationExit);
      decor.style.opacity = `${celebrationOpacity}`;
      decor.style.visibility = celebrationExit >= 0.995 ? 'hidden' : 'visible';
      decor.style.transform = `translate3d(0, ${celebrationY}vh, ${celebrationZ}px) rotateX(${celebrationTilt}deg) scale(${celebrationScale})`;
      decor.style.setProperty(
        '--celebration-left-shift',
        `${-celebrationEntrance * 4.5}vw`,
      );
      decor.style.setProperty(
        '--celebration-right-shift',
        `${celebrationEntrance * 4.5}vw`,
      );
    };

    const requestRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender);
    reduceMotion.addEventListener('change', requestRender);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', requestRender);
      reduceMotion.removeEventListener('change', requestRender);
    };
  }, []);

  return (
    <main className="act-one-page">
      <section
        id="home"
        className={`act-one-stage ${isOpening ? 'is-opening' : ''} ${sceneVisible ? 'scene-visible' : ''} ${copyVisible ? 'copy-visible' : ''} ${navVisible ? 'nav-visible' : ''}`}
        aria-label="Surprise Bro's theatrical introduction"
      >
        <div className="hero-media" aria-hidden="true">
          <div className="hero-artwork">
            <div className="hero-quality-frame">
              <Image
                ref={heroImageRef}
                src="/assets/surprise-bros-final-stage-v6.png"
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
                style={{ objectFit: 'contain' }}
                onLoad={() => setHeroReady(true)}
                onError={() => setHeroReady(true)}
              />
            </div>
          </div>
          <div className="hero-blackout" />
          <div className="hero-exposure" />
          <div className="hero-light-rig">
            <div className="hero-light-frame">
              <div className="hero-lamp hero-lamp-key" />
              <div className="hero-lamp hero-lamp-fill" />
            </div>
          </div>
        </div>

        <header className="site-header">
          <nav className="primary-nav" aria-label="Primary navigation">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={index === 0 ? 'is-active' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="hero-copy">
          <p className="hero-kicker" aria-hidden="true">
            It all begins with
          </p>
          <h1 aria-label="It all begins with good design">
            <span className="headline-line headline-line-one">good</span>
            <span className="headline-line headline-line-two">design.</span>
          </h1>
        </div>

        <div className="theatre-curtain" aria-hidden="true">
          <div className="curtain-panel curtain-panel-left" />
          <div className="curtain-panel curtain-panel-right" />
          <div className="curtain-seam" />
        </div>
      </section>

      <section
        id="who-we-are"
        ref={storySectionRef}
        className="who-we-are"
        aria-labelledby="who-we-are-title"
      >
        <div className="who-we-are-sticky">
          <div ref={storyTitleRef} className="who-we-are-title-wrap">
            <p className="who-we-are-eyebrow">
              Surprise Bro&apos;s · Tirunelveli
            </p>
            <h2 id="who-we-are-title">Who are we?</h2>
            <span className="who-we-are-cue" aria-hidden="true">
              Scroll to meet us
            </span>
          </div>

          <div className="who-we-are-perspective">
            <div
              ref={storyDecorRef}
              className="who-we-are-celebration"
              aria-hidden="true"
            >
              <div className="celebration-burst celebration-burst-left">
                {Array.from({ length: 10 }, (_, index) => (
                  <span key={`left-confetti-${index}`} />
                ))}
              </div>
              <div className="celebration-burst celebration-burst-right">
                {Array.from({ length: 10 }, (_, index) => (
                  <span key={`right-confetti-${index}`} />
                ))}
              </div>
            </div>

            <div ref={storyTextRef} className="who-we-are-story">
              <p>
                We are Surprise Bro&apos;s, a Tirunelveli event team turning
                your ideas into experiences people can <em>feel.</em> From
                weddings to intimate surprises, we design every detail around
                you. <strong>Personal in approach.</strong> Precise in
                execution. Made to be remembered.
              </p>
            </div>
          </div>

          <div className="who-we-are-fade" aria-hidden="true" />
        </div>
      </section>

      <section
        id="moments-in-motion"
        ref={filmSectionRef}
        className="film-roll-section"
        aria-labelledby="film-roll-title"
      >
        <div className="film-roll-sticky">
          <h2 id="film-roll-title" className="film-roll-sr-only">
            Moments in motion
          </h2>

          <div ref={filmTrackRef} className="film-roll-track">
            <div className="film-roll-composite">
              <Image
                src="/assets/film-roll-reference-composite.png"
                alt=""
                width={1672}
                height={941}
                unoptimized
                sizes="(max-width: 560px) 420vw, (max-width: 820px) 210vw, 155vw"
              />
              <div className="film-video-slots">
                {filmPlaceholders.slice(0, 6).map((placeholder) => (
                  <article
                    key={placeholder.number}
                    className={`film-video-slot film-video-slot-${placeholder.number}`}
                    data-video-slot={placeholder.number}
                    aria-label={`Future video: ${placeholder.label}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <svg
            ref={filmBridgeRef}
            className="film-ribbon-bridge"
            viewBox="0 0 1600 900"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="film-ribbon-bridge-body"
              d="M -120 450 H 878 C 1108 450 1248 520 1248 650 V 980"
            />
            <path
              className="film-ribbon-bridge-hole film-ribbon-bridge-hole-outer"
              d="M -120 363 H 878 C 1168 363 1335 475 1335 650 V 980"
            />
            <path
              className="film-ribbon-bridge-hole film-ribbon-bridge-hole-inner"
              d="M -120 537 H 878 C 1048 537 1161 573 1161 650 V 980"
            />
          </svg>

          <div ref={filmTailRef} className="film-ribbon-tail">
            <div className="film-tail-splice" aria-hidden="true">
              Surprise Bro&apos;s · Moments in motion
            </div>
            {filmTailPlaceholders.map((placeholder) => (
              <article
                key={placeholder.number}
                className="film-tail-frame"
                data-video-slot={placeholder.number}
                aria-label={`Future video ${placeholder.number}`}
              >
                <div className="film-tail-frame-inner">
                  <span>{placeholder.number}</span>
                  <i aria-hidden="true" />
                  <strong>{placeholder.label}</strong>
                </div>
              </article>
            ))}
            <div className="film-tail-end" aria-hidden="true">
              <span>The end</span>
              <small>22 moments · one story</small>
            </div>
          </div>

          <div className="film-progress-badge" aria-hidden="true">
            Roll <span ref={filmCounterRef}>01 / 22</span>
          </div>

          <div ref={filmFinaleRef} className="film-finale">
            <section
              className="film-finale-grid"
              aria-labelledby="film-finale-title"
            >
              <div className="film-finale-message">
                <p>Surprise Bro&apos;s · Tirunelveli</p>
                <h2 id="film-finale-title">
                  Planning your next unforgettable celebration?
                </h2>
                <span>
                  Tell us the date and the feeling. We&apos;ll shape the decor,
                  surprises, and every memorable detail around you.
                </span>
                <footer>
                  <b>Decor</b>
                  <b>Cakes</b>
                  <b>Surprises</b>
                </footer>
              </div>

              <div className="film-finale-visual">
                <Image
                  src="/assets/gallery/moment-06.jpg"
                  alt="A wedding ceremony stage glowing in warm light"
                  fill
                  sizes="(max-width: 760px) 100vw, 34vw"
                  style={{ objectFit: 'cover' }}
                />
                <div
                  className="film-location-placeholder"
                  data-location-slot
                  aria-label="Location embed placeholder for Tirunelveli"
                >
                  <MapPin aria-hidden="true" />
                  <span>
                    <small>Location</small>
                    Tirunelveli
                  </span>
                  <em>Map embed ready</em>
                </div>
              </div>

              <div className="film-finale-action">
                <span className="film-finale-index">03 / Let&apos;s begin</span>
                <div>
                  <p>Your occasion deserves a thoughtful beginning.</p>
                  <a
                    href="https://wa.me/918488991284?text=Hi%20Surprise%20Bro%27s%2C%20I%27d%20like%20to%20plan%20an%20event."
                    target="_blank"
                    rel="noreferrer"
                  >
                    Contact us
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
                <footer>
                  <strong>Surprise Bro&apos;s</strong>
                  <span>Make it memorable.</span>
                </footer>
              </div>
            </section>
          </div>
        </div>
        <span id="reach-out" className="reach-out-anchor" aria-hidden="true" />
      </section>
    </main>
  );
}
