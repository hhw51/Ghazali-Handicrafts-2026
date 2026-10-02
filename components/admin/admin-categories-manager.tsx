'use client';

import React, { useState } from 'react';
import { CategoryWithCount, upsertCategory, deleteCategory } from '@/actions/admin-categories';
import { Plus, Edit2, Trash2, FolderKanban, AlertCircle, CheckCircle2, X, Sparkles, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminCategoriesManagerProps {
  initialCategories: CategoryWithCount[];
}

export function AdminCategoriesManager({ initialCategories }: AdminCategoriesManagerProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Deletion modal state
  const [deleteConfirmCat, setDeleteConfirmCat] = useState<CategoryWithCount | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const slugify = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsSlugManuallyEdited(true);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setIsSlugManuallyEdited(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setIsSlugManuallyEdited(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setErrorMsg('Category name and slug are required.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await upsertCategory({
      id: editingCategory?.id,
      name,
      slug,
    });

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to save category.');
    } else {
      setSuccessMsg(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
      closeModal();
      router.refresh();
    }
  };

  const handleDelete = async (cat: CategoryWithCount) => {
    setDeleteLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await deleteCategory(cat.id);
    setDeleteLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to delete category.');
      setDeleteConfirmCat(null);
    } else {
      setSuccessMsg(`Category "${cat.name}" deleted successfully.`);
      setDeleteConfirmCat(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-sandstone p-6 rounded-xl border border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-charcoal">Categories & Craft Hubs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-terracotta/10 text-terracotta border border-terracotta/20">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Manage storefront craft categories. Categories with 0 active products are automatically hidden from the storefront.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00405C] hover:bg-[#003248] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Global Alert Messages */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold block">Action Error</strong>
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold block">Success</strong>
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories Data Table */}
      <div className="bg-sandstone/60 border border-border rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sandstone border-b border-border text-muted font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Category Name</th>
                <th className="py-3.5 px-4 font-semibold">Slug Identifier</th>
                <th className="py-3.5 px-4 font-semibold">Active Products</th>
                <th className="py-3.5 px-4 font-semibold">Created Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-parchment">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <FolderKanban className="w-8 h-8 mx-auto mb-2 text-muted/60" />
                    <p className="font-medium text-sm text-charcoal">No categories found</p>
                    <p className="text-xs">Click "Add Category" above to create your first craft hub.</p>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-sandstone/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-charcoal">
                      <div className="flex items-center gap-2">
                        <span>{cat.name}</span>
                        {cat.product_count === 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 rounded-full">
                            Hidden (0 Active)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted text-xs">{cat.slug}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          cat.product_count > 0
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-sandstone text-muted border border-border'
                        }`}
                      >
                        {cat.product_count} active product{cat.product_count === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      {cat.created_at ? new Date(cat.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-charcoal hover:text-lapis hover:bg-sandstone rounded-md transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmCat(cat)}
                          className="p-1.5 text-charcoal hover:text-terracotta hover:bg-sandstone rounded-md transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upsert Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-parchment border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border bg-sandstone">
              <h2 className="font-serif text-lg font-bold text-charcoal">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-muted hover:text-charcoal p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Category Name <span className="text-terracotta">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Multani Blue Pottery"
                  className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-lapis font-medium"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-charcoal">
                    URL Slug Identifier <span className="text-terracotta">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSlug(slugify(name));
                      setIsSlugManuallyEdited(false);
                    }}
                    className="text-[11px] text-lapis hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-generate
                  </button>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="e.g. multani-blue-pottery"
                  className="w-full px-3 py-2 bg-sandstone border border-border rounded-lg text-charcoal font-mono text-xs focus:outline-none focus:ring-1 focus:ring-lapis"
                  required
                />
                <p className="text-[10px] text-muted mt-1">
                  Used in storefront URL filter: <code className="font-mono text-terracotta">/products?category={slug || '...'}</code>
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-sandstone border border-border hover:bg-chiseled rounded-lg font-medium text-charcoal transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#00405C] hover:bg-[#003248] text-white font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmCat && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-parchment border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-terracotta">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-charcoal">Confirm Deletion</h3>
            </div>

            <p className="text-xs text-charcoal leading-relaxed">
              Are you sure you want to delete category <strong>"{deleteConfirmCat.name}"</strong>?
            </p>

            {deleteConfirmCat.product_count > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
                <strong>Warning:</strong> {deleteConfirmCat.product_count} product(s) are linked to this category. You must reassign or remove those products before deleting this category.
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmCat(null)}
                className="px-4 py-2 bg-sandstone border border-border hover:bg-chiseled rounded-lg font-medium text-charcoal text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmCat)}
                disabled={deleteLoading}
                className="px-4 py-2 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
