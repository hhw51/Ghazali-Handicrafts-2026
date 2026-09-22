'use server';

import { createAdminClient } from '@/lib/supabase/admin';

// In-memory OTP store for session verification (phone -> { code, expiresAt })
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function sendOrderOtp(
  rawPhone: string,
  channel: 'whatsapp' | 'sms' = 'whatsapp'
): Promise<{
  success: boolean;
  message: string;
  mockCode?: string;
}> {
  try {
    const cleanedPhone = rawPhone.replace(/\s+/g, '');

    // Strict phone format validation: ^\+923\d{9}$
    const phoneRegex = /^\+923\d{9}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      return {
        success: false,
        message: 'Invalid Pakistan phone number. Format must be +923XXXXXXXXX',
      };
    }

    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAtMs = Date.now() + 5 * 60 * 1000; // 5 minutes
    const expiresAtIso = new Date(expiresAtMs).toISOString();

    // Store in memory
    otpStore.set(cleanedPhone, { code: generatedCode, expiresAt: expiresAtMs });

    // Invalidate old codes and insert new 4-digit code into Supabase phone_verifications
    try {
      const supabase = createAdminClient();
      await supabase.from('phone_verifications').delete().eq('phone', cleanedPhone);
      await supabase.from('phone_verifications').insert({
        phone: cleanedPhone,
        code: generatedCode,
        expires_at: expiresAtIso,
        created_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('Supabase phone_verifications table notice:', dbErr);
    }

    const messageText = `Your Ghazali Handicrafts verification code is ${generatedCode}. Valid for 5 minutes.`;

    // --- Channel A: WhatsApp via Baileys Worker ---
    if (channel === 'whatsapp') {
      const whatsappWorkerUrl = process.env.WHATSAPP_WORKER_URL;
      if (whatsappWorkerUrl && whatsappWorkerUrl.trim().length > 0) {
        try {
          const waRes = await fetch(whatsappWorkerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: cleanedPhone,
              message: messageText,
            }),
          });

          if (waRes.ok) {
            return {
              success: true,
              message: `Code sent via WhatsApp`,
            };
          } else {
            console.error('WhatsApp Worker Error:', await waRes.text());
          }
        } catch (waErr) {
          console.error('WhatsApp Worker exception:', waErr);
        }
      }
    }

    // --- Channel B: Regular SMS via Android Gateway ---
    if (channel === 'sms') {
      const androidSmsUrl = process.env.ANDROID_SMS_GATEWAY_URL;
      const smsUser = process.env.ANDROID_SMS_USER || process.env.ANDROID_SMS_GATEWAY_USER;
      const smsPass = process.env.ANDROID_SMS_PASS || process.env.ANDROID_SMS_GATEWAY_PASSWORD;

      if (androidSmsUrl && androidSmsUrl.trim().length > 0) {
        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };

          if (smsUser && smsPass) {
            headers['Authorization'] = `Basic ${Buffer.from(`${smsUser}:${smsPass}`).toString('base64')}`;
          }

          const smsRes = await fetch(androidSmsUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              phoneNumbers: [cleanedPhone],
              textMessage: {
                text: messageText,
              },
            }),
          });

          if (smsRes.ok) {
            return {
              success: true,
              message: `Code sent via SMS`,
            };
          } else {
            console.error('Android SMS Gateway Error:', await smsRes.text());
          }
        } catch (smsErr) {
          console.error('Android SMS Gateway exception:', smsErr);
        }
      }
    }

    // --- Fallback for Local Dev / Testing or Unconfigured Gateways ---
    console.log(`\n==================================================`);
    console.log(`📱 [GHAZALI OTP ${channel.toUpperCase()}] Phone: ${cleanedPhone} | OTP Code: ${generatedCode}`);
    console.log(`==================================================\n`);

    return {
      success: true,
      message: `Code sent via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}`,
      mockCode: generatedCode,
    };
  } catch (error) {
    console.error('sendOrderOtp Error:', error);
    return {
      success: false,
      message: 'Failed to dispatch code.',
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
    const cleanCode = code.trim();

    // 1. Check memory store first
    const stored = otpStore.get(cleanedPhone);
    if (stored) {
      if (Date.now() > stored.expiresAt) {
        otpStore.delete(cleanedPhone);
        return {
          success: false,
          message: 'OTP verification code has expired. Please request a new code.',
        };
      }

      if (stored.code === cleanCode) {
        otpStore.delete(cleanedPhone);
        return {
          success: true,
          message: 'Phone number verified successfully!',
        };
      }
    }

    // 2. Check Supabase phone_verifications table
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('phone_verifications')
        .select('*')
        .eq('phone', cleanedPhone)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        if (new Date(data.expires_at).getTime() < Date.now()) {
          return {
            success: false,
            message: 'OTP verification code has expired. Please request a new code.',
          };
        }

        if (data.code === cleanCode) {
          await supabase.from('phone_verifications').delete().eq('phone', cleanedPhone);
          return {
            success: true,
            message: 'Phone number verified successfully!',
          };
        }
      }
    } catch (dbErr) {
      console.warn('Supabase verification check notice:', dbErr);
    }

    if (stored && stored.code !== cleanCode) {
      return {
        success: false,
        message: 'Incorrect 4-digit OTP code. Please check your messages.',
      };
    }

    return {
      success: false,
      message: 'No active verification request found for this phone number. Please click "Send OTP".',
    };
  } catch (error) {
    console.error('verifyOrderOtp Error:', error);
    return {
      success: false,
      message: 'Verification failed. Please try again.',
    };
  }
}
