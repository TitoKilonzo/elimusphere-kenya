/**
 * M-Pesa Daraja integration.
 *
 * Shaped around Safaricom's real STK Push (Lipa Na M-Pesa Online) contract:
 *   1. OAuth: POST /oauth/v1/generate -> { access_token }
 *   2. STK Push: POST /mpesa/stkpush/v1/processrequest
 *   3. Safaricom calls back to our CallBackURL with the result.
 *
 * Until real MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET / MPESA_SHORTCODE /
 * MPESA_PASSKEY are supplied, requests run in simulated mode so the rest of
 * the product (UI, receipts, ledger) can be fully exercised end to end -
 * this mirrors the brief's "M-Pesa sandbox integration" Phase 1 milestone.
 */

const DARAJA_BASE_URL = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

export function isMpesaConfigured(): boolean {
  return Boolean(
    process.env.MPESA_CONSUMER_KEY &&
    process.env.MPESA_CONSUMER_SECRET &&
    process.env.MPESA_SHORTCODE &&
    process.env.MPESA_PASSKEY
  );
}

function normalizeMsisdn(phone: string): string {
  // Accepts 07XXXXXXXX, +254XXXXXXXXX, or 254XXXXXXXXX -> returns 254XXXXXXXXX
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0')) return '254' + digits.slice(1);
  if (digits.startsWith('7') || digits.startsWith('1')) return '254' + digits;
  return digits;
}

async function getAccessToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY!;
  const secret = process.env.MPESA_CONSUMER_SECRET!;
  const credentials = Buffer.from(`${key}:${secret}`).toString('base64');

  const res = await fetch(`${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  });
  if (!res.ok) {
    throw new Error('Could not authenticate with the M-Pesa gateway.');
  }
  const data = await res.json();
  return data.access_token;
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export interface StkPushResult {
  success: boolean;
  message: string;
  reference: string;
  status: 'Pending' | 'Completed' | 'Failed';
  checkoutRequestId?: string;
  timestamp: string;
}

export async function initiateStkPush(params: {
  phone: string;
  amount: number;
  accountReference: string;
  description: string;
}): Promise<StkPushResult> {
  const { phone, amount, accountReference, description } = params;
  const msisdn = normalizeMsisdn(phone);

  if (!/^254\d{9}$/.test(msisdn)) {
    return {
      success: false,
      message: 'Please enter a valid Safaricom number, e.g. 0712345678.',
      reference: '',
      status: 'Failed',
      timestamp: new Date().toISOString(),
    };
  }

  if (!isMpesaConfigured()) {
    // Simulated sandbox flow: lets Phase 1 (auth, PWA shell, billing UI)
    // be fully exercised before real Daraja credentials are provisioned.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const ref = 'ELM' + Math.random().toString(36).substring(2, 8).toUpperCase();
    return {
      success: true,
      message: `M-Pesa STK Push of KES ${amount} sent to ${phone}. (Simulated - add Daraja credentials to process real payments.)`,
      reference: ref,
      status: 'Completed',
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const accessToken = await getAccessToken();
    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const ts = timestamp();
    const password = Buffer.from(`${shortcode}${passkey}${ts}`).toString('base64');

    const res = await fetch(`${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: ts,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: msisdn,
        PartyB: shortcode,
        PhoneNumber: msisdn,
        CallBackURL: process.env.MPESA_CALLBACK_URL || `${process.env.APP_URL || ''}/api/mpesa/callback`,
        AccountReference: accountReference.slice(0, 12),
        TransactionDesc: description.slice(0, 13),
      }),
    });

    const data = await res.json();
    if (!res.ok || data.ResponseCode !== '0') {
      return {
        success: false,
        message: data.errorMessage || data.ResponseDescription || 'M-Pesa declined this request.',
        reference: '',
        status: 'Failed',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      message: 'STK Push sent. Enter your M-Pesa PIN on your phone to complete payment.',
      reference: data.CheckoutRequestID,
      checkoutRequestId: data.CheckoutRequestID,
      status: 'Pending',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Could not reach the M-Pesa gateway. Please try again.',
      reference: '',
      status: 'Failed',
      timestamp: new Date().toISOString(),
    };
  }
}
