import { z } from 'zod';

export const sheetProductRowSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  'long description': z.string().optional().default(''),
  price: z.preprocess(
    (val) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const cleaned = val.replace(/[^0-9.-]+/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    },
    z.number().positive('Price must be greater than 0')
  ),
  'short description (underneath product picture)': z.string().optional().default(''),
  size: z.preprocess((val) => {
    if (val === null || val === undefined) return '';
    return String(val).trim();
  }, z.string()),
  stock: z.preprocess((val) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const lower = val.trim().toLowerCase();
      return lower === 'yes' || lower === 'in stock' || lower === 'true' || lower === 'available';
    }
    return Boolean(val);
  }, z.boolean()),
  images: z.preprocess((val) => {
    if (Array.isArray(val)) return val.map((v) => String(v).trim()).filter(Boolean);
    if (typeof val === 'string') {
      return val
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean);
    }
    return [];
  }, z.array(z.string())),
  colors: z.string().optional().default(''),
  design: z.string().optional().default(''),
  category: z.string().min(1, 'Category is required'),
  weight: z.preprocess((val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const cleaned = val.replace(/[^0-9.-]+/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }, z.number().nonnegative().default(0)),
  tags: z.preprocess((val) => {
    if (Array.isArray(val)) return val.map((v) => String(v).trim().toLowerCase()).filter(Boolean);
    if (typeof val === 'string') {
      return val
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);
    }
    return [];
  }, z.array(z.string())),
});

export type SheetProductRow = z.infer<typeof sheetProductRowSchema>;

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}
