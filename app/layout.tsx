import type { Metadata } from 'next';
import { Syne, Libre_Caslon_Text, Plus_Jakarta_Sans } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { ProgressBarProvider } from '@/components/providers/progress-bar-provider';
import { Toaster } from 'sonner';

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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
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
  const rootGraphJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Store',
        '@id': 'https://www.ghazalihandicrafts.com/#store',
        name: 'Ghazali Handicrafts',
        description:
          'Historic Pakistani artisan flagship studio and digital catalog operating since 1976. Specializing in Swati relief walnut woodwork, Multani blue glazed ceramics (Kashigari), Taxila marble & onyx, and genuine hand-painted truck art.',
        url: 'https://www.ghazalihandicrafts.com',
        telephone: '+92-321-9981625',
        foundingDate: '1976',
        priceRange: 'PKR 800 - PKR 50,000',
        paymentAccepted: 'Cash on Delivery, Bank Transfer',
        currenciesAccepted: 'PKR',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '27 New Anarkali Road, Anarkali Bazaar',
          addressLocality: 'Lahore',
          addressRegion: 'Punjab',
          postalCode: '54000',
          addressCountry: 'PK',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 31.5657,
          longitude: 74.3129,
        },
        hasMap: 'https://maps.app.goo.gl/7sGBoDgCb1imyGME8',
        sameAs: [
          'https://www.facebook.com/share/18KLD4HuuT/',
          'https://www.instagram.com/ghazali.handicrafts_?stkn=YzdhbzBlM21uNnp4',
          'https://youtube.com/@ghazalihandicraft4031',
          'https://maps.app.goo.gl/7sGBoDgCb1imyGME8',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.ghazalihandicrafts.com/#website',
        url: 'https://www.ghazalihandicrafts.com',
        name: 'Ghazali Handicrafts',
        publisher: { '@id': 'https://www.ghazalihandicrafts.com/#store' },
      },
    ],
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
        <ProgressBarProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(rootGraphJsonLd) }}
          />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="bottom-left"
            toastOptions={{
              unstyled: true,
              className: '!p-0 !m-0 !bg-transparent !border-0 !shadow-none',
              style: {
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                zIndex: 99999,
              },
            }}
          />
          <GoogleAnalytics gaId="G-RSJGN708MR" />
        </ProgressBarProvider>
      </body>
    </html>
  );
}
