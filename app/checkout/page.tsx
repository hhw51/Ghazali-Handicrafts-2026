'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { ShippingFormStep } from '@/components/checkout/shipping-form-step';
import { PaymentMethodStep } from '@/components/checkout/payment-method-step';
import { CheckoutOrderSummary } from '@/components/checkout/checkout-order-summary';
import { createOrder } from '@/actions/checkout';
import { checkoutFormSchema, CheckoutFormValues } from '@/lib/validations/checkout';
import { ShieldCheck, ArrowLeft, AlertCircle, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  const { items, getSubtotal, getShippingFee, getTotal, clearCart } = useCartStore();

  const [formData, setFormData] = useState<CheckoutFormValues>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    city: '' as any,
    address: '',
    landmark: '',
    notes: '',
    payment_method: 'COD',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="py-20 max-w-7xl mx-auto px-4" />;

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();

  const handleFieldChange = (field: keyof CheckoutFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (formError) setFormError(null);
  };

  const handleSubmitOrder = async () => {
    setFormError(null);
    setFieldErrors({});

    if (items.length === 0) {
      setFormError('Your shopping bag is empty. Please add craft items before placing an order.');
      return;
    }

    // Validate customer form values using Zod schema
    const validation = checkoutFormSchema.safeParse(formData);
    if (!validation.success) {
      const errorsMap: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errorsMap[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errorsMap);
      setFormError('Please complete all required fields correctly before placing your order.');
      return;
    }

    setIsSubmitting(true);

    const payloadItems = items.map((i) => ({
      productId: i.product?.id || i.productId,
      quantity: i.quantity,
      unitSelections: i.unitSelections || i.unitBreakdown,
    }));

    const response = await createOrder({
      items: payloadItems,
      customer: validation.data,
    });

    setIsSubmitting(false);

    if (response.success && response.orderId) {
      clearCart();
      router.push(`/order-success/${response.orderId}`);
    } else {
      setFormError(response.error || 'Failed to record your order. Please try again.');
    }
  };

  return (
    <div className="pb-24 pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Distraction-Free Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link href="/cart" className="text-xs text-muted hover:text-lapis flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Shopping Bag
          </Link>
          <h1 className="font-serif text-3xl font-bold text-charcoal">
            Cash on Delivery Checkout
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-terracotta bg-brass/15 px-3 py-1.5 rounded-full border border-brass/30">
          <ShieldCheck className="w-4 h-4 text-terracotta" /> 100% Doorstep Payment Protection
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-20 bg-sandstone rounded-2xl border border-border text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-parchment rounded-full flex items-center justify-center mx-auto border border-border text-muted">
            <ShoppingBag className="w-8 h-8 text-muted" />
          </div>
          <h3 className="font-serif text-xl font-bold text-charcoal">Your cart is empty</h3>
          <p className="text-xs text-muted">Please add authentic craft items to your bag before checking out.</p>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-lapis text-parchment text-xs font-medium rounded-md hover:bg-lapis/90 transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Checkout Form Steps */}
          <div className="lg:col-span-7 space-y-6">
            {formError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <ShippingFormStep
              formData={formData}
              onChange={handleFieldChange}
              errors={fieldErrors}
            />

            <PaymentMethodStep />
          </div>

          {/* Right Column: Sticky Summary & Checkout Action */}
          <div className="lg:col-span-5">
            <CheckoutOrderSummary
              items={items}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              isSubmitting={isSubmitting}
              onSubmitOrder={handleSubmitOrder}
            />
          </div>
        </div>
      )}
    </div>
  );
}
