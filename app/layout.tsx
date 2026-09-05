import type { Metadata } from "next";
import {
  Alex_Brush,
  Bodoni_Moda,
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  Montserrat,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caesuraFallback = Cormorant_Garamond({
  variable: "--font-caesura-fallback",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const peristiwaFallback = Alex_Brush({
  variable: "--font-peristiwa-fallback",
  subsets: ["latin"],
  weight: "400",
});

const seasonsFallback = Bodoni_Moda({
  variable: "--font-seasons-fallback",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const gothamFallback = Montserrat({
  variable: "--font-gotham-fallback",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://surprise-bros-tirunelveli.ambrissh23.chatgpt.site",
  ),
  title: "Surprise Bro's | Event Management, Tirunelveli",
  description:
    "Bespoke wedding decor and event experiences by Surprise Bro's in Tirunelveli.",
  openGraph: {
    title: "Surprise Bro's | Event Management, Tirunelveli",
    description:
      "Bespoke wedding decor and event experiences by Surprise Bro's in Tirunelveli.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Surprise Bro's celebration album in emerald green and antique gold",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Surprise Bro's | Event Management, Tirunelveli",
    description:
      "Bespoke wedding decor and event experiences by Surprise Bro's in Tirunelveli.",
    images: ["/og.png"],
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
      </body>
    </html>
  );
}
