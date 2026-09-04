'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react';

type BalloonColor = 'wine' | 'pearl' | 'champagne';
type Accent = 'sapphire' | 'oxblood' | 'champagne';

type Review = {
  id: string;
  name: string;
  date: string;
  occasion?: string;
  quote?: string;
  balloon: BalloonColor;
  accent: Accent;
};

const reviews: Review[] = [
  {
    id: 'pratheep',
    name: 'Pratheep',
    date: '26 Feb 2023',
    occasion: "Son's first birthday",
    quote:
      'We planned our son’s first birthday from out of town. The team stayed responsive, shared options, and had the home ready when we arrived. We loved the result—and our baby enjoyed every bit of it.',
    balloon: 'pearl',
    accent: 'sapphire',
  },
  {
    id: 'suresh',
    name: 'Suresh',
    date: '01 Nov 2025',
    balloon: 'wine',
    accent: 'oxblood',
  },
  {
    id: 'nisha',
    name: 'Mrs. Nisha',
    date: '19 Jun 2022',
    occasion: "Father's Day surprise",
    quote:
      'The video-call cake cutting, the photo slam book, even the three little pieces on the cake—every detail felt personal to our family. It was our fourth celebration with the team, and they made the day memorable again.',
    balloon: 'champagne',
    accent: 'champagne',
  },
  {
    id: 'kalviselvan',
    name: 'Kalviselvan',
    date: '11 Dec 2024',
    balloon: 'pearl',
    accent: 'sapphire',
  },
  {
    id: 'gifty',
    name: 'Gifty Sahana',
    date: '26 Apr 2021',
    occasion: 'Engagement celebration',
    quote:
      'They listened to every preference with patience and were genuinely friendly throughout. The decor made our engagement feel grander and more special than we had imagined.',
    balloon: 'wine',
    accent: 'oxblood',
  },
  {
    id: 'palani',
    name: 'Palani',
    date: '07 Nov 2024',
    balloon: 'champagne',
    accent: 'champagne',
  },
  {
    id: 'niyaz',
    name: 'Niyaz',
    date: '02 Apr 2022',
    occasion: 'Event decor',
    quote: 'Awesome work by the Surprise Bro’s team.',
    balloon: 'pearl',
    accent: 'sapphire',
  },
  {
    id: 'madevi',
    name: 'Madevi',
    date: '24 Aug 2025',
    balloon: 'wine',
    accent: 'oxblood',
  },
  {
    id: 'guest',
    name: 'Guest review',
    date: '07 Nov 2024',
    balloon: 'champagne',
    accent: 'champagne',
  },
  {
    id: 'siva',
    name: 'Siva Guru',
    date: '28 Sep 2023',
    balloon: 'pearl',
    accent: 'sapphire',
  },
];

const balloonSource: Record<BalloonColor, string> = {
  wine: '/assets/reviews/balloon-wine.png',
  pearl: '/assets/reviews/balloon-pearl.png',
  champagne: '/assets/reviews/balloon-champagne.png',
};

export function ReviewsExperience() {
  const pageRef = useRef<HTMLElement>(null);
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    setMotionReady(true);
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const items = Array.from(page.querySelectorAll<HTMLElement>('[data-rise]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('has-risen');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={pageRef}
      className={`gift-page ${motionReady ? 'is-motion-ready' : ''}`}
    >
      <header className="gift-header">
        <a className="gift-brand" href="/" aria-label="Surprise Bro's home">
          Surprise Bro&apos;s
          <small>Tirunelveli</small>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/gallery">Gallery</a>
          <a className="is-active" href="/reviews" aria-current="page">
            Reviews
          </a>
          <a
            className="gift-contact"
            href="https://wa.me/918488991284"
            target="_blank"
            rel="noreferrer"
          >
            Get in touch
          </a>
        </nav>
      </header>

      <section className="gift-hero" aria-labelledby="gift-hero-heading">
        <div className="hero-wash hero-wash-sapphire" aria-hidden="true" />
        <div className="hero-wash hero-wash-oxblood" aria-hidden="true" />
        <div className="hero-wash hero-wash-champagne" aria-hidden="true" />

        <a className="gift-back" href="/">
          <ArrowLeft aria-hidden="true" /> Back home
        </a>

        <div className="gift-hero-copy" data-rise>
          <p className="gift-eyebrow">Customer notes · Tirunelveli</p>
          <h1 id="gift-hero-heading">
            Reviews,
            <em>tied with care.</em>
          </h1>
          <p>
            Real words from birthdays, cake surprises, engagements and family
            celebrations.
          </p>
          <div className="gift-rating">
            <strong>4.8</strong>
            <span>
              <b>★★★★★</b>
              408 public ratings
            </span>
          </div>
          <a className="gift-scroll" href="#gift-notes">
            Read the notes <ArrowDown aria-hidden="true" />
          </a>
        </div>

        <div className="hero-float hero-float-one" data-rise aria-hidden="true">
          <img src={balloonSource.wine} alt="" />
        </div>
        <div className="hero-float hero-float-two" data-rise aria-hidden="true">
          <img src={balloonSource.pearl} alt="" />
        </div>
        <div
          className="hero-float hero-float-three"
          data-rise
          aria-hidden="true"
        >
          <img src={balloonSource.champagne} alt="" />
        </div>

        <span className="gift-scribble" aria-hidden="true">
          float gently ↑
        </span>
      </section>

      <section
        className="gift-notes"
        id="gift-notes"
        aria-labelledby="gift-notes-heading"
      >
        <div className="notes-wash notes-wash-one" aria-hidden="true" />
        <div className="notes-wash notes-wash-two" aria-hidden="true" />

        <header className="gift-notes-heading" data-rise>
          <span>01—10</span>
          <h2 id="gift-notes-heading">Ten notes we kept.</h2>
          <p>
            Each review is presented as a gift tag, attached directly to its
            balloon.
          </p>
        </header>

        <div className="gift-card-grid">
          {reviews.map((review, index) => (
            <article
              className={`gift-review gift-review-${review.accent} ${review.quote ? 'has-note' : 'rating-only'}`}
              id={review.id}
              key={review.id}
              data-rise
              style={
                {
                  '--rise-delay': `${(index % 2) * 120}ms`,
                  '--tag-angle': `${[-0.65, 0.45, -0.3, 0.6][index % 4]}deg`,
                } as CSSProperties
              }
            >
              <div className="gift-balloon" aria-hidden="true">
                <img src={balloonSource[review.balloon]} alt="" />
              </div>
              <div className="gift-string" aria-hidden="true" />

              <div className="gift-card">
                <span className="gift-eyelet" aria-hidden="true" />
                <div className="gift-card-topline" aria-hidden="true" />
                <header>
                  <span>{review.occasion ?? 'Public rating'}</span>
                  <b aria-label="5 out of 5 stars">★★★★★</b>
                </header>

                {review.quote ? (
                  <blockquote>“{review.quote}”</blockquote>
                ) : (
                  <div className="gift-score-card">
                    <strong>5.0</strong>
                    <span>Public rating</span>
                  </div>
                )}

                <footer>
                  <strong>{review.name}</strong>
                  <span>{review.date}</span>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gift-cta" aria-labelledby="gift-cta-heading">
        <div className="gift-cta-balloon" aria-hidden="true">
          <img src={balloonSource.champagne} alt="" />
        </div>
        <div className="gift-cta-copy" data-rise>
          <p className="gift-eyebrow">Planning something?</p>
          <h2 id="gift-cta-heading">Tell us the date.</h2>
          <a href="https://wa.me/918488991284" target="_blank" rel="noreferrer">
            Start on WhatsApp <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <footer className="gift-footer">
        <a className="gift-brand" href="/">
          Surprise Bro&apos;s
          <small>Tirunelveli</small>
        </a>
        <p>
          Reviews are lightly edited for length and clarity. Ratings and dates
          come from the public business listing.
        </p>
        <a
          href="https://www.justdial.com/Tirunelveli/Surprise-Bros-Near-By-Primary-Health-Centre-Vannarpettai/0462PX462-X462-201205161205-C4U3_BZDET"
          target="_blank"
          rel="noreferrer"
        >
          Review source <ArrowUpRight aria-hidden="true" />
        </a>
      </footer>
    </main>
  );
}
