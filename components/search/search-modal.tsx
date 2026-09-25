'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Loader2, ArrowRight, Tag, Sparkles, Scale } from 'lucide-react';
import { searchProducts, SearchProductResult } from '@/actions/products/search';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SUGGESTIONS = ['Truck Art', 'Multan', 'Swati', 'Onyx', 'Salt Lamp'];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProductResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced live search query (250ms)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      const data = await searchProducts(query);
      setResults(data);
      setIsLoading(false);
      setHasSearched(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectSuggestion = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setIsLoading(false);
    inputRef.current?.focus();
  };

  const handleViewAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleProductClick = (slug: string) => {
    onClose();
    router.push(`/products/${slug}`);
  };

  const getImageUrl = (images: any): string => {
    if (Array.isArray(images) && images.length > 0) return images[0];
    if (typeof images === 'string' && images.startsWith('http')) return images;
    return '/images/collections/blue-pottery.png';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop overlay click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Command Palette Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-parchment rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <form onSubmit={handleViewAll} className="relative flex items-center px-4 py-3.5 border-b border-border bg-sandstone/80">
          <Search className="w-5 h-5 text-lapis shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search handcrafted pottery, wood carvings, marble, tags..."
            className="w-full bg-transparent text-sm sm:text-base text-charcoal placeholder-muted focus:outline-none font-medium"
          />

          {isLoading ? (
            <Loader2 className="w-5 h-5 text-brass animate-spin shrink-0 ml-2" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-muted hover:text-charcoal hover:bg-border/50 transition-colors shrink-0 ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </form>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-sandstone/40 border-b border-border flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-terracotta" /> Suggestions:
          </span>
          {QUICK_SUGGESTIONS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleSelectSuggestion(term)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                query.toLowerCase() === term.toLowerCase()
                  ? 'bg-lapis text-parchment font-semibold shadow-xs'
                  : 'bg-parchment hover:bg-chiseled border border-border/80 text-charcoal/90'
              }`}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Live Search Results / Content View */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {query.trim() === '' ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 bg-sandstone rounded-full flex items-center justify-center mx-auto text-lapis border border-border">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-xs text-muted">
                Type keywords like <strong className="text-charcoal font-semibold">"Truck Art"</strong>,{' '}
                <strong className="text-charcoal font-semibold">"Multan"</strong>, or{' '}
                <strong className="text-charcoal font-semibold">"Swati"</strong> to discover authentic crafts.
              </p>
            </div>
          ) : isLoading ? (
            <div className="py-12 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-lapis animate-spin mx-auto" />
              <p className="text-xs text-muted">Searching Ghazali archival database...</p>
            </div>
          ) : hasSearched && results.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-sm text-charcoal font-medium">
                No crafts found matching <span className="italic text-terracotta">"{query}"</span>.
              </p>
              <p className="text-xs text-muted max-w-md mx-auto">
                Try searching for <strong className="text-charcoal">blue pottery</strong>,{' '}
                <strong className="text-charcoal">walnut</strong>, or{' '}
                <strong className="text-charcoal">brass</strong>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((product) => {
                const imgUrl = getImageUrl(product.images);
                const isExternal = imgUrl.startsWith('http');

                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.slug)}
                    className="flex items-center gap-3 p-2.5 bg-sandstone/60 hover:bg-chiseled rounded-xl border border-border/80 transition-all cursor-pointer group"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-parchment border border-border">
                      <Image
                        src={imgUrl}
                        alt={product.name}
                        fill
                        unoptimized={isExternal && !imgUrl.includes('supabase.co')}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h4 className="font-serif text-xs sm:text-sm font-semibold text-charcoal group-hover:text-lapis transition-colors truncate">
                        {product.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {product.size && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-muted font-mono bg-parchment px-1.5 py-0.5 rounded border border-border/60">
                            <Tag className="w-2.5 h-2.5 text-brass" />
                            <span>{product.size}</span>
                          </span>
                        )}
                        {product.weight && product.weight > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-muted font-mono bg-parchment px-1.5 py-0.5 rounded border border-border/60">
                            <Scale className="w-2.5 h-2.5 text-lapis" />
                            <span>{product.weight}g</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-terracotta font-sans">
                        Rs. {product.price?.toLocaleString()} PKR
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        {query.trim() && !isLoading && (
          <div className="p-3 bg-sandstone border-t border-border flex items-center justify-between gap-3 text-xs">
            <span className="text-muted text-[11px] hidden sm:inline">
              Found <strong className="text-charcoal font-bold">{results.length}</strong> matching items
            </span>

            <button
              type="button"
              onClick={() => handleViewAll()}
              className="ml-auto px-4 py-2 bg-lapis hover:bg-lapis/90 text-parchment rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View All Results ({results.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
