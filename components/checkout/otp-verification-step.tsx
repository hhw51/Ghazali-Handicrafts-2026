'use client';

import { useState, useEffect } from 'react';
import { sendOrderOtp, verifyOrderOtp } from '@/actions/otp';
import { Smartphone, CheckCircle2, ShieldCheck, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

interface OtpVerificationStepProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  isVerified: boolean;
  onVerifiedChange: (verified: boolean) => void;
}

export function OtpVerificationStep({
  phone,
  onPhoneChange,
  isVerified,
  onVerifiedChange,
}: OtpVerificationStepProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!phone || phone.trim().length < 10) {
      setMessage({ type: 'error', text: 'Please enter a valid Pakistan mobile number (e.g. 03001234567)' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const res = await sendOrderOtp(phone);
    setLoading(false);

    if (res.success) {
      setOtpSent(true);
      setCountdown(60);
      setMessage({
        type: 'info',
        text: res.message,
      });

      if (res.mockCode) {
        // Auto-fill mock code in local development for smooth testing experience
        setCode(res.mockCode);
      }
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleVerifyOtp = async () => {
    if (!code || code.length !== 4) {
      setMessage({ type: 'error', text: 'Please enter the complete 4-digit code sent via SMS.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const res = await verifyOrderOtp(phone, code);
    setLoading(false);

    if (res.success) {
      onVerifiedChange(true);
      setMessage({ type: 'success', text: '✓ Mobile number verified successfully!' });
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="bg-sandstone rounded-xl border border-border p-6 space-y-5 shadow-craft-sm">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lapis text-parchment rounded-full flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal">
              Phone & OTP Verification
            </h3>
            <p className="text-xs text-muted">Verification required for Cash on Delivery fraud reduction</p>
          </div>
        </div>

        {isVerified && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Phone Verified
          </span>
        )}
      </div>

      {!isVerified ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Mobile Phone Number (Pakistan) <span className="text-terracotta">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Smartphone className="w-4 h-4 absolute left-3 top-3 text-muted" />
                <input
                  type="tel"
                  placeholder="03001234567 or +923001234567"
                  value={phone}
                  onChange={(e) => {
                    onPhoneChange(e.target.value);
                    if (otpSent) setOtpSent(false);
                  }}
                  disabled={loading || isVerified}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal font-mono"
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || countdown > 0}
                className="px-4 py-2 bg-lapis hover:bg-lapis/90 text-parchment text-xs font-medium rounded-md transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1.5"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-brass" /> {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* OTP Input Form when OTP is sent */}
          {otpSent && (
            <div className="p-4 bg-parchment rounded-lg border border-border space-y-3 animate-in fade-in duration-200">
              <label className="block text-xs font-semibold text-charcoal">
                Enter 4-Digit SMS Verification Code <span className="text-terracotta">*</span>
              </label>

              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-32 px-3 py-2 text-center text-lg font-bold font-mono tracking-widest bg-sandstone border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
                />

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading || code.length !== 4}
                  className="px-5 py-2.5 bg-terracotta hover:bg-terracotta/90 text-parchment text-xs font-medium rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Verify Code'}
                </button>
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {message && (
            <div
              className={`p-3 rounded-md text-xs flex items-start gap-2 ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-lapis/10 text-lapis border border-lapis/20'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
          <span>Verified Pakistan Mobile: <strong>{phone}</strong></span>
          <button
            type="button"
            onClick={() => {
              onVerifiedChange(false);
              setOtpSent(false);
              setCode('');
            }}
            className="text-terracotta hover:underline text-[11px] font-medium"
          >
            Change Phone Number
          </button>
        </div>
      )}
    </div>
  );
}
