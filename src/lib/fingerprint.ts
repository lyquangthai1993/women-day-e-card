import FingerprintJS from '@fingerprintjs/fingerprintjs';

export async function getDeviceFingerprint(): Promise<string> {
  if (typeof window === 'undefined') return 'server_render';

  try {
    let localId = localStorage.getItem('ecard_device_uuid');
    if (!localId) {
      localId = 'dev_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('ecard_device_uuid', localId);
    }

    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId || localId;
  } catch (err) {
    console.warn("Fingerprint error fallback:", err);
    return localStorage.getItem('ecard_device_uuid') || 'dev_fallback_' + Math.random().toString(36).substring(2, 8);
  }
}
