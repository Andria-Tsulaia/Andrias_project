import type { Currency } from "@/api/types";

const CURRENCY_SYMBOL: Record<Currency, string> = { GEL: "₾" };

/** 2650 → "2 650 ₾" */
export function formatPrice(value: number, currency: Currency = "GEL"): string {
  const amount = new Intl.NumberFormat("ka-GE", { maximumFractionDigits: 0 }).format(value);
  return `${amount} ${CURRENCY_SYMBOL[currency]}`;
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("ka-GE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** "4242424242424242" → "4242 4242 4242 4242" */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

/** "1229" → "12/29" */
export function formatCardExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** Luhn-ის ალგორითმი — ბარათის ნომრის ვალიდაცია */
export function passesLuhn(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

/** "12/29" ვადაგასულია თუ არა (ბარათი მოქმედებს თვის ბოლომდე) */
export function isExpiryInPast(expiry: string): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry.trim());
  if (!match) return true;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return true;
  const endOfMonth = new Date(year, month, 1);
  return endOfMonth <= new Date();
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}
