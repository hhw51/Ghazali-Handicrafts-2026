import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';
import { CartItem } from '@/types/order';

const FREE_SHIPPING_THRESHOLD = 10000; // 10,000 PKR
const STANDARD_SHIPPING_FEE = 350;     // 350 PKR

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (
    product: Product,
    quantity?: number,
    selectedColor?: string,
    selectedDesign?: string
  ) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateVariant: (
    productId: string,
    selectedColor?: string,
    selectedDesign?: string
  ) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;

  // Computations
  getSubtotal: () => number;
  getItemCount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getAmountForFreeShipping: () => number;
  getFreeShippingProgress: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (
        product: Product,
        quantity = 1,
        selectedColor?: string,
        selectedDesign?: string
      ) => {
        if (!product.in_stock) {
          return false;
        }

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.product.id === product.id
        );

        const initialColor =
          selectedColor ||
          (product.colors ? product.colors.split(',')[0].trim() : undefined);
        const initialDesign =
          selectedDesign ||
          (product.design ? product.design.split(',')[0].trim() : undefined);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const existing = updatedItems[existingIndex];
          updatedItems[existingIndex] = {
            ...existing,
            quantity: existing.quantity + quantity,
            selectedColor: selectedColor || existing.selectedColor || initialColor,
            selectedDesign: selectedDesign || existing.selectedDesign || initialDesign,
          };
          set({ items: updatedItems, isOpen: true });
        } else {
          set({
            items: [
              ...currentItems,
              {
                product,
                quantity,
                selectedColor: initialColor,
                selectedDesign: initialDesign,
              },
            ],
            isOpen: true,
          });
        }
        return true;
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const updatedItems = get().items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },

      updateVariant: (productId: string, selectedColor?: string, selectedDesign?: string) => {
        const updatedItems = get().items.map((item) => {
          if (item.product.id === productId) {
            return {
              ...item,
              selectedColor: selectedColor !== undefined ? selectedColor : item.selectedColor,
              selectedDesign: selectedDesign !== undefined ? selectedDesign : item.selectedDesign,
            };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleDrawer: () => {
        set({ isOpen: !get().isOpen });
      },

      openDrawer: () => {
        set({ isOpen: true });
      },

      closeDrawer: () => {
        set({ isOpen: false });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
          return 0;
        }
        return STANDARD_SHIPPING_FEE;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getShippingFee();
      },

      getAmountForFreeShipping: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
      },

      getFreeShippingProgress: () => {
        const subtotal = get().getSubtotal();
        return Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
      },
    }),
    {
      name: 'ghazali-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
