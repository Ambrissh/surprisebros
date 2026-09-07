'use client';

import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';

type BalloonColor = 'wine' | 'pearl' | 'champagne';

type Review = {
  id: string;
  name: string;
  date: string;
  occasion?: string;
  quote?: string;
};

const reviews: Review[] = [
  {
    id: 'pratheep',
    name: 'Pratheep',
    date: '26 Feb 2023',
    occasion: "Son's first birthday",
    quote:
      'We planned our son’s first birthday from out of town. The team stayed responsive, shared options, and had the home ready when we arrived. We loved the result, and our baby enjoyed every bit of it.',
  },
  {
    id: 'suresh',
    name: 'Suresh',
    date: '01 Nov 2025',
  },
  {
    id: 'nisha',
    name: 'Mrs. Nisha',
    date: '19 Jun 2022',
    occasion: "Father's Day surprise",
    quote:
      'The video-call cake cutting, the photo slam book, and the three little pieces on the cake made every detail feel personal to our family. It was our fourth celebration with the team, and they made the day memorable again.',
  },
  {
    id: 'kalviselvan',
    name: 'Kalviselvan',
    date: '11 Dec 2024',
  },
  {
    id: 'gifty',
    name: 'Gifty Sahana',
    date: '26 Apr 2021',
    occasion: 'Engagement celebration',
    quote:
      'They listened to every preference with patience and were genuinely friendly throughout. The decor made our engagement feel grander and more special than we had imagined.',
  },
  {
    id: 'palani',
    name: 'Palani',
    date: '07 Nov 2024',
  },
  {
    id: 'niyaz',
    name: 'Niyaz',
    date: '02 Apr 2022',
    occasion: 'Event decor',
    quote: 'Awesome work by the Surprise Bro’s team.',
  },
  {
    id: 'madevi',
    name: 'Madevi',
    date: '24 Aug 2025',
  },
  {
    id: 'guest',
    name: 'Guest review',
    date: '07 Nov 2024',
  },
  {
    id: 'siva',
    name: 'Siva Guru',
    date: '28 Sep 2023',
  },
];

const balloonSource: Record<BalloonColor, string> = {
  wine: '/assets/reviews/balloon-wine.png',
  pearl: '/assets/reviews/balloon-pearl.png',
  champagne: '/assets/reviews/balloon-champagne.png',
};

const writtenReviews = reviews.filter((review) => review.quote);
const ratingReviews = reviews.filter((review) => !review.quote);
const sourceUrl =
  'https://www.justdial.com/Tirunelveli/Surprise-Bros-Near-By-Primary-Health-Centre-Vannarpettai/0462PX462-X462-201205161205-C4U3_BZDET';

function Stars() {
  return (
    <span className="reviews-stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} aria-hidden="true" fill="currentColor" />
      ))}
    </span>
  );
}

function Balloon({
  color,
  className = '',
}: {
  color: BalloonColor;
  className?: string;
}) {
  return (
    <div className={`reviews-balloon ${className}`} aria-hidden="true">
      <Image
        src={balloonSource[color]}
        alt=""
        width={1024}
        height={1536}
        sizes="(max-width: 700px) 140px, 230px"
      />
    </div>
  );
}

function GiftCard({
  review,
  featured = false,
}: {
  review: Review;
  featured?: boolean;
}) {
  return (
    <article
      className={`reviews-gift-card ${featured ? 'reviews-gift-card-featured' : ''}`}
      id={review.id}
    >
      {featured && (
        <span className="reviews-card-monogram" aria-hidden="true">
          SB
        </span>
      )}
      <div className="reviews-card-top">
        <span>{review.occasion}</span>
        <Stars />
      </div>
      <blockquote>“{review.quote}”</blockquote>
      <footer className="reviews-signature">
        <span>{review.name}</span>
        <time>{review.date}</time>
      </footer>
    </article>
  );
}

export function ReviewsExperience() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const motion = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    const cleanups = Array.from(
      page.querySelectorAll<HTMLElement>('[data-tilt]'),
    ).map((surface) => {
      let frame = 0;
      let bounds: DOMRect | null = null;
      let x = 0;
      let y = 0;
      const enter = () => {
        bounds = surface.getBoundingClientRect();
      };
      const reset = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        bounds = null;
        surface.style.removeProperty('--review-tilt-x');
        surface.style.removeProperty('--review-tilt-y');
        surface.classList.remove('is-hovered');
      };
      const move = (event: PointerEvent) => {
        if (!motion.matches || event.pointerType === 'touch') return;
        if (!bounds) enter();
        if (!bounds) return;
        x = Math.max(
          -1,
          Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1),
        );
        y = Math.max(
          -1,
          Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1),
        );
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          surface.style.setProperty('--review-tilt-x', `${-y * 2.2}deg`);
          surface.style.setProperty('--review-tilt-y', `${x * 2.8}deg`);
          surface.classList.add('is-hovered');
        });
      };
      surface.addEventListener('pointerenter', enter);
      surface.addEventListener('pointermove', move, { passive: true });
      surface.addEventListener('pointerleave', reset);
      surface.addEventListener('pointercancel', reset);
      motion.addEventListener('change', reset);
      window.addEventListener('scroll', reset, { passive: true });
      return () => {
        reset();
        surface.removeEventListener('pointerenter', enter);
        surface.removeEventListener('pointermove', move);
        surface.removeEventListener('pointerleave', reset);
        surface.removeEventListener('pointercancel', reset);
        motion.removeEventListener('change', reset);
        window.removeEventListener('scroll', reset);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || !('IntersectionObserver' in window)) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    const items = Array.from(
      page.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    // Only hide content once observation is available. The page stays readable without JS.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -24px 0px' },
    );

    items.forEach((item) => {
      if (item.getBoundingClientRect().top >= window.innerHeight - 24) {
        item.classList.add('will-reveal');
        observer.observe(item);
      } else {
        item.classList.add('is-visible');
      }
    });

    const showAll = () => {
      if (!reducedMotion.matches) return;
      items.forEach((item) => item.classList.add('is-visible'));
      observer.disconnect();
    };
    reducedMotion.addEventListener('change', showAll);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', showAll);
      items.forEach((item) => item.classList.remove('will-reveal'));
    };
  }, []);

  return (
    <main ref={pageRef} className="reviews-page">
      <SiteHeader page="reviews" />

      <section className="reviews-intro" aria-labelledby="reviews-title">
        <div className="reviews-intro-copy">
          <p className="reviews-eyebrow">Surprise Bro&apos;s · Tirunelveli</p>
          <h1 id="reviews-title">
            Good days.<span>Kind words.</span>
          </h1>
          <div className="reviews-score">
            <strong>
              4.8<span>/5</span>
            </strong>
            <div>
              <span className="reviews-score-stars" aria-hidden="true">
                ★★★★★
              </span>
              <a href={sourceUrl} target="_blank" rel="noreferrer">
                408 public ratings <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
          <a className="reviews-text-link" href="#customer-stories">
            Read their stories <ArrowDown aria-hidden="true" />
          </a>
        </div>

        <div className="reviews-first-note">
          <Balloon color="wine" className="reviews-balloon-hero" />
          <div className="reviews-featured-wrap" data-tilt>
            <span className="reviews-note-number" aria-hidden="true">
              01 / A first birthday
            </span>
            <GiftCard review={writtenReviews[0]} featured />
          </div>
          <span className="reviews-handwritten" aria-hidden="true">
            A day to remember.
          </span>
        </div>
        <div className="reviews-intro-bottom" aria-hidden="true">
          <span>A few words from the people we celebrate with.</span>
          <span>
            Scroll to read <ArrowDown />
          </span>
        </div>
      </section>

      <section
        className="reviews-stories"
        id="customer-stories"
        aria-labelledby="reviews-stories-title"
      >
        <div className="reviews-section-heading" data-reveal>
          <h2 id="reviews-stories-title">
            The moments.
            <br />
            <em>The memories.</em>
          </h2>
          <div className="reviews-section-art">
            <Image
              src="/assets/reviews/burgundy-satin-ribbon.png"
              alt=""
              width={1536}
              height={1024}
              sizes="(max-width: 700px) 200px, 370px"
              aria-hidden="true"
            />
            <span>In their own words</span>
          </div>
        </div>
        <div className="reviews-notes">
          {writtenReviews.slice(1).map((review, index) => (
            <div
              className={`reviews-note reviews-note-${index + 1}`}
              key={review.id}
              data-reveal
              data-tilt
            >
              <div className="reviews-note-heading">
                <span>0{index + 2}</span>
                <span>{review.occasion}</span>
              </div>
              <GiftCard review={review} />
              {index === 1 && (
                <Balloon color="champagne" className="reviews-balloon-note" />
              )}
            </div>
          ))}
          <div className="reviews-art-pause" data-reveal aria-hidden="true">
            <Image
              src="/assets/celebration-cake-gift.png"
              alt=""
              width={1086}
              height={1448}
              sizes="(max-width: 700px) 180px, 230px"
            />
            <span>
              For all the little
              <br />
              and big occasions.
            </span>
          </div>
        </div>

        <div className="reviews-ratings" aria-label="More customer ratings">
          <div className="reviews-ratings-heading" data-reveal>
            <h3>More happy celebrations.</h3>
            <span>★★★★★</span>
          </div>
          <div className="reviews-ratings-grid">
            {ratingReviews.map((review) => (
              <article
                key={review.id}
                id={review.id}
                className="reviews-rating"
                data-reveal
              >
                <div>
                  <h4>{review.name}</h4>
                  <time>{review.date}</time>
                </div>
                <Stars />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="reviews-closing"
        aria-labelledby="reviews-closing-title"
      >
        <div className="reviews-closing-copy" data-reveal>
          <p className="reviews-eyebrow">Your next occasion</p>
          <h2 id="reviews-closing-title">
            Planning a<br />
            <em>celebration?</em>
          </h2>
          <a
            href="https://wa.me/918488991284"
            target="_blank"
            rel="noreferrer"
            className="reviews-closing-link"
          >
            Let&apos;s make it happen <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="reviews-closing-art" data-reveal aria-hidden="true">
          <Image
            src="/assets/reviews/christmas-wreath-premium.png"
            alt=""
            width={1278}
            height={1230}
            sizes="(max-width: 700px) 200px, 300px"
          />
          <span>Made for your occasion.</span>
        </div>
        <div className="reviews-closing-edge" aria-hidden="true">
          <span>Surprise Bro&apos;s</span>
        </div>
      </section>

      <footer className="reviews-footer">
        <div className="reviews-footer-top" data-reveal>
          <Link href="/" className="reviews-footer-brand">
            Surprise Bro&apos;s
          </Link>
          <nav aria-label="Footer navigation">
            <Link href="/gallery">
              Gallery <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link href="/#reach-out">
              Reach out <ArrowUpRight aria-hidden="true" />
            </Link>
          </nav>
        </div>
        <div className="reviews-footer-bottom" data-reveal>
          <p>
            Reviews edited for length and clarity. Ratings and dates from the
            public listing.
          </p>
          <a href={sourceUrl} target="_blank" rel="noreferrer">
            Review source <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </footer>
    </main>
  );
}
