import type { Metadata } from 'next';
import { Libre_Franklin, Lora } from 'next/font/google';
import { ReviewsExperience } from './reviews-experience';
import './reviews.css';

const reviewSans = Libre_Franklin({
  variable: '--font-review-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const reviewSerif = Lora({
  variable: '--font-review-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "Reviews | Surprise Bro's, Tirunelveli",
  description:
    "Read what families say about Surprise Bro's balloon decor, cakes, engagement stages, and celebrations in Tirunelveli.",
};

export default function ReviewsPage() {
  return (
    <div className={`${reviewSans.variable} ${reviewSerif.variable}`}>
      <ReviewsExperience />
    </div>
  );
}
