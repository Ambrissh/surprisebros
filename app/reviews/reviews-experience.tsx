'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

type ReviewCategory =
  | 'All'
  | 'Home celebrations'
  | 'Cakes & gifts'
  | 'Wedding decor';

type Review = {
  number: string;
  name: string;
  date: string;
  occasion: string;
  category: Exclude<ReviewCategory, 'All'>;
  quote: string;
};

const categories: ReviewCategory[] = [
  'All',
  'Home celebrations',
  'Cakes & gifts',
  'Wedding decor',
];

const reviews: Review[] = [
  {
    number: '01',
    name: 'Pratheep',
    date: '26 Feb 2023',
    occasion: "Son's first birthday",
    category: 'Home celebrations',
    quote:
      'We planned our son’s first birthday from out of town. The team stayed responsive, shared options, and had the home ready when we arrived. We loved the result—and our baby enjoyed every bit of it.',
  },
  {
    number: '02',
    name: 'Mrs. Nisha',
    date: '19 Jun 2022',
    occasion: "Father's Day surprise",
    category: 'Cakes & gifts',
    quote:
      'The video-call cake cutting, the photo slam book, even the three little pieces on the white-forest cake—every detail felt personal to our family. It was our fourth celebration with the team, and they made the day memorable again.',
  },
  {
    number: '03',
    name: 'Gifty Sahana',
    date: '26 Apr 2021',
    occasion: 'Engagement celebration',
    category: 'Wedding decor',
    quote:
      'They listened to every preference with patience and were genuinely friendly throughout. The decor made our engagement feel grander and more special than we had imagined.',
  },
  {
    number: '04',
    name: 'Niyaz',
    date: '02 Apr 2022',
    occasion: 'Event decor',
    category: 'Wedding decor',
    quote: 'Awesome work by the Surprise Bro’s team.',
  },
];

const recentRatings = [
  { name: 'Suresh', date: '01 Nov 2025' },
  { name: 'Madevi', date: '24 Aug 2025' },
  { name: 'Kalviselvan', date: '11 Dec 2024' },
  { name: 'Palani', date: '07 Nov 2024' },
  { name: 'Siva Guru', date: '28 Sep 2023' },
  { name: 'Guest review', date: '07 Nov 2024' },
];

export function ReviewsExperience() {
  const [activeCategory, setActiveCategory] = useState<ReviewCategory>('All');

  const visibleReviews = useMemo(
    () =>
      activeCategory === 'All'
        ? reviews
        : reviews.filter((review) => review.category === activeCategory),
    [activeCategory],
  );

  return (
    <main className="reviews-page">
      <header className="reviews-header">
        <a className="reviews-brand" href="/" aria-label="Surprise Bro's home">
          <span>Surprise Bro&apos;s</span>
          <small>Events · Tirunelveli</small>
        </a>

        <nav className="reviews-nav" aria-label="Primary navigation">
          <a href="/#home">Home</a>
          <a href="/#gallery">Gallery</a>
          <a className="is-active" href="/reviews" aria-current="page">
            Reviews
          </a>
          <a href="https://wa.me/918488991284" target="_blank" rel="noreferrer">
            Reach out
          </a>
        </nav>
      </header>

      <section className="reviews-hero" aria-labelledby="reviews-heading">
        <a className="reviews-back" href="/">
          <ArrowLeft aria-hidden="true" />
          Back to the story
        </a>

        <div className="reviews-hero-grid">
          <div className="reviews-title-block">
            <p className="reviews-kicker">Act III · In their words</p>
            <h1 id="reviews-heading">
              Kind words,
              <br />
              <em>kept close.</em>
            </h1>
          </div>

          <div className="reviews-intro">
            <p>
              From birthday balloons and cakes to engagement stages, these are
              the details families remembered after the lights came down.
            </p>

            <div
              className="reviews-score"
              aria-label="4.8 out of 5 from 408 public ratings"
            >
              <strong>4.8</strong>
              <div>
                <span aria-hidden="true">★★★★★</span>
                <small>408 public ratings</small>
              </div>
            </div>
          </div>
        </div>

        <figure className="reviews-hero-image">
          <img
            src="/assets/gallery/moment-01.jpg"
            alt="A flower-lined outdoor celebration aisle prepared for guests"
          />
          <figcaption>
            <span>Every setup starts as a promise.</span>
            <small>Tirunelveli · Since 2019</small>
          </figcaption>
        </figure>
      </section>

      <section className="review-index" aria-labelledby="review-index-heading">
        <div className="review-index-heading">
          <p className="reviews-kicker">The review book</p>
          <h2 id="review-index-heading">Moments, remembered.</h2>
        </div>

        <div
          className="review-filters"
          role="group"
          aria-label="Filter reviews by service"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={category === activeCategory ? 'is-active' : undefined}
              aria-pressed={category === activeCategory}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="review-list" aria-live="polite">
          {visibleReviews.map((review) => (
            <article className="review-entry" key={review.number}>
              <div className="review-number" aria-hidden="true">
                {review.number}
              </div>

              <div className="review-occasion">
                <span>{review.category}</span>
                <p>{review.occasion}</p>
              </div>

              <div className="review-words">
                <blockquote>“{review.quote}”</blockquote>
                <footer>
                  <strong>{review.name}</strong>
                  <span>{review.date}</span>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="reviews-note" aria-label="Review context">
        <p>
          What stays with people isn&apos;t only the stage. It&apos;s the calm
          replies, the on-time setup, and the small personal detail nobody
          expected.
        </p>
        <span>— The thread running through the reviews</span>
      </aside>

      <section
        className="rating-ledger"
        aria-labelledby="rating-ledger-heading"
      >
        <div className="rating-ledger-title">
          <p className="reviews-kicker">Also in the book</p>
          <h2 id="rating-ledger-heading">Recent ratings</h2>
          <p>
            Public rating entries without written notes. Included here so the
            record stays complete.
          </p>
        </div>

        <div className="rating-ledger-list">
          {recentRatings.map((rating, index) => (
            <div
              className="rating-ledger-entry"
              key={`${rating.name}-${rating.date}`}
            >
              <span>{String(index + 5).padStart(2, '0')}</span>
              <strong>{rating.name}</strong>
              <small>{rating.date}</small>
              <b aria-label="5 out of 5">5.0</b>
            </div>
          ))}
        </div>
      </section>

      <section className="reviews-cta" aria-labelledby="reviews-cta-heading">
        <div>
          <p className="reviews-kicker">Your occasion, next</p>
          <h2 id="reviews-cta-heading">
            Let&apos;s make it worth remembering.
          </h2>
        </div>
        <a href="https://wa.me/918488991284" target="_blank" rel="noreferrer">
          Plan a celebration
          <ArrowUpRight aria-hidden="true" />
        </a>
      </section>

      <footer className="reviews-footer">
        <div>
          <strong>Surprise Bro&apos;s</strong>
          <span>Balloon decor · Cakes · Surprises · Weddings</span>
        </div>
        <p>
          Reviews are lightly edited for length and clarity. Ratings and dates
          are based on the public business listing.
        </p>
        <a
          href="https://www.justdial.com/Tirunelveli/Surprise-Bros-Near-By-Primary-Health-Centre-Vannarpettai/0462PX462-X462-201205161205-C4U3_BZDET"
          target="_blank"
          rel="noreferrer"
        >
          View source <ArrowUpRight aria-hidden="true" />
        </a>
      </footer>
    </main>
  );
}
