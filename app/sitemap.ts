import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/site-seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/gallery', '/reviews'].map((path) => ({
    url: `${siteUrl}${path}`,
  }));
}
