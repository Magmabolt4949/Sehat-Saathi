/**
 * Real, user-initiated share helpers. Every URL here opens a genuine OS/browser
 * mechanism (dialer, WhatsApp, SMS, clipboard) that the person themselves completes —
 * Sehat Saathi never transmits anything on its own.
 */

/**
 * Belt-and-suspenders check that a phone value actually looks like a phone number
 * before it's ever rendered as a tel: link, even though the model is instructed to
 * only fill it from a real search result. Deliberately permissive (digits, spaces,
 * +, -, (), min 7 digits) rather than country-specific, since numbers come from
 * anywhere in India (and occasionally abroad).
 */
export function looksLikePhoneNumber(phone: string | null | undefined): phone is string {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && /^[\d\s()+-]+$/.test(phone.trim());
}

export function buildTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function buildWhatsAppUrl(message: string, phone?: string | null): string {
  const base =
    phone && looksLikePhoneNumber(phone)
      ? `https://wa.me/${phone.replace(/\D/g, "")}`
      : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildSmsUrl(message: string, phone?: string | null): string {
  const target = phone && looksLikePhoneNumber(phone) ? phone.replace(/[^\d+]/g, "") : "";
  return `sms:${target}?body=${encodeURIComponent(message)}`;
}
