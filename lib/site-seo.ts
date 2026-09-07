import type { Metadata } from 'next';

// Set this to the client's public origin when connecting the launch domain.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://surprise-bros-tirunelveli.ambrissh23.chatgpt.site'
).replace(/\/$/, '');

export function pageMetadata(
  title: string,
  description: string,
  path = '/',
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      type: 'website',
      siteName: "Surprise Bro's",
      locale: 'en_IN',
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: "Surprise Bro's event celebrations in Tirunelveli",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.png'],
    },
  };
}

export const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${siteUrl}/#business`,
  name: "Surprise Bro's",
  description:
    'Wedding decorations, birthday celebrations, balloon decor and event planning in Tirunelveli.',
  url: siteUrl,
  logo: `${siteUrl}/assets/surprise-bros-logo.png`,
  image: `${siteUrl}/assets/native/celebration-01.webp`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '87 Q 1, Azad Road, near Sona Mahal, Gandhinagar',
    addressLocality: 'Tirunelveli',
    addressRegion: 'Tamil Nadu',
    postalCode: '627008',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 8.7309737,
    longitude: 77.6790094,
  },
  areaServed: { '@type': 'City', name: 'Tirunelveli' },
  hasMap: 'https://www.google.com/maps?cid=15409915577995730649',
};
