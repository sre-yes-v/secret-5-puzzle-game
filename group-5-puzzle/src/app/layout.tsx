import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://secret-5.vercel.app/"), 

  title: {
    default: "SECRET5",
    template: "%s | SECRET5",
  },
  description: "Five puzzles. One mystery.",
  authors: [{ name: "SECRET5" }],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://secret-5.vercel.app/",
    title: "SECRET5",
    description: "Five puzzles. One mystery.",
    siteName: "SECRET5",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png", // Recommended aspect ratio: 1200x630 (1.91:1)
        width: 1200,
        height: 630,
        alt: "SECRET5 - Five puzzles. One mystery.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SECRET5",
    description: "Five puzzles. One mystery.",
    images: ["/og-image.png"], 
  },

};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
