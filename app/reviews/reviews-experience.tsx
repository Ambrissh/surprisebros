'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react';

type BalloonColor = 'wine' | 'pearl' | 'champagne';
type CardColor = 'aqua' | 'butter' | 'coral';

type Review = {
  id: string;
  name: string;
  date: string;
  occasion: string;
  quote?: string;
  balloon: BalloonColor;
  card: CardColor;
  ratingOnly?: boolean;
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
    card: 'butter',
  },
  {
    id: 'suresh',
    name: 'Suresh',
    date: '01 Nov 2025',
    occasion: 'A five-star hello',
    balloon: 'wine',
    card: 'aqua',
    ratingOnly: true,
  },
  {
    id: 'nisha',
    name: 'Mrs. Nisha',
    date: '19 Jun 2022',
    occasion: "Father's Day surprise",
    quote:
      'The video-call cake cutting, the photo slam book, even the three little pieces on the cake—every detail felt personal to our family. It was our fourth celebration with the team, and they made the day memorable again.',
    balloon: 'champagne',
    card: 'coral',
  },
  {
    id: 'kalviselvan',
    name: 'Kalviselvan',
    date: '11 Dec 2024',
    occasion: 'Five stars, sent our way',
    balloon: 'pearl',
    card: 'butter',
    ratingOnly: true,
  },
  {
    id: 'gifty',
    name: 'Gifty Sahana',
    date: '26 Apr 2021',
    occasion: 'Engagement celebration',
    quote:
      'They listened to every preference with patience and were genuinely friendly throughout. The decor made our engagement feel grander and more special than we had imagined.',
    balloon: 'wine',
    card: 'aqua',
  },
  {
    id: 'palani',
    name: 'Palani',
    date: '07 Nov 2024',
    occasion: 'A little five-star lift',
    balloon: 'champagne',
    card: 'coral',
    ratingOnly: true,
  },
  {
    id: 'niyaz',
    name: 'Niyaz',
    date: '02 Apr 2022',
    occasion: 'Event decor',
    quote: 'Awesome work by the Surprise Bro’s team.',
    balloon: 'pearl',
    card: 'butter',
  },
  {
    id: 'madevi',
    name: 'Madevi',
    date: '24 Aug 2025',
    occasion: 'Five stars in the air',
    balloon: 'wine',
    card: 'aqua',
    ratingOnly: true,
  },
  {
    id: 'guest',
    name: 'Guest review',
    date: '07 Nov 2024',
    occasion: 'Five stars, no note needed',
    balloon: 'champagne',
    card: 'coral',
    ratingOnly: true,
  },
  {
    id: 'siva',
    name: 'Siva Guru',
    date: '28 Sep 2023',
    occasion: 'Another five-star moment',
    balloon: 'pearl',
    card: 'butter',
    ratingOnly: true,
  },
];

const balloonSource: Record<BalloonColor, string> = {
  wine: '/assets/reviews/balloon-wine.png',
  pearl: '/assets/reviews/balloon-pearl.png',
  champagne: '/assets/reviews/balloon-champagne.png',
};

const bubbleLetters = 'Kind words'.split('');

export function ReviewsExperience() {
  const pageRef = useRef<HTMLElement>(null);
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    setMotionReady(true);
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const items = Array.from(
      page.querySelectorAll<HTMLElement>('[data-float-in]'),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-floating-in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={pageRef}
      className={`balloon-page ${motionReady ? 'is-motion-ready' : ''}`}
    >
      <header className="balloon-header">
        <a className="balloon-brand" href="/" aria-label="Surprise Bro's home">
          Surprise Bro&apos;s
          <small>tirunelveli</small>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/gallery">Gallery</a>
          <a className="is-active" href="/reviews" aria-current="page">
            Reviews
          </a>
          <a
            className="balloon-nav-cta"
            href="https://wa.me/918488991284"
            target="_blank"
            rel="noreferrer"
          >
            Plan a surprise
          </a>
        </nav>
      </header>

      <section className="balloon-hero" aria-labelledby="balloon-heading">
        <div className="color-swoop color-swoop-aqua" aria-hidden="true" />
        <div className="color-swoop color-swoop-butter" aria-hidden="true" />
        <div className="color-swoop color-swoop-coral" aria-hidden="true" />

        <a className="balloon-back" href="/">
          <ArrowLeft aria-hidden="true" /> Back home
        </a>

        <div className="balloon-hero-copy" data-float-in>
          <p className="doodle-note">real notes from real celebrations</p>
          <h1 id="balloon-heading">
            <span className="bubble-word" aria-label="Kind words">
              {bubbleLetters.map((letter, index) => (
                <i
                  aria-hidden="true"
                  key={`${letter}-${index}`}
                  style={{ '--letter': index } as CSSProperties}
                >
                  {letter === ' ' ? '\u00a0' : letter}
                </i>
              ))}
            </span>
            <em>keep us floating.</em>
          </h1>
          <p className="balloon-hero-intro">
            Every string leads to somebody&apos;s day—a first birthday, a cake
            call, an engagement, or one happy five-star tap.
          </p>
          <div className="balloon-hero-actions">
            <a href="#review-sky">
              Follow the balloons <ArrowDown aria-hidden="true" />
            </a>
            <span>
              <b>4.8</b> from 408 public ratings
            </span>
          </div>
        </div>

        <div
          className="hero-balloon hero-balloon-one"
          aria-hidden="true"
          data-float-in
        >
          <img src={balloonSource.wine} alt="" />
          <span>birthdays</span>
        </div>
        <div
          className="hero-balloon hero-balloon-two"
          aria-hidden="true"
          data-float-in
        >
          <img src={balloonSource.champagne} alt="" />
          <span>cake calls</span>
        </div>
        <div
          className="hero-balloon hero-balloon-three"
          aria-hidden="true"
          data-float-in
        >
          <img src={balloonSource.pearl} alt="" />
          <span>big days</span>
        </div>

        <span className="hero-doodle hero-doodle-one" aria-hidden="true">
          up, up
        </span>
        <span className="hero-doodle hero-doodle-two" aria-hidden="true">
          ↗
        </span>
      </section>

      <nav className="occasion-strip" aria-label="Review occasions">
        <span>Birthday rooms</span>
        <i aria-hidden="true">✦</i>
        <span>Cakes &amp; calls</span>
        <i aria-hidden="true">✦</i>
        <span>Engagement stages</span>
        <i aria-hidden="true">✦</i>
        <span>Little surprises</span>
      </nav>

      <section
        className="review-sky"
        id="review-sky"
        aria-labelledby="review-sky-heading"
      >
        <div className="sky-shape sky-shape-aqua" aria-hidden="true" />
        <div className="sky-shape sky-shape-coral" aria-hidden="true" />
        <div className="sky-shape sky-shape-butter" aria-hidden="true" />

        <div className="review-sky-heading" data-float-in>
          <p className="doodle-note">pull a string. meet a moment.</p>
          <h2 id="review-sky-heading">The good word gets airborne.</h2>
          <p>
            Every card is tied to its balloon. Scroll and watch the whole wall
            rise.
          </p>
        </div>

        <div className="balloon-review-grid">
          {reviews.map((review, index) => (
            <article
              className={`balloon-review balloon-review-${review.card} ${review.ratingOnly ? 'is-rating-only' : ''}`}
              id={review.id}
              key={review.id}
              data-float-in
              style={
                {
                  '--float-delay': `${(index % 3) * 100}ms`,
                  '--card-turn': `${[-1.2, 0.9, -0.5, 1.4][index % 4]}deg`,
                } as CSSProperties
              }
            >
              <div className="review-balloon" aria-hidden="true">
                <img src={balloonSource[review.balloon]} alt="" />
              </div>
              <div className="review-string" aria-hidden="true">
                <i />
              </div>
              <div className="review-card">
                <span className="card-hole" aria-hidden="true" />
                <header>
                  <span>{review.occasion}</span>
                  <b aria-label="5 out of 5 stars">★★★★★</b>
                </header>
                {review.quote ? (
                  <blockquote>“{review.quote}”</blockquote>
                ) : (
                  <p className="five-star-note">
                    <strong>5.0</strong>
                    A five-star rating, left without a written note.
                  </p>
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

      <section className="balloon-cta" aria-labelledby="balloon-cta-heading">
        <div className="cta-balloon cta-balloon-left" aria-hidden="true">
          <img src={balloonSource.pearl} alt="" />
        </div>
        <div className="cta-balloon cta-balloon-right" aria-hidden="true">
          <img src={balloonSource.wine} alt="" />
        </div>
        <div className="balloon-cta-card" data-float-in>
          <p className="doodle-note">have a date in mind?</p>
          <h2 id="balloon-cta-heading">
            Let&apos;s make the next good story yours.
          </h2>
          <a href="https://wa.me/918488991284" target="_blank" rel="noreferrer">
            Tell us the date <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <footer className="balloon-footer">
        <a className="balloon-brand" href="/">
          Surprise Bro&apos;s
          <small>tirunelveli</small>
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
