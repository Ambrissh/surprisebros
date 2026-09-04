import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import { ReviewsExperience } from './reviews-experience';
import './reviews.css';

const giftDisplay = Fraunces({
  variable: '--font-gift-display',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const giftSans = Manrope({
  variable: '--font-gift-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Reviews | Surprise Bro's, Tirunelveli",
  description:
    "Read what families say about Surprise Bro's balloon decor, cakes, engagement stages, and celebrations in Tirunelveli.",
};

export default function ReviewsPage() {
  return (
    <div className={`${giftDisplay.variable} ${giftSans.variable}`}>
      <ReviewsExperience />
    </div>
  );
}
