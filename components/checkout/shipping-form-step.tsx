'use client';

import { PAKISTAN_LOGISTICS_CITIES } from '@/lib/constants/cities';
import { CheckoutFormValues } from '@/lib/validations/checkout';
import { MapPin, User, Mail, Home, Compass, FileText, Smartphone } from 'lucide-react';

interface ShippingFormStepProps {
  formData: CheckoutFormValues;
  onChange: (field: keyof CheckoutFormValues, value: string) => void;
  errors: Record<string, string | undefined>;
}

export function ShippingFormStep({ formData, onChange, errors }: ShippingFormStepProps) {
  // Extract local 10 digits if +92 is pre-attached
  const rawPhoneDigits = formData.customer_phone
    ? formData.customer_phone.replace(/^\+92/, '').replace(/^0/, '').slice(0, 10)
    : '';

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.startsWith('0')) {
      input = input.slice(1);
    }
    const formattedDigits = input.slice(0, 10);
    if (formattedDigits.length > 0) {
      onChange('customer_phone', `+92${formattedDigits}`);
    } else {
      onChange('customer_phone', '');
    }
  };

  return (
    <div className="bg-sandstone rounded-xl border border-border p-6 space-y-5 shadow-craft-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="w-8 h-8 bg-lapis text-parchment rounded-full flex items-center justify-center font-bold text-sm">
          1
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-charcoal">
            Customer & Delivery Details
          </h3>
          <p className="text-xs text-muted">Standardized courier formatting for instant dispatch</p>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {/* Full Name & Phone Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-charcoal mb-1">
              Full Recipient Name <span className="text-terracotta">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
              <input
                type="text"
                placeholder="e.g. Tariq Mehmood"
                value={formData.customer_name}
                onChange={(e) => onChange('customer_name', e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
              />
            </div>
            {errors.customer_name && (
              <p className="text-[11px] text-red-600 mt-1">{errors.customer_name}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">
              Mobile Phone Number (Pakistan) <span className="text-terracotta">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-0 top-0 bottom-0 pl-3 pr-2.5 flex items-center gap-1 bg-[#EFE9DF] border-r border-border rounded-l-md pointer-events-none select-none">
                <Smartphone className="w-3.5 h-3.5 text-muted" />
                <span className="text-xs font-mono font-bold text-charcoal">+92</span>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="300 1234567"
                value={rawPhoneDigits}
                onChange={handlePhoneInputChange}
                maxLength={10}
                className="w-full pl-[74px] pr-3 py-2 bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal font-mono tracking-wider"
              />
            </div>
            {errors.customer_phone ? (
              <p className="text-[11px] text-red-600 mt-1">{errors.customer_phone}</p>
            ) : (
              <p className="text-[10px] text-muted mt-1">10-digit mobile number starting with 3</p>
            )}
          </div>
        </div>

        {/* Email Address & Delivery City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-charcoal mb-1">
              Email Address <span className="text-muted font-normal">(Optional for receipts)</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
              <input
                type="email"
                placeholder="tariq@example.com"
                value={formData.customer_email || ''}
                onChange={(e) => onChange('customer_email', e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
              />
            </div>
            {errors.customer_email && (
              <p className="text-[11px] text-red-600 mt-1">{errors.customer_email}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">
              Delivery City (Pakistan Courier Hubs) <span className="text-terracotta">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-muted pointer-events-none" />
              <select
                value={formData.city}
                onChange={(e) => onChange('city', e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal cursor-pointer font-medium"
              >
                <option value="">-- Select Your Delivery City --</option>
                {PAKISTAN_LOGISTICS_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
          </div>
        </div>

        {/* Detailed Street Address */}
        <div>
          <label className="block font-semibold text-charcoal mb-1">
            Complete Street Address / House & Colony Number <span className="text-terracotta">*</span>
          </label>
          <div className="relative">
            <Home className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
            <input
              type="text"
              placeholder="House #12, Street 4, Sector F-8/2 or Main Bazaar Gulberg"
              value={formData.address}
              onChange={(e) => onChange('address', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
            />
          </div>
          {errors.address && <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>}
        </div>

        {/* Landmark & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-charcoal mb-1">
              Nearest Landmark <span className="text-muted font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Compass className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
              <input
                type="text"
                placeholder="Near Allied Bank or Commercial Market"
                value={formData.landmark || ''}
                onChange={(e) => onChange('landmark', e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">
              Delivery Notes <span className="text-muted font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
              <input
                type="text"
                placeholder="Call before arrival / Deliver on weekend"
                value={formData.notes || ''}
                onChange={(e) => onChange('notes', e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
