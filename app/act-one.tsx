'use client';

import { useEffect, useRef, useState } from 'react';
import { observeScrollScene } from '../lib/scroll-scene';
import { FilmJourney } from './film-journey';
import { SiteHeader } from '@/components/site-header';

export function ActOne() {
  const heroImageRef = useRef<HTMLImageElement>(null);
  const storySectionRef = useRef<HTMLElement>(null);
  const storyStageRef = useRef<HTMLDivElement>(null);
  const storyTitleRef = useRef<HTMLDivElement>(null);
  const storyTextRef = useRef<HTMLDivElement>(null);
  const storyDecorRef = useRef<HTMLDivElement>(null);
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
    let active = true;
    const curtain = new window.Image();

    curtain.onload = () => active && setCurtainReady(true);
    curtain.onerror = () => active && setCurtainReady(true);
    curtain.src = '/assets/optimized/maroon-satin-curtain-v2.webp';

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
    const stage = storyStageRef.current;
    const title = storyTitleRef.current;
    const story = storyTextRef.current;
    const decor = storyDecorRef.current;

    if (!section || !stage || !title || !story || !decor) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lastStoryProgress = -1;

    const render = ({ top, travel }: { top: number; travel: number }) => {
      if (reduceMotion.matches) {
        lastStoryProgress = -1;
        title.removeAttribute('style');
        story.removeAttribute('style');
        decor.removeAttribute('style');
        return;
      }

      const progress = Math.min(Math.max(-top / travel, 0), 1);
      // The story is settled while the film is on screen. Avoid repeated writes
      // to its perspective layers on every film scroll frame.
      if (progress === lastStoryProgress) return;
      lastStoryProgress = progress;
      const titleExit = Math.min(Math.max((progress - 0.06) / 0.24, 0), 1);
      const storyEntrance = Math.min(Math.max((progress - 0.04) / 0.9, 0), 1);
      const celebrationEntrance = Math.min(progress / 0.32, 1);
      const celebrationExit = Math.min(Math.max((progress - 0.36) / 0.2, 0), 1);

      title.style.opacity = `${1 - titleExit}`;
      title.style.transform = `translate3d(0, ${-titleExit * 14}svh, 0) scale(${1 - titleExit * 0.08})`;

      const storyY = 96 - storyEntrance * 90;
      story.style.opacity = `${Math.min(storyEntrance * 2.8, 1)}`;
      // Keep reading text upright. Perspective projection enlarged the lower
      // lines beyond laptop edges even when the document had no overflow.
      story.style.transform = `translate3d(0, ${storyY}svh, 0)`;

      const celebrationY = 14 - celebrationEntrance * 18;
      const celebrationTilt = 48 - celebrationEntrance * 26;
      const celebrationZ = -180 + celebrationEntrance * 210;
      const celebrationScale = 0.84 + celebrationEntrance * 0.16;
      const celebrationOpacity =
        (0.34 + celebrationEntrance * 0.52) * (1 - celebrationExit);
      decor.style.opacity = `${celebrationOpacity}`;
      decor.style.visibility = celebrationExit >= 0.995 ? 'hidden' : 'visible';
      decor.style.transform = `translate3d(0, ${celebrationY}svh, ${celebrationZ}px) rotateX(${celebrationTilt}deg) scale(${celebrationScale})`;
      decor.style.setProperty(
        '--celebration-left-shift',
        `${-celebrationEntrance * 4.5}vw`,
      );
      decor.style.setProperty(
        '--celebration-right-shift',
        `${celebrationEntrance * 4.5}vw`,
      );
    };

    let stop = observeScrollScene(section, stage, render);
    const changeMotion = () => {
      stop();
      lastStoryProgress = -1;
      stop = observeScrollScene(section, stage, render);
    };
    reduceMotion.addEventListener('change', changeMotion);
    return () => {
      stop();
      reduceMotion.removeEventListener('change', changeMotion);
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
              <picture>
                <source
                  media="(max-width: 700px)"
                  srcSet="/assets/optimized/hero-mobile.webp"
                />
                <img
                  ref={heroImageRef}
                  src="/assets/optimized/surprise-bros-final-stage-v6.webp"
                  alt=""
                  width={1920}
                  height={1080}
                  fetchPriority="high"
                  decoding="async"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  onLoad={() => setHeroReady(true)}
                  onError={() => setHeroReady(true)}
                />
              </picture>
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

        <SiteHeader page="home" visible={navVisible} />

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
        <div ref={storyStageRef} className="who-we-are-sticky">
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

      <FilmJourney />
    </main>
  );
}
