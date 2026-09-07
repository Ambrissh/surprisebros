import { pageMetadata } from '../../lib/site-seo';
import { ReviewsExperience } from './reviews-experience';
import './reviews.css';

export const metadata = pageMetadata(
  "Client Reviews | Surprise Bro's Event Planning, Tirunelveli",
  "Read what families say about Surprise Bro's balloon decor, cakes, engagement stages and event planning in Tirunelveli.",
  '/reviews',
);

export default function ReviewsPage() {
  return <ReviewsExperience />;
}
