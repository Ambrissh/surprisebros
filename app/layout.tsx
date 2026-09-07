import type { Metadata } from 'next';
import { businessSchema, pageMetadata, siteUrl } from '../lib/site-seo';
import {
  Alex_Brush,
  Bodoni_Moda,
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  Montserrat,
} from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const caesuraFallback = Cormorant_Garamond({
  variable: '--font-caesura-fallback',
  subsets: ['latin'],
  weight: ['600', '700'],
});

const peristiwaFallback = Alex_Brush({
  variable: '--font-peristiwa-fallback',
  subsets: ['latin'],
  weight: '400',
});

const seasonsFallback = Bodoni_Moda({
  variable: '--font-seasons-fallback',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const gothamFallback = Montserrat({
  variable: '--font-gotham-fallback',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  ...pageMetadata(
    "Wedding & Birthday Decorations in Tirunelveli | Surprise Bro's",
    "Plan weddings, birthday parties, balloon decorations and thoughtful surprises with Surprise Bro's in Tirunelveli. Explore our work and contact us for your next celebration.",
  ),
  metadataBase: new URL(siteUrl),
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico', sizes: '48x48' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caesuraFallback.variable} ${peristiwaFallback.variable} ${seasonsFallback.variable} ${gothamFallback.variable} antialiased`}
      >
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema).replace(/</g, '\\u003c'),
          }}
        />
      </body>
    </html>
  );
}
