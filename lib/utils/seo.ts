export function getProductImageAlt(
  product: {
    name: string;
    size?: string | null;
    category?: { name: string } | string | null;
  },
  index = 0
): string {
  const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
  const sizeStr = product.size ? ` (${product.size} inches)` : '';
  const angleStr = index > 0 ? ` - Angle ${index + 1}` : '';
  return `Authentic Pakistani handcrafted ${product.name}${sizeStr} - ${categoryName || 'Artisan Craft'}${angleStr} from Ghazali Handicrafts Lahore`;
}
