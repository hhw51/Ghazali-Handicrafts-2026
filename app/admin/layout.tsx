import Link from 'next/link';
import { Package, ShoppingCart, FileSpreadsheet, LayoutDashboard, LogOut, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-parchment flex flex-col md:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-sandstone border-r border-border p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <Link href="/admin/products" className="block">
              <span className="font-serif text-xl font-bold text-charcoal">
                Ghazali <span className="text-terracotta italic font-normal">Admin</span>
              </span>
            </Link>
            <p className="text-[10px] text-muted tracking-wider uppercase font-mono mt-0.5">
              Operations Control Panel
            </p>
          </div>

          <nav className="space-y-1.5 text-xs font-medium">
            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 px-3 py-2 text-charcoal hover:bg-parchment rounded-md transition-colors"
            >
              <Package className="w-4 h-4 text-lapis" />
              <span>Products & Stock</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 px-3 py-2 text-charcoal hover:bg-parchment rounded-md transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-terracotta" />
              <span>Orders Pipeline</span>
            </Link>

            <Link
              href="/admin/import"
              className="flex items-center gap-2.5 px-3 py-2 text-charcoal hover:bg-parchment rounded-md transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-brass" />
              <span>Bulk Excel Ingestion</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-border space-y-3 text-xs">
          {user && (
            <div className="text-[11px] text-muted truncate">
              Signed in: <strong className="text-charcoal font-mono">{user.email}</strong>
            </div>
          )}

          <Link
            href="/"
            className="flex items-center gap-2 text-muted hover:text-charcoal transition-colors py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </Link>

          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-terracotta bg-terracotta/10 hover:bg-terracotta/20 rounded-md transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out Admin
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">{children}</main>
    </div>
  );
}
