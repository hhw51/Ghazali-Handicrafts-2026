'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, FileSpreadsheet } from 'lucide-react';
import { AddProductModal } from '@/components/admin/add-product-modal';

interface AdminProductsHeaderProps {
  totalCount: number;
}

export function AdminProductsHeader({ totalCount }: AdminProductsHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">
            Product Catalog & Stock Control
          </h1>
          <p className="text-xs text-muted mt-1">
            Real-time stock status updates & pricing override panel ({totalCount} products listed)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-lapis hover:bg-lapis/90 text-parchment text-xs font-semibold rounded-md shadow-craft-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-brass" /> + Add Product
          </button>

          <Link
            href="/admin/import"
            className="px-4 py-2 bg-sandstone hover:bg-chiseled border border-border text-charcoal text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-craft-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-brass" /> Bulk Excel Import
          </Link>
        </div>
      </div>

      <AddProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          // Revalidates server data
          window.location.reload();
        }}
      />
    </>
  );
}
