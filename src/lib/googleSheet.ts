export const GOOGLE_SHEET_API_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_API_URL || "https://script.google.com/macros/s/AKfycbwsYK4ytA6EiN3jUA_OIdKD5v-9xkfROHkPVq-7BQ5Y7VAcjpwrUnOopZRxEn46kO9UiA/exec";

export interface SheetPayload {
  action: 'create_card' | 'claim_icecream' | 'save_card' | 'update_card';
  cardId?: string;
  cardUrl?: string;
  visitorId: string;
  sender?: string;
  receiver?: string;
  relationship?: string;
  message?: string;
  language?: string;
  timestamp?: string;
}

export interface GoogleSheetCardData {
  cardId: string;
  cardUrl?: string;
  createdAt: string;
  updatedAt: string;
  visitorId: string;
  sender: string;
  receiver: string;
  relationship: string;
  message: string;
  language: string;
}

export async function syncToGoogleSheet(payload: SheetPayload): Promise<{ status: string; action?: string; cardId?: string } | null> {
  if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.trim() === '') {
    return null;
  }

  try {
    const res = await fetch(GOOGLE_SHEET_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString()
      }),
    });
    return await res.json();
  } catch (err) {
    console.warn("Google Sheet sync notice:", err);
    return null;
  }
}

export async function getCardFromGoogleSheet(cardId: string): Promise<GoogleSheetCardData | null> {
  if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.trim() === '' || !cardId) {
    return null;
  }

  try {
    const fetchOptions: RequestInit = typeof window === 'undefined'
      ? ({ next: { revalidate: 300, tags: [`card-${cardId}`, 'cards'] } } as any)
      : { cache: 'default' };

    const res = await fetch(`${GOOGLE_SHEET_API_URL}?action=get_card&id=${encodeURIComponent(cardId)}`, fetchOptions);
    const json = await res.json();
    if (json && json.status === 'success' && json.data) {
      return json.data as GoogleSheetCardData;
    }
  } catch (err) {
    console.warn("Error fetching card from Google Sheet:", err);
  }
  return null;
}
