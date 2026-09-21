import { Product } from './product';

export type OrderStatus =
  | 'pending_verification'
  | 'verified'
  | 'booked_with_courier'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  city: string;
  address: string;
  landmark?: string | null;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: string;
  status: OrderStatus;
  otp_code?: string | null;
  otp_expires_at?: string | null;
  phone_verified: boolean;
  notes?: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  product?: Product;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  city: string;
  address: string;
  landmark?: string;
  notes?: string;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { product: Product })[];
}

export const PAKISTAN_MAJOR_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Gujrat',
  'Mardan',
  'Kasur',
  'Sahiwal',
  'Swat',
  'Chiniot',
  'Sheikhupura',
  'Okara',
  'Jhelum',
  'Wah Cantt',
  'Rahim Yar Khan',
  'Dera Ghazi Khan',
] as const;

export type PakistanCity = (typeof PAKISTAN_MAJOR_CITIES)[number];
