import type { Metadata } from 'next';
import { GalleryAlbum } from './gallery-album';

export const metadata: Metadata = {
  title: "Gallery | Surprise Bro's",
  description:
    "Open the Surprise Bro's album and explore a collection of thoughtfully composed celebrations.",
};

export default function GalleryPage() {
  return <GalleryAlbum />;
}
