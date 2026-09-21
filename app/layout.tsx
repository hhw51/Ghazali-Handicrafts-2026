import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
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
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="bg-background text-foreground antialiased selection:bg-brass/30 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
