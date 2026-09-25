'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';

import { FestiveBanner } from '@/components/layout/festive-banner';
import { SearchModal } from '@/components/search/search-modal';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const items = useCartStore((state) => state.items);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Heritage & Automated Festive Announcement Strip */}
      <FestiveBanner />

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${isScrolled
            ? 'bg-parchment/95 backdrop-blur-md border-b border-border shadow-craft-sm py-3'
            : 'bg-parchment border-b border-border/60 py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-charcoal hover:text-lapis transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo & Editorial Typography */}
          <Link href="/" className="flex flex-col items-center md:items-start group">
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-charcoal group-hover:text-lapis transition-colors">
              Ghazali <span className="text-terracotta font-normal italic">Handicrafts</span>
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-muted font-medium -mt-1">
              Artisanal Heritage of Pakistan
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-lapis relative py-1 ${pathname === '/' ? 'text-lapis font-semibold' : 'text-charcoal/80'
                }`}
            >
              Home
              {pathname === '/' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brass rounded-full" />
              )}
            </Link>

            <Link
              href="/products"
              className={`text-sm font-medium transition-colors hover:text-lapis relative py-1 ${pathname === '/products' ? 'text-lapis font-semibold' : 'text-charcoal/80'
                }`}
            >
              Catalog
              {pathname === '/products' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brass rounded-full" />
              )}
            </Link>

            <Link
              href="/products?category=blue-pottery"
              className="text-sm font-medium text-charcoal/80 hover:text-lapis transition-colors"
            >
              Blue Pottery
            </Link>

            <Link
              href="/products?category=swati-woodwork"
              className="text-sm font-medium text-charcoal/80 hover:text-lapis transition-colors"
            >
              Swati Carvings
            </Link>

            <Link
              href="/products?category=marble-onyx"
              className="text-sm font-medium text-charcoal/80 hover:text-lapis transition-colors"
            >
              Marble & Onyx
            </Link>

            <Link
              href="/products?category=truck-art"
              className="text-sm font-medium text-charcoal/80 hover:text-lapis transition-colors"
            >
              Truck Art
            </Link>
          </div>

          {/* Header Action Buttons (Search Modal & Cart Drawer Trigger) */}
          <div className="flex items-center gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-charcoal hover:text-lapis transition-colors rounded-full hover:bg-sandstone flex items-center gap-1.5 group cursor-pointer"
              aria-label="Open search dialog"
              title="Search crafts (Cmd+K)"
            >
              <Search className="w-5 h-5 text-charcoal group-hover:text-lapis transition-colors" />
            </button>

            {/* Persistent Cart Trigger with Badge */}
            <button
              onClick={openDrawer}
              className="relative p-2.5 bg-sandstone hover:bg-chiseled border border-border rounded-full text-charcoal transition-all duration-200 hover:shadow-craft-sm group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-charcoal group-hover:text-lapis transition-colors" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-parchment text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-parchment animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-sandstone border-b border-border px-4 pt-3 pb-6 space-y-3 mt-2 animate-in slide-in-from-top duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-charcoal hover:bg-parchment rounded-md"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-charcoal hover:bg-parchment rounded-md"
            >
              All Craft Catalog
            </Link>
            <div className="pt-2 border-t border-border/80">
              <span className="px-3 text-xs font-semibold text-muted uppercase tracking-wider">
                Craft Categories
              </span>
              <div className="mt-1 space-y-1">
                <Link
                  href="/products?category=blue-pottery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-sm text-charcoal/90 hover:text-lapis"
                >
                  Multani Blue Pottery
                </Link>
                <Link
                  href="/products?category=swati-woodwork"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-sm text-charcoal/90 hover:text-lapis"
                >
                  Swati Carved Woodwork
                </Link>
                <Link
                  href="/products?category=marble-onyx"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-sm text-charcoal/90 hover:text-lapis"
                >
                  Marble & Onyx Crafts
                </Link>
                <Link
                  href="/products?category=truck-art"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-sm text-charcoal/90 hover:text-lapis"
                >
                  Authentic Truck Art
                </Link>
                <Link
                  href="/products?category=chiseled-brass"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-sm text-charcoal/90 hover:text-lapis"
                >
                  Chiseled Antiqued Brass
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Global Search Modal Dialog */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
