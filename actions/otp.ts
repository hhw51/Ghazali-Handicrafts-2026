'use server';

import { pakistanPhoneSchema } from '@/lib/validations/checkout';

// In-memory OTP store for session verification (phone -> { code, expiresAt })
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function sendOrderOtp(rawPhone: string): Promise<{
  success: boolean;
  message: string;
  mockCode?: string;
}> {
  try {
    const phoneResult = pakistanPhoneSchema.safeParse(rawPhone);
    if (!phoneResult.success) {
      return {
        success: false,
        message: phoneResult.error.errors[0]?.message || 'Invalid Pakistan phone number',
      };
    }

    const cleanedPhone = rawPhone.replace(/\s+/g, '');
    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store in memory
    otpStore.set(cleanedPhone, { code: generatedCode, expiresAt });

    const apiKey = process.env.SENDPK_API_KEY;
    const senderId = process.env.SENDPK_SENDER_ID || 'GhazaliCraft';

    if (apiKey && apiKey.trim().length > 0) {
      // Call SendPK Gateway API
      const response = await fetch(
        `https://sendpk.com/api/sms.php?api_key=${encodeURIComponent(apiKey)}&sender=${encodeURIComponent(senderId)}&to=${encodeURIComponent(cleanedPhone)}&message=${encodeURIComponent(`Your Ghazali Handicrafts order verification OTP is ${generatedCode}. Valid for 5 minutes.`)}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        console.error('SendPK Gateway Response Error:', await response.text());
      }
      return {
        success: true,
        message: `OTP verification SMS dispatched to ${cleanedPhone}`,
      };
    } else {
      // Graceful local development mock logging
      console.log(`\n==================================================`);
      console.log(`📱 [GHAZALI HANDICRAFTS OTP MOCK] Phone: ${cleanedPhone} | OTP Code: ${generatedCode}`);
      console.log(`==================================================\n`);

      return {
        success: true,
        message: `[DEV MOCK] Verification code ${generatedCode} sent to ${cleanedPhone}`,
        mockCode: generatedCode,
      };
    }
  } catch (error) {
    console.error('sendOrderOtp Error:', error);
    return {
      success: false,
      message: 'Failed to generate OTP. Please try again.',
    };
  }
}

export async function verifyOrderOtp(
  rawPhone: string,
  code: string
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const cleanedPhone = rawPhone.replace(/\s+/g, '');
    const stored = otpStore.get(cleanedPhone);

    if (!stored) {
      return {
        success: false,
        message: 'No verification request found for this phone number. Please click "Send OTP".',
      };
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(cleanedPhone);
      return {
        success: false,
        message: 'OTP verification code has expired. Please request a new code.',
      };
    }

    if (stored.code !== code.trim()) {
      return {
        success: false,
        message: 'Incorrect 4-digit OTP code. Please check your SMS.',
      };
    }

    // Mark as verified by deleting consumed OTP
    otpStore.delete(cleanedPhone);
    return {
      success: true,
      message: 'Phone number verified successfully!',
    };
  } catch (error) {
    console.error('verifyOrderOtp Error:', error);
    return {
      success: false,
      message: 'Verification failed. Please try again.',
    };
  }
}
