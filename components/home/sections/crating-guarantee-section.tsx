'use client';

import React from 'react';
import { PackageCheck, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';

export function CratingGuaranteeSection() {
  return (
    <section className="w-full py-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin bg-surface">
      <div className="max-w-7xl mx-auto space-y-space-lg">
        {/* Section Title & Reassurance */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-[#1E4B3E] font-bold">
            Uncompromising Transit Assurance
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            The Ghazali Fragile Crating Guarantee
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            We understand the fragility of fired clay glazes, carved walnut, and Himalayan salt crystals. That is why our transit process is museum-grade.
          </p>
        </div>

        {/* 3 Distinct Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Card 1 */}
          <div className="p-space-lg rounded-xl bg-surface-container shadow-xs hover:shadow-md transition-shadow flex flex-col space-y-space-sm relative overflow-hidden border border-surface-container-high">
            <div className="w-12 h-12 rounded-lg bg-[#1E4B3E]/10 text-[#1E4B3E] flex items-center justify-center mb-1">
              <PackageCheck className="w-7 h-7" />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Multi-Layer Crating</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Every porcelain vase, rock salt sculpture, and walnut panel is cushioned in dual shock-absorbent cell-foam, cocooned in heavy-duty bubble wraps, and sealed inside reinforced wooden transit framing.
            </p>
            <div className="pt-2 font-label-sm text-label-sm text-[#1E4B3E] uppercase tracking-widest font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#1E4B3E]" />
              <span>Engineered for Ceramic Glazes</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-space-lg rounded-xl bg-surface-container shadow-xs hover:shadow-md transition-shadow flex flex-col space-y-space-sm relative overflow-hidden border border-surface-container-high">
            <div className="w-12 h-12 rounded-lg bg-[#00405C]/10 text-[#00405C] flex items-center justify-center mb-1">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">100% Zero-Breakage Policy</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Should transit mishandling ever result in a chipped rim, hair fracture, or damaged timber, our emergency dispatch sends a complimentary, priority replacement immediately without dispute.
            </p>
            <div className="pt-2 font-label-sm text-label-sm text-[#00405C] uppercase tracking-widest font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#00405C]" />
              <span>Immediate Replacement Courier</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-space-lg rounded-xl bg-surface-container shadow-xs hover:shadow-md transition-shadow flex flex-col space-y-space-sm relative overflow-hidden border border-surface-container-high">
            <div className="w-12 h-12 rounded-lg bg-[#B38743]/10 text-[#B38743] flex items-center justify-center mb-1">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Inspect on Delivery (COD)</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Unbox and verify the safety of your artisanal piece right at your doorstep before handing over the Cash on Delivery payment. True peace of mind in every Pakistani city and tehsil.
            </p>
            <div className="pt-2 font-label-sm text-label-sm text-[#B38743] uppercase tracking-widest font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#B38743]" />
              <span>Open Parcel Clearance Authorized</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CratingGuaranteeSection as TrustBarSection };
