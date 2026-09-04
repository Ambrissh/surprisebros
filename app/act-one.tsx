'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Reach out', href: '/#reach-out' },
];

export function ActOne() {
  const heroImageRef = useRef<HTMLImageElement>(null);
  const [heroReady, setHeroReady] = useState(false);
  const [curtainReady, setCurtainReady] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
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

    const timers = [
      window.setTimeout(() => setIsOpening(true), 520),
      window.setTimeout(() => setLightsOn(true), 4920),
      window.setTimeout(() => setSceneVisible(true), 5180),
      window.setTimeout(() => setContentVisible(true), 5720),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [heroReady, curtainReady, sequence]);

  const replayReveal = () => {
    setIsOpening(false);
    setLightsOn(false);
    setSceneVisible(false);
    setContentVisible(false);
    setSequence((value) => value + 1);
  };

  return (
    <main className="act-one-page">
      <section
        id="home"
        className={`act-one-stage ${isOpening ? 'is-opening' : ''} ${lightsOn ? 'lights-on' : ''} ${sceneVisible ? 'scene-visible' : ''} ${contentVisible ? 'content-visible' : ''}`}
        aria-label="Surprise Bro's theatrical introduction"
      >
        <div className="hero-media" aria-hidden="true">
          <Image
            ref={heroImageRef}
            src="/assets/surprise-bros-black-stage-hero-v3.png"
            alt=""
            fill
            priority
            sizes="100vw"
            onLoad={() => setHeroReady(true)}
          />
        </div>

        <div className="lamp-glow lamp-glow-one" aria-hidden="true" />
        <div className="lamp-glow lamp-glow-two" aria-hidden="true" />
        <div className="light-ignition" aria-hidden="true" />

        <header className="site-header">
          <Link className="brand-lockup" href="/" aria-label="Surprise Bro's home">
            <strong>Surprise Bro&apos;s</strong>
            <small>Events · Tirunelveli</small>
          </Link>

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
          <p className="hero-signature">Celebrations, thoughtfully composed.</p>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="replay-button"
          onClick={replayReveal}
          aria-label="Replay the curtain reveal"
        >
          <RotateCcw aria-hidden="true" />
          <span>Replay</span>
        </Button>

        <div className="theatre-curtain" aria-hidden="true">
          <div className="curtain-panel curtain-panel-left" />
          <div className="curtain-panel curtain-panel-right" />
          <div className="curtain-seam" />
        </div>
      </section>
    </main>
  );
}
