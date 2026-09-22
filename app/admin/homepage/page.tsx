import { getSiteSettings } from '@/lib/site-settings';
import { AdminHomepageForm } from '@/components/admin/admin-homepage-form';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminHomepageCMSPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brass/15 text-terracotta rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>Storefront Dynamic CMS Engine</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">
            Home Page Content Management
          </h1>
          <p className="text-xs text-muted mt-1">
            Customize hero banners, headlines, ticker marquee, announcement bars, and artisan spotlight narratives live.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="px-4 py-2 bg-sandstone hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-md transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> View Live Storefront
        </Link>
      </div>

      {/* Form Component */}
      <AdminHomepageForm initialSettings={settings} />
    </div>
  );
}
