'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Reach out', href: '/#reach-out' },
];

const filmPlaceholders = [
  { number: '01', label: 'A little joy', tone: 'rose' },
  { number: '02', label: 'The big reveal', tone: 'amber' },
  { number: '03', label: 'Happy tears', tone: 'plum' },
  { number: '04', label: 'All the dancing', tone: 'clay' },
  { number: '05', label: 'One more surprise', tone: 'gold' },
  { number: '06', label: 'The afterglow', tone: 'wine' },
];

export function ActOne() {
  const heroImageRef = useRef<HTMLImageElement>(null);
  const storySectionRef = useRef<HTMLElement>(null);
  const storyTitleRef = useRef<HTMLDivElement>(null);
  const storyTextRef = useRef<HTMLDivElement>(null);
  const storyDecorRef = useRef<HTMLDivElement>(null);
  const filmSectionRef = useRef<HTMLElement>(null);
  const filmTrackRef = useRef<HTMLDivElement>(null);
  const filmCopyRef = useRef<HTMLDivElement>(null);
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
    const copy = filmCopyRef.current;

    if (!section || !track || !copy) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const render = () => {
      frame = 0;

      if (reduceMotion.matches) {
        track.removeAttribute('style');
        copy.removeAttribute('style');
        return;
      }

      const bounds = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-bounds.top / travel, 0), 1);
      const entrance = Math.min(progress / 0.12, 1);
      const copyExit = Math.min(Math.max((progress - 0.7) / 0.18, 0), 1);
      const startX = window.innerWidth * 0.26;
      const endPadding = window.innerWidth * 0.16;
      const horizontalTravel = Math.max(
        track.scrollWidth - window.innerWidth + startX + endPadding,
        window.innerWidth * 0.85,
      );
      const x = startX - horizontalTravel * progress;
      const y = (1 - entrance) * 10;
      const rotation = 1.8 - progress * 2.5;

      track.style.opacity = `${Math.min(entrance * 1.7, 1)}`;
      track.style.transform = `translate3d(${x}px, calc(-50% + ${y}vh), 0) rotate(${rotation}deg)`;
      copy.style.opacity = `${entrance * (1 - copyExit)}`;
      copy.style.transform = `translate3d(0, ${1.5 - entrance * 1.5 - copyExit * 4}rem, 0)`;
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
      window.setTimeout(() => setSceneVisible(true), 1540),
      window.setTimeout(() => setCopyVisible(true), 2250),
      window.setTimeout(() => setNavVisible(true), 2450),
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
      const celebrationExit = Math.min(
        Math.max((progress - 0.36) / 0.2, 0),
        1,
      );

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
      decor.style.visibility = celebrationExit >= 0.995 ? "hidden" : "visible";
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
                sizes="100vw"
                onLoad={() => setHeroReady(true)}
              />
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
          <p className="hero-kicker">It all begins with</p>
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
          <div ref={filmCopyRef} className="film-roll-copy">
            <p>Our favourite kind of stories</p>
            <h2 id="film-roll-title">
              Moments,
              <em> in motion.</em>
            </h2>
          </div>

          <div ref={filmTrackRef} className="film-roll-track">
            <div className="film-reel" aria-hidden="true">
              <Image
                src="/assets/film-reel-burgundy-v2.png"
                alt=""
                width={1536}
                height={1024}
                sizes="(max-width: 560px) 30rem, (max-width: 900px) 40rem, 48rem"
              />
            </div>

            <div className="film-strip">
              <div className="film-sprockets" aria-hidden="true" />
              <div className="film-frame-row">
                {filmPlaceholders.map((placeholder) => (
                  <article
                    key={placeholder.number}
                    className={`film-card film-card-${placeholder.tone}`}
                    data-video-slot={placeholder.number}
                    aria-label={`Future video: ${placeholder.label}`}
                  >
                    <div className="film-card-inner">
                      <span className="film-card-number">
                        Frame {placeholder.number}
                      </span>
                      <span className="film-card-play" aria-hidden="true">
                        <svg viewBox="0 0 40 40" role="presentation">
                          <path d="M16 12.5 29 20 16 27.5Z" />
                        </svg>
                      </span>
                      <span className="film-card-label">
                        {placeholder.label}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="film-sprockets" aria-hidden="true" />
            </div>
          </div>

          <p className="film-roll-note" aria-hidden="true">
            Keep scrolling to unspool
          </p>
        </div>
      </section>
    </main>
  );
}
