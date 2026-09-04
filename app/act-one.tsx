"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Reach out", href: "/#reach-out" },
];

export function ActOne() {
  const heroImageRef = useRef<HTMLImageElement>(null);
  const patchRef = useRef<HTMLDivElement>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const [heroReady, setHeroReady] = useState(false);
  const [curtainReady, setCurtainReady] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const heroImage = heroImageRef.current;
    if (heroImage?.complete && heroImage.naturalWidth > 0) setHeroReady(true);
  }, []);

  useEffect(() => {
    let active = true;
    const curtain = new window.Image();

    curtain.onload = () => active && setCurtainReady(true);
    curtain.onerror = () => active && setCurtainReady(true);
    curtain.src = "/assets/maroon-satin-curtain-v2.png";

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!heroReady || !curtainReady) return;

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setIsRevealed(true));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [heroReady, curtainReady]);

  useEffect(
    () => () => {
      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }
    },
    [],
  );

  const updatePatchTilt = (x: number, y: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (pointerFrameRef.current !== null) {
      window.cancelAnimationFrame(pointerFrameRef.current);
    }

    pointerFrameRef.current = window.requestAnimationFrame(() => {
      const patch = patchRef.current;
      if (!patch) return;

      patch.style.setProperty(
        "--patch-rotate-x",
        `${(-y * 3.4).toFixed(2)}deg`,
      );
      patch.style.setProperty("--patch-rotate-y", `${(x * 4.2).toFixed(2)}deg`);
      patch.style.setProperty("--patch-shift-x", `${(x * 5).toFixed(2)}px`);
      patch.style.setProperty("--patch-shift-y", `${(y * 4).toFixed(2)}px`);
    });
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    updatePatchTilt(x, y);
  };

  const handlePointerLeave = () => updatePatchTilt(0, 0);

  return (
    <main className="act-one-page">
      <section
        id="home"
        className={`act-one-stage ${isRevealed ? "is-revealed" : ""}`}
        aria-label="Surprise Bro's introduction"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="hero-media" aria-hidden="true">
          <div ref={patchRef} className="hero-patch">
            <div className="hero-patch-image">
              <Image
                ref={heroImageRef}
                src="/assets/surprise-bros-white-studio-hero-v3.png"
                alt=""
                fill
                priority
                sizes="(max-width: 560px) 78vw, (max-width: 820px) 48vw, 27vw"
                onLoad={() => setHeroReady(true)}
              />
            </div>
          </div>
        </div>

        <header className="site-header">
          <Link
            className="brand-lockup"
            href="/"
            aria-label="Surprise Bro's home"
          >
            <span>Surprise Bro&apos;s</span>
            <small>Tirunelveli</small>
          </Link>

          <nav className="primary-nav" aria-label="Primary navigation">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={index === 0 ? "is-active" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="hero-copy">
          <p className="hero-kicker">Celebrations, styled in Tirunelveli</p>
          <h1>Make it memorable.</h1>
        </div>

        <div className="theatre-curtain" aria-hidden="true">
          <div className="curtain-panel curtain-panel-left" />
          <div className="curtain-panel curtain-panel-right" />
          <div className="curtain-seam" />
        </div>
      </section>
    </main>
  );
}
