'use client';

import React from 'react';
import { Clock, Box, Truck, CheckCircle2 } from 'lucide-react';

interface TrackingStep {
  title: string;
  subtitle: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
}

const STEPS: TrackingStep[] = [
  {
    title: 'Pending Confirmation',
    subtitle: 'Verification & Order Booking',
    icon: Clock,
  },
  {
    title: 'Artisan Packaging & Crating',
    subtitle: 'Wooden Box & Bubble Buffering',
    icon: Box,
  },
  {
    title: 'Dispatched (Trax/TCS)',
    subtitle: 'Courier Tracking Assigned',
    icon: Truck,
  },
  {
    title: 'Delivered',
    subtitle: 'Doorstep Inspection & COD',
    icon: CheckCircle2,
  },
];

export function OrderTrackingStatus({ status, orderId = '' }: { status: string; orderId?: string }) {
  // Determine active milestone index (0 to 3) based on Supabase enum
  let currentStepIndex = 0;
  if (status === 'delivered') {
    currentStepIndex = 3;
  } else if (status === 'dispatched' || status === 'booked_with_courier') {
    currentStepIndex = 2;
  } else if (status === 'verified') {
    currentStepIndex = 1;
  } else {
    currentStepIndex = 0; // pending_verification
  }

  const isCancelled = status === 'cancelled';
  const isReturned = status === 'returned';

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E7DFD5]">
        <div>
          <h2 className="font-serif text-lg font-semibold text-[#1A1410] tracking-tight">
            Live Parcel Tracking
          </h2>
          {orderId && (
            <p className="text-xs text-[#8C8275] mt-0.5 font-mono">
              Order #{orderId.slice(0, 8)} • Real-time artisan crating pipeline
            </p>
          )}
        </div>
        <div className="bg-[#E7DFD5]/60 text-[#1A1410] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-mono">
          STATUS: {status.replace(/_/g, ' ')}
        </div>
      </div>

      {isCancelled || isReturned ? (
        <div className="my-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-center text-xs font-semibold">
          {isCancelled ? 'This order has been cancelled.' : 'Order marked as returned.'}
        </div>
      ) : (
        /* Stepper Flow */
        <div className="pt-8 pb-4 space-y-8 relative">
          {STEPS.map((step, index) => {
            const isCompleted = currentStepIndex >= index;
            const StepIcon = step.icon;

            return (
              <div key={index} className="flex items-start gap-4 relative">
                {/* Milestone Node */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isCompleted
                        ? 'bg-[#00875A] text-white'
                        : 'bg-[#FAF8F5] border-2 border-[#D5CCC0] text-[#A89F91]'
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>

                  {/* Vertical Track Line */}
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-0.5 h-12 mt-1.5 transition-colors duration-300 ${
                        currentStepIndex > index ? 'bg-[#00875A]' : 'bg-[#E7DFD5]'
                      }`}
                    />
                  )}
                </div>

                {/* Text Content */}
                <div className="pt-1.5">
                  <h3
                    className={`font-serif text-sm font-semibold transition-colors duration-200 ${
                      isCompleted ? 'text-[#1A1410]' : 'text-[#8C8275]'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#8C8275] mt-0.5 font-sans">{step.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function OrderTrackingStepper({ status, orderId = '' }: { status: string; orderId?: string }) {
  return <OrderTrackingStatus status={status} orderId={orderId} />;
}
