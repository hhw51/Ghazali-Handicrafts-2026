import type { Metadata } from 'next';
import { Syne, Libre_Caslon_Text, Plus_Jakarta_Sans } from 'next/font/google';
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
  title: {
    default: 'Ghazali Handicrafts | Luxury Artisanal Heritage of Pakistan',
    template: '%s | Ghazali Handicrafts',
  },
  description:
    'Authentic Pakistani cultural heritage crafts. Explore Multani blue pottery, Swati hand-carved woodwork, Pakistani white onyx chess sets, and Rawalpindi truck art.',
  keywords: [
    'Pakistani handicrafts',
    'Multani blue pottery',
    'Swati wood carving',
    'Onyx chess set',
    'Truck art Pakistan',
    'Artisanal decor',
    'Cash on delivery Pakistan',
  ],
  openGraph: {
    title: 'Ghazali Handicrafts | Luxury Artisanal Heritage',
    description:
      'Authentic Pakistani cultural heritage crafts commissioned directly from master artisans.',
    url: 'https://ghazalihandicrafts.com',
    siteName: 'Ghazali Handicrafts',
    images: [
      {
        url: '/images/hero/craft-hero.png',
        width: 1200,
        height: 630,
        alt: 'Ghazali Handicrafts Artisanal Heritage Showcase',
      },
    ],
    locale: 'en_PK',
    type: 'website',
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
      streetAddress: '27 New Anarkali',
      addressLocality: 'Lahore',
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
    hasMap: 'https://maps.app.goo.gl/fbt2FunN1MfoD7Px6',
    priceRange: 'PKR',
    currenciesAccepted: 'PKR',
    paymentAccepted: 'Cash on Delivery',
  };

  return (
    <html lang="en" className={`${syne.variable} ${caslon.variable} ${jakarta.variable}`}>
      <head>
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
      </body>
    </html>
  );
}
