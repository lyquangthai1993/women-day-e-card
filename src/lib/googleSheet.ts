export const GOOGLE_SHEET_API_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_API_URL || "https://script.google.com/macros/s/AKfycbzLPgJ2B3Wy3H3tBOXvdHlNoeciFY7tVDmV_OtLbM1gUch5BIif1_ByNGaH4DwA7NTz1g/exec";

export interface SheetPayload {
  action: 'create_card' | 'claim_icecream';
  visitorId: string;
  sender?: string;
  receiver?: string;
  relationship?: string;
  message?: string;
  timestamp?: string;
}

export async function syncToGoogleSheet(payload: SheetPayload): Promise<void> {
  if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.trim() === '') {
    return;
  }

  try {
    await fetch(GOOGLE_SHEET_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString()
      }),
    });
  } catch (err) {
    console.warn("Google Sheet sync notice:", err);
  }
}
