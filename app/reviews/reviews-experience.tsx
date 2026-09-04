'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react';

type ReviewCategory =
  | 'All stories'
  | 'Birthday magic'
  | 'Cakes & surprises'
  | 'Wedding moments';

type Review = {
  number: string;
  name: string;
  date: string;
  occasion: string;
  category: Exclude<ReviewCategory, 'All stories'>;
  quote: string;
  color: 'coral' | 'marigold' | 'mint' | 'lilac';
};

const categories: ReviewCategory[] = [
  'All stories',
  'Birthday magic',
  'Cakes & surprises',
  'Wedding moments',
];

const reviews: Review[] = [
  {
    number: '01',
    name: 'Pratheep',
    date: '26 Feb 2023',
    occasion: "Son's first birthday",
    category: 'Birthday magic',
    quote:
      'We planned our son’s first birthday from out of town. The team stayed responsive, shared options, and had the home ready when we arrived. We loved the result—and our baby enjoyed every bit of it.',
    color: 'mint',
  },
  {
    number: '02',
    name: 'Mrs. Nisha',
    date: '19 Jun 2022',
    occasion: "Father's Day surprise",
    category: 'Cakes & surprises',
    quote:
      'The video-call cake cutting, the photo slam book, even the three little pieces on the white-forest cake—every detail felt personal to our family. It was our fourth celebration with the team, and they made the day memorable again.',
    color: 'marigold',
  },
  {
    number: '03',
    name: 'Gifty Sahana',
    date: '26 Apr 2021',
    occasion: 'Engagement celebration',
    category: 'Wedding moments',
    quote:
      'They listened to every preference with patience and were genuinely friendly throughout. The decor made our engagement feel grander and more special than we had imagined.',
    color: 'coral',
  },
  {
    number: '04',
    name: 'Niyaz',
    date: '02 Apr 2022',
    occasion: 'Event decor',
    category: 'Wedding moments',
    quote: 'Awesome work by the Surprise Bro’s team.',
    color: 'lilac',
  },
];

const ratingBalloons = [
  { name: 'Suresh', date: '01 Nov 2025', color: 'coral' },
  { name: 'Madevi', date: '24 Aug 2025', color: 'mint' },
  { name: 'Kalviselvan', date: '11 Dec 2024', color: 'marigold' },
  { name: 'Palani', date: '07 Nov 2024', color: 'lilac' },
  { name: 'Guest review', date: '07 Nov 2024', color: 'coral' },
  { name: 'Siva Guru', date: '28 Sep 2023', color: 'marigold' },
] as const;

const celebrationCombos = [
  {
    number: '01',
    title: 'Birthday magic',
    detail: 'Balloon styling · cake moment · home reveal',
    category: 'Birthday magic' as const,
    color: 'coral',
  },
  {
    number: '02',
    title: 'Cakes & surprises',
    detail: 'Personal cake · keepsake · video-call celebration',
    category: 'Cakes & surprises' as const,
    color: 'marigold',
  },
  {
    number: '03',
    title: 'Wedding moments',
    detail: 'Stage design · florals · lighting and finish',
    category: 'Wedding moments' as const,
    color: 'mint',
  },
];

export function ReviewsExperience() {
  const pageRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] =
    useState<ReviewCategory>('All stories');
  const [motionReady, setMotionReady] = useState(false);

  const visibleReviews = useMemo(
    () =>
      activeCategory === 'All stories'
        ? reviews
        : reviews.filter((review) => review.category === activeCategory),
    [activeCategory],
  );

  useEffect(() => {
    setMotionReady(true);
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const revealItems = Array.from(
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [activeCategory]);

  const chooseCombo = (category: Exclude<ReviewCategory, 'All stories'>) => {
    setActiveCategory(category);
    window.requestAnimationFrame(() => {
      document
        .querySelector('#review-wall')
        ?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <main
      ref={pageRef}
      className={`story-page ${motionReady ? 'is-motion-ready' : ''}`}
    >
      <header className="story-header">
        <a className="story-brand" href="/" aria-label="Surprise Bro's home">
          <span>Surprise Bro&apos;s</span>
          <small>Events · Tirunelveli</small>
        </a>

        <nav className="story-nav" aria-label="Primary navigation">
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

      <section className="story-hero" aria-labelledby="story-heading">
        <div className="story-hero-copy" data-reveal="left">
          <a className="story-back" href="/">
            <ArrowLeft aria-hidden="true" />
            Back to the celebration
          </a>

          <p className="story-eyebrow">The happy-after archive</p>
          <h1 id="story-heading">
            Big days.
            <em>Better stories.</em>
          </h1>
          <p className="story-deck">
            From last-minute birthday balloons to cakes made personal and stages
            built for a once-in-a-lifetime entrance—these are the moments
            families kept talking about.
          </p>
          <a className="story-jump" href="#review-wall">
            Read their stories
            <ArrowDown aria-hidden="true" />
          </a>
        </div>

        <div
          className="story-collage"
          data-reveal="scale"
          aria-label="Celebration memories"
        >
          <div className="story-collage-orbit" aria-hidden="true" />
          <figure className="story-photo story-photo-back">
            <img
              src="/assets/gallery/moment-05.jpg"
              alt="A warmly lit celebration venue with balloon details"
            />
          </figure>
          <figure className="story-photo story-photo-side">
            <img
              src="/assets/gallery/moment-08.jpg"
              alt="A flower-framed wedding stage ready for the couple"
            />
          </figure>
          <article className="story-letter">
            <span>One family. Fourth celebration.</span>
            <blockquote>
              “Every little detail felt personal to us. They made the day
              memorable again.”
            </blockquote>
            <footer>
              <strong>Mrs. Nisha</strong>
              <small>Father&apos;s Day surprise</small>
            </footer>
          </article>
          <span
            className="story-scribble story-scribble-top"
            aria-hidden="true"
          >
            made personal
          </span>
          <span
            className="story-scribble story-scribble-bottom"
            aria-hidden="true"
          >
            on time ✓
          </span>
        </div>
      </section>

      <section className="story-proof" aria-label="What clients mention most">
        {[
          ['Calls answered', 'When the plan changes'],
          ['On-time setups', 'Before the first guest'],
          ['Patient planning', 'Every preference heard'],
          ['Thoughtful details', 'The part they remember'],
        ].map(([title, note], index) => (
          <div
            key={title}
            data-reveal="up"
            style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}
          >
            <strong>{title}</strong>
            <span>{note}</span>
          </div>
        ))}
      </section>

      <section className="story-feature" aria-labelledby="feature-heading">
        <div className="story-feature-copy" data-reveal="left">
          <p className="story-eyebrow">The first birthday brief</p>
          <h2 id="feature-heading">
            Ideas heard.
            <em>Details delivered.</em>
          </h2>
          <blockquote>
            “We planned from out of town. The team shared options, stayed
            responsive, and had everything ready when we arrived. We loved the
            result—and our baby enjoyed every bit.”
          </blockquote>
          <footer>
            <strong>Pratheep</strong>
            <span>Son&apos;s first birthday · Home celebration</span>
          </footer>
        </div>

        <div className="story-feature-gallery" data-reveal="right">
          <figure className="story-feature-large">
            <img
              src="/assets/gallery/moment-04.jpg"
              alt="A grand floral stage composed for an engagement"
            />
          </figure>
          <figure className="story-feature-small">
            <img
              src="/assets/gallery/moment-05.jpg"
              alt="A celebration venue prepared with lights and balloons"
            />
          </figure>
          <span>from idea → to arrival</span>
        </div>
      </section>

      <section className="story-combos" aria-labelledby="combos-heading">
        <div className="story-combos-heading" data-reveal="up">
          <p className="story-eyebrow">Best-loved combinations</p>
          <h2 id="combos-heading">
            Choose the feeling.
            <em>We&apos;ll compose the rest.</em>
          </h2>
          <p>
            Three clear starting points, each built from the details that appear
            most often in the review book.
          </p>
        </div>

        <div className="story-combo-grid">
          {celebrationCombos.map((combo, index) => (
            <button
              key={combo.title}
              type="button"
              className={`story-combo story-combo-${combo.color}`}
              onClick={() => chooseCombo(combo.category)}
              data-reveal="up"
              style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}
            >
              <span>{combo.number}</span>
              <strong>{combo.title}</strong>
              <small>{combo.detail}</small>
              <b>
                See the stories <ArrowUpRight aria-hidden="true" />
              </b>
            </button>
          ))}
        </div>
      </section>

      <section
        className="story-wall"
        id="review-wall"
        aria-labelledby="wall-heading"
      >
        <div className="story-wall-heading" data-reveal="up">
          <div>
            <p className="story-eyebrow">Cakes, balloons & kind words</p>
            <h2 id="wall-heading">
              The celebration
              <em>after the celebration.</em>
            </h2>
          </div>
          <p>
            Written reviews are arranged as layered “cake” stories; rating-only
            notes rise beside them as balloons. Nothing invented, nothing
            hidden.
          </p>
        </div>

        <div
          className="story-filter"
          role="group"
          aria-label="Filter reviews by occasion"
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

        <div className="story-review-stage">
          <div className="story-cake-wall" aria-live="polite">
            {visibleReviews.map((review, index) => (
              <article
                className={`story-cake story-cake-${review.color}`}
                key={review.number}
                data-reveal="up"
                style={
                  {
                    '--reveal-delay': `${(index % 2) * 100}ms`,
                  } as CSSProperties
                }
              >
                <div className="story-cake-top">
                  <span>Layer {review.number}</span>
                  <small>{review.category}</small>
                </div>
                <div className="story-cake-middle">
                  <blockquote>“{review.quote}”</blockquote>
                </div>
                <footer className="story-cake-base">
                  <div>
                    <strong>{review.name}</strong>
                    <span>{review.occasion}</span>
                  </div>
                  <small>{review.date}</small>
                </footer>
              </article>
            ))}
          </div>

          <aside
            className="story-balloon-column"
            aria-labelledby="balloon-heading"
          >
            <div className="story-balloon-intro" data-reveal="up">
              <span>Also in the air</span>
              <h3 id="balloon-heading">Six more five-star moments.</h3>
              <p>Public ratings posted without a written note.</p>
            </div>
            <div className="story-balloon-cluster">
              {ratingBalloons.map((rating, index) => (
                <article
                  className={`story-balloon story-balloon-${rating.color}`}
                  key={`${rating.name}-${rating.date}`}
                  data-reveal="balloon"
                  style={
                    { '--reveal-delay': `${index * 80}ms` } as CSSProperties
                  }
                >
                  <b aria-label="5 out of 5">5.0</b>
                  <strong>{rating.name}</strong>
                  <span>{rating.date}</span>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <div className="story-total" data-reveal="scale">
          <span>Public rating</span>
          <strong>4.8</strong>
          <p>from 408 voices</p>
        </div>
      </section>

      <section className="story-cta" aria-labelledby="story-cta-heading">
        <div data-reveal="left">
          <p className="story-eyebrow">Your turn to celebrate</p>
          <h2 id="story-cta-heading">
            Give them a day
            <em>worth talking about.</em>
          </h2>
        </div>
        <a
          href="https://wa.me/918488991284"
          target="_blank"
          rel="noreferrer"
          data-reveal="right"
        >
          Plan it with us <ArrowUpRight aria-hidden="true" />
        </a>
      </section>

      <footer className="story-footer">
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
