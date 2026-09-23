import { getHomepageSections } from '@/actions/admin-cms';
import { AdminCmsEditor } from '@/components/admin/admin-cms-editor';
import { Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCmsPage() {
  const sections = await getHomepageSections();

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-charcoal flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-lapis" /> Modular Homepage CMS Builder
        </h1>
        <p className="text-xs text-muted mt-1">
          Add, configure, re-order, and toggle interactive section blocks rendered on the Ghazali storefront homepage.
        </p>
      </div>

      {/* Interactive CMS Block Builder */}
      <AdminCmsEditor initialSections={sections} />
    </div>
  );
}
