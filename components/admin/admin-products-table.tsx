'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Product } from '@/types/product';
import { EditProductModal } from './edit-product-modal';
import { StockToggle } from './stock-toggle';
import { bulkUpdateStock, bulkDeleteProducts, deleteProduct, toggleProductFeatured } from '@/actions/admin-products';
import { Pencil, Trash2, CheckCircle2, XCircle, AlertTriangle, RefreshCw, X, ShieldAlert, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminProductsTableProps {
  products: Product[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
}

export function AdminProductsTable({
  products: initialProducts,
  totalCount = initialProducts.length,
  currentPage = 1,
  pageSize = 25,
}: AdminProductsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [singleDeletingProduct, setSingleDeletingProduct] = useState<Product | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync if initialProducts changes via server revalidation
  if (initialProducts !== productList && !loadingAction && selectedIds.size === 0) {
    setProductList(initialProducts);
  }

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    // Optimistic UI update
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_featured: !currentFeatured } : p))
    );

    const res = await toggleProductFeatured(id, currentFeatured);
    if (res.success) {
      showToastNotification(
        `✓ Product ${!currentFeatured ? 'highlighted on Homepage Showcase' : 'removed from Showcase'}.`
      );
    } else {
      // Revert on error
      setProductList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_featured: currentFeatured } : p))
      );
      showToastNotification(res.error || 'Failed to update feature status.', 'error');
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const allSelected = productList.length > 0 && selectedIds.size === productList.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(productList.map((p) => p.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const showToastNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // --- Single Product Delete ---
  const handleSingleDelete = async () => {
    if (!singleDeletingProduct) return;
    setLoadingAction(true);
    const prodId = singleDeletingProduct.id;
    const prodName = singleDeletingProduct.name;

    const res = await deleteProduct(prodId);
    setLoadingAction(false);
    setSingleDeletingProduct(null);

    if (res.success) {
      setProductList((prev) => prev.filter((p) => p.id !== prodId));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(prodId);
        return next;
      });
      showToastNotification(`✓ Product "${prodName}" deleted successfully.`);
    } else {
      showToastNotification(res.error || 'Failed to delete product.', 'error');
    }
  };

  // --- Bulk Mark Stock ---
  const handleBulkStockUpdate = async (targetInStock: boolean) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    setLoadingAction(true);
    const res = await bulkUpdateStock(ids, targetInStock);
    setLoadingAction(false);

    if (res.success) {
      setProductList((prev) =>
        prev.map((p) => (ids.includes(p.id) ? { ...p, in_stock: targetInStock } : p))
      );
      showToastNotification(
        `✓ ${ids.length} product${ids.length > 1 ? 's' : ''} marked as ${
          targetInStock ? 'In Stock' : 'Out of Stock'
        }.`
      );
    } else {
      showToastNotification(res.error || 'Failed to update stock status.', 'error');
    }
  };

  // --- Bulk Delete ---
  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    setLoadingAction(true);
    const res = await bulkDeleteProducts(ids);
    setLoadingAction(false);
    setShowBulkDeleteConfirm(false);

    if (res.success) {
      setProductList((prev) => prev.filter((p) => !ids.includes(p.id)));
      setSelectedIds(new Set());
      showToastNotification(`✓ ${ids.length} product${ids.length > 1 ? 's' : ''} deleted successfully.`);
    } else {
      showToastNotification(res.error || 'Failed to delete products.', 'error');
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-craft-lg border flex items-center gap-3 max-w-md animate-in slide-in-from-top-4 duration-200 ${
            toast.type === 'error'
              ? 'bg-red-900 text-parchment border-red-700'
              : 'bg-lapis text-parchment border-brass/40'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-red-300 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-brass shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-auto p-1 text-parchment/70 hover:text-parchment rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-sandstone rounded-xl border border-border overflow-hidden shadow-craft-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-parchment border-b border-border font-serif font-bold text-charcoal select-none">
              <tr>
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border text-lapis focus:ring-brass cursor-pointer accent-lapis"
                    title="Select / Deselect All Products"
                  />
                </th>
                <th className="p-4 w-24 text-center">Actions</th>
                <th className="p-4">Thumbnail</th>
                <th className="p-4">Product Name & Slug</th>
                <th className="p-4">Craft Category</th>
                <th className="p-4">Design</th>
                <th className="p-4">Price (PKR)</th>
                <th className="p-4">Weight</th>
                <th className="p-4">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {productList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted">
                    No products found in catalog. Use "+ Add Product" or "Bulk Excel Import" to add products.
                  </td>
                </tr>
              ) : (
                productList.map((product) => {
                  const isSelected = selectedIds.has(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-brass/10 hover:bg-brass/15' : 'hover:bg-parchment/60'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(product.id)}
                          className="w-4 h-4 rounded border-border text-lapis focus:ring-brass cursor-pointer accent-lapis"
                        />
                      </td>

                      {/* Row Actions: Edit & Delete Buttons */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(product.id, !!product.is_featured)}
                            className={`p-1.5 rounded-md border transition-colors shadow-xs ${
                              product.is_featured
                                ? 'bg-amber-100 border-amber-300 text-amber-700 font-bold'
                                : 'bg-parchment hover:bg-sandstone border-border text-muted hover:text-charcoal'
                            }`}
                            title={product.is_featured ? 'Remove from Homepage Showcase' : 'Highlight on Homepage Showcase'}
                          >
                            <Star className={`w-3.5 h-3.5 ${product.is_featured ? 'fill-amber-500 text-amber-600' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingProduct(product)}
                            className="p-1.5 bg-parchment hover:bg-sandstone border border-border text-lapis hover:text-lapis/80 rounded-md transition-colors shadow-xs"
                            title="Edit product"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSingleDeletingProduct(product)}
                            className="p-1.5 bg-parchment hover:bg-red-50 border border-border text-terracotta hover:text-red-700 rounded-md transition-colors shadow-xs"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Thumbnail */}
                      <td className="p-4">
                        <div className="relative w-12 h-12 bg-parchment rounded-lg border border-border overflow-hidden shrink-0 shadow-xs">
                          <Image
                            src={product.images[0] || '/images/hero/craft-hero.png'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      </td>

                      {/* Product Name & Slug */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="font-serif font-bold text-charcoal flex items-center gap-1.5">
                            <span className="hover:text-lapis transition-colors">{product.name}</span>
                            {product.is_featured && (
                              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-bold rounded flex items-center gap-0.5 border border-amber-300">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" /> Featured
                              </span>
                            )}
                          </div>
                          {product.admin_name && product.admin_name !== product.name && (
                            <span className="text-[10px] text-muted block font-mono">
                              Internal: {product.admin_name}
                            </span>
                          )}
                          <span className="text-[11px] text-muted font-mono block">/{product.slug}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        {product.category ? (
                          <span className="px-2.5 py-1 bg-lapis/10 text-lapis font-semibold text-[11px] rounded-full border border-lapis/20">
                            {product.category.name}
                          </span>
                        ) : (
                          <span className="text-muted italic">Uncategorized</span>
                        )}
                      </td>

                      {/* Design Badge */}
                      <td className="p-4">
                        {product.design ? (
                          <span className="px-2 py-0.5 text-xs bg-stone-100 rounded text-charcoal font-medium border border-border">
                            {product.design}
                          </span>
                        ) : (
                          <span className="text-muted font-mono">—</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="p-4 font-mono font-bold text-terracotta text-sm">
                        Rs. {product.price.toLocaleString()}
                      </td>

                      {/* Weight */}
                      <td className="p-4 font-mono text-charcoal">
                        {product.weight || 0} kg
                      </td>

                      {/* Instant Stock Toggle */}
                      <td className="p-4">
                        <StockToggle productId={product.id} initialInStock={product.in_stock} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Server Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-parchment border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted font-sans">
              Showing page <strong className="text-charcoal font-mono">{currentPage}</strong> of <strong className="text-charcoal font-mono">{totalPages}</strong> ({totalCount} total products)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 bg-sandstone border border-border rounded-lg text-charcoal font-semibold disabled:opacity-40 flex items-center gap-1 hover:border-brass transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 bg-sandstone border border-border rounded-lg text-charcoal font-semibold disabled:opacity-40 flex items-center gap-1 hover:border-brass transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating / Sticky Bulk Actions Banner */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-charcoal text-parchment border-2 border-brass/60 rounded-2xl px-6 py-3.5 shadow-craft-lg flex flex-wrap items-center gap-4 animate-in slide-in-from-bottom-6 duration-200">
          <div className="flex items-center gap-2 pr-2 border-r border-parchment/20">
            <span className="w-2.5 h-2.5 rounded-full bg-brass animate-pulse"></span>
            <span className="font-serif font-bold text-sm text-brass font-mono">
              {selectedIds.size} {selectedIds.size === 1 ? 'product' : 'products'} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loadingAction}
              onClick={() => handleBulkStockUpdate(true)}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-parchment rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark In Stock
            </button>

            <button
              type="button"
              disabled={loadingAction}
              onClick={() => handleBulkStockUpdate(false)}
              className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-parchment rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <XCircle className="w-3.5 h-3.5" />
              Mark Out of Stock
            </button>

            <button
              type="button"
              disabled={loadingAction}
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="px-3 py-1.5 bg-terracotta hover:bg-red-700 text-parchment rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Bulk Delete
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="px-2.5 py-1.5 hover:bg-parchment/10 text-parchment/70 hover:text-parchment rounded-lg text-xs font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        onSuccess={(msg) => showToastNotification(msg)}
      />

      {/* Single Product Delete Confirmation Dialog */}
      {singleDeletingProduct && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-150">
          <div className="bg-parchment max-w-md w-full rounded-2xl border-2 border-border p-6 shadow-craft-lg space-y-4">
            <div className="flex items-center gap-3 text-terracotta">
              <ShieldAlert className="w-7 h-7" />
              <h3 className="font-serif text-lg font-bold text-charcoal">Delete Product</h3>
            </div>
            <p className="text-xs text-charcoal leading-relaxed">
              Are you sure you want to delete <strong className="font-bold">{singleDeletingProduct.name}</strong>? This action will permanently remove the product from the catalog and store.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSingleDeletingProduct(null)}
                className="px-4 py-2 bg-sandstone hover:bg-chiseled border border-border text-charcoal font-semibold text-xs rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loadingAction}
                onClick={handleSingleDelete}
                className="px-5 py-2 bg-terracotta hover:bg-red-700 text-parchment font-semibold text-xs rounded-md flex items-center gap-1.5"
              >
                {loadingAction ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-150">
          <div className="bg-parchment max-w-md w-full rounded-2xl border-2 border-border p-6 shadow-craft-lg space-y-4">
            <div className="flex items-center gap-3 text-terracotta">
              <ShieldAlert className="w-7 h-7" />
              <h3 className="font-serif text-lg font-bold text-charcoal">Bulk Delete Products</h3>
            </div>
            <p className="text-xs text-charcoal leading-relaxed">
              Are you sure you want to delete <strong className="font-bold">{selectedIds.size} selected products</strong>? This action cannot be undone and will permanently remove them from the database catalog.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 bg-sandstone hover:bg-chiseled border border-border text-charcoal font-semibold text-xs rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loadingAction}
                onClick={handleBulkDelete}
                className="px-5 py-2 bg-terracotta hover:bg-red-700 text-parchment font-semibold text-xs rounded-md flex items-center gap-1.5"
              >
                {loadingAction ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete {selectedIds.size} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
