'use client';

import { Banknote, CreditCard, Wallet, ShieldCheck } from 'lucide-react';

export function PaymentMethodStep() {
  return (
    <div className="bg-sandstone rounded-xl border border-border p-6 space-y-5 shadow-craft-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="w-8 h-8 bg-lapis text-parchment rounded-full flex items-center justify-center font-bold text-sm">
          3
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-charcoal">
            Payment Selection
          </h3>
          <p className="text-xs text-muted">Safe doorstep cash transaction guaranteed</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Active Cash on Delivery (COD) Option */}
        <label className="flex items-start gap-4 p-4 bg-parchment rounded-lg border-2 border-brass cursor-pointer shadow-craft-sm">
          <input
            type="radio"
            name="payment_method"
            value="COD"
            defaultChecked
            className="mt-1 text-lapis focus:ring-brass"
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-charcoal text-base flex items-center gap-2">
                <Banknote className="w-5 h-5 text-terracotta" /> Cash on Delivery (COD)
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                Active & Recommended
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Pay the courier rider in cash upon receiving and inspecting your fragile wooden crate parcel at your doorstep anywhere in Pakistan.
            </p>
          </div>
        </label>

        {/* Disabled Digital Card Option */}
        <label className="flex items-start gap-4 p-4 bg-parchment/50 rounded-lg border border-border/60 opacity-60 cursor-not-allowed">
          <input type="radio" name="payment_method" value="CARD" disabled className="mt-1 text-muted" />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-serif font-semibold text-charcoal text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted" /> Debit / Credit Card (Visa / MasterCard)
              </span>
              <span className="text-[10px] font-semibold text-muted bg-sandstone px-2 py-0.5 rounded border border-border">
                Coming Soon
              </span>
            </div>
            <p className="text-[11px] text-muted">Online gateway integration in progress.</p>
          </div>
        </label>

        {/* Disabled Mobile Wallet Option */}
        <label className="flex items-start gap-4 p-4 bg-parchment/50 rounded-lg border border-border/60 opacity-60 cursor-not-allowed">
          <input type="radio" name="payment_method" value="WALLET" disabled className="mt-1 text-muted" />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-serif font-semibold text-charcoal text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-muted" /> EasyPaisa / JazzCash Mobile Wallet
              </span>
              <span className="text-[10px] font-semibold text-muted bg-sandstone px-2 py-0.5 rounded border border-border">
                Coming Soon
              </span>
            </div>
            <p className="text-[11px] text-muted">Mobile wallet instant checkout coming soon.</p>
          </div>
        </label>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted pt-2 text-center">
        <ShieldCheck className="w-4 h-4 text-brass" />
        <span>Fragile Crate Guarantee & 100% Doorstep Payment Protection</span>
      </div>
    </div>
  );
}
