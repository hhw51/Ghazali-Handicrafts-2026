import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-24 max-w-md mx-auto px-4 text-center space-y-6">
      <div className="w-16 h-16 bg-sandstone rounded-full flex items-center justify-center mx-auto border border-border text-terracotta">
        <Compass className="w-8 h-8 text-terracotta" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-brass font-bold">404 Page Not Found</span>
        <h1 className="font-serif text-3xl font-bold text-charcoal">Artisanal Path Lost</h1>
        <p className="text-xs text-muted leading-relaxed">
          The craft piece or page you are looking for does not exist or has been moved.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-lapis text-parchment text-xs font-semibold rounded-md shadow-craft-sm hover:bg-lapis/90 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Homepage
      </Link>
    </div>
  );
}
