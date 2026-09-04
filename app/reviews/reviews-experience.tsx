'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type BalloonColor = 'wine' | 'pearl' | 'champagne';
type CardColor = 'powder' | 'cherry' | 'sand' | 'cobalt' | 'pearl';

type Review = {
  id: string;
  name: string;
  date: string;
  occasion?: string;
  quote?: string;
  balloon: BalloonColor;
  color: CardColor;
};

const reviews: Review[] = [
  {
    id: 'pratheep',
    name: 'Pratheep',
    date: '26 Feb 2023',
    occasion: "Son's first birthday",
    quote:
      'We planned our son’s first birthday from out of town. The team stayed responsive, shared options, and had the home ready when we arrived. We loved the result, and our baby enjoyed every bit of it.',
    balloon: 'pearl',
    color: 'powder',
  },
  {
    id: 'suresh',
    name: 'Suresh',
    date: '01 Nov 2025',
    balloon: 'wine',
    color: 'cherry',
  },
  {
    id: 'nisha',
    name: 'Mrs. Nisha',
    date: '19 Jun 2022',
    occasion: "Father's Day surprise",
    quote:
      'The video-call cake cutting, the photo slam book, and the three little pieces on the cake made every detail feel personal to our family. It was our fourth celebration with the team, and they made the day memorable again.',
    balloon: 'champagne',
    color: 'sand',
  },
  {
    id: 'kalviselvan',
    name: 'Kalviselvan',
    date: '11 Dec 2024',
    balloon: 'pearl',
    color: 'cobalt',
  },
  {
    id: 'gifty',
    name: 'Gifty Sahana',
    date: '26 Apr 2021',
    occasion: 'Engagement celebration',
    quote:
      'They listened to every preference with patience and were genuinely friendly throughout. The decor made our engagement feel grander and more special than we had imagined.',
    balloon: 'wine',
    color: 'pearl',
  },
  {
    id: 'palani',
    name: 'Palani',
    date: '07 Nov 2024',
    balloon: 'champagne',
    color: 'powder',
  },
  {
    id: 'niyaz',
    name: 'Niyaz',
    date: '02 Apr 2022',
    occasion: 'Event decor',
    quote: 'Awesome work by the Surprise Bro’s team.',
    balloon: 'pearl',
    color: 'cherry',
  },
  {
    id: 'madevi',
    name: 'Madevi',
    date: '24 Aug 2025',
    balloon: 'wine',
    color: 'sand',
  },
  {
    id: 'guest',
    name: 'Guest review',
    date: '07 Nov 2024',
    balloon: 'champagne',
    color: 'cobalt',
  },
  {
    id: 'siva',
    name: 'Siva Guru',
    date: '28 Sep 2023',
    balloon: 'pearl',
    color: 'pearl',
  },
];

const balloonSource: Record<BalloonColor, string> = {
  wine: '/assets/reviews/balloon-wine.png',
  pearl: '/assets/reviews/balloon-pearl.png',
  champagne: '/assets/reviews/balloon-champagne.png',
};

const heroReviews = [reviews[0], reviews[2], reviews[4]];

export function ReviewsExperience() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const items = Array.from(
      page.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <main ref={pageRef} className="lane-page is-motion-ready">
      <header className="lane-header">
        <Link className="lane-brand" href="/" aria-label="Surprise Bro's home">
          Surprise Bro&apos;s
          <small>Tirunelveli</small>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/">Home</Link>
          <Link href="/gallery">Gallery</Link>
          <Link className="is-active" href="/reviews" aria-current="page">
            Reviews
          </Link>
          <a
            className="lane-contact"
            href="https://wa.me/918488991284"
            target="_blank"
            rel="noreferrer"
          >
            Contact
          </a>
        </nav>
      </header>

      <section className="lane-hero" aria-labelledby="lane-heading">
        <div className="lane-grid-lines" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="lane-hero-copy" data-reveal>
          <Link className="lane-back" href="/">
            <ArrowLeft aria-hidden="true" /> Back home
          </Link>
          <p className="lane-label">Surprise Bro&apos;s customer reviews</p>
          <h1 id="lane-heading">
            Customer
            <em>reviews.</em>
          </h1>
          <p>Reviews from the public Surprise Bro&apos;s business listing.</p>
          <div className="lane-score">
            <strong>4.8</strong>
            <span>
              <b>★★★★★</b>
              408 public ratings
            </span>
          </div>
          <a className="lane-jump" href="#all-reviews">
            View all reviews <ArrowDown aria-hidden="true" />
          </a>
        </div>

        <div
          className="lane-hero-collage"
          aria-label="Selected customer reviews"
        >
          {heroReviews.map((review, index) => (
            <article
              className={`hero-review hero-review-${review.color}`}
              key={review.id}
              data-reveal
              style={{ '--reveal-delay': `${index * 110}ms` } as CSSProperties}
            >
              <div className="hero-review-balloon" aria-hidden="true">
                <Image
                  src={balloonSource[review.balloon]}
                  alt=""
                  width={1024}
                  height={1536}
                  sizes="9rem"
                />
              </div>
              <div className="hero-review-string" aria-hidden="true" />
              <div className="hero-review-card">
                <span className="hero-card-eyelet" aria-hidden="true" />
                <blockquote>“{review.quote}”</blockquote>
                <footer>{review.name}</footer>
              </div>
            </article>
          ))}
        </div>
      </section>

      <nav className="lane-strip" aria-label="Review categories">
        <a href="#featured">First birthdays</a>
        <a href="#all-reviews">Cake surprises</a>
        <a href="#all-reviews">Engagement decor</a>
        <a href="#all-reviews">Event styling</a>
      </nav>

      <section
        className="lane-feature"
        id="featured"
        aria-labelledby="featured-heading"
      >
        <div className="lane-feature-copy" data-reveal>
          <p className="lane-label">Featured review</p>
          <h2 id="featured-heading">
            First birthday.
            <em>Ready on arrival.</em>
          </h2>
          <blockquote>“{reviews[0].quote}”</blockquote>
          <footer>
            <strong>{reviews[0].name}</strong>
            <span>{reviews[0].date}</span>
          </footer>
        </div>

        <div className="lane-feature-visual" data-reveal>
          <div className="feature-balloon" aria-hidden="true">
            <Image
              src={balloonSource.pearl}
              alt=""
              width={1024}
              height={1536}
              sizes="14rem"
            />
          </div>
          <div className="feature-string" aria-hidden="true" />
          <div className="feature-card">
            <span className="feature-eyelet" aria-hidden="true" />
            <small>First birthday</small>
            <strong>5.0</strong>
            <span>26 Feb 2023</span>
          </div>
        </div>
      </section>

      <section
        className="lane-wall"
        id="all-reviews"
        aria-labelledby="all-reviews-heading"
      >
        <div className="wall-balloon wall-balloon-left" aria-hidden="true">
          <Image
            src={balloonSource.wine}
            alt=""
            width={1024}
            height={1536}
            sizes="12rem"
          />
        </div>
        <div className="wall-balloon wall-balloon-right" aria-hidden="true">
          <Image
            src={balloonSource.champagne}
            alt=""
            width={1024}
            height={1536}
            sizes="12rem"
          />
        </div>

        <header className="lane-wall-heading" data-reveal>
          <p className="lane-label">All reviews</p>
          <h2 id="all-reviews-heading">Customer reviews.</h2>
        </header>

        <div className="lane-card-wall">
          {reviews.map((review, index) => (
            <article
              className={`lane-review lane-review-${review.color} ${review.quote ? 'has-written-review' : 'has-rating-only'}`}
              id={review.id}
              key={review.id}
              data-reveal
              style={
                { '--reveal-delay': `${(index % 3) * 90}ms` } as CSSProperties
              }
            >
              <div className="lane-review-balloon" aria-hidden="true">
                <Image
                  src={balloonSource[review.balloon]}
                  alt=""
                  width={1024}
                  height={1536}
                  sizes="7rem"
                />
              </div>
              <div className="lane-review-string" aria-hidden="true" />
              <div className="lane-review-frame">
                <div className="lane-review-card">
                  <span className="lane-card-eyelet" aria-hidden="true" />
                  <header>
                    <span>{review.occasion ?? 'Public rating'}</span>
                    <b aria-label="5 out of 5 stars">★★★★★</b>
                  </header>

                  {review.quote ? (
                    <blockquote>“{review.quote}”</blockquote>
                  ) : (
                    <div className="lane-rating-only">
                      <strong>5.0</strong>
                      <span>Public rating</span>
                    </div>
                  )}

                  <footer>
                    <strong>{review.name}</strong>
                    <span>{review.date}</span>
                  </footer>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="lane-cta" aria-labelledby="lane-cta-heading">
        <div data-reveal>
          <p className="lane-label">Surprise Bro&apos;s</p>
          <h2 id="lane-cta-heading">Planning a celebration?</h2>
          <a href="https://wa.me/918488991284" target="_blank" rel="noreferrer">
            Contact us <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <footer className="lane-footer">
        <Link className="lane-brand" href="/">
          Surprise Bro&apos;s
          <small>Tirunelveli</small>
        </Link>
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
