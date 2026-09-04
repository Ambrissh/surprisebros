import type { Metadata } from 'next';
import { Baloo_2, Caveat } from 'next/font/google';
import { ReviewsExperience } from './reviews-experience';
import './reviews.css';

const balloonDisplay = Baloo_2({
  variable: '--font-balloon',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

const doodle = Caveat({
  variable: '--font-doodle',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Reviews | Surprise Bro's, Tirunelveli",
  description:
    "Read what families say about Surprise Bro's balloon decor, cakes, engagement stages, and celebrations in Tirunelveli.",
};

export default function ReviewsPage() {
  return (
    <div className={`${balloonDisplay.variable} ${doodle.variable}`}>
      <ReviewsExperience />
    </div>
  );
}
