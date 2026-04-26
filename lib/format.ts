/**
 * Currency and date formatting utilities for Indonesian locale.
 */

/**
 * Format number as Indonesian Rupiah (e.g., Rp 10.000)
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with dots separator (e.g., 10.000)
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(amount);
}

/**
 * Format date to Indonesian locale (e.g., 25 Apr 2026, 23:41)
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

/**
 * Format date short (e.g., 25 Apr 2026)
 */
export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

/**
 * Format relative time (e.g., "2 jam lalu")
 */
export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return formatDateShort(dateString);
}

/**
 * Mask phone number for display (e.g., 0812****5678)
 */
export function maskPhone(phone: string): string {
  if (phone.length < 8) return phone;
  return phone.slice(0, 4) + "****" + phone.slice(-4);
}
