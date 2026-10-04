'use client';

import React from 'react';

export function PrintControls({ orderId }: { orderId: string }) {
  return (
    <div className="print:hidden max-w-[210mm] mx-auto mb-6 flex items-center justify-between p-3 bg-stone-100 border border-stone-300 rounded-lg">
      <span className="text-xs font-semibold text-stone-700">
        Order #{orderId.slice(0, 8)} Archival Packing Slip
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-1.5 bg-[#00405C] text-white text-xs font-medium rounded hover:bg-[#002D42] transition-colors cursor-pointer"
        >
          Print Slip
        </button>
        <button
          type="button"
          onClick={() => window.close()}
          className="px-4 py-1.5 bg-white border border-stone-300 text-xs font-medium rounded hover:bg-stone-50 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
