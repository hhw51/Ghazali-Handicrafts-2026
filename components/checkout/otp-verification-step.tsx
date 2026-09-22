'use client';

import { useState, useEffect } from 'react';
import { sendOrderOtp, verifyOrderOtp } from '@/actions/otp';
import { Smartphone, CheckCircle2, ShieldCheck, RefreshCw, Sparkles, AlertCircle, MessageSquare } from 'lucide-react';

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
  // Extract local 10 digits if a full +92 number is passed initially
  const initialLocalNumber = phone
    ? phone.replace(/^\+92/, '').replace(/^0/, '').slice(0, 10)
    : '';

  const [rawDigits, setRawDigits] = useState(initialLocalNumber);
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ''); // Digits only

    // If user mistakenly types a leading 0 (e.g. 0300...), strip it off
    if (input.startsWith('0')) {
      input = input.slice(1);
    }

    // Limit to exactly 10 digits
    const formattedDigits = input.slice(0, 10);
    setRawDigits(formattedDigits);

    // Propagate standard E.164 formatted number (+923XXXXXXXXX)
    if (formattedDigits.length > 0) {
      onPhoneChange(`+92${formattedDigits}`);
    } else {
      onPhoneChange('');
    }

    if (otpSent) setOtpSent(false);
    if (message) setMessage(null);
  };

  const handleSendOtp = async () => {
    // Pakistan numbers must be 10 digits after +92 and begin with '3'
    if (rawDigits.length !== 10 || !rawDigits.startsWith('3')) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid 10-digit mobile number starting with 3 (e.g. 300 1234567)',
      });
      return;
    }

    const fullPhoneNumber = `+92${rawDigits}`;

    setLoading(true);
    setMessage(null);

    const res = await sendOrderOtp(fullPhoneNumber, channel);
    setLoading(false);

    if (res.success) {
      setOtpSent(true);
      setCountdown(60);
      setMessage({
        type: 'info',
        text: res.message,
      });

      if (res.mockCode) {
        setCode(res.mockCode);
      }
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleVerifyOtp = async () => {
    if (!code || code.length !== 4) {
      setMessage({ type: 'error', text: 'Please enter the complete 4-digit code.' });
      return;
    }

    const fullPhoneNumber = `+92${rawDigits}`;

    setLoading(true);
    setMessage(null);

    const res = await verifyOrderOtp(fullPhoneNumber, code);
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
          {/* Dual Channel Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-charcoal">
              Verification Channel <span className="text-terracotta">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-parchment rounded-lg border border-border">
              <button
                type="button"
                onClick={() => {
                  setChannel('whatsapp');
                  if (message) setMessage(null);
                }}
                className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  channel === 'whatsapp'
                    ? 'bg-emerald-800 text-parchment shadow-craft-xs border border-emerald-700'
                    : 'bg-sandstone text-charcoal/80 hover:bg-chiseled border border-transparent'
                }`}
              >
                <svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.725-.515-5.279-1.413l-.378-.222-3.923 1.028 1.047-3.824-.247-.393c-.987-1.572-1.509-3.393-1.509-5.263 0-5.32 4.329-9.65 9.65-9.65 2.578 0 5.001 1.004 6.822 2.827s2.825 4.246 2.824 6.824c-.002 5.322-4.331 9.652-9.651 9.652m0-21.343c-6.443 0-11.687 5.244-11.687 11.687 0 2.062.538 4.07 1.56 5.836l-1.656 6.049 6.189-1.623c1.706.93 3.639 1.423 5.594 1.424h.005c6.442 0 11.686-5.245 11.688-11.688 0-3.122-1.216-6.058-3.427-8.27-2.211-2.212-5.147-3.427-8.266-3.427" />
                </svg>
                <span>WhatsApp (Instant)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setChannel('sms');
                  if (message) setMessage(null);
                }}
                className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  channel === 'sms'
                    ? 'bg-lapis text-parchment shadow-craft-xs border border-lapis'
                    : 'bg-sandstone text-charcoal/80 hover:bg-chiseled border border-transparent'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-brass shrink-0" />
                <span>SMS</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1.5">
              Mobile Phone Number (Pakistan) <span className="text-terracotta">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1 flex items-center">
                {/* Fixed country code badge */}
                <div className="absolute left-0 top-0 bottom-0 pl-3 pr-2.5 flex items-center gap-1.5 bg-[#EFE9DF] border-r border-border rounded-l-md pointer-events-none select-none">
                  <Smartphone className="w-4 h-4 text-muted" />
                  <span className="text-xs font-mono font-bold text-charcoal">+92</span>
                </div>

                {/* 10-digit input */}
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="300 1234567"
                  value={rawDigits}
                  onChange={handleInputChange}
                  disabled={loading || isVerified}
                  maxLength={10}
                  className="w-full pl-[74px] pr-3 py-2 text-xs bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal font-mono tracking-wider"
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || countdown > 0 || rawDigits.length !== 10}
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
            <p className="text-[10px] text-muted mt-1">Enter your 10-digit mobile number starting with 3</p>
          </div>

          {/* OTP Input Form when OTP is sent */}
          {otpSent && (
            <div className="p-4 bg-parchment rounded-lg border border-border space-y-3 animate-in fade-in duration-200">
              <label className="block text-xs font-semibold text-charcoal">
                Enter 4-Digit Verification Code <span className="text-terracotta">*</span>
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

              {/* Inline Channel Fallback Recommendation */}
              <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
                <span className="text-muted">Didn't receive the code via {channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}?</span>
                <button
                  type="button"
                  onClick={() => {
                    const newChannel = channel === 'whatsapp' ? 'sms' : 'whatsapp';
                    setChannel(newChannel);
                    setOtpSent(false);
                    setMessage({
                      type: 'info',
                      text: `Switched channel to ${newChannel === 'whatsapp' ? 'WhatsApp' : 'Regular SMS'}. Tap "Send OTP" to resend code.`,
                    });
                  }}
                  className="font-bold text-terracotta hover:underline shrink-0"
                >
                  Try sending via {channel === 'whatsapp' ? 'Regular SMS' : 'WhatsApp'} →
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
          <span>Verified Pakistan Mobile: <strong>+92 {rawDigits}</strong></span>
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