'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Reach out', href: '/#reach-out' },
];

export function ActOne() {
  const heroImageRef = useRef<HTMLImageElement>(null);
  const replayTimerRef = useRef<number | null>(null);
  const [heroReady, setHeroReady] = useState(false);
  const [curtainReady, setCurtainReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copyVisible, setCopyVisible] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [sequence, setSequence] = useState(0);

  useEffect(() => {
    const heroImage = heroImageRef.current;
    if (heroImage?.complete && heroImage.naturalWidth > 0) setHeroReady(true);
  }, []);

  useEffect(() => {
    let active = true;
    const curtain = new window.Image();

    curtain.onload = () => active && setCurtainReady(true);
    curtain.onerror = () => active && setCurtainReady(true);
    curtain.src = '/assets/theatrical-curtain-overlay.png';

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!heroReady || !curtainReady) return;

    const openingTimer = window.setTimeout(() => setIsOpen(true), 520);
    return () => window.clearTimeout(openingTimer);
  }, [heroReady, curtainReady, sequence]);

  useEffect(() => {
    const revealCopy = () => {
      const threshold = Math.min(150, window.innerHeight * 0.1);
      setCopyVisible(isOpen && window.scrollY >= threshold);
    };

    revealCopy();
    window.addEventListener('scroll', revealCopy, { passive: true });
    window.addEventListener('resize', revealCopy);

    return () => {
      window.removeEventListener('scroll', revealCopy);
      window.removeEventListener('resize', revealCopy);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (replayTimerRef.current) window.clearTimeout(replayTimerRef.current);
    };
  }, []);

  const replayReveal = () => {
    if (isResetting) return;

    setIsResetting(true);
    setCopyVisible(false);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    replayTimerRef.current = window.setTimeout(() => {
      setSequence((value) => value + 1);
      setIsResetting(false);
    }, 3650);
  };

  return (
    <main className="act-one-page">
      <section
        id="home"
        className={`act-one-stage ${isOpen ? 'is-open' : ''} ${copyVisible ? 'copy-visible' : ''}`}
        aria-label="Surprise Bro's theatrical introduction"
      >
        <div className="hero-media" aria-hidden="true">
          <img
            ref={heroImageRef}
            src="/assets/surprise-bros-studio-hero-v2.png"
            alt=""
            onLoad={() => setHeroReady(true)}
          />
        </div>

        <div className="studio-blackout" aria-hidden="true" />
        <div className="lamp-glow lamp-glow-one" aria-hidden="true" />
        <div className="lamp-glow lamp-glow-two" aria-hidden="true" />
        <div className="light-ignition" aria-hidden="true" />

        <header className="site-header">
          <a className="brand-lockup" href="/" aria-label="Surprise Bro's home">
            <strong>Surprise Bro&apos;s</strong>
            <small>Events · Tirunelveli</small>
          </a>

          <nav className="primary-nav" aria-label="Primary navigation">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={index === 0 ? 'is-active' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        <div className="hero-copy">
          <p className="hero-kicker">Thoughtfully composed celebrations</p>
          <h1 aria-label="It all begins with good design">
            <span className="line-mask">
              <span className="headline-line headline-line-one">It all</span>
            </span>
            <span className="line-mask">
              <span className="headline-line headline-line-two">
                begins with
              </span>
            </span>
            <span className="line-mask">
              <span className="headline-line headline-line-three">
                good design.
              </span>
            </span>
          </h1>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span>Scroll to reveal</span>
          <i />
        </div>

        <Button
          type="button"
          variant="ghost"
          className="replay-button"
          onClick={replayReveal}
          disabled={isResetting}
          aria-label="Replay the curtain reveal"
        >
          <RotateCcw aria-hidden="true" />
          <span>Replay</span>
        </Button>

        <div className="theatre-curtain" aria-hidden="true">
          <div className="curtain-panel curtain-panel-left" />
          <div className="curtain-panel curtain-panel-right" />
          <div className="curtain-valance" />
          <div className="curtain-seam" />
        </div>
      </section>
    </main>
  );
}
