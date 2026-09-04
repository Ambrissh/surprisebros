import type { Metadata } from 'next';
import { GalleryAlbum } from './gallery-album';
import './gallery.css';

export const metadata: Metadata = {
  title: "Gallery | Surprise Bro's",
  description: "Wedding and event gallery by Surprise Bro's in Tirunelveli.",
};

export default function GalleryPage() {
  return <GalleryAlbum />;
}
