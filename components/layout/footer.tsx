import Link from 'next/link';
import { ShieldCheck, PackageCheck, Truck, MapPin } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

export function Footer() {
  return (
    <footer className="bg-charcoal text-parchment pt-16 pb-12 border-t-4 border-brass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust & Value Anchors Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-stone/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-lapis/40 border border-brass/30 rounded-lg text-brass shrink-0">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-brass">Fragile-Safe Packaging</h4>
              <p className="text-xs text-parchment/70 mt-1 leading-relaxed">
                Custom wooden crate buffering & multi-layer bubble wrapping engineered specifically for delicate ceramics and marble.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-lapis/40 border border-brass/30 rounded-lg text-brass shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-brass">Nationwide Cash on Delivery</h4>
              <p className="text-xs text-parchment/70 mt-1 leading-relaxed">
                Pay safely upon parcel arrival anywhere in Pakistan. Standard dispatch within 24-48 business hours.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-lapis/40 border border-brass/30 rounded-lg text-brass shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-brass">Direct Artisan Fair Trade</h4>
              <p className="text-xs text-parchment/70 mt-1 leading-relaxed">
                100% authentic hand-carved, thrown, and painted crafts commissioned directly from heritage master artisans.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand Editorial Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight text-parchment">
                Ghazali <span className="text-brass italic font-normal">Handicrafts</span>
              </span>
            </Link>
            <p className="text-xs text-parchment/70 leading-relaxed">
              Preserving the living cultural heritage of Pakistan through authentic, heirloom-quality artisanal crafts. Every piece carries the soul of its master creator.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/923104755973?text=Hello%20Ghazali%20Handicrafts%2C%20I%20have%20an%20artisan%20query."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] rounded-md text-xs font-semibold text-white transition-colors shadow-xs"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
                WhatsApp Artisan Concierge
              </a>
            </div>
          </div>

          {/* Heritage Craft Regions */}
          <div>
            <h5 className="font-serif text-base font-semibold text-brass tracking-wide mb-4">
              Artisan Craft Hubs
            </h5>
            <ul className="space-y-2.5 text-xs text-parchment/80">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span>Multan — Cobalt Blue Pottery</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span>Swat Valley — Carved Walnut</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span>Karachi & Quetta — Onyx Marble</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span>Rawalpindi — Authentic Truck Art</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span>Chiniot — Chiseled Antiqued Brass</span>
              </li>
            </ul>
          </div>

          {/* Catalog Navigation */}
          <div>
            <h5 className="font-serif text-base font-semibold text-brass tracking-wide mb-4">
              Explore Collections
            </h5>
            <ul className="space-y-2 text-xs text-parchment/80">
              <li>
                <Link href="/products" className="hover:text-brass transition-colors">
                  All Artisanal Catalog
                </Link>
              </li>
              <li>
                <Link href="/products?category=blue-pottery" className="hover:text-brass transition-colors">
                  Multani Blue Pottery Vases & Bowls
                </Link>
              </li>
              <li>
                <Link href="/products?category=swati-woodwork" className="hover:text-brass transition-colors">
                  Swati Hand-Carved Chests & Mirrors
                </Link>
              </li>
              <li>
                <Link href="/products?category=marble-onyx" className="hover:text-brass transition-colors">
                  Pakistani White Onyx Chess Sets
                </Link>
              </li>
              <li>
                <Link href="/products?category=truck-art" className="hover:text-brass transition-colors">
                  Authentic Truck Art Kettles & Trays
                </Link>
              </li>
              <li>
                <Link href="/products?category=chiseled-brass" className="hover:text-brass transition-colors">
                  Chiseled Antiqued Brass Goblets
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h5 className="font-serif text-base font-semibold text-brass tracking-wide mb-4">
              Flagship Store & Customer Care
            </h5>
            <ul className="space-y-2 text-xs text-parchment/80">
              <li>
                <span className="text-parchment/90 font-semibold block text-brass">Flagship Location:</span>
                <a
                  href="https://maps.app.goo.gl/fbt2FunN1MfoD7Px6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brass underline transition-colors flex items-center gap-1 mt-0.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  27 New Anarkali, Lahore, Punjab, Pakistan
                </a>
              </li>
              <li className="pt-1">
                <span className="text-parchment/90 font-medium">Dispatch Time:</span> 24-48 Hours
              </li>
              <li>
                <span className="text-parchment/90 font-medium">Payment Method:</span> Cash on Delivery (COD)
              </li>
              <li>
                <span className="text-parchment/90 font-medium">Fragile Guarantee:</span> 100% Crate Buffer Replacement
              </li>
              <li>
                <span className="text-parchment/90 font-medium">Support Phone:</span> +92 300 1234567
              </li>
              <li>
                <span className="text-parchment/90 font-medium">Support Email:</span> concierge@ghazalihandicrafts.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-stone/30 flex flex-col sm:flex-row items-center justify-between text-xs text-parchment/60">
          <p>© {new Date().getFullYear()} Ghazali Handicrafts. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex items-center gap-4 text-[11px]">
            <span>Prices displayed in Pakistani Rupees (PKR)</span>
            <span>•</span>
            <span>Made with pride in Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
