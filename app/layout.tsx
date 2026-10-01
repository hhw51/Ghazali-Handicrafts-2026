import type { Metadata } from 'next';
import { Syne, Libre_Caslon_Text, Plus_Jakarta_Sans } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

const caslon = Libre_Caslon_Text({
  subsets: ['latin'],
  variable: '--font-caslon',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ghazalihandicrafts.com'),
  title: {
    default: 'Ghazali Handicrafts | 50 Years of Authentic Pakistani Artisanal Heritage',
    template: '%s | Ghazali Handicrafts',
  },
  description:
    'Preserving Pakistan’s living craft since 1976. Hand-carved Swati walnut woodwork, hand-thrown Multani blue pottery, Taxila marble clocks, and Rawalpindi truck art. Nationwide Cash on Delivery with fragile double-crating guarantee.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://ghazalihandicrafts.com',
  },
  openGraph: {
    title: 'Ghazali Handicrafts — Authentic Artisanal Heritage of Pakistan',
    description:
      'Hand-chiseled Swati woodwork, Multani pottery, and authentic truck art. 50-year historic shop in Anarkali, Lahore. Delivered nationwide via Cash on Delivery.',
    url: 'https://ghazalihandicrafts.com',
    siteName: 'Ghazali Handicrafts',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghazali Handicrafts Artisanal Heritage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghazali Handicrafts | Authentic Pakistani Crafts',
    description: '50-year legacy of handcrafted heritage. Nationwide COD with double-crating guarantee.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Ghazali Handicrafts',
    image: 'https://ghazalihandicrafts.com/images/hero/craft-hero.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '27 New Anarkali Road, Anarkali Bazaar',
      addressLocality: 'Lahore',
      addressRegion: 'Punjab',
      postalCode: '54000',
      addressCountry: 'PK',
    },
    hasMap: 'https://maps.app.goo.gl/7sGBoDgCb1imyGME8',
    priceRange: 'PKR',
    currenciesAccepted: 'PKR',
    paymentAccepted: 'Cash on Delivery',
  };

  return (
    <html lang="en" className={`${syne.variable} ${caslon.variable} ${jakarta.variable}`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground antialiased selection:bg-brass/30 flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <GoogleAnalytics gaId="G-RSJGN708MR" />
      </body>
    </html>
  );
}
