'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react';

type Review = {
  id: string;
  number: string;
  name: string;
  date: string;
  occasion: string;
  service: string;
  quote: string;
  balloon: 'wine' | 'pearl' | 'champagne';
  tone: 'ivory' | 'blush' | 'wine' | 'sand';
};

const reviews: Review[] = [
  {
    id: 'birthday',
    number: '01',
    name: 'Pratheep',
    date: '26 Feb 2023',
    occasion: "Son's first birthday",
    service: 'Home styling · Balloons',
    quote:
      'We planned our son’s first birthday from out of town. The team stayed responsive, shared options, and had the home ready when we arrived. We loved the result—and our baby enjoyed every bit of it.',
    balloon: 'wine',
    tone: 'ivory',
  },
  {
    id: 'cake',
    number: '02',
    name: 'Mrs. Nisha',
    date: '19 Jun 2022',
    occasion: "Father's Day surprise",
    service: 'White-forest cake · Keepsake',
    quote:
      'The video-call cake cutting, the photo slam book, even the three little pieces on the cake—every detail felt personal to our family. It was our fourth celebration with the team, and they made the day memorable again.',
    balloon: 'champagne',
    tone: 'blush',
  },
  {
    id: 'engagement',
    number: '03',
    name: 'Gifty Sahana',
    date: '26 Apr 2021',
    occasion: 'Engagement celebration',
    service: 'Stage design · Florals',
    quote:
      'They listened to every preference with patience and were genuinely friendly throughout. The decor made our engagement feel grander and more special than we had imagined.',
    balloon: 'pearl',
    tone: 'wine',
  },
  {
    id: 'event',
    number: '04',
    name: 'Niyaz',
    date: '02 Apr 2022',
    occasion: 'Event decor',
    service: 'Full-service celebration',
    quote: 'Awesome work by the Surprise Bro’s team.',
    balloon: 'wine',
    tone: 'sand',
  },
];

const ratingNotes = [
  { name: 'Suresh', date: '01 Nov 2025', balloon: 'pearl' },
  { name: 'Madevi', date: '24 Aug 2025', balloon: 'wine' },
  { name: 'Kalviselvan', date: '11 Dec 2024', balloon: 'champagne' },
  { name: 'Palani', date: '07 Nov 2024', balloon: 'pearl' },
  { name: 'Guest review', date: '07 Nov 2024', balloon: 'wine' },
  { name: 'Siva Guru', date: '28 Sep 2023', balloon: 'champagne' },
] as const;

const balloonSource = {
  wine: '/assets/reviews/balloon-wine.png',
  pearl: '/assets/reviews/balloon-pearl.png',
  champagne: '/assets/reviews/balloon-champagne.png',
};

export function ReviewsExperience() {
  const pageRef = useRef<HTMLElement>(null);
  const trailRef = useRef<HTMLElement>(null);
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    setMotionReady(true);
  }, []);

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
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const trail = trailRef.current;
    if (!trail) return;

    let frame = 0;
    const updateTrail = () => {
      const bounds = trail.getBoundingClientRect();
      const distance = Math.max(bounds.height - window.innerHeight, 1);
      const progress = Math.min(Math.max(-bounds.top / distance, 0), 1);
      trail.style.setProperty('--flight-progress', String(progress));
    };
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateTrail);
    };

    updateTrail();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <main
      ref={pageRef}
      className={`flight-page ${motionReady ? 'is-motion-ready' : ''}`}
    >
      <header className="flight-header">
        <a className="flight-brand" href="/" aria-label="Surprise Bro's home">
          <span>Surprise Bro&apos;s</span>
          <small>Events · Tirunelveli</small>
        </a>
        <nav className="flight-nav" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/gallery">Gallery</a>
          <a className="is-active" href="/reviews" aria-current="page">
            Reviews
          </a>
          <a href="https://wa.me/918488991284" target="_blank" rel="noreferrer">
            Reach out
          </a>
        </nav>
      </header>

      <section className="flight-hero" aria-labelledby="flight-heading">
        <div className="flight-hero-copy" data-reveal="copy">
          <a className="flight-back" href="/">
            <ArrowLeft aria-hidden="true" />
            Back home
          </a>
          <p className="flight-kicker">408 voices · One unbroken thread</p>
          <h1 id="flight-heading">
            Stories that
            <span>still float.</span>
          </h1>
          <p>
            Every review is tied to a real moment: a room ready on time, a cake
            made personal, a stage that felt bigger than imagined.
          </p>
          <a className="flight-follow" href="#the-thread">
            Follow the string <ArrowDown aria-hidden="true" />
          </a>
        </div>

        <div
          className="flight-hero-balloons"
          aria-hidden="true"
          data-reveal="balloons"
        >
          <img className="flight-hero-wine" src={balloonSource.wine} alt="" />
          <img className="flight-hero-pearl" src={balloonSource.pearl} alt="" />
          <img
            className="flight-hero-gold"
            src={balloonSource.champagne}
            alt=""
          />
        </div>

        <div className="flight-score" data-reveal="up">
          <strong>4.8</strong>
          <span>
            Public rating
            <small>★★★★★</small>
          </span>
        </div>
      </section>

      <nav className="flight-index" aria-label="Jump to a review occasion">
        <span>Choose a moment</span>
        <a href="#birthday">First birthday</a>
        <a href="#cake">Cake surprise</a>
        <a href="#engagement">Engagement</a>
        <a href="#event">Event decor</a>
      </nav>

      <section
        className="flight-intro"
        id="the-thread"
        aria-labelledby="thread-heading"
      >
        <p className="flight-kicker" data-reveal="up">
          Hold the line
        </p>
        <h2 id="thread-heading" data-reveal="up">
          One string.
          <span>Every kind word.</span>
        </h2>
        <p data-reveal="up">
          Scroll slowly. The thread grows with you, moving from one celebration
          to the next.
        </p>
      </section>

      <section
        ref={trailRef}
        className="flight-trail"
        aria-label="Customer review journey"
      >
        <div className="flight-spine" aria-hidden="true">
          <i />
        </div>

        {reviews.map((review, index) => (
          <section
            className={`flight-stop flight-stop-${review.tone} ${index % 2 ? 'is-reversed' : ''}`}
            id={review.id}
            key={review.number}
            aria-labelledby={`${review.id}-name`}
          >
            <div className="flight-balloon" data-reveal="float">
              <img
                src={balloonSource[review.balloon]}
                alt={`${review.balloon} helium balloon carrying review ${review.number}`}
              />
              <span aria-hidden="true">{review.number}</span>
            </div>

            <article
              className="flight-review"
              data-reveal={index % 2 ? 'left' : 'right'}
            >
              <div className="flight-review-meta">
                <span>{review.occasion}</span>
                <small>{review.service}</small>
              </div>
              <blockquote>“{review.quote}”</blockquote>
              <footer>
                <strong id={`${review.id}-name`}>{review.name}</strong>
                <span>{review.date}</span>
              </footer>
            </article>
          </section>
        ))}
      </section>

      <section className="flight-notes" aria-labelledby="notes-heading">
        <div className="flight-notes-heading" data-reveal="up">
          <p className="flight-kicker">Still rising</p>
          <h2 id="notes-heading">Six more five-star moments.</h2>
          <p>
            Public ratings posted without a written note—kept in the story, not
            pushed aside.
          </p>
        </div>

        <div className="flight-note-grid">
          {ratingNotes.map((note, index) => (
            <article
              className="flight-note"
              key={`${note.name}-${note.date}`}
              data-reveal="float"
              style={{ '--note-delay': `${index * 80}ms` } as CSSProperties}
            >
              <img
                src={balloonSource[note.balloon]}
                alt=""
                aria-hidden="true"
              />
              <div>
                <b aria-label="5 out of 5">5.0</b>
                <strong>{note.name}</strong>
                <span>{note.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flight-cta" aria-labelledby="cta-heading">
        <div className="flight-cta-image" aria-hidden="true" />
        <div className="flight-cta-copy" data-reveal="up">
          <p className="flight-kicker">The next thread starts here</p>
          <h2 id="cta-heading">Give them something worth remembering.</h2>
          <a href="https://wa.me/918488991284" target="_blank" rel="noreferrer">
            Plan your celebration <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <footer className="flight-footer">
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
