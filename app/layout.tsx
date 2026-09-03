import type { Metadata } from 'next';
import { Geist, Geist_Mono, Pinyon_Script } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const weddingScript = Pinyon_Script({
  variable: '--font-wedding-script',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://surprise-bros-tirunelveli.ambrissh23.chatgpt.site'),
  title: "Surprise Bro's | Event Management, Tirunelveli",
  description:
    "Bespoke wedding decor and event experiences by Surprise Bro's in Tirunelveli.",
  openGraph: {
    title: "Surprise Bro's | Event Management, Tirunelveli",
    description:
      "Bespoke wedding decor and event experiences by Surprise Bro's in Tirunelveli.",
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: "Surprise Bro's celebration album in emerald green and antique gold",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Surprise Bro's | Event Management, Tirunelveli",
    description:
      "Bespoke wedding decor and event experiences by Surprise Bro's in Tirunelveli.",
    images: ['/og.png'],
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
        className={`${geistSans.variable} ${geistMono.variable} ${weddingScript.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
