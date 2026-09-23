import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';
import { CartItem, UnitSelection } from '@/types/order';

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
    selectedDesign?: string,
    unitBreakdown?: UnitSelection[]
  ) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateVariant: (
    productId: string,
    selectedColor?: string,
    selectedDesign?: string,
    unitBreakdown?: UnitSelection[]
  ) => void;
  updateUnitSelection: (
    productId: string,
    unitIndex: number,
    field: 'color' | 'design',
    value: string
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
        selectedDesign?: string,
        unitBreakdown?: UnitSelection[]
      ) => {
        if (!product.in_stock) {
          return false;
        }

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => (item.productId || item.product?.id || item.id) === product.id
        );

        const initialColor =
          selectedColor ||
          (product.colors ? product.colors.split(',')[0].trim() : undefined);
        const initialDesign =
          selectedDesign ||
          (product.design ? product.design.split(',')[0].trim() : undefined);

        const defaultBreakdown: UnitSelection[] = Array.from(
          { length: quantity },
          () => ({
            color: initialColor,
            design: initialDesign,
          })
        );

        const incomingBreakdown =
          unitBreakdown && unitBreakdown.length === quantity
            ? unitBreakdown
            : defaultBreakdown;

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const existing = updatedItems[existingIndex];
          const newQuantity = existing.quantity + quantity;

          const existingBreakdown =
            existing.unitBreakdown ||
            existing.unitSelections ||
            Array.from({ length: existing.quantity }, () => ({
              color: existing.selectedColor || initialColor,
              design: existing.selectedDesign || initialDesign,
            }));

          const nextBreakdown = [...existingBreakdown, ...incomingBreakdown];

          updatedItems[existingIndex] = {
            ...existing,
            quantity: newQuantity,
            selectedColor: selectedColor || existing.selectedColor || initialColor,
            selectedDesign: selectedDesign || existing.selectedDesign || initialDesign,
            unitBreakdown: nextBreakdown,
            unitSelections: nextBreakdown,
          };
          set({ items: updatedItems, isOpen: true });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: product.id,
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] || '/images/hero/craft-hero.png',
                quantity,
                availableColors: product.colors
                  ? product.colors.split(',').map((c) => c.trim()).filter(Boolean)
                  : [],
                availableDesigns: product.design
                  ? product.design.split(',').map((d) => d.trim()).filter(Boolean)
                  : [],
                unitSelections: incomingBreakdown,
                unitBreakdown: incomingBreakdown,
                product,
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
          items: get().items.filter(
            (item) => item.productId !== productId && item.product?.id !== productId && item.id !== productId
          ),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const updatedItems = get().items.map((item) => {
          if (item.productId === productId || item.product?.id === productId || item.id === productId) {
            const oldQty = item.quantity;
            let currentBreakdown = [
              ...(item.unitBreakdown || item.unitSelections || []),
            ];

            const colorOpts = item.availableColors || (item.product?.colors ? item.product.colors.split(',').map(c => c.trim()).filter(Boolean) : []);
            const designOpts = item.availableDesigns || (item.product?.design ? item.product.design.split(',').map(d => d.trim()).filter(Boolean) : []);
            const defColor = item.selectedColor || colorOpts[0];
            const defDesign = item.selectedDesign || designOpts[0];

            if (quantity > oldQty) {
              const diff = quantity - oldQty;
              for (let i = 0; i < diff; i++) {
                const prevUnit =
                  currentBreakdown.length > 0
                    ? currentBreakdown[currentBreakdown.length - 1]
                    : null;
                currentBreakdown.push({
                  color: prevUnit?.color || defColor,
                  design: prevUnit?.design || defDesign,
                });
              }
            } else if (quantity < oldQty) {
              currentBreakdown = currentBreakdown.slice(0, quantity);
            }

            return {
              ...item,
              quantity,
              unitBreakdown: currentBreakdown,
              unitSelections: currentBreakdown,
            };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      updateVariant: (
        productId: string,
        selectedColor?: string,
        selectedDesign?: string
      ) => {
        const updatedItems = get().items.map((item) => {
          if (item.productId === productId || item.product?.id === productId || item.id === productId) {
            return {
              ...item,
              selectedColor:
                selectedColor !== undefined ? selectedColor : item.selectedColor,
              selectedDesign:
                selectedDesign !== undefined ? selectedDesign : item.selectedDesign,
            };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      updateUnitSelection: (
        productId: string,
        unitIndex: number,
        field: 'color' | 'design',
        value: string
      ) => {
        const updatedItems = get().items.map((item) => {
          if (item.productId === productId || item.product?.id === productId || item.id === productId) {
            const colorOpts = item.availableColors || (item.product?.colors ? item.product.colors.split(',').map(c => c.trim()).filter(Boolean) : []);
            const designOpts = item.availableDesigns || (item.product?.design ? item.product.design.split(',').map(d => d.trim()).filter(Boolean) : []);
            const defColor = item.selectedColor || colorOpts[0];
            const defDesign = item.selectedDesign || designOpts[0];

            let breakdown = [
              ...(item.unitBreakdown || item.unitSelections || []),
            ];

            while (breakdown.length < item.quantity) {
              breakdown.push({ color: defColor, design: defDesign });
            }

            breakdown = breakdown.map((u, idx) =>
              idx === unitIndex ? { ...u, [field]: value } : u
            );

            return {
              ...item,
              unitBreakdown: breakdown,
              unitSelections: breakdown,
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
          (sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity,
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
