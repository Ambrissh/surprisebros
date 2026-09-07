import { pageMetadata } from '../../lib/site-seo';
import { GalleryAlbum } from './gallery-album';
import './gallery.css';

export const metadata = pageMetadata(
  "Event Decoration Gallery | Surprise Bro's, Tirunelveli",
  "Explore real wedding stages, birthday decorations and celebration setups by Surprise Bro's in Tirunelveli, photographed and shared by our team.",
  '/gallery',
);

export default function GalleryPage() {
  return <GalleryAlbum />;
}
