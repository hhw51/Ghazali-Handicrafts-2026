import { getAdminCategories } from '@/actions/admin-categories';
import { AdminCategoriesManager } from '@/components/admin/admin-categories-manager';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Categories & Hubs Management | Ghazali Admin',
  description: 'Manage storefront categories, edit slugs, and view active product counts.',
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return <AdminCategoriesManager initialCategories={categories} />;
}
