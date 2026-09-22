import { z } from 'zod';
import { PAKISTAN_LOGISTICS_CITIES } from '../constants/cities';

export const pakistanPhoneSchema = z
  .string()
  .min(10, 'Phone number is too short')
  .max(13, 'Phone number is too long')
  .refine(
    (val) => {
      const cleaned = val.replace(/\s+/g, '');
      return /^(\+923|03)\d{9}$/.test(cleaned);
    },
    'Must be a valid Pakistan mobile number (e.g. 03001234567 or +923001234567)'
  );

export const otpSchema = z.object({
  phone: pakistanPhoneSchema,
  code: z.string().length(4, 'OTP must be exactly 4 digits'),
});

export const checkoutFormSchema = z.object({
  customer_name: z.string().min(2, 'Full Name is required'),
  customer_phone: pakistanPhoneSchema,
  customer_email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  city: z.enum(PAKISTAN_LOGISTICS_CITIES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid Pakistan delivery city' }),
  }),
  address: z.string().min(8, 'Please provide a detailed street address and house/shop number'),
  landmark: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  payment_method: z.literal('COD'),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
