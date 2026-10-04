'use client';

// Complete DB enum list:
// 'pending_verification' | 'verified' | 'booked_with_courier' | 'dispatched' | 'delivered' | 'cancelled' | 'returned'

const TRACKING_STEPS = [
  {
    key: 'pending',
    title: 'Pending Confirmation',
    description: 'Verification & Order Booking',
    // Matches if status is pending_verification or anything beyond
    activeStatuses: ['pending_verification', 'verified', 'booked_with_courier', 'dispatched', 'delivered'],
  },
  {
    key: 'crating',
    title: 'Artisan Packaging & Crating',
    description: 'Wooden Box & Bubble Buffering',
    // Reached once verified or beyond
    activeStatuses: ['verified', 'booked_with_courier', 'dispatched', 'delivered'],
  },
  {
    key: 'dispatched',
    title: 'Dispatched (Trax/TCS)',
    description: 'Courier Tracking Assigned',
    // Reached once booked with courier or dispatched
    activeStatuses: ['booked_with_courier', 'dispatched', 'delivered'],
  },
  {
    key: 'delivered',
    title: 'Delivered',
    description: 'Doorstep Inspection & COD',
    // Reached when delivered
    activeStatuses: ['delivered'],
  },
];

export function OrderTrackingStepper({ status }: { status: string }) {
  const isCancelled = status === 'cancelled';
  const isReturned = status === 'returned';

  if (isCancelled || isReturned) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-center my-6">
        <p className="font-semibold text-sm">
          {isCancelled ? 'Order Cancelled' : 'Order Returned to Lahore Flagship Studio'}
        </p>
      </div>
    );
  }

  // Determine current active milestone index (0 to 3)
  let currentStepIndex = 0;
  if (status === 'delivered') currentStepIndex = 3;
  else if (status === 'dispatched' || status === 'booked_with_courier') currentStepIndex = 2;
  else if (status === 'verified') currentStepIndex = 1;
  else currentStepIndex = 0;

  return (
    <div className="py-6 space-y-8 relative">
      {TRACKING_STEPS.map((step, idx) => {
        // A step is complete if current step index is >= this step's index
        const isCompleted = currentStepIndex >= idx;

        return (
          <div key={step.key} className="flex items-start gap-4 relative">
            {/* Step Icon */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#00875A] text-white shadow-md'
                    : 'bg-[#FAF8F5] border-2 border-[#D5CCC0] text-[#8C8275]'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5 stroke-current stroke-[2.5]" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D5CCC0]" />
                )}
              </div>

              {/* Vertical connector line between steps */}
              {idx < TRACKING_STEPS.length - 1 && (
                <div
                  className={`w-0.5 h-10 mt-1 transition-colors duration-300 ${
                    currentStepIndex > idx ? 'bg-[#00875A]' : 'bg-[#E7DFD5]'
                  }`}
                />
              )}
            </div>

            {/* Step Labels */}
            <div className="pt-1">
              <p
                className={`font-serif text-sm font-semibold ${
                  isCompleted ? 'text-[#1A1410]' : 'text-[#8C8275]'
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-[#6B6359]">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
